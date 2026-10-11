# Node Agent

El node **Agent d'IA** és un node LLM amb crida d'eines. Pot executar eines de Python, cridar nodes del canvas connectats com a eines, connectar-se a servidors MCP, utilitzar skills, actuar opcionalment com a orquestrador que delega en altres nodes agent, cridar altres workflows com a eines i posar-se en pausa per a la [revisió humana](../reference/human-in-the-loop.md).

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1, més un `review` opcional quan HITL està habilitat |
| Sortida | `$nodeLabel.text`, `$nodeLabel.fieldName` (quan la sortida JSON està habilitada), o un payload HITL pendent mentre s'espera la revisió |

## Paràmetres principals

### Credencial i model

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial LLM (clau API) de Configuració |
| `model` | string | Nom del model (p. ex. `gpt-4o`, `gemini-2.5-flash-lite`) |
| `fallbackCredentialId` | UUID (opcional) | Credencial de reserva quan la principal falla |
| `fallbackModel` | string (opcional) | Model de reserva quan el principal falla |

Afegiu credencials a la pestanya [Credencials](../tabs/credentials-tab.md). La llista de models es carrega des de la credencial seleccionada. Si la credencial o el model principal retorna un error, el node reintenta automàticament amb la credencial i el model de reserva abans de fallar.

### Prompts

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `systemInstruction` | string | Prompt de sistema per a la IA. Admet [expressions](../reference/expression-dsl.md). |
| `userMessage` | string | Missatge/prompt d'usuari. Per defecte: `$input.text` |
| `jsonOutputEnabled` | boolean | Sortida JSON estructurada |
| `jsonOutputSchema` | string | Esquema JSON per a la sortida estructurada |
| `extraBodyEnabled` | boolean | Envia paràmetres de sol·licitud específics del proveïdor (per defecte: `false`) |
| `extraBody` | string | Objecte JSON fusionat a cada sol·licitud API que fa l'agent |

