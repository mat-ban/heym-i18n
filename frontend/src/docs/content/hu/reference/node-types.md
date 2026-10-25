# Csomóponttípusok

A Heym számos csomóponttípust kínál a workflow-k felépítéséhez. A csomópontok konfigurálásakor használjon [kifejezéseket](./expression-dsl.md), például `$input.text` és `$nodeLabel.field`.

## Trigger csomópontok

| Csomópont | Leírás | Kimenetek |
|------|-------------|---------|
| [Input](../nodes/input-node.md) | Szöveges belépési pont a workflow-hoz (HTTP/[webhook](./webhooks.md)) | 1 |
| [Cron](../nodes/cron-node.md) | Ütemezés szerinti indítás (cron kifejezés) | 1 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Indítás, amikor egy Telegram bot webhook frissítés érkezik | 1 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Indítás, amikor a Slack Events API webhookot küld | 1 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Indítás, amikor a Discord alkalmazás-interakciós webhookot küld | 1 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Indítás, amikor új e-mail érkezik egy IMAP postaládába | 1 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Indítás, amikor a Heym platformeseményt publikál (batchelt tömb) | 1 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Indítás egy külső WebSocket-kiszolgálóhoz irányuló kimenő kapcsolatról | 1 |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Egyszer használatos feltöltési link létrehozása és indítás nagy fájl feltöltésekor | 1 |
| [RabbitMQ](../nodes/rabbitmq-node.md) | Indítás, amikor üzenet érkezik egy sorból | 1 |
| [Error Handler](../nodes/error-handler-node.md) | Fut, amikor bármely csomópont hibát jelez (nincs bejövő él) | 1 |

Az összes belépési pontot lásd a [Triggers](./triggers.md) oldalon.

## AI csomópontok

| Csomópont | Leírás | Bemenetek | Kimenetek |
|------|-------------|--------|---------|
| [LLM](../nodes/llm-node.md) | Szöveg feldolgozása nyelvi modellel | 1 | 1 |
| [Decision](../nodes/decision-node.md) | Típusos kérdések feltevése egy döntési modellnek, majd elágazás a visszaadott valószínűségek alapján | 1 | 1 |
| [AI Agent](../nodes/agent-node.md) | LLM eszközhívással, skillekkel, MCP-vel, opcionális [emberi felülvizsgálattal](./human-in-the-loop.md) és opcionális [perzisztens memóriagráffal](./agent-persistent-memory.md). Lásd: [Agent Architecture](./agent-architecture.md). | 1 | 1, valamint opcionális `review` kimenet |
| [Codex](../nodes/codex-node.md) | A helyi Codex CLI futtatása egy GitHub-tárolón ChatGPT/Codex hozzáférési tokennel | 1 | 1, valamint `question` kimenet |
| [OpenCode Go](../nodes/opencode-go-node.md) | Az OpenCode CLI futtatása egy GitHub-tárolón megerősített konténerben, OpenCode Go gateway API-kulccsal | 1 | 1 |
| [MCP Call](../nodes/mcp-call-node.md) | Egy adott MCP-eszköz közvetlen meghívása anélkül, hogy egy LLM választaná ki | 1 | 1 |
| [RAG / Vector Store](../nodes/rag-node.md) | Beszúrás, upsert, törlés vagy keresés (vektoros vagy hibrid vektoros + BM25) egy Qdrant vagy Postgres (pgvector) [vektortárolóban](../tabs/vectorstores-tab.md) RAG-hoz | 1 | 1 |

## Logikai csomópontok

| Csomópont | Leírás | Bemenetek | Kimenetek |
|------|-------------|--------|---------|
| [Condition](../nodes/condition-node.md) | Elágazás if/else alapján | 1 | 2 (true/false) |
| [Switch](../nodes/switch-node.md) | Útvonalválasztás egy érték esetekhez való illesztésével | 1 | n |
| [Merge](../nodes/merge-node.md) | Több bemenet megvárása és összevonása | n | 1 |
| [Loop](../nodes/loop-node.md) | Iteráció egy tömbön | 1 | 2 (loop/done) |

## Adatcsomópontok

