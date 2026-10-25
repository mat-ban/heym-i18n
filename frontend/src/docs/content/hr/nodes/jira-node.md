# Jira čvor

**Jira** čvor povezuje workflows s Jira REST API-jem za automatizaciju projekata, problema, komentara, privitaka, korisnika, obavijesti i prijelaza. Zadana operacija je **Pretraži probleme**.

## Pregled

| Svojstvo | Vrijednost |
|----------|------------|
| Ulazi | 1 |
| Izlazi | 1 |
| Vjerodajnice | Jira (Cloud email/API token, Data Center korisničko ime/lozinka ili osobni pristupni token, osnovna URL adresa, način implementacije, opcionalna verzija REST API-ja) |
| Izlaz | `$nodeLabel.*` |

## Vjerodajnice

Kreirajte **Jira** vjerodajnicu u [Kartici Vjerodajnice](../tabs/credentials-tab.md). Pohranjene konfiguracijske ključeve čine `email`, `api_token`, `base_url`, `deployment`, `auth_mode` i opcionalni `api_version`. Za Jira Cloud, `email` pohranjuje email adresu Atlassian računa, a `api_token` pohranjuje Atlassian API token. Za Jira Data Center / Server, ti isti ključevi pohranjuju korisničko ime i lozinku za osnovnu autentifikaciju, ili uz `auth_mode: pat`, `api_token` pohranjuje osobni pristupni token poslan kao Bearer token, a `email` se ne koristi. Pogledajte [Integracije trećih strana](../reference/integrations.md#jira) za korake postavljanja.

| Polje | Konfiguracijski ključ | Opis |
| --- | --- | --- |
| Jira Email / Korisničko ime | `email` | Email adresa Atlassian računa za Jira Cloud ili korisničko ime za Jira Data Center / Server |
| Autentifikacija | `auth_mode` | `basic` (zadano) ili `pat` (samo Data Center / Server) |
| API Token / Lozinka / Osobni pristupni token | `api_token` | Atlassian API token za Jira Cloud, lozinka za Jira Data Center / Server za osnovnu autentifikaciju ili osobni pristupni token za Data Center u načinu `pat` |
| Osnovna URL adresa | `base_url` | URL adresa Jira stranice, na primjer `https://your-domain.atlassian.net` |
| Način implementacije | `deployment` | `cloud` za Jira Cloud ili `data_center` za Jira Data Center / Server |
| Verzija REST API-ja | `api_version` | Zadano je `3` za Jira Cloud. Data Center / Server koristi REST API v2 |

Osobni pristupni tokeni zahtijevaju Jira Data Center / Server 8.14 ili noviji. Prebacivanje načina autentifikacije briše pohranjenu tajnu, stoga unesite novu lozinku ili token prilikom prebacivanja.

Koristite **Testiraj vezu** za provjeru vjerodajnice prema trenutnom Jira korisniku.

## Operacije

| Operacija | Obavezna polja | Izlaz |
| --- | --- | --- |
| Dobi sebe | — | `user` |
| Popis projekata | Opcionalno Ograničenje, Početak | `projects`, `count`, `pagination` |
| Pretraži probleme | Opcionalno JQL, Polja problema, Ograničenje, Token sljedeće stranice, Početak | `issues`, `count`, `pagination` |
| Dobi problem | Ključ ili ID problema | `issue`, `key` |
| Kreiraj problem | Ključ projekta, Sažetak | `issue`, `key` |
| Ažuriraj problem | Ključ ili ID problema i barem jedno promijenjeno polje | `issue`, `key` |
| Izbriši problem | Ključ ili ID problema | `deleted` |
| Dobi promjene problema | Ključ ili ID problema; opcionalno Ograničenje, Početak | `changelog`, `count`, `pagination` |
| Obavijesti o problemu | Ključ ili ID problema, Predmet, Tekst tijela | `notified` |
| Popis komentara | Ključ ili ID problema; opcionalno Ograničenje, Početak | `comments`, `count`, `pagination` |
| Kreiraj komentar | Ključ ili ID problema, Tijelo komentara | `comment` |
| Dobi komentar | Ključ ili ID problema, ID komentara | `comment` |
| Ažuriraj komentar | Ključ ili ID problema, ID komentara, Tijelo komentara | `comment` |
| Izbriši komentar | Ključ ili ID problema, ID komentara | `deleted` |
| Dodaj privitak | Ključ ili ID problema, Naziv datoteke, Base64 sadržaj | `attachments`, `count` |
| Dobi privitak | ID privitka; opcionalno Uključi binarni | `attachment` |
| Popis privitaka | Ključ ili ID problema; opcionalno Ograničenje, Početak, Uključi binarni | `attachments`, `count`, `pagination` |
| Izbriši privitak | ID privitka | `deleted` |
| Popis prijelaza | Ključ ili ID problema | `transitions`, `count` |
| Prijelaz problema | Ključ ili ID problema, ID prijelaza | `transition`, `issue`, `key` |
| Dobi korisnika | ID računa / Korisničko ime | `user` |
| Kreiraj korisnika | Email korisnika | `user` |
| Izbriši korisnika | ID računa / Korisničko ime | `deleted` |

Polja teksta koja podržavaju izraze podržavaju [izraze](../reference/expression-dsl.md) poput `$input.text`. `jiraIncludeBinary` je boolean prekidač i ne podržava izraze, ali se može označiti kao agentom pružena kada je Jira čvor povezan s Agent alatom.

## Polja problema i ažuriranja

- **Ključ projekta** je kratki ključ projekta poput `ENG`. Koristite Popis projekata za otkrivanje ključeva.
- **Ključ ili ID problema** prihvaća ključeve poput `ENG-123` ili numeričke ID-eve problema. Koristite Pretraži probleme ili Popis projekata za otkrivanje vrijednosti.
- **ID prijelaza** dolazi iz Popisa prijelaza. Svaki objekt prijelaza uključuje polje `id`.
- **ID komentara** i **ID privitka** dolaze iz Popisa komentara, Popisa privitaka ili prethodnih odgovora na kreiranje/dobivanje.
- **ID računa / Korisničko ime** je `accountId` vrijednost za Jira Cloud ili korisničko ime za Jira Data Center / Server. Dobi sebe ili Dobi korisnika mogu vam pomoći da ga otkrijete.
- Opis problema i tijelo komentara šalju se kao Atlassian Document Format na REST API v3; kada je način implementacije vjerodajnice Data Center / Server, šalju se kao običan tekst. U v3, znakovi za novi red postaju odvojeni odlomci.
- **Dobi promjene problema** koristi paginirani endpoint promjena problema za Jira Cloud. Za Data Center / Server, čita proširene podatke o promjenama problema i primjenjuje konfigurirani pomak/ograničenje na vraćene povijesti.
- Na **Ažuriraj problem**, ostavite opcionalna polja prazna kako biste sačuvali njihove trenutne vrijednosti.
- Postavite **Opis** ili **ID računa / Korisničko ime dodijeljenog** na `null` prilikom ažuriranja kako biste očistili ta polja. Oznake se ne mogu očistiti s `null`.
- **JSON primatelja** na Obavijesti o problemu zadano je `{"assignee":true}` kada se izostavi. Uobičajeni ključevi uključuju `assignee`, `reporter`, `watchers` i `voters` (na primjer `{"assignee":true,"watchers":true}`).
- **Dodaj privitak** prihvaća sirovi base64 ili sadržaj URL-a podataka i ograničen je postavkom veličine datoteke platforme (zadano 99 MB).
## Paginacija

- **Pretraživanje problema** koristi paginaciju putem kursora preko `jiraNextPageToken` za Jira Cloud. Pročitajte `pagination.nextPageToken` iz prethodnog izvođenja i proslijedite ga u sljedeći Search Issues čvor.
- **Pretraživanje problema** koristi paginaciju s pomakom preko `jiraStartAt` za Jira Data Center / Server. Pročitajte `pagination.startAt`, `pagination.maxResults` i `pagination.total` kako biste izračunali sljedeću stranicu.
- **Popis projekata**, **Dohvati promjene problema**, **Popis komentara** i **Popis privitaka** koriste paginaciju s pomakom s `jiraLimit` i `jiraStartAt`. Paginirani rezultati vraćaju `pagination.startAt`, `pagination.maxResults`, `pagination.total` i `pagination.isLast`.
- **Popis privitaka** prvo dohvaća sve privitke iz problema, a zatim reže rezultat na strani klijenta. Polja za paginaciju i dalje opisuju vraćenu stranicu, ali veliki problemi mogu uzrokovati dodatne troškove dohvaćanja.
- **Popis prijelaza** ne koristi paginaciju.

## Ključna polja

| Polje | Koriste | Napomene |
| --- | --- | --- |
| `credentialId` | Sve operacije | UUID vjerodajnice za Jira |
| `jiraOperation` | Sve operacije | Zadano na `searchIssues` |
| `jiraProjectKey` | Kreiraj problem | Ključ projekta poput `ENG` |
| `jiraIssueKey` | Operacije problema, komentara, privitaka, obavijesti i prijelaza | Ključ problema poput `ENG-123` ili numerički ID problema |
| `jiraIssueType` | Kreiraj problem | Zadano na `Task` |
| `jiraIssueTypeId` | Kreiraj problem | Opcionalni ID tipa problema; nadjačava `jiraIssueType` kada je postavljen |
| `jiraSummary` | Kreiraj/Ažuriraj problem | Obavezno za kreiranje problema |
| `jiraDescription` | Kreiraj/Ažuriraj problem | Šalje se kao ADF na REST API v3 ili običan tekst na REST API v2; koristite `null` prilikom ažuriranja za brisanje opisa |
| `jiraJql` | Pretraživanje problema | Zadano na `updated >= -30d ORDER BY updated DESC` |
| `jiraFields` | Pretraživanje problema | Opcionalni JSON niz ili zarezom odvojena polja problema; zadano na `key`, `summary`, `status`, `assignee` i `issuetype` kada je prazno |
| `jiraAssigneeAccountId` | Kreiraj/Ažuriraj problem | Jira Cloud accountId ili korisničko ime za Data Center / Server; koristite `null` prilikom ažuriranja za brisanje dodijeljenog |
| `jiraLabels` | Kreiraj/Ažuriraj problem | JSON niz ili zarezom odvojeni tekst |
| `jiraCommentBody` | Kreiraj/Ažuriraj komentar | Šalje se kao ADF na REST API v3 ili običan tekst na REST API v2 |
| `jiraCommentId` | Dohvati/Ažuriraj/Obriši komentar | ID Jira komentara |
| `jiraTransitionId` | Prijelaz problema | Otkrijte s Popisom prijelaza |
| `jiraAttachmentId` | Dohvati/Obriši privitak | ID Jira privitka |
| `jiraAttachmentFilename` | Dodaj privitak | Ime učitanog datoteke |
| `jiraAttachmentBase64` | Dodaj privitak | Sirovi base64 ili sadržaj data URL-a; podložan ograničenju veličine datoteke |
| `jiraAttachmentMimeType` | Dodaj privitak | Opcionalni MIME tip; inferira se iz imena datoteke kada je prazno |
| `jiraIncludeBinary` | Dohvati/Popis privitaka | Boolean prekidač; dodaje `content_base64` kada je omogućeno |
| `jiraNotifySubject` | Obavijesti o problemu | Obavezna tema obavijesti |
| `jiraNotifyTextBody` | Obavijesti o problemu | Obavezan tekstualni sadržaj obavijesti |
| `jiraNotifyHtmlBody` | Obavijesti o problemu | Opcionalno HTML tijelo |
| `jiraNotifyTo` | Obavijesti o problemu | JSON primatelja; zadano na `{"assignee":true}` |
| `jiraAccountId` | Dohvati/Obriši korisnika | Jira Cloud accountId ili korisničko ime za Data Center / Server |
| `jiraUserEmail` | Kreiraj korisnika | Adresa e-pošte novog korisnika |
| `jiraUsername` | Kreiraj korisnika | Opcionalno korisničko ime za Data Center / Server; vraća se na `jiraUserEmail` |
| `jiraUserDisplayName` | Kreiraj korisnika | Opcionalno ime za prikaz |
| `jiraUserProducts` | Kreiraj korisnika | JSON niz ili zarezom odvojeni ključevi proizvoda; samo za Jira Cloud |
| `jiraLimit` | Pretraživanje problema, Popis projekata, Dohvati promjene problema, Popis komentara, Popis privitaka | Zadano na `50`; raspon 1–100 |
| `jiraStartAt` | Pretraživanje problema na Data Center / Server, Popis projekata, Dohvati promjene problema, Popis komentara, Popis privitaka | Indeks početne pozicije za paginaciju |
| `jiraNextPageToken` | Pretraživanje problema na Jira Cloud | Token kursora iz prethodnog odgovora pretraživanja |

## Primjeri

Kreirajte problem iz ulaza s gornjeg sloja:

- Operacija: `createIssue`
- Ključ projekta: `ENG`
- Tip problema: `Task`
- Sažetak: `$input.title`
- Opis: `$input.description`
- Oznake: `["automation"]`

Ažurirajte problem i obrišite dodijeljenog:

- Operacija: `updateIssue`
- Ključ ili ID problema: `ENG-123`
- Sažetak: `$input.title`
- ID računa dodijeljenog / korisničko ime: `null`

Pretražujte probleme s prilagođenim poljima i paginacijom putem kursora:

- Operacija: `searchIssues`
- JQL: `project = ENG AND updated >= -30d ORDER BY updated DESC`
- Polja problema: `["key","summary","status"]`
- Ograničenje: `25`
- Token sljedeće stranice: `$searchJira.pagination.nextPageToken`

Pretražujte probleme na Data Center s paginacijom s pomakom:

- Operacija: `searchIssues`
- JQL: `project = ENG ORDER BY updated DESC`
- Ograničenje: `25`
- Početak od: `25`

Prijelaz problema nakon popisa dostupnih prijelaza:

- Operacija: `listTransitions`
- Ključ ili ID problema: `ENG-123`
- Zatim pokrenite **Transition Issue** s ID-jem prijelaza: `$listTransitions.transitions[0].id`

Obavijestite promatrače o ažuriranju problema:

- Operacija: `notifyIssue`
- Ključ ili ID problema: `ENG-123`
- Tema: `Problem ažuriran`
- Tekstualno tijelo: `$input.text`
- JSON primatelja: `{"assignee":true,"watchers":true}`
## Izlaz

Svaka uspješna operacija postavlja:

- `$jira.success`
- `$jira.operation`

**Get Myself** izlaže `user`.

**Operacije s paginiranom listom** izlažu `count`, polje kolekcije i `pagination`:

| Operacija | Ključ kolekcije | Oblik paginacije |
| --- | --- | --- |
| Lista Projekata | `projects` | `{ startAt, maxResults, total, isLast }` |
| Pretraži Zadatke | `issues` | Cloud: `{ maxResults, nextPageToken, isLast }`; Data Center: `{ startAt, maxResults, total, isLast }` |
| Dobi Povijest Zadatka | `changelog` | `{ startAt, maxResults, total, isLast }` |
| Lista Komentara | `comments` | `{ startAt, maxResults, total, isLast }` |
| Lista Priloga | `attachments` | `{ startAt, maxResults, total, isLast }` |

**Lista Transicija** izlaže `transitions` i `count` bez paginacije.

**Mutacije i čitanja zadataka** izlažu Jira payload zadatka plus `key` gdje je primjenjivo.

**Komentar** get/create/update izlaže `comment`; delete izlaže `deleted`.

**Transicija Zadatka** izlaže `transition` kao `{ transitionId }`, plus osvježeni `issue` i `key`.

**Dodavanje Priloga** izlaže `attachments` i `count`. **Dobi Prilog** izlaže `attachment`; **Lista Priloga** izlaže `attachments`, `count` i `pagination`. Kada je **Uključi Binarno** omogućeno, svaki objekt priloga može uključivati `content_base64`. Delete izlaže `deleted`.

**Korisnik** get/create izlaže `user`; delete izlaže `deleted`.

Uobičajeni obrasci pristupa:

- `$searchJira.issues[0].key`
- `$searchJira.pagination.nextPageToken`
- `$createJiraIssue.key`
- `$listTransitions.transitions[0].id`
- `$getAttachment.attachment.content_base64`

## Povezano

- [Tablica Vjerodajnica](../tabs/credentials-tab.md)
- [Integracije Trećih Strana](../reference/integrations.md#jira)
- [Tipovi Čvorova](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
