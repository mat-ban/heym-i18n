# Solmutyypit

Heym tarjoaa monipuolisia solmutyyppejä workflowien rakentamiseen. Käytä [lausekkeita](./expression-dsl.md) kuten `$input.text` ja `$nodeLabel.field` solmujen määrittelyssä.

## Käynnistyssolmut

| Solmu | Kuvaus | Lähtöjä |
|------|-------------|---------|
| [Syöte](../nodes/input-node.md) | Workflown tekstisyötepiste (HTTP/[webhook](./webhooks.md)) | 1 |
| [Cron](../nodes/cron-node.md) | Käynnistä aikataulun mukaan (cron-lauseke) | 1 |
| [Telegram-käynnistin](../nodes/telegram-trigger-node.md) | Käynnistä, kun Telegram-botin webhook-päivitys saapuu | 1 |
| [Slack-käynnistin](../nodes/slack-trigger-node.md) | Käynnistä, kun Slack lähettää Events API -webhookin | 1 |
| [Discord-käynnistin](../nodes/discord-trigger-node.md) | Käynnistä, kun Discord lähettää sovelluksen interaktio-webhookin | 1 |
| [IMAP-käynnistin](../nodes/imap-trigger-node.md) | Käynnistä, kun uusi sähköposti saapuu IMAP-postilaatikkoon | 1 |
| [Heym-käynnistin](../nodes/heym-trigger-node.md) | Käynnistä, kun Heym julkaisee alustatapahtuman (erämuodossa oleva taulukko) | 1 |
| [WebSocket-käynnistin](../nodes/websocket-trigger-node.md) | Käynnistä ulospäin suuntautuvasta yhteydestä ulkoiseen WebSocket-palvelimeen | 1 |
| [Tiedostonlatauskäynnistin](../nodes/file-upload-trigger-node.md) | Luo kertakäyttöinen latauslinkki ja aloita, kun suuri tiedosto ladataan | 1 |
| [RabbitMQ](../nodes/rabbitmq-node.md) | Käynnistä, kun viesti vastaanotetaan jonosta | 1 |
| [Virheenkäsittelijä](../nodes/error-handler-node.md) | Suorita, kun mikä tahansa solmu aiheuttaa virheen (ei saapuvia yhteyksiä) | 1 |

Katso [Käynnistimet](./triggers.md) kaikista aloituspisteistä.

## Tekoälysolmut

| Solmu | Kuvaus | Tuloja | Lähtöjä |
|------|-------------|--------|---------|
| [LLM](../nodes/llm-node.md) | Käsittele tekstiä kielimallilla | 1 | 1 |
| [Päätös](../nodes/decision-node.md) | Kysy päätösmallilta tyypitettyjä kysymyksiä ja haaroitu sen palauttamien todennäköisyyksien perusteella | 1 | 1 |
| [Tekoälyagentti](../nodes/agent-node.md) | LLM työkalujen kutsumisella, taidoilla, MCP:llä, valinnaisella [ihmisen tarkastuksella](./human-in-the-loop.md) ja valinnaisella [pysyvällä muistikaaviolla](./agent-persistent-memory.md). Katso [Agenttien arkkitehtuuri](./agent-architecture.md). | 1 | 1, plus valinnainen `review`-lähtö |
| [Codex](../nodes/codex-node.md) | Suorita paikallinen Codex CLI GitHub-repositoriota vastaan käyttäen ChatGPT/Codex -pääsyavainta | 1 | 1, plus `question`-lähtö |
| [OpenCode Go](../nodes/opencode-go-node.md) | Suorita OpenCode CLI GitHub-repositoriota vastaan kovettetussa kontissa käyttäen OpenCode Go -yhdyskäytävän API-avainta | 1 | 1 |
| [MCP-kutsu](../nodes/mcp-call-node.md) | Kutsu tiettyä MCP-työkalua suoraan ilman, että LLM valitsee sen | 1 | 1 |
| [RAG / Vektorivarasto](../nodes/rag-node.md) | Lisää, päivitä, poista tai hae Qdrant- tai Postgres (pgvector) -[vektorivarastosta](../tabs/vectorstores-tab.md) RAG:ia varten | 1 | 1 |

## Logiikkasolmut

| Solmu | Kuvaus | Tuloja | Lähtöjä |
|------|-------------|--------|---------|
| [Ehto](../nodes/condition-node.md) | Haaroitu jos/else -perusteella | 1 | 2 (tosi/epätosi) |
| [Kytkin](../nodes/switch-node.md) | Reititä vastaamalla arvoa tapauksiin | 1 | n |
| [Yhdistä](../nodes/merge-node.md) | Odota useita tuloja ja yhdistä ne | n | 1 |
| [Silmukka](../nodes/loop-node.md) | Toista taulukon yli | 1 | 2 (silmukka/valmis) |

