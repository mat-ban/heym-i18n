# Пълен набор от функции на Heym

Изчерпателен преглед на всички възможности на Heym. Всяка секция описва дадена функция или концепция в няколко изречения.

---

## Първи стъпки

### [Въведение](../getting-started/introduction.md)

Heym е инфраструктура за изпълнение и управление на AI агенти в production среда. Изграждате агентни системи върху визуална работна площ и ги изпълнявате с увереност: оркестрирате агенти, автоматизирате бизнес процеси, инспектирате всяко изпълнение и запазвате контрола върху хората върху собствената си инфраструктура. Платформата поддържа визуални workflows, AI-базирани възли ([LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Qdrant RAG](../nodes/rag-node.md)), [AI Assistant](./ai-assistant.md), интеграции ([HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Notion](../nodes/notion-node.md), [WebSocket Send](../nodes/websocket-send-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), входяща [IMAP Trigger](../nodes/imap-trigger-node.md) електронна поща, изходяща [Send Email](../nodes/send-email-node.md)), планиране с [Cron](../nodes/cron-node.md) и [Portal](./portal.md) chat портали за крайни потребители.

Вижте също [Основни концепции](../getting-started/core-concepts.md), [Типове възли](./node-types.md) и [Интеграции с трети страни](./integrations.md).

### [Защо Heym](../getting-started/why-heym.md)

„Защо Heym“ проследява жизнения цикъл на агента (изграждане, оркестрация, изпълнение, наблюдение, оценяване, контрол, експониране) и показва какво поема един self-hosted runtime на всеки етап. Това обхваща [LLM](../nodes/llm-node.md) възела и [Agent Node](../nodes/agent-node.md) с tool calling, Python инструменти, [MCP](../tabs/mcp-tab.md) връзки, skills и multi-agent оркестрация; triggers, retries и [разпределение на натоварването](./cluster.md); [Traces](../tabs/traces-tab.md) с USD цена за всяко изпълнение и OpenTelemetry експорт; [Evals](../tabs/evals-tab.md); [контролни точки за човешки преглед](./human-in-the-loop.md), guardrails, SSO и одиторска следа; както и REST, MCP и Portal endpoints. Страницата завършва със сравнение на възможностите с n8n, Zapier и Make.com.

Вижте също [Agent Node](../nodes/agent-node.md), [LLM](../nodes/llm-node.md), [Qdrant RAG](../nodes/rag-node.md) и [Архитектура на агента](./agent-architecture.md).

### [Бърз старт](../getting-started/quick-start.md)

Стартирайте първия си workflow за минути: създайте workflow от раздела [Workflows](../tabs/workflows-tab.md), добавете [Input](../nodes/input-node.md) възел, [LLM](../nodes/llm-node.md) възел и [Output](../nodes/output-node.md) възел, след което ги свържете. Конфигурирайте [LLM](../nodes/llm-node.md) с удостоверение и задайте `userMessage` на `$input.text`; използвайте Run или [AI Assistant](./ai-assistant.md), за да изпълнявате или генерирате workflows с естествен език.

Комбинира се естествено с [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Output](../nodes/output-node.md) и [Expression DSL](./expression-dsl.md).

### [Основни концепции](../getting-started/core-concepts.md)

Workflows са насочени графи от възли, свързани с ребра; изпълнението преминава от trigger възли ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) през обработващи възли към [Output](../nodes/output-node.md) възли. Всеки възел има тип, данни (конфигурация) и входове/изходи; ребрата дефинират потока на данни. Възлите реферират данни от предходни възли чрез изрази на [Expression DSL](./expression-dsl.md) като `$nodeLabel.field`; независимите възли се изпълняват [паралелно](./parallel-execution.md) автоматично.

Вижте също [Triggers](./triggers.md), [Паралелно изпълнение](./parallel-execution.md) и [Структура на workflow](./workflow-structure.md).

### [Изпълнение и внедряване](../getting-started/running-and-deployment.md)

Heym предоставя `run.sh` за локална разработка (база данни в Docker, FastAPI backend, Vite frontend) и `deploy.sh` за production с Docker Compose. И двата използват `.env` файл; ключовите променливи включват `SECRET_KEY`, `ENCRYPTION_KEY`, `DATABASE_URL` и `ALLOW_REGISTER`. Разработката работи на конфигурируеми frontend и backend портове; production обслужва API под `/api` през frontend контейнера.

Вижте също [Сигурност](./security.md), [Enterprise](./enterprise.md) и [Настройки](./user-settings.md).

### [Мигриране към Heym](../getting-started/migrate-to-heym.md)

