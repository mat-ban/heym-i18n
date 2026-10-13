# Zakładka MCP

Zakładka **MCP** służy do konfiguracji integracji z Model Context Protocol (MCP). MCP pozwala klientom AI (Claude, ChatGPT, Gemini, Cursor oraz dowolnym narzędziom zgodnym z MCP) wywoływać workflow Heym jako narzędzia.

Heym obsługuje dwa tryby: **serwer domyślny**, który udostępnia wszystkie workflow z włączonym MCP pod jednym endpointem, oraz **serwery nazwane**, które nadają każdej logicznej grupie workflow własny dedykowany URL i klucz API.

Oba tryby mogą udostępniać dwa rodzaje narzędzi: pojedyncze **workflow** oraz **narzędzie czatu Heym** — cały mechanizm [zakładki Chat](./chat-tab.md) ukryty za jednym narzędziem `heym_chat`.

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Obejrzyj demonstrację MCP</a></p>

## Domyślny serwer MCP

Serwer domyślny jest zawsze dostępny pod adresem `{origin}/api/mcp/sse`. Wszystkie workflow z włączonym MCP pojawiają się tutaj jako narzędzia.

### Klucz API MCP

- Klucze są przechowywane jako skróty SHA-256, dlatego Heym nie może wyświetlić istniejącego klucza. Zakładka informuje jedynie, czy klucz został ustawiony, a nie jaki jest.
- **Generate** / **Regenerate** – Nowy klucz jest wyświetlany jednorazowo, zaraz po utworzeniu. Należy go wtedy skopiować; ponowne załadowanie zakładki trwale go ukryje.
- Klucz ten służy do łączenia Claude Desktop, Cursor oraz innych klientów MCP z Heym
- Klucz został utracony? Należy go wygenerować ponownie. Poprzedni klucz natychmiast przestaje działać.

### Metody połączenia

- **API Key** – Klucz API MCP służy do połączeń programistycznych. Zakładka umożliwia skopiowanie gotowej konfiguracji JSON i zawiera przycisk **Add to Cursor** do konfiguracji Cursor jednym kliknięciem.
- **Claude** – Zakładka wyświetla URL serwera MCP oraz kroki konfiguracji dla Claude. Pola OAuth Client ID i Secret należy pozostawić puste; Claude rejestruje się automatycznie i uwierzytelnia przez Heym OAuth.
- **ChatGPT** – Zakładka wyświetla adres URL serwera MCP oraz kroki konfiguracji aplikacji ChatGPT. Włącz tryb deweloperski, utwórz aplikację z tym adresem URL i wybierz OAuth; ChatGPT zarejestruje się automatycznie.
- **Gemini** – Zakładka wyświetla adres URL serwera MCP oraz kroki konfiguracji niestandardowej aplikacji Gemini: w gemini.google.com przejdź do **Settings → Connected Apps → Add a custom app**, wklej adres URL i pozostaw sekcję **Advanced features** zamkniętą; Gemini zarejestruje się automatycznie i uwierzytelni przez Heym OAuth. Po połączeniu Heym działa również w aplikacji mobilnej Gemini.

### Przełącznik MCP dla workflow

Każdy workflow może być udostępniony jako narzędzie MCP:

- **Enable** – Narzędzia workflow stają się dostępne dla wszystkich klientów połączonych z serwerem domyślnym
- **Disable** – Workflow nie jest udostępniany

Karty workflow pokazują opis oraz podgląd nazw pól wejściowych, dzięki czemu można sprawdzić, czego oczekuje każde narzędzie, przed jego włączeniem.

## Narzędzie czatu Heym

Sekcja **Heym Capabilities** zamienia mechanizm zakładki Chat w jedno narzędzie MCP o nazwie `heym_chat`. Można je włączyć na serwerze domyślnym, na dowolnym serwerze nazwanym lub na obu — każda powierzchnia ma własny przełącznik i wybór modelu.

Gdy narzędzie jest włączone, `heym_chat` pojawia się w `tools/list` obok narzędzi workflow. Klient MCP wysyła jedną wiadomość w języku naturalnym, a mechanizm Heym przejmuje zadanie, dysponując tymi samymi możliwościami co zakładka Chat:

- Tworzenie workflow, testowe uruchamianie go z przykładowymi danymi wejściowymi, naprawianie błędów i kończenie po pomyślnym przebiegu (zobacz [Tryb budowania](#build-mode))
- Inspekcja i uruchamianie istniejących workflow
- Raportowanie analityki, ostatnich wykonań oraz nadchodzących harmonogramów cron
- Raportowanie historii uruchomień jednego workflow: ile razy został uruchomiony, liczby statusów, kiedy był uruchamiany, a na żądanie — dane wejściowe, wyjściowe oraz błędy poszczególnych węzłów pojedynczego uruchomienia
- Raportowanie, co dzieje się w danej chwili: ile wykonań jest aktywnych, ich nazwy workflow, jak długo każde trwa, na którym węźle się obecnie znajduje oraz link do uruchomienia na żywo
- Wyświetlanie tablic, tworzenie kart i odczytywanie szczegółów kart w [zakładce Board](./board-tab.md)
- Wyświetlanie tabel danych wraz z ich kolumnami, tworzenie nowych oraz podłączanie ich do budowanych workflow
- Odczyt zespołów i zmiennych globalnych oraz przeszukiwanie dokumentacji
- Zatwierdzanie, edycja lub odrzucanie oczekujących przeglądów human-in-the-loop

Możliwości dodane później do zakładki Chat stają się automatycznie dostępne przez `heym_chat` — nie ma osobnego przełącznika dla każdej możliwości, który trzeba synchronizować.

### Tryb budowania

`heym_chat` zawsze uruchamia silnik czatu w trybie budowania (build mode). W jednym wywołaniu asystent może zapisać nowy workflow, uruchomić go z realistycznymi przykładowymi danymi wejściowymi, odczytać raport z wykonania, naprawić to, co się nie powiodło, i uruchomić go ponownie — maksymalnie do pięciu uruchomień testowych na wywołanie. Gdy ostatnie uruchomienie ostatnio zapisanej wersji zakończy się powodzeniem, asystent kończy pracę jednozdaniowym podsumowaniem, a odpowiedź kończy się komunikatem `Verified: the latest test run of the saved workflow passed.`

- Uruchomienia testowe to prawdziwe uruchomienia. Ich efekty uboczne faktycznie występują i pojawiają się w historii wykonań workflow tak samo jak każde inne uruchomienie.
- Zapisy korzystają ze ścieżki edytora: zmiana grafu zachowuje poprzednią wersję grafu w historii edycji (**Edit History**) danego workflow.
- Aby zmodyfikować wcześniej zbudowany workflow, kontynuuj wątek z tym samym `conversation_id`. Asystent zaktualizuje ten workflow zamiast tworzyć nowy i zmodyfikuje wyłącznie te workflow, które masz uprawnienia edytować.
- Gdy limit pięciu uruchomień testowych zostanie wyczerpany, asystent zatrzymuje się i wyjaśnia, co nadal powoduje błąd.

Dane logowania pozostają w interfejsie: `heym_chat` nigdy ich nie wyświetla, nie wybiera ani nie tworzy. Gdy buduje lub edytuje workflow, nowe węzły wymagające danych logowania pozostają puste, a odpowiedź je wymienia, aby można było ustawić je w edytorze.

Tabele danych działają inaczej. Tabela nie zawiera żadnych sekretów, dlatego `heym_chat` może wyświetlać tabele, pytać, której z nich powinien użyć workflow, oraz tworzyć nową tabelę wraz z jej kolumnami. Nigdy nie odczytuje ani nie zapisuje wierszy.

### Dane logowania i model

`heym_chat` uruchamia mechanizm na koncie Heym, dlatego wymaga własnych danych logowania do LLM:

| Pole | Zachowanie |
|-------|----------|
| **Credential** | Należy wybrać dowolne dane logowania OpenAI, Google lub Custom, do których istnieje dostęp. Wstępnie wypełniane na podstawie preferowanych danych logowania w [Settings](../reference/user-settings.md), gdy żadne nie zostały wybrane. |
| **Model** | Ładowany z wybranych danych logowania. Wstępnie wypełniany na podstawie preferowanego modelu, gdy dane logowania są zgodne. |

Jeśli któregokolwiek brakuje, narzędzie nadal pojawia się w `tools/list`, ale każde wywołanie zwraca błąd z informacją, że konfigurację należy dokończyć w tej zakładce.

### Argumenty i historia

| Argument | Wymagany | Opis |
|----------|----------|-------------|
| `message` | Tak | Instrukcja lub pytanie w języku naturalnym. |
| `conversation_id` | Nie | Identyfikator `conversation_id` z poprzedniego wyniku `heym_chat`, służący do kontynuowania tego wątku. |

Każde wywołanie jest zapisywane w historii [zakładki Chat](./chat-tab.md) jako zwykła rozmowa, oznaczona ikoną wtyczki na liście rozmów. Wiadomości, karty narzędzi i pauzy na doprecyzowanie wyglądają dokładnie tak samo jak rozmowa rozpoczęta samodzielnie, a wątek można otworzyć i kontynuować rozmowę w przeglądarce. Każdy wynik zwraca swój `conversation_id`, dzięki czemu klient MCP może kontynuować ten sam wątek, zamiast otwierać nowy przy każdym wywołaniu.

Gdy asystent potrzebuje doprecyzowania, wstrzymuje się i informuje o tym; odpowiedzi należy przekazać z użyciem tego samego `conversation_id`.
## Serwery MCP o nazwach własnych

Serwery o nazwach własnych pozwalają segmentować workflow na izolowane endpointy MCP. Każdy serwer ma własny URL i klucz API, dzięki czemu różni klienci AI, zespoły lub przypadki użycia mogą łączyć się dokładnie z tymi workflow, których potrzebują.

### Tworzenie serwera o nazwie własnej

1. Wprowadź nazwę w polu tekstowym na dole zakładki MCP (np. **CRM Tools**)
2. Kliknij **Create** — nowa karta serwera pojawi się natychmiast
3. Kliknij kartę, aby ją rozwinąć

### Ustawienia poszczególnych serwerów

Każda karta serwera zawiera:

| Ustawienie | Opis |
|---------|-------------|
| **SSE Endpoint** | Unikalny URL: `{origin}/api/mcp/servers/{uuid}/sse` |
| **API Key** | Niezależny klucz, wyświetlany jednorazowo przy generowaniu lub regeneracji. Należy skopiować go od razu; jest przechowywany w formie zahashowanej i nie może zostać później ujawniony |
| **How to connect** | **Copy JSON** kopiuje gotową do wklejenia konfigurację MCP; **Add to Cursor** instaluje ją jednym kliknięciem |
| **Heym Capabilities** | Przełącz narzędzie `heym_chat` dla tego serwera i wybierz jego dane logowania oraz model |
| **Assigned Workflows** | Przełącz, które z workflow mają być udostępniane przez ten serwer |

### Przypisywanie workflow

Przypisywanie workflow odbywa się per serwer i jest niezależne od przełącznika serwera domyślnego. Workflow może być włączony jednocześnie na serwerze domyślnym i na wielu serwerach o nazwach własnych albo na żadnym z nich.

Przełączenie workflow przenosi go na górę listy przypisanych, dzięki czemu właśnie zmodyfikowany wiersz pozostaje widoczny zamiast przewijać się poza ekran.

### Uwierzytelnianie

Serwery o nazwach własnych obsługują te same metody uwierzytelniania co serwer domyślny:

- **Nagłówek X-MCP-Key** – Przekazuje klucz API serwera bezpośrednio (klienci API, Cursor). Wyłącznie jako nagłówek: klucze nie są akceptowane jako parametr zapytania `?key=`, ponieważ URL-e trafiają do logów dostępu, logów proxy i historii przeglądarki.
- **Claude, ChatGPT i Gemini OAuth** – Dodaj URL serwera do konektorów lub niestandardowych aplikacji klienta; pozostaw dane logowania puste, a klient zarejestruje się automatycznie przez OAuth. Token bearer musi być przekazywany w nagłówku `Authorization`, a nie jako `?token=`.
- **Token sesji** – Wydawany podczas handshake SSE; ograniczony do konkretnego serwera, więc tokeny z jednego serwera o nazwie własnej nie mogą uzyskać dostępu do innego. Ten krótkotrwały parametr `?session=` nie podlega tym ograniczeniom.

### Usuwanie serwera o nazwie własnej

Kliknij ikonę **X** w nagłówku karty serwera. Usunięcie powoduje skasowanie serwera i wszystkich jego przypisań workflow; same workflow nie są modyfikowane.

## SSE Endpoint

| Serwer | Endpoint |
|--------|----------|
| Domyślny | `{origin}/api/mcp/sse` |
| o nazwie własnej | `{origin}/api/mcp/servers/{server-uuid}/sse` |

Oba endpointy obsługują transport SSE (GET, specyfikacja MCP 2024-11-05) oraz transport Streamable HTTP (POST, specyfikacja MCP 2025-03-26). Claude, ChatGPT i Gemini używają OAuth 2.1 / PKCE do bezpiecznego logowania w obu przypadkach.

## Powiązane

- [Dlaczego Heym](../getting-started/why-heym.md) – MCP jako podstawowy element w Heym
- [Węzeł Agent](../nodes/agent-node.md) – Węzeł Agent z obsługą narzędzi MCP
- [Architektura agenta](../reference/agent-architecture.md) – Klient MCP, dyspozycja narzędzi, orkiestrator
- [Triggery](../reference/triggers.md) – MCP jako punkt wejścia workflow
- [Zakładka Chat](./chat-tab.md) – Silnik stojący za narzędziem `heym_chat`
- [Zakładka Workflows](./workflows-tab.md) – Tworzenie workflow i zarządzanie nimi
- [Typy węzłów](../reference/node-types.md) – Przegląd węzłów AI
- [Contextual Showcase](../reference/contextual-showcase.md) – Zwięzły przewodnik po powierzchniach dashboardu
