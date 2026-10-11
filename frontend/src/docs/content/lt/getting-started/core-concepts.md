# Pagrindinės sąvokos

## Workflow

Workflow – tai kryptinis grafas, sudarytas iš [**nodes**](../reference/node-types.md), sujungtų **edges**. Workflow tvarkomi skirtuke [Workflows](../tabs/workflows-tab.md). Organizuokite juos [folders](../reference/workflow-organization.md). Vykdymas prasideda nuo [trigger nodes](../reference/triggers.md) ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) ir tęsiasi per apdorojimo nodes iki [output](../nodes/output-node.md) nodes. Žr. [Workflow Structure](../reference/workflow-structure.md) dėl JSON formato. Išsaugokite ir bendrinkite workflow kaip [Templates](../tabs/templates-tab.md), kad galėtumėte juos pakartotinai naudoti skirtinguose projektuose. Workflow taip pat gali būti paleidžiami iš [Board](../tabs/board-tab.md), kur kanban kortelės paleidžia stulpelio workflow grandinę su visu kortelės kontekstu.

## Nodes

Kiekvienas node turi:

- **Type** – Nustato elgseną (pvz., `llm`, `condition`, `http`)
- **Data** – Konfigūracija (modelis, prompt, URL ir t. t.)
- **Inputs/Outputs** – Rankenos, skirtos prisijungti prie kitų nodes

Visą sąrašą žr. [Node Types](../reference/node-types.md).

## Edges

Edges sujungia šaltinio node output rankeną su tikslo node input rankena. Vykdymo metu duomenys teka per edges.

## Vykdymo eiga

1. **Trigger** – Input, Cron, Telegram Trigger, Discord Trigger, IMAP Trigger arba [WebSocket Trigger](../nodes/websocket-trigger-node.md) node pradeda vykdymą (žr. [Triggers](../reference/triggers.md))
2. **Downstream** – Kiekvienas node gauna output iš prijungtų upstream nodes; [parallel execution](../reference/parallel-execution.md) vykdo nepriklausomus nodes vienu metu
3. **Expressions** – Nodes nurodo upstream duomenis per `$nodeLabel.field`. Žr. [Expression DSL](../reference/expression-dsl.md).
4. **Output** – [Output](../nodes/output-node.md) node pateikia galutinį rezultatą

## Išraiškų nuorodos

Naudokite `$input` Input mazgo duomenims ir `$nodeLabel.field` bet kuriam priešingam mazgui. Pavyzdys: `$llm.text` nurodo `text` lauką iš mazgo, pažymėto "llm". Pilna sintaksė: [Expression DSL](../reference/expression-dsl.md). Naudokite [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) didesniam redaktoriui su tiesiogine backend peržiūra, kai redaguojate išraiškas.

## Susiję

- [Greita pradžia](./quick-start.md) – Sukurkite savo pirmąjį workflow
- [Canvas funkcijos](../reference/canvas-features.md) – Data pin, vykdymo žurnalai, įjungimas/išjungimas, ištraukimas į sub-workflow
- [AI asistentas](../reference/ai-assistant.md) – Kurkite workflow naudodami natūralią kalbą
- [Mazgų tipai](../reference/node-types.md) – Visi galimi mazgai
- [Expression DSL](../reference/expression-dsl.md) – Duomenų nurodymas išraiškose
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Išplečiamas redaktorius su tiesiogine backend peržiūra
- [Workflows skirtukas](../tabs/workflows-tab.md) – Tvarkykite workflow ir aplankus
- [Workflow organizavimas](../reference/workflow-organization.md) – Aplankai ir suplanuotas trynimas
- [Triggers](../reference/triggers.md) – Workflow įėjimo taškai
- [Webhooks](../reference/webhooks.md) – HTTP webhook trigger (TTL, cache, rate limit)
- [Lygiagretus vykdymas](../reference/parallel-execution.md) – Kaip mazgai vykdomi lygiagrečiai
