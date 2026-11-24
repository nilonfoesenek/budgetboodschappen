// Draait op maandag en woensdag (na de prijs-update) en stuurt een melding als een favoriet recept ≥ 20% goedkoper is.
import { store, vapid, webpush, loadData, recipeCost, followHits } from './lib.mjs';
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
    // gevolgde producten die nu in de aanbieding zijn
    const fh = followHits(rec.follow || [], offers, rec.stores, today, IDX).filter(x => rec.sent['f:' + x.line] !== x.key);
    if (!hits.length && !fh.length) continue;
    hits.sort((a, b) => b.c.saving - a.c.saving);
    fh.sort((a, b) => (b.pct || 0) - (a.pct || 0));
    // altijd precies één melding, ook als er meerdere favorieten in de aanbieding zijn
    const names = xs => xs.length <= 1 ? xs.join('') : xs.slice(0, -1).join(', ') + ' en ' + xs[xs.length - 1];
    const prodTxt = fh.length > 3 ? names(fh.slice(0, 3).map(y => y.label)) + ` en nog ${fh.length - 3}` : names(fh.map(y => y.label));
    let title, body;
    if (hits.length && fh.length) {
      title = 'Je favorieten zijn deze week in de aanbieding';
      body = hits.slice(0, 2).map(x => `${x.f.title} −${Math.round(x.c.saving * 100)}%`).join(' · ') + ` · ${prodTxt}`;
    } else if (hits.length) {
      const h = hits[0], pct = Math.round(h.c.saving * 100);
      title = hits.length === 1 ? `${h.f.title}: ${pct}% goedkoper` : `${hits.length} favoriete gerechten in de aanbieding`;
      body = hits.length === 1 ? `Deze week ${eur(h.c.deal)} i.p.v. ${eur(h.c.regular)}.` : hits.slice(0, 3).map(x => `${x.f.title} −${Math.round(x.c.saving * 100)}%`).join(' · ');
    } else if (fh.length === 1) {
      const x = fh[0];
      title = `${x.label} is in de aanbieding`;
      body = `${x.deal.charAt(0).toUpperCase() + x.deal.slice(1)} bij ${x.storeName}.`;
    } else {
      title = `${fh.length} van je favoriete producten zijn deze week in de aanbieding!`;
      body = prodTxt + '.';
    }
    log.push({ title, body });
    if (dry) continue;
    try {
      await webpush.sendNotification(rec.subscription, JSON.stringify({ title, body, url: '/?tab=recipes' }), { TTL: 60 * 60 * 24 });
      for (const x of hits) rec.sent[x.f.id] = x.key;
      for (const x of fh) rec.sent['f:' + x.line] = x.key;
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
