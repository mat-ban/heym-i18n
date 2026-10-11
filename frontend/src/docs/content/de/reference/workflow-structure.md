# Workflow-Struktur

Workflows werden als JSON mit Knoten und Kanten gespeichert. Siehe [Knotentypen](./node-types.md) für verfügbare Knotentypen und [Ausdrucks-DSL](./expression-dsl.md) für die Ausdruckssyntax in `data`-Feldern.

## Workflow-Objekt

```json
{
  "id": "uuid",
  "name": "My Workflow",
  "description": "Optional description",
  "nodes": [],
  "edges": [],
  "auth_type": "anonymous",
  "allow_anonymous": true
}
```

## Knoten-Objekt

```json
{
  "id": "node-uuid",
  "type": "llm",
  "position": { "x": 100, "y": 200 },
  "data": {
    "label": "llm",
    "model": "gpt-4",
    "userMessage": "$input.text"
  }
}
```

### Agent-Knoten `data` (persistentes Gedächtnis)

[Agent](../nodes/agent-node.md)-Knoten unterstützen einen optionalen Wissensgraphen pro Canvas-Knoten:

| Feld | Typ | Beschreibung |
|-------|------|-------------|
| `persistentMemoryEnabled` | boolean | Wenn `true`, wird der gespeicherte Graph in den System-Prompt geladen und neue Fakten werden nach erfolgreichen Ausführungen zusammengeführt |
| `memoryShares` | array (optional) | Gewährt anderen Agenten Zugriff auf den Gedächtnisgraphen dieses Knotens (`peerWorkflowId`, `peerCanvasNodeId`, `permission`: `read` \| `write`). Siehe [Persistenter Agenten-Speicher](./agent-persistent-memory.md). |

Beispiel:

```json
{
  "id": "agent-main",
  "type": "agent",
  "position": { "x": 200, "y": 120 },
  "data": {
    "label": "assistant",
    "persistentMemoryEnabled": true,
    "credentialId": "uuid",
    "model": "gpt-4o",
    "userMessage": "$input.text",
    "memoryShares": []
  }
}
```

Siehe [Persistenter Agenten-Speicher](./agent-persistent-memory.md) für API-Pfade, Editor-Verhalten und Extraktionssemantik.

## Kanten-Objekt

```json
{
  "id": "edge-uuid",
  "source": "input-node-id",
  "target": "llm-node-id",
  "sourceHandle": null,
  "targetHandle": null
}
```

## Knotentypen

Häufige `type`-Werte: [Input](../nodes/input-node.md) (`textInput`), [Cron](../nodes/cron-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md) (`websocketTrigger`), [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md) (`jsonOutputMapper`), [Wait](../nodes/wait-node.md), [HTTP](../nodes/http-node.md), [WebSocket Send](../nodes/websocket-send-node.md) (`websocketSend`), [Merge](../nodes/merge-node.md), [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md), [Loop](../nodes/loop-node.md) und weitere. Vollständige Liste: [Knotentypen](./node-types.md). Knoten auf derselben Ausführungsebene werden [parallel](./parallel-execution.md) ausgeführt.

## Editor-Layout

Jeder Knoten hat `position.x` und `position.y` für das Desktop-Canvas-Layout. Auf Bildschirmen unterhalb des
768px-Breakpoints ersetzt der Editor das freie Vue Flow-Canvas durch einen bildschirmfüllenden, eingerückten
Workflow-Baum. Der Baum folgt verbundenen Ausführungspfaden, markiert parallele Zweige und verwendet
dieselben Knotenbeschriftungen, Symbole und den neuesten Ausführungsstatus wie der Desktop-Editor.

Tippen Sie auf einen Knoten, um ihn auszuwählen. Wenn ein aufgezeichnetes Ausführungsergebnis vorhanden ist, öffnet sich seine
bildschirmfüllende Detailansicht mit Reitern für Eingabe, Ausgabe und Fehler. Die mobile untere Navigation bietet **Nodes**, **Properties**,
**Run** und **More**; die Kopfzeile behält Aktionen zum Speichern, Verlauf, Suchen, Einstellungen und Teilen bei.
Der Desktop verwendet weiterhin das freie Vue Flow-Canvas und Seitenpanels.

Verwenden Sie **Add node** im mobilen Nodes-Reiter, um die Knotenbibliothek zu durchsuchen. Ein regulärer Knoten öffnet
sofort nach dem Hinzufügen ein Verbindungsblatt: Wählen Sie einen Ankerknoten und platzieren Sie ihn **After**,
**Before** oder als **Parallel**-Zweig. Im Bearbeitungsmodus tippen Sie auf einen vorhandenen regulären Knoten, um dasselbe
Blatt mit seiner aktuellen Verbindung geöffnet zu bekommen. Trigger-Knoten bleiben unabhängig, da sie keine
reguläre Eingabe akzeptieren. Das Bearbeitungssteuerelement bietet außerdem eine Entfernen-Aktion für den ausgewählten Knoten. Ausführungsdetails
enthalten Vorwärts- und Rückwärtspfeile, wenn benachbarte
Knotenergebnisse verfügbar sind. Der AI Assistant öffnet sich über dem mobilen Baum als Bottom Sheet, ohne
den aktiven Editor-Reiter zu ändern.

## Verwandte Themen

- [Knotentypen](./node-types.md) – Alle Knotentypen und Beschreibungen
- [Canvas-Funktionen](./canvas-features.md) – Editor-Funktionen (Data Pin, Ausführungsprotokolle, Aktivieren/Deaktivieren, in Sub-Workflow extrahieren)
- [Download & Import](./download-import.md) – Workflows als JSON exportieren und importieren
- [Agent-Knoten](../nodes/agent-node.md) – `data`-Struktur des Agent-Knotens
- [Persistenter Agenten-Speicher](./agent-persistent-memory.md) – `persistentMemoryEnabled`, `memoryShares` und Memory-Graph-API
- [Ausdrucks-DSL](./expression-dsl.md) – Syntax für `userMessage`, `condition`, `$vars`, `$global` usw.
- [Parallele Ausführung](./parallel-execution.md) – Wie Knoten parallel ausgeführt werden
- [Trigger](./triggers.md) – Startknoten und Einstiegspunkte
- [Workflows-Reiter](../tabs/workflows-tab.md) – Workflows erstellen und verwalten
