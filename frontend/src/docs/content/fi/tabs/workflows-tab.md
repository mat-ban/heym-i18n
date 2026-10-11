# Workflows-välilehti

**Workflows**-välilehti on oletusnäkymä hallintapaneelissa. Se näyttää workflow-luettelon, kansiorakenteen ja mahdollistaa workflowien luomisen, muokkaamisen ja organisoinnin.

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Katso Workflows-esittely</a></p>

## Aloita keskustelu

Workflow-luettelon yläpuolella on chat-ruutu, joka tervehtii Teitä nimellä ja kysyy, mitä haluatte automatisoida. Kirjoita prompt, liitä halutessasi yksi tiedosto ja valitse käytettävä tunnistetieto ja malli. Molemmat pudotusvalikot ovat hakukelpoisia ja alkavat käyttäjän [tekoäly-oletuksista](../reference/user-settings.md).

Lähettäminen luo uuden keskustelun ja avaa sen [Chat-välilehdelle](./chat-tab.md), jossa vastaus tulee suoratoistona. Tuetut liitteet ovat tekstitiedostoja, kuvia ja PDF-tiedostoja, yksi per viesti, kuten chatissä.

Jos Teillä ei ole vielä LLM-tunnistetietoja, ruudussa näkyy linkki [Credentials-välilehteen](./credentials-tab.md) ja lähettäminen pysyy pois käytöstä.

Klikkaa **x**-kuvaketta piilottaaksesi ruudun. **Ask AI** -painike ilmestyy Workflows-otsikon viereen ja tuo ruudun takaisin. Valinta tallennetaan selaimen muistiin.

## Workflow-luettelo

Luettelo on kaksiruutunäkymä: workflowt ja kansiot vasemmalla, valitun workflown esikatselu oikealla.

