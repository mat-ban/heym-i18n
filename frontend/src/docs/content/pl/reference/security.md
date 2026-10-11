# Bezpieczeństwo

Praktyki i konfiguracja bezpieczeństwa dla platformy Heym.

## Polityka haseł

Wszystkie hasła — zarówno przy rejestracji, jak i przy zmianie hasła — muszą spełniać następujące wymagania:

| Reguła | Wymaganie |
|------|-------------|
| Minimalna długość | 8 znaków |
| Wielkie litery | Co najmniej jedna wielka litera (A–Z) |
| Małe litery | Co najmniej jedna mała litera (a–z) |
| Cyfra | Co najmniej jedna cyfra (0–9) |

Reguły te są egzekwowane zarówno po stronie frontendu, jak i backendu (walidator Pydantic). Żądanie z hasłem niespełniającym wymagań jest odrzucane z odpowiedzią `422 Unprocessable Entity`, zanim nastąpi jakikolwiek zapis do bazy danych.

**Przykład prawidłowego hasła:** `MyWorkflow7!`

## Zarządzanie sesjami

- Tokeny dostępu są przechowywane w ciasteczkach **HttpOnly**, a nie w `localStorage`. Zapobiega to odczytaniu tokenu przez JavaScript (w tym przez payloady XSS).
- Token odświeżania jest ograniczony do ścieżki `/api/auth/refresh` i nie może być wysyłany do innych endpointów.
- Każde wywołanie `/api/auth/refresh` **rotuje** token odświeżania: stary token jest natychmiast unieważniany, a wydawany jest nowy. Ponowne użycie wykorzystanego tokenu odświeżania zwraca `401`.

## Ograniczanie liczby żądań

Następujące endpointy mają ograniczenia liczby żądań na IP:

| Endpoint | Limit | Czas blokady |
|----------|-------|--------------|
| `POST /api/auth/login` | 10 żądań / 60 s | 15 min |
| `POST /api/auth/register` | 5 żądań / 60 s | 10 min |
| `POST /register` (klienci OAuth) | 5 żądań / 60 s | 10 min |
| Logowanie do portalu | 3 próby | 24 h |

Gdy skonfigurowano `REDIS_URL`, limity liczby żądań są współdzielone między wszystkimi procesami roboczymi backendu. Bez tej zmiennej limity obowiązują osobno dla każdego procesu roboczego.

## Szyfrowanie danych logowania

Wszystkie klucze API, adresy URL webhooków i tokeny bearer przechowywane w panelu [Dane logowania](../tabs/credentials-tab.md) są szyfrowane w spoczynku przy użyciu AES-256 (Fernet), zanim zostaną zapisane w bazie danych. Klucz jest wyprowadzany ze zmiennej środowiskowej `ENCRYPTION_KEY`. Skrypty `run.sh` i `deploy.sh` automatycznie generują silną wartość, gdy jest pusta; aplikacja odmawia uruchomienia, jeśli `ENCRYPTION_KEY` jest pusta lub pozostawiona na znanym placeholderze.

## Klucz API MCP

Klucz API MCP służy do uwierzytelniania zewnętrznych klientów MCP łączących się z endpointem `/api/mcp/sse`. Po nawiązaniu połączenia SSE wydawany jest krótkotrwały (1-godzinny) token sesji, który jest osadzany w adresie URL endpointu wiadomości zamiast prawdziwego klucza API, co zapobiega pojawianiu się klucza w logach dostępu serwera. Konfigurację opisano w sekcji [Zakładka MCP](../tabs/mcp-tab.md).

## OAuth / PKCE

Serwer autoryzacji OAuth 2.0 (używany dla klientów MCP) obsługuje wyłącznie grant `authorization_code` z PKCE (`S256`). Formularz zgody wykorzystuje tokeny CSRF HMAC-SHA256 ważne przez 10 minut. Wszystkie wartości wyświetlane na stronie zgody są escapowane w HTML.

## Tokeny wykonania

