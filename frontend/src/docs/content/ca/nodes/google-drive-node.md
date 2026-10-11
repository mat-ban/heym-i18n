# Google Drive

El node **Google Drive** llista, descarrega, actualitza i elimina fitxers i carpetes de Google Drive mitjançant OAuth2. També pot copiar un fitxer de Drive directament a [Heym Drive](./drive-node.md) amb una sola operació.

> **Aquest no és el node [Drive](./drive-node.md).** Aquell node és *Heym Drive* — l'emmagatzematge de fitxers intern propi de Heym. Aquest node es comunica amb Google Drive. L'operació `syncToHeymDrive` és el pont entre tots dos.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Credencial | Google Drive (OAuth2) |
| Sortida | `$nodeLabel.files`, `$nodeLabel.content_base64`, `$nodeLabel.download_url`, `$nodeLabel.status` |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial de Google Drive de [Credencials](../tabs/credentials-tab.md) |
| `gdOperation` | string | Operació: `listFolderFiles`, `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`, `removeFolder` |
| `gdFolderId` | expression | ID de carpeta o URL completa de carpeta de Drive. Utilitzat per `listFolderFiles` i `removeFolder`. Buit significa l'arrel de Drive. |
| `gdFileId` | expression | ID de fitxer o URL completa de Drive/Docs. Utilitzat per `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`. |
| `gdMaxResults` | expression | Per a `listFolderFiles`: nombre màxim de fitxers a retornar (per defecte 100). Buit o `0` carrega tota la carpeta mitjançant paginació. Cada fitxer llistat inclou `size_bytes` quan Drive informa d'una mida. |
| `gdQuery` | expression | Per a `listFolderFiles`: consulta de Drive addicional combinada amb AND amb el filtre de carpeta, p. ex. `mimeType='application/pdf'`. |
| `gdIncludeTrashed` | boolean | Per a `listFolderFiles`: inclou fitxers a la paperera. Per defecte false. |
| `gdExportFormat` | string | Per a `downloadFile` / `syncToHeymDrive`: `pdf`, `docx`, `xlsx`, `pptx`, `csv`, `txt`. Buit significa automàtic. S'ignora per a fitxers normals. |
| `gdFilename` | expression | Per a `syncToHeymDrive`: sobreescriu el nom de fitxer emmagatzemat a Heym Drive. |
| `gdBase64Content` | expression | Per a `updateFile`: cadena base64 o URL `data:` que substitueix el contingut del fitxer. |
| `gdNewName` | expression | Per a `updateFile`: nou nom de fitxer (canvi de nom). |
| `gdNewParentId` | expression | Per a `updateFile`: ID o URL de la carpeta de destinació (moure). |
| `gdPermanentDelete` | boolean | Per a `removeFile` / `removeFolder`: quan és false (per defecte) l'element es mou a la paperera i és recuperable; quan és true es destrueix. |

## IDs de fitxers i carpetes

`gdFileId`, `gdFolderId` i `gdNewParentId` accepten tant l'**ID simple** com una **URL completa** — Heym extreu l'ID automàticament. Tots aquests funcionen:

- `https://drive.google.com/file/d/1AbCdEf/view`
- `https://drive.google.com/drive/folders/1FolderXyz`
- `https://docs.google.com/document/d/1DocId/edit`
- `https://drive.google.com/open?id=1AbCdEf`
- `1AbCdEf`

## Google Docs, Sheets i Slides

Els documents natius de Google **no tenen bytes descarregables**. Són registres als servidors de Google, no fitxers — l'API de Drive retorna `403 Only files with binary content can be downloaded` si sol·liciteu el seu contingut en brut.

`downloadFile` i `syncToHeymDrive` els detecten automàticament i **exporten** en el seu lloc, de manera que cap operació falla només perquè l'objectiu sigui un Google Doc:

| Origen | Exportació per defecte |
|--------|----------------|
| Google Docs | PDF |
| Google Sheets | XLSX |
| Google Slides | PPTX |
| Qualsevol altre tipus natiu de Google | PDF |

Establiu **Export Format** per sobreescriure l'objectiu. El paràmetre s'ignora per a fitxers pujats normals, que sempre es descarreguen tal com són.

## Operacions

| Operació | Obligatori | Descripció |
|-----------|----------|-------------|
| `listFolderFiles` | — (carpeta buida = arrel) | Llista fitxers d'una carpeta, amb un filtre de consulta opcional |
| `downloadFile` | `gdFileId` | Descarrega els bytes del fitxer com a base64, exportant documents natius automàticament |
| `syncToHeymDrive` | `gdFileId` | Descarrega de Google Drive i emmagatzema el resultat a Heym Drive |
| `updateFile` | `gdFileId` + almenys un de contingut / nom / pare | Substitueix contingut, canvia el nom i/o mou |
| `removeFile` | `gdFileId` | Mou a la paperera (per defecte) o elimina permanentment un fitxer |
| `removeFolder` | `gdFolderId` | Mou a la paperera (per defecte) o elimina permanentment una carpeta i el seu contingut |

