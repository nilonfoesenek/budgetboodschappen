"""Haalt de aanbiedingen van alle winkels op via Folderz (folderz.nl/winkels/<winkel>/aanbiedingen, alle pagina's)
en schrijft data/offers.json in het formaat van de app.

Gebruik: python3 -I tools/fetch_offers.py <data/prices.json> <oude data/offers.json> <uit offers.json> [JJJJ-MM-DD]

- Eten, drinken (ook wijn en sterke drank), drogisterij, huishouden en dierenvoer; geen bloemen of overige non-food.
- Geldigheid komt uit de labels van Folderz: "5 dagen", "23 uur", "Vanaf morgen geldig", "Over 2 dagen geldig".
- Lukt een winkel niet (te weinig aanbiedingen gevonden), dan blijven de nog geldige aanbiedingen van die winkel uit het oude bestand staan.
"""
import json, re, sys, time, html, datetime, subprocess

prices_path, old_path, out_path = sys.argv[1], sys.argv[2], sys.argv[3]
today = datetime.date.fromisoformat(sys.argv[4]) if len(sys.argv) > 4 else datetime.date.today()
UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
ONLY = sys.argv[5].split(',') if len(sys.argv) > 5 else None
SLUG = {'ah': 'albert-heijn', 'jumbo': 'jumbo', 'aldi': 'aldi', 'dirk': 'dirk', 'plus': 'plus', 'lidl': 'lidl',
        'dekamarkt': 'dekamarkt', 'hoogvliet': 'hoogvliet', 'spar': 'spar', 'vomar': 'vomar', 'poiesz': 'poiesz'}
MIN = {'ah': 150, 'jumbo': 150, 'plus': 150, 'dirk': 60, 'aldi': 40, 'lidl': 40, 'dekamarkt': 50, 'hoogvliet': 80, 'spar': 20, 'vomar': 30, 'poiesz': 30}
NAMES = {'ah': 'Albert Heijn', 'jumbo': 'Jumbo', 'aldi': 'Aldi', 'dirk': 'Dirk', 'plus': 'Plus', 'lidl': 'Lidl', 'dekamarkt': 'DekaMarkt',
         'hoogvliet': 'Hoogvliet', 'spar': 'Spar', 'vomar': 'Vomar', 'poiesz': 'Poiesz'}

def get(url):
    for i in range(3):
        r = subprocess.run(['curl', '-s', '--compressed', '--max-time', '30', '-A', UA, url], capture_output=True)
        if r.returncode == 0 and r.stdout:
            return r.stdout.decode('utf-8', 'replace')
        time.sleep(3)
    return ''

def clean(t):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', t or ''))).strip()

def scrape(slug, store_label):
    out, seen = [], set()
    for p in range(1, 200):
        h = get(f'https://www.folderz.nl/winkels/{slug}/aanbiedingen?page={p}')
        items = h.split('class="js-offer-link-item')[1:]
        if not items:
            break
        new = 0
        for it in items:
            g = lambda r: (re.search(r, it, re.S) or [None, None])[1]
            href = g(r'href="([^"]+)"')
            if not href or href in seen:
                continue
            seen.add(href); new += 1
            if not href.startswith(f'/winkels/{slug}/'):
                continue  # aanbieding van een andere winkel
            out.append({'n': clean(g(r'class="product__name[^"]*">(.*?)</h3>')).replace(' \n', ' '),
                        'img': g(r'<div class="product__image[^"]*"><picture><img[^>]*src="([^"]+)"'),
                        'date': clean(g(r'class="product-date[^"]*">(.*?)</div>')),
                        'price': clean(g(r'class="product__price-offer[^"]*">(.*?)</div>')),
                        'deal': clean(g(r'class="badge[^"]*">(.*?)</div>'))})
        if not new:
            break
        time.sleep(1.0)
    return out

def dates(label):
    l = label.lower()
    m = re.match(r'(\d+) dag(en)?$', l)
    if m:
        to = today + datetime.timedelta(days=int(m.group(1)))
        return max(today, to - datetime.timedelta(days=6)), to
    if re.match(r'\d+ (uur|minuten?)$', l):
        return today - datetime.timedelta(days=6), today
    if l.startswith('vanaf morgen'):
        f = today + datetime.timedelta(days=1); return f, f + datetime.timedelta(days=6)
    m = re.match(r'over (\d+) dag(en)? geldig', l)
    if m:
        f = today + datetime.timedelta(days=int(m.group(1))); return f, f + datetime.timedelta(days=6)
    return None  # '1 maand', '1 week' en langer: geen weekaanbieding

def num(t):
    m = re.search(r'(\d+)[.,](\d{2})', t or '') or re.search(r'(\d+)', t or '')
    if not m:
        return None
    return float(m.group(1) + '.' + (m.group(2) if m.lastindex and m.lastindex > 1 else '0'))

def deal(o):
    d, pr = o['deal'].strip(), num(o['price'])
    r = {'d': d or ('voor ' + o['price'].replace('€', '').strip() if pr else '')}
    dl = d.lower()
    m = re.match(r'(\d+)\s*%\s*korting', dl)
    if m:
        pct = int(m.group(1)) / 100
        if pr: r['p'] = round(pr, 2); r['was'] = round(pr / (1 - pct), 2)
        else: r['pct'] = pct
        return r
    m = re.match(r'(\d+)\s*\+\s*(\d+)\s*gratis', dl)
    if m:
        a, b = int(m.group(1)), int(m.group(2)); r['pct'] = round(b / (a + b), 3)
        if pr: r['was'] = round(pr, 2); r['p'] = round(pr * a / (a + b), 2)
        return r
    if '2e halve prijs' in dl:
        r['pct'] = 0.25
        if pr: r['was'] = round(pr, 2); r['p'] = round(pr * 0.75, 2)
        return r
    m = re.match(r'(\d+)\s*voor\s*([\d.,]+)', dl)
    if m:
        n, tot = int(m.group(1)), float(m.group(2).replace(',', '.'))
        r['p'] = round(tot / n, 2)
        if pr and pr > r['p'] + 0.005: r['was'] = round(pr, 2)
        return r
    if pr:
        r['p'] = round(pr, 2)
    return r

