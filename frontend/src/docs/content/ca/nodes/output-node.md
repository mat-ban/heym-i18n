# Sortida

El node **Sortida** és l'endpoint del workflow que retorna la resposta al sol·licitant. Referencieu sempre el node anterior per la seva etiqueta—no utilitzeu mai `$input`.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 (opcional, per a postprocessament asíncron) |
| Sortida | Retorna `message` al sol·licitant |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `label` | string | Identificador del node (camelCase) |
| `message` | expression | Valor de sortida. **Ha de** referenciar el node anterior: `$previousNodeLabel.field` |
| `allowDownstream` | boolean | Si és true, els nodes posteriors a la sortida s'executen de manera asíncrona després d'enviar la resposta |

## Ús com a eina d'agent

Quan un node Sortida es connecta a un [Node Agent](./agent-node.md) com a eina de node del canvas, el camp `message` es pot marcar com a **proporcionat per l'agent** amb la icona del bot. L'agent proporciona aleshores el missatge quan crida l'eina. Si el node Sortida no està connectat com a eina d'agent, la icona del bot queda oculta.

## Regla crítica

**No utilitzeu mai `$input` al node de sortida.** Utilitzeu sempre l'etiqueta del node anterior:

- ❌ `"message": "$input.text"`
- ✅ `"message": "$processData.text"` (on `processData` és l'etiqueta del node anterior)

## Postprocessament asíncron

Quan `allowDownstream: true`, la resposta es retorna immediatament. Els nodes connectats després de la sortida s'executen en segon pla (per exemple, notificacions de Slack, registre). Com que la cua posterior pot finalitzar més tard, una fallada posterior pot canviar l'estat d'execució registrat a `error` després que la resposta anticipada ja s'hagi retornat; l'historial i les analítiques finals reflecteixen aquest resultat posterior.

## Exemple

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text"
  }
}
```

## Exemple – Amb asincronia

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

A continuació, connecteu un node [Telegram](./telegram-node.md), [Slack](./slack-node.md) o un altre node després de la sortida per a notificacions fire-and-forget.

## Relacionat

- [Mapejador de sortida JSON](./json-output-mapper-node.md) – Cos JSON arrel sense embolcall `result` quan és l'únic terminal
- [Tipus de nodes](../reference/node-types.md) – Visió general de tots els tipus de nodes
- [DSL d'expressions](../reference/expression-dsl.md) – Referenciar la sortida d'un node
- [Diàleg d'avaluació d'expressions](../reference/expression-evaluation-dialog.md) – Editor expandible amb previsualització en directe del backend per a message
- [Estructura del workflow](../reference/workflow-structure.md) – Format JSON