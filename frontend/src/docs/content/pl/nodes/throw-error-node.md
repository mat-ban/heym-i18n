# Throw Error

Węzeł **Throw Error** natychmiast zatrzymuje wykonanie workflow i zwraca odpowiedź błędu z niestandardowym kodem statusu HTTP. Należy go stosować w przypadku błędów walidacji, nieautoryzowanego dostępu lub innych warunków błędu.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 0 |
| Wyjście | Workflow zostaje zatrzymany; odpowiedź błędu zwracana jest do wywołującego |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `label` | string | Identyfikator węzła (camelCase) |
| `errorMessage` | expression | Komunikat błędu (obsługuje wyrażenia) |
| `httpStatusCode` | number | Kod statusu HTTP (np. 400, 401, 403, 404, 429, 500) |

## Typowe kody statusu

| Kod | Zastosowanie |
|------|----------|
| 400 | Bad Request (nieprawidłowe dane wejściowe) |
| 401 | Unauthorized (wymagane uwierzytelnienie) |
| 403 | Forbidden (odmowa dostępu) |
| 404 | Not Found (brak zasobu) |
| 422 | Unprocessable Entity (błąd walidacji) |
| 429 | Too Many Requests (limit szybkości) |
| 500 | Internal Server Error |

## Przykład

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

Należy użyć z węzłem [Condition](./condition-node.md), aby zwalidować dane wejściowe i zgłosić błąd tylko w przypadku niepowodzenia walidacji:
- Warunek prawdziwy → kontynuacja do Output
- Warunek fałszywy → Throw Error

## Powiązane

- [Node Types](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Condition Node](./condition-node.md) – Walidacja przed zgłoszeniem błędu
- [Error Handler](./error-handler-node.md) – Przechwytywanie błędów z innych węzłów
