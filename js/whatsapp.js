/* URHOM — floating WhatsApp control, one per page, injected by this file so
   no page carries its own copy. The number is the one already configured in
   the site footer and enquiry page; nothing is invented here. */
(function (w, d) {
  'use strict';
  if (d.querySelector('[data-wa]')) return;          /* never duplicate */

  var NUMBER = '919876543210';                        /* = tel:+919876543210 */
  var TEXT = 'Hi URHOM, I would like to know more about your furniture and interiors.';

  var a = d.createElement('a');
  a.className = 'wa';
  a.setAttribute('data-wa', '');
  a.href = 'https://wa.me/' + NUMBER + '?text=' + encodeURIComponent(TEXT);
  a.target = '_blank';
  a.rel = 'noopener';
  a.setAttribute('aria-label', 'Chat with URHOM on WhatsApp');
  a.innerHTML =
    '<span class="wa__halo" aria-hidden="true"></span>' +
    '<svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true"><path fill="currentColor" d="M16.04 3C9.4 3 4 8.4 4 15.04c0 2.12.55 4.19 1.6 6.02L4 29l8.13-1.56a12 12 0 0 0 3.91.65h.01C22.7 28.09 28.1 22.69 28.1 16.05 28.1 8.4 22.69 3 16.04 3Zm0 22.03h-.01a10 10 0 0 1-5.08-1.39l-.36-.22-4.82.93.96-4.7-.24-.38a9.96 9.96 0 1 1 9.55 5.76Zm5.47-7.46c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15s-.77.97-.94 1.17c-.18.2-.35.22-.65.07-.3-.15-1.26-.47-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.38-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z"/></svg>';
  d.body.appendChild(a);
})(window, document);
