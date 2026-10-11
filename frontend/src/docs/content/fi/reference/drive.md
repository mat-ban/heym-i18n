# Drive

Drive-välilehti tarjoaa keskitetyn paikan tarkastella, hallita ja jakaa taitoja (skills) luomia tiedostoja.

## Drive-välilehden käyttö

Siirry **Drive**-välilehdelle hallintapaneelissa. Kaikki workflow-taitojen luomat tiedostot näkyvät tässä, luontipäivämäärän mukaisessa järjestyksessä.

## Tiedostoluettelo

Tiedostoluettelossa näkyy:

- **Nimi** - Alkuperäinen tiedostonimi tyyppikohtaisella kuvakkeella
- **Tyyppi** - Tiedoston MIME-tyyppi (esim. pdf, csv, docx)
- **Koko** - Ihmisen luettavissa oleva tiedostokoko
- **Lähde** - Solmun nimi, joka loi tiedoston
- **Päivämäärä** - Tiedoston luontiaika
- **Toiminnot** - Lataa, jaa ja poista -painikkeet

## Joukkotoiminnot

Jokaisella omistamallasi tiedostolla on rivin alussa valintaruutu. Tiimien kautta jaetut tiedostot ovat vain luku -tilassa eivätkä ole valittavissa. Valitse useita tiedostoja (Shift-näppäimellä valitaan yhtenäinen alue; otsikkovalintaruutu valitsee koko sivun) paljastaaksesi joukkotoimintapalkin luettelon yläpuolella. Klikkaa sitten **Joukkotoiminnot** avataksesi yhtenäisen valintaikkunan, jossa voit soveltaa samoja asetuksia kaikkiin valittuihin tiedostoihin:

- **Jaa kaikki tiimieni kanssa** / **Poista tiimijako** – vaihtaa tiimijaon tilaa kaikille valituille tiedostoille kerralla
- **Luo jakolinkki jokaiselle tiedostolle** – luo jakolinkin jokaiselle valitulle tiedostolle käyttäen samoja vanhenemis-, salasana- ja latausraja-asetuksia

Valintaikkuna ilmoittaa, kuinka monelle tiedostolle asetukset sovellettiin; tiedostot, joita et omista, ohitetaan. Luettelon alaosassa oleva rivejä per sivu -valitsin (25 / 50 / 100 / **Kaikki**) mahdollistaa useampien tiedostojen lataamisen yhdelle sivulle, jolloin voit valita koko Drive-alueeltasi.

## Tiedostojen jakaminen

Klikkaa **Jaa**-kuvaketta avataksesi jakovalintaikkunan. Voit luoda useita jakolinkkejä tiedostolle erilaisilla asetuksilla ja halutessasi jakaa tiedoston nykyisten tiimiesi kanssa.

### Julkinen linkki (Token-pohjainen)

Luo jakolinkki ilman salasanaa. Kuka tahansa, jolla on linkki, voi ladata tiedoston.

### Salasanasuojattu linkki (Basic Auth)

Aseta salasana linkkiä luodessa. Latausosoite käyttää HTTP Basic Authenticationia - selaimet pyytävät käyttäjätunnusta (`file`) ja salasanaa, kun linkkiä avataan.

### Linkin asetukset

- **Vanhenee (tunteja)** - Aseta halutessasi vanhenemisaika
- **Maksimi lataukset** - Rajoita halutessasi latausten määrää
- Molemmat voidaan yhdistää maksimaaliseen hallintaan

### Jaa tiimieni kanssa

Ota käyttöön **Jaa tiimieni kanssa** myöntääksesi vain luku -oikeudet kaikille tiimeille, joihin kuulut. Tiimin jäsenet voivat nähdä ja ladata tiedoston Drivesta sekä käyttää Drive-solmun vain luku -toimintoja, mutta vain tiedoston omistaja voi poistaa tiedoston, luoda tai peruuttaa julkisia linkkejä tai muuttaa salasanaa/TTL/latausrajoja.

Asetus on tiedostokohtainen. Jos liityt tai luot uuden tiimin myöhemmin, vaihda jakoa uudelleen tai käytä Drive-solmun `shareWithMyTeams`-toimintoa lisätäksesi kyseisen tiimin. Käytä `unshareWithMyTeams`-toimintoa poistaaksesi tiimijaot tiedostosta workflowssa.

