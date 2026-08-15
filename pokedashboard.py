"""
Pokemon Champions scout — all in one.

Run once:   python dashboard.py
  - MacroDroid POSTs screenshots to  http://<laptop-ip>:5000/upload
  - Watch the dashboard at            http://localhost:5000/
Each upload auto-reloads the dashboard within ~1s.  --refresh re-pulls the index.
"""
import glob, os, re, json, io, base64, sys, time, threading, webbrowser, urllib.request, html, copy
from concurrent.futures import ThreadPoolExecutor
import numpy as np
from PIL import Image
from flask import Flask, request, Response, jsonify
import socket

PORT      = 5000
ip = socket.gethostbyname(socket.gethostname())
print(f"Upload  ->  http://{ip}:{PORT}/upload")
# ================================================================ CONFIG
REF_DIR   = r"C:/Users/admin/Desktop/pokeicons"
SHOTS_DIR = os.path.expanduser("~/Desktop/pokemonChampionsDashB/Screenshots")
SIZE      = 64
RED       = (133, 2, 52)
BOX       = lambda d: (1866, 155 + 126 * d, 1978, 267 + 126 * d)
FORMAT    = "Doubles"            # "Doubles" or "Singles"  (primary format)
OTHER     = "Singles" if FORMAT == "Doubles" else "Doubles"
MERGE_FORMATS = True             # union move usage across both formats (surfaces more moves)
TOP_P     = 85.0
TOP_P_CAP = 5

BUILD     = "2026-08-14-finder-merge"  # visible in header + startup log to confirm live code

# --- teamsheet conditioning (vgcfinder) ---
DIVERGE     = 20.0   # pp gap before the global figure is annotated / a negative is shown
COND_MIN    = 1      # use the exact match whenever one exists at all; n is shown in the header
COUNT_MODE  = 10     # at or below this many teams, show "7/8" instead of "88%"
MOVE_FLOOR  = 4      # always render at least this many move cells
MOVE_CAP    = 12     # never render more than this many
MOVE_MIN_P  = 5.0    # conditioned moves below this % are dropped once the floor is met
FINDER_STALE_DAYS = 7   # past this, the header flags the teamsheet cache age
TEAM_FORMAT = "M-B"     # regulation to build teamsheets for when no cache exists yet
REFRESH_DAYS = 2                       # auto-refresh index + battle cache every N days (0 = never)
API       = "https://championsbattledata.com"
CACHE     = "index_cache.json"
UA        = {"User-Agent": ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                            "(KHTML, like Gecko) Chrome/125.0 Safari/537.36"),
             "Accept": "application/json, text/plain, */*"}
os.makedirs(SHOTS_DIR, exist_ok=True)

MOVE_PRIORITY = {
    "Helping Hand": 5,
    "Fake Out": 3, "Wide Guard": 3, "Quick Guard": 3, "Spotlight": 3,
    "Extreme Speed": 2, "Feint": 2, "First Impression": 2, "Follow Me": 2, "Rage Powder": 2,
    "Aqua Jet": 1, "Bullet Punch": 1, "Ice Shard": 1, "Mach Punch": 1, "Quick Attack": 1,
    "Shadow Sneak": 1, "Sucker Punch": 1, "Vacuum Wave": 1, "Water Shuriken": 1, "Accelerock": 1,
    "Jet Punch": 1, "Grassy Glide": 1, "Thunderclap": 1, "Ally Switch": 1, "Baby-Doll Eyes": 1,
    "Ion Deluge": 1, "Powder": 1, "Bide": 1,
}


# status (non-damaging) moves, from PokeAPI damage_class -> rendered white
STATUS_MOVES = frozenset({
'acidarmor','acupressure','afteryou','agility','allyswitch','amnesia','aquaring','aromatherapy','aromaticmist','assist','attract','auroraveil','autotomize','babydolleyes','banefulbunker','barrier','batonpass','bellydrum','bestow','block','bulkup','burningbulwark','calmmind','camouflage','captivate','celebrate','charge','charm','chillyreception','clangoroussoul','coaching','coil','confide','confuseray','conversion','conversion2','copycat','corrosivegas','cosmicpower','cottonguard','cottonspore','courtchange','craftyshield','curse','darkvoid','decorate','defendorder','defensecurl','defog','destinybond','detect','disable','doodle','doubleteam','dragoncheer','dragondance','eerieimpulse','electricterrain','electrify','embargo','encore','endure','entrainment','extremeevoboost','fairylock','faketears','featherdance','filletaway','flash','flatter','floralhealing','flowershield','focusenergy','followme','foresight','forestscurse','gastroacid','gearup','geomancy','glare','grasswhistle','grassyterrain','gravity','growl','growth','grudge','guardsplit','guardswap','hail','happyhour','harden','haze','healbell','healblock','healingwish','healorder','healpulse','heartswap','helpinghand','holdhands','honeclaws','howl','hypnosis','imprison','ingrain','instruct','iondeluge','irondefense','junglehealing','kinesis','kingsshield','laserfocus','leechseed','leer','lifedew','lightscreen','lockon','lovelykiss','luckychant','lunarblessing','lunardance','magiccoat','magicpowder','magicroom','magneticflux','magnetrise','matblock','maxguard','meanlook','meditate','mefirst','memento','metalsound','metronome','milkdrink','mimic','mindreader','minimize','miracleeye','mirrormove','mist','mistyterrain','moonlight','morningsun','mudsport','nastyplot','naturepower','nightmare','nobleroar','noretreat','obstruct','octolock','odorsleuth','painsplit','partingshot','perishsong','playnice','poisongas','poisonpowder','powder','powershift','powersplit','powerswap','powertrick','protect','psychicterrain','psychoshift','psychup','purify','quash','quickguard','quiverdance','ragepowder','raindance','recover','recycle','reflect','reflecttype','refresh','rest','revivalblessing','roar','rockpolish','roleplay','roost','rototiller','safeguard','sandattack','sandstorm','scaryface','screech','shadowdown','shadowhold','shadowmist','shadowpanic','shadowshed','shadowsky','sharpen','shedtail','shellsmash','shelter','shiftgear','shoreup','silktrap','simplebeam','sing','sketch','skillswap','slackoff','sleeppowder','sleeptalk','smokescreen','snatch','snowscape','soak','softboiled','speedswap','spicyextract','spiderweb','spikes','spikyshield','spite','splash','spore','spotlight','stealthrock','stickyweb','stockpile','strengthsap','stringshot','stuffcheeks','stunspore','substitute','sunnyday','supersonic','swagger','swallow','sweetkiss','sweetscent','switcheroo','swordsdance','synthesis','tailglow','tailwhip','tailwind','takeheart','tarshot','taunt','tearfullook','teatime','teeterdance','telekinesis','teleport','thunderwave','tickle','tidyup','topsyturvy','torment','toxic','toxicspikes','toxicthread','transform','trick','trickortreat','trickroom','venomdrench','victorydance','watersport','whirlwind','wideguard','willowisp','wish','withdraw','wonderroom','workup','worryseed','yawn'
})
def _norm_move(s):
    import re
    return re.sub(r'[^a-z0-9]', '', s.lower())
def is_status(name):
    return _norm_move(name) in STATUS_MOVES

# ================================================================ RECOGNITION (euclid_raw)
def vec(img):
    img = img.convert("RGBA")
    bg = Image.new("RGBA", img.size, RED + (255,))
    img = Image.alpha_composite(bg, img).convert("RGB").resize((SIZE, SIZE), Image.LANCZOS)
    return np.asarray(img, np.float32).ravel()

_files = glob.glob(REF_DIR + "/*.png")
if not _files:
    raise SystemExit(f"No sprites in {REF_DIR}")
_labels = [os.path.splitext(os.path.basename(f))[0] for f in _files]
_M = np.stack([vec(Image.open(f)) for f in _files])

