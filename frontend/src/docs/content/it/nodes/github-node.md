# Nodo GitHub

Il nodo **GitHub** aggiunge operazioni REST GitHub native a un workflow, in modo simile ai nodi GitHub multi-operazione che si possono conoscere da strumenti come n8n.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Credenziale | GitHub |
| Output | `$nodeLabel.*` |

## Operazioni supportate

Il nodo attualmente fornisce 40 azioni:

| Risorsa | Azioni |
|----------|---------|
| Repository | `Get Repository`, `Get Repository License`, `Get Repository Profile`, `Get Repository Issues`, `Get Repository Pull Requests`, `List Popular Paths for Repository`, `List Top Referrers for Repository` |
| Organizzazione / Utente | `List Organization Repositories`, `List User Repositories`, `Get User Repositories`, `Get User Issues`, `Invite User` |
| Issue | `Create Issue`, `Get Issue`, `List Issues`, `Edit Issue`, `Lock Issue`, `Create Comment` |
| Pull request | `Create Pull Request`, `List Pull Requests` |
| Review | `Create Review`, `Get Review`, `List Reviews`, `Update Review` |
| Release | `Create Release`, `Get Release`, `List Releases`, `Update Release`, `Delete Release` |
| Workflow | `List Workflows`, `Get Workflow`, `Enable Workflow`, `Disable Workflow`, `Get Workflow Usage`, `Dispatch Workflow`, `Dispatch Workflow and Wait` |
| File | `Get File`, `List Files`, `Create or Update File`, `Delete File` |

## Credenziale

Creare una credenziale **GitHub** nella [Scheda Credenziali](../tabs/credentials-tab.md) con:

- Un personal access token
- URL di base REST API completo opzionale per GitHub Enterprise Server

Lasciare vuoto l'URL di base per GitHub.com. Si consiglia l'uso di PAT con granularità fine.

Per GitHub Enterprise Server, inserire l'endpoint REST API completo, incluso `/api/v3`, ad esempio
`https://github.example.com/api/v3`. Non inserire solo la radice dell'interfaccia web
(`https://github.example.com`).

Se si utilizza GitHub Enterprise Server e successivamente si modifica la credenziale per ruotare il token, lasciare
`base_url` vuoto preserva l'endpoint Enterprise esistente. Inserire un nuovo URL solo quando si desidera
modificare tale endpoint.

## Campi comuni

La maggior parte delle operazioni utilizza:

- **Owner** – Proprietario del repository, nome dell'organizzazione o nome utente
- **Repository** – Nome del repository

