# Rejestrowanie audytu

Heym zapisuje wiersz audytu dla każdej akcji istotnej z punktu widzenia bezpieczeństwa: kto ją wykonał, na czym i czy zakończyła się powodzeniem. Wiersze trafiają na standardowe wyjście backendu przez logger `winston.audit`, obok logu dostępu do żądań, i można je odczytać z zakładki **Logs** lub za pomocą `docker logs`.

Rejestrowanie audytu jest **zawsze włączone**. Nie ma nic do włączenia ani żadnej zmiennej środowiskowej do ustawienia.

## Format wiersza

Jedna akcja tworzy dokładnie jeden samodzielny wiersz:

```
2026-08-25 14:02:11 INFO [winston.audit] audit action=credential.delete outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="OpenAI Prod" credential_type=openai
```

Każdy wiersz zawiera następujące pola:

| Pole | Opis |
|-------|-------------|
| `action` | Co się wydarzyło, w formacie `resource.verb` — patrz tabela poniżej. |
| `outcome` | `success`, `failure` lub `denied`. |
| `actor_id` | UUID użytkownika, który wykonał akcję. Nieobecne wyłącznie wtedy, gdy nikt nie był uwierzytelniony. |
| `actor_email` | Adres e-mail tego użytkownika. Przy nieudanym logowaniu jest to adres, którego próbowano użyć, a nie potwierdzone konto. |
| `target` | Obiekt, na którym wykonano akcję, w formacie `type:uuid`. |
| `target_name` | Czytelna dla człowieka nazwa tego obiektu, ujęta w cudzysłów, gdy zawiera spacje. |

Następnie występują pola specyficzne dla akcji — na przykład `credential_type`, `imported`, `grantee_email`, `team_name`. Wartości zawierające spację, cudzysłów lub `=` są ujmowane w cudzysłów; wartości dłuższe niż 256 znaków są skracane znacznikiem `...(truncated)`.

## Odczytywanie logu

Logger audytu jest potomkiem loggera żądań, więc oba trafiają do tego samego strumienia, pozostając rozdzielnymi:

```bash
# Only audit lines, no access-log noise
docker logs heym-backend 2>&1 | grep '\[winston.audit\]'

# Everything one user did
docker logs heym-backend 2>&1 | grep 'actor_email=alex@example.com'

# Failed logins and refused access
docker logs heym-backend 2>&1 | grep -E 'outcome=(failure|denied)'

# Everything that touched one credential
docker logs heym-backend 2>&1 | grep 'target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43'
```

W aplikacji zakładka **Logs** odczytuje to samo wyjście kontenera. Jest ona ograniczona przez `DOCKER_LOGS_ENABLED` oraz listę dozwolonych adresów `DOCKER_LOGS_ALLOWED_EMAILS`.

## Co jest rejestrowane