def identify(crop):
    return _labels[int(np.argmin(np.linalg.norm(_M - vec(crop), axis=1)))]

# ================================================================ DEX -> SLUG (form-aware)
dex_to_slug = json.load(open("dex_to_slug.json"))
# species slugs (from PokeAPI) sorted longest-first, for stripping cosmetic/gender
# suffixes off a resolved slug when that variant has no battle data of its own
_BASES = sorted(set(dex_to_slug.values()), key=len, reverse=True)
def _base_species(slug):
    for b in _BASES:
        if slug == b or slug.startswith(b + "-"):
            return b
    return slug
REGIONAL = {"Alola": "alolan-", "Galar": "galarian-", "Hisui": "hisuian-"}
SUFFIX = {"Fan": "-fan", "Frost": "-frost", "Heat": "-heat", "Mow": "-mow", "Wash": "-wash",
          "Midnight": "-midnight", "Dusk": "-dusk", "Blade": "-blade", "Small": "-small",
          "Large": "-large", "Jumbo": "-super", "Hero": "-hero"}
SPECIAL = {"0128-Paldea_Aqua": "paldean-tauros-aqua-breed",
           "0128-Paldea_Blaze": "paldean-tauros-blaze-breed",
           "0128-Paldea_Combat": "paldean-tauros-combat-breed",
           "0877-Hangry": "morpeko-hangry-mode",
           "0925-Three": "maushold-family-of-three"}

def _candidates(dex, tag, base):
    if tag and f"{dex}-{tag}" in SPECIAL: return [SPECIAL[f"{dex}-{tag}"]]
    if tag is None:     return [base, base + "-male", base + "-m", base + "-ordinary"]
    if tag in REGIONAL: return [REGIONAL[tag] + base]
    if tag == "Female": return [base + "-f", base + "-female"]
    if tag in SUFFIX:   return [base + SUFFIX[tag]]
    return [base]

def label_to_slug(label):
    s = label.replace("_shiny", "").replace("_Mega", "")
    m = re.search(r"(\d{4})(?:-([A-Za-z0-9_%]+))?", s)
    if not m:
        return None
    dex, tag = m.group(1), m.group(2)
    base = dex_to_slug.get(dex)
    if base is None:
        return None
    for c in _candidates(dex, tag, base):
        if c in BY_SLUG:
            return c
    if base in BY_SLUG:
        return base
    return next((k for k in sorted(BY_SLUG) if k.startswith(base)), base)

# ================================================================ BATTLE DATA
def _cache_age_days():
    if not os.path.exists(CACHE):
        return None
    return (time.time() - os.path.getmtime(CACHE)) / 86400.0

def load_index(force=False):
    age = _cache_age_days()
    fresh = (age is not None and (REFRESH_DAYS <= 0 or age < REFRESH_DAYS))
    if os.path.exists(CACHE) and not force and "--refresh" not in sys.argv and fresh:
        return json.load(open(CACHE, encoding="utf-8"))
    why = "stale" if age is not None else "missing"
    print(f"Downloading battle index ({why}, age={age and round(age,1)}d)...")
    req = urllib.request.Request(f"{API}/api", headers=UA)
    data = json.loads(urllib.request.urlopen(req, timeout=60).read().decode())
    json.dump(data, open(CACHE, "w", encoding="utf-8"))
    return data

INDEX = load_index()
BY_SLUG = {e["slug"]: e for e in INDEX.get("pokemon", [])}
print(f"Index: {len(BY_SLUG)} Pokemon. Refs: {len(_labels)}. Format: {FORMAT}")

# ================================================================ TEAMSHEETS (vgcfinder)
import vgcfinder as vf

FINDER_TEAMS, FINDER_BUILT, FINDER_FMT, FINDER_KEYS = [], None, "?", set()
_BY_TOKENS = {}          # frozenset(tokens) -> norm key
_FINDER_MTIME = 0.0

def _toks(s):
    return frozenset(t for t in re.split(r"[^a-z0-9]+", (s or "").lower()) if t)

def reload_finder(quiet=False):
    """(Re)read vgcfinder_cache.json. Cheap enough to check on every render, so a
    CLI rebuild is picked up by the running server without a restart."""
    global FINDER_TEAMS, FINDER_BUILT, FINDER_FMT, FINDER_KEYS, _BY_TOKENS, _FINDER_MTIME
    fc = vf.load_cache()
    FINDER_TEAMS = (fc or {}).get("teams", [])
    FINDER_BUILT = (fc or {}).get("built")
    FINDER_FMT   = (fc or {}).get("format", "?")
    FINDER_KEYS  = {k for t in FINDER_TEAMS for k in t["keys"]}
    tok = {}
    for t in FINDER_TEAMS:
        for m in t["mons"]:
            k = vf.norm(m["name"])
            if k in FINDER_KEYS:
                tok.setdefault(_toks(m["name"]), k)
    _BY_TOKENS = tok
    _unbridged.clear(); _loose.clear()      # re-warn against the new cache
    try:
        _FINDER_MTIME = os.path.getmtime(vf.CACHE)
    except OSError:
        _FINDER_MTIME = 0.0
    if not quiet:
        if FINDER_TEAMS:
            age = (time.time() - FINDER_BUILT) / 86400.0 if FINDER_BUILT else None
            print(f"Teamsheets: {len(FINDER_TEAMS)} teams [{FINDER_FMT}]"
                  + (f", built {age:.1f}d ago" if age is not None else ""))
        else:
            print("Teamsheets: none — run `python vgcfinder.py build --format M-B`")

def finder_if_changed():
    """Reload only when the cache file has actually been rewritten."""
    try:
        m = os.path.getmtime(vf.CACHE)
    except OSError:
        return False
    if m != _FINDER_MTIME:
        reload_finder()
        return True
    return False

# Limitless writes forms as inline words, but the ORDER varies: 'Hisuian Decidueye'
# matches slug 'hisuian-decidueye', while 'Wash Rotom' does not match 'rotom-wash'.
# So match on token SETS, not strings. Stripping a regional prefix is never done —
# it only ever fires when the right key is absent, silently landing Alolan Raichu
# on regular Raichu.
_NOISE = {"forme", "form", "mode", "breed", "mask"}   # droppable only when unambiguous

_ALIAS = {"paldeantauroscombatbreed": "paldeantauros"}   # cache writes Combat bare
_unbridged, _loose = set(), set()

reload_finder()          # first load; re-read later whenever the file changes

def slug_to_key(slug):
    """Dashboard slug -> vgcfinder norm key, or None if this mon isn't in the cache."""
    if not slug or not FINDER_KEYS:
        return None
    k = vf.norm(slug)
    if k in FINDER_KEYS:
        return k
    if _ALIAS.get(k) in FINDER_KEYS:
        return _ALIAS[k]

    tk = _toks(slug)
    if tk in _BY_TOKENS:                      # 'rotom-wash' == 'Wash Rotom'
        return _BY_TOKENS[tk]
    # same tokens plus throwaway words ('Aegislash Blade Forme'), but only if
    # exactly one key qualifies — otherwise 'ogerpon' would grab a masked form
    sup = [v for t, v in _BY_TOKENS.items() if tk < t and (t - tk) <= _NOISE]
    if len(sup) == 1:
        return sup[0]

    # lossy: a variant with no teamsheets of its own falls back to its species.
    # Fine for cosmetic/gender forms, WRONG for anything that battles differently,
    # so it announces itself rather than matching silently.
    b = vf.norm(_base_species(slug))
    if b != k and b in FINDER_KEYS:
        if slug not in _loose:
            _loose.add(slug)
            print(f"[bridge] LOOSE: '{slug}' -> '{b}' (species fallback, verify this is safe)")
        return b
    if slug not in _unbridged:          # log each miss once, not every reload
        _unbridged.add(slug)
        print(f"[bridge] no teamsheet key for slug '{slug}'")
    return None

