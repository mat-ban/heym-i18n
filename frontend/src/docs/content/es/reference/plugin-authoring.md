# Creación de Plugins

Los plugins de Heym son paquetes zip de confianza instalados por un operador. Un paquete puede agregar uno o más nodos personalizados de acción o trigger sin modificar la aplicación principal.

## Estructura del Paquete

Un zip de plugin debe contener `plugin.json` en la raíz del paquete y el archivo de entrada de Python indicado por `entry` (por defecto `handler.py`).

```text
acme-crm-plugin.zip
|-- plugin.json
|-- handler.py
|-- README.md
|-- icon.svg
`-- assets/
    `-- publisher.svg
```

`README.md` es opcional y se sirve como la página de documentación del plugin. Coloque un `icon.svg` en la raíz del paquete para el icono de nodo predeterminado, o establezca una ruta `icon` específica para un nodo en `plugin.json`.

## Manifiesto

Utilice un `plugin.json` de múltiples nodos cuando un paquete exponga varios nodos:

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

También se aceptan manifiestos heredados de un solo nodo: omita `nodes` y proporcione `kind`, `fields`, `dslHint` y `docSlug` en el nivel superior.

## Campos del Manifiesto

| Campo | Notas |
|-------|-------|
| `id` | Id del paquete en minúsculas que utiliza letras, números y guiones. |
| `name` | Nombre del paquete legible por humanos. |
| `version` | Versión del paquete utilizada para la visualización y el almacenamiento en caché del handler. |
| `description` | Descripción breve que se muestra en la UI y en el contexto del asistente. |
| `entry` | Ruta del archivo handler de Python dentro del zip; por defecto `handler.py`. |
| `dependencies` | Requisitos pip opcionales instalados con `uv pip install`. |
| `nodes` | Nodos personalizados expuestos por este paquete. |

Cada nodo necesita una `key` única, un `name` y un `kind` que sea `action` o `trigger`. Si se omite `function`, las acciones llaman a `run` y los triggers llaman a `trigger`.

Los tipos de campo admitidos son `string`, `number`, `boolean` y `select`. Los campos select utilizan un array `options` de objetos `{ "label": "...", "value": "..." }`. Establezca `required` para los campos obligatorios y `secret` para las entradas enmascaradas. El manifiesto también acepta metadatos `default`, `dynamic` y `expression` para los campos; estos se almacenan con el manifiesto, pero los nodos de plugin actualmente leen la configuración guardada del nodo en tiempo de ejecución en lugar de rellenar automáticamente la configuración faltante a partir de los valores predeterminados.

Los campos de cadena no secretos se representan con la UI de entrada de expresiones. En tiempo de ejecución, cualquier valor de configuración de cadena guardado que comience con `$` se resuelve antes de que se llame al handler.

## Funciones del Handler

Los handlers de acción reciben las entradas del workflow, la configuración resuelta y un contexto pequeño:

```python
def create_contact(inputs, config, ctx):
    email = config["email"]
    return {
        "email": email,
        "nodeId": ctx["node_id"],
    }
```

Los handlers de trigger reciben la configuración resuelta y el contexto:

```python
def contact_created(config, ctx):
    return {
        "event": "contact.created",
        "nodeLabel": ctx["node_label"],
    }
```

Devuelva un diccionario para exponer campos de salida con nombre. Si un handler devuelve otro tipo, Heym lo envuelve como `{ "value": result }`.

## Instalación y Tiempo de Ejecución

Los plugins están deshabilitados de forma predeterminada. Los operadores los habilitan con `HEYM_PLUGINS_ENABLED=true` y restringen la gestión a `HEYM_PLUGIN_ADMIN_EMAILS`. Los archivos de plugin instalados residen bajo `HEYM_PLUGINS_DIR` y deben montarse de forma persistente en implementaciones de contenedores.

El código del plugin es Python de confianza instalado por el operador que se ejecuta en proceso con el backend. Puede acceder a la red y a las bibliotecas instaladas, por lo que solo debe instalar paquetes que esté dispuesto a ejecutar con el mismo nivel de confianza que Heym mismo.