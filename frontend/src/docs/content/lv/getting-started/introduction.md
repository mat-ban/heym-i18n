# Ievads

**Veidojiet aģentiskas sistēmas. Palaidiet tās ar pārliecību.**

Heym ir infrastruktūra AI aģentu palaišanai un pārvaldībai produkcijā. Orkestrējiet aģentus, automatizējiet biznesa procesus, pārbaudiet katru izpildi un saglabājiet cilvēku kontroli. Izvietojiet Heym savā infrastruktūrā.

Heym sistēmā Workflow definē, kā aģenti, deterministiskie soļi, rīki un dati darbojas kopā. Izpildvide izpilda šo grafu, reģistrē katru palaišanu un aptur darbību cilvēka pārbaudei tur, kur Jūs to norādāt. Vizuālais kanva ir vieta, kur Jūs veidojat un pārbaudāt Workflow, un tie paši Workflow darbojas arī no API, grafikiem, notikumu Trigger, MCP klientiem un Portal tērzēšanas. Apmeklējiet [heym.run](https://heym.run), lai iepazītos ar produkta vietni, un skatiet [Kāpēc Heym](./why-heym.md), lai uzzinātu, ko Heym nodrošina katrā aģenta dzīves cikla posmā.

## Ko Jūs varat darīt

- **Veidot** – Veidojiet aģentus un deterministiskos soļus [kanvā](../reference/canvas-features.md) cilnē [Workflows](../tabs/workflows-tab.md), aprakstiet tos [AI Assistant](../reference/ai-assistant.md) vai sāciet no [Templates](../tabs/templates-tab.md)
- **Orkestrēt** – Koordinējiet [Agent](../nodes/agent-node.md), [LLM](../nodes/llm-node.md) un [RAG](../nodes/rag-node.md) mezglus, [apakšaģentus](../reference/agent-architecture.md), MCP rīkus un [integrācijas](../reference/integrations.md), piemēram, HTTP, Slack un e-pastu, ar [paralēlo izpildi](../reference/parallel-execution.md) tur, kur atkarības to pieļauj
- **Palaist** – Palaidiet Workflow no [webhooks](../reference/webhooks.md), [Cron](../nodes/cron-node.md) grafikiem un notikumu [triggers](../reference/triggers.md), ar atkārtojumiem katram mezglam, [kļūdu apstrādi](../nodes/error-handler-node.md) un [slodzes sadali](../reference/cluster.md) starp instancēm
- **Novērot** – Pārbaudiet [izpildes vēsturi](../reference/execution-history.md), [LLM traces](../tabs/traces-tab.md) ar Token izmaksām, [analītiku](../tabs/analytics-tab.md) un [brīdinājumus](../tabs/alerts-tab.md), kā arī eksportējiet [OpenTelemetry](../reference/opentelemetry.md) traces
- **Novērtēt** – Testējiet Prompt un modeļus pret sagaidāmajiem rezultātiem cilnē [Evals](../tabs/evals-tab.md)
- **Kontrolēt** – Apturiet aģentus [cilvēka pārbaudei](../reference/human-in-the-loop.md), bloķējiet nedrošu saturu ar [guardrails](../reference/guardrails.md) un pārvaldiet piekļuvi ar [credentials](../tabs/credentials-tab.md), [komandām](../reference/teams.md), [vienoto pierakstīšanos](../reference/sso.md) un [audita žurnālu](../reference/audit.md)
- **Publiskot** – Nodrošiniet Workflow pieejamību caur REST un [SSE straumēšanu](../reference/sse-streaming.md), kā [MCP](../tabs/mcp-tab.md) rīkus un kā [Portal](../reference/portal.md) tērzēšanas saskarnes gala lietotājiem; izmantojiet cilni [Chat](../tabs/chat-tab.md), lai tieši testētu modeļus
- **Tērzēt ar Heym** – Uzdodiet ar lapu saistītus produkta jautājumus dialoglodziņā [Chat with Heym](../reference/chat-with-heym.md) dokumentācijā

## Galvenie jēdzieni

- **Workflows** – Virzīts grafs, kas sastāv no mezgliem un savienojumiem. Pārvaldiet tos cilnē [Workflows](../tabs/workflows-tab.md). Skatiet [Workflow Structure](../reference/workflow-structure.md).
- **Nodes** – Apstrādes vienības ([Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md) u.c.). Skatiet [Node Types](../reference/node-types.md).
- **Edges** – Savienojumi, kas nosaka izpildes plūsmu
- **Credentials** – API atslēgas un noslēpumi, kas glabājas cilnē [Credentials](../tabs/credentials-tab.md) un uz kuriem atsaucas mezgli.
- **Variables** – Pastāvīgi atslēgu-vērtību dati cilnē [Variables](../tabs/global-variables-tab.md), pieejami, izmantojot `$global.variableName`. Skatiet [Global Variables](../reference/global-variables.md).
- **Expressions** – Atsaucieties uz iepriekšējo mezglu datiem, izmantojot `$input` un `$nodeName.field`. Skatiet [Expression DSL](../reference/expression-dsl.md).

## Saistītie

- [Why Heym](./why-heym.md) – Ko Heym nodrošina katrā aģenta dzīves cikla posmā
- [Quick Start](./quick-start.md) – Izveidojiet savu pirmo workflow
- [Running & Deployment](./running-and-deployment.md) – Palaidiet lokāli ar `run.sh` vai izvietojiet ar `deploy.sh`
- [AI Assistant](../reference/ai-assistant.md) – Veidojiet workflow ar dabiskās valodas palīdzību
- [Chat with Heym](../reference/chat-with-heym.md) – Uzdodiet papildu jautājumus, lasot dokumentāciju
- [Core Concepts](./core-concepts.md) – Workflows, mezgli un izpildes plūsma
- [Workflows Tab](../tabs/workflows-tab.md) – Pārvaldiet workflow un mapes
- [Credentials Tab](../tabs/credentials-tab.md) – Pievienojiet API atslēgas mezgliem
