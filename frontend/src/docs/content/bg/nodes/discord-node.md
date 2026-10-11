# Discord

**Discord** node изпраща съобщение до Discord канал чрез Incoming Webhook. Използвайте го за известия, нотификации от workflow, отговори тип бот и докладване на грешки.

## Общ преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 1 |
| Изход | `$nodeLabel.status`, `$nodeLabel.response`, `$nodeLabel.message`, `$nodeLabel.username`, `$nodeLabel.avatar_url` |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `credentialId` | UUID | `discord` удостоверение, съдържащо URL на incoming webhook |
| `message` | expression | Текст на изходящото съобщение. Поддържа [expressions](../reference/expression-dsl.md). |
| `username` | expression | Незадължително заместване на показваното име за това съобщение |
| `avatarUrl` | expression | Незадължително заместване на URL на аватара за това съобщение |

## Настройка

1. Създайте [удостоверение за Discord Webhook](../reference/integrations.md#discord)
2. Добавете node **Discord** към Вашия workflow
3. Изберете удостоверението
4. Задайте `message` на изходящия текст или на шаблон, изграден от данни от предходни възли
5. По избор заменете показваното `username` и `avatarUrl`

## Пример

```json
{
  "type": "discord",
  "data": {
    "label": "notifyDiscord",
    "credentialId": "discord-credential-uuid",
    "message": "Workflow completed: $input.text",
    "username": "Heym Bot",
    "avatarUrl": "https://example.com/heym.png"
  }
}
```

## Изходни полета

| Expression | Описание |
|------------|-------------|
| `$nodeLabel.status` | HTTP код на състоянието, върнат от Discord, обикновено `204` при успех |
| `$nodeLabel.response` | Сурово тяло на отговора, върнато от Discord webhook |
| `$nodeLabel.message` | Текст на съобщението, което Heym е изпратил |
| `$nodeLabel.username` | Потребителско име, изпратено с webhook, ако е предоставено |
| `$nodeLabel.avatar_url` | URL на аватара, изпратен с webhook, ако е предоставен |

## Чести модели

- Използвайте го заедно с [Discord Trigger](./discord-trigger-node.md), когато искате допълнителна публикация в канал извън отговора на взаимодействието
- Изпращайте известия за грешки от [Error Handler](./error-handler-node.md)
- Публикувайте резюмета, генерирани от [LLM](./llm-node.md) или [Agent](./agent-node.md)

## Сигурност на изходящия трафик

- URL на webhook, съхранен в удостоверението, трябва да използва `http://` или `https://` и да се разрешава само до публични адреси. Loopback, частни, link-local, multicast и cloud-metadata дестинации са блокирани.
- Heym валидира разрешените адреси и фиксира целта на връзката преди изпращане, така че DNS отговор не може да премести заявката към вътрешен адрес след проверката. Прокситата от средата са деактивирани, докато защитата е активна, и пренасочванията не се следват.
- Среди, които публикуват към вътрешен webhook приемник, могат да зададат `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` на доверен self-hosted instance. Запазете настройката по подразбиране при hosted или multi-tenant среди.

**Бележка за надграждане до v0.0.109:** тази проверка е нова за Discord. Удостоверение, чийто URL на webhook сочи към loopback или частен адрес, се отхвърля, освен ако настройката по-горе не е активирана.

## Свързани

- [Discord Trigger](./discord-trigger-node.md) – Стартиране на workflow от входящи Discord взаимодействия
- [Third-Party Integrations](../reference/integrations.md) – Настройка на удостоверение за Discord
- [Credentials Tab](../tabs/credentials-tab.md) – Добавяне и управление на `discord` удостоверения
- [Node Types](../reference/node-types.md) – Преглед на всички типове node
