# Set

**Set**-sõlm teisendab ja kaardistab sisendandmeid kohandatud väljundiks. Kasutage seda suurtähtedeks, alamstringideks, konkateneerimiseks, juhuslikeks arvudeks ja mis tahes andmete teisendamiseks—mitte workflow'de kutsumiseks (selleks kasutage [Execute](./execute-node.md)).

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 1 |
| Väljund | `$nodeLabel.keyName` iga mapping-võtme kohta |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `label` | string | Sõlme identifikaator (camelCase) |
| `mappings` | array | Võtme-väärtuse paarid. Igaüks: `{ key, value }`, kus `value` on [avaldis](../reference/expression-dsl.md) |

## Agendi tööriista kasutamine

Kui Set-sõlm on ühendatud [Agendi sõlmega](./agent-node.md) lõuendi sõlme tööriistana, saab iga mapping-väärtuse märkida **agendi poolt esitatavaks** boti ikooniga. Märgitud mapping-väärtused muutuvad tööriista parameetriteks, mille agent täidab käitusajal. Märgistamata mapping'ud jäävad sõlme konfiguratsioonis fikseerituks.

Boti ikoon kuvatakse ainult siis, kui Set-sõlm on ühendatud agendi tööriistade handle'iga. Eraldiseisev Set-sõlm ei näita agendi poolt esitatavaid juhtelemente.

## Avaldise reeglid

- Viitamine eelnevatele sõlmedele: `$nodeName.text`, `$nodeName.body.field`
- Funktsioonide kasutamine: `$randomInt(1, 10)`, `$range(1, 5)`, `$now.format('HH:mm')`
- `$range(a,b)` jätab b välja; kui `a > b`, tagastab vea.
- Ainult üks `$` avaldise alguses—mitte kunagi sulgude sees
- Väljundile juurdepääs võtme järgi: `$setNode.randomNumber`, `$setNode.text`

## Näide

```json
{
  "type": "set",
  "data": {
    "label": "transformData",
    "mappings": [
      { "key": "text", "value": "$userInput.body.text.upper()" },
      { "key": "firstChar", "value": "$userInput.body.text.substring(0, 1)" },
      { "key": "randomNum", "value": "$randomInt(1, 10)" },
      { "key": "rangeArr", "value": "$range(1, 5)" }
    ]
  }
}
```

Edasised sõlmed pääsevad juurde järgmiselt: `$transformData.text`, `$transformData.firstChar`, `$transformData.randomNum`, `$transformData.rangeArr`.

## Seotud

- [JSON-väljundi mapper](./json-output-mapper-node.md) – Samad mapping'ud; ainus terminal tagastab juur-JSON-i webhookide/käivituste jaoks
- [Sõlmede tüübid](../reference/node-types.md) – Ülevaade kõigist sõlmede tüüpidest
- [Execute-sõlm](./execute-node.md) – Workflow'de kutsumine (mitte andmete teisendamine)
- [Avaldise DSL](../reference/expression-dsl.md) – Funktsioonid ja süntaks
- [Avaldise hindamise dialoog](../reference/expression-evaluation-dialog.md) – Laiendatav redaktor reaalajas backend-eelvaatega ja Eelmine/Järgmine mapping'ute jaoks
