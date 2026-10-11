# Lausekkeiden arviointidialogi

Lausekkeiden arviointidialogi on laajennettu editori lausekkeita tukeville kentille. Se avautuu lausekesyötteen vieressä olevasta laajennuspainikkeesta ja tarjoaa tilavamman työtilan, automaattisen täydennyksen, reaaliaikaisen esikatselun ja tulosten selailun yhdessä paikassa.

## Dialogin avaaminen

- Klikkaa lausekekentän vieressä olevaa laajennuspainiketta Ominaisuudet-paneelissa.
- Monirivisissä kentissä painike näkyy syötekentän sisällä.
- Yksirivisissä kentissä painike näkyy syötekentän oikealla puolella.

## Dialogin asettelu

- Dialogi avautuu keskelle näyttöä noin **80vw × 80vh** -kokoisena modaalina.
- Otsikkorivillä näkyy **Arvioi — {kentän nimi}**, kun kentän otsikko on tiedossa.
- Editori säilyttää automaattisen täydennuksen, kenttien välisen navigoinnin ja tavalliset **Käytä** / **Peruuta** -toiminnot.
- Esikatselu päivittyy automaattisesti noin **300 ms** kirjoittamisen lopettamisen jälkeen.
- Paina `Ctrl` / `Cmd` + `Enter` soveltaaksesi nykyisen tekstin takaisin kenttään ja sulkeaksesi dialogin (sama kuin **Käytä**).

## Tulostusosa

Tulostusalue päivittyy automaattisesti, kun pysähdyt kirjoittamaan editoriin.

### Arviointi

| Lauseketyyppi | Tulos |
|---|---|
| Yksittäinen `$lauseke` (koko kenttä) | Alkuperäinen arvo säilyy |
| Yksittäinen polku ilman `$`-merkkiä (koko kenttä, ei upotettuja rivinvaihtoja) | Sama kuin `$` + polku (taustajärjestelmä normalisoi arviointia varten) |
| Teksti upotetuilla `$viitteillä` | Lopullinen tulos on aina merkkijono |
| Kirjaimellinen teksti (ei `$`-merkkiä, ei yksittäistä polkua) | Palautetaan sellaisenaan |

**Esimerkkejä**

| Syöte | Tulos |
|---|---|
| `$input.items` | `[1, 2, 3]` |
| `input.items` (sama kuin `$input.items`, kun koko arvo on tämä polku) | `[1, 2, 3]` |
| `Hei $input.name` | `Hei John` |
| `$input.count + 1` | `6` |
| `pelkkää tekstiä` | `pelkkää tekstiä` |

Arviointikonteksti rakentuu tässä järjestyksessä:

- **Kiinnitetyt tiedot** ylävirran solmuista
- **Viimeisimmät suoritustulokset** canvasilta
- `null`, kun ylävirran tietoja ei ole saatavilla

Jos nykyisellä solmulla on riippuvuuksia ylävirrasta, mutta yksikään niistä ei ole kiinnittänyt tietoja tai tuottanut viimeaikaista suoritustulosta, dialogi suorittaa ensin testiajon kontekstin rakentamiseksi ja arvioi sitten nykyisen tekstin.

### Tulospolun valitsin

Kun taustajärjestelmän tulos on objekti tai taulukko, tulostusalue voi näyttää vuorovaikutteisen polunvalitsimen raakaan JSONiin verrattuna.

- Kaksoisklikkaa riviä lisätäksesi kyseisen polun nykyiseen `$node.path`-viitteeseen.
- Yksittäisklikkaa laajennettavia rivejä avataksesi tai sulkeaksesi haaroja.
- Käytä sisäänrakennettua hakulaatikkoa etsiäksesi avaimia, arvoja ja polkumerkintöjä.

## Automaattinen täydennys

- Kirjoita `$` avataksesi ehdotuksia ylävirran solmuille, sisäänrakennetuille toiminnoille ja metodeille.
- Paina `Tab` tai `Enter` lisätäksesi valitun ehdotuksen.
- Käytä `↑` / `↓` -nuolinäppäimiä liikkuaksesi ehdotuslistassa.

### Esimerkkivastaukset

Kun jatkat `$...`-viitettä pisteellä, jokainen ehdotusrivi näyttää kyseisen ehdotuksen tuottaman vastauksen, lihavoituina rivin oikealla puolella.

