/* ============================================================
   URHOM — scroll engine
   • Lenis for butter-smooth, non-blocking wheel/trackpad scrolling
     (native scrolling is kept as-is if Lenis is unavailable, and
      touch devices always scroll natively — no hijack, no lag).
   • A single rAF loop drives Lenis, the parallax and the header
     state, so nothing fights for frames.
   • Sections register themselves; the index rail follows along.
   ============================================================ */
(function (w, d) {
  'use strict';

  var reduced = w.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var URHOM = (w.URHOM = w.URHOM || {});

  /* ---------- 1. smooth scroll ---------- */

  var lenis = null;

  function initLenis() {
    if (reduced || typeof w.Lenis !== 'function') {
      // reduced motion means NO smoothing — leave native scrolling alone
      return;
    }
    lenis = new w.Lenis({
      /* Lenis picks its integrator as `if (duration && easing) {...} else if (lerp)`,
         so the old config ran a fixed 1.05s tween per wheel event and `lerp:null`
         was dead config. Every wheel tick started a new ~0.8s animation, so the
         page trailed the pointer and, on a direction change, kept travelling the
         old way until that tween expired. Lerp is exponential smoothing toward a
         live target: it responds on the next frame and reverses immediately. */
      lerp: 0.18,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      syncTouch: false,          // phones keep their native momentum
      smoothWheel: true,
      autoRaf: false             // we own the frame loop
    });
    lenis.on('scroll', wake);
  }

  /* anchor jumps must clear the floating header, not hide under it */
  function headerOffset() {
    var pill = d.querySelector('.nav-pill');
    if (!pill) return 0;
    var r = pill.getBoundingClientRect();
    return -(r.height + r.top + 18);
  }

  URHOM.scrollTo = function (target, opts) {
    if (lenis) {
      // an anchor jump keeps its deliberate, longer easing — that one is a
      // designed transition, not a response to a continuous gesture
      lenis.scrollTo(target, Object.assign({ offset: headerOffset(), duration: 1.1 }, opts || {}));
      URHOM.wake();
      return;
    }
    var el = typeof target === 'string' ? d.querySelector(target) : target;
    if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };

  /* ---------- 2. anchor links ---------- */

  d.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var id = a.getAttribute('href');
    if (!id || id === '#') return;
    var el = d.querySelector(id);
    e.preventDefault();                    // never leave a dangling hash behind
    if (!el) return;                       // section not built yet — inert
    URHOM.scrollTo(el);
  });

  /* ---------- 3. parallax registry ---------- */

  var parallax = [];

  /**
   * Move an element against the scroll of its container section.
   * amount = how far it travels, as a fraction of the section height.
   */
  URHOM.addParallax = function (el, section, amount) {
    if (reduced || !el || !section) return;
    parallax.push({ el: el, section: section, amount: amount || 0.08, last: null });
  };

  function updateParallax() {
    var vh = w.innerHeight;
    for (var i = 0; i < parallax.length; i++) {
      var p = parallax[i];
      var r = p.section.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      // -1 (section just below the fold) → 1 (section just above it)
      var progress = (vh - r.top) / (vh + r.height) * 2 - 1;
      var y = progress * p.amount * r.height;
      var rounded = Math.round(y * 100) / 100;
      if (rounded === p.last) continue;
      p.last = rounded;
      p.el.style.transform = 'translate3d(0,' + rounded + 'px,0)';
    }
  }

  /* ---------- 4. header state ---------- */

  var header = d.querySelector('.site-header');
  var stuck = false;

  function updateHeader(y) {
    var next = y > 24;
    if (next === stuck) return;
    stuck = next;
    if (header) header.classList.toggle('is-stuck', stuck);
  }

  /* ---------- 5. section index rail ---------- */

  function initRail() {
    var items = Array.prototype.slice.call(d.querySelectorAll('.rail__item'));
    if (!items.length) return;

    items.forEach(function (item) {
      var link = item.querySelector('[data-rail]');
      var exists = link && d.getElementById(link.getAttribute('data-rail'));
      item.classList.toggle('is-pending', !exists);   // future sections stay inert
      if (!exists && link) link.setAttribute('tabindex', '-1');
    });

    var sections = Array.prototype.slice.call(d.querySelectorAll('[data-section]'));
    if (!sections.length || !('IntersectionObserver' in w)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.getAttribute('data-section');
        items.forEach(function (item) {
          var link = item.querySelector('[data-rail]');
          item.classList.toggle('is-active', !!link && link.getAttribute('data-rail') === id);
        });
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    sections.forEach(function (s) { io.observe(s); });
  }

  /* ---------- 6. one frame loop, which parks when nothing is moving ----------
     It used to run forever: 60 wake-ups a second, reading layout and stepping
     Lenis, on a page that was standing still. Now it sleeps after half a second
     of stillness and any real input wakes it. */

  var running = false;           // true for as long as a frame is queued
  var rafId = 0;
  var idleFrames = 0;
  var lastY = -1;
  var PARK_AFTER = 30;           // ~0.5s at 60Hz

  function frame(time) {
    if (lenis) lenis.raf(time);

    var y = lenis ? lenis.scroll : (w.scrollY || w.pageYOffset);
    if (Math.abs(y - lastY) > 0.05) {
      lastY = y;
      idleFrames = 0;
      updateParallax();
      updateHeader(y);
    } else {
      idleFrames++;
    }

    if (idleFrames < PARK_AFTER || (lenis && lenis.isScrolling)) {
      rafId = w.requestAnimationFrame(frame);     // `running` stays true
    } else {
      running = false;
      rafId = 0;
    }
  }

  /* `running` (not rafId) is the guard: Lenis emits 'scroll' synchronously from
     inside lenis.raf(), so wake() re-enters mid-frame. Keying off rafId there
     queued a second callback every frame and the loop doubled on itself. */
  function wake() {
    if (running || d.hidden) return;
    running = true;
    idleFrames = 0;
    // Lenis derives its step from `t - this.time`; after a park that is stale,
    // so clear it or the first frame advances by the whole sleep and jumps.
    if (lenis) lenis.time = 0;
    rafId = w.requestAnimationFrame(frame);
  }
  URHOM.wake = wake;

  function sleep() {
    if (rafId) w.cancelAnimationFrame(rafId);
    running = false;
    rafId = 0;
  }

  URHOM.initScroll = function () {
    initLenis();
    initRail();

    // any input that can move the page restarts the loop
    var opts = { passive: true };
    ['wheel', 'touchstart', 'touchmove', 'scroll', 'resize', 'keydown', 'pointerdown']
      .forEach(function (evt) { w.addEventListener(evt, wake, opts); });

    // nothing animates for a tab nobody is looking at
    d.addEventListener('visibilitychange', function () {
      if (d.hidden) { sleep(); }
      else { lastY = -1; wake(); }
    });

    wake();
  };

  URHOM.reduced = reduced;

})(window, document);
