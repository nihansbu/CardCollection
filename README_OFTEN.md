# README OFTEN

Projekt-Memory fuer RAP Card Collection. Diese Datei soll regelmaessig aktualisiert werden, wenn Features, Ziele, Regeln, Datenmodelle oder wichtige Designentscheidungen geaendert werden.

## Projektidee

Das Projekt entwickelt sich von einer reinen RAP Card Collection zu einer Mobile-only Codex-Tracking-App. Der Spieler soll unterwegs schnell reale Aktivitaeten tracken, Punkte verdienen und ausgeben koennen, um Dinge zu leveln, zu trainieren, zu sammeln, upzugraden, freizuschalten und langfristig Account-Fortschritt aufzubauen.

RAP, kurz fuer Real Life Activity Points, bleibt als moegliche Hauptwaehrung fuer reale Aktivitaeten, Belohnungen und Freischaltungen erhalten. Die fruehere Pack-Shop-Idee ist nicht verworfen, aber aktuell nicht mehr der alleinige Hauptscreen. Sie wird als ein moegliches Modul im groesseren Codex-Collector-System behandelt.

Das Spiel ist als persoenliches, nicht veroeffentlichtes Fan-Projekt gedacht. Module duerfen bekannte Universes, Spiele und Genres referenzieren, zum Beispiel RuneScape-artige Skills, Bestiary-/Monster-Logs, Kartenpacks und spaeter weitere Codex-Kategorien.

## Aktueller Fokus

Der aktuelle Hauptscreen ist ein Codex-artiges Hauptmenue im dunklen Pixel-/Fantasy-Rahmenstil. Die mobile Topbar-Navigation soll als dauerhafte Modulnavigation dienen.

- Mobile-only Layout mit kompaktem Codex-Rahmen.
- Desktop wird nicht mehr gezielt designed oder unterstuetzt. Grosse Screens zeigen nur die mobile App-Spalte zentriert.
- Die App-Shell besteht aus einer kompakten, einklappbaren Topbar ohne redundante Status-/Seitentexte.
- Die Navigation behaelt 16 Slots und zeigt sie als 4x4-Touchraster.
- Die Topbar hat einen mittigen Handle-Button unterhalb des Rasters. Tap klappt die Topbar ein oder aus, Swipe nach oben/unten soll ebenfalls funktionieren.
- Der eingeklappte Topbar-Handle soll keinen eigenen vertikalen Layout-Space reservieren, sondern als Overlay leicht in den oberen Content-Rahmen hineinragen.
- Nach Auswahl eines Moduls klappt die Topbar automatisch ein, damit mehr Platz fuer den Seitenscreen bleibt.
- Slot 1: Codex.
- Slot 2: Skills.
- Slot 3: Activities.
- Slot 4: Beastiary.
- Slots 5 bis 16 sind bewusst Placeholder, damit klar ist, dass diese Module noch nicht im Spiel sind.
- Der aktive Topbar-Button wird rot markiert.
- Das grosse Content Window unter der Navigation bleibt zwischen Modulen strukturell gleich, ist aber mobil zuerst als gestapeltes Panel aufgebaut.
- Jedes Modul nutzt eine gemeinsame Header-Bar mit optionalem Back-Slot, festem Titelcontainer, optionaler horizontaler Action-Button-Zone und eigenen Stats.
- Hauptseiten ohne Back-Button zeigen zuerst den Titel, dann Actions und Stats. Subpages mit Back-Button zeigen links vom Titel den Zurueck-Button.
- Der Skills-Screen zeigt aktuell 30 RuneScape-like Skills als kompaktes mobile-only 3-Spalten-Skillpanel nach RuneScape-Anmutung. Die ehemalige untere RuneScape-Leiste mit Total Level/Combat/Quest Points wird nicht kopiert, weil diese Informationen in der vorhandenen Header-Stats-Bar leben.
- Das Skills-Panel muss auch im normalen mobilen Browser mit sichtbarer Chrome-/Android-Leiste kompakt genug bleiben, damit alle 30 Skills ohne vertikales Scrollen sichtbar sind.
- Jeder Skill startet aktuell auf Level 1 und hat ein Max-Level von 99.
- Die Skill-Kacheln zeigen nur das aktuelle Level, nicht `1/99`. Max-Level bleibt im Datenmodell erhalten.
- Alle 30 Skills nutzen fantasy/MMO-inspirierte Icons im kompakten RuneScape-artigen Skillpanel.
- Die Skills-Header-Stats zeigen `Total Skills`, die addierten `Skill Level` und das gerundete `Average Level`.
- Sailing ist als eigener Skill enthalten.
- Skills sind antippbar und oeffnen eine Skill-Subpage im gleichen ContentPanel-System.
- Skill-Subpages behalten die globale Topbar bei, ersetzen aber den ContentPanel-Titel durch den Skillnamen und zeigen skill-spezifische Placeholder-Stats.
- Skill-Subpages haben links neben dem Titel einen Back-Button zurueck zur Skill-Uebersicht.
- Long-Press auf einem Skill zeigt eine kompakte Quicklook-Info im Skills-Panel. Normaler Tap oeffnet weiterhin die Detailseite.
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
- Der GitHub-Pages-Deploy laeuft ueber `.github/workflows/deploy-pages.yml`.
- Vite nutzt `base: "./"` in `vite.config.js`, damit gebaute Assets unter GitHub Pages korrekt geladen werden.
- Vor dem Push mindestens `npm run build` ausfuehren.
- Diese Projekt-Memory weiter aktualisieren, wenn sich Hosting, Branching, Deployment oder technische Grundregeln aendern.

