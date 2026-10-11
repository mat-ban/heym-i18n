# JSON output mapper

**JSON output mapper** node koostab JSON-objekti võti/väärtus [mappings'ute](./set-node.md) põhjal (sama mudel nagu [Set](./set-node.md)). Kasutage seda, kui kutsujad peaksid saama **tavalise JSON-keha** vastuse juurtasemel.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 0 (sink) |
| Käitusaegne väljund | `mappings'ute` põhjal koostatud objekt |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `label` | string | Node'i identifikaator (camelCase) |
| `mappings` | array | `{ "key": "fieldName", "value": "expression" }` kirjed (samad nagu Set'il) |

## Agent tool'i kasutamine

Ei ole toetatud. See node on terminaalne sink, seega ei saa seda ühendada [Agent Node](./agent-node.md) tools handle'iga. Kasutage [Set](./set-node.md) node'i, kui agent peab väärtusi vestluse keskel kujundama.

## Webhooki ja käivituse käitumine

Kui see node on workflow **ainus** terminaalne väljund, on käivituse **outputs**'id kaardistatud objekt ise: `mappings'ute` võtmed ilmuvad JSON-i **ülemisele tasemele**. **Puudub** väline ümbrisvõti, mis oleks node'i label'iga tähistatud, ja **puudub** `{ "result": ... }` objekt (erinevalt [Output](./output-node.md) node'ist).

Kui mitu terminaalset node'i toodavad väljundeid (näiteks [Output](./output-node.md) pluss JSON output mapper või mitu haru), kasutab Heym tavalist kuju: iga terminaal on tähistatud oma `label`-iga.

## Loop'i piirang

Sama reegel nagu [Output](./output-node.md) puhul: ärge paigutage seda node'i loop'i iteratsiooniharule—ainult pärast loop'i `done` haru. Vt [Loop](./loop-node.md).

## Näide

```json
{
  "type": "jsonOutputMapper",
  "data": {
    "label": "apiPayload",
    "mappings": [
      { "key": "message", "value": "$llm.text" },
      { "key": "ok", "value": "true" }
    ]
  }
}
```

## Seotud

- [Set](./set-node.md) – Samad mapping'u mehhanismid vahepealsete teisenduste jaoks
- [Output](./output-node.md) – Sõnumi- või skeemipõhine vastus `result` ümbrisega
- [Node Types](../reference/node-types.md) – Kõik node'i tüübid
- [Workflow Structure](../reference/workflow-structure.md) – JSON workflow formaat
- [Webhooks](../reference/webhooks.md) – Execute endpoint ja vastused
