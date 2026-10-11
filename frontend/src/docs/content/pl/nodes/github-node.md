# Węzeł GitHub

Węzeł **GitHub** dodaje natywne operacje GitHub REST do workflow, podobnie jak znane z narzędzi takich jak n8n wielooperacyjne węzły GitHub.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Dane logowania | GitHub |
| Wyjście | `$nodeLabel.*` |

## Obsługiwane operacje

Węzeł udostępnia obecnie 40 akcji:

| Zasób | Akcje |
|----------|---------|
| Repository | `Get Repository`, `Get Repository License`, `Get Repository Profile`, `Get Repository Issues`, `Get Repository Pull Requests`, `List Popular Paths for Repository`, `List Top Referrers for Repository` |
| Organization / User | `List Organization Repositories`, `List User Repositories`, `Get User Repositories`, `Get User Issues`, `Invite User` |
| Issue | `Create Issue`, `Get Issue`, `List Issues`, `Edit Issue`, `Lock Issue`, `Create Comment` |
| Pull request | `Create Pull Request`, `List Pull Requests` |
| Review | `Create Review`, `Get Review`, `List Reviews`, `Update Review` |
| Release | `Create Release`, `Get Release`, `List Releases`, `Update Release`, `Delete Release` |
| Workflow | `List Workflows`, `Get Workflow`, `Enable Workflow`, `Disable Workflow`, `Get Workflow Usage`, `Dispatch Workflow`, `Dispatch Workflow and Wait` |
| File | `Get File`, `List Files`, `Create or Update File`, `Delete File` |

## Dane logowania

Należy utworzyć dane logowania **GitHub** w [zakładce Dane logowania](../tabs/credentials-tab.md), podając:

- Personal access token
- Opcjonalny pełny bazowy adres URL REST API dla GitHub Enterprise Server

Dla GitHub.com należy pozostawić bazowy adres URL pusty. Zalecane są fine-grained PAT.

W przypadku GitHub Enterprise Server należy wprowadzić kompletny endpoint REST API wraz z `/api/v3`, na przykład
`https://github.example.com/api/v3`. Nie należy podawać wyłącznie adresu głównego interfejsu web
(`https://github.example.com`).

Jeżeli używany jest GitHub Enterprise Server i dane logowania są później edytowane w celu rotacji tokena, pozostawienie
`base_url` pustego zachowuje istniejący endpoint Enterprise. Nowy adres URL należy wprowadzić wyłącznie wtedy, gdy
endpoint ma zostać zmieniony.

## Pola wspólne

Większość operacji wykorzystuje:

- **Owner** – Właściciel repozytorium, nazwa organizacji lub nazwa użytkownika
- **Repository** – Nazwa repozytorium

`List Organization Repositories` wymaga wyłącznie pola **Owner** (nazwy organizacji) i nie korzysta z pola repozytorium.

`List User Repositories` wymaga wyłącznie pola **Owner** (nazwy użytkownika) i nie korzysta z pola repozytorium.

`Get User Repositories` odwzorowuje akcję User → Get Repositories z n8n. `Get User Issues` domyślnie zwraca
zgłoszenia przypisane do uwierzytelnionego użytkownika GitHub. Aby zamiast tego zwrócić zgłoszenia, w których
uwierzytelniony użytkownik jest wspomniany, należy ustawić **Mentioned Filter** na dowolną niepustą wartość.
Operacja obsługuje również filtry state, labels, updated-since, sort, direction oraz per-page. `Invite User` wymaga
organizacji i adresu e-mail i nie korzysta z pól Owner ani Repository.

## Repository

Operacje Repository obejmują metadane, wykrytą treść licencji, profil kondycji społeczności oraz
statystyki ruchu. `List Popular Paths for Repository` oraz
`List Top Referrers for Repository` zwracają najpopularniejsze wpisy ruchu GitHub z ostatnich 14 dni i
wymagają uprawnień administracyjnych push do repozytorium.

`List Issues` obsługuje opcjonalne filtry assignee, creator, mentioned user, etykiety rozdzielone przecinkami,
znacznik czasu updated-since, sort oraz direction. `List Pull Requests` obsługuje kontrolki state, sort,
direction oraz per-page.

`Get Repository Issues` oraz `Get Repository Pull Requests` udostępniają te same API co ich odpowiedniki List
pod jawnymi, zgodnymi z n8n nazwami akcji repozytorium.

### Metadane Get Repository

`Get Repository` zapisuje pełną odpowiedź GitHub w `$github.repository` i udostępnia również
`$github.full_name`, `$github.default_branch`, `$github.private` oraz `$github.url`.

