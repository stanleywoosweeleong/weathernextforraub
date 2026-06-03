# Lowland WeatherNext — Calibration Spec (Raub upgrade to Cameron architecture)

**Purpose:** Upgrade `weathernextforraub` in place to the Cameron Highlands architecture, recalibrated for hot lowland Malaysian conditions, with a merged 29-crop master list so farmers can diversify away from crashed-price crops (durian etc.) into vegetables, strawberry, capsicum and other Highland crops.

**Status:** BUILT — v1.1.0, cache `wnext-weathernextforraub-202606031107` (validated: acorn module parse + headless boot test passed). The susceptibility numbers below are agronomic estimates calibrated from the Cameron table + lowland disease pressure — they are **not field-validated**. Review with a qualified agronomist before relying on absolute values, exactly as with the AgriPro risk formula. The app ships them as working defaults; this doc is the change-list for expert review.

**Scope (agreed):** Phase 1 = full architecture + 29 crops on the existing 6 fungal diseases, lowland-recalibrated. Phase 2 (later) = lowland-specific disease models (Phytophthora, rice blast, Ganoderma, Fusarium wilt, Sigatoka).

---

## 1. The 6 modeled diseases (unchanged set, Phase 1)

| key | EN | ZH | icon |
|-----|-----|-----|------|
| botrytis | Botrytis (Gray Mould) | 灰霉病 | 🍄 |
| downy | Downy Mildew | 霜霉病 | 💧 |
| blight | Late Blight | 晚疫病 | 🥀 |
| powdery | Powdery Mildew | 白粉病 | 🌫️ |
| earlyblight | Early Blight | 早疫病 | 🍂 |
| anthracnose | Anthracnose | 炭疽病 | 🎯 |

**Lowland note:** In the hot lowlands, **anthracnose** and **downy/late blight under heavy rain** dominate; **botrytis** (a cool-temperature gray mould) is far less aggressive than in Cameron, so its baseline weight in scoring is reduced (see §4). Powdery mildew remains relevant in drier spells / protected cropping.

---

## 2. Master crop list — 29 crops (union)

Capsicum (sweet pepper) and chili (hot) kept **separate** per decision.

| # | id | EN label | ZH | origin |
|---|-----|----------|-----|--------|
| 1 | leafy | 🥬 LEAFY VEG | 叶菜类 | both |
| 2 | brassica | 🥬 CABBAGE/BRASSICA | 包菜类 | Cameron |
| 3 | herbs | 🧅 HERBS/ALLIUM | 葱蒜芹菜 | Cameron |
| 4 | tomato | 🍅 TOMATO | 番茄 | both |
| 5 | capsicum | 🫑 CAPSICUM (sweet) | 甜椒 | Cameron |
| 6 | chili | 🌶️ CHILI (hot) | 辣椒 | Raub |
| 7 | cucurbit | 🥒 CUCURBITS | 瓜类 | both |
| 8 | beans | 🫘 BEANS | 豆类 | both |
| 9 | eggplant | 🍆 EGGPLANT | 茄子 | Cameron |
| 10 | root | 🥕 ROOT VEG | 根茎类 | Cameron |
| 11 | corn | 🌽 CORN | 玉米 | both |
| 12 | strawberry | 🍓 STRAWBERRY | 草莓 | Cameron |
| 13 | grape | 🍇 GRAPE | 葡萄 | Cameron |
| 14 | tea | 🍃 TEA | 茶叶 | both |
| 15 | flower | 🌸 FLOWERS | 花卉 | Cameron |
| 16 | durian | 🌳 DURIAN | 榴莲 | Raub |
| 17 | mango | 🥭 MANGO | 芒果 | Raub |
| 18 | banana | 🍌 BANANA | 香蕉 | Raub |
| 19 | pineapple | 🍍 PINEAPPLE | 黄梨 | Raub |
| 20 | coconut | 🥥 COCONUT | 椰子 | Raub |
| 21 | citrus | 🍋 CITRUS | 柑橘 | Raub |
| 22 | papaya | 🍈 PAPAYA | 木瓜 | Raub |
| 23 | rambutan | 🌰 RAMBUTAN | 红毛丹 | Raub |
| 24 | palm | 🌴 OIL PALM | 油棕 | Raub |
| 25 | coffee | ☕ COFFEE | 咖啡 | Raub |
| 26 | rubber | 🌱 RUBBER | 橡胶 | Raub |
| 27 | pepper | 🌶️ PEPPER (black) | 胡椒 | Raub |
| 28 | cocoa | 🍫 COCOA | 可可 | Raub |
| 29 | rice | 🌾 RICE/PADDY | 稻米 | Raub |

