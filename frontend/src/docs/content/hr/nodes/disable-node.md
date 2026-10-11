# Onemogući čvor

Čvor **Onemogući čvor** trajno onemogućuje drugi čvor u workflowu. Kada se izvrši, postavlja `active` ciljnog čvora na `false` i trajno pohranjuje promjenu. Koristite ga za jednokratne operacije poput zaustavljanja cron triggera nakon što je uvjet ispunjen.

## Pregled

| Svojstvo | Vrijednost |
|----------|-------|
| Ulazi | 1 |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.targetNode`, `$nodeLabel.disabled` |

## Parametri

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `label` | string | Identifikator čvora (camelCase) |
| `targetNodeLabel` | string | Oznaka čvora koji se onemogućuje (npr. `hourlyCheck`) |

## Primjer upotrebe

Onemogućite [Cron](./cron-node.md) trigger nakon što je uvjet ispunjen kako se više ne bi pokretao u budućim izvršavanjima workflowa. Ponovno ga uključite kasnije pomoću [Omogući čvor](./enable-node.md).

## Primjer

```json
{
  "type": "disableNode",
  "data": {
    "label": "stopCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Tijek: Cron → HTTP provjera → Uvjet (status dovršen?) → ako je istina: Onemogući čvor (cilj: cron) → Izlaz.

## Povezano

- [Tipovi čvorova](../reference/node-types.md) – Pregled svih tipova čvorova
- [Omogući čvor](./enable-node.md) – Ponovno uključivanje onemogućenog čvora
- [Cron čvor](./cron-node.md) – Trigger koji se onemogućuje
- [Čvor uvjeta](./condition-node.md) – Grananje prije onemogućivanja
