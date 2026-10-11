# Input

El node **Input** és el punt d'entrada per als workflows que reben dades de l'usuari o de qui crida l'API. Admet un o diversos camps d'entrada i exposa les metadades de la petició (headers, query params).

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 0 |
| Sortides | 1 |
| Sortida | `$nodeLabel.body.fieldKey`, `$nodeLabel.headers`, `$nodeLabel.query` |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `label` | string | Identificador del node (camelCase) |
| `value` | string | Valor per defecte per a una entrada de text única (opcional) |
| `inputFields` | array | Definicions dels camps d'entrada. Cadascun: `{ key, defaultValue? }` |

### Camps d'entrada

| Camp | Tipus | Descripció |
|-------|------|-------------|
| `key` | string | Clau del camp (p. ex. `text`, `imageUrl`, `base64`) |
| `defaultValue` | string | Valor per defecte si no es proporciona (opcional) |

## Accés a les dades d'entrada

**Camps del body** (utilitzeu sempre `$nodeLabel.body.fieldKey`):

- `$userInput.body.text` – camp de text
- `$userInput.body.imageUrl` – URL d'imatge
- `$userInput.body.userId` – amb valor per defecte si s'ha configurat
- `$userInput.body.event.user.id` – JSON imbricat del mode Generic webhook

**Metadades de la petició** (quan s'executa via API):

- `$userInput.headers` – tots els headers (claus en minúscules)
- `$userInput.headers.authorization` – header concret
- `$userInput.query` – paràmetres de query
- `$userInput.query.param1` – paràmetre de query concret

## Entrada de fitxers al Run Panel

A la pestanya **Run** de l'editor (mode Defined webhook), cada camp d'entrada admet arrossegar i deixar anar fitxers, així com un control d'adjunció integrat (a la part inferior dreta del camp):

- Els **fitxers de text** (`.txt`, `.md`, `.json`, `.csv` i similars) es llegeixen com a text pla.
- Les **imatges** (JPEG, PNG, GIF, WebP) s'emmagatzemen com a URL `data:` (base64) al valor del camp — utilitzeu claus de camp com ara `imageUrl` o `base64` quan els nodes posteriors esperin dades d'imatge.
- Els fitxers **PDF** es converteixen a text extret (fitxer de màxim 5 MB, 100k caràcters de contingut).

Un fitxer per camp. Podeu seguir editant l'àrea de text després de carregar un fitxer. El mode Generic webhook (body JSON en cru) no mostra controls de fitxer per camp.

## Camps d'entrada vs Generic Webhooks

Els `inputFields` encara descriuen les entrades esperades per als formularis de l'editor en mode definit, el mapatge de sub-workflows i altres superfícies basades en metadades.

Quan un workflow utilitza el mode de body **Generic** webhook, el body HTTP entrant no es remodela a partir dels `inputFields`. En el seu lloc, el payload JSON en cru es passa directament a `$nodeLabel.body`, i els controls per afegir o eliminar camps del node Input queden ocults al panell del node.

## Exemples

**Entrada única (per defecte):**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [{ "key": "text" }]
  }
}
```

**Entrades múltiples:**

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

## Relacionat

- [Node Types](../reference/node-types.md) – Visió general de tots els tipus de node
- [Triggers](../reference/triggers.md) – Punts d'entrada (Input, Cron, RabbitMQ)
- [Expression DSL](../reference/expression-dsl.md) – Referència a `$nodeLabel.body`, `$nodeLabel.query`
- [Portal](../reference/portal.md) – Exposeu workflows com a interfícies de Chat
- [Webhooks](../reference/webhooks.md) – Trigger HTTP per a workflows