## Datasolmut

| Solmu | Kuvaus | Tuloja | Lähtöjä |
|------|-------------|--------|---------|
| [Aseta](../nodes/set-node.md) | Muunna ja yhdistä dataa | 1 | 1 |
| [Muunnin](../nodes/converter-node.md) | Muunna dataa muotojen välillä (CSV, JSON, XML) ja tunnista kuvista tai PDF:istä teksti | 1 | 1 |
| [Koodi](../nodes/code-node.md) | Suorita Pythonia erillisessä, verkosta eristetyssä hiekkalaatikossa omassa requirements.txt -tiedostossa | 1 | 1 |
| [Muuttuja](../nodes/variable-node.md) | Aseta tai hae muuttuja (workflow-lokaali tai [globaali](./global-variables.md)) | 1 | 1 |
| [Suorita](../nodes/execute-node.md) | Kutsu toista workflowta | 1 | 1 |
| [Heym](../nodes/heym-node.md) | Lue Heym-workflowt ja suoritushistoria | 1 | 1 |
## Integraatiosolmut

| Solmu | Kuvaus | Syötteet | Tulosteet |
|------|-------------|--------|---------|
| [HTTP](../nodes/http-node.md) | Tee HTTP-pyyntöjä (cURL) | 0 tai 1 | 1 |
| [WebSocket Send](../nodes/websocket-send-node.md) | Yhdistä ulkoiseen WebSocketiin ja lähetä yksi viesti | 1 | 1 |
| [Telegram](../nodes/telegram-node.md) | Lähetä Telegram-bottiviestit | 1 | 1 |
| [Slack](../nodes/slack-node.md) | Lähetä Slack-viestejä | 1 | 1 |
| [Discord](../nodes/discord-node.md) | Lähetä Discord-webhook-viestejä | 1 | 1 |
| [Send Email](../nodes/send-email-node.md) | Lähetä sähköposteja SMTP:n kautta | 1 | 1 |
| [Redis](../nodes/redis-node.md) | Redis-operaatiot (set, get, hasKey, deleteKey) | 1 | 1 |
| [Grist](../nodes/grist-node.md) | Lue/kirjoita Grist-taulukoita | 1 | 1 |
| [GitHub](../nodes/github-node.md) | Hallinnoi GitHub-repositorioita, käyttäjiä, issueita, pull requesteja, arvosteluja, julkaisuja, Actions-workfloweja ja tiedostoja GitHub REST API:n kautta | 1 | 1 |
| [Jira](../nodes/jira-node.md) | Hallinnoi Jira-projekteja, issueita, kommentteja, liitteitä, käyttäjiä, ilmoituksia ja workflow-siirtymiä Jira REST API:n kautta | 1 | 1 |
| [Linear](../nodes/linear-node.md) | Hallinnoi Linear-tiimejä, projekteja, issueita, workflow-tiloja ja kommentteja GraphQL:n kautta | 1 | 1 |
| [Google Sheets](../nodes/google-sheets-node.md) | Lue/kirjoita Google Sheets -tiedostoja OAuth2:n kautta | 1 | 1 |
| [Google Drive](../nodes/google-drive-node.md) | Listaa, lataa, päivitä ja poista Google Drive -tiedostoja OAuth2:n kautta | 1 | 1 |
| [BigQuery](../nodes/bigquery-node.md) | Suorita SQL-kyselyitä ja lisää rivejä BigQueryssä | 1 | 1 |
| [Supabase](../nodes/supabase-node.md) | Kysely ja muokkaus Supabase-taulukoissa PostgREST:n kautta | 1 | 1 |
| [ClickHouse](../nodes/clickhouse-node.md) | Suorita SQL-, CRUD- ja laskentaoperaatioita ClickHouseen | 1 | 1 |
| [Notion](../nodes/notion-node.md) | Hallinnoi Notion-tietokantoja, tietolähteitä, sivuja ja lohkoja | 1 | 1 |
| [Sentry](../nodes/sentry-node.md) | Hallinnoi Sentry-organisaatioita, projekteja, tiimejä, issueita, tapahtumia ja julkaisuja | 1 | 1 |
| [Amazon S3](../nodes/amazon-s3-node.md) | Hallinnoi säiliöitä ja kansioita; listaa, lähetä, lataa, kopioi ja poista objekteja | 1 | 1 |
| [DataTable](../nodes/datatable-node.md) | Lue/kirjoita Heym DataTables -tietotaulukoita (ensijainen tallennus) | 1 | 1 |
| [Drive](../nodes/drive-node.md) | Hallinnoi Drive-tiedostoja: poista, aseta salasana, TTL, maksimilataukset, tiimijako/peru jako | 1 | 1 |

## Automaatiosolmut

