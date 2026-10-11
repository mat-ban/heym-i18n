# Drive čvor

**Drive** čvor upravlja datotekama generiranim od strane vještina izravno unutar workflow-a. Koristite ga za dohvaćanje datoteka, preuzimanje datoteka s vanjskih URL-ova, brisanje, dijeljenje ili ukidanje dijeljenja s vašim timovima, ili programatsko ažuriranje njihovih pristupnih ograničenja (lozinka, isteka, limit preuzimanja).

## Pregled

| Svojstvo | Vrijednost |
|----------|------------|
| Ulazi | 1 |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.files`, `$nodeLabel.status`, `$nodeLabel.file_id`, `$nodeLabel.download_url` (varira ovisno o operaciji) |

## Parametri

| Parametar | Tip | Opis |
|-----------|-----|------|
| `driveOperation` | string | Operacija: `get`, `getAll`, `downloadUrl`, `save`, `delete`, `setPassword`, `setTtl`, `setMaxDownloads`, `shareWithMyTeams`, `unshareWithMyTeams` |
| `driveFileId` | izraz / odabir | UUID datoteke Drive koju treba upravljati (sve operacije osim `getAll`, `downloadUrl` i `save`) |
| `driveLimit` | broj | Maksimalan broj datoteka za vraćanje (`getAll` samo; prazno znači bez ograničenja) |
| `driveSourceUrl` | izraz | URL za dohvaćanje i pohranu u Drive (`downloadUrl` samo) |
| `driveFilename` | izraz | Puno ime datoteke uključujući ekstenziju (`save` samo, npr. `1.mp3`) |
| `driveBase64Content` | izraz | Sirovi base64 string ili data URL za dekodiranje i pohranu (`save` samo) |
| `driveIncludeBinary` | boolean | Uključite sadržaj datoteke kao base64 u izlaz (`get` samo) |
| `drivePassword` | izraz | Lozinka za postavljanje na pristupni token (`setPassword` samo) |
| `driveTtlHours` | broj | Sati do isteka veze za preuzimanje (`setTtl` samo) |
| `driveMaxDownloads` | broj | Maksimalan broj dozvoljenih preuzimanja (`setMaxDownloads` samo) |

## Dohvaćanje ID-a datoteke

Kada vještina generira datoteke, izlaz uključuje niz `_generated_files`. Svaki unos uključuje polje `id`:

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

Referencirajte ID datoteke s: `$agentLabel._generated_files[0].id`

## Operacije

| Operacija | Obavezna polja | Opis |
|-----------|----------------|------|
| `get` | driveFileId | Dohvati metapodatke datoteke (i opcionalno binarni sadržaj) iz Drive-a |
| `getAll` | nema | Prikaži vlastite i timom dijeljene čitljive datoteke iz Drive-a s metapodacima kao što su ime datoteke, MIME tip, veličina, izvor i URL za preuzimanje |
| `downloadUrl` | driveSourceUrl | Dohvati datoteku s vanjskog URL-a i pohrani je u Drive |
| `save` | driveFilename, driveBase64Content | Dekodiraj base64 sadržaj i pohrani ga kao datoteku u Drive |
| `delete` | driveFileId | Izbriši datoteku i sve njezine pristupne tokene s diska i iz baze podataka |
| `setPassword` | driveFileId, drivePassword | Zamijeni zadani javni token s tokenom zaštićenim lozinkom |
| `setTtl` | driveFileId, driveTtlHours | Zamijeni zadani javni token s onim koji ističe nakon N sati |
| `setMaxDownloads` | driveFileId, driveMaxDownloads | Zamijeni zadani javni token s onim koji je ograničen na N preuzimanja |
| `shareWithMyTeams` | driveFileId | Dijelite datoteku samo za čitanje sa svim timovima kojima trenutni vlasnik workflow-a pripada |
| `unshareWithMyTeams` | driveFileId | Uklonite sve dijeljenja tima s datoteke |

> **Napomena:** Operacije `set*` brišu zadani (bez-ograničenja) javni token i stvaraju novi s navedenim ograničenjem. Ažurirani `download_url` uključen je u izlaz.
> **Dijeljenje tima:** `shareWithMyTeams` stvara eksplicitna dijeljenja za trenutne timove vlasnika. Budući timovi se ne dodaju automatski osim ako se operacija ne pokrene ponovno. `unshareWithMyTeams` uklanja sva dijeljenja tima s datoteke.

## Primjer — Preuzimanje datoteke s URL-a

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

Referencirajte pohranjenu datoteku nizvodno: `$fetchReport.id`, `$fetchReport.download_url`

Ime datoteke preuzima se iz `Content-Disposition` zaglavlja odgovora; ako je odsutno, derivira se iz URL putanje.

## Primjer — Spremanje Base64 ulaza u Drive

Koristite ovo kada čvor za unos teksta (ili bilo koji uzvodni čvor) pruža base64 sadržaj datoteke:

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

Referencirajte pohranjenu datoteku nizvodno: `$saveAudio.id`, `$saveAudio.download_url`

`driveBase64Content` prihvaća sirovi base64 string ili `data:...;base64,...` data URL. MIME tip se inferira iz ekstenzije imena datoteke.

## Primjer — Dohvati datoteku i koristi binarni sadržaj u Vision LLM

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

Referencirajte base64 sadržaj nizvodno: `$fetchImage.file_base64`

Slike vraćene putem `file_base64` prikazuju se unutar u debug panelu kada pokrenete workflow.

## Primjer — Popis datoteka u Drive-u

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

Referencirajte prvu vraćenu datoteku nizvodno: `$listFiles.files[0].filename`, `$listFiles.files[0].size_bytes`
## Primjer — Brisanje datoteke nakon obrade

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

## Primjer — Postavljanje lozinke na generiranu datoteku

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

## Primjer — Postavljanje isteka (TTL)

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

## Primjer — Ograničavanje preuzimanja

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

## Primjer — Dijeljenje s mojim timovima

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

Članovi tima mogu pregledavati i preuzimati datoteku s Drive-a te koristiti operacije čitanja u workflows. Ne mogu brisati, ponovno dijeliti ili mijenjati ograničenja javne poveznice.

## Primjer — Prestanak dijeljenja s mojim timovima

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

## Konverzija datoteke

Format konverzije premješten je na [Converter](./converter-node.md) čvor. Spremite ili preuzmite datoteku s Drive-a, a zatim predajte njezin id konverter čvoru:

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

Izvorna datoteka se čuva, a konvertirana datoteka se pohranjuje kao nova datoteka na Drive-u.

## Pristup izlazu

**get:**
- `$nodeLabel.id` — UUID datoteke
- `$nodeLabel.filename` — naziv datoteke
- `$nodeLabel.mime_type` — MIME tip (npr. `image/png`)
- `$nodeLabel.size_bytes` — veličina datoteke u bajtovima
- `$nodeLabel.download_url` — javna URL adresa za preuzimanje
- `$nodeLabel.file_base64` — sadržaj datoteke kodiran u base64 (samo kada je **Uključi binarni sadržaj** omogućeno)

**getAll:**
- `$nodeLabel.files` — Niz objekata metapodataka datoteka
- `$nodeLabel.count` — Broj vraćenih datoteka
- `$nodeLabel.files[0].id` — UUID datoteke
- `$nodeLabel.files[0].filename` — Naziv datoteke
- `$nodeLabel.files[0].mime_type` — MIME tip
- `$nodeLabel.files[0].size_bytes` — Veličina datoteke u bajtovima
- `$nodeLabel.files[0].download_url` — Javna URL adresa za preuzimanje kada postoji javni token
- `$nodeLabel.files[0].metadata` — Pohranjeni objekt metapodataka
- `$nodeLabel.files[0].created_at` — Timestamp stvaranja datoteke

**downloadUrl:**
- `$nodeLabel.id` — UUID novonastale datoteke
- `$nodeLabel.filename` — naziv datoteke (iz `Content-Disposition` ili URL putanje)
- `$nodeLabel.mime_type` — MIME tip otkriven iz odgovora ili ekstenzije datoteke
- `$nodeLabel.size_bytes` — veličina datoteke u bajtovima
- `$nodeLabel.download_url` — URL adresa za preuzimanje datoteke na Drive-u

**delete:**
- `$nodeLabel.status` — `"deleted"`
- `$nodeLabel.file_id` — UUID obrisane datoteke

**setPassword / setTtl / setMaxDownloads:**
- `$nodeLabel.status` — `"updated"`
- `$nodeLabel.file_id` — UUID datoteke
- `$nodeLabel.download_url` — Nova URL adresa za pristup s primijenjenim ograničenjem

**shareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID datoteke
- `$nodeLabel.shared_team_count` — Broj dijeljenja s timom nakon operacije

**unshareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID datoteke
- `$nodeLabel.shared_team_count` — `0` nakon operacije

## Vlasništvo

Operacije koje zahtijevaju vlasništvo zahtijevaju da datoteka pripada vlasniku workflow-a. Operacije čitanja (`get`, `getAll`) također mogu pristupiti datotekama dijeljenim s vlasnikom workflow-a putem tima.

## Povezano

- [Generiranje datoteka](../reference/file-generation.md) - Kako vještine generiraju datoteke i `_generated_files` izlaz
- [Drive Tab](../reference/drive.md) - Vizualno upravljanje datotekama na nadzornoj ploči
- [Agent Node](./agent-node.md) - Pokreće vještine koje generiraju datoteke
- [Converter Node](./converter-node.md) - Konvertira pohranjenu datoteku u drugi format ili OCR-uje u tekst
- [Expression DSL](../reference/expression-dsl.md) - Sintaksa izraza za dinamičke vrijednosti
