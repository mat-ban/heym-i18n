# Typy uzlov

Heym poskytuje rôzne typy uzlov na zostavovanie workflowov. Pri konfigurácii uzlov používajte [výrazy](./expression-dsl.md) ako `$input.text` a `$nodeLabel.field`.

## Trigger uzly

| Uzol | Popis | Výstupy |
|------|-------------|---------|
| [Vstup](../nodes/input-node.md) | Textový vstupný bod pre workflow (HTTP/[webhook](./webhooks.md)) | 1 |
| [Cron](../nodes/cron-node.md) | Trigger podľa plánu (cron výraz) | 1 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Trigger pri prijatí webhook aktualizácie z Telegram bota | 1 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Trigger keď Slack odošle webhook Events API | 1 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Trigger keď Discord odošle webhook interakcie aplikácie | 1 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Trigger pri prijatí nového e-mailu do IMAP schránky | 1 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Trigger keď Heym publikuje platformovú udalosť (dávkované pole) | 1 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Trigger z odchádzajúceho pripojenia k externému WebSocket serveru | 1 |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Vytvorí jednorazový odkaz na nahrávanie a spustí sa pri nahraní veľkého súboru | 1 |
| [RabbitMQ](../nodes/rabbitmq-node.md) | Trigger pri prijatí správy z frontu | 1 |
| [Error Handler](../nodes/error-handler-node.md) | Spustí sa pri chybe ktoréhokoľvek uzla (bez vstupnej hrany) | 1 |

Všetky vstupné body nájdete v časti [Triggers](./triggers.md).

## AI uzly

| Uzol | Popis | Vstupy | Výstupy |
|------|-------------|--------|---------|
| [LLM](../nodes/llm-node.md) | Spracovanie textu pomocou jazykového modelu | 1 | 1 |
| [Decision](../nodes/decision-node.md) | Kladie rozhodovaciemu modelu typované otázky a vetví sa podľa vrátených pravdepodobností | 1 | 1 |
| [AI Agent](../nodes/agent-node.md) | LLM s volaním nástrojov, skills, MCP, voliteľným [ľudským posúdením](./human-in-the-loop.md) a voliteľným [grafom trvalej pamäte](./agent-persistent-memory.md). Pozrite si [Agent Architecture](./agent-architecture.md). | 1 | 1, plus voliteľný výstup `review` |
| [Codex](../nodes/codex-node.md) | Spustí lokálne Codex CLI proti GitHub repozitáru pomocou prístupového tokenu ChatGPT/Codex | 1 | 1, plus výstup `question` |
| [OpenCode Go](../nodes/opencode-go-node.md) | Spustí OpenCode CLI proti GitHub repozitáru v zabezpečenom kontajneri pomocou API kľúča brány OpenCode Go | 1 | 1 |
| [MCP Call](../nodes/mcp-call-node.md) | Zavolá konkrétny MCP nástroj priamo bez toho, aby ho vyberal LLM | 1 | 1 |
| [RAG / Vector Store](../nodes/rag-node.md) | Vkladanie, upsert, mazanie alebo vyhľadávanie (vektorové alebo hybridné vektorové + BM25) v Qdrant alebo Postgres (pgvector) [vektorovom úložisku](../tabs/vectorstores-tab.md) pre RAG | 1 | 1 |

## Logické uzly

| Uzol | Popis | Vstupy | Výstupy |
|------|-------------|--------|---------|
| [Condition](../nodes/condition-node.md) | Vetvenie na základe if/else | 1 | 2 (true/false) |
| [Switch](../nodes/switch-node.md) | Smerovanie podľa zhody hodnoty s prípadmi | 1 | n |
| [Merge](../nodes/merge-node.md) | Čaká na viacero vstupov a zlúči ich | n | 1 |
| [Loop](../nodes/loop-node.md) | Iteruje cez pole | 1 | 2 (loop/done) |

## Dátové uzly

