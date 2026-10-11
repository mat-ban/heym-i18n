# Аудит-логування

Heym записує рядок аудиту для кожної дії, що стосується безпеки: хто її виконав, над чим саме та чи успішно. Рядки потрапляють до стандартного виводу бекенду через логер `winston.audit`, поряд із журналом доступу до запитів, і їх можна переглянути на вкладці **Logs** або за допомогою `docker logs`.

Аудит-логування **увімкнено завжди**. Нічого вмикати не потрібно, і немає жодної змінної середовища для налаштування.

## Формат рядка

Одна дія породжує рівно один самодостатній рядок:

```
2026-08-25 14:02:11 INFO [winston.audit] audit action=credential.delete outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="OpenAI Prod" credential_type=openai
```

Кожен рядок містить такі поля:

| Поле | Опис |
|-------|-------------|
| `action` | Що сталося, у форматі `resource.verb` — див. таблицю нижче. |
| `outcome` | `success`, `failure` або `denied`. |
| `actor_id` | UUID користувача, який виконав дію. Відсутнє лише тоді, коли ніхто не був автентифікований. |
| `actor_email` | Електронна пошта цього користувача. У разі невдалого входу це адреса, яку було вказано, а не підтверджений обліковий запис. |
| `target` | Об'єкт, над яким виконано дію, у форматі `type:uuid`. |
| `target_name` | Зрозуміла для людини назва цього об'єкта, взята в лапки, якщо містить пробіли. |

Далі йдуть поля, специфічні для дії — наприклад `credential_type`, `imported`, `grantee_email`, `team_name`. Значення, що містять пробіл, лапку або `=`, беруться в лапки; значення довші за 256 символів обрізаються з маркером `...(truncated)`.

## Читання журналу

Логер аудиту є дочірнім щодо логера запитів, тож обидва потрапляють до одного потоку, залишаючись при цьому роздільними:

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

У застосунку вкладка **Logs** читає той самий вивід контейнера. Доступ до неї обмежено змінною `DOCKER_LOGS_ENABLED` та списком дозволених адрес `DOCKER_LOGS_ALLOWED_EMAILS`.

## Що саме логується

Кожна зміна стану логується. Читання логується лише там, де саме читання є чутливою дією — перегляд історії виконань workflow, відкриття облікових даних, завантаження файлу. Звичайні операції переліку та перегляду деталей не підлягають аудиту; журнал доступу вже фіксує, що запит відбувся, а аудит кожного `GET` поховав би рядки, які справді мають значення.

### Автентифікація

| Дія | Примітки |
|--------|-------|
| `auth.register` | `outcome=denied`, коли реєстрацію вимкнено або коли вхід за паролем вимкнено (`reason=password_login_disabled`), `failure`, коли електронна пошта вже зайнята. |
| `auth.login` | `outcome=failure` фіксує адресу, яку було вказано, та те, чи була електронна пошта невідома, чи пароль хибний. |
| `auth.logout` | Суб'єкт визначається з refresh-cookie, тож вихід без неї логується без ідентичності. |
| `auth.token_refresh` | `outcome=denied` з `reason=refresh_token_replayed_or_revoked` — сигнал про викрадення token, на який варто налаштувати сповіщення. |
| `auth.password_change` | `outcome=failure`, коли поточний пароль був хибний. |
| `auth.sso_login` | Єдиний вхід. `outcome=failure` містить причину, з якої відповідь провайдера було відхилено; `denied` містить `email_not_verified`, `domain_not_allowed` або `provisioning_disabled`. |
| `sso_settings.update` | Адміністратор змінив конфігурацію [SSO](./sso.md). Фіксує `enabled` та `password_login_disabled`, але ніколи — client secret. |
| `sso_settings.test` | Адміністратор запустив перевірку з'єднання SSO. |

### Workflows

`workflow.create` · `workflow.update` · `workflow.delete` · `workflow.version_revert` · `workflow.history_view` · `workflow.history_clear` · `workflow.share_add` · `workflow.share_remove` · `workflow.team_share_add` · `workflow.team_share_remove` · `workflow.execution_token_create` · `workflow.execution_token_revoke`

`workflow.history_view` фіксує `owned=false`, коли співробітник читає історію виконань когось іншого. `workflow.delete` фіксує `outcome=denied` з `reason=not_owner`, коли співробітник намагається виконати видалення.

