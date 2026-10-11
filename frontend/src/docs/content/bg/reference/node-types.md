# Типове възли

Heym предоставя разнообразие от типове възли за изграждане на workflows. Използвайте [изрази](./expression-dsl.md) като `$input.text` и `$nodeLabel.field` в конфигурацията на възела.

## Trigger възли

| Възел | Описание | Изходи |
|------|-------------|---------|
| [Input](../nodes/input-node.md) | Входна точка за текст в workflow (HTTP/[webhook](./webhooks.md)) | 1 |
| [Cron](../nodes/cron-node.md) | Trigger по график (cron израз) | 1 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Trigger при получаване на webhook актуализация от Telegram бот | 1 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Trigger, когато Slack изпрати webhook от Events API | 1 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Trigger, когато Discord изпрати webhook за взаимодействие с приложение | 1 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Trigger при получаване на нов имейл в IMAP пощенска кутия | 1 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Trigger, когато Heym публикува платформено събитие (пакетиран масив) | 1 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Trigger от изходяща връзка към външен WebSocket сървър | 1 |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Генерира връзка за еднократно качване и стартира при качване на голям файл | 1 |
| [RabbitMQ](../nodes/rabbitmq-node.md) | Trigger при получаване на съобщение от опашка | 1 |
| [Error Handler](../nodes/error-handler-node.md) | Изпълнява се при грешка във всеки възел (без входяща връзка) | 1 |

Вижте [Triggers](./triggers.md) за всички входни точки.

## AI възли

| Възел | Описание | Входове | Изходи |
|------|-------------|--------|---------|
| [LLM](../nodes/llm-node.md) | Обработва текст с езиков модел | 1 | 1 |
| [Decision](../nodes/decision-node.md) | Задава типизирани въпроси на модел за вземане на решения и разклонява според върнатите вероятности | 1 | 1 |
| [AI Agent](../nodes/agent-node.md) | LLM с извикване на инструменти, skills, MCP, опционален [човешки преглед](./human-in-the-loop.md) и опционална [граф за постоянна памет](./agent-persistent-memory.md). Вижте [Agent Architecture](./agent-architecture.md). | 1 | 1, плюс опционален изход `review` |
| [Codex](../nodes/codex-node.md) | Стартира локалния Codex CLI срещу GitHub хранилище, използвайки ChatGPT/Codex token за достъп | 1 | 1, плюс изход `question` |
| [OpenCode Go](../nodes/opencode-go-node.md) | Стартира OpenCode CLI срещу GitHub хранилище в защитена среда (hardened container), използвайки API ключ за OpenCode Go gateway | 1 | 1 |
| [MCP Call](../nodes/mcp-call-node.md) | Извиква конкретен MCP инструмент директно, без LLM да го избира | 1 | 1 |
| [RAG / Vector Store](../nodes/rag-node.md) | Вмъква, upsert-ва, изтрива или търси в Qdrant или Postgres (pgvector) [векторно хранилище](../tabs/vectorstores-tab.md) за RAG | 1 | 1 |

## Логически възли

| Възел | Описание | Входове | Изходи |
|------|-------------|--------|---------|
| [Condition](../nodes/condition-node.md) | Разклоняване въз основа на if/else | 1 | 2 (true/false) |
| [Switch](../nodes/switch-node.md) | Насочване чрез съпоставяне на стойност с случаи | 1 | n |
| [Merge](../nodes/merge-node.md) | Изчаква множество входове и ги обединява | n | 1 |
| [Loop](../nodes/loop-node.md) | Итериране върху масив | 1 | 2 (loop/done) |

## Възли за данни

