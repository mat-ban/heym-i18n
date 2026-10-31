# Auditi logimine

Heym kirjutab auditi rea iga turvalisusega seotud toimingu kohta: kes selle tegi, millega seda tehti ja kas see õnnestus. Read lähevad backend'i standardväljundisse läbi `winston.audit` loggeri, koos päringu juurdepääsulogiga, ning neid saab lugeda vahekaardilt **Logs** või käsuga `docker logs`.

Auditi logimine on **alati sisse lülitatud**. Midagi ei ole vaja lubada ega ühtegi keskkonnamuutujat seadistada.

## Rea formaat

Üks toiming tekitab täpselt ühe isesisald uva rea:

```
2026-08-25 14:02:11 INFO [winston.audit] audit action=credential.delete outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="OpenAI Prod" credential_type=openai
```

Iga rida sisaldab järgmisi välju:

| Väli | Kirjeldus |
|-------|-------------|
| `action` | Mis juhtus, kujul `resource.verb` — vt allolevat tabelit. |
| `outcome` | `success`, `failure` või `denied`. |
| `actor_id` | Toimingu sooritanud kasutaja UUID. Puudub ainult siis, kui keegi ei olnud autenditud. |
| `actor_email` | Selle kasutaja e-posti aadress. Ebaõnnestunud sisselogimise korral on see aadress, mida prooviti, mitte kinnitatud konto. |
| `target` | Objekt, millega toimetati, kujul `type:uuid`. |
| `target_name` | Selle objekti inimloetav nimi, jutumärkides, kui see sisaldab tühikuid. |

Järgnevad toiminguspetsiifilised väljad — näiteks `credential_type`, `imported`, `grantee_email`, `team_name`. Väärtused, mis sisaldavad tühikut, jutumärki või `=`, on jutumärkides; väärtused, mis on pikemad kui 256 tähemärki, lõigatakse ära märgisega `...(truncated)`.

## Logi lugemine

Auditi logger on päringulogeri tütarlogger, seega mõlemad jõuavad samasse voogu, jäädes samal ajal eristatavaks:

```bash
# Ainult auditi read, ilma juurdepääsulogi mürast
docker logs heym-backend 2>&1 | grep '\[winston.audit\]'

# Kõik, mida üks kasutaja tegi
docker logs heym-backend 2>&1 | grep 'actor_email=alex@example.com'

# Ebaõnnestunud sisselogimised ja keeldutud juurdepääs
docker logs heym-backend 2>&1 | grep -E 'outcome=(failure|denied)'

# Kõik, mis puudutas üht mandaati
docker logs heym-backend 2>&1 | grep 'target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43'
```

Rakenduses loeb vahekaart **Logs** sama konteineri väljundit. Seda reguleerivad `DOCKER_LOGS_ENABLED` ja `DOCKER_LOGS_ALLOWED_EMAILS` lubatud aadresside loend.

## Mida logitakse

Iga olekumuudatus logitakse. Lugemised logitakse ainult seal, kus lugemine ise on tundlik toiming — workflow' käivituste ajaloo vaatamine, mandaadi avamine, faili allalaadimine. Tavalisi loendi- ja üksikasjapäringuid ei auditeerita; juurdepääsulogi juba salvestab, et päring toimus, ning iga `GET`-päringu auditeerimine mataks olulised read. Ainus erand on [lehevaatamised](#page-views), mis registreerivad, kuhu sisselogitud kasutaja rakenduses liikus.

### Autentimine

| Toiming | Märkused |
|--------|-------|
| `auth.register` | `outcome=denied`, kui registreerimine on keelatud või kui parooliga sisselogimine on välja lülitatud (`reason=password_login_disabled`), `failure`, kui e-posti aadress on juba kasutusel. |
| `auth.login` | `outcome=failure` salvestab proovitud aadressi ja selle, kas e-posti aadress oli tundmatu või parool vale. |
| `auth.logout` | Toimija tuvastatakse refresh-küpsise põhjal, seega ilma selleta väljalogimine logitakse ilma identiteedita. |
| `auth.token_refresh` | `outcome=denied` koos `reason=refresh_token_replayed_or_revoked` — tokeni varguse signaal, mille kohta tasub teavitust seadistada. |
| `auth.password_change` | `outcome=failure`, kui praegune parool oli vale. |
| `auth.sso_login` | Ühekordne sisselogimine. `outcome=failure` sisaldab põhjust, miks teenusepakkuja vastus tagasi lükati; `denied` sisaldab `email_not_verified`, `domain_not_allowed` või `provisioning_disabled`. |
| `sso_settings.update` | Administraator muutis [SSO](./sso.md) konfiguratsiooni. Salvestab `enabled` ja `password_login_disabled`, mitte kunagi kliendi saladust. |
| `sso_settings.test` | Administraator käivitas SSO ühenduse testi. |

