# Вкладка Teams

Вкладка **Teams** дає змогу створювати команди та керувати ними для спільного використання workflow, credentials, змінних, vector stores і файлів Drive з групами користувачів.

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Переглянути демонстрацію Teams</a></p>

## Створення команди

1. Натисніть **New Team**
2. Введіть назву та необов'язковий опис
3. Натисніть **Create**

Ви автоматично стаєте творцем команди та її першим учасником.

## Керування учасниками

- **Додати учасника** – Введіть email користувача в діалоговому вікні деталей команди та натисніть **Add**
- **Видалити учасника** – Натисніть X поруч з учасником (творця видалити неможливо)
- **Редагувати команду** – Творці можуть редагувати назву та опис
- **Видалити команду** – Творці можуть видалити команду; усі спільні ресурси команди буде видалено
- **Спільні ресурси** – Діалогове вікно деталей команди показує workflow, credentials, змінні, vector stores, файли Drive, шаблони workflow і шаблони вузлів, надані команді. Натисніть на workflow, щоб відкрити його в редакторі; перейдіть на відповідну вкладку для інших ресурсів.

## Спільний доступ для команд

Надавайте ресурси командам з:

- **Workflows** – Діалогове вікно надання доступу в редакторі workflow
- **Workflow Templates** – Діалогове вікно надання доступу під час створення/редагування шаблону workflow (видимість: Specific users)
- **Node Templates** – Діалогове вікно надання доступу під час створення/редагування шаблону вузла (видимість: Specific users)
- **Credentials** – Діалогове вікно надання доступу на вкладці Credentials
- **Variables** – Діалогове вікно надання доступу на вкладці Variables
- **Vector Stores** – Діалогове вікно надання доступу на вкладці Vectors
- **Dashboards** – Налаштування Dashboard на вкладці Dashboard (читання або запис)
- **Drive Files** – Діалогове вікно надання доступу на вкладці Drive або операції вузла Drive `shareWithMyTeams` / `unshareWithMyTeams`

Коли Ви надаєте доступ команді, усі учасники команди отримують доступ. Дивіться [Teams](../reference/teams.md) для деталей.

Коли Ви надаєте workflow команді, також надайте credentials і під-workflow, від яких залежить цей workflow, тій самій команді. Доступ до workflow сам по собі не надає доступу до credentials або дочірніх workflow.

## Інтеграція з Chat

AI-асистент на [вкладці Chat](./chat-tab.md) може перелічити Ваші команди. Запитайте "my teams", щоб побачити, до яких команд Ви належите.

## Пов'язане

- [Teams](../reference/teams.md) – Довідник Teams і модель спільного доступу
- [Credentials Sharing](../reference/credentials-sharing.md) – Надання credentials користувачам і командам
- [Workflow Organization](../reference/workflow-organization.md) – Папки та спільний доступ
- [Contextual Showcase](../reference/contextual-showcase.md) – Компактний посібник зі сторінки для поверхонь dashboard
