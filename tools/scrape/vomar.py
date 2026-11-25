#!/usr/bin/env python3
"""Vomar: alle subcategoriepagina's van vomar.nl/producten; producten met prijs staan in de HTML.
Gebruik: python3 -I tools/scrape/vomar.py <uitmap>   (± 3 minuten)"""
import re, sys, os, html as H
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import get, money, clean, save
out = sys.argv[1]
B = 'https://www.vomar.nl'
top = sorted(set(re.findall(r'href="(/producten/[a-z0-9\-]+)"', get(B + '/producten') or '')))
subs = set()
for t in top:
    subs |= set(re.findall(r'href="(' + re.escape(t) + r'/[a-z0-9\-]+)"', get(B + t) or ''))
subs = sorted(subs)
print(f'vomar: {len(top)} categorieën, {len(subs)} subcategorieën', file=sys.stderr)
rows, links = [], {}
for s in subs:
    page = get(B + s, delay=0.7) or ''
    for blk in re.split(r'<div class="col-md-4 product"', page)[1:]:
        m = re.search(r'href="(/producten/[^"]+/(\d+))"', blk)
        d = re.search(r'<p class="description"[^>]*>(.*?)</p>', blk, re.S)
        if not (m and d): continue
        size = re.search(r'</p>\s*<span[^>]*>(.*?)</span>', blk, re.S)
        prices = [money(a + '.' + b) for a, b in re.findall(r'<span class="large"[^>]*>\s*(\d+)\.?\s*</span>\s*<span class="small"[^>]*>\s*(\d\d)\s*</span>', blk)]
        prices = [p for p in prices if p]
        if not prices: continue
        label = ' '.join(clean(H.unescape(re.sub('<[^>]+>', ' ', x))) for x in re.findall(r'<div class="labels"[^>]*>(.*?)</div>', blk, re.S)).strip()
        links[clean(H.unescape(d.group(1))).lower()] = B + m.group(1)
        rows.append([clean(H.unescape(d.group(1))), min(prices), clean(H.unescape(size.group(1))).lower() if size else '', m.group(2), '', max(prices), label])
save(out, 'vomar', 'vomar.nl', rows, {'links': links})
