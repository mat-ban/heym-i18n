# Vstupní uzel

**Vstupní uzel** je vstupním bodem pro workflow, které přijímají data od uživatele nebo volajícího API. Podporuje jedno nebo více vstupních polí a zpřístupňuje metadata požadavku (hlavičky, query parametry).

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 0 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.body.fieldKey`, `$nodeLabel.headers`, `$nodeLabel.query` |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzlu (camelCase) |
| `value` | string | Výchozí hodnota pro jeden textový vstup (volitelné) |
| `inputFields` | array | Definice vstupních polí. Každé: `{ key, defaultValue? }` |

### Vstupní pole

| Pole | Typ | Popis |
|-------|------|-------------|
| `key` | string | Klíč pole (např. `text`, `imageUrl`, `base64`) |
| `defaultValue` | string | Výchozí hodnota, pokud není poskytnuta (volitelné) |

## Přístup ke vstupním datům

**Pole v body** (vždy používejte `$nodeLabel.body.fieldKey`):

- `$userInput.body.text` – textové pole
- `$userInput.body.imageUrl` – URL obrázku
- `$userInput.body.userId` – s výchozí hodnotou, pokud je nakonfigurována
- `$userInput.body.event.user.id` – vnořený JSON z režimu Generic webhook

**Metadata požadavku** (při spuštění přes API):

- `$userInput.headers` – všechny hlavičky (klíče malými písmeny)
- `$userInput.headers.authorization` – konkrétní hlavička
- `$userInput.query` – query parametry
- `$userInput.query.param1` – konkrétní query parametr

## Vstup souboru v panelu Run

V záložce **Run** v editoru (režim Defined webhook) podporuje každé vstupní pole drag-and-drop a inline ovládací prvek pro přílohu (v pravém dolním rohu pole):

- **Textové soubory** (`.txt`, `.md`, `.json`, `.csv` a podobné) se načítají jako prostý text.
- **Obrázky** (JPEG, PNG, GIF, WebP) se ukládají jako `data:` URL (base64) do hodnoty pole — použijte klíče polí jako `imageUrl` nebo `base64`, pokud následné uzly očekávají obrazová data.
- **PDF** soubory se převádějí na extrahovaný text (max. 5 MB soubor, 100k znaků obsahu).

Jeden soubor na pole. Textové pole můžete po načtení souboru stále upravovat. Režim Generic webhook (raw JSON body) nezobrazuje ovládací prvky pro soubory u jednotlivých polí.

## Vstupní pole vs Generic webhooky

`inputFields` stále popisují očekávané vstupy pro formuláře v editoru v režimu defined, mapování sub-workflow a další povrchy řízené metadaty.

Pokud workflow používá režim **Generic** webhook body, příchozí HTTP body se nepřetváří podle `inputFields`. Místo toho se raw JSON payload předává přímo do `$nodeLabel.body` a ovládací prvky pro přidání/odebrání polí vstupního uzlu jsou v panelu uzlu skryty.

## Příklady

**Jeden vstup (výchozí):**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [{ "key": "text" }]
  }
}
```

**Více vstupů:**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [
      { "key": "text" },
      { "key": "imageUrl" },
      { "key": "userId", "defaultValue": "anonymous" }
    ]
  }
}
```

## Související

- [Typy uzlů](../reference/node-types.md) – Přehled všech typů uzlů
- [Triggers](../reference/triggers.md) – Vstupní body (Input, Cron, RabbitMQ)
- [Expression DSL](../reference/expression-dsl.md) – Odkazování na `$nodeLabel.body`, `$nodeLabel.query`
- [Portal](../reference/portal.md) – Zpřístupnění workflow jako chat UI
- [Webhooks](../reference/webhooks.md) – HTTP trigger pro workflow
