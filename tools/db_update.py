#!/usr/bin/env python3
"""Prijsdatabase bijwerken: legt elke verversing vast, zodat later onafhankelijk onderzoek over een jaar mogelijk is.

Gebruik (vanuit een werkmap buiten de kloon):
  python3 -I <kloon>/tools/db_update.py --cjb <checkjebon>/data/supermarkets.json [--aldi <kloon>/tools/aldi_products.txt]
                                         [--offers <kloon>/data/offers.json] [--own <map met tools/scrape-uitvoer>] [--date JJJJ-MM-DD] [--ref <bronversie>]
--own: eigen uitlezing van winkelwebsites; een volledige uitlezing vervangt voor die winkel de Checkjebon-gegevens (bron = website),
       een gedeeltelijke (Lidl-weekpagina) wordt vastgelegd als aparte 'winkel' <winkel>_week.

Schrijft in <kloon>/data/db/ (formaat: data/db/LEESMIJ.md):
  snapshots.tsv                 één regel per winkel per peildatum (aantallen, bron, bronversie)
  prijzen/<jaar>/<winkel>.tsv   alleen nieuwe, gewijzigde en verdwenen producten (prijs leeg = verdwenen)
  aanbiedingen/<jaar>.tsv       elke aanbieding één keer, met geldigheid, actieprijs en normale prijs
Een peildatum die al in snapshots.tsv staat wordt overgeslagen; peildata moeten per winkel oplopen.
"""
import argparse, csv, datetime, json, os, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
DB = ROOT / 'data' / 'db'
ap = argparse.ArgumentParser()
ap.add_argument('--cjb'); ap.add_argument('--aldi'); ap.add_argument('--offers'); ap.add_argument('--own')
ap.add_argument('--date', default=datetime.date.today().isoformat()); ap.add_argument('--ref', default='')
a = ap.parse_args()
D = a.date
csv.field_size_limit(10**7)

def clean(s): return re.sub(r'\s+', ' ', str(s or '')).strip()
def size_norm(s):
    s = clean(s).lower().replace(',', '.'); return re.sub(r'^per\s+', '', s)
def money(x):
    try: v = round(float(str(x).replace('€', '').replace(',', '.').strip()), 2)
    except (TypeError, ValueError): return None
    return v if v > 0 else None

SNAP = DB / 'snapshots.tsv'
SNAP_HEAD = ['datum', 'winkel', 'bron', 'bronversie', 'producten', 'nieuw', 'gewijzigd', 'verdwenen']
PRICE_HEAD = ['datum', 'id', 'naam', 'inhoud', 'prijs']
OFFER_HEAD = ['eerst_gezien', 'winkel', 'geldig_van', 'geldig_tot', 'naam', 'actie', 'actieprijs', 'normale_prijs', 'korting']

def read_tsv(p):
    if not p.exists(): return []
    with open(p, encoding='utf-8', newline='') as f:
        r = csv.reader(f, delimiter='\t'); next(r, None); return list(r)
def append_tsv(p, head, rows):
    if not rows: return
    p.parent.mkdir(parents=True, exist_ok=True); new = not p.exists()
    with open(p, 'a', encoding='utf-8', newline='') as f:
        w = csv.writer(f, delimiter='\t', lineterminator='\n')
        if new: w.writerow(head)
        w.writerows(rows)

snaps = read_tsv(SNAP)
done = {(r[0], r[1]) for r in snaps}
last = {}
for r in snaps: last[r[1]] = max(last.get(r[1], ''), r[0])

def state(store):
    """Huidige stand van een winkel: id -> (naam, inhoud, prijs), opgebouwd uit alle jaarbestanden."""
    st = {}
    pdir = DB / 'prijzen'
    if not pdir.exists(): return st
    for yd in sorted(x for x in pdir.iterdir() if x.is_dir()):
        for r in read_tsv(yd / f'{store}.tsv'):
            if r[4] == '': st.pop(r[1], None)
            else: st[r[1]] = (r[2], r[3], r[4])
    return st

# ---- assortimenten verzamelen
stores = {}   # winkel -> (bron, {id: (naam, inhoud, prijs)})
if a.cjb:
    for s in json.load(open(a.cjb, encoding='utf-8')):
        if not s.get('d'): continue
        cur = {}
        for p in s['d']:
            name, pr = clean(p.get('n')), money(p.get('p'))
            if not name or pr is None: continue
            size = size_norm(p.get('s'))
            pid = clean(p.get('l')) or (name.lower() + '|' + size)
            if pid in cur: continue
            cur[pid] = (name, size, f'{pr:.2f}')
        stores[s['n']] = ('checkjebon', cur)
