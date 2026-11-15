# Вкладка Chat

Вкладка **Chat** надає прямий інтерфейс чату з LLM. Використовуйте її, щоб тестувати моделі, ставити запитання, запускати наявні workflow або створювати новий workflow із запиту природною мовою.

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Переглянути демо Chat</a></p>

## Налаштування

1. Виберіть [credential](./credentials-tab.md) (API key для OpenAI, Google тощо)
2. Виберіть модель зі спадного списку (моделі завантажуються з вибраного credential)
3. Почніть вводити текст, щоб надсилати повідомлення

Ви також можете розпочати розмову з поля чату на [вкладці Workflows](./workflows-tab.md). Воно надсилає Ваше перше повідомлення та відкриває нову розмову тут із відповіддю, що вже транслюється.

## Можливості

- **Контекст глобальних змінних** – Ваші [Global Variables](../reference/global-variables.md) доступні LLM, тож Ви можете запитувати про збережені значення або посилатися на них
- **Контекст шаблонів робочого простору** – Спільні шаблони workflow і вузлів у Вашому робочому просторі включено як контекст, тож Chat може відповідати на запитання про доступні шаблони
- **Тривалий агент** – Chat продовжує працювати на бекенді, навіть якщо браузер закрито, тож Ви можете повернутися з іншого пристрою та продовжити ту саму розмову
- **Створення workflow** – Попросіть Chat створити або налаштувати workflow, і він використає той самий рушій Workflow AI Builder, що й асистент редактора, щоб згенерувати та зберегти workflow
- **Створення завдань Kanban** – Попросіть природною мовою додати завдання або створити картку. Chat додає її до першої колонки запитаної дошки; якщо у Вас кілька дошок і Ви не назвали жодну, Chat показує вибір дошки перед створенням картки
- **Черга подальших повідомлень** – Надсилайте більше повідомлень, поки відповідь транслюється. Повідомлення в черзі зберігаються, їх можна редагувати або видаляти до початку виконання, і вони виконуються по порядку після активної відповіді
- **Kanban boards** – Ask naturally to add, assign, move, update or comment on a task, list your overdue tasks or what waits for a review, or create and arrange boards and columns. When you have multiple boards and do not name one, Chat presents a board picker before creating a card. See [Board › From Chat and MCP](./board-tab.md#from-chat-and-mcp)
- **Send now** – Click **Send now** beside a queued message to stop the active reply and send that message immediately. The partial reply stays in the conversation, followed by your message and the new answer. The message keeps its files and chosen model; the other queued messages remain and resume in order afterward
- **Changing direction** – After **Send now**, your latest message controls the task. A cancelled question stays as context and is not another pending job. Interrupted requests appear as **cancelled** in Traces and run history, including ones stopped before the model answers
