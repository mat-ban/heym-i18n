# Miksi Heym

Heym on infrastruktuuri tekoälyagenttien suorittamiseen ja hallintaan tuotannossa. Yksi itse isännöity suoritusympäristö kattaa agentin elinkaaren kaikki vaiheet.

Prototyyppitason agentti tarvitsee mallin, kehotteen ja muutaman työkalun. Tuotantotason agentti tarvitsee lisäksi liipaisimet ja uudelleenyritykset, tallennetun tilan, kun se pysähtyy odottamaan ihmistä, merkinnän jokaisesta mallin ja työkalun kutsusta, kustannukset jokaisesta suorituskerrasta, testit ennen muutoksen julkaisua sekä selkeät rajat sille, mitä agentti saa tehdä itsenäisesti. Heym pitää kaiken tämän yhdessä paikassa, joten järjestelmä, jonka suunnittelet canvasilla, on sama järjestelmä, joka suoritetaan. Rakenna agenttipohjaisia järjestelmiä ja suorita ne luottavaisin mielin.

## Yksi suoritusympäristö agentin elinkaarelle

| Vaihe | Mitä Heym tarjoaa |
|---|---|
| **Rakenna** | Kokoa agentteja ja deterministisiä vaiheita canvasilla, luo niitä [AI Assistant](../reference/ai-assistant.md) -työkalulla tai aloita [Malleista](../tabs/templates-tab.md) ja siirrettävistä taidoista. |
| **Orkestroi** | Koordinoi agentteja, [alagentteja](../reference/agent-architecture.md), koodausagentteja, RAG:ia, selainautomaatiota ja työkaluja eksplisiittisellä tietovirralla ja [rinnakkaissuorituksella](../reference/parallel-execution.md). |
| **Suorita** | Käynnistä suorituksia [webhookeista](../reference/webhooks.md), aikatauluista ja tapahtuma[liipaisimista](../reference/triggers.md), solmukohtaisilla uudelleenyrityksillä, [virheenkäsittelyllä](../nodes/error-handler-node.md) ja [kuorman jakamisella](../reference/cluster.md) instanssien kesken. |
| **Havainnoi** | Tarkastele jokaista suoritusta [historian](../reference/execution-history.md), [LLM-jälkien](../tabs/traces-tab.md), suorituskohtaisen USD-kustannuksen, canvasilla näkyvien reaaliaikaisten suoritusten, [analytiikan](../tabs/analytics-tab.md), [hälytysten](../tabs/alerts-tab.md) ja [OpenTelemetry](../reference/opentelemetry.md) -viennin kautta. |
| **Arvioi** | Testaa kehotteita ja malleja odotettuja tuloksia vasten [Evals](../tabs/evals-tab.md) -työkalulla, LLM-as-Judge-pisteytyksellä ja mallien rinnakkaisvertailulla. |
| **Hallitse** | Pidä ihmiset ohjaksissa [tarkistuspisteiden](../reference/human-in-the-loop.md) ja [suojakaiteiden](../reference/guardrails.md) avulla, ja hallinnoi pääsyä salatuilla [tunnistetiedoilla](../reference/credentials.md), [tiimeillä](../reference/teams.md), [kertakirjautumisella](../reference/sso.md) ja [audit-lokilla](../reference/audit.md). |
| **Julkaise** | Tarjoa työnkulkuja REST- ja [SSE](../reference/sse-streaming.md) -rajapintojen kautta, [MCP](../tabs/mcp-tab.md) -työkaluina, [Portaalin](../reference/portal.md) chat-käyttöliittyminä ja [dashboard](../tabs/dashboard-tab.md) -widgetteinä. |

## Rakenna

### AI Assistant: Rakenna työnkulkuja luonnollisella kielellä

[AI Assistant](../reference/ai-assistant.md) on työnkulkueditorin sisäinen chat-paneeli. Kuvaile, mitä haluat, esimerkiksi "luo työnkulku, joka ottaa vastaan käyttäjän syötteen, hakee tietoa tietopankistani ja vastaa GPT-4o:lla", niin assistant luo solmut ja yhteydet, jotka lisätään välittömästi canvasille.

- Käyttää omaa LLM-tunnistetietoasi (mikä tahansa tuettu malli)
- Tukee **äänisyötettä** käsivapaaseen työnkulun suunnitteluun
- Lisää automaattisesti kelvollisen työnkulun JSON:n AI-vastauksesta canvasille
- Suoratoistaa vastaukset reaaliajassa

Assistant toimii suoraan editorin sisällä ja suoratoistaa solmut canvasille reaaliajassa, ja kaikki sen luoma pysyy muokattavana kuin käsin asetetut solmut.

### Taitojärjestelmä

Taidot ovat siirrettäviä kyvykkyyspaketteja, `SKILL.md`-ohjetiedosto sekä valinnaiset Python-skriptit, jotka voidaan pudottaa mille tahansa Agent-solmulle.

- Taidon ohjeet lisätään agentin järjestelmäkehotteen alkuun
- Taidon Python-tiedostot tulevat kutsuttaviksi työkaluiksi
- Taidot ovat uudelleenkäytettäviä työnkulkujen välillä ja jaettavissa `.zip`-arkistoina

Tämä vastaa sitä, että agentille annetaan työnkuvaus ja työkalupakki yhdellä kertaa.

### Workflow Analyzer: Suoritustietoinen palaute

[Workflow Analysis](../reference/workflow-analysis.md) -paneeli on editoriin sisäänrakennettu suoritustietoinen dokumentointi- ja palautetyökalu. Napsauta **Analyze**, valitse LLM-tunnistetiedot ja malli, niin Heym luo muokattavan Markdown-raportin nykyisestä työnkulusta.

Toisin kuin staattinen muistiinpano, analysaattori suorittaa ensin työnkulun, kun se on mahdollista, ja sisällyttää suorituksen tuloksen kehotteeseen. Raportti kattaa parannuskohteet, työnkulun tarkoituksen ja vaiheittaisen selityksen siitä, mitä solmut tekevät. Kun raportti on jo olemassa, **Reanalyze** suoratoistaa erillisen esikatselun, jotta uusi versio voidaan hyväksyä tai nykyinen jaettu asiakirja säilyttää.

## Orkestroi
### Sisäänrakennetut LLM- ja Agent-solmut

Heymin [Agent-solmu](../nodes/agent-node.md) suorittaa tiiviisti integroidun työkaluja kutsuvaa silmukkaa inline-Python-työkaluilla, MCP-yhteyksillä ja siirrettävällä skills-järjestelmällä, jotka kaikki on suunniteltu tuotantokäyttöön tarkoitettuihin agentteihin.

