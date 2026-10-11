# Google Drive

Uzol **Google Drive** zobrazuje, sťahuje, aktualizuje a odstraňuje súbory a priečinky v Google Drive prostredníctvom OAuth2. Dokáže tiež skopírovať súbor z Drive priamo do [Heym Drive](./drive-node.md) jednou operáciou.

> **Toto nie je uzol [Drive](./drive-node.md).** Tento uzol je *Heym Drive* — vlastné interné úložisko súborov v HeyMe. Tento uzol komunikuje s Google Drive. Operácia `syncToHeymDrive` je mostom medzi nimi.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Prihlasovacie údaje | Google Drive (OAuth2) |
| Výstup | `$nodeLabel.files`, `$nodeLabel.content_base64`, `$nodeLabel.download_url`, `$nodeLabel.status` |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Prihlasovacie údaje Google Drive z [Prihlasovacích údajov](../tabs/credentials-tab.md) |
| `gdOperation` | string | Operácia: `listFolderFiles`, `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`, `removeFolder` |
| `gdFolderId` | expression | ID priečinka alebo úplná URL adresa priečinka v Drive. Používa sa pri `listFolderFiles` a `removeFolder`. Prázdna hodnota znamená koreňový priečinok Drive. |
| `gdFileId` | expression | ID súboru alebo úplná URL adresa súboru/Docs. Používa sa pri `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`. |
| `gdMaxResults` | expression | Pre `listFolderFiles`: maximálny počet vrátených súborov (predvolene 100). Prázdna hodnota alebo `0` načíta celý priečinok pomocou stránkovania. Každý uvedený súbor obsahuje `size_bytes`, ak Drive nahlási veľkosť. |
| `gdQuery` | expression | Pre `listFolderFiles`: dodatočný dotaz Drive spojený operátorom AND s filtrom priečinka, napr. `mimeType='application/pdf'`. |
| `gdIncludeTrashed` | boolean | Pre `listFolderFiles`: zahrnúť súbory v koši. Predvolene false. |
| `gdExportFormat` | string | Pre `downloadFile` / `syncToHeymDrive`: `pdf`, `docx`, `xlsx`, `pptx`, `csv`, `txt`. Prázdna hodnota znamená automaticky. Ignoruje sa pri bežných súboroch. |
| `gdFilename` | expression | Pre `syncToHeymDrive`: prepíše názov súboru uloženého v Heym Drive. |
| `gdBase64Content` | expression | Pre `updateFile`: base64 reťazec alebo `data:` URL, ktorý nahradí obsah súboru. |
| `gdNewName` | expression | Pre `updateFile`: nový názov súboru (premenovanie). |
| `gdNewParentId` | expression | Pre `updateFile`: ID cieľového priečinka alebo URL adresa (presun). |
| `gdPermanentDelete` | boolean | Pre `removeFile` / `removeFolder`: ak je false (predvolene), položka sa presunie do koša a je obnoviteľná; ak je true, bude nenávratne odstránená. |

## ID súborov a priečinkov

`gdFileId`, `gdFolderId` a `gdNewParentId` akceptujú buď **holé ID**, alebo **úplnú URL adresu** — Heym extrahuje ID automaticky. Všetky nasledujúce formáty fungujú:

- `https://drive.google.com/file/d/1AbCdEf/view`
- `https://drive.google.com/drive/folders/1FolderXyz`
- `https://docs.google.com/document/d/1DocId/edit`
- `https://drive.google.com/open?id=1AbCdEf`
- `1AbCdEf`

## Google Docs, Sheets a Slides

Natívne dokumenty Google **nemajú žiadne stiahnuteľné bajty**. Sú to záznamy na serveroch Google, nie súbory — API Drive vráti `403 Only files with binary content can be downloaded`, ak požadujete ich surový obsah.

`downloadFile` a `syncToHeymDrive` ich rozpoznajú automaticky a namiesto toho vykonajú **export**, takže žiadna operácia nezosynchronizuje len preto, že cieľom je dokument Google:

| Zdroj | Predvolený export |
|--------|----------------|
| Google Docs | PDF |
| Google Sheets | XLSX |
| Google Slides | PPTX |
| Akýkoľvek iný natívny typ Google | PDF |

Nastavením **Export Format** prepíšete cieľový formát. Toto nastavenie sa ignoruje pri bežných nahraných súboroch, ktoré sa vždy sťahujú tak, ako sú.

## Operácie

| Operácia | Povinné | Popis |
|-----------|----------|-------------|
| `listFolderFiles` | — (prázdny priečinok = koreň) | Zobrazí súbory v priečinku s voliteľným filtrom dotazu |
| `downloadFile` | `gdFileId` | Stiahne bajty súboru ako base64, automaticky exportuje natívne dokumenty |
| `syncToHeymDrive` | `gdFileId` | Stiahne z Google Drive a uloží výsledok do Heym Drive |
| `updateFile` | `gdFileId` + aspoň jeden z obsahu / názvu / nadradeného priečinka | Nahradí obsah, premenuje a/alebo presunie |
| `removeFile` | `gdFileId` | Presunie do koša (predvolene) alebo natrvalo odstráni súbor |
| `removeFolder` | `gdFolderId` | Presunie do koša (predvolene) alebo natrvalo odstráni priečinok a jeho obsah |

