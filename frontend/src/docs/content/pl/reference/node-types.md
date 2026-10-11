# Typy węzłów

Heym udostępnia różnorodne typy węzłów do budowania workflow. W konfiguracji węzłów należy używać [wyrażeń](./expression-dsl.md), takich jak `$input.text` oraz `$nodeLabel.field`.

## Węzły wyzwalające

| Węzeł | Opis | Wyjścia |
|------|-------------|---------|
| [Input](../nodes/input-node.md) | Punkt wejścia tekstowego dla workflow (HTTP/[webhook](./webhooks.md)) | 1 |
| [Cron](../nodes/cron-node.md) | Wyzwalanie według harmonogramu (wyrażenie cron) | 1 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Wyzwalanie po nadejściu aktualizacji webhook bota Telegram | 1 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Wyzwalanie, gdy Slack wyśle webhook Events API | 1 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Wyzwalanie, gdy Discord wyśle webhook interakcji aplikacji | 1 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Wyzwalanie po nadejściu nowej wiadomości e-mail do skrzynki IMAP | 1 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Wyzwalanie, gdy Heym opublikuje zdarzenie platformy (tablica wsadowa) | 1 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Wyzwalanie z połączenia wychodzącego do zewnętrznego serwera WebSocket | 1 |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Wygenerowanie jednorazowego linku do przesyłania i uruchomienie po przesłaniu dużego pliku | 1 |
| [RabbitMQ](../nodes/rabbitmq-node.md) | Wyzwalanie po odebraniu wiadomości z kolejki | 1 |
| [Error Handler](../nodes/error-handler-node.md) | Uruchamiany, gdy dowolny węzeł zgłosi błąd (bez krawędzi wejściowej) | 1 |

Wszystkie punkty wejścia opisano w sekcji [Triggers](./triggers.md).

## Węzły AI

| Węzeł | Opis | Wejścia | Wyjścia |
|------|-------------|--------|---------|
| [LLM](../nodes/llm-node.md) | Przetwarzanie tekstu za pomocą modelu językowego | 1 | 1 |
| [Decision](../nodes/decision-node.md) | Zadawanie modelowi decyzyjnemu pytań z typowaniem i rozgałęzianie na podstawie zwracanych prawdopodobieństw | 1 | 1 |
| [AI Agent](../nodes/agent-node.md) | LLM z wywoływaniem narzędzi, umiejętnościami, MCP, opcjonalną [weryfikacją przez człowieka](./human-in-the-loop.md) oraz opcjonalnym [trwałym grafem pamięci](./agent-persistent-memory.md). Zobacz [Agent Architecture](./agent-architecture.md). | 1 | 1, plus opcjonalne wyjście `review` |
| [Codex](../nodes/codex-node.md) | Uruchomienie lokalnego CLI Codex względem repozytorium GitHub przy użyciu tokenu dostępu ChatGPT/Codex | 1 | 1, plus wyjście `question` |
| [OpenCode Go](../nodes/opencode-go-node.md) | Uruchomienie CLI OpenCode względem repozytorium GitHub w wzmocnionym kontenerze przy użyciu klucza API bramy OpenCode Go | 1 | 1 |
| [MCP Call](../nodes/mcp-call-node.md) | Bezpośrednie wywołanie konkretnego narzędzia MCP bez wyboru przez LLM | 1 | 1 |
| [RAG / Vector Store](../nodes/rag-node.md) | Wstawianie, aktualizacja (upsert), usuwanie lub wyszukiwanie w [magazynie wektorowym](../tabs/vectorstores-tab.md) Qdrant lub Postgres (pgvector) na potrzeby RAG | 1 | 1 |

## Węzły logiki

| Węzeł | Opis | Wejścia | Wyjścia |
|------|-------------|--------|---------|
| [Condition](../nodes/condition-node.md) | Rozgałęzianie na podstawie if/else | 1 | 2 (true/false) |
| [Switch](../nodes/switch-node.md) | Kierowanie poprzez dopasowanie wartości do przypadków | 1 | n |
| [Merge](../nodes/merge-node.md) | Oczekiwanie na wiele wejść i scalanie | n | 1 |
| [Loop](../nodes/loop-node.md) | Iteracja po tablicy | 1 | 2 (loop/done) |

## Węzły danych

