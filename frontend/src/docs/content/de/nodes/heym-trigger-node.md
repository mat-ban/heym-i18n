# Heym-Trigger

Der **Heym Trigger**-Knoten startet einen Workflow, wenn Heym selbst ein Plattform-Ereignis veröffentlicht. Es ist ein Trigger-Knoten ohne Eingabe zur Automatisierung von Heym mit Heym: Änderungs-Audit-Trails, Deployment-Ankündigungen und Instance-Health-Digests.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 0 |
| Ausgaben | 1 |
| Ausgabe | `$nodeLabel.events`, `$nodeLabel.count`, `$nodeLabel.triggered_at` |
| Anmeldedaten | Keine erforderlich |

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `eventNames` | String-Array | Welche Ereignisse abonniert werden sollen. Leer lassen, um jedes Ereignis zu empfangen. |

## Ereignisse

| Ereignis | Veröffentlicht wenn | Geltungsbereich |
|-------|----------------|-------|
| `heym.started` | Die Heym-Plattform startet | Instanzweit: jeder Abonnent empfängt es |
| `workflow.created` | Ein Workflow wird erstellt | Nur die Abonnenten des Workflow-Eigentümers |
| `workflow.updated` | Ein Workflow wird gespeichert | Nur die Abonnenten des Workflow-Eigentümers |
| `workflow.deleted` | Ein Workflow wird gelöscht | Nur die Abonnenten des Workflow-Eigentümers |

Dashboard-Widgets werden intern als Workflows gespeichert, erzeugen aber niemals `workflow.*`-Ereignisse.

## Die Zustellung erfolgt gebündelt

Heym versendet Ereignisse alle fünf Sekunden. **Jedes Ereignis, das in einem Versanddurchlauf beansprucht wird, kommt in einem einzigen Workflow-Lauf als Array an.**

- Erstelle zwei Workflows innerhalb von fünf Sekunden zueinander → **ein** Lauf mit zwei Ereignissen.
- Erstelle einen Workflow → **ein** Lauf mit einem einelementigen Array.

Die Form ändert sich nie, sodass nachgelagerte Ausdrücke niemals danach verzweigen müssen, ob ein Ereignis oder viele angekommen sind. Wenn du pro Ereignis einmal handeln musst, setze einen [Loop](./loop-node.md)-Knoten über `$nodeLabel.events`.

## Exactly-Once-Zustellung

Jedes Ereignis wird pro abonnierendem Knoten über eine eindeutige Datenbank-Constraint beansprucht, bevor es zugestellt wird. Dies gilt über jeden uvicorn-Worker, jeden Container und jede Maschine hinweg: Wenn Heym auf zwei Servern läuft, wird ein Ereignis nicht zweimal zugestellt. Wenn ein Anspruch nicht aufgezeichnet werden kann, wird das Ereignis überhaupt nicht zugestellt — das Design schlägt geschlossen fehl, anstatt zweimal auszulösen.

Zwei verschiedene `heymTrigger`-Knoten, die dasselbe Ereignis abonnieren, empfangen es jeweils einmal; sie konkurrieren nicht darum.

## Das Versandfenster

Der Dispatcher berücksichtigt nur Ereignisse, die in den **letzten fünf Minuten** veröffentlicht wurden. Ältere Ereignisse bleiben zur Einsicht im Log, werden aber niemals zugestellt. Dies begrenzt, was nach Ausfallzeiten passiert: Wenn Heym nach einer Stunde Offline-Zeit wieder hochgefahren wird, wird nichts erneut abgespielt, anstatt eine Stunde Rückstand auf einmal auszulösen.

Ereignisse werden **7 Tage** lang aufbewahrt und dann gelöscht.

## Ausgabefelder

| Ausdruck | Beschreibung |
|------------|-------------|
| `$nodeLabel.events` | Array von Ereignisobjekten, älteste zuerst. Immer ein Array. |
| `$nodeLabel.events[0].id` | Ereignis-UUID |
| `$nodeLabel.events[0].name` | Ereignisname, zum Beispiel `workflow.created` |
| `$nodeLabel.events[0].payload` | Ereignis-Body |
| `$nodeLabel.events[0].workflow_id` | Betreffende Workflow-ID oder `null` für `heym.started` |
| `$nodeLabel.events[0].created_at` | ISO-Zeitstempel für den Zeitpunkt der Veröffentlichung des Ereignisses |
| `$nodeLabel.count` | Anzahl der Ereignisse in diesem Batch |
| `$nodeLabel.triggered_at` | ISO-Zeitstempel für die Workflow-Ausführung |

### Payload-Formen

`workflow.created`, `workflow.updated`, `workflow.deleted`:

```json
{
  "workflow_id": "…",
  "name": "Nightly report",
  "owner_id": "…",
  "actor_user_id": "…",
  "updated_at": "2026-08-11T09:30:00+00:00"
}
```

`heym.started`:

```json
{ "version": "1.4.2", "started_at": "2026-08-11T09:30:00+00:00" }
```

`workflow.deleted` trägt den Namen, der unmittelbar vor der Löschung erfasst wurde, da die Workflow-Zeile nicht mehr existiert, wenn du das Ereignis liest.

## Beispiel-Workflow

**Workflow-Änderungs-Audit-Trail**

```
heymTrigger → heym (getWorkflow) → slack
```

- **Heym Trigger**-Label `platformEvents`, abonniert auf `workflow.created`, `workflow.updated`, `workflow.deleted`
- **Heym**-Knoten mit `getWorkflow` und `heymWorkflowId` gesetzt auf `$platformEvents.events[0].workflow_id`
- **Slack**-Nachricht: `"$platformEvents.count workflow change(s), latest: $platformEvents.events[0].name"`

## Hinweise

- `heym.started` wird **einmal pro Plattformstart** ausgelöst, nicht einmal pro Worker, obwohl Heym acht Worker pro Container ausführt. Container, die mehr als fünf Minuten auseinander starten, veröffentlichen jeweils ein Ereignis.
- Auf diese Weise ausgelöste Ausführungen erscheinen im Verlauf mit `trigger_source = "heym_event"`.
- Setze **Events** auf keine statt alle vier aufzulisten, wenn du Ereignistypen, die in zukünftigen Versionen hinzugefügt werden, automatisch aufnehmen möchtest.

## Verwandtes

- [Heym](./heym-node.md) – Workflows und Ausführungsverlauf lesen
- [Triggers](../reference/triggers.md) – Übersicht aller Workflow-Einstiegspunkte
- [Loop](./loop-node.md) – Pro Ereignis in einem Batch einmal handeln
