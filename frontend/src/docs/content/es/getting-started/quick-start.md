# Inicio Rápido

Ponga en marcha su primer workflow de Heym en minutos.

¿Aún no tiene Heym en ejecución? Consulte [Ejecución y Despliegue](./running-and-deployment.md), o siga el recorrido en video: [Configure Heym Localmente en Menos de 2 Minutos](https://www.youtube.com/watch?v=P6YvlupUboU).

## 1. Crear un Workflow

1. Vaya a la pestaña [Workflows](../tabs/workflows-tab.md)
2. Haga clic en **New Workflow**
3. Asigne un nombre a su workflow (p. ej. "Hello World")

## 2. Añadir Nodos

1. Abra el panel **Nodes** a la izquierda
2. Arrastre un nodo [Input](../nodes/input-node.md) al canvas
3. Arrastre un nodo [LLM](../nodes/llm-node.md) y conéctelo al Input
4. Arrastre un nodo [Output](../nodes/output-node.md) y conéctelo al LLM

```
[Input] --> [LLM] --> [Output]
```

Consulte [Tipos de Nodos](../reference/node-types.md) para ver todos los nodos disponibles.

## 3. Configurar

- **Input**: Establezca un valor predeterminado o déjelo vacío para la entrada del usuario (consulte [Nodo Input](../nodes/input-node.md))
- **LLM**: Seleccione una [credencial](../tabs/credentials-tab.md) y un modelo, añada una instrucción de sistema y establezca `userMessage` en `$input.text` (consulte [Nodo LLM](../nodes/llm-node.md))
- **Output**: Establezca `message` en `$llm.text` para propagar la respuesta del LLM (consulte [Nodo Output](../nodes/output-node.md))

Utilice la sintaxis del [Expression DSL](../reference/expression-dsl.md) para `$input.text` y `$llm.text`. Haga clic en el botón de expandir de los campos de expresión para abrir el [Diálogo de Evaluación de Expresiones](../reference/expression-evaluation-dialog.md) con vista previa en vivo del backend.

## 4. Ejecutar

Haga clic en **Run**, pulse `Ctrl + Enter`, o utilice el panel de depuración para ejecutar. El workflow se ejecuta desde el nodo Input a través de los nodos conectados hasta el Output. Consulte [Triggers](../reference/triggers.md) para conocer otras formas de ejecutar workflows ([webhook](../reference/webhooks.md), portal, cron, etc.).

Consulte las ejecuciones anteriores en **History** (barra de herramientas) y utilice **Bring to Canvas** para volver a ejecutar con las mismas entradas.

En Docs, Evals y otras páginas internas que no son el canvas, también puede utilizar el [Quick Drawer](../reference/quick-drawer.md) para seleccionar un workflow fijado y ejecutarlo sin volver al editor.

Si está leyendo la documentación y desea aclaraciones antes de construir, abra [Chat with Heym](../reference/chat-with-heym.md) desde el encabezado de Docs para formular preguntas contextualizadas según la página.

Como alternativa, utilice el [AI Assistant](../reference/ai-assistant.md) desde el panel de Debug para crear workflows con lenguaje natural: describa lo que desea y la IA genera los nodos y las conexiones.

¿Ya está construyendo automatizaciones en otra herramienta? [Migrar a Heym](./migrate-to-heym.md) convierte un workflow de n8n, Flowise, Dify, Langflow, sim.ai o Activepieces en un workflow de Heym que puede importar.

## Relacionado

- [Conceptos Básicos](./core-concepts.md) – Workflows, nodos y flujo de ejecución
- [Migrar a Heym](./migrate-to-heym.md) – Convierta workflows de n8n, Flowise, Dify, Langflow, sim.ai o Activepieces a Heym con IA
- [Ejecución y Despliegue](./running-and-deployment.md) – Inicie localmente con `run.sh` o despliegue con `deploy.sh`
- [Variables de Entorno](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Referencia completa de configuración
- [Settings](../reference/user-settings.md) – Configure nombre, User Rules y contraseña
- [Funciones del Canvas](../reference/canvas-features.md) – Data pin, logs de ejecución, habilitar/deshabilitar, extraer a sub-workflow
- [Atajos de Teclado](../reference/keyboard-shortcuts.md) – Atajos del canvas y del editor
- [Expression DSL](../reference/expression-dsl.md) – Referenciar datos en la configuración de nodos
- [Diálogo de Evaluación de Expresiones](../reference/expression-evaluation-dialog.md) – Editor expandible con vista previa en vivo del backend
- [Triggers](../reference/triggers.md) – Todos los puntos de entrada de workflows ([webhook](../reference/webhooks.md), portal, cron, etc.)
- [Historial de Ejecuciones](../reference/execution-history.md) – Consulte ejecuciones anteriores y Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Ejecute workflows fijados desde páginas que no son el canvas
- [Chat with Heym](../reference/chat-with-heym.md) – Formule preguntas contextuales desde el encabezado de la documentación
- [Pestaña Workflows](../tabs/workflows-tab.md) – Cree y gestione workflows
- [Pestaña Credentials](../tabs/credentials-tab.md) – Añada claves de API para nodos LLM
- [AI Assistant](../reference/ai-assistant.md) – Cree workflows con lenguaje natural
