# Funcions del Canvas

L'editor de Workflows ofereix diverses funcions per depurar, provar i organitzar Nodes: **Run to Node**, **AI en un node**, **Data Pin**, **Execution Logs**, **Enable/Disable** i **Extract to Sub-Workflow**.

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Watch Editor demo</a></p>

## Run to Node

Passeu el cursor per sobre de qualsevol Node excepte una nota adhesiva i feu clic a **Run** a sota. Heym executa aquest Node i les seves dependències upstream, deixant intactes els Nodes downstream i les branques no relacionades. Això utilitza el mode de prova del Canvas, incloent-hi les sortides fixades i les condicions de branca normals del Workflow.

Si el camí seleccionat té camps d'entrada, el panell **Run** de la dreta s'obre i enfoca el primer camp. Introduïu els valors i feu clic a **Run to _node label_** o premeu **Ctrl+Enter** (Cmd+Enter a macOS). El mode de cos genèric enfoca l'editor de cos JSON. Els camins sense camps d'entrada s'executen immediatament sense obrir el panell. Els Nodes d'entrada fixats reutilitzen la seva sortida fixada sense demanar entrada.

El panell conserva l'objectiu seleccionat per a execucions posteriors. Trieu **Run full workflow** per esborrar l'objectiu. Els botons Run estan desactivats mentre hi ha una execució activa. Un objectiu dins d'un bucle atura l'execució quan s'assoleix aquest Node per primera vegada; seleccionar un Node després del bucle executa el bucle upstream complet.

## AI en un node

Passeu el cursor per sobre de qualsevol node excepte una nota adhesiva i feu clic a **AI** a sobre. L'[AI Assistant](./ai-assistant.md) s'obre en aquest node i ofereix **Change this node as ...**, **Fix error in this node ...** i **Other**. En mode Agent, l'assistent modifica només aquest node; altres nodes, connexions i la disposició romanen inalterats. Vegeu [AI Assistant › Modificar un sol node](./ai-assistant.md#changing-one-node).

El botó queda ocult en workflows que només podeu visualitzar.

## Data Pin

Data Pin us permet fixar la sortida d'un Node de l'última execució per poder provar els Nodes downstream sense tornar a executar el Node fixat.

### On trobar-ho

- **Properties panel** – Seleccioneu un Node i desplaceu-vos fins a la secció **Pinned Data**
- **Node badge** – Una icona de pin apareix al Node quan les dades estan fixades

### Accions

| Acció | Descripció |
|--------|-------------|
| **Pin** | Fixa la sortida de l'última execució del Node (disponible després d'una execució) |
| **Clear** | Elimina les dades fixades |
| **Edit** | Editeu el JSON fixat directament; feu clic a Save per aplicar-ho |

### Comportament en mode de prova

Quan s'executa un Workflow en mode de prova, els Nodes amb `pinnedData` ometen l'execució i utilitzen la sortida fixada en el seu lloc. Utilitzeu-ho per a:

- Provar la lògica downstream sense cridar APIs externes
- Depurar expressions que fan referència a la sortida del Node
- Iterar sobre Prompts o condicions amb dades de mostra fixes

La compleció d'expressions a l'editor utilitza les dades fixades quan estan disponibles per suggerir camps.

## Execution Logs

El **Debug panel** (cala inferior) mostra els logs d'execució en temps real durant les execucions del Workflow. També podeu obrir una execució de producció en curs des del diàleg History o des d'una targeta del Board. L'editor s'adjunta al flux SSE d'aquesta execució, restaura els resultats dels Nodes completats i continua mostrant les animacions i els logs dels Nodes a mesura que els nous Nodes s'inicien i finalitzen.

### Què mostra

- **Node results** – Estat per Node (`success`, `error`, `skipped`, `running`), temps d'execució i sortida
- **Final outputs** – Sortides agregades dels Nodes [Output](../nodes/output-node.md)
- **Agent progress** – Per als Nodes [Agent](../nodes/agent-node.md), crides d'eines i raonament pas a pas

