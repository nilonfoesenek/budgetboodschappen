#!/usr/bin/env node
// Lidl: Lidl zet geen volledig assortiment online. Wat wél online staat: de pagina "Eten & drinken" met de producten
// van deze week, inclusief de normale prijs ("Zonder Lidl Plus x" of de doorgestreepte prijs). Die leggen we elke week vast,
// zodat de vaste Lidl-prijzen stap voor stap actueel worden. Gebruik: node tools/scrape/lidl.cjs <uitmap>
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
const URLS = ['https://www.lidl.nl/c/eten-en-drinken/s10068374', 'https://www.lidl.nl/c/aanbiedingen/a10008785'];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 1000 } }); const rows = new Map();
  for (const u of URLS) {
    await p.goto(u, { waitUntil: 'networkidle', timeout: 120000 });
    let last = -1;
    for (let i = 0; i < 80; i++) {
      await p.mouse.wheel(0, 3000); await p.waitForTimeout(500);
      const more = p.locator('button:has-text("Meer"), button:has-text("Toon meer")').first();
      if (await more.count()) { try { await more.click({ timeout: 2000 }); await p.waitForTimeout(1500); } catch (e) {} }
      const n = await p.$$eval('.product-grid-box', x => x.length); if (n === last && i > 10) break; last = n;
    }
    const tiles = await p.$$eval('.product-grid-box', xs => xs.map(x => {
      let imp = {}; try { imp = JSON.parse(decodeURIComponent(x.getAttribute('data-gridbox-impression') || '{}')); } catch (e) {}
      return { imp, text: x.innerText };
    }));
    for (const t of tiles) {
      const L = t.text.split('\n').map(s => s.trim()).filter(Boolean);
      const name = (t.imp.name || '').trim(); if (!name) continue;
      const cur = +t.imp.price || null;
      const zonder = t.text.match(/Zonder Lidl Plus\s*([\d.,]+)/i);
      const nums = L.filter(s => /^\d+[.,]\d\d$/.test(s)).map(s => +s.replace(',', '.'));
      let regular = zonder ? +zonder[1].replace(',', '.') : (nums.length > 1 ? Math.max(...nums) : cur);
      const size = (L.find(s => /^(per\s|\d+(?:[.,]\d+)?\s*(g|kg|ml|l|cl|st|stuks?)\b|\d+\s*x\s*\d+)/i.test(s)) || '').replace(/^per\s+/i, '').toLowerCase();
      const when = (L.find(s => /\d{1,2}\/\d{1,2}/.test(s)) || '');
      rows.set(t.imp.id || name + size, [name, cur, size, String(t.imp.id || ''), '', regular, (zonder || (nums.length > 1)) ? 'actie' : '', when]);
    }
  }
  await b.close();
  const list = [...rows.values()].filter(r => r[0] && r[5]);
  fs.writeFileSync(path.join(out, 'lidl.json'), JSON.stringify({ store: 'lidl', date: new Date().toISOString().slice(0, 10), source: 'lidl.nl (Eten & drinken)', partial: true, rows: list }));
  console.log(`lidl: ${list.length} producten met normale prijs → ${path.join(out, 'lidl.json')}`);
})().catch(e => { console.error('lidl: FOUT', e.message); process.exit(1); });
