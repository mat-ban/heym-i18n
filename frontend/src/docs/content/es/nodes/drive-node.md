# Nodo Drive

El nodo **Drive** gestiona los archivos generados por las skills directamente desde un workflow. Utilícelo para recuperar archivos, descargar archivos desde URL externas, eliminarlos, compartirlos o dejar de compartirlos con sus equipos, o actualizar sus restricciones de acceso (contraseña, caducidad, límite de descargas) de forma programática.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Salida | `$nodeLabel.files`, `$nodeLabel.status`, `$nodeLabel.file_id`, `$nodeLabel.download_url` (varía según la operación) |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `driveOperation` | string | Operación: `get`, `getAll`, `downloadUrl`, `save`, `delete`, `setPassword`, `setTtl`, `setMaxDownloads`, `shareWithMyTeams`, `unshareWithMyTeams` |
| `driveFileId` | expression / select | UUID del archivo de Drive que se va a gestionar (todas las operaciones excepto `getAll`, `downloadUrl` y `save`) |
| `driveLimit` | number | Número máximo de archivos a devolver (solo `getAll`; vacío significa sin límite) |
| `driveSourceUrl` | expression | URL que se va a obtener y almacenar en Drive (solo `downloadUrl`) |
| `driveFilename` | expression | Nombre de archivo completo, incluida la extensión (solo `save`, por ejemplo `1.mp3`) |
| `driveBase64Content` | expression | Cadena base64 sin procesar o data URL que se va a decodificar y almacenar (solo `save`) |
| `driveIncludeBinary` | boolean | Incluir el contenido del archivo como base64 en la salida (solo `get`) |
| `drivePassword` | expression | Contraseña que se va a establecer en el token de acceso (solo `setPassword`) |
| `driveTtlHours` | number | Horas hasta que caduque el enlace de descarga (solo `setTtl`) |
| `driveMaxDownloads` | number | Número máximo de descargas permitidas (solo `setMaxDownloads`) |

## Obtención del File ID

Cuando una skill genera archivos, la salida incluye un array `_generated_files`. Cada entrada incluye un campo `id`:

```json
{
  "_generated_files": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "filename": "report.pdf",
      "mime_type": "application/pdf",
      "size_bytes": 45231,
      "download_url": "https://your-domain.com/api/files/dl/abc123..."
    }
  ]
}
```

Haga referencia al file ID con: `$agentLabel._generated_files[0].id`

## Operaciones

| Operación | Campos obligatorios | Descripción |
|-----------|----------------|-------------|
| `get` | driveFileId | Recuperar los metadatos del archivo (y, opcionalmente, el contenido binario) desde Drive |
| `getAll` | ninguno | Listar los archivos de Drive legibles propios y compartidos con el equipo, con metadatos como nombre de archivo, tipo MIME, tamaño, origen y URL de descarga |
| `downloadUrl` | driveSourceUrl | Obtener un archivo desde una URL externa y almacenarlo en Drive |
| `save` | driveFilename, driveBase64Content | Decodificar el contenido base64 y almacenarlo como un archivo de Drive |
| `delete` | driveFileId | Eliminar el archivo y todos sus tokens de acceso del disco y de la base de datos |
| `setPassword` | driveFileId, drivePassword | Sustituir el token público predeterminado por uno protegido con contraseña |
| `setTtl` | driveFileId, driveTtlHours | Sustituir el token público predeterminado por uno que caduque tras N horas |
| `setMaxDownloads` | driveFileId, driveMaxDownloads | Sustituir el token público predeterminado por uno limitado a N descargas |
| `shareWithMyTeams` | driveFileId | Compartir el archivo en modo solo lectura con todos los equipos a los que pertenece actualmente el propietario del workflow |
| `unshareWithMyTeams` | driveFileId | Eliminar todas las comparticiones de equipo del archivo |

