# Osnovni koncepti

## Workflowi

Workflow je usmerjen graf [**vozlišč**](../reference/node-types.md), povezanih s **povezavami**. Workflowe upravljate v zavihku [Workflows](../tabs/workflows-tab.md). Organizirate jih v [mape](../reference/workflow-organization.md). Izvajanje poteka od [trigger vozlišč](../reference/triggers.md) ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) prek procesnih vozlišč do [output](../nodes/output-node.md) vozlišč. Za format JSON glejte [Struktura workflowa](../reference/workflow-structure.md). Shranite in delite workflowe kot [Predloge](../tabs/templates-tab.md), da jih ponovno uporabite v različnih projektih. Workflowi se lahko izvajajo tudi iz [Board](../tabs/board-tab.md), kjer kanban kartice sprožijo verigo workflowa stolpca s celotnim kontekstom kartice.

## Vozlišča

Vsako vozlišče ima:

- **Tip** – Določa vedenje (npr. `llm`, `condition`, `http`)
- **Podatki** – Konfiguracija (model, prompt, URL itd.)
- **Vhodi/Izhodi** – Ročaji za povezovanje z drugimi vozlišči

Za celoten seznam glejte [Tipi vozlišč](../reference/node-types.md).

## Povezave

Povezave povežejo izhodni ročaj izvornega vozlišča z vhodnim ročajem ciljnega vozlišča. Podatki med izvajanjem tečejo po povezavah.

## Potek izvajanja

1. **Trigger** – Input, Cron, Telegram Trigger, Discord Trigger, IMAP Trigger ali [WebSocket Trigger](../nodes/websocket-trigger-node.md) vozlišče začne izvajanje (glejte [Triggers](../reference/triggers.md))
2. **Downstream** – Vsako vozlišče prejme izhod od povezanih upstream vozlišč; [vzporedno izvajanje](../reference/parallel-execution.md) izvaja neodvisna vozlišča sočasno
3. **Izrazi** – Vozlišča referencirajo upstream podatke prek `$nodeLabel.field`. Glejte [Expression DSL](../reference/expression-dsl.md).
4. **Output** – [Output](../nodes/output-node.md) vozlišče ustvari končni rezultat

## Sklicevanja na izraze

Uporabite `$input` za podatke vozlišča Input in `$nodeLabel.field` za katero koli nadrejeno vozlišče. Primer: `$llm.text` se sklicuje na polje `text` iz vozlišča z oznako "llm". Celotna sintaksa: [Expression DSL](../reference/expression-dsl.md). Pri urejanju izrazov uporabite [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) za večji urejevalnik z predogledom v živo na zaledju.

## Povezane vsebine

- [Hitri začetek](./quick-start.md) – Zgradite svoj prvi Workflow
- [Funkcije platna](../reference/canvas-features.md) – Data pin, dnevniki izvajanja, omogočanje/onemogočanje, izvoz v pod-Workflow
- [AI Assistant](../reference/ai-assistant.md) – Ustvarjanje Workflowov z naravnim jezikom
- [Vrste vozlišč](../reference/node-types.md) – Vsa razpoložljiva vozlišča
- [Expression DSL](../reference/expression-dsl.md) – Sklicevanje na podatke v izrazih
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Razširljiv urejevalnik s predogledom v živo na zaledju
- [Zavihek Workflows](../tabs/workflows-tab.md) – Upravljanje Workflowov in map
- [Organizacija Workflowov](../reference/workflow-organization.md) – Mape in načrtovano brisanje
- [Triggers](../reference/triggers.md) – Vstopne točke za Workflowe
- [Webhooks](../reference/webhooks.md) – HTTP Webhook Trigger (TTL, predpomnilnik, omejitev hitrosti)
- [Vzporedno izvajanje](../reference/parallel-execution.md) – Kako vozlišča tečejo vzporedno
