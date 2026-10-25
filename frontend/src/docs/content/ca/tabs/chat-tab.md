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
- **Pauses de planificació** – Quan el Chat necessita detalls de planificació, fa preguntes d'aclariment i posa en pausa els seguiments en cua fins que respongueu. Un cop finalitza la resposta de planificació, es reprenen els missatges en cua
- **Credencials** – Quan un Workflow que el Chat crea o edita necessita una credencial, el Chat pregunta quina utilitzar, ofereix crear-ne una de nova a la conversa o us permet continuar sense. També podeu demanar al Chat que creï una credencial o que actualitzi una de la qual sou propietari; obre el formulari de credencial a la conversa. El model veu el nom i el tipus de la credencial, mai els seus valors, tant per a les credencials que teniu com per a les compartides amb vós. Els nodes LLM i Agent afegits pel Chat s'executen amb la credencial i el model seleccionats per al xat, incloses les credencials compartides; quan el Chat edita un workflow, els seus nodes LLM i Agent existents conserven la seva credencial i model. Vegeu [Assistent d'IA › Credencials](../reference/ai-assistant.md#credentials)
- **Taules de dades** – Quan un Workflow que el Chat crea o edita emmagatzema registres, el Chat pregunta quina [taula de dades](./datatable-tab.md) utilitzar o ofereix crear-ne una amb les columnes que el Workflow necessita. També pot llistar les vostres taules i les seves columnes. Mai llegeix ni escriu files. Vegeu [Assistent d'IA › Taules de dades](../reference/ai-assistant.md#data-tables)
- **Respostes en streaming** – Vegeu la sortida del model mentre s'emet en streaming
- **Aturar resposta** – Interrompeu la resposta en streaming actual en qualsevol moment; aturar també esborra els missatges en cua d'aquella conversa
- **Renderització de Markdown** – Les respostes admeten format Markdown, incloent-hi imatges en línia
- **Visualització d'imatges** – Les imatges incrustades a les respostes (per exemple, de la generació d'imatges del LLM) apareixen en línia; feu clic a qualsevol imatge per veure-la a pantalla completa. Premeu **Esc** o el botó enrere (mòbil) per tancar la visualització a pantalla completa
- **Copiar missatges** – Copieu qualsevol missatge al porta-retalls
- **Esborrar xat** – Inicieu una conversa nova
- **Entrada de veu** – Utilitzeu el botó del micròfon per a la conversió de veu a text (compatible amb el navegador). Quan s'atura l'enregistrament, Heym pot fer una neteja lleugera de la transcripció abans que l'envieu
- **Workflows programats** – Pregunteu quan s'executen els Workflows de tipus cron (avui, aquesta setmana, aquest mes o un interval de dates personalitzat). L'assistent utilitza les mateixes dades de planificació que la pestanya [Scheduled](./scheduled-tab.md) i pot limitar els resultats als Workflows dels quals sou propietari o incloure els compartits amb vosaltres
- **Historial d'execucions de Workflows** – Pregunteu sobre un Workflow ("quantes vegades s'ha executat l'informe diari?", "ha fallat?", "quan s'ha executat per última vegada?"). El Chat cerca el Workflow pel seu ID i respon a partir del seu recompte d'execucions, desglossament d'estats, primera i última hora d'execució i durada mitjana. Pregunteu per què ha fallat una execució o què ha retornat, i el Chat obre aquella execució concreta per llegir-ne les entrades, les sortides i els errors per Node
- **Estat d'execució en directe** – Pregunteu què s'està executant en aquest moment i el Chat respon amb el recompte, els noms dels Workflows, quant de temps porta en marxa cada execució, en quin Node es troba i un enllaç directe a l'execució en directe
## Ús del Chat des d'un client MCP

El motor de Chat també és accessible des de fora del navegador. Activeu l'**Heym Chat Tool** a la [pestanya MCP](./mcp-tab.md) i els clients MCP — Claude, Cursor i qualsevol altre que parli MCP — obtenen una única eina `heym_chat` que executa aquest mateix motor amb totes les seves capacitats.

Aquestes converses apareixen a l'historial d'aquesta pestanya, marcades amb una icona d'endoll a la llista de converses. Obriu-ne una per llegir què ha demanat el client, veure les targetes d'eines que ha activat i continuar el fil vosaltres mateixos. Respondre una pregunta d'aclariment funciona igual tant si el torn s'ha iniciat aquí com des d'un client MCP.

A través d'MCP, el Chat no llista, selecciona ni crea credencials. Els Workflows que construeix deixen els camps de credencials buits, i la resposta anomena els Nodes que necessiten una credencial perquè els pugueu configurar a l'editor.

Les taules de dades també funcionen a través d'MCP: el Chat llista les vostres taules, en crea de noves i les connecta als Workflows que construeix. La seva pregunta sobre la taula arriba com a text al resultat, de manera que cal respondre-la amb el mateix `conversation_id`.

## Límit de context

El chat manté fins a 25 missatges recents en context. Els missatges més antics es retallen per mantenir-se dins dels límits del model.

## Creació de Workflows

Quan demaneu al Chat que creï, construeixi, generi o configuri un Workflow, aquest crea un Workflow nou desat amb un nom i una descripció generats. La resposta inclou una previsualització de només lectura del llenç amb els Nodes i les arestes generats, més un enllaç **Open workflow** que obre l'editor de Workflows en una pestanya nova del navegador. Utilitzeu el botó **Run** de la targeta de previsualització quan vulgueu executar el Workflow.

Els comentaris de seguiment al mateix xat editen aquest Workflow en lloc de crear-ne un altre. Per exemple, després que el Chat creï un Workflow podeu dir "add an approval step", "change the output format" o "şöyle yap" i el Chat actualitza el Workflow desat i refresca la previsualització.

Això és ideal per a sol·licituds en què voleu que la feina es faci com una automatització reutilitzable, no només com una resposta puntual.

## Creació de tasques Kanban

Demaneu-ho al Chat en llenguatge natural, per exemple, "Add a task called Fix login bug" o "Create a new card Update documentation on the Launch board." Podeu incloure una descripció a la mateixa sol·licitud. El Chat sempre crea la targeta a la primera columna del tauler seleccionat.

Si el vostre espai de treball té diversos taulers i no n'identifiqueu cap, el Chat es posa en pausa amb un selector de tauler d'opció única. Seleccioneu un tauler per acabar de crear la targeta. No cal cap comanda d'barra ni cap format de missatge especial.

## Consulta de què s'està executant

Pregunteu-ho en llenguatge natural — "what is running?", "how many workflows are active right now?", "which node is the nightly report on?" — i el Chat informa de la situació en directe:

- **Quantes** execucions estan en curs, dividides entre en execució i pendents de revisió humana
- **A quins Workflows** pertanyen, pel seu nom
- **Quant de temps** porta en marxa cada execució (per exemple `1m 35s`, `3h 25m`)
- **Quin Node** s'està executant ara mateix, per la seva etiqueta al llenç, més l'últim Node que ha acabat
- **Un enllaç** a cada execució en directe, que obre el llenç amb aquesta execució reproduint-se

Les execucions en pausa per a una revisió [Human-in-the-Loop](../reference/human-in-the-loop.md) o de Codex es reporten com a pendents de la vostra intervenció, no com a en execució. Són les mateixes dades que la insígnia d'execucions actives de la capçalera, de manera que el Chat i la insígnia mai no es contradiuen. Per a execucions que ja han acabat, demaneu les execucions recents — això llegeix l'[Execution History](../reference/execution-history.md).

## Preguntar sobre una execució

Seleccioneu una execució de Workflow a l'[Execution History](../reference/execution-history.md#ask-ai), des de l'editor o des d'All History, i feu clic a **Preguntar a la IA** al costat del títol del diàleg. Chat obre una nova conversa amb dos xips sobre el quadre de missatge:

- **Workflow:** el nom del Workflow
- **Execution:** els primers caràcters de l'id de l'execució seleccionada

Elimineu un xip amb el seu **×** per excloure'l. Després feu la vostra pregunta, per exemple «per què ha trigat tant aquesta execució?», «què ha fallat aquí?» o «ho podeu solucionar?». Els xips restants s'adjunten a aquest missatge amb els identificadors complets, de manera que Chat llegeix directament les entrades, les sortides i la traça per node de l'execució en lloc de cercar el Workflow. Per corregir el Workflow, Chat desa, prova i verifica el canvi com es descriu a [Creació de Workflows](#creacio-de-workflows).

El missatge enviat mostra els xips sota la vostra pregunta. Pertanyen només a aquest missatge; les preguntes de seguiment a la mateixa conversa mantenen el context de l'historial.

## Consulta sobre alertes

El Chat pot respondre preguntes sobre les [alertes](./alerts-tab.md) que heu definit:

- **Què existeix** — "what alerts do I have?", "is there an alert on the invoice workflow?", "which alerts are firing right now?"
- **Com està configurada una alerta** — "what is the threshold on the cost alert?", "how is that configured?"
- **Per què i quan s'ha activat** — "why did the cost alert fire?", "when did this last trigger?"

Per a una pregunta de "per què s'ha activat", el Chat llegeix el registre d'activació i cita el valor real observat, el llindar i la finestra exacta que s'ha avaluat, més el detall contribuent: identificadors d'execució fallits i missatges d'error per a alertes d'error, despesa per model per a alertes de cost, o el desglossament per origen de Trigger per a alertes de recompte d'execucions. Informa del que era cert quan l'alerta es va activar en lloc de recalcular la finestra, perquè la finestra ja ha passat i un càlcul nou pot donar una resposta diferent.

## Regles d'usuari

Les [User Rules](../reference/user-settings.md) (configurades a Settings) s'injecten automàticament a cada conversa de Chat com a instruccions a nivell de sistema. Configureu-les una vegada per aplicar preferències persistents a totes les sol·licituds de xat.
## Relacionat

- [MCP Tab](./mcp-tab.md) – Exposeu aquest motor als clients MCP com l'eina `heym_chat`
- [Settings](../reference/user-settings.md) – Definiu les User Rules aplicades a totes les sol·licituds de xat
- [Credentials Tab](./credentials-tab.md) – Afegiu i gestioneu claus API
- [Variables Tab](./global-variables-tab.md) – Variables globals disponibles per al xat
- [Node Types](../reference/node-types.md) – Nodes LLM i Agent per a workflows
- [Agent Node](../nodes/agent-node.md) – Agent d'IA amb crida d'eines
- [AI Assistant](../reference/ai-assistant.md) – Assistent de l'editor impulsat pel mateix DSL de construcció de workflows
- [Execution History](../reference/execution-history.md) – Consulteu les execucions anteriors (botó History a la capçalera)
- [Scheduled Tab](./scheduled-tab.md) – Calendari de properes execucions cron (les mateixes dades que el xat pot resumir)
- [Alerts Tab](./alerts-tab.md) – Alertes de llindar que el xat pot llistar i explicar
- [Contextual Showcase](../reference/contextual-showcase.md) – Orientació compacta dins de l'aplicació per a aquesta pàgina
- [Chat Voice (TTS & STT)](../reference/chat-voice.md) – Llegiu missatges en veu alta i parleu mans lliures amb ElevenLabs

## Crides d'eines i mida del context

Cada vegada que l'assistent invoca una eina (executar un workflow, llistar execucions, construir un workflow nou), apareix una targeta plegable a la conversa. La targeta s'expandeix automàticament mentre l'eina s'executa, mostrant els arguments exactes. Quan l'eina acaba, la targeta es plega en un resum d'una línia amb el temps transcorregut. Feu clic a qualsevol targeta per tornar a expandir els arguments i el resum de la resposta.

Una petita insígnia circular sota el camp d'entrada mostra l'ús actual del context com a percentatge de la finestra del model (p. ex. `12% · ~9.2k`). Passeu el cursor per sobre la insígnia per veure'n el desglossament: system prompt, AGENTS.md, bloc de workflows, user rules, historial i l'esborrany d'entrada. Quan l'ús supera el 80%, l'anell es torna ambre; al 95%, es torna vermell.

Si l'ús s'acosta al límit, Heym comprimeix automàticament els missatges més antics en un resum breu mitjançant el mateix mecanisme que utilitzen els nodes Agent. Apareix una targeta "Context compressed" en línia per mostrar què ha passat.
