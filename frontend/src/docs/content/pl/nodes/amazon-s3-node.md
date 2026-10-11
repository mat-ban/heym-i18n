# Węzeł Amazon S3

Węzeł Amazon S3 odczytuje i zapisuje obiekty w [Amazon S3](https://aws.amazon.com/s3/).

## Obsługiwane operacje

- `Create Bucket`: Tworzy bucket w regionie określonym w danych logowania.
- `Delete Bucket`: Usuwa pusty bucket.
- `List Buckets`: Wyświetla listę bucketów widocznych dla danych logowania.
- `Create Folder`: Tworzy pusty znacznik folderu (klucz o zerowym rozmiarze zakończony znakiem `/`).
- `Delete Folder`: Usuwa wszystkie obiekty w ramach prefiksu folderu (włącznie z zagnieżdżonymi kluczami).
- `Get All in Folder`: Wyświetla metadane wszystkich obiektów w ramach prefiksu folderu (paginacja po stronie serwera).
- `Upload Object`: Zapisuje tekstowy payload do bucketu/klucza.
- `Get Object`: Pobiera obiekt i zwraca zdekodowany tekst lub zawartość base64.
- `Copy Object`: Kopiuje obiekt do innego klucza lub bucketu.
- `List Objects`: Wyświetla metadane obiektów w ramach prefiksu (pojedyncza strona, do 1000 kluczy; obsługuje tokeny kontynuacji).
- `Delete Object`: Usuwa pojedynczy obiekt po kluczu.

## Konfiguracja danych logowania

Należy utworzyć dane logowania `Amazon S3` w zakładce Dane logowania, podając:

- Access Key ID
- Secret Access Key
- Region
- Opcjonalny Session Token (dla tymczasowych danych logowania AWS STS)

## Pola wspólne

- `Bucket`: Nazwa docelowego bucketu (bucket docelowy dla operacji kopiowania).
- `Object Key`: Klucz obiektu w formie ścieżki, np. `reports/daily.json`.
- `Folder Path`: Prefiks dla operacji na folderach (na przykład `docs/archive`).
- `Source Bucket`: Opcjonalny bucket źródłowy dla kopiowania; domyślnie bucket docelowy.
- `Source Object Key`: Klucz źródłowy dla operacji kopiowania.
- `Prefix`: Używany przez operacje listowania do zawężenia wyników.
- `Continuation Token`: Opcjonalny token z poprzedniej odpowiedzi listowania do pobrania następnej strony.
- `Max Keys`: Rozmiar strony dla List Objects (1–1000).
- `Include Binary`: Po włączeniu w Get Object zwraca `body_base64` zamiast `body_text`.
- `Body`: Treść tekstowa do przesłania.
- `Content Type`: Opcjonalny typ MIME dla przesyłanych obiektów.

## Przykłady danych wyjściowych

### Create Bucket

- `${label}.success`
- `${label}.bucket`
- `${label}.region`

### Delete Bucket

- `${label}.success`
- `${label}.bucket`

### List Buckets

- `${label}.buckets`
- `${label}.count`
- `${label}.buckets[0].name`

### Create Folder

- `${label}.success`
- `${label}.bucket`
- `${label}.folder`
- `${label}.etag`

### Delete Folder

- `${label}.success`
- `${label}.bucket`
- `${label}.folder`
- `${label}.deleted_count`
- `${label}.deleted_keys`

### Get All in Folder

- `${label}.folder`
- `${label}.count`
- `${label}.objects`
- `${label}.objects[0].key`

### Upload Object

- `${label}.success`
- `${label}.bucket`
- `${label}.key`
- `${label}.etag`

### Get Object

- `${label}.content_type`
- `${label}.content_length`
- `${label}.body_text`
- `${label}.body_base64`

### Copy Object

- `${label}.source_bucket`
- `${label}.source_key`
- `${label}.bucket`
- `${label}.key`
- `${label}.etag`

### List Objects

- `${label}.objects`
- `${label}.count`
- `${label}.truncated`
- `${label}.next_continuation_token`
- `${label}.objects[0].key`

### Delete Object

- `${label}.success`
- `${label}.bucket`
- `${label}.key`
- `${label}.delete_marker`

## Uwagi

- `Upload Object` obecnie przesyła treść tekstową w formacie UTF-8.
- `Get Object` może zwrócić base64 dla plików binarnych po włączeniu opcji binarnej.
- `Create Bucket` korzysta z regionu określonego w danych logowania i wymaga uprawnienia `s3:CreateBucket`.
- `Delete Bucket` wymaga, aby bucket był pusty, oraz uprawnienia `s3:DeleteBucket`.
- `List Buckets` wymaga uprawnienia `s3:ListAllMyBuckets`.
- `Create Folder` przesyła znacznik obiektu o zerowym rozmiarze; S3 nie posiada natywnego typu katalogu.
- `Delete Folder` usuwa każdy obiekt, którego klucz rozpoczyna się od prefiksu folderu; należy używać z ostrożnością.
- `Get All in Folder` automatycznie paginuje przez prefiks, aż wszystkie obiekty zostaną zwrócone.
- `List Objects` zwraca jedną stronę (do 1000 kluczy). Gdy `truncated` ma wartość true, należy przekazać `next_continuation_token` do pola Continuation Token w następnym wywołaniu.
- `Copy Object` wymaga uprawnienia `s3:GetObject` dla źródła oraz `s3:PutObject` dla miejsca docelowego.

## Powiązane

- [Typy węzłów](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Dane logowania](../reference/credentials.md) – Typy danych logowania i sposób ich użycia
- [Integracje zewnętrzne](../reference/integrations.md) – Konfiguracja danych logowania Amazon S3
