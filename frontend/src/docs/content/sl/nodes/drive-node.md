# Vozlišče Drive

Vozlišče **Drive** upravlja datoteke, ki jih generirajo veščine, neposredno znotraj workflow-a. Uporabite ga za pridobivanje datotek, prenos datotek iz zunanjih URL-jev, njihovo brisanje, deljenje ali ukinitev deljenja z vašimi ekipami ter programatsko posodabljanje njihovih dostopnih omejitev (geslo, potek, omejitev prenosa).

## Pregled

| Lastnost | Vrednost |
|----------|-------|
| Vhodi | 1 |
| Izhodi | 1 |
| Izhod | `$nodeLabel.files`, `$nodeLabel.status`, `$nodeLabel.file_id`, `$nodeLabel.download_url` (različno glede na operacijo) |

## Parametri

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `driveOperation` | niz | Operacija: `get`, `getAll`, `downloadUrl`, `save`, `delete`, `setPassword`, `setTtl`, `setMaxDownloads`, `shareWithMyTeams`, `unshareWithMyTeams` |
| `driveFileId` | izraz / izbira | UUID datoteke Drive, ki jo želite upravljati (vse operacije razen `getAll`, `downloadUrl` in `save`) |
| `driveLimit` | število | Največje število datotek, ki jih je treba vrniti (`getAll` samo; prazno pomeni brez omejitve) |
| `driveSourceUrl` | izraz | URL za pridobitev in shranjevanje v Drive (`downloadUrl` samo) |
| `driveFilename` | izraz | Polno ime datoteke, vključno z razširitvijo (`save` samo, npr. `1.mp3`) |
| `driveBase64Content` | izraz | Neobdelana base64 niz ali podatkovni URL za dekodiranje in shranjevanje (`save` samo) |
| `driveIncludeBinary` | logična | Vključi vsebino datoteke kot base64 v izhod (`get` samo) |
| `drivePassword` | izraz | Geslo za nastavitev na dostopnem žetonu (`setPassword` samo) |
| `driveTtlHours` | število | Ure, dokler ne poteče povezava za prenos (`setTtl` samo) |
| `driveMaxDownloads` | število | Največje dovoljene prenose (`setMaxDownloads` samo) |

## Pridobivanje ID-ja datoteke

Ko veščina generira datoteke, izhod vključuje niz `_generated_files`. Vsak vnos vključuje polje `id`:

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

Referencirajte ID datoteke z: `$agentLabel._generated_files[0].id`

## Operacije

| Operacija | Zahtevana polja | Opis |
|-----------|----------------|-------------|
| `get` | driveFileId | Pridobite metapodatke datoteke (in po želji binarno vsebino) iz Drive |
| `getAll` | nobeno | Prikažite lastniške in ekipno deljene berljive datoteke Drive z metapodatki, kot so ime datoteke, MIME tip, velikost, vir in URL za prenos |
| `downloadUrl` | driveSourceUrl | Pridobite datoteko iz zunanjega URL-ja in jo shranite v Drive |
| `save` | driveFilename, driveBase64Content | Dekodirajte base64 vsebino in jo shranite kot datoteko Drive |
| `delete` | driveFileId | Izbrišite datoteko in vse njene dostopne žetone z diska in baze podatkov |
| `setPassword` | driveFileId, drivePassword | Zamenjajte privzeti javni žeton z žetonom, zaščitenim z geslom |
| `setTtl` | driveFileId, driveTtlHours | Zamenjajte privzeti javni žeton z žetonom, ki poteče po N urah |
| `setMaxDownloads` | driveFileId, driveMaxDownloads | Zamenjajte privzeti javni žeton z žetonom, omejenim na N prenosov |
| `shareWithMyTeams` | driveFileId | Delite datoteko samo za branje z vsemi ekipami, katerih član je lastnik workflow-a |
| `unshareWithMyTeams` | driveFileId | Odstranite vse delitve ekipe iz datoteke |

> **Opomba:** Operacije `set*` izbrišejo privzeti (brez-omejitveni) javni žeton in ustvarijo novega z določeno omejitvijo. Posodobljen `download_url` je vključen v izhod.
> **Deljenje ekipe:** `shareWithMyTeams` ustvari eksplicitne delitve za trenutne ekipe lastnika. Prihodnje ekipe niso samodejno dodane, razen če se operacija izvede znova. `unshareWithMyTeams` odstrani vse delitve ekipe iz datoteke.

## Primer — Prenos datoteke iz URL-ja

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

Referencirajte shranjeno datoteko v nadaljnjih korakih: `$fetchReport.id`, `$fetchReport.download_url`

Ime datoteke se prevzame iz glave odgovora `Content-Disposition`; če je odsotno, se izpelje iz poti URL-ja.

## Primer — Shranjevanje base64 vnosa v Drive

Uporabite to, ko vozlišče za besedilni vhod (ali katero koli zgornje vozlišče) zagotovi base64 vsebino datoteke:

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

