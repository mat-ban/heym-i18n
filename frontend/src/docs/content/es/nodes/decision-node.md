# Decisión

El nodo **Decision** plantea preguntas tipadas a un modelo de decisión sobre el estado actual de la ejecución y devuelve probabilidades. No genera texto. Recurra a él cuando un workflow necesite un juicio sobre el cual pueda ramificarse: enrutamiento, triaje, clasificación, verificación o control de un paso que no pueda deshacerse.

Los modelos de decisión (también llamados modelos *System One*) son un tipo de modelo distinto de un LLM. No hay prompt, ni instrucción de sistema, ni temperatura, ni llamada a herramientas. Usted envía un **estado** junto con un mapa de **preguntas**, y cada respuesta regresa como un número con una distribución de probabilidad detrás. Dado que una respuesta consta de apenas unos pocos tokens, estos modelos son rápidos y económicos en comparación con pedirle a un [LLM](./llm-node.md) que produzca JSON y luego analizarlo.

Para la generación de texto, utilice el nodo [LLM](./llm-node.md). Para un modelo que invoca herramientas, utilice el [Nodo Agent](./agent-node.md).

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Salida | La respuesta del proveedor textualmente — `$nodeLabel.answers.<id>`, `$nodeLabel.model`, `$nodeLabel.usage` |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `credentialId` | UUID | Una credencial de *Decision Model*. No es una credencial de LLM. |
| `model` | string | Nombre del modelo, por ejemplo `jev-latest` |
| `state` | expression | Lo que el modelo debe leer (por defecto `$input.text`) |
| `questions` | array | Filas de preguntas ordenadas; al menos una |
| `customBodyEnabled` | boolean | Enviar un cuerpo de solicitud escrito a mano en lugar del formulario |
| `customBody` | expression (JSON) | El cuerpo a enviar cuando la opción está activada |
| `requestTimeoutSeconds` | number | Segundos máximos de espera (por defecto: 60) |

### Estado

El **Estado** es la situación que el modelo juzga. Acepta una cadena, un objeto o un array.

Un campo que contiene exactamente una expresión conserva su propio tipo, por lo que `$input` envía el objeto en sí en lugar de su texto. Una plantilla con una expresión dentro (`Ticket: $input.text`) se resuelve como una cadena. Proporcione a cada pregunta lo suficiente para responder: texto de origen, identidades, relaciones, políticas y hechos actuales.

## Tipos de preguntas

Cada pregunta tiene un `id`, un `type`, `instructions` y criterios que dependen del tipo.

El `id` es la forma en que su workflow lee la respuesta de vuelta. **Nunca se envía al modelo**, por lo que todo el significado debe residir en `instructions`. Escribir `id: is_urgent` con `instructions: "Is it?"` no le da al modelo nada con lo que trabajar.

### Noul

Si una condición se cumple. Devuelve la probabilidad de que la respuesta sea sí, de 0 a 1.

Los criterios son opcionales: **Yes means** y **No means** describen lo que cubre cada lado. Un valor cercano a 0.5 significa que el modelo considera que sí y no son aproximadamente igual de probables, no una "intensidad media".

```json
{
  "id": "is_urgent",
  "type": "noul",
  "instructions": "Does this message convey urgency?",
  "criteriaTrue": "Explicitly time-sensitive or blocking work",
  "criteriaFalse": "No urgency expressed"
}
```

Léalo con `$triage.answers.is_urgent.noul`.

### Choice

Elige una opción de un conjunto que usted define. Devuelve la opción elegida, la distribución completa y una confianza derivada de ella.

Agregue una opción que cubra "ninguna de estas" siempre que nada pueda encajar: el modelo no puede elegir una opción que usted no haya ofrecido.

```json
{
  "id": "department",
  "type": "choice",
  "instructions": "Which team should handle this request?",
  "options": [
    { "key": "billing", "description": "Payments, invoicing, refunds" },
    { "key": "technical", "description": "Bugs, outages, integrations" },
    { "key": "other", "description": "Nothing above fits" }
  ]
}
```

Léalo con `$triage.answers.department.choice`, `.probabilities.billing` y `.confidence`.

### Score

Califica el estado según una rúbrica ordenada. Devuelve un valor ponderado por probabilidad que puede situarse **entre** niveles, además de la leyenda y la distribución.

Los niveles van del más bajo al más alto, con un mínimo de dos y un máximo de diez. Cada nivel debe describir una situación concreta y sostenerse por sí mismo.

```json
{
  "id": "frustration",
  "type": "score",
  "instructions": "How frustrated is the customer?",
  "levels": ["Calm", "Frustrated", "Very angry"]
}
```

Léalo con `$triage.answers.frustration.score`, `.legend` y `.confidence`.
## Generar con IA

**Generar con IA** convierte una frase simple en una plantilla de estado sugerida y un conjunto de filas de preguntas. Describa lo que desea evaluar — "clasificar un ticket de soporte entrante: qué tan urgente es, qué equipo es responsable y qué tan frustrado suena el cliente" — y revise lo que se devuelve antes de agregarlo al nodo.

