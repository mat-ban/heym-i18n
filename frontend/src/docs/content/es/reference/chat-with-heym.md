# Chat con Heym

Chat con Heym es un asistente consciente de la página disponible desde el encabezado de la documentación. Se abre en un diálogo centrado, permite seleccionar una credencial de LLM y un modelo, y responde preguntas utilizando la página de documentación actual como primer contexto.

## Abrir el diálogo

1. Abra cualquier página bajo `/docs`
2. Haga clic en **Chat con Heym** en el encabezado
3. Seleccione una [credencial](../tabs/credentials-tab.md) y un modelo
4. Formule una pregunta sobre la página o sobre la plataforma

En pantallas pequeñas el trigger se muestra solo como icono; en pantallas más grandes muestra la etiqueta completa.

## Qué contexto utiliza

- La ruta de documentación abierta actualmente se inyecta en la solicitud como guía contextual
- El backend sigue utilizando el endpoint de chat existente del panel y las herramientas de búsqueda de documentación
- Sus [User Rules](./user-settings.md) a nivel de cuenta siguen aplicándose, ya que se reutiliza el mismo backend de chat
- Los pasos de preparación en vivo se transmiten en la burbuja del asistente antes de la respuesta final, de forma similar al chat del panel
- Las preguntas de aclaración aparecen como tarjetas, igual que en la [pestaña Chat](../tabs/chat-tab.md). Cuando una solicitud de workflow necesita una credencial, puede seleccionar una o crearla desde la tarjeta. Cuando necesita una tabla de datos, puede seleccionar una de sus tablas o crear una nueva de la misma manera.

Cuando abre el diálogo en un artículo específico, una pequeña insignia muestra la ruta de documentación activa para que pueda confirmar qué página se está priorizando.

## Comportamiento de la sesión

- La selección de credencial y modelo se mantiene mientras el diálogo permanece montado
- El historial de mensajes es solo de sesión y se borra cuando se cierra el diálogo
- El clic en el fondo, `Escape` y el botón de cierre restablecen la sesión
- **Stop** aborta la respuesta en streaming actual
- El diálogo es intencionalmente amplio y de tamaño fijo; no ofrece un toggle de pantalla completa

## Cuándo utilizarlo

- Formule preguntas de seguimiento mientras lee una página de nodo o de referencia
- Aclare diferencias entre funcionalidades sin salir de la documentación
- Encuentre el artículo adecuado antes de abrir el editor

Si desea construir o modificar workflows directamente, utilice el [AI Assistant](./ai-assistant.md) del lado del editor en su lugar.

## Relacionado

- [AI Assistant](./ai-assistant.md) – Chat del editor para construir workflows
- [Pestaña Credenciales](../tabs/credentials-tab.md) – Añada credenciales de LLM utilizadas por el diálogo
- [Settings](./user-settings.md) – User Rules globales aplicadas a las superficies de IA
- [Quick Start](../getting-started/quick-start.md) – Primer recorrido por un workflow