# Introducere

**Construiți sisteme agentice. Rulați-le cu încredere.**

Heym este infrastructură pentru rularea și guvernanța agenților AI în producție. Orchestrați agenți, automatizați procese de business, inspectați fiecare execuție și mențineți oamenii în control. Implementați Heym pe propria infrastructură.

În Heym, un workflow definește modul în care agenții, pașii determiniști, instrumentele și datele lucrează împreună. Runtime-ul execută acel graf, înregistrează fiecare rulare și face o pauză pentru revizuire umană acolo unde solicitați acest lucru. Canvasul vizual este locul în care construiți și inspectați workflow-uri, iar aceleași workflow-uri rulează și din API-uri, programări, trigger-e de evenimente, clienți MCP și chat-uri Portal. Vizitați [heym.run](https://heym.run) pentru site-ul produsului și consultați [Why Heym](./why-heym.md) pentru ceea ce gestionează Heym în fiecare etapă a ciclului de viață al agentului.

## Ce puteți face

- **Construiți** – Compuneți agenți și pași determiniști pe [canvas](../reference/canvas-features.md) în tab-ul [Workflows](../tabs/workflows-tab.md), descrieți-i [AI Assistant](../reference/ai-assistant.md) sau porniți de la [Templates](../tabs/templates-tab.md)
- **Orchestrați** – Coordonați noduri [Agent](../nodes/agent-node.md), [LLM](../nodes/llm-node.md) și [RAG](../nodes/rag-node.md), [sub-agenți](../reference/agent-architecture.md), instrumente MCP și [integrări](../reference/integrations.md) precum HTTP, Slack și email, cu [execuție paralelă](../reference/parallel-execution.md) acolo unde dependențele permit
- **Rulați** – Porniți workflow-uri din [webhook-uri](../reference/webhooks.md), programări [Cron](../nodes/cron-node.md) și [trigger-e](../reference/triggers.md) de evenimente, cu reîncercări per nod, [gestionarea erorilor](../nodes/error-handler-node.md) și [distribuirea încărcării](../reference/cluster.md) între instanțe
- **Observați** – Inspectați [istoricul execuțiilor](../reference/execution-history.md), [urmele LLM](../tabs/traces-tab.md) cu costuri per token, [analitice](../tabs/analytics-tab.md) și [alerte](../tabs/alerts-tab.md) și exportați urme [OpenTelemetry](../reference/opentelemetry.md)
- **Evaluați** – Testați prompt-uri și modele față de rezultatele așteptate în tab-ul [Evals](../tabs/evals-tab.md)
- **Controlați** – Întrerupeți agenții pentru [revizuire umană](../reference/human-in-the-loop.md), blocați conținutul nesigur cu [guardrails](../reference/guardrails.md) și gestionați accesul cu [credențiale](../tabs/credentials-tab.md), [echipe](../reference/teams.md), [single sign-on](../reference/sso.md) și o [urmă de audit](../reference/audit.md)
- **Expuneți** – Serviți workflow-uri prin REST și [streaming SSE](../reference/sse-streaming.md), ca instrumente [MCP](../tabs/mcp-tab.md) și ca interfețe de chat [Portal](../reference/portal.md) pentru utilizatorii finali; folosiți tab-ul [Chat](../tabs/chat-tab.md) pentru a testa modele direct
- **Discutați cu Heym** – Adresați întrebări despre produs, conștiente de pagină, din dialogul [Chat with Heym](../reference/chat-with-heym.md) din documentație

## Concepte cheie

- **Workflows** – Un graf orientat de noduri și muchii. Gestionați-le în tab-ul [Workflows](../tabs/workflows-tab.md). Consultați [Workflow Structure](../reference/workflow-structure.md).
- **Noduri** – Unități de procesare ([Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md) etc.). Consultați [Node Types](../reference/node-types.md).
- **Muchii** – Conexiuni care definesc fluxul de execuție
- **Credențiale** – Chei API și secrete stocate în tab-ul [Credentials](../tabs/credentials-tab.md), referite de noduri.
- **Variabile** – Date persistente de tip cheie-valoare în tab-ul [Variables](../tabs/global-variables-tab.md), accesibile prin `$global.variableName`. Consultați [Global Variables](../reference/global-variables.md).
- **Expresii** – Referiți datele din amonte cu `$input` și `$nodeName.field`. Consultați [Expression DSL](../reference/expression-dsl.md).

## Resurse conexe

- [Why Heym](./why-heym.md) – Ce gestionează Heym în fiecare etapă a ciclului de viață al agentului
- [Quick Start](./quick-start.md) – Construiți primul dumneavoastră workflow
- [Running & Deployment](./running-and-deployment.md) – Porniți local cu `run.sh` sau implementați cu `deploy.sh`
- [AI Assistant](../reference/ai-assistant.md) – Creați workflow-uri cu limbaj natural
- [Chat with Heym](../reference/chat-with-heym.md) – Adresați întrebări suplimentare în timp ce citiți documentația
- [Core Concepts](./core-concepts.md) – Workflow-uri, noduri și fluxul de execuție
- [Workflows Tab](../tabs/workflows-tab.md) – Gestionați workflow-uri și foldere
- [Credentials Tab](../tabs/credentials-tab.md) – Adăugați chei API pentru noduri