def _auto_refresh_loop():
    """Every REFRESH_DAYS: re-pull the index and drop the per-Pokemon battle cache."""
    global INDEX, BY_SLUG, VERSION
    if REFRESH_DAYS <= 0:
        return
    while True:
        time.sleep(REFRESH_DAYS * 86400)
        try:
            data = load_index(force=True)
            INDEX = data
            BY_SLUG = {e["slug"]: e for e in data.get("pokemon", [])}
            _ROW_CACHE.clear()                 # force fresh battle-data fetches
            finder_if_changed()                # and pick up any teamsheet rebuild
            with _lock:
                VERSION += 1                   # nudge browsers to reload
            print(f"[auto-refresh] index reloaded ({len(BY_SLUG)} mon), battle cache cleared")
        except Exception as e:
            print(f"[auto-refresh] failed, will retry next cycle: {e}")

NOTES_FILE = "notes.json"
NOTES = json.load(open(NOTES_FILE, encoding="utf-8")) if os.path.exists(NOTES_FILE) else {}
_notes_lock = threading.Lock()
def save_note(slug, text):
    with _notes_lock:
        if text.strip():
            NOTES[slug] = text
        else:
            NOTES.pop(slug, None)
        json.dump(NOTES, open(NOTES_FILE, "w", encoding="utf-8"), ensure_ascii=False, indent=0)

_ROW_CACHE = {}
MAX_WORKERS = 4
def battle_rows(slug, fmt=FORMAT):
    key = (slug, fmt)
    if key in _ROW_CACHE:
        return _ROW_CACHE[key]
    for attempt in range(4):
        try:
            req = urllib.request.Request(f"{API}/api/battle/{fmt}/{slug}", headers=UA)
            data = json.loads(urllib.request.urlopen(req, timeout=20).read().decode())
            rows = data.get("rows", data) if isinstance(data, dict) else data
            if rows:                     # real data -> cache permanently and return
                _ROW_CACHE[key] = rows
                return rows
            # HTTP 200 but zero rows: almost always a soft rate-limit under a
            # concurrent burst, NOT a genuinely dataless mon. Back off and retry.
            print(f"empty rows for {slug} [{fmt}] (try {attempt+1}/4) — retrying")
        except Exception as e:
            print(f"battle fetch failed for {slug} [{fmt}] (try {attempt+1}/4): {e}")
        time.sleep(0.8 * (attempt + 1))
    print(f"giving up on {slug} [{fmt}] (empty/failed) — not caching, will retry on reload")
    return []                            # never cache an empty result

def prefetch(slugs):
    """Warm _ROW_CACHE for every needed (slug, fmt) pair concurrently.
    Also warms each slug's base species, since cosmetic/gender variants
    carry no battle data of their own and fall back to the species slug."""
    fmts = [FORMAT, OTHER] if MERGE_FORMATS else [FORMAT]
    wanted = set()
    for s in slugs:
        if not s:
            continue
        wanted.add(s)
        wanted.add(_base_species(s))
    jobs = [(s, f) for s in wanted for f in fmts if (s, f) not in _ROW_CACHE]
    if not jobs:
        return
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as ex:
        list(ex.map(lambda sf: battle_rows(*sf), jobs))

def battle_rows_fb(slug, fmt=FORMAT):
    """battle_rows, but if a variant slug has no rows, retry the base species."""
    rows = battle_rows(slug, fmt)
    if not rows:
        base = _base_species(slug)
        if base != slug:
            rows = battle_rows(base, fmt)
    return rows

def _pct(r):
    try: return float(str(r.get("percentage", "")).replace("%", "").strip())
    except Exception: return 0.0

def _spread_str(r):
    ks = ["hp_points", "attack_points", "defense_points",
          "sp_atk_points", "sp_def_points", "speed_points"]
    return "/".join(str(int(r.get(k) or 0)) for k in ks)

def _topp(rows, min_n=1, fmt=lambda r: r.get("name", "")):
    out, cum = [], 0.0
    for r in sorted(rows, key=lambda r: -_pct(r)):
        out.append((fmt(r), _pct(r)))
        cum += _pct(r)
        if len(out) >= TOP_P_CAP:
            break
        if cum >= TOP_P and len(out) >= min_n:
            break
    return out

SPEED_NAT = {"Timid", "Hasty", "Jolly", "Naive"}

def _xy(s):
    """Return 'X'/'Y' if the string carries a mega X/Y designator token, else None.
    Works for stones ('Charizardite X'), form_kind ('Mega X'), and slugs."""
    toks = re.split(r"[^a-z0-9]+", (s or "").lower())
    if "x" in toks: return "X"
    if "y" in toks: return "Y"
    return None

def _mega_tag(f):
    # form_kind is 'Mega', 'Mega X', or 'Mega Y'; slug/form_name back it up
    return _xy(f.get("form_kind")) or _xy(f.get("slug")) or _xy(f.get("form_name")) or "M"

def _megas_of(e):
    forms = (e.get("summary", {}) or {}).get("forms", []) or []
    # form_kind starts with 'mega' ('Mega', 'Mega X', 'Mega Y') -- NOT an exact match
    ms = [f for f in forms if (f.get("form_kind") or "").lower().startswith("mega")]
    # sort X before Y so the array index is deterministic even if a tag fails
    return sorted(ms, key=lambda f: {"X": 0, "Y": 1}.get(_mega_tag(f), 2))

def extract(slug):
    e = BY_SLUG.get(slug)
    if not e:
        return None
    s  = e.get("summary", {})
    st = s.get("baseStats", {})
    idx = s.get("battleSummary", {}).get("Current", {}).get(FORMAT, {})
    prim_rows = battle_rows_fb(slug, FORMAT)
    by_cat = {}
    for r in prim_rows:
        by_cat.setdefault(r.get("category"), []).append(r)
    # --- moves: merge usage across both formats to get past the ~10-move-per-format cap ---
    def _mvs(rows):
        return [(r.get("name"), _pct(r)) for r in
                sorted((x for x in rows if x.get("category") == "move"), key=lambda r: -_pct(r))]
    prim = _mvs(prim_rows)
    merged = [(n, p, "") for n, p in prim]              # primary-format moves (no tag)
    if MERGE_FORMATS:
        pnames = {n for n, _ in prim}
        merged += [(n, p, OTHER[0]) for n, p in _mvs(battle_rows_fb(slug, OTHER)) if n not in pnames]
    if not merged:
        merged = [(n, None, "") for n in (idx.get("values", {}).get("move") or [])]
    prio = [(n, p, tag, MOVE_PRIORITY[n]) for (n, p, tag) in merged
            if n in MOVE_PRIORITY and MOVE_PRIORITY[n] > 0][:4]
    pset = {x[0] for x in prio}
    rest = [(n, p, tag) for (n, p, tag) in merged if n not in pset]
    grid = rest[:12]
    n_fill = max(0, 4 - len(prio))
    head = [(n, p, tag, pr) for (n, p, tag, pr) in prio] + \
           [(n, p, tag, None) for (n, p, tag) in rest[12:12 + n_fill]]
    def cat(name, fmt=lambda r: r.get("name", ""), min_n=1):
        rows = by_cat.get(name, [])
        if rows:
            return _topp(rows, min_n=min_n, fmt=fmt)
        t = (idx.get("top", {}) or {}).get(name)
        return [(fmt(t), _pct(t))] if t and (t.get("name") or fmt is _spread_str) else []
    al = by_cat.get("stat_alignment", [])
    spd_prob = sum(_pct(r) for r in al
                   if r.get("name") in SPEED_NAT or r.get("stat_up") in ("Speed", "Spe"))
    marks = "!!!" if spd_prob > 75 else "!!" if spd_prob >= 50 else "!" if spd_prob > 25 else ""
    sp = [(_pct(r), (r.get("speed_points") or 0)) for r in by_cat.get("stat_points", [])]
    W = sum(w for w, _ in sp)
    if W > 0:
        mean = sum(w * x for w, x in sp) / W
        std = (sum(w * (x - mean) ** 2 for w, x in sp) / W) ** 0.5
    else:
        mean = std = None
    # mega forms (0, 1, or multiple like Charizard X/Y) — read from summary.forms
    megas = []
    for f in _megas_of(e):
        tag = _mega_tag(f)
        ab = (f.get("abilities") or "").split("|")[0].strip() or "?"
        megas.append({
            "tag": tag,
            "speed": int(f.get("speed") or 0),
            "stats": [int(f.get(k) or 0) for k in ("hp", "attack", "defense", "sp_attack", "sp_defense")],
            "ability": [[ab, 100.0]],
        })
    out = {
        "name":  e.get("name", slug),
        "types": s.get("types", []),
        "speed": st.get("speed"),
        "spd_marks": marks,
        "spd_ev": (mean, std),
        "stats5": [st.get("hp"), st.get("attack"), st.get("defense"),
                   st.get("sp_attack"), st.get("sp_defense")],
        "moves": grid,
        "head":  head,
        "ability": cat("ability", min_n=2),
        "item":    cat("held_item", min_n=2),
        "nature":  cat("stat_alignment", min_n=2),
        "spread":  cat("stat_points", fmt=_spread_str),
        "megas":   megas,
    }
    # uniform shapes: cat entries -> (name, pct, global_or_None, count_or_None, n_or_None)
    #                 move cells  -> (name, pct, fmt_tag, global_or_None)
    for f in ("ability", "item", "nature", "spread"):
        out[f] = [(n, p, None, None, None) for n, p in out[f]]
        out[f + "_neg"] = []
    out["moves"] = [(n, p, tag, None) for n, p, tag in out["moves"]]
    out["moves_neg"] = []
    out["cond_n"] = 0
    return out

