# Discord Trigger

**Discord Trigger** node е входна точка с нула входа, която получава Discord Interactions API webhooks и стартира workflow автоматично. Използвайте го за slash команди, бутони, модали и други взаимодействия с Discord приложения, които трябва да преминат към downstream AI или интеграционни nodes.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 0 |
| Изходи | 1 |
| Изход | `$nodeLabel.interaction`, `$nodeLabel.type`, `$nodeLabel.data`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `credentialId` | UUID | `discord_trigger` удостоверение, съдържащо публичния ключ на Discord приложението |

## Ръководство за настройка

### 1. Създайте `discord_trigger` удостоверение

1. Отидете на **Settings → Credentials → New Credential**
2. Изберете тип **Discord Trigger (Public Key)**
3. Поставете **Application Public Key** от Discord Developer Portal:
   - **Your application → General Information → Public Key**
4. Запазете удостоверението

### 2. Добавете node към Вашия workflow

1. Плъзнете **Discord Trigger** върху canvas
2. Изберете node, за да отворите панела Properties
3. Изберете Вашето `discord_trigger` удостоверение
4. Копирайте **Interactions URL**, показан в панела на node

### 3. Регистрирайте Interactions Endpoint в Discord

1. Отворете [Discord Developer Portal](https://discord.com/developers/applications)
2. Изберете Вашето приложение
3. Отидете на **General Information** или **Interactions**
4. Поставете **Interactions Endpoint URL** на node в полето за endpoint
5. Discord изпраща `PING` заявка за валидиране на endpoint и Heym отговаря автоматично след проверка на подписа
6. Запазете промените

## Изходни полета

След като node се задейства, downstream nodes могат да достъпят:

| Израз | Описание |
|------------|-------------|
| `$nodeLabel.interaction` | Пълен payload на Discord interaction |
| `$nodeLabel.type` | Тип на interaction |
| `$nodeLabel.data` | Payload на команда, бутон или модал |
| `$nodeLabel.data.name` | Име на slash команда, когато е приложимо |
| `$nodeLabel.data.options` | Масив с опции на slash команда |
| `$nodeLabel.headers` | Санитизирани webhook headers |
| `$nodeLabel.triggered_by` | Етикет на източника на trigger (`"Discord"`) |
| `$nodeLabel.trigger_node_id` | ID на canvas node, който е получил Discord interaction |
| `$nodeLabel.triggered_at` | ISO timestamp за това изпълнение на workflow |

## Примерен workflow

**Discord slash команда → LLM → Output**

```
discordTrigger → llm → output
```

- **Discord Trigger** етикет: `discordEvent`
- **LLM** потребителско съобщение: `"Reply to this Discord command: $discordEvent.data.name"`
- **Output** съобщение: `$llm.text`

## Сигурност

- Заявките се проверяват с **Ed25519** с публичния ключ на Вашето приложение
- Timestamps по-стари от **5 минути** се отхвърлят, за да се намалят replay атаките
- Чувствителните headers (`x-signature-ed25519`, `authorization` и др.) се премахват, преди данните да достигнат до downstream nodes
- Trigger изисква валидно `discord_trigger` удостоверение; заявките се отхвърлят, ако удостоверението липсва или е невалидно

## Бележки

- Heym връща отложен Discord отговор незабавно, изпълнява workflow във фонов режим и публикува крайния изход на workflow като Discord follow-up, когато `Output` node произведе съдържание
- URL адресът за interactions се извлича от ID на node и остава стабилен дори ако workflow бъде преименуван
- Използвайте обикновен [Discord Node](./discord-node.md) само когато искате отделна webhook публикация в допълнение към interaction follow-up
- Един `discordTrigger` node обикновено е достатъчен; използвайте **Switch** или **Condition** downstream за маршрутизиране на различни типове interaction

## Свързани

- [Discord Node](./discord-node.md) – Изпращане на изходящи Discord съобщения
- [Triggers](../reference/triggers.md) – Преглед на всички входни точки на workflow
- [Third-Party Integrations](../reference/integrations.md) – Настройка на Discord удостоверение
- [Credentials Tab](../tabs/credentials-tab.md) – Добавяне и управление на `discord_trigger` удостоверения
