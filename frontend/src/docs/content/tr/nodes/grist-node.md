# Grist

**Grist** düğümü, Grist elektronik tablolarındaki verileri okur, yazar ve yönetir. CRUD işlemleri, toplu güncellemeler ve elektronik tablo otomasyonu için kullanın.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Çıkış | `$nodeLabel.records`, `$nodeLabel.record`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md) bölümünden Grist kimlik bilgisi |
| `gristOperation` | string | İşlem: `getRecord`, `getRecords`, `createRecord`, `createRecords`, `updateRecord`, `updateRecords`, `deleteRecord`, `listTables`, `listColumns` |
| `gristDocId` | expression | Belge Kimliği (Grist URL'sinden) |
| `gristTableId` | expression | Tablo Kimliği |
| `gristRecordId` | expression | Kayıt Kimliği (tek kayıt işlemleri) |
| `gristRecordData` | JSON string | Oluşturma/güncelleme için alan değerleri. Etiketleri değil, **sütun kimliklerini** (örn. `User_Name`) kullanın. |
| `gristRecordsData` | JSON string | Toplu işlemler için kayıt dizisi |
| `gristFilter` | JSON string | Filtre: `{"Column_ID": [values]}` |
| `gristSort` | string | Sıralama: `Column_ID` veya `-Column_ID` (azalan) |
| `gristLimit` | number | Maksimum kayıt sayısı (varsayılan: 100) |

## Sütun Kimlikleri ve Etiketler

`gristRecordData` ve filtrelerde görüntüleme etiketlerini değil, **sütun kimliklerini** (alt çizgili, örn. `User_Name`) kullanın. Sütun kimliklerini keşfetmek için `listColumns` kullanın.

## Örnek – Kayıtları Getir

```json
{
  "type": "grist",
  "data": {
    "label": "getUsers",
    "credentialId": "grist-credential-uuid",
    "gristOperation": "getRecords",
    "gristDocId": "doc-id",
    "gristTableId": "Users",
    "gristFilter": "{\"User_Status\": [\"Active\"]}",
    "gristLimit": 50
  }
}
```

## Örnek – Kayıt Oluştur

```json
{
  "type": "grist",
  "data": {
    "label": "createUser",
    "credentialId": "grist-credential-uuid",
    "gristOperation": "createRecord",
    "gristDocId": "doc-id",
    "gristTableId": "Users",
    "gristRecordData": "{\"User_Name\": \"$userInput.body.name\", \"Email_Address\": \"$userInput.body.email\"}"
  }
}
```

## İlgili

- [Node Types](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Credentials Tab](../tabs/credentials-tab.md) – Grist API anahtarı ekleme
- [Third-Party Integrations](../reference/integrations.md#grist) – Grist kimlik bilgisi kurulumu
