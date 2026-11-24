// Kassabon (foto of screenshot) → winkel, datum, regels met prijzen en kortingen, met Claude (sleutel: CLAUDE_API_KEY).
// De foto wordt niet bewaard: alleen doorgestuurd naar Claude en het resultaat gaat terug naar de telefoon.
import { store } from './lib.mjs';
const json = (b, status = 200) => new Response(JSON.stringify(b), { status, headers: { 'content-type': 'application/json' } });
const MODEL = process.env.CLAUDE_RECEIPT_MODEL || 'claude-haiku-5-5';
const PER_DEVICE = 15, PER_DAY_TOTAL = 800;
const STORES = ['ah', 'jumbo', 'aldi', 'dirk', 'plus', 'lidl', 'dekamarkt', 'hoogvliet', 'spar', 'vomar', 'poiesz'];

// Snel genoeg voor de tijdslimiet van Netlify: de app stuurt een lange bon in stukken (parallel), elk stuk geeft een korte lijst terug.
const PROMPT = (part, parts) => `Je leest ${parts > 1 ? `stuk ${part} van ${parts} (van boven naar beneden) van ` : ''}een Nederlandse supermarkt-kassabon (foto of screenshot).
Geef ALLEEN compacte JSON:
{"store":"ah|jumbo|aldi|dirk|plus|lidl|dekamarkt|hoogvliet|spar|vomar|poiesz|anders|null","date":"JJJJ-MM-DD|null","total":totaal betaald of null,
 "i":[["leesbare productnaam (afkortingen uitgeschreven: 'HAK BR BONEN 720' wordt 'Hak bruine bonen 720 g')",aantal,regelbedrag vóór korting,korting op deze regel (positief, anders 0),"actie of null"]],
 "d":[["kortingsregel",bedrag,"product of null"]]}
- Elke productregel één keer. Gewicht ('0,532 kg x 2,99'): aantal 1, regelbedrag.
- Kortingsregels (BONUS, KORTING, 1+1, 2e halve prijs, persoonlijke bonus) in "d", en bij het product als duidelijk is bij welk product.
- Geen statiegeld, tassen, koopzegels of subtotalen als product. Halve regel aan de rand van de foto: overslaan.
- Staan winkel, datum of totaal niet in dit stuk: null.
- Geen kassabon: {"error":"korte uitleg"}`;

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'methode' }, 405);
  const key = process.env.CLAUDE_API_KEY;
  if (!key) return json({ error: 'De AI-sleutel ontbreekt nog in Netlify.' }, 503);
  let body; try { body = await req.json(); } catch { return json({ error: 'ongeldig' }, 400); }
  const img = typeof body.image === 'string' && /^[A-Za-z0-9+/=]+$/.test(body.image) && body.image.length < 3_000_000 ? body.image : null;
  if (!img) return json({ error: 'Geen foto ontvangen.' }, 400);
  const parts = Math.max(1, Math.min(6, +body.parts || 1)), part = Math.max(1, Math.min(parts, +body.part || 1));
  const device = String(body.device || '').replace(/[^a-z0-9]/gi, '').slice(0, 40) || 'onbekend';

  const s = store(), day = new Date().toISOString().slice(0, 10);
  const kDev = `rl/${day}/b-${device}`, kAll = `rl/${day}/ball`;
  const [cDev, cAll] = await Promise.all([kDev, kAll].map(k => s.get(k, { type: 'json' }).then(v => v || 0)));
  if (part === 1 && cDev >= PER_DEVICE) return json({ error: `Je hebt vandaag al ${PER_DEVICE} bonnen laten lezen. Morgen kan het weer.` }, 429);
  if (cAll >= PER_DAY_TOTAL) return json({ error: 'De dagelijkse limiet van de app is bereikt. Morgen kan het weer.' }, 429);
  if (part === 1) await Promise.all([s.setJSON(kDev, cDev + 1), s.setJSON(kAll, cAll + 1)]);

  const content = [{ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: img } }, { type: 'text', text: PROMPT(part, parts) }];
  let r;
  try {
    r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', signal: AbortSignal.timeout(9500),
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: MODEL, max_tokens: 2500, output_config: { effort: 'low' }, messages: [{ role: 'user', content }] })
    });
  } catch { return json({ error: 'De bon lezen duurde te lang. Probeer het opnieuw, of maak de foto iets dichterbij.' }, 504); }
  if (!r.ok) {
    const t = await r.text().catch(() => ''); console.log('anthropic', r.status, t.slice(0, 300));
    return json({ error: r.status === 401 ? 'De AI-sleutel klopt niet.' : /credit/i.test(t) ? 'Het AI-tegoed is op.' : 'De bon kon niet gelezen worden. Probeer het opnieuw.' }, 502);
  }
  const data = await r.json(), text = (data.content || []).filter(c => c.type === 'text').map(c => c.text).join('');
  const m = text.match(/\{[\s\S]*\}/); let out; try { out = JSON.parse(m ? m[0] : text); } catch { return json({ error: 'De bon kon niet gelezen worden. Probeer een scherpere foto.' }, 502); }
  if (out.error) return json({ error: String(out.error).slice(0, 200) }, 422);
  const num = v => { const x = Math.round(parseFloat(String(v ?? '').replace(',', '.')) * 100) / 100; return Number.isFinite(x) ? x : 0; };
  const items = (Array.isArray(out.i) ? out.i : []).slice(0, 80).filter(Array.isArray).map(x => ({
    name: String(x[0] || '').slice(0, 100), qty: Math.max(1, Math.min(99, Math.round(+x[1] || 1))), price: num(x[2]), discount: Math.abs(num(x[3])), deal: x[4] ? String(x[4]).slice(0, 40) : null }))
    .filter(x => x.name && x.price !== 0);
  const discounts = (Array.isArray(out.d) ? out.d : []).slice(0, 60).filter(Array.isArray).map(x => ({ text: String(x[0] || '').slice(0, 60), amount: Math.abs(num(x[1])), item: x[2] ? String(x[2]).slice(0, 100) : null })).filter(x => x.amount);
  const st = STORES.includes(out.store) ? out.store : null;
  const date = /^\d{4}-\d{2}-\d{2}$/.test(out.date || '') ? out.date : null;
  return json({ store: st, date, total: out.total == null ? null : num(out.total), items, discounts });
};
export const config = { path: '/api/receipt' };
