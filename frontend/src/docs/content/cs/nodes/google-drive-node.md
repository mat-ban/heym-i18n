# Google Drive

Uzel **Google Drive** vypisuje, stahuje, aktualizuje a odstraňuje soubory a složky v Google Drive prostřednictvím OAuth2. Dokáže také zkopírovat soubor z Drive přímo do [Heym Drive](./drive-node.md) jedinou operací.

> **Toto není uzel [Drive](./drive-node.md).** Tím je *Heym Drive* — vlastní interní úložiště souborů v Heymu. Tento uzel komunikuje s Google Drive. Operace `syncToHeymDrive` je mostem mezi oběma.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Přihlašovací údaje | Google Drive (OAuth2) |
| Výstup | `$nodeLabel.files`, `$nodeLabel.content_base64`, `$nodeLabel.download_url`, `$nodeLabel.status` |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Přihlašovací údaje Google Drive z [Přihlašovacích údajů](../tabs/credentials-tab.md) |
| `gdOperation` | string | Operace: `listFolderFiles`, `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`, `removeFolder` |
| `gdFolderId` | expression | ID složky nebo úplná URL složky v Drive. Používá se u `listFolderFiles` a `removeFolder`. Prázdná hodnota znamená kořenový adresář Drive. |
| `gdFileId` | expression | ID souboru nebo úplná URL souboru v Drive/Docs. Používá se u `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`. |
| `gdMaxResults` | expression | Pro `listFolderFiles`: maximální počet vrácených souborů (výchozí 100). Prázdná hodnota nebo `0` načte celou složku pomocí stránkování. Každý vypsaný soubor obsahuje `size_bytes`, pokud Drive hlásí velikost. |
| `gdQuery` | expression | Pro `listFolderFiles`: dodatečný dotaz Drive spojený operátorem AND s filtrem složky, např. `mimeType='application/pdf'`. |
| `gdIncludeTrashed` | boolean | Pro `listFolderFiles`: zahrnout soubory v koši. Výchozí false. |
| `gdExportFormat` | string | Pro `downloadFile` / `syncToHeymDrive`: `pdf`, `docx`, `xlsx`, `pptx`, `csv`, `txt`. Prázdná hodnota znamená automaticky. U běžných souborů se ignoruje. |
| `gdFilename` | expression | Pro `syncToHeymDrive`: přepíše název souboru uloženého v Heym Drive. |
| `gdBase64Content` | expression | Pro `updateFile`: base64 řetězec nebo `data:` URL, který nahradí obsah souboru. |
| `gdNewName` | expression | Pro `updateFile`: nový název souboru (přejmenování). |
| `gdNewParentId` | expression | Pro `updateFile`: ID cílové složky nebo URL (přesunutí). |
| `gdPermanentDelete` | boolean | Pro `removeFile` / `removeFolder`: pokud je false (výchozí), položka se přesune do koše a lze ji obnovit; pokud je true, bude nevratně zničena. |

## ID souborů a složek

`gdFileId`, `gdFolderId` a `gdNewParentId` přijímají buď **holé ID**, nebo **úplnou URL** — Heym ID automaticky extrahuje. Všechny tyto možnosti fungují:

- `https://drive.google.com/file/d/1AbCdEf/view`
- `https://drive.google.com/drive/folders/1FolderXyz`
- `https://docs.google.com/document/d/1DocId/edit`
- `https://drive.google.com/open?id=1AbCdEf`
- `1AbCdEf`

## Google Docs, Sheets a Slides

Nativní dokumenty Google **nemají žádná stahovatelná data**. Jsou to záznamy na serverech Google, nikoli soubory — Drive API vrátí `403 Only files with binary content can be downloaded`, pokud požádáte o jejich surový obsah.

`downloadFile` a `syncToHeymDrive` tyto dokumenty rozpoznají automaticky a místo stažení provedou **export**, takže žádná operace neselže jen proto, že cílem je dokument Google:

| Zdroj | Výchozí export |
|--------|----------------|
| Google Docs | PDF |
| Google Sheets | XLSX |
| Google Slides | PPTX |
| Jakýkoli jiný nativní typ Google | PDF |

Chcete-li cílový formát přepsat, nastavte **Export Format**. Toto nastavení se ignoruje u běžných nahraných souborů, které se vždy stahují tak, jak jsou.

## Operace

| Operace | Vyžadováno | Popis |
|-----------|----------|-------------|
| `listFolderFiles` | — (prázdná složka = kořen) | Vypíše soubory ve složce s volitelným filtrem dotazu |
| `downloadFile` | `gdFileId` | Stáhne data souboru jako base64, nativní dokumenty exportuje automaticky |
| `syncToHeymDrive` | `gdFileId` | Stáhne z Google Drive a výsledek uloží do Heym Drive |
| `updateFile` | `gdFileId` + alespoň jeden z obsahu / názvu / nadřazené složky | Nahradí obsah, přejmenuje a/nebo přesune |
| `removeFile` | `gdFileId` | Přesune soubor do koše (výchozí) nebo trvale odstraní |
| `removeFolder` | `gdFolderId` | Přesune složku a její obsah do koše (výchozí) nebo trvale odstraní |

