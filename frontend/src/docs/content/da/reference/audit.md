# Audit Logging

Heym registrerer en audit-linje for enhver sikkerhedsrelevant handling: hvem udførte den, hvad den blev udført på, og om den lykkedes. Linjer sendes til backendens standard output via `winston.audit`-loggeren, sammen med request access-loggen, og kan læses fra fanen **Logs** eller med `docker logs`.

Audit logging er **altid aktivt**. Der er intet at aktivere og ingen miljøvariabler at konfigurere.

## Linjeformat

En handling producerer præcis én selvstændig linje:

```
2026-08-25 14:02:11 INFO [winston.audit] audit action=credential.delete outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="OpenAI Prod" credential_type=openai
```

Hver linje indeholder disse felter:

| Felt | Beskrivelse |
|-------|-------------|
| `action` | Hvad der skete, som `resource.verb` — se tabellen nedenfor. |
| `outcome` | `success`, `failure` eller `denied`. |
| `actor_id` | UUID for brugeren, der udførte handlingen. Mangler kun, når ingen var autentificeret. |
| `actor_email` | Email for den pågældende bruger. Ved mislykket login er dette den adresse, der blev forsøgt, ikke en bekræftet konto. |
| `target` | Det objekt, der blev handlet på, som `type:uuid`. |
| `target_name` | Menneskelæsbart navn for det objekt, i anførselstegn, hvis det indeholder mellemrum. |

Handlingsspecifikke felter følger — f.eks. `credential_type`, `imported`, `grantee_email`, `team_name`. Værdier, der indeholder mellemrum, anførselstegn eller `=`, sættes i anførselstegn; værdier længere end 256 tegn afkortes med en `...(truncated)`-markør.

## Læsning af loggen

Audit-loggeren er en underordnet af request-loggeren, så begge når samme strøm, mens de forbliver adskillelige:

```bash
# Kun audit-linjer, ingen access-log-støj
docker logs heym-backend 2>&1 | grep '\[winston.audit\]'

# Alt, hvad en bruger har foretaget
docker logs heym-backend 2>&1 | grep 'actor_email=alex@example.com'

# Mislykkede logins og nægtet adgang
docker logs heym-backend 2>&1 | grep -E 'outcome=(failure|denied)'

# Alt, der har berørt en specifik legitimationsoplysning
docker logs heym-backend 2>&1 | grep 'target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43'
```

I appen læser fanen **Logs** den samme container-output. Adgang styres af `DOCKER_LOGS_ENABLED` og tilladselslisten `DOCKER_LOGS_ALLOWED_EMAILS`.

## Hvad logges

Alle tilstandsændringer logges. Læsninger logges kun, hvor læsningen i sig selv er den følsomme handling — f.eks. visning af en workflows kørselshistorik, åbning af legitimationsoplysninger, download af filer. Almindelige liste- og detaljelæsninger auditeres ikke; access-loggen registrerer allerede, at en request er forekommet, og at auditere hver enkelt `GET` ville begrave de linjer, der betyder noget.

### Autentifikation

| Handling | Noter |
|--------|-------|
| `auth.register` | `outcome=denied` når registrering er deaktiveret eller når password-sign-in er slået fra (`reason=password_login_disabled`), `failure` når email allerede er i brug. |
| `auth.login` | `outcome=failure` registrerer den forsøgte adresse og om email var ukendt eller password forkert. |
| `auth.logout` | Aktøren hentes fra refresh-cookien, så et logout uden denne logges uden identitet. |
| `auth.token_refresh` | `outcome=denied` med `reason=refresh_token_replayed_or_revoked` — et signal om token-tyveri, der bør udløse en advarsel. |
| `auth.password_change` | `outcome=failure` når det nuværende password var forkert. |
| `auth.sso_login` | Single sign-on. `outcome=failure` indeholder årsagen til, at provider-responset blev afvist; `denied` indeholder `email_not_verified`, `domain_not_allowed` eller `provisioning_disabled`. |
| `sso_settings.update` | En administrator har ændret [SSO](./sso.md)-konfigurationen. Registrerer `enabled` og `password_login_disabled`, aldrig klienthemmeligheden. |
| `sso_settings.test` | En administrator har kørt SSO-forbindelsestesten. |

### Workflows

`workflow.create` · `workflow.update` · `workflow.delete` · `workflow.version_revert` · `workflow.history_view` · `workflow.history_clear` · `workflow.share_add` · `workflow.share_remove` · `workflow.team_share_add` · `workflow.team_share_remove` · `workflow.execution_token_create` · `workflow.execution_token_revoke`

