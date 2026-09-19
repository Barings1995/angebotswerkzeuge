/* ── RÜCKFRAGEFENSTER ─────────────────────────────────────────────────────────
   Tritt an die Stelle von confirm(). Aufbau wie das Hinweisfenster, nur mit zwei
   Knöpfen; Aussehen aus dem Baustein fenster.css. Der Vorteil gegenüber confirm()
   liegt weniger in der Optik als in der Beschriftung: der Browser konnte nur „OK"
   und „Abbrechen" anbieten, hier steht auf dem Knopf, was er tut.
   Zurück kommt ein Versprechen mit true (bestätigt) oder false (abgelehnt).
   Abgelehnt wird auch durch Escape – wie bei confirm(), wo Escape „Abbrechen"
   entsprach. Der Fokus liegt auf dem abweisenden Knopf: die Rückfrage steht vor
   einer Handlung, die etwas verwirft, und die Eingabetaste soll dann nichts
   auslösen, was nicht ausdrücklich gewollt ist. */
function frage(titel, html, jaText, neinText = 'Abbrechen') {
  return new Promise(res => {
    const back = document.createElement('div');
    back.className = 'dlg-back';
    back.innerHTML = '<div class="dlg-box" role="dialog" aria-modal="true">'
      + '<div class="dlg-hd"></div><div class="dlg-tx"></div>'
      + '<div class="dlg-row"><button type="button" class="dlg-btn sekundaer" data-w="nein"></button>'
      + '<button type="button" class="dlg-btn gefahr" data-w="ja"></button></div></div>';
    back.querySelector('.dlg-box').setAttribute('aria-label', titel);
    back.querySelector('.dlg-hd').textContent = titel;
    back.querySelector('.dlg-tx').innerHTML = html;
    const bJa = back.querySelector('[data-w="ja"]'), bNein = back.querySelector('[data-w="nein"]');
    bJa.textContent = jaText;
    bNein.textContent = neinText;
    const zu = w => {
      document.removeEventListener('keydown', escFrage, true);
      back.remove();
      res(w);
    };
    function escFrage(e) { if (e.key === 'Escape') { e.stopPropagation(); zu(false); } }
    bJa.onclick = () => zu(true);
    bNein.onclick = () => zu(false);
    document.addEventListener('keydown', escFrage, true);
    document.body.appendChild(back);
    bNein.focus();
  });
}
