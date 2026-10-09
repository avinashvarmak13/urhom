/* ============================================================
   URHOM — the full wishlist page
   Renders whatever js/store.js is holding, in the same product-card
   shape the collection pages use, and stays in step as items are
   removed from here or from the header panel.
   ============================================================ */
(function (w, d) {
  'use strict';

  var S = w.URHOM && w.URHOM.store;
  var grid = d.querySelector('[data-wp-grid]');
  if (!S || !grid) return;

  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]; }); };
  var rupee = function (n) { return '₹ ' + n.toLocaleString('en-IN'); };

  function card(p) {
    return '<article class="pc" data-ref="' + esc(p.ref) + '">' +
      '<a class="pc__shot" href="' + p.href + '">' +
        '<picture><source type="image/webp" srcset="' + p.img.replace('.jpg', '.webp') + '">' +
        '<img class="pc__img" src="' + p.img + '" alt="' + esc(p.alt) + '" width="280" height="144" loading="lazy" decoding="async"></picture>' +
        '<button class="pc__wish is-on" type="button" data-drop="' + esc(p.ref) + '" aria-pressed="true"' +
        ' aria-label="Remove ' + esc(p.name) + ' from wishlist">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7.2-4.5-7.2-9.4A4.2 4.2 0 0 1 12 8.1a4.2 4.2 0 0 1 7.2 2.5C19.2 15.5 12 20 12 20Z"/></svg></button>' +
      '</a>' +
      '<div class="pc__body">' +
        '<h2 class="pc__name"><a href="' + p.href + '">' + esc(p.name) + '</a></h2>' +
        (p.variant ? '<p class="pc__var">' + esc(p.variant) + '</p>' : '') +
        '<div class="pc__foot"><div class="pc__left">' +
          '<span class="pc__priceline"><span class="pc__price">' + rupee(p.price) + '</span>' +
          (p.mrp ? '<s class="pc__mrp">' + rupee(p.mrp) + '</s>' : '') + '</span></div>' +
          '<button class="pc__cart" type="button" data-move="' + esc(p.ref) + '" aria-label="Add ' + esc(p.name) + ' to cart">' +
          '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.2 4h2.3l2 10.4h9.9l2-7.6H6.3" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.2" cy="19" r="1.4" fill="currentColor"/><circle cx="16.8" cy="19" r="1.4" fill="currentColor"/></svg></button>' +
        '</div>' +
      '</div></article>';
  }

  function render() {
    var list = S.wishlist();
    grid.innerHTML = list.map(card).join('');
    grid.hidden = !list.length;
    d.querySelector('[data-wp-empty]').hidden = list.length > 0;
    d.querySelector('[data-wp-count]').textContent = list.length
      ? list.length + (list.length === 1 ? ' saved item' : ' saved items')
      : '';
  }

  d.addEventListener('click', function (e) {
    var drop = e.target.closest('[data-drop]');
    if (drop) { e.preventDefault(); S.removeWish(drop.getAttribute('data-drop')); return; }
    var move = e.target.closest('[data-move]');
    if (move) {
      S.add(move.getAttribute('data-move'));
      move.classList.add('is-added');
      w.setTimeout(function () { move.classList.remove('is-added'); }, 550);
    }
  });

  S.subscribe(render);
  render();

})(window, document);
