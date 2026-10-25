# Nodul GitHub

Nodul **GitHub** adaugă operațiuni REST native GitHub într-un workflow, similar nodurilor GitHub cu multiple operațiuni pe care le cunoașteți din instrumente precum n8n.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Acreditare | GitHub |
| Ieșire | `$nodeLabel.*` |

## Operațiuni acceptate

Nodul oferă în prezent 40 de acțiuni:

| Resursă | Acțiuni |
|----------|---------|
| Repository | `Get Repository`, `Get Repository License`, `Get Repository Profile`, `Get Repository Issues`, `Get Repository Pull Requests`, `List Popular Paths for Repository`, `List Top Referrers for Repository` |
| Organization / User | `List Organization Repositories`, `List User Repositories`, `Get User Repositories`, `Get User Issues`, `Invite User` |
| Issue | `Create Issue`, `Get Issue`, `List Issues`, `Edit Issue`, `Lock Issue`, `Create Comment` |
| Pull request | `Create Pull Request`, `List Pull Requests` |
| Review | `Create Review`, `Get Review`, `List Reviews`, `Update Review` |
| Release | `Create Release`, `Get Release`, `List Releases`, `Update Release`, `Delete Release` |
| Workflow | `List Workflows`, `Get Workflow`, `Enable Workflow`, `Disable Workflow`, `Get Workflow Usage`, `Dispatch Workflow`, `Dispatch Workflow and Wait` |
| File | `Get File`, `List Files`, `Create or Update File`, `Delete File` |

## Acreditare

Creați o acreditare **GitHub** în [Credentials Tab](../tabs/credentials-tab.md) cu:

- Un token de acces personal
- URL de bază REST API complet opțional pentru GitHub Enterprise Server

Lăsați URL-ul de bază gol pentru GitHub.com. Se recomandă PAT-uri cu granularitate fină.

Pentru GitHub Enterprise Server, introduceți endpoint-ul REST API complet, inclusiv `/api/v3`, cum ar fi
`https://github.example.com/api/v3`. Nu introduceți doar rădăcina interfeței web
(`https://github.example.com`).

Dacă utilizați GitHub Enterprise Server și ulterior editați acreditarea pentru a roti token-ul, lăsând
`base_url` gol se păstrează endpoint-ul Enterprise existent. Introduceți un URL nou doar când doriți
să schimbați acel endpoint.

## Câmpuri comune

Majoritatea operațiunilor utilizează:

- **Owner** – Proprietarul repository-ului, numele organizației sau numele de utilizator
- **Repository** – Numele repository-ului

`List Organization Repositories` necesită doar **Owner** (numele organizației) și nu utilizează câmpul repository.

`List User Repositories` necesită doar **Owner** (numele de utilizator) și nu utilizează câmpul repository.

`Get User Repositories` oglindește acțiunea User → Get Repositories din n8n. `Get User Issues` returnează
issue-urile atribuite utilizatorului GitHub autentificat în mod implicit. Setați **Mentioned Filter** la orice
valoare non-goală pentru a returna în schimb issue-urile care menționează utilizatorul autentificat. De asemenea, acceptă
filtre pentru stare, etichete, actualizat-de-la, sortare, direcție și pe pagină. `Invite User` necesită o
organizație și o adresă de email și nu utilizează Owner sau Repository.

## Repository

Operațiunile Repository includ metadate, conținutul licenței detectate, profilul de sănătate al comunității și
informații despre trafic. `List Popular Paths for Repository` și
`List Top Referrers for Repository` returnează principalele intrări de trafic GitHub din ultimele 14 zile și
necesită acces de administrare push la repository.

`List Issues` acceptă filtre opționale pentru assignee, creator, utilizator menționat, etichete separate prin virgulă,
timestamp actualizat-de-la, sortare și direcție. `List Pull Requests` acceptă controale pentru stare, sortare,
direcție și pe pagină.

`Get Repository Issues` și `Get Repository Pull Requests` expun aceleași API-uri ca omologii lor List
sub nume explicite de acțiuni repository compatibile cu n8n.

### Obținerea metadatelor Repository

`Get Repository` stochează răspunsul complet GitHub în `$github.repository` și expune de asemenea
`$github.full_name`, `$github.default_branch`, `$github.private` și `$github.url`.

