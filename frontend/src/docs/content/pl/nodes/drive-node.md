# Węzeł Drive

Węzeł **Drive** zarządza plikami generowanymi przez skille bezpośrednio z poziomu workflow. Służy do pobierania plików, ich ściągania z zewnętrznych adresów URL, usuwania, udostępniania lub cofania udostępniania zespołom oraz programowej aktualizacji ograniczeń dostępu (hasło, termin ważności, limit pobrań).

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.files`, `$nodeLabel.status`, `$nodeLabel.file_id`, `$nodeLabel.download_url` (zależnie od operacji) |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `driveOperation` | string | Operacja: `get`, `getAll`, `downloadUrl`, `save`, `delete`, `setPassword`, `setTtl`, `setMaxDownloads`, `shareWithMyTeams`, `unshareWithMyTeams` |
| `driveFileId` | expression / select | UUID pliku Drive do zarządzania (wszystkie operacje poza `getAll`, `downloadUrl` i `save`) |
| `driveLimit` | number | Maksymalna liczba plików do zwrócenia (tylko `getAll`; puste oznacza brak limitu) |
| `driveSourceUrl` | expression | URL do pobrania i zapisania w Drive (tylko `downloadUrl`) |
| `driveFilename` | expression | Pełna nazwa pliku wraz z rozszerzeniem (tylko `save`, np. `1.mp3`) |
| `driveBase64Content` | expression | Surowy ciąg base64 lub data URL do zdekodowania i zapisania (tylko `save`) |
| `driveIncludeBinary` | boolean | Dołącz zawartość pliku jako base64 w wyjściu (tylko `get`) |
| `drivePassword` | expression | Hasło do ustawienia na tokenie dostępu (tylko `setPassword`) |
| `driveTtlHours` | number | Liczba godzin do wygaśnięcia linku pobierania (tylko `setTtl`) |
| `driveMaxDownloads` | number | Maksymalna dozwolona liczba pobrań (tylko `setMaxDownloads`) |

## Uzyskiwanie identyfikatora pliku

Gdy skill generuje pliki, wyjście zawiera tablicę `_generated_files`. Każdy wpis zawiera pole `id`:

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

Identyfikator pliku należy wskazać za pomocą: `$agentLabel._generated_files[0].id`

## Operacje

| Operacja | Wymagane pola | Opis |
|-----------|----------------|-------------|
| `get` | driveFileId | Pobiera metadane pliku (oraz opcjonalnie zawartość binarną) z Drive |
| `getAll` | brak | Wyświetla listę posiadanych i udostępnionych zespołowo plików Drive z prawem odczytu wraz z metadanymi, takimi jak nazwa pliku, typ MIME, rozmiar, źródło i URL pobierania |
| `downloadUrl` | driveSourceUrl | Pobiera plik z zewnętrznego URL i zapisuje go w Drive |
| `save` | driveFilename, driveBase64Content | Dekoduje zawartość base64 i zapisuje ją jako plik Drive |
| `delete` | driveFileId | Usuwa plik i wszystkie jego tokeny dostępu z dysku oraz bazy danych |
| `setPassword` | driveFileId, drivePassword | Zastępuje domyślny token publiczny tokenem chronionym hasłem |
| `setTtl` | driveFileId, driveTtlHours | Zastępuje domyślny token publiczny tokenem wygasającym po N godzinach |
| `setMaxDownloads` | driveFileId, driveMaxDownloads | Zastępuje domyślny token publiczny tokenem ograniczonym do N pobrań |
| `shareWithMyTeams` | driveFileId | Udostępnia plik w trybie tylko do odczytu wszystkim zespołom, do których właściciel workflow obecnie należy |
| `unshareWithMyTeams` | driveFileId | Usuwa wszystkie udostępnienia zespołowe pliku |

> **Uwaga:** Operacje `set*` usuwają domyślny (bez ograniczeń) token publiczny i tworzą nowy z określonym ograniczeniem. Zaktualizowany `download_url` znajduje się w wyjściu.
> **Udostępnianie zespołowe:** `shareWithMyTeams` tworzy jawne udostępnienia dla bieżących zespołów właściciela. Przyszłe zespoły nie są dodawane automatycznie, chyba że operacja zostanie uruchomiona ponownie. `unshareWithMyTeams` usuwa wszystkie udostępnienia zespołowe pliku.

## Przykład — pobieranie pliku z URL

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

Odwołanie do zapisanego pliku w dalszej części workflow: `$fetchReport.id`, `$fetchReport.download_url`

Nazwa pliku jest pobierana z nagłówka odpowiedzi `Content-Disposition`; jeśli go brak, jest wyprowadzana ze ścieżki URL.

## Przykład — zapis danych wejściowych base64 do Drive

Zastosowanie, gdy węzeł wejściowy tekstu (lub dowolny węzeł poprzedzający) dostarcza zawartość pliku w formacie base64:

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

Odwołanie do zapisanego pliku w dalszej części workflow: `$saveAudio.id`, `$saveAudio.download_url`

`driveBase64Content` przyjmuje surowy ciąg base64 lub data URL w formacie `data:...;base64,...`. Typ MIME jest wnioskowany z rozszerzenia nazwy pliku.

## Przykład — pobranie pliku i użycie danych binarnych w LLM wizyjnym

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

Odwołanie do zawartości base64 w dalszej części workflow: `$fetchImage.file_base64`

Obrazy zwrócone przez `file_base64` są wyświetlane bezpośrednio w panelu debugowania podczas uruchamiania workflow.

## Przykład — lista plików Drive

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

Odwołanie do pierwszego zwróconego pliku w dalszej części workflow: `$listFiles.files[0].filename`, `$listFiles.files[0].size_bytes`
## Przykład — Usuwanie pliku po przetworzeniu

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

## Przykład — Ustawianie hasła dla wygenerowanego pliku

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

## Przykład — Ustawianie terminu ważności (TTL)

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

## Przykład — Ograniczanie liczby pobrań

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

## Przykład — Udostępnianie zespołom

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

Członkowie zespołu mogą wyświetlać i pobierać plik z Drive oraz korzystać z operacji odczytu w workflow. Nie mogą usuwać pliku, udostępniać go ponownie ani zmieniać ograniczeń publicznego linku.

## Przykład — Cofanie udostępnienia zespołom

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

## Konwersja pliku

Konwersja formatów została przeniesiona do węzła [Converter](./converter-node.md). Należy zapisać lub pobrać plik za pomocą Drive, a następnie przekazać jego identyfikator do węzła konwertera:

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

Oryginalny plik zostaje zachowany, a przekonwertowany plik jest zapisywany jako nowy plik w Drive.

## Dostęp do danych wyjściowych

**get:**
- `$nodeLabel.id` — UUID pliku
- `$nodeLabel.filename` — nazwa pliku
- `$nodeLabel.mime_type` — typ MIME (np. `image/png`)
- `$nodeLabel.size_bytes` — rozmiar pliku w bajtach
- `$nodeLabel.download_url` — publiczny URL do pobrania
- `$nodeLabel.file_base64` — zawartość pliku zakodowana w base64 (tylko gdy opcja **Include binary content** jest włączona)

**getAll:**
- `$nodeLabel.files` — tablica obiektów z metadanymi plików
- `$nodeLabel.count` — liczba zwróconych plików
- `$nodeLabel.files[0].id` — UUID pliku
- `$nodeLabel.files[0].filename` — nazwa pliku
- `$nodeLabel.files[0].mime_type` — typ MIME
- `$nodeLabel.files[0].size_bytes` — rozmiar pliku w bajtach
- `$nodeLabel.files[0].download_url` — publiczny URL do pobrania, gdy istnieje publiczny token
- `$nodeLabel.files[0].metadata` — zapisany obiekt metadanych
- `$nodeLabel.files[0].created_at` — znacznik czasu utworzenia pliku

**downloadUrl:**
- `$nodeLabel.id` — UUID nowo zapisanego pliku
- `$nodeLabel.filename` — nazwa pliku (z nagłówka `Content-Disposition` lub ścieżki URL)
- `$nodeLabel.mime_type` — typ MIME wykryty na podstawie odpowiedzi lub rozszerzenia pliku
- `$nodeLabel.size_bytes` — rozmiar pliku w bajtach
- `$nodeLabel.download_url` — URL do pobrania pliku z Drive dla zapisanego pliku

**delete:**
- `$nodeLabel.status` — `"deleted"`
- `$nodeLabel.file_id` — UUID usuniętego pliku

**setPassword / setTtl / setMaxDownloads:**
- `$nodeLabel.status` — `"updated"`
- `$nodeLabel.file_id` — UUID pliku
- `$nodeLabel.download_url` — nowy URL tokenu dostępu z nałożonym ograniczeniem

**shareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID pliku
- `$nodeLabel.shared_team_count` — liczba udostępnień zespołom po wykonaniu operacji

**unshareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID pliku
- `$nodeLabel.shared_team_count` — `0` po wykonaniu operacji

## Własność

Operacje dostępne wyłącznie dla właściciela wymagają, aby plik należał do właściciela workflow. Operacje odczytu (`get`, `getAll`) mogą również uzyskiwać dostęp do plików udostępnionych właścicielowi workflow przez zespół.

## Powiązane

- [File Generation](../reference/file-generation.md) — Jak skille generują pliki i dane wyjściowe `_generated_files`
- [Drive Tab](../reference/drive.md) — Wizualne zarządzanie plikami w panelu
- [Agent Node](./agent-node.md) — Uruchamia skille generujące pliki
- [Converter Node](./converter-node.md) — Konwersja zapisanego pliku do innego formatu lub OCR do tekstu
- [Expression DSL](../reference/expression-dsl.md) — Składnia wyrażeń dla wartości dynamicznych