# ================================================================ CONDITIONING
def _ann(p, g):
    """Global figure to annotate with, or None when the two agree closely enough."""
    if g is None or abs(p - g) < DIVERGE:
        return None
    return g

def condition(d, a):
    """Overwrite a card's global usage data with teamsheet data for this exact core.

    Conditioned figures replace globals outright; a global is shown only where it
    diverges by DIVERGE points, and globally-common entries that vanish on this
    core surface as negatives."""
    n = a["n"]
    if n < COND_MIN:
        return d
    d["cond_n"] = n
    show_counts = n <= COUNT_MODE

    for f in ("ability", "item", "nature"):
        gl = {name: p for name, p, _, _, _ in d[f]}
        cp = {name: c / n * 100 for name, c in a[f].items()}
        ents = []
        for name, c in a[f].most_common(3):
            p = c / n * 100
            if p < 3 and ents:
                break
            ents.append((name, p, _ann(p, gl.get(name)),
                         c if show_counts else None, n))
        if ents:
            shown = {e[0] for e in ents}
            d[f] = ents
            d[f + "_neg"] = sorted(((nm, g) for nm, g in gl.items()
                                    if nm not in shown and g - cp.get(nm, 0.0) >= DIVERGE),
                                   key=lambda x: -x[1])

    # --- moves: no 10-per-format cap here, and denominators are exactly 4 slots ---
    gm = {nm: p for nm, p, _, _ in d["moves"] if p is not None}
    for nm, p, _, _ in d["head"]:
        if p is not None:
            gm.setdefault(nm, p)
    cpm = {nm: c / n * 100 for nm, c in a["moves"].items()}
    mv = []
    for name, c in a["moves"].most_common(MOVE_CAP):
        p = c / n * 100
        if p < MOVE_MIN_P and len(mv) >= MOVE_FLOOR:
            break
        mv.append((name, p, "", _ann(p, gm.get(name))))
    if mv:
        shown = {m[0] for m in mv}
        d["moves"] = mv
        d["moves_neg"] = sorted(((nm, g) for nm, g in gm.items()
                                 if nm not in shown and g - cpm.get(nm, 0.0) >= DIVERGE),
                                key=lambda x: -x[1])[:6]
        # priority chips re-derived from the conditioned list
        d["head"] = [(nm, p, "", MOVE_PRIORITY[nm]) for nm, p, _, _ in mv
                     if MOVE_PRIORITY.get(nm)][:4]
    return d

# ================================================================ SCAN
def scan():
    finder_if_changed()          # a CLI rebuild lands without restarting the server
    shots = glob.glob(SHOTS_DIR + "/*.png") + glob.glob(SHOTS_DIR + "/*.jpg")
    if not shots:
        return None, [], {}
    latest = max(shots, key=os.path.getmtime)
    img = Image.open(latest)

    # recognise all six first, then warm the API cache in parallel, then extract
    crops  = [img.crop(BOX(d)) for d in range(6)]
    labels = [identify(c) for c in crops]
    slugs  = [label_to_slug(l) for l in labels]
    prefetch([s for s in slugs if s])

    # exact 6/6 teamsheet match — nothing looser, so a miss means a miss
    keys = [slug_to_key(s) for s in slugs]
    agg, fin = {}, {"n": 0, "bridged": sum(1 for k in keys if k), "keys": keys}
    if all(keys) and len(set(keys)) == 6:
        hits = vf.exact_teams(FINDER_TEAMS, keys)
        fin["n"] = len(hits)
        if len(hits) >= COND_MIN:
            agg = vf.aggregate(hits)

    cards = []
    for crop, label, slug, key in zip(crops, labels, slugs, keys):
        data = extract(slug) if slug else None
        gdata = None
        if data and key and key in agg:
            gdata = data                                  # pristine global
            data = condition(copy.deepcopy(data), agg[key])
            if not data.get("cond_n"):
                gdata = None                              # nothing conditioned; no toggle
        buf = io.BytesIO(); crop.resize((96, 96)).save(buf, "PNG")
        thumb = "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()
        cards.append({"label": label, "slug": slug, "data": data,
                      "gdata": gdata, "thumb": thumb})
    return os.path.basename(latest), cards, fin

# ================================================================ RENDER
TYPE_COLORS = {"Normal":"#9fa4b0","Fire":"#ff8a4c","Water":"#4d9be6","Electric":"#f4cf3c",
    "Grass":"#5dc264","Ice":"#79d0cf","Fighting":"#e5546c","Poison":"#b160d4","Ground":"#e0a34a",
    "Flying":"#93a8e6","Psychic":"#fb7189","Bug":"#a2c520","Rock":"#c9b878","Ghost":"#7275d8",
    "Dragon":"#5b6ee1","Dark":"#6a6480","Steel":"#6fa3b8","Fairy":"#f18fd8"}

def usage_color(p, dark=False):
    if p is None:
        return "var(--dim)"
    p = max(0.0, min(100.0, p))
    return f"hsl({p * 1.2:.0f} {'72% 40%' if dark else '80% 63%'})"

def _move_cell(n, p, status, tag="", g=None):
    col = usage_color(p, dark=status)
    w = min(100, p) if p is not None else 0
    cls = "mv" + (" status" if status else "") + (" xfmt" if tag else "")
    sup = f'<sup class="fmt">{tag}</sup>' if tag else ""
    # tick sits at the global usage, so the gap to the bar edge IS the divergence
    tick = f'<u style="left:{min(100, g):.0f}%"></u>' if g is not None else ""
    return (f'<span class="{cls}"><span class="mvn" style="color:{col}">{n}{sup}</span>'
            f'<span class="mvb"><i style="width:{w}%;background:{col}"></i>{tick}</span></span>')

