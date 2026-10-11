# Parallele Ausführung

Heym führt Knoten parallel aus, wenn sie keine Abhängigkeiten voneinander haben, und ermöglicht die gleichzeitige Ausführung mehrerer Workflow-Läufe.

## Innerhalb eines einzelnen Laufs

### DAG-basierte Planung

Der Executor gruppiert Knoten nach **Ausführungsebene** mithilfe eines gerichteten azyklischen Graphen (DAG):

1. **Ebene 0** – Knoten ohne eingehende Kanten (Startknoten)
2. **Ebene N** – Knoten, deren vorgelagerte Abhängigkeiten alle in den Ebenen 0..N-1 liegen

Knoten auf derselben Ebene haben keine Abhängigkeiten voneinander und werden parallel ausgeführt.

### Thread-Pool

- **Gemeinsamer Pool**: `ThreadPoolExecutor(max_workers=8)` für die Knotenausführung
- **Planung**: `wait(..., return_when=FIRST_COMPLETED)` – sobald ein Knoten abgeschlossen ist, werden nachgelagerte Knoten geplant
- **Thread-sicher**: Knotenausgaben werden mit einem Lock gespeichert (`store_node_output`)

### Orchestrator-Sub-Agenten

Wenn ein Orchestrator-Agent mehrere `call_sub_agent`-Tool-Aufrufe in einem Durchgang zurückgibt, werden diese parallel ausgeführt. Siehe [Agent-Architektur](./agent-architecture.md).

### Merge-Knoten

Der [Merge](../nodes/merge-node.md)-Knoten kombiniert Ausgaben aus mehreren parallelen Zweigen. Verwende ihn, wenn du Ergebnisse explizit zusammenführen musst; andernfalls können parallele Zweige in separaten Ausgabe-Knoten enden.

### Schleifen

Schleifen-Iterationen werden **sequenziell** ausgeführt. Die Knoten im Schleifenkörper werden pro Iteration neu geplant.

### Vorzeitige Rückgabe

Ausgabe-Knoten mit `allowDownstream` können vorzeitig zurückgeben. Verbleibende nachgelagerte Arbeit wird im Hintergrund ausgeführt.

## Gleichzeitige Workflow-Läufe

- **Kein Lock pro Workflow** – Mehrere Anfragen können denselben Workflow gleichzeitig ausführen
- **Async-API** – FastAPI-Endpoints verwenden `asyncio.to_thread(execute_workflow)`, damit die Event-Loop reaktionsfähig bleibt
- **Isolation** – Jeder Lauf erhält seine eigene `WorkflowExecutor`-Instanz und seinen eigenen Zustand

Trigger, die Workflows ausführen ([Webhook](./webhooks.md), [Portal](./portal.md), [Cron](./triggers.md), RabbitMQ, MCP, Editor), rufen jeweils `execute_workflow` unabhängig auf.

## Streaming

Streaming verwendet dasselbe parallele Modell, gibt jedoch Ereignisse aus, sobald Knoten abgeschlossen sind. Die Editor- und Portal-Chat-UI verwenden Streaming intern für Echtzeit-Fortschritt, und Webhook-Nutzer können jetzt denselben Ereignisstrom über den [SSE-Streaming](./sse-streaming.md)-Execute-Endpoint nutzen.

## Verwandte Themen

- [Warum Heym](../getting-started/why-heym.md) – Parallele DAG-Ausführung in der Heym-Runtime
- [Workflow-Struktur](./workflow-structure.md) – Knoten, Kanten und Ausführungsfluss
- [Kernkonzepte](../getting-started/core-concepts.md) – Überblick über den Ausführungsfluss
- [Knotentypen](./node-types.md) – [Merge](../nodes/merge-node.md)-Knoten und andere Typen
- [Trigger](./triggers.md) – Einstiegspunkte, die Läufe auslösen
- [SSE-Streaming](./sse-streaming.md) – Ereignisstromformat für `/execute/stream`
