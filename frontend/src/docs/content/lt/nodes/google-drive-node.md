# Google Drive

**Google Drive** mazgas leidžia sąrašą, atsisiųsti, atnaujinti ir ištrinti failus bei aplankus Google Drive per OAuth2. Taip pat galima kopijuoti Drive failą tiesiai į [Heym Drive](./drive-node.md) vienu veiksmu.

> **Tai nėra [Drive](./drive-node.md) mazgas.** Tas mazgas yra *Heym Drive* — Heym vidinė failų saugykla. Šis mazgas bendrauja su Google Drive. `syncToHeymDrive` operacija yra tiltas tarp abiejų.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Kredencialas | Google Drive (OAuth2) |
| Išvestis | `$nodeLabel.files`, `$nodeLabel.content_base64`, `$nodeLabel.download_url`, `$nodeLabel.status` |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `credentialId` | UUID | Google Drive kredencialas iš [Kredencialų](../tabs/credentials-tab.md) |
| `gdOperation` | string | Operacija: `listFolderFiles`, `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`, `removeFolder` |
| `gdFolderId` | expression | Aplanko ID arba pilnas Drive aplanko URL. Naudojamas `listFolderFiles` ir `removeFolder`. Tuščias reiškia Drive šaknį. |
| `gdFileId` | expression | Failo ID arba pilnas Drive/Docs URL. Naudojamas `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`. |
| `gdMaxResults` | expression | `listFolderFiles`: maksimalus failų skaičius, kurį reikia grąžinti (numatytasis 100). Tuščias arba `0` įkelia visą aplanką per puslapiavimą. Kiekvienas išvardytas failas apima `size_bytes`, kai Drive praneša apie dydį. |
| `gdQuery` | expression | `listFolderFiles`: papildoma Drive užklausa, AND su aplanko filtru, pvz., `mimeType='application/pdf'`. |
| `gdIncludeTrashed` | boolean | `listFolderFiles`: įtraukti ištrintus failus. Numatyta false. |
| `gdExportFormat` | string | `downloadFile` / `syncToHeymDrive`: `pdf`, `docx`, `xlsx`, `pptx`, `csv`, `txt`. Tuščias reiškia automatinį. Ignoruojama įprastiems failams. |
| `gdFilename` | expression | `syncToHeymDrive`: perrašyti failo pavadinimą, saugomą Heym Drive. |
| `gdBase64Content` | expression | `updateFile`: base64 eilutė arba `data:` URL, kuris pakeičia failo turinį. |
| `gdNewName` | expression | `updateFile`: naujas failo pavadinimas (pervadinimas). |
| `gdNewParentId` | expression | `updateFile`: paskirties aplanko ID arba URL (perkelti). |
| `gdPermanentDelete` | boolean | `removeFile` / `removeFolder`: kai false (numatyta), elementas yra ištrinamas ir atkuriamas; kai true, jis sunaikinamas. |

## Failų ir aplankų ID

`gdFileId`, `gdFolderId` ir `gdNewParentId` priima tiek **nuogą ID**, tiek **pilną URL** — Heym automatiškai ištraukia ID. Visi šie veikia:

- `https://drive.google.com/file/d/1AbCdEf/view`
- `https://drive.google.com/drive/folders/1FolderXyz`
- `https://docs.google.com/document/d/1DocId/edit`
- `https://drive.google.com/open?id=1AbCdEf`
- `1AbCdEf`

## Google Docs, Sheets ir Slides

Google natūralūs dokumentai **neturi atsisiunčiamų baitų**. Tai yra įrašai Google serveriuose, o ne failai — Drive API grąžina `403 Only files with binary content can be downloaded`, jei prašote jų žaliavinio turinio.

`downloadFile` ir `syncToHeymDrive` automatiškai aptinka šiuos dokumentus ir **eksportuoja** vietoj to, todėl jokia operacija nepavyksta vien dėl to, kad tikslas yra Google Doc:

| Šaltinis | Numatytoji eksportacija |
|----------|------------------------|
| Google Docs | PDF |
| Google Sheets | XLSX |
| Google Slides | PPTX |
| Bet koks kitas Google natūralus tipas | PDF |

Nustatykite **Eksportavimo formatą**, kad perrašytumėte tikslą. Nustatymas ignoruojamas įprastiems įkeltiems failams, kurie visada atsisiunčiami tokiais, kokie yra.

## Operacijos

| Operacija | Reikalinga | Aprašymas |
|-----------|------------|-----------|
| `listFolderFiles` | — (tuščias aplankas = šaknis) | Išvardyti failus aplanke, su neprivalomu užklausos filtru |
| `downloadFile` | `gdFileId` | Atsisiųsti failo baitus kaip base64, automatiškai eksportuojant natūralius dokumentus |
| `syncToHeymDrive` | `gdFileId` | Atsisiųsti iš Google Drive ir saugoti rezultatą Heym Drive |
| `updateFile` | `gdFileId` + bent vienas iš turinio / pavadinimo / tėvo | Pakeisti turinį, pervadinti ir/arba perkelti |
| `removeFile` | `gdFileId` | Išmesti (numatyta) arba visam laikui ištrinti failą |
| `removeFolder` | `gdFolderId` | Išmesti (numatyta) arba visam laikui ištrinti aplanką ir jo turinį |