def neg_row(negs, lab="absent"):
    """Globally common, near-absent on this core — things not to play around."""
    if not negs:
        return ""
    out = "".join(f'<span class="ng">{n}<u>{g:.0f}%</u></span>' for n, g in negs)
    return f'<div class="negrow"><span class="nglab">{lab}</span>{out}</div>'

def head_chips(head, cls=""):
    if not head:
        return ""
    out = ""
    for n, p, tag, pr in head:
        status = is_status(n)
        col = usage_color(p, dark=status)
        c = "pchip" + (" status" if status else "") + (" prio" if pr else "") + (" xfmt" if tag else "")
        badge = (f'<em>+{pr}</em>' if pr else "") + (f'<sup class="fmt">{tag}</sup>' if tag else "")
        out += f'<span class="{c}" style="color:{col}">{n}{badge}</span>'
    return f'<div class="pwrap {cls}">{out}</div>'

def cent(n, p, g=None, cnt=None, tot=None):
    val = f"{cnt}/{tot}" if cnt is not None else f"{p:.0f}%"
    ann = ""
    if g is not None:
        up = p > g
        ann = (f'<u class="ann {"up" if up else "dn"}">'
               f'{"&uarr;" if up else "&darr;"}{g:.0f}</u>')
    return (f'<div class="cent"><b style="color:{usage_color(p)}">{n}</b>'
            f'<i>{val}</i>{ann}</div>')

def cat_col(lab, ents, negs=()):
    rows = "".join(cent(*e) for e in ents) or '<div class="cent dim">&mdash;</div>'
    return f'<div class="ccol"><span class="clab">{lab}</span>{rows}{neg_row(negs)}</div>'

def _is_stone(name):
    """True if the item name is a Mega Stone (X/Y designator stripped first)."""
    core = re.sub(r"\b[xy]\b", "", (name or "").lower())
    core = re.sub(r"[^a-z]", "", core)
    return core.endswith("ite")

def _stone_v(megas, item):
    """If item is a Mega Stone, return the index of the mega it triggers, else None."""
    if not megas or not _is_stone(item):
        return None
    want = _xy(item)                 # 'X' / 'Y' / None
    if not want:                     # single-mega stone -> the only mega
        return 0
    # prefer matching by resolved tag; megas are sorted X-before-Y so index
    # positions are a safe fallback if a tag failed to parse
    i = next((i for i, mg in enumerate(megas) if mg.get("tag") == want), None)
    if i is not None:
        return i
    return {"X": 0, "Y": 1}.get(want) if len(megas) >= 2 else 0

def item_col(d):
    megas = d.get("megas") or []
    rows = ""
    for n, p, g, cnt, tot in d["item"]:
        vi = _stone_v(megas, n) if megas else None
        if vi is not None:
            val = f"{cnt}/{tot}" if cnt is not None else f"{p:.0f}%"
            rows += (f'<div class="cent stone" data-v="{vi}" onclick="toggleStone(this)" title="toggle Mega">'
                     f'<span class="ms">&#9670;</span><b style="color:{usage_color(p)}">{n}</b>'
                     f'<i>{val}</i></div>')
        else:
            rows += cent(n, p, g, cnt, tot)
    body = rows or "<div class='cent dim'>&mdash;</div>"
    return (f'<div class="ccol"><span class="clab">Item</span>{body}'
            f'{neg_row(d.get("item_neg", []))}</div>')

def speed_block(d):
    mean, std = d["spd_ev"]
    ev = f"{mean:.0f} &plusmn; {std:.0f}" if mean is not None else "&mdash;"
    mk = f'<em>{d["spd_marks"]}</em>' if d["spd_marks"] else ""
    return (f'<div class="spd" onclick="toggleStats(this)" title="click for other stats">'
            f'<span class="spnum" style="color:{stat_color(d["speed"] or 0)}">{d["speed"] or 0}</span>{mk}<span class="spdelta"></span>'
            f'<span class="spev">EV {ev}</span></div>')

def stat_color(v):
    v = max(0, min(200, v))
    return f"hsl({v / 200 * 120:.0f} 78% 58%)"

def stats_row(d):
    out = ""
    for v in d["stats5"]:
        v = v or 0
        out += (f'<div class="sm"><span class="smv" style="color:{stat_color(v)}">{v}</span>'
                f'<span class="smd"></span>'
                f'<span class="smb"><i style="width:{min(100, round(v/200*100))}%;background:{stat_color(v)}"></i></span></div>')
    return out

def note_btn(slug):
    if not slug:
        return ""
    has = " hasnote" if NOTES.get(slug) else ""
    return f'<button class="notebtn{has}" type="button" onclick="toggleNote(this)">&#9998; Notes</button>'

def note_wrap(slug):
    if not slug:
        return ""
    val = html.escape(NOTES.get(slug, ""))
    return (f'<div class="notewrap" hidden><textarea class="notearea" data-slug="{slug}" '
            f'placeholder="Observations after battle&hellip;">{val}</textarea></div>')

def _variant(d, cls):
    """The half of a card that differs between local and global: moves + detail."""
    ab_ents = "".join(cent(*e) for e in d["ability"]) or '<div class="cent dim">&mdash;</div>'
    ability_col = (f'<div class="ccol"><span class="clab">Ability</span>'
                   f'<div class="abents">{ab_ents}</div>'
                   f'{neg_row(d.get("ability_neg", []))}{speed_block(d)}</div>')
    # teamsheets carry no stat points, so Spread is global even in the local view
    slab = ("Spread" if cls != "vlocal" else
            'Spread <u class="gmark" title="stat points are not in teamsheets '
            '&mdash; this column is always global">g</u>')
    detail = (ability_col + item_col(d) +
              cat_col("Nature", d["nature"], d.get("nature_neg", [])) +
              cat_col(slab, d["spread"]))
    moves = "".join(_move_cell(n, p, is_status(n), tag, g)
                    for n, p, tag, g in d["moves"][:MOVE_CAP]) or '<span class="nd">no move data</span>'
    return (f'<div class="{cls}"><div class="moves">{moves}</div>'
            f'{neg_row(d.get("moves_neg", []), "not run")}'
            f'<div class="detail">{detail}</div></div>')

def card_html(c):
    slug = c.get("slug")
    if not c["data"]:
        return (f'<article class="card miss"><div class="head"><img class="spr" src="{c["thumb"]}">'
                f'<div class="idb"><h2>Unknown</h2><p class="sub">{c["label"]}</p></div>'
                f'<div class="head-right">{note_btn(slug)}</div></div>'
                f'<p class="nd">no battle data</p>{note_wrap(slug)}</article>')
    d = c["data"]
    g = c.get("gdata")
    badges = "".join(f'<span class="tp" style="--tc:{TYPE_COLORS.get(t,"#888")}">{t}</span>'
                     for t in d["types"])
    # mega toggle + base/mega data blobs
    data_attrs = ""
    megas = d.get("megas") or []
    if megas:
        base_blob = {"speed": d["speed"] or 0,
                     "stats": [int(v or 0) for v in d["stats5"]],
                     "ability": [[e[0], e[1]] for e in d["ability"]]}
        data_attrs = (f" data-on='0' data-v='0'"
                      f" data-base='{html.escape(json.dumps(base_blob))}'"
                      f" data-megas='{html.escape(json.dumps(megas))}'")
    statwrap = f'<div class="statwrap" hidden><div class="statrow">{stats_row(d)}</div></div>'
    cn = d.get("cond_n", 0)
    if g:                                  # both datasets exist -> render both, toggle per card
        body = _variant(d, "vlocal") + _variant(g, "vglobal")
        # chips live in the card header, outside the variant blocks, so they need
        # their own pair — otherwise a global card keeps its conditioned chips
        chips = head_chips(d["head"], "vlocal") + head_chips(g["head"], "vglobal")
        # the badge IS the switch: it already states the mode, so it costs no extra space
        cbadge = (f'<span class="cbadge sw vlocal" onclick="toggleScope(this)"'
                  f' title="showing this exact team &mdash; click for global">'
                  f'local &middot; {cn}</span>'
                  f'<span class="cbadge sw glob vglobal" onclick="toggleScope(this)"'
                  f' title="showing all teams &mdash; click for this team">global</span>')
    else:
        body = _variant(d, "vonly")
        chips = head_chips(d["head"])
        cbadge = '<span class="cbadge glob" title="no exact teamsheet match">global</span>'
    ccls = "card cond" if cn else "card"
    return f"""<article class="{ccls}" data-slug="{slug or ''}"{data_attrs}>
      <div class="head"><img class="spr" src="{c['thumb']}">
        <div class="idb"><h2>{d['name']}</h2><div class="types">{badges}</div>{cbadge}</div>
        <div class="head-right">{chips}{note_btn(slug)}</div></div>
      {body}
      {note_wrap(slug)}{statwrap}</article>"""

