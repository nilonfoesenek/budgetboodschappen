// Productkeuze met Claude: welke producten in elke winkel zijn echt het gevraagde ingrediënt?
// De woordvergelijking (match.js) zoekt per winkel ~16 kandidaten; Claude zegt welke goed zijn.
// Antwoorden worden gedeeld bewaard (Netlify Blobs), dus elke regel kost maar één keer AI-tegoed.
import { getStore } from '@netlify/blobs';
import { DATA } from './lib.mjs';
import '../../match.js';
const Match = globalThis.Match;

const json = (b, status = 200) => new Response(JSON.stringify(b), { status, headers: { 'content-type': 'application/json' } });
const MODEL = process.env.CLAUDE_MATCH_MODEL || process.env.CLAUDE_MODEL || 'claude-sonnet-5-5';
const V = 1; // verhoog bij een nieuwe prompt: oude antwoorden worden dan opnieuw gevraagd
const STORES = ['ah', 'jumbo', 'aldi', 'dirk', 'plus', 'lidl'];
const NAMES = { ah: 'Albert Heijn', jumbo: 'Jumbo', aldi: 'Aldi', dirk: 'Dirk', plus: 'Plus', lidl: 'Lidl' };
const N = 16, PER_DEVICE = 300, PER_DAY = 5000, MAX_LINES = 30, PARALLEL = 8, NEW_PER_CALL = 8;
const db = () => globalThis.__testMatch || getStore({ name: 'match', consistency: 'strong' });

let cache = null;
async function index() {
  if (cache && Date.now() - cache.t < 30 * 60 * 1000) return cache;
  const P = await fetch(DATA + 'prices.json').then(r => { if (!r.ok) throw new Error('prices ' + r.status); return r.json(); });
  const IDX = {}; for (const s of STORES) if (P.stores[s]) IDX[s] = Match.indexStore(P.stores[s]);
  const NAMESET = {}; for (const s in IDX) NAMESET[s] = new Set(IDX[s].map(p => p.name));
  return (cache = { t: Date.now(), IDX, NAMESET });
}
async function hash(s) {
  const h = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 40);
}

const PROMPT = (label, lists) => `Je helpt een Nederlandse boodschappen-app. Op een boodschappenlijst staat: "${label}".
Hieronder staan per supermarkt genummerde producten uit het assortiment.

Geef per supermarkt de nummers van ALLE producten die je kunt kopen als dit ingrediënt, zoals een thuiskok het bedoelt.
- Goed: hetzelfde soort product. Merk, biologisch, verpakkingsgrootte, vetpercentage, kleur of smaakvariant maken niet uit (tenzij de regel er iets over zegt, zoals "halfvolle", "rode", "gerookte", "pure").
- Niet goed: producten waarin het ingrediënt maar een smaak, vulling, onderdeel of saus is (salami met parmezaan, chips paprika, bonen in teriyakisaus, tonijnsalade, kruidenboter); kant-en-klare maaltijden; snacks en snoep; drank of sap bij vers fruit of groente; diervoeding; non-food bij eten (en andersom); vegetarische vervangers bij vlees (en andersom, tenzij de regel om vega vraagt).
- Bij een algemene term (kaas, pasta, rijst, brood, olie, suiker) zijn de gewone basisvarianten goed die je voor koken of op brood gebruikt, geen bijzondere specialiteiten.
- Bij kruiden: "tacokruiden" is een taco-kruidenmix; "1 tl komijn" is gemalen komijn; verse kruiden alleen als de regel "vers", "bosje" of "bakje" zegt, anders zijn gedroogde ook goed.
- Twijfel je, laat het weg. Is er geen goed product, geef een lege lijst.

${lists}

Antwoord ALLEEN met JSON, zoals {"ah":[1,4],"jumbo":[],"aldi":[2]} met een sleutel voor elke supermarkt hierboven.`;

