# Grist

Node **Grist** membaca, menulis, dan mengelola data dalam spreadsheet Grist. Gunakan node ini untuk operasi CRUD, pembaruan batch, dan otomatisasi spreadsheet.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.records`, `$nodeLabel.record`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `credentialId` | UUID | Kredensial Grist dari [Credentials](../tabs/credentials-tab.md) |
| `gristOperation` | string | Operasi: `getRecord`, `getRecords`, `createRecord`, `createRecords`, `updateRecord`, `updateRecords`, `deleteRecord`, `listTables`, `listColumns` |
| `gristDocId` | expression | ID Dokumen (dari URL Grist) |
| `gristTableId` | expression | ID Tabel |
| `gristRecordId` | expression | ID Record (operasi record tunggal) |
| `gristRecordData` | JSON string | Nilai field untuk create/update. Gunakan **column ID** (misalnya `User_Name`), bukan label. |
| `gristRecordsData` | JSON string | Array record untuk operasi batch |
| `gristFilter` | JSON string | Filter: `{"Column_ID": [values]}` |
| `gristSort` | string | Urutan: `Column_ID` atau `-Column_ID` (menurun) |
| `gristLimit` | number | Maksimum record (default: 100) |

## Column ID vs Label

Gunakan **column ID** (garis bawah, misalnya `User_Name`) dalam `gristRecordData` dan filter, bukan label tampilan. Gunakan `listColumns` untuk menemukan column ID.

## Contoh – Get Records

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

## Contoh – Create Record

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

## Terkait

- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
- [Credentials Tab](../tabs/credentials-tab.md) – Tambahkan Grist API key
- [Third-Party Integrations](../reference/integrations.md#grist) – Penyiapan kredensial Grist
