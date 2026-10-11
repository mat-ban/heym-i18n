# Alapvető fogalmak

## Workflow-k

A workflow [**csomópontok**](../reference/node-types.md) irányított gráfja, amelyeket **élek** kötnek össze. A workflow-kat a [Workflow-k](../tabs/workflows-tab.md) fülön kezelheti. Rendezze őket [mappákba](../reference/workflow-organization.md). A végrehajtás a [trigger csomópontokból](../reference/triggers.md) ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) indul ki, a feldolgozó csomópontokon keresztül halad, és az [output](../nodes/output-node.md) csomópontokban végződik. A JSON formátumot lásd a [Workflow struktúra](../reference/workflow-structure.md) oldalon. Mentse és ossza meg a workflow-kat [Sablonokként](../tabs/templates-tab.md), hogy újra felhasználhassa őket a projektek között. A workflow-k a [Tábláról](../tabs/board-tab.md) is futtathatók, ahol a kanban kártyák a kártya teljes kontextusával indítják el egy oszlop workflow-láncát.

## Csomópontok

Minden csomópont rendelkezik:

- **Típussal** – Meghatározza a viselkedést (pl. `llm`, `condition`, `http`)
- **Adatokkal** – Konfiguráció (modell, prompt, URL stb.)
- **Bemenetekkel/Kimenetekkel** – Csatlakozási pontok más csomópontokhoz

A teljes listát lásd a [Csomóponttípusok](../reference/node-types.md) oldalon.

## Élek

Az élek egy forrás csomópont kimeneti csatlakozóját egy cél csomópont bemeneti csatlakozójához kapcsolják. A végrehajtás során az adatok az élek mentén áramlanak.

## Végrehajtási folyamat

1. **Trigger** – Az Input, Cron, Telegram Trigger, Discord Trigger, IMAP Trigger vagy [WebSocket Trigger](../nodes/websocket-trigger-node.md) csomópont elindítja a végrehajtást (lásd [Triggerek](../reference/triggers.md))
2. **Továbbítás** – Minden csomópont a csatlakoztatott upstream csomópontok kimenetét kapja; a [párhuzamos végrehajtás](../reference/parallel-execution.md) a független csomópontokat egyidejűleg futtatja
3. **Kifejezések** – A csomópontok a `$nodeLabel.field` segítségével hivatkoznak az upstream adatokra. Lásd [Expression DSL](../reference/expression-dsl.md).
4. **Output** – Az [Output](../nodes/output-node.md) csomópont állítja elő a végeredményt

## Kifejezéshivatkozások

Használja a `$input` kifejezést az Input csomópont adataihoz, és a `$nodeLabel.field` kifejezést bármely upstream csomóponthoz. Például: a `$llm.text` az "llm" címkével ellátott csomópont `text` mezőjére hivatkozik. Teljes szintaxis: [Expression DSL](../reference/expression-dsl.md). Kifejezések szerkesztésekor használja a [Kifejezés kiértékelő párbeszédablakot](../reference/expression-evaluation-dialog.md) a nagyobb szerkesztőfelülethez és az élő backend előnézethez.

## Kapcsolódó témák

- [Gyors kezdés](./quick-start.md) – Építse meg első workflow-ját
- [Vászon funkciók](../reference/canvas-features.md) – Adatpin, végrehajtási naplók, engedélyezés/letiltás, kiemelés al-workflow-ba
- [AI asszisztens](../reference/ai-assistant.md) – Workflow-k létrehozása természetes nyelvvel
- [Csomóponttípusok](../reference/node-types.md) – Az összes elérhető csomópont
- [Expression DSL](../reference/expression-dsl.md) – Adathivatkozás kifejezésekben
- [Kifejezés kiértékelő párbeszédablak](../reference/expression-evaluation-dialog.md) – Bővíthető szerkesztő élő backend előnézettel
- [Workflow-k fül](../tabs/workflows-tab.md) – Workflow-k és mappák kezelése
- [Workflow szervezés](../reference/workflow-organization.md) – Mappák és ütemezett törlés
- [Triggerek](../reference/triggers.md) – A workflow-k belépési pontjai
- [Webhook-ok](../reference/webhooks.md) – HTTP webhook trigger (TTL, cache, rate limit)
- [Párhuzamos végrehajtás](../reference/parallel-execution.md) – Hogyan futnak a csomópontok párhuzamosan
