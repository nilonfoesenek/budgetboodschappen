// Productfoto's: /api/img?s=<winkel>&n=<productnaam>
// Zoekt de productpagina op (links uit data/links/<winkel>.json), leest daar de og:image en stuurt door naar die foto.
// De uitkomst wordt bewaard in Netlify Blobs en door de CDN gecachet, zodat elke foto maar één keer wordt opgezocht.
import { getStore } from '@netlify/blobs';
import { DATA } from './lib.mjs';

// Getest nov 2026: werkt bij AH, Jumbo, Dirk, Hoogvliet (og:image) en SPAR en Vomar (foto in de pagina).
// Niet: Plus (botcontrole), DekaMarkt (links verlopen), Poiesz (pagina laadt pas met JavaScript), Lidl (bron zonder foto's), Aldi (geen links).
const STORES = ['ah', 'jumbo', 'dirk', 'hoogvliet', 'spar', 'vomar'];
const BODY = { spar: /https:\/\/media\.spar\.nl\/productdetail\/[^"' )<>\\]+/, vomar: /https:\/\/d3vricquk1sjgf\.cloudfront\.net\/product-images\/[^"' )<>\\?]+/ };
const LINKS = {}; // per winkel, blijft in het geheugen zolang de functie warm is
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const DAY = 86400;

async function links(s) {
  if (!LINKS[s]) LINKS[s] = fetch(DATA + 'links/' + s + '.json').then(r => { if (!r.ok) throw new Error('links ' + r.status); return r.json(); })
    .catch(e => { delete LINKS[s]; throw e; });
  return LINKS[s];
}
const hash = async t => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t)))].map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 40);
const decode = u => u.replace(/&amp;/g, '&').replace(/&#x2F;/gi, '/').replace(/&#47;/g, '/');

function ogImage(html, base) {
  const m = html.match(/<meta[^>]+(?:property|name)=["'](?:og:image(?::secure_url)?|twitter:image)["'][^>]*>/i);
  if (!m) return null;
  const c = m[0].match(/content=["']([^"']+)["']/i); if (!c) return null;
  let u = decode(c[1].trim());
  if (u.startsWith('//')) u = 'https:' + u; else if (u.startsWith('/')) u = new URL(u, base).href;
  if (!/^https:\/\//.test(u) || /logo|placeholder|404|header/i.test(u)) return null;
  return u;
}

const go = (url, s) => new Response(null, { status: 302, headers: {
  location: url, 'cache-control': `public, max-age=${7 * DAY}`, 'netlify-cdn-cache-control': `public, durable, max-age=${30 * DAY}`, 'x-img-store': s } });
const none = () => new Response('geen foto', { status: 404, headers: {
  'cache-control': `public, max-age=${DAY}`, 'netlify-cdn-cache-control': `public, durable, max-age=${3 * DAY}` } });

export default async (req) => {
  const q = new URL(req.url).searchParams, s = q.get('s'), n = (q.get('n') || '').trim().toLowerCase().slice(0, 200);
  if (!STORES.includes(s) || !n) return none();
  const db = globalThis.__testImgStore || getStore({ name: 'img' }), key = s + '/' + await hash(n);
  const hit = await db.get(key, { type: 'json' }).catch(() => null);
  if (hit && hit.u) return go(hit.u, s);
  if (hit && Date.now() - hit.t < 7 * DAY * 1000) return none(); // onlangs niets gevonden: een week niet opnieuw proberen
  let u = null;
  try {
    const L = await links(s), l = L.l[n];
    if (l) {
      const page = /^https?:\/\//.test(l) ? l : L.base + l;
      const r = await fetch(page, { headers: { 'user-agent': UA, 'accept-language': 'nl-NL,nl;q=0.9', accept: 'text/html' }, redirect: 'follow', signal: AbortSignal.timeout(7000) });
      if (r.ok) {
        // alleen het begin van de pagina lezen: og:image staat in de <head>
        const reader = r.body.getReader(); let html = '', bytes = 0;
        const dec = new TextDecoder();
        while (bytes < 600000) { const { done, value } = await reader.read(); if (done) break; bytes += value.length; html += dec.decode(value, { stream: true });
          if (BODY[s] ? BODY[s].test(html) : /<\/head>/i.test(html)) break; }
        reader.cancel().catch(() => {});
        u = ogImage(html, page);
        if (!u && BODY[s]) { const m = html.match(BODY[s]); if (m) u = s === 'vomar' ? m[0] + '?width=400&height=400' : m[0]; }
      }
    }
  } catch (e) { /* netwerkfout: niets bewaren, volgende keer opnieuw */ return none(); }
  if (u) try { u = new URL(u).href; } catch (e) { u = null; }
  await db.setJSON(key, u ? { u, t: Date.now() } : { t: Date.now() }).catch(() => {});
  return u ? go(u, s) : none();
};
export const config = { path: '/api/img' };
