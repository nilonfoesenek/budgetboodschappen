// Draait op maandag en woensdag (na de prijs-update) en stuurt een melding als een favoriet recept ≥ 20% goedkoper is.
import { store, vapid, webpush, loadData, recipeCost } from './lib.mjs';
const eur = n => '€' + n.toFixed(2).replace('.', ',');

export async function run({ dry = false } = {}) {
  await vapid();
  const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Amsterdam' });
  const { IDX, offers } = await loadData();
  const s = store(), { blobs } = await s.list({ prefix: 'subs/' });
  let sent = 0; const log = [];
  for (const b of blobs) {
    const rec = await s.get(b.key, { type: 'json' }); if (!rec) continue;
    const hits = [];
    for (const f of rec.favs || []) {
      if (!f.items || !f.items.length) continue;
      const c = recipeCost(f.items, IDX, offers, rec.stores, today);
      if (c.found < Math.ceil(f.items.length * 0.6) || c.saving < 0.2) continue;
      const key = c.deals.map(o => o.s + o.to).sort().join('|');
      if (rec.sent[f.id] === key) continue; // deze aanbiedingen al gemeld
      hits.push({ f, c, key });
    }
    if (!hits.length) continue;
    hits.sort((a, b) => b.c.saving - a.c.saving);
    const h = hits[0], pct = Math.round(h.c.saving * 100);
    const title = hits.length === 1 ? `${h.f.title}: ${pct}% goedkoper` : `${hits.length} favorieten in de aanbieding`;
    const body = hits.length === 1 ? `Deze week ${eur(h.c.deal)} i.p.v. ${eur(h.c.regular)}.`
      : hits.slice(0, 3).map(x => `${x.f.title} −${Math.round(x.c.saving * 100)}%`).join(' · ');
    log.push({ title, body });
    if (dry) continue;
    try {
      await webpush.sendNotification(rec.subscription, JSON.stringify({ title, body, url: '/?tab=recipes' }), { TTL: 60 * 60 * 24 });
      for (const x of hits) rec.sent[x.f.id] = x.key;
      await s.setJSON(b.key, rec); sent++;
    } catch (e) {
      if (e.statusCode === 404 || e.statusCode === 410) await s.delete(b.key); // afgemeld of verlopen
    }
  }
  return { subs: blobs.length, sent, log };
}

export default async () => { const r = await run(); console.log(JSON.stringify(r)); };
// 09:00 UTC = 10:00 in de winter / 11:00 in de zomer, ruim na de update van 07:13
export const config = { schedule: '0 9 * * 1,3' };
