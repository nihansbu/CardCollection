# README OFTEN

Projekt-Memory fuer RAP Card Collection. Diese Datei soll regelmaessig aktualisiert werden, wenn Features, Ziele, Regeln, Datenmodelle oder wichtige Designentscheidungen geaendert werden.

## Projektidee

Das Projekt entwickelt sich von einer reinen RAP Card Collection zu einer Mobile-only Codex-Tracking-App. Der Spieler soll unterwegs schnell reale Aktivitaeten tracken, Punkte verdienen und ausgeben koennen, um Dinge zu leveln, zu trainieren, zu sammeln, upzugraden, freizuschalten und langfristig Account-Fortschritt aufzubauen.

RAP, kurz fuer Real Life Activity Points, bleibt als moegliche Hauptwaehrung fuer reale Aktivitaeten, Belohnungen und Freischaltungen erhalten. Die fruehere Pack-Shop-Idee ist nicht verworfen, aber aktuell nicht mehr der alleinige Hauptscreen. Sie wird als ein moegliches Modul im groesseren Codex-Collector-System behandelt.

Das Spiel ist als persoenliches, nicht veroeffentlichtes Fan-Projekt gedacht. Module duerfen bekannte Universes, Spiele und Genres referenzieren, zum Beispiel RuneScape-artige Skills, Bestiary-/Monster-Logs, Kartenpacks und spaeter weitere Codex-Kategorien.

## Aktueller Fokus

Der aktuelle Hauptscreen ist ein Codex-artiges Hauptmenue im dunklen Pixel-/Fantasy-Rahmenstil. Die mobile Bottom-Navigation soll als dauerhafte Modulnavigation dienen.