def _finder_status(fin):
    """One line, leading with n — the number that says how much to trust the card."""
    if not FINDER_TEAMS:
        return '<span class="fstat off">no teamsheet cache</span>'
    age = (time.time() - FINDER_BUILT) / 86400.0 if FINDER_BUILT else None
    stale = age is not None and age >= FINDER_STALE_DAYS
    tail = (f' <u class="fage">{age:.0f}d</u>' if stale else "")
    if not fin:
        return f'<span class="fstat off">{len(FINDER_TEAMS)} teams{tail}</span>'
    b, n = fin.get("bridged", 0), fin.get("n", 0)
    if b < 6:
        return f'<span class="fstat off">only {b}/6 mons in cache &mdash; global{tail}</span>'
    if n < COND_MIN:
        return f'<span class="fstat off">no team ran this exact six &mdash; global{tail}</span>'
    return f'<span class="fstat on">n = {n}{tail}</span>'

def page(version):
    shot, cards, fin = scan()
    body = (f'<div class="grid">{"".join(card_html(c) for c in cards)}</div>'
            if shot else '<p class="empty">No screenshot yet — tap the MacroDroid button.</p>')
    meta = shot if shot else "waiting"
    fstat = _finder_status(fin if shot else None)
    return f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Champions Scout</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root{{--bg:#0e1219;--panel:#161c27;--inset:#0b0f16;--line:#232b39;--ink:#e8edf4;
  --dim:#7e8aa0;--accent:#54d6bf;--warn:#ff9d4d;
  --f:'Inter',system-ui,sans-serif;--mono:ui-monospace,SFMono-Regular,Menlo,monospace}}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--bg);color:var(--ink);font:14px/1.45 var(--f)}}
