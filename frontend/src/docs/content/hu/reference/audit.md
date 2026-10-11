# Audit naplózás

A Heym minden biztonsági szempontból releváns művelethez audit sort ír: ki hajtotta végre, min hajtotta végre, és hogy sikeres volt-e. A sorok a backend szabványos kimenetére kerülnek a `winston.audit` loggeren keresztül, a kérések hozzáférési naplója mellett, és a **Logs** fülről vagy a `docker logs` paranccsal olvashatók.

Az audit naplózás **mindig be van kapcsolva**. Nincs mit engedélyezni, és nincs beállítandó környezeti változó.

## Sorformátum

Egy művelet pontosan egy önálló sort eredményez:

```
2026-08-25 14:02:11 INFO [winston.audit] audit action=credential.delete outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="OpenAI Prod" credential_type=openai
```

Minden sor a következő mezőket tartalmazza:

| Mező | Leírás |
|-------|-------------|
| `action` | Mi történt, `resource.verb` formában — lásd az alábbi táblázatot. |
| `outcome` | `success`, `failure` vagy `denied`. |
| `actor_id` | A műveletet végrehajtó felhasználó UUID-ja. Csak akkor hiányzik, ha senki nem volt hitelesítve. |
| `actor_email` | Ezen felhasználó e-mail-címe. Sikertelen bejelentkezés esetén ez a megkísérelt cím, nem egy megerősített fiók. |
| `target` | A művelet tárgya, `type:uuid` formában. |
| `target_name` | A tárgy ember által olvasható neve, idézőjelbe téve, ha szóközt tartalmaz. |

Ezután a műveletspecifikus mezők következnek — például `credential_type`, `imported`, `grantee_email`, `team_name`. A szóközt, idézőjelet vagy `=` karaktert tartalmazó értékek idézőjelbe kerülnek; a 256 karakternél hosszabb értékek `...(truncated)` jelöléssel levágásra kerülnek.

## A napló olvasása

Az audit logger a kéréslogger gyermeke, így mindkettő ugyanabba a streambe kerül, miközben elkülöníthetők maradnak:

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

Az alkalmazásban a **Logs** fül ugyanezt a konténerkimenetet olvassa. A hozzáférést a `DOCKER_LOGS_ENABLED` és a `DOCKER_LOGS_ALLOWED_EMAILS` engedélyezési lista szabályozza.

## Mit naplózunk

Minden állapotváltozás naplózásra kerül. Az olvasási műveletek csak ott kerülnek naplózásra, ahol maga az olvasás a bizalmas művelet — egy workflow futtatási előzményeinek megtekintése, egy hitelesítési adat megnyitása, egy fájl letöltése. A szokásos lista- és részletolvasások nem képezik audit tárgyát; a hozzáférési napló már rögzíti, hogy megtörtént egy kérés, és minden `GET` auditálása elfedné a valóban fontos sorokat.

### Hitelesítés

| Művelet | Megjegyzések |
|--------|-------|
| `auth.register` | `outcome=denied`, ha a regisztráció le van tiltva, vagy ha a jelszavas bejelentkezés ki van kapcsolva (`reason=password_login_disabled`); `failure`, ha az e-mail-cím már foglalt. |
| `auth.login` | `outcome=failure` rögzíti a megkísérelt címet, valamint azt, hogy az e-mail-cím ismeretlen volt-e vagy a jelszó hibás. |
| `auth.logout` | A szereplő a refresh cookie-ból kerül feloldásra, így a cookie nélküli kijelentkezés identitás nélkül kerül naplózásra. |
| `auth.token_refresh` | `outcome=denied` a `reason=refresh_token_replayed_or_revoked` értékkel — ez egy tokenlopásra utaló jelzés, amely riasztást érdemel. |
| `auth.password_change` | `outcome=failure`, ha a jelenlegi jelszó hibás volt. |
| `auth.sso_login` | Egyszeri bejelentkezés. Az `outcome=failure` tartalmazza az okot, amiért a szolgáltató válasza elutasításra került; a `denied` tartalmazza az `email_not_verified`, `domain_not_allowed` vagy `provisioning_disabled` értéket. |
| `sso_settings.update` | Egy adminisztrátor módosította az [SSO](./sso.md) konfigurációt. Rögzíti az `enabled` és `password_login_disabled` értékeket, soha nem a client secretet. |
| `sso_settings.test` | Egy adminisztrátor lefuttatta az SSO kapcsolattesztet. |

### Workflow-k

`workflow.create` · `workflow.update` · `workflow.delete` · `workflow.version_revert` · `workflow.history_view` · `workflow.history_clear` · `workflow.share_add` · `workflow.share_remove` · `workflow.team_share_add` · `workflow.team_share_remove` · `workflow.execution_token_create` · `workflow.execution_token_revoke`

A `workflow.history_view` `owned=false` értéket rögzít, amikor egy munkatárs másvalaki futtatási előzményeit olvassa. A `workflow.delete` `outcome=denied` értéket rögzít a `reason=not_owner` okkal, amikor egy munkatárs megpróbálja törölni.

