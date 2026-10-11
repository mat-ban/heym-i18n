# Enable Node

**Enable Node** node връща друг node обратно в активен режим. При изпълнение той задава `active` на целевия node на `true` и запазва промяната. Това е аналогът на [Disable Node](./disable-node.md): използвайте го, за да активирате отново [Cron](./cron-node.md) trigger или всеки друг node, който е бил изключен.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 1 |
| Изход | `$nodeLabel.targetNode`, `$nodeLabel.enabled` |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `label` | string | Идентификатор на node (camelCase) |
| `targetNodeLabel` | string | Етикет на node, който да бъде активиран (напр. `hourlyCheck`) |

## Поведение

- Целевият node се запазва като активен, така че бъдещите изпълнения и trigger-и го виждат. Повторно активиран Cron trigger се задейства отново в следващия си планиран момент.
- Ако целевият node се намира след Enable Node и все още не се е изпълнил, той също се изпълнява в текущото изпълнение.
- Активирането на вече активен node не променя нищо; изходът все още отчита `enabled: true`.
- Node-ът връща грешка, когато `targetNodeLabel` е празен или никой node не притежава този етикет.

## Сценарий на употреба

Стартиране на [Cron](./cron-node.md) trigger при поискване. Запазете Cron node изключен и добавете към workflow втора входна точка, например [Input](./input-node.md) trigger. Заявка към тази входна точка изпълнява Enable Node и Cron започва да се задейства.

Изключен trigger никога не стартира изпълнение сам по себе си, затова Enable Node трябва да се намира след входна точка, която може да се изпълни.

## Пример

```json
{
  "type": "enableNode",
  "data": {
    "label": "startCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Поток: Input → Enable Node (target: cron) → Output. Cron node `hourlyCheck` е запазен като деактивиран в същия workflow и изпълнява своя собствен клон за HTTP проверка, след като бъде активиран.

## Свързани

- [Node Types](../reference/node-types.md) – Преглед на всички типове node
- [Disable Node](./disable-node.md) – Изключване на node от вътрешността на workflow
- [Cron Node](./cron-node.md) – Trigger за активиране
- [Condition Node](./condition-node.md) – Разклонение преди активиране
- [Canvas Features](../reference/canvas-features.md) – Ръчно активиране или деактивиране на node