header{{display:flex;align-items:center;gap:14px;padding:15px 22px;border-bottom:1px solid var(--line);position:sticky;top:0;background:rgba(14,18,25,.92);backdrop-filter:blur(6px);z-index:3}}
header h1{{font:800 15px/1 var(--f);letter-spacing:.16em;text-transform:uppercase;margin:0}}
header h1 b{{color:var(--accent)}}
.meta{{color:var(--dim);font:11px/1 var(--mono)}}
.hdr-right{{margin-left:auto;display:flex;align-items:center;gap:14px}}
.laybtn{{background:none;border:1px solid var(--line);color:var(--dim);font:600 11px var(--mono);padding:5px 11px;border-radius:7px;cursor:pointer;letter-spacing:.04em}}
.laybtn:hover{{color:var(--ink);border-color:var(--dim)}}
.laybtn.on{{color:var(--accent);border-color:var(--accent)}}
.laybtn.bad{{color:var(--warn);border-color:var(--warn)}}
.live{{display:flex;align-items:center;gap:7px;color:var(--dim);font:11px/1 var(--mono);text-transform:uppercase;letter-spacing:.1em}}
.dot{{width:7px;height:7px;border-radius:50%;background:var(--accent);animation:pulse 2s infinite}}
@keyframes pulse{{50%{{opacity:.3}}}}
@media(prefers-reduced-motion:reduce){{.dot{{animation:none}}}}
.grid{{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;padding:18px 22px;max-width:1760px;margin:0 auto}}
.card{{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:15px 17px}}
.head{{display:flex;align-items:center;gap:12px;margin-bottom:13px}}
.spr{{width:46px;height:46px;border-radius:10px;background:var(--inset);object-fit:cover;flex:none}}
.idb{{flex:none;min-width:0}}
.idb h2{{margin:0;font:700 17px/1.1 var(--f);letter-spacing:-.01em;overflow-wrap:anywhere}}
.idb .sub{{margin:2px 0 0;color:var(--dim);font:11px var(--mono)}}
.types{{display:flex;gap:5px;margin-top:5px;flex-wrap:wrap}}
.tp{{font:700 9.5px/1 var(--f);color:#0b0f16;background:var(--tc);padding:3px 8px;border-radius:5px;text-transform:uppercase;letter-spacing:.05em}}
.head-right{{margin-left:auto;display:flex;align-items:center;gap:10px}}
.pwrap{{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:5px;max-width:420px}}
.pchip{{white-space:nowrap;font:600 11px var(--f);background:var(--inset);border:1px solid var(--line);border-radius:6px;padding:3px 8px}}
.pchip.prio{{border-color:var(--warn)}}
.pchip.status{{background:#eef1f5;border-color:#c9d2de}}
.pchip em{{font-style:normal;color:var(--warn);font-weight:800;font-size:9.5px;margin-left:4px}}
.notebtn{{flex:none;background:none;border:1px solid var(--line);color:var(--dim);font:600 11px var(--f);padding:6px 12px;border-radius:8px;cursor:pointer}}
.notebtn:hover{{color:var(--ink);border-color:var(--dim)}}
.notebtn.hasnote{{color:var(--accent);border-color:var(--accent)}}
.moves{{display:grid;grid-template-columns:repeat(6,1fr);gap:7px;margin-bottom:14px}}
.mv{{display:flex;flex-direction:column;gap:5px;align-items:center;justify-content:center;min-height:42px;padding:6px 4px;background:var(--inset);border:1px solid var(--line);border-radius:8px}}
.mv.status{{background:#eef1f5;border-color:#c9d2de}}
.mv.status .mvb{{background:#c9d2de}}
.mvn{{text-align:center;font:600 11px/1.1 var(--f)}}
.mv.xfmt{{opacity:.62}}
.pchip.xfmt{{opacity:.72}}
.fmt{{font:700 8px var(--mono);color:var(--dim);vertical-align:super;margin-left:1px}}
.mvb{{position:relative;width:100%;height:3px;background:#0a0d13;border-radius:2px;overflow:hidden}}
.mvb i{{display:block;height:100%}}
.mvb u{{position:absolute;top:-1px;width:1px;height:5px;background:var(--dim);opacity:.85}}
.mv.status .mvb u{{background:#7b879b}}
.ann{{margin-left:5px;font:700 9.5px var(--mono);text-decoration:none;opacity:.85}}
.ann.up{{color:var(--accent)}}
.ann.dn{{color:var(--warn)}}
.negrow{{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px;margin:7px 0 2px}}
.nglab{{font:700 8.5px var(--f);color:var(--dim);text-transform:uppercase;letter-spacing:.09em;opacity:.75}}
.ng{{font:11px var(--f);color:var(--dim);opacity:.75}}
.ng u{{margin-left:3px;font:700 9px var(--mono);text-decoration:none;opacity:.7}}
.moves+.negrow{{margin:-6px 0 12px}}
.cbadge{{display:inline-block;margin-top:5px;font:700 8.5px var(--mono);letter-spacing:.08em;
  text-transform:uppercase;color:var(--accent);border:1px solid var(--accent);opacity:.8;
  border-radius:4px;padding:2px 6px}}
.cbadge.glob{{color:var(--dim);border-color:var(--line);opacity:.6}}
.vglobal{{display:none}}
.card.gs .vlocal{{display:none}}
.card.gs .vglobal{{display:block}}
span.cbadge.vglobal{{display:none}}
.card.gs span.cbadge.vlocal{{display:none}}
.card.gs span.cbadge.vglobal{{display:inline-block}}
.cbadge.sw{{cursor:pointer;user-select:none}}
.pwrap.vglobal{{display:none}}
.card.gs .pwrap.vlocal{{display:none}}
.card.gs .pwrap.vglobal{{display:flex}}
.cbadge.sw:hover{{opacity:1;filter:brightness(1.25)}}
.fstat{{font:11px/1 var(--mono);padding:4px 9px;border-radius:6px;border:1px solid var(--line)}}
.fstat.on{{color:var(--accent);border-color:var(--accent)}}
.fstat.off{{color:var(--dim)}}
.gmark{{color:var(--warn);text-decoration:none;opacity:.8;font-size:8.5px;vertical-align:2px}}
.fage{{color:var(--warn);text-decoration:none;font-weight:700;margin-left:3px}}
.detail{{display:grid;grid-template-columns:1fr 1.05fr 1fr 1.35fr;gap:16px;border-top:1px solid var(--line);padding-top:13px}}
.clab{{display:block;margin-bottom:7px;font:700 9.5px var(--f);color:var(--dim);text-transform:uppercase;letter-spacing:.09em}}
.ms{{color:var(--warn);font-size:9px;margin-right:4px;vertical-align:1px}}
.stone{{cursor:pointer;border-radius:5px;padding:1px 4px;margin:0 -4px 5px}}
.stone:hover{{background:rgba(255,157,77,.10)}}
.stone.active{{background:rgba(255,157,77,.17)}}
.cent{{margin-bottom:5px;font:12.5px/1.25 var(--f);overflow-wrap:anywhere}}
.cent b{{font-weight:600}}
.cent i{{font:10px var(--mono);font-style:normal;color:var(--dim);margin-left:5px}}
.cent.dim{{color:var(--dim)}}
.spd{{margin-top:13px;padding-top:11px;border-top:1px solid var(--line);cursor:pointer;user-select:none;display:flex;align-items:baseline;gap:8px}}
.spnum{{font:800 22px/1 var(--mono)}}
.spd>em{{font-style:normal;color:var(--warn);font-size:15px;letter-spacing:-1px;margin-left:-4px}}
.spev{{font:10.5px var(--mono);color:var(--dim)}}
.spd:hover .spnum{{color:var(--accent)}}
.spdelta{{font:700 11px var(--mono);color:var(--accent)}}
.smd{{display:block;font:700 10px var(--mono);color:var(--accent);min-height:12px}}
.notewrap{{margin-top:13px}}
.notearea{{width:100%;min-height:72px;resize:vertical;background:var(--inset);color:var(--ink);border:1px solid var(--line);border-radius:8px;padding:9px 11px;font:13px/1.5 var(--f)}}
.notearea:focus{{outline:none;border-color:var(--accent)}}
.notearea::placeholder{{color:var(--dim)}}
.statwrap{{margin-top:13px;border-top:1px solid var(--line);padding-top:12px}}
.statrow{{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}}
.sm{{text-align:center}}
.smv{{display:block;font:13px/1 var(--mono)}}
.smb{{display:block;height:5px;background:var(--inset);border-radius:3px;overflow:hidden;margin-top:5px}}
.smb i{{display:block;height:100%;background:#4a7fae}}
.card.miss{{opacity:.7}} .nd{{color:var(--dim);font:12px var(--f);margin:6px 0 0}}
.empty{{color:var(--dim);padding:44px 24px}}
</style></head><body>
<header><h1>Champions <b>Scout</b></h1><span class="meta">{meta} · {FORMAT} · {BUILD}</span>{fstat}
<span class="hdr-right"><button class="laybtn" id="rbtn" onclick="rebuild(event)"
  title="update teamsheets — alt/shift-click for a full re-fetch">&#8635; teams</button>
<button class="laybtn" id="gbtn" onclick="setAllScope()">all global</button>
<button class="laybtn" id="allnotes" onclick="toggleAllNotes()">&#9998; All notes</button>
<button class="laybtn" id="lay" onclick="toggleLayout()">3 &times; 2</button>
<span class="live"><span class="dot"></span>live</span></span></header>
{body}
<script>
const V={version};let reloading=false;let building=false;
async function rebuild(ev){{
  const full=ev.altKey||ev.shiftKey;
  if(full&&!confirm('Full rebuild: re-fetch every tournament from scratch, ignoring '
    +'what is already cached. Slow, but the only way to re-parse old teamsheets. Continue?'))return;
  const b=document.getElementById('rbtn');
  building=true;b.classList.add('on');b.textContent='starting…';
  try{{await fetch('/rebuild',{{method:'POST',headers:{{'Content-Type':'application/json'}},
    body:JSON.stringify({{full:full}})}});}}catch(e){{}}
  pollBuild();}}
function pollBuild(){{const b=document.getElementById('rbtn');
  const iv=setInterval(async()=>{{try{{
    const s=await(await fetch('/rebuild_status?t='+Date.now(),{{cache:'no-store'}})).json();
    b.textContent=(s.msg||'working…').slice(0,34);
    if(!s.running){{clearInterval(iv);building=false;b.classList.remove('on');
      if(s.err){{b.classList.add('bad');alert('Rebuild failed: '+s.err);}}
      setTimeout(()=>{{b.innerHTML='&#8635; teams';b.classList.remove('bad');}},4000);}}
  }}catch(e){{clearInterval(iv);building=false;}}}},700);}}
function applyLayout(n){{const g=document.querySelector('.grid');
  if(g)g.style.gridTemplateColumns='repeat('+n+',minmax(0,1fr))';
  const b=document.getElementById('lay');if(b)b.innerHTML=(n==2?'2 &times; 3':'3 &times; 2');
  try{{localStorage.setItem('cols',n);}}catch(e){{}}}}
function toggleLayout(){{let n=2;try{{n=localStorage.getItem('cols')==='2'?3:2;}}catch(e){{}}applyLayout(n);}}
(function(){{let n=3;try{{n=localStorage.getItem('cols')||3;}}catch(e){{}}applyLayout(n);}})();
setInterval(async()=>{{if(building)return;try{{const r=await fetch('/version?t='+Date.now(),{{cache:'no-store'}});
  const j=await r.json();if(j.v!==V){{reloading=true;location.reload();}}}}catch(e){{}}}},1000);
function setScope(card,g){{card.classList.toggle('gs',g);
  try{{localStorage.setItem('gs:'+card.dataset.slug,g?'1':'0');}}catch(e){{}}
  if(card.dataset.megas)applyForm(card);}}
function toggleScope(el){{const c=el.closest('.card');setScope(c,!c.classList.contains('gs'));}}
function setAllScope(){{const cards=document.querySelectorAll('.card .cbadge.sw.vlocal');
  // if anything is still local, push everything global; otherwise pull everything back
  let anyLocal=false;
  document.querySelectorAll('.card').forEach(function(c){{
    if(c.querySelector('.cbadge.sw')&&!c.classList.contains('gs'))anyLocal=true;}});
  document.querySelectorAll('.card').forEach(function(c){{
    if(c.querySelector('.cbadge.sw'))setScope(c,anyLocal);}});
  const b=document.getElementById('gbtn');if(b)b.classList.toggle('on',anyLocal);}}
(function(){{document.querySelectorAll('.card').forEach(function(c){{
  if(!c.querySelector('.cbadge.sw'))return;
  try{{if(localStorage.getItem('gs:'+c.dataset.slug)==='1')c.classList.add('gs');}}catch(e){{}}}});}})();
let notesOpen=false;
function toggleAllNotes(){{notesOpen=!notesOpen;
  document.querySelectorAll('.notewrap').forEach(function(w){{if(notesOpen)w.removeAttribute('hidden');else w.setAttribute('hidden','');}});
  const b=document.getElementById('allnotes');if(b)b.classList.toggle('on',notesOpen);}}
function toggleNote(b){{const w=b.closest('.card').querySelector('.notewrap');if(!w)return;
  if(w.hasAttribute('hidden')){{w.removeAttribute('hidden');const t=w.querySelector('textarea');
    t.focus();t.setSelectionRange(t.value.length,t.value.length);}}else w.setAttribute('hidden','');}}
function toggleStats(el){{const w=el.closest('.card').querySelector('.statwrap');if(!w)return;
  if(w.hasAttribute('hidden'))w.removeAttribute('hidden');else w.setAttribute('hidden','');}}
function ucolor(p){{if(p==null)return 'var(--dim)';p=Math.max(0,Math.min(100,p));return 'hsl('+(p*1.2).toFixed(0)+' 80% 63%)';}}
function abHtml(list){{return list.map(function(a){{return '<div class="cent"><b style="color:'+ucolor(a[1])+'">'+a[0]+'</b><i>'+Math.round(a[1])+'%</i></div>';}}).join('');}}
function scolor(v){{v=Math.max(0,Math.min(200,v));return 'hsl('+(v/200*120).toFixed(0)+' 78% 58%)';}}
function applyForm(card){{const megas=JSON.parse(card.dataset.megas||'[]');
  const on=card.dataset.on==='1';const v=parseInt(card.dataset.v||'0');
  const base=JSON.parse(card.dataset.base);
  const d=(on&&megas[v])?megas[v]:base;
  // both the local and global variant blocks are in the DOM, so update ALL matches
  card.querySelectorAll('.spnum').forEach(function(num){{
    num.textContent=d.speed;num.style.color=scolor(d.speed);}});
  const diff=d.speed-base.speed;
  card.querySelectorAll('.spdelta').forEach(function(sd){{
    sd.textContent=on&&diff!==0?(diff>0?'+':'')+diff:'';}});
  const svs=card.querySelectorAll('.smv'),sbs=card.querySelectorAll('.smb i'),sds=card.querySelectorAll('.smd');
  d.stats.forEach(function(val,i){{if(svs[i]){{svs[i].textContent=val;svs[i].style.color=scolor(val);
    sbs[i].style.width=Math.min(100,Math.round(val/200*100))+'%';sbs[i].style.background=scolor(val);
    const df=val-base.stats[i];if(sds[i])sds[i].textContent=on&&df!==0?(df>0?'+':'')+df:'';}}}});
  card.querySelectorAll('.abents').forEach(function(ab){{
    if(ab.dataset.orig===undefined)ab.dataset.orig=ab.innerHTML;   // stash once
    ab.innerHTML=on?abHtml(d.ability):ab.dataset.orig;}});          // each variant its own
  card.querySelectorAll('.stone').forEach(function(s){{s.classList.remove('active');}});
  if(on)card.querySelectorAll('.stone[data-v="'+v+'"]').forEach(function(s){{s.classList.add('active');}});}}
function saveForm(card){{try{{localStorage.setItem('mega:'+card.dataset.slug,
  JSON.stringify({{on:card.dataset.on==='1',v:parseInt(card.dataset.v||'0')}}));}}catch(e){{}}}}
function loadForm(card){{try{{const s=JSON.parse(localStorage.getItem('mega:'+card.dataset.slug)||'null');
  if(s){{card.dataset.on=s.on?'1':'0';card.dataset.v=String(s.v||0);}}}}catch(e){{}}}}
function toggleStone(el){{const card=el.closest('.card');const v=el.dataset.v;
  if(card.dataset.on==='1'&&card.dataset.v===v){{card.dataset.on='0';}}
  else{{card.dataset.on='1';card.dataset.v=v;}}
  applyForm(card);saveForm(card);
  const w=card.querySelector('.statwrap');if(w)w.removeAttribute('hidden');}}
(function(){{document.querySelectorAll('.card[data-megas]').forEach(function(c){{loadForm(c);applyForm(c);}});}})();
async function saveNote(t){{try{{await fetch('/note',{{method:'POST',
  headers:{{'Content-Type':'application/json'}},
  body:JSON.stringify({{slug:t.dataset.slug,text:t.value}})}});
  t.closest('.card').querySelector('.notebtn').classList.toggle('hasnote',!!t.value.trim());
}}catch(e){{}}}}
document.addEventListener('focusout',e=>{{if(e.target.classList.contains('notearea')&&!reloading)
  saveNote(e.target);}});
</script>
</body></html>"""

# ================================================================ SERVER (one port)
app = Flask(__name__)
VERSION = 0
_lock = threading.Lock()

@app.route("/upload", methods=["POST"])
def upload():
    data = request.get_data(parse_form_data=False)
    print(f"Received {len(data)} bytes")
    if not data or len(data) < 100:
        return "No data or file too small", 400
    path = os.path.join(SHOTS_DIR, f"screenshot_{int(time.time())}.jpg")
    with open(path, "wb") as f:
        f.write(data)
    global VERSION
    with _lock:
        VERSION += 1
    print(f"Saved {os.path.basename(path)} (v{VERSION})")
    return "Upload successful", 200

@app.route("/version")
def version():
    r = jsonify(v=VERSION)
    r.headers["Cache-Control"] = "no-store"
    return r

@app.route("/note", methods=["POST"])
def note():
    j = request.get_json(force=True, silent=True) or {}
    if j.get("slug"):
        save_note(j["slug"], j.get("text", ""))
    return jsonify(ok=True)

_RB = {"running": False, "msg": "", "err": "", "at": 0.0}
_rb_lock = threading.Lock()

def _rebuild_worker(fresh):
    global VERSION
    fmt = FINDER_FMT if FINDER_FMT and FINDER_FMT != "?" else TEAM_FORMAT
    try:
        vf.build(fmt, fresh=fresh, progress=lambda m: _RB.update(msg=m, at=time.time()))
        reload_finder()
        with _lock:
            VERSION += 1                      # browsers reload onto the new data
        _RB.update(msg=f"done — {len(FINDER_TEAMS)} teams", err="")
    except Exception as e:
        _RB.update(err=str(e)[:200], msg="failed")
        print(f"[rebuild] {e}")
    finally:
        _RB["running"] = False

@app.route("/rebuild", methods=["POST"])
def rebuild():
    j = request.get_json(force=True, silent=True) or {}
    with _rb_lock:
        if _RB["running"]:
            return jsonify(ok=False, reason="already running")
        _RB.update(running=True, msg="starting", err="", at=time.time())
    fresh = bool(j.get("full"))
    threading.Thread(target=_rebuild_worker, args=(fresh,), daemon=True).start()
    print(f"[rebuild] started ({'full' if fresh else 'incremental'})")
    return jsonify(ok=True)

@app.route("/rebuild_status")
def rebuild_status():
    r = jsonify(**_RB)
    r.headers["Cache-Control"] = "no-store"
    return r

@app.route("/")
def home():
    return Response(page(VERSION), mimetype="text/html")

if __name__ == "__main__":
    print("-" * 54)
    print(f"BUILD {BUILD}")
    if REFRESH_DAYS > 0:
        threading.Thread(target=_auto_refresh_loop, daemon=True).start()
        print(f"Auto-refresh every {REFRESH_DAYS} day(s)")
    print(f"Uploads   ->  http://<laptop-ip>:{PORT}/upload")
    print(f"Dashboard ->  http://localhost:{PORT}/")
    print(f"Saving to {SHOTS_DIR}")
    print("-" * 54)
    webbrowser.open(f"http://localhost:{PORT}/")
    app.run(host="0.0.0.0", port=PORT, threaded=True)