# Heym - Kaikki ominaisuudet

Kattava yleiskatsaus Heymin ominaisuuksiin. Jokaisessa osiossa kuvataan ominaisuus tai käsite muutamalla lauseella.

---

## Aloitusopas

### [Johdanto](../getting-started/introduction.md)

Heym on infrastruktuuri tekoälyagenttien tuotantokäyttöön ja hallintaan. Rakennat agenttipohjaisia järjestelmiä visuaalisella canvasilla ja suoritat niitä luotettavasti: orchestroit agentteja, automatisoi liiketoimintaprosesseja, tarkastelet jokaista suoritusta ja pidät ihmiset hallinnassa omalla infrastruktuurillasi. Se tukee visuaalisia workflowja, tekoälyllä toimivia solmuja ([LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Qdrant RAG](../nodes/rag-node.md)), [AI Assistant](./ai-assistant.md) -avustajaa, integraatioita ([HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Notion](../nodes/notion-node.md), [WebSocket Send](../nodes/websocket-send-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), saapuvia [IMAP Trigger](../nodes/imap-trigger-node.md) -sähköposteja, lähteviä [Send Email](../nodes/send-email-node.md) -viestejä), aikataulutusta [Cron](../nodes/cron-node.md) -solmulla ja [Portal](./portal.md) -keskusteluportaaleja loppukäyttäjille.

Katso myös [Keskeiset käsitteet](../getting-started/core-concepts.md), [Solmutyypit](./node-types.md) ja [Kolmannen osapuolen integraatiot](./integrations.md).

### [Miksi Heym](../getting-started/why-heym.md)

Miksi Heym -sivu käy läpi agentin elinkaaren (rakentaminen, orchestrointi, suoritus, havainnointi, arviointi, hallinta, altistaminen) ja näyttää, mitä yksi itse isännöity suoritusympäristö käsittelee kussakin vaiheessa. Tämä kattaa [LLM](../nodes/llm-node.md) -solmun ja [Agent Node](../nodes/agent-node.md) -solmun työkalujen kutsujen, Python-työkalujen, [MCP](../tabs/mcp-tab.md) -yhteyksien, taitojen ja moniagenttiorchestroinnin; triggerit, uudelleenyritykset ja [kuormituksen jakamisen](./cluster.md); [Traces](../tabs/traces-tab.md) -suoritusjäljet USD-kustannuksineen ja OpenTelemetry-viennin; [Evals](../tabs/evals-tab.md) -arvioinnit; [human review checkpoints](./human-in-the-loop.md) -ihmisen tarkistuspisteet, rajoitukset, SSO:n ja tarkistuslokin; sekä REST-, MCP- ja Portal -päätepisteet. Sivu päättyy ominaisuusvertailuun n8n:n, Zapierin ja Make.com:n kanssa.

Katso myös [Agent Node](../nodes/agent-node.md), [LLM](../nodes/llm-node.md), [Qdrant RAG](../nodes/rag-node.md) ja [Agent Architecture](./agent-architecture.md).

### [Pika-aloitus](../getting-started/quick-start.md)

Saa ensimmäinen workflowsi käyntiin minuuteissa: luo workflow [Workflows](../tabs/workflows-tab.md) -välilehdeltä, lisää [Input](../nodes/input-node.md) -syötesolmu, [LLM](../nodes/llm-node.md) -solmu ja [Output](../nodes/output-node.md) -tulostussolmu, ja yhdistä ne. Määritä [LLM](../nodes/llm-node.md) -solmu tunnistetiedoilla ja aseta `userMessage` arvoon `$input.text`; käytä Run-toimintoa tai [AI Assistant](./ai-assistant.md) -avustajaa suorittaaksesi tai luodaksesi workflowja luonnollisella kielellä.

Sopii luonnollisesti [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Output](../nodes/output-node.md) ja [Expression DSL](./expression-dsl.md) -kanssa.

### [Keskeiset käsitteet](../getting-started/core-concepts.md)

Workflowt ovat suunnattuja solmujen verkkoja, jotka on yhdistetty reunoilla; suoritus kulkee trigger-solmuista ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) prosessointisolmujen kautta [Output](../nodes/output-node.md) -tulostussolmuihin. Jokaisella solmulla on tyyppi, data (konfiguraatio) ja syötteet/tulosteet; reunat määrittelevät tiedonkulun. Solmut viittaavat ylävirran dataan [Expression DSL](./expression-dsl.md) -lausekkeiden kuten `$nodeLabel.field` kautta; riippumattomat solmut suoritetaan [rinnakkain](./parallel-execution.md) automaattisesti.

Katso myös [Triggers](./triggers.md), [Parallel Execution](./parallel-execution.md) ja [Workflow Structure](./workflow-structure.md).

### [Suoritus ja käyttöönotto](../getting-started/running-and-deployment.md)

Heym tarjoaa `run.sh` -skriptin paikallista kehitystä varten (tietokanta Dockerissa, FastAPI-backend, Vite-frontend) ja `deploy.sh` -skriptin tuotantokäyttöön Docker Composen kanssa. Molemmat käyttävät `.env` -tiedostoa; keskeisiä muuttujia ovat `SECRET_KEY`, `ENCRYPTION_KEY`, `DATABASE_URL` ja `ALLOW_REGISTER`. Kehitysympäristö käyttää määriteltäviä frontend- ja backend-portteja; tuotanto tarjoaa API:n polun `/api` kautta frontend-kontin kautta.

Katso myös [Security](./security.md), [Enterprise](./enterprise.md) ja [Settings](./user-settings.md).

### [Siirtyminen Heymiin](../getting-started/migrate-to-heym.md)

