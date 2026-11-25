"""Gedeelde hulpfuncties voor de winkel-scrapers (tools/scrape/*.py).
Elke scraper schrijft <uit>/<winkel>.json: {"store":..,"date":..,"source":..,"rows":[[naam, prijs, inhoud, id, ean, normale_prijs, actie]]}
prijs = wat je nu betaalt zonder kaart/app; normale_prijs = prijs zonder actie (gelijk aan prijs als er geen actie is).
Optioneel 8e veld: datum van die prijs (JJJJ-MM-DD), als die per regel verschilt (kassabonnen); anders geldt "date" van het bestand."""
import datetime, gzip, json, os, re, time, urllib.request, urllib.error

UA = 'Mozilla/5.0 (compatible; BoodjeBot/1.0; persoonlijk prijsvergelijkingsproject)'
_last = [0.0]

def get(url, data=None, headers=None, delay=0.4, tries=3, timeout=60):
    """Beleefd ophalen: minstens `delay` seconden tussen verzoeken, een paar herkansingen bij tijdelijke fouten."""
    h = {'User-Agent': UA, 'Accept-Encoding': 'gzip', 'Accept-Language': 'nl-NL,nl;q=0.9'}
    h.update(headers or {})
    for i in range(tries):
        wait = _last[0] + delay - time.time()
        if wait > 0: time.sleep(wait)
        _last[0] = time.time()
        try:
            r = urllib.request.urlopen(urllib.request.Request(url, data=data, headers=h), timeout=timeout)
            b = r.read()
            if b[:2] == b'\x1f\x8b': b = gzip.decompress(b)
            return b.decode('utf-8', 'replace')
        except urllib.error.HTTPError as e:
            if e.code in (301, 302, 303, 307, 308, 404, 410): return None
            if i == tries - 1: raise
        except Exception:
            if i == tries - 1: raise
        time.sleep(3 * (i + 1))

def money(x):
    try: v = round(float(str(x).replace('€', '').replace(',', '.').strip()), 2)
    except (TypeError, ValueError): return None
    return v if v > 0 else None

def clean(s): return re.sub(r'\s+', ' ', str(s or '')).strip()

def save(outdir, store, source, rows, extra=None):
    os.makedirs(outdir, exist_ok=True)
    seen, out = set(), []
    for r in rows:
        k = r[3] or (r[0].lower() + '|' + r[2])
        if k in seen or not r[0] or r[1] is None: continue
        seen.add(k); out.append(r)
    d = {'store': store, 'date': datetime.date.today().isoformat(), 'source': source, 'rows': out}
    if extra: d.update(extra)
    json.dump(d, open(os.path.join(outdir, store + '.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print(f'{store}: {len(out)} producten → {os.path.join(outdir, store + ".json")}')
    return out
