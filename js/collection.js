/* ============================================================
   URHOM — collection page controller
   One script behind furniture.html, furnishing.html and
   interiors.html. The page names its collection with
   <body data-collection="…"> and everything else is read from
   js/catalog.js.

   Filtering, sorting, search and the view toggle are client side.
   The heart and the cart button hand off to js/store.js, which is
   shared with the header panels and persists to localStorage — the
   card no longer keeps a second copy of that state. There is still
   no payment, order or backend behind any of it.
   ============================================================ */
(function (w, d) {
  'use strict';

  var KEY = d.body.getAttribute('data-collection');
  var CAT = (w.URHOM && w.URHOM.catalog) || {};
  var C;

  if (KEY === 'all') {
    /* all-products.html renders every collection at once. Built here from the
       same catalogue rather than duplicated, so prices and names stay in one
       place. Product ids are namespaced because they only have to be unique
       within their own collection. */
    var keys = Object.keys(CAT);
    var cats = [], prods = [], facetKeys = {};
    keys.forEach(function (k) {
      var c = CAT[k];
      c.categories.forEach(function (x) {
        cats.push({ id: k + '/' + x.id, title: x.title, desc: c.label,
                    img: x.img, alt: x.alt, _assets: c.assets });
      });
      c.products.forEach(function (p) {
        var q = {}; for (var f in p) q[f] = p[f];
        q.id = k + '-' + p.id;
        q.cats = p.cats.map(function (x) { return k + '/' + x; });
        q._assets = c.assets;
        prods.push(q);
      });
      c.facets.forEach(function (f) { facetKeys[f.key] = f; });
    });
    C = { label:'All Products', page:'all-products.html', assets:'',
          blurb:'Everything URHOM makes.',
          price:{ min:200, max:500000, step:100 },
          facets: Object.keys(facetKeys).map(function (k) { return facetKeys[k]; }),
          categories: cats, products: prods };
  } else {
    C = CAT[KEY] || null;
  }
  if (!C) return;

  var A = C.assets, CATEGORIES = C.categories, PRODUCTS = C.products, FACETS = C.facets;

  /* a lookup box only earns its keep once the list is long enough that
     scanning it beats reading it */
  var LOOKUP_FROM = 7;

  var state = {
    cats: [], facets: {},
    min: C.price.min, max: C.price.max,
    sort: 'featured', q: '', view: 'grid'
  };

  var SHOP = w.URHOM && w.URHOM.store;
  /* "<collection>:<id>" is how the store addresses a product */
  var refOf = function (p) { return KEY + ':' + p.id; };

  var $  = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var rupee = function (n) { return '₹ ' + n.toLocaleString('en-IN'); };
  var esc   = function (s) { return String(s).replace(/[&<>"]/g, function (c) {
    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]; }); };
  var byId  = function (id) { for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i]; };
  var catTitle = function (id) { for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].id === id) return CATEGORIES[i].title; return id; };

  function pic(file, cls, alt, w2, h2, eager, base) {
    var A2 = base || A;
    return '<picture><source type="image/webp" srcset="' + A2 + file.replace('.jpg', '.webp') + '">' +
      '<img class="' + cls + '" src="' + A2 + file + '" alt="' + esc(alt) + '"' +
      (w2 ? ' width="' + w2 + '" height="' + h2 + '"' : '') +
      (eager ? '' : ' loading="lazy"') + ' decoding="async"></picture>';
  }

  /* ---------------- category strip ---------------- */

  function buildCategories() {
    var host = $('[data-catstrip]');
    if (!host) return;
    host.innerHTML = CATEGORIES.map(function (c) {
      return '<a class="catcard" href="#catalog" data-cat-link="' + c.id + '">' +
        '<span class="catcard__shot">' + pic(c.img, 'catcard__img', c.alt, 175, 87, true, c._assets) + '</span>' +
        '<span class="catcard__body">' +
          '<span class="catcard__text"><span class="catcard__title">' + esc(c.title) + '</span>' +
          '<span class="catcard__desc">' + esc(c.desc) + '</span></span>' +
          '<span class="catcard__go" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none">' +
          '<path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
        '</span></a>';
    }).join('');

    host.addEventListener('click', function (e) {
      var a = e.target.closest('[data-cat-link]');
      if (!a) return;
      e.preventDefault();
      selectCategory(a.getAttribute('data-cat-link'), true);
    });
  }

  function selectCategory(id, scroll) {
    state.cats = [id];
    $$('[data-cat]').forEach(function (i) { i.checked = (i.value === id); });
    render();
    if (scroll) {
      var t = d.getElementById('catalog');
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /* ---------------- filter rail ----------------
     Every group is a disclosure and they all start closed, so the rail
     opens as a list of headings rather than a wall of checkboxes. Only
     one group is open at a time; long lists get a lookup box. */

  function optionsFor(field) {
    var vals = [];
    PRODUCTS.forEach(function (p) { if (p[field] && vals.indexOf(p[field]) < 0) vals.push(p[field]); });
    return vals.sort();
  }

  function checkRow(name, value, count, attr) {
    return '<li data-opt="' + esc(value.toLowerCase()) + '"><label>' +
      '<input type="checkbox" value="' + esc(value) + '" ' + attr + '>' +
      '<span class="box" aria-hidden="true"></span>' +
      '<span class="lbl">' + esc(name) + '</span><span class="cnt">(' + count + ')</span>' +
      '</label></li>';
  }

  function lookupBox(n, label) {
    if (n < LOOKUP_FROM) return '';
    return '<div class="flookup"><input type="search" data-lookup placeholder="Find a ' +
      esc(label) + '…" aria-label="Filter the ' + esc(label) + ' list" autocomplete="off"></div>';
  }

  function groupHTML(id, label, body, n) {
    return '<section class="fgroup" data-group="' + id + '">' +
      '<button class="fgroup__head" type="button" aria-expanded="false" aria-controls="fg-' + id + '">' +
      '<span>' + esc(label) + '</span><span class="fgroup__n" data-group-n hidden></span>' +
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</button>' +
      '<div class="fgroup__body" id="fg-' + id + '">' + lookupBox(n || 0, label) + body + '</div>' +
      '</section>';
  }

  function buildFilters() {
    var host = $('[data-filter-groups]');
    if (!host) return;

    var catBody = '<ul class="checks" data-category-list>' + CATEGORIES.map(function (c) {
      var n = PRODUCTS.filter(function (p) { return p.cats.indexOf(c.id) > -1; }).length;
      return checkRow(c.title, c.id, n, 'data-cat');
    }).join('') + '</ul>';

    var price = '<div class="range" data-range>' +
      '<div class="range__track"><div class="range__fill" data-range-fill></div></div>' +
      '<input type="range" min="' + C.price.min + '" max="' + C.price.max + '" step="' + C.price.step +
        '" value="' + C.price.min + '" data-range-min aria-label="Minimum price">' +
      '<input type="range" min="' + C.price.min + '" max="' + C.price.max + '" step="' + C.price.step +
        '" value="' + C.price.max + '" data-range-max aria-label="Maximum price">' +
      '</div><div class="range__out"><span data-price-min></span><span data-price-max></span></div>';

    var html = groupHTML('category', 'Category', catBody, CATEGORIES.length) +
               groupHTML('price', 'Price Range', price);

    FACETS.forEach(function (f) {
      var vals = optionsFor(f.field);
      var body = '<ul class="checks" data-facet="' + f.key + '">' + vals.map(function (v) {
        var n = PRODUCTS.filter(function (p) { return p[f.field] === v; }).length;
        return checkRow(v, v, n, 'data-facet-input="' + f.key + '"');
      }).join('') + '</ul>';
      html += groupHTML(f.key, f.label, body, vals.length);
    });

    host.innerHTML = html;

    /* accordion — opening one closes the rest */
    $$('.fgroup__head', host).forEach(function (b) {
      b.addEventListener('click', function () {
        var sec = b.closest('.fgroup');
        var open = !sec.classList.contains('is-open');
        $$('.fgroup', host).forEach(function (s) {
          s.classList.remove('is-open');
          $('.fgroup__head', s).setAttribute('aria-expanded', 'false');
        });
        if (open) {
          sec.classList.add('is-open');
          b.setAttribute('aria-expanded', 'true');
          var lk = $('[data-lookup]', sec);
          if (lk) lk.focus();
        }
      });
    });

    /* lookup — narrows the list inside its own group only */
    host.addEventListener('input', function (e) {
      if (!e.target.matches('[data-lookup]')) return;
      var q = e.target.value.trim().toLowerCase();
      var sec = e.target.closest('.fgroup');
      var shown = 0;
      $$('li[data-opt]', sec).forEach(function (li) {
        var hit = !q || li.getAttribute('data-opt').indexOf(q) > -1 ||
                  $('.lbl', li).textContent.toLowerCase().indexOf(q) > -1;
        li.hidden = !hit;
        if (hit) shown++;
      });
      var none = $('.fnone', sec);
      if (!none) {
        none = d.createElement('p');
        none.className = 'fnone';
        $('.checks', sec).insertAdjacentElement('afterend', none);
      }
      none.textContent = 'Nothing matches “' + q + '”.';
      none.hidden = shown > 0;
    });

    host.addEventListener('change', function (e) {
      var t = e.target;
      if (t.matches('[data-cat]')) {
        state.cats = $$('[data-cat]:checked').map(function (i) { return i.value; });
        render();
      } else if (t.matches('[data-facet-input]')) {
        var f = t.getAttribute('data-facet-input');
        state.facets[f] = $$('[data-facet-input="' + f + '"]:checked').map(function (i) { return i.value; });
        render();
      }
    });

    wireRange();
  }

  var syncRange;

  function wireRange() {
    var lo = $('[data-range-min]'), hi = $('[data-range-max]'), fill = $('[data-range-fill]');
    var step = C.price.step;
    syncRange = function () {
      var a = +lo.value, b = +hi.value;
      if (a > b - step) {
        if (d.activeElement === lo) { a = b - step; lo.value = a; }
        else { b = a + step; hi.value = b; }
      }
      state.min = a; state.max = b;
      var span = +lo.max - +lo.min;
      fill.style.left  = ((a - lo.min) / span * 100) + '%';
      fill.style.right = (100 - (b - lo.min) / span * 100) + '%';
      $('[data-price-min]').textContent = rupee(a);
      $('[data-price-max]').textContent = rupee(b);
      render();
    };
    lo.addEventListener('input', syncRange);
    hi.addEventListener('input', syncRange);
    syncRange();
  }

  function clearAll() {
    state.cats = []; state.facets = {}; state.q = '';
    $$('.checks input').forEach(function (i) { i.checked = false; });
    $$('[data-lookup]').forEach(function (i) { i.value = ''; });
    $$('li[data-opt]').forEach(function (li) { li.hidden = false; });
    $$('.fnone').forEach(function (p) { p.hidden = true; });
    var s = $('[data-search]'); if (s) s.value = '';
    var lo = $('[data-range-min]'), hi = $('[data-range-max]');
    lo.value = lo.min; hi.value = hi.max;
    var sel = $('[data-sort]'); if (sel) { sel.value = 'featured'; state.sort = 'featured'; }
    syncRange();
  }

  /* ---------------- active filters ----------------
     With the groups closed, the only way to see what is applied is to
     say so above the grid. */

  function activeChips() {
    var out = [];
    state.cats.forEach(function (id) { out.push({ t: catTitle(id), kind: 'cat', v: id }); });
    FACETS.forEach(function (f) {
      (state.facets[f.key] || []).forEach(function (v) {
        out.push({ t: f.label + ': ' + v, kind: 'facet', g: f.key, v: v });
      });
    });
    if (state.min > C.price.min || state.max < C.price.max) {
      out.push({ t: rupee(state.min) + ' – ' + rupee(state.max), kind: 'price' });
    }
    if (state.q.trim()) out.push({ t: '“' + state.q.trim() + '”', kind: 'q' });
    return out;
  }

  function renderChips() {
    var host = $('[data-chips]');
    if (!host) return;
    var chips = activeChips();
    host.hidden = !chips.length;
    host.innerHTML = chips.length
      ? chips.map(function (c) {
          return '<button class="chip" type="button" aria-label="Remove filter ' + esc(c.t) + '"' +
            ' data-chip="' + c.kind + '"' +
            (c.g ? ' data-chip-group="' + c.g + '"' : '') +
            (c.v ? ' data-chip-value="' + esc(c.v) + '"' : '') + '>' +
            '<span>' + esc(c.t) + '</span>' +
            '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
            '<path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>' +
            '</button>';
        }).join('') + '<button class="chip chip--all" type="button" data-clear>Clear all</button>'
      : '';
    /* the count badge on each closed group header */
    $$('.fgroup').forEach(function (sec) {
      var id = sec.getAttribute('data-group');
      var n = id === 'category' ? state.cats.length
            : id === 'price'    ? ((state.min > C.price.min || state.max < C.price.max) ? 1 : 0)
            : (state.facets[id] || []).length;
      var badge = $('[data-group-n]', sec);
      badge.textContent = n;
      badge.hidden = !n;
    });
  }

  function dropChip(btn) {
    var kind = btn.getAttribute('data-chip');
    var val  = btn.getAttribute('data-chip-value');
    if (kind === 'cat') {
      state.cats = state.cats.filter(function (x) { return x !== val; });
      $$('[data-cat]').forEach(function (i) { if (i.value === val) i.checked = false; });
    } else if (kind === 'facet') {
      var g = btn.getAttribute('data-chip-group');
      state.facets[g] = (state.facets[g] || []).filter(function (x) { return x !== val; });
      $$('[data-facet-input="' + g + '"]').forEach(function (i) { if (i.value === val) i.checked = false; });
    } else if (kind === 'price') {
      var lo = $('[data-range-min]'), hi = $('[data-range-max]');
      lo.value = lo.min; hi.value = hi.max; syncRange(); return;
    } else if (kind === 'q') {
      state.q = ''; var s = $('[data-search]'); if (s) s.value = '';
    }
    render();
  }

  /* ---------------- product rendering ---------------- */

  function stars(r) {
    var out = '';
    for (var i = 1; i <= 5; i++) {
      var f = r >= i ? 'full' : (r >= i - 0.5 ? 'half' : 'empty');
      out += '<svg class="star is-' + f + '" viewBox="0 0 24 24" aria-hidden="true">' +
        '<path d="m12 2.6 2.9 6 6.6.9-4.8 4.6 1.2 6.5-5.9-3.1-5.9 3.1 1.2-6.5L2.5 9.5l6.6-.9z"/></svg>';
    }
    return '<span class="stars" role="img" aria-label="Rated ' + r + ' out of 5">' + out + '</span>';
  }

  function visible() {
    var q = state.q.trim().toLowerCase();
    return PRODUCTS.filter(function (p) {
      if (state.cats.length && !p.cats.some(function (c) { return state.cats.indexOf(c) > -1; })) return false;
      if (p.price < state.min || p.price > state.max) return false;
      for (var i = 0; i < FACETS.length; i++) {
        var sel = state.facets[FACETS[i].key];
        if (sel && sel.length && sel.indexOf(p[FACETS[i].field]) < 0) return false;
      }
      if (q) {
        var hay = [p.name, p.material, p.color, p.style, p.finish, p.room].concat(p.cats)
          .filter(Boolean).join(' ').toLowerCase();
        if (hay.indexOf(q) < 0) return false;
      }
      return true;
    });
  }

  function sorted(list) {
    var a = list.slice();
    if (state.sort === 'price-asc')  a.sort(function (x, y) { return x.price - y.price; });
    if (state.sort === 'price-desc') a.sort(function (x, y) { return y.price - x.price; });
    if (state.sort === 'rating')     a.sort(function (x, y) { return y.rating - x.rating || y.reviews - x.reviews; });
    if (state.sort === 'name')       a.sort(function (x, y) { return x.name.localeCompare(y.name); });
    return a;
  }

  function card(p) {
    return '<article class="pc" data-id="' + p.id + '">' +
      '<div class="pc__shot">' + pic(p.img, 'pc__img', p.alt, 280, 144, false, p._assets) +
        (p.tag ? '<span class="pc__tag">' + esc(p.tag) + '</span>' : '') +
        '<button class="pc__wish' + (SHOP && SHOP.hasWish(refOf(p)) ? ' is-on' : '') + '" type="button" data-wish="' + p.id + '"' +
        ' aria-pressed="' + (SHOP && SHOP.hasWish(refOf(p)) ? 'true' : 'false') + '" aria-label="Save ' + esc(p.name) + ' to wishlist">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7.2-4.5-7.2-9.4A4.2 4.2 0 0 1 12 8.1a4.2 4.2 0 0 1 7.2 2.5C19.2 15.5 12 20 12 20Z"/></svg></button>' +
      '</div>' +
      '<div class="pc__body">' +
        '<h3 class="pc__name">' + esc(p.name) + '</h3>' +
        '<div class="pc__rate">' + stars(p.rating) + '<span class="pc__rev">(' + p.reviews + ')</span></div>' +
        '<div class="pc__foot">' +
          '<div class="pc__left">' +
            '<span class="pc__priceline"><span class="pc__price">' + rupee(p.price) + '</span>' +
            (p.mrp ? '<s class="pc__mrp">' + rupee(p.mrp) + '</s>' : '') + '</span>' +
            '<span class="pc__sw">' + p.swatches.map(function (c) {
              return '<span class="sw" style="--c:' + c + '"></span>'; }).join('') + '</span></div>' +
          '<button class="pc__cart" type="button" data-add="' + p.id + '" aria-label="Add ' + esc(p.name) + ' to cart">' +
            '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.2 4h2.3l2 10.4h9.9l2-7.6H6.3" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.2" cy="19" r="1.4" fill="currentColor"/><circle cx="16.8" cy="19" r="1.4" fill="currentColor"/></svg>' +
          '</button>' +
        '</div>' +
      '</div></article>';
  }

  function render() {
    var list = sorted(visible());
    var grid = $('[data-grid]');
    grid.className = 'grid' + (state.view === 'list' ? ' is-list' : '');
    grid.innerHTML = list.map(card).join('');
    $('[data-empty]').hidden = list.length > 0;
    $('[data-grid]').hidden = !list.length;
    var total = PRODUCTS.length;
    $('[data-count]').textContent = !list.length ? 'No products'
      : list.length === total ? 'Showing all ' + total + ' products'
      : 'Showing ' + list.length + ' of ' + total + ' products';
    renderChips();
    syncFilterBtn();
  }

  /* ---------------- hero slides (only where there is more than one) ---------------- */

  function initSlides() {
    var frames = $$('.fhero__slide');
    if (frames.length < 2) return;
    var titles = $('[data-slide-title]') ? (C.slides || []) : [];
    var si = 0;
    function show(n) {
      si = (n + frames.length) % frames.length;
      if (titles[si]) {
        $('[data-slide-title]').textContent = titles[si].t;
        $('[data-slide-sub]').textContent   = titles[si].s;
      }
      var i18 = $('[data-slide-i]');
      if (i18) i18.textContent = ('0' + (si + 1)).slice(-2);
      frames.forEach(function (f, i) {
        var on = i === si;
        f.classList.toggle('is-on', on);
        var img = f.querySelector('img');
        if (on && img && img.loading === 'lazy') img.loading = 'eager';
      });
    }
    var pv = $('[data-slide-prev]'), nx = $('[data-slide-next]');
    if (pv) pv.addEventListener('click', function () { show(si - 1); });
    if (nx) nx.addEventListener('click', function () { show(si + 1); });
  }

  /* ---------------- deep links ----------------
     furniture.html#cat=sofas comes in from the header dropdown and the
     site search; #q=rug comes in from the search box. */

  function applyHash() {
    var h = w.location.hash.slice(1);
    if (!h) return;
    var m = /(?:^|&)cat=([^&]+)/.exec(h);
    if (m) {
      var id = decodeURIComponent(m[1]);
      if (CATEGORIES.some(function (c) { return c.id === id; })) selectCategory(id, true);
    }
    var q = /(?:^|&)q=([^&]+)/.exec(h);
    if (q) {
      state.q = decodeURIComponent(q[1].replace(/\+/g, ' '));
      var s = $('[data-search]'); if (s) s.value = state.q;
      render();
      var t = d.getElementById('catalog');
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /* ---------------- filters panel ---------------- */

  function filtersOpen(on) {
    var panel = $('[data-filters-panel]'), btn = $('[data-filters-toggle]');
    if (!panel) return;
    panel.hidden = !on;
    btn.setAttribute('aria-expanded', on ? 'true' : 'false');
    if (on) {
      var head = $('.fgroup__head', panel);
      if (head) head.focus();
    }
  }

  function activeCount() {
    var n = state.cats.length;
    FACETS.forEach(function (f) { n += (state.facets[f.key] || []).length; });
    if (state.min > C.price.min || state.max < C.price.max) n++;
    return n;
  }

  function syncFilterBtn() {
    var badge = $('[data-filter-n]');
    if (!badge) return;
    var n = activeCount();
    badge.textContent = n;
    badge.hidden = !n;
  }


  /* ---------------- interactions ---------------- */

  function wire() {
    d.addEventListener('click', function (e) {
      if (e.target.closest('[data-filters-toggle]')) {
        filtersOpen($('[data-filters-panel]').hidden);
        return;
      }
      if (e.target.closest('[data-filters-close]')) {
        filtersOpen(false);
        $('[data-filters-toggle]').focus();
        return;
      }
      /* an outside click closes it; a click inside must not */
      if (!e.target.closest('.filterbox')) filtersOpen(false);

      if (e.target.closest('[data-clear]')) { clearAll(); return; }

      var chip = e.target.closest('[data-chip]');
      if (chip) { dropChip(chip); return; }

      var wb = e.target.closest('.pc__wish');
      if (wb) {
        if (!SHOP) return;
        var on = SHOP.toggleWish(KEY + ':' + wb.getAttribute('data-wish'));
        wb.classList.toggle('is-on', on);
        wb.setAttribute('aria-pressed', on ? 'true' : 'false');
        return;
      }

      var ab = e.target.closest('[data-add]');
      if (ab) {
        if (SHOP) SHOP.add(KEY + ':' + ab.getAttribute('data-add'));
        ab.classList.add('is-added');
        w.setTimeout(function () { ab.classList.remove('is-added'); }, 550);
        return;
      }
      var vb = e.target.closest('[data-view]');
      if (vb) {
        state.view = vb.getAttribute('data-view');
        $$('[data-view]').forEach(function (b) {
          var on = b === vb;
          b.classList.toggle('is-on', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        render();
      }
    });

    d.addEventListener('change', function (e) {
      if (e.target.matches('[data-sort]')) { state.sort = e.target.value; render(); }
    });
    d.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var panel = $('[data-filters-panel]');
      if (panel && !panel.hidden) { filtersOpen(false); $('[data-filters-toggle]').focus(); }
    });

    var form = $('[data-search-form]'), q = $('[data-search]');
    if (form) form.addEventListener('submit', function (e) { e.preventDefault(); state.q = q.value; render(); });
    if (q) q.addEventListener('input', function () { state.q = q.value; render(); });

    w.addEventListener('hashchange', applyHash);
  }

  function boot() {
    buildCategories(); buildFilters(); initSlides(); wire();
    render(); applyHash();
    /* the header panel can remove an item too — repaint the hearts */
    if (SHOP) SHOP.subscribe(function () {
      $$('.pc__wish').forEach(function (b) {
        var on = SHOP.hasWish(KEY + ':' + b.getAttribute('data-wish'));
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    });
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot);
  else boot();

})(window, document);