Utilitzeu `$input.text`, `$nodeName.field` i altres sintaxis del [DSL d'expressions](../reference/expression-dsl.md).

### Models de raonament (o1, o3)

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `temperature` | number | 0.0–2.0 (per defecte: 0.7), per a models estàndard |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Profunditat de raonament per a models de raonament |

Quan utilitzeu un model de raonament (p. ex. o1, o3), la interfície mostra **Reasoning Effort** en lloc de Temperature. Per als models estàndard, **Temperature** controla la creativitat.

**Exemple de sortida JSON:** Quan necessiteu dades estructurades de l'agent (p. ex. classificació, extracció), habiliteu la sortida JSON i proporcioneu un esquema. L'agent retorna JSON que coincideix amb l'esquema; accediu als camps pel nom a la sortida del node:

```json
{
  "jsonOutputEnabled": true,
  "jsonOutputSchema": "{ \"type\": \"object\", \"properties\": { \"status\": { \"type\": \"string\", \"enum\": [\"APPROPRIATE\", \"INAPPROPRIATE\"] }, \"reason\": { \"type\": \"string\" } }, \"required\": [\"status\", \"reason\"] }"
}
```

Els nodes posteriors poden utilitzar `$agentLabel.status`, `$agentLabel.reason`, etc. Mateix comportament que la sortida JSON del [node LLM](../nodes/llm-node.md).
## Revisió humana (HITL)

Utilitzeu HITL quan un agent pugui necessitar aprovació en moments concrets abans d'accions importants.

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `hitlEnabled` | boolean | Afegeix punts de control de revisió humana a l'agent |
| `hitlSummary` | string | Directrius d'aprovació que indiquen a l'agent quan cal una revisió humana |

Quan HITL està habilitat, l'agent rep una eina `request_human_review`. Utilitzeu el system prompt i
aquest camp de directrius per explicar quines crides d'eines, sub-agents, sub-workflows, accions MCP, skills
o efectes secundaris requereixen aprovació. L'agent pot cridar aquesta eina només quan calgui, incloent-hi múltiples
vegades en una mateixa execució.

El resum adreçat al revisor a la pàgina pública es genera a partir de la sol·licitud de revisió de l'agent en
temps d'execució. Si l'agent no proporciona un resum explícitament, Heym en deriva un a partir del cos de revisió
en Markdown.

Per a les eines MCP, Heym demana al model que interpreti les vostres instruccions HITL escrites com un de tres
àmbits: `always`, `once` o `never`. Això significa que formulacions lliures com "for each call", "only
one time" o "never ask" es normalitzen abans que s'apliqui el control en temps d'execució.

Cada punt de control HITL crea un enllaç de revisió públic d'un sol ús a `/review/{token}`. Un revisor pot:

- **Acceptar** el text de revisió original en Markdown
- **Editar i continuar** amb el Markdown modificat
- **Refusar** i continuar amb `text: ""`

Quan HITL està habilitat, el node també exposa una sortida `review` al canvas. Connecteu aquesta branca a Slack, correu electrònic o altres nodes de notificació si voleu difondre l'URL de revisió i el resum tan bon punt l'execució es posi en pausa.

L'execució passa a `pending` fins que un revisor respon. El text de revisió és un únic cos en Markdown, i el payload pendent també inclou text d'enllaç compartible per a la transferència externa. Els nodes de la branca `review` s'executen immediatament quan es crea la pausa; la ruta de sortida normal només continua després de l'aprovació. Després de l'aprovació, Heym reprèn des de la instantània d'execució emmagatzemada i l'agent continua amb el context aprovat. Si un pas posterior també necessita aprovació, l'agent pot crear un altre punt de control HITL. Vegeu [Human-in-the-Loop](../reference/human-in-the-loop.md) per a la forma del payload, el comportament de l'URL de revisió i la semàntica de represa.

HITL només està disponible per a la sortida d'agent en mode text. A la v1 no es pot combinar amb `jsonOutputEnabled`.


## Mode orquestrador

Quan està habilitat, l'agent pot delegar tasques a altres nodes d'agent del workflow. Si el **mode orquestrador està desactivat**, l'agent **no pot crear connexions agent→agent** al canvas.

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `isOrchestrator` | boolean | Quan és `true`, l'agent rep una eina `call_sub_agent` |
| `subAgentLabels` | string[] | Etiquetes dels nodes d'agent que aquest orquestrador pot cridar |

Els **sub-agents** han d'utilitzar `$input.text` al seu User Message per tal que rebin el prompt de l'orquestrador.

Quan l'orquestrador crida múltiples sub-agents en un sol torn, s'executen en paral·lel. Vegeu [Agent Architecture](../reference/agent-architecture.md) per als detalls.

## Sub-workflows

Quan està configurat, l'agent rep una eina `call_sub_workflow` per executar altres workflows.

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `subWorkflowIds` | string[] | IDs dels workflows que aquest agent pot cridar com a eines |

Seleccioneu workflows a la secció Sub-Workflows de la configuració de l'agent. L'agent els cridarà amb `workflow_id` i `inputs` (objecte que coincideix amb els camps d'entrada del workflow objectiu). Profunditat màxima: 5 crides de sub-workflow niades.

## Eines de node del canvas

Podeu connectar un node de workflow compatible a la sortida **tools** d'un agent per tal que l'agent pugui cridar aquest node en temps d'execució. Això converteix accions i transformacions existents del canvas en eines cridables sense escriure Python.

Utilitzeu eines de node del canvas quan vulgueu que l'agent decideixi quan executar un node configurat, tot mantenint les credencials, els camps estàtics i la configuració específica del workflow a la interfície del node.

### Camps proporcionats per l'agent

Els camps d'un node d'eina connectat es poden marcar amb la icona del bot. Els camps marcats esdevenen paràmetres d'eina obligatoris que l'agent ha de proporcionar quan crida el node. Els camps no marcats romanen fixos i es llegeixen de la configuració del node.

Per exemple:

- Connecteu un node de Slack a un agent com a eina
- Manteniu la credencial fixa al node de Slack
- Marqueu `message` com a proporcionat per l'agent
- L'agent rep una eina de Slack on només proporciona el missatge en temps d'execució

Si el node no està connectat a un agent com a eina, la icona del bot queda oculta i el node es comporta com un pas de workflow normal.
### Comportament en temps d'execució

Quan l'agent crida una eina de node del canvas, Heym fusiona temporalment els arguments proporcionats per l'agent amb les dades d'aquell node, executa el node, retorna la sortida del node a l'agent i, tot seguit, restaura la configuració original del node. Els nodes d'eina no s'executen com a passos habituals del workflow mitjançant la planificació normal; només s'executen quan l'agent els crida.

Les eines de node del canvas són útils amb nodes d'integració com ara Slack, Telegram, HTTP, Send Email, i nodes de transformació de dades com [Set](./set-node.md). Els nodes Trigger, els nodes de flux de control i els mappers de sortida terminal ([JSON output mapper](./json-output-mapper-node.md), [HTML output mapper](./html-output-mapper-node.md)) no es poden utilitzar com a eines de l'agent.

## Eines de Python

Definiu eines personalitzades que l'agent pugui cridar. Cada eina té:

| Camp | Tipus | Descripció |
|-------|------|-------------|
| `name` | string | Nom de l'eina (p. ex. `count_characters`) |
| `description` | string | Descripció per al LLM |
| `parameters` | JSON Schema | Esquema de crida de funcions d'OpenAI (format d'objecte) |
| `code` | string | Codi de la funció de Python |

**Parameters** ha de ser un objecte JSON, no una cadena:

```json
{
  "type": "object",
  "properties": {
    "text": { "type": "string", "description": "Text to count" }
  },
  "required": ["text"]
}
```

**Eina d'exemple:**

```python
def count_characters(text: str) -> int:
    return len(text)
```

> **Sandbox.** Les eines de Python s'executen com a codi no fiable en un contenidor Docker aïllat i endurit per defecte (sense xarxa, sense socket de Docker, sistema de fitxers de només lectura, sense root). Les importacions es limiten a una llista permesa de mòduls segurs de la biblioteca estàndard. Consulteu [Security → Python Tool Sandbox](../reference/security.md#python-tool-sandbox) per a la configuració (`HEYM_PYTHON_TOOL_SANDBOX`).

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `toolTimeoutSeconds` | number | Nombre màxim de segons per execució d'eina (per defecte: 30) |
| `requestTimeoutSeconds` | number | Nombre màxim de segons d'espera per a cada resposta del model abans d'esgotar el temps d'espera (per defecte: 60). Augmenteu-lo per a proveïdors lents o autoallotjats (LiteLLM, vLLM, models locals) i execucions llargues de diversos passos. |
## Connexions MCP

Connecteu-vos als servidors de [Model Context Protocol](https://modelcontextprotocol.io/) per exposar les seves eines a l'agent.

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `transport` | `"stdio"` \| `"sse"` \| `"streamable_http"` | Tipus de connexió |
| `timeoutSeconds` | number | Temps d'espera per a aquesta connexió (per defecte: 30) |
| `label` | string | Nom de visualització opcional |

**stdio** (procés local):

| Camp | Descripció |
|-------|-------------|
| `command` | Comanda a executar (p. ex. `npx`) |
| `args` | Array JSON (p. ex. `["-y", "@modelcontextprotocol/server-filesystem", "--path", "/tmp"]`) |
| `env` | Objecte JSON de variables d'entorn injectades al procés (p. ex. `{"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."}`) |

La majoria de servidors stdio amb clau d'API s'autentiquen mitjançant variables d'entorn en lloc d'arguments de comanda. Configureu `env` per connexió perquè cada node d'agent pugui utilitzar una credencial diferent sense modificar l'entorn de l'amfitrió.

Els valors d'`env` admeten [Expression DSL](../reference/expression-dsl.md), de manera que podeu passar entrades del workflow com a credencials en lloc d'incrustar secrets directament:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

L'expressió `$userInput.pat` es resol en temps d'execució contra les dades d'entrada del workflow abans que s'iniciï el procés MCP. Això us permet acceptar tokens des d'un trigger o node d'entrada en lloc d'incrustar-los a la definició del workflow.

Exemple — GitHub MCP amb token incrustat:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx" }
}
```

Exemple — GitHub MCP amb token dinàmic provinent de l'entrada del workflow:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Exemple — GitHub MCP amb una credencial GitHub de Heym:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$credentials.MyGitHubToken" }
}
```

La credencial GitHub integrada actualment està orientada a l'autenticació basada en PAT. Si necessiteu accés d'organització, utilitzeu un PAT amb els permisos d'organització/repositori necessaris.

Exemple — Slack MCP:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": { "SLACK_BOT_TOKEN": "xoxb-...", "SLACK_TEAM_ID": "T0123456" }
}
```

**SSE** (servidor remot):

| Camp | Descripció |
|-------|-------------|
| `url` | URL de l'endpoint SSE. Admet expressions (p. ex. `$userInput.serverUrl`). |
| `headers` | Objecte JSON per a capçaleres d'autenticació/personalitzades. Els valors admeten expressions. |

**Streamable HTTP** (servidor remot):

| Camp | Descripció |
|-------|-------------|
| `url` | URL de l'endpoint MCP (p. ex. `https://example.com/mcp`). Admet expressions. |
| `headers` | Objecte JSON per a capçaleres d'autenticació/personalitzades. Els valors admeten expressions. |