## UI-Aufbau

Die App ist in kleinere Views und Komponenten aufgeteilt:

- `src/App.jsx`: Aktive Codex-View und Routing zwischen Codex-Modulen.
- `src/components/AppShell.jsx`: Einklappbare Mobile-Topbar mit 16-Slot-Raster und Handle-Button.
- `src/views/MainMenuView.jsx`: schlanker Koordinator fuer aktive Codex-View, Skill-Subpage-State und Activity-Subpage-State.
- `src/components/ContentPanel.jsx`: wiederverwendbares Content-Window-System mit optionalem Back-Slot, festem Seitentitel, Action-Button-Zone und Stats-Bar.
- `src/features/skills/SkillsPanel.jsx`: Skills-Uebersicht und Skill-Detailseiten.
- `src/features/skills/skillData.js`: Skill-Liste, Skill-Level-Defaults und XP-Helfer.
- `src/features/activities/ActivitiesView.jsx`: Aktivitaetskarten, Sorts-Popover, Create Activity, Activity Log, Activity Stats und RAP-Verdienen.
- `src/features/activities/activityData.js`: Activity-Defaults, Activity-Typen, Sortieroptionen und Storage-Keys.
- `src/features/activities/activityUtils.js`: Activity-Berechnungen, Storage-Helfer, Log-Gruppierung, Stats und Heatmap-Daten.
- `src/features/codex/CodexPanels.jsx`: Codex-, Beastiary- und Placeholder-Panels.
- `src/views/ShopView.jsx`: Legacy-Shop-Raster, Collection Progress und Roll Odds.
- `src/views/CollectionView.jsx`: Legacy-Sammlungsscreen mit Progress-Uebersicht.
- `src/views/PlaceholderView.jsx`: Legacy-Platzhalter.
- `src/components/PackCard.jsx`: image-first Pack-Karte.
- `src/components/CollectionSummary.jsx`: Total- und Rarity-Fortschritt.
- `src/components/RollOddsPanel.jsx`: kompakte Rollmodell-Uebersicht.
- `src/components/CardListModal.jsx`: Kartenliste pro Pack.
- `src/components/PullModal.jsx`: Ergebnis nach Pack-Oeffnung.
- `src/utils/collection.js`: abgeleitete Collection-Statistiken.
- `vite.config.js`: Vite-Konfiguration, inklusive GitHub-Pages-kompatibler relativer Asset-Basis.
- `.github/workflows/deploy-pages.yml`: GitHub-Actions-Workflow fuer Build und GitHub-Pages-Deployment.

