/* ── HINWEISFENSTER ───────────────────────────────────────────────────────────
   Tritt an die Stelle von alert(). Aussehen aus dem Baustein fenster.css: die
   Meldung steht in der Optik des Werkzeugs statt in der des Browsers, hat eine
   Überschrift, und Aufzählungen lassen sich als Liste setzen statt als
   Zeilenumbrüche im Fließtext.
   Ein Klick daneben schließt nicht: die Meldung soll gelesen und nicht
   versehentlich weggewischt werden. Escape und der Knopf schließen.
   Zurück kommt ein Versprechen, das beim Schließen einlöst – so wartet der
   Aufrufer wie zuvor bei alert(), bis die Meldung zur Kenntnis genommen ist.
   Das Fenster wird bei jedem Aufruf neu angelegt und beim Schließen wieder
   entfernt; im Ruhezustand steht nichts davon im Seitengerüst.
   Braucht: esc() */
function hinweis(titel, html) {
  return new Promise(res => {
    const back = document.createElement('div');
    back.className = 'dlg-back';
    back.innerHTML = '<div class="dlg-box" role="alertdialog" aria-modal="true">'
      + '<div class="dlg-hd"></div><div class="dlg-tx"></div>'
      + '<div class="dlg-row"><button type="button" class="dlg-btn">Verstanden</button></div></div>';
    back.querySelector('.dlg-box').setAttribute('aria-label', titel);
    back.querySelector('.dlg-hd').textContent = titel;
    back.querySelector('.dlg-tx').innerHTML = html;
    const knopf = back.querySelector('button');
    const zu = () => {
      document.removeEventListener('keydown', escHinweis, true);
      back.remove();
      res();
    };
    function escHinweis(e) { if (e.key === 'Escape') { e.stopPropagation(); zu(); } }
    knopf.onclick = zu;
    document.addEventListener('keydown', escHinweis, true);
    document.body.appendChild(back);
    knopf.focus();
  });
}

/* Aufzählung für das Hinweisfenster. Ohne `max` stehen alle Zeilen darin und die
   Liste rollt in sich; mit `max` wird gedeckelt und der Rest gezählt. */
function hinweisListe(a, max = 0) {
  const zeigen = max ? a.slice(0, max) : a;
  return '<ul class="dlg-liste">' + zeigen.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>'
    + (max && a.length > max ? '<p>… und ' + (a.length - max) + ' weitere</p>' : '');
}