Heymin tavallinen [LLM-solmu](../nodes/llm-node.md) ylittää myös yksittäisen prompt-vastaus-vaiheen. Tuettujen OpenAI- ja OpenAI-yhteensopivien endpointien osalta se voi vaihtaa **Batch API -tilaan**, jolloin yksi solmu lähettää taulukon prompteja edullisempana palveluntarjoajan natiivina eräpyyntönä. Canvas paljastaa tämän jälkeen erillisen `batchStatus`-haaran, joka laukeaa, kun erä etenee tilojen kuten `pending`, `processing` ja `completed` läpi.

Tämä tarkoittaa, että LLM-solmu voi tehdä kahta asiaa samanaikaisesti:

- Suorittaa pääasiallisen eräpyynnön ja palauttaa lopulliset kohdekohtaiset tulosteet normaalissa haarassa
- Laukaista ilmoitus- tai lokituslogiikan jokaisella merkityksellisellä erän tilapäivityksellä muuttamatta virtausta mukautetuksi kyselysilmukaksi

Eräsuoritus on ensiluokkainen LLM-työnkulkujen primitiivi, ja solmun käyttöliittymässä on palveluntarjoajan ja mallin kyvykkyystarkistukset.

**Agent-solmu** on agenttien orkestroinnin ydin Heymissä:

