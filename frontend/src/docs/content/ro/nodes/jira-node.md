# Nodul Jira

Nodul **Jira** conectează workflow-urile la API-ul REST Jira pentru automatizarea proiectelor, tichetelor, comentariilor, atașamentelor, utilizatorilor, notificărilor și tranzițiilor. Operația implicită este **Căutare tichete**.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Acreditare | Jira (Cloud email/API token sau Data Center utilizator/parolă, URL de bază, mod de implementare, versiune API REST opțională) |
| Ieșire | `$nodeLabel.*` |

## Acreditare

Creați o acreditare **Jira** în [Fila Acreditări](../tabs/credentials-tab.md). Cheile de configurare stocate sunt `email`, `api_token`, `base_url`, `deployment` și `api_version` opțional. Pentru Jira Cloud, `email` stochează adresa de email a contului Atlassian, iar `api_token` stochează token-ul API Atlassian. Pentru Jira Data Center / Server, aceleași chei stochează numele de utilizator și parola pentru autentificarea Basic. Consultați [Integrări terțe](../reference/integrations.md#jira) pentru pașii de configurare.

| Câmp | Cheie de configurare | Descriere |
| --- | --- | --- |
| Jira Email / Utilizator | `email` | Adresa de email a contului Atlassian pentru Jira Cloud, sau numele de utilizator pentru Jira Data Center / Server |
| API Token / Parolă | `api_token` | Token-ul API Atlassian pentru Jira Cloud, sau parola pentru autentificarea Basic în Jira Data Center / Server |
| URL de bază | `base_url` | URL-ul site-ului Jira, de exemplu `https://your-domain.atlassian.net` |
| Implementare | `deployment` | `cloud` pentru Jira Cloud sau `data_center` pentru Jira Data Center / Server |
| Versiune API REST | `api_version` | Valoarea implicită este `3` pentru Jira Cloud. Data Center / Server utilizează API REST v2 |

Token-urile de acces personal și autentificarea Bearer pentru Data Center / Server nu sunt încă acceptate de acreditarea Jira.

Utilizați **Testare conexiune** pentru a verifica acreditarea față de utilizatorul Jira curent.

## Operații

| Operație | Câmpuri obligatorii | Ieșire |
| --- | --- | --- |
| Obținere profil propriu | — | `user` |
| Listare proiecte | Limită, Început de la (opționale) | `projects`, `count`, `pagination` |
| Căutare tichete | JQL, Câmpuri tichet, Limită, Token pagină următoare, Început de la (opționale) | `issues`, `count`, `pagination` |
| Obținere tichet | Cheie sau ID tichet | `issue`, `key` |
| Creare tichet | Cheie proiect, Rezumat | `issue`, `key` |
| Actualizare tichet | Cheie sau ID tichet și cel puțin un câmp modificat | `issue`, `key` |
| Ștergere tichet | Cheie sau ID tichet | `deleted` |
| Obținere istoric modificări tichet | Cheie sau ID tichet; Limită, Început de la (opționale) | `changelog`, `count`, `pagination` |
| Notificare tichet | Cheie sau ID tichet, Subiect, Corp text | `notified` |
| Listare comentarii | Cheie sau ID tichet; Limită, Început de la (opționale) | `comments`, `count`, `pagination` |
| Creare comentariu | Cheie sau ID tichet, Corp comentariu | `comment` |
| Obținere comentariu | Cheie sau ID tichet, ID comentariu | `comment` |
| Actualizare comentariu | Cheie sau ID tichet, ID comentariu, Corp comentariu | `comment` |
| Ștergere comentariu | Cheie sau ID tichet, ID comentariu | `deleted` |
| Adăugare atașament | Cheie sau ID tichet, Nume fișier, Conținut Base64 | `attachments`, `count` |
| Obținere atașament | ID atașament; Includere binar (opțional) | `attachment` |
| Listare atașamente | Cheie sau ID tichet; Limită, Început de la, Includere binar (opționale) | `attachments`, `count`, `pagination` |
| Ștergere atașament | ID atașament | `deleted` |
| Listare tranziții | Cheie sau ID tichet | `transitions`, `count` |
| Tranziție tichet | Cheie sau ID tichet, ID tranziție | `transition`, `issue`, `key` |
| Obținere utilizator | ID cont / Nume utilizator | `user` |
| Creare utilizator | Email utilizator | `user` |
| Ștergere utilizator | ID cont / Nume utilizator | `deleted` |

Câmpurile text care acceptă expresii suportă [expresii](../reference/expression-dsl.md) precum `$input.text`. `jiraIncludeBinary` este un comutator boolean și nu acceptă expresii, dar poate fi marcat ca furnizat de agent atunci când nodul Jira este atașat la un handle de instrument Agent.

## Câmpuri pentru tichete și actualizări

- **Cheie proiect** este cheia scurtă a proiectului, precum `ENG`. Utilizați Listare proiecte pentru a descoperi cheile.
- **Cheie sau ID tichet** acceptă chei precum `ENG-123` sau ID-uri numerice de tichet. Utilizați Căutare tichete sau Listare proiecte pentru a descoperi valorile.
- **ID tranziție** provine din Listare tranziții. Fiecare obiect de tranziție include un câmp `id`.
- **ID comentariu** și **ID atașament** provin din Listare comentarii, Listare atașamente sau din răspunsurile anterioare de creare/obținere.
- **ID cont / Nume utilizator** este valoarea `accountId` pentru Jira Cloud sau numele de utilizator pentru Jira Data Center / Server. Obținere profil propriu sau Obținere utilizator vă pot ajuta să îl descoperiți.
- **Descrierea** tichetului și textul **corpului** comentariului sunt trimise în format Atlassian Document Format pe API REST v3; când implementarea acreditării este Data Center / Server, acestea sunt trimise ca text simplu. În v3, caracterele de linie nouă devin paragrafe separate.
- **Obținere istoric modificări tichet** utilizează endpoint-ul paginat de istoric modificări din Jira Cloud. Pentru Data Center / Server, citește datele extinse de istoric modificări ale tichetului și aplică decalajul/limita configurate asupra istoricelor returnate.
- La **Actualizare tichet**, lăsați câmpurile opționale goale pentru a le păstra valorile curente.
- Setați **Descriere** sau **ID cont / Nume utilizator responsabil** la `null` la actualizare pentru a goli acele câmpuri. Etichetele nu pot fi golite cu `null`.
- **JSON destinatari** la Notificare tichet are valoarea implicită `{"assignee":true}` când este omis. Cheile comune includ `assignee`, `reporter`, `watchers` și `voters` (de exemplu `{"assignee":true,"watchers":true}`).
- **Adăugare atașament** acceptă conținut base64 brut sau data URL și este limitat de setarea de dimensiune a fișierului din platformă (implicit 99 MB).
## Paginare

- **Search Issues** utilizează paginarea prin cursor prin `jiraNextPageToken` pentru Jira Cloud. Citiți `pagination.nextPageToken` din execuția anterioară și transmiteți-l în următorul nod Search Issues.
- **Search Issues** utilizează paginarea prin offset prin `jiraStartAt` pentru Jira Data Center / Server. Citiți `pagination.startAt`, `pagination.maxResults` și `pagination.total` pentru a calcula pagina următoare.
- **List Projects**, **Get Issue Changelog**, **List Comments** și **List Attachments** utilizează paginarea prin offset cu `jiraLimit` și `jiraStartAt`. Rezultatele paginate returnează `pagination.startAt`, `pagination.maxResults`, `pagination.total` și `pagination.isLast`.
- **List Attachments** preia mai întâi toate atașamentele din issue, apoi decupează rezultatul pe partea de client. Câmpurile de paginare descriu în continuare pagina returnată, dar issue-urile mari pot genera un cost suplimentar de preluare.
- **List Transitions** nu utilizează paginarea.

## Câmpuri cheie

| Câmp | Utilizat de | Note |
| --- | --- | --- |
| `credentialId` | Toate operațiunile | UUID-ul acreditării Jira deținute |
| `jiraOperation` | Toate operațiunile | Valoarea implicită este `searchIssues` |
| `jiraProjectKey` | Create Issue | Cheia proiectului, precum `ENG` |
| `jiraIssueKey` | Operațiunile pentru issue, comentarii, atașamente, notificări și tranziții | Cheia issue-ului, precum `ENG-123`, sau ID-ul numeric al issue-ului |
| `jiraIssueType` | Create Issue | Valoarea implicită este `Task` |
| `jiraIssueTypeId` | Create Issue | ID opțional al tipului de issue; suprascrie `jiraIssueType` atunci când este setat |
| `jiraSummary` | Create/Update Issue | Obligatoriu pentru Create Issue |
| `jiraDescription` | Create/Update Issue | Trimis ca ADF pe REST API v3 sau ca text simplu pe REST API v2; utilizați `null` la actualizare pentru a goli descrierea |
| `jiraJql` | Search Issues | Valoarea implicită este `updated >= -30d ORDER BY updated DESC` |
| `jiraFields` | Search Issues | Array JSON opțional sau câmpuri de issue separate prin virgulă; valoarea implicită este `key`, `summary`, `status`, `assignee` și `issuetype` atunci când este gol |
| `jiraAssigneeAccountId` | Create/Update Issue | accountId Jira Cloud sau numele de utilizator Data Center / Server; utilizați `null` la actualizare pentru a goli responsabilul |
| `jiraLabels` | Create/Update Issue | Array JSON sau text separat prin virgulă |
| `jiraCommentBody` | Create/Update Comment | Trimis ca ADF pe REST API v3 sau ca text simplu pe REST API v2 |
| `jiraCommentId` | Get/Update/Delete Comment | ID-ul comentariului Jira |
| `jiraTransitionId` | Transition Issue | Descoperiți cu List Transitions |
| `jiraAttachmentId` | Get/Delete Attachment | ID-ul atașamentului Jira |
| `jiraAttachmentFilename` | Add Attachment | Numele fișierului încărcat |
| `jiraAttachmentBase64` | Add Attachment | Conținut base64 brut sau data URL; supus limitei de dimensiune a fișierului |
| `jiraAttachmentMimeType` | Add Attachment | Tip MIME opțional; dedus din numele fișierului atunci când este gol |
| `jiraIncludeBinary` | Get/List Attachment | Comutator boolean; adaugă `content_base64` atunci când este activat |
| `jiraNotifySubject` | Notify Issue | Subiectul notificării, obligatoriu |
| `jiraNotifyTextBody` | Notify Issue | Corpul notificării în text simplu, obligatoriu |
| `jiraNotifyHtmlBody` | Notify Issue | Corp HTML opțional |
| `jiraNotifyTo` | Notify Issue | JSON cu destinatarii; valoarea implicită este `{"assignee":true}` |
| `jiraAccountId` | Get/Delete User | accountId Jira Cloud sau numele de utilizator Data Center / Server |
| `jiraUserEmail` | Create User | Adresa de email a utilizatorului nou |
| `jiraUsername` | Create User | Nume de utilizator opțional pentru Data Center / Server; se folosește `jiraUserEmail` în lipsa acestuia |
| `jiraUserDisplayName` | Create User | Nume afișat opțional |
| `jiraUserProducts` | Create User | Array JSON sau chei de produs separate prin virgulă; doar Jira Cloud |
| `jiraLimit` | Search Issues, List Projects, Get Issue Changelog, List Comments, List Attachments | Valoarea implicită este `50`; interval 1–100 |
| `jiraStartAt` | Search Issues pe Data Center / Server, List Projects, Get Issue Changelog, List Comments, List Attachments | Indexul de început pentru paginarea prin offset |
| `jiraNextPageToken` | Search Issues pe Jira Cloud | Token de cursor dintr-un răspuns de căutare anterior |

## Exemple

Creați un issue din datele de intrare upstream:

- Operation: `createIssue`
- Project Key: `ENG`
- Issue Type: `Task`
- Summary: `$input.title`
- Description: `$input.description`
- Labels: `["automation"]`

Actualizați un issue și goliți responsabilul:

- Operation: `updateIssue`
- Issue Key or ID: `ENG-123`
- Summary: `$input.title`
- Assignee Account ID / Username: `null`

Căutați issue-uri cu câmpuri personalizate și paginare prin cursor:

- Operation: `searchIssues`
- JQL: `project = ENG AND updated >= -30d ORDER BY updated DESC`
- Issue Fields: `["key","summary","status"]`
- Limit: `25`
- Next Page Token: `$searchJira.pagination.nextPageToken`

Căutați issue-uri pe Data Center cu paginare prin offset:

- Operation: `searchIssues`
- JQL: `project = ENG ORDER BY updated DESC`
- Limit: `25`
- Start At: `25`

Tranziționați un issue după listarea tranzițiilor disponibile:

- Operation: `listTransitions`
- Issue Key or ID: `ENG-123`
- Apoi rulați **Transition Issue** cu Transition ID: `$listTransitions.transitions[0].id`

Notificați urmăritorii despre o actualizare a issue-ului:

- Operation: `notifyIssue`
- Issue Key or ID: `ENG-123`
- Subject: `Issue updated`
- Text Body: `$input.text`
- Recipients JSON: `{"assignee":true,"watchers":true}`
## Ieșire

Fiecare operațiune reușită setează:

- `$jira.success`
- `$jira.operation`

**Get Myself** expune `user`.

**Operațiunile de listare paginată** expun `count`, un câmp de colecție și `pagination`:

| Operațiune | Cheie colecție | Formă paginare |
| --- | --- | --- |
| List Projects | `projects` | `{ startAt, maxResults, total, isLast }` |
| Search Issues | `issues` | Cloud: `{ maxResults, nextPageToken, isLast }`; Data Center: `{ startAt, maxResults, total, isLast }` |
| Get Issue Changelog | `changelog` | `{ startAt, maxResults, total, isLast }` |
| List Comments | `comments` | `{ startAt, maxResults, total, isLast }` |
| List Attachments | `attachments` | `{ startAt, maxResults, total, isLast }` |

**List Transitions** expune `transitions` și `count` fără paginare.

**Mutațiile și citirile de issue** expun payload-ul de issue Jira plus `key` acolo unde este aplicabil.

**Comment** get/create/update expun `comment`; delete expune `deleted`.

**Transition Issue** expune `transition` ca `{ transitionId }`, plus `issue` reîmprospătat și `key`.

**Attachment add** expune `attachments` și `count`. **Get Attachment** expune `attachment`; **List Attachments** expune `attachments`, `count` și `pagination`. Când **Include Binary** este activat, fiecare obiect de attachment poate include `content_base64`. Delete expune `deleted`.

**User** get/create expun `user`; delete expune `deleted`.

**Notify Issue** expune `notified`.

Modele comune de acces:

- `$searchJira.issues[0].key`
- `$searchJira.pagination.nextPageToken`
- `$createJiraIssue.key`
- `$listTransitions.transitions[0].id`
- `$getAttachment.attachment.content_base64`

## Resurse conexe

- [Credentials Tab](../tabs/credentials-tab.md)
- [Third-Party Integrations](../reference/integrations.md#jira)
- [Node Types](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
