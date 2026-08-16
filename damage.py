"""
damage.py - my-team damage rows for the Champions Scout dashboard.

    import damage
    damage.load_team()                      # reads myteam.json, validates, derives nature
    rows = damage.rows_for(enemies)         # enemies = [{"name","stats"} ...]

Requires:  myteam.json, champcalc.js, champdata.js, champengine.js
           (all beside this file).
Enemy abilities/items/boosts and all field state are deliberately NOT modelled;
only typing, base stats, spread, nature, and MY held item affect the numbers.
"""
import json, os, subprocess

HERE      = os.path.dirname(os.path.abspath(__file__))
TEAM_FILE = os.path.join(HERE, "myteam.json")
CALC_JS   = os.path.join(HERE, "champcalc.js")
DATA_DIR  = HERE                 # champdata.js + champengine.js live here
FORMAT    = "Doubles"
TOP_MOVES = 3
INERT     = "Pressure"          # verified identical to no ability

# Abilities are modelled on MY side only. Some rewrite a move's type and power
# outright -- Pixilate makes Sylveon's Hyper Voice a Fairy move at 1.2x, which is
# the difference between neutral and double against a Dragon -- so ignoring them
# is not a small error. The opponent stays on INERT: their ability is a guess, and
# a wrong Thick Fat or Multiscale would quietly halve every number on the card.

# myteam.json key -> calculator key
K     = {"hp": "hp", "atk": "at", "def": "df", "spa": "sa", "spd": "sd", "spe": "sp"}
STATS = ["atk", "def", "spa", "spd", "spe"]

# index_cache.json's summary.baseStats uses long names; the calculator uses short
# ones. Accept either so callers can hand over baseStats untouched.
INDEX_KEYS = {"hp": "hp", "attack": "at", "defense": "df",
              "sp_attack": "sa", "sp_defense": "sd", "speed": "sp"}


def _to_calc_keys(stats):
    """Normalise a stat dict to the calculator's hp/at/df/sa/sd/sp keys."""
    if "at" in stats:                       # already in calculator form
        return {k: stats[k] for k in ("hp", "at", "df", "sa", "sd", "sp")}
    try:
        return {short: stats[long] for long, short in INDEX_KEYS.items()}
    except KeyError as e:
        raise ValueError(f"unrecognised stat keys {sorted(stats)}") from e

# Which stat each nature raises and lowers. Neutral natures are omitted --
# anything not listed here has no effect on stats.
NATURES = {
    "Lonely": ("at", "df"), "Brave":   ("at", "sp"), "Adamant": ("at", "sa"),
    "Naughty": ("at", "sd"), "Bold":   ("df", "at"), "Relaxed": ("df", "sp"),
    "Impish": ("df", "sa"), "Lax":     ("df", "sd"), "Timid":   ("sp", "at"),
    "Hasty":  ("sp", "df"), "Jolly":   ("sp", "sa"), "Naive":   ("sp", "sd"),
    "Modest": ("sa", "at"), "Mild":    ("sa", "df"), "Quiet":   ("sa", "sp"),
    "Rash":   ("sa", "sd"), "Calm":    ("sd", "at"), "Gentle":  ("sd", "df"),
    "Sassy":  ("sd", "sp"), "Careful": ("sd", "sa"),
}

_TEAM  = []
_MTIME = 0.0


def enemy_stats(base, points, nature=None):
    """Final stats for an opponent from index base stats + a stat-point spread.

    base    index_cache summary.baseStats (either key style)
    points  {"hp":n,"atk":n,...} or the calculator's short keys
    nature  nature name, or None for neutral. Only its effect on Defense and
            Special Defense can matter here, since we never attack with them.
    """
    base = _to_calc_keys(base)
    pts = _to_calc_keys(points) if len(points) >= 6 else points
    up, down = NATURES.get(nature or "", (None, None))

    out = {"hp": base["hp"] + pts.get("hp", 0)}
    for short in ("at", "df", "sa", "sd", "sp"):
        value = base[short] + pts.get(short, 0)
        if short == up:
            value = int(value * 1.1)
        elif short == down:
            value = int(value * 0.9)
        out[short] = value
    return out


