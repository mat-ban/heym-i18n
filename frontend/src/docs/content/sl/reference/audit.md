# Revizija dnevnikov

Heym zapisuje revizijsko vrstico za vsako varnostno pomembno dejanje: kdo je to storil, kaj je storil in ali je uspelo. Vrstice gredo na standardni izhod backend-a preko loggerja `winston.audit`, skupaj z dnevnikom dostopa do zahtevkov, in jih je mogoče prebrati na zavihku **Dnevniki** ali z ukazom `docker logs`.

Revizija dnevnikov je **vedno aktivna**. Ničesar ni potrebno omogočiti in ni okoljske spremenljivke, ki bi jo bilo treba nastaviti.

## Oblika vrstice

Vsako dejanje ustvari natančno eno samostojno vrstico:

```
2026-08-25 14:02:11 INFO [winston.audit] audit action=credential.delete outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="OpenAI Prod" credential_type=openai
```

Vsaka vrstica vsebuje naslednja polja:

| Polje | Opis |
|-------|-------------|
| `action` | Kaj se je zgodilo, kot `resource.verb` — glejte tabelo spodaj. |
| `outcome` | `success`, `failure` ali `denied`. |
| `actor_id` | UUID uporabnika, ki je izvedel dejanje. Odsoten je le, kadar nihče ni bil overjen. |
| `actor_email` | E-pošta tega uporabnika. Pri neuspelem prijavljanju je to naslov, ki je bil poskusno uporabljen, ne potrjen račun. |
| `target` | Objekt, na katerega je bilo dejanje usmerjeno, kot `type:uuid`. |
| `target_name` | Človeško berljivo ime tega objekta, navedeno v narekovajih, kadar vsebuje presledke. |

Sledijo specifična polja za dejanje — na primer `credential_type`, `imported`, `grantee_email`, `team_name`. Vrednosti, ki vsebujejo presledek, narekovaj ali `=`, so navedene v narekovajih; vrednosti daljše od 256 znakov so skrajšane z oznako `...(truncated)`.

## Branje dnevnika

Revizijski logger je otrok loggerja zahtevkov, tako da oba dosežeta isti tok, medtem ko ostajata ločena:

```bash
# Le revizijske vrstice, brez hrupa dnevnika dostopa
docker logs heym-backend 2>&1 | grep '\[winston.audit\]'

# Vse, kar je storil en uporabnik
docker logs heym-backend 2>&1 | grep 'actor_email=alex@example.com'

# Neuspešne prijave in zavrnjeni dostopi
docker logs heym-backend 2>&1 | grep -E 'outcome=(failure|denied)'

# Vse, kar je vplivalo na eno poverilnico
docker logs heym-backend 2>&1 | grep 'target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43'
```

V aplikaciji zavihka **Dnevniki** preberejo isti izhod kontejnerja. Dostop do njih je omejen z `DOCKER_LOGS_ENABLED` in seznamom dovoljenih e-poštnih naslovov `DOCKER_LOGS_ALLOWED_EMAILS`.

## Kaj je zabeleženo

Vsaka sprememba stanja je zabeležena. Branja so zabeležena le, kjer je branje samo po sebi občutljivo dejanje — ogled zgodovine izvajanja workflow-a, odpiranje poverilnice, prenos datoteke. Običajna branja seznamov in podrobnosti niso revizijska; dnevnik dostopa že beleži, da je zahteva potekala, in revizija vsakega `GET` bi zasula vrstice, ki so pomembne.

### Avtentikacija

| Dejanje | Opombe |
|--------|-------|
| `auth.register` | `outcome=denied`, ko je registracija onemogočena ali ko je prijava s geslom izklopljena (`reason=password_login_disabled`), `failure`, ko je e-pošta že zasedena. |
| `auth.login` | `outcome=failure` zabeleži poskusni naslov in ali je bila e-pošta neznana ali je bilo geslo napačno. |
| `auth.logout` | Akter je določen iz osvežitvene piškotke, zato je odjava brez njega zabeležena brez identitete. |
| `auth.token_refresh` | `outcome=denied` z `reason=refresh_token_replayed_or_revoked` — signal kraje žetona, ki ga je vredno opozoriti. |
| `auth.password_change` | `outcome=failure`, ko je bilo trenutno geslo napačno. |
| `auth.sso_login` | Enotna prijava. `outcome=failure` nosi razlog, zakaj je bila zavrnjena odgovor ponudnika; `denied` nosi `email_not_verified`, `domain_not_allowed` ali `provisioning_disabled`. |
| `sso_settings.update` | Administrator je spremenil konfiguracijo [SSO](./sso.md). Zabeleženi so `enabled` in `password_login_disabled`, nikoli pa skrivnost stranke. |
| `sso_settings.test` | Administrator je izvedel test povezave SSO. |

### Workflows

