# Google Drive

**Google Drive** düğümü, OAuth2 aracılığıyla Google Drive'daki dosyaları ve klasörleri listeler, indirir, günceller ve siler. Ayrıca tek bir işlemle bir Drive dosyasını doğrudan [Heym Drive](./drive-node.md) içine kopyalayabilir.

> **Bu, [Drive](./drive-node.md) düğümü değildir.** O düğüm *Heym Drive*'dır — Heym'in kendi dahili dosya depolama alanıdır. Bu düğüm Google Drive ile konuşur. `syncToHeymDrive` işlemi ikisi arasındaki köprüdür.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Credential | Google Drive (OAuth2) |
| Çıkış | `$nodeLabel.files`, `$nodeLabel.content_base64`, `$nodeLabel.download_url`, `$nodeLabel.status` |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md) bölümünden Google Drive credential'ı |
| `gdOperation` | string | İşlem: `listFolderFiles`, `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`, `removeFolder` |
| `gdFolderId` | expression | Klasör ID'si veya tam Drive klasör URL'si. `listFolderFiles` ve `removeFolder` tarafından kullanılır. Boş bırakılırsa Drive kök dizini anlamına gelir. |
| `gdFileId` | expression | Dosya ID'si veya tam Drive/Docs URL'si. `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile` tarafından kullanılır. |
| `gdMaxResults` | expression | `listFolderFiles` için: döndürülecek maksimum dosya sayısı (varsayılan 100). Boş veya `0` değeri, sayfalama yoluyla tüm klasörü yükler. Listelenen her dosya, Drive bir boyut bildirdiğinde `size_bytes` içerir. |
| `gdQuery` | expression | `listFolderFiles` için: klasör filtresiyle AND'lenen ek Drive sorgusu, örn. `mimeType='application/pdf'`. |
| `gdIncludeTrashed` | boolean | `listFolderFiles` için: çöp kutusundaki dosyaları dahil et. Varsayılan false. |
| `gdExportFormat` | string | `downloadFile` / `syncToHeymDrive` için: `pdf`, `docx`, `xlsx`, `pptx`, `csv`, `txt`. Boş bırakılırsa otomatik. Normal dosyalar için yok sayılır. |
| `gdFilename` | expression | `syncToHeymDrive` için: Heym Drive'da saklanan dosya adını geçersiz kıl. |
| `gdBase64Content` | expression | `updateFile` için: dosya içeriğini değiştiren base64 string veya `data:` URL'si. |
| `gdNewName` | expression | `updateFile` için: yeni dosya adı (yeniden adlandırma). |
| `gdNewParentId` | expression | `updateFile` için: hedef klasör ID'si veya URL'si (taşıma). |
| `gdPermanentDelete` | boolean | `removeFile` / `removeFolder` için: false (varsayılan) olduğunda öğe çöp kutusuna taşınır ve kurtarılabilir; true olduğunda yok edilir. |

## Dosya ve Klasör ID'leri

`gdFileId`, `gdFolderId` ve `gdNewParentId`, **yalın ID** veya **tam URL** kabul eder — Heym ID'yi otomatik olarak çıkarır. Aşağıdakilerin tümü çalışır:

- `https://drive.google.com/file/d/1AbCdEf/view`
- `https://drive.google.com/drive/folders/1FolderXyz`
- `https://docs.google.com/document/d/1DocId/edit`
- `https://drive.google.com/open?id=1AbCdEf`
- `1AbCdEf`

## Google Docs, Sheets ve Slides

Google'a özgü belgelerin **indirilebilir baytları yoktur**. Bunlar Google'ın sunucularındaki kayıtlardır, dosya değildir — ham içeriklerini isterseniz Drive API `403 Only files with binary content can be downloaded` hatası döndürür.

`downloadFile` ve `syncToHeymDrive` bunları otomatik olarak algılar ve bunun yerine **dışa aktarır**, böylece hedef bir Google Doc olduğu için hiçbir işlem başarısız olmaz:

| Kaynak | Varsayılan dışa aktarma |
|--------|----------------|
| Google Docs | PDF |
| Google Sheets | XLSX |
| Google Slides | PPTX |
| Diğer tüm Google'a özgü türler | PDF |

Hedefi geçersiz kılmak için **Export Format** ayarını yapın. Bu ayar, her zaman olduğu gibi indirilen normal yüklenmiş dosyalar için yok sayılır.

## İşlemler

| İşlem | Gerekli | Açıklama |
|-----------|----------|-------------|
| `listFolderFiles` | — (boş klasör = kök) | İsteğe bağlı sorgu filtresiyle bir klasördeki dosyaları listeler |
| `downloadFile` | `gdFileId` | Dosya baytlarını base64 olarak indirir, yerel belgeleri otomatik olarak dışa aktarır |
| `syncToHeymDrive` | `gdFileId` | Google Drive'dan indirir ve sonucu Heym Drive'da saklar |
| `updateFile` | `gdFileId` + içerik / ad / üst öğeden en az biri | İçeriği değiştirir, yeniden adlandırır ve/veya taşır |
| `removeFile` | `gdFileId` | Bir dosyayı çöp kutusuna taşır (varsayılan) veya kalıcı olarak siler |
| `removeFolder` | `gdFolderId` | Bir klasörü ve içeriğini çöp kutusuna taşır (varsayılan) veya kalıcı olarak siler |

