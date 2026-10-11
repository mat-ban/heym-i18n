# Typy uzlů

Heym poskytuje řadu typů uzlů pro sestavování workflow. Při konfiguraci uzlů používejte [výrazy](./expression-dsl.md) jako `$input.text` a `$nodeLabel.field`.

## Trigger uzly

| Uzel | Popis | Výstupy |
|------|-------------|---------|
| [Input](../nodes/input-node.md) | Textový vstupní bod pro workflow (HTTP/[webhook](./webhooks.md)) | 1 |
| [Cron](../nodes/cron-node.md) | Trigger podle plánu (cron výraz) | 1 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Trigger při příchodu webhook aktualizace z Telegram bota | 1 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Trigger když Slack odešle webhook Events API | 1 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Trigger když Discord odešle webhook interakce aplikace | 1 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Trigger při příchodu nového e-mailu do IMAP schránky | 1 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Trigger když Heym publikuje platformní událost (dávkované pole) | 1 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Trigger z odchozího připojení k externímu WebSocket serveru | 1 |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Vytvoří jednorázový odkaz pro nahrání a spustí se při nahrání velkého souboru | 1 |
| [RabbitMQ](../nodes/rabbitmq-node.md) | Trigger při přijetí zprávy z fronty | 1 |
| [Error Handler](../nodes/error-handler-node.md) | Spustí se při chybě libovolného uzlu (bez příchozí hrany) | 1 |

Všechny vstupní body naleznete v části [Triggers](./triggers.md).

## AI uzly

| Uzel | Popis | Vstupy | Výstupy |
|------|-------------|--------|---------|
| [LLM](../nodes/llm-node.md) | Zpracování textu pomocí jazykového modelu | 1 | 1 |
| [Decision](../nodes/decision-node.md) | Pokládá rozhodovacímu modelu typované otázky a větví podle vrácených pravděpodobností | 1 | 1 |
| [AI Agent](../nodes/agent-node.md) | LLM s voláním nástrojů, dovednostmi, MCP, volitelnou [lidskou kontrolou](./human-in-the-loop.md) a volitelným [grafem trvalé paměti](./agent-persistent-memory.md). Viz [Architektura agenta](./agent-architecture.md). | 1 | 1, plus volitelný výstup `review` |
| [Codex](../nodes/codex-node.md) | Spustí lokální Codex CLI proti GitHub repozitáři pomocí přístupového tokenu ChatGPT/Codex | 1 | 1, plus výstup `question` |
| [OpenCode Go](../nodes/opencode-go-node.md) | Spustí OpenCode CLI proti GitHub repozitáři v zabezpečeném kontejneru pomocí API klíče brány OpenCode Go | 1 | 1 |
| [MCP Call](../nodes/mcp-call-node.md) | Zavolá konkrétní MCP nástroj přímo bez výběru pomocí LLM | 1 | 1 |
| [RAG / Vector Store](../nodes/rag-node.md) | Vkládání, upsert, mazání nebo vyhledávání v Qdrant nebo Postgres (pgvector) [vector store](../tabs/vectorstores-tab.md) pro RAG | 1 | 1 |

## Logické uzly

| Uzel | Popis | Vstupy | Výstupy |
|------|-------------|--------|---------|
| [Condition](../nodes/condition-node.md) | Větvení na základě if/else | 1 | 2 (true/false) |
| [Switch](../nodes/switch-node.md) | Směrování podle shody hodnoty s případy | 1 | n |
| [Merge](../nodes/merge-node.md) | Čeká na více vstupů a sloučí je | n | 1 |
| [Loop](../nodes/loop-node.md) | Iteruje přes pole | 1 | 2 (loop/done) |

## Datové uzly