`List Organization Repositories` richiede solo **Owner** (il nome dell'organizzazione) e non utilizza il campo repository.

`List User Repositories` richiede solo **Owner** (il nome utente) e non utilizza il campo repository.

`Get User Repositories` rispecchia l'azione User → Get Repositories di n8n. `Get User Issues` restituisce
per impostazione predefinita le issue assegnate all'utente GitHub autenticato. Impostare **Mentioned Filter** su un valore
non vuoto per restituire invece le issue che menzionano l'utente autenticato. Supporta inoltre
i filtri state, labels, updated-since, sort, direction e per-page. `Invite User` richiede
un'organizzazione e un indirizzo email e non utilizza Owner o Repository.

## Repository

Le operazioni Repository includono metadati, contenuto della licenza rilevata, profilo di salute della community e
informazioni sul traffico. `List Popular Paths for Repository` e
`List Top Referrers for Repository` restituiscono le voci di traffico principali di GitHub per gli ultimi 14 giorni e
richiedono l'accesso push di amministrazione del repository.

`List Issues` supporta filtri opzionali assignee, creator, mentioned user, labels separate da virgole,
timestamp updated-since, sort e direction. `List Pull Requests` supporta controlli state, sort,
direction e per-page.

`Get Repository Issues` e `Get Repository Pull Requests` espongono le stesse API delle rispettive controparti List
con nomi di azione repository espliciti compatibili con n8n.

### Ottenere i metadati del Repository

`Get Repository` memorizza la risposta completa di GitHub in `$github.repository` ed espone anche
`$github.full_name`, `$github.default_branch`, `$github.private` e `$github.url`.

Il payload del repository comunemente include:

- Identità e proprietà: ID, nome, nome completo, descrizione, owner e visibilità
- Stato del repository: private, fork, archived, disabled e default branch
- URL: pagina GitHub, API, clone, SSH e URL Git
- Attività e dimensione: timestamp di creazione, aggiornamento e push, size, stars, watchers, forks, subscribers e open issues
- Funzionalità: issues, projects, wiki, Pages, discussions, topics, language e homepage
- Licenza, impostazioni di merge, permessi del chiamante, impostazioni di sicurezza e metadati fork parent/source quando disponibili

Alcuni campi amministrativi, di permesso, di merge e di sicurezza dipendono dai permessi del repository
della credenziale.

Esempio:

- Owner: `heymrun`
- Repository: `heym`

## Issue

Le operazioni Issue supportano i campi title/body e campi opzionali JSON-array per labels e assignees.

`List Issues` restituisce solo le issue del repository. Le pull request sono escluse; utilizzare `List Pull Requests` per i risultati PR.

```json
["bug", "backend"]
```

```json
["octocat"]
```
### Semantica dei campi di Edit Issue

Per `Edit Issue`, vengono inviati a GitHub esclusivamente i campi impostati in modo esplicito:

- **State** – Selezionare `Don't change`, `Open` o `Closed`. Lasciare non impostato per mantenere lo stato corrente.
- **State Reason** – Impostare facoltativamente `Completed`, `Not Planned`, `Duplicate` o `Reopened`.
- **Title / Body** – Lasciare vuoto per mantenere il valore corrente.
- **Labels / Assignees** – Lasciare il campo vuoto per mantenere il valore corrente. Usare `[]` per cancellare tutte le label o gli assegnatari. Usare un array JSON come `["bug"]` per sostituirli.

`Edit Issue` richiede almeno un campo da modificare in fase di esecuzione. Se si fornisce soltanto un numero di issue, l'esecuzione fallisce con un errore di validazione generato dal layer API di GitHub.

## Lock Issue

`Lock Issue` accetta un **Lock reason** facoltativo. Se fornito, deve essere uno dei valori supportati da GitHub:

- `off-topic`
- `too heated`
- `resolved`
- `spam`

Lasciare il motivo vuoto per bloccare senza un motivo specifico.

## Pull Requests

Create PR richiede:

- Title
- Head branch
- Base branch
- Body facoltativo
- Modalità draft facoltativa

## Pull Request Reviews

Le operazioni di review corrispondono all'API di pull request review di GitHub:

| Operazione | Campi obbligatori | Campi facoltativi |
|-----------|-----------------|-----------------|
| `Create Review` | Numero della pull request, event | Body, commit ID |
| `Get Review` | Numero della pull request, review ID | — |
| `List Reviews` | Numero della pull request | Per page |
| `Update Review` | Numero della pull request, review ID, body | — |

`Create Review` supporta `Approve`, `Request Changes`, `Comment` e `Pending`.
Il body è obbligatorio per `Request Changes` e `Comment`. Quando il Commit ID è vuoto, GitHub
esamina l'ultimo commit della pull request.

## Releases

| Operazione | Campi obbligatori in fase di esecuzione | Comunemente facoltativi |
|-----------|---------------------------|-------------------|
| `Create Release` | Tag name | Release name (title), body, target branch, draft, prerelease |
| `Update Release` | Release ID | Tag name, release name, body, target branch, draft, prerelease |
| `Get Release` / `Delete Release` | Release ID | — |

`Update Release` può impostare esplicitamente `draft` / `prerelease` su `true` o `false`.

## Workflows

Le operazioni sui Workflow supportano:

- Elencare i workflow del repository
- Ottenere un workflow tramite ID numerico o nome del file di workflow
- Abilitare o disabilitare un workflow
- Leggere l'utilizzo fatturabile dei workflow per sistema operativo del runner
- Eseguire il dispatch di un workflow con un ref o branch e un oggetto JSON di input facoltativo

GitHub sta procedendo alla dismissione dell'endpoint `Get Workflow Usage`. I Workflow che utilizzano
questa operazione potrebbero dover migrare quando GitHub rimuoverà l'endpoint.

`Dispatch Workflow` accetta entrambe le forme di risposta di GitHub: la legacy `204 No Content` e la più recente
risposta `200` contenente `workflow_run_id`, `run_url` e `html_url`.

`Dispatch Workflow and Wait` esegue il dispatch del workflow e interroga l'esecuzione fino a quando il suo stato non è
`completed`. Configurare il timeout e l'intervallo di polling in secondi. Heym utilizza
`workflow_run_id` quando GitHub restituisce la risposta più recente `200`. Per la tradizionale risposta `204 No
Content`, Heym individua l'esecuzione `workflow_dispatch` appena creata per il workflow e il ref selezionati, quindi attende tale esecuzione.

## File Contents

`Get File` legge un file del repository tramite l'API contents di GitHub e decodifica il contenuto testuale quando disponibile. I file binari e i contenuti non UTF-8 possono restituire i metadati senza un campo `content` decodificato.

`List Files` restituisce le voci di directory dall'API contents del repository per un determinato percorso di cartella e un ref facoltativo. Lasciare **Directory Path** vuoto per elencare la radice del repository.

`Create or Update File` scrive contenuto testuale in un percorso del repository utilizzando:

- File path
- Commit message
- File content
- Branch facoltativo

`Delete File` rimuove un percorso del repository utilizzando un commit message e un branch facoltativo. Se il file esiste, Heym recupera automaticamente lo SHA corrente prima di eliminarlo.

Se il file esiste già, Heym recupera automaticamente lo SHA corrente prima di aggiornarlo.

## Pagination

`List Issues`, `Get Repository Issues`, `Get User Issues`, `List Pull Requests`,
`Get Repository Pull Requests`, `List Reviews`, `List Releases`, `List Workflows`,
`List Organization Repositories`, `List User Repositories` e `Get User Repositories` supportano
**Per Page** (1–100). Heym richiede una pagina di risultati; non esiste un campo `page` per recuperare
pagine aggiuntive nella stessa operazione.

### Return all pages

Attivi **Return all pages** affinché un'esecuzione segua tutte le pagine, partendo da **Cursor** se impostato. Ogni richiesta chiede 100 elementi, indipendentemente dal valore di **Per Page**. Il nodo si ferma dopo circa 1.000 elementi (o 100 richieste): gli oggetti issue pesano circa 6 KB ciascuno, quindi un limite maggiore produrrebbe output del nodo molto grandi. Se si ferma prima, restituisce quanto ottenuto con `has_more: true` e un `next_cursor` invece di generare un errore, e si può proseguire passando quel cursore all'esecuzione successiva. L'arresto del Workflow o il raggiungimento del suo timeout interrompe il recupero tra una pagina e l'altra.

## Output

La forma esatta dipende dall'operazione selezionata. I campi comuni includono:

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

Sostituire `github` con l'etichetta del proprio nodo.

## Note

- Le etichette e gli assegnatari devono essere array JSON validi quando forniti.
- Gli input di dispatch del Workflow devono essere un oggetto JSON valido quando forniti.
- `Edit Issue` utilizza `state` solo quando lo si imposta esplicitamente; lasciarlo non impostato per mantenere lo stato corrente della issue.
- I permessi dell'API di GitHub dipendono dagli scope del token o dai permessi granulari del repository concessi.

## Correlati

- [Scheda Credenziali](../tabs/credentials-tab.md) – Aggiungere e gestire le credenziali GitHub
- [Integrazioni di terze parti](../reference/integrations.md) – Configurazione delle credenziali GitHub e `base_url` per Enterprise
- [Nodo Agent](./agent-node.md) – Utilizzare le credenziali GitHub con `@modelcontextprotocol/server-github`
- [Tipi di nodo](../reference/node-types.md) – Catalogo completo dei nodi
