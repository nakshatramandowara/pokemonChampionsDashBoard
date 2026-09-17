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
import damage, bridge
from PIL import Image
from flask import Flask, request, Response, jsonify
import socket

PORT      = 5000
ip = socket.gethostbyname(socket.gethostname())
print(f"Upload  ->  http://{ip}:{PORT}/upload")
# ================================================================ CONFIG
REF_DIR   = r"C:\Users\naksh\OneDrive\Desktop\thinkpad backup\pokeicons"
SHOTS_DIR = r"C:\Users\naksh\OneDrive\Desktop\thinkpad backup\pokemonChampionsDashB\Screenshots"
SIZE      = 64
RED       = (133, 2, 52)
BOX       = lambda d: (1866, 155 + 126 * d, 1978, 267 + 126 * d)
FORMAT    = "Doubles"            # "Doubles" or "Singles"  (primary format)
OTHER     = "Singles" if FORMAT == "Doubles" else "Doubles"
MERGE_FORMATS = True             # union move usage across both formats (surfaces more moves)
TOP_P     = 85.0
TOP_P_CAP = 5

BUILD     = "2026-08-15-damage"  # visible in header + startup log to confirm live code

# --- teamsheet conditioning (vgcfinder) ---
DIVERGE     = 20.0   # pp gap before the global figure is annotated / a negative is shown
COND_MIN    = 1      # use the exact match whenever one exists at all; n is shown in the header
COUNT_MODE  = 10     # at or below this many teams, show "7/8" instead of "88%"
MOVE_FLOOR  = 4      # always render at least this many move cells
MOVE_CAP    = 12     # never render more than this many
MOVE_MIN_P  = 5.0    # conditioned moves below this % are dropped once the floor is met
FINDER_STALE_DAYS = 7   # past this, the header flags the teamsheet cache age
TEAM_FORMAT = "M-C"     # regulation to build teamsheets for when no cache exists yet
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
# The index slugifies its own display name: "Toxtricity-Low-Key" -> toxtricity-low-key,
# "Tauros-Paldea-Aqua" -> tauros-paldea-aqua, "Farfetch'd" -> farfetch-d. A sprite tag is
# those same form words with underscores for spaces, so base + "-" + tag is the right slug
# for nearly every form. championsbattledata.com used PokeAPI-style names instead
# ("alolan-ninetales", "paldean-tauros-aqua-breed") until the M-C update flipped it to this
# Showdown-style scheme -- which is what silently turned every regional form into its base.
FORM_FIX = {"Jumbo": "super",       # the index calls Gourgeist's biggest size Super
            "Female": "f"}          # Meowstic / Basculegion / Indeedee
# PokeAPI drops the apostrophe that the index writes as a hyphen.
BASE_FIX = {"farfetchd": "farfetch-d", "sirfetchd": "sirfetch-d"}
# A regional form is a different Pokemon, not a skin, so it is NEVER resolved by falling
# back to the base species -- that is exactly how Alolan Raichu quietly reads as Raichu.
# If one fails to resolve the card shows no data and startup says so, loudly.
REGIONAL = {"Alola", "Galar", "Hisui", "Paldea"}

def _candidates(tag, base):
    if tag is None:
        return [base, base + "-male", base + "-m", base + "-ordinary"]
    return [f"{base}-{FORM_FIX.get(tag, tag.lower().replace('_', '-'))}"]

_form_miss = []          # regional sprites with no index entry; reported at startup

def label_to_slug(label):
    s = label.replace("_shiny", "").replace("_Mega", "")
    m = re.search(r"(\d{4})(?:-([A-Za-z0-9_%]+))?", s)
    if not m:
        return None
    dex, tag = m.group(1), m.group(2)
    base = dex_to_slug.get(dex)
    if base is None:
        return None
    base = BASE_FIX.get(base, base)
    for c in _candidates(tag, base):
        if c in BY_SLUG:
            return c
    if tag and tag.split("_")[0] in REGIONAL:
        if label not in _form_miss:
            _form_miss.append(label)
        return None
    if base in BY_SLUG:
        return base
    # base species absent from the index (Vivillon, Gourgeist): only formes exist, so the
    # first one is as good a read as any -- they share a stat line
    return next((k for k in sorted(BY_SLUG) if k.startswith(base)), None)

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

def _audit_sprites():
    """Resolve every form sprite once at startup. When the index renamed its slugs at M-C
    every regional form silently collapsed onto its base species; this is the line that
    makes the next such change visible instead of silent."""
    forms = fell = 0
    for lbl in _labels:
        if "_shiny" in lbl:
            continue
        m = re.search(r"(\d{4})-([A-Za-z0-9_%]+)", lbl)
        if not m:
            continue
        # compare against the same dex number with no form tag: still equal means the
        # form was not found and we are reading the base species' data
        if label_to_slug(lbl) == label_to_slug(f"Menu_CP_{m.group(1)}"):
            fell += 1
        else:
            forms += 1
    print(f"Sprites: {forms} form variants resolved, {fell} read as base species")
    if _form_miss:
        print("  !! regional forms missing from the index, cards will show NO data: "
              + ", ".join(_form_miss))

