# Heym Runbook (L1)

Дотримуйтесь цих процедур для діагностики та відновлення служб Heym, з’єднань PostgreSQL, черг workflow, ємності кластера та виконання в sandbox.

Почніть з [Heym Incident Playbook (L0)](./incident-playbook.md) для визначення серйозності, контактів та опису розгортання.

Останній перегляд: 2026-11-10. Polecenia odpowiadają stanowi repozytorium w momencie przeglądu. Przed użyciem potwierdź wdrożoną wersję i topologię. Wszystkie poniższe polecenia modyfikujące usługi są instrukcjami dla operatora, a nie automatycznymi naprawami.

## Покажчик процедур

| Інцидент |
| --- |
| [UI lub API niedostępne](#ui-lub-api-niedostępne) |
| [PostgreSQL niedostępny lub niezapisywalny](#postgresql-niedostępny-lub-niezapisywalny) |
| [Aktywne połączenia DB, nasycenie puli i blokady](#aktywne-połączenia-db-nasycenie-puli-i-blokady) |
| [Kontrolowany restart usługi](#kontrolowany-restart-usługi) |
| [Workflows zużywające najwięcej zasobów](#workflows-zużywające-najwięcej-zasobów) |
| [Zaległości w kolejce lub pozornie zablokowane przebiegi](#zaległości-w-kolejce-lub-pozornie-zablokowane-przebiegi) |
| [Sprawdzenia trybu klastra](#sprawdzenia-trybu-klastra) |
| [Instancja main niedostępna, gdy workers działają](#instancja-main-niedostępna-gdy-workers-działają) |
| [Awarie webhooków, MCP, Portal lub streamingu](#awarie-webhooków-mcp-portal-lub-streamingu) |
| [Problemy z kontenerem, podem, OOM lub pamięcią masową](#problemy-z-kontenerem-podem-oom-lub-pamięcią-masową) |
| [Nieudane wdrożenie lub regresja konfiguracji](#nieudane-wdrożenie-lub-regresja-konfiguracji) |
| [Awaria modelu, poświadczenia lub integracji](#awaria-modelu-poświadczenia-lub-integracji) |
| [Awaria piaskownicy (sandbox)](#awaria-piaskownicy-sandbox) |
| [Аварійне відновлення та реагування](#disaster-recovery-i-reagowanie-awaryjne) |

## Налаштування команд

Pracuj z wdrożonej kopii roboczej lub narzędzi wdrożeniowych. Wybierz wyłącznie topologię rzeczywiście działającą w dotkniętym środowisku. Nigdy nie używaj przykładowego projektu do rozwiązywania incydentu produkcyjnego.

### Docker Compose

Zdefiniuj następujący skrót powłoki dla standardowej instalacji Compose:
```bash
heym_compose() { docker compose -f docker-compose.yml "$@"; }
HEYM_MAIN_SERVICE=backend
HEYM_FRONTEND_SERVICE=frontend
```

W przypadku klastrowego przykładu repozytorium użyj zamiast tego poniższej definicji:
```bash
heym_compose() { docker compose -f docker-compose.cluster.yml "$@"; }
HEYM_MAIN_SERVICE=main
HEYM_WORKER_SERVICE=worker-a
```

W przypadku samodzielnego workera na osobnym hoście użyj `docker compose -f docker-compose.worker.yml` i usługi `worker`. Nie zawiera ona lokalnej usługi PostgreSQL ani frontendu. Dołącz do skrótu rzeczywistą nazwę projektu, pliki nadpisujące i plik środowiskowy wdrożenia, jeśli są używane.
```bash
heym_compose ps
heym_compose images
heym_compose logs --since 15m --tail 200 "$HEYM_MAIN_SERVICE"
docker stats --no-stream
```

Standardowy stos Compose domyślnie publikuje frontend na porcie hosta `4017`, a PostgreSQL na porcie `6543`. Port backendu `10105` jest wewnętrzny. Przykład klastra publikuje API instancji main na porcie `10105`, API worker-a na `10111`, a PostgreSQL na `6544`. Obraz wydania łączy frontend i backend w jednym kontenerze. Zweryfikuj mapowania portów za pomocą `ps`.

W celu bezpośredniego sprawdzenia procesu backendu wewnątrz kontenera main Compose:
```bash
heym_compose exec -T "$HEYM_MAIN_SERVICE" uv run python -c \
  'import urllib.request; print(urllib.request.urlopen("http://127.0.0.1:10105/api/health", timeout=5).read().decode())'
```

### Kubernetes

Ustaw rzeczywisty kontekst, przestrzeń nazw (namespace) i nazwy obciążeń. Poniższe nazwy wdrożeń odpowiadają wyłącznie przykładom z repozytorium.
```bash
HEYM_KUBE_CONTEXT='<actual-context>'
HEYM_NAMESPACE=heym
HEYM_MAIN_DEPLOYMENT=heym
HEYM_WORKER_DEPLOYMENT=heym-worker
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" get deployments,pods,svc,pvc
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" get events --sort-by=.lastTimestamp
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" logs \
  "deployment/$HEYM_MAIN_DEPLOYMENT" --all-containers=true --since=15m --tail=200
```

Wdrożenie bazowe obejmuje jedną replikę main ze strategią `Recreate`, pamięcią trwałą i sondą gotowości na `/api/health`. Jego publiczny port kontenera to `4017`; worker czysto backendowy używa `10105`. Nie zakładaj, że restart lub wdrożenie odbędzie się bez przestoju. Zobacz [Zachowanie wdrożeń Kubernetes](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#recreate-deployment).

### Stan i dostęp do API
```bash
HEYM_PUBLIC_URL='https://your-heym-host.example'
curl --fail --silent --show-error --connect-timeout 3 --max-time 10 \
  "$HEYM_PUBLIC_URL/api/health"
curl --silent --show-error --output /dev/null --write-out '%{http_code}\n' \
  --connect-timeout 3 --max-time 10 "$HEYM_PUBLIC_URL/"
```

`/api/health` zwraca `status`, `service` oraz `version`; nie przeprowadza weryfikacji zależności. Potwierdź bazę danych oraz zatwierdzony kompleksowy workflow oddzielnie.

Poniższe uwierzytelnione przykłady używają pliku konfiguracyjnego curl przygotowanego poza tym repozytorium w `$HEYM_CURL_CONFIG`, zawierającego nagłówek `Authorization` operatora. Ogranicz uprawnienia do operatora, trzymaj go z dala od kontroli wersji i usuń kopie tymczasowe po użyciu. Nie wklejaj tokenów do poleceń, adresów URL, logów ani notatek z incydentów. W miarę możliwości korzystaj z istniejącej uwierzytelnionej sesji UI. Sprawdź kody stanu oraz wdrożony schemat OpenAPI na backendzie pod `/docs` przed ponowieniem nieudanej operacji zapisu.

### Dostęp SQL i limity zapytań

W przypadku dołączonej bazy danych Compose otwórz sesję ze skonfigurowaną tożsamością kontenera bazy danych:
```bash
heym_compose exec postgres sh -c \
  'exec psql -X -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

W przypadku zewnętrznej bazy danych użyj zatwierdzonej definicji usługi `psql` i pliku haseł lub konsoli dostawcy bazy danych. Połączenie libpq używa `postgresql://`, a nie SQLAlchemy `postgresql+asyncpg://`. Przeprowadź testy zarówno ze ścieżki sieciowej dotkniętej aplikacji, jak i ścieżki DBA.

Uruchamiaj diagnostyczny SQL z rolą tylko do odczytu, gdzie to możliwe. Na początku każdej sesji diagnostycznej:
```sql
SET default_transaction_read_only = on;
SET statement_timeout = '5s';
SET lock_timeout = '1s';
SELECT now() AS observed_at, current_database(), pg_is_in_recovery();
```

Do kontroli aplikacji używaj wyznaczonego zapisywalnego węzła podstawowego (primary). Replika może odpowiadać na `SELECT 1`, podczas gdy ścieżka zapisu jest niedostępna. Szczegóły z `pg_stat_activity` mogą wymagać uprawnień monitorowania bazy danych; ukryte wiersze lub pola NULL nie są dowodem braku aktywności. Poniższe zapytania diagnostyczne pomijają payloady, sekrety i treść zapytań SQL. Nie modyfikują tabel Heym. Zobacz [Aktywność i widoczność PostgreSQL](https://www.postgresql.org/docs/16/monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW).

## Спільна перевірка

Po każdym działaniu łagodzącym sprawdź dostęp publiczny, responsywność bazy danych, zatwierdzony workflow typu smoke oraz odpowiednie metryki pojemności/zaległości. Używaj bezpiecznego triggera w trybie produkcyjnym podczas weryfikacji dyspozycji w klastrze: przebiegi testowe edytora pozostają na instancji odbierającej. Obserwuj przez co najmniej 10 minut, a także podczas kolejnego krytycznego harmonogramu lub uzgodnionej równoważnej kontroli. Rejestruj zmiany i wyznacz osobę odpowiedzialną oraz czas na wycofanie tymczasowych ograniczeń.

## UI lub API niedostępne

**Рівень серйозності:** P1 w przypadku powszechnej niedostępności produkcyjnej; P2 w przypadku częściowej degradacji.

**Діагностика**

1. Porównaj publiczny interfejs użytkownika, publiczny `/api/health` i bezpośrednie sprawdzenie backendu main z sekcji [Konfiguracja poleceń](#konfiguracja-poleceń).
2. Sprawdź stan kontenera lub poda main/frontend, ostatnie błędy oraz użycie CPU/pamięci/dysku. Ładowanie statycznego UI nie dowodzi działania API.
3. Przeprowadź [sprawdzenie bazy danych](#postgresql-niedostępny-lub-niezapisywalny). Sprawdź ostatnie wydanie oraz zmiany w ingress/proxy.
4. Jeśli zawodzą tylko żądania uwierzytelnione, odróżnij wygasłe sesje/SSO od ogólnej awarii API. Nie resetuj kluczy współdzielonych w celu testowania logowania.

**Усунення наслідків**

1. Najpierw napraw zależności bazy danych lub pamięci masowej, jeśli wyjaśniają one awarię.
2. Jeśli bezpośredni backend działa, przywróć trasę frontend/proxy/ingress. Ingress musi wskazywać na main w trybie klastra.
3. Jeśli main jest zablokowany, a zależności są sprawne, postępuj zgodnie z [Kontrolowanym restartem usługi](#kontrolowany-restart-usługi). Przywróć tylko dotkniętą usługę frontendu, jeśli to ona uległa awarii.
4. W przypadku regresji wydania postępuj zgodnie z [Nieudanym wdrożeniem](#nieudane-wdrożenie-lub-regresja-konfiguracji).

**Перевірка:** Publiczny interfejs użytkownika ładuje się, uwierzytelniony dostęp do API działa pomyślnie, a workflow smoke zostaje zakończony. Sam zielony punkt końcowy procesu nie wystarcza.

**Ескалація:** Dyżur platformowy w przypadku awarii backendu; właściciel sieci/ingressu, gdy zawodzi tylko ścieżka publiczna; właściciel bazy danych lub pamięci masowej, gdy zawodzą kontrole zależności.

## PostgreSQL niedostępny lub niezapisywalny

**Рівень серйозності:** P1, gdy połączenia lub zapisy produkcyjne zawodzą; P2 w przypadku sporadycznej degradacji.

**Діагностика**

W przypadku dołączonego PostgreSQL:
```bash
heym_compose ps postgres
heym_compose logs --since 15m --tail 150 postgres
heym_compose exec -T postgres sh -c \
  'pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

1. `pg_isready` sprawdza, czy serwer przyjmuje połączenia. Potwierdź uwierzytelniony dostęp SQL i stan węzła podstawowego, korzystając z [Dostępu SQL](#konfiguracja-poleceń).
2. Z poziomu dotkniętej instancji sprawdź DNS, routing, endpoint/port bazy danych, TLS i polityki sieciowe. Lokalne połączenie DBA nie dowodzi osiągalności przez aplikację.
3. Odczytaj oczyszczony błąd: odrzucenie połączenia/timeout, błąd uwierzytelniania, wyczerpanie połączeń, transakcja tylko do odczytu, brak miejsca na dysku lub błąd migracji.
4. Sprawdź dysk/i-węzły hosta bazy danych, logi bazy, stan przełączania awaryjnego (failover)/replikacji i zdarzenia konserwacyjne. Użyj [Połączeń i blokad](#aktywne-połączenia-db-nasycenie-puli-i-blokady) w przypadku nasycenia.

**Усунення наслідків**

1. Zmniejsz napływ danych od producentów i burze ponowień. Wstrzymaj uciążliwe triggery automatyczne przez Heym, jeśli API działa; w przeciwnym razie skoordynuj ograniczenie ruchu przychodzącego. Unikaj masowych ponownych uruchomień.
2. W przypadku zatrzymanej dołączonej bazy danych ze sprawdzoną nienaruszoną pamięcią masową i brakiem aktywnej operacji failover/odzyskiwania, uruchom tylko istniejącą usługę:
```bash
   heym_compose start postgres
   ```

3. W przypadku zarządzanego PostgreSQL, awarii sieci, pełnego dysku, uszkodzenia danych lub failoveru, zastosuj procedurę odzyskiwania właściciela bazy danych. Zachowaj istniejący wolumen bazy danych i materiał kluczy.
4. Gdy zapisywalny węzeł podstawowy będzie osiągalny, pozwól pulom/listenerom na ponowne połączenie. Restartuj instancję aplikacji tylko wtedy, gdy nadal zgłasza błędy po uzdrowieniu ścieżki do bazy.
5. Nigdy nie inicjuj pustej bazy danych zastępczej w trakcie incydentu, nie usuwaj plików WAL ani nie uruchamiaj `docker compose down -v`. Przywracanie odbywa się zgodnie z [Disaster recovery](#disaster-recovery-i-reagowanie-awaryjne).

**Перевірка:** SQL na ścieżce aplikacji działa na zamierzonym węźle podstawowym, normalne zapisy aplikacji kończą się sukcesem w smoke workflow, błędy połączeń ustają, heartbeaty są wznawiane, a wiek kolejki maleje.

**Ескалація:** Dyżur bazy danych natychmiast dla P1, problemów z węzłem podstawowym/failoverem, uszkodzenia danych lub wyczerpania pamięci masowej. Prześlij tożsamość endpointu, znaczniki czasu, klasę stanu/błędu oraz dowody pamięci masowej/połączeń bez poświadczeń.

## Aktywne połączenia DB, nasycenie puli i blokady

**Рівень серйозності:** P1, jeśli żadne użyteczne zadanie nie może się połączyć; P2, jeśli obciążenie lub blokowanie degraduje wykonywanie.

**Діагностика**

Uruchom to na dotkniętym serwerze PostgreSQL. Suma dotyczy całego serwera, ponieważ inne bazy danych korzystają z tego samego limitu połączeń. `active` wykonuje zapytanie; `idle` jest połączone bez bieżącego zapytania. Oba zużywają slot. PostgreSQL rezerwuje część slotów, więc zwykli klienci mogą zostać odrzuceni, zanim suma osiągnie `max_connections`.
```sql
SELECT current_setting('max_connections')::int AS max_connections,
       current_setting('superuser_reserved_connections')::int AS superuser_reserved,
       current_setting('reserved_connections', true) AS reserved_connections,
       count(*) FILTER (WHERE backend_type = 'client backend') AS client_connections,
       count(*) FILTER (WHERE backend_type = 'client backend'
                         AND state = 'active') AS active_connections,
       count(*) FILTER (WHERE backend_type = 'client backend'
                         AND state LIKE 'idle in transaction%') AS idle_in_transaction
FROM pg_stat_activity;

SELECT datname, application_name, usename, client_addr, state,
       wait_event_type, wait_event, count(*) AS connections
FROM pg_stat_activity
WHERE backend_type = 'client backend'
GROUP BY datname, application_name, usename, client_addr, state,
         wait_event_type, wait_event
ORDER BY connections DESC
LIMIT 50;
```

Heym oznacza połączenia puli i listenerów tagiem `heym-<instance-id>`. Porównaj grupę połączeń z heartbeatami instancji i liczbą procesów. Bezczynna pula jest oczekiwana. Rosnąca populacja `idle in transaction` wymaga zbadania.
```sql
SELECT pid, application_name, state,
       now() - xact_start AS transaction_age,
       CASE WHEN state = 'active' THEN now() - query_start END AS active_query_age,
       wait_event_type, wait_event, pg_blocking_pids(pid) AS blocking_pids
FROM pg_stat_activity
WHERE datname = current_database()
  AND backend_type = 'client backend'
  AND pid <> pg_backend_pid()
  AND (state = 'active' OR state LIKE 'idle in transaction%')
ORDER BY xact_start ASC NULLS LAST
LIMIT 30;
```

Odróżnij wyczerpanie serwera (`too many clients`) od przekroczenia limitu czasu lokalnej puli SQLAlchemy. Lokalna pula może ulec nasyceniu, ponieważ żądania przetrzymują połączenia lub czekają na blokady, nawet gdy serwer ma wolne sloty.

Zaplanuj skonfigurowaną wartość szczytową, w tym nadmiar (overflow) i każdy proces uvicorn:
```text
sum over instances:
  process_count * (async_pool_size + async_max_overflow
                   + sync_pool_size + sync_max_overflow + 4 listeners)
then add other clients, monitoring, and operational headroom
```

Wartości domyślne na proces to `HEYM_DB_POOL_SIZE=10`, `HEYM_DB_MAX_OVERFLOW=20`, `HEYM_DB_SYNC_POOL_SIZE=5` i `HEYM_DB_SYNC_MAX_OVERFLOW=10`. Standardowy punkt wejścia backendu uruchamia 8 procesów: jego teoretyczny szczyt to `8 * (10 + 20 + 5 + 10 + 4) = 392`, przed uwzględnieniem innych klientów. Pule rosną na żądanie; jest to pułap, a nie oczekiwana liczba otwartych połączeń. Dedykowana sesja lidera jest utrzymywana z puli asynchronicznej. Cztery połączenia listenera istnieją na proces nawet w instalacji jednoinstancyjnej; strumienie czatu współdzielą listener.

Odczytaj rzeczywiste ustawienia z wdrożonego manifestu. Pliki przykładowe nadpisują niektóre wartości domyślne i liczby procesów. Dodanie workerów dodaje również pule i listenery; może to nasilić presję na bazę danych.

**Усунення наслідків**

1. Ogranicz zidentyfikowane obciążenie/producentów. Zachowaj ścieżkę dostępu DBA i margines operacyjny.
2. Poproś właściciela bazy danych o zbadanie pojedynczych blokad/długich transakcji. Nie zamykaj masowo sesji Heym: listenery i sesja blokady doradczej (advisory lock) lidera są niezbędnymi ścieżkami koordynacji. Anulowanie zapytania i zakończenie sesji mają różne skutki; DBA powinien celować w potwierdzonego sprawcę. Zobacz [Sygnały serwera PostgreSQL](https://www.postgresql.org/docs/16/functions-admin.html#FUNCTIONS-ADMIN-SIGNAL).
3. Jeśli wymaga tego pojemność, zmniejsz rozmiary puli/overflow lub liczbę procesów w konfiguracji wdrożenia, a następnie opróżniaj/oddtwarzaj instancje pojedynczo. Sprawdź obciążenie API i pojemność executora po redukcji. Zmiana puli wymaga wymiany procesu; `restart` nie stosuje zmienionych wartości środowiska Compose.
4. `docker-compose.yml` nie przekazuje jawnie czterech zmiennych puli. Dodaj zatwierdzone nadpisania środowiskowe w rzeczywistej konfiguracji wdrożenia, zamiast zakładać, że wpis `.env` na hoście trafi do kontenera. Przykłady klastra i workera mają własne mapowania.
5. Skoordynuj każde zwiększenie `max_connections` z właścicielem bazy danych i budżetem pamięci. Unikaj jednoczesnych ponownych połączeń w całej flocie.

**Перевірка:** Łączna liczba połączeń klientów stabilizuje się z marginesem, błędy puli ustają, blokady znikają, błędy listenera/heartbeatu kończą się, a workflow smoke działa pomyślnie.

**Ескалація:** Właściciel bazy danych w celu interwencji w blokady lub zmian pułapu połączeń; właściciel platformy w przypadku wycieków połączeń, głodu puli lub powtarzających się burz ponownych połączeń.

## Kontrolowany restart usługi

**Рівень серйозності:** Dziedziczy ważność incydentu. Restart instancji main przerywa usługę publiczną w udokumentowanej topologii.

**Przed restartem**

1. Potwierdź docelową instancję/usługę i zbierz logi, skrót obrazu, powód restartu oraz identyfikatory aktywnych/oczekujących przebiegów. Potwierdź, że PostgreSQL i pamięć masowa są sprawne.
2. Zmniejsz napływ nowych zadań. W przypadku workera wyłącz opcję **On** w **Ustawienia > Instancje** w UI lub ustaw jego wagę na 0. Opróżnij zadania w toku przed restartem.
3. Przejrzyj [Odzyskiwanie i anulowanie wykonania](#nieudane-wdrożenie-lub-regresja-konfiguracji). Heym wznawia niekompletne przebiegi, wykonując kwalifikujące się workflowy od początku.
4. Nie usuwaj wolumenów, nie pomijaj plików środowiskowych ani nie uruchamiaj nagiego `docker compose down`.

**Restart jednej usługi z niezmienioną konfiguracją**
```bash
# Compose main. Use the existing topology helper.
heym_compose restart -t 60 "$HEYM_MAIN_SERVICE"
heym_compose ps "$HEYM_MAIN_SERVICE"
heym_compose logs --since 5m --tail 150 "$HEYM_MAIN_SERVICE"
```

W przypadku opróżnionego workera z przykładu klastra podstaw `$HEYM_WORKER_SERVICE`. 60-sekundowy limit czasu zatrzymania pozwala trwającym zadaniom zakończyć się lub osiągnąć czysty stan pauzy przed sygnałem SIGKILL.

**Pełny restart stosu Compose**

Preferuj restarty pojedynczych usług. Restart stosu zatrzymuje cały stos Compose, w tym PostgreSQL.
```bash
# Kubernetes main. Recreate strategy can cause downtime.
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout restart \
  "deployment/$HEYM_MAIN_DEPLOYMENT"
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout status \
  "deployment/$HEYM_MAIN_DEPLOYMENT" --timeout=180s
```

Podstaw `$HEYM_WORKER_DEPLOYMENT` dla opróżnionego workera. Wdrożenie z wieloma replikami może przeprowadzić rolling restart. Strategia `Recreate` na instancji main kończy stary pod przed zaplanowaniem nowego: oczekuj przestoju równego czasowi zamykania, planowania, ponownego montowania wolumenu i uruchamiania.

**Перевірка:** Punkty końcowe stanu procesów odpowiadają, połączenia z PostgreSQL zostają przywrócone, heartbeaty workerów wznawiają raportowanie w **Ustawienia > Instancje**, a workflow smoke kończy się sukcesem.

**Ескалація:** Dyżur platformowy, jeśli uruchamianie zawiesza się lub sondy zawodzą; dyżur bazy danych, jeśli uruchamianie zapętla się na migracjach.

## Workflows zużywające najwięcej zasobów

**Рівень серйозності:** P2, gdy obciążenie workflow pogarsza czasy odpowiedzi; P1, jeśli zagraża dostępności bazy danych, workerów lub dostępowi publicznemu.

**Діагностика**

Ostatnie workflowy uszeregowane według łącznego zarejestrowanego czasu trwania:
```sql
SELECT h.workflow_id, w.name, w.owner_id,
       count(*) AS recorded_runs,
       count(*) FILTER (WHERE h.status IN ('error', 'failed', 'timeout')) AS failed_runs,
       round((sum(h.execution_time_ms) / 1000.0)::numeric, 1) AS total_elapsed_seconds,
       round((max(h.execution_time_ms) / 1000.0)::numeric, 1) AS max_elapsed_seconds
FROM execution_history h
JOIN workflows w ON w.id = h.workflow_id
WHERE h.started_at >= now() - interval '1 hour'
GROUP BY h.workflow_id, w.name, w.owner_id
ORDER BY total_elapsed_seconds DESC
LIMIT 20;
```

Aby zidentyfikować workflowy o dużej liczbie wywołań, uruchom ponownie to samo zapytanie z `ORDER BY recorded_runs DESC`.

Ostatnie workflowy uszeregowane według średniego czasu trwania z co najmniej 5 przebiegami:
```sql
SELECT a.execution_id, a.workflow_id, w.name,
       a.executed_by_instance_id, a.trigger_source,
       now() - a.started_at AS run_age,
       now() - a.heartbeat_at AS heartbeat_age,
       a.running_node_ids, a.attempt, a.recoverable, a.cancel_requested_at
FROM active_workflow_executions a
JOIN workflows w ON w.id = a.workflow_id
ORDER BY a.started_at
LIMIT 50;

SELECT t.workflow_id, w.name, count(*) AS trace_records,
       sum(coalesce(t.total_tokens, 0)) AS tokens
FROM llm_traces t
LEFT JOIN workflows w ON w.id = t.workflow_id
WHERE t.created_at >= now() - interval '1 hour'
GROUP BY t.workflow_id, w.name
ORDER BY tokens DESC
LIMIT 20;
```

Wartości NULL dla workflow_id mogą reprezentować aktywność czatu lub asystenta. Rekordy trace nie są generowane dla niezapisanych przebiegów testowych w edytorze canvas.

Powiąż czas bazy danych z wykonaniem na poziomie węzłów. Przeglądaj wąskie gardła węzłów w [zakładce Traces](../tabs/traces-tab.md). Skoreluj wykonywanie workflow ze skokami użycia CPU, pamięci i połączeń bazy danych na hoście/podzie.

**Усунення наслідків**

1. W przypadku gwałtownego napływu żądań od zewnętrznych producentów, ogranicz konsumenta webhooka lub API na poziomie ingressu lub bramy API przed modyfikacją definicji workflow.
2. Administrator instancji z dostępem do workflow może wstrzymać jego automatyczne triggery za pomocą obsługiwanego punktu końcowego:
```bash
   HEYM_WORKFLOW_ID='<workflow-uuid>'
   curl --config "$HEYM_CURL_CONFIG" --fail --silent --show-error \
     --output /dev/null --connect-timeout 3 --max-time 30 --request POST \
     "$HEYM_PUBLIC_URL/api/workflows/$HEYM_WORKFLOW_ID/pause-triggers"
   ```

   Wstrzymanie automatycznych triggerów nie zatrzymuje zadań już uruchomionych lub oczekujących w kolejce. Zatrzymuje przyszłe wywołania harmonogramu, webhooków i odpytywania (polling).

3. W przypadku instalacji klastrowej ustaw pojemność workerów w **Ustawienia > Instancje** lub przekieruj ruch, dostosowując wagi workerów.
4. Jeśli zidentyfikowany aktywny przebieg musi zostać zatrzymany, zażądaj anulowania, używając jego dokładnego execution_id:
```bash
   HEYM_EXECUTION_ID='<execution-uuid>'
   curl --config "$HEYM_CURL_CONFIG" --fail --silent --show-error \
     --connect-timeout 3 --max-time 30 --request POST \
     "$HEYM_PUBLIC_URL/api/workflows/$HEYM_WORKFLOW_ID/executions/$HEYM_EXECUTION_ID/cancel"
   ```

   Potwierdź ostateczny stan w historii i usunięcie z rejestru. `cancel_requested` działa asynchronicznie: węzły kooperacyjne zatrzymują się na granicach kroków, podczas gdy długotrwałe wywołania HTTP lub LLM kończą bieżące żądanie przed przerwaniem.

**Перевірка:** Częstotliwość wykonywania spada, zużycie CPU i pamięci przez workery wraca do normy, liczba połączeń z bazą danych stabilizuje się, a workflowy o normalnym priorytecie wznawiają działanie zgodnie z harmonogramem.

**Ескалація:** Właściciel workflow w celu sprawdzenia logiki lub zmniejszenia częstotliwości harmonogramu; dyżur platformowy, jeśli anulowanie nie zatrzyma wykonania.

## Zaległości w kolejce lub pozornie zablokowane przebiegi

**Рівень серйозності:** P2, gdy opóźnienie w kolejce przekracza progi biznesowe; P1, gdy wzrost kolejki zagraża limitom pamięci masowej lub połączeń bazy danych.

**Діагностика**

Pobierz migawkę niedokończonych wierszy kolejki. Filtr stanu obejmuje starsze niedokończone zadania, a nie tylko ostatnie przyrosty.
```sql
SELECT status, placement, target_instance_id, count(*) AS runs,
       min(enqueued_at) AS oldest_enqueued_at,
       max(now() - enqueued_at) AS oldest_age
FROM workflow_run_queue
WHERE status IN ('held', 'queued', 'waiting_for_main', 'claimed')
GROUP BY status, placement, target_instance_id
ORDER BY oldest_enqueued_at;

SELECT q.execution_id, q.workflow_id, w.name, q.status, q.placement,
       q.target_instance_id, q.enqueued_at, q.not_after, q.expires_at,
       q.claimed_at, a.heartbeat_at, a.cancel_requested_at
FROM workflow_run_queue q
JOIN workflows w ON w.id = q.workflow_id
LEFT JOIN active_workflow_executions a ON a.execution_id = q.execution_id
WHERE q.status IN ('held', 'queued', 'waiting_for_main', 'claimed')
ORDER BY q.enqueued_at
LIMIT 50;
```

| Stan | Interpretacja | Działanie |
| --- | --- | --- |
| `held` | Oczekiwanie na produkcyjny slot współbieżności workflow | Sprawdź limit współbieżności tego workflow w jego ustawieniach |
| `pending` | Oczekiwanie na przypisanie do workera | Sprawdź uprawnienia workerów i liczbę aktywnych instancji poniżej |
| `running` | Przypisany do workera, wykonanie aktywne | Sprawdź heartbeat workera i stan wątków |
| `waiting_hitl` | Wstrzymany w oczekiwaniu na ludzkie zatwierdzenie | Stan oczekiwany; potwierdź z właścicielem workflow |
| `cancel_requested` | Anulowanie przyjęte, oczekiwanie na granicę kroku | Monitoruj zakończenie; eskaluj w przypadku impasu |

Sprawdź, czy nie ma przestarzałych lub osieroconych przebiegów, których przypisany worker przestał wysyłać heartbeaty:

1. W instalacjach z pojedynczą instancją potwierdź, że usługa main ma wolną pojemność współbieżności.
2. Otwórz **Ustawienia > Instancje** jako administrator instancji lub wykonaj zapytanie:
```bash
   curl --config "$HEYM_CURL_CONFIG" --fail --silent --show-error \
     --connect-timeout 3 --max-time 10 "$HEYM_PUBLIC_URL/api/admin/cluster"
   ```

3. Sprawdź `cluster_enabled`, `live`, `compatible`, `enabled`, `weight`, `credentials_synced`, wiek heartbeatu, opóźnienie DB i dostępność piaskownicy (`docker_ok`). Instancja potrzebuje zarówno uprawnień, jak i liveness, aby otrzymywać pracę rozproszoną. Historyczna nazwa `docker_ok` obejmuje także osiągalność piaskownicy Kubernetes.
```sql
SELECT id, name, role, enabled, weight, weight_configured,
       version, schema_revision, docker_ok, db_latency_ms,
       now() - heartbeat_at AS heartbeat_age,
       now() - credentials_synced_at AS credential_sync_age
FROM cluster_instances
ORDER BY role, id;

SELECT executed_by_instance_id, status, count(*) AS recorded_runs
FROM execution_history
WHERE started_at >= now() - interval '1 hour'
GROUP BY executed_by_instance_id, status
ORDER BY executed_by_instance_id, status;
```

Widok SQL heartbeatów jest dowodem, a nie pełnym obliczeniem kompatybilności. Użyj administracyjnego API do logiki kompatybilności i rotacji kluczy. Heartbeaty są wykonywane co 10 sekund; wiek heartbeatu powyżej 30 sekund wskazuje na partycjonowanie sieci lub zawieszone procesy workerów.

**Усунення наслідків**

1. Jeśli workery są sprawne, ale nasycone, przeskaluj repliki workerów lub dodaj instancje zgodnie z sekcją [Skalowanie klastra](#sprawdzenia-trybu-klastra).
2. W przypadku osieroconego przebiegu na martwym workerze zainicjuj odzyskiwanie lub anuluj wykonanie za pomocą [Odzyskiwania wykonania](#kontrolowany-restart-usługi).
3. Jeśli oczekujące przebiegi czekają na wyłączonym lub niekompatybilnym workerze, włącz go ponownie lub zaktualizuj jego poświadczenia w **Ustawienia > Instancje**.
4. Jeśli kolejka została zalana zduplikowanymi żądaniami w wyniku zewnętrznej burzy ponowień, wstrzymaj trigger na ingressie lub użyj [Pauzowania workflow](#workflows-zużywające-najwięcej-zasobów).

**Перевірка:** Długość kolejki wykazuje tendencję spadkową, oczekujące przebiegi przechodzą do stanu running w oczekiwanym czasie, a heartbeaty wykazują aktywną pojemność workerów.

**Ескалація:** Dyżur platformowy w przypadku zacięć dyspozytora harmonogramu; dyżur bazy danych, jeśli zapytania odpytujące kolejkę wykazują rywalizację o blokady.

## Sprawdzenia trybu klastra

**Рівень серйозності:** P2 w przypadku workera offline lub obniżonej pojemności; P1, jeśli koordynacja klastra zawiedzie całkowicie.

**Діагностика**

Widok SQL heartbeatów zapewnia przegląd wszystkich instancji.

Kluczowe pola:

- `compatible`: Musi mieć wartość `true`. Niekompatybilny worker jest wykluczony z przydziału zadań.
- `heartbeat_age_seconds`: Wartości powyżej 30 sekund wskazują na potencjalne partycje sieciowe lub zawieszone procesy workerów.
- `weight`: Względna pojemność workera. Waga 0 wyłącza przydzielanie zadań do tej instancji.
- `credentials_complete`: Musi mieć wartość `true` dla workflowów wymagających poświadczeń współdzielonych.

**Усунення наслідків**

1. W przypadku workera offline sprawdź stan poda/kontenera i logi na hoście workera. Postępuj zgodnie z [Restartem usługi](#kontrolowany-restart-usługi).
2. W przypadku niekompatybilnego workera zweryfikuj wersje obrazów we wszystkich instancjach klastra. Wszystkie instancje muszą działać w tej samej wersji. Postępuj zgodnie z [Nieudanym wdrożeniem](#nieudane-wdrożenie-lub-regresja-konfiguracji).
3. W przypadku brakujących poświadczeń zaktualizuj poświadczenia współdzielone z instancji main w **Ustawienia > Poświadczenia**.
4. Aby bezpiecznie opróżnić workera w celu konserwacji, ustaw jego wagę na 0 lub przełącz opcję **On** na wyłączoną w **Ustawienia > Instancje**. Pozwól na dokończenie trwających zadań przed zatrzymaniem.

**Перевірка:** Heartbeat workera wznawia się w ciągu 30 sekund, `compatible` ma wartość `true`, a testowy workflow trafia do odzyskanego workera.

**Ескалація:** Dyżur platformowy w przypadku partycjonowania sieci między instancjami lub rywalizacji o współdzielone blokady bazy danych.

## Instancja main niedostępna, gdy workers działają

**Рівень серйозності:** P1. Instancja main koordynuje harmonogramowanie, obsługuje UI/API i zarządza stanem klastra.

**Діагностика**

1. Potwierdź stan procesu main i wykorzystanie zasobów za pomocą [Konfiguracji poleceń](#konfiguracja-poleceń).
2. Sprawdź łączność z bazą danych z hosta main. Workery mogą nadal przetwarzać lokalnie buforowane przebiegi, podczas gdy main jest nieosiągalny.
3. Sprawdź routing reverse proxy / ingressu do instancji main.

**Усунення наслідків**

1. Jeśli instancja main uległa awarii z powodu OOM lub nieobsłużonego wyjątku, zrestartuj main zgodnie z [Kontrolowanym restartem usługi](#kontrolowany-restart-usługi).
2. Jeśli main czeka na blokadę bazy danych przetrzymywaną przez martwego workera, postępuj zgodnie z [Połączeniami i blokadami](#aktywne-połączenia-db-nasycenie-puli-i-blokady).
3. W Kubernetes zweryfikuj, czy strategia `Recreate` zakończyła terminację poda przed zaplanowaniem nowego.

**Перевірка:** Publiczny interfejs użytkownika ładuje się, punkt końcowy stanu API zwraca HTTP 200, heartbeaty workerów wznawiają raportowanie do main, a canvas edytora działa poprawnie.

**Ескалація:** Incident Commander natychmiast; dyżur platformowy w przypadku awarii pamięci masowej lub węzłów.

## Awarie webhooków, MCP, Portal lub streamingu

**Рівень серйозності:** P2 w przypadku degradacji dotyczącej konkretnego punktu końcowego; P1, jeśli publiczne webhooki po cichu zawodzą we wszystkich workflowach.

**Діагностика**

1. W przypadku awarii webhooków sprawdź routing ingressu, terminację SSL i konfigurację prefiksu ścieżki. Upewnij się, że punkt końcowy webhooka istnieje i jest aktywny.
2. W przypadku awarii streamingu SSE sprawdź ustawienia buforowania proxy. Proxy ingressu (nginx, traefik, envoy) muszą wyłączyć buforowanie odpowiedzi (`X-Accel-Buffering: no` lub odpowiednik) dla `/api/chat/stream` oraz streamingu wykonywania workflow.
3. W przypadku awarii MCP sprawdź ważność klucza API MCP, konfigurację transportu (SSE vs stdio) oraz rejestrację narzędzi w **Ustawienia > MCP**.
4. Przejrzyj logi błędów na instancji main pod kątem niepowodzeń autoryzacji, nieprawidłowych payloadów JSON lub odrzuceń walidacji schematu.

**Усунення наслідків**

1. Wyłącz buforowanie proxy na ścieżkach streamingu na poziomie ingressu lub reverse proxy.
2. W przypadku odrzucenia payloadu webhooka sprawdź strukturę JSON pod kątem specyfikacji triggera workflow. Zaktualizuj zewnętrznego nadawcę, jeśli payloady są źle sformatowane.
3. W przypadku utraty połączenia MCP zrestartuj sesję dotkniętego klienta MCP lub uwierzytelnij się ponownie nowym tokenem.

**Перевірка:** Testowy webhook odpowiada kodem HTTP 200/202, strumień SSE dostarcza przyrostowe fragmenty bez zawieszania się, a klient MCP pomyślnie wyświetla listę narzędzi.

**Ескалація:** Dyżur sieciowy w przypadku problemów z ingresem/buforowaniem; autor workflow w przypadku niezgodności schematu payloadu.

## Problemy z kontenerem, podem, OOM lub pamięcią masową

**Рівень серйозності:** P1, jeśli dotyczy to instancji main lub bazy danych; P2 w przypadku izolowanych restartów workerów.

**Діагностика**
```bash
# Compose container state and host filesystem pressure.
heym_compose ps
docker stats --no-stream
df -h
df -i
```

Sprawdź rzeczywisty system plików wolumenu danych i hosta bazy danych, a także hosta powłoki. Stan kontenera tylko do odczytu bez wartości środowiskowych:
```bash
HEYM_CONTAINER_ID='<affected-container-id>'
docker inspect --format \
  '{{.Name}} status={{.State.Status}} oom={{.State.OOMKilled}} exit={{.State.ExitCode}} restarts={{.RestartCount}}' \
  "$HEYM_CONTAINER_ID"
```

```bash
HEYM_POD='<affected-pod>'
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" describe pod "$HEYM_POD"
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" logs "$HEYM_POD" \
  --all-containers=true --previous --tail=150
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" top pods --containers
```

Zbadaj OOMKilled pod kątem nieudanych sond, pobierania obrazów, planowania Pending, presji na węzły oraz błędów podłączania/montowania wolumenów. Poprzednie logi istnieją tylko wtedy, gdy pod został zrestartowany bez ponownego zaplanowania.

## Nieudane wdrożenie lub regresja konfiguracji

**Рівень серйозності:** P1, jeśli połączenia produkcyjne, przetwarzanie zadań lub migracje zawodzą; P2 w przypadku izolowanych regresji funkcji.

**Діагностика:** Porównaj czas rozpoczęcia błędu z wdrożeniem, rzeczywistymi skrótami obrazów, rewizją konfiguracji/sekretów, stanem migracji i ostatnią potwierdzoną zmianą. Sprawdź historię wdrożeń i oczyszczone diffy. Nigdy nie wklejaj pełnych zmiennych środowiskowych, wyrenderowanych sekretów Compose ani danych Secret Kubernetes do raportu z incydentu.
```sql
SELECT version_num FROM alembic_version;
```

```bash
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout history \
  "deployment/$HEYM_MAIN_DEPLOYMENT"
```

**Усунення наслідків**

1. Zatrzymaj wdrażanie i odetnij ruch zewnętrzny, jeśli błędy zagrażają integralności danych lub kaskadowo wpływają na zależności.
2. Zweryfikuj ostatni znany działający skrót obrazu, commit Git oraz rewizję Helma/manifestu. Sprawdź ostatnie diffy ConfigMap, Secret i środowiska.
3. Jeśli schemat jest zgodny, przywróć zatwierdzony obraz/konfigurację za pomocą narzędzi wdrożeniowych. Wycofaj do określonej, przetestowanej rewizji, a nie do zakładanej poprzedniej:
```bash
   HEYM_ROLLBACK_REVISION='<approved-revision-number>'
   kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout undo \
     "deployment/$HEYM_MAIN_DEPLOYMENT" --to-revision="$HEYM_ROLLBACK_REVISION"
   kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout status \
     "deployment/$HEYM_MAIN_DEPLOYMENT" --timeout=180s
   ```

4. Wycofanie (rollback) wdrożenia przywraca szablon poda; nie przywraca zewnętrznych wartości Secret ani ConfigMap, jeśli zostały nadpisane. Przywracaj zmiany konfiguracji równolegle.
5. Nigdy nie obniżaj wersji obrazu wydania poniżej niekompatybilnej migracji schematu bazy danych. Jeśli migracja wprowadziła nieodwracalne zmiany w tabelach lub kolumnach, napraw błąd do przodu za pomocą przetestowanej poprawki lub przywróć bazę danych za pomocą [Disaster recovery](#disaster-recovery-i-reagowanie-awaryjne).
6. Po wycofaniu zrestartuj zależne workery, aby upewnić się, że cała flota działa na tej samej wersji wydania.

**Перевірка:** Kontrole stanu odpowiadają kodem 200, workery zgłaszają tę samą wersję wydania w **Ustawienia > Instancje**, wersja migracji schematu odpowiada docelowemu wydaniu, a workflow smoke kończy się sukcesem.

**Ескалація:** Incident Lead oraz inżynier wydań natychmiast dla P1. Zaangażuj administratora bazy danych, jeśli wymagane jest czyszczenie migracji lub przywracanie schematu.

## Awaria modelu, poświadczenia lub integracji

**Рівень серйозності:** P2 w przypadku awarii konkretnego dostawcy lub limitów stawek (rate limits); P1, jeśli żaden skonfigurowany model nie odpowiada na potrzeby workflowów.

**Діагностика**

1. Odróżnij awarię po stronie dostawcy, wygaśnięcie/odwołanie poświadczeń, limit zapytań (HTTP 429) i przekroczenia limitu czasu sieci.
2. Sprawdź strony stanu dostawców (OpenAI, Anthropic, Google AI itp.).
3. Przetestuj poprawność poświadczeń w **Ustawienia > Poświadczenia** za pomocą wbudowanego przycisku testu.
4. Sprawdź logi aplikacji, aby zidentyfikować klasyfikację błędu: `RateLimitError`, `AuthenticationError`, `InvalidRequestError` lub `APIConnectionError`.

**Усунення наслідків**

1. W przypadku limitów zapytań (429) przełącz węzły workflow na poświadczenia rezerwowe lub model dostawcy z dostępnym limitem.
2. W przypadku wygasłych poświadczeń zrotuj klucz w **Ustawienia > Poświadczenia**. Heym aktualizuje współdzielone poświadczenia we wszystkich workerach klastra.
3. W przypadku awarii dostawców nadrzędnych tymczasowo wstrzymaj dotknięte workflowy lub skonfiguruj alternatywne trasowanie modeli.

**Перевірка:** Test poświadczeń przechodzi pomyślnie w UI, wykonywanie agenta kończy się bez błędów HTTP 4xx/5xx, a opóźnienia ponowień znikają.

**Ескалація:** Właściciel poświadczeń / lider zespołu w celu rozliczeń lub odnowienia kluczy; wsparcie zewnętrznego dostawcy w przypadku rozległych awarii.

## Awaria piaskownicy (sandbox)

**Рівень серйозності:** P2 w przypadku pojedynczych awarii węzłów kodu; P1, jeśli wykonywanie w piaskownicy jest wymagane dla krytycznych workflowów biznesowych.

**Діагностика**

1. Zidentyfikuj tryb wykonywania piaskownicy: proces lokalny, kontener Docker czy pod piaskownicy Kubernetes.
2. Sprawdź responsywność demona Docker na hoście piaskownicy lub planowanie podów piaskownicy Kubernetes.
3. Kubernetes: sprawdź pody piaskownicy w skonfigurowanej przestrzeni nazw (namespace), ich zdarzenia i NetworkPolicies. Piaskownice mogą używać osobnej przestrzeni nazw:
```bash
   HEYM_SANDBOX_NAMESPACE='<actual-sandbox-namespace>'
   kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_SANDBOX_NAMESPACE" get pods \
     -l app.kubernetes.io/managed-by=heym -L heym.run/sandbox,heym.run/instance
   ```

4. Sprawdź skonfigurowaną zmienną `HEYM_SANDBOX_BACKEND` i specyficzne dla typu ustawienia piaskownicy w zmiennych środowiskowych.
5. Jeśli kontenery Docker zawodzą, upewnij się, że gniazdo Dockera jest zamontowane, a użytkownik Heym posiada uprawnienia do interakcji z demonem.
6. W przypadku piaskownic Kubernetes upewnij się, że ServiceAccount posiada uprawnienia do tworzenia i zarządzania podami w przestrzeni nazw piaskownicy.

**Перевірка:** Węzeł kodu wykonuje się pomyślnie w wyizolowanej piaskownicy, zwraca oczekiwane wyniki, a zasoby piaskownicy są poprawnie sprzątane po wykonaniu.

**Ескалація:** Dyżur platformowy w przypadku problemów z demonem Docker na poziomie hosta lub awarii infrastruktury piaskownicy Kubernetes.

## Аварійне відновлення та реагування

**Рівень серйозності:** P1 w przypadku katastrofalnej utraty danych, awarii hosta lub całkowitego zniszczenia środowiska.

**Procedura**

1. Ogłoś incydent awaryjny i wyznacz Incident Commandera. Powiadom interesariuszy za pośrednictwem ustalonych kanałów awaryjnych.
2. Odizoluj uszkodzone środowisko, aby zapobiec dalszej utracie danych lub sprzecznym zapisom. Nie dopuść, aby stare i nowe instalacje przetwarzały jednocześnie to samo obciążenie.
3. Przywróć PostgreSQL za pomocą przetestowanej procedury kopii zapasowej/PITR w docelowym środowisku odzyskiwania. Przywróć pasujące dane plików/wtyczek/przestrzeni roboczych kodu instancji main oraz wymagany zestaw kluczy szyfrowania i sekret podpisywania z bezpiecznej kopii zapasowej. Kopia zapasowa samej bazy danych nie zawiera bajtów plików.
4. Uruchom pojedynczą docelową instancję main, używając wydania zgodnego z przywróconym schematem. Sprawdź migracje przed uruchomieniem, ponieważ punkt wejścia main je wykonuje. Workery nie mogą rywalizować z migracjami.
5. Utrzymuj produkcyjny ingress i producentów w izolacji podczas kontroli. Uruchomiona instancja main może wybrać lidera i uruchomić przywrócone harmonogramy/odzyskiwanie; przed uruchomieniem skorzystaj z udokumentowanych ograniczeń sieciowych i kontroli wyzwalania/odzyskiwania workflowów. Przywracanie danych nie jest pasywnym podglądem.
6. Uzgodnij aktywne/oczekujące/wstrzymane rekordy oraz wszelkie automatyczne ponowne uruchomienia z właścicielami. Odzyskiwanie restartuje kwalifikujące się przebiegi od początku i nie może cofnąć skutków zewnętrznych. Nie odtwarzaj każdego wiersza, który zakończył się niepowodzeniem lub został pominięty.
7. Zweryfikuj odczyty/zapisy DB, logowanie, deszyfrowanie poświadczeń, pliki Drive, wtyczki, dostęp agentów kodujących do obszaru roboczego oraz zatwierdzone workflowy smoke (wyłącznie main i dystrybuowalne). Stopniowo dodawaj kompatybilne workery, a następnie ponownie otwórz przyjmowanie zadań i ingress.
8. Zarejestruj rzeczywisty przedział utraty danych, czas trwania odzyskiwania, pominięte prace i nierozstrzygnięte uzgodnienia. Zaplanuj kolejny test odzyskiwania, jeśli ta procedura ujawniła luki.

**Перевірка:** Wspólna bramka weryfikacyjna zostaje zaliczona, krytyczne harmonogramy zostają wznowione, właściciele akceptują uzgodnienia, a monitorowanie kopii zapasowych/przywracania zostaje przywrócone. Zdrowa pusta instalacja to nie odzyskanie danych.

**Ескалація:** Incident Lead wraz z właścicielami bazy danych, pamięci masowej i platformy przez cały czas. Nie improwizuj destrukcyjnych napraw katalogów danych ani aktywacji w dwóch lokalizacjach.

## Шаблон доказів і передачі
```text
Incident / severity / environment:
Impact and first observed time (UTC):
Main / worker / database / deployment identifiers:
Last release or configuration change:
Affected workflow IDs and execution IDs:
Public health / direct health / DB check:
Connection totals, blocker PIDs, queue depth and oldest age:
Instance eligibility, leader evidence, CPU / memory / disk:
Action taken, timestamp, operator, expected effect:
Verification result and observation window:
Temporary restrictions, reversal owner, expiry:
Skipped / failed / recovered work requiring reconciliation:
Next action, owner, next update time:
```

Zbieraj ograniczone logi i identyfikatory; usuwaj wartości poświadczeń, nagłówki autoryzacyjne, linki do uprawnień, payloady użytkowników i parametry SQL przed dołączeniem dowodów. Zdarzenia audytu routera znajdują się na stdout instancji main. Historia wykonań rejestruje wykonującą instancję; błędy wykonania mogą zatem wymagać logów zarówno od workerów, jak i od main.

## Посилання на реалізацію

Poniższe ścieżki identyfikują implementację sprawdzoną podczas tworzenia tego runbooka. Zweryfikuj je ponownie, gdy zmieni się zachowanie wykonania, wdrożenia lub schematu.

| Temat | Źródło |
| --- | --- |
| Usługi stanu i uruchamiania | [main.py](https://github.com/heymrun/heym/blob/main/backend/app/main.py) |
| Ustawienia puli i tagi połączeń | [config.py](https://github.com/heymrun/heym/blob/main/backend/app/config.py), [session.py](https://github.com/heymrun/heym/blob/main/backend/app/db/session.py) |
| Liczba procesów i migracje | [Punkt wejścia backendu](https://github.com/heymrun/heym/blob/main/backend/entrypoint.sh), [Punkt wejścia wydania](https://github.com/heymrun/heym/blob/main/docker/release-entrypoint.sh) |
| Topologia wdrożenia i rzeczywiste mapowania środowiska | [Compose](https://github.com/heymrun/heym/blob/main/docker-compose.yml), [Przykład klastra](https://github.com/heymrun/heym/blob/main/docker-compose.cluster.yml), [Przykład workera](https://github.com/heymrun/heym/blob/main/docker-compose.worker.yml), [Kubernetes](../getting-started/kubernetes.md) |
| Kwalifikowalność i liveness rejestru | [registry.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cluster/registry.py), [API klastra](https://github.com/heymrun/heym/blob/main/backend/app/api/admin_cluster.py) |
| Rozmieszczenie, stany kolejki i dyspozycja | [node_placement.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cluster/node_placement.py), [run_queue.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cluster/run_queue.py), [dispatch.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cluster/dispatch.py) |
| Przywództwo i konserwacja | [distributed_lock.py](https://github.com/heymrun/heym/blob/main/backend/app/services/distributed_lock.py), [cron_scheduler.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cron_scheduler.py) |
| Odzyskiwanie i anulowanie | [execution_recovery.py](https://github.com/heymrun/heym/blob/main/backend/app/services/execution_recovery.py), [execution_cancellation.py](https://github.com/heymrun/heym/blob/main/backend/app/services/execution_cancellation.py) |
| Punkty końcowe wstrzymywania/wznawiania/anulowania workflow | [workflows.py](https://github.com/heymrun/heym/blob/main/backend/app/api/workflows.py), [workflow_lifecycle.py](https://github.com/heymrun/heym/blob/main/backend/app/services/workflow_lifecycle.py) |
| Definicje tabel i kolumn diagnostycznych | [models.py](https://github.com/heymrun/heym/blob/main/backend/app/db/models.py) |
| Interpretacja wydajności i kosztów | [Analytics](../tabs/analytics-tab.md), [Traces](../tabs/traces-tab.md), [Alerts](../tabs/alerts-tab.md) |
