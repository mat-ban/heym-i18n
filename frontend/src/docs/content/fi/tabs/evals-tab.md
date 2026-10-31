# Arvioinnit-välilehti

**Arvioinnit**-välilehti on erillinen sivu osoitteessa `/evals`. Sen avulla voit luoda arviointisarjoja, määritellä testitapauksia ja suorittaa arviointeja [Agentti](../nodes/agent-node.md)-workfloweillesi. [Agenttisarja](#agent-suites) suorittaa agentin tai lukee sen todelliset ajot sekä tarkistaa sen kutsumat työkalut, viiveen, USD-kustannukset, tokenit ja työkalukutsujen määrän.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Katso Arvioinnit-esittely</a></p>

## Käyttö

- Valitse **Arvioinnit** kojelaudan välilehtipalkista
- Tai siirry suoraan osoitteeseen `/evals`
- Tai käytä **Ctrl+K** (Cmd+K) ja valitse "Arvioinnit" komentovalikosta

## Arviointisarjat

- **Uusi sarja** – Valitse **Prompt-sarja** testataksesi järjestelmäkehytettä eri malleilla tai **Agenttisarja** tarkistaaksesi agentin todelliset ajot (katso [Agenttisarjat](#agent-suites))
- **Sarjavalitsin** – Listaa prompt- ja agenttisarjat tyyppeineen kunkin nimen vieressä; kirjoita hakeaksesi
- **Luo sarja** – Määrittele sarjalle nimi ja kuvaus
- **Valitse workflow** – Valitse arvioitava workflow
- **Valitse tunnistetiedot** – API-avain workflowin suorittamiseen
- **Järjestelmäprompt** – Muokkaa sarjatason järjestelmäpromptia suoraan vasemmassa panelissa
- **Optimoi Prompt** – Pyydä LLM:ää parantamaan nykyistä järjestelmäpromptia

## Testitapaukset

- Lisää testitapauksia syöteprompteineen ja odotettuine tuloksineen
- Jokaisella tapauksella voi olla mukautettu odotettu arvo vertailua varten
- Muokkaa tai poista tapauksia sarjasta
- **Luo testidataa** – Käytä valittuja tunnistetietoja/mallia luodaksesi automaattisesti testitapauksia sarjan promptista

## Arviointien suorittaminen

- **Valitse yksi tai useampi malli** – Suorita sama sarja useita malleja vastaan yhdessä arvioinnissa
- **Pisteytysmenetelmä** – Valitse `Täsmällinen vastaavuus`, `Sisältää` tai `LLM-arvioijana`
- **Arvioija** – `LLM-arvioijana` -tilassa voit valinnallisesti valita OpenAI-, OpenAI-yhteensopivan (Mukautettu), Gemini- (Google) tai [Päätösmalli](../nodes/decision-node.md) -tunnistetiedot ja kirjoittaa arvioijan mallin (esim. `gpt-4o-mini` tai `jev-latest`) pisteyttämään riippumattoman arvioijan avulla
- **Suorituksia per testi** – Toista jokainen testitapaus useita kertoja yhdessä suorituksessa
- **Muistetut asetukset** – Sarja avautuu uusimman ajonsa asetuksilla: tunnistetieto, mallit, pisteytysmenetelmä ja arvioija, lämpötila, päättelypanos ja ajot per testi. Aiemman ajon avaaminen lataa sen asetukset, jolloin **Suorita arvioinnit uudelleen** toistaa saman testin
- **Lämpötila** – Aseta mallin lämpötila (`Täsmällinen vastaavuus` ja `Sisältää`)
- **Päättelypanos** – Aseta päättelypanos päättelymalleille, väliltä Matala - Erittäin korkea ja Max samoin kuin LLM- ja Agent-solmuissa (`Exact Match` ja `Contains`)

### LLM-arvioijana

Arvioijan kanssa jokainen malli vastaa testisyötteeseen käyttäen vain sarjan promptia, minkä jälkeen arvioija arvioi kuinka lähellä vastaus on odotettua tulosta asteikolla 0-100:

- **Malliarvioija** (OpenAI, OpenAI-yhteensopiva tai Gemini) lukee kysymyksen, odotetun tuloksen ja vastauksen, ja palauttaa pisteytyksen yhden rivin perustelulla. Se suoritetaan lämpötilassa `0` tai `matala` päättelyvaivalla päättelymalleille, joten sama vastaus saa saman arvion.
- **Päätösmalli-arvioija** arvioi vastauksen viisiportaiseen rubriikkiin, asteikolla *Täysin väärin* - *Täysin oikein*. Pisteet ovat todennäköisyyspainotettu sijainti rubriikissa, joten ne tulevat mallin laskemasta jakaumasta eikä kirjoitetusta luvusta.

Solun leijuntakortti näyttää arvioijan perustelun tai päätösmallin osalta tason, pistemäärän ja sen luottamuksen. Viive ja tokenit kuvaavat testattavaa mallia; arvioijan omat kutsut näkyvät [Jäljityksissä](./traces-tab.md) lähteen **Arvioinnit** alla. Arvioijan valitsin jättää pois Model Router -tunnistetiedot, koska arvioijan on oltava yksi kiinteä malli. Testattavien mallien tunnistetietona voi olla [Model Router](../reference/credentials.md#model-router-auto-model): sen **Auto**-malli valitsee mallin pyyntökohtaisesti samalla tavalla kuin workflow'ssa.

Ilman arvioijaa jokainen malli vastaa ja pisteyttää oman vastauksensa yhdessä pyynnössä.

Lämpötila ja päättelyvaiva ovat piilotettuja tässä tilassa, ja suoritus käyttää kiinteitä asetuksia: lämpötila `0.7` standardimalleille ja `keskitaso` päättelyvaiva päättelymalleille (`matala` kun ne pisteyttävät omat vastauksensa).

## Tulokset

- Tarkastele hyväksytty/hylätty -tilaa testitapauksittain
- Tarkista todelliset vs. odotetut tulokset
- Vertaa mallikohtaisia tuloksia rinnakkain, kun suoritus sisältää useita malleja
- Tarkastele aiemmin suoritettujen arviointien historiaa; `LLM-arvioijana` -suoritus näyttää arvioijan mallin historialistassa
- Avaa historiallisia suorituksia tulospaneelista ja tarkastele tallennettuja promptti/syöte/tulos-näytteitä
- Aiemman suorituksen avaaminen lataa sen pisteytysmenetelmän ja arvioijan vasempaan paneeliin, joten **Suorita arvioinnit uudelleen** toistaa saman arvioinnin
- **Vie** lataa suorituksen JSON-muodossa, mukaan lukien `judge_credential_id` ja `judge_model`

## Agent Suites

Agenttisarja tarkistaa [Agent](../nodes/agent-node.md)-solmun sen ajojen perusteella. Se lukee ne [Jäljityksistä](./traces-tab.md), joihin jokainen ajo tallentaa jo valmiiksi aikansa, tokeninsa, kustannuksensa ja työkalukutsunsa, ja voi myös suorittaa workflow'n puolestasi.

Luo sarja valitsemalla **Uusi sarja** → **Agenttisarja** ja seuraa kolmea vaihetta:

1. **Agentti** – Valitse workflow ja sen jälkeen sen agenttisolmu. Vain agenttisolmulliset workflow't listataan; workflow tai agentti, jota ei ole vielä suoritettu, näytetään mutta sitä ei voi valita. Valitun agentin asetukset (malli, ohjeet, työkalut ja rajat) näkyvät oikealla, ja alla näkyy sen workflow'n vain luku -kangas korostetulla agentilla.
2. **Baseline** – Agentin viimeiset 10 ajoa: viiveen p50 ja p95, kustannus ajoa kohden, tokenit ajoa kohden ja työkalukutsut ajoa kohden, mitä työkaluja kutsuttiin ja kuinka usein, sekä kunkin ajon omat luvut. Virheeseen päättyneet ajot luetellaan, mutta ne jätetään pois baseline-vertailupohjasta.
3. **Tarkistukset** – Merkitse kukin työkalu **Must call**, **Must not call** tai **Either**. Jokainen kutsutyyppi luetellaan tyyppeineen: Python- ja solmutyökalut, **MCP**-työkalut palvelimineen, **ala-agentit** tunnisteen mukaan, **ali-workflow't** nimen mukaan ja **skills**. Lisää työkalu tyypin ja nimen mukaan, jos sitä ei ole vielä suoritettu, ja poista se **X**-painikkeella. Aseta ylärajat viiveelle, kustannukselle, kokonaistokeneille ja työkalukutsuille; kukin alkaa 20 % baseline-p95-arvon yläpuolelta ja voidaan poistaa käytöstä.

Tallennettu sarja avautuu **Tulokset**-näkymään, jonka vieressä ovat **Baseline** ja **Muokkaa tarkistuksia**:

- **Suorita workflow** – Valitse ajojen määrä (enintään 20); neljä suoritetaan samanaikaisesti. Syötteet täytetään workflow'n viimeisimmästä ajosta ja niitä voidaan muokata, ja jokainen ajo käyttää niitä. Kytke päälle **Luo syötteitä** (kipinäkuvake) ja valitse sitten tunnistetieto ja malli, jotta malli luo eri syötteen jokaista ajoa varten. Se lukee agentin järjestelmäohjeet ja pysyy lähellä syöttämiäsi arvoja: kaupungin nimen kirjoittaminen tuottaa muita kaupunkien nimiä. Jokainen ajo suorittaa koko workflow'n kuten mikä tahansa tavallinen ajo ja näkyy Suoritushistoriassa triggerillä `agent_suite`. Jos haluat ohittaa myöhemmät vaiheet, kuten sähköpostin lähettämisen, avaa workflow paneelin painikkeella **Siirry workflow'hun** ja poista kyseiset solmut ensin käytöstä. **Pysäytä** päättää sarjan ajon: uusia ajoja ei käynnistetä ja käynnissä olevat perutaan. Sarja-ajo, jonka palvelin pysähtyi esimerkiksi uudelleenkäynnistyksen aikana, näkyy keskeytettynä minuutin kuluttua sen sijaan, että se jäisi jumiin.
- **Tulokset** – Uusin sarja-ajo pisteytetään oletusarvoisesti. Jokainen sarja-ajo säilytetään päivämäärineen ajovalitsimessa, josta voit avata tai poistaa sen; tai vaihda agentin viimeiseen 10, 20 tai 50 ajoon sisällyttääksesi sen muut ajot. Näet läpäisyasteen, kuinka usein kukin tarkistus meni läpi, viiveen, kustannukset, tokenit ja työkalukutsut tallennetun baseline-arvon vieressä sekä jokaisen ajon epäonnistumisen syyn ja linkin sen jäljitykseen.
- **Siirry workflow'hun** avaa agentin workflow'n uudessa välilehdessä. Nimikentässä **Esc** tai **X** tyhjentää tekstin.

Miten lukuja tulkitaan:

- **Viive** on mallin aika lisättynä ajon työkalukutsujen kestolla.
- **Kustannus** käyttää samoja hintoja kuin Traces. Mallin ajo ilman määritettyä hintaa ohittaa kustannustarkistuksen virheen sijaan.
- Ajo **läpäistään**, kun se valmistui virheettömästi ja jokainen tarkistus meni läpi.
- Sarja lukee vain omia jäljityksiäsi, sama sääntö kuin Jäljitykset-välilehdellä.
- **Käytä viimeisimpiä ajoja vertailupohjana** kohdassa **Muokkaa tarkistuksia** korvaa tallennetun baseline-arvon agentin viimeisimmillä ajoilla.

Sarjan baseline on peräisin yhdestä kolmesta lähteestä. **Muokkaa tarkistuksia** näyttää aktiivisen vaihtoehdon kohdan **Tallennettu vertailupohja** vieressä:

- agentin viimeisimmät ajot (oletus ja arvo, jonka **Käytä viimeisimpiä ajoja vertailupohjana** ottaa),
- yksi valmistunut sarjan ajo,
- käsin syötetyt arvot.

Kaksi jälkimmäistä asetetaan [Chat](./chat-tab.md#working-with-evals)-näkymästä tai API:n kautta:

- `PATCH /api/evals/agent-suites/{id}` ottaa vastaan `baseline: {"source": "suite_run", "run_id": "…"}` tai `{"source": "manual", "values": {"latency_p95_ms": 3000, "cost_avg_usd": 0.01}}`.
- `POST /api/evals/agent-suites/{id}/runs` ottaa vastaan `inputs_list`: yhden syöteobjektin ajoa kohden, enintään 20.

### Chatista ja MCP:stä

[Chat](./chat-tab.md#working-with-evals) ja MCP-työkalu `heym_chat` voivat luoda, muokata ja suorittaa prompt- ja agenttisarjoja:

- Ne laativat testitapaukset ja ajojen syötteet itse.
- Ne kysyvät käytettävää tunnistetietoa ennen prompt-sarjan luomista, ellei vain yksi sovi.
- Ne linkittävät jokaisen tällä sivulla mainitsemansa sarjan.

## Vertailumatriisin ideoita

Kun rakennat vertailumatriisia agenttiworkfloweille, sisällytä HITL-skenaariot ensiluokkaisina tapauksina sen sijaan, että käsittelisit niitä reunatapauksina.

- Käsittele kaikki kolme tarkistuspäätöstä: `hyväksytty`, `muokattu` ja `hylätty`
- Sisällytä useita laukaisulähteitä, kuten editorisuoritukset, portaali, curl/webhook ja cron-laukaisemat suoritukset
- Lisää toistuvia tarkistusskenaarioita, joissa agenttisuoitus pysähtyy useammin kuin kerran
- Varmista ilmoitushaarat, jotka liittyvät agentin `review`-tulokseen
- Vahvista alavirran toiminta hylkäyksen jälkeen, erityisesti jos myöhemmät solmut haarautuvat `$agent.decision` -arvoon

## Liittyvät aiheet

- [Miksi Heym](../getting-started/why-heym.md) – Arvioinnit agenttielämänkaaren testausvaiheena
- [Agenttisolmu](../nodes/agent-node.md) – Arvioitavat workflowt
- [Tunnistetiedot-välilehti](./credentials-tab.md) – Arviointien suoritustunnistetiedot
- [Suoritukset-välilehti](./traces-tab.md) – Yksityiskohtainen suoritustarkastelu
- [Workflowt-välilehti](./workflows-tab.md) – Luo arvioitavia workflowja
- [Suoritushistoria](../reference/execution-history.md) – Tarkastele aiemmin suoritettuja workflowja (Historia-painike otsikossa)
- [Kontekstuaalinen esittely](../reference/contextual-showcase.md) – Tiivis sivun opas saatavilla arviointisivulla
