# Introduktion

**Byg agentiske systemer. Kør dem med tillid.**

Heym er infrastruktur til at køre og styre AI-agenter i produktion. Orkestrer agenter, automatiser forretningsprocesser, inspicer hver eksekvering, og hold mennesker i kontrol. Udrul Heym på egen infrastruktur.

I Heym definerer en workflow, hvordan agenter, deterministiske trin, værktøjer og data arbejder sammen. Runtime'en eksekverer denne graf, registrerer hver kørsel og pauserer for menneskelig gennemgang, hvor det ønskes. Det visuelle canvas er stedet, hvor workflows bygges og inspiceres, og de samme workflows kan også køres fra API'er, tidsplaner, event-triggers, MCP-klienter og Portal-chats. Besøg [heym.run](https://heym.run) for produktsiden, og se [Why Heym](./why-heym.md) for, hvad Heym håndterer på hvert stadie af agentens livscyklus.

## Hvad Der Kan Gøres

- **Byg** – Sammensæt agenter og deterministiske trin på [canvas'et](../reference/canvas-features.md) i fanen [Workflows](../tabs/workflows-tab.md), beskriv dem for [AI Assistant](../reference/ai-assistant.md), eller start fra [Templates](../tabs/templates-tab.md)
- **Orkestrer** – Koordiner [Agent](../nodes/agent-node.md)-, [LLM](../nodes/llm-node.md)- og [RAG](../nodes/rag-node.md)-noder, [sub-agenter](../reference/agent-architecture.md), MCP-værktøjer og [integrationer](../reference/integrations.md) såsom HTTP, Slack og e-mail, med [parallel eksekvering](../reference/parallel-execution.md), hvor afhængigheder tillader det
- **Kør** – Start workflows fra [webhooks](../reference/webhooks.md), [Cron](../nodes/cron-node.md)-tidsplaner og event-[triggers](../reference/triggers.md), med per-node retries, [fejlhåndtering](../nodes/error-handler-node.md) og [load distribution](../reference/cluster.md) på tværs af instanser
- **Observer** – Inspicer [eksekveringshistorik](../reference/execution-history.md), [LLM-traces](../tabs/traces-tab.md) med token-omkostninger, [analytics](../tabs/analytics-tab.md) og [alarmer](../tabs/alerts-tab.md), og eksporter [OpenTelemetry](../reference/opentelemetry.md)-traces
- **Evaluer** – Test prompts og modeller mod forventede outputs i fanen [Evals](../tabs/evals-tab.md)
- **Styr** – Pauser agenter for [menneskelig gennemgang](../reference/human-in-the-loop.md), bloker usikkert indhold med [guardrails](../reference/guardrails.md), og administrer adgang med [credentials](../tabs/credentials-tab.md), [teams](../reference/teams.md), [single sign-on](../reference/sso.md) og et [audit trail](../reference/audit.md)
- **Eksponer** – Servér workflows over REST og [SSE-streaming](../reference/sse-streaming.md), som [MCP](../tabs/mcp-tab.md)-værktøjer og som [Portal](../reference/portal.md)-chatinterfaces for slutbrugere; brug fanen [Chat](../tabs/chat-tab.md) til at teste modeller direkte
- **Chat med Heym** – Stil sidebevidste produktspørgsmål fra dialogen [Chat with Heym](../reference/chat-with-heym.md) i dokumentationen

## Centrale Begreber

- **Workflows** – En rettet graf af noder og kanter. Administrer dem i fanen [Workflows](../tabs/workflows-tab.md). Se [Workflow Structure](../reference/workflow-structure.md).
- **Noder** – Behandlingsenheder ([Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md) osv.). Se [Node Types](../reference/node-types.md).
- **Kanter** – Forbindelser, der definerer eksekveringsflowet
- **Credentials** – API-nøgler og hemmeligheder gemt i fanen [Credentials](../tabs/credentials-tab.md), refereret af noder.
- **Variabler** – Persistent key-value-data i fanen [Variables](../tabs/global-variables-tab.md), tilgængelig via `$global.variableName`. Se [Global Variables](../reference/global-variables.md).
- **Udtryk** – Referer til opstrøms data med `$input` og `$nodeName.field`. Se [Expression DSL](../reference/expression-dsl.md).

## Relateret

- [Why Heym](./why-heym.md) – Hvad Heym håndterer på hvert stadie af agentens livscyklus
- [Quick Start](./quick-start.md) – Byg den første workflow
- [Running & Deployment](./running-and-deployment.md) – Start lokalt med `run.sh` eller udrul med `deploy.sh`
- [AI Assistant](../reference/ai-assistant.md) – Opret workflows med naturligt sprog
- [Chat with Heym](../reference/chat-with-heym.md) – Stil opfølgende spørgsmål under læsning af dokumentationen
- [Core Concepts](./core-concepts.md) – Workflows, noder og eksekveringsflow
- [Workflows Tab](../tabs/workflows-tab.md) – Administrer workflows og mapper
- [Credentials Tab](../tabs/credentials-tab.md) – Tilføj API-nøgler til noder
