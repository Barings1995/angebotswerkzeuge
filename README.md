# Angebotswerkzeuge

Vier Werkzeuge für Platzierungs- und Preisangebote der Printtitel, mit einer
gemeinsamen Preisliste. Reines HTML, CSS und JavaScript — kein Bauvorgang, kein Node,
keine Zusatzbibliotheken außer ExcelJS, das bei Bedarf nachgeladen wird.

Preise und Termine kommen seit dem 27.08.2026 aus einer Datenbank. Die
`Angebotsdaten.xlsx` bleibt daneben liegen und springt ein, wenn die Datenbank
nicht antwortet.

Jede Datei läuft weiterhin auch per Doppelklick vom Rechner — und holt sich dabei
jetzt ebenfalls die aktuellen Zahlen, weil die Datenbank über https erreichbar ist.
Nur die Nachbardatei darf der Browser aus `file://` heraus nicht lesen.

## Örtlich starten

```bash
python3 -m http.server 5003 --directory "$(dirname "$0")"
```

Dann `http://localhost:5003` im Browser öffnen. Ein Server wird gebraucht, weil der
Browser aus `file://` heraus keine Nachbardateien lesen darf.

## Aufbau

| Datei | Aufgabe |
|---|---|
| `index.html` | Startseite mit den vier Werkzeugen und dem Stand der Preisliste |
| `OpenSlots_Angebotsplaner.html` | Platzierungen über die Ausgaben eines Jahrgangs ankreuzen |
| `MediaQuote_Angebotsvorlage.html` | Angebot mit Positionen, Rabatt und Summen; Farbzuschlag getrennt ausgewiesen (s/w-Preis, 4c-Zuschlag, 4c-Preis) |
| `MediaQuote_Angebotsvorlage_4C.html` | dieselbe Vorlage mit einer einzigen Preisspalte (nur 4c-Preis) |
| `PreisWerk_Paketrechner.html` | Formate mehrerer Titel zu einem Paket rechnen: Staffelrabatt titelübergreifend innerhalb eines Fachbereichs, AE-Provision, Ersparnis |
| `Angebotsvorlage_Print*.html` | nur Weiterleitungen: die Vorlagen hießen bis zum 14.08.2026 so. Können entfallen, sobald keine Lesezeichen mehr darauf zeigen |
| `Preispflege.html` | Preise und Termine pflegen — mit Anmeldung, siehe unten |
| `Angebotsdaten.xlsx` | die gemeinsame Preisliste (Blätter „Preise", „Termine", „Info") — Notweg |
| `manifest.webmanifest` | Name und Symbol beim Ablegen im Dock |

Nicht im Repository, nur im Arbeitsordner: die beiden Änderungslogs, der Ordner
`Sicherungskopien/` mit den früheren Ständen und `Preisliste abgleichen.command`
(Doppelklick-Helfer, siehe unten) — interne Arbeitsunterlagen (siehe `.gitignore`).

## Woher die Zahlen kommen

Drei Bezugsquellen, in dieser Reihenfolge:

1. **Datenbank** — Supabase-Projekt `angebotswerkzeuge`, Frankfurt, Kennung
   `ofvpxgnxwzwxbnhtwupq`, 0 €/Monat. Aufbau in `schema.sql`, Zugang in
   `konfiguration.js`. Lesen ist offen, Ändern nur für Angemeldete aus der Tabelle
   `berechtigt`.
2. **`Angebotsdaten.xlsx`** daneben — der Notweg, wenn die Datenbank schweigt.
3. **Zwischenspeicher im Browser** — der zuletzt geladene Stand.

Die Statuszeile jedes Werkzeugs nennt die Herkunft: „geladen: Preisliste …" gegenüber
„geladen: Angebotsdaten.xlsx …".

Konten werden im Supabase-Verwaltungsbereich angelegt (*Authentication → Users →
Add user*, „Auto Confirm User" einschalten), danach die Kennung in `berechtigt`
eintragen:

```sql
insert into berechtigt (benutzer_id, notiz)
values ('<Kennung aus auth.users>', 'Name');
```

## Preise und Termine pflegen

Der übliche Weg ist die **Preispflege** (`Preispflege.html`), erreichbar über den
Verweis unten auf der Startseite. Gespeichert wird auf Knopfdruck, nie nebenbei —
und was gespeichert ist, steht sofort in allen Werkzeugen. Ein dritter Schritt zum
Veröffentlichen entfällt.

Zwei Reiter:

* **Preise** — links die Titel nach Fachbereich, mit einem Vermerk bei Titeln, deren
  Preise noch offen sind; rechts die Formate nach Kategorie. Geprüft wird beim
  Eintragen: ein Preis muss eine Zahl sein, ein Format je Titel und Kategorie nur
  einmal vorkommen. Solange etwas beanstandet ist, bleibt *Speichern* gesperrt.
* **Termine** — je Ausgabe die Termine nebeneinander, darunter Themenschwerpunkt und
  Kongresse über die ganze Breite. Termine in der Form `TT.MM.`; fällt einer ins Vor-
  oder Folgejahr, die Jahreszahl mitschreiben (`22.12.2026`).

**Preisrunde.** *Preisrunde …* schreibt die Preise eines Jahrgangs fort: Vorlage,
Prozentsatz, Rundung, Umfang. Gerundet wird nur dort, wo der Ausgangspreis selbst auf
der Rundungsstufe stand — gerechnete Werte wie die Werbebeilagen „(gesamt)" behalten
ihre Form. Führt der Zieljahrgang schon Preiszeilen, werden sie ersetzt; vorher
entsteht ohne Zutun ein Sicherungspunkt.

**Sicherungspunkte.** Schnappschüsse eines Jahrgangs, anlegen und zurückspielen. Beim
Zurückspielen werden Titel, Preise und Termine des Jahrgangs ersetzt.

### Konto

Ändern darf nur, wer angemeldet **und** in der Tabelle `berechtigt` eingetragen ist.
Konten werden im Supabase-Verwaltungsbereich angelegt (*Authentication → Users → Add
user*, E-Mail und Kennwort eintragen, **„Auto Confirm User" einschalten**), danach die
Kennung eintragen:

```sql
insert into berechtigt (benutzer_id, notiz)
values ('<Kennung aus auth.users>', 'Name');
```

Ohne diesen Eintrag meldet die Preispflege beim Speichern, dass die Datenbank nichts
geändert hat — der Zeilenschutz wirft keinen Fehler, er lässt die Anfrage ins Leere
laufen. Das Werkzeug zählt die geschriebenen Zeilen nach und meldet es deshalb
trotzdem als Fehlschlag.

## Preisliste über die Excel-Datei ändern

> **Übergangszustand.** Der Excel-Eingang (Bauabschnitt 3) ist noch nicht gebaut. Eine
> Änderung allein an der `Angebotsdaten.xlsx` erreicht die Werkzeuge **nicht** — sie
> lesen die Datenbank. Wer trotzdem über Excel arbeitet, muss die Änderung zusätzlich
> in die Datenbank übernehmen (`werkzeug/einspielen.py`, prüfen mit
> `werkzeug/nachweis.py` — beide bleiben örtlich, siehe `.gitignore`). Der einfache
> Weg ist bis dahin die Preispflege.

1. `Angebotsdaten.xlsx` in Excel ändern und in diesem Ordner speichern.
2. Örtlich prüfen (siehe oben): Startseite zeigt den neuen Stand, die Werkzeuge zeigen
   die geänderten Preise und Termine.
3. Veröffentlichen — entweder per Doppelklick auf `Preisliste abgleichen.command`
   (liegt im Arbeitsordner, nicht im Repository), oder von Hand:

   ```bash
   git add Angebotsdaten.xlsx && git commit -m "Preisliste aktualisiert" && git push
   ```

Ohne diesen dritten Schritt ändert sich nur der eigene Rechner — die veröffentlichte
Seite liefert weiter die alte Preisliste aus.

### Von einem anderen Rechner aus

Ohne Arbeitskopie geht es über die GitHub-Seite, nur im Browser:

1. Im Repository `Angebotsdaten.xlsx` anklicken, „Download raw file".
2. In Excel ändern und speichern — **der Dateiname muss unverändert bleiben.** Ein von
   Windows angehängtes `(1)` würde beim Hochladen eine zweite Datei anlegen, statt die
   Preisliste zu ersetzen; die Werkzeuge läsen weiter die alte.
3. „Add file" → „Upload files", Datei hineinziehen, „Commit changes".

Der Arbeitsordner auf dem Mac kennt diese Änderung dann noch nicht. Der nächste
Doppelklick auf `Preisliste abgleichen.command` holt sie und meldet es. Nur wenn
auf **beiden** Seiten geändert wurde, bricht das Skript ab — dann muss von Hand
entschieden werden, welche Fassung gilt.

Der auf der Startseite und in den Statuszeilen angezeigte Stand kommt aus der
`Angebotsdaten.xlsx` selbst: Excel schreibt beim Speichern den Zeitpunkt in die Datei
hinein, und dieser Wert wandert mit ihr mit — auch über den Umweg des Hochladens.
Gepflegt werden muss er nicht. Der Zeitstempel des Servers taugt dafür nicht, weil
GitHub Pages für jede Datei den Zeitpunkt der letzten Veröffentlichung meldet.

Wer ein Werkzeug schon offen hat, sieht den neuen Stand nach dem Neuladen der Seite.
Ein Zwischenspeicher des Browsers hält die alte Preisliste nur so lange, bis das
Werkzeug sie erneut geholt hat.

## Kein Service Worker

Bewusst nicht eingebaut. Er würde die Werkzeuge zwar ohne Netz starten lassen, dafür
aber alte Stände ausliefern, solange niemand eine Fassungsnummer hochzählt. Wer ohne
Netz arbeiten muss, öffnet die Dateien wie früher direkt vom Rechner.

## Was hier nicht liegt

Angebote und Arbeitsstände. Die bleiben im Browser-Speicher des jeweiligen Geräts
beziehungsweise in den `.json`-Angebotsdateien und werden weder hochgeladen noch
zwischen Benutzern geteilt.
