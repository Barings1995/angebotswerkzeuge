/* Vor eine Heftnummer gehört das Wort „Heft", vor eine Bezeichnung nicht: ein
   Sonderheft heißt „Sonderheft" oder „Supplement", nicht „Heft Sonderheft".
   Als Nummer gilt eine Zahl, auch mit Buchstaben dahinter („4a"), und eine
   Spanne aus zweien, gleich mit welchem Strich („1-2", „1–2", „1/2"). Alles
   andere ist frei eingetragen und benennt sich selbst. */
function istHeftnummer(heft) {
  return /^\d+[a-zA-Z]?(\s*[–—/-]\s*\d+[a-zA-Z]?)?$/.test(String(heft == null ? '' : heft).trim());
}
