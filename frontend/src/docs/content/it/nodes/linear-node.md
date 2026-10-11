# Nodo Linear

Il nodo **Linear** connette i workflow all'API GraphQL di Linear per l'automazione di issue e workspace.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Credenziale | Chiave API personale Linear o OAuth2 |
| Output | `$nodeLabel.*` |

## Credenziale

Creare una credenziale **Linear** nella [Scheda Credenziali](../tabs/credentials-tab.md). Scegliere una
modalità di autenticazione:

**Chiave API personale**

1. In Linear, aprire **Settings → Security & Access → Personal API keys**.
2. Creare una chiave con accesso al workspace che si desidera automatizzare.
3. Incollare la chiave in una nuova credenziale Linear in Heym e utilizzare **Test Connection** per verificarla.

**OAuth2**

1. Creare un'applicazione OAuth Linear.
2. Registrare `{FRONTEND_URL}/api/credentials/linear/oauth/callback` come redirect URI.
3. In Heym, scegliere **OAuth2**, inserire il Client ID e il Client Secret, quindi fare clic su **Connect**.

Le chiavi API personali e i token OAuth agiscono come l'utente che li ha creati o autorizzati.

## Operazioni

| Operazione | Campi obbligatori | Output |
|-----------|-----------------|--------|
| Get Viewer | — | `viewer` |
| List Teams | Limit; After Cursor opzionale | `teams`, `count`, `pageInfo` |
| List Projects | Limit; After Cursor opzionale | `projects`, `count`, `pageInfo` |
| List Issues | Limit; Team ID, Project ID, After Cursor opzionali | `issues`, `count`, `pageInfo` |
| List Workflow States | Team ID | `states`, `count` |
| List Team Members | Team ID, Limit; After Cursor opzionale | `members`, `count`, `pageInfo` |
| Get Issue | Issue ID o identificatore come `ENG-123` | `issue`, `identifier`, `url` |
| Create Issue | Team ID, Title | `issue`, `identifier`, `url` |
| Update Issue | Issue ID o identificatore e almeno un campo modificato | `issue`, `identifier`, `url` |
| Delete Issue | Issue ID o identificatore | `deleted` |
| Add Issue Link | Issue ID o identificatore, Link URL | `link` |
| Create Comment | Issue ID o identificatore, Comment Body | `comment` |
| List Comments | Issue ID o identificatore, Limit; After Cursor opzionale | `comments`, `count`, `pageInfo` |
| Update Comment | Comment ID, Comment Body | `comment` |
| Delete Comment | Comment ID | `deleted`, `entityId` |
| Resolve Comment | Comment ID | `comment` |
| Unresolve Comment | Comment ID | `comment` |

Tutti i campi di testo supportano le [espressioni](../reference/expression-dsl.md).

## Campi delle issue

- **Team ID** e **Project ID** sono UUID Linear. Utilizzare List Teams o List Projects per individuarli.
- **State ID** è l'UUID dello stato del workflow utilizzato durante la creazione o l'aggiornamento di una issue. Utilizzare List Workflow States per individuarlo.
- **Assignee ID** è un UUID utente Linear. Utilizzare List Team Members per individuarlo.
- **Priority** accetta valori da `0` a `4`: nessuna priorità, urgente, alta, normale e bassa.
- Lasciare vuoti i campi di aggiornamento opzionali per preservarne i valori correnti.
- Impostare un campo di aggiornamento su `null` per cancellare description, project, assignee o state.
- **Link URL** aggiunge un link di allegato esterno a una issue.
- **Comment ID** è l'UUID Linear di un commento esistente. Utilizzare List Comments per individuarlo.
- **Parent Comment ID** risponde a un commento Linear esistente durante la creazione di un commento.

## Paginazione

Le operazioni di elenco possono restituire una singola pagina o recuperare automaticamente ogni pagina:

- Lasciare **Return All** disattivato per utilizzare manualmente `Limit` e `After Cursor`.
- Attivare **Return All** per seguire i cursori Linear lato server, fino a 10.000 risultati.

I risultati paginati restituiscono `pageInfo.hasNextPage` e `pageInfo.endCursor`. Passare il cursore
in **After Cursor** all'esecuzione successiva del nodo per recuperare la pagina seguente quando **Return All** è disattivato.

## Esempi

Creare una issue dall'input a monte:

- Operation: `Create Issue`
- Team ID: `team UUID`
- Title: `$input.title`
- Description: `$input.description`
- Priority: `2`

Aggiungere un commento a una issue creata:

- Operation: `Create Comment`
- Issue ID: `$createLinearIssue.issue.id`
- Comment Body: `$input.comment`
- Parent Comment ID: opzionale, quando si risponde a un altro commento

Risolvere un thread di commenti:

- Operation: `Resolve Comment`
- Comment ID: `$listComments.comments[0].id`

Aggiungere un link esterno a una issue:

- Operation: `Add Issue Link`
- Issue ID: `$createLinearIssue.issue.id`
- Link URL: `$input.url`

Paginate attraverso i membri del team:

- Operation: `List Team Members`
- Team ID: `$listTeams.teams[0].id`
- Limit: `50`
- After Cursor: `$listTeamMembers.pageInfo.endCursor` all'esecuzione successiva quando `hasNextPage` è true

Individuare gli ID degli stati del workflow prima di aggiornare una issue:

- Operation: `List Workflow States`
- Team ID: `$listTeams.teams[0].id`
- Quindi utilizzare `$listStates.states[0].id` come **State ID** in **Update Issue**
## Output

Ogni operazione completata con successo imposta:

- `$linear.success`
- `$linear.operation`

Le operazioni di tipo List espongono inoltre `count` e, ove applicabile, `pageInfo`. Le operazioni sugli Issue espongono il payload completo dell'issue Linear e campi di comodo quali `identifier` e `url`.
Le mutazioni sui Comment espongono il payload completo `comment`, ad eccezione di Delete Comment, che espone `deleted` ed `entityId`.

## Correlati

- [Scheda Credenziali](../tabs/credentials-tab.md)
- [Tipi di Nodo](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