### Облікові дані

`credential.create` · `credential.update` · `credential.delete` · `credential.detail_view` · `credential.share_add` · `credential.share_remove` · `credential.team_share_add` · `credential.team_share_remove`

`credential.detail_view` підлягає аудиту, оскільки відкриття облікових даних розшифровує їх. Невдала спроба логується як `outcome=denied` — саме так виглядає спроба перебору ідентифікаторів облікових даних.
### Інші ресурси

| Ресурс | Дії |
|----------|---------|
| Змінні | `variable.create` · `update` · `delete` · `bulk_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Векторні сховища | `vector_store.create` · `update` · `delete` · `clone` · `upload` · `item_delete` · `items_delete_by_source` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Сповіщення | `alert.create` · `update` · `delete` · `event_acknowledge` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` · `disable_on_access_revoke` |
| Таблиці даних | `data_table.create` · `update` · `delete` · `clone` · `row_create` · `row_update` · `row_delete` · `rows_clear` · `rows_bulk_create` · `import_csv` · `export_csv` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Дашборди | `dashboard.create` · `update` · `delete` · `widget_create` · `widget_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Дошки | `board.create` · `update` · `delete` · `column_create` · `column_update` · `column_delete` · `column_empty` · `card_create` · `card_update` · `card_delete` · `card_move` · `card_run` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Drive | `drive.upload` · `download` · `delete` · `delete_all` · `bulk_delete` · `share_create` · `share_revoke` · `team_sharing_update` · `bulk_team_sharing_update` |
| Команди | `team.create` · `update` · `delete` · `member_add` · `member_remove` |
| Папки | `folder.create` · `update` · `delete` · `workflow_move` |

Масові операції журналюються один раз на запит із зазначенням кількості, а не окремо для кожного рядка. Імпорт CSV на 5 000 рядків створює один рядок `data_table.import_csv` із полями `imported`, `rejected` та `total`.

## Секрети ніколи не журналюються

Рядок аудиту фіксує ідентифікатори, назви та кількості. Він ніколи не фіксує вміст облікових даних, значення змінної, пароль або token.

Це забезпечується двома механізмами. Місця виклику написано так, щоб передавати лише безпечні поля, а помічник аудиту виконує редагування як запобіжний захід: будь-яке поле, назва якого містить `password`, `secret`, `token`, `api_key`, `value`, `authorization`, `cookie` або подібне, замінюється на `***` перед формуванням рядка. Надмірне редагування є навмисним — неінформативний рядок кращий за витік облікових даних.

Якщо секрет справді стосується запису, журналюється лише його форма. Для спільного доступу до файлу фіксується `password_protected=true`, але ніколи не сам пароль.

## Зберігання

**Рядки аудиту існують лише стільки, скільки існує вивід журналів контейнера.** Вони не записуються до бази даних. Повторне створення контейнера backend призводить до втрати його журналів.

Якщо потрібна історія аудиту, що переживає повторне розгортання, слід спрямувати stdout контейнера до довговічного сховища — драйвера журналювання, sidecar-колектора або агрегатора журналів вашої платформи — так само, як це робиться для будь-яких інших журналів контейнера.

## Для контриб'юторів

Для створення рядка аудиту потрібен один виклик:

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

Помічник є синхронним, не звертається до бази даних і приглушує власні помилки, тож виклик аудиту не може спричинити збій або уповільнити запит.

Три правила під час додавання виклику:

1. **Називайте дію `resource.verb` у snake_case.** `backend/tests/test_audit_log.py` перевіряє кожен виклик `audit()` у `app/api/` і провалює збірку, якщо назва не відповідає вимогам, а також якщо охоплений ресурс втратив усі свої місця виклику.

2. **Читайте лише ті атрибути, які точно наявні.** Блок `try/except` помічника захищає лише його власне тіло, а не вирази, які ви йому передаєте — `AttributeError` у `target_name=workflow.name` виникає в місці виклику, до запуску `audit()`, і призведе до збою запиту. Читайте стовпці ORM та локальні змінні, а не необов'язкові або ліниво завантажувані атрибути.

3. **Журналюйте видалення до видалення.** Після `db.delete(row)` назва та id, які потрібно зафіксувати, можуть уже бути відсутні. Розміщуйте виклик вище.