Rejestrowana jest każda zmiana stanu. Odczyty są rejestrowane tylko tam, gdzie sam odczyt jest czynnością wrażliwą — przeglądanie historii uruchomień workflow, otwarcie danych logowania, pobranie pliku. Zwykłe odczyty list i szczegółów nie są objęte audytem; log dostępu już odnotowuje, że żądanie miało miejsce, a audytowanie każdego `GET` zalałoby wiersze, które mają znaczenie. Jedynym wyjątkiem są [odsłony stron](#page-views), które rejestrują, gdzie zalogowany użytkownik nawigował w aplikacji.

### Uwierzytelnianie

| Akcja | Uwagi |
|--------|-------|
| `auth.register` | `outcome=denied`, gdy rejestracja jest wyłączona lub gdy logowanie hasłem jest wyłączone (`reason=password_login_disabled`), `failure`, gdy adres e-mail jest już zajęty. |
| `auth.login` | `outcome=failure` odnotowuje wypróbowany adres oraz to, czy adres e-mail był nieznany, czy hasło było błędne. |
| `auth.logout` | Podmiot jest ustalany na podstawie cookie odświeżania, więc wylogowanie bez niego jest rejestrowane bez tożsamości. |
| `auth.token_refresh` | `outcome=denied` z `reason=refresh_token_replayed_or_revoked` — sygnał kradzieży tokenu, wart alertowania. |
| `auth.password_change` | `outcome=failure`, gdy bieżące hasło było błędne. |
| `auth.sso_login` | Logowanie jednokrotne. `outcome=failure` zawiera powód odrzucenia odpowiedzi dostawcy; `denied` zawiera `email_not_verified`, `domain_not_allowed` lub `provisioning_disabled`. |
| `sso_settings.update` | Administrator zmienił konfigurację [SSO](./sso.md). Odnotowuje `enabled` i `password_login_disabled`, nigdy klucz klienta. |
| `sso_settings.test` | Administrator uruchomił test połączenia SSO. |

### Odsłony stron

Wpis `page.view` jest tworzony za każdym razem, gdy zalogowany użytkownik otwiera stronę w aplikacji internetowej, ze ścieżką URL w polu `path`:

```
2026-10-29 09:14:02 INFO [winston.audit] audit action=page.view outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com path="/?tab=traces"
```

Ścieżka to trasa wewnątrz aplikacji. Zakładki dashboardu są jej częścią (`/?tab=traces`), podobnie jak identyfikatory określające, co jest otwarte, np. `/workflows/<id>`. Zachowywana jest tylko krótka lista parametrów zapytania identyfikujących stronę (`tab`, `dashboard`, `board`, `suite`, `workflowId`, `traceId`); wszystko inne w ciągu zapytania oraz cały fragment są odrzucane. Strony, których link zawiera wpis tajny, np. `/review/<token>`, są rejestrowane z symbolem zastępczym `:token` zamiast wpisu tajnego.

Ponieważ przeglądarka zgłasza ścieżkę, wiersz `page.view` pokazuje, dokąd użytkownik deklarował przejście. Nie stanowi to dowodu, że serwer zwrócił tę stronę. Odwiedziny strony logowania oraz linki otwierane bez zalogowania nie są rejestrowane, ponieważ żaden użytkownik nie jest do nich przypisany.

### Workflows

`workflow.create` · `workflow.update` · `workflow.delete` · `workflow.version_revert` · `workflow.run` · `workflow.history_view` · `workflow.history_clear` · `workflow.share_add` · `workflow.share_remove` · `workflow.team_share_add` · `workflow.team_share_remove` · `workflow.execution_token_create` · `workflow.execution_token_revoke`

Wpis `workflow.run` jest zapisywany, gdy uruchomienie zostaje zainicjowane przez API: przycisk Uruchom w edytorze, punkt końcowy execute z sesją, kluczem API lub webhookiem, portal czatu oraz narzędzia MCP. Rejestruje, kto je uruchomił, w jaki sposób i jak się zakończyło:

```
[winston.audit] audit action=workflow.run outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=workflow:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="Invoice triage" status=success trigger_source=Canvas execution_id=c1d2e3f4-0a1b-4c2d-8e3f-5a6b7c8d9e0f duration_ms=1235 test_run=true
```

`execution_id` łączy wiersz z uruchomieniem w Historii uruchomień. `outcome` przyjmuje wartość `failure`, gdy uruchomienie zakończyło się statusem `error`, `cancelled` lub `timeout`. Uruchomienie wstrzymane do weryfikacji przez człowieka lub w kolejce współbieżności to linia `success` ze statusem `status=pending` lub `status=queued`. Wywołanie bez zalogowanego użytkownika, np. anonimowy webhook lub gość portalu, nie zawiera pól `actor_id` ani `actor_email`. Dane wejściowe i wyjściowe nigdy nie są zapisywane.

Uruchomienia zainicjowane przez harmonogram, węzeł triggera, kolejkę lub zdarzenie nie stanowią wierszy audytu. Wykonują się one na instancji, która je pobrała, i są rejestrowane w Historii uruchomień wraz ze źródłem triggera i instancją wykonującą.

`workflow.history_view` jest zapisywany, gdy ktoś otwiera historię uruchomień workflowu. Krótkie zapytanie sprawdzające najnowsze uruchomienie na canvasie lub liście nie podlega audytowi.


`workflow.history_view` odnotowuje `owned=false`, gdy współpracownik przegląda historię uruchomień należącą do kogoś innego. `workflow.delete` odnotowuje `outcome=denied` z `reason=not_owner`, gdy współpracownik próbuje usunąć.

### Dane logowania

`credential.create` · `credential.update` · `credential.delete` · `credential.detail_view` · `credential.share_add` · `credential.share_remove` · `credential.team_share_add` · `credential.team_share_remove`

`credential.detail_view` jest objęte audytem, ponieważ otwarcie danych logowania powoduje ich odszyfrowanie. Niepowodzenie odnotowuje `outcome=denied`, co jest obrazem próby enumeracji identyfikatorów danych logowania.
### Inne zasoby

| Zasób | Akcje |
|----------|---------|
| Zmienne | `variable.create` · `update` · `delete` · `bulk_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Magazyny wektorowe | `vector_store.create` · `update` · `delete` · `clone` · `upload` · `item_delete` · `items_delete_by_source` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Alerty | `alert.create` · `update` · `delete` · `event_acknowledge` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` · `disable_on_access_revoke` |
| Tabele danych | `data_table.create` · `update` · `delete` · `clone` · `row_create` · `row_update` · `row_delete` · `rows_clear` · `rows_bulk_create` · `import_csv` · `export_csv` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Dashboardy | `dashboard.create` · `update` · `delete` · `widget_create` · `widget_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Tablice | `board.create` · `update` · `delete` · `column_create` · `column_update` · `column_delete` · `column_empty` · `card_create` · `card_update` · `card_delete` · `card_move` · `card_run` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Dysk | `drive.upload` · `download` · `delete` · `delete_all` · `bulk_delete` · `share_create` · `share_revoke` · `team_sharing_update` · `bulk_team_sharing_update` |
| Zespoły | `team.create` · `update` · `delete` · `member_add` · `member_remove` |
| Foldery | `folder.create` · `update` · `delete` · `workflow_move` |

Operacje masowe są rejestrowane raz na żądanie wraz z liczbą, a nie raz na wiersz. Import CSV obejmujący 5 000 wierszy generuje jedną linię `data_table.import_csv` zawierającą wartości `imported`, `rejected` oraz `total`.

## Wpisy tajne nigdy nie trafiają do logów

Linia audytu rejestruje identyfikatory, nazwy oraz liczby. Nigdy nie rejestruje zawartości danych logowania, wartości zmiennej, hasła ani tokenu.

Zapewniają to dwa mechanizmy. Miejsca wywołań są napisane tak, aby przekazywać wyłącznie bezpieczne pola, a helper audytu dodatkowo redaguje dane jako zabezpieczenie: każde pole, którego nazwa zawiera `password`, `secret`, `token`, `api_key`, `value`, `authorization`, `cookie` lub podobny ciąg, zostaje zastąpione wartością `***`, zanim linia zostanie zbudowana. Nadmierna redakcja jest zamierzona — nieprzydatna linia jest lepsza niż ujawnione dane logowania.

W przypadkach, gdy wpis tajny jest rzeczywiście istotny dla rekordu, rejestrowany jest wyłącznie jego kształt. Udostępnienie pliku rejestruje `password_protected=true`, nigdy samo hasło.

## Heym Work

Gdy uruchamiasz Heym Work równolegle z Heym, Work emituje wiersze audytu na stdout własnego kontenera w tym samym formacie Winston:

```bash
docker logs heym-work 2>&1 | grep '[winston.audit]'
```

Work rejestruje akcje użytkowników na stronach, tablicach i rekordach:

| Akcja | Znaczenie |
|---|---|
| `page.create`, `page.update`, `page.delete` | Zmiany stron i układów dashboardu |
| `board.column_create`, `board.column_move`, `board.column_delete` | Zmiany układu kolumn Kanban |
| `card.create`, `card.move`, `card.archive`, `card.delete` | Zdarzenia cyklu życia kart |
| `record.create`, `record.update`, `record.delete` | Modyfikacje rekordów tabeli danych za pośrednictwem Work |
| `chat.message` | Prompt użytkownika przesłany do asystenta Work |
| `export.csv`, `export.json` | Eksporty danych |

Każdy wiersz zawiera te same pola `actor_id`, `actor_email`, `timestamp` i `outcome` co wiersze audytu Heym, dzięki czemu moduły gromadzenia logów mogą przetwarzać oba źródła za pomocą jednego potoku.

## Retencja

**Linie audytu istnieją tylko tak długo, jak długo utrzymywane jest wyjście logów kontenera.** Nie są zapisywane do bazy danych. Odtworzenie kontenera backendu powoduje utratę jego logów.

Jeżeli wymagana jest historia audytu, która przetrwa ponowne wdrożenie, należy przekierować stdout kontenera do trwałego miejsca — drivera logów, kolektora sidecar lub agregacji logów platformy — w taki sam sposób, jak w przypadku każdego innego logu kontenera.

## Dla współtwórców

Emisja linii audytu wymaga jednego wywołania:

```python
from app.services.audit_log import audit

audit(
    action="credential.delete",
    actor=current_user,
    target_type="credential",
    target_id=credential.id,
    target_name=credential.name,
)
```

Helper jest synchroniczny, nie odwołuje się do bazy danych i samodzielnie pochłania własne błędy, dzięki czemu wywołanie audytu nie może zakończyć się niepowodzeniem ani spowolnić żądania.

Przy dodawaniu wywołania obowiązują trzy zasady:

1. **Nazwa akcji w formacie `resource.verb` w snake_case.** Plik `backend/tests/test_audit_log.py` analizuje każde wywołanie `audit()` w katalogu `app/api/` i przerywa kompilację w przypadku nazwy, która nie pasuje do wzorca, oraz w przypadku objętego zasobu, który utracił wszystkie swoje miejsca wywołań.

2. **Odczytuj wyłącznie atrybuty, które z pewnością istnieją.** Konstrukcja `try/except` helpera chroni jego własne ciało, a nie wyrażenia przekazywane do niego — `AttributeError` w `target_name=workflow.name` jest zgłaszany w miejscu wywołania, zanim uruchomi się `audit()`, i przerwie żądanie. Odczytuj kolumny ORM oraz zmienne lokalne, a nie atrybuty opcjonalne lub ładowane leniwie.

3. **Rejestruj usunięcie przed wykonaniem operacji delete.** Po `db.delete(row)` nazwa i identyfikator, które mają zostać zapisane, mogą już nie istnieć. Wywołanie należy umieścić powyżej tej operacji.
