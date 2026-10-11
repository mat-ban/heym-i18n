# Drive Node

**Drive** node управлява файлове, генерирани от skills, директно в рамките на workflow. Използвайте го, за да извличате файлове, да изтегляте файлове от външни URL адреси, да ги изтривате, да ги споделяте или премахвате споделянето им с Вашите екипи, или да актуализирате ограниченията за достъп до тях (парола, срок на валидност, лимит за изтегляния) програмно.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 1 |
| Изход | `$nodeLabel.files`, `$nodeLabel.status`, `$nodeLabel.file_id`, `$nodeLabel.download_url` (варира според операцията) |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `driveOperation` | string | Операция: `get`, `getAll`, `downloadUrl`, `save`, `delete`, `setPassword`, `setTtl`, `setMaxDownloads`, `shareWithMyTeams`, `unshareWithMyTeams` |
| `driveFileId` | expression / select | UUID на Drive файла за управление (всички операции с изключение на `getAll`, `downloadUrl` и `save`) |
| `driveLimit` | number | Максимален брой файлове за връщане (само `getAll`; празно означава без ограничение) |
| `driveSourceUrl` | expression | URL за извличане и съхраняване в Drive (само `downloadUrl`) |
| `driveFilename` | expression | Пълно име на файла, включително разширението (само `save`, напр. `1.mp3`) |
| `driveBase64Content` | expression | Суров base64 низ или data URL за декодиране и съхраняване (само `save`) |
| `driveIncludeBinary` | boolean | Включване на съдържанието на файла като base64 в изхода (само `get`) |
| `drivePassword` | expression | Парола за задаване на access token (само `setPassword`) |
| `driveTtlHours` | number | Часове до изтичане на линка за изтегляне (само `setTtl`) |
| `driveMaxDownloads` | number | Максимален разрешен брой изтегляния (само `setMaxDownloads`) |

## Получаване на File ID

Когато даден skill генерира файлове, изходът включва масив `_generated_files`. Всеки запис включва поле `id`:

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

Референцирайте file ID с: `$agentLabel._generated_files[0].id`

## Операции

| Операция | Задължителни полета | Описание |
|-----------|----------------|-------------|
| `get` | driveFileId | Извличане на метаданни на файла (и по избор binary съдържание) от Drive |
| `getAll` | няма | Списък на притежаваните и споделени с екип четими Drive файлове с метаданни като име на файла, MIME тип, размер, източник и URL за изтегляне |
| `downloadUrl` | driveSourceUrl | Извличане на файл от външен URL и съхраняването му в Drive |
| `save` | driveFilename, driveBase64Content | Декодиране на base64 съдържание и съхраняването му като Drive файл |
| `delete` | driveFileId | Изтриване на файла и всички негови access tokens от диска и базата данни |
| `setPassword` | driveFileId, drivePassword | Замяна на публичния token по подразбиране с такъв, защитен с парола |
| `setTtl` | driveFileId, driveTtlHours | Замяна на публичния token по подразбиране с такъв, който изтича след N часа |
| `setMaxDownloads` | driveFileId, driveMaxDownloads | Замяна на публичния token по подразбиране с такъв, ограничен до N изтегляния |
| `shareWithMyTeams` | driveFileId | Споделяне на файла само за четене с всички екипи, към които собственикът на workflow принадлежи в момента |
| `unshareWithMyTeams` | driveFileId | Премахване на всички споделяния с екипи от файла |

> **Забележка:** Операциите `set*` изтриват публичния token по подразбиране (без ограничения) и създават нов с указаното ограничение. Актуализираният `download_url` е включен в изхода.
> **Споделяне с екипи:** `shareWithMyTeams` създава изрични споделяния за текущите екипи на собственика. Бъдещи екипи не се добавят автоматично, освен ако операцията не се изпълни отново. `unshareWithMyTeams` премахва всички споделяния с екипи от файла.

## Пример — Изтегляне на файл от URL

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

Референцирайте съхранения файл надолу по веригата: `$fetchReport.id`, `$fetchReport.download_url`

Името на файла се взема от заглавката на отговора `Content-Disposition`; ако липсва, се извлича от пътя на URL адреса.

## Пример — Запазване на Base64 вход в Drive

Използвайте това, когато текстов входен node (или който и да е upstream node) предоставя base64 съдържание на файл:

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

