# Раздел Променливи

Разделът **Променливи** управлява **Global Variable Store** – постоянни данни тип ключ-стойност, споделени между всички Ваши workflows.

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Гледайте демонстрацията на Променливи</a></p>

## Преглед

- Създаване, редактиране и изтриване на глобални променливи
- Променливите са обвързани с потребителя и се запазват между изпълненията на workflows
- Референциране в изрази чрез `$global.variableName`

## Създаване на променлива

1. Натиснете **New Variable**
2. Въведете **име** (използва се в изрази)
3. Задайте **стойност** (низ, число, булева стойност, масив или обект)
4. Изберете **тип на стойността** (Auto, String, Number, Boolean, Array, Object)

## Редактиране и изтриване

- **Редактиране** – Натиснете иконата за редактиране на реда на променливата
- **Изтриване** – Натиснете иконата за кошче; workflows, които я използват, ще се нуждаят от замяна
- **Групово изтриване** – Изберете няколко променливи и използвайте **Delete selected**

## Използване във Workflows

Референцирайте променливи във всеки израз:

```
$global.environment
$global.settings.baseUrl
```

Може също да задавате глобални променливи от [Variable node](../nodes/variable-node.md), като активирате **Store in Global Variable Store**.

## Свързани

- [Global Variables](../reference/global-variables.md) – Справочно ръководство
- [Variable Node](../nodes/variable-node.md) – Задаване на променливи с `isGlobal`
- [Expression DSL](../reference/expression-dsl.md) – Синтаксис `$global`
- [Раздел Chat](./chat-tab.md) – Chat има достъп до глобални променливи
- [Contextual Showcase](../reference/contextual-showcase.md) – Компактно ръководство за страници на таблото
