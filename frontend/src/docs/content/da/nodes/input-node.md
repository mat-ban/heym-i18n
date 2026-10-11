# Input

**Input**-noden er startpunktet for workflows, der modtager data fra brugeren eller API-kaldere. Den understøtter enten enkelt- eller flerfeltsinput og eksponerer request-metadata (headers, query-parametre).

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 0 |
| Outputs | 1 |
| Output | `$nodeLabel.body.fieldKey`, `$nodeLabel.headers`, `$nodeLabel.query` |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `label` | string | Node-identifikator (camelCase) |
| `value` | string | Standardværdi for enkelt tekstinput (valgfri) |
| `inputFields` | array | Inputfeltdefinitioner. Hvert: `{ key, defaultValue? }` |

### Inputfelter

| Felt | Type | Beskrivelse |
|-------|------|-------------|
| `key` | string | Feltnøgle (f.eks. `text`, `imageUrl`, `base64`) |
| `defaultValue` | string | Standardværdi hvis ikke angivet (valgfri) |

## Adgang til inputdata

**Body-felter** (altid brug `$nodeLabel.body.fieldKey`):

- `$userInput.body.text` – tekstfelt
- `$userInput.body.imageUrl` – billed-URL
- `$userInput.body.userId` – med standardværdi hvis konfigureret
- `$userInput.body.event.user.id` – indlejret JSON fra Generic webhook-tilstand

**Request-metadata** (ved kørsel via API):

- `$userInput.headers` – alle headers (nøgler i lowercase)
- `$userInput.headers.authorization` – specifik header
- `$userInput.query` – query-parametre
- `$userInput.query.param1` – specifik query-param

## Filinput i Run-panel

I editorens **Run**-fanen (Defined webhook-tilstand) understøttes der for hvert inputfelt både drag-and-drop og en inline-tilføjelseskontrol (nederst til højre i feltet):

- **Tekstfiler** (`.txt`, `.md`, `.json`, `.csv` og lignende) læses som ren tekst.
- **Billeder** (JPEG, PNG, GIF, WebP) gemmes som en `data:`-URL (base64) i feltværdien – brug feltnøgler som `imageUrl` eller `base64` når efterfølgende noder forventer billeddata.
- **PDF**-filer konverteres til ekstraheret tekst (maks 5 MB fil, 100.000 tegn indhold).

Én fil pr. felt. Det er muligt at redigere tekstområdet efter en fil er indlæst. Generic webhook-tilstand (rå JSON-body) viser ikke filkontroller pr. felt.

## Inputfelter vs Generic Webhooks

`inputFields` beskriver stadig forventede inputs for definerede editorformularer, under-workflow-mapping og andre metadata-drevne overflader.

Når et workflow bruger **Generic** webhook-body-tilstand, omformes den indkommende HTTP-body ikke fra `inputFields`. I stedet sendes den rå JSON-payload direkte til `$nodeLabel.body`, og Input-nodens felt-tilføjelses-/fjernelseskontroller skjules i node-panelet.

## Eksempler

**Enkelt input (standard):**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [{ "key": "text" }]
  }
}
```

**Flere inputs:**

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

## Relateret

- [Nodetyper](../reference/node-types.md) – Oversigt over alle nodetyper
- [Triggers](../reference/triggers.md) – Startpunkter (Input, Cron, RabbitMQ)
- [Expression DSL](../reference/expression-dsl.md) – Referering af `$nodeLabel.body`, `$nodeLabel.query`
- [Portal](../reference/portal.md) – Eksponer workflows som chat-brugergrænseflader
- [Webhooks](../reference/webhooks.md) – HTTP-trigger til workflows