### Lehevaatamised

`page.view` kirjutatakse iga kord, kui sisselogitud kasutaja avab veebirakenduses lehe, koos URL-i teega väljal `path`:

```
2026-10-29 09:14:02 INFO [winston.audit] audit action=page.view outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com path="/?tab=traces"
```

Tee on rakendusesisene marsruut. Juhtpaneeli vahekaardid on osa sellest (`/?tab=traces`), nagu ka identifikaatorid, mis tähistavad avatud üksust, näiteks `/workflows/<id>`. Säilitatakse ainult lühike loend lehte tuvastavatest päringuparameetritest (`tab`, `dashboard`, `board`, `suite`, `workflowId`, `traceId`); kõik muu päringustringis ja kogu fragment jäetakse kõrvale. Lehed, mille link sisaldab saladust, näiteks `/review/<token>`, logitakse saladuse asemel kohatäitjaga `:token`.

Brauser teatab tee, seega näitab rida `page.view`, kuhu kasutaja enda sõnul liikus. See ei tõesta, et server selle lehe tagastas. Sisselogimislehe külastusi ja väljalogituna avatud linke ei salvestata, kuna nendega pole seotud ühtegi kasutajat.

### Workflow'd

`workflow.create` · `workflow.update` · `workflow.delete` · `workflow.version_revert` · `workflow.run` · `workflow.history_view` · `workflow.history_clear` · `workflow.share_add` · `workflow.share_remove` · `workflow.team_share_add` · `workflow.team_share_remove` · `workflow.execution_token_create` · `workflow.execution_token_revoke`

`workflow.run` kirjutatakse, kui käivitamine algatatakse API kaudu: redaktori nupp Käivita, execute-lõpp-punkt seansi, API-võtme või veebihaagiga (webhook), vestlusportaal ja MCP-tööriistad. See salvestab, kes selle käivitas, kuidas ja kuidas see lõppes:

```
[winston.audit] audit action=workflow.run outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=workflow:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="Invoice triage" status=success trigger_source=Canvas execution_id=c1d2e3f4-0a1b-4c2d-8e3f-5a6b7c8d9e0f duration_ms=1235 test_run=true
```

`execution_id` seob rea käivitamisega Käivitusajaloos. `outcome` on `failure`, kui käivitamine lõppes olekuga `error`, `cancelled` või `timeout`. Inimülevaatuseks peatatud või samaaegsuse järjekorras hoitav käivitus on rida `success` olekuga `status=pending` või `status=queued`. Kõnel ilma sisselogitud kasutajata, näiteks anonüümsel veebihaagil või portaali külastajal, puuduvad `actor_id` ja `actor_email`. Sisendeid ja väljundeid ei kirjutata kunagi.

Ajakava, päästikusõlme, järjekorra või sündmuse käivitatud käivitused ei ole auditiread. Need käivitatakse eksemplaris, mis need vastu võttis, ja salvestatakse Käivitusajalukku koos nende päästikuallika ja käivitanud eksemplariga.

`workflow.history_view` kirjutatakse, kui keegi avab töövoo käivitusajaloo. Väikest päringut, mis kuvab töövoo viimast käivitust lõuendil või loendis, ei auditeerita.


`workflow.history_view` salvestab `owned=false`, kui kaastöötaja loeb kellegi teise käivituste ajalugu. `workflow.delete` salvestab `outcome=denied` koos `reason=not_owner`, kui kaastöötaja üritab kustutada.

### Mandaadid

`credential.create` · `credential.update` · `credential.delete` · `credential.detail_view` · `credential.share_add` · `credential.share_remove` · `credential.team_share_add` · `credential.team_share_remove`

`credential.detail_view` auditeeritakse, sest mandaadi avamine dekrüpteerib selle. Puudumine logitakse kui `outcome=denied`, mis on see, kuidas näeb välja mandaadi ID-de loetlemise katse.
### Muud ressursid