| Solmu | Kuvaus | Syötteet | Tulosteet |
|------|-------------|--------|---------|
| [Crawler](../nodes/crawler-node.md) | Skraappa verkkosivuja FlareSolverr:lla | 1 | 1 |
| [Playwright](../nodes/playwright-node.md) | Selainautomaatio tekoälyaskeleilla ja Auto Heal -toiminnolla | 1 | 1 |

## Apusolmut

| Solmu | Kuvaus | Syötteet | Tulosteet |
|------|-------------|--------|---------|
| [Wait](../nodes/wait-node.md) | Viivästä suoritusta | 1 | 1 |
| [Output](../nodes/output-node.md) | Tulostuspäätepiste | 1 | 1 |
| [JSON output mapper](../nodes/json-output-mapper-node.md) | Mappaa kentät JSON-objektiin; ainoa päätepiste = ylimmän tason webhook/suoritusrunko | 1 | 0 |
| [HTML output mapper](../nodes/html-output-mapper-node.md) | Renderöi HTML-sivu; ainoa päätepiste = webhook vastaa text/html-muodossa | 1 | 0 |
| [Chart Output](../nodes/chart-output-node.md) | Päätepisteen kojetauluwidgetti, joka muuntaa ylävirran rivit kaaviodataksi | 1 | 0 |
| [Sticky Note](../nodes/sticky-note-node.md) | Lisää Markdown-muistiinpanoja canvakselle (ei suoriteta) | 0 | 0 |
| [Console Log](../nodes/console-log-node.md) | Kirjaa taustajärjestelmän konsoliin | 1 | 1 |
| [Disable Node](../nodes/disable-node.md) | Poista toinen workflow-solmu käytöstä | 1 | 1 |
| [Enable Node](../nodes/enable-node.md) | Ota käytöstä poistettu workflow-solmu uudelleen käyttöön | 1 | 1 |
| [Throw Error](../nodes/throw-error-node.md) | Keskeytä workflow virheellisellä vastauksella | 1 | 0 |

## Lisäosien solmut

Lisäosien solmut tarjoavat workflowen asennetut lisäosat. Jokainen asennettu lisäosa näkyy valikossa **Plugins** omalla nimellään; taustalla ne kartoittuvat jompaan kumpaan näistä kahdesta solmutyypistä.

| Solmu | Kuvaus | Syötteet | Tulosteet |
|------|-------------|--------|---------|
| [Plugin](../nodes/plugin-node.md) | Mukautettu toiminto asennetun lisäosan tarjoamana | 1 | 1 |
| [Plugin Trigger](../nodes/plugin-trigger-node.md) | Mukautettu trigger asennetun lisäosan tarjoamana | 0 | 1 |
## Liittyvät

- [Canvas-ominaisuudet](./canvas-features.md) – Datapinni, suorituslokit, käyttöönotto/poisto, eriyttäminen alityönkulkuksi
- [Agent-solmu](../nodes/agent-node.md) – Yksityiskohtainen viite tekoälyagenttisolmusta
- [Agenttien arkkitehtuuri](./agent-architecture.md) – Alustukset, orkestroija, taidot, MCP, työkalujen kutsuminen
- [Agenttien pysyvä muisti](./agent-persistent-memory.md) – Solmukohtainen tietämysgraafi, jakaminen ja taustalla tapahtuva eristäminen
- [Ihmisen osallistuminen](./human-in-the-loop.md) – Keskeytä agentin tuotokset ihmisen hyväksyttäväksi
- [Lausekkeiden DSL](./expression-dsl.md) – Viittaaminen tietoihin solmun asetuksissa
- [Lausekkeiden arviointidialogi](./expression-evaluation-dialog.md) – Laajennettava editori reaaliaikaisella esikatselulla
- [Tiedostonlähetystriggeri](../nodes/file-upload-trigger-node.md) – Hyväksy suuria moniosaisia lähetyksiä kertakäyttölinkkien kautta
- [WebSocket-triggeri](../nodes/websocket-trigger-node.md) – Reaaliaikainen lähtevä socket-triggeri
- [WebSocket-lähetys](../nodes/websocket-send-node.md) – Lähetä viestejä ulkoisiin socketteihin
- [Työnkulun rakenne](./workflow-structure.md) – JSON-muoto solmuille ja yhteyksille
- [Triggerit](./triggers.md) – Kaikki työnkulun aloituspisteet
- [Tunnistetiedot-välilehti](../tabs/credentials-tab.md) – Lisää API-avaimia LLM-, HTTP- ja muihin solmuihin
- [Tunnistetietojen jakaminen](./credentials-sharing.md) – Jaa tunnistetiedot muiden käyttäjien kanssa
- [Portaali](./portal.md) – Julkaise työnkulkuja julkisina keskustelukäyttöliittyminä
- [Vektorivarastot-välilehti](../tabs/vectorstores-tab.md) – Luo vektorivarastoja RAG-solmuille
