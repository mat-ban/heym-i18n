# Ātrā sākšana

Palaidiet savu pirmo Heym Workflow dažu minūšu laikā.

Vai Heym vēl nav palaists? Skatiet [Running & Deployment](./running-and-deployment.md) vai sekojiet video pamācībai: [Set Up Heym Locally in Under 2 Minutes](https://www.youtube.com/watch?v=P6YvlupUboU).

## 1. Izveidojiet Workflow

1. Dodieties uz cilni [Workflows](../tabs/workflows-tab.md)
2. Noklikšķiniet uz **New Workflow**
3. Piešķiriet savam workflow nosaukumu (piem., "Hello World")

## 2. Pievienojiet Nodes

1. Atveriet paneli **Nodes** kreisajā pusē
2. Velciet [Input](../nodes/input-node.md) node uz audekla
3. Velciet [LLM](../nodes/llm-node.md) node un savienojiet to ar Input
4. Velciet [Output](../nodes/output-node.md) node un savienojiet to ar LLM

```
[Input] --> [LLM] --> [Output]
```

Skatiet [Node Types](../reference/node-types.md), lai uzzinātu par visiem pieejamajiem nodes.

## 3. Konfigurējiet

- **Input**: Iestatiet noklusējuma vērtību vai atstājiet tukšu lietotāja ievadei (skatiet [Input Node](../nodes/input-node.md))
- **LLM**: Izvēlieties [credential](../tabs/credentials-tab.md) un modeli, pievienojiet sistēmas instrukciju un iestatiet `userMessage` uz `$input.text` (skatiet [LLM Node](../nodes/llm-node.md))
- **Output**: Iestatiet `message` uz `$llm.text`, lai nodotu LLM atbildi (skatiet [Output Node](../nodes/output-node.md))

Izmantojiet [Expression DSL](../reference/expression-dsl.md) sintaksi `$input.text` un `$llm.text` vērtībām. Noklikšķiniet uz paplašināšanas pogas izteiksmes laukos, lai atvērtu [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) ar tiešu backend priekšskatījumu.

## 4. Palaidiet

Noklikšķiniet uz **Run**, nospiediet `Ctrl + Enter` vai izmantojiet atkļūdošanas paneli, lai izpildītu. Workflow tiek palaists no Input node caur savienotajiem nodes līdz Output. Skatiet [Triggers](../reference/triggers.md), lai uzzinātu citus veidus, kā palaist workflow ([webhook](../reference/webhooks.md), portāls, cron utt.).

Skatiet iepriekšējos palaišanas gadījumus sadaļā **History** (rīkjoslā) un izmantojiet **Bring to Canvas**, lai palaistu atkārtoti ar tiem pašiem ievades datiem.

Docs, Evals un citās iekšējās lapās, kas nav audekls, varat arī izmantot [Quick Drawer](../reference/quick-drawer.md), lai izvēlētos piespraustu workflow un palaistu to, neatgriežoties redaktorā.

Ja lasāt dokumentāciju un vēlaties precizējumu pirms veidošanas, atveriet [Chat with Heym](../reference/chat-with-heym.md) no Docs galvenes, lai uzdotu jautājumus par konkrēto lapu.

Alternatīvi izmantojiet [AI Assistant](../reference/ai-assistant.md) no Debug paneļa, lai veidotu workflow ar dabiskās valodas palīdzību—aprakstiet, ko vēlaties, un AI ģenerēs nodes un savienojumus.

Jau veidojat automatizācijas citā rīkā? [Migrate to Heym](./migrate-to-heym.md) pārveido n8n, Flowise, Dify, Langflow, sim.ai vai Activepieces workflow par Heym workflow, ko varat importēt.

## Saistītie

- [Pamatkoncepcijas](./core-concepts.md) – Workflow, mezgli un izpildes plūsma
- [Migrēšana uz Heym](./migrate-to-heym.md) – Konvertējiet n8n, Flowise, Dify, Langflow, sim.ai vai Activepieces workflow uz Heym ar AI palīdzību
- [Palaišana un izvietošana](./running-and-deployment.md) – Palaidiet lokāli ar `run.sh` vai izvietojiet ar `deploy.sh`
- [Vides mainīgie](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Pilnīga konfigurācijas uzziņa
- [Iestatījumi](../reference/user-settings.md) – Konfigurējiet vārdu, lietotāja noteikumus un paroli
- [Canvas funkcijas](../reference/canvas-features.md) – Data pin, izpildes žurnāli, iespējošana/atspējošana, izvilkšana apakš-workflow
- [Tastatūras saīsnes](../reference/keyboard-shortcuts.md) – Canvas un redaktora saīsnes
- [Expression DSL](../reference/expression-dsl.md) – Datu atsaukšana mezgla konfigurācijā
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Paplašināms redaktors ar tiešu backend priekšskatījumu
- [Triggers](../reference/triggers.md) – Visi workflow ieejas punkti ([webhook](../reference/webhooks.md), portāls, cron utt.)
- [Izpildes vēsture](../reference/execution-history.md) – Skatiet iepriekšējos palaišanas gadījumus un Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Palaidiet piespraustos workflow no lapām, kas nav canvas
- [Tērzēšana ar Heym](../reference/chat-with-heym.md) – Uzdodiet kontekstuālus jautājumus no dokumentācijas galvenes
- [Workflows cilne](../tabs/workflows-tab.md) – Izveidojiet un pārvaldiet workflow
- [Credentials cilne](../tabs/credentials-tab.md) – Pievienojiet API atslēgas LLM mezgliem
- [AI Assistant](../reference/ai-assistant.md) – Izveidojiet workflow ar dabiskās valodas palīdzību
