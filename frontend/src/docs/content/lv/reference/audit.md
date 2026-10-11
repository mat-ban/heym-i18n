# Audita žurnālošana

Heym ieraksta audita rindu katrai ar drošību saistītai darbībai: kas to veica, kam tas tika veikts un vai tā bija veiksmīga. Rindas nonāk backend standarta izvadē, izmantojot `winston.audit` žurnālētāju, līdzās pieprasījumu piekļuves žurnālam, un tās var nolasīt cilnē **Logs** vai ar `docker logs`.

Audita žurnālošana ir **vienmēr ieslēgta**. Nav nekas jāiespējo un nav jāiestata neviens vides mainīgais.

## Rindas formāts

Viena darbība rada tieši vienu pašpietiekamu rindu:

```
2026-08-25 14:02:11 INFO [winston.audit] audit action=credential.delete outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="OpenAI Prod" credential_type=openai
```

Katra rinda satur šādus laukus:

| Lauks | Apraksts |
|-------|-------------|
| `action` | Kas notika, formātā `resource.verb` — skatiet tabulu zemāk. |
| `outcome` | `success`, `failure` vai `denied`. |
| `actor_id` | Darbību veikušā lietotāja UUID. Nav norādīts tikai tad, ja neviens nebija autentificēts. |
| `actor_email` | Šī lietotāja e-pasts. Neveiksmīgas pieteikšanās gadījumā tas ir adrese, kas tika mēģināta, nevis apstiprināts konts. |
| `target` | Objekts, uz kuru darbība attiecas, formātā `type:uuid`. |
| `target_name` | Cilvēkam lasāms šī objekta nosaukums, pēdiņās, ja tas satur atstarpes. |

Tam seko darbībai specifiski lauki — piemēram, `credential_type`, `imported`, `grantee_email`, `team_name`. Vērtības, kas satur atstarpi, pēdiņu vai `=`, tiek iekļautas pēdiņās; vērtības, kas garākas par 256 rakstzīmēm, tiek saīsinātas ar atzīmi `...(truncated)`.

## Žurnāla lasīšana

Audita žurnālētājs ir pieprasījumu žurnālētāja atvasinājums, tāpēc abi nonāk vienā plūsmā, vienlaikus paliekot atdalāmi:

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

Lietotnē cilne **Logs** nolasa to pašu konteinera izvadi. Tā ir ierobežota ar `DOCKER_LOGS_ENABLED` un `DOCKER_LOGS_ALLOWED_EMAILS` atļauto sarakstu.

## Kas tiek žurnālēts

Katra stāvokļa maiņa tiek žurnālēta. Lasīšanas tiek žurnālētas tikai tad, ja pati lasīšana ir sensitīva darbība — workflow izpildes vēstures apskate, akreditācijas datu atvēršana, faila lejupielāde. Parastas saraksta un detaļu lasīšanas netiek auditētas; piekļuves žurnāls jau reģistrē, ka pieprasījums notika, un katra `GET` auditēšana apraktu rindas, kurām ir nozīme.

### Autentifikācija

| Darbība | Piezīmes |
|--------|-------|
| `auth.register` | `outcome=denied`, ja reģistrācija ir atspējota vai ja pieteikšanās ar paroli ir izslēgta (`reason=password_login_disabled`), `failure`, ja e-pasts jau ir aizņemts. |
| `auth.login` | `outcome=failure` reģistrē mēģināto adresi un to, vai e-pasts bija nezināms vai parole bija nepareiza. |
| `auth.logout` | Darbības veicējs tiek noteikts no refresh cookie, tāpēc atteikšanās bez tā tiek žurnālēta bez identitātes. |
| `auth.token_refresh` | `outcome=denied` ar `reason=refresh_token_replayed_or_revoked` — token zādzības signāls, par ko ir vērts izveidot brīdinājumu. |
| `auth.password_change` | `outcome=failure`, ja pašreizējā parole bija nepareiza. |
| `auth.sso_login` | Vienotā pieteikšanās. `outcome=failure` satur iemeslu, kāpēc pakalpojuma sniedzēja atbilde tika noraidīta; `denied` satur `email_not_verified`, `domain_not_allowed` vai `provisioning_disabled`. |
| `sso_settings.update` | Administrators mainīja [SSO](./sso.md) konfigurāciju. Reģistrē `enabled` un `password_login_disabled`, nekad client secret. |
| `sso_settings.test` | Administrators palaida SSO savienojuma testu. |

### Workflows

`workflow.create` · `workflow.update` · `workflow.delete` · `workflow.version_revert` · `workflow.history_view` · `workflow.history_clear` · `workflow.share_add` · `workflow.share_remove` · `workflow.team_share_add` · `workflow.team_share_remove` · `workflow.execution_token_create` · `workflow.execution_token_revoke`

`workflow.history_view` reģistrē `owned=false`, kad līdzautors lasa kāda cita izpildes vēsturi. `workflow.delete` reģistrē `outcome=denied` ar `reason=not_owner`, kad līdzautors mēģina dzēst.

