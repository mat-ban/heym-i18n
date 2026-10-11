# Pestanya MCP

La pestanya **MCP** configura la integració del Model Context Protocol (MCP). MCP permet que els clients d'IA (Claude, Cursor i qualsevol eina compatible amb MCP) cridin els vostres workflows de Heym com a eines.

Heym admet dos modes: un **servidor predeterminat** que exposa tots els workflows habilitats per a MCP sota un únic endpoint, i **servidors amb nom** que atorguen a cada grup lògic de workflows la seva pròpia URL dedicada i la seva clau API.

Tots dos modes poden exposar dos tipus d'eines: **workflows** individuals i l'**eina de xat de Heym** — tot el motor de la [pestanya Chat](./chat-tab.md) darrere d'una única eina `heym_chat`.

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Watch MCP demo</a></p>

## Servidor MCP predeterminat

El servidor predeterminat sempre està disponible a `{origin}/api/mcp/sse`. Tots els workflows amb MCP activat apareixen com a eines aquí.

### Clau API MCP

- Les claus s'emmagatzemen com a resums SHA-256, de manera que Heym no us pot mostrar una clau existent. La pestanya indica si n'hi ha una de configurada, no quina és.
- **Generate** / **Regenerate** – La nova clau es mostra una sola vegada, just després de crear-la. Copieu-la en aquell moment; en recarregar la pestanya s'amaga definitivament.
- Utilitzeu aquesta clau quan connecteu Claude Desktop, Cursor o altres clients MCP a Heym
- Heu perdut una clau? Regeneu-la. La clau anterior deixa de funcionar immediatament.

### Mètodes de connexió

- **API Key** – Utilitzeu la clau API MCP per a connexions programàtiques. La pestanya pot copiar una configuració JSON a punt per utilitzar i inclou un botó **Add to Cursor** per a la configuració de Cursor amb un sol clic.
- **Claude** – La pestanya mostra la URL del servidor MCP i els passos de configuració per a Claude. Deixeu en blanc l'OAuth Client ID i el Secret; Claude es registra automàticament i s'autentica mitjançant Heym OAuth.

### Commutador MCP del workflow

Cada workflow es pot exposar com a eina MCP:

- **Enable** – Les eines del workflow esdevenen disponibles per a tots els clients connectats al servidor predeterminat
- **Disable** – El workflow no s'exposa

Les targetes de workflow mostren la descripció i una previsualització dels noms dels camps d'entrada perquè pugueu veure què espera cada eina abans d'habilitar-la.

## Eina de xat de Heym

La secció **Heym Capabilities** converteix el motor de la pestanya Chat en una única eina MCP anomenada `heym_chat`. Habilitau-la al servidor predeterminat, a qualsevol servidor amb nom o a tots dos — cada superfície manté el seu propi commutador i la seva pròpia selecció de model.

Quan està activada, `heym_chat` apareix a `tools/list` juntament amb les eines dels vostres workflows. Un client MCP envia un sol missatge en llenguatge natural i el motor de Heym s'encarrega de la resta, amb les mateixes capacitats que té la pestanya Chat:

- Crea, edita, inspecciona i executa workflows mitjançant el Workflow AI Builder
- Informa sobre analítiques, execucions recents i properes programacions cron
- Informa sobre l'historial d'execució d'un workflow: quantes vegades s'ha executat, recomptes d'estats, quan s'ha executat i, si es demana, les entrades, les sortides i els errors per Node d'una única execució
- Informa sobre què s'està executant en aquest moment: quantes execucions estan actives, els noms dels seus workflows, quant de temps porta en execució cadascuna, el Node en què es troba actualment i un enllaç a l'execució en directe
- Llista taulers, crea targetes i llegeix el detall de les targetes a la [pestanya Board](./board-tab.md)
- Llista les vostres taules de dades amb les seves columnes, en crea de noves i les connecta als workflows que construeix
- Llegeix equips i variables globals, i cerca a la documentació
- Aprova, edita o rebutja revisions pendents de human-in-the-loop

Les capacitats afegides posteriorment a la pestanya Chat esdevenen disponibles automàticament a través de `heym_chat` — no hi ha cap commutador per capacitat que s'hagi de mantenir sincronitzat.

Les credencials es queden a la interfície d'usuari: `heym_chat` mai les llista, les tria ni les crea. Quan construeix o edita un workflow, els Nodes nous que necessiten una credencial es deixen buits i la resposta els anomena, de manera que els podeu configurar a l'editor.

Les taules de dades són diferents. Una taula no conté cap secret, de manera que `heym_chat` pot llistar les vostres taules, preguntar quina ha d'utilitzar un workflow i crear-ne una de nova amb les seves columnes. Mai llegeix ni escriu files.

### Credencial i model

`heym_chat` executa el motor al vostre compte de Heym, de manera que necessita una credencial LLM pròpia:

| Camp | Comportament |
|-------|----------|
| **Credential** | Trieu qualsevol credencial d'OpenAI, Google o Custom a la qual tingueu accés. Es preomple amb la credencial preferida de [Settings](../reference/user-settings.md) quan no n'heu triat cap. |
| **Model** | Es carrega des de la credencial seleccionada. Es preomple amb el vostre model preferit quan la credencial coincideix. |

