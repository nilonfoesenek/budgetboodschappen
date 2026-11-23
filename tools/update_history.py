#!/usr/bin/env python3
"""Houdt per aanbieding bij wanneer en voor welke prijs die in de actie was.
Draai na het verversen van data/offers.json:  python3 tools/update_history.py
Schrijft data/history.json: {"updated": datum, "items": {"ah|boerenkool 300 g": [["2026-11-23", 0.99], ...]}}
Een week = maandag van de actieweek. Max. 52 weken per product; producten die 52 weken niet terugkwamen vallen weg."""
import json, re, datetime, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
offers = json.loads((root / 'data/offers.json').read_text())['offers']
hp = root / 'data/history.json'
hist = json.loads(hp.read_text()) if hp.exists() else {'items': {}}
items = hist.setdefault('items', {})

def key(o): return o['s'] + '|' + re.sub(r'\s+', ' ', o['n'].lower()).strip()
def monday(d):
    x = datetime.date.fromisoformat(d); return (x - datetime.timedelta(days=x.weekday())).isoformat()

for o in offers:
    wk = monday(o['from']); p = o.get('p')
    rows = items.setdefault(key(o), [])
    hit = next((r for r in rows if r[0] == wk), None)
    if hit:
        if p is not None and (hit[1] is None or p < hit[1]): hit[1] = p
    else: rows.append([wk, p])
    rows.sort(); del rows[:-52]

cut = (datetime.date.today() - datetime.timedelta(weeks=52)).isoformat()
for k in [k for k, r in items.items() if r[-1][0] < cut]: del items[k]
hist['updated'] = datetime.date.today().isoformat()
hp.write_text(json.dumps(hist, ensure_ascii=False, separators=(',', ':')))
print(f'history: {len(items)} producten')
