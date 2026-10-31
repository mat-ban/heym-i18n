# Повний набір функцій Heym

Вичерпний огляд усіх можливостей Heym. Кожен розділ описує функцію або концепцію у кількох реченнях.

---

## Початок роботи

### [Вступ](../getting-started/introduction.md)

Heym — це інфраструктура для запуску та керування AI-агентами у production-середовищі. Ви створюєте агентні системи на візуальному canvas та запускаєте їх із упевненістю: оркеструєте агентів, автоматизуєте бізнес-процеси, досліджуєте кожне виконання та зберігаєте контроль за людьми на власній інфраструктурі. Платформа підтримує візуальні workflow, вузли з підтримкою AI ([LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Qdrant RAG](../nodes/rag-node.md)), [AI Assistant](./ai-assistant.md), інтеграції ([HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Notion](../nodes/notion-node.md), [WebSocket Send](../nodes/websocket-send-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), вхідна електронна пошта [IMAP Trigger](../nodes/imap-trigger-node.md), вихідна [Send Email](../nodes/send-email-node.md)), планування за допомогою [Cron](../nodes/cron-node.md) та чат-портали [Portal](./portal.md) для кінцевих користувачів.

Дивіться також [Core Concepts](../getting-started/core-concepts.md), [Node Types](./node-types.md) та [Third-Party Integrations](./integrations.md).

### [Чому Heym](../getting-started/why-heym.md)

Розділ «Чому Heym» проводить через життєвий цикл агента (створення, оркестрація, запуск, спостереження, оцінювання, контроль, надання доступу) та показує, що саме обробляє єдине self-hosted середовище виконання на кожному етапі. Це охоплює вузол [LLM](../nodes/llm-node.md) та [Agent Node](../nodes/agent-node.md) із викликом інструментів, Python-інструментами, з'єднаннями [MCP](../tabs/mcp-tab.md), навичками та мультиагентною оркестрацією; trigger, повторні спроби та [розподіл навантаження](./cluster.md); [Трасування](../tabs/traces-tab.md) із зазначенням вартості кожного запуску в USD та експортом через OpenTelemetry; [Оцінювання](../tabs/evals-tab.md); [контрольні точки перевірки людиною](./human-in-the-loop.md), guardrails, SSO та журнал аудиту; а також endpoint-и REST, MCP і Portal. Сторінка завершується порівнянням можливостей із n8n, Zapier та Make.com.

Дивіться також [Agent Node](../nodes/agent-node.md), [LLM](../nodes/llm-node.md), [Qdrant RAG](../nodes/rag-node.md) та [Agent Architecture](./agent-architecture.md).

### [Швидкий старт](../getting-started/quick-start.md)

Запустіть свій перший workflow за лічені хвилини: створіть workflow на вкладці [Workflows](../tabs/workflows-tab.md), додайте вузол [Input](../nodes/input-node.md), вузол [LLM](../nodes/llm-node.md) та вузол [Output](../nodes/output-node.md), після чого з'єднайте їх. Налаштуйте [LLM](../nodes/llm-node.md) за допомогою облікових даних та встановіть `userMessage` у значення `$input.text`; скористайтеся функцією Run або [AI Assistant](./ai-assistant.md), щоб виконати workflow чи згенерувати його природною мовою.

Природно поєднується з [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Output](../nodes/output-node.md) та [Expression DSL](./expression-dsl.md).

### [Core Concepts](../getting-started/core-concepts.md)

Workflow — це орієнтовані графи вузлів, з'єднаних ребрами; виконання проходить від trigger-вузлів ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) через вузли обробки до вузлів [Output](../nodes/output-node.md). Кожен вузол має тип, дані (конфігурацію) та входи/виходи; ребра визначають потік даних. Вузли посилаються на дані вищестоящих вузлів через вирази [Expression DSL](./expression-dsl.md), як-от `$nodeLabel.field`; незалежні вузли автоматично виконуються [паралельно](./parallel-execution.md).

Дивіться також [Triggers](./triggers.md), [Parallel Execution](./parallel-execution.md) та [Workflow Structure](./workflow-structure.md).

### [Запуск і розгортання](../getting-started/running-and-deployment.md)

Heym надає `run.sh` для локальної розробки (база даних у Docker, бекенд FastAPI, фронтенд Vite) та `deploy.sh` для production із Docker Compose. Обидва використовують файл `.env`; ключові змінні включають `SECRET_KEY`, `ENCRYPTION_KEY`, `DATABASE_URL` та `ALLOW_REGISTER`. Розробка працює на налаштовуваних портах фронтенду й бекенду; production обслуговує API за шляхом `/api` через контейнер фронтенду.

Дивіться також [Security](./security.md), [Enterprise](./enterprise.md) та [Settings](./user-settings.md).

### [Міграція до Heym](../getting-started/migrate-to-heym.md)

