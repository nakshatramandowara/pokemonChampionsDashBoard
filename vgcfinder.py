#!/usr/bin/env python3
"""
vgcfinder - local VGC team finder, MetaVGC-style.

Build a local cache of tournament teamsheets from the Limitless API,
then query it by the Pokemon you've seen on the opponent's team.

    python vgcfinder.py build                    # fetch + cache (do this once, re-run weekly)
    python vgcfinder.py build --format M-B       # only one regulation
    python vgcfinder.py find incineroar whimsicott
    python vgcfinder.py find incin whims --sets  # + most likely items/moves for the rest
"""

import argparse
import json
import os
import re
import sys
import time
from collections import Counter, defaultdict

import requests

API = "https://play.limitlesstcg.com/api"
CACHE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "vgcfinder_cache.json")
UA = {"User-Agent": "vgcfinder/1.0 (personal use)"}


# ---------- normalising names ----------

def norm(name):
    """'Incineroar' / 'incin-eroar' / 'Arcanine [Hisuian Form]' -> comparable key."""
    name = re.sub(r"\[.*?\]", "", name or "")
    return re.sub(r"[^a-z0-9]", "", name.lower())


def resolve(query, known):
    """Prefix/substring match so you can type 'whims' for Whimsicott."""
    q = norm(query)
    exact = [k for k in known if k == q]
    if exact:
        return exact[0]
    hits = [k for k in known if k.startswith(q)] or [k for k in known if q in k]
    if len(hits) == 1:
        return hits[0]
    if not hits:
        sys.exit(f"No Pokemon matching '{query}'")
    sys.exit(f"'{query}' is ambiguous: {', '.join(sorted(hits)[:12])}")


# ---------- building the cache ----------

def get(path, **params):
    for attempt in range(8):
        r = requests.get(API + path, params=params, headers=UA, timeout=30)
        if r.status_code == 429:
            # Limitless exposes its limits via headers - use them instead of guessing.
            wait = r.headers.get("Retry-After") or r.headers.get("X-RateLimit-Reset")
            try:
                wait = float(wait)
                # Reset may be an absolute epoch rather than a delta.
                if wait > 10_000:
                    wait = max(0, wait - time.time())
            except (TypeError, ValueError):
                wait = 2 ** attempt
            wait = min(max(wait, 1), 120) + 1
            print(f"    rate limited, waiting {wait:.0f}s", file=sys.stderr)
            time.sleep(wait)
            continue
        r.raise_for_status()

        # Slow down before we get cut off again.
        left = r.headers.get("X-RateLimit-Remaining")
        if left is not None and left.isdigit() and int(left) < 5:
            time.sleep(5)
        return r.json()
    raise RuntimeError("still rate limited after 8 attempts")


def titlecase(s):
    """API mixes 'Rough Skin' and 'rough skin' - collapse them."""
    if not s:
        return s
    s = " ".join(str(s).split())
    return s if any(c.isupper() for c in s[1:]) and s[0].isupper() else s.title()


SEEN_FIELDS = Counter()   # diagnostic: what keys the API actually returns

NOT_STONES = {"eviolite"}          # ends in -ite but is not a Mega Stone


def is_stone(name):
    """Mega Stones all end in -ite ('Charizardite Y'). The previous check looked
    for the words 'mega' and 'stone', which no real item name contains, so the
    flag was always False."""
    core = re.sub(r"\b[xy]\b", "", (name or "").lower())
    core = re.sub(r"[^a-z]", "", core)
    return bool(core) and core.endswith("ite") and core not in NOT_STONES


def mon_entry(m):
    """Normalise one teamsheet slot. Field names vary a little by era/game."""
    SEEN_FIELDS.update(m.keys())

    def pick(*keys):
        for k in keys:
            if m.get(k):
                return m[k]
        return None

    moves = pick("moves", "attacks", "moveset", "move_list")
    if isinstance(moves, str):                       # sometimes newline/comma joined
        moves = re.split(r"[\n,/]+", moves)
    if isinstance(moves, list):
        moves = [x.get("name") if isinstance(x, dict) else str(x) for x in moves]
        moves = [x.strip() for x in moves if x and str(x).strip()]
    else:
        moves = []

    item = pick("item", "heldItem", "held_item")

    return {
        "name": pick("name", "pokemon", "species"),
        "item": item,
        "ability": pick("ability"),
        "mega": is_stone(item),
        "nature": pick("nature"),
        "moves": moves,
    }