_audit_sprites()

# ================================================================ DAMAGE SETUP
# The calculator names species its own way ("Ninetales-Alola" where the index
# says "Alolan Ninetales"), so every index entry is bridged once at startup.
DEX_NAME = {}          # index slug        -> Champions dex name
DEX_MEGAS = {}         # Champions dex name -> [(stone, info)], X before Y

def _init_damage():
    try:
        dex = damage.dex_names()
        stones = damage._stones()
    except Exception as e:
        print(f"[dmg] calculator unavailable, damage rows off: {e}")
        return False
    if not dex:
        print("[dmg] calculator returned no dex, damage rows off")
        return False

    resolve = bridge.build(dex)
    base_by_dex, misses = {}, []
    for e in INDEX.get("pokemon", []):
        hit, _how = resolve(e.get("name", ""))
        if hit is None:
            misses.append(f"{e.get('slug')} ({e.get('name')})")
            continue
        DEX_NAME[e["slug"]] = hit
        base_by_dex[hit] = (e.get("summary", {}) or {}).get("baseStats", {})

    for stone, info in stones.items():
        DEX_MEGAS.setdefault(info["base"], []).append((stone, info))
    for base in DEX_MEGAS:                       # X before Y, matching _megas_of
        DEX_MEGAS[base].sort(key=lambda si: ("X" not in si[0], "Y" not in si[0]))

    print(f"[dmg] bridged {len(DEX_NAME)}/{len(INDEX.get('pokemon', []))} index names")
    if misses:
        print(f"[dmg] no dex match: {', '.join(misses[:12])}")
    try:
        damage.load_team(base_by_dex)
    except Exception as e:
        print(f"[dmg] could not load myteam.json: {e}")
        return False
    return True

DAMAGE_ON = _init_damage()

# ================================================================ TEAMSHEETS (vgcfinder)
import vgcfinder as vf

FINDER_TEAMS, FINDER_BUILT, FINDER_FMT, FINDER_KEYS = [], None, "?", set()
_BY_TOKENS = {}          # frozenset(tokens) -> norm key
_FINDER_MTIME = 0.0

# Limitless names a region as an adjective ("Hisuian Arcanine"); the index names it as a
# suffix ("arcanine-hisui"). Same word, different form, so the token sets never met and
# every regional form fell through to the species fallback -- Hisuian Arcanine reading
# regular Arcanine's sets. Fold both spellings onto one token.
_REGION_TOK = {"alolan": "alola", "galarian": "galar",
               "hisuian": "hisui", "paldean": "paldea"}

def _toks(s):
    return frozenset(_REGION_TOK.get(t, t)
                     for t in re.split(r"[^a-z0-9]+", (s or "").lower()) if t)

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
            print(f"Teamsheets: none — run `python vgcfinder.py build --format {TEAM_FORMAT}`")

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
# droppable only when unambiguous. "flower" is for Limitless's "Eternal Flower Floette",
# which the index calls floette-eternal.
_NOISE = {"forme", "form", "mode", "breed", "mask", "flower"}

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

# ---- notes on a whole enemy team ------------------------------------------
# Keyed by the six Pokemon themselves, not by any teamsheet match, so a team the
# finder has never seen still gets notes. Sorted, so team-preview order does not
# matter. A Pokemon we failed to recognise contributes its sprite label instead,
# which keeps the key stable for that same unrecognised team.
TEAM_NOTES_FILE = "teamnotes.json"
TEAM_NOTES = (json.load(open(TEAM_NOTES_FILE, encoding="utf-8"))
              if os.path.exists(TEAM_NOTES_FILE) else {})
_tnotes_lock = threading.Lock()

def team_key(cards):
    if not cards:
        return ""
    parts = [(c.get("slug") or ("?" + str(c.get("label", "")))) for c in cards]
    return "|".join(sorted(parts))

def team_label(cards):
    """Human-readable version of the key, for the notes header."""
    out = []
    for c in cards:
        d = c.get("data") or {}
        out.append(d.get("name") or c.get("slug") or "?")
    return " / ".join(out)

def save_team_note(key, text):
    if not key:
        return
    with _tnotes_lock:
        if text.strip():
            TEAM_NOTES[key] = text
        else:
            TEAM_NOTES.pop(key, None)
        json.dump(TEAM_NOTES, open(TEAM_NOTES_FILE, "w", encoding="utf-8"),
                  ensure_ascii=False, indent=0)

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

