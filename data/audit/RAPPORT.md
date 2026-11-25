# Controlerapport Boodje

Controle van **2026-11-25**. Gemaakt door `tools/audit.cjs` en `tools/audit_report.cjs`; maatstaf in `tools/AUDIT.md`.

## Samenvatting

- **368 fouten** in deze controle, waarvan **368 nieuw** (62 bij aanbiedingen, 306 bij productkeuzes).
- Aanbiedingen: 309 getoond bij 246 controleregels, 62 fout (20%).
- Productkeuzes: 2485 gekozen, 306 fout (12%); 221 keer niets gevonden.
- Datacontrole aanbiedingen: 87 meldingen (87 bij aanbiedingen die nu in de app staan).

- Vaste prijzen mogelijk verouderd bij: **ah, dekamarkt, dirk, hoogvliet, lidl, plus, vomar** (zie Versheid).

## Versheid vaste prijzen

Folder = normale prijs die de folder noemt bij een aanbieding, vergeleken met de vaste prijs in de app voor precies dezelfde productnaam. Laatste wijziging = laatste peildatum waarop de bron voor die winkel nog iets veranderde (data/db/snapshots.tsv).

| winkel | vergeleken | wijkt af | laatste wijziging in bron |
|---|---:|---:|---|
| ah ⚠️ | 1240 | 790 (64%) | nooit sinds 2025-11-24 |
| aldi | 13 | 13 (100%) | 2026-11-25 |
| dekamarkt ⚠️ | 1 | 1 (100%) | nooit sinds 2025-11-24 |
| dirk ⚠️ | 8 | 7 (88%) | 2025-12-08 |
| hoogvliet ⚠️ | 144 | 121 (84%) | nooit sinds 2025-11-24 |
| jumbo | 897 | 14 (2%) | 2026-11-25 |
| lidl ⚠️ | 2 | 2 (100%) | 2026-08-24 |
| plus ⚠️ | 364 | 314 (86%) | nooit sinds 2025-11-24 |
| poiesz | 1 | 1 (100%) | 2026-11-25 |
| spar | 0 | – | 2026-11-25 |
| vomar ⚠️ | 0 | – | 2026-06-01 |

## Per winkel

| winkel | aanbiedingen getoond | fout | productkeuzes | fout |
|---|---:|---:|---:|---:|
| ah | 68 | 17 | 246 | 14 |
| aldi | 25 | 3 | 191 | 33 |
| dekamarkt | 14 | 0 | 246 | 21 |
| dirk | 27 | 4 | 246 | 19 |
| hoogvliet | 30 | 10 | 243 | 20 |
| jumbo | 37 | 8 | 246 | 20 |
| lidl | 17 | 1 | 243 | 14 |
| plus | 46 | 15 | 245 | 17 |
| poiesz | 24 | 2 | 183 | 73 |
| spar | 2 | 0 | 245 | 19 |
| vomar | 19 | 2 | 151 | 56 |

## Nieuwe fouten bij aanbiedingen

| winkel | regel | aanbieding | reden |
|---|---|---|---|
| plus | 500 g aardbeien | PLUS Donut Aardbei (2+3 gratis, €0,32) | donut, geen aardbeien |
| plus | 250 g noedels | Knorr Wereldgerecht Hokkien Noedels (2+3 gratis, €2,00) | maaltijdpakket, geen noedels |
| ah | 3 teentjes knoflook | Paturain Knoflook (1+1 gratis, €0,99) | Paturain knoflook is roomkaas |
| jumbo | 3 teentjes knoflook | Paolo Crostini Knoflook 150 g (1+1 gratis, €0,81) | crostini (snack), geen knoflook |
| jumbo | 1 mango | Stelz Mango 0.0% 250ML (1+1 gratis, €0,99) | drankje, geen mango |
| hoogvliet | 500 g gehakt | Verstegen kruidenmix voor gehakt (1 + 1 Gratis, €2,44) | kruidenmix, geen gehakt |
| aldi | 500 g gehakt | Kipgehakt (50% korting € 3,00, €2,69) | kipgehakt bij gewoon gehakt |
| jumbo | 200 g spekjes | Vivera Plantaardige Spekjes 175 g (1+1 gratis, €2,00) | plantaardige spekjes bij spekjes |
| jumbo | 200 g gyros | Vivera Plantaardige Gyros 175 g (1+1 gratis, €1,84) | plantaardige gyros bij gyros |
| jumbo | 100 g salami | Dr. Oetker Big Americans Filled Crust Triple Salami 489 g (1+1 gratis, €2,85) | pizza, geen salami |
| hoogvliet | 100 g filet americain | Kips Vega filet americain (1 + 1 Gratis, €1,02) | vega filet americain |
| hoogvliet | 500 g magere kwark | Optimel Magere Kwark Aardbei (1 + 1 Gratis, €1,12) | aardbeienkwark bij magere kwark naturel |
| jumbo | 200 g couscous | Verstegen World Spice Meal Couscous 50 g (1+1 gratis, €2,00) | kruidenmix, geen couscous |
| ah | 1 pot mosterd | Knorr Cup-a-soup mosterd (1+1 gratis, €1,07) | cup-a-soup, geen mosterd |
| ah | 1 tl kurkuma | Care Kurkuma & zwarte peper (1+1 gratis, €3,50) | supplement, geen kurkuma |
| jumbo | 1 bakje verse basilicum | Paolo Grissini Cruncy Basilicum en Knoflook 150 g (1+1 gratis, €0,82) | grissini, geen basilicum |
| ah | 1 pak thee | Care Groene thee (1+1 gratis, €2,50) | supplement, geen thee |
| plus | 1 pak toiletpapier | Page Vochtig toiletpapier puur 38 st (1+1 gratis, €1,15) | vochtig toiletpapier bij toiletpapier |
| poiesz | 1 fles wasmiddel | Dreft handafwasmiddel (1+1 GRATIS, €1,48) | handafwasmiddel bij wasmiddel |
| ah | 1 kg sinaasappel | LU Pim's sinaasappel (2+1 gratis, €2,13) | Pim's koekjes, geen sinaasappel |
| ah | 200 g gyros | Vivera Plantaardige gyros (2+1 gratis, €2,46) | plantaardige gyros bij gyros |
| plus | 1 tl komijn | Beemster 48+ Jong Belegen Komijn Plakken (2 voor 3.99, €2,00) | komijnekaas bij komijn (specerij) |
| plus | 1 limoen | Karvan Cévitam Refresh zero limoen & munt (2 voor 5.99, €3,00) | siroop, geen limoen |
| ah | 1 tl komijn | AH Biologisch Jong belegen komijn 50+ plakken (25% korting, €3,35) | komijnekaas bij komijn (specerij) |
| ah | 500 g aardbeien | Alpro Plantaardig variatie aardbei (2e halve prijs, €1,79) | Alpro plantaardige yoghurt, geen aardbeien |
| ah | 200 g spekjes | AH Terra Plantaardige spekjes (2e halve prijs, €1,39) | plantaardige spekjes bij spekjes |
| plus | 1 kg suiker | Verkade Originals San Francisco 0% suiker (2e halve prijs, €1,72) | koek, geen suiker |
| ah | 200 g amandelen | Alpro Barista amandel (2e halve prijs, €2,02) | amandeldrink, geen amandelen |
| ah | 500 g kipfilet | Streeckgenoten Gerookte kipfilet (25% korting, €2,77) | gerookte kipfilet (beleg) bij verse kipfilet |
| plus | 1 fles ketchup | Chio POM-BAR Ketchup (2 voor 2.99, €1,50) | chips, geen ketchup |
| ah | 1 courgette | AH Terra Pureersoep courgette (2 voor 7.00, €3,50) | pureersoep, geen courgette |
| ah | 1 tl oregano | AH Verse pureersoep tomaat oregano (2 voor 7.00, €3,50) | soep, geen oregano |
| ah | 1 ui | AH Verse pinsa spek ui (2 voor 10.00, €5,00) | pinsa met spek en ui is geen ui |
| ah | 200 g couscous | AH Slaverrijker couscous (3 voor 6.00, €2,00) | saladetopping, geen couscous |
| hoogvliet | 3 teentjes knoflook | Queens Pangalicious knoflook kruiden (voor 2,49, €2,49) | kruidenmix, geen knoflook |
| dirk | 4 tomaten | Heinz Tomaten gepeld (voor 0,89, €0,89) | tomaten uit blik bij verse tomaten |
| plus | 1 pompoen | De Kleine Keuken Bio knijpmix 6+ banaan pompoen (voor 1,12, €1,12) | babyknijpzakje, geen pompoen |
| hoogvliet | 1 bosje peterselie | Queens Pangalicious citroen peterselie (voor 2,49, €2,49) | kruidenmix, geen verse peterselie |
| hoogvliet | 1 kg appels | Handsinaasappels (voor 2,69, €2,69) | handsinaasappels zijn geen appels |
| vomar | 1 kg appels | Perssinaas-appelen (voor 1,99, €1,99) | perssinaasappelen zijn geen appels |
| plus | 500 g kipfilet | PLUS Puur van smaak Ovengebakken Kipfilet (voor 3,30, €3,30) | ovengebakken kipfilet (beleg) bij verse kipfilet |
| aldi | 500 g kipfilet | Kipfilet (voor 0,99, €0,99) | €0,99 voor kipfilet onwaarschijnlijk (waarschijnlijk per 100 g) |
| plus | 500 g gehakt | PLUS Plantaardig gehakt (voor 2,24, €2,24) | plantaardig gehakt bij gehakt |
| lidl | 200 g spekjes | Sint spekjes (voor 1,49, €1,49) | Sint-snoepgoed, geen spekjes |
| plus | 200 g spekjes | PLUS Plantaardige spekjes (voor 1,27, €1,27) | plantaardige spekjes bij spekjes |
| plus | 200 g gyros | PLUS Gesneden verspakket Pita Gyros (voor 5,49, €5,49) | groentepakket, geen gyrosvlees |
| dirk | 125 g mozzarella | Valess Tomaat mozzarella (voor 2,49, €2,49) | vega tomaat-mozzarellaschnitzel, geen mozzarella |
| hoogvliet | 125 g mozzarella | Wagner Fina mozzarella (voor 2,49, €2,49) | pizza, geen mozzarella |
| hoogvliet | 250 g tagliatelle | Verspakket tagliatelle (voor 4,49, €4,49) | groentepakket, geen tagliatelle |
| ah | 200 g bulgur | AH Bulgur witte kaas S (voor 2,99, €2,99) | bulgursalade, geen bulgur |
| poiesz | 1 pot pesto | Qizini panini prosciutto of kip pesto (voor 2,00, €2,00) | panini, geen pesto |
| hoogvliet | 1 pot mosterd | Knorr Cup a soup mosterd (voor 1,19, €1,19) | cup-a-soup, geen mosterd |
| ah | 1 kg suiker | AH Excellent Suikerspinsuiker, 200 g (voor 2,49, €2,49) | suikerspinsuiker 200 g bij gewone suiker |
| dirk | 1 tl komijn | Kroon van Holland Jong belegen komijn 48+ plakken (voor 1,99, €1,99) | komijnekaas bij komijn (specerij) |
| hoogvliet | 1 tl komijn | Milner 30+ Komijn Plakken (voor 1,99, €1,99) | komijnekaas bij komijn (specerij) |
| jumbo | 1 tl komijn | Milner Komijn Jong Belegen 30+ Kaas Plakken (voor 3,19, €3,19) | komijnekaas bij komijn (specerij) |
| dirk | 1 bakje verse basilicum | Daily Chef Raviolini provolone basilicum (voor 1,99, €1,99) | raviolini, geen basilicum |
| plus | zout | Klene Puur zout (voor 1,99, €1,99) | zoute drop, geen zout |
| aldi | peper | Gourmet Zoete pepers (voor 3,49, €3,49) | zoete pepers in pot, geen (zwarte) peper |
| plus | 1,5 l cola | Haribo Stixx cola (voor 1,69, €1,69) | snoep, geen cola |
| plus | 6 flessen water | Lipton en Sourcy Vitaminwater (voor 0,99, €0,99) | vitaminedrank, geen water |
| vomar | 6 flessen water | Royal Club of Sourcy Vitamin Water (voor 1,79, €1,79) | vitaminedrank, geen water |

## Nieuwe fouten bij productkeuzes

