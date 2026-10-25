# Rozkład obciążenia

Wystarczy wskazać drugiej instancji Heym tę samą bazę danych PostgreSQL, aby dołączyła jako worker. Uruchomienia workflow w tle są następnie rozdzielane między instancje według ustalonego procentowego udziału, dzięki czemu maszyna obsługująca interfejs użytkownika i API nie jest jedyną maszyną wykonującą wszystkie workflow.

Instancje nigdy nie komunikują się ze sobą bezpośrednio. To Postgres przenosi zadania, więc worker nie wymaga otwartego portu, certyfikatu ani trasy powrotnej do instancji głównej — wystarczy dostęp do bazy danych.

## Role

Jedna instancja pełni rolę **main** (głównej), przypisaną przez zmienną środowiskową. Obsługuje interfejs użytkownika, API, MCP oraz portal chat, a także zarządza przechowywaniem plików i zainstalowanymi wtyczkami. Każda inna instancja jest **workerem**: łączy się wyłącznie z bazą danych i wykonuje uruchomienia w tle.

```
HEYM_CLUSTER_ENABLED=true
HEYM_INSTANCE_ROLE=main       # or: worker
HEYM_INSTANCE_NAME=EU Main    # display label, editable later from Settings
HEYM_INSTANCE_ID=eu-main      # optional; derived from the name when empty
```

Rola main jest niezależna od wyboru lidera. Heym wybiera już jednego lidera w klastrze, który odpowiada za cron, ewaluację alertów i odzyskiwanie po awariach; jeśli main ulegnie awarii, przywództwo przechodzi na workera w ciągu kilku sekund i zaplanowane uruchomienia są nadal wyzwalane. Rola main nie jest przenoszona, ponieważ przechowywanie plików nie może się wraz z nią przenieść.

## Co może opuścić instancję główną

Miejsce wykonania jest ustalane na podstawie węzłów workflow przed rozpoczęciem uruchomienia. Uruchomienie pozostaje na main, gdy dowolny węzeł w nim — w tym węzły wewnątrz wywoływanych pod-workflow — korzysta z czegoś, co istnieje tylko na jednej maszynie:

| Węzeł | Dlaczego pozostaje na main |
|---|---|
| Codex, OpenCode Go | Obszar roboczy agenta kodującego pozostaje na lokalnym dysku, aby kontynuacja mogła zostać w nim wznowiona |
| Agent z dołączonym skillem | Kod skilla odczytuje i zapisuje dane w Heym Drive |
| Drive, Converter, Google Drive | Odczytują i zapisują wygenerowane pliki |
| Trigger File Upload | Przesłany plik trafia na dysk main |
| Send Email | Firmowe przekaźniki SMTP zwykle dopuszczają jeden adres źródłowy |
| Węzły wtyczek | Wtyczka jest zainstalowana na dysku jednej instancji |

**Wszystko inne jest rozdzielane** — w tym węzeł Code, Playwright oraz narzędzia Agent Python. Każda instancja uruchamia ten sam obraz z własnym gniazdem Docker, więc sandbox nie jest powodem do pozostawienia uruchomienia na main, a to właśnie najbardziej obciążające CPU węzły w produkcie.

Workflow, którego pod-workflow jest wybierany przez wyrażenie, nie może zostać zbadany z wyprzedzeniem, więc pozostaje na main.

## Wybór wartości procentowych

Wagi to liczby całkowite ustawiane w **Settings → Instances**. Są to **udziały wśród instancji, które aktualnie mogą przyjmować zadania**, a nie procenty ze 100: scheduler dzieli przez sumę właściwą dla tej puli.

Ta różnica ujawnia się, gdy tylko jedna instancja wypadnie. Przy `Main 41, Worker A 26, Worker B 33` wyłączenie Workera B pozostawia pulę 67, więc Main faktycznie otrzymuje 41/67 = **61%**, a Worker A 26/67 = **39%**. Panel wyświetla efektywny podział pod tabelą właśnie z tego powodu, a zapis nigdy nie jest blokowany z powodu liczb nierównych 100 — odrzucany jest wyłącznie podział, w którym żadna włączona instancja nie ma wagi.

Dwie kolejne kwestie łatwo pomylić.

