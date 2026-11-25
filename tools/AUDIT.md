# Controle: kiest de app de goede producten en aanbiedingen?

Deze controle draait na elke verversing (ma en wo). Ze toetst de keuzelogica van de app (`match.js`) op een vaste set
boodschappenregels (`tests/ingredients.txt`) bij alle winkels, met de prijzen en aanbiedingen van die dag.

## Stappen

1. In de kloon: `node tools/audit.cjs`
   Schrijft `data/audit/cases.json` (alle gevallen) en `data/audit/sheet.txt` (alleen de **nieuwe** gevallen die een oordeel nodig hebben).
2. Lees `data/audit/sheet.txt` helemaal (in stukken als het groot is) en beoordeel elk geval volgens de maatstaf hieronder.
3. Schrijf alleen de **foute** gevallen naar `data/audit/verdicts.txt` (overschrijf het bestand), één per regel:
   `id|fout|korte reden` — bijvoorbeeld `03a64f73|fout|pinsa met ui is geen ui`.
   Niet genoemde gevallen tellen als goed. Twijfel = goed (alleen duidelijke fouten melden).
4. `node tools/audit_report.cjs` — werkt `data/audit/known.json` bij (oordelen worden onthouden, dus een geval komt maar één keer
   langs) en schrijft `data/audit/RAPPORT.md` en `data/audit/log.tsv`. Het script print het aantal fouten en de 5 belangrijkste nieuwe fouten bij aanbiedingen.
5. Pas geen code aan om fouten op te lossen; het rapport is voor de ontwikkelaar.

Een oordeel later bijstellen: zet de regel `id|goed|reden` of `id|fout|reden` in `verdicts.txt` op een dag dat het geval voorkomt.

## Maatstaf

Vraag steeds: **zou een normale klant die deze regel op zijn boodschappenlijst heeft, dit product of deze aanbieding als passend zien?**

### Aanbieding (AANB) is fout als

- het een **ander product** is dan de regel vraagt: een gerecht, snack, saus, soep, smaakmaker of samengesteld product waarin het
  ingrediënt alleen een smaak of onderdeel is (bv. "pinsa spek ui" bij *1 ui*, "Crostini knoflook" bij *knoflook*,
  "Pureersoep courgette" bij *courgette*, "Paturain knoflook" (roomkaas) bij *knoflook*, "kipfilet beleg" bij *500 g kipfilet* als vers vlees bedoeld is);
- het een **andere soort** is die niet uitwisselbaar is (rundergehakt ↔ kipgehakt, zoete aardappel ↔ gewone aardappel,
  verse groente ↔ diepvries/blik/pot alleen als de regel duidelijk vers bedoelt, zoals "1 broccoli", "1 courgette");
- het non-food, dier- of babyvoeding is;
- de **eenheid niet klopt** zodat de prijs misleidt (een fles saus bij een kilo groente);
- de prijs/korting zichtbaar **onzin** is (actieprijs hoger dan normaal, 90% korting op een basisproduct zonder reden).

Niet fout: ander merk, andere verpakkingsgrootte, biologisch, een mix met hetzelfde basisproduct (paprikamix bij paprika),
een aanbieding die duurder is dan de gewone keuze (de app gebruikt de goedkoopste), gesneden/voorbewerkt als dat hetzelfde product is
(broccoliroosjes bij broccoli, andijvie gesneden bij andijvie).

### Productkeuze (PROD) is fout als

Hetzelfde als hierboven, toegepast op het gekozen assortimentsproduct. Deze gevallen verschijnen alleen als de regex-toets in
`tests/ingredients.txt` het al fout vond; jouw oordeel beslist (de regex kan te streng zijn, bv. "Kipdijfilet" bij *kippendijen*
is goed). Een vervanger ("vervanger") is fout als het geen redelijk alternatief is.

## Datacontrole

`audit.cjs` meldt ook automatisch verdachte aanbiedingsdata (actieprijs hoger dan normale prijs, korting > 80%, einddatum vóór begin,
langer dan 31 dagen geldig, geen prijs én geen korting, dezelfde aanbieding twee keer met verschillende prijs). Die hoeven niet beoordeeld te worden.

## Wat de controle niet meet

- De **Claude-keuze** die de app online maakt (`/api/match`): die kost API-tegoed en wordt hier niet aangeroepen. De controle toetst
  de lokale keuze die de app gebruikt als er (nog) geen Claude-keuze is. Aanbiedingen kiest de app altijd lokaal, die zijn dus volledig getoetst.
- Persoonlijke keuzes van gebruikers (vastgezette producten).
