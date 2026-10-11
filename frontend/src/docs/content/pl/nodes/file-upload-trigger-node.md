# Trigger Uploadu Pliku

Węzeł **Trigger Uploadu Pliku** to pozbawiony wejść punkt startowy dla workflow, które wymagają **dużego pliku** (audio, wideo, archiwa), którego nie można osadzić jako base64 w żądaniu JSON. Wywołanie workflow zwraca wstępnie wypełniony, jednorazowy link do uploadu `curl`; przesłanie pliku na ten link uruchamia wykonanie z załączonym plikiem.

Należy go użyć, gdy wywołujący — w tym agent AI, taki jak Claude lub ChatGPT działający w sandboxie — musi przekazać 20 MB nagrania głosowego lub 75 MB wideo do workflow Heym.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 0 |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.file.{id,name,mime,size,download_url}`, `$nodeLabel.uploaded_at` |

## Jak to działa

Węzeł działa w dwóch fazach:

1. **Wygenerowanie.** Gdy workflow jest wywoływany przez HTTP (`POST /api/workflows/{id}/execute`), jako narzędzie MCP lub przez przycisk **Run Workflow** na canvasie, wykonanie **nie** uruchamia treści. Zamiast tego generowany jest jednorazowy slot uploadu i zwracana jest odpowiedź:

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

2. **Upload + wykonanie.** Wywołujący uruchamia `curl` ze swoim plikiem. Endpoint uploadu waliduje slot, zapisuje plik, uruchamia workflow **synchronicznie** i zwraca wynik workflow w odpowiedzi uploadu. Link jest **jednorazowy** — drugi upload zwraca `409`.

Na canvasie przycisk **Run Workflow** wyświetla wygenerowany `curl` w panelu debugowania z przyciskiem kopiowania.

## Parametry

| Parametr | Typ | Domyślna | Opis |
|-----------|------|---------|-------------|
| `ttlMinutes` | number | `60` | Jak długo link do uploadu pozostaje ważny (1–10080 minut / do 7 dni). |
| `maxSizeMb` | number | `100` | Maksymalny akceptowany rozmiar pliku. Twardy limit to **100 MB**. |
| `allowedTypes` | string | (pusty) | Opcjonalna lista dozwolonych typów MIME/rozszerzeń rozdzielona przecinkami, np. `audio/*, .wav`. Pusta wartość zezwala na dowolny typ. |

## Pola wyjściowe

| Wyrażenie | Opis |
|------------|-------------|
| `$nodeLabel.file.id` | UUID zapisanego pliku (plik Drive). |
| `$nodeLabel.file.name` | Oryginalna nazwa pliku. |
| `$nodeLabel.file.mime` | Wykryty typ zawartości. |
| `$nodeLabel.file.size` | Rozmiar w bajtach. |
| `$nodeLabel.file.download_url` | Uwierzytelniony URL pobierania dla kolejnych węzłów. |
| `$nodeLabel.uploaded_at` | Znacznik czasu uploadu w formacie ISO. |

## Przykład

Workflow transkrypcji:

```
File Upload Trigger ("audio")  →  Transcribe ($audio.file)  →  LLM summary  →  Output
```

1. Agent wywołuje narzędzie MCP workflow i otrzymuje `curl`.
2. Agent uruchamia `curl` z nagraniem ze swojego sandboxa.
3. Upload uruchamia workflow, a odpowiedź `curl` zawiera podsumowanie transkrypcji.

## Bezpieczeństwo

- URL uploadu zawiera token o wysokiej entropii — token **jest** uprawnieniem, więc agent w sandboxie nie potrzebuje danych logowania Heym, aby przesłać plik. Po stronie serwera przechowywany jest wyłącznie hash tokenu.
- Wygenerowanie wymaga standardowego uwierzytelnienia workflow, więc tylko autoryzowani wywołujący mogą tworzyć linki do uploadu.
- Każde wygenerowanie i każda próba uploadu (zaakceptowana lub odrzucona — wygasła, powtórzona, zbyt duża, niedozwolony typ, nieznany token) jest zapisywana w dzienniku audytu tylko do dopisywania.
- Uploady są egzekwowane jako jednorazowe, ograniczone czasem TTL i limitem rozmiaru; zbyt duże uploady są odrzucane.

## Uwagi

- Ogólne kanały wywołania HTTP, MCP i canvas pozostają wyłącznie JSON; ten węzeł jest wspieranym sposobem akceptowania uploadów plików multipart.
- Przesłany plik jest przechowywany jako zwykły plik Drive, więc każdy kolejny węzeł akceptujący referencję do pliku (transkrypcja, wysyłanie załącznika e-mail itp.) może użyć `$nodeLabel.file`.
