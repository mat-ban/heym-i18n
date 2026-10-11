# Disable Node

**Disable Node** sõlm keelab jäädavalt teise sõlme workflow's. Käivitamisel määrab see sihtsõlme atribuudi `active` väärtuseks `false` ja salvestab muudatuse püsivalt. Kasutage seda ühekordsete toimingute jaoks, näiteks cron-triggeri peatamiseks pärast tingimuse täitumist.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 1 |
| Väljund | `$nodeLabel.targetNode`, `$nodeLabel.disabled` |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `label` | string | Sõlme identifikaator (camelCase) |
| `targetNodeLabel` | string | Keelatava sõlme silt (nt `hourlyCheck`) |

## Kasutusjuhtum

Keelake [Cron](./cron-node.md) trigger pärast tingimuse täitumist, et see enam tulevastes workflow käivitustes ei töötaks. Lülitage see hiljem uuesti sisse funktsiooniga [Enable Node](./enable-node.md).

## Näide

```json
{
  "type": "disableNode",
  "data": {
    "label": "stopCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Voog: Cron → HTTP check → Condition (status complete?) → kui tõene: Disable Node (siht: cron) → Output.

## Seotud

- [Node Types](../reference/node-types.md) – Ülevaade kõigist sõlmetüüpidest
- [Enable Node](./enable-node.md) – Keelatud sõlme uuesti sisselülitamine
- [Cron Node](./cron-node.md) – Keelatav trigger
- [Condition Node](./condition-node.md) – Hargnemine enne keelamist
