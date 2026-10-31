# Audit Logging

Heym schrijft een auditregel voor elke beveiligingsrelevante actie: wie deze heeft uitgevoerd, op welk object deze is uitgevoerd en of deze is geslaagd. Regels worden naar de standaarduitvoer van de backend geschreven via de logger `winston.audit`, naast het access log van verzoeken, en kunnen worden gelezen via het tabblad **Logs** of met `docker logs`.

Audit logging staat **altijd aan**. Er is niets in te schakelen en er is geen omgevingsvariabele in te stellen.

## Regelindeling

Eén actie levert exact één op zichzelf staande regel op:

```
2026-08-25 14:02:11 INFO [winston.audit] audit action=credential.delete outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="OpenAI Prod" credential_type=openai
```

Elke regel bevat de volgende velden:

| Veld | Beschrijving |
|-------|-------------|
| `action` | Wat er is gebeurd, als `resource.verb` — zie de onderstaande tabel. |
| `outcome` | `success`, `failure` of `denied`. |
| `actor_id` | UUID van de gebruiker die de actie heeft uitgevoerd. Alleen afwezig wanneer niemand was geauthenticeerd. |
| `actor_email` | E-mailadres van die gebruiker. Bij een mislukte login is dit het adres dat is geprobeerd, niet een bevestigd account. |
| `target` | Het object waarop is gehandeld, als `type:uuid`. |
| `target_name` | Leesbare naam van dat object, tussen aanhalingstekens wanneer deze spaties bevat. |

Daarna volgen actiespecifieke velden — bijvoorbeeld `credential_type`, `imported`, `grantee_email`, `team_name`. Waarden die een spatie, aanhalingsteken of `=` bevatten, worden tussen aanhalingstekens geplaatst; waarden langer dan 256 tekens worden afgekapt met een `...(truncated)`-markering.

## Het log lezen

De auditlogger is een child van de requestlogger, zodat beide dezelfde stream bereiken maar wel te onderscheiden blijven:

```bash
# Alleen auditregels, zonder ruis van het access log
docker logs heym-backend 2>&1 | grep '\[winston.audit\]'

# Alles wat één gebruiker heeft gedaan
docker logs heym-backend 2>&1 | grep 'actor_email=alex@example.com'

# Mislukte logins en geweigerde toegang
docker logs heym-backend 2>&1 | grep -E 'outcome=(failure|denied)'

# Alles wat één referentie heeft aangeraakt
docker logs heym-backend 2>&1 | grep 'target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43'
```

In de app leest het tabblad **Logs** dezelfde containeruitvoer. De toegang hiertoe wordt bepaald door `DOCKER_LOGS_ENABLED` en de allowlist `DOCKER_LOGS_ALLOWED_EMAILS`.

## Wat wordt gelogd

