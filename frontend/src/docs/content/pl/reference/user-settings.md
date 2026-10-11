# Ustawienia

Okno dialogowe Ustawienia umożliwia zarządzanie profilem, ustawianie trwałych instrukcji AI, aktualizację hasła do konta, konfigurację głosu w czacie, ustawienie domyślnych danych logowania i modelu AI oraz przegląd statusu obserwowalności. Aby je otworzyć, należy kliknąć **awatar i nazwę** w prawym górnym rogu nagłówka.

## Otwieranie okna dialogowego

Należy kliknąć **awatar i nazwę** w prawym górnym rogu nagłówka. Okno dialogowe otwiera się z następującymi zakładkami: **Profil**, **Bezpieczeństwo**, **Głos**, **Domyślne ustawienia AI** oraz **Obserwowalność**. Administratorzy instancji widzą również zakładkę **SSO**.

## Zakładka Profil

### Zdjęcie profilowe

Heym wyświetla zdjęcie z [Gravatar](https://gravatar.com) przypisane do adresu e-mail konta w nagłówku, obok wiadomości w zakładce [Chat](../tabs/chat-tab.md) oraz w **Chat with Heym**, przy komentarzach na [Tablicy](../tabs/board-tab.md), a także obok nazwy w oknach udostępniania i listach członków zespołu. Aby je zmienić, należy zaktualizować zdjęcie w Gravatar; Heym pobierze nowe w ciągu kilku godzin. Bez zdjęcia w Gravatar Heym wyświetla pierwszą literę nazwy.

Zdjęcie jest pobierane przez serwer Heym i tam buforowane, dzięki czemu przeglądarka nigdy nie łączy się z Gravatar. Jeśli serwer nie może połączyć się z Gravatar, wszyscy nadal widzą inicjały.

### Nazwa

Nazwa wyświetlana w całej aplikacji. To pole jest wymagane i nie może pozostać puste.

### Reguły użytkownika

Reguły użytkownika to niestandardowe instrukcje automatycznie wstrzykiwane do każdego żądania AI — zarówno w kreatorze workflow, jak i w czacie dashboardu. W **kreatorze workflow** ([Asystent AI](./ai-assistant.md)) są one dołączane do promptu systemowego używanego do generowania JSON workflow. W **czacie dashboardu** są stosowane jako kontekst na poziomie systemowym. Wystarczy zapisać je raz, a będą stosowane globalnie bez konieczności powtarzania ich w każdym promptcie.

**Typowe zastosowania:**

- Język lub ton: `Always respond in English. Keep responses concise.`
- Styl kodowania: `Use async/await patterns. Prefer TypeScript interfaces over types.`
- Konwencje workflow: `Include error handling in all workflows. Use descriptive node labels.`
- Format odpowiedzi: `Use bullet points. Avoid lengthy explanations.`

**Gdzie są stosowane:**

| Kontekst | Opis |
|---------|-------------|
| **Kreator workflow** | Żądania [Asystenta AI](./ai-assistant.md) dotyczące generowania lub modyfikowania workflow |
| **Czat dashboardu** | Wszystkie rozmowy w zakładce [Chat](../tabs/chat-tab.md) |

Reguły użytkownika są wstrzykiwane na poziomie systemowym — są uruchamiane przed każdym promptem automatycznie, bez dodatkowej konfiguracji dla poszczególnych workflow czy rozmów.

### Zapisywanie zmian w profilu

Aby zastosować zmiany, należy kliknąć **Zapisz zmiany**. Zmiany zaczynają obowiązywać natychmiast dla wszystkich nowych żądań AI.

## Zakładka Bezpieczeństwo

### Zmiana hasła

Zakładka Bezpieczeństwo służy do aktualizacji hasła do konta.

**Wymagania:**

| Reguła | Wymóg |
|------|-------------|
| Minimalna długość | 8 znaków |
| Wielkie litery | Co najmniej jedna wielka litera (A–Z) |
| Małe litery | Co najmniej jedna mała litera (a–z) |
| Cyfra | Co najmniej jedna cyfra (0–9) |

Hasło musi również różnić się od obecnego hasła. Reguły te są egzekwowane zarówno po stronie frontendu, jak i backendu.

**Kroki:**

1. Wprowadź **Obecne hasło**
2. Wprowadź **Nowe hasło** (musi spełniać wszystkie powyższe wymagania)
3. Wprowadź ponownie w polu **Potwierdź nowe hasło**
4. Kliknij **Zaktualizuj hasło**

Jeśli obecne hasło jest nieprawidłowe, wyświetlany jest komunikat błędu wbudowany w formularz. Po pomyślnej zmianie pojawia się komunikat potwierdzający, a formularz resetuje się automatycznie.

## Zakładka Głos

Zakładka Głos konfiguruje mowę dla zakładki [Chat](../tabs/chat-tab.md): należy wybrać **dane logowania ElevenLabs** (lub dodać je bezpośrednio), wybrać **Głos** ze swojego konta ElevenLabs i kliknąć **Zapisz ustawienia głosu**. Umożliwia to odczytywanie poszczególnych wiadomości na głos oraz interaktywny tryb głosowy. Pełny przebieg opisano w sekcji [Głos w czacie (TTS i STT)](./chat-voice.md).

## Zakładka Domyślne ustawienia AI

Zakładka Domyślne ustawienia AI zawiera dwie sekcje.

### Preferowane dane logowania i model

Należy wybrać **preferowane dane logowania LLM** oraz **model** z nich. Stają się one domyślnym punktem wyjścia dla każdej funkcji AI w aplikacji — czatu, [Asystenta AI](./ai-assistant.md) (kreator, analizator i tworzenie workflow), mapera tablicy, widżetów AI dashboardu, [czatu dokumentacji](../tabs/chat-tab.md), pomocnika schematu AI tabel danych, kreatora wyrażeń oraz ewaluacji — zawsze gdy dany obszar nie ma własnego zapisanego wyboru.

Reguła wyboru stosowana w każdym obszarze jest następująca:

1. **Zapisany wybór** — wybór dokonany wcześniej w danym obszarze (na przykład ostatni model w rozmowie czatu) zawsze ma pierwszeństwo.
2. **Preferowane** — stosowane, gdy nie ma zapisanego wyboru.
3. **Pierwsze dostępne dane logowania** — opcja zapasowa, gdy nie ustawiono preferencji.

Dane logowania i model można nadal zmieniać w każdym obszarze w dowolnym momencie; preferencja jedynie wypełnia początkową wartość domyślną. Aby zachować poprzednie zachowanie polegające na użyciu pierwszych danych logowania, należy pozostawić pole danych logowania jako **Bez preferencji**. Jeśli preferowane dane logowania zostaną później usunięte lub udostępnianie zostanie cofnięte, zakładka wyświetli powiadomienie, a obszary w sposób cichy powrócą do pierwszych dostępnych danych logowania.
### Korzystanie z pakietu Coding

Dla każdego poświadczenia **Codex** (w tym udostępnionych) zakładka wyświetla pozostały limit użycia w postaci poziomego paska dla każdego aktywnego okna — na przykład okna **5 godzin** i/lub okna **Tygodniowego**, w zależności od planu. Każdy pasek pokazuje procent pozostałego limitu oraz odliczanie do resetu. Przycisk **Odśwież** pobiera dane na żądanie (wyniki są krótko buforowane po stronie serwera).

Dla każdego poświadczenia **OpenCode** zakładka wyświetla okna subskrypcji OpenCode Go — **5 godzin**, **Tygodniowe** i **Miesięczne** — w tym samym stylu paska, odczytywane z uwierzytelnionego endpointu użycia bramy za pomocą klucza API danego poświadczenia. Okno, które osiągnęło swój limit, jest wyświetlane jako **„limit reached"** w kolorze bursztynowym. Jeśli klucz jest nieprawidłowy lub przestrzeń robocza nie ma subskrypcji Go, karta wyjaśnia przyczynę zamiast wyświetlać paski.

## Zakładka Observability

Zakładka Observability wyświetla status tylko do odczytu [OpenTelemetry Tracing](./opentelemetry.md) dla tej instancji: czy śledzenie jest włączone, endpoint OTLP, nazwę usługi, współczynnik samplera oraz które spany są emitowane. Śledzenie jest konfigurowane za pomocą zmiennych środowiskowych `HEYM_OTEL_*` na backendzie, więc ta zakładka niczego nie edytuje. Gdy śledzenie jest wyłączone, zakładka wyświetla listę zmiennych środowiskowych potrzebnych do jego włączenia. Sekrety, takie jak nagłówki uwierzytelniające OTLP, nigdy nie są tu pokazywane. Pełne odniesienie konfiguracji znajduje się w [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

## Zakładka SSO

Widoczna tylko dla administratorów instancji — kont wymienionych w `HEYM_ADMIN_EMAILS`. Ta zakładka łączy Heym z zewnętrznym dostawcą OpenID Connect, aby użytkownicy logowali się za pomocą kont, które już posiadają. Należy wprowadzić adres URL wystawcy i dane logowania klienta, skopiować adres URI przekierowania (tylko do odczytu) do swojego dostawcy i uruchomić **Test połączenia** przed włączeniem. Po pomyślnym teście można stąd wyłączyć logowanie hasłem. Pełna konfiguracja znajduje się w [Single Sign-On](./sso.md).

## Zakładka Instances

Widoczna tylko dla administratorów instancji — kont wymienionych w `HEYM_ADMIN_EMAILS`. Ta zakładka wyświetla listę instancji Heym połączonych z tą bazą danych i określa, jak zadania w tle są rozdzielane między nimi. Każdy wiersz pokazuje edytowalną nazwę instancji, jej rolę, czy jest aktywna, zmierzone opóźnienie do bazy danych, przełącznik włącz/wyłącz oraz jej wagę. Wagi to udziały instancji, które mogą obecnie przyjmować zadania, a nie procenty ze 100: przy `41 / 26 / 33` i wyłączonej trzeciej instancji dwie pierwsze otrzymują faktycznie 61% i 39%. Panel wyświetla ten efektywny podział pod tabelą i odmawia zapisu tylko wtedy, gdy żadna włączona instancja nie ma w ogóle wagi.

**Automatyczne przydzielanie udziału nowym instancjom** jest domyślnie włączone: instancja, która dołącza, w przeciwnym razie miałaby wagę 0 i nie otrzymywałaby niczego, więc lider jednorazowo przydziela jej równy udział i proporcjonalnie zmniejsza istniejące wagi, zachowując ich proporcje. Nigdy nie modyfikuje instancji, której wagę ustawiono ręcznie.

Panel informuje również, ile z zadań z ostatnich 24 godzin mogło zostać wykonanych wyłącznie na instancji głównej. Gdy ten udział jest wysoki, wagi poniżej nie mogą przenieść tych zadań. Informacje o tym, co pozostaje na instancji głównej i jak dobrać wartości, znajdują się w [Load Distribution](./cluster.md).

## Czego nie ma w tym oknie dialogowym

| Funkcja | Gdzie ją znaleźć |
|---------|-----------------|
| **Zarządzanie kluczem API (MCP)** | [Zakładka MCP](../tabs/mcp-tab.md) – wyświetlanie, kopiowanie i regenerowanie klucza API serwera MCP |
| **Motyw (ciemny / jasny)** | Przycisk przełączania Słońce/Księżyc w nagłówku (obok plakietki użytkownika) |
| **Zmiana adresu e-mail** | Obecnie nieobsługiwane |

## Powiązane

- [Asystent AI](./ai-assistant.md) – Chat kreatora Workflow korzystający z User Rules
- [Zakładka Chat](../tabs/chat-tab.md) – Chat dashboardu korzystający z User Rules
- [Chat Voice (TTS i STT)](./chat-voice.md) – Głos ElevenLabs konfigurowany w zakładce Voice
- [Zakładka MCP](../tabs/mcp-tab.md) – Klucz API serwera MCP i udostępnianie narzędzi Workflow
- [Zakładka Dane logowania](../tabs/credentials-tab.md) – Klucze API dla węzłów AI i integracji
- [Bezpieczeństwo](./security.md) – Zarządzanie sesjami, ograniczanie liczby żądań, szyfrowanie danych logowania
- [Single Sign-On](./sso.md) – Łączenie z zewnętrznym dostawcą OpenID Connect
- [OpenTelemetry Tracing](./opentelemetry.md) – Śledzenie rozproszone dla wykonań Workflow i węzłów
