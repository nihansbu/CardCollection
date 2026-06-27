# README OFTEN

Projekt-Memory fuer RAP Card Collection. Diese Datei soll regelmaessig aktualisiert werden, wenn Features, Ziele, Regeln, Datenmodelle oder wichtige Designentscheidungen geaendert werden.

## WICHTIG: Agent Workflow Regeln

Diese Regeln stehen bewusst ganz oben. Sie sollen verhindern, dass zukuenftige Arbeit wieder Zeit durch bekannte Tool-/Sandbox-Probleme verliert.

### Dev-Server, Verify, Commit und Push

- Nicht bei jedem Prompt automatisch Server/Playwright starten. Bei reinen Doku-, Daten- oder kleinen CSS-/Code-Aenderungen zuerst entscheiden, ob `npm run build` reicht.
- `npm run build` ist der Standardcheck fuer normale Codeaenderungen. Er laeuft lokal zuverlaessig und braucht keinen Browser.
- Playwright/Edge-Verification (`node scripts/verify.mjs`) nur einsetzen, wenn UI-Flows, Layout, Navigation, LocalStorage-Progression oder Browserverhalten betroffen sind.
- Wenn Playwright im Sandbox-Kontext mit `spawn EPERM` scheitert, nicht mehrfach im Sandbox-Modus wiederholen. Direkt eskaliert ausfuehren:
  - PowerShell: `$env:RAP_APP_URL='http://127.0.0.1:5174/'; node scripts/verify.mjs; Remove-Item Env:RAP_APP_URL`
- Wenn fuer Verify ein lokaler Vite-Server gebraucht wird, direkt den funktionierenden Hintergrundstart verwenden:
  - PowerShell: `Start-Process -FilePath 'C:\Program Files\nodejs\npm.cmd' -ArgumentList @('run','dev','--','--port','5174') -WorkingDirectory 'C:\Users\nikla\Documents\CardCollection' -WindowStyle Hidden -PassThru`
  - Danach mit `Invoke-WebRequest -UseBasicParsing http://127.0.0.1:5174/` pruefen, ob HTTP `200` kommt.
- Nicht Zeit mit alternativen Serverstarts verlieren, wenn bekannte Fehler auftreten:
  - `Start-Process` mit Redirects kann in dieser Umgebung durch ein `Path/PATH`-Duplikatproblem scheitern.
  - `Start-Job`/sandboxed Vite kann durch `esbuild spawn EPERM` scheitern.
  - Vordergrund-`npm run dev` mit kurzem Timeout beendet den Server wieder.
- Beim Stoppen von Testservern keine breite Prozesssuche verwenden, die die eigene PowerShell-CommandLine matchen kann. Wenn Cleanup nicht eindeutig ist, lieber nur HTTP-Erreichbarkeit pruefen und keine riskante Stop-Logik erzwingen.
- Commit/Push direkt und gezielt:
  - `git add <konkrete Dateien>`
  - `git commit -m "<kurze sachliche Message>"`
  - `git push origin main`
- `.codex-remote-attachments/` niemals adden oder committen.
- Nach Push immer einen Cache-Buster-Link mit Commit-Hash nennen: `https://nihansbu.github.io/CardCollection/?v=<commit>`.

### Image-Generation Pipeline

- Vor jedem Asset klaeren: Wird wirklich ein neues Rasterbild gebraucht? Fuer einfache UI-Pfeile, Rahmen, Shapes oder deterministische Symbole zuerst CSS/SVG/Code pruefen. Bildgenerierung nur nutzen, wenn der Stil/Look vom generativen Asset profitiert.
- Fuer wiederkehrende Spielassets gilt der Standard: Das PNG enthaelt nur das eigentliche Icon/Item/Symbol mit transparentem Hintergrund. Badge, Kreis, Rahmen, Schatten, Statusfarbe und Modulfarbe kommen aus CSS/UI.
- Fuer Skill-, Unlock-, Quest- und UI-Icons einheitlich auf `128x128` oder maximal `256x256` finalisieren. Groessere Source-Bilder nur temporaer behalten und nicht committen.
- Built-in Imagegen erzeugt standardmaessig keine echte Transparenz. Wenn ein transparentes PNG gebraucht wird:
  - Prompt immer mit flachem Chroma-Key-Hintergrund, normalerweise `#00ff00`.
  - Keine Schatten, keine Bodenkontakte, keine Reflexionen, keine gruenen Teile im Motiv.
  - Danach lokal freistellen und nur das finale transparente PNG ins Projekt legen.
- Wenn Pillow fehlt, nicht blockieren. Fuer einfache Icons kann die vorhandene Windows/.NET-`System.Drawing`-Pipeline genutzt werden: Chroma-Key-Farbe entfernen, Motiv trimmen, auf Zielgroesse skalieren, transparente Pixel auf RGB 0 setzen.
- Pro Icon nur kurze technische Validierung:
  - Datei existiert im richtigen `public/...` Ordner.
  - Ecken haben Alpha 0.
  - Bild visuell einmal anschauen.
  - App-Build/Verify nur ausfuehren, wenn das Icon bereits in Code/UI verwendet wird.
- Nicht mehrere lange Pixeltests oder wiederholte Server-/Browserlaeufe fuer ein einzelnes Icon machen, wenn keine konkrete visuelle Regression sichtbar ist.
- Source-Dateien wie `*-source.png` nach erfolgreicher Freistellung entfernen. Committen nur: finale Assets und Code/Docs, die sie referenzieren.
- Bei groesseren Icon-Serien zuerst eine Ziel-Silhouette und Prompt-Regel definieren, dann Varianten als Reskins erzeugen. Beispiel: Logs und Aexte behalten die gleiche Grundform und unterscheiden sich primaer durch Material/Farbe.

## Projektidee

Das Projekt entwickelt sich von einer reinen RAP Card Collection zu einer Mobile-only Codex-Tracking-App. Der Spieler soll unterwegs schnell reale Aktivitaeten tracken, Punkte verdienen und ausgeben koennen, um Dinge zu leveln, zu trainieren, zu sammeln, upzugraden, freizuschalten und langfristig Account-Fortschritt aufzubauen.

RAP, kurz fuer Real Life Activity Points, bleibt als moegliche Hauptwaehrung fuer reale Aktivitaeten, Belohnungen und Freischaltungen erhalten. Die fruehere Pack-Shop-Idee ist nicht verworfen, aber aktuell nicht mehr der alleinige Hauptscreen. Sie wird als ein moegliches Modul im groesseren Codex-Collector-System behandelt.