| winkel | regel | gekozen | reden |
|---|---|---|---|
| jumbo | 1 ui | Jumbo Jus Ui 18 g 18 g €0,39 | Jumbo Jus Ui 18 g 18 g past niet bij '1 ui' |
| poiesz | 1 bloemkool | Verspakket ovenschotel bloemkool 1040 gram €5,50 | Verspakket ovenschotel bloemkool 1040 gram past niet bij '1 bloemkool' |
| ah | 2 rode paprika | AH Gegrilde rode paprika 295 g €2,25 | AH Gegrilde rode paprika 295 g past niet bij '2 rode paprika' |
| dekamarkt | 2 rode paprika | Paolo Rode paprika geroosterd 450 g €3,49 | Paolo Rode paprika geroosterd 450 g past niet bij '2 rode paprika' |
| plus | 2 rode paprika | PLUS Geroosterde rode paprika 295 g €2,39 | PLUS Geroosterde rode paprika 295 g past niet bij '2 rode paprika' |
| spar | 2 rode paprika | Baktat gegrilde rode paprika 650 gram €3,99 | Baktat gegrilde rode paprika 650 gram past niet bij '2 rode paprika' |
| vomar | 2 rode paprika | Epixs ribbelchips paprika €1,59 | Epixs ribbelchips paprika past niet bij '2 rode paprika' |
| dirk | 1 groene paprika | Zonnatura Groentespread paprika 135 g €2,89 | Zonnatura Groentespread paprika 135 g past niet bij '1 groene paprika' |
| plus | 1 groene paprika | Zonnatura Groentespread paprika bio 135 g €2,99 | Zonnatura Groentespread paprika bio 135 g past niet bij '1 groene paprika' |
| spar | 1 groene paprika | Zonnatura groentespread paprika 135 gram €3,59 | Zonnatura groentespread paprika 135 gram past niet bij '1 groene paprika' |
| aldi | 1 groene paprika | Paprika- of naturelchips 50 g €0,50 | Paprika- of naturelchips 50 g past niet bij '1 groene paprika' |
| poiesz | 4 tomaten | Unox Soep Tomaten 300 milliliter €2,15 | Unox Soep Tomaten 300 milliliter past niet bij '4 tomaten' |
| jumbo | 250 g cherrytomaten | Heinz Pastasaus Zongerijpte Cherrytomaten & Basilicum 490g €3,79 | Heinz Pastasaus Zongerijpte Cherrytomaten & Basilicum 490g past niet bij '250 g cherrytomaten' |
| poiesz | 250 g cherrytomaten | Unox Soep Tomaten 300 milliliter €2,15 | Unox Soep Tomaten 300 milliliter past niet bij '250 g cherrytomaten' |
| poiesz | 250 g champignons | Unox Soep Champignon 800 milliliter €3,99 | Unox Soep Champignon 800 milliliter past niet bij '250 g champignons' |
| poiesz | 250 g kastanjechampignons | Unox Soep Champignon 800 milliliter €3,99 | Unox Soep Champignon 800 milliliter past niet bij '250 g kastanjechampignons' |
| vomar | 250 g kastanjechampignons | Cupasoup champignon €1,79 | Cupasoup champignon past niet bij '250 g kastanjechampignons' |
| ah | 1 bosje lente-uitjes | AH Gebakken uitjes 150 g €1,19 | AH Gebakken uitjes 150 g past niet bij '1 bosje lente-uitjes' |
| dekamarkt | 1 bosje lente-uitjes | Maggi Jus met uitjes 22 g €0,69 | Maggi Jus met uitjes 22 g past niet bij '1 bosje lente-uitjes' |
| dirk | 1 bosje lente-uitjes | 1 de Beste Amsterdamse uitjes 320 g €0,68 | 1 de Beste Amsterdamse uitjes 320 g past niet bij '1 bosje lente-uitjes' |
| hoogvliet | 1 bosje lente-uitjes | G'woon Amsterdamse uitjes 320 gram €0,69 | G'woon Amsterdamse uitjes 320 gram past niet bij '1 bosje lente-uitjes' |
| jumbo | 1 bosje lente-uitjes | Jumbo Gebakken Uitjes 150 g 150 g €1,49 | Jumbo Gebakken Uitjes 150 g 150 g past niet bij '1 bosje lente-uitjes' |
| lidl | 1 bosje lente-uitjes | Gehaktmix met uitjes €0,69 | Gehaktmix met uitjes past niet bij '1 bosje lente-uitjes' |
| plus | 1 bosje lente-uitjes | PLUS Gebakken uitjes 150 g €1,19 | PLUS Gebakken uitjes 150 g past niet bij '1 bosje lente-uitjes' |
| poiesz | 1 bosje lente-uitjes | g'woon Amsterdamse Uitjes 370 milliliter €0,81 | g'woon Amsterdamse Uitjes 370 milliliter past niet bij '1 bosje lente-uitjes' |
| spar | 1 bosje lente-uitjes | g'woon Amsterdamse uitjes 320 gram €0,95 | g'woon Amsterdamse uitjes 320 gram past niet bij '1 bosje lente-uitjes' |
| vomar | 1 bosje lente-uitjes | Maggi jus met uitjes 21,4gr 21.4gr €0,79 | Maggi jus met uitjes 21,4gr 21.4gr past niet bij '1 bosje lente-uitjes' |
| aldi | 1 bosje lente-uitjes | Zilveruitjes 320 g €0,65 | Zilveruitjes 320 g past niet bij '1 bosje lente-uitjes' |
| dekamarkt | 150 g peultjes | Krieltjes 500 g €0,99 | Krieltjes 500 g past niet bij '150 g peultjes' |
| dirk | 150 g peultjes | 1 de Beste Krieltjes 500 g €0,99 | 1 de Beste Krieltjes 500 g past niet bij '150 g peultjes' |
| hoogvliet | 150 g peultjes | Krieltjes 500 gram €1,09 | Krieltjes 500 gram past niet bij '150 g peultjes' |
| jumbo | 150 g peultjes | Jumbo Krieltjes 200 g 200 g €0,69 | Jumbo Krieltjes 200 g 200 g past niet bij '150 g peultjes' |
| lidl | 150 g peultjes | Kapperappeltjes 350 g €0,99 | Kapperappeltjes 350 g past niet bij '150 g peultjes' |
| poiesz | 150 g peultjes | Mini Krieltjes 200 gram €0,80 | Mini Krieltjes 200 gram past niet bij '150 g peultjes' |
| spar | 150 g peultjes | krieltjes 500 gram €1,25 | krieltjes 500 gram past niet bij '150 g peultjes' |
| aldi | 150 g peultjes | Krieltjes 500 g €0,99 | Krieltjes 500 g past niet bij '150 g peultjes' |
| hoogvliet | 1 rode peper | ERU Goudkuipje Peper 100 gram €1,79 | ERU Goudkuipje Peper 100 gram past niet bij '1 rode peper' |
| plus | 1 rode peper | PLUS Zwarte peper 50 g €0,75 | PLUS Zwarte peper 50 g past niet bij '1 rode peper' |
| poiesz | 1 rode peper | Partjes peper - zeezout 450 gram €2,50 | Partjes peper - zeezout 450 gram past niet bij '1 rode peper' |
| jumbo | 1 stukje gember | Jumbo Kruidenthee Gember 15 x 2,5 g 15 x 2.5 g €1,19 | Jumbo Kruidenthee Gember 15 x 2,5 g 15 x 2.5 g past niet bij '1 stukje gember' |
| poiesz | 1 stukje gember | Aardbei-Gember Shot 125 milliliter €1,29 | Aardbei-Gember Shot 125 milliliter past niet bij '1 stukje gember' |
| vomar | 1 bosje koriander | Aard anders knoflook 390gr 390gr €3,49 | Aard anders knoflook 390gr 390gr past niet bij '1 bosje koriander' |
| vomar | 1 zak spitskool | Thm houtskool 3kg 3kg €3,45 | Thm houtskool 3kg 3kg past niet bij '1 zak spitskool' |
| poiesz | 1 rodekool | Iglo Rode Kool met Appeltjes 450 gram €2,22 | Iglo Rode Kool met Appeltjes 450 gram past niet bij '1 rodekool' |
| poiesz | 2 bieten | Ambachtelijk Sap Bio Rode Biet 750 milliliter €3,49 | Ambachtelijk Sap Bio Rode Biet 750 milliliter past niet bij '2 bieten' |
| vomar | 2 bieten | Aviko oma's smulfrieten 750gr 750gr €2,75 | Aviko oma's smulfrieten 750gr 750gr past niet bij '2 bieten' |
| lidl | 6 bananen | Bananencake €2,99 | Bananencake past niet bij '6 bananen' |
| dekamarkt | 1 kg sinaasappel | Wicky Sinaasappel 6x20 cl 1.2 liter €1,95 | Wicky Sinaasappel 6x20 cl 1.2 liter past niet bij '1 kg sinaasappel' |
| dirk | 1 kg sinaasappel | Taksi Sinaasappel 10x20 cl 2 liter €1,89 | Taksi Sinaasappel 10x20 cl 2 liter past niet bij '1 kg sinaasappel' |
| jumbo | 1 kg sinaasappel | 1FRUIT Sinaasappel 200ml 200 ml €0,99 | 1FRUIT Sinaasappel 200ml 200 ml past niet bij '1 kg sinaasappel' |
| lidl | 1 kg sinaasappel | Sinaasappel 2L 2 l €2,59 | Sinaasappel 2L 2 l past niet bij '1 kg sinaasappel' |
| plus | 1 kg sinaasappel | PLUS Sinaasappel nectar 1500 ml €1,59 | PLUS Sinaasappel nectar 1500 ml past niet bij '1 kg sinaasappel' |
| poiesz | 1 kg sinaasappel | Appelsientje Fruitdrink Sinaasappel 1 liter €2,49 | Appelsientje Fruitdrink Sinaasappel 1 liter past niet bij '1 kg sinaasappel' |
| vomar | 2 citroenen | G'woon allesreiniger citroen €0,69 | G'woon allesreiniger citroen past niet bij '2 citroenen' |
| dekamarkt | 1 limoen | Optimel Drinkyoghurt limoen 1 liter €2,09 | Optimel Drinkyoghurt limoen 1 liter past niet bij '1 limoen' |
| dirk | 1 limoen | 1 de Beste Clear cranberry-limoen 1.5 liter €1,29 | 1 de Beste Clear cranberry-limoen 1.5 liter past niet bij '1 limoen' |
| plus | 1 limoen | Bacardi Limón 700 ml €20,99 | Bacardi Limón 700 ml past niet bij '1 limoen' |
| poiesz | 1 limoen | Optimel Drinkyoghurt limoen 0% vet 1000 milliliter €2,09 | Optimel Drinkyoghurt limoen 0% vet 1000 milliliter past niet bij '1 limoen' |
| spar | 1 limoen | Bacardi limon & lemonade blik 250 milliliter €2,85 | Bacardi limon & lemonade blik 250 milliliter past niet bij '1 limoen' |
| vomar | 1 limoen | Optimel drink limoen 1l 1l €2,15 | Optimel drink limoen 1l 1l past niet bij '1 limoen' |
| jumbo | 500 g aardbeien | Jumbo Aardbei Schepijs 1L 533 g €2,59 | Jumbo Aardbei Schepijs 1L 533 g past niet bij '500 g aardbeien' |
| poiesz | 125 g blauwe bessen | Activia Kefir bosbessmaak 0.28 kilogram €1,49 | Activia Kefir bosbessmaak 0.28 kilogram past niet bij '125 g blauwe bessen' |
| vomar | 125 g blauwe bessen | Fruti vr.wijn framb.bessen  1l 1l €3,85 | Fruti vr.wijn framb.bessen  1l 1l past niet bij '125 g blauwe bessen' |
| poiesz | 1 ananas | Ananas-Meloen-Mangosap 500 milliliter €2,69 | Ananas-Meloen-Mangosap 500 milliliter past niet bij '1 ananas' |
| hoogvliet | 2 peren | G'woon Fruitijsjes peren 12 stuks €1,69 | G'woon Fruitijsjes peren 12 stuks past niet bij '2 peren' |
| jumbo | 2 peren | Jumbo Peren Waterijsjes 12 Stuks 50 g €1,49 | Jumbo Peren Waterijsjes 12 Stuks 50 g past niet bij '2 peren' |
| poiesz | 2 peren | g'woon Peren Fruitijsjes 600 gram €1,58 | g'woon Peren Fruitijsjes 600 gram past niet bij '2 peren' |
| vomar | 1 granaatappel | Morgana appelen los €2,79 | Morgana appelen los past niet bij '1 granaatappel' |
| vomar | 1 meloen | Red bull watermelon 250ml st. 250ml €1,65 | Red bull watermelon 250ml st. 250ml past niet bij '1 meloen' |
| vomar | 500 g kipfilet | Slagers filet americain uien €2,99 | Slagers filet americain uien past niet bij '500 g kipfilet' |
| poiesz | 400 g kipdijfilet | Kalkoenfilet 100 gram €2,69 | Kalkoenfilet 100 gram past niet bij '400 g kipdijfilet' |
| vomar | 400 g kipdijfilet | Slagers filet americain uien €2,99 | Slagers filet americain uien past niet bij '400 g kipdijfilet' |
| hoogvliet | 4 kippendijen | Peijnenburg Ontbijtkoek parelkandij ongesneden 465 gram €2,55 | Peijnenburg Ontbijtkoek parelkandij ongesneden 465 gram past niet bij '4 kippendijen' |
| vomar | 4 kippendijen | Peijnenburg parelkandij 348gr 348gr €2,09 | Peijnenburg parelkandij 348gr 348gr past niet bij '4 kippendijen' |
| lidl | 300 g kipreepjes | Vega kipreepjes €2,99 | Vega kipreepjes past niet bij '300 g kipreepjes' |
| poiesz | 300 g kipreepjes | Aviko Maaltijdpannetje Roerbak Runderreepjes zak 450 gram €4,49 | Aviko Maaltijdpannetje Roerbak Runderreepjes zak 450 gram past niet bij '300 g kipreepjes' |
| poiesz | 1 hele kip | Unox Soep Kip 300 milliliter €2,15 | Unox Soep Kip 300 milliliter past niet bij '1 hele kip' |
| aldi | 1 hele kip | Kipreepjes 150 g €1,99 | Kipreepjes 150 g past niet bij '1 hele kip' |
| poiesz | 500 g rundergehakt | Italiaans Gehakt 500 gram €6,49 | Italiaans Gehakt 500 gram past niet bij '500 g rundergehakt' |
| poiesz | 4 hamburgers | Oliehoorn Hamburgersaus 270 milliliter €2,82 | Oliehoorn Hamburgersaus 270 milliliter past niet bij '4 hamburgers' |
| ah | 2 biefstukken | Statesman Tonijn stukken in water 160 g €1,35 | Statesman Tonijn stukken in water 160 g past niet bij '2 biefstukken' |
| dekamarkt | 2 biefstukken | G'woon Appelcompote met stukken 570 g €1,07 | G'woon Appelcompote met stukken 570 g past niet bij '2 biefstukken' |
| dirk | 2 biefstukken | Deepblue Inktvis stukken in olie met knoflook 111 g €2,29 | Deepblue Inktvis stukken in olie met knoflook 111 g past niet bij '2 biefstukken' |
| jumbo | 2 biefstukken | KoRo Gevriesdroogde Mangostukken 30g €3,99 | KoRo Gevriesdroogde Mangostukken 30g past niet bij '2 biefstukken' |
| lidl | 2 biefstukken | Ananasstukken 567 g €1,99 | Ananasstukken 567 g past niet bij '2 biefstukken' |
| spar | 2 biefstukken | Vos Banket Spritsstukken Roomboter 300 gram €4,95 | Vos Banket Spritsstukken Roomboter 300 gram past niet bij '2 biefstukken' |
| dirk | 500 g runderlappen | Vleeschmeesters Varkenslappen mager 5 st. 875 g €9,35 | Vleeschmeesters Varkenslappen mager 5 st. 875 g past niet bij '500 g runderlappen' |
| poiesz | 500 g runderlappen | Appelflappen 4 stuk €3,56 | Appelflappen 4 stuk past niet bij '500 g runderlappen' |
| spar | 500 g runderlappen | Spar hamlappen 2 stuks 300 gram €3,72 | Spar hamlappen 2 stuks 300 gram past niet bij '500 g runderlappen' |
| aldi | 500 g runderlappen | Verse hamlappen 500 g €4,99 | Verse hamlappen 500 g past niet bij '500 g runderlappen' |
| ah | 4 speklappen | AH Kersenflappen met room 4 stuks €4,49 | AH Kersenflappen met room 4 stuks past niet bij '4 speklappen' |
| dirk | 4 speklappen | Vleeschmeesters Varkenslappen mager 5 st. 875 g €9,35 | Vleeschmeesters Varkenslappen mager 5 st. 875 g past niet bij '4 speklappen' |
| poiesz | 4 speklappen | Appelflappen 4 stuk €3,56 | Appelflappen 4 stuk past niet bij '4 speklappen' |
| vomar | 4 speklappen | Csw ierse runderlappen 3st €10,19 | Csw ierse runderlappen 3st past niet bij '4 speklappen' |
| ah | 200 g spekjes | AH Terra Plantaardige spekjes 140 g €1,45 | AH Terra Plantaardige spekjes 140 g past niet bij '200 g spekjes' |
| plus | 200 g spekjes | PLUS Plantaardige spekjes 160 g €2,95 | PLUS Plantaardige spekjes 160 g past niet bij '200 g spekjes' |
| poiesz | 200 g spekjes | Aviko Aardappelspecialiteit Lachebekjes 450 gram €2,96 | Aviko Aardappelspecialiteit Lachebekjes 450 gram past niet bij '200 g spekjes' |
| aldi | 1 rookworst | Boterhamworst 150 g €1,36 | Boterhamworst 150 g past niet bij '1 rookworst' |
| vomar | 2 braadworsten | Unox geld. rookworst 285gr 285gr €3,69 | Unox geld. rookworst 285gr 285gr past niet bij '2 braadworsten' |
| aldi | 2 braadworsten | Slagersknakworsten 320 g €2,99 | Slagersknakworsten 320 g past niet bij '2 braadworsten' |
| vomar | 8 knakworsten | Unox magnetron rookworst 100gr 100gr €1,89 | Unox magnetron rookworst 100gr 100gr past niet bij '8 knakworsten' |
| vomar | 200 g gerookte zalm | Ovenschotel zalm  300gr 300gr €7,99 | Ovenschotel zalm  300gr 300gr past niet bij '200 g gerookte zalm' |
| hoogvliet | 2 zalmfilets | Gerookte zalmfilet 200 gram €5,99 | Gerookte zalmfilet 200 gram past niet bij '2 zalmfilets' |
| poiesz | 2 zalmfilets | Gerookte Atlantische Zalmfilet 200 gram €6,49 | Gerookte Atlantische Zalmfilet 200 gram past niet bij '2 zalmfilets' |
| spar | 2 zalmfilets | gerookte zalmfilet Atlantisch 200 gram €6,59 | gerookte zalmfilet Atlantisch 200 gram past niet bij '2 zalmfilets' |
| vomar | 2 zalmfilets | Slagers filet americain uien €2,99 | Slagers filet americain uien past niet bij '2 zalmfilets' |
| dekamarkt | 2 blikjes tonijn | Maaltijdsalade tonijn 450 g €3,95 | Maaltijdsalade tonijn 450 g past niet bij '2 blikjes tonijn' |
| dirk | 2 blikjes tonijn | 1 de Beste Salade tonijn 150 g €1,55 | 1 de Beste Salade tonijn 150 g past niet bij '2 blikjes tonijn' |
| vomar | 200 g kibbeling | Elvive cremespoeling color €3,29 | Elvive cremespoeling color past niet bij '200 g kibbeling' |
| vomar | 4 visstick | Organix veggie sticks 15gr bio 15gr €1,09 | Organix veggie sticks 15gr bio 15gr past niet bij '4 visstick' |
| jumbo | 200 g gerookte makreel | Minerva Makreel Pate 75 g 75 g €2,49 | Minerva Makreel Pate 75 g 75 g past niet bij '200 g gerookte makreel' |
| ah | 300 g shoarmavlees | AH Rundersoepvlees ca. 315 g €7,69 | AH Rundersoepvlees ca. 315 g past niet bij '300 g shoarmavlees' |
| dekamarkt | 300 g shoarmavlees | Smuldier Rundvlees 400 g €1,79 | Smuldier Rundvlees 400 g past niet bij '300 g shoarmavlees' |
| dirk | 300 g shoarmavlees | 1 de Beste Runderrookvlees 100 g €2,95 | 1 de Beste Runderrookvlees 100 g past niet bij '300 g shoarmavlees' |
| jumbo | 300 g shoarmavlees | Jumbo Runderrookvlees 100 g 100 g €2,69 | Jumbo Runderrookvlees 100 g 100 g past niet bij '300 g shoarmavlees' |
| lidl | 300 g shoarmavlees | Runderrookvlees €3,49 | Runderrookvlees past niet bij '300 g shoarmavlees' |
| poiesz | 300 g shoarmavlees | Appelsientje Sinaasappel Extra Vruchtvlees 1 liter €2,99 | Appelsientje Sinaasappel Extra Vruchtvlees 1 liter past niet bij '300 g shoarmavlees' |
| spar | 300 g shoarmavlees | Spar hacheevlees 500 gram €13,00 | Spar hacheevlees 500 gram past niet bij '300 g shoarmavlees' |
| vomar | 300 g shoarmavlees | Sum&sam boemboe rendang vlees €0,98 | Sum&sam boemboe rendang vlees past niet bij '300 g shoarmavlees' |
| aldi | 300 g shoarmavlees | Runderrookvlees 100 g €2,49 | Runderrookvlees 100 g past niet bij '300 g shoarmavlees' |
| hoogvliet | 200 g gyros | Verstegen Kruidenmix gyros 30 gram €1,46 | Verstegen Kruidenmix gyros 30 gram past niet bij '200 g gyros' |
| ah | 150 g plakjes ham | AH Smeerkaas ham 15+ 200 g €1,39 | AH Smeerkaas ham 15+ 200 g past niet bij '150 g plakjes ham' |
| dekamarkt | 150 g plakjes ham | Salade ham 150 g €2,29 | Salade ham 150 g past niet bij '150 g plakjes ham' |
| lidl | 150 g plakjes ham | Ham-kaashoorntje €0,99 | Ham-kaashoorntje past niet bij '150 g plakjes ham' |
| plus | 150 g plakjes ham | PLUS Ham-kaascroissant 1 st €0,89 | PLUS Ham-kaascroissant 1 st past niet bij '150 g plakjes ham' |
| aldi | 150 g plakjes ham | Ham-kaas knabbels 150 g €0,85 | Ham-kaas knabbels 150 g past niet bij '150 g plakjes ham' |
| spar | 2 vegaburgers | Hamburger 12 stuks €2,69 | Hamburger 12 stuks past niet bij '2 vegaburgers' |
| aldi | 2 vegaburgers | Scharrelkipburgers 200 g €2,79 | Scharrelkipburgers 200 g past niet bij '2 vegaburgers' |
| aldi | 200 g vegetarische kipstukjes | Pindakaas met stukjes pinda 600 g €1,99 | Pindakaas met stukjes pinda 600 g past niet bij '200 g vegetarische kipstukjes' |
| poiesz | 1 blik kikkererwten | Unox Soep Erwt 300 milliliter €2,15 | Unox Soep Erwt 300 milliliter past niet bij '1 blik kikkererwten' |
| vomar | 1 blik kikkererwten | Unox erwten soep  800ml 800ml €2,99 | Unox erwten soep  800ml 800ml past niet bij '1 blik kikkererwten' |
| poiesz | 1 blik kidneybonen | Iglo Ping & Klaar Gegrilde Kipfilet, rösti en sperziebonen 390 gram €6,67 | Iglo Ping & Klaar Gegrilde Kipfilet, rösti en sperziebonen 390 gram past niet bij '1 blik kidneybonen' |
| poiesz | 1 blik zwarte bonen | Iglo Ping & Klaar Gegrilde Kipfilet, rösti en sperziebonen 390 gram €6,67 | Iglo Ping & Klaar Gegrilde Kipfilet, rösti en sperziebonen 390 gram past niet bij '1 blik zwarte bonen' |
| vomar | 1 blik zwarte bonen | Unox bruine bonensoep 800ml 800ml €3,95 | Unox bruine bonensoep 800ml 800ml past niet bij '1 blik zwarte bonen' |
| poiesz | 1 blik bruine bonen | Unox Stevige Bruine bonensoep 800 milliliter €4,35 | Unox Stevige Bruine bonensoep 800 milliliter past niet bij '1 blik bruine bonen' |
| vomar | 1 blik bruine bonen | Unox bruine bonensoep 800ml 800ml €3,95 | Unox bruine bonensoep 800ml 800ml past niet bij '1 blik bruine bonen' |
| poiesz | 1 blik witte bonen | Iglo Ping & Klaar Gegrilde Kipfilet, rösti en sperziebonen 390 gram €6,67 | Iglo Ping & Klaar Gegrilde Kipfilet, rösti en sperziebonen 390 gram past niet bij '1 blik witte bonen' |
| vomar | 1 blik witte bonen | Unox bruine bonensoep 800ml 800ml €3,95 | Unox bruine bonensoep 800ml 800ml past niet bij '1 blik witte bonen' |
| ah | 200 g zure room | AH Kersenflappen met room 4 stuks €4,49 | AH Kersenflappen met room 4 stuks past niet bij '200 g zure room' |
| poiesz | 200 g zure room | Alpro Cuisine Variatie op Room 0.25 liter €1,98 | Alpro Cuisine Variatie op Room 0.25 liter past niet bij '200 g zure room' |
| vomar | 200 g zure room | Almhof roomyogh aardbei 500gr 500gr €2,39 | Almhof roomyogh aardbei 500gr 500gr past niet bij '200 g zure room' |
| aldi | 200 g zure room | Room saus 129 g €1,49 | Room saus 129 g past niet bij '200 g zure room' |
| hoogvliet | 500 g Griekse yoghurt | Zuivelmeester Yoghurt Griekse stijl aardbei 1 kilo €2,49 | Zuivelmeester Yoghurt Griekse stijl aardbei 1 kilo past niet bij '500 g Griekse yoghurt' |
| vomar | 500 g Griekse yoghurt | Elinas griekse yoghurt aardbei €1,99 | Elinas griekse yoghurt aardbei past niet bij '500 g Griekse yoghurt' |
| vomar | 1 l magere yoghurt | Optimel yoghurt vanille 1l 1l €1,95 | Optimel yoghurt vanille 1l 1l past niet bij '1 l magere yoghurt' |
| dekamarkt | 250 g roomboter | Roomboter kaascroissant stuk €0,89 | Roomboter kaascroissant stuk past niet bij '250 g roomboter' |
| dirk | 250 g roomboter | 1 de Beste Spritsen roomboter 250 g €1,65 | 1 de Beste Spritsen roomboter 250 g past niet bij '250 g roomboter' |
| hoogvliet | 250 g roomboter | G'woon Roomboter jodekoeken 300 gram €1,55 | G'woon Roomboter jodekoeken 300 gram past niet bij '250 g roomboter' |
| lidl | 250 g roomboter | Roomboter spritsen €1,19 | Roomboter spritsen past niet bij '250 g roomboter' |
| poiesz | 250 g margarine | Odorex Marine Fresh 50 milliliter €2,89 | Odorex Marine Fresh 50 milliliter past niet bij '250 g margarine' |
| vomar | 250 g margarine | Odorex deoroller marine 50ml 50ml €2,65 | Odorex deoroller marine 50ml 50ml past niet bij '250 g margarine' |
| vomar | 6 eieren | Sum&sam chinese eiermie 250. €1,55 | Sum&sam chinese eiermie 250. past niet bij '6 eieren' |
| vomar | 10 eieren | Sum&sam chinese eiermie 250. €1,55 | Sum&sam chinese eiermie 250. past niet bij '10 eieren' |
| vomar | 400 g jong belegen kaas | Aardappelgratin kaas 500gr. 500gr €2,39 | Aardappelgratin kaas 500gr. 500gr past niet bij '400 g jong belegen kaas' |
| ah | 100 g Parmezaanse kaas | AH Truffelsalami met Parmezaanse kaas 60 g €3,29 | AH Truffelsalami met Parmezaanse kaas 60 g past niet bij '100 g Parmezaanse kaas' |
| dekamarkt | 100 g Parmezaanse kaas | Zuivelmeester Kaas 30+ geraspt 200 g €2,35 | Zuivelmeester Kaas 30+ geraspt 200 g past niet bij '100 g Parmezaanse kaas' |
| dirk | 100 g Parmezaanse kaas | 1 de Beste Crackers kaas 200 g €1,65 | 1 de Beste Crackers kaas 200 g past niet bij '100 g Parmezaanse kaas' |
| hoogvliet | 100 g Parmezaanse kaas | Zuivelmeester Belegen stuk 940 gram €8,77 | Zuivelmeester Belegen stuk 940 gram past niet bij '100 g Parmezaanse kaas' |
| poiesz | 100 g Parmezaanse kaas | Eru Cheddar 150 gram €2,00 | Eru Cheddar 150 gram past niet bij '100 g Parmezaanse kaas' |
| vomar | 100 g Parmezaanse kaas | Aardappelgratin kaas 500gr. 500gr €2,39 | Aardappelgratin kaas 500gr. 500gr past niet bij '100 g Parmezaanse kaas' |
| aldi | 100 g Parmezaanse kaas | Kaas saus 111 g €1,49 | Kaas saus 111 g past niet bij '100 g Parmezaanse kaas' |
| plus | 200 g feta | PLUS Borek spinazie & feta 1 st €1,09 | PLUS Borek spinazie & feta 1 st past niet bij '200 g feta' |
| dekamarkt | 100 g blauwe kaas | Zuivelmeester Kaas 30+ geraspt 200 g €2,35 | Zuivelmeester Kaas 30+ geraspt 200 g past niet bij '100 g blauwe kaas' |
| dirk | 100 g blauwe kaas | 1 de Beste Crackers kaas 200 g €1,65 | 1 de Beste Crackers kaas 200 g past niet bij '100 g blauwe kaas' |
| hoogvliet | 100 g blauwe kaas | Zuivelmeester Belegen stuk 940 gram €8,77 | Zuivelmeester Belegen stuk 940 gram past niet bij '100 g blauwe kaas' |
| poiesz | 100 g blauwe kaas | Eru Cheddar 150 gram €2,00 | Eru Cheddar 150 gram past niet bij '100 g blauwe kaas' |
| vomar | 100 g blauwe kaas | Aardappelgratin kaas 500gr. 500gr €2,39 | Aardappelgratin kaas 500gr. 500gr past niet bij '100 g blauwe kaas' |
| dekamarkt | 6 krentenbollen | DekaVers Fijn volkorenbollen 6 stuks stuk €1,19 | DekaVers Fijn volkorenbollen 6 stuks stuk past niet bij '6 krentenbollen' |
| poiesz | 4 pitabroodjes | Italiaanse bol afbakbroodjes 5 stuk €2,00 | Italiaanse bol afbakbroodjes 5 stuk past niet bij '4 pitabroodjes' |
| vomar | 4 pitabroodjes | Vomar kaiserbroodjes 10 st. €1,95 | Vomar kaiserbroodjes 10 st. past niet bij '4 pitabroodjes' |
| ah | 2 stokbroden | AH Knäckebröd goudbruin 375 g €1,25 | AH Knäckebröd goudbruin 375 g past niet bij '2 stokbroden' |
| dekamarkt | 2 stokbroden | Fjord Knäckebröd volkoren 250 g €0,99 | Fjord Knäckebröd volkoren 250 g past niet bij '2 stokbroden' |
| dirk | 2 stokbroden | 1 de Beste Knäckebröd sesam 375 g €1,24 | 1 de Beste Knäckebröd sesam 375 g past niet bij '2 stokbroden' |
| hoogvliet | 2 stokbroden | Fjord Knäckebröd volkoren 250 gram €0,95 | Fjord Knäckebröd volkoren 250 gram past niet bij '2 stokbroden' |
| jumbo | 2 stokbroden | Jumbo Knäckebröd Sesam 5 x 5 Stuks 375 g €1,19 | Jumbo Knäckebröd Sesam 5 x 5 Stuks 375 g past niet bij '2 stokbroden' |
| plus | 2 stokbroden | PLUS Knackebrod goudbruin 375 g €1,49 | PLUS Knackebrod goudbruin 375 g past niet bij '2 stokbroden' |
| spar | 2 stokbroden | Fjord Knackerbrod Volkoren 250 gram €1,19 | Fjord Knackerbrod Volkoren 250 gram past niet bij '2 stokbroden' |
| dekamarkt | 1 pot honing | Marne Mosterd honing 235 g €1,55 | Marne Mosterd honing 235 g past niet bij '1 pot honing' |
| jumbo | 1 pot honing | Jumbo Honing Pomelo €1,99 | Jumbo Honing Pomelo past niet bij '1 pot honing' |
| poiesz | 1 pot honing | Elephant Pretzel honing-mosterd 70 gram €1,00 | Elephant Pretzel honing-mosterd 70 gram past niet bij '1 pot honing' |
| vomar | 1 pot honing | Elinas griekse yoghurt honing €1,99 | Elinas griekse yoghurt honing past niet bij '1 pot honing' |
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
| ah | 1 zakje tacokruiden | AH Paneermeel kruiden 150 g €0,79 | AH Paneermeel kruiden 150 g past niet bij '1 zakje tacokruiden' |
| dekamarkt | 1 zakje tacokruiden | Silvo Patatkruiden 83 g €2,79 | Silvo Patatkruiden 83 g past niet bij '1 zakje tacokruiden' |
| dirk | 1 zakje tacokruiden | 1 de Beste Paneermeel kruiden 150 g €0,72 | 1 de Beste Paneermeel kruiden 150 g past niet bij '1 zakje tacokruiden' |
| hoogvliet | 1 zakje tacokruiden | Paturain Kruiden 90 gram €1,99 | Paturain Kruiden 90 gram past niet bij '1 zakje tacokruiden' |
| jumbo | 1 zakje tacokruiden | Jumbo Kruiden Soepcroutons 75 g 75 g €0,79 | Jumbo Kruiden Soepcroutons 75 g 75 g past niet bij '1 zakje tacokruiden' |
| lidl | 1 zakje tacokruiden | Kerriekruiden 45 g €0,53 | Kerriekruiden 45 g past niet bij '1 zakje tacokruiden' |
| plus | 1 zakje tacokruiden | PLUS Kruiden paneermeel 150 g €0,75 | PLUS Kruiden paneermeel 150 g past niet bij '1 zakje tacokruiden' |
| poiesz | 1 zakje tacokruiden | Kaptein Smeerkaas Tuinkruiden 20+ 100 gram €1,29 | Kaptein Smeerkaas Tuinkruiden 20+ 100 gram past niet bij '1 zakje tacokruiden' |
| spar | 1 zakje tacokruiden | Verstegen inmaakkruiden 5 gram €1,95 | Verstegen inmaakkruiden 5 gram past niet bij '1 zakje tacokruiden' |
| aldi | 1 zakje tacokruiden | Tuinkruiden saus 75 g €1,49 | Tuinkruiden saus 75 g past niet bij '1 zakje tacokruiden' |
| ah | 1 zakje nasikruiden | AH Pangasiusfilet tuinkruiden ca. 310 g €5,49 | AH Pangasiusfilet tuinkruiden ca. 310 g past niet bij '1 zakje nasikruiden' |
| dekamarkt | 1 zakje nasikruiden | Silvo Eikruiden 62 g €2,79 | Silvo Eikruiden 62 g past niet bij '1 zakje nasikruiden' |
| dirk | 1 zakje nasikruiden | 1 de Beste Paneermeel kruiden 150 g €0,72 | 1 de Beste Paneermeel kruiden 150 g past niet bij '1 zakje nasikruiden' |
| hoogvliet | 1 zakje nasikruiden | Paturain Kruiden 90 gram €1,99 | Paturain Kruiden 90 gram past niet bij '1 zakje nasikruiden' |
| lidl | 1 zakje nasikruiden | Kerriekruiden 45 g €0,53 | Kerriekruiden 45 g past niet bij '1 zakje nasikruiden' |
| poiesz | 1 zakje nasikruiden | Kaptein Smeerkaas Tuinkruiden 20+ 100 gram €1,29 | Kaptein Smeerkaas Tuinkruiden 20+ 100 gram past niet bij '1 zakje nasikruiden' |
| spar | 1 zakje nasikruiden | Verstegen inmaakkruiden 5 gram €1,95 | Verstegen inmaakkruiden 5 gram past niet bij '1 zakje nasikruiden' |
| aldi | 1 zakje nasikruiden | Tuinkruiden saus 75 g €1,49 | Tuinkruiden saus 75 g past niet bij '1 zakje nasikruiden' |
| hoogvliet | 150 ml teriyakisaus | Boon Zwarte bonen in teriyakisaus 390 gram €2,74 | Boon Zwarte bonen in teriyakisaus 390 gram past niet bij '150 ml teriyakisaus' |
| jumbo | 150 ml teriyakisaus | Boon Zwarte Bonen in Teriyakisaus 200 g 200 g €1,19 | Boon Zwarte Bonen in Teriyakisaus 200 g 200 g past niet bij '150 ml teriyakisaus' |
| plus | 150 ml teriyakisaus | BOON Zwarte bonen in teriyakisaus 390 g €2,79 | BOON Zwarte bonen in teriyakisaus 390 g past niet bij '150 ml teriyakisaus' |
| aldi | 150 ml teriyakisaus | Chilisaus 700 ml €1,49 | Chilisaus 700 ml past niet bij '150 ml teriyakisaus' |
| aldi | 150 ml sojasaus | Slasaus halfvol 500 ml €1,45 | Slasaus halfvol 500 ml past niet bij '150 ml sojasaus' |
| hoogvliet | 1 pot rode currypasta | G'woon Duopasta 750 gram €3,95 | G'woon Duopasta 750 gram past niet bij '1 pot rode currypasta' |
| plus | 1 pot rode currypasta | Smaakt Rode linzenpasta bio 200 g €2,96 | Smaakt Rode linzenpasta bio 200 g past niet bij '1 pot rode currypasta' |
| poiesz | 1 pot rode currypasta | Toko Lien Knoflookpasta 200 gram €2,29 | Toko Lien Knoflookpasta 200 gram past niet bij '1 pot rode currypasta' |
| vomar | 1 pot rode currypasta | Fl.brand trassi pasta 25gr 25gr €0,79 | Fl.brand trassi pasta 25gr 25gr past niet bij '1 pot rode currypasta' |
| aldi | 1 pot rode currypasta | Boterhampasta 750 g €2,49 | Boterhampasta 750 g past niet bij '1 pot rode currypasta' |
| hoogvliet | 150 g rijstvellen | Frikandellen 20 stuks €3,59 | Frikandellen 20 stuks past niet bij '150 g rijstvellen' |
| plus | 150 g rijstvellen | Springhome Loempiavellen 550 g €3,49 | Springhome Loempiavellen 550 g past niet bij '150 g rijstvellen' |
| poiesz | 1 blik tomatenblokjes | Aanmaakblokjes Bruin 632 gram €2,69 | Aanmaakblokjes Bruin 632 gram past niet bij '1 blik tomatenblokjes' |
| vomar | 1 blik tomatenblokjes | Vanka satestokjes 18cm 100st €0,44 | Vanka satestokjes 18cm 100st past niet bij '1 blik tomatenblokjes' |
| poiesz | 1 blikje tomatenpuree | Verse aardappelpuree 500 gram €1,80 | Verse aardappelpuree 500 gram past niet bij '1 blikje tomatenpuree' |
| vomar | 1 blikje tomatenpuree | G'woon aardappelpuree 3x60gr. 60gr €0,56 | G'woon aardappelpuree 3x60gr. 60gr past niet bij '1 blikje tomatenpuree' |
| poiesz | 1 pot pastasaus | Yildriz Turkse Shoarmasaus 265 milliliter €2,64 | Yildriz Turkse Shoarmasaus 265 milliliter past niet bij '1 pot pastasaus' |
| ah | 1 blik mais | AH Terra Bonenmix maïs 200 g €1,19 | AH Terra Bonenmix maïs 200 g past niet bij '1 blik mais' |
| vomar | 1 blik mais | G'woon maisolie 1 liter 1 liter €2,99 | G'woon maisolie 1 liter 1 liter past niet bij '1 blik mais' |
| poiesz | 1 blik doperwten | Unox Soep Erwt 300 milliliter €2,15 | Unox Soep Erwt 300 milliliter past niet bij '1 blik doperwten' |
| vomar | 1 blik doperwten | Unox erwten soep  800ml 800ml €2,99 | Unox erwten soep  800ml 800ml past niet bij '1 blik doperwten' |
| poiesz | 1 pot kappertjes | Ambachtelijke Knappertjes 140 gram €1,87 | Ambachtelijke Knappertjes 140 gram past niet bij '1 pot kappertjes' |
| jumbo | 1 fles ketchup | Zaanse Curry Ketchup 190ml €1,49 | Zaanse Curry Ketchup 190ml past niet bij '1 fles ketchup' |
| spar | 1 fles ketchup | Zaanse curry ketchup 190 ml 190 milliliter €1,69 | Zaanse curry ketchup 190 ml 190 milliliter past niet bij '1 fles ketchup' |
| aldi | 1 fles ketchup | Curry ketchup 875 ml €1,79 | Curry ketchup 875 ml past niet bij '1 fles ketchup' |
| ah | 1 pot mayonaise | AH Sriracha mayonaise 60 g €1,39 | AH Sriracha mayonaise 60 g past niet bij '1 pot mayonaise' |
| aldi | 1 fles olijfolie | Tonijn in olijfolie 160 g €1,89 | Tonijn in olijfolie 160 g past niet bij '1 fles olijfolie' |
| aldi | 1 fles zonnebloemolie | Sardines in zonnebloemolie 120 g €1,69 | Sardines in zonnebloemolie 120 g past niet bij '1 fles zonnebloemolie' |
| aldi | 2 el olijfolie | Tonijn in olijfolie 160 g €1,89 | Tonijn in olijfolie 160 g past niet bij '2 el olijfolie' |
| hoogvliet | 1 el sesamolie | G'woon Zonnebloemolie 1 liter €1,48 | G'woon Zonnebloemolie 1 liter past niet bij '1 el sesamolie' |
| aldi | 1 el sesamolie | Sardines in zonnebloemolie 120 g €1,69 | Sardines in zonnebloemolie 120 g past niet bij '1 el sesamolie' |
| poiesz | 1 kg bloem | Allesreinigersdoekjes bloemen 80 stuks €1,25 | Allesreinigersdoekjes bloemen 80 stuks past niet bij '1 kg bloem' |
| poiesz | 1 pak poedersuiker | g'woon Koekrepen 30% minder suiker 300 gram €1,87 | g'woon Koekrepen 30% minder suiker 300 gram past niet bij '1 pak poedersuiker' |
| vomar | 1 pak poedersuiker | Peijnenburg geen suiker gesn €2,09 | Peijnenburg geen suiker gesn past niet bij '1 pak poedersuiker' |
| poiesz | 1 zakje bakpoeder | Ecostyle stekpoeder 400 milliliter €5,99 | Ecostyle stekpoeder 400 milliliter past niet bij '1 zakje bakpoeder' |
| vomar | 1 zakje bakpoeder | Omo wit waspoeder 14sc €5,39 | Omo wit waspoeder 14sc past niet bij '1 zakje bakpoeder' |
| poiesz | 1 pakje bouillonblokjes | Aanmaakblokjes Bruin 632 gram €2,69 | Aanmaakblokjes Bruin 632 gram past niet bij '1 pakje bouillonblokjes' |
| vomar | 1 pakje bouillonblokjes | Vanka satestokjes 18cm 100st €0,44 | Vanka satestokjes 18cm 100st past niet bij '1 pakje bouillonblokjes' |
| aldi | 1 pakje bouillonblokjes | Tomatenblokjes 400 g €0,33 | Tomatenblokjes 400 g past niet bij '1 pakje bouillonblokjes' |
| vomar | 1 pak kippenbouillon | Dhillon santen 198gr 198gr €2,19 | Dhillon santen 198gr 198gr past niet bij '1 pak kippenbouillon' |
| dekamarkt | 1 blok pure chocolade | BioToday Rijstwafels pure chocolade 100 g €1,79 | BioToday Rijstwafels pure chocolade 100 g past niet bij '1 blok pure chocolade' |
| aldi | 1 blok pure chocolade | Chocolade pinda's melk 200 g €1,48 | Chocolade pinda's melk 200 g past niet bij '1 blok pure chocolade' |
| poiesz | 200 g walnoten | Epixs borrelnoten crunch 275 gram €1,99 | Epixs borrelnoten crunch 275 gram past niet bij '200 g walnoten' |
| vomar | 200 g walnoten | Noten vruchtenwijn 750ml 750ml €2,89 | Noten vruchtenwijn 750ml 750ml past niet bij '200 g walnoten' |
| poiesz | 200 g cashewnoten | Ambachtelijke Kruidnoten 300 gram €2,00 | Ambachtelijke Kruidnoten 300 gram past niet bij '200 g cashewnoten' |
| vomar | 200 g cashewnoten | Noten vruchtenwijn 750ml 750ml €2,89 | Noten vruchtenwijn 750ml 750ml past niet bij '200 g cashewnoten' |
| vomar | 100 g pijnboompitten | Bio+ zonnebloempitten 500gr 500gr €2,99 | Bio+ zonnebloempitten 500gr 500gr past niet bij '100 g pijnboompitten' |
| jumbo | 1 zak rozijnen | Jumbo - Rozijnen Krentenbollen - 6 Stuks €1,48 | Jumbo - Rozijnen Krentenbollen - 6 Stuks past niet bij '1 zak rozijnen' |
| poiesz | 1 zak rozijnen | g'woon Koekrepen Rozijn 390 gram €1,42 | g'woon Koekrepen Rozijn 390 gram past niet bij '1 zak rozijnen' |
| vomar | 1 zak rozijnen | G'woon koekreep rozijn €1,20 | G'woon koekreep rozijn past niet bij '1 zak rozijnen' |
| poiesz | 1 blik ananas | Ananas-Meloen-Mangosap 500 milliliter €2,69 | Ananas-Meloen-Mangosap 500 milliliter past niet bij '1 blik ananas' |
| poiesz | 1 tl paprikapoeder | Ecostyle stekpoeder 400 milliliter €5,99 | Ecostyle stekpoeder 400 milliliter past niet bij '1 tl paprikapoeder' |
| dekamarkt | 1 tl komijn | DekaVers Kaasblokjes komijn 100 g €2,29 | DekaVers Kaasblokjes komijn 100 g past niet bij '1 tl komijn' |
| poiesz | 1 tl komijn | Kaptein Smeerkaas Komijn 20+ 100 gram €1,29 | Kaptein Smeerkaas Komijn 20+ 100 gram past niet bij '1 tl komijn' |
| spar | 1 tl komijn | Melkan Kaas Komijn jong belegen plakken 190 gram €3,59 | Melkan Kaas Komijn jong belegen plakken 190 gram past niet bij '1 tl komijn' |
| aldi | 1 tl komijn | Goudse kaas Toscaanse kruiden of komijn 30+ plakken 200 g €2,85 | Goudse kaas Toscaanse kruiden of komijn 30+ plakken 200 g past niet bij '1 tl komijn' |
| jumbo | 1 tl kerriepoeder | Jumbo Uienpoeder 30 g 30 g €1,79 | Jumbo Uienpoeder 30 g 30 g past niet bij '1 tl kerriepoeder' |
| lidl | 1 tl kerriepoeder | Paprikapoeder 50 g €0,76 | Paprikapoeder 50 g past niet bij '1 tl kerriepoeder' |
| poiesz | 1 tl kerriepoeder | Ecostyle stekpoeder 400 milliliter €5,99 | Ecostyle stekpoeder 400 milliliter past niet bij '1 tl kerriepoeder' |
| vomar | 1 tl kerriepoeder | Omo wit waspoeder 14sc €5,39 | Omo wit waspoeder 14sc past niet bij '1 tl kerriepoeder' |
| poiesz | 1 tl kaneel | Appel kaneel vlaai 1 stuk €6,99 | Appel kaneel vlaai 1 stuk past niet bij '1 tl kaneel' |
| spar | 1 tl kaneel | Hak Appelmoes Kaneel 355 gram €2,75 | Hak Appelmoes Kaneel 355 gram past niet bij '1 tl kaneel' |
| poiesz | 1 tl Italiaanse kruiden | Krieltjes met groene kruiden 450 gram €2,50 | Krieltjes met groene kruiden 450 gram past niet bij '1 tl Italiaanse kruiden' |
| vomar | 1 tl Italiaanse kruiden | G'woon koekreep kruidkoek €1,24 | G'woon koekreep kruidkoek past niet bij '1 tl Italiaanse kruiden' |
| aldi | 1 tl Italiaanse kruiden | Aardappelpartjes gekruid 750 g €1,27 | Aardappelpartjes gekruid 750 g past niet bij '1 tl Italiaanse kruiden' |
| hoogvliet | 1 tl chilivlokken | Choca Vlokken 300 gram €1,99 | Choca Vlokken 300 gram past niet bij '1 tl chilivlokken' |
| plus | 1 tl chilivlokken | Choca Vlokken 300 g €1,79 | Choca Vlokken 300 g past niet bij '1 tl chilivlokken' |
| dekamarkt | 1 tl gemberpoeder | Mentholpoeder 75 g €3,65 | Mentholpoeder 75 g past niet bij '1 tl gemberpoeder' |
| dirk | 1 tl gemberpoeder | 1 de Beste Kaneelpoeder 40 g €0,65 | 1 de Beste Kaneelpoeder 40 g past niet bij '1 tl gemberpoeder' |
| hoogvliet | 1 tl gemberpoeder | G'woon Zwarte peperpoeder 50 gram €0,79 | G'woon Zwarte peperpoeder 50 gram past niet bij '1 tl gemberpoeder' |
| jumbo | 1 tl gemberpoeder | Jumbo Uienpoeder 30 g 30 g €1,79 | Jumbo Uienpoeder 30 g 30 g past niet bij '1 tl gemberpoeder' |
| lidl | 1 tl gemberpoeder | Glitterpoeder €2,99 | Glitterpoeder past niet bij '1 tl gemberpoeder' |
| plus | 1 tl gemberpoeder | PLUS Paprikapoeder 48 g €0,70 | PLUS Paprikapoeder 48 g past niet bij '1 tl gemberpoeder' |
| poiesz | 1 tl gemberpoeder | Ecostyle stekpoeder 400 milliliter €5,99 | Ecostyle stekpoeder 400 milliliter past niet bij '1 tl gemberpoeder' |
| spar | 1 tl gemberpoeder | Verstegen uienpoeder 50 gram €3,45 | Verstegen uienpoeder 50 gram past niet bij '1 tl gemberpoeder' |
| vomar | 1 tl gemberpoeder | Omo wit waspoeder 14sc €5,39 | Omo wit waspoeder 14sc past niet bij '1 tl gemberpoeder' |
| aldi | zout | Zoute popcorn 100 g €0,88 | Zoute popcorn 100 g past niet bij 'zout' |
| poiesz | peper | Partjes peper - zeezout 450 gram €2,50 | Partjes peper - zeezout 450 gram past niet bij 'peper' |
| spar | peper | rode pepers 2 stuks €1,25 | rode pepers 2 stuks past niet bij 'peper' |
| lidl | 1 tl knoflookpoeder | Salmiakpoeder €1,99 | Salmiakpoeder past niet bij '1 tl knoflookpoeder' |
| poiesz | 1 tl knoflookpoeder | Ecostyle stekpoeder 400 milliliter €5,99 | Ecostyle stekpoeder 400 milliliter past niet bij '1 tl knoflookpoeder' |
| vomar | 1 tl knoflookpoeder | Omo wit waspoeder 14sc €5,39 | Omo wit waspoeder 14sc past niet bij '1 tl knoflookpoeder' |
| dekamarkt | 6 flessen water | Gedemineraliseerd water 1 liter €0,84 | Gedemineraliseerd water 1 liter past niet bij '6 flessen water' |
| dirk | 6 flessen water | Gedemineraliseerd water 1 liter €0,72 | Gedemineraliseerd water 1 liter past niet bij '6 flessen water' |
| plus | 1 pak thee | PLUS IJsthee groene thee 500 ml €0,59 | PLUS IJsthee groene thee 500 ml past niet bij '1 pak thee' |
| jumbo | 1 pak toiletpapier | Jumbo Sensitive Vochtig Toiletpapier 40 Stuks €0,89 | Jumbo Sensitive Vochtig Toiletpapier 40 Stuks past niet bij '1 pak toiletpapier' |
| poiesz | 1 pak toiletpapier | Inpakpapier 200*70cm 1 stuks €1,00 | Inpakpapier 200*70cm 1 stuks past niet bij '1 pak toiletpapier' |
| poiesz | 1 rol keukenpapier | Inpakpapier 200*70cm 1 stuks €1,00 | Inpakpapier 200*70cm 1 stuks past niet bij '1 rol keukenpapier' |
| aldi | 1 pak vaatwastabletten | Aardappel-ovenkroketten 750 g €1,44 | Aardappel-ovenkroketten 750 g past niet bij '1 pak vaatwastabletten' |
| poiesz | 1 pak vuilniszakken | Ovengebakken gehakt 100 gram €2,29 | Ovengebakken gehakt 100 gram past niet bij '1 pak vuilniszakken' |
| vomar | 1 pak vuilniszakken | Fl.br. gebakken emping 80gr . g €1,99 | Fl.br. gebakken emping 80gr . g past niet bij '1 pak vuilniszakken' |
| aldi | 1 pak vuilniszakken | Rookkaasplakken 45+ 150 g €1,99 | Rookkaasplakken 45+ 150 g past niet bij '1 pak vuilniszakken' |
| aldi | 1 tube tandpasta | Boterhampasta 750 g €2,49 | Boterhampasta 750 g past niet bij '1 tube tandpasta' |
| dirk | 1 rol aluminiumfolie | 1 de Beste Olijfolie traditioneel 250 ml €3,05 | 1 de Beste Olijfolie traditioneel 250 ml past niet bij '1 rol aluminiumfolie' |
| poiesz | 1 rol aluminiumfolie | g'woon Olijfolie Traditioneel 250 milliliter €3,49 | g'woon Olijfolie Traditioneel 250 milliliter past niet bij '1 rol aluminiumfolie' |
| vomar | 1 rol aluminiumfolie | Biologische olijfolie €9,99 | Biologische olijfolie past niet bij '1 rol aluminiumfolie' |
| aldi | 1 rol aluminiumfolie | Tonijn in olijfolie 160 g €1,89 | Tonijn in olijfolie 160 g past niet bij '1 rol aluminiumfolie' |

