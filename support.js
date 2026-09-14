// Waitlist form: posts to /api/waitlist if a backend exists; otherwise
// falls back to a mailto draft so no signup is silently lost.
(function () {
  var form = document.getElementById('waitlist-form');
  if (!form) return;

  var status = document.getElementById('waitlist-status');
  var emailInput = document.getElementById('email');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = emailInput.value.trim();
    if (!email) return;

    status.textContent = 'Submitting…';
    status.classList.remove('error');

    fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, source: 'landing_page' })
    })
      .then(function (res) {
        if (!res.ok) throw new Error('backend unavailable');
        status.textContent = "You're on the list — we'll be in touch.";
        form.reset();
      })
      .catch(function () {
        // No backend wired up yet: hand off to mailto so the lead isn't lost.
        status.textContent = 'No backend connected yet — opening your email client instead.';
        status.classList.add('error');
        window.location.href =
          'mailto:hello@cypherpunk.example?subject=Waitlist&body=' +
          encodeURIComponent('Add me to the Cypherpunk waitlist: ' + email);
      });
  });
})();
