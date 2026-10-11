# Reiter Warnungen

Der Reiter **Warnungen** (Alerts) ermöglicht das Definieren von Schwellenwerten über gleitende Zeitfenster, um bei Unregelmäßigkeiten oder Fehlern frühzeitig benachrichtigt zu werden.

## Alarm-Typen

| Typ | Überwachte Fragestellung | Datenquelle |
|---|---|---|
| **Fehlerschwellenwert** | Gab es mehr als N Fehler im Zeitfenster? | Fehlgeschlagene Läufe im [Ausführungsverlauf](../reference/execution-history.md) |
| **Workflow-Laufzeit** | Waren Läufe langsamer als erwartet? | Ausführungsdauer (Maximum, Durchschnitt oder p95) |
| **Token- / USD-Kosten** | Haben LLM-Ausgaben ein Budget überschritten? | [LLM-Traces](./traces-tab.md) und LLM-Kostentabelle |
| **Ausführungsanzahl** | Wurde ein Workflow ungewöhnlich oft ausgeführt? | Gesamtzahl der Ausführungen im Verlauf |

## Assistent & Backtest

Das Erstellen von Warnungen erfolgt in 5 einfachen Schritten: Typ wählen, Geltungsbereich festlegen, Bedingung und Zeitfenster definieren, Benachrichtigungs-Workflow verknüpfen und im Review-Schritt den **Backtest** prüfen. Der Backtest zeigt sofort, wie oft der Alarm in den letzten 24 Stunden, 3 Tagen oder 7 Tagen ausgelöst hätte.

## Automatische Benachrichtigungs-Workflows

Beim Auslösen eines Alarms kann Heym automatisch einen Benachrichtigungs-Workflow starten. Dieser erhält ein standardisiertes JSON-Payload mit allen Details:

```json
{
  "alert_id": "...",
  "alert_name": "Rechnungs-Sync Fehler",
  "alert_type": "error_threshold",
  "observed_value": 12,
  "threshold_value": 5,
  "window_minutes": 10
}
```

Über normale Slack-, Telegram- oder E-Mail-Knoten versenden Sie Benachrichtigungen an Ihre Wunschkanäle.

## Verwandte Themen

- [Reiter Analysen](./analytics-tab.md) – Latenz- und Fehlermetriken
- [Reiter Ausführungen](./traces-tab.md) – Kostenursachen analysieren\n