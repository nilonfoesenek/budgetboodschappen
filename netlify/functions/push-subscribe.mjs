// GET: publieke sleutel. POST: aanmelding (of bijwerken van favorieten). DELETE: afmelden.
import { store, vapid, idOf } from './lib.mjs';
const json = (b, status = 200) => new Response(JSON.stringify(b), { status, headers: { 'content-type': 'application/json' } });

export default async (req) => {
  try {
    if (req.method === 'GET') { const k = await vapid(); return json({ key: k.publicKey }); }
    const body = await req.json().catch(() => null);
    const sub = body && body.subscription;
    if (!sub || typeof sub.endpoint !== 'string' || !/^https:\/\//.test(sub.endpoint) || !sub.keys) return json({ error: 'ongeldig' }, 400);
    const id = await idOf(sub.endpoint), s = store();
    if (req.method === 'DELETE') { await s.delete('subs/' + id); return json({ ok: true }); }
    if (req.method !== 'POST') return json({ error: 'methode' }, 405);
    const favs = (Array.isArray(body.favs) ? body.favs : []).slice(0, 50).map(f => ({
      id: String(f.id).slice(0, 40), title: String(f.title || 'Recept').slice(0, 80),
      items: (Array.isArray(f.items) ? f.items : []).slice(0, 60).map(x => String(x).slice(0, 120)) }));
    const follow = (Array.isArray(body.follow) ? body.follow : []).slice(0, 100).map(x => String(x).slice(0, 100)).filter(Boolean);
    const stores = (Array.isArray(body.stores) ? body.stores : []).filter(x => /^[a-z]{2,8}$/.test(x)).slice(0, 8);
    const old = await s.get('subs/' + id, { type: 'json' });
    await s.setJSON('subs/' + id, { subscription: { endpoint: sub.endpoint, keys: { p256dh: String(sub.keys.p256dh), auth: String(sub.keys.auth) } },
      favs, follow, stores: stores.length ? stores : ['ah', 'jumbo', 'aldi'], sent: (old && old.sent) || {}, updated: new Date().toISOString() });
    return json({ ok: true });
  } catch (e) { return json({ error: 'server' }, 500); }
};
export const config = { path: '/api/push' };
