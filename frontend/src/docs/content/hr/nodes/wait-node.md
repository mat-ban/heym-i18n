# Čekanje

**Wait** čvor pauzira izvršavanje workflow-a na određeno vrijeme. Koristite ga za ograničavanje brzine, odgođene akcije ili intervale provjere.

## Pregled

| Svojstvo | Vrijednost |
|----------|------------|
| Ulazi | 1 |
| Izlazi | 1 |
| Izlaz | Prolazi kroz ulaz |

## Parametri

| Parametar | Tip | Opis |
|-----------|-----|------|
| `label` | string | Identifikator čvora (camelCase) |
| `duration` | number | Odgoda u milisekundama (npr. 1000 = 1 sekunda). Uređivač prihvaća vrijednosti od 1 do 900000 (15 minuta) |

## Primjer

```json
{
  "type": "wait",
  "data": {
    "label": "delayOneSecond",
    "duration": 1000
  }
}
```

## Povezano

- [Tipovi čvorova](../reference/node-types.md) – Pregled svih tipova čvorova
- [Loop Node](./loop-node.md) – Koristite Wait unutar petlji za ograničavanje brzine