### Jakojen hallinta

Jakovalintaikkuna näyttää kaikki olemassa olevat jakolinkit:
- Nykyinen latausten määrä
- Vanhenemistila
- Onko Basic Auth käytössä
- Kopioi ja peruuta -painikkeet

## Tiedostolinkit Chatissä ja Portaalissa

Kun taito luo tiedostoja workflow-suorituksen aikana Portaalin chatin tai Quick Drawerin kautta, latauslinkit ilmestyvät automaattisesti vastaukseen. Käyttäjät voivat klikata ladatakseen tiedoston suoraan.

## Tallennus

Luodut tiedostot tallennetaan palvelimen tiedostojärjestelmään hakemistoon `data/files/`. Docker-käyttöönotoissa tämä liitetään volyymiksi pysyvyyttä varten.

## Tiedostojen hallinta workflowista

[Drive-solmu](../nodes/drive-node.md) mahdollistaa Drive-tiedostojen hallinnan ohjelmallisesti workflowssa. Käytä sitä:

- **Listaamaan** tiedostosi ja palauttamaan metatiedot, kuten tiedostonimi, MIME-tyyppi, koko, lähde ja latausosoite
- **Poistamaan** tiedoston sen toimittamisen jälkeen käyttäjälle
- **Jakamaan tai poistamaan tiimijaon**, jotta tiimin jäsenet voivat lukea ja ladata tiedoston vain, kun jako on voimassa
- **Asettamaan salasanan** latauslinkille
- **Asettamaan TTL:n**, jotta linkki vanhenee N tunnin jälkeen
- **Asettamaan latausrajan**

Tiedoston muuntaminen toiseen muotoon on [Converter-solmun](../nodes/converter-node.md) tehtävä, käyttämällä `conversion: "fileConvert"`. Se lukee Drive-tiedoston ja tallentaa muunnetun tuloksen uutena tiedostona.

Viittaa tiedostoon sen ID:llä taidon tulosteesta: `$agentLabel._generated_files[0].id`

Katso [Drive-solmun dokumentaatio](../nodes/drive-node.md) konfigurointitietoja varten.

## Drive-tiedostojen lukeminen taidoista

Agenttitaidot voivat ottaa Drive-lukemisen käyttöön taidokortin **Ota Drive-tiedostot käyttöön** -asetuksella. Kun asetus on käytössä, taidon suoritusympäristö sisältää automaattisesti luodun `heym_drive.py` -apufunktion. Taidokoodi voi tuoda apufunktioita, kuten `read_drive_text`, `read_drive_file`, `read_drive_base64`, `get_drive_file`, `get_drive_file_path` ja `list_drive_files`.

Drive-lukeminen rajoittuu workflown toimijalle saatavilla oleviin tiedostoihin: omistamiin tiedostoihin ja tiimien kautta jaettuihin tiedostoihin. Käytä tiedoston ID:tä tarkkaa hakua varten tai tarkkaa tiedostonimeä, kun käyttäjä viittaa tiedostoon nimellä. Tiedostonimihakuto palauttaa uusimman saatavilla olevan tiedoston kyseisellä nimellä; `list_drive_files(filename="...")` palauttaa kaikki täsmäävät tiedostot.

## Liittyvät aiheet

- [Drive-solmu](../nodes/drive-node.md) - Workflow-toiminnot (listaaminen, hakeminen, poistaminen, salasana, TTL, latausraja, tiimijako)
- [Drive-välilehti](../tabs/drive-tab.md) - Selaa tiedostoja hallintapaneelissa
- [Tiedostojen luonti](./file-generation.md) - Kuinka `_generated_files` ja latausosoitteet luodaan

## Siivous

Vanhentuneet jakotokenit siivotaan automaattisesti päivittäin. Tiedostot säilyvät, kunnes ne poistetaan manuaalisesti Drive-välilehden kautta. Käytä **Tyhjennä kaikki** -toimintoa poistaaksesi kaikki tiedostot ja niiden jakolinkit yhdellä toiminnolla.
