# Úvod

**Vytvárajte agentné systémy. Spúšťajte ich s istotou.**

Heym je infraštruktúra na spúšťanie a správu AI agentov v produkcii. Orchestrujte agentov, automatizujte obchodné procesy, skúmajte každé spustenie a udržujte ľudí pod kontrolou. Nasaďte Heym na vlastnej infraštruktúre.

V Heym definuje workflow spôsob, akým agenti, deterministické kroky, nástroje a dáta spolupracujú. Runtime vykonáva tento graf, zaznamenáva každé spustenie a pozastaví sa na ľudskú kontrolu tam, kde o to požiadate. Vizuálne plátno je miesto, kde vytvárate a skúmate workflowy, a tie isté workflowy sa spúšťajú aj z API, plánovačov, event triggerov, MCP klientov a Portal chatov. Navštívte [heym.run](https://heym.run) pre produktovú stránku a pozrite si [Prečo Heym](./why-heym.md) pre to, čo Heym rieši v každej fáze životného cyklu agenta.

## Čo môžete robiť

- **Vytvárať** – Zostavujte agentov a deterministické kroky na [plátne](../reference/canvas-features.md) v záložke [Workflows](../tabs/workflows-tab.md), opisujte ich [AI asistentovi](../reference/ai-assistant.md) alebo začnite zo [šablón](../tabs/templates-tab.md)
- **Orchestrovať** – Koordinujte uzly [Agent](../nodes/agent-node.md), [LLM](../nodes/llm-node.md) a [RAG](../nodes/rag-node.md), [sub-agentov](../reference/agent-architecture.md), MCP nástroje a [integrácie](../reference/integrations.md) ako HTTP, Slack a email, s [paralelným vykonávaním](../reference/parallel-execution.md) tam, kde to závislosti umožňujú
- **Spúšťať** – Spúšťajte workflowy z [webhookov](../reference/webhooks.md), plánov [Cron](../nodes/cron-node.md) a event [triggerov](../reference/triggers.md), s opakovanými pokusmi na úrovni uzlov, [spracovaním chýb](../nodes/error-handler-node.md) a [distribúciou záťaže](../reference/cluster.md) naprieč inštanciami
- **Pozorovať** – Skúmajte [históriu spustení](../reference/execution-history.md), [LLM traces](../tabs/traces-tab.md) s nákladmi na tokeny, [analytiku](../tabs/analytics-tab.md) a [upozornenia](../tabs/alerts-tab.md) a exportujte [OpenTelemetry](../reference/opentelemetry.md) traces
- **Vyhodnocovať** – Testujte prompty a modely voči očakávaným výstupom v záložke [Evals](../tabs/evals-tab.md)
- **Kontrolovať** – Pozastavte agentov na [ľudskú kontrolu](../reference/human-in-the-loop.md), blokujte nebezpečný obsah pomocou [guardrails](../reference/guardrails.md) a spravujte prístup pomocou [credentials](../tabs/credentials-tab.md), [tímov](../reference/teams.md), [single sign-on](../reference/sso.md) a [audit trailu](../reference/audit.md)
- **Sprístupňovať** – Poskytujte workflowy cez REST a [SSE streaming](../reference/sse-streaming.md), ako [MCP](../tabs/mcp-tab.md) nástroje a ako chatovacie rozhrania [Portal](../reference/portal.md) pre koncových používateľov; použite záložku [Chat](../tabs/chat-tab.md) na priame testovanie modelov
- **Chatujte s Heym** – Pýtajte sa na otázky týkajúce sa produktu s ohľadom na kontext stránky v dialógu [Chat with Heym](../reference/chat-with-heym.md) v dokumentácii

## Kľúčové koncepty

- **Workflows** – Orientovaný graf uzlov a hrán. Spravujte ich v záložke [Workflows](../tabs/workflows-tab.md). Pozrite si [Štruktúra workflowu](../reference/workflow-structure.md).
- **Uzly** – Spracovateľské jednotky ([Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md) atď.). Pozrite si [Typy uzlov](../reference/node-types.md).
- **Hrany** – Prepojenia, ktoré definujú tok vykonávania
- **Credentials** – API kľúče a tajomstvá uložené v záložke [Credentials](../tabs/credentials-tab.md), na ktoré odkazujú uzly.
- **Premenné** – Trvalé údaje kľúč-hodnota v záložke [Variables](../tabs/global-variables-tab.md), prístupné cez `$global.variableName`. Pozrite si [Globálne premenné](../reference/global-variables.md).
- **Výrazy** – Odkazujte na dáta z predchádzajúcich krokov pomocou `$input` a `$nodeName.field`. Pozrite si [Expression DSL](../reference/expression-dsl.md).

## Súvisiace

- [Prečo Heym](./why-heym.md) – Čo Heym rieši v každej fáze životného cyklu agenta
- [Rýchly štart](./quick-start.md) – Vytvorte svoj prvý workflow
- [Spúšťanie a nasadenie](./running-and-deployment.md) – Spustite lokálne pomocou `run.sh` alebo nasaďte pomocou `deploy.sh`
- [AI asistent](../reference/ai-assistant.md) – Vytvárajte workflowy pomocou prirodzeného jazyka
- [Chat with Heym](../reference/chat-with-heym.md) – Pýtajte sa na doplňujúce otázky počas čítania dokumentácie
- [Základné koncepty](./core-concepts.md) – Workflows, uzly a tok vykonávania
- [Záložka Workflows](../tabs/workflows-tab.md) – Spravujte workflowy a priečinky
- [Záložka Credentials](../tabs/credentials-tab.md) – Pridajte API kľúče pre uzly