Si falta qualsevol dels dos, l'eina encara apareix a `tools/list`, però cada crida retorna un error que us indica que completeu la configuració en aquesta pestanya.

### Arguments i historial

| Argument | Obligatori | Descripció |
|----------|----------|-------------|
| `message` | Sí | La instrucció o pregunta, en llenguatge natural. |
| `conversation_id` | No | Un `conversation_id` d'un resultat anterior de `heym_chat`, per continuar aquell fil. |

Cada crida s'escriu al vostre historial de la [pestanya Chat](./chat-tab.md) com una conversa normal, marcada amb una icona d'endoll a la llista de converses. Els missatges, les targetes d'eines i les pauses de clarificació es veuen exactament com una conversa que hàgiu iniciat vosaltres mateixos, i podeu obrir el fil i continuar parlant al navegador. Cada resultat retorna el seu `conversation_id` perquè el client MCP pugui continuar el mateix fil en lloc d'obrir-ne un de nou a cada crida.

Quan l'assistent necessita una aclariment, fa una pausa i ho indica; responeu amb les respostes utilitzant el mateix `conversation_id`.
## Servidors MCP amb nom

Els servidors amb nom permeten segmentar els workflows en endpoints MCP aïllats. Cada servidor té la seva pròpia URL i clau API, de manera que diferents clients d'IA, equips o casos d'ús poden connectar-se exactament als workflows que necessiten.

### Creació d'un servidor amb nom

1. Escriviu un nom al camp d'entrada a la part inferior de la pestanya MCP (p. ex. **CRM Tools**)
2. Feu clic a **Create** — apareix immediatament una targeta de servidor nova
3. Feu clic a la targeta per desplegar-la

### Configuració per servidor

Cada targeta de servidor mostra:

| Configuració | Descripció |
|---------|-------------|
| **SSE Endpoint** | URL única: `{origin}/api/mcp/servers/{uuid}/sse` |
| **API Key** | Clau independent, mostrada una sola vegada en generar-se o regenerar-se. Copieu-la de seguida; s'emmagatzema amb hash i no es pot revelar posteriorment |
| **How to connect** | **Copy JSON** copia la configuració MCP a punt per enganxar; **Add to Cursor** la instal·la amb un sol clic |
| **Heym Capabilities** | Activeu o desactiveu l'eina `heym_chat` per a aquest servidor i trieu-ne la credencial i el model |
| **Assigned Workflows** | Activeu o desactiveu quins dels vostres workflows exposa aquest servidor |

### Assignació de workflows

L'assignació de workflows és per servidor i independent de l'activació del servidor per defecte. Un workflow es pot activar al servidor per defecte i a diversos servidors amb nom simultàniament, o a cap.

En activar o desactivar un workflow, aquest es mou a la part superior de la llista assignada, de manera que la fila que acabeu de canviar romangui visible en lloc de desaparèixer en fer scroll.

### Autenticació

Els servidors amb nom admeten els mateixos mètodes d'autenticació que el servidor per defecte:

- **Capçalera X-MCP-Key** – Passeu la clau API del servidor directament (clients API, Cursor). Només per capçalera: les claus no s'accepten com a paràmetre de consulta `?key=`, perquè les URL acaben als registres d'accés, als registres de proxy i a l'historial del navegador.
- **Claude OAuth** – Afegiu la URL del servidor a les integracions de Claude; deixeu les credencials en blanc i Claude es registrarà automàticament via OAuth. El bearer token ha de viatjar a la capçalera `Authorization`, no com a `?token=`.
- **Session token** – Emès durant l'handshake SSE; limitat al servidor específic, de manera que els tokens d'un servidor amb nom no poden accedir a un altre. Aquest paràmetre `?session=` de curta durada no es veu afectat.

### Eliminació d'un servidor amb nom

Feu clic a la icona **X** a la capçalera d'una targeta de servidor. L'eliminació suprimeix el servidor i totes les seves assignacions de workflows; els workflows en si no es veuen afectats.

## SSE Endpoint

| Servidor | Endpoint |
|--------|----------|
| Per defecte | `{origin}/api/mcp/sse` |
| Amb nom | `{origin}/api/mcp/servers/{server-uuid}/sse` |

Tots dos endpoints admeten el transport SSE (GET, especificació MCP 2024-11-05) i el transport Streamable HTTP (POST, especificació MCP 2025-03-26). Claude utilitza OAuth 2.1 / PKCE per a l'inici de sessió segur en tots dos.

## Relacionat

- [Why Heym](../getting-started/why-heym.md) – MCP com a primitiva de primera classe a Heym
- [Agent Node](../nodes/agent-node.md) – Node Agent amb suport d'eines MCP
- [Agent Architecture](../reference/agent-architecture.md) – Client MCP, enviament d'eines, orquestrador
- [Triggers](../reference/triggers.md) – MCP com a punt d'entrada de workflow
- [Chat Tab](./chat-tab.md) – El motor darrere de l'eina `heym_chat`
- [Workflows Tab](./workflows-tab.md) – Creeu i gestioneu workflows
- [Node Types](../reference/node-types.md) – Visió general dels Nodes d'IA
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia compacta de pàgina per a superfícies del tauler
