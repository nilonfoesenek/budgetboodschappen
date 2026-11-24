// Toets de productkeuze: node tools/eval.js [ai-antwoorden.json]
// Per regel en per winkel: goed / fout / niet gevonden. Fout = verkeerd product gekozen.
require('../match.js'); const M = globalThis.Match; const fs = require('fs'), path = require('path');
const D = require('../data/prices.json').stores, STORES = ['ah', 'jumbo', 'aldi', 'dirk', 'plus', 'lidl'];
const idx = {}; for (const s of STORES) idx[s] = M.indexStore(D[s]);
const AI = process.argv[2] ? JSON.parse(fs.readFileSync(process.argv[2], 'utf8')) : null;
const deacc = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const tests = fs.readFileSync(path.join(__dirname, '../tests/ingredients.txt'), 'utf8').split('\n').filter(l => l.trim() && !l.startsWith('#')).map(l => {
  const [line, ok, bad] = l.split(' | ').map(x => (x || '').trim()); return { line, ok: new RegExp(ok, 'i'), bad: bad ? new RegExp(bad, 'i') : null }; });
const tot = {}, wrong = []; for (const s of STORES) tot[s] = { ok: 0, fout: 0, mis: 0 };
for (const t of tests) {
  const it = M.parseLine(t.line); const key = it ? it.t.join(' ') : '';
  for (const s of STORES) {
    let pick = null;
    if (AI && AI[key] && AI[key][s]) { const names = AI[key][s]; const c = names.map(n => idx[s].find(p => p.name === n)).filter(Boolean).map(p => ({ p, cost: M.costOf(it, p, p.qty && p.qty.d) })); c.sort((a, b) => a.cost.rank - b.cost.rank || a.p.price - b.p.price); pick = c[0] || null; }
    else if (!AI || !AI[key]) { const c = it ? M.candidates(it, idx[s], 6) : []; pick = c[0] || null; }
    if (!pick) { tot[s].mis++; continue; }
    const n = deacc(pick.p.name); const good = t.ok.test(n) && !(t.bad && t.bad.test(n));
    if (good) tot[s].ok++; else { tot[s].fout++; wrong.push(`${t.line.padEnd(30)} ${s.padEnd(6)} ${pick.p.name}`); }
  }
}
const all = { ok: 0, fout: 0, mis: 0 }; console.log(`${tests.length} regels × ${STORES.length} winkels\n\nwinkel   goed   fout   niet gevonden`);
for (const s of STORES) { const x = tot[s]; for (const k in all) all[k] += x[k]; console.log(`${s.padEnd(8)} ${String(x.ok).padStart(4)}  ${String(x.fout).padStart(5)}  ${String(x.mis).padStart(6)}`); }
const n = all.ok + all.fout; console.log(`totaal   ${all.ok}  ${all.fout}  ${all.mis}   → ${(100 * all.ok / n).toFixed(1)}% goed van de gekozen producten`);
if (process.env.SHOW) console.log('\nFOUT:\n' + wrong.join('\n'));
fs.writeFileSync('/tmp/eval_wrong.txt', wrong.join('\n'));
