# Jurnalizare de Audit

Heym scrie o linie de audit pentru fiecare acțiune relevantă din punct de vedere al securității: cine a efectuat-o, asupra a ce a fost efectuată și dacă a reușit. Liniile ajung la ieșirea standard a backend-ului prin logger-ul `winston.audit`, alături de jurnalul de acces al cererilor, și pot fi citite din fila **Logs** sau cu `docker logs`.

Jurnalizarea de audit este **întotdeauna activă**. Nu există nimic de activat și nicio variabilă de mediu de setat.

## Formatul Liniei

O acțiune produce exact o linie autonomă:

```
2026-08-25 14:02:11 INFO [winston.audit] audit action=credential.delete outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="OpenAI Prod" credential_type=openai
```

Fiecare linie conține următoarele câmpuri:

| Câmp | Descriere |
|-------|-------------|
| `action` | Ce s-a întâmplat, sub forma `resource.verb` — consultați tabelul de mai jos. |
| `outcome` | `success`, `failure` sau `denied`. |
| `actor_id` | UUID-ul utilizatorului care a efectuat acțiunea. Absent doar atunci când nimeni nu era autentificat. |
| `actor_email` | Adresa de email a acelui utilizator. La o autentificare eșuată, aceasta este adresa încercată, nu un cont confirmat. |
| `target` | Obiectul asupra căruia s-a acționat, sub forma `type:uuid`. |
| `target_name` | Numele inteligibil al acelui obiect, între ghilimele atunci când conține spații. |

Urmează câmpuri specifice acțiunii — de exemplu `credential_type`, `imported`, `grantee_email`, `team_name`. Valorile care conțin un spațiu, un ghilimel sau `=` sunt puse între ghilimele; valorile mai lungi de 256 de caractere sunt trunchiate cu un marker `...(truncated)`.

## Citirea Jurnalului

Logger-ul de audit este un copil al logger-ului de cereri, astfel încât ambele ajung în același flux rămânând separabile:

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

În aplicație, fila **Logs** citește aceeași ieșire a containerului. Accesul este restricționat prin `DOCKER_LOGS_ENABLED` și lista de permisiuni `DOCKER_LOGS_ALLOWED_EMAILS`.

## Ce Se Jurnalizează

Fiecare schimbare de stare este jurnalizată. Citirile sunt jurnalizate doar acolo unde citirea este ea însăși actul sensibil — vizualizarea istoricului de execuție al unui workflow, deschiderea unei acreditări, descărcarea unui fișier. Citirile obișnuite de listare și de detaliu nu sunt auditate; jurnalul de acces înregistrează deja că o cerere a avut loc, iar auditarea fiecărui `GET` ar îngropa liniile care contează.

### Autentificare

| Acțiune | Note |
|--------|-------|
| `auth.register` | `outcome=denied` când înregistrarea este dezactivată sau când autentificarea prin parolă este oprită (`reason=password_login_disabled`), `failure` când adresa de email este deja folosită. |
| `auth.login` | `outcome=failure` înregistrează adresa încercată și dacă emailul era necunoscut sau parola era greșită. |
| `auth.logout` | Actorul este rezolvat din cookie-ul de refresh, astfel încât o deconectare fără acesta este jurnalizată fără identitate. |
| `auth.token_refresh` | `outcome=denied` cu `reason=refresh_token_replayed_or_revoked` — un semnal de furt de token care merită alertat. |
| `auth.password_change` | `outcome=failure` când parola curentă a fost greșită. |
| `auth.sso_login` | Autentificare unică. `outcome=failure` conține motivul pentru care răspunsul furnizorului a fost respins; `denied` conține `email_not_verified`, `domain_not_allowed` sau `provisioning_disabled`. |
| `sso_settings.update` | Un administrator a modificat configurația [SSO](./sso.md). Înregistrează `enabled` și `password_login_disabled`, niciodată secretul clientului. |
| `sso_settings.test` | Un administrator a rulat testul de conexiune SSO. |

### Workflow-uri

`workflow.create` · `workflow.update` · `workflow.delete` · `workflow.version_revert` · `workflow.history_view` · `workflow.history_clear` · `workflow.share_add` · `workflow.share_remove` · `workflow.team_share_add` · `workflow.team_share_remove` · `workflow.execution_token_create` · `workflow.execution_token_revoke`

`workflow.history_view` înregistrează `owned=false` când un colaborator citește istoricul de execuție al altcuiva. `workflow.delete` înregistrează `outcome=denied` cu `reason=not_owner` când un colaborator încearcă să șteargă.

