# Lokit-välilehti

**Lokit**-välilehdessä näkyvät Docker-säiliöiden lokit Heym-stackille. Sitä voidaan käyttää virheenetsintään, seurantaan ja ongelmien ratkaisemiseen. Workflow-suorituslokeja (solmujen tulokset, outputit) varten käytä workflow-editorin Debug-paneelia – katso [Canvas-ominaisuudet](../reference/canvas-features.md#execution-logs).

Itse isännöidyissä asennuksissa Docker-pohjaiset lokit ovat oletusarvoisesti pois käytöstä. Ota ne käyttöön asettamalla `DOCKER_LOGS_ENABLED=true`, määrittämällä `DOCKER_LOGS_ALLOWED_EMAILS` pilkuin erotettuun luetteloon luotettujen käyttäjien sähköpostiosoitteista, joilla on oikeus Docker-lokeihin, ja varmistamalla, että `/var/run/docker.sock` on liitetty backend-säiliöön. Oletusarvoinen Docker Compose -palvelu ja suora `docker run` -esimerkki sisältävät tämän liitoksen Docker-pohjaisille MCP stdio -työkaluille; säilytä se vain, kun hyväksyt Docker-socketin luottamusrajan.

Jos rekisteröinti on auki, luo luotettu järjestelmänvalvojan tili ennen Docker-lokien käyttöönottoa tai säilytä `ALLOW_REGISTER=false`; muuten vahvistamaton itse rekisteröityminen voi varata sallittujen sähköpostiluetteloon kuuluvan osoitteen.

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Katso Lokit-esittely</a></p>

## Säiliön valinta

- **Kaikki säiliöt** – Yhdistetyt lokit backendistä, frontendistä ja PostgreSQL:stä
- **Backend** – `heym-backend`-säiliö
- **Frontend** – `heym-frontend`-säiliö
- **PostgreSQL** – `heym-postgres`-säiliö

## Lokitasosuodatin

- **Kaikki** – Näytä kaikki lokitasot
- **INFO** – INFO ja sitä korkeammat
- **VAROITUS** – Varoitukset ja virheet
- **VIRHE** – Vain virheet
- **DEBUG** – Debug ja sitä korkeammat

## Haku

- Suodata lokit tekstihaulla
- Osumat korostetaan lokitulosteessa

## Ominaisuudet

- **Automaattinen vieritys** – Vieritä automaattisesti alimpaan kohtaan uusien lokien saapuessa
- **Suoratoisto** – Näytä lokit reaaliajassa (kun tuettu)
- **Kopioi** – Kopioi lokit leikepöydälle
- **Lataa** – Lataa lokit tiedostona

## Käyttötarkoitukset

- Workflow-suorituksen virheiden debuggaaminen
- API-pyyntöjen ja vastausten lokien tarkastelu
- Tietokantakyselyiden seuranta
- Käynnistys- ja terveysviestien tarkistus

## Liittyvät

- [Canvas-ominaisuudet](../reference/canvas-features.md) – Suorituslokeja workflow:n Debug-paneelissa
- [Suoritukset-välilehti](./traces-tab.md) – LLM-suoritusketjujen tarkastelu
- [Analytiikka-välilehti](./analytics-tab.md) – Suoritusmittarit
- [Workflowt-välilehti](./workflows-tab.md) – Workflowjen hallinta
- [Kontekstuaalinen esittely](../reference/contextual-showcase.md) – Tiivis sivun opas hallintapaneelin pintoja varten