def _nature(base, sp, shown):
    """Recover (boosted, hindered) from SP + displayed stats. Unique in practice.
    `base` uses the index_cache convention: the Lv50 zero-SP stat, offsets included."""
    opts = {s: [m for m in (0.9, 1.0, 1.1)
                if int((base[K[s]] + sp[s]) * m) == shown[s]] for s in STATS}
    hits = []
    for up in STATS + [None]:
        for dn in STATS + [None]:
            if (up is None) != (dn is None) or (up == dn and up):
                continue
            if all((1.1 if s == up else 0.9 if s == dn else 1.0) in opts[s] for s in STATS):
                hits.append((up, dn))
    if len(hits) != 1:
        raise ValueError(f"nature not unique: {hits or 'none consistent'}")
    return hits[0]


def _stats(base, sp, up, dn):
    o = {"hp": base["hp"] + sp["hp"]}
    for s in STATS:
        m = 1.1 if s == up else 0.9 if s == dn else 1.0
        o[K[s]] = int((base[K[s]] + sp[s]) * m)
    return o


def load_team(base_stats):
    """base_stats: {species: {hp,at,df,sa,sd,sp}} straight from index_cache
    (summary.baseStats), i.e. Lv50 zero-SP values with the offsets already in."""
    global _TEAM, _MTIME
    global _DEX
    stones = _stones()
    if not _DEX:
        _DEX = dex_names()
    team, out = json.load(open(TEAM_FILE, encoding="utf-8"))["team"], []
    for m in team:
        name, sp, st = m["name"], m["sp"], m["stats"]
        raw_base = base_stats.get(name)
        if not raw_base:
            print(f"[dmg] unknown species, skipped: {name}")
            continue
        try:
            base = _to_calc_keys(raw_base)
        except ValueError as e:
            print(f"[dmg] {name}: {e}, skipped")
            continue
        if any(v is None for v in base.values()):
            print(f"[dmg] {name}: index has null base stats, skipped")
            continue
        if any(v is None for v in list(sp.values()) + list(st.values())):
            print(f"[dmg] {name}: null value from OCR, skipped")
            continue
        if sum(sp.values()) > 66 or any(v > 32 or v < 0 for v in sp.values()):
            print(f"[dmg] {name}: SP out of range ({sum(sp.values())} total), skipped")
            continue
        try:
            up, dn = _nature(base, sp, st)
        except ValueError as e:
            print(f"[dmg] {name}: {e}, skipped")
            continue
        built = _stats(base, sp, up, dn)
        if built != {**st, **{"hp": st["hp"]}} and any(built[K[s]] != st[s] for s in STATS):
            print(f"[dmg] {name}: stats did not reconcile, skipped")
            continue
        # An ability named in myteam.json wins; otherwise the species default,
        # which is the competitively relevant one often enough (Sylveon's
        # Pixilate, Primarina's Liquid Voice).
        ability = m.get("ability") or _DEX.get(name) or INERT
        e = {"name": name, "item": m["item"], "moves": m["moves"],
             "stats": built, "nature": (up, dn), "ability": ability}
        stone = stones.get(m["item"])
        if stone:
            # a mega brings its own ability -- Mega Gardevoir gains Pixilate
            e["mega"] = {"name": stone["forme"],
                         "stats": _stats(stone["bs"], sp, up, dn),
                         "ability": (m.get("ability")
                                     or _DEX.get(stone["forme"]) or INERT)}
        out.append(e)
        note = f"  <> {e['mega']['name']}" if stone else ""
        print(f"[dmg] {name:14} +{up}/-{dn}  {ability}{note}")
    _TEAM = out
    _MTIME = os.path.getmtime(TEAM_FILE)
    return out


def team_if_changed(base_stats):
    if os.path.exists(TEAM_FILE) and os.path.getmtime(TEAM_FILE) != _MTIME:
        load_team(base_stats)
    return _TEAM