Das Spiel ist als persoenliches, nicht veroeffentlichtes Fan-Projekt gedacht. Module duerfen bekannte Universes, Spiele und Genres referenzieren, zum Beispiel RuneScape-artige Skills, Bestiary-/Monster-Logs, Kartenpacks und spaeter weitere Codex-Kategorien.

## Aktueller Fokus

Der aktuelle Hauptscreen ist ein Codex-artiges Hauptmenue im dunklen Pixel-/Fantasy-Rahmenstil. Die mobile Bottom-Navigation soll als dauerhafte Modulnavigation dienen.

- Mobile-only Layout mit kompaktem Codex-Rahmen.
- Desktop wird nicht mehr gezielt designed oder unterstuetzt. Grosse Screens zeigen nur die mobile App-Spalte zentriert.
- Die App-Shell nutzt eine dauerhaft sichtbare Bottom-Navigation statt einer Topbar.
- Die Bottom-Navigation hat aktuell 8 kompakte Slots: Character, Deeds, Skills, Inventory, Quests, zwei Placeholder-Slots und More.
- Character ist ein Flyout-Button: Tap oeffnet ein kleines Menue nach oben mit Account, Gear und Stats als vorbereiteten Sub-Buttons.
- More ist ein Flyout-Button: Tap oeffnet ausgelagerte Module wie Beastiary und Codex.
- Account ist der Startpunkt fuer verpflichtende lokale Account-Erstellung und spaeter Cloud Login.
- Die Bottom-Navigation bleibt fixiert sichtbar. Flyouts duerfen die Content Section leicht ueberlappen.
- Der globale Screen selbst soll nicht vertikal scrollen. Nur die jeweilige Content-Body-Flaeche innerhalb des ContentPanel darf scrollen.
- Der aktive Bottom-Navigation-Button wird rot markiert.
- Das grosse Content Window unter der Navigation bleibt zwischen Modulen strukturell gleich, ist aber mobil zuerst als gestapeltes Panel aufgebaut.
- Jedes Modul nutzt eine gemeinsame Header-Bar aus `ContentPanel`: zentrierter Titelcontainer, optionaler Back-Button links innerhalb dieses Titelcontainers, rechtsbuendige Action-Button-Zone in derselben Zeile und eigene Stats darunter.
- Die `ContentPanel`-Header-Bar ist mobil standardmaessig eingeklappt, damit Body und InfoPanel mehr nutzbare Flaeche bekommen. Oben mittig sitzt ein flacher CSS-Goldtab, der die Header-Bar ein- und ausfaehrt. Der Tab ist bewusst niedrig und breit, liegt am oberen bzw. unteren Header-Rand an und bekommt ausgeklappt extra Abstand unter den Header-Stats, damit er keine Content-Elemente ueberdeckt.
- Long-Press-/Quicklook-Informationen nutzen moduluebergreifend das gemeinsame `InfoPanel`-Overlay aus `ContentPanel`. Es sitzt zentral am unteren Rand des ContentPanels direkt oberhalb der Bottom-Navigation; Feature-Seiten liefern nur Titel, Badge, Metrics, Beschreibung und optionale Zusatzinhalte.
- Die Dimensionen der Header-Bar, Action-Zone und Stats-Bar sollen zentral in `src/styles/content-panel.css` definiert bleiben. Feature-CSS soll die Topbar nicht mehr nachbauen, sondern nur echte Sonderfaelle ueberschreiben.
- Header-Actions teilen sich automatisch den gemeinsamen rechten Action-Bereich: ein Button nimmt die volle Action-Breite, mehrere Buttons werden gleichmaessig kleiner, bleiben aber in derselben Topbar-Struktur.
- Hauptseiten ohne Back-Button zeigen den zentrierten Titel, rechts modulbezogene Actions und darunter kompakte Stats. Subpages mit Back-Button nutzen dieselbe Struktur; der Back-Button lebt links im Titelcontainer statt in einer separaten Spalte.
- Der Skills-Screen zeigt aktuell 30 RuneScape-like Skills als kompaktes mobile-only 3-Spalten-Skillpanel nach RuneScape-Anmutung. Die ehemalige untere RuneScape-Leiste mit Total Level/Combat/Quest Points wird nicht kopiert, weil diese Informationen in der vorhandenen Header-Stats-Bar leben.
- Das Skills-Panel muss auch im normalen mobilen Browser mit sichtbarer Chrome-/Android-Leiste kompakt bleiben. Aktuell sollen 30 Skills in die Hauptansicht passen; bei mehr Inhalt scrollt nur die interne Content-Body-Flaeche.
- Jeder Skill startet aktuell auf Level 1 und hat ein Max-Level von 99.
- Die Skill-Kacheln zeigen nur das aktuelle Level, nicht `1/99`. Max-Level bleibt im Datenmodell erhalten.
- Alle 30 Skills nutzen generierte transparente `128x128` PNG-Icons im kompakten RuneScape-artigen Skillpanel. Diese Icons liegen unter `public/skill-icons/` und sollen auch fuer Inventar, Detailseiten und spaetere Item-/Skill-Referenzen wiederverwendbar bleiben.
- Skill-Icons und Unlock-Icons trennen Asset und UI-Badge: Das PNG enthaelt nur das lesbare Fantasy-/Pixel-Icon, runde beige Badge-Hintergruende und Rahmen kommen aus CSS.
- Die Skills-Header-Stats zeigen als Icon-Kacheln `Total Level`, `Average Level` und `Total XP`.
- Skills hat rechts neben dem Titel einen `Training`-Action-Button mit Icon. Tap oeffnet die eigene `Skills Training`-Ansicht im gleichen ContentPanel-System.
- `Skills Training` nutzt dieselbe mobile Layout-Struktur wie Skills: zentrierter Titel, rechts ein `Skills`-Action-Button zurueck zur Uebersicht, darunter vier Header-Stats und im Content-Body dasselbe 3-Spalten-Skillgrid.
- Die vier Header-Stats im Training sind `RAP`, `Slot 1`, `Slot 2` und `Slot 3`. Die Slots sind tappbar; der aktive Slot wird gelb markiert.
- In `Skills Training` sind Skill-Taps der Hauptweg fuer Slot-Steuerung. Ein Tap auf einen noch nicht trainierten Skill fuellt automatisch den ausgewaehlten freien Slot oder sonst den ersten freien Slot in Reihenfolge Slot 1, Slot 2, Slot 3. Nach jeder Auswahl springt die Slot-Auswahl automatisch auf den naechsten freien Slot.
- Ein Tap auf einen bereits trainierten Skill entfernt ihn aus seinem Slot und waehlt danach automatisch den naechsten freien Slot. Manuelles Antippen eines Slot-Stats bleibt als Override erhalten und ersetzt beim naechsten Skill-Tap bewusst genau diesen Slot.
- Aktuell trainierte Skills werden im Grid gelb umrahmt und zeigen einen kleinen Slot-Badge.
- Aktuell trainierte Skills werden sowohl in `Skills Training` als auch in der normalen Skills-Uebersicht gelb markiert.
- Nur aktuell trainierte Skills zeigen in der Skill-Kachel zusaetzlich zum Level eine Prozentanzeige fuer den Fortschritt bis zum naechsten Level.
- Alle Skill-Kacheln zeigen eine horizontale Fortschrittsfuellung von links nach rechts fuer den aktuellen Fortschritt im Level. Bei aktiv trainierten Skills ist diese Füllung animiert und aktualisiert sich live mit dem Trainingstick.
- Skill-Kacheln zeigen jetzt auch den Skillnamen direkt in der Kachel. Lange Skillnamen werden kleiner gesetzt, ohne die Kachelhoehe zu vergroessern.
- Skilltraining tauscht RAP 1:1 gegen Skill-XP. Insgesamt koennen maximal 5000 RAP/XP pro Stunde ausgegeben werden. Ein aktiver Slot bekommt 5000 XP/h, zwei aktive Slots je 2500 XP/h, drei aktive Slots je ein Drittel. RAP, Skill-XP und Level werden jede Sekunde aktualisiert und gespeichert.
- Skilltraining laeuft auch offline weiter: Beim naechsten App-Start wird die vergangene Zeit seit dem letzten Trainings-Tick nachgerechnet.
- Wenn RAP durch Training auf `0` faellt, werden alle Trainingsslots automatisch geleert.
- Groessere RAP- und XP-Werte werden in kompakten Werten dargestellt, z. B. `7320` als `7,3k`.
- Sailing ist als eigener Skill enthalten.
- Skills sind antippbar und oeffnen eine Skill-Subpage im gleichen ContentPanel-System.
- Skill-Subpages behalten die globale Bottom-Navigation bei, ersetzen aber den ContentPanel-Titel durch den Skillnamen und zeigen skill-spezifische Placeholder-Stats.
- Skill-Subpages haben links neben dem Titel einen Back-Button zurueck zur Skill-Uebersicht.
- Skill-Subpages zeigen in der Header-Stats-Bar aktuell `RAP`, `Level`, `Current XP` und `XP to Next Level`, weil Unlocks direkt RAP verbrauchen. RAP steht auf Skill-Subpages bewusst links wie in anderen Ressourcenscreens.
- Skill-Subpage-Stats nutzen icon-only Kacheln: Icon oben, Wert darunter, Label nur noch fuer Accessibility und Long-Press-Quicklook.
- Woodcutting hat als erster Skill eine Unlock-Liste im Skill-Detail-Body. Unlocks werden nicht in Kategorien unterteilt, sondern als volle Zeilen untereinander dargestellt.
- Skill-Detailseiten zeigen keinen grossen Skill-Hero zwischen Header und Content mehr. Nach der gemeinsamen Topbar/Stats-Bar beginnt direkt die Unlock-Liste bzw. der skill-spezifische Content.
- Unlock-Zeilen zeigen Level-Anforderung, Icon-/Item-Platzhalter, Unlock-Name, RAP-Kosten und Dauer. Die Zeilen nutzen die volle Breite und sind ungefaehr so hoch wie Skill-Kacheln.
- Woodcutting-Unlocks nutzen generierte transparente PNG-Icons unter `public/unlock-icons/woodcutting/`. Der runde beige Icon-Hintergrund ist bewusst CSS/UI und nicht in den PNGs gebacken.
- Unlock-Icons sollen als einfache, gut lesbare Pixel-/Fantasy-Items angelegt werden. Aehnliche Item-Familien, zum Beispiel Logs oder spaeter Aexte, sollen eine gemeinsame Silhouette nutzen und sich primaer durch Material/Farbe unterscheiden.
- Unlock-Zeilen zeigen ebenfalls eine horizontale Fortschrittsfuellung von links nach rechts. Freigeschaltete Unlocks sind 100 Prozent gefuellt; laufende Unlocks animieren die Füllung und speichern auch kleine Teilfortschritte.
- Unlock-Statusfarben: rot = Level noch nicht erreicht, gelb = Level erreicht und kaufbar, tuerkis = Unlock laeuft gerade, gruen = freigeschaltet.
- Level-1-Unlocks sind automatisch freigeschaltet. Ab Level 2 muessen Unlocks mit RAP gestartet und fertig abgerechnet werden.
- Unlock-Kosten skalieren aktuell ab Level 2 linear mit `levelRequired * 100 RAP`. Level-1-Unlocks kosten 0 RAP. Beispiel: Level 5 kostet 500 RAP, Level 40 kostet 4000 RAP.
- Unlocks verbrauchen pro laufendem Unlock bis zu 5000 RAP pro Stunde. Mehrere Unlocks koennen gleichzeitig laufen und sind grundsaetzlich unabhaengig; bei knapper RAP-Balance wird vorhandener RAP proportional auf laufende Unlocks verteilt.
- Wenn RAP ausgeht, bleiben laufende Unlocks auf `unlocking` und behalten ihren gespeicherten `progressRap`. Sobald wieder RAP vorhanden ist, koennen sie ab diesem Teilfortschritt weiterlaufen.
- Unlock-Fortschritt laeuft auch offline weiter: Beim naechsten App-Start wird die vergangene Zeit seit dem letzten Unlock-Tick nachgerechnet.
- Long-Press auf einem Skill, Header-Stat oder Header-Action zeigt eine kompakte Quicklook-Info im gemeinsamen unteren InfoPanel-Overlay. Normaler Tap oeffnet weiterhin die Detailseite oder fuehrt die normale Button-Aktion aus.
- Skill-Quicklook-Werte werden aus dem aktuellen Skill-State abgeleitet und aktualisieren sich live, solange Training tickt.
- Skill-Quicklook und Skill-Detailseiten verwenden die Labels `Current XP` und `XP to Next Level`. `XP to Next Level` zeigt zusaetzlich eine ETA in Klammern, wenn der Skill aktuell trainiert wird, sonst `Idle`.
- Die Skill-XP-Werte nutzen aktuell eine RuneScape-artige XP-Kurve. Level 1 startet bei 0 XP, Level 2 liegt bei 83 XP.
- Codex beschreibt die neue Grundidee: Train, Collect, Upgrade, Unlock.
- Beastiary ist als geplantes Monster-/Creature-Modul angelegt.
- RAP, Real Life Activity Points, ist als Hauptwaehrung eingefuehrt.
- Deeds ist als erstes RAP-Earning-Modul eingefuehrt.
- Der Begriff `Activities` ist ab jetzt fuer spaetere Ingame-Activities reserviert, z. B. Dungeons, Skilling-Actions, Combat-/Slayer-Actions oder andere spielinterne Aktionen. Reale Tracking-Aktionen heissen intern und in der UI `Deeds`.
- Deeds nutzt die Header-Action-Zone fuer `Sorts`, `Deed Log` und `Stats`.
- Deeds folgt jetzt staerker dem Skills-/Unlocks-Blueprint: gemeinsame ContentPanel-Topbar, darunter ein scrollender Body mit drei einfachen Goal-Strips fuer Dailies, Weeklies und Monthlies sowie einem kompakten 4-Spalten-Deed-Grid.
- `Dailies` ist die Standardansicht. Tap auf `Dailies`, `Weeklies` oder `Monthlies` setzt genau diese aktive Goal-Ansicht; erneutes Antippen derselben Ansicht toggelt sie nicht aus.
- Deed-Kacheln zeigen Sigil/Icon, Name, Typ, Deed-Mastery-Level und eine kleine Fortschrittsleiste. Diese Leiste zeigt immer den Fortschritt der aktuell aktiven Goal-Ansicht, also Daily, Weekly oder Monthly. Auf der Leiste steht nur die zentrierte Prozentzahl, z. B. `100%`, ohne Perioden-Text. Bei 100 Prozent bekommt die Kachel einen goldenen Abschluss-Akzent.
- Der linierte Deeds-Board-Hintergrund soll die komplette scrollbare Content-Body-Flaeche fuellen, auch wenn nur wenige Deeds sichtbar sind. Die Deed-Kacheln bleiben dabei topbuendig.
- Die Goal-Strips zeigen nur Gesamtfortschritt und erledigte Goals als `X/Y`. Einzelne kleine Segment-Bars pro Deed werden bewusst nicht verwendet, weil sie bei vielen Deeds unlesbar werden.
- Deed-Long-Press oeffnet ein Amount-Panel mit Plus/Minus, Zahlenfeld, Presets und Log-Button, damit neben Quick-Tap auch flexible Mengen wie 500, 1000 oder 10000 Schritte sauber eingetragen werden koennen.
- Aktivitaeten koennen RAP vergeben und schreiben einzelne Log-Eintraege fuer spaetere Metriken/Diagramme.
- Deeds koennen optionale Daily-, Weekly- und Monthly-Goals besitzen. Diese Goals sind keine eigenen Deeds, sondern Bonusziele derselben Aktivitaet.
- Deed-Goal-Boni sind additiv: Base RAP plus Daily-Bonus plus Weekly-Bonus plus Monthly-Bonus. Standard-Bonus ist aktuell 30 Prozent pro Goal, soweit das jeweilige Goal noch offen ist.
- Deed-Softcaps reduzieren sehr hohe Tagesmengen, statt sie hart zu verbieten. Bei Steps liegt der Tages-Softcap aktuell bei 100000 Schritten; Mengen darueber geben nur noch reduzierten Base-RAP und reduzierte Goal-Boni.
- Steps ist als Default-Deed eingefuehrt: 1 Schritt = 1 RAP, Quick-Tap loggt 1000 Schritte, Presets sind 500, 1000, 5000 und 10000 Schritte.
- Das Deed Log gruppiert die Darstellung nach Aktivitaet und Einheit, summiert Quantity und RAP, behaelt intern aber die einzelnen Timestamps.
- Deeds haben einen `type`, zum Beispiel Exercise, Mind, Productivity, Creative, Social, Home, Recovery oder General.
- Deeds koennen im Hauptscreen ueber ein kleines `Sorts` Popover nach Default, Name, RAP Reward, Type oder Unit sortiert werden.
- Deed Stats ist als Subpage angelegt und zeigt All Deeds oder eine einzelne Deed mit Kennzahlen, Longest Streak und rollender 365-Tage-Heatmap.
- Quests ist als eigenes Bottom-Navigation-Modul eingefuehrt und ersetzt den ersten Placeholder-Slot.
- Quests nutzt denselben `ContentPanel`-Topbar-Blueprint wie Skills und Deeds.
- Die Quests-Header-Stats zeigen aktuell `RAP`, `Unlocked` als RuneScape-artige `X / Y`-Darstellung, `Available` und `Quest Points`.
- Der Quests-Body zeigt kompakte quadratische Quest-Kacheln in einem 5-Spalten-Grid. Der Body ist intern scrollbar; die globale Bottom-Navigation bleibt sichtbar.
- Quest-Kacheln nutzen Statusfarben: rot = Skill-Anforderungen fehlen, gelb = Anforderungen erfuellt und startbar, tuerkis = Quest laeuft/freischaltet oder abgeschlossen. Abgeschlossene Quests sollen den tuerkisen/blauen Hintergrund prominent fuellen, damit Completion im Grid schnell sichtbar ist.
- Quest-Kacheln verwenden flache farbige Status-Quadrate ohne zusaetzlichen runden Innenhintergrund. Spaetere echte Quest-Icons sollen direkt auf diesen Statusflaechen liegen.
- Die ersten Quest-Kacheln nutzen echte transparente `128x128` PNG-Icons unter `public/quest-icons/`; der farbige Status-Hintergrund bleibt CSS/UI.
- Quests haben einen `Sort`-Header-Button mit Popover fuer Default, Alphabetical, Highest/Lowest Skill Requirement, Highest/Lowest Quest Points sowie Unlocked, Available und Locked.
- Long-Press auf einer Quest oeffnet ein unteres Quicklook-Panel mit Questname, Status, RAP-Kosten, Dauer, Fortschritt, Skill-Anforderungen und Beschreibung.
- Quests sind aktuell Skill- und RAP-Checks: Die Voraussetzungen pruefen aktuelle Skill-Level; startbare Quests verbrauchen RAP ueber Zeit mit derselben 5000-RAP-pro-Stunde-Rate wie Skill-Unlocks.
- Quest-Fortschritt laeuft live und offline weiter. Teilfortschritt bleibt gespeichert, wenn RAP ausgeht.
- Der alte Pack-Shop, Pack-Kauf, Collection-Progress und Pull-Modals existieren im Code noch, sind aber aktuell nicht der sichtbare Hauptscreen.
- Deeds nutzt ein mobiles Kachelgrid, damit viele reale Tracking-Deeds schnell antippbar bleiben. Die Actions `Sorts`, `Deed Log` und `Stats` bleiben im gemeinsamen Header-System.

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
- `src/views/MainMenuView.jsx`: schlanker Koordinator fuer aktive Codex-View, Skill-Uebersicht/-Training/-Detail-State, RAP-Ausgabe durch Training und Deed-Subpage-State.
- `src/components/ContentPanel.jsx`: wiederverwendbares Content-Window-System mit optionalem Back-Button im Titelcontainer, festem Seitentitel, responsiver Action-Button-Zone und Stats-Bar als gemeinsamer Topbar-Blueprint fuer alle Module.
- `src/components/InfoPanel.jsx`: gemeinsames unteres Quicklook-/Infopanel fuer Skills, Deeds, Quests und spaetere Module.
- `src/features/account/AccountPanel.jsx`: Account-Screen mit lokaler Account-Erstellung/Login, Cloud-Auth-Formular und lokalem Save-Status.
- `src/features/skills/SkillsPanel.jsx`: Skills-Uebersicht, Skills-Training und Skill-Detailseiten.
- `src/features/skills/skillData.js`: Skill-Liste, Skill-Level-Defaults, XP-Helfer, Training-Rate und Skill-Storage-Keys.
- `public/ui-icons/`: generierte transparente `128x128` UI-Icons fuer Header-Stats, Bottom-Navigation und Flyouts.
- `public/skill-icons/`: generierte transparente `128x128` Skill-Icons fuer alle 30 Skills.
- `public/unlock-icons/woodcutting/`: generierte transparente Woodcutting-Unlock-Icons; runde Badge-Hintergruende bleiben CSS.
- `public/quest-icons/`: transparente `128x128` Quest-Icons fuer Quest-Kacheln und Quicklooks.
- `src/features/deeds/DeedsView.jsx`: Aktivitaetskarten, Sorts-Popover, Create Deed, Deed Log, Deed Stats und RAP-Verdienen.
- `src/features/deeds/deedData.js`: Deed-Defaults, Deed-Typen, Sortieroptionen und Storage-Keys.
- `src/features/deeds/deedUtils.js`: Deed-Berechnungen, Storage-Helfer, Log-Gruppierung, Stats und Heatmap-Daten.
- `src/features/quests/QuestsPanel.jsx`: Quest-Uebersicht, 5-Spalten-Questgrid und Long-Press-Quicklook.
- `src/features/quests/questData.js`: Quest-Definitionen, Skill-Anforderungen, Quest-Status, RAP-Kosten, Progress- und Offline-Tick-Helfer.
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
- `scripts/verify.mjs`: Mobile-Smoke-Test fuer aktuellen Skills-, Offline-Training- und Offline-Unlock-Flow.
- `supabase/migrations/20260621235000_initial_cloud_save.sql`: erstes Cloud-Save-Schema mit RLS-Policies.
- `vite.config.js`: Vite-Konfiguration, inklusive GitHub-Pages-kompatibler relativer Asset-Basis.
- `.github/workflows/deploy-pages.yml`: GitHub-Actions-Workflow fuer Build und GitHub-Pages-Deployment.

