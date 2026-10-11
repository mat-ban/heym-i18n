# Väljund

**Väljund** (Output) node on workflow' lõpp-punkt, mis tagastab vastuse kutsujale. Viidake alati eelmisele node'ile sildi (label) kaudu—ärge kunagi kasutage `$input`.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 1 (valikuline, asünkroonse järeltöötluse jaoks) |
| Väljund | Tagastab `message` kutsujale |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `label` | string | Node'i identifikaator (camelCase) |
| `message` | expression | Väljundi väärtus. **Peab** viitama eelmisele node'ile: `$previousNodeLabel.field` |
| `allowDownstream` | boolean | Kui true, käivituvad node'id pärast väljundit asünkroonselt pärast vastuse saatmist |

## Agendi tööriista kasutamine

Kui Väljund node on ühendatud [Agendi Node'iga](./agent-node.md) lõuendi node'i tööriistana, saab `message` välja märkida kui **agendi poolt esitatud** boti ikooniga. Seejärel esitab agent sõnumi, kui ta tööriista kutsub. Kui Väljund node ei ole ühendatud agendi tööriistana, on boti ikoon peidetud.

## Kriitiline reegel

**Ärge kunagi kasutage `$input` väljundi node'is.** Kasutage alati eelmise node'i silti:

- ❌ `"message": "$input.text"`
- ✅ `"message": "$processData.text"` (kus `processData` on eelmise node'i silt)

## Asünkroonne järeltöötlus

Kui `allowDownstream: true`, tagastatakse vastus koheselt. Node'id, mis on ühendatud pärast väljundit, käivituvad taustal (nt Slacki teavitused, logimine). Kuna allavoolu saba võib hiljem lõppeda, võib allavoolu tõrge muuta salvestatud käivituse oleku `error`-iks pärast seda, kui varajane vastus on juba tagastatud; lõplik ajalugu ja analüütika kajastavad seda hilisemat tulemust.

## Näide

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text"
  }
}
```

## Näide – asünkroonsega

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text",
    "allowDownstream": true
  }
}
```

Seejärel ühendage [Telegram](./telegram-node.md), [Slack](./slack-node.md) või muu node pärast väljundit tule-ja-unusta teavituste jaoks.

## Seotud

- [JSON-väljundi mapper](./json-output-mapper-node.md) – Juur-JSON keha ilma `result` mähiseta, kui ainus lõpp-punkt
- [Node'i tüübid](../reference/node-types.md) – Ülevaade kõigist node'i tüüpidest
- [Avaldise DSL](../reference/expression-dsl.md) – Node'i väljundile viitamine
- [Avaldise hindamise dialoog](../reference/expression-evaluation-dialog.md) – Laiendatav redaktor koos reaalajas backend'i eelvaatega sõnumi jaoks
- [Workflow struktuur](../reference/workflow-structure.md) – JSON-formaat
