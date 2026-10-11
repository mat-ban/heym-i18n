# Hälytysten välilehti

**Hälytykset**-välilehdellä voit määrittää kynnysarvoja tietyn aikavälin yli ja saada ilmoituksen, kun ne ylitetään. Heym tallentaa automaattisesti suoritustulokset, suoritusajan ja LLM-kustannukset, mutta ei koskaan ilmoita niistä aktiivisesti. Hälytys on keino pyytää näitä tietoja.

Jokainen hälytys arvioidaan valitsemasi **aikavälin** yli, ei koskaan yksittäisen tapahtuman perusteella. Yksi epäonnistunut suoritus on kohinaa. Kaksitoista epäonnistunutta suoritusta kymmenessä minuutissa on häiriötilanne.

## Hälytystyypit

| Tyyppi | Vastaa kysymykseen | Lähde |
|---|---|---|
| **Virhekynnys** | Epäonnistuiko tämä yli N kertaa valitulla aikavälillä? | [Suoritushistoria](../reference/execution-history.md) -rivit, joilla on virhetila |
| **Workflown kesto** | Hidastuivatko suoritukset odotettua enemmän valitulla aikavälillä? | Suoritusaika, koostettuna maksimi-, keskiarvo- tai 95. persentiilinä |
| **Token- / USD-kustannus** | Ylittikö kustannus budjetin valitulla aikavälillä? | [LLM-jäljitykset](./traces-tab.md) sekä LLM-kustannustaulu |
| **Suoritusmäärä** | Suoritettiinko tätä huomattavasti useammin kuin pitäisi? | Suoritushistorian rivimäärä |

### Virhekynnys

Laskee epäonnistuneet suoritukset valitulla aikavälillä ja aktivoituu, kun määrä saavuttaa kynnysarvosi. Koska se laskee aikavälin yli eikä reagoi jokaiseen virheeseen, yksittäinen ohimenevä virhe ei aiheuta hälytystä.

### Workflown kesto

Mittaa suoritusaikaa valitulla aikavälillä. Valitse **maksimi** (hitain suoritus), **keskiarvo** tai **p95**. P95 käyttää samaa persentiililaskentaa kuin [Analytiikka-välilehti](./analytics-tab.md), joten hälytys ja viivekaavio eivät koskaan näytä ristiriitaisia tuloksia samasta aikavälistä.

**Vähimmäissuoritukset aikavälillä** pitää mittauksen rehellisenä. Hitain suoritus lähes tyhjällä aikavälillä on vain yksi suoritus, joten esimerkiksi vähimmäisarvon 3 asettaminen estää hälytyksen aktivoitumisen kohinan vuoksi.

### Token- / USD-kustannus

