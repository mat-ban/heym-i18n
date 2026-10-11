# Amazon S3 Node

Node-ът Amazon S3 чете и записва обекти в [Amazon S3](https://aws.amazon.com/s3/).

## Поддържани операции

- `Create Bucket`: Създава bucket в региона на удостоверението.
- `Delete Bucket`: Изтрива празен bucket.
- `List Buckets`: Изброява bucket-ите, видими за удостоверението.
- `Create Folder`: Създава маркер за празна папка (ключ с нулева дължина, завършващ с `/`).
- `Delete Folder`: Изтрива всички обекти под префикс на папка (включително вложени ключове).
- `Get All in Folder`: Изброява метаданните на всички обекти под префикс на папка (пагинация от страна на сървъра).
- `Upload Object`: Записва текстов payload в bucket/ключ.
- `Get Object`: Изтегля обект и връща декодиран текст или base64 съдържание.
- `Copy Object`: Копира обект в друг ключ или bucket.
- `List Objects`: Изброява метаданните на обекти под префикс (единична страница, до 1000 ключа; поддържа continuation token-и).
- `Delete Object`: Изтрива единичен обект по ключ.

## Настройка на удостоверение

Създайте удостоверение `Amazon S3` в раздела Удостоверения със:

- Access Key ID
- Secret Access Key
- Region
- Незадължителен Session Token (за временни AWS STS удостоверения)

## Общи полета

- `Bucket`: Име на целевия bucket (bucket за дестинация при операции за копиране).
- `Object Key`: Ключ на обект с пътеподобен формат, например `reports/daily.json`.
- `Folder Path`: Префикс за операции с папки (например `docs/archive`).
- `Source Bucket`: Незадължителен изходен bucket за копиране; по подразбиране е bucket-ът за дестинация.
- `Source Object Key`: Изходен ключ за операции за копиране.
- `Prefix`: Използва се от операциите за изброяване за ограничаване на резултатите.
- `Continuation Token`: Незадължителен token от предишен отговор на изброяване за извличане на следващата страница.
- `Max Keys`: Размер на страницата за List Objects (1–1000).
- `Include Binary`: Когато е активирано при Get Object, връща `body_base64` вместо `body_text`.
- `Body`: Текстово съдържание за качване.
- `Content Type`: Незадължителен MIME тип за качените обекти.

## Примери за изходни данни

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

## Бележки

- `Upload Object` в момента качва UTF-8 текстово съдържание.
- `Get Object` може да върне base64 за двоични файлове чрез активиране на опцията за двоични данни.
- `Create Bucket` използва региона на удостоверението и изисква `s3:CreateBucket`.
- `Delete Bucket` изисква bucket-ът да е празен и се нуждае от `s3:DeleteBucket`.
- `List Buckets` изисква `s3:ListAllMyBuckets`.
- `Create Folder` качва маркерен обект с нулева дължина; S3 няма вграден тип директория.
- `Delete Folder` премахва всеки обект, чийто ключ започва с префикса на папката; използвайте с внимание.
- `Get All in Folder` автоматично пагинира през префикса, докато бъдат върнати всички обекти.
- `List Objects` връща една страница (до 1000 ключа). Когато `truncated` е true, подайте `next_continuation_token` в полето Continuation Token на следващото извикване.
- `Copy Object` изисква `s3:GetObject` за източника и `s3:PutObject` за дестинацията.

## Свързани

- [Node Types](../reference/node-types.md) – Преглед на всички типове node-ове
- [Credentials](../reference/credentials.md) – Типове удостоверения и употреба
- [Third-Party Integrations](../reference/integrations.md) – Настройка на удостоверение Amazon S3
