# Champions Scout — Pokémon Champions VGC scouting dashboard

Local Windows tool for mid-battle use. MacroDroid on my phone POSTs a team-preview
screenshot (raw body, not multipart) to Flask; the dashboard IDs the six opponent
Pokémon and shows moves / items / abilities / spreads / damage calcs per card.

## Files
- `pokedashboard.py` — Flask server, sprite recognition, cards, damage grid. Imports `vgcfinder` as a library.
- `vgcfinder.py` — builds `vgcfinder_cache.json` from Limitless teamsheets (`play.limitlesstcg.com/api`); also a CLI.
- `damage.py` + `bridge.py` → Node subprocess running `champcalc.js` (`champengine.js` unmodified, `champdata.js` = resolved Champions tables from nerd-of-now/NCP-VGC-Damage-Calculator).
- `resolve_champdata.js` — regenerates `champdata.js` from an upstream `script_res` folder. Generated file; never hand-edit it.
- Data: `index_cache.json` (championsbattledata.com usage), `dex_to_slug.json`, `myteam.json`, `notes.json`, `teamnotes.json`, sprites in `REF_DIR`.
- Run: `python pokedashboard.py` (`--refresh` forces index re-download).

## Hard rules — do not change without asking
- **Exact 6/6 teamsheet matching only.** All six mons are visible in team preview. No subset backoff.
- **Never strip regional prefixes** when bridging names — it silently maps Alolan Raichu onto Raichu.
  A regional form that will not resolve returns `None` (card shows no data); it never falls back to the base.
- **Two naming schemes, both live.** championsbattledata.com switched to Showdown-style suffixes at M-C
  (`ninetales-alola`, `tauros-paldea-aqua`, `farfetch-d`); Limitless still writes adjectives
  (`Hisuian Arcanine`). `_REGION_TOK` folds `hisuian`→`hisui` etc. so the token sets meet. Both halves
  broke silently once — startup now prints the sprite form/base split as a tripwire.
- Name bridge matches by **token set**, not string (Limitless word order varies: "Wash Rotom" vs `rotom-wash`). Order: norm → `_ALIAS` → exact tokens → superset with only `_NOISE` extras and exactly one candidate → species fallback (logs `[bridge] LOOSE`).
- **Cache saves must be atomic** (`.tmp` + `os.replace`) — the dashboard hot-reloads on mtime.
- **JS stubs in the Node bridge must stay falsy/minimal.** A truthy jQuery stub once applied phantom Ruin abilities (−25% damage) silently.
- Sprite recognition: SIZE=64, raw Euclidean distance, composite onto red `(133,2,52)` background. Don't "improve" to 128 or cosine.
- CSS: `[hidden]{display:none}` must be explicit (`.revrow{display:flex}` overrides it).
- **`norm()` keeps the gender sign.** Limitless writes `Indeedee ♀`, the index writes `indeedee-f`;
  both normalise to `indeedeef`. `vf.degender` runs inside `norm()` and `_toks`, so changing either
  invalidates every cached key — rebuild with `--fresh` after touching them.
- Known and accepted, all logged `[bridge] LOOSE`, never silent: gourgeist sizes, `maushold-four`,
  `lycanroc-midnight`, `squawkabilly-yellow`, `vivillon-fancy` collapse onto the base key. These are
  unfixable here — Limitless writes those mons bare, so the source data does not distinguish them.
  Calyrex/Ogerpon are no longer in the index.

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

## Regulation M-C (live Sep 9 – Dec 2, 2026) — migrated 2026-09-17
Done, in this order. Each step has a commit; `31d4e17` is the pre-migration checkpoint.

1. **Regional slug regression** (`7a69813`). The index changed scheme at M-C, so all 21 form sprites
   fell through to the base species — Alolan Ninetales was reading Fire instead of Ice/Fairy, silently.
   `label_to_slug` now derives `base + "-" + tag` (the index slugifies its own display name) with
   `FORM_FIX`/`BASE_FIX` for the handful that disagree. `_audit_sprites()` prints the split at startup.
2. **champdata.js** (`0b3cfe1`). Regenerated from upstream `1369b359` ("Reg M-C sets") via the new
   `resolve_champdata.js`. POKEDEX 315→346, stones 75→81, index→calc bridging 236→264 of 264.
   The stone regex was `/ite( [XY])?$/` and silently dropped the three Z stones; now `[XYZ]`.
3. **Teamsheets** (`488f0ce`). `ALIAS_FORMATS` defines M-C as CUSTOM+M-B dated ≥ 2026-09-09.
   4887 teams / 73 events; 0.4% known contamination from one M-B event. `TEAM_FORMAT = "M-C"`.
   Rebuild with `python vgcfinder.py build --format M-C --fresh`.
   Drop the alias once Limitless adds a real M-C ID.
4. **Bridging.** Teamsheet slots reachable from a dashboard slug: 29320/29322.
5. **Gender formes.** `norm()` was dropping ♀, so `Indeedee` and `Indeedee ♀` shared one key — 955
   teams reading the wrong stat line (♀ is +10 HP/+10 SpD, −10 SpA/−10 Spe). Now split; Meowstic-F and
   Basculegion-F came along with it, which retires that entry from the known-LOOSE list.

`resolve_champdata.js` uses a *faithful* `$.extend` — that is correct and does not contradict the
falsy-stub rule, which is about `champcalc.js` at runtime. The two stubs exist for opposite reasons.

Game rules / legality / stats: verify against a current source before stating them.
