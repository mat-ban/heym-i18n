# Google Drive

A **Google Drive** csomópont fájlokat és mappákat listáz, tölt le, frissít és töröl a Google Drive-ban OAuth2 segítségével. Emellett egyetlen művelettel közvetlenül át is másolhat egy Drive-fájlt a [Heym Drive](./drive-node.md) szolgáltatásba.

> **Ez nem a [Drive](./drive-node.md) csomópont.** Az a csomópont a *Heym Drive* — a Heym saját belső fájltárolója. Ez a csomópont a Google Drive-dal kommunikál. A `syncToHeymDrive` művelet képezi a hidat a kettő között.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Hitelesítési adat | Google Drive (OAuth2) |
| Kimenet | `$nodeLabel.files`, `$nodeLabel.content_base64`, `$nodeLabel.download_url`, `$nodeLabel.status` |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `credentialId` | UUID | Google Drive hitelesítési adat a [Hitelesítési adatok](../tabs/credentials-tab.md) közül |
| `gdOperation` | string | Művelet: `listFolderFiles`, `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`, `removeFolder` |
| `gdFolderId` | expression | Mappa-azonosító vagy teljes Drive-mappa URL. A `listFolderFiles` és a `removeFolder` művelet használja. Üres érték esetén a Drive gyökérkönyvtárára mutat. |
| `gdFileId` | expression | Fájl-azonosító vagy teljes Drive/Docs URL. A `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile` művelet használja. |
| `gdMaxResults` | expression | A `listFolderFiles` művelethez: a visszaadandó fájlok maximális száma (alapértelmezés: 100). Üres vagy `0` érték esetén a teljes mappa betöltése lapozással történik. Minden listázott fájl tartalmazza a `size_bytes` mezőt, ha a Drive jelent méretet. |
| `gdQuery` | expression | A `listFolderFiles` művelethez: további Drive-lekérdezés, amely a mappaszűrővel ÉS kapcsolatban kerül kiértékelésre, pl. `mimeType='application/pdf'`. |
| `gdIncludeTrashed` | boolean | A `listFolderFiles` művelethez: a kukába helyezett fájlok belefoglalása. Alapértelmezés: false. |
| `gdExportFormat` | string | A `downloadFile` / `syncToHeymDrive` művelethez: `pdf`, `docx`, `xlsx`, `pptx`, `csv`, `txt`. Üres érték esetén automatikus. Normál fájlok esetén figyelmen kívül marad. |
| `gdFilename` | expression | A `syncToHeymDrive` művelethez: a Heym Drive-ban tárolt fájlnév felülírása. |
| `gdBase64Content` | expression | Az `updateFile` művelethez: base64 karakterlánc vagy `data:` URL, amely lecseréli a fájl tartalmát. |
| `gdNewName` | expression | Az `updateFile` művelethez: új fájlnév (átnevezés). |
| `gdNewParentId` | expression | Az `updateFile` művelethez: célmappa azonosítója vagy URL-je (áthelyezés). |
| `gdPermanentDelete` | boolean | A `removeFile` / `removeFolder` művelethez: false (alapértelmezés) esetén az elem a kukába kerül és visszaállítható; true esetén véglegesen törlődik. |

## Fájl- és mappa-azonosítók

A `gdFileId`, `gdFolderId` és `gdNewParentId` paraméterek elfogadják a **puszta azonosítót** vagy egy **teljes URL-t** is — a Heym automatikusan kinyeri az azonosítót. Az alábbiak mindegyike működik:

- `https://drive.google.com/file/d/1AbCdEf/view`
- `https://drive.google.com/drive/folders/1FolderXyz`
- `https://docs.google.com/document/d/1DocId/edit`
- `https://drive.google.com/open?id=1AbCdEf`
- `1AbCdEf`

## Google Docs, Sheets és Slides

A Google natív dokumentumainak **nincsenek letölthető bájtjai**. Ezek a Google szerverein lévő rekordok, nem fájlok — a Drive API a `403 Only files with binary content can be downloaded` hibát adja vissza, ha a nyers tartalmukat kéri.

A `downloadFile` és a `syncToHeymDrive` művelet ezeket automatikusan felismeri, és helyette **exportál**, így egyetlen művelet sem hiúsul meg pusztán azért, mert a cél egy Google Doc:

| Forrás | Alapértelmezett export |
|--------|----------------|
| Google Docs | PDF |
| Google Sheets | XLSX |
| Google Slides | PPTX |
| Bármely más Google natív típus | PDF |

Az **Export Format** beállításával felülírhatja a célformátumot. A beállítás a normál feltöltött fájlok esetén figyelmen kívül marad, amelyek mindig változatlan formában töltődnek le.

## Műveletek

| Művelet | Kötelező | Leírás |
|-----------|----------|-------------|
| `listFolderFiles` | — (üres mappa = gyökér) | Fájlok listázása egy mappában, opcionális lekérdezésszűrővel |
| `downloadFile` | `gdFileId` | Fájlbájtok letöltése base64 formátumban, a natív dokumentumok automatikus exportálásával |
| `syncToHeymDrive` | `gdFileId` | Letöltés a Google Drive-ból, és az eredmény tárolása a Heym Drive-ban |
| `updateFile` | `gdFileId` + legalább az egyik a tartalom / név / szülő közül | Tartalom cseréje, átnevezés és/vagy áthelyezés |
| `removeFile` | `gdFileId` | Fájl kukába helyezése (alapértelmezés) vagy végleges törlése |
| `removeFolder` | `gdFolderId` | Mappa és tartalmának kukába helyezése (alapértelmezés) vagy végleges törlése |

