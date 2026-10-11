# Uvod

**Zgradite agentske sisteme. Zaženite jih samozavestno.**

Heym je infrastruktura za izvajanje in upravljanje AI agentov v produkciji. Orkestrirajte agente, avtomatizirajte poslovne procese, pregledujte vsako izvajanje in ohranite nadzor v rokah ljudi. Heym namestite na lastno infrastrukturo.

V Heymu Workflow določa, kako agenti, deterministični koraki, orodja in podatki delujejo skupaj. Runtime izvede ta graf, zabeleži vsako izvajanje in se ustavi za človeški pregled, kjer to zahtevate. Vizualno platno je prostor, kjer gradite in pregledujete Workflowe, isti Workflowi pa se izvajajo tudi prek API-jev, urnikov, event Triggerjev, MCP odjemalcev in Portal klepetov. Obiščite [heym.run](https://heym.run) za stran izdelka in si oglejte [Zakaj Heym](./why-heym.md) za to, kar Heym obravnava na vsaki stopnji življenjskega cikla agenta.

## Kaj lahko storite

- **Gradite** – Sestavite agente in deterministične korake na [platnu](../reference/canvas-features.md) v zavihku [Workflows](../tabs/workflows-tab.md), jih opišite [AI Assistantu](../reference/ai-assistant.md) ali začnite s [Predlogami](../tabs/templates-tab.md)
- **Orkestrirajte** – Usklajujte vozlišča [Agent](../nodes/agent-node.md), [LLM](../nodes/llm-node.md) in [RAG](../nodes/rag-node.md), [pod-agente](../reference/agent-architecture.md), MCP orodja in [integracije](../reference/integrations.md), kot so HTTP, Slack in e-pošta, z [vzporednim izvajanjem](../reference/parallel-execution.md), kjer odvisnosti to dopuščajo
- **Zaženite** – Zaženite Workflowe prek [webhookov](../reference/webhooks.md), [Cron](../nodes/cron-node.md) urnikov in event [Triggerjev](../reference/triggers.md), s ponovnimi poskusi na vozlišče, [obravnavo napak](../nodes/error-handler-node.md) in [porazdelitvijo obremenitve](../reference/cluster.md) med instancami
- **Opazujte** – Preglejte [zgodovino izvajanja](../reference/execution-history.md), [LLM sledi](../tabs/traces-tab.md) s stroški Tokenov, [analitiko](../tabs/analytics-tab.md) in [opozorila](../tabs/alerts-tab.md) ter izvozite [OpenTelemetry](../reference/opentelemetry.md) sledi
- **Vrednotite** – Testirajte Prompt-e in modele glede na pričakovane izhode v zavihku [Evals](../tabs/evals-tab.md)
- **Nadzorujte** – Ustavite agente za [človeški pregled](../reference/human-in-the-loop.md), blokirajte nevarne vsebine z [guardrails](../reference/guardrails.md) in upravljajte dostop s [credentials](../tabs/credentials-tab.md), [ekipami](../reference/teams.md), [enotno prijavo](../reference/sso.md) in [revizijsko sledjo](../reference/audit.md)
- **Izpostavite** – Strežite Workflowe prek REST in [SSE streaminga](../reference/sse-streaming.md), kot [MCP](../tabs/mcp-tab.md) orodja in kot [Portal](../reference/portal.md) klepetalne vmesnike za končne uporabnike; uporabite zavihek [Chat](../tabs/chat-tab.md) za neposredno testiranje modelov
- **Klepetajte s Heymom** – Postavljajte vprašanja o izdelku, ki se zavedajo strani, v dialogu [Klepet s Heymom](../reference/chat-with-heym.md) v dokumentaciji

## Ključni koncepti

- **Workflows** – Usmerjen graf vozlišč in povezav. Upravljajte jih v zavihku [Workflows](../tabs/workflows-tab.md). Glejte [Workflow Structure](../reference/workflow-structure.md).
- **Nodes** – Procesne enote ([Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md) itd.). Glejte [Node Types](../reference/node-types.md).
- **Edges** – Povezave, ki določajo potek izvajanja
- **Credentials** – API ključi in skrivnosti, shranjeni v zavihku [Credentials](../tabs/credentials-tab.md), na katere se sklicujejo vozlišča.
- **Variables** – Trajni podatki ključ-vrednost v zavihku [Variables](../tabs/global-variables-tab.md), dostopni prek `$global.variableName`. Glejte [Global Variables](../reference/global-variables.md).
- **Expressions** – Sklicujte se na podatke nadrejenih vozlišč z `$input` in `$nodeName.field`. Glejte [Expression DSL](../reference/expression-dsl.md).

## Povezane vsebine

- [Why Heym](./why-heym.md) – Kaj Heym obravnava v vsaki fazi življenjskega cikla agenta
- [Quick Start](./quick-start.md) – Zgradite svoj prvi workflow
- [Running & Deployment](./running-and-deployment.md) – Zaženite lokalno z `run.sh` ali namestite z `deploy.sh`
- [AI Assistant](../reference/ai-assistant.md) – Ustvarjajte workflows z naravnim jezikom
- [Chat with Heym](../reference/chat-with-heym.md) – Postavljajte nadaljnja vprašanja med branjem dokumentacije
- [Core Concepts](./core-concepts.md) – Workflows, nodes in potek izvajanja
- [Workflows Tab](../tabs/workflows-tab.md) – Upravljajte workflows in mape
- [Credentials Tab](../tabs/credentials-tab.md) – Dodajte API ključe za vozlišča
