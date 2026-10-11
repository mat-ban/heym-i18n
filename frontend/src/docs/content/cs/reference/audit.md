# Audit Logging

Heym zapisuje auditní řádek pro každou bezpečnostně relevantní akci: kdo ji provedl, čeho se týkala a zda byla úspěšná. Řádky jsou odesílány na standardní výstup backendu prostřednictvím loggeru `winston.audit`, společně s přístupovým logem požadavků, a lze je číst na kartě **Logs** nebo pomocí `docker logs`.

Audit logging je **vždy zapnutý**. Není třeba nic povolovat ani nastavovat žádnou proměnnou prostředí.

## Formát řádku

Jedna akce vytváří právě jeden soběstačný řádek:

```
2026-08-25 14:02:11 INFO [winston.audit] audit action=credential.delete outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="OpenAI Prod" credential_type=openai
```

Každý řádek nese tyto položky:

| Položka | Popis |
|-------|-------------|
| `action` | Co se stalo, ve formátu `resource.verb` — viz tabulka níže. |
| `outcome` | `success`, `failure` nebo `denied`. |
| `actor_id` | UUID uživatele, který akci provedl. Chybí pouze tehdy, když nebyl nikdo autentizován. |
| `actor_email` | E-mail tohoto uživatele. Při neúspěšném přihlášení se jedná o adresu, která byla vyzkoušena, nikoli o potvrzený účet. |
| `target` | Objekt, na kterém byla akce provedena, ve formátu `type:uuid`. |
| `target_name` | Lidsky čitelný název tohoto objektu, v uvozovkách, pokud obsahuje mezery. |

Následují položky specifické pro danou akci — například `credential_type`, `imported`, `grantee_email`, `team_name`. Hodnoty obsahující mezeru, uvozovku nebo `=` jsou uvedeny v uvozovkách; hodnoty delší než 256 znaků jsou zkráceny se značkou `...(truncated)`.

## Čtení logu

Auditní logger je potomkem loggeru požadavků, takže oba směřují do stejného streamu, přičemž zůstávají oddělitelné:

```bash
# Pouze auditní řádky, bez šumu přístupového logu
docker logs heym-backend 2>&1 | grep '\[winston.audit\]'

# Vše, co provedl jeden uživatel
docker logs heym-backend 2>&1 | grep 'actor_email=alex@example.com'

# Neúspěšná přihlášení a odmítnutý přístup
docker logs heym-backend 2>&1 | grep -E 'outcome=(failure|denied)'

# Vše, co se dotklo jednoho credentialu
docker logs heym-backend 2>&1 | grep 'target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43'
```

V aplikaci karta **Logs** čte stejný výstup kontejneru. Je řízena proměnnou `DOCKER_LOGS_ENABLED` a allowlistem `DOCKER_LOGS_ALLOWED_EMAILS`.

## Co se loguje

Loguje se každá změna stavu. Čtení se loguje pouze tam, kde je čtení samo o sobě citlivým úkonem — zobrazení historie spuštění workflow, otevření credentialu, stažení souboru. Běžné čtení seznamů a detailů se neaudituje; přístupový log již zaznamenává, že požadavek proběhl, a auditování každého `GET` by zahlcovalo řádky, na kterých záleží.

### Autentizace

| Akce | Poznámky |
|--------|-------|
| `auth.register` | `outcome=denied`, když je registrace zakázána nebo když je vypnuté přihlašování heslem (`reason=password_login_disabled`), `failure`, když je e-mail již obsazen. |
| `auth.login` | `outcome=failure` zaznamenává vyzkoušenou adresu a zda byl e-mail neznámý, nebo bylo heslo nesprávné. |
| `auth.logout` | Aktér je rozpoznán z refresh cookie, takže odhlášení bez ní je zalogováno bez identity. |
| `auth.token_refresh` | `outcome=denied` s `reason=refresh_token_replayed_or_revoked` — signál krádeže tokenu, na který stojí za to nastavit výstrahu. |
| `auth.password_change` | `outcome=failure`, když bylo současné heslo nesprávné. |
| `auth.sso_login` | Single sign-on. `outcome=failure` nese důvod, proč byla odpověď poskytovatele odmítnuta; `denied` nese `email_not_verified`, `domain_not_allowed` nebo `provisioning_disabled`. |
| `sso_settings.update` | Administrátor změnil konfiguraci [SSO](./sso.md). Zaznamenává `enabled` a `password_login_disabled`, nikdy client secret. |
| `sso_settings.test` | Administrátor spustil test připojení SSO. |

### Workflows

`workflow.create` · `workflow.update` · `workflow.delete` · `workflow.version_revert` · `workflow.history_view` · `workflow.history_clear` · `workflow.share_add` · `workflow.share_remove` · `workflow.team_share_add` · `workflow.team_share_remove` · `workflow.execution_token_create` · `workflow.execution_token_revoke`

