"""Bouwt data/prices.json voor de boodschappen-app.

Gebruik: python3 -I build_prices.py <checkjebon_supermarkets.json> <aldi_dir> <out.json> [--own <map>] [--offers <offers.json>]
- --own <map>: eigen uitlezing van de winkelwebsites (tools/scrape/*, bestanden <winkel>.json). Een volledige uitlezing met genoeg
  producten vervangt de Checkjebon-gegevens van die winkel; een gedeeltelijke (Lidl) werkt alleen de gevonden producten bij.
- --offers <offers.json>: de normale prijs die de folder bij een aanbieding noemt, werkt de vaste prijs bij van precies hetzelfde product
  bij winkels die nog op een verouderde bron draaien (AH, Lidl).
- AH, Jumbo, Dirk, Plus, Lidl, DekaMarkt, Hoogvliet, SPAR, Vomar en Poiesz komen uit de Checkjebon open data (github.com/supermarkt/checkjebon).
  Lidl daar komt via boodschaapje.nl en wordt opgeschoond (non-food met artikelcode, prijs < 0,10 weg).
- Aldi komt uit tekstbestanden in <aldi_dir> met regels: naam | inhoud | prijs
"""
import json, sys, re, glob, os, datetime

args = sys.argv[1:]
def opt(name):
    if name in args: i = args.index(name); v = args[i + 1]; del args[i:i + 2]; return v
own_dir, offers_path = opt('--own'), opt('--offers')
src, aldi_dir, out = args[0], args[1], args[2]
today = datetime.date.today().isoformat()

def clean_size(s):
    s = (s or '').strip().lower().replace(',', '.')
    s = re.sub(r'^per\s+', '', s)
    return re.sub(r'\s+', ' ', s)

data = json.load(open(src, encoding='utf-8'))
stores, links, bases = {}, {}, {}
for s in data:
    if s['n'] in ('ah', 'jumbo', 'dirk', 'plus', 'lidl', 'dekamarkt', 'hoogvliet', 'spar', 'vomar', 'poiesz') and s['d']:
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
            if p.get('l'):
                links.setdefault(s['n'], {}).setdefault(name.lower(), p['l'])
        stores[s['n']] = rows
        bases[s['n']] = s.get('u', '')

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
src_note = {}
partial = {}

# ---- eigen uitlezing van de winkelwebsites
MIN_OWN = {'ah': 8000, 'plus': 10000, 'hoogvliet': 6000, 'dirk': 5000, 'dekamarkt': 5000, 'vomar': 3000, 'aldi': 800, 'jumbo': 8000, 'spar': 4000, 'poiesz': 1000}
if own_dir and os.path.isdir(own_dir):
    for f in sorted(glob.glob(os.path.join(own_dir, '*.json'))):
        try: d = json.load(open(f, encoding='utf-8'))
        except ValueError: continue
        st, rows = d.get('store'), d.get('rows') or []
        if not st: continue
        clean_rows, seen = [], set()
        for r in rows:
            rdate = r[7] if len(r) > 7 and r[7] else d.get('date', today)   # optioneel 8e veld: datum van deze prijs (kassabon)
            name, normal, size = re.sub(r'\s+', ' ', str(r[0])).strip(), r[5] if len(r) > 5 and r[5] else r[1], clean_size(r[2] if len(r) > 2 else '')
            try: normal = round(float(normal), 2)
            except (TypeError, ValueError): continue
            k = (name.lower(), size)
            if normal <= 0 or k in seen: continue
            seen.add(k); clean_rows.append([name, normal, size, rdate])
        if d.get('partial'):
            partial.setdefault(st, []).extend((r[0], r[1], d.get('source', st), r[3], r[2]) for r in clean_rows)
            print(f'{st}: gedeeltelijke uitlezing ({len(clean_rows)} normale prijzen) gaat naar het prijsgeheugen', file=sys.stderr)
        elif len(clean_rows) >= MIN_OWN.get(st, 1000):
            stores[st] = [r[:3] for r in clean_rows]; src_note[st] = f"{d.get('source')} {d.get('date')}"
            if d.get('links'): links[st] = {**links.get(st, {}), **d['links']}
            print(f'{st}: eigen uitlezing gebruikt ({len(clean_rows)} producten)', file=sys.stderr)
        else:
            print(f'{st}: eigen uitlezing te klein ({len(clean_rows)} < {MIN_OWN.get(st, 1000)}), Checkjebon gehouden', file=sys.stderr)

