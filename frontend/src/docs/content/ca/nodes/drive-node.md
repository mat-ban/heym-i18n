# Node Drive

El node **Drive** gestiona els fitxers generats per les skills directament des d'un workflow. Utilitzeu-lo per recuperar fitxers, descarregar fitxers des d'URLs externes, eliminar-los, compartir-los o deixar de compartir-los amb els vostres equips, o actualitzar-ne les restriccions d'accés (contrasenya, caducitat, límit de descàrregues) de manera programàtica.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Sortida | `$nodeLabel.files`, `$nodeLabel.status`, `$nodeLabel.file_id`, `$nodeLabel.download_url` (varia segons l'operació) |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `driveOperation` | string | Operació: `get`, `getAll`, `downloadUrl`, `save`, `delete`, `setPassword`, `setTtl`, `setMaxDownloads`, `shareWithMyTeams`, `unshareWithMyTeams` |
| `driveFileId` | expression / select | UUID del fitxer de Drive que cal gestionar (totes les operacions excepte `getAll`, `downloadUrl` i `save`) |
| `driveLimit` | number | Nombre màxim de fitxers a retornar (només `getAll`; buit significa sense límit) |
| `driveSourceUrl` | expression | URL per obtenir i emmagatzemar a Drive (només `downloadUrl`) |
| `driveFilename` | expression | Nom complet del fitxer, incloent-hi l'extensió (només `save`, p. ex. `1.mp3`) |
| `driveBase64Content` | expression | Cadena base64 en brut o data URL per descodificar i emmagatzemar (només `save`) |
| `driveIncludeBinary` | boolean | Inclou el contingut del fitxer com a base64 a la sortida (només `get`) |
| `drivePassword` | expression | Contrasenya que cal establir al token d'accés (només `setPassword`) |
| `driveTtlHours` | number | Hores fins que caduca l'enllaç de descàrrega (només `setTtl`) |
| `driveMaxDownloads` | number | Nombre màxim de descàrregues permeses (només `setMaxDownloads`) |

## Obtenir el File ID

Quan una skill genera fitxers, la sortida inclou una matriu `_generated_files`. Cada entrada inclou un camp `id`:

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

Feu referència al file ID amb: `$agentLabel._generated_files[0].id`

## Operacions

| Operació | Camps obligatoris | Descripció |
|-----------|----------------|-------------|
| `get` | driveFileId | Recupera les metadades del fitxer (i opcionalment el contingut binari) de Drive |
| `getAll` | cap | Llista els fitxers de Drive llegibles propis i compartits amb equips, amb metadades com ara el nom del fitxer, el tipus MIME, la mida, l'origen i l'URL de descàrrega |
| `downloadUrl` | driveSourceUrl | Obté un fitxer des d'una URL externa i l'emmagatzema a Drive |
| `save` | driveFilename, driveBase64Content | Descodifica el contingut base64 i l'emmagatzema com a fitxer de Drive |
| `delete` | driveFileId | Elimina el fitxer i tots els seus tokens d'accés del disc i de la base de dades |
| `setPassword` | driveFileId, drivePassword | Substitueix el token públic per defecte per un de protegit amb contrasenya |
| `setTtl` | driveFileId, driveTtlHours | Substitueix el token públic per defecte per un que caduca després de N hores |
| `setMaxDownloads` | driveFileId, driveMaxDownloads | Substitueix el token públic per defecte per un limitat a N descàrregues |
| `shareWithMyTeams` | driveFileId | Comparteix el fitxer en mode només lectura amb tots els equips als quals pertany actualment el propietari del workflow |
| `unshareWithMyTeams` | driveFileId | Elimina totes les comparticions d'equip del fitxer |

> **Nota:** Les operacions `set*` eliminen el token públic per defecte (sense restriccions) i en creen un de nou amb la restricció especificada. L'`download_url` actualitzat s'inclou a la sortida.
> **Compartició amb equips:** `shareWithMyTeams` crea comparticions explícites per als equips actuals del propietari. Els equips futurs no s'afegeixen automàticament tret que l'operació es torni a executar. `unshareWithMyTeams` elimina totes les comparticions d'equip del fitxer.

## Exemple — Descarregar un fitxer des d'una URL

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

Feu referència al fitxer emmagatzemat més endavant: `$fetchReport.id`, `$fetchReport.download_url`

El nom del fitxer s'obté de la capçalera de resposta `Content-Disposition`; si no hi és, es deriva del camí de l'URL.

## Exemple — Desar una entrada Base64 a Drive

Utilitzeu aquesta opció quan un node d'entrada de text (o qualsevol node anterior) proporcioni contingut de fitxer en base64:

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

Feu referència al fitxer emmagatzemat més endavant: `$saveAudio.id`, `$saveAudio.download_url`

