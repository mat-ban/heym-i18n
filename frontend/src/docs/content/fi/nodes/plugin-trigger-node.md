# Plugin Trigger -solmu

**Plugin Trigger** -solmu on trigger-tyylinen vastine
[Plugin-solmulle](./plugin-node.md). Sen tarjoaa asennettu liitännäinen, jonka
`kind`-arvo on `trigger`, ja se tuottaa aloitusdatan, josta workflow käynnistyy.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 0 |
| Tulosteet | 1 |
| Tuloste | `$nodeLabel.<liitännäisen palauttamat avaimet>` |

Trigger-liitännäinen voi edustaa mitä tahansa lähdettä — eri sovellusta, kolmannen osapuolen
palvelua tai toista teknologiaa — kunhan liitännäisen käsittelijä palauttaa datan,
jolla workflow alkaa.

## Käyttökohteet

Käytä Plugin Trigger -solmua, kun asennettu liitännäinen määrittelee triggerin, joka käynnistää
workflown. Liitännäisille, jotka suorittavat toiminnon workflown keskellä, käytä
[Plugin-solmua](./plugin-node.md) sen sijaan.

## Määritys

Kuten Plugin-solmun kohdalla, määrityslomake luodaan liitännäisen
manifestikenttien perusteella. Ei-salattuja merkkijonokenttiä varten käytetään lausekesyötettä, ja
salaiset kentät peitetään.

## Liitännäisten suoritus

Liitännäiskoodi on luotettua (Heym-toimittamaa, operaattorin asentamaa) ja suoritetaan prosessin sisällä.
Asennus on rajoitettu `HEYM_PLUGIN_ADMIN_EMAILS` -käyttäjille ja alijärjestelmä on
käytössä vain, jos `HEYM_PLUGINS_ENABLED` on aktivoitu. Katso lisätietoja kohdasta
[Suoritus & Käyttöönotto](../getting-started/running-and-deployment.md).

## Liitännäisten kehittäminen

Trigger-liitännäispaketin rakentamiseksi katso ohjeet kohdasta
[Liitännäisten kehittäminen](../reference/plugin-authoring.md), jossa käsitellään zip-paketin rakennetta,
manifestikenttiä, käsittelijäallekirjoituksia, kuvakkeita, riippuvuuksia ja suoritusaikaisen luottamusmallia.
