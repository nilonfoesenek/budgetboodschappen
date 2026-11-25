# Stap 2: maakt data/pm/<winkel>.json = naam -> [streepjescode, OFF-foto, zelfde merkproduct bij Jumbo/Dirk/SPAR, naam daar]
# Combineert: OFF-match (streepjescode + foto) en hetzelfde merkproduct bij een winkel waarvan we foto's kunnen ophalen (Jumbo, Dirk, SPAR)
import json,re,unicodedata,collections
exec(open('tools/pm_off.py').read().split("docs=[]")[0].split("con=duckdb.connect()")[0])
def nrm(t):
    t=unicodedata.normalize('NFKD',t or '').encode('ascii','ignore').decode().lower();t=re.sub(r"[’'`]","",t);return re.sub(r'[^a-z0-9.,]+',' ',t)
QRE=re.compile(r'(\d+(?:[.,]\d+)?)\s*(kg|g|gr|gram|ml|cl|l|liter|ltr|st|stuks?)\b')
STOP=set('de het een en of met van voor in op naar per x g kg ml l cl st stuks stuk gram liter pak zak doos fles blik pot ca'.split())
def toks(t):
    t=QRE.sub(' ',nrm(t));return [w for w in re.split(r'[ .,]+',t) if len(w)>1 and w not in STOP and not w.isdigit()]
HOUSEW={'ah','albert','heijn','jumbo','plus','lidl','aldi','beste','dirk','dekamarkt','deka','dekavers','hoogvliet','spar','vomar','poiesz','gwoon','g','woon','smaakt','perfekt','milsani','bio','biologisch'}
P=json.load(open('/home/claude/budgetboodschappen/data/prices.json'))
M=json.load(open('/tmp/offm/match.json'))
PHOTO=['jumbo','dirk','spar']
key=lambda n:frozenset(toks(n))
pool={}
for s in PHOTO:
    for name,price,size,*_ in P['stores'][s]:
        k=key(name)
        if len(k)<2 or k&{'ah','jumbo','plus','lidl','aldi','dirk','beste','spar','hoogvliet','dekamarkt','dekavers','vomar','poiesz'}:continue
        pool.setdefault(k,(s,name))
out={};st={}
for s,items in P['stores'].items():
    o={};na=0;nc=0
    for name,price,size,*_ in items:
        ln=name.lower();m=M[s].get(ln);alt=None
        if s not in PHOTO:
            k=key(name)
            if len(k)>=2 and k in pool:alt=pool[k]
        if alt and not m:
            m2=M[alt[0]].get(alt[1].lower())
            if m2:m=m2
        if m or alt:
            code,img=(m if m else (None,None))
            # OFF-fotopad inkorten: code bepaalt de map
            ik=img.rsplit('/',1)[1].replace('.400.jpg','') if img else None
            o[ln]=[code,ik]+([alt[0],alt[1].lower()] if alt else [])
            na+=bool(alt);nc+=bool(m)
    out[s]=o;st[s]=(len(o),nc,na,len(items))
    print(s,'totaal',len(o),'off',nc,'via andere winkel',na,'van',len(items))
import os
os.makedirs('/home/claude/budgetboodschappen/data/pm',exist_ok=True)
for s,o in out.items():json.dump(o,open(f'/home/claude/budgetboodschappen/data/pm/{s}.json','w'),ensure_ascii=False,separators=(',',':'))
