# Osnovni koncepti

## Workflows

Workflow je usmjereni graf [**nodeova**](../reference/node-types.md) povezanih **edgeovima**. Upravljajte workflowima u kartici [Workflows](../tabs/workflows-tab.md). Organizirajte ih u [mape](../reference/workflow-organization.md). Izvršavanje teče od [trigger nodeova](../reference/triggers.md) ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) kroz nodeove za obradu do [output](../nodes/output-node.md) nodeova. Pogledajte [Workflow Structure](../reference/workflow-structure.md) za JSON format. Spremite i podijelite workflowe kao [Templates](../tabs/templates-tab.md) kako biste ih ponovno koristili u različitim projektima. Workflowi se također mogu pokretati s [Boarda](../tabs/board-tab.md), gdje kanban kartice pokreću workflow lanac stupca s punim kontekstom kartice.

## Nodes

Svaki node ima:

- **Type** – Određuje ponašanje (npr. `llm`, `condition`, `http`)
- **Data** – Konfiguracija (model, prompt, URL itd.)
- **Inputs/Outputs** – Ručke za povezivanje s drugim nodeovima

Pogledajte [Node Types](../reference/node-types.md) za potpuni popis.

## Edges

Edgeovi povezuju output ručku izvornog nodea s input ručkom ciljnog nodea. Podaci putuju duž edgeova tijekom izvršavanja.

## Execution Flow

1. **Trigger** – Input, Cron, Telegram Trigger, Discord Trigger, IMAP Trigger ili [WebSocket Trigger](../nodes/websocket-trigger-node.md) node pokreće izvršavanje (pogledajte [Triggers](../reference/triggers.md))
2. **Downstream** – Svaki node prima output od povezanih upstream nodeova; [paralelno izvršavanje](../reference/parallel-execution.md) pokreće neovisne nodeove istovremeno
3. **Expressions** – Nodeovi referenciraju upstream podatke putem `$nodeLabel.field`. Pogledajte [Expression DSL](../reference/expression-dsl.md).
4. **Output** – [Output](../nodes/output-node.md) node proizvodi konačni rezultat

## Reference izraza

Koristite `$input` za podatke Input node-a i `$nodeLabel.field` za bilo koji uzvodni node. Primjer: `$llm.text` referencira polje `text` iz node-a označenog kao "llm". Puna sintaksa: [Expression DSL](../reference/expression-dsl.md). Koristite [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) za veći editor s pregledom uživo na backendu prilikom uređivanja izraza.

## Povezano

- [Brzi početak](./quick-start.md) – Izradite svoj prvi workflow
- [Značajke platna](../reference/canvas-features.md) – Data pin, zapisnici izvršavanja, omogućavanje/onemogućavanje, izdvajanje u pod-workflow
- [AI asistent](../reference/ai-assistant.md) – Izradite workflowe prirodnim jezikom
- [Vrste node-ova](../reference/node-types.md) – Svi dostupni node-ovi
- [Expression DSL](../reference/expression-dsl.md) – Referenciranje podataka u izrazima
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Proširivi editor s pregledom uživo na backendu
- [Kartica Workflows](../tabs/workflows-tab.md) – Upravljanje workflowima i mapama
- [Organizacija workflowa](../reference/workflow-organization.md) – Mape i zakazano brisanje
- [Triggeri](../reference/triggers.md) – Ulazne točke za workflowe
- [Webhookovi](../reference/webhooks.md) – HTTP webhook trigger (TTL, cache, ograničenje brzine)
- [Paralelno izvršavanje](../reference/parallel-execution.md) – Kako node-ovi rade paralelno