| Węzeł | Opis | Wejścia | Wyjścia |
|------|-------------|--------|---------|
| [Set](../nodes/set-node.md) | Transformacja i mapowanie danych | 1 | 1 |
| [Converter](../nodes/converter-node.md) | Konwersja danych między formatami (CSV, JSON, XML) oraz OCR obrazów lub plików PDF do tekstu | 1 | 1 |
| [Code](../nodes/code-node.md) | Uruchomienie Pythona w jednorazowym, odizolowanym sieciowo sandboxie z własnym plikiem requirements.txt | 1 | 1 |
| [Variable](../nodes/variable-node.md) | Ustawienie lub pobranie zmiennej (lokalnej dla workflow lub [globalnej](./global-variables.md)) | 1 | 1 |
| [Execute](../nodes/execute-node.md) | Wywołanie innego workflow | 1 | 1 |
| [Heym](../nodes/heym-node.md) | Odczyt workflow Heym oraz historii wykonań | 1 | 1 |
## Węzły integracyjne

| Węzeł | Opis | Wejścia | Wyjścia |
|------|-------------|--------|---------|
| [HTTP](../nodes/http-node.md) | Wykonywanie żądań HTTP (cURL) | 0 lub 1 | 1 |
| [WebSocket Send](../nodes/websocket-send-node.md) | Połączenie z zewnętrznym WebSocket i wysłanie jednej wiadomości | 1 | 1 |
| [Telegram](../nodes/telegram-node.md) | Wysyłanie wiadomości bota Telegram | 1 | 1 |
| [Slack](../nodes/slack-node.md) | Wysyłanie wiadomości Slack | 1 | 1 |
| [Discord](../nodes/discord-node.md) | Wysyłanie wiadomości przez webhook Discord | 1 | 1 |
| [Send Email](../nodes/send-email-node.md) | Wysyłanie wiadomości e-mail przez SMTP | 1 | 1 |
| [Redis](../nodes/redis-node.md) | Operacje Redis (set, get, hasKey, deleteKey) | 1 | 1 |
| [Grist](../nodes/grist-node.md) | Odczyt i zapis arkuszy Grist | 1 | 1 |
| [GitHub](../nodes/github-node.md) | Zarządzanie repozytoriami, użytkownikami, zgłoszeniami, pull requestami, recenzjami, wydaniami, workflow Actions oraz plikami przez GitHub REST API | 1 | 1 |
| [Jira](../nodes/jira-node.md) | Zarządzanie projektami, zgłoszeniami, komentarzami, załącznikami, użytkownikami, powiadomieniami i przejściami workflow w Jira przez Jira REST API | 1 | 1 |
| [Linear](../nodes/linear-node.md) | Zarządzanie zespołami, projektami, zgłoszeniami, stanami workflow i komentarzami w Linear przez GraphQL | 1 | 1 |
| [Google Sheets](../nodes/google-sheets-node.md) | Odczyt i zapis Google Sheets przez OAuth2 | 1 | 1 |
| [Google Drive](../nodes/google-drive-node.md) | Wyświetlanie listy, pobieranie, aktualizacja i usuwanie plików Google Drive przez OAuth2 | 1 | 1 |
| [BigQuery](../nodes/bigquery-node.md) | Uruchamianie zapytań SQL i wstawianie wierszy w BigQuery | 1 | 1 |
| [Supabase](../nodes/supabase-node.md) | Odpytywanie i modyfikowanie tabel Supabase przez PostgREST | 1 | 1 |
| [ClickHouse](../nodes/clickhouse-node.md) | Uruchamianie operacji SQL, CRUD i zliczania w ClickHouse | 1 | 1 |
| [Notion](../nodes/notion-node.md) | Zarządzanie bazami danych, źródłami danych, stronami i blokami Notion | 1 | 1 |
| [Sentry](../nodes/sentry-node.md) | Zarządzanie organizacjami, projektami, zespołami, zgłoszeniami, zdarzeniami i wydaniami Sentry | 1 | 1 |
| [Amazon S3](../nodes/amazon-s3-node.md) | Zarządzanie bucketami i folderami; wyświetlanie listy, wysyłanie, pobieranie, kopiowanie i usuwanie obiektów | 1 | 1 |
| [DataTable](../nodes/datatable-node.md) | Odczyt i zapis Tabel danych Heym (magazyn własny) | 1 | 1 |
| [Drive](../nodes/drive-node.md) | Zarządzanie plikami Drive: usuwanie, ustawianie hasła, TTL, limitu pobrań, udostępnianie i anulowanie udostępniania zespołowi | 1 | 1 |

## Węzły automatyzacji

| Węzeł | Opis | Wejścia | Wyjścia |
|------|-------------|--------|---------|
| [Crawler](../nodes/crawler-node.md) | Pobieranie treści stron internetowych za pomocą FlareSolverr | 1 | 1 |
| [Playwright](../nodes/playwright-node.md) | Automatyzacja przeglądarki z krokiem AI i Auto Heal | 1 | 1 |