CSS ist nach Flaechen getrennt:

- `src/styles/base.css`
- `src/styles/app-shell.css`
- `src/styles/content-panel.css`
- `src/styles/info-panel.css`
- `src/styles/codex-panels.css`
- `src/styles/account.css`
- `src/styles/skills.css`
- `src/styles/deeds.css`
- `src/styles/quests.css`
- `src/styles/shop.css`
- `src/styles/collection.css`
- `src/styles/modals.css`

Das ehemalige monolithische `src/views/MainMenuView.jsx` und `src/styles/main-menu.css` wurden aufgeteilt. Neue Systeme sollen bevorzugt als eigenes Feature unter `src/features/<name>/` plus eigenes CSS in `src/styles/` angelegt werden.

Healthcheck 2026-06-21:

- Skills ist aktuell die stilistische Referenz fuer neue Module.
- Deeds ist funktional, soll bei einer spaeteren UI-Ueberarbeitung aber staerker dem Skills-Muster folgen: Header-Stats, Action-Zone, kompakter Body, keine abweichende Seitenlogik.
- Legacy-Pack-/Collection-Dateien bleiben bewusst im Repo, weil Packs/Karten als spaeteres Modul nicht verworfen sind.
- Die alte ungenutzte `src/storage.js` wurde entfernt, weil sie nur alte Pack-Shop-Keys enthielt und nicht mehr eingebunden war.
- `scripts/verify.mjs` wurde vom alten Shop-Test auf den aktuellen mobile Skills-/Offline-Training-/Offline-Unlock-Flow umgestellt.

