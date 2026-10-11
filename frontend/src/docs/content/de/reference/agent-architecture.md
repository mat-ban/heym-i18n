# Agenten-Architektur

Der [Agent-Knoten](../nodes/agent-node.md) unterstützt Sub-Agents, Sub-Workflows, Canvas-Knoten-Tools, ein Orchestrator-Muster, Skills, MCP-Verbindungen, Tool-Aufrufe, optionalen [persistenten Speicher](./agent-persistent-memory.md) (pro Canvas-Knoten, mit optionaler Freigabe für andere Agents) und optionales [menschliches Review](./human-in-the-loop.md). Diese Seite beschreibt die Architektur.

## Sub-Agents

Sub-Agents sind Agent-Knoten, die ein Orchestrator über das Tool `call_sub_agent` aufrufen kann.

- **Orchestrator**: `isOrchestrator: true`, `subAgentLabels: ["researchAgent", "summarizerAgent"]`
- **Sub-Agents**: Müssen `$input.text` in ihrer User Message verwenden, damit sie den Prompt des Orchestrators erhalten
- **Tool**: `call_sub_agent` mit `sub_agent_label` (Enum) und `prompt`
- **Tiefenbegrenzung**: Maximal 5 verschachtelte Sub-Agent-Aufrufe

### Ausführungsablauf

1. Der Orchestrator entscheidet, einen Sub-Agent aufzurufen
2. `_execute_sub_agent_tool` findet den Ziel-Agent anhand des Labels
3. Baut `synthetic_inputs = {"input": {"text": prompt}}`
4. Führt `_execute_agent_node` für den Sub-Agent aus
5. Das Ergebnis wird an den Orchestrator zurückgegeben

### Parallele Sub-Agent-Ausführung

Wenn der Orchestrator mehrere `call_sub_agent`-Tool-Aufrufe in einem einzigen Turn zurückgibt, werden diese **parallel** ausgeführt. Wenn der Benutzer beispielsweise nach „Paris" fragt und der Orchestrator sowohl `distanceAgent` als auch `foodAgent` aufruft, laufen beide gleichzeitig statt sequenziell.

- **Vorteil**: Die Gesamtzeit entspricht ungefähr dem langsamsten Sub-Agent, nicht der Summe aller.
- **Hinweis**: Ermutige den Orchestrator, mehrere Sub-Agents in einem Turn aufzurufen, wenn die Aufgabe dies erfordert.

## Sub-Workflows

Wenn `subWorkflowIds` konfiguriert ist, kann der Agent andere Workflows über das Tool `call_sub_workflow` aufrufen.

- **Konfiguration**: `subWorkflowIds: ["workflow-uuid-1", "workflow-uuid-2"]`
- **Tool**: `call_sub_workflow` mit `workflow_id` (Enum) und `inputs` (Objekt)
- **Tiefenbegrenzung**: Maximal 5 verschachtelte Sub-Workflow-Aufrufe

### Ausführungsablauf

1. Der Agent entscheidet, einen Sub-Workflow aufzurufen
2. `_execute_sub_workflow_tool` ruft den Workflow aus dem `workflow_cache` ab
3. Baut `enriched_inputs = {"headers": {}, "query": {}, "body": inputs}`
4. Führt `WorkflowExecutor.execute()` für den Sub-Workflow aus
5. Das Ergebnis wird an den Agent zurückgegeben

Sub-Workflows können in v1 nicht für HITL pausieren. Wenn ein verschachtelter Sub-Workflow versucht, in einen ausstehenden Review-Zustand einzutreten, schlägt die Ausführung fehl, anstatt innerhalb des verschachtelten Aufrufs zu suspendieren.

## Canvas-Knoten-Tools

Canvas-Knoten-Tools sind Workflow-Knoten, die über den `tool-input`-Handle mit einem Agent verbunden sind. Während der Agent-Einrichtung durchsucht `_build_node_tool_schemas` diese Kanten und fügt ein OpenAI-kompatibles Tool-Schema pro verbundenem Knoten hinzu.

- **Tool-Quelle**: `_source: "node_tool"`
- **Tool-Name**: abgeleitet vom Label des verbundenen Knotens, mit Suffixen bei Duplikaten
- **Tool-Parameter**: aufgebaut aus den `agentProvidedFields` des Knotens
- **Feste Felder**: Alle Knotenfelder, die nicht in `agentProvidedFields` aufgeführt sind, bleiben in der Knotenkonfiguration

### Ausführungsablauf

1. Der Agent entscheidet, ein verbundenes Knoten-Tool aufzurufen
2. `_execute_node_tool` kopiert die Knotendaten
3. Vom Agent bereitgestellte Argumente werden in die konfigurierten Knotenfelder eingefügt
4. `execute_node` führt diesen Knoten einmal mit deaktivierter Branch-Planung aus
5. Die ursprünglichen Knotendaten werden wiederhergestellt
6. Die Knotenausgabe wird dem Agent als Tool-Ergebnis zurückgegeben

