# Dosya Yükleme Trigger

**Dosya Yükleme Trigger'ı** düğümü, JSON isteği içinde base64 olarak gömülemeyen **büyük bir dosyaya** (ses, video, arşivler) ihtiyaç duyan workflow'lar için sıfır girdili bir giriş noktasıdır. Workflow'un çağrılması, önceden doldurulmuş, tek kullanımlık bir `curl` yükleme bağlantısı döndürür; bu bağlantıya bir dosya yüklemek, dosya eklenmiş halde çalıştırmayı başlatır.

Bir çağıranın — bir sandbox içinde çalışan Claude veya ChatGPT gibi bir yapay zeka ajanı dahil — 20 MB'lık bir ses kaydını veya 75 MB'lık bir videoyu bir Heym workflow'una teslim etmesi gerektiğinde bunu kullanın.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girdiler | 0 |
| Çıktılar | 1 |
| Çıktı | `$nodeLabel.file.{id,name,mime,size,download_url}`, `$nodeLabel.uploaded_at` |

## Nasıl çalışır

Düğüm iki aşamada çalışır:

1. **Oluşturma (Mint).** Workflow HTTP üzerinden (`POST /api/workflows/{id}/execute`), bir MCP aracı olarak veya canvas üzerindeki **Run Workflow** düğmesi aracılığıyla çağrıldığında, çalıştırma gövdeyi **yürütmez**. Bunun yerine tek kullanımlık bir yükleme yuvası oluşturur ve şunu döndürür:

   ```json
   {
     "file_upload_required": true,
     "curl": "curl -F 'file=@/path/to/your/file' 'https://your-host/api/file-intake/u/<token>'",
     "upload_url": "https://your-host/api/file-intake/u/<token>",
     "expires_at": "2026-06-25T13:00:00+00:00",
     "max_size_mb": 100,
     "allowed_types": ["audio/*"]
   }
   ```

2. **Yükleme + çalıştırma.** Çağıran, dosyasıyla birlikte `curl` komutunu çalıştırır. Yükleme endpoint'i yuvayı doğrular, dosyayı saklar, workflow'u **senkron olarak** çalıştırır ve workflow çıktısını yükleme yanıtında döndürür. Bağlantı **tek kullanımlıktır** — ikinci bir yükleme `409` döndürür.

Canvas üzerinde, **Run Workflow** oluşturulan `curl` komutunu kopyalama düğmesiyle birlikte hata ayıklama panelinde gösterir.

## Heym üzerinden çalıştırma

İki yer, aynı bağlantı üretme ve yükleme akışı üzerinden böyle bir Workflow'u doğrudan bir dosya üzerinde çalıştırır:

- [Quick Drawer](../reference/quick-drawer.md) dosya için bir bırakma alanı gösterir. Bu çalıştırmalar geçmişte `Quick Drawer` olarak etiketlenir.
- Bir panodaki [çalıştırma widget'ı](../tabs/dashboard-tab.md#run-widgets), bırakılan her dosya için Workflow'u çalıştırır. Bu çalıştırmalar `dashboard` olarak etiketlenir.

## Parametreler

| Parametre | Tür | Varsayılan | Açıklama |
|-----------|------|---------|-------------|
| `ttlMinutes` | number | `60` | Yükleme bağlantısının geçerli kaldığı süre (1–10080 dakika / 7 güne kadar). |
| `maxSizeMb` | number | `100` | Kabul edilen maksimum dosya boyutu. Kesin üst sınır **100 MB**'tır. |
| `allowedTypes` | string | (boş) | İsteğe bağlı, virgülle ayrılmış MIME/uzantı izin listesi, örn. `audio/*, .wav`. Boş bırakıldığında her tür kabul edilir. |

## Çıktı alanları

| İfade | Açıklama |
|------------|-------------|
| `$nodeLabel.file.id` | Saklanan dosya UUID'si (bir Drive dosyası). |
| `$nodeLabel.file.name` | Orijinal dosya adı. |
| `$nodeLabel.file.mime` | Algılanan içerik türü. |
| `$nodeLabel.file.size` | Bayt cinsinden boyut. |
| `$nodeLabel.file.download_url` | Alt düğümler için kimlik doğrulamalı indirme URL'si. |
| `$nodeLabel.uploaded_at` | Yüklemenin ISO zaman damgası. |

## Örnek

Bir transkripsiyon workflow'u:

```
File Upload Trigger ("audio")  →  Transcribe ($audio.file)  →  LLM summary  →  Output
```

1. Bir ajan, workflow'un MCP aracını çağırır ve `curl` komutunu alır.
2. Ajan, sandbox'ındaki kayıtla birlikte `curl` komutunu çalıştırır.
3. Yükleme, workflow'u çalıştırır ve `curl` yanıtı transkript özetini içerir.

## Güvenlik

- Yükleme URL'si yüksek entropili bir token içerir — token **yetkinin kendisidir**, bu nedenle sandbox içindeki bir ajanın yükleme yapmak için Heym kimlik bilgilerine ihtiyacı yoktur. Sunucu tarafında yalnızca token'ın hash'i saklanır.
- Oluşturma, normal workflow kimlik doğrulaması gerektirir; bu nedenle yalnızca yetkili çağıranlar yükleme bağlantısı oluşturabilir.
- Her oluşturma ve her yükleme denemesi (kabul edilen veya reddedilen — süresi dolmuş, yeniden oynatılmış, aşırı boyutlu, izin verilmeyen tür, bilinmeyen token) yalnızca ekleme yapılabilen bir denetim kaydına yazılır.
- Yüklemeler tek kullanımlık, TTL ile sınırlandırılmış ve boyutla sınırlandırılmış olarak uygulanır; aşırı boyutlu yüklemeler reddedilir.

## Notlar

- Genel HTTP, MCP ve canvas çağrı kanalları yalnızca JSON kabul etmeye devam eder; bu düğüm, multipart dosya yüklemelerini kabul etmenin desteklenen yoludur.
- Yüklenen dosya normal bir Drive dosyası olarak saklanır; bu nedenle bir dosya referansı kabul eden herhangi bir alt düğüm (transkripsiyon, e-posta eki gönderme vb.) `$nodeLabel.file` ifadesini kullanabilir.
