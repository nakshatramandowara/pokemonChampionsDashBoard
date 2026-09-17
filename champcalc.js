/*
 * champcalc.js - runs the NCP VGC damage calculator without a browser.
 *
 *   node champcalc.js [dir] < request.json > result.json
 *   node champcalc.js [dir] --stones     (dump the mega-stone table)
 *   node champcalc.js [dir] --dex        (dump species -> default ability)
 *
 * Reads champdata.js (tables) and champengine.js (the calculator) from the same
 * folder as this file, or from [dir] if given.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS FILE EXISTS
 *
 * The calculator is a web page. Its Pokemon() and Field() constructors read
 * values straight out of HTML form fields via jQuery. But the function that
 * actually computes damage, GET_DAMAGE_SV(), only reads plain properties off
 * the objects those constructors produced.
 *
 * So we skip the constructors, build equivalent plain objects ourselves, and
 * feed them in. The calculator's own data tables and formulas do the rest,
 * which means we inherit its Champions-specific move balancing for free.
 *
 * ---------------------------------------------------------------------------
 * THE ONE DANGEROUS PART
 *
 * GET_DAMAGE_SV still reaches for the DOM in a few places, to read field-state
 * checkboxes. For example:
 *
 *     $("input:checkbox[id='sword-of-ruin']:checked").val() != undefined
 *
 * We have no DOM, so we hand it a fake jQuery. That fake MUST report every
 * checkbox as unchecked. An earlier version returned a catch-all object from
 * every method, which is truthy, so the calculator concluded that every field
 * effect in the UI was switched on. Damage came back 25% low with phantom Ruin
 * abilities applied, and it looked completely plausible. See fakeJQuery below.
 *
 * ---------------------------------------------------------------------------
 * INPUT (stdin)
 *
 *   {
 *     "format": "Doubles",
 *     "attackers": [
 *       { "name": "Incineroar",
 *         "item": "Assault Vest",
 *         "stats": { "hp":187, "at":152, "df":120, "sa":95, "sd":133, "sp":80 },
 *         "moves": ["Flare Blitz", "Knock Off"] }
 *     ],
 *     "defenders": [
 *       { "name": "Whimsicott",
 *         "stats": { "hp":160, "at":87, "df":100, "sa":137, "sd":105, "sp":196 } }
 *     ]
 *   }
 *
 * Stat keys are the calculator's: hp, at, df, sa, sd, sp.
 * Names must match the Champions dex exactly ("Tauros-Paldea-Aqua").
 *
 * OUTPUT (stdout)
 *
 *   { "results": [ { "atk":0, "def":0, "move":"Flare Blitz",
 *                    "min":206, "max":246, "avg":225.6, "ko":1,
 *                    "desc":"152 Atk Incineroar Flare Blitz vs. ..." } ],
 *     "errors": [] }
 *
 * atk and def are indexes back into the input arrays.
 */

const fs = require('fs');
const vm = require('vm');
const path = require('path');

// Data and engine are separate files so a Champions balance patch produces a
// readable diff in champdata.js rather than one buried in the engine.
const DATA_DIR = process.argv[2] || __dirname;
const SOURCE_FILES = ['champdata.js', 'champengine.js'];
const DUMP_STONES = process.argv[3] === '--stones';
const DUMP_DEX    = process.argv[3] === '--dex';

// Abilities are deliberately not modelled. Most are skipped automatically,
// because Intimidate and friends live in a wrapper function we never call.
// But some defensive ones (Thick Fat, Multiscale, Heatproof) are checked
// inside GET_DAMAGE_SV itself and would halve damage. Pressure has no effect
// on damage at all, so we pin both sides to it.
const INERT_ABILITY = 'Pressure';


// ---------------------------------------------------------------------------
// 1. Fake jQuery
// ---------------------------------------------------------------------------

/**
 * jQuery's $.extend(). Merges source objects into a target.
 * When `deep` is true, nested plain objects are merged rather than replaced.
 */
function extend(deep, target, ...sources) {
    for (const source of sources) {
        for (const key in source) {
            const value = source[key];
            const isPlainObject = value && typeof value === 'object' && !Array.isArray(value);

            if (deep && isPlainObject) {
                const existing = extend(true, {}, target[key] || {});
                target[key] = extend(true, existing, value);
            } else {
                target[key] = value;
            }
        }
    }
    return target;
}

