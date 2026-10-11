# Google Drive

Der **Google Drive**-Knoten listet Dateien und Ordner in Google Drive auf, lädt sie herunter, aktualisiert sie und löscht sie über OAuth2. Er kann außerdem eine Drive-Datei mit einer einzigen Operation direkt in [Heym Drive](./drive-node.md) kopieren.

> **Dies ist nicht der [Drive](./drive-node.md)-Knoten.** Dieser Knoten ist *Heym Drive* — Heyms eigener interner Dateispeicher. Dieser Knoten kommuniziert mit Google Drive. Die Operation `syncToHeymDrive` ist die Brücke zwischen den beiden.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 1 |
| Ausgaben | 1 |
| Anmeldedaten | Google Drive (OAuth2) |
| Ausgabe | `$nodeLabel.files`, `$nodeLabel.content_base64`, `$nodeLabel.download_url`, `$nodeLabel.status` |

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `credentialId` | UUID | Google Drive-Anmeldedaten aus [Anmeldedaten](../tabs/credentials-tab.md) |
| `gdOperation` | string | Operation: `listFolderFiles`, `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`, `removeFolder` |
| `gdFolderId` | expression | Ordner-ID oder vollständige Drive-Ordner-URL. Wird von `listFolderFiles` und `removeFolder` verwendet. Leer bedeutet das Drive-Stammverzeichnis. |
| `gdFileId` | expression | Datei-ID oder vollständige Drive/Docs-URL. Wird von `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile` verwendet. |
| `gdMaxResults` | expression | Für `listFolderFiles`: maximale Anzahl zurückzugebender Dateien (Standard 100). Leer oder `0` lädt den gesamten Ordner über Paging. Jede aufgelistete Datei enthält `size_bytes`, wenn Drive eine Größe meldet. |
| `gdQuery` | expression | Für `listFolderFiles`: zusätzliche Drive-Abfrage, die mit dem Ordnerfilter per AND verknüpft wird, z. B. `mimeType='application/pdf'`. |
| `gdIncludeTrashed` | boolean | Für `listFolderFiles`: gelöschte Dateien einschließen. Standard false. |
| `gdExportFormat` | string | Für `downloadFile` / `syncToHeymDrive`: `pdf`, `docx`, `xlsx`, `pptx`, `csv`, `txt`. Leer bedeutet automatisch. Wird für reguläre Dateien ignoriert. |
| `gdFilename` | expression | Für `syncToHeymDrive`: den in Heym Drive gespeicherten Dateinamen überschreiben. |
| `gdBase64Content` | expression | Für `updateFile`: base64-String oder `data:`-URL, der/die den Dateiinhalt ersetzt. |
| `gdNewName` | expression | Für `updateFile`: neuer Dateiname (Umbenennen). |
| `gdNewParentId` | expression | Für `updateFile`: Zielordner-ID oder URL (Verschieben). |
| `gdPermanentDelete` | boolean | Für `removeFile` / `removeFolder`: wenn false (Standard), wird das Element in den Papierkorb verschoben und ist wiederherstellbar; wenn true, wird es endgültig zerstört. |

## Datei- und Ordner-IDs

`gdFileId`, `gdFolderId` und `gdNewParentId` akzeptieren entweder die **reine ID** oder eine **vollständige URL** — Heym extrahiert die ID automatisch. All diese funktionieren:

- `https://drive.google.com/file/d/1AbCdEf/view`
- `https://drive.google.com/drive/folders/1FolderXyz`
- `https://docs.google.com/document/d/1DocId/edit`
- `https://drive.google.com/open?id=1AbCdEf`
- `1AbCdEf`

## Google Docs, Sheets und Slides

Google-native Dokumente haben **keine herunterladbaren Bytes**. Sie sind Datensätze auf Googles Servern, keine Dateien — die Drive-API gibt `403 Only files with binary content can be downloaded` zurück, wenn Sie deren Rohinhalt anfordern.

