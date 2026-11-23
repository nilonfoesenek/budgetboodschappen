/* Matching-logica voor de boodschappen-app (los bestand zodat het ook in tests draait). */
(function (root) {
  const STOP = new Set(['van', 'de', 'het', 'een', 'en', 'of', 'met', 'voor', 'in', 'op', 'vers', 'verse', 'gram', 'gr', 'g', 'kg', 'ml', 'cl', 'l', 'liter', 'stuk', 'stuks', 'st', 'ca', 'x', 'per', 'pak', 'zak', 'bak', 'pot', 'blik', 'fles']);
  const IGN = new Set(['ah', 'jumbo', 'jumbos', 'aldi', 'milsani', 'golden', 'seafood', 'excellent', 'basic', 'huismerk', 'plus', 'dirk', 'beste', 'lidl', 'zuivelmeester', 'neutraal', 'vleeschmeesters']);
  const BAN = ['kattenvoer', 'hondenvoer', 'kattensnack', 'hondensnack', 'sheba', 'whiskas', 'felix', 'pedigree', 'kitekat', 'dreamies', 'olvarit', 'hipp', 'nutrilon', 'kat ', 'hond ', 'pets unlimited', 'gesuikerde', 'mousse', 'creamer', 'katten', 'honden', 'max mila', 'reinigingsmelk', 'bodymilk', 'bodylotion', 'kattenbrok', 'hondenbrok'];
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/'s\b/g, 's').replace(/[^a-z0-9.,]+/g, ' ').trim();
  const toks = s => norm(s).split(' ').map(t => t.replace(/[.,]/g, '')).filter(t => t.length > 1 && !STOP.has(t) && !/^\d/.test(t));
  const stem = t => (t.length > 5 ? t.replace(/(en|s|e)$/, '') : t);

  function parseQty(s) {
    s = String(s || '').toLowerCase().replace(/,/g, '.');
    let m = s.match(/(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*(kg|gram|gr|g|ml|cl|liter|ltr|lt|l)\b/);
    let n = 1, q, u;
    if (m) { n = +m[1]; q = +m[2]; u = m[3]; }
    else {
      m = s.match(/(\d+(?:\.\d+)?)\s*(kg|kilo|gram|gr|g|ml|cl|liter|ltr|lt|l|stuks|stuk|st)\b/);
      if (m) { q = +m[1]; u = m[2]; }
      else if (/per stuk|per krop|per bos|per tros|heel|half/.test(s)) return { q: 1, d: 'st' };
      else return null;
    }
    q *= n;
    if (u === 'g' || u === 'gr' || u === 'gram') return { q: q / 1000, d: 'kg' };
    if (u === 'kg' || u === 'kilo') return { q, d: 'kg' };
    if (u === 'ml') return { q: q / 1000, d: 'l' };
    if (u === 'cl') return { q: q / 100, d: 'l' };
    if (u === 'l' || u === 'liter' || u === 'ltr' || u === 'lt') return { q, d: 'l' };
    return { q, d: 'st' };
  }

  function indexStore(rows) {
    const out = [];
    for (const r of rows) {
      const name = r[0], low = ' ' + norm(name) + ' ';
      if (BAN.some(b => low.includes(' ' + b))) continue;
      const t = toks(name).filter(x => !IGN.has(x));
      out.push({ name, price: r[1], size: r[2] || '', t, j: t.join(''), qty: parseQty(r[2]) || parseQty(name) });
    }
    return out;
  }

  function parseLine(line) {
    let s = String(line || '').replace(/\(.*?\)/g, ' ').replace(/^[\s\-*•·\[\]x✓☐]+/, '').trim();
    if (!s) return null;
    let n = 1, req = null, m;
    const U = '(kg|kilo|gram|gr|g|ml|cl|liter|l|stuks|stuk|st|x)';
    if ((m = s.match(new RegExp('^(\\d+(?:[.,]\\d+)?)\\s*' + U + '?\\.?\\s+(.+)$', 'i')))) {
      const v = +m[1].replace(',', '.'), u = (m[2] || '').toLowerCase();
      s = m[3];
      if (!u || u === 'x' || u.startsWith('st')) n = Math.max(1, Math.round(v)); else req = parseQty(v + ' ' + u);
    } else if ((m = s.match(new RegExp('^(.+?)\\s+(\\d+(?:[.,]\\d+)?)\\s*' + U + '$', 'i')))) {
      const v = +m[2].replace(',', '.'), u = (m[3] || '').toLowerCase();
      s = m[1];
      if (!u || u === 'x' || u.startsWith('st')) n = Math.max(1, Math.round(v)); else req = parseQty(v + ' ' + u);
    }
    const t = toks(s);
    return t.length ? { label: s.trim(), t, n, req } : null;
  }

  // bewerkte vormen: '500 g aardappels' ≠ aardappelkroketjes, 'tomaten' ≠ tomatensoep
  const PROC = new Set(['kroketjes', 'kroketten', 'puree', 'friet', 'frites', 'patat', 'chips', 'rosti', 'wedges', 'partjes', 'schijfjes', 'soep', 'saus', 'salade', 'spread', 'smoothie', 'sap', 'reep', 'repen', 'koek', 'koekjes', 'taart', 'cake', 'muffin', 'pizza', 'mix', 'poeder', 'siroop', 'snack', 'snacks', 'crackers', 'gedroogde', 'ingelegd', 'ingelegde', 'tapenade', 'pesto', 'jam', 'compote', 'moes', 'reepjes', 'gesneden']);
  const PROCEND = ['chips', 'soep', 'saus', 'salade', 'kroketjes', 'puree', 'taart', 'koek', 'koekjes', 'reep', 'snack', 'schotel', 'lasagne', 'pizza', 'spread', 'drank'];
  ['lasagne', 'ovenschotel', 'maaltijd'].forEach(x => PROC.add(x));
  // samenstellingen die een ánder product zijn: chocobananen ≠ bananen, koffiemelk ≠ melk
  const BADPRE = ['choco', 'schuim', 'koffie', 'snoep', 'kauw', 'drink', 'zuig', 'spek', 'karne', 'kokos', 'soja', 'haver', 'amandel', 'rijst', 'snack', 'mini', 'gevulde', 'ijs', 'bak'];
  function tokScore(q, pt) {
    const st = stem(q);
    let best = Infinity;
    for (const p of pt) {
      let sc;
      if (p === q || p === st || (p.startsWith(st) && /^(en|s|e|n|jes|tjes)$/.test(p.slice(st.length)))) sc = 0;
      else if (p.endsWith(q) || (st.length > 3 && p.endsWith(st))) { if (BADPRE.some(b => p.startsWith(b) && !q.startsWith(b))) continue; sc = 0.3; }
      else if (p.startsWith(st)) sc = 1.5;
      else if (st.length > 3 && p.includes(st)) sc = 2;
      else continue;
      if (sc < best) best = sc;
    }
    return best;
  }

  function candidates(item, idx, limit) {
    const res = [];
    for (const p of idx) {
      let sc = 0, used = 0, ok = true;
      for (const q of item.t) { const s = tokScore(q, p.t); if (s === Infinity) { ok = false; break; } sc += s; used++; }
      if (!ok) continue;
      const extra = Math.max(0, p.t.length - used) + p.t.filter(x => !item.t.includes(x) && (PROC.has(x) || PROCEND.some(e => x.length > e.length + 2 && x.endsWith(e)))).length * 1.5;
      res.push({ p, m: sc, score: sc + extra });
    }
    if (!res.length) {
      const alt = item.t.map(t => SYN[t] || t);
      if (alt.some((t, i) => t !== item.t[i])) { const r2 = candidates({ ...item, t: alt }, idx, limit); if (r2.length) return r2; }
      return similar(item, idx, limit);
    }
    // Eerst de beste woord-match (eieren ≠ eierkoeken), daarna zo min mogelijk extra woorden.
    const minM = Math.min(...res.map(r => r.m));
    const good = res.filter(r => r.m <= minM + 1);
    const min = Math.min(...good.map(r => r.score));
    let pool = good.filter(r => r.score <= min + 0.5);
    if (minM >= 1.5) for (const r of pool) r.sub = true; // alleen een woord dat ermee begint (bananenchips bij 'bananen'): vervanger
    const dim = item.req ? item.req.d : mode(pool.map(r => r.p.qty && r.p.qty.d));
    for (const r of pool) r.cost = costOf(item, r.p, dim);
    pool.sort((a, b) => a.cost.rank - b.cost.rank || a.p.price - b.p.price);
    if (limit) {
      const rest = res.filter(r => r.score > min + 0.5).sort((a, b) => a.score - b.score).slice(0, limit);
      for (const r of rest) r.cost = costOf(item, r.p, dim);
      return pool.slice(0, limit).concat(rest).slice(0, limit);
    }
    return pool;
  }
  // Geen exacte match: zoek het product dat er het meest op lijkt (gemarkeerd als vervanger).
  const SYN = { havermelk: 'haverdrink', sojamelk: 'sojadrink', amandelmelk: 'amandeldrink', rijstmelk: 'rijstdrink', kokosdrink: 'kokosmelk', vegaburger: 'vegetarische', zoetaardappel: 'zoete', courgettes: 'courgette', aubergines: 'aubergine' };
  const tri = w => { const o = []; for (let i = 0; i + 3 <= w.length; i++) o.push(w.slice(i, i + 3)); return o; };
  function fuzzy(q, p) { const tg = tri(q); if (tg.length < 2) return 0; let h = 0; for (const g of tg) if (p.j.includes(g)) h++; return h / tg.length; }
  function similar(item, idx, limit) {
    const q = item.t, last = q.length - 1, res = [];
    for (const p of idx) {
      let sc = 0, miss = 0, headOk = false, used = 0;
      for (let i = 0; i < q.length; i++) {
        const w = q[i]; let s = tokScore(w, p.t), parts = 1;
        if (s === Infinity && w.length >= 7) { // samengesteld woord: zuurdesem+brood, kokos+yoghurt
          for (let k = 3; k <= w.length - 3 && s === Infinity; k++) {
            const sb = tokScore(w.slice(k), p.t); if (sb > 0.3) continue;
            const sa = tokScore(w.slice(0, k), p.t);
            if (sa <= 1.5) { s = 1 + (sa + sb) / 2; parts = 2; }
            else if (w.length - k >= 5) s = 2.6 - 1.5 * fuzzy(w, p); // alleen het kernwoord (…brood, …blokjes)
          }
        }
        if (s === Infinity && w.length >= 6) { // tikfout of andere schrijfwijze, maar met hetzelfde kernwoord
          const f = fuzzy(w, p), tail = w.slice(-4);
          if (f >= 0.7 && p.t.some(t => t.endsWith(tail))) s = 1.5 + (1 - f) * 3;
        }
        if (s === Infinity) { miss++; continue; }
        sc += s; used += parts; if (i === last) headOk = true;
      }
      if (!headOk || miss >= q.length) continue;
      const extra = Math.max(0, p.t.length - used);
      res.push({ p, score: sc + 1.2 * miss + 0.25 * extra, sub: true });
    }
    if (!res.length) return [];
    res.sort((a, b) => a.score - b.score);
    const min = res[0].score, pool = res.filter(r => r.score <= min + 0.25).slice(0, 40);
    const dim = item.req ? item.req.d : mode(pool.map(r => r.p.qty && r.p.qty.d));
    for (const r of pool) r.cost = costOf(item, r.p, dim);
    pool.sort((a, b) => a.score - b.score || a.cost.rank - b.cost.rank);
    const rest = res.filter(r => !pool.includes(r)).slice(0, limit || 6);
    for (const r of rest) r.cost = costOf(item, r.p, dim);
    return limit ? pool.slice(0, limit).concat(rest).slice(0, limit) : pool;
  }
  function mode(a) { const c = {}; let b = null; for (const x of a) if (x) { c[x] = (c[x] || 0) + 1; if (!b || c[x] > c[b]) b = x; } return b; }
  const LOOSE = /(ui|uien|sjalot|paprika|appel|peer|peren|banaan|bananen|citroen|limoen|tomaat|tomaten|avocado|kiwi|sinaasappel|mandarijn|aardappel|wortel|courgette|aubergine|komkommer|knoflook|teen|tenen|champignon|nectarine|perzik|pruim)/i;
  function costOf(item, p, dim) {
    const q = p.qty;
    if (item.req && q && q.d === item.req.d && q.q > 0) {
      const packs = Math.max(1, Math.ceil(item.req.q / q.q - 1e-9));
      return { packs, total: packs * p.price, rank: packs * p.price };
    }
    const unit = q && q.d === dim && q.q > 0 ? p.price / q.q : null;
    // Aantal stuks gevraagd ("2 uien"): één verpakking volstaat als die groot genoeg is.
    let packs = item.n;
    if (q && q.d === 'st' && q.q > 1) packs = Math.max(1, Math.ceil(item.n / q.q - 1e-9));
    // losse groente/fruit in een zak: '2 uien' = 1 zak. Verpakte producten: '2 rookworsten' = 2 stuks.
    else if (q && q.d !== 'st' && LOOSE.test(item.label || '')) packs = 1;
    const total = packs * p.price;
    return { packs, total, rank: total + (unit != null ? unit / 1e4 : 0.01) };
  }

  function offerFor(item, offers, store) {
    let best = null;
    for (const o of offers) {
      if (o.s !== store) continue;
      const ot = o._t || (o._t = toks(o.n).filter(x => !IGN.has(x)));
      if (item.t.every(q => tokScore(q, ot) < 1)) { if (!best || (o.p || 99) < (best.p || 99)) best = o; }
    }
    return best;
  }

  root.Match = { norm, toks, parseQty, parseLine, indexStore, candidates, costOf, offerFor };
})(typeof window !== 'undefined' ? window : globalThis);
