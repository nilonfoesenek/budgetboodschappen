#!/usr/bin/env python3
"""Uitlezen van de prijsdatabase (data/db). Uitvoer is CSV (puntkomma, Excel-vriendelijk) of tekst.

  python3 tools/db_query.py stand 2026-06-01 [winkel ...]   > stand.csv   alle prijzen zoals ze op die datum golden
  python3 tools/db_query.py product jumbo "halfvolle melk"                 prijsverloop van producten met die woorden
  python3 tools/db_query.py versheid                                       per winkel: peildata en laatste prijswijziging
  python3 tools/db_query.py aanbiedingen 2026-06-01 [winkel ...]          aanbiedingen die op die datum geldig waren
"""
import csv, pathlib, sys
DB = pathlib.Path(__file__).resolve().parent.parent / 'data' / 'db'
csv.field_size_limit(10**7)

def rows(p):
    with open(p, encoding='utf-8', newline='') as f:
        r = csv.reader(f, delimiter='\t'); next(r, None); yield from r
def stores():
    return sorted({p.stem for p in (DB / 'prijzen').glob('*/*.tsv')})
def history(store):
    for yd in sorted((DB / 'prijzen').iterdir()):
        p = yd / f'{store}.tsv'
        if p.exists(): yield from rows(p)
def snapshots():
    return list(rows(DB / 'snapshots.tsv'))

cmd = sys.argv[1] if len(sys.argv) > 1 else ''
out = csv.writer(sys.stdout, delimiter=';', lineterminator='\n')
if cmd == 'stand':
    d, ss = sys.argv[2], sys.argv[3:] or stores()
    snaps = snapshots()
    out.writerow(['winkel', 'id', 'naam', 'inhoud', 'prijs', 'prijs_sinds', 'peildatum', 'laatste_wijziging_winkel'])
    for s in ss:
        peil = max([r[0] for r in snaps if r[1] == s and r[0] <= d] or [''])
        if not peil: continue
        lastchg = max([r[0] for r in snaps if r[1] == s and r[0] <= d and (int(r[5]) + int(r[6]) + int(r[7])) > 0] or [''])
        st = {}
        for r in history(s):
            if r[0] > d: break
            if r[4] == '': st.pop(r[1], None)
            else: st[r[1]] = (r[2], r[3], r[4], r[0])
        for pid, (n, inh, pr, since) in sorted(st.items(), key=lambda x: x[1][0].lower()):
            out.writerow([s, pid, n, inh, pr.replace('.', ','), since, peil, lastchg])
elif cmd == 'product':
    s, q = sys.argv[2], sys.argv[3].lower().split()
    out.writerow(['datum', 'naam', 'inhoud', 'prijs'])
    for r in history(s):
        if all(w in r[2].lower() for w in q): out.writerow([r[0], r[2], r[3], r[4].replace('.', ',') or 'verdwenen'])
elif cmd == 'versheid':
    snaps = snapshots()
    print(f"{'winkel':<10} {'peildata':>8}  {'eerste':<10}  {'laatste':<10}  {'laatste wijziging':<17}  producten")
    for s in sorted({r[1] for r in snaps}):
        xs = [r for r in snaps if r[1] == s]
        chg = [r[0] for r in xs[1:] if int(r[5]) + int(r[6]) + int(r[7]) > 0]
        print(f"{s:<10} {len(xs):>8}  {xs[0][0]:<10}  {xs[-1][0]:<10}  {(chg[-1] if chg else 'nooit'):<17}  {xs[-1][4]}")
elif cmd == 'aanbiedingen':
    d, ss = sys.argv[2], set(sys.argv[3:])
    out.writerow(['winkel', 'geldig_van', 'geldig_tot', 'naam', 'actie', 'actieprijs', 'normale_prijs', 'korting'])
    for p in sorted((DB / 'aanbiedingen').glob('*.tsv')):
        for r in rows(p):
            if r[2] <= d <= r[3] and (not ss or r[1] in ss): out.writerow(r[1:6] + [x.replace('.', ',') for x in r[6:]])
else:
    print(__doc__)
