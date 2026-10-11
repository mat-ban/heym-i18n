# Amazon S3

Amazon S3 düğümü, [Amazon S3](https://aws.amazon.com/s3/) içindeki nesneleri okur ve yazar.

## Desteklenen işlemler

- `Create Bucket`: Credential bölgesinde bir bucket oluşturur.
- `Delete Bucket`: Boş bir bucket'ı siler.
- `List Buckets`: Credential tarafından görülebilen bucket'ları listeler.
- `Create Folder`: Boş bir klasör işaretçisi oluşturur (`/` ile biten sıfır baytlık key).
- `Delete Folder`: Bir klasör öneki altındaki tüm nesneleri (iç içe key'ler dahil) siler.
- `Get All in Folder`: Bir klasör öneki altındaki tüm nesne meta verilerini listeler (sunucu tarafı sayfalama).
- `Upload Object`: Bir bucket/key'e metin payload'ı yazar.
- `Get Object`: Bir nesneyi indirir ve çözümlenmiş metin veya base64 içeriği döndürür.
- `Copy Object`: Bir nesneyi başka bir key'e veya bucket'a kopyalar.
- `List Objects`: Bir önek altındaki nesne meta verilerini listeler (tek sayfa, en fazla 1000 key; continuation token'ları destekler).
- `Delete Object`: Tek bir nesneyi key ile siler.

## Credential kurulumu

Credentials sekmesinde aşağıdaki bilgilerle bir `Amazon S3` credential'ı oluşturun:

- Access Key ID
- Secret Access Key
- Region
- İsteğe bağlı Session Token (geçici AWS STS credential'ları için)

## Ortak alanlar

- `Bucket`: Hedef bucket adı (kopyalama işlemleri için hedef bucket).
- `Object Key`: `reports/daily.json` gibi yol benzeri nesne key'i.
- `Folder Path`: Klasör işlemleri için önek (örneğin `docs/archive`).
- `Source Bucket`: Kopyalama için isteğe bağlı kaynak bucket; varsayılan olarak hedef bucket kullanılır.
- `Source Object Key`: Kopyalama işlemleri için kaynak key.
- `Prefix`: Sonuçları kapsamlandırmak için listeleme işlemleri tarafından kullanılır.
- `Continuation Token`: Sonraki sayfayı getirmek için önceki bir listeleme yanıtından alınan isteğe bağlı token.
- `Max Keys`: List Objects için sayfa boyutu (1–1000).
- `Include Binary`: Get Object üzerinde etkinleştirildiğinde, `body_text` yerine `body_base64` döndürür.
- `Body`: Yüklenecek metin içeriği.
- `Content Type`: Yüklenen nesneler için isteğe bağlı MIME türü.

## Çıktı örnekleri

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

## Notlar

- `Upload Object` şu anda UTF-8 metin içeriği yükler.
- `Get Object`, binary seçeneği etkinleştirilerek ikili dosyalar için base64 döndürebilir.
- `Create Bucket`, credential bölgesini kullanır ve `s3:CreateBucket` iznini gerektirir.
- `Delete Bucket`, bucket'ın boş olmasını gerektirir ve `s3:DeleteBucket` iznine ihtiyaç duyar.
- `List Buckets`, `s3:ListAllMyBuckets` iznini gerektirir.
- `Create Folder`, sıfır baytlık bir işaretçi nesnesi yükler; S3'ün yerel bir dizin türü yoktur.
- `Delete Folder`, key'i klasör önekiyle başlayan her nesneyi kaldırır; dikkatli kullanın.
- `Get All in Folder`, tüm nesneler döndürülene kadar önek boyunca otomatik olarak sayfalama yapar.
- `List Objects` tek bir sayfa döndürür (en fazla 1000 key). `truncated` true olduğunda, `next_continuation_token` değerini sonraki çağrının Continuation Token alanına geçirin.
- `Copy Object`, kaynakta `s3:GetObject` ve hedefte `s3:PutObject` izinlerini gerektirir.

## İlgili

- [Düğüm Türleri](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Credentials](../reference/credentials.md) – Credential türleri ve kullanımı
- [Üçüncü Taraf Entegrasyonları](../reference/integrations.md) – Amazon S3 credential kurulumu
