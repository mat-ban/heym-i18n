# Google Drive

Вузол **Google Drive** призначено для переліку, завантаження, оновлення та видалення файлів і папок у Google Drive через OAuth2. Він також дозволяє скопіювати файл із Drive безпосередньо до [Heym Drive](./drive-node.md) однією операцією.

> **Це не вузол [Drive](./drive-node.md).** Той вузол — це *Heym Drive*, власне внутрішнє сховище файлів Heym. Цей вузол працює з Google Drive. Операція `syncToHeymDrive` є мостом між ними.

## Огляд

| Властивість | Значення |
|----------|-------|
| Входи | 1 |
| Виходи | 1 |
| Облікові дані | Google Drive (OAuth2) |
| Вихід | `$nodeLabel.files`, `$nodeLabel.content_base64`, `$nodeLabel.download_url`, `$nodeLabel.status` |

## Параметри

| Параметр | Тип | Опис |
|-----------|------|-------------|
| `credentialId` | UUID | Облікові дані Google Drive з розділу [Облікові дані](../tabs/credentials-tab.md) |
| `gdOperation` | string | Операція: `listFolderFiles`, `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`, `removeFolder` |
| `gdFolderId` | expression | Ідентифікатор папки або повна URL-адреса папки Drive. Використовується операціями `listFolderFiles` та `removeFolder`. Порожнє значення означає корінь Drive. |
| `gdFileId` | expression | Ідентифікатор файлу або повна URL-адреса Drive/Docs. Використовується операціями `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`. |
| `gdMaxResults` | expression | Для `listFolderFiles`: максимальна кількість файлів для повернення (типово 100). Порожнє значення або `0` завантажує всю папку через посторінковий перегляд. Кожен перелічений файл містить `size_bytes`, якщо Drive повідомляє розмір. |
| `gdQuery` | expression | Для `listFolderFiles`: додатковий запит Drive, об'єднаний оператором AND із фільтром папки, наприклад `mimeType='application/pdf'`. |
| `gdIncludeTrashed` | boolean | Для `listFolderFiles`: включати файли з кошика. Типово false. |
| `gdExportFormat` | string | Для `downloadFile` / `syncToHeymDrive`: `pdf`, `docx`, `xlsx`, `pptx`, `csv`, `txt`. Порожнє значення означає автоматичний вибір. Ігнорується для звичайних файлів. |
| `gdFilename` | expression | Для `syncToHeymDrive`: перевизначити ім'я файлу, що зберігається в Heym Drive. |
| `gdBase64Content` | expression | Для `updateFile`: рядок base64 або URL-адреса `data:`, що замінює вміст файлу. |
| `gdNewName` | expression | Для `updateFile`: нове ім'я файлу (перейменування). |
| `gdNewParentId` | expression | Для `updateFile`: ідентифікатор або URL-адреса папки призначення (переміщення). |
| `gdPermanentDelete` | boolean | Для `removeFile` / `removeFolder`: якщо false (типово), елемент переміщується до кошика й може бути відновлений; якщо true — знищується остаточно. |

## Ідентифікатори файлів і папок

`gdFileId`, `gdFolderId` та `gdNewParentId` приймають або **безпосередній ідентифікатор**, або **повну URL-адресу** — Heym витягує ідентифікатор автоматично. Усі наведені нижче варіанти працюють:

- `https://drive.google.com/file/d/1AbCdEf/view`
- `https://drive.google.com/drive/folders/1FolderXyz`
- `https://docs.google.com/document/d/1DocId/edit`
- `https://drive.google.com/open?id=1AbCdEf`
- `1AbCdEf`

## Google Docs, Sheets та Slides

Документи, створені безпосередньо в Google, **не мають байтів для завантаження**. Вони є записами на серверах Google, а не файлами — Drive API повертає `403 Only files with binary content can be downloaded`, якщо запитати їхній необроблений вміст.

Операції `downloadFile` та `syncToHeymDrive` виявляють такі документи автоматично й натомість виконують **експорт**, тож жодна операція не завершується помилкою лише через те, що цільовим об'єктом є документ Google:

| Джерело | Типовий експорт |
|--------|----------------|
| Google Docs | PDF |
| Google Sheets | XLSX |
| Google Slides | PPTX |
| Будь-який інший рідний тип Google | PDF |

Установіть **Export Format**, щоб перевизначити цільовий формат. Це налаштування ігнорується для звичайних завантажених файлів, які завжди завантажуються як є.

## Операції