| Uzol | Popis | Vstupy | Výstupy |
|------|-------------|--------|---------|
| [Set](../nodes/set-node.md) | Transformácia a mapovanie dát | 1 | 1 |
| [Converter](../nodes/converter-node.md) | Konverzia dát medzi formátmi (CSV, JSON, XML) a OCR obrázkov alebo PDF do textu | 1 | 1 |
| [Code](../nodes/code-node.md) | Spustí Python v jednorazovom, sieťovo izolovanom sandboxe s vlastným requirements.txt | 1 | 1 |
| [Variable](../nodes/variable-node.md) | Nastavenie alebo získanie premennej (lokálnej pre workflow alebo [globálnej](./global-variables.md)) | 1 | 1 |
| [Execute](../nodes/execute-node.md) | Zavolá iný workflow | 1 | 1 |
| [Heym](../nodes/heym-node.md) | Číta Heym workflowy a históriu spustení | 1 | 1 |
## Integračné uzly

| Uzol | Popis | Vstupy | Výstupy |
|------|-------------|--------|---------|
| [HTTP](../nodes/http-node.md) | Odosielanie HTTP požiadaviek (cURL) | 0 alebo 1 | 1 |
| [WebSocket Send](../nodes/websocket-send-node.md) | Pripojenie k externému WebSocketu a odoslanie jednej správy | 1 | 1 |
| [Telegram](../nodes/telegram-node.md) | Odosielanie správ Telegram bota | 1 | 1 |
| [Slack](../nodes/slack-node.md) | Odosielanie správ Slack | 1 | 1 |
| [Discord](../nodes/discord-node.md) | Odosielanie správ Discord webhooku | 1 | 1 |
| [Send Email](../nodes/send-email-node.md) | Odosielanie e-mailov cez SMTP | 1 | 1 |
| [Redis](../nodes/redis-node.md) | Operácie s Redis (set, get, hasKey, deleteKey) | 1 | 1 |
| [Grist](../nodes/grist-node.md) | Čítanie a zápis tabuliek Grist | 1 | 1 |
| [GitHub](../nodes/github-node.md) | Správa repozitárov, používateľov, issues, pull requests, recenzií, releases, Actions workflowov a súborov prostredníctvom GitHub REST API | 1 | 1 |
| [Jira](../nodes/jira-node.md) | Správa projektov, issues, komentárov, príloh, používateľov, notifikácií a workflow prechodov v Jira prostredníctvom Jira REST API | 1 | 1 |
| [Linear](../nodes/linear-node.md) | Správa tímov, projektov, issues, workflow stavov a komentárov v Linear prostredníctvom GraphQL | 1 | 1 |
| [Google Sheets](../nodes/google-sheets-node.md) | Čítanie a zápis Google Sheets cez OAuth2 | 1 | 1 |
| [Google Drive](../nodes/google-drive-node.md) | Výpis, sťahovanie, aktualizácia a mazanie súborov Google Drive cez OAuth2 | 1 | 1 |
| [BigQuery](../nodes/bigquery-node.md) | Spúšťanie SQL dotazov a vkladanie riadkov v BigQuery | 1 | 1 |
| [Supabase](../nodes/supabase-node.md) | Dotazovanie a úprava tabuliek Supabase prostredníctvom PostgREST | 1 | 1 |
| [ClickHouse](../nodes/clickhouse-node.md) | Spúšťanie SQL, CRUD a count operácií nad ClickHouse | 1 | 1 |
| [Notion](../nodes/notion-node.md) | Správa databáz, dátových zdrojov, stránok a blokov Notion | 1 | 1 |
| [Sentry](../nodes/sentry-node.md) | Správa organizácií, projektov, tímov, issues, udalostí a releases v Sentry | 1 | 1 |
| [Amazon S3](../nodes/amazon-s3-node.md) | Správa bucketov a priečinkov; výpis, nahrávanie, sťahovanie, kopírovanie a mazanie objektov | 1 | 1 |
| [DataTable](../nodes/datatable-node.md) | Čítanie a zápis Heym Dátových tabuliek (first-party úložisko) | 1 | 1 |
| [Drive](../nodes/drive-node.md) | Správa súborov Drive: mazanie, nastavenie hesla, TTL, maximálneho počtu stiahnutí, zdieľanie v rámci tímu | 1 | 1 |

## Automatizačné uzly

| Uzol | Popis | Vstupy | Výstupy |
|------|-------------|--------|---------|
| [Crawler](../nodes/crawler-node.md) | Scrapovanie webových stránok pomocou FlareSolverr | 1 | 1 |
| [Playwright](../nodes/playwright-node.md) | Automatizácia prehliadača s AI krokom a Auto Heal | 1 | 1 |

## Pomocné uzly

