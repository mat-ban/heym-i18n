# Kolmannen osapuolen integraatiot

Heym yhdistää ulkoisiin palveluihin **tunnistetietojen** avulla. Jokainen tunnistetietotyyppi tallentaa yhteyden tiedot yhtä palvelua varten, ja niitä voidaan käyttää uudelleen useissa solmuissa ja workflowissa. Katso lisätietoja kohdasta [Tunnistetiedot](./credentials.md).

Lisää tunnistetiedot kohdassa [Asetukset → Tunnistetiedot](../tabs/credentials-tab.md). Kaikki arvot salataan levylle. Tunnistetietoja voidaan [jakaa](./credentials-sharing.md) muiden käyttäjien tai [Tiimien](./teams.md) kanssa.

Jotkut integraatiosolmut **eivät** vaadi tunnistetietoja. [WebSocket Trigger](../nodes/websocket-trigger-node.md) ja [WebSocket Send](../nodes/websocket-send-node.md) yhdistävät ulkoisiin socket-osoitteisiin käyttämällä solmussa suoraan määritettyä URL-osoitetta, otsikoita ja aliprotokollia.

## Tunnistetietotyypit yleiskatsauksena

| Tyyppi | Käyttäjä | Avainkentät |
|------|---------|------------|
| **OpenAI** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md) | `api_key` |
| **OpenAI Codex** | [Codex](../nodes/codex-node.md) | `access_token` |
| **OpenCode Go** | [OpenCode Go](../nodes/opencode-go-node.md) | `api_key`, valinnainen `base_url` |
| **Google** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key` |
| **GitHub** | [GitHub](../nodes/github-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) | `api_key`, valinnainen `base_url` |
| **Jira** | [Jira-solmu](../nodes/jira-node.md) | `email`, `api_token`, `base_url`, `deployment`, valinnainen `api_version` |
| **Linear** | [Linear-solmu](../nodes/linear-node.md) | `api_key`, tai `client_id` + `client_secret` OAuth2 |
| **Sentry** | [Sentry-solmu](../nodes/sentry-node.md) | `api_token`, valinnainen `base_url` |
| **Custom** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key`, `base_url` |
| **Decision Model** | [Decision](../nodes/decision-node.md), [Arvioinnit](../tabs/evals-tab.md) (LLM-as-Judge judge) | `base_url`, valinnainen `api_key` |
| **Model Router (Auto Model)** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Keskustelu, AI Defaults | decision model -tunnistetieto sekä mallivaihtoehdot, jotka viittaavat muihin tunnistetietoihin |
| **Cohere** | Embeddings | `api_key` |
| **RAG: Qdrant + OpenAI** | [RAG](../nodes/rag-node.md), Vektorivarastot | `qdrant_host`, `openai_api_key` |
| **RAG: Psql + OpenAI** | [RAG](../nodes/rag-node.md), Vektorivarastot | `openai_api_key` (vektorit tallennetaan Heymin omaan Postgres-tietokantaan pgvectorin avulla) |
| **RAG: Custom Embeddings** | [RAG](../nodes/rag-node.md), Vektorivarastot | `embedding_base_url`, `embedding_model`, `embedding_dimensions`, `db_type`, valinnainen `embedding_api_key`, sekä `qdrant_host` kun `db_type` on `qdrant` |
| **Grist** | [Grist-solmu](../nodes/grist-node.md) | `api_key`, `server_url` |
| **Google Sheets** | [Google Sheets -solmu](../nodes/google-sheets-node.md) | `client_id`, `client_secret` + OAuth2 -suostumus |
| **Google Drive** | [Google Drive -solmu](../nodes/google-drive-node.md) | `client_id`, `client_secret` + OAuth2 -suostumus (täysi Drive-käyttöoikeusalue) |
| **BigQuery** | [BigQuery-solmu](../nodes/bigquery-node.md) | `client_id`, `client_secret` + OAuth2 -suostumus |
| **Supabase** | [Supabase-solmu](../nodes/supabase-node.md) | `supabase_url`, `supabase_key`, valinnainen `supabase_schema` |
| **ClickHouse** | [ClickHouse-solmu](../nodes/clickhouse-node.md) | `host`, `port`, `username`, `password`, `database`, `secure` |
| **Notion** | [Notion-solmu](../nodes/notion-node.md) | `api_token`, tai `client_id` + `client_secret` OAuth |
| **Amazon S3** | [Amazon S3 -solmu](../nodes/amazon-s3-node.md) | `aws_access_key_id`, `aws_secret_access_key`, `aws_region` |
| **SMTP** | [Send Email](../nodes/send-email-node.md) | `host`, `port`, `email`, `password` |
| **IMAP** | [IMAP Trigger -solmu](../nodes/imap-trigger-node.md) | `imap_host`, `imap_port`, `imap_username`, `imap_password` |
| **Telegram** | [Telegram Trigger -solmu](../nodes/telegram-trigger-node.md), [Telegram-solmu](../nodes/telegram-node.md) | `bot_token`, valinnainen `secret_token` |
| **Discord** | [Discord-solmu](../nodes/discord-node.md) | `webhook_url` |
| **Discord Trigger** | [Discord Trigger -solmu](../nodes/discord-trigger-node.md) | `public_key` |
| **RabbitMQ** | [RabbitMQ-solmu](../nodes/rabbitmq-node.md) | `rabbitmq_host`, `rabbitmq_username`, `rabbitmq_password` |
| **Redis** | [Redis-solmu](../nodes/redis-node.md) | `host`, `port`, `password` |
| **Slack** | [Slack-solmu](../nodes/slack-node.md) | `webhook_url` |
| **Slack Trigger** | [Slack Trigger -solmu](../nodes/slack-trigger-node.md) | `signing_secret` |
| **Bearer** | [HTTP-solmu](../nodes/http-node.md) | `token` |
| **Header** | [HTTP-solmu](../nodes/http-node.md) | `header_key`, `header_value` |
| **FlareSolverr** | [Crawler-solmu](../nodes/crawler-node.md) | `flaresolverr_url` |

---

## GitHub

GitHub-tunnistetieto tallentaa GitHubin henkilökohtaisen käyttöoikeustunnuksen (PAT), jotta workflowt voivat kutsua GitHubin REST-API:a [GitHub-solmun](../nodes/github-node.md) kautta, välittää tunnuksen MCP-palvelimiin kuten `@modelcontextprotocol/server-github` tai käyttää sitä [HTTP-solmusta](../nodes/http-node.md) tehtäviin mukautettuihin REST-kutsuihin.

### Pakolliset kentät

| Kenttä | Kuvaus |
|-------|-------------|
| `api_key` | GitHubin henkilökohtainen käyttöoikeustunnus (`github_pat_...` hienojakoinen PAT tai perinteinen `ghp_...` PAT) |
### Valinnaiset kentät

| Kenttä | Kuvaus |
|-------|-------------|
| `base_url` | GitHub Enterprise Serverin GitHub API -perusosoite (esimerkiksi `https://github.example.com/api/v3`) |

### Huomioita