## Węzły narzędziowe

| Węzeł | Opis | Wejścia | Wyjścia |
|------|-------------|--------|---------|
| [Wait](../nodes/wait-node.md) | Opóźnienie wykonania | 1 | 1 |
| [Output](../nodes/output-node.md) | Endpoint wyjściowy | 1 | 1 |
| [JSON output mapper](../nodes/json-output-mapper-node.md) | Mapowanie pól do obiektu JSON; jedyny węzeł terminalny = treść webhooka/uruchomienia najwyższego poziomu | 1 | 0 |
| [HTML output mapper](../nodes/html-output-mapper-node.md) | Renderowanie strony HTML; jedyny węzeł terminalny = webhook odpowiada text/html | 1 | 0 |
| [Chart Output](../nodes/chart-output-node.md) | Wyjście widżetu pulpitu terminalowego, które mapuje wiersze wejściowe na payloady wykresów | 1 | 0 |
| [Sticky Note](../nodes/sticky-note-node.md) | Dodawanie notatek markdown do canvas (nie jest wykonywany) | 0 | 0 |
| [Console Log](../nodes/console-log-node.md) | Logowanie do konsoli backendu | 1 | 1 |
| [Disable Node](../nodes/disable-node.md) | Wyłączenie innego węzła w workflow | 1 | 1 |
| [Enable Node](../nodes/enable-node.md) | Włączenie wyłączonego węzła w workflow | 1 | 1 |
| [Throw Error](../nodes/throw-error-node.md) | Zatrzymanie workflow z odpowiedzią błędu | 1 | 0 |

## Węzły pluginów

Węzły pluginów są dostarczane przez pluginy zainstalowane w instancji. Każdy zainstalowany
plugin pojawia się w palecie w sekcji **Plugins** pod własną nazwą; pod spodem
odpowiada jednemu z tych dwóch typów węzłów.

| Węzeł | Opis | Wejścia | Wyjścia |
|------|-------------|--------|---------|
| [Plugin](../nodes/plugin-node.md) | Niestandardowa akcja dostarczana przez zainstalowany plugin | 1 | 1 |
| [Plugin Trigger](../nodes/plugin-trigger-node.md) | Niestandardowy trigger dostarczany przez zainstalowany plugin | 0 | 1 |
## Powiązane

- [Funkcje Canvas](./canvas-features.md) – Przypinanie danych, dzienniki wykonań, włączanie/wyłączanie, wyodrębnianie do pod-workflow
- [Węzeł Agent](../nodes/agent-node.md) – Szczegółowe informacje o węźle AI Agent
- [Architektura agenta](./agent-architecture.md) – Pod-agenci, orkiestrator, umiejętności, MCP, wywoływanie narzędzi
- [Pamięć trwała agenta](./agent-persistent-memory.md) – Graf wiedzy dla poszczególnych węzłów, udostępnianie i ekstrakcja w tle
- [Human-in-the-Loop](./human-in-the-loop.md) – Wstrzymanie danych wyjściowych agenta w celu zatwierdzenia przez człowieka
- [Expression DSL](./expression-dsl.md) – Odwoływanie się do danych w konfiguracji węzła
- [Okno ewaluacji wyrażeń](./expression-evaluation-dialog.md) – Rozszerzalny edytor z podglądem na żywo z backendu
- [Trigger przesyłania plików](../nodes/file-upload-trigger-node.md) – Przyjmowanie dużych przesyłek multipart przez linki jednorazowe
- [Trigger WebSocket](../nodes/websocket-trigger-node.md) – Trigger wychodzącego gniazda w czasie rzeczywistym
- [Wysyłanie WebSocket](../nodes/websocket-send-node.md) – Wysyłanie wiadomości do zewnętrznych gniazd
- [Struktura workflow](./workflow-structure.md) – Format JSON dla węzłów i krawędzi
- [Triggery](./triggers.md) – Wszystkie punkty wejścia workflow
- [Karta Dane logowania](../tabs/credentials-tab.md) – Dodawanie kluczy API dla LLM, HTTP i innych węzłów
- [Udostępnianie danych logowania](./credentials-sharing.md) – Udostępnianie danych logowania innym użytkownikom
- [Portal](./portal.md) – Udostępnianie workflow jako publicznych interfejsów chat
- [Karta Magazyny wektorowe](../tabs/vectorstores-tab.md) – Tworzenie magazynów wektorowych dla węzłów RAG
