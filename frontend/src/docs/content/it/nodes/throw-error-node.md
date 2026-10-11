# Throw Error

Il nodo **Throw Error** interrompe immediatamente l'esecuzione del workflow e restituisce una risposta di errore con un codice di stato HTTP personalizzato. Utilizzarlo per errori di validazione, accessi non autorizzati o altre condizioni di errore.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 0 |
| Output | Il workflow si interrompe; viene restituita una risposta di errore al chiamante |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `label` | string | Identificatore del nodo (camelCase) |
| `errorMessage` | expression | Messaggio di errore (supporta le espressioni) |
| `httpStatusCode` | number | Codice di stato HTTP (es. 400, 401, 403, 404, 429, 500) |

## Codici di stato comuni

| Codice | Caso d'uso |
|------|----------|
| 400 | Bad Request (input non valido) |
| 401 | Unauthorized (autenticazione richiesta) |
| 403 | Forbidden (accesso negato) |
| 404 | Not Found (risorsa mancante) |
| 422 | Unprocessable Entity (errore di validazione) |
| 429 | Too Many Requests (limite di richieste) |
| 500 | Internal Server Error |

## Esempio

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

Utilizzarlo con [Condition](./condition-node.md) per validare l'input e lanciare l'errore solo quando non è valido:
- Condizione vera → proseguire verso Output
- Condizione falsa → Throw Error

## Correlati

- [Node Types](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Condition Node](./condition-node.md) – Validare prima di lanciare l'errore
- [Error Handler](./error-handler-node.md) – Catturare gli errori dagli altri nodi