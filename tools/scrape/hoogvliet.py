#!/usr/bin/env python3
"""Hoogvliet: alle producten uit de sitemap (sku in de URL), prijzen via de catalogus-API die de website zelf gebruikt.
Gebruik: python3 -I tools/scrape/hoogvliet.py <uitmap>   (± 5 minuten)"""
import json, re, sys, os, datetime
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import get, money, clean, save
out = sys.argv[1]
sm = get('https://hoogvliet.nl/sitemap-catalog.xml')
skus = sorted({m for m in re.findall(r'<loc>https://hoogvliet\.nl/[^<]*?-(\d{9})</loc>', sm)})
print('hoogvliet: skus in sitemap', len(skus), file=sys.stderr)
rows, links, today = [], {}, datetime.date.today().isoformat()
B = 50
for i in range(0, len(skus), B):
    body = {'type': 'realtimeProducts', 'args': {'skus': skus[i:i + B]}, 'context': {'calculationDate': today}}
    t = get('https://hoogvliet.nl/api/catalog', data=json.dumps(body).encode(), headers={'Content-Type': 'application/json'}, delay=0.5)
    if not t: continue
    for it in json.loads(t)['data']['result']['items']:
        try: meta = json.loads(it.get('metadata') or '{}')
        except ValueError: meta = {}
        pr = ((it.get('price_range') or {}).get('minimum_price') or {})
        reg = money((pr.get('regular_price') or {}).get('value')); fin = money((pr.get('final_price') or {}).get('value')) or reg
        sku = (it.get('url_key') or '').rsplit('-', 1)[-1]
        inh = meta.get('inhoud_ce'); eh = (meta.get('eenheid') or '').lower()
        size = clean(f"{inh:g} {'g' if eh == 'gram' else 'ml' if eh.startswith('milli') else 'kg' if eh.startswith('kilo') else 'l' if eh.startswith('liter') else 'st' if eh.startswith('stuk') else eh}") if isinstance(inh, (int, float)) and inh else ''
        name = clean(it.get('name'))
        if meta.get('merk') and not name.lower().startswith(meta['merk'].lower()): name = clean(meta['merk'] + ' ' + name)
        pm = it.get('promotion_meta_data') or {}
        if it.get('url_key'): links[name.lower()] = 'https://hoogvliet.nl/' + it['url_key']
        rows.append([name, fin, size, sku, meta.get('ean') or '', reg, clean(pm.get('korting_label') or '') if it.get('is_promotion') else ''])
    if i % 1000 == 0: print(f'  {i}/{len(skus)}', file=sys.stderr)
save(out, 'hoogvliet', 'hoogvliet.nl', rows, {'links': links})
