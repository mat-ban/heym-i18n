# Google Drive

**Google Drive** node-ът изброява, изтегля, обновява и изтрива файлове и папки в Google Drive чрез OAuth2. Той може също да копира файл от Drive директно в [Heym Drive](./drive-node.md) с една единствена операция.

> **Това не е node-ът [Drive](./drive-node.md).** Онзи node е *Heym Drive* — собственото вътрешно хранилище за файлове на Heym. Този node комуникира с Google Drive. Операцията `syncToHeymDrive` е мостът между двете.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 1 |
| Удостоверение | Google Drive (OAuth2) |
| Изход | `$nodeLabel.files`, `$nodeLabel.content_base64`, `$nodeLabel.download_url`, `$nodeLabel.status` |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `credentialId` | UUID | Удостоверение за Google Drive от [Удостоверения](../tabs/credentials-tab.md) |
| `gdOperation` | string | Операция: `listFolderFiles`, `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`, `removeFolder` |
| `gdFolderId` | expression | ID на папка или пълен URL на папка в Drive. Използва се от `listFolderFiles` и `removeFolder`. Празна стойност означава корена на Drive. |
| `gdFileId` | expression | ID на файл или пълен URL на Drive/Docs. Използва се от `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`. |
| `gdMaxResults` | expression | За `listFolderFiles`: максимален брой файлове за връщане (по подразбиране 100). Празна стойност или `0` зарежда цялата папка чрез пейджинг. Всеки изброен файл включва `size_bytes`, когато Drive докладва размер. |
| `gdQuery` | expression | За `listFolderFiles`: допълнителна заявка към Drive, комбинирана с филтъра за папка чрез AND, напр. `mimeType='application/pdf'`. |
| `gdIncludeTrashed` | boolean | За `listFolderFiles`: включване на изтритите в кошчето файлове. По подразбиране false. |
| `gdExportFormat` | string | За `downloadFile` / `syncToHeymDrive`: `pdf`, `docx`, `xlsx`, `pptx`, `csv`, `txt`. Празна стойност означава автоматично. Игнорира се за обикновени файлове. |
| `gdFilename` | expression | За `syncToHeymDrive`: заместване на името на файла, съхранен в Heym Drive. |
| `gdBase64Content` | expression | За `updateFile`: base64 низ или `data:` URL, който замества съдържанието на файла. |
| `gdNewName` | expression | За `updateFile`: ново име на файла (преименуване). |
| `gdNewParentId` | expression | За `updateFile`: ID на папка местоназначение или URL (преместване). |
| `gdPermanentDelete` | boolean | За `removeFile` / `removeFolder`: когато е false (по подразбиране), елементът се премества в кошчето и може да бъде възстановен; когато е true, той се унищожава безвъзвратно. |

## ID-та на файлове и папки

`gdFileId`, `gdFolderId` и `gdNewParentId` приемат или **самото ID**, или **пълен URL** — Heym извлича ID-то автоматично. Всички следни примери работят:

- `https://drive.google.com/file/d/1AbCdEf/view`
- `https://drive.google.com/drive/folders/1FolderXyz`
- `https://docs.google.com/document/d/1DocId/edit`
- `https://drive.google.com/open?id=1AbCdEf`
- `1AbCdEf`

## Google Docs, Sheets и Slides

Документите, създадени в Google, **нямат байтове за изтегляне**. Те са записи на сървърите на Google, а не файлове — Drive API връща `403 Only files with binary content can be downloaded`, ако поискате суровото им съдържание.

`downloadFile` и `syncToHeymDrive` ги разпознават автоматично и вместо това извършват **експортиране**, така че нито една операция не се проваля само защото целта е Google Doc:

| Източник | Експорт по подразбиране |
|--------|----------------|
| Google Docs | PDF |
| Google Sheets | XLSX |
| Google Slides | PPTX |
| Всеки друг Google-специфичен тип | PDF |

Задайте **Export Format**, за да заместите целевия формат. Настройката се игнорира за обикновени качени файлове, които винаги се изтеглят както са.

## Операции

