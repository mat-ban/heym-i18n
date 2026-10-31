# Dashboard

**Dashboard**-välilehti on Grafana-tyylinen tila, jossa voit rakentaa ruudukon kaavio- ja mittarivimpaleista. Jokainen impala renderöidään oman piilotetun Heym-workflowin tulostuksesta, joten mikä tahansa workflowssa tuotettava data – tietokantakyselyt, API-kutsut, RAG-haut, LLM-tulosteet – voidaan muuttaa kaavioksi. Voit pitää useita dashboardeja ja jakaa kunkin niistä henkilöiden tai tiimien kanssa.

## Dashboardit

Jokaisella käyttäjällä on aluksi yksi dashboard, joka luodaan ensimmäistä kertaa välilehteä avattaessa. Dashboard-valitsinta välilehden yläosassa käytetään vaihtamaan eri dashboardien välillä, ja sen vieressä olevaa **+**-painiketta uuden dashboardin luomiseen. Valitsin listaa ensin omat dashboardisi ja sitten kanssasi jaetut dashboardit, jotka on merkitty jakaneen henkilön nimellä.

Välilehti avautuu viimeksi käyttämäsi dashboardiin, ja selaimen osoiteriville tallentuu avoin dashboard (`?tab=dashboard&dashboard=<id>`), joten linkki avaa tämän tarkalleen määritellyn dashboardin kaikille, joilla on siihen pääsy.

