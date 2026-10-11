# Вузол Amazon S3

Вузол Amazon S3 читає та записує об'єкти в [Amazon S3](https://aws.amazon.com/s3/).

## Підтримувані операції

- `Create Bucket`: Створює бакет у регіоні облікових даних.
- `Delete Bucket`: Видаляє порожній бакет.
- `List Buckets`: Виводить список бакетів, доступних для облікових даних.
- `Create Folder`: Створює порожній маркер теки (ключ нульового розміру, що закінчується на `/`).
- `Delete Folder`: Видаляє всі об'єкти за префіксом теки (включно з вкладеними ключами).
- `Get All in Folder`: Виводить список усіх метаданих об'єктів за префіксом теки (серверна пагінація).
- `Upload Object`: Записує текстовий payload у бакет/ключ.
- `Get Object`: Завантажує об'єкт і повертає або декодований текст, або вміст у base64.
- `Copy Object`: Копіює об'єкт в інший ключ або бакет.
- `List Objects`: Виводить список метаданих об'єктів за префіксом (одна сторінка, до 1000 ключів; підтримує continuation tokens).
- `Delete Object`: Видаляє окремий об'єкт за ключем.

## Налаштування облікових даних

Створіть облікові дані `Amazon S3` на вкладці «Облікові дані» з такими параметрами:

- Access Key ID
- Secret Access Key
- Region
- Необов'язковий Session Token (для тимчасових облікових даних AWS STS)

## Загальні поля

- `Bucket`: Назва цільового бакета (бакет призначення для операцій копіювання).
- `Object Key`: Ключ об'єкта у вигляді шляху, наприклад `reports/daily.json`.
- `Folder Path`: Префікс для операцій з теками (наприклад, `docs/archive`).
- `Source Bucket`: Необов'язковий вихідний бакет для копіювання; за замовчуванням використовується бакет призначення.
- `Source Object Key`: Вихідний ключ для операцій копіювання.
- `Prefix`: Використовується операціями списку для обмеження результатів.
- `Continuation Token`: Необов'язковий token з попередньої відповіді списку для отримання наступної сторінки.
- `Max Keys`: Розмір сторінки для List Objects (1–1000).
- `Include Binary`: Якщо увімкнено для Get Object, повертає `body_base64` замість `body_text`.
- `Body`: Текстовий вміст для завантаження.
- `Content Type`: Необов'язковий MIME-тип для завантажених об'єктів.

## Приклади виводу

### Create Bucket

- `${label}.success`
- `${label}.bucket`
- `${label}.region`

### Delete Bucket

- `${label}.success`
- `${label}.bucket`

### List Buckets

- `${label}.buckets`
- `${label}.count`
- `${label}.buckets[0].name`

### Create Folder

- `${label}.success`
- `${label}.bucket`
- `${label}.folder`
- `${label}.etag`

### Delete Folder

- `${label}.success`
- `${label}.bucket`
- `${label}.folder`
- `${label}.deleted_count`
- `${label}.deleted_keys`

### Get All in Folder

- `${label}.folder`
- `${label}.count`
- `${label}.objects`
- `${label}.objects[0].key`

### Upload Object

- `${label}.success`
- `${label}.bucket`
- `${label}.key`
- `${label}.etag`

### Get Object

- `${label}.content_type`
- `${label}.content_length`
- `${label}.body_text`
- `${label}.body_base64`

### Copy Object

- `${label}.source_bucket`
- `${label}.source_key`
- `${label}.bucket`
- `${label}.key`
- `${label}.etag`

### List Objects

- `${label}.objects`
- `${label}.count`
- `${label}.truncated`
- `${label}.next_continuation_token`
- `${label}.objects[0].key`

### Delete Object

- `${label}.success`
- `${label}.bucket`
- `${label}.key`
- `${label}.delete_marker`

## Примітки

- `Upload Object` наразі завантажує текстовий вміст у кодуванні UTF-8.
- `Get Object` може повертати base64 для бінарних файлів, якщо увімкнути відповідну опцію.
- `Create Bucket` використовує регіон облікових даних і потребує дозволу `s3:CreateBucket`.
- `Delete Bucket` вимагає, щоб бакет був порожнім, і потребує дозволу `s3:DeleteBucket`.
- `List Buckets` потребує дозволу `s3:ListAllMyBuckets`.
- `Create Folder` завантажує маркерний об'єкт нульового розміру; S3 не має вбудованого типу каталогу.
- `Delete Folder` видаляє кожен об'єкт, ключ якого починається з префікса теки; використовуйте з обережністю.
- `Get All in Folder` автоматично виконує пагінацію за префіксом, доки не буде повернуто всі об'єкти.
- `List Objects` повертає одну сторінку (до 1000 ключів). Якщо `truncated` має значення true, передайте `next_continuation_token` у поле Continuation Token наступного виклику.
- `Copy Object` потребує дозволу `s3:GetObject` для джерела та `s3:PutObject` для призначення.

## Пов'язані розділи

- [Node Types](../reference/node-types.md) – Огляд усіх типів вузлів
- [Credentials](../reference/credentials.md) – Типи облікових даних та їх використання
- [Third-Party Integrations](../reference/integrations.md) – Налаштування облікових даних Amazon S3
