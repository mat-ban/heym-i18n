# Типи вузлів

Heym надає різноманітні типи вузлів для побудови workflow. Використовуйте [вирази](./expression-dsl.md), як-от `$input.text` та `$nodeLabel.field`, у конфігурації вузлів.

## Trigger Nodes

| Вузол | Опис | Виходи |
|------|-------------|---------|
| [Input](../nodes/input-node.md) | Точка входу тексту для workflow (HTTP/[webhook](./webhooks.md)) | 1 |
| [Cron](../nodes/cron-node.md) | Trigger за розкладом (cron-вираз) | 1 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Trigger, коли надходить webhook-оновлення від Telegram-бота | 1 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Trigger, коли Slack надсилає webhook Events API | 1 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Trigger, коли Discord надсилає webhook взаємодії застосунку | 1 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Trigger, коли до поштової скриньки IMAP надходить новий лист | 1 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Trigger, коли Heym публікує подію платформи (пакетний масив) | 1 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Trigger від вихідного з'єднання до зовнішнього сервера WebSocket | 1 |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Створює одноразове посилання для завантаження та запускається, коли завантажено великий файл | 1 |
| [RabbitMQ](../nodes/rabbitmq-node.md) | Trigger, коли отримано повідомлення з черги | 1 |
| [Error Handler](../nodes/error-handler-node.md) | Запускається, коли будь-який вузол зазнає помилки (без вхідного ребра) | 1 |

Дивіться [Triggers](./triggers.md) для всіх точок входу.

## AI Nodes

