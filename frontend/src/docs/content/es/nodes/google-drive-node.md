# Google Drive

El nodo **Google Drive** lista, descarga, actualiza y elimina archivos y carpetas en Google Drive mediante OAuth2. También puede copiar un archivo de Drive directamente a [Heym Drive](./drive-node.md) con una sola operación.

> **Este no es el nodo [Drive](./drive-node.md).** Ese nodo es *Heym Drive* — el almacenamiento de archivos interno propio de Heym. Este nodo se comunica con Google Drive. La operación `syncToHeymDrive` es el puente entre ambos.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Credencial | Google Drive (OAuth2) |
| Salida | `$nodeLabel.files`, `$nodeLabel.content_base64`, `$nodeLabel.download_url`, `$nodeLabel.status` |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial de Google Drive desde [Credenciales](../tabs/credentials-tab.md) |
| `gdOperation` | string | Operación: `listFolderFiles`, `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`, `removeFolder` |
| `gdFolderId` | expression | ID de carpeta o URL completa de la carpeta de Drive. Utilizado por `listFolderFiles` y `removeFolder`. Vacío significa la raíz de Drive. |
| `gdFileId` | expression | ID de archivo o URL completa de Drive/Docs. Utilizado por `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`. |
| `gdMaxResults` | expression | Para `listFolderFiles`: máximo de archivos a devolver (predeterminado 100). Vacío o `0` carga toda la carpeta mediante paginación. Cada archivo listado incluye `size_bytes` cuando Drive informa un tamaño. |
| `gdQuery` | expression | Para `listFolderFiles`: consulta adicional de Drive combinada con AND con el filtro de carpeta, por ejemplo `mimeType='application/pdf'`. |
| `gdIncludeTrashed` | boolean | Para `listFolderFiles`: incluir archivos en la papelera. Predeterminado false. |
| `gdExportFormat` | string | Para `downloadFile` / `syncToHeymDrive`: `pdf`, `docx`, `xlsx`, `pptx`, `csv`, `txt`. Vacío significa automático. Se ignora para archivos regulares. |
| `gdFilename` | expression | Para `syncToHeymDrive`: sobrescribir el nombre de archivo almacenado en Heym Drive. |
| `gdBase64Content` | expression | Para `updateFile`: cadena base64 o URL `data:` que reemplaza el contenido del archivo. |
| `gdNewName` | expression | Para `updateFile`: nuevo nombre de archivo (renombrar). |
| `gdNewParentId` | expression | Para `updateFile`: ID o URL de la carpeta de destino (mover). |
| `gdPermanentDelete` | boolean | Para `removeFile` / `removeFolder`: cuando es false (predeterminado) el elemento se mueve a la papelera y es recuperable; cuando es true se destruye. |

## IDs de archivos y carpetas

`gdFileId`, `gdFolderId` y `gdNewParentId` aceptan ya sea el **ID simple** o una **URL completa** — Heym extrae el ID automáticamente. Todos estos funcionan:

- `https://drive.google.com/file/d/1AbCdEf/view`
- `https://drive.google.com/drive/folders/1FolderXyz`
- `https://docs.google.com/document/d/1DocId/edit`
- `https://drive.google.com/open?id=1AbCdEf`
- `1AbCdEf`

## Google Docs, Sheets y Slides

Los documentos nativos de Google **no tienen bytes descargables**. Son registros en los servidores de Google, no archivos — la API de Drive devuelve `403 Only files with binary content can be downloaded` si se solicita su contenido sin procesar.

`downloadFile` y `syncToHeymDrive` los detectan automáticamente y **exportan** en su lugar, de modo que ninguna operación falla solo porque el destino sea un Google Doc:

| Origen | Exportación predeterminada |
|--------|----------------|
| Google Docs | PDF |
| Google Sheets | XLSX |
| Google Slides | PPTX |
| Cualquier otro tipo nativo de Google | PDF |

Establezca **Export Format** para sobrescribir el destino. La configuración se ignora para archivos cargados regulares, que siempre se descargan tal cual.

## Operaciones

| Operación | Requerido | Descripción |
|-----------|----------|-------------|
| `listFolderFiles` | — (carpeta vacía = raíz) | Listar archivos en una carpeta, con un filtro de consulta opcional |
| `downloadFile` | `gdFileId` | Descargar los bytes del archivo como base64, exportando documentos nativos automáticamente |
| `syncToHeymDrive` | `gdFileId` | Descargar desde Google Drive y almacenar el resultado en Heym Drive |
| `updateFile` | `gdFileId` + al menos uno de contenido / nombre / carpeta principal | Reemplazar contenido, renombrar y/o mover |
| `removeFile` | `gdFileId` | Mover a la papelera (predeterminado) o eliminar permanentemente un archivo |
| `removeFolder` | `gdFolderId` | Mover a la papelera (predeterminado) o eliminar permanentemente una carpeta y su contenido |

