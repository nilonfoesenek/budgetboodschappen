// Gedeelde code voor de push-functies.
import { getStore } from '@netlify/blobs';
import * as webpush from 'web-push';
import '../../match.js';
const Match = globalThis.Match;

export const DATA = 'https://raw.githubusercontent.com/nilonfoesenek/budgetboodschappen/main/data/';
export const store = () => globalThis.__testStore || getStore({ name: 'push', consistency: 'strong' });

// VAPID-sleutels: worden één keer aangemaakt en in Netlify Blobs bewaard (niet in GitHub).
export async function vapid() {
  const s = store();
  let k = await s.get('config/vapid', { type: 'json' });
  if (!k) { k = webpush.generateVAPIDKeys(); await s.setJSON('config/vapid', k); }
  webpush.setVapidDetails('https://budgetboodschappen.netlify.app', k.publicKey, k.privateKey);
  return k;
}
export { webpush };

export async function idOf(endpoint) {
  const h = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(endpoint));
  return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
}

const addDays = (d, n) => { const t = new Date(d + 'T12:00:00Z'); t.setUTCDate(t.getUTCDate() + n); return t.toISOString().slice(0, 10); };

// Kosten van een recept bij de gekozen winkels: zonder en met de aanbiedingen van nu (zelfde rekenwijze als de app).
export function recipeCost(lines, IDX, offers, stores, today) {
  const live = offers.filter(o => o.to >= today && o.from <= today);
  let regular = 0, deal = 0, found = 0; const deals = [];
  for (const line of lines) {
    const it = Match.parseLine(line); if (!it) continue;
    let bestReg = Infinity, bestDeal = Infinity, bestO = null, exact = false;
    const per = [];
    for (const s of stores) {
      if (!IDX[s]) continue;
      const pick = Match.candidates(it, IDX[s], 6)[0]; if (!pick) continue;
      const cost = pick.cost || Match.costOf(it, pick.p, pick.p.qty && pick.p.qty.d);
      let total = cost.total, o = Match.offerFor(it, live, s), used = null;
      if (o) {
        let op = cost.packs; const oq = Match.parseQty(o.n);
        if (it.req && oq && oq.d === it.req.d && oq.q > 0) op = Math.max(1, Math.ceil(it.req.q / oq.q - 1e-9));
        if (o.p != null && o.p * op < total) { total = o.p * op; used = o; }
        else if (o.pct) { total = total * (1 - o.pct); used = o; }
      }
      per.push({ sub: !!pick.sub, reg: cost.total, total, o: used });
    }
    if (!per.length) continue;
    const pool = per.some(x => !x.sub) ? per.filter(x => !x.sub) : per;
    for (const x of pool) { if (x.reg < bestReg) bestReg = x.reg; if (x.total < bestDeal) { bestDeal = x.total; bestO = x.o; } }
    regular += bestReg; deal += bestDeal; found++;
    if (bestO && bestDeal < bestReg - 0.005) deals.push(bestO);
  }
  return { regular, deal, found, deals, saving: regular > 0 ? (regular - deal) / regular : 0 };
}

export async function loadData() {
  const [P, O] = await Promise.all(['prices.json', 'offers.json'].map(f => fetch(DATA + f).then(r => { if (!r.ok) throw new Error(f + ' ' + r.status); return r.json(); })));
  const IDX = {}; for (const s in P.stores) IDX[s] = Match.indexStore(P.stores[s]);
  return { IDX, offers: O.offers };
}
export { addDays };

const NAMES = { ah: 'AH', jumbo: 'Jumbo', aldi: 'Aldi', dirk: 'Dirk', plus: 'Plus', lidl: 'Lidl' };
// gevolgde producten: welke zijn nu bij een van je winkels in de aanbieding?
export function followHits(lines, offers, stores, today) {
  const live = offers.filter(o => o.to >= today && o.from <= today), out = [];
  for (const line of lines) {
    const it = Match.parseLine(line); if (!it) continue;
    let best = null;
    const disc = o => o.pct || (o.was && o.p != null && o.was > o.p ? 1 - o.p / o.was : 0);
    for (const s of stores) { const o = Match.offerFor(it, live, s); if (o && disc(o) >= 0.15 && (!best || disc(o) > disc(best))) best = o; }
    if (best) out.push({ line, label: it.label.charAt(0).toUpperCase() + it.label.slice(1), deal: best.d, storeName: NAMES[best.s] || best.s, key: best.s + best.n + best.to });
  }
  return out;
}
