// Screenshot/foto van een recept → boodschappenregels, met Claude (sleutel: CLAUDE_API_KEY in Netlify).
import { store } from './lib.mjs';
const json = (b, status = 200) => new Response(JSON.stringify(b), { status, headers: { 'content-type': 'application/json' } });
const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-5-5';
const PER_DEVICE = 20, PER_DAY_TOTAL = 300;

const PROMPT = (n) => `Je zet een recept om in een Nederlandse boodschappenlijst. Je krijgt een of meer screenshots of foto's: van een receptensite, een kookboek, een voedings-/calorie-app (zoals in een lijst met ingrediënten, kcal en grammen per portie) of een foto van een gerecht.

Regels:
- Neem ALLEEN ingrediënten over. Negeer kcal, voedingswaarden, merklogo's, knoppen, klokjes, menu's, bereidingsstappen en statusbalken.
- Herken het gerecht en het aantal porties. Staan hoeveelheden per portie (bijv. calorie-apps) of voor een ander aantal personen, reken dan om naar ${n || 'het aantal personen uit het recept (geen aantal bekend: 2 personen)'}.
- Schrijf elk ingrediënt als boodschappenregel zoals je het in een Nederlandse supermarkt koopt: hoeveelheid vooraan, dan een gewone productnaam zonder merk. Rond af naar wat je kunt kopen:
  "25 gram spitskool" → "1 spitskool"; "25 g ui" → "1 gele ui"; "175 g tonijn" → "175 g tonijnsteak"; "25 g winterpeen" → "500 g winterpeen"; "taugé 25 g" (2 pers) → "200 g taugé"; "2 tenen knoflook" → "1 bol knoflook".
- Gebruik g, kg, ml, l of een aantal. Geen eetlepels of theelepels in de regel (die horen bij de voorraadkast).
- Voorraadkast (zout, peper, olie, cookingspray, boter, suiker, bloem, sojasaus, ketjap, azijn, mosterd, honing, bouillon, gedroogde kruiden en specerijen, water): zet ze in "pantry" met een korte naam, niet in "items".
- Is het alleen een foto van een gerecht zonder ingrediëntenlijst: bedenk een gangbaar Nederlands recept en zet "guess": true.
Antwoord ALLEEN met JSON, zonder uitleg:
{"title":"naam van het gerecht","servings":aantal,"guess":false,"items":["…"],"pantry":["…"]}
Staat er geen recept of eten op: {"error":"korte uitleg in het Nederlands"}`;

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'methode' }, 405);
  const key = process.env.CLAUDE_API_KEY;
  if (!key) return json({ error: 'De AI-sleutel ontbreekt nog in Netlify.' }, 503);
  let body; try { body = await req.json(); } catch { return json({ error: 'ongeldig' }, 400); }
  const imgs = (Array.isArray(body.images) ? body.images : []).filter(x => typeof x === 'string' && /^[A-Za-z0-9+/=]+$/.test(x) && x.length < 3_000_000).slice(0, 4);
  if (!imgs.length) return json({ error: 'Geen foto ontvangen.' }, 400);
  const persons = Math.max(0, Math.min(12, parseInt(body.persons, 10) || 0));
  const device = String(body.device || '').replace(/[^a-z0-9]/gi, '').slice(0, 40) || 'onbekend';

  // limiet per telefoon en per dag, zodat niemand je tegoed kan opmaken
  const s = store(), day = new Date().toISOString().slice(0, 10);
  const ip = (req.headers.get('x-nf-client-connection-ip') || '').replace(/[^0-9a-f.:]/gi, '');
  const kDev = `rl/${day}/d-${device}`, kIp = `rl/${day}/i-${ip}`, kAll = `rl/${day}/all`;
  const [cDev, cIp, cAll] = await Promise.all([kDev, kIp, kAll].map(k => s.get(k, { type: 'json' }).then(v => v || 0)));
  if (cDev >= PER_DEVICE || cIp >= PER_DEVICE * 2) return json({ error: `Je hebt vandaag al ${PER_DEVICE} foto's laten lezen. Morgen kan het weer.` }, 429);
  if (cAll >= PER_DAY_TOTAL) return json({ error: 'De dagelijkse limiet van de app is bereikt. Morgen kan het weer.' }, 429);
  await Promise.all([s.setJSON(kDev, cDev + 1), s.setJSON(kIp, cIp + 1), s.setJSON(kAll, cAll + 1)]);

  const content = [...imgs.map(d => ({ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: d } })),
    { type: 'text', text: PROMPT(persons ? `${persons} ${persons === 1 ? 'persoon' : 'personen'}` : '') }];
  let r;
  try {
    r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: MODEL, max_tokens: 1200, messages: [{ role: 'user', content }] })
    });
  } catch { return json({ error: 'De AI is niet bereikbaar. Probeer het zo opnieuw.' }, 502); }
  if (!r.ok) {
    const t = await r.text().catch(() => '');
    console.log('anthropic', r.status, t.slice(0, 300));
    const msg = r.status === 401 ? 'De AI-sleutel klopt niet.' : r.status === 400 && /credit/i.test(t) ? 'Het AI-tegoed is op.' : r.status === 429 ? 'Even te druk bij de AI. Probeer het over een minuut opnieuw.' : 'De AI gaf een fout. Probeer het opnieuw.';
    return json({ error: msg }, 502);
  }
  const data = await r.json();
  const text = (data.content || []).filter(c => c.type === 'text').map(c => c.text).join('');
  const m = text.match(/\{[\s\S]*\}/);
  let out; try { out = JSON.parse(m ? m[0] : text); } catch { return json({ error: 'Ik kon het recept niet goed lezen. Probeer een scherpere screenshot.' }, 422); }
  if (out.error) return json({ error: String(out.error).slice(0, 200) }, 422);
  const clean = a => (Array.isArray(a) ? a : []).map(x => String(x).trim()).filter(Boolean).slice(0, 60).map(x => x.slice(0, 120));
  return json({ title: String(out.title || 'Recept').slice(0, 80), servings: out.servings || null, guess: !!out.guess, items: clean(out.items), pantry: clean(out.pantry) });
};
export const config = { path: '/api/scan' };