Laskee yhteen LLM-kustannukset valitulla aikavälillä, joko kokonaistokenina tai Yhdysvaltain dollareina. Dollariarvot perustuvat samaan hintatauluun, jota käyttävät [Jäljitykset-välilehti](./traces-tab.md) ja [LLM-kustannustaulu](./datatable-tab.md#llm-cost-table-system-table), joten kustannushälytys ja kustannussivu ovat aina yhtä mieltä.

Kun laajuus on kaikki workflowt, tähän sisältyy myös workflown ulkopuoliset LLM-kutsut, kuten [Keskustelu-välilehti](./chat-tab.md) ja [Tekoälyavustaja](../reference/ai-assistant.md). Koodausagenttien käyttö (Codex, OpenCode) ei sisälly.

Hinnoittelemattomien mallien käyttö ilmoitetaan hälytyksen yhteydessä hinnoittelemattomina eikä niitä lasketa hiljaa nollaksi.

### Suoritusmäärä

Laskee kaiken tilaiset suoritukset valitulla aikavälillä. Tämä havaitsee virheellisen triggerin: workflow, joka normaalisti suoritetaan 20 kertaa tunnissa, alkaa yhtäkkiä suorittaa 2 000 kertaa. Hälytystietue sisältää erittelyn triggerlähteen mukaan, koska se on yleensä vastaus kysymykseen "miksi tämä tapahtui".

## Laajuus

Hälytys seuraa joko **yhtä workflowta** tai **kaikkia workflowjasi**.

"Kaikki workflowt" tarkoittaa jokaista workflowta, jonka hälytyksen omistaja voi avata. Tarkoituksella se ei tarkoita jokaista workflowta Heym-instanssissa: hälytyksiä voidaan jakaa, ja hälytyksen jakaminen ei saa antaa toiselle käyttäjälle yhteenvetoja workflowista, joita hän ei voi avata.

## Ohjattu toiminto

Hälytyksen luominen etenee viidessä vaiheessa.

1. **Tyyppi** — valitse yksi neljästä yllä mainitusta.
2. **Laajuus** — yksi workflow tai kaikki.
3. **Ehto** — aikaväli sekä kyseisen tyypin kynnyskentät.
4. **Vastetoimenpide** — mikä suoritetaan hälytyksen aktivoituessa ja kuinka usein sinulle ilmoitetaan.
5. **Tarkistus** — nimeä hälytys ja näe testitulokset.

### Testitulokset

Tarkistusvaiheessa vastataan kysymykseen, joka todella merkitsee ennen tallennusta: *kuinka usein tämä olisi aktivoitunut viimeisen 24 tunnin aikana?*

Se raportoi aktivoitumisten määrän ja korkeimman havaittun arvon suhteessa kynnysarvoon. Jos se ilmoittaa, että ehto olisi aktivoitunut 400 kertaa, voit korjata kynnysarvon ennen tallennusta sen sijaan, että saisit hälytyksen jälkeen. Voit laajentaa tarkasteluaikaa 3 tai 7 päivään.

## Tekoälyavusteinen luonnos

Ensimmäisen vaiheen yläosassa on laatikko, jossa voit kuvata haluamasi hälytyksen tavallisella kielellä:

> Varoita minua, jos laskujen synkronointi epäonnistuu yli 5 kertaa 10 minuutissa

Heym muuttaa tämän hälytyksen määritelmäksi, täyttää kaikki mahdolliset kentät ja siirtyy eteenpäin tekoälyn täyttäminä kenttinä, jolloin vahvistat tiedot uudelleenkirjoittamisen sijaan. Täydellinen pyyntö vie sinut suoraan Tarkistus-vaiheeseen.

**Osittainen pyyntö silti etenee.** Jos sanot vain "varoita minua, jos se epäonnistuu 5 kertaa", saat virhekynnyksen hälytyksen täytettynä lukumäärällä, oletusarvoilla muille kentille, ja ohjattu toiminto avautuu ensimmäiseen vielä tarvittavaan vaiheeseen: tässä tapauksessa Laajuus, koska workflowta ei nimetty. Huomautus yläosassa kertoo, mitä on vielä päätettävänä. Se ei koskaan estä Seuraava- tai Luo-painikkeen käyttöä.

Sama pätee, kun malli nimeää workflown, jota et voi avata, tai palauttaa ehdon puuttuvin kentin. Järkevät osat säilytetään, loput palautuvat kyseisen hälytystyypin oletusarvoihin, ja säädät niitä eteenpäin. Mikään tässä ei ohita vahvistusta: ohjatun toiminnon omat säännöt ja API tarkistavat hälytyksen uudelleen tallennuksen yhteydessä.
## Toistuva käyttäytyminen

Kun hälytys laukeaa, se siirtyy aktivoituneeseen tilaan. Seuraavaksi tapahtuva riippuu vaiheesta 4 tekemästäsi valinnasta.

- **Ilmoita kerran, kunnes tilanne palautuu** (oletusasetus) – hälytys laukeaa kerran ja pysyy hiljaa niin kauan kuin ehto pätee. Kun mittari palaa kynnyksen alapuolelle, hälytys palautuu OK-tilaan ja voi laueta uudelleen. Palautuminen on tilanmuutos, ei tapahtuma: se ei luo laukeamistietuetta eikä suorita ilmoitusworkflowta.
- **Jatka ilmoittamista tietyin väliajoin** – hälytys laukeaa uudelleen N minuutin välein niin kauan kuin ehto pätee.

Oletusasetus on olemassa, koska rikkinäinen workflow, jota tarkistetaan 60 sekunnin välein, muuten tuottaisi 60 laukeamista tunnissa, mikä johtaa hälytysten vaimentumiseen.

## Workflown suorittaminen laukeamisen yhteydessä

Vaiheessa 4 on kolme vaihtoehtoa kysymykseen "mitä tapahtuu, kun hälytys laukeaa":

- **Luo ja liitä uusi workflow** (oletusasetus) – hälytyksen tallentaminen luo myös workflown nimeltä *"&lt;hälytyksen nimi&gt; ilmoitus"* ja linkittää sen. Workflow sisältää syötesolmun, jonka kentät vastaavat alla olevaa payloadia täsmällisesti, joten `$alert.body.observed_value` ja muut muuttujat ovat heti käytettävissä. Sinun tarvitsee vain liittää viestin toimittava solmu. **Siirry workflowhin** -painike hälytyskortissa avaa sen. Tämä on oletusasetus, kosä hälytys, joka laukeaa ilman toimintoa, on helppo jättää huomaamatta.
- **Valitse olemassa oleva workflow** – suorita jo rakennettu workflow.
- **Älä tee mitään** – laukeaminen tallennetaan silti välilehdelle, mutta mitään workflowta ei suoriteta.

Hälytyksen payload saapuu workflown syötteenä seuraavassa muodossa:

```json
{
  "alert_id": "...",
  "alert_name": "Invoice sync failures",
  "alert_type": "error_threshold",
  "condition": "5+ errors in 10m",
  "scope": "workflow",
  "workflows": [{ "id": "...", "name": "Invoice Sync", "value": 12 }],
  "observed_value": 12,
  "threshold_value": 5,
  "window_start": "2026-08-09T11:50:00+00:00",
  "window_end": "2026-08-09T12:00:00+00:00",
  "window_minutes": 10,
  "context": { "error_count": 12 }
}
```

### Mikä workflow tuotti luvun

`workflows` on ainoa paikka, jossa workflow esiintyy. Se listaa jokaisen lukemaan vaikuttaneen workflown, kukin omalla `value`-kentällään – kyseisen workflown virheiden määrä, suorituskertojen määrä, hitain suoritus millisekunteina tai kustannukset riippuen hälytyksen tyypistä. Lista on järjestetty `value`-kentän mukaan suurimmasta pienimpään, joten `workflows[0]` on pahin rikkoja.

Se on **aina taulukko**: yhden alkion taulukko yhden workflown laajuudessa, useita "kaikki workflowt" -laajuudessa ja tyhjä taulukko (ei null), kun mitään ei voida liittää. Ilmoitusworkflow voi käsitellä sitä ilman muototarkistusta.

Tarkoituksella ei ole yksittäistä `workflow_id`-kenttää. Se kuvaa hälytyksen laajuutta eikä mittaria, joten se oli `null` järjestelmän laajuudessa, mikä on juuri se tapaus, jossa "mikä workflow?" on tärkein. `observed_value` pysyy aggregaattina, johon kynnysarvoverrataan; workflowkohtaiset `value`-kentät selittävät, mistä se tuli.

Näin hälytykset päätyvät Slackiin, sähköpostiin, Telegramiin tai mihin tahansa muualle: käyttämällä [solmuja](../reference/node-types.md), jotka ovat jo käytettävissäsi, erillisen ilmoitusjärjestelmän sijaan.

Hälytys ei voi ilmoittaa workflowsta, jota se tarkkailee. Se olisi silmukka, erityisen ilmeinen suoritusmäärähälytyksissä, joissa jokainen ilmoitus lisää mittaamaansa laskuria.

Ilmoitusworkflowien suoritukset ovat tavallisia suorituksia, joten ne näkyvät [suoritushistoriassa](../reference/execution-history.md) kuten muutkin suoritukset. Epäonnistunut ilmoitusworkflow tallennetaan laukeamistietueeseen, mutta se ei koskaan estä itse laukeamista.

Ilmoitusworkflow suoritetaan hälytyksen omistajan käyttöoikeuksin ja globaalein muuttujin, aivan kuin hän olisi suorittanut sen itse. Jollakulta jaetun workflown valitseminen ei lainaa kyseisen henkilön tunnistetietoja. Jos omistaja menettää pääsyn ilmoitusworkflowhin, laukeaminen silti tallennetaan, mutta ilmoitusta ei suoriteta.

## Laukeamishistoria

Hälytyslistan alla on laukeamishistoria: mikä laukesi, milloin, havaittu arvo kynnysarvoon verrattuna, tarkasti arvioitu ikkuna ja ilmoituksen tulos.

Laukeamisen merkitseminen käsitellyksi merkitsee rivin ja muuttaa hälytyksen tilan **Firing** -tilasta **Acknowledged** -tilaan. Tämä on kommentti sinusta, ei hälytyksestä: ehto pätee edelleen, ja hälytys palautuu **OK** -tilaan automaattisesti, kun mittari laskee kynnyksen alapuolelle.

Jokainen tietue tallentaa vaikuttavat tiedot laukeamishetkellä: epäonnistuneiden suoritusten tunnukset ja virheviestit, mallikohtaiset kustannukset tai laukaisulähteen jakauma. Tämä on tarkoituksellista. Arviointiaika on ohitse, ja sen uudelleenlaskeminen voi antaa eri vastauksen.

Laukeamistietueet säilytetään 90 päivää.

## Hälytyksistä kysyminen Chatissa

[Chat-välilehdellä](./chat-tab.md) voi kysyä hälytyksistä:

- "Mitkä hälytykset minulla on?"
- "Onko laskutusworkflowssa hälytys?"
- "Miksi kustannushälytys laukesi?"
- "Milloin tämä laukesi viimeksi?"

"Koska se laukesi" -tyyppisissä kysymyksissä Chat lainaa todellista havaittua arvoa, kynnysarvoa ja aikaväliä laukeamistietueesta sekä vaikuttavia yksityiskohtia.

## Jakaminen

Hälytyksiä voi jakaa yksittäisten käyttäjien tai [tiimien](./teams-tab.md) kanssa. Jakamasi henkilöt voivat nähdä hälytyksen ja sen laukeamishistorian. Vain omistaja voi muokata, keskeyttää, poistaa tai jakaa hälytyksen uudelleen.
### Kun workflow-käyttöoikeus poistetaan

Hälytys yksittäisessä workflowssa jatkaa kyseisen workflown suoritusmittareiden lukemista, joten käyttöoikeuden poistaminen workflowyn vaikuttaa myös käyttäjän hälytyksiin siinä:

- **Käyttäjän tai tiimin jakamisen poistaminen** kysyy workflown omistajalta, halutaanko myös pysäyttää kyseisen käyttäjän tai tiimin hälytykset workflowssa. Pysäyttäminen on oletusvalinta. Pysäytetyt hälytykset keskeytetään, eikä niitä poisteta, ja jokainen kirjataan `alert.disable_on_access_revoke` -merkinnällä [tarkistuslokiin](../reference/audit.md).
- **Tiimin jäsenen poistaminen tai tiimin poistaminen** keskeyttää aina kyseisiin liittyvät hälytykset, koska muutoksen tekijä ei välttämättä ole workflown omistaja.
- Hälytys keskeytetään vain, jos sen omistajalla ei ole muuta polkua workflowyn, kuten suoraa jakamista tai toista tiimiä.
- Keskeytetyn hälytyksen jatkaminen tai testaaminen tarkistaa omistajan käyttöoikeuden uudelleen, joten keskeytettyä hälytystä ei voi ottaa uudelleen käyttöön eikä sitä voi käyttää workflown mittareiden lukemiseen ilman käyttöoikeutta. **Jatka**-painikkeen painaminen ilman käyttöoikeutta näyttää ilmoituksen, joka selittää, että workflown omistajan on jaettava se uudelleen ensin.

## Hälytysten hallinta

- **Keskeytä / Jatka** – keskeytettyä hälytystä ei koskaan arvioida. Jatkaminen tarkistaa sen välittömästi sen sijaan, että odotettaisiin seuraavaa väliä.
- **Muokkaa** – muutokset vahvistetaan kokonaisuutena, joten osittainen muokkaus ei voi jättää hälytystä virheelliseen tilaan.
- **Poista** – poistaa hälytyksen ja sen laukeamishistorian.

## Katso myös

- [Analytics-välilehti](./analytics-tab.md) – kaaviot, joista kynnysarvot on haettu
- [Suoritukset-välilehti](./traces-tab.md) – mistä LLM-kustannusluvut tulevat
- [Suoritushistoria](../reference/execution-history.md) – suoritukset, joita virhe-, kesto- ja määrähälytykset mittaavat
- [Keskustelu-välilehti](./chat-tab.md) – hälytysten kysely luonnollisella kielellä
- [Tiimit](./teams-tab.md) – hälytysten jakaminen tiimin kanssa
