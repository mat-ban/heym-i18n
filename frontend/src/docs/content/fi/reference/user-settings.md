# Asetukset

Asetusvalintaikkunan avulla voit hallita profiiliasi, määrittää pysyviä tekoälyohjeita, päivittää tilin salasanan, määrittää keskusteluäänen, asettaa oletustunnistetiedot ja -mallin sekä tarkastella seurantatilaa. Avaa se napsauttamalla **avatariasi ja nimeäsi** otsikon oikeassa yläkulmassa.

## Valintaikkunan avaaminen

Napsauta **avatariasi ja nimeäsi** otsikon oikeassa yläkulmassa. Valintaikkuna avautuu seuraavilla välilehdillä: **Profiili**, **Turvallisuus**, **Ääni**, **Tekoälyn oletukset** ja **Seuranta**. Instanssin ylläpitäjät näkevät myös **SSO**-välilehden.

## Profiili-välilehti

### Profiilikuva

Heym näyttää [Gravatar](https://gravatar.com) -kuvan tilisi sähköpostiosoitteesta otsikossa, viestiesi vieressä [Keskustelu](../tabs/chat-tab.md) -välilehdellä ja **Keskustele Heymin kanssa** -toiminnossa, [Board](../tabs/board-tab.md) -kommenteissa sekä nimesi vieressä jakamisvalintaikkunoissa ja tiimin jäsenten luetteloissa. Muuttaaksesi kuvaa, päivitä se Gravatar-palvelussa; Heym hakee uuden kuvan muutaman tunnin kuluessa. Ilman Gravatar-kuvaa Heym näyttää nimesi ensimmäisen kirjaimen.

Kuva haetaan Heym-palvelimen kautta ja välimuistitetaan sinne, joten selain ei koskaan ota yhteyttä Gravatar-palveluun. Jos palvelin ei saa yhteyttä Gravatar-palveluun, kaikki näkevät jatkossa vain nimikirjaimet.

### Nimi

Näyttönimi, joka näkyy sovelluksessa. Tämä kenttä on pakollinen eikä sitä voi jättää tyhjäksi.

### Käyttäjän säännöt

Käyttäjän säännöt ovat mukautettuja ohjeita, jotka lisätään automaattisesti jokaiseen tekoälypyyntöön – sekä workflow-rakentajassa että kojelaudan keskustelussa. **Workflow-rakentajassa** ([Tekoälyavustaja](./ai-assistant.md)) ne liitetään järjestelmän kehotteeseen, jota käytetään workflow-JSONin luomiseen. **Kojelaudan keskustelussa** ne toimivat järjestelmätason kontekstina. Kirjoitat säännöt kerran ja ne pätevät globaalisti ilman, että sinun tarvitsee toistaa niitä jokaisessa kehotteessa.

**Yleisiä käyttötarkoituksia:**

- Kieli tai sävy: `Vastaa aina englanniksi. Pidä vastaukset ytimekkäinä.`
- Koodaustyyli: `Käytä async/await-malleja. Suosi TypeScript-rajapintoja tyyppien sijaan.`
- Workflow-käytännöt: `Sisällytä virheenkäsittely kaikkiin workflowihin. Käytä kuvaavia solmujen nimiä.`
- Vastauksen muoto: `Käytä luettelomerkintöjä. Vältä pitkiä selityksiä.`

**Missä ne pätevät:**

| Konteksti | Kuvaus |
|---------|-------------|
| **Workflow-rakentaja** | [Tekoälyavustaja](./ai-assistant.md) -pyynnöt workflowjen luomiseen tai muokkaamiseen |
| **Kojelaudan keskustelu** | Kaikki [Keskustelu-välilehden](../tabs/chat-tab.md) keskustelut |

Käyttäjän säännöt lisätään järjestelmätasolla – ne suoritetaan automaattisesti ennen jokaista kehotetta ilman erillistä määritystä workflow- tai keskustelukohtaisesti.

### Profiilin muutosten tallentaminen

Napsauta **Tallenna muutokset** soveltaaksesi muutokset. Muutokset tulevat voimaan välittömästi kaikille uusille tekoälypyynnöille.

## Turvallisuus-välilehti

### Salasanan vaihtaminen

Käytä Turvallisuus-välilehteä tilin salasanan päivittämiseen.

**Vaatimukset:**

| Sääntö | Vaatimus |
|------|-------------|
| Vähimmäispituus | 8 merkkiä |
| Isot kirjaimet | Vähintään yksi iso kirjain (A–Z) |
| Pienet kirjaimet | Vähintään yksi pieni kirjain (a–z) |
| Numero | Vähintään yksi numero (0–9) |

Salasanan on myös oltava erilainen kuin nykyinen salasanasi. Nämä säännöt valvotaan sekä käyttöliittymässä että palvelimella.

**Vaiheet:**

1. Syötä **Nykyinen salasana**
2. Syötä **Uusi salasana** (täytyy täyttää kaikki yllä mainitut vaatimukset)
3. Toista uusi salasana kentässä **Vahvista uusi salasana**
4. Napsauta **Päivitä salasana**

Jos nykyinen salasana on väärä, näytetään virheilmoitus. Onnistuessaan vahvistusviesti näytetään ja lomake nollautuu automaattisesti.

## Ääni-välilehti

Ääni-välilehdellä määritetään puheääni [Keskustelu-välilehdelle](../tabs/chat-tab.md): valitse **ElevenLabs-tunnistetiedot** (tai lisää ne suoraan), valitse **Ääni** ElevenLabs-tililtäsi ja **Tallenna ääniasetukset**. Tämä mahdollistaa viestikohtaisen ääneen lukemisen ja vuorovaikutteisen äänitilan. Katso täysi toimintosarja kohdasta [Keskusteluääni (TTS & STT)](./chat-voice.md).

## Tekoälyn oletukset -välilehti

Tekoälyn oletukset -välilehdessä on kaksi osiota.

### Suosikki-tunnistetiedot ja -malli

Valitse **ensisijaiset LLM-tunnistetiedot** ja niiden **malli**. Tästä tulee oletusarvo jokaiselle sovelluksen tekoälytoiminnalle – keskustelulle, [Tekoälyavustajalle](./ai-assistant.md) (rakentaja, analysoija ja workflowjen luonti), board-mapperille, tekoälydashboard-widgeteille, [dokumenttikeskustelulle](../tabs/chat-tab.md), datataulukon tekoälyrakennepalvelulle, lausekerakentajalle ja arvioinneille – aina kun kyseisellä alueella ei ole tallennettua valintaa.

Kunkin alueen valintasääntö on seuraava:

1. **Tallennettu valinta** – alueella aiemmin tehty valinta (esimerkiksi keskustelun viimeisin malli) käytetään aina.
2. **Suosikki** – käytetään, kun tallennettua valintaa ei ole.
3. **Ensimmäiset saatavilla olevat tunnistetiedot** – varajärjestely, kun et ole asettanut suosikkia.

Voit edelleen muuttaa tunnistetietoja ja mallia aluekohtaisesti milloin tahansa; suosikki täyttää vain alkuperäisen oletuksen. Jätä tunnistetiedot valitsematta (**Ei suosikkia**) säilyttääksesi aiemman ensimmäisten saatavilla olevien tunnistetietojen käytön. Jos suosikkitunnistetietosi poistetaan tai niiden jakaminen keskeytetään, välilehdessä näytetään huomautus ja alueet siirtyvät hiljaisesti ensimmäisten saatavilla olevien tunnistetietojen käyttöön.
### Koodipaketin käyttö

Jokaiselle **Codex**-tunnistetiedolle (mukaan lukien jaetut) välilehti näyttää jäljellä olevan käyttökiellon käyttöasteena vaakasuoran palkin aktiiviselta ikkunalta — esimerkiksi **5 tunnin** ikkuna ja/tai **viikoittainen** ikkuna, riippuen tilauksestasi. Jokainen palkki näyttää kiintiön jäljellä olevan prosenttiosuuden ja nollauslaskurin. **Päivitä**-painike hakee tiedot uudelleen tarpeen mukaan (tulokset välimuistoidaan lyhyeksi aikaa palvelimella).

Jokaiselle **OpenCode**-tunnistetiedolle välilehti näyttää OpenCode Go -tilauksen ikkunat — **5 tuntia**, **viikoittain** ja **kuukausittain** — samantyylisinä palkkeina, jotka luetaan yhdyskäytävän todennetusta käyttörajapinnasta kyseisen tunnistiedon API-avaimella. Ikkuna, joka on saavuttanut rajansa, näytetään keltaisella tekstillä **"raja saavutettu"**. Jos avain on virheellinen tai työtilalla ei ole Go-tilausta, kortti kertoo syyn eikä näytä palkkeja.

## Observability-välilehti

Observability-välilehti näyttää tämän instanssin [OpenTelemetry Tracing](./opentelemetry.md) -tilan vain luku -muodossa: onko jäljitys käytössä, OTLP-yhdyskäytävä, palvelun nimi, näytteenottosuhde ja mitä span-alkioita lähetetään. Jäljitys määritetään `HEYM_OTEL_*` -ympäristömuuttujien kautta taustajärjestelmässä, joten tämä välilehti ei muokkaa mitään. Kun jäljitys on pois käytöstä, välilehti listaa sen käyttöönottoon tarvittavat ympäristömuuttujat. Salaisuuksia, kuten OTLP-todennusotsikoita, ei koskaan näytetä tässä. Katso [Ympäristömuuttujat](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) täydellisestä konfiguraatio-oppaasta.

## SSO-välilehti

Näkyy vain instanssin ylläpitäjille — `HEYM_ADMIN_EMAILS` -listalla mainituille tileille. Tämä välilehti yhdistää Heymin ulkoiseen OpenID Connect -palveluntarjoajaan, jolloin käyttäjät kirjautuvat sisään jo olemassa olevilla tileillään. Syötä myöntäjän URL ja asiakastunnistetiedot, kopioi vain luku -muotoinen uudelleenohjausosoite palveluntarjoajaasi ja suorita **Testaa yhteys** ennen sen käyttöönottoa. Salasanalla kirjautuminen voidaan sammuttaa täältä, kun testi onnistuu. Katso [Kertakirjautuminen](./sso.md) täydellisestä asennusoppaasta.

## Instanssien välilehti

Näkyy vain instanssin ylläpitäjille — `HEYM_ADMIN_EMAILS` -listalla mainituille tileille. Tämä välilehti listaa tähän tietokantaan yhdistetyt Heym-instanssit ja määrittää, kuinka taustalla suoritettavat workflowt jaetaan niiden kesken. Jokainen rivi näyttää instanssin muokattavan nimen, sen roolin, onko se käytössä, mitattu viive tietokantaan, päälle/pois -kytkin ja sen paino. Painot ovat osuuksia niistä instansseista, jotka voivat tällä hetkellä vastaanottaa työtä, ei prosentteja sadasta: esimerkiksi `41 / 26 / 33` ja kolmas instanssi pois käytöstä, jolloin kaksi ensimmäistä saavat 61 % ja 39 %. Paneeli tulostaa tämän tehollisen jaon taulukon alle ja estää tallentamisen vain, jos yksikään käytössä oleva instanssi ei saa painoa ollenkaan.

**Anna uusille instansseille osuus automaattisesti** on oletuksena käytössä: instanssi, joka liittyy, muuten jäisi painoksi 0 eikä saisi mitään, joten johtaja antaa sille kerran yhtä suuren osuuden ja skaalaa olemassa olevat painot alaspäin säilyttäen niiden suhteet. Se ei koskaan muuta instanssia, jonka painon olet itse asettanut.

Paneeli raportoi myös, kuinka suuri osa viimeisen 24 tunnin suorituksista pystyi suorittamaan vain pääinstanssilla. Kun tämä osuus on suuri, alla olevat painot eivät voi siirtää tätä työtä. Katso [Kuormanjako](./cluster.md) siitä, mikä pysyy päätasolla ja kuinka numerot valitaan.

## Mitä tässä dialogissa ei ole

| Ominaisuus | Mistä löytää |
|---------|-----------------|
| **API-avainten hallinta (MCP)** | [MCP-välilehti](../tabs/mcp-tab.md) – näytä, kopioi ja luo uudelleen MCP-palvelimen API-avain |
| **Teema (tumma / vaalea)** | Aurinko/Kuu-kytkin otsikkopalkissa (käyttäjämerkin vieressä) |
| **Sähköpostin vaihto** | Ei tällä hetkellä tuettu |

## Aiheeseen liittyvää

- [Tekoälyavustaja](./ai-assistant.md) – Workflow-rakentajan keskustelu, joka käyttää käyttäjäsääntöjä
- [Keskustelu-välilehti](../tabs/chat-tab.md) – Kojelaudan keskustelu, joka käyttää käyttäjäsääntöjä
- [Keskustelun ääni (TTS & STT)](./chat-voice.md) – ElevenLabs-ääni, joka määritetään Ääni-välilehdessä
- [MCP-välilehti](../tabs/mcp-tab.md) – MCP-palvelimen API-avain ja workflow-työkalun näkyvyys
- [Tunnistetiedot-välilehti](../tabs/credentials-tab.md) – API-avaimet tekoälysolmuille ja integraatioille
- [Turvallisuus](./security.md) – Istuntonhallinta, käyttökiellot, tunnistetietojen salaus
- [Kertakirjautuminen](./sso.md) – Yhdistä ulkoinen OpenID Connect -palveluntarjoaja
- [OpenTelemetry Tracing](./opentelemetry.md) – Hajautettu jäljitys workflow- ja solmujen suorituksille
