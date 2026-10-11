# Vstup

Uzol **Vstup** je vstupným bodom pre workflowy, ktoré prijímajú dáta od používateľa alebo volajúceho API. Podporuje jedno alebo viac vstupných polí a sprístupňuje metadata požiadavky (hlavičky, query parametre).

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 0 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.body.fieldKey`, `$nodeLabel.headers`, `$nodeLabel.query` |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzla (camelCase) |
| `value` | string | Predvolená hodnota pre jeden textový vstup (voliteľné) |
| `inputFields` | array | Definície vstupných polí. Každé: `{ key, defaultValue? }` |

### Vstupné polia

| Pole | Typ | Popis |
|-------|------|-------------|
| `key` | string | Kľúč poľa (napr. `text`, `imageUrl`, `base64`) |
| `defaultValue` | string | Predvolená hodnota, ak nie je poskytnutá (voliteľné) |

## Prístup k vstupným dátam

**Polia tela** (vždy používajte `$nodeLabel.body.fieldKey`):

- `$userInput.body.text` – textové pole
- `$userInput.body.imageUrl` – URL obrázka
- `$userInput.body.userId` – s predvolenou hodnotou, ak je nakonfigurovaná
- `$userInput.body.event.user.id` – vnorený JSON z režimu Generic webhook

**Metadata požiadavky** (pri spustení cez API):

- `$userInput.headers` – všetky hlavičky (kľúče malými písmenami)
- `$userInput.headers.authorization` – konkrétna hlavička
- `$userInput.query` – query parametre
- `$userInput.query.param1` – konkrétny query parameter

## Vstup súboru v paneli Run

V editore na karte **Run** (režim Defined webhook) každé vstupné pole podporuje drag-and-drop a inline ovládací prvok pre prílohu (v pravom dolnom rohu poľa):

- **Textové súbory** (`.txt`, `.md`, `.json`, `.csv` a podobné) sa načítajú ako čistý text.
- **Obrázky** (JPEG, PNG, GIF, WebP) sa uložia ako `data:` URL (base64) do hodnoty poľa — použite kľúče polí ako `imageUrl` alebo `base64`, ak následné uzly očakávajú obrazové dáta.
- **PDF** súbory sa konvertujú na extrahovaný text (max. 5 MB súbor, 100 000 znakov obsahu).

Jeden súbor na pole. Textové pole môžete po načítaní súboru stále upravovať. Režim Generic webhook (surové JSON telo) nezobrazuje ovládacie prvky pre súbory jednotlivých polí.

## Vstupné polia vs Generic webhooky

`inputFields` stále opisujú očakávané vstupy pre formuláre editora v režime defined, mapovanie pod-workflowov a ďalšie povrchy riadené metadátami.

Keď workflow používa režim tela **Generic** webhook, prichádzajúce HTTP telo sa nepretvára podľa `inputFields`. Namiesto toho sa surový JSON payload prenesie do `$nodeLabel.body` a ovládacie prvky pre pridanie/odstránenie polí uzla Vstup sa v paneli uzla skryjú.

## Príklady

**Jeden vstup (predvolené):**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [{ "key": "text" }]
  }
}
```

**Viacero vstupov:**

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

## Súvisiace

- [Typy uzlov](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Triggers](../reference/triggers.md) – Vstupné body (Vstup, Cron, RabbitMQ)
- [Expression DSL](../reference/expression-dsl.md) – Odkazovanie na `$nodeLabel.body`, `$nodeLabel.query`
- [Portál](../reference/portal.md) – Sprístupnenie workflowov ako chat rozhraní
- [Webhooky](../reference/webhooks.md) – HTTP trigger pre workflowy
