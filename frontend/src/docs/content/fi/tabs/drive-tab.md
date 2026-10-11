# Drive-välilehti

Drive-välilehdessä näkyvät kaikki workflowien taitojen luomat tiedostot.

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Katso Drive-esittely</a></p>

## Yleiskatsaus

Workflow-taitojen luomat tiedostot (PDF, DOCX, CSV, kuvat jne.) tallennetaan automaattisesti ja listataan Drive-välilehdelle. Jokainen tiedosto näyttää nimensä, tyypin, koon, lähdesolmun, luontipäivämäärän ja tiimijakotilan.

## Ominaisuudet

- **Haku** - Suodata tiedostoja nimen, tyypin tai lähdesolmun perusteella
- **Kopioi tiedostotunniste** - Kopioi tiedoston UUID leikepöydälle, valmiina liitettäväksi [Drive](../nodes/drive-node.md)- tai [Converter](../nodes/converter-node.md)-solmuun
- **Lataa** - Todennetut lataukset omille tiedostoillesi ja tiimien kautta jakamillesi tiedostoille
- **Jaa** - Luo jaettavia latauslinkkejä valinnaisella salasanasuojauksella ja vanhenemisajalla tai jaa tiedosto vain luku -muodossa nykyisille tiimeillesi
- **Poista** - Poista tiedostot ja niiden jakolinkit
- **Tyhjennä kaikki** - Poista kaikki tiedostot ja niiden jakolinkit vahvistuksen jälkeen
- **Joukkotoiminnot** - Valitse useita tiedostoja valintaruuduilla (Shift-näppäimellä painaen valitsee alueen) ja suorita sama toiminto kaikille kerralla
- **Sivutus** - Selaa suuria tiedostokokoelmia, jossa on riviä per sivu -valitsin (25 / 50 / 100 / Kaikki)

## Joukkotoiminnot

Omistamiesi tiedostojen rivin alussa on valintaruutu (tiimien kautta jakamasi tiedostot ovat vain luku -muodossa eivätkä valittavissa). Valitse useita rivejä - tai käytä otsikkovalintaruutua valitaksesi koko sivun, ja **Shift-näppäimellä painaen** valitaksesi alueen - ja käytä sitten listan yläpuolella ilmestyvää joukkotoimintopalkkia:

- **Lataa ZIP** pakkaa kaikki valitut tiedostot yhteen ZIP-arkistoon ja lataa sen
- **Joukkotoiminnot** avaa yhden valintaikkunan, jossa voi asettaa saman asetuksen kaikille valituille tiedostoille:
  - **Jaa kaikki tiimeilleni** / **Poista tiimijako** yhdellä napsautuksella
  - **Luo jakolinkki jokaiselle tiedostolle** käyttäen samaa salasanaa, vanhenemisaikaa ja latausrajoituksia
- **Poista** poistaa kaikki valitut tiedostot ja niiden jakolinkit vahvistuksen jälkeen
- **Tyhjennä valinnat** poistaa kaikki valinnat

Valintaikkuna raportoi, kuinka monelle tiedostolle toiminto sovellettiin (ei-omistamasi tiedostot ohitetaan). Käytä riviä per sivu -valitsimen **Kaikki** -vaihtoehtoa ladataaksesi kaikki tiedostot yhdelle sivulle ja valitaksesi koko Driven kattavan alueen. Hakukenttään kirjoittaminen vaihtaa automaattisesti riviä per sivu -valitsimen **Kaikki** -tilaan, jotta haku kattaa kaikki tiedostot, ei vain nykyisen sivun; haun tyhjentäminen palauttaa edellisen valintasi.

## Jakaminen

Luo jakolinkkejä seuraavin vaihtoehdoin:
- **Ei todennusta** - Julkinen token-pohjainen latauslinkki
- **Basic Auth** - Salasanasuojattu linkki (käyttäjätunnus: `file`)
- **Vanheneminen** - Valinnainen aikarajoitteinen linkki
- **Latausrajoitukset** - Valinnainen latausten enimmäismäärä

Ota käyttöön **Jaa tiimeilleni** -vaihtoehto tiedostossa tehdäksesi sen näkyväksi kaikille tiimeille, joihin kuulut. Jaetut tiimin jäsenet saavat vain luku -oikeudet; hallintatoiminnot säilyvät vain omistajalle.

## Agent-taitojen käyttöoikeudet

Agent-solmun taidot voivat valita käyttöönsä Driven tiedostojen lukemisen. Kun **Ota Driven tiedostot käyttöön** on päällä taidolle, sen Python-koodi voi lukea saatavilla olevia Driven tiedostoja tiedostotunnisteen tai tarkan tiedostonimen perusteella generoidun `heym_drive.py` -apufunktion kautta. Asetus on oletuksena pois päältä.

Katso [Drive-viite](../reference/drive.md) täydellisiä tietoja.

## Liittyvät

- [Drive-solmu](../nodes/drive-node.md) - Listaa tiedostoja, noutaa metatietoja, jaa tiimeille tai muuta jakoehtoja workflowsta
- [Tiedostojen luonti](../reference/file-generation.md) - Kuinka taidot luovat tiedostoja
- [Drive-viite](../reference/drive.md) - Jakolinkit, tokenit ja siivous
- [Portal](../reference/portal.md) - Tiedostolinkit portal-keskustelun vastauksissa
