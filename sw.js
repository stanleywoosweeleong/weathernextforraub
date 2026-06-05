// ============================================================
// WeatherNext Service Worker
// Version 1.3.14 — LOWLAND RAUB. ROUND-2 SWEEP: probability vs measurable-hour.
// A second adversarial sweep (favourites multi-day, confidence wording, boundaries)
// found one residual contradiction: a low headline probability (e.g. 雨 20%) sitting
// above a real heavy rain hour (3pm 大雨 6mm) AND the new "models agree: rain
// likely" marker — the v1.3.12 floor only nudged pp when rv≥1mm, so a low-pp/zero-rv
// day with a real rain HOUR slipped through. Extended the floor to the concrete
// hourly signal: scan the broadcast window once for the heaviest displayable hour,
// then floor the DISPLAYED probability — rv≥1mm→≥5%, any ≥0.7mm hour→≥60%, any ≥2mm
// hour→≥80% (capped 100, never lowered). Headline now always agrees with the rain
// shown below it and with the confidence marker. The same single hourly scan also
// drives the trace-tag suppression (no '微量' beside a real rain hour). Verified:
// light-drizzle days floor gently to 60% (not over-claimed), genuinely dry days stay
// put, past-storm suppression and trace/drizzle reconciliation all still hold.
// bump CACHE_VERSION on each release
// Version 1.3.13 — LOWLAND RAUB. CONFIDENCE MARKER NOW SAYS WHAT IT AGREES ON.
// The high-agreement marker was a bare "~ 模型一致 / Models agree" — meaningless in
// isolation (agree on WHAT?), left hanging with no referent. Now it states the
// actionable takeaway for the day and always matches the rest of the message:
//   wet day → "~ 模型一致：很可能有雨 / Models agree: rain is likely"
//   dry day → "~ 模型一致：大致无雨 / Models agree: mostly dry"
// 'wet' = pp ≥ 50% OR rv ≥ 1mm OR a measurable (≥0.7mm) hour exists; else 'dry'.
// So when models agree rain is likely, the marker reinforces the rain shown in the
// hourly list / drizzle line below it instead of floating. Bilingual mode adds the
// Malay reading (guarded against ms-owner duplication). Storm days still fold
// confidence into the storm-maybe line's (较确定)/(不确定) tag as before.
// bump CACHE_VERSION on each release
// Version 1.3.12 — LOWLAND RAUB. CONTRADICTION SWEEP (3 fixes). An adversarial
// permutation sweep surfaced three message contradictions:
//  (1) PAST STORM WINDOW: an afternoon send showed "可能有暴雨时段 8AM-10AM" for a
//      storm window that had already passed (plus the matching storm-maybe hourly
//      line). Gated BOTH the summary storm clause and the hourly storm-maybe line
//      to the broadcast window — they now appear only when the trigger window
//      overlaps the hours being broadcast (same principle as the fog gate).
//  (2) 雨 0% WITH RAIN: the daily probability (pp) and amount (rv) are separate
//      model fields and occasionally pp rounds to 0% on a day with real rain
//      (rv ≥ 1mm / measurable hours), printing "雨 0%" above "(5mm/D)". Now floors
//      the DISPLAYED probability to 5% when rain is genuinely present — honest
//      ">0%", never an invented high number.
//  (3) MISLEADING 微量: the trace tag fired on pp≥50% + rv<1mm even when a single
//      hour actually showed measurable (≥0.7mm) rain. Now suppressed when the
//      window contains a displayable hour; still shown for genuinely sub-floor days.
// bump CACHE_VERSION on each release
// Version 1.3.11 — LOWLAND RAUB. Reworded the ms thin-rain line to 'Mungkin hujan
// merintik-rintik' (was the longer 'Hujan renyai sepanjang hari (tiada jam hujan
// lebat)') — the natural Malay match for 丝丝细雨. All three thin-rain lines now
// share the same brief 'possible drizzle' register: zh 可能有丝丝细雨 / en Possible
// drizzle through the day / ms Mungkin hujan merintik-rintik.
// bump CACHE_VERSION on each release
// Version 1.3.10 — LOWLAND RAUB. Reworded the en thin-rain line to 'Possible
// drizzle through the day' (was 'Light rain spread through the day (no heavy
// hour)') — 'drizzle' is the lighter register that fits this sub-0.7mm/h case and
// avoids clashing with the hourly 'Light Rain' tier. zh (可能有丝丝细雨)/ms unchanged.
// bump CACHE_VERSION on each release
// Version 1.3.9 — LOWLAND RAUB. Reworded the zh thin-rain line to the more natural
// '可能有丝丝细雨' (was '全天零星小雨（无明显大雨时段）'). en/ms unchanged.
// bump CACHE_VERSION on each release
// Version 1.3.8 — LOWLAND RAUB. THIN-RAIN RECONCILIATION. A clarity sweep across
// many simulated permutations surfaced a contradiction: when the daily summary
// showed real rain (e.g. "雨 80% (8mm/D)") but the rain was spread so thin that no
// single hour cleared the 0.7mm hourly display floor, the hourly section printed a
// flat "没有下雨 / No rain" — directly contradicting the line above it. Added a
// 'spreadThin' vocab line (zh/en/ms): when there's no displayable hour but the day
// indicates meaningful rain (rv ≥ 1mm OR pp ≥ 50%), the hourly now reads "全天零星
// 小雨（无明显大雨时段） / Light rain spread through the day (no heavy hour) / Hujan
// renyai sepanjang hari (tiada jam hujan lebat)" instead of denying rain. Genuinely
// dry days (low rv AND low pp) still say "no rain"; storm-flagged days still use the
// storm-maybe line (that branch takes priority). bump CACHE_VERSION on each release
// Version 1.3.7 — LOWLAND RAUB. SINGLE-LANGUAGE MALAY HOURLY FIX. In a
// single-language broadcast sent with a MALAY greeting (and no per-location
// override), the daily summary rendered in Malay but the HOURLY rain labels fell
// back to Chinese — the top-label picker only branched English-vs-Chinese
// (locLang==='en'?cls.en:cls.zh), never Malay. So a Malay broadcast showed
// "2pm 中雨" instead of "2pm Hujan sederhana". Added the Malay branch to the
// hourly label, the no-rain line, and the no-data line. Also guarded all bilingual
// second-pass lines (hourly, no-rain, no-data, storm-maybe) with locLang!=='ms' so
// a Malay-owner farm in bilingual mode doesn't double its Malay text — matching
// the fog-tag guard from v1.3.1. Chinese/English single-language and normal
// bilingual output unchanged. bump CACHE_VERSION on each release
// Version 1.3.6 — LOWLAND RAUB. CROSSOVER-NOTE EMOJI REMOVED. Dropped the 🕛 clock
// glyph from the afternoon midnight-crossover note (zh/en/ms). Same old-device
// compatibility reasoning as the fog tags (v1.3.5): 🕛 is Emoji 1.0 (2015) and
// shows as a blank box on older OSes across the WhatsApp audience. The note now
// reads as plain text ('12am 之后为明天预报' / 'Selepas 12am untuk ramalan esok' /
// 'After 12am is tomorrow's forecast'). bump CACHE_VERSION on each release
// Version 1.3.5 — LOWLAND RAUB. FOG TAG EMOJI REMOVED. Dropped the 🌫️ glyph from
// the broadcast fog tags (all 5 wording variants × zh/en/ms). The fog emoji is
// Emoji 1.0 (2015) and renders as a blank box / tofu on older device OSes still
// in use across the WhatsApp recipient base (pre-2016 Android, some feature
// phones) — a blank box next to a safety line is worse than none. The wording is
// self-explanatory and renders identically everywhere; this also matches the rest
// of the broadcast (storm clause and hourly rain lines already carry no emoji).
// Only the broadcast VOCAB tags changed — the in-app on-screen fog banner and the
// disease-list icon keep their glyphs (rendered by the app, not sent over
// WhatsApp). bump CACHE_VERSION on each release
// Version 1.3.4 — LOWLAND RAUB. FOG-BEFORE-STORM ORDER. The daily summary listed
// the afternoon storm window ABOVE the dawn fog tag — backwards chronologically
// (fog is a dawn hazard, the storm an afternoon one). Reordered so the fog tag
// appears first, then the storm clause, matching the order events actually occur
// through the day. The old trailing "," that linked the rain summary to the storm
// clause is dropped (fog now sits between them); storm-only and fog-only days
// still read cleanly. bump CACHE_VERSION on each release
// Version 1.3.3 — LOWLAND RAUB. FAVOURITES OVERNIGHT DEDUP. In the favourites
// (3-day) broadcast sent in the afternoon (12 PM–6 PM), day 1's smart window ran
// through tomorrow 03:00 while day 2 already rendered the FULL tomorrow — so
// tomorrow's 00:00–03:00 rain hours were listed TWICE: once as the day-1
// "明天 12am…" tail, then again at the top of the day-2 block. Added a capToToday
// option to computeWindow; favourites day 1 now stops at today 23:00 (no tomorrow
// spill). Those hours appear once, under the 明天: heading where they belong. The
// 1-day modes (allStable / allStableHourly) are unchanged — they have no day-2 to
// carry the overnight hours, so their spill-to-3am is the only place those hours
// appear and must stay. bump CACHE_VERSION on each release
// Version 1.3.2 — LOWLAND RAUB. AFTERNOON MIDNIGHT-CROSSOVER NOTE. Afternoon
// broadcasts (12 PM–6 PM MYT) use a smart hourly window that runs from the
// current hour through TOMORROW 03:00, so the list ends with 12am/1am/2am/3am
// hours belonging to tomorrow. Those lines already carry a 明天/Esok prefix, but
// some farmers still read the small-hours tail as tonight. Added a short header
// note under the greeting — '🕛 12am 之后为明天预报' / 'Selepas 12am untuk ramalan
// esok' / 'After 12am is tomorrow's forecast' — in the greeting language. Shown
// ONLY when the window actually crosses midnight (afternoon sends); morning
// sends end at 23:00 and after-6PM sends are wholly tomorrow (already tagged
// (明日)/(Esok)/(Tomorrow) in the header). bump CACHE_VERSION on each release
// Version 1.3.1 — LOWLAND RAUB. BILINGUAL FOG LANGUAGE FIX. In the daily
// bilingual broadcast (allStableHourly) the daily summary line — and the fog tag
// riding on it — was emitted in ONE language: getLocLang(), which falls back to
// the broadcaster's GREETING-language pick when a location has no per-location
// override. So picking a Malay greeting made a Chinese-owner farm receive a
// Malay-ONLY fog warning, with no Chinese and no translation — the opposite of
// what the bilingual report is for. Two-part fix: (1) in bilingual mode the
// PRIMARY language is now the owner's (per-location override, else app default
// zh), never the transient greeting choice; (2) the fog tag is emitted in that
// primary language PLUS a Malay translation below (matching the hourly top+Malay
// pattern), skipping the duplicate when the location is already Malay. The
// window-aware gating from v1.3.0 also now applies in bilingual mode, so the
// past-dawn-fog problem is fixed here too. Single-language modes (favorites,
// allStable) are unchanged — there the greeting pick correctly IS the message
// language. bump CACHE_VERSION on each release
// Version 1.3.0 — LOWLAND RAUB. BROADCAST FOG FIX. The dawn-fog tag in the
// WhatsApp broadcast was driven by computeFog scoring the WHOLE 24h day, so an
// afternoon broadcast (e.g. just after 1 PM) printed "🌫️ 清晨浓雾 — 小心驾驶 /
// dense dawn fog — drive slow" for a dawn that had ALREADY PASSED. Sitting right
// under the greeting, recipients read it as a forecast for the hours ahead, then
// the smart-window hourly list below (1 PM → 3 AM tomorrow) showed no morning at
// all — confusing. Fix: buildDayLine now takes the same window options the hourly
// timeline uses and only emits the fog tag when foggy hours actually fall INSIDE
// the broadcast window. Morning broadcasts still warn (dawn ahead); afternoon
// broadcasts no longer warn about a past dawn. Full-day future days (favorites
// days 2-3) keep the dawn tag since their whole day is upcoming. The dawn-hour
// count that drives the "drive slow" severity wording is also now intersected
// with the window. bump CACHE_VERSION on each release
// Version 1.2.9 — LOWLAND RAUB. Added per-farm coordinates to the AI prompt (kept location name). bump CACHE_VERSION on each release
// Version 1.2.8 — LOWLAND RAUB. v1.1.0 rebased onto the Cameron Highlands
// architecture (microclimate disease-risk engine, fog engine, 29-crop master
// list) and recalibrated for hot lowland conditions. v1.1.1: lowland-localized
// the ms/ta/my/zh help-card text (climate/terrain wording), and fixed the VPD
// chart scale (VPD_FULL 2.5→4.0) so high lowland afternoon VPD no longer
// saturates the band and collides dots with labels. v1.1.2: fixed the ET0
// row header losing its help "?" icon on re-render, and the ET0 help card not
// switching language with the rest of the UI. v1.1.3: VPD chart now draws the
// midday and 8AM lines in two separate vertical bands (row 54→68px) so the red
// midday values no longer crowd the faint blue 8AM line/labels. v1.1.4: the
// CAPE/CIN storm card's terrain note is now COORDINATE-AWARE — it auto-detects
// the nearest mountain range (Titiwangsa / Crocker / Iran) and which side it sits
// on from each farm's lat/lng, or shows a coastal note if none is near. Works
// across the whole app family with no per-build editing. v1.1.5: the fog help
// card now also refreshes its text on language switch (was missing from the
// open-card refresh list); audited all 10 help rowTypes — list is now complete.
// v1.1.6: fixed an Uncaught TypeError (Cannot read 'classList' of null) in
// toggleHelpCard — the header re-render recreates the help "?" icon span, so the
// open/close paths now null-guard the icon (icon?.classList) since card and icon
// are independent DOM nodes. v1.1.7: accessibility — added `for` attributes to
// the 5 edit/profile-modal <label>s so each associates with its form field
// (inputs already had aria-labels; this clears the DevTools a11y warning).
// v1.2.0 (FEATURE): Phase-2 lowland disease models — TWO TIERS gated by each
// crop's p2 flag. Tier A daily weather-driven scores: Phytophthora (durian/
// pepper/citrus, rain+soil-moisture+drainage), rice blast (leaf-wetness+RH+
// temp), Sigatoka (banana, leaf-wetness+RH+temp). Tier B standing soil
// advisories (NO daily score): Ganoderma (oil palm), Fusarium/Panama (banana).
// All grounded in published tropical agronomy but NOT field-validated — surfaced
// via the AI agronomist context with a 'field estimate, tell us if wrong'
// framing (growers are the validation layer). v1.2.1: the Phytophthora model
// now reads ACTUAL root-zone soil moisture (9–27cm) as its heaviest driver
// (was a rain-only proxy) — so it stays elevated for days after rain when the
// surface is dry but roots are still saturated (the active infection window).
// Graceful fallback to the rain-proxy when soil data is absent. v1.2.2: the
// WhatsApp BROADCAST report is now sorted by pure GPS — NORTH→SOUTH then
// WEST→EAST — matching the old Raub order the audience knows (was inheriting
// the home list's elevation-high→low sort, meaningless in the flat lowlands).
// The on-screen list keeps its own ordering; only the broadcast changed.
// Applies to ALL THREE broadcast modes (favorites 3-day, all-stable 1-day,
// all-stable hourly bilingual). v1.2.3: also sorted the favorites PRE-FETCH
// order to match, so fetch and display order are consistent across all modes.
// v1.2.7: fixed the AI Smart Briefing greeting addressing the wrong crop owner.
// The SALUTATIONS table was inherited from Cameron with only its 15 veg/fruit
// crops, so Raub's 14 tree/plantation/field crops (durian, oil palm, banana,
// rice, etc.) fell through to the English 'Vegetable Grower' default — and since
// durian is the seed default, every farm was mis-greeted. Added all 14 missing
// crops (5 languages each) and made the fallback LANGUAGE-AWARE (generic '农友/
// Petani/Grower' in the user's own language) so the greeting never silently
// switches to English. v1.2.8: fixed the broadcast's FALSE '数据较旧 / data
// stale' warning. The header age came from getLatestModelRun() — a pure clock
// guess (now-5h floored to 6h) that ignored the actual data and always printed
// '20:00, 9h ago' at ~5:30 AM even when the 1 AM run had been fetched fresh.
// Extracted the freshness pill's REAL model-run logic (live Open-Meteo metadata)
// into computeModelRunFreshness(), now shared by the pill AND the broadcast. The
// async broadcast handler computes it and passes it in; the header shows the true
// run time/age and warns ONLY when data is genuinely stale (older than one 6h
// cycle). Graceful fallback to the clock guess if metadata is unreachable.
// Inherits the Cameron SW
// improvements: inlined pre-built Tailwind (no CDN runtime), and rule #1
// returning a bare `return` for Firebase SDK module requests (blank-screen
// fix). bump CACHE_VERSION on each release
// ============================================================

