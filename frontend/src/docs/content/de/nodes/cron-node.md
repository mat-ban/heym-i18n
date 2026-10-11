# Cron-Knoten

Der **Cron-Knoten** ist ein zeitbasierter Trigger, der einen Workflow nach einem definierten Zeitplan automatisch startet.

## Übersicht

| Eigenschaft | Wert |
|---|---|
| Eingänge | 0 (Trigger-Knoten) |
| Ausgänge | 1 |
| Ausgabe | `$nodeLabel.timestamp`, `$nodeLabel.execution_time` |

## Konfiguration

- Standard-Cron-Syntax (z. B. `0 9 * * 1-5` für Montag bis Freitag um 09:00 Uhr)
- Zeitzonen-Unterstützung (z. B. `Europe/Berlin`)
- Übersicht aller anstehenden Läufe im Reiter [Zeitpläne](../tabs/scheduled-tab.md)

## Verwandte Themen

- [Reiter Zeitpläne](../tabs/scheduled-tab.md) – Kalenderansicht geplanter Workflows\n