### Odstranění je ve výchozím stavu obnovitelné

`removeFile` a `removeFolder` přesunou položku do **koše Google Drive**, odkud ji lze obnovit. Jde o bezpečné výchozí nastavení pro operace, které mohou běžet podle plánu nebo uvnitř [Loop](./loop-node.md).

Zapnutím **Delete permanently** položku nevratně zničíte. U `removeFolder` to zničí i vše uvnitř složky.

Uzel také kontroluje typ cíle: `removeFile` odmítne složku a `removeFolder` odmítne soubor, takže překlep v ID nemůže tiše smazat nesprávnou položku.

### updateFile ponechává prázdná pole nedotčená

`updateFile` je aktualizace, nikoli nahrazení. Vyplňte libovolnou kombinaci obsahu, nového názvu a nové složky — cokoli ponecháte prázdné, zůstane nedotčeno. Vyžadována je alespoň jedna z těchto tří hodnot.
## Nastavení přihlašovacích údajů

Google Drive používá model **OAuth2 „Bring Your Own App"**. Poskytujete vlastní přihlašovací údaje OAuth2 ze služby Google Cloud.

> **Tyto přihlašovací údaje udělují plný přístup k Disku.** Heym požaduje rozsah `https://www.googleapis.com/auth/drive`, protože uzel pracuje se soubory, které již vlastníte. Užší rozsah `drive.file` vidí pouze soubory vytvořené samotnou aplikací, což by znemožnilo výpis, aktualizaci a mazání Vašich stávajících souborů. Před sdílením těchto přihlašovacích údajů s týmem si prostudujte [Sdílení přihlašovacích údajů](../reference/credentials-sharing.md).

**Konfigurace backendu:** Nastavte **`FRONTEND_URL`** na backendu Heym na veřejnou URL adresu aplikace. URI přesměrování OAuth je vždy `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` — odvozuje se pouze z tohoto nastavení, nikoli z hlaviček požadavku.

1. Přejděte do [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → povolte **Google Drive API**.
2. Přejděte do **Credentials** → **Create Credentials** → **OAuth client ID** → vyberte **Web application**.
3. V části **Authorized redirect URIs** přidejte přesně `{your FRONTEND_URL}/api/credentials/google-drive/oauth/callback`.
4. Zkopírujte **Client ID** a **Client Secret**.
5. V Heym: **Dashboard → Credentials → New → Google Drive (OAuth2)**, vložte obě hodnoty, poté klikněte na **Connect** a v popupu schvalte přístup.

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

`size_bytes` je `null` pro složky a nativní soubory Google, které velikost neuvádějí.

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

U běžného souboru je `exported` nastaveno na `false` a `export_format` na `null`.

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

`id` je ID nového souboru v **Heym Drive**, odlišné od `google_file_id`.

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

`deleted` má hodnotu `"trashed"` nebo `"permanent"`.

## Příklad: zálohování složky Disku do Heym Drive

1. **[Cron](./cron-node.md)** — spouštění denně.
2. **Google Drive** — `listFolderFiles` na zdrojové složce, s `gdQuery` nastaveným na `mimeType='application/pdf'`, pokud chcete pouze PDF.
3. **[Loop](./loop-node.md)** — iterace přes `$ListReports.files`.
4. **Google Drive** — `syncToHeymDrive` s `gdFileId` nastaveným na `$BackupLoop.item.id` a `gdFilename` nastaveným na `$BackupLoop.item.name`.
5. **[Slack](./slack-node.md)** — odeslání souhrnu zálohovaných položek.

## Poznámky

- Každé textové pole přijímá výrazy `$`, takže ID a názvy souborů mohou pocházet z dřívějších uzlů.
- Sdílené disky jsou podporovány — uzel nastavuje `supportsAllDrives` u každého požadavku.
- Velikost stahovaných souborů je kontrolována proti nastavení `FILE_MAX_SIZE_MB` backendu.
- Připojte tento uzel ke vstupu nástroje uzlu [Agent](./agent-node.md) a pomocí ikony robota u libovolného pole nechte agenta vyplnit pole za běhu.

## Viz také

- [Drive (Heym Drive)](./drive-node.md)
- [Google Sheets](./google-sheets-node.md)
- [Loop](./loop-node.md)
- [Přihlašovací údaje](../reference/credentials.md)
- [Sdílení přihlašovacích údajů](../reference/credentials-sharing.md)