## Alle fouten in deze controle

### Aanbiedingen (62)

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
| plus | 1 limoen | Karvan Cévitam Refresh zero limoen & munt (2 voor 5.99, €3,00) | siroop, geen limoen |
| ah | 500 g aardbeien | Alpro Plantaardig variatie aardbei (2e halve prijs, €1,79) | Alpro plantaardige yoghurt, geen aardbeien |
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
| plus | 1 kg suiker | Verkade Originals San Francisco 0% suiker (2e halve prijs, €1,72) | koek, geen suiker |
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
| plus | 1,5 l cola | Haribo Stixx cola (voor 1,69, €1,69) | snoep, geen cola |
| plus | 6 flessen water | Lipton en Sourcy Vitaminwater (voor 0,99, €0,99) | vitaminedrank, geen water |
| vomar | 6 flessen water | Royal Club of Sourcy Vitamin Water (voor 1,79, €1,79) | vitaminedrank, geen water |
| ah | 1 pak thee | Care Groene thee (1+1 gratis, €2,50) | supplement, geen thee |
| plus | 1 pak toiletpapier | Page Vochtig toiletpapier puur 38 st (1+1 gratis, €1,15) | vochtig toiletpapier bij toiletpapier |
| poiesz | 1 fles wasmiddel | Dreft handafwasmiddel (1+1 GRATIS, €1,48) | handafwasmiddel bij wasmiddel |