| Uzel | Popis | Vstupy | Výstupy |
|------|-------------|--------|---------|
| [Set](../nodes/set-node.md) | Transformace a mapování dat | 1 | 1 |
| [Converter](../nodes/converter-node.md) | Převod dat mezi formáty (CSV, JSON, XML) a OCR obrázků nebo PDF do textu | 1 | 1 |
| [Code](../nodes/code-node.md) | Spouští Python v jednorázovém, síťově izolovaném sandboxu s vlastním requirements.txt | 1 | 1 |
| [Variable](../nodes/variable-node.md) | Nastavení nebo získání proměnné (lokální pro workflow nebo [globální](./global-variables.md)) | 1 | 1 |
| [Execute](../nodes/execute-node.md) | Volá jiný workflow | 1 | 1 |
| [Heym](../nodes/heym-node.md) | Čte Heym workflow a historii spuštění | 1 | 1 |
## Integrační uzly

| Uzel | Popis | Vstupy | Výstupy |
|------|-------------|--------|---------|
| [HTTP](../nodes/http-node.md) | Odesílání HTTP požadavků (cURL) | 0 nebo 1 | 1 |
| [WebSocket Send](../nodes/websocket-send-node.md) | Připojení k externímu WebSocketu a odeslání jedné zprávy | 1 | 1 |
| [Telegram](../nodes/telegram-node.md) | Odesílání zpráv Telegram bota | 1 | 1 |
| [Slack](../nodes/slack-node.md) | Odesílání zpráv Slack | 1 | 1 |
| [Discord](../nodes/discord-node.md) | Odesílání zpráv Discord webhooku | 1 | 1 |
| [Send Email](../nodes/send-email-node.md) | Odesílání e-mailů přes SMTP | 1 | 1 |
| [Redis](../nodes/redis-node.md) | Operace Redis (set, get, hasKey, deleteKey) | 1 | 1 |
| [Grist](../nodes/grist-node.md) | Čtení a zápis tabulek Grist | 1 | 1 |
| [GitHub](../nodes/github-node.md) | Správa repozitářů, uživatelů, issues, pull requestů, recenzí, releasů, Actions workflow a souborů prostřednictvím GitHub REST API | 1 | 1 |
| [Jira](../nodes/jira-node.md) | Správa projektů, issues, komentářů, příloh, uživatelů, oznámení a přechodů workflow v Jira prostřednictvím Jira REST API | 1 | 1 |
| [Linear](../nodes/linear-node.md) | Správa týmů, projektů, issues, stavů workflow a komentářů v Linear prostřednictvím GraphQL | 1 | 1 |
| [Google Sheets](../nodes/google-sheets-node.md) | Čtení a zápis Google Sheets přes OAuth2 | 1 | 1 |
| [Google Drive](../nodes/google-drive-node.md) | Výpis, stahování, aktualizace a mazání souborů Google Drive přes OAuth2 | 1 | 1 |
| [BigQuery](../nodes/bigquery-node.md) | Spouštění SQL dotazů a vkládání řádků v BigQuery | 1 | 1 |
| [Supabase](../nodes/supabase-node.md) | Dotazování a úprava tabulek Supabase prostřednictvím PostgREST | 1 | 1 |
| [ClickHouse](../nodes/clickhouse-node.md) | Spouštění SQL, CRUD a count operací vůči ClickHouse | 1 | 1 |
| [Notion](../nodes/notion-node.md) | Správa databází, datových zdrojů, stránek a bloků Notion | 1 | 1 |
| [Sentry](../nodes/sentry-node.md) | Správa organizací, projektů, týmů, issues, událostí a releasů Sentry | 1 | 1 |
| [Amazon S3](../nodes/amazon-s3-node.md) | Správa bucketů a složek; výpis, nahrávání, stahování, kopírování a mazání objektů | 1 | 1 |
| [DataTable](../nodes/datatable-node.md) | Čtení a zápis Heym DataTables (úložiště první strany) | 1 | 1 |
| [Drive](../nodes/drive-node.md) | Správa souborů Drive: mazání, nastavení hesla, TTL, maximálního počtu stažení, sdílení v rámci týmu/zrušení sdílení | 1 | 1 |

## Automatizační uzly

| Uzel | Popis | Vstupy | Výstupy |
|------|-------------|--------|---------|
| [Crawler](../nodes/crawler-node.md) | Scrapování webových stránek pomocí FlareSolverr | 1 | 1 |
| [Playwright](../nodes/playwright-node.md) | Automatizace prohlížeče s AI krokem a Auto Heal | 1 | 1 |

