# Integracje zewnętrzne

Heym łączy się z usługami zewnętrznymi poprzez **dane logowania**. Każdy typ danych logowania przechowuje szczegóły połączenia dla jednej usługi i może być wielokrotnie wykorzystywany w wielu węzłach i workflow. Przegląd znajduje się w sekcji [Dane logowania](./credentials.md).

Dane logowania dodaje się w [Ustawienia → Dane logowania](../tabs/credentials-tab.md). Wszystkie wartości są szyfrowane w stanie spoczynku. Dane logowania można [udostępniać](./credentials-sharing.md) innym użytkownikom lub [Zespołom](./teams.md).

Niektóre węzły integracyjne **nie** wymagają danych logowania. [WebSocket Trigger](../nodes/websocket-trigger-node.md) oraz [WebSocket Send](../nodes/websocket-send-node.md) łączą się z zewnętrznymi gniazdami przy użyciu adresu URL, nagłówków i subprotokołów skonfigurowanych bezpośrednio w węźle.

## Typy danych logowania w skrócie

| Typ | Wykorzystywany przez | Kluczowe pola |
|------|---------|------------|
| **OpenAI** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md) | `api_key` |
| **OpenAI Codex** | [Codex](../nodes/codex-node.md) | `access_token` |
| **OpenCode Go** | [OpenCode Go](../nodes/opencode-go-node.md) | `api_key`, opcjonalnie `base_url` |
| **Google** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key` |
| **GitHub** | [GitHub](../nodes/github-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) | `api_key`, opcjonalnie `base_url` |
| **Jira** | [Węzeł Jira](../nodes/jira-node.md) | `api_token`, `base_url`, `deployment`, `auth_mode`, `email` (tylko Basic auth), opcjonalnie `api_version` |
| **Linear** | [Węzeł Linear](../nodes/linear-node.md) | `api_key` lub `client_id` + `client_secret` OAuth2 |
| **Sentry** | [Węzeł Sentry](../nodes/sentry-node.md) | `api_token`, opcjonalnie `base_url` |
| **Custom** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key`, `base_url` |
| **Decision Model** | [Decision](../nodes/decision-node.md), [Ewaluacja](../tabs/evals-tab.md) (sędzia LLM-as-Judge) | `base_url`, opcjonalnie `api_key` |
| **Model Router (Auto Model)** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, Domyślne ustawienia AI | dane logowania modelu decyzyjnego oraz opcje modeli odwołujące się do pozostałych danych logowania |
| **Cohere** | Embeddings | `api_key` |
| **RAG: Qdrant + OpenAI** | [RAG](../nodes/rag-node.md), Magazyny wektorowe | `qdrant_host`, `openai_api_key` |
| **RAG: Psql + OpenAI** | [RAG](../nodes/rag-node.md), Magazyny wektorowe | `openai_api_key` (wektory przechowywane we własnym Postgresie Heym za pomocą pgvector) |
| **RAG: Custom Embeddings** | [RAG](../nodes/rag-node.md), Magazyny wektorowe | `embedding_base_url`, `embedding_model`, `embedding_dimensions`, `db_type`, opcjonalnie `embedding_api_key` oraz `qdrant_host`, gdy `db_type` ma wartość `qdrant` |
| **Grist** | [Węzeł Grist](../nodes/grist-node.md) | `api_key`, `server_url` |
| **Google Sheets** | [Węzeł Google Sheets](../nodes/google-sheets-node.md) | `client_id`, `client_secret` + zgoda OAuth2 |
| **Google Drive** | [Węzeł Google Drive](../nodes/google-drive-node.md) | `client_id`, `client_secret` + zgoda OAuth2 (pełny zakres Drive) |
| **BigQuery** | [Węzeł BigQuery](../nodes/bigquery-node.md) | `client_id`, `client_secret` + zgoda OAuth2 |
| **Supabase** | [Węzeł Supabase](../nodes/supabase-node.md) | `supabase_url`, `supabase_key`, opcjonalnie `supabase_schema` |
| **ClickHouse** | [Węzeł ClickHouse](../nodes/clickhouse-node.md) | `host`, `port`, `username`, `password`, `database`, `secure` |
| **Notion** | [Węzeł Notion](../nodes/notion-node.md) | `api_token` lub `client_id` + `client_secret` OAuth |
| **Amazon S3** | [Węzeł Amazon S3](../nodes/amazon-s3-node.md) | `aws_access_key_id`, `aws_secret_access_key`, `aws_region` |
| **SMTP** | [Send Email](../nodes/send-email-node.md) | `host`, `port`, `email`, `password` |
| **IMAP** | [Węzeł IMAP Trigger](../nodes/imap-trigger-node.md) | `imap_host`, `imap_port`, `imap_username`, `imap_password` |
| **Telegram** | [Węzeł Telegram Trigger](../nodes/telegram-trigger-node.md), [Węzeł Telegram](../nodes/telegram-node.md) | `bot_token`, opcjonalnie `secret_token` |
| **Discord** | [Węzeł Discord](../nodes/discord-node.md) | `webhook_url` |
| **Discord Trigger** | [Węzeł Discord Trigger](../nodes/discord-trigger-node.md) | `public_key` |
| **RabbitMQ** | [Węzeł RabbitMQ](../nodes/rabbitmq-node.md) | `rabbitmq_host`, `rabbitmq_username`, `rabbitmq_password` |
| **Redis** | [Węzeł Redis](../nodes/redis-node.md) | `host`, `port`, `password` |
| **Slack** | [Węzeł Slack](../nodes/slack-node.md) | `webhook_url` |
| **Slack Trigger** | [Węzeł Slack Trigger](../nodes/slack-trigger-node.md) | `signing_secret` |
| **Bearer** | [Węzeł HTTP](../nodes/http-node.md) | `token` |
| **Header** | [Węzeł HTTP](../nodes/http-node.md) | `header_key`, `header_value` |
| **FlareSolverr** | [Węzeł Crawler](../nodes/crawler-node.md) | `flaresolverr_url` |

---

## GitHub

Dane logowania GitHub przechowują osobisty token dostępu GitHub (PAT), dzięki czemu workflow mogą wywoływać GitHub REST API poprzez [węzeł GitHub](../nodes/github-node.md), przekazywać token do serwerów MCP, takich jak `@modelcontextprotocol/server-github`, lub używać go z [węzła HTTP](../nodes/http-node.md) do niestandardowych wywołań REST.

### Wymagane pola

| Pole | Opis |
|-------|-------------|
| `api_key` | Osobisty token dostępu GitHub (szczegółowy PAT `github_pat_...` lub klasyczny PAT `ghp_...`) |
### Opcjonalne pola

| Pole | Opis |
|-------|-------------|
| `base_url` | Bazowy adres URL API GitHub dla GitHub Enterprise Server (na przykład `https://github.example.com/api/v3`) |

### Uwagi

