# Stap 1 van de productkoppeling: winkelproducten koppelen aan Open Food Facts (streepjescode + foto).
# Invoer: /tmp/off_nl.parquet (Nederlandse producten uit huggingface.co/datasets/openfoodfacts/product-database, food.parquet).
# Gebruik: python3 tools/pm_off.py && python3 tools/pm_build.py
import duckdb,json,re,math,unicodedata,sys,collections
con=duckdb.connect()
rows=con.execute("select code, product_name, brands, quantity, images from '/tmp/off_nl.parquet'").fetchall()
def nrm(t):
    t=unicodedata.normalize('NFKD',t or '').encode('ascii','ignore').decode().lower()
    t=re.sub(r"[’'`]","",t);t=re.sub(r'[^a-z0-9.,]+',' ',t)
    return t
QRE=re.compile(r'(\d+(?:[.,]\d+)?)\s*(kg|g|gr|gram|ml|cl|l|liter|ltr|st|stuks?)\b')
def qty(t):
    m=QRE.findall(nrm(t))
    if not m:return None
    v,u=m[-1];v=float(v.replace(',','.'))
    u={'gr':'g','gram':'g','liter':'l','ltr':'l','stuk':'st','stuks':'st'}.get(u,u)
    if u=='kg':v,u=v*1000,'g'
    if u=='l':v,u=v*1000,'ml'
    if u=='cl':v,u=v*10,'ml'
    return (round(v),u)
STOP=set('de het een en of met van voor in op naar per x g kg ml l cl st stuks stuk gram liter pak zak doos fles blik pot ca'.split())
def toks(t):
    t=QRE.sub(' ',nrm(t))
    return [w for w in re.split(r'[ .,]+',t) if len(w)>1 and w not in STOP and not w.isdigit()]
def folder(c):
    if len(c)<=8:return c
    c=c.zfill(13);return f'{c[0:3]}/{c[3:6]}/{c[6:9]}/{c[9:]}'
docs=[]
for code,pn,br,q,imgs in rows:
    if not code or not imgs:continue
    names={x['lang']:x['text'] for x in (pn or []) if x and x.get('text')}
    name=names.get('nl') or names.get('main') or ''
    if not name:continue
    img=None
    keys={x['key']:x for x in imgs if x and x.get('key')}
    for k in ['front_nl','front_en','front_de','front_fr']+[k for k in keys if k.startswith('front_')]:
        x=keys.get(k)
        if x and x.get('rev') and x.get('sizes') and x['sizes'].get('400'):
            img=f"{folder(code)}/{k}.{x['rev']}.400.jpg";break
    if not img:continue
    brands=[nrm(b).strip() for b in (br or '').split(',') if b.strip()]
    bt=set(w for b in brands[:3] for w in toks(b))
    nt=toks(name)
    docs.append({'c':code,'n':name,'b':brands[:3],'bt':bt,'t':set(nt)|bt,'q':qty(q or '') or qty(name),'img':img})
print('docs met foto',len(docs),file=sys.stderr)
df=collections.Counter(w for d in docs for w in d['t'])
N=len(docs);idf=lambda w:math.log(N/(1+df[w]))
inv=collections.defaultdict(list)
for i,d in enumerate(docs):
    for w in d['t']:inv[w].append(i)
HOUSE={'ah':['ah','albert heijn'],'jumbo':['jumbo'],'dirk':['1 de beste','dirk'],'plus':['plus'],'lidl':['lidl'],'aldi':['aldi'],'dekamarkt':['dekamarkt','deka','dekavers'],'hoogvliet':['hoogvliet'],'spar':['spar'],'vomar':['vomar'],'poiesz':['poiesz']}
ALLHOUSE=set(['ah','albert heijn','jumbo','plus','lidl','aldi','1 de beste','dirk','dekamarkt','deka','hoogvliet','spar','vomar','poiesz'])
P=json.load(open('/home/claude/budgetboodschappen/data/prices.json'))
out={};stats={}
for s,items in P['stores'].items():
    m={};hit=0
    for name,price,size,*_ in items:
        nt=set(toks(name))
        if len(nt)<1:continue
        q=qty(size) or qty(name)
        rare=sorted(nt,key=lambda w:df.get(w,0))
        rare=[w for w in rare if df.get(w,0)>0][:2]
        if not rare:continue
        cand=set(inv[rare[0]][:5000])
        if len(rare)>1:cand&=set(inv[rare[1]]) if len(inv[rare[0]])>50 else cand
        best=None;bs=0
        house=HOUSE.get(s,[])
        for i in cand:
            d=docs[i]
            inter=nt&d['t']
            if not inter:continue
            # merk moet kloppen: merk van OFF staat in onze naam, of is het huismerk van deze winkel
            bown=bool(d['bt']) and d['bt']<=nt
            bhouse=any(b==h or b.startswith(h+' ') for h in house for b in d['b'])
            if d['b'] and not (bown or bhouse):continue
            if not d['b'] and nt!=(d['t']):continue
            if any(b in ALLHOUSE for b in d['b']) and not bhouse:continue
            nt2=nt-set(w for h in house for w in h.split())-d['bt'];dt2=d['t']-d['bt']
            if not nt2:continue
            W=lambda X:sum(idf(w) for w in X) or 1e-9
            cov_us=W(nt2&dt2)/W(nt2);cov_off=W(nt2&dt2)/W(dt2)
            if cov_us<0.85 or cov_off<0.5:continue
            sc=(cov_us+cov_off)/2
            if q and d['q']:
                if q==d['q']:sc+=.1
                elif q[1]==d['q'][1] and abs(q[0]-d['q'][0])>0.15*q[0]:sc-=.15
            if sc>bs:bs,best=sc,d
        if best and bs>=0.78:
            m[name.lower()]=[best['c'],best['img']];hit+=1
    out[s]=m;stats[s]=(hit,len(items))
    print(s,hit,len(items),file=sys.stderr)
json.dump(out,open('/tmp/offm/match.json','w'),ensure_ascii=False)
json.dump(stats,open('/tmp/offm/stats.json','w'))
