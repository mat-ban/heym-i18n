# Turvallisuus

Turvallisuuskäytännöt ja -asetukset Heym-alustalla.

## Salasanakäytäntö

Kaikkien salasanojen — sekä rekisteröitymisen että salasanan vaihdon yhteydessä — on täytettävä seuraavat vaatimukset:

| Sääntö | Vaatimus |
|------|-------------|
| Vähimmäispituus | 8 merkkiä |
| Isot kirjaimet | Vähintään yksi iso kirjain (A–Z) |
| Pienet kirjaimet | Vähintään yksi pieni kirjain (a–z) |
| Numero | Vähintään yksi numero (0–9) |

Nämä säännöt ovat voimassa sekä käyttöliittymässä että palvelinpuolella (Pydantic-validaattori). Pyyntö, joka sisältää vaatimusten mukaisen salasanan, hylätään `422 Unprocessable Entity` -vastauksella ennen kuin mitään tietokantaan kirjoitetaan.

**Esimerkki kelvollisesta salasanasta:** `MyWorkflow7!`

## Istunnon hallinta

- Käyttöoikeustiedot tallennetaan **HttpOnly**-evästeisiin, ei `localStorage`-tallennustilaan. Tämä estää JavaScriptiä (mukaan lukien XSS-hyökkäykset) lukemasta tunnusta.
- Virkistystunnus on rajoitettu polkuun `/api/auth/refresh`, eikä sitä lähetetä muihin päätepisteisiin.
- Jokainen `/api/auth/refresh` -kutsu **uudistaa** virkistystunnuksen: vanha tunnus mitätöidään välittömästi ja uusi myönnetään. Käytetyn virkistystunnuksen uudelleenlähetys palauttaa virhekoodin `401`.

## Kyselyjen rajoitus

Seuraavat päätepisteet ovat rajoitettuja IP-osoitetta kohti:

| Päätepiste | Rajoitus | Eston kesto |
|----------|-------|--------------|
| `POST /api/auth/login` | 10 pyyntöä / 60 s | 15 min |
| `POST /api/auth/register` | 5 pyyntöä / 60 s | 10 min |
| `POST /register` (OAuth-asiakkaat) | 5 pyyntöä / 60 s | 10 min |
| Portaalin kirjautuminen | 3 yritystä | 24 h |

Kun `REDIS_URL` on määritetty, kyselyrajat ovat voimassa kaikissa palvelinprosesseissa. Ilman sitä rajat koskevat vain yksittäistä prosessia.

## Tunnistetietojen salaus

Kaikki API-avaimet, webhook-URLit ja kantajatunnukset, jotka tallennetaan [Tunnistetiedot](../tabs/credentials-tab.md) -välilehdelle, salataan AES-256 (Fernet) -algoritmilla ennen tietokantaan tallennusta. Salausavain johdetaan ympäristömuuttujasta `ENCRYPTION_KEY`. Skriptit `run.sh` ja `deploy.sh` luovat automaattisesti vahvan arvon, jos se on tyhjä; sovellus kieltäytyy käynnistymästä, jos `ENCRYPTION_KEY` on tyhjä tai jätetty tunnettuun paikkamerkin arvoon.

## MCP API -avain

MCP API -avainta käytetään ulkoisten MCP-asiakkaiden tunnistamiseen, kun ne yhdistävät päätepisteeseen `/api/mcp/sse`. Kun SSE-yhteys muodostetaan, lyhytikäinen (1 tunnin voimassaolo) istuntotunnus luodaan ja upotetaan viestin päätepisteen URLiin todellisen API-avaimen sijaan, mikä estää avaimen näkymisen palvelinlokeissa. Katso [MCP-välilehti](../tabs/mcp-tab.md) asennusohjeita varten.

## OAuth / PKCE

OAuth 2.0 -valtuutuspalvelin (jota käytetään MCP-asiakkaille) tukee vain `authorization_code` -tyyppistä myöntöä PKCE (`S256`) -tukevuudella. Suostumuslomake käyttää HMAC-SHA256 CSRF -tokeneita, joiden voimassaolo on 10 minuuttia. Kaikki suostumussivulla näytettävät arvot ovat HTML-koodattu.

## Suoritustunnukset

