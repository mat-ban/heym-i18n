# Node de GitHub

El node **GitHub** afegeix operacions natives de l'API REST de GitHub a un workflow, de manera similar als nodes GitHub multioperació que podeu conèixer d'eines com n8n.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Credencial | GitHub |
| Sortida | `$nodeLabel.*` |

## Operacions admeses

El node proporciona actualment 40 accions:

| Recurs | Accions |
|----------|---------|
| Repository | `Get Repository`, `Get Repository License`, `Get Repository Profile`, `Get Repository Issues`, `Get Repository Pull Requests`, `List Popular Paths for Repository`, `List Top Referrers for Repository` |
| Organization / User | `List Organization Repositories`, `List User Repositories`, `Get User Repositories`, `Get User Issues`, `Invite User` |
| Issue | `Create Issue`, `Get Issue`, `List Issues`, `Edit Issue`, `Lock Issue`, `Create Comment` |
| Pull request | `Create Pull Request`, `List Pull Requests` |
| Review | `Create Review`, `Get Review`, `List Reviews`, `Update Review` |
| Release | `Create Release`, `Get Release`, `List Releases`, `Update Release`, `Delete Release` |
| Workflow | `List Workflows`, `Get Workflow`, `Enable Workflow`, `Disable Workflow`, `Get Workflow Usage`, `Dispatch Workflow`, `Dispatch Workflow and Wait` |
| File | `Get File`, `List Files`, `Create or Update File`, `Delete File` |

## Credencial

Creeu una credencial **GitHub** a la [Pestanya Credencials](../tabs/credentials-tab.md) amb:

- Un token d'accés personal
- Una URL base opcional de l'API REST completa per a GitHub Enterprise Server

Deixeu l'URL base buida per a GitHub.com. Es recomana utilitzar PAT de gra fi.

Per a GitHub Enterprise Server, introduïu l'endpoint complet de l'API REST incloent-hi `/api/v3`, com ara
`https://github.example.com/api/v3`. No introduïu només l'arrel de la interfície web
(`https://github.example.com`).

Si utilitzeu GitHub Enterprise Server i posteriorment editeu la credencial per rotar el token, deixar
`base_url` buit preserva l'endpoint Enterprise existent. Introduïu una URL nova només quan vulgueu
canviar aquest endpoint.

## Camps comuns

La majoria d'operacions utilitzen:

- **Owner** – Propietari del repositori, nom de l'organització o nom d'usuari
- **Repository** – Nom del repositori

