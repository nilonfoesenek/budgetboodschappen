# BudgetBoodschappen

Boodschappenlijst-app die per supermarkt (AH, Jumbo, Aldi, Dirk, Plus, Lidl) laat zien waar je het goedkoopst uit bent, met de aanbiedingen van deze week.

- `data/` wordt elke maandag en woensdag automatisch bijgewerkt. Die updates hebben `[skip netlify]` in de commit: de app haalt de data rechtstreeks van GitHub, dus er is geen nieuwe Netlify-publicatie nodig (scheelt credits).
- `netlify/functions/`: pushmeldingen. `push-subscribe` (aan/afmelden, `/api/push`) en `push-check` (ma en wo 09:00 UTC: meldt favoriete recepten die ≥ 20% goedkoper zijn).
