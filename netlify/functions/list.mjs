// Gedeelde boodschappenlijst: iedereen met de geheime link kan meelezen en -schrijven. Geen account nodig.
import { getStore } from '@netlify/blobs';
import { randomBytes } from 'node:crypto';
import { store as pushStore, vapid, webpush, idOf } from './lib.mjs';
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

// korte code om mee te doen (zonder verwarrende tekens: geen 0/O, 1/I/L)
const ABC = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const newCode = () => [...randomBytes(6)].map(b => ABC[b % ABC.length]).join('');
async function ensureCode(s, id, l) {
  if (l.code) return l.code;
  for (let i = 0; i < 5; i++) { const c = newCode(); if (!(await s.get('code/' + c))) { await s.setJSON('code/' + c, { id }); l.code = c; await s.setJSON(id, l); return c; } }
  return null;
}
const pub = l => ({ v: l.v, text: l.text, done: l.done, updated: l.updated, code: l.code, members: Object.values(l.members || {}).filter(Boolean) });

export default async (req) => {
  const s = db(), url = new URL(req.url);
  if (req.method === 'GET') {
    let id = url.searchParams.get('id');
    const code = (url.searchParams.get('code') || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (code) { if (code.length !== 6) return json({ error: 'Deze code klopt niet.' }, 400); const c = await s.get('code/' + code, { type: 'json' }); if (!c) return json({ error: 'Deze code klopt niet.' }, 404); id = c.id; }
    if (!okId(id)) return json({ error: 'ongeldige link' }, 400);
    const l = await s.get(id, { type: 'json' }); if (!l) return json({ error: 'Deze gedeelde lijst bestaat niet meer.' }, 404);
    await ensureCode(s, id, l);
    return json({ id, ...pub(l) });
  }
  let b; try { b = await req.json(); } catch { return json({ error: 'ongeldig' }, 400); }
  if (req.method === 'POST') {
    const id = randomBytes(15).toString('base64').replace(/[^A-Za-z0-9]/g, '').slice(0, 18).padEnd(18, 'x');
    if (b.action === 'done') return finished(s, b);
    const l = { v: 1, text: clean(b.text), done: cleanDone(b.done), updated: new Date().toISOString(), members: {} };
    await s.setJSON(id, l); await ensureCode(s, id, l); return json({ id, ...pub(l) });
  }
  if (req.method === 'PUT') {
    if (!okId(b.id)) return json({ error: 'ongeldige link' }, 400);
    const cur = await s.get(b.id, { type: 'json' }); if (!cur) return json({ error: 'Deze gedeelde lijst bestaat niet meer.' }, 404);
    const mine = { text: clean(b.text), done: cleanDone(b.done) };
    const next = cur.v === b.base ? mine : merge(cur, { text: clean(b.baseText), done: cleanDone(b.baseDone) }, mine);
    const l = { ...cur, v: cur.v + 1, ...next, updated: new Date().toISOString() };
    await s.setJSON(b.id, l); return json(pub(l));
  }
  return json({ error: 'methode' }, 405);
};

// "Boodschappen gedaan": lijst leeg voor iedereen en een melding naar de anderen
async function finished(s, b) {
  if (!okId(b.id)) return json({ error: 'ongeldige link' }, 400);
  const cur = await s.get(b.id, { type: 'json' }); if (!cur) return json({ error: 'Deze gedeelde lijst bestaat niet meer.' }, 404);
  const name = String(b.name || '').trim().slice(0, 30) || 'Iemand';
  const l = { ...cur, v: cur.v + 1, text: [], done: {}, updated: new Date().toISOString() };
  await s.setJSON(b.id, l);
  const me = typeof b.endpoint === 'string' && b.endpoint ? await idOf(b.endpoint) : null;
  let sent = 0;
  const ids = Object.keys(cur.members || {}).filter(x => x !== me);
  if (ids.length) {
    await vapid(); const ps = pushStore();
    await Promise.all(ids.map(async pid => {
      const rec = await ps.get('subs/' + pid, { type: 'json' });
      if (!rec) { delete l.members[pid]; return; }
      try { await webpush.sendNotification(rec.subscription, JSON.stringify({ title: 'Boodje', body: `${name} heeft de boodschappen gedaan 🛒`, url: '/?tab=list' }), { TTL: 60 * 60 * 12 }); sent++; }
      catch (e) { if (e.statusCode === 404 || e.statusCode === 410) delete l.members[pid]; }
    }));
    await s.setJSON(b.id, l);
  }
  return json({ ...pub(l), sent });
}

// aangeroepen vanuit /api/push: wie wil meldingen van welke lijst
export async function setMembership(pid, lists, oldLists, name) {
  const s = db();
  for (const id of new Set([...(oldLists || []), ...lists])) {
    if (!okId(id)) continue;
    const l = await s.get(id, { type: 'json' }); if (!l) continue;
    l.members = l.members || {};
    if (lists.includes(id)) l.members[pid] = name || l.members[pid] || 'Iemand'; else delete l.members[pid];
    await s.setJSON(id, l);
  }
}
export const config = { path: '/api/list' };