[Tokeny wykonania](./execution-tokens.md) to tokeny JWT o ograniczonym zakresie, służące do wywoływania endpointu wykonania workflow z systemów zewnętrznych. W odróżnieniu od tokenów sesji użytkownika charakteryzują się tym, że:

- **Mają zakres pojedynczego workflow** — token jest odrzucany dla każdego innego workflow.
- **Można je niezależnie unieważniać** — unieważnienie tokenu nie ma wpływu na sesję użytkownika, który go wydał.
- **Mają krótki lub długi czas życia** — TTL można wybrać od 60 sekund do 10 lat.

Tokeny są podpisywane tym samym sekretem aplikacji (`SECRET_KEY`) i sprawdzane przy każdym żądaniu: podpis, ważność, zgodność roszczenia `wid` oraz status unieważnienia. Konfigurację i dokumentację API opisano w sekcji [Tokeny wykonania](./execution-tokens.md).

## Bezpieczeństwo treści

Należy stosować [Guardrails](./guardrails.md) na węzłach LLM i Agent, aby blokować niebezpieczne lub naruszające politykę wiadomości użytkownika, zanim dotrą do modelu. Guardrails obsługują dziewięć kategorii treści (przemoc, mowa nienawiści, treści seksualne itp.) z konfigurowalnymi poziomami czułości.

## Piaskownica narzędzi Python

Zdefiniowane przez użytkownika narzędzia Python w [węźle Agent](../nodes/agent-node.md) wykonują niezaufany kod. Domyślnie Heym uruchamia każde narzędzie w zahartowanym, jednorazowym kontenerze Docker z:

- brakiem dostępu do sieci,
- systemem plików głównych tylko do odczytu z małym katalogiem roboczym `tmpfs`,
- użytkownikiem niebędącym rootem z odebranymi wszystkimi uprawnieniami Linux i flagą `no-new-privileges`,
- ścisłymi limitami CPU, pamięci i PID oraz
- **brakiem zamontowanego gniazda Docker**, dzięki czemu narzędzie nie może uzyskać dostępu do demona Docker hosta.

Backend wykonania jest kontrolowany przez zmienną środowiskową `HEYM_PYTHON_TOOL_SANDBOX`:

| Wartość | Zachowanie |
|-------|----------|
| `auto` (domyślnie) | Uruchomienie w zahartowanym kontenerze Docker. Jeśli Docker jest niedostępny, wykonanie **kończy się niepowodzeniem w trybie fail-closed** — nie uruchamia po cichu niezaufanego kodu bez izolacji systemu operacyjnego. |
| `docker` | To samo co `auto`, ale bez żadnego fallbacku. |
| `subprocess` | Uruchomienie w lokalnym podprocesie w tym samym procesie, chronionym listą dozwolonych importów. **Nie stanowi to granicy bezpieczeństwa** i jest przeznaczone wyłącznie dla zaufanego kodu lub lokalnego rozwoju. `run.sh` wybiera ten tryb dla natywnego środowiska deweloperskiego. |

Aby przypiąć obraz piaskownicy, należy ustawić `HEYM_PYTHON_TOOL_IMAGE`; gdy jest pusta, Heym automatycznie wykrywa działający obraz backendu. Ograniczenia w procesie (lista dozwolonych importów oraz filtrowanie atrybutów i introspekcji) są stosowane jako obrona w głąb, ale to kontener stanowi rzeczywistą granicę izolacji — w środowiskach wieloużytkownikowych i produkcyjnych należy zachować domyślny tryb `auto` (lub `docker`).
## Sandbox umiejętności

Umiejętności Python dołączone do [węzła Agent](../nodes/agent-node.md) również wykonują niezaufany kod — umiejętność może pojawić się dosłownie w udostępnionym workflow lub w szablonie o widoczności `everyone` — dlatego umiejętności działają przez **ten sam** przełącznik `HEYM_PYTHON_TOOL_SANDBOX` co narzędzia Python i w taki sam sposób kończą się bezpiecznym niepowodzeniem. Kontener umiejętności jest zahartowany identycznie (użytkownik niebędący rootem, wszystkie uprawnienia odebrane, `no-new-privileges`, system plików głównych tylko do odczytu, limity CPU/pamięci/PID oraz **brak gniazda Docker**), z dwiema celowymi różnicami, ponieważ umiejętności zgodnie z przeznaczeniem ich potrzebują:

