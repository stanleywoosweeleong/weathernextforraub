# Raub 农友天气 · WeatherNext

A single-file Progressive Web App (PWA) delivering farm weather forecasts for
plantation locations around Raub, Pahang. Bilingual interface
(中文 / English) with optional AI-generated farming briefings.

Part of the WeatherNext family of per-region agricultural weather builds.

---

## Live app

Once GitHub Pages is enabled, the app is served at:

```
https://stanleywoosweeleong.github.io/weathernextforraub/
```

Open that link on a phone and use **"Add to Home Screen"** to install it as an
app. It works offline after the first visit (service-worker cached).

---

## Seeded locations

On first launch the app seeds the 18 farms below. They are all auto-favourited
and can be renamed, edited, or deleted freely afterwards. Add as many more
farms as you like from inside the app.

| English | 中文 | Coordinates |
|---|---|---|
| Sg. Ruan - Fang Goo | 双溪兰 - 晓方 | 3.77883, 101.94133 |
| Sg. Klau - Fang Goo | 双溪吉流 - 晓方 | 3.71967, 102.01033 |
| Sg. Klau 1 - CT Tan | 双溪吉流 1 - CT Tan | 3.71700, 102.00550 |
| Kg. Sg. Ruan - Neng | 双溪兰 - 能 | 3.79361, 101.93472 |
| Kg. Sg. Ruan - Jerry Phoon | 双溪兰新村 - Jerry Phoon | 3.79194, 101.94278 |
| Sg. Klau - Kwong Seng | 双溪吉流 - Kwong Seng | 3.74833, 101.95133 |
| Sg. Klau 2 - CT Tan | 双溪吉流 2 - CT Tan | 3.74417, 101.96917 |
| Kg. Sg. Klau - Thompson | 双溪吉流新村 - Thompson | 3.74750, 101.97694 |
| Kg. Sg. Klau - Soon | 双溪吉流新村 - 顺 | 3.78392, 101.98063 |
| Kampung Temau - Eric | 甘榜德茂 - Eric | 3.92900, 101.92100 |
| Ulu Gali | 乌鲁加里 | 3.84478, 101.95747 |
| Kg. Gali | 甘榜加里 | 3.83333, 101.90000 |
| Jerkoh | 日利谷 | 4.04861, 101.92028 |
| SJKC Cheroh | 积罗国民型华文学校 | 3.90293, 101.81499 |
| Kampung Temau - MK | 甘榜德茂 - MK | 3.91778, 101.91944 |
| Dong - Hong | 东区 - 鸿总 | 4.09056, 101.96611 |
| Ulu Gali - Jacky Kuan | 乌鲁加里 - Jacky Kuan | 3.83469, 101.91183 |
| Raub Batu Tiga - James Lye | 劳勿三英里 - James Lye | 3.79275, 101.90389 |

Two of CT Tan's plots in Sg. Klau are distinct farms at separate
coordinates — seeded as **Sg. Klau 1 - CT Tan** and **Sg. Klau 2 - CT Tan**
so they are easy to tell apart in the app.

The app also seeds a default user display name (**Raub**), which stays editable
via **Edit Name** in the app.

*Seed migrations (v3–v6):* farm names have been standardised over several
revisions — the two CT Tan plots split into **Sg. Klau 1 / 2 - CT Tan**;
**Sg. Ruan - Fang Goo** hyphenated; the Temau village name unified to
**德茂** across **Kampung Temau - Eric** and **- MK**. **Kampung Temau - MK**
was briefly removed (v5) then re-added (v6), and **Dong - Hong** was added.
Existing installs pick all of this up automatically on their next visit —
no need to clear data. Any farm a user renamed, moved, or otherwise
customised themselves is left untouched (a customised farm is never
auto-removed or auto-renamed).

---

## API key — bring your own (important)

This app **does not ship with an embedded API key.** AI features (the farming
briefings) are powered by Google's Gemini API, and each user supplies their
own free key.

To enable the AI briefing:

1. Visit https://aistudio.google.com/app/apikey
2. Click **"Create API key"** — it's free.
3. In the app, open the **API Key** modal and paste the key (starts with `AIzaSy...`).

The key is stored only in that device's browser (`localStorage`) and is never
uploaded anywhere or committed to this repo. The core weather forecast works
without a key — only the AI briefing needs one.

**Why no embedded key:** a key bundled into a public web app is visible to
anyone who opens browser DevTools. Google actively scans public repositories
and will automatically disable a key found exposed, which would break the
feature for everyone at once. Keeping keys per-user and per-device avoids that
failure mode entirely.

**Recommended for users:** restrict your key in Google Cloud Console
(Application restrictions → Websites) to `stanleywoosweeleong.github.io/*`,
and limit it to the Generative Language API. This reduces abuse risk if the
key is ever scraped.

---

## Deploying

All 8 files live in the **repository root** — the service worker and manifest
use relative `./` paths, so a root deploy works with no changes.

```
index.html            — the app (single file: HTML + CSS + JS)
manifest.json         — PWA metadata
sw.js                 — service worker (offline cache)
tailwind.css          — pre-built Tailwind utilities (generated, see below)
icon-512.png          — app icon 512×512
icon-192.png          — app icon 192×192
apple-touch-icon.png  — iOS home-screen icon 180×180
favicon-32.png        — browser tab icon 32×32
```

To enable GitHub Pages: **Settings → Pages → Source: Deploy from branch →
`main` / `root`.** Pages serves over HTTPS automatically, which the service
worker requires.

### Updating the app

The service worker caches the app shell. When you push changes, bump the
`CACHE_VERSION` string at the top of `sw.js` so users receive the update on
their next visit. The current value is:

```
wnext-weathernextforraub-202605300000
```

---

## Tech notes

- **Weather data:** Open-Meteo API (no key required, network-first with cache fallback).
- **AI model:** `gemini-2.5-flash` via the Generative Language API.
- **Storage namespace:** `weathernextforraub__*` keys in `localStorage`,
  isolated from other WeatherNext regional builds so data never collides.
- **Cloud sync:** Firebase, namespaced under `appId: wnext-ag-v41-weathernextforraub`.
- **Offline:** full app shell + last-fetched weather cached by the service worker.
- **Tailwind CSS:** pre-built static `tailwind.css` (Tailwind CLI v3), not the
  runtime CDN script — the CDN is dev-only and logs a production warning. After
  adding new utility classes to `index.html`, regenerate with:
  `npx tailwindcss -c tailwind.config.js -i tw-input.css -o tailwind.css --minify`
  Classes built only inside conditional JS strings are caught by the scanner as
  long as they appear as literal text; otherwise add them to `safelist` in
  `tailwind.config.js`.
