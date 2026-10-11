# Авторство на плъгини

Плъгините на Heym са доверени zip пакети, инсталирани от оператор. Един пакет може
да добави един или повече персонализирани action или trigger nodes, без да променя основното приложение.

## Структура на пакета

Zip файлът на плъгина трябва да съдържа `plugin.json` в основата на пакета и Python входния
файл, посочен в `entry` (по подразбиране `handler.py`).

```text
acme-crm-plugin.zip
|-- plugin.json
|-- handler.py
|-- README.md
|-- icon.svg
`-- assets/
    `-- publisher.svg
```

`README.md` е незадължителен и се предоставя като страница с документация на плъгина. Поставете
`icon.svg` в основата на пакета за иконата на node по подразбиране или задайте специфичен за node
път до `icon` в `plugin.json`.

## Манифест

Използвайте `plugin.json` с няколко nodes, когато един пакет предоставя няколко nodes:

```json
{
  "id": "acme-crm",
  "name": "Acme CRM",
  "version": "1.0.0",
  "description": "Internal CRM actions and triggers",
  "entry": "handler.py",
  "dependencies": ["requests>=2.32.0"],
  "nodes": [
    {
      "key": "createContact",
      "name": "Create Contact",
      "kind": "action",
      "function": "create_contact",
      "description": "Create a CRM contact",
      "icon": "assets/publisher.svg",
      "dslHint": "Use this when the workflow needs to create an Acme CRM contact.",
      "fields": [
        {
          "key": "email",
          "label": "Email",
          "type": "string",
          "required": true
        },
        {
          "key": "sendWelcome",
          "label": "Send welcome email",
          "type": "boolean",
          "default": false
        }
      ]
    },
    {
      "key": "contactCreated",
      "name": "Contact Created",
      "kind": "trigger",
      "function": "contact_created",
      "description": "Start when a contact event arrives"
    }
  ]
}
```

Приемат се и манифести от по-стария формат с един node: пропуснете `nodes` и предоставете
`kind`, `fields`, `dslHint` и `docSlug` на най-горно ниво.

## Полета на манифеста

| Поле | Бележки |
|-------|-------|
| `id` | Идентификатор на пакета с малки букви, използващ букви, цифри и тирета. |
| `name` | Име на пакета, четимо за хора. |
| `version` | Версия на пакета, използвана за показване и кеширане на handler. |
| `description` | Кратко описание, показано в UI и в контекста на асистента. |
| `entry` | Път до Python handler файла в zip архива; по подразбиране `handler.py`. |
| `dependencies` | Незадължителни pip изисквания, инсталирани с `uv pip install`. |
| `nodes` | Персонализирани nodes, предоставени от този пакет. |

Всеки node се нуждае от уникален `key`, `name` и `kind` със стойност `action` или
`trigger`. Ако `function` е пропуснат, actions извикват `run`, а triggers извикват
`trigger`.

Поддържаните типове полета са `string`, `number`, `boolean` и `select`. Полетата select
използват масив `options` от обекти `{ "label": "...", "value": "..." }`.
Задайте `required` за задължителни полета и `secret` за маскирани входни данни. Манифестът
също приема метаданни `default`, `dynamic` и `expression` за полетата; те се
съхраняват с манифеста, но plugin nodes в момента четат запазената конфигурация на node по време на изпълнение, вместо автоматично да попълват липсваща конфигурация от стойности по подразбиране.

Несекретните полета от тип string се визуализират с UI за въвеждане на изрази. По време на изпълнение
всяка запазена стойност на конфигурация от тип string, която започва с `$`, се разрешава преди извикването на handler.

## Handler функции

Action handlers получават входни данни от workflow, разрешена конфигурация и малък контекст:

```python
def create_contact(inputs, config, ctx):
    email = config["email"]
    return {
        "email": email,
        "nodeId": ctx["node_id"],
    }
```

Trigger handlers получават разрешена конфигурация и контекст:

```python
def contact_created(config, ctx):
    return {
        "event": "contact.created",
        "nodeLabel": ctx["node_label"],
    }
```

Върнете речник, за да предоставите именувани изходни полета. Ако handler върне друг
тип, Heym го обвива като `{ "value": result }`.

## Инсталация и изпълнение

Плъгините са деактивирани по подразбиране. Операторите ги активират с
`HEYM_PLUGINS_ENABLED=true` и ограничават управлението до
`HEYM_PLUGIN_ADMIN_EMAILS`. Инсталираните файлове на плъгините се намират под
`HEYM_PLUGINS_DIR` и трябва да бъдат монтирани персистентно при разгръщания в контейнери.

Кодът на плъгините е доверен Python код, инсталиран от оператор, който се изпълнява в процеса на
backend-а. Той може да има достъп до мрежата и инсталираните библиотеки, затова инсталирайте само
пакети, които сте готови да изпълнявате със същото ниво на доверие като самото Heym.