## Codex-UI-Regeln

- Die Bottom-Navigation bleibt auf allen Subscreens sichtbar und stabil.
- Neue echte Module sollen zuerst als Bottom-Navigation-Slot oder Character-Flyout-Subslot, dann als eigener ContentPanel-Inhalt angelegt werden.
- Placeholder-Slots duerfen sichtbar bleiben, sollen aber klar als nicht fertige Module wirken.
- Mobile ist ab jetzt die einzige UI-Zielgroesse. Neue Module muessen auf 390px bis 430px Breite funktionieren.
- Keine Desktop-spezifischen Breakpoints, keine mehrspaltigen Desktop-Grids und keine Hover-only Interaktionen.
- Grosse Screens duerfen die mobile App-Spalte nur zentrieren; Desktop ist kein eigenes Feature-Ziel mehr.
- Wiederverwendbare Flaechen sollen bevorzugt ueber `AppShell`, `ContentPanel`, mobile Listenkarten, Header-Actions und Header-Stats laufen.
- Neue Seiten sollen die Topbar ausschliesslich ueber `ContentPanel` befuellen: `title`, `actions`, `stats` und optional `onBack`. Gleiche Dimensionen kommen aus dem gemeinsamen Blueprint; Feature-spezifische CSS-Overrides fuer `.content-header`, `.content-title-box`, `.content-actions` oder `.content-stats` nur verwenden, wenn ein Screen wirklich eine begruendete Ausnahme braucht.
- Die Modulnavigation bleibt eine kompakte Bottom-Bar mit 8 Touch-Slots. Keine horizontale Scrollbar in der Hauptnavigation.
- Das Content Window besteht aus:
  - gemeinsamer Panel-Rahmen.
  - Header-Bar mit optionalem Back-Button links im Titelcontainer.
  - festem Titelcontainer, der auf Mobile den verfuegbaren Titelbereich nutzt und optional den Back-Button links integriert.
  - zentriertem Titeltext, dessen Schriftgroesse je nach Titel laengenabhaengig angepasst wird.
  - horizontaler Action-Button-Zone fuer modulspezifische Aktionen.
  - statspezifischen Boxen, die auf Mobile als kompakte Karten in der benoetigten Anzahl passen.
  - modulabhaengigem Body darunter.
