# Suorittaminen ja käyttöönotto

Heym tarjoaa kaksi skriptiä eri ympäristöille: `run.sh` paikalliseen kehitykseen ja `deploy.sh` tuotantokäyttöönottoihin Docker Composen avulla.

> **Videokatsaus:** [Set Up Heym Locally in Under 2 Minutes](https://www.youtube.com/watch?v=P6YvlupUboU) — kloonaa repositorio, käynnistä PostgreSQL, täytä tarvittavat ympäristömuuttujat ja luo ensimmäinen tilisi paikallisessa instanssissa.

## Edellytykset

Molemmat skriptit edellyttävät seuraavien työkalujen asentamista:

| Työkalu | Käyttötarkoitus |
|------|---------|
| [Docker](https://docs.docker.com/get-docker/) | Tietokantasäiliö (kehitys) ja koko stack (tuotanto) |
| [uv](https://github.com/astral-sh/uv) | Python-paketinhallinta backendille |
| [bun](https://bun.sh) | JavaScript-ajoympäristö frontendille |

## Ympäristön määrittäminen

Sekä `run.sh` että `deploy.sh` lukevat projektin juuressa sijaitsevaa `.env`-tiedostoa. Jos sitä ei ole olemassa, skripti luo sellaisen automaattisesti `.env.example`-tiedostosta — sekä paikallista kehitystä että tuotantoa varten.

`SECRET_KEY` ja `ENCRYPTION_KEY` toimitetaan tyhjinä `.env.example`-tiedostossa. Kun jompikumpi on tyhjä, `run.sh` ja `deploy.sh` luovat kryptografisesti vahvan arvon automaattisesti ja kirjoittavat sen takaisin `.env`-tiedostoon, joten uusi asennus ei vaadi manuaalista avainten käsittelyä. Jos olemassa oleva `.env` sisältää edelleen vanhan `ENCRYPTION_KEY`-paikkamerkin (`change_this_to_a_random_32_byte_hex_value`), skriptit pysähtyvät eksplisiittiseen virheeseen sen ylikirjoittamisen sijaan — kyseisen avaimen vaihtaminen tekisi aiemmin salatuista tunnistetiedoista lukukelvottomia. Myös backend itse kieltäytyy käynnistymästä, jos jompikumpi avain on tyhjä tai jätetty tunnettuun paikkamerkkiin.

Tiedoston luominen manuaalisesti (valinnainen — skriptit tekevät tämän puolestasi):

```bash
cp .env.example .env
```

Keskeiset ympäristömuuttujat:

Kaikista tuetuista muuttujista, oletusarvoista ja tuotantohuomautuksista katso [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Muuttuja | Kuvaus |
|----------|-------------|
| `SECRET_KEY` | **Pakollinen.** JWT-allekirjoituksen salaisuus. `run.sh`/`deploy.sh` luo automaattisesti, kun tyhjä. |
| `ENCRYPTION_KEY` | **Pakollinen.** Tunnistetietojen salausavain. `run.sh`/`deploy.sh` luo automaattisesti, kun tyhjä. |
| `DATABASE_URL` | Valinnainen tietokantayhteyden merkkijonon ohitus. Jos tyhjä, Heym muodostaa sen `POSTGRES_*`-asetuksista. |
| `BACKEND_PORT` | Backend API -portti — oletusarvo `10105` |
| `FRONTEND_PORT` | Frontend-portti — oletusarvo `4017` |
| `FRONTEND_URL` | **Pakollinen tuotannossa.** Sovelluksen julkinen URL (skeema + isäntä, esim. `https://heym.example.com`). Käytetään OAuth-uudelleenohjaus-URI:hin (Google Sheets, BigQuery, Notion ja vastaavat) sekä arvostelu-, Codex-jatko- ja tiedostolinkkeihin, joita taustalla ajettavat prosessit luovat; täytyy vastata URL-osoitetta, jota käyttäjät käyttävät selaimessa. Klusterissa aseta sama arvo jokaiseen instanssiin. |
| `ALLOW_REGISTER` | Avoin käyttäjärekisteröinti (`false` tuotannossa, `true` kehityksessä). Aseta arvoksi `false` vasta, kun ylläpitäjätilisi on olemassa — ensimmäisen käyttäjän alustusta ei ole, joten tyhjä tietokanta ja poistettu rekisteröinti eivät jätä mitään tapaa luoda sellaista. |
| `DOCKER_LOGS_ENABLED` | Ottaa Docker-pohjaisen Logs-välilehden käytön käyttöön, kun arvoksi on asetettu `true`; vaatii myös Docker-socket-pääsyn |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Pilkuilla erotettu luettelo luotettujen käyttäjien sähköpostiosoitteista, joilla on pääsy Docker-lokeihin, kun `DOCKER_LOGS_ENABLED=true` |
| `REQUEST_BODY_MAX_SIZE_MB` | Suurin HTTP-pyynnön rungon koko, joka hyväksytään ennen endpoint-käsittelijöiden suorittamista; oletusarvo `100`, yhden MB:n verran suurempi kuin `FILE_MAX_SIZE_MB`, jotta multipart-ylikustannuksille jää tilaa |
| `HEYM_PYTHON_TOOL_SANDBOX` | Miten käyttäjän määrittämät Python-työkalut suoritetaan: `auto` (oletus — kovennettu, eristetty Docker-säiliö; epäonnistuu suljetusti, jos Docker ei ole käytettävissä), `docker` (sama, ei koskaan palaa varamenetelmään) tai `subprocess` (prosessin sisäinen paikallinen varamenetelmä; ei tietoturvaraja, vain luotettu/kehityskäyttö). `run.sh` asettaa `subprocess` natiivikehitystä varten. Katso [Security](../reference/security.md#python-tool-sandbox). |
| `HEYM_PYTHON_TOOL_IMAGE` | Image, jota käytetään Python-työkalun Docker-hiekkalaatikossa. Tyhjä = tunnista automaattisesti käynnissä oleva backend-image. |

Tietokantayhteyden oletusarvot (`POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) on dokumentoitu tiedostossa [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) ja `.env.example`.

---
## Kehitys: `run.sh`

`run.sh` käynnistää kaikki kolme palvelua paikallisesti — tietokannan (Docker-konttina), FastAPI-taustaosan ja Vite-kehityspalvelimen — yhdellä komennolla.

```bash
./run.sh
```

**Mitä se tekee, vaihe vaiheelta:**

1. Tarkistaa, että `docker`, `bun` ja `uv` ovat käytettävissä
2. Luo `.env`-tiedoston `.env.example`-tiedostosta, jos se puuttuu, ja generoi satunnaisen `SECRET_KEY`- ja `ENCRYPTION_KEY`-arvon, kun jompikumpi on tyhjä
3. Käynnistää (tai luo) tietokannan Docker-kontin portissa `6543` ja tallentaa sen tiedot `heym-postgres-data`-Docker-volyymiin isäntäkansion sijaan
4. Asentaa Python-riippuvuudet komennolla `uv sync`
5. Suorittaa Alembic-tietokantamigraatiot (`alembic upgrade head`)
6. Vapauttaa taustaosan ja frontendin portit, jos ne ovat varattuja
7. Käynnistää FastAPI-taustaosan `--reload`-valinnalla (hot-reload koodimuutoksille)
8. Asentaa frontend-riippuvuudet komennolla `bun install`
9. Käynnistää Vite-kehityspalvelimen

**Valinnat:**

| Valinta | Kuvaus |
|------|-------------|
| *(ei mitään)* | Käynnistys debug-lokituksella (`LOG_LEVEL=DEBUG`) |
| `--no-debug` | Käynnistys oletuslokitasolla (ei debug-tulostetta) |
| `--help` | Näytä käyttöohjeet |

**Palveluosoitteet (kehitys):**

| Palvelu | Osoite |
|---------|---------|
| Frontend | `localhost` portissa `FRONTEND_PORT` (oletus: 4017) |
| Backend API | `localhost` portissa `BACKEND_PORT` (oletus: 10105) |
| Interaktiivinen API-dokumentaatio | `localhost:10105/docs` |
| Tietokanta | `localhost:6543` |

Paina `Ctrl+C` pysäyttääksesi kaikki palvelut hallitusti.

---

## End-to-End-testit: `run_e2e.sh`

Frontendin Playwright-testisarja ajetaan oikeaa Vue-sovellusta, FastAPI-taustaosaa ja eristettyä PostgreSQL-tietokantaa vasten:

```bash
./run_e2e.sh
```

Testisarja on keskeisten polkujen savu- ja regressiotestisarja, ei kattava tuotetestaus. Se kattaa autentikoinnin, keskeisten workflow-työnkulkujen elinkaaren ja suorituksen, valitut dashboard-resurssit, julkiset reitit ja mockatun HITL-arviointikäyttöliittymän. Palveluntarjoajaintegraatiot, kaikki solmutyypit, jakamis- ja käyttöoikeusmatriisit sekä täysi HITL-jatkosuoritus ovat edelleen pääasiassa taustaosan testien kattamia tai vaativat erilliset integraatioympäristöt.

Jokainen ajo saa oman väliaikaisen PostgreSQL 16 -kontin, satunnaiset käytettävissä olevat tietokanta-, taustaosa- ja frontend-portit, autentikointitilan, testitulokset ja HTML-raportin. Tämä mahdollistaa useiden `run_e2e.sh`-prosessien samanaikaisen suorittamisen ilman tilan jakamista tai artefaktien ylikirjoittamista. Skripti poistaa tietokantakonttinsa, kun ajo päättyy, ja tulostaa artefaktihakemiston ja raportin polun.

Hyödyllisiä komentoja:

```bash
./run_e2e.sh --ui         # Interaktiivinen Playwright-suorittaja eristetyllä tietokannalla
cd frontend
bun run test:e2e:report   # Avaa viimeisin paikallinen ajo
```

Suorat `bun run test:e2e`- ja `bun run test:e2e:ui`-ajot vaativat eksplisiittisen `DATABASE_URL`-arvon, jotta ne eivät voi vahingossa käynnistyä paikallista kehitystietokantaa vasten. Käytä `./run_e2e.sh`-skriptiä normaaleihin paikallisiin ajoihin.

`./check.sh` suorittaa linttauksen, tyyppitarkistuksen, muotoilun ja taustaosan testit ilman E2E-testisarjaa pitäen oletuspaikallisen tarkistuspolun nopeana. Suorita Playwright E2E -testit erikseen komennolla `./run_e2e.sh`. Pull requestit suorittavat aina Chromium E2E -testisarjan GitHub Actionsissa ja säilyttävät jäljet, kuvakaappaukset, videot ja HTML-raportin, kun virheitä ilmenee.

---
## Tuotanto: `deploy.sh`

`deploy.sh` rakentaa ja käynnistää koko stackin Docker Composen avulla. Kaikki kolme palvelua — tietokanta, backend ja frontend — toimivat kontteina. Backendin entrypoint suorittaa automaattisesti migraatiot ennen palvelimen käynnistämistä 8 workerilla.

**Ensimmäinen käyttöönotto (build + käynnistys):**

```bash
./deploy.sh
```

Tämä suorittaa käyttökatkottoman käyttöönoton: imaget rakennetaan ensin olemassa olevien konttien pyöriessä, minkä jälkeen uusi versio vaihdetaan tilalle.

**Käytettävissä olevat komennot:**

| Komento | Kuvaus |
|---------|-------------|
| `./deploy.sh` | Rakenna imaget ja käynnistä/päivitä kaikki palvelut |
| `./deploy.sh --status` | Näytä konttien tila |
| `./deploy.sh --logs` | Suoratoista lokeja kaikista konteista |
| `./deploy.sh --restart` | Käynnistä kaikki kontit uudelleen |
| `./deploy.sh --down` | Pysäytä ja poista kaikki kontit |
| `./deploy.sh --migrate-pgdata` | Kertaluonteinen migraatio: kopioi olemassa oleva `data/postgres` -hakemisto `heym-postgres-data` Docker-volumeen ja rakenna sen indeksit uudelleen |
| `./deploy.sh --help` | Näytä käyttöohjeet |

**Tietokannan tallennus: Dockerin nimetty volume, ei isäntähakemisto.**

Compose tallentaa PostgreSQL:n `heym-postgres-data` Docker-volumeen. Aiemmat versiot liittivät isäntähakemiston `./data/postgres` bind-mountilla. Isäntään tehdyt bind-mountit macOS:llä (virtiofs) ja Windows/WSL2:lla eivät tarjoa PostgreSQL:lle sen vaatimia `fsync`- ja tiedoston sulkemisen takuita: klusterit näissä ympäristöissä kohtaavat `PANIC: could not close file … Input/output error` -virheen WAL-segmenteissä ja korruptoituvat ajan myötä. Linuxin bind-mountit eivät olleet koskaan vaikutuksen alaisia, mutta nyt kaikki alustat käyttävät samaa asettelua.

Käyttöönoton päivittäminen, jossa data on edelleen `./data/postgres` -hakemistossa, on kertaluonteinen toimenpide. `./deploy.sh` havaitsee sen, pysähtyy ennen rakentamista ja pyytää suorittamaan migraation ensin:

```bash
./deploy.sh --migrate-pgdata   # pysäytä palvelut, kopioi volumeen, rakenna indeksit uudelleen
./deploy.sh                    # ota käyttöön tavalliseen tapaan
```

**Migraatio rakentaa myös indeksit uudelleen.** Kopio on tavu-tavulta, joten vanhan bind-mountin aiheuttamat indeksivauriot siirtyvät mukana. Siksi `--migrate-pgdata` käynnistää `postgres`-palvelun yksinään uudella volumella, suorittaa `reindexdb`:n sitä vasten ja pysäyttää sen jälleen ennen kuin muu stack käynnistyy. Tämä on tärkeää, koska tämän tyyppinen korruptio jättää indeksimerkinnät osoittamaan heapin loppuun — tila, jonka `pg_amcheck` raportoi puhtaaksi, joten läpäisty tarkistus ei ole todiste terveestä taulusta. REINDEX korjaa kyseiset merkinnät; se ei voi palauttaa heap-sivuja, jotka vanha tiedostojärjestelmä on jo menettänyt. Suuressa, tunnetusti terveessä tietokannassa uudelleenrakennuksen voi ohittaa komennolla `./deploy.sh --migrate-pgdata --skip-reindex`.

Kopio ei ole tuhoava. `./data/postgres` jää paikoilleen varmuuskopioksi, eikä migraatio ylikirjoita volumea, joka jo sisältää tietokannan. Jos jokin vaihe epäonnistuu, uusi volume poistetaan, joten puoliksi migroitua klusteria ei voi koskaan ottaa käyttöön vahingossa. Vanha hakemisto voidaan poistaa, kun workflow:jen toimivuus on varmistettu. Myös `postgres`-kontissa on sama suojaus, joten manuaalinen `docker compose up` ei voi hiljaisesti alustaa tyhjää tietokantaa datan päälle. Uudet asennukset eivät vaadi toimenpiteitä.

**Palveluosoitteet (tuotanto):**

Frontend-kontti on julki `FRONTEND_PORT`-portissa (oletus: 4017). Backendin API tarjoillaan `/api`-polun alla frontend-kontin kautta välitettynä — tuotannossa on siis vain yksi julkinen portti.

**Konttien yleiskatsaus:**

| Kontti | Kuvaus |
|-----------|-------------|
| `heym-db` | Relaatiotietokanta |
| `heym-backend` | FastAPI API -palvelin (8 workeria, rakennettu `backend/Dockerfile`:stä) |
| `heym-frontend` | Frontend-esikatselukontti, joka tarjoilee rakennettua Vue-sovellusta (rakennettu `frontend/Dockerfile`:stä) |

**Versiopäivityksen merkki:**

Sovelluksen ylätunniste näyttää käynnissä olevan Docker-buildin version. Kun kyseinen versio on jäljessä uusimmasta Heym GitHub -julkaisusta, version viereen ilmestyy violetti **Update**-merkki. Napsauttamalla versiota tai merkkiä avautuu Heym GitHub -julkaisusivu.

---
## Valmiiksi rakennettu image: `docker run`

Jos sovellusta ei haluta rakentaa paikallisesti, julkaistu kontti-image voidaan noutaa ja suorittaa suoraan.

Image käynnistää frontendin ja backendin yhdessä kontissa. PostgreSQL on edelleen ulkoinen, mutta käyttöön voidaan antaa joko `DATABASE_URL` tai `.env.example`-tiedoston `POSTGRES_*`-muuttujat.

> **Tallenna tietokanta Dockerin nimettyyn volumeen.** Julkaisuimage ei sisällä tietokantaa, joten `DATABASE_URL`:n takana oleva PostgreSQL on käyttäjän vastuulla. Se tulee liittää muodossa `-v heym-postgres-data:/var/lib/postgresql/data` isäntäpolun sijaan: macOS:llä (virtiofs) ja Windows/WSL2:lla bind-mountattu PostgreSQL-tietohakemisto ei noudata tietokannan vaatimia `fsync`-takeita ja korruptoi klusterin ajan myötä.

> **Vector store -taustajärjestelmä.** `run.sh` ja `deploy.sh` suorittavat virallisen `postgres:16`-imagen ja asentavat automaattisesti `postgresql-16-pgvector`-paketin käynnistyksen yhteydessä, joten **Postgres (pgvector) RAG -taustajärjestelmä** toimii niissä suoraan ilman muutoksia tietoihin. Valmiiksi rakennettu yhden kontin image sen sijaan yhdistää **käyttäjän** tarjoamaan PostgreSQL:ään — kyseisen tietokannan on tuettava `vector`-laajennusta Postgres-taustajärjestelmän käyttämiseksi. Heym ei voi asentaa pgvectoria tietokantaan, jota se ei hallinnoi. Ilman sitä käynnistyksen migraatio ohittaa pgvector-taulun sujuvasti — käyttöönotto onnistuu silti, Qdrant RAG toimii edelleen, ja Postgres-vektorivarastoon luominen tai lataaminen palauttaa selkeän "backend unavailable" -viestin, kunnes pgvector on otettu käyttöön.

**Aseta avaimet itse suoria image-ajoja varten.** Toisin kuin `run.sh`/`deploy.sh`, valmiiksi rakennettu image ei luo avaimia automaattisesti. Kun `cp .env.example .env` on suoritettu, täytä kaksi tyhjää avainta (korvaaminen paikan päällä välttää päällekkäiset merkinnät):

```bash
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
ENCRYPTION_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
sed -i.bak "s|^SECRET_KEY=.*|SECRET_KEY=${SECRET_KEY}|; s|^ENCRYPTION_KEY=.*|ENCRYPTION_KEY=${ENCRYPTION_KEY}|" .env && rm -f .env.bak
```

```bash
docker pull ghcr.io/heymrun/heym:latest

docker run --rm \
  --env-file .env \
  -p 4017:4017 \
  --shm-size 2g \
  -e FILE_STORAGE_DIR=/app/data/files \
  -e HEYM_PLUGINS_DIR=/app/data/plugins \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$(pwd)/data/files:/app/data/files" \
  -v "$(pwd)/data/plugins:/app/data/plugins" \
  -v heym-codex-workspaces:/app/data/codex-workspaces \
  -v heym-opencode-workspaces:/app/data/opencode-workspaces \
  ghcr.io/heymrun/heym:latest
```

> **Muuta tiedosto- ja liitännäisliitokset absoluuttisiksi.** `FILE_STORAGE_DIR` ja `HEYM_PLUGINS_DIR` oletusarvoisesti käyttävät suhteellisia polkuja `./data/files` ja `data/plugins`, ja julkaisuimage käynnistää backendin hakemistosta `/app/backend`. Suhteellisina ne ratkeavat poluiksi `/app/backend/data/files` ja `/app/backend/data/plugins`, joten kaksi yllä olevaa bind-mountia eivät vastaanota mitään ja lataukset menetetään, kun kontti korvataan. `-e`-valitsimet ohittavat `.env.example`-tiedoston `--env-file`-kautta toimittamat suhteelliset arvot, koska komentorivin `-e` voittaa `--env-file`-asetuksen. Compose (`./deploy.sh`) ei tätä tarvitse: kyseinen image suorittaa backendin hakemistosta `/app`, jossa suhteelliset oletusarvot osuvat jo liitoksiin.

> **Docker-socketin käyttöoikeus.** `/var/run/docker.sock`-liitos antaa backendille laajan hallinnan isännän Docker-daemoniin. Oletusarvoinen Docker Compose -palvelu ja suora `docker run` -esimerkki sisältävät sen Docker-pohjaisia MCP stdio -työkaluja varten, jotka suorittavat `docker`-komentoja. Logs-välilehti vaatii edelleen `DOCKER_LOGS_ENABLED=true` ja `DOCKER_LOGS_ALLOWED_EMAILS` -asetuksen, jossa on pilkuin eroteltu luotettujen käyttäjäsähköpostien luettelo. Luo luotettu ylläpitäjätili ennen Docker-lokien käyttöönottoa tai pidä `ALLOW_REGISTER=false`, jotta vahvistamaton itse rekisteröityminen ei voi vallata sallittujen luettelossa olevaa sähköpostia. Käyttäjän määrittämät Python-työkalut **eivät** saa tätä socketia: ne suoritetaan erillisessä kovennetussa kontissa ilman Docker-socketia. Katso [Security](../reference/security.md#python-tool-sandbox).

> **Codex-runner.** Codex-solmu käyttää samaa `ghcr.io/heymrun/heym`-imagea sisar-runner-konttina (`--entrypoint codex`), jotta Codexin Linux-hiekkalaatikko voi luoda nimiavaruuksia. Säilytä `heym-codex-workspaces`-volume-liitos, jos Codex-työnkulkuja halutaan suorassa image-asetelmassa; runner ei vastaanota Docker-socketia eikä backendin salaisuuksia.

> **OpenCode Go -runner.** OpenCode Go -solmu käyttää samaa imagea kovennettuna sisar-runnerina (`--entrypoint opencode`), joka jakaa `heym-opencode-workspaces`-volumen. Säilytä kyseinen volume-liitos, jos OpenCode-työnkulkuja halutaan suorassa image-asetelmassa; runner ei vastaanota Docker-socketia eikä GitHub-tokenia.

> **Skill-hiekkalaatikko.** Agent-solmun Python-skillit suoritetaan kovennetussa sisarkontissa, joka jakaa `heym-codex-workspaces`-volumen, joten säilytä kyseinen volume-liitos myös skilleille — ei vain Codexille. Jokainen ajo saa eristetyn aokohtaisen alipolun, eikä sisar vastaanota Docker-socketia eikä backendin salaisuuksia. Tämä vaatii **Docker Engine 25.0+** -version; vanhemmilla engineillä tai ilman volumea `HEYM_PYTHON_TOOL_SANDBOX=auto` epäonnistuu suljetusti — aseta `HEYM_PYTHON_TOOL_SANDBOX=subprocess` vain luotetuissa yhden käyttäjän asetelmissa. Katso [Security](../reference/security.md#skill-sandbox).
> **`--shm-size 2g` vaaditaan Playwrightille.** Docker antaa kontille 64 Mt `/dev/shm`-tilaa, ja Chromium kaataa renderöijänsä tämän rajan alapuolella. Solmupohjaiset Playwright-solmut ajavat Chromiumia aliprosessina tässä kontissa, joten raja on tämän kontin raja; mukautettu `playwrightCode` ajetaan sisarkontissa, joka asettaa omansa. `docker-compose.yml` määrittelee jo `shm_size: "2gb"`, joten `run.sh` ja `deploy.sh` eivät ole vaikutuksen alaisia — vain pelkkä `docker run` tarvitsee valitsimen.

> **Playwright Run Code.** Mukautettu Playwright Python tarvitsee `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true` ja yllä mainitun Docker-socket-liitoksen. Julkaisuimage asettaa `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` / `HEYM_PLAYWRIGHT_SANDBOX_PYTHON` GHCR-asettelua varten (`/app/backend/.venv`). Compose `./deploy.sh` asettaa sandbox-imagen oletusarvoksi `heym-backend:local`. Säilytä `--no-sandbox` Chromiumin käynnistysargumenteissa sandbox-konttien sisällä.

**Vähimmäisympäristömuuttujat suoriin image-ajoihin:**

| Muuttuja | Pakollinen | Tarkoitus |
|----------|----------|---------|
| `DATABASE_URL` | Valinnainen | Täysi PostgreSQL-yhteysmerkkijonon ohitus |
| `POSTGRES_HOST` | Kyllä, jos `DATABASE_URL` on tyhjä | PostgreSQL-isäntä |
| `POSTGRES_PORT` | Kyllä, jos `DATABASE_URL` on tyhjä | PostgreSQL-portti |
| `POSTGRES_USER` | Kyllä, jos `DATABASE_URL` on tyhjä | PostgreSQL-käyttäjätunnus |
| `POSTGRES_PASSWORD` | Kyllä, jos `DATABASE_URL` on tyhjä | PostgreSQL-salasana |
| `POSTGRES_DB` | Kyllä, jos `DATABASE_URL` on tyhjä | PostgreSQL-tietokannan nimi |
| `SECRET_KEY` | Kyllä | JWT-allekirjoitussalaisuus |
| `ENCRYPTION_KEY` | Kyllä | Tunnistetietojen salausavain |
| `FRONTEND_URL` | Suositeltu | Julkinen selain-URL, erityisesti OAuth-paluukutsuja varten |
| `CORS_ORIGINS` | Suositeltu | Sallitut selainoriginit |
| `FILE_STORAGE_DIR` | Suositeltu | Aseta absoluuttiseksi `/app/data/files`, kun liität kyseisen polun; suhteellinen `./data/files`-oletusarvo ratkeaa tässä imagessa `/app/backend`-hakemistoon ja ohittaa liitoksen |
| `ALLOW_REGISTER` | Suositeltu | Aseta `false` tuotannossa, ellei avointa rekisteröitymistä ole tarkoitus sallia, mutta vasta kun ylläpitäjätilisi on olemassa — ensimmäisen käyttäjän bootstrap-toimintoa ei ole |
| `DOCKER_LOGS_ENABLED` | Valinnainen | Aseta `true`, jotta Logs-välilehti voi käyttää Docker-socket-pääsyä |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Pakollinen, kun `DOCKER_LOGS_ENABLED=true` | Pilkuilla erotettu luotettujen käyttäjäsähköpostien luettelo, joilla on pääsy Docker-lokeihin |
| `HEYM_PLUGINS_ENABLED` | Valinnainen | Aseta `true` ottaaksesi liitännäisalijärjestelmän käyttöön (mukautetut solmut asennetaan zip-tiedostona). Oletusarvoisesti pois päältä |
| `HEYM_PLUGIN_ADMIN_EMAILS` | Pakollinen, kun `HEYM_PLUGINS_ENABLED=true` | Pilkuilla erotettu operaattorisähköpostien luettelo, jotka voivat asentaa/poistaa liitännäisiä |
| `HEYM_PLUGINS_DIR` | Valinnainen | Mihin liitännäistiedostot tallennetaan. Aseta absoluuttiseksi `/app/data/plugins`, kun liität kyseisen polun; suhteellinen `data/plugins`-oletusarvo ratkeaa tässä imagessa `/app/backend`-hakemistoon ja ohittaa liitoksen |
| `HEYM_PYTHON_TOOL_SANDBOX` | Valinnainen | Python-työkalun eristystila; oletusarvo `auto` (kovennettu Docker-sandbox, fail closed). Katso [Security](../reference/security.md#python-tool-sandbox) |
| `HEYM_PYTHON_TOOL_IMAGE` | Valinnainen | Ohita Python-työkalun sandbox-image; tyhjä = tunnista backend-image automaattisesti |
| `HEYM_CODEX_DOCKER_WORKSPACE_VOLUME` | Valinnainen | Docker-volume, jota sisar-Codex-runner-kontit käyttävät; oletusarvo `heym-codex-workspaces` Docker-käyttöönotoissa |
| `HEYM_CODEX_NETWORK_ACCESS` | Valinnainen | Salli Codexin sandbox-komentojen ladata tiedostoja/riippuvuuksia; Docker-käyttöönotot ottavat tämän käyttöön oletusarvoisesti |
| `HEYM_OPENCODE_DOCKER_WORKSPACE_VOLUME` | Valinnainen | Docker-volume, jota sisar-OpenCode-runner-kontit käyttävät; oletusarvo `heym-opencode-workspaces` Docker-käyttöönotoissa |

**Huomautuksia:**

- Image paljastaa portin `4017`
- Backend pysyy sisäisenä ja se välitetään polun `/api` alle
- Kun `POSTGRES_HOST=localhost`, julkaisuimage kirjoittaa sen automaattisesti uudelleen muotoon `host.docker.internal` tarvittaessa, jotta sama `.env` toimii isäntätason PostgreSQL-kontin kanssa macOS Docker/Desktop -työkaluissa
- Säilytä `data/files`-liitos, jos Drive-latausten ja skill-generoitujen tiedostojen halutaan säilyvän kontin uudelleenkäynnistysten yli
- **Liitännäiset:** ota ne käyttöön asettamalla `HEYM_PLUGINS_ENABLED=true` ja `HEYM_PLUGIN_ADMIN_EMAILS` sekä liittämällä `data/plugins`, jotta asennetut liitännäistiedostot säilyvät kontin uudelleenluontien yli. Liitännäisten metatiedot sijaitsevat PostgreSQL:ssä, joten nekin säilyvät. Liitännäisen ilmoittamat pip-`dependencies`-riippuvuudet asennetaan konttiin asennushetkellä; koska imagen tiedostojärjestelmä on väliaikainen, ne **asennetaan automaattisesti uudelleen käynnistyksen yhteydessä** jokaiselle asennetulle liitännäiselle (julkaisuimagen `uv`-venv on kirjoitettavissa, joten tämä toimii myös yksittäisen kontin imagessa)

### Olemassa olevan tietokannan siirtäminen nimettyyn volumeen

`./deploy.sh --migrate-pgdata` tuntee vain Compose-pinon. Jos ajetaan julkaisuimagea omaa PostgreSQL-konttia vasten ja kyseinen kontti liittää isäntähakemiston bind-mountilla, se on siirrettävä itse.

Tarkista ensin, mitä tietokantakontti käyttää:

```bash
docker inspect <your-postgres-container> | grep -A8 Mounts
```

Jos `"Type"` on `bind`, siirrä se nimettyyn volumeen:

```bash
# 1. Stop the database. Heym can stay down for this.
docker stop <your-postgres-container>
docker rm <your-postgres-container>

# 2. Copy the data directory into a named volume. Give each instance its own
#    volume-nimi, jos tämä Docker-host isännöi useampaa kuin yhtä Heym-käyttöönottoa.
docker volume create heym-postgres-data
docker run --rm \
  -v "/path/to/your/data/postgres:/legacy:ro" \
  -v heym-postgres-data:/pgdata \
  --entrypoint sh <your-postgres-image> -c 'cp -a /legacy/. /pgdata/'

# 3. Käynnistä PostgreSQL uudelleen volumella ja käytä samoja lippuja kuin aiemmin
#    mutta korvaa bind mount.
docker run -d --name <your-postgres-container> --restart always \
  ... your original -e / -p / --network flags ... \
  -v heym-postgres-data:/var/lib/postgresql/data \
  <your-postgres-image>

# 4. Kun se vastaanottaa yhteyksiä, rakenna indeksit uudelleen.
docker exec <your-postgres-container> reindexdb -U <user> -d <database>
```

**Käytä omaa imagea vaiheissa 2 ja 3, ei `postgres:16`.** Jos tietokanta pyörittää `pgvector/pgvector:pg16`-imagea tai muuta varianttia, kopioidun klusterin käynnistäminen vakio-imagella voi epäonnistua, koska laajennuskirjastot, joita se odottaa, puuttuvat.

Alkuperäinen datakansio jää tämän toimenpiteen jäljiltä koskemattomaksi, joten se säilyy palautuspolkuna. Poista se vasta, kun on varmistettu, että siirretty tietokanta palvelee workfloweja. Vaihe 4 on tärkeä samasta syystä kuin Compose-siirrossa: kopio kuljettaa mukanaan mahdolliset olemassa olevat indeksivauriot.

---

## Useamman kuin yhden instanssin ajaminen

Kaikki edellä kuvattu ottaa käyttöön yhden Heym-instanssin. Kun yksi kone ei enää riitä, osoita toinen instanssi samaan PostgreSQL-tietokantaan, jolloin se liittyy workerina: taustalla ajettavat suoritukset — cron, webhookit, MCP-työkalujen kutsut, chat triggerit — jaetaan tämän jälkeen instanssien kesken prosenttiosuudella, joka asetetaan kohdassa **Settings → Instances**.

Instanssit eivät koskaan kommunikoi keskenään. Postgres kantaa työn, joten worker ei tarvitse avointa porttia eikä reittiä takaisin pääinstanssiin, eikä viestivälittäjää tarvita. Työ, joka koskettaa paikallista levyä — Drive-tiedostot, coding-agent-työtilat, asennetut plugin-lisäosat — ajetaan aina pääinstanssilla, joten mitään ei tarvitse jakaa tiedostojärjestelmän kautta.

Kaksi sääntöä, joita klusteri ei voi valvoa puolestasi: jokaisen instanssin on käytettävä samaa `SECRET_KEY`- ja `ENCRYPTION_KEY`-avainta, ja ingressin on osoitettava vain pääinstanssiin. Molemmat selitetään yhdessä sijoittelusääntöjen ja prosenttiosuuksien valinnan kanssa kohdassa [Load Distribution](../reference/cluster.md).

> Tämä on kuormituksen jakamista, ei korkeaa käytettävyyttä. Pääinstanssi on edelleen yksittäinen vikapiste ingressille, tiedostojen tallennukselle ja editorille.

## Yleiset workflowt

**Ensimmäinen käyttöönotto:**

```bash
./run.sh          # development — creates .env from .env.example and generates SECRET_KEY/ENCRYPTION_KEY automatically
# or
./deploy.sh       # production — same automatic .env and key generation
```

Valmiiksi rakennetulle `docker run` -imagelle avaimet on luotava ensin manuaalisesti (katso **Prebuilt Image** -osio yllä).

**Päivitä tuotanto koodimuutoksen jälkeen:**

```bash
git pull
./deploy.sh       # rebuilds images, zero-downtime swap
```

**Tarkista tuotannon lokit:**

```bash
./deploy.sh --logs
```

**Pysäytä tuotantopalvelut:**

```bash
./deploy.sh --down
```

---

## Aiheeseen liittyvät

- [Introduction](./introduction.md) – Alustan yleiskatsaus
- [Quick Start](./quick-start.md) – Rakenna ensimmäinen workflow
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Täydellinen konfiguraatioviite
- [Security](../reference/security.md) – JWT-, salaus- ja CORS-asetukset
- [Load Distribution](../reference/cluster.md) – Aja useita instansseja yhtä tietokantaa vasten
