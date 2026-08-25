/*
 * Greenway - quote form.
 * Native HTML5 validation runs first. Delivery is via FormSubmit's AJAX
 * endpoint, which returns HTTP 200 with success:"false" on failure - so the
 * body is checked, not just res.ok. A visitor is never sent to the thank-you
 * page for a message that did not actually send.
 */
(function () {
  'use strict';
  var ENDPOINT = 'https://formsubmit.co/ajax/greenwaybusinessparkardagh@gmail.com';
  var form = document.getElementById('quoteForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // novalidate is set so we can control the message, so check explicitly.
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var btn = form.querySelector('button[type="submit"]');
    var err = document.getElementById('formError');
    var label = btn.textContent;
    if (err) err.style.display = 'none';
    btn.textContent = 'Sending…';
    btn.disabled = true;

    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });
    data._subject = 'New quote request — greenwaypropertyservices.ie';
    data._template = 'table';

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (res) {
        return res.json().then(function (body) { return { res: res, body: body }; });
      })
      .then(function (r) {
        if (!r.res.ok || String(r.body.success) !== 'true') throw new Error('not delivered');
        window.location.href = 'thank-you.html';
      })
      .catch(function () {
        btn.textContent = label;
        btn.disabled = false;
        if (err) { err.style.display = 'block'; err.focus(); }
      });
  });
})();
