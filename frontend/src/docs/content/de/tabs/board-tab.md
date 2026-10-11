# Reiter Board

Der Reiter **Board** ist ein agentenbasiertes Kanban-Board. Aufgaben durchlaufen konfigurierbare Spalten, wobei jede Spalte automatisiert Heym-Workflows ausführen kann. Eine Karte ist nicht nur ein Ticket – sie ist ein persistenter agentenbasierter Auftrag mit vollständigem Kontext, Konversationsverlauf, Ausführungszuständen, Ergebnissen und Workflow-Läufen.

## Boards und Spalten

- Sie können beliebig viele Boards für unterschiedliche Projekte oder Teams anlegen. Ein neues Board startet standardmäßig mit den Spalten **Backlog → Planung → Entwicklung → Erledigt**.
- Jedes Board benötigt ein **Agentic Kanban Model** (hinterlegte Anmeldedaten und ein Sprachmodell). Dies ist zwingend erforderlich, da dieses Modell jede Karte in die Eingabeparameter der auszuführenden Workflows transformiert und deren Rückgaben in lesbaren Text übersetzt.
- Das Zahnrad-Symbol in der Kopfzeile öffnet die Board-Einstellungen: Name, Beschreibung und Modell-Konfiguration.
- Spalten sind flexibel anpassbar: Sie können Spalten hinzufügen, umbenennen, farblich kennzeichnen, umsortieren oder löschen (eine Spalte muss vor dem Löschen leer sein).
- Karten werden innerhalb einer Spalte vertikal nach Priorität sortiert – per Drag & Drop verschiebbar.
- Sie können Karten auch direkt aus dem Reiter [Chat](./chat-tab.md) über natürliche Sprache anlegen.

## Freigabe von Boards

In den Board-Einstellungen können Sie Boards für **Benutzer** (via E-Mail) und für **Teams** mit zwei Berechtigungsstufen freigeben:

- **Lesen (read)** – Das Board und alle Karten sind sichtbar, Änderungen sind jedoch deaktiviert (keine neuen Karten, kein Verschieben, keine Workflows starten).
- **Schreiben (write)** – Voller Zugriff: Karten erstellen, verschieben, kommentieren und Workflows ausführen.
- Nur der **Besitzer** kann Einstellungen, Modell-Zuweisung und Freigaben modifizieren oder das Board löschen.

Workflow-Ketten auf geteilten Boards laufen immer mit den Anmeldedaten des **Besitzers**, sodass Mitarbeiter keine eigenen API-Keys hinterlegen müssen.

## Karten-Anhänge

Öffnen Sie eine Karte und wählen Sie **Datei anhängen**, um Dokumente hinzuzufügen. Anhänge werden im internen [Heym Drive](./drive-tab.md) gespeichert.

Vor jedem Workflow-Lauf werden die Anhänge automatisch nach Typ aufbereitet:

- **Dokumente** (PDF, Markdown, CSV, JSON, TXT) werden zu reinem Text extrahiert (bis zu 20.000 Zeichen pro Datei) und im Feld `text` bereitgestellt.
- **Bilder** werden als URL übergeben, die direkt von Vision-LLM-Knoten geladen werden kann.
- **Sonstige Dateien** werden als Metadaten-Referenz (`name`, `url`, `mime_type`) durchgereicht.

Workflows können auf Anhänge über `$input.card.attachments` zugreifen.

## Spalten-Workflow-Ketten

Jede Spalte kann mit einer geordneten Kette von Workflows verknüpft werden:

1. Beim Verschieben einer Karte in die Spalte startet die Workflow-Kette automatisch im Hintergrund.
2. Die Workflows laufen **sequenziell** ab. Das Ergebnis jedes Workflows wird dem Kontext der Karte hinzugefügt, bevor der nächste Schritt beginnt.
3. Schlägt ein Workflow fehl, bricht die Kette ab: nachfolgende Schritte werden übersprungen und die Karte wird **rot** markiert.
4. Sind alle Schritte erfolgreich, färbt sich die Karte **grün**. Während der Ausführung pulsiert sie **gelb**; wartet ein Schritt auf ein menschliches Review (HITL), wird ein statisches gelbes Signal angezeigt.

Alle Läufe werden im [Ausführungsverlauf](../reference/execution-history.md) mit der Trigger-Quelle `board` protokolliert. Über die Schaltfläche **Live öffnen** können Sie sich direkt in die laufende Ausführung einklinken.

## Datenstruktur für Workflows

Die Spaltenkette übergibt ein standardisiertes JSON-Objekt an den Workflow, abrufbar über DSL-Ausdrücke wie `$input.card.title`:

```json
{
  "triggered_by": "board",
  "rerun": false,
  "card": {
    "id": "...",
    "title": "Launch-Ankündigung verfassen",
    "content": "Entwurf für die Beta-Release-E-Mail erstellen",
    "metadata": { "attachments": [{ "name": "brief.pdf", "url": "..." }] },
    "comments": [{ "author": "user", "content": "...", "created_at": "..." }],
    "history": [{ "kind": "event", "content": "...", "created_at": "..." }],
    "previous_outputs": [{ "workflow_name": "...", "output": {}, "finished_at": "..." }]
  }
}
```

## Verwandte Themen

- [Reiter Workflows](./workflows-tab.md) – Workflows verwalten
- [Agent-Knoten](../nodes/agent-node.md) – Autonome Aufgabenbearbeitung
- [Reiter Drive](./drive-tab.md) – Dateianhänge verwalten
- [Reiter Chat](./chat-tab.md) – Aufgaben per Chat erstellen\n