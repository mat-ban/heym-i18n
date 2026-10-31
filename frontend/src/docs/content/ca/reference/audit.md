# Registre d'auditoria

Heym escriu una línia d'auditoria per a cada acció rellevant per a la seguretat: qui l'ha duta a terme, sobre què ha actuat i si ha tingut èxit. Les línies s'envien a la sortida estàndard del backend mitjançant el logger `winston.audit`, juntament amb el registre d'accés de les peticions, i es poden consultar des de la pestanya **Logs** o amb `docker logs`.

El registre d'auditoria està **sempre actiu**. No cal habilitar res ni configurar cap variable d'entorn.

## Format de les línies

Una acció produeix exactament una línia autocontinguda:

```
2026-08-25 14:02:11 INFO [winston.audit] audit action=credential.delete outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="OpenAI Prod" credential_type=openai
```

Cada línia conté aquests camps:

| Camp | Descripció |
|-------|-------------|
| `action` | Què ha passat, amb el format `resource.verb` — vegeu la taula següent. |
| `outcome` | `success`, `failure` o `denied`. |
| `actor_id` | UUID de l'usuari que ha dut a terme l'acció. Només és absent quan no hi havia cap usuari autenticat. |
| `actor_email` | Correu electrònic d'aquest usuari. En un inici de sessió fallit, aquesta és l'adreça que s'ha intentat fer servir, no un compte confirmat. |
| `target` | L'objecte sobre el qual s'ha actuat, amb el format `type:uuid`. |
| `target_name` | Nom llegible d'aquest objecte, entre cometes quan conté espais. |

A continuació hi ha els camps específics de cada acció — per exemple `credential_type`, `imported`, `grantee_email`, `team_name`. Els valors que contenen un espai, una cometa o un `=` es posen entre cometes; els valors de més de 256 caràcters es retallen amb un marcador `...(truncated)`.

## Consulta del registre

El logger d'auditoria és fill del logger de peticions, de manera que tots dos arriben al mateix flux però es poden separar:

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

A l'aplicació, la pestanya **Logs** llegeix la mateixa sortida del contenidor. Està restringida per `DOCKER_LOGS_ENABLED` i la llista d'adreces permeses `DOCKER_LOGS_ALLOWED_EMAILS`.

## Què es registra

Es registra cada canvi d'estat. Les lectures només es registren quan la lectura mateixa és l'acte sensible — consultar l'historial d'execucions d'un workflow, obrir una credencial, baixar un fitxer. Les lectures ordinàries de llistes i de detalls no s'auditen; el registre d'accés ja enregistra que s'ha produït una petició, i auditar cada `GET` enterraria les línies que realment importen. L'única excepció són les [visualitzacions de pàgina](#page-views), que registren per on ha navegat un usuari autenticat a l'aplicació.

### Autenticació

| Acció | Notes |
|--------|-------|
| `auth.register` | `outcome=denied` quan el registre està desactivat o quan l'inici de sessió amb contrasenya està desactivat (`reason=password_login_disabled`), i `failure` quan el correu electrònic ja està en ús. |
| `auth.login` | `outcome=failure` enregistra l'adreça intentada i si el correu era desconegut o la contrasenya era incorrecta. |
| `auth.logout` | L'actor es resol a partir de la cookie de refresc, de manera que un tancament de sessió sense cookie es registra sense identitat. |
| `auth.token_refresh` | `outcome=denied` amb `reason=refresh_token_replayed_or_revoked` — un senyal de robatori de token que val la pena vigilar. |
| `auth.password_change` | `outcome=failure` quan la contrasenya actual era incorrecta. |
| `auth.sso_login` | Inici de sessió únic. `outcome=failure` indica el motiu pel qual s'ha rebutjat la resposta del proveïdor; `denied` indica `email_not_verified`, `domain_not_allowed` o `provisioning_disabled`. |
| `sso_settings.update` | Un administrador ha modificat la configuració d'[SSO](./sso.md). Enregistra `enabled` i `password_login_disabled`, mai el secret del client. |
| `sso_settings.test` | Un administrador ha executat la prova de connexió SSO. |

### Visualitzacions de pàgina

`page.view` es registra cada vegada que un usuari autenticat obre una pàgina a l'aplicació web, amb la ruta d'URL en un camp `path`:

```
2026-10-29 09:14:02 INFO [winston.audit] audit action=page.view outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com path="/?tab=traces"
```

La ruta és la ruta interna de l'aplicació. Les pestanyes del dashboard en formen part (`/?tab=traces`), així com els identificadors que indiquen què hi ha obert, com ara `/workflows/<id>`. Només es conserva una llista breu de paràmetres de consulta que identifiquen la pàgina (`tab`, `dashboard`, `board`, `suite`, `workflowId`, `traceId`); tota la resta a la cadena de consulta i tot el fragment es descarten. Les pàgines l'enllaç de les quals transporta un secret, com ara `/review/<token>`, es registren amb el marcador de posició `:token` en lloc del secret.

Com que el navegador informa de la ruta, una línia `page.view` reflecteix on l'usuari diu haver anat. No demostra que el servidor hagi retornat aquesta pàgina. Les visites a la pàgina d'inici de sessió i als enllaços oberts sense sessió iniciada no es registren, ja que no hi ha cap usuari associat.

### Workflows

`workflow.create` · `workflow.update` · `workflow.delete` · `workflow.version_revert` · `workflow.run` · `workflow.history_view` · `workflow.history_clear` · `workflow.share_add` · `workflow.share_remove` · `workflow.team_share_add` · `workflow.team_share_remove` · `workflow.execution_token_create` · `workflow.execution_token_revoke`

`workflow.run` s'escriu quan s'inicia una execució a través de l'API: el botó Executar de l'editor, l'endpoint d'execució amb una sessió, clau d'API o webhook, el portal de chat i les eines MCP. Registra qui la va iniciar, com i com va acabar:

```
[winston.audit] audit action=workflow.run outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=workflow:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="Invoice triage" status=success trigger_source=Canvas execution_id=c1d2e3f4-0a1b-4c2d-8e3f-5a6b7c8d9e0f duration_ms=1235 test_run=true
```

`execution_id` enllaça la línia amb l'execució a l'Historial d'execucions. `outcome` és `failure` quan l'execució ha acabat en `error`, `cancelled` o `timeout`. Una execució pausada per a revisió humana o mantinguda a la cua de concurrència és una línia `success` amb `status=pending` o `status=queued`. Una crida sense cap usuari autenticat, com ara un webhook anònim o un visitant del portal, no conté `actor_id` ni `actor_email`. Les entrades i sortides no s'escriuen mai.

Les execucions iniciades per una planificació, un node trigger, una cua o un esdeveniment no són línies d'auditoria. S'executen a la instància que les ha reclamat i es registren a l'Historial d'execucions amb el seu origen de trigger i la instància executora.

`workflow.history_view` es registra quan algú obre l'historial d'execucions d'un workflow. La petita consulta que mostra l'última execució al llenç o en una llista no s'audita.


`workflow.history_view` enregistra `owned=false` quan un col·laborador consulta l'historial d'execucions d'una altra persona. `workflow.delete` enregistra `outcome=denied` amb `reason=not_owner` quan un col·laborador intenta eliminar.

### Credencials

`credential.create` · `credential.update` · `credential.delete` · `credential.detail_view` · `credential.share_add` · `credential.share_remove` · `credential.team_share_add` · `credential.team_share_remove`

`credential.detail_view` s'audita perquè obrir una credencial la desxifra. Una mancança enregistra `outcome=denied`, que és exactament l'aspecte que té un intent d'enumeració d'identificadors de credencials.
### Altres recursos