| Възел | Описание | Входове | Изходи |
|------|-------------|--------|---------|
| [Set](../nodes/set-node.md) | Трансформира и съпоставя данни | 1 | 1 |
| [Converter](../nodes/converter-node.md) | Конвертира данни между формати (CSV, JSON, XML) и OCR на изображения или PDF към текст | 1 | 1 |
| [Code](../nodes/code-node.md) | Стартира Python в еднократна, изолирана от мрежата sandbox среда със собствен requirements.txt | 1 | 1 |
| [Variable](../nodes/variable-node.md) | Задава или получава променлива (локална за workflow или [глобална](./global-variables.md)) | 1 | 1 |
| [Execute](../nodes/execute-node.md) | Извиква друг workflow | 1 | 1 |
| [Heym](../nodes/heym-node.md) | Чете Heym workflows и история на изпълненията | 1 | 1 |
## Интеграционни възли

| Възел | Описание | Входове | Изходи |
|------|-------------|--------|---------|
| [HTTP](../nodes/http-node.md) | Извършване на HTTP заявки (cURL) | 0 или 1 | 1 |
| [WebSocket Send](../nodes/websocket-send-node.md) | Свързване към външен WebSocket и изпращане на едно съобщение | 1 | 1 |
| [Telegram](../nodes/telegram-node.md) | Изпращане на съобщения чрез Telegram бот | 1 | 1 |
| [Slack](../nodes/slack-node.md) | Изпращане на съобщения в Slack | 1 | 1 |
| [Discord](../nodes/discord-node.md) | Изпращане на съобщения чрез Discord webhook | 1 | 1 |
| [Send Email](../nodes/send-email-node.md) | Изпращане на имейли чрез SMTP | 1 | 1 |
| [Redis](../nodes/redis-node.md) | Redis операции (set, get, hasKey, deleteKey) | 1 | 1 |
| [Grist](../nodes/grist-node.md) | Четене/запис в Grist електронни таблици | 1 | 1 |
| [GitHub](../nodes/github-node.md) | Управление на repositories, users, issues, pull requests, reviews, releases, Actions workflows и files чрез GitHub REST API | 1 | 1 |
| [Jira](../nodes/jira-node.md) | Управление на Jira projects, issues, comments, attachments, users, notifications и workflow transitions чрез Jira REST API | 1 | 1 |
| [Linear](../nodes/linear-node.md) | Управление на Linear teams, projects, issues, workflow states и comments чрез GraphQL | 1 | 1 |
| [Google Sheets](../nodes/google-sheets-node.md) | Четене/запис в Google Sheets чрез OAuth2 | 1 | 1 |
| [Google Drive](../nodes/google-drive-node.md) | Изброяване, изтегляне, обновяване и изтриване на файлове в Google Drive чрез OAuth2 | 1 | 1 |
| [BigQuery](../nodes/bigquery-node.md) | Изпълнение на SQL заявки и вмъкване на редове в BigQuery | 1 | 1 |
| [Supabase](../nodes/supabase-node.md) | Заявки и промени в Supabase таблици чрез PostgREST | 1 | 1 |
| [ClickHouse](../nodes/clickhouse-node.md) | Изпълнение на SQL, CRUD и count операции върху ClickHouse | 1 | 1 |
| [Notion](../nodes/notion-node.md) | Управление на Notion databases, data sources, pages и blocks | 1 | 1 |
| [Sentry](../nodes/sentry-node.md) | Управление на Sentry organizations, projects, teams, issues, events и releases | 1 | 1 |
| [Amazon S3](../nodes/amazon-s3-node.md) | Управление на buckets и folders; изброяване, качване, изтегляне, копиране и изтриване на objects | 1 | 1 |
| [DataTable](../nodes/datatable-node.md) | Четене/запис в Heym DataTables (first-party storage) | 1 | 1 |
| [Drive](../nodes/drive-node.md) | Управление на Drive files: изтриване, задаване на парола, TTL, максимален брой изтегляния, споделяне/прекратяване на споделяне с екип | 1 | 1 |

## Автоматизационни възли

| Възел | Описание | Входове | Изходи |
|------|-------------|--------|---------|
| [Crawler](../nodes/crawler-node.md) | Извличане на съдържание от уеб страници чрез FlareSolverr | 1 | 1 |
| [Playwright](../nodes/playwright-node.md) | Автоматизация на браузър с AI стъпка и Auto Heal | 1 | 1 |