- Hienojakoiset henkilökohtaiset käyttöoikeustunnukset (fine-grained personal access tokens) ovat suositeltavia, koska niiden käyttöoikeudet voidaan rajata tiettyihin repositorioihin ja toimenpiteisiin.
- Jätä `base_url` tyhjäksi GitHub.com -käyttöä varten. GitHub Enterprise Server -käytössä käytä täydellistä REST API -päätepistettä, mukaan lukien `/api/v3` (esimerkiksi `https://github.example.com/api/v3`), äläkä palvelimen verkkokäyttöliittymän juuriosoitetta kuten `https://github.example.com`.
- Tämä tunnistetieto tukee tällä hetkellä vain PAT-pohjaista autentikointia. Organisaation repositorioiden käyttöön tarvitaan PAT, jolla on vaaditut organisaatio-/repositorio-oikeudet.
- GitHub-sovelluksen asennustunnukset ja GitHub-sovelluksen asennusprosessit eivät ole tällä hetkellä ensiluokkaisia Heymin käyttöliittymässä.
- Suosittelemme käyttämään [GitHub-solmua](../nodes/github-node.md) natiiveihin repositorio-, käyttäjä-, issue-, pull request-, arvostelu-, julkaisu-, Actions-workflow-, liikenne- ja tiedostotoimenpiteisiin. Käytä [HTTP-solmua](../nodes/http-node.md) vain, kun tarvitset päätepisteitä tai payloadeja, joita GitHub-solmu ei kata.
- Käytä [Agent-solmua](../nodes/agent-node.md) MCP:n kanssa välittämällä `$credentials.YourGitHubCredential` MCP-yhteysympäristömuuttujaan kuten `GITHUB_PERSONAL_ACCESS_TOKEN`.
- GitHubin REST API odottaa yleisesti `Authorization: Bearer <token>` ja `Accept: application/vnd.github+json` -otsikoita.
- GitHub-tunnistetietoja muokatessa GitHub Enterprisen `base_url` -kentän jättäminen tyhjäksi säilyttää nykyisen päätepisteen. Syötä uusi URL vain, kun haluat muuttaa päätepistettä.

### Käyttäjät

- [GitHub-solmu](../nodes/github-node.md)
- [Codex-solmu](../nodes/codex-node.md)
- [Agent-solmu](../nodes/agent-node.md)
- [HTTP-solmu](../nodes/http-node.md)

---

## Päätösmalli

Päätösmalli vastaa tyypitettyihin kysymyksiin tilasta ja palauttaa todennäköisyyksiä tekstin sijaan. TypeSafen Jev on referenssitoteutus; mikä tahansa päätepiste, joka hyväksyy saman `{model, state, questions}` -runko, toimii, ja [Decision-solmu](../nodes/decision-node.md) voi lähettää manuaalisesti kirjoitetun rungon sellaiselle päätepisteelle, joka ei tue tätä.

### Pakolliset kentät

- `base_url` – päätepiste, esimerkiksi `https://api.typesafe.ai`. Heym lisää `/v1/systemone`.

### Valinnaiset kentät

- `api_key` – lähetetään muodossa `Authorization: Bearer`. Päätepisteet, jotka eivät vaadi avainta, voivat jättää tämän tyhjäksi.

### Huomioita

- **Testiyhteys** lähettää yhden pienen kysymyksen vahvistaakseen, että päätepiste ja avain toimivat.
- Tunnistetietoja muokatessa tallennettu avain säilyy, kun avainkenttä jätetään tyhjäksi.
- Lähtevät pyynnöt yksityisiin ja loopback-osoitteisiin estetään oletusarvoisesti, joten itse isännöity päätepiste osoitteessa `localhost` tai yksityisessä IP-alueessa vaatii `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` -asetuksen.
- Nämä mallit puuttuvat Heymin synkronoimista LLM-hintatauluista, joten [Suoritukset](../tabs/traces-tab.md) -välilehden Kustannus-sarake pysyy tyhjänä. Token-määrät tallennetaan kuitenkin edelleen.

### Käyttäjät

- [Decision-solmu](../nodes/decision-node.md)
- [Arvioinnit](../tabs/evals-tab.md) – vertaa `LLM-as-Judge` -vastauksia odotettuun tulokseen

## OpenAI Codex

OpenAI Codex -tunnistetieto autentikoi [Codex-solmun](../nodes/codex-node.md). Se on erillinen OpenAI API -avaintunnistetiedosta, jota käyttävät LLM-, Agent- ja RAG-solmut.

### Autentikointitavat

| Tapa | Kuvaus |
|------|-------------|
| **Kirjaudu sisään ChatGPT-tilillä** (suositus) | OAuth (PKCE) -sisäänkirjautuminen, joka käyttää ChatGPT Plus/Pro -tilauksesi etuja, joten suoritukset välttävät API-kustannuksia tokenia kohden. Heym tallentaa ja päivittää automaattisesti token-paketin. |
| **Käyttöoikeustoken** | ChatGPT/Codex `access_token`, joka välitetään vain paikalliselle Codex CLI -prosessille. |

### Huomioita

- API-avaimet hylätään tämän tunnistetietotyypin kohdalla.
- Codex-tokeneita ei paljasteta `$credentials.Name` -kautta.
- Codex-solmu tarvitsee myös GitHub-tunnistetiedon repositorion kloonaamiseen, haaran työntämiseen ja luonnos-PR:n luomiseen.

### Käyttäjät

- [Codex-solmu](../nodes/codex-node.md)

## OpenCode Go