async function ask(key, label, cands) {
  const lists = Object.entries(cands).map(([s, ps]) => `${NAMES[s]} (${s}):\n` + (ps.length ? ps.map((p, i) => `${i + 1}. ${p.name}${p.size ? ' (' + p.size + ')' : ''}`).join('\n') : '(geen kandidaten)')).join('\n\n');
  const r = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: MODEL, max_tokens: 400, temperature: 0, messages: [{ role: 'user', content: PROMPT(label, lists) }] }) });
  if (!r.ok) { const t = await r.text().catch(() => ''); console.log('anthropic', r.status, t.slice(0, 200)); const e = new Error('ai'); e.status = r.status; e.body = t; throw e; }
  const d = await r.json(), text = (d.content || []).filter(c => c.type === 'text').map(c => c.text).join('');
  const m = text.match(/\{[\s\S]*\}/); const o = JSON.parse(m ? m[0] : text);
  const out = {};
  for (const s in cands) out[s] = [...new Set((Array.isArray(o[s]) ? o[s] : []).map(n => cands[s][(+n) - 1]).filter(Boolean).map(p => p.name))];
  return out;
}

export async function matchLines(lines, { key, device = 'onbekend', budget = Infinity } = {}) {
  const { IDX, NAMESET } = await index(), s = db(), day = new Date().toISOString().slice(0, 10);
  const items = [], seen = new Set();
  for (const line of lines) { const it = Match.parseLine(line); if (!it) continue; const k = it.t.join(' '); if (seen.has(k)) continue; seen.add(k); items.push({ it, k }); }
  const results = {}, todo = [];
  await Promise.all(items.map(async x => {
    x.h = 'm/' + await hash(V + '|' + x.k);
    const c = await s.get(x.h, { type: 'json' });
    // nog geldig als elk eerder gekozen product nog in het assortiment staat (of er toen al niets was)
    if (c && STORES.every(st => !c.stores[st] || !c.stores[st].length || c.stores[st].some(n => NAMESET[st] && NAMESET[st].has(n)))) results[x.k] = c.stores;
    else todo.push(x);
  }));
  let left = todo.length, limited = false, err = null;
  if (todo.length) {
    const kDev = `rl/${day}/${device}`, kAll = `rl/${day}/all`;
    const [cDev, cAll] = await Promise.all([kDev, kAll].map(k => s.get(k, { type: 'json' }).then(v => v || 0)));
    const room = Math.max(0, Math.min(PER_DEVICE - cDev, PER_DAY - cAll, budget, NEW_PER_CALL));
    const now = todo.slice(0, room); limited = now.length < todo.length;
    if (now.length) await Promise.all([s.setJSON(kDev, cDev + now.length), s.setJSON(kAll, cAll + now.length)]);
    for (let i = 0; i < now.length; i += PARALLEL) {
      await Promise.all(now.slice(i, i + PARALLEL).map(async x => {
        const cands = {}; for (const st of STORES) if (IDX[st]) cands[st] = Match.recall(x.it, IDX[st], N);
        try {
          const stores = await ask(key, x.it.label, cands);
          await s.setJSON(x.h, { v: V, key: x.k, at: new Date().toISOString(), stores });
          results[x.k] = stores; left--;
        } catch (e) { err = e; }
      }));
      if (err && [401, 403].includes(err.status)) break;
    }
  }
  return { results, pending: left, limited, error: err ? (err.status === 401 ? 'sleutel' : /credit/i.test(err.body || '') ? 'tegoed' : 'ai') : null };
}

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'methode' }, 405);
  const key = process.env.CLAUDE_API_KEY;
  if (!key) return json({ error: 'sleutel' }, 503);
  let b; try { b = await req.json(); } catch { return json({ error: 'ongeldig' }, 400); }
  const lines = (Array.isArray(b.lines) ? b.lines : []).slice(0, MAX_LINES).map(x => String(x).slice(0, 120)).filter(Boolean);
  if (!lines.length) return json({ results: {} });
  const device = String(b.device || '').replace(/[^a-z0-9]/gi, '').slice(0, 40) || 'onbekend';
  try { return json(await matchLines(lines, { key, device })); }
  catch (e) { console.log('match', e.message); return json({ error: 'server' }, 500); }
};
export const config = { path: '/api/match' };