## Skills

Les Skills són instruccions SKILL.md més fitxers Python opcionals i recursos empaquetats. Amplien el context del sistema de l'agent i poden afegir eines Python.

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `name` | string | Nom de la skill |
| `content` | string | Contingut de SKILL.md (instruccions) |
| `timeoutSeconds` | number | Temps d'espera per a l'execució Python de la skill (per defecte: 30) |
| `driveFilesEnabled` | boolean | Habilita l'ajudant `heym_drive` en temps d'execució per a aquesta skill (per defecte: false) |
| `files` | array | Entrades opcionals `{ path, content, encoding, mimeType }` (p. ex. scripts `.py` o recursos binaris emmagatzemats com a base64) |

Les Skills es poden afegir arrossegant un fitxer `.zip` o `.md` a l'àrea de Skills.
Després d'expandir una targeta de skill, arrossegueu qualsevol fitxer sobre aquesta skill per adjuntar o substituir un fitxer empaquetat, incloent-hi recursos binaris com PDFs i imatges.
Utilitzeu el botó de descàrrega d'una targeta de skill per exportar aquesta skill com a arxiu `.zip` per a còpia de seguretat o reutilització en un altre workflow.

Habiliteu **Drive files** en una skill només quan el seu codi Python necessiti llegir fitxers de Heym Drive. Les skills habilitades reben un ajudant `heym_drive.py` generat en temps d'execució i poden cridar `list_drive_files`, `get_drive_file`, `get_drive_file_path`, `read_drive_file`, `read_drive_text` o `read_drive_base64` amb un id de fitxer de Drive o un nom de fitxer exacte. La cerca per nom de fitxer utilitza la coincidència accessible més recent. Les skills deshabilitades no reben l'ajudant.

