# Одитно регистриране

Heym записва одитен ред за всяко действие, свързано със сигурността: кой го е извършил, върху какво го е извършил и дали е било успешно. Редовете се изпращат към стандартния изход на backend-а чрез логъра `winston.audit`, заедно с лога за достъп до заявките, и могат да бъдат прочетени от раздела **Logs** или с `docker logs`.

Одитното регистриране е **винаги включено**. Няма нищо за включване и няма променлива на средата за задаване.

## Формат на реда

Едно действие поражда точно един самостоятелен ред:

```
2026-08-25 14:02:11 INFO [winston.audit] audit action=credential.delete outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="OpenAI Prod" credential_type=openai
```

Всеки ред съдържа следните полета:

| Поле | Описание |
|-------|-------------|
| `action` | Какво се е случило, като `resource.verb` — вижте таблицата по-долу. |
| `outcome` | `success`, `failure` или `denied`. |
| `actor_id` | UUID на потребителя, извършил действието. Отсъства само когато никой не е бил удостоверен. |
| `actor_email` | Имейл на този потребител. При неуспешен вход това е адресът, който е бил опитан, а не потвърден акаунт. |
| `target` | Обектът, върху който е извършено действието, като `type:uuid`. |
| `target_name` | Четимо от човека име на този обект, оградено в кавички, когато съдържа интервали. |

Следват специфични за действието полета — например `credential_type`, `imported`, `grantee_email`, `team_name`. Стойностите, съдържащи интервал, кавичка или `=`, се ограждат в кавички; стойностите, по-дълги от 256 знака, се съкращават с маркер `...(truncated)`.

## Четене на лога

Одитният логър е дъщерен на логъра за заявки, така че и двата достигат до един и същ поток, като остават разделими:

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

В приложението разделът **Logs** чете същия изход на контейнера. Той е обвързан с `DOCKER_LOGS_ENABLED` и allowlist-а `DOCKER_LOGS_ALLOWED_EMAILS`.

## Какво се регистрира

