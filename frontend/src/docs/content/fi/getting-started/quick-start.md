# Pika-aloitus

Ensimmäinen Heym-työnkulku käyttöön minuuteissa.

Eikö Heym ole vielä käynnissä? Katso [Käyttö & käyttöönotto](./running-and-deployment.md) tai seuraa videokävelyvideota: [Set Up Heym Locally in Under 2 Minutes](https://www.youtube.com/watch?v=P6YvlupUboU).

## 1. Luo työnkulku

1. Siirry [Workflows](../tabs/workflows-tab.md) -välilehdelle
2. Napsauta **New Workflow**
3. Nimeä työnkulku (esim. "Hello World")

## 2. Lisää solmut

1. Avaa **Nodes** -paneeli vasemmalta
2. Vedä [Input](../nodes/input-node.md) -solmu piirtoalueelle
3. Vedä [LLM](../nodes/llm-node.md) -solmu ja yhdistä se Input-solmuun
4. Vedä [Output](../nodes/output-node.md) -solmu ja yhdistä se LLM-solmuun

```
[Input] --> [LLM] --> [Output]
```

Katso [Node Types](../reference/node-types.md) kaikista saatavilla olevista solmuista.

## 3. Määritä

- **Input**: Aseta oletusarvo tai jätä tyhjäksi käyttäjän syötettä varten (katso [Input Node](../nodes/input-node.md))
- **LLM**: Valitse [credential](../tabs/credentials-tab.md) ja malli, lisää järjestelmäohje ja aseta `userMessage` arvoon `$input.text` (katso [LLM Node](../nodes/llm-node.md))
- **Output**: Aseta `message` arvoon `$llm.text` välittääksesi LLM-vastauksen (katso [Output Node](../nodes/output-node.md))

Käytä [Expression DSL](../reference/expression-dsl.md) -syntaksia `$input.text` ja `$llm.text` -viittauksissa. Napsauta laajennuspainiketta lausekekentissä avataksesi [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) -ikkunan, jossa on reaaliaikainen backend-esikatselu.

## 4. Suorita

Napsauta **Run**, paina `Ctrl + Enter` tai käytä debug-paneelia suorittaaksesi. Työnkulku etenee Input-solmusta yhdistettyjen solmujen kautta Output-solmuun. Katso [Triggers](../reference/triggers.md) muista tavoista suorittaa työnkulkuja ([webhook](../reference/webhooks.md), portaali, cron jne.).

Tarkastele aiempia suorituksia **History**-kohdassa (työkalurivi) ja käytä **Bring to Canvas** suorittaaksesi uudelleen samoilla syötteillä.

Docs-, Evals- ja muilla ei-piirtoalueen sisäisillä sivuilla voidaan myös käyttää [Quick Drawer](../reference/quick-drawer.md) -toimintoa kiinnitetyn työnkulun valitsemiseen ja suorittamiseen palaamatta editoriin.

Jos luet dokumentaatiota ja haluat selvennystä ennen rakentamista, avaa [Chat with Heym](../reference/chat-with-heym.md) Docs-otsikosta esittääksesi sivukohtaisia kysymyksiä.

Vaihtoehtoisesti voit käyttää [AI Assistant](../reference/ai-assistant.md) -toimintoa Debug-paneelista luodaksesi työnkulkuja luonnollisella kielellä—kuvaile mitä haluat, ja AI luo solmut ja yhteydet.

Rakennatko jo automaatioita toisessa työkalussa? [Migrate to Heym](./migrate-to-heym.md) muuntaa n8n-, Flowise-, Dify-, Langflow-, sim.ai- tai Activepieces-työnkulun Heym-työnkuluksi, jonka voit tuoda.

## Aiheeseen liittyvät

- [Core Concepts](./core-concepts.md) – Työnkulut, solmut ja suoritusvirta
- [Migrate to Heym](./migrate-to-heym.md) – Muunna n8n-, Flowise-, Dify-, Langflow-, sim.ai- tai Activepieces-työnkulut Heym-muotoon AI:n avulla
- [Käyttö & käyttöönotto](./running-and-deployment.md) – Käynnistä paikallisesti `run.sh`-skriptillä tai ota käyttöön `deploy.sh`-skriptillä
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Täydellinen konfiguraatioviite
- [Settings](../reference/user-settings.md) – Määritä nimi, User Rules ja salasana
- [Canvas Features](../reference/canvas-features.md) – Data pin, suorituslokit, käyttöönotto/poisto, extract to sub-workflow
- [Keyboard Shortcuts](../reference/keyboard-shortcuts.md) – Piirtoalueen ja editorin pikanäppäimet
- [Expression DSL](../reference/expression-dsl.md) – Datan viittaaminen solmun konfiguraatiossa
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Laajennettava editori reaaliaikaisella backend-esikatselulla
- [Triggers](../reference/triggers.md) – Kaikki työnkulun aloituspisteet ([webhook](../reference/webhooks.md), portaali, cron jne.)
- [Execution History](../reference/execution-history.md) – Tarkastele aiempia suorituksia ja Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Suorita kiinnitetyt työnkulut ei-piirtoalueen sivuilta
- [Chat with Heym](../reference/chat-with-heym.md) – Esitä kontekstuaalisia kysymyksiä docs-otsikosta
- [Workflows Tab](../tabs/workflows-tab.md) – Luo ja hallinnoi työnkulkuja
- [Credentials Tab](../tabs/credentials-tab.md) – Lisää API-avaimet LLM-solmuille
- [AI Assistant](../reference/ai-assistant.md) – Luo työnkulkuja luonnollisella kielellä
