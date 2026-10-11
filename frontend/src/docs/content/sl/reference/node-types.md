# Vrste vozlišč

Heym ponuja različne vrste vozlišč za gradnjo workflows. Uporabite [izraze](./expression-dsl.md), kot so `$input.text` in `$nodeLabel.field` v konfiguraciji vozlišča.

## Trigger vozlišča

| Vozlišče | Opis | Izhodi |
|----------|------|--------|
| [Vhodno](../nodes/input-node.md) | Vhodna točka za tekst v workflow (HTTP/[webhook](./webhooks.md)) | 1 |
| [Cron](../nodes/cron-node.md) | Aktivira se po urniku (cron izraz) | 1 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Aktivira se, ko prispe posodobitev webhooka Telegram bota | 1 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Aktivira se, ko Slack pošlje webhook Events API | 1 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Aktivira se, ko Discord pošlje webhook za interakcijo z aplikacijo | 1 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Aktivira se, ko prispe nova e-pošta v IMAP predal | 1 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Aktivira se, ko Heym objavi dogodek platforme (skupinski niz) | 1 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Aktivira se iz odhodne povezave na zunanji WebSocket strežnik | 1 |
| [Trigger za nalaganje datotek](../nodes/file-upload-trigger-node.md) | Ustvari enkratno povezavo za nalaganje in se aktivira, ko je naložena velika datoteka | 1 |
| [RabbitMQ](../nodes/rabbitmq-node.md) | Aktivira se, ko je prejeto sporočilo iz čakalne vrste | 1 |
| [Obvladovalec napak](../nodes/error-handler-node.md) | Izvede se, ko pride do napake v katerem koli vozlišču (brez prihajajoče povezave) | 1 |

Oglejte si [Triggers](./triggers.md) za vse vhodne točke.

## AI vozlišča

| Vozlišče | Opis | Vhodi | Izhodi |
|----------|------|-------|--------|
| [LLM](../nodes/llm-node.md) | Obdelava besedila z jezikovnim modelom | 1 | 1 |
| [Odločitev](../nodes/decision-node.md) | Postavite vprašanja modelu odločanja in razvejajte se glede na verjetnosti, ki jih vrne | 1 | 1 |
| [AI Agent](../nodes/agent-node.md) | LLM z klicem orodij, veščinami, MCP, opcijskim [človeškim pregledom](./human-in-the-loop.md) in opcijskim [trajnim pomnilniškim grafom](./agent-persistent-memory.md). Oglejte si [Arhitekturo agenta](./agent-architecture.md). | 1 | 1, plus opcijski `review` izhod |
| [Codex](../nodes/codex-node.md) | Zaženi lokalni Codex CLI proti GitHub repozitoriju z uporabo dostopnega žetona ChatGPT/Codex | 1 | 1, plus `question` izhod |
| [OpenCode Go](../nodes/opencode-go-node.md) | Zaženi OpenCode CLI proti GitHub repozitoriju v utrjenem vsebniku z uporabo OpenCode Go ključnega API | 1 | 1 |
| [MCP Klic](../nodes/mcp-call-node.md) | Kličite specifično MCP orodje neposredno brez izbire LLM | 1 | 1 |
| [RAG / Vektorska shramba](../nodes/rag-node.md) | Vstavite, posodobite, izbrišite ali iščite v Qdrant ali Postgres (pgvector) [vektorski shrambi](../tabs/vectorstores-tab.md) za RAG | 1 | 1 |

## Logična vozlišča

| Vozlišče | Opis | Vhodi | Izhodi |
|----------|------|-------|--------|
| [Pogoj](../nodes/condition-node.md) | Razvejajte se na podlagi if/else | 1 | 2 (true/false) |
| [Preklop](../nodes/switch-node.md) | Usmerite se z ujemanjem vrednosti s primeri | 1 | n |
| [Združitev](../nodes/merge-node.md) | Počakajte na več vhodov in jih združite | n | 1 |
| [Zanka](../nodes/loop-node.md) | Ponovite čez niz | 1 | 2 (loop/done) |

## Podatkovna vozlišča