- Mobile-only Layout mit kompaktem Codex-Rahmen.
- Desktop wird nicht mehr gezielt designed oder unterstuetzt. Grosse Screens zeigen nur die mobile App-Spalte zentriert.
- Die App-Shell nutzt eine dauerhaft sichtbare Bottom-Navigation statt einer Topbar.
- Die Bottom-Navigation hat aktuell 8 kompakte Slots: Character, Inventory, Skills, Activities, Beastiary, Codex, Slot 7 und More.
- Character ist ein Flyout-Button: Tap oeffnet ein kleines Menue nach oben mit Account, Codex, Gear und Stats als vorbereiteten Sub-Buttons.
- Account ist der Startpunkt fuer lokale Demo-Session und spaeter Cloud Login.
- Die Bottom-Navigation bleibt fixiert sichtbar. Flyouts duerfen die Content Section leicht ueberlappen.
- Der globale Screen selbst soll nicht vertikal scrollen. Nur die jeweilige Content-Body-Flaeche innerhalb des ContentPanel darf scrollen.
- Der aktive Bottom-Navigation-Button wird rot markiert.
- Das grosse Content Window unter der Navigation bleibt zwischen Modulen strukturell gleich, ist aber mobil zuerst als gestapeltes Panel aufgebaut.
- Jedes Modul nutzt eine gemeinsame Header-Bar mit optionalem Back-Slot, linksbuendigem Titelcontainer, rechtsbuendiger Action-Button-Zone in derselben Zeile und eigenen Stats.
- Hauptseiten ohne Back-Button zeigen links den Titel, rechts modulbezogene Actions und darunter kompakte Stats. Subpages mit Back-Button zeigen links vom Titel den Zurueck-Button.
- Der Skills-Screen zeigt aktuell 30 RuneScape-like Skills als kompaktes mobile-only 3-Spalten-Skillpanel nach RuneScape-Anmutung. Die ehemalige untere RuneScape-Leiste mit Total Level/Combat/Quest Points wird nicht kopiert, weil diese Informationen in der vorhandenen Header-Stats-Bar leben.
- Das Skills-Panel muss auch im normalen mobilen Browser mit sichtbarer Chrome-/Android-Leiste kompakt bleiben. Aktuell sollen 30 Skills in die Hauptansicht passen; bei mehr Inhalt scrollt nur die interne Content-Body-Flaeche.
- Jeder Skill startet aktuell auf Level 1 und hat ein Max-Level von 99.
- Die Skill-Kacheln zeigen nur das aktuelle Level, nicht `1/99`. Max-Level bleibt im Datenmodell erhalten.
- Alle 30 Skills nutzen fantasy/MMO-inspirierte Icons im kompakten RuneScape-artigen Skillpanel.
- Die Skills-Header-Stats zeigen als Icon-Kacheln `Total Level`, `Average Level` und `Total XP`.
- Skills hat rechts neben dem Titel einen `Training`-Action-Button mit Icon. Tap oeffnet die eigene `Skills Training`-Ansicht im gleichen ContentPanel-System.
- `Skills Training` nutzt dieselbe mobile Layout-Struktur wie Skills: linksbuendiger Titel, rechts ein `Skills`-Action-Button zurueck zur Uebersicht, darunter vier Header-Stats und im Content-Body dasselbe 3-Spalten-Skillgrid.
- Die vier Header-Stats im Training sind `RAP`, `Slot 1`, `Slot 2` und `Slot 3`. Die Slots sind tappbar; der aktive Slot wird gelb markiert.
- In `Skills Training` weist ein Tap auf einen Skill den Skill dem aktiven Slot zu. Wenn derselbe Skill im aktiven Slot erneut getappt wird, wird er entfernt. Wenn der Skill in einem anderen Slot liegt, wandert er in den aktiven Slot.
- Aktuell trainierte Skills werden im Grid gelb umrahmt und zeigen einen kleinen Slot-Badge.
- Aktuell trainierte Skills werden sowohl in `Skills Training` als auch in der normalen Skills-Uebersicht gelb markiert.
- Nur aktuell trainierte Skills zeigen in der Skill-Kachel zusaetzlich zum Level eine Prozentanzeige fuer den Fortschritt bis zum naechsten Level.
- Skill-Kacheln zeigen jetzt auch den Skillnamen direkt in der Kachel. Lange Skillnamen werden kleiner gesetzt, ohne die Kachelhoehe zu vergroessern.
- Skilltraining tauscht RAP 1:1 gegen Skill-XP. Insgesamt koennen maximal 5000 RAP/XP pro Stunde ausgegeben werden. Ein aktiver Slot bekommt 5000 XP/h, zwei aktive Slots je 2500 XP/h, drei aktive Slots je ein Drittel. RAP, Skill-XP und Level werden jede Sekunde aktualisiert und gespeichert.
- Skilltraining laeuft auch offline weiter: Beim naechsten App-Start wird die vergangene Zeit seit dem letzten Trainings-Tick nachgerechnet.
- Wenn RAP durch Training auf `0` faellt, werden alle Trainingsslots automatisch geleert.
- Groessere RAP- und XP-Werte werden in kompakten Werten dargestellt, z. B. `7320` als `7,3k`.
- Sailing ist als eigener Skill enthalten.
- Skills sind antippbar und oeffnen eine Skill-Subpage im gleichen ContentPanel-System.
- Skill-Subpages behalten die globale Bottom-Navigation bei, ersetzen aber den ContentPanel-Titel durch den Skillnamen und zeigen skill-spezifische Placeholder-Stats.
- Skill-Subpages haben links neben dem Titel einen Back-Button zurueck zur Skill-Uebersicht.
- Long-Press auf einem Skill, Header-Stat oder Header-Action zeigt eine kompakte Quicklook-Info im gemeinsamen unteren Info-Panel des Skills-Bodys. Normaler Tap oeffnet weiterhin die Detailseite oder fuehrt die normale Button-Aktion aus.
- Skill-Quicklook-Werte werden aus dem aktuellen Skill-State abgeleitet und aktualisieren sich live, solange Training tickt.
- Skill-Quicklook und Skill-Detailseiten verwenden die Labels `Current XP` und `XP to Next Level`. `XP to Next Level` zeigt zusaetzlich eine ETA in Klammern, wenn der Skill aktuell trainiert wird, sonst `Idle`.
- Die Skill-XP-Werte nutzen aktuell eine RuneScape-artige XP-Kurve. Level 1 startet bei 0 XP, Level 2 liegt bei 83 XP.
- Codex beschreibt die neue Grundidee: Train, Collect, Upgrade, Unlock.
- Beastiary ist als geplantes Monster-/Creature-Modul angelegt.
- RAP, Real Life Activity Points, ist als Hauptwaehrung eingefuehrt.
- Activities ist als erstes RAP-Earning-Modul eingefuehrt.
- Activities nutzt die Header-Action-Zone fuer `Sorts`, `Activity Log` und `Stats`.
- Aktivitaeten koennen RAP vergeben und schreiben einzelne Log-Eintraege fuer spaetere Metriken/Diagramme.
- Das Activity Log gruppiert die Darstellung nach Aktivitaet und Einheit, summiert Quantity und RAP, behaelt intern aber die einzelnen Timestamps.
- Activities haben einen `type`, zum Beispiel Exercise, Mind, Productivity, Creative, Social, Home, Recovery oder General.
- Activities koennen im Hauptscreen ueber ein kleines `Sorts` Popover nach Default, Name, RAP Reward, Type oder Unit sortiert werden.
- Activity Stats ist als Subpage angelegt und zeigt All Activities oder eine einzelne Activity mit Kennzahlen, Longest Streak und rollender 365-Tage-Heatmap.
- Der alte Pack-Shop, Pack-Kauf, Collection-Progress und Pull-Modals existieren im Code noch, sind aber aktuell nicht der sichtbare Hauptscreen.
- Activities nutzt ebenfalls mobile Listenkarten, damit Aktivitaeten direkt antippbar bleiben. Die Actions `Sorts`, `Activity Log` und `Stats` bleiben im gemeinsamen Header-System.

## Version Control und Hosting

Das Projekt wird ab jetzt ueber GitHub versioniert und soll regelmaessig dorthin gepusht werden.

