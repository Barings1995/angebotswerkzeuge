// ---------------------------------------------------------------------------
//  Gemeinsame Bausteine der Angebotswerkzeuge
//
//  Die Werkzeuge bleiben Einzeldateien. Was in mehreren gleich sein soll, liegt
//  einmal hier im Ordner und steht in jedem Werkzeug zwischen zwei Markierungen:
//
//    /* ══ BAUSTEIN fenster.css ══ … */
//    …
//    /* ══ ENDE BAUSTEIN fenster.css ══ */
//
//  Geändert wird nur die Datei hier im Ordner, danach:
//
//    node Bausteine/einsetzen.mjs            setzt jeden Baustein in alle
//                                            markierten Stellen ein
//    node Bausteine/einsetzen.mjs --pruefen  prüft nur, ändert nichts
//
//  Eingerückt wird so weit wie die Anfangsmarkierung. Vor jedem Push prüft der
//  Hook (Prüffälle/pruefen.mjs), dass jede markierte Stelle ihrem Baustein
//  gleicht; eine veraltete oder von Hand geänderte Stelle hält den Push an.
//
//  Die Zeile „Braucht: …" im Kopf eines Bausteins nennt, was das Werkzeug selbst
//  mitbringen muss: --name für eine Farbe oder ein Maß im :root, name() für eine
//  Funktion. Auch das wird geprüft.
// ---------------------------------------------------------------------------
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HIER = path.dirname(fileURLToPath(import.meta.url));
const WURZEL = path.dirname(HIER);

const ANFANG = /^([ \t]*)\/\* ══ BAUSTEIN (\S+) ══.*\*\/[ \t]*$/;
const ENDE = /^[ \t]*\/\* ══ ENDE BAUSTEIN (\S+) ══ \*\/[ \t]*$/;
const anfangsZeile = (einzug, name) =>
  `${einzug}/* ══ BAUSTEIN ${name} ══ Nicht hier ändern: gepflegt in Bausteine/${name}, eingesetzt mit „node Bausteine/einsetzen.mjs". */`;

function bausteinLesen(name) {
  const f = path.join(HIER, name);
  if (!fs.existsSync(f)) return null;
  return fs.readFileSync(f, 'utf8').replace(/\s+$/, '').split('\n');
}
const einruecken = (zeilen, einzug) => zeilen.map(z => (z ? einzug + z : z));

// Alle markierten Stellen einer Datei, mit Soll und Ist.
function stellen(text) {
  const zeilen = text.split('\n'), gefunden = [], fehler = [];
  for (let i = 0; i < zeilen.length; i++) {
    const a = zeilen[i].match(ANFANG);
    if (!a) { if (ENDE.test(zeilen[i])) fehler.push(`Zeile ${i + 1}: Endmarkierung ohne Anfang`); continue; }
    const [, einzug, name] = a;
    let j = i + 1;
    while (j < zeilen.length && !ENDE.test(zeilen[j]) && !ANFANG.test(zeilen[j])) j++;
    const e = j < zeilen.length && zeilen[j].match(ENDE);
    if (!e || e[1] !== name) { fehler.push(`Zeile ${i + 1}: ${name} ohne passende Endmarkierung`); continue; }
    gefunden.push({ name, einzug, von: i, bis: j, ist: zeilen.slice(i + 1, j) });
    i = j;
  }
  return { zeilen, gefunden, fehler };
}

function brauchtPruefen(text, stelle, baustein) {
  const kopf = baustein.find(z => /Braucht:/.test(z));
  if (!kopf) return [];
  const ohne = text.split('\n').filter((_, k) => k < stelle.von || k > stelle.bis).join('\n');
  return kopf.replace(/^.*Braucht:/, '').replace(/\*\/.*$/, '').split(',').map(s => s.trim()).filter(Boolean)
    .filter(b => b.startsWith('--') ? !new RegExp(b + '\\s*:').test(ohne)
      : !new RegExp('function\\s+' + b.replace('()', '') + '\\s*\\(').test(ohne));
}

// Für den Hook und für --pruefen: je Werkzeugdatei und Baustein ein Befund.
export function pruefen(wurzel = WURZEL) {
  const befunde = [];
  for (const datei of fs.readdirSync(wurzel).filter(f => f.endsWith('.html')).sort()) {
    const text = fs.readFileSync(path.join(wurzel, datei), 'utf8');
    const { gefunden, fehler } = stellen(text);
    fehler.forEach(f => befunde.push({ datei, baustein: '–', ok: false, info: f }));
    for (const s of gefunden) {
      const soll = bausteinLesen(s.name);
      if (!soll) { befunde.push({ datei, baustein: s.name, ok: false, info: 'Baustein fehlt im Ordner Bausteine/' }); continue; }
      const erwartet = einruecken(soll, s.einzug);
      const k = erwartet.findIndex((z, n) => z !== s.ist[n]);
      const gleich = erwartet.length === s.ist.length && k < 0;
      const fehlt = brauchtPruefen(text, s, soll);
      befunde.push({
        datei, baustein: s.name, ok: gleich && !fehlt.length,
        info: !gleich ? { zeile: s.von + 2 + (k < 0 ? erwartet.length : k), soll: erwartet[k] ?? '(Ende)', ist: s.ist[k] ?? '(Ende)' }
          : fehlt.length ? 'im Werkzeug fehlt: ' + fehlt.join(', ') : '',
      });
    }
  }
  return befunde;
}

function einsetzen(wurzel = WURZEL) {
  const geaendert = [];
  for (const datei of fs.readdirSync(wurzel).filter(f => f.endsWith('.html')).sort()) {
    const pfad = path.join(wurzel, datei), text = fs.readFileSync(pfad, 'utf8');
    const { zeilen, gefunden, fehler } = stellen(text);
    if (fehler.length) throw new Error(datei + ': ' + fehler.join('; '));
    for (const s of [...gefunden].reverse()) {
      const soll = bausteinLesen(s.name);
      if (!soll) throw new Error(`${datei}: Baustein ${s.name} fehlt im Ordner Bausteine/`);
      zeilen.splice(s.von, s.bis - s.von + 1, anfangsZeile(s.einzug, s.name), ...einruecken(soll, s.einzug), zeilen[s.bis]);
    }
    const neu = zeilen.join('\n');
    if (neu !== text) { fs.writeFileSync(pfad, neu); geaendert.push(datei); }
  }
  return geaendert;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  if (process.argv.includes('--pruefen')) {
    const b = pruefen();
    b.forEach(x => console.log(`${x.ok ? '✓' : '✗'} ${x.datei} · ${x.baustein}${x.info ? '  ' + JSON.stringify(x.info) : ''}`));
    process.exit(b.every(x => x.ok) ? 0 : 1);
  }
  const g = einsetzen();
  console.log(g.length ? 'Eingesetzt in: ' + g.join(', ') : 'Alle Stellen waren schon aktuell.');
}
