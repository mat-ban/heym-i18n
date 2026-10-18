# Google Drive-Trigger

Der **Google Drive-Trigger**-Knoten überwacht einen Google Drive-Ordner oder eine einzelne Datei und startet einen Workflow für jede neu erstellte, aktualisierte oder gelöschte Datei. Er dient als eingabefreier Trigger für Posteingangsordner, geteilte Vertragsordner und Berichtablagen.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 0 |
| Ausgaben | 1 |
| Ausgabe | `$nodeLabel.event`, `$nodeLabel.file`, `$nodeLabel.changed_fields`, `$nodeLabel.folder_id`, `$nodeLabel.triggered_at` |

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `credentialId` | UUID | Google Drive-Anmeldedaten (`google_drive`) |
| `gdtScope` | `folder` \| `file` | Dateien in einem Ordner überwachen (Standard) oder eine einzelne Datei |
| `gdtFolderId` | String | Ordner-ID oder -URL. Leer überwacht My Drive. Nur Dateien direkt im Ordner werden überwacht |
| `gdtFileId` | String | Datei-ID oder -URL für den Datei-Scope |
| `gdtEvents` | Array | Beliebige Kombination aus `created`, `updated`, `deleted` (Standard: alle drei). Der Datei-Scope unterstützt kein `created` |
| `gdtIncludeFolders` | Boolean | Unterordner selbst lösen ebenfalls Workflow-Ausführungen aus (Standard: deaktiviert) |
| `pollIntervalMinutes` | Integer | Abrufintervall in Minuten, in dem Heym Google Drive prüft (Minimum und Standard: 1) |

Diese Felder akzeptieren Standardwerte, keine `$`-Ausdrücke.

## Einrichtungsanleitung

1. Erstellen Sie **Google Drive (OAuth2)**-Anmeldedaten. Siehe [Drittanbieter-Integrationen](../reference/integrations.md#google-drive-oauth2).
2. Ziehen Sie den **Google Drive-Trigger** auf das Canvas und wählen Sie die Anmeldedaten aus.
3. Fügen Sie die Ordner-URL aus Ihrem Browser ein, wählen Sie die Ereignisse aus und speichern Sie.

## Trigger-Semantik

- Der erste Abruf erfasst den aktuellen Ist-Zustand des Ordners und startet keine Ausführungen. Erst nachfolgende Änderungen lösen Läufe aus.
- `created`: Eine Datei erscheint im Ordner (einschließlich hineinverschobener Dateien).
- `updated`: Dateiname, Änderungszeitpunkt, Dateigröße oder Dateityp haben sich geändert.
- `deleted`: Die Datei befindet sich nicht mehr im Ordner (in den Papierkorb verschoben, gelöscht oder herausverschoben). Im Datei-Scope gilt eine nicht mehr sichtbare Datei als gelöscht.
- Jede Änderung startet genau eine Ausführung mit `trigger_source = "google_drive"`, auch wenn Heym über mehrere Worker oder Instanzen verteilt läuft. Schlägt ein Start fehl, wird die Änderung beim nächsten Abruf erneut verarbeitet. Ein Serverabsturz im Moment zwischen Erfassung und Start kann diese Änderung verwerfen; ein doppelter Lauf findet niemals statt.
- Maximal 50 Ausführungen starten pro Abruf; weitere folgen in nachfolgenden Intervallen.
- Ordner mit mehr als 5.000 Dateien werden mit einer Warnung in den Logs übersprungen.
- Das Ändern von Anmeldedaten, Ordner, Datei oder Unterordner-Einstellung erfasst den Ordner neu ohne Ausführungen zu starten. Beim Deaktivieren des Knotens wird der Ordnerzustand verworfen; Änderungen während der Inaktivität starten keine Läufe.

## Ausgabefelder

| Ausdruck | Beschreibung |
|------------|-------------|
| `$nodeLabel.event` | `created`, `updated`, or `deleted` |
| `$nodeLabel.file.id` | Drive file ID |
| `$nodeLabel.file.name` | File name |
| `$nodeLabel.file.mime_type` | File type |
| `$nodeLabel.file.size_bytes` | Dateigröße in Bytes, `null` für Google Docs, Sheets, Slides und Ordner |
| `$nodeLabel.file.created_time` | Creation time |
| `$nodeLabel.file.modified_time` | Last modification time |
| `$nodeLabel.file.web_view_link` | Link to open the file |
| `$nodeLabel.file.is_folder` | `true` for subfolders |
| `$nodeLabel.changed_fields` | Fields that changed, on `updated` |
| `$nodeLabel.folder_id` | Watched folder, `root` for My Drive, `null` in file scope |
| `$nodeLabel.triggered_at` | When the change was seen |

Bei `deleted` enthält `file` die zuletzt von Heym erfassten Metadaten.

## Was Heym speichert

Heym speichert ausschließlich die Metadaten der überwachten Dateien (ID, Name, Typ, Größe, Zeitstempel, Link) zur Änderungserkennung. Dateiinhalte werden weder gelesen noch dauerhaft gespeichert.

## Beispiel-Workflow

**Neuer Vertrag im Ordner: Zusammenfassen und in Slack posten**

```
googleDriveTrigger → condition → googleDrive (syncToHeymDrive) → converter (pdfToText) → llm → slack
```

- **Condition**: `$contractsFolder.event == "created"`
- **Google Drive**: `gdFileId` is `$contractsFolder.file.id`

## Verwandte Themen

- [Google Drive](./google-drive-node.md): Datei lesen, aktualisieren oder entfernen, die den Lauf ausgelöst hat
- [Google Sheets Trigger](./google-sheets-trigger-node.md)
- [Triggers](../reference/triggers.md)
- [Credential Sharing](../reference/credentials-sharing.md)
