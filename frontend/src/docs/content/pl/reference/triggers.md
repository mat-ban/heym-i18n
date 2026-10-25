# Triggery

Workflows są uruchamiane przez **węzły triggerów** lub **punkty wejścia**. Każdy typ triggera ma własny endpoint lub proces działający w tle.

## Węzły triggerów

Węzły startowe (bez krawędzi przychodzących), które inicjują wykonanie:

| Typ węzła | Opis |
|-----------|------|
| [Input](../nodes/input-node.md) (textInput) | Punkt wejścia HTTP. Odbiera `body`, `headers`, `query` z żądań. |
| [Cron](../nodes/cron-node.md) | Uruchamiany według harmonogramu (wyrażenie cron, np. `0 * * * *` dla uruchomienia co godzinę). |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Uruchamiany, gdy Telegram wysyła aktualizację webhook bota na adres webhook przypisany do danego węzła. |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Uruchamiany, gdy Discord wysyła webhook Interactions API na endpoint przypisany do danego węzła. |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Odpytuje skrzynkę IMAP i uruchamia się raz dla każdego nowo wykrytego e-maila. |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Uruchamiany, gdy Heym publikuje zdarzenie platformowe. Zdarzenia w jednym oknie dyspozycji docierają razem jako tablica. |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Otwiera wychodzące połączenie klienckie do zewnętrznego gniazda i uruchamia się dla wybranych zdarzeń gniazda. |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Generuje jednorazowy URL do przesyłania i uruchamia się, gdy wywołujący wyśle duży plik multipart. |
| [RabbitMQ](../nodes/rabbitmq-node.md) (receive) | Uruchamiany, gdy wiadomość zostanie pobrana z kolejki RabbitMQ. |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Uruchamiany, gdy Slack wysyła zdarzenie przez webhook Events API. |

## Punkty wejścia

| Trigger | Endpoint / Źródło | Uwierzytelnianie |
|---------|-------------------|------------------|
| **Webhook/API** | `POST /api/workflows/{id}/execute` | `anonymous` / `jwt` / `header_auth` |
| **MCP** | `POST /api/mcp/tools/call`, `/message`, `/sse` | Nagłówek `X-MCP-Key` lub `Authorization: Bearer` (tylko nagłówki) |
| **Portal** | `POST /api/portal/{slug}/execute` | Token sesji portalu |
| **Board** | [Board](../tabs/board-tab.md) — przeniesienie karty / uruchomienie follow-up do kolumny z łańcuchem workflow (`trigger_source="board"`) | JWT (właściciel boarda) |
| **Cron** | Scheduler cron (działa co 60 s, ewaluuje wyrażenia cron) | Nie dotyczy |
| **IMAP** | Menedżer triggerów IMAP (węzeł lidera, interwał odpytywania na węzeł) | Nazwa użytkownika/hasło IMAP |
| **WebSocket** | Menedżer wychodzących triggerów WebSocket (węzeł lidera, trwałe połączenia klienckie) | Opcjonalne nagłówki na węzeł |
| **File Upload** | `POST /api/file-intake/u/{token}` po wygenerowaniu slotu | Jednorazowy token uprawnień |
| **RabbitMQ** | Konsument RabbitMQ (węzeł lidera) | Nie dotyczy |
| **Slack** | `POST /api/slack/webhook/{node_id}` | Sekret podpisu HMAC-SHA256 |
| **Discord** | `POST /api/discord/webhook/{node_id}` | Klucz publiczny aplikacji Ed25519 |
| **Telegram** | `POST /api/telegram/webhook/{node_id}` | Opcjonalny `x-telegram-bot-api-secret-token` |
| **Editor** | Tak samo jak Webhook, przez `workflowStore.executeWorkflow` | JWT |

### Webhook / API

- **Endpoint**: `POST /api/workflows/{workflow_id}/execute`
- **Wejście**: Treść żądania jest przekazywana jako `body` do węzłów textInput
- **Tryb body**: Workflows mogą używać przykładów o strukturze pól (`defined`) lub surowych przykładów JSON (`generic`) w edytorze oraz w oknie dialogowym cURL
- **Uwierzytelnianie**: Konfigurowane dla każdego workflow (`auth_type`, `allow_anonymous`)

Szczegóły dotyczące TTL, pamięci podręcznej, limitów szybkości i uwierzytelniania znajdują się w sekcji [Webhooks](./webhooks.md).

### MCP

Workflows z `mcp_enabled=true` są widoczne jako narzędzia dla klientów MCP. Nazwa narzędzia jest tworzona na podstawie nazwy workflow. Zobacz [MCP Tab](../tabs/mcp-tab.md).

### Portal

Publiczny interfejs Chat dostępny pod `/chat/{slug}`. Szczegóły znajdują się w sekcji [Portal](./portal.md).

