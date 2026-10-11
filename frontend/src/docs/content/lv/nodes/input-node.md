# Ievades mezgls

**Ievades** mezgls ir ieejas punkts workflow, kas saņem datus no lietotāja vai API izsaucēja. Tas atbalsta vienu vai vairākus ievades laukus un nodrošina piekļuvi pieprasījuma metadatiem (headers, query parametri).

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 0 |
| Izvades | 1 |
| Izvade | `$nodeLabel.body.fieldKey`, `$nodeLabel.headers`, `$nodeLabel.query` |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `label` | string | Mezglu identifikators (camelCase) |
| `value` | string | Noklusējuma vērtība vienam teksta ievades laukam (neobligāts) |
| `inputFields` | array | Ievades lauku definīcijas. Katrs: `{ key, defaultValue? }` |

### Ievades lauki

| Lauks | Tips | Apraksts |
|-------|------|-------------|
| `key` | string | Lauka atslēga (piem., `text`, `imageUrl`, `base64`) |
| `defaultValue` | string | Noklusējums, ja nav norādīts (neobligāts) |

## Piekļuve ievades datiem

**Body lauki** (vienmēr izmantojiet `$nodeLabel.body.fieldKey`):

- `$userInput.body.text` – teksta lauks
- `$userInput.body.imageUrl` – attēla URL
- `$userInput.body.userId` – ar noklusējumu, ja konfigurēts
- `$userInput.body.event.user.id` – ligzdots JSON no Generic webhook režīma

**Pieprasījuma metadati** (ja izpilde notiek caur API):

- `$userInput.headers` – visi headers (atslēgas ar mazajiem burtiem)
- `$userInput.headers.authorization` – konkrēts header
- `$userInput.query` – query parametri
- `$userInput.query.param1` – konkrēts query parametrs

## Failu ievade Run panelī

Redaktora cilnē **Run** (Defined webhook režīms) katrs ievades lauks atbalsta drag-and-drop un iekļautu pielikuma vadīklu (lauka apakšējā labajā stūrī):

- **Teksta faili** (`.txt`, `.md`, `.json`, `.csv` un līdzīgi) tiek nolasīti kā vienkāršs teksts.
- **Attēli** (JPEG, PNG, GIF, WebP) tiek saglabāti kā `data:` URL (base64) lauka vērtībā — izmantojiet lauku atslēgas, piemēram, `imageUrl` vai `base64`, ja lejupstraumes mezgli sagaida attēla datus.
- **PDF** faili tiek konvertēti uz izgūtu tekstu (maks. 5 MB fails, 100k rakstzīmju saturs).

Viens fails uz lauku. Pēc faila ielādes joprojām varat rediģēt teksta apgabalu. Generic webhook režīms (neapstrādāts JSON body) nerāda failu vadīklas katram laukam atsevišķi.

## Ievades lauki pret Generic webhooks

`inputFields` joprojām apraksta sagaidāmos ievades datus defined-mode redaktora formām, sub-workflow kartēšanai un citām uz metadatiem balstītām saskarnēm.

Ja workflow izmanto **Generic** webhook body režīmu, ienākošais HTTP body netiek pārveidots no `inputFields`. Tā vietā neapstrādātais JSON payload tiek nodots tieši uz `$nodeLabel.body`, un Ievades mezgla lauku pievienošanas/noņemšanas vadīklas tiek paslēptas mezgla panelī.

## Piemēri

**Viena ievade (noklusējums):**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [{ "key": "text" }]
  }
}
```

**Vairākas ievades:**

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

## Saistītais

- [Mezglu tipi](../reference/node-types.md) – Visu mezglu tipu pārskats
- [Triggers](../reference/triggers.md) – Ieejas punkti (Input, Cron, RabbitMQ)
- [Expression DSL](../reference/expression-dsl.md) – Atsauces uz `$nodeLabel.body`, `$nodeLabel.query`
- [Portāls](../reference/portal.md) – Workflow publiskošana kā chat saskarnes
- [Webhooks](../reference/webhooks.md) – HTTP trigger workflow izpildei
