# Canvas-ominaisuudet

Workflow-editori tarjoaa useita ominaisuuksia virheenkorjaukseen, testaamiseen ja solmujen organisointiin: **Suorita solmuun**, **AI solmussa**, **Datapinni**, **Suorituslokit**, **Ota käyttöön/Poista käytöstä** ja **Pura alityönkulkuksi**.

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Katso Editor-demo</a></p>

## Suorita solmuun

Vie hiiri minkä tahansa solmun (muistilappua lukuun ottamatta) päälle ja napsauta sen alla olevaa **Suorita**-painiketta. Heym suorittaa kyseisen solmun ja sen riippuvuudet, jättäen alaspäin olevat solmut ja erilliset haarat koskemattomiksi. Tämä käyttää canvas-testitilaa, mukaan lukien kiinnitetyt tulosteet ja workflown normaaliset haaraehdot.

Jos valittu polku sisältää syötekenttiä, oikealla oleva **Suorita**-paneeli avautuu ja keskittyy ensimmäiseen kenttään. Syötä arvot ja napsauta **Suorita kohteeseen _solmun nimi_** tai paina **Ctrl+Enter** (macOS: Cmd+Enter). Geneerinen body-tila keskittyy JSON-body-editoriin. Polut ilman syötekenttiä suoritetaan välittömästi ilman paneelin avaamista. Kiinnitetyt syötesolmut käyttävät kiinnitettyä tulostetta uudelleen ilman syötteen pyytämistä.

Paneeli säilyttää valitun kohteen seuraavia suorituksia varten. Valitse **Suorita koko workflow** tyhjentääksesi kohteen. Suorita-painikkeet ovat pois käytöstä, kun suoritus on käynnissä. Silmukan sisällä oleva kohde pysäyttää suorituksen, kun solmu saavutetaan ensimmäisen kerran; silmukan jälkeisen solmun valitseminen suorittaa koko ylöspäin olevan silmukan.

## AI solmussa