Asetuspainike (vain omistajille) mahdollistaa dashboardin nimeämisen uudelleen, sen [tietosivuna](#detail-pages) hyväksymien tietueiden määrittämisen, jakamisen hallinnan ja sen poistamisen. Dashboardin poistaminen poistaa myös sen impalat ja niiden workflowt. Sinulla on aina vähintään yksi oma dashboard, joten viimeistä ei voi poistaa.

## Impalat

Impala on yksittäinen kaavio ruudukossa. Tuetut kaaviotyypit:

- **Pylväs** (pysty- tai vaakasuora)
- **Viiva**
- **Alue** (täytetty trendi, tukee useita sarjoja)
- **Ympyrä**
- **Taulukko** (vieritettävä; napsauta sarakeotsikkoa lajitellaksesi nousevasti ja napsauta uudelleen lajitellaksesi laskevasti. Sarake voidaan esittää [tilaruutuina](../nodes/chart-output-node.md#status-chips), sarake voi sisältää [linkkipainikkeita](../nodes/chart-output-node.md#link-buttons), jotka avaavat URL-osoitteen uudessa välilehdessä, ja rivit voivat avata [tietosivun](#tietosivut))
- **Numeerinen** (yksi KPI-arvo valinnaisella yksiköllä)
- **Mittari** (yksi arvo min–max-välillä, esim. prosentti)
- **Hajontakuva** (X/Y-pisteet korrelaatioiden visualisointiin)
- **Osuus** (yksi pylväs jaettuna osuuksiin prosenttilegendin kanssa, esim. kielijakauma)
- **Gantt** (tehtävien päivämäärät, valmistuminen ja riippuvuudet)
- **Entity relationships (DB)** (taulukot, kentät, PK/FK-avaimet ja yhteydet)
- **Pylväsmittari** (vaakasuora mittari per rivi punaisesta vihreään gradientilla ja arvolla, esim. levytilaa)
- **Teksti** (Markdown-viesti, esim. tilatieto kuten "Viimeisin suoritus klo 19:47"; tukee [interaktiivisia valintalistoja](../nodes/chart-output-node.md#interactive-task-lists) staattisessa Markdownissa ja [numeroituja listoja](../nodes/chart-output-node.md#numbered-lists) mukautettua tai laskevaa numerointia varten)
- **HITL** (odottavat ihmisten tekemät tarkistukset. Otsikko näyttää `1/n odottaa`. Workflown nimi avaa kyseisen suorituksen canvasilla. **Hyväksy**, **Pyydä muutoksia** ja **Hylkää** ratkaisevat tarkistuksen. Historia-kuvake impalan otsikon vieressä avaa kyseisen suorituksen historianäkymään tällä sivulla. Impala ei käytä yläpuolisia rivejä, ja jokainen näkee oman jononsa. Se voi sen sijaan näyttää yhden Workflowin tarkistukset kaikille, joilla on oikeus avata kyseinen Workflow; katso [HITL-widgetit](#hitl-widgetit))

Kaavioiden lisäksi **Run a workflow** -impala suorittaa yhden workflowstasi suoraan dashboardilta: pudotetulla tiedostolla, syötekentillään tai Run-painikkeella; katso [Suoritusimpalat](#run-widgets).

Jokainen impala lataa datansa asynkronisesti välilehteä avattaessa, joten sivu pysyy käyttökelpoisena kaavioiden täydentyessä.

## Impalan lisääminen

1. Klikkaa **Lisää impala**, anna sille otsikko ja valitse kaaviotyyppi. Valitsimen alla dialogi piirtää esimerkin valitusta kaaviosta näytedatalla ja nimeää odotetut rivit, jotta voit vertailla tyyppejä ennen rakentamista.
2. Impala avautuu workflow-editoriin aloituskaavion kanssa: [Set](../nodes/set-node.md)-solmu, joka tuottaa rivit, yhdistettynä [Chart Output](../nodes/chart-output-node.md)-solmuun. Korvaa Set-solmu millä tahansa datalähteellä. **HITL**-impala on vain Chart Output -solmu; se lukee odottavat tarkistukset eikä tarvitse datalähdettä.
3. Rakenna workflow niin, että Chart Output -solmua syöttävä solmu tuottaa rivitaulukon, ja määritä Chart Output -solmun kenttäyhteydet (otsikkokenttä, arvokenttä jne.).
4. Tallenna, palaa Dashboard-välilehdelle, ja impala renderöityy.

Valitse **Run a workflow** -impalalle sen sijaan suoritettava workflow; valitsin kertoo, miten impala suorittaa kunkin. Impala lisätään suoraan ruudukkoon, eikä uutta workflowta tarvitse rakentaa.

Kaksoisklikkaa impalaa (tai käytä sen muokkauspainiketta) avataksesi sen workflown milloin tahansa. Käytä **Kloonaa impala** -toimintoa impalan otsikkopalkissa kopioidaksesi sekä impalan että sen koko workflown. Kopio sijoitetaan alkuperäisen alle ja merkitään **(Kopio)**-tekstillä, jotta sitä voidaan muokata itsenäisesti.

## HITL-widgetit

Uusi HITL-widget näyttää jokaisen omassa jonossa odottavan tarkistuksen. Jos halutaan näyttää vain tietyn Workflowin tarkistukset, avataan widgetin **Asetukset**:

1. Valitse Workflow kohdasta **Workflow**. Luettelossa ovat ne Workflowt, jotka voidaan avata – omat tai käyttäjän taikka tiimin kanssa jaetut –, joissa on henkilöä odottava vaihe: ihmistarkistuksen sisältävä Agent tai Slack-hyväksyntä-, painike- tai lomakevaihe. Sen vieressä oleva kuvake avaa kyseisen Workflowin uudessa välilehdessä.
2. Jos Workflowissa on vain yksi tällainen vaihe, se valitaan automaattisesti. Jos niitä on useita, **Select agent** luetteloi ne solmun nimen mukaan siten, että **All agents** on ensimmäisenä; Slack-vaiheet on merkitty tunnisteella **(Slack)**.
3. Tallenna. Otsikon `1/n pending` laskee vain nämä tarkistukset. Valitse **Kaikki Workflow't** näyttääksesi jälleen oman jonosi.

Sama valinta löytyy kankaalta Chart Output -solmun ominaisuuksista. **Hienosäädä AI:n avulla** voi tehdä sen (”näytä vain laskujen hyväksynnät”), samoin uuden widgetin kuvaus, joka nimeää kyseisen Workflowin. Jokainen muutos on Workflow-muokkaus, joten se näkyy Edit Historyssa.

- **Kuka näkee tarkistukset.** Workflowin mukaan suodatettu widget näyttää kyseisen Workflowin tarkistukset kaikille, jotka voivat avata kyseisen Workflowin, ja he voivat hyväksyä, pyytää muutoksia tai hylätä widgetistä käsin aivan kuten he voisivat suorittaa kyseisen Workflowin. Suodattamaton widget näyttää jokaiselle oman jononsa.
- **Kuka näkee widgetin.** Henkilö, joka ei voi avata valittua Workflowia, ei näe widgetiä lainkaan edes jaetussa koontinäytössä. Kun koontinäytön omistaja menettää käyttöoikeuden tai Workflow poistetaan, omistaja näkee ilmoituksen ”You no longer have access to the workflow this widget shows” ja voi valita toisen **Asetuksista**.
- **Vain käytettävissä olevat valinnat.** Workflow, jota ei voida avata, hylätään widgetiä tallennettaessa riippumatta siitä, tehdäänkö tallennus asetuksista, kankaalta vai AI:n kautta.

## Tietosivut

Taulukkoimpala voi linkittää rivinsä toiseen dashboardiin, joka toimii silloin tietosivuna: yksi dashboard, joka palvelee jokaista asiakasta, laskua tai tikettiä.

1. Avaa taulukkoimpalan **Settings** ja valitse dashboard kohdasta **Row link**.
2. Syötä **Record column**, eli sarake, jonka arvo yksilöi rivin (esimerkiksi `id`), ja valinnaisesti **Label column**, joka nimeää sen (esimerkiksi `name`).
3. Tallenna. Rivin napsauttaminen (tai sen kohdistaminen ja Enterin painaminen) avaa linkitetyn dashboardin parametreilla `?record=<value>&label=<name>`.

Tietodashboardilla jokainen impalan workflow lukee arvon muodossa `$page.record` (katso [Chart Output](../nodes/chart-output-node.md#detail-pages-pagerecord)), ja sivu näyttää ruudukon yläpuolella `Dashboard / <label>` sekä painikkeen tietueen tyhjentämiseksi. Takaisin-painike palauttaa taulukkoon, josta tulit.

- **Kuka voi avata sen.** Rivit ovat napsautettavissa vain katsojille, jotka voivat avata linkitetyn dashboardin. Muut näkevät saman taulukon ilman linkkejä.
- **Tietuemuoto.** Tietue tulee URL-osoitteesta, joten tietodashboard päättää, mitä se hyväksyy. Sen asetuksissa **Detail page records** on yksi seuraavista: tunnisteet (kirjaimet, numerot, `-`, `_` ja `.`, enintään 128 merkkiä; oletus), numerot, UUID-tunnisteet tai sähköpostiosoitteet. Mikä tahansa muu arvo hylätään ennen impalan suorittamista, ja impalat näyttävät ilmoituksen "This page does not accept that record".
- **Suoritetaan edelleen omistajana.** Impalat suoritetaan dashboardin omistajana myös tietosivulla. Rakentajien tulisi välittää `$page.record` vain sinne, missä solmu suojaa (escape) sen, ei koskaan suoraan kyselytekstiin.
- **Välimuisti.** Jokainen impala tallentaa kaavionsa välimuistiin tietuekohtaisesti samaksi elinajaksi (TTL) kuin itse impala, ja säilyttää 50 viimeksi käytettyä tietuetta.

## Suoritusimpalat

**Run a workflow** -impala suorittaa yhden workflowstasi ja näyttää tuloksen: tilan, suoritusajan ja tulosteet. Näytettävä sisältö riippuu siitä, mitä workflow ottaa vastaan:

- **Tiedosto.** Jos workflow alkaa [File Upload Trigger](../nodes/file-upload-trigger-node.md) -solmulla, pudota tiedosto sen päälle (tai valitse napsauttamalla), jolloin impala lataa sen triggerin kertakäyttöisen latauslinkin kautta. Impala näyttää triggerin hyväksymät tiedostotyypit ja enimmäiskoon ja hylkää muut ennen latausta. Kun workflow alkaa myös Text Input -solmulla, impala näyttää sen kentät pudotusalueen vieressä: valitse tiedosto, täytä kentät, ja **Run** lähettää molemmat. Arvot kulkevat impalan luoman latauslinkin mukana, joten jaettu latauslinkki ei voi asettaa niitä.
- **Syötekentät.** Jos workflow alkaa Text Input -solmulla, impala näyttää sen kentät oletusarvoineen; **Run** suorittaa workflown antamillasi arvoilla. Arvot kentille, joita workflowssa ei ole, jätetään huomiotta.
- **Ei mitään.** Syötteetön workflow saa **Run**-painikkeen.

Tuloksen **Wrap**-painike rivittää pitkät tulosterivit laatikon sisällä; ota se pois käytöstä lukeaksesi tulosteen JSON-asettelun.

- Kuka tahansa, joka voi avata dashboardin, voi suorittaa impalan, aivan kuten kuka tahansa voi päivittää kaavion. Pääsy workflowhun määräytyy dashboardin omistajan mukaan: impalan lisääminen edellyttää workflowta, jonka sekä sinä että omistaja voitte suorittaa, ja itse suoritus käyttää workflown omistajan tunnistetietoja minkä tahansa latauslinkin tavoin.
- Tulos pysyy näytölläsi, kunnes poistut sivulta; muut katsojat eivät näe tiedostojasi, arvojasi tai tuloksiasi. Suoritus näkyy suoritushistoriassa triggerillä `dashboard`.
- Dashboardin jako ei koskaan myönnä pääsyä itse workflowhun. **Edit workflow** avaa sen henkilöille, joilla on jo pääsy, eikä **Fine-tune with AI** -toimintoa tarjota.
- Tiedostosuoritukset ajetaan pääinstanssissa, jonne ladatut tiedostot tallennetaan, kuten jokainen File Upload Trigger -suoritus.

## Impalan luominen tekoälyllä

Klikkaa **AI**, kuvaile haluttu mittari (esim. "workflowien onnistumisprosentti viimeisen 30 päivän aikana pylväskaaviona") ja valitse LLM-tunnistetiedot ja malli. Heym luo täydellisen impala-workflown, joka päättyy Chart Output -solmuun, ja lisää sen ruudukkoon. Katso [Chart Output](../nodes/chart-output-node.md#example-ai-prompts) esimerkkikäskyistä kaaviotyypeittäin.

Widget saa lyhyen yhden tai kahden sanan otsikon pyynnön kielellä, kuten ”Avoimet tapaukset”. Otsikko ei koskaan sisällä datataulukon tunnistetta; jos malli nimeää widgetin kokonaisella lauseella, Heym säilyttää sen ensimmäiset sanat.

Widget-ohjelmointirajapinta voi luoda myös **laskurikortin** ilman AI:ta: `text`-widget datataulukossa (`data_table_id`), jossa on `count_column` ja `count_value`, näyttää, kuinka monella rivillä on kyseinen arvo; widgetin otsikko ilmoittaa arvon. Heym Work avaa datataulukosta luodut sivut yhdellä laskurikortilla tilaa kohden.

Käytä impalan **Hienosäädä tekoälyllä** -painiketta muokataksesi olemassa olevaa impalaa uudella ohjeella. Jokainen tekoälyhienosääntö tallentaa edellisen workflown version impalan **Muokkaushistoriaan**, josta voit tarkastella tai palata muutoksiin workflow-editorissa.

## Chatista ja MCP:stä

[Chat](./chat-tab.md) ja MCP-asiakkaat [`heym_chat`-työkalun](./mcp-tab.md) kautta voivat lukea dashboardejasi, lisätä niihin widgettejä, nimetä tai poistaa widgettejä ja siistiä dashboardin asettelua. Heym Work näyttää jokaisen dashboardin sivuna, joten samat vastaukset kattavat sen sivut.

- **Mitä dashboardeja on olemassa ja mitä niissä on.** Kysy "mitä dashboardeja minulla on?", "mitä Myynti-dashboardilla on?" tai "millä dashboardilla liikevaihto-workflow on?". Chat listaa omat ja kanssasi jaetut dashboardit käyttöoikeuksineen ja linkkeineen kuhunkin, sekä jokaisen niissä olevan widgetin: otsikon, kaaviotyypin ja sen taustalla olevan workflow'n. [HITL-widget](#hitl-widgets), joka on suodatettu sellaiseen workflow'hun, jota et voi avata, pysyy piilossa aivan kuten itse dashboardilla.
- **Uusi widget.** Pyydä "lisää avoimien tapausten kaavio tilan mukaan Myynti-dashboardille". Chat asettaa ensin tyhjän widgetin dashboardille, kirjoittaa sitten widgetin oman workflow'n, suorittaa testiajoja ja korjaa virheitä, kunnes ajo onnistuu, samalla tavalla kuin se [luo workflow'ita](./chat-tab.md#workflow-iden-luominen). Erillistä workflow'ta ei jätetä taustalle, ja jokainen tallennus näkyy widgetin Edit Historyssa. Widgetin otsikko ja kaaviotyyppi noudattavat sitä, mitä Chat tallentaa.
- **Olemassa oleva workflow.** Pyydä "aseta liikevaihto-workflow Myynti-dashboardille". Workflow, joka päättyy Chart Output -solmuun, muuttuu kaaviowidgetiksi, jolla on oma kopio workflow'sta, joten widgetin myöhemmät muutokset eivät koskaan kosketa alkuperäistä. Workflow, jossa on trigger- tai input-solmu, ei voi muuttua kaaviowidgetiksi. Kaikista muista workflow'ista tulee [suorituswidgettejä](#run-widgets), jotka vaativat myös workflow'n, jonka dashboardin omistaja voi suorittaa.
- **Widgetin nimeäminen tai poistaminen.** Pyydä "nimeä Liikevaihto-widget uudelleen nimelle Myynti" tai "poista widget Avoimet tapaukset". Kaaviowidgetin workflow ottaa myös uuden nimen; suorituswidgetin workflow säilyttää omansa. Kaaviowidgetin poistaminen poistaa sen workflow'n samalla tavalla kuin widgetin poistopainike tekee; suorituswidgetin workflow säilyy. Chat poistaa vain widgetin, jota nimenomaisesti pyysit, ja kysyy ensin tarkennusta, jos sanasi vastaavat useita widgettejä.
- **Siistiminen.** Pyydä "siisti Myynti-dashboard" tai "lisää nämä kolme widgettiä ja siisti". Chat järjestää näkemäsi widgetit järjestykseensä samalla tavalla kuin **Siisti**-painike tekee: satunnaisia kahden tai kolmen rivejä, joten uusi pyyntö antaa toisen asettelun. Pyydä tietty määrä riviä kohden ("kolme riviä kohden") saadaksesi kyseisen kokoisia rivejä. Tämä järjestää dashboardin Heymissä; Heym Work säilyttää oman sivun asettelunsa, jota sivun oma **Siisti**-painike muuttaa.

Uudet widgetit sijoitetaan dashboardin olemassa olevien widgettien alapuolelle ja ne suoritetaan, kuten mikä tahansa widget, dashboardin omistajan oikeuksilla. Lisääminen, nimeäminen, poistaminen ja siistiminen vaativat kirjoitusoikeuden dashboardiin. Uuden widgetin luominen edellyttää chattia, joka pystyy rakentamaan workflow'ita: Chat-välilehteä, Heym Work Chatia muokkaajille ja `heym_chat`-työkalua.

## Asettelun muokkaaminen

Vaihda **Muokkaa**-tilaan siirtyäksesi muokkaustilaan, jossa voit raahata impaloita ja muuttaa niiden kokoa 12-sarakkeisessa ruudukossa. Asettelumuutokset tallennetaan automaattisesti. Impalien otsikoita voidaan muokata suoraan otsikkopalkista.

## Välimuistointi ja päivitys

Jokainen impala välimuistaa viimeksi lasketun datansa palvelimella määritettävän ajan (TTL). Kun välimuisti on tuore, dashboardin uudelleen avaaminen palauttaa tallennetun tuloksen workflown uudelleen suorittamisen sijaan. Välimuisti päivittyy paikalleen aina datan uudelleenlaskennan yhteydessä (yksi välimuisti per impala, sekä yksi tietuetta kohden [tietosivulla](#detail-pages)), ja se mitätöidään automaattisesti impalan workflowta muokatessa.

Käytä impalan **Päivitä**-painiketta (tai työkalupalkin **Päivitä**) ohittaaksesi välimuistin ja laskentaaksesi datan heti uudelleen.
## Jakaminen

Omistajat voivat jakaa kojelaudan sen asetuksista yksittäisille käyttäjille (sähköpostiosoitteella) tai mille tahansa [tiimille](teams-tab.md), johon he kuuluvat. Jokainen jako on **Luku**- tai **Kirjoitus**-oikeudella; kun jollakin on sekä henkilökohtainen että tiimijako, voimakkaampi oikeus pätee.

| Toiminto | Omistaja | Kirjoitus | Luku |
|--------|:-----:|:-----:|:----:|
| Widgettien katselu, niiden päivittäminen, automaattipäivityksen käyttö | ✓ | ✓ | ✓ |
| Tietosivujen avaaminen, suoritusimpaloiden ajaminen | ✓ | ✓ | ✓ |
| Widgettien lisääminen, kloonaaminen, poistaminen, nimeäminen ja koon muuttaminen; tekoälyllä generointi ja hienosäätö; checklist-kohtien merkitseminen | ✓ | ✓ | |
| Widgetin workflowin avaaminen editorissa | ✓ | ✓ | |
| Kojelaudan nimeäminen tai poistaminen, tietuemuodon asettaminen, jakamisen hallinta | ✓ | | |

**Widgetit suoritetaan aina kojelaudan omistajan oikeuksilla.** Riippumatta siitä, kuka katsoo, widgetti käyttää omistajan tunnistetietoja ja globaaleja muuttujia, ja sen suoritukset näkyvät omistajan suoritushistoriassa ja jäljityksissä. Tiimikaverit näkevät siis samat tiedot pääsemättä käsiksi niiden taustalla oleviin tileihin, ja jokainen katsoja jakaa saman välimuistissa olevan tuloksen widgettiä kohden. Widgetit, jotka kirjoitusoikeudella varustettu yhteistyökumppani lisää tai kloonaa, kuuluvat myös omistajalle.

Tästä syystä **Kirjoitus**-oikeus edellyttää samanlaista luottamusta kuin workflown jakaminen muokkaukseen: kirjoitusoikeudella varustettu yhteistyökumppani voi muuttaa sitä, mikä suoritetaan omilla tunnistetiedoillasi. Anna tämä oikeus vain niille henkilöille, joiden annat muokata workflowjasi. Testisuoritus, jonka yhteistyökumppani käynnistää workflow-editorista, käyttää hänen omia tunnistetietojaan kuten missä tahansa jaetussa workflowssa; vain itse kojelauda suoritetaan omistajan oikeuksilla. **Luku**-oikeus ei myönnä pääsyä widgettien workflowihin, ja vain luku-oikeudella varustetut käyttäjät saavat kaavion itsensä, mutta eivät yksittäisten solmujen suoritustietoja sen takana.

Jaon poistaminen tai kirjoitusoikeuden muuttaminen luku-oikeudeksi tulee voimaan välittömästi.

## Aiheeseen liittyvää

- [Kaaviotulosolmu](../nodes/chart-output-node.md)
- [Analytiikkavälilehti](analytics-tab.md) — sisäänrakennetut suoritusmittarit (erillään käyttäjien rakentamista kojelaudoista)

## Aikataulut ja tietokantakaaviot

Valitse Lisää widget -kohdasta **Gantt** näyttääksesi tehtävät ajassa valmistumisen ja riippuvuuslinkkien kera, tai **Entity relationships (DB)** kartoittaaksesi taulukot, kentät ja niiden suhteet. Molemmat tyypit käyttävät [Chart Output -solmua](../nodes/chart-output-node.md#gantt-schedules) ja ovat saatavilla myös Heym Work -sivuilla. Kun Work ehdottaa widgettejä aikataululle tai tietokantakaaviolle, se piirtää esikatselut ehdotetuista tehtävistä tai entiteeteistä.
