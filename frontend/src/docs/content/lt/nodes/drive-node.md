# Drive mazgas

**Drive** mazgas valdo failus, kuriuos generuoja įgūdžiai, tiesiogiai iš darbo eigos. Naudokite jį failams gauti, atsisiųsti failus iš išorinių URL, juos ištrinti, dalintis ar nedalintis su savo komandomis, arba programiškai atnaujinti jų prieigos apribojimus (slaptažodis, galiojimo laikas, atsisiuntimo limitas).

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Išvestis | `$nodeLabel.files`, `$nodeLabel.status`, `$nodeLabel.file_id`, `$nodeLabel.download_url` (priklauso nuo operacijos) |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `driveOperation` | string | Operacija: `get`, `getAll`, `downloadUrl`, `save`, `delete`, `setPassword`, `setTtl`, `setMaxDownloads`, `shareWithMyTeams`, `unshareWithMyTeams` |
| `driveFileId` | expression / select | Drive failo UUID, kurį reikia valdyti (visoms operacijoms, išskyrus `getAll`, `downloadUrl` ir `save`) |
| `driveLimit` | number | Maksimalus failų skaičius, kurį reikia grąžinti (`getAll` tik; tuščia reikšmė reiškia, kad limitas nėra nustatytas) |
| `driveSourceUrl` | expression | URL, kurį reikia gauti ir saugoti Drive (`downloadUrl` tik) |
| `driveFilename` | expression | Pilnas failo pavadinimas, įskaitant plėtinį (`save` tik, pvz., `1.mp3`) |
| `driveBase64Content` | expression | Žali base64 eilutė arba duomenų URL, kuriuos reikia dekoduoti ir saugoti (`save` tik) |
| `driveIncludeBinary` | boolean | Įtraukti failo turinį kaip base64 į išvestį (`get` tik) |
| `drivePassword` | expression | Slaptažodis, kurį reikia nustatyti prieigos tokenui (`setPassword` tik) |
| `driveTtlHours` | number | Valandos, kol atsisiuntimo nuoroda galios (`setTtl` tik) |
| `driveMaxDownloads` | number | Maksimalus leidžiamų atsisiuntimų skaičius (`setMaxDownloads` tik) |

## Failo ID gavimas

Kai įgūdis generuoja failus, išvestis apima `_generated_files` masyvą. Kiekvienas įrašas turi `id` lauką:

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

Nuorodą į failo ID galima gauti naudojant: `$agentLabel._generated_files[0].id`

## Operacijos

| Operacija | Reikalingi laukai | Aprašymas |
|-----------|-------------------|-----------|
| `get` | driveFileId | Gauti failo metaduomenis (ir, jei pageidaujama, dvejetainį turinį) iš Drive |
| `getAll` | nėra | Išvardyti nuosavybės ir komandos bendrinamus skaitomus Drive failus su metaduomenimis, tokiais kaip failo pavadinimas, MIME tipas, dydis, šaltinis ir atsisiuntimo URL |
| `downloadUrl` | driveSourceUrl | Gauti failą iš išorinio URL ir saugoti jį Drive |
| `save` | driveFilename, driveBase64Content | Dekoduoti base64 turinį ir saugoti jį kaip Drive failą |
| `delete` | driveFileId | Ištrinti failą ir visus jo prieigos tokenus iš disko ir duomenų bazės |
| `setPassword` | driveFileId, drivePassword | Pakeisti numatytąjį viešą tokeną į slaptažodžiu apsaugotą |
| `setTtl` | driveFileId, driveTtlHours | Pakeisti numatytąjį viešą tokeną į tą, kuris galioja N valandų |
| `setMaxDownloads` | driveFileId, driveMaxDownloads | Pakeisti numatytąjį viešą tokeną į tą, kuris ribojamas N atsisiuntimais |
| `shareWithMyTeams` | driveFileId | Bendrinti failą tik skaitymui su visomis komandomis, kurioms šiuo metu priklauso darbo eigos savininkas |
| `unshareWithMyTeams` | driveFileId | Pašalinti visus komandos bendrinimus iš failo |

> **Pastaba:** `set*` operacijos ištrina numatytąjį (be apribojimų) viešą tokeną ir sukuria naują su nurodytu apribojimu. Atnaujinta `download_url` yra įtraukta į išvestį.
> **Komandos bendrinimas:** `shareWithMyTeams` sukuria aiškius bendrinimus savininko dabartinėms komandoms. Ateities komandos automatiškai nepridedamos, nebent operacija bus vykdoma dar kartą. `unshareWithMyTeams` pašalina visus komandos bendrinimus iš failo.

## Pavyzdys — Atsisiųsti failą iš URL

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

Nuorodą į saugomą failą žemiau: `$fetchReport.id`, `$fetchReport.download_url`

Failo pavadinimas paimamas iš `Content-Disposition` atsakymo antraštės; jei jos nėra, jis nustatomas pagal URL kelią.

## Pavyzdys — Išsaugoti Base64 įvestį į Drive