- GitHub-Repo: `nihansbu/CardCollection`.
- GitHub-URL: `https://github.com/nihansbu/CardCollection`.
- GitHub-Pages-URL: `https://nihansbu.github.io/CardCollection/`.
- `main` ist der aktuelle Hauptbranch.
- GitHub ist die zentrale Version-Control-Quelle fuer den Projektstand.
- Relevante Aenderungen sollen nach erfolgreichem lokalen Build committed und gepusht werden.
- GitHub Pages wird als kostenloses statisches Hosting genutzt, damit die App auch ausserhalb des lokalen WLANs erreichbar ist.
- Mit GitHub Free ist GitHub Pages fuer oeffentliche Repositories verfuegbar. Private Repositories mit Pages benoetigen laut GitHub-Doku Pro/Team/Enterprise oder Enterprise-Access-Control. Fuer dieses Projekt bleibt das Repo vorerst oeffentlich, aber echte Secrets duerfen nie im Frontend-Code liegen.
- Der GitHub-Pages-Deploy laeuft ueber `.github/workflows/deploy-pages.yml`.
- Vite nutzt `base: "./"` in `vite.config.js`, damit gebaute Assets unter GitHub Pages korrekt geladen werden.
- Vor dem Push mindestens `npm run build` ausfuehren. Fuer mobile Skills-/Training-Regressions zusaetzlich `npm run verify` verwenden, waehrend der Dev-Server auf `127.0.0.1:5173` laeuft.
- Diese Projekt-Memory weiter aktualisieren, wenn sich Hosting, Branching, Deployment oder technische Grundregeln aendern.

## UI-Aufbau

Die App ist in kleinere Views und Komponenten aufgeteilt:

- `src/App.jsx`: Aktive Codex-View und Routing zwischen Codex-Modulen.
- `src/components/AppShell.jsx`: Fixierte Mobile-Bottom-Navigation mit 8 Slots und Character-Flyout.
- `src/views/MainMenuView.jsx`: schlanker Koordinator fuer aktive Codex-View, Skill-Uebersicht/-Training/-Detail-State, RAP-Ausgabe durch Training und Activity-Subpage-State.
- `src/components/ContentPanel.jsx`: wiederverwendbares Content-Window-System mit optionalem Back-Slot, festem Seitentitel, Action-Button-Zone und Stats-Bar.
- `src/features/account/AccountPanel.jsx`: Account-Screen mit lokaler Demo-Session, Cloud-Auth-Formular und lokalem Save-Status.
- `src/features/skills/SkillsPanel.jsx`: Skills-Uebersicht, Skills-Training und Skill-Detailseiten.
- `src/features/skills/skillData.js`: Skill-Liste, Skill-Level-Defaults, XP-Helfer, Training-Rate und Skill-Storage-Keys.
- `src/features/activities/ActivitiesView.jsx`: Aktivitaetskarten, Sorts-Popover, Create Activity, Activity Log, Activity Stats und RAP-Verdienen.
- `src/features/activities/activityData.js`: Activity-Defaults, Activity-Typen, Sortieroptionen und Storage-Keys.
- `src/features/activities/activityUtils.js`: Activity-Berechnungen, Storage-Helfer, Log-Gruppierung, Stats und Heatmap-Daten.
- `src/features/codex/CodexPanels.jsx`: Codex-, Beastiary- und Placeholder-Panels.
- `src/storage/`: zentrale lokale Save-Schicht, Supabase-Client-Konfiguration und erste Cloud-Save-Operationen.
- `src/views/ShopView.jsx`: Legacy-Shop-Raster, Collection Progress und Roll Odds.
- `src/views/CollectionView.jsx`: Legacy-Sammlungsscreen mit Progress-Uebersicht.
- `src/views/PlaceholderView.jsx`: Legacy-Platzhalter.
- `src/components/PackCard.jsx`: image-first Pack-Karte.
- `src/components/CollectionSummary.jsx`: Total- und Rarity-Fortschritt.
- `src/components/RollOddsPanel.jsx`: kompakte Rollmodell-Uebersicht.
- `src/components/CardListModal.jsx`: Kartenliste pro Pack.
- `src/components/PullModal.jsx`: Ergebnis nach Pack-Oeffnung.
- `src/utils/collection.js`: abgeleitete Collection-Statistiken.
- `scripts/verify.mjs`: Mobile-Smoke-Test fuer aktuellen Skills-/Offline-Training-Flow.
- `supabase/migrations/20260621235000_initial_cloud_save.sql`: erstes Cloud-Save-Schema mit RLS-Policies.
- `vite.config.js`: Vite-Konfiguration, inklusive GitHub-Pages-kompatibler relativer Asset-Basis.
- `.github/workflows/deploy-pages.yml`: GitHub-Actions-Workflow fuer Build und GitHub-Pages-Deployment.

CSS ist nach Flaechen getrennt:

- `src/styles/base.css`
- `src/styles/app-shell.css`
- `src/styles/content-panel.css`
- `src/styles/codex-panels.css`
- `src/styles/account.css`
- `src/styles/skills.css`
- `src/styles/activities.css`
- `src/styles/shop.css`
- `src/styles/collection.css`
- `src/styles/modals.css`