| Csomópont | Leírás | Bemenetek | Kimenetek |
|------|-------------|--------|---------|
| [Set](../nodes/set-node.md) | Adatok átalakítása és leképezése | 1 | 1 |
| [Converter](../nodes/converter-node.md) | Adatok átalakítása formátumok között (CSV, JSON, XML), valamint képek vagy PDF-ek OCR-rel szöveggé alakítása | 1 | 1 |
| [Code](../nodes/code-node.md) | Python futtatása egy eldobható, hálózatilag izolált sandboxban, saját requirements.txt fájllal | 1 | 1 |
| [Variable](../nodes/variable-node.md) | Változó beállítása vagy lekérése (workflow-lokális vagy [globális](./global-variables.md)) | 1 | 1 |
| [Execute](../nodes/execute-node.md) | Egy másik workflow meghívása | 1 | 1 |
| [Heym](../nodes/heym-node.md) | Heym workflow-k és futtatási előzmények olvasása | 1 | 1 |
## Integrációs csomópontok

| Csomópont | Leírás | Bemenetek | Kimenetek |
|------|-------------|--------|---------|
| [HTTP](../nodes/http-node.md) | HTTP kérések küldése (cURL) | 0 vagy 1 | 1 |
| [WebSocket Send](../nodes/websocket-send-node.md) | Csatlakozás külső WebSockethez és egy üzenet küldése | 1 | 1 |
| [Telegram](../nodes/telegram-node.md) | Telegram bot üzenetek küldése | 1 | 1 |
| [Slack](../nodes/slack-node.md) | Slack üzenetek küldése | 1 | 1 |
| [Discord](../nodes/discord-node.md) | Discord webhook üzenetek küldése | 1 | 1 |
| [Send Email](../nodes/send-email-node.md) | E-mailek küldése SMTP-n keresztül | 1 | 1 |
| [Redis](../nodes/redis-node.md) | Redis műveletek (set, get, hasKey, deleteKey) | 1 | 1 |
| [Grist](../nodes/grist-node.md) | Grist táblázatok olvasása/írása | 1 | 1 |
| [GitHub](../nodes/github-node.md) | Repositoryk, felhasználók, issue-k, pull requestek, review-k, release-ek, Actions workflow-k és fájlok kezelése a GitHub REST API-n keresztül | 1 | 1 |
| [Jira](../nodes/jira-node.md) | Jira projektek, issue-k, hozzászólások, mellékletek, felhasználók, értesítések és workflow-átmenetek kezelése a Jira REST API-n keresztül | 1 | 1 |
| [Linear](../nodes/linear-node.md) | Linear csapatok, projektek, issue-k, workflow állapotok és hozzászólások kezelése GraphQL-en keresztül | 1 | 1 |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets olvasása/írása OAuth2-n keresztül | 1 | 1 |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive fájlok listázása, letöltése, frissítése és törlése OAuth2-n keresztül | 1 | 1 |
| [BigQuery](../nodes/bigquery-node.md) | SQL lekérdezések futtatása és sorok beszúrása a BigQuery-ben | 1 | 1 |
| [Supabase](../nodes/supabase-node.md) | Supabase táblák lekérdezése és módosítása PostgREST-en keresztül | 1 | 1 |
| [ClickHouse](../nodes/clickhouse-node.md) | SQL, CRUD és count műveletek futtatása a ClickHouse ellen | 1 | 1 |
| [Notion](../nodes/notion-node.md) | Notion adatbázisok, adatforrások, oldalak és blokkok kezelése | 1 | 1 |
| [Sentry](../nodes/sentry-node.md) | Sentry szervezetek, projektek, csapatok, issue-k, események és release-ek kezelése | 1 | 1 |
| [Amazon S3](../nodes/amazon-s3-node.md) | Bucketek és mappák kezelése; objektumok listázása, feltöltése, letöltése, másolása és törlése | 1 | 1 |
| [DataTable](../nodes/datatable-node.md) | Heym Adattáblák olvasása/írása (első féltől származó tárolás) | 1 | 1 |
| [Drive](../nodes/drive-node.md) | Drive fájlok kezelése: törlés, jelszó beállítása, TTL, maximális letöltések, csapatmegosztás/megosztás visszavonása | 1 | 1 |

## Automatizálási csomópontok

| Csomópont | Leírás | Bemenetek | Kimenetek |
|------|-------------|--------|---------|
| [Crawler](../nodes/crawler-node.md) | Weboldalak scrape-elése FlareSolverr-rel | 1 | 1 |
| [Playwright](../nodes/playwright-node.md) | Böngészőautomatizálás AI lépéssel és Auto Heal-lel | 1 | 1 |

