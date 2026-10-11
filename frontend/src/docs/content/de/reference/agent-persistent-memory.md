# Persistenter Agenten-Speicher

Agent-Knoten können einen **pro-Knoten-Wissensgraphen** in der Datenbank speichern: Entitäten (mit Typen und Eigenschaften) und Beziehungen zwischen ihnen. Wenn aktiviert, **injiziert Heym bei jedem Lauf eine Zusammenfassung dieses Graphen in den System-Prompt** (sofern der Graph nicht leer ist). Nach einem erfolgreichen Lauf führt ein **LLM-Extraktionsjob** im Hintergrund neue Fakten aus der Konversation in den Graphen zusammen.

Sub-Agents und Orchestratoren verwenden standardmäßig jeweils den Graphen, der an **ihren eigenen Canvas-Knoten** gebunden ist. Du kannst anderen Agents außerdem **Lese- oder Lese-/Schreibzugriff** auf den Graphen dieses Knotens gewähren (einschließlich Agents in **anderen Workflows**, die dir gehören) – siehe [Freigabe für andere Agents](#freigabe-für-andere-agents).

## Aktivierung

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Wenn `true`, wird der Graph dieses Knotens in den System-Prompt geladen und die Extraktion nach dem Lauf für den Graphen dieses Knotens geplant |
| `memoryShares` | array (optional) | Gewährt anderen Agent-Knoten Zugriff auf den Gedächtnisgraphen **dieses** Knotens; siehe [Freigabe](#freigabe-für-andere-agents) |

Aktiviere es in den Eigenschaften des Agent-Knotens (**Persistent memory (graph)**). Ein pinkes **Gehirn**-Symbol am Knoten öffnet den Graph-Editor, wenn das Gedächtnis aktiviert ist (oder wenn ein Modell angezeigt wird).

## Graph-Editor

Der Dialog stellt Entitäten als animierten, kräftebasierten Graphen dar – farbige Kreise, deren Größe sich nach der Anzahl der Verbindungen richtet und die nach Entitätstyp gruppiert sind – sowie Bearbeitungs- und Navigationsfunktionen (Ansicht einpassen, Layout aufräumen, Tastaturkürzel). Du kannst Knoten und Kanten manuell **hinzufügen, bearbeiten oder löschen**; die Source/Target-Beziehungsauswahl ist für Graphen mit vielen Entitäten durchsuchbar. Die Auswahl eines Knotens zeigt seine ausgehenden und eingehenden Verbindungen, von denen jede angeklickt werden kann, um zu diesem Knoten zu springen. Änderungen gelten nur für den Graphen **dieses** Agents (der Graph für den Canvas-Knoten, dessen Gehirn du geöffnet hast).

## Freigabe für andere Agents

Im Gedächtnisgraph-Dialog kannst du über **Share memory with other agents** **Peers** anhängen, die diesen Graphen zur Laufzeit konsumieren dürfen:

1. Wähle einen **Workflow** (jeden Workflow, den du im Editor öffnen kannst).
2. Wähle einen **Agent**-Knoten in diesem Workflow.
3. Lege **Read only** oder **Read & write** fest.

| Berechtigung | Wirkung |
|------------|--------|
| Read only | Wenn der **Peer**-Agent läuft, wird dieser Graph in den System-Prompt des Peers eingefügt (sofern er Entitäten enthält). Keine Extraktion in diesen Graphen aus dem Lauf des Peers. |
| Read & write | Gleiches Prompt-Verhalten wie bei read, und nach einem **erfolgreichen** Abschluss des Peers kann die übliche Gedächtnisextraktion auch **in diesen (Eigentümer-)Graphen** unter Verwendung der Anmeldedaten des Peer-Laufs **zusammenführen**. |

Peers werden pro Eigentümer-Knoten als `memoryShares`-Einträge mit `peerWorkflowId` und `peerCanvasNodeId` (und `permission`) gespeichert. Ältere Workflows lassen `peerWorkflowId` für Peers im **selben** Workflow möglicherweise weg; der Editor behandelt dies als den aktuellen Workflow.

**Workflow-übergreifende Freigabe** wird zur Laufzeit aufgelöst, indem Workflows durchsucht werden, **die dir gehören**. Läufe ohne authentifizierten Benutzerkontext lösen nur Freigaben auf, die im JSON des **aktuellen** Workflows (gleicher Canvas) definiert sind.

## Laufzeitverhalten

### Eigener Graph (`persistentMemoryEnabled`)

1. **Vor dem LLM-Aufruf** – Wenn der Graph Entitäten enthält, wird ein Block an die Systemanweisung angehängt, der erklärt, dass dies Fakten aus früheren Läufen sind (möglicherweise unvollständig; bei Konflikten gewinnt die aktuelle Benutzernachricht).
2. **Nach einem erfolgreichen Abschluss** – Ein Hintergrundjob fragt das Modell (mit denselben Anmeldedaten wie der Agent-Lauf) nach strukturiertem JSON (Entitäten + Beziehungen). Diese Payload wird in die Datenbank zusammengeführt (Deduplizierung und Beziehungsbereinigung gelten für einige Typen, z. B. Kanten im Beschäftigungsstil).

### Peer, der freigegebene Graphen empfängt

Wenn ein Agent läuft, findet das System **Eigentümer**-Knoten (in jedem deiner Workflows, sofern möglich), deren `memoryShares` auf den Workflow und Canvas-Knoten dieses Laufs verweisen. Für jede Übereinstimmung wird der Graph dieses Eigentümers als **shared memory**-Abschnitt in den System-Prompt eingefügt. **Read & write**-Peers planen zusätzlich Extraktionsziele für den **Eigentümer**-Workflow/-Graphen, wenn der Lauf erfolgreich ist.

Die Extraktion läuft **nicht**, wenn der Lauf fehlschlägt oder in einem HITL-Wartezustand endet.

## Workflow-JSON (`data`-Feld)

Wird wie andere Einstellungen am Agent-Knoten persistiert:

```json
{
  "type": "agent",
  "data": {
    "label": "supportAgent",
    "persistentMemoryEnabled": true,
    "userMessage": "$input.text",
    "memoryShares": [
      {
        "peerWorkflowId": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        "peerCanvasNodeId": "agent-peer-canvas-id",
        "permission": "read"
      }
    ]
  }
}
```

`permission` ist `"read"` oder `"write"`. Lass `memoryShares` weg oder verwende `[]`, wenn keine Freigabe erfolgt.

Siehe [Workflow-Struktur](./workflow-structure.md) für die vollständige Form des Knotenobjekts.

## Verwandtes

- [Agent-Knoten](../nodes/agent-node.md) — Vollständige Agent-Konfiguration
- [Agenten-Architektur](./agent-architecture.md) — Orchestrator, Sub-Agents, Tools
- [Workflow-Struktur](./workflow-structure.md) — JSON-Workflow-Format
- [Canvas-Funktionen](./canvas-features.md) — Gehirn-Steuerelement und Graph-Dialog
- [Reiter Ausführungen](../tabs/traces-tab.md) — LLM-Anfrage-/Antwort-Observability