| Vozlišče | Opis | Vhodi | Izhodi |
|----------|------|-------|--------|
| [Nastavi](../nodes/set-node.md) | Transformirajte in preslikajte podatke | 1 | 1 |
| [Pretvornik](../nodes/converter-node.md) | Pretvorite podatke med formati (CSV, JSON, XML) in OCR slike ali PDF dokumente v besedilo | 1 | 1 |
| [Koda](../nodes/code-node.md) | Zaženi Python v razgradljivem, omrežno izoliranem peskovniku s svojim requirements.txt | 1 | 1 |
| [Spremenljivka](../nodes/variable-node.md) | Nastavite ali pridobite spremenljivko (lokalno za workflow ali [globalno](./global-variables.md)) | 1 | 1 |
| [Izvedi](../nodes/execute-node.md) | Kličite drug workflow | 1 | 1 |
| [Heym](../nodes/heym-node.md) | Preberite zgodovino workflows in izvajanja Heym | 1 | 1 |
## Integracijski vozlišča

| Vozlišče | Opis | Vhodi | Izhodi |
|----------|------|-------|--------|
| [HTTP](../nodes/http-node.md) | Izvajanje HTTP zahtev (cURL) | 0 ali 1 | 1 |
| [WebSocket Send](../nodes/websocket-send-node.md) | Povezava z zunanjim WebSocketom in pošiljanje ene sporočila | 1 | 1 |
| [Telegram](../nodes/telegram-node.md) | Pošiljanje sporočil Telegram botov | 1 | 1 |
| [Slack](../nodes/slack-node.md) | Pošiljanje sporočil Slack | 1 | 1 |
| [Discord](../nodes/discord-node.md) | Pošiljanje sporočil Discord webhook | 1 | 1 |
| [Send Email](../nodes/send-email-node.md) | Pošiljanje e-pošt preko SMTP | 1 | 1 |
| [Redis](../nodes/redis-node.md) | Operacije z Redisom (set, get, hasKey, deleteKey) | 1 | 1 |
| [Grist](../nodes/grist-node.md) | Branje/pisanje Grist preglednic | 1 | 1 |
| [GitHub](../nodes/github-node.md) | Upravljanje z repozitoriji, uporabniki, težavami, zahtevki za združitev, pregledi, izdajami, Actions workflows in datotekami preko GitHub REST API | 1 | 1 |
| [Jira](../nodes/jira-node.md) | Upravljanje z Jira projekti, težavami, komentarji, priponkami, uporabniki, obvestili in prehodi delovnega toka preko Jira REST API | 1 | 1 |
| [Linear](../nodes/linear-node.md) | Upravljanje z Linear ekipami, projekti, težavami, stanji delovnega toka in komentarji preko GraphQL | 1 | 1 |
| [Google Sheets](../nodes/google-sheets-node.md) | Branje/pisanje Google Sheets preko OAuth2 | 1 | 1 |
| [Google Drive](../nodes/google-drive-node.md) | Seznam, prenos, posodobitev in brisanje datotek Google Drive preko OAuth2 | 1 | 1 |
| [BigQuery](../nodes/bigquery-node.md) | Izvajanje SQL poizvedb in vstavljanje vrstic v BigQuery | 1 | 1 |
| [Supabase](../nodes/supabase-node.md) | Poizvedovanje in spreminjanje tabel Supabase preko PostgREST | 1 | 1 |
| [ClickHouse](../nodes/clickhouse-node.md) | Izvajanje SQL, CRUD in štetja operacij proti ClickHouse | 1 | 1 |
| [Notion](../nodes/notion-node.md) | Upravljanje z Notion bazami podatkov, viri podatkov, stranmi in bloki | 1 | 1 |
| [Sentry](../nodes/sentry-node.md) | Upravljanje z organizacijami, projekti, ekipami, težavami, dogodki in izdajami Sentry | 1 | 1 |
| [Amazon S3](../nodes/amazon-s3-node.md) | Upravljanje z vedri in mapami; seznam, prenos, nalaganje, kopiranje in brisanje objektov | 1 | 1 |
| [DataTable](../nodes/datatable-node.md) | Branje/pisanje Heym DataTables (prva stranka shranjevanja) | 1 | 1 |
| [Drive](../nodes/drive-node.md) | Upravljanje z datotekami Drive: brisanje, nastavitev gesla, TTL, največje prenose, deljenje/ne-deljenje ekipe | 1 | 1 |

## Avtomatizacijska vozlišča

| Vozlišče | Opis | Vhodi | Izhodi |
|----------|------|-------|--------|
| [Crawler](../nodes/crawler-node.md) | Strganje spletnih strani z FlareSolverr | 1 | 1 |
| [Playwright](../nodes/playwright-node.md) | Avtomatizacija brskalnika z AI korakom in Auto Heal | 1 | 1 |