### La eliminación es recuperable de forma predeterminada

`removeFile` y `removeFolder` mueven el elemento a la **papelera de Google Drive**, donde puede restaurarse. Este es el valor predeterminado seguro para algo que puede ejecutarse según una programación o dentro de un [Loop](./loop-node.md).

Habilitar **Delete permanently** destruye el elemento sin posibilidad de recuperación. Para `removeFolder`, eso también destruye todo lo que contiene la carpeta.

El nodo también verifica el tipo de destino: `removeFile` rechaza una carpeta y `removeFolder` rechaza un archivo, de modo que un ID mal escrito no puede eliminar silenciosamente el elemento equivocado.

### updateFile deja los campos en blanco intactos

`updateFile` es una actualización, no un reemplazo. Complete cualquier combinación de contenido, nuevo nombre y nueva carpeta — lo que deje vacío no se modifica. Se requiere al menos uno de los tres.
## Configuración de credenciales

Google Drive utiliza un modelo **OAuth2 "Bring Your Own App"**. Usted proporciona sus propias credenciales OAuth2 de Google Cloud.

> **Esta credencial otorga acceso completo a Drive.** Heym solicita el scope `https://www.googleapis.com/auth/drive` porque el nodo opera sobre archivos que ya le pertenecen. El scope más restringido `drive.file` solo ve los archivos que la propia aplicación creó, lo que haría imposible listar, actualizar y eliminar sus archivos existentes. Consulte [Credential Sharing](../reference/credentials-sharing.md) antes de compartir esta credencial con un equipo.

**Configuración del backend:** Establezca **`FRONTEND_URL`** en el backend de Heym con la URL pública de la aplicación. El URI de redirección de OAuth es siempre `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` — se deriva únicamente de esta configuración, no de los encabezados de la solicitud.

1. Vaya a [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → habilite **Google Drive API**.
2. Vaya a **Credentials** → **Create Credentials** → **OAuth client ID** → seleccione **Web application**.
3. En **Authorized redirect URIs**, agregue exactamente `{your FRONTEND_URL}/api/credentials/google-drive/oauth/callback`.
4. Copie el **Client ID** y el **Client Secret**.
5. En Heym: **Dashboard → Credentials → New → Google Drive (OAuth2)**, pegue ambos valores, luego haga clic en **Connect** y apruebe el acceso en la ventana emergente.

## Output

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

`size_bytes` es `null` para carpetas y archivos nativos de Google, que no reportan un tamaño.

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

Para un archivo regular, `exported` es `false` y `export_format` es `null`.

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

`id` es el nuevo ID de archivo de **Heym Drive**, distinto de `google_file_id`.

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

`deleted` es `"trashed"` o `"permanent"`.

## Ejemplo: respaldar una carpeta de Drive en Heym Drive

1. **[Cron](./cron-node.md)** — ejecutar diariamente.
2. **Google Drive** — `listFolderFiles` en la carpeta de origen, con `gdQuery` establecido en `mimeType='application/pdf'` si solo desea archivos PDF.
3. **[Loop](./loop-node.md)** — iterar `$ListReports.files`.
4. **Google Drive** — `syncToHeymDrive` con `gdFileId` establecido en `$BackupLoop.item.id` y `gdFilename` establecido en `$BackupLoop.item.name`.
5. **[Slack](./slack-node.md)** — publicar un resumen de lo que se respaldó.

## Notas

- Cada campo de texto acepta expresiones `$`, por lo que los IDs y los nombres de archivo pueden provenir de nodos anteriores.
- Se admiten unidades compartidas — el nodo establece `supportsAllDrives` en cada solicitud.
- Las descargas se verifican en tamaño contra la configuración `FILE_MAX_SIZE_MB` del backend.
- Adjunte este nodo a la entrada de herramientas de un nodo [Agent](./agent-node.md) y utilice el icono del bot en cualquier campo para permitir que el agente lo complete en tiempo de ejecución.

## Véase también

- [Drive (Heym Drive)](./drive-node.md)
- [Google Sheets](./google-sheets-node.md)
- [Loop](./loop-node.md)
- [Credentials](../reference/credentials.md)
- [Credential Sharing](../reference/credentials-sharing.md)
