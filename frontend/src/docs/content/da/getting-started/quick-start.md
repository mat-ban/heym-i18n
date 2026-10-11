# Kom godt i gang

Få den første Heym-workflow op at køre på få minutter.

Er Heym endnu ikke startet? Se [Kørsel & Udrulning](./running-and-deployment.md), eller følg videogennemgangen: [Set Up Heym Locally in Under 2 Minutes](https://www.youtube.com/watch?v=P6YvlupUboU).

## 1. Opret en workflow

1. Gå til fanen [Workflows](../tabs/workflows-tab.md)
2. Klik på **New Workflow**
3. Navngiv workflowen (f.eks. "Hello World")

## 2. Tilføj noder

1. Åbn panelet **Nodes** til venstre
2. Træk en [Input](../nodes/input-node.md)-node ind på canvas
3. Træk en [LLM](../nodes/llm-node.md)-node og forbind den til Input
4. Træk en [Output](../nodes/output-node.md)-node og forbind den til LLM

```
[Input] --> [LLM] --> [Output]
```

Se [Node Types](../reference/node-types.md) for alle tilgængelige noder.

## 3. Konfigurer

- **Input**: Angiv en standardværdi, eller lad feltet være tomt for brugerinput (se [Input Node](../nodes/input-node.md))
- **LLM**: Vælg en [credential](../tabs/credentials-tab.md) og model, tilføj en systeminstruktion, og sæt `userMessage` til `$input.text` (se [LLM Node](../nodes/llm-node.md))
- **Output**: Sæt `message` til `$llm.text` for at videregive LLM-svaret (se [Output Node](../nodes/output-node.md))

Brug syntaksen fra [Expression DSL](../reference/expression-dsl.md) til `$input.text` og `$llm.text`. Klik på udvid-knappen på udtryksfelter for at åbne [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) med live backend-preview.

## 4. Kør

Klik på **Run**, tryk `Ctrl + Enter`, eller brug debug-panelet til at udføre. Workflowen kører fra Input-noden gennem forbundne noder til Output. Se [Triggers](../reference/triggers.md) for andre måder at køre workflows på ([webhook](../reference/webhooks.md), portal, cron osv.).

Se tidligere kørsler i **History** (værktøjslinjen), og brug **Bring to Canvas** til at køre igen med samme inputs.

På Docs, Evals og andre interne sider uden for canvas kan [Quick Drawer](../reference/quick-drawer.md) også bruges til at vælge en fastgjort workflow og køre den uden at gå tilbage til editoren.

Hvis dokumentationen læses, og der ønskes afklaring før opbygning, kan [Chat with Heym](../reference/chat-with-heym.md) åbnes fra Docs-headeren for at stille sidebevidste spørgsmål.

Alternativt kan [AI Assistant](../reference/ai-assistant.md) bruges fra Debug-panelet til at oprette workflows med naturligt sprog—beskriv det ønskede, og AI'en genererer noder og kanter.

Er der allerede automatiseringer under opbygning i et andet værktøj? [Migrate to Heym](./migrate-to-heym.md) konverterer en n8n-, Flowise-, Dify-, Langflow-, sim.ai- eller Activepieces-workflow til en Heym-workflow, der kan importeres.

## Relateret

- [Core Concepts](./core-concepts.md) – Workflows, noder og eksekveringsflow
- [Migrate to Heym](./migrate-to-heym.md) – Konverter n8n-, Flowise-, Dify-, Langflow-, sim.ai- eller Activepieces-workflows til Heym med AI
- [Kørsel & Udrulning](./running-and-deployment.md) – Start lokalt med `run.sh` eller udrul med `deploy.sh`
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Fuld konfigurationsreference
- [Settings](../reference/user-settings.md) – Konfigurer navn, User Rules og adgangskode
- [Canvas Features](../reference/canvas-features.md) – Data pin, eksekveringslogs, aktivér/deaktivér, udtræk til sub-workflow
- [Keyboard Shortcuts](../reference/keyboard-shortcuts.md) – Genveje til canvas og editor
- [Expression DSL](../reference/expression-dsl.md) – Referering til data i node-konfiguration
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Udvidelig editor med live backend-preview
- [Triggers](../reference/triggers.md) – Alle workflow-indgangspunkter ([webhook](../reference/webhooks.md), portal, cron osv.)
- [Execution History](../reference/execution-history.md) – Se tidligere kørsler og Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Kør fastgjorte workflows fra sider uden for canvas
- [Chat with Heym](../reference/chat-with-heym.md) – Stil kontekstuelle spørgsmål fra docs-headeren
- [Workflows Tab](../tabs/workflows-tab.md) – Opret og administrer workflows
- [Credentials Tab](../tabs/credentials-tab.md) – Tilføj API-nøgler til LLM-noder
- [AI Assistant](../reference/ai-assistant.md) – Opret workflows med naturligt sprog