Payload repozytorium zazwyczaj zawiera:

- Tożsamość i własność: ID, nazwa, pełna nazwa, opis, właściciel oraz widoczność
- Stan repozytorium: private, fork, archived, disabled oraz domyślna gałąź
- Adresy URL: strona GitHub, API, clone, SSH oraz Git
- Aktywność i rozmiar: znaczniki czasu utworzenia, aktualizacji i push, rozmiar, gwiazdki, obserwujący, forki, subskrybenci oraz otwarte zgłoszenia
- Funkcje: issues, projects, wiki, Pages, discussions, topics, język oraz strona główna
- Licencja, ustawienia scalania, uprawnienia wywołującego, ustawienia bezpieczeństwa oraz metadane fork parent/source, jeśli są dostępne

Niektóre pola administracyjne, uprawnień, scalania i bezpieczeństwa zależą od uprawnień danych logowania do repozytorium.

Przykład:

- Owner: `heymrun`
- Repository: `heym`

## Issues

Operacje Issue obsługują pola title/body oraz opcjonalne pola tablic JSON dla labels i assignees.

`List Issues` zwraca wyłącznie zgłoszenia repozytorium. Pull requesty są wykluczone; do wyników PR należy użyć `List Pull Requests`.

```json
["bug", "backend"]
```

```json
["octocat"]
```

### Semantyka pól Edit Issue

W przypadku `Edit Issue` do GitHub wysyłane są wyłącznie pola ustawione jawnie:

- **State** – Należy wybrać `Don't change`, `Open` lub `Closed`. Pozostawienie nieustawionego pola zachowuje bieżący stan.
- **State Reason** – Opcjonalnie można ustawić `Completed`, `Not Planned`, `Duplicate` lub `Reopened`.
- **Title / Body** – Pozostawienie pustego pola zachowuje bieżącą wartość.
- **Labels / Assignees** – Pozostawienie pustego pola zachowuje bieżącą wartość. Użycie `[]` czyści wszystkie labels lub assignees. Użycie tablicy JSON takiej jak `["bug"]` zastępuje je.

`Edit Issue` wymaga co najmniej jednego pola do zmiany w czasie wykonania. Jeżeli podany zostanie wyłącznie numer zgłoszenia, wykonanie zakończy się błędem walidacji z warstwy GitHub API.
## Lock Issue

`Lock Issue` przyjmuje opcjonalny **Lock reason**. Jeśli zostanie podany, musi być jedną z wartości obsługiwanych przez GitHub:

- `off-topic`
- `too heated`
- `resolved`
- `spam`

Pozostawienie powodu pustego powoduje zablokowanie bez określonego powodu.

## Pull Requests

Utworzenie PR wymaga:

- Tytułu
- Brancha źródłowego (Head branch)
- Brancha docelowego (Base branch)
- Opcjonalnego opisu
- Opcjonalnego trybu draft

## Pull Request Reviews

Operacje przeglądów odpowiadają API przeglądów pull requestów GitHub:

| Operacja | Wymagane pola | Pola opcjonalne |
|-----------|-----------------|-----------------|
| `Create Review` | Numer pull requesta, zdarzenie | Treść, ID commita |
| `Get Review` | Numer pull requesta, ID przeglądu | — |
| `List Reviews` | Numer pull requesta | Na stronę |
| `Update Review` | Numer pull requesta, ID przeglądu, treść | — |

`Create Review` obsługuje `Approve`, `Request Changes`, `Comment` oraz `Pending`.
Treść jest wymagana dla `Request Changes` i `Comment`. Gdy pole Commit ID jest puste, GitHub
przegląda najnowszy commit pull requesta.

## Releases

| Operacja | Wymagane pola w czasie wykonania | Zazwyczaj opcjonalne |
|-----------|---------------------------|-------------------|
| `Create Release` | Nazwa tagu | Nazwa wydania (tytuł), treść, branch docelowy, draft, prerelease |
| `Update Release` | ID wydania | Nazwa tagu, nazwa wydania, treść, branch docelowy, draft, prerelease |
| `Get Release` / `Delete Release` | ID wydania | — |

`Update Release` może jawnie ustawić `draft` / `prerelease` na `true` lub `false`.

## Workflows

Operacje workflow obsługują:

- Wyświetlanie workflow repozytorium
- Pobieranie workflow po numerycznym ID lub nazwie pliku workflow
- Włączanie lub wyłączanie workflow
- Odczyt rozliczanego użycia workflow według systemu operacyjnego runnera
- Uruchamianie workflow z ref lub branchem oraz opcjonalnym obiektem JSON inputs

