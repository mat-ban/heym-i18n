# Greitas startas

Paleiskite savo pirmąjį Heym Workflow per kelias minutes.

Dar neturite paleisto Heym? Žr. [Paleidimas ir diegimas](./running-and-deployment.md) arba sekite vaizdo įrašo instrukcijas: [Nustatykite Heym lokaliai per mažiau nei 2 minutes](https://www.youtube.com/watch?v=P6YvlupUboU).

## 1. Sukurkite Workflow

1. Eikite į [Workflows](../tabs/workflows-tab.md) skirtuką
2. Spustelėkite **New Workflow**
3. Pavadinkite savo workflow (pvz., „Hello World")

## 2. Pridėkite Nodes

1. Atidarykite **Nodes** skydelį kairėje
2. Nutempkite [Input](../nodes/input-node.md) node į drobę
3. Nutempkite [LLM](../nodes/llm-node.md) node ir prijunkite jį prie Input
4. Nutempkite [Output](../nodes/output-node.md) node ir prijunkite jį prie LLM

```
[Input] --> [LLM] --> [Output]
```

Visų galimų nodes sąrašą rasite [Node Types](../reference/node-types.md).

## 3. Konfigūruokite

- **Input**: Nustatykite numatytąją reikšmę arba palikite tuščią, kad vartotojas galėtų įvesti (žr. [Input Node](../nodes/input-node.md))
- **LLM**: Pasirinkite [credential](../tabs/credentials-tab.md) ir modelį, pridėkite sistemos instrukciją ir nustatykite `userMessage` į `$input.text` (žr. [LLM Node](../nodes/llm-node.md))
- **Output**: Nustatykite `message` į `$llm.text`, kad būtų perduotas LLM atsakymas (žr. [Output Node](../nodes/output-node.md))

Naudokite [Expression DSL](../reference/expression-dsl.md) sintaksę `$input.text` ir `$llm.text` laukams. Spustelėkite išplėtimo mygtuką prie išraiškos laukų, kad atidarytumėte [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) su tiesiogine backend peržiūra.

## 4. Paleiskite

Spustelėkite **Run**, paspauskite `Ctrl + Enter` arba naudokite debug skydelį vykdymui. Workflow vykdomas nuo Input node per sujungtus nodes iki Output. Kitus būdus paleisti workflow rasite [Triggers](../reference/triggers.md) ([webhook](../reference/webhooks.md), portalas, cron ir kt.).

Ankstesnius vykdymus peržiūrėkite **History** (įrankių juosta) ir naudokite **Bring to Canvas**, kad paleistumėte iš naujo su tais pačiais įvesties duomenimis.

Docs, Evals ir kituose vidiniuose puslapiuose, kurie nėra drobė, taip pat galite naudoti [Quick Drawer](../reference/quick-drawer.md), kad pasirinktumėte prisegtą workflow ir jį paleistumėte negrįžtant į redaktorių.

Jei skaitote dokumentaciją ir norite išsiaiškinti prieš kurdami, atidarykite [Chat with Heym](../reference/chat-with-heym.md) iš Docs antraštės, kad užduotumėte su puslapiu susijusius klausimus.

Arba naudokite [AI Assistant](../reference/ai-assistant.md) iš Debug skydelio, kad kurtumėte workflow natūralia kalba—aprašykite, ko norite, ir AI sugeneruos nodes bei edges.

Jau kuriate automatizacijas kitame įrankyje? [Migrate to Heym](./migrate-to-heym.md) konvertuoja n8n, Flowise, Dify, Langflow, sim.ai arba Activepieces workflow į Heym workflow, kurį galite importuoti.

## Susiję

- [Pagrindinės koncepcijos](./core-concepts.md) – Workflow, mazgai ir vykdymo eiga
- [Migracija į Heym](./migrate-to-heym.md) – Konvertuokite n8n, Flowise, Dify, Langflow, sim.ai arba Activepieces workflow į Heym naudodami AI
- [Paleidimas ir diegimas](./running-and-deployment.md) – Paleiskite lokaliai su `run.sh` arba diegkite su `deploy.sh`
- [Aplinkos kintamieji](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Pilna konfigūracijos nuoroda
- [Nustatymai](../reference/user-settings.md) – Konfigūruokite vardą, User Rules ir slaptažodį
- [Canvas funkcijos](../reference/canvas-features.md) – Data pin, vykdymo žurnalai, įjungimas/išjungimas, ištraukimas į sub-workflow
- [Klaviatūros spartieji klavišai](../reference/keyboard-shortcuts.md) – Canvas ir redaktoriaus spartieji klavišai
- [Expression DSL](../reference/expression-dsl.md) – Duomenų nurodymas mazgo konfigūracijoje
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Išplečiamas redaktorius su tiesiogine backend peržiūra
- [Triggers](../reference/triggers.md) – Visi workflow įėjimo taškai ([webhook](../reference/webhooks.md), portalas, cron ir kt.)
- [Vykdymo istorija](../reference/execution-history.md) – Peržiūrėkite ankstesnius vykdymus ir „Bring to Canvas“
- [Quick Drawer](../reference/quick-drawer.md) – Paleiskite prisegtus workflow iš ne canvas puslapių
- [Chat with Heym](../reference/chat-with-heym.md) – Užduokite kontekstinius klausimus iš dokumentacijos antraštės
- [Workflows Tab](../tabs/workflows-tab.md) – Kurkite ir tvarkykite workflow
- [Credentials Tab](../tabs/credentials-tab.md) – Pridėkite API raktus LLM mazgams
- [AI Assistant](../reference/ai-assistant.md) – Kurkite workflow naudodami natūralią kalbą
