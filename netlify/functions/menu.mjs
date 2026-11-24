// Weekmenu op basis van de aanbiedingen van deze week, met Claude (sleutel: CLAUDE_API_KEY).
import { store, DATA } from './lib.mjs';
const json = (b, status = 200) => new Response(JSON.stringify(b), { status, headers: { 'content-type': 'application/json' } });
const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-5-5';
const NAMES = { ah: 'AH', jumbo: 'Jumbo', aldi: 'Aldi', dirk: 'Dirk', plus: 'Plus', dekamarkt: 'DekaMarkt', hoogvliet: 'Hoogvliet', spar: 'SPAR', lidl: 'Lidl', vomar: 'Vomar', poiesz: 'Poiesz' };
const disc = o => o.pct || (o.was && o.p != null && o.was > o.p ? 1 - o.p / o.was : 0);

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'methode' }, 405);
  const key = process.env.CLAUDE_API_KEY;
  if (!key) return json({ error: 'De AI-sleutel ontbreekt nog in Netlify.' }, 503);
  let b; try { b = await req.json(); } catch { return json({ error: 'ongeldig' }, 400); }
  const stores = (Array.isArray(b.stores) ? b.stores : []).filter(s => NAMES[s]);
  if (!stores.length) return json({ error: 'Kies eerst winkels met aanbiedingen.' }, 400);
  const count = Math.max(1, Math.min(7, parseInt(b.count, 10) || 5));
  const persons = Math.max(1, Math.min(8, parseInt(b.persons, 10) || 2));
  const kcal = Math.max(0, Math.min(1500, parseInt(b.kcal, 10) || 0));
  const protein = !!b.protein, wish = String(b.wish || '').slice(0, 200);
  const avoid = (Array.isArray(b.avoid) ? b.avoid : []).slice(0, 20).map(x => String(x).slice(0, 60));
  const device = String(b.device || '').replace(/[^a-z0-9]/gi, '').slice(0, 40) || 'onbekend';

  const s = store(), day = new Date().toISOString().slice(0, 10), kDev = `rl/${day}/m-${device}`, kAll = `rl/${day}/all`;
  const [cDev, cAll] = await Promise.all([kDev, kAll].map(k => s.get(k, { type: 'json' }).then(v => v || 0)));
  if (cDev >= 6) return json({ error: 'Je hebt vandaag al 6 weekmenu’s gemaakt. Morgen kan het weer.' }, 429);
  if (cAll >= 300) return json({ error: 'De dagelijkse limiet van de app is bereikt. Morgen kan het weer.' }, 429);
  await Promise.all([s.setJSON(kDev, cDev + 1), s.setJSON(kAll, cAll + 1)]);

  let offers;
  try { offers = (await fetch(DATA + 'offers.json').then(r => r.json())).offers; } catch { return json({ error: 'Aanbiedingen konden niet geladen worden.' }, 502); }
  const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Amsterdam' });
  const live = offers.filter(o => stores.includes(o.s) && o.to >= today && o.from <= today)
    .filter(o => !/(bier|pilsener|wijn|frisdrank|cola|chips|snoep|koek|chocola|reep|ijs|drop|thee|koffie|smoothie|sap|energy)/i.test(o.n))
    .sort((a, c) => disc(c) - disc(a)).slice(0, 70);
  const list = live.map(o => `- ${NAMES[o.s]} | ${o.n} | ${o.d}${o.p != null ? ` | €${o.p.toFixed(2)}` : ''}`).join('\n');

  const prompt = `Je bent een Nederlandse kok die goedkope, gezonde avondmaaltijden plant met de supermarktaanbiedingen van deze week.

Aanbiedingen (winkel | product | actie | prijs):
${list}

Maak ${count} verschillende avondgerechten voor ${persons} ${persons === 1 ? 'persoon' : 'personen'}.
- Bouw elk gerecht rond minstens 2 producten uit de aanbiedingen. Varieer: niet twee keer hetzelfde hoofdingrediënt.
- Gewone Nederlandse supermarktproducten, haalbaar in 15–40 minuten.${protein ? '\n- Eiwitrijk: streef naar minstens 35 g eiwit per persoon.' : ''}${kcal ? `\n- Ongeveer ${kcal} kcal per persoon.` : ''}${wish ? `\n- Wens: ${wish}` : ''}${avoid.length ? `\n- Niet deze gerechten (heeft de gebruiker al): ${avoid.join('; ')}` : ''}
- Schrijf ingrediënten als boodschappenregels zoals je ze koopt, hoeveelheid vooraan (g, kg, ml, l of aantal), zonder merk, voor ${persons} ${persons === 1 ? 'persoon' : 'personen'}. Voorraadkast (zout, peper, olie, kruiden, bouillon, sojasaus) apart in "pantry".
- "deals": de namen van de gebruikte aanbiedingen zoals hierboven, met winkel, bijv. "Aldi: Kipfilet 500 g".
- "steps": 3 tot 5 korte bereidingsstappen.
Antwoord ALLEEN met JSON: {"meals":[{"title":"…","time":"25 min","kcal":getal per persoon,"protein":gram eiwit per persoon,"deals":["…"],"items":["…"],"pantry":["…"],"steps":["…"]}]}`;

  let r;
  try {
    r = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: MODEL, max_tokens: 4000, messages: [{ role: 'user', content: prompt }] }) });
  } catch { return json({ error: 'De AI is niet bereikbaar. Probeer het zo opnieuw.' }, 502); }
  if (!r.ok) { const t = await r.text().catch(() => ''); console.log('anthropic', r.status, t.slice(0, 300));
    return json({ error: r.status === 401 ? 'De AI-sleutel klopt niet.' : /credit/i.test(t) ? 'Het AI-tegoed is op.' : 'De AI gaf een fout. Probeer het opnieuw.' }, 502); }
  const data = await r.json(), text = (data.content || []).filter(c => c.type === 'text').map(c => c.text).join('');
  const m = text.match(/\{[\s\S]*\}/); let out; try { out = JSON.parse(m ? m[0] : text); } catch { return json({ error: 'Het menu kon niet gelezen worden. Probeer het opnieuw.' }, 502); }
  const arr = a => (Array.isArray(a) ? a : []).map(x => String(x).trim()).filter(Boolean).slice(0, 30).map(x => x.slice(0, 140));
  const num = v => { const x = Math.round(+v); return Number.isFinite(x) && x > 0 && x < 5000 ? x : null; };
  const meals = (Array.isArray(out.meals) ? out.meals : []).slice(0, 7).map(x => ({ title: String(x.title || 'Gerecht').slice(0, 80), time: String(x.time || '').slice(0, 20),
    kcal: num(x.kcal), protein: num(x.protein), deals: arr(x.deals).slice(0, 6), items: arr(x.items), pantry: arr(x.pantry), steps: arr(x.steps).slice(0, 6) }));
  if (!meals.length) return json({ error: 'Er kwam geen menu uit. Probeer het opnieuw.' }, 502);
  return json({ meals, persons });
};
export const config = { path: '/api/menu' };
