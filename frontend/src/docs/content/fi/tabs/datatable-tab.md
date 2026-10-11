# DataTable

**DataTable**-välilehdellä voit luoda ja hallita rakenteellisia datataulukoita suoraan Heymissä. Taulukoita voidaan käyttää workfloweissa [DataTable-solmun](../nodes/datatable-node.md) avulla ohjelmallisesti CRUD-operaatioiden toteuttamiseen.

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Katso DataTable-esittely</a></p>

## Taulukon luominen

1. Siirry DataTable-välilehdelle hallintapaneelista
2. Valitse **Create DataTable**
3. Anna nimi ja valinnainen kuvaus
4. Lisää sarakkeet sarakeeditorilla

## Sarakkeet

Jokaisella sarakkeella on seuraavat ominaisuudet:

| Ominaisuus | Kuvaus |
|----------|-------------|
| Nimi | Sarakkeen näyttönimi |
| Tyyppi | `string`, `number`, `boolean`, `date` tai `json` |
| Pakollinen | Onko sarake pakollinen uusille riveille |
| Yksilöllinen | Onko sarakkeen arvojen oltava uniikkeja |
| Oletusarvo | Automaattisesti täytettävä arvo, jos rivi jättää sarakkeen tyhjäksi |

Sarakkeita voi lisätä, muokata ja poistaa taulukon yksityiskohtanäkymän yläosasta.

## Sarakkeiden luonti tekoälyllä

Sarakkeita voi luoda myös kuvauksen perusteella tekoälyavusteisesti (tai liittämällä JSON-mallin). Molemmat vaihtoehdot avaavat saman dialogin:

- **Generate with AI** (DataTable-luettelon yläosa) - luo uuden taulukon annetun kuvauksen perusteella.
- **AI columns** (taulukon yksityiskohtanäkymä, sarakkeiden hallintanappien vieressä) - ehdottaa uusia sarakkeita lisättäväksi nykyiseen taulukkoon.

### Toimintaperiaate

1. Valitse **LLM-tunnistetiedot** ja **malli** (oletuksena käytetään ensimmäistä LLM-tunnistetietoasi ja sen uusinta mallia).
2. Kirjoita kuvaus - esimerkiksi *"Kirjojen taulukko, jossa on nimi, kirjoittaja, sivumäärä ja luettu-status"* - tai liitä JSON-malli/esimerkki.
3. Klikkaa **Generate**. Malli palauttaa ehdotetun rakenteen.
4. Tarkista luodut sarakkeet muokattavassa lomakkeessa: muuta **nimeä**, **tyyppiä**, **oletusarvoa**, **yksilöllisyyttä** ja **pakollisuutta** kullekin sarakkeelle, poista tarpeettomat sarakkeet tai **lisää sarake** manuaalisesti. Uuden taulukon kohdalla voit myös muokata tekoälyn ehdottamaa **nimeä** ja **kuvausta**.
5. Klikkaa **Create Table** (uusi taulukko) tai **Add Columns** (olemassa oleva taulukko) tallentaaksesi. Paina **Esc** sulkeaksesi dialogin milloin tahansa.

### Lisäys vain olemassa oleviin taulukoihin

Kun luot sarakkeita olemassa olevaan taulukkoon, malli näkee nykyiset sarakkeet kontekstina ja ehdottaa **vain uusia** sarakkeita. Olemassa olevia sarakkeita tai niiden tietoja ei koskaan muokata tai poisteta - luodut sarakkeet lisätään taulukon loppuun. Duplikaattinimet (kirjainkoosta riippumatta) hylätään automaattisesti.

> LLM-tunnistetiedot (OpenAI, Google tai Custom) vaaditaan. Jos sinulla ei ole tunnistetietoja, lisää ne ensin Asetuksista.

## Rivien hallinta

- **Lisää rivi**: Klikkaa lisäyspainiketta luodaksesi uuden rivin
- **Suora muokkaus**: Kaksoisklikkaa mitä tahansa solua muokataksesi sen arvoa. Paina Enter tai klikkaa muualta tallentaaksesi, Escape peruuttaaksesi
- **Poista rivi**: Käytä rivin toimintovalikkoa poistaaksesi rivin
- **Sivutus**: Rivit näytetään 25 kerrallaan sivutuksella

## CSV-tuonti/vienti

### Tuonti
1. Klikkaa **Import CSV** taulukon yksityiskohtanäkymässä
2. Valitse ladattava CSV-tiedosto
3. Esikatsele 5 ensimmäistä riviä ja sarakkeiden yhdistämistä
4. Vihreät sarakkeet on yhdistetty olemassa oleviin sarakkeisiin; keltaiset eivät ole yhdistetty
5. Klikkaa Import joukkolisätäksesi rivit

### Vienti
Klikkaa **Export CSV** ladataaksesi kaikki rivit CSV-tiedostona.

## Jakaminen

Jaa taulukoita muiden käyttäjien tai tiimien kanssa:

1. Avaa jakodialogi taulukon yksityiskohtanäkymästä
2. Lisää käyttäjiä sähköpostiosoitteella **luku**- tai **kirjoitus**-oikeuksilla
3. Lisää tiimejä **luku**- tai **kirjoitus**-oikeuksilla
4. Lukuoikeudet antavat lukuaccessin; kirjoitusoikeudet mahdollistavat rivien muokkaamisen

## Taulukoiden luonti tekoälyavustajalla

Canvasin [AI Assistant](../reference/ai-assistant.md#data-tables), [Keskustelu](./chat-tab.md) ja `heym_chat`-työkalu [MCP-välilehdellä](./mcp-tab.md) voivat valita yhden taulukoistasi workflowa varten tai luoda uuden. Ne ehdottavat nimeä ja sarakkeita sekä luovat taulukon, kun hyväksyt ehdotuksen. Ne eivät koskaan muuta olemassa olevan taulukon sarakkeita tai rivejä - lisää tai muokkaa sarakkeita tässä.

## Käyttö workfloweissa

[DataTable-solmu](../nodes/datatable-node.md) yhdistää taulukot workfloweihin. Toimintoihin kuuluu find, getAll, getById, insert, update, remove ja upsert. Tunnistetietoja ei vaadita.

## LLM-kustannustaulukko (järjestelmätaulukko)

Kiinnitetyssä **System tables** -osiossa näkyy yksi oletustaulu: **LLM Cost Table**. Tämä on kiinteärakenteinen, käyttäjätason muokattava näkymä mallikohtaisista hinnoista, joita käytetään [Suoritusten](./traces-tab.md) kustannuskaavioissa.

### Datan lähde

Heym pitää yllä globaalia mallikohtaisten hintojen taulukkoa, joka täytetään Heliconen julkisesta hinnoittelupisteestä (`https://www.helicone.ai/api/llm-costs`). Synkronointi suoritetaan taustalla ensimmäisen kerran, kun avaat taulukon tai Suoritukset, ja rajoitettu yhteen hakuun 24 tunnin sisällä. Paina **Refresh** pakottaaksesi välittömän uudistuksen. Heliconen poistamat mallit eivät poistu paikallisesti, jotta historialliset kustannushaut pysyvät ennallaan.

### Rakenne (vain luku -sarakkeet)

| Sarake | Merkitys |
|---|---|
| Provider | `ANTHROPIC`, `OPENAI`, `GOOGLE`, … (informatiivinen, käytetään Heliconeen) |
| Model | Mallitunniste, joka vastaa `trace.model` -arvoa |
| Op | Täsmäysoperaattori: `equals`, `startsWith` tai `includes` |
| Input $/1M | USD 1 miljoonaa prompt-tokenia kohti |
| Output $/1M | USD 1 miljoonaa completion-tokenia kohti |
| Source | `helicone`, `seed` tai `user` |
### Hinnoittelun mukauttaminen

- **Muokkaa riviä** ohittaaksesi sen hinnat. Mukauttamisesi on käyttäjäkohtainen ja se merkitään `Customized`-merkinnällä; tulevat Helicone-synkronoinnit eivät muuta sitä.
- **Palauta oletusarvo** poistaa mukautuksen ja palauttaa rivin globaalin arvon.
- **Lisää mukautettu malli** avaa valintaikkunan käyttäjäkohtaisten rivien luomista varten (esimerkiksi yksityisiä hienosäädettyjä malleja, joita Helicone ei listaa). Mukautetut rivit merkitään `User added` -merkinnällä, ja niiden poistaminen poistaa ne kokonaan.

### Yhteensopivuus suoritusten kanssa

Kun Suoritukset-koontinäkymä laskee kustannukset, se vertaa jokaisen `trace.model`:n seuraaviin:

1. Ensin käyttäjän mukautuksiin (tarkka täsmäys mallin nimellä)
2. Muuten globaaliin taulukkoon – `equals`-tarkka täsmäys saa etusijan verrattuna `startsWith`/`includes`-operaattoreihin; saman operaattorin sisällä ratkaisee pisimmän täsmäävän mallin etuliite/alimerkintä

Jos mikään rivi ei täsmää, malli listataan Suoritukset-sivun **Hinnoittelemattomat mallit** -ilmoituksessa; sen kustannusosuus on nolla, kunnes lisäät mukautetun rivin tai ohitat olemassa olevan.

## Aiheeseen liittyvät

- [Datataulukko-solmu](../nodes/datatable-node.md) - Workflow-solmun viite
- [Suoritukset-välilehti](./traces-tab.md) - Käyttää LLM Cost Tablea kustannusdiagrammia ja KPI-kortteja varten
- [Grist-solmu](../nodes/grist-node.md) - Vaihtoehtoinen ulkoinen laskentataulukko
- [Muuttujat-välilehti](./global-variables-tab.md) - Vaihtoehtoinen avain-arvo -tallennus
