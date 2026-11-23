"""Bouwt data/prices.json voor de boodschappen-app.

Gebruik: python3 -I build_prices.py <checkjebon_supermarkets.json> <aldi_dir> <out.json>
- AH, Jumbo, Dirk, Plus en Lidl komen uit de Checkjebon open data (github.com/supermarkt/checkjebon).
  Lidl daar komt via boodschaapje.nl en wordt opgeschoond (non-food met artikelcode, prijs < 0,10 weg).
- Aldi komt uit tekstbestanden in <aldi_dir> met regels: naam | inhoud | prijs
"""
import json, sys, re, glob, os, datetime

src, aldi_dir, out = sys.argv[1], sys.argv[2], sys.argv[3]
today = datetime.date.today().isoformat()

def clean_size(s):
    s = (s or '').strip().lower().replace(',', '.')
    s = re.sub(r'^per\s+', '', s)
    return re.sub(r'\s+', ' ', s)

data = json.load(open(src, encoding='utf-8'))
stores = {}
for s in data:
    if s['n'] in ('ah', 'jumbo', 'dirk', 'plus', 'lidl') and s['d']:
        rows, seen_cj = [], set()
        for p in s['d']:
            name = (p.get('n') or '').strip()
            if s['n'] == 'lidl':
                if re.search(r'-\d{6,8}$', name) or name.lower().startswith('lidlmini'):
                    continue  # non-food actie-artikelen en kinderwinkeltje
                name = re.sub(r'\s+', ' ', name)
            try:
                price = round(float(p['p']), 2)
            except (TypeError, ValueError, KeyError):
                continue
            if price <= 0 or (s['n'] == 'lidl' and price < 0.10):
                continue
            row = [name, price, clean_size(p.get('s', ''))]
            k = (row[0].lower(), row[2])
            if k in seen_cj:
                continue
            seen_cj.add(k)
            rows.append(row)
        stores[s['n']] = rows

aldi, seen = [], set()
for f in sorted(glob.glob(os.path.join(aldi_dir, '*.txt'))):
    for line in open(f, encoding='utf-8'):
        parts = [x.strip() for x in line.split('|')]
        if len(parts) != 3:
            continue
        name, size, price = parts
        try:
            price = round(float(price.replace('€', '').replace(',', '.')), 2)
        except ValueError:
            continue
        key = (name.lower(), clean_size(size))
        if key in seen:
            continue
        seen.add(key)
        aldi.append([name, price, clean_size(size)])
stores['aldi'] = aldi

meta = {
    'ah': {'label': 'Albert Heijn', 'source': 'Checkjebon open data', 'note': 'Vaste AH-prijzen in deze bron worden niet meer dagelijks bijgewerkt en kunnen afwijken.'},
    'jumbo': {'label': 'Jumbo', 'source': 'Checkjebon open data', 'note': ''},
    'dirk': {'label': 'Dirk', 'source': 'Checkjebon open data', 'note': ''},
    'plus': {'label': 'Plus', 'source': 'Checkjebon open data', 'note': ''},
    'lidl': {'label': 'Lidl', 'source': 'Checkjebon open data (via boodschaapje.nl)', 'note': 'Alleen gewone prijzen, geen aanbiedingen. Productnamen zijn soms afgekort.'},
    'aldi': {'label': 'Aldi', 'source': 'aldi.nl', 'note': 'Selectie van het assortiment (±600 producten).'},
}
json.dump({'built': today, 'meta': meta, 'stores': stores}, open(out, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print({k: len(v) for k, v in stores.items()}, os.path.getsize(out))
