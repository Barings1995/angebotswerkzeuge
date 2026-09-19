/* ── EXCEL-BIBLIOTHEK BEI BEDARF ──────────────────────────────────────────────
   ExcelJS wird erst geladen, wenn eine Excel gelesen oder geschrieben wird, und
   nur einmal je Seite. Scheitert das Laden, kommt ein lesbarer Satz zurück: ohne
   ihn stand in MediaQuote „[object Event]" in der Meldung. */
function ensureExcelJS() {
  if (window.ExcelJS) return Promise.resolve();
  return new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/exceljs@4.3.0/dist/exceljs.min.js';
    s.onload = res;
    s.onerror = () => rej(new Error('Excel-Bibliothek konnte nicht geladen werden (Internetverbindung?).'));
    document.head.appendChild(s);
  });
}