### Productkeuzes (306)

| winkel | regel | gekozen | reden |
|---|---|---|---|
| jumbo | 1 ui | Jumbo Jus Ui 18 g 18 g €0,39 | Jumbo Jus Ui 18 g 18 g past niet bij '1 ui' |
| poiesz | 1 bloemkool | Verspakket ovenschotel bloemkool 1040 gram €5,50 | Verspakket ovenschotel bloemkool 1040 gram past niet bij '1 bloemkool' |
| ah | 2 rode paprika | AH Gegrilde rode paprika 295 g €2,25 | AH Gegrilde rode paprika 295 g past niet bij '2 rode paprika' |
| dekamarkt | 2 rode paprika | Paolo Rode paprika geroosterd 450 g €3,49 | Paolo Rode paprika geroosterd 450 g past niet bij '2 rode paprika' |
| plus | 2 rode paprika | PLUS Geroosterde rode paprika 295 g €2,39 | PLUS Geroosterde rode paprika 295 g past niet bij '2 rode paprika' |
| spar | 2 rode paprika | Baktat gegrilde rode paprika 650 gram €3,99 | Baktat gegrilde rode paprika 650 gram past niet bij '2 rode paprika' |
| vomar | 2 rode paprika | Epixs ribbelchips paprika €1,59 | Epixs ribbelchips paprika past niet bij '2 rode paprika' |
| dirk | 1 groene paprika | Zonnatura Groentespread paprika 135 g €2,89 | Zonnatura Groentespread paprika 135 g past niet bij '1 groene paprika' |
| plus | 1 groene paprika | Zonnatura Groentespread paprika bio 135 g €2,99 | Zonnatura Groentespread paprika bio 135 g past niet bij '1 groene paprika' |
| spar | 1 groene paprika | Zonnatura groentespread paprika 135 gram €3,59 | Zonnatura groentespread paprika 135 gram past niet bij '1 groene paprika' |
| aldi | 1 groene paprika | Paprika- of naturelchips 50 g €0,50 | Paprika- of naturelchips 50 g past niet bij '1 groene paprika' |
| poiesz | 4 tomaten | Unox Soep Tomaten 300 milliliter €2,15 | Unox Soep Tomaten 300 milliliter past niet bij '4 tomaten' |
| jumbo | 250 g cherrytomaten | Heinz Pastasaus Zongerijpte Cherrytomaten & Basilicum 490g €3,79 | Heinz Pastasaus Zongerijpte Cherrytomaten & Basilicum 490g past niet bij '250 g cherrytomaten' |
| poiesz | 250 g cherrytomaten | Unox Soep Tomaten 300 milliliter €2,15 | Unox Soep Tomaten 300 milliliter past niet bij '250 g cherrytomaten' |
| poiesz | 250 g champignons | Unox Soep Champignon 800 milliliter €3,99 | Unox Soep Champignon 800 milliliter past niet bij '250 g champignons' |
| poiesz | 250 g kastanjechampignons | Unox Soep Champignon 800 milliliter €3,99 | Unox Soep Champignon 800 milliliter past niet bij '250 g kastanjechampignons' |
| vomar | 250 g kastanjechampignons | Cupasoup champignon €1,79 | Cupasoup champignon past niet bij '250 g kastanjechampignons' |
| ah | 1 bosje lente-uitjes | AH Gebakken uitjes 150 g €1,19 | AH Gebakken uitjes 150 g past niet bij '1 bosje lente-uitjes' |
| dekamarkt | 1 bosje lente-uitjes | Maggi Jus met uitjes 22 g €0,69 | Maggi Jus met uitjes 22 g past niet bij '1 bosje lente-uitjes' |
| dirk | 1 bosje lente-uitjes | 1 de Beste Amsterdamse uitjes 320 g €0,68 | 1 de Beste Amsterdamse uitjes 320 g past niet bij '1 bosje lente-uitjes' |
| hoogvliet | 1 bosje lente-uitjes | G'woon Amsterdamse uitjes 320 gram €0,69 | G'woon Amsterdamse uitjes 320 gram past niet bij '1 bosje lente-uitjes' |
| jumbo | 1 bosje lente-uitjes | Jumbo Gebakken Uitjes 150 g 150 g €1,49 | Jumbo Gebakken Uitjes 150 g 150 g past niet bij '1 bosje lente-uitjes' |
| lidl | 1 bosje lente-uitjes | Gehaktmix met uitjes €0,69 | Gehaktmix met uitjes past niet bij '1 bosje lente-uitjes' |
| plus | 1 bosje lente-uitjes | PLUS Gebakken uitjes 150 g €1,19 | PLUS Gebakken uitjes 150 g past niet bij '1 bosje lente-uitjes' |
| poiesz | 1 bosje lente-uitjes | g'woon Amsterdamse Uitjes 370 milliliter €0,81 | g'woon Amsterdamse Uitjes 370 milliliter past niet bij '1 bosje lente-uitjes' |
| spar | 1 bosje lente-uitjes | g'woon Amsterdamse uitjes 320 gram €0,95 | g'woon Amsterdamse uitjes 320 gram past niet bij '1 bosje lente-uitjes' |
| vomar | 1 bosje lente-uitjes | Maggi jus met uitjes 21,4gr 21.4gr €0,79 | Maggi jus met uitjes 21,4gr 21.4gr past niet bij '1 bosje lente-uitjes' |
| aldi | 1 bosje lente-uitjes | Zilveruitjes 320 g €0,65 | Zilveruitjes 320 g past niet bij '1 bosje lente-uitjes' |
| dekamarkt | 150 g peultjes | Krieltjes 500 g €0,99 | Krieltjes 500 g past niet bij '150 g peultjes' |
| dirk | 150 g peultjes | 1 de Beste Krieltjes 500 g €0,99 | 1 de Beste Krieltjes 500 g past niet bij '150 g peultjes' |
| hoogvliet | 150 g peultjes | Krieltjes 500 gram €1,09 | Krieltjes 500 gram past niet bij '150 g peultjes' |
| jumbo | 150 g peultjes | Jumbo Krieltjes 200 g 200 g €0,69 | Jumbo Krieltjes 200 g 200 g past niet bij '150 g peultjes' |
| lidl | 150 g peultjes | Kapperappeltjes 350 g €0,99 | Kapperappeltjes 350 g past niet bij '150 g peultjes' |
| poiesz | 150 g peultjes | Mini Krieltjes 200 gram €0,80 | Mini Krieltjes 200 gram past niet bij '150 g peultjes' |
| spar | 150 g peultjes | krieltjes 500 gram €1,25 | krieltjes 500 gram past niet bij '150 g peultjes' |
| aldi | 150 g peultjes | Krieltjes 500 g €0,99 | Krieltjes 500 g past niet bij '150 g peultjes' |
| hoogvliet | 1 rode peper | ERU Goudkuipje Peper 100 gram €1,79 | ERU Goudkuipje Peper 100 gram past niet bij '1 rode peper' |
| plus | 1 rode peper | PLUS Zwarte peper 50 g €0,75 | PLUS Zwarte peper 50 g past niet bij '1 rode peper' |
| poiesz | 1 rode peper | Partjes peper - zeezout 450 gram €2,50 | Partjes peper - zeezout 450 gram past niet bij '1 rode peper' |
| jumbo | 1 stukje gember | Jumbo Kruidenthee Gember 15 x 2,5 g 15 x 2.5 g €1,19 | Jumbo Kruidenthee Gember 15 x 2,5 g 15 x 2.5 g past niet bij '1 stukje gember' |
| poiesz | 1 stukje gember | Aardbei-Gember Shot 125 milliliter €1,29 | Aardbei-Gember Shot 125 milliliter past niet bij '1 stukje gember' |
| vomar | 1 bosje koriander | Aard anders knoflook 390gr 390gr €3,49 | Aard anders knoflook 390gr 390gr past niet bij '1 bosje koriander' |
| vomar | 1 zak spitskool | Thm houtskool 3kg 3kg €3,45 | Thm houtskool 3kg 3kg past niet bij '1 zak spitskool' |
| poiesz | 1 rodekool | Iglo Rode Kool met Appeltjes 450 gram €2,22 | Iglo Rode Kool met Appeltjes 450 gram past niet bij '1 rodekool' |
| poiesz | 2 bieten | Ambachtelijk Sap Bio Rode Biet 750 milliliter €3,49 | Ambachtelijk Sap Bio Rode Biet 750 milliliter past niet bij '2 bieten' |
| vomar | 2 bieten | Aviko oma's smulfrieten 750gr 750gr €2,75 | Aviko oma's smulfrieten 750gr 750gr past niet bij '2 bieten' |
| lidl | 6 bananen | Bananencake €2,99 | Bananencake past niet bij '6 bananen' |
| dekamarkt | 1 kg sinaasappel | Wicky Sinaasappel 6x20 cl 1.2 liter €1,95 | Wicky Sinaasappel 6x20 cl 1.2 liter past niet bij '1 kg sinaasappel' |
| dirk | 1 kg sinaasappel | Taksi Sinaasappel 10x20 cl 2 liter €1,89 | Taksi Sinaasappel 10x20 cl 2 liter past niet bij '1 kg sinaasappel' |
| jumbo | 1 kg sinaasappel | 1FRUIT Sinaasappel 200ml 200 ml €0,99 | 1FRUIT Sinaasappel 200ml 200 ml past niet bij '1 kg sinaasappel' |
| lidl | 1 kg sinaasappel | Sinaasappel 2L 2 l €2,59 | Sinaasappel 2L 2 l past niet bij '1 kg sinaasappel' |
| plus | 1 kg sinaasappel | PLUS Sinaasappel nectar 1500 ml €1,59 | PLUS Sinaasappel nectar 1500 ml past niet bij '1 kg sinaasappel' |
| poiesz | 1 kg sinaasappel | Appelsientje Fruitdrink Sinaasappel 1 liter €2,49 | Appelsientje Fruitdrink Sinaasappel 1 liter past niet bij '1 kg sinaasappel' |
| vomar | 2 citroenen | G'woon allesreiniger citroen €0,69 | G'woon allesreiniger citroen past niet bij '2 citroenen' |
| dekamarkt | 1 limoen | Optimel Drinkyoghurt limoen 1 liter €2,09 | Optimel Drinkyoghurt limoen 1 liter past niet bij '1 limoen' |
| dirk | 1 limoen | 1 de Beste Clear cranberry-limoen 1.5 liter €1,29 | 1 de Beste Clear cranberry-limoen 1.5 liter past niet bij '1 limoen' |
| plus | 1 limoen | Bacardi Limón 700 ml €20,99 | Bacardi Limón 700 ml past niet bij '1 limoen' |
| poiesz | 1 limoen | Optimel Drinkyoghurt limoen 0% vet 1000 milliliter €2,09 | Optimel Drinkyoghurt limoen 0% vet 1000 milliliter past niet bij '1 limoen' |
| spar | 1 limoen | Bacardi limon & lemonade blik 250 milliliter €2,85 | Bacardi limon & lemonade blik 250 milliliter past niet bij '1 limoen' |
| vomar | 1 limoen | Optimel drink limoen 1l 1l €2,15 | Optimel drink limoen 1l 1l past niet bij '1 limoen' |
| jumbo | 500 g aardbeien | Jumbo Aardbei Schepijs 1L 533 g €2,59 | Jumbo Aardbei Schepijs 1L 533 g past niet bij '500 g aardbeien' |
| poiesz | 125 g blauwe bessen | Activia Kefir bosbessmaak 0.28 kilogram €1,49 | Activia Kefir bosbessmaak 0.28 kilogram past niet bij '125 g blauwe bessen' |
| vomar | 125 g blauwe bessen | Fruti vr.wijn framb.bessen  1l 1l €3,85 | Fruti vr.wijn framb.bessen  1l 1l past niet bij '125 g blauwe bessen' |
| poiesz | 1 ananas | Ananas-Meloen-Mangosap 500 milliliter €2,69 | Ananas-Meloen-Mangosap 500 milliliter past niet bij '1 ananas' |
| hoogvliet | 2 peren | G'woon Fruitijsjes peren 12 stuks €1,69 | G'woon Fruitijsjes peren 12 stuks past niet bij '2 peren' |
| jumbo | 2 peren | Jumbo Peren Waterijsjes 12 Stuks 50 g €1,49 | Jumbo Peren Waterijsjes 12 Stuks 50 g past niet bij '2 peren' |
| poiesz | 2 peren | g'woon Peren Fruitijsjes 600 gram €1,58 | g'woon Peren Fruitijsjes 600 gram past niet bij '2 peren' |
| vomar | 1 granaatappel | Morgana appelen los €2,79 | Morgana appelen los past niet bij '1 granaatappel' |
| vomar | 1 meloen | Red bull watermelon 250ml st. 250ml €1,65 | Red bull watermelon 250ml st. 250ml past niet bij '1 meloen' |
| vomar | 500 g kipfilet | Slagers filet americain uien €2,99 | Slagers filet americain uien past niet bij '500 g kipfilet' |
| poiesz | 400 g kipdijfilet | Kalkoenfilet 100 gram €2,69 | Kalkoenfilet 100 gram past niet bij '400 g kipdijfilet' |
| vomar | 400 g kipdijfilet | Slagers filet americain uien €2,99 | Slagers filet americain uien past niet bij '400 g kipdijfilet' |
| hoogvliet | 4 kippendijen | Peijnenburg Ontbijtkoek parelkandij ongesneden 465 gram €2,55 | Peijnenburg Ontbijtkoek parelkandij ongesneden 465 gram past niet bij '4 kippendijen' |
| vomar | 4 kippendijen | Peijnenburg parelkandij 348gr 348gr €2,09 | Peijnenburg parelkandij 348gr 348gr past niet bij '4 kippendijen' |
| lidl | 300 g kipreepjes | Vega kipreepjes €2,99 | Vega kipreepjes past niet bij '300 g kipreepjes' |
| poiesz | 300 g kipreepjes | Aviko Maaltijdpannetje Roerbak Runderreepjes zak 450 gram €4,49 | Aviko Maaltijdpannetje Roerbak Runderreepjes zak 450 gram past niet bij '300 g kipreepjes' |
| poiesz | 1 hele kip | Unox Soep Kip 300 milliliter €2,15 | Unox Soep Kip 300 milliliter past niet bij '1 hele kip' |
| aldi | 1 hele kip | Kipreepjes 150 g €1,99 | Kipreepjes 150 g past niet bij '1 hele kip' |
| poiesz | 500 g rundergehakt | Italiaans Gehakt 500 gram €6,49 | Italiaans Gehakt 500 gram past niet bij '500 g rundergehakt' |
| poiesz | 4 hamburgers | Oliehoorn Hamburgersaus 270 milliliter €2,82 | Oliehoorn Hamburgersaus 270 milliliter past niet bij '4 hamburgers' |
| ah | 2 biefstukken | Statesman Tonijn stukken in water 160 g €1,35 | Statesman Tonijn stukken in water 160 g past niet bij '2 biefstukken' |
| dekamarkt | 2 biefstukken | G'woon Appelcompote met stukken 570 g €1,07 | G'woon Appelcompote met stukken 570 g past niet bij '2 biefstukken' |
| dirk | 2 biefstukken | Deepblue Inktvis stukken in olie met knoflook 111 g €2,29 | Deepblue Inktvis stukken in olie met knoflook 111 g past niet bij '2 biefstukken' |
| jumbo | 2 biefstukken | KoRo Gevriesdroogde Mangostukken 30g €3,99 | KoRo Gevriesdroogde Mangostukken 30g past niet bij '2 biefstukken' |
| lidl | 2 biefstukken | Ananasstukken 567 g €1,99 | Ananasstukken 567 g past niet bij '2 biefstukken' |
| spar | 2 biefstukken | Vos Banket Spritsstukken Roomboter 300 gram €4,95 | Vos Banket Spritsstukken Roomboter 300 gram past niet bij '2 biefstukken' |
| dirk | 500 g runderlappen | Vleeschmeesters Varkenslappen mager 5 st. 875 g €9,35 | Vleeschmeesters Varkenslappen mager 5 st. 875 g past niet bij '500 g runderlappen' |
| poiesz | 500 g runderlappen | Appelflappen 4 stuk €3,56 | Appelflappen 4 stuk past niet bij '500 g runderlappen' |
| spar | 500 g runderlappen | Spar hamlappen 2 stuks 300 gram €3,72 | Spar hamlappen 2 stuks 300 gram past niet bij '500 g runderlappen' |
| aldi | 500 g runderlappen | Verse hamlappen 500 g €4,99 | Verse hamlappen 500 g past niet bij '500 g runderlappen' |
| ah | 4 speklappen | AH Kersenflappen met room 4 stuks €4,49 | AH Kersenflappen met room 4 stuks past niet bij '4 speklappen' |
| dirk | 4 speklappen | Vleeschmeesters Varkenslappen mager 5 st. 875 g €9,35 | Vleeschmeesters Varkenslappen mager 5 st. 875 g past niet bij '4 speklappen' |
| poiesz | 4 speklappen | Appelflappen 4 stuk €3,56 | Appelflappen 4 stuk past niet bij '4 speklappen' |
| vomar | 4 speklappen | Csw ierse runderlappen 3st €10,19 | Csw ierse runderlappen 3st past niet bij '4 speklappen' |
| ah | 200 g spekjes | AH Terra Plantaardige spekjes 140 g €1,45 | AH Terra Plantaardige spekjes 140 g past niet bij '200 g spekjes' |
| plus | 200 g spekjes | PLUS Plantaardige spekjes 160 g €2,95 | PLUS Plantaardige spekjes 160 g past niet bij '200 g spekjes' |
| poiesz | 200 g spekjes | Aviko Aardappelspecialiteit Lachebekjes 450 gram €2,96 | Aviko Aardappelspecialiteit Lachebekjes 450 gram past niet bij '200 g spekjes' |
| aldi | 1 rookworst | Boterhamworst 150 g €1,36 | Boterhamworst 150 g past niet bij '1 rookworst' |
| vomar | 2 braadworsten | Unox geld. rookworst 285gr 285gr €3,69 | Unox geld. rookworst 285gr 285gr past niet bij '2 braadworsten' |
| aldi | 2 braadworsten | Slagersknakworsten 320 g €2,99 | Slagersknakworsten 320 g past niet bij '2 braadworsten' |
| vomar | 8 knakworsten | Unox magnetron rookworst 100gr 100gr €1,89 | Unox magnetron rookworst 100gr 100gr past niet bij '8 knakworsten' |
| vomar | 200 g gerookte zalm | Ovenschotel zalm  300gr 300gr €7,99 | Ovenschotel zalm  300gr 300gr past niet bij '200 g gerookte zalm' |
| hoogvliet | 2 zalmfilets | Gerookte zalmfilet 200 gram €5,99 | Gerookte zalmfilet 200 gram past niet bij '2 zalmfilets' |
| poiesz | 2 zalmfilets | Gerookte Atlantische Zalmfilet 200 gram €6,49 | Gerookte Atlantische Zalmfilet 200 gram past niet bij '2 zalmfilets' |
| spar | 2 zalmfilets | gerookte zalmfilet Atlantisch 200 gram €6,59 | gerookte zalmfilet Atlantisch 200 gram past niet bij '2 zalmfilets' |
| vomar | 2 zalmfilets | Slagers filet americain uien €2,99 | Slagers filet americain uien past niet bij '2 zalmfilets' |
| dekamarkt | 2 blikjes tonijn | Maaltijdsalade tonijn 450 g €3,95 | Maaltijdsalade tonijn 450 g past niet bij '2 blikjes tonijn' |
| dirk | 2 blikjes tonijn | 1 de Beste Salade tonijn 150 g €1,55 | 1 de Beste Salade tonijn 150 g past niet bij '2 blikjes tonijn' |
| vomar | 200 g kibbeling | Elvive cremespoeling color €3,29 | Elvive cremespoeling color past niet bij '200 g kibbeling' |
| vomar | 4 visstick | Organix veggie sticks 15gr bio 15gr €1,09 | Organix veggie sticks 15gr bio 15gr past niet bij '4 visstick' |
| jumbo | 200 g gerookte makreel | Minerva Makreel Pate 75 g 75 g €2,49 | Minerva Makreel Pate 75 g 75 g past niet bij '200 g gerookte makreel' |
| ah | 300 g shoarmavlees | AH Rundersoepvlees ca. 315 g €7,69 | AH Rundersoepvlees ca. 315 g past niet bij '300 g shoarmavlees' |
| dekamarkt | 300 g shoarmavlees | Smuldier Rundvlees 400 g €1,79 | Smuldier Rundvlees 400 g past niet bij '300 g shoarmavlees' |
| dirk | 300 g shoarmavlees | 1 de Beste Runderrookvlees 100 g €2,95 | 1 de Beste Runderrookvlees 100 g past niet bij '300 g shoarmavlees' |
| jumbo | 300 g shoarmavlees | Jumbo Runderrookvlees 100 g 100 g €2,69 | Jumbo Runderrookvlees 100 g 100 g past niet bij '300 g shoarmavlees' |
| lidl | 300 g shoarmavlees | Runderrookvlees €3,49 | Runderrookvlees past niet bij '300 g shoarmavlees' |
| poiesz | 300 g shoarmavlees | Appelsientje Sinaasappel Extra Vruchtvlees 1 liter €2,99 | Appelsientje Sinaasappel Extra Vruchtvlees 1 liter past niet bij '300 g shoarmavlees' |
| spar | 300 g shoarmavlees | Spar hacheevlees 500 gram €13,00 | Spar hacheevlees 500 gram past niet bij '300 g shoarmavlees' |
| vomar | 300 g shoarmavlees | Sum&sam boemboe rendang vlees €0,98 | Sum&sam boemboe rendang vlees past niet bij '300 g shoarmavlees' |
| aldi | 300 g shoarmavlees | Runderrookvlees 100 g €2,49 | Runderrookvlees 100 g past niet bij '300 g shoarmavlees' |
| hoogvliet | 200 g gyros | Verstegen Kruidenmix gyros 30 gram €1,46 | Verstegen Kruidenmix gyros 30 gram past niet bij '200 g gyros' |
| ah | 150 g plakjes ham | AH Smeerkaas ham 15+ 200 g €1,39 | AH Smeerkaas ham 15+ 200 g past niet bij '150 g plakjes ham' |
| dekamarkt | 150 g plakjes ham | Salade ham 150 g €2,29 | Salade ham 150 g past niet bij '150 g plakjes ham' |
| lidl | 150 g plakjes ham | Ham-kaashoorntje €0,99 | Ham-kaashoorntje past niet bij '150 g plakjes ham' |
| plus | 150 g plakjes ham | PLUS Ham-kaascroissant 1 st €0,89 | PLUS Ham-kaascroissant 1 st past niet bij '150 g plakjes ham' |
| aldi | 150 g plakjes ham | Ham-kaas knabbels 150 g €0,85 | Ham-kaas knabbels 150 g past niet bij '150 g plakjes ham' |
| spar | 2 vegaburgers | Hamburger 12 stuks €2,69 | Hamburger 12 stuks past niet bij '2 vegaburgers' |
| aldi | 2 vegaburgers | Scharrelkipburgers 200 g €2,79 | Scharrelkipburgers 200 g past niet bij '2 vegaburgers' |
| aldi | 200 g vegetarische kipstukjes | Pindakaas met stukjes pinda 600 g €1,99 | Pindakaas met stukjes pinda 600 g past niet bij '200 g vegetarische kipstukjes' |
| poiesz | 1 blik kikkererwten | Unox Soep Erwt 300 milliliter €2,15 | Unox Soep Erwt 300 milliliter past niet bij '1 blik kikkererwten' |
| vomar | 1 blik kikkererwten | Unox erwten soep  800ml 800ml €2,99 | Unox erwten soep  800ml 800ml past niet bij '1 blik kikkererwten' |
| poiesz | 1 blik kidneybonen | Iglo Ping & Klaar Gegrilde Kipfilet, rösti en sperziebonen 390 gram €6,67 | Iglo Ping & Klaar Gegrilde Kipfilet, rösti en sperziebonen 390 gram past niet bij '1 blik kidneybonen' |
| poiesz | 1 blik zwarte bonen | Iglo Ping & Klaar Gegrilde Kipfilet, rösti en sperziebonen 390 gram €6,67 | Iglo Ping & Klaar Gegrilde Kipfilet, rösti en sperziebonen 390 gram past niet bij '1 blik zwarte bonen' |
| vomar | 1 blik zwarte bonen | Unox bruine bonensoep 800ml 800ml €3,95 | Unox bruine bonensoep 800ml 800ml past niet bij '1 blik zwarte bonen' |
| poiesz | 1 blik bruine bonen | Unox Stevige Bruine bonensoep 800 milliliter €4,35 | Unox Stevige Bruine bonensoep 800 milliliter past niet bij '1 blik bruine bonen' |
| vomar | 1 blik bruine bonen | Unox bruine bonensoep 800ml 800ml €3,95 | Unox bruine bonensoep 800ml 800ml past niet bij '1 blik bruine bonen' |
| poiesz | 1 blik witte bonen | Iglo Ping & Klaar Gegrilde Kipfilet, rösti en sperziebonen 390 gram €6,67 | Iglo Ping & Klaar Gegrilde Kipfilet, rösti en sperziebonen 390 gram past niet bij '1 blik witte bonen' |
| vomar | 1 blik witte bonen | Unox bruine bonensoep 800ml 800ml €3,95 | Unox bruine bonensoep 800ml 800ml past niet bij '1 blik witte bonen' |
| ah | 200 g zure room | AH Kersenflappen met room 4 stuks €4,49 | AH Kersenflappen met room 4 stuks past niet bij '200 g zure room' |
| poiesz | 200 g zure room | Alpro Cuisine Variatie op Room 0.25 liter €1,98 | Alpro Cuisine Variatie op Room 0.25 liter past niet bij '200 g zure room' |
| vomar | 200 g zure room | Almhof roomyogh aardbei 500gr 500gr €2,39 | Almhof roomyogh aardbei 500gr 500gr past niet bij '200 g zure room' |
| aldi | 200 g zure room | Room saus 129 g €1,49 | Room saus 129 g past niet bij '200 g zure room' |
| hoogvliet | 500 g Griekse yoghurt | Zuivelmeester Yoghurt Griekse stijl aardbei 1 kilo €2,49 | Zuivelmeester Yoghurt Griekse stijl aardbei 1 kilo past niet bij '500 g Griekse yoghurt' |
| vomar | 500 g Griekse yoghurt | Elinas griekse yoghurt aardbei €1,99 | Elinas griekse yoghurt aardbei past niet bij '500 g Griekse yoghurt' |
| vomar | 1 l magere yoghurt | Optimel yoghurt vanille 1l 1l €1,95 | Optimel yoghurt vanille 1l 1l past niet bij '1 l magere yoghurt' |
| dekamarkt | 250 g roomboter | Roomboter kaascroissant stuk €0,89 | Roomboter kaascroissant stuk past niet bij '250 g roomboter' |
| dirk | 250 g roomboter | 1 de Beste Spritsen roomboter 250 g €1,65 | 1 de Beste Spritsen roomboter 250 g past niet bij '250 g roomboter' |
| hoogvliet | 250 g roomboter | G'woon Roomboter jodekoeken 300 gram €1,55 | G'woon Roomboter jodekoeken 300 gram past niet bij '250 g roomboter' |
| lidl | 250 g roomboter | Roomboter spritsen €1,19 | Roomboter spritsen past niet bij '250 g roomboter' |
| poiesz | 250 g margarine | Odorex Marine Fresh 50 milliliter €2,89 | Odorex Marine Fresh 50 milliliter past niet bij '250 g margarine' |
| vomar | 250 g margarine | Odorex deoroller marine 50ml 50ml €2,65 | Odorex deoroller marine 50ml 50ml past niet bij '250 g margarine' |
| vomar | 6 eieren | Sum&sam chinese eiermie 250. €1,55 | Sum&sam chinese eiermie 250. past niet bij '6 eieren' |
| vomar | 10 eieren | Sum&sam chinese eiermie 250. €1,55 | Sum&sam chinese eiermie 250. past niet bij '10 eieren' |
| vomar | 400 g jong belegen kaas | Aardappelgratin kaas 500gr. 500gr €2,39 | Aardappelgratin kaas 500gr. 500gr past niet bij '400 g jong belegen kaas' |
| ah | 100 g Parmezaanse kaas | AH Truffelsalami met Parmezaanse kaas 60 g €3,29 | AH Truffelsalami met Parmezaanse kaas 60 g past niet bij '100 g Parmezaanse kaas' |
| dekamarkt | 100 g Parmezaanse kaas | Zuivelmeester Kaas 30+ geraspt 200 g €2,35 | Zuivelmeester Kaas 30+ geraspt 200 g past niet bij '100 g Parmezaanse kaas' |
| dirk | 100 g Parmezaanse kaas | 1 de Beste Crackers kaas 200 g €1,65 | 1 de Beste Crackers kaas 200 g past niet bij '100 g Parmezaanse kaas' |
| hoogvliet | 100 g Parmezaanse kaas | Zuivelmeester Belegen stuk 940 gram €8,77 | Zuivelmeester Belegen stuk 940 gram past niet bij '100 g Parmezaanse kaas' |
| poiesz | 100 g Parmezaanse kaas | Eru Cheddar 150 gram €2,00 | Eru Cheddar 150 gram past niet bij '100 g Parmezaanse kaas' |
| vomar | 100 g Parmezaanse kaas | Aardappelgratin kaas 500gr. 500gr €2,39 | Aardappelgratin kaas 500gr. 500gr past niet bij '100 g Parmezaanse kaas' |
| aldi | 100 g Parmezaanse kaas | Kaas saus 111 g €1,49 | Kaas saus 111 g past niet bij '100 g Parmezaanse kaas' |
| plus | 200 g feta | PLUS Borek spinazie & feta 1 st €1,09 | PLUS Borek spinazie & feta 1 st past niet bij '200 g feta' |
| dekamarkt | 100 g blauwe kaas | Zuivelmeester Kaas 30+ geraspt 200 g €2,35 | Zuivelmeester Kaas 30+ geraspt 200 g past niet bij '100 g blauwe kaas' |
| dirk | 100 g blauwe kaas | 1 de Beste Crackers kaas 200 g €1,65 | 1 de Beste Crackers kaas 200 g past niet bij '100 g blauwe kaas' |
| hoogvliet | 100 g blauwe kaas | Zuivelmeester Belegen stuk 940 gram €8,77 | Zuivelmeester Belegen stuk 940 gram past niet bij '100 g blauwe kaas' |
| poiesz | 100 g blauwe kaas | Eru Cheddar 150 gram €2,00 | Eru Cheddar 150 gram past niet bij '100 g blauwe kaas' |
| vomar | 100 g blauwe kaas | Aardappelgratin kaas 500gr. 500gr €2,39 | Aardappelgratin kaas 500gr. 500gr past niet bij '100 g blauwe kaas' |
| dekamarkt | 6 krentenbollen | DekaVers Fijn volkorenbollen 6 stuks stuk €1,19 | DekaVers Fijn volkorenbollen 6 stuks stuk past niet bij '6 krentenbollen' |
| poiesz | 4 pitabroodjes | Italiaanse bol afbakbroodjes 5 stuk €2,00 | Italiaanse bol afbakbroodjes 5 stuk past niet bij '4 pitabroodjes' |
| vomar | 4 pitabroodjes | Vomar kaiserbroodjes 10 st. €1,95 | Vomar kaiserbroodjes 10 st. past niet bij '4 pitabroodjes' |
| ah | 2 stokbroden | AH Knäckebröd goudbruin 375 g €1,25 | AH Knäckebröd goudbruin 375 g past niet bij '2 stokbroden' |
| dekamarkt | 2 stokbroden | Fjord Knäckebröd volkoren 250 g €0,99 | Fjord Knäckebröd volkoren 250 g past niet bij '2 stokbroden' |
| dirk | 2 stokbroden | 1 de Beste Knäckebröd sesam 375 g €1,24 | 1 de Beste Knäckebröd sesam 375 g past niet bij '2 stokbroden' |
| hoogvliet | 2 stokbroden | Fjord Knäckebröd volkoren 250 gram €0,95 | Fjord Knäckebröd volkoren 250 gram past niet bij '2 stokbroden' |
| jumbo | 2 stokbroden | Jumbo Knäckebröd Sesam 5 x 5 Stuks 375 g €1,19 | Jumbo Knäckebröd Sesam 5 x 5 Stuks 375 g past niet bij '2 stokbroden' |
| plus | 2 stokbroden | PLUS Knackebrod goudbruin 375 g €1,49 | PLUS Knackebrod goudbruin 375 g past niet bij '2 stokbroden' |
| spar | 2 stokbroden | Fjord Knackerbrod Volkoren 250 gram €1,19 | Fjord Knackerbrod Volkoren 250 gram past niet bij '2 stokbroden' |
| dekamarkt | 1 pot honing | Marne Mosterd honing 235 g €1,55 | Marne Mosterd honing 235 g past niet bij '1 pot honing' |
| jumbo | 1 pot honing | Jumbo Honing Pomelo €1,99 | Jumbo Honing Pomelo past niet bij '1 pot honing' |
| poiesz | 1 pot honing | Elephant Pretzel honing-mosterd 70 gram €1,00 | Elephant Pretzel honing-mosterd 70 gram past niet bij '1 pot honing' |
| vomar | 1 pot honing | Elinas griekse yoghurt honing €1,99 | Elinas griekse yoghurt honing past niet bij '1 pot honing' |
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
| ah | 1 zakje tacokruiden | AH Paneermeel kruiden 150 g €0,79 | AH Paneermeel kruiden 150 g past niet bij '1 zakje tacokruiden' |
| dekamarkt | 1 zakje tacokruiden | Silvo Patatkruiden 83 g €2,79 | Silvo Patatkruiden 83 g past niet bij '1 zakje tacokruiden' |
| dirk | 1 zakje tacokruiden | 1 de Beste Paneermeel kruiden 150 g €0,72 | 1 de Beste Paneermeel kruiden 150 g past niet bij '1 zakje tacokruiden' |
| hoogvliet | 1 zakje tacokruiden | Paturain Kruiden 90 gram €1,99 | Paturain Kruiden 90 gram past niet bij '1 zakje tacokruiden' |
| jumbo | 1 zakje tacokruiden | Jumbo Kruiden Soepcroutons 75 g 75 g €0,79 | Jumbo Kruiden Soepcroutons 75 g 75 g past niet bij '1 zakje tacokruiden' |
| lidl | 1 zakje tacokruiden | Kerriekruiden 45 g €0,53 | Kerriekruiden 45 g past niet bij '1 zakje tacokruiden' |
| plus | 1 zakje tacokruiden | PLUS Kruiden paneermeel 150 g €0,75 | PLUS Kruiden paneermeel 150 g past niet bij '1 zakje tacokruiden' |
| poiesz | 1 zakje tacokruiden | Kaptein Smeerkaas Tuinkruiden 20+ 100 gram €1,29 | Kaptein Smeerkaas Tuinkruiden 20+ 100 gram past niet bij '1 zakje tacokruiden' |
| spar | 1 zakje tacokruiden | Verstegen inmaakkruiden 5 gram €1,95 | Verstegen inmaakkruiden 5 gram past niet bij '1 zakje tacokruiden' |
| aldi | 1 zakje tacokruiden | Tuinkruiden saus 75 g €1,49 | Tuinkruiden saus 75 g past niet bij '1 zakje tacokruiden' |
| ah | 1 zakje nasikruiden | AH Pangasiusfilet tuinkruiden ca. 310 g €5,49 | AH Pangasiusfilet tuinkruiden ca. 310 g past niet bij '1 zakje nasikruiden' |
| dekamarkt | 1 zakje nasikruiden | Silvo Eikruiden 62 g €2,79 | Silvo Eikruiden 62 g past niet bij '1 zakje nasikruiden' |
| dirk | 1 zakje nasikruiden | 1 de Beste Paneermeel kruiden 150 g €0,72 | 1 de Beste Paneermeel kruiden 150 g past niet bij '1 zakje nasikruiden' |
| hoogvliet | 1 zakje nasikruiden | Paturain Kruiden 90 gram €1,99 | Paturain Kruiden 90 gram past niet bij '1 zakje nasikruiden' |
| lidl | 1 zakje nasikruiden | Kerriekruiden 45 g €0,53 | Kerriekruiden 45 g past niet bij '1 zakje nasikruiden' |
| poiesz | 1 zakje nasikruiden | Kaptein Smeerkaas Tuinkruiden 20+ 100 gram €1,29 | Kaptein Smeerkaas Tuinkruiden 20+ 100 gram past niet bij '1 zakje nasikruiden' |
| spar | 1 zakje nasikruiden | Verstegen inmaakkruiden 5 gram €1,95 | Verstegen inmaakkruiden 5 gram past niet bij '1 zakje nasikruiden' |
| aldi | 1 zakje nasikruiden | Tuinkruiden saus 75 g €1,49 | Tuinkruiden saus 75 g past niet bij '1 zakje nasikruiden' |
| hoogvliet | 150 ml teriyakisaus | Boon Zwarte bonen in teriyakisaus 390 gram €2,74 | Boon Zwarte bonen in teriyakisaus 390 gram past niet bij '150 ml teriyakisaus' |
| jumbo | 150 ml teriyakisaus | Boon Zwarte Bonen in Teriyakisaus 200 g 200 g €1,19 | Boon Zwarte Bonen in Teriyakisaus 200 g 200 g past niet bij '150 ml teriyakisaus' |
| plus | 150 ml teriyakisaus | BOON Zwarte bonen in teriyakisaus 390 g €2,79 | BOON Zwarte bonen in teriyakisaus 390 g past niet bij '150 ml teriyakisaus' |
| aldi | 150 ml teriyakisaus | Chilisaus 700 ml €1,49 | Chilisaus 700 ml past niet bij '150 ml teriyakisaus' |
| aldi | 150 ml sojasaus | Slasaus halfvol 500 ml €1,45 | Slasaus halfvol 500 ml past niet bij '150 ml sojasaus' |
| hoogvliet | 1 pot rode currypasta | G'woon Duopasta 750 gram €3,95 | G'woon Duopasta 750 gram past niet bij '1 pot rode currypasta' |
| plus | 1 pot rode currypasta | Smaakt Rode linzenpasta bio 200 g €2,96 | Smaakt Rode linzenpasta bio 200 g past niet bij '1 pot rode currypasta' |
| poiesz | 1 pot rode currypasta | Toko Lien Knoflookpasta 200 gram €2,29 | Toko Lien Knoflookpasta 200 gram past niet bij '1 pot rode currypasta' |
| vomar | 1 pot rode currypasta | Fl.brand trassi pasta 25gr 25gr €0,79 | Fl.brand trassi pasta 25gr 25gr past niet bij '1 pot rode currypasta' |
| aldi | 1 pot rode currypasta | Boterhampasta 750 g €2,49 | Boterhampasta 750 g past niet bij '1 pot rode currypasta' |
| hoogvliet | 150 g rijstvellen | Frikandellen 20 stuks €3,59 | Frikandellen 20 stuks past niet bij '150 g rijstvellen' |
| plus | 150 g rijstvellen | Springhome Loempiavellen 550 g €3,49 | Springhome Loempiavellen 550 g past niet bij '150 g rijstvellen' |
| poiesz | 1 blik tomatenblokjes | Aanmaakblokjes Bruin 632 gram €2,69 | Aanmaakblokjes Bruin 632 gram past niet bij '1 blik tomatenblokjes' |
| vomar | 1 blik tomatenblokjes | Vanka satestokjes 18cm 100st €0,44 | Vanka satestokjes 18cm 100st past niet bij '1 blik tomatenblokjes' |
| poiesz | 1 blikje tomatenpuree | Verse aardappelpuree 500 gram €1,80 | Verse aardappelpuree 500 gram past niet bij '1 blikje tomatenpuree' |
| vomar | 1 blikje tomatenpuree | G'woon aardappelpuree 3x60gr. 60gr €0,56 | G'woon aardappelpuree 3x60gr. 60gr past niet bij '1 blikje tomatenpuree' |
| poiesz | 1 pot pastasaus | Yildriz Turkse Shoarmasaus 265 milliliter €2,64 | Yildriz Turkse Shoarmasaus 265 milliliter past niet bij '1 pot pastasaus' |
| ah | 1 blik mais | AH Terra Bonenmix maïs 200 g €1,19 | AH Terra Bonenmix maïs 200 g past niet bij '1 blik mais' |
| vomar | 1 blik mais | G'woon maisolie 1 liter 1 liter €2,99 | G'woon maisolie 1 liter 1 liter past niet bij '1 blik mais' |
| poiesz | 1 blik doperwten | Unox Soep Erwt 300 milliliter €2,15 | Unox Soep Erwt 300 milliliter past niet bij '1 blik doperwten' |
| vomar | 1 blik doperwten | Unox erwten soep  800ml 800ml €2,99 | Unox erwten soep  800ml 800ml past niet bij '1 blik doperwten' |
| poiesz | 1 pot kappertjes | Ambachtelijke Knappertjes 140 gram €1,87 | Ambachtelijke Knappertjes 140 gram past niet bij '1 pot kappertjes' |
| jumbo | 1 fles ketchup | Zaanse Curry Ketchup 190ml €1,49 | Zaanse Curry Ketchup 190ml past niet bij '1 fles ketchup' |
| spar | 1 fles ketchup | Zaanse curry ketchup 190 ml 190 milliliter €1,69 | Zaanse curry ketchup 190 ml 190 milliliter past niet bij '1 fles ketchup' |
| aldi | 1 fles ketchup | Curry ketchup 875 ml €1,79 | Curry ketchup 875 ml past niet bij '1 fles ketchup' |
| ah | 1 pot mayonaise | AH Sriracha mayonaise 60 g €1,39 | AH Sriracha mayonaise 60 g past niet bij '1 pot mayonaise' |
| aldi | 1 fles olijfolie | Tonijn in olijfolie 160 g €1,89 | Tonijn in olijfolie 160 g past niet bij '1 fles olijfolie' |
| aldi | 1 fles zonnebloemolie | Sardines in zonnebloemolie 120 g €1,69 | Sardines in zonnebloemolie 120 g past niet bij '1 fles zonnebloemolie' |
| aldi | 2 el olijfolie | Tonijn in olijfolie 160 g €1,89 | Tonijn in olijfolie 160 g past niet bij '2 el olijfolie' |
| hoogvliet | 1 el sesamolie | G'woon Zonnebloemolie 1 liter €1,48 | G'woon Zonnebloemolie 1 liter past niet bij '1 el sesamolie' |
| aldi | 1 el sesamolie | Sardines in zonnebloemolie 120 g €1,69 | Sardines in zonnebloemolie 120 g past niet bij '1 el sesamolie' |
| poiesz | 1 kg bloem | Allesreinigersdoekjes bloemen 80 stuks €1,25 | Allesreinigersdoekjes bloemen 80 stuks past niet bij '1 kg bloem' |
| poiesz | 1 pak poedersuiker | g'woon Koekrepen 30% minder suiker 300 gram €1,87 | g'woon Koekrepen 30% minder suiker 300 gram past niet bij '1 pak poedersuiker' |
| vomar | 1 pak poedersuiker | Peijnenburg geen suiker gesn €2,09 | Peijnenburg geen suiker gesn past niet bij '1 pak poedersuiker' |
| poiesz | 1 zakje bakpoeder | Ecostyle stekpoeder 400 milliliter €5,99 | Ecostyle stekpoeder 400 milliliter past niet bij '1 zakje bakpoeder' |
| vomar | 1 zakje bakpoeder | Omo wit waspoeder 14sc €5,39 | Omo wit waspoeder 14sc past niet bij '1 zakje bakpoeder' |
| poiesz | 1 pakje bouillonblokjes | Aanmaakblokjes Bruin 632 gram €2,69 | Aanmaakblokjes Bruin 632 gram past niet bij '1 pakje bouillonblokjes' |
| vomar | 1 pakje bouillonblokjes | Vanka satestokjes 18cm 100st €0,44 | Vanka satestokjes 18cm 100st past niet bij '1 pakje bouillonblokjes' |
| aldi | 1 pakje bouillonblokjes | Tomatenblokjes 400 g €0,33 | Tomatenblokjes 400 g past niet bij '1 pakje bouillonblokjes' |
| vomar | 1 pak kippenbouillon | Dhillon santen 198gr 198gr €2,19 | Dhillon santen 198gr 198gr past niet bij '1 pak kippenbouillon' |
| dekamarkt | 1 blok pure chocolade | BioToday Rijstwafels pure chocolade 100 g €1,79 | BioToday Rijstwafels pure chocolade 100 g past niet bij '1 blok pure chocolade' |
| aldi | 1 blok pure chocolade | Chocolade pinda's melk 200 g €1,48 | Chocolade pinda's melk 200 g past niet bij '1 blok pure chocolade' |
| poiesz | 200 g walnoten | Epixs borrelnoten crunch 275 gram €1,99 | Epixs borrelnoten crunch 275 gram past niet bij '200 g walnoten' |
| vomar | 200 g walnoten | Noten vruchtenwijn 750ml 750ml €2,89 | Noten vruchtenwijn 750ml 750ml past niet bij '200 g walnoten' |
| poiesz | 200 g cashewnoten | Ambachtelijke Kruidnoten 300 gram €2,00 | Ambachtelijke Kruidnoten 300 gram past niet bij '200 g cashewnoten' |
| vomar | 200 g cashewnoten | Noten vruchtenwijn 750ml 750ml €2,89 | Noten vruchtenwijn 750ml 750ml past niet bij '200 g cashewnoten' |
| vomar | 100 g pijnboompitten | Bio+ zonnebloempitten 500gr 500gr €2,99 | Bio+ zonnebloempitten 500gr 500gr past niet bij '100 g pijnboompitten' |
| jumbo | 1 zak rozijnen | Jumbo - Rozijnen Krentenbollen - 6 Stuks €1,48 | Jumbo - Rozijnen Krentenbollen - 6 Stuks past niet bij '1 zak rozijnen' |
| poiesz | 1 zak rozijnen | g'woon Koekrepen Rozijn 390 gram €1,42 | g'woon Koekrepen Rozijn 390 gram past niet bij '1 zak rozijnen' |
| vomar | 1 zak rozijnen | G'woon koekreep rozijn €1,20 | G'woon koekreep rozijn past niet bij '1 zak rozijnen' |
| poiesz | 1 blik ananas | Ananas-Meloen-Mangosap 500 milliliter €2,69 | Ananas-Meloen-Mangosap 500 milliliter past niet bij '1 blik ananas' |
| poiesz | 1 tl paprikapoeder | Ecostyle stekpoeder 400 milliliter €5,99 | Ecostyle stekpoeder 400 milliliter past niet bij '1 tl paprikapoeder' |
| dekamarkt | 1 tl komijn | DekaVers Kaasblokjes komijn 100 g €2,29 | DekaVers Kaasblokjes komijn 100 g past niet bij '1 tl komijn' |
| poiesz | 1 tl komijn | Kaptein Smeerkaas Komijn 20+ 100 gram €1,29 | Kaptein Smeerkaas Komijn 20+ 100 gram past niet bij '1 tl komijn' |
| spar | 1 tl komijn | Melkan Kaas Komijn jong belegen plakken 190 gram €3,59 | Melkan Kaas Komijn jong belegen plakken 190 gram past niet bij '1 tl komijn' |
| aldi | 1 tl komijn | Goudse kaas Toscaanse kruiden of komijn 30+ plakken 200 g €2,85 | Goudse kaas Toscaanse kruiden of komijn 30+ plakken 200 g past niet bij '1 tl komijn' |
| jumbo | 1 tl kerriepoeder | Jumbo Uienpoeder 30 g 30 g €1,79 | Jumbo Uienpoeder 30 g 30 g past niet bij '1 tl kerriepoeder' |
| lidl | 1 tl kerriepoeder | Paprikapoeder 50 g €0,76 | Paprikapoeder 50 g past niet bij '1 tl kerriepoeder' |
| poiesz | 1 tl kerriepoeder | Ecostyle stekpoeder 400 milliliter €5,99 | Ecostyle stekpoeder 400 milliliter past niet bij '1 tl kerriepoeder' |
| vomar | 1 tl kerriepoeder | Omo wit waspoeder 14sc €5,39 | Omo wit waspoeder 14sc past niet bij '1 tl kerriepoeder' |
| poiesz | 1 tl kaneel | Appel kaneel vlaai 1 stuk €6,99 | Appel kaneel vlaai 1 stuk past niet bij '1 tl kaneel' |
| spar | 1 tl kaneel | Hak Appelmoes Kaneel 355 gram €2,75 | Hak Appelmoes Kaneel 355 gram past niet bij '1 tl kaneel' |
| poiesz | 1 tl Italiaanse kruiden | Krieltjes met groene kruiden 450 gram €2,50 | Krieltjes met groene kruiden 450 gram past niet bij '1 tl Italiaanse kruiden' |
| vomar | 1 tl Italiaanse kruiden | G'woon koekreep kruidkoek €1,24 | G'woon koekreep kruidkoek past niet bij '1 tl Italiaanse kruiden' |
| aldi | 1 tl Italiaanse kruiden | Aardappelpartjes gekruid 750 g €1,27 | Aardappelpartjes gekruid 750 g past niet bij '1 tl Italiaanse kruiden' |
| hoogvliet | 1 tl chilivlokken | Choca Vlokken 300 gram €1,99 | Choca Vlokken 300 gram past niet bij '1 tl chilivlokken' |
| plus | 1 tl chilivlokken | Choca Vlokken 300 g €1,79 | Choca Vlokken 300 g past niet bij '1 tl chilivlokken' |
| dekamarkt | 1 tl gemberpoeder | Mentholpoeder 75 g €3,65 | Mentholpoeder 75 g past niet bij '1 tl gemberpoeder' |
| dirk | 1 tl gemberpoeder | 1 de Beste Kaneelpoeder 40 g €0,65 | 1 de Beste Kaneelpoeder 40 g past niet bij '1 tl gemberpoeder' |
| hoogvliet | 1 tl gemberpoeder | G'woon Zwarte peperpoeder 50 gram €0,79 | G'woon Zwarte peperpoeder 50 gram past niet bij '1 tl gemberpoeder' |
| jumbo | 1 tl gemberpoeder | Jumbo Uienpoeder 30 g 30 g €1,79 | Jumbo Uienpoeder 30 g 30 g past niet bij '1 tl gemberpoeder' |
| lidl | 1 tl gemberpoeder | Glitterpoeder €2,99 | Glitterpoeder past niet bij '1 tl gemberpoeder' |
| plus | 1 tl gemberpoeder | PLUS Paprikapoeder 48 g €0,70 | PLUS Paprikapoeder 48 g past niet bij '1 tl gemberpoeder' |
| poiesz | 1 tl gemberpoeder | Ecostyle stekpoeder 400 milliliter €5,99 | Ecostyle stekpoeder 400 milliliter past niet bij '1 tl gemberpoeder' |
| spar | 1 tl gemberpoeder | Verstegen uienpoeder 50 gram €3,45 | Verstegen uienpoeder 50 gram past niet bij '1 tl gemberpoeder' |
| vomar | 1 tl gemberpoeder | Omo wit waspoeder 14sc €5,39 | Omo wit waspoeder 14sc past niet bij '1 tl gemberpoeder' |
| aldi | zout | Zoute popcorn 100 g €0,88 | Zoute popcorn 100 g past niet bij 'zout' |
| poiesz | peper | Partjes peper - zeezout 450 gram €2,50 | Partjes peper - zeezout 450 gram past niet bij 'peper' |
| spar | peper | rode pepers 2 stuks €1,25 | rode pepers 2 stuks past niet bij 'peper' |
| lidl | 1 tl knoflookpoeder | Salmiakpoeder €1,99 | Salmiakpoeder past niet bij '1 tl knoflookpoeder' |
| poiesz | 1 tl knoflookpoeder | Ecostyle stekpoeder 400 milliliter €5,99 | Ecostyle stekpoeder 400 milliliter past niet bij '1 tl knoflookpoeder' |
| vomar | 1 tl knoflookpoeder | Omo wit waspoeder 14sc €5,39 | Omo wit waspoeder 14sc past niet bij '1 tl knoflookpoeder' |
| dekamarkt | 6 flessen water | Gedemineraliseerd water 1 liter €0,84 | Gedemineraliseerd water 1 liter past niet bij '6 flessen water' |
| dirk | 6 flessen water | Gedemineraliseerd water 1 liter €0,72 | Gedemineraliseerd water 1 liter past niet bij '6 flessen water' |
| plus | 1 pak thee | PLUS IJsthee groene thee 500 ml €0,59 | PLUS IJsthee groene thee 500 ml past niet bij '1 pak thee' |
| jumbo | 1 pak toiletpapier | Jumbo Sensitive Vochtig Toiletpapier 40 Stuks €0,89 | Jumbo Sensitive Vochtig Toiletpapier 40 Stuks past niet bij '1 pak toiletpapier' |
| poiesz | 1 pak toiletpapier | Inpakpapier 200*70cm 1 stuks €1,00 | Inpakpapier 200*70cm 1 stuks past niet bij '1 pak toiletpapier' |
| poiesz | 1 rol keukenpapier | Inpakpapier 200*70cm 1 stuks €1,00 | Inpakpapier 200*70cm 1 stuks past niet bij '1 rol keukenpapier' |
| aldi | 1 pak vaatwastabletten | Aardappel-ovenkroketten 750 g €1,44 | Aardappel-ovenkroketten 750 g past niet bij '1 pak vaatwastabletten' |
| poiesz | 1 pak vuilniszakken | Ovengebakken gehakt 100 gram €2,29 | Ovengebakken gehakt 100 gram past niet bij '1 pak vuilniszakken' |
| vomar | 1 pak vuilniszakken | Fl.br. gebakken emping 80gr . g €1,99 | Fl.br. gebakken emping 80gr . g past niet bij '1 pak vuilniszakken' |
| aldi | 1 pak vuilniszakken | Rookkaasplakken 45+ 150 g €1,99 | Rookkaasplakken 45+ 150 g past niet bij '1 pak vuilniszakken' |
| aldi | 1 tube tandpasta | Boterhampasta 750 g €2,49 | Boterhampasta 750 g past niet bij '1 tube tandpasta' |
| dirk | 1 rol aluminiumfolie | 1 de Beste Olijfolie traditioneel 250 ml €3,05 | 1 de Beste Olijfolie traditioneel 250 ml past niet bij '1 rol aluminiumfolie' |
| poiesz | 1 rol aluminiumfolie | g'woon Olijfolie Traditioneel 250 milliliter €3,49 | g'woon Olijfolie Traditioneel 250 milliliter past niet bij '1 rol aluminiumfolie' |
| vomar | 1 rol aluminiumfolie | Biologische olijfolie €9,99 | Biologische olijfolie past niet bij '1 rol aluminiumfolie' |
| aldi | 1 rol aluminiumfolie | Tonijn in olijfolie 160 g €1,89 | Tonijn in olijfolie 160 g past niet bij '1 rol aluminiumfolie' |

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
| 2026-11-25 | 309 | 62 | 2485 | 306 | 368 |