AI Convert -työkalu muuntaa workflown toiselta alustalta (n8n, Flowise, Dify, Langflow, sim.ai, Activepieces) tai pelkän englanninkielisen kuvauksen Heym-workflowksi, joka virtaa suoraan canvasille ja on valmis [lataamaan ja tuomaan](./download-import.md). Se suorittaa tekoälyturvatarkistuksen ja luo DSL:n syöte- ja nopeusrajoituksin. Avaa se osoitteessa [heym.run/convert](https://heym.run/convert).

Katso myös [Quick Start](../getting-started/quick-start.md), [Download & Import](./download-import.md) ja [AI Assistant](./ai-assistant.md).

---

## Solmut

### Triggerit
#### [Syötesolmu](../nodes/input-node.md)

Syötesolmu on workflowien alkupiste, joka vastaanottaa käyttäjän tai API-kutsujan lähettämää dataa. Se tukee yhtä tai useampia syötekenttiä ja tarjoaa pääsyn pyynnön metatietoihin (otsikot, hakuparametrit). Käyttöliittymän kenttiin pääsee käsiksi `$nodeLabel.body.fieldKey` -syntaksilla, otsikoihin `$nodeLabel.headers` ja hakuparametreihin `$nodeLabel.query`.

Luonnollisia parivaljakkoja ovat [Ehtosolmu](../nodes/condition-node.md), [LLM-solmu](../nodes/llm-node.md) ja [Tulostussolmu](../nodes/output-node.md). Payload-viitteistä ja kenttäkäytöstä lisätietoja kohdista [Expression DSL](./expression-dsl.md) ja [Webhooks](./webhooks.md).

#### [Cron-solmu](../nodes/cron-node.md)

Cron-solmu käynnistää workflowin aikataulun mukaisesti käyttäen standardia viisikenttäistä cron-lauseketta. Käyttäjän syötettä ei tarvita - workflow suoritetaan automaattisesti määritetyin väliajoin (esim. tunnin välein, päivittäin, 15 minuutin välein). Tulosteena on käynnistystapahtuma ilman payloadia.

Katso myös [Triggers](./triggers.md), [Odota-solmu](../nodes/wait-node.md) ja [Suoritushistoria](./execution-history.md) aikataulutettuja ja viivästettyjä suorituksia varten.

#### [IMAP-käynnistin](../nodes/imap-trigger-node.md)

IMAP-käynnistin tarkistaa postilaatikkoa määritettävissä minuutivälein ja käynnistää workflowin jokaisesta uudesta sähköpostista. Se palauttaa jäsennellyt otsikot, lähettäjän ja vastaanottajien listat, pelkistetyn tekstin ja HTML-sisällön, liitteiden metatiedot sekä käynnistysajan. Käytä sitä esimerkiksi tukipalvelun sähköpostien lajitteluun, postilaatikon reititykseen [Slackiin](../nodes/slack-node.md) tai sähköpostipohjaisiin hyväksyntäworkfloweihin [Human-in-the-Loop](./human-in-the-loop.md) -mallin mukaisesti.

Parhaiten toimii yhdessä [Sähköpostin lähetys -solmun](../nodes/send-email-node.md), [LLM-solmun](../nodes/llm-node.md) ja [Slack-solmun](../nodes/slack-node.md) kanssa saapuvien viestien käsittelyyn ja vastausworkfloweihin.

#### [Heym-käynnistin](../nodes/heym-trigger-node.md)

Heym-käynnistin käynnistää workflowin, kun Heym-järjestelmä julkaisee alustatason tapahtuman: `heym.started`, `workflow.created`, `workflow.updated` tai `workflow.deleted`. Toimitukset käsitellään erissä - kaikki viiden sekunnin ikkunassa julkaistut tapahtumat saapuvat yhdessä suorituksessa muodossa `$nodeLabel.events`, joka on aina taulukko. Jokainen tapahtuma varmistetaan tietokantarajoitteella, joten se käynnistyy täsmälleen kerran tilauskohtaisesti riippumatta työntekijöiden, konttien tai koneiden määrästä. Käytä sitä workflow-muutosten tarkkailuun, käyttöönottoilmoituksiin ja järjestelmän tilaraporteihin.

Parhaiten toimii yhdessä [Heym-solmun](../nodes/heym-node.md) kanssa workflow-tietojen hakemiseen sekä [Loop-solmun](../nodes/loop-node.md) kanssa yksittäisten tapahtumien käsittelyyn.

#### [Heym-solmu](../nodes/heym-node.md)

Heym-solmu lukee Heym-järjestelmän omia tietoja kolmen toiminnon kautta: `listWorkflows` palauttaa kaikki workflowt, joihin omistajalla on pääsy solmujen määrineen ja aikaleimoineen, `getWorkflow` palauttaa yhden workflown solmu- ja reunarakenteen, ja `getExecutionHistory` palauttaa suoritushistorian merkinnät uusimmasta vanhimpaan valinnaisilla tilan, aikavälin ja rajoituksen suodattimilla, mukaan lukien tilakohtaiset yhteistulokset. Tulokset rajoittuvat workflown omistajan käyttöoikeuksiin, joten cronin, portaalikäyttöliittymän tai tapahtuman käynnistämä suoritus palauttaa samat tiedot kuin manuaalinen käynnistys. `getWorkflow` palauttaa koko solmukonfiguraation, mikä mahdollistaa workflowjen tarkistuksen kovakoodatuille avaimille tai tokeneille; se ei paljasta mitään, mitä workflown omistaja ei voisi jo nähdä editorissa. Kirjautumistietoja ei vaadita.

#### [WebSocket-käynnistin](../nodes/websocket-trigger-node.md)

WebSocket-käynnistin avaa ulkoiseen WebSocket-palvelimeen lähtevän asiakasyhteyden ja käynnistää workflowin `onMessage`-, `onConnected`- tai `onClosed`-tapahtumien yhteydessä. Se tarjoaa jäsennellyt viestipayloadit, uudelleenyhdistystilan, sulkemismetatiedot ja socket-URL:n alaspäin suuntautuviin lausekkeisiin.

Parhaiten toimii yhdessä [WebSocket Send -solmun](../nodes/websocket-send-node.md), [HTTP-solmun](../nodes/http-node.md) ja [SSE Streaming](./sse-streaming.md) -toiminnon kanssa reaaliaikaisia integraatioita varten.

#### [Telegram-käynnistin](../nodes/telegram-trigger-node.md)

Telegram-käynnistin vastaanottaa bottien webhook-päivityksiä ja käynnistää workflowin välittömästi. Se palauttaa koko päivityspayloadin, ensisijaisen viestiobjektin, callback-kyselyt, siistityt otsikot ja käynnistysajan. Käytä sitä chatbotteihin, tekoälyavustajiin [Telegramissa](../nodes/telegram-node.md) ja painikkein ohjattaviin workfloweihin.

Parhaiten toimii yhdessä [Telegram-solmun](../nodes/telegram-node.md), [Agenttisolmun](../nodes/agent-node.md) ja [Webhooks](./webhooks.md) -toiminnon kanssa bottipohjaisia workfloweja varten.

#### [Slack-käynnistin](../nodes/slack-trigger-node.md)

Slack-käynnistin vastaanottaa Slack Events API -webhookkeja ja käynnistää workflowin automaattisesti pyynnön allekirjoituksen varmistamisen jälkeen. Se palauttaa tapahtumapayloadin ja siistityt otsikot reititykseen, [LLM-solmun](../nodes/llm-node.md) pohjaiseen luokitteluun ja vastausworkfloweihin.

Parhaiten toimii yhdessä [Slack-solmun](../nodes/slack-node.md), [Agenttisolmun](../nodes/agent-node.md) ja [Kolmannen osapuolen integraatiot](./integrations.md) -toiminnon kanssa.

#### [Discord-käynnistin](../nodes/discord-trigger-node.md)

Discord-käynnistin vastaanottaa Discord Interactions API -webhookkeja, varmistaa Ed25519-allekirjoitukset valitulla `discord_trigger` -kirjautumistiedolla ja käynnistää workflowin. Se palauttaa koko interaktiopayloadin, komentotiedot, siistityt otsikot ja käynnistysmetatiedot reititykseen tai vastauksiin.

Parhaiten toimii yhdessä [Tulostussolmun](../nodes/output-node.md), [Discord-solmun](../nodes/discord-node.md), [Agenttisolmun](../nodes/agent-node.md) ja [Kolmannen osapuolen integraatiot](./integrations.md) -toiminnon kanssa.
#### [RabbitMQ](../nodes/rabbitmq-node.md)

RabbitMQ-solmu lähettää tai vastaanottaa viestejä RabbitMQ-jonoista ja -vaihtimista. Sitä voidaan käyttää viestipohjaisiin workfloweihin ja tapahtumakäsittelyyn. Lähetystilassa julkaistaan viesti valinnaisella viiveellä; vastaanotustila toimii [triggerinä](./triggers.md), jolloin workflow käynnistyy saapuvan viestin myötä. Tuloste sisältää tilan, message_id:n ja viestin sisällön.

Parhaiten yhdistyy [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) ja [Parallel Execution](./parallel-execution.md) -solmuihin tapahtumapohjaisessa käsittelyssä.

#### [Error Handler](../nodes/error-handler-node.md)

Error Handler -solmu suoritetaan automaattisesti, kun mikä tahansa workflown solmu epäonnistuu. Siihen ei tarvita saapuvia yhteyksiä; se aktivoituu moottorin toimesta. Tuloste sisältää virheviestin, epäonnistuneen solmun tunnisteen, solmun tyypin ja aikaleiman. Sitä voidaan käyttää ilmoitusten lähettämiseen [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) tai [Send Email](../nodes/send-email-node.md) -solmujen kautta, virheiden lokitukseen tai mukautettujen virhevasteiden palauttamiseen.

Vaihtoehtona virheiden käsittelylle canvasilla workflow voi siirtää virheet erilliselle workflowlle — katso [Error Workflow](#error-workflow). Jos canvasiin sisältyy Error Handler -solmu, virheworkflowa **ei** kutsuta (paikallinen käsittelijä saa etusijan).

Yleisiä ilmoituskohteita ovat [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) ja [Send Email](../nodes/send-email-node.md); suoritusyksityiskohtia on helpompi tarkastella [Execution History](./execution-history.md) -näkymässä.

### Tekoäly

#### [Agent Node](../nodes/agent-node.md)

AI Agent -solmu on [LLM](../nodes/llm-node.md) -solmu, jossa on työkutsuntoiminto. Se voi suorittaa Python-työkaluja, kutsua kytkettyjä canvas-solmuja työkaluina, yhdistää [MCP](../tabs/mcp-tab.md) -palvelimiin, käyttää taitoja (ohjetiedostoja ja valinnaisia Python-skriptejä), toimia orkestroijana, joka delegoi tehtäviä muille agenttisolmuille, ja kutsua muita workflowja työkaluina. Tuloste on saatavilla muodossa `$nodeLabel.text`. Valinnainen **Extra Body** -vaihtoehto liittää jokaisen työkutsusilmukan pyyntöön providerikohtaisen JSON-objektin; se on oletusarvoisesti pois käytöstä. Valinnainen **Use Responses API** -vaihtoehto reitittää agentin mallikutsut Responses API:n kautta, mikä säilyttää mallin päättelyketjun työkutsusilmukoiden yli, jolloin päättelymalli säilyttää ajatusketjunsa monivaiheisessa silmukassa; se on oletusarvoisesti pois käytöstä ja toimii OpenAI:n ja mukautettujen tunnistetietojen kanssa.

Canvas-solmuiden työkalut antavat agentin kutsua määritettyjä workflow-solmuja suoraan canvasilta. Kytke tuettu solmu agentin työkalukahvaan ja merkitse tietyt kentät agentin toimittamiksi bottikuvakkeella. Nämä kentät muuttuvat työkaluparametreiksi suoritusaikana, kun taas tunnistetiedot ja merkaamattomat kentät pysyvät kiinteinä solmun asetuksissa.

Taitojen osio sisältää nyt **AI Build** -toiminnon uusien taitojen luomiseen, sisäänrakennetun tekoälymuokkauksen olemassa oleville taidoille, ZIP-latauksen taidokohtaisesti sekä valinnaisen **Enable Drive files** -kytkimen taidoille, jotka tarvitsevat lukea Heym Drive -tiedostoja suoritusaikana. Skill Builder -modaali näyttää keskustelun vasemmalla puolella, hyväksyy tiedostojen vetämisen jokaisen hienosäätökommentin yhteydessä, näyttää luettavan esikatselun luoduista `SKILL.md` ja `.py` -tiedostoista oikealla puolella, voi ladata esikatselun ZIP-tiedostona ja tallentaa ladatut hienosäätötiedostot takaisin niputetuiksi taidovarastoiksi saman ZIP-syötön kautta, jota käytetään manuaalisissa latauksissa.

Kun **[Agent Persistent Memory](./agent-persistent-memory.md)** on käytössä, jokainen agenttisolmu säilyttää oman tietoverkostonsa: faktat ladataan järjestelmäkehotukseen, kun ne eivät ole tyhjiä, ja onnistuneet suoritukset laukaisevat taustalla uusien entiteettien ja suhteiden yhdistämisen. Aliaagentit käyttävät erillisiä verkostoja. Voit **jakaa** agentin verkoston muiden agenttien kanssa (sama tai muu workflow) lukutilassa tai lukukirjoitustilassa verkostodialogista. Canvas-ohjaus avaa verkostoeditorin.

Agenttisolmut voivat myös siirtyä [Human-in-the-Loop](./human-in-the-loop.md) -tilaan. Tässä tilassa agentti saa käyttöönsä `request_human_review` -työkalun ja voi pysähtyä tiettyihin hyväksyntää vaativiin vaiheisiin, luoda kertakäyttöisen julkisen tarkistuslinkin, altistaa `review` -canvas-haaran ilmoitusworkfloweille ja odottaa, kunnes tarkistaja hyväksyy, muokkaa tai hylkää Markdown-muotoisen tarkistustekstin. Solmun HITL-kenttä toimii ohjeistuksena siitä, milloin kysyä, kun taas tarkistajalle näytettävä yhteenveto luodaan jokaisesta tarkistuspyynnöstä. [MCP](../tabs/mcp-tab.md) -työkaluissa Heym käyttää mallia tulkitsemaan nämä kirjalliset ohjeet muotoon `always`, `once` tai `never`, joten vapaamuotoinen hyväksyntäkieli kartoittuu konkreettiseen suorituskäytäntöön. Suoritus merkitään `pending`-tilaan ja jatkuu tallennetusta suoritusnäkymästä päätöksen saapumisen jälkeen, ja sama agenttisuoritus voi pysähtyä useammin, jos myöhemmät vaiheet myös vaativat tarkistusta.

Agenttisolmut pakkaavat automaattisesti kertyneen viestihistoriansa, kun se lähestyy 80 % mallin konteksti-ikkunasta. Järjestelmäkehotus, ensimmäinen käyttäjäviesti ja viimeisin käyttäjäviesti säilytetään aina; kaikki siltä välillä tiivistetään käyttämällä samaa mallia ja tunnistetietoja. Pakkaustapahtumat näkyvät Debug-paneelissa, [Execution History](./execution-history.md) -näkymässä ja [Traces](../tabs/traces-tab.md) -välilehdessä.

Katso myös [LLM](../nodes/llm-node.md), [Agent Architecture](./agent-architecture.md), [Agent Persistent Memory](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) ja [File Generation](./file-generation.md).
#### [Codex](../nodes/codex-node.md)

Codex-solmu suorittaa OpenAI Codex CLI:n eristetyssä Heym-työtilassa. Se hyväksyy Codex-tunnistetiedot (kirjaudu sisään ChatGPT:llä käyttääksesi tilauksesi ilman per-token API-kustannuksia, tai liitä käyttöoikeustoken), GitHub-tunnistetiedot, repositoryn URL-osoitteen, perushaaran, tehtävän promptin, julkaisutilan (`diff_only` tai `draft_pr`), haaran nimen ja aikakatkaisun. Suoritin kloonaa repositoryn paikallisesti, välittää ChatGPT-tokenin tai `CODEX_ACCESS_TOKEN`:in vain Codex-prosessille ja palauttaa rakenteellisen yhteenvedon, validointimerkinnät, muuttuneet tiedostot, diffin, käyttömetatiedot ja valinnaisen luonnos-PR:n URL-osoitteen.

Kun Codex palauttaa `needs_input`, workflow keskeytyy ja paljastaa `question`-haaran. Yhdistä tämä haara Slackiin, sähköpostiin tai toiseen ilmoitussolmuun; julkinen jatkolinkki jatkaa tallennettua suoritushetkeä vastauksen lähettämisen jälkeen. Codex-solmu voidaan myös liittää tekoälyagenttiin työkaluna, jolloin agentti voi delegoida koodaustöitä; työkaluna `needs_input`-tulos palautetaan suoraan agentille keskeytyksen sijaan.

Katso myös [GitHub](../nodes/github-node.md), [Tunnistetiedot](./credentials.md), [Tunnistetietojen jakaminen](./credentials-sharing.md) ja [Solmutyypit](./node-types.md).

#### [OpenCode Go](../nodes/opencode-go-node.md)

OpenCode Go -solmu suorittaa OpenCode CLI:n (Go) GitHub-repositorya vastaan. Eristys noudattaa Codexin kaavaa: paikallisesti se toimii isäntäprosessina, kun taas Docker-käyttöönotoissa se suoritetaan kovettetussa sisarkontissa, joka jakaa työtilan volyymin. Se hyväksyy OpenCode Go -tunnistetiedot (yhdyskäytävän API-avain valinnaisella perus-URL:lla), GitHub-tunnistetiedot, repositoryn URL-osoitteen, perushaaran, tehtävän promptin, julkaisutilan, haaran nimen, aikakatkaisun ja `opencode-go/<model>`-mallin, joka valitaan live-haettavasta mallilistasta (sisäänrakennetulla varajärjestelmällä). Heym suorittaa kaikki git/GitHub-toiminnot isännällä eikä koskaan sijoita GitHub-tokenia eristettyyn tilaan; OpenCode muokkaa vain tiedostoja levylle. Solmu palauttaa rakenteellisen yhteenvedon, validointimerkinnät, muuttuneet tiedostot, diffin ja valinnaisen pull request -URL-osoitteen. Se voidaan liittää tekoälyagenttiin työkaluna.

Katso myös [Codex](../nodes/codex-node.md), [GitHub](../nodes/github-node.md), [Tunnistetiedot](./credentials.md), [Tunnistetietojen jakaminen](./credentials-sharing.md) ja [Solmutyypit](./node-types.md).

#### [LLM](../nodes/llm-node.md)

LLM-solmu käsittelee tekstiä kielimallilla tai generoi kuvia. Se tukee tekstin generointia, näköä (kuvasyöte), kuvien generointia, rakennettua JSON-tulostetta, provider-natiivia Batch API -suoritusta tuetuille OpenAI- ja OpenAI-yhteensopiville päätepisteille sekä valinnaista **Käytä Responses API:a** -vaihtoehtoa, joka reitittää kutsun Responses API:n kautta Chat Completionsin sijaan (oletuksena pois päältä; toimii OpenAI:n ja mukautettujen tunnistetietojen kanssa, eikä sitä voi yhdistää Batch-tilaan). Määritä tunnistetiedot, malli, järjestelmä- ja käyttäjäviestit, lämpötila ja maksimimerkkimäärä; käytä [Expression DSL](./expression-dsl.md):ää prompteissa. Batch-tilassa `userMessage`-kentän on ratkaistava taulukoksi, solmu lähettää `batchStatus`-haaran etenemispäivityksillä ja lopullinen tulos sisältää kohtaisten batch-tulokset. Valinnainen **Extra Body** -vaihtoehto liittää JSON-objektin provider-spesifisiä pyyntöparametreja (esim. `{"thinking": {"type": "disabled"}}`) jokaiseen API-kutsuun; se on oletuksena pois päältä. Valinnaiset [Guardrails](./guardrails.md) estävät turvattoman sisällön ennen kutsua.

Luonnollisesti yhdistyy [Qdrant RAG](../nodes/rag-node.md), [Agent Node](../nodes/agent-node.md), [Guardrails](./guardrails.md) ja [Expression Evaluation Dialog](./expression-evaluation-dialog.md).

#### [Decision](../nodes/decision-node.md)

Decision-solmu kysyy päätösmallilta tyypitettyjä kysymyksiä suorituksen tilasta ja palauttaa todennäköisyyksiä proosan sijaan. **State**-kenttä sisältää sen, mitä mallin tulisi lukea — yksittäinen lauseke säilyttää oman tyyppinsä, joten `$input` lähettää objektin sen tekstin sijaan — ja kysymyslista sisältää arvioinnit. Kysymyksiä on kolmenlaisia: **noul** vastaa pitääkö ehto paikkansa, **choice** valitsee yhden vaihtoehdon määrittämästäsi joukosta ja palauttaa koko jakauman, ja **score** arvioi tilaa järjestetyillä tasoilla ja voi sijoittua niiden väliin. Choice- ja score-vastaukset sisältävät myös luottamuksen, joten [Switch](../nodes/switch-node.md) voi reitittää vastauksen perusteella kun [Condition](../nodes/condition-node.md) portti voi riippua siitä kuinka varma se oli. **Generate with AI** luo luonnoksen tilamallista ja kysymysriveistä tavallisesta lauseesta, ja **Custom request body** lähettää käsin kirjoitetun JSON:n päätepisteelle, jonka sopimus poikkeaa. Providerin vastaus välitetään muuttumattomana, ja jokainen kutsu tallennetaan [Traces](../tabs/traces-tab.md):iin.

Vaaditaan Decision Model -tunnistetiedot; luonnollisesti yhdistyy [Switch](../nodes/switch-node.md), [Condition](../nodes/condition-node.md) ja [Agent Node](../nodes/agent-node.md).
#### [RAG / Vektorivarasto](../nodes/rag-node.md)

RAG / Vektorivarasto -solmu lisää, päivittää, poistaa ja hakee dokumentteja vektorivarastosta hakupohjaista generointia varten. Tietokanta-pudotusvalikosta valitaan taustajärjestelmä – **Qdrant** (ulkoinen palvelin) tai **Postgres (pgvector)** (Heymin oma tietokanta, ei ulkoista palvelua), oletuksena Qdrant. Valitse vektorivarasto [Vektorivarastot](../tabs/vectorstores-tab.md) -välilehdestä ja aseta operaatio lisäämiseen, päivittämiseen, poistamiseen tai hakemiseen. Päivitys ja poisto kohdistuvat dokumenttiin yksilöllisen tunnisteen perusteella, joka tallennetaan payloadiin – **Document ID Field** määrittää kyseisen kentän nimen (oletus `doc_id`) ja **Document ID** sisältää sen arvon – joten dokumentti säilyttää järjestelmässä jo käytössä olevan tunnisteen: päivitys korvaa kaikki vastaavat pisteet ennen uuden version tallennusta, ja poisto ilmoittaa, löytyikö vastaavuutta. Dokumentin metatietojen arvoissa voidaan käyttää lausekkeita, joten `{"url": "$start.url"}` tallentaa suorituksen tuottaman URL-osoitteen. Haku tukee metatietojen suodattimia ja valinnaista Cohere -uudelleenjärjestystä, ja palauttaa tulostaulukon, joka sisältää tekstin, pisteytyksen, metatiedot, uudelleenjärjestyslipun ja lukumäärän käytettäväksi [LLM](../nodes/llm-node.md)- tai [Agenttisolmu](../nodes/agent-node.md) -workfloweissa.

Yleisiä seuraavia solmuja ovat [LLM](../nodes/llm-node.md) ja [Agenttisolmu](../nodes/agent-node.md); vektorivaraston asetukset löytyvät [Vektorivarastot](../tabs/vectorstores-tab.md) -välilehdestä.

#### [MCP-kutsusolmu](../nodes/mcp-call-node.md)

MCP-kutsusolmu kutsuu suoraan tiettyä [MCP](../tabs/mcp-tab.md) -työkalua ilman, että LLM päättää, mitä työkalua käytetään. Käytä sitä, kun tiedetään täsmälleen, mikä työkalu suoritetaan suunnitteluvaiheessa – deterministiseen, yksivaiheiseen MCP-työkalun suorittamiseen workflowissa. Määritä yhteys (SSE, Streamable HTTP tai stdio; samat kentät kuin [Agenttisolmu](../nodes/agent-node.md) -MCP-yhteydessä), napsauta **Hae työkalut** täyttääksesi pudotusvalikon, valitse työkalu ja täytä argumenttikentät, jotka renderöidään automaattisesti työkalun syöttökaaviosta. Jokainen argumentti hyväksyy staattisen arvon tai [DSL-lausekkeen](./expression-dsl.md), kuten `$userInput.body.text`. Tulos on saatavilla muodossa `$nodeLabel.result` (JSON-objekti, jos jäsennettävissä, muuten merkkijono). MCP-kutsusolmua ei voida yhdistää [Agenttisolmuun](../nodes/agent-node.md) canvas-työkaluna.

Katso myös [Agenttisolmu](../nodes/agent-node.md), [MCP](../tabs/mcp-tab.md) ja [Expression DSL](./expression-dsl.md).

### Logiikka

#### [Ehto](../nodes/condition-node.md)

Ehtosolmu haarauttaa workflown if/else-lauseen perusteella. Sillä on kaksi lähtöliitintä: yksi tosi-ehdon ja tosi epätosi-ehdon tapauksessa. Käytä vertailu- ja loogisia operaattoreita [Expression DSL](./expression-dsl.md) -lausekkeessa; solmu välittää syötteen valitun haaran läpi.

Katso myös [Kytkin](../nodes/switch-node.md), [Virheenheitto](../nodes/throw-error-node.md) ja [Expression DSL](./expression-dsl.md).

#### [Kytkin](../nodes/switch-node.md)

Kytkinsolmu ohjaa suoritusta eri poluille arvon vertailemisen perusteella. Määritä evaluoitava lauseke ja lista tapausarvoista; jokaiselle tapaukselle luodaan lähdeliitäntä, ja oletusliitäntää käytetään ei-vastaaville arvoille. Syöte välitetään vastaavalle haaralle.

Käytä [Ehto](../nodes/condition-node.md) -solmua binääriselle haarautumiselle ja [Yhdistä](../nodes/merge-node.md) -solmua haarautuneiden polkujen yhdistämiseen; vastaavuussäännöt käsitellään [Expression DSL](./expression-dsl.md) -dokumentaatiossa.

#### [Yhdistä](../nodes/merge-node.md)

Yhdistä-solmu odottaa useita rinnakkaisia syötteitä ja yhdistää ne yhdeksi tulokseksi. Aseta odotettavien syötteiden määrä; solmu tuottaa yhdistetyn objektin, kun kaikki haarat ovat valmistuneet. Käytä sitä rinnakkaisten haarojen tulosten yhdistämiseen ennen jatkamista; älä käytä sitä, kun rinnakkaiset haarat päättyvät erillisiin Tuloste-solmuihin.

Katso myös [Rinnakkaissuoritus](./parallel-execution.md), [Silmukka](../nodes/loop-node.md) ja [Tuloste](../nodes/output-node.md), kun haarojen tuloksia yhdistetään.

#### [Silmukka](../nodes/loop-node.md)

Silmukkasolmu iteroi taulukon yli suorittaen alaspäin olevia solmuja jokaiselle alkiolle. Se vaatii takaisinyhteyden viimeisestä iteraatiokehon solmusta edetäkseen. Silmukan sisällä käytettävissä ovat `item`, `index`, `total`, `isFirst` ja `isLast`; silmukalla on erilliset lähdöt iteraatiopolulle ja valmistumispolulle.

Parhaiten toimii yhdessä [Muuttuja](../nodes/variable-node.md), [Yhdistä](../nodes/merge-node.md) ja [Expression DSL](./expression-dsl.md) -solmujen kanssa iteratiivisissa workfloweissa.

### Data

#### [Aseta](../nodes/set-node.md)

Aseta-solmu muokkaa ja yhdistää syötetietoja mukautetuksi tulokseksi. Määrittele avain-arvo -kartoitukset, joissa jokainen arvo on [Expression DSL](./expression-dsl.md) -lauseke. Käytä sitä isoiksi kirjaimiksi muuttamiseen, osamerkkijonoihin, ketjuttamiseen, satunnaislukuihin ja vastaaviin muunnoksiin. Tulokseen viitataan avaimella (esim. `$setNode.keyName`). Kun yhdistetään agenttiin canvas-solmutyökaluna, kartoitusarvoja voidaan merkitä agentin täyttämiksi, jolloin agentti täyttää ne suoritusaikana. Muiden workflowjen kutsumiseen käytä [Suorita](../nodes/execute-node.md) -solmua.

Katso myös [Muuttuja](../nodes/variable-node.md), [Suorita](../nodes/execute-node.md) ja [Expression DSL](./expression-dsl.md).
#### [Muunnin](../nodes/converter-node.md)

Muunnin-solmu muuntaa dataa muodoista toiseen ilman koodin kirjoittamista. Tekstimuunnokset ovat `csvToJson` (CSV-teksti riviolioiden taulukoksi tai taulukoiksi, jos otsikkoriviä ei ole), `jsonToCsv` (olioiden/rivien taulukko CSV-tekstiksi), `xmlToJson` (XML-teksti olioksi) ja `jsonToXml` (olio XML-tekstiksi). Määritä muunnossuunta ja lähdelauseke; CSV-muunnokset käyttävät lisäksi erotinmerkkiä ja otsikkorivin käsittelyä, ja `jsonToCsv` voi kiinnittää sarakkeiden järjestyksen. Lainausmerkit, upotetut erottimet ja rivinvaihdot noudattavat RFC 4180 -standardia. XML-attribuutit käyttävät `@`-etuliitteitä, attribuuttien sekaantunut teksti käyttää `#text`-merkintää, toistuvista elementeistä tulee taulukoita, ja XML-entiteettien laajennus on pois käytöstä. Sama solmu toimii myös tallennetuille tiedostoille. `imageToText` ja `pdfToText` suorittavat Tesseract-OCR:ia, lukevan tiedoston Heym Drivesta (`$Upload.file.id` Tiedoston lataus -triggeristä, Drive-solmun tuloksesta tai agentin luomasta tiedostosta), valiten kielen automaattisesti havaittujen kirjoitusjärjestelmien perusteella tai käyttäen määritettyjä kielikoodeja kuten `tur` tai `eng+tur`, ja normalisoiden tekstin oletuksena UTF-8:ksi valinnaisella NFC-normalisoinnilla ja kapeammilla merkistöillä kuten `cp1254`. `fileConvert` kirjoittaa tallennetun tiedoston uudessa muodossa, asiakirjat pandocin ja kuvat Pillow-kirjaston kautta, ja tallentaa tuloksen uutena Drive-tiedostona alkuperäistä koskematta. Tulos on saatavilla muodossa `$converterNode.result`, jossa `.language`, `.encoding`, `.page_count`, `.pages` ja `.file` OCR-ajoilla, sekä `.id`, `.filename` ja `.download_url` `fileConvert`-toiminnolla.

Katso myös [Asetus](../nodes/set-node.md), [Datataulukko](../nodes/datatable-node.md) ja [Lausekekieli](./expression-dsl.md).

#### [Koodi](../nodes/code-node.md)

Koodi-solmu suorittaa kirjoittamaasi Python-koodia omassa `requirements.txt`-tiedostollaan kontissa, joka luodaan ja tuhotaan jokaiselle suoritukselle. Koodisi määrittelee `main(params)`-funktion ja palauttaa minkä tahansa JSON-sarjoitettavan arvon, joka tulee `$codeNode.result`:ksi; kaikki mitä se tulostaa, tallennetaan erikseen `$codeNode.logs`:iin, ja `$codeNode.install` raportoi riippuvuuksien asennuksen. Parametrit määritetään JSON-objektina, jonka `$`-lausekkeet ratkaistaan ennen suoritusta, ja koodi lukee ne pistenotaatiolla kuten `params.user.name` tai `params.orders[0].id`. Riippuvuudet asennetaan `uv`:lla, ja jos `uv` ei pysty käsittelemään paketteja, käytetään `pip`:iä ilman välimuistia suoritusten välillä; jos `requirements.txt` on tyhjä, asennus ohitetaan kokonaan ja suoritus on paljon nopeampi. Suoritusvaiheessa ei ole verkkoyhteyttä, ellei `codeAllowNetwork` ole päällä, kun taas riippuvuuksien asennus käyttää aina PyPI:ä. Hiekkalaatikko suoritetaan ei-root-oikeuksilla, kaikilla kyvykkyyksillä poistettu, vain-luku -juuritiedostojärjestelmällä, ilman Docker-socketia ja ilman pääsyä taustajärjestelmän salaisuuksiin, rajoitettuna 512 Mt muistiin, yhteen suoritinyksikköön, 256 prosessiin, 120 sekunnin asennukseen ja 60 sekunnin suoritukseen. Docker vaaditaan eikä ole varatoimintatilaa: jos daemonia ei ole saatavilla, solmu epäonnistuu sen sijaan että suorittaisi koodisi taustaprosessissa.

#### [Muuttuja](../nodes/variable-node.md)

Muuttuja-solmu asettaa tai päivittää workflow-lokaalin muuttujan (`$vars.muuttujanNimi`) tai pysyvän [globaalin muuttujan](./global-variables.md) (`$global.muuttujanNimi`). Käytä sitä laskureihin, kertyneisiin listoihin ja jaettuun tilaan. Määritä muuttujan nimi, arvolauseke, tyyppimuunnos ja tallennetaanko globaaliin tallennustilaan. Taulukkomuuttujat tukevat `$array()`- ja `.add()`-operaatioita.

Paritettu [Asetus](../nodes/set-node.md)-, [Silmukka](../nodes/loop-node.md)- ja [Globaalit muuttujat](./global-variables.md)-solmujen kanssa.

#### [Suorita](../nodes/execute-node.md)

Suorita-solmu kutsuu toista workflowia (aliworkflow) ja välittää sille syötettä. Määritä kohdeworkflow ID:n perusteella ja anna syöte joko yhden lausekkeen tai avain-arvo -kartoituksen kautta. Tuloste sisältää workflow_id:n, tilan ja tulosteet; käytä sitä uudelleenkäytettävään logiikkaan, ei datan muunnokseen (käytä Asetus-solmua siihen).

Katso myös [Canvas-ominaisuudet](./canvas-features.md) osiosta Pura aliworkflowiksi, [Workflow-rakenne](./workflow-structure.md) ja [Tuloste](../nodes/output-node.md).

### Integraatiot

#### [HTTP](../nodes/http-node.md)

HTTP-solmu tekee HTTP-pyyntöjä cURL-tyylisillä asetuksilla. Se voi olla workflown aloituspiste (ei saapuvia yhteyksiä) tai vastaanottaa syötettä ylempien solmujen kautta. Vastaus on saatavilla statuksena, otsakkeina ja rungona (jäsenneltynä JSON-muodossa, kun sovellettavissa). Käytä [Tunnistetiedot](./credentials.md) Bearer- tai mukautettua otsakeautentikointia varten.

Paritettu [Webhookit](./webhooks.md)-, [Tunnistetiedot](./credentials.md)- ja [Kolmannen osapuolen integraatiot](./integrations.md)-solmujen kanssa.

#### [WebSocket Lähetä](../nodes/websocket-send-node.md)

WebSocket Lähetä -solmu avaa lähtevän asiakasyhteyden, lähettää yhden tekstin/JSONin/binaariviestin ja sulkee sen. Käytä sitä julkaisemaan workflown tuloste reaaliaikaisiin järjestelmiin luomatta Heym-palvelimelle socket-päätepistettä.

Katso myös [WebSocket Trigger](../nodes/websocket-trigger-node.md), [SSE-suoratoisto](./sse-streaming.md) ja [Kolmannen osapuolen integraatiot](./integrations.md).
#### [Telegram](../nodes/telegram-node.md)

Telegram-solmu lähettää bottiviestin chattiin, ryhmään tai kanavalle. Määritä Telegram-tunnistetiedot ([credentials](./credentials.md)), aseta `chatId` ja muodosta lähtevä `message` [Expression DSL](./expression-dsl.md) -lausekkeilla. Se toimii luontevasti yhdessä [Telegram Trigger](../nodes/telegram-trigger-node.md) -solmun kanssa keskustelupohjaisissa workfloweissa sekä [Error Handler](../nodes/error-handler-node.md) -solmun kanssa hälytysten lähettämiseen.

Katso myös [Kolmannen osapuolen integraatiot](./integrations.md) ja [Tunnistetiedot](./credentials.md) asennus- ja tunnistetietokäytäntöjä varten.

#### [Slack](../nodes/slack-node.md)

Slack-solmu lähettää viestin Slack-kanavalle Incoming Webhookin kautta. Määritä Slack-tunnistetiedot ([credentials](./credentials.md)) ja viestilauseke. Käytä sitä ilmoituksiin, hälytyksiin ja virheraportointiin; lähtö kulkee syötteen läpi.

Toimii yhdessä [Slack Trigger](../nodes/slack-trigger-node.md), [Error Handler](../nodes/error-handler-node.md) ja [Kolmannen osapuolen integraatiot](./integrations.md) -solmujen kanssa.

#### [Discord](../nodes/discord-node.md)

Discord-solmu lähettää viestin Discord-kanavalle Incoming Webhookin kautta. Määritä Discord-tunnistetiedot ([credentials](./credentials.md)), muodosta lähtevä viesti [Expression DSL](./expression-dsl.md) -lausekkeilla ja valinnaisesti aseta webhook-käyttäjänimi tai avatarin korvaukset.

Toimii yhdessä [Discord Trigger](../nodes/discord-trigger-node.md), [Output](../nodes/output-node.md), [Error Handler](../nodes/error-handler-node.md) ja [Kolmannen osapuolen integraatiot](./integrations.md) -solmujen kanssa.

#### [Sähköpostin lähetys](../nodes/send-email-node.md)

Sähköpostin lähetys -solmu lähettää sähköposteja SMTP:n kautta. Määritä SMTP-tunnistetiedot ([credentials](./credentials.md)) ja [Expression DSL](./expression-dsl.md) -lausekkeet vastaanottajille, aiheelle ja viestille. Käytä sitä ilmoituksiin, hälytyksiin ja transaktiosähköposteihin. Lähtö sisältää tilan, vastaanottajan ja aiheen.

[IMAP Trigger](../nodes/imap-trigger-node.md) täydentää Sähköpostin lähetys -solmua käsittelemällä saapuvia viestejä. Yhdessä ne mahdollistavat workflown, joka lukee saapuvia viestejä jaollisesta postilaatikosta, tiivistää tai luokittelee ne tekoälysolmujen avulla ja lähettää seurantaviestin tai eskaloi asian. [Telegram Trigger](../nodes/telegram-trigger-node.md) ja [Telegram-solmu](../nodes/telegram-node.md) tarjoavat saman saapuvan/lähtevän viestin käsittelyn bottipohjaisissa chattityönkuluissa.

Kaksisuuntaisten ilmoitusvirtojen kannesta se toimii hyvin myös yhdessä [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) ja [Kolmannen osapuolen integraatiot](./integrations.md) -solmujen kanssa.

#### [Redis](../nodes/redis-node.md)

Redis-solmu suorittaa Redis-operaatioita: set, get, hasKey ja deleteKey. Käytä sitä välimuistitukseen, rajoitukseen ja avain-arvo-tallennukseen. Määritä tunnistetiedot ([credentials](./credentials.md)), operaatiotyyppi, avainlauseke ja set-operaatioissa arvo sekä valinnainen TTL. Lähtö vaihtelee operaatiosta riippuen (arvo, onnistuminen, olemassaolo, poistettu).

Toimii yhdessä [Wait](../nodes/wait-node.md), [Variable](../nodes/variable-node.md) ja [Rinnakkaissuoritus](./parallel-execution.md) -solmujen kanssa välimuistitukseen, säätöön ja koordinointiin.

#### [Grist](../nodes/grist-node.md)

Grist-solmu lukee, kirjoittaa ja hallinnoi dataa Grist-taulukoissa. Operaatiot sisältävät getRecord, getRecords, createRecord, updateRecord, deleteRecord, listTables ja listColumns. Anna dokumenttitunnus, taulukkotunnus ja luonti/päivitysoperaatioissa tietueen data saraketunnuksin. Käytä sitä CRUD-toimintoihin, eräpäivityksiin ja taulukkoautomaatioon.

Katso myös [Google Sheets](../nodes/google-sheets-node.md), [DataTable](../nodes/datatable-node.md) ja [Kolmannen osapuolen integraatiot](./integrations.md).

#### [Google Sheets](../nodes/google-sheets-node.md)

Google Sheets -solmu lukee, kirjoittaa ja hallinnoi taulukkotietoa OAuth2:n kautta. Käytä sitä raporttien lukemiseen, workflow-tulosten lisäämiseen, seurantataulukoiden päivittämiseen ja välilehtien tyhjentämiseen tai tarkasteluun workflown sisältä. Kuten [BigQuery](../nodes/bigquery-node.md), se käyttää Google-pohjaista integraatiotunnistetta ja sopii hyvin [Grist](../nodes/grist-node.md) -solmun rinnalle, kun taulukkotiedot ovat osana työnkulkua.

Toimii yhdessä [Grist](../nodes/grist-node.md), [DataTable](../nodes/datatable-node.md) ja [Kolmannen osapuolen integraatiot](./integrations.md) -solmujen kanssa.

#### [BigQuery](../nodes/bigquery-node.md)

BigQuery-solmu suorittaa SQL-kyselyjä ja lisää rivejä Google BigQuery -tietokantoihin OAuth2:n kautta. Se on hyödyllinen analytiikkatyönkuluissa, raportointiputkissa ja strukturoidun tapahtumadatan kirjoittamisessa workflow-ajojen tuloksista. Se toimii usein yhdessä [Set](../nodes/set-node.md) -solmun kanssa rivien muotoilussa ja [Google Sheets](../nodes/google-sheets-node.md) -solmun kanssa kevyemmissä taulukkopohjaisissa raportointiratkaisuissa.

Toimii yhdessä [Set](../nodes/set-node.md), [LLM](../nodes/llm-node.md), [Google Sheets](../nodes/google-sheets-node.md) ja [Kolmannen osapuolen integraatiot](./integrations.md) -solmujen kanssa.
#### [Google Drive](../nodes/google-drive-node.md)

Google Drive -solmu mahdollistaa tiedostojen ja kansioiden listaamisen, lataamisen, päivittämisen ja poistamisen OAuth2-autentikoinnin kautta. Se voi myös kopioida Drive-tiedoston suoraan [Heym Driveen](../nodes/drive-node.md) `syncToHeymDrive` -toiminnolla. Google Docs-, Sheets- ja Slides -tiedostoilla ei ole ladattavaa sisältöä, joten solmu muuntaa ne automaattisesti – Docs PDF-muotoon, Sheets XLSX-muotoon ja Slides PPTX-muotoon – mahdollisuutena korvata kohdemuoto. Poistot siirtävät kohteet Driveen roskakoriin, ellei "Poista pysyvästi" -toimintoa ole käytössä. Solmu ei suostu poistamaan kansiota tiedostotoiminnolla tai päinvastoin. Kuten [Google Sheets](../nodes/google-sheets-node.md) -solmu, se käyttää Googlen tarjoamaa OAuth2-tunnistetietoa; huomaa, että tämä vaatii täyden Drive-käyttöoikeuden, joten tarkista [Tunnistetietojen jakaminen](./credentials-sharing.md) ennen tunnistetiedon jakamista.

Parhaiten yhdistyy [Loop](../nodes/loop-node.md), [Drive](../nodes/drive-node.md), [LLM](../nodes/llm-node.md) ja [Kolmannen osapuolen integraatiot](./integrations.md) -solmuihin.

#### [GitHub](../nodes/github-node.md)

GitHub-solmu tarjoaa 40 valmista GitHub REST -toimintoa, jotka kattavat repositoriot, organisaatiot ja käyttäjät, issuet, pull-pyynnöt, arvostelut, julkaisut, Actions-workflowt, liikennetiedot sekä repositoriotiedostot. Käytä sitä issueiden hallintaan, arvosteluautomaatioon, workflowjen käynnistykseen ja valvonnan odotukseen, julkaisuautomaatioon sekä repositoriotiedostojen päivityksiin ilman manuaalisia HTTP-pyyntöjä. Se tukee GitHub.com -palvelua ja valinnaista GitHub Enterprise -perusosoitetta (`base_url`) tunnistetiedoissa.

Parhaiten yhdistyy [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Set](../nodes/set-node.md) ja [Kolmannen osapuolen integraatiot](./integrations.md) -solmuihin.

#### [Jira](../nodes/jira-node.md)

Jira-solmu yhdistää workflowt Jira Cloudin tai Jira Data Center / Server -palvelun REST-APIin projekti-, issue-, kommentti-, liite-, käyttäjä-, ilmoitus- ja siirtymäautomaatioita varten. Se voi listata projekteja, hakea issueita JQL-kyselyillä, luoda tai päivittää issueita, tarkastella muutoslokeja, ilmoittaa sidosryhmille, hallita kommentteja ja liitteitä, hakea tai hallita käyttäjiä, listata saatavilla olevat siirtymät sekä siirtää issueita siirtymätunnuksen avulla. Käytä Jira-tunnistetietoa, jossa on Atlassian-sähköposti, API-token, sivuston perusosoite ja käyttöönototapa.

Parhaiten yhdistyy [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) ja [Kolmannen osapuolen integraatiot](./integrations.md) -solmuihin tukipyyntöjen, vikojen hallinnan ja julkaisuworkflowjen yhteydessä.

#### [Linear](../nodes/linear-node.md)

Linear-solmu yhdistää workflowt Linearin GraphQL-APIin työtilan ja issueiden automaatiota varten. Se voi listata tiimejä, projekteja, issueita, workflow-tiloja, tiimin jäseniä ja kommentteja; luoda, päivittää, poistaa ja linkittää issueita; sekä luoda, päivittää, ratkaista, avata uudelleen tai poistaa kommentteja. Käytä Linearin henkilökohtaista API-avainta tai OAuth2-tunnistetietoa, etsi tiimin, projektin, tilan ja vastuuhenkilön UUID-tunnisteet listausoperaatioista ennen issueiden luomista tai päivittämistä.

Parhaiten yhdistyy [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) ja [Kolmannen osapuolen integraatiot](./integrations.md) -solmuihin vastaanotto-, priorisointi- ja teknisten tehtävien hallintaworkflowjen yhteydessä.

#### [Supabase](../nodes/supabase-node.md)

Supabase-solmu lukee ja muokkaa Supabase PostgRESTin kautta tarjottuja taulukoita. Se soveltuu hyvin tuotetaustoihin, käyttäjä-/profiilitietoihin, workflow-tilaan ja CRUD-tyyppisiin automaatioihin, jotka tarvitsevat tietokantapääsyä ilman mukautettuja HTTP-pyyntöjä.

Parhaiten yhdistyy [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md), [HTTP](../nodes/http-node.md) ja [Kolmannen osapuolen integraatiot](./integrations.md) -solmuihin.

#### [ClickHouse](../nodes/clickhouse-node.md)

ClickHouse-solmu suorittaa CRUD-, laskenta- ja raaka SQL -operaatioita ulkoiseen ClickHouse-tietokantaan sen HTTP-rajapinnan kautta. Se sopii analytiikkaputkiin, tapahtumien lokitukseen ja raportointiworkflowhin: lisää tapahtumia reaaliajassa, tee niistä koosteita tai laske niitä `query`/`count` -toiminnoilla. Se toistaa [DataTable](../nodes/datatable-node.md) -solmun toimintovalikoiman (find, getAll, count, getById, insert, update, remove, upsert) ja tarjoaa lisäksi raa'an SQL -välityksen, jossa `update`/`remove` -toiminnot suoritetaan ClickHouse-mutaatioina.

Parhaiten yhdistyy [Set](../nodes/set-node.md), [Cron](../nodes/cron-node.md) -solmuun aikataulutettuja raportteja varten ja [Kolmannen osapuolen integraatiot](./integrations.md) -solmuihin.

#### [Notion](../nodes/notion-node.md)

Notion-solmu hallinnoi Notion-tietokantoja, tietolähteitä, sivuja ja lohkoja nykyisen Notion API:n (`2026-03-11`) kautta. Se tukee hakua, sivujen CRUD-toimintoja, tietokanta- ja tietolähdeoperaatioita, lohkojen lapsia, lohkojen lisäystä/päivitystä/poistoa sekä roskakorin hallintaa ja palauttamista. Käytä sisäistä integraatiotokenia tai Notionin julkista OAuth-tunnistetietoa. Editori voi hakea ja sivutuslukea käytettävissä olevia tietolähteitä ja vanhempia sivuja. Jaetut tunnistetiedot toimivat samalla tavalla kuin omistetut tunnistetiedot workflowjen suorituksessa.

Mukautettuja REST-kutsuja varten `$credentials.YourNotionCredential` selvittää saman bearer-tokenin. Parhaiten yhdistyy [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [LLM](../nodes/llm-node.md) ja [Kolmannen osapuolen integraatiot](./integrations.md) -solmuihin.
#### [Sentry](../nodes/sentry-node.md)

Sentry-solmu automatisoi Sentry-organisaatioiden, -projektien, -tiimien, -ongelmien, -tapahtumien ja -julkaisujen hallintaa Sentry REST API:n kautta. Sitä voidaan käyttää hälytysten priorisointiin, ongelmien tilapäivityksiin, julkaisuautomaatioon, tapahtumien hakuun sekä projektien ja tiimien määritykseen tai siivoukseen. Se tukee Sentry SaaS -palvelua ja itse isännöityä Sentryä valinnaisen tunnistetietojen perus-URL:n kautta.

Parhaiten toimii yhdessä [Virheenkäsittelijä](../nodes/error-handler-node.md), [Slack](../nodes/slack-node.md), [Linear](../nodes/linear-node.md) ja [Kolmannen osapuolen integraatiot](./integrations.md) -solmujen kanssa häiriöiden ja julkaisujen workfloweissa.

#### [Datataulukko](../nodes/datatable-node.md)

Datataulukko-solmu lukee, kirjoittaa ja hallinnoi tietoja Heymin Datataulukoissa (ensijaisessa rakenteellisessa tallennustilassa). Toiminnot sisältävät find, getAll, getById, insert, update, remove ja upsert. Ulkoisia tunnistetietoja ei vaadita. Taulukoita hallinnoidaan [Datataulukko](../tabs/datatable-tab.md) -hallintanäkymästä, ja niihin pääsee suoraan käsiksi workflown omistaja.

Parhaiten toimii yhdessä [Aseta](../nodes/set-node.md), [Muuttuja](../nodes/variable-node.md) ja [Datataulukko-välilehti](../tabs/datatable-tab.md) -solmujen kanssa ensijaisessa rakenteellisessa tallennustilassa.

#### [Drive](../nodes/drive-node.md)

Drive-solmu hallinnoi taitojen generoimia tiedostoja suoraan workflown sisältä. Toiminnot sisältävät delete, setPassword, setTtl, setMaxDownloads, shareWithMyTeams ja unshareWithMyTeams tiimien lukuoikeuksien hallintaan; muunnokset käsitellään [Muunnin](../nodes/converter-node.md) -solmussa. Tiedostoon viitataan `$agentLabel._generated_files[0].id` -lausekkeella; tulokset sisältävät tilan, file_id:n, päivitetyt download_url -linkkirajoitukset sekä shared_team_count -tiimijakojen määrän. Erityisen hyödyllinen [Agentti](../nodes/agent-node.md) -workfloweissa, jotka käyttävät [Tiedostogenerointia](./file-generation.md) ja [Drive](./drive.md) -viitemallia.

Yleisimmin käytetyt yhteensopivat solmut ovat [Agentti](../nodes/agent-node.md), [Tiedostogenerointi](./file-generation.md) ja [Drive](./drive.md).

#### [Amazon S3](../nodes/amazon-s3-node.md)

Amazon S3 -solmu suorittaa objektitallennustoimintoja Amazon S3:lle käyttäen `s3` -tunnistetietoja (käyttöavain, salainen avain, alue, valinnainen istunnon token). Toiminnot sisältävät putObject, getObject, deleteObject, listObjects, copyObject, createBucket, deleteBucket, createFolder, deleteFolder, getAllFolder ja listBuckets. Tekstin lähetys sekä tekstin tai base64-muotoisen datan lataus on tuettu, ja bucket- ja key-kentät hyväksyvät [Expression DSL](./expression-dsl.md) -lausekkeita. Käytä sitä workflown tulosten tallentamiseen, tiedostojen arkistointiin ja objektien lukemiseen takaisin workflowhun.

Parhaiten toimii yhdessä [Aseta](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [Tunnistetiedot](./credentials.md) ja [Kolmannen osapuolen integraatiot](./integrations.md) -solmujen kanssa.

### Automaatio

#### [Crawler](../nodes/crawler-node.md)

Crawler-solmu kaapii verkkosivuja käyttäen FlareSolverria valinnaisella HTML-osion poiminnalla CSS-valitsimien avulla. Määritä FlareSolverr [tunnistetiedot](./credentials.md), URL-lauseke, odotusaika ja valinnaiset valitsimet poimintaa varten. Tulosteena on raaka HTML tai poimittu sisältö. Käytä sitä verkkosivujen kaappaukseen ja sisällön poimintaan.

Parhaiten toimii yhdessä [HTTP](../nodes/http-node.md), [Playwright](../nodes/playwright-node.md) ja [LLM](../nodes/llm-node.md) -solmujen kanssa kaappaus-ja-analysointi -workfloweissa.

#### [Playwright](../nodes/playwright-node.md)

Playwright-solmu automatisoi selaininteraktioita määritettävillä vaiheilla (navigate, refresh, click, type, screenshot, extract, aiStep) tai **Run Code** -tilassa mukautettua Playwright Python -koodia varten (eristetty ympäristö; pois päältä oletuksena HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED -asetuksella). Se tukee headless -tilaa, valinnaista asetusta, joka vähentää yleisiä Playwright-automaatiosignaaleja, aikakatkaisuja, valinnaista verkkoliikenteen kaappausta (vastaukset, evästeet, localStorage, sessionStorage), evästeiden/storageState -todennuksen alustusta [Globaaleista muuttujista](./global-variables.md) lausekkeilla kuten `$global.authState`, varajärjestelmän kirjautumisvaiheita, kun todennuspalautus epäonnistuu, sekä AI-vaihetta Auto Heal -toiminnolla, kun valitsimet epäonnistuvat. Käytä sitä verkkosivujen kaappaukseen, lomakkeiden täyttöön ja selainpohjaisiin workfloweihin.

Katso myös [Crawler](../nodes/crawler-node.md), [HTTP](../nodes/http-node.md) ja [Suoritushistoria](./execution-history.md) selainautomaatioon ja virheenkorjaukseen.

### Apuohjelmat

#### [Tuloste](../nodes/output-node.md)

Tuloste-solmu on workflown päätepiste, joka palauttaa vastauksen kutsujalle. Aseta viestin lauseke viittaamaan edelliseen solmuun sen nimikkeen perusteella (älä koskaan käytä `$input` -muuttujaa [Syöte](../nodes/input-node.md) -solmusta tässä). Valinnainen asynkroninen jälkikäsittely sallii solmujen suorittamisen taustalla, kun vastaus on jo lähetetty.

Yleisimmät lähteet ovat [Syöte](../nodes/input-node.md), [LLM](../nodes/llm-node.md) ja [Suorita](../nodes/execute-node.md); vastauksen muotoilua on helpompi debugata [Lausekkeen arviointidialogissa](./expression-evaluation-dialog.md).

#### [JSON-tulostemuunnin](../nodes/json-output-mapper-node.md)

JSON-tulostemuunnin-solmu rakentaa tavallisen JSON-objektin [Aseta](../nodes/set-node.md) -tyylisistä avain-arvo -pareista ja palauttaa sen workflown vastauksen juuritasolla. Käytä sitä, kun API:n kutsujan tulisi vastaanottaa raaka JSON-runko standardin [Tuloste](../nodes/output-node.md) -solmun kääreen sijaan.
#### [HTML-tulosteen muuntaja](../nodes/html-output-mapper-node.md)

HTML-tulosteen muuntaja -solmu renderöi yhden HTML-mallin, interpoloi `$nodeLabel.field` -lausekkeet sivulle. Kun se on workflown ainoa terminaalisolmu, suorituswebhook vastaa `text/html` -sisällöllä ja solmun määrittämällä tilakoodilla JSON-rungon sijaan, jolloin workflow voi palvella sivua suoraan selaimelle. Lähetä `X-Simple-Response: false` saadaksesi tavallisen JSON-kuoren takaisin virheenjäljitystä varten.

Parhaiten toimii yhdessä [Set](../nodes/set-node.md)-, [Output](../nodes/output-node.md)-solmujen, [Workflow Structure](./workflow-structure.md) - ja [Webhooks](./webhooks.md) -dokumentaation kanssa.

#### [Kaaviotuloste](../nodes/chart-output-node.md)

Kaaviotuloste -solmu on [Dashboard](../tabs/dashboard-tab.md) -widgetin workflown terminaalisolmu. Se muuntaa ylävirran solmujen tuottamat rivit standardoiduksi kaaviodataksi, jonka dashboard renderöi. Valitse `chartType` (pylväs, viiva, alue, ympyrä, taulukko, numeerinen, mittari, piste, osuus, pylväsmittari, teksti tai HITL), määritä `labelField`/`valueField` (tai `series` useille sarjoille, tai `text` markdown-viestille) ja sijoita se viimeiseksi; sillä ei ole lähtöreunaa. HITL ohittaa ylävirran rivit ja listaa odottavat ihmisten tarkistukset. ja toisen linkkipainikkeina, jotka avaavat URL-osoitteen uudessa välilehdessä (`linkColumn`, painikkeen tekstille `linkLabel`)

Katso myös [Dashboard](../tabs/dashboard-tab.md), [Set](../nodes/set-node.md) ja [Output](../nodes/output-node.md).

#### [Odota](../nodes/wait-node.md)

Odota-solmu pysäyttää workflown suorituksen määritetyn ajan millisekunteina, enintään 15 minuuttia. Käytä sitä nopeuden rajoittamiseen, viivästettyihin toimintoihin tai kyselyväleihin. Se välittää syötteen muuttumattomana.

Parhaiten toimii yhdessä [Cron](../nodes/cron-node.md)-, [Redis](../nodes/redis-node.md)-solmujen ja [Parallel Execution](./parallel-execution.md) -dokumentaation kanssa tahdin ja kyselyn hallintaan.

#### [Muistilappu](../nodes/sticky-note-node.md)

Muistilappu-solmu lisää markdown-muotoisia muistiinpanoja canvasille. Sitä ei suoriteta. Käytä sitä dokumentointiin, ohjeisiin tai workflown muistiinpanoihin muiden [Canvas Features](./canvas-features.md) -ominaisuuksien rinnalla. Kaksoisnapsauta canvasia muokataksesi muistiinpanon sisältöä.

Katso myös [Canvas Features](./canvas-features.md), [Keyboard Shortcuts](./keyboard-shortcuts.md) ja [Workflow Organization](./workflow-organization.md).

#### [Konsoliloki](../nodes/console-log-node.md)

Konsoliloki-solmu kirjaa arvon palvelimen konsoliin. Käytä sitä virheenjäljitykseen ja tarkasteluun kehitysvaiheessa. Lokiviesti tukee [Expression DSL](./expression-dsl.md) -lausekkeita; syöte välitetään läpi muuttumattomana.

Parhaiten toimii yhdessä [Execution History](./execution-history.md)-, [Traces](../tabs/traces-tab.md)- ja [Expression Evaluation Dialog](./expression-evaluation-dialog.md) -dokumentaation kanssa virheenjäljitykseen.

#### [Poista solmu käytöstä](../nodes/disable-node.md)

Poista solmu käytöstä -solmu poistaa toisen workflown solmun käytöstä pysyvästi asettamalla sen `active` -lipun arvoksi false. Määritä kohdesolmu sen tunnisteella. Käytä sitä kertaluonteisiin operaatioihin, kuten [Cron](../nodes/cron-node.md) -laukaisijan pysäyttämiseen ehdon täyttyessä.

Katso myös [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md) ja [Cron](../nodes/cron-node.md) workflown hallintamalleja varten.

#### [Ota solmu käyttöön](../nodes/enable-node.md)

Ota solmu käyttöön -solmu ottaa toisen solmun uudelleen käyttöön asettamalla sen `active` -lipun arvoksi true ja tallentamalla muutoksen. Määritä kohdesolmu sen tunnisteella. Käytä sitä poistetun [Cron](../nodes/cron-node.md) -laukaisijan uudelleenaktivoimiseen toisesta lähtökohdasta tai solmun kytkemiseen päälle ehdon täyttyessä. Kohde, joka sijaitsee Ota solmu käyttöön -solmun alapuolella eikä ole vielä suoritettu, suoritetaan myös nykyisessä suorituksessa.

Katso myös [Poista solmu käytöstä](../nodes/disable-node.md), [Canvas Features](./canvas-features.md) ja [Cron](../nodes/cron-node.md) workflown hallintamalleja varten.

#### [Luo virhe](../nodes/throw-error-node.md)

Luo virhe -solmu keskeyttää workflown suorituksen välittömästi ja palauttaa virhevasteen mukautetulla HTTP-tilakoodilla. Aseta virheviestin lauseke ja tilakoodi (esim. 400, 401, 403, 404, 429, 500). Käytä sitä validointivirheisiin, luvattomaan käyttöön tai muihin virhetilanteisiin, erityisesti yhdessä [Condition](../nodes/condition-node.md)- ja [Error Handler](../nodes/error-handler-node.md) -solmujen kanssa.

Parhaiten toimii yhdessä [Condition](../nodes/condition-node.md)-, [Error Handler](../nodes/error-handler-node.md)-solmujen ja [Security](./security.md) -dokumentaation kanssa eksplisiittisiä virhepolkuja varten.

---

## Viite
### [Solmutyypit](./node-types.md)

Heym tarjoaa laajan valikoiman solmutyyppejä: triggerit kuten [Syöte](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) ja [Virheenkäsittelijä](../nodes/error-handler-node.md); tekoälysolmut kuten [LLM](../nodes/llm-node.md), [Päätös](../nodes/decision-node.md), [Agenttisolmu](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Qdrant RAG](../nodes/rag-node.md) ja [MCP Call](../nodes/mcp-call-node.md); logiikkasolmut kuten [Ehto](../nodes/condition-node.md), [Kytkin](../nodes/switch-node.md), [Yhdistä](../nodes/merge-node.md) ja [Silmukka](../nodes/loop-node.md); datasolmut kuten [Aseta](../nodes/set-node.md), [Muunnin](../nodes/converter-node.md), [Koodi](../nodes/code-node.md), [Muuttuja](../nodes/variable-node.md), [Suorita](../nodes/execute-node.md) ja [Heym](../nodes/heym-node.md); integraatiot kuten [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), [Discord](../nodes/discord-node.md), [Lähetä sähköposti](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md), [Grist](../nodes/grist-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Drive](../nodes/google-drive-node.md), [BigQuery](../nodes/bigquery-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Datataulukko](../nodes/datatable-node.md) ja [Drive](../nodes/drive-node.md); automaatiosolmut kuten [Crawler](../nodes/crawler-node.md) ja [Playwright](../nodes/playwright-node.md); sekä apuvälineet kuten [Odota](../nodes/wait-node.md), [Tuloste](../nodes/output-node.md), [JSON-tulostekartta](../nodes/json-output-mapper-node.md), [HTML-tulostekartta](../nodes/html-output-mapper-node.md), [Konsoliin kirjaus](../nodes/console-log-node.md), [Heitä virhe](../nodes/throw-error-node.md), [Poista solmu käytöstä](../nodes/disable-node.md), [Ota solmu käyttöön](../nodes/enable-node.md) ja [Muistilappu](../nodes/sticky-note-node.md). Solmujen asetuksissa voidaan käyttää lausekkeita kuten `$input.text` ja `$nodeLabel.field`.

Katso myös [Triggerit](./triggers.md), [Kolmannen osapuolen integraatiot](./integrations.md) ja [Rinnakkaissuoritus](./parallel-execution.md).

### [Lausekekieli](./expression-dsl.md)

Heym käyttää yksinkertaista lausekekieltä viittaamaan ylävirran solmujen tietoihin. Käytä `$input` [Syöte](../nodes/input-node.md)-solmulle, `$nodeLabel.field` mille tahansa ylävirran solmulle, `$credentials.CredentialName` [tunnistetiedoille](./credentials.md) ja `$global.variableName` [globaaleille muuttujille](./global-variables.md). Sisäänrakennettuja erikoismuuttujia ovat mm. `$now`, `$UUID` sekä workflow-metatiedot: `$workflowName`, `$workflowDescription`, `$workflowPath`, `$workflowUrl` ja `$executionId` (suorituksen [Suoritushistoria](./execution-history.md) -tunniste — `/workflows/{id}/{executionId}` avaa kyseisen suorituksen canvasilla; käytettävissä vain runtime-ajassa, tyhjä lausekkeen esikatseludialogissa). Tuki kattaa literaalit, aritmeettiset operaatiot, vertailut, [Silmukka](../nodes/loop-node.md)-kontekstin, sisäkkäiset kentät sekä merkkijono- ja taulukkoapufunktiot (mukaan lukien `$text.toJson()` JSON-merkkijonon jäsentämiseen). Kun koko arvo on yksittäinen `$expr`, taustajärjestelmä säilyttää taulukot, oliot, totuusarvot ja numerot alkuperäisinä tietotyyppeinä.

Katso myös [Lausekkeen arviointidialogi](./expression-evaluation-dialog.md), [Globaalit muuttujat](./global-variables.md) ja [Workflown rakenne](./workflow-structure.md).

### [Globaalit muuttujat](./global-variables.md)

Globaali muuttujavarasto sisältää pysyviä, käyttäjäkohtaisia avain-arvo -pareja, jotka säilyvät workflow-suoritusten yli. Muuttujia voidaan luoda [Muuttujat](../tabs/global-variables-tab.md) -välilehdeltä tai [Muuttuja](../nodes/variable-node.md)-solmusta, kun "Tallenna globaaliin muuttujavarastoon" on käytössä. Niihin pääsee käsiksi lausekkeissa muodossa `$global.variableName`; ne voidaan jakaa muiden käyttäjien tai [tiimien](./teams.md) kanssa.

Toimii yhdessä [Muuttuja](../nodes/variable-node.md)-solmun, [Tiimit](./teams.md) ja [Tunnistetietojen jakaminen](./credentials-sharing.md) kanssa jaetun workflow-tilan hallintaan.
### [Lausekkeen arviointidialogi](./expression-evaluation-dialog.md)

Lausekkeen arviointidialogi on laajennettava editori, joka avautuu klikkaamalla laajennuspainiketta lausekekenttien vieressä. Se avautuu suurena keskustetuna modaalina, pitää automaattisen täydennyksen aktiivisena ja päivittää taustajärjestelmän esikatselutuloksen automaattisesti kirjoittamisen tauottua. Objekti- ja taulukkotuloksia voi selata tulospolkujen valitsimen avulla. Dialogi hyväksyy kokonaisen rivin ilman erillistä polkumerkintää (esimerkiksi `myNode.output.field`) ikään kuin se olisi `$myNode.output.field`; katso [Expression DSL](./expression-dsl.md) -säännöt sijoittamiselle.

Työkalurivin **Rakenna tekoälyllä** -painike mahdollistaa halutun lausekkeen kuvailun luonnollisella kielellä. Valitse LLM-[tunnistetiedot](./credentials.md) ja malli, kirjoita kuvaus kuten *"Hae asiakkaan nimi API-vastauksesta"* ja klikkaa Luo. Taustajärjestelmä lähettää [Expression DSL](./expression-dsl.md) -kontekstin ja viimeisimmän suorituksen solmujen tulokset mallille ja palauttaa yksittäisen lausekemerkkijonon. Tulos arvioidaan välittömästi, jotta voit varmistaa sen ennen soveltamista.

Parhaiten soveltuu käytettäväksi yhdessä [Expression DSL](./expression-dsl.md), [Tulos](../nodes/output-node.md) ja [JSON-tulosten yhdistin](../nodes/json-output-mapper-node.md) -solmujen kanssa.

### [Workflown rakenne](./workflow-structure.md)

Workflowt tallennetaan JSON-muodossa solmuineen ja yhteyksineen. Workflow-objekti sisältää tunnisteen, nimen, kuvauksen, solmut, yhteydet ja todennusasetukset. Jokaisella solmulla on tunniste, tyyppi, sijainti ja data (nimi ja tyyppikohtaiset asetukset). Yhteydet liittävät lähde- ja kohdesolmujen tunnisteet valinnaisten kahvojen tunnisteiden kanssa. Lausekkeet data-kentissä noudattavat [Expression DSL](./expression-dsl.md) -syntaksia, ja samaa muotoa käytetään [Lataa & tuo](./download-import.md) -toiminnossa.

Katso myös [Solmutyypit](./node-types.md), [Expression DSL](./expression-dsl.md) ja [Lataa & tuo](./download-import.md).

### [Canvas-ominaisuudet](./canvas-features.md)

Vie hiiri ei-kiinnitetyn canvas-solmun päälle ja klikkaa **Suorita** suorittaaksesi aina kyseiseen solmuun asti. Vaaditut syötteet avautuvat Suorita-paneelissa ensimmäisen kentän kohdistettuna; polut ilman syötteitä alkavat välittömästi. Katso [Suorita solmuun asti](./canvas-features.md#run-to-node).

Workflow-editori tarjoaa Data Pin -toiminnon (kiinnitä solmun viimeisin tulos testataksesi alavirtaa ilman uudelleensuoritusta), Suorituslokit (reaaliaikaiset solmujen tulokset ja agentin edistyminen, jotka täydentävät [Suoritushistoriaa](./execution-history.md)), Käytössä/Ei käytössä (ohita solmut suorituksen aikana) ja Pura alityönkulkuun (siirrä valinta uuteen workflowyn ja korvaa se [Suorita](../nodes/execute-node.md) -solmulla). Käynnissä oleva tuotantosuoritus voidaan avata historiasta tai hallintapaneelin kortista; editori palauttaa sen nykyisen tilannevedoksen, liittää SSE:hen ja pitää canvas-animaation ja virheenjäljityslokit elävänä. [Pikanäppäimet](./keyboard-shortcuts.md) tukevat kopiointia, liittämistä, suorittamista ja solmujen sisäistä hakua.

Katso myös [Pikanäppäimet](./keyboard-shortcuts.md), [Muokkaushistoria](./edit-history.md) ja [Suoritushistoria](./execution-history.md).

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Katso editorin esittely</a></p>

### [Pikanäppäimet](./keyboard-shortcuts.md)

Heym tarjoaa pikanäppäimiä editorin eri osissa: Komentovalikko (Ctrl+K), Suorita (Ctrl+Enter), Tallenna (Ctrl+S), Kumoa/Tee uudelleen ja Esc sulkemiseen. Canvasilla: valitse kaikki, monivalinta, kopioi/leikkaa/liitä, poista, vaihda solmun käyttöön (D), vaihda kiinnitetty data (P) ja solmujen sisäinen haku kirjoittamalla. Pikanäppäimet on dokumentoitu sovelluksen viitteessä ja ne toimivat läheisessä yhteistyössä [Canvas-ominaisuuksien](./canvas-features.md) kuten Data Pin ja solmujen käyttöön/pois -toimintojen kanssa.

Katso myös [Canvas-ominaisuudet](./canvas-features.md), [Pikalipas](./quick-drawer.md) ja [Kontekstuaalinen esittely](./contextual-showcase.md).

### [Tekoälyavustaja](./ai-assistant.md)

Tekoälyavustaja on chat-paneeli, joka avautuu Virheenjäljitys-paneelista ja mahdollistaa workflowjen luomisen tai muokkaamisen luonnollisella kielellä. Valitse [tunnistetiedot](./credentials.md) ja malli, kuvaile sitten mitä haluat; tekoäly lähettää vastauksen virtaavana ja mikä tahansa kelvollinen [workflow JSON](./workflow-structure.md) koodilohkossa jäsennetään automaattisesti ja sovelletaan canvasiin. Äänisyöte on tuettu yhteensopivissa selaimissa.

Ota käyttöön **YOLO-tila** (Agent-tila, oletuksena pois päältä), jolloin avustaja testaa rakentamaansa. Jokaisen muutoksen jälkeen se suorittaa workflown canvasiin, lukee tuloksen ja korjaa workflown kunnes se tekee pyydetyn toimenpiteen, enintään 5 suoritusta viestiä kohden. Se kysyy testisyötteitä ennen ensimmäistä suoritusta, voi suorittaa muita workflowja tarvittaessa ja näyttää jokaisen vaiheen työn edetessä. Katso [Tekoälyavustaja › YOLO-tila](./ai-assistant.md#yolo-mode).

Napsauta **AI** minkä tahansa solmun yläpuolella kankaalla muuttaaksesi tai korjataksesi vain kyseisen solmun. Paneeli näyttää solmun, jota se muuttaa (viimeisimmän tuloksen kera, kun se on suoritettu), ja tarjoaa vaihtoehdot **Change this node as ...**, **Fix error in this node ...** ja **Other**. Vain kyseinen solmu päivitetään; muu workflow ja asettelu pysyvät ennallaan. Katso [AI Assistant › Yhden solmun muuttaminen](./ai-assistant.md#changing-one-node).

Kun workflow tallentaa tietueita, avustaja kysyy minkä [datataulukon](../tabs/datatable-tab.md) käyttää tai luo sellaisen tarvittavine sarakkeineen. Katso [Tekoälyavustaja › Datataulukot](./ai-assistant.md#data-tables).

Kun nykyinen workflow sisältää [Agent Node](../nodes/agent-node.md) -taitoja, avustaja lähettää vain kunkin taidon `SKILL.md` -tiedoston workflown kontekstiin. Liitetyt `.py` -tiedostot ja binaariset taitoresurssit jätetään pois ennen pyyntöä, jotta suuret taitopaketit eivät täytä mallin konteksti-ikkunaa.

Sopii hyvin käytettäväksi yhdessä [Keskustele Heymin kanssa](./chat-with-heym.md), [Agenttien arkkitehtuuri](./agent-architecture.md) ja [Expression DSL](./expression-dsl.md) -toimintojen kanssa.
### [Keskustelu Heymin kanssa](./chat-with-heym.md)

Keskustelu Heymin kanssa on dokumentaatio-otsikkoavustaja tuotekysymyksiin. Se avautuu keskelle sijoitetussa ikkunassa, pitää tunnistetiedot ja mallivalinnan näkyvillä yläreunassa, lisää aktiivisen dokumenttisivun polun kontekstina ja tyhjentää viestihistorian, kun ikkuna suljetaan. Se täydentää laajempaa [Tekoälyavustaja](./ai-assistant.md) -toimintoa ja kevyempää [Kontekstuaalista esittelyä](./contextual-showcase.md).

Katso myös [Tekoälyavustaja](./ai-assistant.md), [Kontekstuaalinen esittely](./contextual-showcase.md) ja [Solmutyypit](./node-types.md).

### [Workflow-järjestely](./workflow-organization.md)

Instanssin ylläpitäjät (`HEYM_ADMIN_EMAILS`) voivat käyttää ja muokata kaikkia workflowja, etsiä omistajan workflowja sähköpostin perusteella, tarkastella aikatauluja ja suoritushistoriaa, keskeyttää ja jatkaa automaattisia triggereitä sekä poistaa workflowt, kun suoritukset ovat valmistuneet. Katso [Instanssin hallinta](../tabs/workflows-tab.md#instance-administration) offboarding-vuon ja eron automaattisten triggereiden keskeyttämisen ja kaikkien kutsujen estämisen välillä.

Workflowt voidaan järjestää kansioihin ja alikansioihin puurakenteessa. Kansioilla on nimet ja valinnainen yläkansio; workflowt liitetään kansioihin. Workflowt voidaan ajoittaa poistettaviksi (siirretään roskakoriin ennen pysyvää poistoa). API tukee workflowjen luomista, päivittämistä, poistamista ja siirtämistä kansioiden välillä, ja sama järjestelymalli näkyy [Workflowt](../tabs/workflows-tab.md) -välilehdessä.

Katso myös [Pikalaatikko](./quick-drawer.md), [Lataus ja tuonti](./download-import.md) ja [Muokkaushistoria](./edit-history.md).

### [Pikalaatikko](./quick-drawer.md)

Pikalaatikko on kiinteä oikean reunan nopean suorituksen paneeli sisäisille ei-canvas-sivuille. Sen avulla voit etsiä [workflowja](../tabs/workflows-tab.md), kiinnittää suosikkeja, valita syötteet, suorittaa välittömästi ja tarkastella edistystä tai tuloksia avaamatta editoria. Workflow, jossa on [File Upload Trigger](../nodes/file-upload-trigger-node.md), ottaa vastaan pudotetun tai valitun tiedoston. Kiinnitysjärjestys ja viimeksi valittu workflow tallennetaan selainta.

Katso myös [Workflow-järjestely](./workflow-organization.md), [Pikanäppäimet](./keyboard-shortcuts.md) ja [Suoritushistoria](./execution-history.md).

### [Kontekstuaalinen esittely](./contextual-showcase.md)

Kontekstuaalinen esittely on kompakti sovelluksen sisäinen opasraide tunnistautuneille pääkäyttöliittymän alueille, kuten hallintapaneelin välilehdille, [Arviointeille](../tabs/evals-tab.md), Dokumentaatiolle ja workflow-editorille. Se pysyy oletuksena suljettuna, tarjoaa ensin lyhyen sivun yhteenvedon, tarjoaa hieman lisätietoja tarvittaessa ja linkittää täydelliseen dokumentaatioartikkeliin, kun haluat syvempää ohjausta.

Toimii yhdessä [Keskustelu Heymin kanssa](./chat-with-heym.md), [Pikalaatikko](./quick-drawer.md) ja [Tekoälyavustaja](./ai-assistant.md) sovelluksen sisäisten ohjausvuon kanssa.

### [Tunnistetiedot](./credentials.md)

Tunnistetiedot tallentavat API-avaimia ja salaisuuksia, joita workflow-solmut käyttävät. Lisää ne [Tunnistetiedot](../tabs/credentials-tab.md) -välilehdessä ja viittaa niihin nimellä tai ID:llä solmuissa, kuten [LLM](../nodes/llm-node.md), [Agenttisolmu](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Lähetä sähköposti](../nodes/send-email-node.md) ja [Redis](../nodes/redis-node.md). Ne on salattu levylle, niitä voidaan jakaa käyttäjien tai [tiimien](./teams.md) kanssa, ja niihin voidaan viitata myös [Expression DSL](./expression-dsl.md) -kielessä `$credentials.Name` -syntaksilla.

Katso myös [Tunnistetiedot](../tabs/credentials-tab.md), [Tunnistetietojen jakaminen](./credentials-sharing.md) ja [Kolmannen osapuolen integraatiot](./integrations.md).

### [Tunnistetietojen jakaminen](./credentials-sharing.md)

Tunnistetietoja voidaan jakaa muiden käyttäjien kanssa sähköpostitse tai tiimien kanssa; kaikki tiimin jäsenet saavat käyttöoikeuden, kun tunnistetiedot jaetaan tiimin kanssa. Jaetut tunnistetiedot näkyvät ilmaisimella [Tunnistetiedot](../tabs/credentials-tab.md) -välilehdessä. Suoritusaikana workflown omistajan kontekstiin yhdistetään omistetut, käyttäjien kesken jaetut ja tiimien kesken jaetut tunnistetiedot. Käytä `$credentials.CredentialName` lausekkeissa tai aseta credentialId solmudatassa.

Katso myös [Tunnistetiedot](./credentials.md), [Tiimit](./teams.md) ja [Kolmannen osapuolen integraatiot](./integrations.md).

### [Tiimit](./teams.md)

Tiimit antavat mahdollisuuden jakaa workflowt, tunnistetiedot, globaalit muuttujat, vektorivarastot ja Drive-tiedostot käyttäjäryhmälle kerralla. Luo tiimejä [Tiimit](../tabs/teams-tab.md) -välilehdestä ja lisää jäseniä sähköpostitse. Jaa resursseja tiimin kanssa asiaankuuluvista jakodialogeista; kaikki jäsenet saavat silloin käyttöoikeuden. Luoja voi muokata ja poistaa tiimin; tiimin poistaminen poistaa kaikki tiimin jaot.

Toimii yhdessä [Tunnistetietojen jakaminen](./credentials-sharing.md), [Globaalit muuttujat](./global-variables.md) ja [Yritys](./enterprise.md) -toimintojen kanssa.

### [Rinnakkaissuoritus](./parallel-execution.md)

Heym suorittaa solmuja rinnakkain, kun niillä ei ole riippuvuuksia toisiinsa. Suoritin rakentaa DAG-kaavion ja suorittaa saman tason solmut rinnakkain säikeistyspoolin avulla; heti kun solmu valmistuu, sen alaspäin suuntautuvat solmut ajastetaan. Käytä [Yhdistä](../nodes/merge-node.md) -solmua rinnakkaisten haarojen yhdistämiseen tarvittaessa. Useat workflow-suoritukset suoritetaan rinnakkain; jokainen suoritus on eristetty. [SSE-suoritus](./sse-streaming.md) -tilassa lähetetään tapahtumia solmujen valmistuessa.

Katso myös [Yhdistä](../nodes/merge-node.md), [Silmukka](../nodes/loop-node.md) ja [Suoritushistoria](./execution-history.md).
### [Agenttien arkkitehtuuri](./agent-architecture.md)

[Agenttisolmu](../nodes/agent-node.md) tukee ala-agenteja (orchestraattori kutsuu muita agenttisolmuja call_sub_agent -komennolla), ala-workflowja (agentti kutsuu muita workflowja call_sub_workflow -komennolla), taitoja (ohjeistussisältö ja Python-työkalut .zip- tai .md-tiedostoista) sekä [MCP](../tabs/mcp-tab.md) -yhteyksiä. Orchestraattorin työkalun suoritin reitittää ala-agentti- ja ala-workflow-kutsut; muut työkalut ohjataan Python-, MCP- tai taitojen suorittimille. Ala-agenttien ja ala-workflowjen maksimipersyvyys on 5. Työkalukutsujen silmukka sisältää automaattisen kontekstin tiivistämisen: ennen jokaista iteraatiota tokenien käyttö arvioidaan, ja jos se ylittää 80 % mallin konteksti-ikkunasta, keskimmäiset viestit tiivistetään käyttäen samaa mallia, säilyttäen järjestelmäkehotteen, ensimmäisen käyttäjäviestin ja viimeisen käyttäjäviestin ennallaan.

Katso myös [Agenttisolmu](../nodes/agent-node.md), [Agenttien pysyvä muisti](./agent-persistent-memory.md), [Ihmisen läsnäolo silmukassa](./human-in-the-loop.md) ja [MCP](../tabs/mcp-tab.md).

### [Agenttien pysyvä muisti](./agent-persistent-memory.md)

Valinnainen [Agenttisolmun](../nodes/agent-node.md) tietämysgraafi, joka tallennetaan Postgres-tietokantaan: entiteetit, tyypit, ominaisuudet ja suunnatut suhteet. Kun `persistentMemoryEnabled` on tosi, graafi tiivistetään järjestelmäkehotteen jokaisella suorituskerralla; onnistuneiden suoritusten jälkeen [LLM](../nodes/llm-node.md) -solmu poimii rakenteelliset päivitykset taustalla. REST CRUD -rajapinta löytyy polusta `/api/workflows/{workflow_id}/nodes/{canvas_node_id}/agent-memory/...`. Muokkain avautuu solmun pinkistä aivo-kuvakkeesta.

Katso myös [Agenttisolmu](../nodes/agent-node.md), [Agenttien arkkitehtuuri](./agent-architecture.md) ja [Suoritukset](../tabs/traces-tab.md).

### [Ihmisen läsnäolo silmukassa](./human-in-the-loop.md)

Ihmisen läsnäolo silmukassa mahdollistaa [Agenttisolmun](../nodes/agent-node.md) pyytää hyväksyntää tietyissä tarkistuspisteissä, luoda julkisen `/review/{token}` -sivun ja odottaa kirjautumattoman arvioijan hyväksyvän, muokkaavan tai hylkäävän Markdown-muotoisen arviointitekstin. HITL-mahdollistetut agentit tarjoavat myös `review` -tulokahvan, jotta voit ilmoittaa [Slack](../nodes/slack-node.md) -kanavalle, [Lähetä sähköposti](../nodes/send-email-node.md) -solmulle tai muille kanaville, kun suoritus on kesken. Solmutason HITL-tekstiä käytetään hyväksyntäohjeistuksena, kun taas julkisen sivun yhteenveto luodaan arviointipyynnöstä itsestään. Kesken olevat suoritukset näkyvät välittömästi [Suoritushistoriassa](./execution-history.md), voivat tapahtua useammin kuin kerran samassa suorituksessa ja jatkavat tallennetusta workflow-tilannevedoksesta, kun jokainen päätös on tehty.

Katso myös [Agenttisolmu](../nodes/agent-node.md), [Portaali](./portal.md), [Suoritushistoria](./execution-history.md) ja [Lähetä sähköposti](../nodes/send-email-node.md).

### [Webhookit](./webhooks.md)

Workflowt voidaan käynnistää [HTTP](../nodes/http-node.md) -solmulla osoitteessa `POST /api/workflows/{workflow_id}/execute` tai suorittaa inkrementaalisesti osoitteesta `POST /api/workflows/{workflow_id}/execute/stream`. Pyynnön runko välitetään [Syöte](../nodes/input-node.md) -solmuille; otsikot ja kyselyparametrit ovat saatavilla [Expression DSL](./expression-dsl.md) -lausekkeissa. Määritä workflowkohtainen autentikointi: anonyymi, JWT tai mukautettu otsake. Valinnaiset vastauksen välimuistointi, rajoitukset ja editorin Suorita cURL:lla -valintaikkuna koskevat molempia suoritustapoja.

Katso myös [Syöte](../nodes/input-node.md), [Suoritustokenit](./execution-tokens.md), [SSE-suoritus](./sse-streaming.md), [HTTP](../nodes/http-node.md) ja [Workflow-rakenne](./workflow-structure.md).

### [Suoritustokenit](./execution-tokens.md)

Suoritustokenit ovat rajattuja JWT:itä, jotka antavat pääsyn yhden workflown suoritus- ja suoritusvirta-endpointteihin. Kun workflow käyttää JWT-autentikointia, tokenit antavat ulkoisille skripteille, CI-putkille ja integraatioille mahdollisuuden kutsua workflowta jakamatta käyttäjäistuntoa. Jokainen token sisältää `wid` -vaatimuksen, joka sitoo sen yhteen workflowhun, `jti` -vaatimuksen, jota käytetään välittömään peruutukseen, ja määritettävän TTL-ajan (60 sekuntia - 10 vuotta). Luo, valitse ja peruuta tokenit suoraan **Suorita cURL:lla** -valintaikkunasta – valittu token upotetaan luotuun komentoon automaattisesti.

Katso myös [Webhookit](./webhooks.md), [Turvallisuus](./security.md) ja [SSE-suoritus](./sse-streaming.md).

### [SSE-suoritus](./sse-streaming.md)

cURL-valintaikkuna voi vaihtaa [webhook](./webhooks.md) -suorituksen Server-Sent Events -tilaan. Tämä tuottaa `execution_started`, `node_start`, `node_complete` ja `execution_complete` -tapahtumat reaaliajassa, lisää `--no-buffer` -lipun luotuun cURL-komentoon ja mahdollistaa solmukohtaisten aloitusviestien, kuten `[START] LLM` tai mukautetun tekstin, määrittämisen ulkoisille terminaalin käyttäjille.

Katso myös [Webhookit](./webhooks.md), [Suoritushistoria](./execution-history.md) ja [LLM](../nodes/llm-node.md).
### [Triggerit](./triggers.md)

Workflowt käynnistyvät trigger-solmujen ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) receive) tai päätepisteiden kautta: [Webhook/API](./webhooks.md), [MCP](../tabs/mcp-tab.md), [Portal](./portal.md), Cron-aikataulutus, Telegram-webhook, Discord-interaktio-webhook, IMAP-triggerin hallinta, RabbitMQ-konsumeri tai Editorin suoritus. Jokaisella triggerillä on oma päätepisteensä tai taustaprosessinsa; [Cron](../nodes/cron-node.md) -solmut suoritetaan 60 sekunnin välein, [Telegram Trigger](../nodes/telegram-trigger-node.md) -solmut vastaanottavat bottien webhookkeja, [Discord Trigger](../nodes/discord-trigger-node.md) -solmut vastaanottavat allekirjoitettuja interaktio-webhookkeja, ja [IMAP Trigger](../nodes/imap-trigger-node.md) -solmut suoritetaan määritetyn kyselyvälin mukaisesti. [Input](../nodes/input-node.md) -solmut vastaanottavat webhook-pyyntöjen rungon, otsikot ja kyselyparametrit.

Katso myös [Solmutyypit](./node-types.md), [Webhookit](./webhooks.md) ja [Rinnakkaissuoritus](./parallel-execution.md).

### [Suoritushistoria](./execution-history.md)

Suoritushistoria tallentaa workflowien ajot: syötteet, tulosteet, solmujen tulokset, tilan ja trigger-lähteen. Siihen pääsee Editorin työkalupalkista, Docs-näkymästä, Dashboardin otsikosta tai [Arvioinnit](../tabs/evals-tab.md) -näkymästä. Workflowikohtainen historia näyttää kyseisen workflowin ajot; kaikkien workflowien historia näyttää suoritukset eri workfloweista ja keskusteluista. Käynnissä olevat suoritukset näkyvät molemmissa ikkunoissa yläosassa **Avaa live**- ja **Peruuta** -toiminnoin. Avaa live liittää editorin olemassa olevaan suoritukseen [SSE](./sse-streaming.md) -yhteyden kautta, palauttaa valmiit solmut, sykkii käynnissä olevia ja odottavia solmuja sekä lisää Debug-lokeja ilman uuden suorituksen käynnistämistä. Siirrä Canvasille lataa valmiin suorituksen syötteet ja solmujen tulosteet uudelleenajoa tai virheenjäljitystä varten; syvälinkki `/workflows/{workflowId}/{executionId}` tukee sekä live- että valmiita suorituksia. [Human-in-the-Loop](./human-in-the-loop.md) -pysäytetyt ajot tallennetaan välittömästi `pending` -tilaan, mukaan lukien julkisen tarkistus-URL:n ja kaikki agentin `review` -haarasta suoritetut ilmoitussolmut. Jos palvelin käynnistyy uudelleen suorituksen aikana, keskeytyneet ajot palautetaan automaattisesti: ne ajetaan uudelleen alusta samoin syöttein ja merkitään valmiiksi (**Palautettu**), mikä voidaan hallita workflowikohtaisella **Palauta ajot automaattisesti** -kytkimellä, joka voi myös tallentaa ne `skipped` -tilaan.

Katso myös [SSE-suoritus](./sse-streaming.md), [Human-in-the-Loop](./human-in-the-loop.md) ja [Jäljitykset](../tabs/traces-tab.md).

### Suorituksen kohokohdat

Live-ajon jälkeen – tai **Siirrä Canvasille** -toiminnon jälkeen – Canvasin oikeaan yläkulmaan ilmestyy hävitettävä **Suorituksen kohokohdat** -ponnahdusikkuna, joka listaa kunkin solmun tuotokset suoritusjärjestyksessä. Se on nopea tapa tarkastella solmukohtaisia tulosteita ilman kunkin solmun avaamista; sulje se **✕** -painikkeella, ja se avautuu uudelleen seuraavalla ajolla. Kohokohdat näkyvät myös dashboardin suorituksissa. Katso lisätietoja kohdasta [Suoritushistoria](./execution-history.md).

### [Muokkaushistoria](./edit-history.md)

Muokkaushistoria seuraa workflowin tallennettuja versioita (jokainen Tallenna luo version). Näytä lista, avaa versio nähdäksesi erot nykyiseen workflowhin verrattuna ([solmut](./workflow-structure.md), yhteydet, asetukset) ja Palauta palauttaaksesi vanhan version. Toisin kuin [Suoritushistoria](./execution-history.md), Muokkaushistoria seuraa rakennemuutoksia, ei ajoja.

Katso myös [Suoritushistoria](./execution-history.md), [Workflow-rakenne](./workflow-structure.md) ja [Canvasin ominaisuudet](./canvas-features.md).

### Virheworkflow

Workflow voi määrittää toisen workflowin suoritettavaksi epäonnistuessaan. Määritä se workflow-tason **Ominaisuudet** -paneelissa (näkyy, kun mitään solmua ei ole valittuna) kohdassa **Virhetilanteessa suorita workflow**. Vain workflowin omistaja voi asettaa, muuttaa tai poistaa sen; katso [Vain omistajan asetukset](./workflow-organization.md#owner-only-settings). Kun päätason suoritus päättyy käsittelemättömään virheeseen, valittu virheworkflow suoritetaan ja saa virhekontekstin (epäonnistuneen workflowin ID ja nimi, suorituksen ID, virheviesti, epäonnistuneen solmun nimi ja tyyppi sekä aikaleima). Jos canvaksessa on jo [Error Handler](../nodes/error-handler-node.md) -solmu, paikallinen käsittelijä saa etusijan eikä virheworkflowia kutsuta. Virheworkflow suoritetaan suoraan, joten se ei koskaan käynnistä omaa virheworkflowiaan.

Se kattaa kaikki ei-testipäätason suoritukset: sekä suorituspäätepisteet, [Portal](./portal.md), että jokaisen triggerin, mukaan lukien [cron](../nodes/cron-node.md), chat-alustojen triggerit, sähköposti, jonot, [MCP](../tabs/mcp-tab.md) ja dashboard-widgetit. Kun [Kuormituksen jakaminen](./cluster.md) on käytössä, tämä pysyy muuttumattomana, mukaan lukien työntekijöiden suorittamat ajot: epäonnistunut solmu palaa tuloksen mukana, ja virheworkflow jaetaan kuten mikä tahansa muu suoritus, joten solmu, jonka on suoritettava pääinstanssilla, tekee niin edelleen. Kaksi tapausta jätetään tarkoituksella pois, koska workflown oma lopputulos ei ole vielä tiedossa: suoritus, jota yksikään instanssi ei koskaan suorittanut, ja odotus, joka aikakatkaistiin, vaikka suoritus saattaa olla vielä käynnissä. Sitä ei myöskään käynnistä manuaaliset canvas-testiajot.
### Workflown aikakatkaisu

Jokainen workflow voi määrittää **workflown aikakatkaisuajan** sekunteina workflow-tason **Properties**-paneelissa. Oletusarvo `0` poistaa rajoituksen käytöstä. Kun aikakatkaisu on asetettu, suoritus keskeytetään seuraavan solmun rajalla ja merkitään epäonnistuneeksi "timed out" -virheellä, jos se ylittää määritetyn ajan. Aikakatkaisu koskee manuaalisia, API:n kautta ja triggereillä käynnistettyjä suorituksia. Pitkät [Wait](../nodes/wait-node.md) -solmut keskeytetään välittömästi sen sijaan, että ne odottaisivat koko määritettyä ajanjaksoa.

### Säästetty aika

Jokainen workflow voi tallentaa **arvioidun aikasäästön per suoritus** (minuutteina), joka määritetään workflow-tason **Properties** -paneelissa. [Analytics](../tabs/analytics-tab.md) -välilehti laskee tämän yhteenlasketun **Säästetty aika** -tilaston valitulla aikavälillä (kunkin workflown estimaatti × sen onnistuneet suoritukset). Eniten käytetyt -listaus näyttää myös tämän summan workflowa kohden; **Not Set** avaa estimaattikentän, kun arvoa ei ole asetettu. [Workflow Analysis](./workflow-analysis.md) -raportti suosittelee estimaatin asettamista, jos sitä ei ole määritetty.

### [Asetukset](./user-settings.md)

Asetusikkunassa (avattava käyttäjäkuvasta otsikossa) on neljä välilehteä: Profiili (Gravatar-kuva, näyttönimi, Käyttäjän säännöt), [Turvallisuus](./security.md) (salasanan vaihto), Ääni ([ElevenLabs TTS/STT](./chat-voice.md)) ja Observability (vain luku -tilassa [OpenTelemetry](./opentelemetry.md) -tila). Käyttäjän säännöt ovat mukautettuja ohjeita, jotka lisätään jokaiseen tekoälypyyntöön, mukaan lukien workflown rakentaja ja [Chat](../tabs/chat-tab.md), joten voit määrittää kielen, sävyn, koodaustyylin tai workflown käytännöt kerralla. Salasanakäytäntö ja [MCP](../tabs/mcp-tab.md) -API-avainten hallinta ovat myös saatavilla.

Katso myös [Turvallisuus](./security.md), [Chat-ääni](./chat-voice.md), [OpenTelemetry-jäljitys](./opentelemetry.md) ja [Tehotekoälyavustaja](./ai-assistant.md).

### [OpenTelemetry-jäljitys](./opentelemetry.md)

Heym voi lähettää OpenTelemetry-jäljityksiä jokaisesta workflown suorituksesta ja solmun toteutuksesta: juurijänne `heym.workflow.execute` per suoritus ja lapsijänne `heym.node.execute` per solmu, jossa mallin ja tokenien käyttö liitetään LLM- ja agenttisolmuihin. Jänteet viedään OTLP/HTTP-protokollalla yhteensopivaan taustajärjestelmään (Jaeger, Grafana Tempo, Honeycomb, Datadog), ja W3C-jäljityskonteksti välitetään sisääntulevien webhookkien, lähtevien HTTP-pyyntöjen ja aliworflowjen välillä. Jäljitys on oletusarvoisesti pois käytöstä ja määritetään `HEYM_OTEL_*` [ympäristömuuttujilla](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md); aktiivinen tila näkyy [Asetukset](./user-settings.md) -ikkunan Observability-välilehdessä.

Katso myös [Suoritushistoria](./execution-history.md), [Jäljitykset](../tabs/traces-tab.md) ja [Webhookit](./webhooks.md).

### [Lataus ja tuonti](./download-import.md)

Vie nykyinen workflow JSON-muodossa Editorin työkalupalkista (Lataa-painike); tiedosto sisältää solmut ja yhteydet. Tuo vetämällä JSON-tiedosto [Workflows](../tabs/workflows-tab.md) -välilehdelle (luo uuden workflown) tai canvasille (korvaa tai yhdistää). JSON-tiedoston on sisällettävä solmutaulukko; nimi ja yhteydet ovat valinnaisia. Käytä sitä varmuuskopiointiin, jakamiseen tai siirtämiseen eri instanssien välillä.

Katso myös [Workflown rakenne](./workflow-structure.md), [Workflowt](../tabs/workflows-tab.md) ja [Canvasin ominaisuudet](./canvas-features.md).

### [Portaali](./portal.md)

Portaali tarjoaa workflowt julkisina chat-käyttöliittyminä osoitteessa `/chat/{slug}`. Määritä portal_enabled, slug, valinnainen autentikointi (portaalin käyttäjät), suoratoisto ja tiedostojen lähetys workflowa kohden. Lopulliset käyttäjät voivat käyttää chat-käyttöliittymää kirjautumatta Heymiin; kuvatulosteet voidaan näyttää chatissa. Portaalin workflowt voivat myös ohjata [Human-in-the-Loop](./human-in-the-loop.md) -tarkistussivuille, kun [Agent Node](../nodes/agent-node.md) vaatii hyväksynnän, kun taas agentin `review`-haara lähettää ilmoituksia muille kanaville. Käytä sitä sisäisiin työkaluihin, asiakasläheisiin chatbotteihin ja tekoälyllä tehostettuihin lomakkeisiin.

Katso myös [Human-in-the-Loop](./human-in-the-loop.md), [Agenttisolmu](../nodes/agent-node.md) ja [Drive](./drive.md).

### [Tiedostojen luonti](./file-generation.md)

Taidot voivat luoda tiedostoja, kuten PDF, DOCX, CSV, JSON ja kuvia suorituksen aikana kirjoittamalla `_OUTPUT_DIR` -työtilaan. Heym tallentaa nämä tiedostot automaattisesti, säilöö ne ja tarjoaa latausmetatiedot `_generated_files` -kohdassa, joita voidaan hallita [Drive-solmun](../nodes/drive-node.md) avulla tai tarkistaa [Drive](../tabs/drive-tab.md) -välilehdeltä.

Katso myös [Agenttisolmu](../nodes/agent-node.md), [Drive](./drive.md) ja [Drive-solmu](../nodes/drive-node.md).

### [Drive](./drive.md)

Drive on jaettu tallennus- ja jakokerros taidoilla luoduille tiedostoille. Sen avulla voit selata tiedostoja, luoda julkisia tai salasanasuojattuja linkkejä, asettaa vanhenemis- ja latausrajoituksia, jakaa tiedostoja vain luku -tilassa tiimeillesi sekä hallita näitä tiedostoja ohjelmallisesti [Drive-solmun](../nodes/drive-node.md) avulla tai manuaalisesti [Drive](../tabs/drive-tab.md) -välilehdeltä.

Katso myös [Drive](../tabs/drive-tab.md), [Tiedostojen luonti](./file-generation.md) ja [Portaali](./portal.md).
### [Turvallisuus](./security.md)

Heym pakottaa salasanakäytäntöön (pituus, isoja ja pieniä kirjaimia, numero), tallentaa käyttöoikeustiedot HttpOnly-evästeisiin ja kiertää virkistystunnuksia käytön yhteydessä. Nopeusrajoitukset koskevat kirjautumista, rekisteröitymistä ja [Portal](./portal.md)-kirjautumista. [Tunnistetiedot](./credentials.md) salataan levylle AES-256 (Fernet) -algoritmilla. [MCP](../tabs/mcp-tab.md) API-avainta käytetään asiakastunnistukseen; sisältöturvallisuus on saatavilla [Guardrails](./guardrails.md) -ominaisuuden kautta [LLM](../nodes/llm-node.md)- ja [Agent Node](../nodes/agent-node.md) -solmuissa. [Execution Tokens](./execution-tokens.md) tarjoavat workflowskohtaisia JWT-tunnuksia ulkopuolisille kutsuille.

Katso myös [Execution Tokens](./execution-tokens.md), [Guardrails](./guardrails.md), [Portal](./portal.md) ja [Tunnistetiedot](./credentials.md).

### [Kertakirjautuminen (SSO)](./sso.md)

Heym todentaa käyttäjät minkä tahansa ulkoisen OpenID Connect -palveluntarjoajan (Keycloak, Okta, Entra ID, Auth0, Google) kautta, jotka määritetään käynnistyksen yhteydessä kohdassa **Asetukset → SSO** `HEYM_ADMIN_EMAILS`-listalla määritetyn järjestelmänvalvojan toimesta. Vain palveluntarjoajan URL ja asiakastiedot syötetään; kaikki päätepisteet haetaan palveluntarjoajan löytöasiakirjasta, joten yksittäistä palveluntarjoajaa ei ole kovakoodattu. Kirjautuminen käyttää Authorization Code -menetelmää PKCE:llä, ja ID-tunnistetta vahvistetaan palveluntarjoajan julkaisemien avainten avulla. Tilit yhdistetään `(palveluntarjoaja, aihe)`-parin ja vahvistetun sähköpostin perusteella, ja automaattinen tilinluonti voidaan rajoittaa sallittujen sähköpostiverkkotunnusten luetteloon. Salasanakirjautuminen säilyy käytettävissä SSO:n rinnalla ja voidaan poistaa käytöstä, kun yhteyden testaus onnistuu, mutta `HEYM_ADMIN_EMAILS`-tilien kirjautuminen säilyy aina mahdollisena estääkseen virheellisesti määritetyn palveluntarjoajan aiheuttaman lukituksen.

Katso myös [Asetukset](./user-settings.md), [Turvallisuus](./security.md) ja [Tarkistusloki](./audit.md).

### [Kuormituksen jakaminen](./cluster.md)

Jos osoitat toisen Heym-instanssin samaan tietokantaan, se liittyy työntekijäinstanssiksi. Taustatehtävät - cron, webhookit, MCP-työkalukutsut, chat-käynnistykset - jaetaan instanssien välillä prosenttiosuuksin, jotka järjestelmänvalvoja määrittää kohdassa **Asetukset → Instanssit**. Kunkin instanssin tila, tietokantaviive ja versio näkyvät yhdessä taulukossa. Instanssit eivät koskaan kommunikoi keskenään: Postgres hoitaa työnjaon, joten työntekijäinstanssi ei tarvitse avoimia portteja tai reittiä takaisin pääinstanssiin. Paikallisiin tiedostoihin, koodausagentin työtilaan tai asennettuun liitännäiseen koskevat tehtävät suoritetaan aina pääinstanssilla, ja hallintapaneeli näyttää, kuinka suuri osa viimeisestä 24 tunnista tämä oli, jotta operaattori näkee, milloin prosenttiosuudet eivät auta. Jokainen suoritus historiassa nimeää sen instanssin, joka sen suoritti, ja molemmat historiadialogit voivat suodattaa tämän perusteella.

Katso myös [Asetukset](./user-settings.md), [Suoritukset](../tabs/traces-tab.md) ja [Analytiikka](../tabs/analytics-tab.md).

### [Kolmannen osapuolen integraatiot](./integrations.md)

Heym yhdistää ulkoisiin palveluihin [Tunnistetiedot](../tabs/credentials-tab.md) -välilehdellä tallennettujen tunnistetietojen avulla (salattuna levylle). Tuetut tyypit sisältävät OpenAI, Google, Decision Model [Decision node](../nodes/decision-node.md) -solmua varten, Model Router automaattista mallivalintaa varten (katso alla), GitHub [GitHub node](../nodes/github-node.md) - ja MCP-integraatioita varten, Jira [Jira node](../nodes/jira-node.md) -solmua varten, Notion [Notion node](../nodes/notion-node.md) -solmua varten, Custom LLM, Cohere, RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, [Grist](../nodes/grist-node.md), SMTP [Send Email](../nodes/send-email-node.md) -solmua varten, [RabbitMQ](../nodes/rabbitmq-node.md), [Redis](../nodes/redis-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), Bearer, Header ja FlareSolverr [Crawler](../nodes/crawler-node.md) -solmua varten. Jokainen tyyppi dokumentoi vaaditut kentät; tunnistetietoja voidaan jakaa käyttäjien tai [tiimien](./teams.md) kesken, ja niihin voidaan viitata nimellä solmuissa tai lausekkeissa muodossa `$credentials.Name`.

### Model Router (Automaattimalli)

**Model Router** -tunnistetieto valitsee mallin kutsu kerrallaan sen sijaan, että se säilyttäisi kiinteän avaimen. Se tallentaa decision model -tunnistetiedon sekä listan olemassa olevista OpenAI/Google/Custom -tunnistetiedoistasi, joista jokaisella on kriteerit, jotka määrittävät, milloin sitä tulisi käyttää, ja se näkyy jokaisessa mallinvalitsimessa yhden mallin (**Auto**) kanssa.

Suoritukset, canvasin Execution Log ja Span View näyttävät molemmat osat valinnasta, esimerkiksi `Auto Model / GPT-5`, kun taas kustannukset pysyvät attribuoituna käytettyyn malliin. Auto Modelia ei voi yhdistää Responses APIin, Batch-tilaan tai kuvien tuotantoon. Katso [Tunnistetiedot](./credentials.md) täydellistä toimintaa varten.

Katso myös [Tunnistetiedot](./credentials.md), [Tunnistetietojen jakaminen](./credentials-sharing.md) ja [Tiimit](./teams.md).

### [Guardrails](./guardrails.md)

Guardrails estävät turvattomat tai ei-toivotut käyttäjäviestit ennen kuin ne pääsevät [LLM](../nodes/llm-node.md)- tai [Agent Node](../nodes/agent-node.md) -solmuun. Ominaisuus otetaan käyttöön solmukohtaisesti, ja valittavissa on estettävät kategoriat (esim. väkivalta, vihapuhe, seksuaalinen sisältö, itsensä vahingoittaminen, häirintä, laiton toiminta). Herkkyys voidaan asettaa (matala, keskitaso, korkea). Kun ominaisuus laukeaa, solmu aiheuttaa virheen, jonka voi käsitellä [Error Handler](../nodes/error-handler-node.md) -solmulla. Tunnistus käyttää palveluntarjoajan moderointi-APIa tai LLM-luokittelua tunnistetietotyypistä riippuen.

Katso myös [Turvallisuus](./security.md), [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) ja [Error Handler](../nodes/error-handler-node.md).
### [Enterprise](./enterprise.md)

Enterprise kattaa kaupallisen lisenssitoiminnan, ammattitaitoisen tuen ja käyttöönottopalvelut tiimeille, jotka käyttävät Heymiä tuotantoympäristössä. Se sisältää workflow-arkkitehtuuriopastuksen, käyttöönottoavustuksen, Kubernetes- ja skaalausohjeistuksen, prioriteettituen sekä räätälöityjä kehityspalveluita edistyneille ominaisuuksille kuten [Agent Node](../nodes/agent-node.md), [Human-in-the-Loop](./human-in-the-loop.md), [Parallel Execution](./parallel-execution.md) ja [Portal](./portal.md).

Katso myös [Running & Deployment](../getting-started/running-and-deployment.md), [Security](./security.md) ja [Teams](./teams.md).

### [Heym Work](./heym-work.md)

Heym Work on Heymin päälle rakennettu toinen käyttöliittymä liiketoimintatiimeille. Käyttäjät kuvailevat tehtävän, vastaavat muutamaan kysymykseen ja saavat testatun workflown, minkä jälkeen he työskentelevät sivuilta, hyväksynnöistä ja Aktiviteetti-listasta, jossa jokaisella suorituksella on nimi. Instanssin ylläpitäjät yhdistävät sen kohdassa **Asetukset → Heym Work** antamalla sen osoitteen ja integraatioavaimen; sillä on oma Heym-tiimin myöntämä lisenssi.

Katso myös [Enterprise](./enterprise.md), [Single Sign-On](./sso.md) ja [Human-in-the-Loop](./human-in-the-loop.md).

---

## Dashboard-välilehdet

### [Workflows](../tabs/workflows-tab.md)

Workflows-välilehti on oletusnäkymä dashboardissa. Se näyttää kaksiosaisen listauksen: vasemmalla workflowt ja kansiot tiiviinä riveinä, oikealla valitun workflown esikatselu sen triggerin, viimeisimmän suorituksen ja vaiheiden kanssa sekä Open Workflow ja Run Now -toiminnot. Jokaisella rivillä on statustagi (Running, Scheduled, Listening, Paused, API, SubWorker, Portal, Manual, Remove Scheduled), jota Status-pudotusvalikolla voi suodattaa. Workflow, jossa ei ole trigger-solmua, merkitään sen viimeisimmän suorituksen aloitusperusteella - API HTTP-kutsulle, SubWorker yläworkflowlle, Portal julkiselle chatille - ja pysyy Manual-tilassa, kunnes se on suoritettu. Kansiot ja alikansiot hoitavat [organisoinnin](./workflow-organization.md). Uusia workflowja luodaan New Workflow -toiminnolla, JSON-tiedostoja voi raahata ja pudottaa [tuodakseen](./download-import.md), ja muokkaus- tai poistotoiminnot ovat rivitoiminnoissa. Workflowja voi siirtää kansioiden välillä; poistaminen ajoitetaan (roskakori) ennen pysyvää poistoa.

Katso myös [Workflow Organization](./workflow-organization.md), [Download & Import](./download-import.md) ja [Quick Drawer](./quick-drawer.md).

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Katso Workflows-esittely</a></p>

### [Board](../tabs/board-tab.md)

Agenttipohjainen kanban-taulu, jossa kortit ovat pysyviä tehtäviä. Jokainen sarake määritetään järjestetyllä workflow-ketjulla; kortin siirtäminen sarakkeeseen suorittaa ketjun kortin täydellä kontekstilla (sisältö, kommentit, historia, edelliset tulokset). Tulokset kirjoitetaan takaisin kortille - vihreä onnistuneelle, punainen epäonnistuneelle, keltaista käynnissä olevalle. Seuraavat kierrokset suorittavat nykyisen sarakkeen ketjun uudelleen kaikella tähän mennessä kertyneellä datalla, mikä mahdollistaa iteratiivisen suunnittelun. Suoritukset tallennetaan [Execution History](./execution-history.md) -historiaan `board`-triggersijainnilla. Kun kortin suoritus on aktiivinen, **Open live** avaa kyseisen suorituksen animoidulle canvasille inkrementaalisine Debug-lokeineen.

Katso myös [Workflows](../tabs/workflows-tab.md), [Execution History](./execution-history.md) ja [Human-in-the-Loop](./human-in-the-loop.md).

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Katso Board-esittely</a></p>
-->

### [Templates](../tabs/templates-tab.md)

Templates-välilehdellä voit tallentaa ja käyttää uudelleen workflow-malleja (kokonaisia workflowja) ja solmumalleja (yksittäisiä konfiguroituja solmuja). Workflow-malleja luodaan editorista (Share as Template) ja solmumalleja napsauttamalla solmua hiiren kakkospainikkeella. Selaa näkyvyyden mukaan (Everyone tai Specific users/[teams](./teams.md)), käytä mallia uuden workflown luomiseen tai solmun lisäämiseen canvasille, ja hallinnoi jaettuja mallejasi.

Katso myös [Workflows](../tabs/workflows-tab.md), [Teams](./teams.md) ja [Canvas Features](./canvas-features.md).

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Katso Templates-esittely</a></p>

### [Variables](../tabs/global-variables-tab.md)

Variables-välilehti hallinnoi [Global Variable Store](./global-variables.md) -globaalimuuttujakirjastoa. Luo, muokkaa ja poista globaaleja muuttujia; aseta nimi, arvo ja arvotyyppi (Auto, String, Number, Boolean, Array, Object). Muuttujat ovat käyttäjäkohtaisia ja säilyvät suoritusten yli. Viittaa niihin missä tahansa workflow-[expression](./expression-dsl.md) -lausekkeessa muodossa `$global.variableName`. Muuttujia voidaan jakaa muiden käyttäjien tai [teams](./teams.md) -tiimien kanssa.

Katso myös [Global Variables](./global-variables.md), [Variable](../nodes/variable-node.md) ja [Expression DSL](./expression-dsl.md).

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Katso Variables-esittely</a></p>
### [Keskustelu](../tabs/chat-tab.md)

Keskustelu-välilehti on Heymin pitkäaikainen agenttipinta, jossa työtilaa voidaan hallita keskustelun kautta. Valitse [tunnistetiedot](./credentials.md) ja malli, ja pyydä Keskustelua vastaamaan kysymyksiin, tarkastelemaan workflow-määritelmiä, suorittamaan olemassa olevia workflowja, tiivistämään suorituksia ja aikatauluja, raportoimaan yksittäisen workflown suoritushistoriaa (suoritusmäärä, tilajakauma, viimeisin suoritus ja yhden suorituksen tiedot pyynnöstä), raportoimaan, mitkä suoritukset ovat meneillään (kuluva aika, nykyinen solmu ja linkki jokaiseen live-suoritukseen), ratkaisemaan odottavia ihmisten tarkistuksia, luomaan ja muokkaamaan workflowja samalla AI Builder -moottorilla, jota käytetään editorissa, tai lisäämään kortteja kanban-tauluille luonnollisella kielellä. Uudet kortit alkavat aina valitun taulun ensimmäisestä sarakkeesta; kun useita tauluja on saatavilla eikä yhtäkään ole nimetty, Keskustelu esittää taulun valinnan ennen kortin luomista.

Keskustelu jatkaa toimintaansa taustalla selainikkunan sulkeuduttakin. Kun vastaus virtaa, voit lähettää lisää viestejä; Heym tallentaa ne tietokantaan perustuvaan jonoon, sallii jonossa olevien viestien muokkaamisen tai poistamisen ennen niiden alkamista ja suorittaa ne järjestyksessä, kun nykyinen vastaus päättyy. Jos avustaja tarvitsee suunnittelutietoja ja palauttaa selvennyskysymyksiä, jono keskeytyy, kunnes vastaat näihin kysymyksiin, ja jatkuu suunnitteluvastauksen jälkeen.

Vastaukset virtaavat markdown-muodossa, sisältäen upotetut kuvat, workflow-esikatselukortit, taittuvat työkutsu-kortit, kontekstinkäytön ja automaattisen kontekstin tiivistämisen. Keskustelu tukee liitteitä, äänisyötettä, ääneen luettavaa toistoa, kopiointitoimintoja, pikakehotuksia, käyttäjäsääntöjä [Asetuksista](./user-settings.md) ja [globaaleja muuttujia](./global-variables.md) kontekstina.

Katso myös [AI-avustaja](./ai-assistant.md), [Tunnistetiedot](./credentials.md) ja [Asetukset](./user-settings.md).

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Katso Keskustelu-esittely</a></p>

### [Tunnistetiedot](../tabs/credentials-tab.md)

Tunnistetiedot-välilehti hallinnoi solmujen käyttämiä API-avaimia ja salaisuuksia. Lisää tunnistetietoja tyypin mukaan (OpenAI, Google, Custom, Bearer, Header, [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), SMTP, [Redis](../nodes/redis-node.md), RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, Cohere jne.), nimeä ne ja viittaa niihin workflow-solmuissa. Muokkaa tai poista kortista; jaa käyttäjien kanssa sähköpostitse tai [tiimien](./teams.md) kanssa. Kaikki arvot salataan levylle ja peitetään käyttöliittymässä.

Katso myös [Tunnistetiedot](./credentials.md), [Tunnistetietojen jakaminen](./credentials-sharing.md) ja [Kolmannen osapuolen integraatiot](./integrations.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Katso Tunnistetiedot-esittely</a></p>

### [Vektorivarastot](../tabs/vectorstores-tab.md)

Vektorivarastot-välilehti hallinnoi [RAG](../nodes/rag-node.md) -solmujen käyttämiä vektorivarastoja. Luo varasto nimellä ja vektorivaraston [tunnistetiedoilla](./credentials.md) — *RAG: Qdrant + OpenAI* (ulkoinen Qdrant) tai *RAG: Psql + OpenAI* (Heymin oma Postgres pgvectorin kautta), joka määrittää varaston taustajärjestelmän — valinnaisesti aseta kokoelman nimi, lataa sitten dokumentteja (PDF, TXT jne.). Hallitse sisältöä (näytä, poista lähteet), muokkaa varaston tietoja ja jaa varastot käyttäjien kanssa. [RAG](../nodes/rag-node.md) -solmussa valitse tietokanta, valitse vektorivarasto ja suorita lisäys, päivitys, poisto tai hakutoiminnot.

Katso myös [Qdrant RAG](../nodes/rag-node.md), [Tunnistetiedot](./credentials.md) ja [Tiimit](./teams.md).

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Katso Vektorivarastot-esittely</a></p>
### [MCP](../tabs/mcp-tab.md)

MCP-välilehdellä määritetään Model Context Protocol -integraatio. Heym tukee kahta toimintatapaa:

**Oletuspalvelin** – Yksi päätepiste osoitteessa `/api/mcp/sse` tarjoaa kaikki MCP-käyttöön otetut workflowt. Voit tarkastella ja uusia API-avaintasi, kopioida valmiin asiakas-JSONin, yhdistää Cursorin yhdellä napsautuksella tai seurata Claude-asetusprosessia, joka sisältää automaattisen OAuth-rekisteröinnin.

**Nimetyt palvelimet** – Luo useita erillisiä MCP-päätepisteitä, joilla jokaisella on oma UUID-pohjainen URL-osoite (`/api/mcp/servers/{uuid}/sse`) ja itsenäinen API-avain. Määritä tietyt workflowt kullekin palvelimelle, jotta eri tekoälyasiakkaat tai tiimit näkevät vain heille tarvittavat työkalut. Jokainen nimetyistä palvelimista tukee samoja todennusmenetelmiä (API-avain, Claude OAuth) ja sisältää omat Kopioi JSON ja Lisää Cursoriin -pikavalinnat. Molemmat päätepisteet tukevat SSE-kuljetusta (GET) ja Streamable HTTP -kuljetusta (POST). Workflown kytkeminen päälle/pois nimetyllä palvelimella siirtää sen määritetyn listan alkuun, jotta muutettu rivi pysyy näkyvillä.

**Heym-keskustelutyökalu** – Kumpikin toimintatapa voi myös tarjota [Keskustelu](../tabs/chat-tab.md)-moottorin yksittäisenä `heym_chat` -työkaluna, joka voidaan kytkeä päälle/pois kullakin käyttöliittymällä omilla LLM-tunnistetiedoillaan ja mallillaan (esivalittuna asetuksissasi määritetystä ensisijaisesta mallista [Asetukset](./user-settings.md)). MCP-asiakas lähettää yhden luonnollisen kielen `message`-viestin, ja moottori hoitaa loput: workflowjen rakentaminen rakennustilassa (tallennus, koeajo enintään viisi kertaa, korjaus ja vahvistus), workflowjen suorittaminen, analytiikka, suoritukset, live-tilanne, aikataulut, taulut ja kortit, tiimit, globaalit muuttujat, dokumenttihaku sekä ihmisen tekemät päätökset. Myöhemmin Keskusteluun lisätyt ominaisuudet ovat saatavilla saman työkalun kautta ilman ylimääräistä rekisteröintiä. Jokainen kutsu tallennetaan Keskustelu-välilehden historiaan plug-merkitynä keskusteluna ja palauttaa `conversation_id`-tunnisteen, jonka asiakas voi välittää takaisin keskustelun jatkamiseksi.

Katso myös [Agenttien arkkitehtuuri](./agent-architecture.md), [Agenttisolmu](../nodes/agent-node.md) ja [SSE-suoratoisto](./sse-streaming.md).

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Katso MCP-esittely</a></p>

### [Suoritukset](../tabs/traces-tab.md)

Suoritukset-välilehdessä näkyvät [LLM](../nodes/llm-node.md)-suoritusten jäljet. Listan yläpuolella oleva tilasto-otsikko tiivistää valitun aikavälin KPI-korteilla (Kutsut, Tokenit, Kustannus, Keskimääräinen viive, Virheprosentti) sekä kolmella kaaviolla – Tokenit mallin mukaan, Kustannus mallin mukaan ja Kutsut ajan kuluessa (onnistuneet vs. virheet pinottuna). Yksi **Aikaväli** -valitsin (1h / 24h / 7d / 30d / Kaikki; oletus 7 päivää) suodattaa sekä kaaviot että listan yhdessä. Kustannus lasketaan käyttäjäkohtaisesta [LLM-kustannustaulukosta](../tabs/datatable-tab.md#llm-cost-table-system-table); hinnoittelemattomat mallit näkyvät sisäisenä varoituksena, joka linkittää kyseiseen taulukkoon. Avaa mikä tahansa jälki nähdäksesi pyynnön ja vastauksen payloadit, aikajakson erittelyn (llm_ms, tools_ms, mcp_list_ms), työkutsut (nimi, argumentit, tulos) sekä sisältyvät taidot. Laajennetut tapahtumat näyttävät JSONin – mukaan lukien MCP- ja JSON-RPC-payloadit – tiivistettynä puuna, jossa ensimmäinen taso on oletuksena auki; **Puu / Raaka** -vaihtoehto palauttaa alkuperäisen tekstin ja virheellinen JSON pysyy luettavana. Käytä jälkiä [Agenttisolmun](../nodes/agent-node.md) ja [LLM](../nodes/llm-node.md)-käyttäytymisen virheenkorjaukseen sekä payloadien kopiointiin tai vientiin.

Katso myös [Suoritushistoria](./execution-history.md), [Agenttisolmu](../nodes/agent-node.md) ja [LLM](../nodes/llm-node.md).

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Katso Suoritukset-esittely</a></p>
### [Hälytykset](../tabs/alerts-tab.md)

Hälytysten välilehti määrittää kynnysarvoja tietyn ajanjakson yli ja ilmoittaa, kun ne ylitetään. Neljä hälytystyyppiä vastaa käytännön kysymyksiin, joita operaattorit todella esittävät: **virhekynnys** (epäonnistuiko tämä yli N kertaa annetulla aikavälillä), **workflown kesto** (hidastuivatko suoritukset, mitattuna maksimi-, keski- tai p95-arvoina), **token / USD-kustannus** (ylittikö käyttö budjetin, laskettuna saman hinnoittelutaulukon mukaisesti kuin [Suoritukset](../tabs/traces-tab.md)) ja **suoritusmäärä** (suoritettiinko tätä huomattavasti useammin kuin pitäisi). Jokainen tyyppi arvioidaan valitsemallasi aikavälillä, koska yksittäinen epäonnistunut suoritus on kohinaa, kunnes toistuva virhe muuttuu ongelmaksi. Hälytykset voivat tarkkailla yhtä workflowta tai kaikkia käyttöoikeuksiin kuuluvia workflowja.

Viisivaiheinen ohjattu toiminto opastaa tyypin, laajuuden, ehdon, vastauksen ja tarkistuksen valinnassa. Tarkistusvaihe **testaa ehdon jälkikäteen** ja raportoi, kuinka usein se olisi lauennut viimeisen 24 tunnin tai 7 päivän aikana, joten liian alhainen kynnysarvo huomataan ennen tallennusta eikä vasta hälytyksen laukeamisen jälkeen. Kuvaile haluttu toiminto luonnollisella kielellä, ja tekoäly täyttää kaikki mahdolliset kohdat ja merkitsee arvauksensa; osittainenkin pyyntö etenee ohjatussa toiminnossa, joka avautuu ensimmäiseen päätöstä vaativaan vaiheeseen sen sijaan, että joutuisi aloittamaan alusta. Oletusarvoisesti hälytys laukeaa kerran ja pysyy hiljaisena, kunnes mittari palautuu normaalitilaan; vaihtoehtoisesti se voidaan määrittää toistumaan tietyin väliajoin.

Vastausvaiheessa hälytys voi luoda ja määrittää uuden workflown suoritettavaksi laukeamisen yhteydessä, käyttää jo olemassa olevaa workflowta tai olla tekemättä mitään. Laukaisun yhteydessä lähetetty payload sisältää havaittujen arvojen, kynnysarvojen, aikavälin ja hälytykseen vaikuttaneiden workflowjen tiedot, joiden avulla hälytykset voidaan ohjata esimerkiksi Slackiin, sähköpostiin tai Telegramiin käyttämällä jo olemassa olevia solmuja. Laukaisuhistoria tallentaa kunkin hälytyksen tilanteen laukeamishetkellä ja säilyttää tiedot 90 päivää; hälytyksen merkitseminen käsitellyksi muuttaa sen tilan "Laukaistu"-merkinnästä "Käsitelty"-tilaan ilman, että ehto olisi täyttynyt. [Keskustelu](../tabs/chat-tab.md) -välilehdeltä voi tiedustella olemassa olevia hälytyksiä sekä niiden laukeamisen syitä ja aikoja. Hälytyksiä voidaan jakaa käyttäjien ja [tiimien](../tabs/teams-tab.md) kesken.

Katso myös [Analytiikka](../tabs/analytics-tab.md), [Suoritukset](../tabs/traces-tab.md) ja [Suoritushistoria](./execution-history.md).

### [Analytiikka](../tabs/analytics-tab.md)

Analytiikka-välilehti näyttää suoritusmittareita ja trendejä. Yhteenvetotilastot sisältävät suoritusmäärän, onnistumisprosentin, virheprosentin, viivejakauman ja **Säästetty aika** -summan (kunkin workflown arvioitu minuuttimäärä säästöä per suoritus × onnistuneet suoritukset). Eniten käytetyt -lista näyttää saman summan workflowittain. Valitse perusaikaväli (24 h, 7 d, 30 d tai kaikki), suodata tarvittaessa workflowittain ja raahaa kaavioon tarkastellaksesi valittua aikaväliä. Kaaviot ja workflowtaulukot päivittyvät valinnan mukaisesti, ja automaattipäivitys pitää mittareita ajantasaisina. Se täydentää [Suoritushistoriaa](./execution-history.md) ja [Aikataulutettuja](../tabs/scheduled-tab.md) näkymiä, kun tarvitaan sekä menneitä tuloksia että tulevia suorituksia.

Katso myös [Suoritushistoria](./execution-history.md), [Aikataulutetut](../tabs/scheduled-tab.md) ja [Arvioinnit](../tabs/evals-tab.md).

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Katso analytiikkademo</a></p>

### [Kojetaulu](../tabs/dashboard-tab.md)

Kojetaulu-välilehti on Grafana-tyylinen tila, jossa rakennetaan ruudukko kaavio- ja widget-elementeistä, joista jokainen renderöidään oman piilotetun Heym-workflown avulla. Voit säilyttää niin monta kojetaulua kuin tarvitset ja jakaa ne käyttäjien tai tiimien kanssa joko vain luettavina tai muokattavina; widgetit suoritetaan aina omistajan tunnistetiedoilla, joten kaikki näkevät saman datan. Kuvaile mittari luonnollisella kielellä, ja tekoäly luo widgetin, tai lisää se manuaalisesti ja valitse kaaviotyyppi, jota esikatsellaan näytteistetyn datan avulla: pylväs-, viiva-, alue-, ympyrä-, taulukko-, numeerinen, mittari-, piste-, osuus-, pylväsmittari-, teksti- tai HITL-tyyppi. HITL on kiertonäyttö odottavista ihmisten tekemistä tarkistuksista. Otsikko näyttää `1/n odottaa`. Workflown nimi avaa kyseisen suorituksen canvaksella. **Hyväksy**, **Pyydä muutoksia** ja **Hylkää** -toiminnot ratkaisevat sen, ja widgetin otsikon vieressä oleva historia-ikoni avaa kyseisen suorituksen historiaikkunassa samalla sivulla. Widgetit välimuistivat tuloksensa, niitä voidaan hienosäätää tekoälyllä (jokainen muutos tallennetaan [Muokkaushistoriaan](./edit-history.md)), kloonata yhdessä täydellisen workflownsa kanssa, järjestellä uudelleen Tidy up -toiminnolla sekä siirtää ja muuttaa kokoa muokkaustilassa. Taulukot voivat näyttää tilatunnisteita ja linkittää rivinsä yksityiskohtaiseen kojelautaan, joka lukee napsautetun rivin tietueen muodossa `$page.record`, ja Run-widget suorittaa workflown kojelaudalta: pudotetulle tiedostolle, syötekentillään tai Suorita-painikkeella. Koska jokainen widget on workflow, mikä tahansa data, jonka voi hakea — [HTTP](../nodes/http-node.md) -kutsu, [BigQuery](../nodes/bigquery-node.md) -kysely, [RAG](../nodes/rag-node.md) -haku tai [LLM](../nodes/llm-node.md) -tulos — voidaan muuttaa kaavioksi. HITL-widgetin asetukset voivat rajata sen yhden workflown tarkistuksiin tai siinä olevaan agentin tai Slack-hyväksyntävaiheeseen; tällainen widget näyttää ne kaikille, jotka voivat avata kyseisen workflown, ja on piilotettu kaikilta, jotka eivät voi.

Katso myös [Kaaviotulosolmu](../nodes/chart-output-node.md), [Analytiikka](../tabs/analytics-tab.md) ja [Suoritushistoria](./execution-history.md).

<video src="/features/showcase/dashboard.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/dashboard.webm">▶ Katso kojetauludemoa</a></p>
### [Arvioinnit](../tabs/evals-tab.md)

Arvioinnit-välilehti (osoitteessa `/evals`) mahdollistaa evaluointijoukkojen luomisen, testitapausten lisäämisen tai generoimisen, joukon promtin optimoinnin sekä evaluointien suorittamisen [Agent-solmun](../nodes/agent-node.md) workfloweihin. Valitse yksi tai useampi malli, määritä pisteytysmenetelmä (Exact Match, Contains tai LLM-as-Judge), anna tarvittaessa erillisen mallin tai [Päätössolmun](../nodes/decision-node.md) arvioida LLM-as-Judge -vastaukset, aseta suoritukset per testi (sekä lämpötila ja päättelyvaativuus Exact Match- ja Contains -menetelmiä varten), ja vertaa läpäisy-/hylkäysasteita sekä mallikohtaisia tuloksia. Tarkastele suoritushistoriaa aiemmista evaluoinneista, mukaan lukien käytetty arvioija, suorita uudelleen sama evaluointi samalla arvioijalla, vie se JSON-muodossa ja tarkista taustalla oleva toiminta [Suoritusjäljissä](../tabs/traces-tab.md).

Katso myös [Agent-solmu](../nodes/agent-node.md), [Suoritusjäljet](../tabs/traces-tab.md) ja [Suoritushistoria](./execution-history.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Katso Arvioinnit-esittely</a></p>

### [Tiimit](../tabs/teams-tab.md)

Tiimit-välilehti mahdollistaa tiimien luomisen ja hallinnan. Luo tiimi, lisää jäseniä sähköpostiosoitteella ja poista jäseniä (luojaa ei voi poistaa). Jaa [workflowt](../tabs/workflows-tab.md), [mallit](../tabs/templates-tab.md), [tunnistetiedot](../tabs/credentials-tab.md), [muuttujat](../tabs/global-variables-tab.md), [vektorivarastot](../tabs/vectorstores-tab.md) ja [Drive-tiedostot](../tabs/drive-tab.md) tiimien kanssa niiden omista jakodialogeista; kaikki tiimin jäsenet saavat käyttöoikeuden. Muokkaa tiimin nimeä ja kuvausta tai poista tiimi (poistaa kaikki tiimin jakamiset).

Katso myös [Tiimit](./teams.md), [Tunnistetietojen jakaminen](./credentials-sharing.md) ja [Workflowjen organisointi](./workflow-organization.md).

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Katso Tiimit-esittely</a></p>

### [Aikataulut](../tabs/scheduled-tab.md)

Aikataulut-välilehti näyttää kaikki aktiiviset [Cron-solmun](../nodes/cron-node.md) workflowt visuaalisessa kalenterissa. Vaihda päivä-, viikko- ja kuukausinäkymien välillä nähdäksesi, milloin automatiikkasi on ajastettu suoritettavaksi, ja siirry takaisin liittyvään [workflowhun](../tabs/workflows-tab.md) muokataksesi aikataulua tarvittaessa.

Katso myös [Cron-solmu](../nodes/cron-node.md), [Analytiikka](../tabs/analytics-tab.md) ja [Suoritushistoria](./execution-history.md).

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Katso Aikataulut-esittely</a></p>

### [Lokit](../tabs/logs-tab.md)

Lokit-välilehti näyttää Docker-säiliöiden lokit Heym-stackille (backend, frontend, PostgreSQL). Valitse säiliö(t), suodata lokitasolla (Kaikki, INFO, WARNING, ERROR, DEBUG) ja hae lokien sisältä. Käytä sitä virheenkorjaukseen ja ongelmien ratkaisemiseen. Workflowjen suorituslokeja (solmujen tulokset, outputit) varten käytä [Suoritushistoriaa](./execution-history.md), [Suoritusjälkiä](../tabs/traces-tab.md) tai editorin Debug-paneelia.

Katso myös [Suoritushistoria](./execution-history.md), [Suoritusjäljet](../tabs/traces-tab.md) ja [Canvas-ominaisuudet](./canvas-features.md).

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Katso Lokit-esittely</a></p>

### [Datataulukot](../tabs/datatable-tab.md)

Datataulukot-välilehti mahdollistaa rakenteisten datataulukoiden luomisen ja hallinnan Heymissä. Määritä tyypitetyt sarakkeet (merkkijono, numero, boolean, päivämäärä, JSON), hallitse rivejä kaksoisnapsautuksella muokattavassa näkymässä, tuo/vie CSV-muodossa ja jaa taulukot käyttäjien tai [tiimien](./teams.md) kanssa luku-/kirjoitusoikeuksin. Käytä [Datataulukko-solmua](../nodes/datatable-node.md) käyttääksesi taulukoita ohjelmallisesti workflowissa. Kiinnitetyssä **Järjestelmätaulukot** -osiossa yläosassa on **LLM-kustannustaulukko**: kiinteä skeeman omaava näkymä mallikohtaisista hinnoista, jotka täytetään taustalla Helicone-palvelusta (24 tunnin TTL, manuaalinen Päivitys), ja jossa kukin käyttäjä voi ohittaa hintoja tai lisätä mukautettuja rivejä malleihin, joita Helicone ei listaa. Nämä hinnoittelu säännöt ohjaavat kustannus-KPI:tä ja mallikohtaista kustannuskaaviota [Suoritusjäljet](../tabs/traces-tab.md) -välilehdellä.

Katso myös [Datataulukko-solmu](../nodes/datatable-node.md), [Suoritusjäljet](../tabs/traces-tab.md), [Workflow-rakenne](./workflow-structure.md) ja [Tiimit](./teams.md).

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Katso Datataulukot-esittely</a></p>
### [Drive](../tabs/drive-tab.md)

Drive-välilehdessä näkyvät kaikki workflowien taitojen luomat tiedostot. Siellä listataan jokainen tiedosto nimen, tyypin, koon, lähdesolmun, luontipäivämäärän ja tiimijakotilan mukaan, ja tarjotaan hakutoiminnot, todentunut lataus, jakaminen, poistaminen ja sivutus. Se on [Tiedostojen luonti](./file-generation.md) -toiminnon hallintanäkymä sekä viitteet [Drive](./drive.md) ja [Drive-solmu](../nodes/drive-node.md).

Katso myös [Drive](./drive.md), [Tiedostojen luonti](./file-generation.md) ja [Drive-solmu](../nodes/drive-node.md).

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Katsele Drive-esittely</a></p>
