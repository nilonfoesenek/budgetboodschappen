// Controle van de productkeuze en de aanbiedingen van de app.  Draai in de kloon:  node tools/audit.cjs
// Werkwijze en maatstaf: tools/AUDIT.md.  Schrijft data/audit/cases.json en data/audit/sheet.txt.
// Gebruikt precies dezelfde logica als de app (match.js): Match.candidates voor het product en
// Match.offerFor voor de aanbieding, met de aanbiedingen die de app op de controledatum als 'nu of binnenkort' toont.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const ROOT = path.join(__dirname, '..'), A = path.join(ROOT, 'data/audit');
require(path.join(ROOT, 'match.js')); const M = globalThis.Match;
fs.mkdirSync(A, { recursive: true });

const P = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/prices.json'), 'utf8'));
const O = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/offers.json'), 'utf8'));
const today = process.env.AUDIT_DATE || new Date().toISOString().slice(0, 10);
const addDays = (d, n) => { const x = new Date(d + 'T12:00:00Z'); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
const t6 = addDays(today, 6);
const live = O.offers.filter(o => o.to >= today && o.from <= t6);      // zelfde venster als liveAll() in index.html
const STORES = Object.keys(P.stores).filter(s => P.stores[s].length);
const IDX = {}; for (const s of STORES) IDX[s] = M.indexStore(P.stores[s]);
M.setHeads(Object.values(IDX));

const deacc = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const hid = s => crypto.createHash('md5').update(s).digest('hex').slice(0, 8);
const eur = x => x == null ? '?' : '€' + x.toFixed(2).replace('.', ',');
const disc = o => o.pct ? o.pct : (o.was && o.p != null && o.was > o.p ? 1 - o.p / o.was : 0);

// Controleregels: tests/ingredients.txt (regel | moet passen | mag niet passen)
const lines = fs.readFileSync(path.join(ROOT, 'tests/ingredients.txt'), 'utf8').split('\n')
  .filter(l => l.trim() && !l.startsWith('#')).map(l => {
    const [line, ok, bad] = l.split(' | ').map(x => (x || '').trim());
    return { line, ok: ok ? new RegExp(ok, 'i') : null, bad: bad ? new RegExp(bad, 'i') : null };
  });

const known = fs.existsSync(path.join(A, 'known.json')) ? JSON.parse(fs.readFileSync(path.join(A, 'known.json'), 'utf8')) : {};
const cases = [];
const stat = { regels: lines.length, winkels: STORES.length, prodGekozen: 0, prodNietGevonden: 0, aanbGetoond: 0 };

for (const t of lines) {
  const it = M.parseLine(t.line); if (!it) continue;
  for (const s of STORES) {
    // 1. productkeuze (zonder Claude-keuze: de lokale keuze die de app ook gebruikt als terugval)
    const c = M.candidates(it, IDX[s], 6)[0];
    if (!c) stat.prodNietGevonden++;
    else {
      stat.prodGekozen++;
      const n = deacc(c.p.name), regexOk = (!t.ok || t.ok.test(n)) && !(t.bad && t.bad.test(n));
      const id = hid(['PROD', s, t.line, c.p.name].join('|'));
      // regex-toets goed = automatisch goed; regex-toets fout = Claude beoordeelt (de regex kan te streng zijn)
      cases.push({ id, kind: 'PROD', s, line: t.line, name: c.p.name, size: c.p.size, price: c.p.price, sub: !!c.sub,
        auto: regexOk ? 'goed' : null, regex: regexOk ? '' : `moet /${t.ok ? t.ok.source : ''}/${t.bad ? ', niet /' + t.bad.source + '/' : ''}` });
    }
    // 2. aanbieding die de app bij deze regel laat zien
    const o = M.offerFor(it, live, s, IDX[s]);
    if (o) {
      stat.aanbGetoond++;
      const id = hid(['AANB', s, t.line, o.n].join('|'));
      cases.push({ id, kind: 'AANB', s, line: t.line, name: o.n, deal: o.d || '', p: o.p ?? null, was: o.was ?? null,
        pct: +disc(o).toFixed(3), from: o.from, to: o.to, prod: c ? `${c.p.name}${c.p.size ? ' ' + c.p.size : ''} ${eur(c.p.price)}` : '' });
    }
  }
}

// 3. Automatische datacontrole van de aanbiedingen (geen oordeel van Claude nodig)
const data = [];
const seen = new Map();
for (const o of O.offers) {
  const why = [];
  if (o.p != null && o.was != null && o.p > o.was + 0.005) why.push('actieprijs hoger dan normale prijs');
  if (o.p != null && o.p <= 0) why.push('actieprijs 0 of negatief');
  if (o.pct != null && (o.pct <= 0 || o.pct > 0.8)) why.push(`korting ${(o.pct * 100).toFixed(0)}% onwaarschijnlijk`);
  if (o.from && o.to && o.to < o.from) why.push('einddatum vóór begindatum');
  if (o.from && o.to && (new Date(o.to) - new Date(o.from)) / 864e5 > 31) why.push('langer dan 31 dagen geldig');
  if (o.p == null && !o.pct && !o.was) why.push('geen prijs en geen korting');
  const k = o.s + '|' + deacc(o.n) + '|' + o.from;
  if (seen.has(k) && seen.get(k) !== o.p) why.push('dubbel met andere prijs');
  seen.set(k, o.p);
  if (why.length) data.push({ s: o.s, n: o.n, d: o.d || '', p: o.p ?? null, was: o.was ?? null, from: o.from, to: o.to, why: why.join('; '), live: o.to >= today && o.from <= t6 });
}

// 4. Versheid van de vaste prijzen: (a) normale prijs in de folder vs. prijs in de app voor exact dezelfde productnaam,
//    (b) laatste datum waarop de bron voor die winkel nog iets veranderde (data/db/snapshots.tsv)
const fresh = {};
const snapP = path.join(ROOT, 'data/db/snapshots.tsv');
const snaps = fs.existsSync(snapP) ? fs.readFileSync(snapP, 'utf8').trim().split('\n').slice(1).map(l => l.split('\t')) : [];
for (const s of STORES) {
  const m = new Map(P.stores[s].map(r => [deacc(r[0]), r[1]]));
  let n = 0, diff = 0;
  for (const o of O.offers) if (o.s === s && o.was && m.has(deacc(o.n))) { n++; if (Math.abs(m.get(deacc(o.n)) - o.was) > 0.015) diff++; }
  const xs = snaps.filter(r => r[1] === s), chg = xs.slice(1).filter(r => +r[5] + +r[6] + +r[7] > 0).map(r => r[0]);
  fresh[s] = { paren: n, afwijkend: diff, laatsteWijziging: chg.length ? chg[chg.length - 1] : (xs.length ? 'nooit sinds ' + xs[0][0] : '?') };
}

// Nieuw = nog nooit eerder beoordeeld. Bekende gevallen houden hun oordeel.
for (const c of cases) { c.known = known[c.id] ? known[c.id].v : null; c.isNew = !c.known && !c.auto; }
const todo = cases.filter(c => c.isNew);
const fmt = c => c.kind === 'AANB'
  ? `${c.id} | AANB | ${c.s} | regel: ${c.line} | aanbieding: ${c.name} | ${c.deal}${c.p != null ? ' ' + eur(c.p) : ''}${c.was != null ? ' (was ' + eur(c.was) + ')' : ''} | ${c.from} t/m ${c.to}${c.prod ? ' | gewone keuze: ' + c.prod : ''}`
  : `${c.id} | PROD | ${c.s} | regel: ${c.line} | gekozen: ${c.name}${c.size ? ' ' + c.size : ''} ${eur(c.price)}${c.sub ? ' (vervanger)' : ''} | regex-toets: ${c.regex}`;
const head = [`# Te beoordelen gevallen, controle ${today}. Maatstaf: tools/AUDIT.md.`,
  `# Schrijf de FOUTE gevallen naar data/audit/verdicts.txt als: id|fout|korte reden. Niet genoemd = goed.`,
  `# ${todo.filter(c => c.kind === 'AANB').length} aanbiedingen en ${todo.filter(c => c.kind === 'PROD').length} productkeuzes.`, ''];
fs.writeFileSync(path.join(A, 'sheet.txt'), head.concat(
  ['## AANBIEDINGEN'], todo.filter(c => c.kind === 'AANB').map(fmt), ['', '## PRODUCTKEUZES (regex-toets zegt fout)'], todo.filter(c => c.kind === 'PROD').map(fmt)).join('\n') + '\n');
fs.writeFileSync(path.join(A, 'cases.json'), JSON.stringify({ date: today, stat, cases, data, fresh }, null, 0));
console.log(`controle ${today}: ${cases.length} gevallen (${stat.prodGekozen} productkeuzes, ${stat.aanbGetoond} aanbiedingen getoond), ` +
  `${todo.length} nieuw te beoordelen (${todo.filter(c => c.kind === 'AANB').length} aanbiedingen), ${data.length} datameldingen → data/audit/sheet.txt`);