**Procent nie jest udziałem w mocy maszyny.** Obejmuje wyłącznie uruchomienia przechodzące przez kolejkę. Obsługa interfejsu użytkownika i API, strumieniowanie uruchomień edytora i portalu oraz obsługa przesyłania plików to zadania main i żadne z nich nie jest liczone. Main wykonuje więcej pracy, niż wskazuje jej liczba.

**Procent main jest pułapem, nie podłogą.** Uruchomienia, które mogą być wykonane wyłącznie na main, są zaliczane do jej limitu, więc gdy limit zostanie wyczerpany, pozostałe uruchomienia podlegające rozdzieleniu trafiają do workerów. Ustawienie niskiej liczby dla main jest bezpieczne — praca, która musi być tam wykonana, nadal zostanie wykonana. Ustawienie jej wysoko — zagłodzi workerów.

Zatem przy mocnym main i mniejszym workerze należy zaczynać bliżej 60/40 niż surowego stosunku maszyn, a następnie porównać rzeczywiste czasy trwania uruchomień w zakładce Wykonania i dostosować.

Wagi są renormalizowane wśród instancji, które są aktualnie aktywne i włączone. Przy `main=70, A=15, B=15`, jeśli A przejdzie w tryb offline, podział staje się 70/85 i 15/85 między main a B, i wraca do 70/15/15, gdy A powróci.

**Instancja, która wraca, nie ma prawa do uruchomień, które przegapiła.** Czas spędzony w trybie Offline, Disabled lub na niezgodnej wersji nie jest jej zaliczany, więc worker, który spędził noc niedostępny, wraca na aktualną pozycję puli i podział odczytuje się ponownie jako 70/30 od jego pierwszego uruchomienia — nie pochłania wszystkich uruchomień, dopóki nie nadrobi zaległości. Worker, który był dostępny przez cały czas, nadal nadrabia, i to właśnie czyni procent main pułapem.

### Nowa instancja dołącza z zerem

Instancja, której nigdy nie nadano wagi, startuje z 0, co pozostawiłoby ją jako Live, Enabled i nieotrzymującą niczego. **Give new instances a share automatically** — domyślnie włączone, pod tabelą instancji — rozwiązuje ten problem: przy następnym przebiegu lidera nowa instancja otrzymuje równy udział w puli, a istniejące wagi są skalowane w dół z zachowaniem wzajemnych proporcji, więc zamierzony podział 70/30 nadal odczytuje się jako w przybliżeniu 70/30. Suma pozostaje dokładnie 100.

Działa to **raz na instancję**. Zarówno automatyczny przebieg, jak i ręczna edycja oznaczają instancję jako skonfigurowaną, więc instancja ustawiona samodzielnie nigdy nie zostanie zmieniona za plecami — w tym ta celowo ustawiona na 0. Należy wyłączyć to ustawienie, jeśli każda nowa maszyna ma czekać na ręczną konfigurację.

Uczestniczą wyłącznie instancje włączone, aktywne i zgodne. Przydzielenie udziału maszynie, która nie może niczego wykonać, pozostawiłoby ten udział bez wykorzystania.
### Gdy procenty nie mogą pomóc

Panel ustawień informuje, ile spośród uruchomień z ostatnich 24 godzin mogło zostać wykonanych wyłącznie na main. Jeśli liczba ta jest wysoka — obciążenie związane głównie z Codex lub Drive — workery będą pozostawać bezczynne niezależnie od wag, a rozwiązaniem jest większa instancja main, a nie większa ich liczba.

## Dobór rozmiaru PostgreSQL dla klastra

Liczba połączeń skaluje się wraz z liczbą instancji, a nie tylko użytkowników. Każda instancja uruchamia kilka procesów uvicorn, a każdy proces utrzymuje pulę połączeń oraz cztery połączenia `LISTEN` (anulowanie, wybudzanie kolejki, wyniki uruchomień, strumienie chat). Otwarte strumienie chat współdzielą jedno połączenie chat, więc nie zwiększają liczby połączeń do bazy danych. Klaster złożony z trzech instancji przy domyślnym `max_connections = 100` wyczerpuje limit, a Heym traci wówczas dostęp do własnej bazy danych.

Należy zaplanować zapas w przybliżeniu według wzoru `instances x processes x (async pool + sync pool + 4)` i ustawić `max_connections` powyżej tej wartości.

