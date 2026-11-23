// Gedeelde boodschappenlijst: iedereen met de geheime link kan meelezen en -schrijven. Geen account nodig.
import { getStore } from '@netlify/blobs';
import { randomBytes } from 'node:crypto';
const json = (b, status = 200) => new Response(JSON.stringify(b), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const db = () => globalThis.__testLists || getStore({ name: 'lists', consistency: 'strong' });
const okId = id => typeof id === 'string' && /^[A-Za-z0-9]{16,32}$/.test(id);
const norm = l => l.toLowerCase().replace(/\s+/g, ' ').trim();
const clean = t => String(t || '').split('\n').map(l => l.trim().slice(0, 120)).filter(Boolean).slice(0, 300);
const cleanDone = d => { const o = {}; if (d && typeof d === 'object') for (const k of Object.keys(d).slice(0, 400)) if (d[k] === true && k.length <= 140) o[k] = true; return o; };

// 3-weg samenvoegen: wat de ander deed blijft staan, wat jij toevoegde/weghaalde/aanpaste komt erbij.
export function merge(server, base, mine) {
  const B = new Set(base.text.map(norm)), M = new Set(mine.text.map(norm));
  const removed = new Set([...B].filter(k => !M.has(k)));
  let text = server.text.filter(l => !removed.has(norm(l)));
  const have = new Set(text.map(norm));
  for (const l of mine.text) if (!B.has(norm(l)) && !have.has(norm(l))) { text.push(l); have.add(norm(l)); }
  const done = { ...server.done };
  for (const k of new Set([...Object.keys(base.done), ...Object.keys(mine.done)])) {
    if (mine.done[k] && !base.done[k]) done[k] = true;
    if (!mine.done[k] && base.done[k]) delete done[k];
  }
  return { text: text.slice(0, 300), done };
}

export default async (req) => {
  const s = db(), url = new URL(req.url);
  if (req.method === 'GET') {
    const id = url.searchParams.get('id'); if (!okId(id)) return json({ error: 'ongeldige link' }, 400);
    const l = await s.get(id, { type: 'json' }); if (!l) return json({ error: 'Deze gedeelde lijst bestaat niet meer.' }, 404);
    return json(l);
  }
  let b; try { b = await req.json(); } catch { return json({ error: 'ongeldig' }, 400); }
  if (req.method === 'POST') {
    const id = randomBytes(15).toString('base64').replace(/[^A-Za-z0-9]/g, '').slice(0, 18).padEnd(18, 'x');
    const l = { v: 1, text: clean(b.text), done: cleanDone(b.done), updated: new Date().toISOString() };
    await s.setJSON(id, l); return json({ id, ...l });
  }
  if (req.method === 'PUT') {
    if (!okId(b.id)) return json({ error: 'ongeldige link' }, 400);
    const cur = await s.get(b.id, { type: 'json' }); if (!cur) return json({ error: 'Deze gedeelde lijst bestaat niet meer.' }, 404);
    const mine = { text: clean(b.text), done: cleanDone(b.done) };
    const next = cur.v === b.base ? mine : merge(cur, { text: clean(b.baseText), done: cleanDone(b.baseDone) }, mine);
    const l = { v: cur.v + 1, ...next, updated: new Date().toISOString() };
    await s.setJSON(b.id, l); return json(l);
  }
  return json({ error: 'methode' }, 405);
};
export const config = { path: '/api/list' };