## Segédprogram csomópontok

| Csomópont | Leírás | Bemenetek | Kimenetek |
|------|-------------|--------|---------|
| [Wait](../nodes/wait-node.md) | Végrehajtás késleltetése | 1 | 1 |
| [Output](../nodes/output-node.md) | Kimeneti endpoint | 1 | 1 |
| [JSON output mapper](../nodes/json-output-mapper-node.md) | Mezők leképezése JSON objektumba; egyetlen terminál = legfelső szintű webhook/futtatás törzs | 1 | 0 |
| [HTML output mapper](../nodes/html-output-mapper-node.md) | HTML oldal renderelése; egyetlen terminál = a webhook text/html-lel válaszol | 1 | 0 |
| [Chart Output](../nodes/chart-output-node.md) | Terminál irányítópult-widget kimenet, amely a felsőbb sorokat chart payloadokká képezi le | 1 | 0 |
| [Sticky Note](../nodes/sticky-note-node.md) | Markdown jegyzetek hozzáadása a vászonhoz (nem kerül végrehajtásra) | 0 | 0 |
| [Console Log](../nodes/console-log-node.md) | Naplózás a backend konzolra | 1 | 1 |
| [Disable Node](../nodes/disable-node.md) | Egy másik csomópont letiltása a workflow-ban | 1 | 1 |
| [Enable Node](../nodes/enable-node.md) | Egy letiltott csomópont engedélyezése a workflow-ban | 1 | 1 |
| [Throw Error](../nodes/throw-error-node.md) | Workflow leállítása hibaüzenettel | 1 | 0 |

## Plugin csomópontok

A plugin csomópontokat az instance-re telepített pluginok biztosítják. Minden telepített
plugin a saját nevével jelenik meg a palettán a **Plugins** alatt; a háttérben
ez a két csomóponttípus egyikére képeződik le.

| Csomópont | Leírás | Bemenetek | Kimenetek |
|------|-------------|--------|---------|
| [Plugin](../nodes/plugin-node.md) | Egy telepített plugin által biztosított egyéni művelet | 1 | 1 |
| [Plugin Trigger](../nodes/plugin-trigger-node.md) | Egy telepített plugin által biztosított egyéni trigger | 0 | 1 |
## Kapcsolódó témák

- [Vászon funkciók](./canvas-features.md) – Adatrögzítés, futtatási naplók, engedélyezés/letiltás, kinyerés al-workflow-ba
- [Agent csomópont](../nodes/agent-node.md) – Az AI Agent csomópont részletes referenciája
- [Agent architektúra](./agent-architecture.md) – Al-ügynökök, orchestrator, skillek, MCP, eszközhívás
- [Agent tartós memória](./agent-persistent-memory.md) – Csomópontonkénti tudásgráf, megosztás és háttérkinyerés
- [Human-in-the-Loop](./human-in-the-loop.md) – Az agent kimenetének szüneteltetése emberi jóváhagyás céljából
- [Expression DSL](./expression-dsl.md) – Adatokra való hivatkozás a csomópont konfigurációjában
- [Expression kiértékelő párbeszédablak](./expression-evaluation-dialog.md) – Bővíthető szerkesztő élő backend előnézettel
- [Fájlfeltöltés trigger](../nodes/file-upload-trigger-node.md) – Nagy multipart feltöltések fogadása egyszer használatos linkeken keresztül
- [WebSocket trigger](../nodes/websocket-trigger-node.md) – Valós idejű kimenő socket trigger
- [WebSocket küldés](../nodes/websocket-send-node.md) – Üzenetek küldése külső socketekre
- [Workflow struktúra](./workflow-structure.md) – JSON formátum csomópontokhoz és élekhez
- [Triggerek](./triggers.md) – Az összes workflow belépési pont
- [Hitelesítési adatok fül](../tabs/credentials-tab.md) – API kulcsok hozzáadása LLM, HTTP és egyéb csomópontokhoz
- [Hitelesítési adatok megosztása](./credentials-sharing.md) – Hitelesítési adatok megosztása más felhasználókkal
- [Portál](./portal.md) – Workflow-k nyilvános chat felületként való közzététele
- [Vektortárolók fül](../tabs/vectorstores-tab.md) – Vektortárolók létrehozása RAG csomópontokhoz
