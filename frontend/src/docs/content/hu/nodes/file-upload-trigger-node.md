# Fájlfeltöltés Trigger

A **Fájlfeltöltés Trigger** csomópont nulla bemenettel rendelkező belépési pont azon workflow-k számára, amelyeknek **nagy fájlra** (hang, videó, archívumok) van szükségük, amely nem ágyazható be base64 formátumban egy JSON kérésbe. A workflow meghívása egy előre kitöltött, egyszer használatos `curl` feltöltési linket ad vissza; egy fájl feltöltése erre a linkre elindítja a futtatást a csatolt fájllal.

Akkor használja, amikor a hívónak — beleértve egy sandboxban futó AI-ügynököt, például a Claude-ot vagy a ChatGPT-t — át kell adnia egy 20 MB-os hangfelvételt vagy egy 75 MB-os videót egy Heym workflow számára.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 0 |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.file.{id,name,mime,size,download_url}`, `$nodeLabel.uploaded_at` |

## Hogyan működik

A csomópont két fázisban fut:

1. **Létrehozás.** Amikor a workflow-t HTTP-n keresztül hívják meg (`POST /api/workflows/{id}/execute`), MCP tool-ként, vagy a vászon **Run Workflow** gombjával, a futtatás **nem** hajtja végre a törzset. Ehelyett létrehoz egy egyszer használatos feltöltési helyet, és visszaadja:

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

2. **Feltöltés + futtatás.** A hívó futtatja a `curl` parancsot a fájljával. A feltöltési endpoint érvényesíti a helyet, eltárolja a fájlt, **szinkron módon** futtatja a workflow-t, és visszaadja a workflow kimenetét a feltöltési válaszban. A link **egyszer használatos** — egy második feltöltés `409`-et ad vissza.

A vásznon a **Run Workflow** a létrehozott `curl` parancsot a debug panelen jeleníti meg egy másolás gombbal.

## Futtatás a Heymből

Két helyről is közvetlenül futtatható egy ilyen Workflow egy fájlon, ugyanazon generálási és feltöltési folyamaton keresztül:

- A [Quick Drawer](../reference/quick-drawer.md) egy ejtési zónát jelenít meg a fájl számára. Ezek a futtatások `Quick Drawer` címkét kapnak az előzményekben.
- Egy irányítópulton lévő [Futtatás widget](../tabs/dashboard-tab.md#run-widgets) minden egyes behúzott fájlra lefuttatja a Workflow-t. Ezek a futtatások `dashboard` címkét kapnak.

## Paraméterek

| Paraméter | Típus | Alapértelmezett | Leírás |
|-----------|------|---------|-------------|
| `ttlMinutes` | number | `60` | Mennyi ideig marad érvényes a feltöltési link (1–10080 perc / legfeljebb 7 nap). |
| `maxSizeMb` | number | `100` | Maximálisan elfogadott fájlméret. A kemény felső határ **100 MB**. |
| `allowedTypes` | string | (üres) | Opcionális, vesszővel elválasztott MIME/kiterjesztés engedélyezési lista, pl. `audio/*, .wav`. Az üres érték bármilyen típust engedélyez. |

## Kimeneti mezők

| Kifejezés | Leírás |
|------------|-------------|
| `$nodeLabel.file.id` | Tárolt fájl UUID (egy Drive fájl). |
| `$nodeLabel.file.name` | Eredeti fájlnév. |
| `$nodeLabel.file.mime` | Észlelt tartalomtípus. |
| `$nodeLabel.file.size` | Méret bájtban. |
| `$nodeLabel.file.download_url` | Hitelesített letöltési URL a downstream csomópontok számára. |
| `$nodeLabel.uploaded_at` | A feltöltés ISO időbélyege. |

## Példa

Egy átírási workflow:

```
File Upload Trigger ("audio")  →  Transcribe ($audio.file)  →  LLM summary  →  Output
```

1. Egy ügynök meghívja a workflow MCP tool-ját, és megkapja a `curl` parancsot.
2. Az ügynök futtatja a `curl` parancsot a sandboxából származó felvétellel.
3. A feltöltés futtatja a workflow-t, és a `curl` válasza tartalmazza az átirat összefoglalóját.

## Biztonság

- A feltöltési URL nagy entrópiájú tokent tartalmaz — a token **jelenti** a jogosultságot, így egy sandboxolt ügynöknek nincs szüksége Heym hitelesítési adatokra a feltöltéshez. Csak a token hash-e tárolódik szerveroldalon.
- A létrehozáshoz normál workflow-hitelesítés szükséges, így csak jogosult hívók hozhatnak létre feltöltési linkeket.
- Minden létrehozás és minden feltöltési kísérlet (elfogadott vagy elutasított — lejárt, újrajátszott, túlméretes, nem engedélyezett típus, ismeretlen token) egy csak hozzáfűzhető auditnaplóba kerül.
- A feltöltések egyszer használatosak, TTL-korlátozottak és méretkorlátozottak; a túlméretes feltöltések elutasításra kerülnek.

## Megjegyzések

- Az általános HTTP, MCP és vászon meghívási csatornák JSON-only maradnak; ez a csomópont a támogatott módja a multipart fájlfeltöltések fogadásának.
- A feltöltött fájl normál Drive fájlként tárolódik, így bármely downstream csomópont, amely elfogad fájlhivatkozást (átírás, e-mail melléklet küldése stb.), fel tudja használni a `$nodeLabel.file` értéket.