- **Työkalujen kutsuminen** – Agentti iteroi työkalukutsujen yli silmukassa, kunnes se tuottaa lopullisen vastauksen
- **Python-työkalut** – Määritä mukautettuja työkaluja inline täydellä Pythonilla; agentti kutsuu niitä suorituksen aikana
- **MCP-yhteydet** – Yhdistä mihin tahansa [Model Context Protocol](https://modelcontextprotocol.io/) -palvelimeen (stdio tai SSE), ja agentti saa kaikki työkalunsa automaattisesti
- **Skills** – Pudota `.zip`- tai `.md`-tiedosto agentille laajentaaksesi sen järjestelmäkontekstia ja lisätäksesi Python-työkaluja
- **Alityönkulkukutsut** – Agentti voi kutsua muita Heym-työnkulkuja työkaluina yhdistäen monimutkaista käyttäytymistä ilman mukautettua koodia

Katso täydellinen viite: [Agent-solmu](../nodes/agent-node.md) ja [Agent-arkkitehtuuri](../reference/agent-architecture.md).

### Moniagenttiorkestrointi

Heym tukee **orkestraattorimallia** ensiluokkaisilla visuaalisilla primitiiveillä:

- Yksi agentti toimii **orkestraattorina** (`isOrchestrator: true`) ja sille annetaan `call_sub_agent`-työkalu
- Se delegoi tehtäviä nimetyille **alagenteille** samalla canvasilla
- Alagagentit voivat itse kutsua muita agentteja tai alityönkulkuja (enimmäissyvyys: 5)
- **Rinnakkaissuoritus**: Kun orkestraattori kutsuu useita alagagentteja yhdellä vuorolla, ne suoritetaan rinnakkain nopeampien tulosten saavuttamiseksi

Tämä mahdollistaa arkkitehtuurit, kuten suunnitteluagentin, joka reitittää työtä tutkijalle, koodaajalle ja tiivistäjälle, kaikki visuaalisesti kytkettynä ilman mukautettua orkestrointikoodia.

Katso suorituksen yksityiskohdat: [Agent-arkkitehtuuri](../reference/agent-architecture.md).

### Koodausagentit työnkulun solmuina

Heym toimittaa kaksi solmua, jotka suorittavat oikean koodausagentin työnkulun vaiheena, ei chat-vastausta:

- **[Codex-solmu](../nodes/codex-node.md)** – Suorittaa OpenAI Codex CLI:n eristetyssä Heym-työtilassa GitHub-repositoriota vasten. Tukee **Sign in with ChatGPT** -kirjautumista (PKCE OAuth Plus/Pro-tilauksellasi, ei tokenikohtaista API-kustannusta) tai access tokenia, kloonaa repon, antaa Codexin muokata koodia ja palauttaa `summary`, `diff`, `changedFiles` ja luonnoksen `pullRequestUrl`.
- **[OpenCode Go -solmu](../nodes/opencode-go-node.md)** – Sama repositoriotyönkulku palveluntarjoajasta riippumattoman OpenCode-gatewayn kautta (Kimi, DeepSeek, Qwen ja muut), suoritettuna **kovennetussa kertakäyttöisessä kontissa**: kaikki kyvykkyydet poistettu, juuri read-only, pid/muisti/CPU-rajoitukset. GitHub-token pysyy sandboxin ulkopuolella: Heym suorittaa jokaisen git- ja GitHub-operaation isäntäpuolella, joten generoitu koodi ei voi vuotaa push-tunnuksia.

Tämä tarkoittaa, että työnkulku voi triageoida virheen webhookista, luovuttaa repon koodausagentille, odottaa luonnospull requestia ja lähettää linkin Slackiin, täysin automatisoidusti, käyttöönotto­kohtaisesti konfiguroitavilla resurssirajoituksilla.

### Sisäänrakennettu RAG-putki

Heym sisältää [RAG / Vector Store -solmun](../nodes/rag-node.md) ja hallitun [Vectorstores](../tabs/vectorstores-tab.md) -välilehden. Voit:

- Valita vektoritaustajärjestelmän: **Qdrant** (ulkoinen palvelin) tai **Postgres (pgvector)**, joka tallentaa vektorit Heymin omaan tietokantaan ilman erillistä palvelua
- Lisätä dokumentteja vektorivarastoon suoraan työnkulun solmusta
- Suorittaa semanttista hakua ja syöttää tulokset LLM- tai Agent-solmuun
- Viitata tuloksiin lausekkeilla kuten `$ragNode.results.map("item.payload.content").join("\n\n")`

Heymissä RAG on kaksi solmua, joissa on täysi hallinta embeddingeistä ja hakemisesta.

### Selainautomaatio Playwrightilla

[Playwright-solmu](../nodes/playwright-node.md) on ensimmäisen osapuolen selainautomaatio canvasilla.

- **Steps-tila** – Kokoa navigate-, click-, type-, fill-, screenshot-, extract- ja scroll-toiminnot visuaalisesti
- **AI-vaiheet automaattisella korjauksella** – Kuvaile toiminto luonnollisella kielellä, ja LLM generoi Playwright-toiminnot; epäonnistuneet valitsimet voidaan korjata automaattisesti, ja generoidut vaiheet voidaan välimuistittaa tulevien LLM-kutsujen ohittamiseksi
- **Run Code -tila** – Vaihda solmu täyteen Playwright Pythoniin monimutkaisia virtauksia varten (oletuksena poistettu käytöstä; suoritetaan Heymin kovennetussa sandboxissa, kun käytössä)
- **Todennetut istunnot** – Palauta evästeet/`storageState` ennen suoritusta, vahvista kirjautuminen valitsintarkistuksella ja palaa skriptattuihin kirjautumisvaiheisiin tarvittaessa
- **Verkkokaappaus** – Kerää valinnaisesti JSON-vastaukset, otsikot, evästeet ja selaimen tallennustilan tulosten ohella

Heym kohtelee selainta tavallisena solmuna, jossa on samat lausekkeet, tunnistetiedot ja virheenkäsittely kuin kaikessa muussa.
### Expression DSL

Heymin [Expression DSL](../reference/expression-dsl.md) tarjoaa selkeän ja tehokkaan syntaksin ylävirran solmudatan viittaamiseen:

- `$input.text` – Input-solmun data
- `$nodeName.field` – Minkä tahansa ylävirran solmun tulostekenttä
- `$global.variableName` – Pysyvät globaalit muuttujat
- Taulukkotyökalut: `.first()`, `.map("field")`, `.join("\n")`

Lausekkeet toimivat jokaisessa merkkijonokentässä, mukaan lukien promptit, HTTP-otsikot, ehdot ja asetusarvot, joten data siirtyy vaiheiden välillä eksplisiittisesti. DSL tasapainottaa tehon ja luettavuuden ilman, että täyttä JavaScript-osaamista vaaditaan.

## Suoritus

### Triggerit, uudelleenyritykset ja virhepolut

Workflow voi käynnistyä monesta paikasta. [Input](../nodes/input-node.md) -solmut vastaanottavat HTTP-[webhookeja](../reference/webhooks.md), [Cron](../nodes/cron-node.md) suoritetaan aikataulun mukaan, ja tapahtuma-[triggerit](../reference/triggers.md) käynnistävät suorituksia Telegramista, Discordista, Slackista, IMAP-postilaatikoista, WebSocket-virroista, RabbitMQ-jonoista, tiedostolatauksista ja Heym-alustan tapahtumista.

Virheet käsitellään graafin sisällä. Mikä tahansa solmu voi yrittää uudelleen epäonnistumisen jälkeen määritetyllä yrityskertojen määrällä ja odotusajalla niiden välillä, jokainen yritys kirjataan [suoritushistoriaan](../reference/execution-history.md), ja [Error Handler](../nodes/error-handler-node.md) -solmu suoritetaan automaattisesti, kun solmu epäonnistuu, joten palautuminen on osa workflow'ta itseään.

### Rinnakkainen DAG-suoritus

Heymin workflow-suorittaja käyttää suunnattua syklitöntä graafia (DAG) -aikatauluttajaa. Riippumattomat solmut suoritetaan rinnakkain automaattisesti ilman konfigurointia.

- Samalla riippuvuustasolla olevat solmut lähetetään samanaikaisesti säikepooliin (`max_workers=8`)
- Heti kun mikä tahansa solmu valmistuu, sen alavirran solmut aikataulutetaan
- [Merge-solmu](../nodes/merge-node.md) yhdistää rinnakkaisten haarojen tulokset
- Useat workflow-suoritukset suoritetaan samanaikaisesti; jokainen suoritus on täysin eristetty

Rinnakkaisuus on oletuskäyttäytyminen, jonka graafin rakenne määrittää.

Katso [Rinnakkainen suoritus](../reference/parallel-execution.md).

### Skaalaus instanssien välillä

Osoita toinen Heym-instanssi samaan PostgreSQL-tietokantaan, niin se liittyy työntekijänä. Taustasuoritukset jaetaan instanssien kesken asettamiesi painojen mukaisesti, yksi valittu johtaja pitää aikataulut, hälytysten arvioinnin ja kaatumispalautuksen käynnissä failoverin läpi, ja jokainen suoritus kirjaa sen suorittaneen instanssin. Katso [Kuorman jakautuminen](../reference/cluster.md).

### Agenttinen Kanban-taulukko

[Board-välilehti](../tabs/board-tab.md) on sisäänrakennettu Kanban-taulukko, jossa sarakkeet itse suorittavat workflow'ta. Kortti on pysyvä agenttinen työ, joka sisältää kontekstin, keskusteluhistorian, suoritustilan, tulosteet ja workflow-suoritukset.

- **Sarakkeen workflow-ketjut** – Kortin siirtäminen sarakkeeseen käynnistää kyseisen sarakkeen workflow-ketjun; **Agentic Kanban -malli** (tunnuksesi + malli) yhdistää kortin sisällön workflow-syötteiksi ja muuntaa tulosteet takaisin luettavaksi tekstiksi
- **Kortin liitteet** – Pudota tiedostoja kortille; asiakirjat puretaan tekstiksi ja kuvat välitetään näkökykyisille malleille ennen jokaista suoritusta
- **Live-suorituskanvaasi** – Avaa aktiivinen suoritus kortin sisällä ja seuraa sen etenemistä todellisella workflow-kanvaasilla solmu solmulta
- **Tiimijakaminen** – Jaa taulukoita käyttäjille tai tiimeille luku-/kirjoitusoikeuksin; jaettujen taulukoiden ketjut suoritetaan omistajan tunnuksilla, joten yhteistyökumppanit eivät koskaan tarvitse omiaan
- **Virheiden näkyvyys** – Epäonnistuneet kortit näyttävät virhehistorian ilmaisimen, ja jatkosuoritukset voivat keskeytyä odottamaan kommentteja

Taulukko on alustan natiivipinta: kortit, workflow't, tunnukset ja live-suoritukset sijaitsevat kaikki yhdessä paikassa.

### Heym Drive: Sisäänrakennettu tiedostotallennus

[Drive-välilehti](../tabs/drive-tab.md) on alustaan sisäänrakennettu tiedostovarasto. Skillien ja workflow'iden tuottamat tiedostot (PDF, DOCX, CSV, kuvat) päätyvät sinne automaattisesti, ja myös taulukkokorttien liitteet tallennetaan sinne.

- **Jakolinkit** – Julkiset tai salasanasuojatut (Basic Auth) latauslinkit valinnaisella vanhenemisajalla ja enimmäislatausrajoituksilla
- **Tiimijakaminen** – Jaa tiedostoja vain luku -oikeuksin tiimiesi kanssa ja poista kaikki tiimijaot yhdellä toiminnolla
- **Joukkotoiminnot** – Monivalinta shift-klikkauksella, valintojen kokoaminen yhdeksi ZIP-lataukseksi tai yhden jako-/salasana-/poistoasetuksen soveltaminen moneen tiedostoon kerralla
- **Agenttien pääsy** – Skillit voivat valita Drive-tiedostojen lukemisen, joten agentti voi työskennellä sinun tai muiden workflow'iden tuottamien asiakirjojen parissa

Luodut artefaktit saavat pysyvän, jaettavan kodin alustan sisällä.

## Havainnointi

### LLM-jäljitykset

[Traces-välilehti](../tabs/traces-tab.md) tarjoaa täyden havainnoitavuuden jokaiselle LLM-kutsulle:

- Pyyntö- ja vastauspayloadit
- Kutsukohtainen ajoitus: `llm_ms`, `tools_ms`, `mcp_list_ms`
- Työkalukutsujen nimet, argumentit ja tulokset
- Mallille välitetyt skillit

Jäljitysjärjestelmä on rakennettu erityisesti agenttisen käyttäytymisen virheenkorjaukseen, sisältäen täydet pyyntö- ja vastauspayloadit sekä kutsukohtaisen ajoituksen.
### LLM Token -kustannusten seuranta

Jokainen LLM-kutsu Heymissä hinnoitellaan automaattisesti. [Traces-välilehti](../tabs/traces-tab.md) näyttää jokaisen jäljityksen syöte- ja tulostemerkkimäärät sekä reaaliaikaisen USD-kustannuksen, joka on johdettu synkronoidusta hinnoittelutaulukosta.

- **Jäljityskohtainen kustannus** – Syötemerkit, tulostemerkit ja kokonais-USD näytetään jokaisella jäljitysrivillä
- **Kustannusanalytiikka** – KPI-kortit ja mallikohtainen kustannuskaavio päivittyvät valitun aikavälin mukaan (1h / 24h / 7d / 30d / Kaikki)
- **LLM-kustannustaulukko** – Järjestelmätaulukko [DataTable-välilehdellä](../tabs/datatable-tab.md) päivitetään Helicone-palvelusta 24 tunnin välein; hinnat voi ohittaa tai lisätä mukautettuja rivejä malleille, joita ei ole vielä lueteltu
- **Puuttuvan hinnan varoitus** – Jäljitykset malleille, joilla ei ole hinnoittelumerkintää, näyttävät rivinsisäisen varoituksen, jossa on suora linkki kustannustaulukkoon

Jokainen suoritus sisältää oman USD-kustannuksensa mallikohtaisesti eriteltynä.

### Tuotantosuoritusten avaaminen live-canvakselle

Tuotantotyönkulku pysyy tarkasteltavana sen käynnistymisen jälkeen editorin ulkopuolella. Avaa mikä tahansa **Running**-merkintä kummasta tahansa History-valintaikkunasta tai avaa aktiivinen suoritus Agentic Kanban -kortin sisällä, niin Heym liittää normaalin työnkulkueditorin juuri siihen suoritukseen.

- Jo päättyneet solmut näkyvät tuloksineen välittömästi
- Nykyinen solmu ja odottavat alavirran solmut sykkivät suorituksen edetessä
- Debug-paneeli vastaanottaa samat inkrementaaliset solmutulokset kuin canvakselta käynnistetty suoritus
- Lopullinen tuloste ja suorituksen korostukset saapuvat ilman kyselyä tai päällekkäisen suorituksen käynnistämistä
- Editorin sulkeminen vain katkaisee tarkkailijan yhteyden; se ei koskaan peruuta tuotantotyönkulkua

Tarkkailija käyttää SSE:tä, jonka taustalla on työntekijöiden välinen suorituskuvakaappaus, joten se toimii webhook-, aikataulu-, chat-, MCP-, integraatio- ja Board-triggereille, vaikka toinen taustatyöntekijä omistaisi suorituksen.

### OpenTelemetry, analytiikka ja hälytykset

Heym lähettää [OpenTelemetry](../reference/opentelemetry.md) -spanit jokaisesta työnkulun suorituksesta, solmun suorituksesta ja Agent-työkalun kutsusta, viedään OTLP/HTTP:n kautta Jaegeriin, Grafana Tempoon, Honeycombiin, Datadogiin tai mihin tahansa muuhun yhteensopivaan taustajärjestelmään.

[Analytics](../tabs/analytics-tab.md) -välilehti seuraa suoritusmääriä, onnistumisastetta, kestoa ja trendejä työnkulkuittain. [Alerts](../tabs/alerts-tab.md) -hälytykset tarkkailevat virhemääriä, suorituksen kestoa, token- tai USD-kulutusta ja suoritusvolyymia aikavälillä ja käynnistävät valitsemasi ilmoitustyönkulun, joten hälytys tavoittaa Slackin, sähköpostin, Telegramin tai minkä tahansa muun kanavan, johon solmu yltää.

## Arviointi

### Sisäänrakennetut arvioinnit

[Evals-välilehdellä](../tabs/evals-tab.md) voi määritellä testisarjoja ja ajaa niitä agenttityönkulkuja vastaan:

- Luo testitapauksia syötteillä ja odotetuilla tulosteilla tai luo ne sarjan promptista
- Aja yksi sarja useita malleja vastaan ja vertaa niiden tulosteita rinnakkain
- Pisteytä Exact Match-, Contains- tai LLM-as-Judge -menetelmällä riippumattoman tuomarimallin kanssa
- Tarkastele läpäisy/hylkäys, toteutunut vs. odotettu ja suoritushistoria

Muuta promptia tai mallia, aja sarja uudelleen ja vertaa tuloksia ennen kuin muutos etenee tuotantoon.

## Hallinta

### Human-in-the-Loop (HITL)

Heymissä on sisäänrakennettu [Human-in-the-Loop](../reference/human-in-the-loop.md) -järjestelmä, jonka avulla agentit voivat keskeyttää suorituksen, pyytää ihmisen tarkistusta ja jatkaa täsmälleen siitä, mihin jäivät.

- **Agent-tarkistuspisteet** – Ota `hitlEnabled` käyttöön missä tahansa Agent-solmussa, niin se saa `request_human_review`-työkalun. Agentti päättää, milloin päätös vaatii ihmisen valvontaa, ja kutsuu työkalua yhteenvedolla ja luonnoksella.
- **Julkiset tarkistus-URL-osoitteet** – Jokainen tarkistuspyyntö luo turvallisen kertakäyttöisen linkin osoitteeseen `/review/{token}` (168 tunnin TTL). Tarkistajat voivat **hyväksyä**, **muokata ja jatkaa** tai **hylätä** kirjautumatta sisään.
- **Suorituskuvakaappaukset** – Työnkulku jäädyttää täyden tilansa (keskusteluhistoria, muuttujat, työkalutulokset), joten se jatkuu täsmälleen siitä, mihin se pysähtyi, kun tarkistaja vastaa.
- **Ilmoitushaara** – Valinnainen `review`-tulostekahva mahdollistaa ilmoitustyönkulun (Slack, sähköposti, webhook) kytkemisen, joka laukeaa, kun tarkistusta pyydetään.
- **MCP-työkalujen hyväksyntäkäytännöt** – Kirjalliset HITL-ohjeet tulkitaan hyväksyntälaajuuksiksi (`always` / `once` / `never`), joten agentti voi automaattisesti hyväksyä matalan riskin työkalut ja eskaloida korkean riskin työkalut.
- **Useita tarkistuspisteitä** – Yksi agenttisuoritus voi keskeytyä tarkistusta varten useita kertoja; jokainen tarkistuspiste on riippumaton.

Julkiset tarkistus-URL-osoitteet, muokkaa ja jatka-, ilmoitushaaroittelu ja kuvakaappauspohjainen jatkaminen toimivat kaikki samasta agent-tarkistuspisteestä.

Katso koko viite: [Human-in-the-Loop](../reference/human-in-the-loop.md).

### LLM-suojakaiteet

Heymissä on sisäänrakennetut [Guardrails](../reference/guardrails.md) sekä [LLM](../nodes/llm-node.md)- että [Agent](../nodes/agent-node.md) -solmuissa, joten turvattoman sisällön voi estää ennen kuin mallin vastaus saavuttaa alavirran vaiheet.

- **Solmutason turvakytkin** – Ota suojakaiteet käyttöön suoraan solmussa, joka tuottaa tai käsittelee käyttäjälle näkyvää sisältöä
- **Laaja käytäntökattavuus** – Estä väkivalta, vihapuhe, seksuaalinen sisältö, NSFW/kiroilu, häirintä, laiton toiminta, henkilötietopyynnöt ja prompt injection -yritykset
- **Monikielinen tunnistus** – Sovella samoja turvasääntöjä turkiksi, englanniksi, arabiaksi, espanjaksi ja muilla kielillä
- **Työnkulkuun natiivi varamenettely** – Kun viesti estetään, solmu heittää tyypitetyn työnkulkivirheen, jonka voi ohjata [Error Handler](../nodes/error-handler-node.md) -solmun kautta

Turvakäytäntö sijaitsee suoraan LLM- ja Agent-konfiguraatiossa ja liittyy suoraan työnkulun haarautumiseen ja virheenkäsittelyyn.
### Käyttöoikeudet, tunnistetiedot ja valvonta

Agentit toimivat oikeilla tunnistetiedoilla, joten käyttöoikeudet ovat osa hallintoa. [Tunnistetiedot](../reference/credentials.md) salataan levossa, peitetään luonnin jälkeen ja jaetaan käyttäjille tai [tiimeille](../reference/teams.md), ja tiimit jakavat myös työnkulkuja, muuttujia, vektorivarastoja ja Drive-tiedostoja. [Kertakirjautuminen](../reference/sso.md) yhdistää mihin tahansa OpenID Connect -tarjoajaan, mukaan lukien Okta, Entra ID, Keycloak, Auth0 ja Google. [Valvontajälki](../reference/audit.md) tallentaa jokaisen tietoturvaan liittyvän toiminnon tekijöineen, kohteineen ja lopputuloksineen, ja se striimataan konttilokien mukana jo käytössä olevaan lokien kerääjään tai SIEM-järjestelmään.

### Itse isännöity, data pysyy hallinnassasi

Heym toimii omalla infrastruktuurillasi. Työnkulut, tunnistetiedot, suoritushistoria ja jäljitykset sijaitsevat omassa tietokannassasi, ja mallikutsut kulkevat palvelimiltasi valitsemaasi tarjoajaan tai itse isännöimääsi malliin Ollaman tai vLLM:n kautta. Agenteille, jotka käsittelevät arkaluontoisia asiakirjoja, asiakastietoja tai omia tietopohjia, tämä on usein ehdoton vaatimus.

Heym on lisensoitu **MIT-lisenssillä Commons Clause -ehdolla**. Lähdekoodi on source-available: sitä voi käyttää, muokata ja isännöidä vapaasti. Commons Clause rajoittaa ohjelmiston myyntiä, mukaan lukien maksullisen hosting-palvelun tai konsultointi- ja tukipalveluiden tarjoamista, joiden arvo perustuu olennaisesti Heymiin. Kaupalliseen lisensointiin, yrityskäyttöönottoihin tai ammattimaiseen tukeen liittyen: ota yhteyttä [enterprise@heym.run](mailto:enterprise@heym.run).

## Julkaisu

### API:t ja striimaus

Työnkulut ovat kutsuttavissa HTTP:n kautta osoitteessa `/api/workflows/{workflow_id}/execute`, joka palauttaa JSONia, sekä osoitteessa `/api/workflows/{workflow_id}/execute/stream`, joka striimaa solmutapahtumat Server-Sent Events -muodossa suorituksen edetessä. Molemmat jakavat työnkulkutason autentikoinnin, nopeusrajoituksen ja vastausten välimuistituksen. Katso [Webhookit](../reference/webhooks.md) ja [SSE-striimaus](../reference/sse-streaming.md).

### MCP (Model Context Protocol) -integraatio

Heymissä on natiivi [MCP](../tabs/mcp-tab.md) -tuki molemmilla puolilla:

- **Asiakkaana**: Agentsolmut yhdistävät ulkoisiin MCP-palvelimiin (Filesystem, Browserbase, mukautetut työkalut) stdio:n tai SSE:n kautta ja käyttävät niiden työkaluja automaattisesti
- **Palvelimena**: Työnkulut, joissa MCP on käytössä, tulevat työkaluiksi oletuspalvelimella osoitteessa `/api/mcp/sse` tai nimetyillä palvelimilla, joilla on oma URL-osoite ja API-avain, jolloin Claude Desktop, Cursor ja muut MCP-asiakkaat voivat kutsua Heym-työnkulkuja suoraan

Agentit voivat käyttää useita MCP-palvelimia samanaikaisesti, ja mikä tahansa työnkulku voi tulla työkaluksi ulkoiselle MCP-asiakkaalle.

### Portaali: julkaise työnkulut chat-käyttöliittyminä

[Portaali](../reference/portal.md) -ominaisuus muuttaa minkä tahansa työnkulun julkiseksi chat-käyttöliittymäksi osoitteessa `/chat/{slug}`:

- Valinnainen autentikointi käyttäjäkohtaisilla tunnistetiedoilla
- Striimaava suoritus (solmujen edistyminen reaaliajassa)
- Tiedostojen lataustuki
- Monivaiheinen keskusteluhistoria

Tiimit toimittavat sisäisiä työkaluja, asiakkaille suunnattuja chatbotteja ja tekoälypohjaisia lomakkeita työnkulun ja URL-osoitteen avulla ilman, että frontend-koodia tarvitsee kirjoittaa.

### Työnkulkuvetoiset koontinäytöt

[Koontinäyttö-välilehti](../tabs/dashboard-tab.md) on käyttäjän rakentama raportointipinta, jossa jokainen kaaviowidget toimii oman piilotetun Heym-työnkulun voimalla. Widget voi kutsua API:ta, tehdä kyselyitä BigQueryyn, hakea RAG-/vektorivarastoista, suorittaa LLM-vaiheita, muuntaa rivejä ja päättyä [Chart Output -solmuun](../nodes/chart-output-node.md). Widgettejä voi luoda manuaalisesti, generoida tekoälyllä, hienosäätää myöhemmin, välimuistittaa tuloksia ja järjestellä ruudukkoa visuaalisesti.
## Vertailu Workflow-automaatiotyökaluihin

Monet tiimit päätyvät HeyMIin Workflow-automaatiotyökaluista. Alla oleva taulukko vertaa HeyMiä n8n:ään, Zapieriin ja Make.comiin niiden ominaisuuksien osalta, joilla on merkitystä, kun agentit ovat tuotantokäytössä, ja taulukon alapuolella olevat alaviitteet viittaavat viralliseen dokumentaatioon vertailun taustalla. Syvempää tarkastelua yhtä työkalua kerrallaan varten katso vertailusivut osoitteessa [heym.run/compare](https://heym.run/compare).

| Ominaisuus | Heym | n8n | Zapier | Make.com |
|---|---|---|---|---|
| Sisäänrakennettu LLM-solmu | ✓ | ✓ | ✓ | ✓ |
| LLM Batch API + tilahaarat | ✓ | rajoitettu¹¹ | –¹¹ | rajoitettu¹¹ |
| Sisäänrakennettu Agent-solmu (työkalujen kutsuminen) | ✓ | ✓ | ✓ | ✓ |
| Moniagenttiorkestrointi | ✓ | ✓ | rajoitettu | rajoitettu |
| Koodausagenttisolmut (Codex, OpenCode) | ✓ | –²⁰ | –²⁰ | –²⁰ |
| Sisäänrakennettu RAG / vektoritietovarasto | ✓ | ✓ | rajoitettu¹ | plugin² |
| WebSocket-luku / -kirjoitus | ✓ | rajoitettu¹² | –¹³ | –¹⁴ |
| Luonnollisen kielen Workflow-rakentaja | ✓ | rajoitettu³ | ✓ | ✓ |
| Workflow Analyzer | ✓ | –¹⁸ | –¹⁸ | –¹⁸ |
| Käynnissä olevan ajon avaaminen live-canvakselle | ✓ | rajoitettu¹⁹ | rajoitettu¹⁹ | –¹⁹ |
| Workflow-pohjaiset dashboardit | ✓ | rajoitettu¹⁷ | rajoitettu¹⁷ | rajoitettu¹⁷ |
| Agenttinen Kanban-taulu | ✓ | –²¹ | –²¹ | –²¹ |
| MCP (Model Context Protocol) | ✓ | ✓ | ✓ | ✓ |
| Agenttien Skills-järjestelmä | ✓ | – | – | – |
| Sisäänrakennettu tiedostotallennus (jakolinkit, tiimit) | ✓ | rajoitettu²² | rajoitettu²² | –²² |
| Selainautomaatiosolmu (Playwright) | ✓ | rajoitettu²³ | rajoitettu²³ | –²³ |
| LLM-jäljityksen tarkastelu | ✓ | rajoitettu⁴ | – | ✓ |
| OpenTelemetry-jäljityksen vienti | ✓ | ✓¹⁶ | –¹⁶ | –¹⁶ |
| LLM-token-kustannusten seuranta (USD) | ✓ | –¹⁵ | –¹⁵ | rajoitettu¹⁵ |
| Sisäänrakennetut eval-arvioinnit AI-workflowille | ✓ | ✓ | – | – |
| Human-in-the-Loop (HITL) | ✓ | ✓⁵ | rajoitettu⁶ | rajoitettu⁷ |
| LLM-suojakaiteet | ✓ | ✓⁸ | ✓⁸ | rajoitettu⁸ |
| Automaattinen kontekstin pakkaus | ✓ | – | – | – |
| Rinnakkainen DAG-suoritus | ✓ | rajoitettu⁹ | – | – |
| Itse hostattava, lähdekoodi saatavilla | ✓ MIT + Commons Clause | ✓ fair-code¹⁰ | – | – |
| Expression DSL dynaamiselle datalle | ✓ | ✓ | rajoitettu | ✓ |
> **Alaviitteet:** ¹ Zapier Knowledge Sources — ei paljastettua vektoritietovarastoa tai upotuskomentoa. ² Make.comilla on Pinecone/Qdrant-moduulit, mutta ei natiivia RAG-solmua. ³ n8n AI Workflow Builder on vain pilvessä toimiva beta-versio, jossa on credit-rajat. ⁴ n8n näyttää välivaiheet; täysi jäljitys vaatii kolmannen osapuolen työkaluja. ⁵ n8n tukee AI-työkalukutsujen hyväksyntöjä chatin, sähköpostin ja yhteistyökanavien kautta, mutta se ei ota tilannekuvaa ja jatka koko suoritusta samalla tavalla kuin Heym. ⁶ Zapier Human in the Loop tukee hyväksyntöjä ja tiedonkeruuta Zapien sisällä, mutta se ei ole julkinen tarkistus- ja tilannekuvasta jatkamisen tarkistuspistejärjestelmä. ⁷ Make.com tarjoaa Human in the Loop -toiminnon Enterprise-sovelluksena, jossa on tarkistuspyynnöt ja adjusted/approved/canceled-tulokset, mutta se on edelleen suunnitelmarajoitettu ja vähemmän agenttinatiivi. ⁸ n8n toimittaa oman Guardrails-solmun, Zapier toimittaa AI Guardrails -toiminnon AI-tuotteidensa yli ja Make.com dokumentoi agenttisäännöt sekä tarkistusvirrat, mutta ei vastaavaa erillistä guardrails-ominaisuutta, joten Make on merkitty rajoitetuksi. ⁹ n8n suorittaa peräkkäin oletuksena; rinnakkaisuus vaatii alityönkulkujen kiertoteitä. ¹⁰ Sustainable Use License — ilmainen itse isännöitäväksi sisäiseen käyttöön, kaupallinen uudelleenjakelu rajoitettu. ¹¹ 22. huhtikuuta 2026 alkaen n8n:n viralliset dokumentit kuvaavat HTTP-eräajon ja silmukka/odotus-kuviot pikemminkin kuin natiivin LLM-erätilan haarautumisen, Zapierin viralliset ChatGPT-sovelluksen dokumentit eivät luettele laukaisimia ja vain yleisen API Request -beta-version, ja Make:n virallinen OpenAI-integraatiosivu paljastaa erätoiminnot, kuten create/watch completed, mutta ei ensiluokkaista tilahaarautuvaa LLM-solmua, joten n8n/Make on merkitty rajoitetuksi ja Zapier merkitsemättömäksi tälle tietylle työnkulkukuviolle. ¹² n8n:n viralliset dokumentit kattavat HTTP Webhook- ja HTTP Request -solmut sekä Code/custom/community-laajennettavuuden, mutta en löytänyt ensimmäisen osapuolen WebSocket-laukaisinta/lähetys-solmua, joten n8n on merkitty rajoitetuksi. ¹³ Zapierin viralliset dokumentit kattavat saapuvat webhookit ja lähtevät webhook/API-pyynnöt vain HTTP:n yli, eivät natiiveja WebSocket-laukaisu- tai lähetysvaiheita. ¹⁴ Make:n viralliset dokumentit kattavat Webhooks-moduulit ja HTTP(S)-pyyntömoduulit, mutta en löytänyt natiivia WebSocket-laukaisinta tai lähetysmoduulia. ¹⁵ n8n:llä ei ole natiivia LLM-token-kustannusten seurantaa; yhteisön kiertotie-työnkulut ovat olemassa, mutta vaativat manuaalisen asennuksen ja suorituksen jälkeiset API-kutsut (avoin ominaisuuspyyntö toukokuusta 2026 alkaen). Zapier ei paljasta käyttäjille suorituskohtaista token-määrää tai USD-kustannusta; AI-vaiheet kuluttavat vain tehtäviä. Make.comin credits-hallintapaneeli heijastaa osittain token-kulutusta Make-isännöidylle AI:lle (elokuusta 2025 alkaen), mutta kolmannen osapuolen API-avainyhteydet laskutetaan 1 toiminto = 1 credit ilman token-laskentaa; suorituskohtaista USD-erittelyä mallin mukaan ei ole saatavilla. ¹⁶ Heym lähettää natiiveja OpenTelemetry-spanneja (yksi työnkulun suoritusta kohden plus yksi solmua kohden) OTLP/HTTP:n yli mihin tahansa yhteensopivaan taustajärjestelmään, W3C trace-context-propagaatiolla ja ilman instrumentointikoodia, konfiguroituna `HEYM_OTEL_*`-ympäristömuuttujien kautta ja oletuksena poistettuna käytöstä. n8n:llä on dokumentoitu OpenTelemetry-jäljitysintegraatio työnkulku- ja solmusuorituksille. Zapier ja Make.com eivät dokumentoi työnkulkujensa/skenaarioidensa suoritusten OpenTelemetry-vientiä kesäkuusta 2026 alkaen. ¹⁷ n8n dokumentoi Insights-hallintapaneelin tuotannon suoritusmittareille, Zapier dokumentoi Zap History -näkymän sekä Task Usage -näkymän ja Make.com dokumentoi Scenario History -näkymän; nämä ovat seuranta-/historiatasoja, eivät mukautettuja hallintapaneelin widgettejä, joita tukee mielivaltainen työnkulkulogiikka kuten Heymin Dashboard-välilehti. ¹⁸ Heym Workflow Analyzer suorittaa työnkulun, kun mahdollista, lukee suorituksen tuloksen ja luo jaetun muokattavan Markdown-raportin, joka kattaa parannusalueet, tarkoituksen ja vaiheittaisen toiminnan. n8n dokumentoi AI Workflow Builder -työkalun työnkulkujen luomiseen/hienosäätämiseen/vianmääritykseen, Zapier dokumentoi AI-vianmäärityksen virheellisille Zap-suorituksille ja Make.com dokumentoi skenaariohistorian sekä AI-agentin päättelyvaiheet, mutta niiden julkiset dokumentit eivät kuvaa samaa suoritustietoista jaettua työnkulkuanalyysidokumenttia. ¹⁹ [n8n All executions](https://docs.n8n.io/workflows/executions/all-executions/) luettelee käynnissä olevat suoritukset ja voi ladata tietoja edellisestä suorituksesta editoriin, kun taas [Zapier run statuses](https://help.zapier.com/hc/en-us/articles/20505304170637-Review-run-statuses-in-Zap-workflows) paljastaa käynnissä-tilan sen editorissa. [Make Scenario History](https://help.make.com/scenario-history) dokumentoi suorituksen tiedot ja lokit. Niiden julkinen dokumentaatio, tarkistettu 18. heinäkuuta 2026, ei kuvaa Heymin tarkkaa kulkua: avaa mielivaltainen käynnissä oleva tuotantosuoritus Historiasta tai Kanban-kortista, palauta sen nykyinen solmutason tilannekuva ja jatka solmuanimaation ja Debug-lokien vastaanottamista samalla canvasilla. ²⁰ Heymin [Codex](../nodes/codex-node.md)- ja [OpenCode Go](../nodes/opencode-go-node.md) -solmut suorittavat oikean koodausagentin CLI:n eristetyssä Heym-työtilassa GitHub-repositoriota vasten — kloonaa, muokkaa, tuottaa diffin, työntää haaran, avaa pull requestin — ensiluokkaisena työnkulun vaiheena. 20. heinäkuuta 2026 alkaen mikään kilpailija ei dokumentoi vastaavaa: n8n:n [OpenAI-solmu](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai) kattaa chat/assistant-API-kutsut, ei repositoriotason koodausagenttia, ja natiivi Codex-tuki on edelleen yhteisön pyyntö; Zapierin oma blogi dokumentoi päinvastaisen suunnan — [Codex ohjaa Zapier-työkaluja Zapier MCP:n kautta](https://zapier.com/blog/automate-codex-zapier-mcp/) — ei Codexia Zap-vaiheena; Make.comin OpenAI-moduulit paljastavat completions/assistants/batch-toiminnot, eivät koodausagenttia, joka kloonaa repoja ja avaa PR:iä. ²¹ Heymin [Board-välilehti](../tabs/board-tab.md) on sisäänrakennettu agenttinen Kanban-taulu, jonka sarakkeet suorittavat työnkulkuja ja jonka kortit kantavat kontekstia, keskusteluhistoriaa, suoritustilaa ja suorituksia. n8n ([Kanban Tool -integraatio](https://n8n.io/integrations/kanban-tool/)), Zapier ([Kanban Tool -integraatiot](https://zapier.com/apps/kanbantool/integrations)) ja Make.com ([Kanban Tool -integraatio](https://www.make.com/en/integrations/kanban-tool)) yhdistävät vain kolmannen osapuolen kanban-sovelluksiin, kuten Kanban Tool, Wekan tai NocoDB; mikään ei dokumentoi sisäänrakennettua taulua, joka suorittaa omia työnkulkujaan, 20. heinäkuuta 2026 alkaen. ²² n8n tallentaa suorituksen binääridatan sisäisesti (valinnaisesti [S3-yhteensopivaan ulkoiseen tallennustilaan](https://docs.n8n.io/hosting/scaling/external-storage/)), mutta ei dokumentoi käyttäjälle näkyvää tiedostoasemaa jakolinkeillä tai tiimijakamisella, joten se on merkitty rajoitetuksi. Zapierin [Files by Zapier](https://zapier.com/apps/files-by-zapier/integrations) käsittelee tiedostoja vain Zap-suorituksen keston ajan ja [Storage by Zapier](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps) säilyttää pieniä tekstiarvoja, joten Zapier on merkitty rajoitetuksi. Make.comin [data stores](https://help.make.com/l6du-data-stores) säilyttää jäsenneltyjä tietueita ja sen [file handling](https://help.make.com/working-with-files) välittää tiedostoja sovellusten välillä ilman pysyvää sisäänrakennettua tallennustilaa, joten Make on merkitty merkitsemättömäksi. ²³ Heymin [Playwright-solmu](../nodes/playwright-node.md) on ensimmäisen osapuolen selainautomaatio visuaalisella vaihetilalla, AI-generoiduilla vaiheilla ja täyskooditilalla. n8n tarjoaa vain yhteisön paketteja, kuten [n8n-playwright](https://github.com/toema/n8n-playwright), ja [ominaisuuspyyntö natiiveille selainautomaatiosolmuille](https://community.n8n.io/t/front-end-web-mobile-app-test-automation-nodes/129796) on edelleen avoin, joten se on merkitty rajoitetuksi. Zapier Agents voi [selata ja lukea sivuja verkkoselauksen ja Chrome-laajennuksen kautta](https://help.zapier.com/hc/en-us/articles/29025734470925-Use-Zapier-Agents-Chrome-extension), mutta Zapier ei dokumentoi skriptattua selainautomaatiovaihetta, joten se on merkitty rajoitetuksi. Make.com dokumentoi HTTP-moduulit ja kolmannen osapuolen scraping-sovellukset pikemminkin kuin mitään natiivia selainautomaatiomoduulia, 20. heinäkuuta 2026 alkaen.
## Aiheeseen liittyvät

- [Johdanto](./introduction.md) – Alustan yleiskatsaus
- [Pika-aloitus](./quick-start.md) – Rakenna ensimmäinen workflow
- [Workflow-analyysi](../reference/workflow-analysis.md) – Luo jaettuja ajon huomioivia workflow-raportteja ja parannusehdotuksia
- [Dashboard-välilehti](../tabs/dashboard-tab.md) – Rakenna workflow-pohjaisia dashboardeja tekoälyn luomilla kaaviowidgeteillä
- [Agent-solmu](../nodes/agent-node.md) – LLM-solmu työkalujen kutsumisella, MCP:llä ja taidoilla
- [Agent-arkkitehtuuri](../reference/agent-architecture.md) – Alagentit, orkestraattori ja työkalujen välitys
- [Board-välilehti](../tabs/board-tab.md) – Agenttinen Kanban-taulu workflow-suorittavilla sarakkeilla
- [Codex-solmu](../nodes/codex-node.md) – Suorita OpenAI Codex -koodausagentti GitHub-repositoriota vasten
- [OpenCode Go -solmu](../nodes/opencode-go-node.md) – Toimittajariippumaton koodausagentti kovennetussa kontissa
- [Drive-välilehti](../tabs/drive-tab.md) – Sisäänrakennettu tiedostotallennus jakolinkeillä, tiimeillä ja joukkotoiminnoilla
- [Playwright-solmu](../nodes/playwright-node.md) – Ensiosapuolen selainautomaatio tekoälyvaiheilla ja kooditilalla
- [RAG / Vector Store -solmu](../nodes/rag-node.md) – Vektorihaku ja dokumenttien lisäys (Qdrant tai Postgres pgvector)
- [AI Assistant](../reference/ai-assistant.md) – Luonnollisen kielen workflow-rakentaja
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Agentin tarkistuspisteet julkisilla arviointiosoitteilla
- [Guardrails](../reference/guardrails.md) – Estä turvattomat promptit ennen kuin ne saavuttavat mallit
- [Traces-välilehti](../tabs/traces-tab.md) – LLM-kutsujen havaittavuus
- [Evals-välilehti](../tabs/evals-tab.md) – Testisarjat tekoäly-workflowille
- [Alerts-välilehti](../tabs/alerts-tab.md) – Kynnysarvohälytykset virheistä, kestosta, kustannuksista ja ajomäärästä
- [OpenTelemetry Tracing](../reference/opentelemetry.md) – Vie ajo-, solmu- ja työkaluspanit OTLP:n kautta
- [Load Distribution](../reference/cluster.md) – Jaa ajot instanssien kesken johtajan vikasietoisuudella
- [Single Sign-On](../reference/sso.md) – Kirjaudu sisään minkä tahansa OpenID Connect -tarjoajan kautta
- [Audit Logging](../reference/audit.md) – Turvallisuuteen liittyvät toiminnot tekijän, kohteen ja lopputuloksen kanssa
- [Portal](../reference/portal.md) – Julkaise workflowt julkisina chat-käyttöliittyminä
- [Parallel Execution](../reference/parallel-execution.md) – DAG-pohjainen samanaikainen suoritus
- [MCP-välilehti](../tabs/mcp-tab.md) – MCP-palvelimen ja -asiakkaan kokoonpano
