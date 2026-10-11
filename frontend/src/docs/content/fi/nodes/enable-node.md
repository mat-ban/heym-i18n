# Enable Node

**Enable Node** -solmu ottaa toisen solmun uudelleen käyttöön. Kun solmu suoritetaan, se asettaa kohdesolmun `active`-tilan arvoon `true` ja tallentaa muutoksen. Solmu on [Disable Node](./disable-node.md) -solmun vastine: sitä voidaan käyttää esimerkiksi [Cron](./cron-node.md) -trigerin tai minkä tahansa pois kytketyn solmun uudelleen käyttöönottoon.

## Yleiskatsaus

| Ominaisuus | Arvo |
|-----------|------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tuloste | `$nodeLabel.targetNode`, `$nodeLabel.enabled` |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|--------|---------|
| `label` | merkkijono | Solmun tunniste (camelCase) |
| `targetNodeLabel` | merkkijono | Käyttöön otettavan solmun tunniste (esim. `hourlyCheck`) |

## Toiminta

- Kohde tallennetaan aktiiviseksi, joten tulevat suoritukset ja trigerit näkevät sen. Uudelleen käyttöön otettu Cron-trigger laukeaa uudelleen seuraavalla ajastetulla ajankohdallaan.
- Jos kohde sijaitsee Enable Node -solmun alapuolella eikä ole vielä suoritettu, se suoritetaan myös nykyisessä suorituksessa.
- Aktiivisen solmun uudelleen käyttöönotto ei aiheuta muutoksia; tuloste raportoi silti `enabled: true`.
- Solmu epäonnistuu virheellä, jos `targetNodeLabel` on tyhjä tai mikään solmu ei vastaa annettua tunnistetta.

## Käyttötapaus

Käynnistä [Cron](./cron-node.md) -trigeri tarvittaessa. Tallenna Cron-solmu pois käytöstä ja lisää workflowhun vaihtoehtoinen käynnistyspiste, kuten [Input](./input-node.md) -trigeri. Pyyntö tähän käynnistyspisteeseen suorittaa Enable Node -solmun, ja Cron alkaa laukeamaan.

Pois kytketty trigeri ei koskaan käynnistä suoritusta itsestään, joten Enable Node -solmun on sijoitettava käynnistyspisteen taakse, joka pystyy suorittamaan sen.

## Esimerkki

```json
{
  "type": "enableNode",
  "data": {
    "label": "startCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Workflow: Input → Enable Node (kohde: cron) → Output. Cron-solmu `hourlyCheck` tallennetaan samaan workflowhun pois käytöstä ja suorittaa oman HTTP-tarkistuksen haaransa käyttöön otettuaan.

## Liittyvät

- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
- [Disable Node](./disable-node.md) – Poista solmu käytöstä workflown sisältä
- [Cron Node](./cron-node.md) – Käyttöön otettava trigeri
- [Condition Node](./condition-node.md) – Haaroitus ennen käyttöönottoa
- [Canvas-ominaisuudet](../reference/canvas-features.md) – Ota solmu käyttöön tai poista se käytöstä manuaalisesti
