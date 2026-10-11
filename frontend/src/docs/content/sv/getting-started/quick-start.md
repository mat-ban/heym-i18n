# Snabbstart

Få det första Heym-workflowet igång på några minuter.

Om Heym ännu inte körs, se [Running & Deployment](./running-and-deployment.md), eller följ videogenomgången: [Set Up Heym Locally in Under 2 Minutes](https://www.youtube.com/watch?v=P6YvlupUboU).

## 1. Skapa ett Workflow

1. Gå till fliken [Workflows](../tabs/workflows-tab.md)
2. Klicka på **New Workflow**
3. Namnge workflowet (t.ex. "Hello World")

## 2. Lägg till noder

1. Öppna panelen **Nodes** till vänster
2. Dra en [Input](../nodes/input-node.md)-nod till canvasen
3. Dra en [LLM](../nodes/llm-node.md)-nod och anslut den till Input
4. Dra en [Output](../nodes/output-node.md)-nod och anslut den till LLM

```
[Input] --> [LLM] --> [Output]
```

Se [Node Types](../reference/node-types.md) för alla tillgängliga noder.

## 3. Konfigurera

- **Input**: Ange ett standardvärde eller lämna tomt för användarinmatning (se [Input Node](../nodes/input-node.md))
- **LLM**: Välj en [credential](../tabs/credentials-tab.md) och modell, lägg till en systeminstruktion och ange `userMessage` till `$input.text` (se [LLM Node](../nodes/llm-node.md))
- **Output**: Ange `message` till `$llm.text` för att skicka vidare LLM-svaret (se [Output Node](../nodes/output-node.md))

Använd syntaxen [Expression DSL](../reference/expression-dsl.md) för `$input.text` och `$llm.text`. Klicka på expanderingsknappen på uttrycksfält för att öppna [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) med live-förhandsvisning från backend.

## 4. Kör

Klicka på **Run**, tryck på `Ctrl + Enter` eller använd debug-panelen för att köra. Workflowet körs från Input-noden genom anslutna noder till Output. Se [Triggers](../reference/triggers.md) för andra sätt att köra workflows ([webhook](../reference/webhooks.md), portal, cron, etc.).

Visa tidigare körningar i **History** (verktygsfältet) och använd **Bring to Canvas** för att köra igen med samma indata.

På Docs, Evals och andra interna sidor utanför canvasen går det även att använda [Quick Drawer](../reference/quick-drawer.md) för att välja ett fäst workflow och köra det utan att gå tillbaka till editorn.

Om dokumentationen läses och förtydliganden önskas innan bygget påbörjas, öppna [Chat with Heym](../reference/chat-with-heym.md) från Docs-huvudet för att ställa sidmedvetna frågor.

Alternativt kan [AI Assistant](../reference/ai-assistant.md) användas från Debug-panelen för att skapa workflows med naturligt språk – beskriv vad som önskas och AI:n genererar noder och kanter.

Redan automatiseringar byggda i ett annat verktyg? [Migrate to Heym](./migrate-to-heym.md) konverterar ett n8n-, Flowise-, Dify-, Langflow-, sim.ai- eller Activepieces-workflow till ett Heym-workflow som kan importeras.

## Relaterat

- [Core Concepts](./core-concepts.md) – Workflows, noder och exekveringsflöde
- [Migrate to Heym](./migrate-to-heym.md) – Konvertera n8n-, Flowise-, Dify-, Langflow-, sim.ai- eller Activepieces-workflows till Heym med AI
- [Running & Deployment](./running-and-deployment.md) – Starta lokalt med `run.sh` eller distribuera med `deploy.sh`
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Fullständig konfigurationsreferens
- [Settings](../reference/user-settings.md) – Konfigurera namn, User Rules och lösenord
- [Canvas Features](../reference/canvas-features.md) – Data pin, exekveringsloggar, aktivera/inaktivera, extrahera till sub-workflow
- [Keyboard Shortcuts](../reference/keyboard-shortcuts.md) – Genvägar för canvas och editor
- [Expression DSL](../reference/expression-dsl.md) – Referera till data i nodkonfiguration
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Expanderbar editor med live-förhandsvisning från backend
- [Triggers](../reference/triggers.md) – Alla workflowets startpunkter ([webhook](../reference/webhooks.md), portal, cron, etc.)
- [Execution History](../reference/execution-history.md) – Visa tidigare körningar och Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Kör fästa workflows från sidor utanför canvasen
- [Chat with Heym](../reference/chat-with-heym.md) – Ställ kontextuella frågor från docs-huvudet
- [Workflows Tab](../tabs/workflows-tab.md) – Skapa och hantera workflows
- [Credentials Tab](../tabs/credentials-tab.md) – Lägg till API-nycklar för LLM-noder
- [AI Assistant](../reference/ai-assistant.md) – Skapa workflows med naturligt språk
