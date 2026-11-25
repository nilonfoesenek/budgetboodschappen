# Prijsdatabase Boodje

Doel: alle supermarktprijzen en aanbiedingen over langere tijd bewaren, zodat later een **onafhankelijk onderzoek** mogelijk is
(bijvoorbeeld: welke supermarkt was over een heel jaar het goedkoopst?). De database wordt elke maandag en woensdag automatisch
aangevuld door de geplande verversing (`tools/db_update.py`). Er wordt niets weggegooid of achteraf aangepast.

## Bestanden (tab-gescheiden, UTF-8, eerste regel = kolomnamen)

| bestand | inhoud |
|---|---|
| `snapshots.tsv` | één regel per winkel per peildatum: `datum, winkel, bron, bronversie, producten, nieuw, gewijzigd, verdwenen` |
| `prijzen/<jaar>/<winkel>.tsv` | `datum, id, naam, inhoud, prijs` — **alleen wijzigingen**: een product staat erin als het nieuw is of de prijs/naam/inhoud veranderde. Lege prijs = product verdwenen. |
| `aanbiedingen/<jaar>.tsv` | `eerst_gezien, winkel, geldig_van, geldig_tot, naam, actie, actieprijs, normale_prijs, korting` — elke aanbieding één keer |

**Stand op een datum reconstrueren:** neem per winkel alle regels uit `prijzen/*/<winkel>.tsv` met `datum <= peildatum`, in volgorde;
de laatste regel per `id` geldt (lege prijs = niet meer verkrijgbaar). Dit doet `tools/db_query.py`:

```
python3 tools/db_query.py versheid                         # per winkel: peildata en laatste prijswijziging
python3 tools/db_query.py stand 2026-06-01 > stand.csv     # alle prijzen op 1 juni 2026 (CSV met ; voor Excel)
python3 tools/db_query.py product jumbo "halfvolle melk"   # prijsverloop
python3 tools/db_query.py aanbiedingen 2026-06-01 ah       # aanbiedingen die toen geldig waren
```

`id` is de productcode/URL van de bron als die er is (stabiel, ook als de naam verandert), anders `naam|inhoud`.

## Bronnen en herkomst

- **Checkjebon open data** (github.com/supermarkt/checkjebon, `data/supermarkets.json`): AH, Jumbo, Plus, Dirk, Lidl, DekaMarkt,
  Hoogvliet, SPAR, Vomar, Poiesz (en tot juni 2026 Aldi, tot december 2025 Ekoplaza). Ruwe gegevens, niet gefilterd
  (dus ook non-food). `bronversie` = commit in die repository.
- **Terugwerkend aangevuld:** 24-11-2025 t/m 20-11-2026 één peildatum per week, uit de git-geschiedenis van Checkjebon
  (de datum is de commitdatum van de bron). Vanaf 25-11-2026 twee peildata per week (ma en wo).
- **Aldi** vanaf 25-11-2026: eigen uitlezing van aldi.nl (29 categoriepagina's, ±900 producten = een **selectie** van het assortiment).
  Aldi-regels vóór juni 2026 komen uit Checkjebon en hebben andere id's.
- **Eigen uitlezing van de winkelwebsites** (vanaf 30-11-2026, `tools/scrape/`): Plus, Hoogvliet, Dirk, DekaMarkt, Vomar en Aldi
  (volledig online assortiment). Die vervangen vanaf dan Checkjebon voor die winkels; in `snapshots.tsv` staat de bron per peildatum.
  Omdat de id's per bron verschillen, toont de eerste peildatum met de nieuwe bron alle oude producten als verdwenen en de nieuwe als nieuw.
  Lidl publiceert alleen de producten van de week (met normale prijs); die staan als aparte winkel `lidl_week`.
- **Aanbiedingen:** folderz.nl (weekfolders van alle 11 winkels), vanaf 23-11-2026.

## Belangrijke kanttekeningen voor onderzoek

1. **Verouderde bron.** In Checkjebon veranderen de prijzen van **AH, Plus, Hoogvliet en DekaMarkt sinds november 2025 niet meer**,
   Dirk sinds december 2025, Vomar sinds juni 2026 en Lidl sinds augustus 2026 (zie `versheid`). De bron publiceert ze nog wel, maar ze zijn bevroren.
   Bij de folderaanbiedingen wijkt de "normale prijs" in 64–86% van de gevallen af van die bevroren prijzen. Voor deze winkels zijn
   de vaste prijzen in deze database dus **niet** representatief voor de periode daarna. Alleen Jumbo, SPAR en Poiesz worden actueel bijgehouden.
   Controleer `snapshots.tsv` (kolommen nieuw/gewijzigd/verdwenen) voordat je een periode vergelijkt. Een winkel met weken lang 0 wijzigingen is verdacht.
2. **Ongelijke dekking.** Aantallen producten verschillen sterk (Vomar ±900, Aldi ±900, AH/Jumbo/Plus ±16.000). Vergelijk daarom
   niet "gemiddelde prijs van het assortiment", maar een **vaste boodschappenmand** van vergelijkbare producten.
3. **Zelfde product in verschillende winkels.** Namen verschillen per winkel. Voor A-merken staat in `data/pm/<winkel>.json` voor veel
   producten de EAN-barcode (eerste veld), daarmee kun je identieke producten koppelen. Huismerken vergelijk je op soort en inhoud (prijs per kg/l).
4. **Aanbiedingen** tellen in een eerlijke vergelijking mee (de klant betaalt de actieprijs). `korting` is een fractie (0,5 = 50%). Bij
   "1+1 gratis" en "2e halve prijs" geldt de actieprijs alleen bij meerdere stuks. `actieprijs` is wat de bron per stuk noemt.
5. Prijzen zijn landelijke webprijzen. Filialen kunnen afwijken (vooral bij franchisewinkels zoals SPAR, Plus en DekaMarkt).

## Voorstel voor de opzet van het jaaronderzoek

- Leg **vooraf** een mand vast (bijv. 40–60 basisproducten met vaste inhoud) en de regels voor koppelen. Dat voorkomt dat de uitkomst
  door keuzes achteraf wordt gestuurd.
- Bereken per peildatum per winkel de mandprijs (zonder en met aanbiedingen) en neem het jaargemiddelde.
- Rapporteer per winkel hoeveel van de mand gevonden werd en hoe vers de bron was. Laat winkels met een bevroren bron weg of gebruik een andere prijsbron.
