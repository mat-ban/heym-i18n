# Yhdistä

**Yhdistä**-solmu odottaa useita rinnakkaisia syötteitä ja yhdistää ne yhdeksi tulokseksi. Käytä sitä, kun haluat yhdistää rinnakkaisten haarojen tulokset ennen jatkamista.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | n (määritettävissä) |
| Tulosteet | 1 |
| Tulos | `$nodeLabel.merged` – objekti, joka sisältää syötteet kustakin haarasta |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `label` | merkkijono | Solmun tunniste (camelCase) |
| `inputCount` | numero | Odotettavien syötteiden määrä (oletus: 2) |

## Käyttökohteet

- Käytä, kun haluat **yhdistää** rinnakkaisten haarojen tulokset
- **Älä käytä** rinnakkaisissa workflowissa, jotka päättyvät erillisiin [Tulos](./output-node.md)-solmuihin
- Jokainen syötehaara vaikuttaa yhdistettyyn tulokseen

## Esimerkki

```json
{
  "type": "merge",
  "data": {
    "label": "combineResults",
    "inputCount": 2
  }
}
```

Yhdistä useita haaroja Yhdistä-solmuun. Solmu odottaa kaikkia syötteitä ennen tuloksen tuottamista.

## Liittyvät

- [Solmutyypit](../reference/node-types.md) – Kaikkien solmutyyppien yleiskatsaus
- [Rinnakkaissuoritus](../reference/parallel-execution.md) – Rinnakkaisten haarojen suoritus
- [Workflow-rakenne](../reference/workflow-structure.md) – Yhteydet ja kahvat