# ---- prijsgeheugen voor winkels zonder volledige, actuele bron (AH, Lidl):
# data/overrides/<winkel>.json bewaart elke normale prijs die we ergens zien (folder, Lidl-weekpagina) met datum.
# Die prijzen vervangen de verouderde Checkjebon-prijs van precies hetzelfde product (zelfde naam), tot 183 dagen oud.
# Bronnen: de folder (normale prijs bij een aanbieding) en gedeeltelijke uitlezingen ("partial": true, bijv. AH-kassabonnen).
# Bij twee bronnen voor hetzelfde product wint de nieuwste datum. De datum gaat als 4e veld mee in prices.json,
# zodat de app kan tonen hoe vers een prijs is ("prijs van 12 nov").
ovdir = os.path.join(os.path.dirname(os.path.abspath(out)), 'overrides')
offers = json.load(open(offers_path, encoding='utf-8')).get('offers', []) if offers_path and os.path.exists(offers_path) else []
cut = (datetime.date.today() - datetime.timedelta(days=183)).isoformat()
for st in ('ah', 'lidl'):
    if st in src_note: continue                      # volledige eigen uitlezing: geen geheugen nodig
    op = os.path.join(ovdir, st + '.json')
    mem = json.load(open(op, encoding='utf-8')) if os.path.exists(op) else {}
    def put(k, v):
        if k not in mem or v[1] >= mem[k][1]: mem[k] = v
    for o in offers:
        if o.get('s') == st and o.get('was') and o.get('from', '') <= today:
            put(re.sub(r'\s+', ' ', o['n']).strip().lower(), [round(o['was'], 2), max(o.get('from', today), cut), 'folder', ''])
    for name, price, source, date, size in partial.get(st, []):
        if cut <= date <= today:   # kassabon: sleutel naam|inhoud (zelfde product in meerdere inhouden); Lidl-weekpagina: alleen naam
            put(name.lower() + ('|' + size if size and source == 'kassabon' else ''), [price, date, source, size])
    mem = {k: v for k, v in mem.items() if v[1] >= cut}
    os.makedirs(ovdir, exist_ok=True)
    json.dump(mem, open(op, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'), sort_keys=True)
    cur = stores.get(st, []); idx = {}
    for r in cur: idx.setdefault(r[0].lower(), []).append(r)
    n = added = 0
    for key, (price, date, source, *rest) in mem.items():
        k = key.split('|')[0]
        if k in idx:
            # dezelfde naam in meerdere inhouden: alleen de inhoud uit de bron, of anders de inhoud met de dichtstbijzijnde oude prijs
            rs = idx[k]
            if len(rs) > 1:
                sz = clean_size(rest[0]) if rest and rest[0] else ''
                rs = [r for r in rs if r[2] == sz] if sz else [min(rs, key=lambda r: abs(r[1] / price - 1))]
            for r in rs:
                if abs(r[1] - price) > 0.005: r[1] = price; n += 1
                del r[3:]; r.append(date)
        elif source not in ('folder', 'kassabon'):   # producten van de Lidl-weekpagina die nog niet in de lijst stonden
            cur.append([k[:1].upper() + k[1:], price, rest[0] if rest else '', date]); added += 1
    stores[st] = cur
    if n or added: src_note[st] = f'prijsgeheugen: {n} prijzen bijgewerkt, {added} toegevoegd ({len(mem)} bekend)'
    print(f'{st}: prijsgeheugen {len(mem)} producten, {n} vaste prijzen bijgewerkt, {added} toegevoegd', file=sys.stderr)

meta = {
    'ah': {'label': 'Albert Heijn', 'source': 'Checkjebon open data', 'note': 'Vaste AH-prijzen in deze bron worden niet meer dagelijks bijgewerkt en kunnen afwijken.'},
    'jumbo': {'label': 'Jumbo', 'source': 'Checkjebon open data', 'note': ''},
    'dirk': {'label': 'Dirk', 'source': 'Checkjebon open data', 'note': ''},
    'plus': {'label': 'Plus', 'source': 'Checkjebon open data', 'note': ''},
    'lidl': {'label': 'Lidl', 'source': 'Checkjebon open data (via boodschaapje.nl)', 'note': 'Alleen gewone prijzen, geen aanbiedingen. Productnamen zijn soms afgekort.'},
    'aldi': {'label': 'Aldi', 'source': 'aldi.nl', 'note': 'Selectie van het assortiment (±600 producten).'},
    'dekamarkt': {'label': 'DekaMarkt', 'source': 'Checkjebon open data', 'note': ''},
    'hoogvliet': {'label': 'Hoogvliet', 'source': 'Checkjebon open data', 'note': ''},
    'spar': {'label': 'SPAR', 'source': 'Checkjebon open data', 'note': ''},
    'vomar': {'label': 'Vomar', 'source': 'Checkjebon open data', 'note': 'Kleine selectie van het assortiment, geen aanbiedingen.'},
    'poiesz': {'label': 'Poiesz', 'source': 'Checkjebon open data', 'note': 'Selectie van het assortiment, geen aanbiedingen.'},
}
# vaste prijzen zonder eigen datum komen uit een bevroren bron: de app toont dan "prijs uit <maand>, mogelijk verouderd"
STALE = {'ah': '2025-11'}   # Checkjebon: vaste AH-prijzen veranderen sinds november 2025 niet meer (data/db/LEESMIJ.md)
for st, ym in STALE.items():
    if st in meta and not (st in src_note and not src_note[st].startswith('prijsgeheugen')): meta[st]['stale'] = ym
for st, note in src_note.items():
    if st not in meta: continue
    if note.startswith('prijsgeheugen'): meta[st]['source'] += ' + ' + note
    else: meta[st]['source'] = note; meta[st]['note'] = ''
json.dump({'built': today, 'meta': meta, 'stores': stores}, open(out, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
# productlinks per winkel (voor productfoto's via /api/img): data/links/<winkel>.json
ldir = os.path.join(os.path.dirname(os.path.abspath(out)), 'links')
os.makedirs(ldir, exist_ok=True)
for k, m in links.items():
    json.dump({'base': bases.get(k, ''), 'l': m}, open(os.path.join(ldir, k + '.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print({k: len(v) for k, v in stores.items()}, os.path.getsize(out))