## Pomocné uzly

| Uzel | Popis | Vstupy | Výstupy |
|------|-------------|--------|---------|
| [Wait](../nodes/wait-node.md) | Zpoždění vykonávání | 1 | 1 |
| [Output](../nodes/output-node.md) | Výstupní endpoint | 1 | 1 |
| [JSON output mapper](../nodes/json-output-mapper-node.md) | Mapování polí do objektu JSON; jediný terminál = tělo webhooku/spuštění na nejvyšší úrovni | 1 | 0 |
| [HTML output mapper](../nodes/html-output-mapper-node.md) | Vykreslení HTML stránky; jediný terminál = webhook odpovídá text/html | 1 | 0 |
| [Chart Output](../nodes/chart-output-node.md) | Terminálový výstup widgetu dashboardu, který mapuje řádky z předchozích uzlů do chart payloadů | 1 | 0 |
| [Sticky Note](../nodes/sticky-note-node.md) | Přidání markdown poznámek na plátno (nevykonává se) | 0 | 0 |
| [Console Log](../nodes/console-log-node.md) | Zápis do konzole backendu | 1 | 1 |
| [Disable Node](../nodes/disable-node.md) | Deaktivace jiného uzlu ve workflow | 1 | 1 |
| [Enable Node](../nodes/enable-node.md) | Aktivace deaktivovaného uzlu ve workflow | 1 | 1 |
| [Throw Error](../nodes/throw-error-node.md) | Zastavení workflow s chybovou odpovědí | 1 | 0 |

## Uzly pluginů

Uzly pluginů poskytují pluginy nainstalované na instanci. Každý nainstalovaný
plugin se zobrazuje v paletě pod **Plugins** pod vlastním názvem; ve skutečnosti
se mapuje na jeden z těchto dvou typů uzlů.

| Uzel | Popis | Vstupy | Výstupy |
|------|-------------|--------|---------|
| [Plugin](../nodes/plugin-node.md) | Vlastní akce poskytovaná nainstalovaným pluginem | 1 | 1 |
| [Plugin Trigger](../nodes/plugin-trigger-node.md) | Vlastní trigger poskytovaný nainstalovaným pluginem | 0 | 1 |
## Související

- [Funkce plátna](./canvas-features.md) – Data pin, protokoly spuštění, povolení/zakázání, extrakce do podřízeného workflow
- [Uzel Agent](../nodes/agent-node.md) – Podrobná reference pro uzel AI Agent
- [Architektura agenta](./agent-architecture.md) – Podřízení agenti, orchestrátor, dovednosti, MCP, volání nástrojů
- [Trvalá paměť agenta](./agent-persistent-memory.md) – Znalostní graf per uzel, sdílení a extrakce na pozadí
- [Human-in-the-Loop](./human-in-the-loop.md) – Pozastavení výstupu agenta pro schválení člověkem
- [Expression DSL](./expression-dsl.md) – Odkazování na data v konfiguraci uzlu
- [Dialog vyhodnocení výrazu](./expression-evaluation-dialog.md) – Rozšiřitelný editor s živým náhledem backendu
- [Trigger nahrání souboru](../nodes/file-upload-trigger-node.md) – Příjem velkých multipart nahrávek prostřednictvím jednorázových odkazů
- [WebSocket Trigger](../nodes/websocket-trigger-node.md) – Realtime odchozí socketový trigger
- [WebSocket Send](../nodes/websocket-send-node.md) – Odesílání zpráv do externích socketů
- [Struktura workflow](./workflow-structure.md) – JSON formát pro uzly a hrany
- [Triggers](./triggers.md) – Všechny vstupní body workflow
- [Záložka Credentials](../tabs/credentials-tab.md) – Přidání API klíčů pro LLM, HTTP a další uzly
- [Sdílení credentials](./credentials-sharing.md) – Sdílení credentials s ostatními uživateli
- [Portál](./portal.md) – Zveřejnění workflow jako veřejná chatovací rozhraní
- [Záložka Vectorstores](../tabs/vectorstores-tab.md) – Vytváření vector stores pro RAG uzly
