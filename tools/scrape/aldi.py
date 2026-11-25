#!/usr/bin/env python3
"""Aldi: alle subcategorieën onder aldi.nl/producten; producttegels met prijs staan in de HTML.
Gebruik: python3 -I tools/scrape/aldi.py <uitmap> [<kloon>/tools/aldi_products.txt]   (± 4 minuten)
Met het tweede argument wordt ook de reservelijst tools/aldi_products.txt (naam | inhoud | prijs) bijgewerkt, als er genoeg producten zijn."""
import re, sys, os, html as H
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import get, money, clean, save
out = sys.argv[1]
B = 'https://www.aldi.nl'
home = get(B + '/producten.html') or ''
tops = sorted(set(re.findall(r'href="(?:https://www\.aldi\.nl)?(/producten/[a-z0-9\-]+\.html)"', home)))
subs = set(re.findall(r'href="(?:https://www\.aldi\.nl)?(/producten/[a-z0-9\-]+/[a-z0-9\-]+\.html)"', home))
for t in tops:
    subs |= set(re.findall(r'href="(?:https://www\.aldi\.nl)?(' + re.escape(t[:-5]) + r'/[a-z0-9\-]+\.html)"', get(B + t) or ''))
extra = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'aldi_categories.txt')
if os.path.exists(extra): subs |= {l.strip().replace(B, '') for l in open(extra) if l.strip().startswith(B)}
subs = sorted(subs)
print(f'aldi: {len(tops)} categorieën, {len(subs)} subcategorieën', file=sys.stderr)
rows = []
for s in subs:
    page = get(B + s, delay=0.6) or ''
    for blk in page.split('class="product-tile"')[1:]:
        name = re.search(r'data-testid="product-name">(.*?)</h2>', blk, re.S)
        cur = re.search(r'data-testid="tag-current-price-amount">\s*([\d.,]+)', blk)
        if not (name and cur): continue
        brand = re.search(r'data-testid="brand-name">(.*?)</p>', blk, re.S)
        old = re.search(r'data-testid="tag-cross-price-label"[^>]*>\s*(?:<[^>]+>\s*)*([\d.,]+)', blk)
        unit = re.search(r'data-testid="tag-sales-unit">(.*?)</span>', blk, re.S)
        pid = re.search(r'href="https://www\.aldi\.nl/product/[^"]*?-(\d+)\.html"', blk)
        p = money(cur.group(1)); o = money(old.group(1)) if old else None
        nm = clean(H.unescape(name.group(1)))
        rows.append([nm, p, clean(H.unescape(unit.group(1))).lower() if unit else '', pid.group(1) if pid else '', '', o or p,
                     'actie' if o and o > p else '', clean(H.unescape(brand.group(1))) if brand else ''])
rows = save(out, 'aldi', 'aldi.nl', rows)
if len(sys.argv) > 2 and len(rows) >= 800:
    with open(sys.argv[2], 'w', encoding='utf-8') as f:
        for r in rows: f.write(f'{r[0]} | {r[2]} | {r[5]:.2f}\n')
