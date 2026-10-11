# Google Drive

Węzeł **Google Drive** umożliwia wyświetlanie listy, pobieranie, aktualizowanie oraz usuwanie plików i folderów w Google Drive za pośrednictwem OAuth2. Może również kopiować plik z Drive bezpośrednio do [Heym Drive](./drive-node.md) w ramach pojedynczej operacji.

> **To nie jest węzeł [Drive](./drive-node.md).** Tamten węzeł to *Heym Drive* — wewnętrzny magazyn plików Heym. Ten węzeł komunikuje się z Google Drive. Operacja `syncToHeymDrive` stanowi pomost między nimi.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Dane logowania | Google Drive (OAuth2) |
| Wyjście | `$nodeLabel.files`, `$nodeLabel.content_base64`, `$nodeLabel.download_url`, `$nodeLabel.status` |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | Dane logowania Google Drive z zakładki [Dane logowania](../tabs/credentials-tab.md) |
| `gdOperation` | string | Operacja: `listFolderFiles`, `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`, `removeFolder` |
| `gdFolderId` | expression | ID folderu lub pełny URL folderu Drive. Używane przez `listFolderFiles` oraz `removeFolder`. Pusta wartość oznacza katalog główny Drive. |
| `gdFileId` | expression | ID pliku lub pełny URL pliku Drive/Docs. Używane przez `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`. |
| `gdMaxResults` | expression | Dla `listFolderFiles`: maksymalna liczba plików do zwrócenia (domyślnie 100). Pusta wartość lub `0` powoduje wczytanie całego folderu z użyciem stronicowania. Każdy wyświetlony plik zawiera `size_bytes`, gdy Drive zgłasza rozmiar. |
| `gdQuery` | expression | Dla `listFolderFiles`: dodatkowe zapytanie Drive łączone operatorem AND z filtrem folderu, np. `mimeType='application/pdf'`. |
| `gdIncludeTrashed` | boolean | Dla `listFolderFiles`: uwzględniaj pliki w koszu. Domyślnie false. |
| `gdExportFormat` | string | Dla `downloadFile` / `syncToHeymDrive`: `pdf`, `docx`, `xlsx`, `pptx`, `csv`, `txt`. Pusta wartość oznacza format automatyczny. Ignorowane dla zwykłych plików. |
| `gdFilename` | expression | Dla `syncToHeymDrive`: zastąp nazwę pliku przechowywaną w Heym Drive. |
| `gdBase64Content` | expression | Dla `updateFile`: ciąg base64 lub URL `data:`, który zastępuje zawartość pliku. |
| `gdNewName` | expression | Dla `updateFile`: nowa nazwa pliku (zmiana nazwy). |
| `gdNewParentId` | expression | Dla `updateFile`: ID folderu docelowego lub URL (przeniesienie). |
| `gdPermanentDelete` | boolean | Dla `removeFile` / `removeFolder`: gdy false (domyślnie) element trafia do kosza i można go odzyskać; gdy true zostaje trwale usunięty. |

## ID plików i folderów

`gdFileId`, `gdFolderId` oraz `gdNewParentId` przyjmują zarówno **samo ID**, jak i **pełny URL** — Heym automatycznie wyodrębnia ID. Wszystkie poniższe formy są prawidłowe:

- `https://drive.google.com/file/d/1AbCdEf/view`
- `https://drive.google.com/drive/folders/1FolderXyz`
- `https://docs.google.com/document/d/1DocId/edit`
- `https://drive.google.com/open?id=1AbCdEf`
- `1AbCdEf`

## Google Docs, Sheets i Slides

Dokumenty natywne dla Google **nie mają bajtów do pobrania**. Są to rekordy na serwerach Google, a nie pliki — API Drive zwraca błąd `403 Only files with binary content can be downloaded`, gdy zażąda się ich surowej zawartości.

Operacje `downloadFile` oraz `syncToHeymDrive` wykrywają je automatycznie i zamiast tego **eksportują**, dzięki czemu żadna operacja nie kończy się niepowodzeniem tylko dlatego, że celem jest dokument Google:

| Źródło | Domyślny format eksportu |
|--------|----------------|
| Google Docs | PDF |
| Google Sheets | XLSX |
| Google Slides | PPTX |
| Każdy inny typ natywny dla Google | PDF |

Aby zmienić format docelowy, należy ustawić **Export Format**. Ustawienie jest ignorowane dla zwykłych przesłanych plików, które zawsze są pobierane w niezmienionej postaci.

## Operacje

| Operacja | Wymagane | Opis |
|-----------|----------|-------------|
| `listFolderFiles` | — (pusty folder = katalog główny) | Wyświetla listę plików w folderze z opcjonalnym filtrem zapytania |
| `downloadFile` | `gdFileId` | Pobiera zawartość pliku jako base64, automatycznie eksportując dokumenty natywne |
| `syncToHeymDrive` | `gdFileId` | Pobiera plik z Google Drive i zapisuje wynik w Heym Drive |
| `updateFile` | `gdFileId` + co najmniej jedno z: zawartość / nazwa / folder nadrzędny | Zastępuje zawartość, zmienia nazwę i/lub przenosi plik |
| `removeFile` | `gdFileId` | Przenosi do kosza (domyślnie) lub trwale usuwa plik |
| `removeFolder` | `gdFolderId` | Przenosi do kosza (domyślnie) lub trwale usuwa folder wraz z zawartością |

