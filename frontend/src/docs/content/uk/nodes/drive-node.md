# Вузол Drive

Вузол **Drive** керує файлами, згенерованими навичками (skills), безпосередньо з робочого процесу. Використовуйте його для отримання файлів, завантаження файлів із зовнішніх URL-адрес, їх видалення, надання або скасування спільного доступу для Ваших команд, а також для програмного оновлення обмежень доступу (пароль, термін дії, ліміт завантажень).

## Огляд

| Властивість | Значення |
|----------|-------|
| Входи | 1 |
| Виходи | 1 |
| Вихід | `$nodeLabel.files`, `$nodeLabel.status`, `$nodeLabel.file_id`, `$nodeLabel.download_url` (залежить від операції) |

## Параметри

| Параметр | Тип | Опис |
|-----------|------|-------------|
| `driveOperation` | string | Операція: `get`, `getAll`, `downloadUrl`, `save`, `delete`, `setPassword`, `setTtl`, `setMaxDownloads`, `shareWithMyTeams`, `unshareWithMyTeams` |
| `driveFileId` | expression / select | UUID файлу Drive для керування (усі операції, крім `getAll`, `downloadUrl` та `save`) |
| `driveLimit` | number | Максимальна кількість файлів для повернення (лише `getAll`; порожнє значення означає відсутність обмежень) |
| `driveSourceUrl` | expression | URL-адреса для отримання та збереження у Drive (лише `downloadUrl`) |
| `driveFilename` | expression | Повне ім'я файлу разом із розширенням (лише `save`, наприклад `1.mp3`) |
| `driveBase64Content` | expression | Необроблений рядок base64 або data URL для декодування та збереження (лише `save`) |
| `driveIncludeBinary` | boolean | Включити вміст файлу як base64 у вихідні дані (лише `get`) |
| `drivePassword` | expression | Пароль для встановлення на токен доступу (лише `setPassword`) |
| `driveTtlHours` | number | Кількість годин до закінчення терміну дії посилання для завантаження (лише `setTtl`) |
| `driveMaxDownloads` | number | Максимально дозволена кількість завантажень (лише `setMaxDownloads`) |

## Отримання ідентифікатора файлу

Коли навичка (skill) генерує файли, вихідні дані містять масив `_generated_files`. Кожен запис включає поле `id`:

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

Посилайтеся на ідентифікатор файлу так: `$agentLabel._generated_files[0].id`

## Операції

| Операція | Обов'язкові поля | Опис |
|-----------|----------------|-------------|
| `get` | driveFileId | Отримати метадані файлу (та, за потреби, бінарний вміст) із Drive |
| `getAll` | немає | Перелічити власні та доступні для читання файли Drive, надані командам, разом із метаданими, такими як ім'я файлу, MIME-тип, розмір, джерело та URL-адреса для завантаження |
| `downloadUrl` | driveSourceUrl | Отримати файл із зовнішньої URL-адреси та зберегти його у Drive |
| `save` | driveFilename, driveBase64Content | Декодувати вміст base64 та зберегти його як файл Drive |
| `delete` | driveFileId | Видалити файл та всі його токени доступу з диска та бази даних |
| `setPassword` | driveFileId, drivePassword | Замінити типовий публічний токен на токен, захищений паролем |
| `setTtl` | driveFileId, driveTtlHours | Замінити типовий публічний токен на токен, термін дії якого спливає через N годин |
| `setMaxDownloads` | driveFileId, driveMaxDownloads | Замінити типовий публічний токен на токен, обмежений N завантаженнями |
| `shareWithMyTeams` | driveFileId | Надати файл у режимі лише для читання всім командам, до яких наразі належить власник робочого процесу |
| `unshareWithMyTeams` | driveFileId | Видалити всі спільні доступи команд до файлу |

> **Примітка:** Операції `set*` видаляють типовий (без обмежень) публічний токен і створюють новий із зазначеним обмеженням. Оновлена `download_url` включається у вихідні дані.
> **Спільний доступ команд:** `shareWithMyTeams` створює явні спільні доступи для поточних команд власника. Майбутні команди не додаються автоматично, якщо операцію не буде виконано повторно. `unshareWithMyTeams` видаляє всі спільні доступи команд до файлу.

## Приклад — Завантаження файлу з URL-адреси

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

Посилання на збережений файл далі за потоком: `$fetchReport.id`, `$fetchReport.download_url`

Ім'я файлу береться із заголовка відповіді `Content-Disposition`; якщо він відсутній, воно виводиться зі шляху URL-адреси.

## Приклад — Збереження вхідних даних Base64 у Drive

