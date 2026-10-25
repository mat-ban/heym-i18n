# Portal

**Portal** udostępnia workflow Heym jako publiczne interfejsy typu chat. Użytkownicy końcowi mogą uruchamiać workflow poprzez URL bez logowania do Heym.

## Co robi

- **Publiczny URL**: `/chat/{slug}` (np. `/chat/my-workflow`)
- **Interfejs chat**: Użytkownicy wchodzą w interakcję poprzez UI chat (wiadomości, dane wejściowe, odpowiedzi)
- **Opcjonalne uwierzytelnianie**: Jeśli skonfigurowano użytkowników portalu, wymagane jest logowanie; w przeciwnym razie portal jest publiczny
- **Streaming**: Postęp węzłów w czasie rzeczywistym podczas wykonania (gdy włączone)
- **Zatrzymywanie uruchomionych wykonań**: Użytkownicy mogą zatrzymać trwające uruchomienie portalu z stopki chat; aktywne wykonanie workflow jest również anulowane po stronie serwera
- **Przesyłanie plików**: Opcjonalne przesyłanie plików (tekst, obrazy itp.) dla każdego pola wejściowego
- **Przekazanie do przeglądu przez człowieka**: Uruchomienia portalu mogą wyświetlać [linki do przeglądu HITL](./human-in-the-loop.md), gdy agent zatrzymuje się w oczekiwaniu na zatwierdzenie
- **Wyświetlanie obrazów**: Wyniki workflow zawierające obrazy (np. z generowania obrazów przez LLM lub zrzutów ekranu Playwright) pojawiają się jako miniatury w chat. Kliknięcie dowolnego obrazu otwiera pełnoekranowy podgląd; naciśnięcie **Esc** lub użycie przycisku wstecz urządzenia zamyka podgląd

## Konfiguracja workflow

| Ustawienie | Opis |
|---------|-------------|
| `portal_enabled` | Włącz portal dla tego workflow |
| `portal_slug` | Slug URL (np. `my-workflow` → `/chat/my-workflow`) |
| `portal_stream_enabled` | Użyj wykonania strumieniowego |
| `portal_file_upload_enabled` | Zezwól na przesyłanie plików |
| `portal_file_config` | Konfiguracja plików dla poszczególnych pól (typy, limity) |

Konfiguracja w edytorze: przycisk **Portal** w nagłówku workflow otwiera okno dialogowe ustawień portalu.

## Przepływ

1. **Info**: `GET /api/portal/{slug}/info` – Zwraca metadane workflow i pola wejściowe (bez uwierzytelniania)
2. **Login** (jeśli wymagany): `POST /api/portal/{slug}/login` – Zwraca token sesji
3. **Execute**: `POST /api/portal/{slug}/execute` – UI chat portalu wywołuje ten endpoint (lub wewnętrznie jego wariant strumieniowy, gdy jest włączony); użytkownicy końcowi wchodzą w interakcję poprzez interfejs chat, a nie poprzez bezpośrednie wywoływanie API.
4. **Stop**: `POST /api/portal/{slug}/executions/{execution_id}/cancel` – Wywoływane, gdy użytkownik naciśnie **Stop** podczas aktywnego uruchomienia portalu

## Limit współbieżności

Gdy workflow ma [limit współbieżności](./webhooks.md#concurrency-limit-and-queued-runs) i wszystkie sloty są zajęte, wiadomość w portalu czeka na swoją kolej, zamiast uruchamiać się natychmiast. Na pasku postępu czatu wyświetla się **Waiting in queue (2/5)**, dopóki uruchomienie się nie rozpocznie, a następnie standardowa odpowiedź. Uruchomienie odbywa się nawet wtedy, gdy użytkownik zamknie stronę. **Stop** usuwa oczekujące uruchomienie z kolejki. Gdy kolejka jest pełna, wiadomość kończy się błędem "Concurrency queue is full". Uruchomienie, które czekało w kolejce, nie przesyła odpowiedzi strumieniowo token po tokenie; cała odpowiedź pojawia się po jego zakończeniu.

## HITL w uruchomieniach portalu

Jeśli workflow portalu osiągnie [Węzeł agenta](../nodes/agent-node.md) z włączonym [Human-in-the-Loop](./human-in-the-loop.md), odpowiedź portalu pokazuje link do przeglądu zamiast pozostać pusta.

- Status wykonania workflow zmienia się na `pending`
- Chat portalu wyświetla URL przeglądu
- Dowolne węzły podłączone do wyjścia `review` agenta mogą natychmiast powiadomić Slack, e-mail lub inne kanały
- Recenzent podejmuje decyzję na `/review/{token}` bez logowania
- Po przeglądzie workflow wznawia działanie z zapisanego snapshotu

Umożliwia to łączenie publicznych przepływów chat z prywatnymi krokami zatwierdzania przez człowieka.

## Pola wejściowe

Pola wejściowe pochodzą z węzłów [Input](../nodes/input-node.md). API wyodrębnia węzły startowe typu `textInput` oraz ich `inputFields`. Wykonanie korzysta z tego samego silnika co zwykłe uruchomienia; dane wejściowe są przekazywane jako `body.inputs` oraz `conversation_history` dla przepływów wieloetapowych.

## Uwierzytelnianie i sesje

- **WorkflowPortalUser**: Nazwa użytkownika/hasło dla każdego workflow (gdy uwierzytelnianie jest włączone)
- **Usuwanie ostatniego użytkownika**: Przy włączonym portalu usunięcie ostatniego użytkownika portalu sprawia, że portal staje się ponownie publiczny; okno ustawień wymaga uprzedniego potwierdzenia
- **PortalSession**: Tokeny sesji z TTL 168 godzin
- **Ograniczanie szybkości**: 3 nieudane próby logowania → 24-godzinna blokada dla pary workflow+IP
- Wygasłe sesje są czyszczone przez zadanie cron

## UI konfiguracji

Zakładki **WebPortalSettingsDialog**:

1. **General**: Włącz portal, ustaw slug, skopiuj URL portalu
2. **Users**: Dodaj/usuń użytkowników portalu (nazwa użytkownika/hasło)
3. **Options**: Tryb strumieniowy, przesyłanie plików, podgląd pól wejściowych

## Powiązane

- [Why Heym](../getting-started/why-heym.md) – Portal jako powierzchnia chat dla agentów w środowisku produkcyjnym
- [Workflows Tab](../tabs/workflows-tab.md) – Tworzenie workflow i włączanie portalu
- [Human-in-the-Loop](./human-in-the-loop.md) – Publiczne strony przeglądu dla oczekujących wyników agenta
- [Triggers](./triggers.md) – Portal jako punkt wejścia
- [Node Types](./node-types.md) – [Input](../nodes/input-node.md) dla danych wejściowych portalu
- [Workflow Structure](./workflow-structure.md) – Węzły i krawędzie
