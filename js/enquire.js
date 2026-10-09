/* ============================================================
   URHOM — callback request
   Three answers are asked for up front: what you are looking for,
   your name and your phone number. Everything else can be asked on
   the call. Validation runs here rather than in the browser so the
   messages read the same everywhere and are announced.

   Delivery: if the site is given an endpoint (window.URHOM_ENQUIRY
   .endpoint) the form POSTs to it and only reports success once the
   server confirms it. There is no such endpoint on this static build,
   so the form instead hands the request to the visitor's mail app and
   says exactly that. It never claims an enquiry was delivered.
   ============================================================ */
(function (w, d) {
  'use strict';

  var form = d.querySelector('[data-enquiry]');
  if (!form) return;

  var CFG = w.URHOM_ENQUIRY || {};
  var TO  = CFG.to || 'hello@urhom.in';
  var ENDPOINT = CFG.endpoint || null;

  var $  = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };

  /* Indian mobile: ten digits opening 6–9, with +91 / 91 / 0 tolerated. */
  var PHONE = /^[6-9]\d{9}$/;
  var NAME  = /^[\p{L}][\p{L}\p{M}'.\- ]*$/u;
  var digits = function (s) { return (s || '').replace(/\D/g, ''); };
  var national = function (s) { return digits(s).replace(/^(?:91|0)(?=\d{10}$)/, ''); };

  var RULES = {
    interest: function () {
      return $$('input[name="interest"]:checked').length
        ? '' : 'Pick at least one so we know who should call you.';
    },
    name: function () {
      var v = $('#f-name').value.trim();
      if (!v) return 'Please enter your name.';
      if (v.length < 2) return 'That looks too short — please enter your full name.';
      if (!NAME.test(v)) return 'Use letters, spaces, hyphens and apostrophes only.';
      return '';
    },
    phone: function () {
      var n = national($('#f-phone').value);
      if (!n) return 'Please enter a mobile number so we can call you back.';
      if (n.length !== 10) return 'An Indian mobile number has 10 digits — you entered ' + n.length + '.';
      if (!PHONE.test(n)) return 'A mobile number starts with 6, 7, 8 or 9.';
      return '';
    }
  };

  var CONTROL = { interest:'input[name="interest"]', name:'#f-name', phone:'#f-phone' };
  var ERRBOX  = { interest:'#e-interest',            name:'#e-name', phone:'#e-phone' };

  var touched = {};

  function show(key, msg) {
    var box = $(ERRBOX[key]);
    var field = $(CONTROL[key]).closest('.field, fieldset');
    if (box) { box.textContent = msg; box.hidden = !msg; }
    if (field) field.classList.toggle('is-bad', !!msg);
    $$(CONTROL[key], form).forEach(function (c) {
      if (msg) c.setAttribute('aria-invalid', 'true');
      else c.removeAttribute('aria-invalid');
    });
    return !msg;
  }

  function check(key) { return show(key, RULES[key]()); }

  Object.keys(RULES).forEach(function (key) {
    $$(CONTROL[key], form).forEach(function (el) {
      var ev = el.type === 'checkbox' ? 'change' : 'blur';
      el.addEventListener(ev, function () { touched[key] = true; check(key); });
      el.addEventListener('input', function () { if (touched[key]) check(key); });
    });
  });

  /* digits only, capped by digit count rather than character count so a
     pasted "+91 98765 43210" is not cut mid-number */
  var phoneEl = $('#f-phone');
  phoneEl.addEventListener('input', function () {
    var clean = digits(phoneEl.value).slice(0, 12);
    if (clean !== phoneEl.value) {
      var at = phoneEl.selectionStart - (phoneEl.value.length - clean.length);
      phoneEl.value = clean;
      try { phoneEl.setSelectionRange(Math.max(0, at), Math.max(0, at)); } catch (e) {}
    }
  });

  /* the +91 is already printed beside the field, so drop a typed or pasted
     country code from the display once they leave it */
  phoneEl.addEventListener('blur', function () {
    var n = national(phoneEl.value);
    if (n.length === 10) phoneEl.value = n;
  });

  var msg = $('#f-msg'), counter = $('[data-counter]');
  function count() {
    counter.textContent = msg.value.length + ' / 1200';
    counter.classList.toggle('is-near', msg.value.length > 1080);
  }
  msg.addEventListener('input', count);
  count();

  /* the note under the button tells the truth about what will happen */
  $('[data-note]').textContent = ENDPOINT
    ? 'We usually call back the same working day.'
    : 'This site has no server of its own, so sending opens the request in your '
      + 'email app, addressed to ' + TO + '. Nothing is stored here.';

  /* ---------------- payload ---------------- */

  function payload() {
    return {
      interest: $$('input[name="interest"]:checked').map(function (i) { return i.value; }),
      name:     $('#f-name').value.trim(),
      phone:    '+91' + national($('#f-phone').value),
      message:  msg.value.trim(),
      source:   'enquire.html'
    };
  }

  function asText(p) {
    return [
      'Name: ' + p.name,
      'Phone: ' + p.phone,
      'Looking for: ' + p.interest.join(', '),
      p.message ? '\nAbout the space:\n' + p.message : ''
    ].filter(Boolean).join('\n');
  }

  /* ---------------- submit ---------------- */

  var btn = $('[data-submit]');
  var banner = $('[data-form-error]');
  var busy = false;

  function setBusy(on) {
    busy = on;
    btn.disabled = on;
    btn.setAttribute('aria-busy', on ? 'true' : 'false');
    btn.classList.toggle('is-busy', on);
    $('.btn__label', btn).textContent = on ? 'Sending…' : 'Request a Callback';
  }

  function fail(text) {
    /* the form is left exactly as it was — nothing is cleared on a failure */
    banner.textContent = text;
    banner.hidden = false;
    banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function succeed(title, message, cta) {
    $('[data-done-title]').textContent = title;
    $('[data-done-msg]').textContent = message;
    $('[data-done-cta]').innerHTML = cta || '';
    form.hidden = true;
    var done = $('[data-done]');
    done.hidden = false;
    done.focus();
    done.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (busy) return;                               /* no double submits */
    if ($('#f-company').value) return;              /* honeypot */

    var bad = Object.keys(RULES).filter(function (k) { touched[k] = true; return !check(k); });

    if (bad.length) {
      banner.textContent = bad.length === 1
        ? 'One field needs attention before we can call you back.'
        : bad.length + ' fields need attention before we can call you back.';
      banner.hidden = false;
      var first = $(CONTROL[bad[0]]);
      first.focus({ preventScroll: true });
      first.closest('.field, fieldset').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    banner.hidden = true;
    var p = payload();

    /* ---- with a backend: success is only reported once it confirms ---- */
    if (ENDPOINT) {
      setBusy(true);
      w.fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res;
      }).then(function () {
        setBusy(false);
        succeed('Request received',
          'Thanks, ' + p.name.split(' ')[0] + '. We have your number and will call you back shortly.');
      }).catch(function () {
        setBusy(false);
        fail('We could not send that just now. Your details are still here — try again, ' +
             'or call us on +91 98765 43210.');
      });
      return;
    }

    /* ---- without one: hand it over, and say so rather than claim delivery ---- */
    var subject = 'Callback request — ' + p.name + ' (' + p.interest.join(', ') + ')';
    var href = 'mailto:' + TO + '?subject=' + encodeURIComponent(subject) +
               '&body=' + encodeURIComponent(asText(p));

    succeed('Your request is ready to send',
      'Thanks, ' + p.name.split(' ')[0] + '. Opening it in your email app is what actually ' +
      'sends it to ' + TO + ' — this page has no server to deliver it for you.',
      '<a class="btn btn--primary btn--lg" href="' + href + '">' +
      '<span class="btn__label">Open in your email app</span>' +
      '<svg class="btn__arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg></a>' +
      '<button class="btn btn--ghost btn--lg" type="button" data-copy>' +
      '<span class="btn__label">Copy the details</span></button>');

    $('[data-copy]').onclick = function () {
      var txt = 'To: ' + TO + '\n' + 'Subject: ' + subject + '\n\n' + asText(p);
      var label = $('[data-copy] .btn__label');
      var ok = function () {
        label.textContent = 'Copied';
        w.setTimeout(function () { label.textContent = 'Copy the details'; }, 1800);
      };
      if (w.navigator.clipboard) w.navigator.clipboard.writeText(txt).then(ok, legacy);
      else legacy();
      function legacy() {
        var ta = d.createElement('textarea');
        ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
        d.body.appendChild(ta); ta.select();
        try { d.execCommand('copy'); ok(); } catch (err) { label.textContent = 'Copy failed'; }
        d.body.removeChild(ta);
      }
    };
  });

  /* going back keeps everything that was typed */
  $('[data-again]').addEventListener('click', function () {
    $('[data-done]').hidden = true;
    form.hidden = false;
    $('#f-name').focus();
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

})(window, document);
