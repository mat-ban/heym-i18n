# Čakanje

Vozlišče **Čakanje** ustavi izvajanje workflow-a za določen čas. Uporabite ga za omejevanje hitrosti, zamujene akcije ali intervale preverjanja.

## Pregled

| Lastnost | Vrednost |
|----------|----------|
| Vhodi    | 1        |
| Izhodi   | 1        |
| Izhod    | Prehaja skozi vhod |

## Parametri

| Parameter  | Tip    | Opis                                                      |
|------------|--------|----------------------------------------------------------|
| `label`    | niz   | Identifikator vozlišča (camelCase)                       |
| `duration` | število | Zamuda v milisekundah (npr. 1000 = 1 sekunda). Urejevalnik sprejema vrednosti od 1 do 900000 (15 minut) |

## Primer

```json
{
  "type": "wait",
  "data": {
    "label": "delayOneSecond",
    "duration": 1000
  }
}
```

## Sorodno

- [Vrste vozlišč](../reference/node-types.md) – Pregled vseh vrst vozlišč
- [Ciklična vozlišča](./loop-node.md) – Uporabite Čakanje znotraj ciklov za omejevanje hitrosti
