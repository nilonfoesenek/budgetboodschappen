#!/usr/bin/env python3
"""Dirk en DekaMarkt (zelfde webplatform): alle subcategoriepagina's uit de sitemap; de producten met prijs staan in de pagina (Nuxt-data).
Gebruik: python3 -I tools/scrape/detailresult.py <uitmap> [dirk] [dekamarkt]   (± 2 minuten per winkel)"""
import json, re, sys, os, urllib.parse
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import get, money, clean, save
SITES = {'dirk': ('https://www.dirk.nl', '/boodschappen/'), 'dekamarkt': ('https://www.dekamarkt.nl', '/producten/')}
out = sys.argv[1]

def products(html):
    m = re.search(r'<script[^>]*id="__NUXT_DATA__"[^>]*>(.*?)</script>', html, re.S)
    if not m: return []
    a = json.loads(m.group(1))
    def R(x, d=0):
        if d > 12 or not (isinstance(x, int) and not isinstance(x, bool) and 0 <= x < len(a)): return x
        v = a[x]
        if isinstance(v, dict): return {k: R(i, d + 1) for k, i in v.items()}
        if isinstance(v, list):
            if v and isinstance(v[0], str) and v[0] in ('Reactive', 'ShallowReactive', 'Ref', 'ShallowRef', 'EmptyRef'):
                return R(v[1], d + 1) if len(v) > 1 else None
            return [R(i, d + 1) for i in v]
        return v
    return [R(i) for i, v in enumerate(a) if isinstance(v, dict) and 'productId' in v and 'price' in v and 'headerText' in v]

for store in (sys.argv[2:] or list(SITES)):
    base, pre = SITES[store]
    sm = get(base + '/categories-and-items-sitemap.xml') or ''
    cats = [u for u in re.findall(r'<loc>([^<]+)</loc>', sm) if u.startswith(base + pre) and u[len(base + pre):].count('/') == 1]
    if len(cats) < 10:  # sitemap zonder subcategorieën: haal ze van de hoofdcategoriepagina's
        top = re.findall(r'href="(' + re.escape(pre) + r'[a-z0-9()\-]+)"', get(base + pre.rstrip('/')) or '')
        for t in sorted(set(top)):
            cats += [base + h for h in re.findall(r'href="(' + re.escape(t) + r'/[a-z0-9()\-]+)"', get(base + t) or '')]
    cats = sorted(set(cats))
    print(f'{store}: {len(cats)} subcategorieën', file=sys.stderr)
    rows, links = [], {}
    for u in cats:
        html = get(u, delay=0.7)
        if not html: continue
        for p in products(html):
            pr = p.get('price') or {}
            normal, offer = money(pr.get('normalPrice')), money(pr.get('offerPrice'))
            name = clean(p.get('headerText'))
            if p.get('url'): links[name.lower()] = base + p['url']
            rows.append([name, offer if (pr.get('isOffer') and offer) else normal, clean(p.get('packaging')).lower(), str(p.get('productId') or ''), '', normal,
                         'actie' if pr.get('isOffer') else ''])
    save(out, store, base.split('//')[1], rows, {'links': links})
