// Productkeuze met Claude: welke producten in elke winkel zijn echt het gevraagde ingrediënt?
// De woordvergelijking (match.js) zoekt per winkel ~16 kandidaten; Claude zegt welke goed zijn.
// Antwoorden worden gedeeld bewaard (Netlify Blobs), dus elke regel kost maar één keer AI-tegoed.
import { getStore } from '@netlify/blobs';
import { DATA } from './lib.mjs';
import '../../match.js';
const Match = globalThis.Match;

const json = (b, status = 200) => new Response(JSON.stringify(b), { status, headers: { 'content-type': 'application/json' } });
const MODELS = { haiku: 'claude-haiku-5-5', sonnet: 'claude-sonnet-5-5' };
const DEFAULT = process.env.CLAUDE_MATCH_MODEL || 'haiku';
const V = 3; // verhoog bij een nieuwe prompt: oude antwoorden worden dan opnieuw gevraagd
const STORES = ['ah', 'jumbo', 'aldi', 'dirk', 'plus', 'lidl', 'dekamarkt', 'hoogvliet', 'spar', 'vomar', 'poiesz'];
const NAMES = { ah: 'Albert Heijn', jumbo: 'Jumbo', aldi: 'Aldi', dirk: 'Dirk', plus: 'Plus', lidl: 'Lidl', dekamarkt: 'DekaMarkt', hoogvliet: 'Hoogvliet', spar: 'SPAR', vomar: 'Vomar', poiesz: 'Poiesz' };
const N = 16, PER_DEVICE = 300, PER_DAY = 5000, MAX_LINES = 30, PARALLEL = 5, NEW_PER_CALL = 5;
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
- Groente, fruit, vlees en vis zonder verdere aanduiding betekent VERS: niet uit blik of pot, niet op sap, niet gedroogd, niet als poeder, niet diepvries en geen kant-en-klare mix (tomaten ≠ tomatenblokjes, ananas ≠ ananas op sap, teentjes knoflook ≠ knoflookpoeder, ui ≠ zilveruitjes of gebakken uitjes, rode peper = verse chilipeper ≠ paprika). Alleen als de regel zelf "blik", "pot", "diepvries", "gedroogd" of "poeder" zegt, is dat goed. Uitzondering: wat je normaal in blik, pot of zak koopt, is altijd goed in die vorm (maïs/maïskorrels, bonen, kikkererwten, linzen, doperwten, tomatenpuree, passata, olijven, kappertjes, augurken, ananas uit blik bij "blik ananas").
- Let op de diersoort en het stuk vlees: runderlappen zijn van het rund (geen hamlappen of varkenslappen), kipfilet is geen kipdij, gehakt zonder soort mag rund, half-om-half of varken.
- Een product in blokjes, plakken, geraspt of als snack is alleen goed als de regel dat vraagt (jong belegen kaas ≠ kaasblokjes; plakken kaas = kaas in plakken).
- Geen light-, zero- of suikervrije variant tenzij de regel dat zegt.
- Bij een algemene term (kaas, pasta, rijst, brood, olie, suiker) zijn de gewone basisvarianten goed die je voor koken of op brood gebruikt, geen bijzondere specialiteiten.
- Bij kruiden: "tacokruiden" is een taco-kruidenmix; "1 tl komijn" is gemalen komijn; verse kruiden alleen als de regel "vers", "bosje" of "bakje" zegt, anders zijn gedroogde ook goed.
- Neem ALLE producten mee die echt dit ingrediënt zijn, ook als ze anders heten (verse pepers = rode peper, maïskorrels = mais, bakkersgist = gist, ijsbergsla = krop ijsbergsla, panko paneermeel = panko). Laat alleen weg wat duidelijk iets anders is. Is er geen goed product, geef een lege lijst.

${lists}

