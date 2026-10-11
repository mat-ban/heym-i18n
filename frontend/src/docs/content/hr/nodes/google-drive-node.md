# Google Drive

Čvor **Google Drive** navodi, preuzima, ažurira i briše datoteke i mape u Google Driveu putem OAuth2. Također može kopirati datoteku iz Drivea izravno u [Heym Drive](./drive-node.md) s jednom operacijom.

> **Ovo nije čvor [Drive](./drive-node.md).** Taj čvor je *Heym Drive* — vlastito interno spremište datoteka Heyma. Ovaj čvor komunicira s Google Driveom. Operacija `syncToHeymDrive` je most između ta dva.

## Pregled

| Svojstvo | Vrijednost |
|----------|------------|
| Ulazi | 1 |
| Izlazi | 1 |
| Vjerodajnice | Google Drive (OAuth2) |
| Izlaz | `$nodeLabel.files`, `$nodeLabel.content_base64`, `$nodeLabel.download_url`, `$nodeLabel.status` |

## Parametri

| Parametar | Tip | Opis |
|-----------|-----|------|
| `credentialId` | UUID | Google Drive vjerodajnice iz [Vjerodajnica](../tabs/credentials-tab.md) |
| `gdOperation` | string | Operacija: `listFolderFiles`, `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`, `removeFolder` |
| `gdFolderId` | izraz | ID mape ili puna URL adresa mape u Driveu. Koristi se za `listFolderFiles` i `removeFolder`. Prazno znači korijen Drivea. |
| `gdFileId` | izraz | ID datoteke ili puna URL adresa Drive/Docs. Koristi se za `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`. |
| `gdMaxResults` | izraz | Za `listFolderFiles`: maksimalan broj datoteka za povrat (zadano 100). Prazno ili `0` učitava cijelu mapu putem paginacije. Svaka navedena datoteka uključuje `size_bytes` kada Drive izvještava o veličini. |
| `gdQuery` | izraz | Za `listFolderFiles`: dodatni Drive upit AND-iran s filtriranjem mape, npr. `mimeType='application/pdf'`. |
| `gdIncludeTrashed` | boolean | Za `listFolderFiles`: uključuje izbrisane datoteke. Zadano false. |
| `gdExportFormat` | string | Za `downloadFile` / `syncToHeymDrive`: `pdf`, `docx`, `xlsx`, `pptx`, `csv`, `txt`. Prazno znači automatski. Ignorira se za obične datoteke. |
| `gdFilename` | izraz | Za `syncToHeymDrive`: zamjena imena datoteke pohranjene u Heym Driveu. |
| `gdBase64Content` | izraz | Za `updateFile`: base64 string ili `data:` URL koji zamjenjuje sadržaj datoteke. |
| `gdNewName` | izraz | Za `updateFile`: novo ime datoteke (preimenovanje). |
| `gdNewParentId` | izraz | Za `updateFile`: ID odredišne mape ili URL (premještanje). |
| `gdPermanentDelete` | boolean | Za `removeFile` / `removeFolder`: kada je false (zadano) stavka se premješta u smeće i može se oporaviti; kada je true, uništava se. |

## ID-evi datoteka i mapa

`gdFileId`, `gdFolderId` i `gdNewParentId` prihvaćaju ili **goli ID** ili **punu URL adresu** — Heym automatski izvlači ID. Svi ovi formati rade:

- `https://drive.google.com/file/d/1AbCdEf/view`
- `https://drive.google.com/drive/folders/1FolderXyz`
- `https://docs.google.com/document/d/1DocId/edit`
- `https://drive.google.com/open?id=1AbCdEf`
- `1AbCdEf`

## Google Docs, Sheets i Slides

Google-nativne datoteke nemaju **preuzimljive bajtove**. One su zapisi na Googleovim poslužiteljima, a ne datoteke — Drive API vraća `403 Only files with binary content can be downloaded` ako zatražite njihov sirovi sadržaj.

`downloadFile` i `syncToHeymDrive` automatski prepoznaju ove datoteke i umjesto toga **izvoze**, tako da nijedna operacija ne ne uspije samo zato što je cilj Google Doc:

| Izvor | Zadani izvoz |
|-------|--------------|
| Google Docs | PDF |
| Google Sheets | XLSX |
| Google Slides | PPTX |
| Bilo koja druga Google-nativna vrsta | PDF |

Postavite **Izvozni format** za premošćivanje cilja. Ova postavka se ignorira za obične učitane datoteke, koje se uvijek preuzimaju onakve kakve jesu.

## Operacije