Всяка промяна на състоянието се регистрира. Четенията се регистрират само когато самото четене е чувствителното действие — преглед на историята на изпълненията на workflow, отваряне на удостоверение, изтегляне на файл. Обикновените четения на списъци и детайли не се одитират; логът за достъп вече записва, че е възникнала заявка, а одитирането на всяка `GET` заявка би затрупало редовете, които имат значение. Единственото изключение са [прегледите на страници](#page-views), които записват къде е навигирал вписан потребител в приложението.

### Удостоверяване

| Действие | Бележки |
|--------|-------|
| `auth.register` | `outcome=denied`, когато регистрацията е изключена или когато входът с парола е изключен (`reason=password_login_disabled`), `failure`, когато имейлът е зает. |
| `auth.login` | `outcome=failure` записва опитания адрес и дали имейлът е бил непознат, или паролата е била грешна. |
| `auth.logout` | Извършителят се определя от refresh cookie, така че изход без такова се регистрира без идентичност. |
| `auth.token_refresh` | `outcome=denied` с `reason=refresh_token_replayed_or_revoked` — сигнал за кражба на token, който заслужава известяване. |
| `auth.password_change` | `outcome=failure`, когато текущата парола е била грешна. |
| `auth.sso_login` | Единичен вход. `outcome=failure` носи причината, поради която отговорът на доставчика е бил отхвърлен; `denied` носи `email_not_verified`, `domain_not_allowed` или `provisioning_disabled`. |
| `sso_settings.update` | Администратор е променил конфигурацията за [SSO](./sso.md). Записва `enabled` и `password_login_disabled`, но никога client secret. |
| `sso_settings.test` | Администратор е стартирал теста за SSO връзка. |

### Прегледи на страници

Записът `page.view` се записва всеки път, когато вписан потребител отвори страница в уеб приложението, с URL пътя в поле `path`:

```
2026-10-29 09:14:02 INFO [winston.audit] audit action=page.view outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com path="/?tab=traces"
```

Пътят е вътрешният маршрут в приложението. Разделите на таблото са част от него (`/?tab=traces`), както и идентификаторите, които обозначават отвореното съдържание, като `/workflows/<id>`. Запазва се само кратък списък с параметри на заявката, които идентифицират страницата (`tab`, `dashboard`, `board`, `suite`, `workflowId`, `traceId`); всичко останало в низа на заявката и целият фрагмент се отхвърлят. Страници, чиято връзка съдържа тайна, като `/review/<token>`, се записват със заместителя `:token` вместо тайната.

Браузърът докладва пътя, така че редът `page.view` показва къде потребителят заявява, че е отишъл. Това не доказва, че сървърът е върнал тази страница. Посещенията на страницата за вход и връзките, отворени при отписано състояние, не се записват, тъй като към тях не е прикачен потребител.

### Workflows

`workflow.create` · `workflow.update` · `workflow.delete` · `workflow.version_revert` · `workflow.run` · `workflow.history_view` · `workflow.history_clear` · `workflow.share_add` · `workflow.share_remove` · `workflow.team_share_add` · `workflow.team_share_remove` · `workflow.execution_token_create` · `workflow.execution_token_revoke`

`workflow.run` се записва, когато изпълнение се стартира чрез API: бутонът Изпълнение в редактора, крайната точка execute със сесия, API ключ или уебхук, чат порталът и MCP инструментите. Записва кой го е стартирал, как и как е завършило:

```
[winston.audit] audit action=workflow.run outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=workflow:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="Invoice triage" status=success trigger_source=Canvas execution_id=c1d2e3f4-0a1b-4c2d-8e3f-5a6b7c8d9e0f duration_ms=1235 test_run=true
```

`execution_id` свързва реда с изпълнението в Историята на изпълненията. `outcome` е `failure`, когато изпълнението завърши с `error`, `cancelled` или `timeout`. Изпълнение, поставено на пауза за преглед от човек или задържано в опашката за паралелност, е ред `success` със `status=pending` или `status=queued`. Повикване без вписан потребител, като анонимен уебхук или посетител на портала, няма `actor_id` или `actor_email`. Входовете и изходите никога не се записват.

Изпълнения, стартирани по график, тригер възел, опашка или събитие, не представляват одитни редове. Те се изпълняват на инстанцията, която ги е поела, и се записват в Историята на изпълненията с техния източник на тригер и инстанцията, която ги е изпълнила.

`workflow.history_view` се записва, когато някой отвори историята на изпълненията на работен процес. Краткото извличане, показващо последното изпълнение на работен процес върху платното или в списък, не се одитира.


`workflow.history_view` записва `owned=false`, когато сътрудник чете историята на изпълненията на някой друг. `workflow.delete` записва `outcome=denied` с `reason=not_owner`, когато сътрудник се опита да изтрие.

### Удостоверения

`credential.create` · `credential.update` · `credential.delete` · `credential.detail_view` · `credential.share_add` · `credential.share_remove` · `credential.team_share_add` · `credential.team_share_remove`

`credential.detail_view` се одитира, защото отварянето на удостоверение го декриптира. Неуспешен опит се регистрира с `outcome=denied`, което е как изглежда опит за изброяване на идентификатори на удостоверения.
### Други ресурси

| Ресурс | Действия |
|----------|---------|
| Променливи | `variable.create` · `update` · `delete` · `bulk_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Векторни хранилища | `vector_store.create` · `update` · `delete` · `clone` · `upload` · `item_delete` · `items_delete_by_source` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Известия | `alert.create` · `update` · `delete` · `event_acknowledge` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` · `disable_on_access_revoke` |
| Таблици с данни | `data_table.create` · `update` · `delete` · `clone` · `row_create` · `row_update` · `row_delete` · `rows_clear` · `rows_bulk_create` · `import_csv` · `export_csv` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Табла за управление | `dashboard.create` · `update` · `delete` · `widget_create` · `widget_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Дъски | `board.create` · `update` · `delete` · `column_create` · `column_update` · `column_delete` · `column_empty` · `card_create` · `card_update` · `card_delete` · `card_move` · `card_run` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Drive | `drive.upload` · `download` · `delete` · `delete_all` · `bulk_delete` · `share_create` · `share_revoke` · `team_sharing_update` · `bulk_team_sharing_update` |
| Екипи | `team.create` · `update` · `delete` · `member_add` · `member_remove` |
| Папки | `folder.create` · `update` · `delete` · `workflow_move` |

Груповите операции се записват веднъж на заявка с брой, а не веднъж на ред. Импортирането на CSV с 5 000 реда създава един ред `data_table.import_csv`, съдържащ `imported`, `rejected` и `total`.

## Тайните никога не се записват в логовете

Редът в одита записва идентификатори, имена и брой. Той никога не записва съдържанието на удостоверение, стойността на променлива, парола или token.

Това се гарантира от две неща. Мястата за извикване са написани така, че да подават само безопасни полета, а помощната функция за одит извършва редакция като допълнителна защита: всяко поле, чието име съдържа `password`, `secret`, `token`, `api_key`, `value`, `authorization`, `cookie` или подобно, се заменя с `***`, преди редът да бъде изграден. Прекомерната редакция е умишлена — един неполезен ред е по-добър от изтекло удостоверение.

Когато дадена тайна е наистина от значение за записа, се записва само нейната форма. Споделянето на файл записва `password_protected=true`, но никога паролата.

## Heym Work

Когато изпълнявате Heym Work заедно с Heym, Work извежда одитни редове към stdout на своя собствен контейнер в същия формат на Winston:

```bash
docker logs heym-work 2>&1 | grep '[winston.audit]'
```

Work записва действията на потребителите върху страници, табла и записи:

| Действие | Значение |
|---|---|
| `page.create`, `page.update`, `page.delete` | Промени по страниците и оформленията на таблото |
| `board.column_create`, `board.column_move`, `board.column_delete` | Промени в оформлението на колоните на Kanban |
| `card.create`, `card.move`, `card.archive`, `card.delete` | Събития от жизнения цикъл на картите |
| `record.create`, `record.update`, `record.delete` | Промени в записите на таблицата с данни чрез Work |
| `chat.message` | Потребителски промпт, изпратен до асистента на Work |
| `export.csv`, `export.json` | Експорт на данни |

Всеки ред съдържа същите полета `actor_id`, `actor_email`, `timestamp` и `outcome` като одитните редове на Heym, което позволява на колекторите на логове да анализират и двете чрез един общ конвейер.

## Съхранение

**Редовете в одита съществуват само толкова дълго, колкото съществува изходът от логовете на контейнера.** Те не се записват в базата данни. Пре-създаването на backend контейнера изтрива неговите логове.

Ако се нуждаете от история на одита, която да преживее повторно внедряване, изпращайте stdout на контейнера някъде, където се съхранява трайно — log driver, sidecar колектор или агрегация на логове на Вашата платформа — по същия начин, както бихте направили за всеки друг лог на контейнер.

## За сътрудници

Излъчването на ред в одита изисква едно извикване:

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

Помощната функция е синхронна, не докосва база данни и поглъща собствените си грешки, така че извикване на одит не може да се провали или да забави заявка.

Три правила при добавяне на такова:

1. **Наименувайте действието `resource.verb` в snake_case.** `backend/tests/test_audit_log.py` обхожда всяко извикване на `audit()` под `app/api/` и проваля билда при име, което не съвпада, както и при покрит ресурс, който е загубил всичките си места за извикване.

2. **Четете само атрибути, които със сигурност присъстват.** `try/except` на помощната функция защитава само нейното тяло, а не изразите, които ѝ подавате — `AttributeError` в `target_name=workflow.name` се повдига на мястото за извикване, преди `audit()` да се изпълни, и ще счупи заявката. Четете ORM колони и локални променливи, а не опционални или лениво заредени атрибути.

3. **Записвайте изтриването преди изтриването.** След `db.delete(row)` името и идентификаторът, които искате да запишете, може вече да ги няма. Поставете извикването над него.