Payload-ul repository-ului include în mod obișnuit:

- Identitate și proprietate: ID, nume, nume complet, descriere, proprietar și vizibilitate
- Starea repository-ului: privat, fork, arhivat, dezactivat și ramura implicită
- URL-uri: pagina GitHub, API, clone, SSH și URL-uri Git
- Activitate și dimensiune: timestamp-uri de creare, actualizare și push, dimensiune, stars, watchers, forks, subscribers și issue-uri deschise
- Funcționalități: issues, projects, wiki, Pages, discussions, topics, limbaj și homepage
- Licență, setări de merge, permisiuni de apelare, setări de securitate și metadate fork parent/source când sunt disponibile

Unele câmpuri administrative, de permisiuni, merge și securitate depind de permisiunile repository-ului
ale acreditării.

Exemplu:

- Owner: `heymrun`
- Repository: `heym`

## Issues

Operațiunile Issue acceptă câmpuri titlu/corp și câmpuri opționale JSON-array pentru etichete și assignees.

`List Issues` returnează doar issue-urile repository-ului. Pull request-urile sunt excluse; utilizați `List Pull Requests` pentru rezultate PR.

```json
["bug", "backend"]
```

```json
["octocat"]
```

### Semantica câmpurilor Edit Issue

Pentru `Edit Issue`, doar câmpurile pe care le setați explicit sunt trimise către GitHub:

- **State** – Alegeți `Don't change`, `Open` sau `Closed`. Lăsați nesetat pentru a păstra starea curentă.
- **State Reason** – Setați opțional `Completed`, `Not Planned`, `Duplicate` sau `Reopened`.
- **Title / Body** – Lăsați gol pentru a păstra valoarea curentă.
- **Labels / Assignees** – Lăsați câmpul gol pentru a păstra valoarea curentă. Utilizați `[]` pentru a șterge toate etichetele sau assignees. Utilizați un JSON array precum `["bug"]` pentru a le înlocui.

`Edit Issue` necesită cel puțin un câmp de modificat la runtime. Dacă furnizați doar un număr de issue, execuția eșuează cu o eroare de validare din partea stratului API GitHub.
## Blocare Issue

`Lock Issue` acceptă un **Motiv de blocare** opțional. Când este furnizat, acesta trebuie să fie una dintre valorile acceptate de GitHub:

- `off-topic`
- `too heated`
- `resolved`
- `spam`

Lăsați motivul gol pentru a bloca fără un motiv specific.

## Pull Requests

Crearea unui PR necesită:

- Titlu
- Branch sursă
- Branch destinație
- Corp opțional
- Mod draft opțional

## Recenzii Pull Request

Operațiunile de recenzare corespund API-ului de recenzii pentru pull request-uri al GitHub:

| Operațiune | Câmpuri obligatorii | Câmpuri opționale |
|-----------|-----------------|-----------------|
| `Create Review` | Număr pull request, eveniment | Corp, ID commit |
| `Get Review` | Număr pull request, ID recenzie | — |
| `List Reviews` | Număr pull request | Pe pagină |
| `Update Review` | Număr pull request, ID recenzie, corp | — |

`Create Review` acceptă `Approve`, `Request Changes`, `Comment` și `Pending`.
Corpul este obligatoriu pentru `Request Changes` și `Comment`. Când ID-ul commit-ului este gol, GitHub
recenzează ultimul commit al pull request-ului.

## Versiuni

| Operațiune | Câmpuri obligatorii la execuție | De obicei opționale |
|-----------|---------------------------|-------------------|
| `Create Release` | Nume tag | Nume versiune (titlu), corp, branch țintă, draft, prerelease |
| `Update Release` | ID versiune | Nume tag, nume versiune, corp, branch țintă, draft, prerelease |
| `Get Release` / `Delete Release` | ID versiune | — |

`Update Release` poate seta explicit `draft` / `prerelease` fie la `true`, fie la `false`.

## Workflow-uri

Operațiunile pentru workflow-uri acceptă:

- Listarea workflow-urilor unui depozit
- Obținerea unui workflow după ID numeric sau după numele fișierului de workflow
- Activarea sau dezactivarea unui workflow
- Citirea utilizării facturabile a workflow-ului în funcție de sistemul de operare al runner-ului
- Declanșarea unui workflow cu un ref sau branch plus un obiect opțional de intrări JSON

