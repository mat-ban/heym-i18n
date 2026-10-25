# AI-avustaja

**AI-avustaja** on keskustelupaneeli, joka avautuu Debug-paneelista ja sijaitsee oletuksena editorin oikeassa alakulmassa. Voit siirtää paneelia vetämällä sen otsikkoa ja muuttaa sen kokoa vetämällä reunaa tai kulmaa. Paneeli ei kutistu alle 360×480 pikselin kokoon. Sijainti ja koko muistetaan tässä selaimessa. **Nollaa sijainti ja koko** -toiminto otsikossa palauttaa paneelin oikeaan alakulmaan. Käytä luonnollista kieltä workflowjen luomiseen tai muokkaamiseen – kuvaile haluamasi toiminnallisuus, ja tekoäly luo solmut ja yhteydet, jotka sovelletaan canvas-alueelle.

Dokumentaatiokysymyksiin editorin ulkopuolella käytä [Keskustele Heymin kanssa](./chat-with-heym.md). Tämä toiminto on optimoitu sivupohjaiseen tuoteavun tarjoamiseen workflowjen luomisen sijaan.

## Paneelin avaaminen

1. Avaa workflow editorissa
2. Etsi **Debug-paneeli** alareunasta (suoritustulosten alue)
3. Klikkaa **AI**-painiketta (Kipinöitä-ikoni) paneelin työkalurivillä
4. AI-avustajan paneeli avautuu oikeaan alakulmaan. Voit siirtää sitä vetämällä otsikkoa tai muuttaa kokoa vetämällä reunaa tai kulmaa.

Paina `Ctrl + I` / `Cmd + I` missä tahansa editorissa avataksesi tai sulkeaksesi paneelin – pikanäppäin toimii myös, kun tekstikenttä on aktiivisena. Katso [Pikanäppäimet](./keyboard-shortcuts.md).

