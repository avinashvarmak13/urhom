/* ============================================================
   URHOM — header panels: Wishlist, Account, Cart
   One component, mounted into [data-uactions] on every page, so the
   three icons and their panels are defined once rather than copied
   into five headers.

   Wishlist and cart read and write js/store.js (localStorage).
   The account panel reflects js/auth.js: signed out it offers the
   sign-in flow, signed in it shows the account menu. It never shows
   account-specific content to someone who is not authenticated.
   ============================================================ */
(function (w, d) {
  'use strict';

  var mount = d.querySelector('[data-uactions]');
  if (!mount) return;

  var S = w.URHOM && w.URHOM.store;
  var A = w.URHOM && w.URHOM.auth;
  if (!S) return;

  var $  = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]; }); };
  var rupee = function (n) { return '₹ ' + n.toLocaleString('en-IN'); };

  var ICON = {
    heart: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 20s-7.2-4.5-7.2-9.4A4.2 4.2 0 0 1 12 8.1a4.2 4.2 0 0 1 7.2 2.5C19.2 15.5 12 20 12 20Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    user:  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8.4" r="3.6" stroke="currentColor" stroke-width="1.7"/><path d="M5 20a7 7 0 0 1 14 0" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    cart:  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.2 4h2.3l2 10.4h9.9l2-7.6H6.3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.2" cy="19" r="1.5" stroke="currentColor" stroke-width="1.7"/><circle cx="16.8" cy="19" r="1.5" stroke="currentColor" stroke-width="1.7"/></svg>',
    x:     '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    go:    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  var MENU = [
    { id:'profile',   label:'Profile Information', icon:'<circle cx="12" cy="8.4" r="3.4" stroke="currentColor" stroke-width="1.6"/><path d="M5.4 19.6a6.6 6.6 0 0 1 13.2 0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' },
    { id:'orders',    label:'My Orders',           icon:'<rect x="5" y="4.5" width="14" height="15" rx="2.2" stroke="currentColor" stroke-width="1.6"/><path d="M9 3.5h6M9 10h6M9 14h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' },
    { id:'wishlist',  label:'Wishlist',            icon:'<path d="M12 19.5s-6.4-4-6.4-8.4a3.7 3.7 0 0 1 6.4-2.2 3.7 3.7 0 0 1 6.4 2.2c0 4.4-6.4 8.4-6.4 8.4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>', badge:'wish' },
    { id:'addresses', label:'Addresses',           icon:'<path d="M12 21s-6.2-5.6-6.2-10.2A6.2 6.2 0 0 1 18.2 10.8C18.2 15.4 12 21 12 21Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="10.4" r="2.2" stroke="currentColor" stroke-width="1.6"/>' },
    { id:'payments',  label:'Payment Methods',     icon:'<rect x="3.5" y="6" width="17" height="12" rx="2.2" stroke="currentColor" stroke-width="1.6"/><path d="M3.5 10h17" stroke="currentColor" stroke-width="1.6"/>' },
    { id:'returns',   label:'Returns & Refunds',   icon:'<path d="M4 12a8 8 0 1 0 2.5-5.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M4 4v4h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' },
    { id:'settings',  label:'Settings',            icon:'<circle cx="12" cy="12" r="2.6" stroke="currentColor" stroke-width="1.6"/><path d="M12 4.5v2M12 17.5v2M4.5 12h2M17.5 12h2M6.7 6.7l1.4 1.4M15.9 15.9l1.4 1.4M17.3 6.7l-1.4 1.4M8.1 15.9l-1.4 1.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' }
  ];

  /* ============================================================
     markup
     ============================================================ */

  mount.innerHTML =
    '<button class="uact" type="button" data-panel-btn="wish" aria-expanded="false" aria-controls="panel-wish" aria-label="Wishlist">' +
      ICON.heart + '<span class="uact__label">Wishlist</span><span class="uact__n" data-n-wish hidden>0</span></button>' +
    '<button class="uact" type="button" data-panel-btn="account" aria-expanded="false" aria-controls="panel-account" aria-label="Account">' +
      ICON.user + '<span class="uact__label">Account</span></button>' +
    '<button class="uact" type="button" data-panel-btn="cart" aria-expanded="false" aria-controls="panel-cart" aria-label="Cart">' +
      ICON.cart + '<span class="uact__label">Cart</span><span class="uact__n" data-n-cart hidden>0</span></button>' +

    '<div class="upanel upanel--wish" id="panel-wish" data-panel="wish" role="dialog" aria-label="Wishlist" hidden>' +
      '<div class="upanel__head"><h2>' + ICON.heart + 'Wishlist <span class="upanel__n" data-n-wish2>0</span></h2>' +
      '<a class="upanel__link" href="wishlist.html">View All ' + ICON.go + '</a></div>' +
      '<div class="upanel__body" data-wish-body></div>' +
      '<div class="upanel__foot"><a class="ubtn ubtn--primary" href="wishlist.html">View Wishlist ' + ICON.go + '</a></div>' +
    '</div>' +

    '<div class="upanel upanel--account" id="panel-account" data-panel="account" role="dialog" aria-label="My account" hidden>' +
      '<div class="upanel__head"><h2>' + ICON.user + 'My Account</h2></div>' +
      '<div class="upanel__body" data-account-body></div>' +
    '</div>' +

    '<div class="upanel upanel--cart" id="panel-cart" data-panel="cart" role="dialog" aria-label="Cart" hidden>' +
      '<div class="upanel__head"><h2>' + ICON.cart + 'Cart <span class="upanel__n" data-n-cart2>0</span></h2></div>' +
      '<div class="upanel__body" data-cart-body></div>' +
      '<div class="upanel__foot" data-cart-foot></div>' +
    '</div>';

  /* the sign-in dialog lives at the end of <body>, not inside a panel */
  d.body.insertAdjacentHTML('beforeend',
    '<div class="uauth" data-auth hidden>' +
      '<div class="uauth__scrim" data-auth-close></div>' +
      '<div class="uauth__card" role="dialog" aria-modal="true" aria-labelledby="uauth-t">' +
        '<button class="uauth__x" type="button" data-auth-close aria-label="Close">' + ICON.x + '</button>' +
        '<div data-auth-body></div>' +
      '</div></div>');

  /* ============================================================
     panels
     ============================================================ */

  var openName = null;

  function setOpen(name) {
    openName = name;
    $$('[data-panel]').forEach(function (p) {
      var on = p.getAttribute('data-panel') === name;
      p.hidden = !on;
      p.classList.toggle('is-on', on);
    });
    $$('[data-panel-btn]').forEach(function (b) {
      b.setAttribute('aria-expanded', b.getAttribute('data-panel-btn') === name ? 'true' : 'false');
      b.classList.toggle('is-on', b.getAttribute('data-panel-btn') === name);
    });
  }

  function row(p, kind) {
    var qty = kind === 'cart'
      ? '<span class="urow__qty"><button type="button" data-qty="-1" data-ref="' + esc(p.ref) + '" aria-label="Decrease quantity of ' + esc(p.name) + '">&minus;</button>' +
        '<span data-qty-v aria-live="polite">' + p.qty + '</span>' +
        '<button type="button" data-qty="1" data-ref="' + esc(p.ref) + '" aria-label="Increase quantity of ' + esc(p.name) + '">+</button></span>'
      : '';
    return '<div class="urow">' +
      '<a class="urow__shot" href="' + p.href + '" aria-label="' + esc(p.name) + '">' +
        '<picture><source type="image/webp" srcset="' + p.img.replace('.jpg', '.webp') + '">' +
        '<img src="' + p.img + '" alt="" width="72" height="72" loading="lazy" decoding="async"></picture></a>' +
      '<div class="urow__text">' +
        '<a class="urow__name" href="' + p.href + '">' + esc(p.name) + '</a>' +
        (p.variant ? '<span class="urow__var">' + esc(p.variant) + '</span>' : '') +
        '<span class="urow__price">' + rupee(p.price) + '</span>' + qty +
      '</div>' +
      '<button class="urow__x" type="button" data-remove="' + kind + '" data-ref="' + esc(p.ref) + '"' +
      ' aria-label="Remove ' + esc(p.name) + ' from ' + kind + '">' + ICON.x + '</button>' +
    '</div>';
  }

  function renderWish() {
    var list = S.wishlist(), n = S.wishCount();
    $('[data-n-wish]').textContent = n;
    $('[data-n-wish]').hidden = !n;
    $('[data-n-wish2]').textContent = n;
    $('[data-wish-body]').innerHTML = list.length
      ? list.map(function (p) { return row(p, 'wish'); }).join('')
      : '<p class="upanel__empty">Nothing saved yet. Tap the heart on any product to keep it here.</p>';
    $('.upanel--wish .upanel__foot').hidden = !list.length;
  }

  function renderCart() {
    var t = S.totals(), n = S.cartCount();
    $('[data-n-cart]').textContent = n;
    $('[data-n-cart]').hidden = !n;
    $('[data-n-cart2]').textContent = n;
    $('[data-cart-body]').innerHTML = t.items.length
      ? t.items.map(function (p) { return row(p, 'cart'); }).join('')
      : '<p class="upanel__empty">Your cart is empty.</p>';
    $('[data-cart-foot]').hidden = !t.items.length;
    $('[data-cart-foot]').innerHTML = !t.items.length ? '' :
      '<dl class="usum">' +
        '<div><dt>Subtotal</dt><dd>' + rupee(t.subtotal) + '</dd></div>' +
        '<div><dt>Shipping</dt><dd>' + (t.shipping ? rupee(t.shipping) : '₹ 0') + '</dd></div>' +
        '<div class="usum__total"><dt>Total</dt><dd>' + rupee(t.total) + '</dd></div>' +
      '</dl>' +
      '<button class="ubtn ubtn--primary" type="button" data-checkout>Proceed to Checkout ' + ICON.go + '</button>' +
      '<p class="upanel__note" data-checkout-note hidden></p>';
  }

  function renderAccount(user) {
    var host = $('[data-account-body]');
    if (!user) {
      host.innerHTML =
        '<p class="upanel__empty">Sign in to see your orders, addresses and saved payment methods.</p>' +
        '<div class="upanel__stack">' +
          '<button class="ubtn ubtn--primary" type="button" data-auth-open="in">Sign in</button>' +
          '<button class="ubtn ubtn--ghost" type="button" data-auth-open="up">Create an account</button>' +
        '</div>' +
        (A && A.isConfigured() ? '' :
          '<p class="upanel__note">Accounts are not switched on for this site yet.</p>');
      return;
    }
    host.innerHTML =
      '<div class="uwho"><span class="uwho__av" aria-hidden="true">' +
        esc((user.email || '?').charAt(0).toUpperCase()) + '</span>' +
        '<span class="uwho__text"><span class="uwho__name">' + esc(user.displayName || user.email) + '</span>' +
        '<span class="uwho__sub">' + (user.emailVerified
          ? esc(user.email)
          : '<span class="uwho__warn">Email not verified</span>') + '</span></span></div>' +
      (user.emailVerified ? '' :
        '<div class="uverify">' +
          '<p class="uverify__t">Verify your email to finish setting up your account.</p>' +
          '<div class="uverify__row">' +
            '<button class="ubtn ubtn--ghost ubtn--sm" type="button" data-resend>Resend link</button>' +
            '<button class="ubtn ubtn--ghost ubtn--sm" type="button" data-recheck>I\'ve verified</button>' +
          '</div>' +
          '<p class="upanel__note" data-resend-note hidden></p>' +
        '</div>') +
      '<ul class="umenu">' + MENU.map(function (m) {
        var badge = m.badge === 'wish' && S.wishCount()
          ? '<span class="umenu__n">' + S.wishCount() + '</span>' : '';
        var href = m.id === 'wishlist' ? 'wishlist.html' : null;
        var inner = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' + m.icon + '</svg>' +
                    '<span>' + m.label + '</span>' + badge;
        return '<li>' + (href
          ? '<a href="' + href + '">' + inner + '</a>'
          : '<button type="button" data-acct="' + m.id + '">' + inner + '</button>') + '</li>';
      }).join('') + '</ul>' +
      '<div class="umenu umenu--out"><button type="button" data-signout>' +
        '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 17l5-5-5-5M20 12H9M12 20H6.5A1.5 1.5 0 0 1 5 18.5v-13A1.5 1.5 0 0 1 6.5 4H12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '<span>Log Out</span></button></div>' +
      '<p class="upanel__note" data-acct-note hidden></p>';
  }

  /* ============================================================
     auth dialog
     ============================================================ */

  var mode = 'in';
  var busy = false;

  function field(id, label, type, extra) {
    return '<div class="ufield"><label for="' + id + '">' + label + '</label>' +
      '<div class="ufield__wrap">' +
      '<input id="' + id + '" type="' + type + '" ' + (extra || '') + ' autocomplete="' +
      (type === 'email' ? 'email' : (id === 'ua-pw2' ? 'new-password' : (mode === 'up' ? 'new-password' : 'current-password'))) +
      '" aria-describedby="' + id + '-e">' +
      (type === 'password' ? '<button class="ufield__eye" type="button" data-eye="' + id + '" aria-label="Show password" aria-pressed="false">' +
        '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6"/></svg></button>' : '') +
      '</div><p class="uerr" id="' + id + '-e" hidden></p></div>';
  }

  function authHTML() {
    if (mode === 'reset') {
      return '<h2 id="uauth-t">Reset your password</h2>' +
        '<p class="uauth__sub">We will email you a link to choose a new one.</p>' +
        field('ua-email', 'Email', 'email', 'inputmode="email"') +
        '<p class="uerr uerr--form" data-auth-err hidden></p>' +
        '<p class="uok" data-auth-ok hidden></p>' +
        '<button class="ubtn ubtn--primary" type="submit" data-auth-submit>Send reset link</button>' +
        '<p class="uauth__alt"><button type="button" data-mode="in">Back to sign in</button></p>';
    }
    var up = mode === 'up';
    return '<h2 id="uauth-t">' + (up ? 'Create your account' : 'Sign in') + '</h2>' +
      '<p class="uauth__sub">' + (up
        ? 'One account for your wishlist, orders and addresses.'
        : 'Welcome back.') + '</p>' +
      field('ua-email', 'Email', 'email', 'inputmode="email"') +
      field('ua-pw', 'Password', 'password') +
      (up ? '<p class="uhint">At least 8 characters, with a letter and a number.</p>' : '') +
      '<p class="uerr uerr--form" data-auth-err hidden></p>' +
      '<p class="uok" data-auth-ok hidden></p>' +
      '<button class="ubtn ubtn--primary" type="submit" data-auth-submit>' +
        (up ? 'Create account' : 'Sign in') + '</button>' +
      (up ? '' : '<p class="uauth__alt"><button type="button" data-mode="reset">Forgot password?</button></p>') +
      '<p class="uauth__alt">' + (up
        ? 'Already have an account? <button type="button" data-mode="in">Sign in</button>'
        : 'New here? <button type="button" data-mode="up">Create an account</button>') + '</p>';
  }

  function renderAuth() {
    $('[data-auth-body]').innerHTML = '<form novalidate data-auth-form>' + authHTML() + '</form>';
    if (A && !A.isConfigured()) {
      var e = $('[data-auth-err]');
      e.textContent = 'Sign-in is not available yet: this site has no Firebase project configured, '
        + 'so no credentials can be checked. Nothing here will pretend otherwise.';
      e.hidden = false;
      $('[data-auth-submit]').disabled = true;
    }
  }

  function openAuth(m) {
    mode = m || 'in';
    renderAuth();
    $('[data-auth]').hidden = false;
    d.documentElement.classList.add('is-auth-open');
    var f = $('#ua-email'); if (f) f.focus();
  }

  function closeAuth() {
    $('[data-auth]').hidden = true;
    d.documentElement.classList.remove('is-auth-open');
  }

  function setErr(id, msg) {
    var box = $('#' + id + '-e'), input = $('#' + id);
    if (!box) return !msg;
    box.textContent = msg || '';
    box.hidden = !msg;
    if (input) {
      input.classList.toggle('is-bad', !!msg);
      if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    }
    return !msg;
  }

  var EMAIL = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

  function validate() {
    var ok = true;
    var email = ($('#ua-email') || {}).value || '';
    if (!email.trim())            ok = setErr('ua-email', 'Please enter your email address.') && ok;
    else if (!EMAIL.test(email.trim())) ok = setErr('ua-email', 'That does not look like a complete email address.') && ok;
    else setErr('ua-email', '');

    if (mode !== 'reset') {
      var pw = ($('#ua-pw') || {}).value || '';
      if (!pw)                          ok = setErr('ua-pw', 'Please enter your password.') && ok;
      else if (mode === 'up' && pw.length < 8)
        ok = setErr('ua-pw', 'Use at least 8 characters.') && ok;
      else if (mode === 'up' && !(/[A-Za-z]/.test(pw) && /\d/.test(pw)))
        ok = setErr('ua-pw', 'Include at least one letter and one number.') && ok;
      else setErr('ua-pw', '');
    }
    return ok;
  }

  function setBusy(on) {
    busy = on;
    var b = $('[data-auth-submit]');
    if (!b) return;
    b.disabled = on || (A && !A.isConfigured());
    b.setAttribute('aria-busy', on ? 'true' : 'false');
    b.classList.toggle('is-busy', on);
  }

  function formErr(msg) {
    var e = $('[data-auth-err]');
    e.textContent = msg; e.hidden = false;
    $('[data-auth-ok]').hidden = true;
  }
  function formOk(msg, done) {
    var e = $('[data-auth-ok]');
    e.textContent = msg; e.hidden = false;
    $('[data-auth-err]').hidden = true;
    /* After a successful registration the visitor is already signed in, so
       the submit button has nothing left to do — swap it for the way out
       rather than leaving them staring at a dialog with only an × . */
    if (done) {
      var b = $('[data-auth-submit]');
      if (b) {
        b.type = 'button';
        b.setAttribute('data-auth-done', '');
        b.removeAttribute('data-auth-submit');
        b.disabled = false;
        $('.btn__label', b) ? null : null;
        b.innerHTML = '<span>Continue to my account</span>';
      }
      $$('.uauth__alt').forEach(function (n) { n.hidden = true; });
    }
  }

  /* ============================================================
     events
     ============================================================ */

  d.addEventListener('click', function (e) {
    var t = e.target;

    var pb = t.closest('[data-panel-btn]');
    if (pb) {
      e.preventDefault();
      setOpen(openName === pb.getAttribute('data-panel-btn') ? null : pb.getAttribute('data-panel-btn'));
      return;
    }

    /* quantity */
    var q = t.closest('[data-qty]');
    if (q) {
      var ref = q.getAttribute('data-ref');
      var cur = S.cart().filter(function (p) { return p.ref === ref; })[0];
      S.setQty(ref, (cur ? cur.qty : 0) + (+q.getAttribute('data-qty')));
      return;
    }

    var rm = t.closest('[data-remove]');
    if (rm) {
      if (rm.getAttribute('data-remove') === 'cart') S.removeCart(rm.getAttribute('data-ref'));
      else S.removeWish(rm.getAttribute('data-ref'));
      return;
    }

    if (t.closest('[data-checkout]')) {
      /* There is no payment provider wired to this site. Saying "order
         placed" here would be a lie, so it says what is actually true. */
      var note = $('[data-checkout-note]');
      note.textContent = 'Checkout is not connected yet — no payment has been taken and no order was placed. '
        + 'Your basket is still here.';
      note.hidden = false;
      return;
    }

    var ao = t.closest('[data-auth-open]');
    if (ao) { setOpen(null); openAuth(ao.getAttribute('data-auth-open')); return; }
    if (t.closest('[data-auth-done]')) { closeAuth(); setOpen('account'); return; }
    if (t.closest('[data-auth-close]')) { closeAuth(); return; }

    var md = t.closest('[data-mode]');
    if (md) { mode = md.getAttribute('data-mode'); renderAuth(); $('#ua-email').focus(); return; }

    var eye = t.closest('[data-eye]');
    if (eye) {
      var inp = $('#' + eye.getAttribute('data-eye'));
      var show = inp.type === 'password';
      inp.type = show ? 'text' : 'password';
      eye.setAttribute('aria-pressed', show ? 'true' : 'false');
      eye.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      eye.classList.toggle('is-on', show);
      return;
    }

    if (t.closest('[data-signout]')) {
      if (!A) return;
      A.signOut().then(function () { setOpen(null); }, function (err) {
        var n = $('[data-acct-note]'); n.textContent = A.describe(err); n.hidden = false;
      });
      return;
    }

    /* Clicking the link in the inbox does not update the token already held
       in this tab — only a reload() tells us. So the state is re-read from
       Firebase, and "verified" is reported only if Firebase says so. */
    if (t.closest('[data-recheck]')) {
      if (!A) return;
      var cn = $('[data-resend-note]');
      var btn = t.closest('[data-recheck]');
      btn.disabled = true;
      cn.textContent = 'Checking…'; cn.hidden = false;
      A.refreshVerified().then(function (ok) {
        btn.disabled = false;
        if (ok) { cn.hidden = true; renderAccount(A.user()); }
        else cn.textContent = 'Still not verified. Open the link in the email, then check again.';
      }, function (err) {
        btn.disabled = false;
        cn.textContent = A.describe(err);
      });
      return;
    }

    if (t.closest('[data-resend]')) {
      if (!A) return;
      var rn = $('[data-resend-note]');
      A.resend().then(function () {
        rn.textContent = 'Verification email sent. It is only confirmed once you open the link.';
        rn.hidden = false;
      }, function (err) { rn.textContent = A.describe(err); rn.hidden = false; });
      return;
    }

    var ac = t.closest('[data-acct]');
    if (ac) {
      /* These screens do not exist: there is no orders, addresses or
         payments backend. Better to say so than to route to nothing. */
      var an = $('[data-acct-note]');
      an.textContent = 'That section is not built yet — there is no orders or payments backend behind this site.';
      an.hidden = false;
      return;
    }

    /* outside click closes the open panel */
    if (openName && !t.closest('[data-panel]') && !t.closest('[data-panel-btn]')) setOpen(null);
  });

  d.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!$('[data-auth]').hidden) { closeAuth(); return; }
    if (openName) {
      var btn = $('[data-panel-btn="' + openName + '"]');
      setOpen(null);
      if (btn) btn.focus();
    }
  });

  d.addEventListener('submit', function (e) {
    if (!e.target.matches('[data-auth-form]')) return;
    e.preventDefault();
    if (busy || !A || !A.isConfigured()) return;
    if (!validate()) return;

    var email = $('#ua-email').value.trim();
    var pw = mode === 'reset' ? '' : $('#ua-pw').value;
    setBusy(true);

    var done = function (fn) { return function (x) { setBusy(false); fn(x); }; };

    if (mode === 'reset') {
      A.reset(email).then(done(function () {
        /* deliberately not "we found your account" — that would leak
           whether the address is registered */
        formOk('If that address has an account, a reset link is on its way.');
      }), done(function (err) { formErr(A.describe(err)); }));
      return;
    }

    if (mode === 'up') {
      A.register(email, pw).then(done(function (r) {
        formOk(r.verificationSent
          ? 'Account created. Check your inbox and open the verification link — your email is not verified until you do.'
          : 'Account created, but the verification email could not be sent. Try Resend from your account menu.',
          true);
      }), done(function (err) { formErr(A.describe(err)); }));
      return;
    }

    A.signIn(email, pw).then(done(function (r) {
      if (!r.verified) {
        formOk('Signed in. Your email is still unverified — open the link we sent to finish.');
      }
      closeAuth();
      setOpen('account');
    }), done(function (err) { formErr(A.describe(err)); }));
  });

  /* ============================================================
     boot
     ============================================================ */

  S.subscribe(function () { renderWish(); renderCart(); if (A) renderAccount(A.user()); });
  renderWish();
  renderCart();
  renderAccount(null);
  if (A) A.onChange(function (u) { renderAccount(u); });

  w.URHOM.panels = { open: setOpen, openAuth: openAuth };

})(window, document);
