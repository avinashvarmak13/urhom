/* ============================================================
   URHOM — boot
   Sections register their own behaviour here; adding 02–07 means
   adding a line, never editing what came before.
   ============================================================ */
(function (w, d) {
  'use strict';

  var URHOM = (w.URHOM = w.URHOM || {});

  /* ---------------- section 01 — hero ---------------- */

  function initHero() {
    var hero = d.getElementById('section-01');
    if (!hero) return;

    var img = hero.querySelector('.hero__img');
    if (!img) return;

    function ready() { hero.classList.add('is-ready'); }

    if (img.complete && img.naturalWidth) {
      w.requestAnimationFrame(ready);
    } else {
      img.addEventListener('load', ready, { once: true });
      img.addEventListener('error', ready, { once: true });
      w.setTimeout(ready, 2200);                  // never hold the page hostage
    }

    URHOM.addParallax(hero.querySelector(".hero__media-inner"), hero, 0.014);
  }

  /* ---------------- section 03 — why urhom ---------------- */

  function initWhy() {
    var why = d.getElementById('section-03');
    if (!why) return;

    var img = why.querySelector('.why__img');
    if (!img) return;

    function ready() { why.classList.add('is-ready'); }

    if (img.complete && img.naturalWidth) {
      w.requestAnimationFrame(ready);
    } else {
      img.addEventListener('load', ready, { once: true });
      img.addEventListener('error', ready, { once: true });
      w.setTimeout(ready, 2200);
    }

    URHOM.addParallax(why.querySelector('.why__media-inner'), why, 0.016);
  }

  /* ---------------- section 05 — our process ---------------- */

  function initProcess() {
    var sec = d.getElementById('section-05');
    if (!sec) return;

    var img = sec.querySelector('.process__img');
    if (!img) return;

    function ready() { sec.classList.add('is-ready'); }

    if (img.complete && img.naturalWidth) {
      w.requestAnimationFrame(ready);
    } else {
      img.addEventListener('load', ready, { once: true });
      img.addEventListener('error', ready, { once: true });
      w.setTimeout(ready, 2200);
    }

    URHOM.addParallax(sec.querySelector('.process__media-inner'), sec, 0.016);
  }

  /* ---------------- shared snap-rail carousel ----------------
     Used by section 04 (projects) and section 06 (testimonials).
     Native scroll-snap + arrows; nothing is hijacked.           */

  function setupRail(rail, prev, next, dots, cardSelector, nav) {
    if (!rail) return;
    var cards = Array.prototype.slice.call(rail.querySelectorAll(cardSelector));
    if (!cards.length) return;

    function step() {
      var r = cards[0].getBoundingClientRect();
      var gap = cards.length > 1 ? cards[1].getBoundingClientRect().left - r.right : 0;
      return r.width + gap;
    }

    function maxScroll() { return rail.scrollWidth - rail.clientWidth; }

    /* Disabling the button a keyboard user is standing on drops focus to
       <body> and strands them mid-carousel — hand focus to the other arrow. */
    function setDisabled(btn, other, state) {
      if (!btn || btn.disabled === state) return;
      var hadFocus = d.activeElement === btn;
      btn.disabled = state;
      if (state && hadFocus && other && !other.disabled) other.focus();
    }

    function sync() {
      var max = maxScroll();
      var x = rail.scrollLeft;
      if (nav) nav.hidden = max <= 2;
      setDisabled(prev, next, x <= 2);
      setDisabled(next, prev, x >= max - 2);
      if (!dots || !dots.length) return;
      // index by card, not by fraction of the overflow — one tap, one card
      var sw = step();
      var i = sw > 0 ? Math.round(x / sw) : 0;
      if (x >= max - 2) i = dots.length - 1;
      i = Math.max(0, Math.min(dots.length - 1, i));
      dots.forEach(function (dot, n) { dot.classList.toggle('is-on', n === i); });
    }

    function nudge(dir) { rail.scrollBy({ left: dir * step(), behavior: 'smooth' }); }

    if (prev) prev.addEventListener('click', function () { nudge(-1); });
    if (next) next.addEventListener('click', function () { nudge(1); });

    rail.addEventListener('scroll', function () {
      if (rail._t) return;
      rail._t = w.requestAnimationFrame(function () { rail._t = 0; sync(); });
    }, { passive: true });

    w.addEventListener('resize', sync);
    sync();

    /* the rail scrolls itself — keep Lenis off its wheel events */
    rail.setAttribute('data-lenis-prevent', '');
  }

  function initRails() {
    setupRail(
      d.querySelector('[data-prail]'),
      d.querySelector('[data-prail-prev]'),
      d.querySelector('[data-prail-next]'),
      Array.prototype.slice.call(d.querySelectorAll('[data-prail-dots] .pnav__dot')),
      '.pcard'
    );
    setupRail(
      d.querySelector('[data-crail]'),
      d.querySelector('[data-crail-prev]'),
      d.querySelector('[data-crail-next]'),
      Array.prototype.slice.call(d.querySelectorAll('[data-crail-dots] .cnav__dot')),
      '.ccard',
      d.querySelector('[data-crail-nav]')
    );
    setupRail(
      d.querySelector('[data-lrail]'),
      d.querySelector('[data-lrail-prev]'),
      d.querySelector('[data-lrail-next]'),
      Array.prototype.slice.call(d.querySelectorAll('[data-lrail-dots] .lnav__dot')),
      '.tcard'
    );
  }

  /* ---------------- section 06 — happy customers ---------------- */

  function initLove() {
    var sec = d.getElementById('section-06');
    if (!sec) return;
    var img = sec.querySelector('.love__img');
    if (!img) return;

    function ready() { sec.classList.add('is-ready'); }

    if (img.complete && img.naturalWidth) {
      w.requestAnimationFrame(ready);
    } else {
      img.addEventListener('load', ready, { once: true });
      img.addEventListener('error', ready, { once: true });
      w.setTimeout(ready, 2200);
    }

    URHOM.addParallax(sec.querySelector('.love__media-inner'), sec, 0.016);
  }

  /* ---------------- mobile menu ---------------- */

  function initMobileMenu() {
    var toggle = d.querySelector('.nav-toggle');
    var menu = d.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    function close() {
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      menu.classList.remove('is-open');
      w.setTimeout(function () {
        if (toggle.getAttribute('aria-expanded') !== 'true') menu.hidden = true;
      }, 380);
    }

    function open() {
      menu.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      w.requestAnimationFrame(function () { menu.classList.add('is-open'); });
    }

    toggle.addEventListener('click', function () {
      toggle.getAttribute('aria-expanded') === 'true' ? close() : open();
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });

    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    w.addEventListener('resize', function () {
      if (w.innerWidth > 980) close();
    });
  }

  /* ---------------- go ---------------- */

  function boot() {
    initHero();
    initWhy();
    initProcess();
    initLove();
    initRails();
    initMobileMenu();
    URHOM.initScroll();
    URHOM.initReveal();
  }

  if (d.readyState === 'loading') {
    d.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})(window, document);
