# Úvod

**Vytvářejte agentní systémy. Provozujte je s jistotou.**

Heym je infrastruktura pro provoz a správu AI agentů v produkci. Orchestrujte agenty, automatizujte obchodní procesy, zkoumejte každé spuštění a udržujte lidskou kontrolu. Nasaďte Heym na vlastní infrastruktuře.

Ve Heymu workflow definuje, jak agenti, deterministické kroky, nástroje a data spolupracují. Runtime vykonává tento graf, zaznamenává každé spuštění a pozastavuje se pro lidskou kontrolu tam, kde si o to řeknete. Vizuální plátno je místo, kde workflows vytváříte a zkoumáte, a tytéž workflows lze spouštět také z API, plánů, event triggerů, MCP klientů a Portal chatů. Navštivte [heym.run](https://heym.run) pro produktový web a podívejte se na [Proč Heym](./why-heym.md), kde se dozvíte, co Heym zajišťuje v každé fázi životního cyklu agenta.

## Co můžete dělat

- **Vytvářet** – Sestavujte agenty a deterministické kroky na [plátně](../reference/canvas-features.md) v záložce [Workflows](../tabs/workflows-tab.md), popište je [AI Assistantovi](../reference/ai-assistant.md) nebo začněte ze [šablon](../tabs/templates-tab.md)
- **Orchestrovat** – Koordinujte uzly [Agent](../nodes/agent-node.md), [LLM](../nodes/llm-node.md) a [RAG](../nodes/rag-node.md), [sub-agenty](../reference/agent-architecture.md), MCP nástroje a [integrace](../reference/integrations.md), jako jsou HTTP, Slack a e-mail, s [paralelním prováděním](../reference/parallel-execution.md) tam, kde to závislosti umožňují
- **Spouštět** – Spouštějte workflows z [webhooků](../reference/webhooks.md), plánů [Cron](../nodes/cron-node.md) a event [triggerů](../reference/triggers.md), s opakováním na úrovni uzlů, [zpracováním chyb](../nodes/error-handler-node.md) a [distribucí zátěže](../reference/cluster.md) mezi instancemi
- **Pozorovat** – Zkoumejte [historii spuštění](../reference/execution-history.md), [LLM traces](../tabs/traces-tab.md) s náklady na tokeny, [analytiku](../tabs/analytics-tab.md) a [upozornění](../tabs/alerts-tab.md) a exportujte [OpenTelemetry](../reference/opentelemetry.md) traces
- **Vyhodnocovat** – Testujte prompty a modely proti očekávaným výstupům v záložce [Evals](../tabs/evals-tab.md)
- **Řídit** – Pozastavujte agenty pro [lidskou kontrolu](../reference/human-in-the-loop.md), blokujte nebezpečný obsah pomocí [guardrails](../reference/guardrails.md) a spravujte přístup pomocí [credentials](../tabs/credentials-tab.md), [týmů](../reference/teams.md), [single sign-on](../reference/sso.md) a [auditní stopy](../reference/audit.md)
- **Zpřístupňovat** – Poskytujte workflows přes REST a [SSE streaming](../reference/sse-streaming.md), jako [MCP](../tabs/mcp-tab.md) nástroje a jako chatovací rozhraní [Portal](../reference/portal.md) pro koncové uživatele; použijte záložku [Chat](../tabs/chat-tab.md) k přímému testování modelů
- **Chatovat s Heymem** – Ptejte se na otázky týkající se produktu s ohledem na aktuální stránku v dialogu [Chat with Heym](../reference/chat-with-heym.md) v dokumentaci

## Klíčové koncepty

- **Workflows** – Orientovaný graf uzlů a hran. Spravujte je v záložce [Workflows](../tabs/workflows-tab.md). Viz [Struktura workflow](../reference/workflow-structure.md).
- **Uzly** – Zpracovatelské jednotky ([Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md) atd.). Viz [Typy uzlů](../reference/node-types.md).
- **Hrany** – Spojení, která definují tok provádění
- **Credentials** – API klíče a tajemství uložená v záložce [Credentials](../tabs/credentials-tab.md), na která odkazují uzly.
- **Proměnné** – Trvalá data klíč–hodnota v záložce [Variables](../tabs/global-variables-tab.md), přístupná přes `$global.variableName`. Viz [Globální proměnné](../reference/global-variables.md).
- **Výrazy** – Odkazujte na data z předchozích uzlů pomocí `$input` a `$nodeName.field`. Viz [Expression DSL](../reference/expression-dsl.md).

## Související

- [Proč Heym](./why-heym.md) – Co Heym zajišťuje v každé fázi životního cyklu agenta
- [Rychlý start](./quick-start.md) – Vytvořte své první workflow
- [Provoz a nasazení](./running-and-deployment.md) – Spusťte lokálně pomocí `run.sh` nebo nasaďte pomocí `deploy.sh`
- [AI Assistant](../reference/ai-assistant.md) – Vytvářejte workflows přirozeným jazykem
- [Chat with Heym](../reference/chat-with-heym.md) – Ptejte se na doplňující otázky při čtení dokumentace
- [Základní koncepty](./core-concepts.md) – Workflows, uzly a tok provádění
- [Záložka Workflows](../tabs/workflows-tab.md) – Spravujte workflows a složky
- [Záložka Credentials](../tabs/credentials-tab.md) – Přidejte API klíče pro uzly
