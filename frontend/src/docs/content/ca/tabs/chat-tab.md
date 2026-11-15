# Pestanya Chat

La pestanya **Chat** ofereix una interfície de xat directa amb el LLM. Utilitzeu-la per provar models, fer preguntes, executar Workflows existents o crear un Workflow nou a partir d'una sol·licitud en llenguatge natural.

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Vegeu la demostració del Chat</a></p>

## Configuració

1. Seleccioneu una [credencial](./credentials-tab.md) (clau API per a OpenAI, Google, etc.)
2. Trieu un model al desplegable (els models es carreguen a partir de la credencial seleccionada)
3. Comenceu a escriure per enviar missatges

També podeu iniciar una conversa des del quadre de xat de la [pestanya Workflows](./workflows-tab.md). Envia el vostre primer missatge i obre la nova conversa aquí amb la resposta ja en streaming.

## Funcionalitats

- **Context de variables globals** – Les vostres [Variables globals](../reference/global-variables.md) estan disponibles per al LLM, de manera que podeu preguntar o fer referència a valors emmagatzemats
- **Context de plantilles de l'espai de treball** – Les plantilles compartides de Workflow i Node del vostre espai de treball s'inclouen com a context, de manera que el Chat pot respondre preguntes sobre les plantilles disponibles
- **Agent de llarga durada** – El Chat continua treballant al backend encara que es tanqui el navegador, de manera que podeu tornar des d'un altre dispositiu i continuar la mateixa conversa
- **Creació de Workflows** – Demaneu al Chat que creï o configuri un Workflow, i utilitza el mateix motor Workflow AI Builder que l'assistent de l'editor per generar i desar el Workflow
- **Creació de tasques al Kanban** – Demaneu de manera natural afegir una tasca o crear una targeta. El Chat l'afegeix a la primera columna del tauler sol·licitat; quan teniu diversos taulers i no n'especifiqueu cap, el Chat presenta un selector de tauler abans de crear la targeta
- **Seguiments en cua** – Envieu més missatges mentre una resposta està en streaming. Els missatges en cua es conserven, es poden editar o eliminar abans que comencin, i s'executen en ordre després de la resposta activa
- **Kanban boards** – Ask naturally to add, assign, move, update or comment on a task, list your overdue tasks or what waits for a review, or create and arrange boards and columns. When you have multiple boards and do not name one, Chat presents a board picker before creating a card. See [Board › From Chat and MCP](./board-tab.md#from-chat-and-mcp)
- **Send now** – Click **Send now** beside a queued message to stop the active reply and send that message immediately. The partial reply stays in the conversation, followed by your message and the new answer. The message keeps its files and chosen model; the other queued messages remain and resume in order afterward
- **Changing direction** – After **Send now**, your latest message controls the task. A cancelled question stays as context and is not another pending job. Interrupted requests appear as **cancelled** in Traces and run history, including ones stopped before the model answers