Референцирайте съхранения файл надолу по веригата: `$saveAudio.id`, `$saveAudio.download_url`

`driveBase64Content` приема суров base64 низ или `data:...;base64,...` data URL. MIME типът се определя от разширението на името на файла.

## Пример — Извличане на файл и използване на Binary във Vision LLM

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

Референцирайте base64 съдържанието надолу по веригата: `$fetchImage.file_base64`

Изображенията, върнати чрез `file_base64`, се показват inline в панела за debug, когато стартирате workflow.

## Пример — Списък на Drive файлове

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

Референцирайте първия върнат файл надолу по веригата: `$listFiles.files[0].filename`, `$listFiles.files[0].size_bytes`
## Пример — Изтриване на файл след обработка

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

## Пример — Задаване на парола на генериран файл

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

## Пример — Задаване на срок на валидност (TTL)

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

## Пример — Ограничаване на изтеглянията

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

## Пример — Споделяне с моите екипи

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

Членовете на екипа могат да преглеждат и изтеглят файла от Drive и да използват операции за четене във workflows. Те не могат да изтриват, да споделят повторно или да променят ограниченията на публичния линк.

## Пример — Премахване на споделянето с моите екипи

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

## Конвертиране на файл

Конвертирането на формати е преместено в node [Converter](./converter-node.md). Съхранете или извлечете файла с Drive, след което предайте неговия id на converter node:

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

Оригиналният файл се запазва, а конвертираният файл се съхранява като нов Drive файл.

## Достъп до изхода

**get:**
- `$nodeLabel.id` — UUID на файла
- `$nodeLabel.filename` — име на файла
- `$nodeLabel.mime_type` — MIME тип (напр. `image/png`)
- `$nodeLabel.size_bytes` — размер на файла в байтове
- `$nodeLabel.download_url` — публичен URL за изтегляне
- `$nodeLabel.file_base64` — base64-кодирано съдържание на файла (само когато **Include binary content** е включено)

**getAll:**
- `$nodeLabel.files` — Масив от обекти с метаданни за файлове
- `$nodeLabel.count` — Брой върнати файлове
- `$nodeLabel.files[0].id` — UUID на файла
- `$nodeLabel.files[0].filename` — Име на файла
- `$nodeLabel.files[0].mime_type` — MIME тип
- `$nodeLabel.files[0].size_bytes` — Размер на файла в байтове
- `$nodeLabel.files[0].download_url` — Публичен URL за изтегляне, когато съществува публичен token
- `$nodeLabel.files[0].metadata` — Съхранен обект с метаданни
- `$nodeLabel.files[0].created_at` — Времева марка на създаване на файла

**downloadUrl:**
- `$nodeLabel.id` — UUID на новосъхранения файл
- `$nodeLabel.filename` — име на файла (от `Content-Disposition` или пътя на URL)
- `$nodeLabel.mime_type` — MIME тип, определен от отговора или разширението на файла
- `$nodeLabel.size_bytes` — размер на файла в байтове
- `$nodeLabel.download_url` — Drive URL за изтегляне на съхранения файл

**delete:**
- `$nodeLabel.status` — `"deleted"`
- `$nodeLabel.file_id` — UUID на изтрития файл

**setPassword / setTtl / setMaxDownloads:**
- `$nodeLabel.status` — `"updated"`
- `$nodeLabel.file_id` — UUID на файла
- `$nodeLabel.download_url` — Нов URL с access token с приложеното ограничение

**shareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID на файла
- `$nodeLabel.shared_team_count` — Брой споделяния с екипи след операцията

**unshareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID на файла
- `$nodeLabel.shared_team_count` — `0` след операцията

## Собственост

Операциите, достъпни само за собственика, изискват файлът да принадлежи на собственика на workflow. Операциите за четене (`get`, `getAll`) могат също да достъпват файлове, споделени със собственика на workflow чрез екип.

## Свързани

- [Генериране на файлове](../reference/file-generation.md) - Как skills генерират файлове и изходът `_generated_files`
- [Раздел Drive](../reference/drive.md) - Визуално управление на файлове в таблото за управление
- [Agent Node](./agent-node.md) - Изпълнява skills, които генерират файлове
- [Converter Node](./converter-node.md) - Конвертиране на съхранен файл в друг формат или OCR към текст
- [Expression DSL](../reference/expression-dsl.md) - Синтаксис на изразите за динамични стойности
