# Registrazione di audit

Heym scrive una riga di audit per ogni azione rilevante ai fini della sicurezza: chi l'ha eseguita, su cosa, e se ha avuto successo. Le righe vengono inviate allo standard output del backend tramite il logger `winston.audit`, insieme al log di accesso alle richieste, e possono essere lette dalla scheda **Logs** oppure con `docker logs`.

La registrazione di audit è **sempre attiva**. Non c'è nulla da abilitare e nessuna variabile d'ambiente da impostare.

## Formato della riga

Un'azione produce esattamente una riga autonoma:

```
2026-08-25 14:02:11 INFO [winston.audit] audit action=credential.delete outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="OpenAI Prod" credential_type=openai
```

Ogni riga contiene i seguenti campi:

| Campo | Descrizione |
|-------|-------------|
| `action` | Ciò che è accaduto, nel formato `resource.verb` — si veda la tabella seguente. |
| `outcome` | `success`, `failure` o `denied`. |
| `actor_id` | UUID dell'utente che ha eseguito l'azione. Assente solo quando nessuno era autenticato. |
| `actor_email` | Email di tale utente. In caso di login fallito, si tratta dell'indirizzo tentato, non di un account confermato. |
| `target` | L'oggetto su cui si è agito, nel formato `type:uuid`. |
| `target_name` | Nome leggibile di tale oggetto, racchiuso tra virgolette quando contiene spazi. |

Seguono i campi specifici dell'azione — ad esempio `credential_type`, `imported`, `grantee_email`, `team_name`. I valori che contengono uno spazio, una virgoletta o un `=` vengono racchiusi tra virgolette; i valori più lunghi di 256 caratteri vengono troncati con un marcatore `...(truncated)`.

## Lettura del log

Il logger di audit è figlio del logger delle richieste, pertanto entrambi raggiungono lo stesso flusso rimanendo separabili:

```bash
# Only audit lines, no access-log noise
docker logs heym-backend 2>&1 | grep '\[winston.audit\]'

# Everything one user did
docker logs heym-backend 2>&1 | grep 'actor_email=alex@example.com'

# Failed logins and refused access
docker logs heym-backend 2>&1 | grep -E 'outcome=(failure|denied)'

# Everything that touched one credential
docker logs heym-backend 2>&1 | grep 'target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43'
```

Nell'applicazione, la scheda **Logs** legge lo stesso output del container. È vincolata a `DOCKER_LOGS_ENABLED` e alla allowlist `DOCKER_LOGS_ALLOWED_EMAILS`.

## Cosa viene registrato

Ogni modifica di stato viene registrata. Le letture vengono registrate solo quando la lettura stessa costituisce l'atto sensibile — la visualizzazione della cronologia di esecuzione di un workflow, l'apertura di una credenziale, il download di un file. Le normali letture di elenchi e dettagli non sono sottoposte ad audit; il log di accesso registra già che una richiesta è avvenuta, e sottoporre ad audit ogni `GET` seppellirebbe le righe che contano. L'unica eccezione riguarda le [visualizzazioni di pagina](#page-views), che registrano i percorsi effettuati da un utente autenticato nell'applicazione.

### Autenticazione

| Azione | Note |
|--------|------|
| `auth.register` | `outcome=denied` quando la registrazione è disabilitata o quando l'accesso con password è disattivato (`reason=password_login_disabled`), `failure` quando l'email è già in uso. |
| `auth.login` | `outcome=failure` registra l'indirizzo tentato e se l'email era sconosciuta o la password errata. |
| `auth.logout` | L'attore viene risolto dal cookie di refresh, pertanto un logout senza di esso viene registrato senza identità. |
| `auth.token_refresh` | `outcome=denied` con `reason=refresh_token_replayed_or_revoked` — un segnale di furto di token su cui vale la pena generare avvisi. |
| `auth.password_change` | `outcome=failure` quando la password corrente era errata. |
| `auth.sso_login` | Single sign-on. `outcome=failure` riporta il motivo per cui la risposta del provider è stata rifiutata; `denied` riporta `email_not_verified`, `domain_not_allowed` o `provisioning_disabled`. |
| `sso_settings.update` | Un amministratore ha modificato la configurazione [SSO](./sso.md). Registra `enabled` e `password_login_disabled`, mai il client secret. |
| `sso_settings.test` | Un amministratore ha eseguito il test di connessione SSO. |

### Visualizzazioni di pagina

