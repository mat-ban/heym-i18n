# Plugin-solmu

**Plugin**-solmu suorittaa asennetun liitännäisen tarjoaman mukautetun toiminnon. Liitännäiset
laajentavat Heymia uusilla solmutyypeillä — toimintoja, kolmannen osapuolen integraatioita tai mitä tahansa
Pythonilla ilmaistavaa — ilman, että sovelluksen ydintoimintoja tarvitsee muokata.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tuloste | `$solmunNimi.<liitännäisen palauttamat avaimet>` |

Liitännäinen **paketti** (yksi zip-tiedosto) voi sisältää **useita solmuja** — mitä tahansa sekoitusta toimintoja
ja laukaisimia. Jokainen solmu näkyy valikossa **Liitännäiset** -kohdassa omalla nimellään ja kuvauksellaan. Kun solmu vedetään canvas-alueelle, luodaan Plugin-solmu, joka on sidottu kyseiseen pakettiin (`pluginId`) ja solmuun (`pluginNodeKey`).

## Käyttökohteet

Käytä Plugin-solmua, kun järjestelmän ylläpitäjä on asentanut tarvitsemasi toiminnon suorittavan liitännäisen — esimerkiksi kutsuakseen yksityistä APIa, kommunikoidakseen sisäisen järjestelmän kanssa tai suorittaakseen käyttöösi räätälöityä logiikkaa.

Laukaisutyyppisille liitännäisille, jotka käynnistävät workflown, katso
[Plugin Trigger -solmu](./plugin-trigger-node.md).

## Määritys

Solmun määrityslomake luodaan automaattisesti liitännäisen manifestin perusteella. Jokainen liitännäisen määrittelemä kenttä (`string`, `number`, `boolean` tai `select`) renderöidään automaattisesti. Ei-salaiset merkkijonokentät käyttävät lausekesyötettä, ja tallennetut merkkijonomääritykset, jotka alkavat merkillä `$`, selvitetään ennen kuin liitännäisen käsittelijä suoritetaan.

Salaiset kentät (kuten API-avaimet) peitetään käyttöliittymässä eikä niitä koskaan kirjata lokiin.

## Liitännäisten suoritus

Liitännäiset toimitetaan Heymin kautta ja asennetaan ylläpitäjän toimesta, joten liitännäiskoodi on
**luotettua** ja suoritetaan prosessin sisällä kuten sisäänrakennettu solmu, täydellä verkkoyhteydellä ja kirjastokäytöllä. Liitännäinen voi määritellä pip-riippuvuudet (`dependencies`), jotka asennetaan instanssiin liitännäisen asennuksen yhteydessä.

Liitännäisten asentaminen ja poistaminen on rajoitettu ylläpitäjille, joiden sähköpostiosoite on listattu `HEYM_PLUGIN_ADMIN_EMAILS` -muuttujassa, ja koko alijärjestelmä on käytössä vain, jos `HEYM_PLUGINS_ENABLED` on asetettu (oletusarvoisesti pois käytöstä). Katso
[Käynnistys & käyttöönotto](../getting-started/running-and-deployment.md) ympäristömuuttujien tarkempaa tietoa varten.

## Mukautetut kuvakkeet

Liitännäinen voi sisältää mukautettuja SVG-logoja. Aseta `icon.svg` paketin juureen oletuskuvakkeeksi kaikille solmuille ja/tai anna solmulle oma `"icon": "<tiedosto>.svg"` manifestissa. Kuvake näkyy sekä valikon kortissa että canvas-solmussa; solmut ilman kuvaketta käyttävät oletuksena palapelin palaa kuvaavaa symbolia.

## Tekoälyavusteinen rakentaminen

Asennetut liitännäiset näkyvät tekoälyavustajalle ja keskustelucanvasille, joten voit pyytää
Heymiä "käyttämään Acme CRM -liitännäistä tietueen luomiseen", ja se luo
Plugin-solmun oikeilla `pluginId`- ja `config`-arvoilla.

## Liitännäisten kehittäminen

Liitännäispaketin rakentamiseksi katso
[Liitännäisten kehittäminen](../reference/plugin-authoring.md) zip-paketin rakenteen,
manifestikenttien, käsittelijäallekirjoitusten, kuvakkeiden, riippuvuuksien ja suoritusajan luottamusmallin tietoja varten.
