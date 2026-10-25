# Węzeł Jira

Węzeł **Jira** łączy workflow z Jira REST API w zakresie automatyzacji projektów, zgłoszeń, komentarzy, załączników, użytkowników, powiadomień i przejść. Domyślną operacją jest **Search Issues**.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Dane logowania | Jira (Cloud: email/API token, Data Center: nazwa użytkownika/hasło lub token dostępu osobistego, base URL, tryb wdrożenia, opcjonalna wersja REST API) |
| Wyjście | `$nodeLabel.*` |

## Dane logowania

Należy utworzyć dane logowania **Jira** w [zakładce Dane logowania](../tabs/credentials-tab.md). Przechowywane klucze konfiguracji to `email`, `api_token`, `base_url`, `deployment`, `auth_mode` oraz opcjonalny `api_version`. W przypadku Jira Cloud pole `email` przechowuje adres e-mail konta Atlassian, a `api_token` przechowuje token API Atlassian. W przypadku Jira Data Center / Server te same klucze przechowują nazwę użytkownika i hasło do uwierzytelniania Basic, lub z parametrem `auth_mode: pat` pole `api_token` przechowuje token dostępu osobistego wysyłany jako token Bearer, a `email` nie jest używany. Kroki konfiguracji opisano w sekcji [Integracje zewnętrzne](../reference/integrations.md#jira).

| Pole | Klucz konfiguracji | Opis |
| --- | --- | --- |
| Jira Email / Username | `email` | Adres e-mail konta Atlassian w Jira Cloud lub nazwa użytkownika Jira Data Center / Server |
| Uwierzytelnianie | `auth_mode` | `basic` (domyślnie) lub `pat` (tylko Data Center / Server) |
| API Token / Password / Token dostępu osobistego | `api_token` | Token API Atlassian w Jira Cloud, hasło do uwierzytelniania Basic w Jira Data Center / Server lub token dostępu osobistego Data Center w trybie `pat` |
| Base URL | `base_url` | Adres URL witryny Jira, na przykład `https://your-domain.atlassian.net` |
| Deployment | `deployment` | `cloud` dla Jira Cloud lub `data_center` dla Jira Data Center / Server |
| REST API Version | `api_version` | Domyślnie `3` dla Jira Cloud. Data Center / Server korzysta z REST API v2 |

Tokeny dostępu osobistego wymagają Jira Data Center / Server w wersji 8.14 lub nowszej. Zmiana metody uwierzytelniania czyści zapisany wpis tajny, dlatego należy wprowadzić nowe hasło lub token po przełączeniu.

Należy użyć przycisku **Test Connection**, aby zweryfikować dane logowania względem bieżącego użytkownika Jira.

## Operacje

| Operacja | Wymagane pola | Wyjście |
| --- | --- | --- |
| Get Myself | — | `user` |
| List Projects | Opcjonalnie Limit, Start At | `projects`, `count`, `pagination` |
| Search Issues | Opcjonalnie JQL, Issue Fields, Limit, Next Page Token, Start At | `issues`, `count`, `pagination` |
| Get Issue | Issue Key lub ID | `issue`, `key` |
| Create Issue | Project Key, Summary | `issue`, `key` |
| Update Issue | Issue Key lub ID oraz co najmniej jedno zmienione pole | `issue`, `key` |
| Delete Issue | Issue Key lub ID | `deleted` |
| Get Issue Changelog | Issue Key lub ID; opcjonalnie Limit, Start At | `changelog`, `count`, `pagination` |
| Notify Issue | Issue Key lub ID, Subject, Text Body | `notified` |
| List Comments | Issue Key lub ID; opcjonalnie Limit, Start At | `comments`, `count`, `pagination` |
| Create Comment | Issue Key lub ID, Comment Body | `comment` |
| Get Comment | Issue Key lub ID, Comment ID | `comment` |
| Update Comment | Issue Key lub ID, Comment ID, Comment Body | `comment` |
| Delete Comment | Issue Key lub ID, Comment ID | `deleted` |
| Add Attachment | Issue Key lub ID, Filename, zawartość Base64 | `attachments`, `count` |
| Get Attachment | Attachment ID; opcjonalnie Include Binary | `attachment` |
| List Attachments | Issue Key lub ID; opcjonalnie Limit, Start At, Include Binary | `attachments`, `count`, `pagination` |
| Delete Attachment | Attachment ID | `deleted` |
| List Transitions | Issue Key lub ID | `transitions`, `count` |
| Transition Issue | Issue Key lub ID, Transition ID | `transition`, `issue`, `key` |
| Get User | Account ID / Username | `user` |
| Create User | User Email | `user` |
| Delete User | Account ID / Username | `deleted` |

Pola tekstowe obsługujące wyrażenia umożliwiają stosowanie [wyrażeń](../reference/expression-dsl.md), takich jak `$input.text`. `jiraIncludeBinary` to przełącznik typu boolean, który nie obsługuje wyrażeń, ale może zostać oznaczony jako dostarczany przez agenta, gdy węzeł Jira jest podłączony do uchwytu narzędzia agenta.

## Pola zgłoszenia i aktualizacji

- **Project Key** to krótki klucz projektu, taki jak `ENG`. Do odkrywania kluczy służy operacja List Projects.
- **Issue Key or ID** przyjmuje klucze takie jak `ENG-123` lub numeryczne identyfikatory zgłoszeń. Do odkrywania wartości służą operacje Search Issues lub List Projects.
- **Transition ID** pochodzi z operacji List Transitions. Każdy obiekt przejścia zawiera pole `id`.
- **Comment ID** oraz **Attachment ID** pochodzą z operacji List Comments, List Attachments lub wcześniejszych odpowiedzi create/get.
- **Account ID / Username** to wartość `accountId` w Jira Cloud lub nazwa użytkownika w Jira Data Center / Server. Do jej odkrycia mogą posłużyć operacje Get Myself lub Get User.
- Tekst **description** zgłoszenia oraz **body** komentarza są wysyłane w formacie Atlassian Document Format w REST API v3; gdy tryb wdrożenia danych logowania to Data Center / Server, są wysyłane jako zwykły tekst. W wersji v3 znaki nowej linii stają się osobnymi akapitami.
- **Get Issue Changelog** korzysta ze stronicowanego endpointu changelog w Jira Cloud. W przypadku Data Center / Server odczytuje rozszerzone dane changelog zgłoszenia i stosuje skonfigurowany offset/limit do zwróconych historii.
- W operacji **Update Issue** należy pozostawić pola opcjonalne puste, aby zachować ich bieżące wartości.
- Aby wyczyścić pola **Description** lub **Assignee Account ID / Username** podczas aktualizacji, należy ustawić ich wartość na `null`. Etykiet nie można wyczyścić za pomocą `null`.
- Pole **Recipients JSON** w operacji Notify Issue domyślnie przyjmuje wartość `{"assignee":true}`, gdy zostanie pominięte. Typowe klucze to `assignee`, `reporter`, `watchers` oraz `voters` (na przykład `{"assignee":true,"watchers":true}`).
- **Add Attachment** przyjmuje surową zawartość base64 lub data URL, a jej rozmiar jest ograniczony przez ustawienie rozmiaru pliku platformy (domyślnie 99 MB).
## Paginacja

- **Search Issues** wykorzystuje paginację kursorem poprzez `jiraNextPageToken` dla Jira Cloud. Należy odczytać `pagination.nextPageToken` z poprzedniego uruchomienia i przekazać go do kolejnego węzła Search Issues.
- **Search Issues** wykorzystuje paginację offsetową poprzez `jiraStartAt` dla Jira Data Center / Server. Należy odczytać `pagination.startAt`, `pagination.maxResults` oraz `pagination.total`, aby obliczyć następną stronę.
- **List Projects**, **Get Issue Changelog**, **List Comments** oraz **List Attachments** wykorzystują paginację offsetową z parametrami `jiraLimit` i `jiraStartAt`. Stronicowane wyniki zwracają `pagination.startAt`, `pagination.maxResults`, `pagination.total` oraz `pagination.isLast`.
- **List Attachments** najpierw pobiera wszystkie załączniki z zgłoszenia, a następnie dzieli wynik po stronie klienta. Pola paginacji nadal opisują zwróconą stronę, jednak w przypadku dużych zgłoszeń może wystąpić dodatkowy koszt pobierania.
- **List Transitions** nie obsługuje paginacji.

## Kluczowe pola

| Pole | Wykorzystywane przez | Uwagi |
| --- | --- | --- |
| `credentialId` | Wszystkie operacje | UUID posiadanych danych logowania Jira |
| `jiraOperation` | Wszystkie operacje | Domyślnie `searchIssues` |
| `jiraProjectKey` | Create Issue | Klucz projektu, np. `ENG` |
| `jiraIssueKey` | Operacje na zgłoszeniach, komentarzach, załącznikach, powiadomieniach i przejściach | Klucz zgłoszenia, np. `ENG-123`, lub numeryczne ID zgłoszenia |
| `jiraIssueType` | Create Issue | Domyślnie `Task` |
| `jiraIssueTypeId` | Create Issue | Opcjonalne ID typu zgłoszenia; gdy jest ustawione, nadpisuje `jiraIssueType` |
| `jiraSummary` | Create/Update Issue | Wymagane dla Create Issue |
| `jiraDescription` | Create/Update Issue | Wysyłane jako ADF w REST API v3 lub jako zwykły tekst w REST API v2; należy użyć `null` przy aktualizacji, aby wyczyścić opis |
| `jiraJql` | Search Issues | Domyślnie `updated >= -30d ORDER BY updated DESC` |
| `jiraFields` | Search Issues | Opcjonalna tablica JSON lub lista pól zgłoszenia oddzielonych przecinkami; gdy jest pusta, domyślnie przyjmuje `key`, `summary`, `status`, `assignee` oraz `issuetype` |
| `jiraAssigneeAccountId` | Create/Update Issue | accountId w Jira Cloud lub nazwa użytkownika w Data Center / Server; należy użyć `null` przy aktualizacji, aby wyczyścić osobę przypisaną |
| `jiraLabels` | Create/Update Issue | Tablica JSON lub tekst oddzielony przecinkami |
| `jiraCommentBody` | Create/Update Comment | Wysyłane jako ADF w REST API v3 lub jako zwykły tekst w REST API v2 |
| `jiraCommentId` | Get/Update/Delete Comment | ID komentarza Jira |
| `jiraTransitionId` | Transition Issue | Należy ustalić za pomocą List Transitions |
| `jiraAttachmentId` | Get/Delete Attachment | ID załącznika Jira |
| `jiraAttachmentFilename` | Add Attachment | Nazwa przesyłanego pliku |
| `jiraAttachmentBase64` | Add Attachment | Surowa zawartość base64 lub data URL; podlega limitowi rozmiaru pliku |
| `jiraAttachmentMimeType` | Add Attachment | Opcjonalny typ MIME; gdy jest pusty, jest wnioskowany z nazwy pliku |
| `jiraIncludeBinary` | Get/List Attachment | Przełącznik typu boolean; po włączeniu dodaje `content_base64` |
| `jiraNotifySubject` | Notify Issue | Wymagany temat powiadomienia |
| `jiraNotifyTextBody` | Notify Issue | Wymagana treść powiadomienia w formacie zwykłego tekstu |
| `jiraNotifyHtmlBody` | Notify Issue | Opcjonalna treść HTML |
| `jiraNotifyTo` | Notify Issue | JSON z odbiorcami; domyślnie `{"assignee":true}` |
| `jiraAccountId` | Get/Delete User | accountId w Jira Cloud lub nazwa użytkownika w Data Center / Server |
| `jiraUserEmail` | Create User | Adres e-mail nowego użytkownika |
| `jiraUsername` | Create User | Opcjonalna nazwa użytkownika w Data Center / Server; w razie braku używany jest `jiraUserEmail` |
| `jiraUserDisplayName` | Create User | Opcjonalna nazwa wyświetlana |
| `jiraUserProducts` | Create User | Tablica JSON lub klucze produktów oddzielone przecinkami; tylko Jira Cloud |
| `jiraLimit` | Search Issues, List Projects, Get Issue Changelog, List Comments, List Attachments | Domyślnie `50`; zakres 1–100 |
| `jiraStartAt` | Search Issues w Data Center / Server, List Projects, Get Issue Changelog, List Comments, List Attachments | Indeks początkowy paginacji offsetowej |
| `jiraNextPageToken` | Search Issues w Jira Cloud | Token kursora z poprzedniej odpowiedzi wyszukiwania |

## Przykłady

Utworzenie zgłoszenia na podstawie danych wejściowych z poprzedzającego węzła:

- Operation: `createIssue`
- Project Key: `ENG`
- Issue Type: `Task`
- Summary: `$input.title`
- Description: `$input.description`
- Labels: `["automation"]`

Aktualizacja zgłoszenia i wyczyszczenie osoby przypisanej:

- Operation: `updateIssue`
- Issue Key or ID: `ENG-123`
- Summary: `$input.title`
- Assignee Account ID / Username: `null`

Wyszukiwanie zgłoszeń z niestandardowymi polami i paginacją kursorem:

- Operation: `searchIssues`
- JQL: `project = ENG AND updated >= -30d ORDER BY updated DESC`
- Issue Fields: `["key","summary","status"]`
- Limit: `25`
- Next Page Token: `$searchJira.pagination.nextPageToken`

Wyszukiwanie zgłoszeń w Data Center z paginacją offsetową:

- Operation: `searchIssues`
- JQL: `project = ENG ORDER BY updated DESC`
- Limit: `25`
- Start At: `25`

Zmiana stanu zgłoszenia po wyświetleniu dostępnych przejść:

- Operation: `listTransitions`
- Issue Key or ID: `ENG-123`
- Następnie należy uruchomić **Transition Issue** z Transition ID: `$listTransitions.transitions[0].id`

Powiadomienie obserwujących o aktualizacji zgłoszenia:

- Operation: `notifyIssue`
- Issue Key or ID: `ENG-123`
- Subject: `Issue updated`
- Text Body: `$input.text`
- Recipients JSON: `{"assignee":true,"watchers":true}`
## Dane wyjściowe

Każda udana operacja ustawia:

- `$jira.success`
- `$jira.operation`

**Get Myself** udostępnia `user`.

**Operacje listy z paginacją** udostępniają `count`, pole kolekcji oraz `pagination`:

| Operacja | Klucz kolekcji | Struktura paginacji |
| --- | --- | --- |
| List Projects | `projects` | `{ startAt, maxResults, total, isLast }` |
| Search Issues | `issues` | Cloud: `{ maxResults, nextPageToken, isLast }`; Data Center: `{ startAt, maxResults, total, isLast }` |
| Get Issue Changelog | `changelog` | `{ startAt, maxResults, total, isLast }` |
| List Comments | `comments` | `{ startAt, maxResults, total, isLast }` |
| List Attachments | `attachments` | `{ startAt, maxResults, total, isLast }` |

**List Transitions** udostępnia `transitions` oraz `count` bez paginacji.

**Operacje modyfikacji i odczytu zgłoszeń** udostępniają payload zgłoszenia Jira oraz `key`, jeśli ma zastosowanie.

**Comment** – operacje get/create/update udostępniają `comment`; delete udostępnia `deleted`.

**Transition Issue** udostępnia `transition` w postaci `{ transitionId }`, a także odświeżone `issue` oraz `key`.

**Attachment add** udostępnia `attachments` oraz `count`. **Get Attachment** udostępnia `attachment`; **List Attachments** udostępnia `attachments`, `count` oraz `pagination`. Gdy opcja **Include Binary** jest włączona, każdy obiekt załącznika może zawierać `content_base64`. Delete udostępnia `deleted`.

**User** – operacje get/create udostępniają `user`; delete udostępnia `deleted`.

**Notify Issue** udostępnia `notified`.

Typowe wzorce dostępu:

- `$searchJira.issues[0].key`
- `$searchJira.pagination.nextPageToken`
- `$createJiraIssue.key`
- `$listTransitions.transitions[0].id`
- `$getAttachment.attachment.content_base64`

## Powiązane

- [Karta Dane logowania](../tabs/credentials-tab.md)
- [Integracje zewnętrzne](../reference/integrations.md#jira)
- [Typy węzłów](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
