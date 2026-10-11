# Drive

**Drive** düğümü, bir workflow içinden doğrudan skill'ler tarafından üretilen dosyaları yönetir. Dosyaları almak, harici URL'lerden dosya indirmek, silmek, ekiplerinizle paylaşmak veya paylaşımı kaldırmak ya da erişim kısıtlamalarını (parola, son kullanma tarihi, indirme limiti) programatik olarak güncellemek için kullanın.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Çıktı | `$nodeLabel.files`, `$nodeLabel.status`, `$nodeLabel.file_id`, `$nodeLabel.download_url` (işleme göre değişir) |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `driveOperation` | string | İşlem: `get`, `getAll`, `downloadUrl`, `save`, `delete`, `setPassword`, `setTtl`, `setMaxDownloads`, `shareWithMyTeams`, `unshareWithMyTeams` |
| `driveFileId` | expression / select | Yönetilecek Drive dosyasının UUID'si (`getAll`, `downloadUrl` ve `save` hariç tüm işlemler) |
| `driveLimit` | number | Döndürülecek maksimum dosya sayısı (yalnızca `getAll`; boş bırakılırsa limit yok) |
| `driveSourceUrl` | expression | Drive'a alınıp saklanacak URL (yalnızca `downloadUrl`) |
| `driveFilename` | expression | Uzantı dahil tam dosya adı (yalnızca `save`, örn. `1.mp3`) |
| `driveBase64Content` | expression | Çözümlenip saklanacak ham base64 string veya data URL (yalnızca `save`) |
| `driveIncludeBinary` | boolean | Çıktıya dosya içeriğini base64 olarak dahil et (yalnızca `get`) |
| `drivePassword` | expression | Erişim token'ına ayarlanacak parola (yalnızca `setPassword`) |
| `driveTtlHours` | number | İndirme bağlantısının sona ermesine kalan saat (yalnızca `setTtl`) |
| `driveMaxDownloads` | number | İzin verilen maksimum indirme sayısı (yalnızca `setMaxDownloads`) |

## Dosya ID'sini Alma

Bir skill dosya ürettiğinde, çıktı bir `_generated_files` dizisi içerir. Her girdi bir `id` alanı içerir:

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

Dosya ID'sine şu şekilde başvurun: `$agentLabel._generated_files[0].id`

## İşlemler

| İşlem | Gerekli Alanlar | Açıklama |
|-----------|----------------|-------------|
| `get` | driveFileId | Drive'dan dosya meta verilerini (ve isteğe bağlı olarak binary içeriği) al |
| `getAll` | yok | Sahip olunan ve ekiple paylaşılan okunabilir Drive dosyalarını; dosya adı, MIME türü, boyut, kaynak ve indirme URL'si gibi meta verilerle listele |
| `downloadUrl` | driveSourceUrl | Harici bir URL'den dosya al ve Drive'da sakla |
| `save` | driveFilename, driveBase64Content | Base64 içeriği çözümle ve Drive dosyası olarak sakla |
| `delete` | driveFileId | Dosyayı ve tüm erişim token'larını diskten ve veritabanından sil |
| `setPassword` | driveFileId, drivePassword | Varsayılan genel token'ı parola korumalı bir token ile değiştir |
| `setTtl` | driveFileId, driveTtlHours | Varsayılan genel token'ı N saat sonra sona eren bir token ile değiştir |
| `setMaxDownloads` | driveFileId, driveMaxDownloads | Varsayılan genel token'ı N indirme ile sınırlı bir token ile değiştir |
| `shareWithMyTeams` | driveFileId | Dosyayı, workflow sahibinin şu anda üye olduğu tüm ekiplerle salt okunur olarak paylaş |
| `unshareWithMyTeams` | driveFileId | Dosyadaki tüm ekip paylaşımlarını kaldır |

> **Not:** `set*` işlemleri varsayılan (kısıtlamasız) genel token'ı siler ve belirtilen kısıtlamayla yeni bir token oluşturur. Güncellenmiş `download_url` çıktıya dahil edilir.
> **Ekip paylaşımı:** `shareWithMyTeams`, sahibin mevcut ekipleri için açık paylaşımlar oluşturur. İşlem tekrar çalıştırılmadıkça gelecekteki ekipler otomatik olarak eklenmez. `unshareWithMyTeams`, dosyadaki tüm ekip paylaşımlarını kaldırır.

## Örnek — URL'den Dosya İndirme

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

Saklanan dosyaya sonraki adımlarda başvurun: `$fetchReport.id`, `$fetchReport.download_url`

Dosya adı `Content-Disposition` yanıt başlığından alınır; yoksa URL yolundan türetilir.

## Örnek — Base64 Girdisini Drive'a Kaydetme

Bir metin giriş düğümü (veya herhangi bir üst düğüm) base64 dosya içeriği sağladığında bunu kullanın:

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

Saklanan dosyaya sonraki adımlarda başvurun: `$saveAudio.id`, `$saveAudio.download_url`