`downloadFile` und `syncToHeymDrive` erkennen diese automatisch und **exportieren** stattdessen, sodass keine Operation fehlschlägt, nur weil das Ziel ein Google Doc ist:

| Quelle | Standardexport |
|--------|----------------|
| Google Docs | PDF |
| Google Sheets | XLSX |
| Google Slides | PPTX |
| Jeder andere Google-native Typ | PDF |

Legen Sie das **Export Format** fest, um das Ziel zu überschreiben. Die Einstellung wird für regulär hochgeladene Dateien ignoriert, die immer unverändert heruntergeladen werden.

## Operationen

| Operation | Erforderlich | Beschreibung |
|-----------|----------|-------------|
| `listFolderFiles` | — (leerer Ordner = Stammverzeichnis) | Dateien in einem Ordner auflisten, mit optionalem Abfragefilter |
| `downloadFile` | `gdFileId` | Datei-Bytes als base64 herunterladen, native Docs automatisch exportieren |
| `syncToHeymDrive` | `gdFileId` | Von Google Drive herunterladen und das Ergebnis in Heym Drive speichern |
| `updateFile` | `gdFileId` + mindestens eines von Inhalt / Name / übergeordneter Ordner | Inhalt ersetzen, umbenennen und/oder verschieben |
| `removeFile` | `gdFileId` | Eine Datei in den Papierkorb verschieben (Standard) oder endgültig löschen |
| `removeFolder` | `gdFolderId` | Einen Ordner und dessen Inhalt in den Papierkorb verschieben (Standard) oder endgültig löschen |

### Löschen ist standardmäßig wiederherstellbar

`removeFile` und `removeFolder` verschieben das Element in den **Google Drive-Papierkorb**, wo es wiederhergestellt werden kann. Dies ist der sichere Standard für etwas, das nach einem Zeitplan oder innerhalb einer [Loop](./loop-node.md) ausgeführt werden könnte.

Das Aktivieren von **Delete permanently** zerstört das Element ohne Wiederherstellung. Bei `removeFolder` zerstört das auch alles innerhalb des Ordners.

Der Knoten prüft außerdem den Zieltyp: `removeFile` lehnt einen Ordner ab und `removeFolder` lehnt eine Datei ab, sodass eine falsch eingegebene ID nicht stillschweigend das Falsche löschen kann.

### updateFile lässt leere Felder unberührt

`updateFile` ist eine Aktualisierung, kein Ersetzen. Füllen Sie eine beliebige Kombination aus Inhalt, neuem Namen und neuem Ordner — was Sie leer lassen, wird nicht angetastet. Mindestens eines der drei ist erforderlich.
## Anmeldedaten einrichten

Google Drive verwendet ein **OAuth2-"Bring Your Own App"**-Modell. Du stellst deine eigenen Google Cloud OAuth2-Anmeldedaten bereit.

> **Diese Anmeldedaten gewähren vollständigen Drive-Zugriff.** Heym fordert den Scope `https://www.googleapis.com/auth/drive` an, da der Knoten auf Dateien arbeitet, die dir bereits gehören. Der engere Scope `drive.file` sieht nur Dateien, die die App selbst erstellt hat, was das Auflisten, Aktualisieren und Löschen deiner vorhandenen Dateien unmöglich machen würde. Siehe [Anmeldedaten teilen](../reference/credentials-sharing.md), bevor du diese Anmeldedaten mit einem Team teilst.

**Backend-Konfiguration:** Setze **`FRONTEND_URL`** auf dem Heym-Backend auf die öffentliche URL der App. Die OAuth-Redirect-URI ist immer `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` — sie wird ausschließlich aus dieser Einstellung abgeleitet, nicht aus Request-Headern.

