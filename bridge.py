"""
bridge.py - index_cache.json names -> Champions dex names.

The index writes forms as leading words ("Alolan Ninetales", "Hisuian Arcanine")
while the calculator's dex uses hyphenated suffixes ("Ninetales-Alola",
"Arcanine-Hisui"). A handful of forms don't correspond word-for-word at all and
are listed explicitly in ALIASES.

Deliberately NOT done: stripping a regional prefix and falling back to the base
species. That silently turns Alolan Raichu into Raichu, which is a different
Pokemon with different typing. A miss is logged instead.
"""
import re

# index prefix word -> dex suffix
REGIONS = {
    "alolan": "Alola",
    "galarian": "Galar",
    "hisuian": "Hisui",
    "paldean": "Paldea",
}

# Words the index adds that carry no meaning for matching.
NOISE = {"forme", "form", "variety", "pattern", "family", "of", "breed",
         "flower", "mode"}

# Forms where the two naming schemes genuinely disagree.
# Left side is norm()'d index name, right side is the exact dex name.
ALIASES = {
    # index has no form suffix; the dex has no plain entry
    "lycanroc":            "Lycanroc-Midday",
    "gourgeist":           "Gourgeist-Average",
    "floette":             "Floette-Eternal",
    # dex uses a different word than the index
    "gourgeistjumbovariety": "Gourgeist-Super",
    "mausholdfamilyoffour":  "Maushold-Four",
    "palafinzeroform":       "Palafin",
    "basculegionmale":       "Basculegion",
    "basculegionfemale":     "Basculegion-F",
    "meowsticfemale":        "Meowstic-F",
    # index names a cosmetic variant the dex doesn't distinguish
    "florgesredflower":      "Florges",
    "furfrounaturalform":    "Furfrou",
    "vivillonfancypattern":  "Vivillon",
    # ...and the same three again under the Showdown-style names the index switched
    # to at M-C ("Vivillon-Fancy" rather than "Vivillon Fancy Pattern"). Squawkabilly
    # and Toxtricity are new in M-C; upstream carries only the base entry for each,
    # and the variants share its typing and stat line, so this loses nothing.
    "vivillonfancy":         "Vivillon",
    "squawkabillyyellow":    "Squawkabilly",
    "toxtricitylowkey":      "Toxtricity",
}


def norm(s):
    return re.sub(r"[^a-z0-9]", "", (s or "").lower())


def _strip_noise(words):
    return [w for w in words if w.lower() not in NOISE]


def build(dex_names):
    """Return a {norm(index name) -> dex name} resolver closure."""
    by_norm = {norm(n): n for n in dex_names}

    def resolve(index_name):
        n = norm(index_name)

        # 1. straight match
        if n in by_norm:
            return by_norm[n], "exact"

        # 2. explicit alias
        if n in ALIASES:
            return ALIASES[n], "alias"

        words = _strip_noise(index_name.split())

        # 3. noise words removed
        if norm(" ".join(words)) in by_norm:
            return by_norm[norm(" ".join(words))], "noise"

        # 4. leading region word moved to a suffix
        if words and words[0].lower() in REGIONS:
            region = REGIONS[words[0].lower()]
            rest = words[1:]
            if rest:
                # "Paldean Tauros Aqua" -> Tauros-Paldea-Aqua
                species, extra = rest[0], rest[1:]
                for candidate in ("-".join([species, region] + extra),
                                  "-".join([species, region])):
                    if norm(candidate) in by_norm:
                        return by_norm[norm(candidate)], "region"

        # 5. remaining words joined with hyphens: "Lycanroc Dusk" -> Lycanroc-Dusk
        if len(words) > 1:
            candidate = "-".join(words)
            if norm(candidate) in by_norm:
                return by_norm[norm(candidate)], "hyphen"

        # 6. leading modifier moved to the end: "Fan Rotom" -> Rotom-Fan
        if len(words) > 1:
            candidate = "-".join([words[-1]] + words[:-1])
            if norm(candidate) in by_norm:
                return by_norm[norm(candidate)], "reversed"

        return None, "miss"

    return resolve  