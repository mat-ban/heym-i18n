# Output

Nodul **Output** este punctul final al workflow-ului care returnează răspunsul către apelant. Referiți întotdeauna nodul anterior prin etichetă—nu utilizați niciodată `$input`.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 (opțional, pentru post-procesare asincronă) |
| Ieșire | Returnează `message` către apelant |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `label` | string | Identificatorul nodului (camelCase) |
| `message` | expression | Valoarea de ieșire. **Trebuie** să refere nodul anterior: `$previousNodeLabel.field` |
| `allowDownstream` | boolean | Dacă este true, nodurile de după output rulează asincron după ce răspunsul este trimis |

## Utilizarea ca instrument de agent

Când un nod Output este conectat la un [Nod Agent](./agent-node.md) ca instrument de tip nod pe canvas, câmpul `message` poate fi marcat ca **furnizat de agent** cu pictograma bot. Agentul furnizează apoi mesajul atunci când apelează instrumentul. Dacă nodul Output nu este conectat ca instrument de agent, pictograma bot este ascunsă.

## Regulă critică

**Nu utilizați niciodată `$input` în nodul de output.** Utilizați întotdeauna eticheta nodului anterior:

- ❌ `"message": "$input.text"`
- ✅ `"message": "$processData.text"` (unde `processData` este eticheta nodului anterior)

## Post-procesare asincronă

Când `allowDownstream: true`, răspunsul este returnat imediat. Nodurile conectate după output rulează în fundal (de exemplu, notificări Slack, logging). Deoarece coada din aval se poate termina mai târziu, o eroare în aval poate schimba starea înregistrată a execuției în `error` după ce răspunsul timpuriu a fost deja returnat; istoricul final și analizele reflectă acel rezultat ulterior.

## Exemplu

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text"
  }
}
```

## Exemplu – Cu asincron

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

Apoi conectați un nod [Telegram](./telegram-node.md), [Slack](./slack-node.md) sau alt nod după output pentru notificări de tip fire-and-forget.

## Resurse conexe

- [Mapator de output JSON](./json-output-mapper-node.md) – Corp JSON rădăcină fără învelișul `result` atunci când este singurul terminal
- [Tipuri de noduri](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [DSL de expresii](../reference/expression-dsl.md) – Referirea ieșirii unui nod
- [Dialogul de evaluare a expresiilor](../reference/expression-evaluation-dialog.md) – Editor extensibil cu previzualizare live în backend pentru message
- [Structura workflow-ului](../reference/workflow-structure.md) – Format JSON