/**
 * What $("...anything...") returns. Every method reports "nothing here":
 * no value, unchecked, empty text. Chainable methods return this same object.
 *
 * Do not make any of these return a truthy value. See the header comment.
 */
const emptySelection = {
    val:  () => undefined,
    prop: () => false,
    text: () => '',
    attr: () => undefined,
    is:   () => false,
    hasClass: () => false,
    length: 0,
};
for (const chainable of ['find', 'children', 'eq', 'each', 'show', 'hide',
                         'trigger', 'css', 'html', 'addClass', 'removeClass']) {
    emptySelection[chainable] = () => emptySelection;
}

const fakeJQuery = Object.assign(
    () => emptySelection,
    {
        extend: (...args) =>
            args[0] === true ? extend(true, ...args.slice(1)) : extend(false, ...args),
        isEmptyObject: obj => !obj || Object.keys(obj).length === 0,
        inArray: (needle, haystack) => haystack.indexOf(needle),
        each: () => {},
    }
);


// ---------------------------------------------------------------------------
// 2. Load the calculator into a sandbox
// ---------------------------------------------------------------------------

const calc = { console, $: fakeJQuery, jQuery: fakeJQuery };
vm.createContext(calc);
for (const file of SOURCE_FILES) {
    const full = path.join(DATA_DIR, file);
    vm.runInContext(fs.readFileSync(full, 'utf8'), calc, { filename: file });
}

// The calculator picks its data tables off a global `gen`. Champions is gen 10,
// per the switch statement in the original switch_mode.js.
vm.runInContext(`
    gen = 10;
    pokedex   = POKEDEX_CHAMPIONS;
    moves     = MOVES_CHAMPIONS;
    items     = ITEMS_CHAMPIONS;
    abilities = ABILITIES_CHAMPIONS;
    typeChart = TYPE_CHART_SV;

    mechanicsTests = {};      // "custom mods" UI, unused
    isCustomMods = false;
    resultDisplayMode = 'raw';
`, calc);


// ---------------------------------------------------------------------------
// 3. Mega stones
// ---------------------------------------------------------------------------

/**
 * Build a stone -> mega forme table from the calculator's own LOCK_ITEM_LOOKUP,
 * which maps each mega forme to the stone that triggers it. We invert it and
 * also record which base species the forme belongs to.
 *
 * Base stats are shifted into the convention index_cache.json uses, where the
 * level-50 zero-investment offsets are already folded in (+75 HP, +20 others).
 */
function buildStoneTable() {
    const table = {};
    const lookup = calc.LOCK_ITEM_LOOKUP || {};
    const allNames = Object.keys(calc.pokedex);

    for (const [forme, stone] of Object.entries(lookup)) {
        const formeEntry = calc.pokedex[forme];
        // M-C added a third designator: Absolite Z, Garchompite Z, Lucarionite Z.
        const looksLikeAStone = /ite( [XYZ])?$/.test(stone);
        if (!formeEntry || !looksLikeAStone) continue;

        const baseSpecies = allNames.find(name => {
            const formes = calc.pokedex[name].formes;
            return formes && formes.includes(forme);
        });
        if (!baseSpecies) continue;

        const bs = formeEntry.bs;
        table[stone] = {
            base: baseSpecies,
            forme: forme,
            bs: {
                hp: bs.hp + 75,
                at: bs.at + 20,
                df: bs.df + 20,
                sa: bs.sa + 20,
                sd: bs.sd + 20,
                sp: bs.sp + 20,
            },
        };
    }
    return table;
}

if (DUMP_STONES) {
    process.stdout.write(JSON.stringify(buildStoneTable()));
    process.exit(0);
}

// Every species name the calculator knows, so Python can bridge its own names
// onto them without needing to parse champdata.js.
if (DUMP_DEX) {
    // species -> default ability, so Python can fill in abilities it wasn't told.
    const dex = {};
    for (const [name, entry] of Object.entries(calc.pokedex)) dex[name] = entry.ab || '';
    process.stdout.write(JSON.stringify(dex));
    process.exit(0);
}


// ---------------------------------------------------------------------------
// 4. Build the objects GET_DAMAGE_SV expects
// ---------------------------------------------------------------------------

