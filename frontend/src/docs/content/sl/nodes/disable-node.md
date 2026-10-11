# Onemogoči Vozlišče

Vozlišče **Onemogoči Vozlišče** trajno onemogoči drugo vozlišče v workflow-u. Ko se izvede, nastavi `active` ciljnega vozlišča na `false` in spremembo shrani. Uporabite ga za enkratne operacije, kot je ustavitev cron triggerja, ko je izpolnjen določen pogoj.

## Pregled

| Lastnost | Vrednost |
|----------|----------|
| Vhodi | 1 |
| Izhodi | 1 |
| Izhod | `$nodeLabel.targetNode`, `$nodeLabel.disabled` |

## Parametri

| Parameter | Tip | Opis |
|-----------|-----|------|
| `label` | niz | Identifikator vozlišča (camelCase) |
| `targetNodeLabel` | niz | Oznaka vozlišča, ki ga želite onemogočiti (npr. `hourlyCheck`) |

## Uporabniški Primer

Onemogočite [Cron](./cron-node.md) trigger po izpolnjenem pogoju, da se v prihodnjih izvajanju workflow-a ne izvaja več. Kasneje ga ponovno omogočite z [Omogoči Vozlišče](./enable-node.md).

## Primer

```json
{
  "type": "disableNode",
  "data": {
    "label": "stopCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Tok: Cron → HTTP preverjanje → Pogoj (status končan?) → če je res: Onemogoči Vozlišče (cilj: cron) → Izhod.

## Sorodno

- [Vrste Vozlišč](../reference/node-types.md) – Pregled vseh vrst vozlišč
- [Omogoči Vozlišče](./enable-node.md) – Ponovno omogočite onemogočeno vozlišče
- [Cron Vozlišče](./cron-node.md) – Trigger za onemogočanje
- [Pogoj Vozlišče](./condition-node.md) – Veji pred onemogočanjem