## Uporabna vozlišča

| Vozlišče | Opis | Vhodi | Izhodi |
|----------|------|-------|--------|
| [Wait](../nodes/wait-node.md) | Zamuda pri izvajanju | 1 | 1 |
| [Output](../nodes/output-node.md) | Izhodni endpoint | 1 | 1 |
| [JSON output mapper](../nodes/json-output-mapper-node.md) | Preslikava polj v JSON objekt; edini terminal = telo webhook/run na vrhnji ravni | 1 | 0 |
| [HTML output mapper](../nodes/html-output-mapper-node.md) | Prikaz HTML strani; edini terminal = webhook odgovori z text/html | 1 | 0 |
| [Chart Output](../nodes/chart-output-node.md) | Izhod terminalnega nadzornega plošče, ki preslika zgornje vrstice v chart payloads | 1 | 0 |
| [Sticky Note](../nodes/sticky-note-node.md) | Dodajanje markdown opomb na platno (ni izvedeno) | 0 | 0 |
| [Console Log](../nodes/console-log-node.md) | Zapis v konzolo backend | 1 | 1 |
| [Disable Node](../nodes/disable-node.md) | Onemogočanje drugega vozlišča v workflow | 1 | 1 |
| [Enable Node](../nodes/enable-node.md) | Omogočanje onemogočenega vozlišča v workflow | 1 | 1 |
| [Throw Error](../nodes/throw-error-node.md) | Ustavitev workflow z napako | 1 | 0 |

## Vozlišča vtičnikov

Vozlišča vtičnikov zagotavljajo vtičniki, nameščeni na instanci. Vsak nameščen vtičnik se prikaže v paleti pod **Vtičniki** s svojim imenom; v ozadju se preslika na eno od teh dveh vrst vozlišč.

| Vozlišče | Opis | Vhodi | Izhodi |
|----------|------|-------|--------|
| [Plugin](../nodes/plugin-node.md) | Prilagojena akcija, ki jo zagotavlja nameščen vtičnik | 1 | 1 |
| [Plugin Trigger](../nodes/plugin-trigger-node.md) | Prilagojen trigger, ki ga zagotavlja nameščen vtičnik | 0 | 1 |
## Sorodne

- [Značilnosti platna](./canvas-features.md) – Prikaz podatkov, dnevniki izvajanja, omogočanje/izklapljanje, ekstrakcija v pod-workflow
- [Agent vozlišče](../nodes/agent-node.md) – Podroben referenčni vodnik za AI Agent vozlišče
- [Arhitektura agenta](./agent-architecture.md) – Pod-agentje, orkestrator, veščine, MCP, klicanje orodij
- [Trajna spomin agenta](./agent-persistent-memory.md) – Graf znanja po vozliščih, deljenje in ekstrakcija v ozadju
- [Človek v zanki](./human-in-the-loop.md) – Ustavitev izhoda agenta za odobritev s strani človeka
- [Izrazni DSL](./expression-dsl.md) – Sklicevanje na podatke v konfiguraciji vozlišča
- [Dialog za vrednotenje izrazov](./expression-evaluation-dialog.md) – Razširljiv urejevalnik z vnaprejšnjim ogledom v ozadju
- [Trigger za nalaganje datotek](../nodes/file-upload-trigger-node.md) – Sprejemanje velikih multipart nalaganj preko enkratnih povezav
- [Trigger za WebSocket](../nodes/websocket-trigger-node.md) – Realnočasovni izhodni socket trigger
- [Pošiljanje preko WebSocket](../nodes/websocket-send-node.md) – Pošiljanje sporočil na zunanje socket-e
- [Struktura workflow](./workflow-structure.md) – JSON format za vozlišča in robove
- [Trigerji](./triggers.md) – Vsi vstopni točki workflow
- [Zavihek poverilnic](../tabs/credentials-tab.md) – Dodajanje API ključev za LLM, HTTP in druga vozlišča
- [Deljenje poverilnic](./credentials-sharing.md) – Deljenje poverilnic z drugimi uporabniki
- [Portal](./portal.md) – Izpostavljanje workflow-ov kot javni chat UI
- [Zavihek vektorskih shrambe](../tabs/vectorstores-tab.md) – Ustvarjanje vektorskih shrambe za RAG vozlišča
