# Suoritushistoria

Suoritushistoria tallentaa workflowt: syötteet, tulosteet, solmujen tulokset, tila ja trigger-lähde. Sitä voidaan käyttää aktiivisen tuotantosuorituksen seuraamiseen, menneiden suoritusten tarkasteluun, virheiden debuggaamiseen tai samojen syötteiden avulla uudelleen suorittamiseen käyttämällä **Bring to Canvas** -toimintoa.

## Yleiskatsaus

Jokainen suoritus tallentaa seuraavat tiedot:

| Kenttä | Kuvaus |
|-------|-------------|
| **Syötteet** | Pyynnön runko tai suorituksen syötteet (esim. `text` Input-solmuun) |
| **Tulosteet** | Workflow-tason tulosteet |
| **Solmujen tulokset** | Solmukohtaiset tulosteet, tila ja suoritusaika |
| **Tila** | `success`, `error`, `pending`, `skipped` tai `failed` (katso [Crash Recovery](#crash-recovery)) |
| **trigger_source** | Miten suoritus käynnistettiin (katso [Triggers](./triggers.md)) |

## Historian käyttö

| Sijainti | Laajuus |
|----------|-------|
| **Editorin** työkalurivi | Vain nykyinen workflow |
| **Docs**-näkymän otsikko | Vain nykyinen workflow |
| **Dashboard**-otsikko (Chat-välilehti) | Kaikki workflowt + chat/assistant-suoritukset |
| **Evals**-näkymän otsikko | Kaikki workflowt + chat/assistant-suoritukset |

Avaa dialogi napsauttamalla **History**-painiketta (kellokuvake).

## Workflowkohtainen vs. kaikki historia

- **Workflowkohtainen** (Editor, Docs): Näyttää nykyisen workflown suoritukset. Käytä **Clear history** -toimintoa poistaaksesi vain kyseisen workflown suoritukset.
- **Kaikki historia** (Dashboard, Evals): Näyttää suoritukset kaikista workflowista ja chat/assistant-sessioista. Näkyvyys vastaa workflow-käyttöoikeuksia: omistamasi workflowt, suoraan kanssasi jaetut workflowt sekä tiimillesi jaetut workflowt. Käytä **Clear all history** -toimintoa poistaaksesi kaikki omistamasi tietueet. Jaettujen workflowjen historia säilyy.

## Bring to Canvas

**Bring to Canvas** lataa valitun suorituksen syötteet ja solmujen tulosteet nykyiseen workflowhun.

### Mitä se lataa

- **Syötteet** → Suoritussyötepaneeli (esim. `text` Input-solmuun tai mukautetut kentät)
- **Solmujen tulokset** → Suoritustulospaneeli näyttää menneet tulosteet solmukohtaisesti
- **Suoritustulos** → Tila, tulosteet ja ajotiedot suorituksesta

### Toiminta kontekstin mukaan

- **Editorissa** (workflowkohtainen historia): Soveltaa välittömästi avoinna olevaan workflowhun ja sulkee dialogin.
- **Kaikesta historiasta** (Dashboard/Evals): Siirtyy workflow-editoriin ja soveltaa tiedot editorin latauduttua. Vain workflow-suorituksille – ei chat/assistant-suorituksille.

### Suorituslinkki

Workflown avaaminen osoitteessa `/workflows/{workflowId}/{executionId}` lataa automaattisesti kyseisen suorituksen canvasille – sama kuin valitsisi suorituksen ja käyttäisi **Bring to Canvas** -toimintoa. Tämä tekee tietystä menneestä suorituksesta jaettavan URL-osoitteen. Jos suoritusta ei löydy (väärä tai poistettu id), editori palauttaa workflown tavallisesti.

### Käyttötapaukset

- Suorita workflow uudelleen samoilla syötteillä
- Debuggaa epäonnistunutta suoritusta tarkastelemalla syötteitä ja solmujen tuloksia
- Vertaa tulosteita eri suoritusten välillä

## Suorituskorostukset

Live-suorituksen jälkeen – tai **Bring to Canvas** -toiminnon jälkeen – **Canvasin oikeassa yläkulmassa** ilmestyy suljettava **Execution Highlights** -ponnahdusikkuna. Se on nopea tapa nähdä *mitä kukin solmu tuotti*, listattuna ylhäältä alas suoritusjärjestyksessä. Sulje se painikkeella **✕**; se avautuu uudelleen seuraavalla suorituksella.

### Mitä näytetään

| Tietue | Lähde | Automaattinen? |
|--------|--------|-------|
| **Syöte** | Suorituksen syöteparametrit (input/trigger-solmu) | Kyllä |
| **Tuloste** | Output-solmun tulos – tai jos sitä ei ole, viimeisen solmun viesti | Kyllä |
| **Agentti / LLM** | Kunkin agentti- tai LLM-solmun tulos | Kyllä |
| **Tuloste** | Mikä tahansa muu solmu, jossa **Highlight Node Output** on käytössä | Valinnainen |

Solmut, jotka ovat jo automaattisesti korostettuja (input / output / viimeinen / agentti / LLM), eivät koskaan näy kahdesti, vaikka valitsisit myös valintaruudun.

### Jokainen tietue

- Näyttää `Solmu – viesti…` ensimmäisillä **250 merkillä**; napsauta riviä laajentaaksesi sen ja renderöidäksesi **koko viesti Markdownina**, jossa on **Copy**-painike.
- Solmu, joka suoritettiin useita kertoja (esim. silmukan sisällä), näyttää `Solmu (N)` ja `‹ i / N ›` -valitsimen – valitse, mikä suoritus näytetään; kunkin solmun valitsin on riippumaton.

### Highlight Node Output

Jokaisella solmulla **paitsi Agentilla ja LLM:llä** on ominaisuuspanelissa **Highlight Node Output** -valintaruutu (oletuksena pois käytöstä). Ota se käyttöön lisätäksesi solmun tuloksen ponnahdusikkunaan. Pieni ✦-merkki ilmestyy korostettujen solmujen viereen canvasilla. [Workflow DSL](./expression-dsl.md):ssa tämä on solmutietokenttä `"highlight": true` (oletuksena `false`).

### Dashboardeilla

Dashboard-widget-kortit, jotka suorittivat workflown, näyttävät ✦ **Execution highlights** -painikkeen kortin otsikossa; napsauta sitä avataksesi saman ponnahdusikkunan kyseisen widgetin suoritukselle, jossa widgetin piirretty tulos on näkyvimmällä tietueella.
## Käynnissä olevat suoritukset

Molemmat historiadialogit näyttävät **käynnissä olevat suoritukset** listan yläosassa, ennen aiemmin suoritettuja.

- Pyörivä indikaattori ja **Running**-teksti näkyvät aloitusajan kanssa
- Klikkaa **Open live** liittääksesi editorin kyseiseen suoritukseen ilman sen uudelleenkäynnistämistä
- Canvas palauttaa ensin solmut, jotka ovat jo suoritettu, ja vastaanottaa sitten
  `node_start`, `node_complete` ja lopulliset suoritustapahtumat SSE:n kautta
- Nykyinen solmu sykkii canvaksella, alaspäin suuntautuvat solmut säilyttävät odotusanimationsa, ja
  Debug-paneeli lisää jokaisen tuloksen sen saapuessa – aivan kuten editorista käynnistetyssä suorituksessa
- Klikkaa **Cancel** pysäyttääksesi suorituksen välittömästi
- Peruutus mistä tahansa dialogista (Editor tai Dashboard) sulkee myös aktiivisen SSE-virran kaikissa kyseisen workflown avoimissa canvas-välilehdissä, joten editorin tila palautuu puhtaasti
- Peruutuksen jälkeen käynnissä oleva merkintä katoaa seuraavalla päivityksellä; paina **Refresh** päivittääksesi listan manuaalisesti
- Jos peruutat suorituksen, joka on jo valmis, pyyntö on no-op

Live-URL on `/workflows/{workflowId}/{executionId}`. Tarkkailija on vain luku -tilassa: editorista poistuminen katkaisee vain kyseisen selainvälilehden yhteyden eikä koskaan pysäytä workflowta. Aktiiviset tilannevedokset jaetaan PostgreSQL:n kautta, joten suorituksen avaaminen toimii edelleen, vaikka trigger ja editoripyyntö osuvat eri taustaprosesseihin.

## Kaatumisen jälkeinen palautuminen

Jos palvelin käynnistetään uudelleen (deploy, kontin uudelleenkäynnistys tai kaatuminen) workflown ollessa käynnissä, kyseisen suorituksen työntekijäprosessi pysähtyy kesken suorituksen. Heym palauttaa automaattisesti nämä keskeytyneet suoritukset sen sijaan, että ne jäisivät jumiin tilaan **Running**.

- Seuraavalla käynnistyksellä valittu johtoprosessi havaitsee orvot suoritukset – välittömästi sulavassa uudelleenkäynnistyksessä tai noin 60 sekunnin kuluessa kovassa kaatumisessa (kun sydämenlyönnit selvästi pysähtyvät).
- Palautetut suoritukset **suoritetaan alusta samalla syötteellä** (eivätkä jatketa siitä, mihin ne pysähtyivät), käyttäen nykyistä workflow-määritelmää. Valmistuttuaan ne tallentavat normaalin päättymismerkinnän (esim. `success`), joten historia näyttää suorituksen valmistuneena.
- Suoritus yritetään **kerran**. Jos palautusyritys keskeytyy myös – tai workflow on sittemmin poistettu – merkintä tallennetaan tilaan `failed`.
- Tämä toimii samalla tavalla sekä yksittäisessä kontissa että monityöntekijäkäytöissä; vain johtaja suorittaa palautuksen, joten suoritusta ei koskaan palauteta kahdesti eri työntekijöiden toimesta.

### Automaattisen palautuksen vaihtoehto

Editorin **Execution Log** (suoritus) -paneelissa on **Auto-recover** -valintaruutu, joka on **oletuksena päällä** workflowa kohti.

- **Päällä**: keskeytyneet workflown suoritukset suoritetaan uudelleen kuten edellä kuvattu.
- **Pois päältä**: keskeytyneet suoritukset eivät suoriteta uudelleen ja ne tallennetaan tilaan `skipped`.

> Alisuorituksia ei palauteta itsenäisesti – ne ajetaan uudelleen niiden palautetun pääsuorituksen toimesta. Triggersit, joilla on oma uudelleentoimitus (RabbitMQ, aikataulutettu/cron, IMAP), voivat myös toimittaa uudelleen käynnistyksen yhteydessä, joten palautettu suoritus voi joskus suorittaa kahdesti.

## Odottava ihmisen tarkastus

Suoritukset, jotka pysähtyvät [Ihmisen tarkastuksen](./human-in-the-loop.md) hyväksyntää varten, kirjataan historiaan välittömästi tilaan `pending`.

- Odottava agenttisolmu tallentaa tarkastuspayloadin, joka sisältää `reviewUrl`, `draftText` ja `expiresAt`
- Kaikki solmut, jotka on kytketty agentin `review` -kahvaan, voivat myös suorittaa ennen kuin ihminen vastaa, ja niiden solmutulokset tallennetaan samaan odottavaan historiamerkintään
- Historian dialogit näyttävät tarkastuslinkin, jotta omistajat voivat kopioida tai avata sen
- Historian dialogit ja editorin Debug-paneeli näyttävät lopullisen ihmisen päätöksen suorituksen jatkumisen jälkeen
- Kun tarkastaja hyväksyy, muokkaa tai hylkää luonnoksen, sama historiamerkintä päivitetään lopullisella suoritustuloksella
- Jos sama suoritus pysähtyy HITL:lle useammin kuin kerran, historiamerkintä pysyy samana, kun jokainen tarkastuspiste saa oman kertakäyttöisen tarkastuslinkin

Tämä on erityisen hyödyllistä portaalisuorituksissa ja pitkäikäisissä workflowissa, jotka saattavat odottaa tunteja tai päiviä ennen jatkamista.

## Kopioi

Käytä **Copy** -painiketta Inputs- tai Outputs-kohdien vieressä kopioidaksesi JSON:n leikepöydälle.

## Tyhjennä historia

- **Workflowa kohti**: Editorin historiadialogissa klikkaa **Clear history** poistaaksesi nykyisen workflown suoritukset.
- **Kaikki historia**: Dashboard/Evals-historian dialogissa klikkaa **Clear all history** poistaaksesi kaikki omistamasi suoritusmerkinnät. Jaettujen workflowjen suoritukset säilytetään. Tätä toimintoa ei voi peruuttaa.

## Suoritusaikajanan yksityiskohdat

Kun editorin **Execution Log** on auki, klikkaa kellopainiketta nähdäksesi suoritusaikajanan. Valitse aikaväli avataksesi inline-tarkastusikkunan, joka vie rivialueen haltuunsa. Se näyttää valitun vaiheen tilan, keston, yritysmäärän, uudelleenyritystiedot, virheet, jälkitunnuksen ja tiiviin tulosteen esikatselun. Objekti- ja taulukkotulostukset käyttävät samaa `JsonTree` -katselinta kuin Debug-paneelin muu osa; skalaariarvot käyttävät tekstiesikatselua. Kun vaihe tuottaa kuvia (Playwright-näyttökuvat, generoidut kuvat, kuvatiedostot), ne näkyvät pikkukuvina tulosteen yläpuolella, ja JSON näyttää lyhyen paikkamerkin raakabase64:n sijasta. Klikkaa pikkukuvaa avataksesi sen valokehykseen; nuolipainikkeet tai ←/→ -näppäimet selaa läpi kaikki suorituksen kuvat, laskurin kanssa, kuten `2 / 5`. Käytä **Open trace** -painiketta LLM- ja Agent-spanien yhteydessä, kun jälkitunnus on saatavilla.
## Mobiilisolmun tiedot

Puhelimella editori näyttää täysikokoista workflow-puuta vapaamuotoisen canvaksen sijaan. Napauta puun solmua, jolla on tallennettu tulos, avataksesi sen suorituksen täysinäytön tiedoissa. Näkymä tarjoaa erilliset **Syötetiedot**, **Tulostiedot** ja **Virheet** -välilehdet. Tuloste-välilehdellä näkyy tallennettu tulos ja **Kopioi tuloste** -toiminto; syöte-välilehdellä näkyy valitun solmun asetukset, ja virheet-välilehdellä näkyy tallennettu virhe, kun solmu epäonnistui. Palaa workflow-puuhun käyttämällä **Takaisin workflowyn** -painiketta tai sulje-nappia.

Canvas ja dashboard-historia -valintojen suoritusvalvonta pysyy yhdellä rivillä, ja saatavilla olevat tagi- ja instanssisuodattimet asetetaan responsiiviseen ruudukkoon. Niiden suodatinvalikot käyttävät samaa sovelluksen sisäistä valitsijaa, joten valittu rastimerkki on yhtenäinen ja linjassa jokaisen vaihtoehdon otsikon kanssa.

## Aiheeseen liittyvää

- [Triggerit](./triggers.md) – Kuinka workflowt käynnistetään; historia tallentaa `trigger_source` -arvon (mukaan lukien `board` -arvo [Board](../tabs/board-tab.md) -korttien siirroilla ja seurannoilla käynnistetyille suorituksille)
- [Ihmisen osallistuminen](./human-in-the-loop.md) – Odottavat arviointilinkit ja jatkamiskäyttäytyminen
- [Muokkaushistoria](./edit-history.md) – Versionhallinta workflow-tallennuksille (palautus, vertailu)
- [Pika-aloitus](../getting-started/quick-start.md) – Rakenna ja suorita ensimmäinen workflow
- [Workflowt-välilehti](../tabs/workflows-tab.md) – Workflowjen luominen ja hallinta
