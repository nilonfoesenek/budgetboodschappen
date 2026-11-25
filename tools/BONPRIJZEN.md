# AH-prijzen uit kassabonnen

De vaste AH-prijzen in Checkjebon zijn sinds november 2025 bevroren. Het prijsgeheugen (`data/overrides/ah.json`) houdt ze deels actueel met
twee bronnen. Per product wint de nieuwste datum, en een prijs telt maximaal 183 dagen.

1. **Folder** (`tools/fetch_offers.py`): de normale prijs die bij een Bonus-aanbieding staat.
2. **Kassabonnen**: gebruikers die toestemming gaven (onderzoek-vinkje in de app) sturen bij het scannen van een AH-bon de normale prijzen mee.

## Hoe het werkt

- `netlify/functions/receipt.mjs` bewaart na het lezen van een bon, alleen bij toestemming, per stuk van de bon: productnaam, prijs per stuk
  (vóór korting) en de maandag van de week van de bon. Er wordt geen apparaat-code, tijd, filiaal of totaal bewaard. De willekeurige
  scan-code dient alleen om de stukken van één bon samen te voegen. Gewogen producten, AH to go en andere winkels worden overgeslagen.
- `netlify/functions/bonprijzen.mjs` (`/api/bonprijzen`, alleen met de sleutel) geeft losse regels `[naam, prijs, week]` terug en ruimt
  regels ouder dan 7 maanden op.
- `tools/fetch_bonprijzen.py` koppelt elke bonregel aan precies één AH-product: woorden, inhoud en prijs (-30% tot +43%) moeten kloppen.
  Bij twijfel wordt de regel niet gebruikt. Het script schrijft `<map>/ah.json` met `"partial": true` en `"source": "kassabon"`, met als 8e veld per regel de datum.
- `tools/build_prices.py --own <map>` zet die prijzen in het prijsgeheugen (sleutel `naam|inhoud`) en zet de datum als 4e veld in
  `data/prices.json`. `meta.ah.stale` = maand van de bevroren bron. De app toont "prijs van 23 nov" of "prijs uit nov 2025, mogelijk verouderd".
- In de prijsdatabase (`tools/db_update.py`) komen deze regels als winkel `ah_week`.

## Eenmalig instellen

1. Netlify → Site configuration → Environment variables: `BONPRIJZEN_KEY` = een lange willekeurige tekst.
   Daarna één keer publiceren (deze wijzigingen aan `netlify/` en `index.html` werken pas na een publicatie).
2. Cloudomgeving van de geplande taak: host `budgetboodschappen.netlify.app` toestaan, en de sleutel als netwerkgeheim voor die host
   (header `Authorization`, `Bearer <sleutel>`). Of zet hem als omgevingsvariabele `BONPRIJZEN_KEY`.

## Stap in de geplande verversing (ma en wo), vóór `build_prices.py`

```
python3 -I tools/fetch_bonprijzen.py https://budgetboodschappen.netlify.app/api/bonprijzen data/prices.json <map>
```

`<map>` is dezelfde map als bij `--own`. Mislukt deze stap (geen netwerk, geen sleutel), ga dan gewoon door: het prijsgeheugen
onthoudt de eerder gekoppelde prijzen.