| Ressurss | Toimingud |
|----------|---------|
| Muutujad | `variable.create` · `update` · `delete` · `bulk_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Vektorhoidlad | `vector_store.create` · `update` · `delete` · `clone` · `upload` · `item_delete` · `items_delete_by_source` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Teavitused | `alert.create` · `update` · `delete` · `event_acknowledge` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` · `disable_on_access_revoke` |
| Andmetabelid | `data_table.create` · `update` · `delete` · `clone` · `row_create` · `row_update` · `row_delete` · `rows_clear` · `rows_bulk_create` · `import_csv` · `export_csv` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Töölauad | `dashboard.create` · `update` · `delete` · `widget_create` · `widget_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Tahvlid | `board.create` · `update` · `delete` · `column_create` · `column_update` · `column_delete` · `column_empty` · `card_create` · `card_update` · `card_delete` · `card_move` · `card_run` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Drive | `drive.upload` · `download` · `delete` · `delete_all` · `bulk_delete` · `share_create` · `share_revoke` · `team_sharing_update` · `bulk_team_sharing_update` |
| Tiimid | `team.create` · `update` · `delete` · `member_add` · `member_remove` |
| Kaustad | `folder.create` · `update` · `delete` · `workflow_move` |

Hulgitoimingud logitakse üks kord päringu kohta koos loendusega, mitte iga rea kohta eraldi. 5 000 rea CSV-import tekitab ühe `data_table.import_csv` rea, mis sisaldab välju `imported`, `rejected` ja `total`.

## Saladusi ei logita kunagi

Auditirida salvestab identifikaatorid, nimed ja loendused. See ei salvesta kunagi mandaadi sisu, muutuja väärtust, parooli ega tokenit.

Seda tagavad kaks asjaolu. Kutsekohad on kirjutatud nii, et edastatakse ainult turvalisi välju, ning audit-abifunktsioon redigeerib need tagatiseks: iga väli, mille nimi sisaldab `password`, `secret`, `token`, `api_key`, `value`, `authorization`, `cookie` või muud sarnast, asendatakse enne rea koostamist väärtusega `***`. Üleliigne redigeerimine on tahtlik — kasutu rida on parem kui lekkinud mandaat.

Kui saladus on kirje jaoks tõesti oluline, logitakse ainult selle kuju. Faili jagamine salvestab `password_protected=true`, mitte kunagi parooli ennast.

## Heym Work

Kui käitate Heym Worki koos Heymiga, väljastab Work auditiridu oma konteineri stdout-voogu samas Winstoni vormingus:

```bash
docker logs heym-work 2>&1 | grep '[winston.audit]'
```

Work logib kasutajate tegevusi lehtedel, tahvlitel ja kirjetes:

| Tegevus | Tähendus |
|---|---|
| `page.create`, `page.update`, `page.delete` | Juhtpaneeli lehtede ja paigutuste muudatused |
| `board.column_create`, `board.column_move`, `board.column_delete` | Kanbani veergude paigutuse muudatused |
| `card.create`, `card.move`, `card.archive`, `card.delete` | Kaartide elutsükli sündmused |
| `record.create`, `record.update`, `record.delete` | Andmetabeli kirjete muudatused Worki kaudu |
| `chat.message` | Kasutaja viip, mis saadeti Worki assistendile |
| `export.csv`, `export.json` | Andmete eksport |

Iga rida sisaldab samu välju `actor_id`, `actor_email`, `timestamp` ja `outcome` nagu Heymi auditiread, võimaldades logikogujatel mõlemat töödelda ühe konveieriga.

## Säilitamine

**Auditiread eksisteerivad ainult nii kaua, kui kestab konteineri logiväljund.** Neid ei kirjutata andmebaasi. Backendi konteineri uuesti loomine hävitab selle logid.

Kui vajate auditiajalugu, mis jääb ümberpaigutamisele vastu pidama, saatke konteineri stdout kuhugi püsivasse kohta — logidraiverisse, kõrvalkollektori või oma platvormi logikoondurisse — samamoodi nagu iga teise konteineri logi puhul.

## Kaastöötajatele

Auditirea väljastamiseks piisab ühest kutest:

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

Abifunktsioon on sünkroonne, ei puuduta ühtegi andmebaasi ja neelab oma vead, seega auditikutse ei saa nurjuda ega päringut aeglustada.

Kolme reeglit uue kutse lisamisel:

1. **Nimetage toiming `resource.verb` kujul snake_case'is.** `backend/tests/test_audit_log.py` käib läbi iga `audit()` kutse kaustas `app/api/` ja nurjab buildi, kui nimi ei vasta nõuetele või kui kaetud ressursilt on kadunud kõik selle kutsekohad.

2. **Lugege ainult atribuute, mis on kindlasti olemas.** Abifunktsiooni `try/except` kaitseb ainult selle enda keha, mitte avaldisi, mille te sellele edastate — `AttributeError` avaldises `target_name=workflow.name` tõstetakse kutsekohas enne, kui `audit()` käivitub, ja see rikub päringu. Lugege ORM-veerge ja lokaalseid muutujaid, mitte valikulisi ega laisalt laaditavaid atribuute.

3. **Logige kustutamine enne kustutamist.** Pärast `db.delete(row)` võivad nimi ja id, mida soovite salvestada, olla kadunud. Asetage kutse selle kohale.