## Помощни възли

| Възел | Описание | Входове | Изходи |
|------|-------------|--------|---------|
| [Wait](../nodes/wait-node.md) | Отлагане на изпълнението | 1 | 1 |
| [Output](../nodes/output-node.md) | Изходен endpoint | 1 | 1 |
| [JSON output mapper](../nodes/json-output-mapper-node.md) | Съпоставяне на полета към JSON обект; единствен терминал = top-level webhook/run body | 1 | 0 |
| [HTML output mapper](../nodes/html-output-mapper-node.md) | Рендиране на HTML страница; единствен терминал = webhook отговаря с text/html | 1 | 0 |
| [Chart Output](../nodes/chart-output-node.md) | Терминален изход за dashboard widget, който съпоставя upstream редове към chart payloads | 1 | 0 |
| [Sticky Note](../nodes/sticky-note-node.md) | Добавяне на markdown бележки към canvas (не се изпълнява) | 0 | 0 |
| [Console Log](../nodes/console-log-node.md) | Запис в backend конзолата | 1 | 1 |
| [Disable Node](../nodes/disable-node.md) | Деактивиране на друг възел във workflow | 1 | 1 |
| [Enable Node](../nodes/enable-node.md) | Активиране на деактивиран възел във workflow | 1 | 1 |
| [Throw Error](../nodes/throw-error-node.md) | Спиране на workflow с отговор за грешка | 1 | 0 |

## Plugin възли

Plugin възлите се предоставят от plugins, инсталирани на инстанцията. Всеки инсталиран
plugin се появява в палетата под **Plugins** със собственото си име; под капака
той съответства на един от тези два типа възли.

| Възел | Описание | Входове | Изходи |
|------|-------------|--------|---------|
| [Plugin](../nodes/plugin-node.md) | Персонализирано действие, предоставено от инсталиран plugin | 1 | 1 |
| [Plugin Trigger](../nodes/plugin-trigger-node.md) | Персонализиран trigger, предоставен от инсталиран plugin | 0 | 1 |
## Свързани

- [Функции на Canvas](./canvas-features.md) – Data pin, логове за изпълнение, включване/изключване, извличане в под-workflow
- [Agent Node](../nodes/agent-node.md) – Подробна справка за възела AI Agent
- [Архитектура на агента](./agent-architecture.md) – Подагенти, оркестратор, умения, MCP, извикване на инструменти
- [Постоянна памет на агента](./agent-persistent-memory.md) – Граф на знанията за всеки възел, споделяне и фоново извличане
- [Human-in-the-Loop](./human-in-the-loop.md) – Спиране на изхода на агента за одобрение от човек
- [Expression DSL](./expression-dsl.md) – Референциране на данни в конфигурацията на възел
- [Диалог за оценка на изрази](./expression-evaluation-dialog.md) – Разгъваем редактор с преглед на живо от backend
- [File Upload Trigger](../nodes/file-upload-trigger-node.md) – Приемане на големи multipart качвания чрез връзки за еднократна употреба
- [WebSocket Trigger](../nodes/websocket-trigger-node.md) – Realtime изходящ socket trigger
- [WebSocket Send](../nodes/websocket-send-node.md) – Изпращане на съобщения към външни sockets
- [Структура на workflow](./workflow-structure.md) – JSON формат за възли и връзки
- [Triggers](./triggers.md) – Всички входни точки на workflow
- [Раздел Удостоверения](../tabs/credentials-tab.md) – Добавяне на API ключове за LLM, HTTP и други възли
- [Споделяне на удостоверения](./credentials-sharing.md) – Споделяне на удостоверения с други потребители
- [Портал](./portal.md) – Публикуване на workflows като публични chat интерфейси
- [Раздел Векторни хранилища](../tabs/vectorstores-tab.md) – Създаване на векторни хранилища за RAG възли
