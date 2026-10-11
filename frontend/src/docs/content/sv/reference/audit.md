# Granskningsloggning

Heym skriver en granskningsrad för varje säkerhetsrelevant åtgärd: vem som utförde den, vad den utfördes på och huruvida den lyckades. Raderna skickas till backendens standardutdata via loggern `winston.audit`, tillsammans med åtkomstloggen för förfrågningar, och kan läsas från fliken **Loggar** eller med `docker logs`.

Granskningsloggning är **alltid aktiverad**. Det finns inget att aktivera och ingen miljövariabel att ange.

## Radformat

En åtgärd producerar exakt en fristående rad:

```
2026-08-25 14:02:11 INFO [winston.audit] audit action=credential.delete outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="OpenAI Prod" credential_type=openai
```

Varje rad innehåller följande fält:

| Fält | Beskrivning |
|-------|-------------|
| `action` | Vad som hände, i formen `resource.verb` — se tabellen nedan. |
| `outcome` | `success`, `failure` eller `denied`. |
| `actor_id` | UUID för användaren som utförde åtgärden. Saknas endast när ingen var autentiserad. |
| `actor_email` | E-postadressen för den användaren. Vid en misslyckad inloggning är detta den adress som försöktes, inte ett bekräftat konto. |
| `target` | Objektet som åtgärden riktades mot, i formen `type:uuid`. |
| `target_name` | Det människoläsbara namnet på objektet, citerat när det innehåller mellanslag. |

Därefter följer åtgärdsspecifika fält — till exempel `credential_type`, `imported`, `grantee_email`, `team_name`. Värden som innehåller ett mellanslag, citattecken eller `=` citeras; värden längre än 256 tecken kapas med en markör `...(truncated)`.

## Läsa loggen

Granskningsloggern är ett barn till förfrågningsloggern, så båda når samma ström men förblir separerbara:

```bash
# Endast granskningsrader, utan brus från åtkomstloggen
docker logs heym-backend 2>&1 | grep '\[winston.audit\]'

# Allt en användare gjorde
docker logs heym-backend 2>&1 | grep 'actor_email=alex@example.com'

# Misslyckade inloggningar och nekad åtkomst
docker logs heym-backend 2>&1 | grep -E 'outcome=(failure|denied)'

# Allt som rörde en specifik autentiseringsuppgift
docker logs heym-backend 2>&1 | grep 'target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43'
```

I appen läser fliken **Loggar** samma containerutdata. Den styrs av `DOCKER_LOGS_ENABLED` och allowlistan `DOCKER_LOGS_ALLOWED_EMAILS`.

## Vad som loggas

Varje tillståndsändring loggas. Läsningar loggas endast där läsningen i sig är den känsliga åtgärden — att visa en workflows körningshistorik, att öppna en autentiseringsuppgift, att ladda ned en fil. Vanliga list- och detaljläsningar granskas inte; åtkomstloggen registrerar redan att en förfrågan inträffade, och att granska varje `GET` skulle begrava de rader som spelar roll.

### Autentisering

| Åtgärd | Anmärkningar |
|--------|-------------|
| `auth.register` | `outcome=denied` när registrering är inaktiverad eller när inloggning med lösenord är avstängd (`reason=password_login_disabled`), `failure` när e-postadressen är upptagen. |
| `auth.login` | `outcome=failure` registrerar den försökta adressen och huruvida e-postadressen var okänd eller lösenordet felaktigt. |
| `auth.logout` | Aktören härleds från refresh-cookien, så en utloggning utan en sådan loggas utan identitet. |
| `auth.token_refresh` | `outcome=denied` med `reason=refresh_token_replayed_or_revoked` — en signal om tokenstöld som är värd att larma på. |
| `auth.password_change` | `outcome=failure` när det nuvarande lösenordet var felaktigt. |
| `auth.sso_login` | Single sign-on. `outcome=failure` innehåller orsaken till att leverantörens svar avvisades; `denied` innehåller `email_not_verified`, `domain_not_allowed` eller `provisioning_disabled`. |
| `sso_settings.update` | En administratör ändrade konfigurationen för [SSO](./sso.md). Registrerar `enabled` och `password_login_disabled`, aldrig klienthemligheten. |
| `sso_settings.test` | En administratör körde anslutningstestet för SSO. |

### Workflows

`workflow.create` · `workflow.update` · `workflow.delete` · `workflow.version_revert` · `workflow.history_view` · `workflow.history_clear` · `workflow.share_add` · `workflow.share_remove` · `workflow.team_share_add` · `workflow.team_share_remove` · `workflow.execution_token_create` · `workflow.execution_token_revoke`