SPREAD_KEYS = [("hp", "hp_points"), ("at", "attack_points"), ("df", "defense_points"),
               ("sa", "sp_atk_points"), ("sd", "sp_def_points"), ("sp", "speed_points")]

def _spread_rows(rows):
    """Raw stat-point spreads, most common first, for the damage calculator."""
    out = []
    for r in sorted(rows, key=lambda r: -_pct(r))[:TOP_P_CAP]:
        out.append({"label": _spread_str(r), "pct": _pct(r),
                    "points": {short: int(r.get(key) or 0) for short, key in SPREAD_KEYS}})
    return out or [{"label": "0/0/0/0/0/0", "pct": 0.0,
                    "points": {short: 0 for short, _k in SPREAD_KEYS}}]

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
    # damage: spreads keep their raw stat points, and the defending nature is
    # taken as the most common one (see note in the damage row)
    out["spread_rows"] = _spread_rows(by_cat.get("stat_points", []))
    out["nature_top"] = out["nature"][0][0] if out["nature"] else None
    out["dexname"] = DEX_NAME.get(slug)
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
        # extract() keeps priority moves OUT of the grid because they are shown
        # as header chips; the conditioned path has to do the same or they
        # render twice (Extreme Speed appearing as both chip and grid cell).
        promoted = {h[0] for h in d["head"]}
        d["moves"] = [m for m in mv if m[0] not in promoted]
    return d

# ================================================================ DAMAGE
# Every spread, every enemy forme and both of my mega states in one pass
# (~700ms worst case), started in the background so cards render immediately.
# The page then holds the whole grid and every toggle is a local lookup.
_DMG = {"key": None, "ready": False, "grids": [], "rev": [], "hp": {}, "mymega": []}
_dmg_lock = threading.Lock()

def _enemy_specs(cards):
    specs = []
    for c in cards:
        d = c.get("data") or {}
        dexname = d.get("dexname")
        if not dexname:
            specs.append(None)
            continue
        e = BY_SLUG.get(c["slug"], {})
        specs.append({
            "name": dexname,
            "base": (e.get("summary", {}) or {}).get("baseStats", {}),
            "nature": d.get("nature_top"),
            "spreads": d.get("spread_rows") or [],
            "megas": [{"name": i["forme"], "base": i["bs"]}
                      for _s, i in DEX_MEGAS.get(dexname, [])],
            # both scopes' move lists: conditioning can swap the grid entirely,
            # and either one may be on screen when a move is clicked
            "moves": _enemy_moves(c),
        })
    return specs

def _enemy_moves(card):
    """Every move name that could appear in this card's grid, in either scope."""
    names = []
    for blob in (card.get("data"), card.get("gdata")):
        if not blob:
            continue
        for entry in blob.get("moves", []):
            n = entry[0]
            if n and n not in names and not is_status(n):
                names.append(n)
        for entry in blob.get("head", []):
            n = entry[0]
            if n and n not in names and not is_status(n):
                names.append(n)
    return names

def _damage_worker(key, cards):
    specs = _enemy_specs(cards)
    real = [s for s in specs if s]
    grids = []
    if real:
        try:
            computed = damage.compute_all(real)
        except Exception as e:
            print(f"[dmg] outgoing failed: {e}")
            computed = []
        try:
            incoming = damage.compute_incoming(real)
        except Exception as e:
            print(f"[dmg] incoming failed: {e}")
            incoming = []
        it, it2 = iter(computed), iter(incoming)
        grids = [next(it, {}) if s else {} for s in specs]
        rev = [next(it2, {}) if s else {} for s in specs]
    else:
        grids = [{} for _s in specs]
        rev = [{} for _s in specs]
    with _dmg_lock:
        if _DMG["key"] == key:
            _DMG["grids"] = grids
            _DMG["rev"] = rev
            _DMG["hp"] = damage.team_hp()
            _DMG["mymega"] = damage.team_megas()
            _DMG["ready"] = True
            moves = sum(len(v) for g in rev for v in g.values())
            print(f"[dmg] ready for {key} ({moves} move readings)")

def start_damage(key, cards):
    if not DAMAGE_ON:
        return
    with _dmg_lock:
        if _DMG["key"] == key:
            return                       # already done or in flight for this shot
        _DMG.update(key=key, ready=False, grids=[], rev=[], hp={}, mymega=[])
    threading.Thread(target=_damage_worker, args=(key, cards), daemon=True).start()

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
    shot = os.path.basename(latest)
    start_damage(shot, cards)
    return shot, cards, fin

