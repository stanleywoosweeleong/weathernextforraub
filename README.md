# Raub 农友天气 · WeatherNext

A single-file Progressive Web App (PWA) delivering farm weather forecasts and a
**microclimate disease-risk dashboard** for plantation, orchard and field-crop
locations around Raub, Pahang. Multilingual interface (中文 / English / Bahasa
Melayu / தமிழ் / မြန်မာ) with optional AI-generated farming briefings.

Part of the WeatherNext family of per-region agricultural weather builds. This
build runs the WeatherNext microclimate architecture (disease-risk engine + fog
engine), recalibrated for hot lowland conditions.

---

## What's new in this build (v1.1.0 — lowland architecture)

This release rebases Raub onto the fuller WeatherNext microclimate architecture
and recalibrates everything for the lowlands:

- **Microclimate disease-risk dashboard** — per-farm 0–100 risk scores for six
  fungal diseases (Botrytis / gray mould, downy mildew, late blight, powdery
  mildew, early blight, anthracnose), driven by leaf-wetness hours, humidity,
  rain, temperature suitability and a 3-day infection-pressure buildup.
- **29-crop master list for diversification** — the established tree/plantation
  and field crops (durian, oil palm, banana, rice, mango, pepper, cocoa,
  coffee, rubber, citrus, papaya, pineapple, coconut, rambutan …) plus the
  highland-origin vegetable and fruit crops (leafy greens, brassica, capsicum,
  chili, tomato, eggplant, cucurbit, beans, root veg, corn, strawberry, grape,
  tea, flowers). Each farm picks its own crop; risk is scored per crop.
- **Fog engine** — morning river/radiation-mist detection for dawn driving
  safety, and a leaf-wetness contribution to disease pressure. Lowland-weighted:
  no altitude amplifier, reduced fog→disease coupling, more weight on overnight
  RH/dew.
- **Lowland zone model** — each farm is tagged riverine / sheltered-basin /
  open-plain / coastal, which adjusts disease pressure by how long the terrain
  holds leaf wetness.

**Calibration note:** the per-crop susceptibility values are agronomic estimates
calibrated for lowland disease pressure; they are **not field-validated**. They
ship as sensible working defaults and should be reviewed with a qualified
agronomist before being relied on as absolute numbers.

**Coming in Phase 2:** lowland-specific disease models not yet scored —
Phytophthora (durian patch canker / foot rot), Ganoderma (oil-palm basal stem
rot), Fusarium / Panama wilt and Sigatoka (banana), and rice blast / bacterial
leaf blight. Tree/plantation crops therefore score low on the six modelled
diseases by design; the app flags this so a low score is never read as "all
clear" for those crops.

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
farms as you like from inside the app. Each seeded farm carries a default crop
(**durian**) and a terrain zone, both editable in the app.

| English | 中文 | Coordinates | Zone |
|---|---|---|---|
| Sg. Ruan - Fang Goo | 双溪兰 - 晓方 | 3.77883, 101.94133 | riverine |
| Sg. Klau - Fang Goo | 双溪吉流 - 晓方 | 3.71967, 102.01033 | riverine |
| Sg. Klau 1 - CT Tan | 双溪吉流 1 - CT Tan | 3.71700, 102.00550 | riverine |
| Kg. Sg. Ruan - Neng | 双溪兰 - 能 | 3.79361, 101.93472 | riverine |
| Kg. Sg. Ruan - Jerry Phoon | 双溪兰新村 - Jerry Phoon | 3.79194, 101.94278 | riverine |
| Sg. Klau - Kwong Seng | 双溪吉流 - Kwong Seng | 3.74833, 101.95133 | riverine |
| Sg. Klau 2 - CT Tan | 双溪吉流 2 - CT Tan | 3.74417, 101.96917 | riverine |
| Kg. Sg. Klau - Thompson | 双溪吉流新村 - Thompson | 3.74750, 101.97694 | riverine |
| Kg. Sg. Klau - Soon | 双溪吉流新村 - 顺 | 3.78392, 101.98063 | riverine |
| Kampung Temau - Eric | 甘榜德茂 - Eric | 3.92900, 101.92100 | open plain |
| Ulu Gali | 乌鲁加里 | 3.84478, 101.95747 | sheltered basin |
| Kg. Gali | 甘榜加里 | 3.83333, 101.90000 | sheltered basin |
| Jerkoh | 日利谷 | 4.04861, 101.92028 | open plain |
| SJKC Cheroh | 积罗国民型华文学校 | 3.90293, 101.81499 | open plain |
| Kampung Temau - MK | 甘榜德茂 - MK | 3.91778, 101.91944 | open plain |
| Dong - Hong | 东区 - 鸿总 | 4.09056, 101.96611 | sheltered basin |
| Ulu Gali - Jacky Kuan | 乌鲁加里 - Jacky Kuan | 3.83469, 101.91183 | sheltered basin |
| Raub Batu Tiga - James Lye | 劳勿三英里 - James Lye | 3.79275, 101.90389 | open plain |

