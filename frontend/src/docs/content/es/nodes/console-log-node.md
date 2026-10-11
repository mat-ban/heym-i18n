# Console Log

El nodo **Console Log** registra un valor en la consola del backend (servidor). Utilícelo para depuración e inspección durante el desarrollo.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Salida | Pasa a través de la entrada |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `label` | string | Identificador del nodo (camelCase) |
| `logMessage` | expression | Valor a registrar. Admite [expresiones](../reference/expression-dsl.md). |

## Ejemplo

```json
{
  "type": "consoleLog",
  "data": {
    "label": "debugOutput",
    "logMessage": "$userInput.body"
  }
}
```

La salida aparece en los logs del servidor (por ejemplo, la salida de la terminal al ejecutar `uvicorn`).

## Relacionado

- [Tipos de nodos](../reference/node-types.md) – Descripción general de todos los tipos de nodos
- [Pestaña Logs](../tabs/logs-tab.md) – Ver los logs de la aplicación