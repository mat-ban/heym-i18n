# Muuttuja

**Muuttuja**-solmu asettaa tai päivittää muuttujan, johon voidaan viitata mistä tahansa solmusta käyttämällä `$vars.muuttujaNimi` (workflow-lokaali) tai `$global.muuttujaNimi` (pysyvä). Käytä sitä laskureihin, kertyneisiin listoihin ja jaetun tilan hallintaan workflowssa.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tulos | `$solmuLabel.arvo`, tai käyttö `$vars.muuttujaNimi` / `$global.muuttujaNimi` |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `label` | merkkijono | Solmun tunniste (camelCase) |
| `variableName` | merkkijono | Muuttujan nimi (käytetään muodossa `$vars.muuttujaNimi` tai `$global.muuttujaNimi`). Vältä [varattuja nimiä](../reference/expression-dsl.md). |
| `variableValue` | lauseke | Asetettava arvo. Tukee lausekkeita. |
| `variableType` | `"auto"` \| `"string"` \| `"number"` \| `"boolean"` \| `"array"` \| `"object"` | Tyypin pakotus (oletus: auto) |
| `isGlobal` | boolean | Kun `true`, tallennetaan [Globaaliin muuttujavarastoon](../reference/global-variables.md) (pysyvä, käyttäjäkohtainen). Kun `false` tai puuttuu, workflow-lokaali (muistissa). |

## Taulukkomuuttujat

Alusta taulukot käyttämällä `$array()` tai `$array("a", "b")` Muuttuja-solmussa ennen `.add()`-metodin käyttöä:

```json
{"variableName": "items", "variableValue": "$array()", "variableType": "array"}
```

Lisää sitten alkioita (älä käytä `$` sulkujen sisällä):

```json
{"variableName": "items", "variableValue": "$vars.items.add(loopNode.item)", "variableType": "array"}
```

## Kriittinen sääntö

**Älä koskaan käytä `$` sulkujen sisällä:**

- ✅ `$vars.omaTaulukko.add(edellinenSolmu.teksti)`
- ❌ `$vars.omaTaulukko.add($edellinenSolmu.teksti)` – rikkoo lausekkeen

## Esimerkki – Laskuri

```json
{
  "type": "variable",
  "data": {
    "label": "kasvataLaskuria",
    "variableName": "counter",
    "variableValue": "$vars.counter + 1",
    "variableType": "number"
  }
}
```

## Liittyvät

- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
- [Loop-solmu](./loop-node.md) – Kerää alkioita Muuttuja-solmun avulla loopin sisällä
- [Expression DSL](../reference/expression-dsl.md) – `$vars`, `$global`, varatut nimet
- [Globaalit muuttujat](../reference/global-variables.md) – Pysyvät muuttujat `isGlobal`-asetuksella
