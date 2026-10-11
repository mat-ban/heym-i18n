# Organizacja Workflow

Heym umożliwia organizowanie workflow w folderach, tworzenie podfolderów oraz planowanie usunięcia workflow. Przegląd interfejsu opisano w sekcji [Workflows Tab](../tabs/workflows-tab.md).

## Foldery i podfoldery

Foldery tworzą drzewo. Każdy folder posiada:

- **Name** – nazwa wyświetlana
- **Parent** – `parent_id` wskazuje inny folder; `null` oznacza katalog główny
- **Workflows** – workflow można przenosić do folderów poprzez `folder_id`

### API

| Endpoint | Przeznaczenie |
|----------|---------|
| `GET /folders` | Tylko foldery główne |
| `GET /folders/tree` | Pełne drzewo (podfoldery + workflow) |
| `GET /folders/{id}` | Pojedynczy folder wraz z zawartością |
| `POST /folders` | Utworzenie folderu (`parent_id` opcjonalne) |
| `PUT /folders/{id}` | Aktualizacja nazwy lub `parent_id` |
| `DELETE /folders/{id}` | Usunięcie folderu (kaskadowe) |
| `PUT /folders/{folder_id}/workflows/{workflow_id}` | Przeniesienie workflow do folderu |
| `DELETE /folders/workflows/{workflow_id}/folder` | Usunięcie workflow z folderu |
| `GET /folders/{id}/export` | Pobranie folderu wraz ze wszystkimi podfolderami jako ZIP |

### Struktura drzewa

Odpowiedź drzewa zawiera `children` oraz `workflows` dla każdego folderu. Udostępnione workflow mogą pojawiać się w folderze poprzez `WorkflowShare.folder_id`.

## Udostępnianie workflow

Aby zaprosić użytkowników poprzez adres e-mail lub udostępnić workflow [zespołowi](./teams.md), należy otworzyć opcję **Share** w edytorze workflow. Każde zaproszenie oraz każde udostępnienie zespołowi wiąże się z uprawnieniem:

| Uprawnienie | Zakres działań współpracownika |
|------------|------------------------------|
| **Read** | Otwarcie workflow, przeglądanie go, wyświetlanie historii wykonań oraz uruchamianie. Edytor otwiera się w trybie tylko do odczytu: opcja Save jest wyłączona, a canvas nie może być modyfikowany. |
| **Write** | Wszystko, co umożliwia uprawnienie Read, a dodatkowo edycja canvas, ustawień, dokumentu analizy oraz pamięci agenta. |

Uprawnienie jest wyświetlane obok każdego wpisu w oknie Share i można je zmienić w dowolnym momencie z poziomu tej listy rozwijanej, bez usuwania i ponownego dodawania udostępnienia. Gdy użytkownik dociera do workflow wieloma ścieżkami (bezpośrednie udostępnienie oraz jeden lub więcej zespołów), obowiązuje **najwyższe** uprawnienie. Udostępnienia istniejące przed wprowadzeniem uprawnień mają wartość **Write**, a klienci API, którzy pomijają pole `permission`, również otrzymują **Write**.

