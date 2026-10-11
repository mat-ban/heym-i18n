# Slack

**Slack** node изпраща съобщение до Slack канал чрез Incoming Webhook. Използвайте го за нотификации, известия и докладване на грешки.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 1 |
| Изход | Препредава входа |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `credentialId` | UUID | Slack удостоверение (webhook URL) от [Удостоверения](../tabs/credentials-tab.md) |
| `message` | expression | Текст на съобщението. Поддържа [expressions](../reference/expression-dsl.md). |

## Настройка

1. Създайте Incoming Webhook във Вашето Slack workspace
2. Добавете Slack удостоверение в раздела Удостоверения с webhook URL
3. Реферирайте удостоверението в node

## Пример

```json
{
  "type": "slack",
  "data": {
    "label": "notifyTeam",
    "credentialId": "slack-credential-uuid",
    "message": "Workflow completed: $userInput.body.text"
  }
}
```

Използвайте с [Error Handler](./error-handler-node.md) за нотификации при грешки:
```json
"message": "Error in $errorHandler.errorNode: $errorHandler.error"
```

## Egress Safety

- Webhook URL, съхранен в удостоверението, трябва да използва `http://` или `https://` и да се разрешава само до публични адреси. Loopback, частни, link-local, multicast и cloud-metadata дестинации са блокирани.
- Heym валидира разрешените адреси и фиксира целевата връзка преди изпращане, така че DNS отговор не може да премести заявката към вътрешен адрес след проверката. Environment proxies са деактивирани, докато guard е активен, и redirects не се следват.
- Деплойменти, които изпращат към вътрешен webhook receiver, могат да зададат `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` на доверен self-hosted instance. Запазете настройката по подразбиране при hosted или multi-tenant деплойменти.

**Бележка за надграждане до v0.0.109:** тази проверка е нова за Slack. Удостоверение, чието webhook URL сочи към loopback или частен адрес, се отхвърля, освен ако настройката по-горе не е активирана.

## Свързани

- [Node Types](../reference/node-types.md) – Преглед на всички типове nodes
- [Error Handler](./error-handler-node.md) – Изпращане на Slack при неуспешен workflow
- [Credentials Tab](../tabs/credentials-tab.md) – Добавяне на Slack webhook