Tool-Knoten werden von der normalen Workflow-Planung ausgeschlossen, damit sie nicht zweimal ausgeführt werden. Sie werden nur über den Tool-Aufrufpfad des Agents ausgeführt.

## Human-in-the-Loop

Wenn `hitlEnabled` auf einem Agent gesetzt ist, erhält der Agent ein Tool `request_human_review`, das er an bestimmten Genehmigungs-Checkpoints aufrufen kann.

1. Der System-Prompt und die HITL-Richtlinien des Knotens teilen dem Agent mit, welche Aktionen eine Genehmigung erfordern
2. Wenn der Agent einen dieser Schritte erreicht, ruft er `request_human_review` auf
3. Heym speichert einen Workflow-Ausführungs-Snapshot und erstellt eine öffentliche Review-Anfrage
4. Das Knotenergebnis wird mit einer Review-URL als `pending` markiert
5. Der `review`-Ausgabe-Handle des Agents wird sofort geplant, damit Benachrichtigungs-Branches mit dem ausstehenden Payload ausgeführt werden können
6. Die Planung der Hauptausführung stoppt, bis der Reviewer antwortet
7. Bei `accept`, `edit` oder `refuse` wird der Executor aus dem gespeicherten Snapshot neu aufgebaut
8. Der pausierte Agent fährt mit dem genehmigten Review-Kontext fort oder beendet sich bei `refuse` sofort
9. Nachgelagerte Knoten fahren fort, nachdem der fortgesetzte Agent fertig ist, ohne den `review`-Branch erneut auszuführen
10. Wenn eine spätere Aktion ebenfalls eine Genehmigung erfordert, kann der Agent in derselben Ausführung einen weiteren HITL-Checkpoint erstellen

Die für den Reviewer sichtbare Zusammenfassung wird aus der Review-Anfrage selbst generiert, sodass das Knotenfeld auf die Genehmigungsrichtlinie und das Timing fokussiert bleiben kann.

Dadurch können Agent-Workflows auf eine externe Genehmigung warten, während der Konversationsverlauf, abgeschlossene Knotenausgaben, der Loop-Zustand und anderer Laufzeitkontext erhalten bleiben.

## Orchestrator-Tool-Executor

Der benutzerdefinierte Tool-Executor leitet weiter:

- **Sub-Agent-Aufrufe** (`_source == "sub_agent"`) → `_execute_sub_agent_tool`
- **Sub-Workflow-Aufrufe** (`_source == "sub_workflow"`) → `_execute_sub_workflow_tool`
- **Canvas-Knoten-Tools** (`_source == "node_tool"`) → `_execute_node_tool`
- **Menschliches Review** (`_source == "hitl"`) → erstellt einen ausstehenden HITL-Checkpoint
- **Andere Tools** → `_unified_tool_executor` (Python, MCP, Skill-Tools)

Er wird verwendet, wenn HITL aktiviert ist, wenn `isOrchestrator` mit `subAgentLabels` gesetzt ist oder wenn `subWorkflowIds` konfiguriert ist.

## Skills

Skills erweitern den Systemkontext des Agents und können Python-Tools hinzufügen.

- **Struktur**: `AgentSkill` = `{ id, name, content, files?, timeoutSeconds? }`
- **Inhalt**: Wird der Systemanweisung vorangestellt (verbunden mit `---`)
- **Python-Tools**: Für jeden Skill mit `.py`-Dateien wird ein Tool `skill_{skill_name}` hinzugefügt
- **Ausführung**: `skill_python_executor.py` führt Skripte mit `uv run python` in einem temporären Verzeichnis aus; Argumente als JSON auf stdin, Ergebnis als JSON auf stdout

Skills können hinzugefügt werden, indem eine `.zip`- oder `.md`-Datei auf den Skills-Bereich in der Konfiguration des [Agent-Knotens](../nodes/agent-node.md) gezogen wird.
## MCP Client

Der MCP-Client (Model Context Protocol) verbindet sich mit externen Tool-Servern.

- **Transports**: `stdio` (command + args) oder `sse` (url + headers)
- **Tools auflisten**: `list_mcp_tools` → `ClientSession.list_tools()` → konvertiert in das OpenAI-Funktionsformat mit `_source: "mcp"`
- **Ausführen**: `execute_mcp_tool` → `ClientSession.call_tool()` → Ergebnis über `_extract_tool_result`

Konfiguriere MCP-Verbindungen im [MCP-Reiter](../tabs/mcp-tab.md) oder über die `mcpConnections` des Agent-Knotens.

## Tool Calling

Der LLM-Service führt eine `execute_with_tools`-Schleife aus:

