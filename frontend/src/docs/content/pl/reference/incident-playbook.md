# Heym Incident Playbook (L0)

Użyj tego playbooka, aby potwierdzić incydent w Heym, ocenić wpływ na użytkowników, ustalić priorytet (severity) oraz dotrzeć do właściwej procedury przywracania sprawności i odpowiedniego właściciela.

Szczegółowe procedury: [Heym Runbook (L1)](./operations-runbook.md)

Ostatni przegląd: 2026-11-10. Zakres: Heym self-hosted, pojedyncza instancja lub cluster, na Docker Compose lub Kubernetes.

## Przekazanie wdrożenia (Deployment handover)

Wypełnij tę tabelę dla każdego środowiska przed użyciem tych dokumentów na dyżurze (on-call). Nazwy, adresy URL, cele wydajnościowe i cele przywracania sprawności są specyficzne dla danego wdrożenia. Przykłady z repozytorium nie stanowią inwentarza produkcyjnego.

| Element | Wartość wdrożenia |
| --- | --- |
| Środowisko i publiczny adres URL Heym | `<environment>`, `<public-url>` |
| Dyżurny platformy i zastępca | `<rotation-or-contact>`, `<backup-contact>` |
| Kanał incydentu i system śledzenia incydentów | `<channel>`, `<tracker-url>` |
| Dyżurny bazy danych i identyfikator bazy | `<contact>`, `<database-id>` |
| Właściciele infrastruktury, sieci i pamięci masowej | `<contacts>` |
| Właściciel wydania i system wdrażania | `<contact>`, `<deployment-url>` |
| Pulpit błędów aplikacji, opóźnień i dostępności | `<dashboard-url>` |
| Pulpit CPU, pamięci, dysku i restartów hosta lub poda | `<dashboard-url>` |
| Pulpit połączeń, blokad, dysku i replikacji PostgreSQL | `<dashboard-url>` |
| Logi i opcjonalny backend śledzenia OTel | `<logs-url>`, `<trace-url-or-disabled>` |
| Projekt/pliki Compose lub kontekst/namespace Kubernetes | `<exact-target>` |
| Lokalizacje instancji main, workerów, bazy danych i pamięci masowej | `<services-or-deployments>`, `<storage-ids>` |
| Zatwierdzony workflow testowy (smoke) i oczekiwany wynik | `<workflow-id>`, `<safe-input>`, `<expected-result>` |
| Procedura tworzenia kopii zapasowych bazy i plików, ostatni test przywracania | `<procedure-url>`, `<test-date>` |
| Cele czasu przywrócenia (RTO) i punktu przywrócenia (RPO) | `<RTO>`, `<RPO>` |

Przechowuj kontakty i łącza do pulpitów nawigacyjnych w zastrzeżonej kopii operacyjnej danego wdrożenia. Materiał dowodowy powinien zawierać identyfikatory, znaczniki czasu, liczniki i oczyszczone błędy zamiast danych uwierzytelniających czy payloadów workflow.

## Inwentarz platformy

| Komponent | Odpowiedzialność | Implikacje incydentu |
| --- | --- | --- |
| Frontend i główny backend (main) | UI, API, MCP, Portal, interaktywne wykonywanie | Sprawdzaj publiczną trasę i proces główny oddzielnie |
| PostgreSQL | Stan aplikacji, rejestr wykonań, kolejka zadań, sloty współbieżności, koordynacja i powiadomienia | Awaria bazy danych może zatrzymać zarówno obsługę żądań, jak i wykonywanie w tle |
| Instancje workerów, gdy tryb cluster jest włączony | Kwalifikujące się zadania w tle oczekujące w kolejce | Sprawne workery nie zastępują publicznych endpointów instancji main |
| Wybrany proces lidera (leader) | Cron, ocena alertów, koordynacja w tle | Zgodny worker może zostać liderem; nie zmienia to jego roli na main |
| Trwała pamięć masowa instancji main | Pliki Drive, zainstalowane wtyczki i przestrzenie robocze agentów kodujących | Przywracaj pamięć masową wraz z main; skierowanie ruchu ingress na workera nie przywraca jej |
| Backend sandboxa na każdej instancji wykonawczej | Kontenery Docker lub pody Kubernetes do izolowanego wykonywania | Awaria backendu sandboxa może wpłynąć na wybrane węzły, podczas gdy UI działa poprawnie |
| Zależności workflow | Dostawcy modeli, serwery MCP, zewnętrzne API, magazyny danych i usługi przesyłania wiadomości | Określ, czy zawodzi pojedyncza zależność, czy cała platforma |
| Opcjonalny kolektor OTel | Wyeksportowane spany workflow, węzłów i narzędzi Agenta | Sam brak wyeksportowanych śladów nie dowodzi niepowodzenia wykonania |