Das ehemalige monolithische `src/views/MainMenuView.jsx` und `src/styles/main-menu.css` wurden aufgeteilt. Neue Systeme sollen bevorzugt als eigenes Feature unter `src/features/<name>/` plus eigenes CSS in `src/styles/` angelegt werden.

Healthcheck 2026-06-21:

- Skills ist aktuell die stilistische Referenz fuer neue Module.
- Activities ist funktional, soll bei einer spaeteren UI-Ueberarbeitung aber staerker dem Skills-Muster folgen: Header-Stats, Action-Zone, kompakter Body, keine abweichende Seitenlogik.
- Legacy-Pack-/Collection-Dateien bleiben bewusst im Repo, weil Packs/Karten als spaeteres Modul nicht verworfen sind.
- Die alte ungenutzte `src/storage.js` wurde entfernt, weil sie nur alte Pack-Shop-Keys enthielt und nicht mehr eingebunden war.
- `scripts/verify.mjs` wurde vom alten Shop-Test auf den aktuellen mobile Skills-/Offline-Training-Flow umgestellt.

## Codex-UI-Regeln

- Die Bottom-Navigation bleibt auf allen Subscreens sichtbar und stabil.
- Neue echte Module sollen zuerst als Bottom-Navigation-Slot oder Character-Flyout-Subslot, dann als eigener ContentPanel-Inhalt angelegt werden.
- Placeholder-Slots duerfen sichtbar bleiben, sollen aber klar als nicht fertige Module wirken.
- Mobile ist ab jetzt die einzige UI-Zielgroesse. Neue Module muessen auf 390px bis 430px Breite funktionieren.
- Keine Desktop-spezifischen Breakpoints, keine mehrspaltigen Desktop-Grids und keine Hover-only Interaktionen.
- Grosse Screens duerfen die mobile App-Spalte nur zentrieren; Desktop ist kein eigenes Feature-Ziel mehr.
- Wiederverwendbare Flaechen sollen bevorzugt ueber `AppShell`, `ContentPanel`, mobile Listenkarten, Header-Actions und Header-Stats laufen.
- Die Modulnavigation bleibt eine kompakte Bottom-Bar mit 8 Touch-Slots. Keine horizontale Scrollbar in der Hauptnavigation.
- Das Content Window besteht aus:
  - gemeinsamer Panel-Rahmen.
  - Header-Bar mit optionalem Back-Slot ganz links.
  - festem Titelcontainer, der auf Mobile die volle Breite nutzt und mit Back-Button rechts vom Back-Slot sitzt.
  - linksbuendigem Titeltext, dessen Schriftgroesse je nach Titel laengenabhaengig angepasst wird.
  - horizontaler Action-Button-Zone fuer modulspezifische Aktionen.
  - statspezifischen Boxen, die auf Mobile als kompakte Karten in der benoetigten Anzahl passen.
  - modulabhaengigem Body darunter.
- Skills nutzt die Header-Bar mit `Total Level`, `Average Level`, `Total XP` und dem `Training`-Action-Button.
- Skills Training nutzt die Header-Bar mit `RAP`, `Slot 1`, `Slot 2`, `Slot 3` und dem `Skills`-Action-Button.
- Skill-Detailseiten nutzen die gleiche Header-Bar mit Back-Button, Skill-Titel und skill-spezifischen Stats.
- Activities nutzt die Header-Bar mit `RAP Balance`, `Activities` und `Logged`.
- Activities hat Subscreens fuer `Create Activity`, `Activity Log` und `Activity Stats`, jeweils mit Back-Button.
- Die Buttons `Sorts`, `Activity Log` und `Stats` leben in der Header-Action-Zone von Activities, nicht im Activity-Kartenraster.
- `Sorts` oeffnet ein kleines Popover direkt am Button und sortiert die Activity-Karten ohne Seitenwechsel.
- Der Back-Slot wird nur auf ContentPanel-Seiten mit echtem Back-Button genutzt; Hauptseiten ohne Back-Button lassen den Titel nach links ruecken.
- Codex nutzt die Header-Bar mit Projekt-/Loop-/Status-Informationen.
- Account nutzt die Header-Bar mit `User`, `Cloud` und `Mode`. Der lokale Demo-Login ist `Admin` / `Admin` und dient nur als UI-/Flow-Test, nicht als echte Sicherheit.
- Beastiary nutzt die Header-Bar mit Entries, Kills und Mastery als geplante Felder.
- Informationen muessen sichtbar, tappbar, per Long-Press-Quicklook im gemeinsamen unteren Info-Panel oder ueber Detailseiten erreichbar sein. Hover-only Informationen sind nicht erlaubt.
- Zahlen, die durch laufende Systeme veraendert werden koennen, sollen live aus dem aktuellen State gelesen werden. Fuer aktuelle Training-/RAP-Anzeigen ist ein etwa sekundenweiser Refresh ausreichend.
- Header-Stats und Header-Actions im `ContentPanel` koennen Long-Press-Quicklooks an die jeweilige Seite weitergeben. Neue Stats und Actions sollen nach Moeglichkeit eine kurze `description` mitliefern, damit die Quicklook-Info im gemeinsamen unteren Info-Panel nuetzlich ist.