1. Gehe zur [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → aktiviere die **Google Drive API**.
2. Gehe zu **Credentials** → **Create Credentials** → **OAuth client ID** → wähle **Web application**.
3. Füge unter **Authorized redirect URIs** exakt `{your FRONTEND_URL}/api/credentials/google-drive/oauth/callback` hinzu.
4. Kopiere die **Client ID** und das **Client Secret**.
5. In Heym: **Dashboard → Credentials → New → Google Drive (OAuth2)**, füge beide Werte ein und klicke dann auf **Connect** und bestätige den Zugriff im Popup.

## Ausgabe

### listFolderFiles

```json
{
  "status": "success",
  "operation": "listFolderFiles",
  "folder_id": "1FolderXyz",
  "count": 2,
  "files": [
    {
      "id": "1AbC",
      "name": "report.pdf",
      "mime_type": "application/pdf",
      "size_bytes": 20481,
      "modified_time": "2026-07-01T10:00:00.000Z",
      "web_view_link": "https://drive.google.com/file/d/1AbC/view",
      "is_folder": false
    }
  ]
}
```

`size_bytes` ist `null` für Ordner und Google-native Dateien, die keine Größe melden.

### downloadFile

```json
{
  "status": "success",
  "operation": "downloadFile",
  "id": "1AbC",
  "filename": "Notes.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "exported": true,
  "export_format": "pdf",
  "content_base64": "JVBERi0xLjQ..."
}
```

Bei einer regulären Datei ist `exported` `false` und `export_format` ist `null`.

### syncToHeymDrive

```json
{
  "status": "success",
  "operation": "syncToHeymDrive",
  "id": "9f1c2b3d-0000-4000-8000-000000000001",
  "google_file_id": "1AbC",
  "filename": "Notes.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "exported": true,
  "download_url": "https://your-heym-domain/api/files/dl/TOKEN"
}
```

`id` ist die neue **Heym Drive**-Datei-ID, verschieden von `google_file_id`.

### updateFile

```json
{
  "status": "success",
  "operation": "updateFile",
  "id": "1AbC",
  "name": "renamed.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "modified_time": "2026-07-27T10:00:00.000Z",
  "updated": ["content", "name"]
}
```

### removeFile / removeFolder

```json
{
  "status": "success",
  "operation": "removeFile",
  "id": "1AbC",
  "name": "report.pdf",
  "deleted": "trashed"
}
```

`deleted` ist `"trashed"` oder `"permanent"`.

## Beispiel: Einen Drive-Ordner in Heym Drive sichern

1. **[Cron](./cron-node.md)** — täglich ausführen.
2. **Google Drive** — `listFolderFiles` auf dem Quellordner, mit `gdQuery` auf `mimeType='application/pdf'` gesetzt, wenn du nur PDFs möchtest.
3. **[Loop](./loop-node.md)** — über `$ListReports.files` iterieren.
4. **Google Drive** — `syncToHeymDrive` mit `gdFileId` auf `$BackupLoop.item.id` gesetzt und `gdFilename` auf `$BackupLoop.item.name` gesetzt.
5. **[Slack](./slack-node.md)** — eine Zusammenfassung dessen posten, was gesichert wurde.

## Hinweise

- Jedes Textfeld akzeptiert `$`-Ausdrücke, sodass IDs und Dateinamen aus vorherigen Knoten stammen können.
- Geteilte Laufwerke werden unterstützt — der Knoten setzt `supportsAllDrives` bei jeder Anfrage.
- Downloads werden gegen die `FILE_MAX_SIZE_MB`-Einstellung des Backends auf ihre Größe geprüft.
- Hänge diesen Knoten an die Tool-Eingabe eines [Agent](./agent-node.md)-Knotens an und verwende das Bot-Symbol an einem beliebigen Feld, damit der Agent es zur Laufzeit ausfüllen kann.

## Siehe auch

- [Drive (Heym Drive)](./drive-node.md)
- [Google Sheets](./google-sheets-node.md)
- [Loop](./loop-node.md)
- [Anmeldedaten](../reference/credentials.md)
- [Anmeldedaten teilen](../reference/credentials-sharing.md)