### L'eliminació és recuperable per defecte

`removeFile` i `removeFolder` mouen l'element a la **paperera de Google Drive**, on es pot restaurar. Aquest és el comportament segur per defecte per a quelcom que pot executar-se segons una programació o dins d'un [Loop](./loop-node.md).

Activar **Delete permanently** destrueix l'element sense possibilitat de recuperació. Per a `removeFolder`, això també destrueix tot el que hi ha dins de la carpeta.

El node també comprova el tipus d'objectiu: `removeFile` rebutja una carpeta i `removeFolder` rebutja un fitxer, de manera que un ID escrit incorrectament no pot eliminar silenciosament l'element equivocat.

### updateFile deixa els camps buits intactes

`updateFile` és una actualització, no una substitució. Ompliu qualsevol combinació de contingut, nom nou i carpeta nova — tot el que deixeu buit no es toca. Cal almenys un dels tres.
## Configuració de credencials

Google Drive utilitza un model **OAuth2 "Bring Your Own App"**. Heu de proporcionar les vostres pròpies credencials OAuth2 de Google Cloud.

> **Aquesta credencial atorga accés complet a Drive.** Heym sol·licita l'àmbit `https://www.googleapis.com/auth/drive` perquè el node opera sobre fitxers que ja són vostres. L'àmbit més restringit `drive.file` només veu els fitxers que l'aplicació mateixa ha creat, cosa que faria impossible llistar, actualitzar i eliminar els vostres fitxers existents. Consulteu [Credential Sharing](../reference/credentials-sharing.md) abans de compartir aquesta credencial amb un equip.

**Configuració del backend:** Establiu **`FRONTEND_URL`** al backend de Heym amb l'URL públic de l'aplicació. L'URI de redirecció OAuth és sempre `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` — es deriva únicament d'aquesta configuració, no de les capçaleres de la petició.

1. Aneu a [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → activeu **Google Drive API**.
2. Aneu a **Credentials** → **Create Credentials** → **OAuth client ID** → seleccioneu **Web application**.
3. A **Authorized redirect URIs**, afegiu exactament `{your FRONTEND_URL}/api/credentials/google-drive/oauth/callback`.
4. Copieu el **Client ID** i el **Client Secret**.
5. A Heym: **Dashboard → Credentials → New → Google Drive (OAuth2)**, enganxeu tots dos valors i feu clic a **Connect** i approveu l'accés a la finestra emergent.

## Sortida

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

`size_bytes` és `null` per a carpetes i fitxers natius de Google, que no informen d'una mida.

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

Per a un fitxer normal, `exported` és `false` i `export_format` és `null`.

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

`id` és l'ID del nou fitxer de **Heym Drive**, diferent de `google_file_id`.

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

`deleted` és `"trashed"` o `"permanent"`.

## Exemple: fer una còpia de seguretat d'una carpeta de Drive a Heym Drive

1. **[Cron](./cron-node.md)** — executeu-ho diàriament.
2. **Google Drive** — `listFolderFiles` a la carpeta d'origen, amb `gdQuery` establert a `mimeType='application/pdf'` si només voleu PDF.
3. **[Loop](./loop-node.md)** — itereu `$ListReports.files`.
4. **Google Drive** — `syncToHeymDrive` amb `gdFileId` establert a `$BackupLoop.item.id` i `gdFilename` establert a `$BackupLoop.item.name`.
5. **[Slack](./slack-node.md)** — publiqueu un resum del que s'ha copiat.

## Notes

- Tots els camps de text accepten expressions `$`, de manera que els IDs i els noms de fitxer poden provenir de nodes anteriors.
- Els discs compartits són compatibles — el node estableix `supportsAllDrives` a cada petició.
- Les descàrregues es comproven quant a mida respecte a la configuració `FILE_MAX_SIZE_MB` del backend.
- Adjunteu aquest node a l'entrada d'eines d'un node [Agent](./agent-node.md) i utilitzeu la icona del bot a qualsevol camp perquè l'agent el pugui omplir en temps d'execució.

## Vegeu també

- [Drive (Heym Drive)](./drive-node.md)
- [Google Sheets](./google-sheets-node.md)
- [Loop](./loop-node.md)
- [Credentials](../reference/credentials.md)
- [Credential Sharing](../reference/credentials-sharing.md)