`List Organization Repositories` només requereix **Owner** (el nom de l'organització) i no utilitza el camp repository.

`List User Repositories` només requereix **Owner** (el nom d'usuari) i no utilitza el camp repository.

`Get User Repositories` reflecteix l'acció User → Get Repositories de n8n. `Get User Issues` retorna
per defecte les issues assignades a l'usuari autenticat de GitHub. Establiu **Mentioned Filter** a qualsevol
valor no buit per retornar en el seu lloc les issues que mencionen l'usuari autenticat. També admet
filtres d'estat, etiquetes, actualitzat des de, ordenació, direcció i per pàgina. `Invite User` requereix una
organització i una adreça de correu electrònic i no utilitza Owner ni Repository.

## Repository

Les operacions de Repository inclouen metadades, contingut de llicència detectat, perfil de salut de la comunitat i
informació de trànsit. `List Popular Paths for Repository` i
`List Top Referrers for Repository` retornen les principals entrades de trànsit de GitHub dels darrers 14 dies i
requereixen accés push d'administració del repositori.

`List Issues` admet filtres opcionals d'assignat, creador, usuari mencionat, etiquetes separades per comes,
marca de temps d'actualització, ordenació i direcció. `List Pull Requests` admet controls d'estat, ordenació,
direcció i per pàgina.

`Get Repository Issues` i `Get Repository Pull Requests` exposen les mateixes API que les seves
contraparts List sota noms d'acció de repositori explícitament compatibles amb n8n.

### Obtenció de metadades del Repository

`Get Repository` emmagatzema la resposta completa de GitHub a `$github.repository` i també exposa
`$github.full_name`, `$github.default_branch`, `$github.private` i `$github.url`.

El payload del repositori normalment inclou:

- Identitat i propietat: ID, nom, nom complet, descripció, propietari i visibilitat
- Estat del repositori: privat, fork, arxivat, desactivat i branca per defecte
- URL: pàgina de GitHub, API, clonació, SSH i URL de Git
- Activitat i mida: marques de temps de creació, actualització i push, mida, estrelles, observadors, forks, subscriptors i issues obertes
- Funcionalitats: issues, projectes, wiki, Pages, discussions, temes, llenguatge i pàgina d'inici
- Llicència, configuració de fusió, permisos del sol·licitant, configuració de seguretat i metadades del pare/font del fork quan estiguin disponibles

Alguns camps administratius, de permisos, de fusió i de seguretat depenen dels permisos de repositori
de la credencial.

Exemple:

- Owner: `heymrun`
- Repository: `heym`

## Issues

Les operacions d'Issue admeten camps de títol/cos i camps opcionals de matriu JSON per a etiquetes i assignats.

`List Issues` retorna només les issues del repositori. Les pull requests s'exclouen; utilitzeu `List Pull Requests` per als resultats de PR.

```json
["bug", "backend"]
```

```json
["octocat"]
```
### Semàntica dels camps d'Edit Issue

Per a `Edit Issue`, només s'envien a GitHub els camps que definiu explícitament:

- **State** – Trieu `Don't change`, `Open` o `Closed`. Deixeu-lo sense definir per mantenir l'estat actual.
- **State Reason** – Opcionalment, definiu `Completed`, `Not Planned`, `Duplicate` o `Reopened`.
- **Title / Body** – Deixeu-ho en blanc per mantenir el valor actual.
- **Labels / Assignees** – Deixeu el camp buit per mantenir el valor actual. Utilitzeu `[]` per esborrar totes les etiquetes o els assignats. Utilitzeu un array JSON com ara `["bug"]` per substituir-los.

`Edit Issue` requereix com a mínim un camp per modificar en temps d'execució. Si només proporcioneu un número d'issue, l'execució falla amb un error de validació de la capa d'API de GitHub.

## Lock Issue

`Lock Issue` accepta un **Lock reason** opcional. Quan es proporciona, ha de ser un dels valors admesos per GitHub:

- `off-topic`
- `too heated`
- `resolved`
- `spam`

Deixeu el motiu buit per bloquejar sense un motiu específic.

## Pull Requests

Create PR requereix:

- Title
- Head branch
- Base branch
- Body opcional
- Mode esborrany opcional

## Pull Request Reviews

Les operacions de revisió coincideixen amb l'API de revisió de pull requests de GitHub:

| Operació | Camps obligatoris | Camps opcionals |
|-----------|-----------------|-----------------|
| `Create Review` | Número de pull request, event | Body, commit ID |
| `Get Review` | Número de pull request, review ID | — |
| `List Reviews` | Número de pull request | Per page |
| `Update Review` | Número de pull request, review ID, body | — |

`Create Review` admet `Approve`, `Request Changes`, `Comment` i `Pending`.
El body és obligatori per a `Request Changes` i `Comment`. Quan el Commit ID és buit, GitHub
revisa l'últim commit del pull request.

## Releases

| Operació | Camps obligatoris en temps d'execució | Habitualment opcionals |
|-----------|---------------------------|-------------------|
| `Create Release` | Tag name | Release name (title), body, target branch, draft, prerelease |
| `Update Release` | Release ID | Tag name, release name, body, target branch, draft, prerelease |
| `Get Release` / `Delete Release` | Release ID | — |

`Update Release` pot definir explícitament `draft` / `prerelease` tant a `true` com a `false`.

## Workflows

Les operacions de Workflow admeten:

- Llistar els workflows del repositori
- Obtenir un workflow per ID numèric o pel nom del fitxer de workflow
- Habilitar o deshabilitar un workflow
- Llegir l'ús facturable del workflow per sistema operatiu del runner
- Disparar un workflow amb una ref o branca més un objecte opcional d'entrades JSON

GitHub està en procés de tancar l'endpoint `Get Workflow Usage`. Els workflows que utilitzen
aquesta operació poden necessitar migrar quan GitHub elimini l'endpoint.

`Dispatch Workflow` accepta les dues formes de resposta de GitHub: la llegada `204 No Content` i la més nova
`200` que conté `workflow_run_id`, `run_url` i `html_url`.

`Dispatch Workflow and Wait` dispara el workflow i fa polling de l'execució fins que el seu estat és
`completed`. Configureu el temps d'espera i l'interval de polling en segons. Heym utilitza
`workflow_run_id` quan GitHub retorna la resposta més nova `200`. Per a la resposta tradicional `204 No
Content`, Heym descobreix l'execució `workflow_dispatch` creada recentment per al workflow i la ref seleccionats, i després espera aquesta execució.

## File Contents

`Get File` llegeix un fitxer del repositori a través de l'API de continguts de GitHub i descodifica el contingut de text quan està disponible. Els fitxers binaris i el contingut que no sigui UTF-8 poden retornar metadades sense un camp `content` descodificat.

`List Files` retorna les entrades de directori de l'API de continguts del repositori per a una ruta de carpeta donada i una ref opcional. Deixeu **Directory Path** buit per llistar l'arrel del repositori.

`Create or Update File` escriu contingut de text en una ruta del repositori utilitzant:

- File path
- Commit message
- File content
- Branca opcional

`Delete File` elimina una ruta del repositori utilitzant un missatge de commit i una branca opcional. Si el fitxer existeix, Heym obté el SHA actual automàticament abans d'eliminar-lo.

Si el fitxer ja existeix, Heym obté el SHA actual automàticament abans d'actualitzar-lo.

## Paginació

`List Issues`, `Get Repository Issues`, `Get User Issues`, `List Pull Requests`,
`Get Repository Pull Requests`, `List Reviews`, `List Releases`, `List Workflows`,
`List Organization Repositories`, `List User Repositories` i `Get User Repositories` admeten
**Per Page** (1–100). Heym sol·licita una pàgina de resultats; no hi ha cap camp `page` per obtenir
pàgines addicionals en la mateixa operació.
## Sortida

La forma exacta depèn de l'operació seleccionada. Els camps habituals inclouen:

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

Substituïu `github` per l'etiqueta del vostre node.

## Notes

- Les etiquetes i els assignats han de ser matrius JSON vàlides quan es proporcionin.
- Les entrades de despatx del Workflow han de ser un objecte JSON vàlid quan es proporcionin.
- `Edit Issue` utilitza `state` només quan l'establiu explícitament; deixeu-lo sense definir per conservar l'estat actual de la incidència.
- Els permisos de l'API de GitHub depenen dels àmbits del token o dels permisos precisos del repositori que concediu.

## Relacionat

- [Pestanya Credencials](../tabs/credentials-tab.md) – Afegiu i gestioneu les credencials de GitHub
- [Integracions de tercers](../reference/integrations.md) – Configuració de les credencials de GitHub i `base_url` d'Enterprise
- [Node Agent](./agent-node.md) – Utilitzeu les credencials de GitHub amb `@modelcontextprotocol/server-github`
- [Tipus de node](../reference/node-types.md) – Catàleg complet de nodes