Wbudowana kolejka zadań Heym korzysta z PostgreSQL. Redis, RabbitMQ i magazyny wektorowe mogą być zależnościami workflow; nie są one usługami obowiązkowymi dla kolejki wbudowanej.

`GET /api/health` raportuje wyłącznie stan procesu i wersję. Nie testuje PostgreSQL, kolejki, wyboru lidera, pojemności sandboxów ani synchronizacji credentials. Pozytywna odpowiedź jest pojedynczym sprawdzeniem, a nie gwarancją pełnej gotowości operacyjnej.

## Pierwsze pięć minut

| Krok | Działanie | Decyzja lub materiał dowodowy |
| --- | --- | --- |
| 1 | Potwierdź alert i zweryfikuj środowisko, usługę oraz czas rozpoczęcia | Zarejestruj znaczniki czasu UTC oraz najnowszą zmianę wydania/konfiguracji |
| 2 | Sprawdź publiczne UI i `/api/health`, a następnie bezpośredni backend main | Błąd publiczny przy sprawnym backendzie bezpośrednim wskazuje na problem z routingiem lub frontendem |
| 3 | Sprawdź łączność z PostgreSQL i obciążenie połączeniami | Skieruj awarie bazy danych do L1 przed ponownym uruchomieniem usług aplikacji |
| 4 | Sprawdź stan kontenerów/podów, CPU, pamięć, dysk i ostatnie błędy | Rozdziel awarię infrastruktury, przeciążenie i błędy specyficzne dla danego workflow |
| 5 | W trybie cluster sprawdź **Ustawienia > Instancje**, stany kolejek i dowody lidera | Zidentyfikuj utratę main, workery offline/niezgodne lub zadania przypisane wyłącznie do main |
| 6 | Przypisz priorytet i rozpocznij jedno działanie naprawcze z tabeli routingu | W przypadku P1/P2 natychmiast otwórz incydent i zaangażuj odpowiedniego właściciela |
| 7 | Zweryfikuj bezpieczny workflow w trybie produkcyjnym i obserwuj proces powrotu do normy | Potwierdź poprawę wieku kolejki, liczby błędów i zasobów; ustal czas kolejnej aktualizacji |

