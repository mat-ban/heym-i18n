# Uvod

**Izgradite agentne sustave. Pokrećite ih s pouzdanjem.**

Heym je infrastruktura za pokretanje i upravljanje AI agentima u produkciji. Orkestrirajte agente, automatizirajte poslovne procese, pregledajte svaku izvedbu i zadržite ljude u kontroli. Implementirajte Heym na vlastitoj infrastrukturi.

U Heymu, Workflow definira kako agenti, deterministički koraci, alati i podaci rade zajedno. Runtime izvršava taj graf, bilježi svako pokretanje i pauzira za ljudski pregled gdje to zatražite. Vizualno platno mjesto je gdje gradite i pregledavate Workflowe, a isti Workflowi pokreću se i putem API-ja, rasporeda, event Triggera, MCP klijenata i Portal razgovora. Posjetite [heym.run](https://heym.run) za stranicu proizvoda i pogledajte [Zašto Heym](./why-heym.md) za ono što Heym obrađuje u svakoj fazi životnog ciklusa agenta.

## Što možete raditi

- **Izgradnja** – Sastavite agente i determinističke korake na [platnu](../reference/canvas-features.md) u kartici [Workflows](../tabs/workflows-tab.md), opišite ih [AI Assistantu](../reference/ai-assistant.md) ili započnite iz [Predložaka](../tabs/templates-tab.md)
- **Orkestracija** – Koordinirajte [Agent](../nodes/agent-node.md), [LLM](../nodes/llm-node.md) i [RAG](../nodes/rag-node.md) nodeove, [pod-agente](../reference/agent-architecture.md), MCP alate i [integracije](../reference/integrations.md) kao što su HTTP, Slack i e-pošta, uz [paralelno izvršavanje](../reference/parallel-execution.md) gdje ovisnosti to dopuštaju
- **Pokretanje** – Pokrenite Workflowe putem [webhookova](../reference/webhooks.md), [Cron](../nodes/cron-node.md) rasporeda i event [Triggera](../reference/triggers.md), uz ponovne pokušaje po nodeu, [rukovanje greškama](../nodes/error-handler-node.md) i [raspodjelu opterećenja](../reference/cluster.md) po instancama
- **Nadzor** – Pregledajte [povijest izvršavanja](../reference/execution-history.md), [LLM traceove](../tabs/traces-tab.md) s troškovima Tokena, [analitiku](../tabs/analytics-tab.md) i [upozorenja](../tabs/alerts-tab.md) te izvezite [OpenTelemetry](../reference/opentelemetry.md) traceove
- **Evaluacija** – Testirajte Promptove i modele prema očekivanim izlazima u kartici [Evals](../tabs/evals-tab.md)
- **Kontrola** – Pauzirajte agente za [ljudski pregled](../reference/human-in-the-loop.md), blokirajte nesiguran sadržaj pomoću [guardrailsa](../reference/guardrails.md) i upravljajte pristupom pomoću [vjerodajnica](../tabs/credentials-tab.md), [timova](../reference/teams.md), [single sign-ona](../reference/sso.md) i [revizijskog traga](../reference/audit.md)
- **Izlaganje** – Poslužite Workflowe putem REST-a i [SSE streaminga](../reference/sse-streaming.md), kao [MCP](../tabs/mcp-tab.md) alate i kao [Portal](../reference/portal.md) chat sučelja za krajnje korisnike; koristite karticu [Chat](../tabs/chat-tab.md) za izravno testiranje modela
- **Razgovor s Heymom** – Postavljajte pitanja o proizvodu svjesna stranice iz dijaloga [Razgovor s Heymom](../reference/chat-with-heym.md) u dokumentaciji

## Ključni koncepti

- **Workflows** – Usmjereni graf čvorova i veza. Upravljajte njima u kartici [Workflows](../tabs/workflows-tab.md). Pogledajte [Workflow Structure](../reference/workflow-structure.md).
- **Nodes** – Jedinice za obradu ([Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md) itd.). Pogledajte [Node Types](../reference/node-types.md).
- **Edges** – Veze koje definiraju tijek izvršavanja
- **Credentials** – API ključevi i tajne pohranjeni u kartici [Credentials](../tabs/credentials-tab.md), na koje se referenciraju čvorovi.
- **Variables** – Trajni podaci u obliku ključ-vrijednost u kartici [Variables](../tabs/global-variables-tab.md), dostupni putem `$global.variableName`. Pogledajte [Global Variables](../reference/global-variables.md).
- **Expressions** – Referencirajte podatke uzvodno s `$input` i `$nodeName.field`. Pogledajte [Expression DSL](../reference/expression-dsl.md).

## Povezano

- [Why Heym](./why-heym.md) – Što Heym obrađuje u svakoj fazi životnog ciklusa agenta
- [Quick Start](./quick-start.md) – Izradite svoj prvi workflow
- [Running & Deployment](./running-and-deployment.md) – Pokrenite lokalno s `run.sh` ili implementirajte s `deploy.sh`
- [AI Assistant](../reference/ai-assistant.md) – Izradite workflows prirodnim jezikom
- [Chat with Heym](../reference/chat-with-heym.md) – Postavljajte dodatna pitanja tijekom čitanja dokumentacije
- [Core Concepts](./core-concepts.md) – Workflows, nodes i tijek izvršavanja
- [Workflows Tab](../tabs/workflows-tab.md) – Upravljajte workflows i mapama
- [Credentials Tab](../tabs/credentials-tab.md) – Dodajte API ključeve za čvorove
