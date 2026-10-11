# Failo Įkėlimo Trigger

**Failo Įkėlimo Trigger** mazgas yra nulinio įvesties įėjimo taškas workflows, kuriems reikia **didelio failo** (garso, vaizdo, archyvų), kurio negalima įterpti kaip base64 į JSON užklausą. Workflow iškvietimas grąžina iš anksto užpildytą, vienkartinį `curl` įkėlimo nuorodą; failo įkėlimas į šią nuorodą pradeda vykdymą su failu.

Naudokite jį, kai skambintojas — įskaitant AI agentą, tokį kaip Claude arba ChatGPT, veikiantį smėlio dėžėje — turi perduoti 20 MB garso įrašą arba 75 MB vaizdo įrašą Heym workflow.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 0 |
| Išvestys | 1 |
| Išvestis | `$nodeLabel.file.{id,name,mime,size,download_url}`, `$nodeLabel.uploaded_at` |

## Kaip tai veikia

Mazgas veikia dviem etapais:

1. **Sukūrimas.** Kai workflow iškviečiamas per HTTP (`POST /api/workflows/{id}/execute`), kaip MCP įrankis, arba per drobės **Vykdyti Workflow** mygtuką, vykdymas **ne** vykdo kūno. Vietoj to, jis sukuria vienkartinę įkėlimo vietą ir grąžina:

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

2. **Įkėlimas + vykdymas.** Skambintojas vykdo `curl` su savo failu. Įkėlimo endpointas patikrina vietą, saugo failą, vykdo workflow **sinchroniškai** ir grąžina workflow išvestį įkėlimo atsakyme. Nuoroda yra **vienkartinė** — antras įkėlimas grąžina `409`.

Drobėje **Vykdyti Workflow** rodo sukurtą `curl` derinimo skydelyje su kopijavimo mygtuku.

## Parametrai

| Parametras | Tipas | Numatytoji reikšmė | Aprašymas |
|------------|-------|--------------------|-----------|
| `ttlMinutes` | skaičius | `60` | Kiek laiko įkėlimo nuoroda išlieka galiojanti (1–10080 minučių / iki 7 dienų). |
| `maxSizeMb` | skaičius | `100` | Maksimalus priimtinas failo dydis. Kietas lubas yra **100 MB**. |
| `allowedTypes` | eilutė | (tuščia) | Pasirinkinis MIME/pleišto leidimų sąrašas, pvz., `audio/*, .wav`. Tuščia leidžia bet kokį tipą. |

## Išvesties laukai

| Išraiška | Aprašymas |
|-----------|-----------|
| `$nodeLabel.file.id` | Saugojimo failo UUID (Drive failas). |
| `$nodeLabel.file.name` | Originalus failo pavadinimas. |
| `$nodeLabel.file.mime` | Aptikta turinio tipas. |
| `$nodeLabel.file.size` | Dydis baitais. |
| `$nodeLabel.file.download_url` | Autentifikuota atsisiuntimo nuoroda žemyn sraute. |
| `$nodeLabel.uploaded_at` | ISO laiko žymė įkėlimui. |

## Pavyzdys

Transkripcijos workflow:

```
Failo Įkėlimo Trigger ("audio")  →  Transkribuoti ($audio.file)  →  LLM santrauka  →  Išvestis
```

1. Agentas iškviečia workflow MCP įrankį ir gauna `curl`.
2. Agentas vykdo `curl` su įrašu iš savo smėlio dėžės.
3. Įkėlimas vykdo workflow, o `curl` atsakymas apima transkripcijos santrauką.

## Saugumas

- Įkėlimo nuoroda įtraukia didelio entropijos token'ą — token'as **yra** galimybė, todėl smėlio dėžėje esantis agentas nereikalauja Heym kredencialų įkėlimui. Tik token'o hash yra saugomas serverio pusėje.
- Sukūrimas reikalauja normalaus workflow autentifikavimo, todėl tik įgalioti skambintojai gali kurti įkėlimo nuorodas.
- Kiekvienas sukūrimas ir kiekvienas įkėlimo bandymas (priimtas arba atmestas — pasibaigęs, pakartotas, per didelis, neleistinas tipas, nežinomas token'as) yra užrašomas į pridedamą auditų takelį.
- Įkėlimai yra priverstinai vienkartiniai, TTL riboti ir dydžio apriboti; per dideli įkėlimai yra atmetami.

## Pastabos

- Bendrieji HTTP, MCP ir drobės iškvietimo kanalai lieka tik JSON; šis mazgas yra palaikomas būdas priimti multipart failų įkėlimus.
- Įkeltas failas saugomas kaip normalus Drive failas, todėl bet kuris žemyn sraute esantis mazgas, kuris priima failo nuorodą (transkribuoti, siųsti el. pašto priedą ir kt.), gali naudoti `$nodeLabel.file`.
