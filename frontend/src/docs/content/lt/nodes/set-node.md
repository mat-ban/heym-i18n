# Set

**Set** mazgas transformuoja ir žemėlapiuoja įvesties duomenis į pasirinktinius išvesties duomenis. Naudokite jį didžiosioms raidėms, dalinėms eilutėms, sujungimui, atsitiktiniams skaičiams ir bet kokiai duomenų transformacijai—ne workflow iškvietimams (tam naudokite [Execute](./execute-node.md)).

## Apžvalga

| Ypatybė | Vertė |
|----------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Išvestis | `$nodeLabel.keyName` kiekvienam žemėlapio raktui |

## Parametrai

| Parametras | Tipas | Aprašymas |
|-----------|------|-------------|
| `label` | string | Mazgo identifikatorius (camelCase) |
| `mappings` | array | Raktų-vertės poros. Kiekviena: `{ key, value }`, kur `value` yra [išraiška](../reference/expression-dsl.md) |

## Agentų įrankių naudojimas

Kai Set mazgas yra prijungtas prie [Agent Node](./agent-node.md) kaip drobės mazgo įrankis, kiekviena žemėlapio vertė gali būti pažymėta kaip **agento teikiama** su roboto ikona. Pažymėtos žemėlapio vertės tampa įrankio parametrais, kuriuos agentas užpildo vykdymo metu. Nepažymėti žemėlapiai lieka fiksuoti mazgo konfigūracijoje.

Roboto ikona pasirodo tik tada, kai Set mazgas yra prijungtas prie agento įrankių rankenos. Savarankiškas Set mazgas nerodo agento teikiamų valdymo elementų.

## Išraiškų taisyklės

- Nuoroda į ankstesnius mazgus: `$nodeName.text`, `$nodeName.body.field`
- Naudokite funkcijas: `$randomInt(1, 10)`, `$range(1, 5)`, `$now.format('HH:mm')`
- `$range(a,b)` neįtraukia b; `a > b` atveju grąžina klaidą.
- Tik viena `$` išraiškos pradžioje—niekada viduje skliaustų
- Pasiekite išvestį pagal raktą: `$setNode.randomNumber`, `$setNode.text`

## Pavyzdys

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

Žemiau esantys mazgai pasiekia per `$transformData.text`, `$transformData.firstChar`, `$transformData.randomNum`, `$transformData.rangeArr`.

## Susiję

- [JSON output mapper](./json-output-mapper-node.md) – Tos pačios žemėlapio poros; vienintelis terminalas grąžina šaknies JSON webhooks/vykdymams
- [Node Types](../reference/node-types.md) – Visų mazgų tipų apžvalga
- [Execute Node](./execute-node.md) – Iškvieskite workflows (ne duomenų transformacijai)
- [Expression DSL](../reference/expression-dsl.md) – Funkcijos ir sintaksė
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Išplečiamas redaktorius su gyvu backend peržiūra ir Prev/Next žemėlapiams
