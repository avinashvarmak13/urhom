/* ============================================================
   URHOM — Projects page
   Renders every section from js/projects-data.js. Nothing here
   holds content of its own, so replacing the placeholder project
   list, statistics or testimonials is a one-file job.
   ============================================================ */
(function (w, d) {
  'use strict';

  var P = w.URHOM && w.URHOM.projects;
  if (!P) return;

  var $  = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]; }); };

  var ARROW = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* every asset in this project ships as .jpg plus a .webp twin */
  function pic(base, cls, alt, w2, h2, eager) {
    return '<picture><source type="image/webp" srcset="' + base + '.webp">' +
      '<img class="' + cls + '" src="' + base + '.jpg" alt="' + esc(alt) + '"' +
      (w2 ? ' width="' + w2 + '" height="' + h2 + '"' : '') +
      (eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async"></picture>';
  }

  /* ============================================================
     HERO
     ============================================================ */

  var hi = 0;

  function buildHero() {
    /* The first plate carries its own srcset so the <link rel=preload> in the
       head matches exactly what the browser then asks for — a mismatch costs
       a second download of a 2172px photograph.

       The other three ship with no source at all. loading="lazy" does not
       defer them: every plate is absolutely positioned at inset:0, so the
       browser counts all four as in-viewport and fetched ~760KB up front.
       They are hydrated by hydrate() when first needed instead. */
    $('[data-phero-media]').innerHTML = P.hero.map(function (s, i) {
      var srcset = s.img + '-sm.webp 1100w, ' + s.img + '.webp 2172w';
      return '<span class="phero__plate' + (i ? '' : ' is-on') + '" data-plate="' + i + '">' +
        '<picture>' +
          '<source type="image/webp" sizes="100vw"' +
            (i === 0 ? ' srcset="' + srcset + '"' : ' data-srcset="' + srcset + '"') + '>' +
          '<img class="phero__img" alt="" width="2172" height="724" decoding="async"' +
            (i === 0 ? ' fetchpriority="high" src="' + s.img + '.jpg"'
                     : ' data-src="' + s.img + '.jpg"') + '>' +
        '</picture></span>';
    }).join('');

    $('[data-phero-caps]').innerHTML = P.capabilities.map(function (c) {
      return '<li><svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' + c.icon + '</svg>' +
        '<span><b>' + esc(c.t) + '</b>' + esc(c.s) + '</span></li>';
    }).join('');

    $('[data-phero-n]').textContent = ('0' + P.hero.length).slice(-2);
    showHero(0);

    $('[data-phero-prev]').addEventListener('click', function () { showHero(hi - 1); });
    $('[data-phero-next]').addEventListener('click', function () { showHero(hi + 1); });
  }

  /* give a plate its sources the first time it is actually wanted */
  function hydrate(i) {
    var plate = $('[data-plate="' + i + '"]');
    if (!plate) return;
    var src = plate.querySelector('source'), img = plate.querySelector('img');
    if (src && src.dataset.srcset) { src.srcset = src.dataset.srcset; delete src.dataset.srcset; }
    if (img && img.dataset.src) { img.src = img.dataset.src; delete img.dataset.src; }
  }

  function showHero(n) {
    hi = (n + P.hero.length) % P.hero.length;
    var s = P.hero[hi];
    hydrate(hi);
    /* neighbours follow once the main thread is free, so prefetching them
       never competes with the first plate for bandwidth at load */
    var idle = w.requestIdleCallback || function (f) { return w.setTimeout(f, 700); };
    idle(function () {
      hydrate((hi + 1) % P.hero.length);
      hydrate((hi - 1 + P.hero.length) % P.hero.length);
    });
    $$('[data-plate]').forEach(function (el, i) { el.classList.toggle('is-on', i === hi); });
    $('[data-phero-type]').textContent = s.type;
    $('[data-phero-city]').textContent = s.city;
    $('[data-phero-line]').textContent = s.line;
    $('[data-phero-i]').textContent = ('0' + (hi + 1)).slice(-2);
  }

  /* ============================================================
     CATEGORY STRIP
     ============================================================ */

  var cat = 'all';

  function buildCats() {
    $('[data-pcats]').innerHTML = P.categories.map(function (c) {
      return '<button class="catcard pcat" type="button" data-pcat="' + c.id + '"' +
        ' aria-pressed="' + (c.id === cat) + '">' +
        '<span class="catcard__shot">' + pic(c.img, 'catcard__img', c.alt, 175, 87, false) + '</span>' +
        '<span class="catcard__body"><span class="catcard__text">' +
          '<span class="catcard__title">' + esc(c.title) + '</span>' +
          '<span class="catcard__desc">' + esc(c.sub) + '</span></span>' +
          '<span class="catcard__go" aria-hidden="true">' + ARROW + '</span>' +
        '</span></button>';
    }).join('');
  }

  function setCat(id, push) {
    cat = id;
    $$('[data-pcat]').forEach(function (b) {
      var on = b.getAttribute('data-pcat') === id;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    renderGrid();
    if (push) {
      var u = id === 'all' ? w.location.pathname : w.location.pathname + '?category=' + id;
      try { history.replaceState(null, '', u); } catch (e) {}
    }
  }

  /* ============================================================
     FEATURED PROJECTS
     ============================================================ */

  function visible() {
    return cat === 'all' ? P.items : P.items.filter(function (p) { return p.cat === cat; });
  }

  function card(p) {
    return '<article class="pj pj--' + p.shape + '">' +
      '<button class="pj__hit" type="button" data-open="' + p.id + '" aria-label="' +
        esc(p.name) + ', ' + esc(p.city) + ' — view project">' +
        '<span class="pj__shot">' + pic(p.img, 'pj__img', p.alt, 760, 1000, false) + '</span>' +
        '<span class="pj__body">' +
          '<span class="pj__text">' +
            '<span class="pj__name">' + esc(p.name) + '</span>' +
            '<span class="pj__city">' + esc(p.city) + '</span>' +
            '<span class="pj__meta">' + esc(p.catLabel) + '<i>·</i>' + esc(p.area) +
              '<i>·</i>Completed ' + p.year + '</span>' +
          '</span>' +
          '<span class="pj__go" aria-hidden="true">' + ARROW + '</span>' +
        '</span>' +
      '</button></article>';
  }

  function renderGrid() {
    var list = visible();
    var grid = $('[data-pgrid]');
    grid.innerHTML = list.map(card).join('');
    grid.hidden = !list.length;
    $('[data-pempty]').hidden = list.length > 0;
  }

  /* ============================================================
     DETAIL DIALOG
     No project-detail route exists, so a focused dialog stands in.
     ============================================================ */

  var lastFocus = null;

  function openProject(id) {
    var p = P.items.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    lastFocus = d.activeElement;
    $('[data-pmodal-body]').innerHTML =
      '<div class="pmodal__shot">' + pic(p.img, 'pmodal__img', p.alt, 1200, 760, true) + '</div>' +
      '<div class="pmodal__text">' +
        '<p class="pmodal__eyebrow">' + esc(p.catLabel) + '</p>' +
        '<h2 class="pmodal__title" id="pmodal-h">' + esc(p.name) + '</h2>' +
        '<p class="pmodal__city">' + esc(p.city) + '</p>' +
        '<p class="pmodal__blurb">' + esc(p.blurb) + '</p>' +
        '<dl class="pmodal__facts">' +
          '<div><dt>Type</dt><dd>' + esc(p.catLabel) + '</dd></div>' +
          '<div><dt>Area</dt><dd>' + esc(p.area) + '</dd></div>' +
          '<div><dt>Completed</dt><dd>' + p.year + '</dd></div>' +
          '<div><dt>Location</dt><dd>' + esc(p.city) + '</dd></div>' +
        '</dl>' +
        (P.verified ? '' : '<p class="pmodal__note">Sample project details — not a confirmed client project.</p>') +
        '<div class="pmodal__cta">' +
          '<a class="btn btn--primary btn--lg" href="enquire.html"><span class="btn__label">Start a project like this</span></a>' +
          '<button class="btn btn--ghost btn--lg" type="button" data-pmodal-close><span class="btn__label">Back to all projects</span></button>' +
        '</div>' +
      '</div>';
    $('[data-pmodal]').hidden = false;
    d.documentElement.classList.add('is-pmodal-open');
    $('[data-pmodal-card]').focus();
  }

  function closeProject() {
    var m = $('[data-pmodal]');
    if (!m || m.hidden) return;
    m.hidden = true;
    d.documentElement.classList.remove('is-pmodal-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ============================================================
     STATS / APPROACH / STORIES / CTA
     ============================================================ */

  function buildStats() {
    $('[data-pstats]').innerHTML = P.stats.map(function (s) {
      return '<div class="pstat"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' + s.icon + '</svg>' +
        '<span class="pstat__text"><span class="pstat__n">' + esc(s.n) + '</span>' +
        '<span class="pstat__l">' + esc(s.label) + '</span></span></div>';
    }).join('');
  }

  function buildSteps() {
    $('[data-psteps]').innerHTML = P.steps.map(function (s, i) {
      return (i ? '<li class="psteps2__link" aria-hidden="true">' + ARROW + '</li>' : '') +
        '<li class="pstep2"><span class="pstep2__shot">' + pic(s.img, 'pstep2__img', s.alt, 200, 200, false) + '</span>' +
        '<span class="pstep2__n">' + s.n + '</span>' +
        '<span class="pstep2__t">' + esc(s.t) + '</span>' +
        '<span class="pstep2__s">' + esc(s.s) + '</span></li>';
    }).join('');
  }

  function buildStories() {
    var rail = $('[data-trail]');
    rail.innerHTML = P.testimonials.map(function (t) {
      var stars = '';
      for (var i = 0; i < t.stars; i++) stars += '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.6 2.9 6 6.6.9-4.8 4.6 1.2 6.5-5.9-3.1-5.9 3.1 1.2-6.5L2.5 9.5l6.6-.9z"/></svg>';
      return '<figure class="tq">' +
        '<svg class="tq__mark" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.6 6.4c-3 1.3-4.8 3.9-4.8 7.2 0 2.6 1.5 4.4 3.7 4.4 1.9 0 3.3-1.4 3.3-3.2 0-1.8-1.2-3.1-2.9-3.1h-.5c.2-1.5 1.2-2.8 2.6-3.6Zm9 0c-3 1.3-4.8 3.9-4.8 7.2 0 2.6 1.5 4.4 3.7 4.4 1.9 0 3.3-1.4 3.3-3.2 0-1.8-1.2-3.1-2.9-3.1h-.5c.2-1.5 1.2-2.8 2.6-3.6Z"/></svg>' +
        '<blockquote>' + esc(t.q) + '</blockquote>' +
        '<figcaption class="tq__who">' + pic(t.avatar, 'tq__av', '', 88, 88, false) +
          '<span class="tq__text"><span class="tq__name">' + esc(t.name) + '</span>' +
          '<span class="tq__place">' + esc(t.place) + '</span></span>' +
          '<span class="tq__stars" role="img" aria-label="Rated ' + t.stars + ' out of 5">' + stars + '</span>' +
        '</figcaption></figure>';
    }).join('');

    function step() {
      var c = rail.querySelector('.tq');
      return c ? c.getBoundingClientRect().width + 16 : 320;
    }
    function sync() {
      var max = rail.scrollWidth - rail.clientWidth;
      $('[data-tprev]').disabled = rail.scrollLeft <= 2;
      $('[data-tnext]').disabled = rail.scrollLeft >= max - 2;
    }
    $('[data-tprev]').addEventListener('click', function () { rail.scrollBy({ left: -step(), behavior: 'smooth' }); });
    $('[data-tnext]').addEventListener('click', function () { rail.scrollBy({ left:  step(), behavior: 'smooth' }); });
    rail.addEventListener('scroll', function () {
      if (rail._t) return;
      rail._t = w.requestAnimationFrame(function () { rail._t = 0; sync(); });
    }, { passive: true });
    w.addEventListener('resize', sync);
    sync();
    rail.setAttribute('data-lenis-prevent', '');
  }

  function buildCta() {
    $('[data-pcta-media]').innerHTML = pic(P.cta.img, 'pcta__img', P.cta.alt, 1774, 887, false);
  }

  /* ============================================================
     EVENTS
     ============================================================ */

  d.addEventListener('click', function (e) {
    var c = e.target.closest('[data-pcat]');
    if (c) {
      setCat(c.getAttribute('data-pcat'), true);
      var t = d.getElementById('featured');
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (e.target.closest('[data-pcat-all]')) { setCat('all', true); return; }

    var o = e.target.closest('[data-open]');
    if (o) { openProject(o.getAttribute('data-open')); return; }
    if (e.target.closest('[data-pmodal-close]')) { closeProject(); return; }

    var sc = e.target.closest('[data-scroll]');
    if (sc) {
      var id = (sc.getAttribute('href') || '').replace('#', '');
      var el = id && d.getElementById(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }
  });

  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeProject(); });

  /* ============================================================
     BOOT
     ============================================================ */

  buildHero();
  buildCats();
  buildStats();
  buildSteps();
  buildStories();
  buildCta();

  if (!P.verified) {
    var note = $('[data-pnote]');
    note.textContent = 'Sample project content — names, locations, areas, completion years, '
      + 'the statistics below and the client stories are placeholders from the design and are not verified.';
    note.hidden = false;
  }

  /* deep link: projects.html?category=commercial */
  var q = /[?&]category=([^&]+)/.exec(w.location.search);
  var start = q ? decodeURIComponent(q[1]) : 'all';
  setCat(P.categories.some(function (c) { return c.id === start; }) ? start : 'all', false);

})(window, document);