Antwoord ALLEEN met JSON, zoals {"ah":[1,4],"jumbo":[],"aldi":[2]} met een sleutel voor elke supermarkt hierboven.`;

async function ask(key, label, cands, model) {
  let last;
  for (let i = 0; i < 3; i++) {
    try { return await ask1(key, label, cands, model); }
    catch (e) { if (e.status === 401 || e.status === 403) throw e; last = e; await new Promise(r => setTimeout(r, 400 * (i + 1))); }
  }
  throw last;
}
async function ask1(key, label, cands, model) {
  const lists = Object.entries(cands).map(([s, ps]) => `${NAMES[s]} (${s}):\n` + (ps.length ? ps.map((p, i) => `${i + 1}. ${p.name}${p.size ? ' (' + p.size + ')' : ''}`).join('\n') : '(geen kandidaten)')).join('\n\n');
  const call = (extra) => fetch('https://api.anthropic.com/v1/messages', { method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: MODELS[model] || model, max_tokens: 4000, ...extra, messages: [{ role: 'user', content: PROMPT(label, lists) }] }) });
  // eerst zonder denkstappen (snel en goedkoop); weigert het model dat, dan met lage inspanning
  let r = await call({ thinking: { type: 'disabled' } });
  if (r.status === 400) r = await call({ output_config: { effort: 'low' } });
  if (!r.ok) { const t = await r.text().catch(() => ''); console.log('anthropic', r.status, t.slice(0, 200)); const e = new Error('ai'); e.status = r.status; e.body = t; throw e; }
  const raw = await r.text(); let d; try { d = JSON.parse(raw); } catch { const e = new Error('onvolledig antwoord (' + raw.length + ' tekens)'); throw e; }
  const text = (d.content || []).filter(c => c.type === 'text').map(c => c.text).join('');
  const m = text.match(/\{[\s\S]*\}/); if (!m) { const e = new Error('geen antwoord (' + d.stop_reason + ')'); throw e; }
  const o = JSON.parse(m[0]);
  const out = {};
  for (const s in cands) out[s] = [...new Set((Array.isArray(o[s]) ? o[s] : []).map(n => cands[s][(+n) - 1]).filter(Boolean).map(p => p.name))];
  return out;
}

export async function matchLines(lines, { key, device = 'onbekend', budget = Infinity, model = DEFAULT } = {}) {
  const { IDX, NAMESET } = await index(), s = db(), day = new Date().toISOString().slice(0, 10);
  const items = [], seen = new Set();
  for (const line of lines) { const it = Match.parseLine(line); if (!it) continue; const k = it.t.join(' '); if (seen.has(k)) continue; seen.add(k); items.push({ it, k }); }
  const results = {}, todo = [];
  await Promise.all(items.map(async x => {
    x.h = 'm/' + await hash(V + '|' + model + '|' + x.k);
    const c = await s.get(x.h, { type: 'json' });
    // nog geldig als elk eerder gekozen product nog in het assortiment staat (of er toen al niets was)
    // nieuwe winkel erbij (nog geen antwoord voor die winkel) of producten verdwenen: opnieuw vragen
    if (c && STORES.every(st => !IDX[st] || (c.stores[st] && (!c.stores[st].length || c.stores[st].some(n => NAMESET[st].has(n)))))) results[x.k] = c.stores;
    else todo.push(x);
  }));
  let left = todo.length, limited = false, err = null;
  if (todo.length) {
    const kDev = `rl/${day}/${device}`, kAll = `rl/${day}/all`;
    const [cDev, cAll] = await Promise.all([kDev, kAll].map(k => s.get(k, { type: 'json' }).then(v => v || 0)));
    const room = Math.max(0, Math.min(PER_DEVICE - cDev, PER_DAY - cAll, budget));
    const now = todo.slice(0, Math.min(room, NEW_PER_CALL)); limited = room < todo.length && room < NEW_PER_CALL;
    if (now.length) await Promise.all([s.setJSON(kDev, cDev + now.length), s.setJSON(kAll, cAll + now.length)]);
    for (let i = 0; i < now.length; i += PARALLEL) {
      await Promise.all(now.slice(i, i + PARALLEL).map(async x => {
        const cands = {}; for (const st of STORES) if (IDX[st]) cands[st] = Match.recall(x.it, IDX[st], N);
        try {
          const stores = await ask(key, x.it.label, cands, model);
          await s.setJSON(x.h, { v: V, key: x.k, at: new Date().toISOString(), stores });
          results[x.k] = stores; left--;
        } catch (e) { err = e; }
      }));
      if (err && [401, 403].includes(err.status)) break;
    }
  }
  return { results, pending: left, limited, error: err ? (err.status === 401 ? 'sleutel' : /credit/i.test(err.body || '') ? 'tegoed' : 'ai') : null,
    detail: err ? String((err.status || '') + ' ' + (err.body || err.message || '')).replace(/sk-ant-[\w-]+/g, '…').slice(0, 160) : undefined };
}

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'methode' }, 405);
  const key = process.env.CLAUDE_API_KEY;
  if (!key) return json({ error: 'sleutel' }, 503);
  let b; try { b = await req.json(); } catch { return json({ error: 'ongeldig' }, 400); }
  const lines = (Array.isArray(b.lines) ? b.lines : []).slice(0, MAX_LINES).map(x => String(x).slice(0, 120)).filter(Boolean);
  if (!lines.length) return json({ results: {} });
  const device = String(b.device || '').replace(/[^a-z0-9]/gi, '').slice(0, 40) || 'onbekend';
  const model = MODELS[b.model] ? b.model : DEFAULT;
  try { return json(await matchLines(lines, { key, device, model })); }
  catch (e) { console.log('match', e.message); return json({ error: 'server' }, 500); }
};
export const config = { path: '/api/match' };
