# Output

Uzel **Output** je koncovým bodem workflow, který vrací odpověď volajícímu. Vždy odkazujte na předchozí uzel pomocí jeho labelu – nikdy nepoužívejte `$input`.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 (volitelný, pro asynchronní následné zpracování) |
| Výstup | Vrací `message` volajícímu |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzlu (camelCase) |
| `message` | expression | Výstupní hodnota. **Musí** odkazovat na předchozí uzel: `$previousNodeLabel.field` |
| `allowDownstream` | boolean | Pokud je true, uzly za outputem se spustí asynchronně po odeslání odpovědi |

## Použití jako nástroj agenta

Když je uzel Output připojen k [Agent Node](./agent-node.md) jako nástroj na canvasu, pole `message` lze označit jako **poskytované agentem** pomocí ikony robota. Agent pak při volání nástroje dodá zprávu. Pokud uzel Output není připojen jako nástroj agenta, ikona robota se skryje.

## Kritické pravidlo

**Nikdy nepoužívejte `$input` v uzlu output.** Vždy použijte label předchozího uzlu:

- ❌ `"message": "$input.text"`
- ✅ `"message": "$processData.text"` (kde `processData` je label předchozího uzlu)

## Asynchronní následné zpracování

Když je `allowDownstream: true`, odpověď se vrátí okamžitě. Uzly připojené za outputem běží na pozadí (např. Slack notifikace, logování). Protože downstream část může dokončit později, selhání downstreamu může změnit zaznamenaný stav spuštění na `error` poté, co již byla včasná odpověď vrácena; konečná historie a analytika odrážejí tento pozdější výsledek.

## Příklad

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text"
  }
}
```

## Příklad – s asynchronním zpracováním

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

Poté připojte za output uzel [Telegram](./telegram-node.md), [Slack](./slack-node.md) nebo jiný uzel pro notifikace typu fire-and-forget.

## Související

- [JSON output mapper](./json-output-mapper-node.md) – Kořenové JSON tělo bez obalení `result`, pokud je jediným koncovým uzlem
- [Node Types](../reference/node-types.md) – Přehled všech typů uzlů
- [Expression DSL](../reference/expression-dsl.md) – Odkazování na výstup uzlu
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Rozšiřitelný editor s živým náhledem backendu pro message
- [Workflow Structure](../reference/workflow-structure.md) – Formát JSON