Naudokite tai, kai teksto įvesties mazgas (arba bet kuris aukščiau esantis mazgas) pateikia base64 failo turinį:

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

Nuorodą į saugomą failą žemiau: `$saveAudio.id`, `$saveAudio.download_url`

`driveBase64Content` priima žalią base64 eilutę arba `data:...;base64,...` duomenų URL. MIME tipas nustatomas pagal failo plėtinį.

## Pavyzdys — Gauti failą ir naudoti dvejetainį turinį Vision LLM

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

Nuorodą į base64 turinį žemiau: `$fetchImage.file_base64`

Vaizdai, grąžinti per `file_base64`, rodomi tiesiogiai derinimo skydelyje, kai vykdote darbo eigą.

## Pavyzdys — Išvardyti Drive failus

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

Nuorodą į pirmą grąžintą failą žemiau: `$listFiles.files[0].filename`, `$listFiles.files[0].size_bytes`
## Pavyzdys — Ištrinti failą po apdorojimo

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

## Pavyzdys — Nustatyti slaptažodį sugeneruotam failui

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

## Pavyzdys — Nustatyti galiojimo laiką (TTL)

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

## Pavyzdys — Apriboti atsisiuntimus

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

## Pavyzdys — Bendrinti su mano komandomis

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

Komandos nariai gali peržiūrėti ir atsisiųsti failą iš Drive bei naudoti skaitymo operacijas workflows. Jie negali ištrinti, vėl bendrinti ar keisti viešųjų nuorodų apribojimų.

## Pavyzdys — Atšaukti bendrinimą su mano komandomis

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

## Failo konvertavimas

Formatų konvertavimas perkeltas į [Converter](./converter-node.md) mazgą. Išsaugokite arba gauti failą su Drive, tada perduokite jo id konvertavimo mazgui:

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

Originalus failas išsaugomas, o konvertuotas failas saugomas kaip naujas Drive failas.

## Išvesties prieiga

**get:**
- `$nodeLabel.id` — failo UUID
- `$nodeLabel.filename` — failo pavadinimas
- `$nodeLabel.mime_type` — MIME tipas (pvz., `image/png`)
- `$nodeLabel.size_bytes` — failo dydis baitais
- `$nodeLabel.download_url` — vieša atsisiuntimo nuoroda
- `$nodeLabel.file_base64` — base64 koduotas failo turinys (tik kai **Include binary content** yra įjungta)

**getAll:**
- `$nodeLabel.files` — failo metaduomenų objektų masyvas
- `$nodeLabel.count` — grąžintų failų skaičius
- `$nodeLabel.files[0].id` — failo UUID
- `$nodeLabel.files[0].filename` — failo pavadinimas
- `$nodeLabel.files[0].mime_type` — MIME tipas
- `$nodeLabel.files[0].size_bytes` — failo dydis baitais
- `$nodeLabel.files[0].download_url` — vieša atsisiuntimo nuoroda, kai egzistuoja viešasis tokenas
- `$nodeLabel.files[0].metadata` — saugomas metaduomenų objektas
- `$nodeLabel.files[0].created_at` — failo sukūrimo laiko žyma

**downloadUrl:**
- `$nodeLabel.id` — naujai saugomo failo UUID
- `$nodeLabel.filename` — failo pavadinimas (iš `Content-Disposition` arba URL kelio)
- `$nodeLabel.mime_type` — MIME tipas, nustatytas iš atsakymo arba failo plėtinio
- `$nodeLabel.size_bytes` — failo dydis baitais
- `$nodeLabel.download_url` — Drive atsisiuntimo nuoroda saugomam failui

**delete:**
- `$nodeLabel.status` — `"deleted"`
- `$nodeLabel.file_id` — ištrinto failo UUID

**setPassword / setTtl / setMaxDownloads:**
- `$nodeLabel.status` — `"updated"`
- `$nodeLabel.file_id` — failo UUID
- `$nodeLabel.download_url` — nauja prieigos tokeno nuoroda su taikomu apribojimu

**shareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — failo UUID
- `$nodeLabel.shared_team_count` — bendrinimų su komandomis skaičius po operacijos

**unshareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — failo UUID
- `$nodeLabel.shared_team_count` — `0` po operacijos

## Nuosavybė

Operacijos, skirtos tik savininkui, reikalauja, kad failas priklausytų workflows savininkui. Skaitymo operacijos (`get`, `getAll`) taip pat gali pasiekti failus, bendrinamus su workflows savininku per komandą.

## Susiję

- [Failo generavimas](../reference/file-generation.md) - Kaip įgūdžiai generuoja failus ir `_generated_files` išvestis
- [Drive skirtukas](../reference/drive.md) - Vizualus failų valdymas valdymo skydelyje
- [Agent Node](./agent-node.md) - Vykdo įgūdžius, kurie generuoja failus
- [Converter Node](./converter-node.md) - Konvertuoja saugomą failą į kitą formatą arba OCR jį į tekstą
- [Expression DSL](../reference/expression-dsl.md) - Išraiškų sintaksė dinaminėms reikšmėms
