# Quick Drawer

Der **Quick Drawer** ist ein rechtsseitiges Schnellausführungs-Panel für Workflows. Es erscheint auf authentifizierten Seiten wie dem Dashboard-[Workflows-Reiter](../tabs/workflows-tab.md), Docs und Evaluierung.

## Zugriff

- Klicke auf den fixierten **Quick / Workflows**-Trigger am rechten mittleren Rand des Bildschirms
- Wenn das [Kontextueller Showcase](./contextual-showcase.md) ebenfalls verfügbar ist, sitzt dessen **Page Guide**-Trigger oberhalb von Quick Workflows
- Der Drawer öffnet sich von rechts und verschiebt die aktuelle Seite mit einer dezenten Skalierung nach links
- Auf Mobilgeräten ist der Quick Drawer ausgeblendet
- Der Drawer wird nicht im Workflow-Editor, bei Login/Registrierung, im Portal oder auf HITL-Review-Seiten angezeigt

## Workflow-Suche

Verwende das Filterfeld oben im Drawer, um Workflows zu suchen nach:

- Workflow-Name
- Workflow-Beschreibung

Die Suche ist unabhängig von Groß-/Kleinschreibung und aktualisiert die Liste sofort.

## Angepinnte Workflows

Pinnen Sie Workflows an, um sie oben im Drawer zu halten.

- Angepinnte Workflows erscheinen in einem eigenen Abschnitt oberhalb der vollständigen Liste
- Neue Pins werden oben hinzugefügt
- Die Pin-Reihenfolge bleibt über Neuladevorgänge hinweg im Browser-Speicher erhalten

## Workflows ausführen

Wähle einen Workflow aus, um dessen Eingabeformular zu öffnen.

- Eingabefelder werden vertikal in der Reihenfolge des Drawers angezeigt
- Klicke auf **Run Workflow**, um den ausgewählten Workflow auszuführen
- Klicke auf **Stop Workflow**, um eine laufende Ausführung aus dem Drawer abzubrechen
- Workflows ohne Eingabefelder können weiterhin direkt ausgeführt werden
- Ein Workflow, der mit einem [File Upload Trigger](../nodes/file-upload-trigger-node.md) beginnt, zeigt stattdessen eine Dropzone an: Ziehe eine Datei hinein oder klicke, um eine auszuwählen. Die Zone listet die vom Trigger akzeptierten Dateitypen und -größen auf und lehnt andere Dateien vor dem Hochladen ab. **Run Workflow** bleibt deaktiviert, bis eine Datei ausgewählt wurde.

Der Drawer verwendet dieselbe Workflow-Ausführungs-API wie andere Heym-Ausführungsoberflächen, sodass Ausgaben und Laufzeitverhalten konsistent bleiben.

Das Stoppen eines Laufs aus dem Drawer bricht auch die aktive Backend-Ausführung ab, einschließlich eines laufenden Playwright-Browser-Jobs für diesen Workflow-Lauf.

## Fortschritt und Ergebnisse

Nach dem Start eines Laufs zeigt der Drawer:

- Streaming-Schrittfortschritt für Knoten, während sie starten und abgeschlossen werden
- Endstatus: `success`, `error` oder `pending`
- Finale Ausgaben in einem kompakten JSON-Panel
- Verlaufseinträge mit dem Tag `Quick Drawer`

`pending` bedeutet, dass der Workflow auf eine spätere Aktion wie eine menschliche Überprüfung wartet.

Quick-Drawer-Läufe sind Produktionsausführungen, sodass ein Workflow mit einem [Gleichzeitigkeitslimit](./webhooks.md#concurrency-limit-and-queued-runs) sie warten lassen kann. Während der Lauf in der Warteschlange steht, lautet der Status **Waiting in queue (2/5)**; er wechselt zu "running", wenn der Lauf startet, und zeigt das Ergebnis an, wenn er endet, ohne schrittweisen Fortschritt. Ein Lauf, der in der Warteschlange abgelaufen ist oder während des Wartens abgebrochen wurde, endet als `error`.

Ein Dateilauf erfolgt über den einmalig verwendbaren Upload-Link des Triggers: Der Drawer fordert vom Workflow einen Link an, lädt die Datei dorthin hoch und zeigt das Ergebnis an, sobald der Upload abgeschlossen ist. Dateiläufe zeigen den Endstatus und die Ausgaben, jedoch keinen schrittweisen Fortschritt, und werden im Verlauf ebenfalls mit `Quick Drawer` markiert. Die ausgewählte Datei wird nach jedem Lauf zurückgesetzt, da ein Link nur für eine Datei gilt.

## Browser-Speicher

Der Quick Drawer speichert persönliche Einstellungen in `localStorage`:

- Angepinnte Workflow-IDs
- Zuletzt ausgewählter Workflow

Der Drawer speichert in dieser Version **keine** Eingabewerte.

## Umfang

Der Quick Drawer ist bewusst eine leichtgewichtige Ausführungsoberfläche.

- Enthalten: Suche, Anpinnen, Auswahl, Eingabe (einschließlich einer Datei), Ausführen, Fortschritt, Ergebnis
- Ausgeschlossen: Workflow-Erstellung, Bearbeitung, Ordnerverwaltung und Canvas-Aktionen

## Verwandte Themen

- [Workflows-Reiter](../tabs/workflows-tab.md) – Haupt-Workflow-Liste, Ordner und Verwaltung
- [Schnellstart](../getting-started/quick-start.md) – Erstelle und führe deinen ersten Workflow aus
- [Ausführungsverlauf](./execution-history.md) – Vergangene Läufe überprüfen
- [Webhooks](./webhooks.md) – Workflows über HTTP auslösen
- [Kontextueller Showcase](./contextual-showcase.md) – Seitenbezogene Anleitungsschiene, die den Quick Drawer ergänzt
