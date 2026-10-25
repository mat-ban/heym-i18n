# Heym

Der **Heym**-Knoten liest Heyms eigene Daten: die Workflows, auf die Sie zugreifen können, die Struktur eines einzelnen Workflows und dessen Ausführungsverlauf. So bauen Sie Meta-Workflows — Instanz-Inventare, Ausführungsübersichten und Health-Reports über Heym selbst.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 1 |
| Ausgaben | 1 |
| Operationen | `listWorkflows`, `getWorkflow`, `getExecutionHistory` |
| Anmeldedaten | Keine erforderlich |

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `heymOperation` | Select | Welche Leseoperation ausgeführt werden soll |
| `heymWorkflowId` | UUID | Setzen Sie ihn bei `getExecutionHistory` auf `all`, um jeden erreichbaren Workflow zu lesen. |
| `heymLimit` | String | Maximale Anzahl zurückzugebender Zeilen. **Leer lassen oder `0` eingeben, um alles zurückzugeben** — das ist der Standard. Ausdrucksfähig. |
| `heymStatus` | String | Optionaler Statusfilter für `getExecutionHistory`. Ausdrucksfähig. |
| `heymSinceDays` | String | Optionaler Rückblick in Tagen für `getExecutionHistory`. Ausdrucksfähig. |

Die Workflow-Auswahl ist ein durchsuchbares Dropdown, das jeden Workflow auflistet, auf den Sie zugreifen können. Bei {GEH} ist der erste Eintrag **{AW}**. Bei {GEH} ist der erste Eintrag **{AW}**.

## Zugriffsbereich

Die Ergebnisse sind auf den **Eigentümer des Workflows, in dem der Knoten liegt**, beschränkt — nicht auf die Person, die den Lauf gestartet hat. Die sichtbare Menge umfasst:

- Workflows, deren Eigentümer der Eigentümer ist,
- Workflows, die direkt mit dem Eigentümer geteilt wurden,
- Workflows, die mit einem Team geteilt wurden, dem der Eigentümer angehört.

Die Eigentümer-Beschränkung sorgt dafür, dass sich der Knoten identisch verhält, egal ob ein Lauf manuell, per Cron, aus einem Portal oder durch ein Plattform-Ereignis gestartet wurde. Eine Akteur-Beschränkung würde bei jedem unbeaufsichtigten Lauf nichts zurückgeben. Es ist dieselbe Regel, die Heym bereits für Anmeldedaten und globale Variablen verwendet.

Ein Workflow, auf den Sie nicht zugreifen können, und ein Workflow, der nicht existiert, erzeugen dieselbe Fehlermeldung, sodass der Knoten nicht zum Ausspähen von Workflow-IDs verwendet werden kann.

## Operationen

### Workflows auflisten

Gibt jeden Workflow zurück, auf den der Eigentümer zugreifen kann, zuletzt aktualisierte zuerst.

| Ausdruck | Beschreibung |
|------------|-------------|
| `$nodeLabel.workflows` | Array von Workflow-Zusammenfassungen |
| `$nodeLabel.workflows[0].id` | Workflow-UUID |
| `$nodeLabel.workflows[0].name` | Workflow-Name |
| `$nodeLabel.workflows[0].description` | Beschreibung oder `null` |
| `$nodeLabel.workflows[0].active` | Ob der Workflow aktiv ist |
| `$nodeLabel.workflows[0].folder_id` | Ordner-UUID oder `null` |
| `$nodeLabel.workflows[0].updated_at` | ISO-Zeitstempel der letzten Speicherung |
| `$nodeLabel.workflows[0].node_count` | Wie viele Knoten der Workflow enthält |
| `$nodeLabel.total` | Vollständige zugängliche Anzahl **bevor** das Limit angewendet wird |

`total` ist bewusst die unbegrenzte Anzahl, sodass `$inventory.total` auch dann die tatsächliche Größe meldet, wenn Sie die zurückgegebenen Zeilen begrenzen. Wenn Sie **Limit** leeren oder auf `0` setzen, werden alle Workflows zurückgegeben — das ist der Standard.

### Workflow abrufen

Gibt die Identität und Struktur eines Workflows zurück.

| Ausdruck | Beschreibung |
|------------|-------------|
| `$nodeLabel.id`, `$nodeLabel.name`, `$nodeLabel.description` | Workflow-Identität |
| `$nodeLabel.active`, `$nodeLabel.folder_id`, `$nodeLabel.updated_at` | Workflow-Metadaten |
| `$nodeLabel.node_count` | Anzahl der Knoten |
| `$nodeLabel.nodes` | Array von `{ id, type, label, position, data }` |
| `$nodeLabel.edges` | Array von `{ id, source, target, sourceHandle, targetHandle }` |

`data` ist die **vollständige Knotenkonfiguration** — jedes Feld so, wie es gespeichert wurde. Das macht Auditing möglich: Sie können einen Workflow nicht nach einem API-Schlüssel durchsuchen, den jemand in ein Feld eingefügt hat, wenn der Knoten sich weigert, das Feld anzuzeigen.

Dies gewährt keinen Zugriff, den der Aufrufer nicht ohnehin schon hatte. Der Knoten ist auf Workflows beschränkt, die der Eigentümer sowieso im Editor öffnen kann, und gespeicherte Anmeldedaten-Geheimnisse sind weiterhin nicht enthalten: Knotendaten enthalten nur Anmeldedaten-**IDs**, während die Geheimnisse selbst verschlüsselt in der Anmeldedaten-Tabelle liegen.

