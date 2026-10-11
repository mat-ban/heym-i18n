# Tunnistetiedot -välilehti

**Tunnistetiedot** -välilehdellä hallitaan solmujen käyttämiä API-avaimia ja salaisuuksia. Lisää tunnistetiedot tähän ja viittaa niihin nimellä workflow-solmuissa. Yleiskatsauksen tunnistetiedoista ja niiden käytöstä solmuissa löydät kohdasta [Tunnistetiedot](../reference/credentials.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Katso Tunnistetiedot-esittely</a></p>

## Tunnistetietotyypit

| Tyyppi | Käyttötarkoitus |
|------|----------|
| **OpenAI** | OpenAI API -avain LLM-, Agent- ja RAG-solmuille |
| **Google** | Google AI (Gemini) API -avain |
| **GitHub** | GitHubin henkilökohtainen käyttöoikeustunnus (PAT) GitHub API:lle, GitHub-solmujen workfloweille, MCP-palvelimille ja agenttien workfloweille; valinnainen GitHub Enterprise `base_url` |
| **Linear** | Linearin henkilökohtainen API-avain tai OAuth2 tiimeille, projekteille, asioille ja kommenteille |
| **Notion** | Sisäinen integraatiotunnus tai julkisen integraation OAuth-käyttöoikeus työtilaan |
| **Custom** | Mukautetut LLM-endpointit |
| **Bearer** | Bearer-token HTTP-autentikointiin |
| **Header** | Mukautettu otsikkopari avain-arvo HTTP-pyyntöihin |
| **Telegram** | Telegram-botin tunnus ja valinnainen webhook-salaisuus |
| **Slack** | Slackin saapuvan webhookin URL |
| **Discord** | Discordin saapuvan webhookin URL |
| **Discord Trigger** | Discord-sovelluksen julkinen avain |
| **IMAP** | Saapuvan postilaatikon trigger-tunnistetiedot |
| **SMTP** | Sähköpostin lähetyksen tunnistetiedot |
| **Redis** | Redis-yhteys |
| **RAG: Qdrant + OpenAI** | Vektorivarasto RAG-solmuille, jota ylläpitää ulkoinen Qdrant-palvelin |
| **RAG: Psql + OpenAI** | Vektorivarasto RAG-solmuille, jota ylläpitää Heymin oma Postgres-tietokanta (pgvector) – ei ulkoista palvelua |
| **RAG: Custom Embeddings** | Vektorivarasto RAG-solmuille, jotka käyttävät mitä tahansa OpenAI-yhteensopivaa upotuspistettä, Qdrantin tai Postgresin (pgvector) varastona |
| **Cohere** | Cohere API upotuksille |

## Tunnistetietojen lisääminen

1. Valitse **Lisää tunnistetiedot**
2. Valitse tunnistetietotyyppi
3. Syötä vaaditut arvot (API-avain, URL jne.)
4. Anna sille nimi, jolla siihen voidaan viitata solmuissa

GitHubin nykyinen tunnistetietojen hallinta perustuu PAT-tunnuksiin. Suosittelemme hienojakoisia PAT-tunnuksia. GitHub-sovellusten asennusprosessit eivät ole tällä hetkellä käyttöliittymässä ensiluokkaista toiminnallisuutta. Jos käytät GitHub Enterprise Serveriä, voit asettaa valinnaisen GitHub API -perus-URLin, kuten `https://github.example.com/api/v3`.

Linearissa valitse **Henkilökohtainen API-avain** tai **OAuth2** -valintaikkunassa. Henkilökohtaiset API-avaimet luodaan Linearin **Asetukset → Turvallisuus ja käyttöoikeudet → Henkilökohtaiset API-avaimet** -kohdassa. OAuth2 käyttää Linearin OAuth-sovelluksen Asiakastunnusta ja Asiakassalaisuutta, ja `{FRONTEND_URL}/api/credentials/linear/oauth/callback` on rekisteröity uudelleenohjaus-URLina. Tunnistetiedot toimivat Linear-käyttäjän oikeuksin, joka ne on luonut tai hyväksynyt. Käytä **Testaa yhteys** -toimintoa tunnistetietojen valintaikkunassa varmistaaksesi API-avain tai OAuth-token ennen tallennusta.

**Notion** -kohdassa valitse **Sisäinen tunnus** tai **OAuth** -valintaikkunassa. OAuth käyttää Notionin julkisen integraation Asiakastunnusta ja Asiakassalaisuutta; Heym tallentaa ne salattuna tunnistetietoihin. Käytä **Testaa yhteys** -toimintoa varmistaaksesi Supabase-, Linear- tai Notion-tunnistetiedot ennen workflown tallentamista. Katso [Kolmannen osapuolen integraatiot](../reference/integrations.md#notion) Notionin asennustietoja varten.

OAuth-tunnistetiedot avaavat palveluntarjoajan valtuutussivun ponnahdusikkunassa. Jos selain estää sen, käytä **Avaa valtuutussivu** -linkkiä Yhdistä-painikkeen alla; valintaikkuna huomaa, kun yhteys on valmis. Kun uusi tunnistetiedot on yhdistetty, painike näyttää **Yhdistetty**.

## Muokkaaminen ja poistaminen

- **Muokkaa** – Päivitä tunnistetietojen arvoja (herkät arvot on peitetty)
- **Poista** – Poista tunnistetiedot; niitä käyttävät workflowt tarvitsevat korvaavan tunnistetiedon

Kun muokkaat **GitHub** -tunnistetietoja GitHub Enterprise Serverissä, jättämällä valinnaisen **GitHub API Base URL** -kentän tyhjäksi säilytetään nykyinen Enterprise-endpoint. Syötä uusi URL vain, jos haluat muuttaa kyseistä endpointia.

## Jakaminen

- [Jaa tunnistetiedot](../reference/credentials-sharing.md) muille käyttäjille sähköpostitse tai [Tiimien](../reference/teams.md) kanssa
- Jaetut tunnistetiedot näkyvät ilmaisinmerkillä
- Peruuta jakaminen tunnistetietokortin valikosta
## Tunnistetietojen käyttö solmuissa

Viittaa tunnistetietoihin nimellä solmujen asetuksissa. Esimerkkejä:
- [LLM-solmu](../nodes/llm-node.md) – Valitse mallin API:lle tarkoitettu tunnistetieto
- [HTTP-solmu](../nodes/http-node.md) – Käytä Bearer- tai Header-tunnistetietoja autentikointiin
- [Agent-solmu](../nodes/agent-node.md) – Lähetä GitHub-tokenit MCP-palvelimen ympäristömuuttujiin kuten `GITHUB_PERSONAL_ACCESS_TOKEN`
- [GitHub-solmu](../nodes/github-node.md) – Suorita GitHub-repositorioiden, käyttäjien, issueiden, arvostelujen, julkaisujen, workflowien, liikenteen ja tiedostojen alkuperäisiä operaatioita
- [Linear-solmu](../nodes/linear-node.md) – Lue workspacen metatietoja ja automoi Linear-issueita ja kommentteja
- [Notion-solmu](../nodes/notion-node.md) – Hallinnoi Notion-tietokantoja, tietolähteitä, sivuja ja lohkoja
- [RAG-solmu](../nodes/rag-node.md) – Käytä Qdrant- tai Postgres (pgvector) -tunnistetietoa vektorivarastoa varten
- [Telegram Trigger -solmu](../nodes/telegram-trigger-node.md) – Vastaanota Telegram-botin webhookeja
- [Telegram-solmu](../nodes/telegram-node.md) – Lähetä Telegram-botin viestejä
- [Discord Trigger -solmu](../nodes/discord-trigger-node.md) – Vastaanota Discord-interaktioiden webhookeja
- [Discord-solmu](../nodes/discord-node.md) – Lähetä Discord-webhook-viestejä
- [IMAP Trigger -solmu](../nodes/imap-trigger-node.md) – Tarkista jaetusta postilaatikosta uudet sähköpostit

Katso [Expression DSL](../reference/expression-dsl.md) saadaksesi tietoa tunnistetietoihin viittaamisesta lausekkeissa.

## Aiheeseen liittyvät

- [Kolmannen osapuolen integraatiot](../reference/integrations.md) – Yksityiskohtainen asennusopas kullekin tunnistetietotyypille (Telegram, Discord, Qdrant, Grist, IMAP, SMTP, RabbitMQ, Redis, Slack ja muut)
- [Tunnistetietojen jakaminen](../reference/credentials-sharing.md) – Jaa tunnistetietoja muiden käyttäjien kanssa
- [Turvallisuus](../reference/security.md) – Salaus levossa, istuntonhallinta, rajoitukset
- [Solmutyypit](../reference/node-types.md) – Tunnistetietoja käyttävät solmut ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [GitHub](../nodes/github-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md))
- [Vektorivarastot-välilehti](./vectorstores-tab.md) – Käyttää Qdrant- tai Postgres (pgvector) -tunnistetietoja
- [Keskustelu-välilehti](./chat-tab.md) – Käyttää OpenAI/Google-tunnistetietoja
- [Kontekstuaalinen esittely](../reference/contextual-showcase.md) – Tiivis sivun opas dashboardin käyttöliittymälle
