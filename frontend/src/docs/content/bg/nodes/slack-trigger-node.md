# Slack Trigger

**Slack Trigger** node е входна точка с нулев вход, която получава Slack Events API webhooks и стартира workflow автоматично. Той обработва URL verification challenge на Slack и проверява подписите на заявките със signing secret.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 0 |
| Изходи | 1 |
| Изход | `$nodeLabel.event`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id` |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `credentialId` | UUID | `slack_trigger` удостоверение, съдържащо signing secret |

## Ръководство за настройка

### 1. Създайте `slack_trigger` удостоверение

1. Отворете **Settings → Credentials → New Credential**
2. Изберете тип **Slack Trigger (Signing Secret)**
3. Поставете **Signing Secret** от Вашето Slack приложение:
   - В Slack: **App settings → Basic Information → App Credentials → Signing Secret**
4. Запазете удостоверението

### 2. Добавете node към Вашия workflow

1. Отворете работната площ на workflow
2. Плъзнете **Slack Trigger** от панела с nodes върху работната площ
3. Кликнете върху node, за да отворите панела със свойства
4. Изберете Вашето `slack_trigger` удостоверение
5. Копирайте **Webhook URL**, показан в панела

### 3. Конфигурирайте Вашето Slack приложение

1. В настройките на Вашето Slack приложение отворете **Event Subscriptions**
2. Включете **Enable Events**
3. Поставете Webhook URL в полето **Request URL**
4. Slack изпраща URL verification challenge — Heym отговаря автоматично в рамките на милисекунди
5. Полето става зелено: ✓ Verified
6. Абонирайте се за **Bot Events**, които Ви трябват (напр. `message.channels`, `reaction_added`)
7. Запазете промените и преинсталирайте приложението в работното си пространство, ако бъдете подканени

## Изходни полета

След като node се задейства, следващите nodes могат да достъпват:

| Израз | Описание |
|------------|-------------|
| `$nodeLabel.event` | Пълен Slack event обект |
| `$nodeLabel.event.type` | Тип на събитието (напр. `"message"`, `"reaction_added"`) |
| `$nodeLabel.event.text` | Текст на съобщението (когато е приложимо) |
| `$nodeLabel.event.user` | Slack user ID на потребителя, задействал събитието |
| `$nodeLabel.event.channel` | Channel ID |
| `$nodeLabel.event.ts` | Времева марка на събитието |
| `$nodeLabel.headers` | Санитизирани HTTP headers от Slack |
| `$nodeLabel.triggered_by` | Етикет на източника на trigger (`"Slack"`) |
| `$nodeLabel.trigger_node_id` | ID на node в работната площ, получил Slack събитието |

## Примерен workflow

**Slack съобщение → LLM отговор → Slack изпращане:**

```
slackTrigger → llm → slack
```

- **slackTrigger** етикет: `slackEvent`
- **LLM** потребителско съобщение: `"Reply to this Slack message: $slackEvent.event.text"`
- **Slack** съобщение: `$llm.text`

## Сигурност

- Заявките се проверяват чрез **HMAC-SHA256** с Вашия signing secret
- Времеви марки по-стари от **5 минути** се отхвърлят (предотвратяване на replay атаки)
- Чувствителните headers (`x-slack-signature`, `authorization` и др.) се премахват, преди да достигнат до следващите nodes
- Ако не е зададено удостоверение, node работи без проверка — препоръчва се само за локално тестване

## Бележки

- Heym отговаря с `200 OK` незабавно и изпълнява workflow във фонов режим — това удовлетворява изискването на Slack за отговор в рамките на 3 секунди
- Webhook URL се извлича от ID на node и никога не се променя, дори след преименуване на workflow
- Необходим е само един `slackTrigger` node на workflow; използвайте **Switch** или **Condition** nodes надолу по веригата, за да маршрутизирате различни типове събития