GitHub jest w trakcie wycofywania endpointu `Get Workflow Usage`. Workflow korzystające
z tej operacji mogą wymagać migracji, gdy GitHub usunie endpoint.

`Dispatch Workflow` akceptuje obie formy odpowiedzi GitHub: starszą `204 No Content` oraz nowszą
odpowiedź `200` zawierającą `workflow_run_id`, `run_url` i `html_url`.

`Dispatch Workflow and Wait` uruchamia workflow i odpytuje wykonanie, aż jego status będzie
`completed`. Należy skonfigurować limit czasu i interwał odpytywania w sekundach. Heym używa
`workflow_run_id`, gdy GitHub zwraca nowszą odpowiedź `200`. W przypadku tradycyjnej odpowiedzi
`204 No Content` Heym odnajduje nowo utworzone wykonanie `workflow_dispatch` dla wybranego
workflow i ref, a następnie oczekuje na to wykonanie.

## File Contents

`Get File` odczytuje plik repozytorium przez API zawartości GitHub i dekoduje treść tekstową, gdy jest dostępna. Pliki binarne i treści inne niż UTF-8 mogą zwrócić metadane bez zdekodowanego pola `content`.

`List Files` zwraca wpisy katalogu z API zawartości repozytorium dla podanej ścieżki folderu i opcjonalnego ref. Pozostawienie **Directory Path** pustego powoduje wyświetlenie katalogu głównego repozytorium.

`Create or Update File` zapisuje treść tekstową do ścieżki w repozytorium przy użyciu:

- Ścieżki pliku
- Komunikatu commita
- Treści pliku
- Opcjonalnego brancha

`Delete File` usuwa ścieżkę w repozytorium przy użyciu komunikatu commita i opcjonalnego brancha. Jeśli plik istnieje, Heym automatycznie pobiera bieżący SHA przed jego usunięciem.

Jeśli plik już istnieje, Heym automatycznie pobiera bieżący SHA przed jego aktualizacją.

## Pagination

`List Issues`, `Get Repository Issues`, `Get User Issues`, `List Pull Requests`,
`Get Repository Pull Requests`, `List Reviews`, `List Releases`, `List Workflows`,
`List Organization Repositories`, `List User Repositories` oraz `Get User Repositories` obsługują
**Per Page** (1–100). Heym żąda jednej strony wyników; nie ma pola `page` do pobierania
kolejnych stron w ramach tej samej operacji.

## Output

Dokładny kształt zależy od wybranej operacji. Typowe pola obejmują:

- `$github.success`
- `$github.operation`
- `$github.repository`
- `$github.license`
- `$github.profile`
- `$github.paths`
- `$github.referrers`
- `$github.issue`
- `$github.issues`
- `$github.pull_request`
- `$github.pull_requests`
- `$github.review`
- `$github.reviews`
- `$github.release`
- `$github.releases`
- `$github.workflow`
- `$github.workflows`
- `$github.workflow_run`
- `$github.workflow_run_id`
- `$github.completed`
- `$github.conclusion`
- `$github.usage`
- `$github.billable`
- `$github.invitation`
- `$github.file`
- `$github.items`
- `$github.path`
- `$github.sha`
- `$github.commit_sha`
- `$github.deleted`
- `$github.created`
- `$github.ref`
- `$github.inputs`

Zastąp `github` etykietą swojego węzła.

## Notes

- Etykiety i osoby przypisane muszą być prawidłowymi tablicami JSON, gdy są podane.
- Dane wejściowe uruchomienia workflow muszą być prawidłowym obiektem JSON, gdy są podane.
- `Edit Issue` używa `state` tylko wtedy, gdy zostanie on jawnie ustawiony; pozostawienie go nieustawionego zachowuje bieżący stan zgłoszenia.
- Uprawnienia API GitHub zależą od zakresów tokena lub szczegółowych uprawnień repozytorium, które zostaną przyznane.

## Related

- [Credentials Tab](../tabs/credentials-tab.md) – Dodawanie i zarządzanie danymi logowania GitHub
- [Third-Party Integrations](../reference/integrations.md) – Konfiguracja danych logowania GitHub i `base_url` dla Enterprise
- [Agent Node](./agent-node.md) – Używanie danych logowania GitHub z `@modelcontextprotocol/server-github`
- [Node Types](../reference/node-types.md) – Pełny katalog węzłów