1. **Kontextkomprimierungs-Prüfung** — vor jeder Iteration wird die Token-Nutzung geschätzt und bei Bedarf komprimiert (siehe unten)
2. Das Modell mit `tools` und `tool_choice: "auto"` aufrufen
3. Falls `tool_calls` vorhanden sind: für jeden Aufruf `tool_executor(tool_def, name, args, timeout)` ausführen
4. Tool-Ergebnis an die Nachrichten anhängen, wiederholen
5. Stoppen, wenn keine weiteren Tool-Aufrufe mehr erfolgen oder `max_tool_iterations` erreicht ist

### Tool-Dispatch

`_unified_tool_executor` leitet anhand von `_source` weiter:

| Source | Handler |
|--------|---------|
| `mcp` | `execute_mcp_tool` |
| `skill` | `execute_skill_python` |
| (Standard) | `execute_tool` (Python-Code-Tools) |

Tools verwenden das OpenAI-Funktionsaufruf-Format: `name`, `description`, `parameters` (JSON-Schema).

## Kontextkomprimierung

Um einen Kontextüberlauf bei lang laufenden Agenten zu verhindern, komprimiert Heym automatisch die angesammelte `messages`-Liste vor jeder Tool-Iteration.

### Algorithmus

1. **Token schätzen**: `total_chars / 4` über alle Nachrichten hinweg (schnell, kein Tokenizer erforderlich)
2. **Schwellenwert-Prüfung**: falls `estimated_tokens < context_limit × 0.80`, Komprimierung überspringen
3. **Kontextlimit**: versuche `client.models.retrieve(model).context_window`; andernfalls Rückgriff auf eine integrierte Tabelle (`gpt-4o` → 128K, `claude-3-5-sonnet` → 200K, `gemini-2.0-flash` → 1M usw.); Standard 128K
4. **Anker-Erhaltung**: immer behalten
   - Erste `system`-Nachricht (Agent-Identität und Anweisungen)
   - Erste `user`-Nachricht (ursprüngliche Aufgabe)
   - Letzte `user`-Nachricht (aktuellste Anweisung)
5. **Mitte zusammenfassen**: alles zwischen der ersten und letzten user-Nachricht wird serialisiert und mit einem Zusammenfassungs-Prompt an dasselbe Modell gesendet
6. **Neu aufbauen**: `[system, first_user, assistant(summary), last_user]`

Die Komprimierung wird übersprungen, wenn weniger als 2 unterschiedliche user-Nachrichten vorhanden sind (keine Mitte zum Zusammenfassen) oder wenn der LLM-Zusammenfassungsaufruf fehlschlägt (sicherer Fallback: ursprüngliche Nachrichten zurückgeben).

### Observability

Jedes Komprimierungsereignis wird aufgezeichnet als:
- Ein `_context_compression`-Eintrag in `tool_calls_collected` → sichtbar im Ausführungsverlauf im Run-Detail
- Ein `on_tool_call`-Ereignis mit `phase: "compression"` → im Debug-Panel dargestellt als `Context compressed (N messages → summary)`
- Ein `context.compression`-LLM-Trace-Eintrag → sichtbar im Traces-Reiter mit Token-Schätzungen vor/nach der Komprimierung

Agent-Tool-Aufrufe erzeugen zudem eine umfangreichere Observability:

- Pro-Aufruf-Lebenszyklus-Felder auf `tool_calls`: `tool_call_id`, `status` (`success` / `error` / `pending` / `timeout` / `cancelled`), `started_at`, `finished_at`, `elapsed_ms`
- Aggregierte `tool_metrics` im Agent-Ergebnis (Anzahlen nach Status plus Gesamt-/Maximaldauer); `_context_compression`-Einträge werden aus diesen Zählungen ausgeschlossen
- Opt-in OpenTelemetry-Child-Spans mit dem Namen `heym.agent.tool.execute` (siehe [OpenTelemetry Tracing](./opentelemetry.md))
- Persistierte LLM-Trace-/Ausführungsverlauf-`tool_calls`-Payloads werden redigiert und in der Größe begrenzt; der Live-HITL-Resume-Zustand behält die Originale für den Abgleich

## Verwandte Themen

- [Warum Heym](../getting-started/why-heym.md) – Multi-Agent-Orchestrierung über den gesamten Agent-Lebenszyklus
- [Agent-Knoten](../nodes/agent-node.md) – Konfiguration und Parameter
- [Persistentes Agent-Gedächtnis](./agent-persistent-memory.md) – Knowledge Graph pro Agent-Knoten und Peer-Sharing
- [Human-in-the-Loop](./human-in-the-loop.md) – Review-Links, ausstehende Payloads und Resume-Verhalten
- [OpenTelemetry Tracing](./opentelemetry.md) – Workflow-, Knoten- und Agent-Tool-Spans
- [Knotentypen](./node-types.md) – Agent und verwandte Knoten
- [Parallele Ausführung](./parallel-execution.md) – DAG-basierte und Sub-Agent-parallele Ausführung
- [MCP-Reiter](../tabs/mcp-tab.md) – MCP-Verbindungen konfigurieren
- [Ausdrucks-DSL](./expression-dsl.md) – `$input.text` für Sub-Agenten
