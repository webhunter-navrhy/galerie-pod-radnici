// Formulář: demo režim neodesílá nic, ostrý režim posílá na endpoint ze site.json (data-endpoint).
(function () {
  document.querySelectorAll('form.formular').forEach(function (f) {
    var stav = f.querySelector('.formular-stav');
    f.addEventListener('submit', function (e) {
      var endpoint = f.getAttribute('data-endpoint');
      var demo = f.getAttribute('data-demo') === '1';
      if (f.querySelector('.past input').value) { e.preventDefault(); return; }   // robot
      if (demo || !endpoint) {
        e.preventDefault();
        stav.textContent = 'Ukázka formuláře: nic se neodesílá. Po spuštění webu bude zpráva doručena na e-mail firmy.';
        return;
      }
      e.preventDefault();
      stav.textContent = 'Odesílám…';
      fetch(endpoint, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); f.reset(); stav.textContent = 'Děkujeme, zpráva byla odeslána.'; })
        .catch(function () { stav.textContent = 'Odeslání se nepodařilo. Napište nám prosím e-mailem.'; });
    });
  });
})();

// Otevřeno dnes: podle otevírací doby v tabulce (Út–Pá 10–17, So 10–12)
(function () {
  var el = document.querySelector('[data-dnes]'); if (!el) return;
  var d = new Date(), den = d.getDay(), min = d.getHours() * 60 + d.getMinutes();
  var doba = {2:[600,1020],3:[600,1020],4:[600,1020],5:[600,1020],6:[600,720]}[den];
  if (doba && min >= doba[0] && min < doba[1]) el.textContent = 'Právě otevřeno.';
  else el.textContent = 'Právě zavřeno.';
  var r = document.querySelector('[data-den="' + (den >= 2 && den <= 5 ? 2 : den === 6 ? 6 : 0) + '"]');
  if (r) r.classList.add('dnes-radek');
})();