## Pack-Design

Pack-Karten sollen image-first bleiben:

- Der groesste Teil der Karte ist Artwork.
- Universe steht dezent oben auf dem Bild.
- Packname steht unten.
- Auge-Icon oeffnet die Kartenliste.
- Coin/Preis-Button kauft das Pack.
- Keine Beschreibung direkt auf der Pack-Karte.
- Keine SVG-/CSS-Ersatzbilder fuer finale Pack-Artworks.
- Generierte Bitmap-Artworks liegen in `public/pack-art/`.
- Aktuelle Bitmap-Artworks existieren fuer `Frontier Arsenal` und `Wraeclast Vault`.
- RuneScape und World of Warcraft nutzen noch temporare grafische Platzhalter.

## Aktuelles Datenmodell

Aktuell ist die App local-first. `localStorage` bleibt als lokaler Cache und Prototyp-Persistenz erhalten, ist aber nicht mehr als langfristige Source of Truth geplant. Eine zentrale Save-Schicht unter `src/storage/` kapselt die bisherigen Keys und bereitet Cloud Save vor.

### RAP und Activities

RAP steht fuer Real Life Activity Points und ist die Hauptwaehrung des Spiels.

Activities werden aktuell ueber die zentrale lokale Save-Schicht in `localStorage` gespeichert:

- Key `codex-collector-v1-rap`: aktuelle RAP-Balance.
- Key `codex-collector-v1-activities`: gespeicherte Aktivitaeten.
- Key `codex-collector-v1-activity-log`: Aktivitaetslog.

Eine Aktivitaet enthaelt aktuell:

- `id`: technische Aktivitaets-ID.
- `title`: sichtbarer Name.
- `description`: kurze Beschreibung.
- `type`: grobe Kategorie, aktuell u. a. Exercise, Mind, Productivity, Creative, Social, Home, Recovery oder General.
- `unit`: frei tippebare Einheit, z. B. seconds, minutes, pages, steps.
- `defaultQuantity`: Standardmenge, die beim Klick geloggt wird.
- `rapPerUnit`: RAP-Belohnung pro Einheit.
- `color`: UI-Akzentfarbe.

Beim Klick auf eine Aktivitaet:

1. `defaultQuantity * rapPerUnit` wird als RAP verdient.
2. Die RAP-Balance wird gespeichert.
3. Ein Aktivitaetslog-Eintrag wird erstellt.

Ein Aktivitaetslog-Eintrag enthaelt aktuell:

- `id`
- `activityId`
- `title`
- `quantity`
- `unit`
- `rapEarned`
- optional `type` fuer neuere Log-Eintraege.
- `timestamp`

Die Activity-Log-UI wertet die letzten 50 Roh-Eintraege aus und gruppiert sie fuer die Anzeige nach Aktivitaet und Einheit. Dadurch erscheint z. B. Walking nur einmal, waehrend Quantity, RAP und Entry-Anzahl summiert werden. Intern werden weiterhin einzelne Eintraege mit Timestamp gespeichert und aktuell bis zu 250 Eintraege behalten, damit spaeter Metriken und Diagramme daraus entstehen koennen.

Activity Stats nutzt die Roh-Eintraege fuer erste Analytics:

- Auswahl zwischen `All Activities` und einzelnen Activities.
- Total RAP, geloggte Quantity, Active Days und Longest Streak.
- Longest Streak speichert aktuell Laenge sowie Start- und Enddatum fuer die Anzeige.
- Die Heatmap zeigt rollend die letzten 365 Tage, nicht nur das aktuelle Kalenderjahr, damit ein Jahreswechsel die Anzeige nicht komplett leert.
- Die Heatmap-Intensitaet basiert aktuell auf Entry-Anzahl pro Tag.

### Skills und Training

Skills werden aktuell aus der statischen Skill-Liste normalisiert und mit gespeichertem Fortschritt aus der zentralen lokalen Save-Schicht kombiniert:

- Key `codex-collector-v1-skills`: aktueller XP- und Level-Stand aller Skills.
- Key `codex-collector-v1-skill-training-slots`: drei Trainingsslots als Skillnamen oder `null`.
- Key `codex-collector-v1-skill-training-last-tick`: letzter Zeitpunkt, bis zu dem Skilltraining abgerechnet wurde.

Ein Skill enthaelt aktuell:

- `name`: sichtbarer Skillname.
- `short`: kurze Anzeige fuer Slots, z. B. `SUM`.
- `group`: grobe Kategorie, z. B. Combat, Gathering, Artisan oder Support.
- `description`: Quicklook-/Detailbeschreibung.
- `color`: UI-Akzentfarbe.
- `currentXp`: aktueller XP-Wert.
- `level`: aus XP berechnetes Level.
- `maxLevel`: aktuell 99.

Training laeuft aktuell als Live- und Offline-Tick im `MainMenuView`:

1. Alle belegten Trainingsslots werden als aktive Skills genommen.
2. Pro Sekunde oder offline vergangener Sekunde werden bis zu `5000 / 3600` RAP ausgegeben.
3. Die ausgegebenen RAP werden 1:1 als XP auf aktive Skills verteilt.
4. Skill-Level werden nach der RuneScape-artigen XP-Kurve neu berechnet.
5. RAP, Skill-XP, Slots und letzter Trainings-Tick werden ueber die zentrale Save-Schicht persistent gespeichert.
6. Wenn nicht mehr genug RAP vorhanden ist, wird nur bis `0` ausgegeben und danach werden die Trainingsslots geleert.

Skill-Detailseiten leiten den angezeigten Skill aus dem aktuellen Skill-State ab, nicht aus einer alten Objektkopie. Dadurch aktualisieren sich XP/Level auch dann live, wenn eine Skill-Detailseite offen ist.

Skill-Quicklooks speichern ebenfalls nur den Skillnamen und leiten die Anzeige aus dem aktuellen Skill-State ab. Dadurch bleiben `Current XP`, `XP to Next Level` und ETA live. Stat- und Action-Quicklooks auf der Skills-Flaeche nutzen dasselbe untere Info-Panel statt eigener Header-Panels.

## Cloud Save und Account-Plan

Ziel: Fortschritt darf nicht an ein einzelnes Browser-LocalStorage gebunden bleiben. Der Spieler soll sich auf einem anderen Handy oder spaeter in einer nativen App anmelden koennen und denselben Fortschritt sehen.

Empfohlene Richtung fuer den naechsten Architektur-Schritt: Supabase. Die erste technische Basis ist angelegt:

- `src/storage/storageKeys.js`: zentrales Register fuer bestehende lokale Save-Keys.
- `src/storage/jsonStorage.js`: gekapselte JSON-Lese-/Schreibfunktionen fuer lokalen Cache.
- `src/storage/localSave.js`: Snapshot-Load/Write/Export/Import fuer den aktuellen lokalen Spielstand.
- `src/storage/supabaseClient.js`: optionaler Supabase-Client ueber `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY`.
- `src/storage/cloudSave.js`: erste Cloud-Save-Funktionen fuer User-Erkennung, Laden und Upsert von `game_saves`.
- `src/storage/authService.js`: Supabase Auth Wrapper fuer E-Mail/Passwort Login, Signup und Logout.
- `src/storage/accountSession.js`: lokale Demo-Session fuer `Admin` / `Admin`, ausschliesslich fuer privates Testen im aktuellen Browser.
- `supabase/migrations/20260621235000_initial_cloud_save.sql`: erstes Postgres-Schema mit `profiles`, `game_saves`, `activity_events`, `save_events`, `client_sync_state` und RLS-Policies.

Begruendung:

- Postgres passt gut zum Spielstand, weil Skills, Activities, Logs, Training-State, spaetere Monster/Karten und Events langfristig strukturierte Daten sind.
- Supabase Auth deckt Account/Login ab, ohne sofort einen eigenen Auth-Server zu bauen.
- Row Level Security muss von Anfang an verwendet werden, damit jeder User nur seine eigenen Save-Daten lesen und schreiben kann.
- GitHub Pages kann als statisches Frontend vorerst bleiben; die App spricht direkt mit Supabase APIs.
- Eine spaetere mobile Store-App kann dieselbe Backend-Struktur weiterverwenden.

Firebase bleibt eine realistische Alternative, vor allem wenn maximale Mobile-SDK-Integration wichtiger wird als relationales Datenmodell. Fuer dieses Projekt ist Supabase/Postgres aber voraussichtlich sauberer, weil Account-Fortschritt, Logs, Balancing und spaetere Auswertungen relational besser abbildbar sind.

Cloudflare D1/Workers ist technisch interessant, aber eher ein Backend/API-Ansatz. Fuer den naechsten Schritt waere der Aufwand hoeher, weil Auth, Policies und Sync-Konflikte staerker selbst entworfen werden muessten.

Vorgeschlagenes Datenmodell fuer Cloud Save:

- `profiles`: ein Datensatz pro User, Basisdaten und Created/Updated-Timestamps.
- `game_saves`: aktuelle kanonische Save-Snapshot-Version pro User, z. B. RAP, Skills, TrainingSlots, TrainingLastTick, Settings und Versionsnummer als JSONB.
- `activity_events`: append-only Log fuer getrackte Aktivitaeten, damit Fortschritt und Analytics nachvollziehbar bleiben.
- `save_events`: optionales append-only Journal fuer wichtige Fortschrittsereignisse, z. B. Skill-Level-Up, RAP-Ausgaben, spaetere Unlocks.
- `client_sync_state`: optional fuer Konfliktloesung, letzte Client-Version, Device-ID und letzter Sync-Zeitpunkt.

Migrationsreihenfolge:

1. Lokales Save-Schema zentralisieren: eine einzige Save-Schicht statt verstreuter `localStorage`-Keys. Erledigt als erste Basis.
2. Export-/Import-Snapshot bauen, damit vorhandener Fortschritt gesichert werden kann. Erste Funktionen existieren in `localSave.js`; UI fehlt noch.
3. Supabase-Projekt anlegen, Auth aktivieren, Tabellen und RLS-Policies erstellen. SQL-Migration liegt im Repo.
4. Login-Screen oder Account-Button als kleines Modul einfuehren.
5. Beim ersten Login lokalen Save-Snapshot in die Cloud migrieren.
6. Danach Cloud als Quelle der Wahrheit verwenden und `localStorage` nur noch als Offline-/Performance-Cache nutzen.
7. Konfliktregel definieren: serverseitiger `updated_at` plus Save-Version; bei Konflikt erst konservativ nicht ueberschreiben, sondern zusammenfuehren oder User bestaetigen lassen.

Wichtige Regel fuer Idle-/Offline-Training:

- Der Server sollte langfristig nicht jede Sekunde speichern.
- Gespeichert wird der letzte abgerechnete Trainingszeitpunkt.
- Beim Oeffnen, Syncen oder Server-Update wird vergangene Zeit deterministisch nachgerechnet.
- Dadurch bleibt Idle-Fortschritt billig, nachvollziehbar und robust.

### Legacy Packs

Pack-Daten liegen in `src/data.js`.

Ein Pack enthaelt aktuell:

- `id`: technische Pack-ID.
- `title`: sichtbarer Packname, zum Beispiel Wraeclast Vault.
- `universe`: uebergeordnete IP-/Universe-Kategorie, zum Beispiel Path of Exile.
- `subtitle`: Untertitel des Packs.
- `category`: technische Kategorie fuer spaetere Gruppierung.
- `cost`: Preis in RAP.
- `accent`: UI-Akzentfarbe.
- `icon`: Fallback-Symbol, solange kein Bitmap-Artwork existiert.
- `art`: CSS-Variante fuer Fallback-Gestaltung.
- `description`: Datenfeld existiert noch, wird aber nicht mehr direkt auf Pack-Karten angezeigt.
- `imageUrl`: optionales Bitmap-Artwork fuer die Pack-Karte.
- `cardsPerOpen`: Anzahl gezogener Karten pro Kauf.
- `guaranteedRarity`: Mindest-Rarity fuer den Garantie-Slot.
- `cards`: Liste moeglicher Karten.
- optional `rarityWeights`: pack-spezifische Drop-Gewichte.

Eine Karte enthaelt aktuell:

- `id`: technische Karten-ID.
- `name`: sichtbarer Kartenname.
- `rarity`: `common`, `uncommon`, `rare`, `epic`, `legendary` oder `mythic`.

Ein gezogener Karten-Instance enthaelt zusaetzlich:

- `packId`
- `packTitle`
- `packUniverse`
- `shiny`
- `pulledAt`
- `instanceId`

## Aktuelles Rollmodell

Standard-Rarity-Gewichte:

- Common: 57.67
- Uncommon: 24
- Rare: 12
- Epic: 5
- Legendary: 1
- Mythic: 0.33

Diese Werte ergeben zusammen 100 und werden aktuell wie Prozentwerte behandelt.

Aktuelle Packs:

- Halo -> Frontier Arsenal
- RuneScape -> Gielinor Relics
- World of Warcraft -> Azeroth Champions
- Path of Exile -> Wraeclast Vault

Pack-Garantien:

- Die meisten Packs haben einen Garantie-Slot mit mindestens Uncommon.
- Wraeclast Vault hat aktuell mindestens Rare im Garantie-Slot.

Shiny-Chance:

- Jede gezogene Karte hat aktuell unabhaengig von der Rarity eine 1:100 Chance, shiny zu werden.

Pity:

- Wenn 9 Packs in Folge kein Epic oder besser enthalten haben, erzwingt das 10. Pack im Garantie-Slot mindestens Epic.
- Wenn 39 Packs in Folge kein Legendary enthalten haben, erzwingt das 40. Pack im Garantie-Slot Legendary.
- Pity wird global gespeichert, nicht pro Universe oder pro Pack.
- Mythic zaehlt fuer Epic-Pity als Epic oder besser.
- Mythic resetet Legendary-Pity aktuell nicht, weil die Regel konkret auf Legendary prueft. Das ist eine offene Balancing-Frage.

Aktuelle Reihenfolge beim Oeffnen eines Packs:

1. Es werden 5 Karten pro Pack-Kauf erstellt.
2. Der erste Slot ist der Garantie-/Pity-Slot.
3. Falls Legendary-Pity faellig ist, wird dort Legendary erzwungen.
4. Falls Epic-Pity faellig ist, wird dort mindestens Epic gerollt.
5. Falls kein Pity faellig ist, nutzt der erste Slot die Pack-Garantie.
6. Die restlichen Slots rollen normal nach Rarity-Gewichten.
7. Fuer jede Karte wird danach unabhaengig die Shiny-Chance gerollt.
8. Alle Pulls werden gespeichert und im Modal angezeigt.