# ================================================================ RENDER
TYPE_COLORS = {"Normal":"#9fa4b0","Fire":"#ff8a4c","Water":"#4d9be6","Electric":"#f4cf3c",
    "Grass":"#5dc264","Ice":"#79d0cf","Fighting":"#e5546c","Poison":"#b160d4","Ground":"#e0a34a",
    "Flying":"#93a8e6","Psychic":"#fb7189","Bug":"#a2c520","Rock":"#c9b878","Ghost":"#7d5ba3",
    "Dragon":"#5b6ee1","Dark":"#6a6480","Steel":"#6fa3b8","Fairy":"#f18fd8"}

def usage_color(p, dark=False):
    if p is None:
        return "var(--dim)"
    p = max(0.0, min(100.0, p))
    return f"hsl({p * 1.2:.0f} {'72% 40%' if dark else '80% 63%'})"

def _move_cell(n, p, status, tag="", g=None):
    """A move in the enemy's grid. Damaging moves are clickable: they reveal
    what that move does to my six, in raw HP."""
    col = usage_color(p, dark=status)
    w = min(100, p) if p is not None else 0
    cls = "mv" + (" status" if status else "") + (" xfmt" if tag else "")
    sup = f'<sup class="fmt">{tag}</sup>' if tag else ""
    # tick sits at the global usage, so the gap to the bar edge IS the divergence
    tick = f'<u style="left:{min(100, g):.0f}%"></u>' if g is not None else ""
    hook = "" if status else f' data-mv="{html.escape(n, quote=True)}" onclick="pickMove(this)"'
    if not status:
        cls += " hit"
    return (f'<span class="{cls}"{hook}><span class="mvn" style="color:{col}">{n}{sup}</span>'
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
        # priority moves live up here rather than in the grid, but a damaging
        # one still needs to open the incoming row
        hook = ""
        if not status:
            c += " hit"
            hook = f' data-mv="{html.escape(n, quote=True)}" onclick="pickMove(this)"'
        out += f'<span class="{c}" style="color:{col}"{hook}>{n}{badge}</span>'
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

def spread_col(lab, ents):
    """cat_col, but each spread is selectable and drives the damage row."""
    rows = ""
    for i, e in enumerate(ents):
        sel = " sel" if i == 0 else ""
        rows += (f'<div class="cent spr-pick{sel}" data-si="{i}" onclick="pickSpread(this)">'
                 f'<b style="color:{usage_color(e[1])}">{e[0]}</b>'
                 f'<i>{e[1]:.0f}%</i></div>')
    rows = rows or '<div class="cent dim">&mdash;</div>'
    return f'<div class="ccol"><span class="clab">{lab}</span>{rows}</div>'

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
              spread_col(slab, d["spread"]))
    moves = "".join(_move_cell(n, p, is_status(n), tag, g)
                    for n, p, tag, g in d["moves"][:MOVE_CAP]) or '<span class="nd">no move data</span>'
    return (f'<div class="vbox {cls}"><div class="moves">{moves}</div>'
            f'<div class="revrow" hidden></div>'
            f'{neg_row(d.get("moves_neg", []), "not run")}'
            f'<div class="detail">{detail}</div></div>')

def dmg_btn():
    if not DAMAGE_ON:
        return ""
    return ('<button class="notebtn dmgbtn" type="button" '
            'onclick="toggleDmg(this)">&#9876; Dmg</button>')

def dmg_wrap():
    if not DAMAGE_ON:
        return ""
    return ('<div class="dmgwrap" hidden><div class="dmgrow">'
            '<span class="dmgwait">calculating&hellip;</span></div></div>')