### Odstránenie je predvolene obnoviteľné

`removeFile` a `removeFolder` presunú položku do **koša Google Drive**, odkiaľ ju možno obnoviť. Toto je bezpečné predvolené nastavenie pre niečo, čo môže bežať podľa plánu alebo v rámci [Loop](./loop-node.md).

Zapnutie **Delete permanently** zničí položku bez možnosti obnovy. Pri `removeFolder` to zničí aj všetko v danom priečinku.

Uzol tiež kontroluje typ cieľa: `removeFile` odmietne priečinok a `removeFolder` odmietne súbor, takže nesprávne zadané ID nemôže potichu odstrániť nesprávnu vec.

### updateFile ponecháva prázdne polia nedotknuté

`updateFile` je aktualizácia, nie nahradenie. Vyplňte ľubovoľnú kombináciu obsahu, nového názvu a nového priečinka — čokoľvek ponecháte prázdne, sa nezmení. Vyžaduje sa aspoň jedna z týchto troch možností.
## Nastavenie prihlasovacích údajov

Google Drive používa model **OAuth2 „Bring Your Own App"**. Poskytujete svoje vlastné prihlasovacie údaje OAuth2 pre Google Cloud.

> **Tieto prihlasovacie údaje udeľujú plný prístup k Disku.** Heym požaduje rozsah `https://www.googleapis.com/auth/drive`, pretože uzol pracuje so súbormi, ktoré už vlastníte. Užší rozsah `drive.file` vidí iba súbory, ktoré vytvorila samotná aplikácia, čo by znemožnilo vypisovanie, aktualizáciu a mazanie vašich existujúcich súborov. Pred zdieľaním týchto prihlasovacích údajov s tímom si pozrite [Zdieľanie prihlasovacích údajov](../reference/credentials-sharing.md).

**Konfigurácia backendu:** Nastavte **`FRONTEND_URL`** na backende Heym na verejnú URL adresu aplikácie. URI presmerovania OAuth je vždy `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` — odvodzuje sa výhradne z tohto nastavenia, nie z hlavičiek požiadavky.

1. Prejdite do [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → povoľte **Google Drive API**.
2. Prejdite do **Credentials** → **Create Credentials** → **OAuth client ID** → vyberte **Web application**.
3. V časti **Authorized redirect URIs** pridajte presne `{your FRONTEND_URL}/api/credentials/google-drive/oauth/callback`.
4. Skopírujte **Client ID** a **Client Secret**.
5. V Heym: **Dashboard → Prihlasovacie údaje → New → Google Drive (OAuth2)**, vložte obe hodnoty, potom kliknite na **Connect** a v okne potvrďte prístup.

## Výstup

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

`size_bytes` je `null` pre priečinky a natívne súbory Google, ktoré neuvádzajú veľkosť.

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

Pre bežný súbor je `exported` nastavené na `false` a `export_format` je `null`.

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

`id` je nové ID súboru v **Heym Drive**, odlišné od `google_file_id`.

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

`deleted` je `"trashed"` alebo `"permanent"`.

## Príklad: zálohovanie priečinka Disku do Heym Drive

1. **[Cron](./cron-node.md)** — spustenie denne.
2. **Google Drive** — `listFolderFiles` na zdrojovom priečinku, s `gdQuery` nastaveným na `mimeType='application/pdf'`, ak chcete iba PDF súbory.
3. **[Loop](./loop-node.md)** — iterujte cez `$ListReports.files`.
4. **Google Drive** — `syncToHeymDrive` s `gdFileId` nastaveným na `$BackupLoop.item.id` a `gdFilename` nastaveným na `$BackupLoop.item.name`.
5. **[Slack](./slack-node.md)** — zverejnite súhrn toho, čo bolo zálohované.

## Poznámky

- Každé textové pole akceptuje výrazy `$`, takže ID a názvy súborov môžu pochádzať z predchádzajúcich uzlov.
- Zdieľané disky sú podporované — uzol nastavuje `supportsAllDrives` pri každej požiadavke.
- Pri sťahovaní sa kontroluje veľkosť voči nastaveniu `FILE_MAX_SIZE_MB` backendu.
- Pripojte tento uzol k vstupu nástroja uzla [Agent](./agent-node.md) a použite ikonu robota pri ľubovoľnom poli, aby ho agent mohol vyplniť za behu.

## Pozri tiež

- [Drive (Heym Drive)](./drive-node.md)
- [Google Sheets](./google-sheets-node.md)
- [Loop](./loop-node.md)
- [Prihlasovacie údaje](../reference/credentials.md)
- [Zdieľanie prihlasovacích údajov](../reference/credentials-sharing.md)