- Skills nutzt die Header-Bar mit `Total Level`, `Average Level`, `Total XP` und dem `Training`-Action-Button.
- Skills Training nutzt die Header-Bar mit `RAP`, `Slot 1`, `Slot 2`, `Slot 3` und dem `Skills`-Action-Button.
- Skill-Detailseiten nutzen die gleiche Header-Bar mit Back-Button, Skill-Titel und skill-spezifischen Stats.
- Skill-Detailseiten duerfen darunter skill-spezifische Listen wie Unlocks zeigen. Diese Listen sollen im Content-Body scrollen und keine eigene globale Seite scrollen lassen.
- Deeds nutzt die Header-Bar mit `RAP Balance`, `Deeds` und `Logged`.
- Deeds hat Subscreens fuer `Create Deed`, `Deed Log` und `Deed Stats`, jeweils mit Back-Button.
- Die Buttons `Sorts`, `Deed Log` und `Stats` leben in der Header-Action-Zone von Deeds, nicht im Deed-Kartenraster.
- `Sorts` oeffnet ein kleines Popover direkt am Button und sortiert die Deed-Karten ohne Seitenwechsel.
- Quests nutzt die Header-Bar mit `RAP`, `Ready` und `Done` sowie einem vorbereiteten `Log`-Action-Slot.
- Quest-Kacheln sollen moeglichst viele Eintraege auf einem Bildschirm zeigen. Aktuell sind es fuenf quadratische Kacheln pro Reihe; echte Quest-Icons koennen spaeter die aktuellen Kuerzel ersetzen.
- Der Back-Button wird nur auf ContentPanel-Seiten mit echter Ruecknavigation genutzt und lebt links innerhalb des Titelcontainers. Hauptseiten ohne Back-Button behalten den Titel zentriert.
- Codex nutzt die Header-Bar mit Projekt-/Loop-/Status-Informationen.
- Account nutzt die Header-Bar mit `User`, `Cloud` und `Mode`. Beim ersten App-Start wird ein lokaler Account mit frei gewaehltem Username/Passwort erzwungen. Das lokale Passwort wird mit PBKDF2 und Salt gehasht gespeichert. Das ist fuer den privaten Prototyp ausreichend als lokaler Zugriffsschutz, ersetzt aber keine Cloud-Sicherheit.
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