- Jokaisessa rivissä näkyy workflown kuvake, nimi, kuvaus, viimeisin päivitysaika ja [tilamerkintä](#workflow-status)
- Workflowt voivat olla juuressa tai kansioissa, ja kiinnitetyt workflowt näkyvät omana **Pinned** -ryhmänään ylhäällä
- **Klikkaa** riviä valitaksesi sen ja lataaaksesi sen esikatselun oikealle
- **Kaksoisklikkaa** riviä tai paina **Enter** kun se on kohdistettu avataksesi sen [editorissa](../getting-started/quick-start.md)
- Käytä **Ctrl+klikkausta** (tai **Cmd+klikkausta**) avataksesi uuteen välilehteen
- Jokaisella rivillä on oikealla muokkaa-, kopioi-, kiinnitä- ja poista-toiminnot. Puhelimissa ne ovat piilossa, jotta nimi säilyttää täyden leveyden; **pitkä painallus** avaa toimintovalikon
- Kiinnitä usein käytetyt workflowt [Quick Draweriin](../reference/quick-drawer.md) voidaksesi suorittaa ne nopeasti Workflows-välilehdeltä ja muilta sisäisiltä sivuilta

## Workflown esikatselu

Workflown valitseminen täyttää esikatselupaneelin luettelon vieressä. Alle 1280 pikselin levyisillä näytöillä sama paneeli avautuu ruudun alareunasta.

Paneelissa näkyy:

- Workflown nimi, luoja ja luontiaika sekä viimeisin muokkausaika
- **Open Workflow** – avaa workflown editoriin
- **Run Now** – avaa workflown [Quick Draweriin](../reference/quick-drawer.md), jossa täytät syötteet ja käynnistät suorituksen poistumatta luettelosta
- **Description** – workflown kuvaus
- **Trigger Configuration** – aikataulu cron-workflowille tai kuuntelutriggeri tapahtumapohjaiselle workflowlle. HTTP:n kautta kutsutut workflowt näyttävät **Copy cURL** -painikkeen endpointin ja auth-tekstin sijaan: se kopioi valmiin pyynnön oikealla URL-osoitteella, otsikoilla, auth-paikkamerkeillä ja workflown syötekentistä rakennetulla pyynnön rungolla. Kun workflow julkaisee [portaalin](../reference/portal.md), sen julkinen chat-linkki näkyy myös täällä
- **Last Run Details** – viimeisimmän suorituksen tulos ja kesto tai huomautus, että workflowta ei ole koskaan suoritettu
- **Workflow Steps & Sub-agents** – solmut suoritusjärjestyksessä, kukin mallillaan, operaatiolla tai aikataululla sekä pisteellä, joka osoittaa, onko se aktiivinen. Solmun valitseminen avaa sen editoriin ominaisuuspanelissa

Paneeli pysyy kiinnitettynä luettelon vieressä vierittäessä, joten se pysyy luettavana pitkässä workflow-luettelossa.
## Instanssin hallinta

`HEYM_ADMIN_EMAILS`-listassa luetellut käyttäjätilit voivat listata, avata, muokata, tarkastella suoritushistoriaa ja poistaa mitä tahansa instanssin workflowta ilman jakamista tai omistajuuden siirtoa. Asetus on pilkuin erotettu sähköpostiosoitelista, joka täsmätään kirjainkoosta riippumatta. Tyhjä lista ei myönnä kenellekään tätä pääsyä. Käynnistä backend uudelleen muutoksen jälkeen.

Ylläpitäjät näkevät workflown omistajan sähköpostin workflowlistauksessa ja voivat hakea kyseisellä osoitteella. Valitse workflow avataksesi **Instanssin hallinnan** sen esikatselussa:

1. **Keskeytä triggereitä** näytetään vain workflowille, jotka sisältävät Cron-solmun. Se poistaa käytöstä workflown Cronin ja muut automaattiset triggersolmut normaaliversioituneen tallennuksen kautta. Käynnissä olevat suoritukset voivat jatkua. Manuaaliset, API:n, portaalikutsut ja alityönkulut pysyvät käytettävissä; tämä toiminto ei ole workflowlaajuinen suorituslukko.
2. Painike muuttuu muotoon **Jatka triggereitä**, kun workflow on keskeytetty, myös sivun uudelleenlatauksen jälkeen. Jatkaminen ottaa uudelleen käyttöön ylläpitäjän keskeyttämät triggerit ja jättää jo aiemmin pois käytöstä olleet triggerit ennalleen. Vanhemmille keskeytetyille workflowille, joilla ei ole tallennettua ylläpitäjän keskeytystilaa, Jatka-toiminto ottaa niiden automaattiset triggerit käyttöön.
3. Käytä workflow-rivin **Poista workflow** -toimintoa, kun suoritukset ovat valmistuneet. Poistaminen palauttaa ristiriitatilan, jos suorituksia on käynnissä, jonossa tai arvioitavana. Aikataulutettu poisto käyttää samaa tarkistusta.

Keskeytä triggerit ja anna käynnissä olevien suoritusten valmistua ennen poistamista. Jo käynnistetty trigger voi vielä valmistua keskeytyksen jälkeen. Käytä poistoa, kun workflowta ei saa enää kutsua.

Omistajalle varatut webhook-salaukset ja todennusasetukset säilyttävät nykyiset suojauksensa. Hallinnointi ei siirrä omistajuutta tai jaa omistajan tunnistetietoja. Ylläpitäjän keskeytys-, jatka-, poisto- ja aikataulutustoiminnot näkyvät [tarkistuslokissa](../reference/audit.md) toimivan ylläpitäjän ja workflown omistajan kanssa.

## Workflown tila

Jokainen rivi sisältää tilamerkin, joka perustuu workflown triggersolmuihin, sen live-suoritustilaan sekä — workflowille ilman triggersolmua — siihen, miten sen viimeisin suoritus käynnistettiin:

| Tila | Merkitys |
| --- | --- |
| **Käynnissä** | Workflowssa on juuri nyt käynnissä oleva suoritus |
| **Aikataulutettu** | Siinä on aktiivinen [cron](../nodes/cron-node.md)-trigger |
| **Kuuntelee** | Siinä on aktiivinen tapahtumatrigger, kuten Slack-, Telegram-, IMAP- tai WebSocket-trigger |
| **Keskeytetty** | Siinä on triggersolmuja, mutta ne kaikki ovat pois käytöstä |
| **API** | Siinä ei ole triggersolmuja, ja sen viimeisin suoritus tehtiin HTTP-kutsulla sen suoritusendpointiin |
| **Alityö** | Siinä ei ole triggersolmuja, ja sen viimeisin suoritus tehtiin alityönkuluna emoworkflowssa |
| **Portaali** | Siinä ei ole triggersolmuja, ja sen viimeisin suoritus tehtiin sen [portaalista](../reference/portal.md) |
| **WEB** | Siinä ei ole triggersolmuja, ja sen ainoa terminaali on [HTML-outputmapper](../nodes/html-output-mapper-node.md), joten sen kutsuminen palauttaa renderöidyn verkkosivun |
| **Manuaalinen** | Siinä ei ole triggersolmuja, eikä sitä ole koskaan suoritettu, tai sen viimeisin suoritus tuli jostain muualta |
| **Poisto aikataulutettu** | Se on [aikataulutettu poistettavaksi](../reference/workflow-organization.md) |

API-, Alityö- ja Portaalimerkit lukevat workflown [suoritushistorian](./logs-tab.md) viimeisimmän merkinnän, joten workflow, jota kutsutaan kahdella tavalla, näyttää kummankin viimeisimmän. **WEB** määritetään graafin perusteella, joten se saa etusijan näiden kolmen edelle: verkkosivua palveleva workflow näyttää WEB-tilan, vaikka sitä olisi kutsuttu HTTP:n kautta. Triggersolmut voittavat aina kaikki muut: cron-workflow, jota joku kutsuu myös HTTP:n kautta, pysyy **Aikataulutettu**-tilassa.

Käytä **Tila**-pudotusvalikkoa hakukentän vieressä näyttääksesi vain yhden tilan. Pudotusvalikko listaa, kuinka monta workflowta vastaa kuhunkin tilaan tällä hetkellä. Tilasuodatin toimii myös kansioiden sisällä: kansiot, joissa on osumia, avautuvat automaattisesti, ja kansiot ilman osumia piilotetaan, kunnes suodatin tyhjennetään.

## Aktiiviset workflowt

Työpöydällä ylätyökalurivin pyöreä merkki näyttää, kuinka monta workflowta on tällä hetkellä käynnissä, ja päivittyy automaattisesti 10 sekunnin välein. Klikkaa nollasta poikkeavaa merkkiä avataksesi aktiivisten workflowjen listan, joka näyttää enintään neljä riviä ennen kuin vieritys alkaa. Valitse workflown nimi liittääksesi editorin kyseisen suorituksen live-näkymään. Nolla-merkki on tiedollinen eikä sitä voi avata, ja merkki piilotetaan mobiilinäytöillä.

## Haku

Käytä workflowhakukenttää **Tila**-kohdan vieressä tai paina **Ctrl+F** (tai **Cmd+F**) suodattaaksesi workflowt otsikon tai kuvauksen perusteella. Osumat sisältävät workflowt näytetään kansiorakenteineen avattuna. Paina **Escape** tyhjentääksesi haun.
## Kansiot

- Järjestä workflowt [kansioihin ja alikansioihin](../reference/workflow-organization.md)
- Luo kansioita **Uusi kansio** -painikkeella antamalla kullekin nimi ja valinnainen kuvaus, joka näkyy listassa kansion nimen alla
- Jokaisessa kansion rivissä näkyy sen sisältämien workflowjen määrä (mukaan lukien alikansiot) sekä toiminnot uuden alikansion luomiseen, nimen muuttamiseen, kuvakkeen vaihtamiseen, ZIP-paketiksi lataamiseen ja poistamiseen. Puhelimilla rivi näyttää yhden valikkopainikkeen
- Vedä workflow kansion tai alikansion päälle nähdäksesi kohdekansion esikatselun kortin kokoisena. Korostettu esikatselu näyttää täyden kansion polun ennen pudotusta, ja kollapsatun kansion päällä leijuminen laajentaa sen hetkeksi, jotta pääset käsiksi sisäkkäisiin kansioihin
- Vedä workflowt kansioiden välillä tai juurikansioon. Vedettävä kortti pysyy näkyvänä haamuna, ja aktiivinen kohde pysyy korostettuna vierityksen aikana
- Workflown pudottaminen takaisin nykyiseen kansioonsa on estetty ja merkitty tekstillä **Jo kansiossa**
- Nimeä kansio uudelleen tai muuta sen kuvausta joko nimenmuutostoiminnolla tai hiiren oikean painikkeen kontekstivalikosta

## Workflowjen luominen

1. Klikkaa **Uusi workflow**
2. Anna nimi ja valinnainen kuvaus
3. Workflow avautuu editoriin

## Tuonti

Vedä ja pudota JSON-muotoinen workflow-tiedosto workflow-alueelle luodaksesi uuden workflown. Tuodut solmut ja yhteydet käytetään workflown luomiseen; nimi tulee JSON-tiedoston `name`-kentästä tai tiedostonimestä. Katso [Lataus & Tuonti](../reference/download-import.md) JSON-muodosta ja tuontivaihtoehdoista.

## Jakaminen

Avaa workflow editorissa ja klikkaa **Jaa** kutsuakseen käyttäjiä sähköpostitse tai jakaa workflown [tiimin](./teams-tab.md) kanssa. Valitse **Luku** (katselu ja suoritus) tai **Kirjoitus** (myös muokkaus) kullekin käyttäjälle tai tiimille, ja muuta sitä myöhemmin kunkin merkinnän vieressä olevasta pudotusvalikosta. Tunnistetiedot ja alityönkulut eivät jaeta automaattisesti; jaa ne erikseen samoille käyttäjille tai tiimeille. Katso [Workflowjen organisointi](../reference/workflow-organization.md#sharing-workflows) ja [Tunnistetietojen jakaminen](../reference/credentials-sharing.md).

## Muokkaus ja poistaminen

- **Muokkaa** – Muuta workflown nimeä ja kuvausta rivin muokkaustoiminnolla
- **Poista** – Workflowt [ajastetaan poistettaviksi](../reference/workflow-organization.md); ne siirretään roskakoriin ennen pysyvää poistoa

## Samanaikaiset muokkaukset

Tallennus lähettää version, johon muokkauksesi perustuvat, ja palvelin hylkää kirjoituksen, jos workflow on muuttunut välillä – esimerkiksi koska tiimitoveri tallensi sen tai jätit saman workflown auki toisessa välilehdessä. Heym näyttää tällöin **Vanhentunut workflow havaittu** -valintaikkunan kahdella vaihtoehdolla:

- **Peruuta** – Pitää tallentamattomat muutoksesi editorissa, jotta voit ladata ne uudelleen toisessa välilehdessä ja sovitella ne
- **Ohita** – Tallentaa joka tapauksessa korvaen toisen henkilön version

Workflown **suorittaminen** tallentaa sen ensin, joten se käy läpi saman tarkistuksen. Jos workflow on muuttunut alla, suoritus pysähtyy valintaikkunaan eikä korvaa hiljaa: **Ohita ja suorita** tallentaa version ja aloittaa suorituksen, **Peruuta suoritus** hylkää molemmat ja jättää muokkauksesi koskemattomiksi.

Tarkistus on osa tallennuspyyntöä itsessään, joten se ei vaadi ylimääräistä pyyntöä eikä jätä tilaa, jossa tallennus voisi lipsahtaa ohi. Omista muutoksista muualla sovelluksessa – nimenmuutoksista, asetuksista, ominaisuusvalikon valinnoista – ei koskaan aiheudu ristiriitaa.

## Komentovalikko

Paina **Ctrl+K** (tai **Cmd+K**) avataksesi komentovalikon. Voit:
- Hakea workflowja nimellä
- Hypätä mille tahansa [hallintanäkymän välilehdelle](./credentials-tab.md)
- Avaa äskettäisiä workflowja

## Liittyvät aiheet

- [Pika-aloitus](../getting-started/quick-start.md) – Rakenna ensimmäinen workflowsi
- [Workflowjen organisointi](../reference/workflow-organization.md) – Kansiot, alikansiot ja ajastettu poisto
- [Workflown rakenne](../reference/workflow-structure.md) – Workflowjen JSON-muoto
- [Lataus & Tuonti](../reference/download-import.md) – Vie ja tuo workflowja JSON-muodossa
- [Portaali](../reference/portal.md) – Näytä workflowt julkisina chat-käyttöliittyminä
- [Taulu](./board-tab.md) – Suorita workflowja kanban-korttien avulla sarakeketjujen kautta
- [Keskeiset käsitteet](../getting-started/core-concepts.md) – Workflowt, solmut ja suoritus
- [Suoritushistoria](../reference/execution-history.md) – Tarkastele aiemmin suoritettuja workflowja ja tuo ne canvasille
- [Pikalaatikko](../reference/quick-drawer.md) – Kiinnitä ja suorita workflowja hallintanäkymästä, dokumenteista ja muilta editorin ulkopuolisilta sivuilta
- [Kontekstuaalinen esittely](../reference/contextual-showcase.md) – Lyhyt sivun opas hallintanäkymän pintoja varten
