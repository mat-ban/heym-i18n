# Codex Node

**Codex** node изпълнява OpenAI Codex CLI в изолирана Heym работна среда срещу GitHub repository. Той е предназначен за задачи по програмиране, като поправяне на тестове, редактиране на файлове, създаване на patch или отваряне на draft pull request.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 1, плюс `question` |
| Удостоверение | Codex access token + GitHub |
| Изход | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Удостоверяване

Удостоверението **OpenAI Codex** поддържа два режима на удостоверяване:

| Режим | Описание |
|------|-------------|
| **Sign in with ChatGPT** (препоръчително) | OAuth (PKCE) вход, който използва Вашия ChatGPT Plus/Pro абонамент, така че изпълненията **не** генерират разходи за API на база token. Натиснете **Sign in with ChatGPT** в диалога за удостоверение, оторизирайте в браузъра си, след което поставете URL адреса за пренасочване `localhost:1455` обратно в Heym. Heym съхранява получения token bundle и го обновява автоматично при изтичане. |
| **Access token** | Поставете ChatGPT/Codex `access_token`, използван само от локалния Codex runner. |

API keys не се приемат за удостоверението Codex. Node не подава cloud Codex задачи; той клонира repository в рамките на Heym runtime, записва ChatGPT token bundle в изолиран `auth.json` (или подава `CODEX_ACCESS_TOKEN`) само към процеса Codex и държи token извън `$credentials`.

Node също изисква удостоверение **GitHub** за клониране на частни repository-та, push на работния branch и създаване на draft pull requests.

При Docker внедрявания Heym изпълнява Codex в sibling container от същия Heym image (не отделен GHCR image). Този container монтира само Codex workspace volume и позволява на собствения bubblewrap sandbox на Codex да създава namespaces и нов `/proc`. Runner-ът добавя `SYS_ADMIN`, unconfined seccomp и AppArmor, и `systempaths=unconfined` (Docker Engine 25+). Без последния флаг всяка команда се проваля преди стартиране с `bwrap: Can't mount proc on /newroot/proc: Operation not permitted`.

Препратки към OpenAI:

