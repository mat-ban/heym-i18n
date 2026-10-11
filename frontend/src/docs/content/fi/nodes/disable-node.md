# Disable Node -solmu

**Disable Node** -solmu poistaa pysyvästi käytöstä toisen solmun workflowissa. Kun solmu suoritetaan, se asettaa kohdesolmun `active`-arvoksi `false` ja tallentaa muutoksen. Solmua voidaan käyttää kertaluonteisiin operaatioihin, kuten Cron-triggerin pysäyttämiseen ehdon täytyttyä.

## Yleiskatsaus

| Ominaisuus | Arvo |
|------------|------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tuloste | `$nodeLabel.targetNode`, `$nodeLabel.disabled` |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|--------|---------|
| `label` | merkkijono | Solmun tunniste (camelCase) |
| `targetNodeLabel` | merkkijono | Poistettavan solmun tunniste (esim. `hourlyCheck`) |

## Käyttötapaus

Poista [Cron](./cron-node.md)-trigger käytöstä ehdon täytyttyä, jotta se ei enää suorita workflowa tulevissa suorituksissa. Käytä solmu uudelleen myöhemmin [Enable Node](./enable-node.md) -solmulla.

## Esimerkki

```json
{
  "type": "disableNode",
  "data": {
    "label": "stopCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Workflow: Cron → HTTP-tarkistus → Ehto (status valmis?) → jos tosi: Disable Node (kohde: cron) → Tuloste.

## Aiheeseen liittyvät

- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
- [Enable Node](./enable-node.md) – Ota poistettu solmu uudelleen käyttöön
- [Cron Node](./cron-node.md) – Poistettava trigger
- [Condition Node](./condition-node.md) – Haaraudu ennen solmun poistamista
