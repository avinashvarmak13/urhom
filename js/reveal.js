/* ============================================================
   URHOM — entrance reveals
   Anything with [data-reveal] gets .is-revealed when it enters
   the viewport. Above-the-fold elements fire on load instead, so
   the first paint is a composed entrance rather than a scroll trick.
   ============================================================ */
(function (w, d) {
  'use strict';

  var URHOM = (w.URHOM = w.URHOM || {});

  function revealAll(nodes) {
    nodes.forEach(reveal);
  }

  /* Dropping will-change returns the element to the main layer, which costs a
     repaint. Doing that for every element at once (as the old safety net did)
     produced one synchronised repaint of the whole page ~2.6s in, and that
     repaint re-reported the hero paragraph as a new LCP candidate at ~3.9s on
     mobile. Each element now settles on its own transition end instead. */
  function settle(e) {
    if (e.target === e.currentTarget) e.currentTarget.classList.add('is-settled');
  }

  function reveal(n) {
    if (n.classList.contains('is-revealed')) return;   // never re-touch
    n.classList.add('is-revealed');
    n.addEventListener('transitionend', settle, { once: true });
  }

  URHOM.initReveal = function () {
    var nodes = Array.prototype.slice.call(d.querySelectorAll('[data-reveal]'));
    if (!nodes.length) return;

    if (URHOM.reduced || !('IntersectionObserver' in w)) {
      revealAll(nodes);
      return;
    }

    var vh = w.innerHeight;
    var above = [];
    var below = [];

    nodes.forEach(function (n) {
      // anything inside the first screen belongs to the opening sequence
      (n.getBoundingClientRect().top < vh ? above : below).push(n);
    });

    // first screen — play immediately, in authored order
    w.requestAnimationFrame(function () {
      w.requestAnimationFrame(function () { revealAll(above); });
    });

    if (below.length) {
      var io = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          reveal(entry.target);
          obs.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });

      below.forEach(function (n) { io.observe(n); });
    }

    // safety net: nothing stays invisible because an observer never fired.
    // reveal() is a no-op for anything already shown, so this no longer
    // re-touches the whole page.
    w.setTimeout(function () {
      nodes.forEach(function (n) {
        if (!n.classList.contains('is-revealed') &&
            n.getBoundingClientRect().top < w.innerHeight) reveal(n);
      });
    }, 2600);
  };

})(window, document);