| Recurs | Accions |
|----------|---------|
| Variables | `variable.create` · `update` · `delete` · `bulk_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Magatzems vectorials | `vector_store.create` · `update` · `delete` · `clone` · `upload` · `item_delete` · `items_delete_by_source` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Alertes | `alert.create` · `update` · `delete` · `event_acknowledge` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` · `disable_on_access_revoke` |
| Taules de dades | `data_table.create` · `update` · `delete` · `clone` · `row_create` · `row_update` · `row_delete` · `rows_clear` · `rows_bulk_create` · `import_csv` · `export_csv` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Dashboards | `dashboard.create` · `update` · `delete` · `widget_create` · `widget_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Boards | `board.create` · `update` · `delete` · `column_create` · `column_update` · `column_delete` · `column_empty` · `card_create` · `card_update` · `card_delete` · `card_move` · `card_run` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Drive | `drive.upload` · `download` · `delete` · `delete_all` · `bulk_delete` · `share_create` · `share_revoke` · `team_sharing_update` · `bulk_team_sharing_update` |
| Teams | `team.create` · `update` · `delete` · `member_add` · `member_remove` |
| Folders | `folder.create` · `update` · `delete` · `workflow_move` |

Les operacions massives es registren una vegada per sol·licitud amb un recompte, no una vegada per fila. Una importació CSV de 5.000 files produeix una sola línia `data_table.import_csv` que conté `imported`, `rejected` i `total`.

## Els secrets mai no es registren

Una línia d'auditoria registra identificadors, noms i recomptes. Mai no registra el contingut d'una credencial, el valor d'una variable, una contrasenya ni un token.

Dues coses ho garanteixen. Els punts de crida estan escrits per passar únicament camps segurs, i l'auxiliar d'auditoria redacta com a mesura de salvaguarda: qualsevol camp el nom del qual contingui `password`, `secret`, `token`, `api_key`, `value`, `authorization`, `cookie` o similars es substitueix per `***` abans que es construeixi la línia. La sobreredacció és deliberada — una línia poc útil és millor que una credencial filtrada.

Quan un secret és genuïnament rellevant per al registre, només se'n registra la forma. Una compartició de fitxers registra `password_protected=true`, mai la contrasenya.

## Heym Work

Quan executeu Heym Work juntament amb Heym, Work emet línies d'auditoria a la sortida estàndard del seu propi contenidor en el mateix format Winston:

```bash
docker logs heym-work 2>&1 | grep '[winston.audit]'
```

Work registra les accions dels usuaris en pàgines, taulers i registres:

| Acció | Significat |
|---|---|
| `page.create`, `page.update`, `page.delete` | Canvis a les pàgines i dissenys de dashboard |
| `board.column_create`, `board.column_move`, `board.column_delete` | Canvis de disposició de columnes Kanban |
| `card.create`, `card.move`, `card.archive`, `card.delete` | Esdeveniments del cicle de vida de les targetes |
| `record.create`, `record.update`, `record.delete` | Mutacions de registres de taules de dades a través de Work |
| `chat.message` | Prompt de l'usuari enviat a l'assistent de Work |
| `export.csv`, `export.json` | Exportacions de dades |

Cada línia conté els mateixos camps `actor_id`, `actor_email`, `timestamp` i `outcome` que les línies d'auditoria de Heym, permetent que els recol·lectors de registres puguin analitzar tots dos mitjançant una única canalització.

## Retenció

**Les línies d'auditoria només existeixen mentre ho faci la sortida de log del contenidor.** No s'escriuen a la base de dades. Recrear el contenidor del backend descarta els seus logs.

Si necessiteu un historial d'auditoria que sobrevisqui a un redesplegament, envieu la stdout del contenidor a un lloc durador — un log driver, un col·lector sidecar o l'agregació de logs de la vostra plataforma — de la mateixa manera que ho faríeu per a qualsevol altre log de contenidor.

## Per a col·laboradors

Emetre una línia d'auditoria requereix una sola crida:

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

L'auxiliar és síncron, no toca cap base de dades i engoleix els seus propis errors, de manera que una crida d'auditoria no pot fallar ni alentir una sol·licitud.

Tres regles en afegir-ne una:

1. **Anomeneu l'acció `resource.verb` en snake_case.** `backend/tests/test_audit_log.py` recorre cada crida `audit()` sota `app/api/` i fa fallar la compilació davant d'un nom que no coincideixi, i davant d'un recurs cobert que hagi perdut tots els seus punts de crida.

2. **Llegiu només atributs que siguin certament presents.** El `try/except` de l'auxiliar protegeix el seu propi cos, no les expressions que li passeu — un `AttributeError` a `target_name=workflow.name` es llança al punt de crida, abans que s'executi `audit()`, i trencarà la sol·licitud. Llegiu columnes ORM i variables locals, no atributs opcionals o carregats de manera mandrosa.

3. **Registreu l'eliminació abans de l'eliminació.** Després de `db.delete(row)`, el nom i l'id que voleu enregistrar poden haver desaparegut. Col·loqueu la crida per sobre.