> **Nota:** Las operaciones `set*` eliminan el token público predeterminado (sin restricciones) y crean uno nuevo con la restricción especificada. El `download_url` actualizado se incluye en la salida.
> **Compartición con equipos:** `shareWithMyTeams` crea comparticiones explícitas para los equipos actuales del propietario. Los equipos futuros no se añaden automáticamente a menos que la operación se ejecute de nuevo. `unshareWithMyTeams` elimina todas las comparticiones de equipo del archivo.

## Ejemplo — Descargar archivo desde URL

```json
{
  "type": "drive",
  "data": {
    "label": "fetchReport",
    "driveOperation": "downloadUrl",
    "driveSourceUrl": "https://example.com/reports/q1.pdf"
  }
}
```

Haga referencia al archivo almacenado en etapas posteriores: `$fetchReport.id`, `$fetchReport.download_url`

El nombre de archivo se toma del encabezado de respuesta `Content-Disposition`; si no está presente, se deriva de la ruta de la URL.

## Ejemplo — Guardar una entrada Base64 en Drive

Utilice esto cuando un nodo de entrada de texto (o cualquier nodo anterior) proporcione contenido de archivo en base64:

```json
{
  "type": "drive",
  "data": {
    "label": "saveAudio",
    "driveOperation": "save",
    "driveFilename": "$userInput.body.filename",
    "driveBase64Content": "$userInput.body.base64"
  }
}
```

Haga referencia al archivo almacenado en etapas posteriores: `$saveAudio.id`, `$saveAudio.download_url`

`driveBase64Content` acepta una cadena base64 sin procesar o una data URL `data:...;base64,...`. El tipo MIME se infiere a partir de la extensión del nombre de archivo.
## Ejemplo — Obtener archivo y usar binario en Vision LLM

```json
{
  "type": "drive",
  "data": {
    "label": "fetchImage",
    "driveOperation": "get",
    "driveFileId": "550e8400-e29b-41d4-a716-446655440000",
    "driveIncludeBinary": true
  }
}
```

Haga referencia al contenido base64 en las etapas posteriores: `$fetchImage.file_base64`

Las imágenes devueltas mediante `file_base64` se muestran en línea en el panel de depuración cuando ejecuta el workflow.

## Ejemplo — Listar archivos de Drive

```json
{
  "type": "drive",
  "data": {
    "label": "listFiles",
    "driveOperation": "getAll",
    "driveLimit": 50
  }
}
```

Haga referencia al primer archivo devuelto en las etapas posteriores: `$listFiles.files[0].filename`, `$listFiles.files[0].size_bytes`

## Ejemplo — Eliminar archivo después del procesamiento