(ms / ta / my labels carried over verbatim from the two source apps where the crop already existed; new combined entries get the existing translations — no new translation work needed since every id already exists in one of the two apps.)

---

## 3. Lowland zone model (REPLACES Cameron valley/fog/midslope/ridge)

Cameron's zones were altitude-driven (1135–1610 m). Lowland Raub-type terrain is ~40–300 m. New zones reflect **leaf-wetness retention by terrain/airflow**, not altitude:

| zone | EN label | ZH | multiplier | rationale |
|------|----------|-----|-----------|-----------|
| riverine | Riverine / valley bottom | 河谷(易积湿) | 1.20 | River fog + cold-air drainage, longest overnight leaf wetness (Sg Lipis, paddy edges) |
| lowvalley | Sheltered lowland valley | 低谷(通风差) | 1.10 | Poor airflow basins, slow morning dry-off |
| openplain | Open plain / main belt | 平原(主产区) | 1.00 | Baseline — most orchards & fields |
| coastal | Coastal / breezy | 沿海(通风) | 0.90 | Steady sea breeze dries canopy faster |

**`elevAmp` is removed** (set to constant 1.0). Below ~300 m it has no physical meaning. This was the agreed lowland fog change.

---

## 4. Lowland CROP_SUSCEPT table (all 29 × 6) — DRAFT

Multiplier on raw disease score; 1.0 = baseline. Lowland-calibrated:
- Botrytis values **lowered** vs Cameron (warm lowlands suppress gray mould).
- Anthracnose values **raised** for tree/fruit crops (the dominant warm-wet-climate threat).
- Tree/plantation crops get **honest low values on the 6 modeled diseases** + a Phase-2 flag, because their REAL threats (Phytophthora, Ganoderma, Fusarium, blast) are not yet modeled — see §6. They must NOT read as "all safe."

```
                  botrytis downy blight powdery earlyblight anthracnose  [P2 flag]
// --- VEGETABLES / HIGHLAND CROPS (now grown lowland under cover / cool season) ---
leafy           {  0.85,  1.20,  0.80,  0.95,  0.90,  1.00 }
brassica        {  0.70,  1.30,  0.75,  0.90,  0.90,  0.90 }
herbs           {  0.80,  1.15,  0.75,  1.05,  0.85,  0.95 }
tomato          {  0.85,  0.95,  1.25,  1.00,  1.35,  1.40 }
capsicum        {  0.80,  0.90,  1.00,  1.05,  1.10,  1.40 }   // sweet pepper
chili           {  0.75,  0.90,  0.95,  1.05,  1.05,  1.50 }   // hot chili — anthracnose is #1 lowland threat
cucurbit        {  0.75,  1.30,  0.90,  1.40,  0.95,  1.30 }
beans           {  0.85,  1.10,  0.80,  1.10,  0.90,  1.35 }
eggplant        {  0.80,  0.90,  1.05,  1.10,  1.15,  1.30 }
root            {  0.70,  0.85,  1.00,  0.85,  1.05,  0.95 }
corn            {  0.60,  0.85,  0.70,  0.80,  0.75,  0.95 }
strawberry      {  1.05,  1.00,  0.80,  1.20,  0.75,  1.20 }   // botrytis still real under cover, but < Cameron's 1.30
grape           {  1.00,  1.25,  0.70,  1.35,  0.65,  1.25 }
tea             {  0.55,  0.60,  0.50,  0.65,  0.50,  0.75 }
flower          {  1.00,  1.00,  0.70,  1.25,  0.65,  0.90 }
// --- TREE / FRUIT CROPS (Phase-1 partial: anthracnose modeled, main threats are Phase-2) ---
durian          {  0.50,  0.60,  0.70,  0.60,  0.60,  1.10,  P2:Phytophthora }
mango           {  0.55,  0.65,  0.65,  0.90,  0.60,  1.45,  P2:- }            // anthracnose huge on mango
banana          {  0.50,  0.70,  0.60,  0.55,  0.55,  1.20,  P2:Sigatoka/Fusarium }
pineapple       {  0.50,  0.60,  0.55,  0.55,  0.55,  0.95,  P2:heart-rot }
coconut         {  0.45,  0.55,  0.55,  0.50,  0.50,  0.80,  P2:- }
citrus          {  0.55,  0.70,  0.65,  0.85,  0.60,  1.30,  P2:greening/canker }
papaya          {  0.55,  0.70,  0.70,  0.80,  0.65,  1.40,  P2:- }            // anthracnose on fruit
rambutan        {  0.55,  0.65,  0.65,  0.80,  0.60,  1.30,  P2:- }
palm            {  0.45,  0.55,  0.55,  0.50,  0.50,  0.70,  P2:Ganoderma }
coffee          {  0.55,  0.70,  0.60,  0.85,  0.60,  1.25,  P2:berry-disease/rust }
rubber          {  0.50,  0.65,  0.70,  0.60,  0.55,  0.90,  P2:leaf-fall }
pepper          {  0.55,  0.75,  0.75,  0.80,  0.60,  1.10,  P2:foot-rot }     // black pepper
cocoa           {  0.55,  0.75,  0.80,  0.70,  0.60,  1.20,  P2:black-pod }
rice            {  0.50,  0.70,  0.75,  0.55,  0.60,  0.85,  P2:blast/BLB }
_default        {  1.00,  1.00,  1.00,  1.00,  1.00,  1.00 }
```

