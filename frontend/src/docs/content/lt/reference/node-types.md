# Mazgų Tipai

Heym siūlo įvairius mazgų tipus, skirtus Workflow kūrimui. Naudokite [išraiškas](./expression-dsl.md), tokias kaip `$input.text` ir `$nodeLabel.field`, mazgo konfigūracijoje.

## Trigger Mazgai

| Mazgas | Aprašymas | Išėjimai |
|--------|-----------|----------|
| [Įvesties](../nodes/input-node.md) | Teksto įvedimo taškas Workflow (HTTP/[webhook](./webhooks.md)) | 1 |
| [Cron](../nodes/cron-node.md) | Iššaukimas pagal tvarkaraštį (cron išraiška) | 1 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Iššaukimas, kai atvyksta Telegram bot webhook atnaujinimas | 1 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Iššaukimas, kai Slack siunčia Events API webhook | 1 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Iššaukimas, kai Discord siunčia programos sąveikos webhook | 1 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Iššaukimas, kai naujas el. paštas atvyksta į IMAP pašto dėžutę | 1 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Iššaukimas, kai Heym paskelbia platformos įvykį (grupuotas masyvas) | 1 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Iššaukimas iš išorinio WebSocket serverio | 1 |
| [Failo Įkėlimo Trigger](../nodes/file-upload-trigger-node.md) | Sukurti vienkartinį įkėlimo nuorodą ir pradėti, kai įkeltas didelis failas | 1 |
| [RabbitMQ](../nodes/rabbitmq-node.md) | Iššaukimas, kai gautas pranešimas iš eilės | 1 |
| [Klaidos Tvarkyklė](../nodes/error-handler-node.md) | Vykdomas, kai bet kuris mazgas sukelia klaidą (be atvykstančio krašto) | 1 |

Žr. [Trigger](./triggers.md) visiems įėjimo taškams.

## AI Mazgai

| Mazgas | Aprašymas | Įėjimai | Išėjimai |
|--------|-----------|---------|----------|
| [LLM](../nodes/llm-node.md) | Apdoroti tekstą naudojant kalbos modelį | 1 | 1 |
| [Sprendimas](../nodes/decision-node.md) | Užduoti sprendimų modeliui tipizuotus klausimus ir šakoti pagal grąžinamas tikimybes | 1 | 1 |
| [AI Agentas](../nodes/agent-node.md) | LLM su įrankių skambinimu, įgūdžiais, MCP, neprivalomu [žmogiškuoju vertinimu](./human-in-the-loop.md) ir neprivalomu [nuolatiniu atminties grafu](./agent-persistent-memory.md). Žr. [Agento Architektūra](./agent-architecture.md). | 1 | 1, plius neprivalomas `review` išėjimas |
| [Codex](../nodes/codex-node.md) | Vykdyti vietinį Codex CLI prieš GitHub saugyklą naudojant ChatGPT/Codex prieigos tokeną | 1 | 1, plius `question` išėjimas |
| [OpenCode Go](../nodes/opencode-go-node.md) | Vykdyti OpenCode CLI prieš GitHub saugyklą sustiprintame konteineryje naudojant OpenCode Go gateway API raktą | 1 | 1 |
| [MCP Skambinimas](../nodes/mcp-call-node.md) | Skambinti konkrečiam MCP įrankiui tiesiogiai be LLM pasirinkimo | 1 | 1 |
| [RAG / Vektorių Saugykla](../nodes/rag-node.md) | Įterpti, atnaujinti, ištrinti arba ieškoti (vektorinė arba hibridinė vektorinė + BM25) Qdrant arba Postgres (pgvector) [vektorių saugykloje](../tabs/vectorstores-tab.md) RAG | 1 | 1 |

## Logikos Mazgai

| Mazgas | Aprašymas | Įėjimai | Išėjimai |
|--------|-----------|---------|----------|
| [Sąlyga](../nodes/condition-node.md) | Šakoti pagal if/else | 1 | 2 (true/false) |
| [Perjungti](../nodes/switch-node.md) | Nukreipti pagal vertės atitikimą atvejams | 1 | n |
| [Sujungti](../nodes/merge-node.md) | Laukti kelių įėjimų ir sujungti | n | 1 |
| [Ciklas](../nodes/loop-node.md) | Kartoti per masyvą | 1 | 2 (loop/done) |

## Duomenų Mazgai