`driveBase64Content`, ham bir base64 string veya bir `data:...;base64,...` data URL kabul eder. MIME türü, dosya adı uzantısından çıkarılır.

## Örnek — Dosyayı Alma ve Vision LLM'de Binary Kullanma

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

Base64 içeriğine sonraki adımlarda başvurun: `$fetchImage.file_base64`

`file_base64` aracılığıyla döndürülen görseller, workflow'u çalıştırdığınızda debug panelinde satır içi olarak görüntülenir.

## Örnek — Drive Dosyalarını Listeleme

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

Döndürülen ilk dosyaya sonraki adımlarda başvurun: `$listFiles.files[0].filename`, `$listFiles.files[0].size_bytes`
## Örnek — İşleme Sonrası Dosyayı Silme

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

## Örnek — Oluşturulan Dosyaya Parola Atama

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

## Örnek — Son Kullanma Tarihi (TTL) Ayarlama

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

## Örnek — İndirmeleri Sınırlama

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

## Örnek — Ekiplerimle Paylaşma

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

Ekip üyeleri dosyayı Drive üzerinden görüntüleyebilir ve indirebilir, ayrıca workflow'lar içinde okuma işlemlerini kullanabilir. Dosyayı silemez, yeniden paylaşamaz veya genel bağlantı kısıtlamalarını değiştiremezler.

## Örnek — Ekiplerimle Paylaşımı Kaldırma

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

## Dosya Dönüştürme

Format dönüştürme işlemi [Converter](./converter-node.md) düğümüne taşınmıştır. Dosyayı Drive ile saklayın veya getirin, ardından id'sini bir converter düğümüne aktarın:

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

Orijinal dosya korunur ve dönüştürülen dosya yeni bir Drive dosyası olarak saklanır.

## Çıktı Erişimi

**get:**
- `$nodeLabel.id` — Dosyanın UUID'si
- `$nodeLabel.filename` — Dosya adı
- `$nodeLabel.mime_type` — MIME türü (örn. `image/png`)
- `$nodeLabel.size_bytes` — Bayt cinsinden dosya boyutu
- `$nodeLabel.download_url` — Genel indirme URL'si
- `$nodeLabel.file_base64` — base64 ile kodlanmış dosya içeriği (yalnızca **Include binary content** etkinleştirildiğinde)

**getAll:**
- `$nodeLabel.files` — Dosya meta veri nesneleri dizisi
- `$nodeLabel.count` — Döndürülen dosya sayısı
- `$nodeLabel.files[0].id` — Dosyanın UUID'si
- `$nodeLabel.files[0].filename` — Dosya adı
- `$nodeLabel.files[0].mime_type` — MIME türü
- `$nodeLabel.files[0].size_bytes` — Bayt cinsinden dosya boyutu
- `$nodeLabel.files[0].download_url` — Genel token mevcut olduğunda genel indirme URL'si
- `$nodeLabel.files[0].metadata` — Saklanan meta veri nesnesi
- `$nodeLabel.files[0].created_at` — Dosya oluşturma zaman damgası

**downloadUrl:**
- `$nodeLabel.id` — Yeni saklanan dosyanın UUID'si
- `$nodeLabel.filename` — Dosya adı (`Content-Disposition` veya URL yolundan)
- `$nodeLabel.mime_type` — Yanıttan veya dosya uzantısından algılanan MIME türü
- `$nodeLabel.size_bytes` — Bayt cinsinden dosya boyutu
- `$nodeLabel.download_url` — Saklanan dosya için Drive indirme URL'si

**delete:**
- `$nodeLabel.status` — `"deleted"`
- `$nodeLabel.file_id` — Silinen dosyanın UUID'si

**setPassword / setTtl / setMaxDownloads:**
- `$nodeLabel.status` — `"updated"`
- `$nodeLabel.file_id` — Dosyanın UUID'si
- `$nodeLabel.download_url` — Kısıtlama uygulanmış yeni erişim token URL'si

**shareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — Dosyanın UUID'si
- `$nodeLabel.shared_team_count` — İşlem sonrası ekip paylaşımı sayısı

**unshareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — Dosyanın UUID'si
- `$nodeLabel.shared_team_count` — İşlem sonrası `0`

## Sahiplik

Yalnızca sahibe özel işlemler, dosyanın workflow sahibine ait olmasını gerektirir. Okuma işlemleri (`get`, `getAll`), bir ekip aracılığıyla workflow sahibiyle paylaşılan dosyalara da erişebilir.

## İlgili

- [Dosya Oluşturma](../reference/file-generation.md) - Skill'lerin dosyaları nasıl oluşturduğu ve `_generated_files` çıktısı
- [Drive Sekmesi](../reference/drive.md) - Dashboard'da görsel dosya yönetimi
- [Agent Düğümü](./agent-node.md) - Dosya oluşturan skill'leri çalıştırır
- [Converter Düğümü](./converter-node.md) - Saklanan bir dosyayı başka bir formata dönüştürün veya OCR ile metne çevirin
- [Expression DSL](../reference/expression-dsl.md) - Dinamik değerler için ifade sözdizimi