| Операция | Задължителни | Описание |
|-----------|----------|-------------|
| `listFolderFiles` | — (празна папка = корен) | Изброява файловете в папка с незадължителен филтър чрез заявка |
| `downloadFile` | `gdFileId` | Изтегля байтовете на файла като base64, като автоматично експортира Google-специфичните документи |
| `syncToHeymDrive` | `gdFileId` | Изтегля от Google Drive и съхранява резултата в Heym Drive |
| `updateFile` | `gdFileId` + поне едно от съдържание / име / родител | Замества съдържание, преименува и/или премества |
| `removeFile` | `gdFileId` | Премества в кошчето (по подразбиране) или изтрива безвъзвратно файл |
| `removeFolder` | `gdFolderId` | Премества в кошчето (по подразбиране) или изтрива безвъзвратно папка и съдържанието ѝ |

### Изтриването е възстановимо по подразбиране

`removeFile` и `removeFolder` преместват елемента в **кошчето на Google Drive**, откъдето може да бъде възстановен. Това е безопасната настройка по подразбиране за нещо, което може да се изпълнява по график или вътре в [Loop](./loop-node.md).

Активирането на **Delete permanently** унищожава елемента без възможност за възстановяване. За `removeFolder` това унищожава и всичко вътре в папката.

Node-ът също проверява типа на целта: `removeFile` отказва папка, а `removeFolder` отказва файл, така че погрешно въведено ID не може тихо да изтрие грешния обект.

### updateFile не пипа празните полета

`updateFile` е обновяване, а не заместване. Попълнете произволна комбинация от съдържание, ново име и нова папка — каквото оставите празно, не се променя. Изисква се поне едно от трите.
## Настройка на удостоверения

Google Drive използва модел **OAuth2 „Bring Your Own App“**. Вие предоставяте свои собствени OAuth2 удостоверения от Google Cloud.

> **Това удостоверение дава пълен достъп до Drive.** Heym заявява scope `https://www.googleapis.com/auth/drive`, тъй като node работи с файлове, които вече притежавате. По-тесният scope `drive.file` вижда само файловете, създадени от самото приложение, което би направило невъзможно изброяването, обновяването и изтриването на Вашите съществуващи файлове. Вижте [Credential Sharing](../reference/credentials-sharing.md), преди да споделите това удостоверение с екип.

**Конфигурация на backend:** Задайте **`FRONTEND_URL`** на Heym backend да сочи към публичния URL на приложението. OAuth redirect URI винаги е `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` — той се извлича единствено от тази настройка, а не от request headers.

1. Отворете [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → активирайте **Google Drive API**.
2. Отворете **Credentials** → **Create Credentials** → **OAuth client ID** → изберете **Web application**.
3. Под **Authorized redirect URIs** добавете точно `{your FRONTEND_URL}/api/credentials/google-drive/oauth/callback`.
4. Копирайте **Client ID** и **Client Secret**.
5. В Heym: **Dashboard → Credentials → New → Google Drive (OAuth2)**, поставете двете стойности, след което натиснете **Connect** и одобрете достъпа в popup прозореца.

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

`size_bytes` е `null` за папки и Google-native файлове, които не отчитат размер.

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

За обикновен файл `exported` е `false`, а `export_format` е `null`.

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

`id` е новият ID на файла в **Heym Drive**, различен от `google_file_id`.

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

`deleted` е `"trashed"` или `"permanent"`.

## Пример: архивиране на папка от Drive в Heym Drive

1. **[Cron](./cron-node.md)** — изпълнение всеки ден.
2. **Google Drive** — `listFolderFiles` върху папката източник, с `gdQuery`, зададен на `mimeType='application/pdf'`, ако желаете само PDF файлове.
3. **[Loop](./loop-node.md)** — итерация през `$ListReports.files`.
4. **Google Drive** — `syncToHeymDrive` с `gdFileId`, зададен на `$BackupLoop.item.id`, и `gdFilename`, зададен на `$BackupLoop.item.name`.
5. **[Slack](./slack-node.md)** — публикуване на обобщение на архивираното.

## Бележки

- Всяко текстово поле приема `$` изрази, така че ID-та и имена на файлове могат да идват от предходни nodes.
- Споделените drive-ове се поддържат — node задава `supportsAllDrives` при всяка заявка.
- Размерът на изтеглянията се проверява спрямо настройката `FILE_MAX_SIZE_MB` на backend-а.
- Прикачете този node към tool входа на [Agent](./agent-node.md) node и използвайте иконата на бот във всяко поле, за да позволите на агента да го попълни по време на изпълнение.

## Вижте също

- [Drive (Heym Drive)](./drive-node.md)
- [Google Sheets](./google-sheets-node.md)
- [Loop](./loop-node.md)
- [Credentials](../reference/credentials.md)
- [Credential Sharing](../reference/credentials-sharing.md)
