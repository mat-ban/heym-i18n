# Sissejuhatus

**Ehitage agendipõhiseid süsteeme. Käivitage neid kindlalt.**

Heym on taristu AI-agentide käitamiseks ja haldamiseks tootmiskeskkonnas. Orkestreerige agente, automatiseerige äriprotsesse, uurige iga täitmist ja hoidke inimkontrolli. Juurutage Heym oma taristul.

Heymis määratleb workflow, kuidas agendid, deterministlikud sammud, tööriistad ja andmed koos toimivad. Runtime täidab seda graafi, salvestab iga käivituse ja peatub inimülevaatuseks seal, kus te seda soovite. Visuaalne lõuend on koht, kus te workflowsid ehitate ja uurite, ning samu workflowisid saab käivitada ka API-de, ajakavade, sündmuste triggerite, MCP-klientide ja Portali vestluste kaudu. Külastage [heym.run](https://heym.run) tootelehe jaoks ja vaadake [Miks Heym](./why-heym.md), et näha, mida Heym agentide elutsükli igas etapis käsitleb.

## Mida te saate teha

- **Ehitage** – Koostage agente ja deterministlikke samme [lõuendil](../reference/canvas-features.md) vahekaardil [Workflows](../tabs/workflows-tab.md), kirjeldage neid [AI Assistandile](../reference/ai-assistant.md) või alustage [Mallidest](../tabs/templates-tab.md)
- **Orkestreerige** – Koordineerige [Agent](../nodes/agent-node.md), [LLM](../nodes/llm-node.md) ja [RAG](../nodes/rag-node.md) node'e, [alamagente](../reference/agent-architecture.md), MCP-tööriistu ja [integratsioone](../reference/integrations.md) nagu HTTP, Slack ja e-post, kasutades [paralleelset täitmist](../reference/parallel-execution.md) seal, kus sõltuvused seda lubavad
- **Käivitage** – Käivitage workflowisid [webhookide](../reference/webhooks.md), [Cron](../nodes/cron-node.md) ajakavade ja sündmuste [triggerite](../reference/triggers.md) kaudu, kasutades node-põhiseid korduskatseid, [veakäsitlust](../nodes/error-handler-node.md) ja [koormuse jaotamist](../reference/cluster.md) instantside vahel
- **Jälgige** – Uurige [täitmise ajalugu](../reference/execution-history.md), [LLM trace'e](../tabs/traces-tab.md) koos token-kuludega, [analüütikat](../tabs/analytics-tab.md) ja [teavitusi](../tabs/alerts-tab.md) ning eksportige [OpenTelemetry](../reference/opentelemetry.md) trace'e
- **Hinnake** – Testige prompt'e ja mudeleid oodatud väljundite vastu vahekaardil [Evals](../tabs/evals-tab.md)
- **Kontrollige** – Peatage agendid [inimülevaatuseks](../reference/human-in-the-loop.md), blokeerige ohtlik sisu [guardrailidega](../reference/guardrails.md) ja haldage juurdepääsu [mandaatide](../tabs/credentials-tab.md), [tiimide](../reference/teams.md), [ühekordse sisselogimise](../reference/sso.md) ja [auditilogi](../reference/audit.md) abil
- **Avage** – Pakkuge workflowisid REST-i ja [SSE-voogedastuse](../reference/sse-streaming.md) kaudu, [MCP](../tabs/mcp-tab.md) tööriistadena ja [Portali](../reference/portal.md) vestlusliidestena lõppkasutajatele; kasutage vahekaarti [Chat](../tabs/chat-tab.md), et mudeleid otse testida
- **Vestlege Heymiga** – Esitage lehekülge arvestavaid tooteküsimusi dialoogist [Chat with Heym](../reference/chat-with-heym.md) dokumentatsioonis

## Põhimõisted

- **Workflow'd** – Suunatud graaf, mis koosneb sõlmedest ja ühendustest. Haldate neid vahekaardil [Workflows](../tabs/workflows-tab.md). Vaadake [Workflow Structure](../reference/workflow-structure.md).
- **Sõlmed** – Töötlusüksused ([Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md) jne). Vaadake [Node Types](../reference/node-types.md).
- **Ühendused** – Ühendused, mis määravad täitmise voo
- **Credentials** – API võtmed ja saladused, mis on salvestatud vahekaardile [Credentials](../tabs/credentials-tab.md) ja millele sõlmed viitavad.
- **Muutujad** – Püsivad võti-väärtus andmed vahekaardil [Variables](../tabs/global-variables-tab.md), millele pääsete juurde `$global.variableName` kaudu. Vaadake [Global Variables](../reference/global-variables.md).
- **Avaldised** – Viidake ülesvoolu andmetele `$input` ja `$nodeName.field` abil. Vaadake [Expression DSL](../reference/expression-dsl.md).

## Seotud

- [Why Heym](./why-heym.md) – Mida Heym käsitleb agentide elutsükli igas etapis
- [Quick Start](./quick-start.md) – Looge oma esimene workflow
- [Running & Deployment](./running-and-deployment.md) – Käivitage lokaalselt `run.sh` abil või juurutage `deploy.sh` abil
- [AI Assistant](../reference/ai-assistant.md) – Looge workflow'sid loomulikus keeles
- [Chat with Heym](../reference/chat-with-heym.md) – Esitage järelküsimusi dokumentatsiooni lugemise ajal
- [Core Concepts](./core-concepts.md) – Workflow'd, sõlmed ja täitmise voog
- [Workflows Tab](../tabs/workflows-tab.md) – Hallake workflow'sid ja kaustu
- [Credentials Tab](../tabs/credentials-tab.md) – Lisage sõlmedele API võtmeid