### A törlés alapértelmezés szerint visszaállítható

A `removeFile` és a `removeFolder` művelet az elemet a **Google Drive kukájába** helyezi, ahonnan visszaállítható. Ez a biztonságos alapértelmezés olyan esetekben, amikor a művelet ütemezés szerint vagy egy [Loop](./loop-node.md) csomóponton belül futhat.

A **Delete permanently** engedélyezése nyomán az elem helyreállítási lehetőség nélkül megsemmisül. A `removeFolder` művelet esetén ez a mappa teljes tartalmát is megsemmisíti.

A csomópont a cél típusát is ellenőrzi: a `removeFile` elutasítja a mappát, a `removeFolder` pedig a fájlt, így egy elgépelt azonosító nem törölhet csendben valami mást.

### Az updateFile érintetlenül hagyja az üres mezőket

Az `updateFile` frissítés, nem csere. Töltse ki a tartalom, az új név és az új mappa bármely kombinációját — amit üresen hagy, azt nem érinti a művelet. A három közül legalább az egyik megadása kötelező.
## Hitelesítési adatok beállítása

A Google Drive az **OAuth2 „Bring Your Own App”** modellt használja. Ön biztosítja a saját Google Cloud OAuth2 hitelesítési adatait.

> **Ez a hitelesítési adat teljes Drive-hozzáférést biztosít.** A Heym a `https://www.googleapis.com/auth/drive` hatókört kéri, mivel a csomópont az Ön tulajdonában lévő fájlokon működik. A szűkebb `drive.file` hatókör csak az alkalmazás által létrehozott fájlokat látja, ami lehetetlenné tenné a meglévő fájlok listázását, frissítését és törlését. Mielőtt megosztaná ezt a hitelesítési adatot egy csapattal, tekintse meg a [Hitelesítési adatok megosztása](../reference/credentials-sharing.md) részt.

**Backend konfiguráció:** Állítsa be a **`FRONTEND_URL`** értékét a Heym backendben az alkalmazás nyilvános URL-jére. Az OAuth átirányítási URI mindig `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` — kizárólag ebből a beállításból származik, nem a kérés fejléceiből.

1. Nyissa meg a [Google Cloud Console](https://console.cloud.google.com) oldalt → **APIs & Services** → **Enable APIs** → engedélyezze a **Google Drive API**-t.
2. Nyissa meg a **Credentials** → **Create Credentials** → **OAuth client ID** menüpontot → válassza a **Web application** lehetőséget.
3. Az **Authorized redirect URIs** alatt pontosan adja hozzá a `{your FRONTEND_URL}/api/credentials/google-drive/oauth/callback` értéket.
4. Másolja ki a **Client ID** és **Client Secret** értékeket.
5. A Heymben: **Dashboard → Credentials → New → Google Drive (OAuth2)**, illessze be mindkét értéket, majd kattintson a **Connect** gombra, és a felugró ablakban hagyja jóvá a hozzáférést.

## Kimenet

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

A `size_bytes` értéke `null` a mappák és a Google-natív fájlok esetében, amelyek nem adnak meg méretet.

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

Egy normál fájl esetében az `exported` értéke `false`, az `export_format` pedig `null`.

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

Az `id` az új **Heym Drive** fájlazonosító, amely különbözik a `google_file_id` értéktől.

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

A `deleted` értéke `"trashed"` vagy `"permanent"`.

## Példa: Drive-mappa mentése a Heym Drive-ba

1. **[Cron](./cron-node.md)** — napi futtatás.
2. **Google Drive** — `listFolderFiles` a forrásmappán, a `gdQuery` értéke `mimeType='application/pdf'`, ha csak PDF-eket szeretne.
3. **[Loop](./loop-node.md)** — iteráljon a `$ListReports.files` értéken.
4. **Google Drive** — `syncToHeymDrive` a `gdFileId` értékeként `$BackupLoop.item.id`, a `gdFilename` értékeként pedig `$BackupLoop.item.name` beállítással.
5. **[Slack](./slack-node.md)** — tegyen közzé egy összegzést arról, mi került mentésre.

## Megjegyzések

- Minden szövegmező elfogad `$` kifejezéseket, így az azonosítók és fájlnevek korábbi csomópontokból származhatnak.
- A megosztott meghajtók támogatottak — a csomópont minden kérésnél beállítja a `supportsAllDrives` értéket.
- A letöltések méretét a backend `FILE_MAX_SIZE_MB` beállításához viszonyítva ellenőrzi a rendszer.
- Csatlakoztassa ezt a csomópontot egy [Agent](./agent-node.md) csomópont eszközbemenetéhez, és bármely mezőn használja a bot ikont, hogy az agent futásidőben kitöltse azt.

## Lásd még

- [Drive (Heym Drive)](./drive-node.md)
- [Google Sheets](./google-sheets-node.md)
- [Loop](./loop-node.md)
- [Hitelesítési adatok](../reference/credentials.md)
- [Hitelesítési adatok megosztása](../reference/credentials-sharing.md)
