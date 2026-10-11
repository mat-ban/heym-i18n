# Вкладка Variables

Вкладка **Variables** керує **Global Variable Store** – постійним сховищем даних типу ключ-значення, спільним для всіх Ваших workflow.

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Переглянути демонстрацію Variables</a></p>

## Огляд

- Створюйте, редагуйте та видаляйте глобальні змінні
- Змінні прив'язані до користувача та зберігаються між виконаннями workflow
- Посилайтеся на них у виразах через `$global.variableName`

## Створення змінної

1. Натисніть **New Variable**
2. Введіть **name** (використовується у виразах)
3. Задайте **value** (рядок, число, boolean, масив або об'єкт)
4. Виберіть **value type** (Auto, String, Number, Boolean, Array, Object)

## Редагування та видалення

- **Edit** – Натисніть значок редагування в рядку змінної
- **Delete** – Натисніть значок кошика; workflow, що її використовують, потребуватимуть заміни
- **Bulk delete** – Виберіть кілька змінних і натисніть **Delete selected**

## Використання у workflow

Посилайтеся на змінні в будь-якому виразі:

```
$global.environment
$global.settings.baseUrl
```

Ви також можете задавати глобальні змінні з [Variable node](../nodes/variable-node.md), увімкнувши **Store in Global Variable Store**.

## Пов'язане

- [Global Variables](../reference/global-variables.md) – Довідковий посібник
- [Variable Node](../nodes/variable-node.md) – Задання змінних із `isGlobal`
- [Expression DSL](../reference/expression-dsl.md) – Синтаксис `$global`
- [Chat Tab](./chat-tab.md) – Chat має доступ до глобальних змінних
- [Contextual Showcase](../reference/contextual-showcase.md) – Компактний посібник зі сторінок dashboard
