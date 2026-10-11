# Kiire alustamine

Saate oma esimese Heymi Workflowi käima vaid mõne minutiga.

Kas Heym ei ole veel käimas? Vaadake [Käitamine ja juurutamine](./running-and-deployment.md) või järgige videojuhendit: [Seadistage Heym lokaalselt alla 2 minutiga](https://www.youtube.com/watch?v=P6YvlupUboU).

## 1. Looge Workflow

1. Minge vahekaardile [Workflows](../tabs/workflows-tab.md)
2. Klõpsake **New Workflow**
3. Nimetage oma workflow (nt "Hello World")

## 2. Lisage Nodes

1. Avage vasakul paneel **Nodes**
2. Lohistage [Input](../nodes/input-node.md) node lõuendile
3. Lohistage [LLM](../nodes/llm-node.md) node ja ühendage see Inputiga
4. Lohistage [Output](../nodes/output-node.md) node ja ühendage see LLM-iga

```
[Input] --> [LLM] --> [Output]
```

Kõigi saadaolevate node'ide kohta vaadake [Node Types](../reference/node-types.md).

## 3. Seadistage

- **Input**: Määrake vaikeväärtus või jätke tühjaks kasutaja sisendi jaoks (vaadake [Input Node](../nodes/input-node.md))
- **LLM**: Valige [credential](../tabs/credentials-tab.md) ja mudel, lisage süsteemijuhis ning määrake `userMessage` väärtuseks `$input.text` (vaadake [LLM Node](../nodes/llm-node.md))
- **Output**: Määrake `message` väärtuseks `$llm.text`, et edastada LLM-i vastus (vaadake [Output Node](../nodes/output-node.md))

Kasutage `$input.text` ja `$llm.text` puhul [Expression DSL](../reference/expression-dsl.md) süntaksit. Klõpsake avamisnuppu avaldiseväljadel, et avada [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) reaalajas backendi eelvaatega.

## 4. Käivitage

Klõpsake **Run**, vajutage `Ctrl + Enter` või kasutage käivitamiseks debug-paneeli. Workflow käivitub Input node'ist läbi ühendatud node'ide Output node'ini. Muude workflow'ide käivitamise viiside kohta vaadake [Triggers](../reference/triggers.md) ([webhook](../reference/webhooks.md), portaal, cron jne).

Varasemate käivituste vaatamiseks avage **History** (tööriistaribal) ja kasutage **Bring to Canvas**, et uuesti käivitada samade sisenditega.

Docs, Evals ja teistel mitte-lõuendi sisemistel lehtedel saate kasutada ka [Quick Drawer](../reference/quick-drawer.md), et valida kinnitatud workflow ja see käivitada ilma redaktorisse tagasi minemata.

Kui loete dokumentatsiooni ja soovite enne ehitamist täpsustusi, avage Docs päisest [Chat with Heym](../reference/chat-with-heym.md), et esitada lehekülge teadvustavaid küsimusi.

Teise võimalusena kasutage Debug-paneelist [AI Assistant](../reference/ai-assistant.md), et luua workflow'sid loomulikus keeles—kirjeldage, mida soovite, ja AI genereerib node'id ja servad.

Ehitate juba automatiseerimisi mõnes teises tööriistas? [Migrate to Heym](./migrate-to-heym.md) teisendab n8n, Flowise, Dify, Langflow, sim.ai või Activepieces workflow imporditavaks Heymi workflow'ks.

## Seotud

- [Põhikontseptsioonid](./core-concepts.md) – Workflow'd, sõlmed ja täitmise voog
- [Migreerimine HeyMIle](./migrate-to-heym.md) – Teisendage n8n, Flowise, Dify, Langflow, sim.ai või Activepieces workflow'd HeyMIle AI abil
- [Käivitamine ja juurutamine](./running-and-deployment.md) – Käivitage lokaalselt käsuga `run.sh` või juurutage käsuga `deploy.sh`
- [Keskkonnamuutujad](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Täielik konfiguratsiooni viide
- [Seaded](../reference/user-settings.md) – Seadistage nimi, User Rules ja parool
- [Canvas funktsioonid](../reference/canvas-features.md) – Andmete kinnitamine, täitmislogid, lubamine/keelamine, alam-workflow'ks eraldamine
- [Klaviatuuri otseteed](../reference/keyboard-shortcuts.md) – Canvas ja redaktori otseteed
- [Expression DSL](../reference/expression-dsl.md) – Andmetele viitamine sõlme konfiguratsioonis
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Laiendatav redaktor reaalajas backend eelvaatega
- [Triggerid](../reference/triggers.md) – Kõik workflow'de sisendpunktid ([webhook](../reference/webhooks.md), portaal, cron jne)
- [Täitmise ajalugu](../reference/execution-history.md) – Vaadake varasemaid käivitusi ja tooge Canvas'ele
- [Quick Drawer](../reference/quick-drawer.md) – Käivitage kinnitatud workflow'sid lehtedelt, mis ei ole Canvas
- [Chat with Heym](../reference/chat-with-heym.md) – Esitage kontekstipõhiseid küsimusi dokumentatsiooni päisest
- [Workflows vahekaart](../tabs/workflows-tab.md) – Looge ja haldake workflow'sid
- [Credentials vahekaart](../tabs/credentials-tab.md) – Lisage API võtmeid LLM sõlmedele
- [AI Assistant](../reference/ai-assistant.md) – Looge workflow'sid loomulikus keeles