Referencirajte shranjeno datoteko v nadaljnjih korakih: `$saveAudio.id`, `$saveAudio.download_url`

`driveBase64Content` sprejema neobdelan base64 niz ali `data:...;base64,...` podatkovni URL. MIME tip se izpelje iz razširitve imena datoteke.

## Primer — Pridobitev datoteke in uporaba binarnih podatkov v Vision LLM

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

Referencirajte base64 vsebino v nadaljnjih korakih: `$fetchImage.file_base64`

Slike, vrnjene preko `file_base64`, so prikazane v vmesniku za odpravljanje napak, ko zaženete workflow.

## Primer — Seznam datotek Drive

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

Referencirajte prvo vrnjeno datoteko v nadaljnjih korakih: `$listFiles.files[0].filename`, `$listFiles.files[0].size_bytes`
## Primer — Izbriši datoteko po obdelavi

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

## Primer — Nastavi geslo na ustvarjeni datoteki

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

## Primer — Nastavi potek veljavnosti (TTL)

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

## Primer — Omeji prenose

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

## Primer — Deli z mojimi ekipami

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

Člani ekipe lahko ogledajo in prenesejo datoteko iz Drive ter uporabljajo operacije branja v workflows. Ne morejo izbrisati, ponovno deliti ali spremeniti omejitev javne povezave.

## Primer — Prekliči deljenje z mojimi ekipami

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

## Pretvorba datoteke

Pretvorba formatov je premaknjena na [Converter](./converter-node.md) vozlišče. Shranite ali pridobite datoteko z Drive, nato predajte njen id konverter vozlišču:

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

Izvirna datoteka je ohranjena, pretvorjena datoteka pa je shranjena kot nova datoteka v Drive.

## Dostop do izhodov

**get:**
- `$nodeLabel.id` — UUID datoteke
- `$nodeLabel.filename` — ime datoteke
- `$nodeLabel.mime_type` — MIME tip (npr. `image/png`)
- `$nodeLabel.size_bytes` — velikost datoteke v bajtih
- `$nodeLabel.download_url` — javna povezava za prenos
- `$nodeLabel.file_base64` — vsebina datoteke kodirana v base64 (samo, ko je **Vključi binarno vsebino** omogočeno)

**getAll:**
- `$nodeLabel.files` — Array objektov metapodatkov datotek
- `$nodeLabel.count` — Število vrnjenih datotek
- `$nodeLabel.files[0].id` — UUID datoteke
- `$nodeLabel.files[0].filename` — Ime datoteke
- `$nodeLabel.files[0].mime_type` — MIME tip
- `$nodeLabel.files[0].size_bytes` — Velikost datoteke v bajtih
- `$nodeLabel.files[0].download_url` — Javna povezava za prenos, ko obstaja javni token
- `$nodeLabel.files[0].metadata` — Shranjen objekt metapodatkov
- `$nodeLabel.files[0].created_at` — Časovni žig ustvarjanja datoteke

**downloadUrl:**
- `$nodeLabel.id` — UUID novo shranjene datoteke
- `$nodeLabel.filename` — ime datoteke (iz `Content-Disposition` ali URL poti)
- `$nodeLabel.mime_type` — MIME tip, zaznan iz odgovora ali končnice datoteke
- `$nodeLabel.size_bytes` — velikost datoteke v bajtih
- `$nodeLabel.download_url` — Povezava za prenos iz Drive za shranjeno datoteko

**delete:**
- `$nodeLabel.status` — `"deleted"`
- `$nodeLabel.file_id` — UUID izbrisane datoteke

**setPassword / setTtl / setMaxDownloads:**
- `$nodeLabel.status` — `"updated"`
- `$nodeLabel.file_id` — UUID datoteke
- `$nodeLabel.download_url` — Nova URL povezava za dostop z uporabo omejitve

**shareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID datoteke
- `$nodeLabel.shared_team_count` — Število delitev z ekipo po operaciji

**unshareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID datoteke
- `$nodeLabel.shared_team_count` — `0` po operaciji

## Lastništvo

Operacije, ki jih lahko izvaja le lastnik, zahtevajo, da datoteka pripada lastniku workflows. Operacije branja (`get`, `getAll`) lahko dostopajo tudi do datotek, ki so deljene z lastnikom workflows prek ekipe.

## Sorodno

- [Generiranje datotek](../reference/file-generation.md) - Kako veščine generirajo datoteke in izhod `_generated_files`
- [Zavihek Drive](../reference/drive.md) - Vizualno upravljanje datotek na nadzorni plošči
- [Agent Node](./agent-node.md) - Izvaja veščine, ki generirajo datoteke
- [Converter Node](./converter-node.md) - Pretvori shranjeno datoteko v drug format ali jo OCR pretvori v besedilo
- [Expression DSL](../reference/expression-dsl.md) - Sintaksa izrazov za dinamične vrednosti