### Cron

Scheduler cron działa co 60 sekund, wyszukuje workflows z aktywnymi węzłami `cron`, ewaluuje wyrażenia cron i uruchamia pasujące workflows. Dane wejściowe zawierają `{"triggered_by": "cron"}`.

### IMAP

Menedżer triggerów IMAP działa w węźle lidera i sprawdza aktywne węzły `imapTrigger` zgodnie z ich skonfigurowanym `pollIntervalMinutes`. Każdy węzeł przechowuje kursor IMAP (`UIDVALIDITY` + ostatnio widziany UID). Dane wejściowe zawierają `email`, `triggered_by: "imap"`, `trigger_node_id` oraz `triggered_at`.

### Zdarzenia platformy Heym

Dyspozytor zdarzeń Heym odpytuje log `heym_events` co 5 sekund i dostarcza pasujące zdarzenia do aktywnych węzłów `heymTrigger`. Dostarczenie jest rezerwowane dla pary (zdarzenie, workflow, węzeł) poprzez unikalne ograniczenie, dzięki czemu zdarzenie uruchamia się dokładnie raz na subskrybujący węzeł w każdym workerze, kontenerze i na każdej maszynie. Każde zdarzenie zarezerwowane w jednym przebiegu jest dostarczane w pojedynczym uruchomieniu: dane wejściowe zawierają `events` (zawsze tablica, od najstarszego), `count`, `triggered_by: "heym_event"`, `trigger_node_id` oraz `triggered_at`. Dysponowane są wyłącznie zdarzenia opublikowane w ciągu ostatnich 5 minut, co zapobiega odtwarzaniu zaległości po awarii; zdarzenia są przechowywane przez 7 dni.

### WebSocket

Menedżer triggerów WebSocket działa w węźle lidera i utrzymuje jedno wychodzące połączenie klienckie na każdy aktywny węzeł [WebSocket Trigger](../nodes/websocket-trigger-node.md). Może emitować wykonania dla `onMessage`, `onConnected` oraz `onClosed`. Dane wejściowe zawierają `eventName`, `url`, `triggered_by: "websocket"`, `trigger_node_id` oraz jedno z `message`, `connection` lub `close`.
### Przesyłanie plików

[Trigger przesyłania plików](../nodes/file-upload-trigger-node.md) tworzy ograniczony czasem TTL, jednorazowy slot przesyłania, gdy workflow jest wywoływany przez API, MCP lub canvas. Przesłanie danych formularza multipart do `POST /api/file-intake/u/{token}` konsumuje slot, zapisuje plik jako plik Drive i uruchamia workflow synchronicznie. Dane wejściowe obejmują `file`, `uploaded_at`, `triggered_by: "file_upload"` oraz metadane przesłania.

### Telegram

Telegram wysyła aktualizacje webhook bota do `POST /api/telegram/webhook/{node_id}`. Payload jest przekazywany do workflow jako `update`, `message`, opcjonalny `callback_query`, oczyszczone `headers`, `triggered_by`, `trigger_node_id` oraz `triggered_at`. Jeśli wybrane dane logowania zawierają secret token, Heym weryfikuje `x-telegram-bot-api-secret-token` przed wykonaniem.

### Discord

Discord wysyła webhooki interakcji do `POST /api/discord/webhook/{node_id}`. Payload jest przekazywany do workflow jako `interaction`, `type`, `data`, oczyszczone `headers`, `triggered_by`, `trigger_node_id` oraz `triggered_at`. Heym weryfikuje żądanie przy użyciu Ed25519 oraz klucza publicznego aplikacji z wybranych danych logowania `discord_trigger` przed wykonaniem.

### RabbitMQ

Konsument RabbitMQ uruchamia się, gdy inicjalizuje się lider worker. Workflow z węzłami `rabbitmq`, w których `rabbitmqOperation === "receive"`, otrzymują konsumenta. Dane wejściowe obejmują `message_data` (body, headers, routing_key itp.) oraz `triggered_by: "rabbitmq"`.

## Limit współbieżności