## Collection Progress

Der Shop zeigt zwischen Pack-Raster und Roll Odds eine kompakte Collection Progress Leiste.

- Total Cards zeigt gesammelte eindeutige Karten gegen alle verfuegbaren Karten.
- Rarity-Chips zeigen Common, Uncommon, Rare, Epic, Legendary und Mythic.
- Fortschritt basiert aktuell auf eindeutigen Karten-IDs, nicht auf Duplikatmenge.
- Aktuell gibt es 24 verfuegbare Karten: 4 pro Rarity ueber 4 Packs.

## Wichtige Designziele

- Mobile-only entwickeln; Zielbreite 390px bis 430px.
- Die App soll direkt auf dem Handy bedienbar sein: grosse Touch-Ziele, keine Hover-Abhaengigkeit, keine horizontale Seitenueberbreite.
- Desktop nicht als Feature-Ziel behandeln; grosse Screens zeigen nur die zentrierte mobile App-Spalte.
- Das Spiel soll wie ein hochwertiger Fantasy-/Codex-Collector wirken, aber funktional als schnelle mobile Tracking-App brauchbar bleiben.
- Die UI soll sich an dunklen, pixeligen Codex-/Logbook-Menues orientieren.
- Bottom-Navigation und Content Window sollen als langlebige Hauptstruktur dienen.
- Module sollen trainierbare, sammelbare, upgradebare oder freischaltbare Inhalte bekommen koennen.
- Klar sichtbare Progression: Level, Punkte, Unlocks, Mastery, Sammlung und Upgrades.
- RAP-Oekonomie bleibt wichtig, muss aber in das groessere Codex-Collector-System eingebettet werden.
- Pack-Karten sollen, falls der Pack-Shop wieder sichtbar wird, weiterhin zu grossen Teilen aus Artwork bestehen.
- Packs sollen spaeter nach Universe, Genre, Preis, Rarity-Policy und Aktivitaetsbezug unterscheidbar werden.
- Karten, Skills, Monster, Items und weitere Codex-Eintraege sollen stark erweiterbar sein.

## Wahrscheinliche naechste Systeme

- Datenmodell fuer Skills: Level, XP, Kosten, Unlocks und Training-Aktionen. Aktueller Startwert fuer alle Skills ist Level 1/99.
- Skill-Detailseiten mit echten Aktionen, Kosten, Milestones, Unlocks, Rewards und Training Logs fuellen.
- Beastiary-Modul mit Creature-Eintraegen, Drops, Kill Counts, Completion und Mastery.
- Account-weite Punkte-/Ressourcen-Oekonomie fuer Training, Upgrades und Freischaltungen.
- Activities-Metriken, Diagramme und Auswertungen aus dem Activity Log.
- Bessere Activity-Erstellung mit Bearbeiten/Loeschen, Kategorien und Validierung.
- Gemeinsames Modul-/ContentPanel-System weiter ausbauen, damit neue Subscreens schnell entstehen.
- Placeholder-Slots schrittweise durch echte Module ersetzen.
- Sammlungsscreen mit Kartenraster, Filter, Shiny-Varianten und Duplikaten.
- Activity-Tracking zum Verdienen von RAP.
- Weitere Pack-Artworks fuer RuneScape und World of Warcraft.
- Balancing des Pack-Openings mit mehreren Karten pro Pack.
- Weiteres Pity-/Bad-Luck-Protection-Balancing.
- Duplikat-System, zum Beispiel Shards, Dust oder Upgrade-Fortschritt.
- Pack-spezifische Drop-Tabellen.
- Universe-spezifische Kartenlisten.
- Importierbare JSON-Daten fuer Packs/Karten.
- Kartenbilder oder generierte/projektlokale Artworks.

## Offene Designfragen

- Sind 5 Karten pro Pack die richtige Menge?
- Sind Uncommon+ fuer Standardpacks und Rare+ fuer Wraeclast Vault die richtigen Garantien?
- Soll Mythic Legendary-Pity resetten oder eine eigene Pity-Regel bekommen?
- Soll Shiny fuer jede Karte gleich wahrscheinlich sein oder bei hoeherer Rarity anders gewichtet werden?
- Soll Pity global bleiben oder pro Universe/Pack laufen?
- Was passiert mit Duplikaten?
- Sollen reale Aktivitaeten bestimmte Pack-Typen oder Universe-Packs freischalten?
- Sollen Packs nur RAP kosten oder auch Level, Achievements oder Aktivitaets-Tags benoetigen?

## Update-Regel fuer Codex

Bei zukuenftigen Arbeiten zuerst diese Datei lesen. Wenn sich Spielziele, Rollmodell, Datenmodell, Features oder wichtige UI-Regeln aendern, diese Datei im selben Arbeitsschritt aktualisieren.

Bei groesseren oder abgeschlossenen Aenderungen ausserdem Version Control mitdenken: lokalen Build pruefen, sinnvoll committen und die Aenderungen nach GitHub pushen, sofern der Nutzer nichts anderes vorgibt.
