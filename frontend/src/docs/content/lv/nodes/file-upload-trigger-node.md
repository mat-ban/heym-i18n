# Faila augšupielādes Trigger

**Faila augšupielādes Trigger** mezgls ir ieejas punkts bez ievades datiem tādiem workflow, kuros nepieciešams **liels fails** (audio, video, arhīvi), ko nevar iegult kā base64 JSON pieprasījumā. Izsaucot workflow, tiek atgriezta iepriekš aizpildīta, vienreiz lietojama `curl` augšupielādes saite; augšupielādējot failu šajā saitē, tiek uzsākta izpilde ar pievienoto failu.

Izmantojiet to, ja izsaucējam — tostarp AI aģentam, piemēram, Claude vai ChatGPT, kas darbojas sandbox vidē — ir jānodod 20 MB balss ieraksts vai 75 MB video Heym workflow.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 0 |
| Izvades | 1 |
| Izvade | `$nodeLabel.file.{id,name,mime,size,download_url}`, `$nodeLabel.uploaded_at` |

## Kā tas darbojas

Mezgls darbojas divās fāzēs:

1. **Izveide.** Kad workflow tiek izsaukts pa HTTP (`POST /api/workflows/{id}/execute`), kā MCP rīks vai izmantojot kanvas pogu **Run Workflow**, izpilde **neizpilda** saturu. Tā vietā tiek izveidota vienreiz lietojama augšupielādes vieta un atgriezts:

   ```json
   {
     "file_upload_required": true,
     "curl": "curl -F 'file=@/path/to/your/file' 'https://your-host/api/file-intake/u/<token>'",
     "upload_url": "https://your-host/api/file-intake/u/<token>",
     "expires_at": "2026-06-25T13:00:00+00:00",
     "max_size_mb": 100,
     "allowed_types": ["audio/*"]
   }
   ```

2. **Augšupielāde + izpilde.** Izsaucējs izpilda `curl` ar savu failu. Augšupielādes endpoint validē vietu, saglabā failu, izpilda workflow **sinhroni** un atgriež workflow izvadi augšupielādes atbildē. Saite ir **vienreiz lietojama** — otrs augšupielādes mēģinājums atgriež `409`.

Kanvā **Run Workflow** parāda izveidoto `curl` atkļūdošanas panelī ar kopēšanas pogu.

## Palaišana no Heym

Divās vietās šādu Workflow var palaist tieši failam, izmantojot to pašu izveides un augšupielādes procesu:

- [Quick Drawer](../reference/quick-drawer.md) parāda faila nomešanas zonu. Šie izpildes gadījumi vēsturē tiek atzīmēti ar `Quick Drawer`.
- [Izpildes logrīks](../tabs/dashboard-tab.md#run-widgets) informācijas panelī palaiž Workflow katram nomestajam failam. Šie izpildes gadījumi tiek atzīmēti ar `dashboard`.

## Parametri

| Parametrs | Tips | Noklusējums | Apraksts |
|-----------|------|---------|-------------|
| `ttlMinutes` | number | `60` | Cik ilgi augšupielādes saite paliek derīga (1–10080 minūtes / līdz 7 dienām). |
| `maxSizeMb` | number | `100` | Maksimālais pieņemtais faila izmērs. Stingrais ierobežojums ir **100 MB**. |
| `allowedTypes` | string | (tukšs) | Neobligāts ar komatu atdalīts MIME/paplašinājumu atļauto saraksts, piem., `audio/*, .wav`. Tukšs pieļauj jebkuru tipu. |

## Izvades lauki

| Izteiksme | Apraksts |
|------------|-------------|
| `$nodeLabel.file.id` | Saglabātā faila UUID (Drive fails). |
| `$nodeLabel.file.name` | Sākotnējais faila nosaukums. |
| `$nodeLabel.file.mime` | Noteiktais satura tips. |
| `$nodeLabel.file.size` | Izmērs baitos. |
| `$nodeLabel.file.download_url` | Autentificēta lejupielādes saite lejupstraumes mezgliem. |
| `$nodeLabel.uploaded_at` | Augšupielādes ISO laika zīmogs. |

## Piemērs

Transkripcijas workflow:

```
File Upload Trigger ("audio")  →  Transcribe ($audio.file)  →  LLM summary  →  Output
```

1. Aģents izsauc workflow MCP rīku un saņem `curl`.
2. Aģents izpilda `curl` ar ierakstu no sava sandbox.
3. Augšupielāde izpilda workflow, un `curl` atbildē ir transkripcijas kopsavilkums.

## Drošība

- Augšupielādes URL ietver augstas entropijas token — token **ir** piekļuves tiesības, tāpēc sandbox aģentam nav nepieciešami Heym akreditācijas dati, lai augšupielādētu. Servera pusē tiek glabāts tikai token hash.
- Izveidei nepieciešama parasta workflow autentifikācija, tāpēc tikai autorizēti izsaucēji var izveidot augšupielādes saites.
- Katrs izveides un katra augšupielādes mēģinājums (pieņemts vai noraidīts — beidzies, atkārtots, pārāk liels, neatļauts tips, nezināms token) tiek ierakstīts tikai papildināmā audita žurnālā.
- Augšupielādēm tiek nodrošināta vienreizēja lietošana, TTL ierobežojums un izmēra ierobežojums; pārāk lielas augšupielādes tiek noraidītas.

## Piezīmes

- Vispārīgie HTTP, MCP un kanvas izsaukšanas kanāli joprojām atbalsta tikai JSON; šis mezgls ir atbalstītais veids, kā pieņemt multipart failu augšupielādes.
- Augšupielādētais fails tiek saglabāts kā parasts Drive fails, tāpēc jebkurš lejupstraumes mezgls, kas pieņem faila atsauci (transkripcija, e-pasta pielikuma sūtīšana utt.), var izmantot `$nodeLabel.file`.