def card_html(c, ei=0):
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
    return f"""<article class="{ccls}" data-ei="{ei}" data-slug="{slug or ''}"{data_attrs}>
      <div class="head"><img class="spr" src="{c['thumb']}">
        <div class="idb"><h2>{d['name']}</h2><div class="types">{badges}</div>{cbadge}</div>
        <div class="head-right">{chips}{dmg_btn()}{note_btn(slug)}</div></div>
      {body}
      {dmg_wrap()}
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

def team_note_panel(cards):
    """Notes for this exact six, independent of whether a teamsheet matched."""
    if not cards:
        return "", False
    key = team_key(cards)
    val = html.escape(TEAM_NOTES.get(key, ""))
    has = bool(TEAM_NOTES.get(key))
    panel = (f'<div class="tnwrap" hidden><div class="tnhead">'
             f'<span class="tnlab">Team notes</span>'
             f'<span class="tnwho">{html.escape(team_label(cards))}</span></div>'
             f'<textarea class="tnarea" data-key="{html.escape(key, quote=True)}" '
             f'placeholder="How this team plays, what it led with, what to watch for&hellip;"'
             f'>{val}</textarea></div>')
    return panel, has

def page(version):
    shot, cards, fin = scan()
    tcol = json.dumps(TYPE_COLORS)          # damage chips are coloured by move type
    tnote, tnote_has = team_note_panel(cards)
    tnbtn = (f'<button class="laybtn{" on" if tnote_has else ""}" id="tnbtn" '
             f'onclick="toggleTeamNote()">&#9998; Team</button>') if cards else ""
    body = (f'<div class="grid">{"".join(card_html(c, i) for i, c in enumerate(cards))}</div>'
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
.dmgwrap{{margin-top:12px;border-top:1px solid var(--line);padding-top:11px}}
.dmgrow{{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px 16px}}
.dmgwait{{color:var(--dim);font:11px var(--mono)}}
.dmgcell{{display:flex;align-items:center;gap:7px;min-width:0}}
.dmgname{{font:600 11px var(--f);color:var(--dim);white-space:nowrap;
  flex:0 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;max-width:96px}}
.dmgmvs{{display:flex;align-items:center;gap:4px;margin-left:auto}}
.dmgmv{{font:700 10.5px/1 var(--mono);border-radius:5px;padding:3px 6px;
  min-width:30px;text-align:center;cursor:help}}
.dmgms{{cursor:pointer;color:var(--dim);font-size:12px;line-height:1;flex:none;
  user-select:none;display:inline-flex;align-items:center;justify-content:center;
  width:26px;height:26px;margin:-7px -5px -7px -7px;border-radius:6px;
  transition:background .12s,color .12s}}
.dmgms:hover{{background:rgba(255,157,77,.14);color:var(--warn)}}
.dmgms:active{{background:rgba(255,157,77,.26)}}
.dmgms.on{{color:var(--warn)}}
.dmgbtn.hasnote{{color:var(--warn);border-color:var(--warn)}}
.mv.hit{{cursor:pointer}}
.pchip.hit{{cursor:pointer}}
.pchip.hit:hover{{border-color:var(--accent)}}
.pchip.sel{{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent)}}
.mv.hit:hover{{border-color:var(--accent)}}
.mv.sel{{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent)}}
.tnwrap{{max-width:1760px;margin:16px auto -2px;padding:0 22px}}
.tnhead{{display:flex;align-items:baseline;gap:10px;margin-bottom:7px}}
.tnlab{{font:700 9.5px var(--f);color:var(--dim);text-transform:uppercase;letter-spacing:.09em}}
.tnwho{{font:11px var(--mono);color:var(--dim);opacity:.75;overflow:hidden;
  text-overflow:ellipsis;white-space:nowrap}}
.tnarea{{width:100%;min-height:84px;resize:vertical;background:var(--panel);color:var(--ink);
  border:1px solid var(--line);border-radius:10px;padding:11px 13px;font:13px/1.55 var(--f)}}
.tnarea:focus{{outline:none;border-color:var(--accent)}}
.tnarea::placeholder{{color:var(--dim)}}
.revrow[hidden]{{display:none}}
.revrow{{display:flex;flex-wrap:wrap;align-items:baseline;gap:5px 14px;
  margin:-6px 0 12px;padding:8px 10px;background:var(--inset);
  border:1px solid var(--line);border-radius:8px}}
.revlab{{font:700 8.5px var(--f);color:var(--dim);text-transform:uppercase;
  letter-spacing:.09em;width:100%;margin-bottom:-2px;display:flex;align-items:center}}
.revx{{margin-left:auto;cursor:pointer;font:400 15px/1 var(--f);color:var(--dim);
  width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;
  margin-top:-5px;margin-right:-4px;border-radius:5px}}
.revx:hover{{color:var(--ink);background:rgba(255,255,255,.07)}}
.revc{{display:flex;align-items:baseline;gap:5px;font:11.5px var(--mono)}}
.revc span{{color:var(--dim);font:600 11px var(--f);white-space:nowrap;
  overflow:hidden;text-overflow:ellipsis;max-width:96px}}
.revc .dmgms{{max-width:none;font-size:11px;width:22px;height:22px;margin:-6px -3px -6px -6px}}
.revc b{{font-weight:700}}
.revc u{{text-decoration:none;color:var(--dim);font-size:9.5px}}
.spr-pick{{cursor:pointer;border-radius:5px;padding:1px 4px;margin:0 -4px 5px}}
.spr-pick:hover{{background:rgba(84,214,191,.10)}}
.spr-pick.sel{{background:rgba(84,214,191,.15)}}
.card.miss{{opacity:.7}} .nd{{color:var(--dim);font:12px var(--f);margin:6px 0 0}}
.empty{{color:var(--dim);padding:44px 24px}}
</style></head><body>
<header><h1>Champions <b>Scout</b></h1><span class="meta">{meta} · {FORMAT} · {BUILD}</span>{fstat}
<span class="hdr-right"><button class="laybtn" id="rbtn" onclick="rebuild(event)"
  title="update teamsheets — alt/shift-click for a full re-fetch">&#8635; teams</button>
<button class="laybtn" id="gbtn" onclick="setAllScope()">all global</button>
{tnbtn}<button class="laybtn" id="allnotes" onclick="toggleAllNotes()">&#9998; All notes</button>
<button class="laybtn" id="lay" onclick="toggleLayout()">3 &times; 2</button>
<span class="live"><span class="dot"></span>live</span></span></header>
{tnote}
{body}
<script>
const V={version};let reloading=false;let building=false;
const TCOL={tcol};
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
  const j=await r.json();if(j.v!==V){{reloading=true;location.reload();}}
  else if(j.d&&!dmgLoaded)loadDamage();}}catch(e){{}}}},1000);
function setScope(card,g){{card.classList.toggle('gs',g);
  try{{localStorage.setItem('gs:'+card.dataset.slug,g?'1':'0');}}catch(e){{}}
  if(card.dataset.megas)applyForm(card);}}
function toggleScope(el){{const c=el.closest('.card');setScope(c,!c.classList.contains('gs'));
  repaintOpenReverse(c);}}
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
function toggleTeamNote(){{const w=document.querySelector('.tnwrap');if(!w)return;
  const b=document.getElementById('tnbtn');
  if(w.hasAttribute('hidden')){{w.removeAttribute('hidden');
    const t=w.querySelector('textarea');t.focus();
    t.setSelectionRange(t.value.length,t.value.length);}}
  else{{w.setAttribute('hidden','');
    if(b)b.classList.toggle('on',!!w.querySelector('textarea').value.trim());}}}}
async function saveTeamNote(t){{try{{await fetch('/teamnote',{{method:'POST',
  headers:{{'Content-Type':'application/json'}},
  body:JSON.stringify({{key:t.dataset.key,text:t.value}})}});
  const b=document.getElementById('tnbtn');
  if(b)b.classList.toggle('on',!!t.value.trim());}}catch(e){{}}}}
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
  applyForm(card);saveForm(card);paintDamage(card);repaintOpenReverse(card);
  const w=card.querySelector('.statwrap');if(w)w.removeAttribute('hidden');}}
(function(){{document.querySelectorAll('.card[data-megas]').forEach(function(c){{loadForm(c);applyForm(c);}});}})();
/* ---- damage ------------------------------------------------------------
   DMG[cardIndex][spreadIndex + ':' + enemyForme][myMegaScope] -> six cells.
   The server computes every combination once, so nothing here refetches.
   myMegaOff holds the names I have chosen NOT to mega. */
let DMG=null,REV=null,MYHP=null,MYMEGA=null,dmgLoaded=false,myMegaOff=new Set();
try{{myMegaOff=new Set(JSON.parse(localStorage.getItem('nomega')||'[]'));}}catch(e){{}}
function dcolor(p){{p=Math.max(0,Math.min(150,p));return 'hsl('+(p*0.8).toFixed(0)+' 80% 63%)';}}
// Display name for the damage rows. Regional and paldean forms drop the suffix
// (Arcanine-Hisui -> Arcanine), megas keep just the designator
// (Mega Charizard X -> M-Charizard X). CSS truncates anything still too long and
// the full name stays on the title attribute.
function shortName(name){{
  const s=String(name);
  const mega=s.match(/^Mega (.+)$/);
  if(mega)return 'M-'+mega[1];
  return s.split('-')[0];}}
// The type palette spans Electric (#f4cf3c, very light) to Dark (#6a6480), so no
// single ink colour stays legible on all of them. Pick whichever of near-black or
// white has the better WCAG contrast ratio against each chip.
function _lum(hex){{
  const v=[1,3,5].map(function(i){{
    let c=parseInt(hex.substr(i,2),16)/255;
    return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);}});
  return 0.2126*v[0]+0.7152*v[1]+0.0722*v[2];}}
function _ratio(a,b){{const x=_lum(a),y=_lum(b);
  return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05);}}
function _mix(hex,t,toward){{           // blend hex toward black (0) or white (255)
  const p=[1,3,5].map(function(i){{
    const c=parseInt(hex.substr(i,2),16);
    return Math.round(c+(toward-c)*t);}});
  return '#'+p.map(function(c){{return c.toString(16).padStart(2,'0');}}).join('');}}
const DARK_INK='#0b0f16',LIGHT_INK='#ffffff',AA=4.5;
const _CHIP={{}};
// Returns the background and ink to use together. Most type colours clear AA
// against near-black as-is; the few that do not (Dragon) get nudged a step at a
// time toward black or white until they do, which keeps the hue recognisable.
function chip(bg){{
  if(_CHIP[bg])return _CHIP[bg];
  let out={{bg:bg,fg:DARK_INK}};
  try{{
    const useLight=_ratio(bg,LIGHT_INK)>_ratio(bg,DARK_INK);
    const fg=useLight?LIGHT_INK:DARK_INK;
    let b=bg;
    for(let i=0;i<8&&_ratio(b,fg)<AA;i++)b=_mix(b,0.07,useLight?0:255);
    out={{bg:b,fg:fg}};
  }}catch(e){{}}
  return _CHIP[bg]=out;}}
function enemyForme(card){{return card.dataset.on==='1'?(card.dataset.v||'0'):'b';}}
function spreadIndex(card){{const s=card.querySelector('.spr-pick.sel');return s?s.dataset.si:'0';}}
function paintDamage(card){{
  const row=card.querySelector('.dmgrow');if(!row)return;
  const ei=card.dataset.ei;
  if(!DMG||!DMG[ei]){{row.innerHTML='<span class="dmgwait">calculating&hellip;</span>';return;}}
  const grid=DMG[ei][spreadIndex(card)+':'+enemyForme(card)];
  if(!grid){{row.innerHTML='<span class="dmgwait">no data for this spread</span>';return;}}
  const on=grid.on||[],off=grid.off||[];let html='';
  for(let i=0;i<on.length;i++){{
    const canMega=on[i].mega,useMega=canMega&&!myMegaOff.has(on[i].name);
    const cell=(useMega?on:off)[i]||on[i];
    const stone=canMega?'<span class="dmgms'+(useMega?' on':'')
      +'" data-mon="'+cell.name+'" title="toggle Mega">&#9670;</span>':'';
    const mvs=(cell.moves||[]).map(function(m){{
      const st=chip(TCOL[m[2]]||'#888888');
      return '<span class="dmgmv" style="background:'+st.bg+';color:'+st.fg+'" title="'
        +m[0]+' &middot; '+m[2]+' &middot; '+m[1]+'%">'+m[1]+'</span>';
    }}).join('');
    html+='<div class="dmgcell">'+stone+'<span class="dmgname" title="'+cell.name+'">'
          +shortName(cell.name)+'</span>'+
          '<span class="dmgmvs">'+
          (mvs||'<span class="dmgmv" style="color:var(--dim)">&mdash;</span>')+'</span></div>';
  }}
  row.innerHTML=html;}}
function paintAllDamage(){{document.querySelectorAll('.card[data-ei]').forEach(paintDamage);}}
/* ---- incoming: what one enemy move does to my six, in raw HP ---------- */
function hpcolor(dmg,max){{const f=Math.max(0,Math.min(1,dmg/(max||1)));
  return 'hsl('+((1-f)*110).toFixed(0)+' 80% 63%)';}}
// Which variant block is on screen. Priority chips sit in the card header,
// outside both blocks, so a chip click has to be routed to the visible one.
function activeBlock(card){{
  return card.querySelector('.vbox.vonly')
      || card.querySelector(card.classList.contains('gs')?'.vbox.vglobal':'.vbox.vlocal');}}
function pickMove(el){{
  const card=el.closest('.card');
  // chips live outside any .vbox, so closest() returns null for them and the
  // row is routed to whichever variant is currently on screen
  let block=el.closest('.vbox');
  if(!block)block=activeBlock(card)||card;
  const row=block.querySelector('.revrow');if(!row)return;
  const move=el.dataset.mv;
  const already=el.classList.contains('sel');
  card.querySelectorAll('.mv.sel,.pchip.sel').forEach(function(m){{m.classList.remove('sel');}});
  if(already){{row.setAttribute('hidden','');return;}}
  el.classList.add('sel');
  row.removeAttribute('hidden');
  if(!reverseReady()){{
    row.innerHTML='<span class="revlab">calculating&hellip;</span>';return;}}
  if(!REV[card.dataset.ei]){{
    row.innerHTML='<span class="revlab">'+move+'</span>'
      +'<span class="revc"><span>no data for this Pokemon</span></span>';return;}}
  const perMove=REV[card.dataset.ei][spreadIndex(card)+':'+enemyForme(card)];
  const scopes=perMove&&perMove[move];
  if(!scopes){{
    row.innerHTML='<span class="revlab">'+move+'</span>'
      +'<span class="revc"><span>no damage</span></span>';return;}}
  let html='<span class="revlab">'+move+' &rarr; my team'
    +'<span class="revx" onclick="closeReverse(this)" title="close">&times;</span></span>';
  const on=scopes.on||[],off=scopes.off||[];
  for(let i=0;i<on.length;i++){{
    const useMega=!myMegaOff.has(on[i][0]);
    const cell=(useMega?on:off)[i]||on[i];
    const max=(MYHP&&MYHP[cell[0]])||0;
    const canMega=MYMEGA&&MYMEGA.indexOf(cell[0])>=0;
    const stone=canMega?'<span class="dmgms'+(useMega?' on':'')+'" data-mon="'+cell[0]
      +'" title="toggle Mega">&#9670;</span>':'';
    html+='<span class="revc">'+stone+'<span title="'+cell[0]+'">'+shortName(cell[0])+'</span>'
      +'<b style="color:'+hpcolor(cell[1],max)+'">'+cell[1]+'</b>'
      +(max?'<u>/'+max+'</u>':'')+'</span>';
  }}
  row.innerHTML=html;}}
function closeReverse(el){{
  const card=el.closest('.card');
  const row=el.closest('.revrow');
  if(row)row.setAttribute('hidden','');
  card.querySelectorAll('.mv.sel,.pchip.sel').forEach(function(m){{m.classList.remove('sel');}});}}
function repaintOpenReverse(card){{
  // pickMove toggles, so clear the flag first or a repaint would close the row
  card.querySelectorAll('.mv.sel,.pchip.sel').forEach(function(m){{
    m.classList.remove('sel');pickMove(m);}});}}
function reverseReady(){{return REV!==null&&MYHP!==null;}}
function toggleMyMega(name){{
  if(myMegaOff.has(name))myMegaOff.delete(name);else myMegaOff.add(name);
  try{{localStorage.setItem('nomega',JSON.stringify([...myMegaOff]));}}catch(e){{}}
  paintAllDamage();
  document.querySelectorAll('.card[data-ei]').forEach(repaintOpenReverse);}}
// Delegated. The diamond carries only its index, so no Pokemon name is ever
// spliced into an HTML attribute -- that nesting broke the whole script, and
// would break again on a name like Farfetch'd.
document.addEventListener('click',function(ev){{
  const el=ev.target.closest?ev.target.closest('.dmgms'):null;if(!el)return;
  ev.stopPropagation();
  // works in both the outgoing row and the incoming row. Names carry no double
  // quotes, so the attribute is safe -- unlike the old inline onclick, which
  // nested a JS string literal inside an HTML attribute.
  if(el.dataset.mon)toggleMyMega(el.dataset.mon);}});
function pickSpread(el){{const card=el.closest('.card'),si=el.dataset.si;
  // both the local and global blocks carry spread cells; keep them in step
  card.querySelectorAll('.spr-pick').forEach(function(s){{
    s.classList.toggle('sel',s.dataset.si===si);}});
  paintDamage(card);repaintOpenReverse(card);}}
function toggleDmg(b){{const w=b.closest('.card').querySelector('.dmgwrap');if(!w)return;
  if(w.hasAttribute('hidden')){{w.removeAttribute('hidden');b.classList.add('hasnote');
    paintDamage(b.closest('.card'));}}
  else{{w.setAttribute('hidden','');b.classList.remove('hasnote');}}}}
async function loadDamage(){{if(dmgLoaded)return;
  try{{const j=await(await fetch('/damage?t='+Date.now(),{{cache:'no-store'}})).json();
    if(!j.ready)return;DMG=j.grids;REV=j.rev||[];MYHP=j.hp||{{}};MYMEGA=j.mymega||[];
    dmgLoaded=true;
    paintAllDamage();
    // a move clicked while the background pass was still running left its row
    // reading "calculating..."; redraw those now that the data is here
    document.querySelectorAll('.card[data-ei]').forEach(repaintOpenReverse);
  }}catch(e){{}}}}

async function saveNote(t){{try{{await fetch('/note',{{method:'POST',
  headers:{{'Content-Type':'application/json'}},
  body:JSON.stringify({{slug:t.dataset.slug,text:t.value}})}});
  t.closest('.card').querySelector('.notebtn').classList.toggle('hasnote',!!t.value.trim());
}}catch(e){{}}}}
document.addEventListener('focusout',e=>{{if(reloading)return;
  if(e.target.classList.contains('notearea'))saveNote(e.target);
  else if(e.target.classList.contains('tnarea'))saveTeamNote(e.target);}});
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
    with _dmg_lock:
        ready = _DMG["ready"]
    r = jsonify(v=VERSION, d=ready)
    r.headers["Cache-Control"] = "no-store"
    return r

@app.route("/damage")
def damage_grid():
    with _dmg_lock:
        r = jsonify(ready=_DMG["ready"], key=_DMG["key"], grids=_DMG["grids"],
                    rev=_DMG["rev"], hp=_DMG["hp"], mymega=_DMG["mymega"])
    r.headers["Cache-Control"] = "no-store"
    return r

@app.route("/teamnote", methods=["POST"])
def teamnote():
    j = request.get_json(force=True, silent=True) or {}
    if j.get("key"):
        save_team_note(j["key"], j.get("text", ""))
    return jsonify(ok=True)

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