# Google Sheets

**Google Sheets** düğümü, OAuth2 aracılığıyla Google Sheets elektronik tablolarındaki verileri okur, yazar ve yönetir. Raporları okuma, sonuçları kaydetme, takip tablolarını güncelleme ve daha fazlası için elektronik tablo iş akışlarını otomatikleştirmek üzere kullanın.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Kimlik Bilgisi | Google Sheets (OAuth2) |
| Çıkış | `$nodeLabel.values`, `$nodeLabel.updatedRange`, `$nodeLabel.sheets`, `$nodeLabel.success` |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `credentialId` | UUID | [Kimlik Bilgileri](../tabs/credentials-tab.md) bölümünden Google Sheets kimlik bilgisi |
| `gsOperation` | string | İşlem: `readRange`, `appendRows`, `updateRange`, `clearRange`, `getSheetInfo` |
| `gsSpreadsheetId` | expression | Elektronik tablo ID'si veya tam Google Sheets URL'si |
| `gsSheetName` | expression | Sayfa sekmesi adı (örn. `Sheet1`). `getSheetInfo` için gerekli değildir. |
| `gsStartRow` | expression | `readRange` için: 1 tabanlı ilk veri satırı (`gsHasHeader` ile, 1. satır başlıktır). |
| `gsMaxRows` | expression | `readRange` için: maksimum veri satırı sayısı (0 = tümü). |
| `gsHasHeader` | boolean | `readRange` için: true olduğunda 1. satırı sütun adları olarak kabul et. |
| `gsUpdateRow` | expression | Yalnızca `updateRange` için: güncellenecek 1 tabanlı sayfa satır numarası (A–Z sütunları); ayarlanmazsa `gsStartRow` kullanılır. batchUpdate değil — tek bir values API PUT isteği. |
| `gsRange` | expression | A1 gösteriminde aralık (örn. `A1:D100`). Eski örnekler; düzenleyici okuma/güncelleme için satır alanlarını kullanır. |
| `gsKeepHeader` | boolean | Yalnızca `clearRange` için: true olduğunda 1. satır korunur ve altındaki veri satırları temizlenir (A–Z sütunları). |
| `gsAppendPlacement` | `append` \| `prepend` | Yalnızca `appendRows` için: **Bottom** veri bulunan son satırdan sonra ekler; **Top** yeni satırları doğrudan 1. satırın altına ekler (verileri aşağı kaydırır). |
| `gsValuesInputMode` | `raw` \| `selective` | `appendRows` / `updateRange` için: **Raw** = tam JSON dizisi; **Selective** = tek bir sayfa satırı, yalnızca sütun alanları (A1 etiketleri yok). |
| `gsValuesSelectiveCols` | string | Selective modu: sütun sayısı (A–Z). |
| `gsValues` | expression | Değerlerin JSON 2D dizisi (örn. `[["Name","Age"],["Alice",30]]`). `appendRows`, `updateRange` için gereklidir. |

## Elektronik Tablo ID'si

`gsSpreadsheetId` alanı, **yalın ID**'yi (bir Google Sheets URL'sinde `/d/` ile `/edit` arasındaki uzun alfanümerik dize) veya **tam URL**'yi kabul eder — Heym ID'yi otomatik olarak çıkarır.

## Kimlik Bilgisi Kurulumu

Google Sheets, **OAuth2 "Kendi Uygulamanızı Getirin"** modelini kullanır. Kendi Google Cloud OAuth2 kimlik bilgilerinizi sağlarsınız.

**Backend yapılandırması:** Heym backend'inde **`FRONTEND_URL`** değerini uygulamanın genel URL'sine (kullanıcıların tarayıcıya yazdığı adres) ayarlayın, örn. `https://your-heym-domain`. OAuth yönlendirme URI'si her zaman `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` şeklindedir — yalnızca bu ayardan türetilir, istek başlıklarından değil.