Використовуйте це, коли вузол текстового введення (або будь-який вузол вище за потоком) надає вміст файлу у форматі base64:

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

Посилання на збережений файл далі за потоком: `$saveAudio.id`, `$saveAudio.download_url`

`driveBase64Content` приймає необроблений рядок base64 або data URL у форматі `data:...;base64,...`. MIME-тип визначається з розширення імені файлу.

## Приклад — Отримання файлу та використання бінарних даних у Vision LLM

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

Посилання на вміст base64 далі за потоком: `$fetchImage.file_base64`

Зображення, повернуті через `file_base64`, відображаються безпосередньо на панелі налагодження під час запуску робочого процесу.

## Приклад — Перелік файлів Drive

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

Посилання на перший повернутий файл далі за потоком: `$listFiles.files[0].filename`, `$listFiles.files[0].size_bytes`
## Приклад — Видалення файлу після обробки

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

## Приклад — Встановлення пароля на згенерований файл

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

## Приклад — Встановлення терміну дії (TTL)

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

## Приклад — Обмеження кількості завантажень

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

## Приклад — Надання доступу для моїх команд

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

Учасники команди можуть переглядати та завантажувати файл із Drive і використовувати операції читання у workflow. Вони не можуть видаляти, повторно надавати доступ або змінювати обмеження публічного посилання.

## Приклад — Скасування доступу для моїх команд

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

## Конвертація файлу

Конвертацію форматів перенесено до вузла [Converter](./converter-node.md). Збережіть або отримайте файл за допомогою Drive, а потім передайте його id до вузла converter:

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

Оригінальний файл зберігається, а конвертований файл зберігається як новий файл Drive.

## Доступ до вихідних даних

**get:**
- `$nodeLabel.id` — UUID файлу
- `$nodeLabel.filename` — ім'я файлу
- `$nodeLabel.mime_type` — MIME-тип (наприклад, `image/png`)
- `$nodeLabel.size_bytes` — розмір файлу в байтах
- `$nodeLabel.download_url` — публічне посилання для завантаження
- `$nodeLabel.file_base64` — вміст файлу у кодуванні base64 (лише коли увімкнено **Include binary content**)

**getAll:**
- `$nodeLabel.files` — Масив об'єктів метаданих файлів
- `$nodeLabel.count` — Кількість повернутих файлів
- `$nodeLabel.files[0].id` — UUID файлу
- `$nodeLabel.files[0].filename` — Ім'я файлу
- `$nodeLabel.files[0].mime_type` — MIME-тип
- `$nodeLabel.files[0].size_bytes` — Розмір файлу в байтах
- `$nodeLabel.files[0].download_url` — Публічне посилання для завантаження, якщо існує публічний token
- `$nodeLabel.files[0].metadata` — Збережений об'єкт метаданих
- `$nodeLabel.files[0].created_at` — Часова позначка створення файлу

**downloadUrl:**
- `$nodeLabel.id` — UUID щойно збереженого файлу
- `$nodeLabel.filename` — ім'я файлу (з `Content-Disposition` або шляху URL)
- `$nodeLabel.mime_type` — MIME-тип, визначений із відповіді або розширення файлу
- `$nodeLabel.size_bytes` — розмір файлу в байтах
- `$nodeLabel.download_url` — посилання для завантаження з Drive для збереженого файлу

**delete:**
- `$nodeLabel.status` — `"deleted"`
- `$nodeLabel.file_id` — UUID видаленого файлу

**setPassword / setTtl / setMaxDownloads:**
- `$nodeLabel.status` — `"updated"`
- `$nodeLabel.file_id` — UUID файлу
- `$nodeLabel.download_url` — URL нового access token із застосованим обмеженням

**shareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID файлу
- `$nodeLabel.shared_team_count` — Кількість наданих доступів командам після операції

**unshareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID файлу
- `$nodeLabel.shared_team_count` — `0` після операції

## Право власності

Операції, доступні лише власнику, вимагають, щоб файл належав власнику workflow. Операції читання (`get`, `getAll`) також можуть отримувати доступ до файлів, наданих власнику workflow через команду.

## Пов'язані розділи

- [Генерація файлів](../reference/file-generation.md) — Як skills генерують файли та вихідні дані `_generated_files`
- [Вкладка Drive](../reference/drive.md) — Візуальне керування файлами в dashboard
- [Вузол Agent](./agent-node.md) — Запускає skills, які генерують файли
- [Вузол Converter](./converter-node.md) — Конвертує збережений файл в інший формат або розпізнає його в текст за допомогою OCR
- [Expression DSL](../reference/expression-dsl.md) — Синтаксис виразів для динамічних значень
