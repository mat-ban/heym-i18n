# Nodul Drive

Nodul **Drive** gestionează fișierele generate de skill-uri direct din interiorul unui workflow. Utilizați-l pentru a recupera fișiere, a descărca fișiere de la URL-uri externe, a le șterge, a le partaja sau a anula partajarea cu echipele dvs., ori pentru a le actualiza programatic restricțiile de acces (parolă, expirare, limită de descărcări).

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.files`, `$nodeLabel.status`, `$nodeLabel.file_id`, `$nodeLabel.download_url` (variază în funcție de operație) |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `driveOperation` | string | Operație: `get`, `getAll`, `downloadUrl`, `save`, `delete`, `setPassword`, `setTtl`, `setMaxDownloads`, `shareWithMyTeams`, `unshareWithMyTeams` |
| `driveFileId` | expression / select | UUID-ul fișierului Drive de gestionat (toate operațiile cu excepția `getAll`, `downloadUrl` și `save`) |
| `driveLimit` | number | Numărul maxim de fișiere returnate (doar `getAll`; gol înseamnă fără limită) |
| `driveSourceUrl` | expression | URL-ul de preluat și stocat în Drive (doar `downloadUrl`) |
| `driveFilename` | expression | Numele complet al fișierului, inclusiv extensia (doar `save`, de ex. `1.mp3`) |
| `driveBase64Content` | expression | Șir base64 brut sau data URL de decodat și stocat (doar `save`) |
| `driveIncludeBinary` | boolean | Include conținutul fișierului ca base64 în ieșire (doar `get`) |
| `drivePassword` | expression | Parola de setat pe token-ul de acces (doar `setPassword`) |
| `driveTtlHours` | number | Orele până la expirarea linkului de descărcare (doar `setTtl`) |
| `driveMaxDownloads` | number | Numărul maxim de descărcări permise (doar `setMaxDownloads`) |

## Obținerea ID-ului fișierului

Când un skill generează fișiere, ieșirea include un tablou `_generated_files`. Fiecare intrare include un câmp `id`:

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

Referiți ID-ul fișierului cu: `$agentLabel._generated_files[0].id`

## Operații

| Operație | Câmpuri obligatorii | Descriere |
|-----------|----------------|-------------|
| `get` | driveFileId | Recuperează metadatele fișierului (și opțional conținutul binar) din Drive |
| `getAll` | niciunul | Listează fișierele Drive deținute și partajate cu echipa, care pot fi citite, împreună cu metadate precum numele fișierului, tipul MIME, dimensiunea, sursa și URL-ul de descărcare |
| `downloadUrl` | driveSourceUrl | Preia un fișier de la un URL extern și îl stochează în Drive |
| `save` | driveFilename, driveBase64Content | Decodează conținutul base64 și îl stochează ca fișier Drive |
| `delete` | driveFileId | Șterge fișierul și toate token-urile sale de acces de pe disc și din baza de date |
| `setPassword` | driveFileId, drivePassword | Înlocuiește token-ul public implicit cu unul protejat prin parolă |
| `setTtl` | driveFileId, driveTtlHours | Înlocuiește token-ul public implicit cu unul care expiră după N ore |
| `setMaxDownloads` | driveFileId, driveMaxDownloads | Înlocuiește token-ul public implicit cu unul limitat la N descărcări |
| `shareWithMyTeams` | driveFileId | Partajează fișierul cu acces doar pentru citire cu toate echipele din care face parte în prezent proprietarul workflow-ului |
| `unshareWithMyTeams` | driveFileId | Elimină toate partajările către echipe ale fișierului |

> **Notă:** Operațiile `set*` șterg token-ul public implicit (fără restricții) și creează unul nou cu restricția specificată. `download_url` actualizat este inclus în ieșire.
> **Partajarea cu echipa:** `shareWithMyTeams` creează partajări explicite pentru echipele actuale ale proprietarului. Echipele viitoare nu sunt adăugate automat decât dacă operația rulează din nou. `unshareWithMyTeams` elimină toate partajările către echipe ale fișierului.

## Exemplu — Descărcarea unui fișier de la un URL

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

Referiți fișierul stocat în aval: `$fetchReport.id`, `$fetchReport.download_url`

Numele fișierului este preluat din antetul de răspuns `Content-Disposition`; dacă acesta lipsește, este derivat din calea URL-ului.

## Exemplu — Salvarea unei intrări Base64 în Drive

Utilizați acest lucru atunci când un nod de intrare text (sau orice nod din amonte) furnizează conținut de fișier base64:

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

Referiți fișierul stocat în aval: `$saveAudio.id`, `$saveAudio.download_url`

`driveBase64Content` acceptă un șir base64 brut sau un data URL `data:...;base64,...`. Tipul MIME este dedus din extensia numelui fișierului.

## Exemplu — Obținerea unui fișier și utilizarea conținutului binar într-un Vision LLM

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

Referiți conținutul base64 în aval: `$fetchImage.file_base64`

Imaginile returnate prin `file_base64` sunt afișate inline în panoul de depanare atunci când rulați workflow-ul.

## Exemplu — Listarea fișierelor Drive

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

Referiți primul fișier returnat în aval: `$listFiles.files[0].filename`, `$listFiles.files[0].size_bytes`
## Exemplu — Ștergerea fișierului după procesare

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

## Exemplu — Setarea unei parole pe fișierul generat

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

## Exemplu — Setarea expirării (TTL)

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

## Exemplu — Limitarea descărcărilor

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

## Exemplu — Partajarea cu echipele mele

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

Membrii echipei pot vizualiza și descărca fișierul din Drive și pot utiliza operațiuni de citire în workflow-uri. Aceștia nu pot șterge, repartaja sau modifica restricțiile linkului public.

## Exemplu — Anularea partajării cu echipele mele

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

## Conversia unui fișier

Conversia de format a fost mutată în nodul [Converter](./converter-node.md). Stocați sau preluați fișierul cu Drive, apoi transmiteți id-ul acestuia către un nod de conversie:

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

Fișierul original este păstrat, iar fișierul convertit este stocat ca un fișier Drive nou.

## Accesul la ieșiri

**get:**
- `$nodeLabel.id` — UUID-ul fișierului
- `$nodeLabel.filename` — numele fișierului
- `$nodeLabel.mime_type` — tipul MIME (de ex. `image/png`)
- `$nodeLabel.size_bytes` — dimensiunea fișierului în bytes
- `$nodeLabel.download_url` — URL public de descărcare
- `$nodeLabel.file_base64` — conținutul fișierului codificat base64 (doar când opțiunea **Include binary content** este activată)

**getAll:**
- `$nodeLabel.files` — Array de obiecte cu metadatele fișierelor
- `$nodeLabel.count` — Numărul de fișiere returnate
- `$nodeLabel.files[0].id` — UUID-ul fișierului
- `$nodeLabel.files[0].filename` — Numele fișierului
- `$nodeLabel.files[0].mime_type` — Tipul MIME
- `$nodeLabel.files[0].size_bytes` — Dimensiunea fișierului în bytes
- `$nodeLabel.files[0].download_url` — URL public de descărcare când există un token public
- `$nodeLabel.files[0].metadata` — Obiectul de metadate stocat
- `$nodeLabel.files[0].created_at` — Momentul creării fișierului

**downloadUrl:**
- `$nodeLabel.id` — UUID-ul fișierului nou stocat
- `$nodeLabel.filename` — numele fișierului (din `Content-Disposition` sau calea URL)
- `$nodeLabel.mime_type` — tipul MIME detectat din răspuns sau din extensia fișierului
- `$nodeLabel.size_bytes` — dimensiunea fișierului în bytes
- `$nodeLabel.download_url` — URL-ul de descărcare Drive pentru fișierul stocat

**delete:**
- `$nodeLabel.status` — `"deleted"`
- `$nodeLabel.file_id` — UUID-ul fișierului șters

**setPassword / setTtl / setMaxDownloads:**
- `$nodeLabel.status` — `"updated"`
- `$nodeLabel.file_id` — UUID-ul fișierului
- `$nodeLabel.download_url` — URL-ul noului token de acces cu restricția aplicată

**shareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID-ul fișierului
- `$nodeLabel.shared_team_count` — Numărul de partajări către echipe după operațiune

**unshareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID-ul fișierului
- `$nodeLabel.shared_team_count` — `0` după operațiune

## Proprietatea

Operațiunile exclusiv pentru proprietar necesită ca fișierul să aparțină proprietarului workflow-ului. Operațiunile de citire (`get`, `getAll`) pot accesa și fișierele partajate cu proprietarul workflow-ului prin intermediul unei echipe.

## Resurse conexe

- [File Generation](../reference/file-generation.md) - Cum generează skill-urile fișiere și ieșirea `_generated_files`
- [Drive Tab](../reference/drive.md) - Gestionarea vizuală a fișierelor în dashboard
- [Agent Node](./agent-node.md) - Rulează skill-uri care generează fișiere
- [Converter Node](./converter-node.md) - Convertiți un fișier stocat într-un alt format sau aplicați OCR pentru a-l transforma în text
- [Expression DSL](../reference/expression-dsl.md) - Sintaxa expresiilor pentru valori dinamice
