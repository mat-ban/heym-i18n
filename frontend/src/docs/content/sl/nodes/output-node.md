# Izhod

Vozlišče **Izhod** je končna točka workflow, ki vrne odgovor klicatelju. Vedno se sklicujte na prejšnje vozlišče z oznako—nikoli ne uporabljajte `$input`.

## Pregled

| Lastnost | Vrednost |
|----------|----------|
| Vhodi | 1 |
| Izhodi | 1 (neobvezno, za asinhrono obdelavo) |
| Izhod | Vrne `message` klicatelju |

## Parametri

| Parameter | Tip | Opis |
|-----------|-----|------|
| `label` | niz | Identifikator vozlišča (camelCase) |
| `message` | izraz | Izhodna vrednost. **Mora** se sklicevati na prejšnje vozlišče: `$previousNodeLabel.field` |
| `allowDownstream` | boolean | Če je true, se vozlišča po izhodu izvajajo asinhrono po pošiljanju odgovora |

## Uporaba orodij agenta

Ko je vozlišče Izhod povezano z [Vozliščem agenta](./agent-node.md) kot orodje na platnu, se lahko polje `message` označi kot **zagotovljeno s strani agenta** z ikono bota. Agent nato zagotovi sporočilo, ko pokliče orodje. Če vozlišče Izhod ni povezano kot orodje agenta, je ikona bota skrita.

## Kritično pravilo

**Nikoli ne uporabljajte `$input` v vozlišču izhod.** Vedno uporabite oznako prejšnjega vozlišča:

- ❌ `"message": "$input.text"`
- ✅ `"message": "$processData.text"` (kjer je `processData` oznaka prejšnjega vozlišča)

## Asinhrona obdelava pošiljanja

Ko je `allowDownstream: true`, se odgovor vrne takoj. Vozlišča, povezana po izhodu, se izvajajo v ozadju (npr. obvestila Slack, beleženje). Ker se lahko spodnji rep zaključi kasneje, lahko spodnja napaka spremeni zabeležen status izvajanja v `error` po tem, ko je bil zgodnji odgovor že vrnjen; končna zgodovina in analitika odražata ta kasnejši izid.

## Primer

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text"
  }
}
```

## Primer – Z asinhrono obdelavo

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

Nato povežite [Telegram](./telegram-node.md), [Slack](./slack-node.md) ali drugo vozlišče po izhodu za obvestila "fire-and-forget".

## Sorodno

- [JSON mapper za izhod](./json-output-mapper-node.md) – Osnovno telo JSON brez ovijanja `result`, ko je edini terminal
- [Tipi vozlišč](../reference/node-types.md) – Pregled vseh tipov vozlišč
- [Expression DSL](../reference/expression-dsl.md) – Sklicevanje na izhod vozlišča
- [Dialog za vrednotenje izrazov](../reference/expression-evaluation-dialog.md) – Razširljiv urejevalnik z vnaprejšnjim ogledom v živo za sporočilo
- [Struktura workflow](../reference/workflow-structure.md) – JSON format