### Acreditări

`credential.create` · `credential.update` · `credential.delete` · `credential.detail_view` · `credential.share_add` · `credential.share_remove` · `credential.team_share_add` · `credential.team_share_remove`

`credential.detail_view` este auditat deoarece deschiderea unei acreditări o decriptează. O ratare jurnalizează `outcome=denied`, ceea ce arată ca o încercare de enumerare a ID-urilor de acreditări.
### Alte resurse

| Resursă | Acțiuni |
|----------|---------|
| Variabile | `variable.create` · `update` · `delete` · `bulk_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Depozite vectoriale | `vector_store.create` · `update` · `delete` · `clone` · `upload` · `item_delete` · `items_delete_by_source` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Alerte | `alert.create` · `update` · `delete` · `event_acknowledge` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` · `disable_on_access_revoke` |
| Tabele de date | `data_table.create` · `update` · `delete` · `clone` · `row_create` · `row_update` · `row_delete` · `rows_clear` · `rows_bulk_create` · `import_csv` · `export_csv` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Panouri de control | `dashboard.create` · `update` · `delete` · `widget_create` · `widget_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Panouri | `board.create` · `update` · `delete` · `column_create` · `column_update` · `column_delete` · `column_empty` · `card_create` · `card_update` · `card_delete` · `card_move` · `card_run` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Drive | `drive.upload` · `download` · `delete` · `delete_all` · `bulk_delete` · `share_create` · `share_revoke` · `team_sharing_update` · `bulk_team_sharing_update` |
| Echipe | `team.create` · `update` · `delete` · `member_add` · `member_remove` |
| Dosare | `folder.create` · `update` · `delete` · `workflow_move` |

Operațiunile în bloc sunt înregistrate o singură dată per cerere, împreună cu un număr, nu o dată per rând. Un import CSV de 5.000 de rânduri produce o singură linie `data_table.import_csv` care conține `imported`, `rejected` și `total`.

## Secretele nu sunt niciodată înregistrate

O linie de audit înregistrează identificatori, nume și numărători. Nu înregistrează niciodată conținutul unei acreditări, valoarea unei variabile, o parolă sau un token.

Două mecanisme impun acest lucru. Locurile de apel sunt scrise astfel încât să transmită doar câmpuri sigure, iar funcția auxiliară de audit aplică o redactare ca plasă de siguranță: orice câmp al cărui nume conține `password`, `secret`, `token`, `api_key`, `value`, `authorization`, `cookie` sau similar este înlocuit cu `***` înainte de construirea liniei. Supra-redactarea este intenționată — o linie nefolositoare este mai bună decât o acreditare scursă.

Acolo unde un secret este cu adevărat relevant pentru înregistrare, se loghează doar forma sa. O partajare de fișier înregistrează `password_protected=true`, niciodată parola.

## Retenție

**Liniile de audit există doar atât timp cât există ieșirea de log a containerului.** Ele nu sunt scrise în baza de date. Recrearea containerului de backend elimină logurile acestuia.

Dacă aveți nevoie de un istoric de audit care supraviețuiește unei reimplementări, trimiteți stdout-ul containerului într-un loc durabil — un driver de log, un colector sidecar sau agregarea de loguri a platformei dvs. — la fel cum ați proceda pentru orice alt log de container.

## Pentru contribuitori

Emiterea unei linii de audit necesită un singur apel:

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

Funcția auxiliară este sincronă, nu atinge nicio bază de date și își înghite propriile erori, astfel încât un apel de audit nu poate eșua și nu poate încetini o cerere.

Trei reguli la adăugarea unuia:

1. **Denumiți acțiunea `resource.verb` în snake_case.** `backend/tests/test_audit_log.py` parcurge fiecare apel `audit()` din `app/api/` și eșuează build-ul pentru un nume care nu corespunde și pentru o resursă acoperită care și-a pierdut toate locurile de apel.

2. **Citiți doar atribute care sunt cu certitudine prezente.** Blocul `try/except` al funcției auxiliare protejează propriul corp, nu expresiile pe care i le transmiteți — un `AttributeError` în `target_name=workflow.name` este ridicat la locul de apel, înainte ca `audit()` să ruleze, și va întrerupe cererea. Citiți coloane ORM și variabile locale, nu atribute opționale sau încărcate lazy.

3. **Logați ștergerea înainte de ștergere.** După `db.delete(row)`, numele și id-ul pe care doriți să le înregistrați pot să nu mai existe. Plasați apelul deasupra acesteia.
