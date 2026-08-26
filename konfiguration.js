// ---------------------------------------------------------------------------
//  Angebotswerkzeuge — Zugang zur Preisliste
//
//  Beide Angaben sind zur Veroeffentlichung bestimmt. Anders als bei der
//  Jahresvorschau ist das Lesen hier bewusst offen: die Preisliste liegt
//  ohnehin als Datei im oeffentlichen Repository, und die Werkzeuge sollen
//  sich oeffnen und rechnen lassen, ohne dass sich jemand anmeldet.
//
//  Der Schluessel gibt deshalb genau so viel frei, wie ohnehin offenliegt:
//  Preise und Termine lesen. Aendern darf nur, wer angemeldet ist UND in der
//  Tabelle "berechtigt" steht — nachgewiesen mit vier Proben am 26.08.2026:
//  ohne Anmeldung lesen erlaubt, schreiben abgewiesen; angemeldet ohne
//  Freigabe lesen erlaubt, schreiben abgewiesen.
//
//  Diese Datei liegt neben den Werkzeugen. Laesst sie sich nicht laden — etwa
//  beim Oeffnen per Doppelklick —, faellt jedes Werkzeug auf die
//  Angebotsdaten.xlsx zurueck und sagt es in der Statuszeile.
// ---------------------------------------------------------------------------

const SUPABASE_URL = 'https://ofvpxgnxwzwxbnhtwupq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdnB4Z254d3p3eGJuaHR3dXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3NzkwNTQsImV4cCI6MjEwMzM1NTA1NH0.AwI39637dQo4sO8VthJyXNB-EvMAoHV-FtUCIqHFFeM';
