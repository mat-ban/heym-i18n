# Condition

El node **Condition** ramifica el workflow en funció d'una expressió if/else. Encamina cap a la ruta vertadera o falsa segons el resultat.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 2 (true, false) |
| Sortida | Passa l'entrada a la branca escollida |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `label` | string | Identificador del node (camelCase) |
| `condition` | expression | Expressió similar a JavaScript (p. ex. `$input.text.length > 0`) |

## Edge Handles

- **Source handle `true`** – quan la condició s'avalua com a truthy
- **Source handle `false`** – quan la condició s'avalua com a falsy

## Operadors d'expressió

Admet: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`, `.length`, `.contains()`, etc. Vegeu [Expression DSL](../reference/expression-dsl.md).

## Exemple

```json
{
  "type": "condition",
  "data": {
    "label": "checkInput",
    "condition": "$userInput.body.text.length > 0"
  }
}
```

Connecteu les edges amb `sourceHandle: "true"` o `sourceHandle: "false"` per encaminar cap a branques diferents.

## Relacionat

- [Node Types](../reference/node-types.md) – Visió general de tots els tipus de node
- [Switch Node](./switch-node.md) – Encaminament múltiple per valor
- [Expression DSL](../reference/expression-dsl.md) – Sintaxi de condicions
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Editor ampliable amb previsualització en directe del backend per a la condició