Działania zastrzeżone dla właściciela nigdy nie zależą od uprawnień: usuwanie workflow, przywracanie lub czyszczenie wersji, czyszczenie historii, zarządzanie udostępnieniami oraz opisane poniżej [ustawienia zastrzeżone dla właściciela](#owner-only-settings) pozostają w gestii właściciela nawet w przypadku współpracowników z uprawnieniem **Write**. Współpracownik z uprawnieniem **Read**, który wyśle edycję poprzez API (`PUT /api/workflows/{id}`, notatkę analizy, pamięć agenta, czyszczenie cache) lub poprzez AI Assistant, otrzyma `403` z komunikatem `You have read-only access to this workflow`.

Udostępnienie workflow zapewnia dostęp do canvas, historii wykonań oraz dokumentu analizy. **Nie** obejmuje automatycznie:

- **Danych logowania** przywoływanych przez węzły w workflow
- **Pod-workflow** wywoływanych przez węzły [Execute](../nodes/execute-node.md) lub agentów

Odbiorcy muszą otrzymać te dane logowania oraz podrzędne workflow udostępnione osobno (tym samym użytkownikom lub zespołom). Dane logowania udostępnia się z poziomu [Credentials tab](../tabs/credentials-tab.md); szczegóły opisano w sekcji [Credentials Sharing](./credentials-sharing.md). Każde pod-workflow należy udostępnić z okna Share w jego własnym edytorze.

### Ustawienia zastrzeżone dla właściciela

Cała konfiguracja **Run with cURL** pozostaje w gestii właściciela po udostępnieniu. Współpracownicy nadal mogą otworzyć okno i skopiować wygenerowaną komendę, jednak elementy sterujące są tylko do odczytu.

Zmiana któregokolwiek z poniższych ustawień przez osobę niebędącą właścicielem zostanie odrzucona z kodem `403`:

- **Authentication** (`auth_type`) oraz **Header Key** (`auth_header_key`)
- Tryb **Request Body** (`webhook_body_mode`) oraz **Request Method** (`http_method`)
- **Response Cache** (`cache_ttl_seconds`) oraz **Rate Limit** (`rate_limit_requests`, `rate_limit_window_seconds`)
- **SSE Streaming** (`sse_enabled`, `sse_node_config`)

Pole **Header Value** (`auth_header_value`) działa inaczej: jest całkowicie ukryte przed współpracownikami, a zapis dokonany przez współpracownika jest ignorowany, a nie odrzucany. Edytor wyświetla to pole zamaskowane, więc kod `403` w tym miejscu psułby zwykły zapis, zamiast sygnalizować próbę naruszenia bezpieczeństwa.

Uwierzytelnianie jest powodem, dla którego ten blok jest zastrzeżony dla właściciela: opcja `Anonymous` pozwala nieuwierzytelnionym wywołującym uruchomić workflow, a uruchomienie bez zalogowanego wywołującego rozwiązuje dane logowania i zmienne globalne jako **właściciel**, a nie wywołujący. Pozostała część bloku to opublikowany kontrakt żądania oraz mechanizmy kontroli kosztów właściciela, dlatego przemieszcza się wraz z nim.

Ustawienie **On error, run workflow** (`error_workflow_id`) w panelu **Properties** na poziomie workflow jest zastrzeżone dla właściciela z tego samego powodu: [error workflow](./features.md#error-workflow) uruchamia się z danymi logowania i zmiennymi globalnymi nieudanego uruchomienia, które w przypadku uruchomień wyzwalanych i anonimowych należą do właściciela. Współpracownicy widzą to ustawienie w trybie tylko do odczytu, a dodanie, zastąpienie lub wyczyszczenie go przez osobę niebędącą właścicielem zostanie odrzucone z kodem `403`.

Edycja canvas, nazwy oraz opisu pozostaje bez zmian.

### Tokeny wykonań

Współpracownik może wygenerować token wykonania dla udostępnionego mu workflow. Uruchomienie jest przypisywane do **osoby, która wygenerowała token**, więc korzysta z danych logowania i zmiennych globalnych tego użytkownika, a nie właściciela. Wyłącznie rzeczywiście anonimowe wywołanie — `auth_type: anonymous` bez wywołującego — uruchamia się w kontekście właściciela.

## Zaplanowane do usunięcia

Workflow można zaplanować do usunięcia zamiast usuwać je natychmiast.

- **Pole**: `scheduled_for_deletion` (data i czas z możliwością wartości null)
- **Zachowanie**: po ustawieniu workflow zostaje przeniesiony do `folder_id = null` i pojawia się w sekcji „Scheduled for Deletion”.
### API

| Endpoint | Przeznaczenie |
|----------|---------|
| `PUT /workflows/{id}/schedule-deletion` | Ustawia `scheduled_for_deletion`, czyści `folder_id` |
| `DELETE /workflows/{id}/schedule-deletion` | Czyści `scheduled_for_deletion` (przywraca) |

### UI

- **Przeciągnij do kosza** – Upuszczenie workflow w obszarze „Scheduled for Deletion" powoduje zaplanowanie jego usunięcia
- **Przywróć** – Usuwa z harmonogramu usunięcia
- **Usuń natychmiast** – Ikona kosza służy do trwałego usunięcia

### Logika czyszczenia

Zadanie cron uruchamiane jest codziennie o godzinie **23:59** (w skonfigurowanej strefie czasowej). Workflow zostaje usunięty wyłącznie, gdy:

- **Wszystkie węzły startowe** (węzły bez krawędzi przychodzących, z wyłączeniem sticky/errorHandler) mają `active === false`

Jeżeli którykolwiek węzeł startowy jest nadal aktywny, workflow pozostaje do następnego uruchomienia.

## Interfejs pulpitu

- **Wiersze folderów** – Nowy folder, rekurencyjne drzewo folderów z możliwością rozwijania i zwijania. Każdy folder zawiera opcjonalny opis pod nazwą oraz oznaczenie z liczbą przechowywanych workflow, wraz z podfolderami.
- **Akcje folderów** – Nowy podfolder, Zmień nazwę, Zmień ikonę, Pobierz jako ZIP oraz Usuń znajdują się bezpośrednio w każdym wierszu folderu; menu kontekstowe wywoływane prawym przyciskiem myszy oferuje ten sam zestaw, a na telefonach wyświetlany jest pojedynczy przycisk menu.
- **Obszar główny** – Workflow główne (bez folderu, niezaplanowane) oraz Scheduled for Deletion
- **Podgląd upuszczenia do folderu** – Przeciągnięcie workflow podświetla dokładny folder lub podfolder i wyświetla jego pełną ścieżkę w podglądzie wielkości karty. Zwiń folder rozwija się po krótkim najechaniu kursorem.
- **Stabilna informacja zwrotna przeciągania** – Karta źródłowa wykorzystuje efekt przeciągania, a aktywne miejsce docelowe pozostaje wyróżnione podczas przewijania lub przechodzenia przez kontrolki w obrębie tego samego folderu.
- **Sprawdzenie miejsca docelowego** – Bieżący folder jest oznaczony jako **Already in Folder** i nie przyjmuje zbędnego przeniesienia.
- **Inne strefy upuszczania** – Obszar główny oraz „Scheduled for Deletion" podświetlają się, gdy mogą przyjąć przeciągany workflow.
- **Upuszczanie ZIP** – Upuszczenie pliku ZIP na obszar workflow importuje strukturę folderów na poziomie głównym

## Powiązane

- [Workflows Tab](../tabs/workflows-tab.md) – Tworzenie workflow i zarządzanie nimi
- [Credentials Sharing](./credentials-sharing.md) – Udostępnianie danych logowania współpracownikom workflow
- [Teams](./teams.md) – Udostępnianie workflow i danych logowania zespołom
- [Core Concepts](../getting-started/core-concepts.md) – Workflow, węzły i wykonania
- [Workflow Structure](./workflow-structure.md) – Format JSON dla workflow
- [Triggers](./triggers.md) – Węzły startowe i punkty wejścia