/**
 * Assemble one combatant. Mirrors what the real Pokemon() constructor produces,
 * minus everything we don't model.
 *
 * The stats we're given are already final in-game numbers, so rawStats and
 * stats are the same. The calculator would normally derive stats from base
 * stats, nature and investment; we skip all of that.
 */
function buildPokemon(spec) {
    const dexEntry = calc.pokedex[spec.name];
    if (!dexEntry) {
        throw new Error(`not in the Champions dex: ${spec.name}`);
    }

    const stats = spec.stats;

    return {
        name: spec.name,
        level: 50,
        type1: dexEntry.t1,
        type2: dexEntry.t2 || '',
        weight: dexEntry.w,

        // Nature is already baked into the stats we were handed, so a neutral
        // one here keeps the calculator from applying it a second time.
        nature: 'Serious',
        ability: spec.ability || INERT_ABILITY,
        item: spec.item || '',

        rawStats: Object.assign({}, stats),
        stats: Object.assign({}, stats),
        curHP: stats.hp,
        maxHP: stats.hp,

        // Shown in the calculator's description string. Never affects damage.
        HPraw: stats.hp,
        HPSPs: 0,
        HPEVs: 0,
        HPIVs: 32,

        status: 'Healthy',
        toxicCounter: 0,
        boosts: { hp: 0, at: 0, df: 0, sa: 0, sd: 0, sp: 0 },
        evs: {}, ivs: {}, sps: {},

        // Mechanics we don't model. Present because the engine reads them.
        isDynamax: false,
        isTerastalize: false,
        tera_type: '',
        isTransformed: false,
        canEvolve: false,
        supremeOverlord: 0,
        highestStat: -1,
        glaiveRushMod: false,
        abilityOn: false,
        hasCustomModifiers: false,

        hasType: function (type) {
            return this.type1 === type || this.type2 === type;
        },
    };
}

/**
 * How many times a move connects.
 *
 * hitRange is either a fixed number (Dual Wingbeat: 2, Surging Strikes: 3) or a
 * [min, max] range. For ranges we pick the count a damage calculator would show
 * by default rather than the extremes, since this is a mid-battle read.
 */
function hitCount(entry) {
    const range = entry.hitRange;
    if (!range) return 1;
    if (typeof range === 'number') return range;

    const [low, high] = range;
    if (high === 2) return 2;                    // Dragon Darts, both darts land
    if (entry.isTripleHit || high === 3) return 3;
    if (low === 2 && high === 5) return 3;       // the usual 2-5 move, ~3.1 average
    return high;                                 // Population Bomb, Beat Up
}

/**
 * Assemble one move, starting from the calculator's own entry so that
 * Champions base powers, types and spread flags come along.
 */
function buildMove(moveName) {
    const entry = calc.moves[moveName];
    if (!entry) {
        throw new Error(`unknown move: ${moveName}`);
    }

    return fakeJQuery.extend({}, entry, {
        name: moveName,
        bp: entry.bp,
        type: entry.type,
        category: entry.category,

        hits: hitCount(entry),

        isCrit: false,
        isZ: false,
        isDouble: 0,
        combinePledge: 0,
        timesAffected: 0,
        usedOppMoveIndex: -1,
        getsStellarBoost: false,
        isPlusMove: false,
    });
}

// Every field effect off: no screens, no hazards, no weather, no terrain.
const NO_SIDE_EFFECTS = {
    isSR: false, spikes: 0, steelsurge: false,
    isReflect: false, isLightScreen: false, isAuroraVeil: false,
    isProtected: false, isFriendGuard: false,
    isBattery: false, isPowerSpot: false, isSteelySpirit: false,
    isFlowerGiftAtk: false, isFlowerGiftSpD: false,
    isHelpingHand: false, isTailwind: false, isCharge: false,
    isSeaFire: false, isSaltCure: false,
    isRedItem: false, isBlueItem: false,
    isGMaxField: false, isSwamp: false,
};

/**
 * The battlefield. Format matters, because doubles applies a 0.75x penalty to
 * spread moves. Nothing else here is switched on.
 */