`driveBase64Content` accepta una cadena base64 en brut o una data URL `data:...;base64,...`. El tipus MIME s'infereix de l'extensió del nom del fitxer.
## Exemple — Obtenir un fitxer i utilitzar el binari en un Vision LLM

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

Referencieu el contingut base64 aigües avall: `$fetchImage.file_base64`

Les imatges retornades mitjançant `file_base64` es mostren en línia al tauler de depuració quan executeu el workflow.

## Exemple — Llistar fitxers de Drive

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

Referencieu el primer fitxer retornat aigües avall: `$listFiles.files[0].filename`, `$listFiles.files[0].size_bytes`

## Exemple — Eliminar un fitxer després del processament

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

## Exemple — Establir una contrasenya en un fitxer generat

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

## Exemple — Establir una caducitat (TTL)

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

## Exemple — Limitar les descàrregues

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

## Exemple — Compartir amb els meus equips

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

Els membres de l'equip poden visualitzar i descarregar el fitxer des de Drive i utilitzar operacions de lectura en workflows. No poden eliminar-lo, tornar-lo a compartir ni modificar les restriccions de l'enllaç públic.

## Exemple — Deixar de compartir amb els meus equips

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

## Convertir un fitxer

La conversió de format s'ha traslladat al node [Converter](./converter-node.md). Emmagatzemeu o obteniu el fitxer amb Drive i, a continuació, passeu el seu id a un node converter:

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

El fitxer original es conserva i el fitxer convertit s'emmagatzema com un fitxer nou de Drive.

## Accés a la sortida

**get:**
- `$nodeLabel.id` — UUID del fitxer
- `$nodeLabel.filename` — nom del fitxer
- `$nodeLabel.mime_type` — tipus MIME (p. ex. `image/png`)
- `$nodeLabel.size_bytes` — mida del fitxer en bytes
- `$nodeLabel.download_url` — URL de descàrrega pública
- `$nodeLabel.file_base64` — contingut del fitxer codificat en base64 (només quan **Include binary content** està habilitat)

**getAll:**
- `$nodeLabel.files` — Matriu d'objectes de metadades de fitxers
- `$nodeLabel.count` — Nombre de fitxers retornats
- `$nodeLabel.files[0].id` — UUID del fitxer
- `$nodeLabel.files[0].filename` — Nom del fitxer
- `$nodeLabel.files[0].mime_type` — Tipus MIME
- `$nodeLabel.files[0].size_bytes` — Mida del fitxer en bytes
- `$nodeLabel.files[0].download_url` — URL de descàrrega pública quan existeix un token públic
- `$nodeLabel.files[0].metadata` — Objecte de metadades emmagatzemat
- `$nodeLabel.files[0].created_at` — Marca de temps de creació del fitxer

**downloadUrl:**
- `$nodeLabel.id` — UUID del fitxer recentment emmagatzemat
- `$nodeLabel.filename` — nom del fitxer (de `Content-Disposition` o del camí de l'URL)
- `$nodeLabel.mime_type` — tipus MIME detectat a partir de la resposta o de l'extensió del fitxer
- `$nodeLabel.size_bytes` — mida del fitxer en bytes
- `$nodeLabel.download_url` — URL de descàrrega de Drive per al fitxer emmagatzemat

**delete:**
- `$nodeLabel.status` — `"deleted"`
- `$nodeLabel.file_id` — UUID del fitxer eliminat

**setPassword / setTtl / setMaxDownloads:**
- `$nodeLabel.status` — `"updated"`
- `$nodeLabel.file_id` — UUID del fitxer
- `$nodeLabel.download_url` — URL del nou token d'accés amb la restricció aplicada

**shareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID del fitxer
- `$nodeLabel.shared_team_count` — Nombre de comparticions d'equip després de l'operació

**unshareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID del fitxer
- `$nodeLabel.shared_team_count` — `0` després de l'operació

## Propietat

Les operacions exclusives del propietari requereixen que el fitxer pertanyi al propietari del workflow. Les operacions de lectura (`get`, `getAll`) també poden accedir a fitxers compartits amb el propietari del workflow mitjançant un equip.
## Relacionat

- [Generació de fitxers](../reference/file-generation.md) - Com les habilitats generen fitxers i la sortida `_generated_files`
- [Pestanya Drive](../reference/drive.md) - Gestió visual de fitxers al tauler de control
- [Node Agent](./agent-node.md) - Executa habilitats que generen fitxers
- [Node Converter](./converter-node.md) - Converteix un fitxer emmagatzemat a un altre format, o aplica-hi OCR per obtenir text
- [Expression DSL](../reference/expression-dsl.md) - Sintaxi d'expressions per a valors dinàmics
