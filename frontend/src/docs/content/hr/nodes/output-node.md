# Output

**Output** čvor je završna točka workflowa koja vraća odgovor pozivatelju. Uvijek referencirajte prethodni čvor putem oznake—nikada ne koristite `$input`.

## Pregled

| Svojstvo | Vrijednost |
|----------|-------|
| Ulazi | 1 |
| Izlazi | 1 (opcionalno, za asinkronu naknadnu obradu) |
| Izlaz | Vraća `message` pozivatelju |

## Parametri

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `label` | string | Identifikator čvora (camelCase) |
| `message` | expression | Izlazna vrijednost. **Mora** referencirati prethodni čvor: `$previousNodeLabel.field` |
| `allowDownstream` | boolean | Ako je true, čvorovi nakon outputa izvršavaju se asinkrono nakon što je odgovor poslan |

## Korištenje kao agent alat

Kada je Output čvor povezan s [Agent Node](./agent-node.md) kao alat na platnu, polje `message` može se označiti kao **agent-provided** pomoću ikone bota. Agent tada dostavlja poruku kada pozove alat. Ako Output čvor nije povezan kao agent alat, ikona bota je skrivena.

## Kritično pravilo

**Nikada ne koristite `$input` u output čvoru.** Uvijek koristite oznaku prethodnog čvora:

- ❌ `"message": "$input.text"`
- ✅ `"message": "$processData.text"` (gdje je `processData` oznaka prethodnog čvora)

## Asinkrona naknadna obrada

Kada je `allowDownstream: true`, odgovor se vraća odmah. Čvorovi povezani nakon outputa izvršavaju se u pozadini (npr. Slack obavijesti, bilježenje). Budući da naknadni dio može završiti kasnije, greška u naknadnom dijelu može promijeniti zabilježeni status izvršavanja u `error` nakon što je rani odgovor već vraćen; konačna povijest i analitika odražavaju taj kasniji ishod.

## Primjer

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text"
  }
}
```

## Primjer – s asinkronim izvršavanjem

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

Zatim povežite [Telegram](./telegram-node.md), [Slack](./slack-node.md) ili drugi čvor nakon outputa za obavijesti bez čekanja na potvrdu.

## Povezano

- [JSON output mapper](./json-output-mapper-node.md) – Root JSON tijelo bez `result` omota kada je jedini završni čvor
- [Node Types](../reference/node-types.md) – Pregled svih tipova čvorova
- [Expression DSL](../reference/expression-dsl.md) – Referenciranje izlaza čvora
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Proširivi editor s pregledom uživo na backendu za message
- [Workflow Structure](../reference/workflow-structure.md) – JSON format