### Hitelesítési adatok

`credential.create` · `credential.update` · `credential.delete` · `credential.detail_view` · `credential.share_add` · `credential.share_remove` · `credential.team_share_add` · `credential.team_share_remove`

A `credential.detail_view` azért képezi audit tárgyát, mert egy hitelesítési adat megnyitása visszafejti azt. Egy találat hiánya `outcome=denied` értéket naplóz, ami pontosan úgy néz ki, mint egy credential-id felsorolási kísérlet.
### Egyéb erőforrások

| Erőforrás | Műveletek |
|----------|---------|
| Változók | `variable.create` · `update` · `delete` · `bulk_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Vektortárolók | `vector_store.create` · `update` · `delete` · `clone` · `upload` · `item_delete` · `items_delete_by_source` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Riasztások | `alert.create` · `update` · `delete` · `event_acknowledge` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` · `disable_on_access_revoke` |
| Adattáblák | `data_table.create` · `update` · `delete` · `clone` · `row_create` · `row_update` · `row_delete` · `rows_clear` · `rows_bulk_create` · `import_csv` · `export_csv` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Irányítópultok | `dashboard.create` · `update` · `delete` · `widget_create` · `widget_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Táblák | `board.create` · `update` · `delete` · `column_create` · `column_update` · `column_delete` · `column_empty` · `card_create` · `card_update` · `card_delete` · `card_move` · `card_run` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Drive | `drive.upload` · `download` · `delete` · `delete_all` · `bulk_delete` · `share_create` · `share_revoke` · `team_sharing_update` · `bulk_team_sharing_update` |
| Csapatok | `team.create` · `update` · `delete` · `member_add` · `member_remove` |
| Mappák | `folder.create` · `update` · `delete` · `workflow_move` |

A tömeges műveletek naplózása kérésenként egyszer történik, egy darabszámmal, nem soronként. Egy 5 000 sort tartalmazó CSV-import egyetlen `data_table.import_csv` sort eredményez, amely az `imported`, `rejected` és `total` értékeket tartalmazza.

## A titkok soha nem kerülnek naplózásra

Egy audit sor azonosítókat, neveket és darabszámokat rögzít. Soha nem rögzíti egy hitelesítési adat tartalmát, egy változó értékét, egy jelszót vagy egy tokent.

Ezt két dolog kényszeríti ki. A hívási pontok úgy vannak megírva, hogy csak biztonságos mezőket adjanak át, az audit segédfüggvény pedig végső védőhálóként redaktál: minden olyan mező, amelynek neve tartalmazza a `password`, `secret`, `token`, `api_key`, `value`, `authorization`, `cookie` vagy hasonló karakterláncot, a sor összeállítása előtt `***`-ra cserélődik. A túlzott redaktálás szándékos — egy használhatatlan sor jobb, mint egy kiszivárgott hitelesítési adat.

Ahol egy titok valóban releváns a rekord szempontjából, csak annak alakja kerül naplózásra. Egy fájlmegosztás `password_protected=true` értéket rögzít, soha nem a jelszót.

## Megőrzés

**Az audit sorok csak addig léteznek, ameddig a konténer naplókimenete.** Nem kerülnek az adatbázisba. A backend konténer újralétrehozása elveti annak naplóit.

Ha olyan audit előzményekre van szüksége, amely túléli az újratelepítést, továbbítsa a konténer stdout kimenetét valahová tartósan — egy log driverbe, egy sidecar gyűjtőbe vagy a platformja log aggregációjába — ugyanúgy, ahogy bármely más konténer naplója esetében tenne.

## Közreműködőknek

Egy audit sor kibocsátása egyetlen hívást igényel:

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

A segédfüggvény szinkron, nem nyúl adatbázishoz, és elnyeli a saját hibáit, így egy audit hívás nem tud meghiúsulni vagy lelassítani egy kérést.

Három szabály egy új hívás hozzáadásakor:

1. **Nevezze el a műveletet `resource.verb` formában, snake_case írásmóddal.** A `backend/tests/test_audit_log.py` bejárja az `app/api/` alatti összes `audit()` hívást, és megbuktatja a buildet, ha egy név nem illeszkedik, valamint ha egy lefedett erőforrás elveszítette az összes hívási pontját.

2. **Csak olyan attribútumokat olvasson, amelyek biztosan jelen vannak.** A segédfüggvény `try/except` blokkja a saját törzsét védi, nem az Ön által átadott kifejezéseket — egy `AttributeError` a `target_name=workflow.name` esetében a hívási ponton keletkezik, mielőtt az `audit()` lefutna, és megszakítja a kérést. ORM oszlopokat és lokális változókat olvasson, ne opcionális vagy lustán betöltött attribútumokat.

3. **A törlést a törlés előtt naplózza.** A `db.delete(row)` után a rögzíteni kívánt név és id már eltűnhet. Helyezze a hívást fölé.
