// Toets: past een aanbieding bij een regel? (node tests/offer_fits.cjs)
require(require('path').join(__dirname,'../match.js'));const M=globalThis.Match;const fs=require('fs');
const P=JSON.parse(fs.readFileSync(require('path').join(__dirname,'../data/prices.json')));const IDX={};for(const s in P.stores)IDX[s]=M.indexStore(P.stores[s]);M.setHeads(Object.values(IDX));
const T=[['melk',['Galler Melk popcorn',0],['AH Halfvolle melk',1],['Campina Halfvolle melk 1 liter',1],['Chocomel chocolademelk',0],['Palmolive Naturals melk & amandel',0],['Milka melkchocolade',0],['Melkan Volle melk',1]],
['yoghurt',['Campina yoghurt aardbei',1],['Danone Activia yoghurt',1],['Yoghurt rozijnen',0],['AH Griekse yoghurt 10%',1]],
['paprika',["Lay's chips paprika",0],['AH Paprika rood',1],['Paprika mix 3 stuks',1],['Paprikapoeder',0]],
['500 g kipfilet',['AH Kipfilet blokjes',1],['Kipfilet naturel 2 stuks',1],['Kipfilet gerookt',1],['Unox soep kipfilet',0]],
['kaas',['Old Amsterdam kaas plakken',1],['Lay\'s Kaas chips',0],['Cheetos kaas',0],['Geitenkaas',0],['AH Jong belegen kaas',1]],
['rundergehakt',['AH Rundergehakt 500 gram',1],['Gehakt half om half',0]],
['gehakt',['AH Rundergehakt 500 gram',1],['Gehaktballen',0]],
['bananen',['Chiquita bananen',1],['Bananenbrood',0],['AH Biologische bananen tros',1]],
['pindakaas',['Calvé pindakaas',1],['Whole earth Smooth 100% pindakaas',1],['Pindakaas koekjes',0]],
['cola',['Coca-Cola Zero 1.5 liter',1],['Pepsi cola',1],['Cola snoepjes',0]],
['aardbeien',['AH Aardbeien 400 g',1],['Campina yoghurt aardbei',0],['Hero jam aardbeien',0]],
['koffiebonen',["L'OR Espresso onyx koffiebonen",1],['Douwe Egberts koffiebonen aroma rood',1]],
['tomaten',['AH Tasty Tom trostomaten',1],['Cherrytomaten',1],['Heinz tomatenketchup',0],['Unox tomatensoep',0]]];
let bad=0;for(const [l,...cs] of T){const it=M.parseLine(l);for(const [n,want] of cs){const got=M.offerFits(it,n)?1:0;if(got!==want)bad++;console.log(got===want?'  ':'XX',l.padEnd(14),n,'->',got)}}console.log('fout',bad)
