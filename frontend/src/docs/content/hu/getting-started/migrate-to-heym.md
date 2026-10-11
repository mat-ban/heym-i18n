# Migrálás a Heymre

Már rendelkezik workflow-kkal egy másik eszközben? Az **AI Convert** Heym workflow-kká alakítja azokat Önnek. Illesszen be egy workflow-t az n8n, Flowise, Dify, Langflow, sim.ai vagy Activepieces rendszerből — vagy egyszerűen írja le, mit szeretne —, és a Heym felépíti az egyenértékű workflow-t egy élő canvasen, amelyet letölthet és importálhat.

Nyissa meg a **[heym.run/convert](https://heym.run/convert)** címen, vagy használja a **✨ AI Convert** gombot az oldal fejlécében.

## Hogyan működik

1. **Válassza ki a forráseszközt** (opcionális) — n8n, Flowise, Dify, Langflow, sim.ai, Activepieces, vagy hagyja az *Auto* beállításon.
2. **Adja meg a workflow-t** — illessze be az aktuális eszközből exportált JSON-t, vagy írjon egy egyszerű nyelvű leírást a kívánt automatizálásról.
3. **Generálás** — a Heym a canvasre streameli az eredményt, és a csomópontokat valamint a kapcsolatokat a létrehozásuk során rajzolja meg.
4. **Töltse le vagy másolja** a generált workflow-t JSON formátumban.
5. **Importálja a Heymbe** — használja a [Download & Import](../reference/download-import.md) folyamatot a JSON canvasre illesztéséhez, majd futtassa azt.

Az átalakítás egy kis *Sticky Note*-ot is elhelyez a canvasen, amely jelzi, hogy a workflow-t a Heym generálta — törölje bármikor, amikor csak szeretné.

## Amit kap

Az átalakító a forráskoncepciókat natív Heym csomópontokra képezi le — triggerek, [LLM](../nodes/llm-node.md) lépések, [HTTP](../nodes/http-node.md) hívások, [Slack](../nodes/slack-node.md)/[Telegram](../nodes/telegram-node.md) műveletek, [Loops](../nodes/loop-node.md), [Conditions](../nodes/condition-node.md) és [Output](../nodes/output-node.md). Tekintse át az eredményt a canvasen, állítsa be a [Credentials](../reference/credentials.md) adatait, és igazítsa ki mindazt, amit a forráseszköz eltérően fejezett ki.

> Az AI Convert egy kiindulópont, nem garantált 1:1 portolás. A generált workflow-t mindig tekintse át, mielőtt éles környezetben futtatná.

## Jó tudni

- **AI-vezérelt:** az átalakításokat egy nagy nyelvi modell végzi, így az eredmények futásonként eltérhetnek. Generálja újra, ha az első eredmény nem megfelelő.
- **Bemeneti méret:** a beillesztett vagy beírt bemenet körülbelül **25 000 token**-re korlátozódik. Nagyon nagy exportok esetén rövidítse le azokat az átalakítás előtt.
- **Rate limitek:** hogy az eszköz mindenki számára elérhető maradjon, a kérések látogatónként **percenként 1, óránként 5 és naponta 10** értékre vannak korlátozva.
- **Biztonság:** a kérések szűrésen esnek át, és csak workflow-építési kérések kerülnek feldolgozásra.

## Következő lépések

- Új a canvasen? Kezdje a [Quick Start](./quick-start.md) útmutatóval.
- Ismerje meg az importálás működését a [Download & Import](../reference/download-import.md) oldalon.
- Saját maga üzemelteti a Heymet? A teljes konfigurációs referenciáért lásd a [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) oldalt.
- Építsen a nulláról az alkalmazáson belüli [AI Assistant](../reference/ai-assistant.md) segítségével.