Cada targeta de skill té quatre accions a la fila sota el títol:

| Botó | Descripció |
|--------|-------------|
| **Edit with AI** | Obre Skill Builder per revisar la skill des d'un prompt de chat |
| **Download** | Exporta la skill com a arxiu `.zip` |
| **Remove** | Elimina la skill d'aquest node d'agent |
| **History** | Obre l'historial de la skill derivat de [Edit History](../reference/edit-history.md) |
### Historial d'habilitats

L'historial d'habilitats **no** s'emmagatzema per separat. Es deriva de les instantànies de l'Historial d'edicions del workflow: cada versió desada del workflow inclou l'array complet `skills` del node agent.

Des del diàleg Historial podeu:

- **Previsualitzar** una instantània anterior (SKILL.md i llista de fitxers)
- **Editar** — carregar una instantània a l'editor d'habilitats sense revertir tot el workflow
- **Ajust fi amb IA** — obrir el Skill Builder amb aquesta instantània com a punt de partida
- **Revertir** — restaurar només aquesta habilitat des d'una versió anterior (la resta de nodes es mantenen tal com estan)

L'historial segueix la mateixa retenció de 7 dies que l'Historial d'edicions del workflow. Desar el workflow després d'editar habilitats crea noves entrades a l'historial.

La secció Habilitats també inclou **Creació amb IA**:

- Feu clic a **Creació amb IA** per crear una habilitat nova a partir d'un prompt de xat
- Feu clic al botó de destell sobre una habilitat existent per revisar-la amb IA
- Arrossegueu fitxers al compositor del prompt per adjuntar-los al comentari d'ajust fi; aquests fitxers també es desen com a recursos adjunts de l'habilitat
- El modal transmet el text de l'assistent mentre mostra previsualitzacions en directe dels fitxers `SKILL.md` i `.py`
- **Baixa ZIP** exporta la previsualització actual sense afegir-la al node
- **Desa i afegeix** desa els fitxers generats mitjançant el mateix flux d'anàlisi ZIP que utilitzen les càrregues manuals

Quan editeu amb IA, Heym només envia fitxers d'habilitat de text `.md` i `.py` al builder. Els adjunts binaris i altres adjunts no editables es preserven i es comparteixen amb el builder com a metadades de ruta perquè el codi Python generat pugui mantenir correctes les referències relatives als fitxers.
Seleccioneu un fitxer adjunt al panell dret i activeu **Inclou aquest fitxer al context d'IA** quan la IA necessiti inspeccionar una plantilla adjunta. Els fitxers de text, PDF i DOCX s'extreuen al context del prompt quan és possible; Heym no aplica cap límit de mida d'adjunt específic del Skill Builder més enllà del límit del cos de la sol·licitud de la plataforma.

## Cos addicional

Alguns proveïdors accepten paràmetres de sol·licitud que els camps estàndard compatibles amb OpenAI no
cobreixen, com ara desactivar el mode de pensament d'un model. Marqueu **Envia cos de sol·licitud addicional** a les propietats del node i introduïu un objecte JSON.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Desactivat per defecte.** Amb la casella desmarcada, no s'envia res addicional.
- S'aplica a **cada** sol·licitud del bucle de crida d'eines, no només al primer torn, més l'intent del model de reserva. No s'aplica a les comprovacions de guardrails, que utilitzen un model separat.
- Ha de ser un **objecte** JSON. Un array, un escalar o text mal format fan fallar el node amb `Invalid extra body JSON` en lloc de descartar-se silenciosament.
- Les expressions `$` es resolen abans de l'anàlisi. Com que es tracta d'una substitució textual, un valor resolt que contingui una cometa doble o un salt de línia produeix JSON no vàlid i fa fallar el node.

Mateix camp i comportament que el cos addicional del [node LLM](./llm-node.md).

## Guardrails

Activeu **Guardrails** a les propietats del node per bloquejar missatges d'usuari no segurs abans que s'executi l'agent. Consulteu [Guardrails](../reference/guardrails.md) per a la referència completa.

## Memòria persistent (graf)

Graf de coneixement opcional **per node agent** emmagatzemat a la base de dades. Quan està activat, Heym afegeix un resum en Markdown de les entitats i relacions recordades a la **instrucció del sistema** abans de cada execució (només si el graf no és buit). Després d'una compleció **correcta** de l'agent, una tasca en segon pla extreu nous fets duradors de la conversa i els fusiona al graf.

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Activa la càrrega i l'extracció en segon pla per a aquest node del canvas |

Els **subagents** mantenen el seu **propi** graf (indexat pel seu node id), separat del de l'orquestrador.