### Accions

- **Copy as JSON** – Copia el log d'execució complet al porta-retalls
- **Open in JSON editor** – Obre el log a JSON Hero o JSON Editor Online per a la seva inspecció
- **Download generated files** – Si una skill ha produït fitxers descarregables (`_generated_files`), apareix un botó Download. Un sol fitxer es descarrega directament; diversos fitxers obren una finestra de selecció.

### Diferència respecte a la pestanya Logs

El Debug panel mostra els logs d'**execució del Workflow** (resultats dels Nodes, sortides). La [Logs Tab](../tabs/logs-tab.md) mostra els logs dels **contenidors Docker** (backend, frontend, base de dades). <!-- pragma: allowlist secret -->

## Enable / Disable

Podeu desactivar Nodes perquè s'ometin durant l'execució. Els Nodes desactivats mostren una insígnia "off" i apareixen atenuats.

### Com alternar-ho

| Mètode | Descripció |
|--------|-------------|
| **Properties panel** | Seleccioneu el Node → icona Power (a dalt a la dreta) |
| **Context menu** | Feu clic dret al(s) Node(s) → Disable o Enable |
| **Keyboard** | Seleccioneu el(s) Node(s) → premeu **D** (vegeu [Keyboard Shortcuts](./keyboard-shortcuts.md)) |

### Selecció múltiple

Quan hi ha diversos Nodes seleccionats, Enable/Disable s'aplica a tots ells. El menú contextual mostra "Enable" si algun Node seleccionat està desactivat, i "Disable" si tots estan activats.

### Comportament en temps d'execució

Els Nodes amb `active: false` s'ometen. Els Nodes downstream no reben dades dels Nodes omesos. Utilitzeu-ho per excloure temporalment Nodes sense eliminar-los.

Per activar o desactivar un Node des de dins d'un Workflow en lloc de fer-ho manualment, utilitzeu [Disable Node](../nodes/disable-node.md) i [Enable Node](../nodes/enable-node.md).
## Graf de memòria de l'Agent