| Mazgas | Aprašymas | Įėjimai | Išėjimai |
|--------|-----------|---------|----------|
| [Nustatyti](../nodes/set-node.md) | Transformuoti ir žemėlapiuoti duomenis | 1 | 1 |
| [Konverteris](../nodes/converter-node.md) | Konvertuoti duomenis tarp formatų (CSV, JSON, XML) ir OCR vaizdus ar PDF į tekstą | 1 | 1 |
| [Kodas](../nodes/code-node.md) | Vykdyti Python tinklo izoliacijoje esančiame smėlio dėžėje su savo requirements.txt | 1 | 1 |
| [Kintamasis](../nodes/variable-node.md) | Nustatyti arba gauti kintamąjį (workflow vietinis arba [globalus](./global-variables.md)) | 1 | 1 |
| [Vykdyti](../nodes/execute-node.md) | Skambinti kitam workflow | 1 | 1 |
| [Heym](../nodes/heym-node.md) | Skaityti Heym workflows ir vykdymo istoriją | 1 | 1 |
## Integracijos mazgai

| Mazgas | Aprašymas | Įvestys | Išvestys |
|--------|-----------|---------|----------|
| [HTTP](../nodes/http-node.md) | Atlikti HTTP užklausas (cURL) | 0 arba 1 | 1 |
| [WebSocket Send](../nodes/websocket-send-node.md) | Prisijungti prie išorinio WebSocket ir siųsti vieną pranešimą | 1 | 1 |
| [Telegram](../nodes/telegram-node.md) | Siųsti Telegram bot pranešimus | 1 | 1 |
| [Slack](../nodes/slack-node.md) | Siųsti Slack pranešimus | 1 | 1 |
| [Discord](../nodes/discord-node.md) | Siųsti Discord webhook pranešimus | 1 | 1 |
| [Send Email](../nodes/send-email-node.md) | Siųsti el. laiškus per SMTP | 1 | 1 |
| [Redis](../nodes/redis-node.md) | Redis operacijos (set, get, hasKey, deleteKey) | 1 | 1 |
| [Grist](../nodes/grist-node.md) | Skaityti/rašyti Grist skaičiuokles | 1 | 1 |
| [GitHub](../nodes/github-node.md) | Tvarkyti saugyklas, vartotojus, problemas, pull request'us, apžvalgas, išleidimus, Actions workflows ir failus per GitHub REST API | 1 | 1 |
| [Jira](../nodes/jira-node.md) | Tvarkyti Jira projektus, problemas, komentarus, priedus, vartotojus, pranešimus ir darbo eigų perėjimus per Jira REST API | 1 | 1 |
| [Linear](../nodes/linear-node.md) | Tvarkyti Linear komandas, projektus, problemas, darbo eigos būsenas ir komentarus per GraphQL | 1 | 1 |
| [Google Sheets](../nodes/google-sheets-node.md) | Skaityti/rašyti Google Sheets per OAuth2 | 1 | 1 |
| [Google Drive](../nodes/google-drive-node.md) | Sąrašas, atsisiuntimas, atnaujinimas ir Google Drive failų ištrynimas per OAuth2 | 1 | 1 |
| [BigQuery](../nodes/bigquery-node.md) | Vykdyti SQL užklausas ir įterpti eilutes BigQuery | 1 | 1 |
| [Supabase](../nodes/supabase-node.md) | Užklausti ir keisti Supabase lenteles per PostgREST | 1 | 1 |
| [ClickHouse](../nodes/clickhouse-node.md) | Vykdyti SQL, CRUD ir skaičiavimo operacijas ClickHouse | 1 | 1 |
| [Notion](../nodes/notion-node.md) | Tvarkyti Notion duomenų bazes, duomenų šaltinius, puslapius ir blokus | 1 | 1 |
| [Sentry](../nodes/sentry-node.md) | Tvarkyti Sentry organizacijas, projektus, komandas, problemas, įvykius ir išleidimus | 1 | 1 |
| [Amazon S3](../nodes/amazon-s3-node.md) | Tvarkyti kibirus ir aplankus; sąrašas, įkėlimas, atsisiuntimas, kopijavimas ir objektų ištrynimas | 1 | 1 |
| [DataTable](../nodes/datatable-node.md) | Skaityti/rašyti Heym DataTables (pirmo lygio saugykla) | 1 | 1 |
| [Drive](../nodes/drive-node.md) | Tvarkyti Drive failus: ištrinti, nustatyti slaptažodį, TTL, maksimalus atsisiuntimų skaičius, komandos dalijimasis/nedalyjimas | 1 | 1 |

## Automatizavimo mazgai