- **Ruch sieciowy wychodzący jest dozwolony** (umiejętności wywołują API i instalują własne zależności przez `uv`) oraz
- **montowany jest zapisywalny obszar roboczy**, aby umiejętności mogły generować pliki wyjściowe i odczytywać pliki Heym Drive.

Obszar roboczy jest współdzielony z jednorazowym kontenerem towarzyszącym przez ten sam nazwany wolumen Docker, którego używa runner Codex (`heym-codex-workspaces`, montowany pod `/app/data/codex-workspaces`). Do kontenera towarzyszącego montowany jest wyłącznie podkatalog bieżącego uruchomienia — przez `volume-subpath` dla danego uruchomienia — dzięki czemu jedna umiejętność nigdy nie widzi danych obszaru roboczego innego uruchomienia ani Codex. Stack Docker Compose zawsze montuje ten wolumen; w przypadku pojedynczego kontenera `docker run` należy dodać `-v heym-codex-workspaces:/app/data/codex-workspaces` zarówno dla umiejętności Python, jak i dla Codex. Jeśli wolumen jest nieobecny w trybie `auto`/`docker`, wykonanie umiejętności **kończy się bezpiecznym niepowodzeniem**, zamiast uruchamiać się w backendzie. Ponieważ montowanie podścieżek dla danego uruchomienia wymaga **Docker Engine 25.0 lub nowszego**, starsze silniki należy zaktualizować albo uruchamiać zaufane umiejętności z `HEYM_PYTHON_TOOL_SANDBOX=subprocess`.

Do kontenera przekazywane są wyłącznie niebędące sekretami, przenośne zmienne środowiskowe (ustawienia proxy i pakietu CA, ustawienia regionalne); adresy URL baz danych, `SECRET_KEY`/`ENCRYPTION_KEY`, klucze API dostawców oraz sekrety OAuth są wstrzymywane przez listę dozwolonych. Ścieżki plików umiejętności są walidowane pod kątem pozostania w obszarze roboczym, a dowiązania symboliczne umieszczone w katalogu wyjściowym (w tym sentinel `_hitl_request.json`) nigdy nie są podążane. W razie potrzeby należy zastąpić wartości domyślne przez `HEYM_SKILL_IMAGE`, `HEYM_SKILL_NETWORK`, `HEYM_SKILL_MEMORY`, `HEYM_SKILL_CPUS`, `HEYM_SKILL_PIDS` oraz `HEYM_SKILL_USER`.

Podobnie jak w przypadku narzędzi, tryb `subprocess` uruchamia umiejętność w procesie backendu i **nie stanowi granicy bezpieczeństwa** — należy go używać wyłącznie dla zaufanych środowisk jednoużytkownikowych lub lokalnego rozwoju (`run.sh` wybiera go dla natywnego rozwoju).

## Sandbox węzła Code

[Węzeł Code](../nodes/code-node.md) uruchamia dowolny kod Python użytkownika wraz z dowolnymi zależnościami zewnętrznymi, dlatego jest najsurowszym z trzech sandboxów i jedynym **bez furtki awaryjnej**: nie odczytuje żadnej zmiennej trybu sandbox, nie ma trybu `subprocess` i kończy się bezpiecznym niepowodzeniem, gdy żaden demon Docker nie jest osiągalny. Nigdy nie przechodzi do uruchamiania kodu użytkownika w procesie backendu.

Wykonanie odbywa się w jednym lub dwóch jednorazowych kontenerach, oba zahartowane jak sandboxy narzędzi i umiejętności (użytkownik niebędący rootem, wszystkie uprawnienia odebrane, `no-new-privileges`, system plików głównych tylko do odczytu, limity CPU/pamięci/PID oraz **brak gniazda Docker**):

