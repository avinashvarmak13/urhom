/* ============================================================
   URHOM — authentication
   A thin wrapper over Firebase Authentication (Web SDK v10, loaded
   from the CDN only once a real configuration is present).

   Two rules this file does not bend:
     1. It never reports a successful sign-in, registration or email
        verification that Firebase did not confirm.
     2. It never stores or transmits a password itself. Credentials go
        straight to Firebase over its own HTTPS endpoints.

   With js/firebase-config.js still holding placeholders, isConfigured()
   is false, every call rejects with 'auth/not-configured', and the UI
   says so plainly instead of simulating anything.
   ============================================================ */
(function (w) {
  'use strict';

  var CFG = w.URHOM_FIREBASE || {};
  var configured = !!CFG.apiKey && CFG.apiKey.indexOf('REPLACE_WITH') !== 0;

  var SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';
  var ready = null;         /* a promise for { auth, fns }, created on demand */
  var subs = [];
  var current = null;

  function notConfigured() {
    var e = new Error('Authentication is not configured yet.');
    e.code = 'auth/not-configured';
    return Promise.reject(e);
  }

  function load() {
    if (!configured) return notConfigured();
    if (ready) return ready;
    ready = Promise.all([
      import(SDK + 'firebase-app.js'),
      import(SDK + 'firebase-auth.js')
    ]).then(function (mods) {
      var app = mods[0].initializeApp(CFG);
      var a = mods[1];
      var auth = a.getAuth(app);
      /* survive a reload and a closed tab; Firebase refreshes the token */
      return a.setPersistence(auth, a.browserLocalPersistence)
        .catch(function () {})            /* blocked storage — session only */
        .then(function () {
          a.onAuthStateChanged(auth, function (u) {
            current = u;
            subs.forEach(function (fn) { try { fn(u); } catch (e) {} });
          });
          return { auth: auth, a: a };
        });
    });
    return ready;
  }

  /* Firebase's own codes are terse and some are deliberately vague to
     avoid telling an attacker which addresses exist. Keep that property. */
  var MSG = {
    'auth/invalid-email':            'That does not look like a valid email address.',
    'auth/missing-password':         'Please enter your password.',
    'auth/weak-password':            'Password is too weak — use at least 8 characters.',
    'auth/email-already-in-use':     'If that address can be registered, we have sent it an email. Check your inbox.',
    'auth/invalid-credential':       'Email or password is incorrect.',
    'auth/wrong-password':           'Email or password is incorrect.',
    'auth/user-not-found':           'Email or password is incorrect.',
    'auth/too-many-requests':        'Too many attempts. Wait a few minutes and try again.',
    'auth/network-request-failed':   'Network problem — check your connection and try again.',
    'auth/operation-not-allowed':    'Email and password sign-in is not enabled in the Firebase console yet.',
    'auth/unauthorized-domain':      'This domain is not in the Firebase authorised domains list.',
    'auth/requires-recent-login':    'Please sign in again to continue.',
    'auth/not-configured':           'Sign-in is not available yet — Firebase has not been configured for this site.',
    /* a wrong or revoked web API key — the project is misconfigured, and the
       visitor is told it is our problem rather than their credentials */
    'auth/api-key-not-valid.-please-pass-a-valid-api-key.':
                                     'Sign-in is misconfigured on our side. Please try again later.',
    'auth/invalid-api-key':          'Sign-in is misconfigured on our side. Please try again later.',
    'auth/admin-restricted-operation':'Sign-up is restricted for this project.',
    'auth/popup-blocked':            'Your browser blocked the sign-in window.',
    'auth/internal-error':           'Something went wrong on the sign-in service. Please try again.'
  };

  function describe(err) {
    return MSG[err && err.code] || 'Something went wrong. Please try again.';
  }

  var api = {
    isConfigured: function () { return configured; },
    user: function () { return current; },

    onChange: function (fn) {
      subs.push(fn);
      if (configured) load().then(function () { fn(current); }).catch(function () {});
      else fn(null);
      return function () { subs = subs.filter(function (f) { return f !== fn; }); };
    },

    register: function (email, password) {
      return load().then(function (f) {
        return f.a.createUserWithEmailAndPassword(f.auth, email, password)
          .then(function (cred) {
            /* the account exists but is NOT verified yet — say exactly that */
            return f.a.sendEmailVerification(cred.user).then(function () {
              return { user: cred.user, verificationSent: true };
            }, function () {
              return { user: cred.user, verificationSent: false };
            });
          });
      });
    },

    signIn: function (email, password) {
      return load().then(function (f) {
        return f.a.signInWithEmailAndPassword(f.auth, email, password)
          .then(function (cred) { return { user: cred.user, verified: cred.user.emailVerified }; });
      });
    },

    resend: function () {
      return load().then(function (f) {
        if (!f.auth.currentUser) throw Object.assign(new Error('no user'), { code: 'auth/requires-recent-login' });
        return f.a.sendEmailVerification(f.auth.currentUser);
      });
    },

    /* reload() is the only way to learn that a user clicked the link in
       their inbox — the local token does not update on its own */
    refreshVerified: function () {
      return load().then(function (f) {
        if (!f.auth.currentUser) return false;
        return f.auth.currentUser.reload().then(function () { return f.auth.currentUser.emailVerified; });
      });
    },

    reset: function (email) {
      return load().then(function (f) {
        return f.a.sendPasswordResetEmail(f.auth, email);
      });
    },

    signOut: function () {
      return load().then(function (f) { return f.a.signOut(f.auth); });
    },

    describe: describe
  };

  w.URHOM = w.URHOM || {};
  w.URHOM.auth = api;

})(window);
