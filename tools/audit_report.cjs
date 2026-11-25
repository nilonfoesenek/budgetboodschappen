// Verwerkt de oordelen en schrijft het rapport.  Draai na tools/audit.cjs en het invullen van data/audit/verdicts.txt:
//   node tools/audit_report.cjs
// Leest data/audit/cases.json + verdicts.txt (id|fout|reden; niet genoemde nieuwe gevallen = goed),
// werkt data/audit/known.json bij en schrijft data/audit/RAPPORT.md en data/audit/log.tsv.
const fs = require('fs'), path = require('path');
const A = path.join(__dirname, '../data/audit');
const { date, stat, cases, data, fresh = {} } = JSON.parse(fs.readFileSync(path.join(A, 'cases.json'), 'utf8'));
const kp = path.join(A, 'known.json');
const known = fs.existsSync(kp) ? JSON.parse(fs.readFileSync(kp, 'utf8')) : {};
const ids = new Set(cases.map(c => c.id));
const verdicts = {};
if (fs.existsSync(path.join(A, 'verdicts.txt'))) for (const l of fs.readFileSync(path.join(A, 'verdicts.txt'), 'utf8').split('\n')) {
  const [id, v, ...r] = l.split('|').map(x => x.trim()); if (!id || l.startsWith('#') || !ids.has(id)) continue;
  verdicts[id] = { v: /fout/i.test(v) ? 'fout' : 'goed', r: r.join('|') };
}
const eur = x => x == null ? '?' : '€' + x.toFixed(2).replace('.', ',');
const nieuwFout = [];
for (const c of cases) {
  if (c.auto) { c.v = c.auto; continue; }                                    // regex-toets goed
  if (c.isNew) {
    const vd = verdicts[c.id] || { v: 'goed', r: '' };
    known[c.id] = { v: vd.v, r: vd.r, k: c.kind, s: c.s, line: c.line, name: c.name, first: date, last: date };
    if (vd.v === 'fout') nieuwFout.push(c);
  } else if (known[c.id]) {
    known[c.id].last = date;
    if (verdicts[c.id]) Object.assign(known[c.id], verdicts[c.id]);        // later bijgestelde oordelen tellen ook
  }
  c.v = known[c.id] ? known[c.id].v : 'goed'; c.r = known[c.id] ? known[c.id].r : '';
}
// oordelen die een half jaar niet meer voorkwamen vervallen
const cut = new Date(Date.parse(date) - 183 * 864e5).toISOString().slice(0, 10);
for (const k of Object.keys(known)) if (known[k].last < cut) delete known[k];
fs.writeFileSync(kp, JSON.stringify(known));

const fout = cases.filter(c => c.v === 'fout');
const by = (arr, k) => arr.reduce((m, c) => (m[c[k]] = (m[c[k]] || 0) + 1, m), {});
const stores = [...new Set(cases.map(c => c.s))].sort();
const aanb = cases.filter(c => c.kind === 'AANB'), prod = cases.filter(c => c.kind === 'PROD');
const fA = fout.filter(c => c.kind === 'AANB'), fP = fout.filter(c => c.kind === 'PROD');
// belangrijkste nieuwe fouten bij aanbiedingen: de grootste (misleidende) korting eerst
const topNew = nieuwFout.filter(c => c.kind === 'AANB').sort((a, b) => (b.pct || 0) - (a.pct || 0));
const pctS = x => Math.round(100 * x) + '%';
const row = c => c.kind === 'AANB'
  ? `| ${c.s} | ${c.line} | ${c.name} (${c.deal}${c.p != null ? ', ' + eur(c.p) : ''}) | ${c.r || ''} |`
  : `| ${c.s} | ${c.line} | ${c.name}${c.size ? ' ' + c.size : ''} ${eur(c.price)} | ${c.r || ''} |`;

const md = [];
md.push(`# Controlerapport Boodje`, '', `Controle van **${date}**. Gemaakt door \`tools/audit.cjs\` en \`tools/audit_report.cjs\`; maatstaf in \`tools/AUDIT.md\`.`, '');
md.push(`## Samenvatting`, '');
md.push(`- **${fout.length} fouten** in deze controle, waarvan **${nieuwFout.length} nieuw** (${nieuwFout.filter(c => c.kind === 'AANB').length} bij aanbiedingen, ${nieuwFout.filter(c => c.kind === 'PROD').length} bij productkeuzes).`);
md.push(`- Aanbiedingen: ${aanb.length} getoond bij ${stat.regels} controleregels, ${fA.length} fout (${aanb.length ? pctS(fA.length / aanb.length) : '0%'}).`);
md.push(`- Productkeuzes: ${prod.length} gekozen, ${fP.length} fout (${prod.length ? pctS(fP.length / prod.length) : '0%'}); ${stat.prodNietGevonden} keer niets gevonden.`);
md.push(`- Datacontrole aanbiedingen: ${data.length} meldingen (${data.filter(d => d.live).length} bij aanbiedingen die nu in de app staan).`, '');
// verouderde bron: >21 dagen geen enkele wijziging, of >25% van de folder-normaalprijzen wijkt af
const oud = Object.entries(fresh).filter(([s, f]) => (f.paren >= 20 && f.afwijkend / f.paren > 0.25) || /^nooit/.test(f.laatsteWijziging) ||
  (/^\d/.test(f.laatsteWijziging) && Date.parse(date) - Date.parse(f.laatsteWijziging) > 21 * 864e5)).map(([s]) => s);