Utilitzeu el control rosa de **cervell** del node (quan la memòria està activada o es mostra la fila del model) per obrir l'editor del graf i la **compartició de memòria** opcional (altres workflows/agents). Comportament complet, rutes REST i detalls de l'exportació JSON: [Memòria persistent de l'agent](../reference/agent-persistent-memory.md).
## API de Responses i continuïtat del raonament

Una casella de selecció **Use Responses API** encamina les crides al model de l'agent a través de
l'[API de Responses](https://platform.openai.com/docs/api-reference/responses) en lloc de Chat
Completions. Està desactivada per defecte.

Té una importància especial en un model de raonament com ara `gpt-5` o la sèrie `o`. L'API de Responses retorna
el raonament del model juntament amb cada crida d'eina, i l'agent torna a introduir aquests elements de raonament
en el torn següent, de manera que el model manté la seva cadena de pensament al llarg d'un bucle d'eines de diversos passos
en lloc de tornar-la a derivar després de cada resultat d'eina. Tot el bucle s'executa sobre el mateix camí, incloent-hi
la pausa i represa de la [revisió humana](#human-review-hitl), la [compressió de context](#context-compression),
i la resposta final.

La conversa mateixa roman a Heym. Heym envia l'entrada completa a cada torn i transporta el
raonament com un blob xifrat, de manera que no es reté res al costat del proveïdor entre crides.
Els elements de raonament dins d'un interval que la compressió de context resumeix es descarten juntament amb aquest, atès que
un blob xifrat no es pot resumir.

Funciona amb una credencial d'OpenAI, i amb una credencial personalitzada la passarel·la de la qual admeti el
endpoint. Amb una credencial de Google roman desactivada.

## Compressió de context

Quan un agent executa moltes iteracions d'eines amb resultats grans (web scraping, lectures de documents, sortides de sub-workflow), l'historial de missatges acumulat pot apropar-se al límit de la finestra de context del model. Heym comprimeix automàticament l'historial de la conversa a mig executar per evitar el desbordament de context.

**Com funciona:**

1. Abans de cada iteració d'eina, Heym estima el recompte de tokens actual (~4 caràcters per token).
2. Si l'estimació supera el **80%** de la finestra de context del model, s'activa la compressió.
3. L'historial de missatges es divideix en seccions preservades i comprimides:
   - **Preservades**: prompt del sistema, primer missatge de l'usuari, missatge de l'usuari més recent
   - **Comprimides**: tota la resta (torns de raonament de l'assistent, crides d'eines, resultats d'eines)
4. La secció intermèdia se sintetitza utilitzant el **mateix model i credencial** — no cal cap configuració addicional.
5. El resum comprimit substitueix la part intermèdia com un únic missatge de l'assistent.

**Observabilitat:**

Els esdeveniments de compressió apareixen com a entrades `Context compressed (N messages → summary)` a:
- La llista de crides d'eines del **panell de Debug** durant l'execució en directe
- La vista de detall de l'execució de l'**Historial d'execucions**
- La **pestanya Traces** com una entrada de traça `context.compression`

La compressió és automàtica i sempre activa per als nodes Agent. **No** s'aplica als nodes LLM, a la pestanya Chat ni a les sessions de l'Assistent d'IA.

## Relacionat

- [Per què Heym](../getting-started/why-heym.md) – Com s'executen els agents i es mantenen governats en producció
- [Memòria persistent de l'agent](../reference/agent-persistent-memory.md) – Graf de coneixement per node d'agent, compartició opcional, API, editor
- [Arquitectura de l'agent](../reference/agent-architecture.md) – Sub-agents, orquestrador, habilitats, MCP, crida d'eines
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Pàgines de revisió públiques, execucions pendents, flux d'aprovar/editar/refusar
- [Guardrails](../reference/guardrails.md) – Bloqueja categories de contingut insegur
- [Tipus de nodes](../reference/node-types.md) – Visió general de tots els tipus de nodes
- [Assistent d'IA](../reference/ai-assistant.md) – Interfície de Chat per construir workflows amb llenguatge natural (diferent del node Agent)
- [DSL d'expressions](../reference/expression-dsl.md) – Referenciar dades en prompts
- [Estructura del workflow](../reference/workflow-structure.md) – Nodes, arestes i format DSL
- [Inici ràpid](../getting-started/quick-start.md) – Workflow bàsic amb LLM i expressions
- [Pestanya Credencials](../tabs/credentials-tab.md) – Afegir claus d'API per a l'agent
- [Pestanya MCP](../tabs/mcp-tab.md) – Configurar MCP per a eines de workflow
