# Audit Logging

Heym zapisuje auditný riadok pre každú bezpečnostne relevantnú akciu: kto ju vykonal, čoho sa týkala a či bola úspešná. Riadky smerujú na štandardný výstup backendu prostredníctvom loggera `winston.audit`, popri prístupovom logu požiadaviek, a je možné ich čítať na karte **Logs** alebo pomocou príkazu `docker logs`.

Audit logging je **vždy zapnutý**. Nie je potrebné nič povolovať ani nastavovať žiadnu environment premennú.

## Formát riadku

Jedna akcia vytvára práve jeden samostatný riadok:

```
2026-08-25 14:02:11 INFO [winston.audit] audit action=credential.delete outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="OpenAI Prod" credential_type=openai
```

Každý riadok obsahuje tieto polia:

| Pole | Popis |
|-------|-------------|
| `action` | Čo sa stalo, vo formáte `resource.verb` — pozri tabuľku nižšie. |
| `outcome` | `success`, `failure` alebo `denied`. |
| `actor_id` | UUID používateľa, ktorý akciu vykonal. Chýba len vtedy, ak nebol nikto autentifikovaný. |
| `actor_email` | E-mail tohto používateľa. Pri neúspešnom prihlásení ide o adresu, ktorá bola zadaná, nie o potvrdený účet. |
| `target` | Objekt, na ktorom sa akcia vykonala, vo formáte `type:uuid`. |
| `target_name` | Ľudsky čitateľný názov tohto objektu, v úvodzovkách, ak obsahuje medzery. |

Nasledujú polia špecifické pre danú akciu — napríklad `credential_type`, `imported`, `grantee_email`, `team_name`. Hodnoty obsahujúce medzeru, úvodzovku alebo `=` sú v úvodzovkách; hodnoty dlhšie ako 256 znakov sú skrátené so značkou `...(truncated)`.

## Čítanie logu

Auditný logger je potomkom loggera požiadaviek, takže oba smerujú do rovnakého streamu, pričom zostávajú oddeliteľné:

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

V aplikácii karta **Logs** číta rovnaký výstup kontajnera. Je riadená premennou `DOCKER_LOGS_ENABLED` a allowlistom `DOCKER_LOGS_ALLOWED_EMAILS`.

## Čo sa loguje

Loguje sa každá zmena stavu. Čítania sa logujú len tam, kde je samotné čítanie citlivým úkonom — zobrazenie histórie spustení workflowu, otvorenie prihlasovacích údajov, stiahnutie súboru. Bežné čítania zoznamov a detailov sa neauditujú; prístupový log už zaznamenáva, že požiadavka nastala, a auditovanie každého `GET` by zahltilo riadky, na ktorých záleží.

### Autentifikácia

| Akcia | Poznámky |
|--------|-------|
| `auth.register` | `outcome=denied`, keď je registrácia zakázaná alebo keď je vypnuté prihlasovanie heslom (`reason=password_login_disabled`), `failure`, keď je e-mail už obsadený. |
| `auth.login` | `outcome=failure` zaznamenáva zadanú adresu a to, či bol e-mail neznámy alebo bolo heslo nesprávne. |
| `auth.logout` | Aktér sa zisťuje z refresh cookie, takže odhlásenie bez nej sa loguje bez identity. |
| `auth.token_refresh` | `outcome=denied` s `reason=refresh_token_replayed_or_revoked` — signál krádeže tokenu, na ktorý sa oplatí upozorňovať. |
| `auth.password_change` | `outcome=failure`, keď bolo aktuálne heslo nesprávne. |
| `auth.sso_login` | Single sign-on. `outcome=failure` nesie dôvod, prečo bola odpoveď poskytovateľa zamietnutá; `denied` nesie `email_not_verified`, `domain_not_allowed` alebo `provisioning_disabled`. |
| `sso_settings.update` | Administrátor zmenil konfiguráciu [SSO](./sso.md). Zaznamenáva `enabled` a `password_login_disabled`, nikdy nie client secret. |
| `sso_settings.test` | Administrátor spustil test pripojenia SSO. |

### Workflowy

`workflow.create` · `workflow.update` · `workflow.delete` · `workflow.version_revert` · `workflow.history_view` · `workflow.history_clear` · `workflow.share_add` · `workflow.share_remove` · `workflow.team_share_add` · `workflow.team_share_remove` · `workflow.execution_token_create` · `workflow.execution_token_revoke`

`workflow.history_view` zaznamenáva `owned=false`, keď spolupracovník číta históriu spustení niekoho iného. `workflow.delete` zaznamenáva `outcome=denied` s `reason=not_owner`, keď sa spolupracovník pokúsi o vymazanie.