### RAP und Deeds

RAP steht fuer Real Life Activity Points und ist die Hauptwaehrung des Spiels.

Deeds werden aktuell ueber die zentrale lokale Save-Schicht in `localStorage` gespeichert:

- Key `codex-collector-v1-rap`: aktuelle RAP-Balance.
- Key `codex-collector-v1-deeds`: gespeicherte Aktivitaeten.
- Key `codex-collector-v1-deed-log`: Aktivitaetslog.
- Legacy-Keys `codex-collector-v1-activities` und `codex-collector-v1-activity-log` werden beim Laden als Fallback migriert, damit alte lokale Saves nicht verloren gehen.

Ein Deed enthaelt aktuell:

- `id`: technische Deed-ID.
- `title`: sichtbarer Name.
- `description`: kurze Beschreibung.
- `type`: grobe Kategorie, aktuell u. a. Exercise, Mind, Productivity, Creative, Social, Home, Recovery oder General.
- `unit`: frei tippebare Einheit, z. B. seconds, minutes, pages, steps.
- `defaultQuantity`: Standardmenge, die beim Klick geloggt wird.
- `rapPerUnit`: RAP-Belohnung pro Einheit.
- `color`: UI-Akzentfarbe.
- optional `presetQuantities`: Mengen-Presets fuer das Long-Press-Amount-Panel.
- optional `maxQuantityPerLog`: Soft-Limit fuer einzelne Log-Eingaben.
- optional `softCapDailyQuantity`: Tagesmenge, ab der weitere Quantity reduziert belohnt wird.
- optional `softCapBaseRate`: Multiplikator fuer Base-RAP oberhalb des Tages-Softcaps, aktuell typischerweise 0.5.
- optional `softCapGoalBonusRate`: Multiplikator fuer Goal-Boni oberhalb des Tages-Softcaps, aktuell typischerweise 0.33.
- optional `goals`: Daily-/Weekly-/Monthly-Ziele mit `period`, `targetQuantity` und `bonusRate`.

Aktuelle Default-RAP-Rates:

- Steps: 1 RAP pro Schritt.
- Walking: 167 RAP pro Minute.
- Reading: 250 RAP pro Seite.
- Working: 333 RAP pro Minute.
- Running: 417 RAP pro Minute.
- Instrument Practice: 333 RAP pro Minute.

Beim Klick auf einen Deed:

1. Beim Quick-Tap wird die `defaultQuantity` geloggt; im Long-Press-Panel kann eine flexible Menge geloggt werden.
2. Base-RAP wird aus `quantity * rapPerUnit` berechnet.
3. Offene Daily-/Weekly-/Monthly-Goals addieren Bonus-RAP nur fuer den Teil der Menge, der noch in das jeweilige Ziel passt.
4. Mengen oberhalb des Tages-Softcaps werden reduziert belohnt, damit extreme Tageswerte moeglich, aber weniger effizient sind.
5. Die RAP-Balance wird gespeichert.
6. Ein Deed-Log-Eintrag wird erstellt.

Deed-Mastery:

- Deed-Level werden aktuell aus dem bisher durch diese Aktivitaet verdienten RAP abgeleitet.
- Die Levelkurve verwendet dieselbe RuneScape-artige XP-Kurve wie Skills.
- Deed-Kacheln zeigen `Lv X`; die kleine Fortschrittsleiste zeigt den Fortschritt der aktiven Goal-Ansicht. Daily ist die Standardansicht, Weekly und Monthly koennen ueber die Goal-Strips aktiviert werden.

Deed Goals:

- Goals werden aus Deed-Events berechnet, nicht als separate Deed gespeichert.
- Daily nutzt den lokalen Kalendertag.
- Weekly startet Montag lokal.
- Monthly nutzt den lokalen Kalendermonat.
- Bonus-Berechnung ist additiv, nicht multiplikativ. Beispiel: Base 100 RAP plus Daily +30 RAP plus Weekly +30 RAP ergibt 160 RAP.
- Bonus gilt nur fuer noch offene Goal-Menge. Wenn ein Weekly nur noch 3000 Schritte offen hat und 10000 Schritte geloggt werden, zaehlt der Weekly-Bonus nur fuer 3000 Schritte.

Ein Deed-Log-Eintrag enthaelt aktuell:

- `id`
- `deedId`
- `title`
- `quantity`
- `unit`
- `rapEarned`: gesamter verdienter RAP inklusive Goal-Boni.
- `baseRapEarned`: Base-RAP vor Goal-Boni.
- `goalBonusRap`: Summe der Goal-Boni.
- `goalBreakdown`: angewendete Bonusziele mit Perioden, Bonus-RAP und angerechneter Menge.
- `isSoftCapped`: ob ein Teil der Menge ueber dem Tages-Softcap lag.
- `softCappedQuantity`: Menge oberhalb des Tages-Softcaps.
- optional `type` fuer neuere Log-Eintraege.
- `timestamp`

