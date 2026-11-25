// Export van de anoniem bewaarde AH-prijzen uit kassabonnen, voor de geplande verversing (tools/fetch_bonprijzen.py).
// Alleen met de geheime sleutel (Netlify-omgevingsvariabele BONPRIJZEN_KEY, header "Authorization: Bearer <sleutel>").
// Geeft losse regels [naam, prijs per stuk, week] terug, gesorteerd op naam: bonnen gaan niet als geheel naar buiten.
// Ruimt bonregels ouder dan 7 maanden op (het prijsgeheugen gebruikt maximaal 183 dagen).
import { bonStore } from './lib.mjs';
const json = (b, status = 200) => new Response(JSON.stringify(b), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

export default async (req) => {
  const key = process.env.BONPRIJZEN_KEY;
  if (!key) return json({ error: 'BONPRIJZEN_KEY ontbreekt in Netlify.' }, 503);
  if (req.headers.get('authorization') !== 'Bearer ' + key) return json({ error: 'geen toegang' }, 401);
  const s = bonStore(), { blobs } = await s.list({ prefix: 'bon/ah/' });
  const now = new Date(), oldest = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 7, 1)).toISOString().slice(0, 7);
  const keep = [], drop = [];
  for (const b of blobs) (b.key.split('/')[2] < oldest ? drop : keep).push(b.key);
  for (let i = 0; i < drop.length; i += 50) await Promise.all(drop.slice(i, i + 50).map(k => s.delete(k)));
  const scans = new Map();
  for (let i = 0; i < keep.length; i += 50) {
    const got = await Promise.all(keep.slice(i, i + 50).map(k => s.get(k, { type: 'json' }).then(v => [k, v]).catch(() => [k, null])));
    for (const [k, v] of got) {
      if (!v) continue;
      const id = k.split('/').pop().replace(/-\d+$/, ''), sc = scans.get(id) || { s: null, tg: false, w: null, i: [] };
      sc.s = sc.s || v.s; sc.tg = sc.tg || !!v.tg; sc.w = sc.w || v.w; sc.i.push(...(v.i || []));
      scans.set(id, sc);
    }
  }
  const rows = [];
  let n = 0;
  for (const sc of scans.values()) if (sc.s === 'ah' && !sc.tg && sc.w) { n++; for (const [name, p] of sc.i) rows.push([name, p, sc.w]); }
  rows.sort((a, b) => a[0].localeCompare(b[0]) || a[2].localeCompare(b[2]));
  return json({ date: now.toISOString().slice(0, 10), bonnen: n, rows });
};
export const config = { path: '/api/bonprijzen' };