- Zaleca się stosowanie precyzyjnych osobistych tokenów dostępu (fine-grained personal access tokens), gdy jest to możliwe, ponieważ można ograniczyć ich zakres do konkretnych repozytoriów i uprawnień.
- Pole `base_url` należy pozostawić puste dla GitHub.com. W przypadku GitHub Enterprise Server należy użyć pełnego endpointu REST API wraz z `/api/v3` (na przykład `https://github.example.com/api/v3`), a nie głównego adresu interfejsu webowego serwera, takiego jak `https://github.example.com`.
- Dane logowania obecnie obsługują wyłącznie uwierzytelnianie oparte na PAT. Aby uzyskać dostęp do repozytoriów organizacji, należy użyć PAT, któremu przyznano wymagane uprawnienia organizacji/repozytorium.
- Tokeny instalacyjne GitHub App oraz przepływy konfiguracji GitHub App nie są obecnie obsługiwane w sposób natywny w interfejsie Heym.
- W przypadku natywnych operacji na repozytoriach, użytkownikach, zgłoszeniach, pull requestach, recenzjach, wydaniach, workflow Actions, ruchu i plikach zaleca się korzystanie z [węzła GitHub](../nodes/github-node.md). [Węzeł HTTP](../nodes/http-node.md) należy stosować tylko wtedy, gdy potrzebne są endpointy lub payloady nieobsługiwane przez węzeł GitHub.
- W przypadku korzystania z MCP należy użyć [węzła Agent](../nodes/agent-node.md), przekazując `$credentials.YourGitHubCredential` do zmiennej środowiskowej połączenia MCP, takiej jak `GITHUB_PERSONAL_ACCESS_TOKEN`.
- REST API GitHub zazwyczaj oczekuje nagłówka `Authorization: Bearer <token>` oraz `Accept: application/vnd.github+json`.
- Podczas edycji danych logowania GitHub pozostawienie pustego pola `base_url` dla GitHub Enterprise zachowuje istniejący endpoint. Nowy adres URL należy wprowadzić tylko wtedy, gdy zamierzasz zmienić ten endpoint.

### Używane przez

- [Węzeł GitHub](../nodes/github-node.md)
- [Węzeł Codex](../nodes/codex-node.md)
- [Węzeł Agent](../nodes/agent-node.md)
- [Węzeł HTTP](../nodes/http-node.md)

---

## Model decyzyjny

Model decyzyjny odpowiada na typowane pytania dotyczące stanu i zwraca prawdopodobieństwa zamiast tekstu. Jev firmy TypeSafe jest implementacją referencyjną; każdy endpoint akceptujący to samo ciało żądania `{model, state, questions}` będzie działać, a [węzeł Decision](../nodes/decision-node.md) może wysłać ręcznie napisane ciało żądania dla endpointu, który tego nie obsługuje.

### Wymagane pola

- `base_url` – endpoint, na przykład `https://api.typesafe.ai`. Heym dołącza `/v1/systemone`.

### Opcjonalne pola

- `api_key` – wysyłany jako `Authorization: Bearer`. Endpointy, które nie wymagają klucza, mogą pozostawić to pole puste.

### Uwagi

- **Test Connection** wysyła jedno krótkie pytanie w celu potwierdzenia, że endpoint i klucz działają.
- Edycja danych logowania zachowuje zapisany klucz, gdy pole klucza pozostanie puste.
- Wychodzące żądania do prywatnych adresów i adresów loopback są domyślnie blokowane, więc samodzielnie hostowany endpoint na `localhost` lub w zakresie prywatnym wymaga ustawienia `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.
- Te modele nie występują w tabelach cenowych LLM synchronizowanych przez Heym, dlatego kolumna Cost w [Wykonaniach](../tabs/traces-tab.md) pozostaje pusta. Liczba tokenów jest jednak nadal rejestrowana.

### Używane przez

- [Decision](../nodes/decision-node.md)
- [Ewaluacja](../tabs/evals-tab.md) – ocenia odpowiedzi `LLM-as-Judge` względem oczekiwanego wyniku

## OpenAI Codex

Dane logowania OpenAI Codex uwierzytelniają [węzeł Codex](../nodes/codex-node.md). Są one oddzielne od danych logowania klucza API OpenAI używanych przez węzły LLM, Agent i RAG.

### Tryby uwierzytelniania

| Tryb | Opis |
|------|-------------|
| **Sign in with ChatGPT** (zalecane) | Logowanie OAuth (PKCE) wykorzystujące subskrypcję ChatGPT Plus/Pro, dzięki czemu wykonania pozwalają uniknąć kosztów API naliczanych za token. Heym przechowuje i automatycznie odświeża pakiet tokenów. |
| **Access token** | Token `access_token` ChatGPT/Codex przekazywany wyłącznie do lokalnego procesu Codex CLI. |

### Uwagi

- Klucze API są odrzucane dla tego typu danych logowania.
- Tokeny Codex nie są udostępniane przez `$credentials.Name`.
- Węzeł Codex wymaga również danych logowania GitHub do klonowania repozytorium, wypychania gałęzi i tworzenia szkiców pull requestów.

### Używane przez

- [Węzeł Codex](../nodes/codex-node.md)

## OpenCode Go

Dane logowania OpenCode Go uwierzytelniają [węzeł OpenCode Go](../nodes/opencode-go-node.md). Przechowują klucz API bramy OpenCode Go (z [opencode.ai/go](https://opencode.ai/go)) oraz opcjonalny bazowy adres URL bramy.

### Pola

| Pole | Opis |
|-------|-------------|
| **API Key** | Klucz API bramy OpenCode Go (wymagany). |
| **Gateway Base URL** | Opcjonalne; domyślnie `https://opencode.ai/zen/go/v1`. Należy zmienić tylko w przypadku samodzielnie hostowanej bramy lub bramy pośredniczącej. |

### Uwagi

- Klucz API jest przekazywany wyłącznie do procesu OpenCode CLI wewnątrz wzmocnionego kontenera.
- Węzeł OpenCode Go wymaga również danych logowania GitHub do klonowania repozytorium, wypychania gałęzi i tworzenia pull requestów. Token GitHub nigdy nie jest umieszczany wewnątrz kontenera sandbox.

### Używane przez

- [Węzeł OpenCode Go](../nodes/opencode-go-node.md)

---

## Linear

Dane logowania Linear obsługują osobisty klucz API lub OAuth2 dla [węzła Linear](../nodes/linear-node.md). Heym wysyła natywne zapytania GraphQL do Linear w celu pobrania metadanych przestrzeni roboczej, projektów, zgłoszeń i komentarzy.
### Konfiguracja

Należy wybrać jeden tryb uwierzytelniania:

**Osobisty klucz API**

1. W Linear należy otworzyć **Settings → Security & Access → Personal API keys**.
2. Utworzyć klucz z dostępem do workspace, który ma być automatyzowany.
3. Wkleić klucz do danych logowania Linear w Heym i użyć **Test Connection**, aby go zweryfikować.

**OAuth2**

1. Utworzyć aplikację Linear OAuth.
2. Zarejestrować `{FRONTEND_URL}/api/credentials/linear/oauth/callback` jako redirect URI.
3. W Heym Dashboard → **Credentials** → **New** → typ **Linear**.
4. Wybrać **OAuth2**, wprowadzić Client ID i Client Secret, a następnie kliknąć **Connect**.

### Wymagane pola

| Tryb | Pole | Opis |
|------|-------|-------------|
| Osobisty klucz API | `api_key` | Osobisty klucz API Linear, zwykle z prefiksem `lin_api_` |
| OAuth2 | `client_id` | Client ID z aplikacji Linear OAuth |
| OAuth2 | `client_secret` | Client Secret z aplikacji Linear OAuth |