_DEX = {}


def dex_names():
    """{species: default ability} for the whole Champions dex.

    Iterating it yields species names, so it still works anywhere a plain list
    of names is expected."""
    p = subprocess.run(["node", CALC_JS, DATA_DIR, "--dex"],
                       capture_output=True, text=True, timeout=30)
    if p.returncode != 0:
        print(f"[dmg] could not read the dex: {p.stderr[:160]}")
        return {}
    return json.loads(p.stdout)


def _stones():
    """stone -> mega forme, read out of the calculator's own tables."""
    p = subprocess.run(["node", CALC_JS, DATA_DIR, "--stones"],
                       capture_output=True, text=True, timeout=30)
    return json.loads(p.stdout) if p.returncode == 0 else {}


def _call(attackers, defenders):
    req = {"format": FORMAT, "attackers": attackers, "defenders": defenders}
    p = subprocess.run(["node", CALC_JS, DATA_DIR], input=json.dumps(req),
                       capture_output=True, text=True, timeout=30)
    if p.returncode:
        print(f"[dmg] calc failed: {p.stderr[:200]}")
        return {"results": [], "errors": []}
    r = json.loads(p.stdout)
    for err in r.get("errors", [])[:8]:
        print(f"[dmg] {err}")
    return r


def team_hp():
    """{my Pokemon: max HP} -- lets the page colour raw damage by how close it
    is to lethal without shipping the HP on every cell."""
    return {m["name"]: m["stats"]["hp"] for m in _TEAM}


def compute_incoming(enemies):
    """What each enemy move does to MY six, in raw HP.

    Same shape as compute_all but with the roles swapped: the opponent attacks,
    I defend. Their ability and item stay unmodelled (INERT, no item) exactly as
    they are when I attack them -- only their typing, stats, spread and nature
    are known. My side keeps its real ability and item, which matter defensively
    for Assault Vest and the like.

    enemies: as compute_all, plus "moves": [move names to try]

    Returns, per enemy:
        result[enemy][defender_variant][move name][my_mega_scope] -> six entries
    where each entry is [my Pokemon, damage in HP]. Moves that cannot damage
    anyone (status, immunities) are omitted entirely, so the page can grey out
    anything missing from the grid.
    """
    if not _TEAM or not enemies:
        return []

    # --- attackers: every spread x forme the page can select, carrying its moves
    attackers, index_of = [], {}
    for enemy_i, enemy in enumerate(enemies):
        move_names = [m for m in (enemy.get("moves") or []) if m]
        if not move_names:
            continue
        formes = [("b", enemy["name"], enemy["base"])]
        for mega_i, mega in enumerate(enemy.get("megas") or []):
            formes.append((str(mega_i), mega["name"], mega["base"]))

        for spread_i, spread in enumerate(enemy.get("spreads") or [{"points": {}}]):
            for forme_key, forme_name, forme_base in formes:
                index_of[(enemy_i, f"{spread_i}:{forme_key}")] = len(attackers)
                attackers.append({
                    "name": forme_name, "ability": INERT, "item": "",
                    "stats": enemy_stats(forme_base, spread.get("points", {}),
                                         enemy.get("nature")),
                    "moves": move_names,
                })

    if not attackers:
        return [{} for _ in enemies]

    # --- defenders: my six, in both mega states (a mega changes my bulk too)
    defenders, defender_of = [], {}
    for scope in ("on", "off"):
        for member_i, member in enumerate(_TEAM):
            use = member["mega"] if (scope == "on" and "mega" in member) else member
            defender_of[(scope, member_i)] = len(defenders)
            defenders.append({
                "name": use["name"], "ability": use.get("ability", INERT),
                "item": member["item"], "stats": use["stats"],
            })

    response = _call(attackers, defenders)

    by_pair = {}
    for row in response["results"]:
        if row["max"] <= 0:
            continue
        by_pair[(row["atk"], row["def"], row["move"])] = row

    output = []
    for enemy_i, enemy in enumerate(enemies):
        grid = {}
        for (which_enemy, variant), attacker_i in index_of.items():
            if which_enemy != enemy_i:
                continue
            per_move = {}
            for move_name in attackers[attacker_i]["moves"]:
                scopes, any_damage = {}, False
                for scope in ("on", "off"):
                    cells = []
                    for member_i, member in enumerate(_TEAM):
                        row = by_pair.get(
                            (attacker_i, defender_of[(scope, member_i)], move_name))
                        cells.append([member["name"], round(row["avg"]) if row else 0])
                        any_damage = any_damage or bool(row)
                    scopes[scope] = cells
                if any_damage:
                    per_move[move_name] = scopes
            grid[variant] = per_move
        output.append(grid)

    return output