`workflow.history_view` zaznamenává `owned=false`, když spolupracovník čte historii spuštění někoho jiného. `workflow.delete` zaznamenává `outcome=denied` s `reason=not_owner`, když se spolupracovník pokusí o smazání.

### Credentials

`credential.create` · `credential.update` · `credential.delete` · `credential.detail_view` · `credential.share_add` · `credential.share_remove` · `credential.team_share_add` · `credential.team_share_remove`

`credential.detail_view` se audituje, protože otevření credentialu jej dešifruje. Neúspěch se loguje jako `outcome=denied`, což je podoba pokusu o enumeraci ID credentialů.
### Další zdroje

| Zdroj | Akce |
|----------|---------|
| Proměnné | `variable.create` · `update` · `delete` · `bulk_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Vektorová úložiště | `vector_store.create` · `update` · `delete` · `clone` · `upload` · `item_delete` · `items_delete_by_source` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Výstrahy | `alert.create` · `update` · `delete` · `event_acknowledge` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` · `disable_on_access_revoke` |
| Datové tabulky | `data_table.create` · `update` · `delete` · `clone` · `row_create` · `row_update` · `row_delete` · `rows_clear` · `rows_bulk_create` · `import_csv` · `export_csv` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Dashboardy | `dashboard.create` · `update` · `delete` · `widget_create` · `widget_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Boardy | `board.create` · `update` · `delete` · `column_create` · `column_update` · `column_delete` · `column_empty` · `card_create` · `card_update` · `card_delete` · `card_move` · `card_run` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Drive | `drive.upload` · `download` · `delete` · `delete_all` · `bulk_delete` · `share_create` · `share_revoke` · `team_sharing_update` · `bulk_team_sharing_update` |
| Týmy | `team.create` · `update` · `delete` · `member_add` · `member_remove` |
| Složky | `folder.create` · `update` · `delete` · `workflow_move` |

Hromadné operace se logují jednou na požadavek s počtem, nikoli jednou na řádek. Import CSV o 5 000 řádcích vytvoří jeden záznam `data_table.import_csv` nesoucí hodnoty `imported`, `rejected` a `total`.

## Tajné údaje se nikdy nelogují

Řádek auditu zaznamenává identifikátory, názvy a počty. Nikdy nezaznamenává obsah přihlašovacích údajů, hodnotu proměnné, heslo ani token.

To vynucují dvě věci. Místa volání jsou napsána tak, aby předávala pouze bezpečná pole, a pomocná funkce auditu provádí redakci jako záchrannou síť: jakékoli pole, jehož název obsahuje `password`, `secret`, `token`, `api_key`, `value`, `authorization`, `cookie` nebo podobně, je před sestavením řádku nahrazeno hodnotou `***`. Nadměrná redakce je záměrná — neužitečný řádek je lepší než uniklý přihlašovací údaj.

Pokud je tajný údaj pro záznam skutečně relevantní, loguje se pouze jeho podoba. Sdílení souboru zaznamenává `password_protected=true`, nikdy samotné heslo.

## Uchovávání

**Řádky auditu existují pouze tak dlouho jako logovací výstup kontejneru.** Nezapisují se do databáze. Opětovné vytvoření backendového kontejneru zahodí jeho logy.

Pokud potřebujete historii auditu, která přežije opětovné nasazení, odešlete stdout kontejneru někam trvale — logovací driver, sidecar kolektor nebo agregaci logů vaší platformy — stejně jako byste to udělali pro jakýkoli jiný log kontejneru.

## Pro přispěvatele

Vytvoření řádku auditu vyžaduje jedno volání:

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

Pomocná funkce je synchronní, nedotýká se databáze a pohlcuje vlastní chyby, takže volání auditu nemůže selhat ani zpomalit požadavek.

Při přidávání platí tři pravidla:

1. **Pojmenujte akci jako `resource.verb` ve formátu snake_case.** `backend/tests/test_audit_log.py` prochází každé volání `audit()` pod `app/api/` a zhavaruje build při názvu, který neodpovídá, a při pokrytém zdroji, který ztratil všechna svá místa volání.

2. **Čtěte pouze atributy, které jsou jistě přítomny.** Blok `try/except` pomocné funkce chrání její vlastní tělo, nikoli výrazy, které jí předáváte — `AttributeError` v `target_name=workflow.name` je vyvolán v místě volání, před spuštěním `audit()`, a přeruší požadavek. Čtěte sloupce ORM a lokální proměnné, nikoli volitelné nebo líně načítané atributy.

3. **Logujte smazání před smazáním.** Po `db.delete(row)` může být název a id, které chcete zaznamenat, již pryč. Umístěte volání nad něj.
