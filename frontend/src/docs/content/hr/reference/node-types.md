# Tipovi čvorova

Heym pruža razne tipove čvorova za izgradnju workflows-a. Koristite [izraze](./expression-dsl.md) poput `$input.text` i `$nodeLabel.field` u konfiguraciji čvora.

## Trigger čvorovi

| Čvor | Opis | Izlazi |
|------|-------------|---------|
| [Input](../nodes/input-node.md) | Točka unosa teksta za workflow (HTTP/[webhook](./webhooks.md)) | 1 |
| [Cron](../nodes/cron-node.md) | Aktivira se prema rasporedu (cron izraz) | 1 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Aktivira se kada stigne ažuriranje webhook-a Telegram bota | 1 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Aktivira se kada Slack pošalje Events API webhook | 1 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Aktivira se kada Discord pošalje webhook za interakciju s aplikacijom | 1 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Aktivira se kada nova e-pošta stigne u IMAP poštanski sandučić | 1 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Aktivira se kada Heym objavi događaj platforme (grupirani niz) | 1 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Aktivira se iz odlazne veze na vanjski WebSocket poslužitelj | 1 |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Stvara vezu za jednokratno učitavanje i pokreće se kada se učita velika datoteka | 1 |
| [RabbitMQ](../nodes/rabbitmq-node.md) | Aktivira se kada poruka stigne iz reda | 1 |
| [Error Handler](../nodes/error-handler-node.md) | Pokreće se kada dođe do pogreške u bilo kojem čvoru (bez dolazne ivice) | 1 |

Pogledajte [Triggers](./triggers.md) za sve ulazne točke.

## AI čvorovi

| Čvor | Opis | Ulazi | Izlazi |
|------|-------------|--------|---------|
| [LLM](../nodes/llm-node.md) | Obrada teksta s jezičnim modelom | 1 | 1 |
| [Decision](../nodes/decision-node.md) | Postavlja pitanja modelu odluka i grana se prema vjerojatnostima koje vraća | 1 | 1 |
| [AI Agent](../nodes/agent-node.md) | LLM s pozivanjem alata, vještinama, MCP, opcionalnom [ljudskom revizijom](./human-in-the-loop.md) i opcionalnom [trajnom memorijom](./agent-persistent-memory.md). Pogledajte [Agent Architecture](./agent-architecture.md). | 1 | 1, plus opcionalni `review` izlaz |
| [Codex](../nodes/codex-node.md) | Pokreće lokalni Codex CLI protiv GitHub repozitorija koristeći ChatGPT/Codex pristupni token | 1 | 1, plus `question` izlaz |
| [OpenCode Go](../nodes/opencode-go-node.md) | Pokreće OpenCode CLI protiv GitHub repozitorija u zaštićenoj posudi koristeći OpenCode Go gateway API ključ | 1 | 1 |
| [MCP Call](../nodes/mcp-call-node.md) | Poziva određeni MCP alat izravno bez odabira LLM-a | 1 | 1 |
| [RAG / Vector Store](../nodes/rag-node.md) | Umetanje, ažuriranje, brisanje ili pretraživanje (vektorsko ili hibridno vektorsko + BM25) u Qdrant ili Postgres (pgvector) [vektorskom spremištu](../tabs/vectorstores-tab.md) za RAG | 1 | 1 |

## Logički čvorovi

| Čvor | Opis | Ulazi | Izlazi |
|------|-------------|--------|---------|
| [Condition](../nodes/condition-node.md) | Grana se na temelju if/else | 1 | 2 (true/false) |
| [Switch](../nodes/switch-node.md) | Usmjerava prema podudaranju vrijednosti s slučajevima | 1 | n |
| [Merge](../nodes/merge-node.md) | Čeka na više ulaza i spaja ih | n | 1 |
| [Loop](../nodes/loop-node.md) | Iterira kroz niz | 1 | 2 (loop/done) |

## Podatkovni čvorovi

