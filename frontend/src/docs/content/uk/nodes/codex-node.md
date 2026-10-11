# Вузол Codex

Вузол **Codex** запускає OpenAI Codex CLI в ізольованому робочому просторі Heym для роботи з репозиторієм GitHub. Він призначений для завдань програмування, як-от виправлення тестів, редагування файлів, створення патча або відкриття чернетки pull request.

## Огляд

| Властивість | Значення |
|----------|-------|
| Входи | 1 |
| Виходи | 1, а також `question` |
| Облікові дані | Codex access token + GitHub |
| Вихід | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Автентифікація

Облікові дані **OpenAI Codex** підтримують два режими автентифікації:

| Режим | Опис |
|------|-------------|
| **Sign in with ChatGPT** (рекомендовано) | Вхід через OAuth (PKCE), який використовує Вашу підписку ChatGPT Plus/Pro, тож запуски **не** спричиняють витрат на API за кожен token. Натисніть **Sign in with ChatGPT** у діалозі облікових даних, авторизуйтеся у браузері, а потім вставте URL-адресу перенаправлення `localhost:1455` назад у Heym. Heym зберігає отриманий набір token і автоматично оновлює його після завершення терміну дії. |
| **Access token** | Вставте ChatGPT/Codex `access_token`, який використовується лише локальним Codex runner. |

Ключі API не приймаються для облікових даних Codex. Вузол не надсилає хмарні завдання Codex; він клонує репозиторій у середовищі виконання Heym, записує набір token ChatGPT в ізольований `auth.json` (або передає `CODEX_ACCESS_TOKEN`) лише процесу Codex і тримає token поза `$credentials`.

Вузол також потребує облікових даних **GitHub** для клонування приватних репозиторіїв, надсилання робочої гілки та створення чернеток pull request.

У розгортаннях Docker Heym запускає Codex у сусідньому контейнері з того самого образу Heym (а не з окремого образу GHCR). Цей контейнер монтує лише том робочого простору Codex і дозволяє власній пісочниці bubblewrap від Codex створювати простори імен і свіжий `/proc`. Runner додає `SYS_ADMIN`, необмежені seccomp і AppArmor, а також `systempaths=unconfined` (Docker Engine 25+). Без останнього прапорця кожна команда завершується помилкою ще до запуску з повідомленням `bwrap: Can't mount proc on /newroot/proc: Operation not permitted`.

Посилання OpenAI:

- [Codex authentication](https://developers.openai.com/codex/auth)
- [Codex access tokens](https://developers.openai.com/codex/enterprise/access-tokens)
- [Codex models](https://learn.chatgpt.com/docs/models?surface=cli)
- [Codex non-interactive mode](https://developers.openai.com/codex/noninteractive)
- [Codex pricing](https://developers.openai.com/codex/pricing)

## Поля

| Поле | Опис |
|-------|-------------|
| Codex Credential | Облікові дані OpenAI Codex (вхід через ChatGPT або `access_token`) |
| GitHub Credential | Облікові дані GitHub PAT, що використовуються для доступу до репозиторію |
| Repository URL | HTTPS-URL репозиторію GitHub |
| Base Branch | Гілка для клонування перед запуском Codex, за замовчуванням `main` |
| Model | Необов'язкова модель Codex (редагований випадаючий список, наприклад `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`); порожнє значення використовує модель Codex за замовчуванням |
| Reasoning Effort | Глибина міркувань Codex: `low`, `medium`, `high`, `xhigh` (Extra High), `max` або `ultra` (за замовчуванням `medium`) |
| Task Prompt | Завдання програмування для Codex; підтримує вирази, як-от `$input.text` |
| Publish Mode | Спосіб доставки змін (див. таблицю нижче) |
| Branch Name | Робоча гілка для режимів PR/commit, за замовчуванням `codex/$executionId` |
| Timeout | Максимальний час виконання Codex у секундах |

## Режими публікації

| Режим | Що він робить |
|------|--------------|
| `diff_only` | Редагує файли локально та повертає патч і змінені файли. Нічого не надсилається. |
| `draft_pr` | Створює commit у гілці, надсилає її та відкриває чернетку pull request. |
| `open_pr` | Створює commit у гілці, надсилає її та відкриває готовий до перегляду (не чернетку) pull request. |
| `commit_push` | Створює commit у гілці та надсилає її без відкриття pull request. |
| `direct_commit` | Створює commit і надсилає безпосередньо до базової гілки (без окремої гілки чи PR). |
| `open_or_update_pr` | Оновлює наявний відкритий PR агента, якщо такий існує — навіть якщо назва гілки відрізняється, runner знаходить його за автором + базою — інакше відкриває новий. Найкраще підходить для повторних запусків та інструкцій «оновити відкритий PR». |
| `update_existing_pr` | Додає commit до наявної гілки/PR; відкриває його, якщо жодного ще немає. |
| `patch_artifact` | Зберігає diff як файл для завантаження та повертає `patchUrl`. Нічого не надсилається. |

## Виходи

| Ключ | Опис |
|-----|-------------|
| `status` | `completed` або `needs_input` |
| `summary` | Підсумок від Codex |
| `validation` | Примітки щодо валідації, тести або перевірки, про які повідомляє Codex |
| `diff` | Git-патч, коли файли змінено |
| `changedFiles` | Шляхи змінених файлів |
| `threadId` | Ідентифікатор потоку/сесії Codex, коли доступний |
| `branchName` | Назва робочої гілки |
| `pullRequestUrl` | URL PR у режимах `draft_pr`, `open_pr`, `open_or_update_pr` та `update_existing_pr` |
| `pushedBranch` | Гілка, яку було надіслано в режимах commit/PR |
| `patchUrl` | Посилання для завантаження diff у режимі `patch_artifact` |
| `usage` | Метадані використання, про які повідомляє Codex CLI, коли доступні |
## Скриншоти UI у pull request

Для завдань UI/фронтенду Codex має зберігати PNG-скриншоти за шляхом, доданим до gitignore, наприклад `frontend/.e2e-artifacts/` (не в джерелах). Якщо залежності фронтенду відсутні, Codex може виконати `bun install` (або npm/pnpm install) і запустити короткочасний preview/`bun run dev` виключно для захоплення UI. Heym завантажує ці зображення до єдиного спільного GitHub **prerelease** (`codex-pr-assets`) як assets з іменами `<branch>-…`, а потім вбудовує їх в опис PR **до відкриття pull request**, тож новий PR створюється вже зі своїми скриншотами (наявні PR оновлюються на місці). Codex також має встановити змістовний `pull_request_title` (ніколи не заповнювачі на кшталт `Done.`).

Іноді Codex завершує хід посеред завдання («…Now let me take a screenshot»), що призвело б до фіналізації запуску до захоплення скриншота. Щоб запобігти цьому, prompt runner вимагає захоплювати скриншоти **перед** фінальним результатом, і якщо запуск усе одно завершується без публікованого підсумку або зі зміною UI, але без скриншота, Heym виконує ще один прохід Codex у тому самому workspace для завершення. Якщо після цього зміна UI все ще не має скриншота, до тіла PR додається видима примітка, щоб прогалина ніколи не залишалася непоміченою.

## Що публікується до GitHub

Ваш **Task Prompt** є приватним вхідним даним, а не вмістом PR. Публікуються лише дві речі: `## Change Summary`, що описує, що робить зміна коду, та розділ `## Screenshots`, коли скриншоти було захоплено. Заголовок PR виводиться виключно з підсумку змін.

Prompt runner декларує цю політику, і Heym також забезпечує її дотримання після запуску: перш ніж щось буде закомічено або відкрито як pull request, він вилучає розділи-відлуння prompt (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) та будь-який абзац, дослівно скопійований з task prompt, з підсумку, тіла PR і повідомлення коміту. Покроковий опис на кшталт `Both pass. Let me do a final review:` також відхиляється як заголовок PR або тема коміту.

## Уточнювальні запитання

Якщо Codex потребує відсутніх вимог або продуктового рішення, він повертає `needs_input`. Heym призупиняє виконання та надає вихідний обробник `question`. З'єднайте цей обробник із гілкою сповіщень, наприклад Slack або Send Email, щоб надіслати рецензенту публічне посилання для уточнення.

Коли рецензент відповідає, Heym відновлює той самий знімок виконання та потік Codex із збережених метаданих workspace.

## Як інструмент агента

Вузол Codex можна приєднати до обробника інструментів вузла **AI Agent**, щоб агент міг делегувати завдання з кодування. Налаштуйте облікові дані, облікові дані GitHub і репозиторій на вузлі, потім позначте **Task Prompt** (і за бажанням **Repository URL**) перемикачем, що надається агентом, щоб агент передавав їх під час виклику. Коли Codex запускається як інструмент, результат `needs_input` повертається агенту inline, а не призупиняє workflow, тож агент може уточнити запит і викликати Codex знову.

## Приклад

```json
{
  "id": "codex-1",
  "type": "codex",
  "position": { "x": 420, "y": 120 },
  "data": {
    "label": "fix_pr",
    "credentialId": "codex-credential-uuid",
    "githubCredentialId": "github-credential-uuid",
    "repositoryUrl": "https://github.com/acme/app",
    "baseBranch": "main",
    "taskPrompt": "$input.text",
    "publishMode": "draft_pr",
    "branchName": "codex/$executionId",
    "timeoutSeconds": 3600
  }
}
```

## Пов'язане

- [GitHub Node](./github-node.md)
- [Agent Node](./agent-node.md)
- [Credentials](../reference/credentials.md)
- [Credentials Sharing](../reference/credentials-sharing.md)
- [Node Types](../reference/node-types.md)