- [Codex authentication](https://developers.openai.com/codex/auth)
- [Codex access tokens](https://developers.openai.com/codex/enterprise/access-tokens)
- [Codex models](https://learn.chatgpt.com/docs/models?surface=cli)
- [Codex non-interactive mode](https://developers.openai.com/codex/noninteractive)
- [Codex pricing](https://developers.openai.com/codex/pricing)

## Полета

| Поле | Описание |
|-------|-------------|
| Codex Credential | Удостоверение OpenAI Codex (ChatGPT вход или `access_token`) |
| GitHub Credential | Удостоверение GitHub PAT, използвано за достъп до repository |
| Repository URL | HTTPS URL на GitHub repository |
| Base Branch | Branch за клониране преди стартиране на Codex, по подразбиране `main` |
| Model | Опционален Codex модел (редактируем dropdown, напр. `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`); празно използва модела по подразбиране на Codex |
| Reasoning Effort | Дълбочина на Codex reasoning: `low`, `medium`, `high`, `xhigh` (Extra High), `max` или `ultra` (по подразбиране `medium`) |
| Task Prompt | Задача по програмиране за Codex; поддържа изрази като `$input.text` |
| Publish Mode | Как се доставят промените (вижте таблицата по-долу) |
| Branch Name | Работен branch за PR/commit режими, по подразбиране `codex/$executionId` |
| Timeout | Максимално време за изпълнение на Codex в секунди |

## Режими на публикуване

| Режим | Какво прави |
|------|--------------|
| `diff_only` | Редактира файлове локално и връща patch и променените файлове. Нищо не се push-ва. |
| `draft_pr` | Commit-ва към branch, push-ва го и отваря draft pull request. |
| `open_pr` | Commit-ва към branch, push-ва го и отваря готов за преглед (не-draft) pull request. |
| `commit_push` | Commit-ва към branch и го push-ва, без да отваря pull request. |
| `direct_commit` | Commit-ва и push-ва директно към base branch (без отделен branch или PR). |
| `open_or_update_pr` | Обновява съществуващия отворен PR на agent-а, когато такъв съществува — дори ако името на branch-а е различно, runner-ът го намира по author + base — в противен случай отваря нов. Най-подходящ за повторни изпълнения и инструкции „обнови отворения PR“. |
| `update_existing_pr` | Добавя commit към съществуващия branch/PR; отваря такъв, ако още няма. |
| `patch_artifact` | Записва diff като файл за изтегляне и връща `patchUrl`. Нищо не се push-ва. |

## Изходи

| Ключ | Описание |
|-----|-------------|
| `status` | `completed` или `needs_input` |
| `summary` | Обобщение от Codex |
| `validation` | Бележки за валидация, тестове или проверки, докладвани от Codex |
| `diff` | Git patch, когато файловете са променени |
| `changedFiles` | Пътища на променените файлове |
| `threadId` | Идентификатор на Codex thread/session, когато е наличен |
| `branchName` | Име на работния branch |
| `pullRequestUrl` | URL на PR в режими `draft_pr`, `open_pr`, `open_or_update_pr` и `update_existing_pr` |
| `pushedBranch` | Branch, който е бил push-нат в commit/PR режими |
| `patchUrl` | Линк за изтегляне на diff в режим `patch_artifact` |
| `usage` | Метаданни за използването, докладвани от Codex CLI, когато са налични |
## UI екранни снимки при pull requests

За UI/frontend задачи Codex трябва да запазва PNG екранни снимки в gitignored път, например `frontend/.e2e-artifacts/` (не в изходния код). Ако frontend зависимостите липсват, Codex може да изпълни `bun install` (или npm/pnpm install) и да стартира краткотраен preview/`bun run dev` единствено за заснемане на UI. Heym качва тези изображения в един споделен GitHub **prerelease** (`codex-pr-assets`) като assets с имена `<branch>-…`, след което ги вгражда в описанието на PR **преди отварянето на pull request-а**, така че нов PR се създава вече съдържайки своите екранни снимки (съществуващите PR-и се обновяват на място). Codex също трябва да зададе смислено `pull_request_title` (никога placeholders като `Done.`).

Понякога Codex завършва ход по средата на задачата ("…Now let me take a screenshot"), което би финализирало изпълнението преди заснемането на екранната снимка. За да се предотврати това, runner prompt-ът изисква заснемане на екранни снимки **преди** крайния резултат, а ако изпълнението все пак приключи без публикуваемо резюме или с UI промяна без екранна снимка, Heym изпълнява още един Codex pass в същото workspace за довършване. Ако UI промяна все още няма екранна снимка след това, към тялото на PR се добавя видима бележка, така че пропускът никога не остава незабелязан.

## Какво се публикува в GitHub

Вашият **Task Prompt** е поверителен вход, а не съдържание на PR. Публикуват се само две неща: `## Change Summary`, описващ какво прави промяната в кода, и секция `## Screenshots`, когато са заснети екранни снимки. Заглавието на PR се извлича единствено от резюмето на промяната.

Runner prompt-ът посочва тази политика и Heym също я налага след изпълнението: преди нещо да бъде commit-нато или отворено като pull request, той премахва секциите с ехо от prompt-а (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) и всеки абзац, копиран дословно от task prompt-а, от резюмето, тялото на PR и commit съобщението. Описателни стъпки като `Both pass. Let me do a final review:` също се отхвърлят като заглавие на PR или тема на commit.

## Follow-up въпроси

Ако Codex се нуждае от липсващи изисквания или продуктово решение, той връща `needs_input`. Heym поставя изпълнението на пауза и предоставя изходен handle `question`. Свържете този handle към разклонение за известия, например Slack или Send Email, за да изпратите на рецензента публичната връзка за follow-up.

Когато рецензентът отговори, Heym възобновява същия snapshot на изпълнението и Codex thread от запазените метаданни на workspace-а.

## Като инструмент на агент

Codex node-ът може да бъде прикачен към tool handle на **AI Agent** node, така че агентът да делегира задачи по програмиране. Конфигурирайте credential-а, GitHub credential-а и repository-то на node-а, след което маркирайте **Task Prompt** (и по избор **Repository URL**) с превключвателя за предоставяне от агента, така че агентът да ги подава по време на извикването. Когато Codex работи като инструмент, резултат `needs_input` се връща inline на агента, вместо да поставя workflow-а на пауза, така че агентът може да прецизира заявката и да извика Codex отново.

## Пример

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

## Свързани

- [GitHub Node](./github-node.md)
- [Agent Node](./agent-node.md)
- [Удостоверения](../reference/credentials.md)
- [Споделяне на удостоверения](../reference/credentials-sharing.md)
- [Типове node-ове](../reference/node-types.md)