| Čvor | Opis | Ulazi | Izlazi |
|------|-------------|--------|---------|
| [Set](../nodes/set-node.md) | Transformira i mapira podatke | 1 | 1 |
| [Converter](../nodes/converter-node.md) | Konvertira podatke između formata (CSV, JSON, XML) i OCR slike ili PDF-ova u tekst | 1 | 1 |
| [Code](../nodes/code-node.md) | Pokreće Python u jednokratnom, mrežno izoliranom sandboxu s vlastitim requirements.txt | 1 | 1 |
| [Variable](../nodes/variable-node.md) | Postavlja ili dohvaća varijablu (lokalnu za workflow ili [globalnu](./global-variables.md)) | 1 | 1 |
| [Execute](../nodes/execute-node.md) | Poziva drugi workflow | 1 | 1 |
| [Heym](../nodes/heym-node.md) | Čita Heym workflows i povijest izvršavanja | 1 | 1 |
## Čvorovi za integraciju

| Čvor | Opis | Ulazi | Izlazi |
|------|-------------|--------|---------|
| [HTTP](../nodes/http-node.md) | Izvršavanje HTTP zahtjeva (cURL) | 0 ili 1 | 1 |
| [WebSocket Send](../nodes/websocket-send-node.md) | Povezivanje na vanjski WebSocket i slanje jedne poruke | 1 | 1 |
| [Telegram](../nodes/telegram-node.md) | Slanje poruka Telegram bota | 1 | 1 |
| [Slack](../nodes/slack-node.md) | Slanje Slack poruka | 1 | 1 |
| [Discord](../nodes/discord-node.md) | Slanje Discord webhook poruka | 1 | 1 |
| [Send Email](../nodes/send-email-node.md) | Slanje e-pošte putem SMTP-a | 1 | 1 |
| [Redis](../nodes/redis-node.md) | Redis operacije (set, get, hasKey, deleteKey) | 1 | 1 |
| [Grist](../nodes/grist-node.md) | Čitanje/pisanje Grist proračunskih tablica | 1 | 1 |
| [GitHub](../nodes/github-node.md) | Upravljanje repozitorijima, korisnicima, problemima, zahtjevima za povlačenje, recenzijama, izdanjima, Actions workflows i datotekama putem GitHub REST API-a | 1 | 1 |
| [Jira](../nodes/jira-node.md) | Upravljanje Jira projektima, problemima, komentarima, privicima, korisnicima, obavijestima i prijelazima radnog toka putem Jira REST API-a | 1 | 1 |
| [Linear](../nodes/linear-node.md) | Upravljanje Linear timovima, projektima, problemima, stanjima radnog toka i komentarima putem GraphQL-a | 1 | 1 |
| [Google Sheets](../nodes/google-sheets-node.md) | Čitanje/pisanje Google Sheets putem OAuth2 | 1 | 1 |
| [Google Drive](../nodes/google-drive-node.md) | Popisivanje, preuzimanje, ažuriranje i brisanje datoteka na Google Drive-u putem OAuth2 | 1 | 1 |
| [BigQuery](../nodes/bigquery-node.md) | Izvršavanje SQL upita i umetanje redaka u BigQuery | 1 | 1 |
| [Supabase](../nodes/supabase-node.md) | Upit i mutacija Supabase tablica putem PostgREST-a | 1 | 1 |
| [ClickHouse](../nodes/clickhouse-node.md) | Izvršavanje SQL, CRUD i operacija brojanja protiv ClickHouse-a | 1 | 1 |
| [Notion](../nodes/notion-node.md) | Upravljanje Notion bazama podataka, izvorima podataka, stranicama i blokovima | 1 | 1 |
| [Sentry](../nodes/sentry-node.md) | Upravljanje Sentry organizacijama, projektima, timovima, problemima, događajima i izdanjima | 1 | 1 |
| [Amazon S3](../nodes/amazon-s3-node.md) | Upravljanje spremnicima i mapama; popisivanje, učitavanje, preuzimanje, kopiranje i brisanje objekata | 1 | 1 |
| [DataTable](../nodes/datatable-node.md) | Čitanje/pisanje Heym DataTables (prva strana pohrana) | 1 | 1 |
| [Drive](../nodes/drive-node.md) | Upravljanje datotekama na Drive-u: brisanje, postavljanje lozinke, TTL, maksimalni preuzimanja, dijeljenje/uklanjanje dijeljenja tima | 1 | 1 |

## Čvorovi za automatizaciju

| Čvor | Opis | Ulazi | Izlazi |
|------|-------------|--------|---------|
| [Crawler](../nodes/crawler-node.md) | Stranice za web scraping s FlareSolverr-om | 1 | 1 |
| [Playwright](../nodes/playwright-node.md) | Automatizacija preglednika s AI korakom i Auto Heal | 1 | 1 |