`workflow.create` · `workflow.update` · `workflow.delete` · `workflow.version_revert` · `workflow.history_view` · `workflow.history_clear` · `workflow.share_add` · `workflow.share_remove` · `workflow.team_share_add` · `workflow.team_share_remove` · `workflow.execution_token_create` · `workflow.execution_token_revoke`

`workflow.history_view` zabeleži `owned=false`, ko sodelavec prebere zgodovino izvajanja nekoga drugega. `workflow.delete` zabeleži `outcome=denied` z `reason=not_owner`, ko sodelavec poskuša izbrisati.

### Poverilnice

`credential.create` · `credential.update` · `credential.delete` · `credential.detail_view` · `credential.share_add` · `credential.share_remove` · `credential.team_share_add` · `credential.team_share_remove`

`credential.detail_view` je revizijska, ker odpiranje poverilnice dekripcija. Zgrešen poskus zabeleži `outcome=denied`, kar izgleda kot poskus enumeracije ID-jev poverilnic.
### Druge vire

| Vir | Dejavnosti |
|-----|------------|
| Spremenljivke | `variable.create` · `update` · `delete` · `bulk_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Vektorske shrambe | `vector_store.create` · `update` · `delete` · `clone` · `upload` · `item_delete` · `items_delete_by_source` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Opozorila | `alert.create` · `update` · `delete` · `event_acknowledge` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` · `disable_on_access_revoke` |
| Podatkovne tabele | `data_table.create` · `update` · `delete` · `clone` · `row_create` · `row_update` · `row_delete` · `rows_clear` · `rows_bulk_create` · `import_csv` · `export_csv` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Nadzorne plošče | `dashboard.create` · `update` · `delete` · `widget_create` · `widget_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Table | `board.create` · `update` · `delete` · `column_create` · `column_update` · `column_delete` · `column_empty` · `card_create` · `card_update` · `card_delete` · `card_move` · `card_run` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Disk | `drive.upload` · `download` · `delete` · `delete_all` · `bulk_delete` · `share_create` · `share_revoke` · `team_sharing_update` · `bulk_team_sharing_update` |
| Ekipe | `team.create` · `update` · `delete` · `member_add` · `member_remove` |
| Mape | `folder.create` · `update` · `delete` · `workflow_move` |

Operacije v množici se beležijo enkrat na zahtevo s številom, ne enkrat na vrstico. Uvoz CSV s 5.000 vrsticami ustvari eno vrstico `data_table.import_csv`, ki nosi `imported`, `rejected` in `total`.

## Skrivnosti nikoli niso beležene

Vloga revizije beleži identifikatorje, imena in števila. Nikoli ne beleži vsebine poverilnic, vrednosti spremenljivk, gesla ali žetona.

Dve stvari to zagotavljata. Klicne točke so napisane tako, da prenašajo le varna polja, in revizijski pomočnik redaktira kot zaščito: katero koli polje, katerega ime vsebuje `password`, `secret`, `token`, `api_key`, `value`, `authorization`, `cookie` ali podobno, se pred izgradnjo vrstice nadomesti z `***`. Prekomerna redakcija je namerna — neuporabna vrstica je boljša od razkritja poverilnice.

Kjer je skrivnost resnično pomembna za zapis, se beleži le njen oblikovni vzorec. Deljenje datoteke beleži `password_protected=true`, nikoli pa gesla.

## Hranjenje

**Vloge revizije živijo le tako dolgo, kot je izhodni dnevnik kontejnerja.** Ne zapisujejo se v bazo podatkov. Ponovno ustvarjanje ozadja kontejnerja zavrže njegove dnevnike.

Če potrebujete zgodovino revizij, ki preživi ponovno nameščanje, pošljite stdout kontejnerja nekam trajnemu — dnevniškemu gonilniku, zbiralcu stranskih storitev ali agregaciji dnevnikov vaše platforme — na enak način, kot bi to storili za kateri koli drug dnevnik kontejnerja.

## Za prispevke

Izpustitev vrstice revizije zahteva en klic:

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

Pomočnik je sinhron, ne dotika se baze podatkov in zadrži svoje napake, tako da klic revizije ne more spodleteti ali upočasniti zahteve.

Tri pravila pri dodajanju:

1. **Poimenujte dejanje `resource.verb` v obliki snake_case.** `backend/tests/test_audit_log.py` prehodi vsak `audit()` klic pod `app/api/` in ne uspe pri gradnji, če ime ne ustreza, in pri pokritem viru, ki je izgubila vse svoje klicne točke.

2. **Bodite pozorni le na atribute, ki so zagotovo prisotni.** Pomočnikov `try/except` ščiti njegovo telo, ne izrazov, ki jih posredujete — `AttributeError` v `target_name=workflow.name` se sproži na klicni točki, preden se izvede `audit()`, in bo prekinil zahtevo. Berite ORM stolpce in lokalne spremenljivke, ne opcijskih ali leno naloženih atributov.

3. **Zabeležite brisanje pred brisanjem.** Po `db.delete(row)` morda ime in id, ki ju želite zabeležiti, nista več prisotna. Postavite klic nad to.