- Kirjoittaminen `$set.listItems.first().toString().u` listaa `upper`, `urlEncode`, `urlDecode` ja `unescape`, kukin arvioidulla tuloksella — joten voit valita tuloksen perusteella nimen sijaan.
- Kirjoittaminen `$node.text.toJson()` jäsentää JSON-merkkijonon objektiksi tai taulukoksi. `.toJson()` jälkeen automaattinen täydennys voi tarjota jäsennettyjä avaimia (esim. `repoUrl`), kun viimeisimmät suoritustulokset tai kiinnitetyt tiedot ovat saatavilla.
- Tulokset arvioidaan taustajärjestelmässä samoilla kiinnitetyillä tiedoilla ja viimeisimmillä suoritustuloksilla, joita dialogin esikatselu käyttää, joten ne vastaavat sitä, mitä kenttä tuottaa.
- Vain itsenäisesti toimivat ehdotukset arvioidaan: nolla-argumenttimetodit (`upper()`, `first()`, `keys()`, `toJson()`) ja tavalliset ominaisuudet (`length`, `year`). Ehdotukset, jotka vaativat ensin argumentteja — `map`, `filter`, `sort`, `replace` — jätetään tyhjiksi.
- Rivi pysyy tyhjänä, kun ehdotus ei tuota vastausta: virhe, `null` tai metodi, joka ei sovellu kyseiseen arvoon.
- Vastaukset lyhennetään yhdeksi riviksi. Vie hiiri lyhennetyn vastauksen päälle nähdäksesi enemmän siitä.

## Rakennus tekoälyllä

**Rakenna tekoälyllä** -painike näkyy arviointidialogin oikeassa yläkulmassa, kun workflow on ladattu. Se avaa sisäkkäisen modaalin, jossa voit kuvata haluttua lauseketta tavallisella tekstillä ja antaa LLM:n generoida sen puolestasi.

### Toimintaperiaate

1. Klikkaa **Rakenna tekoälyllä** arviointidialogin työkalurivillä.
2. Valitse LLM-tunnistetiedot ja malli alasvetovalikoista.
3. Kirjoita selkokielinen kuvaus siitä, mitä haluat — esimerkiksi *"Hae asiakkaan nimi API-vastauksesta"*.
4. Klikkaa **Generoi**. Modaali kutsuu taustajärjestelmää, joka käyttää [Expression DSL](./expression-dsl.md) -järjestelmän kehotetta sekä viimeisimpiä workflow-ajon tuloksia kontekstina, ja palauttaa yhden lausekemerkkijonon.
5. Generoitu lauseke arvioidaan välittömästi samoilla canvas-tiedoilla, jotta näet tuloksen ennen soveltamista.
6. Klikkaa **Käytä** korvataksesi editorin sisällön generoidulla lausekkeella tai **Generoi uudelleen** yrittääksesi uudelleen.

### Käytetty konteksti

Generaattori saa solmujen tulokset viimeisimmästä canvasin testiajosta. Jos workflowta ei ole vielä ajettu, LLM generoi parhaan mahdollisen lausekkeen solmujen nimikkeiden ja DSL-käytäntöjen perusteella.

### Vaatimukset

- LLM-tunnistetiedot (OpenAI, Google tai Custom) on oltava määritettynä [Tunnistetiedot](./credentials.md) -välilehdessä.
- Workflown on oltava avattuna editorissa.

## Pikanäppäimet

| Pikanäppäin | Toiminto |
|---|---|
| Kirjoittamisen tauko (~300 ms) | Päivitä taustajärjestelmän esikatselu |
| `Ctrl` / `Cmd` + `Enter` | Käytä ja sulje dialogi |
| `Escape` | Sulje ensin automaattinen täydennys, muuten sulje dialogi |
## Sisäkkäiset `$`-merkit metodien argumenteissa

Dialogi- tai taustajärjestelmän arviointia varten voit välittää toisen viitteen sisäkkäisellä `$`-merkillä kutsuissa kuten `.get($other.field)`, kun tarvitset dynaamista avainta. Voit myös käyttää pelkkää polkua `.get(...)`-kutsun sisällä (esimerkiksi `other.field`); taustajärjestelmä käsittelee sen samalla tavalla. Tallennetut workflow-kentät tulee kuitenkin noudattaa [Expression DSL](./expression-dsl.md) -sääntöjä. Arviointirajapinta hyväksyy myös kokonaisen pelkän pisteellä erotetun polun mukavuuden vuoksi (katso yllä oleva taulukko).

## Navigointi

Set- ja Execute -kartoituseditorit voivat näyttää **Edellinen** / **Seuraava** -painikkeet, jolloin voit siirtyä kenttien välillä sulkematta dialogia.

## Liittyvät aiheet

- [Expression DSL](./expression-dsl.md)
- [Solmutyypit](./node-types.md)
- [Tunnistetiedot](./credentials.md) — vaaditaan Build with AI -toiminnossa
- [LLM-solmu](../nodes/llm-node.md)
- [Tulostussolmu](../nodes/output-node.md)
- [Ehtosolmu](../nodes/condition-node.md)