md.push(`- Vaste prijzen mogelijk verouderd bij: **${oud.length ? oud.join(', ') : 'geen'}** (zie Versheid).`, '');
md.push(`## Versheid vaste prijzen`, '', `Folder = normale prijs die de folder noemt bij een aanbieding, vergeleken met de vaste prijs in de app voor precies dezelfde productnaam. ` +
  `Laatste wijziging = laatste peildatum waarop de bron voor die winkel nog iets veranderde (data/db/snapshots.tsv).`, '',
  `| winkel | vergeleken | wijkt af | laatste wijziging in bron |`, `|---|---:|---:|---|`);
for (const [s, f] of Object.entries(fresh).sort()) md.push(`| ${s}${oud.includes(s) ? ' ⚠️' : ''} | ${f.paren} | ${f.paren ? f.afwijkend + ' (' + pctS(f.afwijkend / f.paren) + ')' : '–'} | ${f.laatsteWijziging} |`);
md.push('');
md.push(`## Per winkel`, '',`| winkel | aanbiedingen getoond | fout | productkeuzes | fout |`, `|---|---:|---:|---:|---:|`);
for (const s of stores) md.push(`| ${s} | ${aanb.filter(c => c.s === s).length} | ${fA.filter(c => c.s === s).length} | ${prod.filter(c => c.s === s).length} | ${fP.filter(c => c.s === s).length} |`);
md.push('');
md.push(`## Nieuwe fouten bij aanbiedingen`, '');
if (topNew.length) { md.push(`| winkel | regel | aanbieding | reden |`, `|---|---|---|---|`); for (const c of topNew) md.push(row(c)); } else md.push('Geen.');
md.push('', `## Nieuwe fouten bij productkeuzes`, '');
const npf = nieuwFout.filter(c => c.kind === 'PROD');
if (npf.length) { md.push(`| winkel | regel | gekozen | reden |`, `|---|---|---|---|`); for (const c of npf) md.push(row(c)); } else md.push('Geen.');
md.push('', `## Alle fouten in deze controle`, '', `### Aanbiedingen (${fA.length})`, '');
if (fA.length) { md.push(`| winkel | regel | aanbieding | reden |`, `|---|---|---|---|`); for (const c of fA) md.push(row(c)); } else md.push('Geen.');
md.push('', `### Productkeuzes (${fP.length})`, '');
if (fP.length) { md.push(`| winkel | regel | gekozen | reden |`, `|---|---|---|---|`); for (const c of fP) md.push(row(c)); } else md.push('Geen.');
md.push('', `## Datacontrole aanbiedingen`, '');
const why = {}; for (const d of data) for (const w of d.why.split('; ')) why[w] = (why[w] || 0) + 1;
if (data.length) {
  md.push(Object.entries(why).map(([w, n]) => `- ${w}: ${n}`).join('\n'), '', `| winkel | aanbieding | actie | geldig | melding |`, `|---|---|---|---|---|`);
  for (const d of data.slice(0, 60)) md.push(`| ${d.s} | ${d.n} | ${d.d}${d.p != null ? ' ' + eur(d.p) : ''}${d.was != null ? ' (was ' + eur(d.was) + ')' : ''} | ${d.from} t/m ${d.to} | ${d.why} |`);
  if (data.length > 60) md.push('', `… en nog ${data.length - 60}.`);
} else md.push('Geen meldingen.');
// verloop
const lp = path.join(A, 'log.tsv');
let log = fs.existsSync(lp) ? fs.readFileSync(lp, 'utf8').trim().split('\n') : ['datum\taanb_getoond\taanb_fout\tprod_gekozen\tprod_fout\tnieuw_fout\tdatameldingen'];
log = log.filter(l => !l.startsWith(date + '\t'));
log.push([date, aanb.length, fA.length, prod.length, fP.length, nieuwFout.length, data.length].join('\t'));
fs.writeFileSync(lp, log.join('\n') + '\n');
md.push('', `## Verloop`, '', `| datum | aanbiedingen | fout | productkeuzes | fout | nieuw fout |`, `|---|---:|---:|---:|---:|---:|`);
for (const l of log.slice(1).slice(-20)) { const x = l.split('\t'); md.push(`| ${x[0]} | ${x[1]} | ${x[2]} | ${x[3]} | ${x[4]} | ${x[5]} |`); }
fs.writeFileSync(path.join(A, 'RAPPORT.md'), md.join('\n') + '\n');

console.log(`fouten: ${fout.length} (nieuw ${nieuwFout.length}); aanbiedingen ${fA.length}/${aanb.length} fout, productkeuzes ${fP.length}/${prod.length} fout; datameldingen ${data.length}`);
console.log(`vaste prijzen mogelijk verouderd: ${oud.length ? oud.join(', ') : 'geen'}`);
console.log('belangrijkste nieuwe fouten bij aanbiedingen:');
for (const c of topNew.slice(0, 5)) console.log(`- ${c.s}: "${c.line}" → ${c.name} (${c.deal}) — ${c.r}`);
