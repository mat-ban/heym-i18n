# Introduktion

**Bygg agentiska system. Kör dem med tillförsikt.**

Heym är infrastruktur för att köra och styra AI-agenter i produktion. Orkestrera agenter, automatisera affärsprocesser, inspektera varje körning och behåll mänsklig kontroll. Distribuera Heym på egen infrastruktur.

I Heym definierar en workflow hur agenter, deterministiska steg, verktyg och data samverkar. Runtime exekverar den grafen, registrerar varje körning och pausar för mänsklig granskning där så anges. Den visuella canvasen är platsen där workflows byggs och inspekteras, och samma workflows kan även köras från API:er, scheman, event triggers, MCP-klienter och Portal-chattar. Besök [heym.run](https://heym.run) för produktsidan, och se [Why Heym](./why-heym.md) för vad Heym hanterar i varje skede av agentens livscykel.

## Vad som kan göras

- **Bygg** – Komponera agenter och deterministiska steg på [canvasen](../reference/canvas-features.md) i fliken [Workflows](../tabs/workflows-tab.md), beskriv dem för [AI-assistenten](../reference/ai-assistant.md), eller utgå från [Templates](../tabs/templates-tab.md)
- **Orkestrera** – Koordinera [Agent](../nodes/agent-node.md)-, [LLM](../nodes/llm-node.md)- och [RAG](../nodes/rag-node.md)-noder, [sub-agenter](../reference/agent-architecture.md), MCP-verktyg och [integrationer](../reference/integrations.md) såsom HTTP, Slack och e-post, med [parallell exekvering](../reference/parallel-execution.md) där beroenden tillåter
- **Kör** – Starta workflows från [webhooks](../reference/webhooks.md), [Cron](../nodes/cron-node.md)-scheman och event-[triggers](../reference/triggers.md), med återförsök per nod, [felhantering](../nodes/error-handler-node.md) och [lastfördelning](../reference/cluster.md) över instanser
- **Observera** – Inspektera [exekveringshistorik](../reference/execution-history.md), [LLM-traces](../tabs/traces-tab.md) med token-kostnader, [analys](../tabs/analytics-tab.md) och [larm](../tabs/alerts-tab.md), samt exportera [OpenTelemetry](../reference/opentelemetry.md)-traces
- **Utvärdera** – Testa prompts och modeller mot förväntade utdata i fliken [Evals](../tabs/evals-tab.md)
- **Kontrollera** – Pausa agenter för [mänsklig granskning](../reference/human-in-the-loop.md), blockera osäkert innehåll med [guardrails](../reference/guardrails.md), och hantera åtkomst med [credentials](../tabs/credentials-tab.md), [team](../reference/teams.md), [single sign-on](../reference/sso.md) och en [revisionslogg](../reference/audit.md)
- **Exponera** – Tillhandahåll workflows över REST och [SSE-streaming](../reference/sse-streaming.md), som [MCP](../tabs/mcp-tab.md)-verktyg och som [Portal](../reference/portal.md)-chattgränssnitt för slutanvändare; använd fliken [Chat](../tabs/chat-tab.md) för att testa modeller direkt
- **Chatta med Heym** – Ställ sidmedvetna produktfrågor från dialogen [Chat with Heym](../reference/chat-with-heym.md) i dokumentationen

## Nyckelbegrepp

- **Workflows** – En riktad graf av noder och kanter. Hanteras i fliken [Workflows](../tabs/workflows-tab.md). Se [Workflow Structure](../reference/workflow-structure.md).
- **Noder** – Bearbetningsenheter ([Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md) m.fl.). Se [Node Types](../reference/node-types.md).
- **Kanter** – Kopplingar som definierar exekveringsflödet
- **Credentials** – API-nycklar och hemligheter som lagras i fliken [Credentials](../tabs/credentials-tab.md) och refereras av noder.
- **Variabler** – Beständig nyckel-värde-data i fliken [Variables](../tabs/global-variables-tab.md), åtkomlig via `$global.variableName`. Se [Global Variables](../reference/global-variables.md).
- **Uttryck** – Referera till uppströmsdata med `$input` och `$nodeName.field`. Se [Expression DSL](../reference/expression-dsl.md).

## Relaterat

- [Why Heym](./why-heym.md) – Vad Heym hanterar i varje skede av agentens livscykel
- [Quick Start](./quick-start.md) – Bygg den första workflowen
- [Running & Deployment](./running-and-deployment.md) – Starta lokalt med `run.sh` eller distribuera med `deploy.sh`
- [AI Assistant](../reference/ai-assistant.md) – Skapa workflows med naturligt språk
- [Chat with Heym](../reference/chat-with-heym.md) – Ställ följdfrågor medan dokumentationen läses
- [Core Concepts](./core-concepts.md) – Workflows, noder och exekveringsflöde
- [Workflows Tab](../tabs/workflows-tab.md) – Hantera workflows och mappar
- [Credentials Tab](../tabs/credentials-tab.md) – Lägg till API-nycklar för noder