### Suche nach fest codierten Geheimnissen

```
cron → heym (listWorkflows) → loop → heym (getWorkflow) → agent → slack
```

Geben Sie dem Agenten `$detail.nodes` und bitten Sie ihn, jeden `data`-Wert zu markieren, der wie ein aktiver Schlüssel oder Token aussieht. Beachtenswerte Felder sind die Freitext-Felder — `curl` bei HTTP-Knoten, `userMessage` und `systemInstruction` bei LLM- und Agent-Knoten sowie Python-Tool-Bodies —, denn eine Anmeldedaten-ID ist eine harmlose UUID, ein eingefügtes `sk-…` hingegen nicht.
### Ausführungsverlauf abrufen

Gibt Verlaufs-Einträge für einen Workflow zurück, neueste zuerst.

| Ausdruck | Beschreibung |
|------------|-------------|
| `$nodeLabel.executions` | Array von Verlaufs-Einträgen |
| `$nodeLabel.executions[0].id` | Ausführungs-UUID |
| `$nodeLabel.executions[0].status` | `success`, `error` und so weiter |
| `$nodeLabel.executions[0].started_at` | ISO-Zeitstempel |
| `$nodeLabel.executions[0].execution_time_ms` | Tatsächliche Laufzeit |
| `$nodeLabel.executions[0].trigger_source` | Was den Lauf gestartet hat, zum Beispiel `cron` oder `heym_event` |
| `$nodeLabel.executions[0].recovered` | Ob der Lauf nach einem Absturz wiederhergestellt wurde |
| `$nodeLabel.executions[0].inputs` | Was der Lauf empfangen hat – die Trigger-Payload oder die Eingabe des Aufrufers |
| `$nodeLabel.executions[0].outputs` | Die Ausgabe des Workflows für diesen Lauf |
| `$nodeLabel.workflow_id`, `$nodeLabel.workflow_name` | Der Workflow, zu dem der Verlauf gehört, oder `null` bei **{AW}** |
der `null` bei **{AW}** |
| `$nodeLabel.total` | Gesamtzahl der passenden Ausführungen **vor** dem Limit |
| `$no| `$nodeLabel.executions[0].workflow_id`, `$nodeLabel.executions[0].workflow_name` | Bei **{AW}** der Workflow, zu dem jeder Lauf gehört |
deLabel.by_status` | Zählungen nach Status, zum Beispiel `{ "success": 41, "error": 3 }` |
| `$nodeLabel.since` | Beginn des Zeitfensters oder `null` für den vollständigen Verlauf |

Einträge enthalten sowohl `inputs` als auch `outputs` – was der Lauf empfangen und was er geantwortet hat –, aber niemals `node_results`: Der Trace pro Knoten ist die größte Spalte in der Tabelle und würde alles Nachgelagerte in den Schatten stellen. Rufe eine einzelne Ausführung über die API ab, wenn du den vollständigen Trace benötigst.

`total` und `by_status` beschreiben immer den **gesamten** passenden Verlauf, selbst wenn **Limit** die zurückgegebenen Einträge begrenzt – so kannst du die fünf neuesten Läufe abrufen und dennoch eine korrekte Fehleranzahl melden.

Lasse **Since (days)** leer, um alles abzudecken, **Status filter** leer, um jeden Status einzuschließen, und **Limit** leer oder `0`, um jeden Eintrag zurückzugeben.

## Beispiel-Workflow

**Tägliche Instanz-Zusammenfassung**

```
cron → heym (listWorkflows) → loop → heym (getExecutionHistory) → llm → sendEmail
```

- **Heym** `listWorkflows` mit der Bezeichnung `inventory`
- **Loop** über `$inventory.workflows`
- **Heym** `getExecutionHistory` mit `heymWorkflowId` auf die `id` des Loop-Elements gesetzt, `heymSinceDays` auf `1` und `heymLimit` auf `5`
- **LLM** verwandelt die gesammelten Läufe und Status-Zählungen in eine lesbare Zusammenfassung

## Hinweise

- Es ist keine Anmeldedaten erforderlich; der Knoten liest dieselbe Datenbank, auf der Heym läuft.
- **Limit** ist dasselbe Feld für beide Listen-Operationen und bedeutet in beiden dasselbe: leer oder `0` gibt alles zurück.
- Der Knoten nimmt eine normale Eingabe entgegen und kann als Tool an einen Agent-Knoten angehängt werden, sodass ein Agent Fragen zu deiner Heym-Instanz beantworten – oder sie prüfen – kann.
- `getWorkflow`-Payloads wachsen mit dem Workflow: lange Prompts und Python-Tool-Bodies werden alle innerhalb von `data` übertragen.
- Kombiniere es mit [Heym Trigger](./heym-trigger-node.md), um auf Workflow-Änderungen zu reagieren, sobald sie auftreten, statt nach einem Zeitplan zu pollen.

## Verwandte Themen

- [Heym Trigger](./heym-trigger-node.md) – Starte einen Workflow aus Plattform-Ereignissen
- [Execute](./execute-node.md) – Führe einen anderen Workflow aus, statt ihn zu beschreiben
- [Loop](./loop-node.md) – Iteriere über die zurückgegebene Workflow-Liste
