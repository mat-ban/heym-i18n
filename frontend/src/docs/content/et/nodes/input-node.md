# **Input**

**Input** node on workflow'de sisenemispunkt, mis võtavad vastu andmeid kasutajalt või API kutsujalt. See toetab üksikuid või mitut sisendvälja ning avalikustab päringu metaandmed (headers, query params).

## Ülevaade

| Property | Value |
|----------|-------|
| Inputs | 0 |
| Outputs | 1 |
| Output | `$nodeLabel.body.fieldKey`, `$nodeLabel.headers`, `$nodeLabel.query` |

## Parameetrid

| Parameter | Type | Description |
|-----------|------|-------------|
| `label` | string | Node identifier (camelCase) |
| `value` | string | Default value for single text input (optional) |
| `inputFields` | array | Input field definitions. Each: `{ key, defaultValue? }` |

### Sisendväljad

| Field | Type | Description |
|-------|------|-------------|
| `key` | string | Field key (e.g. `text`, `imageUrl`, `base64`) |
| `defaultValue` | string | Default if not provided (optional) |

## Sisendandmetele juurdepääs

**Body väljad** (kasutage alati `$nodeLabel.body.fieldKey`):

- `$userInput.body.text` – tekstiväli
- `$userInput.body.imageUrl` – pildi URL
- `$userInput.body.userId` – vaikeväärtusega, kui see on konfigureeritud
- `$userInput.body.event.user.id` – pesastatud JSON Generic webhook režiimist

**Päringu metaandmed** (API kaudu käivitamisel):

- `$userInput.headers` – kõik headers (võtmed väiketähtedega)
- `$userInput.headers.authorization` – konkreetne header
- `$userInput.query` – query parameetrid
- `$userInput.query.param1` – konkreetne query param

## Run-paneeli failisisestus

Redaktori **Run** vahekaardil (Defined webhook režiim) toetab iga sisendväli lohistamist ja teksti sees olevat manuse juhtelementi (välja alumises paremas nurgas):

- **Tekstifailid** (`.txt`, `.md`, `.json`, `.csv` ja sarnased) loetakse lihttekstina.
- **Pildid** (JPEG, PNG, GIF, WebP) salvestatakse välja väärtusesse `data:` URL-ina (base64) — kasutage välja võtmeid nagu `imageUrl` või `base64`, kui allavoolu node'id ootavad pildiandmeid.
- **PDF** failid teisendatakse eraldatud tekstiks (fail max 5 MB, sisu 100k tähemärki).

Üks fail välja kohta. Pärast faili laadimist saate tekstiala siiski muuta. Generic webhook režiim (töötlemata JSON body) ei näita väljapõhiseid failijuhtelemente.

## Sisendväljad vs Generic webhookid

`inputFields` kirjeldavad endiselt oodatavaid sisendeid defined-režiimi redaktori vormide, sub-workflow'de vastendamise ja muude metaandmetel põhinevate pindade jaoks.

Kui workflow kasutab **Generic** webhook body režiimi, ei kujundata sissetulevat HTTP body't `inputFields`-i põhjal ümber. Selle asemel edastatakse töötlemata JSON payload otse `$nodeLabel.body`-le ning Input node'i väljade lisamise/eemaldamise juhtelemendid on node'i paneelis peidetud.

## Näited

**Üksiksisend (vaikimisi):**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [{ "key": "text" }]
  }
}
```

**Mitu sisendit:**

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

## Seotud

- [Node Types](../reference/node-types.md) – Ülevaade kõigist node'i tüüpidest
- [Triggers](../reference/triggers.md) – Sisenemispunktid (Input, Cron, RabbitMQ)
- [Expression DSL](../reference/expression-dsl.md) – Viitamine `$nodeLabel.body`, `$nodeLabel.query`
- [Portal](../reference/portal.md) – Workflow'de avalikustamine chat UI-dena
- [Webhooks](../reference/webhooks.md) – HTTP trigger workflow'dele
