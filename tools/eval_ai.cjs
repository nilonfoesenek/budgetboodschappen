// Haalt de keuzes van Claude op via de live app en slaat ze op: node tools/eval_ai.cjs > /tmp/ai.json ; node tools/eval.cjs /tmp/ai.json
const fs = require('fs'), path = require('path');
const URL = process.env.BB_URL || 'https://budgetboodschappen.netlify.app/api/match';
const lines = fs.readFileSync(path.join(__dirname, '../tests/ingredients.txt'), 'utf8').split('\n').filter(l => l.trim() && !l.startsWith('#')).map(l => l.split(' | ')[0].trim());
(async () => {
  const all = {}; let todo = lines.slice(), rounds = 0;
  while (todo.length && rounds++ < 80) {
    const r = await fetch(URL, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ lines: todo.slice(0, 30), device: 'toets' }) });
    const d = await r.json(); if (!r.ok || d.error) { console.error('fout', r.status, JSON.stringify(d)); if (!d.results) break; }
    Object.assign(all, d.results || {});
    require('../match.js'); const M = globalThis.Match;
    todo = todo.filter(l => { const it = M.parseLine(l); return it && !all[it.t.join(' ')]; });
    console.error(`nog ${todo.length}`);
    if (d.limited) break;
  }
  process.stdout.write(JSON.stringify(all));
})();