Jeśli wydanie zbiega się z awarią, sprawdź [Błędne wdrożenie lub regresja konfiguracji](./operations-runbook.md#bad-deployment-or-configuration-regression). Przed wycofaniem zmian sprawdź zgodność schematu bazy danych.

## Priorytet i reakcja

Są to wyjściowe cele reagowania. Zastosuj zasady obsługi incydentów i wpływ biznesowy danego wdrożenia, jeśli są bardziej restrykcyjne.

| Priorytet | Przykłady | Reakcja |
| --- | --- | --- |
| P1 | Instancja main niedostępna dla wszystkich użytkowników; baza danych niedostępna lub zapisy kończą się niepowodzeniem; masowe błędy wykonań; krytyczne punkty wejścia niedostępne we wszystkich workflow | Natychmiastowe mitygowanie, rejestr incydentu, dyżur platformy i zależności |
| P2 | Rosnący zator w kolejce; utrata pojemności workerów; zbliżające się wyczerpanie puli połączeń; jeden workflow degradujący współdzielone zasoby; powtarzające się awarie OOM | Natychmiastowe rozpoczęcie działań, cel opanowania sytuacji w 15 minut, rejestr incydentu |
| P3 | Odosobniona awaria workflow/dostawcy; ograniczony wpływ przy zachowanej wydajności platformy | Właściciel workflow lub zależności, monitorowane działania następcze i notatka dyżurna |
| P4 | Sygnał informacyjny, oczekiwany trend pojemności, zweryfikowany fałszywy alarm | Potwierdzenie, udokumentowanie i ewentualne dostosowanie monitoringu |

## Routing sygnałów do L1

Używaj tych względnych kotwic podczas konfigurowania linków do alertów. Jeśli usługa monitorowania wymaga bezwzględnego adresu URL, dodaj jako prefiks lokalizację swojej hostowanej kopii operacyjnej.

| Sygnał | Zacznij tutaj |
| --- | --- |
| Niedostępne UI/API, publiczne błędy 5xx, niepowodzenie testu stanu procesu | [Awaria UI lub API](./operations-runbook.md#ui-or-api-down) |
| PostgreSQL nieosiągalny, odrzucenie połączenia, błąd zapisu | [Awaria bazy danych](./operations-runbook.md#postgresql-down-or-not-writable) |
| Zbyt wielu klientów, timeout puli, oczekiwanie na blokady, skok aktywnych połączeń | [Połączenia i blokady bazy danych](./operations-runbook.md#active-db-connections-pool-saturation-and-locks) |
| Wymagany kontrolowany restart backendu lub workera | [Restart usługi](./operations-runbook.md#controlled-service-restart) |
| Skok liczby wykonań, całkowitego czasu trwania, tokenów, CPU lub pamięci | [Workflow najbardziej obciążające zasoby](./operations-runbook.md#most-resource-consuming-workflows) |
| Rosnąca kolejka, zadania oczekujące lub pozornie zablokowane | [Zator w kolejce (backlog)](./operations-runbook.md#queue-backlog-or-apparently-stuck-runs) |
| Instancja offline/niezgodna, bezczynny worker, problem z harmonogramem lub dystrybucją | [Weryfikacja trybu cluster](./operations-runbook.md#cluster-mode-checks) |
| Utrata instancji main przy zachowaniu sprawności workerów | [Instancja main niedostępna](./operations-runbook.md#main-instance-unavailable-while-workers-are-live) |
| Błędy Webhooków, awarie MCP/Portalu, rozłączenia strumieniowania SSE | [Endpointy ingress i wykonywania](./operations-runbook.md#webhook-mcp-portal-or-streaming-failures) |
| OOM, CrashLoop, Pending, pełny dysk, awaria Persistent Volume | [Problem z kontenerem, podem lub pamięcią masową](./operations-runbook.md#container-pod-oom-or-storage-issue) |
| Błędy dostawcy Agenta/LLM/MCP, kod 429, błąd credentiali | [Awaria modelu lub integracji](./operations-runbook.md#model-credential-or-integration-failure) |
| Błędy sandboxa dla Code, Playwright, skill lub agenta kodującego | [Awaria sandboxa](./operations-runbook.md#sandbox-failure) |
| Brak możliwości osiągnięcia celów przywracania; utrata bazy lub plików | [Przywracanie i reagowanie na katastrofy](./operations-runbook.md#recovery-and-disaster-response) |

## Eskalacja

| Ustalenie | Zaangażuj | Dostarcz |
| --- | --- | --- |
| Wpływ na wiele interfejsów lub workflow | Dyżur platformy i lider incydentu | Środowisko, zakres, czas rozpoczęcia, działania naprawcze, termin kolejnej aktualizacji |
| Baza danych niedostępna, nasycona, zablokowana lub brak miejsca na dysku | Dyżur bazy danych | ID bazy, liczba połączeń, blokujące PID-y, oczyszczone błędy, stan pamięci |
| Awaria poda/węzła, podłączanie pamięci, pojemność sandboxów | Właściciel infrastruktury/pamięci masowej | Kontekst, namespace, obciążenie, zdarzenia poda, presja na zasoby |
| Trasa publiczna zawodzi, podczas gdy bezpośredni backend działa | Właściciel sieci/ingressu | Dotknięte trasy, kody stanu, opóźnienia, porównanie z backendem |
| Pojedynczy workflow dominuje obciążenie lub zawodzi w izolacji | Właściciel danego workflow | ID workflow/wykonania, źródło triggera, częstotliwość, okno czasowe, limity tymczasowe |
| Skorelowana zmiana wdrożenia lub konfiguracji | Właściciel wydania | Skrót (digest) uruchomionego obrazu, czas wdrożenia, wersja schematu, ostatnie sprawne wydanie |
| Limit przydziału (quota), uwierzytelnianie lub dostępność dostawcy | Właściciel credentiala lub integracji | Dostawca, model/usługa, kod stanu, ID żądania jeśli bezpieczne; bez wartości sekretów |

Jeśli wpływ na poziomie P1/P2 utrzymuje się po pierwszym działaniu naprawczym, dokonaj natychmiastowej eskalacji na podstawie zebranych już dowodów. Nie czekaj na pełną analizę przyczyny źródłowej.

## Oczekiwane zachowanie w przypadku awarii

| Awaria | Co może działać dalej | Pierwsze działanie |
| --- | --- | --- |
| PostgreSQL niedostępny | Statyczny frontend może się nadal ładować | Przywróć ścieżkę do bazy danych; nie restartuj każdej instancji aplikacji |
| Main niedostępny, workery sprawne | Kwalifikujące się zadania w tle i harmonogramy mogą być kontynuowane, jeśli zgodny worker przewodzi | Przywróć main wraz z trwałą pamięcią; publiczne UI/API/MCP/Portal pozostają niedostępne |
| Worker niedostępny | Inne kwalifikujące się instancje przejmują zadania z kolejki po ich ponownym przypisaniu | Sprawdź alokację, zapasową pojemność i stan odzyskiwania przed wznowieniem ruchu |
| Przerwane wykonanie | Kwalifikujące się odzyskiwalne zadania mogą zrestartować się od początku, jednokrotnie | Sprawdź automatyczne odzyskiwanie i zewnętrzne skutki uboczne przed ręcznym ponowieniem |
| Przeciążenie zadaniami przypisanymi wyłącznie do main | Workery mogą pozostać bezczynne | Zmniejsz problematyczny ruch wejściowy lub zwiększ pojemność main; zmiana wag nie przeniesie przypiętych zadań |
| Wewnętrzny system alertów niedostępny | Zewnętrzny monitoring dostępności/bazy/infrastruktury może nadal działać | Korzystaj z monitoringu poza Heym; alerty Heym zależą od tej samej bazy i harmonogramu |
| Sandbox lub dostawca niedostępny | Workflow nieposiadające tej zależności mogą działać poprawnie | Odizoluj dotknięte workflow i napraw zależność |

## Przywracanie sprawności i zamykanie incydentu

1. Zweryfikuj dostęp publiczny, dostęp do bazy danych, zamierzoną kwalifikowalność instancji oraz bezpieczny produkcyjny workflow testowy (smoke). Test w edytorze nie dowodzi dysp тихоwania zadań do workerów.
2. Obserwuj przez co najmniej 10 minut stabilny poziom błędów, opóźnień, zużycia zasobów i malejący wiek kolejki. Obserwuj także najbliższe oczekiwane krytyczne zadanie harmonogramu lub uzgodniony równoważny test.
3. Uzgodnij z właścicielami workflow zadania nieudane, odzyskane, pominięte, wygasłe i oczekujące. Przed ponownym uruchomieniem czegokolwiek sprawdź zewnętrzne skutki uboczne.
4. Stopniowo przywracaj tymczasowe wstrzymania triggerów, limity i wagi workerów. Przypisz właściciela i czas wygaśnięcia do każdego pozostałego ograniczenia.
5. Zaktualizuj incydent o dane o wpływie, oś czasu UTC, podjęte działania, dowody i nierozwiązane ryzyka. Przypisz przegląd przyczyny źródłowej (post-mortem) dla P1/P2 i zaktualizuj oba dokumenty, jeśli brakowało jakiejkolwiek procedury.

## Powiązane materiały operacyjne

- [Konfiguracja poleceń L1 i kontrole](./operations-runbook.md#command-setup)
- [Uruchamianie i wdrażanie](../getting-started/running-and-deployment.md)
- [Rozkład obciążenia](./cluster.md)
- [Wdrażanie w Kubernetes](../getting-started/kubernetes.md)
- [Bezpieczeństwo i rotacja kluczy](./security.md)