def compute_all(enemies):
    """Damage for every combination, in a single call to the calculator.

    enemies: one entry per card, in card order:
        {"name":    dex name of the base forme,
         "base":    index_cache summary.baseStats,
         "nature":  most common nature name, or None,
         "spreads": [{"label": "32/0/20/0/14/0", "pct": 41.2,
                      "points": {"hp":32,"atk":0,...}}, ...],
         "megas":   [{"name": "Mega Charizard X", "base": {...}}, ...]}

    Returns, per enemy, a grid keyed by the two things the page can toggle:

        result[enemy][defender_variant][my_mega_scope] -> six cells

    defender_variant is "<spread index>:<mega index or b>", my_mega_scope is
    "on" or "off". Each cell is {"name","mega","moves":[[move, percent], ...]}.

    Everything is computed up front so the page never has to ask again.
    """
    if not _TEAM or not enemies:
        return []

    # --- every defender the page could ask for: each spread, each forme
    defenders, index_of = [], {}
    for enemy_i, enemy in enumerate(enemies):
        formes = [("b", enemy["name"], enemy["base"])]
        for mega_i, mega in enumerate(enemy.get("megas") or []):
            formes.append((str(mega_i), mega["name"], mega["base"]))

        for spread_i, spread in enumerate(enemy.get("spreads") or [{"points": {}}]):
            for forme_key, forme_name, forme_base in formes:
                index_of[(enemy_i, f"{spread_i}:{forme_key}")] = len(defenders)
                defenders.append({
                    "name": forme_name,
                    "ability": INERT,
                    "stats": enemy_stats(forme_base, spread.get("points", {}),
                                         enemy.get("nature")),
                })

    # --- my six, in both mega states, as separate attackers
    attackers, attacker_of = [], {}
    for scope in ("on", "off"):
        for member_i, member in enumerate(_TEAM):
            use = member["mega"] if (scope == "on" and "mega" in member) else member
            attacker_of[(scope, member_i)] = len(attackers)
            attackers.append({
                "name": use["name"], "ability": use.get("ability", INERT),
                "item": member["item"], "stats": use["stats"],
                "moves": member["moves"],
            })

    response = _call(attackers, defenders)

    # --- index the flat results back into the grid
    best = {}
    for row in response["results"]:
        if row["max"] <= 0:
            continue
        best.setdefault((row["atk"], row["def"]), []).append(row)

    output = []
    for enemy_i, enemy in enumerate(enemies):
        grid = {}
        for (which_enemy, variant), defender_i in index_of.items():
            if which_enemy != enemy_i:
                continue
            hp = defenders[defender_i]["stats"]["hp"]
            grid[variant] = {}
            for scope in ("on", "off"):
                cells = []
                for member_i, member in enumerate(_TEAM):
                    rows = best.get((attacker_of[(scope, member_i)], defender_i), [])
                    rows.sort(key=lambda r: -r["avg"])
                    cells.append({
                        "name": member["name"],
                        "mega": "mega" in member,
                        # [move name, percent of the target's HP, move type]
                        "moves": [[r["move"], round(r["avg"] / hp * 100), r.get("type")]
                                  for r in rows[:TOP_MOVES]],
                    })
                grid[variant][scope] = cells
        output.append(grid)

    return output