1. [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → **Google Sheets API**'yi etkinleştirin.
2. **Credentials** → **Create Credentials** → **OAuth client ID** → **Web application** seçeneğini seçin.
3. **Authorized redirect URIs** altında tam olarak şunu ekleyin: `{your FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` (örneğin `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`).
4. **Client ID** ve **Client Secret** değerlerini kopyalayın.
5. Heym Dashboard → **Credentials** → **New** → **Google Sheets (OAuth2)** seçeneğini seçin.
6. Client ID, Client Secret ve bir ad girin, ardından tarayıcı açılır penceresinde OAuth2 onayını tamamlamak için **Connect**'e tıklayın.

Token'lar arka planda otomatik olarak yenilenir — manuel token yönetimi gerekmez.

## İşlemler

| İşlem | Gerekli Alanlar | Açıklama |
|-----------|-----------------|-------------|
| `readRange` | gsSpreadsheetId, gsSheetName, gsStartRow, gsMaxRows, gsHasHeader | Hücre değerlerini okuyun (A–Z); eski akışlarda isteğe bağlı `gsRange` |
| `appendRows` | gsSpreadsheetId, gsSheetName, gsValues | Satırları en alta (`gsAppendPlacement` append) veya 1. satırın altına (`prepend`) ekleyin |
| `updateRange` | gsSpreadsheetId, gsSheetName, gsUpdateRow, gsValues | `gsUpdateRow`'dan başlayarak satır(lar)ı üzerine yazın (A–Z); çok satırlı JSON ardışık satırlara yazar |
| `clearRange` | gsSpreadsheetId, gsSheetName | Sekme için A–Z sütunlarındaki tüm değerleri temizleyin; isteğe bağlı `gsKeepHeader` ilk satırı korur |
| `getSheetInfo` | gsSpreadsheetId | Elektronik tablo başlığını ve sayfa sekmelerinin listesini alın |

## Çıkış Referansı

| İşlem | Çıkış alanı | Tür | Açıklama |
|-----------|-------------|------|-------------|
| `readRange` | `.rows` | array | Satır nesneleri: sütun anahtarları (başlık adları veya A, B, …) artı **`rowIndex`** (1 tabanlı sayfa satırı) |
| `readRange` | `.total` | number | Döndürülen veri satırı sayısı |
| `appendRows` | `.updatedRange` | string | Yazılan aralık |
| `appendRows` | `.updates` | number | Eklenen satır sayısı |
| `updateRange` | `.updatedRange` | string | Yazılan aralık |
| `updateRange` | `.updatedCells` | number | Güncellenen hücre sayısı |
| `clearRange` | `.clearedRange` | string | Temizlenen aralık |
| `getSheetInfo` | `.title` | string | Elektronik tablo başlığı |
| `getSheetInfo` | `.sheets` | array | `{sheetId, title}` nesnelerinin listesi |

Tüm işlemler çıktıda `success: true` ve `operation: "<name>"` içerir.
## Örnek – Bir Aralığı Okuma

```json
{
  "type": "googleSheets",
  "data": {
    "label": "readReport",
    "credentialId": "google-sheets-credential-uuid",
    "gsOperation": "readRange",
    "gsSpreadsheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
    "gsSheetName": "Sheet1",
    "gsRange": "A1:D100"
  }
}
```

Çıktıya erişim: `$readReport.rows[0]` (ilk veri satırı nesnesi), `$readReport.rows[0].Name` (başlığa göre sütun), `$readReport.rows[0].rowIndex` (1 tabanlı sayfa satırı).

## Örnek – Girişten Bir Satır Ekleme

```json
{
  "type": "googleSheets",
  "data": {
    "label": "logEntry",
    "credentialId": "google-sheets-credential-uuid",
    "gsOperation": "appendRows",
    "gsSpreadsheetId": "$input.spreadsheetUrl",
    "gsSheetName": "Log",
    "gsValues": "[[\"$input.name\", \"$input.email\", \"$input.timestamp\"]]"
  }
}
```

## İlgili

- [Düğüm Türleri](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Credentials Sekmesi](../tabs/credentials-tab.md) – Google Sheets OAuth2 credential ekleme
- [Üçüncü Taraf Entegrasyonları](../reference/integrations.md#google-sheets-oauth2) – Google Sheets credential kurulumu
