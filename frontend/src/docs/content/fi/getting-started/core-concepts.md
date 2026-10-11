# Keskeiset käsitteet

## Workflow't

Workflow on suunnattu graafi, joka koostuu [**solmuista**](../reference/node-types.md), jotka on yhdistetty **edgeillä**. Workflow'ita hallitaan [Workflows](../tabs/workflows-tab.md) -välilehdellä. Ne voidaan järjestellä [kansioihin](../reference/workflow-organization.md). Suoritus etenee [trigger-solmuista](../reference/triggers.md) ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) käsittelysolmujen kautta [output](../nodes/output-node.md) -solmuihin. JSON-muoto on kuvattu kohdassa [Workflow Structure](../reference/workflow-structure.md). Workflow't voidaan tallentaa ja jakaa [Templates](../tabs/templates-tab.md) -malleina uudelleenkäyttöä varten eri projekteissa. Workflow'ita voidaan suorittaa myös [Board](../tabs/board-tab.md) -näkymästä, jossa kanban-kortit käynnistävät sarakkeen workflow-ketjun kortin täydellä kontekstilla.

## Solmut

Jokaisella solmulla on:

- **Type** – Määrittää toiminnan (esim. `llm`, `condition`, `http`)
- **Data** – Konfiguraatio (malli, prompt, URL jne.)
- **Inputs/Outputs** – Kahvat yhteyksien muodostamiseen muihin solmuihin

Täydellinen luettelo: [Node Types](../reference/node-types.md).

## Edget

Edget yhdistävät lähdesolmun output-kahvan kohdesolmun input-kahvaan. Data kulkee edgejä pitkin suorituksen aikana.

## Suorituksen kulku

1. **Trigger** – Input-, Cron-, Telegram Trigger-, Discord Trigger-, IMAP Trigger- tai [WebSocket Trigger](../nodes/websocket-trigger-node.md) -solmu käynnistää suorituksen (ks. [Triggers](../reference/triggers.md))
2. **Downstream** – Jokainen solmu vastaanottaa outputin yhdistetyiltä upstream-solmuilta; [parallel execution](../reference/parallel-execution.md) suorittaa riippumattomat solmut samanaikaisesti
3. **Expressions** – Solmut viittaavat upstream-dataan komennolla `$nodeLabel.field`. Ks. [Expression DSL](../reference/expression-dsl.md).
4. **Output** – [Output](../nodes/output-node.md) -solmu tuottaa lopputuloksen

## Expression-viittaukset

Käytä `$input` Input-solmun dataan ja `$nodeLabel.field` mihin tahansa upstream-solmuun. Esimerkki: `$llm.text` viittaa `text`-kenttään solmusta, jonka label on "llm". Täysi syntaksi: [Expression DSL](../reference/expression-dsl.md). Käytä [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) -ikkunaa laajempaan editoriin, jossa on reaaliaikainen backend-esikatselu expressioneja muokatessa.

## Aiheeseen liittyvät

- [Quick Start](./quick-start.md) – Rakenna ensimmäinen workflow
- [Canvas Features](../reference/canvas-features.md) – Data pin, suorituslokit, enable/disable, extract to sub-workflow
- [AI Assistant](../reference/ai-assistant.md) – Luo workflow'ita luonnollisella kielellä
- [Node Types](../reference/node-types.md) – Kaikki saatavilla olevat solmut
- [Expression DSL](../reference/expression-dsl.md) – Datan viittaaminen expressioneissa
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Laajennettava editori, jossa reaaliaikainen backend-esikatselu
- [Workflows Tab](../tabs/workflows-tab.md) – Workflow'iden ja kansioiden hallinta
- [Workflow Organization](../reference/workflow-organization.md) – Kansiot ja ajastettu poisto
- [Triggers](../reference/triggers.md) – Workflow'iden aloituspisteet
- [Webhooks](../reference/webhooks.md) – HTTP webhook -trigger (TTL, cache, rate limit)
- [Parallel Execution](../reference/parallel-execution.md) – Miten solmut suoritetaan rinnakkain