### Akreditācijas dati

`credential.create` · `credential.update` · `credential.delete` · `credential.detail_view` · `credential.share_add` · `credential.share_remove` · `credential.team_share_add` · `credential.team_share_remove`

`credential.detail_view` tiek auditēta, jo akreditācijas datu atvēršana tos atšifrē. Neveiksme reģistrē `outcome=denied`, kas ir tas, kā izskatās akreditācijas datu id uzskaitīšanas mēģinājums.
### Citi resursi

| Resurss | Darbības |
|----------|---------|
| Mainīgie | `variable.create` · `update` · `delete` · `bulk_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Vektoru krātuves | `vector_store.create` · `update` · `delete` · `clone` · `upload` · `item_delete` · `items_delete_by_source` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Brīdinājumi | `alert.create` · `update` · `delete` · `event_acknowledge` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` · `disable_on_access_revoke` |
| Datu tabulas | `data_table.create` · `update` · `delete` · `clone` · `row_create` · `row_update` · `row_delete` · `rows_clear` · `rows_bulk_create` · `import_csv` · `export_csv` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Informācijas paneļi | `dashboard.create` · `update` · `delete` · `widget_create` · `widget_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Board | `board.create` · `update` · `delete` · `column_create` · `column_update` · `column_delete` · `column_empty` · `card_create` · `card_update` · `card_delete` · `card_move` · `card_run` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Drive | `drive.upload` · `download` · `delete` · `delete_all` · `bulk_delete` · `share_create` · `share_revoke` · `team_sharing_update` · `bulk_team_sharing_update` |
| Komandas | `team.create` · `update` · `delete` · `member_add` · `member_remove` |
| Mapes | `folder.create` · `update` · `delete` · `workflow_move` |

Lielapjoma darbības tiek reģistrētas vienu reizi uz pieprasījumu ar skaitu, nevis vienu reizi uz katru rindu. CSV imports ar 5 000 rindām rada vienu `data_table.import_csv` ierakstu, kas satur `imported`, `rejected` un `total`.

## Noslēpumi Nekad Netiek Reģistrēti

Audita ieraksts satur identifikatorus, nosaukumus un skaitļus. Tas nekad nesatur akreditācijas datu saturu, mainīgā vērtību, paroli vai token.

To nodrošina divas lietas. Izsaukumu vietas ir rakstītas tā, lai nodotu tikai drošus laukus, un audita palīgfunkcija veic rediģēšanu kā drošības tīklu: jebkurš lauks, kura nosaukums satur `password`, `secret`, `token`, `api_key`, `value`, `authorization`, `cookie` vai līdzīgu, tiek aizstāts ar `***`, pirms ieraksts tiek izveidots. Pārmērīga rediģēšana ir apzināta — neizsmeļošs ieraksts ir labāks par noplūdušiem akreditācijas datiem.

Ja noslēpums patiešām ir būtisks ierakstam, tiek reģistrēta tikai tā forma. Faila koplietošana reģistrē `password_protected=true`, nekad pašu paroli.

## Uzglabāšanas Ilgums

**Audita ieraksti pastāv tikai tik ilgi, cik konteinera žurnāla izvade.** Tie netiek ierakstīti datubāzē. Backend konteinera atkārtota izveide iznīcina tā žurnālus.

Ja nepieciešama audita vēsture, kas saglabājas pēc atkārtotas izvietošanas, nosūtiet konteinera stdout uz kādu noturīgu vietu — žurnāla draiveri, sidecar kolektoru vai savas platformas žurnālu apkopošanu — tāpat kā jebkuram citam konteinera žurnālam.

## Veidotājiem

Audita ieraksta izveide prasa vienu izsaukumu:

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

Palīgfunkcija ir sinhrona, nepiekļūst datubāzei un pati absorbē savas kļūdas, tāpēc audita izsaukums nevar neizdoties vai palēnināt pieprasījumu.

Trīs noteikumi, pievienojot jaunu:

1. **Nosauciet darbību `resource.verb` formātā snake_case pierakstā.** `backend/tests/test_audit_log.py` pārbauda katru `audit()` izsaukumu zem `app/api/` un neiztur būvējumu, ja nosaukums neatbilst, kā arī tad, ja kāds pārklāts resurss ir zaudējis visus savus izsaukumu punktus.

2. **Lasiet tikai atribūtus, kas noteikti pastāv.** Palīgfunkcijas `try/except` aizsargā tikai tās pašas ķermeni, nevis izteiksmes, ko tai nododat — `AttributeError` izteiksmē `target_name=workflow.name` tiek izraisīts izsaukuma vietā, pirms `audit()` izpildās, un pārtrauks pieprasījumu. Lasiet ORM kolonnas un lokālos mainīgos, nevis neobligātus vai slinki ielādētus atribūtus.

3. **Reģistrējiet dzēšanu pirms dzēšanas.** Pēc `db.delete(row)` nosaukums un id, ko vēlaties ierakstīt, var būt pazuduši. Novietojiet izsaukumu virs tā.
