# Kontextueller Showcase

Die **Kontextbezogene Showcase** ist eine leichtgewichtige In-App-Führungsschiene, die die Seite erklärt, auf der Sie sich gerade befinden, ohne Sie sofort in einen vollständigen Dokumentationsfluss zu drängen.

## Was sie tut

- Zeigt eine kurze Zusammenfassung für die aktuelle Seite
- Hält die erste Ebene prägnant, damit Sie nicht überlastet werden
- Lässt Sie ein kleines Maß an zusätzlichem Detail nur bei Bedarf erweitern
- Verlinkt auf die vollständige Dokumentationsseite für tiefergehende Lektüre

## Wo sie erscheint

In v1 ist die Showcase auf Heyms authentifizierten Hauptoberflächen verfügbar:

- Dashboard-Reiter
- [Evaluierung](../tabs/evals-tab.md)
- [Dokumentation](../getting-started/introduction.md)
- Der Canvas des Workflow-Editors

Öffentliche Seiten wie Login, Registrierung, Chat-Portal und HITL-Review zeigen die Showcase nicht.

## Zugriff

### Desktop

- Ein festes **Page Guide**-Trigger erscheint am rechten Bildschirmrand
- Die Showcase öffnet sich als Drawer auf der rechten Seite
- Sie bleibt standardmäßig geschlossen
- Ein einmaliger Teaser hilft dabei, sichtbar zu machen, dass die Führung existiert, ohne sie zwangsweise zu öffnen

### Mobil

- Derselbe Inhalt ist über eine schwebende **Page Guide**-Schaltfläche verfügbar
- Sie öffnet sich in einem Bottom Sheet statt in einer rechten Schiene

## Inhaltsmodell

Jeder Showcase-Eintrag verwendet eine strukturierte Definition statt einer vollständig benutzerdefinierten Komponente.

- **Titel** – Worum es auf dieser Seite geht
- **Zusammenfassung** – Eine kurze Erklärung
- **Aufzählungspunkte** – Ein paar schnell erfassbare Hinweise
- **Highlights** – Kleine Karten für zentralen Nutzen oder Verwendungsmuster
- **Mehr Detail** – Eingeklappte Abschnitte für zusätzlichen Kontext
- **Aktionen** – Normalerweise ein oder zwei Links, meistens zur vollständigen Dokumentation

Dies hält das System flexibel und vermeidet lange, unübersichtliche Hilfe-Panels.

## Kontextbewusstsein

Die Showcase ändert sich mit der aktuellen Oberfläche.

- Dashboard-Reiter haben jeweils ihre eigene Zusammenfassung
- Der Editor verweist auf [Canvas-Funktionen](./canvas-features.md)
- Die Docs-Seite verwendet eine generische Docs-Übersicht und verweist, wenn möglich, auf den aktuellen Artikel, den Sie bereits geöffnet haben

## Persistenz

Die Showcase speichert ein kleines Maß an persönlichem UI-Zustand im Browser-Speicher:

- Ob das Panel oder Sheet zuletzt geöffnet war
- Welche Seitenkontexte den Teaser bereits gezeigt haben
- Der zuletzt erweiterte Detailabschnitt pro Kontext

## Warum sie existiert

Das Ziel ist es, Heym leichter erlernbar zu machen, ohne mehr schwerfälliges UI-Chrome hinzuzufügen.

- Kurze, stets nahe Führung zur Orientierung
- Klarer Pfad zu tiefergehender Dokumentation
- Geringe Unterbrechung für erfahrene Benutzer

## Verwandtes

- [Workflows-Reiter](../tabs/workflows-tab.md) – Haupt-Dashboard-Oberfläche
- [Evaluierung-Reiter](../tabs/evals-tab.md) – Evaluierungs-Workflows
- [Canvas-Funktionen](./canvas-features.md) – Editor-Verhalten und Debugging
- [Quick Drawer](./quick-drawer.md) – Die andere feste rechte Utility-Oberfläche