Zamiast wyłącznie podnosić limit, należy zmniejszyć pule. Pojedyncze wdrożenie domyślnie korzysta z 10+20 połączeń async i 5+10 sync na proces, co jest wartością hojną dla jednej maszyny i zdecydowanie zbyt dużą dla klastra:

| Zmienna | Pojedyncza instancja | Klaster |
|---|---|---|
| `HEYM_DB_POOL_SIZE` | 10 | 3 |
| `HEYM_DB_MAX_OVERFLOW` | 20 | 5 |
| `HEYM_DB_SYNC_POOL_SIZE` | 5 | 2 |
| `HEYM_DB_SYNC_MAX_OVERFLOW` | 10 | 3 |

Przykładowy plik compose ustawia te wartości oraz `max_connections = 300`. Dzięki temu klaster złożony z dwóch instancji schodzi z limitu 768 połączeń do 192, a przy trzech instancjach nadal pozostaje poniżej 300.

## Wymagania, których klaster nie wymusi za użytkownika

**Każda instancja musi używać tego samego `SECRET_KEY` i `ENCRYPTION_KEY`.** Worker z innym `ENCRYPTION_KEY` nie może odszyfrować danych logowania, a każde uruchomienie korzystające z danych logowania zakończyłoby się błędem, który nie wskazuje niczego użytecznego. Heym porównuje skrót obu kluczy przy każdym heartbeacie, wraz z wersją aplikacji i rewizją bazy danych, i oznacza niezgodną instancję jako **Mismatch**, przez co nie otrzymuje ona żadnej pracy. Obciążenie wraca wówczas do main do czasu usunięcia niezgodności.

Definiuje to również kolejność aktualizacji. Aktualizacja main w pierwszej kolejności oznacza każdy worker jako niezgodny; praca wraca do main, a każdy worker dołącza ponownie w miarę aktualizacji. Wolniej, ale w sposób widoczny i odwracalny.

**Ruch przychodzący należy kierować wyłącznie na instancję main.** Rozdzielanie ruchu użytkowników równomiernie między instancje spowodowałoby wysłanie przesyłanego pliku na jedną maszynę, a jego pobrania na inną. Nic w kodzie temu nie zapobiega, ponieważ worker uruchamia ten sam obraz i odpowie na każde otrzymane żądanie.

**Każda instancja wymaga `FRONTEND_URL` ustawionego na ten sam publiczny adres.** Uruchomienie, które zatrzymuje się w oczekiwaniu na przegląd przez człowieka, generuje link do przeglądu na instancji, która je wykonała, a nie na main; dotyczy to również linków kontynuacji Codex oraz adresów URL do pobrania wygenerowanych plików. Worker pozbawiony tej zmiennej buduje takie linki względem własnego adresu lokalnego, a odbiorca takiego linku nie może go otworzyć.

**Instancje worker mają inny wychodzący adres IP.** Każde API, które stosuje listę dozwolonych adresów źródłowych, zobaczy nowy adres. Send Email działa na main właśnie z tego powodu; w przypadku węzła HTTP należy albo zapewnić klastrowi jeden adres wyjściowy NAT, albo dodać każdą instancję do listy dozwolonych.

## Dodawanie workera na innej maszynie

Plik `docker-compose.worker.yml` w katalogu głównym repozytorium uruchamia workera na jego własnym hoście. Nie ma on bazy danych ani interfejsu użytkownika: łączy się z PostgreSQL instancji main i przejmuje swoją część uruchomień w tle.

Należy wypełnić plik `.env` obok niego — tag obrazu, host i dane logowania do bazy danych, oba klucze oraz identyfikator instancji — i uruchomić go. Compose odmówi uruchomienia, dopóki nie zostaną ustawione wszystkie wymagane wartości, zamiast wystartować z wartością zastępczą, która zawiedzie później w sposób trudny do zdiagnozowania.

Tag obrazu musi odpowiadać wersji uruchomionej na main, a oba klucze muszą zostać skopiowane dokładnie. Różnica w którymkolwiek z nich powoduje oznaczenie workera jako Mismatch i nie otrzymuje on żadnej pracy.

## Odczyt tabeli Instances