const CACHE_VERSION = 'wnext-weathernextforraub-202606051900';
const SHELL_CACHE = `${CACHE_VERSION}-shell`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const WEATHER_CACHE = `${CACHE_VERSION}-weather`;

// Files that make up the app shell (offline-ready core)
const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './favicon-32.png',
  './apple-touch-icon.png',
  // External CDN assets — cache so app loads fully offline after first visit.
  // (Tailwind is no longer here — it's now pre-built and inlined in index.html.)
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// ============================================================
// INSTALL — pre-cache the app shell
// ============================================================
self.addEventListener('install', (event) => {
  console.log('[SW] Installing version', CACHE_VERSION);
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => {
        // Use addAll with a fallback per-item to survive a single failure.
        // Cross-origin CDN assets (cdnjs) often lack CORS headers for fetch()
        // pre-caching. Use 'no-cors' mode for them — produces an opaque response
        // which is cacheable but not introspectable (fine for static assets).
        return Promise.allSettled(
          SHELL_ASSETS.map((url) => {
            const isCrossOrigin = url.startsWith('http') && !url.startsWith(self.location.origin);
            const reqInit = isCrossOrigin
              ? { cache: 'reload', mode: 'no-cors', credentials: 'omit' }
              : { cache: 'reload' };
            return cache.add(new Request(url, reqInit)).catch((err) => {
              // Quiet failure — pre-cache is opportunistic, runtime fetch will still work
              console.warn('[SW] Pre-cache skipped for', url, '(will fetch on demand)');
            });
          })
        );
      })
      .then(() => self.skipWaiting())
  );
});