### Ištrynimas pagal numatytuosius nustatymus yra atkuriamas

`removeFile` ir `removeFolder` perkelia elementą į **Google Drive šiukšlių dėžę**, kur jis gali būti atkurtas. Tai yra saugus numatytasis nustatymas, kai kas nors gali būti vykdoma pagal tvarkaraštį arba viduje [Loop](./loop-node.md).

Įjungus **Ištrinti visam laikui**, elementas sunaikinamas be atkūrimo. `removeFolder` atveju tai taip pat sunaikina viską aplanke.

Mazgas taip pat tikrina tikslinį tipą: `removeFile` atsisako aplanko, o `removeFolder` atsisako failo, todėl neteisingai įvestas ID negali tyliai ištrinti neteisingo dalyko.

### updateFile palieka tuščius laukus nepaliestus

`updateFile` yra atnaujinimas, o ne pakeitimas. Užpildykite bet kokią turinio, naujo pavadinimo ir naujo aplanko kombinaciją — kas lieka tuščia, tas nėra liečiamas. Bent vienas iš trijų yra reikalaujamas.
## Kredencialų Nustatymas

Google Drive naudoja **OAuth2 "Bring Your Own App"** modelį. Jūs pateikiate savo Google Cloud OAuth2 kredencialus.

> **Šios kredencialai suteikia pilną prieigą prie Drive.** Heym prašo `https://www.googleapis.com/auth/drive` apimties, nes mazgas veikia su failais, kuriuos jau turite. Siauresnė `drive.file` apimtis mato tik failus, kuriuos sukūrė pati programa, todėl būtų neįmanoma išvardyti, atnaujinti ir ištrinti jūsų esamus failus. Prieš dalindamiesi šiomis kredencialais su komanda, peržiūrėkite [Kredencialų Dalijimą](../reference/credentials-sharing.md).

**Backend konfigūracija:** Nustatykite **`FRONTEND_URL`** Heym backend'e į viešą programos URL. OAuth nukreipimo URI visada yra `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` — jis gaunamas tik iš šios nustatymo, o ne iš užklausų antraščių.

1. Eikite į [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → įgalinkite **Google Drive API**.
2. Eikite į **Credentials** → **Create Credentials** → **OAuth client ID** → pasirinkite **Web application**.
3. Po **Authorized redirect URIs** pridėkite tiksliai `{your FRONTEND_URL}/api/credentials/google-drive/oauth/callback`.
4. Nukopijuokite **Client ID** ir **Client Secret**.
5. Heym: **Dashboard → Credentials → New → Google Drive (OAuth2)**, įklijuokite abi reikšmes, tada spustelėkite **Connect** ir patvirtinkite prieigą iššokančiame lange.

## Išvestis

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

`size_bytes` yra `null` aplankams ir Google-native failams, kurie nepraneša apie dydį.

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

Įprastam failui `exported` yra `false`, o `export_format` yra `null`.

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

`id` yra naujas **Heym Drive** failo ID, skirtingas nuo `google_file_id`.

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

`deleted` yra `"trashed"` arba `"permanent"`.

## Pavyzdys: atsarginė Drive aplanko kopija į Heym Drive

1. **[Cron](./cron-node.md)** — vykdyti kasdien.
2. **Google Drive** — `listFolderFiles` šaltinio aplanke, su `gdQuery` nustatytu į `mimeType='application/pdf'`, jei norite tik PDF failų.
3. **[Loop](./loop-node.md)** — iteruoti `$ListReports.files`.
4. **Google Drive** — `syncToHeymDrive` su `gdFileId` nustatytu į `$BackupLoop.item.id` ir `gdFilename` nustatytu į `$BackupLoop.item.name`.
5. **[Slack](./slack-node.md)** — paskelbti santrauką apie tai, kas buvo atsarginė kopija.

## Pastabos

- Kiekvienas teksto laukas priima `$` išraiškas, todėl ID ir failų pavadinimai gali būti gauti iš ankstesnių mazgų.
- Bendrinami diskai yra palaikomi — mazgas nustato `supportsAllDrives` kiekviename užklausoje.
- Atsisiuntimai yra tikrinami pagal backend'o `FILE_MAX_SIZE_MB` nustatymą.
- Prijunkite šį mazgą prie [Agent](./agent-node.md) mazgo įrankio įvesties ir naudokite bot'o ikoną bet kuriame lauke, kad agentas galėtų užpildyti jį vykdymo metu.

## Taip pat žiūrėkite

- [Drive (Heym Drive)](./drive-node.md)
- [Google Sheets](./google-sheets-node.md)
- [Loop](./loop-node.md)
- [Kredencialai](../reference/credentials.md)
- [Kredencialų Dalijimas](../reference/credentials-sharing.md)
