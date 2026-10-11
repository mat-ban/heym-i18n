# Nodo Input

El nodo **Input** es el punto de entrada para los workflows que reciben datos del usuario o del invocador de la API. Admite uno o varios campos de entrada y expone los metadatos de la solicitud (headers, query params).

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 0 |
| Salidas | 1 |
| Salida | `$nodeLabel.body.fieldKey`, `$nodeLabel.headers`, `$nodeLabel.query` |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `label` | string | Identificador del nodo (camelCase) |
| `value` | string | Valor predeterminado para una entrada de texto única (opcional) |
| `inputFields` | array | Definiciones de los campos de entrada. Cada una: `{ key, defaultValue? }` |

### Campos de entrada

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `key` | string | Clave del campo (p. ej. `text`, `imageUrl`, `base64`) |
| `defaultValue` | string | Valor predeterminado si no se proporciona (opcional) |

## Acceso a los datos de entrada

**Campos del body** (utilice siempre `$nodeLabel.body.fieldKey`):

- `$userInput.body.text` – campo de texto
- `$userInput.body.imageUrl` – URL de la imagen
- `$userInput.body.userId` – con valor predeterminado si está configurado
- `$userInput.body.event.user.id` – JSON anidado del modo Generic webhook

**Metadatos de la solicitud** (cuando se ejecuta mediante API):

- `$userInput.headers` – todos los headers (claves en minúsculas)
- `$userInput.headers.authorization` – header específico
- `$userInput.query` – parámetros de query
- `$userInput.query.param1` – parámetro de query específico

## Entrada de archivos en el panel Run

En la pestaña **Run** del editor (modo Defined webhook), cada campo de entrada admite arrastrar y soltar, así como un control de adjuntar archivo en línea (en la esquina inferior derecha del campo):

- **Archivos de texto** (`.txt`, `.md`, `.json`, `.csv` y similares) se leen como texto sin formato.
- **Imágenes** (JPEG, PNG, GIF, WebP) se almacenan como una URL `data:` (base64) en el valor del campo; utilice claves de campo como `imageUrl` o `base64` cuando los nodos posteriores esperen datos de imagen.
- **Archivos PDF** se convierten a texto extraído (archivo de máx. 5 MB, 100 000 caracteres de contenido).

Un archivo por campo. Puede seguir editando el área de texto después de cargar un archivo. El modo Generic webhook (body JSON sin procesar) no muestra controles de archivo por campo.

## Campos de entrada frente a Generic webhooks

`inputFields` sigue describiendo las entradas esperadas para los formularios del editor en modo defined, el mapeo de sub-workflows y otras superficies basadas en metadatos.

Cuando un workflow utiliza el modo de body **Generic** webhook, el body HTTP entrante no se remodela a partir de `inputFields`. En su lugar, el payload JSON sin procesar se pasa directamente a `$nodeLabel.body`, y los controles para añadir o eliminar campos del nodo Input se ocultan en el panel del nodo.

## Ejemplos

**Entrada única (predeterminada):**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [{ "key": "text" }]
  }
}
```

**Múltiples entradas:**

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

## Relacionado

- [Node Types](../reference/node-types.md) – Descripción general de todos los tipos de nodos
- [Triggers](../reference/triggers.md) – Puntos de entrada (Input, Cron, RabbitMQ)
- [Expression DSL](../reference/expression-dsl.md) – Referencia a `$nodeLabel.body`, `$nodeLabel.query`
- [Portal](../reference/portal.md) – Exponga workflows como interfaces de chat
- [Webhooks](../reference/webhooks.md) – Trigger HTTP para workflows