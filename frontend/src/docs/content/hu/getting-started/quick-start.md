# Gyors kezdés

Hozza működésbe első Heym workflow-ját percek alatt.

Még nem fut a Heym? Lásd: [Futtatás és telepítés](./running-and-deployment.md), vagy nézze meg a videós bemutatót: [A Heym helyi beállítása 2 perc alatt](https://www.youtube.com/watch?v=P6YvlupUboU).

## 1. Workflow létrehozása

1. Nyissa meg a [Workflows](../tabs/workflows-tab.md) fület
2. Kattintson az **Új workflow** gombra
3. Nevezze el a workflow-t (pl. „Hello World")

## 2. Csomópontok hozzáadása

1. Nyissa meg a bal oldali **Csomópontok** panelt
2. Húzzon egy [Input](../nodes/input-node.md) csomópontot a vászonra
3. Húzzon egy [LLM](../nodes/llm-node.md) csomópontot, és kapcsolja össze az Inputtal
4. Húzzon egy [Output](../nodes/output-node.md) csomópontot, és kapcsolja össze az LLM-mel

```
[Input] --> [LLM] --> [Output]
```

Az összes elérhető csomópontról lásd: [Csomóponttípusok](../reference/node-types.md).

## 3. Konfigurálás

- **Input**: Állítson be egy alapértelmezett értéket, vagy hagyja üresen a felhasználói bevitelhez (lásd: [Input csomópont](../nodes/input-node.md))
- **LLM**: Válasszon egy [credentialt](../tabs/credentials-tab.md) és modellt, adjon hozzá egy rendszerutasítást, és állítsa a `userMessage` értékét `$input.text`-re (lásd: [LLM csomópont](../nodes/llm-node.md))
- **Output**: Állítsa a `message` értékét `$llm.text`-re az LLM válaszának továbbításához (lásd: [Output csomópont](../nodes/output-node.md))

Használja az [Expression DSL](../reference/expression-dsl.md) szintaxist a `$input.text` és `$llm.text` kifejezésekhez. Kattintson a kifejezésmezők kibontás gombjára az [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) megnyitásához élő backend előnézettel.

## 4. Futtatás

Kattintson a **Futtatás** gombra, nyomja meg a `Ctrl + Enter` billentyűkombinációt, vagy használja a debug panelt a végrehajtáshoz. A workflow az Input csomóponttól az összekapcsolt csomópontokon keresztül az Outputig fut. A workflow-k futtatásának egyéb módjairól lásd: [Triggerek](../reference/triggers.md) ([webhook](../reference/webhooks.md), portál, cron stb.).

A korábbi futtatásokat a **History** (eszköztár) menüben tekintheti meg, és a **Bring to Canvas** funkcióval ugyanazokkal a bemenetekkel újrafuttathatja azokat.

A Docs, Evals és egyéb, nem vászonhoz tartozó belső oldalakon a [Quick Drawer](../reference/quick-drawer.md) segítségével is kiválaszthat egy rögzített workflow-t, és visszalépés nélkül futtathatja azt.

Ha a dokumentációt olvassa, és szeretne tisztázást kérni az építés előtt, nyissa meg a [Chat with Heym](../reference/chat-with-heym.md) funkciót a Docs fejlécéből, hogy az oldalra vonatkozó kérdéseket tegyen fel.

Alternatívaként használja az [AI Assistant](../reference/ai-assistant.md) funkciót a Debug panelből, hogy természetes nyelvvel hozzon létre workflow-kat—írja le, mit szeretne, és az AI generálja a csomópontokat és éleket.

Már más eszközben épít automatizálásokat? A [Migrate to Heym](./migrate-to-heym.md) egy n8n, Flowise, Dify, Langflow, sim.ai vagy Activepieces workflow-t alakít át importálható Heym workflow-vá.

## Kapcsolódó

- [Alapfogalmak](./core-concepts.md) – Workflow-k, csomópontok és végrehajtási folyamat
- [Migrate to Heym](./migrate-to-heym.md) – n8n, Flowise, Dify, Langflow, sim.ai vagy Activepieces workflow-k átalakítása Heym-mé AI-val
- [Futtatás és telepítés](./running-and-deployment.md) – Indítás helyben a `run.sh` segítségével, vagy telepítés a `deploy.sh` segítségével
- [Környezeti változók](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Teljes konfigurációs referencia
- [Beállítások](../reference/user-settings.md) – Név, User Rules és jelszó konfigurálása
- [Vászon funkciók](../reference/canvas-features.md) – Data pin, végrehajtási naplók, engedélyezés/letiltás, kinyerés al-workflow-ba
- [Billentyűparancsok](../reference/keyboard-shortcuts.md) – Vászon és szerkesztő billentyűparancsok
- [Expression DSL](../reference/expression-dsl.md) – Adatokra való hivatkozás a csomópont konfigurációjában
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Kibontható szerkesztő élő backend előnézettel
- [Triggerek](../reference/triggers.md) – Az összes workflow belépési pont ([webhook](../reference/webhooks.md), portál, cron stb.)
- [Végrehajtási előzmények](../reference/execution-history.md) – Korábbi futtatások megtekintése és Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Rögzített workflow-k futtatása nem vászonhoz tartozó oldalakról
- [Chat with Heym](../reference/chat-with-heym.md) – Kontextuális kérdések feltevése a dokumentáció fejlécéből
- [Workflows fül](../tabs/workflows-tab.md) – Workflow-k létrehozása és kezelése
- [Credentials fül](../tabs/credentials-tab.md) – API kulcsok hozzáadása LLM csomópontokhoz
- [AI Assistant](../reference/ai-assistant.md) – Workflow-k létrehozása természetes nyelvvel
