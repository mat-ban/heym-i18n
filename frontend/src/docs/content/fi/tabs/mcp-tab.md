# MCP- / A2A-välilehti

**MCP**-välilehdellä määritetään Model Context Protocol (MCP) -integraatio, ja [Agent2Agent](https://github.com/google/A2A) (A2A 1.0) -palvelimina, joille muut agentit voivat delegoida tehtäviä. MCP mahdollistaa tekoälyasiakkaiden (kuten Clauden, ChatGPT:n, Geminin, Cursorin ja muiden MCP-yhteensopivien työkalujen) käyttää Heymin workflowteja työkaluina.

Heym tukee kahta toimintatapaa: **oletuspalvelinta**, joka tarjoaa kaikki MCP-käyttöön otetut workflowt yhden päätepisteen kautta, ja **nimettyjä palvelimia**, joissa jokaisella workflow-ryhmällä on oma dedikoitu URL-osoite ja API-avain.

Molemmat tavat voivat tarjota kahdenlaisia työkaluja: yksittäisiä **workflowteja** ja **Heym-keskustelutyökalua** – koko [Chat-välilehden](./chat-tab.md) moottorin yhden `heym_chat` -työkalun takana.

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Katso MCP-esittely</a></p>

## Oletus-MCP-palvelin

Oletuspalvelin on aina käytettävissä osoitteessa `{origin}/api/mcp/sse`. Kaikki MCP-käyttöön otetut workflowt näkyvät työkaluina tässä.

### MCP API -avain

- Avaimet tallennetaan SHA-256-tiivisteenä, joten Heym ei voi näyttää olemassa olevaa avainta. Välilehti ilmoittaa, onko avain asetettu, mutta ei sen sisältöä.
- **Luo** / **Luo uudelleen** – Uusi avain näytetään kerran heti luonnin jälkeen. Kopioi se silloin; välilehden päivittäminen piilottaa sen pysyvästi.
- Käytä tätä avainta, kun yhdistät Claude Desktopia, Cursoria tai muita MCP-asiakkaita Heymiin.
- Kadonnut avain? Luo uusi. Edellinen avain lakkaa toimimasta välittömästi.

### Yhteyden muodostamistavat

- **API-avain** – Käytä MCP API -avainta ohjelmallisiin yhteyksiin. Välilehti voi kopioida valmiin JSON-konfiguraation ja sisältää **Add to Cursor** -painikkeen yksinkertaista Cursor-asetusta varten.
- **Claude** – Välilehti näyttää MCP-palvelimen URL-osoitteen ja asennusohjeet Claudelle. Jätä OAuth Client ID ja Secret kentät tyhjiksi; Claude rekisteröityy automaattisesti ja todentaa Heym OAuthin kautta.
- **ChatGPT** – Välilehti näyttää MCP-palvelimen URL-osoitteen ja ChatGPT-sovelluksen määritysohjeet. Ota kehittäjätila käyttöön, luo sovellus URL-osoitteella ja valitse OAuth; ChatGPT rekisteröityy automaattisesti.
- **Gemini** – Välilehti näyttää MCP-palvelimen URL-osoitteen ja mukautetun Gemini-sovelluksen määritysohjeet: valitse osoitteessa gemini.google.com **Settings → Connected Apps → Add a custom app**, liitä URL-osoite ja jätä **Advanced features** suljetuksi; Gemini rekisteröityy automaattisesti ja todentaa Heym OAuthin kautta. Yhdistämisen jälkeen Heym toimii myös Geminin mobiilisovelluksessa.

### Workflown MCP-kytkin

Jokainen workflow voidaan tarjota MCP-työkaluna:

- **Käytössä** – Workflown työkalut ovat kaikkien oletuspalvelimeen yhdistettyjen asiakkaiden käytettävissä.
- **Ei käytössä** – Workflowta ei tarjota.

Workflow-kortit näyttävät kuvauksen ja syötekenttien nimien esikatselun, jotta näet, mitä kukin työkalu odottaa ennen käyttöönottoa.


### Jonotetut ajot ja heym_execution_status

Workflow, jolla on [samanaikaisuusrajoitus](../reference/webhooks.md#concurrency-limit-and-queued-runs), voi olla varattu, kun asiakas kutsuu sitä. Kutsu palauttaa heti tuloksen, joka ei ole virhe:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "next_step": "Call heym_execution_status with this execution_id every 5-10 seconds until status is success, error, cancelled or expired."
}
```

Asiakas kysyy `heym_execution_status` -työkalulta tällä `execution_id`-tunnuksella. Se palauttaa saman rungon kuin [tila-URL](../reference/webhooks.md#status-url): `queued` nykyisellä sijainnilla, `running`, sitten `success` tai `error` tulosten kera. Se löytää vain saman palvelimen tarjoamien workflow-prosessien suoritukset. Työkalu on lueteltu oletuspalvelimella ja jokaisella nimetyllä palvelimella vain niin kauan kuin vähintään yhdellä sen workflow-prosesseista on samanaikaisuusrajoitus. Kun jono on täynnä, kutsu palauttaa virheen "Concurrency queue is full".
## Heym-agentti

**Heym Capabilities** -osassa Chat-välilehden moottori muunnetaan yhdeksi MCP-työkaluksi nimeltä `heym_chat`. Ota se käyttöön oletuspalvelimessa, missä tahansa nimetyssä palvelimessa tai molemmissa – jokaisella pinnalla on oma kytkentänsä ja mallivalinta.

Kun se on käytössä, `heym_chat` näkyy `tools/list` -listauksessa workflow-työkalujesi rinnalla. MCP-asiakas lähettää yhden luonnollisen kielen viestin, ja Heym-moottori hoitaa loput samoin kuin Chat-välilehdessä:

- Luo workflow, koeaja se esimerkkisyötteillä, korjaa virheet ja lopeta, kun suoritus menee läpi (katso [Rakennustila](#build-mode))
- Tarkastele ja suorita olemassa olevia workflowtejasi
- Raportoi analytiikkaa, viimeisimpiä suorituksia ja tulevia cron-aikatauluja.
- Selittää, missä työnkulut epäonnistuvat ja miksi ne ovat hitaita: eniten suoritetut, eniten epäonnistuneet ja hitaimmat työnkulut sekä solmutyypit, joihin on kulunut eniten aikaa, virheitä ja kutsuja viimeisten 1, 3 tai 6 tunnin, 24 tunnin, 7 tai 30 päivän tai koko historian aikana
- Raportoi yhden workflown suoritushistorian: kuinka monta kertaa se on suoritettu, tilastot, milloin se on suoritettu, ja pyynnöstä yhden suorituksen syötteet, tulosteet ja solmukohtaiset virheet.
- Raportoi, mitä parhaillaan suoritetaan: kuinka monta suoritusta on käynnissä, niiden workflownimet, kauanko kukin on ollut käynnissä, nykyinen solmu ja linkki live-suoritukseen.
- Listaa taulut, luo kortteja ja lue korttien tietoja [Board-välilehdellä](./board-tab.md).
- Listaa koontinäytöt (Heym Workin sivut) ja niiden widgetit, selvittää, millä koontinäytöllä työnkulku on, lisää uuden widgetin ja rakentaa sen työnkulun, asettaa olemassa olevan työnkulun widgetiksi, nimeää uudelleen tai poistaa widgettejä tai siistii asettelua (katso [Dashboard › Chatista ja MCP:stä](./dashboard-tab.md#from-chat-and-mcp))
- Tarkastaa datataulukoita ja rivejä, luo taulukoita, lisää tai poistaa sarakkeita, lisää, päivittää tai poistaa rivejä ja kytkee taulukoita työnkulkuihin
- Luo, muokkaa ja suorittaa kehotteiden ja agenttien arviointipaketteja ([Eval suites](./evals-tab.md#from-chat-and-mcp)), mukaan lukien agentin perustaso: raportoitu, suorituksista rakennettu tai numeerisesti ilmoitettu. Tulos luetteloi jokaisen tallennetun paketin Evals-linkin.
- Luo tai päivitä tunnistetietosi Heymin omalla sivulla (katso [Tunnistetiedot](#tunnistetiedot))
- Lue tiimien ja globaalien muuttujien arvoja ja etsi dokumentaatiosta.
- Hyväksy, muokkaa tai hylkää odottavia ihmisen vahvistusta vaativia tarkistuksia.

Chat-välilehdelle myöhemmin lisätyt ominaisuudet tulevat automaattisesti käyttöön myös `heym_chat` -työkalussa – ei tarvitse synkronoida erillisiä kytkimiä.

Nämä toiminnot suoritetaan `heym_chat`-työkalun sisällä: `tools/list` näyttää `heym_chat`-työkalun ja työnkulkutyökalusi, ei koskaan chatin sisäisiä työkaluja, kuten arviointipakettien työkaluja.

### Rakennustila

`heym_chat` suorittaa Chat-moottorin aina rakennustilassa (build mode). Yhdellä kutsulla avustaja voi tallentaa uuden workflown, suorittaa sen realistisilla esimerkkisyötteillä, lukea suoritusraportin, korjata epäonnistuneet kohdat ja suorittaa sen uudelleen, enintään viisi koeajoa kutsua kohden. Kun viimeisimmän tallennuksen viimeisin suoritus onnistuu, se päättää yhden virkkeen yhteenvetoon ja vastaus päättyy tekstiin `Verified: the latest test run of the saved workflow passed.`

Kun kutsu luo tai muokkaa workflow'ta, vastaus luettelee jokaisen täydellisen muokkauslinkin kera, kuten `https://heym.example.com/workflows/<id>`, ja avustajan vastauksen sisällä olevat linkit ovat myös täysiä linkkejä. Ne käyttävät määritettyä Heym-osoitettasi (`FRONTEND_URL`) ja avautuvat Heymiin kirjautuneille henkilöille, joilla on pääsy kyseiseen workflow'hun.

- Koeajot ovat oikeita suorituksia. Niiden sivuvaikutukset toteutuvat, ja ne näkyvät workflown suoritushistoriassa kuten mikä tahansa muukin suoritus.
- Tallennukset kulkevat editorin polkua: muutos graafiin säilyttää edellisen graafin workflown muokkaushistoriassa (**Edit History**).
- Jos haluat muuttaa aiemmin rakennettua workflowta, jatka ketjua samalla `conversation_id`-tunnisteella. Avustaja päivittää kyseisen workflown uuden luomisen sijaan ja muuttaa vain workflowteja, joita sinulla on oikeus muokata.
- Kun viisi koeajoa on käytetty, avustaja pysähtyy ja selittää, mikä edelleen epäonnistuu.

Datataulukot toimivat eri tavalla. Taulukko ei sisällä salaisuuksia, joten `heym_chat` voi listata taulukot, kysyä, mitä taulukkoa workflowssa tulisi käyttää, ja luoda uuden taulukon sarakkeineen. Se ei koskaan lue tai kirjoita rivejä.

### Tunnistetiedot

`heym_chat` näkee omistamasi ja kanssasi jaetut tunnistetiedot nimen ja tyypin mukaan samalla tavalla kuin Keskustelu-välilehti. Kun sen rakentama workflow tarvitsee tunnistetiedot, se kysyy tuloksessa esitettynä kysymyksenä, mitä käytetään. Vastaa samalla `conversation_id`-tunnuksella.

Voit lisätä tunnistetiedot tai päivittää omasi avaamalla Heymin lomakkeen Heym-sivulla, `/credentials/setup/<id>`. Kirjaudut Heymiin siellä, syötät avaimen tai yhdistät tilin ja tallennat. Arvo menee suoraan Heymille: MCP-asiakas ja sen malli saavat tietää vain tunnistetietojen nimen ja tyypin. Älä liitä avaimia MCP-asiakkaaseen; pyydä sen sijaan lomaketta.

| Asiakas | Mitä tapahtuu |
|---------|---------------|
| Tukee MCP URL -kyselyä | Asiakas pyytää sinua avaamaan Heym-sivun. Kutsu odottaa lomakkeen täyttämistä (enintään kymmenen minuuttia) ja jatkaa sitten uusilla tunnistetiedoilla. |
| Kaikki muut | Tulos sisältää linkin ja pyytää asiakasta kutsumaan `heym_chat`-toimintoa uudelleen parametrilla `wait_for_credential_form`. Tämä kutsu odottaa enintään viisi minuuttia lomakkeen täyttämisen aikana ja jatkaa sitten keskustelua. Jos asiakas ei odota, tallenna lomake ja vastaa samalla `conversation_id`-tunnuksella; seuraava kutsu tietää, että lomake tallennettiin ja mitkä tunnistetiedot se loi. |

Sivu avautuu vain pyynnön aloittaneelle Heym-tilille, joten edelleenlähetetty linkki on hyödytön kenellekään muulle. Lomake pysyy auki 24 tuntia, ja sen voi hylätä sivulta. Kun tallennat tai hylkäät sen, Keskustelu-välilehden vaihe näyttää tuloksen.


### Tunnistetiedot ja malli

`heym_chat` suorittaa moottorin Heym-tililläsi, joten se tarvitsee oman LLM-tunnistetietonsa:

| Kenttä | Toiminta |
|-------|----------|
| **Tunnistetiedot** | Valitse mikä tahansa OpenAI-, Google- tai Custom-tunnistetiedot, joihin sinulla on pääsy. Esitäytetään [Asetuksissa](../reference/user-settings.md) määritetystä ensisijaisesta tunnistetiedoista, jos et ole valinnut sitä. |
| **Malli** | Ladataan valituista tunnistetiedoista. Esitäytetään ensisijaisesta mallistasi, kun tunnistetiedot vastaavat sitä. |

Jos jompikumpi puuttuu, työkalu näkyy edelleen `tools/list` -listauksessa, mutta kutsu palauttaa virheen, joka kehottaa viimeistelemään asetuksen tällä välilehdellä.


`heym_chat`-työkalun rakentaman workflow'n LLM- ja Agent-solmut suoritetaan tällä tunnistetiedolla ja mallilla, mukaan lukien kanssasi jaetut tunnistetiedot, joten testiajot toimivat ilman erillistä asetusvaihetta. Kun `heym_chat` muokkaa workflow'ta, LLM- ja Agent-solmut, joilla on jo tunnistetiedot, säilyttävät ne yhdessä mallinsa kanssa.
### Argumentit ja historia

| Argumentti | Pakollinen | Kuvaus |
|----------|----------|-------------|
| `message` | Kyllä | Ohje tai kysymys luonnollisella kielellä. |
| `conversation_id` | Ei | Edellisen `heym_chat` -tuloksen `conversation_id`, jatkaakseen kyseistä keskustelua. |
| `wait_for_credential_form` | Ei | `conversation_id`-parametrilla: odota, kunnes käyttäjä tallentaa tai hylkää viestiketjun avaaman tunnistetietolomakkeen, ja lähetä sitten `message`. |

Jokainen kutsu kirjataan [Chat-välilehden](./chat-tab.md) historiaan tavallisena keskusteluna, merkittynä pistorasia-kuvakkeella keskustelulistassa. Viestit, työkalukortit ja selvennysten tauot näyttävät täsmälleen samoilta kuin itse aloittamasi keskustelut, ja voit avata ketjun ja jatkaa keskustelua selaimessa. Jokainen tulos palauttaa `conversation_id` -tunnisteen, jotta MCP-asiakas voi jatkaa samaa keskustelua uuden avaamisen sijaan jokaisella kutsulla.

Kun apuohjelma tarvitsee selvennystä, se pysähtyy ja ilmoittaa siitä; vastaa selvennyksillä käyttäen samaa `conversation_id` -tunnistetta.
### Ota A2A käyttöön

Kun Heym-agentti on kytketty päälle, kortissa näkyy valintaruutu **Ota A2A käyttöön**. Valitse se, niin muut agentit voivat lähettää tehtäviä Heym-agentille Agent2Agent-protokollan (A2A 1.0) kautta. Kortissa näkyy tällöin **Agent Card** -osoite ja **JSON-RPC endpoint**, joissa kummassakin on kopiointipainike, sekä `curl`-komento kortin noutamiseksi. A2A käyttää samaa avainta ja OAuth-kirjautumista kuin MCP. Agentin poistaminen käytöstä poistaa myös A2A:n käytöstä. Katso [A2A](../reference/a2a.md) menetelmien, tehtävätilojen ja esimerkin osalta.

### Edistyminen

Pitkäkestoinen `heym_chat`-kutsu raportoi agentin toiminnan MCP-edistymisenä (`notifications/progress`), samoilla ilmauksilla kuin Chat-välilehti näyttää, esimerkiksi `Testataan työnkulkua · yritys 2/5`. Asiakkaat, jotka nollaavat aikakatkaisunsa edistymisilmoituksen yhteydessä, jatkavat odottamista agentin työskennellessä.

## Nimettyjen MCP-palvelimien hallinta

Nimettyjen palvelimien avulla voit segmentoida workflowt eristetyille MCP-endpointeille. Kullakin palvelimella on oma URL-osoite ja API-avain, jolloin eri tekoälyasiakkaat, tiimit tai käyttötapaukset voivat kytkeytyä tarkalleen niihin workflowihin, joita he tarvitsevat.

### Nimetyn palvelimen luominen

1. Kirjoita nimi syötekenttään MCP-välilehden alaosassa (esim. **CRM-työkalut**)
2. Klikkaa **Luo** – uusi palvelinkortti ilmestyy välittömästi
3. Klikkaa korttia laajentaaksesi sen

### Palvelimen asetukset

Jokainen palvelinkortti näyttää seuraavat asetukset:

| Asetus | Kuvaus |
|--------|---------|
| **SSE-endpoint** | Yksilöllinen URL-osoite: `{origin}/api/mcp/servers/{uuid}/sse` |
| **API-avain** | Riippumaton avain, joka näytetään vain luonnin tai uudelleenluonnin yhteydessä. Kopioi se heti; avain tallennetaan tiivistettynä eikä sitä voida paljastaa myöhemmin |
| **Yhdistäminen** | **Kopioi JSON** kopioi valmiin liitettävän MCP-konfiguraation; **Lisää kursoriin** asentaa sen yhdellä klikkauksella |
| **Heym Capabilities** | Kytke Heym-agentti (`heym_chat`) päälle tai pois tälle palvelimelle ja valitse sen credential ja malli |
| **Ota A2A käyttöön** | Tämän palvelimen oma A2A-kytkin omalla Agent Cardilla osoitteessa `{origin}/api/a2a/servers/{uuid}/agent-card.json` |
| **Ota A2A käyttöön** | Tämän palvelimen oma A2A-kytkin omalla Agent Cardilla osoitteessa `{origin}/api/a2a/servers/{uuid}/agent-card.json` |
| **Määritetyt workflowt** | Valitse, mitkä workflowt tämä palvelin paljastaa |

### Workflowjen määrittäminen

Workflowjen määrittäminen tapahtuu palvelimikohtaisesti ja riippumattomasti oletuspalvelimen asetuksista. Workflow voidaan ottaa käyttöön oletuspalvelimella ja useilla nimetyillä palvelimilla samanaikaisesti tai ei missään.

Workflown kytkeminen siirtää sen määritettyjen listan yläosaan, joten juuri muutettu rivi pysyy näkyvissä eikä häviä vierityksen myötä.

### Tunnistautuminen

Nimetyt palvelimet tukevat samoja tunnistautumismenetelmiä kuin oletuspalvelin:

- **X-MCP-Key-otsake** – Lähetä palvelimen API-avain suoraan (API-asiakkaat, Cursor). Vain otsakkeena: avaimia ei hyväksytä `?key=` -kyselyparametrina, koska URL-osoitteet päätyvät lokitietoihin, välityspalvelinlokeihin ja selainhistoriaan.
- **Claude, ChatGPT ja Gemini OAuth** – Lisää palvelimen URL-osoite asiakkaan liittimiin tai mukautettuihin sovelluksiin; jätä tunnistetiedot tyhjäksi ja asiakas rekisteröityy automaattisesti OAuthin kautta. Kantajatokenin on kuljettava `Authorization`-otsakkeessa, ei `?token=` -parametrina.
- **Istuntotoken** – Luodaan SSE-kättelyn aikana; rajoitettu tiettyyn palvelimeen, joten yhden nimetyllä palvelimella luodut tokenit eivät päde toisille. Tätä lyhytikäistä `?session=` -parametria ei vaikuta.

### Nimetyt palvelimen poistaminen

Klikkaa **X**-kuvaketta palvelinkortin otsikossa. Poistaminen poistaa palvelimen ja kaikki sen workflow-määritykset; workflowt eivät kärsi vahinkoa.

## SSE-endpoint

| Palvelin | Endpoint |
|----------|----------|
| Oletus | `{origin}/api/mcp/sse` |
| Nimetty | `{origin}/api/mcp/servers/{server-uuid}/sse` |

Molemmat endpointit tukevat SSE-kuljetusta (GET, MCP-spesifikaatio 2024-11-05) ja Streamable HTTP -kuljetusta (POST, MCP-spesifikaatio 2025-03-26). Claude, ChatGPT ja Gemini käyttävät OAuth 2.1 / PKCE -turvallista kirjautumista molemmissa.

## Aiheeseen liittyvät

- [Heymin etu](../getting-started/why-heym.md) – MCP ensimmäisenä luokkana Heymissä
- [Agenttisolmu](../nodes/agent-node.md) – Agenttisolmu MCP-työkalutuen kanssa
- [Agenttien arkkitehtuuri](../reference/agent-architecture.md) – MCP-asiakas, työkalujen lähettäminen, orkestroija
- [Triggerit](../reference/triggers.md) – MCP workflown alkupisteenä
- [Keskustelu-välilehti](./chat-tab.md) – `heym_chat` -työkalun moottori
- [Workflowt-välilehti](./workflows-tab.md) – Workflowjen luominen ja hallinta
- [Solmutyypit](../reference/node-types.md) – Tekoälysolmujen yleiskatsaus
- [Kontekstuaalinen esittely](../reference/contextual-showcase.md) – Tiiväs opas hallintapaneelin käyttöliittymäpinnoille