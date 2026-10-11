# Cron

Il nodo **Cron** attiva un workflow secondo una pianificazione basata su un'espressione cron. Non è richiesto alcun input da parte dell'utente: il workflow viene eseguito automaticamente negli orari specificati.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 0 |
| Output | 1 |
| Output | Evento Trigger (nessun payload) |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `label` | string | Identificatore del nodo (camelCase) |
| `cronExpression` | string | Espressione cron (es. `0 * * * *` per cadenza oraria) |

## Formato dell'espressione cron

Cron standard a 5 campi: `minuto ora giorno-del-mese mese giorno-della-settimana`

| Campo | Valori | Esempio |
|-------|--------|---------|
| Minuto | 0–59 | `0` = al minuto 0 |
| Ora | 0–23 | `*` = ogni ora |
| Giorno del mese | 1–31 | `*` = ogni giorno |
| Mese | 1–12 | `*` = ogni mese |
| Giorno della settimana | 0–7 (0 e 7 = domenica) | `*` = ogni giorno |

**Esempi comuni:**

- `0 * * * *` – ogni ora
- `0 0 * * *` – ogni giorno a mezzanotte
- `*/15 * * * *` – ogni 15 minuti
- `0 9 * * 1-5` – nei giorni feriali alle 9:00

## Esempio

```json
{
  "type": "cron",
  "data": {
    "label": "hourlyCheck",
    "cronExpression": "0 * * * *"
  }
}
```

## Correlati

- [Tipi di nodo](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Trigger](../reference/triggers.md) – Cron, Input, RabbitMQ
- [Nodo Disable](./disable-node.md) – Arresta un Trigger cron dopo una condizione
- [Nodo Enable](./enable-node.md) – Avvia nuovamente un Trigger cron disabilitato