### Usuwanie jest domyślnie odwracalne

Operacje `removeFile` oraz `removeFolder` przenoszą element do **kosza Google Drive**, skąd można go przywrócić. Jest to bezpieczne ustawienie domyślne dla operacji, które mogą być uruchamiane według harmonogramu lub wewnątrz węzła [Loop](./loop-node.md).

Włączenie opcji **Delete permanently** powoduje trwałe zniszczenie elementu bez możliwości odzyskania. W przypadku `removeFolder` niszczy to również całą zawartość folderu.

Węzeł weryfikuje także typ celu: `removeFile` odmawia wykonania na folderze, a `removeFolder` odmawia wykonania na pliku, dzięki czemu błędnie wpisane ID nie może w sposób niezauważony usunąć niewłaściwego elementu.

### updateFile pozostawia puste pola bez zmian

`updateFile` to aktualizacja, a nie zastąpienie. Można wypełnić dowolną kombinację zawartości, nowej nazwy i nowego folderu — wszystko, co pozostanie puste, nie zostanie zmienione. Wymagane jest co najmniej jedno z tych trzech pól.
## Konfiguracja danych logowania

Google Drive wykorzystuje model **OAuth2 „Bring Your Own App"**. Należy dostarczyć własne dane logowania OAuth2 z Google Cloud.

> **Te dane logowania przyznają pełny dostęp do Drive.** Heym żąda zakresu `https://www.googleapis.com/auth/drive`, ponieważ węzeł operuje na plikach, których użytkownik jest już właścicielem. Węższy zakres `drive.file` widzi wyłącznie pliki utworzone przez samą aplikację, co uniemożliwiłoby listowanie, aktualizowanie i usuwanie istniejących plików. Przed udostępnieniem tych danych logowania zespołowi należy zapoznać się z sekcją [Udostępnianie danych logowania](../reference/credentials-sharing.md).

**Konfiguracja backendu:** Należy ustawić **`FRONTEND_URL`** w backendzie Heym na publiczny adres URL aplikacji. Identyfikator URI przekierowania OAuth to zawsze `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` — jest on wyznaczany wyłącznie na podstawie tego ustawienia, a nie na podstawie nagłówków żądania.

1. Przejdź do [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → włącz **Google Drive API**.
2. Przejdź do **Credentials** → **Create Credentials** → **OAuth client ID** → wybierz **Web application**.
3. W sekcji **Authorized redirect URIs** dodaj dokładnie `{your FRONTEND_URL}/api/credentials/google-drive/oauth/callback`.
4. Skopiuj **Client ID** oraz **Client Secret**.
5. W Heym: **Dashboard → Credentials → New → Google Drive (OAuth2)**, wklej obie wartości, następnie kliknij **Connect** i zatwierdź dostęp w oknie popup.

## Dane wyjściowe

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

`size_bytes` ma wartość `null` dla folderów oraz plików natywnych dla Google, które nie raportują rozmiaru.

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

Dla zwykłego pliku `exported` ma wartość `false`, a `export_format` ma wartość `null`.

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

`id` to identyfikator nowego pliku w **Heym Drive**, różny od `google_file_id`.

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

`deleted` przyjmuje wartość `"trashed"` lub `"permanent"`.

## Przykład: tworzenie kopii zapasowej folderu Drive w Heym Drive

1. **[Cron](./cron-node.md)** — uruchomienie codzienne.
2. **Google Drive** — `listFolderFiles` na folderze źródłowym, z `gdQuery` ustawionym na `mimeType='application/pdf'`, jeśli potrzebne są wyłącznie pliki PDF.
3. **[Loop](./loop-node.md)** — iteracja po `$ListReports.files`.
4. **Google Drive** — `syncToHeymDrive` z `gdFileId` ustawionym na `$BackupLoop.item.id` oraz `gdFilename` ustawionym na `$BackupLoop.item.name`.
5. **[Slack](./slack-node.md)** — publikacja podsumowania wykonanej kopii zapasowej.

## Uwagi

- Każde pole tekstowe akceptuje wyrażenia `$`, więc identyfikatory i nazwy plików mogą pochodzić z wcześniejszych węzłów.
- Dyski współdzielone są obsługiwane — węzeł ustawia `supportsAllDrives` w każdym żądaniu.
- Pobierane pliki są weryfikowane pod kątem rozmiaru względem ustawienia `FILE_MAX_SIZE_MB` w backendzie.
- Należy podłączyć ten węzeł do wejścia narzędziowego węzła [Agent](./agent-node.md) i użyć ikony bota przy dowolnym polu, aby agent mógł je wypełnić w czasie działania.

## Zobacz także

- [Drive (Heym Drive)](./drive-node.md)
- [Google Sheets](./google-sheets-node.md)
- [Loop](./loop-node.md)
- [Dane logowania](../reference/credentials.md)
- [Udostępnianie danych logowania](../reference/credentials-sharing.md)
