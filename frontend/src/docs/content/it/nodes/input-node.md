# Nodo **Input**

Il nodo **Input** è il punto di ingresso per i workflow che ricevono dati dall'utente o dal chiamante API. Supporta campi di input singoli o multipli ed espone i metadati della richiesta (headers, query params).

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 0 |
| Output | 1 |
| Output | `$nodeLabel.body.fieldKey`, `$nodeLabel.headers`, `$nodeLabel.query` |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `label` | string | Identificatore del nodo (camelCase) |
| `value` | string | Valore predefinito per input di testo singolo (opzionale) |
| `inputFields` | array | Definizioni dei campi di input. Ciascuna: `{ key, defaultValue? }` |

### Campi di Input

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `key` | string | Chiave del campo (es. `text`, `imageUrl`, `base64`) |
| `defaultValue` | string | Valore predefinito se non fornito (opzionale) |

## Accesso ai Dati di Input

**Campi del body** (utilizzare sempre `$nodeLabel.body.fieldKey`):

- `$userInput.body.text` – campo di testo
- `$userInput.body.imageUrl` – URL dell'immagine
- `$userInput.body.userId` – con valore predefinito se configurato
- `$userInput.body.event.user.id` – JSON annidato dalla modalità Generic webhook

**Metadati della richiesta** (quando eseguito tramite API):

- `$userInput.headers` – tutti gli headers (chiavi in minuscolo)
- `$userInput.headers.authorization` – header specifico
- `$userInput.query` – parametri di query
- `$userInput.query.param1` – parametro di query specifico

## Input di File nel Pannello Run

Nella scheda **Run** dell'editor (modalità Defined webhook), ciascun campo di input supporta il drag-and-drop e un controllo di allegato inline (in basso a destra del campo):

- **File di testo** (`.txt`, `.md`, `.json`, `.csv` e simili) vengono letti come testo semplice.
- **Immagini** (JPEG, PNG, GIF, WebP) vengono memorizzate come URL `data:` (base64) nel valore del campo — utilizzare chiavi di campo quali `imageUrl` o `base64` quando i nodi a valle si aspettano dati immagine.
- **File PDF** vengono convertiti in testo estratto (file massimo 5 MB, 100k caratteri di contenuto).

Un file per campo. È comunque possibile modificare la textarea dopo il caricamento di un file. La modalità Generic webhook (body JSON grezzo) non mostra i controlli file per singolo campo.

## Campi di Input e Webhook Generici

`inputFields` descrive comunque gli input attesi per i form dell'editor in modalità defined, la mappatura dei sub-workflow e altre superfici guidate dai metadati.

Quando un workflow utilizza la modalità body **Generic** webhook, il body HTTP in ingresso non viene rimodellato a partire da `inputFields`. Il payload JSON grezzo viene invece passato direttamente a `$nodeLabel.body`, e i controlli di aggiunta/rimozione dei campi del nodo Input vengono nascosti nel pannello del nodo.

## Esempi

**Input singolo (predefinito):**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [{ "key": "text" }]
  }
}
```

**Input multipli:**

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

## Correlati

- [Node Types](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Triggers](../reference/triggers.md) – Punti di ingresso (Input, Cron, RabbitMQ)
- [Expression DSL](../reference/expression-dsl.md) – Riferimenti a `$nodeLabel.body`, `$nodeLabel.query`
- [Portal](../reference/portal.md) – Esporre i workflow come chat UI
- [Webhooks](../reference/webhooks.md) – Trigger HTTP per i workflow