Die Deed-Log-UI wertet die letzten 50 Roh-Eintraege aus und gruppiert sie fuer die Anzeige nach Aktivitaet und Einheit. Dadurch erscheint z. B. Walking nur einmal, waehrend Quantity, RAP und Entry-Anzahl summiert werden. Intern werden weiterhin einzelne Eintraege mit Timestamp gespeichert und aktuell bis zu 250 Eintraege behalten, damit spaeter Metriken und Diagramme daraus entstehen koennen.

Deed Stats nutzt die Roh-Eintraege fuer erste Analytics:

- Auswahl zwischen `All Deeds` und einzelnen Deeds.
- Total RAP, geloggte Quantity, Active Days und Longest Streak.
- Longest Streak speichert aktuell Laenge sowie Start- und Enddatum fuer die Anzeige.
- Die Heatmap zeigt rollend die letzten 365 Tage, nicht nur das aktuelle Kalenderjahr, damit ein Jahreswechsel die Anzeige nicht komplett leert.
- Die Heatmap-Intensitaet basiert aktuell auf Entry-Anzahl pro Tag.

### Skills und Training

Skills werden aktuell aus der statischen Skill-Liste normalisiert und mit gespeichertem Fortschritt aus der zentralen lokalen Save-Schicht kombiniert:

- Key `codex-collector-v1-skills`: aktueller XP- und Level-Stand aller Skills.
- Key `codex-collector-v1-skill-training-slots`: drei Trainingsslots als Skillnamen oder `null`.
- Key `codex-collector-v1-skill-training-last-tick`: letzter Zeitpunkt, bis zu dem Skilltraining abgerechnet wurde.
- Key `codex-collector-v1-skill-unlocks`: Skill-Unlocks mit Status, RAP-Fortschritt und Timestamps.
- Key `codex-collector-v1-skill-unlock-last-tick`: letzter Zeitpunkt, bis zu dem Unlock-Fortschritt abgerechnet wurde.

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

### Skill Unlocks

Woodcutting ist der erste Skill mit einem echten Unlock-Slice. Die Unlock-Definitionen liegen aktuell statisch in `src/features/skills/skillData.js` und werden beim Laden mit gespeichertem Fortschritt normalisiert.

Ein Skill-Unlock enthaelt aktuell:

- `id`: technische Unlock-ID.
- `skill`: zugehoeriger Skillname, aktuell `Woodcutting`.
- `levelRequired`: benoetigtes Skill-Level.
- `name`: sichtbarer Unlock-Name.
- `description`: kurze Beschreibung fuer spaetere Detail-/Quicklook-Nutzung.
- `iconText`: temporarer Icon-/Item-Platzhalter.
- `rapCost`: berechnete RAP-Kosten, aktuell 0 fuer Level 1 und sonst `levelRequired * 100`.
- `progressRap`: bereits investierte RAP.
- `status`: `available`, `unlocking` oder `unlocked`; `locked` wird in der UI aus Skill-Level und Unlock-Level abgeleitet.
- `startedAt` und `completedAt`: Timestamps fuer laufende und abgeschlossene Unlocks.

Aktuelle Woodcutting-Beispielunlocks:

- Level 1: Normal Logs, automatisch unlocked.
- Level 2: Oak Logs.
- Level 5: Willow Logs.
- Level 10: Maple Logs.
- Level 15: Teak Logs.
- Level 20: Mahogany Logs.
- Level 30: Yew Logs.
- Level 40: Magic Logs.
- Level 60: Elder Logs.
- Level 75: Crystal Trees.

Unlock-Fortschritt laeuft live und offline:

1. Tappbare gelbe Unlocks wechseln auf `unlocking`.
2. Jeder aktive Unlock will bis zu `5000 / 3600` RAP pro Sekunde verbrauchen.
3. Bei genug RAP laufen mehrere Unlocks parallel unabhaengig weiter.
4. Bei zu wenig RAP wird der verfuegbare RAP proportional auf laufende Unlocks verteilt.
5. Wenn RAP auf 0 faellt, bleiben Teilfortschritt und `unlocking`-Status gespeichert.
6. Sobald `progressRap >= rapCost`, wird der Unlock auf `unlocked` gesetzt.
7. Beim App-Start wird vergangene Zeit seit `codex-collector-v1-skill-unlock-last-tick` nachgerechnet.

### Quests

Quests sind aktuell statische Definitionen plus gespeicherter Fortschritt:

- Key `codex-collector-v1-quests`: Quest-Status, RAP-Fortschritt und Timestamps.
- Key `codex-collector-v1-quest-last-tick`: letzter Zeitpunkt, bis zu dem Quest-Fortschritt abgerechnet wurde.

Eine Quest enthaelt aktuell:

- `id`: technische Quest-ID.
- `name`: sichtbarer Questname.
- `description`: Quicklook-Beschreibung.
- `iconSrc`: optionales transparentes Quest-Icon-Asset fuer echte Icons im Questgrid.
- `iconText`: temporaeres Quest-Kuerzel fuer die quadratische Kachel.
- `color`: UI-Akzentfarbe.
- `requirements`: Liste aus Skillname und benoetigtem Level.
- `questPoints`: Questpunkt-Belohnung, aktuell meist 1-2 Punkte, hoehere Questketten bis 5 Punkte.
- `rapCost`: RAP-Kosten fuer das Freischalten.
- `progressRap`: bereits investierte RAP.
- `status`: `available`, `unlocking` oder `completed`; `locked` wird in der UI aus den Skill-Anforderungen abgeleitet.
- `startedAt` und `completedAt`: Timestamps fuer laufende und abgeschlossene Quests.

Aktuelle Beispielquests:

- First Steps.
- Cook's Assistant.
- Village Gathering.
- Rusted Tools.
- Arcane Runes.
- Hillside Camp.
- Rooftop Route.
- Wild Hunt.
- Relic Recovery.
- Ein Kleiner Gefallen.
- Familiar Contract.
- Sea Voyage.

Aktuelle Quest-Icons existieren fuer:

- First Steps.
- Cook's Assistant.
- Village Gathering.
- Rusted Tools.
- Arcane Runes.

Quest-Fortschritt:

