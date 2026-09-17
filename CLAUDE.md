# Champions Scout — Pokémon Champions VGC scouting dashboard

Local Windows tool for mid-battle use. MacroDroid on my phone POSTs a team-preview
screenshot (raw body, not multipart) to Flask; the dashboard IDs the six opponent
Pokémon and shows moves / items / abilities / spreads / damage calcs per card.

## Files
- `pokedashboard.py` — Flask server, sprite recognition, cards, damage grid. Imports `vgcfinder` as a library.
- `vgcfinder.py` — builds `vgcfinder_cache.json` from Limitless teamsheets (`play.limitlesstcg.com/api`); also a CLI.
- `damage.py` + `bridge.py` → Node subprocess running `champcalc.js` (`champengine.js` unmodified, `champdata.js` = resolved Champions tables from nerd-of-now/NCP-VGC-Damage-Calculator).
- Data: `index_cache.json` (championsbattledata.com usage), `dex_to_slug.json`, `myteam.json`, `notes.json`, `teamnotes.json`, sprites in `REF_DIR`.
- Run: `python pokedashboard.py` (`--refresh` forces index re-download).

## Hard rules — do not change without asking
- **Exact 6/6 teamsheet matching only.** All six mons are visible in team preview. No subset backoff.
- **Never strip regional prefixes** when bridging names — it silently maps Alolan Raichu onto Raichu.
- Name bridge matches by **token set**, not string (Limitless word order varies: "Wash Rotom" vs `rotom-wash`). Order: norm → `_ALIAS` → exact tokens → superset with only `_NOISE` extras and exactly one candidate → species fallback (logs `[bridge] LOOSE`).
- **Cache saves must be atomic** (`.tmp` + `os.replace`) — the dashboard hot-reloads on mtime.
- **JS stubs in the Node bridge must stay falsy/minimal.** A truthy jQuery stub once applied phantom Ruin abilities (−25% damage) silently.
- Sprite recognition: SIZE=64, raw Euclidean distance, composite onto red `(133,2,52)` background. Don't "improve" to 128 or cosine.
- CSS: `[hidden]{display:none}` must be explicit (`.revrow{display:flex}` overrides it).
- Known and accepted: Basculegion / Meowstic-F always log LOOSE; Calyrex Shadow Rider and Ogerpon masks resolve wrong (n=1) — leave alone.

## Working style
- Run a targeted diagnostic before changing code. No speculative refactors.
- Prefer direct, pragmatic fixes (hardcoded coords, simple lookups) over abstractions.
- Features must serve mid-battle reads.
- `WinError 2` = missing executable on PATH (usually Node). `pip install node` is junk — use nodejs.org / winget.
- PowerShell mangles complex `python -c` one-liners — write a small `.py` file instead.

## Rejected — do not propose
Partner prediction · top-finishes / placings display · subset backoff to 5 or 4 mons · a separate team panel · panel-based card redesign.

## Display config (pokedashboard.py)
`COND_MIN=1`, `COUNT_MODE=10` ("7/8" at small n), `DIVERGE=20`pp, `MOVE_FLOOR=4`, `MOVE_CAP=12`,
`MOVE_MIN_P=5.0`, `FINDER_STALE_DAYS=7`. Spread column is always global (teamsheets have no stat
points), marked with an orange "g". Local/global are both rendered server-side and swapped by CSS
class `.gs`; badge toggle persisted in localStorage `gs:<slug>`.

## In progress: migrating to Regulation M-C (live Sep 9 – Dec 2, 2026)
M-C keeps all M-B mons and adds new ones plus six Megas (Absol Z, Garchomp Z, Lucario Z, Salamence,
Golisopod, Baxcalibur). New sprite PNGs are downloaded.

1. **Teamsheets.** Limitless has no `M-C` format ID yet; M-C events are tagged `CUSTOM` (and some `M-B`).
   Plan: in `build()`, alias `M-C` → fetch `CUSTOM` + `M-B`, keep only events dated ≥ `2026-09-09`,
   store cache format as `"M-C"`. Then `python vgcfinder.py build --format M-C` and set `TEAM_FORMAT="M-C"`.
   The dashboard "teams" button rebuilds whatever format the cache holds, so the first M-C build must be CLI.
   (`formats()` was patched to handle string/dict `formats` from `/games`.)
2. **Sprites/index.** Restart with `--refresh`. Check `REF_DIR` — it's hardcoded to
   `C:/Users/admin/Desktop/pokeicons` but this machine's user is `naksh`.
3. **New PNG resolution.** Verify each new label → `label_to_slug` → in `BY_SLUG`, `DEX_NAME`, `slug_to_key`.
   Likely gaps: `SUFFIX` lacks Toxtricity Low Key, Squawkabilly plumages, Z-Mega naming; `dex_to_slug.json` may lack new dex numbers.
4. **Damage calc.** Watch startup for `[dmg] no dex match:`. If new mons/Megas are missing, re-resolve
   `champdata.js` from the upstream calc's `script_res` — don't hand-edit it.

Game rules / legality / stats: verify against a current source before stating them.
