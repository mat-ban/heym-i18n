# Nodo Plugin

El nodo **Plugin** ejecuta una acción personalizada proporcionada por un plugin instalado. Los plugins amplían Heym con nuevos tipos de nodo — acciones, integraciones de terceros o cualquier cosa expresable en Python — sin modificar la aplicación principal.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Salida | `$nodeLabel.<keys returned by the plugin>` |

Un **paquete** de plugin (un zip) puede incluir **múltiples nodos** — cualquier combinación de acciones y triggers. Cada nodo aparece en la paleta bajo **Plugins** con su propio nombre y descripción. Al arrastrar uno al canvas se crea un nodo Plugin vinculado a ese paquete (`pluginId`) y nodo (`pluginNodeKey`).

## Cuándo utilizarlo

Utilice un nodo Plugin cuando un operador haya instalado un plugin que realice la acción que necesita — por ejemplo, llamar a una API privada, comunicarse con un sistema interno o ejecutar lógica personalizada escrita para su despliegue.

Para plugins de tipo trigger que inician un workflow, consulte el
[nodo Plugin Trigger](./plugin-trigger-node.md).

## Configuración

El formulario de configuración del nodo se genera a partir del manifiesto del plugin. Cada campo declarado por el plugin (`string`, `number`, `boolean` o `select`) se renderiza automáticamente. Los campos de cadena no secretos utilizan la entrada de expresión, y los valores de configuración de cadena guardados que comienzan por `$` se resuelven antes de que se ejecute el manejador del plugin.

Los campos secretos (como las claves de API) se enmascaran en la interfaz y nunca se escriben en los registros.

## Cómo se ejecutan los plugins

Los plugins son distribuidos por Heym e instalados por un operador, por lo que el código del plugin es **de confianza** y se ejecuta en proceso como un nodo integrado, con acceso completo a la red y a las librerías. Un plugin puede declarar `dependencies` de pip que se instalan en la instancia en el momento de la instalación.

La instalación y eliminación de plugins está restringida a los operadores cuyo correo electrónico figure en `HEYM_PLUGIN_ADMIN_EMAILS`, y todo el subsistema está controlado por `HEYM_PLUGINS_ENABLED` (deshabilitado de forma predeterminada). Consulte
[Ejecución y despliegue](../getting-started/running-and-deployment.md) para conocer las variables de entorno.

## Iconos personalizados

Un plugin puede incluir logotipos SVG personalizados. Coloque un `icon.svg` en la raíz del paquete para establecer un valor predeterminado para todos los nodos, o bien asigne a un nodo su propio `"icon": "<file>.svg"` en el manifiesto. El icono se muestra tanto en la tarjeta de la paleta como en el nodo del canvas; los nodos sin icono recurren al glifo predeterminado de pieza de puzle.

## AI Builder

Los plugins instalados se exponen al asistente de IA y al canvas de chat, por lo que puede pedir a Heym que "use el plugin Acme CRM para crear un registro" y generará el nodo Plugin con el `pluginId` y la `config` correctos.

## Crear plugins

Para crear un paquete de plugin, consulte
[Creación de plugins](../reference/plugin-authoring.md) para conocer la estructura del zip, los campos del manifiesto, las firmas de los manejadores, los iconos, las dependencias y el modelo de confianza en tiempo de ejecución.