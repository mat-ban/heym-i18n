# Throw Error

El nodo **Throw Error** detiene la ejecución del workflow de inmediato y devuelve una respuesta de error con un código de estado HTTP personalizado. Utilícelo para fallos de validación, accesos no autorizados u otras condiciones de error.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 0 |
| Salida | El workflow se detiene; se devuelve una respuesta de error al invocador |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `label` | string | Identificador del nodo (camelCase) |
| `errorMessage` | expression | Mensaje de error (admite expresiones) |
| `httpStatusCode` | number | Código de estado HTTP (p. ej. 400, 401, 403, 404, 429, 500) |

## Códigos de estado comunes

| Código | Caso de uso |
|------|----------|
| 400 | Bad Request (entrada no válida) |
| 401 | Unauthorized (se requiere autenticación) |
| 403 | Forbidden (acceso denegado) |
| 404 | Not Found (recurso no encontrado) |
| 422 | Unprocessable Entity (error de validación) |
| 429 | Too Many Requests (límite de solicitudes) |
| 500 | Internal Server Error |

## Ejemplo

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

Utilícelo junto con [Condition](./condition-node.md) para validar la entrada y lanzar el error solo cuando no sea válida:
- Condición verdadera → continuar hacia Output
- Condición falsa → Throw Error

## Relacionado

- [Node Types](../reference/node-types.md) – Descripción general de todos los tipos de nodo
- [Condition Node](./condition-node.md) – Validar antes de lanzar el error
- [Error Handler](./error-handler-node.md) – Capturar errores de otros nodos