-- ---------------------------------------------------------------------------
--  Angebotswerkzeuge — Datenbankschema
--
--  Einspielen im Supabase-SQL-Editor („SQL Editor" -> „New query"), einmalig,
--  danach nur noch bei Erweiterungen.
--
--  Grundzuege:
--    • Der Jahrgang ist der Anker. Titel haengen am Jahrgang, nicht umgekehrt:
--      Auflage und Fachbereich gelten je Jahr. Bisher standen beide Angaben auf
--      allen 1448 Preiszeilen erneut; hier stehen sie einmal.
--    • Preis und Seiten-Aequivalent duerfen leer bleiben. 549 der 1448 Zeilen
--      fuehren heute keinen Preis — das ist Geruest, kein Fehler. Ein Titel darf
--      im Jahrgang stehen, ohne dass seine Preise schon feststehen.
--    • Termine sind Text, nicht date. In der Preisliste stehen sie als „22.01."
--      ohne Jahr; die Werkzeuge ergaenzen es selbst (dateY) und lassen Angaben
--      mit eigener Jahreszahl („04.12.25") unangetastet — so wird der
--      Jahreswechsel beim Anzeigenschluss richtig getroffen. Eine Umstellung auf
--      date muesste dieses Jahr erraten und wuerde genau das brechen.
--    • Lesen ist offen, Schreiben nicht. Die Preisliste liegt heute als Datei im
--      oeffentlichen Repository; eine Anmeldung fuers Rechnen waere eine Huerde
--      ohne Gegenwert. Aendern darf nur, wer in „berechtigt" steht.
-- ---------------------------------------------------------------------------

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- Jahrgang --
-- „jahr" ist Text, nicht Zahl: die Werkzeuge fuehren den Jahrgang durchgehend
-- als Zeichenkette (Schluessel in DATASET, Auswahlfelder, Angebotsdateien).
-- geaendert_am tritt an die Stelle des Aenderungszeitpunkts der Arbeitsmappe,
-- aus dem die Werkzeuge bisher den „Stand" gebildet haben (standAusMappe).

create table if not exists jahrgang (
  jahr         text        primary key,
  geaendert_am timestamptz not null default now()
);

-- ------------------------------------------------------------------ Titel --
-- „reihenfolge" haelt die Abfolge fest, in der die Titel in der Preisliste
-- stehen. Die Werkzeuge zeigen sie in genau dieser Folge, nicht alphabetisch.

create table if not exists titel (
  id           uuid        primary key default gen_random_uuid(),
  jahr         text        not null references jahrgang (jahr) on delete cascade,
  reihenfolge  integer     not null,
  name         text        not null,
  auflage      integer     not null default 0,
  fachbereich  text        not null default '',
  geaendert_am timestamptz not null default now(),
  unique (jahr, name)
);

create index if not exists titel_jahr_idx on titel (jahr, reihenfolge);

-- ------------------------------------------------------------------ Preis --
-- Eine Zeile je Format. Der Schluessel ueber (titel_id, kategorie, format)
-- verhindert den Doppeleintrag, den die Tabelle heute zulaesst — in der
-- Preisliste steht „Werbebeilage bis 25g (pro 1.000)" bei Die Kardiologie 2026
-- zweimal.
--
-- „preis" ist numeric, nicht float: die Excel-Datei traegt an einer Stelle
-- 7920.000000000001, einen Rechenrest aus einer Formel. numeric nimmt so etwas
-- gar nicht erst an.
--
-- „termin_art" ist DU oder EH und entscheidet, welcher Produktionstermin im
-- Angebot erscheint. Leer heisst: fuer dieses Format erscheint keiner. Die
-- Werkzeuge ordnen nichts mehr selbst zu.

create table if not exists preis (
  id                 uuid    primary key default gen_random_uuid(),
  titel_id           uuid    not null references titel (id) on delete cascade,
  reihenfolge        integer not null,
  kategorie          text    not null,
  format             text    not null,
  preis              numeric,
  zuschlag_4c        numeric,
  rabattfaehig       boolean not null default false,
  ae_faehig          boolean not null default false,
  termin_art         text    check (termin_art in ('DU','EH')),
  seiten_aequivalent numeric check (seiten_aequivalent is null or seiten_aequivalent > 0),
  geaendert_am       timestamptz not null default now(),
  unique (titel_id, kategorie, format)
);

create index if not exists preis_titel_idx on preis (titel_id, reihenfolge);

-- ----------------------------------------------------------------- Termin --
-- Eine Zeile je Ausgabe. „heft" ist Text, nicht Zahl: es gibt Doppelhefte.
-- Die vier Terminfelder sind Text in der Form „22.01." — siehe oben.
-- „kongresse" haelt mehrere Eintraege durch Zeilenumbruch getrennt, so wie sie
-- heute in der Zelle stehen; die Werkzeuge zerlegen sie selbst.

create table if not exists termin (
  id              uuid    primary key default gen_random_uuid(),
  titel_id        uuid    not null references titel (id) on delete cascade,
  reihenfolge     integer not null,
  heft            text    not null,
  monat           text    not null default '',
  et              text    not null default '',
  anzeigenschluss text    not null default '',
  du_schluss      text    not null default '',
  eh_termin       text    not null default '',
  themen          text    not null default '',
  kongresse       text    not null default '',
  geaendert_am    timestamptz not null default now(),
  unique (titel_id, heft)
);

create index if not exists termin_titel_idx on termin (titel_id, reihenfolge);

-- -------------------------------------------------------------- Sicherung --
-- Ein Schnappschuss des ganzen Jahrgangs. Bewusst als ein Block und nicht
-- aufgeloest: eine Sicherung soll genau den Stand zurueckbringen, der beim
-- Anlegen galt — auch dann, wenn das Schema sich seither geaendert hat.

create table if not exists sicherung (
  id          uuid        primary key default gen_random_uuid(),
  jahr        text        not null,
  bezeichnung text        not null default '',
  erstellt_am timestamptz not null default now(),
  inhalt      jsonb       not null
);

create index if not exists sicherung_jahr_idx on sicherung (jahr, erstellt_am desc);

-- ----------------------------------------------------------- Zeilenschutz --
-- Lesen darf jeder, auch ohne Anmeldung: die Werkzeuge sollen sich oeffnen und
-- rechnen lassen wie bisher. Schreiben darf nur, wer angemeldet ist UND in
-- „berechtigt" steht. Angemeldet zu sein genuegt nicht — der oeffentliche
-- Schluessel steht nach dem Veroeffentlichen im Netz, und ohne diese Liste
-- koennte sich jeder ein Konto anlegen und die Preisliste aendern.

create table if not exists berechtigt (
  benutzer_id uuid        primary key,
  notiz       text        not null default '',
  erstellt_am timestamptz not null default now()
);

alter table berechtigt enable row level security;
-- Bewusst ohne Regel: ueber die Schnittstelle ist die Liste weder lesbar noch
-- aenderbar. Gepflegt wird sie hier im SQL-Editor:
--   insert into berechtigt (benutzer_id, notiz)
--   values ('<Kennung aus auth.users>', 'Name');

-- "security definer" ist notwendig: die Funktion wird in den Regeln der
-- uebrigen Tabellen aufgerufen, wo die Liste selbst nicht lesbar ist.
create or replace function ist_berechtigt() returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (select 1 from public.berechtigt where benutzer_id = auth.uid())
$$;

do $$
declare t text;
begin
  foreach t in array array['jahrgang','titel','preis','termin','sicherung'] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists %I_lesen_offen on %I', t, t);
    execute format('drop policy if exists %I_schreiben_freigegeben on %I', t, t);
    execute format(
      'create policy %I_lesen_offen on %I for select to anon, authenticated
         using (true)', t, t);
    execute format(
      'create policy %I_schreiben_freigegeben on %I for all to authenticated
         using (public.ist_berechtigt())
         with check (public.ist_berechtigt())', t, t);
  end loop;
end;
$$;

-- -------------------------------------------------------------- Zeitstempel --
-- geaendert_am setzt die Datenbank selbst. Ginge der Zeitstempel vom Geraet
-- aus, wuerde eine falsch gestellte Uhr die Reihenfolge verfaelschen.

create or replace function setze_geaendert_am() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.geaendert_am := now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['jahrgang','titel','preis','termin'] loop
    execute format('drop trigger if exists %I_geaendert on %I', t, t);
    execute format(
      'create trigger %I_geaendert before update on %I
         for each row execute function setze_geaendert_am()', t, t);
  end loop;
end;
$$;