| Uzol | Popis | Vstupy | Výstupy |
|------|-------------|--------|---------|
| [Wait](../nodes/wait-node.md) | Oneskorenie vykonania | 1 | 1 |
| [Output](../nodes/output-node.md) | Výstupný endpoint | 1 | 1 |
| [JSON output mapper](../nodes/json-output-mapper-node.md) | Mapovanie polí do JSON objektu; jediný terminál = telo webhooku/spustenia na najvyššej úrovni | 1 | 0 |
| [HTML output mapper](../nodes/html-output-mapper-node.md) | Vykreslenie HTML stránky; jediný terminál = webhook odpovedá s text/html | 1 | 0 |
| [Chart Output](../nodes/chart-output-node.md) | Výstup terminálneho widgetu dashboardu, ktorý mapuje riadky z predchádzajúcich uzlov do chart payloadov | 1 | 0 |
| [Sticky Note](../nodes/sticky-note-node.md) | Pridanie markdown poznámok na plátno (nevykonáva sa) | 0 | 0 |
| [Console Log](../nodes/console-log-node.md) | Zápis do konzoly backendu | 1 | 1 |
| [Disable Node](../nodes/disable-node.md) | Deaktivácia iného uzla vo workflow | 1 | 1 |
| [Enable Node](../nodes/enable-node.md) | Aktivácia deaktivovaného uzla vo workflow | 1 | 1 |
| [Throw Error](../nodes/throw-error-node.md) | Zastavenie workflow s chybovou odpoveďou | 1 | 0 |

## Plugin uzly

Plugin uzly poskytujú pluginy nainštalované na inštancii. Každý nainštalovaný
plugin sa zobrazuje v palete pod položkou **Plugins** s vlastným názvom; v
skutočnosti sa mapuje na jeden z týchto dvoch typov uzlov.

| Uzol | Popis | Vstupy | Výstupy |
|------|-------------|--------|---------|
| [Plugin](../nodes/plugin-node.md) | Vlastná akcia poskytovaná nainštalovaným pluginom | 1 | 1 |
| [Plugin Trigger](../nodes/plugin-trigger-node.md) | Vlastný trigger poskytovaný nainštalovaným pluginom | 0 | 1 |
## Súvisiace

- [Funkcie plátna](./canvas-features.md) – Pripnutie dát, logy spustení, povolenie/zakázanie, extrahovanie do pod-workflowu
- [Uzol Agenta](../nodes/agent-node.md) – Podrobná referencia pre uzol AI Agenta
- [Architektúra Agenta](./agent-architecture.md) – Sub-agenti, orchestrátor, zručnosti, MCP, volanie nástrojov
- [Trvalá pamäť Agenta](./agent-persistent-memory.md) – Znalostný graf pre jednotlivé uzly, zdieľanie a extrakcia na pozadí
- [Human-in-the-Loop](./human-in-the-loop.md) – Pozastavenie výstupu agenta na schválenie človekom
- [Expression DSL](./expression-dsl.md) – Odkazovanie na dáta v konfigurácii uzla
- [Dialóg vyhodnotenia výrazov](./expression-evaluation-dialog.md) – Rozbaliteľný editor so živým náhľadom backendu
- [Trigger nahrávania súborov](../nodes/file-upload-trigger-node.md) – Prijímanie veľkých multipart nahrávaní prostredníctvom jednorazových odkazov
- [WebSocket Trigger](../nodes/websocket-trigger-node.md) – Realtime odchádzajúci socket trigger
- [WebSocket Send](../nodes/websocket-send-node.md) – Posielanie správ do externých socketov
- [Štruktúra Workflowu](./workflow-structure.md) – JSON formát pre uzly a hrany
- [Triggers](./triggers.md) – Všetky vstupné body workflowu
- [Karta Prihlasovacích údajov](../tabs/credentials-tab.md) – Pridanie API kľúčov pre LLM, HTTP a ďalšie uzly
- [Zdieľanie prihlasovacích údajov](./credentials-sharing.md) – Zdieľanie prihlasovacích údajov s ostatnými používateľmi
- [Portál](./portal.md) – Zverejnenie workflowov ako verejných chat rozhraní
- [Karta Vektorových úložisk](../tabs/vectorstores-tab.md) – Vytváranie vektorových úložisk pre RAG uzly
