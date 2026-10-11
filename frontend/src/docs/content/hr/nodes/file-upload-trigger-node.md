# Trigger za Učitavanje Datoteka

**Trigger za Učitavanje Datoteka** je ulazna točka bez ulaza za workflows koji trebaju **veliku datoteku** (audio, video, arhive) koja se ne može umetnuti kao base64 unutar JSON zahtjeva. Pozivanje workflow-a vraća unaprijed ispunjenu, jednokratnu `curl` vezu za učitavanje; učitavanje datoteke na tu vezu pokreće izvršavanje s datotekom priloženom.

Koristite ga kada pozivatelj — uključujući AI agenta poput Claudea ili ChatGPT-a koji radi u sandboxu — mora predati 20 MB snimku glasa ili 75 MB videozapis Heym workflow-u.

## Pregled

| Svojstvo | Vrijednost |
|----------|------------|
| Ulazi | 0 |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.file.{id,name,mime,size,download_url}`, `$nodeLabel.uploaded_at` |

## Kako to funkcionira

Čvor radi u dva faze:

1. **Mintanje.** Kada se workflow poziva putem HTTP-a (`POST /api/workflows/{id}/execute`), kao MCP alat, ili putem gumba **Pokreni Workflow** na platnu, izvršavanje **ne** izvršava tijelo. Umjesto toga, mintanje se vrši za jednokratni upload slot i vraća:

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

2. **Učitavanje + izvršavanje.** Pozivatelj pokreće `curl` s njihovom datotekom. Upload endpoint validira slot, pohranjuje datoteku, izvršava workflow **sinkrono** i vraća izlaz workflow-a u odgovoru na upload. Veza je **jednokratna** — drugo učitavanje vraća `409`.

Na platnu, **Pokreni Workflow** prikazuje mintani `curl` u debug panelu s gumbom za kopiranje.

## Parametri

| Parametar | Tip | Zadano | Opis |
|-----------|-----|--------|------|
| `ttlMinutes` | broj | `60` | Koliko dugo veza za učitavanje ostaje valjana (1–10080 minuta / do 7 dana). |
| `maxSizeMb` | broj | `100` | Maksimalna prihvaćena veličina datoteke. Čvrsti limit je **100 MB**. |
| `allowedTypes` | string | (prazno) | Opcionalna lista MIME/ekstenzija koja se dopušta, npr. `audio/*, .wav`. Prazno dopušta bilo koju vrstu. |

## Polja izlaza

| Izraz | Opis |
|-------|------|
| `$nodeLabel.file.id` | UUID pohranjene datoteke (datoteka na Drive-u). |
| `$nodeLabel.file.name` | Izvorni naziv datoteke. |
| `$nodeLabel.file.mime` | Otkriveni tip sadržaja. |
| `$nodeLabel.file.size` | Veličina u bajtovima. |
| `$nodeLabel.file.download_url` | Autorizirana URL adresa za preuzimanje za downstream čvorove. |
| `$nodeLabel.uploaded_at` | ISO vremenska oznaka učitavanja. |

## Primjer

Workflow za transkripciju:

```
Trigger za Učitavanje Datoteka ("audio")  →  Transkribiraj ($audio.file)  →  LLM sažetak  →  Izlaz
```

1. Agent poziva MCP alat workflow-a i prima `curl`.
2. Agent pokreće `curl` sa snimkom iz svog sandboxa.
3. Učitavanje pokreće workflow, a `curl` odgovor sadrži sažetak transkripta.

## Sigurnost

- URL za učitavanje sadrži token visoke entropije — token **je** sposobnost, tako da sandboxirani agent ne treba Heym vjerodajnice za učitavanje. Samo se hash tokena pohranjuje na strani poslužitelja.
- Mintanje zahtijeva normalnu autentifikaciju workflow-a, tako da samo ovlašteni pozivatelji mogu kreirati veze za učitavanje.
- Svako mintanje i svaki pokušaj učitavanja (prihvaćen ili odbijen — istekao, ponovljen, prevelik, zabranjena vrsta, nepoznati token) zapisuje se u audit trail koji se može samo dodavati.
- Učitavanja su nametnuta kao jednokratna, vremenski ograničena i ograničena veličinom; prevelika učitavanja se odbacuju.

## Napomene

- Opći HTTP, MCP i kanali pozivanja na platnu ostaju isključivo JSON; ovaj čvor je podržani način prihvaćanja multipart učitavanja datoteka.
- Učitana datoteka pohranjuje se kao normalna datoteka na Drive-u, tako da svaki downstream čvor koji prihvaća referencu na datoteku (transkribiraj, pošalji email kao privitak itd.) može koristiti `$nodeLabel.file`.
