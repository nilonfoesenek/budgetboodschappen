# Controlerapport Boodje

Controle van **2026-11-25**. Gemaakt door `tools/audit.cjs` en `tools/audit_report.cjs`; maatstaf in `tools/AUDIT.md`.

## Samenvatting

- **323 fouten** in deze controle, waarvan **0 nieuw** (0 bij aanbiedingen, 0 bij productkeuzes).
- Aanbiedingen: 309 getoond bij 246 controleregels, 60 fout (19%).
- Productkeuzes: 2618 gekozen, 263 fout (10%); 88 keer niets gevonden.
- Datacontrole aanbiedingen: 87 meldingen (87 bij aanbiedingen die nu in de app staan).

- Vaste prijzen mogelijk verouderd bij: **ah, lidl** (zie Versheid).

## Versheid vaste prijzen

Folder = normale prijs die de folder noemt bij een aanbieding, vergeleken met de vaste prijs in de app voor precies dezelfde productnaam. Laatste wijziging = laatste peildatum waarop de bron voor die winkel nog iets veranderde (data/db/snapshots.tsv).

| winkel | bron vaste prijzen | vergeleken | wijkt af | laatste wijziging in database |
|---|---|---:|---:|---|
| ah ⚠️ | Checkjebon open data + prijsgeheugen: 878 prijzen bijgewerkt, 0 toegevoegd (2041 bekend) | 1240 | 7 (1%) | nooit sinds 2025-11-24 |
| aldi | aldi.nl 2026-11-25 | 13 | 8 (62%) | 2026-11-25 |
| dekamarkt | www.dekamarkt.nl 2026-11-25 | 1 | 0 (0%) | nooit sinds 2025-11-24 |
| dirk | www.dirk.nl 2026-11-25 | 11 | 11 (100%) | 2025-12-08 |
| hoogvliet | hoogvliet.nl 2026-11-25 | 227 | 18 (8%) | nooit sinds 2025-11-24 |
| jumbo | Checkjebon open data | 897 | 14 (2%) | 2026-11-25 |
| lidl ⚠️ | Checkjebon open data (via boodschaapje.nl) + prijsgeheugen: 19 prijzen bijgewerkt, 22 toegevoegd (44 bekend) | 3 | 2 (67%) | 2026-08-24 |
| plus | plus.nl 2026-11-25 | 638 | 59 (9%) | nooit sinds 2025-11-24 |
| poiesz | Checkjebon open data | 1 | 1 (100%) | 2026-11-25 |
| spar | Checkjebon open data | 0 | – | 2026-11-25 |
| vomar | vomar.nl 2026-11-25 | 1 | 1 (100%) | 2026-06-01 |

## Per winkel

| winkel | aanbiedingen getoond | fout | productkeuzes | fout |
|---|---:|---:|---:|---:|
| ah | 69 | 18 | 246 | 14 |
| aldi | 25 | 3 | 230 | 29 |
| dekamarkt | 15 | 0 | 245 | 20 |
| dirk | 26 | 4 | 245 | 20 |
| hoogvliet | 30 | 10 | 244 | 16 |
| jumbo | 37 | 8 | 246 | 20 |
| lidl | 18 | 1 | 243 | 14 |
| plus | 44 | 12 | 245 | 15 |
| poiesz | 24 | 2 | 183 | 73 |
| spar | 2 | 0 | 245 | 19 |
| vomar | 19 | 2 | 246 | 23 |

## Nieuwe fouten bij aanbiedingen

Geen.

## Nieuwe fouten bij productkeuzes

Geen.

## Alle fouten in deze controle

### Aanbiedingen (60)

| winkel | regel | aanbieding | reden |
|---|---|---|---|
| ah | 1 ui | AH Verse pinsa spek ui (2 voor 10.00, €5,00) | pinsa met spek en ui is geen ui |
| ah | 3 teentjes knoflook | Paturain Knoflook (1+1 gratis, €0,99) | Paturain knoflook is roomkaas |
| hoogvliet | 3 teentjes knoflook | Queens Pangalicious knoflook kruiden (voor 2,49, €2,49) | kruidenmix, geen knoflook |
| jumbo | 3 teentjes knoflook | Paolo Crostini Knoflook 150 g (1+1 gratis, €0,81) | crostini (snack), geen knoflook |
| ah | 1 courgette | AH Terra Pureersoep courgette (2 voor 7.00, €3,50) | pureersoep, geen courgette |
| dirk | 4 tomaten | Heinz Tomaten gepeld (voor 0,89, €0,89) | tomaten uit blik bij verse tomaten |
| plus | 1 pompoen | De Kleine Keuken Bio knijpmix 6+ banaan pompoen (voor 1,12, €1,12) | babyknijpzakje, geen pompoen |
| hoogvliet | 1 bosje peterselie | Queens Pangalicious citroen peterselie (voor 2,49, €2,49) | kruidenmix, geen verse peterselie |
| hoogvliet | 1 kg appels | Handsinaasappels (voor 2,69, €2,69) | handsinaasappels zijn geen appels |
| vomar | 1 kg appels | Perssinaas-appelen (voor 1,99, €1,99) | perssinaasappelen zijn geen appels |
| ah | 1 kg sinaasappel | LU Pim's sinaasappel (2+1 gratis, €2,13) | Pim's koekjes, geen sinaasappel |
| ah | 500 g aardbeien | CoolBest Fruitontbijt sinaasappel aardbei (1+1 gratis, €1,50) | fruitdrank, geen aardbeien |
| plus | 500 g aardbeien | PLUS Donut Aardbei (2+3 gratis, €0,32) | donut, geen aardbeien |
| jumbo | 1 mango | Stelz Mango 0.0% 250ML (1+1 gratis, €0,99) | drankje, geen mango |
| ah | 500 g kipfilet | Streeckgenoten Gerookte kipfilet (25% korting, €2,77) | gerookte kipfilet (beleg) bij verse kipfilet |
| plus | 500 g kipfilet | PLUS Puur van smaak Ovengebakken Kipfilet (voor 3,30, €3,30) | ovengebakken kipfilet (beleg) bij verse kipfilet |
| aldi | 500 g kipfilet | Kipfilet (voor 0,99, €0,99) | €0,99 voor kipfilet onwaarschijnlijk (waarschijnlijk per 100 g) |
| hoogvliet | 500 g gehakt | Verstegen kruidenmix voor gehakt (1 + 1 Gratis, €2,44) | kruidenmix, geen gehakt |
| plus | 500 g gehakt | PLUS Plantaardig gehakt (voor 2,24, €2,24) | plantaardig gehakt bij gehakt |
| aldi | 500 g gehakt | Kipgehakt (50% korting € 3,00, €2,69) | kipgehakt bij gewoon gehakt |
| ah | 200 g spekjes | AH Terra Plantaardige spekjes (2e halve prijs, €1,39) | plantaardige spekjes bij spekjes |
| jumbo | 200 g spekjes | Vivera Plantaardige Spekjes 175 g (1+1 gratis, €2,00) | plantaardige spekjes bij spekjes |
| lidl | 200 g spekjes | Sint spekjes (voor 1,49, €1,49) | Sint-snoepgoed, geen spekjes |
| plus | 200 g spekjes | PLUS Plantaardige spekjes (voor 1,27, €1,27) | plantaardige spekjes bij spekjes |
| ah | 200 g gyros | Vivera Plantaardige gyros (2+1 gratis, €2,46) | plantaardige gyros bij gyros |
| jumbo | 200 g gyros | Vivera Plantaardige Gyros 175 g (1+1 gratis, €1,84) | plantaardige gyros bij gyros |
| plus | 200 g gyros | PLUS Gesneden verspakket Pita Gyros (voor 5,49, €5,49) | groentepakket, geen gyrosvlees |
| jumbo | 100 g salami | Dr. Oetker Big Americans Filled Crust Triple Salami 489 g (1+1 gratis, €2,85) | pizza, geen salami |
| hoogvliet | 100 g filet americain | Kips Vega filet americain (1 + 1 Gratis, €1,02) | vega filet americain |
| hoogvliet | 500 g magere kwark | Optimel Magere Kwark Aardbei (1 + 1 Gratis, €1,12) | aardbeienkwark bij magere kwark naturel |
| dirk | 125 g mozzarella | Valess Tomaat mozzarella (voor 2,49, €2,49) | vega tomaat-mozzarellaschnitzel, geen mozzarella |
| hoogvliet | 125 g mozzarella | Wagner Fina mozzarella (voor 2,49, €2,49) | pizza, geen mozzarella |
| ah | 1 pak muesli | Zuivelhoeve Boer'n muesli bosvruchten (1+1 gratis, €0,94) | yoghurt met muesli, geen muesli |
| hoogvliet | 250 g tagliatelle | Verspakket tagliatelle (voor 4,49, €4,49) | groentepakket, geen tagliatelle |
| plus | 250 g noedels | Knorr Wereldgerecht Hokkien Noedels (2+3 gratis, €2,00) | maaltijdpakket, geen noedels |
| ah | 200 g couscous | AH Slaverrijker couscous (3 voor 6.00, €2,00) | saladetopping, geen couscous |
| jumbo | 200 g couscous | Verstegen World Spice Meal Couscous 50 g (1+1 gratis, €2,00) | kruidenmix, geen couscous |
| ah | 200 g bulgur | AH Bulgur witte kaas S (voor 2,99, €2,99) | bulgursalade, geen bulgur |
| poiesz | 1 pot pesto | Qizini panini prosciutto of kip pesto (voor 2,00, €2,00) | panini, geen pesto |
| ah | 1 pot mosterd | Knorr Cup-a-soup mosterd (1+1 gratis, €1,07) | cup-a-soup, geen mosterd |
| hoogvliet | 1 pot mosterd | Knorr Cup a soup mosterd (voor 1,19, €1,19) | cup-a-soup, geen mosterd |
| plus | 1 fles ketchup | Chio POM-BAR Ketchup (2 voor 2.99, €1,50) | chips, geen ketchup |
| ah | 1 kg suiker | AH Excellent Suikerspinsuiker, 200 g (voor 2,49, €2,49) | suikerspinsuiker 200 g bij gewone suiker |
| ah | 200 g amandelen | Alpro Barista amandel (2e halve prijs, €2,02) | amandeldrink, geen amandelen |
| ah | 1 tl komijn | AH Biologisch Jong belegen komijn 50+ plakken (25% korting, €3,35) | komijnekaas bij komijn (specerij) |
| dirk | 1 tl komijn | Kroon van Holland Jong belegen komijn 48+ plakken (voor 1,99, €1,99) | komijnekaas bij komijn (specerij) |
| hoogvliet | 1 tl komijn | Milner 30+ Komijn Plakken (voor 1,99, €1,99) | komijnekaas bij komijn (specerij) |
| jumbo | 1 tl komijn | Milner Komijn Jong Belegen 30+ Kaas Plakken (voor 3,19, €3,19) | komijnekaas bij komijn (specerij) |
| plus | 1 tl komijn | Beemster 48+ Jong Belegen Komijn Plakken (2 voor 3.99, €2,00) | komijnekaas bij komijn (specerij) |
| ah | 1 tl oregano | AH Verse pureersoep tomaat oregano (2 voor 7.00, €3,50) | soep, geen oregano |
| ah | 1 tl kurkuma | Care Kurkuma & zwarte peper (1+1 gratis, €3,50) | supplement, geen kurkuma |
| dirk | 1 bakje verse basilicum | Daily Chef Raviolini provolone basilicum (voor 1,99, €1,99) | raviolini, geen basilicum |
| jumbo | 1 bakje verse basilicum | Paolo Grissini Cruncy Basilicum en Knoflook 150 g (1+1 gratis, €0,82) | grissini, geen basilicum |
| plus | zout | Klene Puur zout (voor 1,99, €1,99) | zoute drop, geen zout |
| aldi | peper | Gourmet Zoete pepers (voor 3,49, €3,49) | zoete pepers in pot, geen (zwarte) peper |
| plus | 6 flessen water | Lipton en Sourcy Vitaminwater (voor 0,99, €0,99) | vitaminedrank, geen water |
| vomar | 6 flessen water | Royal Club of Sourcy Vitamin Water (voor 1,79, €1,79) | vitaminedrank, geen water |
| ah | 1 pak thee | Care Groene thee (1+1 gratis, €2,50) | supplement, geen thee |
| plus | 1 pak toiletpapier | Page Vochtig toiletpapier puur 38 st (1+1 gratis, €1,15) | vochtig toiletpapier bij toiletpapier |
| poiesz | 1 fles wasmiddel | Dreft handafwasmiddel (1+1 GRATIS, €1,48) | handafwasmiddel bij wasmiddel |

