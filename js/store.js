/* ============================================================
   URHOM — wishlist + cart store
   One place holding what the visitor has saved and what is in their
   basket, shared by the header panels and by every product grid.

   Items are referenced as "<collection>:<id>" so a product resolves
   back through js/catalog.js rather than being copied; prices and
   names can never drift from the catalogue.

   Persistence is localStorage. It is per-browser and per-device:
   there is no account storage behind it, because there is no
   backend. Signing in does not sync it anywhere.
   ============================================================ */
(function (w) {
  'use strict';

  var NS = 'urhom.v1.';
  var WISH = NS + 'wishlist';
  var CART = NS + 'cart';

  /* No shipping rules exist for this business yet, so nothing is charged
     and nothing is invented. Change this one function when they do. */
  function shippingFor() { return 0; }

  function read(key, fallback) {
    try {
      var raw = w.localStorage.getItem(key);
      if (!raw) return fallback;
      var v = JSON.parse(raw);
      return Array.isArray(v) ? v : fallback;
    } catch (e) { return fallback; }      /* private mode, blocked storage */
  }

  function write(key, value) {
    try { w.localStorage.setItem(key, JSON.stringify(value)); }
    catch (e) { /* storage unavailable — the session still works in memory */ }
  }

  var wish = read(WISH, []);
  var cart = read(CART, []);
  var subs = [];

  function emit() {
    write(WISH, wish);
    write(CART, cart);
    subs.forEach(function (fn) { try { fn(); } catch (e) {} });
  }

  /* ---------------- catalogue lookup ---------------- */

  function parse(ref) {
    var i = String(ref).indexOf(':');
    return { key: String(ref).slice(0, i), id: +String(ref).slice(i + 1) };
  }

  function product(ref) {
    var r = parse(ref);
    var c = w.URHOM && w.URHOM.catalog && w.URHOM.catalog[r.key];
    if (!c) return null;
    for (var i = 0; i < c.products.length; i++) {
      if (c.products[i].id === r.id) {
        var p = c.products[i];
        return {
          ref: ref, id: p.id, key: r.key, name: p.name, price: p.price, mrp: p.mrp,
          img: c.assets + p.img, alt: p.alt,
          /* the reference shows a variant line under each name; the catalogue's
             closest real equivalent is colour + material */
          variant: [p.color, p.material].filter(Boolean).join(' | '),
          href: c.page + '#cat=' + p.cats[0]
        };
      }
    }
    return null;
  }

  function resolve(list) {
    return list.map(function (x) {
      var ref = typeof x === 'string' ? x : x.ref;
      var p = product(ref);
      if (!p) return null;
      if (x && x.qty) p.qty = x.qty;
      return p;
    }).filter(Boolean);
  }

  /* ---------------- api ---------------- */

  var store = {
    /* wishlist */
    wishRefs: function () { return wish.slice(); },
    wishlist: function () { return resolve(wish); },
    wishCount: function () { return wish.length; },
    hasWish: function (ref) { return wish.indexOf(ref) > -1; },
    toggleWish: function (ref) {
      var i = wish.indexOf(ref);
      if (i > -1) wish.splice(i, 1); else wish.push(ref);
      emit();
      return i < 0;                       /* true when it was just added */
    },
    removeWish: function (ref) {
      var i = wish.indexOf(ref);
      if (i > -1) { wish.splice(i, 1); emit(); }
    },

    /* cart */
    cart: function () { return resolve(cart); },
    cartCount: function () {
      return cart.reduce(function (n, x) { return n + x.qty; }, 0);
    },
    add: function (ref, qty) {
      qty = qty || 1;
      var row = cart.filter(function (x) { return x.ref === ref; })[0];
      if (row) row.qty = Math.min(99, row.qty + qty);
      else cart.push({ ref: ref, qty: qty });
      emit();
    },
    setQty: function (ref, qty) {
      qty = Math.max(0, Math.min(99, qty | 0));
      var i = -1;
      cart.forEach(function (x, n) { if (x.ref === ref) i = n; });
      if (i < 0) return;
      if (qty === 0) cart.splice(i, 1); else cart[i].qty = qty;
      emit();
    },
    removeCart: function (ref) { store.setQty(ref, 0); },

    /* money — integers throughout, so no floating-point drift */
    totals: function () {
      var items = resolve(cart);
      var subtotal = items.reduce(function (n, p) { return n + p.price * p.qty; }, 0);
      var shipping = items.length ? shippingFor(subtotal) : 0;
      return { items: items, subtotal: subtotal, shipping: shipping, total: subtotal + shipping };
    },

    clearCart: function () { cart = []; emit(); },

    subscribe: function (fn) { subs.push(fn); return function () {
      subs = subs.filter(function (f) { return f !== fn; }); }; },

    product: product
  };

  /* another tab changing the basket should be reflected here */
  w.addEventListener('storage', function (e) {
    if (e.key !== WISH && e.key !== CART) return;
    wish = read(WISH, []);
    cart = read(CART, []);
    subs.forEach(function (fn) { try { fn(); } catch (err) {} });
  });

  w.URHOM = w.URHOM || {};
  w.URHOM.store = store;

})(window);