## Korisni čvorovi

| Čvor | Opis | Ulazi | Izlazi |
|------|-------------|--------|---------|
| [Wait](../nodes/wait-node.md) | Odgoda izvršavanja | 1 | 1 |
| [Output](../nodes/output-node.md) | Izlazna točka | 1 | 1 |
| [JSON output mapper](../nodes/json-output-mapper-node.md) | Mapiranje polja na JSON objekt; jedini terminal = tijelo webhook/run na vrhu | 1 | 0 |
| [HTML output mapper](../nodes/html-output-mapper-node.md) | Renderiranje HTML stranice; jedini terminal = webhook odgovara s text/html | 1 | 0 |
| [Chart Output](../nodes/chart-output-node.md) | Izlaz terminalnog widgeta nadzorne ploče koji mapira uzlazne redove u chart payloads | 1 | 0 |
| [Sticky Note](../nodes/sticky-note-node.md) | Dodavanje markdown bilješki na platno (nije izvršeno) | 0 | 0 |
| [Console Log](../nodes/console-log-node.md) | Zapisivanje u konzolu poslužitelja | 1 | 1 |
| [Disable Node](../nodes/disable-node.md) | Onemogućavanje drugog čvora u workflow-u | 1 | 1 |
| [Enable Node](../nodes/enable-node.md) | Omogućavanje onemogućenog čvora u workflow-u | 1 | 1 |
| [Throw Error](../nodes/throw-error-node.md) | Prekid workflow-a s odgovorom o grešci | 1 | 0 |

## Čvorovi za dodatke

Čvorovi za dodatke pružaju se putem dodataka instaliranih na instanci. Svaki instalirani dodatak pojavljuje se u paleti pod **Plugins** s vlastitim imenom; u pozadini se mapira na jednu od ove dvije vrste čvorova.

| Čvor | Opis | Ulazi | Izlazi |
|------|-------------|--------|---------|
| [Plugin](../nodes/plugin-node.md) | Prilagođena akcija koju pruža instalirani dodatak | 1 | 1 |
| [Plugin Trigger](../nodes/plugin-trigger-node.md) | Prilagođeni okidač koji pruža instalirani dodatak | 0 | 1 |
## Povezani

- [Značajke Platna](./canvas-features.md) – Pin podataka, zapisi izvršavanja, omogućavanje/onemogućavanje, ekstrakcija u pod-workflow
- [Agent Čvor](../nodes/agent-node.md) – Detaljna referenca za AI Agent čvor
- [Arhitektura Agenta](./agent-architecture.md) – Pod-agenti, orkestrator, vještine, MCP, pozivanje alata
- [Trajna Memorija Agenta](./agent-persistent-memory.md) – Graf znanja po čvorovima, dijeljenje i pozadinska ekstrakcija
- [Čovjek u Petlji](./human-in-the-loop.md) – Pauziranje izlaza agenta za odobrenje od strane čovjeka
- [Expression DSL](./expression-dsl.md) – Referenciranje podataka u konfiguraciji čvora
- [Dijalog za Evaluaciju Izraza](./expression-evaluation-dialog.md) – Proširivi uređivač s pregledom u stvarnom vremenu
- [Okidač za Učitavanje Datoteka](../nodes/file-upload-trigger-node.md) – Prihvaćanje velikih multipart učitavanja putem jednokratnih poveznica
- [WebSocket Okidač](../nodes/websocket-trigger-node.md) – Okidač za izlazne socket veze u stvarnom vremenu
- [WebSocket Slanje](../nodes/websocket-send-node.md) – Slanje poruka na vanjske socket veze
- [Struktura Workflows-a](./workflow-structure.md) – JSON format za čvorove i rubove
- [Okidači](./triggers.md) – Svi ulazni punktovi za workflow
- [Zaslon Vjerodajnica](../tabs/credentials-tab.md) – Dodavanje API ključeva za LLM, HTTP i druge čvorove
- [Dijeljenje Vjerodajnica](./credentials-sharing.md) – Dijeljenje vjerodajnica s drugim korisnicima
- [Portal](./portal.md) – Izlaganje workflows-a kao javnih chat UI-a
- [Vektorska Spremišta](../tabs/vectorstores-tab.md) – Kreiranje vektorskih spremišta za RAG čvorove