### Silme varsayılan olarak kurtarılabilir

`removeFile` ve `removeFolder`, öğeyi geri yüklenebileceği **Google Drive çöp kutusuna** taşır. Bu, bir zamanlamaya göre veya bir [Loop](./loop-node.md) içinde çalışabilecek bir şey için güvenli varsayılandır.

**Delete permanently** seçeneğini etkinleştirmek, öğeyi kurtarma imkânı olmadan yok eder. `removeFolder` için bu, klasörün içindeki her şeyi de yok eder.

Düğüm ayrıca hedef türünü kontrol eder: `removeFile` bir klasörü reddeder ve `removeFolder` bir dosyayı reddeder, böylece yanlış yazılmış bir ID yanlış şeyi sessizce silemez.

### updateFile boş alanları olduğu gibi bırakır

`updateFile` bir güncellemedir, değiştirme değildir. İçerik, yeni ad ve yeni klasörün herhangi bir kombinasyonunu doldurun — boş bıraktığınız hiçbir şeye dokunulmaz. Üçünden en az biri gereklidir.
## Credential Kurulumu

Google Drive, **OAuth2 "Bring Your Own App"** modelini kullanır. Kendi Google Cloud OAuth2 credential'larınızı sağlarsınız.

> **Bu credential tam Drive erişimi verir.** Heym, `https://www.googleapis.com/auth/drive` scope'unu talep eder çünkü node, halihazırda sahip olduğunuz dosyalar üzerinde çalışır. Daha dar olan `drive.file` scope'u yalnızca uygulamanın kendisinin oluşturduğu dosyaları görür; bu da mevcut dosyalarınızı listeleme, güncelleme ve silmeyi imkansız hale getirir. Bu credential'ı bir ekiple paylaşmadan önce [Credential Sharing](../reference/credentials-sharing.md) bölümüne bakın.

**Backend yapılandırması:** Heym backend'inde **`FRONTEND_URL`** değerini uygulamanın genel URL'sine ayarlayın. OAuth redirect URI her zaman `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` şeklindedir — yalnızca bu ayardan türetilir, request header'larından değil.

1. [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → **Google Drive API**'yi etkinleştirin.
2. **Credentials** → **Create Credentials** → **OAuth client ID** → **Web application** seçin.
3. **Authorized redirect URIs** altında tam olarak `{FRONTEND_URL değeriniz}/api/credentials/google-drive/oauth/callback` ekleyin.
4. **Client ID** ve **Client Secret** değerlerini kopyalayın.
5. Heym'de: **Dashboard → Credentials → New → Google Drive (OAuth2)**, her iki değeri yapıştırın, ardından **Connect**'e tıklayın ve açılır pencerede erişimi onaylayın.

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

`size_bytes`, klasörler ve boyut bildirmeyen Google-native dosyalar için `null` değerindedir.

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

Normal bir dosya için `exported` değeri `false`, `export_format` değeri `null` olur.

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

`id`, yeni **Heym Drive** dosya ID'sidir ve `google_file_id` değerinden farklıdır.

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

`deleted` değeri `"trashed"` veya `"permanent"` olur.

## Örnek: bir Drive klasörünü Heym Drive'a yedekleme

1. **[Cron](./cron-node.md)** — günlük olarak çalıştırın.
2. **Google Drive** — kaynak klasörde `listFolderFiles` çalıştırın; yalnızca PDF'ler istiyorsanız `gdQuery` değerini `mimeType='application/pdf'` olarak ayarlayın.
3. **[Loop](./loop-node.md)** — `$ListReports.files` üzerinde iterasyon yapın.
4. **Google Drive** — `gdFileId` değerini `$BackupLoop.item.id`, `gdFilename` değerini `$BackupLoop.item.name` olarak ayarlayarak `syncToHeymDrive` çalıştırın.
5. **[Slack](./slack-node.md)** — yedeklenenlerin özetini paylaşın.

## Notlar

- Her metin alanı `$` ifadelerini kabul eder; böylece ID'ler ve dosya adları önceki node'lardan gelebilir.
- Shared drive'lar desteklenir — node her request'te `supportsAllDrives` değerini ayarlar.
- İndirmeler, backend'in `FILE_MAX_SIZE_MB` ayarına göre boyut kontrolünden geçirilir.
- Bu node'u bir [Agent](./agent-node.md) node'unun tool input'una bağlayın ve agent'ın çalışma zamanında doldurmasına izin vermek için herhangi bir alandaki bot simgesini kullanın.

## Ayrıca Bakınız

- [Drive (Heym Drive)](./drive-node.md)
- [Google Sheets](./google-sheets-node.md)
- [Loop](./loop-node.md)
- [Credentials](../reference/credentials.md)
- [Credential Sharing](../reference/credentials-sharing.md)
