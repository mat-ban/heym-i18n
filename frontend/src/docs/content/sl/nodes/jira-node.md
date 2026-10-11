# Jira Vozlišče

**Jira** vozlišče povezuje workflows z Jira REST API za avtomatizacijo projektov, težav, komentarjev, priponk, uporabnikov, obvestil in prehodov. Privzeta operacija je **Iskanje težav**.

## Pregled

| Lastnost | Vrednost |
|----------|-------|
| Vhodi | 1 |
| Izhodi | 1 |
| Poverilnica | Jira (Cloud e-pošta/API žeton ali Data Center uporabniško ime/geslo, osnovni URL, način namestitve, neobvezna različica REST API) |
| Izhod | `$nodeLabel.*` |

## Poverilnica

Ustvarite **Jira** poverilnico na [Zavihek Poverilnice](../tabs/credentials-tab.md). Shranjeni konfiguracijski ključi so `email`, `api_token`, `base_url`, `deployment` in neobvezna `api_version`. Za Jira Cloud `email` shranjuje e-poštni naslov Atlassian računa, `api_token` pa shranjuje Atlassian API žeton. Za Jira Data Center / Server ti isti ključi shranjujejo uporabniško ime in geslo za osnovno avtentikacijo. Oglejte si [Integracije tretjih oseb](../reference/integrations.md#jira) za korake nastavitve.

| Polje | Konfiguracijski ključ | Opis |
| --- | --- | --- |
| Jira E-pošta / Uporabniško ime | `email` | E-pošta Atlassian računa za Jira Cloud ali uporabniško ime za Jira Data Center / Server |
| API Žeton / Geslo | `api_token` | API žeton Atlassian za Jira Cloud ali geslo za Jira Data Center / Server za osnovno avtentikacijo |
| Osnovni URL | `base_url` | URL strani Jira, na primer `https://your-domain.atlassian.net` |
| Način namestitve | `deployment` | `cloud` za Jira Cloud ali `data_center` za Jira Data Center / Server |
| Različica REST API | `api_version` | Privzeto `3` za Jira Cloud. Data Center / Server uporablja REST API v2 |

Osebni dostopni žetoni in Bearer avtentikacija za Data Center / Server še niso podprti s strani Jira poverilnice.

Uporabite **Preizkusi povezave** za preverjanje poverilnice glede na trenutnega uporabnika Jira.

## Operacije

| Operacija | Zahtevana polja | Izhod |
| --- | --- | --- |
| Pridobi sebe | — | `user` |
| Naštej projekte | Neobvezno Omejitev, Začni pri | `projects`, `count`, `pagination` |
| Iskanje težav | Neobvezno JQL, Polja težav, Omejitev, Žeton naslednje strani, Začni pri | `issues`, `count`, `pagination` |
| Pridobi težavo | Ključ ali ID težave | `issue`, `key` |
| Ustvari težavo | Ključ projekta, Povzetek | `issue`, `key` |
| Posodobi težavo | Ključ ali ID težave in vsaj eno spremenjeno polje | `issue`, `key` |
| Izbriši težavo | Ključ ali ID težave | `deleted` |
| Pridobi zgodovino sprememb težave | Ključ ali ID težave; neobvezno Omejitev, Začni pri | `changelog`, `count`, `pagination` |
| Obvesti o težavi | Ključ ali ID težave, Zadeva, Besedilo | `notified` |
| Naštej komentarje | Ključ ali ID težave; neobvezno Omejitev, Začni pri | `comments`, `count`, `pagination` |
| Ustvari komentar | Ključ ali ID težave, Besedilo komentarja | `comment` |
| Pridobi komentar | Ključ ali ID težave, ID komentarja | `comment` |
| Posodobi komentar | Ključ ali ID težave, ID komentarja, Besedilo komentarja | `comment` |
| Izbriši komentar | Ključ ali ID težave, ID komentarja | `deleted` |
| Dodaj priponko | Ključ ali ID težave, Ime datoteke, Base64 vsebina | `attachments`, `count` |
| Pridobi priponko | ID priponke; neobvezno Vključi binarno | `attachment` |
| Naštej priponke | Ključ ali ID težave; neobvezno Omejitev, Začni pri, Vključi binarno | `attachments`, `count`, `pagination` |
| Izbriši priponko | ID priponke | `deleted` |
| Naštej prehode | Ključ ali ID težave | `transitions`, `count` |
| Prehod težave | Ključ ali ID težave, ID prehoda | `transition`, `issue`, `key` |
| Pridobi uporabnika | ID računa / Uporabniško ime | `user` |
| Ustvari uporabnika | E-pošta uporabnika | `user` |
| Izbriši uporabnika | ID računa / Uporabniško ime | `deleted` |

Polja besedila, ki podpirajo izraze, podpirajo [izraze](../reference/expression-dsl.md), kot je `$input.text`. `jiraIncludeBinary` je boolean preklop in ne podpira izrazov, vendar ga je mogoče označiti kot agentom dodeljeno, ko je Jira vozlišče povezano z orodjem agenta.

## Polja težav in posodobitev

- **Ključ projekta** je kratek ključ projekta, kot je `ENG`. Uporabite Naštej projekte za odkrivanje ključev.
- **Ključ ali ID težave** sprejema ključe, kot so `ENG-123` ali numerični ID-ji težav. Uporabite Iskanje težav ali Naštej projekte za odkrivanje vrednosti.
- **ID prehoda** prihaja iz Naštej prehode. Vsak objekt prehoda vključuje polje `id`.
- **ID komentarja** in **ID priponke** prihajata iz Naštej komentarje, Naštej priponke ali prejšnjih odgovorov o ustvarjanju/pridobivanju.
- **ID računa / Uporabniško ime** je vrednost `accountId` za Jira Cloud ali uporabniško ime za Jira Data Center / Server. Pridobi sebe ali Pridobi uporabnika vam lahko pomagata pri odkrivanju.
- Opis težave in besedilo telesa komentarja se pošiljata v Atlassian Document Format na REST API v3; ko je način namestitve poverilnice Data Center / Server, se pošiljata kot navadno besedilo. V v3 znaki za novo vrstico postanejo ločeni odstavki.
- **Pridobi zgodovino sprememb težave** uporablja paginirani konec točke zgodovine sprememb Jira Cloud. Za Data Center / Server bere razširjene podatke o zgodovini sprememb težave in uporablja konfigurirani odmik/omejitev na vrnjenih zgodovinah.
- Pri **Posodobi težavo** pustite neobvezna polja prazna, da ohranite njihove trenutne vrednosti.
- Nastavite **Opis** ali **ID računa / Uporabniško ime dodeljenega** na `null` pri posodobitvi, da izbrišete ta polja. Oznake ni mogoče izbrisati z `null`.
- **JSON prejemnikov** pri Obvesti o težavi privzeto znaša `{"assignee":true}`, ko je izpuščen. Pogosti ključi vključujejo `assignee`, `reporter`, `watchers` in `voters` (na primer `{"assignee":true,"watchers":true}`).
- **Dodaj priponko** sprejema surovo base64 ali vsebino podatkovne URL in je omejena z nastavitvijo velikosti datoteke platforme (privzeto 99 MB).
## Stranjenje

- **Iskanje težav** uporablja paginacijo s kurzorjem preko `jiraNextPageToken` za Jira Cloud. Preberite `pagination.nextPageToken` iz prejšnjega izvajanja in ga posredujte v naslednje vozlišče Iskanje težav.
- **Iskanje težav** uporablja paginacijo z offsetom preko `jiraStartAt` za Jira Data Center / Server. Preberite `pagination.startAt`, `pagination.maxResults` in `pagination.total`, da izračunate naslednjo stran.
- **Seznam projektov**, **Pridobitev zgodovine težave**, **Seznam komentarjev** in **Seznam priponk** uporabljajo paginacijo z offsetom z `jiraLimit` in `jiraStartAt`. Paginirani rezultati vrnejo `pagination.startAt`, `pagination.maxResults`, `pagination.total` in `pagination.isLast`.
- **Seznam priponk** najprej pridobi vse priponke iz težave, nato pa razreže rezultat na strani odjemalca. Polja paginacije še vedno opisujejo vrnjeno stran, vendar lahko velike težave povzročijo dodatne stroške pridobivanja.
- **Seznam prehodov** ne uporablja paginacije.

## Ključna polja

| Polje | Uporablja | Opombe |
| --- | --- | --- |
| `credentialId` | Vse operacije | UUID lastniške Jira poverilnice |
| `jiraOperation` | Vse operacije | Privzeto na `searchIssues` |
| `jiraProjectKey` | Ustvari težavo | Ključ projekta, kot je `ENG` |
| `jiraIssueKey` | Operacije s težavami, komentarji, priponkami, obvestili in prehodi | Ključ težave, kot je `ENG-123` ali numerična ID težave |
| `jiraIssueType` | Ustvari težavo | Privzeto na `Task` |
| `jiraIssueTypeId` | Ustvari težavo | Neobvezni ID vrste težave; nadomešča `jiraIssueType`, ko je nastavljen |
| `jiraSummary` | Ustvari/Posodobi težavo | Obvezno za ustvarjanje težave |
| `jiraDescription` | Ustvari/Posodobi težavo | Poslano kot ADF na REST API v3 ali navadno besedilo na REST API v2; uporabite `null` pri posodobitvi za izbris opisa |
| `jiraJql` | Iskanje težav | Privzeto na `updated >= -30d ORDER BY updated DESC` |
| `jiraFields` | Iskanje težav | Neobvezna JSON tabela ali z vejico ločena polja težav; privzeto na `key`, `summary`, `status`, `assignee` in `issuetype`, ko je prazno |
| `jiraAssigneeAccountId` | Ustvari/Posodobi težavo | Jira Cloud accountId ali uporabniško ime Data Center / Server; uporabite `null` pri posodobitvi za izbris dodeljenega |
| `jiraLabels` | Ustvari/Posodobi težavo | JSON tabela ali z vejico ločeno besedilo |
| `jiraCommentBody` | Ustvari/Posodobi komentar | Poslano kot ADF na REST API v3 ali navadno besedilo na REST API v2 |
| `jiraCommentId` | Pridobi/Posodobi/Izbriši komentar | ID Jira komentarja |
| `jiraTransitionId` | Prehod težave | Odkrijte z Seznamom prehodov |
| `jiraAttachmentId` | Pridobi/Izbriši priponko | ID Jira priponke |
| `jiraAttachmentFilename` | Dodaj priponko | Ime naložene datoteke |
| `jiraAttachmentBase64` | Dodaj priponko | Surov base64 ali vsebina URL-ja podatkov; podvrženo omejitvi velikosti datoteke |
| `jiraAttachmentMimeType` | Dodaj priponko | Neobvezna MIME vrsta; ugotovljena iz imena datoteke, ko je prazna |
| `jiraIncludeBinary` | Pridobi/Seznam priponk | Boolean preklop; doda `content_base64`, ko je omogočeno |
| `jiraNotifySubject` | Obvesti o težavi | Obvezna tema obvestila |
| `jiraNotifyTextBody` | Obvesti o težavi | Obvezno besedilo obvestila |
| `jiraNotifyHtmlBody` | Obvesti o težavi | Neobvezno HTML telo |
| `jiraNotifyTo` | Obvesti o težavi | JSON prejemnikov; privzeto na `{"assignee":true}` |
| `jiraAccountId` | Pridobi/Izbriši uporabnika | Jira Cloud accountId ali uporabniško ime Data Center / Server |
| `jiraUserEmail` | Ustvari uporabnika | E-poštni naslov novega uporabnika |
| `jiraUsername` | Ustvari uporabnika | Neobvezno uporabniško ime Data Center / Server; vrne se na `jiraUserEmail` |
| `jiraUserDisplayName` | Ustvari uporabnika | Neobvezno prikazno ime |
| `jiraUserProducts` | Ustvari uporabnika | JSON tabela ali z vejico ločeni ključi produktov; samo Jira Cloud |
| `jiraLimit` | Iskanje težav, Seznam projektov, Pridobitev zgodovine težave, Seznam komentarjev, Seznam priponk | Privzeto na `50`; obseg 1–100 |
| `jiraStartAt` | Iskanje težav na Data Center / Server, Seznam projektov, Pridobitev zgodovine težave, Seznam komentarjev, Seznam priponk | Začetni indeks paginacije z offsetom |
| `jiraNextPageToken` | Iskanje težav na Jira Cloud | Kurzorski žeton iz prejšnjega odgovora iskanja |

## Primeri

Ustvarite težavo iz vhodnih podatkov:

- Operacija: `createIssue`
- Ključ projekta: `ENG`
- Vrsta težave: `Task`
- Povzetek: `$input.title`
- Opis: `$input.description`
- Oznake: `["automation"]`

Posodobite težavo in izbrišite dodeljenega:

- Operacija: `updateIssue`
- Ključ ali ID težave: `ENG-123`
- Povzetek: `$input.title`
- ID računa dodeljenega / uporabniško ime: `null`

Iščite težave s prilagojenimi polji in paginacijo s kurzorjem:

- Operacija: `searchIssues`
- JQL: `project = ENG AND updated >= -30d ORDER BY updated DESC`
- Polja težav: `["key","summary","status"]`
- Omejitev: `25`
- Žeton naslednje strani: `$searchJira.pagination.nextPageToken`

Iščite težave na Data Center z paginacijo z offsetom:

- Operacija: `searchIssues`
- JQL: `project = ENG ORDER BY updated DESC`
- Omejitev: `25`
- Začetek pri: `25`

Prehodite težavo po seznamu razpoložljivih prehodov:

- Operacija: `listTransitions`
- Ključ ali ID težave: `ENG-123`
- Nato izvedite **Prehod težave** s prehodnim ID: `$listTransitions.transitions[0].id`

Obvestite opazovalce o posodobitvi težave:

- Operacija: `notifyIssue`
- Ključ ali ID težave: `ENG-123`
- Tema: `Težava posodobljena`
- Besedilo: `$input.text`
- JSON prejemnikov: `{"assignee":true,"watchers":true}`
## Izhod

Vsaka uspešna operacija nastavi:

- `$jira.success`
- `$jira.operation`

**Get Myself** izpostavi `user`.

**Operacije s paginiranimi seznami** izpostavijo `count`, polje zbirke in `pagination`:

| Operacija | Ključ zbirke | Oblika paginacije |
| --- | --- | --- |
| Seznam projektov | `projects` | `{ startAt, maxResults, total, isLast }` |
| Iskanje težav | `issues` | Cloud: `{ maxResults, nextPageToken, isLast }`; Data Center: `{ startAt, maxResults, total, isLast }` |
| Pridobitev zgodovine sprememb težave | `changelog` | `{ startAt, maxResults, total, isLast }` |
| Seznam komentarjev | `comments` | `{ startAt, maxResults, total, isLast }` |
| Seznam priponk | `attachments` | `{ startAt, maxResults, total, isLast }` |

**Seznam prehodov** izpostavi `transitions` in `count` brez paginacije.

**Mutacije in branja težav** izpostavijo payload težave Jira ter `key`, kjer je to primerno.

**Komentar** za pridobitev/ustvarjanje/posodobitev izpostavi `comment`; brisanje izpostavi `deleted`.

**Prehod težave** izpostavi `transition` kot `{ transitionId }`, poleg osvežene `issue` in `key`.

**Dodajanje priponke** izpostavi `attachments` in `count`. **Pridobitev priponke** izpostavi `attachment`; **Seznam priponk** izpostavi `attachments`, `count` in `pagination`. Ko je **Vključi binarno** omogočeno, lahko vsak objekt priponke vključuje `content_base64`. Brisanje izpostavi `deleted`.

**Uporabnik** za pridobitev/ustvarjanje izpostavi `user`; brisanje izpostavi `deleted`.

Pogosti vzorci dostopa:

- `$searchJira.issues[0].key`
- `$searchJira.pagination.nextPageToken`
- `$createJiraIssue.key`
- `$listTransitions.transitions[0].id`
- `$getAttachment.attachment.content_base64`

## Sorodno

- [Poverilnice](../tabs/credentials-tab.md)
- [Integracije tretjih oseb](../reference/integrations.md#jira)
- [Vrste vozlišč](../reference/node-types.md)
- [Izrazni DSL](../reference/expression-dsl.md)