Two of CT Tan's plots in Sg. Klau are distinct farms at separate
coordinates — seeded as **Sg. Klau 1 - CT Tan** and **Sg. Klau 2 - CT Tan**
so they are easy to tell apart in the app.

The terrain zone (riverine / sheltered basin / open plain / coastal) only
adjusts the disease-risk weighting — riverine and sheltered-basin farms hold
leaf wetness longer, so they carry slightly higher fungal pressure. The zones
above are sensible defaults from the farm names/locations and can be refined.

The app also seeds a default user display name (**Raub**), which stays editable
via **Edit Name** in the app.

*Seed migrations:* farm names were standardised over earlier revisions — the two
CT Tan plots split into **Sg. Klau 1 / 2 - CT Tan**; **Sg. Ruan - Fang Goo**
hyphenated; the Temau village name unified to **德茂**; **Dong - Hong** added.
This build carries the seed version **`rb-arch1`** (the lowland-architecture
seed), which re-applies the 18 farms with their new crop/zone tags. Existing
installs pick this up automatically on their next visit — no need to clear data.
Any farm a user renamed, moved, or otherwise customised themselves is left
untouched (a customised farm is never auto-removed or auto-renamed).

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
uploaded anywhere or committed to this repo. The core weather forecast and the
disease-risk dashboard both work without a key — only the AI briefing needs one.

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

All 7 files live in the **repository root** — the service worker and manifest
use relative `./` paths, so a root deploy works with no changes.

```
index.html            — the app (single file: HTML + inlined CSS + JS)
manifest.json         — PWA metadata
sw.js                 — service worker (offline cache)
icon-512.png          — app icon 512×512
icon-192.png          — app icon 192×192
apple-touch-icon.png  — iOS home-screen icon 180×180
favicon-32.png        — browser tab icon 32×32
```

**Note:** the previous separate `tailwind.css` file is no longer used — Tailwind
is now pre-built and **inlined** directly inside `index.html` (see Tech notes).
If `tailwind.css` is still in the repo from an earlier version, it can be
deleted; nothing references it.

To enable GitHub Pages: **Settings → Pages → Source: Deploy from branch →
`main` / `root`.** Pages serves over HTTPS automatically, which the service
worker requires.

### Updating the app

The service worker caches the app shell. When you push changes, bump the
`CACHE_VERSION` string at the top of `sw.js` so users receive the update on
their next visit. The current value is:

```
wnext-weathernextforraub-202606031146
```

---

## Tech notes

- **Weather data:** Open-Meteo API (no key required, network-first with cache fallback).
- **Disease-risk engine:** rule-based fungal-risk model (6 diseases) using
  Open-Meteo leaf-wetness probability where available, otherwise leaf wetness
  derived from RH / dew-point spread / rain / cloud; adjusted by a per-crop
  susceptibility table, a terrain-zone multiplier and a 3-day infection-pressure
  buildup. Disease temperature bands are tuned for lowland pathogens.
- **AI model:** `gemini-2.5-flash` via the Generative Language API.
- **Storage namespace:** `weathernextforraub__*` keys in `localStorage`,
  isolated from other WeatherNext regional builds so data never collides.
- **Cloud sync:** Firebase, namespaced under `appId: wnext-ag-v41-weathernextforraub`.
- **Offline:** full app shell + last-fetched weather cached by the service worker.
- **Tailwind CSS:** pre-built and **inlined** in `index.html` as a
  `<style id="tw-prebuilt">` block (Tailwind CLI v3, includes preflight) — not
  the runtime CDN script (which is dev-only and logs a production warning) and
  no longer a separate `tailwind.css` file. The inlined stylesheet contains only
  the utility classes this app currently uses. **If you hand-add new Tailwind
  classes to `index.html` later, regenerate the inlined block with the Tailwind
  CLI** (scan `index.html`, output the minified utilities, and replace the
  contents of the `tw-prebuilt` style block) or those classes won't be styled.
  Classes built only inside conditional JS strings are caught by the scanner as
  long as they appear as literal text; otherwise add them to the safelist.
