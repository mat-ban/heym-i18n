# Agent-Knoten

Der **Agent-Knoten** (AI Agent) ist ein LLM-Knoten mit nativer Tool-Calling-Schleife. Er kann Python-Tools ausführen, verbundene Canvas-Knoten als Tools aufrufen, sich mit MCP-Servern verbinden, portable Skills nutzen, Aufgaben an Sub-Agenten delegieren und für ein [menschliches Review (HITL)](../reference/human-in-the-loop.md) pausieren.

## Übersicht

| Eigenschaft | Wert |
|---|---|
| Eingänge | 1 |
| Ausgänge | 1, plus optional `review` bei aktiviertem HITL |
| Ausgabe | `$nodeLabel.text`, `$nodeLabel.fieldName` (bei strukturiertem JSON-Output) oder ein ausstehendes HITL-Payload beim Warten auf Freigabe |

## Wichtigste Parameter

### Anmeldedaten & Modell

| Parameter | Typ | Beschreibung |
|---|---|---|
| `credentialId` | UUID | LLM-Anmeldedaten (API-Key) aus den Einstellungen |
| `model` | string | Modellname (z. B. `gpt-4o`, `deepseek-chat`) |
| `fallbackCredentialId` | UUID (optional) | Fallback-Anmeldedaten bei Ausfall des primären Providers |
| `fallbackModel` | string (optional) | Fallback-Modell bei Fehlern |

Legen Sie Anmeldedaten im Reiter [Anmeldedaten](../tabs/credentials-tab.md) an. Die Modellliste wird dynamisch anhand der gewählten Anmeldedaten geladen.

### Prompts

| Parameter | Typ | Beschreibung |
|---|---|---|
| `systemInstruction` | string | System-Prompt für den Agenten. Unterstützt [Ausdrucks-DSL](../reference/expression-dsl.md). |
| `userMessage` | string | Benutzernachricht / Prompt. Standard: `$input.text` |
| `jsonOutputEnabled` | boolean | Aktiviert strukturierte JSON-Ausgabe |
| `jsonOutputSchema` | string | JSON-Schema zur Validierung der Ausgabe |
| `extraBodyEnabled` | boolean | Sendet providerspezifische Zusatzparameter |
| `extraBody` | string | JSON-Objekt, das in jeden API-Aufruf gemergt wird |

### Reasoning-Modelle (o1, o3)

| Parameter | Typ | Beschreibung |
|---|---|---|
| `temperature` | number | 0.0–2.0 (Standard: 0.7), steuert Kreativität bei Standardmodellen |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Schlusstiefe für Reasoning-Modelle |

## Human Review (HITL)

Aktivieren Sie HITL, wenn der Agent vor kritischen Aktionen (z. B. E-Mail versenden, Datenbank-Schreibzugriff) eine menschliche Freigabe einholen muss.

| Parameter | Typ | Beschreibung |
|---|---|---|
| `hitlEnabled` | boolean | Aktiviert Human-in-the-Loop-Checkpoints |
| `hitlSummary` | string | Freigaberichtlinien, die dem Agenten erklären, wann ein Review nötig ist |

- Der Agent erhält das Werkzeug `request_human_review`
- Bei Aufruf pausiert die Ausführung und generiert einen sicheren Einmal-Link (`/review/{token}`)
- Prüfer können den Vorschlag annehmen, im Markdown-Editor anpassen oder ablehnen
- Nach Freigabe setzt der Agent die Ausführung ab dem Snapshot fort

## Orchestrator-Modus

Wenn `isOrchestrator: true` gesetzt ist, erhält der Agent das Tool `call_sub_agent` und kann Aufgaben an andere Agent-Knoten auf demselben Canvas delegieren.

| Parameter | Typ | Beschreibung |
|---|---|---|
| `isOrchestrator` | boolean | Agent agiert als Orchestrator |
| `maxDelegationTurns` | number | Maximale Delegierungsrunden (Standard: 10) |

## Tools & Erweiterbarkeit

1. **Python-Tools**: Definieren Sie benutzerdefinierte Tools inline im Code-Editor des Knotens mit voller Python-Unterstützung.
2. **Knoten als Tools**: Verbinden Sie beliebige Knoten (HTTP, RAG, Playwright) mit dem `tools`-Handle des Agenten.
3. **MCP-Server**: Binden Sie externe Server über stdio oder SSE im Reiter [MCP](../tabs/mcp-tab.md) an.
4. **Skills**: Ziehen Sie `.zip`-Archive mit `SKILL.md` auf den Knoten, um Fähigkeiten modular zu erweitern.

## Verwandte Themen

- [LLM-Knoten](./llm-node.md) – Standard-LLM-Knoten ohne Schleife
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Review-Workflows im Detail
- [Reiter MCP](../tabs/mcp-tab.md) – MCP-Tools anbinden\n