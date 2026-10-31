# Tunnistetiedot

Tunnistetiedot tallentavat API-avaimia ja salaisuuksia, joita workflow-solmut käyttävät. Ne lisätään [Tunnistetiedot-välilehdelle](../tabs/credentials-tab.md) ja viitataan niihin nimellä solmujen asetuksissa.

## Tunnistetietojen ominaisuudet

- **Tallennetaan käyttäjäkohtaisesti** – Jokainen tunnistetieto kuuluu käyttäjälle ja voidaan [jakaa](./credentials-sharing.md) muiden käyttäjien tai [tiimien](./teams.md) kanssa.
- **Salattu tallennus** – Arkaluontoiset arvot salataan; käyttöliittymä peittää ne luonnin jälkeen.
- **Viitataan nimellä** – Solmut valitsevat tunnistetiedon nimen (tai ID:n) perusteella. Suoritusmoottori selvittää workflown omistajan tunnistetiedon ajonaikaisesti.

## Solmien käyttötarkoitukset

| Solmun tyyppi | Tyypillinen tunnistetieto | Käyttötarkoitus |
|-----------|--------------------|---------|
| [LLM](../nodes/llm-node.md), [Agentti](../nodes/agent-node.md), [Arvioinnit](../tabs/evals-tab.md) | OpenAI, Google, Mukautettu | Mallin API-avain |
| [Päätös](../nodes/decision-node.md), [Arvioinnit](../tabs/evals-tab.md) tuomari | Päätösmalli | Päätösmallin endpointin perusosoite ja valinnainen API-avain |
| [LLM](../nodes/llm-node.md), [Agentti](../nodes/agent-node.md), Keskustelu, AI-oletukset, [Arvioinnit](../tabs/evals-tab.md) prompt-sarjat | Mallireititin (Auto Model) | Valitsee, mikä malleistasi käsittelee kunkin pyynnön, käyttäen päätösmallia |
| [Codex](../nodes/codex-node.md) | OpenAI Codex + GitHub | ChatGPT-tilauksen kirjautuminen (OAuth) tai Codex-käyttöoikeustunnus suorittimelle sekä GitHub PAT -tunnus repository-toimintoja varten |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go + GitHub | OpenCode Go -yhdyskäytävän API-avain (valinnainen perusosoite) suorittimelle sekä GitHub PAT -tunnus repository-toimintoja varten |
| [Agentti](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md) | GitHub | GitHubin henkilökohtainen käyttöoikeustunnus (PAT) GitHub API -kutsuille, GitHub-solmun toiminnoille ja MCP-integraatioille |
| [Jira](../nodes/jira-node.md) | Jira | Pilvipuhelin/sähköposti/API-tunnus, Data Center -käyttäjätunnus/salasana tai henkilökohtainen pääsytoken, Jira-sivuston perusosoite, käyttöönoton tila ja valinnainen REST API -versio |
| [Linear](../nodes/linear-node.md) | Linear | Henkilökohtainen API-avain tai OAuth2 tiimeille, projekteille, asioille ja kommenteille |
| [HTTP](../nodes/http-node.md) | Bearer, Otsake | Pyyntöjen todennus |
| [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram | Bottitunnus ja valinnainen webhook-salaisuus |
| [Discord](../nodes/discord-node.md) | Discord | Saapuvan webhookin URL-osoite |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord Trigger (Julkinen avain) | Sovelluksen julkinen avain allekirjoituksen vahvistamiseen |
| [RAG](../nodes/rag-node.md) | RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, RAG: Mukautetut upotukset | Vektorivaraston yhteys (ulkoinen Qdrant tai Heymin oma Postgres pgvectorin kautta), OpenAI:n tai minkä tahansa OpenAI-yhteensopivan upotusendpointin kanssa |
| [Slack](../nodes/slack-node.md) | Slack | Webhook tai API-tunnus |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP | Saapuvan postin yhteys |
| [Sähköpostin lähetys](../nodes/send-email-node.md) | SMTP | Postipalvelin |
| [Redis](../nodes/redis-node.md) | Redis | Yhteys |
| [Grist](../nodes/grist-node.md) | Grist | API-avain + palvelimen URL-osoite |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets (OAuth2) | Asiakas-ID + Asiakassalaisuus + OAuth2-suostumus |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive (OAuth2) | Asiakas-ID + Asiakassalaisuus + OAuth2-suostumus |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery (OAuth2) | Asiakas-ID + Asiakassalaisuus + OAuth2-suostumus |
| [Supabase](../nodes/supabase-node.md) | Supabase | Projektin URL-osoite + API-avain (+ valinnainen oletusskeema) |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse | Isäntä + portti + käyttäjätunnus/salasana + tietokanta (+ suojattu) |
| [Notion](../nodes/notion-node.md) | Notion | Sisäinen integraatiotunnus tai julkisen integraation Asiakas-ID + Asiakassalaisuus + OAuth-suostumus |
| [Sentry](../nodes/sentry-node.md) | Sentry | Todennustunnus ja valinnainen itse isännöity perusosoite |
| [Amazon S3](../nodes/amazon-s3-node.md) | Amazon S3 | Käyttöavain, salainen avain, alue |
| [RabbitMQ](../nodes/rabbitmq-node.md) | RabbitMQ | AMQP URL-osoite |

Yksityiskohtaiset asennusohjeet (isännät, portit, palveluntarjoajakohtaiset kentät) löytyvät kohdasta [Kolmannen osapuolen integraatiot](./integrations.md). Tämä sisältää Telegram-botin asennuksen, saapuvan sähköpostin IMAPin kautta ja lähtevän sähköpostin SMTP:n kautta.

GitHub-tunnistetiedot voivat sisältää myös valinnaisen `base_url` -kentän, kun kohde on GitHub Enterprise Server eikä GitHub.com. Kun kierrätät GitHub-tunnistetiedon tunnusta muokatessasi, tyhjäksi jättäminen säilyttää olemassa olevan Enterprise-endpointin. Syötä uusi URL-osoite vain, kun haluat muuttaa kyseistä endpointia.

Jira, Linear, Supabase, Notion, Sentry ja ClickHouse -tunnistetiedoissa on **Testaa yhteys** -toiminto tunnistetietojen valintaikkunassa. Jirassa testi kutsuu Jiran nykyisen käyttäjän endpointia. Linearissa testi kutsuu Linear APIa `getViewer` -komennolla ja vahvistaa, että API-avain tai OAuth-tunnus on voimassa. Muokatessasi voit testata ilman API-avaimen uudelleen syöttämistä, jos tallennettu salaisuus on edelleen läsnä. Notionissa valitse **Sisäinen tunnus** tai **OAuth** valintaikkunassa; OAuth käyttää Asiakas-ID:tä ja Asiakassalaisuutta Notionin julkisesta integraatiosta. Katso [Kolmannen osapuolen integraatiot](./integrations.md#notion) Notionin asennustietoja varten.
## Coding-paketin käyttö

**AI Defaults** -välilehdellä [Settings](./user-settings.md) näkyy jäljellä oleva coding-paketin käyttö Codex-tunnistetiedoillesi (omistetut ja jaetut). Jokaiselle Codex-tunnistetiedolle näytetään vaakapalkki aktiivisen kiintiöikkunan osalta — tyypillisesti **5 tunnin** ja/tai **viikoittainen** ikkuna, riippuen tilauksestasi — jossa näkyy jäljellä olevan kiintiön prosenttiosuus ja nollauslaskuri. Data tulee Codex-taustajärjestelmän rate-limit-vastausotsikoista, jotka haetaan tarpeen mukaan.

OpenCode Go -tunnistetiedot näkyvät myös siellä, mutta merkittynä **"käyttö ei saatavilla"**: OpenCode zen -yhdyskäytävä ei paljasta jäljellä olevan kiintiön tietoja, joten palkkia ei voida näyttää.

## Lausekkeissa

Jotkut solmut sallivat tunnistetietojen käytön lausekkeissa. Käytä [Expression DSL](./expression-dsl.md) -syntaksia `$credentials.CredentialName` viitataksesi tunnistetiedon ratkaistuun salaisuuteen lausekkeen sisällä. Katso [HTTP › Authenticating with Credentials](../nodes/http-node.md#authenticating-with-credentials) kohdasta, minkä otsikkorivin kukin tunnistetietotyyppi tarvitsee HTTP-pyynnössä.

Codex-tunnistetiedot on tarkoituksella jätetty pois `$credentials`-viittauksista. Olipa kirjauduttu sisään ChatGPT-tilauksella (ei API-kustannuksia per token) tai liitetty Codex `access_token`, tokenit välitetään vain paikalliselle Codex-suorittimelle. ChatGPT-kirjautumistokenit päivitetään automaattisesti vanhetessaan.

Jira-tunnistetiedot ovat myös pois `$credentials`-viittauksista. [Jira-solmu](../nodes/jira-node.md) lataa tunnistetiedon `credentialId`:n perusteella suoritushetkellä. Jira-solmun kattamien REST-kutsujen ulkopuolisissa tapauksissa käytä [HTTP-solmua](../nodes/http-node.md) Jira Basic Auth -tunnistetiedoilla (`email:api_token` Jira Cloudille tai `username:password` Data Center / Serverille), esimerkiksi `curl -u you@example.com:YOUR_API_TOKEN https://your-domain.atlassian.net/rest/api/3/myself`. Voit myös käyttää [Header](../nodes/http-node.md) -tunnistetietoa `Authorization: Basic <base64(user:secret)>` -muodossa. Jira Data Center / Server -henkilökohtaisia pääsytokeneita varten lähetä sen sijaan `Authorization: Bearer <token>`; Jira-tunnistetieto tukee tätä suoraan **Personal Access Token** -tunnistautumistilassaan.

| Tunnistetietotyyppi | Arvo, joka näkyy `$credentials.Name` -viittauksessa |
|-----------------|--------------------------------------|
| Bearer | Bearer-token merkkijono |
| Header | Valmis `header key: header value` -rivi, joka voidaan suoraan liittää cURL `-H` -argumenttiin |
| GitHub | Henkilökohtainen pääsytoken |
| Notion | Sisäinen `api_token` tai OAuth `access_token` (Bearer-token Notion API-kutsuille) |
| Sentry | Sentry-tunnistustoken |
| Discord / Slack | Webhook-URL |

Esimerkki:

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Käytä Notion-**solmua** alkuperäisiin tietokanta-, sivu- ja lohko-operaatioihin. Käytä `$credentials`-viittausta, kun mukautettu [HTTP](../nodes/http-node.md) -pyyntö tarvitsee saman Notion Bearer-tokenin.

## Tunnistetietojen luominen Chatista

[AI Assistant](./ai-assistant.md#credentials), [Chat-välilehti](../tabs/chat-tab.md) ja [Chat with Heym](./chat-with-heym.md) voivat luoda tunnistetiedon, kun workflow tarvitsee sellaisen, tai milloin tahansa pyydettäessä. Avustaja ehdottaa tyyppiä ja nimeä, ja säännöllinen tunnistetietolomake avautuu keskusteluun. Pyydä päivittämään omistamasi tunnistetieto, ja sama lomake avautuu siihen, salaisuudet peitettynä. Avustaja näkee vain nimen ja tyypin. `heym_chat` [MCP](../tabs/mcp-tab.md):n kautta ei voi luoda, päivittää tai valita tunnistetietoja.

## Aiheeseen liittyvät

- [Credentials-välilehti](../tabs/credentials-tab.md) – Lisää, muokkaa, poista tunnistetietoja
- [GitHub-solmu](../nodes/github-node.md) – Alkuperäiset GitHub REST-operaatiot
- [Jira-solmu](../nodes/jira-node.md) – Jira-projektin, issuen, kommentin, liitteen, käyttäjän, ilmoituksen ja siirtymän automatisointi
- [Linear-solmu](../nodes/linear-node.md) – Linear GraphQL -työtilan ja issuen automatisointi
- [Notion-solmu](../nodes/notion-node.md) – Hae ja hallinnoi Notion-sisältöä
- [Sentry-solmu](../nodes/sentry-node.md) – Sentry-organisaation, projektin, tiimin, issuen, tapahtuman ja julkaisun automatisointi
- [Tunnistetietojen jakaminen](./credentials-sharing.md) – Jaa käyttäjien ja tiimien kanssa
- [Kolmannen osapuolen integraatiot](./integrations.md) – Asennusopas tunnistetietotyypin mukaan
- [Expression DSL](./expression-dsl.md) – `$credentials` lausekkeissa

## Mallireititin (Auto Model)

Mallireititin ei sisällä avainta. Se sisältää **päätösmallin tunnistetiedon**, listan **mallivaihtoehdoista** — joista jokainen on olemassa oleva OpenAI-, Google- tai Custom-tunnistetieto plus malli — ja jokaiselle vaihtoehdolle vapaatekstin, joka kertoo milloin kyseistä vaihtoehtoa tulisi käyttää.

Se näkyy jokaisessa valitsimessa, joka tarjoaa mallin: [LLM](../nodes/llm-node.md) ja [Agent](../nodes/agent-node.md) -solmut, Chat, AI Defaults, Dashboards, lausekkeenmuodostaja ja Data Tables. Sen ainoa malli on **Auto**. Valitse se, ja päätösmalli lukee jokaisen pyynnön ja reitittää sen. [Evals](../tabs/evals-tab.md) jättää sen pois, koska eval vertaa tiettyjä malleja ja reititin valitsee omansa.

Agentti uudelleenreitittää työkalusilmukansa edetessä, joten halpa malli voi hoitaa alkuvaiheet ja vahvempi malli sen vaiheen, joka sitä tarvitsee. Identtiset syötteet käyttävät edellistä päätöstä uudelleen, joten silmukka maksaa päätöksestä vain, kun keskustelu on todella siirtynyt.

### Mitä se ei voi tehdä

Auto Model ei voi yhdistää **Responses API**, **Batch mode** tai **image output** -toimintoihin. Nämä valinnat poistavat itsensä käytöstä, kun reititin on valittu, ja kertovat syyn. Guardrail-tarkistukset ja ihmisen tarkastuksen politiikkaluokittelija ovat kiinteitä yksittäismallikutsuja eivätkä koskaan reititä.
### Reitityksen epäonnistuessa

Merkitse vaihtoehto **Käytä tätä vaihtoehtoa, kun reititys epäonnistuu**, jolloin päätösmallin katkos ei koskaan
keskeytä suoritusta; varaoptiota käytetään ja syy tallennetaan suoritukseen. Ilman tätä
solmu epäonnistuu sen sijaan, että arvailisi.

### Pyynnön kohteen seuraaminen

Suoritukset näyttävät `Auto Model / GPT-5` eikä pelkästään mallia, ja kustannukset pysyvät liitettyinä
itse käytettyyn malliin. Canvasin Suoritusloki ja Span-näkymä näyttävät saman parin,
ja Span-näkymä listaa, mikä vuoro meni mihin.