def formats():
    """List the format IDs Limitless actually uses, so you can pass the right one."""
    games = get("/games")
    vgc = next((g for g in games if g.get("id") == "VGC" or g.get("name") == "VGC"), None)
    if not vgc:
        sys.exit("Couldn't find VGC in /games response: " + json.dumps(games)[:400])
    fmts = vgc.get("formats", [])
    if isinstance(fmts, dict):                      # {id: name} or {id: {...}}
        fmts = [{"id": k, "name": v if isinstance(v, str) else (v or {}).get("name", "")}
                for k, v in fmts.items()]
    for f in fmts:
        if isinstance(f, str):
            f = {"id": f}
        print(f"  {f.get('id') or '':<10} {f.get('name', '')}")


class BuildAborted(RuntimeError):
    """Build stopped early but progress was saved; re-run to resume."""


def build(fmt, limit=400, min_players=16, fresh=False, progress=None):
    def note(msg):
        print(msg, file=sys.stderr)
        if progress:
            progress(msg)

    tours = get("/tournaments", game="VGC", limit=limit, format=fmt)
    tours = [t for t in tours if t.get("players", 0) >= min_players]
    stray = {t.get("format") for t in tours} - {fmt}
    if stray:
        note(f"warning: mixed formats came back: {stray}")
    note(f"{len(tours)} tournaments to pull")

    teams, seen = [], set()
    done = set()
    # `fresh` re-fetches everything: the only way to re-parse teams cached before
    # a mon_entry fix, since the resume path deliberately never touches them.
    if os.path.exists(CACHE) and not fresh:        # resume a killed / rate-limited run
        old = json.load(open(CACHE))
        if old.get("format") == fmt:
            teams = old.get("teams", [])
            done = set(old.get("done", []))
            seen = {(t["player"], t["tid"]) for t in teams}
            note(f"resuming: {len(done)} tournaments already cached")

    def save():
        # atomic: the dashboard hot-reloads on mtime, so it must never see a half file
        tmp = CACHE + ".tmp"
        with open(tmp, "w") as fh:
            json.dump({"built": time.time(), "format": fmt,
                       "done": sorted(done), "teams": teams}, fh)
        os.replace(tmp, CACHE)

    todo = [t for t in tours if t["id"] not in done]
    note(f"{len(todo)} left to fetch")

    for i, t in enumerate(todo, 1):
        note(f"[{i}/{len(todo)}] {t['name'][:52]}")
        try:
            standings = get(f"/tournaments/{t['id']}/standings")
        except RuntimeError as e:
            save()
            raise BuildAborted(f"{e}\nProgress saved ({len(done)} tournaments). "
                               f"Re-run the same build command later to resume.")
        except Exception as e:
            note(f"    skipped ({e})")
            done.add(t["id"])                      # genuinely broken, don't retry forever
            continue

        for p in standings:
            sheet = p.get("decklist")
            if not sheet:
                continue                      # closed teamsheet event
            if isinstance(sheet, dict):       # some events wrap it
                sheet = sheet.get("pokemon") or sheet.get("team") or []
            mons = [mon_entry(m) for m in sheet]
            mons = [m for m in mons if m["name"]]
            if len(mons) < 4:
                continue

            # must match the value stored below, since a resumed run rebuilds
            # `seen` from t["player"] — using p.get("player") here would not line up
            who = p.get("name") or p.get("player")
            key = (who, t["id"])
            if key in seen:
                continue
            seen.add(key)

            teams.append({
                "keys": sorted({norm(m["name"]) for m in mons}),
                "mons": mons,
                "player": who,
                "tid": t["id"],
                "place": p.get("placing"),
                "record": p.get("record"),
                "event": t["name"],
                "format": t.get("format"),
                "date": t.get("date"),
                "players": t.get("players"),
            })

        done.add(t["id"])
        if i % 10 == 0:
            save()
        time.sleep(1.0)

    save()
    note(f"cached {len(teams)} teamsheets from {len(done)} tournaments")
    if SEEN_FIELDS:
        print("teamsheet fields seen: "
              + ", ".join(f"{k}({v})" for k, v in SEEN_FIELDS.most_common()),
              file=sys.stderr)
        got = sum(1 for t in teams for m in t["mons"] if m["moves"])
        tot = sum(len(t["mons"]) for t in teams)
        note(f"moves parsed on {got}/{tot} slots")
    return len(teams)


def load():
    if not os.path.exists(CACHE):
        sys.exit("No cache yet. Run: python vgcfinder.py build")
    return json.load(open(CACHE))["teams"]


# ---------- querying ----------