GitHub este în proces de închidere a endpoint-ului `Get Workflow Usage`. Workflow-urile care
utilizează această operațiune pot necesita migrare atunci când GitHub elimină endpoint-ul.

`Dispatch Workflow` acceptă ambele forme de răspuns GitHub: `204 No Content` (forma veche) și
forma mai nouă `200` care conține `workflow_run_id`, `run_url` și `html_url`.

`Dispatch Workflow and Wait` declanșează workflow-ul și interoghează execuția până când starea acesteia este
`completed`. Configurați timeout-ul și intervalul de interogare în secunde. Heym utilizează
`workflow_run_id` atunci când GitHub returnează răspunsul mai nou `200`. Pentru răspunsul tradițional `204 No
Content`, Heym descoperă execuția `workflow_dispatch` nou creată pentru workflow-ul și ref-ul selectate, apoi așteaptă acea execuție.

## Conținutul fișierelor

`Get File` citește un fișier din depozit prin API-ul de conținut al GitHub și decodează conținutul text atunci când este disponibil. Fișierele binare și conținutul non-UTF-8 pot returna metadate fără un câmp `content` decodat.

`List Files` returnează intrările unui director din API-ul de conținut al depozitului pentru o cale de folder dată și un ref opțional. Lăsați **Directory Path** gol pentru a lista rădăcina depozitului.

`Create or Update File` scrie conținut text într-o cale din depozit utilizând:

- Calea fișierului
- Mesajul commit-ului
- Conținutul fișierului
- Branch opțional

`Delete File` elimină o cale din depozit utilizând un mesaj de commit și un branch opțional. Dacă fișierul există, Heym preia automat SHA-ul curent înainte de a-l șterge.

Dacă fișierul există deja, Heym preia automat SHA-ul curent înainte de a-l actualiza.

## Paginare

`List Issues`, `Get Repository Issues`, `Get User Issues`, `List Pull Requests`,
`Get Repository Pull Requests`, `List Reviews`, `List Releases`, `List Workflows`,
`List Organization Repositories`, `List User Repositories` și `Get User Repositories` acceptă
**Pe pagină** (1–100). Heym solicită o singură pagină de rezultate; nu există un câmp `page` pentru a prelua
pagini suplimentare în aceeași operațiune.


### Return all pages

Activați **Return all pages** pentru ca o rulare să parcurgă toate paginile, începând de la **Cursor** dacă este setat. Fiecare cerere solicită 100 de elemente, indiferent de valoarea **Per Page**. Nodul se oprește după aproximativ 1.000 de elemente (sau 100 de cereri): obiectele issue au fiecare circa 6 KB, deci o limită mai mare ar produce ieșiri de nod foarte mari. Dacă se oprește mai devreme, returnează ce a obținut cu `has_more: true` și un `next_cursor` în loc să genereze o eroare, iar puteți continua transmițând acel cursor rulării următoare. Oprirea workflow-ului sau atingerea timeoutului acestuia încheie preluarea între pagini.

## Ieșire

Forma exactă depinde de operațiunea selectată. Câmpurile comune includ:

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

Înlocuiți `github` cu eticheta nodului dvs.

## Note

- Etichetele și persoanele atribuite trebuie să fie tablouri JSON valide atunci când sunt furnizate.
- Intrările pentru declanșarea workflow-ului trebuie să fie un obiect JSON valid atunci când sunt furnizate.
- `Edit Issue` utilizează `state` doar atunci când îl setați explicit; lăsați-l nesetat pentru a păstra starea curentă a issue-ului.
- Permisiunile API-ului GitHub depind de scope-urile token-ului sau de permisiunile fine-grained ale depozitului pe care le acordați.

## Resurse conexe

- [Credentials Tab](../tabs/credentials-tab.md) – Adăugați și gestionați acreditările GitHub
- [Third-Party Integrations](../reference/integrations.md) – Configurarea acreditărilor GitHub și `base_url` pentru Enterprise
- [Agent Node](./agent-node.md) – Utilizați acreditările GitHub cu `@modelcontextprotocol/server-github`
- [Node Types](../reference/node-types.md) – Catalogul complet de noduri