### Productkeuzes (263)

| winkel | regel | gekozen | reden |
|---|---|---|---|
| vomar | 750 g krieltjes | Kasteeltjes 4 stuks €4,48 | Kasteeltjes 4 stuks past niet bij '750 g krieltjes' |
| jumbo | 1 ui | Jumbo Jus Ui 18 g 18 g €0,39 | Jumbo Jus Ui 18 g 18 g past niet bij '1 ui' |
| poiesz | 1 bloemkool | Verspakket ovenschotel bloemkool 1040 gram €5,50 | Verspakket ovenschotel bloemkool 1040 gram past niet bij '1 bloemkool' |
| ah | 2 rode paprika | AH Gegrilde rode paprika 295 g €2,25 | AH Gegrilde rode paprika 295 g past niet bij '2 rode paprika' |
| dekamarkt | 2 rode paprika | Paolo Rode paprika geroosterd 450 g €3,69 | Paolo Rode paprika geroosterd 450 g past niet bij '2 rode paprika' |
| dirk | 2 rode paprika | 1 de Beste Chips paprika 250 g €0,48 | 1 de Beste Chips paprika 250 g past niet bij '2 rode paprika' |
| plus | 2 rode paprika | PLUS Geroosterde rode paprika 295 g €2,25 | PLUS Geroosterde rode paprika 295 g past niet bij '2 rode paprika' |
| spar | 2 rode paprika | Baktat gegrilde rode paprika 650 gram €3,99 | Baktat gegrilde rode paprika 650 gram past niet bij '2 rode paprika' |
| dirk | 1 groene paprika | Zonnatura Groentespread paprika 135 g €2,95 | Zonnatura Groentespread paprika 135 g past niet bij '1 groene paprika' |
| spar | 1 groene paprika | Zonnatura groentespread paprika 135 gram €3,59 | Zonnatura groentespread paprika 135 gram past niet bij '1 groene paprika' |
| aldi | 1 groene paprika | Paprika- of naturelchips 50 g €0,50 | Paprika- of naturelchips 50 g past niet bij '1 groene paprika' |
| poiesz | 4 tomaten | Unox Soep Tomaten 300 milliliter €2,15 | Unox Soep Tomaten 300 milliliter past niet bij '4 tomaten' |
| jumbo | 250 g cherrytomaten | Heinz Pastasaus Zongerijpte Cherrytomaten & Basilicum 490g €3,79 | Heinz Pastasaus Zongerijpte Cherrytomaten & Basilicum 490g past niet bij '250 g cherrytomaten' |
| poiesz | 250 g cherrytomaten | Unox Soep Tomaten 300 milliliter €2,15 | Unox Soep Tomaten 300 milliliter past niet bij '250 g cherrytomaten' |
| poiesz | 250 g champignons | Unox Soep Champignon 800 milliliter €3,99 | Unox Soep Champignon 800 milliliter past niet bij '250 g champignons' |
| poiesz | 250 g kastanjechampignons | Unox Soep Champignon 800 milliliter €3,99 | Unox Soep Champignon 800 milliliter past niet bij '250 g kastanjechampignons' |
| ah | 1 bosje lente-uitjes | AH Gebakken uitjes 150 g €1,19 | AH Gebakken uitjes 150 g past niet bij '1 bosje lente-uitjes' |
| dekamarkt | 1 bosje lente-uitjes | G'woon Amsterdamse uitjes 320 g €0,64 | G'woon Amsterdamse uitjes 320 g past niet bij '1 bosje lente-uitjes' |
| dirk | 1 bosje lente-uitjes | 1 de Beste Amsterdamse uitjes 320 g €0,64 | 1 de Beste Amsterdamse uitjes 320 g past niet bij '1 bosje lente-uitjes' |
| hoogvliet | 1 bosje lente-uitjes | G'woon Amsterdamse uitjes 320 g €0,64 | G'woon Amsterdamse uitjes 320 gram past niet bij '1 bosje lente-uitjes' |
| jumbo | 1 bosje lente-uitjes | Jumbo Gebakken Uitjes 150 g 150 g €1,49 | Jumbo Gebakken Uitjes 150 g 150 g past niet bij '1 bosje lente-uitjes' |
| lidl | 1 bosje lente-uitjes | Gehaktmix met uitjes €0,69 | Gehaktmix met uitjes past niet bij '1 bosje lente-uitjes' |
| plus | 1 bosje lente-uitjes | PLUS Jus met uitjes 5 pak 90 g €1,09 | PLUS Jus met uitjes 5 pak 90 g past niet bij '1 bosje lente-uitjes' |
| poiesz | 1 bosje lente-uitjes | g'woon Amsterdamse Uitjes 370 milliliter €0,81 | g'woon Amsterdamse Uitjes 370 milliliter past niet bij '1 bosje lente-uitjes' |
| spar | 1 bosje lente-uitjes | g'woon Amsterdamse uitjes 320 gram €0,95 | g'woon Amsterdamse uitjes 320 gram past niet bij '1 bosje lente-uitjes' |
| vomar | 1 bosje lente-uitjes | Tartaar Met Uitjes 150 gram €2,99 | Tartaar Met Uitjes 150 gram past niet bij '1 bosje lente-uitjes' |
| aldi | 1 bosje lente-uitjes | Gebakken uitjes 280 g €2,89 | Gebakken uitjes 280 g past niet bij '1 bosje lente-uitjes' |
| dekamarkt | 150 g peultjes | Krieltjes 500 g €0,99 | Krieltjes 500 g past niet bij '150 g peultjes' |
| dirk | 150 g peultjes | 1 de Beste Krieltjes 500 g €0,99 | 1 de Beste Krieltjes 500 g past niet bij '150 g peultjes' |
| hoogvliet | 150 g peultjes | Krieltjes 500 g €1,09 | Krieltjes 500 gram past niet bij '150 g peultjes' |
| jumbo | 150 g peultjes | Jumbo Krieltjes 200 g 200 g €0,69 | Jumbo Krieltjes 200 g 200 g past niet bij '150 g peultjes' |
| lidl | 150 g peultjes | Kapperappeltjes 350 g €0,99 | Kapperappeltjes 350 g past niet bij '150 g peultjes' |
| poiesz | 150 g peultjes | Mini Krieltjes 200 gram €0,80 | Mini Krieltjes 200 gram past niet bij '150 g peultjes' |
| spar | 150 g peultjes | krieltjes 500 gram €1,25 | krieltjes 500 gram past niet bij '150 g peultjes' |
| vomar | 150 g peultjes | Kasteeltjes 4 stuks €4,48 | Kasteeltjes 4 stuks past niet bij '150 g peultjes' |
| aldi | 150 g peultjes | Krieltjes 500 g €0,99 | Krieltjes 500 g past niet bij '150 g peultjes' |
| plus | 1 rode peper | PLUS Witte peper 60 g €0,89 | PLUS Witte peper 60 g past niet bij '1 rode peper' |
| poiesz | 1 rode peper | Partjes peper - zeezout 450 gram €2,50 | Partjes peper - zeezout 450 gram past niet bij '1 rode peper' |
| aldi | 1 rode peper | Zwarte peper 50 g €0,88 | Zwarte peper 50 g past niet bij '1 rode peper' |
| jumbo | 1 stukje gember | Jumbo Kruidenthee Gember 15 x 2,5 g 15 x 2.5 g €1,19 | Jumbo Kruidenthee Gember 15 x 2,5 g 15 x 2.5 g past niet bij '1 stukje gember' |
| poiesz | 1 stukje gember | Aardbei-Gember Shot 125 milliliter €1,29 | Aardbei-Gember Shot 125 milliliter past niet bij '1 stukje gember' |
| poiesz | 1 rodekool | Iglo Rode Kool met Appeltjes 450 gram €2,22 | Iglo Rode Kool met Appeltjes 450 gram past niet bij '1 rodekool' |
| poiesz | 2 bieten | Ambachtelijk Sap Bio Rode Biet 750 milliliter €3,49 | Ambachtelijk Sap Bio Rode Biet 750 milliliter past niet bij '2 bieten' |
| lidl | 6 bananen | Bananencake €2,99 | Bananencake past niet bij '6 bananen' |
| dekamarkt | 1 kg sinaasappel | Wicky Sinaasappel 6x20 cl 1.2 liter €2,25 | Wicky Sinaasappel 6x20 cl 1.2 liter past niet bij '1 kg sinaasappel' |
| dirk | 1 kg sinaasappel | 1 de Beste Limonadesiroop sinaasappel 1 liter €1,59 | 1 de Beste Limonadesiroop sinaasappel 1 liter past niet bij '1 kg sinaasappel' |
| jumbo | 1 kg sinaasappel | 1FRUIT Sinaasappel 200ml 200 ml €0,99 | 1FRUIT Sinaasappel 200ml 200 ml past niet bij '1 kg sinaasappel' |
| lidl | 1 kg sinaasappel | Sinaasappel 2L 2 l €2,59 | Sinaasappel 2L 2 l past niet bij '1 kg sinaasappel' |
| poiesz | 1 kg sinaasappel | Appelsientje Fruitdrink Sinaasappel 1 liter €2,49 | Appelsientje Fruitdrink Sinaasappel 1 liter past niet bij '1 kg sinaasappel' |
| plus | 1 limoen | Bacardi Limón 700 ml €18,99 | Bacardi Limón 700 ml past niet bij '1 limoen' |
| poiesz | 1 limoen | Optimel Drinkyoghurt limoen 0% vet 1000 milliliter €2,09 | Optimel Drinkyoghurt limoen 0% vet 1000 milliliter past niet bij '1 limoen' |
| spar | 1 limoen | Bacardi limon & lemonade blik 250 milliliter €2,85 | Bacardi limon & lemonade blik 250 milliliter past niet bij '1 limoen' |
| vomar | 1 limoen | Bacardi Limon 700 ml €18,49 | Bacardi Limon 700 ml past niet bij '1 limoen' |
| jumbo | 500 g aardbeien | Jumbo Aardbei Schepijs 1L 533 g €2,59 | Jumbo Aardbei Schepijs 1L 533 g past niet bij '500 g aardbeien' |
| poiesz | 125 g blauwe bessen | Activia Kefir bosbessmaak 0.28 kilogram €1,49 | Activia Kefir bosbessmaak 0.28 kilogram past niet bij '125 g blauwe bessen' |
| poiesz | 1 ananas | Ananas-Meloen-Mangosap 500 milliliter €2,69 | Ananas-Meloen-Mangosap 500 milliliter past niet bij '1 ananas' |
| hoogvliet | 2 peren | G'woon Fruitijsjes peren 12 st €1,45 | G'woon Fruitijsjes peren 12 stuks past niet bij '2 peren' |
| jumbo | 2 peren | Jumbo Peren Waterijsjes 12 Stuks 50 g €1,49 | Jumbo Peren Waterijsjes 12 Stuks 50 g past niet bij '2 peren' |
| plus | 2 peren | PLUS Peren ijsjes 12 st €1,49 | PLUS Peren ijsjes 12 st past niet bij '2 peren' |
| poiesz | 2 peren | g'woon Peren Fruitijsjes 600 gram €1,58 | g'woon Peren Fruitijsjes 600 gram past niet bij '2 peren' |
| poiesz | 400 g kipdijfilet | Kalkoenfilet 100 gram €2,69 | Kalkoenfilet 100 gram past niet bij '400 g kipdijfilet' |
| hoogvliet | 4 kippendijen | Peijnenburg Parelkandij 4 st €2,39 | Peijnenburg Parelkandij 4 st past niet bij '4 kippendijen' |
| plus | 4 kippendijen | Peijnenburg Ontbijtkoekrepen Parelkandij 162 g €2,75 | Peijnenburg Ontbijtkoekrepen Parelkandij 162 g past niet bij '4 kippendijen' |
| vomar | 4 kippendijen | Peijnenburg Parelkandij 348 gram €2,19 | Peijnenburg Parelkandij 348 gram past niet bij '4 kippendijen' |
| aldi | 4 kippendijen | Luxe ontbijtkoek parelkandij 465 g €1,79 | Luxe ontbijtkoek parelkandij 465 g past niet bij '4 kippendijen' |
| lidl | 300 g kipreepjes | Vega kipreepjes €2,99 | Vega kipreepjes past niet bij '300 g kipreepjes' |
| poiesz | 300 g kipreepjes | Aviko Maaltijdpannetje Roerbak Runderreepjes zak 450 gram €4,49 | Aviko Maaltijdpannetje Roerbak Runderreepjes zak 450 gram past niet bij '300 g kipreepjes' |
| dirk | 1 hele kip | 1 de Beste Bouillonblokjes kip 12 stuks 120 g €0,54 | 1 de Beste Bouillonblokjes kip 12 stuks 120 g past niet bij '1 hele kip' |
| poiesz | 1 hele kip | Unox Soep Kip 300 milliliter €2,15 | Unox Soep Kip 300 milliliter past niet bij '1 hele kip' |
| aldi | 1 hele kip | Bouillonblokjes kip 120 g €0,54 | Bouillonblokjes kip 120 g past niet bij '1 hele kip' |
| poiesz | 500 g rundergehakt | Italiaans Gehakt 500 gram €6,49 | Italiaans Gehakt 500 gram past niet bij '500 g rundergehakt' |
| poiesz | 4 hamburgers | Oliehoorn Hamburgersaus 270 milliliter €2,82 | Oliehoorn Hamburgersaus 270 milliliter past niet bij '4 hamburgers' |
| ah | 2 biefstukken | Statesman Tonijn stukken in water 160 g €1,35 | Statesman Tonijn stukken in water 160 g past niet bij '2 biefstukken' |
| dekamarkt | 2 biefstukken | G'woon Appelcompote met stukken 570 g €1,19 | G'woon Appelcompote met stukken 570 g past niet bij '2 biefstukken' |
| dirk | 2 biefstukken | Deepblue Inktvis stukken in olie met knoflook 111 g €2,29 | Deepblue Inktvis stukken in olie met knoflook 111 g past niet bij '2 biefstukken' |
| jumbo | 2 biefstukken | KoRo Gevriesdroogde Mangostukken 30g €3,99 | KoRo Gevriesdroogde Mangostukken 30g past niet bij '2 biefstukken' |
| lidl | 2 biefstukken | Ananasstukken 567 g €1,99 | Ananasstukken 567 g past niet bij '2 biefstukken' |
| spar | 2 biefstukken | Vos Banket Spritsstukken Roomboter 300 gram €4,95 | Vos Banket Spritsstukken Roomboter 300 gram past niet bij '2 biefstukken' |
| vomar | 2 biefstukken | Rmb Spritsstukken 6 stuks €3,19 | Rmb Spritsstukken 6 stuks past niet bij '2 biefstukken' |
| dirk | 500 g runderlappen | Vleeschmeesters Varkenslappen mager 5 st. 875 g €9,49 | Vleeschmeesters Varkenslappen mager 5 st. 875 g past niet bij '500 g runderlappen' |
| hoogvliet | 500 g runderlappen | Appelflappen €1,76 | Appelflappen past niet bij '500 g runderlappen' |
| poiesz | 500 g runderlappen | Appelflappen 4 stuk €3,56 | Appelflappen 4 stuk past niet bij '500 g runderlappen' |
| spar | 500 g runderlappen | Spar hamlappen 2 stuks 300 gram €3,72 | Spar hamlappen 2 stuks 300 gram past niet bij '500 g runderlappen' |
| ah | 4 speklappen | AH Kersenflappen met room 4 stuks €4,49 | AH Kersenflappen met room 4 stuks past niet bij '4 speklappen' |
| dirk | 4 speklappen | Vleeschmeesters Varkenslappen mager 5 st. 875 g €9,49 | Vleeschmeesters Varkenslappen mager 5 st. 875 g past niet bij '4 speklappen' |
| poiesz | 4 speklappen | Appelflappen 4 stuk €3,56 | Appelflappen 4 stuk past niet bij '4 speklappen' |
| ah | 200 g spekjes | AH Terra Plantaardige spekjes 140 g €1,85 | AH Terra Plantaardige spekjes 140 g past niet bij '200 g spekjes' |
| plus | 200 g spekjes | PLUS Plantaardige spekjes 160 g €1,69 | PLUS Plantaardige spekjes 160 g past niet bij '200 g spekjes' |
| poiesz | 200 g spekjes | Aviko Aardappelspecialiteit Lachebekjes 450 gram €2,96 | Aviko Aardappelspecialiteit Lachebekjes 450 gram past niet bij '200 g spekjes' |
| vomar | 200 g spekjes | Vivera Speckjes 175 gram €3,85 | Vivera Speckjes 175 gram past niet bij '200 g spekjes' |
| poiesz | 2 zalmfilets | Gerookte Atlantische Zalmfilet 200 gram €6,49 | Gerookte Atlantische Zalmfilet 200 gram past niet bij '2 zalmfilets' |
| spar | 2 zalmfilets | gerookte zalmfilet Atlantisch 200 gram €6,59 | gerookte zalmfilet Atlantisch 200 gram past niet bij '2 zalmfilets' |
| aldi | 300 g garnalen | Garnalen-, serranoham- of kaaskroketjes 6 stuks. 240 g €3,49 | Garnalen-, serranoham- of kaaskroketjes 6 stuks. 240 g past niet bij '300 g garnalen' |
| dirk | 2 blikjes tonijn | Salade tonijn 300 g €1,48 | Salade tonijn 300 g past niet bij '2 blikjes tonijn' |
| jumbo | 200 g gerookte makreel | Minerva Makreel Pate 75 g 75 g €2,49 | Minerva Makreel Pate 75 g 75 g past niet bij '200 g gerookte makreel' |
| ah | 300 g shoarmavlees | AH Rundersoepvlees ca. 315 g €7,69 | AH Rundersoepvlees ca. 315 g past niet bij '300 g shoarmavlees' |
| dekamarkt | 300 g shoarmavlees | Stoofpotje varkensvlees 300 g €3,19 | Stoofpotje varkensvlees 300 g past niet bij '300 g shoarmavlees' |
| dirk | 300 g shoarmavlees | Vleeschmeesters Draadjesvlees 300 g €5,99 | Vleeschmeesters Draadjesvlees 300 g past niet bij '300 g shoarmavlees' |
| jumbo | 300 g shoarmavlees | Jumbo Runderrookvlees 100 g 100 g €2,69 | Jumbo Runderrookvlees 100 g 100 g past niet bij '300 g shoarmavlees' |
| lidl | 300 g shoarmavlees | Runderrookvlees €3,49 | Runderrookvlees past niet bij '300 g shoarmavlees' |
| poiesz | 300 g shoarmavlees | Appelsientje Sinaasappel Extra Vruchtvlees 1 liter €2,99 | Appelsientje Sinaasappel Extra Vruchtvlees 1 liter past niet bij '300 g shoarmavlees' |
| spar | 300 g shoarmavlees | Spar hacheevlees 500 gram €13,00 | Spar hacheevlees 500 gram past niet bij '300 g shoarmavlees' |
| vomar | 300 g shoarmavlees | Pekelvlees 100 gram €2,99 | Pekelvlees 100 gram past niet bij '300 g shoarmavlees' |
| aldi | 300 g shoarmavlees | Varkenstoofvlees 680 g €4,79 | Varkenstoofvlees 680 g past niet bij '300 g shoarmavlees' |
| ah | 150 g plakjes ham | AH Smeerkaas ham 15+ 200 g €1,39 | AH Smeerkaas ham 15+ 200 g past niet bij '150 g plakjes ham' |
| lidl | 150 g plakjes ham | Ham-kaashoorntje €0,99 | Ham-kaashoorntje past niet bij '150 g plakjes ham' |
| plus | 150 g plakjes ham | PLUS Ham-kaascroissant 1 st €0,99 | PLUS Ham-kaascroissant 1 st past niet bij '150 g plakjes ham' |
| aldi | 150 g plakjes ham | Ham-kaas knabbels 150 g €0,85 | Ham-kaas knabbels 150 g past niet bij '150 g plakjes ham' |
| spar | 2 vegaburgers | Hamburger 12 stuks €2,69 | Hamburger 12 stuks past niet bij '2 vegaburgers' |
| plus | 200 g vegetarische kipstukjes | PLUS Boerentrots Kipstukjes 300 g €3,99 | PLUS Boerentrots Kipstukjes 300 g past niet bij '200 g vegetarische kipstukjes' |
| poiesz | 1 blik kikkererwten | Unox Soep Erwt 300 milliliter €2,15 | Unox Soep Erwt 300 milliliter past niet bij '1 blik kikkererwten' |
| poiesz | 1 blik kidneybonen | Iglo Ping & Klaar Gegrilde Kipfilet, rösti en sperziebonen 390 gram €6,67 | Iglo Ping & Klaar Gegrilde Kipfilet, rösti en sperziebonen 390 gram past niet bij '1 blik kidneybonen' |
| poiesz | 1 blik zwarte bonen | Iglo Ping & Klaar Gegrilde Kipfilet, rösti en sperziebonen 390 gram €6,67 | Iglo Ping & Klaar Gegrilde Kipfilet, rösti en sperziebonen 390 gram past niet bij '1 blik zwarte bonen' |
| poiesz | 1 blik bruine bonen | Unox Stevige Bruine bonensoep 800 milliliter €4,35 | Unox Stevige Bruine bonensoep 800 milliliter past niet bij '1 blik bruine bonen' |
| poiesz | 1 blik witte bonen | Iglo Ping & Klaar Gegrilde Kipfilet, rösti en sperziebonen 390 gram €6,67 | Iglo Ping & Klaar Gegrilde Kipfilet, rösti en sperziebonen 390 gram past niet bij '1 blik witte bonen' |
| ah | 200 g zure room | AH Kersenflappen met room 4 stuks €4,49 | AH Kersenflappen met room 4 stuks past niet bij '200 g zure room' |
| poiesz | 200 g zure room | Alpro Cuisine Variatie op Room 0.25 liter €1,98 | Alpro Cuisine Variatie op Room 0.25 liter past niet bij '200 g zure room' |
| aldi | 200 g zure room | Room saus 129 g €1,49 | Room saus 129 g past niet bij '200 g zure room' |
| lidl | 250 g roomboter | Roomboter spritsen €1,19 | Roomboter spritsen past niet bij '250 g roomboter' |
| poiesz | 250 g margarine | Odorex Marine Fresh 50 milliliter €2,89 | Odorex Marine Fresh 50 milliliter past niet bij '250 g margarine' |
| ah | 100 g Parmezaanse kaas | AH Truffelsalami met Parmezaanse kaas 60 g €3,29 | AH Truffelsalami met Parmezaanse kaas 60 g past niet bij '100 g Parmezaanse kaas' |
| dekamarkt | 100 g Parmezaanse kaas | Zuivelmeester Kaas 30+ geraspt 200 g €2,09 | Zuivelmeester Kaas 30+ geraspt 200 g past niet bij '100 g Parmezaanse kaas' |
| dirk | 100 g Parmezaanse kaas | 1 de Beste Crackers kaas 200 g €1,65 | 1 de Beste Crackers kaas 200 g past niet bij '100 g Parmezaanse kaas' |
| hoogvliet | 100 g Parmezaanse kaas | Daily Chef Pasta parmezaanse kaas en truffel 250 g €2,99 | Daily Chef Pasta parmezaanse kaas en truffel 250 g past niet bij '100 g Parmezaanse kaas' |
| poiesz | 100 g Parmezaanse kaas | Eru Cheddar 150 gram €2,00 | Eru Cheddar 150 gram past niet bij '100 g Parmezaanse kaas' |
| vomar | 100 g Parmezaanse kaas | Kaas Croissant stuk €0,98 | Kaas Croissant stuk past niet bij '100 g Parmezaanse kaas' |
| aldi | 100 g Parmezaanse kaas | Truffelsalami met Parmezaanse kaas 70 g €2,99 | Truffelsalami met Parmezaanse kaas 70 g past niet bij '100 g Parmezaanse kaas' |
| plus | 200 g feta | PLUS Borek spinazie feta 1 st €1,19 | PLUS Borek spinazie feta 1 st past niet bij '200 g feta' |
| vomar | 200 g feta | Feta-avocadodip 110 gram €1,99 | Feta-avocadodip 110 gram past niet bij '200 g feta' |
| dekamarkt | 100 g blauwe kaas | Zuivelmeester Kaas 30+ geraspt 200 g €2,09 | Zuivelmeester Kaas 30+ geraspt 200 g past niet bij '100 g blauwe kaas' |
| dirk | 100 g blauwe kaas | 1 de Beste Crackers kaas 200 g €1,65 | 1 de Beste Crackers kaas 200 g past niet bij '100 g blauwe kaas' |
| hoogvliet | 100 g blauwe kaas | Zuivelmeester Belegen stuk 940 g €8,45 | Zuivelmeester Belegen stuk 940 gram past niet bij '100 g blauwe kaas' |
| plus | 100 g blauwe kaas | PLUS Cheddar 125 g €2,69 | PLUS Cheddar 125 g past niet bij '100 g blauwe kaas' |
| poiesz | 100 g blauwe kaas | Eru Cheddar 150 gram €2,00 | Eru Cheddar 150 gram past niet bij '100 g blauwe kaas' |
| vomar | 100 g blauwe kaas | Kaas Croissant stuk €0,98 | Kaas Croissant stuk past niet bij '100 g blauwe kaas' |
| vomar | 1 volkorenbrood | Rozijnenbrood 500 gram €1,95 | Rozijnenbrood 500 gram past niet bij '1 volkorenbrood' |
| dekamarkt | 6 krentenbollen | Vetbollen 6 stuks stuk €0,99 | Vetbollen 6 stuks stuk past niet bij '6 krentenbollen' |
| dirk | 4 pitabroodjes | 1 de Beste Saucijzenbroodjes 4 stuks 280 g €1,47 | 1 de Beste Saucijzenbroodjes 4 stuks 280 g past niet bij '4 pitabroodjes' |
| poiesz | 4 pitabroodjes | Italiaanse bol afbakbroodjes 5 stuk €2,00 | Italiaanse bol afbakbroodjes 5 stuk past niet bij '4 pitabroodjes' |
| ah | 2 stokbroden | AH Knäckebröd goudbruin 375 g €1,25 | AH Knäckebröd goudbruin 375 g past niet bij '2 stokbroden' |
| dekamarkt | 2 stokbroden | Fjord Knäckebröd volkoren 250 g €0,99 | Fjord Knäckebröd volkoren 250 g past niet bij '2 stokbroden' |
| dirk | 2 stokbroden | 1 de Beste Knäckebröd sesam 375 g €1,18 | 1 de Beste Knäckebröd sesam 375 g past niet bij '2 stokbroden' |
| hoogvliet | 2 stokbroden | Wasa knäckebröd €1,98 | Wasa knäckebröd past niet bij '2 stokbroden' |
| jumbo | 2 stokbroden | Jumbo Knäckebröd Sesam 5 x 5 Stuks 375 g €1,19 | Jumbo Knäckebröd Sesam 5 x 5 Stuks 375 g past niet bij '2 stokbroden' |
| plus | 2 stokbroden | PLUS Knackebrod Volkoren 375 g €1,19 | PLUS Knackebrod Volkoren 375 g past niet bij '2 stokbroden' |
| spar | 2 stokbroden | Fjord Knackerbrod Volkoren 250 gram €1,19 | Fjord Knackerbrod Volkoren 250 gram past niet bij '2 stokbroden' |
| vomar | 2 stokbroden | Wasa Knackebrod 240 gram €3,75 | Wasa Knackebrod 240 gram past niet bij '2 stokbroden' |
| aldi | 2 stokbroden | Knäckebröd sesam inhoud: 25 stuks. 375 g €1,19 | Knäckebröd sesam inhoud: 25 stuks. 375 g past niet bij '2 stokbroden' |
| aldi | 1 pot jam | Gran reserva of jamón serrano 80-100 g €2,49 | Gran reserva of jamón serrano 80-100 g past niet bij '1 pot jam' |
| jumbo | 1 pot honing | Jumbo Honing Pomelo €1,99 | Jumbo Honing Pomelo past niet bij '1 pot honing' |
| poiesz | 1 pot honing | Elephant Pretzel honing-mosterd 70 gram €1,00 | Elephant Pretzel honing-mosterd 70 gram past niet bij '1 pot honing' |
| hoogvliet | 1 pak muesli | Melkan Bifidusyoghurt muesli 530 g €1,89 | Melkan Bifidusyoghurt muesli 530 g past niet bij '1 pak muesli' |
| poiesz | 1 pak muesli | Activia Yoghurt Muesli 500 gram €3,09 | Activia Yoghurt Muesli 500 gram past niet bij '1 pak muesli' |
| spar | 1 pak muesli | Activia yoghurt muesli 4 stuks €3,39 | Activia yoghurt muesli 4 stuks past niet bij '1 pak muesli' |
| poiesz | 1 pak crackers | Snickers Gold ice cream caramel 204 gram €4,49 | Snickers Gold ice cream caramel 204 gram past niet bij '1 pak crackers' |
| poiesz | 500 g spaghetti | Golden Fresh Spaghetti Bolognese 1000 gram €4,99 | Golden Fresh Spaghetti Bolognese 1000 gram past niet bij '500 g spaghetti' |
| poiesz | 400 g basmatirijst | Koh Thai Rijst Vermicelli 100 gram €1,69 | Koh Thai Rijst Vermicelli 100 gram past niet bij '400 g basmatirijst' |
| poiesz | 1 kg zilvervliesrijst | Koh Thai Rijst Vermicelli 100 gram €1,69 | Koh Thai Rijst Vermicelli 100 gram past niet bij '1 kg zilvervliesrijst' |
| poiesz | 300 g risottorijst | Koh Thai Rijst Vermicelli 100 gram €1,69 | Koh Thai Rijst Vermicelli 100 gram past niet bij '300 g risottorijst' |
| aldi | 300 g risottorijst | Zilvervliesrijst 1 kg €0,94 | Zilvervliesrijst 1 kg past niet bij '300 g risottorijst' |
| poiesz | 250 g mie | HG Mierenlokdoos voor binnen en / of buiten 2 stuks €9,09 | HG Mierenlokdoos voor binnen en / of buiten 2 stuks past niet bij '250 g mie' |
| poiesz | 250 g noedels | Yum Yum Instant Noedels Garnalen 60 gram €0,69 | Yum Yum Instant Noedels Garnalen 60 gram past niet bij '250 g noedels' |
| dekamarkt | 1 pak tacoschelpen | Jos Poell Suikerschelpen 6 stuks €2,45 | Jos Poell Suikerschelpen 6 stuks past niet bij '1 pak tacoschelpen' |
| ah | 1 zakje tacokruiden | AH Paneermeel kruiden 150 g €0,79 | AH Paneermeel kruiden 150 g past niet bij '1 zakje tacokruiden' |
| dekamarkt | 1 zakje tacokruiden | Silvo Patatkruiden 83 g €2,79 | Silvo Patatkruiden 83 g past niet bij '1 zakje tacokruiden' |
| dirk | 1 zakje tacokruiden | 1 de Beste Paneermeel kruiden 150 g €0,72 | 1 de Beste Paneermeel kruiden 150 g past niet bij '1 zakje tacokruiden' |
| hoogvliet | 1 zakje tacokruiden | Paturain Kruiden 90 g €1,87 | Paturain Kruiden 90 gram past niet bij '1 zakje tacokruiden' |
| jumbo | 1 zakje tacokruiden | Jumbo Kruiden Soepcroutons 75 g 75 g €0,79 | Jumbo Kruiden Soepcroutons 75 g 75 g past niet bij '1 zakje tacokruiden' |
| lidl | 1 zakje tacokruiden | Kerriekruiden 45 g €0,53 | Kerriekruiden 45 g past niet bij '1 zakje tacokruiden' |
| plus | 1 zakje tacokruiden | PLUS Kruiden paneermeel 150 g €0,85 | PLUS Kruiden paneermeel 150 g past niet bij '1 zakje tacokruiden' |
| poiesz | 1 zakje tacokruiden | Kaptein Smeerkaas Tuinkruiden 20+ 100 gram €1,29 | Kaptein Smeerkaas Tuinkruiden 20+ 100 gram past niet bij '1 zakje tacokruiden' |
| spar | 1 zakje tacokruiden | Verstegen inmaakkruiden 5 gram €1,95 | Verstegen inmaakkruiden 5 gram past niet bij '1 zakje tacokruiden' |
| vomar | 1 zakje tacokruiden | Gehaktkruiden 10 gram €0,19 | Gehaktkruiden 10 gram past niet bij '1 zakje tacokruiden' |
| aldi | 1 zakje tacokruiden | Italiaanse kruiden 18 g €0,66 | Italiaanse kruiden 18 g past niet bij '1 zakje tacokruiden' |
| ah | 1 zakje nasikruiden | AH Pangasiusfilet tuinkruiden ca. 310 g €5,49 | AH Pangasiusfilet tuinkruiden ca. 310 g past niet bij '1 zakje nasikruiden' |
| dekamarkt | 1 zakje nasikruiden | Silvo Eikruiden 62 g €2,79 | Silvo Eikruiden 62 g past niet bij '1 zakje nasikruiden' |
| dirk | 1 zakje nasikruiden | Pangasiusfilet tuinkruiden 2 st. 300 g €5,25 | Pangasiusfilet tuinkruiden 2 st. 300 g past niet bij '1 zakje nasikruiden' |
| hoogvliet | 1 zakje nasikruiden | Paturain Kruiden 90 g €1,87 | Paturain Kruiden 90 gram past niet bij '1 zakje nasikruiden' |
| lidl | 1 zakje nasikruiden | Kerriekruiden 45 g €0,53 | Kerriekruiden 45 g past niet bij '1 zakje nasikruiden' |
| poiesz | 1 zakje nasikruiden | Kaptein Smeerkaas Tuinkruiden 20+ 100 gram €1,29 | Kaptein Smeerkaas Tuinkruiden 20+ 100 gram past niet bij '1 zakje nasikruiden' |
| spar | 1 zakje nasikruiden | Verstegen inmaakkruiden 5 gram €1,95 | Verstegen inmaakkruiden 5 gram past niet bij '1 zakje nasikruiden' |
| vomar | 1 zakje nasikruiden | Gehaktkruiden 10 gram €0,19 | Gehaktkruiden 10 gram past niet bij '1 zakje nasikruiden' |
| aldi | 1 zakje nasikruiden | Italiaanse kruiden 18 g €0,66 | Italiaanse kruiden 18 g past niet bij '1 zakje nasikruiden' |
| hoogvliet | 150 ml teriyakisaus | Boon Zwarte bonen in teriyakisaus 200 g €1,23 | Boon Zwarte bonen in teriyakisaus 390 gram past niet bij '150 ml teriyakisaus' |
| jumbo | 150 ml teriyakisaus | Boon Zwarte Bonen in Teriyakisaus 200 g 200 g €1,19 | Boon Zwarte Bonen in Teriyakisaus 200 g 200 g past niet bij '150 ml teriyakisaus' |
| aldi | 150 ml teriyakisaus | Chilisaus 700 ml €1,49 | Chilisaus 700 ml past niet bij '150 ml teriyakisaus' |
| aldi | 150 ml sojasaus | Slasaus halfvol 500 ml €1,45 | Slasaus halfvol 500 ml past niet bij '150 ml sojasaus' |
| hoogvliet | 1 pot rode currypasta | Honig Pasta €1,95 | Honig Pasta past niet bij '1 pot rode currypasta' |
| plus | 1 pot rode currypasta | Smaakt Rode linzenpasta bio 200 g €3,49 | Smaakt Rode linzenpasta bio 200 g past niet bij '1 pot rode currypasta' |
| poiesz | 1 pot rode currypasta | Toko Lien Knoflookpasta 200 gram €2,29 | Toko Lien Knoflookpasta 200 gram past niet bij '1 pot rode currypasta' |
| vomar | 1 pot rode currypasta | Smaakt Rode Linzenpasta 200 gram €2,95 | Smaakt Rode Linzenpasta 200 gram past niet bij '1 pot rode currypasta' |
| aldi | 1 pot rode currypasta | Tandpasta 125 ml €0,62 | Tandpasta 125 ml past niet bij '1 pot rode currypasta' |
| hoogvliet | 150 g rijstvellen | Frikandellen 20 st €3,55 | Frikandellen 20 stuks past niet bij '150 g rijstvellen' |
| aldi | 150 g rijstvellen | Ovenfrikandellen inhoud: 5 stuks. 350 g €1,79 | Ovenfrikandellen inhoud: 5 stuks. 350 g past niet bij '150 g rijstvellen' |
| poiesz | 1 blik tomatenblokjes | Aanmaakblokjes Bruin 632 gram €2,69 | Aanmaakblokjes Bruin 632 gram past niet bij '1 blik tomatenblokjes' |
| poiesz | 1 blikje tomatenpuree | Verse aardappelpuree 500 gram €1,80 | Verse aardappelpuree 500 gram past niet bij '1 blikje tomatenpuree' |
| poiesz | 1 pot pastasaus | Yildriz Turkse Shoarmasaus 265 milliliter €2,64 | Yildriz Turkse Shoarmasaus 265 milliliter past niet bij '1 pot pastasaus' |
| ah | 1 blik mais | AH Terra Bonenmix maïs 200 g €1,19 | AH Terra Bonenmix maïs 200 g past niet bij '1 blik mais' |
| poiesz | 1 blik doperwten | Unox Soep Erwt 300 milliliter €2,15 | Unox Soep Erwt 300 milliliter past niet bij '1 blik doperwten' |
| poiesz | 1 pot kappertjes | Ambachtelijke Knappertjes 140 gram €1,87 | Ambachtelijke Knappertjes 140 gram past niet bij '1 pot kappertjes' |
| dekamarkt | 1 pot mosterd | DekaVers Kaasblokjes mosterd 100 g €2,29 | DekaVers Kaasblokjes mosterd 100 g past niet bij '1 pot mosterd' |
| jumbo | 1 fles ketchup | Zaanse Curry Ketchup 190ml €1,49 | Zaanse Curry Ketchup 190ml past niet bij '1 fles ketchup' |
| spar | 1 fles ketchup | Zaanse curry ketchup 190 ml 190 milliliter €1,69 | Zaanse curry ketchup 190 ml 190 milliliter past niet bij '1 fles ketchup' |
| aldi | 1 fles ketchup | Curry ketchup 875 ml €2,18 | Curry ketchup 875 ml past niet bij '1 fles ketchup' |
| ah | 1 pot mayonaise | AH Sriracha mayonaise 60 g €1,39 | AH Sriracha mayonaise 60 g past niet bij '1 pot mayonaise' |
| dekamarkt | 1 pot mayonaise | Saitaku Mayonaise wasabi 160 g €4,45 | Saitaku Mayonaise wasabi 160 g past niet bij '1 pot mayonaise' |
| vomar | 1 fles olijfolie | Vismarine Ansjovis Olijfolie 46 gram €1,99 | Vismarine Ansjovis Olijfolie 46 gram past niet bij '1 fles olijfolie' |
| dekamarkt | 1 fles zonnebloemolie | Pescamar Atun tonijn zonnebloemolie 240 g €3,95 | Pescamar Atun tonijn zonnebloemolie 240 g past niet bij '1 fles zonnebloemolie' |
| vomar | 2 el olijfolie | Vismarine Ansjovis Olijfolie 46 gram €1,99 | Vismarine Ansjovis Olijfolie 46 gram past niet bij '2 el olijfolie' |
| aldi | 1 el sesamolie | Zonnebloemolie 1 l €1,18 | Zonnebloemolie 1 l past niet bij '1 el sesamolie' |
| aldi | 1 fles azijn | Schoonmaakazijn 1 l €0,49 | Schoonmaakazijn 1 l past niet bij '1 fles azijn' |
| dekamarkt | 1 kg bloem | G'woon Allesreinigerdoekjes bloemen 80 stuks €0,86 | G'woon Allesreinigerdoekjes bloemen 80 stuks past niet bij '1 kg bloem' |
| poiesz | 1 kg bloem | Allesreinigersdoekjes bloemen 80 stuks €1,25 | Allesreinigersdoekjes bloemen 80 stuks past niet bij '1 kg bloem' |
| poiesz | 1 pak poedersuiker | g'woon Koekrepen 30% minder suiker 300 gram €1,87 | g'woon Koekrepen 30% minder suiker 300 gram past niet bij '1 pak poedersuiker' |
| poiesz | 1 zakje bakpoeder | Ecostyle stekpoeder 400 milliliter €5,99 | Ecostyle stekpoeder 400 milliliter past niet bij '1 zakje bakpoeder' |
| vomar | 1 zakje bakpoeder | G'woon Knoflookpoeder 48 gram €0,58 | G'woon Knoflookpoeder 48 gram past niet bij '1 zakje bakpoeder' |
| poiesz | 1 pakje bouillonblokjes | Aanmaakblokjes Bruin 632 gram €2,69 | Aanmaakblokjes Bruin 632 gram past niet bij '1 pakje bouillonblokjes' |
| poiesz | 200 g walnoten | Epixs borrelnoten crunch 275 gram €1,99 | Epixs borrelnoten crunch 275 gram past niet bij '200 g walnoten' |
| poiesz | 200 g cashewnoten | Ambachtelijke Kruidnoten 300 gram €2,00 | Ambachtelijke Kruidnoten 300 gram past niet bij '200 g cashewnoten' |
| jumbo | 1 zak rozijnen | Jumbo - Rozijnen Krentenbollen - 6 Stuks €1,48 | Jumbo - Rozijnen Krentenbollen - 6 Stuks past niet bij '1 zak rozijnen' |
| poiesz | 1 zak rozijnen | g'woon Koekrepen Rozijn 390 gram €1,42 | g'woon Koekrepen Rozijn 390 gram past niet bij '1 zak rozijnen' |
| poiesz | 1 blik ananas | Ananas-Meloen-Mangosap 500 milliliter €2,69 | Ananas-Meloen-Mangosap 500 milliliter past niet bij '1 blik ananas' |
| poiesz | 1 tl paprikapoeder | Ecostyle stekpoeder 400 milliliter €5,99 | Ecostyle stekpoeder 400 milliliter past niet bij '1 tl paprikapoeder' |
| dekamarkt | 1 tl komijn | DekaVers Kaasblokjes komijn 100 g €2,29 | DekaVers Kaasblokjes komijn 100 g past niet bij '1 tl komijn' |
| hoogvliet | 1 tl komijn | Hoogvliet Kaasblokjes komijn 100 g €2,29 | Hoogvliet Kaasblokjes komijn 100 g past niet bij '1 tl komijn' |
| poiesz | 1 tl komijn | Kaptein Smeerkaas Komijn 20+ 100 gram €1,29 | Kaptein Smeerkaas Komijn 20+ 100 gram past niet bij '1 tl komijn' |
| spar | 1 tl komijn | Melkan Kaas Komijn jong belegen plakken 190 gram €3,59 | Melkan Kaas Komijn jong belegen plakken 190 gram past niet bij '1 tl komijn' |
| vomar | 1 tl komijn | Kaasblokjes Belegen Komijn 100 gram €2,15 | Kaasblokjes Belegen Komijn 100 gram past niet bij '1 tl komijn' |
| aldi | 1 tl komijn | Goudse kaas Toscaanse kruiden of komijn 30+ plakken inhoud: ca. 7 plakken. 200 g €2,85 | Goudse kaas Toscaanse kruiden of komijn 30+ plakken 200 g past niet bij '1 tl komijn' |
| jumbo | 1 tl kerriepoeder | Jumbo Uienpoeder 30 g 30 g €1,79 | Jumbo Uienpoeder 30 g 30 g past niet bij '1 tl kerriepoeder' |
| lidl | 1 tl kerriepoeder | Paprikapoeder 50 g €0,76 | Paprikapoeder 50 g past niet bij '1 tl kerriepoeder' |
| poiesz | 1 tl kerriepoeder | Ecostyle stekpoeder 400 milliliter €5,99 | Ecostyle stekpoeder 400 milliliter past niet bij '1 tl kerriepoeder' |
| aldi | 1 tl kerriepoeder | Creatinepoeder 300 g €4,99 | Creatinepoeder 300 g past niet bij '1 tl kerriepoeder' |
| poiesz | 1 tl kaneel | Appel kaneel vlaai 1 stuk €6,99 | Appel kaneel vlaai 1 stuk past niet bij '1 tl kaneel' |
| spar | 1 tl kaneel | Hak Appelmoes Kaneel 355 gram €2,75 | Hak Appelmoes Kaneel 355 gram past niet bij '1 tl kaneel' |
| poiesz | 1 tl Italiaanse kruiden | Krieltjes met groene kruiden 450 gram €2,50 | Krieltjes met groene kruiden 450 gram past niet bij '1 tl Italiaanse kruiden' |
| aldi | 1 tl chilivlokken | Sokken 2-pack 2-pack €1,99 | Sokken 2-pack 2-pack past niet bij '1 tl chilivlokken' |
| dekamarkt | 1 tl gemberpoeder | Mentholpoeder 75 g €3,95 | Mentholpoeder 75 g past niet bij '1 tl gemberpoeder' |
| dirk | 1 tl gemberpoeder | 1 de Beste Kaneelpoeder 40 g €0,55 | 1 de Beste Kaneelpoeder 40 g past niet bij '1 tl gemberpoeder' |
| hoogvliet | 1 tl gemberpoeder | G'woon Witte peperpoeder 50 g €0,87 | G'woon Witte peperpoeder 50 g past niet bij '1 tl gemberpoeder' |
| jumbo | 1 tl gemberpoeder | Jumbo Uienpoeder 30 g 30 g €1,79 | Jumbo Uienpoeder 30 g 30 g past niet bij '1 tl gemberpoeder' |
| lidl | 1 tl gemberpoeder | Glitterpoeder €2,99 | Glitterpoeder past niet bij '1 tl gemberpoeder' |
| plus | 1 tl gemberpoeder | PLUS Kaneelpoeder 40 g €0,55 | PLUS Kaneelpoeder 40 g past niet bij '1 tl gemberpoeder' |
| poiesz | 1 tl gemberpoeder | Ecostyle stekpoeder 400 milliliter €5,99 | Ecostyle stekpoeder 400 milliliter past niet bij '1 tl gemberpoeder' |
| spar | 1 tl gemberpoeder | Verstegen uienpoeder 50 gram €3,45 | Verstegen uienpoeder 50 gram past niet bij '1 tl gemberpoeder' |
| vomar | 1 tl gemberpoeder | G'woon Knoflookpoeder 48 gram €0,58 | G'woon Knoflookpoeder 48 gram past niet bij '1 tl gemberpoeder' |
| aldi | 1 tl gemberpoeder | Chilipoeder 50 g €0,75 | Chilipoeder 50 g past niet bij '1 tl gemberpoeder' |
| poiesz | peper | Partjes peper - zeezout 450 gram €2,50 | Partjes peper - zeezout 450 gram past niet bij 'peper' |
| spar | peper | rode pepers 2 stuks €1,25 | rode pepers 2 stuks past niet bij 'peper' |
| vomar | peper | Rode Pepers 2 stuks €0,89 | Rode Pepers 2 stuks past niet bij 'peper' |
| lidl | 1 tl knoflookpoeder | Salmiakpoeder €1,99 | Salmiakpoeder past niet bij '1 tl knoflookpoeder' |
| poiesz | 1 tl knoflookpoeder | Ecostyle stekpoeder 400 milliliter €5,99 | Ecostyle stekpoeder 400 milliliter past niet bij '1 tl knoflookpoeder' |
| aldi | 1 tl knoflookpoeder | Chilipoeder 50 g €0,75 | Chilipoeder 50 g past niet bij '1 tl knoflookpoeder' |
| dekamarkt | 6 flessen water | Gedemineraliseerd water 1 liter €0,84 | Gedemineraliseerd water 1 liter past niet bij '6 flessen water' |
| dirk | 6 flessen water | Gedemineraliseerd water 1 liter €0,68 | Gedemineraliseerd water 1 liter past niet bij '6 flessen water' |
| vomar | 6 flessen water | Loda Gedemineraliseerd Water 1000 ml €0,68 | Loda Gedemineraliseerd Water 1000 ml past niet bij '6 flessen water' |
| jumbo | 1 pak toiletpapier | Jumbo Sensitive Vochtig Toiletpapier 40 Stuks €0,89 | Jumbo Sensitive Vochtig Toiletpapier 40 Stuks past niet bij '1 pak toiletpapier' |
| poiesz | 1 pak toiletpapier | Inpakpapier 200*70cm 1 stuks €1,00 | Inpakpapier 200*70cm 1 stuks past niet bij '1 pak toiletpapier' |
| aldi | 1 pak toiletpapier | Vochtig toiletpapier 80 doekjes €0,99 | Vochtig toiletpapier 80 doekjes past niet bij '1 pak toiletpapier' |
| poiesz | 1 rol keukenpapier | Inpakpapier 200*70cm 1 stuks €1,00 | Inpakpapier 200*70cm 1 stuks past niet bij '1 rol keukenpapier' |
| poiesz | 1 pak vuilniszakken | Ovengebakken gehakt 100 gram €2,29 | Ovengebakken gehakt 100 gram past niet bij '1 pak vuilniszakken' |
| dirk | 1 rol aluminiumfolie | 1 de Beste Olijfolie traditioneel 250 ml €2,99 | 1 de Beste Olijfolie traditioneel 250 ml past niet bij '1 rol aluminiumfolie' |
| poiesz | 1 rol aluminiumfolie | g'woon Olijfolie Traditioneel 250 milliliter €3,49 | g'woon Olijfolie Traditioneel 250 milliliter past niet bij '1 rol aluminiumfolie' |