| Mazgas | Aprašymas | Įvestys | Išvestys |
|--------|-----------|---------|----------|
| [Crawler](../nodes/crawler-node.md) | Išgauti tinklalapius naudojant FlareSolverr | 1 | 1 |
| [Playwright](../nodes/playwright-node.md) | Naršyklės automatizavimas su AI žingsniu ir Auto Heal | 1 | 1 |

## Naudingumo mazgai

| Mazgas | Aprašymas | Įvestys | Išvestys |
|--------|-----------|---------|----------|
| [Wait](../nodes/wait-node.md) | Atidėti vykdymą | 1 | 1 |
| [Output](../nodes/output-node.md) | Išvesties endpointas | 1 | 1 |
| [JSON output mapper](../nodes/json-output-mapper-node.md) | Susieti laukus su JSON objektu; vienintelis terminalas = aukščiausio lygio webhook/run kūnas | 1 | 0 |
| [HTML output mapper](../nodes/html-output-mapper-node.md) | Sugeneruoti HTML puslapį; vienintelis terminalas = webhook atsako su text/html | 1 | 0 |
| [Chart Output](../nodes/chart-output-node.md) | Terminalo valdymo skydelio išvestis, kuri susieja aukščiau esančias eilutes su grafiko payload'ais | 1 | 0 |
| [Sticky Note](../nodes/sticky-note-node.md) | Pridėti markdown pastabas prie drobės (nevykdomos) | 0 | 0 |
| [Console Log](../nodes/console-log-node.md) | Žurnaluoti į backend konsolę | 1 | 1 |
| [Disable Node](../nodes/disable-node.md) | Išjungti kitą mazgą darbo eigoje | 1 | 1 |
| [Enable Node](../nodes/enable-node.md) | Įjungti išjungtą mazgą darbo eigoje | 1 | 1 |
| [Throw Error](../nodes/throw-error-node.md) | Sustabdyti darbo eigą su klaidos atsaku | 1 | 0 |

## Priedų mazgai

Priedų mazgai yra teikiami priedais, įdiegtais instancijoje. Kiekvienas įdiegtas priedas pasirodo paletėje po **Plugins** su savo pavadinimu; užkulisiuose jis atitinka vieną iš šių dviejų mazgų tipų.

| Mazgas | Aprašymas | Įvestys | Išvestys |
|--------|-----------|---------|----------|
| [Plugin](../nodes/plugin-node.md) | Pasirinktinis veiksmas, teikiamas įdiegto priedo | 1 | 1 |
| [Plugin Trigger](../nodes/plugin-trigger-node.md) | Pasirinktinis triggeris, teikiamas įdiegto priedo | 0 | 1 |
## Susiję

- [Drobės funkcijos](./canvas-features.md) – Duomenų fiksavimas, vykdymo žurnalai, įgalinimas/išjungimas, ištraukimas į sub-workflow
- [Agentų mazgas](../nodes/agent-node.md) – Išsami nuoroda į AI Agent mazgą
- [Agentų architektūra](./agent-architecture.md) – Sub-agentai, orkestratorius, įgūdžiai, MCP, įrankių skambinimas
- [Agentų nuolatinė atmintis](./agent-persistent-memory.md) – Žinių grafas kiekvienam mazgui, dalijimasis ir fono ištraukimas
- [Žmogus cikle](./human-in-the-loop.md) – Sustabdyti agento išvestį žmogaus patvirtinimui
- [Išraiškų DSL](./expression-dsl.md) – Duomenų nurodymas mazgo konfigūracijoje
- [Išraiškų vertinimo dialogas](./expression-evaluation-dialog.md) – Išplečiamas redaktorius su gyvu fono peržiūra
- [Failo įkėlimo Trigger](../nodes/file-upload-trigger-node.md) – Priimti didelius multipart įkėlimus per vienkartinius nuorodas
- [WebSocket Trigger](../nodes/websocket-trigger-node.md) – Realaus laiko išorinis socket trigger
- [WebSocket siuntimas](../nodes/websocket-send-node.md) – Siųsti pranešimus į išorinius socket'us
- [Workflow struktūra](./workflow-structure.md) – JSON formatas mazgams ir briaunoms
- [Trigger'ai](./triggers.md) – Visi workflow įėjimo taškai
- [Kredencialų skirtukas](../tabs/credentials-tab.md) – Pridėti API raktus LLM, HTTP ir kitiems mazgams
- [Kredencialų dalijimasis](./credentials-sharing.md) – Dalintis kredencialais su kitais vartotojais
- [Portalas](./portal.md) – Pateikti workflows kaip viešas chat UI
- [Vektorių saugyklų skirtukas](../tabs/vectorstores-tab.md) – Kurti vektorių saugyklas RAG mazgams
