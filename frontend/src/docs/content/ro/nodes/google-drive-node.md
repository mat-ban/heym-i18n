# Google Drive

Nodul **Google Drive** listează, descarcă, actualizează și șterge fișiere și foldere din Google Drive prin OAuth2. De asemenea, poate copia un fișier Drive direct în [Heym Drive](./drive-node.md) printr-o singură operație.

> **Acesta nu este nodul [Drive](./drive-node.md).** Acel nod este *Heym Drive* — stocarea internă de fișiere proprie Heym. Acest nod comunică cu Google Drive. Operația `syncToHeymDrive` este puntea dintre cele două.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Acreditare | Google Drive (OAuth2) |
| Ieșire | `$nodeLabel.files`, `$nodeLabel.content_base64`, `$nodeLabel.download_url`, `$nodeLabel.status` |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `credentialId` | UUID | Acreditarea Google Drive din [Acreditări](../tabs/credentials-tab.md) |
| `gdOperation` | string | Operația: `listFolderFiles`, `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`, `removeFolder` |
| `gdFolderId` | expression | ID-ul folderului sau URL-ul complet al folderului Drive. Folosit de `listFolderFiles` și `removeFolder`. Gol înseamnă rădăcina Drive. |
| `gdFileId` | expression | ID-ul fișierului sau URL-ul complet Drive/Docs. Folosit de `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`. |
| `gdMaxResults` | expression | Pentru `listFolderFiles`: numărul maxim de fișiere returnate (implicit 100). Gol sau `0` încarcă întregul folder prin paginare. Fiecare fișier listat include `size_bytes` atunci când Drive raportează o dimensiune. |
| `gdQuery` | expression | Pentru `listFolderFiles`: interogare Drive suplimentară combinată cu AND cu filtrul de folder, de ex. `mimeType='application/pdf'`. |
| `gdIncludeTrashed` | boolean | Pentru `listFolderFiles`: include fișierele din coșul de gunoi. Implicit false. |
| `gdExportFormat` | string | Pentru `downloadFile` / `syncToHeymDrive`: `pdf`, `docx`, `xlsx`, `pptx`, `csv`, `txt`. Gol înseamnă automat. Ignorat pentru fișierele obișnuite. |
| `gdFilename` | expression | Pentru `syncToHeymDrive`: suprascrie numele fișierului stocat în Heym Drive. |
| `gdBase64Content` | expression | Pentru `updateFile`: șir base64 sau URL `data:` care înlocuiește conținutul fișierului. |
| `gdNewName` | expression | Pentru `updateFile`: numele nou al fișierului (redenumire). |
| `gdNewParentId` | expression | Pentru `updateFile`: ID-ul sau URL-ul folderului destinație (mutare). |
| `gdPermanentDelete` | boolean | Pentru `removeFile` / `removeFolder`: când este false (implicit) elementul este mutat în coșul de gunoi și poate fi recuperat; când este true este distrus. |

## ID-uri de fișiere și foldere

`gdFileId`, `gdFolderId` și `gdNewParentId` acceptă fie **ID-ul simplu**, fie un **URL complet** — Heym extrage ID-ul automat. Toate variantele de mai jos funcționează:

- `https://drive.google.com/file/d/1AbCdEf/view`
- `https://drive.google.com/drive/folders/1FolderXyz`
- `https://docs.google.com/document/d/1DocId/edit`
- `https://drive.google.com/open?id=1AbCdEf`
- `1AbCdEf`

## Google Docs, Sheets și Slides

Documentele native Google **nu au octeți descărcabili**. Acestea sunt înregistrări pe serverele Google, nu fișiere — API-ul Drive returnează `403 Only files with binary content can be downloaded` dacă solicitați conținutul lor brut.

`downloadFile` și `syncToHeymDrive` detectează automat aceste cazuri și **exportă** în schimb, astfel încât nicio operație nu eșuează doar pentru că ținta este un Google Doc:

| Sursă | Export implicit |
|--------|----------------|
| Google Docs | PDF |
| Google Sheets | XLSX |
| Google Slides | PPTX |
| Orice alt tip nativ Google | PDF |

Setați **Export Format** pentru a suprascrie ținta. Această setare este ignorată pentru fișierele obișnuite încărcate, care se descarcă întotdeauna ca atare.

## Operații

| Operație | Necesar | Descriere |
|-----------|----------|-------------|
| `listFolderFiles` | — (folder gol = rădăcină) | Listează fișierele dintr-un folder, cu un filtru de interogare opțional |
| `downloadFile` | `gdFileId` | Descarcă octeții fișierului ca base64, exportând automat documentele native |
| `syncToHeymDrive` | `gdFileId` | Descarcă din Google Drive și stochează rezultatul în Heym Drive |
| `updateFile` | `gdFileId` + cel puțin unul dintre conținut / nume / părinte | Înlocuiește conținutul, redenumește și/sau mută |
| `removeFile` | `gdFileId` | Mută în coșul de gunoi (implicit) sau șterge definitiv un fișier |
| `removeFolder` | `gdFolderId` | Mută în coșul de gunoi (implicit) sau șterge definitiv un folder și conținutul acestuia |