BAD = re.compile(r'\b(bloem|bloemen|boeket|tulp|tulpen|roos|rozen|hyacint|amaryllis|chrysant|bolchrysant|orchidee|plant|planten|kerstboom|kunstkerstboom|kerststuk|kaars|kaarsen|tafellaken|servet|servetten|servetring|puzzel|speelgoed|lego|knuffel|pyjama|sokken|kleding|schoen|schoenen|pantoffels|deken|plaid|kussen|handdoek|dekbed|bbq|grill|koekenpan|pan|pannenset|messenset|mes|bord|borden|beker|mok|glazen|vaas|lamp|lampjes|verlichting|led|batterij|batterijen|kattenbak|gereedschap|boormachine|schroevendraaier|accu|fiets|tent|stoel|tafel|kast|rek|opberg|schort|mand|mandje|winkelmandje|slushy|maker|airfryer|blender|mixer|stofzuiger|strijkijzer|föhn|krultang|tandenborstel elektrische)\b', re.I)

def vocab(rows):
    v = set()
    for r in rows:
        for w in re.findall(r'[a-zà-ÿ]{4,}', r[0].lower()):
            v.add(w)
    return v
NONFOOD_BRAND = re.compile(r'\b(parkside|silvercrest|esmara|livergy|lupilu|crivit|melinera|livarno|ernesto|crofton|workzone|easy home|ambiano|mistral|quigg|top craft|scarlett|switch on|medion|tronic|ferrex|lightzone|gardenline|belavi|serra|walkx|actuel|cucina|home creation|tcm|tchibo)\b', re.I)
NONFOOD_WORD = re.compile(r'(funko|zandbak|prentenboek|boek\b|zitverhoger|topper|tape\b|pietenpak|lenzen|leesbril|kostuum|verkleed|dekbed|overtrek|hoeslaken|jas\b|jack\b|sweater|trui|broek|legging|shirt|beha|slip|boxer|ondergoed|bestek|slijpmachine|zaag|schaar|cactus|vetplant|spel\b|houten|gieter|bloempot|kussensloop|matras|lade|organizer|opbergbox|emmer|bezem|dweil|stofdoek|droogrek|wasmand|strijk|thermo|vacuüm|weegschaal|klok|wekker|kabel|oplader|speaker|koptelefoon|camera|horloge|sieraad|ketting|oorbel|sjaal|muts|handschoen|paraplu|tas\b|rugzak|koffer|kerstbal|slinger|piek\b|decoratie|figuur|beeld\b|fotolijst|canvas|schilderij)', re.I)
GENERIC = set('zwart zwarte witte groot grote klein kleine mini maxi extra pack pakket stuks set voor alle diverse soorten bijv naturel original classic premium luxe'.split())

P = json.load(open(prices_path, encoding='utf-8'))
old = json.load(open(old_path, encoding='utf-8')) if old_path else {'offers': [], 'weeks': {}}
allv = set()
for s in P['stores']:
    allv |= vocab(P['stores'][s])
offers, weeks, report = [], {}, {}
for s, slug in SLUG.items():
    if ONLY and s not in ONLY:
        prev = [x for x in old.get('offers', []) if x['s'] == s and x['to'] >= today.isoformat()]
        offers += prev
        if s in old.get('weeks', {}): weeks[s] = old['weeks'][s]
        continue
    raw = scrape(slug, NAMES[s])
    keep = []
    for o in raw:
        dt = dates(o['date'])
        if not dt or not o['n'] or BAD.search(o['n']):
            continue
        if NONFOOD_BRAND.search(o['n']) or NONFOOD_WORD.search(o['n']):
            continue
        ws = [w for w in re.findall(r'[a-zà-ÿ]{4,}', o['n'].lower()) if w not in GENERIC]
        if not ws or sum(w in allv for w in ws) / len(ws) < (0.67 if s in ('lidl', 'aldi') else 0.5):
            continue  # waarschijnlijk geen boodschappen (non-food)
        x = {'s': s, 'n': re.sub(r'\s+', ' ', o['n']).strip(), **deal(o), 'from': dt[0].isoformat(), 'to': dt[1].isoformat()}
        if o['img'] and o['img'].startswith('https://'):
            x['img'] = o['img'].replace('https://img.offers-cdn.net/assets/uploads/offers/nl/', 'fz:')
        if not x.get('d'):
            continue
        keep.append(x)
    report[s] = (len(raw), len(keep))
    if len(keep) >= MIN[s]:
        offers += keep
        cur = [x for x in keep if x['from'] <= today.isoformat()]
        if cur:
            weeks[s] = {'from': min(x['from'] for x in cur), 'to': max(x['to'] for x in cur), 'source': f'folderz.nl/winkels/{slug}/aanbiedingen'}
    else:
        prev = [x for x in old.get('offers', []) if x['s'] == s and x['to'] >= today.isoformat()]
        offers += prev
        if s in old.get('weeks', {}) and prev:
            weeks[s] = old['weeks'][s]
        report[s] = report[s] + ('te weinig, oude behouden: %d' % len(prev),)
    print(s, report[s], file=sys.stderr)

json.dump({'updated': today.isoformat(), 'weeks': weeks, 'offers': offers}, open(out_path, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print(json.dumps({k: v for k, v in report.items()}, ensure_ascii=False))