[Suoritustunnukset](./execution-tokens.md) ovat rajattuja JWT-tunnuksia workflown suorituspäätepisteen kutsumiseen ulkoisista järjestelmistä. Toisin kuin käyttäjän istuntotunnukset, ne ovat:

- **Yhden workflown rajoittuneita** — tunnus hylätään kaikille muille workflowille.
- **Itsenäisesti mitätöitävissä** — tunnuksen mitätöimisellä ei ole vaikutusta käyttäjän istuntoon.
- **Lyhyt- tai pitkäikäisiä** — valitse voimassaoloaika 60 sekunnista 10 vuoteen.

Tunnukset allekirjoitetaan samalla sovelluksen salaisella avaimella (`SECRET_KEY`), ja niitä tarkistetaan jokaisessa pyynnössä: allekirjoitus, voimassaoloaika, `wid` -vaatimuksen täsmäävyys ja mitätöintitila. Katso [Suoritustunnukset](./execution-tokens.md) asennusohjeita ja API-viitettä varten.

## Sisällön turvallisuus

Käytä [Suojauksia](./guardrails.md) LLM- ja Agent-solmuissa estääksesi turvattomat tai käytäntöjä rikkovat käyttäjäviestit ennen kuin ne saavuttavat mallin. Suojaukset tukevat yhdeksää sisältöluokkaa (väkivalta, vihapuhe, seksuaalinen sisältö jne.), joilla on säädettävät herkkyystasot.

## Python-työkalun eristys

Käyttäjän määrittämät Python-työkalut [Agent-solmun](../nodes/agent-node.md) osalta suorittavat epäluotettavaa koodia. Oletusarvoisesti Heym suorittaa jokaisen työkalun kovistetussa, kertakäyttöisessä Docker-säiliössä, jossa on:

- ei verkkoyhteyttä,
- vain luku -käyttöoikeudet juurihakemistoon ja pieni `tmpfs` -työhakemisto,
- ei-root -käyttäjä, jolta on poistettu kaikki Linux-käyttöoikeudet ja `no-new-privileges`,
- tiukat CPU-, muisti- ja PID-rajoitukset, ja
- **ei Docker-sokelia** liitettynä, joten työkalu ei pääse käsiksi isäntäkoneen Docker-palveluun.

Suoritusympäristöä hallitaan ympäristömuuttujalla `HEYM_PYTHON_TOOL_SANDBOX`:

| Arvo | Toiminta |
|-------|----------|
| `auto` (oletus) | Suoritetaan kovistetussa Docker-säiliössä. Jos Docker ei ole käytettävissä, suoritus **epäonnistuu turvallisesti** — se ei suorita epäluotettavaa koodia ilman käyttöjärjestelmän eristystä. |
| `docker` | Sama kuin `auto`, mutta ei koskaan siirry varajärjestelmään. |
| `subprocess` | Suoritetaan paikallisessa aliprosessissa, jossa on tuontien sallittujen luettelo. Tämä **ei ole turvaraja** ja on tarkoitettu vain luotetulle koodille tai paikalliselle kehitysympäristölle. `run.sh` valitsee sen natiiville kehitysympäristölle. |

Aseta `HEYM_PYTHON_TOOL_IMAGE` kiinnittämään eristyskuva; kun arvo on tyhjä, Heym tunnistaa automaattisesti käynnissä olevan palvelinkuvan. In-process -rajoitukset (tuontien sallittujen luettelo sekä attribuuttien ja introspektioiden suodatus) toimivat puolustuksena, mutta säiliö on todellinen eristysraja — pidä oletusarvo `auto` (tai `docker`) monen käyttäjän ja tuotantokäyttöönotoissa.
## Taitojen hiekkalaatikko

Python-taidot, jotka on liitetty [Agenttisolmuun](../nodes/agent-node.md), suorittavat myös luottamattomia koodeja – taito voi saapua sellaisenaan jaettavassa workflowssa tai `everyone`-näkyvyyden mallissa – joten taidot käyttävät **samaa** `HEYM_PYTHON_TOOL_SANDBOX` -kytkintä kuin Python-työkalut ja epäonnistuvat suljettuna samalla tavalla. Taitojen kontti on kovennettu identtisesti (ei-root, kaikki kyvyt poistettu, `no-new-privileges`, vain-luku -juuritiedostojärjestelmä, CPU/muisti/PID-rajoitukset ja **ei Docker-socketia**), kahdella tarkoituksellisella erolla, koska taidot tarvitsevat niitä oikeutetusti:

- **Verkkoon pääsy on sallittu** (taidot kutsuvat API:ita ja asentavat omat riippuvuutensa `uv`:n avulla), ja
- **kirjoitettava työtila on liitetty**, jotta taidot voivat luoda tulostiedostoja ja lukea Heym Drive -tiedostoja.

Työtila jaetaan kertakäyttöisen sisarkontin kanssa saman nimisen Docker-volyymin (`heym-codex-workspaces`, liitetty polkuun `/app/data/codex-workspaces`) kautta, jota Codex-ajuri käyttää. Vain tämän suorituksen oma alikansio liitetään sisarkonttiin – `volume-subpath` -kautta – joten yksi taito ei koskaan näe toisen suorituksen tai Codexin työtietoja. Docker Compose -pino liittää tämän volyymin aina; yksittäisen kontin `docker run` -komentoon on lisättävä `-v heym-codex-workspaces:/app/data/codex-workspaces` myös Python-taitojen ja Codexin osalta. Jos volyymi puuttuu `auto`/`docker` -tilassa, taidon suoritus **epäonnistuu suljettuna** sen sijaan, että se suoritettaisiin taustajärjestelmässä. Koska suorituskohtaiset alipolun liitokset vaativat **Docker Engine 25.0 tai uudemman**, vanhempien moottorien tulisi joko päivittää tai suorittaa luotettuja taitoja `HEYM_PYTHON_TOOL_SANDBOX=subprocess` -asetuksella.

Vain ei-salaiset, siirrettävät ympäristömuuttujat (välityspalvelin ja CA-paketti -asetukset, lokalisointi) välitetään konttiin; tietokantojen URL-osoitteet, `SECRET_KEY`/`ENCRYPTION_KEY`, palveluntarjoajien API-avaimet ja OAuth-salaisuudet pidätetään sallituslistan perusteella. Taitojen tiedostopolut vahvistetaan pysyvän työtilan sisällä, ja tulostushakemistoon istutetut symboliset linkit (mukaan lukien `_hitl_request.json` -sentteli) ei koskaan seurata. Oletusasetuksia voidaan ohittaa `HEYM_SKILL_IMAGE`, `HEYM_SKILL_NETWORK`, `HEYM_SKILL_MEMORY`, `HEYM_SKILL_CPUS`, `HEYM_SKILL_PIDS` ja `HEYM_SKILL_USER` -muuttujilla tarvittaessa.

Kuten työkaluissa, `subprocess` -tila suorittaa taidon taustajärjestelmän prosessissa eikä ole **turvaraja** – käytä sitä vain luotettavien yksittäiskäyttäjien tai paikallisen kehityksen yhteydessä (`run.sh` valitsee sen natiiville kehitykselle).

## Koodisolmun hiekkalaatikko

[Koodisolmu](../nodes/code-node.md) suorittaa mielivaltaista käyttäjän Python-koodia yhdessä mielivaltaisten kolmannen osapuolen riippuvuuksien kanssa, joten se on kolmesta hiekkalaatikosta tiukin ja ainoa, jolla **ei ole pakotietä**: se ei lue hiekkalaatikkotilamuuttujaa, sillä ei ole `subprocess` -tilaa, ja se epäonnistuu suljettuna, kun Docker-daemonia ei ole saavutettavissa. Se ei koskaan palaa suorittamaan käyttäjän koodia taustajärjestelmän prosessissa.

Suoritus tapahtuu yhdessä tai kahdessa kertakäyttökontissa, jotka molemmat on kovennettu kuten työkalu- ja taitohiekkalaatikot (ei-root, kaikki kyvyt poistettu, `no-new-privileges`, vain-luku -juuritiedostojärjestelmä, CPU/muisti/PID-rajoitukset ja **ei Docker-socketia**):

- Tyhjällä `requirements.txt` -tiedostolla **yksi kontti `--network none` -asetuksella** suorittaa koodin. Ajuri saapuu kontin stdin-payloadissa, joten mitään ei liitetä ollenkaan.
- Riippuvuuksien kanssa ensimmäinen kontti asentaa ne verkkoon pääsyn kautta suorituskohtaiseen `.deps` -hakemistoon, ja toinen kontti liittää sen alipuun **vain-luku** -tilassa ja suorittaa koodin. Suorituskontissa ei ole verkkoon pääsyä, ellei solmun `codeAllowNetwork` -asetusta ole kytketty päälle.