`page.view` viene registrato ogni volta che un utente connesso apre una pagina nell'applicazione web, con il percorso URL indicato in un campo `path`:

```
2026-10-29 09:14:02 INFO [winston.audit] audit action=page.view outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com path="/?tab=traces"
```

Il percorso corrisponde alla route interna dell'applicazione. Le schede del dashboard ne fanno parte (`/?tab=traces`), così come gli identificatori che indicano l'elemento aperto, come `/workflows/<id>`. Viene conservato solo un breve elenco di parametri di query che identificano la pagina (`tab`, `dashboard`, `board`, `suite`, `workflowId`, `traceId`); tutto il resto nella stringa di query e l'intero frammento vengono ignorati. Le pagine il cui link trasporta un segreto, come `/review/<token>`, vengono registrate con il segnaposto `:token` al posto del segreto.

Poiché il browser segnala il percorso, una riga `page.view` riflette dove l'utente dichiara di essersi recato. Non dimostra che il server abbia restituito quella pagina. Le visite alla pagina di accesso e ai link aperti da disconnessi non vengono registrate, poiché non vi è alcun utente associato.

### Workflows

`workflow.create` · `workflow.update` · `workflow.delete` · `workflow.version_revert` · `workflow.run` · `workflow.history_view` · `workflow.history_clear` · `workflow.share_add` · `workflow.share_remove` · `workflow.team_share_add` · `workflow.team_share_remove` · `workflow.execution_token_create` · `workflow.execution_token_revoke`

`workflow.run` viene scritto quando un'esecuzione viene avviata tramite l'API: il pulsante Esegui dell'editor, l'endpoint di esecuzione con sessione, chiave API o webhook, il portale chat e gli strumenti MCP. Registra chi l'ha avviata, come e con quale esito si è conclusa:

```
[winston.audit] audit action=workflow.run outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=workflow:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="Invoice triage" status=success trigger_source=Canvas execution_id=c1d2e3f4-0a1b-4c2d-8e3f-5a6b7c8d9e0f duration_ms=1235 test_run=true
```

`execution_id` collega la riga all'esecuzione nella cronologia delle esecuzioni. `outcome` è `failure` quando l'esecuzione si è conclusa con `error`, `cancelled` o `timeout`. Un'esecuzione in attesa di revisione umana o trattenuta nella coda di concorrenza genera una riga `success` con `status=pending` o `status=queued`. Una chiamata senza un utente connesso, come un webhook anonimo o un visitatore del portale, è priva di `actor_id` o `actor_email`. Gli input e gli output non vengono mai registrati.

Le esecuzioni avviate da una pianificazione, un nodo trigger, una coda o un evento non costituiscono righe di audit. Vengono eseguite sull'istanza che le ha prese in carico e registrate nella cronologia delle esecuzioni con la relativa origine trigger e l'istanza di esecuzione.

`workflow.history_view` viene registrato quando qualcuno apre la cronologia delle esecuzioni di un workflow. La semplice consultazione che mostra l'ultima esecuzione sul canvas o in un elenco non viene sottoposta ad audit.


`workflow.history_view` registra `owned=false` quando un collaboratore consulta la cronologia di esecuzione di qualcun altro. `workflow.delete` registra `outcome=denied` con `reason=not_owner` quando un collaboratore tenta di eliminare.

### Credenziali

`credential.create` · `credential.update` · `credential.delete` · `credential.detail_view` · `credential.share_add` · `credential.share_remove` · `credential.team_share_add` · `credential.team_share_remove`

`credential.detail_view` è sottoposta ad audit perché l'apertura di una credenziale la decifra. Un tentativo non riuscito registra `outcome=denied`, che è l'aspetto tipico di un tentativo di enumerazione degli ID delle credenziali.
### Altre risorse

