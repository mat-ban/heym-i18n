# Throw Error

El node **Throw Error** atura immediatament l'execució del workflow i retorna una resposta d'error amb un codi d'estat HTTP personalitzat. Utilitzeu-lo per a errors de validació, accessos no autoritzats o altres condicions d'error.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 0 |
| Sortida | El workflow s'atura; es retorna una resposta d'error al sol·licitant |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `label` | string | Identificador del node (camelCase) |
| `errorMessage` | expression | Missatge d'error (admet expressions) |
| `httpStatusCode` | number | Codi d'estat HTTP (p. ex. 400, 401, 403, 404, 429, 500) |

## Codis d'estat habituals

| Codi | Cas d'ús |
|------|----------|
| 400 | Bad Request (entrada no vàlida) |
| 401 | Unauthorized (cal autenticació) |
| 403 | Forbidden (accés denegat) |
| 404 | Not Found (recurs inexistent) |
| 422 | Unprocessable Entity (error de validació) |
| 429 | Too Many Requests (límit de peticions) |
| 500 | Internal Server Error |

## Exemple

```json
{
  "type": "throwError",
  "data": {
    "label": "validationError",
    "errorMessage": "Text input is required",
    "httpStatusCode": 400
  }
}
```

Utilitzeu-lo amb [Condition](./condition-node.md) per validar l'entrada i llançar l'error només quan no sigui vàlida:
- Condició certa → continua cap a Output
- Condició falsa → Throw Error

## Relacionat

- [Node Types](../reference/node-types.md) – Visió general de tots els tipus de node
- [Condition Node](./condition-node.md) – Valideu abans de llançar l'error
- [Error Handler](./error-handler-node.md) – Captureu errors d'altres nodes