CSS ist nach Flaechen getrennt:

- `src/styles/base.css`
- `src/styles/app-shell.css`
- `src/styles/content-panel.css`
- `src/styles/codex-panels.css`
- `src/styles/skills.css`
- `src/styles/activities.css`
- `src/styles/shop.css`
- `src/styles/collection.css`
- `src/styles/modals.css`

Das ehemalige monolithische `src/views/MainMenuView.jsx` und `src/styles/main-menu.css` wurden aufgeteilt. Neue Systeme sollen bevorzugt als eigenes Feature unter `src/features/<name>/` plus eigenes CSS in `src/styles/` angelegt werden.

## Codex-UI-Regeln

- Die Topbar bleibt auf allen Subscreens sichtbar und stabil.
- Neue echte Module sollen zuerst als Topbar-Slot, dann als eigener ContentPanel-Inhalt angelegt werden.
- Placeholder-Slots duerfen sichtbar bleiben, sollen aber klar als nicht fertige Module wirken.
- Mobile ist ab jetzt die einzige UI-Zielgroesse. Neue Module muessen auf 390px bis 430px Breite funktionieren.
- Keine Desktop-spezifischen Breakpoints, keine mehrspaltigen Desktop-Grids und keine Hover-only Interaktionen.
- Grosse Screens duerfen die mobile App-Spalte nur zentrieren; Desktop ist kein eigenes Feature-Ziel mehr.
- Wiederverwendbare Flaechen sollen bevorzugt ueber `AppShell`, `ContentPanel`, mobile Listenkarten, Header-Actions und Header-Stats laufen.
- Die Modulnavigation bleibt ein kompaktes 4x4-Touchraster. Keine horizontale Scrollbar in der Hauptnavigation.
- Das Content Window besteht aus:
  - gemeinsamer Panel-Rahmen.
  - Header-Bar mit optionalem Back-Slot ganz links.
  - festem Titelcontainer, der auf Mobile die volle Breite nutzt und mit Back-Button rechts vom Back-Slot sitzt.
  - zentriertem Titeltext, dessen Schriftgroesse je nach Titel laengenabhaengig angepasst wird.
  - horizontaler Action-Button-Zone fuer modulspezifische Aktionen.
  - statspezifischen Boxen, die auf Mobile in drei kompakte Karten passen.
  - modulabhaengigem Body darunter.
- Skills nutzt die Header-Bar mit `Total Skills`, `Skill Level` und `Average Level`.
- Skill-Detailseiten nutzen die gleiche Header-Bar mit Back-Button, Skill-Titel und skill-spezifischen Stats.
- Activities nutzt die Header-Bar mit `RAP Balance`, `Activities` und `Logged`.
- Activities hat Subscreens fuer `Create Activity`, `Activity Log` und `Activity Stats`, jeweils mit Back-Button.
- Die Buttons `Sorts`, `Activity Log` und `Stats` leben in der Header-Action-Zone von Activities, nicht im Activity-Kartenraster.
- `Sorts` oeffnet ein kleines Popover direkt am Button und sortiert die Activity-Karten ohne Seitenwechsel.
- Der Back-Slot wird nur auf ContentPanel-Seiten mit echtem Back-Button genutzt; Hauptseiten ohne Back-Button lassen den Titel nach links ruecken.
- Codex nutzt die Header-Bar mit Projekt-/Loop-/Status-Informationen.
- Beastiary nutzt die Header-Bar mit Entries, Kills und Mastery als geplante Felder.
- Informationen muessen sichtbar, tappbar, per Long-Press-Quicklook oder ueber Detailseiten erreichbar sein. Hover-only Informationen sind nicht erlaubt.

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

### RAP und Activities

RAP steht fuer Real Life Activity Points und ist die Hauptwaehrung des Spiels.

Activities werden aktuell in `localStorage` gespeichert:

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
- Topbar und Content Window sollen als langlebige Hauptstruktur dienen.
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
