# Drive csomópont

A **Drive** csomópont a skillek által generált fájlokat kezeli közvetlenül egy workflow-n belül. Használja fájlok lekérésére, külső URL-ekről történő letöltésére, törlésére, csapataival való megosztására vagy a megosztás visszavonására, illetve a hozzáférési korlátozások (jelszó, lejárat, letöltési limit) programozott frissítésére.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.files`, `$nodeLabel.status`, `$nodeLabel.file_id`, `$nodeLabel.download_url` (műveletenként változik) |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `driveOperation` | string | Művelet: `get`, `getAll`, `downloadUrl`, `save`, `delete`, `setPassword`, `setTtl`, `setMaxDownloads`, `shareWithMyTeams`, `unshareWithMyTeams` |
| `driveFileId` | expression / select | A kezelendő Drive-fájl UUID-ja (minden műveletnél, kivéve a `getAll`, `downloadUrl` és `save` műveleteket) |
| `driveLimit` | number | A visszaadandó fájlok maximális száma (csak `getAll` esetén; üres érték esetén nincs korlát) |
| `driveSourceUrl` | expression | A Drive-ba letöltendő és tárolandó URL (csak `downloadUrl` esetén) |
| `driveFilename` | expression | Teljes fájlnév a kiterjesztéssel együtt (csak `save` esetén, pl. `1.mp3`) |
| `driveBase64Content` | expression | Nyers base64 string vagy data URL, amelyet dekódolni és tárolni kell (csak `save` esetén) |
| `driveIncludeBinary` | boolean | A fájl tartalmának base64 formátumban történő szerepeltetése a kimenetben (csak `get` esetén) |
| `drivePassword` | expression | Az access tokenre beállítandó jelszó (csak `setPassword` esetén) |
| `driveTtlHours` | number | A letöltési link lejáratáig hátralévő órák száma (csak `setTtl` esetén) |
| `driveMaxDownloads` | number | A megengedett letöltések maximális száma (csak `setMaxDownloads` esetén) |

## A fájl ID lekérése

Amikor egy skill fájlokat generál, a kimenet tartalmaz egy `_generated_files` tömböt. Minden bejegyzés tartalmaz egy `id` mezőt:

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

A fájl ID-ra így hivatkozhat: `$agentLabel._generated_files[0].id`

## Műveletek

| Művelet | Kötelező mezők | Leírás |
|-----------|----------------|-------------|
| `get` | driveFileId | Fájl metaadatainak lekérése (és opcionálisan bináris tartalmának) a Drive-ból |
| `getAll` | nincs | A tulajdonolt és csapattal megosztott, olvasható Drive-fájlok listázása metaadatokkal, például fájlnév, MIME-típus, méret, forrás és letöltési URL |
| `downloadUrl` | driveSourceUrl | Fájl letöltése egy külső URL-ről és tárolása a Drive-ban |
| `save` | driveFilename, driveBase64Content | Base64 tartalom dekódolása és Drive-fájlként történő tárolása |
| `delete` | driveFileId | A fájl és az összes hozzá tartozó access token törlése a lemezről és az adatbázisból |
| `setPassword` | driveFileId, drivePassword | Az alapértelmezett nyilvános token lecserélése jelszóval védett tokenre |
| `setTtl` | driveFileId, driveTtlHours | Az alapértelmezett nyilvános token lecserélése egy N óra után lejáró tokenre |
| `setMaxDownloads` | driveFileId, driveMaxDownloads | Az alapértelmezett nyilvános token lecserélése egy N letöltésre korlátozott tokenre |
| `shareWithMyTeams` | driveFileId | A fájl írásvédett megosztása minden csapattal, amelyhez a workflow tulajdonosa jelenleg tartozik |
| `unshareWithMyTeams` | driveFileId | Az összes csapatmegosztás eltávolítása a fájlról |

> **Megjegyzés:** A `set*` műveletek törlik az alapértelmezett (korlátozás nélküli) nyilvános tokent, és létrehoznak egy újat a megadott korlátozással. A frissített `download_url` szerepel a kimenetben.
> **Csapatmegosztás:** A `shareWithMyTeams` explicit megosztásokat hoz létre a tulajdonos jelenlegi csapatai számára. A jövőbeli csapatok nem kerülnek automatikusan hozzáadásra, kivéve, ha a művelet ismét lefut. Az `unshareWithMyTeams` eltávolítja az összes csapatmegosztást a fájlról.

## Példa — Fájl letöltése URL-ről

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

Hivatkozás a tárolt fájlra a folyamat későbbi szakaszában: `$fetchReport.id`, `$fetchReport.download_url`

A fájlnevet a `Content-Disposition` válaszfejlécből veszi át; ha ez hiányzik, az URL útvonalából származtatja.

## Példa — Base64 bemenet mentése a Drive-ba

Ezt akkor használja, ha egy szövegbeviteli csomópont (vagy bármely felsőbb csomópont) base64 fájltartalmat biztosít:

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

Hivatkozás a tárolt fájlra a folyamat későbbi szakaszában: `$saveAudio.id`, `$saveAudio.download_url`

A `driveBase64Content` elfogad nyers base64 stringet vagy `data:...;base64,...` data URL-t. A MIME-típus a fájlnév kiterjesztéséből kerül meghatározásra.

## Példa — Fájl lekérése és bináris tartalom használata vision LLM-ben

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

Hivatkozás a base64 tartalomra a folyamat későbbi szakaszában: `$fetchImage.file_base64`

A `file_base64` útján visszaadott képek inline módon jelennek meg a debug panelen, amikor futtatja a workflow-t.

## Példa — Drive-fájlok listázása

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

Hivatkozás az első visszaadott fájlra a folyamat későbbi szakaszában: `$listFiles.files[0].filename`, `$listFiles.files[0].size_bytes`
## Példa — Fájl törlése feldolgozás után

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

## Példa — Jelszó beállítása a létrehozott fájlra

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

## Példa — Lejárat beállítása (TTL)

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

## Példa — Letöltések korlátozása

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

## Példa — Megosztás a saját csapataival

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

A csapattagok megtekinthetik és letölthetik a fájlt a Drive-ból, valamint olvasási műveleteket használhatnak a workflow-kban. Nem törölhetik, nem oszthatják meg újra, és nem módosíthatják a nyilvános link korlátozásait.

## Példa — Megosztás visszavonása a saját csapataitól

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

## Fájl konvertálása

A formátumkonvertálás átkerült a [Converter](./converter-node.md) csomópontba. Tárolja vagy kérje le a fájlt a Drive segítségével, majd adja át annak azonosítóját egy converter csomópontnak:

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

Az eredeti fájl megmarad, és a konvertált fájl új Drive-fájlként kerül tárolásra.

## Kimeneti hozzáférés

**get:**
- `$nodeLabel.id` — a fájl UUID-ja
- `$nodeLabel.filename` — fájlnév
- `$nodeLabel.mime_type` — MIME-típus (pl. `image/png`)
- `$nodeLabel.size_bytes` — fájlméret bájtban
- `$nodeLabel.download_url` — nyilvános letöltési URL
- `$nodeLabel.file_base64` — base64-kódolt fájltartalom (csak akkor, ha a **Include binary content** engedélyezve van)

**getAll:**
- `$nodeLabel.files` — Fájlmetaadat-objektumok tömbje
- `$nodeLabel.count` — A visszaadott fájlok száma
- `$nodeLabel.files[0].id` — a fájl UUID-ja
- `$nodeLabel.files[0].filename` — Fájlnév
- `$nodeLabel.files[0].mime_type` — MIME-típus
- `$nodeLabel.files[0].size_bytes` — Fájlméret bájtban
- `$nodeLabel.files[0].download_url` — Nyilvános letöltési URL, ha létezik nyilvános token
- `$nodeLabel.files[0].metadata` — Tárolt metaadat-objektum
- `$nodeLabel.files[0].created_at` — A fájl létrehozásának időbélyege

**downloadUrl:**
- `$nodeLabel.id` — az újonnan tárolt fájl UUID-ja
- `$nodeLabel.filename` — fájlnév (a `Content-Disposition` fejlécből vagy az URL-útvonalból)
- `$nodeLabel.mime_type` — a válaszból vagy a fájlkiterjesztésből észlelt MIME-típus
- `$nodeLabel.size_bytes` — fájlméret bájtban
- `$nodeLabel.download_url` — a tárolt fájl Drive letöltési URL-je

**delete:**
- `$nodeLabel.status` — `"deleted"`
- `$nodeLabel.file_id` — a törölt fájl UUID-ja

**setPassword / setTtl / setMaxDownloads:**
- `$nodeLabel.status` — `"updated"`
- `$nodeLabel.file_id` — a fájl UUID-ja
- `$nodeLabel.download_url` — Új hozzáférési token URL a alkalmazott korlátozással

**shareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — a fájl UUID-ja
- `$nodeLabel.shared_team_count` — A művelet utáni csapatmegosztások száma

**unshareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — a fájl UUID-ja
- `$nodeLabel.shared_team_count` — `0` a művelet után

## Tulajdonjog

A csak tulajdonos által végezhető műveletek megkövetelik, hogy a fájl a workflow tulajdonosához tartozzon. Az olvasási műveletek (`get`, `getAll`) a workflow tulajdonosával csapaton keresztül megosztott fájlokat is elérhetik.

## Kapcsolódó

- [Fájlgenerálás](../reference/file-generation.md) — Hogyan hoznak létre fájlokat a skillek, és a `_generated_files` kimenet
- [Drive lap](../reference/drive.md) — Vizuális fájlkezelés az irányítópulton
- [Agent csomópont](./agent-node.md) — Fájlokat létrehozó skillek futtatása
- [Converter csomópont](./converter-node.md) — Tárolt fájl konvertálása másik formátumba, vagy OCR-rel szöveggé alakítása
- [Expression DSL](../reference/expression-dsl.md) — Kifejezésszintaxis dinamikus értékekhez