**P2 flag** drives a small "⚠ key disease not yet modeled — Phase 2" note on tree-crop cards, so a low 6-disease score is never mistaken for "nothing to watch."

---

## 5. CROP_PRIMARY_DISEASE (which card shows first) — DRAFT

```
strawberry: botrytis    grape: powdery       flower: powdery
tomato: earlyblight     eggplant: earlyblight capsicum: anthracnose
chili: anthracnose      leafy: downy         brassica: downy
cucurbit: powdery       herbs: downy         beans: anthracnose
root: earlyblight       corn: downy          tea: anthracnose
// tree/fruit — anthracnose is the modeled primary (real primary often Phase-2)
durian: anthracnose     mango: anthracnose   banana: anthracnose
pineapple: anthracnose  coconut: anthracnose citrus: anthracnose
papaya: anthracnose     rambutan: anthracnose palm: anthracnose
coffee: anthracnose     rubber: anthracnose  pepper: anthracnose
cocoa: anthracnose      rice: downy
_default: anthracnose   // lowland default = anthracnose (was botrytis in Cameron)
```

---

## 6. Phase-2 disease models — BUILT (v1.2.0)

**Status: BUILT.** Implemented as a TWO-TIER system in `computeDiseaseRisk`, gated by each crop's `p2` flag. All five are **field-calibration estimates grounded in published tropical agronomy, NOT field-validated** — surfaced through the AI agronomist context with an explicit "field estimate — tell us if wrong; trust the grower if it disagrees" framing. In Malaysia certified agronomists are scarce, so experienced growers are the validation layer (same approach as the rainfall thresholds calibrated against 4 yrs of field observation).

**Tier A — daily weather-driven scores (0–100):** attached only to the relevant crop.

| key | EN | crops (p2) | driver model | grounding |
|-----|-----|-------|----------------|-----------|
| phytophthora | Phytophthora (patch canker / foot rot) | durian, pepper(footrot), citrus(canker) | **v1.2.1 uses ACTUAL root-zone soil moisture (9–27cm, m³/m³): saturation term scaled 0.20→0 … 0.45→1.** WITH soil data: today-rain ×0.25 + recent 3-day buildup ×0.25 + soil-saturation ×0.35 + RH ×0.15. WITHOUT soil data (older cache): falls back to rain-proxy (rain ×0.40 + buildup ×0.40 + RH ×0.20). × temp band 24–30°C × drainage-zone mult (riverine 1.25 → coastal 0.9) × pastFactor. Soil is the heaviest single driver — it stays high for DAYS after rain (dry surface, wet root zone = active infection window the old rain-only proxy missed). | ITFNet/TFNet; Vawdrey 2005 (wet 35% vs dry 24%); Drenth & Guest; Open-Meteo soil moisture (grid estimate, not in-field sensor) |
| blast | Rice blast | rice | leaf-wetness (6h→0…14h→1) ×0.55 + RH≥90% step ×0.35 + rain ×0.10, × temp band 22–28°C × zoneMult × pastFactor | UC IPM; Du 2021; Kirtphaiboon 2021; EPIRICE |
| sigatoka | Black/Yellow Sigatoka | banana | leaf-wetness (4h→0…14h→1) ×0.45 + RH≥90% step ×0.35 + rain ×0.20, × temp band 25–30°C × zoneMult × pastFactor | Jacome & Schuh 1992; METOS; Bebber 2019 |

