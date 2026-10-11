# Įvadas

**Kurkite agentines sistemas. Vykdykite jas užtikrintai.**

Heym – tai infrastruktūra, skirta AI agentams vykdyti ir valdyti produkcinėje aplinkoje. Orkestruokite agentus, automatizuokite verslo procesus, stebėkite kiekvieną vykdymą ir išlaikykite žmones kontrolėje. Diegkite Heym savo infrastruktūroje.

Heym sistemoje Workflow apibrėžia, kaip agentai, deterministiniai žingsniai, įrankiai ir duomenys veikia kartu. Vykdymo aplinka įvykdo tą grafą, įrašo kiekvieną vykdymą ir pristabdo žmogaus peržiūrai ten, kur Jūs to paprašote. Vizuali drobė yra vieta, kur Jūs kuriate ir tikrinate Workflow, o tie patys Workflow taip pat paleidžiami iš API, tvarkaraščių, įvykių Trigger, MCP klientų ir Portal pokalbių. Aplankykite [heym.run](https://heym.run) produkto svetainėje ir žr. [Why Heym](./why-heym.md), kad sužinotumėte, ką Heym tvarko kiekviename agento gyvavimo ciklo etape.

## Ką galite daryti

- **Kurti** – Komponuokite agentus ir deterministinius žingsnius [drobėje](../reference/canvas-features.md), esančioje [Workflows](../tabs/workflows-tab.md) skirtuke, aprašykite juos [AI Assistant](../reference/ai-assistant.md) arba pradėkite nuo [Templates](../tabs/templates-tab.md)
- **Orkestruoti** – Koordinuokite [Agent](../nodes/agent-node.md), [LLM](../nodes/llm-node.md) ir [RAG](../nodes/rag-node.md) mazgus, [sub-agentus](../reference/agent-architecture.md), MCP įrankius ir [integracijas](../reference/integrations.md), tokias kaip HTTP, Slack ir el. paštas, su [lygiagrečiu vykdymu](../reference/parallel-execution.md) ten, kur priklausomybės tai leidžia
- **Vykdyti** – Paleiskite Workflow iš [webhook](../reference/webhooks.md), [Cron](../nodes/cron-node.md) tvarkaraščių ir įvykių [trigger](../reference/triggers.md), su kiekvieno mazgo pakartojimais, [klaidų tvarkymu](../nodes/error-handler-node.md) ir [apkrovos paskirstymu](../reference/cluster.md) tarp instancijų
- **Stebėti** – Tikrinkite [vykdymo istoriją](../reference/execution-history.md), [LLM traces](../tabs/traces-tab.md) su Token kainomis, [analitiką](../tabs/analytics-tab.md) ir [perspėjimus](../tabs/alerts-tab.md), bei eksportuokite [OpenTelemetry](../reference/opentelemetry.md) traces
- **Vertinti** – Testuokite Prompt ir modelius pagal laukiamus rezultatus [Evals](../tabs/evals-tab.md) skirtuke
- **Kontroliuoti** – Pristabdykite agentus [žmogaus peržiūrai](../reference/human-in-the-loop.md), blokuokite nesaugų turinį su [guardrails](../reference/guardrails.md) ir valdykite prieigą su [credentials](../tabs/credentials-tab.md), [komandomis](../reference/teams.md), [vienkartiniu prisijungimu](../reference/sso.md) ir [audito pėdsaku](../reference/audit.md)
- **Eksponuoti** – Teikite Workflow per REST ir [SSE streaming](../reference/sse-streaming.md), kaip [MCP](../tabs/mcp-tab.md) įrankius ir kaip [Portal](../reference/portal.md) pokalbių sąsajas galutiniams vartotojams; naudokite [Chat](../tabs/chat-tab.md) skirtuką modeliams tiesiogiai testuoti
- **Kalbėkitės su Heym** – Užduokite su puslapiu susietus produkto klausimus iš [Chat with Heym](../reference/chat-with-heym.md) dialogo dokumentacijoje

## Pagrindinės sąvokos

- **Workflow** – Kryptinis grafų mazgų ir briaunų tinklas. Tvarkykite juos skirtuke [Workflows](../tabs/workflows-tab.md). Žr. [Workflow Structure](../reference/workflow-structure.md).
- **Mazgai** – Apdorojimo vienetai ([Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md) ir kt.). Žr. [Node Types](../reference/node-types.md).
- **Briaunos** – Ryšiai, apibrėžiantys vykdymo eigą
- **Credentials** – API raktai ir slaptažodžiai, saugomi skirtuke [Credentials](../tabs/credentials-tab.md), į kuriuos nurodo mazgai.
- **Kintamieji** – Ilgalaikiai raktų-reikšmių duomenys skirtuke [Variables](../tabs/global-variables-tab.md), pasiekiami per `$global.variableName`. Žr. [Global Variables](../reference/global-variables.md).
- **Išraiškos** – Nurodykite priešingus duomenis naudodami `$input` ir `$nodeName.field`. Žr. [Expression DSL](../reference/expression-dsl.md).

## Susiję

- [Why Heym](./why-heym.md) – Ką Heym tvarko kiekviename agento gyvavimo ciklo etape
- [Quick Start](./quick-start.md) – Sukurkite savo pirmąjį workflow
- [Running & Deployment](./running-and-deployment.md) – Paleiskite lokaliai su `run.sh` arba diegkite su `deploy.sh`
- [AI Assistant](../reference/ai-assistant.md) – Kurkite workflow naudodami natūralią kalbą
- [Chat with Heym](../reference/chat-with-heym.md) – Užduokite papildomus klausimus skaitydami dokumentaciją
- [Core Concepts](./core-concepts.md) – Workflow, mazgai ir vykdymo eiga
- [Workflows Tab](../tabs/workflows-tab.md) – Tvarkykite workflow ir aplankus
- [Credentials Tab](../tabs/credentials-tab.md) – Pridėkite API raktus mazgams
