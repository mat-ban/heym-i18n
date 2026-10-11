# Jira mazgas

**Jira** mazgas jungia workflows su Jira REST API, skirtu projektų, užduočių, komentarų, priedų, vartotojų, pranešimų ir perėjimų automatizavimui. Numatytoji operacija yra **Search Issues**.

## Apžvalga

| Ypatybė | Vertė |
|----------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Kredencialas | Jira (Cloud el. paštas/API raktas arba Data Center vartotojo vardas/slaptažodis, pagrindinis URL, diegimo režimas, pasirenkama REST API versija) |
| Išvestis | `$nodeLabel.*` |

## Kredencialas

Sukurkite **Jira** kredencialą [Kredencialų skirtuke](../tabs/credentials-tab.md). Saugojimo konfigūracijos raktai yra `email`, `api_token`, `base_url`, `deployment` ir pasirenkama `api_version`. Jira Cloud atveju `email` saugo Atlassian paskyros el. paštą, o `api_token` saugo Atlassian API raktą. Jira Data Center / Server atveju tie patys raktai saugo Basic auth vartotojo vardą ir slaptažodį. Daugiau informacijos žr. [Trečiųjų šalių integracijos](../reference/integrations.md#jira) nustatymo žingsniuose.

| Laukas | Konfigūracijos raktas | Aprašymas |
| --- | --- | --- |
| Jira el. paštas / Vartotojo vardas | `email` | Jira Cloud Atlassian paskyros el. paštas arba Jira Data Center / Server vartotojo vardas |
| API raktas / Slaptažodis | `api_token` | Jira Cloud Atlassian API raktas arba Jira Data Center / Server slaptažodis Basic auth |
| Pagrindinis URL | `base_url` | Jira svetainės URL, pavyzdžiui, `https://your-domain.atlassian.net` |
| Diegimas | `deployment` | `cloud` Jira Cloud arba `data_center` Jira Data Center / Server |
| REST API versija | `api_version` | Numatytoji vertė yra `3` Jira Cloud. Data Center / Server naudoja REST API v2 |

Data Center / Server asmeniniai prieigos raktai ir Bearer auth šiuo metu nėra palaikomi Jira kredenciale.

Naudokite **Test Connection**, kad patvirtintumėte kredencialą pagal dabartinį Jira vartotoją.

## Operacijos

| Operacija | Reikalingi laukai | Išvestis |
| --- | --- | --- |
| Get Myself | — | `user` |
| List Projects | Pasirinkomas Limit, Start At | `projects`, `count`, `pagination` |
| Search Issues | Pasirinkomas JQL, Issue Fields, Limit, Next Page Token, Start At | `issues`, `count`, `pagination` |
| Get Issue | Issue Key arba ID | `issue`, `key` |
| Create Issue | Project Key, Summary | `issue`, `key` |
| Update Issue | Issue Key arba ID ir bent vienas pakeistas laukas | `issue`, `key` |
| Delete Issue | Issue Key arba ID | `deleted` |
| Get Issue Changelog | Issue Key arba ID; pasirenkamas Limit, Start At | `changelog`, `count`, `pagination` |
| Notify Issue | Issue Key arba ID, Subject, Text Body | `notified` |
| List Comments | Issue Key arba ID; pasirenkamas Limit, Start At | `comments`, `count`, `pagination` |
| Create Comment | Issue Key arba ID, Comment Body | `comment` |
| Get Comment | Issue Key arba ID, Comment ID | `comment` |
| Update Comment | Issue Key arba ID, Comment ID, Comment Body | `comment` |
| Delete Comment | Issue Key arba ID, Comment ID | `deleted` |
| Add Attachment | Issue Key arba ID, Filename, Base64 content | `attachments`, `count` |
| Get Attachment | Attachment ID; pasirenkamas Include Binary | `attachment` |
| List Attachments | Issue Key arba ID; pasirenkamas Limit, Start At, Include Binary | `attachments`, `count`, `pagination` |
| Delete Attachment | Attachment ID | `deleted` |
| List Transitions | Issue Key arba ID | `transitions`, `count` |
| Transition Issue | Issue Key arba ID, Transition ID | `transition`, `issue`, `key` |
| Get User | Account ID / Vartotojo vardas | `user` |
| Create User | Vartotojo el. paštas | `user` |
| Delete User | Account ID / Vartotojo vardas | `deleted` |

Išraiškas palaikantys teksto laukai palaiko [išraiškas](../reference/expression-dsl.md), tokias kaip `$input.text`. `jiraIncludeBinary` yra boolean jungiklis ir nepalaiko išraiškų, tačiau jis gali būti pažymėtas kaip agento pateiktas, kai Jira mazgas yra prijungtas prie Agent įrankio.

## Užduočių ir atnaujinimo laukai

- **Project Key** yra trumpas projekto raktas, pavyzdžiui, `ENG`. Naudokite List Projects, kad atrastumėte raktus.
- **Issue Key arba ID** priima raktus, tokius kaip `ENG-123` arba skaitinius užduočių ID. Naudokite Search Issues arba List Projects, kad atrastumėte vertes.
- **Transition ID** gaunamas iš List Transitions. Kiekvienas perėjimo objektas apima `id` lauką.
- **Comment ID** ir **Attachment ID** gaunami iš List Comments, List Attachments arba ankstesnių create/get atsakymų.
- **Account ID / Vartotojo vardas** yra Jira Cloud `accountId` vertė arba Jira Data Center / Server vartotojo vardas. Get Myself arba Get User gali padėti tai atrasti.
- Užduoties **aprašymas** ir komentaro **tekstas** siunčiami kaip Atlassian dokumentų formatas REST API v3; kai kredencialo diegimas yra Data Center / Server, jie siunčiami kaip paprastas tekstas. V3 versijoje naujų eilučių simboliai tampa atskiromis pastraipomis.
- **Get Issue Changelog** naudoja Jira Cloud puslapiuotą changelog endpoint'ą. Data Center / Server atveju jis skaito išplėstus užduočių changelog duomenis ir taiko nustatytą offset/limit grąžintoms istorijoms.
- **Update Issue** operacijoje palikite pasirenkamus laukus tuščius, kad išsaugotumėte jų dabartines vertes.
- Nustatykite **Description** arba **Assignee Account ID / Vartotojo vardas** į `null` atnaujinimo metu, kad išvalytumėte tuos laukus. Žymės negali būti išvalytos su `null`.
- **Recipients JSON** Notify Issue numatytoji vertė yra `{"assignee":true}`, kai ji praleidžiama. Dažniausiai naudojami raktai yra `assignee`, `reporter`, `watchers` ir `voters` (pavyzdžiui, `{"assignee":true,"watchers":true}`).
- **Add Attachment** priima žalius base64 arba duomenų URL turinius ir yra ribojamas platformos failo dydžio nustatymu (numatytoji vertė 99 MB).
## Puslapiavimas

- **Search Issues** naudoja kursorių puslapiavimą per `jiraNextPageToken` Jira Cloud. Perskaitykite `pagination.nextPageToken` iš ankstesnio vykdymo ir perduokite jį į kitą Search Issues mazgą.
- **Search Issues** naudoja offset puslapiavimą per `jiraStartAt` Jira Data Center / Server. Perskaitykite `pagination.startAt`, `pagination.maxResults` ir `pagination.total`, kad apskaičiuotumėte kitą puslapį.
- **List Projects**, **Get Issue Changelog**, **List Comments** ir **List Attachments** naudoja offset puslapiavimą su `jiraLimit` ir `jiraStartAt`. Puslapiuoti rezultatai grąžina `pagination.startAt`, `pagination.maxResults`, `pagination.total` ir `pagination.isLast`.
- **List Attachments** pirmiausia gauna visus priedus iš užduoties, tada supjausto rezultatą kliento pusėje. Puslapiavimo laukai vis tiek apibūdina grąžintą puslapį, tačiau didelės užduotys gali sukelti papildomų išlaidų.
- **List Transitions** nepuslapiuoja.

## Pagrindiniai laukai

| Laukas | Naudojamas | Pastabos |
| --- | --- | --- |
| `credentialId` | Visoms operacijoms | Nuosavybės Jira kredencialo UUID |
| `jiraOperation` | Visoms operacijoms | Numatytoji reikšmė `searchIssues` |
| `jiraProjectKey` | Create Issue | Projekto raktas, pvz., `ENG` |
| `jiraIssueKey` | Užduoties, komentaro, priedo, pranešimo ir perėjimo operacijos | Užduoties raktas, pvz., `ENG-123` arba skaitinis užduoties ID |
| `jiraIssueType` | Create Issue | Numatytoji reikšmė `Task` |
| `jiraIssueTypeId` | Create Issue | Pasirinktinė užduoties tipo ID; pakeičia `jiraIssueType`, kai nustatyta |
| `jiraSummary` | Create/Update Issue | Privaloma Create Issue |
| `jiraDescription` | Create/Update Issue | Siunčiama kaip ADF REST API v3 arba paprastas tekstas REST API v2; naudokite `null` atnaujinimui, kad išvalytumėte aprašymą |
| `jiraJql` | Search Issues | Numatytoji reikšmė `updated >= -30d ORDER BY updated DESC` |
| `jiraFields` | Search Issues | Pasirinktinė JSON masyvas arba kableliais atskirti užduoties laukai; numatytoji reikšmė `key`, `summary`, `status`, `assignee` ir `issuetype`, kai tuščia |
| `jiraAssigneeAccountId` | Create/Update Issue | Jira Cloud accountId arba Data Center / Server vartotojo vardas; naudokite `null` atnaujinimui, kad išvalytumėte atsakingą asmenį |
| `jiraLabels` | Create/Update Issue | JSON masyvas arba kableliais atskirti tekstai |
| `jiraCommentBody` | Create/Update Comment | Siunčiama kaip ADF REST API v3 arba paprastas tekstas REST API v2 |
| `jiraCommentId` | Get/Update/Delete Comment | Jira komentaro ID |
| `jiraTransitionId` | Transition Issue | Sužinokite su List Transitions |
| `jiraAttachmentId` | Get/Delete Attachment | Jira priedo ID |
| `jiraAttachmentFilename` | Add Attachment | Įkeltos failo pavadinimas |
| `jiraAttachmentBase64` | Add Attachment | Žali base64 arba duomenų URL turinys; taikomas failo dydžio apribojimas |
| `jiraAttachmentMimeType` | Add Attachment | Pasirinktinė MIME tipo; nustatoma pagal failo pavadinimą, kai tuščia |
| `jiraIncludeBinary` | Get/List Attachment | Boolean jungiklis; prideda `content_base64`, kai įjungta |
| `jiraNotifySubject` | Notify Issue | Privalomas pranešimo subjektas |
| `jiraNotifyTextBody` | Notify Issue | Privalomas paprasto teksto pranešimo turinys |
| `jiraNotifyHtmlBody` | Notify Issue | Pasirinktinė HTML kūnas |
| `jiraNotifyTo` | Notify Issue | Gavėjų JSON; numatytoji reikšmė `{"assignee":true}` |
| `jiraAccountId` | Get/Delete User | Jira Cloud accountId arba Data Center / Server vartotojo vardas |
| `jiraUserEmail` | Create User | Naujo vartotojo el. pašto adresas |
| `jiraUsername` | Create User | Pasirinktinė Data Center / Server vartotojo vardas; grįžta prie `jiraUserEmail` |
| `jiraUserDisplayName` | Create User | Pasirinktinė rodymo vardas |
| `jiraUserProducts` | Create User | JSON masyvas arba kableliais atskirti produkto raktai; tik Jira Cloud |
| `jiraLimit` | Search Issues, List Projects, Get Issue Changelog, List Comments, List Attachments | Numatytoji reikšmė `50`; intervalas 1–100 |
| `jiraStartAt` | Search Issues on Data Center / Server, List Projects, Get Issue Changelog, List Comments, List Attachments | Offset puslapiavimo pradžios indeksas |
| `jiraNextPageToken` | Search Issues on Jira Cloud | Kursoriaus žymeklis iš ankstesnio paieškos atsakymo |

## Pavyzdžiai

Sukurkite užduotį iš aukščiau pateikto įvesties:

- Operacija: `createIssue`
- Projekto raktas: `ENG`
- Užduoties tipas: `Task`
- Santrauka: `$input.title`
- Aprašymas: `$input.description`
- Žymos: `["automation"]`

Atnaujinkite užduotį ir išvalykite atsakingą asmenį:

- Operacija: `updateIssue`
- Užduoties raktas arba ID: `ENG-123`
- Santrauka: `$input.title`
- Atsakingo asmens account ID / vartotojo vardas: `null`

Ieškokite užduočių su pasirinktiniais laukais ir kursorių puslapiavimu:

- Operacija: `searchIssues`
- JQL: `project = ENG AND updated >= -30d ORDER BY updated DESC`
- Užduoties laukai: `["key","summary","status"]`
- Limitas: `25`
- Kito puslapio žymeklis: `$searchJira.pagination.nextPageToken`

Ieškokite užduočių Data Center su offset puslapiavimu:

- Operacija: `searchIssues`
- JQL: `project = ENG ORDER BY updated DESC`
- Limitas: `25`
- Pradėti nuo: `25`

Perkelkite užduotį po to, kai išvardijote galimus perėjimus:

- Operacija: `listTransitions`
- Užduoties raktas arba ID: `ENG-123`
- Tada vykdykite **Transition Issue** su perėjimo ID: `$listTransitions.transitions[0].id`

Praneškite stebėtojams apie užduoties atnaujinimą:

- Operacija: `notifyIssue`
- Užduoties raktas arba ID: `ENG-123`
- Subjektas: `Užduotis atnaujinta`
- Teksto turinys: `$input.text`
- Gavėjų JSON: `{"assignee":true,"watchers":true}`
## Išvestis

Kiekviena sėkminga operacija nustato:

- `$jira.success`
- `$jira.operation`

**Gauti save** atskleidžia `user`.

**Puslapių sąrašų operacijos** atskleidžia `count`, kolekcijos lauką ir `pagination`:

| Operacija | Kolekcijos raktas | Puslapiavimo forma |
| --- | --- | --- |
| Projektų sąrašas | `projects` | `{ startAt, maxResults, total, isLast }` |
| Problemos paieška | `issues` | Cloud: `{ maxResults, nextPageToken, isLast }`; Data Center: `{ startAt, maxResults, total, isLast }` |
| Gauti problemos pakeitimų istoriją | `changelog` | `{ startAt, maxResults, total, isLast }` |
| Komentarų sąrašas | `comments` | `{ startAt, maxResults, total, isLast }` |
| Prisegimų sąrašas | `attachments` | `{ startAt, maxResults, total, isLast }` |

**Perėjimų sąrašas** atskleidžia `transitions` ir `count` be puslapiavimo.

**Problemos mutacijos ir skaitymai** atskleidžia Jira problemos payload plius `key`, jei taikoma.

**Komentaras** gauti/sukurti/atnaujinti atskleidžia `comment`; ištrinti atskleidžia `deleted`.

**Perkelti problemą** atskleidžia `transition` kaip `{ transitionId }`, plius atnaujintą `issue` ir `key`.

**Prisegimo pridėjimas** atskleidžia `attachments` ir `count`. **Gauti prisegimą** atskleidžia `attachment`; **Prisegimų sąrašas** atskleidžia `attachments`, `count` ir `pagination`. Kai **Įtraukti binarinį** nustatymą įjungtas, kiekvienas prisegimo objektas gali apimti `content_base64`. Ištrinti atskleidžia `deleted`.

**Vartotojas** gauti/sukurti atskleidžia `user`; ištrinti atskleidžia `deleted`.

Bendri prieigos modeliai:

- `$searchJira.issues[0].key`
- `$searchJira.pagination.nextPageToken`
- `$createJiraIssue.key`
- `$listTransitions.transitions[0].id`
- `$getAttachment.attachment.content_base64`

## Susiję

- [Kredencialų skirtukas](../tabs/credentials-tab.md)
- [Trečiųjų šalių integracijos](../reference/integrations.md#jira)
- [Mazgų tipai](../reference/node-types.md)
- [Išraiškų DSL](../reference/expression-dsl.md)
