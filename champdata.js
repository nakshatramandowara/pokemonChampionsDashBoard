/*
 * champdata.js - the NCP VGC damage calculator, Champions (gen 10) only.
 *
 * The calculator builds its tables as chains of $.extend() starting from RBY
 * and layering each generation on top. Building the Champions tables needs
 * every earlier generation; running them does not. This file holds those
 * chains already resolved, so only the Champions type chart, moves, Pokedex,
 * abilities and items are present.
 *
 * The damage engine is the original source, unchanged.
 *
 * To rebuild after pulling a newer version of the calculator, re-run the
 * resolve step against its script_res folder rather than editing this file.
 */

/* ================= resolved Champions data ================= */
var TYPE_CHART_SV = {"Normal":{"category":"Physical","Normal":1,"Grass":1,"Fire":1,"Water":1,"Electric":1,"Ice":1,"Flying":1,"Bug":1,"Poison":1,"Ground":1,"Rock":0.5,"Fighting":1,"Psychic":1,"Ghost":0,"Dragon":1,"Dark":1,"Steel":0.5,"Typeless":1,"???":1,"Fairy":1,"Stellar":1},"Grass":{"category":"Special","Normal":1,"Grass":0.5,"Fire":0.5,"Water":2,"Electric":1,"Ice":1,"Flying":0.5,"Bug":0.5,"Poison":0.5,"Ground":2,"Rock":2,"Fighting":1,"Psychic":1,"Ghost":1,"Dragon":0.5,"Dark":1,"Steel":0.5,"Typeless":1,"???":1,"Fairy":1,"Stellar":1},"Fire":{"category":"Special","Normal":1,"Grass":2,"Fire":0.5,"Water":0.5,"Electric":1,"Ice":2,"Flying":1,"Bug":2,"Poison":1,"Ground":1,"Rock":0.5,"Fighting":1,"Psychic":1,"Ghost":1,"Dragon":0.5,"Dark":1,"Steel":2,"Typeless":1,"???":1,"Fairy":1,"Stellar":1},"Water":{"category":"Special","Normal":1,"Grass":0.5,"Fire":2,"Water":0.5,"Electric":1,"Ice":1,"Flying":1,"Bug":1,"Poison":1,"Ground":2,"Rock":2,"Fighting":1,"Psychic":1,"Ghost":1,"Dragon":0.5,"Dark":1,"Steel":1,"Typeless":1,"???":1,"Fairy":1,"Stellar":1},"Electric":{"category":"Special","Normal":1,"Grass":0.5,"Fire":1,"Water":2,"Electric":0.5,"Ice":1,"Flying":2,"Bug":1,"Poison":1,"Ground":0,"Rock":1,"Fighting":1,"Psychic":1,"Ghost":1,"Dragon":0.5,"Dark":1,"Steel":1,"Typeless":1,"???":1,"Fairy":1,"Stellar":1},"Ice":{"category":"Special","Normal":1,"Grass":2,"Fire":0.5,"Water":0.5,"Electric":1,"Ice":0.5,"Flying":2,"Bug":1,"Poison":1,"Ground":2,"Rock":1,"Fighting":1,"Psychic":1,"Ghost":1,"Dragon":2,"Dark":1,"Steel":0.5,"Typeless":1,"???":1,"Fairy":1,"Stellar":1},"Flying":{"category":"Physical","Normal":1,"Grass":2,"Fire":1,"Water":1,"Electric":0.5,"Ice":1,"Flying":1,"Bug":2,"Poison":1,"Ground":1,"Rock":0.5,"Fighting":2,"Psychic":1,"Ghost":1,"Dragon":1,"Dark":1,"Steel":0.5,"Typeless":1,"???":1,"Fairy":1,"Stellar":1},"Bug":{"category":"Physical","Normal":1,"Grass":2,"Fire":0.5,"Water":1,"Electric":1,"Ice":1,"Flying":0.5,"Bug":1,"Poison":0.5,"Ground":1,"Rock":1,"Fighting":0.5,"Psychic":2,"Ghost":0.5,"Dragon":1,"Dark":2,"Steel":0.5,"Typeless":1,"???":1,"Fairy":0.5,"Stellar":1},"Poison":{"category":"Physical","Normal":1,"Grass":2,"Fire":1,"Water":1,"Electric":1,"Ice":1,"Flying":1,"Bug":1,"Poison":0.5,"Ground":0.5,"Rock":0.5,"Fighting":1,"Psychic":1,"Ghost":0.5,"Dragon":1,"Dark":1,"Steel":0,"Typeless":1,"???":1,"Fairy":2,"Stellar":1},"Ground":{"category":"Physical","Normal":1,"Grass":0.5,"Fire":2,"Water":1,"Electric":2,"Ice":1,"Flying":0,"Bug":0.5,"Poison":2,"Ground":1,"Rock":2,"Fighting":1,"Psychic":1,"Ghost":1,"Dragon":1,"Dark":1,"Steel":2,"Typeless":1,"???":1,"Fairy":1,"Stellar":1},"Rock":{"category":"Physical","Normal":1,"Grass":1,"Fire":2,"Water":1,"Electric":1,"Ice":2,"Flying":2,"Bug":2,"Poison":1,"Ground":0.5,"Rock":1,"Fighting":0.5,"Psychic":1,"Ghost":1,"Dragon":1,"Dark":1,"Steel":0.5,"Typeless":1,"???":1,"Fairy":1,"Stellar":1},"Fighting":{"category":"Physical","Normal":2,"Grass":1,"Fire":1,"Water":1,"Electric":1,"Ice":2,"Flying":0.5,"Bug":0.5,"Poison":0.5,"Ground":1,"Rock":2,"Fighting":1,"Psychic":0.5,"Ghost":0,"Dragon":1,"Dark":2,"Steel":2,"Typeless":1,"???":1,"Fairy":0.5,"Stellar":1},"Psychic":{"category":"Special","Normal":1,"Grass":1,"Fire":1,"Water":1,"Electric":1,"Ice":1,"Flying":1,"Bug":1,"Poison":2,"Ground":1,"Rock":1,"Fighting":2,"Psychic":0.5,"Ghost":1,"Dragon":1,"Dark":0,"Steel":0.5,"Typeless":1,"???":1,"Fairy":1,"Stellar":1},"Ghost":{"category":"Physical","Normal":0,"Grass":1,"Fire":1,"Water":1,"Electric":1,"Ice":1,"Flying":1,"Bug":1,"Poison":1,"Ground":1,"Rock":1,"Fighting":1,"Psychic":2,"Ghost":2,"Dragon":1,"Dark":0.5,"Steel":1,"Typeless":1,"???":1,"Fairy":1,"Stellar":1},"Dragon":{"category":"Special","Normal":1,"Grass":1,"Fire":1,"Water":1,"Electric":1,"Ice":1,"Flying":1,"Bug":1,"Poison":1,"Ground":1,"Rock":1,"Fighting":1,"Psychic":1,"Ghost":1,"Dragon":2,"Dark":1,"Steel":0.5,"Typeless":1,"???":1,"Fairy":0,"Stellar":1},"Dark":{"category":"Special","Normal":1,"Grass":1,"Fire":1,"Water":1,"Electric":1,"Ice":1,"Flying":1,"Bug":1,"Poison":1,"Ground":1,"Rock":1,"Fighting":0.5,"Psychic":2,"Ghost":2,"Dragon":1,"Dark":0.5,"Steel":1,"Typeless":1,"???":1,"Fairy":0.5,"Stellar":1},"Steel":{"category":"Physical","Normal":1,"Grass":1,"Fire":0.5,"Water":0.5,"Electric":0.5,"Ice":2,"Flying":1,"Bug":1,"Poison":1,"Ground":1,"Rock":2,"Fighting":1,"Psychic":1,"Ghost":1,"Dragon":1,"Dark":1,"Steel":0.5,"Typeless":1,"???":1,"Fairy":2,"Stellar":1},"Typeless":{"category":"Physical","Normal":1,"Grass":1,"Fire":1,"Water":1,"Electric":1,"Ice":1,"Flying":1,"Bug":1,"Poison":1,"Ground":1,"Rock":1,"Fighting":1,"Psychic":1,"Ghost":1,"Dragon":1,"Dark":1,"Steel":1,"Typeless":1,"???":1,"Fairy":1,"Stellar":1},"Fairy":{"Normal":1,"Grass":1,"Fire":0.5,"Water":1,"Electric":1,"Ice":1,"Flying":1,"Bug":1,"Poison":0.5,"Ground":1,"Rock":1,"Fighting":2,"Psychic":1,"Ghost":1,"Dragon":2,"Dark":2,"Steel":0.5,"Typeless":1,"Fairy":1,"Stellar":1},"Stellar":{"Normal":1,"Grass":1,"Fire":1,"Water":1,"Electric":1,"Ice":1,"Flying":1,"Bug":1,"Poison":1,"Ground":1,"Rock":1,"Fighting":1,"Psychic":1,"Ghost":1,"Dragon":1,"Dark":1,"Steel":1,"Fairy":1,"Typeless":1,"Stellar":1}};
var ABILITIES_CHAMPIONS = ["Adaptability","Aerilate","Aftermath","Analytic","Anger Point","Anticipation","Armor Tail","Aroma Veil","Battle Armor","Berserk","Big Pecks","Blaze","Bulletproof","Cheek Pouch","Chlorophyll","Clear Body","Cloud Nine","Competitive","Compound Eyes","Contrary","Corrosion","Cud Chew","Curious Medicine","Cursed Body","Cute Charm","Damp","Defiant","Disguise","Dragonize","Drizzle","Drought","Dry Skin","Early Bird","Earth Eater","Electromorphosis","Fairy Aura","Filter","Flame Body","Flash Fire","Flower Veil","Forecast","Friend Guard","Frisk","Fur Coat","Gale Wings","Gluttony","Gooey","Guts","Harvest","Healer","Heatproof","Heavy Metal","Hospitality","Huge Power","Hunger Switch","Hustle","Hydration","Hyper Cutter","Ice Body","Illuminate","Illusion","Immunity","Imposter","Infiltrator","Innards Out","Inner Focus","Insomnia","Intimidate","Iron Fist","Justified","Keen Eye","Klutz","Leaf Guard","Levitate","Light Metal","Lightning Rod","Limber","Liquid Voice","Long Reach","Magic Bounce","Magic Guard","Magician","Magma Armor","Marvel Scale","Mega Launcher","Mega Sol","Merciless","Mimicry","Minus","Mirror Armor","Mold Breaker","Moody","Motor Drive","Moxie","Multiscale","Mummy","Natural Cure","No Guard","Oblivious","Opportunist","Overcoat","Overgrow","Own Tempo","Parental Bond","Pickpocket","Pickup","Piercing Drill","Pixilate","Plus","Poison Heal","Poison Point","Poison Touch","Prankster","Pressure","Protean","Pure Power","Purifying Salt","Queenly Majesty","Quick Draw","Quick Feet","Rain Dish","Receiver","Reckless","Refrigerate","Regenerator","Ripen","Rivalry","Rock Head","Rough Skin","Sand Force","Sand Rush","Sand Spit","Sand Stream","Sand Veil","Sap Sipper","Scrappy","Screen Cleaner","Shadow Tag","Sharpness","Shed Skin","Sheer Force","Shell Armor","Shield Dust","Simple","Skill Link","Slush Rush","Sniper","Snow Cloak","Snow Warning","Solar Power","Solid Rock","Soundproof","Speed Boost","Spicy Spray","Stall","Stalwart","Stamina","Stance Change","Static","Steadfast","Stench","Sticky Hold","Strong Jaw","Sturdy","Suction Cups","Super Luck","Supersweet Syrup","Supreme Overlord","Surge Surfer","Swarm","Sweet Veil","Swift Swim","Symbiosis","Synchronize","Tangled Feet","Technician","Telepathy","Thick Fat","Torrent","Tough Claws","Toxic Debris","Trace","Unaware","Unburden","Unnerve","Unseen Fist","Vital Spirit","Volt Absorb","Wandering Spirit","Water Absorb","Water Bubble","Weak Armor","White Smoke","Zero to Hero","Eelevate","Effect Spore","Electric Surge","Fire Mane","Fluffy","Forewarn","Good as Gold","Huge Power"];
var ABILITIES_CHAMPIONS_NATDEX = ["Stench","Drizzle","Speed Boost","Battle Armor","Sturdy","Damp","Limber","Sand Veil","Static","Volt Absorb","Water Absorb","Oblivious","Cloud Nine","Compound Eyes","Insomnia","Color Change","Immunity","Flash Fire","Shield Dust","Own Tempo","Suction Cups","Intimidate","Shadow Tag","Rough Skin","Wonder Guard","Levitate","Effect Spore","Synchronize","Clear Body","Natural Cure","Lightning Rod","Serene Grace","Swift Swim","Chlorophyll","Illuminate","Trace","Huge Power","Poison Point","Inner Focus","Magma Armor","Water Veil","Magnet Pull","Soundproof","Rain Dish","Sand Stream","Pressure","Thick Fat","Early Bird","Flame Body","Run Away","Keen Eye","Hyper Cutter","Pickup","Truant","Hustle","Cute Charm","Plus","Minus","Forecast","Sticky Hold","Shed Skin","Guts","Marvel Scale","Liquid Ooze","Overgrow","Blaze","Torrent","Swarm","Rock Head","Drought","Arena Trap","Vital Spirit","White Smoke","Pure Power","Shell Armor","Air Lock","Tangled Feet","Motor Drive","Rivalry","Steadfast","Snow Cloak","Gluttony","Anger Point","Unburden","Heatproof","Simple","Dry Skin","Download","Iron Fist","Poison Heal","Adaptability","Skill Link","Hydration","Solar Power","Quick Feet","Normalize","Sniper","Magic Guard","No Guard","Stall","Technician","Leaf Guard","Klutz","Mold Breaker","Super Luck","Aftermath","Anticipation","Forewarn","Unaware","Tinted Lens","Filter","Slow Start","Scrappy","Storm Drain","Ice Body","Solid Rock","Snow Warning","Honey Gather","Frisk","Reckless","Multitype","Flower Gift","Bad Dreams","Pickpocket","Sheer Force","Contrary","Unnerve","Defiant","Defeatist","Cursed Body","Healer","Friend Guard","Weak Armor","Heavy Metal","Light Metal","Harvest","Telepathy","Multiscale","Toxic Boost","Flare Boost","Moody","Overcoat","Poison Touch","Regenerator","Big Pecks","Sand Rush","Wonder Skin","Analytic","Illusion","Imposter","Infiltrator","Mummy","Moxie","Justified","Rattled","Magic Bounce","Sap Sipper","Prankster","Sand Force","Iron Barbs","Zen Mode","Victory Star","Turboblaze","Teravolt","Aroma Veil","Flower Veil","Cheek Pouch","Protean","Fur Coat","Magician","Bulletproof","Competitive","Strong Jaw","Refrigerate","Sweet Veil","Stance Change","Gale Wings","Mega Launcher","Grass Pelt","Symbiosis","Tough Claws","Pixilate","Gooey","Aerilate","Parental Bond","Dark Aura","Fairy Aura","Aura Break","Primordial Sea","Desolate Land","Delta Stream","Stamina","Wimp Out","Emergency Exit","Water Compaction","Merciless","Shields Down","Stakeout","Water Bubble","Steelworker","Berserk","Slush Rush","Long Reach","Liquid Voice","Triage","Galvanize","Surge Surfer","Schooling","Disguise","Battle Bond","Power Construct","Corrosion","Comatose","Queenly Majesty","Innards Out","Dancer","Battery","Fluffy","Dazzling","Soul-Heart","Tangling Hair","Receiver","Power of Alchemy","Beast Boost","RKS System","Electric Surge","Psychic Surge","Misty Surge","Grassy Surge","Full Metal Body","Shadow Shield","Prism Armor","Neuroforce","Intrepid Sword","Dauntless Shield","Libero","Ball Fetch","Cotton Down","Propeller Tail","Mirror Armor","Gulp Missile","Steam Engine","Stalwart","Punk Rock","Sand Spit","Ice Scales","Ripen","Ice Face","Power Spot","Mimicry","Screen Cleaner","Steely Spirit","Perish Body","Wandering Spirit","Gorilla Tactics","Neutralizing Gas","Pastel Veil","Hunger Switch","Quick Draw","Unseen Fist","Curious Medicine","Transistor","Dragon's Maw","Chilling Neigh","Grim Neigh","As One","Lingering Aroma","Seed Sower","Thermal Exchange","Anger Shell","Purifying Salt","Well-Baked Body","Wind Rider","Guard Dog","Rocky Payload","Wind Power","Zero to Hero","Commander","Electromorphosis","Protosynthesis","Quark Drive","Good as Gold","Vessel of Ruin","Sword of Ruin","Tablets of Ruin","Beads of Ruin","Orichalcum Pulse","Hadron Engine","Opportunist","Cud Chew","Sharpness","Supreme Overlord","Costar","Toxic Debris","Armor Tail","Earth Eater","Mycelium Might","Hospitality","Mind's Eye","Embody Aspect","Toxic Chain","Supersweet Syrup","Tera Shift","Tera Shell","Teraform Zero","Poison Puppeteer","Piercing Drill","Dragonize","Mega Sol","Spicy Spray","Eelevate","Fire Mane"];
var ITEMS_CHAMPIONS = ["Cheri Berry","Chesto Berry","Pecha Berry","Rawst Berry","Aspear Berry","Oran Berry","Persim Berry","Leppa Berry","Lum Berry","Sitrus Berry","Occa Berry","Passho Berry","Wacan Berry","Rindo Berry","Yache Berry","Chople Berry","Kebia Berry","Shuca Berry","Coba Berry","Payapa Berry","Tanga Berry","Charti Berry","Kasib Berry","Haban Berry","Colbur Berry","Babiri Berry","Chilan Berry","White Herb","Quick Claw","King's Rock","Silver Powder","Focus Band","Scope Lens","Metal Coat","Leftovers","Light Ball","Soft Sand","Hard Stone","Miracle Seed","Black Glasses","Black Belt","Magnet","Mystic Water","Sharp Beak","Poison Barb","Never-Melt Ice","Spell Tag","Twisted Spoon","Charcoal","Dragon Fang","Silk Scarf","Shell Bell","Choice Scarf","Focus Sash","Bright Powder","Mental Herb","Gengarite","Gardevoirite","Ampharosite","Venusaurite","Charizardite X","Blastoisinite","Medichamite","Houndoominite","Aggronite","Banettite","Tyranitarite","Scizorite","Pinsirite","Aerodactylite","Lucarionite","Abomasite","Kangaskhanite","Gyaradosite","Absolite","Charizardite Y","Alakazite","Heracronite","Manectite","Garchompite","Roseli Berry","Steelixite","Pidgeotite","Glalitite","Sablenite","Altarianite","Galladite","Audinite","Sharpedonite","Slowbronite","Cameruptite","Lopunnite","Beedrillite","Fairy Feather","Clefablite","Victreebelite","Starminite","Dragoninite","Meganiumite","Feraligite","Skarmorite","Froslassite","Emboarite","Excadrite","Chandelurite","Chesnaughtite","Delphoxite","Greninjite","Floettite","Hawluchanite","Drampanite","Chimechite","Golurkite","Meowsticite","Crabominite","Scovillainite","Glimmoranite","Big Root","Damp Rock","Expert Belt","Heat Rock","Icy Rock","Iron Ball","Life Orb","Light Clay","Metronome","Muscle Band","Shed Shell","Smooth Rock","Wide Lens","Wise Glasses","Zoom Lens","Raichunite X","Raichunite Y","Falinksite","Staraptite","Blazikenite","Mawilite","Swampertite","Sceptilite","Metagrossite","Scolipite","Scraftinite","Eelektrossite","Pyroarite","Malamarite","Barbaracite","Dragalgite"];
var ITEMS_MEGA_STONES = ["Red Orb","Blue Orb","Gengarite","Gardevoirite","Ampharosite","Venusaurite","Charizardite X","Blastoisinite","Mewtwonite X","Mewtwonite Y","Blazikenite","Medichamite","Houndoominite","Aggronite","Banettite","Tyranitarite","Scizorite","Pinsirite","Aerodactylite","Lucarionite","Abomasite","Kangaskhanite","Gyaradosite","Absolite","Charizardite Y","Alakazite","Heracronite","Mawilite","Manectite","Garchompite","Latiasite","Latiosite","Swampertite","Sceptilite","Sablenite","Altarianite","Galladite","Audinite","Metagrossite","Sharpedonite","Slowbronite","Steelixite","Pidgeotite","Glalitite","Diancite","Cameruptite","Lopunnite","Salamencite","Beedrillite"];
var ITEMS_MEGA_STONES_ZA = ["Clefablite","Victreebelite","Starminite","Dragoninite","Meganiumite","Feraligite","Skarmorite","Froslassite","Emboarite","Excadrite","Scolipite","Scraftinite","Eelektrossite","Chandelurite","Chesnaughtite","Delphoxite","Greninjite","Pyroarite","Floettite","Malamarite","Barbaracite","Dragalgite","Hawluchanite","Zygardite","Drampanite","Falinksite","Heatranite","Darkranite","Zeraorite","Raichunite X","Raichunite Y","Chimechite","Absolite Z","Staraptite","Garchompite Z","Lucarionite Z","Golurkite","Meowsticite","Crabominite","Golisopite","Magearnite","Scovillainite","Baxcalibrite","Tatsugirinite","Glimmoranite"];
var ITEMS_GEMS = ["Fire Gem","Water Gem","Electric Gem","Grass Gem","Ice Gem","Fighting Gem","Poison Gem","Ground Gem","Flying Gem","Psychic Gem","Bug Gem","Rock Gem","Ghost Gem","Dragon Gem","Dark Gem","Steel Gem"];
var MEGA_STONE_USER_LOOKUP = {"Abomasite":"Abomasnow","Absolite":"Absol","Aerodactylite":"Aerodactyl","Aggronite":"Aggron","Alakazite":"Alakazam","Ampharosite":"Ampharos","Banettite":"Banette","Blastoisinite":"Blastoise","Blazikenite":"Blaziken","Charizardite X":"Charizard","Charizardite Y":"Charizard","Garchompite":"Garchomp","Gardevoirite":"Gardevoir","Gengarite":"Gengar","Gyaradosite":"Gyarados","Heracronite":"Heracross","Houndoominite":"Houndoom","Kangaskhanite":"Kangaskhan","Latiasite":"Latias","Latiosite":"Latios","Lucarionite":"Lucario","Manectite":"Manectric","Mawilite":"Mawile","Medichamite":"Medicham","Mewtwonite X":"Mewtwo","Mewtwonite Y":"Mewtwo","Pinsirite":"Pinsir","Scizorite":"Scizor","Tyranitarite":"Tyranitar","Venusaurite":"Venusaur","Altarianite":"Altaria","Audinite":"Audino","Beedrillite":"Beedrill","Cameruptite":"Camerupt","Diancite":"Diancie","Galladite":"Gallade","Glalitite":"Glalie","Lopunnite":"Lopunny","Metagrossite":"Metagross","Pidgeotite":"Pidgeot","Sablenite":"Sableye","Salamencite":"Salamence","Sceptilite":"Sceptile","Sharpedonite":"Sharpedo","Slowbronite":"Slowbro","Steelixite":"Steelix","Swampertite":"Swampert","Red Orb":"Groudon","Blue Orb":"Kyogre","Clefablite":"Clefable","Victreebelite":"Victreebel","Starminite":"Starmie","Dragoninite":"Dragonite","Meganiumite":"Meganium","Feraligite":"Feraligatr","Skarmorite":"Skarmory","Froslassite":"Froslass","Emboarite":"Emboar","Excadrite":"Excadrill","Scolipite":"Scolipede","Scraftinite":"Scrafty","Eelektrossite":"Eelektross","Chandelurite":"Chandelure","Chesnaughtite":"Chesnaught","Delphoxite":"Delphox","Greninjite":"Greninja","Pyroarite":"Pyroar","Floettite":"Floette-Eternal","Malamarite":"Malamar","Barbaracite":"Barbaracle","Dragalgite":"Dragalge","Hawluchanite":"Hawlucha","Zygardite":["Zygarde","Zygarde-10%","Zygarde-Complete"],"Drampanite":"Drampa","Falinksite":"Falinks","Heatranite":"Heatran","Darkranite":"Darkrai","Zeraorite":"Zeraora","Raichunite X":"Raichu","Raichunite Y":"Raichu","Chimechite":"Chimecho","Absolite Z":"Absol","Staraptite":"Staraptor","Garchompite Z":"Garchomp","Lucarionite Z":"Lucario","Golurkite":"Golurk","Meowsticite":["Meowstic","Meowstic-F"],"Crabominite":"Crabominable","Golisopite":"Golisopod","Magearnite":"Magearna","Scovillainite":"Scovillain","Baxcalibrite":"Baxcalibur","Tatsugirinite":"Tatsugiri","Glimmoranite":"Glimmora"};
var SIGNATURE_Z_MOVE_LOOKUP = {"Pikanium Z":{"user":"Pikachu","move":"Volt Tackle","zMove":"Catastropika"},"Decidium Z":{"user":"Decidueye","move":"Spirit Shackle","zMove":"Sinister Arrow Raid"},"Incinium Z":{"user":"Incineroar","move":"Darkest Lariat","zMove":"Malicious Moonsault"},"Primarium Z":{"user":"Primarina","move":"Sparkling Aria","zMove":"Oceanic Operetta"},"Tapunium Z":{"user":["Tapu Koko","Tapu Lele","Tapu Bulu","Tapu Fini"],"move":"Nature's Madness","zMove":"Guardian of Alola"},"Marshadium Z":{"user":"Marshadow","move":"Spectral Thief","zMove":"Soul-Stealing 7-Star Strike"},"Aloraichium Z":{"user":"Raichu-Alola","move":"Thunderbolt","zMove":"Stoked Sparksurfer"},"Snorlium Z":{"user":"Snorlax","move":"Giga Impact","zMove":"Pulverizing Pancake"},"Eevium Z":{"user":"Eevee","move":"Last Resort","zMove":"Extreme Evoboost"},"Mewnium Z":{"user":"Mew","move":"Psychic","zMove":"Genesis Supernova"},"Pikashunium Z":{"user":"Pikachu","move":"Thunderbolt","zMove":"10,000,000 Volt Thunderbolt"},"Solganium Z":{"user":["Solgaleo","Necrozma-Dusk-Mane"],"move":"Sunsteel Strike","zMove":"Searing Sunraze Smash"},"Lunalium Z":{"user":["Lunala","Necrozma-Dawn-Wings"],"move":"Moongeist Beam","zMove":"Menacing Moonraze Maelstrom"},"Ultranecrozium Z":{"user":"Ultra Necrozma","move":"Photon Geyser","zMove":"Light That Burns the Sky"},"Mimikium Z":{"user":"Mimikyu","move":"Play Rough","zMove":"Let's Snuggle Forever"},"Lycanium Z":{"user":["Lycanroc-Midday","Lycanroc-Midnight","Lycanroc-Dusk"],"move":"Stone Edge","zMove":"Splintered Stormshards"},"Kommonium Z":{"user":"Kommo-o","move":"Clanging Scales","zMove":"Clangorous Soulblaze"}};
var LOCK_ITEM_LOOKUP = {"Giratina-Origin":"Griseous Orb","Mega Abomasnow":"Abomasite","Mega Absol":"Absolite","Mega Aerodactyl":"Aerodactylite","Mega Aggron":"Aggronite","Mega Alakazam":"Alakazite","Mega Ampharos":"Ampharosite","Mega Banette":"Banettite","Mega Blastoise":"Blastoisinite","Mega Blaziken":"Blazikenite","Mega Charizard X":"Charizardite X","Mega Charizard Y":"Charizardite Y","Mega Garchomp":"Garchompite","Mega Gardevoir":"Gardevoirite","Mega Gengar":"Gengarite","Mega Gyarados":"Gyaradosite","Mega Heracross":"Heracronite","Mega Houndoom":"Houndoominite","Mega Kangaskhan":"Kangaskhanite","Mega Latias":"Latiasite","Mega Latios":"Latiosite","Mega Lucario":"Lucarionite","Mega Manectric":"Manectite","Mega Mawile":"Mawilite","Mega Medicham":"Medichamite","Mega Mewtwo X":"Mewtwonite X","Mega Mewtwo Y":"Mewtwonite Y","Mega Pinsir":"Pinsirite","Mega Scizor":"Scizorite","Mega Tyranitar":"Tyranitarite","Mega Venusaur":"Venusaurite","Mega Altaria":"Altarianite","Mega Audino":"Audinite","Mega Beedrill":"Beedrillite","Mega Camerupt":"Cameruptite","Mega Diancie":"Diancite","Mega Gallade":"Galladite","Mega Glalie":"Glalitite","Mega Lopunny":"Lopunnite","Mega Metagross":"Metagrossite","Mega Pidgeot":"Pidgeotite","Mega Sableye":"Sablenite","Mega Salamence":"Salamencite","Mega Sceptile":"Sceptilite","Mega Sharpedo":"Sharpedonite","Mega Slowbro":"Slowbronite","Mega Steelix":"Steelixite","Mega Swampert":"Swampertite","Primal Groudon":"Red Orb","Primal Kyogre":"Blue Orb","Ultra Necrozma":"Ultranecrozium Z","Zacian-Crowned":"Rusted Sword","Zamazenta-Crowned":"Rusted Shield","Dialga-Origin":"Adamant Crystal","Palkia-Origin":"Lustrous Globe","Ogerpon-Wellspring":"Wellspring Mask","Ogerpon-Hearthflame":"Hearthflame Mask","Ogerpon-Cornerstone":"Cornerstone Mask","Mega Clefable":"Clefablite","Mega Victreebel":"Victreebelite","Mega Starmie":"Starminite","Mega Dragonite":"Dragoninite","Mega Meganium":"Meganiumite","Mega Feraligatr":"Feraligite","Mega Skarmory":"Skarmorite","Mega Froslass":"Froslassite","Mega Emboar":"Emboarite","Mega Excadrill":"Excadrite","Mega Scolipede":"Scolipite","Mega Scrafty":"Scraftinite","Mega Eelektross":"Eelektrossite","Mega Chandelure":"Chandelurite","Mega Chesnaught":"Chesnaughtite","Mega Delphox":"Delphoxite","Mega Greninja":"Greninjite","Mega Pyroar":"Pyroarite","Mega Floette":"Floettite","Mega Malamar":"Malamarite","Mega Barbaracle":"Barbaracite","Mega Dragalge":"Dragalgite","Mega Hawlucha":"Hawluchanite","Mega Zygarde":"Zygardite","Mega Drampa":"Drampanite","Mega Falinks":"Falinksite","Mega Heatran":"Heatranite","Mega Darkrai":"Darkranite","Mega Zeraora":"Zeraorite","Mega Raichu X":"Raichunite X","Mega Raichu Y":"Raichunite Y","Mega Chimecho":"Chimechite","Mega Absol Z":"Absolite Z","Mega Staraptor":"Staraptite","Mega Garchomp Z":"Garchompite Z","Mega Lucario Z":"Lucarionite Z","Mega Golurk":"Golurkite","Mega Meowstic":"Meowsticite","Mega Crabominable":"Crabominite","Mega Golisopod":"Golisopite","Mega Magearna":"Magearnite","Mega Scovillain":"Scovillainite","Mega Baxcalibur":"Baxcalibrite","Mega Tatsugiri":"Tatsugirinite","Mega Glimmora":"Glimmoranite"};
var MOVES_CHAMPIONS = {"(No Move)":{"type":"Typeless","category":"Status"},"Accelerock":{"category":"Physical","type":"Rock","makesContact":true,"bp":40,"isPriority":true},"Acid Armor":{"type":"Poison","category":"Status"},"Acid Spray":{"bp":40,"type":"Poison","category":"Special","hasSecondaryEffect":true,"isBullet":true,"statChange":["special defense",-2,"target"]},"Acrobatics":{"bp":55,"type":"Flying","category":"Physical","makesContact":true},"Acupressure":{"type":"Normal","category":"Status"},"Aerial Ace":{"bp":60,"type":"Flying","category":"Physical","makesContact":true,"isSlice":true},"After You":{"type":"Normal","category":"Status"},"Agility":{"type":"Psychic","category":"Status"},"Air Cutter":{"bp":60,"type":"Flying","category":"Special","isSpread":true,"isSlice":true,"isWind":true},"Air Slash":{"bp":75,"type":"Flying","category":"Special","hasSecondaryEffect":true,"isSlice":true},"Alluring Voice":{"bp":80,"type":"Fairy","category":"Special","hasSecondaryEffect":true,"isSound":true},"Ally Switch":{"type":"Psychic","category":"Status"},"Amnesia":{"type":"Psychic","category":"Status"},"Ancient Power":{"bp":60,"type":"Rock","category":"Special","hasSecondaryEffect":true,"makesContact":false},"Apple Acid":{"bp":90,"type":"Grass","category":"Special","hasSecondaryEffect":true,"statChange":["special defense",-2,"target"]},"Aqua Cutter":{"bp":70,"type":"Water","category":"Physical","isSlice":true},"Aqua Jet":{"bp":40,"type":"Water","category":"Physical","makesContact":true,"isPriority":true},"Aqua Ring":{"type":"Water","category":"Status"},"Aqua Step":{"bp":80,"type":"Water","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Aqua Tail":{"bp":90,"type":"Water","category":"Physical","makesContact":true},"Armor Cannon":{"bp":120,"type":"Fire","category":"Special"},"Aromatic Mist":{"type":"Fairy","category":"Status"},"Assurance":{"bp":60,"type":"Dark","category":"Physical","makesContact":true,"canDouble":true},"Attract":{"type":"Normal","category":"Status"},"Aura Sphere":{"bp":80,"type":"Fighting","category":"Special","isBullet":true,"isPulse":true},"Aura Wheel":{"bp":110,"type":"Electric","category":"Physical","hasSecondaryEffect":true},"Aurora Veil":{"type":"Ice","category":"Status"},"Avalanche":{"bp":60,"type":"Ice","category":"Physical","makesContact":true,"canDouble":true},"Axe Kick":{"bp":120,"type":"Fighting","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"hasCrash":true},"Baby-Doll Eyes":{"type":"Fairy","category":"Status","isPriority":true},"Baneful Bunker":{"type":"Poison","category":"Status"},"Baton Pass":{"type":"Normal","category":"Status"},"Beak Blast":{"category":"Physical","type":"Flying","bp":120,"isBullet":true},"Beat Up":{"bp":14,"type":"Dark","category":"Physical","hitRange":[1,6]},"Belch":{"bp":120,"type":"Poison","category":"Special"},"Belly Drum":{"type":"Normal","category":"Status","costHP":[1,2,"roundDown"]},"Bind":{"bp":15,"type":"Normal","category":"Physical","makesContact":true},"Bite":{"bp":60,"type":"Dark","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"isBite":true},"Bitter Blade":{"bp":90,"type":"Fire","category":"Physical","makesContact":true,"isSlice":true,"isHealing":true,"drainHP":[1,2]},"Bitter Malice":{"bp":75,"type":"Ghost","category":"Special","hasSecondaryEffect":true},"Blast Burn":{"bp":150,"type":"Fire","category":"Special"},"Blaze Kick":{"bp":85,"type":"Fire","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Blizzard":{"bp":110,"type":"Ice","category":"Special","hasSecondaryEffect":true,"isSpread":true,"isWind":true},"Block":{"type":"Normal","category":"Status"},"Body Press":{"bp":80,"type":"Fighting","category":"Physical","makesContact":true},"Body Slam":{"bp":85,"type":"Normal","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"miniDoubleBP":true},"Bone Rush":{"bp":30,"type":"Ground","category":"Physical","hitRange":[2,5],"zp":140},"Boomburst":{"bp":140,"type":"Normal","category":"Special","isSound":true,"isSpread":true},"Bounce":{"bp":85,"type":"Flying","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Brave Bird":{"bp":120,"type":"Flying","category":"Physical","makesContact":true,"recoilHP":[1,3]},"Breaking Swipe":{"bp":60,"type":"Dragon","category":"Physical","isSpread":true,"makesContact":true,"hasSecondaryEffect":true},"Brick Break":{"bp":75,"type":"Fighting","category":"Physical","makesContact":true,"ignoresScreens":true},"Brutal Swing":{"category":"Physical","type":"Dark","makesContact":true,"bp":60,"isSpread":true},"Bug Bite":{"bp":60,"type":"Bug","category":"Physical","makesContact":true},"Bug Buzz":{"bp":90,"type":"Bug","category":"Special","hasSecondaryEffect":true,"isSound":true},"Bulk Up":{"type":"Fighting","category":"Status"},"Bulldoze":{"bp":60,"type":"Ground","category":"Physical","hasSecondaryEffect":true,"isSpread":true},"Bullet Punch":{"bp":40,"type":"Steel","category":"Physical","makesContact":true,"isPunch":true,"isPriority":true},"Bullet Seed":{"bp":25,"type":"Grass","category":"Physical","hitRange":[2,5],"isBullet":true,"zp":140},"Burn Up":{"category":"Special","type":"Fire","bp":130},"Burning Jealousy":{"bp":70,"type":"Fire","category":"Special","isSpread":true,"hasSecondaryEffect":true},"Calm Mind":{"type":"Psychic","category":"Status"},"Ceaseless Edge":{"bp":65,"type":"Dark","category":"Physical","makesContact":true,"isSlice":true,"hasSecondaryEffect":true},"Charge":{"type":"Electric","category":"Status"},"Charge Beam":{"bp":50,"type":"Electric","category":"Special","hasSecondaryEffect":true},"Charm":{"type":"Fairy","category":"Status"},"Chilling Water":{"bp":50,"type":"Water","category":"Special","hasSecondaryEffect":true},"Chilly Reception":{"type":"Ice","category":"Status"},"Circle Throw":{"bp":60,"type":"Fighting","category":"Physical","makesContact":true},"Clanging Scales":{"category":"Special","type":"Dragon","bp":110,"isSound":true,"isSpread":true},"Clangorous Soul":{"type":"Dragon","category":"Status","costHP":[1,3,"roundDown"]},"Clear Smog":{"bp":50,"type":"Poison","category":"Special"},"Close Combat":{"bp":120,"type":"Fighting","category":"Physical","makesContact":true},"Coaching":{"type":"Fighting","category":"Status"},"Coil":{"type":"Poison","category":"Status"},"Comeuppance":{"bp":1,"type":"Dark","category":"Physical","makesContact":true,"usesOppMoves":true},"Confuse Ray":{"type":"Ghost","category":"Status"},"Copycat":{"type":"Normal","category":"Status"},"Corrosive Gas":{"type":"Poison","category":"Status","isSpread":true},"Cosmic Power":{"type":"Psychic","category":"Status"},"Cotton Guard":{"type":"Grass","category":"Status"},"Cotton Spore":{"type":"Grass","category":"Status","isSpread":true},"Counter":{"bp":1,"type":"Fighting","category":"Physical","makesContact":true,"usesOppMoves":true},"Covet":{"bp":60,"type":"Normal","category":"Physical","makesContact":true},"Crabhammer":{"bp":100,"type":"Water","category":"Physical","makesContact":true},"Cross Chop":{"bp":100,"type":"Fighting","category":"Physical","makesContact":true},"Cross Poison":{"bp":70,"type":"Poison","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"isSlice":true},"Crunch":{"bp":80,"type":"Dark","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"isBite":true},"Crush Claw":{"bp":75,"type":"Normal","category":"Physical","makesContact":true,"isSlice":true},"Curse":{"type":"Ghost","category":"Status","costHP":[1,2,"roundDown"]},"Dark Pulse":{"bp":80,"type":"Dark","category":"Special","hasSecondaryEffect":true,"isPulse":true},"Darkest Lariat":{"category":"Physical","type":"Dark","makesContact":true,"bp":85,"ignoresDefenseBoosts":true},"Dazzling Gleam":{"bp":80,"type":"Fairy","category":"Special","isSpread":true},"Decorate":{"type":"Fairy","category":"Status"},"Defog":{"type":"Flying","category":"Status"},"Destiny Bond":{"type":"Ghost","category":"Status"},"Detect":{"type":"Fighting","category":"Status"},"Dig":{"bp":80,"type":"Ground","category":"Physical","makesContact":true},"Dire Claw":{"bp":80,"type":"Poison","category":"Physical","hasSecondaryEffect":true,"makesContact":true,"isSlice":true},"Disable":{"type":"Normal","category":"Status"},"Discharge":{"bp":80,"type":"Electric","category":"Special","hasSecondaryEffect":true,"isSpread":true},"Dive":{"bp":80,"type":"Water","category":"Physical","makesContact":true},"Double Hit":{"bp":35,"type":"Normal","category":"Physical","makesContact":true,"hitRange":2},"Double Team":{"type":"Normal","category":"Status"},"Double-Edge":{"bp":120,"type":"Normal","category":"Physical","makesContact":true,"recoilHP":[1,3]},"Draco Meteor":{"bp":130,"type":"Dragon","category":"Special","statChange":["special attack",-2,"user"]},"Dragon Cheer":{"type":"Dragon","category":"Status","isSound":true},"Dragon Claw":{"bp":80,"type":"Dragon","category":"Physical","makesContact":true,"isSlice":true},"Dragon Dance":{"type":"Dragon","category":"Status"},"Dragon Darts":{"bp":50,"type":"Dragon","category":"Physical","hitRange":[1,2]},"Dragon Pulse":{"bp":85,"type":"Dragon","category":"Special","isPulse":true},"Dragon Rush":{"bp":100,"type":"Dragon","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"miniDoubleBP":true},"Dragon Tail":{"bp":60,"type":"Dragon","category":"Physical","makesContact":true},"Drain Punch":{"bp":75,"type":"Fighting","category":"Physical","makesContact":true,"isPunch":true,"isHealing":true,"drainHP":[1,2]},"Draining Kiss":{"bp":50,"type":"Fairy","category":"Special","makesContact":true,"isHealing":true,"drainHP":[3,4]},"Drill Peck":{"bp":80,"type":"Flying","category":"Physical","makesContact":true},"Drill Run":{"bp":80,"type":"Ground","category":"Physical","makesContact":true},"Dual Wingbeat":{"bp":40,"type":"Flying","category":"Physical","makesContact":true,"hitRange":2},"Dynamic Punch":{"bp":100,"type":"Fighting","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"isPunch":true},"Earth Power":{"bp":90,"type":"Ground","category":"Special","hasSecondaryEffect":true},"Earthquake":{"bp":100,"type":"Ground","category":"Physical","isSpread":true,"isGen3Spread":true},"Eerie Impulse":{"type":"Electric","category":"Status"},"Eerie Spell":{"bp":80,"type":"Psychic","category":"Special","hasSecondaryEffect":true},"Electric Terrain":{"type":"Electric","category":"Status"},"Electrify":{"type":"Electric","category":"Status"},"Electro Ball":{"bp":1,"type":"Electric","category":"Special","isBullet":true,"zp":160},"Electro Shot":{"bp":130,"type":"Electric","category":"Special","hasSecondaryEffect":true},"Electroweb":{"bp":55,"type":"Electric","category":"Special","isSpread":true,"hasSecondaryEffect":true},"Encore":{"type":"Normal","category":"Status"},"Endeavor":{"bp":1,"type":"Normal","category":"Physical","makesContact":true,"zp":160},"Endure":{"type":"Normal","category":"Status"},"Energy Ball":{"bp":90,"type":"Grass","category":"Special","hasSecondaryEffect":true,"isBullet":true},"Entrainment":{"type":"Normal","category":"Status"},"Eruption":{"bp":150,"type":"Fire","category":"Special","isSpread":true,"zp":200},"Expanding Force":{"bp":80,"type":"Psychic","category":"Special"},"Explosion":{"bp":250,"type":"Normal","category":"Physical","isSpread":true,"isGen3Spread":true},"Extrasensory":{"bp":80,"type":"Psychic","category":"Special","hasSecondaryEffect":true,"miniDoubleBP":false},"Extreme Speed":{"bp":80,"type":"Normal","category":"Physical","makesContact":true,"isPriority":true},"Facade":{"bp":70,"type":"Normal","category":"Physical","makesContact":true,"ignoresBurn":true},"Fairy Lock":{"type":"Fairy","category":"Status"},"Fake Out":{"bp":40,"type":"Normal","category":"Physical","hasSecondaryEffect":true,"isPriority":true,"makesContact":true},"Fake Tears":{"type":"Dark","category":"Status"},"Feather Dance":{"type":"Flying","category":"Status"},"Feint":{"bp":30,"type":"Normal","category":"Physical","isPriority":true},"Fell Stinger":{"bp":50,"type":"Bug","category":"Physical","makesContact":true},"Fickle Beam":{"bp":80,"type":"Dragon","category":"Special","canDouble":true},"Fiery Dance":{"bp":80,"type":"Fire","category":"Special","hasSecondaryEffect":true},"Final Gambit":{"bp":1,"type":"Fighting","category":"Special","zp":180},"Fire Blast":{"bp":110,"type":"Fire","category":"Special","hasSecondaryEffect":true},"Fire Fang":{"bp":65,"type":"Fire","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"isBite":true},"Fire Lash":{"category":"Physical","type":"Fire","makesContact":true,"bp":90,"hasSecondaryEffect":true,"statChange":["defense",-1,"target"]},"Fire Punch":{"bp":75,"type":"Fire","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"isPunch":true},"Fire Spin":{"bp":35,"type":"Fire","category":"Special"},"First Impression":{"category":"Physical","type":"Bug","makesContact":true,"bp":100,"isPriority":true},"Fissure":{"bp":1,"type":"Ground","category":"Physical","isOHKO":true,"zp":180},"Flail":{"bp":1,"type":"Normal","category":"Physical","makesContact":true,"zp":160},"Flame Charge":{"bp":50,"type":"Fire","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Flamethrower":{"bp":90,"type":"Fire","category":"Special","hasSecondaryEffect":true},"Flare Blitz":{"bp":120,"type":"Fire","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"recoilHP":[1,3]},"Flash Cannon":{"bp":80,"type":"Steel","category":"Special","hasSecondaryEffect":true},"Flatter":{"type":"Dark","category":"Status"},"Fling":{"bp":1,"type":"Dark","category":"Physical"},"Flip Turn":{"bp":60,"type":"Water","category":"Physical","makesContact":true},"Flower Trick":{"bp":70,"type":"Grass","category":"Physical","alwaysCrit":true},"Fly":{"bp":90,"type":"Flying","category":"Physical","makesContact":true},"Flying Press":{"bp":100,"type":"Fighting","category":"Physical","makesContact":true,"miniDoubleBP":true,"zp":170},"Focus Blast":{"bp":120,"type":"Fighting","category":"Special","hasSecondaryEffect":true,"isBullet":true},"Focus Energy":{"type":"Normal","category":"Status"},"Focus Punch":{"bp":150,"type":"Fighting","category":"Physical","makesContact":true,"isPunch":true},"Follow Me":{"type":"Normal","category":"Status"},"Forest's Curse":{"type":"Grass","category":"Status"},"Foul Play":{"bp":95,"type":"Dark","category":"Physical","makesContact":true},"Freeze-Dry":{"bp":70,"type":"Ice","category":"Special","hasSecondaryEffect":true},"Frenzy Plant":{"bp":150,"type":"Grass","category":"Special"},"Frost Breath":{"bp":60,"type":"Ice","category":"Special","alwaysCrit":true},"Future Sight":{"bp":120,"type":"Psychic","category":"Special"},"Gastro Acid":{"type":"Poison","category":"Status"},"Giga Drain":{"bp":75,"type":"Grass","category":"Special","isHealing":true,"drainHP":[1,2]},"Giga Impact":{"bp":150,"type":"Normal","category":"Physical","makesContact":true},"Gigaton Hammer":{"bp":160,"type":"Steel","category":"Physical"},"Glare":{"type":"Normal","category":"Status"},"Grass Knot":{"bp":1,"type":"Grass","category":"Special","makesContact":true,"zp":160},"Grassy Glide":{"bp":55,"type":"Grass","category":"Physical","makesContact":true},"Grassy Terrain":{"type":"Grass","category":"Status"},"Grav Apple":{"bp":90,"type":"Grass","category":"Physical","hasSecondaryEffect":true,"statChange":["defense",-1,"target"]},"Gravity":{"type":"Psychic","category":"Status"},"Growth":{"type":"Grass","category":"Status"},"Guard Split":{"type":"Psychic","category":"Status"},"Guard Swap":{"type":"Psychic","category":"Status"},"Guillotine":{"bp":1,"type":"Normal","category":"Physical","makesContact":true,"isOHKO":true,"zp":180},"Gunk Shot":{"bp":120,"type":"Poison","category":"Physical","hasSecondaryEffect":true},"Gyro Ball":{"bp":1,"type":"Steel","category":"Physical","makesContact":true,"isBullet":true,"zp":160},"Hammer Arm":{"bp":100,"type":"Fighting","category":"Physical","makesContact":true,"isPunch":true},"Hard Press":{"bp":1,"type":"Steel","category":"Physical","makesContact":true},"Haze":{"type":"Ice","category":"Status"},"Head Smash":{"bp":150,"type":"Rock","category":"Physical","makesContact":true,"recoilHP":[1,2]},"Headlong Rush":{"bp":120,"type":"Ground","category":"Physical","isPunch":true,"makesContact":true},"Heal Bell":{"type":"Normal","category":"Status"},"Heal Pulse":{"type":"Psychic","category":"Status","isPulse":true,"isHealing":true},"Healing Wish":{"type":"Psychic","category":"Status"},"Heat Crash":{"bp":1,"type":"Fire","category":"Physical","makesContact":true,"zp":160,"miniDoubleBP":true},"Heat Wave":{"bp":95,"type":"Fire","category":"Special","hasSecondaryEffect":true,"isSpread":true,"isWind":true},"Heavy Slam":{"bp":1,"type":"Steel","category":"Physical","makesContact":true,"zp":160,"miniDoubleBP":true},"Helping Hand":{"type":"Normal","category":"Status"},"Hex":{"bp":65,"type":"Ghost","category":"Special","zp":160},"High Horsepower":{"category":"Physical","type":"Ground","makesContact":true,"bp":95},"High Jump Kick":{"bp":130,"type":"Fighting","category":"Physical","makesContact":true,"hasCrash":true},"Horn Drill":{"bp":1,"type":"Normal","category":"Physical","makesContact":true,"isOHKO":true,"zp":180},"Horn Leech":{"bp":75,"type":"Grass","category":"Physical","makesContact":true,"isHealing":true,"drainHP":[1,2]},"Howl":{"type":"Normal","category":"Status"},"Hurricane":{"bp":110,"type":"Flying","category":"Special","hasSecondaryEffect":true,"isWind":true},"Hydro Cannon":{"bp":150,"type":"Water","category":"Special"},"Hydro Pump":{"bp":110,"type":"Water","category":"Special"},"Hyper Beam":{"bp":150,"type":"Normal","category":"Special"},"Hyper Voice":{"bp":90,"type":"Normal","category":"Special","isSound":true,"isSpread":true},"Hypnosis":{"type":"Psychic","category":"Status"},"Ice Beam":{"bp":90,"type":"Ice","category":"Special","hasSecondaryEffect":true},"Ice Fang":{"bp":65,"type":"Ice","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"isBite":true},"Ice Hammer":{"category":"Physical","type":"Ice","makesContact":true,"bp":100,"isPunch":true},"Ice Punch":{"bp":75,"type":"Ice","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"isPunch":true},"Ice Shard":{"bp":40,"type":"Ice","category":"Physical","isPriority":true},"Ice Spinner":{"bp":80,"type":"Ice","category":"Physical","makesContact":true},"Icicle Crash":{"bp":85,"type":"Ice","category":"Physical","hasSecondaryEffect":true},"Icicle Spear":{"bp":25,"type":"Ice","category":"Physical","hitRange":[2,5],"zp":140},"Icy Wind":{"bp":55,"type":"Ice","category":"Special","hasSecondaryEffect":true,"isSpread":true,"isWind":true},"Imprison":{"type":"Psychic","category":"Status"},"Infernal Parade":{"bp":65,"type":"Ghost","category":"Special","hasSecondaryEffect":true},"Inferno":{"bp":100,"type":"Fire","category":"Special","hasSecondaryEffect":true},"Infestation":{"bp":20,"type":"Bug","category":"Special","makesContact":true},"Ingrain":{"type":"Grass","category":"Status"},"Instruct":{"type":"Psychic","category":"Status"},"Iron Defense":{"type":"Steel","category":"Status"},"Iron Head":{"bp":80,"type":"Steel","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Iron Tail":{"bp":100,"type":"Steel","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Jet Punch":{"bp":60,"type":"Water","category":"Physical","makesContact":true,"isPunch":true,"isPriority":true},"King's Shield":{"type":"Steel","category":"Status"},"Knock Off":{"bp":65,"type":"Dark","category":"Physical","makesContact":true},"Kowtow Cleave":{"bp":85,"type":"Dark","category":"Physical","makesContact":true,"isSlice":true},"Lash Out":{"bp":75,"type":"Dark","category":"Physical","makesContact":true,"canDouble":true},"Last Resort":{"bp":140,"type":"Normal","category":"Physical","makesContact":true},"Last Respects":{"bp":50,"type":"Ghost","category":"Physical","linearAddBP":true},"Lava Plume":{"bp":80,"type":"Fire","category":"Special","hasSecondaryEffect":true,"isSpread":true},"Leaf Blade":{"bp":90,"type":"Grass","category":"Physical","makesContact":true,"isSlice":true},"Leaf Storm":{"bp":130,"type":"Grass","category":"Special","statChange":["special attack",-2,"user"]},"Leech Life":{"bp":80,"type":"Bug","category":"Physical","makesContact":true,"isHealing":true,"drainHP":[1,2]},"Leech Seed":{"type":"Grass","category":"Status"},"Life Dew":{"type":"Water","category":"Status"},"Light Screen":{"type":"Psychic","category":"Status"},"Light of Ruin":{"bp":140,"type":"Fairy","category":"Special","recoilHP":[1,2]},"Liquidation":{"category":"Physical","type":"Water","makesContact":true,"hasSecondaryEffect":true,"bp":85},"Lock-On":{"type":"Normal","category":"Status"},"Low Kick":{"bp":1,"type":"Fighting","category":"Physical","makesContact":true,"zp":160},"Low Sweep":{"bp":65,"type":"Fighting","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Lumina Crash":{"bp":80,"type":"Psychic","category":"Special","hasSecondaryEffect":true,"statChange":["special defense",-2,"target"]},"Lunge":{"category":"Physical","type":"Bug","makesContact":true,"bp":80,"hasSecondaryEffect":true},"Mach Punch":{"bp":40,"type":"Fighting","category":"Physical","makesContact":true,"isPunch":true,"isPriority":true},"Magic Powder":{"type":"Psychic","category":"Status"},"Magic Room":{"type":"Psychic","category":"Status"},"Magnet Rise":{"type":"Electric","category":"Status"},"Magnetic Flux":{"type":"Electric","category":"Status"},"Matcha Gotcha":{"bp":80,"type":"Grass","category":"Special","hasSecondaryEffect":true,"isSpread":true,"isHealing":true,"drainHP":[1,2]},"Mean Look":{"type":"Normal","category":"Status"},"Mega Kick":{"bp":120,"type":"Normal","category":"Physical","makesContact":true},"Megahorn":{"bp":120,"type":"Bug","category":"Physical","makesContact":true},"Memento":{"type":"Dark","category":"Status"},"Metal Burst":{"bp":1,"type":"Steel","category":"Physical","usesOppMoves":true},"Metal Sound":{"type":"Steel","category":"Status"},"Meteor Beam":{"bp":120,"type":"Rock","category":"Special"},"Meteor Mash":{"bp":90,"type":"Steel","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"isPunch":true},"Minimize":{"type":"Normal","category":"Status"},"Mirror Coat":{"bp":1,"type":"Psychic","category":"Special","usesOppMoves":true},"Misty Explosion":{"bp":100,"type":"Fairy","category":"Special","isSpread":true},"Misty Terrain":{"type":"Fairy","category":"Status"},"Moonblast":{"bp":95,"type":"Fairy","category":"Special","hasSecondaryEffect":true},"Moonlight":{"type":"Fairy","category":"Status"},"Morning Sun":{"type":"Normal","category":"Status"},"Mortal Spin":{"bp":30,"type":"Poison","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"isSpread":true},"Mountain Gale":{"bp":120,"type":"Ice","category":"Physical","hasSecondaryEffect":true},"Mud Shot":{"bp":55,"type":"Ground","category":"Special","hasSecondaryEffect":true},"Mud-Slap":{"bp":20,"type":"Ground","category":"Special","hasSecondaryEffect":true},"Muddy Water":{"bp":90,"type":"Water","category":"Special","hasSecondaryEffect":true,"isSpread":true},"Mystical Fire":{"bp":75,"type":"Fire","category":"Special","hasSecondaryEffect":true},"Nasty Plot":{"type":"Dark","category":"Status"},"Night Daze":{"bp":90,"type":"Dark","category":"Special","hasSecondaryEffect":true},"Night Shade":{"bp":1,"type":"Ghost","category":"Special"},"Night Slash":{"bp":70,"type":"Dark","category":"Physical","makesContact":true,"isSlice":true},"Noble Roar":{"type":"Normal","category":"Status"},"Nuzzle":{"category":"Physical","type":"Electric","bp":20,"makesContact":true,"hasSecondaryEffect":true},"Outrage":{"bp":120,"type":"Dragon","category":"Physical","makesContact":true},"Overheat":{"bp":130,"type":"Fire","category":"Special","makesContact":false,"statChange":["special attack",-2,"user"]},"Pain Split":{"type":"Normal","category":"Status"},"Parabolic Charge":{"bp":65,"type":"Electric","category":"Special","isSpread":true,"isHealing":true,"drainHP":[1,2]},"Parting Shot":{"type":"Dark","category":"Status"},"Payback":{"bp":50,"type":"Dark","category":"Physical","makesContact":true,"canDouble":true},"Perish Song":{"type":"Normal","category":"Status"},"Petal Blizzard":{"bp":90,"type":"Grass","category":"Physical","isSpread":true,"isWind":true},"Petal Dance":{"bp":120,"type":"Grass","category":"Special","makesContact":true},"Phantom Force":{"bp":90,"type":"Ghost","category":"Physical","makesContact":true,"miniDoubleBP":false},"Pin Missile":{"bp":25,"type":"Bug","category":"Physical","hitRange":[2,5],"zp":140},"Play Rough":{"bp":90,"type":"Fairy","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Pluck":{"bp":60,"type":"Flying","category":"Physical","makesContact":true},"Poison Fang":{"bp":50,"type":"Poison","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"isBite":true},"Poison Jab":{"bp":80,"type":"Poison","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Poison Powder":{"type":"Poison","category":"Status"},"Pollen Puff":{"category":"Special","type":"Bug","bp":90,"isBullet":true},"Poltergeist":{"bp":110,"type":"Ghost","category":"Physical"},"Population Bomb":{"bp":20,"type":"Normal","category":"Physical","makesContact":true,"isSlice":true,"hitRange":[1,10]},"Pounce":{"bp":50,"type":"Bug","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Power Gem":{"bp":80,"type":"Rock","category":"Special"},"Power Split":{"type":"Psychic","category":"Status"},"Power Swap":{"type":"Psychic","category":"Status"},"Power Trick":{"type":"Psychic","category":"Status"},"Power Trip":{"category":"Physical","type":"Dark","makesContact":true,"bp":20,"zp":160},"Power Whip":{"bp":120,"type":"Grass","category":"Physical","makesContact":true},"Protect":{"type":"Normal","category":"Status"},"Psych Up":{"type":"Normal","category":"Status"},"Psychic":{"bp":90,"type":"Psychic","category":"Special","hasSecondaryEffect":true},"Psychic Fangs":{"category":"Physical","type":"Psychic","makesContact":true,"bp":85,"isBite":true,"ignoresScreens":true},"Psychic Noise":{"bp":75,"type":"Psychic","category":"Special","hasSecondaryEffect":true,"isSound":true},"Psychic Terrain":{"type":"Psychic","category":"Status"},"Psycho Cut":{"bp":70,"type":"Psychic","category":"Physical","isSlice":true},"Psyshield Bash":{"bp":90,"type":"Psychic","category":"Physical","hasSecondaryEffect":true,"makesContact":true},"Psyshock":{"bp":80,"type":"Psychic","category":"Special","dealsPhysicalDamage":true},"Quash":{"type":"Dark","category":"Status"},"Quick Attack":{"bp":40,"type":"Normal","category":"Physical","makesContact":true,"isPriority":true},"Quick Guard":{"type":"Fighting","category":"Status"},"Quiver Dance":{"type":"Bug","category":"Status"},"Rage Powder":{"type":"Bug","category":"Status"},"Raging Bull":{"bp":90,"type":"Normal","category":"Physical","makesContact":true,"ignoresScreens":true},"Raging Fury":{"bp":120,"type":"Fire","category":"Physical"},"Rain Dance":{"type":"Water","category":"Status"},"Rapid Spin":{"bp":50,"type":"Normal","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Razor Shell":{"bp":75,"type":"Water","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"isSlice":true},"Recover":{"type":"Normal","category":"Status"},"Recycle":{"type":"Normal","category":"Status"},"Reflect":{"type":"Psychic","category":"Status"},"Reflect Type":{"type":"Normal","category":"Status"},"Rest":{"type":"Psychic","category":"Status"},"Reversal":{"bp":1,"type":"Fighting","category":"Physical","makesContact":true,"zp":160},"Rising Voltage":{"bp":70,"type":"Electric","category":"Special"},"Roar":{"type":"Normal","category":"Status"},"Rock Blast":{"bp":25,"type":"Rock","category":"Physical","hitRange":[2,5],"zp":140,"isBullet":true},"Rock Polish":{"type":"Rock","category":"Status"},"Rock Slide":{"bp":75,"type":"Rock","category":"Physical","hasSecondaryEffect":true,"isSpread":true},"Rock Tomb":{"bp":60,"type":"Rock","category":"Physical","hasSecondaryEffect":true},"Rock Wrecker":{"bp":150,"type":"Rock","category":"Physical","isBullet":true},"Role Play":{"type":"Psychic","category":"Status"},"Roost":{"type":"Flying","category":"Status"},"Round":{"bp":60,"type":"Normal","category":"Special","isSound":true,"canDouble":true},"Sacred Sword":{"bp":90,"type":"Fighting","category":"Physical","makesContact":true,"ignoresDefenseBoosts":true,"isSlice":true},"Safeguard":{"type":"Normal","category":"Status"},"Salt Cure":{"bp":40,"type":"Rock","category":"Physical","hasSecondaryEffect":true},"Sand Tomb":{"bp":35,"type":"Ground","category":"Physical"},"Sandstorm":{"type":"Rock","category":"Status"},"Scald":{"bp":80,"type":"Water","category":"Special","hasSecondaryEffect":true},"Scale Shot":{"bp":25,"type":"Dragon","category":"Physical","hitRange":[2,5]},"Scary Face":{"type":"Normal","category":"Status"},"Scorching Sands":{"bp":70,"type":"Ground","category":"Special","hasSecondaryEffect":true},"Screech":{"type":"Normal","category":"Status"},"Seed Bomb":{"bp":80,"type":"Grass","category":"Physical","isBullet":true},"Seismic Toss":{"bp":1,"type":"Fighting","category":"Physical","makesContact":true},"Self-Destruct":{"bp":200,"type":"Normal","category":"Physical","isSpread":true,"isGen3Spread":true},"Shadow Ball":{"bp":80,"type":"Ghost","category":"Special","hasSecondaryEffect":true,"isBullet":true},"Shadow Claw":{"bp":70,"type":"Ghost","category":"Physical","makesContact":true,"isSlice":true},"Shadow Punch":{"bp":60,"type":"Ghost","category":"Physical","makesContact":true,"isPunch":true},"Shadow Sneak":{"bp":40,"type":"Ghost","category":"Physical","makesContact":true,"isPriority":true},"Shed Tail":{"type":"Normal","category":"Status","costHP":[1,2,"roundUp"]},"Sheer Cold":{"bp":1,"type":"Ice","category":"Special","isOHKO":true,"zp":180},"Shell Side Arm":{"bp":90,"type":"Poison","category":"Special","hasSecondaryEffect":true},"Shell Smash":{"type":"Normal","category":"Status"},"Shelter":{"type":"Steel","category":"Status"},"Simple Beam":{"type":"Normal","category":"Status"},"Sing":{"type":"Normal","category":"Status"},"Skill Swap":{"type":"Psychic","category":"Status"},"Skitter Smack":{"bp":70,"type":"Bug","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Sky Attack":{"bp":140,"type":"Flying","category":"Physical","hasSecondaryEffect":true},"Slack Off":{"type":"Normal","category":"Status"},"Sleep Powder":{"type":"Grass","category":"Status"},"Sleep Talk":{"type":"Normal","category":"Status"},"Sludge Bomb":{"bp":90,"type":"Poison","category":"Special","hasSecondaryEffect":true,"isBullet":true},"Sludge Wave":{"bp":95,"type":"Poison","category":"Special","hasSecondaryEffect":true,"isSpread":true},"Smack Down":{"bp":50,"type":"Rock","category":"Physical"},"Smart Strike":{"category":"Physical","type":"Steel","makesContact":true,"bp":70},"Snap Trap":{"bp":35,"type":"Steel","category":"Physical","makesContact":true},"Snarl":{"bp":55,"type":"Dark","category":"Special","hasSecondaryEffect":true,"isSound":true,"isSpread":true},"Snore":{"bp":50,"type":"Normal","category":"Special","hasSecondaryEffect":true,"isSound":true},"Snowscape":{"type":"Ice","category":"Status"},"Soak":{"type":"Water","category":"Status"},"Solar Beam":{"bp":120,"type":"Grass","category":"Special"},"Solar Blade":{"category":"Physical","type":"Grass","makesContact":true,"bp":125,"isSlice":true},"Sparkling Aria":{"category":"Special","type":"Water","bp":90,"isSpread":true,"hasSecondaryEffect":true,"isSound":true},"Speed Swap":{"type":"Psychic","category":"Status"},"Spicy Extract":{"type":"Grass","category":"Status"},"Spikes":{"type":"Ground","category":"Status","isSpread":true},"Spiky Shield":{"type":"Grass","category":"Status"},"Spirit Shackle":{"category":"Physical","type":"Ghost","bp":90,"hasSecondaryEffect":true},"Spite":{"type":"Ghost","category":"Status"},"Stealth Rock":{"type":"Rock","category":"Status","isSpread":true},"Steel Beam":{"bp":140,"type":"Steel","category":"Special","costHP":[1,2,"roundUp"]},"Steel Roller":{"bp":130,"type":"Steel","category":"Physical","makesContact":true},"Steel Wing":{"bp":70,"type":"Steel","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Sticky Web":{"type":"Bug","category":"Status","isSpread":true},"Stockpile":{"type":"Normal","category":"Status"},"Stomping Tantrum":{"category":"Physical","type":"Ground","makesContact":true,"bp":75,"canDouble":true},"Stone Axe":{"bp":65,"type":"Rock","category":"Physical","makesContact":true,"isSlice":true,"hasSecondaryEffect":true},"Stone Edge":{"bp":100,"type":"Rock","category":"Physical"},"Stored Power":{"bp":20,"type":"Psychic","category":"Special","zp":160},"Storm Throw":{"bp":60,"type":"Fighting","category":"Physical","makesContact":true,"alwaysCrit":true},"Strength Sap":{"type":"Grass","category":"Status","isHealing":true},"String Shot":{"type":"Bug","category":"Status","isSpread":true},"Struggle":{"bp":50,"type":"Normal","category":"Physical","makesContact":true,"zp":1},"Struggle Bug":{"bp":50,"type":"Bug","category":"Special","isSpread":true,"hasSecondaryEffect":true},"Stuff Cheeks":{"type":"Normal","category":"Status"},"Stun Spore":{"type":"Grass","category":"Status"},"Substitute":{"type":"Normal","category":"Status","costHP":[1,4,"roundDown"]},"Sucker Punch":{"bp":70,"type":"Dark","category":"Physical","makesContact":true,"isPriority":true},"Sunny Day":{"type":"Fire","category":"Status"},"Super Fang":{"bp":1,"type":"Normal","category":"Physical","makesContact":true},"Supercell Slam":{"bp":100,"type":"Electric","category":"Physical","makesContact":true,"hasCrash":true,"miniDoubleBP":true},"Superpower":{"bp":120,"type":"Fighting","category":"Physical","makesContact":true,"statChange":["attack",-1,"user"]},"Surf":{"bp":90,"type":"Water","category":"Special","isSpread":true},"Swagger":{"type":"Normal","category":"Status"},"Swallow":{"type":"Normal","category":"Status"},"Sweet Kiss":{"type":"Fairy","category":"Status"},"Sweet Scent":{"type":"Normal","category":"Status","isSpread":true},"Switcheroo":{"type":"Dark","category":"Status"},"Swords Dance":{"type":"Normal","category":"Status"},"Synthesis":{"type":"Grass","category":"Status"},"Syrup Bomb":{"bp":60,"type":"Grass","category":"Special","hasSecondaryEffect":true,"isBullet":true},"Tail Slap":{"bp":25,"type":"Normal","category":"Physical","makesContact":true,"hitRange":[2,5],"zp":140},"Tailwind":{"type":"Flying","category":"Status"},"Taunt":{"type":"Dark","category":"Status"},"Tearful Look":{"type":"Normal","category":"Status"},"Teatime":{"type":"Normal","category":"Status"},"Teeter Dance":{"type":"Normal","category":"Status","isSpread":true},"Temper Flare":{"bp":75,"type":"Fire","category":"Physical","canDouble":true,"makesContact":true},"Terrain Pulse":{"bp":50,"type":"Normal","category":"Special","isPulse":true},"Thief":{"bp":60,"type":"Dark","category":"Physical","makesContact":true},"Thrash":{"bp":120,"type":"Normal","category":"Physical","makesContact":true},"Throat Chop":{"category":"Physical","type":"Dark","makesContact":true,"hasSecondaryEffect":true,"bp":80},"Thunder":{"bp":110,"type":"Electric","category":"Special","hasSecondaryEffect":true},"Thunder Fang":{"bp":65,"type":"Electric","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"isBite":true},"Thunder Punch":{"bp":75,"type":"Electric","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"isPunch":true},"Thunder Wave":{"type":"Electric","category":"Status"},"Thunderbolt":{"bp":90,"type":"Electric","category":"Special","hasSecondaryEffect":true},"Tickle":{"type":"Normal","category":"Status"},"Tidy Up":{"type":"Normal","category":"Status"},"Torch Song":{"bp":80,"type":"Fire","category":"Special","isSound":true,"hasSecondaryEffect":true,"statChange":["special attack",1,"user"]},"Torment":{"type":"Dark","category":"Status"},"Toxic":{"type":"Poison","category":"Status"},"Toxic Spikes":{"type":"Poison","category":"Status","isSpread":true},"Toxic Thread":{"type":"Poison","category":"Status"},"Trailblaze":{"bp":50,"type":"Grass","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Transform":{"type":"Normal","category":"Status"},"Tri Attack":{"bp":80,"type":"Normal","category":"Special","hasSecondaryEffect":true},"Trick":{"type":"Psychic","category":"Status"},"Trick Room":{"type":"Psychic","category":"Status"},"Trick-or-Treat":{"type":"Ghost","category":"Status"},"Triple Arrows":{"bp":90,"type":"Fighting","category":"Physical","hasSecondaryEffect":true},"Triple Axel":{"bp":20,"type":"Ice","category":"Physical","makesContact":true,"isTripleHit":true,"hitRange":[1,3]},"Trop Kick":{"category":"Physical","type":"Grass","makesContact":true,"bp":85,"hasSecondaryEffect":true},"Twin Beam":{"bp":40,"type":"Psychic","category":"Special","hitRange":2},"U-turn":{"bp":70,"type":"Bug","category":"Physical","makesContact":true},"Upper Hand":{"bp":65,"type":"Fighting","category":"Physical","hasSecondaryEffect":true,"makesContact":true,"isPriority":true},"Uproar":{"bp":90,"type":"Normal","category":"Special","isSound":true},"Vacuum Wave":{"bp":40,"type":"Fighting","category":"Special","isPriority":true},"Venoshock":{"bp":65,"type":"Poison","category":"Special"},"Volt Switch":{"bp":70,"type":"Electric","category":"Special"},"Volt Tackle":{"bp":120,"type":"Electric","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"recoilHP":[1,3]},"Water Pulse":{"bp":60,"type":"Water","category":"Special","hasSecondaryEffect":true,"isPulse":true},"Water Shuriken":{"bp":15,"type":"Water","category":"Special","hitRange":[2,5],"isPriority":true},"Water Spout":{"bp":150,"type":"Water","category":"Special","isSpread":true,"zp":200},"Waterfall":{"bp":80,"type":"Water","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Wave Crash":{"bp":120,"type":"Water","category":"Physical","makesContact":true,"recoilHP":[1,3]},"Weather Ball":{"bp":50,"type":"Normal","category":"Special","isBullet":true,"zp":160},"Whirlpool":{"bp":35,"type":"Water","category":"Special"},"Whirlwind":{"type":"Normal","category":"Status"},"Wide Guard":{"type":"Rock","category":"Status"},"Wild Charge":{"bp":90,"type":"Electric","category":"Physical","makesContact":true,"recoilHP":[1,4]},"Will-O-Wisp":{"type":"Fire","category":"Status"},"Wish":{"type":"Normal","category":"Status"},"Wonder Room":{"type":"Psychic","category":"Status"},"Wood Hammer":{"bp":120,"type":"Grass","category":"Physical","makesContact":true,"recoilHP":[1,3]},"Worry Seed":{"type":"Grass","category":"Status"},"Wrap":{"bp":15,"type":"Normal","category":"Physical","makesContact":true},"X-Scissor":{"bp":80,"type":"Bug","category":"Physical","makesContact":true,"isSlice":true},"Yawn":{"type":"Normal","category":"Status"},"Zap Cannon":{"bp":120,"type":"Electric","category":"Special","hasSecondaryEffect":true,"isBullet":true},"Zen Headbutt":{"bp":80,"type":"Psychic","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Barb Barrage":{"bp":60,"type":"Poison","category":"Physical","hasSecondaryEffect":true},"Make It Rain":{"bp":120,"type":"Steel","category":"Special","isSpread":true,"statChange":["special attack",-2,"user"]},"No Retreat":{"type":"Fighting","category":"Status"},"Rage Fist":{"bp":50,"type":"Ghost","category":"Physical","makesContact":true,"isPunch":true,"linearAddBP":true},"Spirit Break":{"bp":75,"type":"Fairy","category":"Physical","hasSecondaryEffect":true,"makesContact":true},"Topsy-Turvy":{"type":"Dark","category":"Status"}};
var MOVES_CHAMPIONS_NATDEX = {"Struggle":{"bp":50,"type":"Normal","category":"Physical","makesContact":true,"zp":1},"(No Move)":{"type":"Typeless","category":"Status"},"Acid":{"bp":40,"type":"Poison","category":"Special","hasSecondaryEffect":true,"isSpread":true},"Bind":{"bp":15,"type":"Normal","category":"Physical","makesContact":true},"Blizzard":{"bp":110,"type":"Ice","category":"Special","hasSecondaryEffect":true,"isSpread":true,"isWind":true},"Body Slam":{"bp":85,"type":"Normal","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"miniDoubleBP":true},"Bubble Beam":{"bp":65,"type":"Water","category":"Special","hasSecondaryEffect":true},"Clamp":{"bp":35,"type":"Water","category":"Physical","makesContact":true},"Crabhammer":{"bp":100,"type":"Water","category":"Physical","makesContact":true},"Dig":{"bp":80,"type":"Ground","category":"Physical","makesContact":true},"Double Kick":{"bp":30,"type":"Fighting","category":"Physical","makesContact":true,"hitRange":2},"Double-Edge":{"bp":120,"type":"Normal","category":"Physical","makesContact":true,"recoilHP":[1,3]},"Drill Peck":{"bp":80,"type":"Flying","category":"Physical","makesContact":true},"Earthquake":{"bp":100,"type":"Ground","category":"Physical","isSpread":true,"isGen3Spread":true},"Explosion":{"bp":250,"type":"Normal","category":"Physical","isSpread":true,"isGen3Spread":true},"Fire Blast":{"bp":110,"type":"Fire","category":"Special","hasSecondaryEffect":true},"Fire Punch":{"bp":75,"type":"Fire","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"isPunch":true},"Fire Spin":{"bp":35,"type":"Fire","category":"Special"},"Flamethrower":{"bp":90,"type":"Fire","category":"Special","hasSecondaryEffect":true},"High Jump Kick":{"bp":130,"type":"Fighting","category":"Physical","makesContact":true,"hasCrash":true},"Hydro Pump":{"bp":110,"type":"Water","category":"Special"},"Hyper Beam":{"bp":150,"type":"Normal","category":"Special"},"Ice Beam":{"bp":90,"type":"Ice","category":"Special","hasSecondaryEffect":true},"Ice Punch":{"bp":75,"type":"Ice","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"isPunch":true},"Mega Drain":{"bp":40,"type":"Grass","category":"Special","zp":120,"isHealing":true,"drainHP":[1,2]},"Night Shade":{"bp":1,"type":"Ghost","category":"Special"},"Pin Missile":{"bp":25,"type":"Bug","category":"Physical","hitRange":[2,5],"zp":140},"Psychic":{"bp":90,"type":"Psychic","category":"Special","hasSecondaryEffect":true},"Quick Attack":{"bp":40,"type":"Normal","category":"Physical","makesContact":true,"isPriority":true},"Razor Leaf":{"bp":55,"type":"Grass","category":"Physical","isSpread":true,"isSlice":true},"Rock Slide":{"bp":75,"type":"Rock","category":"Physical","hasSecondaryEffect":true,"isSpread":true},"Seismic Toss":{"bp":1,"type":"Fighting","category":"Physical","makesContact":true},"Self-Destruct":{"bp":200,"type":"Normal","category":"Physical","isSpread":true,"isGen3Spread":true},"Sky Attack":{"bp":140,"type":"Flying","category":"Physical","hasSecondaryEffect":true},"Slash":{"bp":70,"type":"Normal","category":"Physical","makesContact":true,"isSlice":true},"Sludge":{"bp":65,"type":"Poison","category":"Special","hasSecondaryEffect":true},"Submission":{"bp":80,"type":"Fighting","category":"Physical","makesContact":true,"recoilHP":[1,4]},"Surf":{"bp":90,"type":"Water","category":"Special","isSpread":true},"Tackle":{"bp":40,"type":"Normal","category":"Physical","makesContact":true},"Thunder":{"bp":110,"type":"Electric","category":"Special","hasSecondaryEffect":true},"Thunder Punch":{"bp":75,"type":"Electric","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"isPunch":true},"Thunderbolt":{"bp":90,"type":"Electric","category":"Special","hasSecondaryEffect":true},"Twineedle":{"bp":25,"type":"Bug","hitRange":2,"category":"Physical","hasSecondaryEffect":true},"Wrap":{"bp":15,"type":"Normal","category":"Physical","makesContact":true},"Swords Dance":{"type":"Normal","category":"Status"},"Whirlwind":{"type":"Normal","category":"Status"},"Tail Whip":{"type":"Normal","category":"Status","isSpread":true},"Leer":{"type":"Normal","category":"Status","isSpread":true},"Growl":{"type":"Normal","category":"Status","isSpread":true},"Roar":{"type":"Normal","category":"Status"},"Sing":{"type":"Normal","category":"Status"},"Disable":{"type":"Normal","category":"Status"},"Mist":{"type":"Ice","category":"Status"},"Leech Seed":{"type":"Grass","category":"Status"},"Growth":{"type":"Grass","category":"Status"},"Stun Spore":{"type":"Grass","category":"Status"},"Sleep Powder":{"type":"Grass","category":"Status"},"String Shot":{"type":"Bug","category":"Status","isSpread":true},"Thunder Wave":{"type":"Electric","category":"Status"},"Toxic":{"type":"Poison","category":"Status"},"Hypnosis":{"type":"Psychic","category":"Status"},"Agility":{"type":"Psychic","category":"Status"},"Teleport":{"type":"Psychic","category":"Status"},"Screech":{"type":"Normal","category":"Status"},"Double Team":{"type":"Normal","category":"Status"},"Recover":{"type":"Normal","category":"Status"},"Minimize":{"type":"Normal","category":"Status"},"Barrier":{"type":"Psychic","category":"Status"},"Light Screen":{"type":"Psychic","category":"Status"},"Haze":{"type":"Ice","category":"Status"},"Reflect":{"type":"Psychic","category":"Status"},"Focus Energy":{"type":"Normal","category":"Status"},"Amnesia":{"type":"Psychic","category":"Status"},"Soft-Boiled":{"type":"Normal","category":"Status"},"Glare":{"type":"Normal","category":"Status"},"Poison Gas":{"type":"Poison","category":"Status","isSpread":true},"Lovely Kiss":{"type":"Normal","category":"Status"},"Transform":{"type":"Normal","category":"Status"},"Spore":{"type":"Grass","category":"Status"},"Acid Armor":{"type":"Poison","category":"Status"},"Rest":{"type":"Psychic","category":"Status"},"Conversion":{"type":"Normal","category":"Status"},"Substitute":{"type":"Normal","category":"Status","costHP":[1,4,"roundDown"]},"Pound":{"bp":35,"type":"Normal","category":"Physical","makesContact":true},"Karate Chop":{"bp":50,"type":"Fighting","category":"Physical","makesContact":true},"Double Slap":{"bp":15,"type":"Normal","category":"Physical","makesContact":true,"hitRange":[2,5]},"Comet Punch":{"bp":18,"type":"Normal","category":"Physical","makesContact":true,"hitRange":[2,5],"isPunch":true},"Mega Punch":{"bp":80,"type":"Normal","category":"Physical","makesContact":true,"isPunch":true},"Pay Day":{"bp":40,"type":"Normal","category":"Physical"},"Scratch":{"bp":40,"type":"Normal","category":"Physical","makesContact":true},"Vise Grip":{"bp":55,"type":"Normal","category":"Physical","makesContact":true},"Guillotine":{"bp":1,"type":"Normal","category":"Physical","makesContact":true,"isOHKO":true,"zp":180},"Razor Wind":{"bp":80,"type":"Normal","category":"Special","isSpread":true},"Cut":{"bp":50,"type":"Normal","category":"Physical","makesContact":true,"isSlice":true},"Gust":{"bp":40,"type":"Flying","category":"Special","canDouble":true,"isWind":true},"Wing Attack":{"bp":60,"type":"Flying","category":"Physical","makesContact":true},"Slam":{"bp":80,"type":"Normal","category":"Physical","makesContact":true},"Vine Whip":{"bp":45,"type":"Grass","category":"Physical","makesContact":true},"Stomp":{"bp":65,"type":"Normal","category":"Physical","makesContact":true,"miniDoubleBP":true,"hasSecondaryEffect":true},"Mega Kick":{"bp":120,"type":"Normal","category":"Physical","makesContact":true},"Rolling Kick":{"bp":60,"type":"Normal","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Sand Attack":{"type":"Ground","category":"Status"},"Horn Attack":{"bp":65,"type":"Normal","category":"Physical","makesContact":true},"Fury Attack":{"bp":15,"type":"Normal","category":"Physical","makesContact":true,"hitRange":[2,5]},"Horn Drill":{"bp":1,"type":"Normal","category":"Physical","makesContact":true,"isOHKO":true,"zp":180},"Take Down":{"bp":90,"type":"Normal","category":"Physical","makesContact":true,"recoilHP":[1,4]},"Poison Sting":{"bp":15,"type":"Poison","category":"Physical","hasSecondaryEffect":true},"Bite":{"bp":60,"type":"Dark","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"isBite":true},"Supersonic":{"type":"Normal","category":"Status"},"Sonic Boom":{"bp":1,"type":"Normal","category":"Special"},"Ember":{"bp":40,"type":"Fire","category":"Special","hasSecondaryEffect":true},"Water Gun":{"bp":40,"type":"Water","category":"Special"},"Psybeam":{"bp":65,"type":"Psychic","category":"Special","hasSecondaryEffect":true},"Aurora Beam":{"bp":65,"type":"Ice","category":"Special","hasSecondaryEffect":true},"Peck":{"bp":35,"type":"Flying","category":"Physical","makesContact":true},"Counter":{"bp":1,"type":"Fighting","category":"Physical","makesContact":true,"usesOppMoves":true},"Strength":{"bp":80,"type":"Normal","category":"Physical","makesContact":true},"Absorb":{"bp":20,"type":"Grass","category":"Special","isHealing":true,"drainHP":[1,2]},"Poison Powder":{"type":"Poison","category":"Status"},"Petal Dance":{"bp":120,"type":"Grass","category":"Special","makesContact":true},"Dragon Rage":{"bp":1,"type":"Dragon","category":"Special"},"Thunder Shock":{"bp":40,"type":"Electric","category":"Special","hasSecondaryEffect":true},"Rock Throw":{"bp":50,"type":"Rock","category":"Physical"},"Fissure":{"bp":1,"type":"Ground","category":"Physical","isOHKO":true,"zp":180},"Confusion":{"bp":50,"type":"Psychic","category":"Special"},"Meditate":{"type":"Psychic","category":"Status"},"Rage":{"bp":20,"type":"Normal","category":"Physical","makesContact":true},"Mimic":{"type":"Normal","category":"Status"},"Harden":{"type":"Normal","category":"Status"},"Smokescreen":{"type":"Normal","category":"Status"},"Confuse Ray":{"type":"Ghost","category":"Status"},"Withdraw":{"type":"Water","category":"Status"},"Defense Curl":{"type":"Normal","category":"Status"},"Metronome":{"type":"Normal","category":"Status"},"Mirror Move":{"type":"Flying","category":"Status"},"Egg Bomb":{"bp":100,"type":"Normal","category":"Physical","isBullet":true},"Lick":{"bp":30,"type":"Ghost","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Smog":{"bp":30,"type":"Poison","category":"Special","hasSecondaryEffect":true},"Bone Club":{"bp":65,"type":"Ground","category":"Physical","hasSecondaryEffect":true},"Swift":{"bp":60,"type":"Normal","category":"Special","isSpread":true},"Skull Bash":{"bp":130,"type":"Normal","category":"Physical","makesContact":true},"Spike Cannon":{"bp":20,"type":"Normal","category":"Physical","hitRange":[2,5]},"Constrict":{"bp":10,"type":"Normal","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Kinesis":{"type":"Psychic","category":"Status"},"Dream Eater":{"bp":100,"type":"Psychic","category":"Special","isHealing":true,"drainHP":[1,2]},"Barrage":{"bp":15,"type":"Normal","category":"Physical","hitRange":[2,5],"isBullet":true},"Leech Life":{"bp":80,"type":"Bug","category":"Physical","makesContact":true,"isHealing":true,"drainHP":[1,2]},"Bubble":{"bp":40,"type":"Water","category":"Special","hasSecondaryEffect":true,"isSpread":true},"Dizzy Punch":{"bp":70,"type":"Normal","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"isPunch":true},"Flash":{"type":"Normal","category":"Status"},"Splash":{"type":"Normal","category":"Status"},"Fury Swipes":{"bp":18,"type":"Normal","category":"Physical","makesContact":true,"hitRange":[2,5]},"Bonemerang":{"bp":50,"type":"Ground","category":"Physical","hitRange":2},"Hyper Fang":{"bp":80,"type":"Normal","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"isBite":true},"Sharpen":{"type":"Normal","category":"Status"},"Tri Attack":{"bp":80,"type":"Normal","category":"Special","hasSecondaryEffect":true},"Super Fang":{"bp":1,"type":"Normal","category":"Physical","makesContact":true},"Jump Kick":{"bp":100,"type":"Fighting","category":"Physical","makesContact":true,"hasCrash":true},"Thrash":{"bp":120,"type":"Normal","category":"Physical","makesContact":true},"Low Kick":{"bp":1,"type":"Fighting","category":"Physical","makesContact":true,"zp":160},"Waterfall":{"bp":80,"type":"Water","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Fly":{"bp":90,"type":"Flying","category":"Physical","makesContact":true},"Aeroblast":{"bp":100,"type":"Flying","category":"Special","isWind":true},"Ancient Power":{"bp":60,"type":"Rock","category":"Special","hasSecondaryEffect":true,"makesContact":false},"Cross Chop":{"bp":100,"type":"Fighting","category":"Physical","makesContact":true},"Crunch":{"bp":80,"type":"Dark","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"isBite":true},"Dynamic Punch":{"bp":100,"type":"Fighting","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"isPunch":true},"Extreme Speed":{"bp":80,"type":"Normal","category":"Physical","makesContact":true,"isPriority":true},"Feint Attack":{"bp":60,"type":"Dark","category":"Physical","makesContact":true},"Flail":{"bp":1,"type":"Normal","category":"Physical","makesContact":true,"zp":160},"Flame Wheel":{"bp":60,"type":"Fire","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Frustration":{"bp":102,"type":"Normal","category":"Physical","makesContact":true,"zp":160},"Giga Drain":{"bp":75,"type":"Grass","category":"Special","isHealing":true,"drainHP":[1,2]},"Headbutt":{"bp":70,"type":"Normal","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Hidden Power":{"bp":60,"type":"Normal","category":"Special"},"Hidden Power Bug":{"bp":60,"type":"Bug","category":"Special"},"Hidden Power Dark":{"bp":60,"type":"Dark","category":"Special"},"Hidden Power Dragon":{"bp":60,"type":"Dragon","category":"Special"},"Hidden Power Electric":{"bp":60,"type":"Electric","category":"Special"},"Hidden Power Fighting":{"bp":60,"type":"Fighting","category":"Special"},"Hidden Power Fire":{"bp":60,"type":"Fire","category":"Special"},"Hidden Power Flying":{"bp":60,"type":"Flying","category":"Special"},"Hidden Power Ghost":{"bp":60,"type":"Ghost","category":"Special"},"Hidden Power Grass":{"bp":60,"type":"Grass","category":"Special"},"Hidden Power Ground":{"bp":60,"type":"Ground","category":"Special"},"Hidden Power Ice":{"bp":60,"type":"Ice","category":"Special"},"Hidden Power Poison":{"bp":60,"type":"Poison","category":"Special"},"Hidden Power Psychic":{"bp":60,"type":"Psychic","category":"Special"},"Hidden Power Rock":{"bp":60,"type":"Rock","category":"Special"},"Hidden Power Steel":{"bp":60,"type":"Steel","category":"Special"},"Hidden Power Water":{"bp":60,"type":"Water","category":"Special"},"Icy Wind":{"bp":55,"type":"Ice","category":"Special","hasSecondaryEffect":true,"isSpread":true,"isWind":true},"Iron Tail":{"bp":100,"type":"Steel","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Mach Punch":{"bp":40,"type":"Fighting","category":"Physical","makesContact":true,"isPunch":true,"isPriority":true},"Megahorn":{"bp":120,"type":"Bug","category":"Physical","makesContact":true},"Pursuit":{"bp":40,"type":"Dark","category":"Physical","makesContact":true,"canDouble":true},"Rapid Spin":{"bp":50,"type":"Normal","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Return":{"bp":102,"type":"Normal","category":"Physical","makesContact":true,"zp":160},"Reversal":{"bp":1,"type":"Fighting","category":"Physical","makesContact":true,"zp":160},"Sacred Fire":{"bp":100,"type":"Fire","category":"Physical","hasSecondaryEffect":true},"Shadow Ball":{"bp":80,"type":"Ghost","category":"Special","hasSecondaryEffect":true,"isBullet":true},"Sludge Bomb":{"bp":90,"type":"Poison","category":"Special","hasSecondaryEffect":true,"isBullet":true},"Solar Beam":{"bp":120,"type":"Grass","category":"Special"},"Steel Wing":{"bp":70,"type":"Steel","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Thief":{"bp":60,"type":"Dark","category":"Physical","makesContact":true},"Zap Cannon":{"bp":120,"type":"Electric","category":"Special","hasSecondaryEffect":true,"isBullet":true},"Pain Split":{"type":"Normal","category":"Status"},"Mind Reader":{"type":"Normal","category":"Status"},"Curse":{"type":"Ghost","category":"Status","costHP":[1,2,"roundDown"]},"Cotton Spore":{"type":"Grass","category":"Status","isSpread":true},"Protect":{"type":"Normal","category":"Status"},"Scary Face":{"type":"Normal","category":"Status"},"Belly Drum":{"type":"Normal","category":"Status","costHP":[1,2,"roundDown"]},"Spikes":{"type":"Ground","category":"Status","isSpread":true},"Foresight":{"type":"Normal","category":"Status"},"Destiny Bond":{"type":"Ghost","category":"Status"},"Perish Song":{"type":"Normal","category":"Status"},"Detect":{"type":"Fighting","category":"Status"},"Lock-On":{"type":"Normal","category":"Status"},"Sandstorm":{"type":"Rock","category":"Status"},"Endure":{"type":"Normal","category":"Status"},"Charm":{"type":"Fairy","category":"Status"},"Swagger":{"type":"Normal","category":"Status"},"Milk Drink":{"type":"Normal","category":"Status"},"Sleep Talk":{"type":"Normal","category":"Status"},"Heal Bell":{"type":"Normal","category":"Status"},"Safeguard":{"type":"Normal","category":"Status"},"Baton Pass":{"type":"Normal","category":"Status"},"Encore":{"type":"Normal","category":"Status"},"Sweet Scent":{"type":"Normal","category":"Status","isSpread":true},"Morning Sun":{"type":"Normal","category":"Status"},"Synthesis":{"type":"Grass","category":"Status"},"Moonlight":{"type":"Fairy","category":"Status"},"Rain Dance":{"type":"Water","category":"Status"},"Sunny Day":{"type":"Fire","category":"Status"},"Psych Up":{"type":"Normal","category":"Status"},"Sketch":{"type":"Normal","category":"Status"},"Spider Web":{"type":"Bug","category":"Status"},"Nightmare":{"type":"Ghost","category":"Status"},"Conversion 2":{"type":"Normal","category":"Status"},"Spite":{"type":"Ghost","category":"Status"},"Sweet Kiss":{"type":"Fairy","category":"Status"},"Mean Look":{"type":"Normal","category":"Status"},"Attract":{"type":"Normal","category":"Status"},"Triple Kick":{"bp":10,"type":"Fighting","category":"Physical","makesContact":true,"isTripleHit":true,"hitRange":[1,3],"zp":120},"Snore":{"bp":50,"type":"Normal","category":"Special","hasSecondaryEffect":true,"isSound":true},"Powder Snow":{"bp":40,"type":"Ice","category":"Special","isSpread":true,"hasSecondaryEffect":true},"Mud-Slap":{"bp":20,"type":"Ground","category":"Special","hasSecondaryEffect":true},"Octazooka":{"bp":65,"type":"Water","category":"Special","hasSecondaryEffect":true,"isBullet":true},"Bone Rush":{"bp":30,"type":"Ground","category":"Physical","hitRange":[2,5],"zp":140},"Outrage":{"bp":120,"type":"Dragon","category":"Physical","makesContact":true},"Rollout":{"bp":30,"type":"Rock","category":"Physical","makesContact":true},"False Swipe":{"bp":40,"type":"Normal","category":"Physical","makesContact":true},"Spark":{"bp":65,"type":"Electric","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Fury Cutter":{"bp":40,"type":"Bug","category":"Physical","makesContact":true,"isSlice":true},"Dragon Breath":{"bp":60,"type":"Dragon","category":"Special","hasSecondaryEffect":true},"Metal Claw":{"bp":50,"type":"Steel","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"isSlice":true},"Vital Throw":{"bp":70,"type":"Fighting","category":"Physical","makesContact":true},"Twister":{"bp":40,"type":"Dragon","category":"Special","hasSecondaryEffect":true,"isSpread":true,"canDouble":true,"isWind":true},"Mirror Coat":{"bp":1,"type":"Psychic","category":"Special","usesOppMoves":true},"Future Sight":{"bp":120,"type":"Psychic","category":"Special"},"Rock Smash":{"bp":40,"type":"Fighting","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Whirlpool":{"bp":35,"type":"Water","category":"Special"},"Beat Up":{"bp":14,"type":"Dark","category":"Physical","hitRange":[1,6]},"Aerial Ace":{"bp":60,"type":"Flying","category":"Physical","makesContact":true,"isSlice":true},"Air Cutter":{"bp":60,"type":"Flying","category":"Special","isSpread":true,"isSlice":true,"isWind":true},"Blast Burn":{"bp":150,"type":"Fire","category":"Special"},"Blaze Kick":{"bp":85,"type":"Fire","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Bounce":{"bp":85,"type":"Flying","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Brick Break":{"bp":75,"type":"Fighting","category":"Physical","makesContact":true,"ignoresScreens":true},"Doom Desire":{"bp":140,"type":"Steel","category":"Special"},"Dragon Claw":{"bp":80,"type":"Dragon","category":"Physical","makesContact":true,"isSlice":true},"Eruption":{"bp":150,"type":"Fire","category":"Special","isSpread":true,"zp":200},"Extrasensory":{"bp":80,"type":"Psychic","category":"Special","hasSecondaryEffect":true,"miniDoubleBP":false},"Facade":{"bp":70,"type":"Normal","category":"Physical","makesContact":true,"ignoresBurn":true},"Fake Out":{"bp":40,"type":"Normal","category":"Physical","hasSecondaryEffect":true,"isPriority":true,"makesContact":true},"Focus Punch":{"bp":150,"type":"Fighting","category":"Physical","makesContact":true,"isPunch":true},"Heat Wave":{"bp":95,"type":"Fire","category":"Special","hasSecondaryEffect":true,"isSpread":true,"isWind":true},"Knock Off":{"bp":65,"type":"Dark","category":"Physical","makesContact":true},"Leaf Blade":{"bp":90,"type":"Grass","category":"Physical","makesContact":true,"isSlice":true},"Luster Purge":{"bp":95,"type":"Psychic","category":"Special","hasSecondaryEffect":true},"Meteor Mash":{"bp":90,"type":"Steel","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"isPunch":true},"Muddy Water":{"bp":90,"type":"Water","category":"Special","hasSecondaryEffect":true,"isSpread":true},"Mud Shot":{"bp":55,"type":"Ground","category":"Special","hasSecondaryEffect":true},"Overheat":{"bp":130,"type":"Fire","category":"Special","makesContact":false,"statChange":["special attack",-2,"user"]},"Poison Fang":{"bp":50,"type":"Poison","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"isBite":true},"Psycho Boost":{"bp":140,"type":"Psychic","category":"Special","statChange":["special attack",-2,"user"]},"Revenge":{"bp":60,"type":"Fighting","category":"Physical","makesContact":true,"canDouble":true},"Rock Blast":{"bp":25,"type":"Rock","category":"Physical","hitRange":[2,5],"zp":140,"isBullet":true},"Rock Tomb":{"bp":60,"type":"Rock","category":"Physical","hasSecondaryEffect":true},"Shadow Punch":{"bp":60,"type":"Ghost","category":"Physical","makesContact":true,"isPunch":true},"Shock Wave":{"bp":60,"type":"Electric","category":"Special"},"Signal Beam":{"bp":75,"type":"Bug","category":"Special","hasSecondaryEffect":true},"Sky Uppercut":{"bp":85,"type":"Fighting","category":"Physical","makesContact":true,"isPunch":true},"Superpower":{"bp":120,"type":"Fighting","category":"Physical","makesContact":true,"statChange":["attack",-1,"user"]},"Volt Tackle":{"bp":120,"type":"Electric","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"recoilHP":[1,3]},"Water Pulse":{"bp":60,"type":"Water","category":"Special","hasSecondaryEffect":true,"isPulse":true},"Water Spout":{"bp":150,"type":"Water","category":"Special","isSpread":true,"zp":200},"Weather Ball":{"bp":50,"type":"Normal","category":"Special","isBullet":true,"zp":160},"Dive":{"bp":80,"type":"Water","category":"Physical","makesContact":true},"Frenzy Plant":{"bp":150,"type":"Grass","category":"Special"},"Hydro Cannon":{"bp":150,"type":"Water","category":"Special"},"Endeavor":{"bp":1,"type":"Normal","category":"Physical","makesContact":true,"zp":160},"Stockpile":{"type":"Normal","category":"Status"},"Hail":{"type":"Ice","category":"Status"},"Torment":{"type":"Dark","category":"Status"},"Flatter":{"type":"Dark","category":"Status"},"Will-O-Wisp":{"type":"Fire","category":"Status"},"Memento":{"type":"Dark","category":"Status"},"Follow Me":{"type":"Normal","category":"Status"},"Taunt":{"type":"Dark","category":"Status"},"Helping Hand":{"type":"Normal","category":"Status"},"Trick":{"type":"Psychic","category":"Status"},"Role Play":{"type":"Psychic","category":"Status"},"Wish":{"type":"Normal","category":"Status"},"Assist":{"type":"Normal","category":"Status"},"Ingrain":{"type":"Grass","category":"Status"},"Magic Coat":{"type":"Psychic","category":"Status"},"Recycle":{"type":"Normal","category":"Status"},"Yawn":{"type":"Normal","category":"Status"},"Skill Swap":{"type":"Psychic","category":"Status"},"Imprison":{"type":"Psychic","category":"Status"},"Refresh":{"type":"Normal","category":"Status"},"Grudge":{"type":"Ghost","category":"Status"},"Snatch":{"type":"Dark","category":"Status"},"Tail Glow":{"type":"Bug","category":"Status"},"Feather Dance":{"type":"Flying","category":"Status"},"Teeter Dance":{"type":"Normal","category":"Status","isSpread":true},"Slack Off":{"type":"Normal","category":"Status"},"Aromatherapy":{"type":"Grass","category":"Status"},"Fake Tears":{"type":"Dark","category":"Status"},"Metal Sound":{"type":"Steel","category":"Status"},"Grass Whistle":{"type":"Grass","category":"Status"},"Tickle":{"type":"Normal","category":"Status"},"Cosmic Power":{"type":"Psychic","category":"Status"},"Iron Defense":{"type":"Steel","category":"Status"},"Howl":{"type":"Normal","category":"Status"},"Bulk Up":{"type":"Fighting","category":"Status"},"Calm Mind":{"type":"Psychic","category":"Status"},"Dragon Dance":{"type":"Dragon","category":"Status"},"Sand Tomb":{"bp":35,"type":"Ground","category":"Physical"},"Swallow":{"type":"Normal","category":"Status"},"Nature Power":{"bp":1,"type":"Normal","category":"Status"},"Charge":{"type":"Electric","category":"Status"},"Camouflage":{"type":"Normal","category":"Status"},"Mud Sport":{"type":"Ground","category":"Status"},"Odor Sleuth":{"type":"Normal","category":"Status"},"Block":{"type":"Normal","category":"Status"},"Water Sport":{"type":"Water","category":"Status"},"Uproar":{"bp":90,"type":"Normal","category":"Special","isSound":true},"Smelling Salts":{"bp":70,"type":"Normal","category":"Physical","makesContact":true},"Secret Power":{"bp":70,"type":"Normal","category":"Physical","hasSecondaryEffect":true},"Arm Thrust":{"bp":15,"type":"Fighting","category":"Physical","makesContact":true,"hitRange":[2,5]},"Mist Ball":{"bp":95,"type":"Psychic","category":"Special","hasSecondaryEffect":true,"isBullet":true},"Ice Ball":{"bp":30,"type":"Ice","category":"Physical","makesContact":true,"isBullet":true},"Needle Arm":{"bp":60,"type":"Grass","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"miniDoubleBP":false},"Hyper Voice":{"bp":90,"type":"Normal","category":"Special","isSound":true,"isSpread":true},"Crush Claw":{"bp":75,"type":"Normal","category":"Physical","makesContact":true,"isSlice":true},"Astonish":{"bp":30,"type":"Ghost","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"miniDoubleBP":false},"Silver Wind":{"bp":60,"type":"Bug","category":"Special","hasSecondaryEffect":true},"Sheer Cold":{"bp":1,"type":"Ice","category":"Special","isOHKO":true,"zp":180},"Bullet Seed":{"bp":25,"type":"Grass","category":"Physical","hitRange":[2,5],"isBullet":true,"zp":140},"Icicle Spear":{"bp":25,"type":"Ice","category":"Physical","hitRange":[2,5],"zp":140},"Poison Tail":{"bp":50,"type":"Poison","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Covet":{"bp":60,"type":"Normal","category":"Physical","makesContact":true},"Magical Leaf":{"bp":60,"type":"Grass","category":"Special"},"Air Slash":{"bp":75,"type":"Flying","category":"Special","hasSecondaryEffect":true,"isSlice":true},"Aqua Jet":{"bp":40,"type":"Water","category":"Physical","makesContact":true,"isPriority":true},"Aqua Tail":{"bp":90,"type":"Water","category":"Physical","makesContact":true},"Assurance":{"bp":60,"type":"Dark","category":"Physical","makesContact":true,"canDouble":true},"Aura Sphere":{"bp":80,"type":"Fighting","category":"Special","isBullet":true,"isPulse":true},"Avalanche":{"bp":60,"type":"Ice","category":"Physical","makesContact":true,"canDouble":true},"Brave Bird":{"bp":120,"type":"Flying","category":"Physical","makesContact":true,"recoilHP":[1,3]},"Brine":{"bp":65,"type":"Water","category":"Special"},"Bug Bite":{"bp":60,"type":"Bug","category":"Physical","makesContact":true},"Bug Buzz":{"bp":90,"type":"Bug","category":"Special","hasSecondaryEffect":true,"isSound":true},"Bullet Punch":{"bp":40,"type":"Steel","category":"Physical","makesContact":true,"isPunch":true,"isPriority":true},"Charge Beam":{"bp":50,"type":"Electric","category":"Special","hasSecondaryEffect":true},"Chatter":{"bp":65,"type":"Flying","category":"Special","hasSecondaryEffect":true,"isSound":true},"Close Combat":{"bp":120,"type":"Fighting","category":"Physical","makesContact":true},"Cross Poison":{"bp":70,"type":"Poison","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"isSlice":true},"Dark Pulse":{"bp":80,"type":"Dark","category":"Special","hasSecondaryEffect":true,"isPulse":true},"Discharge":{"bp":80,"type":"Electric","category":"Special","hasSecondaryEffect":true,"isSpread":true},"Double Hit":{"bp":35,"type":"Normal","category":"Physical","makesContact":true,"hitRange":2},"Draco Meteor":{"bp":130,"type":"Dragon","category":"Special","statChange":["special attack",-2,"user"]},"Dragon Pulse":{"bp":85,"type":"Dragon","category":"Special","isPulse":true},"Dragon Rush":{"bp":100,"type":"Dragon","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"miniDoubleBP":true},"Drain Punch":{"bp":75,"type":"Fighting","category":"Physical","makesContact":true,"isPunch":true,"isHealing":true,"drainHP":[1,2]},"Earth Power":{"bp":90,"type":"Ground","category":"Special","hasSecondaryEffect":true},"Energy Ball":{"bp":90,"type":"Grass","category":"Special","hasSecondaryEffect":true,"isBullet":true},"Fire Fang":{"bp":65,"type":"Fire","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"isBite":true},"Flare Blitz":{"bp":120,"type":"Fire","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"recoilHP":[1,3]},"Flash Cannon":{"bp":80,"type":"Steel","category":"Special","hasSecondaryEffect":true},"Fling":{"bp":1,"type":"Dark","category":"Physical"},"Focus Blast":{"bp":120,"type":"Fighting","category":"Special","hasSecondaryEffect":true,"isBullet":true},"Force Palm":{"bp":60,"type":"Fighting","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Giga Impact":{"bp":150,"type":"Normal","category":"Physical","makesContact":true},"Grass Knot":{"bp":1,"type":"Grass","category":"Special","makesContact":true,"zp":160},"Gunk Shot":{"bp":120,"type":"Poison","category":"Physical","hasSecondaryEffect":true},"Gyro Ball":{"bp":1,"type":"Steel","category":"Physical","makesContact":true,"isBullet":true,"zp":160},"Hammer Arm":{"bp":100,"type":"Fighting","category":"Physical","makesContact":true,"isPunch":true},"Head Smash":{"bp":150,"type":"Rock","category":"Physical","makesContact":true,"recoilHP":[1,2]},"Ice Fang":{"bp":65,"type":"Ice","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"isBite":true},"Ice Shard":{"bp":40,"type":"Ice","category":"Physical","isPriority":true},"Iron Head":{"bp":80,"type":"Steel","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Judgment":{"bp":100,"type":"Normal","category":"Special"},"Last Resort":{"bp":140,"type":"Normal","category":"Physical","makesContact":true},"Lava Plume":{"bp":80,"type":"Fire","category":"Special","hasSecondaryEffect":true,"isSpread":true},"Leaf Storm":{"bp":130,"type":"Grass","category":"Special","statChange":["special attack",-2,"user"]},"Magma Storm":{"bp":100,"type":"Fire","category":"Special"},"Mud Bomb":{"bp":65,"type":"Ground","category":"Special","hasSecondaryEffect":true,"isBullet":true},"Natural Gift":{"bp":1,"type":"Normal","category":"Physical","zp":160},"Night Slash":{"bp":70,"type":"Dark","category":"Physical","makesContact":true,"isSlice":true},"Payback":{"bp":50,"type":"Dark","category":"Physical","makesContact":true,"canDouble":true},"Pluck":{"bp":60,"type":"Flying","category":"Physical","makesContact":true},"Poison Jab":{"bp":80,"type":"Poison","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Power Gem":{"bp":80,"type":"Rock","category":"Special"},"Power Whip":{"bp":120,"type":"Grass","category":"Physical","makesContact":true},"Psycho Cut":{"bp":70,"type":"Psychic","category":"Physical","isSlice":true},"Punishment":{"bp":60,"type":"Dark","category":"Physical","makesContact":true,"zp":160},"Rock Climb":{"bp":90,"type":"Normal","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Seed Bomb":{"bp":80,"type":"Grass","category":"Physical","isBullet":true},"Seed Flare":{"bp":120,"type":"Grass","category":"Special","hasSecondaryEffect":true},"Shadow Claw":{"bp":70,"type":"Ghost","category":"Physical","makesContact":true,"isSlice":true},"Shadow Force":{"bp":120,"type":"Ghost","category":"Physical","makesContact":true,"miniDoubleBP":false},"Shadow Sneak":{"bp":40,"type":"Ghost","category":"Physical","makesContact":true,"isPriority":true},"Spacial Rend":{"bp":100,"type":"Dragon","category":"Special"},"Stone Edge":{"bp":100,"type":"Rock","category":"Physical"},"Sucker Punch":{"bp":70,"type":"Dark","category":"Physical","makesContact":true,"isPriority":true},"Thunder Fang":{"bp":65,"type":"Electric","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"isBite":true},"U-turn":{"bp":70,"type":"Bug","category":"Physical","makesContact":true},"Vacuum Wave":{"bp":40,"type":"Fighting","category":"Special","isPriority":true},"Wake-Up Slap":{"bp":70,"type":"Fighting","category":"Physical","makesContact":true},"Wood Hammer":{"bp":120,"type":"Grass","category":"Physical","makesContact":true,"recoilHP":[1,3]},"X-Scissor":{"bp":80,"type":"Bug","category":"Physical","makesContact":true,"isSlice":true},"Zen Headbutt":{"bp":80,"type":"Psychic","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Rock Wrecker":{"bp":150,"type":"Rock","category":"Physical","isBullet":true},"Roar of Time":{"bp":150,"type":"Dragon","category":"Special"},"Roost":{"type":"Flying","category":"Status"},"Gravity":{"type":"Psychic","category":"Status"},"Healing Wish":{"type":"Psychic","category":"Status"},"Tailwind":{"type":"Flying","category":"Status"},"Acupressure":{"type":"Normal","category":"Status"},"Embargo":{"type":"Dark","category":"Status"},"Psycho Shift":{"type":"Psychic","category":"Status"},"Heal Block":{"type":"Psychic","category":"Status","isSpread":true},"Power Trick":{"type":"Psychic","category":"Status"},"Gastro Acid":{"type":"Poison","category":"Status"},"Me First":{"type":"Normal","category":"Status","usesOppMoves":true},"Copycat":{"type":"Normal","category":"Status"},"Power Swap":{"type":"Psychic","category":"Status"},"Worry Seed":{"type":"Grass","category":"Status"},"Toxic Spikes":{"type":"Poison","category":"Status","isSpread":true},"Heart Swap":{"type":"Psychic","category":"Status"},"Magnet Rise":{"type":"Electric","category":"Status"},"Rock Polish":{"type":"Rock","category":"Status"},"Switcheroo":{"type":"Dark","category":"Status"},"Nasty Plot":{"type":"Dark","category":"Status"},"Defog":{"type":"Flying","category":"Status"},"Trick Room":{"type":"Psychic","category":"Status"},"Captivate":{"type":"Normal","category":"Status","isSpread":true},"Stealth Rock":{"type":"Rock","category":"Status","isSpread":true},"Lunar Dance":{"type":"Psychic","category":"Status"},"Dark Void":{"type":"Dark","category":"Status","isSpread":true},"Miracle Eye":{"type":"Psychic","category":"Status"},"Lucky Chant":{"type":"Normal","category":"Status"},"Guard Swap":{"type":"Psychic","category":"Status"},"Aqua Ring":{"type":"Water","category":"Status"},"Defend Order":{"type":"Bug","category":"Status"},"Heal Order":{"type":"Bug","category":"Status"},"Feint":{"bp":30,"type":"Normal","category":"Physical","isPriority":true},"Metal Burst":{"bp":1,"type":"Steel","category":"Physical","usesOppMoves":true},"Trump Card":{"bp":40,"type":"Normal","category":"Special","makesContact":true,"zp":160},"Wring Out":{"bp":1,"type":"Normal","category":"Special","makesContact":true,"zp":190},"Mirror Shot":{"bp":65,"type":"Steel","category":"Special","hasSecondaryEffect":true},"Magnet Bomb":{"bp":60,"type":"Steel","category":"Physical","isBullet":true},"Attack Order":{"bp":90,"type":"Bug","category":"Physical"},"Crush Grip":{"bp":1,"type":"Normal","category":"Physical","makesContact":true,"zp":190},"Ominous Wind":{"bp":60,"type":"Ghost","category":"Special","hasSecondaryEffect":true},"Electroweb":{"bp":55,"type":"Electric","category":"Special","isSpread":true,"hasSecondaryEffect":true},"Acid Spray":{"bp":40,"type":"Poison","category":"Special","hasSecondaryEffect":true,"isBullet":true,"statChange":["special defense",-2,"target"]},"Acrobatics":{"bp":55,"type":"Flying","category":"Physical","makesContact":true},"Blue Flare":{"bp":130,"type":"Fire","category":"Special","hasSecondaryEffect":true},"Bolt Strike":{"bp":130,"type":"Electric","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Bulldoze":{"bp":60,"type":"Ground","category":"Physical","hasSecondaryEffect":true,"isSpread":true},"Circle Throw":{"bp":60,"type":"Fighting","category":"Physical","makesContact":true},"Clear Smog":{"bp":50,"type":"Poison","category":"Special"},"Dragon Tail":{"bp":60,"type":"Dragon","category":"Physical","makesContact":true},"Drill Run":{"bp":80,"type":"Ground","category":"Physical","makesContact":true},"Dual Chop":{"bp":40,"type":"Dragon","category":"Physical","makesContact":true,"hitRange":2},"Electro Ball":{"bp":1,"type":"Electric","category":"Special","isBullet":true,"zp":160},"Fiery Dance":{"bp":80,"type":"Fire","category":"Special","hasSecondaryEffect":true},"Flame Charge":{"bp":50,"type":"Fire","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Foul Play":{"bp":95,"type":"Dark","category":"Physical","makesContact":true},"Freeze Shock":{"bp":140,"type":"Ice","category":"Physical","hasSecondaryEffect":true},"Frost Breath":{"bp":60,"type":"Ice","category":"Special","alwaysCrit":true},"Fusion Bolt":{"bp":100,"type":"Electric","category":"Physical","canDouble":true},"Fusion Flare":{"bp":100,"type":"Fire","category":"Special","canDouble":true},"Gear Grind":{"bp":60,"type":"Steel","category":"Physical","hitRange":2,"makesContact":true,"zp":180},"Glaciate":{"bp":65,"type":"Ice","category":"Special","hasSecondaryEffect":true,"isSpread":true},"Head Charge":{"bp":120,"type":"Normal","category":"Physical","makesContact":true,"recoilHP":[1,4]},"Heavy Slam":{"bp":1,"type":"Steel","category":"Physical","makesContact":true,"zp":160,"miniDoubleBP":true},"Hex":{"bp":65,"type":"Ghost","category":"Special","zp":160},"Horn Leech":{"bp":75,"type":"Grass","category":"Physical","makesContact":true,"isHealing":true,"drainHP":[1,2]},"Hurricane":{"bp":110,"type":"Flying","category":"Special","hasSecondaryEffect":true,"isWind":true},"Ice Burn":{"bp":140,"type":"Ice","category":"Special","hasSecondaryEffect":true},"Icicle Crash":{"bp":85,"type":"Ice","category":"Physical","hasSecondaryEffect":true},"Incinerate":{"bp":60,"type":"Fire","category":"Special","isSpread":true},"Inferno":{"bp":100,"type":"Fire","category":"Special","hasSecondaryEffect":true},"Low Sweep":{"bp":65,"type":"Fighting","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Night Daze":{"bp":90,"type":"Dark","category":"Special","hasSecondaryEffect":true},"Psyshock":{"bp":80,"type":"Psychic","category":"Special","dealsPhysicalDamage":true},"Psystrike":{"bp":100,"type":"Psychic","category":"Special","dealsPhysicalDamage":true},"Razor Shell":{"bp":75,"type":"Water","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"isSlice":true},"Relic Song":{"bp":75,"type":"Normal","category":"Special","hasSecondaryEffect":true,"isSound":true,"isSpread":true},"Retaliate":{"bp":70,"type":"Normal","category":"Physical","makesContact":true,"canDouble":true},"Sacred Sword":{"bp":90,"type":"Fighting","category":"Physical","makesContact":true,"ignoresDefenseBoosts":true,"isSlice":true},"Scald":{"bp":80,"type":"Water","category":"Special","hasSecondaryEffect":true},"Searing Shot":{"bp":100,"type":"Fire","category":"Special","hasSecondaryEffect":true,"isSpread":true,"isBullet":true},"Secret Sword":{"bp":85,"type":"Fighting","category":"Special","dealsPhysicalDamage":true},"Sky Drop":{"bp":60,"type":"Flying","category":"Physical","makesContact":true},"Sludge Wave":{"bp":95,"type":"Poison","category":"Special","hasSecondaryEffect":true,"isSpread":true},"Smack Down":{"bp":50,"type":"Rock","category":"Physical"},"Snarl":{"bp":55,"type":"Dark","category":"Special","hasSecondaryEffect":true,"isSound":true,"isSpread":true},"Stored Power":{"bp":20,"type":"Psychic","category":"Special","zp":160},"Storm Throw":{"bp":60,"type":"Fighting","category":"Physical","makesContact":true,"alwaysCrit":true},"Struggle Bug":{"bp":50,"type":"Bug","category":"Special","isSpread":true,"hasSecondaryEffect":true},"Synchronoise":{"bp":120,"type":"Psychic","category":"Special","isSpread":true},"Tail Slap":{"bp":25,"type":"Normal","category":"Physical","makesContact":true,"hitRange":[2,5],"zp":140},"V-create":{"bp":180,"type":"Fire","category":"Physical","makesContact":true,"zp":220},"Volt Switch":{"bp":70,"type":"Electric","category":"Special"},"Wild Charge":{"bp":90,"type":"Electric","category":"Physical","makesContact":true,"recoilHP":[1,4]},"Fire Pledge":{"bp":80,"type":"Fire","category":"Special","isPledge":true},"Grass Pledge":{"bp":80,"type":"Grass","category":"Special","isPledge":true},"Water Pledge":{"bp":80,"type":"Water","category":"Special","isPledge":true},"Heat Crash":{"bp":1,"type":"Fire","category":"Physical","makesContact":true,"zp":160,"miniDoubleBP":true},"Final Gambit":{"bp":1,"type":"Fighting","category":"Special","zp":180},"Techno Blast":{"bp":120,"type":"Normal","category":"Special"},"Hone Claws":{"type":"Dark","category":"Status"},"Wide Guard":{"type":"Rock","category":"Status"},"Guard Split":{"type":"Psychic","category":"Status"},"Power Split":{"type":"Psychic","category":"Status"},"Autotomize":{"type":"Steel","category":"Status"},"Rage Powder":{"type":"Bug","category":"Status"},"Magic Room":{"type":"Psychic","category":"Status"},"Quiver Dance":{"type":"Bug","category":"Status"},"Soak":{"type":"Water","category":"Status"},"Coil":{"type":"Poison","category":"Status"},"Simple Beam":{"type":"Normal","category":"Status"},"Entrainment":{"type":"Normal","category":"Status"},"After You":{"type":"Normal","category":"Status"},"Quick Guard":{"type":"Fighting","category":"Status"},"Ally Switch":{"type":"Psychic","category":"Status"},"Shell Smash":{"type":"Normal","category":"Status"},"Heal Pulse":{"type":"Psychic","category":"Status","isPulse":true,"isHealing":true},"Shift Gear":{"type":"Steel","category":"Status"},"Quash":{"type":"Dark","category":"Status"},"Reflect Type":{"type":"Normal","category":"Status"},"Work Up":{"type":"Normal","category":"Status"},"Cotton Guard":{"type":"Grass","category":"Status"},"Venoshock":{"bp":65,"type":"Poison","category":"Special"},"Wonder Room":{"type":"Psychic","category":"Status"},"Telekinesis":{"type":"Psychic","category":"Status"},"Bestow":{"type":"Normal","category":"Status"},"Flame Burst":{"bp":70,"type":"Fire","category":"Special"},"Round":{"bp":60,"type":"Normal","category":"Special","isSound":true,"canDouble":true},"Echoed Voice":{"bp":40,"type":"Normal","category":"Special","isSound":true},"Chip Away":{"bp":70,"type":"Normal","category":"Physical","makesContact":true,"ignoresDefenseBoosts":true},"Heart Stamp":{"bp":60,"type":"Psychic","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Leaf Tornado":{"bp":65,"type":"Grass","category":"Special","hasSecondaryEffect":true},"Steamroller":{"bp":65,"type":"Bug","category":"Physical","makesContact":true,"miniDoubleBP":true,"hasSecondaryEffect":true},"Boomburst":{"bp":140,"type":"Normal","category":"Special","isSound":true,"isSpread":true},"Dazzling Gleam":{"bp":80,"type":"Fairy","category":"Special","isSpread":true},"Diamond Storm":{"bp":100,"type":"Rock","category":"Physical","hasSecondaryEffect":true,"isSpread":true},"Draining Kiss":{"bp":50,"type":"Fairy","category":"Special","makesContact":true,"isHealing":true,"drainHP":[3,4]},"Flying Press":{"bp":100,"type":"Fighting","category":"Physical","makesContact":true,"miniDoubleBP":true,"zp":170},"Freeze-Dry":{"bp":70,"type":"Ice","category":"Special","hasSecondaryEffect":true},"Land's Wrath":{"bp":90,"type":"Ground","category":"Physical","isSpread":true,"zp":185},"Moonblast":{"bp":95,"type":"Fairy","category":"Special","hasSecondaryEffect":true},"Oblivion Wing":{"bp":80,"type":"Flying","category":"Special","isHealing":true,"drainHP":[3,4]},"Phantom Force":{"bp":90,"type":"Ghost","category":"Physical","makesContact":true,"miniDoubleBP":false},"Play Rough":{"bp":90,"type":"Fairy","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Power-Up Punch":{"bp":40,"type":"Fighting","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"isPunch":true,"statChange":["attack",1,"user"]},"Water Shuriken":{"bp":15,"type":"Water","category":"Special","hitRange":[2,5],"isPriority":true},"Disarming Voice":{"bp":40,"type":"Fairy","category":"Special","isSound":true,"isSpread":true},"Mystical Fire":{"bp":75,"type":"Fire","category":"Special","hasSecondaryEffect":true},"Parabolic Charge":{"bp":65,"type":"Electric","category":"Special","isSpread":true,"isHealing":true,"drainHP":[1,2]},"Petal Blizzard":{"bp":90,"type":"Grass","category":"Physical","isSpread":true,"isWind":true},"Mat Block":{"type":"Fighting","category":"Status"},"Sticky Web":{"type":"Bug","category":"Status","isSpread":true},"Trick-or-Treat":{"type":"Ghost","category":"Status"},"Forest's Curse":{"type":"Grass","category":"Status"},"Parting Shot":{"type":"Dark","category":"Status"},"Topsy-Turvy":{"type":"Dark","category":"Status"},"Crafty Shield":{"type":"Fairy","category":"Status"},"Grassy Terrain":{"type":"Grass","category":"Status"},"Misty Terrain":{"type":"Fairy","category":"Status"},"Electrify":{"type":"Electric","category":"Status"},"King's Shield":{"type":"Steel","category":"Status"},"Spiky Shield":{"type":"Grass","category":"Status"},"Eerie Impulse":{"type":"Electric","category":"Status"},"Powder":{"type":"Bug","category":"Status","isPriority":true},"Geomancy":{"type":"Fairy","category":"Status"},"Electric Terrain":{"type":"Electric","category":"Status"},"Baby-Doll Eyes":{"type":"Fairy","category":"Status","isPriority":true},"Steam Eruption":{"bp":110,"type":"Water","category":"Special","hasSecondaryEffect":true},"Rototiller":{"type":"Ground","category":"Status"},"Noble Roar":{"type":"Normal","category":"Status"},"Ion Deluge":{"type":"Electric","category":"Status"},"Flower Shield":{"type":"Fairy","category":"Status"},"Fairy Lock":{"type":"Fairy","category":"Status"},"Aromatic Mist":{"type":"Fairy","category":"Status"},"Venom Drench":{"type":"Poison","category":"Status"},"Magnetic Flux":{"type":"Electric","category":"Status"},"Happy Hour":{"type":"Normal","category":"Status"},"Celebrate":{"type":"Normal","category":"Status"},"Hold Hands":{"type":"Normal","category":"Status"},"Belch":{"bp":120,"type":"Poison","category":"Special"},"Fell Stinger":{"bp":50,"type":"Bug","category":"Physical","makesContact":true},"Fairy Wind":{"bp":40,"type":"Fairy","category":"Special","isWind":true},"Hold Back":{"bp":40,"type":"Normal","category":"Physical","makesContact":true},"Infestation":{"bp":20,"type":"Bug","category":"Special","makesContact":true},"Nuzzle":{"category":"Physical","type":"Electric","bp":20,"makesContact":true,"hasSecondaryEffect":true},"Hyperspace Hole":{"category":"Special","type":"Psychic","bp":80},"Origin Pulse":{"bp":110,"type":"Water","category":"Special","isSpread":true,"isPulse":true},"Precipice Blades":{"bp":120,"type":"Ground","category":"Physical","isSpread":true},"Dragon Ascent":{"bp":120,"type":"Flying","category":"Physical","makesContact":true},"Hyperspace Fury":{"category":"Physical","type":"Dark","bp":100},"Light of Ruin":{"bp":140,"type":"Fairy","category":"Special","recoilHP":[1,2]},"Zing Zap":{"category":"Physical","type":"Electric","makesContact":true,"bp":80,"hasSecondaryEffect":true},"Moongeist Beam":{"category":"Special","type":"Ghost","bp":100},"Sunsteel Strike":{"category":"Physical","type":"Steel","makesContact":true,"bp":100},"Spectral Thief":{"category":"Physical","type":"Ghost","makesContact":true,"bp":90},"Prismatic Laser":{"category":"Special","type":"Psychic","bp":160},"Liquidation":{"category":"Physical","type":"Water","makesContact":true,"hasSecondaryEffect":true,"bp":85},"Accelerock":{"category":"Physical","type":"Rock","makesContact":true,"bp":40,"isPriority":true},"Shadow Bone":{"category":"Physical","type":"Ghost","bp":85,"hasSecondaryEffect":true},"Stomping Tantrum":{"category":"Physical","type":"Ground","makesContact":true,"bp":75,"canDouble":true},"Psychic Fangs":{"category":"Physical","type":"Psychic","makesContact":true,"bp":85,"isBite":true,"ignoresScreens":true},"Fleur Cannon":{"category":"Special","type":"Fairy","bp":130,"statChange":["special attack",-2,"user"]},"Shell Trap":{"category":"Special","type":"Fire","isSpread":true,"bp":150},"Genesis Supernova":{"category":"Special","type":"Psychic","bp":185,"isSignatureZ":true,"hasSecondaryEffect":true},"Pulverizing Pancake":{"category":"Physical","type":"Normal","makesContact":true,"bp":210,"isSignatureZ":true},"Stoked Sparksurfer":{"category":"Special","type":"Electric","bp":175,"isSignatureZ":true,"hasSecondaryEffect":true},"Soul-Stealing 7-Star Strike":{"category":"Physical","type":"Ghost","makesContact":true,"bp":195,"isSignatureZ":true},"Oceanic Operetta":{"category":"Special","type":"Water","bp":195,"isSignatureZ":true},"Malicious Moonsault":{"category":"Physical","type":"Dark","bp":180,"isSignatureZ":true,"makesContact":true,"miniDoubleBP":true},"Sinister Arrow Raid":{"category":"Physical","type":"Ghost","bp":180,"isSignatureZ":true},"Guardian of Alola":{"category":"Special","type":"Fairy","bp":1,"isSignatureZ":true},"Brutal Swing":{"category":"Physical","type":"Dark","makesContact":true,"bp":60,"isSpread":true},"Dragon Hammer":{"category":"Physical","type":"Dragon","makesContact":true,"bp":100},"Clanging Scales":{"category":"Special","type":"Dragon","bp":110,"isSound":true,"isSpread":true},"Beak Blast":{"category":"Physical","type":"Flying","bp":120,"isBullet":true},"Trop Kick":{"category":"Physical","type":"Grass","makesContact":true,"bp":85,"hasSecondaryEffect":true},"Core Enforcer":{"category":"Special","type":"Dragon","bp":100,"isSpread":true,"zp":140},"Revelation Dance":{"category":"Special","type":"Normal","bp":100},"Smart Strike":{"category":"Physical","type":"Steel","makesContact":true,"bp":70},"Multi-Attack":{"category":"Physical","type":"Normal","makesContact":true,"bp":120,"zp":185},"Burn Up":{"category":"Special","type":"Fire","bp":130},"Power Trip":{"category":"Physical","type":"Dark","makesContact":true,"bp":20,"zp":160},"Fire Lash":{"category":"Physical","type":"Fire","makesContact":true,"bp":90,"hasSecondaryEffect":true,"statChange":["defense",-1,"target"]},"Lunge":{"category":"Physical","type":"Bug","makesContact":true,"bp":80,"hasSecondaryEffect":true},"Anchor Shot":{"category":"Physical","type":"Steel","makesContact":true,"hasSecondaryEffect":true,"bp":90},"Pollen Puff":{"category":"Special","type":"Bug","bp":90,"isBullet":true},"Throat Chop":{"category":"Physical","type":"Dark","makesContact":true,"hasSecondaryEffect":true,"bp":80},"Solar Blade":{"category":"Physical","type":"Grass","makesContact":true,"bp":125,"isSlice":true},"High Horsepower":{"category":"Physical","type":"Ground","makesContact":true,"bp":95},"Ice Hammer":{"category":"Physical","type":"Ice","makesContact":true,"bp":100,"isPunch":true},"First Impression":{"category":"Physical","type":"Bug","makesContact":true,"bp":100,"isPriority":true},"Sparkling Aria":{"category":"Special","type":"Water","bp":90,"isSpread":true,"hasSecondaryEffect":true,"isSound":true},"Darkest Lariat":{"category":"Physical","type":"Dark","makesContact":true,"bp":85,"ignoresDefenseBoosts":true},"Spirit Shackle":{"category":"Physical","type":"Ghost","bp":90,"hasSecondaryEffect":true},"Nature's Madness":{"bp":1,"category":"Special","type":"Fairy"},"Shore Up":{"type":"Ground","category":"Status"},"Baneful Bunker":{"type":"Poison","category":"Status"},"Floral Healing":{"type":"Fairy","category":"Status","isHealing":true},"Strength Sap":{"type":"Grass","category":"Status","isHealing":true},"Spotlight":{"type":"Normal","category":"Status","isPriority":true},"Psychic Terrain":{"type":"Psychic","category":"Status"},"Speed Swap":{"type":"Psychic","category":"Status"},"Instruct":{"type":"Psychic","category":"Status"},"Aurora Veil":{"type":"Ice","category":"Status"},"Extreme Evoboost":{"type":"Normal","category":"Status","isSignatureZ":true},"Catastropika":{"category":"Physical","type":"Electric","makesContact":true,"bp":210,"isSignatureZ":true},"10,000,000 Volt Thunderbolt":{"category":"Special","type":"Electric","bp":195,"isSignatureZ":true},"Breakneck Blitz":{"type":"Normal"},"Inferno Overdrive":{"type":"Fire"},"Subzero Slammer":{"type":"Ice"},"Hydro Vortex":{"type":"Water"},"Gigavolt Havoc":{"type":"Electric"},"All-Out Pummeling":{"type":"Fighting"},"Bloom Doom":{"type":"Grass"},"Shattered Psyche":{"type":"Psychic"},"Savage Spin-Out":{"type":"Bug"},"Acid Downpour":{"type":"Poison"},"Supersonic Skystrike":{"type":"Flying"},"Devastating Drake":{"type":"Dragon"},"Continental Crush":{"type":"Rock"},"Tectonic Rage":{"type":"Ground"},"Corkscrew Crash":{"type":"Steel"},"Twinkle Tackle":{"type":"Fairy"},"Never-Ending Nightmare":{"type":"Ghost"},"Black Hole Eclipse":{"type":"Dark"},"Thousand Arrows":{"category":"Physical","type":"Ground","bp":90,"isSpread":true,"zp":180},"Thousand Waves":{"category":"Physical","type":"Ground","bp":90,"isSpread":true},"Toxic Thread":{"type":"Poison","category":"Status"},"Laser Focus":{"type":"Normal","category":"Status"},"Gear Up":{"type":"Steel","category":"Status"},"Purify":{"type":"Poison","category":"Status","isHealing":true},"Tearful Look":{"type":"Normal","category":"Status"},"Leafage":{"bp":40,"type":"Grass","category":"Physical"},"Mind Blown":{"bp":150,"type":"Fire","category":"Special","isSpread":true,"costHP":[1,2,"roundUp"]},"Plasma Fists":{"bp":100,"type":"Electric","category":"Physical","isPunch":true,"makesContact":true},"Photon Geyser":{"bp":100,"type":"Psychic","category":"Special"},"Light That Burns the Sky":{"bp":200,"type":"Psychic","category":"Special","isSignatureZ":true},"Searing Sunraze Smash":{"bp":200,"type":"Steel","category":"Physical","isSignatureZ":true,"makesContact":true},"Menacing Moonraze Maelstrom":{"bp":200,"type":"Ghost","category":"Special","isSignatureZ":true},"Let's Snuggle Forever":{"bp":190,"type":"Fairy","category":"Physical","isSignatureZ":true,"makesContact":true},"Splintered Stormshards":{"bp":190,"type":"Rock","category":"Physical","isSignatureZ":true},"Clangorous Soulblaze":{"bp":185,"type":"Dragon","category":"Special","isSound":true,"isSpread":true,"isSignatureZ":true,"hasSecondaryEffect":true},"Double Iron Bash":{"bp":60,"type":"Steel","category":"Physical","makesContact":true,"hitRange":2,"isPunch":true,"hasSecondaryEffect":true},"Dynamax Cannon":{"bp":100,"type":"Dragon","category":"Special"},"Snipe Shot":{"bp":85,"type":"Water","category":"Special"},"Jaw Lock":{"bp":80,"type":"Dark","category":"Physical","makesContact":true,"isBite":true},"Dragon Darts":{"bp":50,"type":"Dragon","category":"Physical","hitRange":[1,2]},"Bolt Beak":{"bp":80,"type":"Electric","category":"Physical","makesContact":true,"canDouble":true},"Fishious Rend":{"bp":80,"type":"Water","category":"Physical","isBite":true,"makesContact":true,"canDouble":true},"Body Press":{"bp":80,"type":"Fighting","category":"Physical","makesContact":true},"Drum Beating":{"bp":80,"type":"Grass","category":"Physical","hasSecondaryEffect":true},"Snap Trap":{"bp":35,"type":"Steel","category":"Physical","makesContact":true},"Pyro Ball":{"bp":120,"type":"Fire","category":"Physical","hasSecondaryEffect":true,"isBullet":true},"Behemoth Blade":{"bp":100,"type":"Steel","category":"Physical","makesContact":true,"isSlice":true},"Behemoth Bash":{"bp":100,"type":"Steel","category":"Physical","makesContact":true},"Aura Wheel":{"bp":110,"type":"Electric","category":"Physical","hasSecondaryEffect":true},"Breaking Swipe":{"bp":60,"type":"Dragon","category":"Physical","isSpread":true,"makesContact":true,"hasSecondaryEffect":true},"Branch Poke":{"bp":40,"type":"Grass","category":"Physical","makesContact":true},"Overdrive":{"bp":80,"type":"Electric","category":"Special","isSound":true,"isSpread":true},"Apple Acid":{"bp":90,"type":"Grass","category":"Special","hasSecondaryEffect":true,"statChange":["special defense",-2,"target"]},"Grav Apple":{"bp":90,"type":"Grass","category":"Physical","hasSecondaryEffect":true,"statChange":["defense",-1,"target"]},"Spirit Break":{"bp":75,"type":"Fairy","category":"Physical","hasSecondaryEffect":true,"makesContact":true},"Strange Steam":{"bp":90,"type":"Fairy","category":"Special","hasSecondaryEffect":true},"False Surrender":{"bp":80,"type":"Dark","category":"Physical","makesContact":true},"Meteor Assault":{"bp":150,"type":"Fighting","category":"Physical"},"Eternabeam":{"bp":160,"type":"Dragon","category":"Special"},"Steel Beam":{"bp":140,"type":"Steel","category":"Special","costHP":[1,2,"roundUp"]},"No Retreat":{"type":"Fighting","category":"Status"},"Octolock":{"type":"Fighting","category":"Status"},"Clangorous Soul":{"type":"Dragon","category":"Status","costHP":[1,3,"roundDown"]},"Decorate":{"type":"Fairy","category":"Status"},"Life Dew":{"type":"Water","category":"Status"},"Stuff Cheeks":{"type":"Normal","category":"Status"},"Tar Shot":{"type":"Rock","category":"Status"},"Magic Powder":{"type":"Psychic","category":"Status"},"Teatime":{"type":"Normal","category":"Status"},"Court Change":{"type":"Normal","category":"Status"},"Max Strike":{"type":"Normal"},"Max Flare":{"type":"Fire"},"Max Hailstorm":{"type":"Ice"},"Max Geyser":{"type":"Water"},"Max Lightning":{"type":"Electric"},"Max Knuckle":{"type":"Fighting"},"Max Overgrowth":{"type":"Grass"},"Max Mindstorm":{"type":"Psychic"},"Max Flutterby":{"type":"Bug"},"Max Ooze":{"type":"Poison"},"Max Airstream":{"type":"Flying"},"Max Wyrmwind":{"type":"Dragon"},"Max Rockfall":{"type":"Rock"},"Max Quake":{"type":"Ground"},"Max Steelspike":{"type":"Steel"},"Max Starfall":{"type":"Fairy"},"Max Phantasm":{"type":"Ghost"},"Max Darkness":{"type":"Dark"},"G-Max Wildfire":{"type":"Fire"},"G-Max Befuddle":{"type":"Bug"},"G-Max Volt Crash":{"type":"Electric"},"G-Max Gold Rush":{"type":"Normal"},"G-Max Chi Strike":{"type":"Fighting"},"G-Max Terror":{"type":"Ghost"},"G-Max Foam Burst":{"type":"Water"},"G-Max Resonance":{"type":"Ice"},"G-Max Cuddle":{"type":"Normal"},"G-Max Replenish":{"type":"Normal"},"G-Max Malodor":{"type":"Poison"},"G-Max Meltdown":{"type":"Steel"},"G-Max Wind Rage":{"type":"Flying"},"G-Max Gravitas":{"type":"Psychic"},"G-Max Stonesurge":{"type":"Water"},"G-Max Volcalith":{"type":"Rock"},"G-Max Tartness":{"type":"Grass"},"G-Max Sweetness":{"type":"Grass"},"G-Max Sandblast":{"type":"Ground"},"G-Max Stun Shock":{"type":"Electric"},"G-Max Centinferno":{"type":"Fire"},"G-Max Smite":{"type":"Fairy"},"G-Max Snooze":{"type":"Dark"},"G-Max Finale":{"type":"Fairy"},"G-Max Steelsurge":{"type":"Steel"},"G-Max Depletion":{"type":"Dragon"},"G-Max Vine Lash":{"type":"Grass"},"G-Max Cannonade":{"type":"Water"},"G-Max Drum Solo":{"type":"Grass","bp":160},"G-Max Fireball":{"type":"Fire","bp":160},"G-Max Hydrosnipe":{"type":"Water","bp":160},"G-Max One Blow":{"type":"Dark"},"G-Max Rapid Flow":{"type":"Water"},"Burning Jealousy":{"bp":70,"type":"Fire","category":"Special","isSpread":true,"hasSecondaryEffect":true},"Dual Wingbeat":{"bp":40,"type":"Flying","category":"Physical","makesContact":true,"hitRange":2},"Expanding Force":{"bp":80,"type":"Psychic","category":"Special"},"Flip Turn":{"bp":60,"type":"Water","category":"Physical","makesContact":true},"Grassy Glide":{"bp":55,"type":"Grass","category":"Physical","makesContact":true},"Lash Out":{"bp":75,"type":"Dark","category":"Physical","makesContact":true,"canDouble":true},"Meteor Beam":{"bp":120,"type":"Rock","category":"Special"},"Misty Explosion":{"bp":100,"type":"Fairy","category":"Special","isSpread":true},"Poltergeist":{"bp":110,"type":"Ghost","category":"Physical"},"Rising Voltage":{"bp":70,"type":"Electric","category":"Special"},"Scale Shot":{"bp":25,"type":"Dragon","category":"Physical","hitRange":[2,5]},"Scorching Sands":{"bp":70,"type":"Ground","category":"Special","hasSecondaryEffect":true},"Shell Side Arm":{"bp":90,"type":"Poison","category":"Special","hasSecondaryEffect":true},"Skitter Smack":{"bp":70,"type":"Bug","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Steel Roller":{"bp":130,"type":"Steel","category":"Physical","makesContact":true},"Surging Strikes":{"bp":25,"type":"Water","category":"Physical","makesContact":true,"alwaysCrit":true,"hitRange":3,"isPunch":true},"Terrain Pulse":{"bp":50,"type":"Normal","category":"Special","isPulse":true},"Triple Axel":{"bp":20,"type":"Ice","category":"Physical","makesContact":true,"isTripleHit":true,"hitRange":[1,3]},"Wicked Blow":{"bp":75,"type":"Dark","category":"Physical","makesContact":true,"alwaysCrit":true,"isPunch":true},"Coaching":{"type":"Fighting","category":"Status"},"Jungle Healing":{"type":"Grass","category":"Status"},"Corrosive Gas":{"type":"Poison","category":"Status","isSpread":true},"Astral Barrage":{"bp":110,"type":"Ghost","category":"Special","isSpread":true},"Dragon Energy":{"bp":150,"type":"Dragon","category":"Special","isSpread":true},"Eerie Spell":{"bp":80,"type":"Psychic","category":"Special","hasSecondaryEffect":true},"Fiery Wrath":{"bp":90,"type":"Dark","category":"Special","isSpread":true,"hasSecondaryEffect":true},"Freezing Glare":{"bp":90,"type":"Psychic","category":"Special","hasSecondaryEffect":true},"Glacial Lance":{"bp":120,"type":"Ice","category":"Physical","isSpread":true},"Thunder Cage":{"bp":80,"type":"Electric","category":"Special"},"Thunderous Kick":{"bp":90,"type":"Fighting","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"statChange":["defense",-1,"target"]},"Dire Claw":{"bp":80,"type":"Poison","category":"Physical","hasSecondaryEffect":true,"makesContact":true,"isSlice":true},"Psyshield Bash":{"bp":90,"type":"Psychic","category":"Physical","hasSecondaryEffect":true,"makesContact":true},"Power Shift":{"type":"Normal","category":"Status"},"Stone Axe":{"bp":65,"type":"Rock","category":"Physical","makesContact":true,"isSlice":true,"hasSecondaryEffect":true},"Springtide Storm":{"bp":100,"type":"Fairy","category":"Special","hasSecondaryEffect":true,"isWind":true,"isSpread":true},"Mystical Power":{"bp":70,"type":"Psychic","category":"Special","hasSecondaryEffect":true,"statChange":["special attack",1,"user"]},"Raging Fury":{"bp":120,"type":"Fire","category":"Physical"},"Wave Crash":{"bp":120,"type":"Water","category":"Physical","makesContact":true,"recoilHP":[1,3]},"Chloroblast":{"bp":150,"type":"Grass","category":"Special","costHP":[1,2,"roundUp"]},"Mountain Gale":{"bp":120,"type":"Ice","category":"Physical","hasSecondaryEffect":true},"Victory Dance":{"type":"Fighting","category":"Status"},"Headlong Rush":{"bp":120,"type":"Ground","category":"Physical","isPunch":true,"makesContact":true},"Barb Barrage":{"bp":60,"type":"Poison","category":"Physical","hasSecondaryEffect":true},"Esper Wing":{"bp":80,"type":"Psychic","category":"Special","hasSecondaryEffect":true},"Bitter Malice":{"bp":75,"type":"Ghost","category":"Special","hasSecondaryEffect":true},"Shelter":{"type":"Steel","category":"Status"},"Triple Arrows":{"bp":90,"type":"Fighting","category":"Physical","hasSecondaryEffect":true},"Infernal Parade":{"bp":65,"type":"Ghost","category":"Special","hasSecondaryEffect":true},"Ceaseless Edge":{"bp":65,"type":"Dark","category":"Physical","makesContact":true,"isSlice":true,"hasSecondaryEffect":true},"Bleakwind Storm":{"bp":100,"type":"Flying","category":"Special","hasSecondaryEffect":true,"isWind":true,"isSpread":true},"Wildbolt Storm":{"bp":100,"type":"Electric","category":"Special","hasSecondaryEffect":true,"isWind":true,"isSpread":true},"Sandsear Storm":{"bp":100,"type":"Ground","category":"Special","hasSecondaryEffect":true,"isWind":true,"isSpread":true},"Lunar Blessing":{"type":"Psychic","category":"Status"},"Take Heart":{"type":"Psychic","category":"Status"},"Tera Blast":{"bp":80,"type":"Normal","category":"Special"},"Silk Trap":{"type":"Bug","category":"Status"},"Axe Kick":{"bp":120,"type":"Fighting","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"hasCrash":true},"Last Respects":{"bp":50,"type":"Ghost","category":"Physical","linearAddBP":true},"Lumina Crash":{"bp":80,"type":"Psychic","category":"Special","hasSecondaryEffect":true,"statChange":["special defense",-2,"target"]},"Order Up":{"bp":80,"type":"Dragon","category":"Physical","hasSecondaryEffect":true},"Jet Punch":{"bp":60,"type":"Water","category":"Physical","makesContact":true,"isPunch":true,"isPriority":true},"Spicy Extract":{"type":"Grass","category":"Status"},"Spin Out":{"bp":100,"type":"Steel","category":"Physical","makesContact":true},"Population Bomb":{"bp":20,"type":"Normal","category":"Physical","makesContact":true,"isSlice":true,"hitRange":[1,10]},"Ice Spinner":{"bp":80,"type":"Ice","category":"Physical","makesContact":true},"Glaive Rush":{"bp":120,"type":"Dragon","category":"Physical","makesContact":true},"Revival Blessing":{"type":"Normal","category":"Status"},"Salt Cure":{"bp":40,"type":"Rock","category":"Physical","hasSecondaryEffect":true},"Triple Dive":{"bp":35,"type":"Water","category":"Physical","makesContact":true,"hitRange":3},"Mortal Spin":{"bp":30,"type":"Poison","category":"Physical","makesContact":true,"hasSecondaryEffect":true,"isSpread":true},"Doodle":{"type":"Normal","category":"Status"},"Fillet Away":{"type":"Normal","category":"Status","costHP":[1,2,"roundDown"]},"Kowtow Cleave":{"bp":85,"type":"Dark","category":"Physical","makesContact":true,"isSlice":true},"Flower Trick":{"bp":70,"type":"Grass","category":"Physical","alwaysCrit":true},"Torch Song":{"bp":80,"type":"Fire","category":"Special","isSound":true,"hasSecondaryEffect":true,"statChange":["special attack",1,"user"]},"Aqua Step":{"bp":80,"type":"Water","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Raging Bull":{"bp":90,"type":"Normal","category":"Physical","makesContact":true,"ignoresScreens":true},"Make It Rain":{"bp":120,"type":"Steel","category":"Special","isSpread":true,"statChange":["special attack",-2,"user"]},"Ruination":{"bp":1,"type":"Dark","category":"Special"},"Collision Course":{"bp":100,"type":"Fighting","category":"Physical","makesContact":true},"Electro Drift":{"bp":100,"type":"Electric","category":"Special","makesContact":true},"Shed Tail":{"type":"Normal","category":"Status","costHP":[1,2,"roundUp"]},"Chilly Reception":{"type":"Ice","category":"Status"},"Tidy Up":{"type":"Normal","category":"Status"},"Snowscape":{"type":"Ice","category":"Status"},"Pounce":{"bp":50,"type":"Bug","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Trailblaze":{"bp":50,"type":"Grass","category":"Physical","makesContact":true,"hasSecondaryEffect":true},"Chilling Water":{"bp":50,"type":"Water","category":"Special","hasSecondaryEffect":true},"Hyper Drill":{"bp":120,"type":"Normal","category":"Physical","makesContact":true},"Twin Beam":{"bp":40,"type":"Psychic","category":"Special","hitRange":2},"Rage Fist":{"bp":50,"type":"Ghost","category":"Physical","makesContact":true,"isPunch":true,"linearAddBP":true},"Armor Cannon":{"bp":120,"type":"Fire","category":"Special"},"Bitter Blade":{"bp":90,"type":"Fire","category":"Physical","makesContact":true,"isSlice":true,"isHealing":true,"drainHP":[1,2]},"Double Shock":{"bp":120,"type":"Electric","category":"Physical","makesContact":true},"Gigaton Hammer":{"bp":160,"type":"Steel","category":"Physical"},"Comeuppance":{"bp":1,"type":"Dark","category":"Physical","makesContact":true,"usesOppMoves":true},"Aqua Cutter":{"bp":70,"type":"Water","category":"Physical","isSlice":true},"Blazing Torque":{"bp":80,"type":"Fire","category":"Physical","hasSecondaryEffect":true},"Wicked Torque":{"bp":80,"type":"Dark","category":"Physical","hasSecondaryEffect":true},"Noxious Torque":{"bp":100,"type":"Poison","category":"Physical","hasSecondaryEffect":true},"Combat Torque":{"bp":100,"type":"Fighting","category":"Physical","hasSecondaryEffect":true},"Magical Torque":{"bp":100,"type":"Fairy","category":"Physical","hasSecondaryEffect":true},"Hydro Steam":{"bp":80,"type":"Water","category":"Special"},"Psyblade":{"bp":80,"type":"Psychic","category":"Physical","isSlice":true},"Blood Moon":{"bp":130,"type":"Normal","category":"Special"},"Matcha Gotcha":{"bp":80,"type":"Grass","category":"Special","hasSecondaryEffect":true,"isSpread":true,"isHealing":true,"drainHP":[1,2]},"Syrup Bomb":{"bp":60,"type":"Grass","category":"Special","hasSecondaryEffect":true,"isBullet":true},"Ivy Cudgel":{"bp":100,"type":"Grass","category":"Physical"},"Electro Shot":{"bp":130,"type":"Electric","category":"Special","hasSecondaryEffect":true},"Tera Starstorm":{"bp":120,"type":"Normal","category":"Special"},"Fickle Beam":{"bp":80,"type":"Dragon","category":"Special","canDouble":true},"Burning Bulwark":{"type":"Fire","category":"Status","isPriority":true},"Thunderclap":{"bp":70,"type":"Electric","category":"Special","isPriority":true},"Mighty Cleave":{"bp":95,"type":"Rock","category":"Physical","isSlice":true,"makesContact":true},"Tachyon Cutter":{"bp":50,"type":"Steel","category":"Special","hitRange":2,"isSlice":true},"Hard Press":{"bp":1,"type":"Steel","category":"Physical","makesContact":true},"Dragon Cheer":{"type":"Dragon","category":"Status","isSound":true},"Alluring Voice":{"bp":80,"type":"Fairy","category":"Special","hasSecondaryEffect":true,"isSound":true},"Temper Flare":{"bp":75,"type":"Fire","category":"Physical","canDouble":true,"makesContact":true},"Supercell Slam":{"bp":100,"type":"Electric","category":"Physical","makesContact":true,"hasCrash":true,"miniDoubleBP":true},"Psychic Noise":{"bp":75,"type":"Psychic","category":"Special","hasSecondaryEffect":true,"isSound":true},"Upper Hand":{"bp":65,"type":"Fighting","category":"Physical","hasSecondaryEffect":true,"makesContact":true,"isPriority":true},"Malignant Chain":{"bp":100,"type":"Poison","category":"Special","hasSecondaryEffect":true},"Nihil Light":{"bp":200,"type":"Dragon","category":"Special","ignoresDefenseBoosts":true,"isSpread":true}};
var POKEDEX_CHAMPIONS = {"Venusaur":{"t1":"Grass","t2":"Poison","bs":{"hp":80,"at":82,"df":83,"sa":100,"sd":100,"sp":80,"sl":100},"w":100,"ab":"Chlorophyll","formes":["Venusaur","Mega Venusaur"]},"Charizard":{"t1":"Fire","t2":"Flying","bs":{"hp":78,"at":84,"df":78,"sa":109,"sd":85,"sp":100,"sl":85},"w":90.5,"ab":"Solar Power","formes":["Charizard","Mega Charizard X","Mega Charizard Y"]},"Blastoise":{"t1":"Water","bs":{"hp":79,"at":83,"df":100,"sa":85,"sd":105,"sp":78,"sl":85},"w":85.5,"ab":"Torrent","formes":["Blastoise","Mega Blastoise"]},"Beedrill":{"t1":"Bug","t2":"Poison","bs":{"hp":65,"at":90,"df":40,"sa":45,"sd":80,"sp":75,"sl":45},"w":29.5,"ab":"Swarm","formes":["Beedrill","Mega Beedrill"]},"Pidgeot":{"t1":"Normal","t2":"Flying","bs":{"hp":83,"at":80,"df":75,"sa":70,"sd":70,"sp":101,"sl":70},"w":39.5,"ab":"Keen Eye","formes":["Pidgeot","Mega Pidgeot"]},"Arbok":{"t1":"Poison","bs":{"hp":60,"at":95,"df":69,"sa":65,"sd":79,"sp":80,"sl":65},"w":65,"ab":"Intimidate"},"Pikachu":{"t1":"Electric","bs":{"hp":35,"at":55,"df":40,"sa":50,"sd":50,"sp":90,"sl":50},"w":6,"ab":"Lightning Rod","canEvolve":true},"Raichu":{"t1":"Electric","bs":{"hp":60,"at":90,"df":55,"sa":90,"sd":80,"sp":110,"sl":90},"w":30,"ab":"Lightning Rod","formes":["Raichu","Mega Raichu X","Mega Raichu Y"]},"Clefable":{"t1":"Fairy","bs":{"hp":95,"at":70,"df":73,"sa":95,"sd":90,"sp":60,"sl":85},"w":40,"ab":"Unaware","formes":["Clefable","Mega Clefable"]},"Ninetales":{"t1":"Fire","bs":{"hp":73,"at":76,"df":75,"sa":81,"sd":100,"sp":100,"sl":100},"w":19.9,"ab":"Drought"},"Arcanine":{"t1":"Fire","bs":{"hp":90,"at":110,"df":80,"sa":100,"sd":80,"sp":95,"sl":80},"w":155,"ab":"Intimidate"},"Alakazam":{"t1":"Psychic","bs":{"hp":55,"at":50,"df":45,"sa":135,"sd":95,"sp":120,"sl":135},"w":48,"ab":"Magic Guard","formes":["Alakazam","Mega Alakazam"]},"Machamp":{"t1":"Fighting","bs":{"hp":90,"at":130,"df":80,"sa":65,"sd":85,"sp":55,"sl":65},"w":130,"ab":"No Guard"},"Victreebel":{"t1":"Grass","t2":"Poison","bs":{"hp":80,"at":105,"df":65,"sa":100,"sd":70,"sp":70,"sl":100},"w":15.5,"ab":"Chlorophyll","formes":["Victreebel","Mega Victreebel"]},"Slowbro":{"t1":"Water","t2":"Psychic","bs":{"hp":95,"at":75,"df":110,"sa":100,"sd":80,"sp":30,"sl":80},"w":78.5,"ab":"Regenerator","formes":["Slowbro","Mega Slowbro"]},"Gengar":{"t1":"Ghost","t2":"Poison","bs":{"hp":60,"at":65,"df":60,"sa":130,"sd":75,"sp":110,"sl":130},"w":40.5,"ab":"Cursed Body","formes":["Gengar","Mega Gengar"]},"Kangaskhan":{"t1":"Normal","bs":{"hp":105,"at":95,"df":80,"sa":40,"sd":80,"sp":90,"sl":40},"w":80,"ab":"Scrappy","formes":["Kangaskhan","Mega Kangaskhan"]},"Starmie":{"t1":"Water","t2":"Psychic","bs":{"hp":60,"at":75,"df":85,"sa":100,"sd":85,"sp":115,"sl":100},"w":80,"ab":"Natural Cure","formes":["Starmie","Mega Starmie"]},"Pinsir":{"t1":"Bug","bs":{"hp":65,"at":125,"df":100,"sa":55,"sd":70,"sp":85,"sl":55},"w":55,"ab":"Hyper Cutter","formes":["Pinsir","Mega Pinsir"]},"Tauros":{"t1":"Normal","bs":{"hp":75,"at":100,"df":95,"sa":40,"sd":70,"sp":110,"sl":70},"w":88.4,"ab":"Intimidate"},"Gyarados":{"t1":"Water","t2":"Flying","bs":{"hp":95,"at":125,"df":79,"sa":60,"sd":100,"sp":81,"sl":100},"w":235,"ab":"Intimidate","formes":["Gyarados","Mega Gyarados"]},"Ditto":{"t1":"Normal","bs":{"hp":48,"at":48,"df":48,"sa":48,"sd":48,"sp":48,"sl":48},"w":4,"ab":"Imposter"},"Vaporeon":{"t1":"Water","bs":{"hp":130,"at":65,"df":60,"sa":110,"sd":95,"sp":65,"sl":110},"w":29,"ab":"Water Absorb"},"Jolteon":{"t1":"Electric","bs":{"hp":65,"at":65,"df":60,"sa":110,"sd":95,"sp":130,"sl":110},"w":24.5,"ab":"Volt Absorb"},"Flareon":{"t1":"Fire","bs":{"hp":65,"at":130,"df":60,"sa":95,"sd":110,"sp":65,"sl":110},"w":25,"ab":"Flash Fire"},"Aerodactyl":{"t1":"Rock","t2":"Flying","bs":{"hp":80,"at":105,"df":65,"sa":60,"sd":75,"sp":130,"sl":60},"w":59,"ab":"Unnerve","formes":["Aerodactyl","Mega Aerodactyl"]},"Snorlax":{"t1":"Normal","bs":{"hp":160,"at":110,"df":65,"sa":65,"sd":110,"sp":30,"sl":65},"w":460,"ab":"Gluttony"},"Dragonite":{"t1":"Dragon","t2":"Flying","bs":{"hp":91,"at":134,"df":95,"sa":100,"sd":100,"sp":80,"sl":100},"w":210,"ab":"Multiscale","formes":["Dragonite","Mega Dragonite"]},"Meganium":{"t1":"Grass","bs":{"hp":80,"at":82,"df":100,"sa":83,"sd":100,"sp":80},"w":100.5,"ab":"Overgrow","formes":["Meganium","Mega Meganium"]},"Typhlosion":{"t1":"Fire","bs":{"hp":78,"at":84,"df":78,"sa":109,"sd":85,"sp":100},"w":79.5,"ab":"Flash Fire"},"Feraligatr":{"t1":"Water","bs":{"hp":85,"at":105,"df":100,"sa":79,"sd":83,"sp":78},"w":88.8,"ab":"Sheer Force","formes":["Feraligatr","Mega Feraligatr"]},"Ariados":{"t1":"Bug","t2":"Poison","bs":{"hp":70,"at":90,"df":70,"sa":60,"sd":70,"sp":40},"w":33.5,"ab":"Swarm"},"Ampharos":{"t1":"Electric","bs":{"hp":90,"at":75,"df":85,"sa":115,"sd":90,"sp":55},"w":61.5,"ab":"Static","formes":["Ampharos","Mega Ampharos"]},"Azumarill":{"t1":"Water","bs":{"hp":100,"at":50,"df":80,"sa":60,"sd":80,"sp":50},"w":28.5,"ab":"Huge Power","t2":"Fairy"},"Politoed":{"t1":"Water","bs":{"hp":90,"at":75,"df":75,"sa":90,"sd":100,"sp":70},"w":33.9,"ab":"Drizzle"},"Espeon":{"t1":"Psychic","bs":{"hp":65,"at":65,"df":60,"sa":130,"sd":95,"sp":110},"w":26.5,"ab":"Magic Bounce"},"Umbreon":{"t1":"Dark","bs":{"hp":95,"at":65,"df":110,"sa":60,"sd":130,"sp":65},"w":27,"ab":"Inner Focus"},"Slowking":{"t1":"Water","t2":"Psychic","bs":{"hp":95,"at":75,"df":80,"sa":100,"sd":110,"sp":30},"w":79.5,"ab":"Regenerator"},"Forretress":{"t1":"Bug","t2":"Steel","bs":{"hp":75,"at":90,"df":140,"sa":60,"sd":60,"sp":40},"w":125.8,"ab":"Sturdy"},"Steelix":{"t1":"Steel","t2":"Ground","bs":{"hp":75,"at":85,"df":200,"sa":55,"sd":65,"sp":30},"w":400,"ab":"Sheer Force","formes":["Steelix","Mega Steelix"]},"Scizor":{"t1":"Bug","t2":"Steel","bs":{"hp":70,"at":130,"df":100,"sa":55,"sd":80,"sp":65},"w":118,"ab":"Technician","formes":["Scizor","Mega Scizor"]},"Heracross":{"t1":"Bug","t2":"Fighting","bs":{"hp":80,"at":125,"df":75,"sa":40,"sd":95,"sp":85},"w":54,"ab":"Moxie","formes":["Heracross","Mega Heracross"]},"Skarmory":{"t1":"Steel","t2":"Flying","bs":{"hp":65,"at":80,"df":140,"sa":40,"sd":70,"sp":70},"w":50.5,"ab":"Sturdy","formes":["Skarmory","Mega Skarmory"]},"Houndoom":{"t1":"Dark","t2":"Fire","bs":{"hp":75,"at":90,"df":50,"sa":110,"sd":80,"sp":95},"w":35,"ab":"Flash Fire","formes":["Houndoom","Mega Houndoom"]},"Tyranitar":{"t1":"Rock","t2":"Dark","bs":{"hp":100,"at":134,"df":110,"sa":95,"sd":100,"sp":61},"w":202,"ab":"Sand Stream","formes":["Tyranitar","Mega Tyranitar"]},"Pelipper":{"t1":"Water","t2":"Flying","bs":{"hp":60,"at":50,"df":100,"sa":95,"sd":70,"sp":65},"w":28,"ab":"Drizzle"},"Gardevoir":{"t1":"Psychic","bs":{"hp":68,"at":65,"df":65,"sa":125,"sd":115,"sp":80},"w":48.4,"ab":"Trace","t2":"Fairy","formes":["Gardevoir","Mega Gardevoir"]},"Sableye":{"t1":"Dark","t2":"Ghost","bs":{"hp":50,"at":75,"df":75,"sa":65,"sd":65,"sp":50},"w":11,"ab":"Prankster","formes":["Sableye","Mega Sableye"]},"Aggron":{"t1":"Steel","t2":"Rock","bs":{"hp":70,"at":110,"df":180,"sa":60,"sd":60,"sp":50},"w":360,"ab":"Sturdy","formes":["Aggron","Mega Aggron"]},"Medicham":{"t1":"Fighting","t2":"Psychic","bs":{"hp":60,"at":60,"df":75,"sa":60,"sd":75,"sp":80},"w":31.5,"ab":"Pure Power","formes":["Medicham","Mega Medicham"]},"Manectric":{"t1":"Electric","bs":{"hp":70,"at":75,"df":60,"sa":105,"sd":60,"sp":105},"w":40.2,"ab":"Lightning Rod","formes":["Manectric","Mega Manectric"]},"Sharpedo":{"t1":"Water","t2":"Dark","bs":{"hp":70,"at":120,"df":40,"sa":95,"sd":40,"sp":95},"w":88.8,"ab":"Speed Boost","formes":["Sharpedo","Mega Sharpedo"]},"Camerupt":{"t1":"Fire","t2":"Ground","bs":{"hp":70,"at":100,"df":70,"sa":105,"sd":75,"sp":40},"w":220,"ab":"Solid Rock","formes":["Camerupt","Mega Camerupt"]},"Torkoal":{"t1":"Fire","bs":{"hp":70,"at":85,"df":140,"sa":85,"sd":70,"sp":20},"w":80.4,"ab":"Drought"},"Altaria":{"t1":"Dragon","t2":"Flying","bs":{"hp":75,"at":70,"df":90,"sa":70,"sd":105,"sp":80},"w":20.6,"ab":"Natural Cure","formes":["Altaria","Mega Altaria"]},"Milotic":{"t1":"Water","bs":{"hp":95,"at":60,"df":79,"sa":100,"sd":125,"sp":81},"w":162,"ab":"Competitive"},"Castform":{"t1":"Normal","bs":{"hp":70,"at":70,"df":70,"sa":70,"sd":70,"sp":70},"w":0.8,"ab":"Forecast"},"Banette":{"t1":"Ghost","bs":{"hp":64,"at":115,"df":65,"sa":83,"sd":63,"sp":65},"w":12.5,"ab":"Insomnia","formes":["Banette","Mega Banette"]},"Chimecho":{"t1":"Psychic","bs":{"hp":75,"at":50,"df":80,"sa":95,"sd":90,"sp":65},"w":1,"ab":"Levitate","formes":["Chimecho","Mega Chimecho"]},"Absol":{"t1":"Dark","bs":{"hp":65,"at":130,"df":60,"sa":75,"sd":60,"sp":75},"w":47,"ab":"Pressure","formes":["Absol","Mega Absol"]},"Glalie":{"t1":"Ice","bs":{"hp":80,"at":80,"df":80,"sa":80,"sd":80,"sp":80},"w":256.5,"ab":"Inner Focus","formes":["Glalie","Mega Glalie"]},"Torterra":{"t1":"Grass","t2":"Ground","bs":{"hp":95,"at":109,"df":105,"sa":75,"sd":85,"sp":56},"w":310,"ab":"Overgrow"},"Infernape":{"t1":"Fire","t2":"Fighting","bs":{"hp":76,"at":104,"df":71,"sa":104,"sd":71,"sp":108},"w":55,"ab":"Blaze"},"Empoleon":{"t1":"Water","t2":"Steel","bs":{"hp":84,"at":86,"df":88,"sa":111,"sd":101,"sp":60},"w":84.5,"ab":"Torrent"},"Luxray":{"t1":"Electric","bs":{"hp":80,"at":120,"df":79,"sa":95,"sd":79,"sp":70},"w":42,"ab":"Intimidate"},"Roserade":{"t1":"Grass","t2":"Poison","bs":{"hp":60,"at":70,"df":65,"sa":125,"sd":105,"sp":90},"w":14.5,"ab":"Natural Cure"},"Rampardos":{"t1":"Rock","bs":{"hp":97,"at":165,"df":60,"sa":65,"sd":50,"sp":58},"w":102.5,"ab":"Sheer Force"},"Bastiodon":{"t1":"Rock","t2":"Steel","bs":{"hp":60,"at":52,"df":168,"sa":47,"sd":138,"sp":30},"w":149.5,"ab":"Sturdy"},"Lopunny":{"t1":"Normal","bs":{"hp":65,"at":76,"df":84,"sa":54,"sd":96,"sp":105},"w":33.3,"ab":"Klutz","formes":["Lopunny","Mega Lopunny"]},"Spiritomb":{"t1":"Ghost","t2":"Dark","bs":{"hp":50,"at":92,"df":108,"sa":92,"sd":108,"sp":35},"w":108,"ab":"Pressure"},"Garchomp":{"t1":"Dragon","t2":"Ground","bs":{"hp":108,"at":130,"df":95,"sa":80,"sd":85,"sp":102},"w":95,"ab":"Rough Skin","formes":["Garchomp","Mega Garchomp"]},"Lucario":{"t1":"Fighting","t2":"Steel","bs":{"hp":70,"at":110,"df":70,"sa":115,"sd":70,"sp":90},"w":54,"ab":"Inner Focus","formes":["Lucario","Mega Lucario"]},"Hippowdon":{"t1":"Ground","bs":{"hp":108,"at":112,"df":118,"sa":68,"sd":72,"sp":47},"w":300,"ab":"Sand Stream"},"Toxicroak":{"t1":"Poison","t2":"Fighting","bs":{"hp":83,"at":106,"df":65,"sa":86,"sd":65,"sp":85},"w":44.4,"ab":"Dry Skin"},"Abomasnow":{"t1":"Grass","t2":"Ice","bs":{"hp":90,"at":92,"df":75,"sa":92,"sd":85,"sp":60},"w":135.5,"ab":"Snow Warning","formes":["Abomasnow","Mega Abomasnow"]},"Weavile":{"t1":"Dark","t2":"Ice","bs":{"hp":70,"at":120,"df":65,"sa":45,"sd":85,"sp":125},"w":34,"ab":"Pressure"},"Rhyperior":{"t1":"Ground","t2":"Rock","bs":{"hp":115,"at":140,"df":130,"sa":55,"sd":55,"sp":40},"w":282.8,"ab":"Solid Rock"},"Leafeon":{"t1":"Grass","bs":{"hp":65,"at":110,"df":130,"sa":60,"sd":65,"sp":95},"w":25.5,"ab":"Chlorophyll"},"Glaceon":{"t1":"Ice","bs":{"hp":65,"at":60,"df":110,"sa":130,"sd":95,"sp":65},"w":25.9,"ab":"Snow Cloak"},"Gliscor":{"t1":"Ground","t2":"Flying","bs":{"hp":75,"at":95,"df":125,"sa":45,"sd":75,"sp":95},"w":42.5,"ab":"Poison Heal"},"Mamoswine":{"t1":"Ice","t2":"Ground","bs":{"hp":110,"at":130,"df":80,"sa":70,"sd":60,"sp":80},"w":291,"ab":"Thick Fat"},"Gallade":{"t1":"Psychic","t2":"Fighting","bs":{"hp":68,"at":125,"df":65,"sa":65,"sd":115,"sp":80},"w":52,"ab":"Sharpness","formes":["Gallade","Mega Gallade"]},"Froslass":{"t1":"Ice","t2":"Ghost","bs":{"hp":70,"at":80,"df":70,"sa":80,"sd":70,"sp":110},"w":26.6,"ab":"Snow Cloak","formes":["Froslass","Mega Froslass"]},"Rotom":{"t1":"Electric","t2":"Ghost","bs":{"hp":50,"at":50,"df":77,"sa":95,"sd":77,"sp":91},"w":0.3,"ab":"Levitate"},"Serperior":{"t1":"Grass","bs":{"hp":75,"at":75,"df":95,"sa":75,"sd":95,"sp":113},"w":63,"ab":"Contrary"},"Emboar":{"t1":"Fire","t2":"Fighting","bs":{"hp":110,"at":123,"df":65,"sa":100,"sd":65,"sp":65},"w":150,"ab":"Reckless","formes":["Emboar","Mega Emboar"]},"Samurott":{"t1":"Water","bs":{"hp":95,"at":100,"df":85,"sa":108,"sd":70,"sp":70},"w":94.6,"ab":"Torrent"},"Watchog":{"t1":"Normal","bs":{"hp":60,"at":85,"df":69,"sa":60,"sd":69,"sp":77},"w":27,"ab":"Analytic"},"Liepard":{"t1":"Dark","bs":{"hp":64,"at":88,"df":50,"sa":88,"sd":50,"sp":106},"w":37.5,"ab":"Prankster"},"Simisage":{"t1":"Grass","bs":{"hp":75,"at":98,"df":63,"sa":98,"sd":63,"sp":101},"w":30.5,"ab":"Overgrow"},"Simisear":{"t1":"Fire","bs":{"hp":75,"at":98,"df":63,"sa":98,"sd":63,"sp":101},"w":28,"ab":"Blaze"},"Simipour":{"t1":"Water","bs":{"hp":75,"at":98,"df":63,"sa":98,"sd":63,"sp":101},"w":29,"ab":"Torrent"},"Excadrill":{"t1":"Ground","t2":"Steel","bs":{"hp":110,"at":135,"df":60,"sa":50,"sd":65,"sp":88},"w":40.4,"ab":"Sand Rush","formes":["Excadrill","Mega Excadrill"]},"Audino":{"t1":"Normal","bs":{"hp":103,"at":60,"df":86,"sa":60,"sd":86,"sp":50},"w":31,"ab":"Regenerator","formes":["Audino","Mega Audino"]},"Conkeldurr":{"t1":"Fighting","bs":{"hp":105,"at":140,"df":95,"sa":55,"sd":65,"sp":45},"w":87,"ab":"Iron Fist"},"Whimsicott":{"t1":"Grass","bs":{"hp":60,"at":67,"df":85,"sa":77,"sd":75,"sp":116},"w":6.6,"ab":"Prankster","t2":"Fairy"},"Krookodile":{"t1":"Ground","t2":"Dark","bs":{"hp":95,"at":117,"df":80,"sa":65,"sd":70,"sp":92},"w":96.3,"ab":"Intimidate"},"Cofagrigus":{"t1":"Ghost","bs":{"hp":58,"at":50,"df":145,"sa":95,"sd":105,"sp":30},"w":76.5,"ab":"Mummy"},"Garbodor":{"t1":"Poison","bs":{"hp":80,"at":95,"df":82,"sa":60,"sd":82,"sp":75},"w":107.3,"ab":"Aftermath"},"Zoroark":{"t1":"Dark","bs":{"hp":60,"at":105,"df":60,"sa":120,"sd":60,"sp":105},"w":81.1,"ab":"Illusion"},"Reuniclus":{"t1":"Psychic","bs":{"hp":110,"at":65,"df":75,"sa":125,"sd":85,"sp":30},"w":20.1,"ab":"Magic Guard"},"Vanilluxe":{"t1":"Ice","bs":{"hp":71,"at":95,"df":85,"sa":110,"sd":95,"sp":79},"w":57.5,"ab":"Snow Warning"},"Emolga":{"t1":"Electric","t2":"Flying","bs":{"hp":55,"at":75,"df":60,"sa":75,"sd":60,"sp":103},"w":5,"ab":"Motor Drive"},"Chandelure":{"t1":"Ghost","t2":"Fire","bs":{"hp":60,"at":55,"df":90,"sa":145,"sd":90,"sp":80},"w":34.3,"ab":"Flash Fire","formes":["Chandelure","Mega Chandelure"]},"Beartic":{"t1":"Ice","bs":{"hp":95,"at":130,"df":80,"sa":70,"sd":80,"sp":50},"w":260,"ab":"Swift Swim"},"Stunfisk":{"t1":"Ground","t2":"Electric","bs":{"hp":109,"at":66,"df":84,"sa":81,"sd":99,"sp":32},"w":11,"ab":"Static"},"Golurk":{"t1":"Ground","t2":"Ghost","bs":{"hp":89,"at":124,"df":80,"sa":55,"sd":80,"sp":55},"w":330,"ab":"Iron Fist","formes":["Golurk","Mega Golurk"]},"Hydreigon":{"t1":"Dark","t2":"Dragon","bs":{"hp":92,"at":105,"df":90,"sa":125,"sd":90,"sp":98},"w":160,"ab":"Levitate"},"Volcarona":{"t1":"Bug","t2":"Fire","bs":{"hp":85,"at":60,"df":65,"sa":135,"sd":105,"sp":100},"w":46,"ab":"Flame Body"},"Chesnaught":{"t1":"Grass","t2":"Fighting","bs":{"hp":88,"at":107,"df":122,"sa":74,"sd":75,"sp":64},"w":90,"ab":"Bulletproof","formes":["Chesnaught","Mega Chesnaught"]},"Delphox":{"t1":"Fire","t2":"Psychic","bs":{"hp":75,"at":69,"df":72,"sa":114,"sd":100,"sp":104},"w":39,"ab":"Magician","formes":["Delphox","Mega Delphox"]},"Greninja":{"t1":"Water","t2":"Dark","bs":{"hp":72,"at":95,"df":67,"sa":103,"sd":71,"sp":122},"ab":"Protean","w":40,"formes":["Greninja","Mega Greninja"]},"Diggersby":{"t1":"Normal","t2":"Ground","bs":{"hp":85,"at":56,"df":77,"sa":50,"sd":77,"sp":78},"w":42.4,"ab":"Huge Power"},"Talonflame":{"t1":"Fire","t2":"Flying","bs":{"hp":78,"at":81,"df":71,"sa":74,"sd":69,"sp":126},"w":24.5,"ab":"Gale Wings"},"Vivillon":{"t1":"Bug","t2":"Flying","bs":{"hp":80,"at":52,"df":50,"sa":90,"sd":50,"sp":89},"w":17,"ab":"Friend Guard"},"Floette-Eternal":{"t1":"Fairy","bs":{"hp":74,"at":65,"df":67,"sa":125,"sd":128,"sp":92},"w":0.9,"ab":"Flower Veil","formes":["Floette-Eternal","Mega Floette"]},"Florges":{"t1":"Fairy","bs":{"hp":78,"at":65,"df":68,"sa":112,"sd":154,"sp":75},"w":10,"ab":"Symbiosis"},"Pangoro":{"t1":"Fighting","t2":"Dark","bs":{"hp":95,"at":124,"df":78,"sa":69,"sd":71,"sp":58},"w":136,"ab":"Scrappy"},"Furfrou":{"t1":"Normal","bs":{"hp":75,"at":80,"df":60,"sa":65,"sd":90,"sp":102},"w":28,"ab":"Fur Coat"},"Meowstic":{"t1":"Psychic","bs":{"hp":74,"at":48,"df":76,"sa":83,"sd":81,"sp":104},"w":8.5,"ab":"Prankster","formes":["Meowstic","Mega Meowstic"]},"Aegislash":{"t1":"Steel","t2":"Ghost","bs":{"hp":60,"at":50,"df":140,"sa":50,"sd":140,"sp":60},"w":53,"ab":"Stance Change","formes":["Aegislash-Shield","Aegislash-Blade"]},"Aromatisse":{"t1":"Fairy","bs":{"hp":101,"at":72,"df":72,"sa":99,"sd":89,"sp":29},"w":15.5,"ab":"Healer"},"Slurpuff":{"t1":"Fairy","bs":{"hp":82,"at":80,"df":86,"sa":85,"sd":75,"sp":72},"w":5,"ab":"Unburden"},"Clawitzer":{"t1":"Water","bs":{"hp":71,"at":73,"df":88,"sa":120,"sd":89,"sp":59},"w":35.3,"ab":"Mega Launcher"},"Heliolisk":{"t1":"Electric","t2":"Normal","bs":{"hp":62,"at":55,"df":52,"sa":109,"sd":94,"sp":109},"w":21,"ab":"Dry Skin"},"Tyrantrum":{"t1":"Rock","t2":"Dragon","bs":{"hp":82,"at":121,"df":119,"sa":69,"sd":59,"sp":71},"w":270,"ab":"Strong Jaw"},"Aurorus":{"t1":"Rock","t2":"Ice","bs":{"hp":123,"at":77,"df":72,"sa":99,"sd":92,"sp":58},"w":225,"ab":"Refrigerate"},"Sylveon":{"t1":"Fairy","bs":{"hp":95,"at":65,"df":65,"sa":110,"sd":130,"sp":60},"w":23.5,"ab":"Pixilate"},"Hawlucha":{"t1":"Fighting","t2":"Flying","bs":{"hp":78,"at":92,"df":75,"sa":74,"sd":63,"sp":118},"w":21.5,"ab":"Unburden","formes":["Hawlucha","Mega Hawlucha"]},"Dedenne":{"t1":"Electric","t2":"Fairy","bs":{"hp":67,"at":58,"df":57,"sa":81,"sd":67,"sp":101},"w":2.2,"ab":"Cheek Pouch"},"Goodra":{"t1":"Dragon","bs":{"hp":90,"at":100,"df":70,"sa":110,"sd":150,"sp":80},"w":150.5,"ab":"Sap Sipper"},"Klefki":{"t1":"Steel","t2":"Fairy","bs":{"hp":57,"at":80,"df":91,"sa":80,"sd":87,"sp":75},"w":3,"ab":"Prankster"},"Trevenant":{"t1":"Ghost","t2":"Grass","bs":{"hp":85,"at":110,"df":76,"sa":65,"sd":82,"sp":56},"w":71,"ab":"Harvest"},"Gourgeist-Average":{"t1":"Ghost","t2":"Grass","bs":{"hp":65,"at":90,"df":122,"sa":58,"sd":75,"sp":84},"w":12.5,"ab":"Frisk"},"Avalugg":{"t1":"Ice","bs":{"hp":95,"at":117,"df":184,"sa":44,"sd":46,"sp":28},"w":505,"ab":"Own Tempo"},"Noivern":{"t1":"Flying","t2":"Dragon","bs":{"hp":85,"at":70,"df":80,"sa":97,"sd":80,"sp":123},"w":85,"ab":"Infiltrator"},"Decidueye":{"t1":"Grass","t2":"Ghost","bs":{"hp":78,"at":107,"df":75,"sa":100,"sd":100,"sp":70},"w":36.6,"ab":"Long Reach"},"Incineroar":{"t1":"Fire","t2":"Dark","bs":{"hp":95,"at":115,"df":90,"sa":80,"sd":90,"sp":60},"w":83,"ab":"Intimidate"},"Primarina":{"t1":"Water","t2":"Fairy","bs":{"hp":80,"at":74,"df":74,"sa":126,"sd":116,"sp":60},"w":44,"ab":"Liquid Voice"},"Toucannon":{"t1":"Normal","t2":"Flying","bs":{"hp":80,"at":120,"df":75,"sa":75,"sd":75,"sp":60},"w":26,"ab":"Skill Link"},"Crabominable":{"t1":"Fighting","t2":"Ice","bs":{"hp":97,"at":132,"df":77,"sa":62,"sd":67,"sp":43},"w":180,"ab":"Hyper Cutter","formes":["Crabominable","Mega Crabominable"]},"Lycanroc-Midday":{"t1":"Rock","bs":{"hp":75,"at":115,"df":65,"sa":55,"sd":65,"sp":112},"w":25,"ab":"Sand Rush"},"Toxapex":{"t1":"Poison","t2":"Water","bs":{"hp":50,"at":63,"df":152,"sa":53,"sd":142,"sp":35},"w":14.5,"ab":"Regenerator"},"Mudsdale":{"t1":"Ground","bs":{"hp":100,"at":125,"df":100,"sa":55,"sd":85,"sp":35},"w":920,"ab":"Stamina"},"Araquanid":{"t1":"Water","t2":"Bug","bs":{"hp":68,"at":70,"df":92,"sa":50,"sd":132,"sp":42},"ab":"Water Bubble","w":82},"Salazzle":{"t1":"Poison","t2":"Fire","bs":{"hp":68,"at":64,"df":60,"sa":111,"sd":60,"sp":117},"w":22.2,"ab":"Oblivious"},"Tsareena":{"t1":"Grass","bs":{"hp":72,"at":120,"df":98,"sa":50,"sd":98,"sp":72},"w":21.4,"ab":"Queenly Majesty"},"Oranguru":{"t1":"Normal","t2":"Psychic","bs":{"hp":90,"at":60,"df":80,"sa":90,"sd":110,"sp":60},"w":76,"ab":"Inner Focus"},"Passimian":{"t1":"Fighting","bs":{"hp":100,"at":120,"df":90,"sa":40,"sd":60,"sp":80},"w":82.8,"ab":"Defiant"},"Mimikyu":{"t1":"Ghost","t2":"Fairy","bs":{"hp":55,"at":90,"df":80,"sa":50,"sd":105,"sp":96},"w":0.7,"ab":"Disguise"},"Drampa":{"t1":"Normal","t2":"Dragon","bs":{"hp":78,"at":60,"df":85,"sa":135,"sd":91,"sp":36},"w":185,"ab":"Cloud Nine","formes":["Drampa","Mega Drampa"]},"Kommo-o":{"t1":"Dragon","t2":"Fighting","bs":{"hp":75,"at":110,"df":125,"sa":100,"sd":105,"sp":85},"w":78.2,"ab":"Soundproof"},"Corviknight":{"t1":"Flying","t2":"Steel","bs":{"hp":98,"at":87,"df":105,"sa":53,"sd":85,"sp":67},"w":75,"ab":"Mirror Armor"},"Flapple":{"t1":"Grass","t2":"Dragon","bs":{"hp":70,"at":110,"df":80,"sa":95,"sd":60,"sp":70},"w":1,"ab":"Hustle"},"Appletun":{"t1":"Grass","t2":"Dragon","bs":{"hp":110,"at":85,"df":80,"sa":100,"sd":80,"sp":30},"w":13,"ab":"Thick Fat"},"Sandaconda":{"t1":"Ground","bs":{"hp":72,"at":107,"df":125,"sa":65,"sd":70,"sp":71},"w":65.5,"ab":"Sand Spit"},"Polteageist":{"t1":"Ghost","bs":{"hp":60,"at":65,"df":65,"sa":134,"sd":114,"sp":70},"w":0.4,"ab":"Cursed Body"},"Hatterene":{"t1":"Psychic","t2":"Fairy","bs":{"hp":57,"at":90,"df":95,"sa":136,"sd":103,"sp":29},"w":5.1,"ab":"Magic Bounce"},"Mr. Rime":{"t1":"Ice","t2":"Psychic","bs":{"hp":80,"at":85,"df":75,"sa":110,"sd":100,"sp":70},"w":58.2,"ab":"Screen Cleaner"},"Runerigus":{"t1":"Ground","t2":"Ghost","bs":{"hp":58,"at":95,"df":145,"sa":50,"sd":105,"sp":30},"w":66.6,"ab":"Wandering Spirit"},"Alcremie":{"t1":"Fairy","bs":{"hp":65,"at":60,"df":75,"sa":110,"sd":121,"sp":64},"w":0.5,"ab":"Sweet Veil"},"Morpeko":{"t1":"Electric","t2":"Dark","bs":{"hp":58,"at":95,"df":58,"sa":70,"sd":58,"sp":97},"w":3,"formes":["Morpeko","Morpeko-Hangry"],"ab":"Hunger Switch"},"Dragapult":{"t1":"Dragon","t2":"Ghost","bs":{"hp":88,"at":120,"df":75,"sa":100,"sd":75,"sp":142},"w":50,"ab":"Clear Body"},"Wyrdeer":{"t1":"Normal","t2":"Psychic","bs":{"hp":103,"at":105,"df":72,"sa":105,"sd":75,"sp":65},"w":95.1,"ab":"Intimidate"},"Kleavor":{"t1":"Bug","t2":"Rock","bs":{"hp":70,"at":135,"df":95,"sa":45,"sd":70,"sp":85},"w":89,"ab":"Sharpness"},"Basculegion":{"t1":"Water","t2":"Ghost","bs":{"hp":120,"at":112,"df":65,"sa":80,"sd":75,"sp":78},"w":110,"ab":"Swift Swim"},"Sneasler":{"t1":"Fighting","t2":"Poison","bs":{"hp":80,"at":130,"df":60,"sa":40,"sd":80,"sp":120},"w":43,"ab":"Unburden"},"Meowscarada":{"t1":"Grass","t2":"Dark","bs":{"hp":76,"at":110,"df":70,"sa":81,"sd":70,"sp":123},"w":31.2,"ab":"Protean"},"Skeledirge":{"t1":"Fire","t2":"Ghost","bs":{"hp":104,"at":75,"df":100,"sa":110,"sd":75,"sp":66},"w":326.5,"ab":"Unaware"},"Quaquaval":{"t1":"Water","t2":"Fighting","bs":{"hp":85,"at":120,"df":80,"sa":85,"sd":75,"sp":85},"w":61.9,"ab":"Moxie"},"Maushold":{"t1":"Normal","bs":{"hp":74,"at":75,"df":70,"sa":65,"sd":75,"sp":111},"w":2.3,"ab":"Technician"},"Garganacl":{"t1":"Rock","bs":{"hp":100,"at":100,"df":130,"sa":45,"sd":90,"sp":35},"w":240,"ab":"Purifying Salt"},"Armarouge":{"t1":"Fire","t2":"Psychic","bs":{"hp":85,"at":60,"df":100,"sa":125,"sd":80,"sp":75},"w":85,"ab":"Flash Fire"},"Ceruledge":{"t1":"Fire","t2":"Ghost","bs":{"hp":75,"at":125,"df":80,"sa":60,"sd":100,"sp":85},"w":62,"ab":"Flash Fire"},"Bellibolt":{"t1":"Electric","bs":{"hp":109,"at":64,"df":91,"sa":103,"sd":83,"sp":45},"w":113,"ab":"Electromorphosis"},"Scovillain":{"t1":"Grass","t2":"Fire","bs":{"hp":65,"at":108,"df":65,"sa":108,"sd":65,"sp":75},"w":15,"ab":"Chlorophyll","formes":["Scovillain","Mega Scovillain"]},"Espathra":{"t1":"Psychic","bs":{"hp":95,"at":60,"df":60,"sa":101,"sd":60,"sp":105},"w":90,"ab":"Speed Boost"},"Tinkaton":{"t1":"Fairy","t2":"Steel","bs":{"hp":85,"at":75,"df":77,"sa":70,"sd":105,"sp":94},"w":112.8,"ab":"Own Tempo"},"Palafin":{"t1":"Water","bs":{"hp":100,"at":70,"df":72,"sa":53,"sd":62,"sp":100},"w":60.2,"ab":"Zero to Hero","formes":["Palafin","Palafin-Hero"]},"Orthworm":{"t1":"Steel","bs":{"hp":70,"at":85,"df":145,"sa":60,"sd":55,"sp":65},"w":310,"ab":"Earth Eater"},"Glimmora":{"t1":"Rock","t2":"Poison","bs":{"hp":83,"at":55,"df":90,"sa":130,"sd":81,"sp":86},"w":45,"ab":"Toxic Debris","formes":["Glimmora","Mega Glimmora"]},"Farigiraf":{"t1":"Normal","t2":"Psychic","bs":{"hp":120,"at":90,"df":70,"sa":110,"sd":70,"sp":60},"w":160,"ab":"Cud Chew"},"Kingambit":{"t1":"Dark","t2":"Steel","bs":{"hp":100,"at":135,"df":120,"sa":60,"sd":85,"sp":50},"w":120,"ab":"Defiant"},"Sinistcha":{"t1":"Grass","t2":"Ghost","bs":{"hp":71,"at":60,"df":106,"sa":121,"sd":80,"sp":70},"w":2.2,"ab":"Hospitality"},"Archaludon":{"t1":"Steel","t2":"Dragon","bs":{"hp":90,"at":105,"df":130,"sa":125,"sd":65,"sp":85},"w":60,"ab":"Stamina"},"Hydrapple":{"t1":"Grass","t2":"Dragon","bs":{"hp":106,"at":80,"df":110,"sa":120,"sd":80,"sp":44},"w":93,"ab":"Regenerator"},"Mega Venusaur":{"t1":"Grass","t2":"Poison","bs":{"hp":80,"at":100,"df":123,"sa":122,"sd":120,"sp":80},"w":155.5,"ab":"Thick Fat","isAlternateForme":true},"Mega Charizard X":{"t1":"Fire","t2":"Dragon","bs":{"hp":78,"at":130,"df":111,"sa":130,"sd":85,"sp":100},"w":110.5,"ab":"Tough Claws","isAlternateForme":true},"Mega Charizard Y":{"t1":"Fire","t2":"Flying","bs":{"hp":78,"at":104,"df":78,"sa":159,"sd":115,"sp":100},"w":100.5,"ab":"Drought","isAlternateForme":true},"Mega Blastoise":{"t1":"Water","bs":{"hp":79,"at":103,"df":120,"sa":135,"sd":115,"sp":78},"w":101.1,"ab":"Mega Launcher","isAlternateForme":true},"Mega Beedrill":{"t1":"Bug","t2":"Poison","bs":{"hp":65,"at":150,"df":40,"sa":15,"sd":80,"sp":145},"w":40.5,"ab":"Adaptability","isAlternateForme":true},"Mega Pidgeot":{"t1":"Normal","t2":"Flying","bs":{"hp":83,"at":80,"df":80,"sa":135,"sd":80,"sp":121},"w":50.5,"ab":"No Guard","isAlternateForme":true},"Raichu-Alola":{"t1":"Electric","t2":"Psychic","bs":{"hp":60,"at":85,"df":50,"sa":95,"sd":85,"sp":110},"w":21,"ab":"Surge Surfer"},"Mega Clefable":{"t1":"Fairy","t2":"Flying","bs":{"hp":95,"at":80,"df":93,"sa":135,"sd":110,"sp":70},"w":42.3,"ab":"Magic Bounce","isAlternateForme":true},"Ninetales-Alola":{"t1":"Ice","t2":"Fairy","bs":{"hp":73,"at":67,"df":75,"sa":81,"sd":100,"sp":109},"w":19.9,"ab":"Snow Warning"},"Arcanine-Hisui":{"t1":"Fire","t2":"Rock","bs":{"hp":95,"at":115,"df":80,"sa":95,"sd":80,"sp":90},"w":168,"ab":"Intimidate"},"Mega Alakazam":{"t1":"Psychic","bs":{"hp":55,"at":50,"df":65,"sa":175,"sd":105,"sp":150},"w":48,"ab":"Trace","isAlternateForme":true},"Mega Victreebel":{"t1":"Grass","t2":"Poison","bs":{"hp":80,"at":125,"df":85,"sa":135,"sd":95,"sp":70},"w":125.5,"ab":"Innards Out","isAlternateForme":true},"Mega Slowbro":{"t1":"Water","t2":"Psychic","bs":{"hp":95,"at":75,"df":180,"sa":130,"sd":80,"sp":30},"w":120,"ab":"Shell Armor","isAlternateForme":true},"Slowbro-Galar":{"t1":"Poison","t2":"Psychic","bs":{"hp":95,"at":100,"df":95,"sa":100,"sd":70,"sp":30},"w":70.5,"ab":"Quick Draw"},"Mega Gengar":{"t1":"Ghost","t2":"Poison","bs":{"hp":60,"at":65,"df":80,"sa":170,"sd":95,"sp":130},"w":40.5,"ab":"Shadow Tag","isAlternateForme":true},"Mega Kangaskhan":{"t1":"Normal","bs":{"hp":105,"at":125,"df":100,"sa":60,"sd":100,"sp":100},"w":100,"ab":"Parental Bond","isAlternateForme":true},"Mega Starmie":{"t1":"Water","t2":"Psychic","bs":{"hp":60,"at":100,"df":105,"sa":130,"sd":105,"sp":120},"w":80,"ab":"Huge Power","isAlternateForme":true},"Mega Pinsir":{"t1":"Bug","t2":"Flying","bs":{"hp":65,"at":155,"df":120,"sa":65,"sd":90,"sp":105},"w":59,"ab":"Aerilate","isAlternateForme":true},"Tauros-Paldea-Combat":{"t1":"Fighting","bs":{"hp":75,"at":110,"df":105,"sa":30,"sd":70,"sp":100},"w":115,"ab":"Intimidate"},"Tauros-Paldea-Aqua":{"t1":"Fighting","t2":"Water","bs":{"hp":75,"at":110,"df":105,"sa":30,"sd":70,"sp":100},"w":110,"ab":"Intimidate"},"Tauros-Paldea-Blaze":{"t1":"Fighting","t2":"Fire","bs":{"hp":75,"at":110,"df":105,"sa":30,"sd":70,"sp":100},"w":85,"ab":"Intimidate"},"Mega Gyarados":{"t1":"Water","t2":"Dark","bs":{"hp":95,"at":155,"df":109,"sa":70,"sd":130,"sp":81},"w":305,"ab":"Mold Breaker","isAlternateForme":true},"Mega Aerodactyl":{"t1":"Rock","t2":"Flying","bs":{"hp":80,"at":135,"df":85,"sa":70,"sd":95,"sp":150},"w":79,"ab":"Tough Claws","isAlternateForme":true},"Mega Dragonite":{"t1":"Dragon","t2":"Flying","bs":{"hp":91,"at":124,"df":115,"sa":145,"sd":125,"sp":100},"w":290,"ab":"Multiscale","isAlternateForme":true},"Mega Meganium":{"t1":"Grass","t2":"Fairy","bs":{"hp":80,"at":92,"df":115,"sa":143,"sd":115,"sp":80},"w":201,"ab":"Mega Sol","isAlternateForme":true},"Typhlosion-Hisui":{"t1":"Fire","t2":"Ghost","bs":{"hp":73,"at":84,"df":78,"sa":119,"sd":85,"sp":95},"w":69.8,"ab":"Frisk"},"Mega Feraligatr":{"t1":"Water","t2":"Dragon","bs":{"hp":85,"at":160,"df":125,"sa":89,"sd":93,"sp":78},"w":108.8,"ab":"Dragonize","isAlternateForme":true},"Mega Ampharos":{"t1":"Electric","t2":"Dragon","bs":{"hp":90,"at":95,"df":105,"sa":165,"sd":110,"sp":45},"w":61.5,"ab":"Mold Breaker","isAlternateForme":true},"Slowking-Galar":{"t1":"Poison","t2":"Psychic","bs":{"hp":95,"at":65,"df":80,"sa":110,"sd":110,"sp":30},"w":79.5,"ab":"Curious Medicine"},"Mega Steelix":{"t1":"Steel","t2":"Ground","bs":{"hp":75,"at":125,"df":230,"sa":55,"sd":95,"sp":30},"w":740,"ab":"Sand Force","isAlternateForme":true},"Mega Scizor":{"t1":"Bug","t2":"Steel","bs":{"hp":70,"at":150,"df":140,"sa":65,"sd":100,"sp":75},"w":125,"ab":"Technician","isAlternateForme":true},"Mega Heracross":{"t1":"Bug","t2":"Fighting","bs":{"hp":80,"at":185,"df":115,"sa":40,"sd":105,"sp":75},"w":62.5,"ab":"Skill Link","isAlternateForme":true},"Mega Skarmory":{"t1":"Steel","t2":"Flying","bs":{"hp":65,"at":140,"df":110,"sa":40,"sd":100,"sp":110},"w":40.4,"ab":"Stalwart","isAlternateForme":true},"Mega Houndoom":{"t1":"Dark","t2":"Fire","bs":{"hp":75,"at":90,"df":90,"sa":140,"sd":90,"sp":115},"w":49.5,"ab":"Solar Power","isAlternateForme":true},"Mega Tyranitar":{"t1":"Rock","t2":"Dark","bs":{"hp":100,"at":164,"df":150,"sa":95,"sd":120,"sp":71},"w":255,"ab":"Sand Stream","isAlternateForme":true},"Mega Gardevoir":{"t1":"Psychic","t2":"Fairy","bs":{"hp":68,"at":85,"df":65,"sa":165,"sd":135,"sp":100},"w":48.4,"ab":"Pixilate","isAlternateForme":true},"Mega Sableye":{"t1":"Dark","t2":"Ghost","bs":{"hp":50,"at":85,"df":125,"sa":85,"sd":115,"sp":20},"w":161,"ab":"Magic Bounce","isAlternateForme":true},"Mega Aggron":{"t1":"Steel","bs":{"hp":70,"at":140,"df":230,"sa":60,"sd":80,"sp":50},"w":395,"ab":"Filter","isAlternateForme":true},"Mega Medicham":{"t1":"Fighting","t2":"Psychic","bs":{"hp":60,"at":100,"df":85,"sa":80,"sd":85,"sp":100},"w":31.5,"ab":"Pure Power","isAlternateForme":true},"Mega Manectric":{"t1":"Electric","bs":{"hp":70,"at":75,"df":80,"sa":135,"sd":80,"sp":135},"w":44,"ab":"Intimidate","isAlternateForme":true},"Mega Sharpedo":{"t1":"Water","t2":"Dark","bs":{"hp":70,"at":140,"df":70,"sa":110,"sd":65,"sp":105},"w":130.3,"ab":"Strong Jaw","isAlternateForme":true},"Mega Camerupt":{"t1":"Fire","t2":"Ground","bs":{"hp":70,"at":120,"df":100,"sa":145,"sd":105,"sp":20},"w":320.5,"ab":"Sheer Force","isAlternateForme":true},"Mega Altaria":{"t1":"Dragon","t2":"Fairy","bs":{"hp":75,"at":110,"df":110,"sa":110,"sd":105,"sp":80},"w":20.6,"ab":"Pixilate","isAlternateForme":true},"Mega Banette":{"t1":"Ghost","bs":{"hp":64,"at":165,"df":75,"sa":93,"sd":83,"sp":75},"w":13,"ab":"Prankster","isAlternateForme":true},"Mega Chimecho":{"t1":"Psychic","t2":"Steel","bs":{"hp":75,"at":50,"df":110,"sa":135,"sd":120,"sp":65},"w":8,"ab":"Levitate","isAlternateForme":true},"Mega Absol":{"t1":"Dark","bs":{"hp":65,"at":150,"df":60,"sa":115,"sd":60,"sp":115},"w":49,"ab":"Magic Bounce","isAlternateForme":true},"Mega Glalie":{"t1":"Ice","bs":{"hp":80,"at":120,"df":80,"sa":120,"sd":80,"sp":100},"w":350.2,"ab":"Refrigerate","isAlternateForme":true},"Mega Lopunny":{"t1":"Normal","t2":"Fighting","bs":{"hp":65,"at":136,"df":94,"sa":54,"sd":96,"sp":135},"w":28.3,"ab":"Scrappy","isAlternateForme":true},"Mega Garchomp":{"t1":"Dragon","t2":"Ground","bs":{"hp":108,"at":170,"df":115,"sa":120,"sd":95,"sp":92},"w":95,"ab":"Sand Force","isAlternateForme":true},"Mega Lucario":{"t1":"Fighting","t2":"Steel","bs":{"hp":70,"at":145,"df":88,"sa":140,"sd":70,"sp":112},"w":57.5,"ab":"Adaptability","isAlternateForme":true},"Mega Abomasnow":{"t1":"Grass","t2":"Ice","bs":{"hp":90,"at":132,"df":105,"sa":132,"sd":105,"sp":30},"w":185,"ab":"Snow Warning","isAlternateForme":true},"Mega Gallade":{"t1":"Psychic","t2":"Fighting","bs":{"hp":68,"at":165,"df":95,"sa":65,"sd":115,"sp":110},"w":56.4,"ab":"Inner Focus","isAlternateForme":true},"Mega Froslass":{"t1":"Ice","t2":"Ghost","bs":{"hp":70,"at":80,"df":70,"sa":140,"sd":100,"sp":120},"w":29.6,"ab":"Snow Warning","isAlternateForme":true},"Rotom-Heat":{"t1":"Electric","t2":"Fire","bs":{"hp":50,"at":65,"df":107,"sa":105,"sd":107,"sp":86},"w":0.3,"ab":"Levitate"},"Rotom-Wash":{"t1":"Electric","t2":"Water","bs":{"hp":50,"at":65,"df":107,"sa":105,"sd":107,"sp":86},"w":0.3,"ab":"Levitate"},"Rotom-Frost":{"t1":"Electric","t2":"Ice","bs":{"hp":50,"at":65,"df":107,"sa":105,"sd":107,"sp":86},"w":0.3,"ab":"Levitate"},"Rotom-Fan":{"t1":"Electric","t2":"Flying","bs":{"hp":50,"at":65,"df":107,"sa":105,"sd":107,"sp":86},"w":0.3,"ab":"Levitate"},"Rotom-Mow":{"t1":"Electric","t2":"Grass","bs":{"hp":50,"at":65,"df":107,"sa":105,"sd":107,"sp":86},"w":0.3,"ab":"Levitate"},"Mega Emboar":{"t1":"Fire","t2":"Fighting","bs":{"hp":110,"at":148,"df":75,"sa":110,"sd":110,"sp":75},"w":180.3,"ab":"Mold Breaker","isAlternateForme":true},"Samurott-Hisui":{"t1":"Water","t2":"Dark","bs":{"hp":90,"at":108,"df":80,"sa":100,"sd":65,"sp":85},"w":58.2,"ab":"Sharpness"},"Mega Excadrill":{"t1":"Ground","t2":"Steel","bs":{"hp":110,"at":165,"df":100,"sa":65,"sd":65,"sp":103},"w":60,"ab":"Piercing Drill","isAlternateForme":true},"Mega Audino":{"t1":"Normal","t2":"Fairy","bs":{"hp":103,"at":60,"df":126,"sa":80,"sd":126,"sp":50},"w":32,"ab":"Healer","isAlternateForme":true},"Zoroark-Hisui":{"t1":"Normal","t2":"Ghost","bs":{"hp":55,"at":100,"df":60,"sa":125,"sd":60,"sp":110},"w":73,"ab":"Illusion"},"Mega Chandelure":{"t1":"Fire","t2":"Ghost","bs":{"hp":60,"at":75,"df":110,"sa":175,"sd":110,"sp":90},"w":69.6,"ab":"Infiltrator","isAlternateForme":true},"Stunfisk-Galar":{"t1":"Ground","t2":"Steel","bs":{"hp":109,"at":81,"df":99,"sa":66,"sd":84,"sp":32},"w":20.5,"ab":"Mimicry"},"Mega Golurk":{"t1":"Ground","t2":"Ghost","bs":{"hp":89,"at":159,"df":105,"sa":70,"sd":105,"sp":55},"w":330,"ab":"Unseen Fist","isAlternateForme":true},"Mega Chesnaught":{"t1":"Grass","t2":"Fighting","bs":{"hp":88,"at":137,"df":172,"sa":74,"sd":115,"sp":44},"w":90,"ab":"Bulletproof","isAlternateForme":true},"Mega Delphox":{"t1":"Fire","t2":"Psychic","bs":{"hp":75,"at":69,"df":72,"sa":159,"sd":125,"sp":134},"w":39,"ab":"Levitate","isAlternateForme":true},"Mega Greninja":{"t1":"Water","t2":"Dark","bs":{"hp":72,"at":125,"df":77,"sa":133,"sd":81,"sp":142},"w":40,"ab":"Protean","isAlternateForme":true},"Mega Floette":{"t1":"Fairy","bs":{"hp":74,"at":85,"df":87,"sa":155,"sd":148,"sp":102},"w":100.8,"ab":"Fairy Aura","isAlternateForme":true},"Meowstic-F":{"t1":"Psychic","bs":{"hp":74,"at":48,"df":76,"sa":83,"sd":81,"sp":104},"w":8.5,"ab":"Competitive","formes":["Meowstic-F","Mega Meowstic"]},"Mega Meowstic":{"t1":"Psychic","bs":{"hp":74,"at":48,"df":76,"sa":143,"sd":101,"sp":124},"w":10.1,"ab":"Trace","isAlternateForme":true},"Aegislash-Shield":{"t1":"Steel","t2":"Ghost","bs":{"hp":60,"at":50,"df":140,"sa":50,"sd":140,"sp":60},"w":53,"ab":"Stance Change","isAlternateForme":true},"Aegislash-Blade":{"t1":"Steel","t2":"Ghost","bs":{"hp":60,"at":140,"df":50,"sa":140,"sd":50,"sp":60},"w":53,"ab":"Stance Change","isAlternateForme":true},"Mega Hawlucha":{"t1":"Fighting","t2":"Flying","bs":{"hp":78,"at":137,"df":100,"sa":74,"sd":93,"sp":118},"w":25,"ab":"No Guard","isAlternateForme":true},"Goodra-Hisui":{"t1":"Steel","t2":"Dragon","bs":{"hp":80,"at":100,"df":100,"sa":110,"sd":150,"sp":60},"w":334.1,"ab":"Shell Armor"},"Gourgeist-Small":{"t1":"Ghost","t2":"Grass","bs":{"hp":55,"at":85,"df":122,"sa":58,"sd":75,"sp":99},"w":9.5,"ab":"Frisk"},"Gourgeist-Large":{"t1":"Ghost","t2":"Grass","bs":{"hp":75,"at":95,"df":122,"sa":58,"sd":75,"sp":69},"w":14,"ab":"Frisk"},"Gourgeist-Super":{"t1":"Ghost","t2":"Grass","bs":{"hp":85,"at":100,"df":122,"sa":58,"sd":75,"sp":54},"w":39,"ab":"Insomnia"},"Avalugg-Hisui":{"t1":"Ice","t2":"Rock","bs":{"hp":95,"at":127,"df":184,"sa":34,"sd":36,"sp":38},"w":262.4,"ab":"Strong Jaw"},"Decidueye-Hisui":{"t1":"Grass","t2":"Fighting","bs":{"hp":88,"at":112,"df":80,"sa":95,"sd":95,"sp":60},"w":37,"ab":"Scrappy"},"Mega Crabominable":{"t1":"Fighting","t2":"Ice","bs":{"hp":97,"at":157,"df":122,"sa":62,"sd":107,"sp":33},"w":252.8,"ab":"Iron Fist","isAlternateForme":true},"Lycanroc-Midnight":{"t1":"Rock","bs":{"hp":85,"at":115,"df":75,"sa":55,"sd":75,"sp":82},"w":25,"ab":"Vital Spirit"},"Lycanroc-Dusk":{"t1":"Rock","bs":{"hp":75,"at":117,"df":65,"sa":55,"sd":65,"sp":110},"w":25,"ab":"Tough Claws"},"Mega Drampa":{"t1":"Normal","t2":"Dragon","bs":{"hp":78,"at":85,"df":110,"sa":160,"sd":116,"sp":36},"w":240.5,"ab":"Berserk","isAlternateForme":true},"Morpeko-Hangry":{"t1":"Electric","t2":"Dark","bs":{"hp":58,"at":95,"df":58,"sa":70,"sd":58,"sp":97},"w":3,"isAlternateForme":true,"ab":"Hunger Switch"},"Basculegion-F":{"t1":"Water","t2":"Ghost","bs":{"hp":120,"at":92,"df":65,"sa":100,"sd":75,"sp":78},"w":110,"ab":"Adaptability"},"Maushold-Four":{"t1":"Normal","bs":{"hp":74,"at":75,"df":70,"sa":65,"sd":75,"sp":111},"w":2.8,"ab":"Technician"},"Mega Scovillain":{"t1":"Grass","t2":"Fire","bs":{"hp":65,"at":138,"df":85,"sa":138,"sd":85,"sp":75},"w":22,"ab":"Spicy Spray","isAlternateForme":true},"Palafin-Hero":{"t1":"Water","bs":{"hp":100,"at":160,"df":97,"sa":106,"sd":87,"sp":100},"w":97.4,"ab":"Zero to Hero","isAlternateForme":true},"Mega Glimmora":{"t1":"Rock","t2":"Poison","bs":{"hp":83,"at":90,"df":105,"sa":150,"sd":96,"sp":101},"w":77,"ab":"Adaptability","isAlternateForme":true},"Vileplume":{"t1":"Grass","t2":"Poison","bs":{"hp":75,"at":80,"df":85,"sa":110,"sd":90,"sp":50,"sl":100},"w":18.6,"ab":"Chlorophyll"},"Qwilfish":{"t1":"Water","t2":"Poison","bs":{"hp":65,"at":95,"df":85,"sa":55,"sd":55,"sp":85},"w":3.9,"ab":"Swift Swim"},"Sceptile":{"t1":"Grass","bs":{"hp":70,"at":85,"df":65,"sa":105,"sd":85,"sp":120},"w":52.2,"ab":"Overgrow","formes":["Sceptile","Mega Sceptile"]},"Blaziken":{"t1":"Fire","t2":"Fighting","bs":{"hp":80,"at":120,"df":70,"sa":110,"sd":70,"sp":80},"w":52,"ab":"Speed Boost","formes":["Blaziken","Mega Blaziken"]},"Swampert":{"t1":"Water","t2":"Ground","bs":{"hp":100,"at":110,"df":90,"sa":85,"sd":90,"sp":60},"w":81.9,"ab":"Torrent","formes":["Swampert","Mega Swampert"]},"Mawile":{"t1":"Steel","bs":{"hp":50,"at":85,"df":85,"sa":55,"sd":55,"sp":50},"w":11.5,"ab":"Intimidate","t2":"Fairy","formes":["Mawile","Mega Mawile"]},"Metagross":{"t1":"Steel","t2":"Psychic","bs":{"hp":80,"at":135,"df":130,"sa":95,"sd":90,"sp":70},"w":550,"ab":"Clear Body","formes":["Metagross","Mega Metagross"]},"Staraptor":{"t1":"Normal","t2":"Flying","bs":{"hp":85,"at":120,"df":70,"sa":50,"sd":60,"sp":100},"w":24.9,"ab":"Intimidate","formes":["Staraptor","Mega Staraptor"]},"Musharna":{"t1":"Psychic","bs":{"hp":116,"at":55,"df":85,"sa":107,"sd":95,"sp":29},"w":60.5,"ab":"Telepathy"},"Scolipede":{"t1":"Bug","t2":"Poison","bs":{"hp":60,"at":100,"df":89,"sa":55,"sd":69,"sp":112},"w":200.5,"ab":"Swarm","formes":["Scolipede","Mega Scolipede"]},"Scrafty":{"t1":"Dark","t2":"Fighting","bs":{"hp":65,"at":90,"df":115,"sa":45,"sd":115,"sp":58},"w":30,"ab":"Intimidate","formes":["Scrafty","Mega Scrafty"]},"Eelektross":{"t1":"Electric","bs":{"hp":85,"at":115,"df":80,"sa":105,"sd":80,"sp":50},"w":80.5,"ab":"Levitate","formes":["Eelektross","Mega Eelektross"]},"Pyroar":{"t1":"Fire","t2":"Normal","bs":{"hp":86,"at":68,"df":72,"sa":109,"sd":66,"sp":106},"w":81.5,"ab":"Unnerve","formes":["Pyroar","Mega Pyroar"]},"Malamar":{"t1":"Dark","t2":"Psychic","bs":{"hp":86,"at":92,"df":88,"sa":68,"sd":75,"sp":73},"w":47,"ab":"Contrary","formes":["Malamar","Mega Malamar"]},"Barbaracle":{"t1":"Rock","t2":"Water","bs":{"hp":72,"at":105,"df":115,"sa":54,"sd":86,"sp":68},"w":96,"ab":"Tough Claws","formes":["Barbaracle","Mega Barbaracle"]},"Dragalge":{"t1":"Poison","t2":"Dragon","bs":{"hp":65,"at":75,"df":90,"sa":97,"sd":123,"sp":44},"w":81.5,"ab":"Adaptability","formes":["Dragalge","Mega Dragalge"]},"Grimmsnarl":{"t1":"Dark","t2":"Fairy","bs":{"hp":95,"at":120,"df":65,"sa":95,"sd":75,"sp":60},"w":61,"ab":"Prankster"},"Falinks":{"t1":"Fighting","bs":{"hp":65,"at":100,"df":100,"sa":70,"sd":60,"sp":75},"w":62,"ab":"Defiant","formes":["Falinks","Mega Falinks"]},"Overqwil":{"t1":"Dark","t2":"Poison","bs":{"hp":85,"at":115,"df":95,"sa":65,"sd":65,"sp":85},"w":60.5,"ab":"Swift Swim"},"Houndstone":{"t1":"Ghost","bs":{"hp":72,"at":101,"df":100,"sa":50,"sd":97,"sp":68},"w":15,"ab":"Sand Rush"},"Annihilape":{"t1":"Fighting","t2":"Ghost","bs":{"hp":110,"at":115,"df":80,"sa":50,"sd":90,"sp":90},"w":56,"ab":"Defiant"},"Gholdengo":{"t1":"Steel","t2":"Ghost","bs":{"hp":87,"at":60,"df":95,"sa":133,"sd":91,"sp":84},"w":30,"ab":"Good as Gold"},"Mega Raichu X":{"t1":"Electric","bs":{"hp":60,"at":135,"df":95,"sa":90,"sd":95,"sp":110},"w":38,"ab":"Electric Surge","isAlternateForme":true},"Mega Raichu Y":{"t1":"Electric","bs":{"hp":60,"at":100,"df":55,"sa":160,"sd":80,"sp":130},"w":26,"ab":"No Guard","isAlternateForme":true},"Mega Sceptile":{"t1":"Grass","t2":"Dragon","bs":{"hp":70,"at":110,"df":75,"sa":145,"sd":85,"sp":145},"w":55.2,"ab":"Lightning Rod","isAlternateForme":true},"Mega Blaziken":{"t1":"Fire","t2":"Fighting","bs":{"hp":80,"at":160,"df":80,"sa":130,"sd":80,"sp":100},"w":52,"ab":"Speed Boost","isAlternateForme":true},"Mega Swampert":{"t1":"Water","t2":"Ground","bs":{"hp":100,"at":150,"df":110,"sa":95,"sd":110,"sp":70},"w":102,"ab":"Swift Swim","isAlternateForme":true},"Mega Mawile":{"t1":"Steel","t2":"Fairy","bs":{"hp":50,"at":105,"df":125,"sa":55,"sd":95,"sp":50},"w":23.5,"ab":"Huge Power","isAlternateForme":true},"Mega Metagross":{"t1":"Steel","t2":"Psychic","bs":{"hp":80,"at":145,"df":150,"sa":105,"sd":110,"sp":110},"w":942.9,"ab":"Tough Claws","isAlternateForme":true},"Mega Staraptor":{"t1":"Fighting","t2":"Flying","bs":{"hp":85,"at":140,"df":100,"sa":60,"sd":90,"sp":110},"w":50,"ab":"Contrary","isAlternateForme":true},"Mega Scolipede":{"t1":"Bug","t2":"Poison","bs":{"hp":60,"at":140,"df":149,"sa":75,"sd":99,"sp":62},"w":230.5,"ab":"Shell Armor","isAlternateForme":true},"Mega Scrafty":{"t1":"Dark","t2":"Fighting","bs":{"hp":65,"at":130,"df":135,"sa":55,"sd":135,"sp":68},"w":31,"ab":"Intimidate","isAlternateForme":true},"Mega Eelektross":{"t1":"Electric","bs":{"hp":85,"at":145,"df":80,"sa":135,"sd":90,"sp":80},"w":180,"ab":"Eelevate","isAlternateForme":true},"Mega Pyroar":{"t1":"Fire","t2":"Normal","bs":{"hp":86,"at":88,"df":92,"sa":129,"sd":86,"sp":126},"w":93.3,"ab":"Fire Mane","isAlternateForme":true},"Mega Malamar":{"t1":"Dark","t2":"Psychic","bs":{"hp":86,"at":102,"df":88,"sa":98,"sd":120,"sp":88},"w":69.8,"ab":"Contrary","isAlternateForme":true},"Mega Barbaracle":{"t1":"Rock","t2":"Fighting","bs":{"hp":72,"at":140,"df":130,"sa":64,"sd":106,"sp":88},"w":100,"ab":"Tough Claws","isAlternateForme":true},"Mega Dragalge":{"t1":"Poison","t2":"Dragon","bs":{"hp":65,"at":85,"df":105,"sa":132,"sd":163,"sp":44},"w":100.3,"ab":"Regenerator","isAlternateForme":true},"Mega Falinks":{"t1":"Fighting","bs":{"hp":65,"at":135,"df":135,"sa":70,"sd":65,"sp":100},"w":99,"ab":"Defiant","isAlternateForme":true}};
var GMAX_LIST = ["Charizard","Butterfree","Pikachu","Meowth","Machamp","Gengar","Kingler","Lapras","Eevee","Snorlax","Garbodor","Melmetal","Corviknight","Orbeetle","Drednaw","Coalossal","Flapple","Appletun","Sandaconda","Toxtricity","Centiskorch","Hatterene","Grimmsnarl","Alcremie","Copperajah","Duraludon","Venusaur","Blastoise","Rillaboom","Cinderace","Inteleon","Urshifu-Single Strike","Urshifu-Rapid Strike"];

/* ================= stat_data.js (unchanged: stat name constants + helpers) ================= */
var AT = "at", DF = "df", SA = "sa", SD = "sd", SP = "sp", SL = "sl";
var STATS_RBY = [AT, DF, SL, SP];
var STATS_GSC = [AT, DF, SA, SD, SP];

function CALC_HP_RBY(poke) {
    var hp = poke.find(".hp");
    var total;
    var base = ~~hp.find(".base").val();
    var level = ~~poke.find(".level").val();
    var dvs = ~~hp.find(".dvs").val();
    total = Math.floor(((base + dvs) * 2 + 63) * level / 100) + level + 10;
    hp.find(".total").text(total);
    poke.find(".max-hp").text(total);
    calcCurrentHP(poke, total, ~~poke.find(".percent-hp").val());
    updateHPBar(poke, ~~poke.find(".current-hp").val());
}

function CALC_STAT_RBY(poke, statName) {
    var stat = poke.find("." + statName);
    var level = ~~poke.find(".level").val();
    var base = ~~stat.find(".base").val();
    var dvs = ~~stat.find(".dvs").val();
    var total = Math.floor(((base + dvs) * 2 + 63) * level / 100) + 5;
    stat.find(".total").text(total);
}

function CALC_HP_ADV(poke) {
    var hp = poke.find(".hp");
    var total;
    var base = ~~hp.find(".base").val();
    if (base === 1) {
        total = 1;
    } else {
        var level = ~~poke.find(".level").val();
        var evs = ~~hp.find(".evs").val();
        var ivs = ~~hp.find(".ivs").val();
        total = Math.floor((base * 2 + ivs + Math.floor(evs / 4)) * level / 100) + level + 10;
    }
    if(poke.find(".max").prop("checked")) {        
        total *= 2;
    }
    hp.find(".total").text(total);
    poke.find(".max-hp").text(total);
    calcCurrentHP(poke, total, ~~poke.find(".percent-hp").val());
    updateHPBar(poke, ~~poke.find(".current-hp").val());
}

function CALC_STAT_ADV(poke, statName) {
    var stat = poke.find("." + statName);
    var level = ~~poke.find(".level").val();
    var base = ~~stat.find(".base").val();
    var evs = ~~stat.find(".evs").val();
    var ivs = ~~stat.find(".ivs").val();
    var natureMods = NATURES[poke.find(".nature").val()];
    var nature = natureMods[0] === statName ? 1.1 : natureMods[1] === statName ? 0.9 : 1;
    var total = Math.floor((Math.floor((base * 2 + ivs + Math.floor(evs / 4)) * level / 100) + 5) * nature);
    stat.find(".total").text(total);
}

function CALC_HP_LGPE(poke) {
    var hp = poke.find(".hp");
    var total;
    var base = ~~hp.find(".base").val();
    if (base === 1) {
        total = 1;
    } else {
        var level = ~~poke.find(".level").val();
        var avs = ~~hp.find(".avs").val();
        var ivs = ~~hp.find(".ivs").val();
        total = Math.floor((base * 2 + ivs) * level / 100) + level + 10 + avs;
    }
    hp.find(".total").text(total);
    poke.find(".max-hp").text(total);
    calcCurrentHP(poke, total, ~~poke.find(".percent-hp").val());
    updateHPBar(poke, ~~poke.find(".current-hp").val());
}

function CALC_STAT_LGPE(poke, statName) {
    var stat = poke.find("." + statName);
    var level = ~~poke.find(".level").val();
    var base = ~~stat.find(".base").val();
    var avs = ~~stat.find(".avs").val();
    var ivs = ~~stat.find(".ivs").val();
    var natureMods = NATURES[poke.find(".nature").val()];
    var nature = natureMods[0] === statName ? 1.1 : natureMods[1] === statName ? 0.9 : 1;
    var friendshipMod = ~~poke.find(".friendship").val();
    var friendship = 1 + (Math.floor(10 * friendshipMod / 255) / 100);
    var total = Math.floor((Math.floor((base * 2 + ivs) * level / 100) + 5) * nature * friendship) + avs;
    stat.find(".total").text(total);
}

function CALC_HP_CHAMP(poke) {
    var hp = poke.find(".hp");
    var total;
    var base = ~~hp.find(".base").val();
    if (base === 1) {
        total = 1;
    } else {
        var statPoints = ~~hp.find(".sps").val();
        total = Math.floor((base * 2 + 31) * 50 / 100) + 50 + 10 + statPoints;
    }
    if (poke.find(".max").prop("checked")) {
        total *= 2;
    }
    hp.find(".total").text(total);
    poke.find(".max-hp").text(total);
    calcCurrentHP(poke, total, ~~poke.find(".percent-hp").val());
    updateHPBar(poke, ~~poke.find(".current-hp").val());
}

function CALC_STAT_CHAMP(poke, statName) {
    var stat = poke.find("." + statName);
    var base = ~~stat.find(".base").val();
    var statPoints = ~~stat.find(".sps").val();
    var natureMods = NATURES[poke.find(".nature").val()];
    var nature = natureMods[0] === statName ? 1.1 : natureMods[1] === statName ? 0.9 : 1;
    var total = Math.floor(((Math.floor((base * 2 + 31) * 50 / 100) + 5) + statPoints) * nature);
    stat.find(".total").text(total);
}
/* ================= nature_data.js (unchanged) ================= */
var NATURES = {
    'Adamant':['at','sa'],
    'Bashful':['',''],
    'Bold':['df','at'],
    'Brave':['at','sp'],
    'Calm':['sd','at'],
    'Careful':['sd','sa'],
    'Docile':['',''],
    'Gentle':['sd','df'],
    'Hardy':['',''],
    'Hasty':['sp','df'],
    'Impish':['df','sa'],
    'Jolly':['sp','sa'],
    'Lax':['df','sd'],
    'Lonely':['at','df'],
    'Mild':['sa','df'],
    'Modest':['sa','at'],
    'Naive':['sp','sd'],
    'Naughty':['at','sd'],
    'Quiet':['sa','sp'],
    'Quirky':['',''],
    'Rash':['sa','sd'],
    'Relaxed':['df','sp'],
    'Sassy':['sd','sp'],
    'Serious':['',''],
    'Timid':['sp','at']
};

/* ================= item helper functions (from item_data.js) ================= */
function getItemBoostType(item) {
    switch (item) {
        case 'Draco Plate':
        case 'Dragon Fang':
            return 'Dragon';
        case 'Dread Plate':
        case 'BlackGlasses':
        case 'Black Glasses':
            return 'Dark';
        case 'Earth Plate':
        case 'Soft Sand':
            return 'Ground';
        case 'Fist Plate':
        case 'Black Belt':
            return 'Fighting';
        case 'Flame Plate':
        case 'Charcoal':
            return 'Fire';
        case 'Icicle Plate':
        case 'NeverMeltIce':
        case 'Never-Melt Ice':
            return 'Ice';
        case 'Insect Plate':
        case 'SilverPowder':
        case 'Silver Powder':
            return 'Bug';
        case 'Iron Plate':
        case 'Metal Coat':
            return 'Steel';
        case 'Meadow Plate':
        case 'Rose Incense':
        case 'Miracle Seed':
            return 'Grass';
        case 'Mind Plate':
        case 'Odd Incense':
        case 'TwistedSpoon':
        case 'Twisted Spoon':
            return 'Psychic';
        case 'Pixie Plate':
        case 'Fairy Feather':
            return 'Fairy';
        case 'Sky Plate':
        case 'Sharp Beak':
            return 'Flying';
        case 'Splash Plate':
        case 'Sea Incense':
        case 'Wave Incense':
        case 'Mystic Water':
            return 'Water';
        case 'Spooky Plate':
        case 'Spell Tag':
            return 'Ghost';
        case 'Stone Plate':
        case 'Rock Incense':
        case 'Hard Stone':
            return 'Rock';
        case 'Toxic Plate':
        case 'Poison Barb':
            return 'Poison';
        case 'Zap Plate':
        case 'Magnet':
            return 'Electric';
        case 'Silk Scarf':
        case 'Pink Bow':
        case 'Polkadot Bow':
            return 'Normal';
        default:
            return '';
    }
}

function getItemDualTypeBoost(item, species) {
    switch (item) {
        case 'Adamant Orb':
            if (species === 'Dialga') return 'Steel Dragon';
        case 'Lustrous Orb':
            if (species === 'Palkia') return 'Water Dragon';
        case 'Griseous Orb':
            if ((species === 'Giratina-Origin' && gen <= 8) || (species === 'Giratina' && gen >= 9)) return 'Ghost Dragon';
        case 'Soul Dew':
            if ((species === 'Latias' || species === 'Latios') && gen >= 7) return 'Dragon Psychic';
        case 'Adamant Crystal':
            if (species === 'Dialga-Origin') return 'Steel Dragon';
        case 'Lustrous Globe':
            if (species === 'Palkia-Origin') return 'Water Dragon';
        case 'Griseous Core':
            if (species === 'Giratina-Origin') return 'Ghost Dragon';
        default:
            return '';
    }
}

function getBerryResistType(berry) {
    switch (berry) {
        case 'Chilan Berry':
            return 'Normal';
        case 'Occa Berry':
            return 'Fire';
        case 'Passho Berry':
            return 'Water';
        case 'Wacan Berry':
            return 'Electric';
        case 'Rindo Berry':
            return 'Grass';
        case 'Yache Berry':
            return 'Ice';
        case 'Chople Berry':
            return 'Fighting';
        case 'Kebia Berry':
            return 'Poison';
        case 'Shuca Berry':
            return 'Ground';
        case 'Coba Berry':
            return 'Flying';
        case 'Payapa Berry':
            return 'Psychic';
        case 'Tanga Berry':
            return 'Bug';
        case 'Charti Berry':
            return 'Rock';
        case 'Kasib Berry':
            return 'Ghost';
        case 'Haban Berry':
            return 'Dragon';
        case 'Colbur Berry':
            return 'Dark';
        case 'Babiri Berry':
            return 'Steel';
        case 'Roseli Berry':
            return 'Fairy';
        default:
            return '';
    }
}

function getFlingPower(item) {
    isInt = parseInt(item);
    return isNaN(isInt) ?
        (item === 'Iron Ball' || (item === 'Big Nugget' && gen >= 8) || (gen == 4 && item === 'Klutz Iron Ball') ? 130
            : ['Hard Stone', 'Room Service'].indexOf(item) !== -1 ? 100
                : item.indexOf('Plate') !== -1 || ['Deep Sea Tooth', 'Thick Club', 'Grip Claw'].indexOf(item) !== -1 ? 90
                    : (item.indexOf('ite') !== -1 && item == 'Eviolite') || ['Assault Vest', 'Weakness Policy', 'Blunder Policy',
                        'Heavy-Duty Boots', 'Quick Claw', 'Razor Claw', 'Safety Goggles'].indexOf(item) !== -1 ? 80
                        : ['Poison Barb', 'Dragon Fang', 'Power Anklet', 'Power Band', 'Power Belt', 'Power Bracer', 'Power Lens',
                            'Power Weight', 'Burn Drive', 'Chill Drive', 'Douse Drive', 'Shock Drive'].indexOf(item) !== -1 ? 70
                            : ['Adamant Orb', 'Lustrous Orb', 'Macho Brace', 'Leek', 'Rocky Helmet', 'Utility Umbrella', 'Terrain Extender',
                                'Damp Rock', 'Heat Rock'].indexOf(item) !== -1 ? 60
                                : item.indexOf('Memory') !== -1 || ['Sharp Beak', 'Eject Pack'].indexOf(item) !== -1 ? 50
                                    : ['Eviolite', 'Icy Rock', 'Lucky Punch'].indexOf(item) !== -1 ? 40
                                        : ['Black Belt', 'Black Sludge', 'Black Glasses', 'Charcoal', 'Deep Sea Scale', 'Flame Orb', "King's Rock",
                                            'Life Orb', 'Light Ball', 'Magnet', 'Metal Coat', 'Miracle Seed', 'Mystic Water', 'Never-Melt Ice',
                                            'Razor Fang', 'Soul Dew', 'Spell Tag', 'Toxic Orb', 'Twisted Spoon', 'Absorb Bulb', 'Adrenaline Orb',
                                            'Berry Juice', 'Binding Band', 'Eject Button', 'Float Stone', 'Light Clay', 'Luminous Moss',
                                            'Metronome', 'Protective Pads', 'Shell Bell', 'Throat Spray', 'Covert Cloak', 'Loaded Dice',
                                            'Ability Shield', 'Booster Energy', 'Clear Amulet', 'Punching Glove', 'Big Nugget'].indexOf(item) !== -1 ? 30
                                            : 10)
        : isInt;
}

function getNaturalGift(item) {
    var gift = {
        'Aguav Berry': { 't': 'Dragon', 'p': 80 },
        'Apicot Berry': { 't': 'Ground', 'p': 100 },
        'Aspear Berry': { 't': 'Ice', 'p': 80 },
        'Babiri Berry' : {'t':'Steel','p':80},
        'Belue Berry': { 't': 'Electric', 'p': 100 },
        'Bluk Berry': { 't': 'Fire', 'p': 90 },
        'Charti Berry': { 't': 'Rock', 'p': 80 },
        'Cheri Berry': { 't': 'Fire', 'p': 80 },
        'Chesto Berry' : {'t':'Water','p':80},
        'Chilan Berry' : {'t':'Normal','p':80},
        'Chople Berry' : {'t':'Fighting','p':80},
        'Coba Berry' : {'t':'Flying','p':80},
        'Colbur Berry': { 't': 'Dark', 'p': 80 },
        'Cornn Berry': { 't': 'Bug', 'p': 90 },
        'Custap Berry' : {'t':'Ghost','p':100},
        'Durin Berry' : {'t':'Water','p':100},
        'Enigma Berry': { 't': 'Bug', 'p': 100 },
        'Figy Berry': { 't': 'Bug', 'p': 80 },
        'Ganlon Berry': { 't': 'Ice', 'p': 100 },
        'Grepa Berry': { 't': 'Flying', 'p': 90 },
        'Haban Berry': { 't': 'Dragon', 'p': 80 },
        'Hondew Berry': { 't': 'Ground', 'p': 90 },
        'Iapapa Berry': { 't': 'Dark', 'p': 80 },
        'Jaboca Berry' : {'t':'Dragon','p':100},
        'Kasib Berry' : {'t':'Ghost','p':80},
        'Kebia Berry' : {'t':'Poison','p':80},
        'Kee Berry' : {'t':'Fairy','p':100},
        'Lansat Berry' : {'t':'Flying','p':100},
        'Leppa Berry' : {'t':'Fighting','p':80},
        'Liechi Berry' : {'t':'Grass','p':100},
        'Lum Berry': { 't': 'Flying', 'p': 80 },
        'Mago Berry': { 't': 'Ghost', 'p': 80 },
        'Magost Berry': { 't': 'Rock', 'p': 90 },
        'Maranga Berry' : {'t':'Dark','p':100},
        'Micle Berry': { 't': 'Rock', 'p': 100 },
        'Nanab Berry': { 't': 'Water', 'p': 90 },
        'Nomel Berry': { 't': 'Dragon', 'p': 90 },
        'Occa Berry' : {'t':'Fire','p':80},
        'Oran Berry': { 't': 'Poison', 'p': 80 },
        'Pamtre Berry': { 't': 'Steel', 'p': 90 },
        'Passho Berry' : {'t':'Water','p':80},
        'Payapa Berry': { 't': 'Psychic', 'p': 80 },
        'Pecha Berry': { 't': 'Electric', 'p': 80 },
        'Persim Berry': { 't': 'Ground', 'p': 80 },
        'Petaya Berry': { 't': 'Poison', 'p': 100 },
        'Pinap Berry': { 't': 'Grass', 'p': 90 },
        'Pomeg Berry': { 't': 'Ice', 'p': 90 },
        'Qualot Berry': { 't': 'Poison', 'p': 90 },
        'Rabuta Berry': { 't': 'Ghost', 'p': 90 },
        'Rawst Berry': { 't': 'Grass', 'p': 80 },
        'Razz Berry': { 't': 'Steel', 'p': 80 },
        'Rindo Berry' : {'t':'Grass','p':80},
        'Roseli Berry' : {'t':'Fairy','p':80},
        'Rowap Berry' : {'t':'Dark','p':100},
        'Salac Berry' : {'t':'Fighting','p':100},
        'Shuca Berry' : {'t':'Ground','p':80},
        'Sitrus Berry': { 't': 'Psychic', 'p': 80 },
        'Spelon Berry': { 't': 'Dark', 'p': 90 },
        'Starf Berry': { 't': 'Psychic', 'p': 100 },
        'Tamato Berry': { 't': 'Psychic', 'p': 90 },
        'Tanga Berry' : {'t':'Bug','p':80},
        'Wacan Berry' : {'t':'Electric','p':80},
        'Watmel Berry': { 't': 'Fire', 'p': 100 },
        'Wepear Berry': { 't': 'Electric', 'p': 90 },
        'Wiki Berry': { 't': 'Rock', 'p': 80 },
        'Yache Berry' : {'t':'Ice','p':80}
    }[item];
    if (gift) {
        if (gen < 6) {
            gift.p -= 20;
        }
        return gift;
    }
    return {'t':'Normal','p':1};


}

function getMemoryType(item) {
    switch (item) {
        case 'Bug Memory': return 'Bug';
        case 'Dark Memory': return 'Dark';
        case 'Dragon Memory': return 'Dragon';
        case 'Electric Memory': return 'Electric';
        case 'Fairy Memory': return 'Fairy';
        case 'Fighting Memory': return 'Fighting';
        case 'Fire Memory': return 'Fire';
        case 'Flying Memory': return 'Flying';
        case 'Ghost Memory': return 'Ghost';
        case 'Grass Memory': return 'Grass';
        case 'Ground Memory': return 'Ground';
        case 'Ice Memory': return 'Ice';
        case 'Poison Memory': return 'Poison';
        case 'Psychic Memory': return 'Psychic';
        case 'Rock Memory': return 'Rock';
        case 'Steel Memory': return 'Steel';
        case 'Water Memory': return 'Water';
    }
}

function getZType(item) {
    switch (item) {
        case 'Buginium Z': return 'Bug';
        case 'Darkinium Z': return 'Dark';
        case 'Dragonium Z': return 'Dragon';
        case 'Electrium Z': return 'Electric';
        case 'Fairium Z': return 'Fairy';
        case 'Fightinium Z': return 'Fighting';
        case 'Firium Z': return 'Fire';
        case 'Flyinium Z': return 'Flying';
        case 'Ghostium Z': return 'Ghost';
        case 'Grassium Z': return 'Grass';
        case 'Groundium Z': return 'Ground';
        case 'Icium Z': return 'Ice';
        case 'Poisonium Z': return 'Poison';
        case 'Psychium Z': return 'Psychic';
        case 'Rockium Z': return 'Rock';
        case 'Steelium Z': return 'Steel';
        case 'Waterium Z': return 'Water';
        default: return '';
    }
}

function canMega(item, species) {
    return item in MEGA_STONE_USER_LOOKUP && MEGA_STONE_USER_LOOKUP[item].includes(species);
}

function getSignatureZMove(item, species, move) {
    var isSigZ = item in SIGNATURE_Z_MOVE_LOOKUP && SIGNATURE_Z_MOVE_LOOKUP[item]['user'].includes(species) && move == SIGNATURE_Z_MOVE_LOOKUP[item]['move']
        ? SIGNATURE_Z_MOVE_LOOKUP[item]['zMove'] : -1;
    return isSigZ;
}

function cantRemoveItem(defItem, defSpecies, terrain) {
    return defItem === null || defItem === "" || defItem.indexOf("ium Z") !== -1
        || LOCK_ITEM_LOOKUP[defSpecies] === defItem
        || (defSpecies === "Arceus" && defItem.indexOf(" Plate") !== -1)
        || (defSpecies === "Genesect" && defItem.indexOf(" Drive") !== -1)
        || (defSpecies === "Silvally" && defItem.indexOf(" Memory") !== -1);
}

function cantFlingItem(atItem, atSpecies, defAbility) {
    return atItem === "" || atItem === 'Klutz' || atItem.indexOf(" Gem") !== -1 || atItem.indexOf(" ium Z") !== -1 || ["Red Orb", "Blue Orb", "Rusted Sword", "Rusted Shield"].indexOf(atItem) !== -1
        || (atSpecies === 'Giratina-Origin' && atItem === "Griseous Orb")
        || (atSpecies === 'Arceus' && atItem.indexOf(" Plate") !== -1)
        || (atSpecies === 'Genesect' && atItem.indexOf(" Drive") !== -1)
        || (atSpecies === 'Silvally' && atItem.indexOf(" Memory") !== -1)
        || canMega(atItem, atSpecies)
        || (["As One", "Unnerve"].indexOf(defAbility) !== -1 && atItem.indexOf(" Berry") !== -1);
}

/* ================= from ap_calc.js: shared helper ================= */
/* damage_MASTER.js reassigns hasType on the combatants it builds for
   multi-hit moves (Triple Axel), but the function itself lives in ap_calc.js,
   which is otherwise all DOM code. Without it Triple Axel throws. */
var setHasTypeFunc = function (...types) {
    for (const type of types) {
        if ([this.type1, this.type2].includes(type)) {
            return true;
        }
    }
    return false;
};

/* ================= damage_MASTER.js (unchanged) ================= */
/* Damage calculation for the Generation VIII games: Sword, Shield, Isle of Armor, and Crown Tundra; 
 * and for the Generation VII games: Sun, Moon, Ultra Sun, and Ultra Moon*/

function GET_DAMAGE_HANDLER(attacker, defender, move, field) {
    switch (gen) {
        case 1:
            return CALCULATE_DAMAGE_RBY(attacker, defender, move, field);
        case 2:
            return CALCULATE_DAMAGE_GSC(attacker, defender, move, field);
        case 3:
            return CALCULATE_DAMAGE_ADV(attacker, defender, move, field);
        case 4:
            return CALCULATE_DAMAGE_DPP(attacker, defender, move, field);
        case 5:
        case 6:
            return GET_DAMAGE_XY(attacker, defender, move, field);
        case 7:
        case 8:
        case 9:
        case 10:
            return GET_DAMAGE_SV(attacker, defender, move, field);
        default:
            return -1;
    }
}

function numericSort(a, b) {
    return a - b;
}

function buildDescription(description) {
    var output = "";
    if (description.attackBoost) {
        if (description.attackBoost > 0) {
            output += "+";
        }
        output += description.attackBoost + " ";
    }
    if (description.redItem) {
        output += "Red Item-boosted ";
    }
    if (description.attackerLevel) {
        output = output + 'Lv. ' + description.attackerLevel + ' ';
    }
    if (!description.usesOppAtkStat) {
        output = appendIfSet(output, description.attackEVs);
    }
    output = appendIfSet(output, description.attackerItem);
    output = appendIfSet(output, description.attackerAbility);
    if (description.ruinSwordBeads) {
        output += description.ruinSwordBeads + " of Ruin ";
    }
    if (description.attackerTera) {
        output += "Tera-" + description.attackerTera + " ";
    }
    if (description.isBurned) {
        output += "burned ";
    }
    output += description.attackerName + " ";
    if (description.isHelpingHand) {
        output += "Helping Hand ";
    }
    if (description.isPowerSpot) {
        output += "Power Spot ";
    }
    if (description.isBattery) {
        output += "Battery ";
    }
    if (description.isSteelySpirit) {
        output += "Ally Steely Spirit ";
    }
    if (description.isFlowerGiftAtk) {
        output += "Flower Gift ";
    }
    if (description.meFirst) {
        output += "Me First ";
    }
    if (description.charged) {
        output += "Charged ";
    }
    output += description.moveName + " ";
    if (description.moveBP && description.moveType) {
        output += "(" + description.moveBP + " BP " + description.moveType + ") ";
    } else if (description.moveBP) {
        output += "(" + description.moveBP + " BP) ";
    } else if (description.moveType) {
        output += "(" + description.moveType + ") ";
    }
    if (description.hits) {
        output += "(" + description.hits + " hits) ";
    }
    if (description.courseDriftSE) {
        output += "(Super Effective) ";
    }
    if (description.teraBPBoost) {
        output += "(Tera 60 BP Boost) ";
    }
    if (description.maskBoost) {
        output += "(1.2x Mask Boost) ";
    }
    if (description.stellarBoost) {
        output += "(1st Use) ";
    }
    output += "vs. ";
    if (description.defenseBoost) {
        if (description.defenseBoost > 0) {
            output += "+";
        }
        output += description.defenseBoost + " ";
    }
    if (description.blueItem) {
        output += "Blue Item-boosted ";
    }
    if (description.defenderLevel) {
        output = output + 'Lv. ' + description.defenderLevel + ' ';
    }
    output = appendIfSet(output, description.HPEVs);
    if (description.usesOppAtkStat && description.attackEVs) {
        output += "/ " + description.attackEVs + " ";
    }
    if (description.defenseEVs) {
        output += "/ " + description.defenseEVs + " ";
    }
    if (description.isForesight) {
        output += "revealed ";
    }
    output = appendIfSet(output, description.defenderItem);
    if (description.isFlowerGiftSpD) {
        output += " Flower Gift ";
    }
    output = appendIfSet(output, description.defenderAbility);
    if (description.ruinTabletsVessel) {
        output += description.ruinTabletsVessel + " of Ruin ";
    }
    if (description.isDynamax) output += " Dynamax ";
    if (description.defenderTera) {
        output += "Tera-" + description.defenderTera + " ";
    }
    output += description.defenderName;
    if (description.weather && description.terrain) {
        output += " in " + description.weather + " and " + description.terrain + " Terrain";
    }
    else if (description.weather) {
        output += " in " + description.weather;
    } else if (description.terrain) {
        output += " in " + description.terrain + " Terrain";
    }
    if (description.isAuroraVeil) {
        output += " through Aurora Veil";
    } else if (description.isReflect) {
        output += " through Reflect";
    } else if (description.isLightScreen) {
        output += " through Light Screen";
    }
    if (description.isCritical) {
        output += " on a critical hit";
    }
    if (description.isGravity) {
        output += " under Gravity";
    }
    if (description.isGlaiveMod) {
        output += " after using Glaive Rush";
    }
    if (description.isFriendGuard) {
        output += " with Friend Guard";
    }
    if (description.isQuarteredByProtect) {
        output += " through Protect";
    }
    if (description.isMechanicsTest) {
        output += " with custom modifiers";
    }

    return output;
}

function appendIfSet(str, toAppend) {
    if (toAppend) {
        return str + toAppend + " ";
    }
    return str;
}

function toSmogonStat(stat) {
    return stat === AT ? "Atk"
            : stat === DF ? "Def"
            : stat === SA ? "SpA"
            : stat === SD ? "SpD"
            : stat === SP ? "Spe"
            : "wtf";
}

function chainMods(mods) {
    var M = 0x1000;
    for(var i = 0; i < mods.length; i++) {
        if(mods[i] !== 0x1000) {
            M = Math.round((M * mods[i]) / 0x1000);
        }
    }
    return M;
}

function addLevelDesc(attacker, defender, description) {
    autoLevel = $('#douswitch').is(':checked') || gen == 10 ? 50 : 100;
    if (attacker.level !== autoLevel)
        description.attackerLevel = attacker.level;
    if (defender.level !== autoLevel)
        description.defenderLevel = defender.level;
}

function getMoveEffectiveness(move, type1, type2, description, isForesight, isScrappy, isGravity, defItem, isStrongWinds, defIsTera, isTeraShell) {
    var type1Effect = getSingleTypeEffectiveness(move, type1, description, isForesight, isScrappy, isGravity, defItem, isStrongWinds);
    var type2Effect = type2 && type2 != type1 ? getSingleTypeEffectiveness(move, type2, description, isForesight, isScrappy, isGravity, defItem, isStrongWinds) : 1;
    var typeEffectiveness = type1Effect * type2Effect;
    var usesTeraShell = isTeraShell && typeEffectiveness > 0.5;
    var effectiveOverride = overrideTypeEffectiveness(move, [type1, type2].includes("Flying"), defItem, isGravity, defIsTera, usesTeraShell);
    if (effectiveOverride != -1) {
        typeEffectiveness = effectiveOverride;
        if (usesTeraShell) {
            description.attackerAbility = "Tera Shell";
        }
    }
    if (gen == 9.5) {
        typeEffectiveness = additionalTypeEffectModsLegendsZA(move, typeEffectiveness, description);
    }
    return typeEffectiveness;
}

function getSingleTypeEffectiveness(move, type, description, isForesight, isScrappy, isGravity, defItem, isStrongWinds) {
    if ((isForesight || isScrappy) && type === "Ghost" && (["Normal", "Fighting"].includes(move.type))) {
        if (isScrappy)
            description.attackerAbility = isScrappy;
        else
            description.isForesight = true;
        return 1;
    }
    else if ((isGravity || defItem == "Iron Ball") && type === "Flying" && move.type === "Ground") {
        if (isGravity)
            description.isGravity = true;
        else if (defItem == "Iron Ball")
            description.defenderItem = "Iron Ball";
        return 1;
    }
    else if (move.name === "Freeze-Dry" && type === "Water") {
        return 2;
    }
    else if (move.name === "Nihil Light" && type === "Fairy") {
        return 1;
    }
    else {
        var effectiveness = typeChart[move.type][type];
        if (isStrongWinds && type == "Flying" && effectiveness > 1) {
            effectiveness = 1;
        }
        else if (defItem == "Ring Target" && effectiveness == 0) {
            description.defenderItem = "Ring Target";
            effectiveness = 1;
        }
        if (move.name === "Flying Press") {
            effectiveness *= typeChart["Flying"][type];
        }
        return effectiveness;
    }
}
function overrideTypeEffectiveness(move, defIsFlyingType, defItem, isGravity, defIsTera, usesTeraShell) {
    if (usesTeraShell) {
        return 0.5;
    }
    else if (move.type == "Stellar" && defIsTera) {
        return 2;
    }
    else if (defIsFlyingType && move.type === "Ground" && (move.name == "Thousand Arrows" || defItem == "Iron Ball") && !isGravity && gen >= 5) {
        return 1;
    }
    else {
        return -1;
    }
}

function additionalTypeEffectModsLegendsZA(move, typeEffectiveness, description) {
    if (typeEffectiveness < 0) {
        typeEffectiveness = typeEffectiveness * 1.2;
    }
    if (move.isPlusMove) {
        if (typeEffectiveness <= 1) {
            typeEffectiveness = typeEffectiveness * 1.2;
        }
        else {
            typeEffectiveness = typeEffectiveness * 1.3;
        }
        description.moveName += '+';
    }
    return typeEffectiveness;
}

function getModifiedStat(stat, mod) {
    return mod > 0 ? Math.floor(stat * (2 + mod) / 2)
            : mod < 0 ? Math.floor(stat * 2 / (2 - mod))
            : stat;
}

function getHPInfo(description, defender) {
    description.HPEVs = gen < 10 ? defender.HPEVs + " HP " + (defender.HPIVs < 31 ? defender.HPIVs + " IVs" : "") : resultDisplayMode == "SPs" ? defender.HPSPs + " HP " : resultDisplayMode == "EVs" ? (Math.max(0, defender.HPSPs * 8 - 4)) + " HP " : defender.HPraw + " HP ";
}

//Speed Mods
function getFinalSpeed(pokemon, weather, tailwind, swamp, terrain) {

    //1. Speed boosts and drops
    var speed = getModifiedStat(pokemon.rawStats[SP], pokemon.boosts[SP]);
    //2. Other Speed mods
    var otherSpeedMods = 1;
    //a. Scarf
    if (pokemon.item === "Choice Scarf" && !pokemon.isDynamax) {
        otherSpeedMods *= 1.5;
    } //b. Macho Brace, Iron Ball, Power items
    else if (["Macho Brace", "Iron Ball", "Power Anklet", "Power Band", "Power Belt", "Power Bracer", "Power Lens", "Power Weight", "Klutz Iron Ball"].indexOf(pokemon.item) !== -1) {
        otherSpeedMods *= 0.5;
    } //c. Quick Powder
    else if (pokemon.name === "Ditto" && pokemon.item === "Quick Powder") {
        otherSpeedMods *= 2;
    }
    //d. Quick Feet
    if (pokemon.ability === "Quick Feet" && pokemon.status !== "Healthy")
    {
        otherSpeedMods *= 1.5;
    } //e. Slow Start
    else if (pokemon.ability === "Slow Start")
    {
        otherSpeedMods *= 0.5;
    } //f. 2x Abilities
    else if ((((pokemon.ability === "Chlorophyll" && weather.indexOf("Sun") > -1) ||
            (pokemon.ability === "Swift Swim" && weather.indexOf("Rain") > -1)) && pokemon.item !== 'Utility Umbrella') ||
            (pokemon.ability === "Sand Rush" && weather === "Sand") ||
            (pokemon.ability === "Slush Rush" && ["Hail", "Snow"].indexOf(weather) > -1) ||
            (pokemon.ability === "Surge Surfer" && terrain === "Electric") ||
            (pokemon.ability === "Unburden" && pokemon.item === "")) {
        otherSpeedMods *= 2;
    }
    //g. Tailwind
    if (tailwind) otherSpeedMods *= 2;
    //h. Grass/Water Pledge Swamp
    if (swamp) otherSpeedMods *= 0.25;
    //i. Protosynthesis, Quark Drive
    if (pokemon.paradoxAbilityBoost && pokemon.highestStat === 'sp')
        otherSpeedMods *= 1.5;

    speed = pokeRound(speed * otherSpeedMods);

    //3. Paralysis
    if (pokemon.status === "Paralyzed" && pokemon.ability !== "Quick Feet") {
        if (gen >= 7)
            speed = Math.floor(speed / 2);
        else speed = Math.floor(speed / 4);
    }
    //4. 65536 Speed check
    if (speed > 65535) { speed %= 65536; }
    //5. 10000 Speed check
    if (speed > 10000) { speed = 10000; }
    return speed;
}

//Currently used for determining Protosynthesis/Quark Drive boost, may be expanded upon depending on future releases
function setHighestStat(pokemon, pPosition) {
    if (pokemon.highestStat == -1) {
        allStats = [pokemon.stats[AT], pokemon.stats[DF], pokemon.stats[SA], pokemon.stats[SD], pokemon.stats[SP]];
        pokemon.highestStat = allStats.indexOf(Math.max(...allStats));
    }
    lastHighestStat[pPosition] = pokemon.highestStat;
    pokemon.highestStat = pokemon.highestStat == 0 ? 'at'
        : pokemon.highestStat == 1 ? 'df'
            : pokemon.highestStat == 2 ? 'sa'
                : pokemon.highestStat == 3 ? 'sd'
                    : pokemon.highestStat == 4 ? 'sp'
                        : 'oh dear this should not happen';
}

function usesPhysicalAttack(attacker, defender, move) {
    var userStatsMove = move.name == "Photon Geyser" || move.name == "Light That Burns the Sky"
        || (move.name == "Tera Blast" && attacker.isTerastalize) || (move.name == "Tera Starstorm" && attacker.name == "Terapagos-Stellar");
    var smartMove = move.name == "Shell Side Arm";

    return (userStatsMove && attacker.stats[AT] > attacker.stats[SA]) || (smartMove && (attacker.stats[AT] / defender.stats[DF]) > (attacker.stats[SA] / defender.stats[SD]));
}

function checkTrace(source, target) {
    var cannotCopy = ["As One", "Battle Bond", "Comatose", "Commander", "Disguise", "Flower Gift", "Forecast", "Gulp Missile",
        "Ice Face", "Illusion", "Imposter", "Multitype", "Power of Alchemy", 'Protosynthesis', 'Quark Drive', "Receiver", "RKS System", "Schooling",
        "Shields Down", "Stance Change", "Trace", "Wonder Guard", "Zen Mode", "Zero to Hero"];
    if (gen <= 4) {
        if (gen == 3) {
            cannotCopy.splice(cannotCopy.indexOf('Forecast'), 1);
            cannotCopy.splice(cannotCopy.indexOf('Trace'), 1);
        }
        else cannotCopy.splice(cannotCopy.indexOf('Flower Gift'), 1);
    }
    if (source.ability === "Trace" && source.abilityOn && cannotCopy.indexOf(target.ability) === -1 && source.item !== "Ability Shield") {
        source.ability = target.ability;
    }
}

function checkNeutralGas(p1, p2, isNGas) {
    var cannotSupress = ['As One', 'Battle Bond', 'Comatose', 'Disguise', 'Gulp Missile', 'Ice Face', 'Multitype',
        'Power Construct', 'RKS System', 'Schooling', 'Shields Down', 'Stance Change', 'Tera Shift', 'Zen Mode', 'Zero to Hero'];
    if (isNGas) {
        if (cannotSupress.indexOf(p1.ability) == -1 && p1.item !== 'Ability Shield') p1.ability = '';
        if (cannotSupress.indexOf(p2.ability) == -1 && p2.item !== 'Ability Shield') p2.ability = '';
    }
}
function checkAirLock(pokemon, field) {
    if (['Air Lock', 'Cloud Nine'].indexOf(pokemon.ability) !== -1) {
        field.clearWeather();
    }
}
function checkForecast(pokemon, weather) {
    if (pokemon.ability === "Forecast" && pokemon.name === "Castform") {
        if (weather.indexOf("Sun") > -1) {
            pokemon.type1 = "Fire";
        } else if (weather.indexOf("Rain") > -1) {
            pokemon.type1 = "Water";
        } else if (["Hail", "Snow"].indexOf(weather) > -1) {
            pokemon.type1 = "Ice";
        } else {
            pokemon.type1 = "Normal";
        }
        pokemon.type2 = "";
    }
}
function checkMimicry(pokemon, terrain) {
    if (pokemon.ability === "Mimicry" && terrain !== "") {
        pokemon.type1 = terrain === "Electric" ? 'Electric'
            : terrain === "Grassy" ? 'Grass'
                : terrain === "Misty" ? 'Fairy'
                    : 'Psychic';
        pokemon.type2 = '';
    }
}
function checkTerastal(pokemon) {
    if (pokemon.isTerastalize && pokemon.tera_type !== 'Stellar') {
        pokemon.teraSTAB1 = pokemon.type1;
        pokemon.teraSTAB2 = pokemon.type2;
        pokemon.type1 = pokemon.tera_type;
        pokemon.type2 = '';
    }
}

function checkKlutz(pokemon) {
    if (pokemon.ability === "Klutz") {
        if (['Macho Brace', 'Power Anklet', 'Power Band', 'Power Belt', 'Power Bracer', 'Power Lens', 'Power Weight'].indexOf(pokemon.item) === -1) {
            if (gen == 4) {
                if (pokemon.item === 'Iron Ball') {
                    pokemon.item = "Klutz Iron Ball";
                }
                else {
                    pokemon.item = getFlingPower(pokemon.item).toString();
                }
            }
            else {
                pokemon.item = "Klutz";
            }
        }
    }
}

//UNUSED CURRENTLY
function checkWhiteHerb(pokemon) {
    if (pokemon.item === 'White Herb') {
        var boostsLen = pokemon.boosts.length;
        for (i = 0; i < boostsLen; i++) {
            if (pokemon.boosts[i] < 0) {
                pokemon.boosts[i] = 0;
            }
        }
        pokemon.item = '';
    }
}

function checkSeeds(pokemon, terrain) {
    if (pokemon.item === terrain + ' Seed') {
        if (['Electric', 'Grassy'].indexOf(terrain) !== -1)
            pokemon.boosts[DF] = Math.min(6, pokemon.boosts[DF] + 1);
        else
            pokemon.boosts[SD] = Math.min(6, pokemon.boosts[SD] + 1);
        pokemon.item = '';
    }
}

function checkParadoxAbilities(pokemon, terrain, weather) {
    if (['Protosynthesis', 'Quark Drive'].indexOf(pokemon.ability) !== -1) {
        if ((pokemon.ability === 'Protosynthesis' && weather === 'Sun')
            || (pokemon.ability === 'Quark Drive' && terrain === 'Electric')
            || (manualProtoQuark && pokemon.item !== 'Booster Energy'))
            pokemon.paradoxAbilityBoost = true;
        else if (pokemon.item === 'Booster Energy') {
            pokemon.paradoxAbilityBoost = true;
            pokemon.item = '';
        }
    }
}

/**
 * Handles all stat boost changes (Unused currently)
 * @param {any} interactionArray list of all mons involved. If its length is only 1, then it's a self-targetting boost.
 * @param {any} stat the stat affected. Only supports a single stat as is implemented currently, may change in the future.
 * @param {any} numStages number of intended stages to boost/drop the stat. The function will adjust actual number of stages.
 * @returns
 */
function changeStatBoosts(interactionArray, stat, numStages) {
    var isNotSelf = interactionArray.length == 2;
    var source = interactionArray[0], target = isNotSelf ? interactionArray[1] : interactionArray[0];
    if (target.ability == 'Mirror Armor' && isNotSelf && numStages < 0) {
        var mirrorSwitch = source;
        source = target;
        target = mirrorSwitch;
    }
    var statMultiplier = target.ability == 'Simple' ? 2 : target.ability == 'Contrary' ? -1 : 1;
    numStages *= statMultiplier;
    if (numStages < 0) {
        if (isNotSelf && (['Clear Body', 'White Smoke', 'Full Metal Body'].includes(target.ability) || (target.ability == 'Hyper Cutter' && stat == AT) || (target.ability == 'Big Pecks' && stat == DF) || target.item == 'Clear Amulet')) {
            //no effect
        }
        else {
            target.boosts[stat] = Math.max(-6, target.boosts[stat] + numStages);

            if (target.ability == 'Defiant') {
                target.boosts[AT] = Math.min(6, target.boosts[AT] + 2);
            }
            else if (target.ability == 'Competitive') {
                target.boosts[SA] = Math.min(6, target.boosts[SA] + 2);
            }

            if (numStages < 0 && target.item == 'White Herb') {
                target.boosts[stat] = 0;
                target.item == '';
            }
        }
    }
    else if (numStages > 0) {
        target.boosts[stat] = Math.min(6, target.boosts[stat] + numStages);
    }
    else {
        alert("Entered changeStatBoosts with zero stat changes");
    }

    return !isNotSelf ? source : !mirrorSwitch ? [source, target] : [target, source];
}

function checkSupersweetSyrup(source, target) {
    if (source.ability === 'Supersweet Syrup' && source.abilityOn && target.item !== 'Clear Amulet') {
        if (target.ability === "Defiant") {
            target.boosts[AT] = Math.min(6, target.boosts[AT] + 2);
        }
        else if (target.ability === "Competitive") {
            target.boosts[AT] = Math.min(6, target.boosts[SA] + 2);
        }
    }
}

function checkIntimidate(source, target) {
    if (source.ability === "Intimidate" && source.abilityOn) {
        var checkSimple = target.ability === "Simple" ? 1 : 0;

        //Contrary & Guard Dog need to be first; these abilities supersede Clear Amulet but not Mirror Armor for some reason
        if (["Contrary", "Guard Dog"].indexOf(target.ability) !== -1) {
            target.boosts[AT] = Math.min(6, target.boosts[AT] + 1);
        }
        else if (["Clear Body", "White Smoke", "Hyper Cutter", "Full Metal Body"].indexOf(target.ability) !== -1
            || (["Inner Focus", "Oblivious", "Own Tempo", "Scrappy"].indexOf(target.ability) !== -1 && gen >= 8)
            || target.item === "Clear Amulet") {
            // no effect
        }
        else if (target.ability === "Mirror Armor") {
            source.boosts[AT] = Math.max(-6, source.boosts[AT] - 1);
        }
        else {
            target.boosts[AT] = Math.max(-6, target.boosts[AT] - 1 * (1 + checkSimple));
            if (target.ability === "Defiant") {
                target.boosts[AT] = Math.min(6, target.boosts[AT] + 2);
            }
            else if (target.ability === "Competitive") {
                target.boosts[SA] = Math.min(6, target.boosts[SA] + 2);
            }
        }
        if (target.item === "Adrenaline Orb" && target.ability !== "Mirror Armor") {
            target.boosts[SP] = Math.min(6, target.boosts[SP] + 1 * (1 + checkSimple));
            target.item = '';
        }
        if (target.ability === "Rattled" && gen >= 8 && target.item !== "Clear Amulet") {
            target.boosts[SP] = Math.min(6, target.boosts[SP] + 1);
        }
    }
}

function checkSwordShield(pokemon) {
    if (pokemon.ability === "Intrepid Sword" && (gen !== 9 || pokemon.abilityOn)) {
        pokemon.boosts[AT] = Math.min(6, pokemon.boosts[AT] + 1);
    }
    else if (pokemon.ability === "Dauntless Shield" && (gen !== 9 || pokemon.abilityOn)) {
        pokemon.boosts[DF] = Math.min(6, pokemon.boosts[DF] + 1);
    }
}

function checkWindRider(pokemon, tailwind) {
    if (pokemon.ability === "Wind Rider" && tailwind)
        pokemon.boosts[AT] = Math.min(6, pokemon.boosts[AT] + 1);
}

function checkEvo(p1, p2) {
    var maxBoosts = gen == 9.5 ? 1 : 6;
    if ($('#evoL').prop("checked") || $('#tatsuL').prop("checked")){
        p1.boosts[AT] = Math.min(maxBoosts, p1.boosts[AT] + 2);
        p1.boosts[DF] = Math.min(maxBoosts, p1.boosts[DF] + 2);
        p1.boosts[SA] = Math.min(maxBoosts, p1.boosts[SA] + 2);
        p1.boosts[SD] = Math.min(maxBoosts, p1.boosts[SD] + 2);
        p1.boosts[SP] = Math.min(maxBoosts, p1.boosts[SP] + 2);
    }
    if ($('#evoR').prop("checked") || $('#tatsuR').prop("checked")){
        p2.boosts[AT] = Math.min(maxBoosts, p2.boosts[AT] + 2);
        p2.boosts[DF] = Math.min(maxBoosts, p2.boosts[DF] + 2);
        p2.boosts[SA] = Math.min(maxBoosts, p2.boosts[SA] + 2);
        p2.boosts[SD] = Math.min(maxBoosts, p2.boosts[SD] + 2);
        p2.boosts[SP] = Math.min(maxBoosts, p2.boosts[SP] + 2);
    }

    if($('#clangL').prop("checked")){
        p1.boosts[SA] = Math.min(6, p1.boosts[SA] + 2);
        p1.boosts[SD] = Math.min(6, p1.boosts[SD] + 2);
        p1.boosts[SP] = Math.min(6, p1.boosts[SP] + 2);
    }
    if($('#clangR').prop("checked")){
        p2.boosts[SA] = Math.min(6, p2.boosts[SA] + 2);
        p2.boosts[SD] = Math.min(6, p2.boosts[SD] + 2);
        p2.boosts[SP] = Math.min(6, p2.boosts[SP] + 2);
    }
    if ($('#weakL').prop("checked")) {
        p1.boosts[AT] = Math.min(6, p1.boosts[AT] + 2);
        p1.boosts[SA] = Math.min(6, p1.boosts[SA] + 2);
    }
    if ($('#weakR').prop("checked")) {
        p2.boosts[AT] = Math.min(6, p2.boosts[AT] + 2);
        p2.boosts[SA] = Math.min(6, p2.boosts[SA] + 2);
    }

}

function checkDownload(source, target) {
    if (source.ability === "Download") {
        if (target.stats[DF] && target.stats[SD]) {
            if (target.stats[SD] <= target.stats[DF]) {
                source.boosts[SA] = Math.min(6, source.boosts[SA] + 1);
            } else {
                source.boosts[AT] = Math.min(6, source.boosts[AT] + 1);
            }
        }
        else {
            if (getModifiedStat(target.rawStats[SD], target.boosts[SD]) <= getModifiedStat(target.rawStats[DF], target.boosts[DF])) {
                source.boosts[SA] = Math.min(6, source.boosts[SA] + 1);
            } else {
                source.boosts[AT] = Math.min(6, source.boosts[AT] + 1);
            }
        }
    }
}

function checkEmbodyAspect(pokemon) {
    if (pokemon.ability === 'Embody Aspect') {
        if (pokemon.name === 'Ogerpon') {
            pokemon.boosts[SP] = Math.min(6, pokemon.boosts[SP] + 1);
        }
        else if (pokemon.name === 'Ogerpon-Wellspring' && pokemon.item === 'Wellspring Mask') {
            pokemon.boosts[SD] = Math.min(6, pokemon.boosts[SD] + 1);
        }
        else if(pokemon.name === 'Ogerpon-Hearthflame' && pokemon.item === 'Hearthflame Mask') {
            pokemon.boosts[AT] = Math.min(6, pokemon.boosts[AT] + 1);
        }
        else if (pokemon.name === 'Ogerpon-Cornerstone' && pokemon.item === 'Cornerstone Mask') {
            pokemon.boosts[DF] = Math.min(6, pokemon.boosts[DF] + 1);
        }
    }
}

//If we play VGC on a game with Ash Greninja I should just delete this function
function checkBattleBond(pokemon) {
    if (pokemon.ability === 'Battle Bond' && pokemon.abilityOn && gen == 9) {
        pokemon.boosts[AT] = Math.min(6, pokemon.boosts[AT] + 1);
        pokemon.boosts[SA] = Math.min(6, pokemon.boosts[SA] + 1);
        pokemon.boosts[SP] = Math.min(6, pokemon.boosts[SP] + 1);
    }
}

//CONSIDER AN ALL ENCOMPASSING FUNCTION FOR BOOSTS

function checkInfiltrator(attacker, affectedSide) {
    if (attacker.ability === "Infiltrator") {
        affectedSide.isAuroraVeil = false;
        affectedSide.isReflect = false;
        affectedSide.isLightScreen = false;
    }
}

function countBoosts(boosts) {
    var sum = 0;
    for (var i = 0; i < STATS.length; i++) {
        if (boosts[STATS[i]] > 0) {
            sum += boosts[STATS[i]];
        }
    }
    return sum;
}

// GameFreak rounds DOWN on .5
function pokeRound(num) {
    return (num % 1 > 0.5) ? Math.ceil(num) : Math.floor(num);
}

function getWeightMods(p1, p2) {
    if (p1.ability == "Heavy Metal") p1.weight *= 2;
    else if (p1.ability == "Light Metal") p1.weight /= 2;

    if (p2.ability == "Heavy Metal") p2.weight *= 2;
    else if (p2.ability == "Light Metal") p2.weight /= 2;

    if (p1.item == "Float Stone") p1.weight /= 2;
    if (p2.item == "Float Stone") p2.weight /= 2;
}

function checkMoveTypeChange(move, field, attacker) {
    if (move.name == "Weather Ball") {
        move.type = (field.weather.indexOf("Sun") > -1 && attacker.item !== 'Utility Umbrella') || attacker.ability == 'Mega Sol' ? "Fire"
            : field.weather.indexOf("Rain") > -1 && attacker.item !== 'Utility Umbrella' ? "Water"
                : field.weather === "Sand" ? "Rock"
                    : ["Hail", "Snow"].indexOf(field.weather) > -1 ? "Ice"
                        : "Normal";
    }
    else if (move.name == "Terrain Pulse") {
        move.type = field.terrain === "Electric" ? "Electric"
            : field.terrain === "Grassy" ? "Grass"
                : field.terrain === "Misty" ? "Fairy"
                    : field.terrain === "Psychic" ? "Psychic"
                        : "Normal";
    }
    else if (move.name == "Techno Blast") {
        move.type = attacker.item === "Burn Drive" ? "Fire"
            : attacker.item === "Chill Drive" ? "Ice"
                : attacker.item === "Douse Drive" ? "Water"
                    : attacker.item === "Shock Drive" ? "Electric"
                        : "Normal";
    }
    else if (move.name == "Natural Gift" && attacker.item.includes(" Berry")) {
        move.type = getNaturalGift(attacker.item).t;
    }
    else if (move.name === "Multi-Attack" && attacker.item.indexOf("Memory") !== -1) {
        move.type = getMemoryType(attacker.item);
    }
    else if (move.name === "Judgment" && attacker.item.indexOf("Plate") !== -1) {
        move.type = getItemBoostType(attacker.item);
    }
    else if (move.name === "Revelation Dance") {
        move.type = attacker.type1 !== 'Typeless' ? attacker.type1
            : attacker.type2 !== 'Typeless' && attacker.type2 !== "" ? attacker.type2
                : 'Typeless';
    }
    else if (move.isPledge && move.name !== move.combinePledge) {
        var bothPledgeNames = move.name + " " + move.combinePledge;
        move.type = bothPledgeNames.includes("Grass") && bothPledgeNames.includes("Fire") ? 'Fire'
            : bothPledgeNames.includes("Grass") && bothPledgeNames.includes("Water") ? 'Grass'
                : bothPledgeNames.includes("Water") && bothPledgeNames.includes("Fire") ? 'Water'
                    : 'Typeless';   //last case should never happen, just there to help with debugging
    }
    else if (move.name === 'Aura Wheel' && attacker.name === 'Morpeko-Hangry') {
        move.type = 'Dark';
    }
    else if (move.name === "Tera Blast" && attacker.isTerastalize) {
        move.type = attacker.tera_type;
    }
    else if (move.name === "Raging Bull") {
        switch (attacker.name) {
            case "Tauros-Paldea-Combat":
                move.type = "Fighting";
                break;
            case "Tauros-Paldea-Blaze":
                move.type = "Fire";
                break;
            case "Tauros-Paldea-Aqua":
                move.type = "Water";
                break;
            default:
                move.type = "Normal";
        }
    }
    else if (move.name === "Ivy Cudgel") {
        switch (attacker.name) {
            case "Ogerpon-Wellspring":
                move.type = "Water";
                break;
            case "Ogerpon-Hearthflame":
                move.type = "Fire";
                break;
            case "Ogerpon-Cornerstone":
                move.type = "Rock";
                break;
            default:
                move.type = "Grass";
        }
    }
    else if ((move.name == "Struggle" && gen >= 2) || (['Beat Up', 'Future Sight', 'Doom Desire'].indexOf(move.name) != -1 && gen <= 4)) {
        move.type = 'Typeless';
    }
    else if (move.name === 'Tera Starstorm' && attacker.name === 'Terapagos-Stellar') {
        move.type = 'Stellar';
    }
}

function checkConditionalPriority(move, terrain, attacker, attIsGrounded) {
    if ((move.isHealing && attacker.ability == "Triage") || (move.name == "Grassy Glide" && terrain == "Grassy" && attIsGrounded)
        || (move.type == "Flying" && attacker.ability == "Gale Wings" && (gen == 6 || attacker.curHP == attacker.maxHP)))
        move.isPriority = true;
}

function checkConditionalSpread(move, terrain, attacker, attIsGrounded) {
    if ((move.name == "Expanding Force" && terrain == "Psychic" && attIsGrounded) || (move.name == "Tera Starstorm" && attacker.name == "Terapagos-Stellar"))
        move.isSpread = true;
}

function checkContactOverride(move, attacker) {
    if (move.makesContact && (attacker.item === 'Protective Pads' || (attacker.item === 'Punching Glove' && move.isPunch) || attacker.ability === "Long Reach"))
        move.makesContact = false;
    else if (move.name === "Shell Side Arm" && move.category === "Physical")
        move.makesContact = true;
}

function setIsQuarteredByProtect(attacker, defender, field, move, description) {
    let qualifiedQuartered = field.isProtect && (move.isZ || move.isSignatureZ || attacker.isDynamax || attacker.ability === 'Piercing Drill' || (attacker.ability === 'Unseen Fist' && gen >= 10));
    if (qualifiedQuartered && attacker.ability === 'Piercing Drill') description.attackerAbility = attacker.ability;
    return qualifiedQuartered;
}

function ZMoves(move, field, attacker, moveDescName) {
    if (move.isSignatureZ) {
        move.isZ = true;
        if (attacker.ability == 'Parental Bond') attacker.ability = '';
    }
    else if (move.isZ) {
        var tempMove = move;

        if (move.name.includes("Hidden Power") || move.name === 'Revelation Dance') {
            move.type = "Normal";
        }
        else move.type = tempMove.type;

        var ZName = ZMOVES_LOOKUP[tempMove.type];
        var SigZ;
        if (attacker.isTransformed) {
            var tempSpecies = $("#p1").find(".transform").prop("checked") ? transformSpecies["p1"] : transformSpecies["p2"];
            SigZ = getSignatureZMove(attacker.item, tempSpecies, move.name);
        }
        else
            SigZ = getSignatureZMove(attacker.item, attacker.name, tempMove.name);
        if (SigZ !== -1) ZName = SigZ;
        //turning it into a generic single-target Z-move
        move = moves[ZName];
        if (move == undefined) move = tempMove;
        move.name = ZName;
        if (SigZ == -1) {
            if (tempMove.zp) move.bp = tempMove.zp; //for any moves that don't fit into the bracketed z-move bp
            else if (tempMove.bp <= 55) move.bp = 100;
            else if (tempMove.bp <= 65) move.bp = 120;
            else if (tempMove.bp <= 75) move.bp = 140;
            else if (tempMove.bp <= 85) move.bp = 160;
            else if (tempMove.bp <= 95) move.bp = 175;
            else if (tempMove.bp <= 100) move.bp = 180;
            else if (tempMove.bp <= 110) move.bp = 185;
            else if (tempMove.bp <= 125) move.bp = 190;
            else if (tempMove.bp <= 130) move.bp = 195;
            else move.bp = 200;
            move.name = "Z-" + tempMove.name;
            move.isZ = true;
            move.category = tempMove.category;
            moveDescName = ZName + " (" + move.bp + " BP)";
        }
        else
            moveDescName = ZName;
        move.isCrit = tempMove.isCrit;
        move.hits = 1;
        if (attacker.ability == 'Parental Bond') attacker.ability = '';
    }
    return [move, moveDescName];
}

function MaxMoves(move, attacker, isQuarteredByProtect, moveDescName, field) {
    var exceptions_100_fight = ["Low Kick", "Reversal", "Final Gambit"];
    var exceptions_80_fight = ["Double Kick", "Triple Kick"];
    var exceptions_75_fight = ["Counter", "Seismic Toss"];
    var exceptions_140 = ["Crush Grip", "Wring Out", "Magnitude", "Double Iron Bash", "Rising Voltage", "Triple Axel"];
    var exceptions_130 = ["Pin Missile", "Power Trip", "Punishment", "Dragon Darts", "Dual Chop", "Electro Ball", "Heat Crash",
        "Bullet Seed", "Grass Knot", "Bonemerang", "Bone Rush", "Fissure", "Icicle Spear", "Sheer Cold", "Weather Ball", "Tail Slap", "Guillotine", "Horn Drill",
        "Flail", "Return", "Frustration", "Endeavor", "Natural Gift", "Trump Card", "Stored Power", "Rock Blast", "Gear Grind", "Gyro Ball", "Heavy Slam",
        "Dual Wingbeat", "Terrain Pulse", "Surging Strikes", "Scale Shot"];
    var exceptions_120 = ["Double Hit", "Spike Cannon"];
    var exceptions_100 = ["Twineedle", "Beat Up", "Fling", "Dragon Rage", "Nature's Madness", "Night Shade", "Comet Punch", "Fury Swipes", "Sonic Boom", "Bide",
        "Super Fang", "Present", "Spit Up", "Psywave", "Mirror Coat", "Metal Burst"];
    var tempMove = move;
    var maxName = MAXMOVES_LOOKUP[tempMove.type];
    if (G_MAXMOVES_TYPE[attacker.name] == tempMove.type && attacker.gmax_factor) {
        maxName = G_MAXMOVES_LOOKUP[attacker.name];
    }
    move = moves[maxName];
    if (move == undefined) move = tempMove; //prevents crashing when switching between Gen VII and VIII, as well as for Typeless Max Moves
    else {
        move.type = tempMove.type;
        move.name = maxName;
    }
    if (['G-Max Drum Solo', 'G-Max Fireball', 'G-Max Hydrosnipe'].indexOf(maxName) == -1) {
        if (move.type == "Fighting" || move.type == "Poison") {
            if (tempMove.bp >= 150 || exceptions_100_fight.includes(tempMove.name)) move.bp = 100;
            else if (tempMove.bp >= 110) move.bp = 95;
            else if (tempMove.bp >= 75) move.bp = 90;
            else if (tempMove.bp >= 65) move.bp = 85;
            else if (tempMove.bp >= 55 || exceptions_80_fight.includes(tempMove.name)) move.bp = 80;
            else if (tempMove.bp >= 45 || exceptions_75_fight.includes(tempMove.name)) move.bp = 75;
            else move.bp = 70;
        }
        else {
            if (tempMove.bp >= 150) move.bp = 150;
            else if (tempMove.bp >= 110 || exceptions_140.includes(tempMove.name)) move.bp = 140;
            else if (tempMove.bp >= 75 || exceptions_130.includes(tempMove.name)) move.bp = 130;
            else if (tempMove.bp >= 65 || exceptions_120.includes(tempMove.name)) move.bp = 120;
            else if (tempMove.bp >= 55 || exceptions_100.includes(tempMove.name)) move.bp = 110;
            else if (tempMove.bp >= 45) move.bp = 100;
            else move.bp = 90;
        }
    }
    if (move.name === "G-Max Wind Rage")
        move.ignoresScreens = true;
    if (maxName != undefined)
        moveDescName = maxName + " (" + move.bp + " BP)";
    if (tempMove.name == "(No Move)") {
        moveDescName = "(No Move)";
        move.bp = 0;
        move.isCrit = false;
    }
    else if (tempMove.category == "Status") {
        moveDescName = "Max Guard";
        move.name = moveDescName;
        move.bp = 0;
        move.isCrit = false;
    }
    else move.isCrit = tempMove.isCrit;
    move.category = tempMove.category;
    move.hits = 1;
    if (isQuarteredByProtect && ["G-Max One Blow", "G-Max Rapid Flow"].includes(maxName)) isQuarteredByProtect = false;
    if (attacker.ability == 'Parental Bond') attacker.ability = '';

    return [move, isQuarteredByProtect, moveDescName];
}

function NaturePower(move, field, moveDescName) {         //Rename Nature Power to its appropriately called moves; needs to be done after Max Moves since Nature Power becomes Max Guard
    move.category = "Special";
    var natureZ = move.isZ;
    var npMove = gen == 3 ? "Swift" : gen == 5 ? "Earthquake"
        : (field.terrain == "Electric") ? "Thunderbolt"
            : (field.terrain == "Grassy") ? "Energy Ball"
                : (field.terrain == "Psychic") ? "Psychic"
                    : (field.terrain == "Misty") ? "Moonblast"
                        : "Tri Attack";
    move = moves[npMove];
    move.name = npMove;
    move.isZ = natureZ;
    move.hits = 1;
    moveDescName = npMove;
    return [move, moveDescName];
}

function checkMeFirst(move, moveDescName, defender, isDynamax) {
    var moveName = defender.moves[move.usedOppMoveIndex].name;
    var cannotCall = ['Beak Blast', 'Belch', 'Chatter', 'Counter', 'Covet', 'Focus Punch', 'Metal Burst', 'Mirror Coat', 'Shell Trap', 'Struggle', 'Thief'].includes(moveName);
    var meFirstZ = move.isZ, isMeFirst = false, tempCrit = move.isCrit;
    if (!cannotCall && moves[moveName].category !== 'Status' && !isDynamax) {
        move = moves[moveName];
        move.name = moveName;
        isMeFirst = true;
        move.isZ = meFirstZ;
        move.isCrit = tempCrit;
        moveDescName = moveName;
    }
    return [move, moveDescName, isMeFirst];
}

function statusMoves(move, attacker, defender, description) {
    if (move.name === "Pain Split" && attacker.item !== "Assault Vest") {
        return { "damage": [Math.floor((defender.curHP - attacker.curHP) / 2)], "description": buildDescription(description) };
    }
    else if (move.bp === 0 || move.category === "Status") {
        return { "damage": [0], "description": buildDescription(description) };
    }
}

function abilityIgnore(attacker, move, defAbility, description, defItem = "") {
    var isIgnoreable = ['Shadow Shield', 'Full Metal Body', 'Prism Armor', 'As One', 'Protosynthesis', 'Quark Drive',
        'Tablets of Ruin', 'Vessel of Ruin', 'Sword of Ruin', 'Beads of Ruin'].indexOf(defAbility) == -1 && defItem !== "Ability Shield";
    var isMoldBreaker = ["Mold Breaker", "Teravolt", "Turboblaze"].indexOf(attacker.ability) !== -1;
    var isIgnoreMove = ["Moongeist Beam", "Sunsteel Strike", "Photon Geyser", "Searing Sunraze Smash", "Menacing Moonraze Maelstrom",
        "Light That Burns the Sky", 'G-Max Drum Solo', 'G-Max Fireball', 'G-Max Hydrosnipe'].indexOf(move.name) !== -1;

    if (isMoldBreaker || isIgnoreMove) {
        move.ignoresFriendGuard = true;
        if (isIgnoreable) {
            defAbility = "[ignored]";
            if (isMoldBreaker)
                description.attackerAbility = attacker.ability;
        }
    }

    return [defAbility, description];
}

function critMove(move, defAbility) {
    return move.isCrit && ["Battle Armor", "Shell Armor"].indexOf(defAbility) === -1;
}

//UNUSED CURRENTLY
function HiddenPower(move, attacker, description) {
    var typeOrder = ['Fighting', 'Flying', 'Poison', 'Ground', 'Rock', 'Bug', 'Ghost', 'Steel', 'Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Ice', 'Dragon', 'Dark'];
    var typeIndex = Math.floor(((attacker.ivs['hp'] & 1) + (attacker.ivs[AT] & 1) * 2 + (attacker.ivs[DF] & 1) * 4 + (attacker.ivs[SP] & 1) * 8 + (attacker.ivs[SA] & 1) * 16 + (attacker.ivs[SD] & 1) * 32) * 15 / 63);
    move.type = typeOrder[typeIndex];
    if (gen < 6) {
        move.bp = Math.floor((secondLeastSigBit(attacker.ivs['hp']) + (secondLeastSigBit(attacker.ivs[AT]) * 2) + (secondLeastSigBit(attacker.ivs[DF]) * 4) + (secondLeastSigBit(attacker.ivs[SP]) * 8) + (secondLeastSigBit(attacker.ivs[SA]) * 16) + (secondLeastSigBit(attacker.ivs[SD]) * 32)) * 40 / 63) + 30;
        description.moveBP = move.bp;
    }
    description.moveType = move.type;

    return [move, description];
}

function secondLeastSigBit(val) {
    if (val & 2) {
        return 1;
    }
    return 0;
}

function NaturalGift(move, attacker, description) {
        var gift = getNaturalGift(attacker.item);
        move.type = gift.t;
        move.bp = gift.p;
        description.attackerItem = attacker.item;
        description.moveBP = move.bp;
        description.moveType = move.type;
    
    return [move, description];
}

const TYPE_CHANGE_BOOST_ABILITIES = [
    'Normalize',
    'Aerilate',
    'Pixilate',
    'Refrigerate',
    'Galvanize',
    'Dragonize'
];
function checkAbilityTypeChange(move, attacker, description) {
    var isBoosted = false;
    if (attacker.ability === "Liquid Voice") {
        if (move.isSound) {
            move.type = "Water";
            description.attackerAbility = attacker.ability;
        }
    }
    else {
        if (attacker.ability !== "Normalize" && move.type === "Normal") { //Z-Moves don't receive -ate type changes
            switch (attacker.ability) {
                case "Aerilate":
                    move.type = "Flying";
                    break;
                case "Pixilate":
                    move.type = "Fairy";
                    break;
                case "Refrigerate":
                    move.type = "Ice";
                    break;
                case "Galvanize":
                    move.type = "Electric";
                    break;
                case "Dragonize":
                    move.type = "Dragon";
            }
            if (attacker.isDynamax)
                description.moveName = MAXMOVES_LOOKUP[move.type] + " (" + move.bp + " BP)";
            isBoosted = true;     //indicates whether the move gets the boost or not
        }
        else if (attacker.ability === "Normalize") {
            move.type = "Normal";
            if (attacker.isDynamax)
                description.moveName = "Max Strike (" + move.bp + " BP)";
            isBoosted = gen >= 7 ? true : false;     //indicates whether the move gets the boost or not
        }
    }

    return [move, description, isBoosted];
}


function immunityChecks(move, attacker, defender, field, description, defAbility, typeEffectiveness) {
    if (typeEffectiveness === 0 || (gen === 3 && move.type === '???')) {
        return { "damage": [0], "description": buildDescription(description) };
    }
    if ((defAbility === "Wonder Guard" && typeEffectiveness <= 1 && move.type !== 'Typeless' && (gen !== 4 || move.name !== 'Fire Fang')) ||
        (move.type === "Grass" && defAbility === "Sap Sipper") ||
        (move.type === "Fire" && ["Flash Fire", "Well-Baked Body"].indexOf(defAbility) !== -1) ||
        (move.type === "Water" && (["Dry Skin", "Water Absorb"].indexOf(defAbility) !== -1 || (defAbility === 'Storm Drain' && gen !== 4))) ||
        (move.type === "Electric" && (["Motor Drive", "Volt Absorb"].indexOf(defAbility) !== -1 || (defAbility === 'Lightning Rod' && gen > 4))) ||
        (move.type === "Ground" && ((!field.isGravity && defender.item !== "Iron Ball" && ['Levitate','Eelevate'].includes(defAbility)) || defAbility === "Earth Eater")) ||
        (move.isBullet && defAbility === "Bulletproof") ||
        (move.isSound && defAbility === "Soundproof") ||
        (move.isWind && defAbility === "Wind Rider")) {
        description.defenderAbility = defAbility;
        return { "damage": [0], "description": buildDescription(description) };
    }
    if (move.type === "Ground" && !field.isGravity && defender.item === "Air Balloon" && move.name !== "Thousand Arrows") {
        description.defenderItem = defender.item;
        return { "damage": [0], "description": buildDescription(description) };
    }
    if ((field.weather === "Harsh Sun" && move.type === "Water") || (field.weather === "Heavy Rain" && move.type === "Fire")) {
        return { "damage": [0], "description": buildDescription(description) };
    }
    if (move.name === "Sky Drop" &&
        (defender.hasType("Flying") ||
            (gen >= 6 && defender.weight >= 200.0) || field.isGravity)) {
        return { "damage": [0], "description": buildDescription(description) };
    }
    if (move.name === "Synchronoise" && !(defender.hasType(attacker.type1, attacker.type2))) {
        return { "damage": [0], "description": buildDescription(description) };
    }
    if (defender.isDynamax && ["Grass Knot", "Low Kick", "Heat Crash", "Heavy Slam"].indexOf(move.name) !== -1) {
        return { "damage": [0], "description": buildDescription(description) };
    }
    if ((defAbility === "Damp" || attacker.ability === "Damp") && ["Self-Destruct", "Explosion", "Mind Blown", "Misty Explosion"].indexOf(move.name) !== -1) {
        if (defAbility === "Damp")
            description.defenderAbility = defAbility;
        if (attacker.ability === "Damp")
            description.attackerAbility = attacker.ability;
        return { "damage": [0], "description": buildDescription(description) };
    }
    if (move.isOHKO && defAbility === "Sturdy") {
        description.defenderAbility = defAbility;
        return { "damage": [0], "description": buildDescription(description) };
    }
    if (move.name === "Fling" && cantFlingItem(attacker.item, attacker.name, defAbility)) {
        description.attackerItem = attacker.item;
        return { "damage": [0], "description": buildDescription(description) };
    }
    if (move.name === "Natural Gift" && attacker.item.indexOf(" Berry") === -1) {
        return { "damage": [0], "description": buildDescription(description) };
    }
    if (["Queenly Majesty", "Dazzling", "Armor Tail"].indexOf(defAbility) !== -1 && move.isPriority) {
        description.defenderAbility = defAbility;
        return { "damage": [0], "description": buildDescription(description) };
    }
    if (field.terrain === "Psychic" && move.isPriority && pIsGrounded(defender, field)) {
        description.terrain = field.terrain;
        return { "damage": [0], "description": buildDescription(description) };
    }
    if (move.name === 'Dream Eater' && defender.status !== 'Asleep' && defAbility !== 'Comatose') {
        return { "damage": [0], "description": buildDescription(description) };
    }

    return -1;
}

//Special Cases
function setDamage(move, attacker, defender, description, isQuarteredByProtect, field) {
    var isParentBond = attacker.ability === "Parental Bond";
    //a. Counterattacks (Counter, Mirror Coat, Metal Burst, Comeuppance, Bide)
    if (['Counter', 'Mirror Coat', 'Metal Burst', 'Comeuppance'].indexOf(move.name) !== -1) {
        var counteredMove = defender.moves[move.usedOppMoveIndex];
        if (counteredMove.category !== 'Status') {
            if (gen <= 3) counteredMove.category = typeChart[counteredMove.type].category;
            counteredResult = GET_DAMAGE_HANDLER(defender, attacker, counteredMove, field);
            if (Array.isArray(counteredResult.damage[0]))
                counteredResult.damage = counteredResult.damage[counteredResult.damage.length - 1];
            if (gen > 3 || counteredMove.name.indexOf('Hidden Power') === -1) {
                if (['Counter', 'Mirror Coat'].indexOf(move.name) !== -1 && move.category == counteredMove.category) {
                    for (i = 0; i < counteredResult.damage.length; i++) {
                        counteredResult.damage[i] *= 2;
                    }
                    counteredResult.description = '2x ' + move.name + ' (' + counteredResult.description + ') vs. ' + description.HPEVs + ' ' + description.defenderName;
                }
                else if (['Metal Burst', 'Comeuppance'].indexOf(move.name) !== -1) {
                    for (i = 0; i < counteredResult.damage.length; i++) {
                        counteredResult.damage[i] = Math.floor(counteredResult.damage[i] * 1.5);
                    }
                    counteredResult.description = '1.5x ' + move.name + ' (' + counteredResult.description + ') vs. ' + description.HPEVs + ' ' + description.defenderName;
                }
                else {
                    return { "damage": [0], "description": buildDescription(description) };
                }
            }
            else if (move.name === 'Counter') {
                for (i = 0; i < counteredResult.damage.length; i++) {
                    counteredResult.damage[i] *= 2;
                }
                counteredResult.description = '2x ' + move.name + ' (' + counteredResult.description + ') vs. ' + description.HPEVs + ' ' + description.defenderName;
            }
            else {
                return { "damage": [0], "description": buildDescription(description) };
            }
            if (isParentBond) {
                for (var i = 0; i < counteredResult.damage.length; i++) {
                    counteredResult.damage[i] *= 2;
                }
            }
            return counteredResult;
        }
        else {
            return { "damage": [0], "description": buildDescription(description) };
        }
        //Bide ain't being added it's too niche
    }

    //b. Defender HP Dependent (Super Fang/Nature's Madness/Ruination, Guardian of Alola)
    var def_curHP;
    if (["Super Fang", "Nature's Madness", "Ruination"].indexOf(move.name) !== -1) {
        def_curHP = Math.floor(defender.curHP / 2);
        if (isParentBond) {
            def_curHP = Math.floor(def_curHP * 3 / 2);
        }
        if (defender.isDynamax) {
            def_curHP = Math.floor(def_curHP / 2);
        }
        if (gen == 9.5) {
            def_curHP = Math.floor(def_curHP * 0.75);
        }
        return { "damage": [def_curHP], "description": buildDescription(description) };
    }
    else if (move.name === "Guardian of Alola") {
        if (!isQuarteredByProtect) {
            def_curHP = Math.floor(defender.curHP * 3 / 4);
        }
        else {
            def_curHP = Math.floor(defender.curHP * 3 / 16);
        }
        return { "damage": [def_curHP], "description": buildDescription(description) };
    }

    //c. Attacker HP Dependent (Endeavor, Final Gambit)
    if (move.name === "Endeavor") {
        var endvr_dmg = 0;
        if (attacker.curHP < defender.curHP) endvr_dmg = defender.curHP - attacker.curHP;
        return { "damage": [endvr_dmg], "description": buildDescription(description) };
    }
    if (move.name === "Final Gambit") {
        var at_curHP = attacker.curHP;
        return { "damage": [at_curHP], "description": buildDescription(description) };
    }

    //d. Set Damage (Sonic Boom, Dragon Rage)
    if (move.name === "Sonic Boom") {
        return !isParentBond
            ? { "damage": [20], "description": buildDescription(description) }
            : { "damage": [40], "description": buildDescription(description) };
    }
    if (move.name === "Dragon Rage") {
        return !isParentBond
            ? { "damage": [40], "description": buildDescription(description) }
            : { "damage": [80], "description": buildDescription(description) };
    }

    //e. Level Dependent Damage (Seismic Toss, Night Shade)
    if (move.name === "Seismic Toss" || move.name === "Night Shade") {
        var lv = attacker.level;
        if (isParentBond) {
            lv *= 2;
        }
        return { "damage": [lv], "description": buildDescription(description) };
    }

    //f. OHKO moves
    if (move.isOHKO) {
        if (move.name == 'Sheer Cold' && defender.hasType("Ice"))
            return { "damage": [0], "description": buildDescription(description) };
        else
            return { "damage": [defender.curHP], "description": buildDescription(description) };
    }
    //g. Psywave

    return -1;
}

/**
 * Returns true if the Pokemon is grounded, and false if it is airborne. Cases not covered:
 * - Klutz + Iron Ball/Air Balloon (handled in function checkKlutz)
 * - Levitate + ignoring/negating abilities (handled before; ability should be blank by the time this function is called)
 * - Flying type + Ring Target (handled in function getMoveEffectiveness)
 * - Thousand Arrows (handled in function getMoveEffectiveness)
 * - Flying type + Roost (not implemented, not planning on implementing, wouldn't be handled here anyway)
 */
function pIsGrounded(mon, field) {
    return field.isGravity || mon.item == "Iron Ball" || (mon.item != "Air Balloon" && !(["Levitate", "Eelevate"].includes(mon.ability)) && !(mon.hasType("Flying"))) || field.isIngrain;
}

//1. Custom BP
function basePowerFunc(move, description, turnOrder, attacker, defender, field, attIsGrounded, defIsGrounded, defAbility) {
    var basePower;
    switch (move.name) {
        //a. Speed based
        //a.i. Gyro Ball
        case "Gyro Ball":
            basePower = Math.min(150, Math.floor(25 * defender.stats[SP] / attacker.stats[SP]));
            description.moveBP = basePower;
            break;
        //a.ii. Electro Ball
        case "Electro Ball":
            var r = (defender.stats[SP] == 0) ? 0 : Math.floor(attacker.stats[SP] / defender.stats[SP]);
            basePower = r >= 4 ? 150 : r >= 3 ? 120 : r >= 2 ? 80 : r >= 1 ? 60 : 40;
            description.moveBP = basePower;
            break;

        //b. Weight based
        //b.i. Low Kick, Grass Knot
        case "Low Kick":
        case "Grass Knot":
            if (gen >= 3) {
                var w = defender.weight;
                basePower = w >= 200 ? 120 : w >= 100 ? 100 : w >= 50 ? 80 : w >= 25 ? 60 : w >= 10 ? 40 : 20;
                description.moveBP = basePower;
                if (defAbility == "Heavy Metal" || defAbility == "Light Metal")
                    description.defenderAbility = defAbility;
                if (defender.item == "Float Stone")
                    description.defenderItem = defender.item;
            }
            else basePower = move.bp;
            break;
        //b.ii. Heavy Slam, Heat Crash
        case "Heavy Slam":
        case "Heat Crash":
            var wr = attacker.weight / defender.weight;
            basePower = wr >= 5 ? 120 : wr >= 4 ? 100 : wr >= 3 ? 80 : wr >= 2 ? 60 : 40;
            description.moveBP = basePower;
            if (defAbility == "Heavy Metal" || defAbility == "Light Metal")
                description.defenderAbility = defAbility;
            if (defender.item == "Float Stone")
                description.defenderItem = defender.item;
            if (attacker.ability == "Heavy Metal" || attacker.ability == "Light Metal")
                description.attackerAbility = attacker.ability;
            if (attacker.item == "Float Stone")
                description.attackerItem = attacker.item;
            break;

        //c. HP based
        //c.i. Eruption, Water Spout, Dragon Energy
        case "Eruption":
        case "Water Spout":
        case "Dragon Energy":
            basePower = Math.max(1, Math.floor(150 * attacker.curHP / attacker.maxHP));
            description.moveBP = basePower;
            break;
        //c.ii. Flail, Reversal
        case "Flail":
        case "Reversal":
            var p = Math.floor(48 * attacker.curHP / attacker.maxHP);
            basePower = p <= 1 ? 200 : p <= 4 ? 150 : p <= 9 ? 100 : p <= 16 ? 80 : p <= 32 ? 40 : 20;
            description.moveBP = basePower;
            break;
        //c.iii. Crush Grip, Wring Out, Hard Press
        case "Crush Grip":
        case "Wring Out":
            basePower = Math.floor(pokeRound(120 * 100 * Math.floor(defender.curHP * 0x1000 / defender.maxHP) / 0x1000) / 100);
            description.moveBP = basePower;
            break;
        case "Hard Press":
            basePower = Math.floor(pokeRound(100 * 100 * Math.floor(defender.curHP * 0x1000 / defender.maxHP) / 0x1000) / 100);
            description.moveBP = basePower;
            break;

        //d. Friendship based   (not done under the assumption that it will always deal max damage)
        //d.i. Return
        //d.ii. Frustration

        //e. Counter based
        //e.i. Fury Cutter
        //e.ii. Rollout, Ice Ball
        //e.iii. Spit Up

        //f. Boost based
        //f.i. Stored Power, Power Trip
        case "Stored Power":
        case "Power Trip":
            basePower = 20 + 20 * countBoosts(attacker.boosts);
            description.moveBP = basePower;
            break;
        //f.ii. Punishment
        case "Punishment":
            basePower = Math.min(200, 60 + 20 * countBoosts(defender.boosts));
            description.moveBP = basePower;
            break;

        //g. Dichotomous BP
        //g.i. Acrobatics
        case "Acrobatics":
            basePower = attacker.item === 'Flying Gem'
                || attacker.item === "" ? 110 : 55;
            if (basePower !== move.bp) description.moveBP = basePower;
            break;
        //g.ii. Hex
        case "Hex":
        case "Infernal Parade":
            basePower = move.bp * (defender.status !== "Healthy" || defAbility === 'Comatose' ? 2 : 1);
            if (basePower !== move.bp) description.moveBP = basePower;
            break;
        //g.iii. Smelling Salts
        case "Smelling Salts":
            basePower = move.bp * (defender.status === "Paralyzed" ? 2 : 1);
            if (basePower !== move.bp) description.moveBP = basePower;
            break;
        //g.iv. Wake-Up Slap
        case "Wake-Up Slap":
            basePower = move.bp * (defender.status === "Asleep" || defAbility === 'Comatose' ? 2 : 1);
            if (basePower !== move.bp) description.moveBP = basePower;
            break;
        //g.v. Weather Ball
        case "Weather Ball":
            let isWeatherBoost = !(['', 'Strong Winds'].includes(field.weather));
            let isMegaSol = attacker.ability === 'Mega Sol';
            basePower = move.bp * (isWeatherBoost || isMegaSol ? 2 : 1);
            if (basePower !== move.bp) {
                description.moveBP = basePower;
                if (isWeatherBoost) {
                    description.weather = field.weather;
                }
                else if (isMegaSol) {
                    description.attackerAbility = attacker.ability;
                }
                description.moveType = move.type;
            }
            break;
        //g.vi. Water Shuriken
        case "Water Shuriken":
            basePower = (attacker.name === "Ash-Greninja" && attacker.ability === "Battle Bond") ? 20 : move.bp;
            if (basePower !== move.bp) description.moveBP = basePower;
            break;
        //g.vii. Terrain Pulse
        case "Terrain Pulse":
            basePower = (field.terrain !== "" && attIsGrounded) ? move.bp * 2 : move.bp;
            if (basePower !== move.bp) {
                description.moveBP = basePower;
                description.terrain = field.terrain;
                description.moveType = move.type;
            }
            break;
        //g.viii. Rising Voltage
        case "Rising Voltage":
            basePower = (field.terrain === "Electric" && defIsGrounded) ? move.bp * 2 : move.bp;
            if (basePower !== move.bp) description.moveBP = basePower;
            break;
        //g.ix. Grass Pledge, Fire Pledge, Water Pledge combined
        case "Grass Pledge":
        case "Fire Pledge":
        case "Water Pledge":
            basePower = move.combinePledge !== move.name ? 150 : move.bp;
            description.moveBP = basePower;
            if (move.combinePledge !== move.name)
                description.moveType = move.type;
            break;
        //g.x. Tera Blast Tera-Stellar
        case "Tera Blast":
            basePower = move.type == 'Stellar' ? 100 : 80;
            if (basePower !== move.bp) description.moveBP = basePower;
            break;
        //g.xi. Brine (Gen 4)
        case "Brine":
            if (gen == 4 && defender.curHP <= (defender.maxHP / 2)) {
                basePower = move.bp * 2;
                description.moveBP = basePower;
            }
            else basePower = move.bp;
            break;
        //g.xii. Facade (Gens 3-4)
        case "Facade":
            if (gen <= 4 && ["Burned", "Paralyzed", "Poisoned", "Badly Poisoned"].indexOf(attacker.status) !== -1) {
                basePower = move.bp * 2;
                description.moveBP = basePower;
            }
            else basePower = move.bp;
            break;
        //g.xiii. Payback, Fisheous Rend, Bolt Beak                                            CURRENTLY USING ISDOUBLE IN DEFAULT
        //case "Payback":
        //case "Fisheous Rend":
        //case "Bolt Beak":
        //    basePower = turnOrder === "LAST" ? move.bp * 2 : move.bp;
        //    if (basePower !== move.bp) description.moveBP = basePower;
        //    break;
        //g.xvi. Everything else (Assurance, Avalanche, Revenge, Gust, Twister, Pursuit, Round, Stomping Tantrum, Temper Flare)    CHECK DEFAULT

        //h. Item based
        //h.i. Fling
        case "Fling":
            basePower = getFlingPower(attacker.item);
            description.moveBP = basePower;
            if (gen !== 4 || attacker.ability !== "Klutz")
                description.attackerItem = attacker.item;
            break;
        //h.ii. Natural Gift
        case "Natural Gift":
            if (attacker.item.indexOf(" Berry") !== -1) {
                [move, description] = NaturalGift(move, attacker, description);
                basePower = move.bp;
            }
            break;

        //i. Other
        //i.i. Beat Up
        //i.ii. Echoed Voice
        //i.iii. Hidden Power (ONLY APPLIES TO THE HIDDEN POWER THAT DOESN'T SPECIFY ITS TYPE; BP is actually calculated earlier for ease of use, so this is just for the description)
        case "Hidden Power":
            basePower = move.bp;
            if (gen < 6) {
                description.moveBP = basePower;
            }
            description.moveType = move.type;
            break;
        //i.iv. Magnitude
        //i.v. Present
        //i.vi. Triple Kick, Triple Axel 
        case "Triple Kick":
        case "Triple Axel":
            if (move.currTripleHit)
                basePower = move.bp * move.currTripleHit;
            else
                basePower = move.bp;
            break;
        //i.vii. Trump Card
        //i.viii. Last Respects, Rage Fist
        case "Last Respects":
        case "Rage Fist":
            basePower = move.bp * (move.timesAffected + 1);
            if (move.timesAffected)
                description.moveBP = basePower;
            break;
        //i.ix. Dark Void (Legends Z-A)         NEEDS TO BE VERIFIED
        case "Dark Void":
            if (gen == 9.5 && defender.status == "Drowsy") {
                basePower = 2 * move.bp;
                description.moveBP = basePower;
            }
            else {
                basePower = move.bp;
            }
            break;
        default:
            if (move.isDouble && ['Retaliate', 'Fusion Bolt', 'Fusion Flare', 'Lash Out'].indexOf(move.name) === -1) {
                basePower = 2 * move.bp;
                if (basePower !== move.bp) description.moveBP = basePower;
            }
            else {
                basePower = move.bp;
                if (!move.isZ && basePower !== moves[move.name].bp && !description.moveBP) {
                    description.moveBP = basePower;
                }
            }
    }

    return [basePower, description];
}

//2. BP Mods
function calcBPMods(attacker, defender, field, move, description, ateIzeBoosted, basePower, attIsGrounded, defIsGrounded, turnOrder, defAbility, isMeFirst) {
    var bpMods = [];
    var isAttackerAura = attacker.ability === (move.type + " Aura");
    var isDefenderAura = defAbility === (move.type + " Aura");
    var auraActive = ($("input:checkbox[id='" + move.type.toLowerCase() + "-aura']:checked").val() != undefined);
    var auraBreak = ($("input:checkbox[id='aura-break']:checked").val() != undefined);

    //a. Aura Break
    if (auraActive && auraBreak && !field.isNeutralizingGas && defAbility !== '[ignored]') {
        bpMods.push(0x0C00);
        if (isAttackerAura || attacker.ability == "Aura Break") {
            description.attackerAbility = attacker.ability;
        }
        else if (isDefenderAura || defAbility == "Aura Break") {
            description.defenderAbility = defAbility;
        }
    }

    //b. Rivalry
    if (attacker.ability == "Rivalry" && attacker.rivalryGender != '') {
        if (attacker.rivalryGender == 'Same') {
            bpMods.push(0x1400);
            description.attackerAbility = 'Rivalry (1.25x)';
        }
        else if (attacker.rivalryGender == 'Opposite') {
            bpMods.push(0x0C00);
            description.attackerAbility = 'Rivalry (0.75x)';
        }
    }

    //c. 1.2x Abilities
    //c.i. Galvanize, Aerilate, Pixilate, Refrigerate, Dragonize, Normalize        (Technically Normalize is separate but it doesn't hurt to handle it where it is now)
    if (!move.isZ && !attacker.isDynamax && ateIzeBoosted) {     //function checkAbilityTypeChange sets this value
        var ateIzeMultiplier = gen > 6 ? 0x1333 : 0x14CD;
        bpMods.push(ateIzeMultiplier);
        description.attackerAbility = attacker.ability;
    }
    //c.ii Reckless, Iron Fist                                          (Same deal; hasRecoil shouldn't ever be true, but it's still checked for unknown recoil amount)
    else if ((attacker.ability === "Reckless" && (move.hasRecoil || move.recoilHP || move.hasCrash)) || (attacker.ability === "Iron Fist" && move.isPunch)) {
        bpMods.push(0x1333);
        description.attackerAbility = attacker.ability;
    }

    //d. Field Abilities
    //d.i. Battery
    if (field.isBattery && move.category === "Special") {
        bpMods.push(0x14CD);
        description.isBattery = true;
    }
    //d.ii. Power Spot
    if (field.isPowerSpot) {
        bpMods.push(0x14CD);
        description.isPowerSpot = true;
    }
    //d.iii. Ally Steely Spirit (probably doesn't go here but Smogon makes Doubles research a pain to find)
    if (field.isSteelySpirit && move.type === "Steel") {
        bpMods.push(0x1800);
        description.isSteelySpirit = true;
    }

    //e. 1.3x Abilities
    //e.i. Sheer Force
    if (attacker.ability === "Sheer Force" && move.hasSecondaryEffect) {
        bpMods.push(0x14CD);
        description.attackerAbility = attacker.ability;
    }
    //e.ii. Sand Force
    else if (attacker.ability === "Sand Force" && field.weather === "Sand" && ["Rock", "Ground", "Steel"].indexOf(move.type) !== -1) {
        bpMods.push(0x14CD);
        description.attackerAbility = attacker.ability;
        description.weather = field.weather;
    }
    //e.iii. Analytic
    else if (attacker.ability === "Analytic" && turnOrder !== "FIRST") {
        bpMods.push(0x14CD);
        description.attackerAbility = attacker.ability;
    }
    //e.iv. Tough Claws
    else if (attacker.ability === "Tough Claws" && move.makesContact) {
        bpMods.push(0x14CD);
        description.attackerAbility = attacker.ability;
    }
    //e.v. Punk Rock
    else if (attacker.ability == "Punk Rock" && move.isSound) {
        bpMods.push(0x14CD);
        description.attackerAbility = attacker.ability;
    }

    //f. Fairy Aura, Dark Aura
    if (auraActive && !auraBreak && !field.isNeutralizingGas && (gen > 7 || defAbility !== '[ignored]')) {
        bpMods.push(0x1548);
        if (isAttackerAura) {
            description.attackerAbility = attacker.ability;
        }
        else if (isDefenderAura) {
            description.defenderAbility = defAbility;
        }
    }

    //If the BP before this point would trigger Technician, don't apply it
    var tempBP = pokeRound(basePower * chainMods(bpMods) / 0x1000);

    //g. 1.5x Abilities (Technician, Flare Boost, Toxic Boost, Strong Jaw, Mega Launcher, Steely Spirit)
    if ((attacker.ability === "Technician" && tempBP <= 60) ||
        (attacker.ability === "Flare Boost" && attacker.status === "Burned" && move.category === "Special") ||
        (attacker.ability === "Toxic Boost" && (attacker.status === "Poisoned" || attacker.status === "Badly Poisoned") && move.category === "Physical") ||
        (attacker.ability === "Mega Launcher" && move.isPulse) ||
        (attacker.ability === "Strong Jaw" && move.isBite) ||
        (attacker.ability === "Steely Spirit" && move.type === "Steel")) {
        bpMods.push(0x1800);
        description.attackerAbility = attacker.ability;
    }

    //h. Heatproof (pre Gen 9)
    if (defAbility === "Heatproof" && move.type === "Fire" & gen < 9) {
        bpMods.push(0x800);
        description.defenderAbility = defAbility;
    }

    //i. Dry Skin
    else if (defAbility === "Dry Skin" && move.type === "Fire") {
        bpMods.push(0x1400);
        description.defenderAbility = defAbility;
    }

    //j. 1.1x Items
    if ((attacker.item === "Muscle Band" && move.category === "Physical")
        || (attacker.item === "Wise Glasses" && move.category === "Special")) {
        bpMods.push(0x1199);
        description.attackerItem = attacker.item;
    }

    //k. 1.2x Items
    else if (getItemBoostType(attacker.item) === move.type) {
        var itemTypeMultiplier = 0x1333;
        bpMods.push(itemTypeMultiplier);
        description.attackerItem = attacker.item;
    }
    else if (getItemDualTypeBoost(attacker.item, attacker.name).indexOf(move.type) !== -1) {
        bpMods.push(0x1333);
        description.attackerItem = attacker.item;
    }
    else if (attacker.item && attacker.item.indexOf(' Mask') !== -1 && attacker.name && attacker.name.indexOf('Ogerpon-') !== -1
        && attacker.item.substring(0, attacker.item.indexOf(' Mask')) === attacker.name.substring(8) && attacker.name.indexOf('(') === -1) {
        bpMods.push(0x1333);
        description.maskBoost = true;
    }

    //l. Gems
    else if (attacker.item === move.type + " Gem" && !move.isPledge) {
        var gemMultiplier = gen > 5 ? 0x14CD : 0x1800;
        bpMods.push(gemMultiplier);
        description.attackerItem = attacker.item;
    }

    //m. Solar Beam, Solar Blade
    if ((move.name === "Solar Beam" || move.name === "Solar Blade") && !(["None", "Sun", "Harsh Sun", "Strong Winds", ""].includes(field.weather)) && attacker.item !== 'Utility Umbrella' && attacker.ability !== 'Mega Sol') {
        bpMods.push(0x800);
        description.moveBP = move.bp / 2;
        description.weather = field.weather;
    }

    //n. Me First
    if (isMeFirst) {
        bpMods.push(0x1800);
        description.meFirst = true;
    }

    //o. Knock Off
    if (gen > 5 && move.name === "Knock Off" && defender.name !== null && !cantRemoveItem(defender.item, defender.name, field.terrain)) {
        bpMods.push(0x1800);
        description.moveBP = move.bp * 1.5;
    }
    //p. Psyblade
    else if (field.terrain === "Electric" && move.name === "Psyblade") {
        bpMods.push(0x1800);
        description.moveBP = move.bp * 1.5;
        description.terrain = field.terrain;
    }
    //q. Misty Explosion
    else if ((move.name === "Misty Explosion" && field.terrain == "Misty" && attIsGrounded) ||
        (move.name === "Grav Apple" && field.isGravity)) {
        bpMods.push(0x1800);
        description.moveBP = move.bp * 1.5;
    }
    //r. Expanding Force
    else if (move.name === "Expanding Force" && field.terrain == "Psychic" && attIsGrounded) {
        bpMods.push(0x1800);
        description.moveBP = move.bp * 1.5;
    }

    //s. Helping Hand
    if (field.isHelpingHand) {
        bpMods.push(0x1800);
        description.isHelpingHand = true;
    }

    //t. Charge, Electromorphosis, Wind Power
    if ((((attacker.ability === "Electromorphosis" || attacker.ability === "Wind Power") && attacker.abilityOn) || field.isCharge) && move.type === "Electric") {
        bpMods.push(0x2000);
        description.charged = true;
    }

    //u. Double power (Facade, Brine, Venoshock, Retaliate, Fusion Bolt, Fusion Flare, Lash Out)
    if ((move.name === "Facade" && ["Burned", "Paralyzed", "Poisoned", "Badly Poisoned"].indexOf(attacker.status) !== -1) ||
        (move.name === "Brine" && defender.curHP <= defender.maxHP / 2) ||
        (["Venoshock", "Barb Barrage"].indexOf(move.name) !== -1 && (defender.status === "Poisoned" || defender.status === "Badly Poisoned")) ||
        (['Retaliate', 'Fusion Bolt', 'Fusion Flare', 'Lash Out'].indexOf(move.name) !== -1 && move.isDouble)) {
        bpMods.push(0x2000);
        description.moveBP = move.bp * 2;
    }

    //v. Offensive Terrain
    if (attIsGrounded) {
        var terrainMultiplier = gen > 7 ? 0x14CD : 0x1800;
        if (field.terrain === "Electric" && move.type === "Electric") {
            bpMods.push(terrainMultiplier);
            description.terrain = field.terrain;
        } else if (field.terrain === "Grassy" && move.type == "Grass") {
            bpMods.push(terrainMultiplier);
            description.terrain = field.terrain;
        } else if (field.terrain === "Psychic" && move.type == "Psychic") {
            bpMods.push(terrainMultiplier);
            description.terrain = field.terrain;
        }
    }
    //w. Defensive Terrain
    if (defIsGrounded) {
        if ((field.terrain === "Misty" && move.type === "Dragon") ||
            (field.terrain === "Grassy" && (move.name === "Earthquake" || move.name === "Bulldoze"))) {
            bpMods.push(0x800);
            description.terrain = field.terrain;
        }
    }

    //x. Mud Sport, Water Sport

    //y. Supreme Overlord
    if (attacker.ability === "Supreme Overlord" && attacker.supremeOverlord > 0) {
        overlordBoost = [0x119A, 0x1333, 0x14CD, 0x1666, 0x1800];
        bpMods.push(overlordBoost[attacker.supremeOverlord - 1]);
        description.attackerAbility = attacker.supremeOverlord > 1 ? attacker.ability + " (" + attacker.supremeOverlord + " allies down)"
            : attacker.ability + " (1 ally down)";
    }
    //z. Punching Glove
    if (attacker.item === "Punching Glove" && move.isPunch) {
        bpMods.push(0x119A);
        description.attackerItem = attacker.item;
    }

    //If the BP before this point would exceed 60 BP, don't apply it
    tempBP = pokeRound(basePower * chainMods(bpMods) / 0x1000);

    //aa. Tera boost for moves with <60 BP
    if (attacker.isTerastalize && (move.type === attacker.tera_type || (attacker.tera_type === 'Stellar' && move.getsStellarBoost)) && tempBP < 60 && canTeraBoost60BP(move)) {
        bpMods.push(60 / tempBP * 0x1000);
        description.teraBPBoost = true;
    }

    //MECHANICS TESTING
    if (attacker.hasCustomModifiers && attacker.customModifiers['bpMods']) {
        let customBPMods = attacker.customModifiers['bpMods'];
        for (let i = 0; i < customBPMods.length; i++) {
            bpMods.push(customBPMods[i]);
        }
        description.isMechanicsTest = true;
    }

    return [bpMods, description, move];
}

function canTeraBoost60BP(move) {
    var priority = move.isPriority;
    var multiHit = move.hitRange ? true : false;
    var otherExceptions = ["Crush Grip", "Dragon Energy", "Electro Ball", "Eruption", "Flail", "Fling", "Grass Knot", "Gyro Ball",
        "Heat Crash", "Heavy Slam", "Low Kick", "Reversal", "Water Spout", "Hard Press"].indexOf(move.name) !== -1;
    return !priority && !multiHit && !otherExceptions;
}

//3. Attack
function calcAttack(move, attacker, defender, description, isCritical, defAbility) {
    //a. Foul Play, Photon Geyser, Light That Burns The Sky, Shell Side Arm, Body Press, Tera Blast
    var attack;
    var attackSource = move.name === "Foul Play" ? defender : attacker;
    var usesDefenseStat = move.name === "Body Press";
    var attackStat = usesDefenseStat ? DF : move.category === "Physical" ? AT : SA;
    var isMidMoveAtkBoost = false;
    var isContrary = attacker.ability === 'Contrary' ? -1 : 1;
    var maxBoost = gen == 9.5 ? 1 : 6;
    var attackInvest = gen < 10 ? attackSource.evs[attackStat] : resultDisplayMode == "SPs" ? attackSource.sps[attackStat] : resultDisplayMode == "EVs" ? Math.max(0, attackSource.sps[attackStat] * 8 - 4) : attackSource.rawStats[attackStat];
    description.attackEVs = attackInvest +
        ((gen < 10 || resultDisplayMode !='raw') && NATURES[attackSource.nature][0] === attackStat ? "+" : (gen < 10 || resultDisplayMode !='raw') && NATURES[attackSource.nature][1] === attackStat ? "-" : "") + " " +
        toSmogonStat(attackStat) + (attackSource.ivs[attackStat] < 31 ? " " + attackSource.ivs[attackStat] + " IV" : "");
    description.usesOppAtkStat = move.name === "Foul Play";
    //Spectral Thief and Meteor Beam aren't part of the calculations but are instead here to properly account for the boosts they give
    if (move.name === "Spectral Thief" && defender.boosts[attackStat] > 0) {
        attacker.boosts[attackStat] = Math.min(maxBoost, attacker.boosts[attackStat] + defender.boosts[attackStat]);
        isMidMoveAtkBoost = true;
    }
    else if (["Meteor Beam", "Electro Shot"].indexOf(move.name) !== -1 && ((isContrary === -1 && attacker.boosts[attackStat] > -1 * maxBoost) || attacker.boosts[attackStat] < maxBoost)) {
        attacker.boosts[attackStat] += (1 * isContrary);
        isMidMoveAtkBoost = true;
    }
    //b. Unaware
    if (defAbility === "Unaware" && attackSource.boosts[attackStat] !== 0) {
        attack = attackSource.rawStats[attackStat];
        description.defenderAbility = defAbility;
        description.attackBoost = attackSource.boosts[attackStat];
    }
    else if (isMidMoveAtkBoost) {
        description.attackBoost = attacker.boosts[attackStat];
        attack = getModifiedStat(attackSource.rawStats[attackStat], attacker.boosts[attackStat]);
        attacker.boosts[attackStat] -= (1 * isContrary);
    }
    //c. Crit
    else if (attackSource.boosts[attackStat] === 0 || (isCritical && attackSource.boosts[attackStat] < 0)) {
        attack = attackSource.rawStats[attackStat];
    }
    //THIS IS NEEDED TO GUARANTEE CATCH ALL UNAWARE CONDITIONS, WITHOUT IT SOME WILL SLIP BY!!!
    else if (defAbility === "Unaware") {
        attack = attackSource.rawStats[attackStat];
    }
    //d. Attack boosts and drops
    else {
        attack = attackSource.stats[attackStat];
        description.attackBoost = attackSource.boosts[attackStat];
    }

    //e. Hustle
    // unlike all other attack modifiers, Hustle gets applied directly
    if (attacker.ability === "Hustle" && move.category === "Physical") {
        attack = pokeRound(attack * 3 / 2);
        description.attackerAbility = attacker.ability;
    }

    return [attack, description];
}

//4. Attack Mods
function calcAtMods(move, attacker, defAbility, description, field) {
    atMods = [];
    var ruinActive = {
        "Tablets of Ruin": $("input:checkbox[id='tablets-of-ruin']:checked").val() != undefined && !field.isNeutralizingGas,
        "Vessel of Ruin": $("input:checkbox[id='vessel-of-ruin']:checked").val() != undefined && !field.isNeutralizingGas,
    };

    //a. Tablets of Ruin, Vessel of Ruin
    if (ruinActive["Tablets of Ruin"] && move.category === "Physical" && attacker.ability !== "Tablets of Ruin") {
        atMods.push(0x0C00);
        description.ruinTabletsVessel = "Tablets";
    }
    else if (ruinActive["Vessel of Ruin"] && move.category === "Special" && attacker.ability !== "Vessel of Ruin") {
        atMods.push(0x0C00);
        description.ruinTabletsVessel = "Vessel";
    }

    //b. 0.5x Abilities
    //Slow Start also halves damage with special Z-moves
    if ((attacker.ability === "Slow Start" && attacker.abilityOn && (move.category === "Physical" || (move.category === "Special" && move.isZ))) ||
        (attacker.ability === "Defeatist" && attacker.curHP <= attacker.maxHP / 2)) {
        atMods.push(0x800);
        description.attackerAbility = attacker.ability;
    }
    //c. Flower Gift
    if (attacker.ability === "Flower Gift" && attacker.name === "Cherrim" && field.weather.indexOf("Sun") > -1 && move.category === "Physical" && attacker.item !== 'Utility Umbrella') {
        atMods.push(0x1800);
        description.attackerAbility = attacker.ability;
        description.weather = field.weather;
    }
    else if (field.isFlowerGiftAtk && field.weather.indexOf("Sun") > -1 && move.category === "Physical" && attacker.item !== 'Utility Umbrella') {
        atMods.push(0x1800);
        description.isFlowerGiftAtk = true;
        description.weather = field.weather;
    }
    //d. 1.5x Offensive Abilities
    if ((attacker.ability === "Guts" && attacker.status !== "Healthy" && move.category === "Physical")
        || (attacker.ability === "Overgrow" && attacker.curHP <= attacker.maxHP / 3 && move.type === "Grass")
        || (attacker.ability === "Blaze" && attacker.curHP <= attacker.maxHP / 3 && move.type === "Fire")
        || (attacker.ability === "Torrent" && attacker.curHP <= attacker.maxHP / 3 && move.type === "Water")
        || (attacker.ability === "Swarm" && attacker.curHP <= attacker.maxHP / 3 && move.type === "Bug")
        || (attacker.ability === "Transistor" && move.type === "Electric" && gen == 8)
        || (attacker.ability === "Dragon's Maw" && move.type === "Dragon")
        || (attacker.ability === "Flash Fire" && attacker.abilityOn && move.type === "Fire")
        || (attacker.ability === "Steelworker" && move.type === "Steel")
        || (attacker.ability === "Gorilla Tactics" && move.category === "Physical" && !attacker.isDynamax)
        || (["Plus", "Minus"].indexOf(attacker.ability) !== -1 && attacker.abilityOn)
        || (attacker.ability === "Sharpness" && move.isSlice)
        || (attacker.ability === "Rocky Payload" && move.type === "Rock")
        || (attacker.ability === "Fire Mane" && move.type === "Fire")) {
        atMods.push(0x1800);
        description.attackerAbility = attacker.ability;
    }
    else if (attacker.ability === "Solar Power" && field.weather.indexOf("Sun") > -1 && move.category === "Special" && attacker.item !== 'Utility Umbrella') {
        atMods.push(0x1800);
        description.attackerAbility = attacker.ability;
        description.weather = field.weather;
    }
    //e. 1.3x Abilities
    else if (attacker.paradoxAbilityBoost && ((attacker.highestStat === 'at' && move.category === "Physical") || (attacker.highestStat === 'sa' && move.category === "Special"))
        || (attacker.ability === "Transistor" && move.type === "Electric" && gen >= 9)) {
        atMods.push(0x14CD);
        description.attackerAbility = attacker.ability;
    }
    //f. Orichalcum Pulse, Hadron Engine
    else if ((attacker.ability == "Orichalcum Pulse" && field.weather === "Sun" && move.category === "Physical" && attacker.item !== "Utility Umbrella")
        || (attacker.ability == "Hadron Engine" && field.terrain === "Electric" && move.category === "Special")) {
        atMods.push(0x1555);
        description.attackerAbility = attacker.ability;
    }

    //g. 2.0x Offensive Abilities
    if ((attacker.ability === "Water Bubble" && move.type === "Water") ||
        ((attacker.ability === "Huge Power" || attacker.ability === "Pure Power") && move.category === "Physical")
        || (attacker.ability === "Stakeout" && attacker.abilityOn)) {
        atMods.push(0x2000);
        description.attackerAbility = attacker.ability;
    }
    //h. 0.5x Defensive Abilities
    if ((defAbility === "Thick Fat" && (move.type === "Fire" || move.type === "Ice"))
        || (defAbility === "Water Bubble" && move.type === "Fire")
        || (defAbility === "Purifying Salt" && move.type === "Ghost")
        || (defAbility === 'Heatproof' && move.type === 'Fire' && gen >= 9)) {
        atMods.push(0x800);
        description.defenderAbility = defAbility;
    }

    //i. 2.0x Items
    if ((attacker.item === "Thick Club" && (attacker.name === "Cubone" || attacker.name === "Marowak" || attacker.name === "Marowak-Alola") && move.category === "Physical") ||
        (attacker.item === "Deep Sea Tooth" && attacker.name === "Clamperl" && move.category === "Special") ||
        (attacker.item === "Light Ball" && (attacker.name === "Pikachu" || attacker.name === "Pikachu-Gmax"))) {
        atMods.push(0x2000);
        description.attackerItem = attacker.item;
    } //j. 1.5x Items
    else if ((attacker.item === "Choice Band" && move.category === "Physical" && !attacker.isDynamax) ||
        (attacker.item === "Choice Specs" && move.category === "Special" && !attacker.isDynamax) ||
        (attacker.item === "Soul Dew" && ["Latias", "Latios"].indexOf(attacker.name) !== -1 && move.category === 'Special' && gen <= 6)) {
        atMods.push(0x1800);
        description.attackerItem = attacker.item;
    }
    //k. Link Battle Red Item (LEGENDS Z-A ONLY)
    if (field.isRedItem) {
        atMods.push(0x2000);
        description.redItem = true;
    }

    //MECHANICS TESTING
    if (attacker.hasCustomModifiers && attacker.customModifiers['atMods']) {
        let customATMods = attacker.customModifiers['atMods'];
        for (let i = 0; i < customATMods.length; i++) {
            atMods.push(customATMods[i]);
        }
        description.isMechanicsTest = true;
    }

    return [atMods, description];
}

//5. Defense
function calcDefense(move, attacker, defender, description, hitsPhysical, isCritical, field) {
    //a. Psyshock, Psystrike, Secret Sword (handled in hitsPhysical declaration)
    var defenseStat = hitsPhysical ? DF : SD;
    var defenseInvest = gen < 10 ? defender.evs[defenseStat] : resultDisplayMode == "SPs" ? defender.sps[defenseStat] : resultDisplayMode == "EVs" ? Math.max(0, defender.sps[defenseStat] * 8 - 4) : defender.rawStats[defenseStat];
    description.defenseEVs = defenseInvest +
        ((gen < 10 || resultDisplayMode !='raw') && NATURES[defender.nature][0] === defenseStat ? "+" : (gen < 10 || resultDisplayMode !='raw') && NATURES[defender.nature][1] === defenseStat ? "-" : "") + " " +
        toSmogonStat(defenseStat) + (defender.ivs[defenseStat] < 31 ? " " + defender.ivs[defenseStat] + " IV" : "");

    //b. Wonder Room

    //Spectral Thief isn't part of the calculations but is instead here to properly account for the boosts it takes
    if (move.name === "Spectral Thief" && defender.boosts[defenseStat] > 0) {
        defense = defender.rawStats[defenseStat];
    }
    //c. Unaware
    else if (attacker.ability === "Unaware" && defender.boosts[defenseStat] !== 0) {
        defense = defender.rawStats[defenseStat];
        description.attackerAbility = attacker.ability;
        description.defenseBoost = defender.boosts[defenseStat];
    }
    //d. Chip Away, Sacred Sword
    else if (move.ignoresDefenseBoosts && defender.boosts[defenseStat] !== 0) {
        defense = defender.rawStats[defenseStat];
        description.defenseBoost = defender.boosts[defenseStat];
    }
    //e. Crits
    else if (defender.boosts[defenseStat] === 0 || (isCritical && defender.boosts[defenseStat] > 0)) {
        defense = defender.rawStats[defenseStat];
    }
    //THIS IS NEEDED TO GUARANTEE CATCH ALL UNAWARE AND SACRED SWORD CONDITIONS, WITHOUT IT SOME WILL SLIP BY!!!
    else if (move.ignoresDefenseBoosts || attacker.ability === "Unaware") {
        defense = defender.rawStats[defenseStat];
    }
    // f. Defense drops and boosts
    else {
        defense = defender.stats[defenseStat];
        description.defenseBoost = defender.boosts[defenseStat];
    }

    //g. Sandstorm Rock types, Snowstorm Ice Types
    // unlike all other defense modifiers, Sandstorm SpD boost gets applied directly
    if (((field.weather === "Sand" && defender.hasType("Rock") && !hitsPhysical) || (field.weather === "Snow" && defender.hasType("Ice") && hitsPhysical))
        && attacker.ability !== 'Mega Sol') {
        defense = pokeRound(defense * 3 / 2);
        description.weather = field.weather;
    }
    return [defense, description];
}

//6. Defense Mods
function calcDefMods(move, defender, field, description, hitsPhysical, defAbility) {
    var dfMods = [];
    var ruinActive = {
        "Sword of Ruin": $("input:checkbox[id='sword-of-ruin']:checked").val() != undefined && !field.isNeutralizingGas,
        "Beads of Ruin": $("input:checkbox[id='beads-of-ruin']:checked").val() != undefined && !field.isNeutralizingGas,
    };

    //a. Sword of Ruin, Beads of Ruin
    if (ruinActive["Sword of Ruin"] && hitsPhysical && defAbility !== "Sword of Ruin") {
        dfMods.push(0x0C00);
        description.ruinSwordBeads = "Sword";
    }
    else if (ruinActive["Beads of Ruin"] && !hitsPhysical && defAbility !== "Beads of Ruin") {
        dfMods.push(0x0C00);
        description.ruinSwordBeads = "Beads";
    }

    //b. Flower Gift
    if (defAbility === "Flower Gift" && defender.name === "Cherrim" && field.weather.indexOf("Sun") > -1 && !hitsPhysical && defender.item !== 'Utility Umbrella') {
        dfMods.push(0x1800);
        description.defenderAbility = defAbility;
        description.weather = field.weather;
    }
    else if (field.isFlowerGiftSpD && field.weather.indexOf("Sun") > -1 && !hitsPhysical && defender.item !== 'Utility Umbrella') {
        dfMods.push(0x1800);
        description.isFlowerGiftSpD = true;
        description.weather = field.weather;
    }
    //c. 1.5x Abilities
    if ((defAbility === "Marvel Scale" && defender.status !== "Healthy" && hitsPhysical) ||
        (defAbility === "Grass Pelt" && field.terrain === "Grassy" && hitsPhysical)) {
        dfMods.push(0x1800);
        description.defenderAbility = defAbility;
    }
    //d. 1.3x Abilities
    else if (defender.paradoxAbilityBoost && ((defender.highestStat === 'df' && hitsPhysical) || (defender.highestStat === 'sd' && !hitsPhysical))) {
        dfMods.push(0x14CD);
        description.defenderAbility = defAbility;
    }
    //e. 2x Abilities
    else if (defAbility === "Fur Coat" && hitsPhysical) {
        dfMods.push(0x2000);
        description.defenderAbility = defAbility;
    }
    //f. 1.5x Items
    if ((defender.item === "Assault Vest" && !hitsPhysical) ||
        (defender.item === "Eviolite" && defender.canEvolve) ||
        (defender.item === "Soul Dew" && ["Latias", "Latios"].indexOf(defender.name) !== -1 && !hitsPhysical && gen <= 6)) {
        dfMods.push(0x1800);
        description.defenderItem = defender.item;
    } //g. 2.0x Items
    else if ((defender.item === "Deep Sea Scale" && defender.name === "Clamperl" && !hitsPhysical) ||
        (defender.item === "Metal Powder" && defender.name === "Ditto" && hitsPhysical)) {
        dfMods.push(0x2000);
        description.defenderItem = defender.item;
    }
    //h. Link Battle Blue Item (LEGENDS Z-A ONLY)
    if (field.isBlueItem) {
        dfMods.push(0x2000);
        description.blueItem = true;
    }

    //MECHANICS TESTING
    if (defender.hasCustomModifiers && defender.customModifiers['dfMods']) {
        let customDFMods = defender.customModifiers['dfMods'];
        for (let i = 0; i < customDFMods.length; i++) {
            dfMods.push(customDFMods[i]);
        }
        description.isMechanicsTest = true;
    }

    return [dfMods, description];
}

//7. Base Damage
function calcBaseDamage(attacker, basePower, attack, defense) {
    return Math.floor(Math.floor((Math.floor((2 * attacker.level) / 5 + 2) * basePower * attack) / defense) / 50 + 2);
}

//8. General Damage Mods
function calcGeneralMods(baseDamage, move, attacker, defender, defAbility, field, description, isCritical, typeEffectiveness, isQuarteredByProtect, hitsPhysical) {
    //a. Spread Move mod
    if (field.format !== "Singles" && move.isSpread) {
        baseDamage = pokeRound(baseDamage * 0xC00 / 0x1000);
    }
    //b. Parental Bond mod
    var childMod = gen >= 7 ? 0x0400 : 0x0800;
    baseDamage = attacker.isChild ? pokeRound(baseDamage * childMod / 0x1000) : baseDamage;    //should be accurate based on implementation
    //c. Weather mod, Hydro Steam
    if (((((field.weather.indexOf("Sun") > -1 || attacker.ability === 'Mega Sol') && move.type === "Fire") || (field.weather.indexOf("Rain") > -1 && move.type === "Water")) && defender.item !== 'Utility Umbrella')
        || ((field.weather.indexOf("Sun") > -1 || attacker.ability === 'Mega Sol') && move.name === "Hydro Steam" && attacker.item !== 'Utility Umbrella')) {
        baseDamage = pokeRound(baseDamage * 0x1800 / 0x1000);
        if (attacker.ability === 'Mega Sol') {
            description.attackerAbility = attacker.ability;
        }
        else {
            description.weather = field.weather;
        }
    }
    else if (((field.weather === "Sun" && move.type === "Water") || (field.weather === "Rain" && move.type === "Fire" && attacker.ability !== 'Mega Sol')) && defender.item !== 'Utility Umbrella') {
        baseDamage = pokeRound(baseDamage * 0x800 / 0x1000);
        description.weather = field.weather;
    }
    else if ((field.weather === "Strong Winds" && defender.hasType("Flying") &&
        typeChart[move.type]["Flying"] > 1)) {
        description.weather = field.weather;        //not actually a mod, just adding the description here
    }
    //d. Glaive Rush 2x mod
    if (defender.glaiveRushMod) {
        baseDamage = pokeRound(baseDamage * 0x2000 / 0x1000);
        description.isGlaiveMod = true;
    }
    //e. Crit mod
    if (isCritical) {
        baseDamage = Math.floor(baseDamage * (gen >= 6 ? 1.5 : 2));
        description.isCritical = isCritical;
    }
    // the random factor is applied between the crit mod and the stab mod, so don't apply anything below this until we're inside the loop
    //see GENERAL MODS CONTINUED for further comments

    var stabMod = 0x1000;
    if (move.type !== 'Typeless') {     //Typeless moves cannot get stab even if the user is Typeless
        if (attacker.isTerastalize && attacker.tera_type !== 'Stellar') {
            if (move.type === attacker.tera_type && [attacker.teraSTAB1, attacker.teraSTAB2].indexOf(attacker.tera_type) !== -1 ) {
                if (attacker.ability === "Adaptability") {
                    stabMod = 0x2400;
                    description.attackerAbility = attacker.ability;
                } else {
                    stabMod = 0x2000;
                }
            }
            else if ((move.type !== attacker.tera_type && [attacker.teraSTAB1, attacker.teraSTAB2].indexOf(move.type) !== -1) || move.type === attacker.tera_type) {
                if (attacker.ability === "Adaptability" && move.type === attacker.tera_type) {
                    stabMod = 0x2000;
                    description.attackerAbility = attacker.ability;
                } else {
                    stabMod = 0x1800;
                }
            }
        }
        else if (attacker.isTerastalize && (move.getsStellarBoost || attacker.name === 'Terapagos-Stellar')) { //Tera Type being Stellar is implicit
            if (attacker.hasType(move.type) || (move.combinePledge && move.combinePledge !== move.name)) {
                stabMod = 0x2000;
            }
            else {
                stabMod = 0x1333;
            }
            if (attacker.name !== 'Terapagos-Stellar') description.stellarBoost = true;
        }
        else { //Covers for non-terastalized and Stellar being used up
            if (attacker.hasType(move.type) || (move.combinePledge && move.combinePledge !== move.name)) {
                if (attacker.ability === "Adaptability") {
                    stabMod = 0x2000;
                    description.attackerAbility = attacker.ability;
                } else {
                    stabMod = 0x1800;
                }
            } else if (["Protean", "Libero"].indexOf(attacker.ability) !== -1 && (gen < 9 || attacker.abilityOn)) {
                stabMod = 0x1800;
                description.attackerAbility = attacker.ability;
            }
        }
    }
    var applyBurn = (attacker.status === "Burned" && move.category === "Physical" && attacker.ability !== "Guts" && !move.ignoresBurn);
    description.isBurned = applyBurn;
    var finalMod;
    [finalMod, description] = calcFinalMods(move, attacker, defender, field, description, isCritical, typeEffectiveness, defAbility);
    finalMods = chainMods(finalMod);
    var reSortDamage = false;

    var damage = [], additionalDamage = [], allDamage = [];
    var minDamageValue = 85;    //this has been made into a value in case of any more damage roll alterations

    //GENERAL MODS CONTINUED
    for (var i = 0; i + minDamageValue <= 100; i++) { //e. Rand mod
        damage[i] = Math.floor(baseDamage * (minDamageValue + i) / 100);
        //f. STAB mod (with Terastal changes)
        damage[i] = pokeRound(damage[i] * stabMod / 0x1000);
        //g. Type Effect mod
        damage[i] = Math.floor(damage[i] * typeEffectiveness);
        //h. Burn mod
        if (applyBurn) {
            damage[i] = Math.floor(damage[i] / 2);
        }
        //i. Final mods
        damage[i] = pokeRound(damage[i] * finalMods / 0x1000);
        //j. Z-move and Max move protecting mod
        if (isQuarteredByProtect) {
            damage[i] = pokeRound(damage[i] * 0x400 / 0x1000);
            description.isQuarteredByProtect = true;
        }
        //k. Damage Reduction (LEGENDS Z-A ONLY)
        if (gen == 9.5) {
            damage[i] = Math.floor(Math.floor(damage[i] * 70) / 100);
        }
        //l. Min Damage Check
        damage[i] = Math.max(1, damage[i]);
        //m. Max Damage Check
        if (damage[i] > 65535) {
            damage[i] %= 65536;
            reSortDamage = true;
        }
    }

    if (reSortDamage) {
        damage.sort(numericSort);
    }

    //if (defAbility === 'Sand Spit' && field.weather !== 'Sand' && !(['Harsh Sun', 'Heavy Rain', 'Strong Winds'].includes(defAbility))) {
    //    field.weather = 'Sand';
    //}
    //else if (defAbility === 'Seed Sower' && field.terrain !== 'Grassy') {
    //    field.terrain = 'Grassy';
    //}

    if (!move.isNextMove) {
        var addQualList = checkAddCalcQualifications(attacker, defender, move, field, hitsPhysical);
        var addCalcQualified = false;
        for (check in addQualList) {
            if (addQualList[check]) {
                addCalcQualified = true;
                break;
            }
        }
        if (addCalcQualified) {
            additionalDamage = additionalDamageCalcs(attacker, defender, move, field, description, addQualList);
            allDamage[0] = damage;
        }
        else
            allDamage = damage;
        if (additionalDamage.length) {
            for (var i = 0; i < additionalDamage.length; i++) {
                allDamage[i + 1] = additionalDamage[i];
            }
        }
    }
    else
        allDamage = damage;

    return {
        "damage": allDamage,
        "description": buildDescription(description)
    };
}

//9. Finals Damage Mods
function calcFinalMods(move, attacker, defender, field, description, isCritical, typeEffectiveness, defAbility) {
    var finalMods = [];
    //a. Screens/Aurora Veil
    if (field.isAuroraVeil && !isCritical && !move.ignoresScreens) {
        finalMods.push(field.format !== "Singles" ? 0xAAC : 0x800);
        description.isAuroraVeil = true;
    }
    else if (field.isReflect && move.category === "Physical" && !isCritical && !move.ignoresScreens) {  //Note: Reflect/Light Screen stop physical/special moves respectively, NOT moves that hit physical/special
        finalMods.push(field.format !== "Singles" ? 0xAAC : 0x800);
        description.isReflect = true;
    } else if (field.isLightScreen && move.category === "Special" && !isCritical) {
        finalMods.push(field.format !== "Singles" ? 0xAAC : 0x800);
        description.isLightScreen = true;
    }
    if (defender.isDynamax) description.isDynamax = true;
    //b. Neuroforce
    if (attacker.ability === "Neuroforce" && typeEffectiveness > 1) {
        finalMods.push(0x1400);
        description.attackerAbility = attacker.ability;
    }
    //c. Collision Course/Electro Drift
    if (["Collision Course", "Electro Drift"].indexOf(move.name) !== -1 && typeEffectiveness > 1) {
        finalMods.push(0x1555);
        description.courseDriftSE = true;
    }
    //d. Sniper
    if (attacker.ability === "Sniper" && isCritical) {
        finalMods.push(0x1800);
        description.attackerAbility = attacker.ability;
    }
    //e. Tinted Lens
    if (attacker.ability === "Tinted Lens" && typeEffectiveness < 1) {
        finalMods.push(0x2000);
        description.attackerAbility = attacker.ability;
    }
    //f. Dynamax Cannon, Behemoth Blade, Behemoth Bash
    if ((move.name === "Dynamax Cannon" || move.name === "Behemoth Blade" || move.name === "Behemoth Bash") && defender.isDynamax) {
        finalMods.push(0x2000);
    }
    //g. Multiscale, Shadow Shield
    if ((defAbility === "Multiscale" || defAbility == "Shadow Shield") && defender.curHP === defender.maxHP) {
        finalMods.push(0x800);
        description.defenderAbility = defAbility;
    }
    //h. Fluffy (contact)
    if (defAbility === "Fluffy" && move.makesContact) {
        finalMods.push(0x800);
        description.defenderAbility = defAbility;
    }
    //i. Punk Rock
    if (defAbility === "Punk Rock" && move.isSound) {
        finalMods.push(0x800);
        description.defenderAbility = defAbility;
    }
    //j. Ice Scales
    if (defAbility === "Ice Scales" && move.category === "Special"){
        finalMods.push(0x800);
        description.defenderAbility = defAbility;
    }
    //k. Friend Guard
    if (field.isFriendGuard && !move.ignoresFriendGuard) {
        finalMods.push(0xC00);
        description.isFriendGuard = true;
    }
    //l. Solid Rock, Filter, Prism Armor
    if ((defAbility === "Solid Rock" || defAbility === "Filter" || defAbility === "Prism Armor") && typeEffectiveness > 1) {
        finalMods.push(0xC00);
        description.defenderAbility = defAbility;
    }
    //m. Metronome item
    //n. Fluffy (fire moves)
    if (defAbility === "Fluffy" && move.type === "Fire") {
        finalMods.push(0x2000);
        description.defenderAbility = defAbility;
    }
    //o. Expert Belt
    if (attacker.item === "Expert Belt" && typeEffectiveness > 1) {
        finalMods.push(0x1333);
        description.attackerItem = attacker.item;
    } //p. Life Orb
    else if (attacker.item === "Life Orb") {
        finalMods.push(0x14CC);
        description.attackerItem = attacker.item;
    }
    //q. Resist Berries
    if (getBerryResistType(defender.item) === move.type && (typeEffectiveness > 1 || move.type === "Normal") &&
        attacker.ability !== "Unnerve" && attacker.ability !== "As One") {
        if (defAbility === "Ripen") {
            finalMods.push(0x400);
            description.defenderAbility = defAbility;
        }
        else {
            finalMods.push(0x800);
        }
        description.defenderItem = defender.item;
        defender.consumeResistBerry = true;
    }
    //r. Doubled damage (These likely won't be added since Minimize/Dig/Dive are hardly ever used)
    //r.i. Body Slam, Stomp, Dragon Rush, Steamroller, Heat Crash, Heavy Slam, Flying Press, Malicious Moonsault
    //r.ii. Earthquake
    //r.iii. Surf, Whirlpool

    //MECHANICS TESTING
    if (attacker.hasCustomModifiers && attacker.customModifiers['fnMods']) {
        let customFinalMods = attacker.customModifiers['fnMods'];
        for (let i = 0; i < customFinalMods.length; i++) {
            finalMods.push(customFinalMods[i]);
        }
        description.isMechanicsTest = true;
    }

    return [finalMods, description];
}

//All conditions I can think of:
//-Using Triple Kick/Axel (move changes BP depending on which # kick it's on)
//-Resist berries (only active for the first hit)
//-Attacking with Parental Bond ("child" damage is a reduced general mod)
//-Multiscale/Shadow Shield (first hit deals reduced damage)
//-Stamina (each physical hit increases Defense until it reaches +6; yes it's any hit when playing but only physical hits are relevant in the calc)
//-Kee/Maranga Berry (first hit increases Defense/Special Defense by +1)
//-Weak Armor (each physical hit decreases Defense until it reaches -6)
//-Gooey/Tangling Hair (contact moves decreases attacker's Speed, only relevant for Defiant)
//-Cotton Down (any move decreases attacker's Speed, only relevant for Defiant)
//-Spicy Spray (any move burns the target, matters for physical moves and Flare Boost)
//Current implementation has all of the above use cases
//Not implemented (and no plans to do so in the near future):
//-Sand Spit/Seed Sower
//-Liechi/Ganlon/Petaya/Grepa/Salac Berries
//-Crush Grip/Wring Out
function checkAddCalcQualifications(attacker, defender, move, field, hitsPhysical) {
    var addQualList = {
        triple: false,
        resistBerry: false,
        multiscale: false,
        weakArmor: false,
        parentalBond: attacker.ability === "Parental Bond" && move.hits === 1 && !move.hitRange && (field.format === "Singles" || !move.isSpread),
        gooey: false,
        kee: false,
        maranga: false,
        moss: false,
        stamina: false,
        spicySpray: false,
    };
    if (move.hits > 1 || addQualList['parentalBond']) {
        addQualList['triple'] = move.isTripleHit && !addQualList['parentalBond'];
        addQualList['resistBerry'] = defender.consumeResistBerry;
        addQualList['multiscale'] = ['Multiscale', 'Shadow Shield'].includes(defender.ability) && defender.curHP === defender.maxHP;
        addQualList['weakArmor'] = defender.ability === 'Weak Armor' && hitsPhysical && defender.boosts[DF] > -6;
        addQualList['gooey'] = (['Gooey', 'Tangling Hair'].includes(defender.ability) && move.makesContact) || defender.ability === 'Cotton Down' && (['Defiant', 'Competitive'].includes(attacker.ability) || ['Electro Ball', 'Gyro Ball'].includes(move.name)) && defender.boosts[SP] > -6;
        addQualList['kee'] = defender.item === 'Kee Berry' && hitsPhysical && defender.boosts[DF] < 6;
        addQualList['maranga'] = defender.item === 'Maranga Berry' && !hitsPhysical && defender.boosts[SD] < 6;
        addQualList['moss'] = defender.item === 'Luminous Moss' && move.type == 'Water' && !hitsPhysical && defender.boosts[SD] < 6;
        addQualList['stamina'] = defender.ability === 'Stamina' && hitsPhysical && defender.boosts[DF] < 6;
        addQualList['spicySpray'] = defender.ability === 'Spicy Spray' && (attacker.ability === 'Flare Boost' || move.category === 'Physical') && canBeBurned(attacker, move, field);
    }
    return addQualList;
}

function canBeBurned(attacker, move, field) {
    return attacker.status != 'Burned' && !(attacker.hasType('Fire')) && !(['Protean', 'Libero'].includes(attacker.ability) && attacker.abilityOn && move.type == 'Fire')
        && !(attacker.ability == 'Leaf Guard' && field.weather.includes('Sun')) && !(['Water Veil', 'Water Bubble', 'Comatose', 'Thermal Exchange', 'Purifying Salt'].includes(attacker.ability))
        && (field.terrain != 'Misty' || !pIsGrounded(attacker, field));
}

//Inefficient for what it does now but should be a good setup for when more conditions are added
function additionalDamageCalcs(attacker, defender, move, field, description, addQualList) {
    var nextAttacker = JSON.parse(JSON.stringify(attacker)), nextDefender = JSON.parse(JSON.stringify(defender)), nextMove = JSON.parse(JSON.stringify(move));
    //Adding hasType function back in since the deep copy loses it
    nextAttacker.hasType = setHasTypeFunc;
    nextDefender.hasType = setHasTypeFunc;
    var allAdditionalDamages = [];
    var uniqueHits = 1;     //Keeps track of the number of unique hits that need to be calculated, done to minimize redundant function calls
    if (addQualList['parentalBond']) {
        nextAttacker.ability = '';
        nextAttacker.isChild = true;
        nextMove = move;

        if (moves[move.name]['statChange']) {
            var statChange = moves[move.name]['statChange'];
            var affectedStat, numStages = statChange[1], recipient = statChange[2] === 'user' ? nextAttacker : nextDefender;
            switch (statChange[0]) {
                case 'attack':
                    affectedStat = AT;
                    break;
                case 'defense':
                    affectedStat = DF;
                    break;
                case 'special attack':
                    affectedStat = SA;
                    break;
                case 'special defense':
                    affectedStat = SD;
                    break;
            }
            if (numStages > 0) {
                recipient.boosts[affectedStat] = Math.min(6, recipient.boosts[affectedStat] + numStages);
                //recipient = changeStatBoosts([recipient], affectedStat, numStages);
            }
            else {  //TODO: check opponent for: clear/full metal body/white smoke, hyper cutter/big pecks, amulet/cloak, simple, contrary, mirror armor
                recipient.boosts[affectedStat] = Math.max(-6, recipient.boosts[affectedStat] + numStages);
            }
            recipient.stats[affectedStat] = getModifiedStat(recipient.rawStats[affectedStat], recipient.boosts[affectedStat]);
        }
        else if (move.name === 'Assurance') {
            nextMove.isDouble = 1;
        }
        description.attackerAbility = attacker.ability;
        move.hits = 2;  //this persists for properly displaying .result-move and for calculations with function getKOChanceText()
        uniqueHits = 2;
        description.hits = move.hits;
    }
    else if (addQualList['triple']) {
        uniqueHits = move.hits;
    }
    if (addQualList['multiscale']) {
        nextDefender.ability = '';
        if (uniqueHits === 1) {
            uniqueHits = 2;
        }
    }
    else if (addQualList['weakArmor']) {
        uniqueHits = Math.max(uniqueHits, Math.min(-1 * (-6 - defender.boosts[DF]) + 1, move.hits), Math.min(Math.ceil((6 - defender.boosts[SP]) / 2) + 1, move.hits));
        description.defenderAbility = defender.ability;
    }
    else if (addQualList['gooey']) {
        uniqueHits = Math.max(uniqueHits, Math.min(-1 * (-6 - attacker.boosts[SP]) + 1, move.hits));
        description.defenderAbility = defender.ability;
        if (['Defiant', 'Competitive'].includes(attacker.ability)) {
            var boostStat = attacker.ability === 'Defiant' ? AT : SA;
            uniqueHits = Math.max(uniqueHits, Math.min(Math.ceil((6 - attacker.boosts[boostStat]) / 2) + 1, move.hits));
            description.attackerAbility = attacker.ability;
        }
    }
    else if (addQualList['stamina']) {
        uniqueHits = Math.max(uniqueHits, Math.min(6 - defender.boosts[DF] + 1, move.hits));
        description.defenderAbility = defender.ability;
    }
    else if (addQualList['spicySpray']) {
        var burnHealConsumed = false;
        if (['Rawst Berry', 'Lum Berry'].includes(attacker.item)) {
            burnHealConsumed = true;
            description.attackerItem = attacker.item;
            if (move.hits >= 3) {
                uniqueHits = 3;
            }
        }
        else {
            nextAttacker.status = 'Burned';
            if (uniqueHits == 1) {
                uniqueHits = 2;
            }
        }
        description.defenderAbility = defender.ability;
    }
    if (addQualList['kee']) {
        nextDefender.boosts[DF] = Math.min(6, nextDefender.boosts[DF] + 1);
        nextDefender.stats[DF] = getModifiedStat(nextDefender.rawStats[DF], nextDefender.boosts[DF]);
        if (uniqueHits === 1) {
            uniqueHits = 2;
        }
        description.defenderItem = defender.item;
    }
    else if (addQualList['maranga'] || addQualList['moss']) {
        nextDefender.boosts[SD] = Math.min(6, nextDefender.boosts[SD] + 1);
        nextDefender.stats[SD] = getModifiedStat(nextDefender.rawStats[SD], nextDefender.boosts[SD]);
        if (uniqueHits === 1) {
            uniqueHits = 2;
        }
        description.defenderItem = defender.item;
    }
    else if (addQualList['resistBerry']) {
        nextDefender.item = '';
        if (uniqueHits === 1) {
            uniqueHits = 2;
        }
    }
    nextMove.isNextMove = true;

    for (var i = 0; i < uniqueHits - 1; i++) {
        if (addQualList['gooey']) {
            nextAttacker.boosts[SP] = Math.max(-6, attacker.boosts[SP] - 1);
            nextAttacker.stats[SP] = getModifiedStat(nextAttacker.rawStats[SP], nextAttacker.boosts[SP]);
            if (['Defiant', 'Competitive'].includes(attacker.ability)) {
                boostStat = attacker.ability === 'Defiant' ? AT : SA;
                nextAttacker.boosts[boostStat] = Math.min(6, attacker.boosts[boostStat] + 2);
                nextAttacker.stats[boostStat] = getModifiedStat(nextAttacker.rawStats[boostStat], nextAttacker.boosts[boostStat]);
            }
        }
        else if (addQualList['weakArmor']) {
            nextDefender.boosts[SP] = Math.min(6, nextDefender.boosts[SP] + 2);
            nextDefender.stats[SP] = getModifiedStat(nextDefender.rawStats[SP], nextDefender.boosts[SP]);
            nextDefender.boosts[DF] = Math.max(-6, nextDefender.boosts[DF] - 1);
            nextDefender.stats[DF] = getModifiedStat(nextDefender.rawStats[DF], nextDefender.boosts[DF]);
        }
        else if (addQualList['stamina']) {
            nextDefender.boosts[DF] = Math.min(6, nextDefender.boosts[DF] + 1);
            nextDefender.stats[DF] = getModifiedStat(nextDefender.rawStats[DF], nextDefender.boosts[DF]);
        }
        if (addQualList['triple']) {
            nextMove.currTripleHit = i + 2;
        }
        allAdditionalDamages[i] = GET_DAMAGE_HANDLER(nextAttacker, nextDefender, nextMove, field).damage;
        if (burnHealConsumed && addQualList['spicySpray']) {
            burnHealConsumed = false;
            nextAttacker.item = '';
            nextAttacker.status = 'Burned';
        }
    }
    return allAdditionalDamages;
}


/* ================= damage_SV.js (unchanged) ================= */
/* Damage calculation for the side game: Champions;
 * for the Generation IX games: Scarlet, Violet, and Legends: Z-A;
 * for the Generation VIII games: Sword, Shield, Brilliant Diamond, and Shining Pearl;
 * and for the Generation VII games: Sun, Moon, Ultra Sun, and Ultra Moon */

function CALCULATE_ALL_MOVES_SV(p1, p2, field) {
    checkTrace(p1, p2);
    checkTrace(p2, p1);
    checkNeutralGas(p1, p2, field.getNeutralGas());
    checkAirLock(p1, field);
    checkAirLock(p2, field);
    checkForecast(p1, field.getWeather());
    checkForecast(p2, field.getWeather());
    checkMimicry(p1, field.getTerrain());
    checkMimicry(p2, field.getTerrain());
    checkTerastal(p1);
    checkTerastal(p2);
    checkKlutz(p1);
    checkKlutz(p2);
    checkEvo(p1, p2);
    checkParadoxAbilities(p1, field.getTerrain(), field.getWeather());
    checkParadoxAbilities(p2, field.getTerrain(), field.getWeather());
    checkSeeds(p1, field.getTerrain());
    checkSeeds(p2, field.getTerrain());
    checkSwordShield(p1);
    checkSwordShield(p2);
    checkWindRider(p1, field.getTailwind(0));
    checkWindRider(p2, field.getTailwind(1));
    checkIntimidate(p1, p2);
    checkIntimidate(p2, p1);
    checkSupersweetSyrup(p1, p2);
    checkSupersweetSyrup(p2, p1);
    checkDownload(p1, p2);
    checkDownload(p2, p1);
    checkEmbodyAspect(p1);
    checkEmbodyAspect(p2);
    checkBattleBond(p1);
    checkBattleBond(p2);
    p1.stats[AT] = getModifiedStat(p1.rawStats[AT], p1.boosts[AT]); //new order is important for the proper Protosynthesis/Quark Drive boost
    p1.stats[DF] = getModifiedStat(p1.rawStats[DF], p1.boosts[DF]);
    p1.stats[SA] = getModifiedStat(p1.rawStats[SA], p1.boosts[SA]);
    p1.stats[SD] = getModifiedStat(p1.rawStats[SD], p1.boosts[SD]);
    p1.stats[SP] = getModifiedStat(p1.rawStats[SP], p1.boosts[SP]);
    setHighestStat(p1, 0);
    p1.stats[SP] = getFinalSpeed(p1, field.getWeather(), field.getTailwind(0), field.getSwamp(0), field.getTerrain());
    $(".p1-speed-mods").text(p1.stats[SP]);
    p2.stats[AT] = getModifiedStat(p2.rawStats[AT], p2.boosts[AT]);
    p2.stats[DF] = getModifiedStat(p2.rawStats[DF], p2.boosts[DF]);
    p2.stats[SA] = getModifiedStat(p2.rawStats[SA], p2.boosts[SA]);
    p2.stats[SD] = getModifiedStat(p2.rawStats[SD], p2.boosts[SD]);
    p2.stats[SP] = getModifiedStat(p2.rawStats[SP], p2.boosts[SP]);
    setHighestStat(p2, 1);
    p2.stats[SP] = getFinalSpeed(p2, field.getWeather(), field.getTailwind(1), field.getSwamp(1), field.getTerrain());
    $(".p2-speed-mods").text(p2.stats[SP]);
    var side1 = field.getSide(1);
    var side2 = field.getSide(0);
    checkInfiltrator(p1, side1);
    checkInfiltrator(p2, side2);
    getWeightMods(p1, p2);
    var results = [[],[]];
    for (var i = 0; i < 4; i++) {
        results[0][i] = GET_DAMAGE_SV(p1, p2, p1.moves[i], side1);
        results[1][i] = GET_DAMAGE_SV(p2, p1, p2.moves[i], side2);
        if (gen == 9.5) {
            results[0][i].cooldown = getMoveCooldown(p1, p1.moves[i]);
            results[1][i].cooldown = getMoveCooldown(p2, p2.moves[i]);
        }
    }
    return results;
}

function GET_DAMAGE_SV(attacker, defender, move, field) {
    var moveDescName = move.name;
    var isQuarteredByProtect = false, isMeFirst = false;

    var attIsGrounded = pIsGrounded(attacker, field);
    var defIsGrounded = pIsGrounded(defender, field);

    if (move.name == 'Me First')
        [move, moveDescName, isMeFirst] = checkMeFirst(move, moveDescName, defender, attacker.isDynamax);

    checkMoveTypeChange(move, field, attacker);
    checkConditionalPriority(move, field.terrain, attacker, attIsGrounded);
    checkConditionalSpread(move, field.terrain, attacker, attIsGrounded);

    if (attacker.isDynamax && gen === 8)    //without the gen check a Dynamaxed Pokemon can lead to an error switching between gen 8 and either 7 or 9
        [move, isQuarteredByProtect, moveDescName] = MaxMoves(move, attacker, isQuarteredByProtect, moveDescName, field);
    else if (move.name == "Nature Power" && attacker.item !== 'Assault Vest')
        [move, moveDescName] = NaturePower(move, field, moveDescName);

    if (move.isZ || move.isSignatureZ)
        [move, moveDescName] = ZMoves(move, field, attacker, moveDescName);

    //Needs to be after the Z-move check since Light That Burns The Sky can change category
    if (usesPhysicalAttack(attacker, defender, move)) {
        move.category = "Physical";
    }

    //Placed here so 1) Me First moves get contact, and 2) physical Shell Side Arm gets contact
    checkContactOverride(move, attacker);

    attacker_name = attacker.name;
    if (attacker_name && attacker_name.includes("-Gmax")) attacker_name = attacker_name.substring(0, attacker_name.indexOf('-Gmax'));
    defender_name = defender.name;
    if (defender_name && defender_name.includes("-Gmax")) defender_name = defender_name.substring(0, defender_name.indexOf('-Gmax'));

    var description = {
        "attackerName": attacker_name,
        "moveName": moveDescName,
        "defenderName": defender_name
    };

    isQuarteredByProtect = setIsQuarteredByProtect(attacker, defender, field, move, description);

    addLevelDesc(attacker, defender, description);

    if (move.bp === 0 || move.category === "Status") {
        return statusMoves(move, attacker, defender, description);
    }

    description.attackerTera = attacker.isTerastalize ? attacker.tera_type : false;
    description.defenderTera = defender.isTerastalize ? defender.tera_type : false;

    var defAbility = defender.ability;
    [defAbility, description] = abilityIgnore(attacker, move, defAbility, description, defender.item);

    var isCritical = critMove(move, defAbility);

    var ateIzeBoosted;
    if (!move.isZ && (TYPE_CHANGE_BOOST_ABILITIES.includes(attacker.ability) || attacker.ability == "Liquid Voice")
        && !(['Hidden Power', 'Weather Ball', 'Natural Gift', 'Judgement', 'Techno Blast', 'Revelation Dance', 'Multi-Attack', 'Terrain Pulse'].includes(move.name))) {
        [move, description, ateIzeBoosted] = checkAbilityTypeChange(move, attacker, description);
    }

    var typeEffectiveness = getMoveEffectiveness(move, defender.type1, defender.type2, description, field.isForesight, ["Scrappy", "Mind's Eye"].includes(attacker.ability) ? attacker.ability : false, field.isGravity, defender.item, field.weather === "Strong Winds", defender.isTerastalize, defAbility === 'Tera Shell' && defender.curHP === defender.maxHP);
    immuneBuildDesc = immunityChecks(move, attacker, defender, field, description, defAbility, typeEffectiveness);
    if (immuneBuildDesc !== -1) return immuneBuildDesc;

    getHPInfo(description, defender);

    setDamageBuildDesc = setDamage(move, attacker, defender, description, isQuarteredByProtect, field);
    if (setDamageBuildDesc !== -1) return setDamageBuildDesc;

    if (move.hitRange && !(move.isPlusMove && move.plusEffects && move.plusEffects.hitRange == 1)) {
        description.hits = move.hits;
    }
    var turnOrder = attacker.stats[SP] > defender.stats[SP] ? "FIRST" : "LAST";

    ////////////////////////////////
    ////////// BASE POWER //////////
    ////////////////////////////////
    var basePower;
    [basePower, description] = basePowerFunc(move, description, turnOrder, attacker, defender, field, attIsGrounded, defIsGrounded, defAbility);

    var bpMods;
    [bpMods, description, move] = calcBPMods(attacker, defender, field, move, description, ateIzeBoosted, basePower, attIsGrounded, defIsGrounded, turnOrder, defAbility, isMeFirst);

    basePower = Math.max(1, pokeRound(basePower * chainMods(bpMods) / 0x1000));

    ////////////////////////////////
    ////////// (SP)ATTACK //////////
    ////////////////////////////////

    var attack;
    [attack, description] = calcAttack(move, attacker, defender, description, isCritical, defAbility);

    var atMods;
    [atMods, description] = calcAtMods(move, attacker, defAbility, description, field);

    attack = Math.max(1, pokeRound(attack * chainMods(atMods) / 0x1000));

    ////////////////////////////////
    ///////// (SP)DEFENSE //////////
    ////////////////////////////////
    var hitsPhysical = move.category === "Physical" || move.dealsPhysicalDamage;

    var defense;
    [defense, description] = calcDefense(move, attacker, defender, description, hitsPhysical, isCritical, field);

    var dfMods;
    [dfMods, description] = calcDefMods(move, defender, field, description, hitsPhysical, defAbility);

    defense = Math.max(1, pokeRound(defense * chainMods(dfMods) / 0x1000));

    ////////////////////////////////
    //////////// DAMAGE ////////////
    ////////////////////////////////
    var baseDamage = calcBaseDamage(attacker, basePower, attack, defense);


    return calcGeneralMods(baseDamage, move, attacker, defender, defAbility, field, description, isCritical, typeEffectiveness, isQuarteredByProtect, hitsPhysical);
}