Workflow z [limitem współbieżności](./webhooks.md#concurrency-limit-and-queued-runs) umieszcza w kolejce uruchomienia produkcyjne z każdego powyższego punktu wejścia, gdy jego sloty są pełne, zgodnie z zasadą FIFO (pierwsze weszło, pierwsze wyszło), we wszystkich instancjach. Sposób, w jaki wywołujący otrzymuje wynik, zależy od punktu wejścia:

| Punkt wejścia | Podczas gdy uruchomienie oczekuje |
|---|---|
| Webhook / API | `202 Accepted` z `execution_id` oraz adresem URL statusu |
| SSE streaming, Quick Drawer, Portal chat | Strumień pozostaje otwarty i wysyła zdarzenia `queued` |
| Portal without streaming | Żądanie oczekuje na wynik |
| MCP | Wynik `queued` do odpytania za pomocą `heym_execution_status` |
| Cron, IMAP, Google Drive / Sheets, WebSocket, RabbitMQ, Slack, Discord, Telegram, Heym events, error workflows, Dashboard run widgets | Trigger oczekuje na wynik tak długo, jak trwałoby to w przypadku uruchomienia na innej [instancji](./cluster.md). Uruchomienie i tak jest wykonywane i zapisywane w historii |

Gdy kolejka jest pełna, uruchomienie nie rozpoczyna się, a historia zapisuje je jako `queue_full`. Testowe uruchomienia w edytorze, wywołania podrzędnych workflow (węzeł [Execute](../nodes/execute-node.md) oraz narzędzia workflow agenta), [Evals](../tabs/evals-tab.md), testy w trybie budowania czatu oraz wznowienia po recenzji nigdy nie trafiają do kolejki. Uruchomienia kart [Board](../tabs/board-tab.md), uruchomienia [File Upload](../nodes/file-upload-trigger-node.md), uruchomienia rozpoczęte przez narzędzie run-workflow asystenta AI oraz workflowy powiadomień o alertach również startują bez oczekiwania na slot.

## trigger_source

Historia wykonań rejestruje `trigger_source` dla każdego punktu wejścia:

| Wartość | Kiedy |
|-------|------|
| `"API"` | Wywołanie Webhook / API bez jawnego nagłówka (domyślnie) |
| `"Canvas"` | Uruchomienie z canvas edytora workflow |
| `"Quick Drawer"` | Uruchomienie z panelu quick-drawer edytora, w tym uruchomienia z plikami przesłanymi z jego strefy upuszczania |
| `"cron"` | Harmonogram Cron |
| `"imap"` | Menedżer triggerów IMAP |
| `"websocket"` | Menedżer wychodzących triggerów WebSocket |
| `"file_upload"` | Endpoint przesyłania Triggera przesyłania plików (linki wygenerowane przez HTTP, MCP lub kanwę) |
| `"dashboard"` | Uruchomienia widżetów panelu oraz przesyłanie plików z widżetu upuszczania plików |
| `"telegram"` | Webhook bota Telegram |
| `"Discord"` | Webhook interakcji Discord |
| `"MCP"` | Wywołanie narzędzia MCP |
| `"portal"` | Wykonanie przez Portal |
| `"dashboard_chat"` | Chat asystenta AI |
| `"AI Agents"` | Sub-workflow wywołany przez węzeł agenta AI |
| `"SUB_WORKFLOW"` | Sub-workflow wywołany przez węzeł Execute Workflow |
| niestandardowa | Dowolna wartość przesłana w nagłówku `X-Trigger-Source` lub parametrze `trigger_source` w query/body |
| (nie ustawiono) | Konsument RabbitMQ |

## Dane wejściowe według Triggera

- **HTTP/Webhook**: `body`, `headers`, `query` z żądania
- **Cron**: `{"triggered_by": "cron"}`
- **Telegram**: `update` + `message` + opcjonalny `callback_query` + oczyszczone `headers` + `triggered_by: "telegram"` + `trigger_node_id` + `triggered_at`
- **Discord**: `interaction` + `type` + `data` + oczyszczone `headers` + `triggered_by: "Discord"` + `trigger_node_id` + `triggered_at`
- **IMAP**: `email` + `triggered_by: "imap"` + `trigger_node_id` + `triggered_at`
- **WebSocket**: `eventName` + `url` + `triggered_by: "websocket"` + `message` / `connection` / `close`
- **Przesyłanie plików**: `file` + `uploaded_at` + `triggered_by: "file_upload"`
- **RabbitMQ**: `message_data` + `triggered_by: "rabbitmq"`
- **Slack**: `event` (pełny obiekt zdarzenia Slack) + `headers` (oczyszczone) + `triggered_by: "Slack"` + `trigger_node_id`
- **Portal**: `body.inputs` + opcjonalna `conversation_history`

## Powiązane

- [Webhooks](./webhooks.md) – TTL Webhooka, cache, rate limit, uwierzytelnianie
- [Struktura workflow](./workflow-structure.md) – Węzły i krawędzie
- [Typy węzłów](./node-types.md) – [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md), [File Upload Trigger](../nodes/file-upload-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md)
- [Discord Trigger](../nodes/discord-trigger-node.md) – Trigger webhooka interakcji Discord
- [Szybki start](../getting-started/quick-start.md) – Zbuduj workflow z węzłem Input
- [Portal](./portal.md) – Trigger Portalu i interfejs chat
- [Historia wykonań](./execution-history.md) – Przeglądaj przeszłe uruchomienia i trigger_source