Vie kohdistin minkä tahansa solmun päälle muistilappua lukuun ottamatta ja napsauta sen yläpuolella olevaa **AI**-painiketta. [AI Assistant](./ai-assistant.md) avautuu kyseiseen solmuun ja tarjoaa vaihtoehdot **Change this node as ...**, **Fix error in this node ...** ja **Other**. Agent-tilassa avustaja muuttaa vain kyseistä solmua; muut solmut, yhteydet ja asettelu pysyvät ennallaan. Katso [AI Assistant › Yhden solmun muuttaminen](./ai-assistant.md#changing-one-node).

Painike on piilotettu workfloweissa, joihin sinulla on vain katseluoikeus.

## Datapinni

Datapinni mahdollistaa solmun tulosteen kiinnittämisen viimeisestä suorituksesta, jolloin voit testata alaspäin olevia solmuja ilman kiinnitetyn solmun uudelleensuorittamista.

### Löydä se

- **Ominaisuuspaneeli** – Valitse solmu ja selaa **Kiinnitetty data** -osioon
- **Solmun merkki** – Solmussa näkyy pinnikuvake, kun data on kiinnitetty

### Toiminnot

| Toiminto | Kuvaus |
|--------|-------------|
| **Kiinnitä** | Kiinnittää solmun viimeisimmän suorituksen tulosteen (käytettävissä suorituksen jälkeen) |
| **Tyhjennä** | Poistaa kiinnitetyn datan |
| **Muokkaa** | Muokkaa kiinnitettyä JSONia suoraan; napsauta Tallenna soveltaaksesi muutokset |

### Testitilan toiminta

Kun workflowa suoritetaan testitilassa, solmut, joilla on `pinnedData`, ohittavat suorituksen ja käyttävät kiinnitettyä tulostetta sen sijaan. Käytä tätä:

- Testataksesi alaspäin olevaa logiikkaa ilman ulkoisten APIen kutsumista
- Virheenkorjaukseen lausekkeissa, jotka viittaavat solmun tulosteeseen
- Iteroidaksesi prompteja tai ehtoja kiinteällä näytedatalla

Editorin lausekkeiden täydennys käyttää kiinnitettyä dataa, kun se on saatavilla, ehdottaakseen kenttiä.

## Suorituslokit

**Virheenkorjauspaneeli** (alaosa) näyttää reaaliaikaisia suorituslokeja workflown suorituksen aikana. Voit myös avata käynnissä olevan tuotantosuorituksen joko Historian dialogista tai Board-kortista. Editori liittyy kyseisen suorituksen SSE-virtaan, palauttaa valmiiden solmujen tulokset ja jatkaa solmuanimaatioiden ja -lokkien näyttämistä uusien solmujen käynnistyessä ja päättyessä.

### Mitä se näyttää

- **Solmujen tulokset** – Solmukohtainen tila (`success`, `error`, `skipped`, `running`), suoritusaika ja tuloste
- **Lopputulokset** – [Tulostesolmun](../nodes/output-node.md) tuottamat koosteelliset tulosteet
- **Agentin edistyminen** – [Agenttisolmun](../nodes/agent-node.md) osalta vaiheittaiset työkalukutsut ja päättely

### Toiminnot

- **Kopioi JSONina** – Kopioi koko suoritusloki leikepöydälle
- **Avaa JSON-editorissa** – Avaa loki JSON Heroon tai JSON Editor Onlineen tarkastelua varten
- **Lataa generoidut tiedostot** – Jos taito tuotti ladattavia tiedostoja (`_generated_files`), näkyviin tulee Lataa-painike. Yksittäinen tiedosto ladataan suoraan; useat tiedostot avaavat valintapopupin.

### Ero lokivälilehteen

Virheenkorjauspaneeli näyttää **workflown suorituslokeja** (solmujen tulokset, tulosteet). [Lokivälilehti](../tabs/logs-tab.md) näyttää **Docker-säiliön lokeja** (taustajärjestelmä, käyttöliittymä, tietokanta). <!-- pragma: allowlist secret -->

## Ota käyttöön / Poista käytöstä

Voit poistaa solmut käytöstä, jolloin ne ohitetaan suorituksen aikana. Käytöstä poistetut solmut näyttävät "pois päältä" -merkin ja näkyvät himmentyneinä.

### Miten vaihtaa

| Menetelmä | Kuvaus |
|--------|-------------|
| **Ominaisuuspaneeli** | Valitse solmu → Virta-kuvake (oikeassa yläkulmassa) |
| **Pikavalikko** | Napsauta solmua hiiren oikealla → Poista käytöstä tai Ota käyttöön |
| **Näppäimistö** | Valitse solmu(t) → paina **D** (katso [Näppäimistön pikanäppäimet](./keyboard-shortcuts.md)) |

### Monivalinta

Kun useita solmuja on valittuna, Ota käyttöön/Poista käytöstä koskee kaikkia niihin. Pikavalikko näyttää "Ota käyttöön", jos mikä tahansa valituista solmuista on poistettu käytöstä, "Poista käytöstä", jos kaikki ovat käytössä.

### Suoritusaikainen toiminta

Solmut, joilla on `active: false`, ohitetaan. Alaspäin olevat solmut eivät saa dataa ohitetuista solmuista. Käytä tätä väliaikaisesti solmujen pois sulkemiseen ilman niiden poistamista.

Solmun käyttöönotto tai poisto workflown sisältä käsin tehdään käyttämällä [Poista solmu käytöstä](../nodes/disable-node.md) ja [Ota solmu käyttöön](../nodes/enable-node.md) -solmuja.
## Agentin muistigraafi

[Agentti](../nodes/agent-node.md)-solmut, joissa on **[pysyvä muisti](./agent-persistent-memory.md)**, näyttävät solmussa vaaleanpunaisen **aivo**-kuvakkeen. Klikkaa sitä avataksesi muistigraafin editorin: entiteetit renderöityvät animoituna, voimaohjattuna graafina, joka on ryhmitelty entiteettityypin mukaan. Käyttöliittymässä on haettavat Source/Target -valitsimet suhteiden lisäämiseen sekä yhteyksien paneeli linkitettyjen entiteettien välillä hyppimiseen. Samassa ikkunassa on myös **Jaa muisti muiden agenttien kanssa** (workflow → agent → luku tai luku/kirjoitus) [agenttien välistä muistin jakamista](./agent-persistent-memory.md#sharing-with-other-agents) varten. Kun ikkuna on auki, pääcanvasin peruutus-/toistotoiminnot ovat keskeytettyinä, jotta graafin muokkaus säilyttää oman historiansa.

**Graafin suodatus.** Canvasin vasemmassa yläkulmassa on hakukomponentti, joka on tiivistetty pikavalintanappiin, kunnes klikkaat sitä tai painat **Ctrl/Cmd+F**. Haku vastaa entiteetin nimeä, sen tyyppiä sekä kaikkia attribuuttiavaimia ja -arvoja, sekä suhteen tyyppiä (`parent_of`) ja sen ominaisuuksia; vastaava suhde tuo mukanaan molemmat siihen liittyvät entiteetit. Kaikkien välilyönnein erotettujen hakusanojen on täsmättävä. Vastaava entiteetti tuo mukanaan koko lähialueensa – jokaisen siihen liittyvän suhteen ja suhteen toisessa päässä olevan entiteetin – joten hakutulos ei koskaan jää irralliseksi pisteeksi. Vastaava suhde tuo vain kaksi siihen liittyvää entiteettiä ja pysähtyy siihen, koska suhteen tyypin hakeminen koskee kyseistä suhdetta eikä kaikkea, mihin sen päät liittyvät. Kaikki muu piilotetaan kokonaan – ei haalistettuna – sekä canvasilla että **All edges** -listassa, ja merkki näyttää, kuinka monta entiteettiä jäljellä on. **✕**-painike tyhjentää ensin haun ja sulkee sitten ikkunan toisella painalluksella. Escape-toiminto toimii samalla tavalla, sisimmästä ulospäin: se tyhjentää haun, sulkee sitten hakulaatikon, poistuu laajennetusta canvas-näkymästä ja sulkee vasta viimeisenä ikkunan, kun mikään edellisistä ei ole enää auki. Tyhjennys palauttaa koko graafin kaikkine entiteetteineen alkuperäiseen asentoonsa.

**Entiteettien manuaalinen sijoittelu.** Kun vedät entiteettiä, se kiinnitetään pudotuspaikkaan, jolloin automaattinen asettelu sijoittaa loput graafista sen ympärille sen sijaan, että vetäisi sitä takaisin. Valitun entiteetin siirtäminen liikuttaa myös sen suoraan kytkettyjä entiteettejä säilyttäen klusterin muodon; minkä tahansa muun entiteetin siirtäminen liikuttaa vain sitä yksittäistä. **Siisti asettelu** (sauvanappi) vapauttaa kaikki kiinnitetyt entiteetit ja suorittaa automaattisen asettelun uudelleen.

## Poimi alityönkulkuksi

Muunna valitut solmut uudelleenkäytettäväksi alityönkulkuksi ja korvaa ne [Suorita](../nodes/execute-node.md)-solmulla.

### Käyttöohje

1. Valitse yksi tai useampi solmu canvasilla
2. Klikkaa hiiren oikeaa painiketta → **Poimi alityönkulkuksi**
3. Anna uudelle työnkululle nimi (ja valinnainen kuvaus)
4. Klikkaa **Poimi**

### Mitä tapahtuu

- Uusi työnkulku luodaan valituista solmuista
- Ulkoiset syötteet (reunat valinnan ulkopuolelta) muuttuvat alityönkulun [Syöte](../nodes/input-node.md)-kentiksi
- Ulkoiset tulosteet (reunat solmuihin valinnan ulkopuolella) kytketään alityönkulun [Tuloste](../nodes/output-node.md)-solmuun
- Valitut solmut korvataan yhdellä [Suorita](../nodes/execute-node.md)-solmulla, joka kutsuu uutta työnkulkua
- Syöte-/tulostemääritykset säilyvät automaattisesti

### Käyttötapaukset

- Uudelleenkäytä solmujen sarjaa useissa työnkuluissa
- Yksinkertaista monimutkainen työnkulku ryhmittelemällä liittyvä logiikka
- Luo modulaarisia, testattavia alityönkulkuja

## Suorita cURL:lla

Editorin työkalupalkin oikeassa reunassa oleva **cURL**-painike avaa ikkunan, jossa voit rakentaa ja kopioida cURL-komennon työnkulun käynnistämiseksi API:n kautta.

- Valitse työnkulun pyynnön runkotila (`Määritelty` tai `Yleinen`)
- Aseta todennustyyppi (Anonyymi, JWT tai Otsikkotodennus)
- Määritä vastauksen välimuistointi ja rajoitukset
- Ota SSE-suoratoisto käyttöön ja mukauta solmukohtaisia aloitusviestejä
- Muokkaa pyynnön runkoa
- Yleisessä tilassa canvasin suorituspaneeli käyttää samaa raakaa JSON-runkoa kuin cURL-ikkuna
- Klikkaa **Kopioi cURL** kopioidaksesi valmiin komennon

Katso [Webhookit](./webhooks.md#run-with-curl-dialog) täydellisistä ikkunan tiedoista ja [SSE-suoratoisto](./sse-streaming.md) tapahtumaprotokollasta.

## Aiheeseen liittyvää

- [Pikanäppäimet](./keyboard-shortcuts.md) – Kaikki canvas- ja editorin pikanäppäimet
- [Agentin pysyvä muisti](./agent-persistent-memory.md) – Muistigraafin toiminta ja API
- [Suorita-solmu](../nodes/execute-node.md) – Kutsuu alityönkulkuja
- [Lausekkeiden DSL](./expression-dsl.md) – Viitteet ja kiinnitetty data
- [Työnkulun rakenne](./workflow-structure.md) – Solmujen ja reunojen muoto
- [Lataa & tuo](./download-import.md) – Vie ja tuo työnkulkuja JSON-muodossa
- [Solmutyypit](./node-types.md) – Kaikki solmutyypit
- [Lokit-välilehti](../tabs/logs-tab.md) – Docker-säiliöiden lokit
- [Suoritushistoria](./execution-history.md) – Aikaisemmat suoritukset
- [Mallit](../tabs/templates-tab.md) – Tallenna ja käytä uudelleen työnkulkuja ja solmuja
- [Kontekstuaalinen esittely](./contextual-showcase.md) – Tiivis sivun opas, joka on saatavilla editorissa

- [Canvas-yhteistyö](./canvas-collaboration.md): Live editing on a shared draft with pointers, following, and voice.
