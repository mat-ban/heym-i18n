# Inici ràpid

Poseu en marxa el vostre primer Workflow de Heym en qüestió de minuts.

Encara no teniu Heym en funcionament? Consulteu [Execució i desplegament](./running-and-deployment.md) o seguiu el tutorial en vídeo: [Configureu Heym localment en menys de 2 minuts](https://www.youtube.com/watch?v=P6YvlupUboU).

## 1. Creeu un Workflow

1. Aneu a la pestanya [Workflows](../tabs/workflows-tab.md)
2. Feu clic a **New Workflow**
3. Poseu un nom al vostre workflow (p. ex. "Hello World")

## 2. Afegiu Nodes

1. Obriu el tauler **Nodes** de l'esquerra
2. Arrossegueu un Node [Input](../nodes/input-node.md) al llenç
3. Arrossegueu un Node [LLM](../nodes/llm-node.md) i connecteu-lo a l'Input
4. Arrossegueu un Node [Output](../nodes/output-node.md) i connecteu-lo a l'LLM

```
[Input] --> [LLM] --> [Output]
```

Consulteu [Tipus de Node](../reference/node-types.md) per veure tots els Nodes disponibles.

## 3. Configureu

- **Input**: Establiu un valor per defecte o deixeu-lo buit per a l'entrada de l'usuari (vegeu [Node Input](../nodes/input-node.md))
- **LLM**: Seleccioneu una [credencial](../tabs/credentials-tab.md) i un model, afegiu una instrucció de sistema i establiu `userMessage` a `$input.text` (vegeu [Node LLM](../nodes/llm-node.md))
- **Output**: Establiu `message` a `$llm.text` per transmetre la resposta de l'LLM (vegeu [Node Output](../nodes/output-node.md))

Utilitzeu la sintaxi de l'[Expression DSL](../reference/expression-dsl.md) per a `$input.text` i `$llm.text`. Feu clic al botó d'expansió dels camps d'expressió per obrir el [Diàleg d'avaluació d'expressions](../reference/expression-evaluation-dialog.md) amb previsualització en directe del backend.

## 4. Executeu

Feu clic a **Run**, premeu `Ctrl + Enter` o utilitzeu el tauler de depuració per executar. El workflow s'executa des del Node Input passant pels Nodes connectats fins a l'Output. Consulteu [Triggers](../reference/triggers.md) per conèixer altres maneres d'executar workflows ([webhook](../reference/webhooks.md), portal, cron, etc.).

Visualitzeu les execucions anteriors a **History** (barra d'eines) i utilitzeu **Bring to Canvas** per tornar a executar amb les mateixes entrades.

A Docs, Evals i altres pàgines internes que no són el llenç, també podeu utilitzar el [Quick Drawer](../reference/quick-drawer.md) per triar un workflow fixat i executar-lo sense tornar a l'editor.

Si esteu llegint la documentació i voleu aclariments abans de construir, obriu [Chat with Heym](../reference/chat-with-heym.md) des de la capçalera de Docs per fer preguntes contextualitzades sobre la pàgina.

Alternativament, utilitzeu l'[AI Assistant](../reference/ai-assistant.md) des del tauler de depuració per crear workflows amb llenguatge natural: descriviu què voleu i la IA genera els Nodes i les arestes.

Ja esteu construint automatitzacions en una altra eina? [Migrate to Heym](./migrate-to-heym.md) converteix un workflow d'n8n, Flowise, Dify, Langflow, sim.ai o Activepieces en un workflow de Heym que podeu importar.

## Relacionat

- [Conceptes bàsics](./core-concepts.md) – Workflows, Nodes i flux d'execució
- [Migrate to Heym](./migrate-to-heym.md) – Convertiu workflows d'n8n, Flowise, Dify, Langflow, sim.ai o Activepieces a Heym amb IA
- [Execució i desplegament](./running-and-deployment.md) – Inicieu localment amb `run.sh` o desplegueu amb `deploy.sh`
- [Variables d'entorn](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Referència completa de configuració
- [Configuració](../reference/user-settings.md) – Configureu el nom, les User Rules i la contrasenya
- [Funcions del llenç](../reference/canvas-features.md) – Data pin, registres d'execució, activació/desactivació, extracció a sub-workflow
- [Dreceres de teclat](../reference/keyboard-shortcuts.md) – Dreceres del llenç i de l'editor
- [Expression DSL](../reference/expression-dsl.md) – Referenciar dades a la configuració dels Nodes
- [Diàleg d'avaluació d'expressions](../reference/expression-evaluation-dialog.md) – Editor expandible amb previsualització en directe del backend
- [Triggers](../reference/triggers.md) – Tots els punts d'entrada del workflow ([webhook](../reference/webhooks.md), portal, cron, etc.)
- [Historial d'execucions](../reference/execution-history.md) – Visualitzeu execucions anteriors i Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Executeu workflows fixats des de pàgines que no són el llenç
- [Chat with Heym](../reference/chat-with-heym.md) – Feu preguntes contextuals des de la capçalera de la documentació
- [Pestanya Workflows](../tabs/workflows-tab.md) – Creeu i gestioneu workflows
- [Pestanya Credentials](../tabs/credentials-tab.md) – Afegiu claus d'API per als Nodes LLM
- [AI Assistant](../reference/ai-assistant.md) – Creeu workflows amb llenguatge natural