1. Eine Quest ist startbar, wenn alle Skill-Anforderungen erfuellt sind.
2. Beim Tap auf eine startbare Quest wechselt sie auf `unlocking`.
3. Jede aktive Quest verbraucht bis zu 5000 RAP pro Stunde.
4. Mehrere laufende Quests teilen sich bei knapper RAP-Balance proportional den vorhandenen RAP, wie Skill-Unlocks.
5. Wenn RAP auf 0 faellt, bleibt der Teilfortschritt erhalten.
6. Sobald `progressRap >= rapCost`, wird die Quest auf `completed` gesetzt.
7. Beim App-Start wird vergangene Zeit seit `codex-collector-v1-quest-last-tick` nachgerechnet.

## Cloud Save und Account-Plan

Ziel: Fortschritt darf nicht an ein einzelnes Browser-LocalStorage gebunden bleiben. Der Spieler soll sich auf einem anderen Handy oder spaeter in einer nativen App anmelden koennen und denselben Fortschritt sehen.

Empfohlene Richtung fuer den naechsten Architektur-Schritt: Supabase. Die erste technische Basis ist angelegt:

- `src/storage/storageKeys.js`: zentrales Register fuer bestehende lokale Save-Keys.
- `src/storage/jsonStorage.js`: gekapselte JSON-Lese-/Schreibfunktionen fuer lokalen Cache.
- `src/storage/localSave.js`: Snapshot-Load/Write/Export/Import fuer den aktuellen lokalen Spielstand.
- `src/storage/supabaseClient.js`: optionaler Supabase-Client ueber `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY`.
- `src/storage/cloudSave.js`: erste Cloud-Save-Funktionen fuer User-Erkennung, Laden und Upsert von `game_saves`.
- `src/storage/authService.js`: Supabase Auth Wrapper fuer E-Mail/Passwort Login, Signup und Logout.
- `src/storage/accountSession.js`: lokale Account-Credentials und Session fuer den aktuellen Browser, inklusive PBKDF2-Passwort-Hash.
- `supabase/migrations/20260621235000_initial_cloud_save.sql`: erstes Postgres-Schema mit `profiles`, `game_saves`, `activity_events`, `save_events`, `client_sync_state` und RLS-Policies.

Begruendung:

- Postgres passt gut zum Spielstand, weil Skills, Deeds, Logs, Training-State, spaetere Monster/Karten und Events langfristig strukturierte Daten sind.
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

## Icon-Pipeline

Finale Spiel-Icons sollen als generierte Raster-Assets entstehen, nicht als handgebaute SVG-/Code-Platzhalter. Fuer schnelle Layout-Prototypen sind Kuerzel oder einfache Platzhalter erlaubt, aber finale Skill-, Quest-, Unlock-, Item-, Navigations- und Topbar-Stat-Icons sollen mit dem Bildgenerierungstool erstellt, lokal nachbearbeitet und als wiederverwendbare transparente PNGs gespeichert werden.

Grundregeln:

- Zielgroesse fuer finale Icons ist aktuell `128x128` PNG mit transparentem Hintergrund.
- Das Icon-Bild enthaelt nur das Objekt oder Symbol selbst. Badge-Hintergruende, runde beige Flaechen, Statusfarben, Rahmen, Glow und Kachelformen kommen aus CSS/UI.
- Keine eingebrannte Schrift, keine Buchstaben, keine Zahlen und keine UI-Labels im Icon, ausser der Nutzer fordert es ausdruecklich.
- Icons muessen bei kleinen Groessen, etwa 24-32px, lesbar bleiben: klare Silhouette, wenige Details, dunkle Kontur, hoher Kontrast.
- Zusammengehoerige Item-Familien sollen dieselbe Silhouette nutzen und hauptsaechlich ueber Material, Farbe oder kleine Details variieren. Beispiele: Logs, Aexte, Pickaxes, Keys, Runes.
- Generierte Icons sollen stilistisch zu den genehmigten Skill- und Woodcutting-Unlock-Icons passen: Fantasy-RPG, pixel-art-inspiriert, sauber zentriert, einfache lesbare Objekte.
- Vor dem Einbau muessen neue Icons visuell geprueft werden. Wenn sie nicht eindeutig lesbar sind oder stilistisch abweichen, werden sie ersetzt statt im UI zurechtgebogen.

Standard-Prompt-Richtung fuer neue Icons:

```text
Fantasy RPG game icon, pixel-art inspired but polished, single centered object, readable at 32px, strong dark outline, simple high-contrast silhouette, subtle hand-painted shading, no text, no letters, no numbers, no UI badge, no circular background, no frame, no shadow, flat chroma-key background for transparent cutout.
```

Asset-Ablage:

- `public/ui-icons/`: globale UI-, Topbar- und Bottom-Navigation-Icons.
- `public/skill-icons/`: Skill-Icons.
- `public/unlock-icons/<skill>/`: Skill-Unlock- und milestone-nahe Item-Icons.
- `public/quest-icons/`: Quest-Icons.
- `public/item-icons/`: spaetere Inventar-/Drop-/Reward-Icons.

Technischer Ablauf:

1. Icon-Spec definieren: `id`, sichtbarer Name, Kategorie, Motiv, Icon-Familie, Zielordner und Prompt.
2. Mit dem Bildgenerierungstool ein Raster-Icon erzeugen. Fuer transparente Assets zuerst einen flachen Chroma-Key-Hintergrund verwenden.
3. Chroma-Key lokal entfernen und als transparente PNG speichern.
4. Auf `128x128` normalisieren und im passenden `public/...` Ordner ablegen.
5. Im Feature-Datenmodell nur den Asset-Pfad referenzieren; visuelle Hintergruende bleiben CSS.
6. Build, Smoke-Test und bei relevanten UI-Icons visuellen Screenshot pruefen.

## Wahrscheinliche naechste Systeme

- Datenmodell fuer Skills: Level, XP, Kosten, Unlocks und Training-Aktionen. Aktueller Startwert fuer alle Skills ist Level 1/99.
- Skill-Detailseiten mit echten Aktionen, Kosten, Milestones, Unlocks, Rewards und Training Logs fuellen.
- Beastiary-Modul mit Creature-Eintraegen, Drops, Kill Counts, Completion und Mastery.
- Account-weite Punkte-/Ressourcen-Oekonomie fuer Training, Upgrades und Freischaltungen.
- Deeds-Metriken, Diagramme und Auswertungen aus dem Deed Log.
- Bessere Deed-Erstellung mit Bearbeiten/Loeschen, Kategorien und Validierung.
- Gemeinsames Modul-/ContentPanel-System weiter ausbauen, damit neue Subscreens schnell entstehen.
- Placeholder-Slots schrittweise durch echte Module ersetzen.
- Sammlungsscreen mit Kartenraster, Filter, Shiny-Varianten und Duplikaten.
- Deed-Tracking zum Verdienen von RAP.
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
