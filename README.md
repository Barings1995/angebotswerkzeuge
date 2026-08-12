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

Nicht im Repository, nur im Arbeitsordner: die beiden Änderungslogs und der Ordner
`Sicherungskopien/` mit den früheren Ständen — beides sind interne Arbeitsunterlagen
(siehe `.gitignore`).

## Preisliste aktualisieren

1. `Angebotsdaten.xlsx` in Excel ändern und in diesem Ordner speichern.
2. Örtlich prüfen (siehe oben): Startseite zeigt den neuen Stand, die Werkzeuge zeigen
   die geänderten Preise und Termine.
3. Veröffentlichen:

   ```bash
   git add Angebotsdaten.xlsx && git commit -m "Preisliste aktualisiert" && git push
   ```

Der auf der Startseite angezeigte Stand kommt aus dem Zeitstempel der Datei und muss
nicht gepflegt werden.

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
