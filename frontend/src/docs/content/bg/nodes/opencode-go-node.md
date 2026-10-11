# OpenCode Go Node

**OpenCode Go** node изпълнява [OpenCode](https://opencode.ai) CLI (Go) в изолиран, усилено защитен Heym контейнер срещу GitHub хранилище. Подобно на Codex node, той е предназначен за задачи по програмиране като поправяне на тестове, редактиране на файлове, създаване на patch или отваряне на pull request — но използва независимия от доставчик **OpenCode Go** model gateway вместо OpenAI Codex.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 1 |
| Удостоверение | OpenCode Go API key + GitHub |
| Изход | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Удостоверяване

**OpenCode Go** удостоверението съхранява **API key** за OpenCode Go gateway (от [opencode.ai/go](https://opencode.ai/go)) и незадължителен **Gateway Base URL** (по подразбиране `https://opencode.ai/zen/go/v1`; заменете само за самостоятелно хостван или проксиран gateway).

Node също изисква **GitHub** удостоверение за клониране на частни хранилища, изпращане на работния branch и създаване на pull requests. GitHub token **никога не се поставя вътре в sandbox контейнера** — Heym извършва всички git и GitHub операции на хоста, така че генерираният код не може да извлече push удостоверения.

## Изолация и сигурност

Изолацията на изпълнението се избира от `HEYM_OPENCODE_CLI_COMMAND`, точно както при Codex node:

- **Локална разработка (`run.sh`)** го оставя на стойността по подразбиране `opencode`, така че OpenCode се изпълнява като подпроцес на хоста срещу клонираното работно пространство — не е необходим Docker, без допълнителни флагове.
- **Docker внедрявания (`deploy.sh` и единичният GHCR образ)** го задават на `/usr/local/bin/heym-opencode-docker`, wrapper, който изпълнява `opencode run` вътре в **усилено защитен, временен sibling контейнер**, споделящ именувания volume на OpenCode работното пространство.

Усилено защитеният runner контейнер премахва всички Linux capabilities, задава `no-new-privileges`, използва read-only root с tmpfs `/tmp` и прилага ограничения за pid/memory/CPU. Мрежовият изход е разрешен (OpenCode трябва да достигне до model gateway). **GitHub token никога не се поставя вътре в контейнера** — всички git и GitHub операции се изпълняват от страната на хоста, така че само OpenCode API key и файловете на хранилището са вътре.

OpenCode редактира само файлове на диска; Heym притежава всяко git/GitHub действие.

## Модели

Списъкът с модели на OpenCode Go се променя често, затова полето **Model** се попълва на живо от списъка с модели на gateway (`GET https://opencode.ai/zen/go/v1/models`) и се показва като dropdown с търсене. Ако списъкът на живо не е наличен, се използва вграден резервен списък. Идентификаторите на моделите използват формата `opencode-go/<model>` (например `opencode-go/kimi-k3`, `opencode-go/deepseek-v4-pro`, `opencode-go/qwen3.7-max`) — `opencode-go` е идентификаторът на доставчика на OpenCode CLI за Go gateway. Оставете полето празно, за да използвате стойността по подразбиране на runner (`opencode-go/kimi-k3`). Идентификаторите на модели, запазени в по-стария формат `opencode/<model>`, се пренаписват автоматично по време на изпълнение.

## Полета

| Поле | Описание |
|-------|-------------|
| OpenCode Go Credential | OpenCode Go удостоверение (gateway API key) |
| GitHub Credential | GitHub PAT удостоверение, използвано за достъп до хранилището |
| Repository URL | HTTPS URL на GitHub хранилище; поддържа изрази |
| Base Branch | Branch за клониране преди стартиране на OpenCode, по подразбиране `main` |
| Model | OpenCode Go модел (dropdown с търсене на живо, `opencode-go/<model>`); празно използва стойността по подразбиране на runner |
| Reasoning Variant | Незаължително; съответства на `opencode run --variant` за модели, които поддържат reasoning effort |
| Task Prompt | Задача по програмиране за OpenCode; поддържа изрази като `$input.text` |
| Publish Mode | Как се доставят промените (вижте таблицата по-долу) |
| Branch Name | Работен branch за PR/commit режими, по подразбиране `opencode/$executionId` |
| Timeout | Максимално време за изпълнение на OpenCode в секунди |

## Режими на публикуване

| Режим | Какво прави |
|------|--------------|
| `diff_only` | Редактира файлове локално и връща patch и променените файлове. Нищо не се изпраща. |
| `draft_pr` | Commit-ва към branch, изпраща го и отваря draft pull request. |
| `open_pr` | Commit-ва към branch, изпраща го и отваря готов за преглед (не-draft) pull request. |
| `commit_push` | Commit-ва към branch и го изпраща, без да отваря pull request. |
| `direct_commit` | Commit-ва и изпраща директно към base branch (без отделен branch или PR). |
| `open_or_update_pr` | Актуализира съществуващия отворен PR на агента, когато такъв съществува — дори ако името на branch е различно, runner го намира по автор + base — в противен случай отваря нов. Най-подходящ за повторни изпълнения и инструкции „актуализирай отворения PR“. |
| `update_existing_pr` | Добавя commit към съществуващия branch/PR; отваря такъв, ако още няма. |
| `patch_artifact` | Запазва diff като файл за изтегляне и връща `patchUrl`. Нищо не се изпраща. |

## Изходи

| Ключ | Описание |
|-----|-------------|
| `status` | Винаги `completed` (OpenCode Go node не спира за вход) |
| `summary` | Последното съобщение на OpenCode |
| `validation` | Бележки за валидация, когато са докладвани |
| `diff` | Git patch, когато файловете са променени |
| `changedFiles` | Пътища на променените файлове |
| `branchName` | Име на работния branch |
| `pullRequestUrl` | URL на PR в режими `draft_pr`, `open_pr`, `open_or_update_pr` и `update_existing_pr` |
| `pushedBranch` | Branch, който е изпратен в commit/PR режими |
| `patchUrl` | Линк за изтегляне на diff в режим `patch_artifact` |
## UI screenshots в pull requests

За UI/frontend задачи OpenCode трябва да запазва PNG screenshots в gitignored път като `frontend/.e2e-artifacts/` (не в изходния код). Ако frontend зависимостите липсват, runner prompt позволява целеви package install (например `bun install`) плюс краткотраен preview/`bun run dev` единствено за заснемане на UI. Heym качва тези изображения в един споделен GitHub **prerelease** (`opencode-pr-assets`) като assets с имена `<branch>-…`, след което ги вгражда в описанието на PR **преди pull request да бъде отворен**, така че нов PR се създава вече съдържащ своите screenshots (съществуващите PR се обновяват на място).

OpenCode също е инструктиран да завършва с ред `PR_TITLE: …`, за да може Heym да отвори pull request със смислено заглавие вместо placeholders като `Done.`

Понякога OpenCode завършва ход по средата на задача ("…Now let me take a screenshot"), което би финализирало изпълнението преди screenshot да бъде заснет. За да се предотврати това, runner prompt изисква заснемане на screenshots **преди** финалното съобщение, а ако изпълнението все пак приключи без публикуваемо резюме или с UI промяна без screenshot, Heym стартира още един OpenCode pass в същата workspace, за да завърши. Ако UI промяна все още няма screenshot след това, видима бележка се добавя към тялото на PR, така че пропускът никога не остава незабелязан.

## Какво се публикува в GitHub

Вашият **Task Prompt** е частен вход, а не съдържание на PR. Публикуват се само две неща: `## Change Summary`, описващо какво прави промяната в кода, и секция `## Screenshots`, когато са заснети screenshots. Заглавието на PR се извлича само от change summary.

Runner prompt декларира тази политика и Heym също я налага след изпълнението: преди нещо да бъде committed или отворено като pull request, той премахва секциите с ехо от prompt (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) и всеки параграф, копиран дословно от task prompt, от summary, тялото на PR и commit съобщението.

Heym чете секцията `## Change Summary` от съобщенията на агента, вместо да взема последното казано, защото OpenCode излъчва съобщение на всяка стъпка и финалното често е коментар по средата на изпълнението. Step narration (`Both pass. Let me do a final review:`) също се отхвърля като заглавие на PR или тема на commit. Ако изпълнението не произведе използваемо change summary, pull request вместо това изброява променените файлове, вместо да публикува коментари.

## Като инструмент на агент

OpenCode Go node може да бъде прикачен към tool handle на **AI Agent** node, за да може агентът да делегира задачи по програмиране. Конфигурирайте credential, GitHub credential и repository на node, след което маркирайте **Task Prompt** (и по избор **Repository URL**) с toggle-а, предоставен от агента, така че агентът да ги подава по време на извикване.

## Пример

```json
{
  "id": "opencode-1",
  "type": "opencodeGo",
  "position": { "x": 420, "y": 120 },
  "data": {
    "label": "fix_pr",
    "credentialId": "opencode-credential-uuid",
    "githubCredentialId": "github-credential-uuid",
    "repositoryUrl": "https://github.com/acme/app",
    "baseBranch": "main",
    "taskPrompt": "$input.text",
    "publishMode": "open_pr",
    "branchName": "opencode/$executionId",
    "opencodeModel": "opencode-go/kimi-k3",
    "timeoutSeconds": 3600
  }
}
```

## Свързани

- [Codex Node](./codex-node.md)
- [GitHub Node](./github-node.md)
- [Agent Node](./agent-node.md)
- [Удостоверения](../reference/credentials.md)
- [Споделяне на удостоверения](../reference/credentials-sharing.md)
- [Типове nodes](../reference/node-types.md)
