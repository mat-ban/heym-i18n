# Nodo Plugin Trigger

El nodo **Plugin Trigger** es la contraparte de tipo trigger del
[Nodo Plugin](./plugin-node.md). Es proporcionado por un plugin instalado cuyo
`kind` es `trigger`, y produce los datos iniciales con los que comienza un workflow.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 0 |
| Salidas | 1 |
| Salida | `$nodeLabel.<keys returned by the plugin>` |

Un plugin de tipo trigger puede representar cualquier origen — una aplicación distinta, un servicio de terceros u otra tecnología — siempre que el handler del plugin devuelva los datos con los que debe comenzar el workflow.

## Cuándo utilizarlo

Utilice un nodo Plugin Trigger cuando un plugin instalado defina un trigger que inicie su workflow. Para plugins que ejecutan una acción en medio del workflow, utilice el [Nodo Plugin](./plugin-node.md) en su lugar.

## Configuración

Al igual que el Nodo Plugin, el formulario de configuración se genera a partir de los campos del manifiesto del plugin. Los campos de cadena no secretos utilizan la entrada de expresión, y los campos secretos se enmascaran.

## Cómo se ejecutan los plugins

El código de los plugins es de confianza (proporcionado por Heym, instalado por el operador) y se ejecuta en proceso.
La instalación está restringida a `HEYM_PLUGIN_ADMIN_EMAILS` y el subsistema está controlado por `HEYM_PLUGINS_ENABLED`. Consulte
[Ejecución y despliegue](../getting-started/running-and-deployment.md).

## Crear plugins

Para crear un paquete de plugin de tipo trigger, consulte
[Creación de plugins](../reference/plugin-authoring.md) para obtener información sobre la estructura del zip, los campos del manifiesto, las firmas de los handlers, los iconos, las dependencias y el modelo de confianza en tiempo de ejecución.