### Ștergerea este recuperabilă în mod implicit

`removeFile` și `removeFolder` mută elementul în **coșul de gunoi Google Drive**, de unde poate fi restaurat. Aceasta este valoarea implicită sigură pentru ceva ce poate rula conform unui program sau în interiorul unui [Loop](./loop-node.md).

Activarea opțiunii **Delete permanently** distruge elementul fără posibilitate de recuperare. Pentru `removeFolder`, aceasta distruge și tot ce se află în folder.

Nodul verifică de asemenea tipul țintei: `removeFile` refuză un folder, iar `removeFolder` refuză un fișier, astfel încât un ID introdus greșit nu poate șterge în mod silențios elementul greșit.

### updateFile lasă câmpurile goale neatinse

`updateFile` este o actualizare, nu o înlocuire. Completați orice combinație de conținut, nume nou și folder nou — tot ce lăsați gol nu este modificat. Cel puțin unul dintre cele trei este obligatoriu.
## Configurarea acreditărilor

Google Drive utilizează un model **OAuth2 "Bring Your Own App"**. Furnizați propriile acreditări OAuth2 din Google Cloud.

> **Această acreditare acordă acces complet la Drive.** Heym solicită scopul `https://www.googleapis.com/auth/drive` deoarece nodul operează asupra fișierelor pe care le dețineți deja. Scopul mai restrâns `drive.file` vede doar fișierele create de aplicația însăși, ceea ce ar face imposibile listarea, actualizarea și ștergerea fișierelor dvs. existente. Consultați [Partajarea acreditărilor](../reference/credentials-sharing.md) înainte de a partaja această acreditare cu o echipă.

**Configurarea backend-ului:** Setați **`FRONTEND_URL`** pe backend-ul Heym la URL-ul public al aplicației. URI-ul de redirecționare OAuth este întotdeauna `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` — este derivat exclusiv din această setare, nu din anteturile cererii.

1. Accesați [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → activați **Google Drive API**.
2. Accesați **Credentials** → **Create Credentials** → **OAuth client ID** → selectați **Web application**.
3. La **Authorized redirect URIs**, adăugați exact `{your FRONTEND_URL}/api/credentials/google-drive/oauth/callback`.
4. Copiați **Client ID** și **Client Secret**.
5. În Heym: **Dashboard → Credentials → New → Google Drive (OAuth2)**, lipiți ambele valori, apoi faceți clic pe **Connect** și aprobați accesul în fereastra popup.

## Ieșire

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

`size_bytes` este `null` pentru foldere și fișierele native Google, care nu raportează o dimensiune.

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

Pentru un fișier obișnuit, `exported` este `false`, iar `export_format` este `null`.

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

`id` este noul ID de fișier **Heym Drive**, distinct de `google_file_id`.

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

`deleted` este `"trashed"` sau `"permanent"`.

## Exemplu: crearea unei copii de rezervă a unui folder Drive în Heym Drive

1. **[Cron](./cron-node.md)** — rulați zilnic.
2. **Google Drive** — `listFolderFiles` pe folderul sursă, cu `gdQuery` setat la `mimeType='application/pdf'` dacă doriți doar fișiere PDF.
3. **[Loop](./loop-node.md)** — iterați prin `$ListReports.files`.
4. **Google Drive** — `syncToHeymDrive` cu `gdFileId` setat la `$BackupLoop.item.id` și `gdFilename` setat la `$BackupLoop.item.name`.
5. **[Slack](./slack-node.md)** — publicați un rezumat al elementelor salvate.

## Note

- Fiecare câmp text acceptă expresii `$`, astfel încât ID-urile și numele de fișiere pot proveni din noduri anterioare.
- Drive-urile partajate sunt acceptate — nodul setează `supportsAllDrives` la fiecare cerere.
- Descărcările sunt verificate din punct de vedere al dimensiunii față de setarea `FILE_MAX_SIZE_MB` a backend-ului.
- Atașați acest nod la intrarea de tip tool a unui nod [Agent](./agent-node.md) și utilizați pictograma bot de pe orice câmp pentru a permite agentului să îl completeze în timpul execuției.

## Consultați și

- [Drive (Heym Drive)](./drive-node.md)
- [Google Sheets](./google-sheets-node.md)
- [Loop](./loop-node.md)
- [Acreditări](../reference/credentials.md)
- [Partajarea acreditărilor](../reference/credentials-sharing.md)
