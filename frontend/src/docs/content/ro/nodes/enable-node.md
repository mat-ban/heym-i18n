# Activare Nod

Nodul **Activare Nod** reactivează un alt nod. La execuție, setează proprietatea `active` a nodului țintă la `true` și persistă modificarea. Este omologul nodului [Dezactivare Nod](./disable-node.md): utilizați-l pentru a rearma un trigger [Cron](./cron-node.md) sau orice nod care a fost oprit.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.targetNode`, `$nodeLabel.enabled` |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `label` | string | Identificatorul nodului (camelCase) |
| `targetNodeLabel` | string | Eticheta nodului de activat (de ex. `hourlyCheck`) |

## Comportament

- Ținta este salvată ca activă, astfel încât execuțiile și trigger-ele viitoare o vor vedea. Un trigger Cron reactivat se declanșează din nou la următorul moment programat.
- Dacă ținta se află în aval de nodul Activare Nod și nu a rulat încă, aceasta rulează și în execuția curentă.
- Activarea unui nod deja activ nu schimbă nimic; ieșirea raportează în continuare `enabled: true`.
- Nodul eșuează cu o eroare atunci când `targetNodeLabel` este gol sau niciun nod nu are acea etichetă.

## Caz de utilizare

Porniți un trigger [Cron](./cron-node.md) la cerere. Salvați nodul Cron oprit și atribuiți workflow-ului un al doilea punct de intrare, cum ar fi un trigger [Input](./input-node.md). O cerere către acel punct de intrare rulează nodul Activare Nod, iar Cron-ul începe să se declanșeze.

Un trigger oprit nu pornește niciodată o execuție de unul singur, astfel încât nodul Activare Nod trebuie să se afle în spatele unui punct de intrare care poate rula.

## Exemplu

```json
{
  "type": "enableNode",
  "data": {
    "label": "startCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Flux: Input → Activare Nod (țintă: cron) → Output. Nodul Cron `hourlyCheck` este salvat ca dezactivat în același workflow și rulează propria ramură de verificare HTTP odată activat.

## Resurse conexe

- [Tipuri de noduri](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Dezactivare Nod](./disable-node.md) – Opriți un nod din interiorul unui workflow
- [Nod Cron](./cron-node.md) – Trigger-ul de activat
- [Nod Condiție](./condition-node.md) – Ramificați înainte de activare
- [Funcționalități Canvas](../reference/canvas-features.md) – Activați sau dezactivați un nod manual
