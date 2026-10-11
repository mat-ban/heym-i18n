# Condition

El nodo **Condition** ramifica el workflow en función de una expresión if/else. Enruta hacia la ruta verdadera o falsa según el resultado.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 2 (true, false) |
| Salida | Pasa la entrada a la rama elegida |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `label` | string | Identificador del nodo (camelCase) |
| `condition` | expression | Expresión similar a JavaScript (ej.: `$input.text.length > 0`) |

## Handles de aristas

- **Handle de origen `true`** – cuando la condición se evalúa como verdadera
- **Handle de origen `false`** – cuando la condición se evalúa como falsa

## Operadores de expresión

Admite: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`, `.length`, `.contains()`, etc. Consulte [Expression DSL](../reference/expression-dsl.md).

## Ejemplo

```json
{
  "type": "condition",
  "data": {
    "label": "checkInput",
    "condition": "$userInput.body.text.length > 0"
  }
}
```

Conecte aristas con `sourceHandle: "true"` o `sourceHandle: "false"` para enrutar hacia distintas ramas.

## Relacionado

- [Tipos de nodos](../reference/node-types.md) – Descripción general de todos los tipos de nodos
- [Nodo Switch](./switch-node.md) – Enrutamiento multidireccional por valor
- [Expression DSL](../reference/expression-dsl.md) – Sintaxis de condiciones
- [Diálogo de evaluación de expresiones](../reference/expression-evaluation-dialog.md) – Editor expandible con vista previa en vivo del backend para la condición