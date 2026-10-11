# JSON išvesties žemėlapis

**JSON išvesties žemėlapio** mazgas sukuria JSON objektą iš raktų/vertės [žemėlapių](./set-node.md) (tas pats modelis kaip [Set](./set-node.md)). Naudokite jį, kai skambintojai turėtų gauti **paprastą JSON kūną** atsakymo šaknyje.

## Apžvalga

| Ypatybė | Vertė |
|----------|-------|
| Įvestys | 1 |
| Išvestys | 0 (sankaupa) |
| Vykdymo išvestis | Objektas, sukurtas iš `mappings` |

## Parametrai

| Parametras | Tipas | Aprašymas |
|-----------|------|-------------|
| `label` | string | Mazgo identifikatorius (camelCase) |
| `mappings` | array | `{ "key": "fieldName", "value": "expression" }` įrašai (tas pats kaip Set) |

## Agentų įrankių naudojimas

Nepalaikoma. Šis mazgas yra terminalinė sankaupa, todėl jo negalima prijungti prie [Agent Node](./agent-node.md) įrankių rankenos. Naudokite [Set](./set-node.md) mazgą, kai agentui reikia formuoti vertes pokalbio metu.

## Webhook ir vykdymo elgsena

Kai šis mazgas yra **vienintelis** terminalinis išvesties mazgas darbo eigoje, vykdymo **išvestys** yra pats žemėlapis: raktai iš `mappings` pasirodo **aukščiausiame** JSON lygyje. Nėra **išorinio** apvalkalo, kurio raktas yra mazgo etiketė, ir **nėra** `{ "result": ... }` objekto (skirtingai nei [Output](./output-node.md) mazgas).

Jei keli terminaliniai mazgai generuoja išvestis (pavyzdžiui, [Output](./output-node.md) plius JSON išvesties žemėlapis arba keli šakos), Heym naudoja įprastą struktūrą: kiekvienas terminalas yra raktas pagal savo `label`.

## Ciklo apribojimas

Ta pati taisyklė kaip [Output](./output-node.md): neįdėkite šio mazgo į ciklo iteracijos šaką—tik po ciklo `done` šakos. Žr. [Loop](./loop-node.md).

## Pavyzdys

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

## Susiję

- [Set](./set-node.md) – Tas pats žemėlapio mechanizmas tarpinėms transformacijoms
- [Output](./output-node.md) – Žinutė arba schemos pagrindu su `result` apvalkalu
- [Node Types](../reference/node-types.md) – Visi mazgų tipai
- [Workflow Structure](../reference/workflow-structure.md) – JSON darbo eigos formatas
- [Webhooks](../reference/webhooks.md) – Vykdyti endpoint ir atsakymus