Інструмент AI Convert перетворює workflow з іншої платформи (n8n, Flowise, Dify, Langflow, sim.ai, Activepieces) або звичайний опис англійською мовою у workflow Heym, транслюючи його в реальному часі на canvas і готуючи до [завантаження та імпорту](./download-import.md). Він виконує перевірку безпеки AI, після чого генерує DSL із дотриманням обмежень на вхідні дані та швидкість. Відкрити його можна за адресою [heym.run/convert](https://heym.run/convert).

Дивіться також [Quick Start](../getting-started/quick-start.md), [Download & Import](./download-import.md) та [AI Assistant](./ai-assistant.md).

---

## Вузли

### Triggers
#### [Вхідний вузол](../nodes/input-node.md)

Вхідний вузол є точкою входу для workflow, які отримують дані від користувача або API-клієнта. Він підтримує одне або кілька вхідних полів і надає доступ до метаданих запиту (headers, query params). Доступ до полів body здійснюється через `$nodeLabel.body.fieldKey`, до headers — через `$nodeLabel.headers`, до query — через `$nodeLabel.query`.

Природно поєднується з [Condition](../nodes/condition-node.md), [LLM](../nodes/llm-node.md) та [Output](../nodes/output-node.md). Щодо посилань на payload та доступу до полів див. [Expression DSL](./expression-dsl.md) і [Webhooks](./webhooks.md).

#### [Cron](../nodes/cron-node.md)

Вузол Cron запускає workflow за розкладом, використовуючи стандартний п'ятипольний cron-вираз. Введення даних користувачем не потрібне — workflow виконується автоматично у визначені моменти часу (наприклад, щогодини, щодня, кожні 15 хвилин). Результатом є подія trigger без payload.

Див. також [Triggers](./triggers.md), [Wait](../nodes/wait-node.md) та [Execution History](./execution-history.md) для запусків за розкладом і з відтермінуванням.

#### [IMAP Trigger](../nodes/imap-trigger-node.md)

Вузол IMAP Trigger опитує поштову скриньку з налаштовуваним інтервалом у хвилинах і запускає workflow для кожного нововиявленого листа. Він виводить розібрані headers, списки відправників і одержувачів, тіла листів у форматі plain-text і HTML, метадані вкладень та часову позначку trigger. Використовуйте його для сортування звернень у скриньці підтримки, маршрутизації з поштової скриньки до [Slack](../nodes/slack-node.md) або потоків затвердження на основі електронної пошти з [Human-in-the-Loop](./human-in-the-loop.md).

Поєднується з [Send Email](../nodes/send-email-node.md), [LLM](../nodes/llm-node.md) та [Slack](../nodes/slack-node.md) для workflow вхідного сортування та відповідей.

#### [Heym Trigger](../nodes/heym-trigger-node.md)

Вузол Heym Trigger запускає workflow, коли сама платформа Heym публікує подію: `heym.started`, `workflow.created`, `workflow.updated` або `workflow.deleted`. Доставка здійснюється пакетами — кожна подія, опублікована протягом одного п'ятисекундного вікна відправлення, надходить в одному запуску як `$nodeLabel.events`, завжди у вигляді масиву. Кожна подія закріплюється через унікальне обмеження бази даних, тож вона спрацьовує рівно один раз на вузол-підписник, незалежно від кількості запущених воркерів, контейнерів чи машин. Використовуйте його для журналів аудиту змін workflow, оголошень про розгортання та зведень про стан інстансу.

Поєднується з вузлом [Heym](../nodes/heym-node.md) для пошуку зміненого workflow та з [Loop](../nodes/loop-node.md) для виконання дії один раз на подію.

#### [Heym](../nodes/heym-node.md)

Вузол Heym читає власні дані Heym через три операції: `listWorkflows` повертає кожен workflow, доступний власнику, з кількістю вузлів і часовими позначками, `getWorkflow` повертає структуру вузлів і зв'язків одного workflow, а `getExecutionHistory` повертає записи історії виконань від найновіших до найстаріших з необов'язковими фільтрами за статусом, часовим вікном і лімітом, а також підсумки, згруповані за статусом. Результати обмежуються власником workflow, у якому розташований вузол, тож запуск, ініційований cron, порталом або подією, повертає ті самі дані, що й ручний запуск. `getWorkflow` повертає повну конфігурацію вузлів, що уможливлює аудит workflow на наявність жорстко закодованих ключів або token; він не розкриває нічого, чого власник workflow не міг би й так відкрити в редакторі. Облікові дані не потрібні.

#### [WebSocket Trigger](../nodes/websocket-trigger-node.md)

Вузол WebSocket Trigger відкриває вихідне клієнтське з'єднання із зовнішнім сервером WebSocket і запускає workflow за подіями `onMessage`, `onConnected` або `onClosed`. Він надає розібрані payload повідомлень, стан повторного з'єднання, метадані закриття та URL сокета для подальших виразів.

Поєднується з [WebSocket Send](../nodes/websocket-send-node.md), [HTTP](../nodes/http-node.md) та [SSE Streaming](./sse-streaming.md) для інтеграцій у реальному часі.

#### [Telegram Trigger](../nodes/telegram-trigger-node.md)

Вузол Telegram Trigger отримує webhook-оновлення від бота та негайно запускає workflow. Він надає повний payload оновлення, основний об'єкт повідомлення, callback queries, очищені headers і часову позначку trigger. Використовуйте його для чат-ботів, AI-асистентів у [Telegram](../nodes/telegram-node.md) та потоків, керованих кнопками.

Поєднується з [Telegram](../nodes/telegram-node.md), [Agent Node](../nodes/agent-node.md) та [Webhooks](./webhooks.md) для workflow, керованих ботом.

#### [Slack Trigger](../nodes/slack-trigger-node.md)

Вузол Slack Trigger отримує webhook від Slack Events API та автоматично запускає workflow після перевірки підпису запиту. Він надає payload події та очищені headers для подальшої маршрутизації, класифікації на основі [LLM](../nodes/llm-node.md) і потоків відповідей.

Поєднується з [Slack](../nodes/slack-node.md), [Agent Node](../nodes/agent-node.md) та [Third-Party Integrations](./integrations.md).

#### [Discord Trigger](../nodes/discord-trigger-node.md)

Вузол Discord Trigger отримує webhook від Discord Interactions API, перевіряє підписи Ed25519 за допомогою вибраних облікових даних `discord_trigger` і запускає workflow. Він надає повний payload взаємодії, дані команди, очищені headers та метадані trigger для подальшої маршрутизації або відповідей.

Поєднується з [Output](../nodes/output-node.md), [Discord](../nodes/discord-node.md), [Agent Node](../nodes/agent-node.md) та [Third-Party Integrations](./integrations.md).
#### [RabbitMQ](../nodes/rabbitmq-node.md)

Вузол RabbitMQ надсилає або отримує повідомлення з черг і обмінників RabbitMQ. Використовуйте його для workflow, керованих повідомленнями, та обробки подій. Режим надсилання публікує повідомлення з необов'язковою затримкою; режим отримання діє як [trigger](./triggers.md), тож workflow запускається, коли надходить повідомлення. Виведення містить status, message_id та body.

Поєднується з [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) та [Parallel Execution](./parallel-execution.md) для обробки, керованої подіями.

#### [Error Handler](../nodes/error-handler-node.md)

Вузол Error Handler запускається автоматично, коли будь-який вузол у workflow зазнає збою. Вхідні ребра не потрібні; він активується рушієм. Виведення містить повідомлення про помилку, мітку вузла, що зазнав збою, тип вузла та часову позначку. Використовуйте його для надсилання сповіщень через [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) або [Send Email](../nodes/send-email-node.md), журналювання помилок чи повернення власних відповідей про помилки.

Як альтернативу обробці помилок на Canvas, workflow також може делегувати збої окремому workflow — див. [Error Workflow](#error-workflow). Якщо Canvas уже містить вузол Error Handler, error workflow **не** викликається (локальний обробник має пріоритет).

Типовими цілями сповіщень є [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) та [Send Email](../nodes/send-email-node.md); деталі запуску зручніше переглядати в [Execution History](./execution-history.md).

### AI

#### [Agent Node](../nodes/agent-node.md)

Вузол AI Agent — це вузол [LLM](../nodes/llm-node.md) із викликом інструментів. Він може запускати інструменти Python, викликати під'єднані вузли Canvas як інструменти, підключатися до серверів [MCP](../tabs/mcp-tab.md), використовувати навички (файли інструкцій та необов'язкові скрипти Python), діяти як оркестратор, що делегує завдання іншим вузлам агентів, і викликати інші workflow як інструменти. Виведення доступне як `$nodeLabel.text`. Необов'язковий перемикач **Extra Body** долучає об'єкт JSON із параметрами запиту, специфічними для постачальника, до кожного запиту в циклі виклику інструментів; типово він вимкнений. Необов'язковий перемикач **Use Responses API** спрямовує виклики моделі агента через Responses API, що зберігає міркування моделі між викликами інструментів, тож модель міркування зберігає свій ланцюг думок упродовж багатокрокового циклу; типово він вимкнений і працює з OpenAI та власними обліковими даними.

Інструменти-вузли Canvas дають агенту змогу викликати налаштовані вузли workflow безпосередньо з Canvas. Під'єднайте підтримуваний вузол до ручки інструментів агента, а потім позначте конкретні поля як надані агентом за допомогою значка бота. Ці поля стають параметрами інструмента під час виконання, тоді як облікові дані та непозначені поля залишаються фіксованими в конфігурації вузла.

Розділ Skills тепер містить **AI Build** для створення нових навичок, вбудовану дію редагування за допомогою AI для наявних навичок, завантаження ZIP для кожної навички та необов'язковий перемикач **Enable Drive files** для навичок, яким потрібно читати файли Heym Drive під час виконання. Модальне вікно Skill Builder транслює чат-розмову ліворуч, приймає файли, перетягнуті з кожним коментарем доопрацювання, показує живе попереднє переглядання згенерованих файлів `SKILL.md` та `.py` праворуч, може завантажити це попереднє переглядання як ZIP і зберігає завантажені файли доопрацювання назад як вбудовані ресурси навички через той самий потік приймання ZIP, що використовується для ручних завантажень.

Коли ввімкнено **[Agent Persistent Memory](./agent-persistent-memory.md)**, кожен вузол агента веде власний граф знань: факти завантажуються в системний prompt, коли він непорожній, а успішні запуски запускають фонове об'єднання нових сутностей і зв'язків. Субагенти використовують окремі графи. Ви можете **поділитися** графом агента з іншими агентами (у тому самому або інших workflow) із доступом лише для читання або для читання й запису з діалогу графа. Елемент керування мозком на Canvas відкриває редактор графа.

Вузли агентів також можуть переходити в режим [Human-in-the-Loop](./human-in-the-loop.md). У цьому режимі агент отримує інструмент `request_human_review` і може зупинятися на конкретних кроках, що потребують схвалення, створювати одноразове публічне посилання для перегляду, відкривати гілку Canvas `review` для потоків сповіщень і чекати, доки рецензент прийме, відредагує або відхилить текст перегляду у форматі Markdown. Поле HITL вузла діє як настанови щодо схвалення для визначення, коли слід запитувати, тоді як зведення для рецензента генерується з кожного запиту на перегляд. Для інструментів [MCP](../tabs/mcp-tab.md) Heym використовує модель, щоб інтерпретувати ці письмові інструкції як `always`, `once` або `never`, тож довільне формулювання схвалення відображається на конкретну політику виконання. Запуск позначається як `pending` і відновлюється зі збереженого знімка виконання після надходження рішення, і той самий запуск агента може зупинятися більше ніж один раз, якщо подальші кроки також потребують перегляду.

Вузли агентів автоматично стискають свою накопичену історію повідомлень, коли вона наближається до 80% вікна контексту моделі. Системний prompt, перше повідомлення користувача та найновіше повідомлення користувача завжди зберігаються; усе між ними підсумовується за допомогою тієї самої моделі та облікових даних. Події стискання видно на панелі Debug, у [Execution History](./execution-history.md) та на вкладці [Traces](../tabs/traces-tab.md).

Див. також [LLM](../nodes/llm-node.md), [Agent Architecture](./agent-architecture.md), [Agent Persistent Memory](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) та [File Generation](./file-generation.md).
#### [Codex](../nodes/codex-node.md)

Вузол Codex запускає OpenAI Codex CLI в ізольованому робочому просторі Heym. Він приймає облікові дані Codex (увійдіть через ChatGPT, щоб використовувати свою підписку без витрат на API за кожен token, або вставте access token), облікові дані GitHub, URL репозиторію, базову гілку, prompt завдання, режим публікації (`diff_only` або `draft_pr`), назву гілки та час очікування. Виконавець клонує репозиторій локально, передає набір token ChatGPT або `CODEX_ACCESS_TOKEN` лише процесу Codex і повертає структуроване резюме, примітки щодо валідації, змінені файли, diff, метадані використання та необов'язковий URL чернетки PR.

Коли Codex повертає `needs_input`, workflow призупиняється та відкриває гілку `question`. З'єднайте цю гілку зі Slack, електронною поштою або іншим вузлом сповіщень; публічне посилання для відповіді відновлює збережений знімок виконання після надсилання відповіді. Вузол Codex також можна приєднати до AI Agent як інструмент, дозволяючи агенту делегувати завдання з програмування; як інструмент, результат `needs_input` повертається агенту безпосередньо, а не призупиняє workflow.

Див. також [GitHub](../nodes/github-node.md), [Облікові дані](./credentials.md), [Спільний доступ до облікових даних](./credentials-sharing.md) та [Типи вузлів](./node-types.md).

#### [OpenCode Go](../nodes/opencode-go-node.md)

Вузол OpenCode Go запускає OpenCode CLI (Go) для репозиторію GitHub. Ізоляція відповідає схемі Codex: локально він виконується як хост-підпроцес, тоді як у розгортаннях Docker він працює всередині захищеного сусіднього контейнера, який спільно використовує том робочого простору. Він приймає облікові дані OpenCode Go (API-ключ шлюзу з необов'язковою базовою URL-адресою), облікові дані GitHub, URL репозиторію, базову гілку, prompt завдання, режим публікації, назву гілки, час очікування та модель `opencode-go/<model>`, обрану з живого списку моделей із пошуком (із вбудованим резервним варіантом). Heym виконує всі операції git/GitHub на хості та ніколи не розміщує token GitHub усередині пісочниці; OpenCode лише редагує файли на диску. Вузол повертає структуроване резюме, примітки щодо валідації, змінені файли, diff та необов'язковий URL pull request. Його можна приєднати до AI Agent як інструмент.

Див. також [Codex](../nodes/codex-node.md), [GitHub](../nodes/github-node.md), [Облікові дані](./credentials.md), [Спільний доступ до облікових даних](./credentials-sharing.md) та [Типи вузлів](./node-types.md).

#### [LLM](../nodes/llm-node.md)

Вузол LLM обробляє текст за допомогою мовної моделі або генерує зображення. Він підтримує генерацію тексту, зір (введення зображень), генерацію зображень, структурований вивід JSON, виконання через рідний для провайдера Batch API для підтримуваних OpenAI та OpenAI-сумісних endpoint, а також необов'язковий перемикач **Use Responses API**, який спрямовує виклик через Responses API замість Chat Completions (вимкнено за замовчуванням; працює з OpenAI та користувацькими обліковими даними і не може поєднуватися з режимом Batch). Налаштуйте облікові дані, модель, системні та користувацькі повідомлення, температуру й максимальну кількість token; використовуйте [Expression DSL](./expression-dsl.md) у prompt. У режимі batch `userMessage` має обчислюватися як масив, вузол видає гілку `batchStatus` з оновленнями прогресу, а підсумковий вивід містить результати batch за кожним елементом. Необов'язковий перемикач **Extra Body** додає об'єкт JSON із параметрами запиту, специфічними для провайдера (наприклад, `{"thinking": {"type": "disabled"}}`), до кожного виклику API; він вимкнений за замовчуванням. Необов'язкові [Guardrails](./guardrails.md) блокують небезпечний вміст перед викликом.

Природно поєднується з [Qdrant RAG](../nodes/rag-node.md), [Вузлом Agent](../nodes/agent-node.md), [Guardrails](./guardrails.md) та [Діалогом обчислення виразів](./expression-evaluation-dialog.md).

#### [Decision](../nodes/decision-node.md)

Вузол Decision ставить моделі прийняття рішень типові запитання про стан виконання та повертає ймовірності замість тексту. Поле **State** містить те, що має прочитати модель — окремий вираз зберігає власний тип, тому `$input` надсилає об'єкт, а не його текст — а список запитань містить судження. Запитання бувають трьох форм: **noul** відповідає, чи виконується умова, **choice** обирає один варіант із визначеного Вами набору та повертає повний розподіл, а **score** оцінює стан за впорядкованими рівнями й може опинитися між ними. Відповіді choice та score також містять рівень впевненості, тож [Switch](../nodes/switch-node.md) може спрямовувати за відповіддю, тоді як [Condition](../nodes/condition-node.md) перевіряє, наскільки впевненою вона була. **Generate with AI** створює шаблон стану та рядки запитань із простого речення, а **Custom request body** надсилає написаний вручну JSON для endpoint, контракт якого відрізняється. Відповідь провайдера передається без змін, і кожен виклик записується в [Трасування](../tabs/traces-tab.md).

Потребує облікових даних Decision Model; природно поєднується з [Switch](../nodes/switch-node.md), [Condition](../nodes/condition-node.md) та [Вузлом Agent](../nodes/agent-node.md).
#### [RAG / Vector Store](../nodes/rag-node.md)

Вузол RAG / Vector Store вставляє, оновлює (upsert), видаляє та шукає документи у векторному сховищі для генерації з доповненням на основі пошуку (retrieval-augmented generation). Випадний список Database обирає бекенд — **Qdrant** (зовнішній сервер) або **Postgres (pgvector)** (власна база даних Heym, без зовнішнього сервісу), за замовчуванням — Qdrant. Оберіть векторне сховище на вкладці [Vectorstores](../tabs/vectorstores-tab.md) та встановіть операцію: insert, upsert, delete або search. Upsert і delete адресують документ за унікальним id, що зберігається всередині payload — поле **Document ID Field** задає назву цього поля (за замовчуванням `doc_id`), а **Document ID** містить його значення — тож документ зберігає той id, який уже використовує Ваша система: upsert замінює кожну відповідну точку перед збереженням нової версії, а delete повідомляє, чи було знайдено збіг. Метадані документа приймають вирази у своїх значеннях, тож `{"url": "$start.url"}` зберігає те, що згенерував запуск. Search підтримує фільтри за метаданими, опціональний **Hybrid Search** (векторна схожість, поєднана зі зіставленням ключових слів BM25, завдяки чому точні терміни, такі як ідентифікатори та коди помилок, знаходяться поруч із семантичними збігами) та опціональне переранжування Cohere (reranking), повертаючи масив результатів із text, score, metadata, прапорцями reranked і hybrid та count для використання у потоках [LLM](../nodes/llm-node.md) або [Agent Node](../nodes/agent-node.md).

Типовими низхідними вузлами є [LLM](../nodes/llm-node.md) та [Agent Node](../nodes/agent-node.md); налаштування векторного сховища описано у розділі [Vectorstores](../tabs/vectorstores-tab.md).

#### [MCP Call Node](../nodes/mcp-call-node.md)

Вузол MCP Call викликає конкретний інструмент [MCP](../tabs/mcp-tab.md) безпосередньо, без участі LLM у виборі інструмента для виклику. Використовуйте його, коли на етапі проєктування точно відомо, який інструмент слід запустити — для детермінованого одноетапного виконання інструмента MCP у workflow. Налаштуйте з'єднання (SSE, Streamable HTTP або stdio; ті самі поля, що й для з'єднання MCP у [Agent Node](../nodes/agent-node.md)), натисніть **Fetch Tools**, щоб заповнити випадний список, оберіть інструмент і заповніть поля аргументів, які автоматично відображаються зі схеми вхідних даних інструмента. Кожен аргумент приймає статичне значення або [вираз DSL](./expression-dsl.md), наприклад `$userInput.body.text`. Результат доступний як `$nodeLabel.result` (об'єкт JSON, якщо його можна розібрати, інакше рядок). Вузол MCP Call не можна під'єднати до [Agent Node](../nodes/agent-node.md) як інструмент на Canvas.

Дивіться також [Agent Node](../nodes/agent-node.md), [MCP](../tabs/mcp-tab.md) та [Expression DSL](./expression-dsl.md).

### Logic

#### [Condition](../nodes/condition-node.md)

Вузол Condition розгалужує workflow на основі виразу if/else. Він має два вихідні порти: один для випадку, коли умова істинна, і один — коли хибна. Використовуйте оператори порівняння та логічні оператори з [Expression DSL](./expression-dsl.md) у виразі умови; вузол передає вхідні дані до обраної гілки.

Дивіться також [Switch](../nodes/switch-node.md), [Throw Error](../nodes/throw-error-node.md) та [Expression DSL](./expression-dsl.md).

#### [Switch](../nodes/switch-node.md)

Вузол Switch спрямовує виконання різними шляхами, зіставляючи значення з варіантами (cases). Налаштуйте вираз для обчислення та список значень варіантів; кожен варіант отримує вихідний порт, а для значень, що не збігаються, використовується порт за замовчуванням. Вхідні дані передаються до відповідної гілки.

Використовуйте [Condition](../nodes/condition-node.md) для бінарного розгалуження та [Merge](../nodes/merge-node.md) для повторного об'єднання розгалужених шляхів; правила зіставлення описано в [Expression DSL](./expression-dsl.md).

#### [Merge](../nodes/merge-node.md)

Вузол Merge очікує на кілька паралельних входів і об'єднує їх в один вихід. Задайте кількість входів, на які слід очікувати; вузол формує об'єднаний об'єкт, коли всі гілки завершаться. Використовуйте його для об'єднання результатів паралельних гілок перед продовженням; не використовуйте його, коли паралельні гілки завершуються окремими вузлами Output.

Дивіться також [Parallel Execution](./parallel-execution.md), [Loop](../nodes/loop-node.md) та [Output](../nodes/output-node.md) під час повторного об'єднання гілок.

#### [Loop](../nodes/loop-node.md)

Вузол Loop виконує ітерацію над масивом, запускаючи низхідні вузли для кожного елемента. Для переходу далі потрібне зворотне з'єднання від останнього вузла в тілі ітерації. Усередині тіла циклу використовуйте `item`, `index`, `total`, `isFirst` та `isLast`; цикл має окремі виходи для шляху ітерації та шляху завершення.

Поєднується з [Variable](../nodes/variable-node.md), [Merge](../nodes/merge-node.md) та [Expression DSL](./expression-dsl.md) для ітеративних workflow.

### Data

#### [Set](../nodes/set-node.md)

Вузол Set перетворює та зіставляє вхідні дані з користувацьким виходом. Визначте зіставлення ключ-значення, де кожне значення є виразом [Expression DSL](./expression-dsl.md). Використовуйте його для перетворення в верхній регістр, виділення підрядка, конкатенації, генерації випадкових чисел та подібних трансформацій. Доступ до виходу здійснюється за ключем (наприклад, `$setNode.keyName`). Коли вузол під'єднано до агента як інструмент на Canvas, значення зіставлення можна позначити як надані агентом, щоб агент заповнював їх під час виконання. Для виклику інших workflow використовуйте натомість вузол [Execute](../nodes/execute-node.md).

Дивіться також [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) та [Expression DSL](./expression-dsl.md).
#### [Converter](../nodes/converter-node.md)

Вузол Converter перетворює дані між форматами без написання коду. Текстові перетворення — це `csvToJson` (текст CSV у масив об'єктів-рядків або масивів, якщо заголовок відсутній), `jsonToCsv` (масив об'єктів/рядків у текст CSV), `xmlToJson` (текст XML в об'єкт) та `jsonToXml` (об'єкт у текст XML). Налаштуйте напрямок перетворення та вираз джерела; перетворення CSV додатково використовують роздільник і обробку заголовків, а `jsonToCsv` може закріпити явний порядок стовпців. Лапкування, вбудовані роздільники та вбудовані символи нового рядка відповідають RFC 4180. Атрибути XML використовують префікси `@`, текст у поєднанні з атрибутами використовує `#text`, повторювані елементи стають масивами, а розгортання сутностей XML вимкнено. Цей самий вузол також працює зі збереженими файлами. `imageToText` та `pdfToText` запускають Tesseract OCR, читаючи файл із Heym Drive (`$Upload.file.id` від Trigger «File upload», результату вузла Drive або згенерованого агентом файлу), автоматично вибираючи мову за виявленим письмом або використовуючи вказані Вами коди, як-от `tur` чи `eng+tur`, і за замовчуванням нормалізуючи текст до UTF-8 з необов'язковою нормалізацією NFC та вужчими наборами символів, як-от `cp1254`. `fileConvert` перезаписує збережений файл в іншому форматі — документи через pandoc, а зображення через Pillow — і зберігає результат як новий файл на Drive, не торкаючись оригіналу. Результат доступний як `$converterNode.result`, а поруч із ним для запусків OCR — `.language`, `.encoding`, `.page_count`, `.pages` та `.file`, а для `fileConvert` — `.id`, `.filename` і `.download_url`.

Див. також [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md) та [Expression DSL](./expression-dsl.md).

#### [Code](../nodes/code-node.md)

Вузол Code виконує написаний Вами Python із власним `requirements.txt` у контейнері, який створюється та знищується для кожного виконання. Ваш код визначає функцію `main(params)` і повертає будь-яке значення, серіалізовне в JSON, яке стає `$codeNode.result`; усе, що він виводить, окремо захоплюється як `$codeNode.logs`, а `$codeNode.install` повідомляє, який інструмент встановив залежності. Параметри налаштовуються як об'єкт JSON, вирази `$` якого обчислюються перед запуском, а код читає їх через точкову нотацію, як-от `params.user.name` або `params.orders[0].id`. Залежності встановлюються за допомогою `uv` з відкатом до `pip` для пакетів, які `uv` не може обробити, без кешування між запусками; залишення `requirements.txt` порожнім повністю пропускає встановлення і є значно швидшим. Фаза виконання не має мережі, якщо не увімкнено `codeAllowNetwork`, тоді як встановлення залежностей завжди звертається до PyPI. Пісочниця працює від імені не-root з усіма відкликаними можливостями, файловою системою лише для читання, без Docker-сокета та без доступу до секретів бекенду, з обмеженням у 512 МБ пам'яті, один CPU, 256 процесів, 120 секунд на встановлення та 60 секунд на виконання. Docker є обов'язковим, і резервного режиму немає: без доступного демона вузол зазнає невдачі, а не запускає Ваш код у процесі бекенду.

#### [Variable](../nodes/variable-node.md)

Вузол Variable встановлює або оновлює локальну для workflow змінну (`$vars.variableName`) чи постійну [глобальну змінну](./global-variables.md) (`$global.variableName`). Використовуйте його для лічильників, накопичуваних списків і спільного стану. Налаштуйте ім'я змінної, вираз значення, приведення типу та те, чи зберігати в глобальному сховищі. Масивні змінні підтримують `$array()` та `.add()`.

Поєднується з [Set](../nodes/set-node.md), [Loop](../nodes/loop-node.md) та [Global Variables](./global-variables.md).

#### [Execute](../nodes/execute-node.md)

Вузол Execute викликає інший workflow (sub-workflow) і передає йому вхідні дані. Вкажіть цільовий workflow за ID та надайте вхідні дані через єдиний вираз або відображення ключ-значення. Вивід містить workflow_id, status та outputs; використовуйте його для логіки, що повторно використовується, а не для перетворення даних (для цього використовуйте Set).

Див. також [Canvas Features](./canvas-features.md) щодо Extract to Sub-Workflow, [Workflow Structure](./workflow-structure.md) та [Output](../nodes/output-node.md).

### Integrations

#### [HTTP](../nodes/http-node.md)

Вузол HTTP виконує HTTP-запити, використовуючи конфігурацію у стилі cURL. Він може бути початковою точкою workflow (без вхідного ребра) або отримувати вхідні дані від вузлів вище за потоком. Відповідь доступна як status, headers і body (з розібраним JSON, коли це застосовно). Використовуйте [Credentials](./credentials.md) для автентифікації Bearer або через власний заголовок.

Поєднується з [Webhooks](./webhooks.md), [Credentials](./credentials.md) та [Third-Party Integrations](./integrations.md).

#### [WebSocket Send](../nodes/websocket-send-node.md)

Вузол WebSocket Send відкриває вихідне клієнтське з'єднання, надсилає одне текстове/JSON/бінарне повідомлення та закриває його. Використовуйте його для публікації виводу workflow в системи реального часу без створення розміщеного в Heym кінцевого вузла socket.

Див. також [WebSocket Trigger](../nodes/websocket-trigger-node.md), [SSE Streaming](./sse-streaming.md) та [Third-Party Integrations](./integrations.md).
#### [Telegram](../nodes/telegram-node.md)

Вузол Telegram надсилає повідомлення бота до чату, групи або каналу. Налаштуйте [облікові дані](./credentials.md) Telegram, вкажіть `chatId` та скомпонуйте вихідне `message` за допомогою виразів [Expression DSL](./expression-dsl.md). Він природно поєднується з [Telegram Trigger](../nodes/telegram-trigger-node.md) для діалогових workflow та з [Error Handler](../nodes/error-handler-node.md) для сповіщень операторів.

Дивіться також [Third-Party Integrations](./integrations.md) та [Credentials](./credentials.md) щодо налаштування та шаблонів облікових даних.

#### [Slack](../nodes/slack-node.md)

Вузол Slack надсилає повідомлення до каналу Slack через Incoming Webhook. Налаштуйте [облікові дані](./credentials.md) Slack та вираз повідомлення. Використовуйте його для сповіщень, оповіщень та звітування про помилки; вихідні дані проходять наскрізь без змін.

Поєднується з [Slack Trigger](../nodes/slack-trigger-node.md), [Error Handler](../nodes/error-handler-node.md) та [Third-Party Integrations](./integrations.md).

#### [Discord](../nodes/discord-node.md)

Вузол Discord надсилає повідомлення до каналу Discord через Incoming Webhook. Налаштуйте [облікові дані](./credentials.md) Discord, скомпонуйте вихідне повідомлення за допомогою [Expression DSL](./expression-dsl.md) та за потреби вкажіть перевизначення імені користувача або аватара webhook.

Поєднується з [Discord Trigger](../nodes/discord-trigger-node.md), [Output](../nodes/output-node.md), [Error Handler](../nodes/error-handler-node.md) та [Third-Party Integrations](./integrations.md).

#### [Send Email](../nodes/send-email-node.md)

Вузол Send Email надсилає електронні листи через SMTP. Налаштуйте [облікові дані](./credentials.md) SMTP та вирази [Expression DSL](./expression-dsl.md) для одержувача(-ів), теми та тіла листа. Використовуйте його для сповіщень, оповіщень та транзакційних листів. Вихідні дані містять статус, одержувача та тему.

[IMAP Trigger](../nodes/imap-trigger-node.md) доповнює Send Email, обробляючи вхідну пошту. Разом вони дають змогу workflow читати вхідні листи зі спільної скриньки, підсумовувати або класифікувати їх за допомогою AI-вузлів та надсилати відповідь або повідомлення про ескалацію. [Telegram Trigger](../nodes/telegram-trigger-node.md) та [вузол Telegram](../nodes/telegram-node.md) забезпечують такий самий шаблон вхідних/вихідних даних для чат-workflow, керованих ботом.

Для двосторонніх потоків сповіщень він також добре поєднується з [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) та [Third-Party Integrations](./integrations.md).

#### [Redis](../nodes/redis-node.md)

Вузол Redis виконує операції Redis: set, get, hasKey та deleteKey. Використовуйте його для кешування, обмеження швидкості та зберігання ключ-значення. Налаштуйте [облікові дані](./credentials.md), тип операції, вираз ключа, а для операцій set — значення та необов'язковий TTL. Вихідні дані залежать від операції (value, success, exists, deleted).

Поєднується з [Wait](../nodes/wait-node.md), [Variable](../nodes/variable-node.md) та [Parallel Execution](./parallel-execution.md) для кешування, обмеження швидкості та координації.

#### [Grist](../nodes/grist-node.md)

Вузол Grist читає, записує та керує даними в електронних таблицях Grist. Операції включають getRecord, getRecords, createRecord, updateRecord, deleteRecord, listTables та listColumns. Вкажіть ідентифікатор документа, ідентифікатор таблиці, а для create/update — дані запису з використанням ідентифікаторів стовпців. Використовуйте його для CRUD, пакетних оновлень та автоматизації електронних таблиць.

Дивіться також [Google Sheets](../nodes/google-sheets-node.md), [DataTable](../nodes/datatable-node.md) та [Third-Party Integrations](./integrations.md).

#### [Google Sheets](../nodes/google-sheets-node.md)

Вузол Google Sheets читає, записує та керує даними електронних таблиць через OAuth2. Використовуйте його для читання звітів, додавання результатів workflow, оновлення трекерів та очищення або перегляду аркушів таблиці зсередини workflow. Як і [BigQuery](../nodes/bigquery-node.md), він використовує облікові дані інтеграції на базі Google і добре поєднується з [Grist](../nodes/grist-node.md), коли дані електронних таблиць є частиною потоку.

Поєднується з [Grist](../nodes/grist-node.md), [DataTable](../nodes/datatable-node.md) та [Third-Party Integrations](./integrations.md).

#### [BigQuery](../nodes/bigquery-node.md)

Вузол BigQuery виконує SQL-запити та вставляє рядки до наборів даних Google BigQuery через OAuth2. Він корисний для аналітичних workflow, конвеєрів звітування та запису структурованих даних подій із запусків workflow. Він часто поєднується з [Set](../nodes/set-node.md) для формування рядків та [Google Sheets](../nodes/google-sheets-node.md) для легшого звітування на основі електронних таблиць.

Поєднується з [Set](../nodes/set-node.md), [LLM](../nodes/llm-node.md), [Google Sheets](../nodes/google-sheets-node.md) та [Third-Party Integrations](./integrations.md).
#### [Google Drive](../nodes/google-drive-node.md)

Вузол Google Drive дозволяє переглядати, завантажувати, оновлювати та видаляти файли й папки Drive через OAuth2, а також може копіювати файл Drive безпосередньо до [Heym Drive](../nodes/drive-node.md) за допомогою операції `syncToHeymDrive`. Google Docs, Sheets і Slides не мають байтів, доступних для завантаження, тому вузол експортує їх автоматично — Docs у PDF, Sheets у XLSX, Slides у PPTX — з можливістю перевизначити цільовий формат. Видалення переміщує об'єкти до кошика Drive, якщо не ввімкнено опцію "Delete permanently", а вузол відмовляється видаляти папку через операцію для файлів або навпаки. Як і [Google Sheets](../nodes/google-sheets-node.md), він використовує облікові дані OAuth2 на базі Google; зверніть увагу, що цей вузол запитує повний доступ до Drive, тому перед наданням спільного доступу ознайомтеся з розділом [Credential Sharing](./credentials-sharing.md).

Поєднується з [Loop](../nodes/loop-node.md), [Drive](../nodes/drive-node.md), [LLM](../nodes/llm-node.md) та [Third-Party Integrations](./integrations.md).

#### [GitHub](../nodes/github-node.md)

Вузол GitHub надає 40 нативних дій GitHub REST, що охоплюють репозиторії, організації та користувачів, issues, pull requests, рецензії, релізи, workflow Actions, аналітику трафіку та файли репозиторіїв. Використовуйте його для тріажу issues, автоматизації рецензування, запуску workflow та очікування їх завершення, автоматизації релізів і оновлення файлів репозиторію без ручного створення HTTP-запитів. Він підтримує GitHub.com та необов'язковий `base_url` для GitHub Enterprise в облікових даних.

Поєднується з [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Set](../nodes/set-node.md) та [Third-Party Integrations](./integrations.md).

#### [Jira](../nodes/jira-node.md)

Вузол Jira з'єднує workflow з Jira Cloud або Jira Data Center / Server REST API для автоматизації проєктів, issues, коментарів, вкладень, користувачів, сповіщень і переходів. Він дозволяє переглядати проєкти, шукати issues за допомогою JQL, створювати або оновлювати issues, переглядати журнали змін, сповіщати зацікавлених осіб, керувати коментарями та вкладеннями, отримувати або керувати користувачами, переглядати доступні переходи та переміщувати issues за допомогою ідентифікатора переходу. Використовуйте облікові дані Jira з електронною поштою Atlassian, API token, базовою URL-адресою сайту та режимом розгортання.

Поєднується з [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) та [Third-Party Integrations](./integrations.md) для приймання звернень до підтримки, тріажу багів і workflow релізів.

#### [Linear](../nodes/linear-node.md)

Вузол Linear з'єднує workflow з GraphQL API Linear для автоматизації робочого простору та issues. Він дозволяє переглядати команди, проєкти, issues, стани workflow, учасників команд і коментарі; створювати, оновлювати, видаляти та пов'язувати issues; а також створювати, оновлювати, вирішувати, скасовувати вирішення або видаляти коментарі. Використовуйте особистий API key Linear або облікові дані OAuth2, після чого визначте UUID команд, проєктів, станів і виконавців за допомогою операцій перегляду, перш ніж створювати або оновлювати issues.

Поєднується з [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) та [Third-Party Integrations](./integrations.md) для приймання звернень, тріажу та workflow інженерного беклогу.

#### [Supabase](../nodes/supabase-node.md)

Вузол Supabase читає та змінює таблиці, відкриті через Supabase PostgREST. Він добре підходить для продуктових бекендів, даних користувачів і профілів, стану workflow та автоматизацій у стилі CRUD, які потребують доступу до бази даних без ручного налаштування HTTP-запитів.

Поєднується з [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md), [HTTP](../nodes/http-node.md) та [Third-Party Integrations](./integrations.md).

#### [ClickHouse](../nodes/clickhouse-node.md)

Вузол ClickHouse виконує операції CRUD, підрахунку та сирого SQL щодо зовнішньої бази даних ClickHouse через її HTTP-інтерфейс. Він підходить для аналітичних конвеєрів, журналювання подій і workflow звітності: вставляйте події в міру їх виникнення, а потім агрегуйте або підраховуйте їх за допомогою `query`/`count`. Він повторює набір операцій [DataTable](../nodes/datatable-node.md) (find, getAll, count, getById, insert, update, remove, upsert) плюс можливість виконання сирого SQL, причому `update`/`remove` виконуються як мутації ClickHouse.

Поєднується з [Set](../nodes/set-node.md), [Cron](../nodes/cron-node.md) для запланованих звітів та [Third-Party Integrations](./integrations.md).

#### [Notion](../nodes/notion-node.md)

Вузол Notion керує базами даних, джерелами даних, сторінками та блоками Notion через поточний API Notion (`2026-03-11`). Він підтримує пошук, CRUD сторінок, операції з базами даних і джерелами даних, дочірні блоки, додавання/оновлення/видалення блоків, а також переміщення до кошика/відновлення. Використовуйте внутрішній integration token або облікові дані OAuth2 публічної інтеграції Notion. Редактор може шукати та посторінково переглядати доступні джерела даних і батьківські сторінки за допомогою курсора. Спільні облікові дані працюють так само, як і власні, для виконання workflow.

Для власних REST-викликів `$credentials.YourNotionCredential` розв'язується в той самий bearer token. Поєднується з [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [LLM](../nodes/llm-node.md) та [Third-Party Integrations](./integrations.md).
#### [Sentry](../nodes/sentry-node.md)

Вузол Sentry автоматизує роботу з організаціями, проєктами, командами, інцидентами, подіями та релізами Sentry через Sentry REST API. Використовуйте його для тріажу сповіщень, оновлення статусів інцидентів, автоматизації релізів, пошуку подій, а також налаштування чи очищення проєктів і команд. Він підтримує Sentry SaaS та self-hosted Sentry через необов'язкову базову URL-адресу в облікових даних.

Поєднується з [Error Handler](../nodes/error-handler-node.md), [Slack](../nodes/slack-node.md), [Linear](../nodes/linear-node.md) та [Third-Party Integrations](./integrations.md) для workflow опрацювання інцидентів і релізів.

#### [DataTable](../nodes/datatable-node.md)

Вузол DataTable читає, записує та керує даними в Heym DataTables (власне структуроване сховище). Операції включають find, getAll, getById, insert, update, remove та upsert. Зовнішні облікові дані не потрібні. Таблиці керуються з dashboard-вкладки [DataTable](../tabs/datatable-tab.md) та доступні безпосередньо власнику workflow.

Поєднується з [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md) та [вкладкою DataTable](../tabs/datatable-tab.md) для власного структурованого сховища.

#### [Drive](../nodes/drive-node.md)

Вузол Drive керує файлами, згенерованими навичками, безпосередньо з workflow. Операції включають delete, setPassword, setTtl, setMaxDownloads, shareWithMyTeams та unshareWithMyTeams для керування доступом команд у режимі лише для читання; конвертація форматів виконується у вузлі [Converter](../nodes/converter-node.md). Посилайтеся на файл за допомогою `$agentLabel._generated_files[0].id`; вихідні дані включають status, file_id, оновлений download_url для обмежень посилання та shared_team_count для спільного доступу команд. Це особливо корисно у workflow з [Agent Node](../nodes/agent-node.md), які використовують [File Generation](./file-generation.md) та модель посилань [Drive](./drive.md).

Зазвичай використовується разом із [Agent Node](../nodes/agent-node.md), [File Generation](./file-generation.md) та [Drive](./drive.md).

#### [Amazon S3](../nodes/amazon-s3-node.md)

Вузол Amazon S3 виконує операції з об'єктним сховищем Amazon S3, використовуючи облікові дані `s3` (access key, secret key, region, необов'язковий session token). Операції включають putObject, getObject, deleteObject, listObjects, copyObject, createBucket, deleteBucket, createFolder, deleteFolder, getAllFolder та listBuckets. Підтримується завантаження тексту та завантаження тексту або base64, причому поля bucket і key приймають [Expression DSL](./expression-dsl.md). Використовуйте його для зберігання результатів workflow, архівування файлів і читання об'єктів назад у потік.

Поєднується з [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [Credentials](./credentials.md) та [Third-Party Integrations](./integrations.md).

### Автоматизація

#### [Crawler](../nodes/crawler-node.md)

Вузол Crawler збирає вебсторінки за допомогою FlareSolverr з необов'язковим вилученням HTML через CSS-селектори. Налаштуйте [облікові дані](./credentials.md) FlareSolverr, вираз URL, час очікування та необов'язкові селектори для вилучення. Результатом є необроблений HTML або вилучений вміст. Використовуйте його для вебскрейпінгу та вилучення вмісту.

Поєднується з [HTTP](../nodes/http-node.md), [Playwright](../nodes/playwright-node.md) та [LLM](../nodes/llm-node.md) для потоків збору й аналізу.

#### [Playwright](../nodes/playwright-node.md)

Вузол Playwright автоматизує взаємодію з браузером за допомогою налаштовуваних кроків (navigate, refresh, click, type, screenshot, extract, aiStep) або режиму **Run Code** для власного коду Playwright Python (у пісочниці; вимкнено за замовчуванням через `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED`). Він підтримує headless-режим, необов'язкове налаштування, що зменшує типові сигнали автоматизації Playwright, тайм-аути, необов'язковий перехоплення мережевих даних (responses, cookies, localStorage, sessionStorage), початкове налаштування автентифікації через cookie/storageState з виразів [Global Variables](./global-variables.md), як-от `$global.authState`, резервні кроки входу в разі невдалого відновлення автентифікації та крок AI з Auto Heal, коли селектори не спрацьовують. Використовуйте його для вебскрейпінгу, заповнення форм і браузерних workflow.

Дивіться також [Crawler](../nodes/crawler-node.md), [HTTP](../nodes/http-node.md) та [Execution History](./execution-history.md) для автоматизації браузера й налагодження.

### Утиліти

#### [Output](../nodes/output-node.md)

Вузол Output є кінцевою точкою workflow, яка повертає відповідь викликачу. Задайте вираз повідомлення, щоб посилатися на попередній вузол за міткою (ніколи не використовуйте тут `$input` з вузла [Input](../nodes/input-node.md)). Необов'язковий асинхронний низхідний потік дозволяє вузлам після output виконуватися у фоновому режимі після надсилання відповіді.

Типовими джерелами вище за потоком є [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md) та [Execute](../nodes/execute-node.md); формування відповіді легше налагоджувати в [Expression Evaluation Dialog](./expression-evaluation-dialog.md).

#### [JSON output mapper](../nodes/json-output-mapper-node.md)

Вузол JSON output mapper створює звичайний JSON-об'єкт із зіставлень ключ-значення у стилі [Set](../nodes/set-node.md) і повертає його в корені відповіді workflow. Використовуйте його, коли викликач API має отримати необроблене тіло JSON замість стандартної обгортки вузла [Output](../nodes/output-node.md).
#### [Вузол виведення HTML](../nodes/html-output-mapper-node.md)

Вузол виведення HTML рендерить один HTML-шаблон, інтерполюючи вирази `$nodeLabel.field` у сторінку. Коли він є єдиним термінальним вузлом workflow, execute webhook відповідає `text/html` та налаштованим для вузла кодом стану замість тіла JSON, тож workflow може обслуговувати сторінку безпосередньо для браузера. Надішліть `X-Simple-Response: false`, щоб отримати звичайний конверт JSON для налагодження.

Поєднується з [Set](../nodes/set-node.md), [Output](../nodes/output-node.md), [Workflow Structure](./workflow-structure.md) та [Webhooks](./webhooks.md).

#### [Виведення діаграми](../nodes/chart-output-node.md)

Вузол виведення діаграми є термінальним вузлом workflow віджета [Dashboard](../tabs/dashboard-tab.md). Він перетворює рядки, створені вузлами вище за потоком, на стандартизований payload діаграми, який рендерить dashboard. Виберіть `chartType` (bar, line, area, pie, table, numeric, gauge, scatter, proportion, bar gauge, Gantt, entity relationships, text або HITL), зіставте `labelField`/`valueField` (або `series` для багатосерійних діаграм, або `text` для повідомлення markdown) і розмістіть його останнім; він не має вихідного ребра. Gantt зчитує рядки завдань із датами початку/завершення ISO, прогресом та ідентифікаторами залежностей. Entity relationships зчитує об'єкт графа з сутностями, полями, ключами PK/FK та зв'язками. Обидва варіанти також відображаються на сторінках Heym Work та у попередньому перегляді пропозицій віджетів. HITL ігнорує рядки вище за потоком і показує ваші очікувані людські перевірки. а інший як кнопки посилання, що відкривають URL-адресу на новій вкладці (`linkColumn`, з `linkLabel` для тексту кнопки)

Дивіться також [Dashboard](../tabs/dashboard-tab.md), [Set](../nodes/set-node.md) та [Output](../nodes/output-node.md).

#### [Wait](../nodes/wait-node.md)

Вузол Wait призупиняє виконання workflow на вказаний проміжок часу в мілісекундах, до 15 хвилин. Використовуйте його для обмеження швидкості, відкладених дій або інтервалів опитування. Він передає вхідні дані без змін.

Поєднується з [Cron](../nodes/cron-node.md), [Redis](../nodes/redis-node.md) та [Parallel Execution](./parallel-execution.md) для регулювання темпу та опитування.

#### [Стікер](../nodes/sticky-note-node.md)

Вузол стікера додає нотатки markdown на canvas. Він не виконується. Використовуйте його для документації, інструкцій або нотаток workflow поряд з іншими [Canvas Features](./canvas-features.md). Двічі клацніть на canvas, щоб редагувати вміст нотатки.

Дивіться також [Canvas Features](./canvas-features.md), [Keyboard Shortcuts](./keyboard-shortcuts.md) та [Workflow Organization](./workflow-organization.md).

#### [Console Log](../nodes/console-log-node.md)

Вузол Console Log записує значення в консоль бекенду (сервера). Використовуйте його для налагодження та перевірки під час розробки. Повідомлення журналу підтримує вирази [Expression DSL](./expression-dsl.md); вихідні дані передаються без змін із вхідних.

Поєднується з [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md) та [Expression Evaluation Dialog](./expression-evaluation-dialog.md) для налагодження.

#### [Вимкнення вузла](../nodes/disable-node.md)

Вузол вимкнення вузла назавжди вимикає інший вузол у workflow, встановлюючи його прапорець `active` у значення false. Вкажіть цільовий вузол за міткою. Використовуйте його для одноразових операцій, як-от зупинка trigger [Cron](../nodes/cron-node.md) після виконання умови.

Дивіться також [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md) та [Cron](../nodes/cron-node.md) для шаблонів керування workflow.

#### [Увімкнення вузла](../nodes/enable-node.md)

Вузол увімкнення вузла знову вмикає інший вузол, встановлюючи його прапорець `active` у значення true та зберігаючи зміну. Вкажіть цільовий вузол за міткою. Використовуйте його, щоб повторно активувати вимкнений trigger [Cron](../nodes/cron-node.md) з іншої точки входу або щоб увімкнути вузол після виконання умови. Ціль, що розташована нижче за потоком від вузла увімкнення і ще не виконувалася, також виконується в поточному запуску.

Дивіться також [Disable Node](../nodes/disable-node.md), [Canvas Features](./canvas-features.md) та [Cron](../nodes/cron-node.md) для шаблонів керування workflow.

#### [Викинути помилку](../nodes/throw-error-node.md)

Вузол викидання помилки негайно зупиняє виконання workflow та повертає відповідь про помилку з користувацьким кодом стану HTTP. Задайте вираз повідомлення про помилку та код стану (наприклад, 400, 401, 403, 404, 429, 500). Використовуйте його для помилок валідації, несанкціонованого доступу або інших умов помилки, особливо в поєднанні з [Condition](../nodes/condition-node.md) та [Error Handler](../nodes/error-handler-node.md).

Поєднується з [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) та [Security](./security.md) для явних шляхів збою.

---

## Довідник
### [Типи вузлів](./node-types.md)

Heym надає різноманітні типи вузлів: тригери, як-от [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) та [Error Handler](../nodes/error-handler-node.md); AI-вузли, як-от [LLM](../nodes/llm-node.md), [Decision](../nodes/decision-node.md), [Agent Node](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Qdrant RAG](../nodes/rag-node.md) та [MCP Call](../nodes/mcp-call-node.md); логічні вузли, як-от [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Merge](../nodes/merge-node.md) та [Loop](../nodes/loop-node.md); вузли даних, як-от [Set](../nodes/set-node.md), [Converter](../nodes/converter-node.md), [Code](../nodes/code-node.md), [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) та [Heym](../nodes/heym-node.md); інтеграції, як-от [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), [Discord](../nodes/discord-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md), [Grist](../nodes/grist-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Drive](../nodes/google-drive-node.md), [BigQuery](../nodes/bigquery-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [DataTable](../nodes/datatable-node.md) та [Drive](../nodes/drive-node.md); вузли автоматизації, як-от [Crawler](../nodes/crawler-node.md) та [Playwright](../nodes/playwright-node.md); а також утиліти, як-от [Wait](../nodes/wait-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md), [HTML output mapper](../nodes/html-output-mapper-node.md), [Console Log](../nodes/console-log-node.md), [Throw Error](../nodes/throw-error-node.md), [Disable Node](../nodes/disable-node.md), [Enable Node](../nodes/enable-node.md) та [Sticky Note](../nodes/sticky-note-node.md). Використовуйте вирази на кшталт `$input.text` та `$nodeLabel.field` у конфігурації вузлів.

Дивіться також [Тригери](./triggers.md), [Сторонні інтеграції](./integrations.md) та [Паралельне виконання](./parallel-execution.md).

### [Expression DSL](./expression-dsl.md)

Heym використовує просту мову виразів для посилання на дані з попередніх вузлів. Використовуйте `$input` для вузла [Input](../nodes/input-node.md), `$nodeLabel.field` для будь-якого попереднього вузла, `$credentials.CredentialName` для [облікових даних](./credentials.md) та `$global.variableName` для [глобальних змінних](./global-variables.md). Вбудовані спеціальні змінні включають `$now`, `$UUID` та метадані workflow: `$workflowName`, `$workflowDescription`, `$workflowPath`, `$workflowUrl` і `$executionId` (ідентифікатор [історії виконання](./execution-history.md) цього запуску — `/workflows/{id}/{executionId}` відкриває цей запуск на canvas; доступний лише під час виконання, порожній у діалозі попереднього перегляду виразів). Підтримуються літерали, арифметичні операції, порівняння, контекст [Loop](../nodes/loop-node.md), вкладені поля та рядкові/масивні хелпери (зокрема `$text.toJson()` для парсингу JSON-рядка). Коли повне значення є єдиним `$expr`, бекенд зберігає масиви, об'єкти, булеві значення та числа як нативні типи.

Дивіться також [Діалог обчислення виразів](./expression-evaluation-dialog.md), [Глобальні змінні](./global-variables.md) та [Структура workflow](./workflow-structure.md).

### [Глобальні змінні](./global-variables.md)

Сховище глобальних змінних зберігає постійні дані типу «ключ-значення» в межах користувача, які зберігаються між виконаннями workflow. Створюйте змінні на вкладці [Змінні](../tabs/global-variables-tab.md) або за допомогою вузла [Variable](../nodes/variable-node.md) з увімкненим параметром «Store in Global Variable Store». Отримуйте до них доступ за допомогою `$global.variableName` у виразах; ними можна поділитися з іншими користувачами або [командами](./teams.md).

Поєднується з [Variable](../nodes/variable-node.md), [Командами](./teams.md) та [Спільним доступом до облікових даних](./credentials-sharing.md) для спільного стану workflow.
### [Діалог обчислення виразів](./expression-evaluation-dialog.md)

Діалог обчислення виразів — це розгортуваний редактор, який з'являється після натискання кнопки розгортання поруч із полями виразів. Він відкривається як велике модальне вікно по центру, підтримує активне автодоповнення та автоматично оновлює результат попереднього перегляду з бекенду після паузи у введенні. Результати у вигляді об'єктів і масивів можна переглядати за допомогою засобу вибору шляху виводу. Діалог приймає повний рядок із голим шляхом через крапку (наприклад, `myNode.output.field`) так, ніби це `$myNode.output.field`; див. правила розміщення в [Expression DSL](./expression-dsl.md).

Кнопка **Build with AI** на панелі інструментів дозволяє описати потрібний вираз звичайним текстом. Виберіть [облікові дані](./credentials.md) та модель LLM, введіть опис, наприклад *"Get the customer name from the API response"*, і натисніть Generate. Бекенд надсилає моделі контекст [Expression DSL](./expression-dsl.md) та виводи вузлів з останнього запуску й повертає один рядок виразу. Результат обчислюється негайно, тож його можна перевірити перед натисканням Apply.

Природно поєднується з [Expression DSL](./expression-dsl.md), [Output](../nodes/output-node.md) та [JSON output mapper](../nodes/json-output-mapper-node.md).

### [Структура Workflow](./workflow-structure.md)

Workflow зберігаються як JSON із вузлами та ребрами. Об'єкт workflow містить id, name, description, nodes, edges та налаштування автентифікації. Кожен вузол має id, type, position і data (label та конфігурацію, специфічну для типу). Ребра з'єднують ідентифікатори вихідного та цільового вузлів з необов'язковими ідентифікаторами handle. Синтаксис виразів у полях data відповідає [Expression DSL](./expression-dsl.md), і ця сама структура використовується в [Download & Import](./download-import.md).

Див. також [Node Types](./node-types.md), [Expression DSL](./expression-dsl.md) та [Download & Import](./download-import.md).

### [Можливості Canvas](./canvas-features.md)

Наведіть курсор на будь-який не-sticky вузол на canvas і натисніть **Run**, щоб виконати обчислення до цього вузла включно. Обов'язкові вхідні дані відкриваються на панелі Run із фокусом на першому полі; шляхи без вхідних даних запускаються негайно. Див. [Run to Node](./canvas-features.md#run-to-node).

Редактор workflow надає Data Pin (закріплення останнього виводу вузла для тестування наступних етапів без повторного запуску), Execution Logs (результати вузлів у реальному часі та прогрес агента, що доповнюють [Execution History](./execution-history.md)), Enable/Disable (пропуск вузлів під час виконання) та Extract to Sub-Workflow (переміщення виділення до нового workflow із заміною на вузол [Execute](../nodes/execute-node.md)). Запущене production-виконання можна відкрити з History або картки на Board; редактор відновлює його поточний знімок, підключається до SSE та підтримує анімацію canvas і логи Debug в активному стані. [Keyboard Shortcuts](./keyboard-shortcuts.md) підтримують копіювання, вставлення, запуск і вбудований пошук вузлів.

Див. також [Keyboard Shortcuts](./keyboard-shortcuts.md), [Edit History](./edit-history.md) та [Execution History](./execution-history.md).

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Watch Editor demo</a></p>

### [Keyboard Shortcuts](./keyboard-shortcuts.md)

Heym надає скорочення в усьому редакторі: Command Palette (Ctrl+K), Run (Ctrl+Enter), Save (Ctrl+S), Undo/Redo та Escape для закриття. На canvas: вибрати все, множинний вибір, копіювати/вирізати/вставити, видалити, перемкнути вузол (D), перемкнути закріплені дані (P) та вбудований пошук вузлів шляхом введення тексту. Скорочення задокументовано у вбудованому довіднику застосунку, і вони тісно взаємодіють із [Canvas Features](./canvas-features.md), як-от Data Pin та увімкнення/вимкнення вузлів.

Див. також [Canvas Features](./canvas-features.md), [Quick Drawer](./quick-drawer.md) та [Contextual Showcase](./contextual-showcase.md).

### [AI Assistant](./ai-assistant.md)

AI Assistant — це панель чату, що відкривається з панелі Debug і дозволяє створювати або змінювати workflow природною мовою. Виберіть [облікові дані](./credentials.md) та модель, а потім опишіть бажане; AI транслює відповідь, і будь-який валідний [workflow JSON](./workflow-structure.md) у блоці коду автоматично розпізнається та застосовується до canvas. Голосове введення підтримується в сумісних браузерах.

Увімкніть **YOLO mode** (режим агента, вимкнено за замовчуванням), і асистент тестуватиме те, що створює. Після кожної зміни він запускає workflow на canvas, читає результат і виправляє workflow, доки той не робитиме те, що ви просили, — до 5 запусків на повідомлення. Він запитує тестові вхідні дані перед першим запуском, може запускати інші ваші workflow, коли потрібен їхній результат, і показує кожен крок у процесі роботи. Див. [AI Assistant › YOLO Mode](./ai-assistant.md#yolo-mode).

Натисніть **AI** над будь-яким вузлом на canvas, щоб змінити або виправити лише цей вузол. Панель показує вузол, який вона змінює (з його останнім результатом після запуску), і пропонує **Change this node as ...**, **Fix error in this node ...** і **Other**. Оновлюється лише цей вузол; решта workflow та макет залишаються без змін. Див. [AI Assistant › Зміна окремого вузла](./ai-assistant.md#changing-one-node).

Коли workflow зберігає записи, асистент запитує, яку [таблицю даних](../tabs/datatable-tab.md) використовувати, або створює її з колонками, потрібними workflow. Див. [AI Assistant › Data tables](./Chat та MCP `heym_chat` також можуть безпосередньо редагувати стовпці та рядки з правами власника або запису, з підтвердженням перед видаленням стовпців або очищенням усіх рядків. Chat та MCP `heym_chat` також можуть безпосередньо редагувати стовпці та рядки з правами власника або запису, з підтвердженням перед видаленням стовпців або очищенням усіх рядків. ai-assistant.md#data-tables).

Коли поточний workflow містить навички [Agent Node](../nodes/agent-node.md), асистент надсилає до контексту workflow лише `SKILL.md` кожної навички. Прикріплені файли `.py` та бінарні ресурси навичок виключаються перед запитом, щоб великі набори навичок не переповнювали вікно контексту моделі.

Добре поєднується з [Chat with Heym](./chat-with-heym.md), [Agent Architecture](./agent-architecture.md) та [Expression DSL](./expression-dsl.md).
### [Chat with Heym](./chat-with-heym.md)

Chat with Heym — це асистент у заголовку документації для запитань щодо продукту. Він відкривається в центрованому діалоговому вікні, зберігає вибір облікових даних і моделі видимим угорі, додає шлях активної сторінки документації як контекст і очищає історію повідомлень після закриття діалогу. Він доповнює ширший [AI Assistant](./ai-assistant.md) та легший [Contextual Showcase](./contextual-showcase.md).

Див. також [AI Assistant](./ai-assistant.md), [Contextual Showcase](./contextual-showcase.md) і [Node Types](./node-types.md).

### [Workflow Organization](./workflow-organization.md)

Адміністратори інстансу (`HEYM_ADMIN_EMAILS`) можуть отримувати доступ до всіх workflow та редагувати їх, знаходити workflow власника за електронною поштою, переглядати розклади й історію виконань, призупиняти та відновлювати автоматичні тригери, а також видаляти workflow після завершення запусків. Див. [Instance Administration](../tabs/workflows-tab.md#instance-administration) щодо процесу offboarding та різниці між призупиненням автоматичних тригерів і блокуванням усіх викликів.

Workflow можна організовувати в теки та підтеки у деревоподібній структурі. Теки мають назви та необов'язкову батьківську теку; workflow призначаються до тек. Workflow можна запланувати до видалення (переміщено до кошика перед остаточним видаленням). API підтримує створення, оновлення, видалення та переміщення workflow між теками, і та сама модель організації відображається на вкладці [Workflows](../tabs/workflows-tab.md).

Див. також [Quick Drawer](./quick-drawer.md), [Download & Import](./download-import.md) і [Edit History](./edit-history.md).

### [Quick Drawer](./quick-drawer.md)

Quick Drawer — це фіксована права панель швидкого запуску для внутрішніх сторінок, що не належать до canvas. Вона дозволяє шукати [workflows](../tabs/workflows-tab.md), закріплювати обрані, вибирати вхідні дані, запускати негайно та переглядати прогрес або результати без відкриття редактора. Workflow із [File Upload Trigger](../nodes/file-upload-trigger-node.md) приймає перетягнутий або вибраний файл. Порядок закріплення та останній вибраний workflow зберігаються в браузері.

Див. також [Workflow Organization](./workflow-organization.md), [Keyboard Shortcuts](./keyboard-shortcuts.md) і [Execution History](./execution-history.md).

### [Contextual Showcase](./contextual-showcase.md)

Contextual Showcase — це компактна вбудована довідкова панель для автентифікованих основних поверхонь, як-от вкладки dashboard, [Evals](../tabs/evals-tab.md), Docs і редактор workflow. Вона залишається закритою за замовчуванням, спершу надає короткий підсумок сторінки, пропонує трохи додаткових деталей на вимогу та посилається на повну статтю документації, коли потрібне глибше керівництво.

Поєднується з [Chat with Heym](./chat-with-heym.md), [Quick Drawer](./quick-drawer.md) і [AI Assistant](./ai-assistant.md) для потоків вбудованого керівництва.

### [Credentials](./credentials.md)

Credentials зберігають API-ключі та секрети, які використовуються вузлами workflow. Додайте їх на вкладці [Credentials](../tabs/credentials-tab.md) і посилайтеся на них за назвою або ID у вузлах, як-от [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Send Email](../nodes/send-email-node.md) і [Redis](../nodes/redis-node.md). Вони шифруються під час зберігання, можуть бути надані спільно користувачам або [teams](./teams.md), а також можуть бути використані в [Expression DSL](./expression-dsl.md) через `$credentials.Name`.

Див. також [Credentials](../tabs/credentials-tab.md), [Credentials Sharing](./credentials-sharing.md) і [Third-Party Integrations](./integrations.md).

### [Credentials Sharing](./credentials-sharing.md)

Credentials можна надавати спільно іншим користувачам за електронною поштою або teams; усі члени team отримують доступ, коли credential надано спільно team. Спільні credentials відображаються з індикатором на вкладці [Credentials](../tabs/credentials-tab.md). Під час виконання контекст власника workflow об'єднує власні, надані користувачам і надані teams credentials. Використовуйте `$credentials.CredentialName` у виразах або задайте credentialId у даних вузла.

Див. також [Credentials](./credentials.md), [Teams](./teams.md) і [Third-Party Integrations](./integrations.md).

### [Teams](./teams.md)

Teams дозволяють надавати спільно workflow, credentials, глобальні змінні, векторні сховища та файли Drive групі користувачів одночасно. Створюйте teams на вкладці [Teams](../tabs/teams-tab.md) і додавайте учасників за електронною поштою. Надавайте ресурси спільно team через відповідні діалоги спільного доступу; тоді всі учасники матимуть доступ. Творець може редагувати та видаляти team; видалення team прибирає всі спільні доступи team.

Поєднується з [Credentials Sharing](./credentials-sharing.md), [Global Variables](./global-variables.md) і [Enterprise](./enterprise.md).

### [Parallel Execution](./parallel-execution.md)

Heym виконує вузли паралельно, коли вони не мають залежностей один від одного. Виконавець будує DAG і запускає вузли одного рівня одночасно за допомогою пулу потоків; щойно вузол завершується, його нижчі вузли ставляться в чергу. Використовуйте вузол [Merge](../nodes/merge-node.md), щоб об'єднати паралельні гілки за потреби. Кілька запусків workflow виконуються одночасно; кожен запуск ізольований. Режим [SSE Streaming](./sse-streaming.md) надсилає події в міру завершення вузлів.

Див. також [Merge](../nodes/merge-node.md), [Loop](../nodes/loop-node.md) і [Execution History](./execution-history.md).
### [Архітектура агента](./agent-architecture.md)

[Вузол агента](../nodes/agent-node.md) підтримує субагентів (оркестратор викликає інші вузли агентів через call_sub_agent), суб-workflow (агент викликає інші workflow через call_sub_workflow), навички (інструкційний контент і Python-інструменти з .zip або .md) та клієнтські з'єднання [MCP](../tabs/mcp-tab.md). Виконавець інструментів оркестратора маршрутизує виклики субагентів і суб-workflow; інші інструменти спрямовуються до виконавців Python, MCP або навичок. Максимальна глибина вкладеності для субагентів і суб-workflow становить 5. Цикл виклику інструментів включає автоматичне стиснення контексту: перед кожною ітерацією оцінюється використання token, і якщо воно перевищує 80% вікна контексту моделі, середні повідомлення підсумовуються за допомогою тієї самої моделі, зберігаючи системний prompt, перше повідомлення користувача та останнє повідомлення користувача незмінними.

Дивіться також [Вузол агента](../nodes/agent-node.md), [Постійна пам'ять агента](./agent-persistent-memory.md), [Людина в циклі](./human-in-the-loop.md) та [MCP](../tabs/mcp-tab.md).

### [Постійна пам'ять агента](./agent-persistent-memory.md)

Необов'язковий граф знань для кожного [Вузла агента](../nodes/agent-node.md), що зберігається в Postgres: сутності, типи, властивості та спрямовані зв'язки. Коли `persistentMemoryEnabled` має значення true, граф підсумовується в системний prompt під час кожного запуску; після успішних завершень [LLM](../nodes/llm-node.md) витягує структуровані оновлення у фоновому режимі. REST CRUD розміщено за шляхом `/api/workflows/{workflow_id}/nodes/{canvas_node_id}/agent-memory/...`. Редактор відкривається за допомогою рожевого елемента керування мозком на вузлі.

Дивіться також [Вузол агента](../nodes/agent-node.md), [Архітектура агента](./agent-architecture.md) та [Трасування](../tabs/traces-tab.md).

### [Людина в циклі](./human-in-the-loop.md)

Людина в циклі дозволяє [Вузлу агента](../nodes/agent-node.md) запитувати схвалення на певних контрольних точках, створювати публічну сторінку `/review/{token}` та очікувати, поки неавторизований рецензент прийме, відредагує або відхилить текст рецензії у форматі Markdown. Агенти з підтримкою HITL також надають вихідний дескриптор `review`, щоб можна було сповіщати [Slack](../nodes/slack-node.md), [Надіслати email](../nodes/send-email-node.md) або інші канали, поки виконання очікує. Текст HITL на рівні вузла використовується як настанови для схвалення, тоді як підсумок публічної сторінки генерується з самого запиту на рецензію. Виконання, що очікують, одразу з'являються в [Історії виконань](./execution-history.md), можуть відбуватися більше ніж один раз протягом одного запуску та відновлюються з точного збереженого знімка workflow після подання кожного рішення.

Дивіться також [Вузол агента](../nodes/agent-node.md), [Портал](./portal.md), [Історія виконань](./execution-history.md) та [Надіслати email](../nodes/send-email-node.md).

### [Webhooks](./webhooks.md)

Workflow можна запускати через [HTTP](../nodes/http-node.md) за адресою `POST /api/workflows/{workflow_id}/execute` або потоково передавати інкрементально з `POST /api/workflows/{workflow_id}/execute/stream`. Тіло запиту передається як body до вузлів [Вхідних даних](../nodes/input-node.md); headers і query params доступні у виразах [Expression DSL](./expression-dsl.md). Налаштуйте автентифікацію для кожного workflow: анонімну, JWT або власний header. Необов'язкове кешування відповідей, обмеження швидкості та діалог редактора «Запустити за допомогою cURL» — усе це налаштовується на рівні workflow і застосовується до обох режимів. З [обмеженням паралелізму](./webhooks.md#concurrency-limit-and-queued-runs) виклик, який повинен зачекати, натомість отримує `202 Accepted` з ідентифікатором запуску та URL-адресою статусу.

Дивіться також [Вхідні дані](../nodes/input-node.md), [Token виконання](./execution-tokens.md), [Потокова передача SSE](./sse-streaming.md), [HTTP](../nodes/http-node.md) та [Структура workflow](./workflow-structure.md).

### [Token виконання](./execution-tokens.md)

Token виконання — це обмежені за областю дії JWT, які надають доступ до endpoint виконання та потокової передачі одного workflow. Коли workflow використовує автентифікацію JWT, token дозволяють зовнішнім скриптам, CI-конвеєрам та інтеграціям викликати workflow без спільного використання сесії користувача. Кожен token містить твердження `wid`, яке прив'язує його до одного workflow, `jti`, що використовується для миттєвого відкликання, та налаштовуваний TTL (від 60 секунд до 10 років). Створюйте, вибирайте та відкликайте token безпосередньо з діалогу **Запустити за допомогою cURL** — вибраний token автоматично вбудовується у згенеровану команду.

Дивіться також [Webhooks](./webhooks.md), [Безпека](./security.md) та [Потокова передача SSE](./sse-streaming.md).

### [Потокова передача SSE](./sse-streaming.md)

Діалог cURL може перемикати виконання [webhook](./webhooks.md) у режим Server-Sent Events. Це створює події `execution_started`, `node_start`, `node_complete` та `execution_complete` у реальному часі, додає `--no-buffer` до згенерованої команди cURL і дозволяє налаштовувати повідомлення про запуск для кожного вузла, як-от `[START] LLM` або власний текст для зовнішніх термінальних споживачів.

Дивіться також [Webhooks](./webhooks.md), [Історія виконань](./execution-history.md) та [LLM](../nodes/llm-node.md).
### [Triggers](./triggers.md)

Workflow запускаються вузлами-тригерами ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), отримання [RabbitMQ](../nodes/rabbitmq-node.md)) або точками входу: [Webhook/API](./webhooks.md), [MCP](../tabs/mcp-tab.md), [Portal](./portal.md), планувальник Cron, Telegram webhook, webhook взаємодії Discord, менеджер IMAP-тригерів, споживач RabbitMQ або запуск із редактора. Кожен тригер має власний endpoint або фоновий процес; [Cron](../nodes/cron-node.md) виконується кожні 60 секунд, вузли [Telegram Trigger](../nodes/telegram-trigger-node.md) отримують webhook бота, вузли [Discord Trigger](../nodes/discord-trigger-node.md) отримують підписані webhook взаємодії, а вузли [IMAP Trigger](../nodes/imap-trigger-node.md) працюють із налаштованим інтервалом опитування. Вузли [Input](../nodes/input-node.md) отримують body, headers і query із запитів webhook.

Див. також [Node Types](./node-types.md), [Webhooks](./webhooks.md) та [Parallel Execution](./parallel-execution.md).

### [Execution History](./execution-history.md)

Історія виконань фіксує запуски workflow: вхідні та вихідні дані, результати вузлів, статус і джерело тригера. Доступ до неї здійснюється з панелі інструментів редактора, подання Docs, заголовка Dashboard або подання [Evals](../tabs/evals-tab.md). Історія для окремого workflow показує запуски відкритого workflow; подання всієї історії показує запуски в межах усіх workflow і Chat. Виконання, що тривають наразі, відображаються вгорі обох діалогів із діями **Open live** та **Cancel**. Open live приєднує редактор до наявного виконання через [SSE](./sse-streaming.md), відновлює завершені вузли, підсвічує поточні та очікувані вузли й додає логи Debug без запуску нового виконання. Bring to Canvas завантажує вхідні дані завершеного запуску та вихідні дані вузлів для повторного запуску або зневадження; глибоке посилання `/workflows/{workflowId}/{executionId}` підтримує як активні, так і завершені виконання. Запуски, призупинені через [Human-in-the-Loop](./human-in-the-loop.md), одразу зберігаються зі статусом `pending`, включно з публічним URL для перегляду та будь-якими вузлами сповіщень, виконаними з гілки `review` агента. Якщо сервер перезапускається під час виконання, перервані запуски відновлюються автоматично: вони повторно виконуються з нуля з тими самими вхідними даними й відображаються як завершені (із позначкою **Recovered**), що керується перемикачем **Auto-recover runs** для окремого workflow, який натомість може записати їх як `skipped`.

Див. також [SSE Streaming](./sse-streaming.md), [Human-in-the-Loop](./human-in-the-loop.md) та [Traces](../tabs/traces-tab.md).

### Execution Highlights

Після активного запуску — або після **Bring to Canvas** — у правому верхньому куті Canvas з'являється закривне спливне вікно **Execution Highlights**, де в порядку виконання перелічено те, що створив кожен вузол. Це швидкий спосіб переглянути вихідні дані кожного вузла без відкриття кожного з них; закрийте його за допомогою **✕**, і воно знову відкриється під час наступного запуску. Highlights також відображаються для запусків на dashboard. Докладніше див. [Execution History](./execution-history.md).

### [Edit History](./edit-history.md)

Edit History відстежує збережені версії workflow (кожне збереження створює версію). Перегляньте список, відкрийте версію, щоб побачити відмінності від поточного workflow ([nodes](./workflow-structure.md), edges, config), і скористайтеся Revert, щоб відновити попередню версію. На відміну від [Execution History](./execution-history.md), Edit History відстежує зміни структури, а не запуски.

Див. також [Execution History](./execution-history.md), [Workflow Structure](./workflow-structure.md) та [Canvas Features](./canvas-features.md).

### Error Workflow

Workflow може призначити інший workflow для запуску в разі його збою. Це налаштовується на рівні workflow у панелі **Properties** (що відображається, коли жоден вузол не вибрано) у розділі **On error, run workflow**. Лише власник workflow може встановлювати, змінювати або очищати це налаштування; див. [Owner-only settings](./workflow-organization.md#owner-only-settings). Коли запуск верхнього рівня завершується необробленим збоєм, вибраний error workflow запускається й отримує контекст збою (id і назву workflow, що зазнав збою, id запуску, повідомлення про помилку, мітку та тип вузла, що зазнав збою, і часову позначку). Якщо на Canvas уже є вузол [Error Handler](../nodes/error-handler-node.md), локальний обробник має пріоритет, і error workflow **не** викликається. Сам error workflow виконується безпосередньо, тож він ніколи не запускає власний error workflow.

Це охоплює кожен запуск верхнього рівня, крім тестових: обидва endpoint виконання, [Portal](./portal.md) і кожен тригер, включно з [cron](../nodes/cron-node.md), тригерами чат-платформ, електронною поштою, чергами, [MCP](../tabs/mcp-tab.md) і віджетами dashboard. Коли ввімкнено [Load Distribution](./cluster.md), це залишається незмінним, включно із запусками, виконаними worker: вузол, що зазнав збою, повертається разом із результатом, і error workflow далі розподіляється як будь-який інший запуск, тож вузол усередині нього, який має виконуватися на головному інстансі, все одно це робить. Два випадки навмисно виключено, оскільки результат самого workflow ще невідомий: запуск, який жоден інстанс так і не виконав, і очікування, час якого минув, тоді як запуск усе ще може тривати. Він також **не** запускається ручними тестовими запусками на Canvas.
### Тайм-аут Workflow

Кожен workflow може встановлювати **тайм-аут workflow** у секундах на панелі **Властивості** рівня workflow. `0` (значення за замовчуванням) вимикає його. Коли його встановлено, запуск, що перевищує ліміт, зупиняється на межі наступного вузла та записується як невдалий запуск із помилкою "timed out". Тайм-аут застосовується до ручних, API та ініційованих Trigger запусків. Тривалі вузли [Wait](../nodes/wait-node.md) перериваються своєчасно, а не блокуються на всю свою тривалість.

### Обмеження паралелізму

Кожен workflow може обмежувати кількість одночасних робочих запусків за допомогою **Обмеження паралелізму** на панелі **Properties** на рівні workflow; власник та співавтори з правами редагування можуть змінювати це налаштування, і за замовчуванням воно вимкнено. Коли ліміт вичерпано, нові запуски з [webhook](./webhooks.md#concurrency-limit-and-queued-runs) та [потокових](./sse-streaming.md) endpoint-ів, [Portalu](./portal.md), [Quick Drawer](./quick-drawer.md), [MCP](../tabs/mcp-tab.md) та кожного [triggera](./triggers.md) очікують у черзі FIFO (першим прийшов, першим пішов), яка підраховується на всіх екземплярах [кластера](./cluster.md). Тестові запуски редактора, виклики під-workflow, [Evals](../tabs/evals-tab.md) та відновлення після перевірки ніколи не ставляться в чергу, а запуски карток [Board](../tabs/board-tab.md), завантаження файлів, запуски, ініційовані інструментом run-workflow AI-асистента, та workflow сповіщень про попередження починаються без очікування слота. Виклик webhook, який змушений чекати, негайно отримує `202 Accepted` з `execution_id`, URL-адресою статусу, що відповідає за тими самими обліковими даними, своєю позицією, розміром черги та кількістю запущених завдань; MCP-клієнт отримує те саме та опитує інструмент `heym_execution_status`. Опціональний **Максимальний розмір черги** відхиляє додаткові виклики з помилкою `429`, а опціональний **Максимальний час очікування** реєструє запуск, який чекав занадто довго, як `expired`. Очікуючі запуски з'являються в [Історії запусків](./execution-history.md) як **У черзі n/m** і можуть бути скасовані там.

### Зекономлений час

Кожен workflow може фіксувати **орієнтовний зекономлений час на запуск** (у хвилинах), який встановлюється на панелі **Властивості** рівня workflow. Вкладка [Analytics](../tabs/analytics-tab.md) агрегує це за вибраним діапазоном як загальний показник **Time Saved** (сума оцінки кожного workflow × його успішних запусків). Most Used також наводить цю суму для кожного workflow; **Not Set** відкриває поле оцінки, коли її не встановлено. Звіт [Workflow Analysis](./workflow-analysis.md) рекомендує встановити оцінку, коли жодної не налаштовано.

### [Налаштування](./user-settings.md)

Діалогове вікно Settings (відкривається з Вашого аватара в заголовку) має чотири вкладки: Profile (зображення Gravatar, відображуване ім'я, User Rules), [Security](./security.md) (зміна пароля), Voice ([ElevenLabs TTS/STT](./chat-voice.md)) та Observability (статус [OpenTelemetry](./opentelemetry.md) лише для читання). User Rules — це спеціальні інструкції, що впроваджуються в кожен AI-запит, включно з конструктором workflow та [Chat](../tabs/chat-tab.md), тож Ви можете один раз задати мову, тон, стиль кодування або конвенції workflow. Політика паролів та керування API-ключами [MCP](../tabs/mcp-tab.md) також доступні.

Див. також [Security](./security.md), [Chat Voice](./chat-voice.md), [OpenTelemetry Tracing](./opentelemetry.md) та [AI Assistant](./ai-assistant.md).

### [Трасування OpenTelemetry](./opentelemetry.md)

Heym може генерувати трасування OpenTelemetry для кожного запуску workflow та виконання вузла: кореневий span `heym.workflow.execute` на кожен запуск та дочірній span `heym.node.execute` на кожен вузол, із використанням моделі та token, прикріпленим до вузлів LLM та агента. Span'и експортуються через OTLP/HTTP до будь-якого сумісного бекенду (Jaeger, Grafana Tempo, Honeycomb, Datadog), а контекст трасування W3C поширюється через вхідні webhook'и, вихідні HTTP та під-workflow. Трасування вимкнено за замовчуванням і налаштовується за допомогою [змінних середовища](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) `HEYM_OTEL_*`; активний статус відображається на вкладці Observability у [Settings](./user-settings.md).

Див. також [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md) та [Webhooks](./webhooks.md).

### [Завантаження та імпорт](./download-import.md)

Експортуйте поточний workflow як JSON з панелі інструментів редактора (кнопка Download); файл містить вузли та ребра. Імпортуйте, перетягнувши JSON-файл на вкладку [Workflows](../tabs/workflows-tab.md) (створює новий workflow) або на canvas (замінює чи об'єднує). JSON має містити масив nodes; name та edges є необов'язковими. Використовуйте це для резервного копіювання, обміну або міграції між інстансами.

Див. також [Workflow Structure](./workflow-structure.md), [Workflows](../tabs/workflows-tab.md) та [Canvas Features](./canvas-features.md).

### [Portal](./portal.md)

Portal надає workflow як публічні чат-інтерфейси за адресою `/chat/{slug}`. Налаштуйте portal_enabled, slug, необов'язкову автентифікацію (користувачі portal), потокову передачу та завантаження файлів для кожного workflow. Кінцеві користувачі взаємодіють через чат-інтерфейс без входу в Heym; виведені зображення можна відображати в чаті. Workflow Portal також можуть передавати керування сторінкам перевірки [Human-in-the-Loop](./human-in-the-loop.md), коли [Agent Node](../nodes/agent-node.md) потребує схвалення, тоді як гілка `review` агента надсилає сповіщення до інших каналів. Використовуйте це для внутрішніх інструментів, клієнтських чат-ботів та AI-форм.

Див. також [Human-in-the-Loop](./human-in-the-loop.md), [Agent Node](../nodes/agent-node.md) та [Drive](./drive.md).

### [Генерація файлів](./file-generation.md)

Skills можуть генерувати файли, такі як PDF, DOCX, CSV, JSON та зображення, під час виконання, записуючи до робочого простору `_OUTPUT_DIR`. Heym автоматично захоплює ці файли, зберігає їх та надає метадані завантаження під `_generated_files`, якими потім можна керувати за допомогою [Drive node](../nodes/drive-node.md) або переглядати на вкладці [Drive](../tabs/drive-tab.md).

Див. також [Agent Node](../nodes/agent-node.md), [Drive](./drive.md) та [Drive node](../nodes/drive-node.md).

### [Drive](./drive.md)

Drive — це спільний рівень зберігання та обміну для файлів, згенерованих skills. Він дозволяє переглядати файли, створювати публічні посилання або посилання, захищені паролем, застосовувати термін дії та обмеження на завантаження, ділитися файлами лише для читання з Вашими командами та керувати цими файлами програмно за допомогою [Drive node](../nodes/drive-node.md) або вручну на вкладці [Drive](../tabs/drive-tab.md).

Див. також [Drive](../tabs/drive-tab.md), [Генерація файлів](./file-generation.md) та [Portal](./portal.md).
### [Безпека](./security.md)

Heym забезпечує дотримання політики паролів (довжина, великі літери, малі літери, цифри), зберігає токени доступу в HttpOnly cookies та ротує refresh-токени під час використання. Обмеження швидкості застосовується до входу, реєстрації та входу через [Портал](./portal.md). [Облікові дані](./credentials.md) шифруються у стані спокою за допомогою AES-256 (Fernet). API-ключ [MCP](../tabs/mcp-tab.md) використовується для автентифікації клієнтів; безпека вмісту доступна через [Guardrails](./guardrails.md) на вузлах [LLM](../nodes/llm-node.md) та [Agent Node](../nodes/agent-node.md). [Execution Tokens](./execution-tokens.md) надають JWT з областю дії для кожного workflow для зовнішніх викликів.

Див. також [Execution Tokens](./execution-tokens.md), [Guardrails](./guardrails.md), [Портал](./portal.md) та [Облікові дані](./credentials.md).

### [Єдиний вхід](./sso.md)

Heym автентифікує користувачів через будь-якого зовнішнього постачальника OpenID Connect — Keycloak, Okta, Entra ID, Auth0, Google — налаштованого під час виконання в розділі **Settings → SSO** адміністратором інстансу, зазначеним у `HEYM_ADMIN_EMAILS`. Вводяться лише URL-адреса видавця та облікові дані клієнта; кожен endpoint походить із документа виявлення постачальника, тому жоден постачальник не є жорстко закодованим. Вхід використовує Authorization Code з PKCE, а ID-токен перевіряється за опублікованими ключами постачальника. Облікові записи зіставляються спершу за `(issuer, subject)`, а потім за підтвердженою електронною поштою, з опціональним автоматичним створенням, обмеженим списком дозволених доменів електронної пошти. Вхід за паролем залишається доступним поряд із SSO і може бути вимкнений після успішного тесту з'єднання, причому облікові записи з `HEYM_ADMIN_EMAILS` звільняються від цього, щоб неправильно налаштований постачальник не міг заблокувати інстанс.

Див. також [Налаштування](./user-settings.md), [Безпека](./security.md) та [Журнал аудиту](./audit.md).

### [Розподіл навантаження](./cluster.md)

Спрямуйте другий інстанс Heym на ту саму базу даних, і він приєднається як worker. Фонові запуски — cron, webhooks, виклики інструментів MCP, chat-тригери — розподіляються між інстансами за відсотком, який адміністратор інстансу встановлює в розділі **Settings → Instances**, причому статус кожного інстансу, затримка бази даних і версія відображаються в одній таблиці. Інстанси ніколи не спілкуються один з одним: Postgres несе роботу, тому worker не потребує відкритого порту та маршруту назад до головного інстансу. Робота, що торкається локальних файлів, робочого простору coding-агента або встановленого плагіна, завжди виконується на головному інстансі, і панель повідомляє, яку частку за останні 24 години це становило, щоб оператор міг бачити, коли відсотки не допомагають. Кожен запуск в історії вказує інстанс, який його виконав, і обидва діалоги історії можуть фільтрувати за ним.

Див. також [Налаштування](./user-settings.md), [Трасування](../tabs/traces-tab.md) та [Аналітику](../tabs/analytics-tab.md).

### [Сторонні інтеграції](./integrations.md)

Heym підключається до зовнішніх сервісів через облікові дані, що зберігаються на вкладці [Облікові дані](../tabs/credentials-tab.md) (зашифровані у стані спокою). Підтримувані типи включають OpenAI, Google, Decision Model для [вузла Decision](../nodes/decision-node.md), Model Router для автоматичного вибору моделі (див. нижче), GitHub для [вузла GitHub](../nodes/github-node.md) та інтеграцій MCP, Jira для [вузла Jira](../nodes/jira-node.md), Notion для [вузла Notion](../nodes/notion-node.md), Custom LLM, Cohere, RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, [Grist](../nodes/grist-node.md), SMTP для [Send Email](../nodes/send-email-node.md), [RabbitMQ](../nodes/rabbitmq-node.md), [Redis](../nodes/redis-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), Bearer, Header та FlareSolverr для [Crawler](../nodes/crawler-node.md). Кожен тип документує обов'язкові поля; облікові дані можна надавати спільно користувачам або [командам](./teams.md) та посилатися на них за назвою у вузлах або як `$credentials.Name` у виразах.

### Model Router (Auto Model)

Облікові дані **Model Router** обирають модель для кожного запиту замість зберігання ключа. Вони
зберігають облікові дані decision-моделі разом зі списком Ваших наявних облікових даних OpenAI/Google/Custom,
кожні з критеріями, що вказують, коли їх слід використовувати, і з'являються в кожному засобі вибору моделі
з єдиною моделлю під назвою **Auto**.

Трасування, Execution Log на Canvas та Span View показують обидві частини вибору, наприклад
`Auto Model / GPT-5`, тоді як вартість залишається віднесеною до моделі, яка виконувалася. Auto
Model не можна поєднувати з Responses API, Batch mode або виводом зображень. Повну поведінку див.
у розділі [Облікові дані](./credentials.md).

Див. також [Облікові дані](./credentials.md), [Спільний доступ до облікових даних](./credentials-sharing.md) та [Команди](./teams.md).

### [Guardrails](./guardrails.md)

Guardrails блокують небезпечні або небажані повідомлення користувачів, перш ніж вони досягнуть [LLM](../nodes/llm-node.md) або [Agent Node](../nodes/agent-node.md). Увімкніть їх для кожного вузла та виберіть категорії для блокування (наприклад, насильство, мова ворожнечі, сексуальний вміст, самоушкодження, переслідування, незаконна діяльність). Встановіть чутливість (низька, середня, висока). У разі спрацювання вузол викидає помилку, яку можна перехопити за допомогою [Error Handler](../nodes/error-handler-node.md). Виявлення використовує moderation API постачальника або класифікацію LLM залежно від типу облікових даних.

Див. також [Безпека](./security.md), [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) та [Error Handler](../nodes/error-handler-node.md).
### [Enterprise](./enterprise.md)

Enterprise охоплює комерційне ліцензування, професійну підтримку та послуги розгортання для команд, які використовують Heym у виробничому середовищі. Він включає допомогу з архітектурою workflow, онбординг, рекомендації щодо Kubernetes та масштабування, пріоритетну підтримку та кастомну розробку навколо розширених функцій, таких як [Agent Node](../nodes/agent-node.md), [Human-in-the-Loop](./human-in-the-loop.md), [Parallel Execution](./parallel-execution.md) та [Portal](./portal.md).

Дивіться також [Running & Deployment](../getting-started/running-and-deployment.md), [Security](./security.md) та [Teams](./teams.md).

### [Heym Work](./heym-work.md)

Heym Work — це другий інтерфейс для бізнес-команд поверх Heym. Користувачі описують завдання, відповідають на кілька запитань і отримують протестований workflow, а потім працюють зі сторінками, погодженнями та списком Активності, де кожен запуск має власну назву. Адміністратори екземпляра підключають його в меню **Налаштування → Heym Work** за допомогою адреси та ключа інтеграції; для нього потрібна окрема ліцензія від команди Heym.

Дивіться також [Enterprise](./enterprise.md), [Single Sign-On](./sso.md) та [Human-in-the-Loop](./human-in-the-loop.md).

---

## Вкладки Dashboard

### [Workflows](../tabs/workflows-tab.md)

Вкладка Workflows є типовим поданням dashboard. Вона відображає дворівневий список: workflows і папки у вигляді щільних рядків ліворуч та попередній перегляд вибраного workflow праворуч із його trigger, останнім запуском і кроками, а також кнопками Open Workflow та Run Now. Кожен рядок має статусний чип (Running, Scheduled, Listening, Paused, API, SubWorker, Portal, Manual, Remove Scheduled), за яким може фільтрувати випадний список Status. Workflow без вузла trigger позначається залежно від того, як почався його останній запуск - API для HTTP-виклику, SubWorker для батьківського workflow, Portal для його публічного chat - і залишається Manual, доки він не запуститься. Папки та підпапки забезпечують [organization](./workflow-organization.md). Створюйте workflows за допомогою New Workflow, перетягуйте JSON для [import](./download-import.md) та редагуйте або видаляйте через дії в рядку. Workflows можна переміщати між папками; видалення заплановано (trash) перед остаточним видаленням.

Дивіться також [Workflow Organization](./workflow-organization.md), [Download & Import](./download-import.md) та [Quick Drawer](./quick-drawer.md).

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Watch Workflows demo</a></p>

### [Board](../tabs/board-tab.md)

Агентна канбан-дошка, де картки є постійними завданнями. Налаштуйте кожну колонку впорядкованим ланцюжком workflow; переміщення картки в колонку запускає ланцюжок із повним контекстом картки (вміст, коментарі, історія, попередні результати). Результати записуються назад у картку — зелений у разі успіху, червоний у разі помилки, бурштиновий під час виконання. Наступні раунди повторно запускають ланцюжок поточної колонки з усім накопиченим на цей момент, що забезпечує ітеративне планування. Запуски записуються в [Execution History](./execution-history.md) із джерелом trigger `board`. Поки запуск картки активний, **Open live** відкриває саме цей запуск на анімованому canvas з інкрементальними Debug-логами.

Дивіться також [Workflows](../tabs/workflows-tab.md), [Execution History](./execution-history.md) та [Human-in-the-Loop](./human-in-the-loop.md).

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

### [Templates](../tabs/templates-tab.md)

Вкладка Templates дає змогу зберігати та повторно використовувати шаблони workflow (повні workflows) і шаблони вузлів (окремі налаштовані вузли). Створюйте шаблони workflow з редактора (Share as Template) та шаблони вузлів, клацнувши правою кнопкою миші на вузлі. Переглядайте за видимістю (Everyone або Specific users/[teams](./teams.md)), застосовуйте шаблон для створення нового workflow або додавання вузла на canvas та керуйте своїми спільними шаблонами.

Дивіться також [Workflows](../tabs/workflows-tab.md), [Teams](./teams.md) та [Canvas Features](./canvas-features.md).

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Watch Templates demo</a></p>

### [Variables](../tabs/global-variables-tab.md)

Вкладка Variables керує [Global Variable Store](./global-variables.md). Створюйте, редагуйте та видаляйте глобальні змінні; задавайте ім'я, значення та тип значення (Auto, String, Number, Boolean, Array, Object). Змінні мають область видимості користувача та зберігаються між виконаннями. Посилайтеся на них у будь-якому [expression](./expression-dsl.md) workflow як `$global.variableName`. Змінними можна ділитися з іншими користувачами або [teams](./teams.md).

Дивіться також [Global Variables](./global-variables.md), [Variable](../nodes/variable-node.md) та [Expression DSL](./expression-dsl.md).

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Watch Variables demo</a></p>
### [Chat](../tabs/chat-tab.md)

Вкладка Chat — це довготривала агентна поверхня Heym для керування робочим простором через діалог. Виберіть [облікові дані](./credentials.md) та модель, після чого зверніться до Chat, щоб отримати відповіді на запитання, переглянути визначення workflow, запустити наявні workflow, узагальнити виконання та розклади, звітувати про історію запусків окремого workflow (кількість запусків, розподіл за статусами, останній запуск і деталі одного запуску на запит), повідомити, які виконання тривають прямо зараз (із зазначенням витраченого часу, поточного вузла та посилання на кожен активний запуск), розв'язати очікувані людські перевірки, створити та доопрацювати workflow за допомогою того самого рушія AI Builder, що використовується в редакторі, або додати картки на канбан-дошки природною мовою. Нові картки завжди починаються з першої колонки вибраної дошки; якщо доступно кілька дошок і жодну не було названо, Chat пропонує вибір дошки перед створенням картки.

Chat продовжує працювати на бекенді після закриття браузера. Поки відповідь транслюється, Ви можете надсилати додаткові повідомлення; Heym зберігає їх у черзі на основі бази даних, дозволяє редагувати або видаляти повідомлення в черзі до їх початку та виконує їх по порядку, коли поточна відповідь завершується. Якщо асистенту потрібні деталі планування та він повертає уточнювальні запитання, черга призупиняється, доки Ви не відповісте на ці запитання, а потім відновлюється після відповіді щодо планування.

Відповіді транслюються з markdown, вбудованими зображеннями, картками попереднього перегляду workflow, згортуваними картками викликів інструментів, використанням контексту та автоматичним стисненням контексту. Chat підтримує вкладення, голосове введення, відтворення вголос, дії копіювання, швидкі prompt, User Rules з [Settings](./user-settings.md) та [глобальні змінні](./global-variables.md) як контекст.

Див. також [AI Assistant](./ai-assistant.md), [Облікові дані](./credentials.md) та [Settings](./user-settings.md).

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Watch Chat demo</a></p>

### [Облікові дані](../tabs/credentials-tab.md)

Вкладка Облікові дані керує API-ключами та секретами, які використовуються вузлами. Додавайте облікові дані за типом (OpenAI, Google, Custom, Bearer, Header, [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), SMTP, [Redis](../nodes/redis-node.md), RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, Cohere тощо), надавайте їм назви та посилайтеся на них у вузлах workflow. Редагуйте або видаляйте з картки; надавайте спільний доступ користувачам за електронною поштою або [командам](./teams.md). Усі значення шифруються під час зберігання та маскуються в інтерфейсі.

Див. також [Облікові дані](./credentials.md), [Спільний доступ до облікових даних](./credentials-sharing.md) та [Third-Party Integrations](./integrations.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Watch Credentials demo</a></p>

### [Векторні сховища](../tabs/vectorstores-tab.md)

Вкладка Векторні сховища керує векторними сховищами, які використовуються вузлами [RAG](../nodes/rag-node.md). Створіть сховище з назвою та [обліковими даними](./credentials.md) векторного сховища — *RAG: Qdrant + OpenAI* (зовнішній Qdrant) або *RAG: Psql + OpenAI* (власний Postgres Heym через pgvector), що визначає бекенд сховища — за потреби вкажіть назву колекції, після чого завантажте документи (PDF, TXT тощо). Керуйте вмістом (перегляд, видалення джерел), редагуйте деталі сховища та надавайте спільний доступ до сховищ користувачам. У вузлі [RAG](../nodes/rag-node.md) виберіть Database, виберіть векторне сховище та виконайте операції insert, upsert, delete або search.

Див. також [Qdrant RAG](../nodes/rag-node.md), [Облікові дані](./credentials.md) та [Команди](./teams.md).

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Watch Vectorstores demo</a></p>
### [MCP](../tabs/mcp-tab.md)

Вкладка MCP налаштовує інтеграцію з Model Context Protocol. Heym підтримує два режими:

**Сервер за замовчуванням** – Єдиний endpoint за адресою `/api/mcp/sse` надає доступ до всіх Workflow, для яких увімкнено MCP. Перегляньте та перегенеруйте свій API-ключ, скопіюйте готовий до використання клієнтський JSON, підключіть Cursor в один клік або скористайтеся процесом налаштування Claude з автоматичною реєстрацією OAuth.

**Іменовані сервери** – Створюйте кілька ізольованих MCP endpoint, кожен зі своєю URL-адресою на основі UUID (`/api/mcp/servers/{uuid}/sse`) та незалежним API-ключем. Призначайте конкретні Workflow кожному серверу, щоб різні AI-клієнти або команди бачили лише потрібні їм інструменти. Кожен іменований сервер підтримує ті самі методи автентифікації (API-ключ, Claude OAuth) і має власні ярлики Copy JSON та Add to Cursor. Обидва endpoint підтримують транспорт SSE (GET) і транспорт Streamable HTTP (POST). Перемикання Workflow у межах іменованого сервера переміщує його на початок призначеного списку, щоб змінений рядок залишався в полі зору.

**Інструмент чату Heym** – Обидва режими також можуть надавати доступ до рушія [Chat](../tabs/chat-tab.md) як єдиного інструмента `heym_chat`, який вмикається окремо для кожної поверхні з власними обліковими даними LLM та моделлю (попередньо заповненими з вашої бажаної моделі в [Settings](./user-settings.md)). MCP-клієнт надсилає одне повідомлення `message` природною мовою, а рушій робить решту: створює Workflow у режимі побудови (збереження, тестовий запуск до п'яти разів, виправлення та перевірка), запускає Workflow, виконує аналітику, роботу з виконаннями, статусом запуску в реальному часі, розкладами, дошками та картками, командами, глобальними змінними, пошуком у документації та рішеннями із залученням людини. Можливості, додані до Chat пізніше, доступні через той самий інструмент без додаткової реєстрації. Кожен виклик зберігається в історії вкладки Chat як розмова з позначкою plug і повертає `conversation_id`, який клієнт може передати назад, щоб продовжити гілку.

Див. також [Agent Architecture](./agent-architecture.md), [Agent Node](../nodes/agent-node.md) та [SSE Streaming](./sse-streaming.md).

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Watch MCP demo</a></p>

### [Traces](../tabs/traces-tab.md)

Вкладка Traces показує трасування виконання [LLM](../nodes/llm-node.md). Заголовок зі статистикою над списком підсумовує вибраний часовий діапазон за допомогою KPI-карток (Calls, Tokens, Cost, Avg Latency, Error %) і трьох діаграм — Tokens by Model, Cost by Model та Calls Over Time (з накопиченням успішних і помилкових). Єдиний селектор **Time range** (1h / 24h / 7d / 30d / All; за замовчуванням 7 днів) фільтрує як діаграми, так і список разом. Вартість обчислюється з [LLM Cost Table](../tabs/datatable-tab.md#llm-cost-table-system-table) для кожного користувача; моделі без ціноутворення відображаються як вбудоване попередження з посиланням на неї. Відкрийте будь-яке трасування, щоб побачити payload запиту та відповіді, розбивку за часом (llm_ms, tools_ms, mcp_list_ms), виклики інструментів (назва, аргументи, результат) і включені навички. Розгорнуті події відображають JSON — зокрема payload MCP та JSON-RPC — як згорнуте дерево з першим рівнем, відкритим за замовчуванням; **Tree / Raw** перемикає назад до оригінального тексту, а некоректний JSON залишається читабельним. Використовуйте трасування для налагодження поведінки [Agent Node](../nodes/agent-node.md) та [LLM](../nodes/llm-node.md), а також для копіювання чи експорту payload.

Див. також [Execution History](./execution-history.md), [Agent Node](../nodes/agent-node.md) та [LLM](../nodes/llm-node.md).

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Watch Traces demo</a></p>
### [Сповіщення](../tabs/alerts-tab.md)

Вкладка «Сповіщення» визначає порогові умови за часовим вікном і повідомляє, коли їх перевищено. Чотири типи сповіщень охоплюють питання, які оператори справді ставлять: **поріг помилок** (чи зазнавав цей процес збою більше ніж N разів у вікні), **тривалість workflow** (чи сповільнилися запуски, виміряно як максимум, середнє або p95), **вартість у token / USD** (чи перевищили витрати бюджет, обчислений за тією самою таблицею цін, що й [Трасування](../tabs/traces-tab.md)), та **кількість виконань** (чи запускався цей процес значно частіше, ніж мав би). Кожен тип оцінюється за обраним Вами вікном, ніколи за окремою подією, адже один невдалий запуск — це шум, а сплеск — це інцидент. Сповіщення стежать за одним workflow або за кожним workflow, до якого Ви маєте доступ.

Майстер із п'яти кроків проводить через тип, область застосування, умову, реакцію та перевірку. Крок «Перевірка» спершу виконує **зворотне тестування** умови, повідомляючи, як часто вона спрацювала б за останні від 24 годин до 7 днів, тож занадто низький поріг буде виявлено до збереження, а не після того, як він когось сповістить. Опишіть бажане звичайною мовою, і AI заповнить кожен крок, який зможе, позначивши свої припущення; навіть частковий запит просуває майстер уперед, відкриваючись на першому кроці, який усе ще потребує рішення, а не змушуючи Вас починати спочатку. За замовчуванням сповіщення спрацьовує один раз і залишається тихим, доки метрика не відновиться; натомість можна налаштувати його повторення через інтервал.

На кроці реакції сповіщення може створити й призначити новий workflow для запуску при спрацюванні, використати той, який у Вас уже є, або не робити нічого. Payload спрацювання містить спостережуване значення, поріг, вікно та workflow, що долучилися до цього числа, — саме так сповіщення потрапляють у Slack, email або Telegram за допомогою вузлів, які у Вас уже є. Історія спрацювань фіксує, що було істинним у момент кожного спрацювання сповіщення, і зберігається протягом 90 днів; підтвердження спрацювання змінює позначку з «Firing» на «Acknowledged», не вдаючи, що умову усунуто. Вкладка [Chat](../tabs/chat-tab.md) може відповісти, які сповіщення існують і чому або коли спрацювало якесь із них. Сповіщеннями можна поділитися з користувачами та [командами](../tabs/teams-tab.md).

Див. також [Аналітику](../tabs/analytics-tab.md), [Трасування](../tabs/traces-tab.md) та [Історію виконань](./execution-history.md).

### [Аналітика](../tabs/analytics-tab.md)

Вкладка «Аналітика» показує метрики та тенденції виконань. Зведена статистика охоплює загальну кількість виконань, відсоток успішних, відсоток помилок, розподіл затримок і загальний **Зекономлений час** (сума оцінених хвилин, зекономлених кожним workflow за запуск × його успішні запуски). «Найуживаніші» показує ту саму суму для кожного workflow. Виберіть базовий часовий діапазон (24 год, 7 днів, 30 днів або весь), за потреби відфільтруйте за workflow, а потім протягніть курсором по будь-якому графіку, щоб деталізувати вибраний діапазон дат. Графіки та таблиці workflow оновлюються відповідно до вибору, а автопоновлення підтримує метрики в актуальному стані. Це доповнює [Історію виконань](./execution-history.md) та подання [Розклади](../tabs/scheduled-tab.md), коли Вам потрібні і минулі результати, і майбутні запуски.

Див. також [Історію виконань](./execution-history.md), [Розклади](../tabs/scheduled-tab.md) та [Оцінювання](../tabs/evals-tab.md).

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Переглянути демонстрацію аналітики</a></p>

### [Панель керування](../tabs/dashboard-tab.md)

Вкладка «Панель керування» — це простір у стилі Grafana, де Ви будуєте сітки віджетів-графіків, кожен з яких відображається з власного прихованого workflow Heym. Створюйте стільки панелей, скільки потрібно, і діліться кожною з користувачами або командами — лише для читання чи з правом редагування; віджети завжди запускаються з обліковими даними власника, тож усі бачать ті самі дані. Опишіть метрику звичайною мовою, і AI згенерує віджет, або додайте його вручну та виберіть тип графіка з попереднім переглядом на зразкових даних: стовпчиковий, лінійний, з областями, круговий, таблиця, числовий, індикатор, точковий, пропорційний, стовпчиковий індикатор, текстовий або HITL. HITL — це карусель Ваших незавершених людських перевірок. У заголовку показано `1/n pending`. Назва workflow відкриває цей запуск на canvas. **Approve**, **Request changes** та **Reject** завершують його, а значок історії поруч із назвою віджета відкриває цей запуск у діалозі історії на тій самій сторінці. Віджети кешують свої результати, їх можна доопрацьовувати за допомогою AI (кожна зміна зберігається в [Історію редагувань](./edit-history.md)), клонувати разом із повним workflow, упорядковувати за допомогою «Tidy up», а також перетягувати чи змінювати розмір у режимі редагування. Таблиці можуть показувати плашки статусу й пов'язувати свої рядки з детальною панеллю, яка зчитує запис натиснутого рядка як `$page.record`, а віджет Run запускає workflow безпосередньо з панелі: для перетягнутого файлу, зі вхідними полями або кнопкою Запустити. Оскільки кожен віджет — це workflow, будь-які дані, які Ви можете отримати, — виклик [HTTP](../nodes/http-node.md), запит [BigQuery](../nodes/bigquery-node.md), пошук [RAG](../nodes/rag-node.md) або вивід [LLM](../nodes/llm-node.md) — можуть стати графіком. Налаштування віджета HITL можуть обмежити його перевірками одного workflow або кроком агента чи схвалення Slack у ньому; такий віджет показує їх усім, хто може відкрити цей workflow, і прихований для всіх, хто не має доступу. [Chat](../tabs/chat-tab.md) та інструмент MCP `heym_chat` показують список ваших інформаційних панелей із їхніми віджетами, повідомляють, на якій панелі розташовано робочий процес, додають новий віджет (спочатку порожній, процес якого Chat створює та тестує), розміщують існуючий процес як віджет на панелі, перейменовують або видаляють віджети та впорядковують макет так само, як це робить кнопка Упорядкувати.

Див. також [Вузол виводу графіка](../nodes/chart-output-node.md), [Аналітику](../tabs/analytics-tab.md) та [Історію виконань](./execution-history.md).

<video src="/features/showcase/dashboard.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/dashboard.webm">▶ Переглянути демонстрацію панелі керування</a></p>
### [Оцінювання](../tabs/evals-tab.md)

Вкладка «Оцінювання» (за шляхом `/evals`) дає змогу створювати набори оцінювання, додавати або генерувати тестові випадки, оптимізувати prompt набору та запускати оцінювання для workflow з [вузлом Agent](../nodes/agent-node.md). Виберіть одну або кілька моделей, оберіть метод оцінювання (Exact Match, Contains або LLM-as-Judge), за бажанням дозвольте окремій моделі або [вузлу Decision](../nodes/decision-node.md) оцінювати відповіді LLM-as-Judge, задайте кількість запусків на тест (а також temperature та reasoning effort для Exact Match і Contains), після чого порівняйте результати pass/fail та виводи кожної моделі. Перегляньте історію запусків для минулих оцінювань, зокрема суддю, який використовувався в кожному запуску, повторно запустіть один із тим самим суддею, експортуйте його як JSON та перехресно перевірте відповідну поведінку в [Трасуванні](../tabs/traces-tab.md).

**Набір агента** натомість перевіряє один вузол агента: він показує базову затримку агента, вартість у USD, токени та виклики інструментів із його реальних запусків, дозволяє позначити кожен інструмент, інструмент MCP, подагента, підпроцес або навичку як обов'язковий чи заборонений для виклику агентом, встановлює верхні межі на 20% вище базового рівня, запускає процес вибрану кількість разів із вхідними даними останнього запуску або даними, написаними AI, і оцінює кожен запуск із зазначенням причини збою. Вибір наборів містить обидва види з їхнім типом і підтримує пошук, а звіт [Workflow Analysis](./workflow-analysis.md) пропонує набір для процесів із вузлами агента або LLM.

Див. також [вузол Agent](../nodes/agent-node.md), [Трасування](../tabs/traces-tab.md) та [Історію виконань](./execution-history.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Переглянути демо «Оцінювання»</a></p>

### [Команди](../tabs/teams-tab.md)

Вкладка «Команди» дає змогу створювати команди та керувати ними. Створіть команду, додайте учасників за електронною поштою та видаляйте учасників (творця видалити неможливо). Надавайте спільний доступ до [workflow](../tabs/workflows-tab.md), [шаблонів](../tabs/templates-tab.md), [облікових даних](../tabs/credentials-tab.md), [змінних](../tabs/global-variables-tab.md), [векторних сховищ](../tabs/vectorstores-tab.md) та [файлів Drive](../tabs/drive-tab.md) командам через відповідні діалоги надання доступу; усі учасники команди отримують доступ. Редагуйте назву й опис команди або видаляйте команду (це прибирає всі надані команді доступи).

Див. також [Команди](./teams.md), [Надання доступу до облікових даних](./credentials-sharing.md) та [Організацію workflow](./workflow-organization.md).

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Переглянути демо «Команди»</a></p>

### [Розклади](../tabs/scheduled-tab.md)

Вкладка «Розклади» показує всі активні [Cron](../nodes/cron-node.md) workflow на візуальному календарі. Перемикайтеся між поданнями за день, тиждень і місяць, щоб бачити, коли заплановано запуск ваших автоматизацій, а потім повертайтеся до відповідного [workflow](../tabs/workflows-tab.md), коли потрібно відредагувати розклад.

Див. також [Cron](../nodes/cron-node.md), [Аналітику](../tabs/analytics-tab.md) та [Історію виконань](./execution-history.md).

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Переглянути демо «Розклади»</a></p>

### [Журнали](../tabs/logs-tab.md)

Вкладка «Журнали» показує журнали контейнерів Docker для стеку Heym (backend, frontend, PostgreSQL). Виберіть один або кілька контейнерів, відфільтруйте за рівнем журналу (All, INFO, WARNING, ERROR, DEBUG) та виконайте пошук у журналах. Використовуйте її для налагодження та усунення несправностей. Для журналів виконання workflow (результати вузлів, виводи) натомість використовуйте [Історію виконань](./execution-history.md), [Трасування](../tabs/traces-tab.md) або панель Debug у редакторі.

Див. також [Історію виконань](./execution-history.md), [Трасування](../tabs/traces-tab.md) та [Можливості Canvas](./canvas-features.md).

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Переглянути демо «Журнали»</a></p>

### [Таблиці даних](../tabs/datatable-tab.md)

Вкладка «Таблиці даних» дає змогу створювати структуровані таблиці даних у Heym та керувати ними. Визначайте типізовані стовпці (string, number, boolean, date, JSON), керуйте рядками за допомогою вбудованого редагування подвійним кліком, імпортуйте та експортуйте CSV, а також надавайте спільний доступ до таблиць користувачам або [командам](./teams.md) з правами читання/запису. Використовуйте [вузол DataTable](../nodes/datatable-node.md) для програмного доступу до таблиць у workflow. Закріплений розділ **Системні таблиці** вгорі містить **Таблицю вартості LLM**: подання цін на кожну модель із фіксованою схемою, яке наповнюється з Helicone у фоновому режимі (TTL 24 години, ручне оновлення), де кожен користувач може перевизначити ціни або додати власні рядки для моделей, яких Helicone не вказує. Ці правила ціноутворення керують KPI вартості та графіком вартості за моделями на вкладці [Трасування](../tabs/traces-tab.md).

Див. також [вузол DataTable](../nodes/datatable-node.md), [Трасування](../tabs/traces-tab.md), [Структуру workflow](./workflow-structure.md) та [Команди](./teams.md).

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Переглянути демо «Таблиці даних»</a></p>
### [Drive](../tabs/drive-tab.md)

Вкладка Drive відображає всі файли, згенеровані навичками у Ваших workflow. Вона містить перелік кожного файлу із зазначенням назви, типу, розміру, вихідного вузла, дати створення та стану спільного доступу для команди, а також надає засоби пошуку, автентифікованого завантаження, поширення, видалення та посторінкової навігації. Це панель супроводу до [Генерації файлів](./file-generation.md), довідки [Drive](./drive.md) та [Вузла Drive](../nodes/drive-node.md).

Див. також [Drive](./drive.md), [Генерація файлів](./file-generation.md) та [Вузол Drive](../nodes/drive-node.md).

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Переглянути демонстрацію Drive</a></p>

### [Співпраця на Canvas](./canvas-collaboration.md)

Everyone with a workflow open shares one live draft. Edits appear instantly, each person's pointer moves in their color, following mirrors everything they see and do, and you can talk over direct peer-to-peer audio.

See also [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md), and [Keyboard Shortcuts](./keyboard-shortcuts.md).
