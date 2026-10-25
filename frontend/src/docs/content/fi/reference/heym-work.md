# Heym Work

**Heym Work** on liiketoimintatiimeille suunniteltu toinen käyttöliittymä, joka on rakennettu Heym-alustan päälle. Käyttäjät kuvailevat tehtävän omin sanoin, vastaavat muutamaan kysymykseen ja saavat Heymin luoman ja testaaman työnkulun. Työskentely tapahtuu tiimille luoduilla sivuilla, tarkistukset kuitataan suoraan ja jokainen suoritus näkyy aloittajan nimellä varustettuna. Heym suorittaa jokaisen työn taustalla.

Heym Work toimii omana konttinaan Heym-asennuksen rinnalla erillisellä Heym-tiimin lisenssillä. Lue lisää ja pyydä kokeiluversiota osoitteessa [heym.run/enterprise](https://heym.run/enterprise). Katso kahden minuutin esittely [Heym Work -videosta](https://youtu.be/5Z2gGo6bcpU).

## Mitä liiketoimintatiimit saavat

| Alue | Mitä se tekee |
|------|---------------|
| **Chat** | Kuvaile työ kirjoittamalla tai äänellä. Heym kysyy tarvittavat tiedot, rakentaa workflow-kokonaisuuden, testaa sen ja merkitsee sen Vahvistetuksi. |
| **Flows** | Muokkaajat rakentavat flow'n valinnoista kankaan sijaan: mikä sen käynnistää, valinnainen AI-luonnos sekä toiminnot Slackissa, Google Sheetsissä ja sähköpostissa. Slackin vastaukset jatkavat suoritusta, ja hyväksynnät odottavat myös Toiminnassa. Katso [Flows](#flows). |
| **Sivut** | Kiinnitetyt widget-sivut: luvut, kaaviot, tilamerkinnöillä varustetut taulukot, tiedostojen pudotusalueet ja hyväksynnät. Taulukkorivi voi avata oman yksityiskohtasivunsa. |
| **Hyväksynnät** | [Human-in-the-Loop](./human-in-the-loop.md) -vaiheiden tarkistukset odottavat Toiminta-näkymässä ja sivuilla valinnoilla Hyväksy, Pyydä muutoksia ja Hylkää. |
| **Toiminta** | Jokainen suoritus, mukaan lukien sen käynnistänyt henkilö ja suorituksen tehnyt instanssi. |
| **Roolit** | Omistaja, Muokkaaja ja Katselija. Kirjautuminen tapahtuu Heymin jo käyttämällä [Single Sign-On](./sso.md) -ratkaisulla. |
| **Toimialaversiot** | Juridiikan, koulutuksen, rahoituksen, logistiikan, energian ja verkkokaupan erikoisversiot avautuvat kyseiselle toimialalle valmiiksi räätälöidyillä sivuilla, esimerkkidatalla ja työnkuluilla. |

## Flows

**Flows** löytyy Heym Workin valikosta Muokkaajille ja Omistajille. Flow koostuu valinnoista solmujen sijaan, ja Heym Work tallentaa sen tavallisena Heym-workflowina Heymin API:n kautta sen luoneen henkilön nimissä. Heymin käyttöoikeussäännöt, muokkaushistoria ja triggerien synkronointi pätevät samalla tavalla kuin editorissa, ja jokainen suoritus näkyy Toiminnassa kuten mikä tahansa muu.

| Osa | Valinnat |
|---|---|
| **Mikä sen käynnistää** | Pyynnöstä, aikataulun mukaan, Slack-viestistä, Google Sheets -välilehden muuttuessa (rivejä lisätty, muutettu tai poistettu) tai sähköpostin saapuessa postilaatikkoon. Taulukko- ja sähköpostitriggerit tarkistavat 1, 5, 15 tai 60 minuutin välein. |
| **AI-luonnos** (valinnainen) | Malli ja ohjeet muuntavat flow'n käynnistäneen tapahtuman tekstiksi seuraavia vaiheita varten. Flow, joka ei ala taulukosta tai sähköpostista, voi ensin lukea viimeisimmät Slack-viestit kanavalta tai ketjusta. |
| **Mitä tapahtuu seuraavaksi** | Toiminnot järjestyksessä missä tahansa kolmesta työkalusta riippumatta siitä, mikä käynnisti flow'n. **Slack:** kanavaviesti, suoraviesti, lomake, viesti painikkeilla, hyväksyntä, ketjun vastaus, viestin päivitys ja lopputulos. **Google Sheets:** lisää rivi tai päivitä muuttunut rivi. **Sähköposti:** lähetä sähköposti. |

- **Vastaukset jatkavat suoritusta.** Hyväksyntä, painikkeet tai lomake keskeyttävät suorituksen, kunnes joku vastaa Slackissa. Hyväksyntä odottaa myös Toiminnassa, ja päätös kummassa tahansa paikassa poistaa painikkeet Slack-viestistä. Myöhemmät Slack-vaiheet pysyvät ensimmäisen viestin ketjussa.
- **Yksi Yhteydet-kortti.** Jokainen flow näyttää Slack-työtilan, Google Sheets -tilin ja postilaatikot, joista se lukee ja joilla se lähettää. Ne ovat Heym-tunnistetietoja: **Slack Bot** (bottitunniste, `xoxb-…`), **Google Sheets**, **IMAP** ja **SMTP**; puuttuva tieto voidaan lisätä suoraan itse flow'sta.
- **Yksi Slack-sovellus kullekin flow'lle.** Aseta Slack-sovelluksessa Interaktiivisuuspyynnön URL-osoitteeksi `https://<oma Heymisi>/api/slack/interactions/<tunnisteen id>` ja Tapahtumatilausten pyynnön URL-osoitteeksi `https://<oma Heymisi>/api/slack/events/<tunnisteen id>`. Heym Work näyttää molemmat valitulle yhteydelle. Kaikki kyseisen tunnistetiedon flow't jakavat ne.
- **Slack-triggerit valitsevat, mitä ne kuuntelevat:** viestejä kanavilla ja suoraviesteissä, suoria viestejä botille, botin mainintoja tai viestejä yhdellä kanavalla. Botin omat julkaisut eivät koskaan käynnistä flow'ta.
- **Vaatimukset.** Flows vaatii Heym 0.0.131:n tai uudemman.

Flow'n rakentamat vaiheet ovat samoja solmuja, joita voit käyttää kankaalla: [Slack](../nodes/slack-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Sheets Trigger](../nodes/google-sheets-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md) ja [Cron](../nodes/cron-node.md).

## Heym Workin yhdistäminen

Katso [asennusvideo](https://youtu.be/zXGfg1HPSLk), joka esittelee koko asennuksen ensimmäisestä komennosta etusivulle.

Yhteys määritetään kohdassa **Asetukset → Heym Work**. Välilehti näkyy vain instanssin ylläpitäjille, jotka on lueteltu muuttujassa `HEYM_ADMIN_EMAILS`.

| Kenttä | Mitä se tekee |
|--------|---------------|
| **Heym Work -osoite** | Paikka, jossa Heym Work toimii, esimerkiksi `https://work.example.com`. Kirjautuminen palaa tähän osoitteeseen. Paina **Tallenna**. |
| **Integrointiavain** | **Luo avain** luo avaimen, jota Heym Work käyttää jokaiseen Heymille tehtyyn pyyntöön. Se näytetään vain kerran kopiointipainikkeen kera. Heym tallentaa ainoastaan avaimen tiivisteen. |
| **Ota Heym Work käyttöön** | Kytkee yhteyden päälle. Edellyttää osoitteen ja avaimen määrittämistä etukäteen. |
| **Toimiala- ja tiimiversiot** | Lakiasiain-, koulutus-, rahoitus-, logistiikka-, energia- ja verkkokauppaversiot sekä yritystiimien IT-, myynti-, markkinointi- ja HR-versiot avautuvat kyseiseen työhön liittyvien sivujen, esimerkkidatan ja workfloweiden kera. |

Avaa sen jälkeen Heym Workin osoite ja suorita asennus loppuun:

1. **Lisenssi**: syötä Heym-tiimiltä saatu lisenssiavain.
2. **Heym**: syötä Heymin osoite ja integrointiavain.
3. **Omistaja**: kirjaudu sisään tilillä, joka on määritetty Heym Workin omistajaksi.

Etusivu aukeaa ja on valmis tiimin käyttöön.

### Avaimen kierrättäminen

**Kierrätä avain** korvaa integraatioavaimen. Heym Work lakkaa toimimasta, kunnes uusi avain syötetään sinne, ja kaikki Heym Workiin kirjautuneet käyttäjät kirjataan ulos. Käytä toimintoa, jos avain on saattanut vuotaa tai kun avaimen nähnyt henkilö poistuu tiimistä.

### Yhteyden poistaminen käytöstä

Kytke **Ota Heym Work käyttöön** pois päältä yhteyden katkaisemiseksi. Heym Work pyytää tällöin Heymin avainta uudelleen. Heym jatkaa kaikkien työnkulkujen, aikataulujen ja webhookien suorittamista tavalliseen tapaan.

## Turvallisuusmalli

- **Jokainen muutos kulkee Heymin kautta.** Heym Work lukee esittämänsä tiedot Heymin tietokannasta ja lähettää jokaisen toiminnon Heymille avainsuojatun kanavan kautta, jossa Heym soveltaa omia käyttöoikeussääntöjään. Heym Work säilyttää omat tietonsa erillisessä `heym_work`-skeemassa.
- **Avain tiivistetään levossa.** Heym vertaa esitetyn avaimen tiivistettä eikä koskaan tallenna avainta selkokielisenä.
- **Kirjautuminen pysyy Heymissä.** Käyttäjät kirjautuvat Heymin kautta käyttäen omaa identiteetintarjoajaa, kun [SSO](./sso.md) on käytössä.
- **Muutokset auditoidaan.** Yhteyden tallentaminen ja avaimen kierrättäminen kirjoittavat `work_integration.update`- ja `work_integration.key_rotate`-rivejä [audit-lokiin](./audit.md).

## Lisensiointi

Heym Work vaatii oman Heym-tiimin myöntämän lisenssiavaimen. Heym Work lähettää päivittäin heym.run-palvelimelle lisenssitunnuksensa, asennustunnuksensa, aktiivisten käyttäjien määrän viimeisen 30 päivän ajalta, jäsenten kokonaismäärän, viimeisen 24 tunnin suoritusten määrän sekä Heymin ja Heym Workin versiotiedot. Työnkulkujen sisältö, syötteet, tulosteet ja tunnistetiedot pysyvät aina omilla palvelimillasi.

Jos päivittäinen synkronointi epäonnistuu 30 päivän ajan, alkaa 14 päivän lisäaika, jonka jälkeen Heym Work -käyttöliittymä pyytää Omistajalta avainta. Kokeiluversio on voimassa viimeiseen päiväänsä saakka ja jatkuu, kun Heym-tiimi jatkaa sitä (yksi kokeiluversio asennusta kohden). Itse Heym jatkaa toimintaansa keskeytyksettä koko ajan. Verkoissa, joissa ei ole internetyhteyttä, käytetään offline-lisenssiä, jonka saa osoitteesta enterprise@heym.run.

## Videot

Kaikki Heym Work -videot löytyvät [Heym Work -soittolistalta](https://www.youtube.com/playlist?list=PLBLCDjFQgoPQ).

## Liittyvät aiheet

- [Enterprise](./enterprise.md): Kaupallinen lisensiointi ja tuki
- [Single Sign-On](./sso.md): Heym Workin käyttämä kirjautumisratkaisu
- [Human-in-the-Loop](./human-in-the-loop.md): Heym Workissa näkyvät tarkistukset
- [Audit-lokitus](./audit.md): Yhteyden muutosten kirjaamat lokitapahtumat
- [Asetukset](./user-settings.md): Heym Work -välilehden sijainti
