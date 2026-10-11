# JSON output mapper

Възелът **JSON output mapper** изгражда JSON обект от key/value [mappings](./set-node.md) (същият модел като [Set](./set-node.md)). Използвайте го, когато извикващите трябва да получат **plain JSON body** в корена на отговора.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 0 (sink) |
| Runtime изход | Обект, изграден от `mappings` |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `label` | string | Идентификатор на възела (camelCase) |
| `mappings` | array | `{ "key": "fieldName", "value": "expression" }` записи (същите като при Set) |

## Използване като инструмент от агент

Не се поддържа. Този възел е терминален sink, затова не може да бъде прикачен към handle за инструменти на [Agent Node](./agent-node.md). Използвайте възел [Set](./set-node.md), когато агент трябва да оформи стойности по време на разговор.

## Поведение при Webhook и изпълнение

Когато този възел е **единственият** терминален изход на workflow, **outputs** на изпълнението са самият mapping обект: ключовете от `mappings` се появяват на **top level** на JSON. **Няма** външен wrapper, ключован с label на възела, и **няма** обект `{ "result": ... }` (за разлика от възела [Output](./output-node.md)).

Ако няколко терминални възела произвеждат изходи (например [Output](./output-node.md) плюс JSON output mapper, или няколко разклонения), Heym използва нормалната форма: всеки терминал е ключован с неговия `label`.

## Ограничение при Loop

Същото правило като при [Output](./output-node.md): не поставяйте този възел в разклонение за итерация на loop — само след разклонението `done` на loop. Вижте [Loop](./loop-node.md).

## Пример

```json
{
  "type": "jsonOutputMapper",
  "data": {
    "label": "apiPayload",
    "mappings": [
      { "key": "message", "value": "$llm.text" },
      { "key": "ok", "value": "true" }
    ]
  }
}
```

## Свързани

- [Set](./set-node.md) – Същата механика на mapping за междинни трансформации
- [Output](./output-node.md) – Отговор под формата на съобщение или схема с `result` обвивка
- [Node Types](../reference/node-types.md) – Всички типове възли
- [Workflow Structure](../reference/workflow-structure.md) – JSON формат на workflow
- [Webhooks](../reference/webhooks.md) – Endpoint за изпълнение и отговори
