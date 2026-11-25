"""AH-prijzen uit gescande kassabonnen → gedeeltelijke bron voor het AH-prijsgeheugen.

Gebruik: python3 -I tools/fetch_bonprijzen.py <url of json-bestand> <data/prices.json> <uitmap>
  url:  https://budgetboodschappen.netlify.app/api/bonprijzen  (sleutel: omgevingsvariabele BONPRIJZEN_KEY,
        of als netwerkgeheim dat de proxy als "Authorization: Bearer ..." toevoegt)
  Schrijft <uitmap>/ah.json met "partial": true en "source": "kassabon"; tools/build_prices.py --own <uitmap> neemt die op
  in data/overrides/ah.json (de nieuwste datum per product wint, maximaal 183 dagen oud).

Een bonregel ("AH Halfvolle melk 1 l", 1,19) wordt alleen gebruikt als hij duidelijk bij één AH-product hoort:
- de woorden komen overeen (afkortingen mogen: "halfv" = "halfvolle"),
- de inhoud klopt (als die op de bon staat),
- de prijs ligt binnen -30%/+43% van de prijs die de app nu heeft (vangt verkeerd gelezen of verkeerd gekoppelde regels af),
- er is geen tweede product dat bijna even goed past met een andere prijs.
Per product geldt de prijs van de nieuwste week; bij meerdere bonnen in die week de mediaan.
"""
import json, os, re, statistics, sys, unicodedata, urllib.request, datetime

UNIT = {'g': ('g', 1), 'gr': ('g', 1), 'gram': ('g', 1), 'kg': ('g', 1000), 'kilo': ('g', 1000),
        'ml': ('ml', 1), 'cl': ('ml', 10), 'l': ('ml', 1000), 'lt': ('ml', 1000), 'liter': ('ml', 1000),
        'st': ('st', 1), 'stuk': ('st', 1), 'stuks': ('st', 1)}
QTY = re.compile(r'(?:(\d+)\s*x\s*)?(\d+(?:[.,]\d+)?)\s*(kg|kilo|gram|gr|g|ml|cl|liter|lt|l|stuks|stuk|st)\b')
STOP = {'de', 'het', 'een', 'en', 'met', 'van', 'per', 'x', 'ca', 'stuk', 'stuks', 'st'}


def norm(s):
    s = unicodedata.normalize('NFD', str(s or '').lower())
    return re.sub(r'[^a-z0-9.,]+', ' ', ''.join(c for c in s if unicodedata.category(c) != 'Mn')).strip()


def qty(s):
    m = QTY.search(norm(s))
    if not m: return None
    u, f = UNIT[m.group(3)]
    return u, round(float(m.group(2).replace(',', '.')) * f * int(m.group(1) or 1), 3)


def toks(s):
    s = QTY.sub(' ', norm(s))
    return [t for t in re.sub(r'[.,]', ' ', s).split() if len(t) > 1 and not t.isdigit() and t not in STOP]


def tok_match(a, b):
    if a == b: return 1.0
    if len(a) >= 3 and len(b) >= 3 and (a.startswith(b) or b.startswith(a)): return 0.8
    return 0.0


def score(rt, ct):
    if not rt or not ct: return 0.0
    r = sum(max(tok_match(a, b) for b in ct) for a in rt) / len(rt)
    p = sum(max(tok_match(b, a) for a in rt) for b in ct) / len(ct)
    return 0 if r + p == 0 else 2 * r * p / (r + p)


def build_index(rows):
    cat, inv = [], {}
    for r in rows:
        t = toks(r[0])
        if not t: continue
        i = len(cat)
        cat.append((r[0], r[1], qty(r[2]) or qty(r[0]), t, r[2]))
        for w in set(t): inv.setdefault(w[:3], set()).add(i)
    return cat, inv


def best_match(name, price, cat, inv):
    rt, rq = toks(name), qty(name)
    if not rt: return None
    cands = set()
    for w in rt: cands |= inv.get(w[:3], set())
    res = []
    for i in cands:
        cname, cprice, cq, ct, _ = cat[i]
        if rq and cq and (rq[0] != cq[0] or abs(rq[1] - cq[1]) > 0.03 * cq[1]): continue
        if rq and not cq: continue
        s = score(rt, ct)
        if s >= 0.6: res.append((s, i))
    if not res: return None
    res.sort(reverse=True)
    s, i = res[0]
    if s < (0.75 if rq else 0.85): return None
    cname, cprice = cat[i][0], cat[i][1]
    for s2, j in res[1:]:
        if s2 > s - 0.1 and abs(cat[j][1] - cprice) > 0.005: return None   # twijfel tussen twee producten met andere prijs
    if not (0.7 <= price / cprice <= 1.43): return None
    return cname, cat[i][4]


def main():
    src, prices_path, outdir = sys.argv[1], sys.argv[2], sys.argv[3]
    if src.startswith('http'):
        h = {'User-Agent': 'BoodjeBot/1.0'}
        if os.environ.get('BONPRIJZEN_KEY'): h['Authorization'] = 'Bearer ' + os.environ['BONPRIJZEN_KEY']
        data = json.load(urllib.request.urlopen(urllib.request.Request(src, headers=h), timeout=60))
    else:
        data = json.load(open(src, encoding='utf-8'))
    P = json.load(open(prices_path, encoding='utf-8'))
    cat, inv = build_index(P['stores'].get('ah', []))
    cut = (datetime.date.today() - datetime.timedelta(days=183)).isoformat()
    seen = {}                                     # (productnaam, inhoud) → {week: [prijzen]}
    n = hit = 0
    for name, price, week in data.get('rows', []):
        if week < cut: continue
        n += 1
        c = best_match(name, price, cat, inv)
        if not c: continue
        hit += 1
        seen.setdefault(c, {}).setdefault(week, []).append(price)
    rows = []
    for (c, size), weeks in sorted(seen.items()):
        w = max(weeks)
        p = round(statistics.median(weeks[w]), 2)
        rows.append([c, p, size, '', '', p, '', w])   # 8e veld: datum (maandag van de week van de bon)
    os.makedirs(outdir, exist_ok=True)
    out = {'store': 'ah', 'date': datetime.date.today().isoformat(), 'source': 'kassabon', 'partial': True, 'rows': rows}
    json.dump(out, open(os.path.join(outdir, 'ah.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print(f"kassabonnen: {data.get('bonnen', '?')} AH-bonnen, {n} regels, {hit} gekoppeld → {len(rows)} AH-producten in {os.path.join(outdir, 'ah.json')}")


if __name__ == '__main__':
    main()
