# Výstup

Uzol **Výstup** je koncovým bodom workflowu, ktorý vracia odpoveď volajúcemu. Vždy odkazujte na predchádzajúci uzol prostredníctvom jeho označenia (label) – nikdy nepoužívajte `$input`.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 (voliteľný, pre asynchrónne následné spracovanie) |
| Výstup | Vracia `message` volajúcemu |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzla (camelCase) |
| `message` | expression | Výstupná hodnota. **Musí** odkazovať na predchádzajúci uzol: `$previousNodeLabel.field` |
| `allowDownstream` | boolean | Ak je true, uzly za výstupom sa spustia asynchrónne po odoslaní odpovede |

## Použitie ako nástroj agenta

Keď je uzol Výstup pripojený k [uzlu Agent](./agent-node.md) ako nástroj na plátne, pole `message` môže byť označené ako **poskytnuté agentom** pomocou ikony robota. Agent potom poskytne správu, keď zavolá nástroj. Ak uzol Výstup nie je pripojený ako nástroj agenta, ikona robota je skrytá.

## Kritické pravidlo

**Nikdy nepoužívajte `$input` v uzle výstupu.** Vždy použite označenie predchádzajúceho uzla:

- ❌ `"message": "$input.text"`
- ✅ `"message": "$processData.text"` (kde `processData` je označenie predchádzajúceho uzla)

## Asynchrónne následné spracovanie

Keď je `allowDownstream: true`, odpoveď sa vráti okamžite. Uzly pripojené za výstupom sa spúšťajú na pozadí (napr. Slack notifikácie, logovanie). Keďže následný reťazec sa môže dokončiť neskôr, zlyhanie v následnom reťazci môže zmeniť zaznamenaný stav spustenia na `error` po tom, čo už bola skorá odpoveď vrátená; konečná história a analytika odrážajú tento neskorší výsledok.

## Príklad

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text"
  }
}
```

## Príklad – s asynchrónnym spracovaním

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

Potom pripojte [Telegram](./telegram-node.md), [Slack](./slack-node.md) alebo iný uzol za výstup pre notifikácie typu fire-and-forget.

## Súvisiace

- [JSON output mapper](./json-output-mapper-node.md) – Koreňové JSON telo bez obalenia `result`, keď je jediným koncovým uzlom
- [Typy uzlov](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Expression DSL](../reference/expression-dsl.md) – Odkazovanie na výstup uzla
- [Dialóg vyhodnotenia výrazu](../reference/expression-evaluation-dialog.md) – Rozbaliteľný editor s živým náhľadom backendu pre message
- [Štruktúra workflowu](../reference/workflow-structure.md) – Formát JSON