Els nodes [Agent](../nodes/agent-node.md) amb **[memòria persistent](./agent-persistent-memory.md)** activada mostren un control rosa de **cervell** al node. Feu-hi clic per obrir l'editor del graf de memòria: les entitats es representen com un graf animat dirigit per forces, agrupat per tipus d'entitat, amb selectors de Source/Target cercables per afegir relacions i un panell de connexions per saltar entre entitats enllaçades. El mateix diàleg inclou **Comparteix la memòria amb altres agents** (workflow → agent → lectura o lectura/escriptura) per a [compartició de memòria entre agents](./agent-persistent-memory.md#sharing-with-other-agents). Mentre el diàleg és obert, el desfer/refer del llenç principal es difereix perquè l'edició del graf manté el seu propi historial.

**Filtratge del graf.** La part superior esquerra del llenç té un control de cerca, plegat en un botó de drecera fins que hi feu clic o premeu **Ctrl/Cmd+F**. Coincideix amb el nom d'una entitat, el seu tipus i cada clau i valor d'atribut, així com amb el tipus d'una relació (`parent_of`) i les seves propietats; una relació coincident arrossega ambdues entitats. Tots els termes separats per espais han de coincidir. Una entitat coincident arrossega tot el seu veïnatge — cada relació en què participa i l'entitat de l'altre extrem de cadascuna — de manera que una coincidència mai no queda com un punt desconnectat. Una relació coincident només arrossega les dues entitats que uneix i s'atura aquí, ja que cercar un tipus de relació és una pregunta sobre aquesta relació i no sobre tot allò a què estan vinculats els seus extrems. Tota la resta s'amaga directament — no s'atenua — al llenç i a la llista **All edges**, i una insígnia mostra quantes de les entitats totals queden. La **✕** dins de la caixa esborra la consulta primer i, en una segona pulsació, tanca la caixa. Escape desfà el mateix camí, de dins cap a fora: esborra la consulta, després tanca la caixa de cerca, després surt de la vista ampliada del llenç i només tanca el diàleg quan cap d'aquests elements és obert. Esborrar restaura el graf complet amb cada entitat allà on era.

**Col·locació manual d'entitats.** Arrossegar una entitat la fixa allà on la deixeu anar, de manera que la disposició automàtica estabilitza la resta del graf al seu voltant en lloc de tornar-la a estirar. Arrossegar l'entitat que teniu seleccionada mou les seves entitats directament connectades juntament amb ella, mantenint la forma del clúster; arrossegar qualsevol altra entitat mou només aquella. **Tidy layout** (el botó de la vareta màgica) allibera cada entitat fixada i torna a executar la disposició automàtica.

## Extract to Sub-Workflow

Convertiu els nodes seleccionats en un sub-workflow reutilitzable i substituïu-los per un node [Execute](../nodes/execute-node.md).

### Com utilitzar-ho

1. Seleccioneu un o més nodes al llenç
2. Feu clic dret → **Extract to Sub-Workflow**
3. Introduïu un nom (i una descripció opcional) per al nou workflow
4. Feu clic a **Extract**

### Què passa

- Es crea un nou workflow amb els nodes seleccionats
- Les entrades externes (arestes des de fora de la selecció) esdevenen els camps [Input](../nodes/input-node.md) del sub-workflow
- Les sortides externes (arestes cap a nodes fora de la selecció) s'assignen a l'[Output](../nodes/output-node.md) del sub-workflow
- Els nodes seleccionats se substitueixen per un únic node [Execute](../nodes/execute-node.md) que crida el nou workflow
- Les assignacions d'entrada/sortida es conserven automàticament

### Casos d'ús

- Reutilitzar una seqüència de nodes en múltiples workflows
- Simplificar un workflow complex agrupant lògica relacionada
- Crear sub-workflows modulars i testables

## Run with cURL

El botó **cURL** de la barra d'eines de l'editor (a dalt a la dreta) obre un diàleg per construir i copiar una comanda cURL per activar el workflow via API.

- Trieu el mode del cos de la sol·licitud del workflow (`Defined` o `Generic`)
- Definiu el tipus d'autenticació (Anonymous, JWT o Header Auth)
- Configureu la memòria cau de respostes i la limitació de velocitat
- Activeu o desactiveu l'streaming SSE i personalitzeu els missatges d'inici per node
- Editeu el cos de la sol·licitud
- En mode Generic, el panell d'execució del llenç utilitza el mateix cos JSON en cru que el diàleg cURL
- Feu clic a **Copy cURL** per copiar la comanda a punt per executar

Vegeu [Webhooks](./webhooks.md#run-with-curl-dialog) per als detalls complets del diàleg i [SSE Streaming](./sse-streaming.md) per al protocol d'esdeveniments.

## Relacionat

- [Keyboard Shortcuts](./keyboard-shortcuts.md) – Totes les dreceres del llenç i de l'editor
- [Agent Persistent Memory](./agent-persistent-memory.md) – Comportament del graf de memòria i API
- [Execute Node](../nodes/execute-node.md) – Crida sub-workflows
- [Expression DSL](./expression-dsl.md) – Referències i dades fixades
- [Workflow Structure](./workflow-structure.md) – Format de nodes i arestes
- [Download & Import](./download-import.md) – Exportar i importar workflows com a JSON
- [Node Types](./node-types.md) – Tots els tipus de node
- [Logs Tab](../tabs/logs-tab.md) – Registres de contenidors Docker
- [Execution History](./execution-history.md) – Execucions anteriors
- [Templates](../tabs/templates-tab.md) – Desar i reutilitzar workflows i nodes
- [Contextual Showcase](./contextual-showcase.md) – Guia compacta de la pàgina disponible a l'editor

- [Col·laboració a Canvas](./canvas-collaboration.md): Live editing on a shared draft with pointers, following, and voice.
