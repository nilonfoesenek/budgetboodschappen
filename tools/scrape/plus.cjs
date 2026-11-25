#!/usr/bin/env node
// Plus: opent plus.nl/producten in Chromium en bladert door alle pagina's van het assortiment via dezelfde
// productlijst-aanvraag die de pagina zelf doet (12 producten per pagina, ± 17.000 producten, ± 10 minuten met 3 tegelijk).
// Gebruik: node tools/scrape/plus.cjs <uitmap>
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch(); let p, rq;
  async function open() {
    if (p) await p.close(); p = await b.newPage(); rq = null;
    p.on('request', r => { if (/DataActionGetProductListAndCategoryInfo/.test(r.url())) rq = { url: r.url(), h: r.headers(), body: r.postData() }; });
    await p.goto('https://www.plus.nl/producten', { waitUntil: 'networkidle', timeout: 120000 });
    for (let i = 0; i < 20 && !rq; i++) await sleep(500);
    if (!rq) throw new Error('productlijst-aanvraag niet gezien');
  }
  async function page(n) {
    return p.evaluate(async ({ rq, n }) => {
      const body = JSON.parse(rq.body); body.screenData.variables.PageNumber = n;
      const h = {}; for (const k of ['content-type', 'x-csrftoken', 'outsystems-locale', 'accept']) if (rq.h[k]) h[k] = rq.h[k];
      const r = await fetch(rq.url, { method: 'POST', headers: h, body: JSON.stringify(body), credentials: 'include' });
      if (!r.ok) return { err: r.status }; return (await r.json()).data;
    }, { rq, n });
  }
  await open();
  const first = await page(1); const pages = first.TotalPages, total = first.TotalNumberItems;
  console.error(`plus: ${total} producten op ${pages} pagina's`);
  const rows = new Map(); let fails = 0;
  const add = d => { for (const x of d.ProductList.List) { const s = x.PLP_Str; const orig = +s.OriginalPrice || null, neu = +s.NewPrice || 0;
    rows.set(s.SKU, [s.Name.trim(), neu > 0 ? neu : orig, (s.Product_Subtitle || '').replace(/^per\s+/i, '').trim().toLowerCase(), s.SKU, s.EAN || '', orig, s.PromotionLabel || '']); } };
  add(first);
  // een paar pagina's tegelijk (standaard 3): ± 10 minuten in plaats van ± 30, nog steeds rustig voor de website
  const PAR = +(process.env.PLUS_PAR || 3), MAXP = +(process.env.PLUS_MAXPAGES || pages); let next = 2;
  async function worker() {
    while (next <= Math.min(pages, MAXP)) {
      const n = next++; let d = null;
      for (let t = 0; t < 3 && !(d && d.ProductList); t++) {
        try { d = await page(n); } catch (e) { d = null; }
        if (!(d && d.ProductList)) { fails++; await sleep(3000 * (t + 1)); }
      }
      if (d && d.ProductList) add(d);
      if (n % 100 === 0) console.error(`  ${n}/${pages} (${rows.size})`);
      await sleep(300);
    }
  }
  await Promise.all(Array.from({ length: PAR }, worker));
  if (fails > 20) { try { await open(); } catch (e) {} }
  await b.close();
  const list = [...rows.values()].filter(r => r[0] && r[1]);
  fs.writeFileSync(path.join(out, 'plus.json'), JSON.stringify({ store: 'plus', date: new Date().toISOString().slice(0, 10), source: 'plus.nl', total, rows: list }));
  console.log(`plus: ${list.length} producten (van ${total}), ${fails} herhaalde pagina's → ${path.join(out, 'plus.json')}`);
})().catch(e => { console.error('plus: FOUT', e.message); process.exit(1); });