### Prihlasovacie údaje

`credential.create` · `credential.update` · `credential.delete` · `credential.detail_view` · `credential.share_add` · `credential.share_remove` · `credential.team_share_add` · `credential.team_share_remove`

`credential.detail_view` sa audituje, pretože otvorenie prihlasovacích údajov ich dešifruje. Neúspech sa loguje ako `outcome=denied`, čo je podoba pokusu o enumeráciu ID prihlasovacích údajov.
### Ďalšie zdroje

| Zdroj | Akcie |
|----------|---------|
| Premenné | `variable.create` · `update` · `delete` · `bulk_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Vektorové úložiská | `vector_store.create` · `update` · `delete` · `clone` · `upload` · `item_delete` · `items_delete_by_source` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Upozornenia | `alert.create` · `update` · `delete` · `event_acknowledge` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` · `disable_on_access_revoke` |
| Dátové tabuľky | `data_table.create` · `update` · `delete` · `clone` · `row_create` · `row_update` · `row_delete` · `rows_clear` · `rows_bulk_create` · `import_csv` · `export_csv` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Dashboardy | `dashboard.create` · `update` · `delete` · `widget_create` · `widget_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Nástenky | `board.create` · `update` · `delete` · `column_create` · `column_update` · `column_delete` · `column_empty` · `card_create` · `card_update` · `card_delete` · `card_move` · `card_run` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Disk | `drive.upload` · `download` · `delete` · `delete_all` · `bulk_delete` · `share_create` · `share_revoke` · `team_sharing_update` · `bulk_team_sharing_update` |
| Tímy | `team.create` · `update` · `delete` · `member_add` · `member_remove` |
| Priečinky | `folder.create` · `update` · `delete` · `workflow_move` |

Hromadné operácie sa logujú raz na požiadavku s počtom, nie raz na riadok. Import CSV s 5 000 riadkami vytvorí jeden riadok `data_table.import_csv` obsahujúci `imported`, `rejected` a `total`.

## Tajné údaje sa nikdy nelogujú

Riadok auditu zaznamenáva identifikátory, názvy a počty. Nikdy nezaznamenáva obsah prihlasovacích údajov, hodnotu premennej, heslo ani token.

Vynucujú to dve veci. Miesta volania sú napísané tak, aby odovzdávali iba bezpečné polia, a pomocník auditu vykonáva redakciu ako záchrannú sieť: akékoľvek pole, ktorého názov obsahuje `password`, `secret`, `token`, `api_key`, `value`, `authorization`, `cookie` alebo podobne, sa pred zostavením riadku nahradí znakmi `***`. Nadmerná redakcia je zámerná — neprospešný riadok je lepší ako uniknuté prihlasovacie údaje.

Ak je tajný údaj pre záznam skutočne relevantný, loguje sa iba jeho podoba. Zdieľanie súboru zaznamenáva `password_protected=true`, nikdy nie heslo.

## Uchovávanie

**Riadky auditu existujú iba tak dlho ako výstup logov kontajnera.** Nezapisujú sa do databázy. Opätovné vytvorenie backendového kontajnera zahodí jeho logy.

Ak potrebujete históriu auditu, ktorá prežije opätovné nasadenie, odošlite stdout kontajnera niekam trvalo — do log drivera, zberného sidecaru alebo log agregácie vašej platformy — rovnako, ako by ste to urobili pre akýkoľvek iný log kontajnera.

## Pre prispievateľov

Vytvorenie riadku auditu si vyžaduje jedno volanie:

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

Pomocník je synchronný, nedotýka sa databázy a prehltne svoje vlastné chyby, takže volanie auditu nemôže zlyhať ani spomaliť požiadavku.

Pri pridávaní platia tri pravidlá:

1. **Pomenujte akciu `resource.verb` v snake_case.** `backend/tests/test_audit_log.py` prechádza každé volanie `audit()` pod `app/api/` a zlyhá build pri názve, ktorý nezodpovedá, a pri pokrytom zdroji, ktorý stratil všetky svoje miesta volania.

2. **Čítajte iba atribúty, ktoré sú určite prítomné.** Pomocník `try/except` chráni svoje vlastné telo, nie výrazy, ktoré mu odovzdáte — `AttributeError` v `target_name=workflow.name` sa vyvolá na mieste volania, pred spustením `audit()`, a preruší požiadavku. Čítajte ORM stĺpce a lokálne premenné, nie voliteľné alebo lenivo načítavané atribúty.

3. **Logujte vymazanie pred vymazaním.** Po `db.delete(row)` môže byť názov a id, ktoré chcete zaznamenať, už preč. Umiestnite volanie nad ne.
