# Uzel Drive

Uzel **Drive** spravuje soubory generované skilly přímo v rámci workflow. Slouží k načítání souborů, stahování souborů z externích URL adres, jejich mazání, sdílení či zrušení sdílení s Vašimi týmy nebo k programové aktualizaci jejich přístupových omezení (heslo, expirace, limit stažení).

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.files`, `$nodeLabel.status`, `$nodeLabel.file_id`, `$nodeLabel.download_url` (liší se podle operace) |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `driveOperation` | string | Operace: `get`, `getAll`, `downloadUrl`, `save`, `delete`, `setPassword`, `setTtl`, `setMaxDownloads`, `shareWithMyTeams`, `unshareWithMyTeams` |
| `driveFileId` | expression / select | UUID souboru v Drive, který má být spravován (všechny operace kromě `getAll`, `downloadUrl` a `save`) |
| `driveLimit` | number | Maximální počet vrácených souborů (pouze `getAll`; prázdná hodnota znamená bez limitu) |
| `driveSourceUrl` | expression | URL adresa pro načtení a uložení do Drive (pouze `downloadUrl`) |
| `driveFilename` | expression | Úplný název souboru včetně přípony (pouze `save`, např. `1.mp3`) |
| `driveBase64Content` | expression | Nezpracovaný base64 řetězec nebo data URL pro dekódování a uložení (pouze `save`) |
| `driveIncludeBinary` | boolean | Zahrnout obsah souboru jako base64 do výstupu (pouze `get`) |
| `drivePassword` | expression | Heslo, které se má nastavit pro přístupový token (pouze `setPassword`) |
| `driveTtlHours` | number | Počet hodin do expirace odkazu ke stažení (pouze `setTtl`) |
| `driveMaxDownloads` | number | Maximální povolený počet stažení (pouze `setMaxDownloads`) |

## Získání ID souboru

Když skill generuje soubory, výstup obsahuje pole `_generated_files`. Každá položka obsahuje pole `id`:

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

Na ID souboru odkazujte pomocí: `$agentLabel._generated_files[0].id`

## Operace

| Operace | Povinná pole | Popis |
|-----------|----------------|-------------|
| `get` | driveFileId | Načte metadata souboru (a volitelně binární obsah) z Drive |
| `getAll` | žádné | Vypíše vlastněné a týmově sdílené čitelné soubory v Drive včetně metadat, jako je název souboru, MIME typ, velikost, zdroj a URL adresa ke stažení |
| `downloadUrl` | driveSourceUrl | Načte soubor z externí URL adresy a uloží jej do Drive |
| `save` | driveFilename, driveBase64Content | Dekóduje obsah base64 a uloží jej jako soubor v Drive |
| `delete` | driveFileId | Smaže soubor a všechny jeho přístupové tokeny z disku a databáze |
| `setPassword` | driveFileId, drivePassword | Nahradí výchozí veřejný token tokenem chráněným heslem |
| `setTtl` | driveFileId, driveTtlHours | Nahradí výchozí veřejný token tokenem, který expiruje po N hodinách |
| `setMaxDownloads` | driveFileId, driveMaxDownloads | Nahradí výchozí veřejný token tokenem omezeným na N stažení |
| `shareWithMyTeams` | driveFileId | Sdílí soubor v režimu pouze pro čtení se všemi týmy, do kterých vlastník workflow aktuálně patří |
| `unshareWithMyTeams` | driveFileId | Odebere souboru všechna týmová sdílení |

> **Poznámka:** Operace `set*` smažou výchozí veřejný token (bez omezení) a vytvoří nový se zadaným omezením. Aktualizovaná hodnota `download_url` je součástí výstupu.
> **Týmové sdílení:** Operace `shareWithMyTeams` vytvoří explicitní sdílení pro aktuální týmy vlastníka. Budoucí týmy nebudou přidány automaticky, pokud operace neproběhne znovu. Operace `unshareWithMyTeams` odebere souboru všechna týmová sdílení.

## Příklad — Stažení souboru z URL adresy

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

Na uložený soubor odkazujte v následujících uzlech: `$fetchReport.id`, `$fetchReport.download_url`

Název souboru se převezme z hlavičky odpovědi `Content-Disposition`; pokud chybí, odvodí se z cesty URL adresy.

## Příklad — Uložení base64 vstupu do Drive

Toto použijte, když vstupní uzel textu (nebo jakýkoli předchozí uzel) poskytuje obsah souboru ve formátu base64:

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

Na uložený soubor odkazujte v následujících uzlech: `$saveAudio.id`, `$saveAudio.download_url`

Parametr `driveBase64Content` přijímá nezpracovaný base64 řetězec nebo data URL ve formátu `data:...;base64,...`. MIME typ se odvodí z přípony názvu souboru.

## Příklad — Načtení souboru a použití binárního obsahu ve Vision LLM

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

Na obsah base64 odkazujte v následujících uzlech: `$fetchImage.file_base64`

Obrázky vrácené prostřednictvím `file_base64` se při spuštění workflow zobrazí přímo v panelu pro ladění.

## Příklad — Výpis souborů v Drive

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

Na první vrácený soubor odkazujte v následujících uzlech: `$listFiles.files[0].filename`, `$listFiles.files[0].size_bytes`
## Příklad — Smazání souboru po zpracování

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

## Příklad — Nastavení hesla u generovaného souboru

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

## Příklad — Nastavení expirace (TTL)

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

## Příklad — Omezení počtu stažení

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

## Příklad — Sdílení s mými týmy

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

Členové týmu mohou soubor zobrazit a stáhnout z Drive a používat operace čtení ve workflow. Nemohou jej však mazat, dále sdílet ani měnit omezení veřejného odkazu.

## Příklad — Zrušení sdílení s mými týmy

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

## Konverze souboru

Konverze formátu byla přesunuta do uzlu [Converter](./converter-node.md). Uložte nebo načtěte soubor pomocí Drive a poté předejte jeho id uzlu converter:

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

Původní soubor je zachován a konvertovaný soubor je uložen jako nový soubor v Drive.

## Přístup k výstupům

**get:**
- `$nodeLabel.id` — UUID souboru
- `$nodeLabel.filename` — název souboru
- `$nodeLabel.mime_type` — MIME typ (např. `image/png`)
- `$nodeLabel.size_bytes` — velikost souboru v bajtech
- `$nodeLabel.download_url` — veřejná URL pro stažení
- `$nodeLabel.file_base64` — obsah souboru kódovaný base64 (pouze pokud je povolena volba **Include binary content**)

**getAll:**
- `$nodeLabel.files` — Pole objektů s metadaty souborů
- `$nodeLabel.count` — Počet vrácených souborů
- `$nodeLabel.files[0].id` — UUID souboru
- `$nodeLabel.files[0].filename` — Název souboru
- `$nodeLabel.files[0].mime_type` — MIME typ
- `$nodeLabel.files[0].size_bytes` — Velikost souboru v bajtech
- `$nodeLabel.files[0].download_url` — Veřejná URL pro stažení, pokud existuje veřejný token
- `$nodeLabel.files[0].metadata` — Uložený objekt metadat
- `$nodeLabel.files[0].created_at` — Časové razítko vytvoření souboru

**downloadUrl:**
- `$nodeLabel.id` — UUID nově uloženého souboru
- `$nodeLabel.filename` — název souboru (z `Content-Disposition` nebo cesty URL)
- `$nodeLabel.mime_type` — MIME typ zjištěný z odpovědi nebo přípony souboru
- `$nodeLabel.size_bytes` — velikost souboru v bajtech
- `$nodeLabel.download_url` — URL pro stažení z Drive pro uložený soubor

**delete:**
- `$nodeLabel.status` — `"deleted"`
- `$nodeLabel.file_id` — UUID smazaného souboru

**setPassword / setTtl / setMaxDownloads:**
- `$nodeLabel.status` — `"updated"`
- `$nodeLabel.file_id` — UUID souboru
- `$nodeLabel.download_url` — Nová URL přístupového tokenu s aplikovaným omezením

**shareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID souboru
- `$nodeLabel.shared_team_count` — Počet sdílení s týmy po operaci

**unshareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID souboru
- `$nodeLabel.shared_team_count` — `0` po operaci

## Vlastnictví

Operace dostupné pouze pro vlastníka vyžadují, aby soubor patřil vlastníkovi workflow. Operace čtení (`get`, `getAll`) mohou také přistupovat k souborům sdíleným s vlastníkem workflow prostřednictvím týmu.

## Související

- [Generování souborů](../reference/file-generation.md) - Jak skills generují soubory a výstup `_generated_files`
- [Záložka Drive](../reference/drive.md) - Vizuální správa souborů v dashboardu
- [Uzel Agent](./agent-node.md) - Spouští skills, které generují soubory
- [Uzel Converter](./converter-node.md) - Konverze uloženého souboru do jiného formátu nebo OCR do textu
- [Expression DSL](../reference/expression-dsl.md) - Syntaxe výrazů pro dynamické hodnoty