| Операція | Обов'язкові параметри | Опис |
|-----------|----------|-------------|
| `listFolderFiles` | — (порожня папка = корінь) | Перелічити файли в папці з необов'язковим фільтром запиту |
| `downloadFile` | `gdFileId` | Завантажити байти файлу як base64, автоматично експортуючи рідні документи |
| `syncToHeymDrive` | `gdFileId` | Завантажити з Google Drive і зберегти результат у Heym Drive |
| `updateFile` | `gdFileId` + принаймні один із параметрів: вміст / ім'я / батьківська папка | Замінити вміст, перейменувати та/або перемістити |
| `removeFile` | `gdFileId` | Перемістити до кошика (типово) або остаточно видалити файл |
| `removeFolder` | `gdFolderId` | Перемістити до кошика (типово) або остаточно видалити папку разом з її вмістом |

### Видалення типово є відновлюваним

Операції `removeFile` та `removeFolder` переміщують елемент до **кошика Google Drive**, звідки його можна відновити. Це безпечний типовий режим для дій, що можуть виконуватися за розкладом або всередині вузла [Loop](./loop-node.md).

Увімкнення **Delete permanently** знищує елемент без можливості відновлення. Для `removeFolder` це також знищує все, що міститься в папці.

Вузол також перевіряє тип цільового об'єкта: `removeFile` відмовляється працювати з папкою, а `removeFolder` — із файлом, тож помилково введений ідентифікатор не може непомітно видалити не той об'єкт.

### updateFile не змінює порожні поля

`updateFile` — це оновлення, а не заміна. Заповніть будь-яку комбінацію вмісту, нового імені та нової папки — усе, що залишено порожнім, не змінюється. Принаймні один із трьох параметрів є обов'язковим.
## Налаштування облікових даних

Google Drive використовує модель **OAuth2 "Bring Your Own App"**. Ви надаєте власні облікові дані OAuth2 Google Cloud.

> **Ці облікові дані надають повний доступ до Drive.** Heym запитує scope `https://www.googleapis.com/auth/drive`, оскільки вузол працює з файлами, які вже належать Вам. Вужчий scope `drive.file` бачить лише файли, створені самим застосунком, що унеможливило б перегляд, оновлення та видалення Ваших наявних файлів. Перед тим як поділитися цими обліковими даними з командою, ознайомтеся з розділом [Спільний доступ до облікових даних](../reference/credentials-sharing.md).

**Конфігурація бекенду:** Встановіть **`FRONTEND_URL`** на бекенді Heym як публічну URL-адресу застосунку. URI перенаправлення OAuth завжди має вигляд `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` — він формується виключно з цього налаштування, а не із заголовків запиту.

1. Перейдіть до [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → увімкніть **Google Drive API**.
2. Перейдіть до **Credentials** → **Create Credentials** → **OAuth client ID** → виберіть **Web application**.
3. У розділі **Authorized redirect URIs** додайте точно `{your FRONTEND_URL}/api/credentials/google-drive/oauth/callback`.
4. Скопіюйте **Client ID** та **Client Secret**.
5. У Heym: **Dashboard → Credentials → New → Google Drive (OAuth2)**, вставте обидва значення, потім натисніть **Connect** і підтвердьте доступ у спливному вікні.

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

`size_bytes` має значення `null` для папок і файлів, що належать Google, оскільки для них розмір не вказується.

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

Для звичайного файлу `exported` має значення `false`, а `export_format` — `null`.

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

`id` — це ідентифікатор нового файлу в **Heym Drive**, відмінний від `google_file_id`.

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

`deleted` має значення `"trashed"` або `"permanent"`.

## Приклад: резервне копіювання папки Drive у Heym Drive

1. **[Cron](./cron-node.md)** — запуск щодня.
2. **Google Drive** — `listFolderFiles` для вихідної папки, з `gdQuery`, встановленим у `mimeType='application/pdf'`, якщо потрібні лише PDF-файли.
3. **[Loop](./loop-node.md)** — переберіть `$ListReports.files`.
4. **Google Drive** — `syncToHeymDrive` з `gdFileId`, встановленим у `$BackupLoop.item.id`, та `gdFilename`, встановленим у `$BackupLoop.item.name`.
5. **[Slack](./slack-node.md)** — опублікуйте зведення про те, що було скопійовано.

## Примітки

- Кожне текстове поле приймає вирази `$`, тож ідентифікатори та імена файлів можуть надходити з попередніх вузлів.
- Спільні диски підтримуються — вузол встановлює `supportsAllDrives` для кожного запиту.
- Під час завантаження виконується перевірка розміру відповідно до налаштування бекенду `FILE_MAX_SIZE_MB`.
- Приєднайте цей вузол до входу інструментів вузла [Agent](./agent-node.md) і скористайтеся значком бота біля будь-якого поля, щоб дозволити агенту заповнити його під час виконання.

## Дивіться також

- [Drive (Heym Drive)](./drive-node.md)
- [Google Sheets](./google-sheets-node.md)
- [Loop](./loop-node.md)
- [Облікові дані](../reference/credentials.md)
- [Спільний доступ до облікових даних](../reference/credentials-sharing.md)
