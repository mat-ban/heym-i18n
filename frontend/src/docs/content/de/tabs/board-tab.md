# Reiter Board

Der Reiter **Board** ist ein agentenbasiertes Kanban-Board. Aufgaben durchlaufen konfigurierbare Spalten, wobei jede Spalte automatisiert Heym-Workflows ausführen kann. Eine Karte ist nicht nur ein Ticket – sie ist ein persistenter agentenbasierter Auftrag mit vollständigem Kontext, Konversationsverlauf, Ausführungszuständen, Ergebnissen und Workflow-Läufen.

<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>

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

- **Advance cards automatically** in the board settings is on by default. Turn it off for
  a plain team task board: cards then stay in the column people put them in, and column
  workflows still run when a card enters their column.
- You can also manage the board from the [Chat tab](./chat-tab.md) or any MCP client; see
  [From Chat and MCP](#from-chat-and-mcp).

## Card details

Card details open in a wide dialog on desktop and fit the viewport on phones.
Use **Preview** beside **Description** to view Markdown formatting, including unsaved
edits. Choose **Edit** to return to the source text, then **Save description** to keep
your changes. Label chips use brighter text in dark mode; hover over a shortened label
to read its full name.

Open a card to set its **Details**:

- **Assignee** — anyone who can open the board: its owner, and the people and team
  members it is shared with.
- **Priority** — Urgent, High, Medium or Low.
- **Due date** — the card shows it as a chip, amber when it is due today and red when it
  is overdue.
- **Labels** — up to ten short labels, such as a client or a project.

Column workflows receive these fields in the card's `metadata` (`assignee_user_id`,
`priority`, `due_date`, `labels`).

If someone else changes the card while you edit it, saving shows a notice and loads their
version instead of overwriting it. An open board checks for changes made elsewhere (by a
teammate, in Heym Work, from Chat or MCP) every few seconds and redraws.

Moving a card that waits for a review asks first: the move cancels that review. A move
never approves a review; reviews are approved only from the review itself.

## From Chat and MCP

The [Chat tab](./chat-tab.md), Heym Work's chat, and any MCP client through `heym_chat`
can manage boards in plain language, with the same permissions as the Board tab:

- list boards, read a board's columns and cards, and list cards across boards filtered by
  assignee ("my tasks"), column, priority, due date (overdue, today, this week), label or
  review state;
- create a board (Chat turns off automatic advancing for a plain task board), rename it or
  change its settings, and delete it after you confirm its name (owner only). A board Chat
  creates uses the chat's credential and model as its Agentic Kanban Model; ask Chat to
  give its model to one of your boards that has none, such as a board made before this;
- add, rename, reorder and delete columns;
- add, edit, assign, move, reorder and delete cards;
- comment on a card, as you. A comment on a card waiting at the planning step answers its
  agent's questions, and the card moves on, as in the card's own comment box. A comment
  never approves a review.
