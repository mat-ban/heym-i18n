# Plugin Trigger Node

**Plugin Trigger** node е trigger-ориентираният аналог на
[Plugin node](./plugin-node.md). Предоставя се от инсталиран plugin, чийто
`kind` е `trigger`, и генерира началните данни, с които стартира даден workflow.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 0 |
| Изходи | 1 |
| Изход | `$nodeLabel.<keys returned by the plugin>` |

Даден trigger plugin може да представлява произволен източник — друго приложение, услуга на трета страна или друга технология — стига handler-ът на plugin-а да връща данните, с които workflow-ът трябва да започне.

## Кога да се използва

Използвайте node Plugin Trigger, когато инсталиран plugin дефинира trigger, който стартира Вашия workflow. За plugin-и, които извършват действие по средата на workflow-а, използвайте
[Plugin node](./plugin-node.md).

## Конфигурация

Както при Plugin node, конфигурационният формуляр се генерира от полетата в manifest-а на plugin-а. Неконфиденциалните string полета използват expression input, а конфиденциалните полета са маскирани.

## Как се изпълняват plugin-ите

Кодът на plugin-ите е trusted (доставен от Heym, инсталиран от оператор) и се изпълнява in-process.
Инсталацията е ограничена до `HEYM_PLUGIN_ADMIN_EMAILS`, а подсистемата е обвързана с `HEYM_PLUGINS_ENABLED`. Вижте
[Running & Deployment](../getting-started/running-and-deployment.md).

## Авторство на plugin-и

За да създадете пакет за trigger plugin, вижте
[Plugin Authoring](../reference/plugin-authoring.md) за структурата на zip архива, полетата в manifest-а, сигнатурите на handler-ите, иконите, зависимостите и модела на доверие по време на изпълнение.