Инструментът AI Convert превръща workflow от друга платформа (n8n, Flowise, Dify, Langflow, sim.ai, Activepieces) или описание на прост английски език в Heym workflow, стриймван на живо върху работната площ и готов за [изтегляне и импортиране](./download-import.md). Той изпълнява AI проверка за сигурност, след което генерира DSL с входни и rate limits на място. Отворете го на [heym.run/convert](https://heym.run/convert).

Вижте също [Бърз старт](../getting-started/quick-start.md), [Изтегляне и импортиране](./download-import.md) и [AI Assistant](./ai-assistant.md).

---

## Възли

### Triggers
#### [Входен node](../nodes/input-node.md)

Входният node е началната точка за workflows, които получават данни от потребителя или от извикващия API. Той поддържа едно или няколко входни полета и предоставя метаданни за заявката (headers, query params). Достъпвайте полетата на body чрез `$nodeLabel.body.fieldKey`, headers чрез `$nodeLabel.headers`, а query чрез `$nodeLabel.query`.

Комбинира се естествено с [Condition](../nodes/condition-node.md), [LLM](../nodes/llm-node.md) и [Output](../nodes/output-node.md). За референции към payload и достъп до полета вижте [Expression DSL](./expression-dsl.md) и [Webhooks](./webhooks.md).

#### [Cron](../nodes/cron-node.md)

Cron node стартира workflow по график, използвайки стандартен cron израз с пет полета. Не се изисква потребителски вход — workflow се изпълнява автоматично в зададените моменти (например на всеки час, ежедневно, на всеки 15 минути). Резултатът е trigger event без payload.

Вижте също [Triggers](./triggers.md), [Wait](../nodes/wait-node.md) и [Execution History](./execution-history.md) за планирани и отложени изпълнения.

#### [IMAP Trigger](../nodes/imap-trigger-node.md)

IMAP Trigger node проверява входяща поща на конфигурируем интервал в минути и стартира workflow за всеки новооткрит имейл. Той връща като резултат парснати headers, списъци с подател и получатели, plain-text и HTML тела, метаданни за прикачени файлове и времева марка на trigger. Използвайте го за триаж на support входяща поща, маршрутизиране от пощенска кутия към [Slack](../nodes/slack-node.md) или имейл-базирани потоци за одобрение с [Human-in-the-Loop](./human-in-the-loop.md).

Комбинира се с [Send Email](../nodes/send-email-node.md), [LLM](../nodes/llm-node.md) и [Slack](../nodes/slack-node.md) за workflows за входящ триаж и отговори.

#### [Heym Trigger](../nodes/heym-trigger-node.md)

Heym Trigger node стартира workflow, когато самата Heym публикува платформено събитие: `heym.started`, `workflow.created`, `workflow.updated` или `workflow.deleted`. Доставката е пакетна — всяко събитие, публикувано в рамките на един петсекунден dispatch прозорец, пристига в едно изпълнение като `$nodeLabel.events`, което винаги е масив. Всяко събитие се заявява чрез уникално ограничение в базата данни, така че се задейства точно веднъж за абониран node, независимо колко workers, containers или машини работят. Използвайте го за одитни следи на промени по workflows, съобщения за deployment и обобщения за състоянието на инстанцията.

Комбинира се с node [Heym](../nodes/heym-node.md) за търсене на променения workflow и с [Loop](../nodes/loop-node.md) за действие веднъж на събитие.

#### [Heym](../nodes/heym-node.md)

Heym node чете собствените данни на Heym чрез три операции: `listWorkflows` връща всеки workflow, до който собственикът има достъп, с брой nodes и времеви марки; `getWorkflow` връща структурата от nodes и edges на един workflow; а `getExecutionHistory` връща записи от историята на изпълненията, подредени от най-новите към най-старите, с незадължителни филтри по статус, времеви прозорец и лимит, заедно с обобщени количества, групирани по статус. Резултатите са ограничени до собственика на workflow, в който се намира node, така че изпълнение, стартирано от cron, портал или събитие, връща същите данни като ръчно изпълнение. `getWorkflow` връща пълната конфигурация на node, което прави възможен одита на workflow за твърдо кодирани ключове или token-и; той не разкрива нищо, което собственикът на workflow вече не би могъл да отвори в редактора. Не се изисква удостоверение.

#### [WebSocket Trigger](../nodes/websocket-trigger-node.md)

WebSocket Trigger node отваря изходяща клиентска връзка към външен WebSocket сървър и стартира workflow при `onMessage`, `onConnected` или `onClosed`. Той предоставя парснати payload-и на съобщения, състояние на повторно свързване, метаданни за затваряне и URL на socket-а за последващи изрази.

Комбинира се с [WebSocket Send](../nodes/websocket-send-node.md), [HTTP](../nodes/http-node.md) и [SSE Streaming](./sse-streaming.md) за realtime интеграции.

#### [Telegram Trigger](../nodes/telegram-trigger-node.md)

Telegram Trigger node получава webhook обновления от бот и стартира workflow незабавно. Той предоставя пълния payload на обновлението, основния обект на съобщението, callback queries, санитизирани headers и времева марка на trigger. Използвайте го за чатботове, AI асистенти в [Telegram](../nodes/telegram-node.md) и потоци, задвижвани от бутони.

Комбинира се с [Telegram](../nodes/telegram-node.md), [Agent Node](../nodes/agent-node.md) и [Webhooks](./webhooks.md) за workflows, задвижвани от бот.

#### [Slack Trigger](../nodes/slack-trigger-node.md)

Slack Trigger node получава webhooks от Slack Events API и стартира workflow автоматично, след като провери подписа на заявката. Той предоставя payload на събитието и санитизирани headers за последващо маршрутизиране, класификация чрез [LLM](../nodes/llm-node.md) и потоци за отговори.

Комбинира се с [Slack](../nodes/slack-node.md), [Agent Node](../nodes/agent-node.md) и [Third-Party Integrations](./integrations.md).

#### [Discord Trigger](../nodes/discord-trigger-node.md)

Discord Trigger node получава webhooks от Discord Interactions API, проверява Ed25519 подписи с избраното удостоверение `discord_trigger` и стартира workflow. Той предоставя пълния payload на взаимодействието, данни за командата, санитизирани headers и метаданни за trigger за последващо маршрутизиране или отговори.

Комбинира се с [Output](../nodes/output-node.md), [Discord](../nodes/discord-node.md), [Agent Node](../nodes/agent-node.md) и [Third-Party Integrations](./integrations.md).
#### [RabbitMQ](../nodes/rabbitmq-node.md)

Node-ът RabbitMQ изпраща или получава съобщения от опашки и exchanges на RabbitMQ. Използвайте го за workflow-и, управлявани от съобщения, и обработка на събития. Режимът за изпращане публикува съобщение с незадължително закъснение; режимът за получаване действа като [trigger](./triggers.md), така че workflow-ът стартира при пристигане на съобщение. Изходът включва status, message_id и body.

Комбинира се с [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) и [Parallel Execution](./parallel-execution.md) за обработка, управлявана от събития.

#### [Error Handler](../nodes/error-handler-node.md)

Node-ът Error Handler се изпълнява автоматично, когато който и да е node във workflow-а се провали. Не са необходими входящи връзки; той се задейства от engine-а. Изходът включва error message, label на неуспешния node, тип на node и timestamp. Използвайте го, за да изпращате известия чрез [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) или [Send Email](../nodes/send-email-node.md), да логвате грешки или да връщате персонализирани отговори при грешка.

Като алтернатива на обработката на грешки върху canvas-а, workflow-ът може също да делегира неуспехи на отделен workflow — вижте [Error Workflow](#error-workflow). Ако canvas-ът вече съдържа node Error Handler, error workflow-ът **не** се извиква (локалният handler има предимство).

Често използвани цели за известия са [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) и [Send Email](../nodes/send-email-node.md); детайлите за изпълнението се преглеждат по-лесно в [Execution History](./execution-history.md).

### AI

#### [Agent Node](../nodes/agent-node.md)

Node-ът AI Agent е [LLM](../nodes/llm-node.md) node с tool calling. Той може да изпълнява Python tools, да извиква свързани canvas nodes като tools, да се свързва към [MCP](../tabs/mcp-tab.md) сървъри, да използва skills (файлове с инструкции и незадължителни Python скриптове), да действа като orchestrator, който делегира на други agent nodes, и да извиква други workflow-и като tools. Изходът е достъпен като `$nodeLabel.text`. Неза задължителен превключвател **Extra Body** прикачва JSON обект с параметри на заявката, специфични за доставчика, към всяка заявка в цикъла на tool calling; по подразбиране е изключен. Неза задължителен превключвател **Use Responses API** насочва заявките на модела на agent-а през Responses API, което запазва reasoning-а на модела между извикванията на tools, така че reasoning модел запазва веригата си на мислене през многостъпков цикъл; по подразбиране е изключен и работи с OpenAI и custom credentials.

Canvas node tools позволяват на agent да извиква конфигурирани workflow nodes директно от canvas-а. Свържете поддържан node към handle-а за tools на agent-а, след което маркирайте конкретни полета като предоставяни от agent-а с иконата на робот. Тези полета стават параметри на tool по време на изпълнение, докато credentials и немаркираните полета остават фиксирани в конфигурацията на node-а.

Секцията Skills вече включва **AI Build** за създаване на нови skills, вградено AI действие за редактиране на съществуващи skills, изтегляне на ZIP за отделен skill и незадължителен превключвател **Enable Drive files** за skills, които трябва да четат файлове от Heym Drive по време на изпълнение. Модалният прозорец Skill Builder предава на живо чат разговор отляво, приема файлове чрез drag-and-drop с всеки коментар за fine-tune, показва на живо preview само за четене на генерираните файлове `SKILL.md` и `.py` отдясно, може да изтегли този preview като ZIP и запазва качените fine-tune файлове обратно като bundled skill assets чрез същия ZIP ingestion flow, използван при ръчно качване.

С включена **[Agent Persistent Memory](./agent-persistent-memory.md)** всеки agent node поддържа собствена knowledge graph: факти се зареждат в system prompt-а, когато не е празен, а успешните изпълнения задействат фоново обединяване на нови entities и relationships. Sub-agents използват отделни graphs. Може да **споделите** графа на agent с други agents (в същия или в други workflow-и) с достъп само за четене или за четене/запис от диалога на графа. Контролата brain върху canvas-а отваря редактора на графа.

Agent nodes могат също да влязат в режим [Human-in-the-Loop](./human-in-the-loop.md). В този режим agent-ът получава tool `request_human_review` и може да спре на конкретни стъпки, изискващи одобрение, да създаде еднократна публична връзка за преглед, да expose-не клон `review` в canvas-а за notification flow-ове и да изчака, докато рецензент приеме, редактира или откаже Markdown текста за преглед. Полето HITL на node-а действа като насоки за одобрение кога да се пита, докато обобщението за рецензента се генерира от всяка заявка за преглед. За [MCP](../tabs/mcp-tab.md) tools Heym използва модела, за да интерпретира тези писмени инструкции като `always`, `once` или `never`, така че свободният език за одобрение се преобразува в конкретна runtime политика. Изпълнението се маркира като `pending` и се възобновява от запазения execution snapshot, след като решението пристигне, и същото agent изпълнение може да спре повече от веднъж, ако по-късни стъпки също изискват преглед.

Agent nodes автоматично компресират натрупаната си история на съобщенията, когато тя достигне 80% от context window-а на модела. System prompt-ът, първото потребителско съобщение и най-скорошното потребителско съобщение винаги се запазват; всичко между тях се обобщава с помощта на същия модел и credential. Събитията за компресия се виждат в Debug панела, [Execution History](./execution-history.md) и раздела [Traces](../tabs/traces-tab.md).

Вижте също [LLM](../nodes/llm-node.md), [Agent Architecture](./agent-architecture.md), [Agent Persistent Memory](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) и [File Generation](./file-generation.md).
#### [Codex](../nodes/codex-node.md)

Node-ът Codex изпълнява OpenAI Codex CLI в изолирана работна площ на Heym. Той приема Codex удостоверение (влезте с ChatGPT, за да използвате абонамента си без разходи за token по API, или поставете access token), GitHub удостоверение, URL на хранилище, базова branch, prompt за задачата, режим на публикуване (`diff_only` или `draft_pr`), име на branch и timeout. Runner-ът клонира хранилището локално, предава ChatGPT token bundle или `CODEX_ACCESS_TOKEN` само на процеса Codex и връща структурирано резюме, бележки от валидацията, променени файлове, diff, метаданни за използването и незадължителен URL на draft PR.

Когато Codex върне `needs_input`, workflow-ът се поставя на пауза и се показва branch-ът `question`. Свържете този branch към Slack, имейл или друг node за известия; публичната връзка за последващи действия възобновява запазения snapshot на изпълнението, след като отговорът бъде подаден. Node-ът Codex може също да бъде прикачен към AI Agent като инструмент, което позволява на агента да делегира задачи по програмиране; като инструмент резултатът `needs_input` се връща директно на агента, вместо да поставя workflow-а на пауза.

Вижте също [GitHub](../nodes/github-node.md), [Удостоверения](./credentials.md), [Споделяне на удостоверения](./credentials-sharing.md) и [Типове nodes](./node-types.md).

#### [OpenCode Go](../nodes/opencode-go-node.md)

Node-ът OpenCode Go изпълнява OpenCode CLI (Go) срещу GitHub хранилище. Изолацията следва модела на Codex: локално се изпълнява като подпроцес на хоста, докато при Docker внедрявания се изпълнява в защитен sibling контейнер, който споделя том-а на работната площ. Той приема OpenCode Go удостоверение (gateway API key с незадължителен base URL), GitHub удостоверение, URL на хранилище, базова branch, prompt за задачата, режим на публикуване, име на branch, timeout и модел `opencode-go/<model>`, избран от динамичен, търсим списък с модели (с вграден fallback). Heym извършва всички git/GitHub операции на хоста и никога не поставя GitHub token вътре в sandbox-а; OpenCode редактира само файлове на диска. Node-ът връща структурирано резюме, бележки от валидацията, променени файлове, diff и незадължителен URL на pull request. Може да бъде прикачен към AI Agent като инструмент.

Вижте също [Codex](../nodes/codex-node.md), [GitHub](../nodes/github-node.md), [Удостоверения](./credentials.md), [Споделяне на удостоверения](./credentials-sharing.md) и [Типове nodes](./node-types.md).

#### [LLM](../nodes/llm-node.md)

Node-ът LLM обработва текст с езиков модел или генерира изображения. Поддържа генериране на текст, vision (вход с изображение), генериране на изображения, структуриран JSON изход, изпълнение чрез provider-native Batch API за поддържани OpenAI и OpenAI-съвместими endpoint-и, както и незадължителен превключвател **Use Responses API**, който насочва извикването през Responses API вместо през Chat Completions (изключен по подразбиране; работи с OpenAI и потребителски удостоверения и не може да се комбинира с Batch режим). Конфигурирайте удостоверение, модел, системни и потребителски съобщения, temperature и max tokens; използвайте [Expression DSL](./expression-dsl.md) в prompt-овете. В batch режим `userMessage` трябва да се разреши до масив, node-ът излъчва branch `batchStatus` с актуализации за напредъка, а крайният изход включва batch резултати за всеки елемент. Незадължителен превключвател **Extra Body** прикачва JSON обект с параметри на заявката, специфични за provider-а (например `{"thinking": {"type": "disabled"}}`), към всяко API извикване; изключен е по подразбиране. Незадължителните [Guardrails](./guardrails.md) блокират нежелано съдържание преди извикването.

Комбинира се естествено с [Qdrant RAG](../nodes/rag-node.md), [Agent Node](../nodes/agent-node.md), [Guardrails](./guardrails.md) и [Диалог за оценка на изрази](./expression-evaluation-dialog.md).

#### [Decision](../nodes/decision-node.md)

Node-ът Decision задава на decision модел въпроси с типизирани отговори относно състоянието на изпълнението и връща вероятности вместо проза. Поле **State** носи това, което моделът трябва да прочете — самостоятелен израз запазва собствения си тип, така че `$input` изпраща обекта, а не текста му — а списък с въпроси носи оценките. Въпросите са в три форми: **noul** отговаря дали дадено условие е изпълнено, **choice** избира една опция от набор, който Вие дефинирате, и връща пълното разпределение, а **score** оценява състоянието по подредени нива и може да попадне между тях. Отговорите choice и score носят и confidence, така че [Switch](../nodes/switch-node.md) може да маршрутизира по отговора, докато [Condition](../nodes/condition-node.md) поставя условие за това колко сигурен е бил. **Generate with AI** създава шаблона за state и редовете с въпроси от обикновено изречение, а **Custom request body** изпраща ръчно написан JSON за endpoint с различен договор. Отговорът на provider-а се предава непроменен и всяко извикване се записва в [Изпълнения](../tabs/traces-tab.md).

Изисква удостоверение за Decision Model; комбинира се естествено с [Switch](../nodes/switch-node.md), [Condition](../nodes/condition-node.md) и [Agent Node](../nodes/agent-node.md).
#### [RAG / Vector Store](../nodes/rag-node.md)

Node-ът RAG / Vector Store вмъква, upsert-ва, изтрива и търси документи във векторно хранилище за retrieval-augmented generation. Падащо меню Database избира backend-а — **Qdrant** (външен сървър) или **Postgres (pgvector)** (собствената база данни на Heym, без външна услуга), като по подразбиране е Qdrant. Изберете векторно хранилище от раздела [Vectorstores](../tabs/vectorstores-tab.md) и задайте операцията на insert, upsert, delete или search. Upsert и delete адресират документ чрез уникален id, съхранен в payload-а — **Document ID Field** именува това поле (по подразбиране `doc_id`), а **Document ID** носи неговата стойност — така документът запазва id-то, което Вашата система вече използва: upsert заменя всяка съвпадаща точка преди съхраняването на новата версия, а delete отчита дали е имало съвпадение. Метаданните на документа приемат изрази в стойностите си, така че `{"url": "$start.url"}` съхранява това, което е произвело изпълнението. Search поддържа филтри по метаданни, опционален **Hybrid Search** (векторно сходство, обединено с BM25 съвпадение на ключови думи, така че точни термини като ID и кодове за грешки се намират наред със семантичните съвпадения) и опционално Cohere пренареждане (reranking) и връща масив от резултати с text, score, metadata, reranked и hybrid флагове и count за използване в потоци с [LLM](../nodes/llm-node.md) или [Agent Node](../nodes/agent-node.md).

Често срещани downstream node-ове са [LLM](../nodes/llm-node.md) и [Agent Node](../nodes/agent-node.md); настройката на векторното хранилище се намира в [Vectorstores](../tabs/vectorstores-tab.md).

#### [MCP Call Node](../nodes/mcp-call-node.md)

Node-ът MCP Call извиква конкретен [MCP](../tabs/mcp-tab.md) инструмент директно, без LLM да решава кой инструмент да извика. Използвайте го, когато знаете точно кой инструмент да стартирате още при проектирането — за детерминистично, едноетапно изпълнение на MCP инструмент във workflow. Конфигурирайте връзка (SSE, Streamable HTTP или stdio; същите полета като MCP връзката на [Agent Node](../nodes/agent-node.md)), натиснете **Fetch Tools**, за да попълните падащо меню, изберете инструмент и попълнете полетата за аргументи, които се рендерират автоматично от input schema на инструмента. Всеки аргумент приема статична стойност или [DSL израз](./expression-dsl.md) като `$userInput.body.text`. Резултатът е достъпен като `$nodeLabel.result` (JSON обект, ако е parseable, в противен случай string). Node-ът MCP Call не може да бъде свързан към [Agent Node](../nodes/agent-node.md) като canvas инструмент.

Вижте също [Agent Node](../nodes/agent-node.md), [MCP](../tabs/mcp-tab.md) и [Expression DSL](./expression-dsl.md).

### Logic

#### [Condition](../nodes/condition-node.md)

Node-ът Condition разклонява workflow-а въз основа на if/else израз. Има два изходни handle-а: един за случая, когато условието е truthy, и един за falsy. Използвайте оператори за сравнение и логически оператори от [Expression DSL](./expression-dsl.md) в израза за условие; node-ът препредава входа към избрания клон.

Вижте също [Switch](../nodes/switch-node.md), [Throw Error](../nodes/throw-error-node.md) и [Expression DSL](./expression-dsl.md).

#### [Switch](../nodes/switch-node.md)

Node-ът Switch насочва изпълнението по различни пътища чрез съпоставяне на стойност с case-ове. Конфигурирайте израз за оценяване и списък със стойности за case-ове; всеки case получава source handle, а default handle се използва за несъвпадащи стойности. Входът се препредава към съвпадналия клон.

Използвайте [Condition](../nodes/condition-node.md) за двоично разклоняване и [Merge](../nodes/merge-node.md) за повторно обединяване на насочени пътища; правилата за съпоставяне са описани в [Expression DSL](./expression-dsl.md).

#### [Merge](../nodes/merge-node.md)

Node-ът Merge изчаква множество паралелни входове и ги комбинира в единен изход. Задайте броя на входовете, които да се изчакат; node-ът произвежда обединен обект, след като всички клонове завършат. Използвайте го, за да обедините резултати от паралелни клонове, преди да продължите; не го използвайте, когато паралелните клонове завършват в отделни Output node-ове.

Вижте също [Parallel Execution](./parallel-execution.md), [Loop](../nodes/loop-node.md) и [Output](../nodes/output-node.md), когато рекомбинирате клонове.

#### [Loop](../nodes/loop-node.md)

Node-ът Loop итерира върху масив, изпълнявайки downstream node-ове за всеки елемент. Изисква обратна връзка от последния node в тялото на итерацията, за да премине напред. В тялото на цикъла използвайте `item`, `index`, `total`, `isFirst` и `isLast`; цикълът има отделни изходи за пътя на итерацията и за пътя на завършване.

Комбинира се с [Variable](../nodes/variable-node.md), [Merge](../nodes/merge-node.md) и [Expression DSL](./expression-dsl.md) за итеративни workflow-и.

### Data

#### [Set](../nodes/set-node.md)

Node-ът Set трансформира и map-ва входни данни към персонализиран изход. Дефинирайте key-value съпоставяния, където всяка стойност е израз от [Expression DSL](./expression-dsl.md). Използвайте го за uppercase, substring, конкатенация, случайни числа и подобни трансформации. Достъпвайте изхода по ключ (напр. `$setNode.keyName`). Когато е свързан към agent като canvas node инструмент, стойностите на съпоставянето могат да бъдат маркирани като предоставени от agent, така че agent-ът да ги попълва по време на изпълнение. За извикване на други workflow-и използвайте node-а [Execute](../nodes/execute-node.md) вместо това.

Вижте също [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) и [Expression DSL](./expression-dsl.md).
#### [Converter](../nodes/converter-node.md)

Node-ът Converter преобразува данни между формати без писане на код. Текстовите преобразувания са `csvToJson` (CSV текст в масив от обекти-редове или масиви, когато няма header), `jsonToCsv` (масив от обекти/редове в CSV текст), `xmlToJson` (XML текст в обект) и `jsonToXml` (обект в XML текст). Конфигурирайте посоката на преобразуване и source израза; CSV преобразуванията допълнително използват delimiter и обработка на header, а `jsonToCsv` може да фиксира изричен ред на колоните. Quoting, вградените delimiter-и и вградените нови редове следват RFC 4180. XML атрибутите използват префикси `@`, текстът смесен с атрибути използва `#text`, повтарящите се елементи стават масиви, а разгръщането на XML entity е изключено. Същият node работи и със съхранени файлове. `imageToText` и `pdfToText` изпълняват Tesseract OCR, като четат файл от Heym Drive (`$Upload.file.id` от File upload trigger, резултат от Drive node или генериран от агент файл), избират езика автоматично от разпознатия script или използват кодове, които посочите, като `tur` или `eng+tur`, и нормализират текста до UTF-8 по подразбиране с опционална NFC нормализация и по-тесни charset-и като `cp1254`. `fileConvert` пренаписва съхранен файл в друг формат — документи чрез pandoc и изображения чрез Pillow — и запазва резултата като нов Drive файл, без да засяга оригинала. Резултатът е наличен като `$converterNode.result`, като за OCR изпълнения до него са налични `.language`, `.encoding`, `.page_count`, `.pages` и `.file`, а за `fileConvert` — `.id`, `.filename` и `.download_url`.

Вижте също [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md) и [Expression DSL](./expression-dsl.md).

#### [Code](../nodes/code-node.md)

Node-ът Code изпълнява Python, който пишете, със собствен `requirements.txt`, в контейнер, който се създава и унищожава при всяко изпълнение. Вашият код дефинира функция `main(params)` и връща произволна JSON-сериализируема стойност, която става `$codeNode.result`; всичко, което отпечата, се улавя отделно като `$codeNode.logs`, а `$codeNode.install` отчита кой инструмент е инсталирал зависимостите. Параметрите се конфигурират като JSON обект, чиито `$` изрази се разрешават преди изпълнението, а кодът ги чете с dot notation като `params.user.name` или `params.orders[0].id`. Зависимостите се инсталират с `uv`, с връщане към `pip` за пакети, които `uv` не може да обработи, без кеширане между изпълненията; оставянето на `requirements.txt` празен пропуска инсталацията изцяло и е значително по-бързо. Фазата на изпълнение няма мрежа, освен ако `codeAllowNetwork` не е включен, докато инсталацията на зависимости винаги достига до PyPI. Sandbox-ът работи като non-root с премахнати всички capabilities, read-only root файлова система, без Docker socket и без достъп до backend secrets, ограничен до 512 MB памет, един CPU, 256 процеса, 120 секунди за инсталация и 60 секунди за изпълнение. Docker е задължителен и няма fallback режим: без достъпен daemon node-ът се проваля, вместо да изпълни кода Ви в backend процеса.

#### [Variable](../nodes/variable-node.md)

Node-ът Variable задава или обновява workflow-локална променлива (`$vars.variableName`) или постоянна [global variable](./global-variables.md) (`$global.variableName`). Използвайте го за броячи, натрупвани списъци и споделено състояние. Конфигурирайте име на променливата, израз за стойността, type coercion и дали да се съхранява в global store. Масивните променливи поддържат `$array()` и `.add()`.

Комбинира се с [Set](../nodes/set-node.md), [Loop](../nodes/loop-node.md) и [Global Variables](./global-variables.md).

#### [Execute](../nodes/execute-node.md)

Node-ът Execute извиква друг workflow (sub-workflow) и му подава входни данни. Посочете целевия workflow по ID и предоставете входни данни чрез единичен израз или key-value mappings. Изходът включва workflow_id, status и outputs; използвайте го за преизползваема логика, а не за трансформация на данни (за това използвайте Set).

Вижте също [Canvas Features](./canvas-features.md) за Extract to Sub-Workflow, [Workflow Structure](./workflow-structure.md) и [Output](../nodes/output-node.md).

### Integrations

#### [HTTP](../nodes/http-node.md)

Node-ът HTTP прави HTTP заявки чрез конфигурация в cURL стил. Може да бъде начална точка на workflow (без входящ edge) или да получава входни данни от upstream nodes. Отговорът е наличен като status, headers и body (парснат JSON, когато е приложимо). Използвайте [Credentials](./credentials.md) за Bearer или custom header автентикация.

Комбинира се с [Webhooks](./webhooks.md), [Credentials](./credentials.md) и [Third-Party Integrations](./integrations.md).

#### [WebSocket Send](../nodes/websocket-send-node.md)

Node-ът WebSocket Send отваря изходяща клиентска връзка, изпраща едно text/JSON/binary съобщение и я затваря. Използвайте го, за да публикувате изхода на workflow към realtime системи, без да създавате Heym-hosted socket endpoint.

Вижте също [WebSocket Trigger](../nodes/websocket-trigger-node.md), [SSE Streaming](./sse-streaming.md) и [Third-Party Integrations](./integrations.md).
#### [Telegram](../nodes/telegram-node.md)

Node-ът Telegram изпраща съобщение от бот до чат, група или канал. Конфигурирайте Telegram [credential](./credentials.md), задайте `chatId` и съставете изходящото `message` с изрази от [Expression DSL](./expression-dsl.md). Той се съчетава естествено с [Telegram Trigger](../nodes/telegram-trigger-node.md) за разговорни workflow-и и с [Error Handler](../nodes/error-handler-node.md) за известия към оператори.

Вижте също [Third-Party Integrations](./integrations.md) и [Credentials](./credentials.md) за настройка и модели за удостоверения.

#### [Slack](../nodes/slack-node.md)

Node-ът Slack изпраща съобщение до Slack канал чрез Incoming Webhook. Конфигурирайте Slack [credential](./credentials.md) и израз за съобщението. Използвайте го за нотификации, известия и докладване на грешки; изходът преминава през входа.

Съчетава се с [Slack Trigger](../nodes/slack-trigger-node.md), [Error Handler](../nodes/error-handler-node.md) и [Third-Party Integrations](./integrations.md).

#### [Discord](../nodes/discord-node.md)

Node-ът Discord изпраща съобщение до Discord канал чрез Incoming Webhook. Конфигурирайте Discord [credential](./credentials.md), съставете изходящото съобщение с [Expression DSL](./expression-dsl.md) и по желание задайте заместване на потребителско име или аватар за webhook-а.

Съчетава се с [Discord Trigger](../nodes/discord-trigger-node.md), [Output](../nodes/output-node.md), [Error Handler](../nodes/error-handler-node.md) и [Third-Party Integrations](./integrations.md).

#### [Send Email](../nodes/send-email-node.md)

Node-ът Send Email изпраща имейли чрез SMTP. Конфигурирайте SMTP [credential](./credentials.md) и изрази от [Expression DSL](./expression-dsl.md) за получател(и), тема и съдържание. Използвайте го за нотификации, известия и транзакционни имейли. Изходът включва статус, получател и тема.

[IMAP Trigger](../nodes/imap-trigger-node.md) допълва Send Email, като обработва входяща поща. Заедно те позволяват на даден workflow да чете входящи имейли от споделена пощенска кутия, да ги обобщава или класифицира с AI node-ове и да изпраща последващо или ескалационно съобщение. [Telegram Trigger](../nodes/telegram-trigger-node.md) и [Telegram node](../nodes/telegram-node.md) предоставят същия модел за входящи/изходящи потоци при чат workflow-и, управлявани от бот.

За двупосочни потоци от нотификации той се съчетава добре и с [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) и [Third-Party Integrations](./integrations.md).

#### [Redis](../nodes/redis-node.md)

Node-ът Redis извършва Redis операции: set, get, hasKey и deleteKey. Използвайте го за кеширане, ограничаване на честотата и съхранение тип ключ-стойност. Конфигурирайте [credential](./credentials.md), тип операция, израз за ключ, а за операциите set — стойност и незадължителен TTL. Изходът варира според операцията (стойност, успех, съществуване, изтрито).

Съчетава се с [Wait](../nodes/wait-node.md), [Variable](../nodes/variable-node.md) и [Parallel Execution](./parallel-execution.md) за кеширане, ограничаване на честотата и координация.

#### [Grist](../nodes/grist-node.md)

Node-ът Grist чете, записва и управлява данни в Grist електронни таблици. Операциите включват getRecord, getRecords, createRecord, updateRecord, deleteRecord, listTables и listColumns. Предоставете ID на документ, ID на таблица, а за create/update — данните за записа чрез ID на колони. Използвайте го за CRUD, пакетни актуализации и автоматизация на електронни таблици.

Вижте също [Google Sheets](../nodes/google-sheets-node.md), [DataTable](../nodes/datatable-node.md) и [Third-Party Integrations](./integrations.md).

#### [Google Sheets](../nodes/google-sheets-node.md)

Node-ът Google Sheets чете, записва и управлява данни в електронни таблици чрез OAuth2. Използвайте го, за да четете отчети, да добавяте резултати от workflow-и, да актуализирате тракери и да изчиствате или преглеждате раздели на таблица от вътрешността на даден workflow. Подобно на [BigQuery](../nodes/bigquery-node.md), той използва интеграционно удостоверение, поддържано от Google, и се вписва добре до [Grist](../nodes/grist-node.md), когато данните от електронни таблици са част от потока.

Съчетава се с [Grist](../nodes/grist-node.md), [DataTable](../nodes/datatable-node.md) и [Third-Party Integrations](./integrations.md).

#### [BigQuery](../nodes/bigquery-node.md)

Node-ът BigQuery изпълнява SQL заявки и вмъква редове в Google BigQuery набори от данни чрез OAuth2. Полезен е за аналитични workflow-и, потоци за отчети и запис на структурирани данни за събития от изпълнения на workflow-и. Често се съчетава с [Set](../nodes/set-node.md) за оформяне на редове и с [Google Sheets](../nodes/google-sheets-node.md) за по-леки отчети, ориентирани към електронни таблици.

Съчетава се с [Set](../nodes/set-node.md), [LLM](../nodes/llm-node.md), [Google Sheets](../nodes/google-sheets-node.md) и [Third-Party Integrations](./integrations.md).
#### [Google Drive](../nodes/google-drive-node.md)

Node-ът Google Drive изброява, изтегля, обновява и изтрива файлове и папки в Drive чрез OAuth2 и може да копира файл от Drive директно в [Heym Drive](../nodes/drive-node.md) чрез операцията си `syncToHeymDrive`. Google Docs, Sheets и Slides нямат изтегляеми байтове, затова node-ът ги експортира автоматично — Docs към PDF, Sheets към XLSX, Slides към PPTX — с възможност за замяна на целевия формат. Изтриванията преместват елементите в кошчето на Drive, освен ако не е активирано „Delete permanently“, а node-ът отказва да изтрие папка чрез файловата операция или обратното. Подобно на [Google Sheets](../nodes/google-sheets-node.md), той използва OAuth2 удостоверение, поддържано от Google; имайте предвид, че това удостоверение изисква пълен достъп до Drive, затова прегледайте [Credential Sharing](./credentials-sharing.md), преди да го споделите.

Комбинира се с [Loop](../nodes/loop-node.md), [Drive](../nodes/drive-node.md), [LLM](../nodes/llm-node.md) и [Third-Party Integrations](./integrations.md).

#### [GitHub](../nodes/github-node.md)

Node-ът GitHub предоставя 40 вградени GitHub REST действия, обхващащи repositories, organizations и users, issues, pull requests, reviews, releases, Actions workflows, traffic insights и repository files. Използвайте го за triage на issues, автоматизация на reviews, dispatch на workflows и изчакване на завършването им, автоматизация на releases и обновяване на файлове в repo без ръчно изграждане на HTTP заявки. Поддържа GitHub.com и опционален `base_url` за GitHub Enterprise в удостоверението.

Комбинира се с [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Set](../nodes/set-node.md) и [Third-Party Integrations](./integrations.md).

#### [Jira](../nodes/jira-node.md)

Node-ът Jira свързва workflows с Jira Cloud или Jira Data Center / Server REST APIs за автоматизация на projects, issues, comments, attachments, users, notifications и transitions. Може да изброява projects, да търси issues с JQL, да създава или обновява issues, да преглежда changelogs, да уведомява заинтересовани страни, да управлява comments и attachments, да извлича или управлява users, да изброява наличните transitions и да премества issues чрез transition ID. Използвайте Jira удостоверение с Atlassian email, API token, базов URL на сайта и режим на внедряване.

Комбинира се с [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) и [Third-Party Integrations](./integrations.md) за приемане на заявки за поддръжка, triage на bugs и workflows за releases.

#### [Linear](../nodes/linear-node.md)

Node-ът Linear свързва workflows с GraphQL API на Linear за автоматизация на workspace и issues. Може да изброява teams, projects, issues, workflow states, team members и comments; да създава, обновява, изтрива и свързва issues; и да създава, обновява, resolve-ва, unresolve-ва или изтрива comments. Използвайте личен API key за Linear или OAuth2 удостоверение, след което открийте UUID-тата на team, project, state и assignee чрез операциите за изброяване, преди да създавате или обновявате issues.

Комбинира се с [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) и [Third-Party Integrations](./integrations.md) за приемане на заявки, triage и workflows за инженерен backlog.

#### [Supabase](../nodes/supabase-node.md)

Node-ът Supabase чете и променя таблици, експонирани чрез Supabase PostgREST. Подходящ е за продуктови backend-и, данни за потребители и профили, състояние на workflows и CRUD-автоматизации, които се нуждаят от достъп до база данни без ръчно конфигуриране на HTTP заявки.

Комбинира се с [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md), [HTTP](../nodes/http-node.md) и [Third-Party Integrations](./integrations.md).

#### [ClickHouse](../nodes/clickhouse-node.md)

Node-ът ClickHouse изпълнява CRUD, count и raw SQL операции срещу външна база данни ClickHouse чрез нейния HTTP интерфейс. Подходящ е за аналитични pipelines, логване на събития и workflows за отчети: вмъквайте събития в момента на настъпването им, след което ги агрегирайте или преброявайте с `query`/`count`. Той възпроизвежда набора от операции на [DataTable](../nodes/datatable-node.md) (find, getAll, count, getById, insert, update, remove, upsert) плюс възможност за raw SQL, като `update`/`remove` се изпълняват като ClickHouse mutations.

Комбинира се с [Set](../nodes/set-node.md), [Cron](../nodes/cron-node.md) за планирани отчети и [Third-Party Integrations](./integrations.md).

#### [Notion](../nodes/notion-node.md)

Node-ът Notion управлява бази данни, data sources, страници и блокове в Notion чрез текущия Notion API (`2026-03-11`). Поддържа търсене, CRUD на страници, операции с бази данни и data sources, block children, append/update/delete на блокове и trash/restore. Използвайте internal integration token или OAuth удостоверение за публична интеграция с Notion. Редакторът може да търси и да пагинира с курсор достъпните data sources и родителски страници. Споделените удостоверения работят по същия начин като собствените удостоверения при изпълнение на workflows.

За персонализирани REST заявки `$credentials.YourNotionCredential` се разрешава до същия bearer token. Комбинира се с [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [LLM](../nodes/llm-node.md) и [Third-Party Integrations](./integrations.md).
#### [Sentry](../nodes/sentry-node.md)

Node-ът Sentry автоматизира организации, проекти, екипи, проблеми (issues), събития и releases в Sentry чрез Sentry REST API. Използвайте го за триаж на известия, обновяване на статус на проблеми, автоматизация на releases, търсене на събития и настройка или почистване на проекти и екипи. Поддържа Sentry SaaS и self-hosted Sentry чрез незадължителен base URL в удостоверенията.

Комбинира се с [Error Handler](../nodes/error-handler-node.md), [Slack](../nodes/slack-node.md), [Linear](../nodes/linear-node.md) и [Third-Party Integrations](./integrations.md) за workflows при инциденти и releases.

#### [DataTable](../nodes/datatable-node.md)

Node-ът DataTable чете, записва и управлява данни в Heym DataTables (собствено структурирано хранилище). Операциите включват find, getAll, getById, insert, update, remove и upsert. Не са необходими външни удостоверения. Таблиците се управляват от таба [DataTable](../tabs/datatable-tab.md) в таблото и се достъпват директно от собственика на workflow-а.

Комбинира се с [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md) и таба [DataTable](../tabs/datatable-tab.md) за собствено структурирано хранилище.

#### [Drive](../nodes/drive-node.md)

Node-ът Drive управлява файлове, генерирани от skills, директно в рамките на workflow. Операциите включват delete, setPassword, setTtl, setMaxDownloads, shareWithMyTeams и unshareWithMyTeams за управление на достъп за четене от екипи; конвертирането на формати се извършва в node-а [Converter](../nodes/converter-node.md). Реферирайте файла с `$agentLabel._generated_files[0].id`; изходните данни включват status, file_id, обновен download_url за ограничения на линкове и shared_team_count за споделяне с екипи. Това е особено полезно при workflows с [Agent Node](../nodes/agent-node.md), които използват [File Generation](./file-generation.md) и референтния модел на [Drive](./drive.md).

Често използвани заедно с [Agent Node](../nodes/agent-node.md), [File Generation](./file-generation.md) и [Drive](./drive.md).

#### [Amazon S3](../nodes/amazon-s3-node.md)

Node-ът Amazon S3 изпълнява операции с обектно хранилище върху Amazon S3 чрез `s3` удостоверение (access key, secret key, region, незадължителен session token). Операциите включват putObject, getObject, deleteObject, listObjects, copyObject, createBucket, deleteBucket, createFolder, deleteFolder, getAllFolder и listBuckets. Поддържа се качване на текст и изтегляне на текст или base64, като полетата за bucket и key приемат [Expression DSL](./expression-dsl.md). Използвайте го за съхранение на изходни данни от workflows, архивиране на файлове и връщане на обекти обратно в потока.

Комбинира се с [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [Credentials](./credentials.md) и [Third-Party Integrations](./integrations.md).

### Automation

#### [Crawler](../nodes/crawler-node.md)

Node-ът Crawler извлича съдържание от уеб страници чрез FlareSolverr с незадължително извличане на HTML посредством CSS селектори. Конфигурирайте [credential](./credentials.md) за FlareSolverr, URL израз, време за изчакване и незадължителни селектори за извличане. Изходът е суровият HTML или извлеченото съдържание. Използвайте го за web scraping и извличане на съдържание.

Комбинира се с [HTTP](../nodes/http-node.md), [Playwright](../nodes/playwright-node.md) и [LLM](../nodes/llm-node.md) за потоци от типа scrape-and-analyze.

#### [Playwright](../nodes/playwright-node.md)

Node-ът Playwright автоматизира взаимодействия с браузър чрез конфигурируеми стъпки (navigate, refresh, click, type, screenshot, extract, aiStep) или режим **Run Code** за персонализиран Playwright Python (в sandbox; изключен по подразбиране чрез `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED`). Поддържа headless режим, незадължителна настройка, която намалява често срещаните сигнали за автоматизация на Playwright, timeouts, незадължително прихващане на мрежови данни (responses, cookies, localStorage, sessionStorage), bootstrap на автентикация чрез cookie/storageState от изрази в [Global Variables](./global-variables.md) като `$global.authState`, резервни стъпки за вход при неуспешно възстановяване на автентикацията и AI стъпка с Auto Heal при неуспешни селектори. Използвайте го за web scraping, попълване на формуляри и browser-based workflows.

Вижте също [Crawler](../nodes/crawler-node.md), [HTTP](../nodes/http-node.md) и [Execution History](./execution-history.md) за browser automation и debugging.

### Utilities

#### [Output](../nodes/output-node.md)

Node-ът Output е endpoint-ът на workflow-а, който връща отговора на извикващия. Задайте израза за съобщението така, че да реферира предходния node по етикет (никога не използвайте `$input` от node-а [Input](../nodes/input-node.md) тук). Незадължителният async downstream позволява на nodes след output-а да се изпълнят във фонов режим, след като отговорът бъде изпратен.

Често срещани източници upstream са [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md) и [Execute](../nodes/execute-node.md); оформяне на отговора се дебъгва по-лесно в [Expression Evaluation Dialog](./expression-evaluation-dialog.md).

#### [JSON output mapper](../nodes/json-output-mapper-node.md)

Node-ът JSON output mapper изгражда обикновен JSON обект от key-value mappings в стила на [Set](../nodes/set-node.md) и го връща в основата на отговора на workflow-а. Използвайте го, когато извикващ API трябва да получи сурово JSON тяло вместо стандартната обвивка на node-а [Output](../nodes/output-node.md).
#### [HTML output mapper](../nodes/html-output-mapper-node.md)

Възелът HTML output mapper рендерира един HTML шаблон, като интерполира изрази `$nodeLabel.field` в страницата. Когато той е единственият терминален възел на workflow-а, execute webhook-ът отговаря с `text/html` и конфигурирания за възела статус код вместо с JSON тяло, така че един workflow може да обслужва страница директно към браузър. Изпратете `X-Simple-Response: false`, за да получите обичайния JSON envelope обратно за целите на debugging.

Комбинира се с [Set](../nodes/set-node.md), [Output](../nodes/output-node.md), [Workflow Structure](./workflow-structure.md) и [Webhooks](./webhooks.md).

#### [Chart Output](../nodes/chart-output-node.md)

Възелът Chart Output е терминалният възел на workflow-а на widget от [Dashboard](../tabs/dashboard-tab.md). Той превръща редовете, произведени от възлите по-нагоре по веригата, в стандартизиран chart payload, който dashboard-ът рендерира. Изберете `chartType` (bar, line, area, pie, table, numeric, gauge, scatter, proportion, bar gauge, text или HITL), съпоставете `labelField`/`valueField` (или `series` за multi-series, или `text` за markdown съобщение) и го поставете последен; той няма изходен edge. HITL игнорира редовете по-нагоре по веригата и изброява чакащите Ви човешки ревюта. а друга като бутони за връзка, които отварят URL адрес в нов раздел (`linkColumn`, с `linkLabel` за текста на бутона)

Вижте също [Dashboard](../tabs/dashboard-tab.md), [Set](../nodes/set-node.md) и [Output](../nodes/output-node.md).

#### [Wait](../nodes/wait-node.md)

Възелът Wait поставя на пауза изпълнението на workflow-а за зададена продължителност в милисекунди, до 15 минути. Използвайте го за rate limiting, отложени действия или интервали за polling. Той пропуска входа непроменен.

Комбинира се с [Cron](../nodes/cron-node.md), [Redis](../nodes/redis-node.md) и [Parallel Execution](./parallel-execution.md) за темпо и polling.

#### [Sticky Note](../nodes/sticky-note-node.md)

Възелът Sticky Note добавя markdown бележки към canvas-а. Той не се изпълнява. Използвайте го за документация, инструкции или бележки за workflow-а редом с другите [Canvas Features](./canvas-features.md). Кликнете двукратно върху canvas-а, за да редактирате съдържанието на бележката.

Вижте също [Canvas Features](./canvas-features.md), [Keyboard Shortcuts](./keyboard-shortcuts.md) и [Workflow Organization](./workflow-organization.md).

#### [Console Log](../nodes/console-log-node.md)

Възелът Console Log записва стойност в конзолата на backend-а (сървъра). Използвайте го за debugging и инспекция по време на разработка. Съобщението в log-а поддържа изрази от [Expression DSL](./expression-dsl.md); изходът пропуска входа непроменен.

Комбинира се с [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md) и [Expression Evaluation Dialog](./expression-evaluation-dialog.md) за debugging.

#### [Disable Node](../nodes/disable-node.md)

Възелът Disable Node трайно деактивира друг възел във workflow-а, като задава флага му `active` на false. Укажете целевия възел чрез етикет. Използвайте го за еднократни операции, като например спиране на trigger [Cron](../nodes/cron-node.md) след изпълнение на дадено условие.

Вижте също [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md) и [Cron](../nodes/cron-node.md) за модели за управление на workflow-и.

#### [Enable Node](../nodes/enable-node.md)

Възелът Enable Node включва отново друг възел, като задава флага му `active` на true и запазва промяната. Укажете целевия възел чрез етикет. Използвайте го, за да активирате отново деактивиран trigger [Cron](../nodes/cron-node.md) от друга входна точка, или за да включите възел, след като бъде изпълнено дадено условие. Целеви възел, който се намира след Enable Node и все още не е бил изпълнен, също се изпълнява в текущото изпълнение.

Вижте също [Disable Node](../nodes/disable-node.md), [Canvas Features](./canvas-features.md) и [Cron](../nodes/cron-node.md) за модели за управление на workflow-и.

#### [Throw Error](../nodes/throw-error-node.md)

Възелът Throw Error спира изпълнението на workflow-а незабавно и връща отговор за грешка със зададен HTTP статус код. Задайте израза за съобщението за грешка и статус кода (напр. 400, 401, 403, 404, 429, 500). Използвайте го за неуспешна валидация, неоторизиран достъп или други условия за грешка, особено в комбинация с [Condition](../nodes/condition-node.md) и [Error Handler](../nodes/error-handler-node.md).

Комбинира се с [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) и [Security](./security.md) за явни пътища при неуспех.

---

## Справка
### [Типове nodes](./node-types.md)

Heym предоставя разнообразие от типове nodes: triggers като [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) и [Error Handler](../nodes/error-handler-node.md); AI nodes като [LLM](../nodes/llm-node.md), [Decision](../nodes/decision-node.md), [Agent Node](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Qdrant RAG](../nodes/rag-node.md) и [MCP Call](../nodes/mcp-call-node.md); логически nodes като [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Merge](../nodes/merge-node.md) и [Loop](../nodes/loop-node.md); nodes за данни като [Set](../nodes/set-node.md), [Converter](../nodes/converter-node.md), [Code](../nodes/code-node.md), [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) и [Heym](../nodes/heym-node.md); интеграции като [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), [Discord](../nodes/discord-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md), [Grist](../nodes/grist-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Drive](../nodes/google-drive-node.md), [BigQuery](../nodes/bigquery-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [DataTable](../nodes/datatable-node.md) и [Drive](../nodes/drive-node.md); nodes за автоматизация като [Crawler](../nodes/crawler-node.md) и [Playwright](../nodes/playwright-node.md); и помощни инструменти като [Wait](../nodes/wait-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md), [HTML output mapper](../nodes/html-output-mapper-node.md), [Console Log](../nodes/console-log-node.md), [Throw Error](../nodes/throw-error-node.md), [Disable Node](../nodes/disable-node.md), [Enable Node](../nodes/enable-node.md) и [Sticky Note](../nodes/sticky-note-node.md). Използвайте изрази като `$input.text` и `$nodeLabel.field` в конфигурацията на nodes.

Вижте също [Triggers](./triggers.md), [Third-Party Integrations](./integrations.md) и [Parallel Execution](./parallel-execution.md).

### [Expression DSL](./expression-dsl.md)

Heym използва опростен език за изрази за рефериране на данни от предходни nodes. Използвайте `$input` за node [Input](../nodes/input-node.md), `$nodeLabel.field` за всеки предходен node, `$credentials.CredentialName` за [удостоверения](./credentials.md) и `$global.variableName` за [глобални променливи](./global-variables.md). Вградените специални променливи включват `$now`, `$UUID` и метаданни на workflow: `$workflowName`, `$workflowDescription`, `$workflowPath`, `$workflowUrl` и `$executionId` (id на [Историята на изпълненията](./execution-history.md) за конкретното изпълнение — `/workflows/{id}/{executionId}` отваря това изпълнение върху canvas; само по време на изпълнение, празно в диалога за преглед на изрази). Поддържат се литерали, аритметика, сравнения, контекст на [Loop](../nodes/loop-node.md), вложени полета и помощни функции за низове/масиви (включително `$text.toJson()` за парсване на JSON низ). Когато цялата стойност е единичен `$expr`, backend-ът запазва масивите, обектите, булевите стойности и числата като нативни типове.

Вижте също [Expression Evaluation Dialog](./expression-evaluation-dialog.md), [Global Variables](./global-variables.md) и [Workflow Structure](./workflow-structure.md).

### [Глобални променливи](./global-variables.md)

Global Variable Store съхранява постоянни данни тип ключ-стойност, обвързани с потребителя, които се запазват между изпълненията на workflows. Създавайте променливи от раздела [Променливи](../tabs/global-variables-tab.md) или от node [Variable](../nodes/variable-node.md) с включена опция "Store in Global Variable Store". Достъпвайте ги чрез `$global.variableName` в изрази; те могат да бъдат споделяни с други потребители или [екипи](./teams.md).

Комбинира се с [Variable](../nodes/variable-node.md), [Teams](./teams.md) и [Credentials Sharing](./credentials-sharing.md) за споделено състояние на workflow.
### [Диалог за оценка на изрази](./expression-evaluation-dialog.md)

Диалогът за оценка на изрази е разширяем редактор, който се появява при натискане на бутона за разширяване до полетата за изрази. Отваря се като голям центриран модален прозорец, поддържа автодовършване активено и автоматично обновява preview изхода от backend-а, след като спрете да пишете. Резултатите от тип обект и масив могат да бъдат разглеждани чрез избора на път за изход. Диалогът приема пълен bare dot path на цял ред (например `myNode.output.field`), сякаш е `$myNode.output.field`; вижте правилата за позициониране в [Expression DSL](./expression-dsl.md).

Бутонът **Build with AI** в лентата с инструменти Ви позволява да опишете желания израз на обикновен текст. Изберете [credential](./credentials.md) за LLM и модел, въведете описание като *"Get the customer name from the API response"* и натиснете Generate. Backend-ът изпраща контекста на [Expression DSL](./expression-dsl.md) и изходите от последното изпълнение на възлите към модела и връща единен низ с израз. Резултатът се оценява незабавно, така че да можете да го проверите, преди да натиснете Apply.

Комбинира се естествено с [Expression DSL](./expression-dsl.md), [Output](../nodes/output-node.md) и [JSON output mapper](../nodes/json-output-mapper-node.md).

### [Структура на Workflow](./workflow-structure.md)

Workflows се съхраняват като JSON с възли и ребра. Обектът на workflow включва id, name, description, nodes, edges и настройки за автентикация. Всеки възел има id, type, position и data (label и конфигурация, специфична за типа). Ребрата свързват ID-та на изходен и целеви възел с незадължителни handle ID-та. Синтаксисът на изразите в полетата с data следва [Expression DSL](./expression-dsl.md), като същата тази структура се използва от [Download & Import](./download-import.md).

Вижте също [Node Types](./node-types.md), [Expression DSL](./expression-dsl.md) и [Download & Import](./download-import.md).

### [Функции на Canvas](./canvas-features.md)

Задръжте курсора върху който и да е non-sticky възел на canvas-а и натиснете **Run**, за да изпълните до този възел. Задължителните входни данни се отварят в панела Run с фокус върху първото поле; пътищата без входни данни стартират незабавно. Вижте [Run to Node](./canvas-features.md#run-to-node).

Редакторът на workflow предоставя Data Pin (прикрепване на последния изход на възел за тестване надолу по веригата без повторно изпълнение), Execution Logs (резултати от възли в реално време и напредък на агента, които допълват [Execution History](./execution-history.md)), Enable/Disable (пропускане на възли по време на изпълнение) и Extract to Sub-Workflow (преместване на селекция в нов workflow и заместването ѝ с възел [Execute](../nodes/execute-node.md)). Изпълняващ се production workflow може да бъде отворен от History или от карта в Board; редакторът възстановява текущия му snapshot, свързва се към SSE и поддържа анимацията на canvas-а и Debug логовете активни. [Keyboard Shortcuts](./keyboard-shortcuts.md) поддържат copy, paste, run и inline търсене на възли.

Вижте също [Keyboard Shortcuts](./keyboard-shortcuts.md), [Edit History](./edit-history.md) и [Execution History](./execution-history.md).

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Watch Editor demo</a></p>

### [Keyboard Shortcuts](./keyboard-shortcuts.md)

Heym предоставя shortcuts в целия редактор: Command Palette (Ctrl+K), Run (Ctrl+Enter), Save (Ctrl+S), Undo/Redo и Escape за затваряне. На canvas-а: select all, multi-select, copy/cut/paste, delete, превключване на enabled състояние на възел (D), превключване на pinned data (P) и inline търсене на възли чрез писане. Shortcuts са документирани във вградената справка на приложението и работят в тясна връзка с [Canvas Features](./canvas-features.md) като Data Pin и enable/disable на възли.

Вижте също [Canvas Features](./canvas-features.md), [Quick Drawer](./quick-drawer.md) и [Contextual Showcase](./contextual-showcase.md).

### [AI Assistant](./ai-assistant.md)

AI Assistant е чат панел, отварян от Debug панела, който Ви позволява да създавате или променяте workflows с естествен език. Изберете [credential](./credentials.md) и модел, след което опишете какво искате; AI предава отговора на поток и всеки валиден [workflow JSON](./workflow-structure.md) в code block се анализира автоматично и се прилага към canvas-а. Поддържа се гласов вход в съвместими браузъри.

Включете **YOLO mode** (Agent mode, изключен по подразбиране) и асистентът тества това, което създава. След всяка промяна той изпълнява workflow-а на canvas-а, прочита резултата и поправя workflow-а, докато не направи това, което сте поискали, за до 5 изпълнения на съобщение. Преди първото изпълнение пита за тестови входни данни, може да изпълнява другите Ви workflows, когато се нуждае от резултата им, и показва всяка стъпка, докато работи. Вижте [AI Assistant › YOLO Mode](./ai-assistant.md#yolo-mode).

Щракнете върху **AI** над всеки възел на canvas-а, за да промените или поправите само този възел. Панелът показва възела, който променя (с последния му резултат след стартиране), и предлага **Change this node as ...**, **Fix error in this node ...** и **Other**. Обновява се само този възел; останалата част от workflow-а и оформлението остават непроменени. Вижте [AI Assistant › Промяна на единичен възел](./ai-assistant.md#changing-one-node).

Когато даден workflow съхранява записи, асистентът пита коя [data table](../tabs/datatable-tab.md) да се използва или създава такава с колоните, от които workflow-ът се нуждае. Вижте [AI Assistant › Data tables](./ai-assistant.md#data-tables).

Когато текущият workflow съдържа skills на [Agent Node](../nodes/agent-node.md), асистентът изпраща само `SKILL.md` на всеки skill в контекста на workflow-а. Прикачените `.py` файлове и бинарните skill assets се изключват преди заявката, така че големите skill bundles да не препълват контекстния прозорец на модела.

Комбинира се добре с [Chat with Heym](./chat-with-heym.md), [Agent Architecture](./agent-architecture.md) и [Expression DSL](./expression-dsl.md).
### [Chat с Heym](./chat-with-heym.md)

Chat с Heym е асистент в заглавната лента на документацията за продуктови въпроси. Отваря се в центриран диалогов прозорец, поддържа избора на удостоверения и модел видим в горната част, инжектира пътя на активната страница от документацията като контекст и изчиства историята на съобщенията при затваряне на диалоговия прозорец. Допълва по-широкия [AI Assistant](./ai-assistant.md) и по-леката [Contextual Showcase](./contextual-showcase.md).

Вижте също [AI Assistant](./ai-assistant.md), [Contextual Showcase](./contextual-showcase.md) и [Node Types](./node-types.md).

### [Организация на Workflows](./workflow-organization.md)

Администраторите на инстанцията (`HEYM_ADMIN_EMAILS`) могат да достъпват и редактират всеки workflow, да намират workflows на собственик по имейл, да преглеждат графици и история на изпълненията, да поставят на пауза и възобновяват автоматични triggers и да изтриват workflows, след като изпълненията приключат. Вижте [Instance Administration](../tabs/workflows-tab.md#instance-administration) за процеса по offboarding и разликата между поставяне на пауза на автоматични triggers и блокиране на всички извиквания.

Workflows могат да бъдат организирани в папки и подпапки в дървовидна структура. Папките имат имена и незадължителен родител; workflows се присвояват на папки. Workflows могат да бъдат планирани за изтриване (преместване в зона за кошче преди окончателно премахване). API поддържа създаване, актуализиране, изтриване и преместване на workflows между папки, а същият модел на организация се появява в раздела [Workflows](../tabs/workflows-tab.md).

Вижте също [Quick Drawer](./quick-drawer.md), [Download & Import](./download-import.md) и [Edit History](./edit-history.md).

### [Quick Drawer](./quick-drawer.md)

Quick Drawer е фиксиран панел от дясната страна за бързо изпълнение на вътрешни страници извън canvas. Позволява търсене на [workflows](../tabs/workflows-tab.md), закачане на любими, избор на входни данни, незабавно изпълнение и преглед на напредъка или резултатите без отваряне на редактора. Workflow с [File Upload Trigger](../nodes/file-upload-trigger-node.md) приема пуснат или избран файл. Редът на закачане и последно избраният workflow се запазват в браузъра.

Вижте също [Организация на Workflows](./workflow-organization.md), [Keyboard Shortcuts](./keyboard-shortcuts.md) и [Execution History](./execution-history.md).

### [Contextual Showcase](./contextual-showcase.md)

Contextual Showcase е компактна вградена помощна лента за автентикирани основни повърхности като раздели на таблото, [Evals](../tabs/evals-tab.md), Docs и редактора на workflows. Остава затворена по подразбиране, показва първо кратко резюме на страницата, предлага малко допълнителни подробности при поискване и препраща към пълната статия в документацията, когато желаете по-задълбочено ръководство.

Съчетава се с [Chat с Heym](./chat-with-heym.md), [Quick Drawer](./quick-drawer.md) и [AI Assistant](./ai-assistant.md) за вградени помощни потоци.

### [Удостоверения](./credentials.md)

Удостоверенията съхраняват API ключове и тайни, използвани от nodes на workflows. Добавете ги в раздела [Удостоверения](../tabs/credentials-tab.md) и ги реферирайте по име или ID в nodes като [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Send Email](../nodes/send-email-node.md) и [Redis](../nodes/redis-node.md). Те са криптирани при съхранение, могат да бъдат споделяни с потребители или [екипи](./teams.md) и могат също да бъдат реферирани в [Expression DSL](./expression-dsl.md) чрез `$credentials.Name`.

Вижте също [Удостоверения](../tabs/credentials-tab.md), [Споделяне на удостоверения](./credentials-sharing.md) и [Third-Party Integrations](./integrations.md).

### [Споделяне на удостоверения](./credentials-sharing.md)

Удостоверенията могат да бъдат споделяни с други потребители по имейл или с екипи; всички членове на екипа получават достъп, когато удостоверение бъде споделено с екип. Споделените удостоверения се показват с индикатор в раздела [Удостоверения](../tabs/credentials-tab.md). По време на изпълнение контекстът на собственика на workflow обединява собствени, споделени с потребители и споделени с екипи удостоверения. Използвайте `$credentials.CredentialName` в изрази или задайте credentialId в данните на node.

Вижте също [Удостоверения](./credentials.md), [Екипи](./teams.md) и [Third-Party Integrations](./integrations.md).

### [Екипи](./teams.md)

Екипите Ви позволяват да споделяте workflows, удостоверения, глобални променливи, векторни хранилища и Drive файлове с група потребители наведнъж. Създайте екипи от раздела [Екипи](../tabs/teams-tab.md) и добавете членове по имейл. Споделете ресурси с екип от съответните диалогови прозорци за споделяне; всички членове тогава имат достъп. Създателят може да редактира и изтрива екипа; изтриването на екип премахва всички споделяния с екипа.

Съчетава се с [Споделяне на удостоверения](./credentials-sharing.md), [Global Variables](./global-variables.md) и [Enterprise](./enterprise.md).

### [Паралелно изпълнение](./parallel-execution.md)

Heym изпълнява nodes паралелно, когато те нямат зависимости помежду си. Изпълнителят изгражда DAG и изпълнява nodes на едно и също ниво едновременно с thread pool; щом даден node завърши, неговите downstream nodes се планират. Използвайте node [Merge](../nodes/merge-node.md), за да комбинирате паралелни разклонения, когато е необходимо. Множество изпълнения на workflows се изпълняват едновременно; всяко изпълнение е изолирано. Режимът [SSE Streaming](./sse-streaming.md) излъчва събития, когато nodes завършат.

Вижте също [Merge](../nodes/merge-node.md), [Loop](../nodes/loop-node.md) и [Execution History](./execution-history.md).
### [Agent Architecture](./agent-architecture.md)

[Agent Node](../nodes/agent-node.md) поддържа sub-agents (orchestrator извиква други agent nodes чрез call_sub_agent), sub-workflows (agent извиква други workflows чрез call_sub_workflow), skills (инструкционно съдържание и Python инструменти от .zip или .md) и [MCP](../tabs/mcp-tab.md) клиентски връзки. Изпълнителят на orchestrator инструменти маршрутизира извикванията към sub-agent и sub-workflow; останалите инструменти се насочват към Python, MCP или skill изпълнители. Максималната дълбочина на влагане за sub-agents и sub-workflows е 5. Цикълът за извикване на инструменти включва автоматична компресия на контекста: преди всяка итерация използването на token се оценява и ако надвиши 80% от контекстния прозорец на модела, средните съобщения се обобщават чрез същия модел, като system prompt, първото потребителско съобщение и последното потребителско съобщение остават непроменени.

Вижте също [Agent Node](../nodes/agent-node.md), [Agent Persistent Memory](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) и [MCP](../tabs/mcp-tab.md).

### [Agent Persistent Memory](./agent-persistent-memory.md)

Опционална за всеки [Agent Node](../nodes/agent-node.md) графа от знания, съхранявана в Postgres: обекти, типове, свойства и насочени връзки. Когато `persistentMemoryEnabled` е true, графата се обобщава в system prompt при всяко изпълнение; след успешни завършвания [LLM](../nodes/llm-node.md) извлича структурирани обновления на заден план. REST CRUD се намира под `/api/workflows/{workflow_id}/nodes/{canvas_node_id}/agent-memory/...`. Редакторът се отваря от розовата контрола с мозък на node.

Вижте също [Agent Node](../nodes/agent-node.md), [Agent Architecture](./agent-architecture.md) и [Traces](../tabs/traces-tab.md).

### [Human-in-the-Loop](./human-in-the-loop.md)

Human-in-the-loop позволява на [Agent Node](../nodes/agent-node.md) да поиска одобрение на определени контролни точки, да създаде публична страница `/review/{token}` и да изчака невлезнал в системата рецензент да приеме, редактира или откаже Markdown текста за преглед. Агентите с активиран HITL също предоставят изходен handle `review`, така че можете да уведомите [Slack](../nodes/slack-node.md), [Send Email](../nodes/send-email-node.md) или други канали, докато изпълнението е в очакване. HITL текстът на ниво node се използва като насоки за одобрение, докато обобщението на публичната страница се генерира от самата заявка за преглед. Изпълненията в очакване се появяват в [Execution History](./execution-history.md) незабавно, могат да се случат повече от веднъж в едно и също изпълнение и се възобновяват от точния запазен snapshot на workflow, след като всяко решение бъде подадено.

Вижте също [Agent Node](../nodes/agent-node.md), [Portal](./portal.md), [Execution History](./execution-history.md) и [Send Email](../nodes/send-email-node.md).

### [Webhooks](./webhooks.md)

Workflows могат да бъдат задействани чрез [HTTP](../nodes/http-node.md) на `POST /api/workflows/{workflow_id}/execute` или стриймвани постепенно от `POST /api/workflows/{workflow_id}/execute/stream`. Тялото на заявката се подава като body към [Input](../nodes/input-node.md) nodes; headers и query params са налични в изразите на [Expression DSL](./expression-dsl.md). Конфигурирайте автентикация за всеки workflow: анонимна, JWT или персонализиран header. Опционалното кеширане на отговори, ограничаването на честотата и диалогът Run with cURL в редактора се намират на ниво workflow и се прилагат за двата режима. При [лимит за конкурентност](./webhooks.md#concurrency-limit-and-queued-runs) извикване, което трябва да изчака, получава `202 Accepted` с ID на изпълнението и URL за статус вместо това.

Вижте също [Input](../nodes/input-node.md), [Execution Tokens](./execution-tokens.md), [SSE Streaming](./sse-streaming.md), [HTTP](../nodes/http-node.md) и [Workflow Structure](./workflow-structure.md).

### [Execution Tokens](./execution-tokens.md)

Execution tokens са обхватно ограничени JWT, които предоставят достъп до execute и stream endpoints на един workflow. Когато даден workflow използва JWT автентикация, tokens позволяват на външни скриптове, CI pipelines и интеграции да извикват workflow без споделяне на потребителска сесия. Всеки token носи claim `wid`, който го обвързва с един workflow, `jti`, използван за незабавно отменяне, и конфигурируем TTL (от 60 секунди до 10 години). Създавайте, избирайте и отменяйте tokens директно от диалога **Run with cURL** — избраният token се вгражда автоматично в генерираната команда.

Вижте също [Webhooks](./webhooks.md), [Security](./security.md) и [SSE Streaming](./sse-streaming.md).

### [SSE Streaming](./sse-streaming.md)

Диалогът cURL може да превключи изпълнението на [webhook](./webhooks.md) в режим Server-Sent Events. Това генерира събития `execution_started`, `node_start`, `node_complete` и `execution_complete` в реално време, добавя `--no-buffer` към генерираната cURL команда и Ви позволява да конфигурирате съобщения за начало на всеки node, като например `[START] LLM` или персонализиран текст за външни терминални консуматори.

Вижте също [Webhooks](./webhooks.md), [Execution History](./execution-history.md) и [LLM](../nodes/llm-node.md).
### [Triggers](./triggers.md)

Workflows се стартират от trigger nodes ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), RabbitMQ получаване) или входни точки: [Webhook/API](./webhooks.md), [MCP](../tabs/mcp-tab.md), [Portal](./portal.md), Cron scheduler, Telegram webhook, Discord interaction webhook, IMAP trigger manager, RabbitMQ consumer или Editor run. Всеки trigger има свой собствен endpoint или фонов процес; [Cron](../nodes/cron-node.md) се изпълнява на всеки 60 секунди, [Telegram Trigger](../nodes/telegram-trigger-node.md) nodes получават bot webhooks, [Discord Trigger](../nodes/discord-trigger-node.md) nodes получават подписани interaction webhooks, а [IMAP Trigger](../nodes/imap-trigger-node.md) nodes работят на конфигурирания интервал за polling. [Input](../nodes/input-node.md) nodes получават body, headers и query от webhook заявки.

Вижте също [Node Types](./node-types.md), [Webhooks](./webhooks.md) и [Parallel Execution](./parallel-execution.md).

### [Execution History](./execution-history.md)

Execution history записва изпълненията на workflow: входни данни, изходни данни, резултати от nodes, статус и източник на trigger. Достъпете го от лентата с инструменти на Editor, изгледа Docs, хедъра на Dashboard или изгледа [Evals](../tabs/evals-tab.md). Историята за конкретен workflow показва изпълненията за отворения workflow; изгледът с цялата история показва изпълненията across workflows и chat. Текущо изпълняващите се изпълнения се появяват в горната част на двата диалога с действия **Open live** и **Cancel**. Open live прикачва редактора към съществуващото изпълнение чрез [SSE](./sse-streaming.md), възстановява завършените nodes, пулсира текущите и чакащите nodes и добавя Debug logs, без да стартира ново изпълнение. Bring to Canvas зарежда входните данни и изходните данни от nodes на завършено изпълнение за повторно изпълнение или debugging; дълбоката връзка `/workflows/{workflowId}/{executionId}` поддържа както текущи, така и завършени изпълнения. Изпълненията, поставени на пауза от [Human-in-the-Loop](./human-in-the-loop.md), се съхраняват незабавно като `pending`, включително публичния URL за преглед и всички notification nodes, изпълнени от `review` клона на агента. Ако сървърът се рестартира по време на изпълнение, прекъснатите изпълнения се възстановяват автоматично: те се изпълняват отначало със същите входни данни и се показват като завършени (отбелязани с **Recovered**), контролирано от превключвател **Auto-recover runs** за конкретния workflow, който вместо това може да ги запише като `skipped`.

Вижте също [SSE Streaming](./sse-streaming.md), [Human-in-the-Loop](./human-in-the-loop.md) и [Traces](../tabs/traces-tab.md).

### Execution Highlights

След текущо изпълнение — или след **Bring to Canvas** — в горния десен ъгъл на Canvas се появява затварящ се popup **Execution Highlights**, който изброява какво е произвел всеки node в реда на изпълнение. Това е бърз начин да инспектирате изходните данни на всеки node, без да отваряте всеки node поотделно; затворете го с **✕** и той се отваря отново при следващото изпълнение. Highlights се показват също и при изпълненията в dashboard. Вижте [Execution History](./execution-history.md) за подробности.

### [Edit History](./edit-history.md)

Edit History проследява запазените версии на даден workflow (всяко Save създава версия). Прегледайте списъка, отворете версия, за да видите diff спрямо текущия workflow ([nodes](./workflow-structure.md), edges, config), и използвайте Revert, за да възстановите предишна версия. За разлика от [Execution History](./execution-history.md), Edit History проследява промените в структурата, а не изпълненията.

Вижте също [Execution History](./execution-history.md), [Workflow Structure](./workflow-structure.md) и [Canvas Features](./canvas-features.md).

### Error Workflow

Даден workflow може да определи друг workflow, който да се изпълни при неуспех. Конфигурирайте го в панела **Properties** на ниво workflow (показан, когато не е избран node) под **On error, run workflow**. Само собственикът на workflow може да го задава, променя или изчиства; вижте [Owner-only settings](./workflow-organization.md#owner-only-settings). Когато изпълнение на най-горно ниво завърши с необработен неуспех, избраният error workflow се изпълнява и получава контекста на неуспеха (id и име на неуспешния workflow, id на изпълнението, съобщение за грешка, етикет и тип на неуспешния node и timestamp). Ако Canvas вече съдържа node [Error Handler](../nodes/error-handler-node.md), локалният handler има предимство и error workflow **не** се извиква. Самият error workflow се изпълнява директно, така че никога не задейства собствения си error workflow.

Той обхваща всяко изпълнение на най-горно ниво, което не е тестово: и двата execute endpoint-а, [Portal](./portal.md) и всеки trigger, включително [cron](../nodes/cron-node.md), chat платформените triggers, email, queues, [MCP](../tabs/mcp-tab.md) и dashboard widgets. С включено [Load Distribution](./cluster.md) това остава непроменено, включително изпълненията, изпълнени от worker: неуспешният node се връща обратно с резултата и error workflow се разпределя като всяко друго изпълнение, така че node вътре в него, който трябва да се изпълни на главния instance, все още го прави. Два случая са умишлено изключени, тъй като резултатът от самия workflow все още не е известен: изпълнение, което никой instance никога не е изпълнил, и изчакване, което е изтекло, докато изпълнението може все още да продължава. Той също **не** се задейства от ръчни тестови изпълнения в Canvas.
### Време за изчакване на Workflow

Всеки workflow може да зададе **време за изчакване на workflow** в секунди в панела **Properties** на ниво workflow. Стойност `0` (по подразбиране) го деактивира. Когато е зададено, изпълнение, което надвиши ограничението, се спира на следващата граница на node и се записва като неуспешно изпълнение с грешка "timed out". Времето за изчакване се прилага за ръчни, API и задействани изпълнения. Продължителните [Wait](../nodes/wait-node.md) nodes се прекъсват своевременно, вместо да блокират за цялата си продължителност.

### Лимит за конкурентност

Всеки workflow може да ограничи броя на едновременно изпълняваните производствени задачи чрез **Лимит за конкурентност** в панела **Properties** на ниво workflow; собственикът и сътрудниците с достъп за редактиране могат да го променят, като по подразбиране е изключен. При достигане на лимита новите задачи от [webhook](./webhooks.md#concurrency-limit-and-queued-runs) и [streaming](./sse-streaming.md) endpoint-ите, [Portal](./portal.md), [Quick Drawer](./quick-drawer.md), [MCP](../tabs/mcp-tab.md) и всеки [trigger](./triggers.md) чакат в опашка FIFO (първи влязъл, първи излязъл), отчитана за всички инстанции на даден [cluster](./cluster.md). Тестовите пускания в редактора, извикванията на sub-workflow, [Evals](../tabs/evals-tab.md) и възобновяванията след преглед никога не се нареждат на опашка, а изпълненията на карти в [Board](../tabs/board-tab.md), качванията на файлове, пусканията, стартирани от инструмента run-workflow на AI асистента, и задачите за известяване при аларми стартират без чакане за свободен слот. Webhook извикване, което трябва да чака, получава веднага `202 Accepted` с `execution_id`, URL за статус, отговарящ със същите идентификационни данни, своята позиция, размера на опашката и броя на активните задачи; MCP клиент получава същото и проверява инструмента `heym_execution_status`. Опционалният **Макс. размер на опашката** отхвърля допълнителните извиквания с `429`, а опционалното **Макс. време за изчакване** записва задача, чакала твърде дълго, като `expired`. Чакащите задачи се показват в [История на изпълненията](./execution-history.md) като **На опашка n/m** и могат да бъдат отменени там.

### Спестено време

Всеки workflow може да записва **приблизително спестено време на изпълнение** (в минути), зададено в панела **Properties** на ниво workflow. Разделът [Analytics](../tabs/analytics-tab.md) агрегира това за избрания период като обща статистика **Time Saved** (сума от приблизителната оценка на всеки workflow × неговите успешни изпълнения). Most Used също изброява тази сума за всеки workflow; **Not Set** отваря полето за приблизителна оценка, когато не е зададена. Докладът [Workflow Analysis](./workflow-analysis.md) препоръчва задаване на приблизителна оценка, когато такава не е конфигурирана.

### [Settings](./user-settings.md)

Диалоговият прозорец Settings (отварян от аватара Ви в хедъра) има четири раздела: Profile (Gravatar снимка, показвано име, User Rules), [Security](./security.md) (смяна на парола), Voice ([ElevenLabs TTS/STT](./chat-voice.md)) и Observability (статус на [OpenTelemetry](./opentelemetry.md) само за четене). User Rules са потребителски инструкции, инжектирани във всяка AI заявка, включително в workflow builder и [Chat](../tabs/chat-tab.md), така че можете да зададете език, тон, стил на код или workflow конвенции еднократно. Политиката за пароли и управлението на [MCP](../tabs/mcp-tab.md) API ключове също са налични.

Вижте също [Security](./security.md), [Chat Voice](./chat-voice.md), [OpenTelemetry Tracing](./opentelemetry.md) и [AI Assistant](./ai-assistant.md).

### [OpenTelemetry Tracing](./opentelemetry.md)

Heym може да излъчва OpenTelemetry traces за всяко изпълнение на workflow и изпълнение на node: основен `heym.workflow.execute` span на изпълнение и дъщерен `heym.node.execute` span на node, с прикачени данни за модел и използване на token към LLM и agent nodes. Spans се експортират чрез OTLP/HTTP към всяка съвместима backend система (Jaeger, Grafana Tempo, Honeycomb, Datadog), а W3C trace context се разпространява през входящи webhooks, изходящи HTTP заявки и под-workflows. Проследяването е деактивирано по подразбиране и се конфигурира с `HEYM_OTEL_*` [променливи на средата](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md); активният статус се показва в раздела Observability на [Settings](./user-settings.md).

Вижте също [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md) и [Webhooks](./webhooks.md).

### [Download & Import](./download-import.md)

Експортирайте текущия workflow като JSON от лентата с инструменти на Editor (бутон Download); файлът включва nodes и edges. Импортирайте чрез плъзгане на JSON файл върху раздела [Workflows](../tabs/workflows-tab.md) (създава нов workflow) или върху canvas (заменя или обединява). JSON трябва да включва масив nodes; name и edges са незадължителни. Използвайте го за архивиране, споделяне или мигриране между инстанции.

Вижте също [Workflow Structure](./workflow-structure.md), [Workflows](../tabs/workflows-tab.md) и [Canvas Features](./canvas-features.md).

### [Portal](./portal.md)

Portal предоставя workflows като публични chat интерфейси на `/chat/{slug}`. Конфигурирайте portal_enabled, slug, незадължителна автентикация (portal потребители), streaming и качване на файлове за всеки workflow. Крайните потребители взаимодействат чрез chat интерфейс, без да влизат в Heym; изходните изображения могат да се показват в чата. Portal workflows могат също да преминават към страници за преглед [Human-in-the-Loop](./human-in-the-loop.md), когато [Agent Node](../nodes/agent-node.md) изисква одобрение, докато клонът `review` на agent изпраща известия към други канали. Използвайте го за вътрешни инструменти, чатботове за клиенти и AI-базирани формуляри.

Вижте също [Human-in-the-Loop](./human-in-the-loop.md), [Agent Node](../nodes/agent-node.md) и [Drive](./drive.md).

### [File Generation](./file-generation.md)

Skills могат да генерират файлове като PDF, DOCX, CSV, JSON и изображения по време на изпълнение, като пишат в работното пространство `_OUTPUT_DIR`. Heym улавя тези файлове автоматично, съхранява ги и предоставя метаданни за изтегляне под `_generated_files`, които след това могат да се управляват с [Drive node](../nodes/drive-node.md) или да се преглеждат в раздела [Drive](../tabs/drive-tab.md).

Вижте също [Agent Node](../nodes/agent-node.md), [Drive](./drive.md) и [Drive node](../nodes/drive-node.md).

### [Drive](./drive.md)

Drive е споделеният слой за съхранение и споделяне на файлове, генерирани от skills. Той Ви позволява да разглеждате файлове, да създавате публични или защитени с парола връзки, да прилагате срок на валидност и ограничения за изтегляне, да споделяте файлове само за четене с Вашите екипи и да управлявате тези файлове програмно с [Drive node](../nodes/drive-node.md) или ръчно от раздела [Drive](../tabs/drive-tab.md).

Вижте също [Drive](../tabs/drive-tab.md), [File Generation](./file-generation.md) и [Portal](./portal.md).
### [Сигурност](./security.md)

Heym налага политика за пароли (дължина, главни букви, малки букви, цифра), съхранява access tokens в HttpOnly cookies и ротира refresh tokens при използване. Ограничаването на честотата (rate limiting) се прилага за вход, регистрация и вход в [Portal](./portal.md). [Удостоверенията](./credentials.md) са криптирани при съхранение с AES-256 (Fernet). MCP API key се използва за автентикация на клиенти; безопасността на съдържанието е налична чрез [Guardrails](./guardrails.md) на [LLM](../nodes/llm-node.md) и [Agent Node](../nodes/agent-node.md) възли. [Execution Tokens](./execution-tokens.md) предоставят обхванати за конкретен workflow JWTs за външни извикващи системи.

Вижте също [Execution Tokens](./execution-tokens.md), [Guardrails](./guardrails.md), [Portal](./portal.md) и [Удостоверения](./credentials.md).

### [Единен вход (Single Sign-On)](./sso.md)

Heym автентикира потребителите чрез всеки външен OpenID Connect доставчик - Keycloak, Okta, Entra ID, Auth0, Google - конфигуриран по време на изпълнение от **Settings → SSO** от администратор на инстанцията, посочен в `HEYM_ADMIN_EMAILS`. Въвеждат се само issuer URL и клиентски удостоверения; всеки endpoint идва от discovery документа на доставчика, така че никой доставчик не е твърдо зададен. Входът използва Authorization Code с PKCE, а ID token се проверява спрямо публикуваните ключове на доставчика. Акаунтите се свързват първо по `(issuer, subject)` и второ по потвърден имейл, с опционално автоматично създаване, ограничено до allowlist от имейл домейни. Входът с парола остава наличен заедно със SSO и може да бъде изключен, след като тестът на връзката премине успешно, като акаунтите в `HEYM_ADMIN_EMAILS` са освободени, за да не може неправилно конфигуриран доставчик да заключи инстанцията.

Вижте също [Settings](./user-settings.md), [Сигурност](./security.md) и [Одитно регистриране](./audit.md).

### [Разпределение на натоварването](./cluster.md)

Насочете втора Heym инстанция към същата база данни и тя се присъединява като worker. Фоновите изпълнения - cron, webhooks, MCP tool calls, chat triggers - се разпределят между инстанциите по процент, който администратор на инстанцията задава под **Settings → Instances**, като статусът, латентността на базата данни и версията на всяка инстанция са в една таблица. Инстанциите никога не комуникират помежду си: Postgres поема работата, така че worker не се нуждае от отворен порт и от маршрут обратно към основната инстанция. Работата, която засяга локални файлове, работно пространство на coding-agent или инсталиран plugin, винаги се изпълнява на основната инстанция, а панелът отчита каква част от последните 24 часа е била това, за да може операторът да види кога процентите не могат да помогнат. Всяко изпълнение в историята посочва инстанцията, която го е изпълнила, и двата диалога за история могат да филтрират по нея.

Вижте също [Settings](./user-settings.md), [Изпълнения](../tabs/traces-tab.md) и [Анализи](../tabs/analytics-tab.md).

### [Интеграции с трети страни](./integrations.md)

Heym се свързва с външни услуги чрез удостоверения, съхранявани в раздела [Удостоверения](../tabs/credentials-tab.md) (криптирани при съхранение). Поддържаните типове включват OpenAI, Google, Decision Model за [Decision node](../nodes/decision-node.md), Model Router за автоматичен избор на модел (вижте по-долу), GitHub за [GitHub node](../nodes/github-node.md) и MCP интеграции, Jira за [Jira node](../nodes/jira-node.md), Notion за [Notion node](../nodes/notion-node.md), Custom LLM, Cohere, RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, [Grist](../nodes/grist-node.md), SMTP за [Send Email](../nodes/send-email-node.md), [RabbitMQ](../nodes/rabbitmq-node.md), [Redis](../nodes/redis-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), Bearer, Header и FlareSolverr за [Crawler](../nodes/crawler-node.md). Всеки тип документира задължителните полета; удостоверенията могат да бъдат споделяни с потребители или [екипи](./teams.md) и да бъдат реферирани по име във възли или като `$credentials.Name` в изрази.

### Model Router (Auto Model)

Удостоверението **Model Router** избира модела за всяка заявка, вместо да съхранява ключ. То
съхранява удостоверение за decision model плюс списък с Вашите съществуващи OpenAI/Google/Custom
удостоверения, всяко с критерии кога трябва да бъде използвано, и се появява във всеки избор на модел
с един единствен модел, наречен **Auto**.

Изпълненията, Execution Log на canvas и Span View показват и двете половини на избора, например
`Auto Model / GPT-5`, докато разходът остава приписан на модела, който е работил. Auto
Model не може да се комбинира с Responses API, Batch mode или image output. Вижте
[Удостоверения](./credentials.md) за пълното поведение.

Вижте също [Удостоверения](./credentials.md), [Споделяне на удостоверения](./credentials-sharing.md) и [Екипи](./teams.md).

### [Guardrails](./guardrails.md)

Guardrails блокират небезопасни или нежелани потребителски съобщения, преди да достигнат до [LLM](../nodes/llm-node.md) или [Agent Node](../nodes/agent-node.md). Активират се за всеки възел поотделно и се избират категории за блокиране (напр. насилие, реч на омразата, сексуално съдържание, самонараняване, тормоз, незаконна дейност). Задава се чувствителност (ниска, средна, висока). При задействане възелът хвърля грешка, която може да бъде прихваната с [Error Handler](../nodes/error-handler-node.md). Откриването използва moderation API на доставчика или LLM класификация в зависимост от типа удостоверение.

Вижте също [Сигурност](./security.md), [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) и [Error Handler](../nodes/error-handler-node.md).
### [Enterprise](./enterprise.md)

Enterprise обхваща търговското лицензиране, професионалната поддръжка и услугите за внедряване за екипи, които използват Heym в продуктивна среда. Той включва съдействие при архитектурата на workflow, onboarding, насоки за Kubernetes и мащабиране, приоритетна поддръжка и разработка по поръчка на базата на разширени функции като [Agent Node](../nodes/agent-node.md), [Human-in-the-Loop](./human-in-the-loop.md), [Parallel Execution](./parallel-execution.md) и [Portal](./portal.md).

Вижте също [Running & Deployment](../getting-started/running-and-deployment.md), [Security](./security.md) и [Teams](./teams.md).

### [Heym Work](./heym-work.md)

Heym Work е втори интерфейс за бизнес екипи, изграден върху Heym. Хората описват задача, отговарят на няколко въпроса и получават тестван workflow, след което работят от страници, одобрения и списък с активности, където всяко изпълнение има име. Администраторите на инстанцията го свързват в **Настройки → Heym Work** с неговия адрес и ключ за интеграция; той има собствен лиценз от екипа на Heym.

Вижте също [Enterprise](./enterprise.md), [Single Sign-On](./sso.md) и [Human-in-the-Loop](./human-in-the-loop.md).

---

## Раздели на таблото

### [Workflows](../tabs/workflows-tab.md)

Разделът Workflows е изгледът по подразбиране на таблото. Той показва списък в два панела: workflows и папки като компактни редове отляво и визуализация на избрания workflow отдясно с неговия trigger, последно изпълнение и стъпки, както и Open Workflow и Run Now. Всеки ред има статусен индикатор (Running, Scheduled, Listening, Paused, API, SubWorker, Portal, Manual, Remove Scheduled), по който падащото меню Status може да филтрира. Workflow без trigger node се обозначава според това как е започнало последното му изпълнение – API за HTTP заявка, SubWorker за родителски workflow, Portal за публичния му chat – и остава Manual, докато не бъде изпълнен. Папките и подпапките служат за [организация](./workflow-organization.md). Създавайте workflows с New Workflow, плъзгайте и пускайте JSON за [импортиране](./download-import.md) и редактирайте или изтривайте чрез действията на реда. Workflows могат да се преместват между папки; изтриването се планира (кошче) преди окончателното премахване.

Вижте също [Workflow Organization](./workflow-organization.md), [Download & Import](./download-import.md) и [Quick Drawer](./quick-drawer.md).

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Watch Workflows demo</a></p>

### [Board](../tabs/board-tab.md)

Агентно kanban табло, където картите са постоянни задачи. Конфигурирайте всяка колона с подредена верига от workflows; преместването на карта в колоната изпълнява веригата с пълния контекст на картата (съдържание, коментари, история, предишни резултати). Резултатите се записват обратно в картата – зелено при успех, червено при неуспех, кехлибарено по време на изпълнение. Последващите кръгове изпълняват отново веригата на текущата колона с всичко натрупано дотук, което захранва итеративното планиране. Изпълненията се записват в [Execution History](./execution-history.md) с източник на trigger `board`. Докато изпълнението на карта е активно, **Open live** отваря точно това изпълнение върху анимирания canvas с инкрементални Debug логове.

Вижте също [Workflows](../tabs/workflows-tab.md), [Execution History](./execution-history.md) и [Human-in-the-Loop](./human-in-the-loop.md).

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

### [Templates](../tabs/templates-tab.md)

Разделът Templates Ви позволява да запазвате и използвате повторно workflow шаблони (цели workflows) и node шаблони (единични конфигурирани nodes). Създавайте workflow шаблони от редактора (Share as Template) и node шаблони чрез щракване с десен бутон върху node. Разглеждайте по видимост (Everyone или Specific users/[teams](./teams.md)), прилагайте шаблон, за да създадете нов workflow или да добавите node към canvas, и управлявайте споделените си шаблони.

Вижте също [Workflows](../tabs/workflows-tab.md), [Teams](./teams.md) и [Canvas Features](./canvas-features.md).

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Watch Templates demo</a></p>

### [Variables](../tabs/global-variables-tab.md)

Разделът Variables управлява [Global Variable Store](./global-variables.md). Създавайте, редактирайте и изтривайте глобални променливи; задавайте име, стойност и тип на стойността (Auto, String, Number, Boolean, Array, Object). Променливите са обвързани с потребителя и се запазват между изпълненията. Позовавайте се на тях във всеки workflow [expression](./expression-dsl.md) като `$global.variableName`. Променливите могат да се споделят с други потребители или [teams](./teams.md).

Вижте също [Global Variables](./global-variables.md), [Variable](../nodes/variable-node.md) и [Expression DSL](./expression-dsl.md).

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Watch Variables demo</a></p>
### [Chat](../tabs/chat-tab.md)

Разделът Chat е дълготрайната агентна повърхност на Heym за управление на работното пространство чрез разговор. Изберете [удостоверение](./credentials.md) и модел, след което помолете Chat да отговаря на въпроси, да преглежда дефиниции на workflow, да изпълнява съществуващи workflow, да обобщава изпълнения и графици, да докладва историята на изпълненията на отделен workflow (брой изпълнения, разбивка по статус, последно изпълнение и подробности за едно изпълнение при поискване), да докладва кои изпълнения се изпълняват в момента (с изминало време, текущ node и връзка към всяко активно изпълнение), да разрешава чакащи човешки прегледи, да създава и преработва workflow със същия AI Builder двигател, използван в редактора, или да добавя карти към kanban дъски с естествен език. Новите карти винаги започват в първата колона на избраната дъска; когато са налични няколко дъски и никоя не е посочена, Chat представя избор на дъска преди създаването на картата.

Chat продължава да работи на backend-а след затваряне на браузъра. Докато отговорът се предава на поток, можете да изпращате още съобщения; Heym ги съхранява в опашка, поддържана от база данни, позволява Ви да редактирате или изтривате съобщения в опашката преди да започнат, и ги изпълнява по ред, когато текущият отговор приключи. Ако асистентът се нуждае от подробности за планирането и върне уточняващи въпроси, опашката се поставя на пауза, докато отговорите на тези въпроси, след което се възобновява след отговора за планиране.

Отговорите се предават на поток с markdown, вградени изображения, карти за визуализация на workflow, свиваеми карти за извикване на инструменти, използване на контекст и автоматична компресия на контекста. Chat поддържа прикачени файлове, гласово въвеждане, възпроизвеждане на глас, действия за копиране, бързи prompt-ове, User Rules от [Settings](./user-settings.md) и [глобални променливи](./global-variables.md) като контекст.

Вижте също [AI Assistant](./ai-assistant.md), [Credentials](./credentials.md) и [Settings](./user-settings.md).

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Watch Chat demo</a></p>

### [Credentials](../tabs/credentials-tab.md)

Разделът Credentials управлява API ключове и тайни, използвани от nodes. Добавяйте удостоверения по тип (OpenAI, Google, Custom, Bearer, Header, [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), SMTP, [Redis](../nodes/redis-node.md), RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, Cohere и др.), именувайте ги и ги реферирайте в workflow nodes. Редактирайте или изтривайте от картата; споделяйте с потребители по имейл или с [екипи](./teams.md). Всички стойности са криптирани при съхранение и маскирани в потребителския интерфейс.

Вижте също [Credentials](./credentials.md), [Credentials Sharing](./credentials-sharing.md) и [Third-Party Integrations](./integrations.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Watch Credentials demo</a></p>

### [Vectorstores](../tabs/vectorstores-tab.md)

Разделът Vectorstores управлява векторните хранилища, използвани от [RAG](../nodes/rag-node.md) nodes. Създайте хранилище с име и [удостоверение](./credentials.md) за векторно хранилище — *RAG: Qdrant + OpenAI* (външен Qdrant) или *RAG: Psql + OpenAI* (собственият Postgres на Heym чрез pgvector), което фиксира backend-а на хранилището — по избор задайте име на колекция, след което качете документи (PDF, TXT и др.). Управлявайте съдържанието (преглед, изтриване на източници), редактирайте подробностите на хранилището и споделяйте хранилища с потребители. В [RAG](../nodes/rag-node.md) node изберете Database, изберете векторното хранилище и изпълнете операции insert, upsert, delete или search.

Вижте също [Qdrant RAG](../nodes/rag-node.md), [Credentials](./credentials.md) и [Teams](./teams.md).

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Watch Vectorstores demo</a></p>
### [MCP](../tabs/mcp-tab.md)

Разделът MCP конфигурира интеграцията с Model Context Protocol. Heym поддържа два режима:

**Сървър по подразбиране** – Един endpoint на `/api/mcp/sse`, който предоставя достъп до всички workflow-и с активиран MCP. Прегледайте и регенерирайте своя API key, копирайте готов за употреба клиентски JSON, свържете Cursor с едно кликване или следвайте процедурата за настройка на Claude с автоматична OAuth регистрация.

**Именувани сървъри** – Създайте няколко изолирани MCP endpoint-а, всеки със собствен URL базиран на UUID (`/api/mcp/servers/{uuid}/sse`) и независим API key. Задайте конкретни workflow-и към всеки сървър, така че различни AI клиенти или екипи да виждат само инструментите, от които се нуждаят. Всеки именуван сървър поддържа същите методи за автентикация (API key, Claude OAuth) и разполага със свои собствени преки пътища Copy JSON и Add to Cursor. И двата типа endpoint-и поддържат SSE транспорт (GET) и Streamable HTTP транспорт (POST). Превключването на workflow в именуван сървър го премества в началото на зададения списък, така че промененият ред да остане в полезрението.

**Инструмент за Chat в Heym** – И двата режима могат също да предоставят двигателя на [Chat](../tabs/chat-tab.md) като единен инструмент `heym_chat`, превключван за всяка повърхност със собствен LLM credential и модел (предварително попълнени от предпочитания от Вас модел в [Settings](./user-settings.md)). MCP клиентът изпраща едно съобщение `message` на естествен език и двигателят прави останалото: създаване на workflow-и в режим на изграждане (запазване, тестово изпълнение до пет пъти, поправка и проверка), изпълнение на workflow-и, анализи, изпълнения, статус на изпълнение в реално време, графици, boards и карти, екипи, глобални променливи, търсене в документацията и решения с човешка намеса. Възможностите, добавени към Chat по-късно, са достъпни чрез същия инструмент без допълнителна регистрация. Всяко извикване се съхранява в историята на раздела Chat като разговор, отбелязан с plug, и връща `conversation_id`, който клиентът може да изпрати обратно, за да продължи нишката.

Вижте също [Agent Architecture](./agent-architecture.md), [Agent Node](../nodes/agent-node.md) и [SSE Streaming](./sse-streaming.md).

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Watch MCP demo</a></p>

### [Traces](../tabs/traces-tab.md)

Разделът Traces показва трасета от изпълнения на [LLM](../nodes/llm-node.md). Заглавна лента със статистики над списъка обобщава избрания времеви диапазон с KPI карти (Calls, Tokens, Cost, Avg Latency, Error %) и три графики — Tokens by Model, Cost by Model и Calls Over Time (стекнати успешни спрямо неуспешни). Един селектор **Time range** (1h / 24h / 7d / 30d / All; по подразбиране 7 дни) филтрира едновременно графиките и списъка. Cost се изчислява от [LLM Cost Table](../tabs/datatable-tab.md#llm-cost-table-system-table) за всеки потребител; моделите без зададена цена се показват като вградено предупреждение с връзка към нея. Отворете което и да е трасе, за да видите payload-ите на заявката и отговора, разбивката по време (llm_ms, tools_ms, mcp_list_ms), извикванията на инструменти (име, аргументи, резултат) и включените skills. Разгънатите събития показват JSON — включително MCP и JSON-RPC payload-и — като разгъващо се дърво с отворено по подразбиране първо ниво; **Tree / Raw** превключва обратно към оригиналния текст, а невалидният JSON остава четим. Използвайте трасетата, за да отстранявате проблеми в поведението на [Agent Node](../nodes/agent-node.md) и [LLM](../nodes/llm-node.md), както и за копиране или експортиране на payload-и.

Вижте също [Execution History](./execution-history.md), [Agent Node](../nodes/agent-node.md) и [LLM](../nodes/llm-node.md).

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Watch Traces demo</a></p>
### [Известия](../tabs/alerts-tab.md)

Разделът Известия дефинира прагови условия за определен времеви прозорец и Ви уведомява, когато те бъдат преминати. Четири типа известия покриват въпросите, които операторите реално задават: **праг на грешки** (дали това е неуспешно повече от N пъти в прозореца), **продължителност на workflow** (дали изпълненията са се забавили, измерено като максимум, средно или p95), **разход на token / USD** (дали разходът е преминал бюджет, изчислен чрез същата таблица с цени като при [Изпълнения](../tabs/traces-tab.md)), и **брой изпълнения** (дали това се изпълнява много по-често, отколкото трябва). Всеки тип се оценява за избран от Вас прозорец, никога за отделно събитие, защото едно неуспешно изпълнение е шум, а серия от тях е инцидент. Известията наблюдават един workflow или всички workflow-и, до които имате достъп.

Петстъпков съветник преминава през тип, обхват, условие, реакция и преглед. Стъпката за преглед първо **тества обратно във времето** условието, отчитайки колко често би се задействало през последните 24 часа до 7 дни, така че праг, който е твърде нисък, се хваща преди да бъде запазен, а не след като уведоми някого. Опишете какво искате на прост език и AI попълва всяка стъпка, която може, като маркира предположенията си; частична заявка все пак придвижва съветника напред, отваряйки на първата стъпка, която все още изисква решение, вместо да Ви кара да започвате отначало. По подразбиране известието се задейства веднъж и остава тихо, докато метриката се възстанови; вместо това може да го настроите да се повтаря на интервал.

На стъпката за реакция известието може да създаде и възложи нов workflow, който да се изпълни при задействане, да използва вече съществуващ такъв, или да не прави нищо. Payload-ът при задействане носи наблюдаваната стойност, прага, прозореца и workflow-ите, допринесли за числото, което е начинът, по който известията достигат до Slack, имейл или Telegram чрез node-ове, които вече имате. Историята на задействанията записва какво е било вярно в момента на всяко задействане и се пази 90 дни; потвърждаването на задействане променя баджа от Firing на Acknowledged, без да се преструва, че условието е отшумяло. Разделът [Chat](../tabs/chat-tab.md) може да отговори какви известия съществуват и защо или кога се е задействало дадено. Известията могат да се споделят с потребители и [екипи](../tabs/teams-tab.md).

Вижте също [Анализ](../tabs/analytics-tab.md), [Изпълнения](../tabs/traces-tab.md) и [История на изпълненията](./execution-history.md).

### [Анализ](../tabs/analytics-tab.md)

Разделът Анализ показва метрики и тенденции за изпълненията. Обобщените статистики включват общ брой изпълнения, процент на успех, процент на грешки, разбивка на латентността и общо **Спестено време** (сумата от приблизителните спестени минути на всяко изпълнение на workflow × неговите успешни изпълнения). Най-използвани изброява същата сума за всеки workflow. Изберете базова времева рамка (24ч, 7д, 30д или всички), по избор филтрирайте по workflow, след което плъзнете през която и да е графика, за да се задълбочите в избран диапазон от дати. Графиките и таблиците с workflow-и се обновяват според избора, а автоматичното обновяване поддържа метриките актуални. Той допълва [История на изпълненията](./execution-history.md) и изгледа [Графици](../tabs/scheduled-tab.md), когато имате нужда както от минали резултати, така и от предстоящи изпълнения.

Вижте също [История на изпълненията](./execution-history.md), [Графици](../tabs/scheduled-tab.md) и [Оценяване](../tabs/evals-tab.md).

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Гледайте демото на Анализ</a></p>

### [Табло](../tabs/dashboard-tab.md)

Разделът Табло е пространство в стил Grafana, където изграждате мрежи от widget-и с графики, всеки от които се рендира от свой собствен скрит Heym workflow. Поддържайте колкото табла са Ви нужни и споделяйте всяко от тях с потребители или екипи, само за четене или с право на редакция; widget-ите винаги се изпълняват с удостоверенията на собственика, така че всички виждат едни и същи данни. Опишете метрика на прост език и AI генерира widget-а, или добавете такъв ръчно и изберете тип графика, прегледан с примерни данни: bar, line, area, pie, table, numeric, gauge, scatter, proportion, bar gauge, text или HITL. HITL е карусел от Вашите чакащи човешки прегледи. Заглавната лента показва `1/n pending`. Името на workflow-а отваря това изпълнение на canvas-а. **Approve**, **Request changes** и **Reject** го решават, а иконата за история до заглавието на widget-а отваря това изпълнение в диалога за история на същата страница. Widget-ите кешират резултатите си, могат да се донастройват с AI (всяка промяна се запазва в [История на редакциите](./edit-history.md)), клонират заедно с целия си workflow, пренареждат с Tidy up и влачат или преоразмеряват в режим на редакция. Таблиците могат да показват чипове за статус и да свързват редовете си с детайлно табло, което чете записа на избрания ред като `$page.record`, а Run widget изпълнява workflow от таблото: върху пуснат файл, с неговите входни полета или с бутон Run. Тъй като всеки widget е workflow, всякакви данни, които можете да извлечете — [HTTP](../nodes/http-node.md) заявка, [BigQuery](../nodes/bigquery-node.md) заявка, [RAG](../nodes/rag-node.md) търсене или изход от [LLM](../nodes/llm-node.md) — могат да станат графика. Настройките на уиджет HITL могат да го стеснят до прегледите на един workflow или до стъпка на агент или Slack одобрение в него; такъв уиджет ги показва на всички, които могат да отворят този workflow, и е скрит за всеки, който не може.

Вижте също [Chart Output node](../nodes/chart-output-node.md), [Анализ](../tabs/analytics-tab.md) и [История на изпълненията](./execution-history.md).

<video src="/features/showcase/dashboard.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/dashboard.webm">▶ Гледайте демото на Табло</a></p>
### [Оценяване](../tabs/evals-tab.md)

Разделът Оценяване (намира се на `/evals`) Ви позволява да създавате пакети за оценяване, да добавяте или генерирате тестови случаи, да оптимизирате prompt-а на пакета и да изпълнявате оценявания върху workflow-и с [Agent Node](../nodes/agent-node.md). Изберете един или повече модели, изберете метод за оценяване (Exact Match, Contains или LLM-as-Judge), по желание позволете на отделен модел или на [Decision Model](../nodes/decision-node.md) да оценява отговорите по метода LLM-as-Judge, задайте брой изпълнения на тест (както и temperature и reasoning effort за Exact Match и Contains), след което сравнете успех/неуспех и изходите по модели. Прегледайте историята на изпълненията за минали оценявания, включително кой judge е използван при всяко изпълнение, стартирайте отново изпълнение със същия judge, експортирайте го като JSON и проверете основното поведение в [Traces](../tabs/traces-tab.md).

Вижте също [Agent Node](../nodes/agent-node.md), [Traces](../tabs/traces-tab.md) и [История на изпълненията](./execution-history.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Гледайте демото на Оценяване</a></p>

### [Екипи](../tabs/teams-tab.md)

Разделът Екипи Ви позволява да създавате и управлявате екипи. Създайте екип, добавете членове по имейл и премахнете членове (създателят не може да бъде премахнат). Споделяйте [workflows](../tabs/workflows-tab.md), [шаблони](../tabs/templates-tab.md), [удостоверения](../tabs/credentials-tab.md), [променливи](../tabs/global-variables-tab.md), [векторни хранилища](../tabs/vectorstores-tab.md) и [файлове от Drive](../tabs/drive-tab.md) с екипи чрез съответните диалози за споделяне; всички членове на екипа получават достъп. Редактирайте името и описанието на екипа или изтрийте екипа (премахва всички споделяния към екипа).

Вижте също [Екипи](./teams.md), [Споделяне на удостоверения](./credentials-sharing.md) и [Организация на workflow-и](./workflow-organization.md).

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Гледайте демото на Екипи</a></p>

### [Графици](../tabs/scheduled-tab.md)

Разделът Графици показва всички активни [Cron](../nodes/cron-node.md) workflow-и върху визуален календар. Превключвайте между изгледи за ден, седмица и месец, за да видите кога са планирани да се изпълняват автоматизациите Ви, след което се върнете към съответния [workflow](../tabs/workflows-tab.md), когато трябва да редактирате графика.

Вижте също [Cron](../nodes/cron-node.md), [Анализ](../tabs/analytics-tab.md) и [История на изпълненията](./execution-history.md).

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Гледайте демото на Графици</a></p>

### [Логове](../tabs/logs-tab.md)

Разделът Логове показва логовете на Docker контейнерите за Heym стека (backend, frontend, PostgreSQL). Изберете контейнер(и), филтрирайте по ниво на логване (All, INFO, WARNING, ERROR, DEBUG) и търсете в логовете. Използвайте го за debugging и отстраняване на проблеми. За логове на изпълнения на workflow-и (резултати от възли, изходи) използвайте вместо това [История на изпълненията](./execution-history.md), [Traces](../tabs/traces-tab.md) или панела Debug в редактора.

Вижте също [История на изпълненията](./execution-history.md), [Traces](../tabs/traces-tab.md) и [Функции на Canvas](./canvas-features.md).

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Гледайте демото на Логове</a></p>

### [Таблица с данни](../tabs/datatable-tab.md)

Разделът Таблица с данни Ви позволява да създавате и управлявате структурирани таблици с данни в Heym. Дефинирайте типизирани колони (string, number, boolean, date, JSON), управлявайте редове с редактиране чрез двойно щракване на място, импортирайте/експортирайте CSV и споделяйте таблици с потребители или [екипи](./teams.md) с права за четене/запис. Използвайте [DataTable node](../nodes/datatable-node.md), за да достъпвате таблици програмно в workflow-и. Закачена секция **System tables** в горната част съдържа **LLM Cost Table**: изглед с фиксирана схема на ценообразуването по модели, зареждан от Helicone на заден план (TTL от 24 часа, ръчно Refresh), където всеки потребител може да замества цени или да добавя персонализирани редове за модели, които Helicone не включва. Тези правила за ценообразуване захранват KPI за разходите и графиката за разходи по модели в раздела [Traces](../tabs/traces-tab.md).

Вижте също [DataTable node](../nodes/datatable-node.md), [Traces](../tabs/traces-tab.md), [Структура на workflow-и](./workflow-structure.md) и [Екипи](./teams.md).

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Гледайте демото на Таблица с данни</a></p>
### [Drive](../tabs/drive-tab.md)

Разделът Drive показва всички файлове, генерирани от skills в рамките на Вашите workflows. Той изброява всеки файл с име, тип, размер, изходен node, дата на създаване и състояние на споделяне с екипа, като предоставя контроли за търсене, автентикирано изтегляне, споделяне, изтриване и пагинация. Това е companion таблото към [File Generation](./file-generation.md), справочника [Drive](./drive.md) и [Drive node](../nodes/drive-node.md).

Вижте също [Drive](./drive.md), [File Generation](./file-generation.md) и [Drive node](../nodes/drive-node.md).

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Гледайте демото на Drive</a></p>

### [Сътрудничество на Canvas](./canvas-collaboration.md)

Everyone with a workflow open shares one live draft. Edits appear instantly, each person's pointer moves in their color, following mirrors everything they see and do, and you can talk over direct peer-to-peer audio.

See also [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md), and [Keyboard Shortcuts](./keyboard-shortcuts.md).