| Вузол | Опис | Входи | Виходи |
|------|-------------|--------|---------|
| [LLM](../nodes/llm-node.md) | Обробляє текст за допомогою мовної моделі | 1 | 1 |
| [Decision](../nodes/decision-node.md) | Ставить типізовані запитання моделі прийняття рішень і розгалужується за ймовірностями, які вона повертає | 1 | 1 |
| [AI Agent](../nodes/agent-node.md) | LLM із викликом інструментів, навичками, MCP, опціональним [переглядом людиною](./human-in-the-loop.md) та опціональним [графом постійної пам'яті](./agent-persistent-memory.md). Дивіться [Agent Architecture](./agent-architecture.md). | 1 | 1, плюс опціональний вихід `review` |
| [Codex](../nodes/codex-node.md) | Запускає локальний Codex CLI проти репозиторію GitHub, використовуючи токен доступу ChatGPT/Codex | 1 | 1, плюс вихід `question` |
| [OpenCode Go](../nodes/opencode-go-node.md) | Запускає OpenCode CLI проти репозиторію GitHub у захищеному контейнері, використовуючи API-ключ шлюзу OpenCode Go | 1 | 1 |
| [MCP Call](../nodes/mcp-call-node.md) | Викликає конкретний інструмент MCP безпосередньо, без вибору його через LLM | 1 | 1 |
| [RAG / Vector Store](../nodes/rag-node.md) | Вставляє, оновлює (upsert), видаляє або шукає у [vector store](../tabs/vectorstores-tab.md) Qdrant або Postgres (pgvector) для RAG | 1 | 1 |

## Logic Nodes

| Вузол | Опис | Входи | Виходи |
|------|-------------|--------|---------|
| [Condition](../nodes/condition-node.md) | Розгалуження на основі if/else | 1 | 2 (true/false) |
| [Switch](../nodes/switch-node.md) | Маршрутизація шляхом зіставлення значення з варіантами | 1 | n |
| [Merge](../nodes/merge-node.md) | Очікує кілька входів і об'єднує їх | n | 1 |
| [Loop](../nodes/loop-node.md) | Ітерує по масиву | 1 | 2 (loop/done) |

## Data Nodes

| Вузол | Опис | Входи | Виходи |
|------|-------------|--------|---------|
| [Set](../nodes/set-node.md) | Перетворює та зіставляє дані | 1 | 1 |
| [Converter](../nodes/converter-node.md) | Перетворює дані між форматами (CSV, JSON, XML) та розпізнає текст на зображеннях або PDF-файлах (OCR) | 1 | 1 |
| [Code](../nodes/code-node.md) | Запускає Python у тимчасовій, ізольованій від мережі пісочниці з власним requirements.txt | 1 | 1 |
| [Variable](../nodes/variable-node.md) | Встановлює або отримує змінну (локальну для workflow або [глобальну](./global-variables.md)) | 1 | 1 |
| [Execute](../nodes/execute-node.md) | Викликає інший workflow | 1 | 1 |
| [Heym](../nodes/heym-node.md) | Читає workflow Heym та історію виконань | 1 | 1 |

## Вузли інтеграції

| Вузол | Опис | Входи | Виходи |
|------|-------------|--------|---------|
| [HTTP](../nodes/http-node.md) | Виконуйте HTTP-запити (cURL) | 0 або 1 | 1 |
| [WebSocket Send](../nodes/websocket-send-node.md) | Підключіться до зовнішнього WebSocket і надішліть одне повідомлення | 1 | 1 |
| [Telegram](../nodes/telegram-node.md) | Надсилайте повідомлення Telegram-бота | 1 | 1 |
| [Slack](../nodes/slack-node.md) | Надсилайте повідомлення Slack | 1 | 1 |
| [Discord](../nodes/discord-node.md) | Надсилайте повідомлення Discord webhook | 1 | 1 |
| [Send Email](../nodes/send-email-node.md) | Надсилайте електронні листи через SMTP | 1 | 1 |
| [Redis](../nodes/redis-node.md) | Операції Redis (set, get, hasKey, deleteKey) | 1 | 1 |
| [Grist](../nodes/grist-node.md) | Читання/запис електронних таблиць Grist | 1 | 1 |
| [GitHub](../nodes/github-node.md) | Керуйте репозиторіями, користувачами, issues, pull requests, reviews, releases, Actions workflows і файлами через GitHub REST API | 1 | 1 |
| [Jira](../nodes/jira-node.md) | Керуйте проєктами Jira, issues, коментарями, вкладеннями, користувачами, сповіщеннями та переходами workflow через Jira REST API | 1 | 1 |
| [Linear](../nodes/linear-node.md) | Керуйте командами Linear, проєктами, issues, станами workflow і коментарями через GraphQL | 1 | 1 |
| [Google Sheets](../nodes/google-sheets-node.md) | Читання/запис Google Sheets через OAuth2 | 1 | 1 |
| [Google Drive](../nodes/google-drive-node.md) | Переглядайте, завантажуйте, оновлюйте та видаляйте файли Google Drive через OAuth2 | 1 | 1 |
| [BigQuery](../nodes/bigquery-node.md) | Виконуйте SQL-запити та вставляйте рядки в BigQuery | 1 | 1 |
| [Supabase](../nodes/supabase-node.md) | Виконуйте запити та змінюйте таблиці Supabase через PostgREST | 1 | 1 |
| [ClickHouse](../nodes/clickhouse-node.md) | Виконуйте SQL, CRUD та операції підрахунку в ClickHouse | 1 | 1 |
| [Notion](../nodes/notion-node.md) | Керуйте базами даних Notion, джерелами даних, сторінками та блоками | 1 | 1 |
| [Sentry](../nodes/sentry-node.md) | Керуйте організаціями Sentry, проєктами, командами, issues, подіями та releases | 1 | 1 |
| [Amazon S3](../nodes/amazon-s3-node.md) | Керуйте buckets і папками; переглядайте, завантажуйте, вивантажуйте, копіюйте та видаляйте об'єкти | 1 | 1 |
| [DataTable](../nodes/datatable-node.md) | Читання/запис Heym DataTables (власне сховище) | 1 | 1 |
| [Drive](../nodes/drive-node.md) | Керуйте файлами Drive: видалення, встановлення пароля, TTL, максимальна кількість завантажень, team share/unshare | 1 | 1 |

## Вузли автоматизації

| Вузол | Опис | Входи | Виходи |
|------|-------------|--------|---------|
| [Crawler](../nodes/crawler-node.md) | Збирайте дані з вебсторінок за допомогою FlareSolverr | 1 | 1 |
| [Playwright](../nodes/playwright-node.md) | Автоматизація браузера з AI step і Auto Heal | 1 | 1 |

## Службові вузли

| Вузол | Опис | Входи | Виходи |
|------|-------------|--------|---------|
| [Wait](../nodes/wait-node.md) | Затримка виконання | 1 | 1 |
| [Output](../nodes/output-node.md) | Вихідний endpoint | 1 | 1 |
| [JSON output mapper](../nodes/json-output-mapper-node.md) | Зіставляйте поля з JSON-об'єктом; єдиний термінальний вузол = тіло webhook/запуску верхнього рівня | 1 | 0 |
| [HTML output mapper](../nodes/html-output-mapper-node.md) | Відображайте HTML-сторінку; єдиний термінальний вузол = webhook відповідає text/html | 1 | 0 |
| [Chart Output](../nodes/chart-output-node.md) | Термінальний вихід віджета дашборда, який зіставляє рядки з вихідних вузлів із payload графіка | 1 | 0 |
| [Sticky Note](../nodes/sticky-note-node.md) | Додавайте markdown-нотатки на полотно (не виконується) | 0 | 0 |
| [Console Log](../nodes/console-log-node.md) | Запис у консоль бекенду | 1 | 1 |
| [Disable Node](../nodes/disable-node.md) | Вимкніть інший вузол у workflow | 1 | 1 |
| [Enable Node](../nodes/enable-node.md) | Увімкніть вимкнений вузол у workflow | 1 | 1 |
| [Throw Error](../nodes/throw-error-node.md) | Зупиніть workflow з відповіддю про помилку | 1 | 0 |

## Вузли плагінів

Вузли плагінів надаються плагінами, встановленими на інстансі. Кожен встановлений
плагін з'являється на панелі в розділі **Plugins** під власною назвою; під капотом
він відповідає одному з цих двох типів вузлів.

| Вузол | Опис | Входи | Виходи |
|------|-------------|--------|---------|
| [Plugin](../nodes/plugin-node.md) | Власна дія, надана встановленим плагіном | 1 | 1 |
| [Plugin Trigger](../nodes/plugin-trigger-node.md) | Власний trigger, наданий встановленим плагіном | 0 | 1 |

## Пов'язані розділи

- [Функції Canvas](./canvas-features.md) – Data pin, журнали виконання, увімкнення/вимкнення, виокремлення в sub-workflow
- [Вузол Agent](../nodes/agent-node.md) – Детальна довідка про вузол AI Agent
- [Архітектура Agent](./agent-architecture.md) – Sub-agents, orchestrator, skills, MCP, tool calling
- [Постійна пам'ять Agent](./agent-persistent-memory.md) – Граф знань для кожного вузла, спільний доступ і фонове виокремлення
- [Human-in-the-Loop](./human-in-the-loop.md) – Призупинення виводу agent для схвалення людиною
- [Expression DSL](./expression-dsl.md) – Посилання на дані в конфігурації вузла
- [Діалог обчислення Expression](./expression-evaluation-dialog.md) – Розширюваний редактор із живим попереднім переглядом на бекенді
- [File Upload Trigger](../nodes/file-upload-trigger-node.md) – Приймання великих multipart-завантажень через одноразові посилання
- [WebSocket Trigger](../nodes/websocket-trigger-node.md) – Тригер вихідного сокета в реальному часі
- [WebSocket Send](../nodes/websocket-send-node.md) – Надсилання повідомлень у зовнішні сокети
- [Структура Workflow](./workflow-structure.md) – Формат JSON для вузлів і ребер
- [Triggers](./triggers.md) – Усі точки входу workflow
- [Вкладка Credentials](../tabs/credentials-tab.md) – Додавання API keys для LLM, HTTP та інших вузлів
- [Спільний доступ до Credentials](./credentials-sharing.md) – Надання спільного доступу до credentials іншим користувачам
- [Portal](./portal.md) – Публікація workflow як публічних чат-інтерфейсів
- [Вкладка Vectorstores](../tabs/vectorstores-tab.md) – Створення vector stores для вузлів RAG
