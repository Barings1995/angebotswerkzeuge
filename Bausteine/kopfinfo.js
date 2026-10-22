/* ── KURZ ERKLÄRT ────────────────────────────────────────────────────────────
   Das Info-Zeichen neben dem Namen des Werkzeugs in der Kopfleiste. Ein Klick
   öffnet die Kurzerklärung, ein zweiter Klick, ein Klick daneben oder Escape
   schließt sie; ein Klick in den Text selbst lässt sie offen. Bis zum 22.10.2026
   stand eine Kurzfassung als feste Zeile unter dem Namen; so ist die Kopfleiste
   flacher, und seit dem 23.10.2026 hat die Erklärung Platz für Ablauf und Regeln.
   Aussehen im Baustein kopfleiste.css. */
function kopfinfoSchliessen(ausser) {
  document.querySelectorAll('.hero-info.offen').forEach(box => {
    if (box === ausser) return;
    box.classList.remove('offen');
    box.querySelector('.hero-info-btn')?.setAttribute('aria-expanded', 'false');
  });
}
document.addEventListener('click', e => {
  if (e.target.closest('.hero-info-text')) return;
  const knopf = e.target.closest('.hero-info-btn');
  const box = knopf?.closest('.hero-info');
  kopfinfoSchliessen(box);
  if (box) knopf.setAttribute('aria-expanded', String(box.classList.toggle('offen')));
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') kopfinfoSchliessen(null);
});
