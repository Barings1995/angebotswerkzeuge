# Angebotswerkzeuge

Drei Werkzeuge für Platzierungs- und Preisangebote der Printtitel, mit einer
gemeinsamen Preisliste. Reines HTML, CSS und JavaScript — kein Bauvorgang, kein Node,
keine Zusatzbibliotheken außer ExcelJS, das bei Bedarf nachgeladen wird.

Jede Datei läuft weiterhin auch per Doppelklick vom Rechner. Der einzige Unterschied:
Über eine Adresse holen sich die Werkzeuge die `Angebotsdaten.xlsx` selbst, per
Doppelklick wird sie wie bisher von Hand geladen.

## Örtlich starten

```bash
python3 -m http.server 5003 --directory "$(dirname "$0")"
```

Dann `http://localhost:5003` im Browser öffnen. Ein Server wird gebraucht, weil der
Browser aus `file://` heraus keine Nachbardateien lesen darf.

## Aufbau

| Datei | Aufgabe |
|---|---|
| `index.html` | Startseite mit den drei Werkzeugen und dem Stand der Preisliste |
| `OpenSlots_Angebotsplaner.html` | Platzierungen über die Ausgaben eines Jahrgangs ankreuzen |
| `Angebotsvorlage_Print.html` | Angebot mit Positionen, Rabatt und Summen |
| `Angebotsvorlage_Print_4C.html` | dieselbe Vorlage mit getrenntem Farbzuschlag |
| `Angebotsdaten.xlsx` | die gemeinsame Preisliste (Blätter „Preise", „Termine", „Info") |
| `manifest.webmanifest` | Name und Symbol beim Ablegen im Dock |

Nicht im Repository, nur im Arbeitsordner: die beiden Änderungslogs, der Ordner
`Sicherungskopien/` mit den früheren Ständen und `Preisliste abgleichen.command`
(Doppelklick-Helfer, siehe unten) — interne Arbeitsunterlagen (siehe `.gitignore`).

## Preisliste aktualisieren

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
