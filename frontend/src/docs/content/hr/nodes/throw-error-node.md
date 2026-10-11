# Bacanje pogreške

**Bacanje pogreške** čvor odmah zaustavlja izvršavanje workflow-a i vraća odgovor s pogreškom s prilagođenim HTTP statusnim kodom. Koristite ga za neuspjehe validacije, neovlašteni pristup ili druge uvjete pogreške.

## Pregled

| Svojstvo | Vrijednost |
|----------|------------|
| Ulazi | 1 |
| Izlazi | 0 |
| Izlaz | Workflow se zaustavlja; odgovor s pogreškom vraćen pozivatelju |

## Parametri

| Parametar | Tip | Opis |
|-----------|-----|------|
| `label` | string | Identifikator čvora (camelCase) |
| `errorMessage` | izraz | Poruka pogreške (podržava izraze) |
| `httpStatusCode` | broj | HTTP statusni kod (npr. 400, 401, 403, 404, 429, 500) |

## Uobičajeni statusni kodovi

| Kod | Slučaj korištenja |
|-----|-------------------|
| 400 | Neispravni zahtjev (nevažeći ulaz) |
| 401 | Neovlašteno (potrebna autentifikacija) |
| 403 | Zabranjeno (pristup odbijen) |
| 404 | Nije pronađeno (resurs nedostaje) |
| 422 | Neobradiva entiteta (pogreška validacije) |
| 429 | Previše zahtjeva (ograničenje brzine) |
| 500 | Interna pogreška poslužitelja |

## Primjer

```json
{
  "type": "throwError",
  "data": {
    "label": "validationError",
    "errorMessage": "Tekstualni unos je obavezan",
    "httpStatusCode": 400
  }
}
```

Koristite s [Uvjetom](./condition-node.md) za validaciju unosa i bacanje pogreške samo kada je nevažeći:
- Uvjet istinit → nastavi na Izlaz
- Uvjet neistinit → Bacanje pogreške

## Povezano

- [Tipovi čvorova](../reference/node-types.md) – Pregled svih tipova čvorova
- [Čvor uvjeta](./condition-node.md) – Validacija prije bacanja
- [Obraditelj pogrešaka](./error-handler-node.md) – Hvatanje pogrešaka iz drugih čvorova