| Operacija | Obavezno | Opis |
|-----------|----------|------|
| `listFolderFiles` | — (prazna mapa = korijen) | Popis datoteka u mapi, s opcionalnim filtriranjem upita |
| `downloadFile` | `gdFileId` | Preuzimanje bajtova datoteke kao base64, automatski izvozeći nativne dokumente |
| `syncToHeymDrive` | `gdFileId` | Preuzimanje iz Google Drivea i pohrana rezultata u Heym Drive |
| `updateFile` | `gdFileId` + barem jedan od sadržaja / imena / roditelja | Zamjena sadržaja, preimenovanje i/ili premještanje |
| `removeFile` | `gdFileId` | Premještanje u smeće (zadano) ili trajno brisanje datoteke |
| `removeFolder` | `gdFolderId` | Premještanje u smeće (zadano) ili trajno brisanje mape i njezinog sadržaja |

### Brisanje je po defaultu moguće obnoviti

`removeFile` i `removeFolder` premještaju stavku u **smeće Google Drivea**, gdje se može obnoviti. Ovo je siguran zadani način za nešto što se može izvršavati prema rasporedu ili unutar [Petlje](./loop-node.md).

Omogućavanje **Trajno brisanje** uništava stavku bez mogućnosti oporavka. Za `removeFolder`, to također uništava sve unutar mape.

Čvor također provjerava vrstu cilja: `removeFile` odbija mapu, a `removeFolder` odbija datoteku, tako da pogrešno napisani ID ne može tiho izbrisati pogrešnu stavku.

### updateFile ostavlja prazna polja netaknuta

`updateFile` je ažuriranje, a ne zamjena. Ispunite bilo koju kombinaciju sadržaja, novog imena i nove mape — što god ostavite prazno neće biti dodirnuto. Potrebno je barem jedno od tri.
## Postavke vjerodajnica

Google Drive koristi model **OAuth2 "Bring Your Own App"**. Vi pružate vlastite Google Cloud OAuth2 vjerodajnice.

> **Ova vjerodajnica omogućuje potpuni pristup Drive-u.** Heym zahtijeva opseg `https://www.googleapis.com/auth/drive` jer čvor radi s datotekama koje već posjedujete. Uži opseg `drive.file` vidi samo datoteke koje je sama aplikacija stvorila, što bi onemogućilo popisivanje, ažuriranje i brisanje vaših postojećih datoteka. Pogledajte [Dijeljenje vjerodajnica](../reference/credentials-sharing.md) prije nego što podijelite ovu vjerodajnicu s timom.

**Konfiguracija pozadine:** Postavite **`FRONTEND_URL`** na Heym pozadini na javnu URL adresu aplikacije. OAuth preusmjerena URI uvijek je `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` — ona se izvodi samo iz ove postavke, a ne iz zaglavlja zahtjeva.

1. Idite na [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → omogućite **Google Drive API**.
2. Idite na **Credentials** → **Create Credentials** → **OAuth client ID** → odaberite **Web application**.
3. Pod **Authorized redirect URIs**, dodajte točno `{your FRONTEND_URL}/api/credentials/google-drive/oauth/callback`.
4. Kopirajte **Client ID** i **Client Secret**.
5. U Heym: **Dashboard → Credentials → New → Google Drive (OAuth2)**, zalijepite obje vrijednosti, a zatim kliknite **Connect** i odobrite pristup u iskačućem prozoru.

## Izlaz

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

`size_bytes` je `null` za mape i Google-nativne datoteke, koje ne izvještavaju o veličini.

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

Za običnu datoteku, `exported` je `false` i `export_format` je `null`.

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

`id` je novi **Heym Drive** ID datoteke, različit od `google_file_id`.

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

`deleted` je `"trashed"` ili `"permanent"`.

## Primjer: izradite sigurnosnu kopiju mape Drive u Heym Drive

1. **[Cron](./cron-node.md)** — pokrenite dnevno.
2. **Google Drive** — `listFolderFiles` na izvornoj mapi, s `gdQuery` postavljenim na `mimeType='application/pdf'` ako želite samo PDF-ove.
3. **[Loop](./loop-node.md)** — iterirajte kroz `$ListReports.files`.
4. **Google Drive** — `syncToHeymDrive` s `gdFileId` postavljenim na `$BackupLoop.item.id` i `gdFilename` postavljenim na `$BackupLoop.item.name`.
5. **[Slack](./slack-node.md)** — objavite sažetak onoga što je sigurnosno kopirano.

## Napomene

- Svako tekstualno polje prihvaća `$` izraze, tako da ID-evi i nazivi datoteka mogu dolaziti iz ranijih čvorova.
- Dijeljeni pogoni su podržani — čvor postavlja `supportsAllDrives` na svaki zahtjev.
- Preuzimanja se provjeravaju prema postavci `FILE_MAX_SIZE_MB` na pozadini.
- Priključite ovaj čvor na alatni ulaz čvora [Agent](./agent-node.md) i koristite ikonu bota na bilo kojem polju kako biste omogućili agentu da ga popuni u vrijeme izvođenja.

## Povezani članci

- [Drive (Heym Drive)](./drive-node.md)
- [Google Sheets](./google-sheets-node.md)
- [Loop](./loop-node.md)
- [Credentials](../reference/credentials.md)
- [Dijeljenje vjerodajnica](../reference/credentials-sharing.md)