// ============================================================
// ACTIVATE — clean up old cache versions
// ============================================================
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating version', CACHE_VERSION);
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !key.startsWith(CACHE_VERSION))
            .map((key) => {
              console.log('[SW] Deleting old cache:', key);
              return caches.delete(key);
            })
        )
      )
      .then(() => self.clients.claim())
  );
});

// ============================================================
// FETCH — routing strategy per request type
// ============================================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // 1. Firebase, Gemini, Google APIs — do NOT intercept at all.
  //
  // This rule used to do event.respondWith(fetch(request).catch(... JSON 503 ...)).
  // That was a bug: it also caught the Firebase SDK JavaScript module requests
  // (gstatic.com/firebasejs/...). When such a request failed, the SW handed the
  // browser a JSON body; the browser then tried to execute JSON as an ES module,
  // which throws and kills the entire type="module" script — a fully blank page,
  // repeated on every load because the installed SW kept doing it.
  //
  // Fix: don't substitute anything for these requests. Returning here (with no
  // event.respondWith) lets the browser fetch them natively. A real network
  // failure becomes a normal rejected fetch, which the app already handles —
  // never a poisoned JSON module.
  if (
    url.hostname.includes('firebaseio.com') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('firebase') ||
    (url.hostname.includes('gstatic.com') && url.pathname.includes('firebasejs'))
  ) {
    return;
  }

  // 2. Open-Meteo weather API — network-first with cache fallback (stale weather > no weather)
  if (url.hostname.includes('open-meteo.com')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful weather responses for offline fallback
          if (response.ok) {
            const clone = response.clone();
            caches.open(WEATHER_CACHE).then((cache) => {
              cache.put(request, clone);
              // Trim cache to prevent unbounded growth (keep ~30 most recent)
              trimCache(WEATHER_CACHE, 30);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || new Response(
              JSON.stringify({ error: 'offline', hourly: null }),
              { status: 503, headers: { 'Content-Type': 'application/json' } }
            );
          });
        })
    );
    return;
  }

  // 3. Navigation (HTML) — network-first with offline fallback to cached shell
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Update the shell cache with fresh HTML
          if (response.ok) {
            const clone = response.clone();
            caches.open(SHELL_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then((cached) => cached || caches.match('./index.html'))
            .then((fallback) => fallback || caches.match('./'));
        })
    );
    return;
  }

  // 4. CDN scripts (html2canvas) — cache-first (rarely changes).
  // Cross-origin CDNs without CORS headers need no-cors mode to be cacheable.
  if (url.hostname.includes('cdnjs.cloudflare.com') || url.hostname.includes('cdn.tailwindcss.com')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          // Refresh in background (no-cors to handle CORS-restricted CDNs)
          fetch(request, { mode: 'no-cors' }).then((response) => {
            // Opaque responses have status 0 but are still cacheable
            if (response && (response.ok || response.type === 'opaque')) {
              caches.open(SHELL_CACHE).then((cache) => cache.put(request, response));
            }
          }).catch(() => {});
          return cached;
        }
        return fetch(request, { mode: 'no-cors' }).then((response) => {
          if (response && (response.ok || response.type === 'opaque')) {
            const clone = response.clone();
            caches.open(SHELL_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // 5. Everything else (same-origin assets) — stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((response) => {
          if (response.ok && response.type === 'basic') {
            const clone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

// ============================================================
// HELPER — trim cache to max size (LRU-ish)
// ============================================================
async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    // Delete oldest entries (keys() returns insertion order)
    await Promise.all(
      keys.slice(0, keys.length - maxItems).map((key) => cache.delete(key))
    );
  }
}

// ============================================================
// MESSAGE — allow the app to trigger SW updates
// ============================================================
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data === 'CLEAR_CACHE') {
    caches.keys().then((keys) => {
      keys.forEach((key) => caches.delete(key));
    });
  }
});
