# Uzol Drive

Uzol **Drive** spravuje súbory generované schopnosťami priamo v rámci workflowu. Použite ho na získanie súborov, stiahnutie súborov z externých URL adries, ich vymazanie, zdieľanie alebo zrušenie zdieľania s vašimi tímami, prípadne na programovú aktualizáciu ich prístupových obmedzení (heslo, expirácia, limit stiahnutí).

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.files`, `$nodeLabel.status`, `$nodeLabel.file_id`, `$nodeLabel.download_url` (líši sa podľa operácie) |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `driveOperation` | string | Operácia: `get`, `getAll`, `downloadUrl`, `save`, `delete`, `setPassword`, `setTtl`, `setMaxDownloads`, `shareWithMyTeams`, `unshareWithMyTeams` |
| `driveFileId` | expression / select | UUID súboru v Drive, ktorý sa má spravovať (všetky operácie okrem `getAll`, `downloadUrl` a `save`) |
| `driveLimit` | number | Maximálny počet vrátených súborov (iba `getAll`; prázdna hodnota znamená bez limitu) |
| `driveSourceUrl` | expression | URL adresa na stiahnutie a uloženie v Drive (iba `downloadUrl`) |
| `driveFilename` | expression | Úplný názov súboru vrátane prípony (iba `save`, napr. `1.mp3`) |
| `driveBase64Content` | expression | Reťazec base64 alebo data URL na dekódovanie a uloženie (iba `save`) |
| `driveIncludeBinary` | boolean | Zahrnúť obsah súboru ako base64 do výstupu (iba `get`) |
| `drivePassword` | expression | Heslo, ktoré sa má nastaviť na prístupový token (iba `setPassword`) |
| `driveTtlHours` | number | Počet hodín do expirácie odkazu na stiahnutie (iba `setTtl`) |
| `driveMaxDownloads` | number | Maximálny povolený počet stiahnutí (iba `setMaxDownloads`) |

## Získanie ID súboru

Keď schopnosť generuje súbory, výstup obsahuje pole `_generated_files`. Každá položka obsahuje pole `id`:

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

Na ID súboru odkážte takto: `$agentLabel._generated_files[0].id`

## Operácie

| Operácia | Povinné polia | Popis |
|-----------|----------------|-------------|
| `get` | driveFileId | Získať metadata súboru (a voliteľne binárny obsah) z Drive |
| `getAll` | žiadne | Vypísať vlastnené a tímovo zdieľané čitateľné súbory v Drive s metadátami, ako sú názov súboru, MIME typ, veľkosť, zdroj a URL adresa na stiahnutie |
| `downloadUrl` | driveSourceUrl | Stiahnuť súbor z externej URL adresy a uložiť ho v Drive |
| `save` | driveFilename, driveBase64Content | Dekódovať obsah base64 a uložiť ho ako súbor v Drive |
| `delete` | driveFileId | Vymazať súbor a všetky jeho prístupové tokeny z disku a databázy |
| `setPassword` | driveFileId, drivePassword | Nahradiť predvolený verejný token tokenom chráneným heslom |
| `setTtl` | driveFileId, driveTtlHours | Nahradiť predvolený verejný token tokenom, ktorý expiruje po N hodinách |
| `setMaxDownloads` | driveFileId, driveMaxDownloads | Nahradiť predvolený verejný token tokenom obmedzeným na N stiahnutí |
| `shareWithMyTeams` | driveFileId | Zdieľať súbor v režime len na čítanie so všetkými tímami, ku ktorým vlastník workflowu aktuálne patrí |
| `unshareWithMyTeams` | driveFileId | Odstrániť všetky tímové zdieľania súboru |

> **Poznámka:** Operácie `set*` vymažú predvolený (neobmedzený) verejný token a vytvoria nový so zadaným obmedzením. Aktualizovaná hodnota `download_url` je zahrnutá vo výstupe.
> **Tímové zdieľanie:** Operácia `shareWithMyTeams` vytvára explicitné zdieľania pre aktuálne tímy vlastníka. Budúce tímy sa nepridajú automaticky, pokiaľ sa operácia nespustí znova. Operácia `unshareWithMyTeams` odstráni všetky tímové zdieľania súboru.

## Príklad — Stiahnutie súboru z URL adresy

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

Na uložený súbor odkážte v nadväzujúcich krokoch: `$fetchReport.id`, `$fetchReport.download_url`

Názov súboru sa prevezme z hlavičky odpovede `Content-Disposition`; ak chýba, odvodí sa z cesty URL adresy.

## Príklad — Uloženie vstupu base64 do Drive

Použite tento postup, keď textový vstupný uzol (alebo akýkoľvek predchádzajúci uzol) poskytuje obsah súboru vo formáte base64:

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

Na uložený súbor odkážte v nadväzujúcich krokoch: `$saveAudio.id`, `$saveAudio.download_url`

Parameter `driveBase64Content` akceptuje surový reťazec base64 alebo data URL vo formáte `data:...;base64,...`. MIME typ sa odvodí z prípony názvu súboru.

## Príklad — Získanie súboru a použitie binárneho obsahu vo Vision LLM

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

Na obsah base64 odkážte v nadväzujúcich krokoch: `$fetchImage.file_base64`

Obrázky vrátené prostredníctvom `file_base64` sa pri spustení workflowu zobrazia priamo v paneli ladenia.

## Príklad — Výpis súborov v Drive

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

Na prvý vrátený súbor odkážte v nadväzujúcich krokoch: `$listFiles.files[0].filename`, `$listFiles.files[0].size_bytes`
## Príklad — Odstránenie súboru po spracovaní

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

## Príklad — Nastavenie hesla pre vygenerovaný súbor

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

## Príklad — Nastavenie expirácie (TTL)

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

## Príklad — Obmedzenie počtu stiahnutí

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

## Príklad — Zdieľanie s mojimi tímami

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

Členovia tímu môžu súbor zobraziť a stiahnuť z Drive a používať operácie čítania vo workflowoch. Nemôžu ho odstrániť, opätovne zdieľať ani meniť obmedzenia verejného odkazu.

## Príklad — Zrušenie zdieľania s mojimi tímami

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

## Konverzia súboru

Konverzia formátu bola presunutá do uzla [Converter](./converter-node.md). Uložte alebo načítajte súbor pomocou Drive a potom odovzdajte jeho id uzlu konvertora:

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

Pôvodný súbor zostáva zachovaný a konvertovaný súbor sa uloží ako nový súbor v Drive.

## Prístup k výstupu

**get:**
- `$nodeLabel.id` — UUID súboru
- `$nodeLabel.filename` — názov súboru
- `$nodeLabel.mime_type` — MIME typ (napr. `image/png`)
- `$nodeLabel.size_bytes` — veľkosť súboru v bajtoch
- `$nodeLabel.download_url` — verejná URL na stiahnutie
- `$nodeLabel.file_base64` — obsah súboru kódovaný v base64 (iba ak je povolená možnosť **Include binary content**)

**getAll:**
- `$nodeLabel.files` — Pole objektov s metadátami súborov
- `$nodeLabel.count` — Počet vrátených súborov
- `$nodeLabel.files[0].id` — UUID súboru
- `$nodeLabel.files[0].filename` — Názov súboru
- `$nodeLabel.files[0].mime_type` — MIME typ
- `$nodeLabel.files[0].size_bytes` — Veľkosť súboru v bajtoch
- `$nodeLabel.files[0].download_url` — Verejná URL na stiahnutie, ak existuje verejný token
- `$nodeLabel.files[0].metadata` — Objekt uložených metadát
- `$nodeLabel.files[0].created_at` — Časová značka vytvorenia súboru

**downloadUrl:**
- `$nodeLabel.id` — UUID novo uloženého súboru
- `$nodeLabel.filename` — názov súboru (z `Content-Disposition` alebo cesty URL)
- `$nodeLabel.mime_type` — MIME typ zistený z odpovede alebo prípony súboru
- `$nodeLabel.size_bytes` — veľkosť súboru v bajtoch
- `$nodeLabel.download_url` — URL na stiahnutie z Drive pre uložený súbor

**delete:**
- `$nodeLabel.status` — `"deleted"`
- `$nodeLabel.file_id` — UUID odstráneného súboru

**setPassword / setTtl / setMaxDownloads:**
- `$nodeLabel.status` — `"updated"`
- `$nodeLabel.file_id` — UUID súboru
- `$nodeLabel.download_url` — Nová URL prístupového tokenu s uplatneným obmedzením

**shareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID súboru
- `$nodeLabel.shared_team_count` — Počet zdieľaní s tímami po operácii

**unshareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID súboru
- `$nodeLabel.shared_team_count` — `0` po operácii

## Vlastníctvo

Operácie vyhradené pre vlastníka vyžadujú, aby súbor patril vlastníkovi workflowu. Operácie čítania (`get`, `getAll`) môžu tiež pristupovať k súborom zdieľaným s vlastníkom workflowu prostredníctvom tímu.

## Súvisiace

- [Generovanie súborov](../reference/file-generation.md) - Ako skills generujú súbory a výstup `_generated_files`
- [Karta Drive](../reference/drive.md) - Vizuálna správa súborov v dashboarde
- [Uzol Agent](./agent-node.md) - Spúšťa skills, ktoré generujú súbory
- [Uzol Converter](./converter-node.md) - Konvertuje uložený súbor do iného formátu alebo ho pomocou OCR prevedie na text
- [Expression DSL](../reference/expression-dsl.md) - Syntax výrazov pre dynamické hodnoty