`workflow.history_view` registrerar `owned=false` när en medarbetare läser någon annans körningshistorik. `workflow.delete` registrerar `outcome=denied` med `reason=not_owner` när en medarbetare försöker radera.

### Autentiseringsuppgifter

`credential.create` · `credential.update` · `credential.delete` · `credential.detail_view` · `credential.share_add` · `credential.share_remove` · `credential.team_share_add` · `credential.team_share_remove`

`credential.detail_view` granskas eftersom öppnandet av en autentiseringsuppgift dekrypterar den. En träffmiss loggar `outcome=denied`, vilket är hur ett försök till uppräkning av autentiseringsuppgifts-id ser ut.
### Övriga resurser

| Resurs | Åtgärder |
|----------|---------|
| Variabler | `variable.create` · `update` · `delete` · `bulk_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Vektorlager | `vector_store.create` · `update` · `delete` · `clone` · `upload` · `item_delete` · `items_delete_by_source` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Varningar | `alert.create` · `update` · `delete` · `event_acknowledge` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` · `disable_on_access_revoke` |
| Datatabeller | `data_table.create` · `update` · `delete` · `clone` · `row_create` · `row_update` · `row_delete` · `rows_clear` · `rows_bulk_create` · `import_csv` · `export_csv` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Instrumentpaneler | `dashboard.create` · `update` · `delete` · `widget_create` · `widget_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Tavlor | `board.create` · `update` · `delete` · `column_create` · `column_update` · `column_delete` · `column_empty` · `card_create` · `card_update` · `card_delete` · `card_move` · `card_run` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Drive | `drive.upload` · `download` · `delete` · `delete_all` · `bulk_delete` · `share_create` · `share_revoke` · `team_sharing_update` · `bulk_team_sharing_update` |
| Team | `team.create` · `update` · `delete` · `member_add` · `member_remove` |
| Mappar | `folder.create` · `update` · `delete` · `workflow_move` |

Massoperationer loggas en gång per begäran med ett antal, inte en gång per rad. En CSV-import av 5 000 rader producerar en enda `data_table.import_csv`-rad som innehåller `imported`, `rejected` och `total`.

## Hemligheter loggas aldrig

En granskningsrad registrerar identifierare, namn och antal. Den registrerar aldrig innehållet i en autentiseringsuppgift, värdet på en variabel, ett lösenord eller en token.

Två saker upprätthåller detta. Anropsställen skrivs för att endast skicka säkra fält, och granskningshjälparen redigerar som en skyddsåtgärd: alla fält vars namn innehåller `password`, `secret`, `token`, `api_key`, `value`, `authorization`, `cookie` eller liknande ersätts med `***` innan raden byggs. Överdriven redigering är avsiktlig — en icke-informativ rad är bättre än en läckt autentiseringsuppgift.

När en hemlighet är genuint relevant för posten loggas endast dess form. En filresurs registrerar `password_protected=true`, aldrig lösenordet.

## Kvarhållning

**Granskningsrader existerar endast så länge som containerns loggutdata gör det.** De skrivs inte till databasen. Om backend-containern återskapas förkastas dess loggar.

Om granskningshistorik som överlever en omdistribution krävs, skicka containerns stdout någonstans beständigt — en loggdrivrutin, en sidecar-insamlare eller plattformens loggaggregering — på samma sätt som för alla andra containerloggar.

## För bidragsgivare

Att avge en granskningsrad kräver ett anrop:

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

Hjälparen är synkron, rör ingen databas och sväljer sina egna fel, så ett granskningsanrop kan inte misslyckas eller fördröja en begäran.

Tre regler vid tillägg av ett sådant:

1. **Namnge åtgärden `resource.verb` i snake_case.** `backend/tests/test_audit_log.py` går igenom varje `audit()`-anrop under `app/api/` och får bygget att misslyckas vid ett namn som inte matchar, samt vid en täckt resurs som har förlorat alla sina anropsställen.

2. **Läs endast attribut som säkert finns.** Hjälparens `try/except` skyddar sin egen kropp, inte de uttryck som skickas till den — ett `AttributeError` i `target_name=workflow.name` utlöses vid anropsstället, innan `audit()` körs, och kommer att bryta begäran. Läs ORM-kolumner och lokala variabler, inte valfria eller lazy-laddade attribut.

3. **Logga borttagningen före borttagningen.** Efter `db.delete(row)` kan namnet och id:t som ska registreras vara borta. Placera anropet ovanför det.