function buildField(format) {
    return {
        format: format,
        gameType: format,
        weather: '',
        terrain: '',
        isGravity: false,
        isForesight: false,
        getWeather: () => '',
        getTerrain: () => '',
        getTailwind: () => false,
        getSwamp: () => false,
        getNeutralGas: () => false,
        getSide: () => NO_SIDE_EFFECTS,
    };
}


// ---------------------------------------------------------------------------
// 5. Run every attacker x defender x move combination
// ---------------------------------------------------------------------------

/**
 * The calculator returns 16 damage values, one per random roll from 85% to
 * 100%. We report the average, plus the extremes for context.
 *
 * Multi-hit moves return an array-of-arrays: one inner array per hit. Those
 * get summed so a three-hit move reports its total.
 */
function summariseDamage(rawDamage, hits) {
    if (!Array.isArray(rawDamage)) {
        const one = Math.trunc(rawDamage) * hits;
        return { min: one, max: one, average: one };
    }

    let rolls;

    if (Array.isArray(rawDamage[0])) {
        // Escalating-BP moves (Triple Axel: 20/40/60) come back as one array of
        // 16 rolls PER HIT. Add them index by index to get the per-roll total --
        // the hit count is already baked in, so it must not be applied again.
        rolls = rawDamage[0].map(
            (_value, rollIndex) =>
                rawDamage.reduce((sum, perHit) => sum + perHit[rollIndex], 0)
        );
    } else {
        // Every other multi-hit move returns ONE hit's 16 rolls, and the caller
        // is expected to multiply. The description says "(2 hits)" while the
        // numbers do not include it -- this is what made Dual Wingbeat read as
        // 40 BP once instead of twice.
        rolls = rawDamage.map(roll => roll * hits);
    }

    const total = rolls.reduce((sum, roll) => sum + roll, 0);
    return {
        min: Math.min(...rolls),
        max: Math.max(...rolls),
        average: total / rolls.length,
    };
}

function round(value, places) {
    const factor = Math.pow(10, places);
    return Math.round(value * factor) / factor;
}

function main() {
    const request = JSON.parse(fs.readFileSync(0, 'utf8'));
    const field = buildField(request.format || 'Doubles');

    const results = [];
    const errors = [];

    request.defenders.forEach((defenderSpec, defenderIndex) => {
        let defenderHP;
        try {
            defenderHP = buildPokemon(defenderSpec).maxHP;
        } catch (e) {
            errors.push(`defender ${defenderIndex}: ${e.message}`);
            return;
        }

        request.attackers.forEach((attackerSpec, attackerIndex) => {
            let attacker;
            try {
                attacker = buildPokemon(attackerSpec);
            } catch (e) {
                errors.push(`attacker ${attackerIndex}: ${e.message}`);
                return;
            }

            for (const moveName of attackerSpec.moves || []) {
                let outcome, moveObject;
                try {
                    // A fresh defender and move each time: GET_DAMAGE_SV mutates
                    // the objects it is handed, so reusing them would let earlier
                    // moves leak into later results.
                    //
                    // That mutation is useful here: -ate abilities rewrite
                    // move.type in place (Pixilate turns Hyper Voice into a Fairy
                    // move), so reading it back afterwards gives the type the
                    // move actually attacked with, not the one on the dex entry.
                    moveObject = buildMove(moveName);
                    outcome = calc.GET_DAMAGE_SV(
                        attacker, buildPokemon(defenderSpec), moveObject, field
                    );
                } catch (e) {
                    errors.push(
                        `${attackerSpec.name} ${moveName} vs ${defenderSpec.name}: ${e.message}`
                    );
                    continue;
                }

                const hits = moveObject.hits || 1;
                const damage = summariseDamage(outcome.damage, hits);
                const hitsToKO = damage.max <= 0
                    ? 0
                    : Math.ceil(defenderHP / damage.average);

                results.push({
                    atk: attackerIndex,
                    def: defenderIndex,
                    move: moveName,
                    type: moveObject.type,          // after any -ate change
                    min: damage.min,
                    max: damage.max,
                    avg: round(damage.average, 1),
                    pct: round(damage.average / defenderHP * 100, 1),
                    ko: hitsToKO,
                    hits: hits,
                    desc: outcome.description,
                });
            }
        });
    });

    process.stdout.write(JSON.stringify({ results, errors }));
}

main();