Tokeny OAuth (`access_token`, `refresh_token`, `token_expiry`) są przechowywane i odświeżane automatycznie.

### Uwagi

- Osobiste klucze API i tokeny OAuth działają jako użytkownik Linear, który je utworzył lub autoryzował.
- Linear OAuth używa zakresów `read,write,issues:create,comments:create`.
- Aby zweryfikować klucz API lub token OAuth względem API Linear, należy użyć **Test Connection** w oknie danych logowania.
- Aby odkryć UUID przed tworzeniem lub filtrowaniem zgłoszeń, należy użyć List Teams i List Projects w węźle Linear.
- Aby odkryć UUID stanów i osób przypisanych do aktualizacji, należy użyć List Workflow States i List Team Members.
- Aby wymienić klucz API, należy edytować dane logowania i wprowadzić nową wartość. W przypadku wymiany sekretów aplikacji OAuth należy ponownie połączyć dane logowania za pomocą **Connect**.

### Używane przez

- [Węzeł Linear](../nodes/linear-node.md)

---

## Jira

Dane logowania Jira przechowują poświadczenia Jira Basic auth lub osobisty token dostępu Data Center (PAT), bazowy adres URL witryny Jira, tryb wdrożenia oraz opcjonalną wersję REST API dla [węzła Jira](../nodes/jira-node.md). Należy użyć `cloud` dla Jira Cloud lub `data_center` dla Jira Data Center / Server.

### Konfiguracja

**Jira Cloud**

1. W ustawieniach konta Atlassian należy utworzyć token API.
2. W Heym Dashboard → **Credentials** → **New** → typ **Jira**.
3. Wprowadzić adres e-mail Atlassian, token API oraz adres URL witryny Jira, taki jak `https://your-domain.atlassian.net`.
4. Użyć **Test Connection**, aby zweryfikować dane logowania.

**Jira Data Center / Server**

1. Wybierz **Jira Data Center / Server** jako wdrożenie.
2. Wybierz metodę uwierzytelniania. **Nazwa użytkownika i hasło** korzysta z Basic auth. **Personal Access Token** używa `Authorization: Bearer <token>` i wymaga Jira Data Center / Server w wersji 8.14 lub nowszej. Utwórz token w **Profil → Personal Access Tokens** w Jira.
3. Wprowadź nazwę użytkownika i hasło Jira lub wklej osobisty token dostępu (nazwa użytkownika nie jest wymagana).
4. Wprowadź adres URL witryny Jira, na przykład `https://jira.example.com`.
5. Użyj **Test Connection**, aby zweryfikować poświadczenie.

### Pola

| Pole | Opis |
| --- | --- |
| `auth_mode` | `basic` (domyślnie w przypadku braku) lub `pat`. Wartość `pat` jest prawidłowa tylko z `data_center` |
| `email` | Adres e-mail konta Atlassian Jira Cloud lub nazwa użytkownika Jira Data Center / Server. Nieużywane w trybie `pat` |
| `api_token` | Token API Atlassian Jira Cloud, hasło Jira Data Center / Server dla Basic auth lub osobisty token dostępu Data Center w trybie `pat` |
| `base_url` | Bazowy adres URL witryny Jira |
| `deployment` | `cloud` dla Jira Cloud lub `data_center` dla Jira Data Center / Server |
| `api_version` | Wersja REST API; domyślnie `3` dla Jira Cloud. Data Center / Server używa v2 |

### Uwagi

- Węzeł Jira wysyła opisy zgłoszeń i komentarze jako dokumenty tekstowe w formacie Atlassian Document Format dla Jira Cloud REST API v3. Dane logowania Data Center / Server wysyłają zwykły tekst.
- Data Center / Server obsługuje uwierzytelnianie Basic auth (nazwa użytkownika/hasło) oraz uwierzytelnianie za pomocą osobistego tokena dostępu (PAT) ze schematem Bearer. Uwierzytelnianie PAT wymaga Jira Data Center / Server w wersji 8.14 lub nowszej.
- Przesyłanie załączników akceptuje zawartość base64 lub data URL i podlega limitowi rozmiaru pliku platformy (domyślnie 99 MB). Pobieranie załączników może zwracać zawartość base64, gdy jest włączone.
- Tworzenie i usuwanie użytkowników oraz powiadomienia o zgłoszeniach wymagają, aby uwierzytelnione konto Jira miało odpowiednie uprawnienia w witrynie lub organizacji Jira.
- Aby odkryć klucze projektów, klucze zgłoszeń i identyfikatory przejść, należy użyć List Projects, Search Issues i List Transitions.
- W przypadku niestandardowych endpointów nieobsługiwanych przez węzeł Jira użyj [węzła HTTP](../nodes/http-node.md) z Jira Basic Auth (`email:api_token` dla Cloud lub `username:password` dla Data Center / Server) lub PAT Bearer auth (`Authorization: Bearer <token>` dla Data Center / Server). Alternatywnie użyj poświadczenia Header z odpowiednim nagłówkiem `Authorization`.

- [Węzeł Jira](../nodes/jira-node.md)
- [Dane logowania](./credentials.md)

---

## Sentry

Dane logowania Sentry przechowują token uwierzytelniający dla [węzła Sentry](../nodes/sentry-node.md). Heym używa REST API Sentry do operacji na organizacjach, projektach, zespołach, zgłoszeniach, zdarzeniach i wydaniach.

### Wymagane pola

| Pole | Opis |
|-------|-------------|
| `api_token` | Token uwierzytelniający Sentry z dostępem do automatyzowanych organizacji i projektów |

### Pola opcjonalne

| Pole | Opis |
|-------|-------------|
| `base_url` | Opcjonalny główny adres URL dla samodzielnie hostowanego Sentry, na przykład `https://sentry.example.com` |

### Uwagi

- W przypadku Sentry SaaS należy pozostawić `base_url` puste.
- Aby potwierdzić, że token może wyświetlać widoczne organizacje, należy użyć **Test Connection**.
- W przypadku niestandardowych wywołań REST należy użyć `$credentials.YourSentryCredential` jako tokenu bearer.

### Używane przez

- [Węzeł Sentry](../nodes/sentry-node.md)

---

## Qdrant

