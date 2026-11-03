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

/* katalog děl: filtr podle autora a textu, postupné zobrazování */
(function(){
  var seznam=document.querySelector('[data-dila]'); if(!seznam) return;
  var polozky=[].slice.call(seznam.children), selA=document.querySelector('[data-f-autor]'),
      txt=document.querySelector('[data-f-text]'), pocet=document.querySelector('[data-f-pocet]'),
      nic=document.querySelector('[data-nic]'), vic=document.querySelector('[data-vic]'), krok=48, limit=krok;
  var q=new URLSearchParams(location.search).get('autor'); if(q) selA.value=q;
  function pouzij(){
    var a=selA.value, t=txt.value.trim().toLowerCase(), shoda=0, videt=0;
    polozky.forEach(function(li){
      var ok=(!a||li.dataset.autor===a)&&(!t||li.dataset.hledat.indexOf(t)>-1);
      if(ok) shoda++;
      var zobr=ok&&shoda<=limit; li.hidden=!zobr; if(zobr) videt++;
    });
    pocet.textContent='Zobrazeno '+videt+' z '+shoda+' děl';
    nic.hidden=shoda>0; vic.hidden=shoda<=limit;
  }
  selA.addEventListener('change',function(){limit=krok;pouzij();});
  txt.addEventListener('input',function(){limit=krok;pouzij();});
  vic.addEventListener('click',function(){limit+=krok;pouzij();});
  pouzij();
})();
