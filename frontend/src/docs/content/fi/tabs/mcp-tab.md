# MCP-välilehti

**MCP**-välilehdellä määritetään Model Context Protocol (MCP) -integraatio. MCP mahdollistaa tekoälyasiakkaiden (kuten Clauden, ChatGPT:n, Geminin, Cursorin ja muiden MCP-yhteensopivien työkalujen) käyttää Heymin workflowteja työkaluina.

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

## Heym-keskustelutyökalu

**Heym Capabilities** -osassa Chat-välilehden moottori muunnetaan yhdeksi MCP-työkaluksi nimeltä `heym_chat`. Ota se käyttöön oletuspalvelimessa, missä tahansa nimetyssä palvelimessa tai molemmissa – jokaisella pinnalla on oma kytkentänsä ja mallivalinta.

Kun se on käytössä, `heym_chat` näkyy `tools/list` -listauksessa workflow-työkalujesi rinnalla. MCP-asiakas lähettää yhden luonnollisen kielen viestin, ja Heym-moottori hoitaa loput samoin kuin Chat-välilehdessä:

- Luo workflow, koeaja se esimerkkisyötteillä, korjaa virheet ja lopeta, kun suoritus menee läpi (katso [Rakennustila](#build-mode))
- Tarkastele ja suorita olemassa olevia workflowtejasi
- Raportoi analytiikkaa, viimeisimpiä suorituksia ja tulevia cron-aikatauluja.
- Raportoi yhden workflown suoritushistorian: kuinka monta kertaa se on suoritettu, tilastot, milloin se on suoritettu, ja pyynnöstä yhden suorituksen syötteet, tulosteet ja solmukohtaiset virheet.
- Raportoi, mitä parhaillaan suoritetaan: kuinka monta suoritusta on käynnissä, niiden workflownimet, kauanko kukin on ollut käynnissä, nykyinen solmu ja linkki live-suoritukseen.
- Listaa taulut, luo kortteja ja lue korttien tietoja [Board-välilehdellä](./board-tab.md).
- Listaa datataulukot niiden sarakkeineen, luo uusia ja liitä niitä workflowihin, joita se rakentaa.
- Lue tiimien ja globaalien muuttujien arvoja ja etsi dokumentaatiosta.
- Hyväksy, muokkaa tai hylkää odottavia ihmisen vahvistusta vaativia tarkistuksia.

Chat-välilehdelle myöhemmin lisätyt ominaisuudet tulevat automaattisesti käyttöön myös `heym_chat` -työkalussa – ei tarvitse synkronoida erillisiä kytkimiä.

### Rakennustila

`heym_chat` suorittaa Chat-moottorin aina rakennustilassa (build mode). Yhdellä kutsulla avustaja voi tallentaa uuden workflown, suorittaa sen realistisilla esimerkkisyötteillä, lukea suoritusraportin, korjata epäonnistuneet kohdat ja suorittaa sen uudelleen, enintään viisi koeajoa kutsua kohden. Kun viimeisimmän tallennuksen viimeisin suoritus onnistuu, se päättää yhden virkkeen yhteenvetoon ja vastaus päättyy tekstiin `Verified: the latest test run of the saved workflow passed.`

- Koeajot ovat oikeita suorituksia. Niiden sivuvaikutukset toteutuvat, ja ne näkyvät workflown suoritushistoriassa kuten mikä tahansa muukin suoritus.
- Tallennukset kulkevat editorin polkua: muutos graafiin säilyttää edellisen graafin workflown muokkaushistoriassa (**Edit History**).
- Jos haluat muuttaa aiemmin rakennettua workflowta, jatka ketjua samalla `conversation_id`-tunnisteella. Avustaja päivittää kyseisen workflown uuden luomisen sijaan ja muuttaa vain workflowteja, joita sinulla on oikeus muokata.
- Kun viisi koeajoa on käytetty, avustaja pysähtyy ja selittää, mikä edelleen epäonnistuu.

Tunnistetiedot pysyvät käyttöliittymässä: `heym_chat` ei koskaan listaa, valitse tai luo niitä. Kun se rakentaa tai muokkaa workflowta, uudet tunnistetietoja vaativat solmut jätetään tyhjiksi, ja vastaus nimeää ne, jotta voit asettaa ne editorissa.

Datataulukot toimivat eri tavalla. Taulukko ei sisällä salaisuuksia, joten `heym_chat` voi listata taulukot, kysyä, mitä taulukkoa workflowssa tulisi käyttää, ja luoda uuden taulukon sarakkeineen. Se ei koskaan lue tai kirjoita rivejä.

### Tunnistetiedot ja malli

`heym_chat` suorittaa moottorin Heym-tililläsi, joten se tarvitsee oman LLM-tunnistetietonsa:

| Kenttä | Toiminta |
|-------|----------|
| **Tunnistetiedot** | Valitse mikä tahansa OpenAI-, Google- tai Custom-tunnistetiedot, joihin sinulla on pääsy. Esitäytetään [Asetuksissa](../reference/user-settings.md) määritetystä ensisijaisesta tunnistetiedoista, jos et ole valinnut sitä. |
| **Malli** | Ladataan valituista tunnistetiedoista. Esitäytetään ensisijaisesta mallistasi, kun tunnistetiedot vastaavat sitä. |

Jos jompikumpi puuttuu, työkalu näkyy edelleen `tools/list` -listauksessa, mutta kutsu palauttaa virheen, joka kehottaa viimeistelemään asetuksen tällä välilehdellä.

### Argumentit ja historia

| Argumentti | Pakollinen | Kuvaus |
|----------|----------|-------------|
| `message` | Kyllä | Ohje tai kysymys luonnollisella kielellä. |
| `conversation_id` | Ei | Edellisen `heym_chat` -tuloksen `conversation_id`, jatkaakseen kyseistä keskustelua. |

Jokainen kutsu kirjataan [Chat-välilehden](./chat-tab.md) historiaan tavallisena keskusteluna, merkittynä pistorasia-kuvakkeella keskustelulistassa. Viestit, työkalukortit ja selvennysten tauot näyttävät täsmälleen samoilta kuin itse aloittamasi keskustelut, ja voit avata ketjun ja jatkaa keskustelua selaimessa. Jokainen tulos palauttaa `conversation_id` -tunnisteen, jotta MCP-asiakas voi jatkaa samaa keskustelua uuden avaamisen sijaan jokaisella kutsulla.

Kun apuohjelma tarvitsee selvennystä, se pysähtyy ja ilmoittaa siitä; vastaa selvennyksillä käyttäen samaa `conversation_id` -tunnistetta.
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
| **Heym-ominaisuudet** | Ota käyttöön `heym_chat` -työkalu tälle palvelimelle ja valitse sen tunnistetiedot ja malli |
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