if a.aldi and os.path.exists(a.aldi):
    cur = {}
    for line in open(a.aldi, encoding='utf-8'):
        parts = [x.strip() for x in line.split('|')]
        if len(parts) != 3: continue
        name, size, pr = clean(parts[0]), size_norm(parts[1]), money(parts[2])
        if not name or pr is None: continue
        pid = name.lower() + '|' + size
        if pid not in cur: cur[pid] = (name, size, f'{pr:.2f}')
    if cur: stores['aldi'] = ('aldi.nl', cur)

MIN_OWN = {'ah': 8000, 'plus': 10000, 'hoogvliet': 6000, 'dirk': 5000, 'dekamarkt': 5000, 'vomar': 3000, 'aldi': 800, 'jumbo': 8000, 'spar': 4000, 'poiesz': 1000}
if a.own and os.path.isdir(a.own):
    for f in sorted(pathlib.Path(a.own).glob('*.json')):
        try: d = json.load(open(f, encoding='utf-8'))
        except ValueError: continue
        st = d.get('store'); rows = d.get('rows') or []
        if not st: continue
        cur = {}
        for r in rows:
            name, size = clean(r[0]), size_norm(r[2] if len(r) > 2 else '')
            pr = money(r[5] if len(r) > 5 and r[5] else r[1])
            if not name or pr is None: continue
            pid = clean(r[3] if len(r) > 3 else '') or (name.lower() + '|' + size)
            if pid not in cur: cur[pid] = (name, size, f'{pr:.2f}')
        if d.get('partial'): stores[st + '_week'] = (d.get('source', st), cur)
        elif len(cur) >= MIN_OWN.get(st, 1000): stores[st] = (d.get('source', st), cur)

# ---- prijzen: alleen wijzigingen opslaan
year = D[:4]
for store, (src, cur) in sorted(stores.items()):
    if (D, store) in done: print(f'{store}: {D} staat er al in, overgeslagen'); continue
    if last.get(store, '') > D: print(f'{store}: {D} ligt vóór de laatste peildatum {last[store]}, overgeslagen', file=sys.stderr); continue
    old = state(store)
    rows, n_new, n_chg = [], 0, 0
    for pid, (name, size, pr) in cur.items():
        o = old.get(pid)
        if o is None: n_new += 1; rows.append([D, pid, name, size, pr])
        elif o != (name, size, pr): n_chg += 1; rows.append([D, pid, name, size, pr])
    gone = [] if store.endswith('_week') else [pid for pid in old if pid not in cur]   # weekpagina: wat ontbreekt is niet verdwenen
    rows += [[D, pid, old[pid][0], old[pid][1], ''] for pid in gone]
    append_tsv(DB / 'prijzen' / year / f'{store}.tsv', PRICE_HEAD, rows)
    append_tsv(SNAP, SNAP_HEAD, [[D, store, src, a.ref, len(cur), n_new, n_chg, len(gone)]])
    print(f'{store}: {len(cur)} producten, {n_new} nieuw, {n_chg} gewijzigd, {len(gone)} verdwenen')

# ---- aanbiedingen: elke aanbieding één keer
if a.offers and os.path.exists(a.offers):
    offers = json.load(open(a.offers, encoding='utf-8')).get('offers', [])
    adir = DB / 'aanbiedingen'
    seen = set()
    if adir.exists():
        for f in adir.glob('*.tsv'):
            for r in read_tsv(f): seen.add((r[1], r[2], r[3], r[4], r[5]))
    rows = []
    for o in offers:
        k = (o.get('s', ''), o.get('from', ''), o.get('to', ''), clean(o.get('n')), clean(o.get('d')))
        if k in seen or not k[0] or not k[3]: continue
        seen.add(k)
        p, w, pct = o.get('p'), o.get('was'), o.get('pct')
        rows.append([D, *k, '' if p is None else f'{p:.2f}', '' if w is None else f'{w:.2f}', '' if not pct else f'{pct:.3f}'])
    by_year = {}
    for r in rows: by_year.setdefault((r[2] or D)[:4], []).append(r)
    for y, rs in by_year.items(): append_tsv(adir / f'{y}.tsv', OFFER_HEAD, rs)
    print(f'aanbiedingen: {len(rows)} nieuw vastgelegd')
