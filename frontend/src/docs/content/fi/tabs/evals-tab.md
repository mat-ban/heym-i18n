# Arvioinnit-välilehti

**Arvioinnit**-välilehti on erillinen sivu osoitteessa `/evals`. Sen avulla voit luoda arviointisarjoja, määritellä testitapauksia ja suorittaa arviointeja [Agentti](../nodes/agent-node.md)-workfloweillesi.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Katso Arvioinnit-esittely</a></p>

## Käyttö

- Valitse **Arvioinnit** kojelaudan välilehtipalkista
- Tai siirry suoraan osoitteeseen `/evals`
- Tai käytä **Ctrl+K** (Cmd+K) ja valitse "Arvioinnit" komentovalikosta

## Arviointisarjat

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
- **Lämpötila** – Aseta mallin lämpötila (`Täsmällinen vastaavuus` ja `Sisältää`)
- **Päättelyyn käytetty vaiva** – Aseta päättelyvaiva päättelymalleille (`Täsmällinen vastaavuus` ja `Sisältää`)

### LLM-arvioijana

Arvioijan kanssa jokainen malli vastaa testisyötteeseen käyttäen vain sarjan promptia, minkä jälkeen arvioija arvioi kuinka lähellä vastaus on odotettua tulosta asteikolla 0-100:

- **Malliarvioija** (OpenAI, OpenAI-yhteensopiva tai Gemini) lukee kysymyksen, odotetun tuloksen ja vastauksen, ja palauttaa pisteytyksen yhden rivin perustelulla. Se suoritetaan lämpötilassa `0` tai `matala` päättelyvaivalla päättelymalleille, joten sama vastaus saa saman arvion.
- **Päätösmalli-arvioija** arvioi vastauksen viisiportaiseen rubriikkiin, asteikolla *Täysin väärin* - *Täysin oikein*. Pisteet ovat todennäköisyyspainotettu sijainti rubriikissa, joten ne tulevat mallin laskemasta jakaumasta eikä kirjoitetusta luvusta.

Solmun hover-kortti näyttää arvioijan perustelun tai päätösmallin tapauksessa tason, pisteet ja sen luottamuksen. Viive ja tokenit kuvaavat testattavaa mallia; arvioijan omat kutsut näkyvät [Suoritukset](./traces-tab.md) -välilehdellä **Arvioinnit**-lähteenä. Mallivalitsimessa ei näy Model Router -tunnistetietoja, koska arviointi vertailee tiettyjä malleja.

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