Elke statuswijziging wordt gelogd. Leesacties worden alleen gelogd wanneer het lezen zelf de gevoelige handeling is — het bekijken van de uitvoeringsgeschiedenis van een workflow, het openen van een referentie, het downloaden van een bestand. Gewone lijst- en detailweergaven worden niet geaudit; het access log registreert al dat er een verzoek heeft plaatsgevonden, en het auditen van elke `GET` zou de regels die ertoe doen overschaduwen. De enige uitzondering zijn [paginaweergaven](#page-views), die vastleggen waar een aangemelde gebruiker in de app naartoe is gegaan.

### Authenticatie

| Actie | Opmerkingen |
|--------|-------|
| `auth.register` | `outcome=denied` wanneer registratie is uitgeschakeld of wanneer aanmelden met wachtwoord uit staat (`reason=password_login_disabled`), `failure` wanneer het e-mailadres al in gebruik is. |
| `auth.login` | `outcome=failure` registreert het geprobeerde adres en of het e-mailadres onbekend was of het wachtwoord onjuist. |
| `auth.logout` | De actor wordt bepaald aan de hand van de refresh-cookie, dus een logout zonder cookie wordt gelogd zonder identiteit. |
| `auth.token_refresh` | `outcome=denied` met `reason=refresh_token_replayed_or_revoked` — een signaal van token-diefstal waarop gealarmeerd dient te worden. |
| `auth.password_change` | `outcome=failure` wanneer het huidige wachtwoord onjuist was. |
| `auth.sso_login` | Single sign-on. `outcome=failure` bevat de reden waarom het antwoord van de provider is afgewezen; `denied` bevat `email_not_verified`, `domain_not_allowed` of `provisioning_disabled`. |
| `sso_settings.update` | Een beheerder heeft de [SSO](./sso.md)-configuratie gewijzigd. Registreert `enabled` en `password_login_disabled`, nooit het client secret. |
| `sso_settings.test` | Een beheerder heeft de SSO-verbindingstest uitgevoerd. |

### Paginaweergaven

`page.view` wordt weggeschreven telkens wanneer een aangemelde gebruiker een pagina in de web-app opent, met het URL-pad in een `path`-veld:

```
2026-10-29 09:14:02 INFO [winston.audit] audit action=page.view outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com path="/?tab=traces"
```

Het pad is de route binnen de app. Dashboard-tabbladen maken er deel van uit (`/?tab=traces`), evenals de id's die aangeven wat er geopend is, zoals `/workflows/<id>`. Slechts een korte lijst met queryparameters die de pagina identificeren wordt bewaard (`tab`, `dashboard`, `board`, `suite`, `workflowId`, `traceId`); al het overige in de querytekenreeks en het volledige fragment worden genegeerd. Pagina's waarvan de link een geheim bevat, zoals `/review/<token>`, worden gelogd met de tijdelijke aanduiding `:token` in plaats van het geheim.

De browser rapporteert het pad, dus een `page.view`-regel toont waar een gebruiker zegt te zijn geweest. Het bewijst niet dat de server die pagina heeft geretourneerd. Bezoeken aan de aanmeldpagina en aan koppelingen die zijn geopend terwijl men was afgemeld, worden niet geregistreerd, omdat er geen gebruiker aan is gekoppeld.

### Workflows

`workflow.create` · `workflow.update` · `workflow.delete` · `workflow.version_revert` · `workflow.run` · `workflow.history_view` · `workflow.history_clear` · `workflow.share_add` · `workflow.share_remove` · `workflow.team_share_add` · `workflow.team_share_remove` · `workflow.execution_token_create` · `workflow.execution_token_revoke`

`workflow.run` wordt geschreven wanneer een uitvoering wordt gestart via de API: de knop Uitvoeren van de editor, het execute-endpoint met een sessie, API-sleutel of webhook, het chatportaal en MCP-tools. Het registreert wie de uitvoering startte, hoe, en hoe deze eindigde:

```
[winston.audit] audit action=workflow.run outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=workflow:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="Invoice triage" status=success trigger_source=Canvas execution_id=c1d2e3f4-0a1b-4c2d-8e3f-5a6b7c8d9e0f duration_ms=1235 test_run=true
```

`execution_id` koppelt de regel aan de uitvoering in de uitvoeringsgeschiedenis. `outcome` is `failure` wanneer de uitvoering eindigde in `error`, `cancelled` of `timeout`. Een uitvoering die wacht op menselijke beoordeling of wordt vastgehouden in de wachtrij voor gelijktijdigheid, is een `success`-regel met `status=pending` of `status=queued`. Een aanroep zonder aangemelde gebruiker, zoals een anonieme webhook of een portaalbezoeker, heeft geen `actor_id` of `actor_email`. Invoer en uitvoer worden nooit weggeschreven.

Uitvoeringen die zijn gestart door een planning, een trigger-knooppunt, een wachtrij of een gebeurtenis, zijn geen auditregels. Ze worden uitgevoerd op de instantie die ze heeft geclaimd en worden geregistreerd in de uitvoeringsgeschiedenis met hun trigger-bron en de uitvoerende instantie.

`workflow.history_view` wordt geschreven wanneer iemand de uitvoeringsgeschiedenis van een workflow opent. De kleine zoekactie die de laatste uitvoering op het canvas of in een lijst toont, wordt niet geauditeerd.


`workflow.history_view` registreert `owned=false` wanneer een collaborator de uitvoeringsgeschiedenis van iemand anders leest. `workflow.delete` registreert `outcome=denied` met `reason=not_owner` wanneer een collaborator probeert te verwijderen.

### Referenties

`credential.create` · `credential.update` · `credential.delete` · `credential.detail_view` · `credential.share_add` · `credential.share_remove` · `credential.team_share_add` · `credential.team_share_remove`

`credential.detail_view` wordt geaudit omdat het openen van een referentie deze ontsleutelt. Een misser logt `outcome=denied`, wat eruitziet als een poging tot enumeratie van credential-id's.
### Overige resources

| Resource | Acties |
|----------|---------|
| Variabelen | `variable.create` · `update` · `delete` · `bulk_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Vectorstores | `vector_store.create` · `update` · `delete` · `clone` · `upload` · `item_delete` · `items_delete_by_source` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Waarschuwingen | `alert.create` · `update` · `delete` · `event_acknowledge` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` · `disable_on_access_revoke` |
| Gegevenstabellen | `data_table.create` · `update` · `delete` · `clone` · `row_create` · `row_update` · `row_delete` · `rows_clear` · `rows_bulk_create` · `import_csv` · `export_csv` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Dashboards | `dashboard.create` · `update` · `delete` · `widget_create` · `widget_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Boards | `board.create` · `update` · `delete` · `column_create` · `column_update` · `column_delete` · `column_empty` · `card_create` · `card_update` · `card_delete` · `card_move` · `card_run` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Drive | `drive.upload` · `download` · `delete` · `delete_all` · `bulk_delete` · `share_create` · `share_revoke` · `team_sharing_update` · `bulk_team_sharing_update` |
| Teams | `team.create` · `update` · `delete` · `member_add` · `member_remove` |
| Folders | `folder.create` · `update` · `delete` · `workflow_move` |

Bulkbewerkingen worden één keer per verzoek gelogd met een aantal, niet één keer per rij. Een CSV-import van 5.000 rijen levert één regel `data_table.import_csv` op met daarin `imported`, `rejected` en `total`.

## Secrets worden nooit gelogd

Een auditregel legt identificaties, namen en aantallen vast. Deze legt nooit de inhoud van een referentie, de waarde van een variabele, een wachtwoord of een token vast.

Twee zaken zorgen hiervoor. Aanroepen zijn zodanig geschreven dat alleen veilige velden worden doorgegeven, en de audit-helper redigeert als vangnet: elk veld waarvan de naam `password`, `secret`, `token`, `api_key`, `value`, `authorization`, `cookie` of iets dergelijks bevat, wordt vervangen door `***` voordat de regel wordt opgebouwd. Overmatige redactie is bewust — een onbruikbare regel is beter dan een gelekt referentie.

Waar een secret daadwerkelijk relevant is voor de registratie, wordt alleen de vorm ervan gelogd. Een bestandsshare registreert `password_protected=true`, nooit het wachtwoord.

## Heym Work

Wanneer u Heym Work naast Heym uitvoert, zendt Work auditregels uit naar de stdout van zijn eigen container in hetzelfde Winston-formaat:

```bash
docker logs heym-work 2>&1 | grep '[winston.audit]'
```

Work logt gebruikersacties op pagina's, borden en records:

| Actie | Betekenis |
|---|---|
| `page.create`, `page.update`, `page.delete` | Wijzigingen aan dashboardpagina's en -indelingen |
| `board.column_create`, `board.column_move`, `board.column_delete` | Wijzigingen in de indeling van Kanban-kolommen |
| `card.create`, `card.move`, `card.archive`, `card.delete` | Levenscyclusgebeurtenissen van kaarten |
| `record.create`, `record.update`, `record.delete` | Mutaties van gegevenstabelrecords via Work |
| `chat.message` | Gebruikersprompt verzonden naar de Work-assistent |
| `export.csv`, `export.json` | Gegevensexports |

Elke regel bevat dezelfde velden `actor_id`, `actor_email`, `timestamp` en `outcome` als de auditregels van Heym, zodat logverzamelaars beide met één pipeline kunnen verwerken.

## Retentie

**Auditregels bestaan alleen zolang de loguitvoer van de container bestaat.** Ze worden niet naar de database geschreven. Het opnieuw aanmaken van de backend-container verwijdert de bijbehorende logs.

Indien u auditgeschiedenis nodig hebt die een redeploy overleeft, verzendt u de stdout van de container naar een duurzame locatie — een log driver, een sidecar collector of de logaggregatie van uw platform — op dezelfde manier als voor elke andere containerlog.

## Voor bijdragers

Het uitsturen van een auditregel vereist één aanroep:

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

De helper is synchroon, raakt geen database aan en slikt zijn eigen fouten in, zodat een audit-aanroep een verzoek niet kan laten mislukken of vertragen.

Drie regels bij het toevoegen van een aanroep:

1. **Noem de actie `resource.verb` in snake_case.** `backend/tests/test_audit_log.py` doorloopt elke `audit()`-aanroep onder `app/api/` en laat de build mislukken bij een naam die niet overeenkomt, en bij een gedekt resource dat al zijn aanroeppunten is kwijtgeraakt.

2. **Lees alleen attributen die zeker aanwezig zijn.** De `try/except` van de helper beschermt zijn eigen body, niet de expressies die u eraan doorgeeft — een `AttributeError` in `target_name=workflow.name` wordt op het aanroeppunt opgeworpen, voordat `audit()` wordt uitgevoerd, en zal het verzoek breken. Lees ORM-kolommen en locals, niet optionele of lazy-loaded attributen.

3. **Log de verwijdering vóór de delete.** Na `db.delete(row)` kunnen de naam en het id die u wilt vastleggen verdwenen zijn. Plaats de aanroep erboven.