## Datacontrole aanbiedingen

- dubbel met andere prijs: 86
- geen prijs en geen korting: 1

| winkel | aanbieding | actie | geldig | melding |
|---|---|---|---|---|
| ah | Whole earth Crunchy pindakaas | 50% korting €2,44 (was €4,88) | 2026-11-25 t/m 2026-11-29 | dubbel met andere prijs |
| ah | Hero Mighty patch invisible+ | 25% korting €14,99 (was €19,99) | 2026-11-25 t/m 2026-11-29 | dubbel met andere prijs |
| ah | Etos Maxi+ soft & protect luiers maat 4+ | 1+1 gratis €5,00 (was €9,99) | 2026-11-25 t/m 2026-11-29 | dubbel met andere prijs |
| ah | Jacob Hooy Essentiele olie lavendel | 2e halve prijs €5,24 (was €6,99) | 2026-11-25 t/m 2026-11-29 | dubbel met andere prijs |
| ah | Grolsch Cal 6-pack | 25% korting €3,74 (was €4,99) | 2026-11-25 t/m 2026-11-29 | dubbel met andere prijs |
| ah | Ariel 4in1 pods+ active wasmiddelcapsules | 1+2 gratis €5,53 (was €16,59) | 2026-11-25 t/m 2026-11-29 | dubbel met andere prijs |
| ah | Hertog Jan Weizener 6-pack | 25% korting €7,49 (was €9,99) | 2026-11-25 t/m 2026-11-29 | dubbel met andere prijs |
| ah | Whole earth Smooth pindakaas | 50% korting €1,74 (was €3,48) | 2026-11-25 t/m 2026-11-29 | dubbel met andere prijs |
| ah | Etos Junior soft & protect luiers maat 5 | 1+1 gratis €5,00 (was €9,99) | 2026-11-25 t/m 2026-11-29 | dubbel met andere prijs |
| ah | Supradyn Complex forte bruis multivitamine | 1+1 gratis €5,39 (was €10,79) | 2026-11-25 t/m 2026-11-29 | dubbel met andere prijs |
| ah | Leffe Blond abdijbier 6-pack | 25% korting €7,49 (was €9,99) | 2026-11-25 t/m 2026-11-29 | dubbel met andere prijs |
| ah | Dreft Platinum plus vaatwastabletten original | 1+2 gratis €6,33 (was €18,99) | 2026-11-25 t/m 2026-11-29 | dubbel met andere prijs |
| jumbo | Lenor Geurbooster 240g | 1+1 gratis €6,00 (was €11,99) | 2026-11-25 t/m 2026-12-01 | dubbel met andere prijs |
| aldi | Gevulde speculaas | voor 2,99 €2,99 | 2026-11-25 t/m 2026-11-29 | dubbel met andere prijs |
| aldi | Kipgehakt | voor 2,99 €2,99 | 2026-11-25 t/m 2026-11-29 | dubbel met andere prijs |
| aldi | Mandarijnen | 26% KORTING €1,69 (was €2,28) | 2026-11-25 t/m 2026-11-29 | dubbel met andere prijs |
| aldi | Kipgehakt | 50% korting € 3,00 €2,69 (was €5,38) | 2026-11-25 t/m 2026-11-29 | dubbel met andere prijs |
| aldi | Gourmet Fuet | voor 2,99 €2,99 | 2026-11-25 t/m 2026-11-29 | dubbel met andere prijs |
| aldi | Gevulde speculaas | voor 1,19 €1,19 | 2026-11-25 t/m 2026-11-29 | dubbel met andere prijs |
| aldi | Sinterklaas-crèmekoekjes | -15% €1,69 | 2026-11-25 t/m 2026-11-29 | dubbel met andere prijs |
| aldi | Kipfilet | voor 0,99 €0,99 | 2026-11-25 t/m 2026-11-29 | dubbel met andere prijs |
| dirk | LocknLock vershouddoos | voor 0,99 €0,99 | 2026-11-25 t/m 2026-12-01 | dubbel met andere prijs |
| dirk | LocknLock vershouddoos | voor 1,49 €1,49 | 2026-11-25 t/m 2026-12-01 | dubbel met andere prijs |
| dirk | LocknLock vershouddoos | voor 2,49 €2,49 | 2026-11-25 t/m 2026-12-01 | dubbel met andere prijs |
| plus | Grolsch Herfstbok fles | voor 5,77 €5,77 | 2026-11-25 t/m 2026-12-01 | dubbel met andere prijs |
| plus | Green Grüner Veltliner | voor 29,94 €29,94 | 2026-11-25 t/m 2026-11-30 | dubbel met andere prijs |
| plus | Lenor Collection Geurparels Zeebries | 1+2 gratis €2,66 (was €7,99) | 2026-11-25 t/m 2026-12-01 | dubbel met andere prijs |
| plus | PLUS Boerentrots Runderstooflappen | voor 8,98 €8,98 | 2026-11-25 t/m 2026-12-01 | dubbel met andere prijs |
| plus | PLUS Boerentrots Runderstooflappen | voor 14,00 €14,00 | 2026-11-25 t/m 2026-12-01 | dubbel met andere prijs |
| plus | La Trappe Trappist Blond | voor 1,43 €1,43 | 2026-11-25 t/m 2026-12-01 | dubbel met andere prijs |
| plus | Honey Drop Chardonnay | voor 7,99 €7,99 | 2026-12-01 t/m 2026-12-07 | dubbel met andere prijs |
| plus | Stoney Creek Rosé | voor 20,94 €20,94 | 2026-11-25 t/m 2026-12-01 | dubbel met andere prijs |
| plus | Beemster Belegen 48+ stuk | voor 6,26 €6,26 | 2026-11-25 t/m 2026-12-01 | dubbel met andere prijs |
| plus | Beemster Jong belegen 48+ stuk | voor 6,60 €6,60 | 2026-11-25 t/m 2026-12-01 | dubbel met andere prijs |
| plus | Extra Strawberry | voor 2,09 €2,09 | 2026-11-25 t/m 2026-12-01 | dubbel met andere prijs |
| plus | Extra Bubblemint | voor 2,79 €2,79 | 2026-11-25 t/m 2026-12-01 | dubbel met andere prijs |
| plus | Robijn Klein & Krachtig classics stralend wit | 1+2 gratis €11,50 (was €34,49) | 2026-11-25 t/m 2026-12-01 | dubbel met andere prijs |
| plus | Grolsch Goud Blond 0.0% | voor 0,92 €0,92 | 2026-11-25 t/m 2026-12-01 | dubbel met andere prijs |
| plus | Andrélon Shampoo Extra Glans | voor 6,28 €6,28 | 2026-11-25 t/m 2026-12-01 | dubbel met andere prijs |
| plus | Villa Maria Private Bin Sauvignon Blanc | voor 47,94 €47,94 | 2026-11-25 t/m 2026-12-01 | dubbel met andere prijs |
| plus | Villa Mondi Amarone di Valpolicella docg | voor 16,99 €16,99 | 2026-11-25 t/m 2026-12-01 | dubbel met andere prijs |
| plus | Andrés Alonso Verdejo-Albariño 2025 | voor 41,94 €41,94 | 2026-11-25 t/m 2026-12-01 | dubbel met andere prijs |
| plus | PLUS Kruidnoten naturel | voor 1,49 €1,49 | 2026-11-25 t/m 2026-12-01 | dubbel met andere prijs |
| plus | Heineken Premium pilsener bier | voor 6,59 €6,59 | 2026-11-25 t/m 2026-12-01 | dubbel met andere prijs |
| plus | Creamstone Buttery Chardonnay | voor 5,99 €5,99 | 2026-11-25 t/m 2026-12-01 | dubbel met andere prijs |
| plus | Andrélon Shampoo Oil & Care | voor 2,76 €2,76 | 2026-11-25 t/m 2026-12-01 | dubbel met andere prijs |
| plus | Andrélon Shampoo 2in1 | 50% korting € 3,00 €4,24 (was €8,48) | 2026-11-25 t/m 2026-12-01 | dubbel met andere prijs |
| plus | PLUS Mini saucijzenbroodjes | voor 1,69 €1,69 | 2026-11-25 t/m 2026-12-01 | dubbel met andere prijs |
| plus | Affligem Dubbel 0.0% | 1+1 gratis €3,79 (was €7,59) | 2026-11-25 t/m 2026-12-01 | dubbel met andere prijs |
| lidl | Floralys Toilet papier 4-laags | voor 9,90 €9,90 | 2026-11-25 t/m 2026-11-29 | dubbel met andere prijs |
| lidl | Cien Luminous Beauty | voor 3,99 €3,99 | 2026-11-25 t/m 2026-11-29 | dubbel met andere prijs |
| dekamarkt | Aquafresh | voor 2,35 €2,35 | 2026-11-25 t/m 2026-11-30 | dubbel met andere prijs |
| dekamarkt | Libresse of Tena | voor 5,38 €5,38 | 2026-11-25 t/m 2026-11-30 | dubbel met andere prijs |
| dekamarkt | Haribo Perziken, kindermix of starmix | voor 2,99 €2,99 | 2026-11-25 t/m 2026-11-30 | dubbel met andere prijs |
| dekamarkt | Princes tonijnstukken, tonijnmoot of haring | voor 2,99 €2,99 | 2026-11-25 t/m 2026-11-30 | dubbel met andere prijs |
| dekamarkt | Dreft handafwas of vaatwas, Swiffer of Ambi Pur | voor 2,89 €2,89 | 2026-11-25 t/m 2026-11-30 | dubbel met andere prijs |
| dekamarkt | Verstegen kruidenmix | voor 4,95 €4,95 | 2026-11-25 t/m 2026-11-30 | dubbel met andere prijs |
| dekamarkt | Remia saus | voor 2,99 €2,99 | 2026-11-25 t/m 2026-11-30 | dubbel met andere prijs |
| dekamarkt | Marcel's Green soap | voor 3,39 €3,39 | 2026-11-25 t/m 2026-11-30 | dubbel met andere prijs |
| dekamarkt | Robijn wasmiddel of wasverzachter | voor 6,39 €6,39 | 2026-11-25 t/m 2026-11-30 | dubbel met andere prijs |

… en nog 27.

## Verloop

| datum | aanbiedingen | fout | productkeuzes | fout | nieuw fout |
|---|---:|---:|---:|---:|---:|
| 2026-11-25 | 309 | 60 | 2618 | 263 | 0 |