| Kolumna | Znaczenie |
|---|---|
| Name | Edytowalna etykieta; jest przypisywana do każdego uruchomienia wykonywanego przez tę instancję |
| Role | `main` lub `worker`, na podstawie środowiska |
| Status | **Live** przy świeżym heartbeacie, **Offline** po 30 sekundach ciszy, **Mismatch**, gdy wersja, rewizja bazy danych lub klucze różnią się od wartości na main |
| ms | Czas rundy z tej instancji do bazy danych, mierzony przez samą instancję |
| On | Wyłączenie workera z rotacji bez zatrzymywania go — trwające wykonania kończą się, nowe nie są przydzielane. Zablokowane na włączone dla instancji main: praca związana z plikami, pluginami i agentami kodującymi wykonuje się tam niezależnie od ustawienia przełącznika |
| Weight | Udział instancji w rozdzielanych uruchomieniach |

## Limity współbieżności w klastrze

[Limit współbieżności](./webhooks.md#concurrency-limit-and-queued-runs) workflow jest zliczany w PostgreSQL, więc obowiązuje we wszystkich instancjach i procesach: dwie instancje nigdy nie uruchomią więcej wykonań danego workflow, niż zezwala na to limit. Uruchomienie, które czekało na slot, jest przydzielane według tych samych zasad co każde inne uruchomienie w momencie startu, dzięki czemu zadanie wymagające pracy na main nadal tam pozostaje. Worker kolejki wykonujący te zadania uruchamia się teraz przy każdej instalacji, w tym na pojedynczej instancji, gdzie przejmuje tylko uruchomienia zakolejkowane przez własną instancję. Oznacza to, że pojedyncza instancja utrzymuje również połączenie `LISTEN` wybudzania kolejki w każdym procesie, dlatego należy zaplanować pulę połączeń tak samo jak dla instancji klastra.

## Historia uruchomień

Każde uruchomienie w historii wykonań wskazuje instancję, która je wykonała, a oba okna historii umożliwiają filtrowanie do jednej instancji. Filtr dopasowuje identyfikator instancji, wyświetlając jej nazwę, więc zmiana nazwy instancji nie modyfikuje informacji o starych uruchomieniach.

Nic z tego nie pojawia się w instalacji z pojedynczą instancją: pola są puste, żadna etykieta nie jest wyświetlana i żaden filtr nie jest oferowany.
## Zachowanie w przypadku awarii

**Jeśli worker ulegnie awarii w trakcie wykonywania**, jego heartbeat staje się nieaktualny, a istniejący mechanizm odzyskiwania po stronie leadera ponownie uruchamia wykonanie na aktywnej instancji. Wiersz kolejki, który został przez niego zarezerwowany, jest wycofywany osobno: gdy nie istnieje już żadne aktywne wykonanie dla tego wiersza i upłynie dwuminutowy okres karencji, leader oznacza wiersz jako nieudany i budzi podmiot oczekujący na wynik. Sam wiek wiersza nigdy nie jest triggerem, więc uzasadnione długotrwałe wykonanie pozostaje nietknięte; wiersz jest oznaczany jako nieudany, a nie przywracany do kolejki, ponieważ odzyskiwanie już odpowiada za ponowne uruchomienie, a przywrócenie do kolejki spowodowałoby dwukrotne wykonanie tego samego workflow.

**Jeśli main ulegnie awarii**, cron nadal jest wyzwalany z workera, a wykonywania rozproszone nadal są realizowane. Wykonania wymagające main trafiają do kolejki i oczekują, a następnie są przetwarzane po jego powrocie — jednak wyłącznie w oknie karencji dla pominiętych uruchomień (`HEYM_CRON_MISFIRE_GRACE_SECONDS`, domyślnie 600 sekund). Wszystko starsze jest zamykane jako pominięte, z zapisanym powodem, zamiast odtwarzania godzin zaległości naraz.

UI, API, MCP oraz edytor są niedostępne, gdy main jest niedostępny, ponieważ to tam znajdują się punkty wejścia.

## Powiązane

- [Uruchamianie i wdrażanie](../getting-started/running-and-deployment.md) – Najpierw wdróż pojedynczą instancję; zmienne środowiskowe i konfiguracja kluczy znajdują się tam
- [Ustawienia](./user-settings.md) – Zakładka Instances oraz kto może ją widzieć
- [Wykonania](../tabs/traces-tab.md) – Porównaj rzeczywiste czasy trwania uruchomień między instancjami przed zmianą podziału
- [Bezpieczeństwo](./security.md) – Dlaczego każda instancja musi współdzielić `SECRET_KEY` i `ENCRYPTION_KEY`