**Tier B — standing soil-borne advisories (NO daily score):** chronic, latent, root/soil diseases that do not respond to daily weather; a daily number would mislead. Returned in `advisories[]`, surfaced as persistent management guidance, not a forecast.

| key | EN | crops | why advisory-only |
|-----|-----|-------|----------------|
| ganoderma | Basal Stem Rot (Ganoderma) | oil palm | soil-borne white-rot, latent, long gestation; spreads via root contact & rotting stumps; ~60% of MY plantations affected. zoneRisk tagged higher in riverine/lowvalley. |
| fusarium | Fusarium / Panama wilt | banana (also Sigatoka above) | soil-borne, persists in soil years, no cure once established; exclusion + clean planting material are the controls |

Verified wet-vs-dry behavior (riverine zone): durian Phytophthora 75 wet / 0 dry; rice blast 100/4; banana Sigatoka 100/2 (+ standing Fusarium advisory both); oil palm — no daily score, Ganoderma advisory only. Engine return adds `phase2{}`, `advisories[]`, `phase2Unvalidated`.

Still NOT individually modeled (kept under the honesty caveat): bacterial leaf blight (rice), citrus greening, coffee berry disease, heart rot (pineapple), black pod (cocoa), abnormal leaf fall (rubber).

---

## 7. Fog engine recalibration (agreed: keep for driving + disease, lowland-weight)

`computeFog` changes:
1. **`elevAmp` → constant 1.0** (remove altitude ramp).
2. **Lower fog→disease coupling.** Cameron treats fog as a heavy disease multiplier. Lowland: fog burns off fast, so its contribution to the leaf-wetness/disease term is reduced (~half weight).
3. **Raise RH + dew-spread weight in leaf-wetness estimation.** Lowland leaf wetness is driven by overnight RH/dew and rain re-wetting in heat, not fog pooling. The non-visibility composite shifts weight toward `satScore`.
4. **Driving-safety output unchanged in structure** — morning radiation fog & river mist are real lowland hazards (Sg Lipis, paddy areas, trunk roads at dawn). The 5-language driving banners stay.
5. **Replace "sea-of-clouds / misty glow" sunrise copy** — that's a Cameron signature. Lowland equivalent: "early river mist, clears after sunrise."

---

## 8. Seeded locations (REPLACE all 15 Cameron locations)

Cameron's 15 highland farms (Ringlet, Brinchang, Kea Farm, BOH Tea, etc.) must be replaced with lowland Raub-area seed locations. The existing lowland Raub app already has its own seed set — **reuse the current `weathernextforraub` seed locations**, just adding the new `zone` field (riverine/lowvalley/openplain/coastal) and an `elev` in the 40–300 m range per location. Need your confirmation of which farms to seed (see open questions).

---

## 9. Other Cameron→lowland copy swaps

- Title: `金马伦农友天气 Cameron WeatherNext` → keep Raub's existing `农友天气 WeatherNext`.
- Boot screen subtitle `金马伦高原 Cameron Highlands` → Raub region name.
- Single-column default ("Cameron has no East-Malaysia farms") — keep Raub's existing layout logic.
- Elevation band labels (1200m/1400m/1600m/1800m) → lowland bands or hide entirely.
- App namespace stays `weathernextforraub`. New `CACHE_VERSION` slug: `wnext-weathernextforraub-<timestamp>`.

---

## 10. Open questions before coding

1. **Seed locations** — reuse the current Raub seed farms as-is, or do you have an updated list with the new zone tags?
2. **`P2 flag` UI** — small ⚠ note on the card (my default), a separate "coming soon" tab, or just omit until Phase 2?
3. **Tea** — Raub has lowland tea? Keeping it but with lowland-suppressed values; confirm it belongs.
4. **Strawberry/grape lowland** — kept with under-cover-realistic values. Confirm these are genuinely being grown lowland (protected/highland-microclimate sheds) so the calibration assumption holds.
