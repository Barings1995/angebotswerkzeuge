/* ── DATENBANK (nur lesen) ────────────────────────────────────────────────────
   Die Werkzeuge lesen Preise und Termine aus der Datenbank, schreiben aber nie
   hinein; das tut allein die Datenpflege, mit eigener Anmeldung. Gelesen wird
   deshalb mit dem öffentlichen Schlüssel aus konfiguration.js.
   Fehlt konfiguration.js oder ist sie leer, gilt die Datenbank als nicht
   erreichbar, und das Werkzeug lädt die Preisliste auf anderem Weg.
   „no-cache" fragt bei jedem Laden nach, ob sich etwas geändert hat, statt einen
   älteren Stand aus dem Browser zu zeigen. */
function dbErreichbar() {
  return typeof SUPABASE_URL === 'string' && typeof SUPABASE_ANON_KEY === 'string'
      && SUPABASE_URL && SUPABASE_ANON_KEY;
}

async function dbHolen(pfad) {
  const r = await fetch(SUPABASE_URL + '/rest/v1/' + pfad, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + SUPABASE_ANON_KEY },
    cache: 'no-cache'
  });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.json();
}
