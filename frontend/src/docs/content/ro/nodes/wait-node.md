# Wait

Nodul **Wait** suspendă execuția workflow-ului pentru o durată specificată. Utilizați-l pentru limitarea ratei, acțiuni întârziate sau intervale de polling.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Ieșire | Transmite intrarea mai departe |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `label` | string | Identificatorul nodului (camelCase) |
| `duration` | number | Întârziere în milisecunde (de ex. 1000 = 1 secundă). Editorul acceptă valori de la 1 la 900000 (15 minute) |

## Exemplu

```json
{
  "type": "wait",
  "data": {
    "label": "delayOneSecond",
    "duration": 1000
  }
}
```

## Resurse conexe

- [Tipuri de noduri](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Nodul Loop](./loop-node.md) – Utilizați Wait în interiorul buclelor pentru limitarea ratei