[Qdrant](https://qdrant.tech) to open-source'owa baza danych wektorowych używana do wyszukiwania semantycznego i RAG (Retrieval Augmented Generation).

### Wymagane pola

| Pole | Opis |
|-------|-------------|
| `qdrant_host` | Pełny adres URL instancji Qdrant (np. `http://localhost:6333` lub endpoint w chmurze) |
| `openai_api_key` | Klucz API OpenAI używany do generowania embeddingów podczas indeksowania i wyszukiwania dokumentów |
### Uwagi

- Kolekcje Qdrant są zarządzane z poziomu zakładki [Magazyny wektorowe](../tabs/vectorstores-tab.md). Każdy magazyn wektorów odpowiada jednej kolekcji Qdrant.
- [Węzeł RAG](../nodes/rag-node.md) korzysta z magazynu wektorów (który odwołuje się do danych logowania Qdrant) — nie odwołuje się bezpośrednio do danych logowania.
- Jeśli instancja Qdrant wymaga klucza API, należy dołączyć go do wartości `qdrant_host` lub odpowiednio skonfigurować Qdrant; obecna integracja nie posiada osobnego pola na klucz API Qdrant.
- Samodzielnie hostowany Qdrant: należy użyć [oficjalnego obrazu Docker](https://hub.docker.com/r/qdrant/qdrant) i udostępnić port `6333`.

### Używane przez

- [Węzeł RAG](../nodes/rag-node.md) (poprzez magazyn wektorów)
- [Zakładka Magazyny wektorowe](../tabs/vectorstores-tab.md)

## Niestandardowe embeddingi (RAG)

Domyślnie embeddingi RAG pochodzą z OpenAI. Dane logowania **RAG: Custom Embeddings**
wskazują natomiast dowolny endpoint embeddingów zgodny z OpenAI — Ollama, vLLM, Text
Embeddings Inference, LM Studio, Together lub hostowaną bramę — i określają magazyn
wektorów, do którego zapisują.

### Wymagane pola

| Pole | Opis |
|-------|-------------|
| `embedding_base_url` | Adres URL endpointu wraz ze ścieżką `/v1`, np. `http://localhost:11434/v1` |
| `embedding_api_key` | Opcjonalne. Lokalne serwery zwykle nie wymagają klucza |
| `embedding_model` | Nazwa modelu w formie oczekiwanej przez endpoint, np. `nomic-embed-text` |
| `embedding_dimensions` | Szerokość wektora zwracana przez model (domyślnie `1536`) |
| `embedding_request_dimensions` | Opcjonalne. Żądanie zwrócenia przez endpoint wartości `embedding_dimensions` zamiast natywnej szerokości modelu |
| `db_type` | `qdrant` lub `pgvector` |
| `qdrant_host`, `qdrant_port`, `qdrant_api_key` | Połączenie z Qdrant, wymagane gdy `db_type` ma wartość `qdrant` |

### Uwagi

- **Qdrant akceptuje dowolną liczbę wymiarów.** Każda kolekcja jest tworzona z szerokością
  zadeklarowaną w tych danych logowania, więc pole Dimensions można swobodnie edytować.
- **Postgres (pgvector) wymaga dokładnie 1536 wymiarów.** Jego kolumna ma stały typ
  `vector(1536)`, więc pole Dimensions jest zablokowane na wartości 1536, a dane logowania
  deklarujące inną szerokość są odrzucane w momencie zapisu.
- **Skracanie dla pgvector.** Gdy magazynem jest Postgres, okno dialogowe oferuje opcję *Ask the
  endpoint to return 1536 dimensions*. Powoduje ona wysłanie parametru żądania `dimensions`,
  który modele trenowane z reprezentacjami Matryoshka (OpenAI `text-embedding-3-*`,
  `nomic-embed-text-v1.5`, `jina-v3` i podobne) respektują, zwracając skrócony,
  wciąż znaczący wektor. Endpointy, które nie obsługują tego parametru, odrzucają
  żądanie, a endpointy, które go akceptują, ale ignorują, zwracają czytelny błąd
  wskazujący faktycznie zwróconą szerokość. Heym nigdy samodzielnie nie obcina wektorów,
  ponieważ dzielenie wyników modelu innego niż Matryoshka po cichu pogarsza jakość wyszukiwania.
  Opcja nie jest oferowana dla Qdrant, który może dopasować rozmiar kolekcji do dowolnej szerokości.
- Aby przed utworzeniem magazynu sprawdzić szerokość faktycznie zwracaną przez model, należy
  użyć przycisku **Test Connection** w oknie dialogowym danych logowania, który osadza ciąg
  testowy.
- Parametr żądania `dimensions` jest wysyłany wyłącznie do samego OpenAI, ponieważ większość
  serwerów zgodnych z OpenAI odrzuca nieznane parametry. Natywna szerokość modelu jest
  natomiast weryfikowana względem danych logowania.
- Istniejące dane logowania **RAG: Qdrant + OpenAI** oraz **RAG: Psql + OpenAI**
  pozostają niezmienione i nadal działają.

### Używane przez

- [Węzeł RAG](../nodes/rag-node.md) (poprzez magazyn wektorów)
- [Zakładka Magazyny wektorowe](../tabs/vectorstores-tab.md)

## Postgres (pgvector)

Heym może również przechowywać wektory **wewnątrz własnej bazy danych Postgres** przy użyciu
rozszerzenia [pgvector](https://github.com/pgvector/pgvector) — bez konieczności korzystania
z zewnętrznej usługi wektorowej. Należy utworzyć dane logowania **RAG: Psql + OpenAI** i użyć
ich podczas tworzenia magazynu wektorów, a następnie wybrać **Postgres (pgvector)** w liście
rozwijanej Database węzła RAG.

### Wymagane pola

| Pole | Opis |
|-------|-------------|
| `openai_api_key` | Klucz API OpenAI używany do generowania embeddingów podczas indeksowania i wyszukiwania dokumentów |

### Uwagi

- Host/port nie są potrzebne — wektory są zapisywane we własnej bazie danych Heym; Heym nigdy nie łączy się z inną bazą danych.
- Każda funkcja RAG dostępna z Qdrant (wstawianie, wyszukiwanie, filtry metadanych, reranking Cohere, klonowanie, udostępnianie) działa identycznie z backendem Postgres.
- Wymaga rozszerzenia `vector`. Heym pozostawia oficjalny obraz `postgres:16` niezmieniony (dzięki czemu istniejące dane nigdy nie są naruszane) i **automatycznie instaluje pakiet `postgresql-16-pgvector` przy starcie** — obsługują to `run.sh`, `deploy.sh` oraz `run_e2e.sh`. Instalacja nie jest krytyczna: jeśli nie może zostać wykonana (np. brak sieci), RAG Qdrant nadal działa, a backend Postgres pozostaje nieaktywny (migracja pomija tabelę w sposób kontrolowany).
- W przypadku uruchamiania opublikowanego obrazu jednokontenerowego (`ghcr.io/heymrun/heym`) względem **własnego zewnętrznego Postgres** baza ta musi obsługiwać rozszerzenie `vector` (Heym nie może zainstalować go w bazie danych, którą nie zarządza). Bez niego tworzenie magazynu wektorów Postgres lub przesyłanie do niego zwraca czytelny komunikat, a RAG Qdrant działa dalej.

### Używane przez

- [Węzeł RAG](../nodes/rag-node.md) (poprzez magazyn wektorów)
- [Zakładka Magazyny wektorowe](../tabs/vectorstores-tab.md)

---

## Grist

[Grist](https://www.getgrist.com) to hybryda arkusza kalkulacyjnego i bazy danych obsługująca dane strukturalne oraz formuły. Dane logowania Grist umożliwiają Heym odczytywanie i zapisywanie dokumentów Grist.
### Wymagane pola

| Pole | Opis |
|-------|-------------|
| `api_key` | Klucz API Grist (znajduje się w **Profile → API Key** w instancji Grist) |
| `server_url` | Bazowy URL serwera Grist (np. `https://docs.getgrist.com` dla Grist Cloud lub URL własnej instancji self-hosted) |

### Uwagi

- [Węzeł Grist](../nodes/grist-node.md) wymaga w konfiguracji **Document ID** (z URL dokumentu Grist) oraz **Table ID** — nie są one częścią danych logowania.
- W przypadku własnej instancji Grist należy ustawić `server_url` na domenę tej instancji.
- Identyfikatory kolumn w Grist używają podkreśleń (np. `User_Name`), a nie etykiet wyświetlanych. Aby je odnaleźć, należy użyć operacji `listColumns`.

### Używane przez

- [Węzeł Grist](../nodes/grist-node.md)

---

## Google Sheets (OAuth2)

Dane logowania Google Sheets łączą Heym z API Google Sheets przy użyciu modelu OAuth2 „Bring Your Own App". Należy dostarczyć Client ID oraz Client Secret OAuth2 z Google Cloud, a następnie autoryzować dostęp przez okno popup w przeglądarce. Tokeny są odświeżane automatycznie w tle.

### Konfiguracja

1. Otwórz [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → wyszukaj i włącz **Google Sheets API**.
2. Przejdź do **Credentials** → **Create Credentials** → **OAuth client ID** → typ aplikacji **Web application**.
3. W sekcji **Authorized redirect URIs** dodaj: `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`
4. Skopiuj wygenerowane **Client ID** oraz **Client Secret**.
5. W Heym Dashboard → **Credentials** → **New** → typ **Google Sheets (OAuth2)**.
6. Wprowadź Client ID, Client Secret oraz nazwę, a następnie kliknij **Connect**, aby otworzyć okno zgody Google i autoryzować dostęp.

### Wymagane pola

| Pole | Opis |
|-------|-------------|
| `client_id` | OAuth2 Client ID z Google Cloud Console |
| `client_secret` | OAuth2 Client Secret z Google Cloud Console |

Tokeny (`access_token`, `refresh_token`, `token_expiry`) są przechowywane i odświeżane automatycznie — nie zarządza się nimi bezpośrednio.

### Uwagi

- Ekran zgody OAuth2 wymaga zakresu spreadsheets (`https://www.googleapis.com/auth/spreadsheets`).
- Heym używa refresh tokena do uzyskania nowych access tokenów przed ich wygaśnięciem (60-sekundowy bufor bezpieczeństwa).
- W przypadku rotacji Client Secret w Google Cloud Console należy ponownie połączyć dane logowania przyciskiem **Connect**.
- **Produkcja:** Należy ustawić backendową zmienną **`FRONTEND_URL`** na dokładny publiczny URL, który użytkownicy otwierają w przeglądarce (schemat + host, np. `https://heym.example.com`). Heym buduje redirect URI Google OAuth wyłącznie na podstawie tej wartości — **nie** ufa nagłówkom `Origin` ani `X-Forwarded-*` (kontrolowanym przez klienta). W Google Cloud Console należy zarejestrować `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback`.

### Używane przez

- [Węzeł Google Sheets](../nodes/google-sheets-node.md)

---

## Google Drive (OAuth2)

Dane logowania Google Drive łączą Heym z API Google Drive przy użyciu tego samego modelu OAuth2 „Bring Your Own App" co Google Sheets. Należy dostarczyć Client ID oraz Client Secret OAuth2 z Google Cloud, a następnie autoryzować dostęp przez okno popup w przeglądarce. Tokeny są odświeżane automatycznie w tle.

### Konfiguracja

1. Otwórz [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → wyszukaj i włącz **Google Drive API**.
2. Przejdź do **Credentials** → **Create Credentials** → **OAuth client ID** → typ aplikacji **Web application**.
3. W sekcji **Authorized redirect URIs** dodaj: `https://your-heym-domain/api/credentials/google-drive/oauth/callback`
4. Skopiuj wygenerowane **Client ID** oraz **Client Secret**.
5. W Heym Dashboard → **Credentials** → **New** → typ **Google Drive (OAuth2)**.
6. Wprowadź Client ID, Client Secret oraz nazwę, a następnie kliknij **Connect**, aby otworzyć okno zgody Google i autoryzować dostęp.

### Wymagane pola

| Pole | Opis |
|-------|-------------|
| `client_id` | OAuth2 Client ID z Google Cloud Console |
| `client_secret` | OAuth2 Client Secret z Google Cloud Console |

Tokeny (`access_token`, `refresh_token`, `token_expiry`) są przechowywane i odświeżane automatycznie — nie zarządza się nimi bezpośrednio.

### Zakres

Google Drive żąda **pełnego zakresu Drive** (`https://www.googleapis.com/auth/drive`).

Jest to wymagane, ponieważ węzeł operuje na plikach, które już są własnością użytkownika. Węższy zakres `drive.file` przyznaje dostęp wyłącznie do plików utworzonych przez samego klienta OAuth, co sprawiłoby, że operacje `listFolderFiles`, `updateFile`, `removeFile` oraz `removeFolder` nie widziałyby niczego z istniejącego Drive.

Ponieważ Client ID i Secret pochodzą z własnego projektu Google Cloud, wymagania dotyczące weryfikacji aplikacji Google dla tego zakresu dotyczą tego projektu, a nie Heym.

### Uwagi

- Heym używa refresh tokena do uzyskania nowych access tokenów przed ich wygaśnięciem (60-sekundowy bufor bezpieczeństwa).
- W przypadku rotacji Client Secret w Google Cloud Console należy ponownie połączyć dane logowania przyciskiem **Connect**.
- Dyski współdzielone są obsługiwane — węzeł ustawia `supportsAllDrives` przy każdym wywołaniu API.
- **Produkcja:** Należy ustawić backendową zmienną **`FRONTEND_URL`** na dokładny publiczny URL, który użytkownicy otwierają w przeglądarce. Heym buduje redirect URI Google OAuth wyłącznie na podstawie tej wartości — **nie** ufa nagłówkom `Origin` ani `X-Forwarded-*`. W Google Cloud Console należy zarejestrować `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback`.
- Przed udostępnieniem tych danych logowania zespołowi należy zapoznać się z [Credential Sharing](./credentials-sharing.md).

### Używane przez

- [Węzeł Google Drive](../nodes/google-drive-node.md)

---
## BigQuery (OAuth2)

Dane logowania BigQuery łączą Heym z API Google BigQuery w modelu OAuth2 „Bring Your Own App". Należy dostarczyć Client ID oraz Client Secret aplikacji OAuth2 z Google Cloud, a następnie autoryzować dostęp przez okno popup w przeglądarce. Tokeny są odświeżane automatycznie w tle.

### Konfiguracja

1. Otwórz [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → wyszukaj i włącz **BigQuery API**.
2. Przejdź do **Credentials** → **Create Credentials** → **OAuth client ID** → typ aplikacji **Web application**.
3. W sekcji **Authorized redirect URIs** dodaj: `https://your-heym-domain/api/credentials/bigquery/oauth/callback`
4. Skopiuj wygenerowane **Client ID** oraz **Client Secret**.
5. W Heym Dashboard → **Dane logowania** → **New** → typ **BigQuery (OAuth2)**.
6. Wprowadź Client ID, Client Secret oraz nazwę, a następnie kliknij **Connect**, aby otworzyć okno zgody Google i autoryzować dostęp.

### Wymagane pola

| Pole | Opis |
|-------|-------------|
| `client_id` | OAuth2 Client ID z Google Cloud Console |
| `client_secret` | OAuth2 Client Secret z Google Cloud Console |

Tokeny (`access_token`, `refresh_token`, `token_expiry`) są przechowywane i odświeżane automatycznie.

### Uwagi

- Ekran zgody OAuth2 wymaga zakresu BigQuery (`https://www.googleapis.com/auth/bigquery`).
- **Produkcja:** Ustaw backendową zmienną **`FRONTEND_URL`** na publiczny adres URL. Zarejestruj `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback` w Google Cloud Console.

### Używane przez

- [Węzeł BigQuery](../nodes/bigquery-node.md)

---

## Supabase

Dane logowania Supabase łączą Heym z API PostgREST projektu Supabase, dzięki czemu workflow mogą odpytywać i modyfikować tabele oparte na Postgresie.

### Wymagane pola

| Pole | Opis |
|-------|-------------|
| `supabase_url` | Bazowy adres URL projektu, na przykład `https://your-project.supabase.co` |
| `supabase_key` | Klucz API z dostępem do docelowych tabel |
| `supabase_schema` | Opcjonalny domyślny schemat (domyślnie `public`) |

### Uwagi

- [Węzeł Supabase](../nodes/supabase-node.md) komunikuje się z `/rest/v1/<table>` i obsługuje filtry operatorowe (`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `is`, `in` oraz powiązane operatory PostgREST), a także zagnieżdżone grupy logiczne `or` / `and`.
- W przypadku operacji zapisu należy preferować klucz przeznaczony do zaufanego użycia po stronie serwera, z minimalnymi wymaganymi uprawnieniami do tabel.
- Węzły mogą nadpisać schemat dla danego kroku, nawet jeśli dane logowania definiują schemat domyślny.

### Używane przez

- [Węzeł Supabase](../nodes/supabase-node.md)

## ClickHouse

Dane logowania ClickHouse łączą Heym z zewnętrzną bazą danych ClickHouse przez jej interfejs HTTP, dzięki czemu workflow mogą wykonywać operacje SQL, CRUD oraz zliczania na tabelach OLAP.

### Wymagane pola

| Pole | Opis |
|-------|-------------|
| `host` | Host HTTP bez schematu, na przykład `your-instance.clickhouse.cloud` |
| `port` | Port interfejsu HTTP (`8443` dla HTTPS, `8123` dla HTTP) |
| `username` | Użytkownik ClickHouse (domyślnie `default`) |
| `password` | Hasło użytkownika (opcjonalne) |
| `database` | Docelowa baza danych (domyślnie `default`) |
| `secure` | Użyj HTTPS, gdy `true` (wymagane dla ClickHouse Cloud) |

### Uwagi

- [Węzeł ClickHouse](../nodes/clickhouse-node.md) korzysta z oficjalnego klienta HTTP `clickhouse-connect` i parametryzuje powiązania filtrów oraz wartości.
- `update` i `remove` mapują się na `ALTER TABLE ... UPDATE` oraz `DELETE FROM`, które są asynchronicznymi mutacjami ClickHouse; obie wymagają filtra.
- `upsert` wykonuje `INSERT` i zakłada tabelę `ReplacingMergeTree` dla zachowania merge-on-key.
- Użyj opcji **Test connection** w oknie danych logowania, aby zweryfikować osiągalność.

### Używane przez

- [Węzeł ClickHouse](../nodes/clickhouse-node.md)

## Notion

Dane logowania Notion obsługują zarówno token integracji wewnętrznej, jak i połączenie OAuth integracji publicznej. OAuth pozwala każdemu użytkownikowi autoryzować workspace Notion z poziomu Heym, zamiast ręcznego kopiowania tokenu.

### Wymagane pola

| Tryb | Pole | Opis |
|------|-------|-------------|
| Token wewnętrzny | `api_token` | Token integracji wewnętrznej (`ntn_...`) |
| OAuth | `client_id` | Client ID z publicznej integracji Notion |
| OAuth | `client_secret` | Client Secret z publicznej integracji Notion |

Callback OAuth automatycznie zapisuje `access_token`, `auth_mode`, `workspace_id`, `workspace_name` oraz `bot_id`. Wszelkie wcześniejsze wewnętrzne `api_token` są usuwane po zakończeniu OAuth. Zarejestruj ten redirect URI w Notion:
`{FRONTEND_URL}/api/credentials/notion/oauth/callback`.

### Przebieg konfiguracji OAuth

1. Wybierz **OAuth** w oknie danych logowania, wprowadź nazwę, Client ID oraz Client Secret.
2. Kliknij **Connect** i autoryzuj workspace w oknie popup Notion.
   - Dla **nowych** danych logowania Heym tworzy rekord danych logowania po kliknięciu **Connect**.
   - Dokończ autoryzację w oknie popup, a następnie kliknij **Save**, aby powrócić do listy danych logowania.
3. Połączone dane logowania wyświetlają `connected (Workspace Name)` na liście. Oczekujące dane logowania OAuth wyświetlają `Not connected` do momentu zakończenia autoryzacji.

Użyj opcji **Test Connection** w oknie danych logowania, aby zweryfikować token wewnętrzny lub zakończoną autoryzację OAuth. Podczas edycji pozostawienie pola tokenu pustego zachowuje zapisany token wewnętrzny.

Zarówno tokeny wewnętrzne, jak i tokeny dostępu OAuth są dostępne przez `$credentials.CredentialName` dla niestandardowych wywołań [HTTP](../nodes/http-node.md), które wymagają tokenu bearer Notion.
### Uwagi

- Integracje wewnętrzne wymagają udostępnienia odpowiednich stron, baz danych i źródeł danych.
- Użytkownicy OAuth wybierają przestrzeń roboczą/strony podczas autoryzacji Notion.
- Dane logowania aplikacji OAuth są szyfrowane wewnątrz danych logowania Notion. Callback ładuje je ponownie po stronie serwera; sekret nie jest osadzany w stanie OAuth.
- Połączone dane logowania OAuth wyświetlają nazwę przestrzeni roboczej; oczekujące dane logowania OAuth pokazują `Not connected` do momentu zakończenia autoryzacji.
- **Produkcja:** Należy ustawić backendową zmienną **`FRONTEND_URL`** na publiczny adres URL przeglądarki (schemat + host, bez końcowego ukośnika). URI przekierowania Notion musi być zgodny dokładnie:
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback`.
- Węzeł używa wersji API `2026-03-11` oraz aktualnej terminologii `data_source`. Wskazówki dotyczące migracji ze starszych przykładów `archived`, `after` lub zapytań do bazy danych znajdują się w artykule
  [Węzeł Notion](../nodes/notion-node.md#api-version-notes).
- Stare filtry wyszukiwania z wartością obiektu `database` są normalizowane do `data_source`.

### Używane przez

- [Węzeł Notion](../nodes/notion-node.md)

---

## SMTP (Email)

Dane logowania SMTP przechowują szczegóły połączenia z serwerem poczty e-mail służące do wysyłania poczty wychodzącej.

### Wymagane pola

| Pole | Opis |
|-------|-------------|
| `host` | Nazwa hosta serwera SMTP (np. `smtp.gmail.com`) |
| `port` | Port SMTP (zazwyczaj `587` dla STARTTLS, `465` dla SSL) |
| `email` | Nazwa użytkownika, której serwer SMTP używa do logowania; również widoczny nadawca, gdy pole `from` jest puste |
| `password` | Hasło SMTP lub hasło aplikacji |

### Pola opcjonalne

| Pole | Opis |
|-------|-------------|
| `from` (`smtp_from`) | Widoczny adres nadawcy (From). Pozostaw puste, aby wysyłać jako `email`. Serwer nadal loguje się jako `email`, więc to konto musi mieć uprawnienia do wysyłania z tego adresu (w Gmailu zweryfikowany alias **Wyślij pocztę jako**). |

### Popularni dostawcy SMTP

| Dostawca | Host | Port | Uwagi |
|----------|------|------|-------|
| Gmail | `smtp.gmail.com` | `587` | Wymaga [hasła aplikacji](https://support.google.com/accounts/answer/185833) (weryfikacja dwuetapowa musi być włączona) |
| Outlook / Office 365 | `smtp.office365.com` | `587` | Należy użyć danych logowania konta Microsoft |
| Mailgun | `smtp.mailgun.org` | `587` | Należy użyć danych logowania SMTP Mailgun z ustawień domeny |
| SendGrid | `smtp.sendgrid.net` | `587` | Należy użyć `apikey` jako nazwy użytkownika i klucza API jako hasła |
| Własny / hostowany samodzielnie | własna domena | `587` / `465` | Postfix, Exim itp. |

### Uwagi

- Gmail wymaga **hasła aplikacji** zamiast zwykłego hasła, gdy włączona jest weryfikacja dwuetapowa.
- Port `587` używa STARTTLS (rozpoczyna jako tekst jawny, przechodzi na TLS). Port `465` używa niejawnego TLS (SSL od początku).

### Używane przez

- [Węzeł Send Email](../nodes/send-email-node.md)

---

## IMAP (poczta przychodząca)

Dane logowania IMAP przechowują szczegóły połączenia służące do monitorowania skrzynki odbiorczej za pomocą [węzła IMAP Trigger](../nodes/imap-trigger-node.md).

### Wymagane pola

| Pole | Opis |
|-------|-------------|
| `imap_host` | Nazwa hosta serwera IMAP (na przykład `imap.gmail.com`) |
| `imap_port` | Port IMAP (`993` dla SSL/TLS u większości dostawców) |
| `imap_username` | Nazwa użytkownika skrzynki lub pełny adres e-mail |
| `imap_password` | Hasło lub hasło aplikacji specyficzne dla dostawcy |

### Pola opcjonalne

| Pole | Opis |
|-------|-------------|
| `imap_mailbox` | Folder skrzynki do monitorowania (domyślnie: `INBOX`) |
| `imap_use_ssl` | Włączenie SSL/TLS (zalecane; domyślnie: `true`) |

### Uwagi

- Trigger IMAP przy pierwszym odpytaniu ustala stan bieżący skrzynki, a następnie przetwarza wyłącznie nowsze wiadomości.
- Gmail, Microsoft 365 i inni dostawcy hostowani często wymagają **hasła aplikacji** lub podobnego sekretu specyficznego dla IMAP.
- Zawartość załączników nie jest pobierana do payloadu workflow; Heym udostępnia wyłącznie metadane załączników.

### Używane przez

- [Węzeł IMAP Trigger](../nodes/imap-trigger-node.md)
- [Triggery](./triggers.md) (IMAP jako trigger workflow)

---

## RabbitMQ

[RabbitMQ](https://www.rabbitmq.com) to otwartoźródłowy broker wiadomości. Dane logowania RabbitMQ przechowują szczegóły połączenia służące do publikowania do kolejek i wymian oraz konsumowania z nich.

### Wymagane pola

| Pole | Opis |
|-------|-------------|
| `rabbitmq_host` | Adres URL połączenia AMQP (np. `amqp://localhost:5672`) |
| `rabbitmq_username` | Nazwa użytkownika RabbitMQ (domyślnie: `guest`) |
| `rabbitmq_password` | Hasło RabbitMQ (domyślnie: `guest`) |

### Hosty wirtualne

Aby połączyć się z konkretnym hostem wirtualnym, należy uwzględnić go w adresie URL `rabbitmq_host`:

```
amqp://username:password@hostname:5672/vhost
```

W przypadku korzystania z domyślnego vhosta ścieżkę `/` można pominąć.

### Wtyczka opóźnionych wiadomości

[Węzeł RabbitMQ](../nodes/rabbitmq-node.md) obsługuje wtyczkę **rabbitmq_delayed_message_exchange**. Gdy wtyczka jest włączona na serwerze RabbitMQ, można ustawić opóźnienie (w milisekundach) dla wiadomości wychodzących za pomocą pola `rabbitmqDelayMs` w węźle.

Węzeł ustawia nagłówek `x-delay` na publikowanej wiadomości. Typ wymiany musi wynosić `x-delayed-message`, aby opóźnienia działały.

Aby włączyć wtyczkę na samodzielnie hostowanej instancji RabbitMQ:

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

Gdy wtyczka nie jest zainstalowana, nagłówek `x-delay` jest ignorowany, a wiadomości są dostarczane natychmiast.

### Używane przez

- [Węzeł RabbitMQ](../nodes/rabbitmq-node.md)
- [Triggery](./triggers.md) (RabbitMQ jako trigger workflow)

---

## Amazon S3

Dane logowania Amazon S3 łączą Heym z [Amazon S3](https://aws.amazon.com/s3/). Należy ich używać z [węzłem Amazon S3](../nodes/amazon-s3-node.md) do zarządzania bucketami i folderami, przesyłania i pobierania obiektów, kopiowania kluczy oraz listowania i usuwania obiektów z poziomu workflow.
### Wymagane pola

| Pole | Opis |
|-------|-------------|
| `aws_access_key_id` | Identyfikator klucza dostępu AWS IAM |
| `aws_secret_access_key` | Tajny klucz dostępu powiązany z identyfikatorem klucza dostępu |
| `aws_region` | Region AWS, w którym znajdują się buckety (np. `us-east-1`) |

### Pola opcjonalne

| Pole | Opis |
|-------|-------------|
| `aws_session_token` | Tymczasowy token sesji w przypadku korzystania z danych logowania AWS STS |

### Uwagi

- Dane logowania wykorzystują standardowe uwierzytelnianie AWS SigV4 poprzez boto3.
- Operacje wysyłania obecnie przesyłają treść tekstową w formacie UTF-8; pobieranie może zwracać tekst lub base64 dla obiektów binarnych.

### Używane przez

- [Węzeł Amazon S3](../nodes/amazon-s3-node.md)

---

## Redis

[Redis](https://redis.io) to magazyn klucz-wartość działający w pamięci, używany do buforowania i szybkiego dostępu do danych.

### Wymagane pola

| Pole | Opis |
|-------|-------------|
| `host` | Nazwa hosta lub adres IP serwera Redis (np. `localhost`) |
| `port` | Port Redis (domyślnie: `6379`) |
| `password` | Hasło Redis (pozostaw puste, jeśli nie jest ustawione) |

### Używane przez

- [Węzeł Redis](../nodes/redis-node.md)

---

## Slack

Dane logowania Slack przechowują **Incoming Webhook URL** służący do publikowania wiadomości w kanałach Slack.

### Wymagane pola

| Pole | Opis |
|-------|-------------|
| `webhook_url` | Slack Incoming Webhook URL (z konfiguracji aplikacji Slack) |

### Uwagi

- Utwórz Incoming Webhook na stronie [api.slack.com/apps](https://api.slack.com/apps) → aplikacja → **Incoming Webhooks**.
- Każdy webhook jest przypisany do konkretnego kanału. Utwórz osobne dane logowania dla różnych kanałów.

### Używane przez

- [Węzeł Slack](../nodes/slack-node.md)

---

## Telegram

Dane logowania Telegram przechowują **Bot Token** oraz opcjonalny **Webhook Secret Token** dla workflow opartych na botach.

### Wymagane pola

| Pole | Opis |
|-------|-------------|
| `bot_token` | Token Telegram Bot API uzyskany od BotFather |

### Pola opcjonalne

| Pole | Opis |
|-------|-------------|
| `secret_token` | Wspólny sekret weryfikowany względem `x-telegram-bot-api-secret-token` w przychodzących webhookach |

### Uwagi

- Użyj tych samych danych logowania zarówno dla [Telegram Trigger](../nodes/telegram-trigger-node.md), jak i [Telegram](../nodes/telegram-node.md).
- Zarejestruj webhook ręcznie za pomocą API `setWebhook` Telegram, używając adresu URL wyświetlonego w panelu węzła Telegram Trigger.
- `chatId` w węźle Telegram może być dosłownym identyfikatorem lub wyrażeniem takim jak `$telegramEvent.message.chat.id`.

### Używane przez

- [Węzeł Telegram Trigger](../nodes/telegram-trigger-node.md)
- [Węzeł Telegram](../nodes/telegram-node.md)

---

## HTTP Auth (Bearer i Header)

Te dane logowania są używane przez [węzeł HTTP](../nodes/http-node.md) do uwierzytelniania wychodzących żądań.

### Bearer

Dołącza nagłówek `Authorization: Bearer <token>` do żądań HTTP.

| Pole | Opis |
|-------|-------------|
| `token` | Wartość tokenu bearer |

### Header

Dołącza niestandardowy nagłówek do żądań HTTP.

| Pole | Opis |
|-------|-------------|
| `header_key` | Nazwa nagłówka (np. `X-Api-Key`) |
| `header_value` | Wartość nagłówka |

Oba typy mogą być również przywoływane poprzez `$credentials.CredentialName` w [Expression DSL](./expression-dsl.md) do dynamicznego użycia w dowolnym węźle akceptującym wyrażenia.

### Używane przez

- [Węzeł HTTP](../nodes/http-node.md)

---

## Dostawcy LLM (OpenAI, Google, Custom, Cohere)

Te dane logowania zasilają węzły AI.

| Typ | Opis |
|------|-------------|
| **OpenAI** | Klucz API dla modeli GPT i embeddingów OpenAI |
| **Google** | Klucz API dla modeli Gemini |
| **Custom** | Klucz API + bazowy URL dla endpointów zgodnych z OpenAI (Ollama, vLLM, LM Studio itp.) |
| **Cohere** | Klucz API dla embeddingów Cohere |

### Buforowanie promptów OpenAI

OpenAI automatycznie buforuje statyczny (niezmienny) prefiks promptu systemowego — nie jest wymagana dodatkowa konfiguracja. Powtarzane uruchomienia workflow, które współdzielą ten sam prefiks promptu systemowego, korzystają z cen tokenów z pamięci podręcznej, co zmniejsza zarówno koszty, jak i opóźnienia. Jest to szczególnie przydatne w przypadku długich, stałych instrukcji, gdy między uruchomieniami zmienia się tylko wiadomość użytkownika. Monitoruj współczynniki trafień pamięci podręcznej i oszczędności tokenów w [zakładce Wykonania](../tabs/traces-tab.md) lub w panelu użycia OpenAI, aby zoptymalizować strukturę promptu pod kątem maksymalnego wykorzystania pamięci podręcznej.

### Używane przez

- [Węzeł LLM](../nodes/llm-node.md)
- [Węzeł Agent](../nodes/agent-node.md)
- [Węzeł RAG](../nodes/rag-node.md) (embeddingi OpenAI poprzez dane logowania Qdrant)

---

## FlareSolverr

[FlareSolverr](https://github.com/FlareSolverr/FlareSolverr) to serwer proxy służący do omijania Cloudflare i podobnych zabezpieczeń przed botami.

### Wymagane pola

| Pole | Opis |
|-------|-------------|
| `flaresolverr_url` | URL instancji FlareSolverr (np. `http://localhost:8191`) |

Adresy loopback i prywatne są tutaj obsługiwane, więc uruchomienie FlareSolverr obok Heym działa zgodnie z dokumentacją. URL nie może wskazywać na adres link-local ani adres metadanych chmury. Ponieważ adresy prywatne są dozwolone, to pole można również skierować na inną usługę wewnętrzną, a odpowiedź zostanie zwrócona w danych wyjściowych węzła. Każdy zalogowany użytkownik może utworzyć te dane logowania, więc granicę stanowi to, kto może tworzyć workflow, oraz reguły sieciowe, a nie udostępnianie danych logowania. Zobacz [Egress Safety](../nodes/crawler-node.md#egress-safety).

### Używane przez

- [Węzeł Crawler](../nodes/crawler-node.md)

---
## Powiązane

- [Dane logowania](./credentials.md) – Omówienie danych logowania i sposobu, w jaki korzystają z nich węzły
- [Karta Dane logowania](../tabs/credentials-tab.md) – Dodawanie danych logowania i zarządzanie nimi
- [Udostępnianie danych logowania](./credentials-sharing.md) – Udostępnianie danych logowania użytkownikom i zespołom
- [Bezpieczeństwo](./security.md) – Szyfrowanie danych w spoczynku, kontrola dostępu
- [Expression DSL](./expression-dsl.md) – Składnia `$credentials` na potrzeby dostępu dynamicznego

---

## Model Router (Auto Model)

Kieruje każde żądanie do jednych z istniejących danych logowania modelu, wykorzystując do wyboru model decyzyjny. Przechowuje wyłącznie odwołania, nigdy własny klucz.

### Pola wymagane

- `decision_credential_id` – dane logowania **Decision Model**, do których istnieje dostęp.
- `decision_model` – model wykonujący wywołanie routingu, na przykład `jev-latest`.
- `options` – co najmniej dwa wpisy, z których każdy zawiera nazwę, jedne z danych logowania OpenAI/Google/Custom, model na nich oraz kryteria określające, kiedy dany wpis powinien zostać wybrany.

### Pola opcjonalne

- `routing_instructions` – sposób ogólnego ważenia opcji.
- Jedna z opcji może zostać oznaczona jako opcja zapasowa używana w przypadku niepowodzenia routingu.

### Uwagi

Nazwy opcji to wartości, między którymi wybiera model decyzyjny, dlatego muszą być rozróżnialne. Opcja nie może wskazywać innego Model Routera.
