# Pamatkoncepcijas

## Workflows

Workflow ir virzīts grafs, ko veido [**mezgli**](../reference/node-types.md), kas savienoti ar **šķautnēm**. Pārvaldiet Workflow cilnē [Workflows](../tabs/workflows-tab.md). Organizējiet tos [mapēs](../reference/workflow-organization.md). Izpilde plūst no [trigger mezgliem](../reference/triggers.md) ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) caur apstrādes mezgliem uz [izvades](../nodes/output-node.md) mezgliem. Skatiet [Workflow struktūru](../reference/workflow-structure.md) attiecībā uz JSON formātu. Saglabājiet un kopīgojiet Workflow kā [Veidnes](../tabs/templates-tab.md), lai tās atkārtoti izmantotu dažādos projektos. Workflow var arī palaist no [Board](../tabs/board-tab.md), kur kanban kartītes aktivizē kolonnas workflow ķēdi ar kartītes pilno kontekstu.

## Mezgli

Katram mezglam ir:

- **Tips** – Nosaka uzvedību (piem., `llm`, `condition`, `http`)
- **Dati** – Konfigurācija (modelis, prompt, URL utt.)
- **Ievades/Izvades** – Savienojuma punkti savienošanai ar citiem mezgliem

Skatiet [Mezglu tipus](../reference/node-types.md) pilnam sarakstam.

## Šķautnes

Šķautnes savieno avota mezgla izvades punktu ar mērķa mezgla ievades punktu. Izpildes laikā dati plūst pa šķautnēm.

## Izpildes plūsma

1. **Trigger** – Input, Cron, Telegram Trigger, Discord Trigger, IMAP Trigger vai [WebSocket Trigger](../nodes/websocket-trigger-node.md) mezgls sāk izpildi (skatiet [Triggers](../reference/triggers.md))
2. **Lejupstraumes** – Katrs mezgls saņem izvadi no savienotajiem augšupstraumes mezgliem; [paralēlā izpilde](../reference/parallel-execution.md) palaiž neatkarīgus mezglus vienlaicīgi
3. **Izteiksmes** – Mezgli atsaucas uz augšupstraumes datiem, izmantojot `$nodeLabel.field`. Skatiet [Expression DSL](../reference/expression-dsl.md).
4. **Izvade** – [Output](../nodes/output-node.md) mezgls rada gala rezultātu

## Izteiksmju atsauces

Izmantojiet `$input` Input node datiem un `$nodeLabel.field` jebkuram augšupējam node. Piemērs: `$llm.text` atsaucas uz `text` lauku no node ar apzīmējumu "llm". Pilna sintakse: [Expression DSL](../reference/expression-dsl.md). Izteiksmju rediģēšanai izmantojiet [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md), lai iegūtu paplašinātu redaktoru ar tiešu backend priekšskatījumu.

## Saistītie

- [Ātrā sākšana](./quick-start.md) – Izveidojiet savu pirmo workflow
- [Canvas funkcijas](../reference/canvas-features.md) – Data pin, izpildes žurnāli, iespējošana/atspējošana, izvilkšana apakš-workflow
- [AI Assistant](../reference/ai-assistant.md) – Veidojiet workflow ar dabiskās valodas palīdzību
- [Node tipi](../reference/node-types.md) – Visi pieejamie node
- [Expression DSL](../reference/expression-dsl.md) – Datu atsaukšana izteiksmēs
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Paplašināms redaktors ar tiešu backend priekšskatījumu
- [Workflows cilne](../tabs/workflows-tab.md) – Pārvaldiet workflow un mapes
- [Workflow organizācija](../reference/workflow-organization.md) – Mapes un plānotā dzēšana
- [Triggers](../reference/triggers.md) – Workflow ieejas punkti
- [Webhooks](../reference/webhooks.md) – HTTP webhook trigger (TTL, kešatmiņa, pieprasījumu limits)
- [Paralēlā izpilde](../reference/parallel-execution.md) – Kā node darbojas paralēli
