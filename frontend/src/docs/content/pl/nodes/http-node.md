# HTTP

Węzeł **HTTP** wykonuje żądania HTTP z użyciem składni cURL. Może stanowić punkt początkowy workflow (bez krawędzi wejściowej) lub odbierać dane wejściowe z węzłów poprzedzających.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 0 lub 1 |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.status`, `$nodeLabel.body`, `$nodeLabel.headers` |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `label` | string | Identyfikator węzła (camelCase) |
| `curl` | string | Polecenie cURL (np. `curl -X GET https://api.example.com`) |

## Format odpowiedzi

```json
{
  "status": 200,
  "headers": { "content-type": "application/json", ... },
  "body": "response body or parsed JSON",
  "request": { "method": "POST", "url": "...", "headers": {...} }
}
```

## Dostęp do odpowiedzi

- `$httpNode.status` – kod statusu HTTP
- `$httpNode.body` – treść odpowiedzi (ciąg znaków lub sparsowany JSON)
- `$httpNode.body.fieldName` – dostęp do pól JSON
- `$httpNode.headers` – nagłówki odpowiedzi

## Przykład

```json
{
  "type": "http",
  "data": {
    "label": "fetchApi",
    "curl": "curl -X GET https://api.example.com/data"
  }
}
```

Należy używać składni cURL z opcją `-H` dla nagłówków, `-d` dla treści POST itd. Wyrażenia mogą być stosowane w dowolnym miejscu ciągu curl, w tym w adresie URL, nagłówku lub całej linii nagłówka. [Dane logowania](../reference/credentials.md) typu Header są rozwiązywane do postaci `key: value`, więc `-H "$credentials.MyApiKey"` wysyła kompletny nagłówek:

```
curl -X GET "https://api.example.com/search?q=$query.body.text.urlEncode()" -H "$credentials.MyApiKey"
```

Cudzysłowy i spacje wewnątrz wyrażenia należą do wyrażenia, a nie do polecenia cURL, dlatego metody przyjmujące argumenty tekstowe działają w miejscu:

```
curl "https://r.jina.ai/$url.text.replaceAll("\n", "").strip()" -H "Authorization: $credentials.Jina"
```

## Uwierzytelnianie za pomocą danych logowania

`$credentials.Name` przyjmuje różne wartości w zależności od typu [danych logowania](../reference/credentials.md), dlatego linia nagłówka zależy od typu:

| Typ danych logowania | Wartość `$credentials.Name` | Nagłówek |
|-----------------|---------------------------------|--------|
| Bearer | `Bearer <token>` | `-H "Authorization: $credentials.Name"` |
| Header | `<Header-Name>: <value>` | `-H "$credentials.Name"` |
| OpenAI, Custom, Cohere | Surowy klucz API | `-H "Authorization: Bearer $credentials.Name"` |
| Google | Surowy klucz API | `-H "x-goog-api-key: $credentials.Name"` |
| ElevenLabs | Surowy klucz API | `-H "xi-api-key: $credentials.Name"` |
| Google Sheets, Google Drive | Świeży token dostępu OAuth, odświeżany po wygaśnięciu | `-H "Authorization: Bearer $credentials.Name"` |
| GitHub, Notion, Sentry | Token | `-H "Authorization: Bearer $credentials.Name"` |

Dane logowania typu Bearer zawierają już prefiks `Bearer `, więc dodanie kolejnego powoduje wysłanie `Bearer Bearer …`. Dane logowania Google Sheets i Google Drive umożliwiają wywoływanie API Google nieobsługiwanych przez ich węzeł, na przykład dodawanie arkusza do skoroszytu, w zakresie uprawnień przyznanych danym logowania. Gdy nazwa nie jest zwykłym identyfikatorem (zawiera `-`, zaczyna się od cyfry lub jest słowem zastrzeżonym), należy użyć formy nawiasowej: `-H "Authorization: $credentials["my-api-key"]"`.

Gdy [Asystent AI](../reference/ai-assistant.md) lub [Chat](../tabs/chat-tab.md) buduje żądanie HTTP wymagające uwierzytelniania, a żaden dedykowany węzeł nie obsługuje danej usługi, pyta o wybór danych logowania. Należy wybrać jedne, zmienić wstępnie wypełnioną nazwę nagłówka, jeśli API oczekuje innej, a asystent zapisze linię nagłówka. Asystent widzi nazwy i typy danych logowania, nigdy ich wartości. Jeśli brak odpowiednich danych logowania, pytanie oferuje ich utworzenie. Sekrety trafiające do wyjścia węzła, takie jak wysłane `request.headers`, są maskowane w wynikach wykonania.

## Bezpieczeństwo ruchu wychodzącego

- Domyślnie adres URL musi używać `http://` lub `https://` i wskazywać wyłącznie adresy publiczne. Miejsca docelowe typu loopback, prywatne, link-local, multicast oraz metadane chmurowe są blokowane.
- Heym weryfikuje rozwiązane adresy i przypina cel połączenia, aby zapobiec atakom DNS rebinding. Proxy środowiskowe są wyłączane, gdy ochrona jest aktywna. Przekierowania nie są domyślnie śledzone; należy dodać opcję cURL `-L`, aby je śledzić. Po włączeniu każde przekierowanie jest sprawdzane względem tej samej polityki adresów publicznych i przypinane przed połączeniem.
- Zaufane wdrożenia self-hosted, które celowo łączą się z usługami wewnętrznymi, mogą ustawić `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. W wdrożeniach hostowanych lub wielodostępnych należy zachować wartość domyślną.

**Uwaga dotycząca aktualizacji do v0.0.105:** ta polityka obejmująca całą instancję chroni teraz również miejsca docelowe pochodzące z danych logowania, używane przez Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, niestandardowe wykonanie LLM i wykrywanie modeli, asystenta AI, guardrails oraz osadzenia RAG. Istniejące dane logowania wskazujące na adresy loopback, prywatne lub link-local są odrzucane, chyba że na zaufanej instancji self-hosted włączono `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Gdy ochrona jest aktywna, chronione klienty HTTP ignorują `HTTP_PROXY` i `HTTPS_PROXY`; włączenie opcji rezygnacji przywraca ich działanie. Pakiety CA operatora skonfigurowane przez `SSL_CERT_FILE` lub `SSL_CERT_DIR` pozostają obsługiwane. ClickHouse jest sprawdzany przed otwarciem połączenia, ale nie jest przypinany w momencie nawiązania połączenia, ponieważ clickhouse-connect korzysta z własnego transportu urllib3.

## Powiązane

- [Typy węzłów](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Triggery](../reference/triggers.md) – HTTP jako punkt wejścia workflow
- [Zakładka Dane logowania](../tabs/credentials-tab.md) – Dodawanie kluczy API dla uwierzytelnionych żądań