- Przy pustym `requirements.txt` kod uruchamia **pojedynczy kontener z `--network none`**. Runner trafia do kontenera przez stdin, więc nic nie jest montowane.
- Przy zależnościach pierwszy kontener instaluje je z dostępem do sieci do katalogu `.deps` dla danego uruchomienia, a drugi kontener montuje to poddrzewo **tylko do odczytu** i uruchamia kod. Kontener wykonawczy nie ma sieci, chyba że opcja `codeAllowNetwork` węzła zostanie włączona.

Zależności są instalowane przez `uv`, ponawiane przez `pip` i nigdy nie są buforowane między uruchomieniami. Gdy backend działa w kontenerze, katalog dla danego uruchomienia znajduje się na tym samym wolumenie `heym-codex-workspaces`, którego używa sandbox umiejętności, montowanym przez `volume-subpath` dla danego uruchomienia, dzięki czemu jedno uruchomienie nigdy nie widzi plików innego; ta forma wymaga **Docker Engine 25.0 lub nowszego**. Natywny backend (`./run.sh`) nie ma takiego wolumenu i go nie potrzebuje — jego katalog dla danego uruchomienia to lokalna ścieżka tymczasowa montowana bezpośrednio do kontenera towarzyszącego. W obu przypadkach katalog jest usuwany po każdym wykonaniu niezależnie od wyniku.

Do kontenerów przekazywane są wyłącznie niebędące sekretami, przenośne zmienne środowiskowe — ustawienia proxy, pakiety CA i ustawienia regionalne, których instalacja zależności potrzebuje do połączenia z PyPI za firmowym proxy. Adresy URL baz danych, `SECRET_KEY`/`ENCRYPTION_KEY`, klucze API dostawców oraz sekrety OAuth są wstrzymywane przez listę dozwolonych, dzięki czemu nowy sekret backendu jest domyślnie pomijany, a nie ujawniany, dopóki ktoś nie zaktualizuje listy zabronionych. Zmienna `HOME` backendu nigdy nie nadpisuje własnej zapisywalnej ścieżki sandboxa.

Przycisk **Format** korzysta z tego samego sandboxa. Ruff analizuje i przepisuje źródło, zamiast je wykonywać, ale uruchomienie go na hoście backendu dałoby niezaufanemu plikowi proces dziedziczący całe środowisko backendu, dlatego otrzymuje własny jednorazowy kontener `--network none` z tymi samymi limitami i tym samym środowiskiem z listy dozwolonych. Kończy się bezpiecznym niepowodzeniem bez Docker, zamiast formatować na hoście.

Limity sandboxa są stałymi, a nie zmiennymi środowiskowymi — 512 MB pamięci, jeden CPU, 256 procesów, 120-sekundowy limit czasu instalacji i 60-sekundowy limit czasu wykonania. Obraz jest rozwiązywany z istniejącego łańcucha `HEYM_PYTHON_TOOL_IMAGE` / `HEYM_CODEX_DOCKER_IMAGE`; węzeł nie wprowadza własnej konfiguracji.
## Powiązane

- [Uruchamianie i wdrażanie](../getting-started/running-and-deployment.md) – Konfiguracja `SECRET_KEY`, `ENCRYPTION_KEY`, `ALLOW_REGISTER` oraz `HEYM_PYTHON_TOOL_SANDBOX` podczas uruchamiania
- [Węzeł Code](../nodes/code-node.md) – Wykonywanie kodu Python w sandboxie z własnymi zależnościami
- [Węzeł Agent](../nodes/agent-node.md) – Niestandardowe narzędzia Python uruchamiane w sandboxie
- [Tokeny wykonania](./execution-tokens.md) – Ograniczone zakresem tokeny JWT do wywoływania workflow z systemów zewnętrznych
- [Guardrails](./guardrails.md) – Blokowanie niebezpiecznych treści w węzłach LLM i Agent
- [Ustawienia](./user-settings.md) – Zmiana hasła
- [Karta Dane logowania](../tabs/credentials-tab.md) – Zarządzanie kluczami API
- [Karta MCP](../tabs/mcp-tab.md) – Klucz API MCP oraz klienci OAuth
- [Portal](./portal.md) – Kontrola dostępu do publicznego portalu Chat
