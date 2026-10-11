# Dezactivare Nod

Nodul **Dezactivare Nod** dezactivează permanent un alt nod din workflow. La execuție, setează proprietatea `active` a nodului țintă la `false` și persistă modificarea. Utilizați-l pentru operațiuni unice, cum ar fi oprirea unui trigger Cron după îndeplinirea unei condiții.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.targetNode`, `$nodeLabel.disabled` |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `label` | string | Identificatorul nodului (camelCase) |
| `targetNodeLabel` | string | Eticheta nodului de dezactivat (de ex. `hourlyCheck`) |

## Caz de utilizare

Dezactivați un trigger [Cron](./cron-node.md) după îndeplinirea unei condiții, astfel încât acesta să nu mai ruleze în execuțiile viitoare ale workflow-ului. Reactivați-l ulterior cu [Activare Nod](./enable-node.md).

## Exemplu

```json
{
  "type": "disableNode",
  "data": {
    "label": "stopCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Flux: Cron → Verificare HTTP → Condiție (stare finalizată?) → dacă adevărat: Dezactivare Nod (țintă: cron) → Ieșire.

## Resurse conexe

- [Tipuri de noduri](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Activare Nod](./enable-node.md) – Reactivarea unui nod dezactivat
- [Nod Cron](./cron-node.md) – Trigger-ul de dezactivat
- [Nod Condiție](./condition-node.md) – Ramificare înainte de dezactivare
