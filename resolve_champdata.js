/*
 * resolve_champdata.js - regenerate champdata.js from the upstream calculator.
 *
 *   node resolve_champdata.js <path-to-script_res> [out.js]
 *
 * champdata.js holds the Champions (gen 10) tables with their $.extend() chains
 * already resolved. Upstream builds those chains starting from RBY and layering
 * every generation on top, so producing the Champions tables needs all of the
 * earlier ones; running them does not. This script does that resolve step, which
 * is what the champdata.js header means by "re-run the resolve step against its
 * script_res folder rather than editing this file".
 *
 * ---------------------------------------------------------------------------
 * ABOUT THE jQuery STUB IN HERE
 *
 * champcalc.js also stubs jQuery, and that stub MUST report everything as falsy
 * -- an earlier truthy one made the calculator think every field checkbox was
 * ticked and silently applied phantom Ruin abilities for -25% damage.
 *
 * This stub is a different thing and the rule does not carry over. Nothing here
 * runs the calculator; the data files use jQuery for exactly one purpose, which
 * is $.extend as a merge utility (31 calls, no other $ use anywhere in them).
 * So $.extend here has to be a FAITHFUL deep merge. If it were falsy or lossy
 * the tables would come out silently incomplete, which is the same class of bug
 * pointing the other way. It is confined to this build step and never loaded by
 * the server.
 */

const fs = require('fs');
const vm = require('vm');
const path = require('path');

const SRC = process.argv[2];
const OUT = process.argv[3] || path.join(__dirname, 'champdata.js');
if (!SRC) {
    console.error('usage: node resolve_champdata.js <path-to-script_res> [out.js]');
    process.exit(2);
}

// Load order is copied from upstream index.html. Only the data files are needed:
// setdex_*, ap_calc, damage_*, ko_chance and the UI scripts build no tables we keep.
// move_data_za.js / cooldown_za.js are deliberately absent -- index.html does not
// load them either, they belong to the separate Legends Z-A mode.
const FILES = ['pokedex.js', 'stat_data.js', 'type_data.js', 'nature_data.js',
               'ability_data.js', 'item_data.js', 'move_data.js'];

// The tables champdata.js exports, in the order it writes them.
const TABLES = ['TYPE_CHART_SV', 'ABILITIES_CHAMPIONS', 'ABILITIES_CHAMPIONS_NATDEX',
                'ITEMS_CHAMPIONS', 'ITEMS_MEGA_STONES', 'ITEMS_MEGA_STONES_ZA',
                'ITEMS_GEMS', 'MEGA_STONE_USER_LOOKUP', 'SIGNATURE_Z_MOVE_LOOKUP',
                'LOCK_ITEM_LOOKUP', 'MOVES_CHAMPIONS', 'MOVES_CHAMPIONS_NATDEX',
                'POKEDEX_CHAMPIONS', 'GMAX_LIST'];

/** jQuery's $.extend, including the leading `true` for a deep merge. */
function extend(...args) {
    let deep = false, i = 0;
    if (typeof args[0] === 'boolean') { deep = args[0]; i = 1; }
    const target = args[i++] || {};
    for (; i < args.length; i++) {
        const src = args[i];
        if (src == null) continue;
        for (const key of Object.keys(src)) {
            const val = src[key];
            if (val === undefined) continue;          // jQuery skips undefined
            if (deep && Array.isArray(val)) {
                target[key] = extend(true, [], val);
            } else if (deep && val && typeof val === 'object') {
                const base = (target[key] && typeof target[key] === 'object'
                              && !Array.isArray(target[key])) ? target[key] : {};
                target[key] = extend(true, base, val);
            } else {
                target[key] = val;
            }
        }
    }
    return target;
}

const jq = { extend };
const sandbox = { console, $: jq, jQuery: jq };
vm.createContext(sandbox);
for (const file of FILES) {
    const full = path.join(SRC, file);
    if (!fs.existsSync(full)) {
        console.error(`missing source file: ${full}`);
        process.exit(1);
    }
    vm.runInContext(fs.readFileSync(full, 'utf8'), sandbox, { filename: file });
}

const missing = TABLES.filter(t => sandbox[t] === undefined);
if (missing.length) {
    console.error('these tables did not resolve: ' + missing.join(', '));
    process.exit(1);
}

const header = `/*
 * champdata.js - Champions (gen 10) DATA only. No code.
 *
 * The calculator builds its tables as chains of $.extend() starting from RBY
 * and layering each generation on top. Building the Champions tables needs
 * every earlier generation; running them does not. This file holds those
 * chains already resolved, so only the Champions type chart, moves, Pokedex,
 * abilities and items are present.
 *
 * The engine lives in champengine.js; this file is only the tables, so a
 * Champions balance patch shows up here as a readable diff instead of being
 * buried in 2800 lines of unchanged engine.
 *
 * GENERATED -- do not hand-edit. Rebuild with:
 *     node resolve_champdata.js <path-to-upstream/script_res>
 */

/* ================= resolved Champions data ================= */
`;

const body = TABLES.map(t => `var ${t} = ${JSON.stringify(sandbox[t])};`).join('\n');
fs.writeFileSync(OUT, header + body + '\n');

const n = o => Array.isArray(o) ? o.length : Object.keys(o).length;
console.error(`wrote ${OUT}`);
for (const t of TABLES) console.error(`   ${t.padEnd(28)} ${n(sandbox[t])}`);