```json
{
  "type": "drive",
  "data": {
    "label": "cleanup",
    "driveOperation": "delete",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

## Ejemplo — Establecer contraseña en un archivo generado

```json
{
  "type": "drive",
  "data": {
    "label": "protectFile",
    "driveOperation": "setPassword",
    "driveFileId": "$generateReport._generated_files[0].id",
    "drivePassword": "$input.password"
  }
}
```

## Ejemplo — Establecer expiración (TTL)

```json
{
  "type": "drive",
  "data": {
    "label": "expireFile",
    "driveOperation": "setTtl",
    "driveFileId": "$generateReport._generated_files[0].id",
    "driveTtlHours": 24
  }
}
```

## Ejemplo — Limitar descargas

```json
{
  "type": "drive",
  "data": {
    "label": "limitDownloads",
    "driveOperation": "setMaxDownloads",
    "driveFileId": "$generateReport._generated_files[0].id",
    "driveMaxDownloads": 3
  }
}
```

## Ejemplo — Compartir con mis equipos

```json
{
  "type": "drive",
  "data": {
    "label": "shareReport",
    "driveOperation": "shareWithMyTeams",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

Los miembros del equipo pueden ver y descargar el archivo desde Drive y utilizar operaciones de lectura en workflows. No pueden eliminarlo, volver a compartirlo ni modificar las restricciones del enlace público.

## Ejemplo — Dejar de compartir con mis equipos

```json
{
  "type": "drive",
  "data": {
    "label": "unshareReport",
    "driveOperation": "unshareWithMyTeams",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

## Convertir un archivo

La conversión de formato se trasladó al nodo [Converter](./converter-node.md). Almacene u obtenga el archivo con Drive y, a continuación, pase su id a un nodo converter:

```json
{
  "type": "converter",
  "data": {
    "label": "convertDoc",
    "conversion": "fileConvert",
    "converterFileId": "$reportAgent._generated_files[0].id",
    "converterTargetFormat": "pdf"
  }
}
```

El archivo original se conserva y el archivo convertido se almacena como un nuevo archivo de Drive.

## Acceso a la salida

**get:**
- `$nodeLabel.id` — UUID del archivo
- `$nodeLabel.filename` — nombre del archivo
- `$nodeLabel.mime_type` — tipo MIME (p. ej., `image/png`)
- `$nodeLabel.size_bytes` — tamaño del archivo en bytes
- `$nodeLabel.download_url` — URL de descarga pública
- `$nodeLabel.file_base64` — contenido del archivo codificado en base64 (solo cuando **Include binary content** está habilitado)

**getAll:**
- `$nodeLabel.files` — Array de objetos de metadatos de archivos
- `$nodeLabel.count` — Número de archivos devueltos
- `$nodeLabel.files[0].id` — UUID del archivo
- `$nodeLabel.files[0].filename` — Nombre del archivo
- `$nodeLabel.files[0].mime_type` — Tipo MIME
- `$nodeLabel.files[0].size_bytes` — Tamaño del archivo en bytes
- `$nodeLabel.files[0].download_url` — URL de descarga pública cuando existe un token público
- `$nodeLabel.files[0].metadata` — Objeto de metadatos almacenado
- `$nodeLabel.files[0].created_at` — Marca de tiempo de creación del archivo

**downloadUrl:**
- `$nodeLabel.id` — UUID del archivo recién almacenado
- `$nodeLabel.filename` — nombre del archivo (desde `Content-Disposition` o la ruta de la URL)
- `$nodeLabel.mime_type` — tipo MIME detectado a partir de la respuesta o la extensión del archivo
- `$nodeLabel.size_bytes` — tamaño del archivo en bytes
- `$nodeLabel.download_url` — URL de descarga de Drive para el archivo almacenado

**delete:**
- `$nodeLabel.status` — `"deleted"`
- `$nodeLabel.file_id` — UUID del archivo eliminado

**setPassword / setTtl / setMaxDownloads:**
- `$nodeLabel.status` — `"updated"`
- `$nodeLabel.file_id` — UUID del archivo
- `$nodeLabel.download_url` — Nueva URL de token de acceso con la restricción aplicada

**shareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID del archivo
- `$nodeLabel.shared_team_count` — Número de recursos compartidos con equipos después de la operación

**unshareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID del archivo
- `$nodeLabel.shared_team_count` — `0` después de la operación

## Propiedad

Las operaciones exclusivas del propietario requieren que el archivo pertenezca al propietario del workflow. Las operaciones de lectura (`get`, `getAll`) también pueden acceder a archivos compartidos con el propietario del workflow a través de un equipo.
## Relacionado

- [Generación de archivos](../reference/file-generation.md) - Cómo las skills generan archivos y la salida `_generated_files`
- [Pestaña Drive](../reference/drive.md) - Gestión visual de archivos en el panel de control
- [Nodo Agent](./agent-node.md) - Ejecuta skills que generan archivos
- [Nodo Converter](./converter-node.md) - Convierte un archivo almacenado a otro formato, o aplica OCR para convertirlo en texto
- [Expression DSL](../reference/expression-dsl.md) - Sintaxis de expresiones para valores dinámicos