Riippuvuudet asennetaan `uv`:lla, yritetään uudelleen `pip`:llä, eikä niitä koskaan välimuistata suoritusten välillä. Kun taustajärjestelmä suoritetaan kontissa, suorituskohtainen hakemisto sijaitsee samalla `heym-codex-workspaces` -volyymilla, jota taitojen hiekkalaatikko käyttää, liitettynä suorituskohtaisen `volume-subpath` -kautta, joten yksi suoritus ei koskaan näe toisen tiedostoja; tämä muoto vaatii **Docker Engine 25.0 tai uudemman**. Natiivilla taustajärjestelmällä (`./run.sh`) ei ole tällaista volyymia, eikä sellaista tarvita – sen suorituskohtainen hakemisto on paikallinen väliaikainen polku, joka sidotaan suoraan sisarkonttiin. Kummassakin tapauksessa hakemisto poistetaan jokaisen suorituksen jälkeen riippumatta tuloksesta.

Vain ei-salaiset, siirrettävät ympäristömuuttujat välitetään kontteihin – välityspalvelinasetukset, CA-paketit ja lokalisointi, joita riippuvuuksien asennus tarvitsee päästäkseen PyPI:hin yritysvälityspalvelimen takana. Tietokantojen URL-osoitteet, `SECRET_KEY`/`ENCRYPTION_KEY`, palveluntarjoajien API-avaimet ja OAuth-salaisuudet pidätetään sallituslistan perusteella, joten uusi taustajärjestelmän salaisuus hylätään oletusarvoisesti sen sijaan, että vuotaisi, kunnes joku päivittää kieltolistan. Taustajärjestelmän `HOME` ei koskaan ohita hiekkalaatikon omaa kirjoitettavaa polkua.

**Muotoile** -painike käyttää samaa hiekkalaatikkoa. Ruff jäsentää ja kirjoittaa lähdekoodin uudelleen sen sijaan, että suorittaisi sen, mutta sen suorittaminen taustajärjestelmän isäntäkoneella antaisi luottamattomalle tiedostolle prosessin, joka perii koko taustajärjestelmän ympäristön, joten se saa oman kertakäyttöisen `--network none` -kontin samoilla rajoituksilla ja samalla sallituslistalla varustetulla ympäristöllä. Se epäonnistuu suljettuna ilman Dockeria sen sijaan, että muotoilisi isännällä.

Hiekkalaatikon rajat ovat vakioita eivätkä ympäristömuuttujia – 512 MB muistia, yksi CPU, 256 prosessia, 120 sekunnin asennusaikakatkaisu ja 60 sekunnin suoritusaikakatkaisu. Kuva ratkaistaan olemassa olevasta `HEYM_PYTHON_TOOL_IMAGE` / `HEYM_CODEX_DOCKER_IMAGE` -ketjusta; solmu ei tuo omaa kokoonpanoaan.
## Liittyvät

- [Suoritus ja käyttöönotto](../getting-started/running-and-deployment.md) – Määritä `SECRET_KEY`, `ENCRYPTION_KEY`, `ALLOW_REGISTER` ja `HEYM_PYTHON_TOOL_SANDBOX` käynnistyksen yhteydessä
- [Koodisolmu](../nodes/code-node.md) – Eristetty Python-suoritus ympäristöineen
- [Agenttisolmu](../nodes/agent-node.md) – Mukautetut Python-työkalut, jotka suoritetaan eristetyssä ympäristössä
- [Suoritustokenit](./execution-tokens.md) – Rajatut JWT:t workflowien kutsumiseen ulkoisista järjestelmistä
- [Suojaukset](./guardrails.md) – Estä vaarallinen sisältö LLM- ja Agenttisolmuissa
- [Asetukset](./user-settings.md) – Vaihda salasanasi
- [Tunnistetiedot-välilehti](../tabs/credentials-tab.md) – Hallinnoi API-avaimia
- [MCP-välilehti](../tabs/mcp-tab.md) – MCP API -avain ja OAuth-asiakkaat
- [Portaali](./portal.md) – Julkisen keskustelun portaalikäyttöoikeudet