OpenCode Go -tunnistetieto autentikoi [OpenCode Go -solmun](../nodes/opencode-go-node.md). Se tallentaa OpenCode Go -yhdyskäytävän API-avaimen (osoitteesta [opencode.ai/go](https://opencode.ai/go)) ja valinnaisen yhdyskäytävän perusosoitteen.

### Kentät

| Kenttä | Kuvaus |
|-------|-------------|
| **API-avain** | OpenCode Go -yhdyskäytävän API-avain (pakollinen). |
| **Yhdyskäytävän perusosoite** | Valinnainen; oletusarvo on `https://opencode.ai/zen/go/v1`. Korvaa vain itse isännöidylle tai välityspalvelimelle. |

### Huomioita

- API-avain välitetään vain OpenCode CLI -prosessille kovettetun kontin sisällä.
- OpenCode Go -solmu tarvitsee myös GitHub-tunnistetiedon repositorion kloonaamiseen, haaran työntämiseen ja pull requestin luomiseen. GitHub-tokenia ei koskaan sijoiteta sandbox-konttiin.

### Käyttäjät

- [OpenCode Go -solmu](../nodes/opencode-go-node.md)

---

## Linear

Linear-tunnistetieto tukee joko henkilökohtaista API-avainta tai OAuth2:ta [Linear-solmun](../nodes/linear-node.md) käyttöä varten. Heym lähettää natiiveja GraphQL-kyselyjä Linearille työtilan metatietojen, projektien, issueiden ja kommenttien hakemiseksi.
### Asennus

Valitse yksi todennustapa:

**Henkilökohtainen API-avain**

1. Linearissa avaa **Asetukset → Turvallisuus ja pääsy → Henkilökohtaiset API-avaimet**.
2. Luo avain, jolla on pääsy haluamaasi työtilaan.
3. Liitä avain Linear-tunnistetietoihin Heymissä ja vahvista yhteys **Testaa yhteys** -painikkeella.

**OAuth2**

1. Luo Linear OAuth -sovellus.
2. Rekisteröi `{FRONTEND_URL}/api/credentials/linear/oauth/callback` uudelleenohjausosoitteeksi.
3. Heymin kojelaudassa valitse **Tunnistetiedot** → **Uusi** → kirjoita **Linear**.
4. Valitse **OAuth2**, syötä Asiakastunnus ja Asiakassalaus, napsauta sitten **Yhdistä**.

### Pakolliset kentät

| Tila | Kenttä | Kuvaus |
|------|-------|-------------|
| Henkilökohtainen API-avain | `api_key` | Linearin henkilökohtainen API-avain, yleensä etuliitteellä `lin_api_` |
| OAuth2 | `client_id` | Asiakastunnus Linear OAuth -sovelluksesta |
| OAuth2 | `client_secret` | Asiakassalaus Linear OAuth -sovelluksesta |

OAuth-tunnukset (`access_token`, `refresh_token`, `token_expiry`) tallennetaan ja päivitetään automaattisesti.

### Huomioita

- Henkilökohtaiset API-avaimet ja OAuth-tunnukset toimivat Linear-käyttäjänä, joka ne loi tai valtuutti.
- Linear OAuth käyttää valtuuksia `read,write,issues:create,comments:create`.
- Käytä **Testaa yhteys** -toimintoa tunnistetietojen valintaikkunassa varmistaaksesi API-avaimen tai OAuth-tunnuksen toimivuuden Linear API:a vastaan.
- Käytä Linear-solmun Listaa tiimit ja Listaa projektit -toimintoja löytääksesi UUID:t ennen ongelmien luomista tai suodattamista.
- Käytä Listaa työnkulun tilat ja Listaa tiimin jäsenet -toimintoja löytääksesi tilan ja vastuuhenkilön UUID:t päivityksiä varten.
- Kierrä API-avain muokkaamalla tunnistetietoja ja syöttämällä korvaava arvo. Jos kierrät OAuth-sovelluksen salaisuuksia, yhdistä tunnistetiedot uudelleen **Yhdistä** -painikkeella.

### Käyttäjät

- [Linear-solmu](../nodes/linear-node.md)

---

## Jira

Jira-tunnistetiedot tallentavat Jiran Basic-auth-tunnistetiedot, Jira-sivuston perusosoitteen, käyttöönoton tilan ja valinnaisen REST-API-version [Jira-solmun](../nodes/jira-node.md) käyttöön. Käytä `cloud` Jira Cloudille tai `data_center` Jira Data Center / Serverille.

### Asennus

**Jira Cloud**

1. Atlassian-tilin asetuksissa luo API-tunnus.
2. Heymin kojelaudassa valitse **Tunnistetiedot** → **Uusi** → kirjoita **Jira**.
3. Syötä Atlassian-sähköposti, API-tunnus ja Jira-sivuston URL, kuten `https://your-domain.atlassian.net`.
4. Vahvista tunnistetiedot **Testaa yhteys** -painikkeella.

**Jira Data Center / Server**

1. Valitse **Jira Data Center / Server** käyttöönoton tilaksi.
2. Syötä Jiran käyttäjätunnus ja salasana Basic-authia varten.
3. Syötä Jira-sivuston URL, esimerkiksi `https://jira.example.com`.
4. Vahvista tunnistetiedot **Testaa yhteys** -painikkeella.

### Kentät

| Kenttä | Kuvaus |
| --- | --- |
| `email` | Jira Cloud Atlassian-tilin sähköposti tai Jira Data Center / Server -käyttäjätunnus |
| `api_token` | Jira Cloud Atlassian API-tunnus tai Jira Data Center / Server -salasana Basic-authia varten |
| `base_url` | Jira-sivuston perusosoite |
| `deployment` | `cloud` Jira Cloudille tai `data_center` Jira Data Center / Serverille |
| `api_version` | REST-API-versio; Jira Cloudille oletus on `3`. Data Center / Server käyttää versiota 2 |

### Huomioita

- Jira-solmu lähettää ongelmien kuvaukset ja kommentit Atlassian Document Format -tekstiasiakirjoina Jira Cloud REST API v3:lle. Data Center / Server -tunnistetiedot lähettävät pelkkää tekstiä.
- Data Center / Server tukee tällä hetkellä vain käyttäjätunnus/salasana Basic-authia. Henkilökohtaiset käyttöoikeustunnukset ja Bearer-auth eivät ole vielä tuettuja.
- Liitetiedoston lataus hyväksyy base64- tai data-URL-sisällön ja on alttiina alustan tiedostokoolle (oletus 99 Mt). Liitetiedoston lataus voi palauttaa base64-sisällön, kun se on käytössä.
- Käyttäjien luominen, poistaminen ja ongelmien ilmoittaminen edellyttävät, että todentanut Jira-tili on saanut asianmukaiset Jira-sivuston tai organisaation käyttöoikeudet.
- Käytä Listaa projektit, Hae ongelmia ja Listaa siirtymät -toimintoja löytääksesi projektiavaimet, ongelmiavaimet ja siirtymä-ID:t.
- Mukautettuja päätepisteitä varten, joita Jira-solmu ei kata, käytä [HTTP-solmua](../nodes/http-node.md) Jira Basic Authilla (`email:api_token` Cloudille tai `username:password` Data Center / Serverille) cURL-komennossa tai Header-tunnistetietoa vastaavalla `Authorization: Basic <base64(user:secret)>` -arvolla.

Katso myös:

- [Jira-solmu](../nodes/jira-node.md)
- [Tunnistetiedot](./credentials.md)

---

## Sentry

Sentry-tunnistetiedot tallentavat auth-tunnuksen [Sentry-solmun](../nodes/sentry-node.md) käyttöön. Heym käyttää Sentryn REST-API:a organisaatioiden, projektien, tiimien, ongelmien, tapahtumien ja julkaisujen operaatioihin.

### Pakolliset kentät

| Kenttä | Kuvaus |
|-------|-------------|
| `api_token` | Sentryn auth-tunnus, jolla on pääsy automatisointiin tarkoitetuihin organisaatioihin ja projekteihin |

### Valinnaiset kentät

| Kenttä | Kuvaus |
|-------|-------------|
| `base_url` | Valinnainen juuriosoite itse isännöidylle Sentrylle, esimerkiksi `https://sentry.example.com` |

### Huomioita

- Jätä `base_url` tyhjäksi Sentry SaaS:lle.
- Käytä **Testaa yhteys** -toimintoa varmistaaksesi, että tunnus voi listata näkyvät organisaatiot.
- Mukautettuja REST-kutsuja varten käytä `$credentials.YourSentryCredential` bearer-tunnuksena.

### Käyttäjät

- [Sentry-solmu](../nodes/sentry-node.md)

---

## Qdrant

[Qdrant](https://qdrant.tech) on avoimen lähdekoodin vektoritietokanta, jota käytetään semanttiseen hakuun ja RAG:iin (Retrieval Augmented Generation).

### Pakolliset kentät

| Kenttä | Kuvaus |
|-------|-------------|
| `qdrant_host` | Täysi URL Qdrant-instanssiisi (esim. `http://localhost:6333` tai pilvipalvelun päätepiste) |
| `openai_api_key` | OpenAI API-avain, jota käytetään upotusten luomiseen asiakirjojen indeksoinnissa ja haussa |
### Huomiot

- Qdrant-kokoelmia hallitaan [Vektorivarastot](../tabs/vectorstores-tab.md) -välilehdellä. Jokainen vektorivarasto vastaa yhtä Qdrant-kokoelmaa.
- [RAG-solmu](../nodes/rag-node.md) käyttää vektorivarastoa (joka viittaa Qdrant-tunnistetietoihin) — se ei viittaa tunnistetietoihin suoraan.
- Jos Qdrant-instanssisi vaatii API-avaimen, sisällytä se `qdrant_host`-arvoon tai määritä Qdrant vastaavasti; nykyinen integraatio ei sisällä erillistä Qdrant API -avainkenttää.
- Itse isännöity Qdrant: käytä [virallista Docker-kuvaa](https://hub.docker.com/r/qdrant/qdrant) ja avaa portti `6333`.

### Käyttäjät

- [RAG-solmu](../nodes/rag-node.md) (vektorivaraston kautta)
- [Vektorivarastot-välilehti](../tabs/vectorstores-tab.md)

## Mukautetut upotukset (RAG)

Oletusarvoisesti RAG-upotukset tulevat OpenAIta. **RAG: Custom Embeddings** -tunnistetieto
osoittaa mihin tahansa OpenAI-yhteensopivaan upotuspäätepisteeseen — Ollama, vLLM, Text
Embeddings Inference, LM Studio, Together tai isännöity yhdyskäytävä — ja nimeää vektorivaraston,
johon se kirjoittaa.

### Pakolliset kentät

| Kenttä | Kuvaus |
|-------|-------------|
| `embedding_base_url` | Päätepisteen URL, mukaan lukien `/v1`-polku, esim. `http://localhost:11434/v1` |
| `embedding_api_key` | Valinnainen. Paikalliset palvelimet eivät yleensä tarvitse avainta |
| `embedding_model` | Mallin nimi, kuten päätepiste odottaa sen, esim. `nomic-embed-text` |
| `embedding_dimensions` | Vektorin leveys, jonka malli palauttaa (oletus `1536`) |
| `embedding_request_dimensions` | Valinnainen. Pyydä päätepistettä palauttamaan `embedding_dimensions` mallin oman leveyden sijaan |
| `db_type` | `qdrant` tai `pgvector` |
| `qdrant_host`, `qdrant_port`, `qdrant_api_key` | Qdrant-yhteys, vaaditaan kun `db_type` on `qdrant` |

### Huomiot

- **Qdrant hyväksyy minkä tahansa mittausten määrän.** Jokainen kokoelu luodaan tässä
  tunnistetiedoissa ilmoitettua leveyttä varten, joten Dimensions-kenttä on vapaasti muokattavissa.
- **Postgres (pgvector) vaatii tarkalleen 1536 mittaa.** Sen sarake on kiinteä
  `vector(1536)`, joten Dimensions-kenttä on lukittu arvoon 1536 ja tunnistetieto, joka ilmoittaa
  minkä tahansa muun leveyden, hylätään tallennusvaiheessa.
- **Lyhentäminen pgvectorille.** Kun varasto on Postgres, valintaikkuna tarjoaa *Pyydä päätepistettä palauttamaan 1536 mittaa*. Tämä lähettää `dimensions` -pyyntöparametrin,
  jota Matryoshka-representaatioilla koulutetut mallit (OpenAI `text-embedding-3-*`,
  `nomic-embed-text-v1.5`, `jina-v3` ja vastaavat) kunnioittavat palauttamalla lyhennetyn,
  silti merkityksellisen vektorin. Päätepisteet, jotka eivät tue parametria, hylkäävät
  pyynnön, ja päätepisteet, jotka hyväksyvät mutta jättävät huomiotta parametrin, tuottavat
  selkeän virheen, joka nimeää todellisuudessa palautetun leveyden. Heym ei koskaan lyhennä
  vektoreita itse, koska ei-Matryoshka-mallin tulosten leikkaaminen heikentää hakuominaisuuksia
  hiljaisesti. Vaihtoehtoa ei tarjota Qdrantille, joka voi koota kokoelmia mihin tahansa leveyteen.
- Käytä **Testaa yhteys** -toimintoa tunnistetietojen valintaikkunassa upottaaksesi testimerkkijonon
  ja nähdäksesi mallin todellisuudessa palauttaman leveyden ennen varaston luomista.
- `dimensions` -pyyntöparametri lähetetään vain OpenAI:lle itselleen, koska useimmat
  OpenAI-yhteensopivat palvelimet hylkäävät tuntemattomat parametrit. Mallin oma leveys
  vahvistetaan tunnistetietojen sijaan.
- Olemassa olevat **RAG: Qdrant + OpenAI** ja **RAG: Psql + OpenAI** -tunnistetiedot pysyvät
  ennallaan ja toimivat edelleen.

### Käyttäjät

- [RAG-solmu](../nodes/rag-node.md) (vektorivaraston kautta)
- [Vektorivarastot-välilehti](../tabs/vectorstores-tab.md)

## Postgres (pgvector)

Heym voi myös tallentaa vektoreita **omaan Postgres-tietokantaansa** käyttämällä
[pgvector](https://github.com/pgvector/pgvector) -laajennusta — ulkoista vektoripalvelua
ei tarvita. Luo **RAG: Psql + OpenAI** -tunnistetiedot ja käytä niitä vektorivarastoa luodessa,
valitse sitten **Postgres (pgvector)** RAG-solmun Tietokanta-pudotusvalikosta.

### Pakolliset kentät

| Kenttä | Kuvaus |
|-------|-------------|
| `openai_api_key` | OpenAI API -avain, jota käytetään upotuksien luomiseen asiakirjoja indeksoidessa ja haettaessa |

### Huomiot

- Isäntä/porttia ei tarvita — vektorit kirjoitetaan Heymin omaan tietokantaan; Heym ei koskaan yhdistä eri tietokantaan.
- Jokainen Qdrantin kanssa saatavilla oleva RAG-ominaisuus (lisäys, haku, metatietosuodattimet, Cohere-uudelleenluokittelu, kloonaus, jakaminen) toimii samalla tavalla Postgres-taustajärjestelmällä.
- Vaati `vector`-laajennuksen. Heym pitää virallisen `postgres:16` -kuvan muuttumattomana (jotta olemassa olevaa dataa ei koskaan käsitellä) ja **asentaa automaattisesti `postgresql-16-pgvector` -paketin käynnistyksessä** — `run.sh`, `deploy.sh` ja `run_e2e.sh` kaikki käsittelevät tämän. Asennus ei ole vakava: jos se ei voi suorittaa (esim. ei verkkoa), Qdrant RAG jatkaa toimintaansa ja Postgres-taustajärjestelmä pysyy passiivisena (migraatio ohittaa taulun sulavasti).
- Jos käytät julkaistua yksittäistä konttikuvaa (`ghcr.io/heymrun/heym`) **oman ulkoisen Postgresin** kanssa, tämän tietokannan on tuettava `vector`-laajennusta (Heym ei voi asentaa sitä tietokantaan, jota se ei hallitse). Ilman sitä Postgres-vektorivaraston luominen tai siihen lataaminen palauttaa selkeän viestin ja Qdrant RAG jatkaa toimintaansa.

### Käyttäjät

- [RAG-solmu](../nodes/rag-node.md) (vektorivaraston kautta)
- [Vektorivarastot-välilehti](../tabs/vectorstores-tab.md)

---

## Grist

[Grist](https://www.getgrist.com) on taulukkolaskenta/tietokanta-hybridi, joka tukee rakenteista dataa ja kaavoja. Grist-tunnistetiedot antavat Heymille mahdollisuuden lukea ja kirjoittaa Grist-asiakirjoja.
### Pakolliset kentät

| Kenttä | Kuvaus |
|-------|-------------|
| `api_key` | Grist API -avain (löytyy Grist-instanssistasi kohdasta **Profiili → API-avain**) |
| `server_url` | Grist-palvelimen perusosoite (esim. `https://docs.getgrist.com` Grist Cloudille tai omalla isännöimällesi palvelimelle) |

### Huomioita

- [Grist-solmu](../nodes/grist-node.md) vaatii määrittelyssään **Dokumenttitunnuksen** (Grist-dokumentin URL-osoitteesta) ja **Taulukkotunnuksen** — nämä eivät kuulu tunnistetietoihin.
- Omalla isännöimällesi Grist-instanssille aseta `server_url` instanssisi verkkotunnukseksi.
- Gristin saraketunnukset käyttävät alaviivoja (esim. `User_Name`), eivät näyttönimiä. Käytä `listColumns` -toimintoa niiden löytämiseksi.

### Käyttäjät

- [Grist-solmu](../nodes/grist-node.md)

---

## Google Sheets (OAuth2)

Google Sheets -tunnistetieto yhdistää Heymin Google Sheets APIin käyttäen OAuth2 "Bring Your Own App" -mallia. Toimit Google Cloud OAuth2 Client ID:n ja Client Secretin, jonka jälkeen käyttöoikeudet vahvistetaan selainikkunan kautta. Tokenit päivitetään automaattisesti taustalla.

### Asennus

1. Avaa [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → etsi ja ota käyttöön **Google Sheets API**.
2. Siirry kohtaan **Credentials** → **Create Credentials** → **OAuth client ID** → sovellustyyppi **Web application**.
3. Lisää **Authorized redirect URIs** -kohtaan: `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`
4. Kopioi luotu **Client ID** ja **Client Secret**.
5. Heym Dashboardissa → **Tunnistetiedot** → **Uusi** → tyyppi **Google Sheets (OAuth2)**.
6. Syötä Client ID, Client Secret ja nimi, napsauta sitten **Connect** avataksesi Google-vahvistusikkunan ja myöntääksesi käyttöoikeudet.

### Pakolliset kentät

| Kenttä | Kuvaus |
|-------|-------------|
| `client_id` | OAuth2 Client ID Google Cloud Consolesta |
| `client_secret` | OAuth2 Client Secret Google Cloud Consolesta |

Tokenit (`access_token`, `refresh_token`, `token_expiry`) tallennetaan ja päivitetään automaattisesti — niitä ei tarvitse hallita manuaalisesti.

### Huomioita

- OAuth2-vahvistusikkuna vaatii taulukoiden käyttöalueen (`https://www.googleapis.com/auth/spreadsheets`).
- Heym käyttää virkistystokenia uusien käyttöoikeustokenien hankkimiseen ennen niiden vanhenemista (60 sekunnin turvamarginaali).
- Jos vaihdat Client Secretin Google Cloud Consolessa, yhdistä tunnistetiedot uudelleen **Connect** -painikkeen kautta.
- **Tuotantokäyttö:** Aseta taustajärjestelmän **`FRONTEND_URL`** täsmälleen julkiseen URL-osoitteeseen, jonka käyttäjät avaavat selaimessa (esim. `https://heym.example.com`). Heym rakentaa Google OAuth -uudelleenohjausosoitteen tästä arvosta — se ei luota `Origin`- tai `X-Forwarded-*` -otsakkeisiin (asiakaspuolen hallinnoituja). Rekisteröi `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` Google Cloud Consolessa.

### Käyttäjät

- [Google Sheets -solmu](../nodes/google-sheets-node.md)

---

## Google Drive (OAuth2)

Google Drive -tunnistetieto yhdistää Heymin Google Drive APIin käyttäen samaa OAuth2 "Bring Your Own App" -mallia kuin Google Sheets. Toimit Google Cloud OAuth2 Client ID:n ja Client Secretin, jonka jälkeen käyttöoikeudet vahvistetaan selainikkunan kautta. Tokenit päivitetään automaattisesti taustalla.

### Asennus

1. Avaa [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → etsi ja ota käyttöön **Google Drive API**.
2. Siirry kohtaan **Credentials** → **Create Credentials** → **OAuth client ID** → sovellustyyppi **Web application**.
3. Lisää **Authorized redirect URIs** -kohtaan: `https://your-heym-domain/api/credentials/google-drive/oauth/callback`
4. Kopioi luotu **Client ID** ja **Client Secret**.
5. Heym Dashboardissa → **Tunnistetiedot** → **Uusi** → tyyppi **Google Drive (OAuth2)**.
6. Syötä Client ID, Client Secret ja nimi, napsauta sitten **Connect** avataksesi Google-vahvistusikkunan ja myöntääksesi käyttöoikeudet.

### Pakolliset kentät

| Kenttä | Kuvaus |
|-------|-------------|
| `client_id` | OAuth2 Client ID Google Cloud Consolesta |
| `client_secret` | OAuth2 Client Secret Google Cloud Consolesta |

Tokenit (`access_token`, `refresh_token`, `token_expiry`) tallennetaan ja päivitetään automaattisesti — niitä ei tarvitse hallita manuaalisesti.

### Käyttöalue

Google Drive vaatii **täyden Drive-käyttöalueen** (`https://www.googleapis.com/auth/drive`).

Tämä on tarpeen, koska solmu toimii tiedostoilla, jotka omistat jo. Kapeampi `drive.file` -käyttöalue myöntää pääsyn vain OAuth-asiakkaan itse luomiin tiedostoihin, mikä estäisi `listFolderFiles`, `updateFile`, `removeFile` ja `removeFolder` -toiminnot näkemästä olemassa olevia Drive-tiedostoja.

Koska toimitat oman Google Cloud -projektisi Client ID:n ja Secretin, Googlen sovelluksen vahvistusvaatimukset tälle käyttöalueelle koskevat projektiasi, eivät Heymiä.

### Huomioita

- Heym käyttää virkistystokenia uusien käyttöoikeustokenien hankkimiseen ennen niiden vanhenemista (60 sekunnin turvamarginaali).
- Jos vaihdat Client Secretin Google Cloud Consolessa, yhdistä tunnistetiedot uudelleen **Connect** -painikkeen kautta.
- Jaetut asemat ovat tuettuja — solmu asettaa `supportsAllDrives` -asetuksen jokaiselle API-kutsulle.
- **Tuotantokäyttö:** Aseta taustajärjestelmän **`FRONTEND_URL`** täsmälleen julkiseen URL-osoitteeseen, jonka käyttäjät avaavat selaimessa. Heym rakentaa Google OAuth -uudelleenohjausosoitteen tästä arvosta — se ei luota `Origin`- tai `X-Forwarded-*` -otsakkeisiin. Rekisteröi `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` Google Cloud Consolessa.
- Katso [Tunnistetietojen jakaminen](./credentials-sharing.md) ennen tämän tunnistetiedon jakamista tiimin kanssa.

### Käyttäjät

- [Google Drive -solmu](../nodes/google-drive-node.md)
## BigQuery (OAuth2)

BigQuery-tunnistetiedot yhdistävät Heymin Google BigQuery -rajapintaan käyttäen OAuth2 "Bring Your Own App" -mallia. Te toimitat Google Cloud -palvelusta OAuth2 Client ID:n ja Client Secretin, jonka jälkeen käyttöoikeudet vahvistetaan selainikkunan kautta. Tokenit päivitetään automaattisesti taustalla.

### Asennus

1. Avaa [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → etsi ja ota käyttöön **BigQuery API**.
2. Siirry **Credentials** → **Create Credentials** → **OAuth client ID** → valitse sovellustyypiksi **Web application**.
3. Lisää **Authorized redirect URIs** -kohtaan: `https://your-heym-domain/api/credentials/bigquery/oauth/callback`
4. Kopioi luotu **Client ID** ja **Client Secret**.
5. Heym Dashboardissa → **Tunnistetiedot** → **Uusi** → valitse tyypiksi **BigQuery (OAuth2)**.
6. Syötä Client ID, Client Secret ja nimi, napsauta **Connect** avataksesi Google-vahvistusikkunan ja myöntääksesi käyttöoikeudet.

### Pakolliset kentät

| Kenttä | Kuvaus |
|-------|-------------|
| `client_id` | Google Cloud Consolesta saatava OAuth2 Client ID |
| `client_secret` | Google Cloud Consolesta saatava OAuth2 Client Secret |

Tokenit (`access_token`, `refresh_token`, `token_expiry`) tallennetaan ja päivitetään automaattisesti.

### Huomiot

- OAuth2-vahvistusikkuna vaatii BigQuery-alueen (`https://www.googleapis.com/auth/bigquery`).
- **Tuotantokäyttö:** Aseta backendissä **`FRONTEND_URL`** julkiseksi URL-osoitteeksi. Rekisteröi `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback` Google Cloud Consolessa.

### Käyttökohteet

- [BigQuery-solmu](../nodes/bigquery-node.md)

---

## Supabase

Supabase-tunnistetiedot yhdistävät Heymin Supabase-projektin PostgREST-rajapintaan, jotta workflowt voivat hakea ja muokata Postgres-pohjaisia taulukoita.

### Pakolliset kentät

| Kenttä | Kuvaus |
|-------|-------------|
| `supabase_url` | Projektin perus-URL, esim. `https://your-project.supabase.co` |
| `supabase_key` | API-avain, jolla on pääsy kohdetaulukoihin |
| `supabase_schema` | Valinnainen oletusskeema (oletusarvo `public`) |

### Huomiot

- [Supabase-solmu](../nodes/supabase-node.md) kommunikoi osoitteeseen `/rest/v1/<table>` ja tukee operaattorisuodattimia (`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `is`, `in` sekä PostgREST-operaattoreita) sekä sisäkkäisiä `or` / `and` -loogisia ryhmiä.
- Kirjoitusoperaatioissa suositaan avainta, joka on tarkoitettu luotettavalle palvelinpuolen käytölle ja jolla on vain tarvittavat taulukko-oikeudet.
- Solmut voivat ohittaa skeeman per vaihe, vaikka tunnistetiedoissa olisi määritetty oletusskeema.

### Käyttökohteet

- [Supabase-solmu](../nodes/supabase-node.md)

## ClickHouse

ClickHouse-tunnistetiedot yhdistävät Heymin ulkoiseen ClickHouse-tietokantaan sen HTTP-rajapinnan kautta, jotta workflowt voivat suorittaa SQL-, CRUD- ja laskentaoperaatioita OLAP-taulukoihin.

### Pakolliset kentät

| Kenttä | Kuvaus |
|-------|-------------|
| `host` | HTTP-isäntä ilman alustaa, esim. `your-instance.clickhouse.cloud` |
| `port` | HTTP-rajapinnan portti (`8443` HTTPS:lle, `8123` HTTP:lle) |
| `username` | ClickHouse-käyttäjä (oletus `default`) |
| `password` | Käyttäjän salasana (valinnainen) |
| `database` | Kohdetietokanta (oletus `default`) |
| `secure` | Käytä HTTPS:ää, kun `true` (pakollinen ClickHouse Cloudille) |

### Huomiot

- [ClickHouse-solmu](../nodes/clickhouse-node.md) käyttää virallista `clickhouse-connect` HTTP-asiakasta ja parametroi suodattimet ja arvot.
- `update` ja `remove` vastaavat `ALTER TABLE ... UPDATE` ja `DELETE FROM` -komentoja, jotka ovat asynkronisia ClickHouse-muutoksia; molemmat vaativat suodattimen.
- `upsert` suorittaa `INSERT`-operaation ja olettaa `ReplacingMergeTree`-taulun avainten yhdistämistä varten.
- Käytä **Test connection** -toimintoa tunnistetietojen valintaikkunassa saavutettavuuden varmistamiseksi.

### Käyttökohteet

- [ClickHouse-solmu](../nodes/clickhouse-node.md)

## Notion

Notion-tunnistetiedot tukevat joko sisäistä integraatiotokenia tai julkisen integraation OAuth-yhteyttä. OAuth mahdollistaa jokaisen käyttäjän Notion-työtilan valtuuttamisen Heymissä manuaalisen tokenin kopioimisen sijaan.

### Pakolliset kentät

| Tila | Kenttä | Kuvaus |
|------|-------|-------------|
| Sisäinen token | `api_token` | Sisäinen integraatiotoken (`ntn_...`) |
| OAuth | `client_id` | Notionin julkisesta integraatiosta saatava Client ID |
| OAuth | `client_secret` | Notionin julkisesta integraatiosta saatava Client Secret |

OAuth-kutsun käsittely tallentaa automaattisesti `access_token`, `auth_mode`, `workspace_id`, `workspace_name` ja `bot_id`. Kaikki aiemmat sisäiset `api_token`-arvot poistetaan OAuth-prosessin päätyttyä. Rekisteröi tämä uudelleenohjausosoite Notionissa:
`{FRONTEND_URL}/api/credentials/notion/oauth/callback`.

### OAuth-asennusprosessi

1. Valitse tunnistetietojen valintaikkunassa **OAuth**, syötä nimi, Client ID ja Client Secret.
2. Napsauta **Connect** ja valtuuta työtila Notionin ponnahdusikkunassa.
   - **Uuden** tunnistetiedon luonnissa Heym luo tunnistetietueen, kun napsautat **Connect**.
   - Viimeistele valtuutus ponnahdusikkunassa ja napsauta **Save** palataksesi tunnistetietolistaan.
3. Yhdistetty tunnistetieto näkyy listassa muodossa `connected (Workspace Name)`. Kesken olevat OAuth-tunnistetiedot näkyvät `Not connected` -tilassa, kunnes valtuutus on valmis.

Käytä **Test Connection** -toimintoa tunnistetietojen valintaikkunassa sisäisen tokenin tai valmiin OAuth-valtuutuksen vahvistamiseksi. Muokkaustilassa token-kentän jättäminen tyhjäksi säilyttää tallennetun sisäisen tokenin.

Sekä sisäiset tokenit että OAuth-access-tokenit ovat saatavilla `$credentials.CredentialName` -muodossa mukautettuja [HTTP](../nodes/http-node.md) -kutsuja varten, jotka vaativat Notionin bearer-tokenia.
### Huomautukset

- Sisäiset integraatiot edellyttävät, että asiaan liittyvät sivut, tietokannat ja tietolähteet on jaettu.
- OAuth-käyttäjät valitsevat työtilan/sivut Notionin valtuutuksen yhteydessä.
- OAuth-sovelluksen tunnistetiedot salataan Notion-tunnistetietojen sisälle. Takaisinkutsussa ne ladataan uudelleen palvelinpuolella; salaisuus ei ole upotettu OAuth-tilaan.
- Yhdistetyt OAuth-tunnistetiedot näyttävät työtilan nimen; odottavat OAuth-tunnistetiedot näyttävät `Not connected`, kunnes valtuutus on valmis.
- **Tuotantokäyttö:** Aseta taustajärjestelmän **`FRONTEND_URL`** julkiseksi selainosoitteeksi (alustaja + isäntä, ilman loppuviivaa). Notionin uudelleenohjausosoitteen on vastattava tarkalleen:
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback`.
- Solmu käyttää API-versiota `2026-03-11` ja nykyistä `data_source`-terminologiaa. Katso
  [Notion-solmu](../nodes/notion-node.md#api-version-notes) -artikkeli ohjeista vanhempien `archived`, `after` tai tietokantahakuesimerkkien migrointiin.
- Vanhat hakusuodattimet, joissa objektin arvo on `database`, normalisoidaan muotoon `data_source`.

### Käyttökohteet

- [Notion-solmu](../nodes/notion-node.md)

---

## SMTP (Sähköposti)

SMTP-tunnistetieto tallentaa sähköpostipalvelimen yhteystiedot lähtevän postin lähettämistä varten.

### Pakolliset kentät

| Kenttä | Kuvaus |
|-------|-------------|
| `host` | SMTP-palvelimen isäntänimi (esim. `smtp.gmail.com`) |
| `port` | SMTP-portti (tyypillisesti `587` STARTTLS:lle, `465` SSL:lle) |
| `email` | Lähettäjän sähköpostiosoite |
| `password` | SMTP-salasana tai sovellussalasana |

### Yleisimmät SMTP-palveluntarjoajat

| Palveluntarjoaja | Isäntä | Portti | Huomautukset |
|----------|------|------|-------|
| Gmail | `smtp.gmail.com` | `587` | Edellyttää [sovellussalasanaa](https://support.google.com/accounts/answer/185833) (kaksivaiheinen tunnistus on oltava käytössä) |
| Outlook / Office 365 | `smtp.office365.com` | `587` | Käytä Microsoft-tilin tunnistetietoja |
| Mailgun | `smtp.mailgun.org` | `587` | Käytä Mailgunin SMTP-tunnistetietoja verkkotunnuksen asetuksista |
| SendGrid | `smtp.sendgrid.net` | `587` | Käytä käyttäjänimenä `apikey` ja API-avainta salasanana |
| Mukautettu / Omatoiminen isännöinti | verkkotunnuksesi | `587` / `465` | Postfix, Exim jne. |

### Huomautukset

- Gmail edellyttää **sovellussalasanaa** tavallisen salasanan sijaan, kun kaksivaiheinen tunnistus on käytössä.
- Portti `587` käyttää STARTTLS:ää (alkaa selvätekstinä, päivittyy TLS:ään). Portti `465` käyttää implisiittistä TLS:ää (SSL alusta alkaen).

### Käyttökohteet

- [Lähetä sähköposti -solmu](../nodes/send-email-node.md)

---

## IMAP (Saapuva sähköposti)

IMAP-tunnistetieto tallentaa yhteystiedot postilaatikon seurantaa varten [IMAP Trigger -solmulla](../nodes/imap-trigger-node.md).

### Pakolliset kentät

| Kenttä | Kuvaus |
|-------|-------------|
| `imap_host` | IMAP-palvelimen isäntänimi (esim. `imap.gmail.com`) |
| `imap_port` | IMAP-portti (`993` SSL/TLS:lle useimmissa palveluntarjoajissa) |
| `imap_username` | Postilaatikon käyttäjätunnus tai täydellinen sähköpostiosoite |
| `imap_password` | Salasana tai palveluntarjoajakohtainen sovellussalasana |

### Valinnaiset kentät

| Kenttä | Kuvaus |
|-------|-------------|
| `imap_mailbox` | Seurattava postilaatikon kansio (oletus: `INBOX`) |
| `imap_use_ssl` | Ota SSL/TLS käyttöön (suositeltava; oletus: `true`) |

### Huomautukset

- IMAP-trigger perustaa nykyisen postilaatikon ensimmäisellä kyselyllä ja käsittelee sen jälkeen vain uudemmat sähköpostit.
- Gmail, Microsoft 365 ja muut isännöidyt palveluntarjoajat edellyttävät usein **sovellussalasanaa** tai vastaavaa IMAP-kohtaista salaisuutta.
- Liitetiedostojen sisältöä ei ladata workflowen; Heym paljastaa vain liitteiden metatiedot.

### Käyttökohteet

- [IMAP Trigger -solmu](../nodes/imap-trigger-node.md)
- [Triggerit](./triggers.md) (IMAP workflow-triggerinä)

---

## RabbitMQ

[RabbitMQ](https://www.rabbitmq.com) on avoimen lähdekoodin viestinvälityspalvelin. RabbitMQ-tunnistetieto tallentaa yhteystiedot jonojen ja vaihtimien julkaisemiseen ja kuluttamiseen.

### Pakolliset kentät

| Kenttä | Kuvaus |
|-------|-------------|
| `rabbitmq_host` | AMQP-yhteysosoite (esim. `amqp://localhost:5672`) |
| `rabbitmq_username` | RabbitMQ-käyttäjätunnus (oletus: `guest`) |
| `rabbitmq_password` | RabbitMQ-salasana (oletus: `guest`) |

### Virtuaaliset isännät

Yhdistääksesi tiettyyn virtuaaliseen isäntään, sisällytä se `rabbitmq_host`-osoitteeseen:

```
amqp://käyttäjätunnus:salasana@isäntänimi:5672/virtuaalinen_isäntä
```

Jos käytät oletusvirtuaalista isäntää, polku `/` voidaan jättää pois.

### Viiveelliset viestit -laajennus

[RabbitMQ-solmu](../nodes/rabbitmq-node.md) tukee **rabbitmq_delayed_message_exchange** -laajennusta. Kun tämä laajennus on käytössä RabbitMQ-palvelimellasi, voit asettaa viiveen (millisekunteina) lähteviin viesteihin käyttämällä solmun `rabbitmqDelayMs` -kenttää.

Solmu asettaa `x-delay` -otsikon julkaistuun viestiin. Vaihtimen tyypin on oltava `x-delayed-message`, jotta viiveet tulevat voimaan.

Ota laajennus käyttöön omatoimisesti isännöidyssä RabbitMQ-instanssissa:

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

Kun laajennusta ei ole asennettuna, `x-delay` -otsikkoa ei huomioida ja viestit toimitetaan välittömästi.

### Käyttökohteet

- [RabbitMQ-solmu](../nodes/rabbitmq-node.md)
- [Triggerit](./triggers.md) (RabbitMQ workflow-triggerinä)

---

## Amazon S3

Amazon S3 -tunnistetieto yhdistää Heymin [Amazon S3](https://aws.amazon.com/s3/) -palveluun. Käytä sitä [Amazon S3 -solmun](../nodes/amazon-s3-node.md) kanssa hallitaksesi ämpäreitä ja kansioita, lähettääksesi ja lataaksesi objekteja, kopioidaksesi avaimia sekä listataksesi tai poistaaksesi objekteja workflowista.
### Pakolliset kentät

| Kenttä | Kuvaus |
|-------|-------------|
| `aws_access_key_id` | AWS IAM -käyttöavaimen ID |
| `aws_secret_access_key` | Käyttöavaimen ID:hen liittyvä salainen käyttöavain |
| `aws_region` | AWS-alue, jossa ämpärit sijaitsevat (esim. `us-east-1`) |

### Valinnaiset kentät

| Kenttä | Kuvaus |
|-------|-------------|
| `aws_session_token` | Väliaikainen istunnon token AWS STS -tunnistetiedoilla käytettäessä |

### Huomiot

- Tunnistetiedot käyttävät standardia AWS SigV4 -todennusta boto3-kirjaston kautta.
- Lähetystoiminnot lähettävät tällä hetkellä UTF-8 -tekstisisältöä; lataukset voivat palauttaa tekstin tai base64-koodatun binäärisisällön.

### Käyttäjät

- [Amazon S3 -solmu](../nodes/amazon-s3-node.md)

---

## Redis

[Redis](https://redis.io) on muistissa toimiva avain-arvo -tietokanta, jota käytetään välimuistina ja nopeaan dataan pääsyyn.

### Pakolliset kentät

| Kenttä | Kuvaus |
|-------|-------------|
| `host` | Redis-palvelimen isäntänimi tai IP-osoite (esim. `localhost`) |
| `port` | Redis-portti (oletus: `6379`) |
| `password` | Redis-salasana (jätä tyhjäksi, jos ei ole asetettu) |

### Käyttäjät

- [Redis-solmu](../nodes/redis-node.md)

---

## Slack

Slack-tunnistetiedot tallentavat **Incoming Webhook URL** -osoitteen viestien lähettämiseen Slack-kanaville.

### Pakolliset kentät

| Kenttä | Kuvaus |
|-------|-------------|
| `webhook_url` | Slack Incoming Webhook -URL (Slack-sovelluksen asetuksista) |

### Huomiot

- Luo Incoming Webhook osoitteessa [api.slack.com/apps](https://api.slack.com/apps) → sovelluksesi → **Incoming Webhooks**.
- Jokainen webhook on sidottu tiettyyn kanavaan. Luo useita tunnistetietoja eri kanavia varten.

### Käyttäjät

- [Slack-solmu](../nodes/slack-node.md)

---

## Telegram

Telegram-tunnistetiedot tallentavat **Bot Token** -merkin ja valinnaisen **Webhook Secret Token** -merkin bottipohjaisia workflowja varten.

### Pakolliset kentät

| Kenttä | Kuvaus |
|-------|-------------|
| `bot_token` | Telegram Bot API -token BotFatherista |

### Valinnaiset kentät

| Kenttä | Kuvaus |
|-------|-------------|
| `secret_token` | Jaettu salaisuus, jota verrataan `x-telegram-bot-api-secret-token` -otsakkeeseen saapuvissa webhookeissa |

### Huomiot

- Käytä samaa tunnistetietoa sekä [Telegram Trigger](../nodes/telegram-trigger-node.md) että [Telegram](../nodes/telegram-node.md) -solmuissa.
- Rekisteröi webhook manuaalisesti Telegramin `setWebhook` API:lla käyttäen Telegram Trigger -solmun paneelissa näkyvää URL-osoitetta.
- `chatId` Telegram-solmussa voi olla kirjaimellinen ID tai lauseke kuten `$telegramEvent.message.chat.id`.

### Käyttäjät

- [Telegram Trigger -solmu](../nodes/telegram-trigger-node.md)
- [Telegram-solmu](../nodes/telegram-node.md)

---

## HTTP-todennus (Bearer & Header)

Näitä tunnistetietoja käytetään [HTTP-solmun](../nodes/http-node.md) lähtevien pyyntöjen todentamiseen.

### Bearer

Liittää `Authorization: Bearer <token>` -otsakkeen HTTP-pyyntöihin.

| Kenttä | Kuvaus |
|-------|-------------|
| `token` | Bearer-tokenin arvo |

### Header

Liittää mukautetun otsakkeen HTTP-pyyntöihin.

| Kenttä | Kuvaus |
|-------|-------------|
| `header_key` | Otsakkeen nimi (esim. `X-Api-Key`) |
| `header_value` | Otsakkeen arvo |

Molempia tyyppejä voidaan viitata myös `$credentials.CredentialName` -syntaksilla [Expression DSL](./expression-dsl.md) -kielessä dynaamiseen käyttöön missä tahansa solmussa, joka hyväksyy lausekkeita.

### Käyttäjät

- [HTTP-solmu](../nodes/http-node.md)

---

## LLM-palveluntarjoajat (OpenAI, Google, Custom, Cohere)

Nämä tunnistetiedot toimittavat tekoälysolmuille tehoa.

| Tyyppi | Kuvaus |
|------|-------------|
| **OpenAI** | API-avain GPT-malleille ja OpenAI-embeddingeille |
| **Google** | API-avain Gemini-malleille |
| **Custom** | API-avain + perus-URL OpenAI-yhteensopiville päätepisteille (Ollama, vLLM, LM Studio jne.) |
| **Cohere** | API-avain Cohere-embeddingeille |

### OpenAI-promptien välimuistitus

OpenAI välimuistaa automaattisesti järjestelmäpromptin staattisen (muuttumattoman) etuliitteen – ei tarvita erillistä konfigurointia. Toistuvat workflowt, jotka jakavat saman järjestelmäpromptin etuliitteen, hyötyvät välimuistatusta token-hinnasta, mikä vähentää sekä kustannuksia että viivettä. Tämä on erityisen hyödyllistä, kun käytössä on pitkät, kiinteät ohjeet ja vain käyttäjäviesti vaihtuu suoritusten välillä. Seuraa välimuistin osumisastetta ja token-säästöjä [Suoritukset-välilehdessä](../tabs/traces-tab.md) tai OpenAIn käyttökoontinäytöllä optimoidaksesi promptirakenteen maksimaalista välimuistin uudelleenkäyttöä varten.

### Käyttäjät

- [LLM-solmu](../nodes/llm-node.md)
- [Agentti-solmu](../nodes/agent-node.md)
- [RAG-solmu](../nodes/rag-node.md) (OpenAI-embeddingit Qdrant-tunnistetietojen kautta)

---

## FlareSolverr

[FlareSolverr](https://github.com/FlareSolverr/FlareSolverr) on välityspalvelin Cloudflarea ja vastaavia bottisuojauksia ohittaen.

### Pakolliset kentät

| Kenttä | Kuvaus |
|-------|-------------|
| `flaresolverr_url` | FlareSolverr-instanssisi URL (esim. `http://localhost:8191`) |

Loopback- ja yksityiset osoitteet ovat tuettuja, joten FlareSolverrin suorittaminen Heymin vieressä toimii kuten dokumentoitu. URL-osoitteen ei tarvitse johtaa link-local- tai cloud-metadata-osoitteeseen. Koska yksityiset osoitteet ovat sallittuja, tämä kenttä voidaan myös osoittaa toiseen sisäiseen palveluun, ja vastaus tulee solmun tulosteeseen. Kirjautunut käyttäjä voi luoda tämän tunnistetiedon, joten rajana on workflowjen tekijöiden oikeudet sekä verkkosäännöt, ei tunnistetietojen jakaminen. Katso [Egress Safety](../nodes/crawler-node.md#egress-safety).

### Käyttäjät

- [Crawler-solmu](../nodes/crawler-node.md)
## Aiheeseen liittyvät

- [Tunnistetiedot](./credentials.md) – Yleiskatsaus tunnistetiedoista ja niiden käytöstä solmuissa
- [Tunnistetiedot-välilehti](../tabs/credentials-tab.md) – Tunnistetietojen lisääminen ja hallinta
- [Tunnistetietojen jakaminen](./credentials-sharing.md) – Tunnistetietojen jakaminen käyttäjien ja tiimien kanssa
- [Turvallisuus](./security.md) – Tietojen salaus levossa, käyttöoikeuksien hallinta
- [Expression DSL](./expression-dsl.md) – `$credentials`-syntaksi dynaamista käyttöä varten

---

## Model Router (Auto Model)

Reitittää jokaisen pyynnön jollekin käytettävissä olevista mallitunnistetiedoista käyttämällä päätösmallia valintaan. Se tallentaa viitteitä, ei koskaan omaa avainta.

### Pakolliset kentät

- `decision_credential_id` – **Decision Model** -tunnistetieto, johon sinulla on pääsy.
- `decision_model` – reitityspäätöksen tekevä malli, esimerkiksi `jev-latest`.
- `options` – vähintään kaksi vaihtoehtoa, joista jokaisella on nimi, yksi OpenAI/Google/Custom -tunnistetiedoistasi, malli siinä ja ehdot, joiden perusteella se valitaan.

### Valinnaiset kentät

- `routing_instructions` – ohjeet vaihtoehtojen painottamiseen kokonaisuudessaan.
- Yksi vaihtoehto voidaan merkitä varavaihtoehdoksi, jota käytetään, jos reititys epäonnistuu.

### Huomiot

Vaihtoehtojen nimet ovat se, mitä päätösmalli valitsee, joten niiden on oltava erillisiä. Vaihtoehto ei voi viitata toiseen Model Routeriin.
