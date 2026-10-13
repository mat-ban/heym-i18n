# Trigger za nalaganje datotek

**Trigger za nalaganje datotek** je vstopna točka brez vhodnih parametrov za workflows, ki potrebujejo **veliko datoteko** (avdio, video, arhivi), ki je ne moremo vstaviti kot base64 v JSON zahtevo. Klicanje workflow-a vrne predizpolnjen, enkratni `curl` povezavo za nalaganje; nalaganje datoteke na to povezavo začne izvajanje s pripeto datoteko.

Uporabite ga, ko mora klicatelj — vključno z AI agentom, kot sta Claude ali ChatGPT, ki deluje v peskovniku — predati 20 MB avdio posnetek ali 75 MB video datoteko Heym workflow-u.

## Pregled

| Lastnost | Vrednost |
|----------|----------|
| Vhodi | 0 |
| Izhodi | 1 |
| Izhod | `$nodeLabel.file.{id,name,mime,size,download_url}`, `$nodeLabel.uploaded_at` |

## Kako deluje

Ta vozlišče deluje v dveh fazah:

1. **Mintanje.** Ko se workflow pokliče preko HTTP (`POST /api/workflows/{id}/execute`), kot orodje MCP ali preko gumba **Zaženi workflow** na platnu, se izvajanje **ne** izvede. Namesto tega se ustvari enkratni prostor za nalaganje in vrne:

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

2. **Nalaganje + izvajanje.** Klicatelj izvede `curl` s svojo datoteko. Izhodna točka za nalaganje preveri prostor, shrani datoteko, izvede workflow **sinhrono** in vrne izhod workflow-a v odgovoru na nalaganje. Povezava je **enkratna** — drugo nalaganje vrne `409`.

Na platnu, **Zaženi workflow** prikazuje ustvarjen `curl` v debug panelu z gumbom za kopiranje.

## Zagon iz Heyma

Dve mesti zaženeta tak Workflow neposredno na datoteki prek istega postopka ustvarjanja povezave in nalaganja:

- [Quick Drawer](../reference/quick-drawer.md) prikaže območje za spuščanje datoteke. Ti zagoni so v zgodovini označeni z oznako `Quick Drawer`.
- [Gradnik za zagon](../tabs/dashboard-tab.md#run-widgets) na nadzorni plošči zažene Workflow za vsako spuščeno datoteko. Ti zagoni so označeni z oznako `dashboard`.

## Parametri

| Parameter | Tip | Privzeto | Opis |
|-----------|-----|----------|------|
| `ttlMinutes` | število | `60` | Kako dolgo ostane povezava za nalaganje veljavna (1–10080 minut / do 7 dni). |
| `maxSizeMb` | število | `100` | Največja sprejeta velikost datoteke. Trda meja je **100 MB**. |
| `allowedTypes` | niz | (prazno) | Neobvezni seznam MIME/razširitev, ločen z vejicami, npr. `audio/*, .wav`. Prazno dovoljuje katerokoli vrsto. |

## Izhodne polja

| Izraz | Opis |
|-------|------|
| `$nodeLabel.file.id` | UUID shranjene datoteke (datoteka na Drive-u). |
| `$nodeLabel.file.name` | Izvirno ime datoteke. |
| `$nodeLabel.file.mime` | Zaznana vrsta vsebine. |
| `$nodeLabel.file.size` | Velikost v bajtih. |
| `$nodeLabel.file.download_url` | Avtorizirana povezava za prenos za spodnje vozliče. |
| `$nodeLabel.uploaded_at` | ISO časovna oznaka nalaganja. |

## Primer

Workflow za transkripcijo:

```
Trigger za nalaganje datotek ("avdio")  →  Transkribiraj ($audio.file)  →  LLM povzetek  →  Izhod
```

1. Agent pokliče MCP orodje workflow-a in prejme `curl`.
2. Agent izvede `curl` s posnetkom iz svojega peskovnika.
3. Nalaganje izvede workflow in odgovor `curl` vsebuje povzetek transkripcije.

## Varnost

- Povezava za nalaganje vsebuje visoko-entropy token — token **je** zmožnost, zato peskovniški agent ne potrebuje Heym poverilnic za nalaganje. Samo hash tokena se shrani na strežniku.
- Mintanje zahteva normalno avtentikacijo workflow-a, tako da lahko le pooblaščeni klicatelji ustvarijo povezave za nalaganje.
- Vsako mintanje in vsak poskus nalaganja (sprejet ali zavrnjen — potekel, ponovljen, prevelik, nedovoljena vrsta, neznan token) se zapiše v dodaten revizijski sled.
- Nalaganja so prisiljena biti enkratna, omejena s TTL in omejena po velikosti; prevelika nalaganja so zavrnjena.

## Opombe

- Splošni HTTP, MCP in kanali za klicanje ostajajo samo JSON; to vozlišče je podprt način za sprejemanje multipart nalaganj datotek.
- Naložena datoteka se shrani kot običajna datoteka na Drive-u, tako da lahko katerokoli spodnje vozlišče, ki sprejema referenco na datoteko (transkribiraj, pošlji e-poštno prilogo itd.), porabi `$nodeLabel.file`.
