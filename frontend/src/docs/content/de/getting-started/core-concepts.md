# Kernkonzepte

## Workflows

Ein Workflow ist ein gerichteter Graph aus [**Knoten**](../reference/node-types.md), die durch **Kanten** verbunden sind. Verwalten Sie Workflows im Reiter [Workflows](../tabs/workflows-tab.md) und organisieren Sie diese in [Ordnern](../reference/workflow-organization.md). Die Ausführung fließt von [Trigger-Knoten](../reference/triggers.md) ([Eingabe](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) über Verarbeitungsknoten bis zu den [Ausgabe-Knoten](../nodes/output-node.md). Siehe [Workflow-Struktur](../reference/workflow-structure.md) für das JSON-Format. Speichern und teilen Sie Workflows als [Vorlagen](../tabs/templates-tab.md), um sie projektübergreifend wiederzuverwenden. Workflows können auch über das [Board](../tabs/board-tab.md) ausgeführt werden, wo Kanban-Karten die Workflow-Kette einer Spalte mit dem gesamten Kartenkontext anstoßen.

## Knoten

Jeder Knoten besitzt:

- **Typ** – Bestimmt das Verhalten (z. B. `llm`, `condition`, `http`)
- **Daten** – Konfiguration (Modell, Prompt, URL etc.)
- **Ein-/Ausgänge** – Verbindungspunkte (Handles) zur Verknüpfung mit anderen Knoten

Siehe [Knotentypen](../reference/node-types.md) für die vollständige Übersicht.

## Kanten

Kanten verbinden den Ausgang eines Quellknotens mit dem Eingang eines Zielknotens. Während der Ausführung fließen Daten entlang dieser Kanten.

## Ausführungsfluss

1. **Trigger** – Ein Eingabe-, Cron-, Telegram Trigger-, Discord Trigger-, IMAP Trigger- oder [WebSocket Trigger-Knoten](../nodes/websocket-trigger-node.md) startet die Ausführung (siehe [Trigger](../reference/triggers.md))
2. **Nachgelagert** – Jeder Knoten erhält die Ausgaben verbundener Vorgängerknoten; [parallele Ausführung](../reference/parallel-execution.md) führt unabhängige Knoten gleichzeitig aus
3. **Ausdrücke** – Knoten referenzieren vorgelagerte Daten über `$nodeLabel.field`. Siehe [Ausdrucks-DSL](../reference/expression-dsl.md).
4. **Ausgabe** – Der [Ausgabe-Knoten](../nodes/output-node.md) erzeugt das finale Ergebnis

## Ausdrucks-Referenzen

Verwenden Sie `$input` für die Daten des Eingabe-Knotens und `$nodeLabel.field` für jeden vorgelagerten Knoten. Beispiel: `$llm.text` referenziert das Feld `text` eines Knotens mit der Bezeichnung „llm“. Die vollständige Syntax finden Sie unter [Ausdrucks-DSL](../reference/expression-dsl.md). Nutzen Sie den [Ausdrucksauswertungs-Dialog](../reference/expression-evaluation-dialog.md) für einen größeren Editor mit Live-Backend-Vorschau beim Bearbeiten von Ausdrücken.

## Verwandte Themen

- [Schnellstart](./quick-start.md) – Erstellen Sie Ihren ersten Workflow
- [Canvas-Funktionen](../reference/canvas-features.md) – Daten anheften, Ausführungsprotokolle, aktivieren/deaktivieren, in Sub-Workflow extrahieren
- [KI-Assistent](../reference/ai-assistant.md) – Workflows in natürlicher Sprache erstellen
- [Knotentypen](../reference/node-types.md) – Alle verfügbaren Knoten
- [Ausdrucks-DSL](../reference/expression-dsl.md) – Daten in Ausdrücken referenzieren
- [Ausdrucksauswertungs-Dialog](../reference/expression-evaluation-dialog.md) – Erweiterter Editor mit Live-Backend-Vorschau
- [Reiter Workflows](../tabs/workflows-tab.md) – Workflows und Ordner verwalten
- [Workflow-Organisation](../reference/workflow-organization.md) – Ordner und geplantes Löschen
- [Trigger](../reference/triggers.md) – Einstiegspunkte für Workflows
- [Webhooks](../reference/webhooks.md) – HTTP-Webhook-Trigger (TTL, Cache, Rate-Limit)
- [Parallele Ausführung](../reference/parallel-execution.md) – Parallele Ausführung von Knoten
