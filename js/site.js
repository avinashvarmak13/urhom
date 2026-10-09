/* ============================================================
   URHOM — header behaviour shared by every page
     1. category dropdowns under Furniture / Furnishing / Interiors
     2. the site-wide search overlay behind the header search button
   Both are built from js/catalog.js, so a category is named once.
   ============================================================ */
(function (w, d) {
  'use strict';

  var CAT = w.URHOM && w.URHOM.catalog;
  if (!CAT) return;

  var $  = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) {
    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]; }); };

  /* page -> collection key, so a link's href tells us what to hang off it */
  var BY_PAGE = {};
  Object.keys(CAT).forEach(function (k) { BY_PAGE[CAT[k].page] = k; });

  var CARET = '<svg class="navitem__caret" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
    '<path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';


  /* ============================================================
     1. CATEGORY DROPDOWNS
     ============================================================ */

  function dropdownHTML(key) {
    var c = CAT[key];
    return '<div class="navdrop" data-navdrop hidden>' +
      '<ul class="navdrop__list">' +
      c.categories.map(function (x) {
        return '<li><a href="' + c.page + '#cat=' + x.id + '">' + esc(x.title) + '</a></li>';
      }).join('') +
      '</ul>' +
      '<a class="navdrop__all" href="' + c.page + '">Explore all ' + esc(c.label) +
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>' +
      '</div>';
  }

  var openItem = null;

  function close(item) {
    if (!item) return;
    item.classList.remove('is-open', 'is-shown');
    delete item.dataset.pinned;
    var t = $('[data-navdrop-toggle]', item);
    if (t) t.setAttribute('aria-expanded', 'false');
    $('[data-navdrop]', item).hidden = true;
    if (openItem === item) openItem = null;
  }

  /* The panel is anchored to its nav item. On a narrow window that can push
     it past the right edge, so nudge it back by however much it overhangs. */
  function keepInView(panel) {
    panel.style.setProperty('--shift', '0px');
    var r = panel.getBoundingClientRect();
    var pad = 12;
    var over = r.right - (w.innerWidth - pad);
    var under = pad - r.left;
    var shift = over > 0 ? -over : (under > 0 ? under : 0);
    if (shift) panel.style.setProperty('--shift', shift + 'px');
  }

  function open(item) {
    if (openItem && openItem !== item) close(openItem);
    item.classList.add('is-open');
    var t = $('[data-navdrop-toggle]', item);
    if (t) t.setAttribute('aria-expanded', 'true');
    var panel = $('[data-navdrop]', item);
    panel.hidden = false;
    if (!item.closest('.mobile-menu__list')) keepInView(panel);
    /* one frame with the panel laid out but still transparent, so the
       fade actually runs instead of being skipped */
    w.requestAnimationFrame(function () { item.classList.add('is-shown'); });
    openItem = item;
  }

  function attach(link, mode) {
    var key = BY_PAGE[(link.getAttribute('href') || '').split('#')[0]];
    if (!key) return;

    var li = link.parentElement;
    if (!li || li.classList.contains('has-drop')) return;
    li.classList.add('navitem', 'has-drop');

    var tog = d.createElement('button');
    tog.type = 'button';
    tog.className = 'navitem__toggle';
    tog.setAttribute('data-navdrop-toggle', '');
    tog.setAttribute('aria-expanded', 'false');
    tog.setAttribute('aria-label', CAT[key].label + ' categories');
    tog.innerHTML = CARET;
    link.insertAdjacentElement('afterend', tog);
    tog.insertAdjacentHTML('afterend', dropdownHTML(key));

    /* On a hover-capable device the pointer has already opened the panel by
       the time the click lands, so a plain toggle would close what the user
       just reached for. A click instead pins the panel open; only a click on
       an already-pinned panel closes it. */
    tog.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (!li.classList.contains('is-open')) { open(li); li.dataset.pinned = '1'; return; }
      if (li.dataset.pinned) { delete li.dataset.pinned; close(li); }
      else li.dataset.pinned = '1';
    });

    if (mode === 'hover') {
      var t = 0;
      li.addEventListener('mouseenter', function () { w.clearTimeout(t); open(li); });
      li.addEventListener('mouseleave', function () {
        if (li.dataset.pinned) return;          /* clicked open — leave it */
        t = w.setTimeout(function () { close(li); }, 220);
      });
      /* No auto-open on focusin: focusing the toggle would open the panel and
         the Enter that followed would immediately close it again. Keyboard
         users open it deliberately with the toggle; focusout still closes. */
      li.addEventListener('focusout', function () {
        w.setTimeout(function () { if (!li.contains(d.activeElement)) close(li); }, 0);
      });
    }
  }

  function initDropdowns() {
    $$('.nav__list > li > a, .shop-nav ul > li > a').forEach(function (a) { attach(a, 'hover'); });
    $$('.mobile-menu__list > li > a').forEach(function (a) { attach(a, 'click'); });

    d.addEventListener('click', function (e) {
      if (openItem && !openItem.contains(e.target)) close(openItem);
    });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && openItem) {
        var t = $('[data-navdrop-toggle]', openItem);
        close(openItem);
        if (t) t.focus();
      }
    });
  }


  /* ============================================================
     2. SEARCH OVERLAY
     Searches the whole catalogue — categories and products across all
     three collections — and hands off to the matching collection page.
     ============================================================ */

  var INDEX = (w.URHOM && w.URHOM.index) || [];
  var rupee = function (n) { return '₹ ' + n.toLocaleString('en-IN'); };

  var SUGGEST = ['Sofas', 'Beds', 'Curtains', 'Rugs', 'Wardrobes', 'Vases', 'Lighting', 'Flooring'];

  function overlayHTML() {
    return '<div class="ssearch" data-ssearch hidden>' +
      '<div class="ssearch__scrim" data-ssearch-close></div>' +
      '<div class="ssearch__panel" role="dialog" aria-modal="true" aria-label="Search URHOM">' +
        '<form class="ssearch__bar" data-ssearch-form role="search">' +
          '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6.6" stroke="currentColor" stroke-width="1.7"/><path d="M16.1 16.1 20.4 20.4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>' +
          '<label class="u-sr-only" for="ssearch-q">Search furniture, furnishing and interiors</label>' +
          '<input id="ssearch-q" type="search" data-ssearch-input autocomplete="off" ' +
            'placeholder="Search sofas, curtains, rugs, lighting…">' +
          '<button class="ssearch__x" type="button" data-ssearch-close aria-label="Close search">' +
            '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>' +
          '</button>' +
        '</form>' +
        '<div class="ssearch__body" data-ssearch-body></div>' +
      '</div></div>';
  }

  function suggestHTML() {
    return '<p class="ssearch__hint">Popular searches</p><div class="ssearch__tags">' +
      SUGGEST.map(function (s) {
        return '<button class="ssearch__tag" type="button" data-ssearch-tag="' + esc(s) + '">' + esc(s) + '</button>';
      }).join('') + '</div>';
  }

  function match(q) {
    q = q.trim().toLowerCase();
    if (!q) return null;
    return INDEX.filter(function (r) {
      return r.name.toLowerCase().indexOf(q) > -1 ||
             (r.hay && r.hay.indexOf(q) > -1) ||
             (r.desc && r.desc.toLowerCase().indexOf(q) > -1);
    }).sort(function (a, b) {
      /* a name that starts with the query beats one that merely contains it,
         and a category beats a product so the broad route is offered first */
      var as = a.name.toLowerCase().indexOf(q) === 0 ? 0 : 1;
      var bs = b.name.toLowerCase().indexOf(q) === 0 ? 0 : 1;
      if (as !== bs) return as - bs;
      if (a.kind !== b.kind) return a.kind === 'category' ? -1 : 1;
      return a.name.localeCompare(b.name);
    }).slice(0, 12);
  }

  function rowHTML(r) {
    return '<a class="sres" href="' + r.href + '" data-sres>' +
      '<picture><source type="image/webp" srcset="' + r.img.replace('.jpg', '.webp') + '">' +
      '<img class="sres__img" src="' + r.img + '" alt="" width="64" height="44" loading="lazy" decoding="async"></picture>' +
      '<span class="sres__text"><span class="sres__name">' + esc(r.name) + '</span>' +
      '<span class="sres__meta">' + esc(r.group) + (r.desc ? ' · ' + esc(r.desc) : '') + '</span></span>' +
      '<span class="sres__right">' + (r.kind === 'product' ? rupee(r.price) : 'Category') + '</span></a>';
  }

  function renderResults(q) {
    var body = $('[data-ssearch-body]');
    var res = match(q);
    if (res === null) { body.innerHTML = suggestHTML(); return; }
    if (!res.length) {
      body.innerHTML = '<p class="ssearch__none">No match for <b>' + esc(q.trim()) +
        '</b>. Try a category — sofas, curtains, rugs, lighting.</p>';
      return;
    }
    body.innerHTML = '<p class="ssearch__hint">' + res.length +
      (res.length === 1 ? ' result' : ' results') + '</p><div class="ssearch__list">' +
      res.map(rowHTML).join('') + '</div>';
  }

  var lastFocus = null;

  function openSearch() {
    var o = $('[data-ssearch]');
    lastFocus = d.activeElement;
    o.hidden = false;
    d.documentElement.classList.add('is-search-open');
    renderResults('');
    $('[data-ssearch-input]').focus();
  }

  function closeSearch() {
    var o = $('[data-ssearch]');
    if (!o || o.hidden) return;
    o.hidden = true;
    d.documentElement.classList.remove('is-search-open');
    $('[data-ssearch-input]').value = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function initSearch() {
    var triggers = $$('[data-search-open], .nav-actions .icon-btn[aria-label="Search"]');
    if (!triggers.length) return;

    d.body.insertAdjacentHTML('beforeend', overlayHTML());

    triggers.forEach(function (b) {
      b.setAttribute('aria-haspopup', 'dialog');
      b.addEventListener('click', openSearch);
    });

    var input = $('[data-ssearch-input]');
    input.addEventListener('input', function () { renderResults(input.value); });

    $('[data-ssearch-form]').addEventListener('submit', function (e) {
      e.preventDefault();
      var first = $('[data-sres]');
      if (first) { w.location.href = first.getAttribute('href'); return; }
      var q = input.value.trim();
      /* nothing matched outright — still hand the term to a collection page
         rather than dropping it on the floor */
      if (q) w.location.href = CAT.furniture.page + '#q=' + encodeURIComponent(q);
    });

    d.addEventListener('click', function (e) {
      if (e.target.closest('[data-ssearch-close]')) { closeSearch(); return; }
      var tag = e.target.closest('[data-ssearch-tag]');
      if (tag) { input.value = tag.getAttribute('data-ssearch-tag'); renderResults(input.value); input.focus(); }
    });

    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSearch();
      if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) &&
          !/^(INPUT|TEXTAREA|SELECT)$/.test(d.activeElement.tagName)) {
        e.preventDefault(); openSearch();
      }
      /* arrow through the results list */
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        var o = $('[data-ssearch]');
        if (!o || o.hidden) return;
        var rows = $$('[data-sres]');
        if (!rows.length) return;
        e.preventDefault();
        var i = rows.indexOf(d.activeElement);
        var n = e.key === 'ArrowDown' ? (i + 1) % rows.length : (i <= 0 ? rows.length - 1 : i - 1);
        rows[n].focus();
      }
    });
  }

  function boot() { initDropdowns(); initSearch(); }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot);
  else boot();

})(window, document);
