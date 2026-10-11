# Деактивиране на node

**Disable Node** е node, който перманентно деактивира друг node във workflow-а. При изпълнение той задава `active` на целевия node на `false` и запазва промяната. Използвайте го за еднократни операции, като например спиране на cron trigger след изпълнение на дадено условие.

## Общ преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 1 |
| Изход | `$nodeLabel.targetNode`, `$nodeLabel.disabled` |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `label` | string | Идентификатор на node (camelCase) |
| `targetNodeLabel` | string | Етикет на node-а за деактивиране (напр. `hourlyCheck`) |

## Случай на употреба

Деактивирайте [Cron](./cron-node.md) trigger след изпълнение на дадено условие, така че той да не се изпълнява повече при бъдещи изпълнения на workflow-а. Включете го отново по-късно с [Enable Node](./enable-node.md).

## Пример

```json
{
  "type": "disableNode",
  "data": {
    "label": "stopCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Поток: Cron → HTTP проверка → Condition (status complete?) → ако е true: Disable Node (target: cron) → Output.

## Свързани

- [Node Types](../reference/node-types.md) – Общ преглед на всички типове node
- [Enable Node](./enable-node.md) – Включване на деактивиран node отново
- [Cron Node](./cron-node.md) – Trigger за деактивиране
- [Condition Node](./condition-node.md) – Разклонение преди деактивиране