| Risorsa | Azioni |
|----------|---------|
| Variabili | `variable.create` · `update` · `delete` · `bulk_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Archivi vettoriali | `vector_store.create` · `update` · `delete` · `clone` · `upload` · `item_delete` · `items_delete_by_source` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Avvisi | `alert.create` · `update` · `delete` · `event_acknowledge` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` · `disable_on_access_revoke` |
| Tabelle dati | `data_table.create` · `update` · `delete` · `clone` · `row_create` · `row_update` · `row_delete` · `rows_clear` · `rows_bulk_create` · `import_csv` · `export_csv` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Dashboard | `dashboard.create` · `update` · `delete` · `widget_create` · `widget_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Board | `board.create` · `update` · `delete` · `column_create` · `column_update` · `column_delete` · `column_empty` · `card_create` · `card_update` · `card_delete` · `card_move` · `card_run` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Drive | `drive.upload` · `download` · `delete` · `delete_all` · `bulk_delete` · `share_create` · `share_revoke` · `team_sharing_update` · `bulk_team_sharing_update` |
| Team | `team.create` · `update` · `delete` · `member_add` · `member_remove` |
| Cartelle | `folder.create` · `update` · `delete` · `workflow_move` |

Le operazioni in blocco vengono registrate una sola volta per richiesta, con un conteggio, non una volta per riga. Un'importazione CSV di 5.000 righe produce una sola riga `data_table.import_csv` contenente `imported`, `rejected` e `total`.

## I segreti non vengono mai registrati

Una riga di audit registra identificatori, nomi e conteggi. Non registra mai il contenuto di una credenziale, il valore di una variabile, una password o un token.

Due meccanismi lo garantiscono. I punti di chiamata sono scritti in modo da passare solo campi sicuri, e l'helper di audit applica una redazione come rete di sicurezza: qualsiasi campo il cui nome contenga `password`, `secret`, `token`, `api_key`, `value`, `authorization`, `cookie` o simili viene sostituito con `***` prima che la riga venga costruita. La redazione eccessiva è intenzionale: una riga poco utile è preferibile a una credenziale divulgata.

Quando un segreto è effettivamente rilevante per il record, viene registrata solo la sua forma. Una condivisione di file registra `password_protected=true`, mai la password.

## Heym Work

Quando si esegue Heym Work insieme a Heym, Work emette righe di audit nello stdout del proprio container nello stesso formato Winston:

```bash
docker logs heym-work 2>&1 | grep '[winston.audit]'
```

Work registra le azioni degli utenti su pagine, bacheche e record:

| Azione | Significato |
|---|---|
| `page.create`, `page.update`, `page.delete` | Modifiche alle pagine e ai layout del dashboard |
| `board.column_create`, `board.column_move`, `board.column_delete` | Modifiche al layout delle colonne Kanban |
| `card.create`, `card.move`, `card.archive`, `card.delete` | Eventi del ciclo di vita delle schede |
| `record.create`, `record.update`, `record.delete` | Mutazioni dei record delle tabelle dati tramite Work |
| `chat.message` | Prompt utente inviato all'assistente di Work |
| `export.csv`, `export.json` | Esportazioni di dati |

Ogni riga contiene gli stessi campi `actor_id`, `actor_email`, `timestamp` e `outcome` delle righe di audit di Heym, consentendo ai raccoglitori di log di analizzare entrambi con una singola pipeline.

## Conservazione

**Le righe di audit esistono solo finché esistono i log del container.** Non vengono scritte nel database. Ricreare il container del backend elimina i relativi log.

Se si necessita di una cronologia di audit che sopravviva a un nuovo deploy, inoltrare lo stdout del container verso una destinazione durevole — un log driver, un collector sidecar o l'aggregazione di log della propria piattaforma — allo stesso modo in cui si procederebbe per qualsiasi altro log di container.

## Per i contributori

Emettere una riga di audit richiede una sola chiamata:

```python
from app.services.audit_log import audit

audit(
    action="credential.delete",
    actor=current_user,
    target_type="credential",
    target_id=credential.id,
    target_name=credential.name,
)
```

L'helper è sincrono, non accede al database e cattura i propri errori, pertanto una chiamata di audit non può fallire né rallentare una richiesta.

Tre regole da rispettare quando se ne aggiunge una:

1. **Denominare l'azione `resource.verb` in snake_case.** `backend/tests/test_audit_log.py` analizza ogni chiamata `audit()` sotto `app/api/` e fa fallire la build in presenza di un nome non conforme, nonché di una risorsa coperta che abbia perso tutti i propri punti di chiamata.

2. **Leggere solo attributi certamente presenti.** Il `try/except` dell'helper protegge il proprio corpo, non le espressioni che gli vengono passate: un `AttributeError` in `target_name=workflow.name` viene sollevato nel punto di chiamata, prima che `audit()` venga eseguito, e interromperà la richiesta. Leggere colonne ORM e variabili locali, non attributi opzionali o a caricamento lazy.

3. **Registrare la cancellazione prima della delete.** Dopo `db.delete(row)` il nome e l'id che si desidera registrare potrebbero non essere più disponibili. Collocare la chiamata al di sopra di essa.