Jos haluat käsitellä yhtä solmua, vie kohdistin sen päälle kankaalla ja napsauta sen yläpuolella olevaa **AI**-painiketta. Paneeli avautuu kyseiseen solmuun kohdistettuna. Katso [Yhden solmun muuttaminen](#changing-one-node).

## Paneelin sulkeminen

Klikkaa **X**-painiketta, paina `Ctrl + I` / `Cmd + I` tai vaihda **AI**-painikkeen tilaa Debug-paneelin työkalurivillä. Otsikkoa vetämällä siirrät paneelia; se ei sulje sitä.

## Asetukset

Ennen viestien lähettämistä valitse:

| Asetus | Kuvaus |
|---------|-------------|
| **Tunnistetiedot** | LLM-tunnistetiedot (API-avain) [Tunnistetiedot](../tabs/credentials-tab.md) -välilehdeltä |
| **Malli** | Mallin nimi (esim. `gpt-4o`, `gemini-2.5-flash`) |

Lisää tunnistetiedot [Tunnistetiedot](../tabs/credentials-tab.md) -välilehdellä. Malliluettelo ladataan valitun tunnistiedon perusteella.

## Agentti-tila vs Kysely-tila

Paneelissa on kaksi tilaa, joita voi vaihtaa **Agentti / Kysely** -valintapainikkeella paneelin otsikossa.

| Tila | Oletus | Toiminta |
|------|---------|-----------|
| **Agentti** | ✓ | Muokkaa canvas-aluetta. Tekoäly luo workflow-JSON-lohkon, joka sovelletaan automaattisesti canvas-alueelle, kun vastaus on valmis. |
| **Kysely** | | Vastaa vain kysymyksiin. Canvas-aluetta ei koskaan muokata. Käytä tätä kysyäksesi workflowstasi, Heymin ominaisuuksista tai saadaksesi neuvoja ilman canvas-päivityksiä. |

Vaihda tilaa milloin tahansa. Tilojen vaihtaminen ei tyhjennä keskustelua.

Agentti-tilassa **YOLO-tila** -valintaruutu viestikentän alla mahdollistaa avustajan testaamaan luomiaan muutoksia. Katso [YOLO-tila](#yolo-tila).

## Keskustelun käyttö

- Kirjoita pyyntösi syötekenttään (esim. "Luo workflow, joka ottaa käyttäjän syötteen ja lähettää sen LLM:lle")
- Paina **Enter** lähettääksesi (Shift+Enter rivinvaihtoa varten)
- Tekoäly lähettää vastauksensa osissa. **Agentti**-tilassa, jos vastaus sisältää workflown \`\`\`json-koodilohkossa, se jäsennetään ja sovelletaan automaattisesti canvas-alueelle. **Kysely**-tilassa canvas-aluetta ei koskaan muokata.
- Käytä **Tyhjennä** -painiketta nollataksesi keskustelun
- Vie hiiri viestin päälle ja klikkaa kopiointikuvaketta kopioidaksesi näkyvän tekstin, mukaan lukien mahdollinen workflow-JSON
- Vedä viestikentän yläpuolella olevaa viivaa korkeammaksi. Syötealue voi kasvaa enintään 60 % paneelin korkeudesta, ja se palautuu oletuskorkeuteen sivun uudelleenlatauksessa

## Workflown automaattinen soveltaminen

Kun tekoälyn vastaus sisältää kelvollisen workflow-JSON-lohkon (jossa on `nodes` ja valinnaisesti `edges`) \`\`\`json-koodilohkossa, Heym:

1. Jäsentää JSONin vastauksesta
2. Korvaa nykyisen canvas-alueen uusilla solmuilla ja yhteyksillä
3. Siistii solmujen asettelun
4. Merkkaa workflown tallentamattomaksi

Jos jäsennys epäonnistuu, näkyviin tulee **Yritä uudelleen** -painike vastauksen uudelleenluomista varten.

## Yhden solmun muuttaminen

Vie kohdistin kankaalla olevan solmun päälle ja napsauta sen yläpuolella olevaa **AI**-painiketta. Paneeli avautuu Agent-tilassa kyseiseen solmuun kohdistettuna ja näyttää, mitä solmua se muuttaa:

| Solmulla on... | Paneeli näyttää |
|---|---|
| Ei tulosta nykyisessä suorituksessa | **Modifying Node:** kompaktilla rivillä solmun kuvakkeen ja nimen kanssa. Avustaja muokkaa vain solmun omasta konfiguraatiosta; suorita solmu ensin, jos sen pitäisi nähdä tuloste |
| Tulos nykyisessä suorituksessa | **Modifying Node: (Has Node Output)** itse solmun yläpuolella: kuvake, nimi ja tyyppi, viimeisin tila ja kesto sekä virhe, jos suoritus epäonnistui. Avustaja näkee tämän tulosteen ja virheen muokatessaan solmua |

Vie kohdistin tunnisteen päälle nähdäksesi, missä tilassa paneeli on.

Riippumatta paneelin tilasta avustaja lukee myös solmun dokumentaatiosivun, joka löytyy solmun otsikon kirjakuvakkeen takaa. Se käyttää sivua solmun asetusten ymmärtämiseen ja niitä koskeviin kysymyksiin vastaamiseen.

Viestien alla kolme vaihtoehtoa aloittaa pyynnön:

| Vaihtoehto | Mitä se tekee |
|---|---|
| **Change this node as ...** | Täyttää viestikenttään tekstin *Muuta tämä solmu muotoon*, jotta voit viimeistellä lauseen |
| **Fix error in this node ...** | Täyttää *Korjaa tämän solmun virhe.* Avustaja lukee tämän solmun virheen viimeisimmästä suorituksesta |
| **Other** | Kohdistaa tyhjään viestikenttään |

Muokkaa tekstiä ja paina **Send**. Avustaja palauttaa vain tämän solmun ja Heym päivittää sen paikalleen: solmu säilyttää id:nsä, tyyppinsä ja nimensä, joten lausekkeet kuten `$checkLinkedIn.result` muissa solmuissa toimivat edelleen. Muut solmut, yhteydet ja asettelu eivät muutu, ja **Undo** palauttaa aiemman konfiguraation.

Jos pyyntö ei mahdu solmuun, esimerkiksi vaatii toisen solmutyypin tai uuden solmun, avustaja ilmoittaa muokkauksen sijaan, mitä pitäisi muuttaa. Sulje solmun kohdistus solmukortin **X**-painikkeella muokataksesi koko workflowta uudelleen. Paneelin sulkeminen poistaa myös kohdistuksen.

[YOLO-tila](#yolo-mode) toimii kohdistetun solmun kanssa: avustaja muuttaa solmua, suorittaa workflown ja korjaa solmua, kunnes suoritus onnistuu. **Ask**-tilassa kohdistus kertoo avustajalle, mitä solmua kysymyksesi koskee, eikä kangasta muuteta.

## YOLO-tila

**YOLO-tila** mahdollistaa avustajan testata luomiaan muutoksia. Valitse **YOLO-tila** -valintaruutu viestikentän alla ennen pyynnön lähettämistä. Valintaruutu näkyy vain Agentti-tilassa ja on oletuksena pois päältä. Sivun uudelleenlatauksessa se palautuu pois päältä -tilaan. Vie hiiri valintaruudun vieressä olevan info-kuvakkeen päälle nähdäksesi lyhyen yhteenvedon.

YOLO-tilassa päällä avustaja ei pysähdy workflown soveltamisen jälkeen:

1. Se soveltaa workflown canvas-alueelle.
2. Ennen ensimmäistä suoritusta se pyytää testisyötteitä. Kortissa listataan workflown syötekentät, jotka avustaja ehdottaa täytettäviksi. Muokkaa arvoja ja paina **Suorita**. Myöhemmät suoritukset käyttävät samoja arvoja. Kortti tulee näkyviin vain, jos syötekentät muuttuvat tai avustaja tarvitsee erilaisia testitietoja.
3. Se suorittaa workflown canvas-alueella kuten **Suorita**-painike: tallentamattomat muutokset tallennetaan ensin, solmut valaistuvat, ja suoritus näkyy Debug-paneelissa sekä [Suoritushistoriassa](./execution-history.md).
4. Se lukee tuloksen. Jos suoritus toteutti pyydetyn, se päättyy **Vahvistettu** -ilmoitukseen ja lyhyeen yhteenvetoon. Jos ei, se korjaa workflown ja suorittaa sen uudelleen.

Se tekee enintään **5 suoritusyritystä** viestiä kohden. Paina **Pysäytä** milloin tahansa keskeyttääksesi silmukan ja keskeyttääksesi käynnissä olevan suorituksen.

Jokainen vastaus näyttää vaiheet reaaliajassa:
- `Sovellettaan muutoksia canvas-alueelle`;
- `Suoritetaan workflowa · yritys 2/5`, jossa on `Suoritetaan <solmu>` -rivi jokaiselle solmulle;
- lopullinen päätelmä.

Jokaisen suorituksen jälkeen lyhyt rivi kuten *Yritys 1 tulos lähetetty · virhe 1.2s:ssa* kertoo, että tulos palautettiin avustajalle.
### Muiden workflowien suorittaminen

YOLO-tilassa avustaja voi myös suorittaa muita workfloweja, kun se tarvitsee niiden tuloksia. Esimerkiksi se voi tarkistaa, mitä workflow palauttaa, ennen kuin kutsuu sitä [Suorita](../nodes/execute-node.md)-solmusta. Nämä suoritukset näkyvät vaiheina `Suoritetaan workflow "<nimi>"...` ja tallentuvat suoritushistoriaan trigger-lähteenä `ai_assistant`. Muokattava workflow testataan aina canvasilla.

### Keskeytykset

| Tilanne | Mitä tapahtuu |
|---|---|
| Avustaja tarvitsee päätöksen, tiedon, tunnistetiedon tai datataulukon | Se kysyy tavallisella kyselykortilla. Vastaaminen jatkaa silmukkaa. |
| Suoritus odottaa [ihmisen tarkistusta](./human-in-the-loop.md) | Silmukka keskeytyy. Hyväksy tarkistus ja lähetä viesti. |
| Workflow odottaa tiedoston latausta | Silmukka keskeytyy. YOLO-tila ei voi testata lataustriggeröityjä suorituksia. |
| Workflowista on tallennettu uudempi versio muualla | Silmukka keskeytyy. Ratkaise tallennuskonflikti ja lähetä viesti. |

> **Suoritukset ovat todellisia.** Sähköpostit, viestit ja API-kutsut workflowssa lähetetään oikeasti jokaisella yrityksellä, ja DataTable-solmut kirjoittavat todellisia rivejä. Jokainen suoritus tallentaa workflown, joten aiemmat versiot säilyvät [Muokkaushistoriassa](./edit-history.md).

## Äänisyöte

Tuetuilla selaimilla **Ääni**-painike mahdollistaa puheentunnistuksen. Klikkaa aloittaaksesi nauhoituksen, klikkaa uudestaan lopettaaksesi. Transkriptioitu teksti lähetetään tekoälylle kieliopilliseen tarkistukseen ennen lähetystä.

## Agenttisolmu vs. tekoälyavustaja

| | Agenttisolmu | Tekoälyavustaja |
|---|------------|---------------|
| **Tarkoitus** | LLM-solmu workflown sisällä; suoritetaan runtime-ajassa | Chat-käyttöliittymä workflowjen rakentamiseen luonnollisella kielellä |
| **Sijainti** | Canvas-solmu | Debug-paneeli → kelluva paneeli |
| **Milloin** | Suoritusaikana | Muokkauksen aikana |

Katso [Agenttisolmu](../nodes/agent-node.md) workflow-solmusta, joka suorittaa LLM-kutsuja työkaluilla ja MCP:llä.

## Toimintaperiaate (AI Builder DSL)

Tekoälyavustaja käyttää **workflow-DSL:ää** (domain-specific language), joka kuvaa solmuja, yhteyksiä ja lausekkeita. Kun lähetät viestin:

1. Viestisi, [Käyttäjän säännöt](./user-settings.md) ja nykyinen workflow (jos sellainen on) lähetetään backendille.
2. Backend rakentaa **järjestelmäpromptin**, joka sisältää:
   - Koko workflow-DSL:n (solmutyypit, lausekesyntaksi, säännöt, esimerkit)
   - Käyttäjän säännöt liitettynä "Käyttäjän mukautetut säännöt" -osiona
   - Nykyisen workflown JSON, kun muokkaat olemassa olevaa workflowta
   - Käytettävissä olevien workflowjen lista, jos käytät Suorita-solmua
   - Omistamiesi tai kanssasi jaettujen tunnistetietojen nimet, tyypit ja id:t (ei koskaan arvoja)
   - Käytettävissä olevien datataulukoiden nimet, id:t, kuvaukset ja sarakkeet (ei koskaan rivejä)
3. Malli palauttaa yhden workflow-JSON-lohkon (kentät `nodes` ja `edges`). Frontend jäsentää sen ja soveltaa canvasille.

### Tunnistetiedot

Kun workflow tarvitsee tunnistetiedon, avustaja kysyy ennen rakennusta. Jos sinulla on sopivat tunnistetiedot, se listaa ne **Luo uusi tunnistetieto** -vaihtoehdon kanssa; jos sinulla ei ole, se kysyy, haluatko luoda uuden. Jokaisessa kyselyssä voit myös jatkaa ilman tunnistetietoa.

Uuden luominen avaa tunnistetietolomakkeen paneeliin, esiasetettuna oikeaan tyyppiin ja ehdotettuun nimeen. Arvot menevät suoraan Heymiin; avustaja saa tietää vain nimen ja tyypin. OAuth-tunnistetiedot (Google Sheets, Google Drive, BigQuery, Linear, Notion) yhdistetään ponnahdusikkunassa, ja linkki valtuutussivulle näkyy, jos ponnahdusikkuna estetään. Kun tunnistetieto on tallennettu, kortti näyttää sen nimen ja luontipainike sammuu; paina **Lähetä vastaukset**, ja avustaja asettaa uuden tunnistetiedon solmuun.

Voit myös pyytää tunnistetietoa itsessään ("luo GitHub-tunnistetieto") tai pyytää päivittämään omistamasi tunnistetiedon ("päivitä sheet-tunnistetietoni", "yhdistä Google Sheets uudelleen"). Avustaja vastaa samalla kortilla: luonti avaa tyhjän lomakkeen, päivitys avaa lomakkeen kyseiselle tunnistetiedolle salattujen tietojen kanssa.

Avustaja suosii dedikoitua solmua. Kun mikään solmu ei kata toimintoa, kuten välilehden lisääminen Google Sheetiin, se käyttää HTTP-pyyntöä ja kirjoittaa header-rivin valitulle tunnistetiedolle. Katso [HTTP › Tunnistetietojen käyttö](../nodes/http-node.md#authenticating-with-credentials).

Selvennyskyselyt, joita workflow voi tehdä ilman, merkitään syötteessä **Valinnainen** ja niitä voi ohittaa.

DSL pakottaa camelCase-merkinnät, yhtenäiset lausekesäännöt ja solmukohtaiset kentät. Jos kentän arvo on yksittäinen `$expr`, backend säilyttää alkuperäisen tyypin; jos arvo sekoittaa tekstiä ja `$refs`:iä, tulos on merkkijono. Yhden `$` -sääntö pätee edelleen: ei `$`:ia sulkeiden sisällä. [Asetukset](./user-settings.md) -osion Käyttäjän säännöt lisätään tähän järjestelmäpromptiin, jotta mieltymyksesi pätevät jokaiseen tekoälygeneroituun workflowhun.

Jos nykyinen workflow sisältää Agent-taitoja, tekoälyavustaja sisällyttää vain kunkin taidon `SKILL.md` -tiedoston kyseisen workflown kontekstiin. Liitetyt `.py` -tiedostot ja binaaritaidot poistetaan ennen pyyntöä, jotta rakentaja pysyy mallikontekstirajoissa, vaikka taidot sisältäisivät suuria toteutuksia.
### Datataulukot

Kun workflow tallentaa, säilöö tai hakee tietueita eikä ole nimetty toista varastoa, apuri käyttää [DataTable](../nodes/datatable-node.md) -solmua. Jos nimeät jonkin taulukoistasi ja sillä on workflowin tarvitsemat sarakkeet, apuri käyttää sitä. Muussa tapauksessa se kysyy, mitä taulukkoa käytetään. Kortissa listataan sopivat taulukot, jokainen kuvauksineen ja saraketyypeineen, sekä **Luo uusi taulukko** ehdotetulla nimellä ja sarakkeilla. Myös kanssasi jaetut taulukot tarjotaan; vain luettavissa olevaa taulukkoa tarjotaan vain lukemista varten.

Valitse uusi taulukko ja paina **Lähetä vastaukset**: kortti luo taulukon, ja apuri asettaa sen tunnisteen solmuun ja käyttää sen tarkkoja sarakenimiä. Voit myös pyytää taulukkoa itsessään, esimerkiksi "luo taulukko liideilleni".

Apuri näkee taulukoiden nimet, kuvaukset ja sarakkeet, ei koskaan rivejä. Se ei koskaan muuta olemassa olevan taulukon sarakkeita: jos taulukosta puuttuu workflowin tarvitsema sarake, se nimeää sarakkeen ja tarjoaa uuden taulukon sen sijaan. Lisää sarakkeita [DataTable-välilehdessä](../tabs/datatable-tab.md).

## Aiheeseen liittyvää

- [Miksi Heym](../getting-started/why-heym.md) – Luonnollisen kielen rakentaminen tekoälyagentin elinkaaren ensimmäisenä vaiheena
- [Pika-aloitus](../getting-started/quick-start.md) – Rakenna ensimmäinen workflow
- [Asetukset](./user-settings.md) – Käyttäjän säännöt, jotka lisätään tekoälyavustimen järjestelmäkehotteeseen
- [Keskustele Heymin kanssa](./chat-with-heym.md) – Sietietoinen apuri dokumentaatioalueella
- [Keskeiset käsitteet](../getting-started/core-concepts.md) – Workflowt, solmut ja suorituskulku
- [Agenttisolmu](../nodes/agent-node.md) – LLM-solmu työkaluineen ja MCP:llä
- [Tunnistetiedot-välilehti](../tabs/credentials-tab.md) – Lisää API-avaimia tekoälyavustimelle
- [Workflown rakenne](./workflow-structure.md) – Workflowjen JSON-muoto