El borrador lo realiza un LLM, por lo que el diálogo solicita una credencial de LLM. El modelo de decisión responde las preguntas más adelante, cuando se ejecuta el workflow. Los ids generados se deduplican contra las filas que el nodo ya contiene, por lo que generar dos veces nunca sobrescribe una clave de respuesta existente.

Cada generación se registra en la pestaña [Trazas](../tabs/traces-tab.md) bajo la fuente **Decision Questions**, junto con las trazas `decision.systemone` escritas por el propio nodo en tiempo de ejecución.

## Cuerpo de solicitud personalizado

Active **Cuerpo de solicitud personalizado** para enviar JSON que usted mismo escriba en lugar del formulario. Úselo para un endpoint cuyo contrato difiera del que construye el formulario.

El editor se inicializa a partir del formulario actual, y las expresiones dentro de él se resuelven antes de enviar la solicitud. Mientras el interruptor esté activado, el campo State y las filas de preguntas se ignoran. La respuesta se transmite sin cambios en ambos casos, por lo que un contrato diferente simplemente produce una forma distinta que sus expresiones deberán leer.

## Salida

El nodo devuelve exactamente lo que devolvió el proveedor. Nada se renombra ni se aplana.

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "is_urgent": { "type": "noul", "noul": 0.95 },
    "department": {
      "type": "choice",
      "choice": "billing",
      "probabilities": { "billing": 0.88, "technical": 0.12, "other": 0.0 },
      "confidence": 0.81
    },
    "frustration": {
      "type": "score",
      "score": 1.05,
      "legend": { "0": "Calm", "1": "Frustrated", "2": "Very angry" },
      "probabilities": { "0": 0.0, "1": 0.95, "2": 0.05 },
      "confidence": 0.92
    }
  },
  "usage": { "input_tokens": 296, "output_tokens": 20 }
}
```

## Bifurcación según una respuesta

Un nodo [Switch](./switch-node.md) enruta según la opción elegida, y un nodo [Condition](./condition-node.md) puede enviar los casos de baja confianza a algún lugar donde una persona los vea:

```
Input → Decision (triage) → Condition ($triage.answers.department.confidence > 0.7)
                              ├─ true  → Switch on $triage.answers.department.choice
                              └─ false → Send Email (human review)
```

Una respuesta tipada garantiza la forma, no la veracidad. Elija los umbrales según sus propios datos y consecuencias en lugar de copiar un número de un ejemplo.

## Credencial

Cree una credencial de **Decision Model** en la pestaña [Credenciales](../tabs/credentials-tab.md) con:

- **Base URL** — el endpoint, por ejemplo `https://api.typesafe.ai`. Heym agrega `/v1/systemone`.
- **API Key** — opcional. Los endpoints que no requieren clave pueden dejarse en blanco.

Al editar una credencial, se conserva la clave almacenada cuando el campo de clave se deja en blanco; vuelva a escribirla solo para reemplazarla.

La misma credencial puede evaluar ejecuciones de [Evaluaciones](../tabs/evals-tab.md): con **LLM-as-Judge** seleccionado, elíjala como juez y el modelo de decisión puntuará cada respuesta contra la salida esperada.

Heym bloquea las solicitudes salientes a direcciones privadas y de loopback de forma predeterminada, por lo que un endpoint de decisión que usted ejecute en `localhost` o en un rango privado necesita `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.

Los modelos de decisión no aparecen en las tablas de precios de LLM que Heym sincroniza, por lo que la columna **Cost** en [Trazas](../tabs/traces-tab.md) permanece vacía para estas llamadas. Los recuentos de tokens sí se registran, y usted puede agregar su propio precio con una anulación de precios.

## Errores

| Situación | Qué ocurre |
|-----------|--------------|
| API key no válida | El nodo falla con un mensaje que nombra la credencial |
| Pregunta mal formada | El mensaje a nivel de campo del propio proveedor se traslada al error del nodo |
| Límite de tasa excedido o sobrecarga | El nodo falla con un mensaje que indica que la condición es transitoria — active [retry](../reference/features.md) para este nodo para superarla |
| Id de pregunta duplicado o vacío | El nodo falla antes de enviar cualquier solicitud |

## Relacionado

- [Nodo LLM](./llm-node.md) – Generar texto en lugar de un juicio
- [Nodo Agent](./agent-node.md) – Reunir evidencia con herramientas y luego evaluarla aquí
- [Nodo Switch](./switch-node.md) – Enrutar según la opción elegida
- [Nodo Condition](./condition-node.md) – Condicionar según la confianza
- [Tipos de nodo](../reference/node-types.md) – Descripción general de todos los tipos de nodo
- [Credenciales](../reference/credentials.md) – Tipos y campos de credenciales
- [Pestaña Trazas](../tabs/traces-tab.md) – Inspeccionar llamadas de decisión y uso de tokens