`workflow.history_view` registrerer `owned=false`, når en samarbejdspartner læser en andens kørselshistorik. `workflow.delete` registrerer `outcome=denied` med `reason=not_owner`, når en samarbejdspartner forsøger at slette.

### Legitimationsoplysninger

`credential.create` · `credential.update` · `credential.delete` · `credential.detail_view` · `credential.share_add` · `credential.share_remove` · `credential.team_share_add` · `credential.team_share_remove`

`credential.detail_view` auditeres, fordi åbning af legitimationsoplysninger dekrypterer dem. En fejl logges som `outcome=denied`, hvilket er, hvad et forsøg på at opnå legitimations-id'er vil se ud som.
### Andre ressourcer

| Ressource | Handlinger |
|----------|---------|
| Variabler | `variable.create` · `update` · `delete` · `bulk_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Vektorlagre | `vector_store.create` · `update` · `delete` · `clone` · `upload` · `item_delete` · `items_delete_by_source` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Advarsler | `alert.create` · `update` · `delete` · `event_acknowledge` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` · `disable_on_access_revoke` |
| Datatabeller | `data_table.create` · `update` · `delete` · `clone` · `row_create` · `row_update` · `row_delete` · `rows_clear` · `rows_bulk_create` · `import_csv` · `export_csv` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Dashboards | `dashboard.create` · `update` · `delete` · `widget_create` · `widget_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Boards | `board.create` · `update` · `delete` · `column_create` · `column_update` · `column_delete` · `column_empty` · `card_create` · `card_update` · `card_delete` · `card_move` · `card_run` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Drive | `drive.upload` · `download` · `delete` · `delete_all` · `bulk_delete` · `share_create` · `share_revoke` · `team_sharing_update` · `bulk_team_sharing_update` |
| Teams | `team.create` · `update` · `delete` · `member_add` · `member_remove` |
| Mapper | `folder.create` · `update` · `delete` · `workflow_move` |

Bulkoperationer logges én gang pr. anmodning med et antal, ikke én gang pr. række. En CSV-import med 5.000 rækker producerer én `data_table.import_csv`-linje med `imported`, `rejected` og `total`.

## Hemmeligheder logges aldrig

En revisionslinje registrerer identifikatorer, navne og antal. Den registrerer aldrig en legitimationsoplysnings indhold, en variabels værdi, en adgangskode eller et token.

To ting håndhæver dette. Kaldsteder er skrevet til kun at videregive sikre felter, og revisionshjælperen redigerer som en sikkerhedsforanstaltning: ethvert felt, hvis navn indeholder `password`, `secret`, `token`, `api_key`, `value`, `authorization`, `cookie` eller lignende, erstattes med `***` før linjen oprettes. Over-redigering er bevidst - en ubrugelig linje er bedre end en lækket legitimationsoplysning.

Hvor en hemmelighed er virkelig relevant for registreringen, logges kun dens form. En filshare registrerer `password_protected=true`, aldrig adgangskoden.

## Opbevaring

**Revisionslinjer eksisterer kun så længe som containerens logoutput.** De skrives ikke til databasen. Genoprettelse af backend-containeren kasserer dens logs.

Hvis der er behov for revisionshistorik, der overlever en geninstallering, skal containerens stdout sendes til et holdbart sted - en logdriver, en sidecar-samler eller platformens logaggregation - på samme måde som for enhver anden containerlog.

## For bidragsydere

At udsende en revisionslinje kræver ét kald:

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

Hjælperen er synkron, berører ingen database og sluger sine egne fejl, så et revisionskald kan ikke fejle eller bremse en anmodning.

Tre regler ved tilføjelse:

1. **Navngiv handlingen `resource.verb` i snake_case.** `backend/tests/test_audit_log.py` gennemgår hvert `audit()`-kald under `app/api/` og fejler bygget på et navn, der ikke matcher, og på en dækket ressource, der har mistet alle sine kaldsteder.

2. **Læs kun attributter, der helt sikkert er til stede.** Hjælperens `try/except` beskytter dens egen krop, ikke de udtryk, der sendes til den - en `AttributeError` i `target_name=workflow.name` rejses på kaldstedet, før `audit()` kører, og vil afbryde anmodningen. Læs ORM-kolonner og lokale variabler, ikke valgfrie eller dovent indlæste attributter.

3. **Log sletningen før sletningen.** Efter `db.delete(row)` kan det navn og id, der ønskes registreret, være væk. Placer kaldet ovenover.