def find(queries, fmt=None, top=10, show_sets=False):
    teams = load()
    if fmt:
        teams = [t for t in teams if (t.get("format") or "").upper() == fmt.upper()]
    if not teams:
        sys.exit("No teams for that format in the cache.")

    known = {k for t in teams for k in t["keys"]}
    wanted = {resolve(q, known) for q in queries}

    hits = [t for t in teams if wanted <= set(t["keys"])]
    if not hits:
        sys.exit(f"No teams contain all of: {', '.join(sorted(wanted))}")

    print(f"\n{len(hits)} of {len(teams)} teams ({len(hits)/len(teams)*100:.1f}%) "
          f"contain {' + '.join(sorted(wanted))}\n")

    # what fills the remaining slots
    partners = Counter(k for t in hits for k in t["keys"] if k not in wanted)
    print("Likely partners:")
    for name, n in partners.most_common(top):
        print(f"  {n/len(hits)*100:5.1f}%  {name}")

    # best finishes running this core
    ranked = sorted(hits, key=lambda t: (t["place"] or 999))[:5]
    print("\nTop finishes with this core:")
    for t in ranked:
        r = t.get("record") or {}
        rec = f"{r.get('wins','?')}-{r.get('losses','?')}"
        print(f"  #{t['place']:<4} {rec:<7} {t['player']:<22} {t['event'][:44]}")

    if show_sets:
        sets_for(hits, wanted, partners, top)


def aggregate(hits):
    """Count items/abilities/natures/moves per species across a set of teams."""
    agg = defaultdict(lambda: {"item": Counter(), "ability": Counter(),
                               "nature": Counter(), "moves": Counter(),
                               "mega": 0, "n": 0})
    for t in hits:
        for m in t["mons"]:
            a = agg[norm(m["name"])]
            a["n"] += 1
            if m["item"]:
                a["item"][titlecase(m["item"])] += 1
            if m["ability"]:
                a["ability"][titlecase(m["ability"])] += 1
            if m.get("nature"):
                a["nature"][titlecase(m["nature"])] += 1
            if m.get("mega"):
                a["mega"] += 1
            for mv in m["moves"]:
                a["moves"][titlecase(mv)] += 1
    return dict(agg)


# ---------- library API (imported by the dashboard) ----------

def load_cache(path=CACHE):
    """Raw cache dict, or None if there isn't one yet / it's unreadable."""
    if not os.path.exists(path):
        return None
    try:
        return json.load(open(path, encoding="utf-8"))
    except Exception as e:
        print(f"vgcfinder: could not read {path}: {e}", file=sys.stderr)
        return None


def exact_teams(teams, keys):
    """Teams whose roster is EXACTLY this set of norm keys. Nothing looser."""
    want = set(keys)
    if len(want) != 6:
        return []
    return [t for t in teams if set(t["keys"]) == want]


def sets_for(hits, wanted, partners, top):
    """Conditional set data: what these mons run *on teams like this one*."""
    agg = aggregate(hits)

    targets = list(wanted) + [n for n, _ in partners.most_common(4)]
    for key in targets:
        a = agg.get(key)
        if not a or not a["n"]:
            continue
        n = a["n"]
        mega = f"   [megas {a['mega']/n*100:.0f}%]" if a["mega"] else ""
        print(f"\n--- {key}  (n={n}){mega} ---")
        for field in ("item", "ability", "nature"):
            if a[field]:
                top3 = ", ".join(f"{v} {c/n*100:.0f}%" for v, c in a[field].most_common(3))
                print(f"  {field:<8} {top3}")
        if a["moves"]:
            mv = ", ".join(f"{v} {c/n*100:.0f}%" for v, c in a["moves"].most_common(6))
            print(f"  moves    {mv}")
        else:
            print("  moves    (none parsed - check 'teamsheet fields seen' from build)")


# ---------- cli ----------

def main():
    ap = argparse.ArgumentParser(description="Local VGC team finder")
    sub = ap.add_subparsers(dest="cmd", required=True)

    sub.add_parser("formats", help="list Limitless format IDs")

    b = sub.add_parser("build", help="fetch and cache teamsheets")
    b.add_argument("--format", dest="fmt", required=True,
                   help="format ID from `formats`, e.g. the current regulation")
    b.add_argument("--limit", type=int, default=400)
    b.add_argument("--min-players", type=int, default=16)
    b.add_argument("--fresh", action="store_true",
                   help="ignore the existing cache and re-fetch everything "
                        "(needed after a teamsheet-parsing fix)")

    f = sub.add_parser("find", help="search by Pokemon you've seen")
    f.add_argument("pokemon", nargs="+")
    f.add_argument("--format", dest="fmt")
    f.add_argument("--top", type=int, default=10)
    f.add_argument("--sets", action="store_true", help="show likely items/moves/tera")

    a = ap.parse_args()
    if a.cmd == "formats":
        formats()
    elif a.cmd == "build":
        try:
            build(a.fmt, a.limit, a.min_players, fresh=a.fresh)
        except BuildAborted as e:
            sys.exit(f"\n{e}")
    else:
        find(a.pokemon, a.fmt, a.top, a.sets)

if __name__ == "__main__":
    main()