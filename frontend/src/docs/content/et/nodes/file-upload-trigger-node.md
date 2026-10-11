# Faili üleslaadimise trigger

**Faili üleslaadimise trigger** node on null-sisendiga sisenemispunkt workflow'dele, mis vajavad **suurt faili** (audio, video, arhiivid), mida ei saa JSON-päringu sees base64-kujul manustada. Workflow kutsumine tagastab eeltäidetud, ühekordselt kasutatava `curl`-i üleslaadimise lingi; faili üleslaadimine sellele lingile käivitab käivituse koos manustatud failiga.

Kasutage seda, kui kutsuja — sealhulgas AI-agent nagu Claude või ChatGPT, mis töötab sandbox'is — peab andma 20 MB helisalvestise või 75 MB video Heymi workflow'le.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 0 |
| Väljundid | 1 |
| Väljund | `$nodeLabel.file.{id,name,mime,size,download_url}`, `$nodeLabel.uploaded_at` |

## Kuidas see töötab

Node töötab kahes faasis:

1. **Mint.** Kui workflow'd kutsutakse üle HTTP (`POST /api/workflows/{id}/execute`), MCP-tööriistana või lõuendi **Run Workflow** nupu kaudu, käivitus **ei** täida keha. Selle asemel vermitakse ühekordselt kasutatav üleslaadimise pesa ja tagastatakse:

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

2. **Üleslaadimine + käivitus.** Kutsuja käivitab `curl`-i oma failiga. Üleslaadimise endpoint valideerib pesa, salvestab faili, käivitab workflow **sünkroonselt** ja tagastab workflow väljundi üleslaadimise vastuses. Link on **ühekordselt kasutatav** — teine üleslaadimine tagastab `409`.

Lõuendil näitab **Run Workflow** vermitud `curl`-i silumispaneelis koos kopeerimisnupuga.

## Parameetrid

| Parameeter | Tüüp | Vaikeväärtus | Kirjeldus |
|-----------|------|---------|-------------|
| `ttlMinutes` | number | `60` | Kui kaua üleslaadimise link kehtib (1–10080 minutit / kuni 7 päeva). |
| `maxSizeMb` | number | `100` | Maksimaalne lubatud faili suurus. Ülempiir on **100 MB**. |
| `allowedTypes` | string | (tühi) | Valikuline komadega eraldatud MIME/laiendite lubatud loend, nt `audio/*, .wav`. Tühi lubab mis tahes tüüpi. |

## Väljundi väljad

| Avaldis | Kirjeldus |
|------------|-------------|
| `$nodeLabel.file.id` | Salvestatud faili UUID (Drive'i fail). |
| `$nodeLabel.file.name` | Algne failinimi. |
| `$nodeLabel.file.mime` | Tuvastatud sisutüüp. |
| `$nodeLabel.file.size` | Suurus baitides. |
| `$nodeLabel.file.download_url` | Autenditud allalaadimise URL allavoolu node'dele. |
| `$nodeLabel.uploaded_at` | Üleslaadimise ISO ajatempel. |

## Näide

Transkribeerimise workflow:

```
File Upload Trigger ("audio")  →  Transcribe ($audio.file)  →  LLM summary  →  Output
```

1. Agent kutsub workflow MCP-tööriista ja saab `curl`-i.
2. Agent käivitab `curl`-i oma sandbox'ist pärit salvestisega.
3. Üleslaadimine käivitab workflow ja `curl`-i vastus sisaldab transkriptsiooni kokkuvõtet.

## Turvalisus

- Üleslaadimise URL sisaldab kõrge entroopiaga tokenit — token **on** võimekus, seega sandbox'itud agent ei vaja üleslaadimiseks Heymi mandaate. Serveripoolselt salvestatakse ainult tokeni räsi.
- Vermimine nõuab tavalist workflow autentimist, seega ainult volitatud kutsujad saavad luua üleslaadimise linke.
- Iga vermimine ja iga üleslaadimise katse (vastu võetud või tagasi lükatud — aegunud, kordus, üle suuruse, keelatud tüüp, tundmatu token) kirjutatakse ainult-lisamise auditijälge.
- Üleslaadimised on jõustatud ühekordselt kasutatavaks, TTL-iga piiratud ja suurusega piiratud; üle suuruse üleslaadimised lükatakse tagasi.

## Märkused

- Üldised HTTP, MCP ja lõuendi kutsumise kanalid jäävad ainult JSON-põhiseks; see node on toetatud viis multipart-faili üleslaadimiste vastuvõtmiseks.
- Üleslaaditud fail salvestatakse tavalise Drive'i failina, seega iga allavoolu node, mis võtab vastu failiviite (transkribeerimine, e-kirja manuse saatmine jne), saab kasutada `$nodeLabel.file`.
