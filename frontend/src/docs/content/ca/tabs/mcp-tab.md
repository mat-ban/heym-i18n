# Pestanya MCP

La pestanya **MCP** configura la integració del Model Context Protocol (MCP). MCP permet que els clients d'IA (Claude, ChatGPT, Gemini, Cursor i qualsevol eina compatible amb MCP) cridin els vostres workflows de Heym com a eines.

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
- **ChatGPT** – La pestanya mostra la URL del servidor MCP i els passos de configuració per a una aplicació de ChatGPT. Activeu el mode de desenvolupador, creeu una aplicació amb la URL i trieu OAuth; ChatGPT es registra automàticament.
- **Gemini** – La pestanya mostra la URL del servidor MCP i els passos de configuració per a una aplicació personalitzada de Gemini: a gemini.google.com, aneu a **Settings → Connected Apps → Add a custom app**, enganxeu la URL i deixeu **Advanced features** tancat; Gemini es registra automàticament i s'autentica mitjançant Heym OAuth. Un cop connectat, Heym també funciona a l'aplicació mòbil de Gemini.

### Commutador MCP del workflow

Cada workflow es pot exposar com a eina MCP:

- **Enable** – Les eines del workflow esdevenen disponibles per a tots els clients connectats al servidor predeterminat
- **Disable** – El workflow no s'exposa

Les targetes de workflow mostren la descripció i una previsualització dels noms dels camps d'entrada perquè pugueu veure què espera cada eina abans d'habilitar-la.


### Execucions en cua i heym_execution_status

Un workflow amb un [límit de concurrència](../reference/webhooks.md#concurrency-limit-and-queued-runs) pot estar ocupat quan un client el crida. La crida retorna immediatament un resultat que no és un error:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "next_step": "Call heym_execution_status with this execution_id every 5-10 seconds until status is success, error, cancelled or expired."
}
```

El client sondeja l'eina `heym_execution_status` amb aquest `execution_id`. Retorna el mateix cos que l'[URL d'estat](../reference/webhooks.md#status-url): `queued` amb la posició actual, `running`, i després `success` o `error` amb les sortides. Només troba execucions de workflows exposats pel mateix servidor. L'eina apareix al servidor per defecte i a cada servidor amb nom només mentre almenys un dels seus workflows tingui un límit de concurrència. Quan la cua del workflow està plena, la crida retorna l'error "Concurrency queue is full".
## Eina de xat de Heym

La secció **Heym Capabilities** converteix el motor de la pestanya Chat en una única eina MCP anomenada `heym_chat`. Habilitau-la al servidor predeterminat, a qualsevol servidor amb nom o a tots dos — cada superfície manté el seu propi commutador i la seva pròpia selecció de model.

Quan està activada, `heym_chat` apareix a `tools/list` juntament amb les eines dels vostres workflows. Un client MCP envia un sol missatge en llenguatge natural i el motor de Heym s'encarrega de la resta, amb les mateixes capacitats que té la pestanya Chat:

- Crea un workflow, executa'l en prova amb entrades d'exemple, corregeix-lo i finalitza quan una execució passi correctament (vegeu [Mode de construcció](#build-mode))
- Inspecciona i executa els vostres workflows existents
- Informa sobre analítiques, execucions recents i properes programacions cron
- Informa sobre l'historial d'execució d'un workflow: quantes vegades s'ha executat, recomptes d'estats, quan s'ha executat i, si es demana, les entrades, les sortides i els errors per Node d'una única execució
- Informa sobre què s'està executant en aquest moment: quantes execucions estan actives, els noms dels seus workflows, quant de temps porta en execució cadascuna, el Node en què es troba actualment i un enllaç a l'execució en directe
- Llista taulers, crea targetes i llegeix el detall de les targetes a la [pestanya Board](./board-tab.md)
- Llista les vostres taules de dades amb les seves columnes, en crea de noves i les connecta als workflows que construeix
- Crear o actualitzar les vostres credencials a la pàgina pròpia de Heym (vegeu [Credencials](#credencials))
- Llegeix equips i variables globals, i cerca a la documentació
- Aprova, edita o rebutja revisions pendents de human-in-the-loop

Les capacitats afegides posteriorment a la pestanya Chat esdevenen disponibles automàticament a través de `heym_chat` — no hi ha cap commutador per capacitat que s'hagi de mantenir sincronitzat.

### Mode de construcció

`heym_chat` sempre executa el motor del Chat en mode de construcció. En una sola crida, l'assistent pot desar un workflow nou, executar-lo amb entrades d'exemple realistes, llegir l'informe d'execució, corregir el que hagi fallat i tornar-lo a executar, fins a cinc execucions de prova per crida. Quan l'última execució de l'últim desament té èxit, acaba amb un resum d'una frase i la resposta finalitza amb `Verified: the latest test run of the saved workflow passed.`

Quan una crida crea o edita un workflow, la resposta llista cadascun amb el seu enllaç complet a l'editor, com ara `https://heym.example.com/workflows/<id>`, i els enllaços dins de la resposta de l'assistent també són enllaços complets. Utilitzen la vostra adreça Heym configurada (`FRONTEND_URL`) i s'obren per a les persones que han iniciat sessió a Heym i tenen accés a aquest workflow.

- Les execucions de prova són execucions reals. Els seus efectes secundaris tenen lloc i apareixen a l'historial d'execucions del workflow com qualsevol altra execució.
- Els desaments segueixen el camí de l'editor: un canvi al graf conserva el graf anterior a l'**Edit History** del workflow.
- Per modificar un workflow construït anteriorment, continueu el fil amb el mateix `conversation_id`. L'assistent actualitza aquest workflow en lloc de crear-ne un de nou, i només modifica els workflows que podeu editar.
- Quan s'esgoten les cinc execucions de prova, l'assistent s'atura i explica què continua fallant.

Les taules de dades són diferents. Una taula no conté cap secret, de manera que `heym_chat` pot llistar les vostres taules, preguntar quina ha d'utilitzar un workflow i crear-ne una de nova amb les seves columnes. Mai llegeix ni escriu files.

### Credencials

`heym_chat` veu les credencials que teniu i les compartides amb vós, per nom i tipus, de la mateixa manera que la pestanya Chat. Quan un workflow que construeix necessita una credencial, pregunta quina utilitzar mitjançant una pregunta al resultat. Responeu-la amb el mateix `conversation_id`.

Per afegir una credencial o actualitzar-ne una de vostra, l'assistent obre el formulari de credencials de Heym en una pàgina de Heym, `/credentials/setup/<id>`. Inicieu sessió allà, introduïu la clau o connecteu el compte i deseu. El valor va directament a Heym: el client MCP i el seu model només aprenen el nom i el tipus de la credencial. No enganxeu claus al client MCP; demaneu el formulari en lloc d'això.

| Client | Què passa |
|--------|-----------|
| Admet elicitació d'URL MCP | El client us demana que obriu la pàgina de Heym. La crida espera mentre ompliu el formulari, fins a deu minuts, i després continua amb la nova credencial. |
| Qualsevol altre | El resultat inclou l'enllaç i demana al client que torni a cridar `heym_chat` amb `wait_for_credential_form`. Aquesta crida espera fins a cinc minuts mentre ompliu el formulari i després reprèn la conversa. Si el client no espera, deseu el formulari i responeu amb el mateix `conversation_id`; la propera crida sabrà que el formulari s'ha desat i quina credencial ha creat. |

La pàgina només s'obre per al compte de Heym que ha iniciat la sol·licitud, de manera que un enllaç reenviat és inútil per a qualsevol altra persona. Un formulari roman obert durant 24 hores i es pot rebutjar des de la pàgina. Un cop el deseu o el declineu, el pas a la conversa de la pestanya Chat en mostra el resultat.


### Credencial i model

`heym_chat` executa el motor al vostre compte de Heym, de manera que necessita una credencial LLM pròpia:

| Camp | Comportament |
|-------|----------|
| **Credential** | Trieu qualsevol credencial d'OpenAI, Google o Custom a la qual tingueu accés. Es preomple amb la credencial preferida de [Settings](../reference/user-settings.md) quan no n'heu triat cap. |
| **Model** | Es carrega des de la credencial seleccionada. Es preomple amb el vostre model preferit quan la credencial coincideix. |

Si falta qualsevol dels dos, l'eina encara apareix a `tools/list`, però cada crida retorna un error que us indica que completeu la configuració en aquesta pestanya.


Els nodes LLM i Agent en un workflow creat per `heym_chat` s'executen amb aquesta credencial i model, inclosa una credencial compartida amb vós, de manera que les execucions de prova funcionen sense cap pas de configuració addicional. Quan `heym_chat` edita un workflow, els nodes LLM i Agent que ja tenen una credencial la conserven juntament amb el seu model.
### Arguments i historial

| Argument | Obligatori | Descripció |
|----------|----------|-------------|
| `message` | Sí | La instrucció o pregunta, en llenguatge natural. |
| `conversation_id` | No | Un `conversation_id` d'un resultat anterior de `heym_chat`, per continuar aquell fil. |
| `wait_for_credential_form` | No | Amb `conversation_id`: esperar que l'usuari desi o rebutgi el formulari de credencials obert pel fil i després enviar `message`. |

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
- **Claude, ChatGPT i Gemini OAuth** – Afegiu la URL del servidor als connectors o aplicacions personalitzades del client; deixeu les credencials en blanc i el client es registrarà automàticament via OAuth. El bearer token ha de viatjar a la capçalera `Authorization`, no com a `?token=`.
- **Session token** – Emès durant l'handshake SSE; limitat al servidor específic, de manera que els tokens d'un servidor amb nom no poden accedir a un altre. Aquest paràmetre `?session=` de curta durada no es veu afectat.

### Eliminació d'un servidor amb nom

Feu clic a la icona **X** a la capçalera d'una targeta de servidor. L'eliminació suprimeix el servidor i totes les seves assignacions de workflows; els workflows en si no es veuen afectats.

## SSE Endpoint

| Servidor | Endpoint |
|--------|----------|
| Per defecte | `{origin}/api/mcp/sse` |
| Amb nom | `{origin}/api/mcp/servers/{server-uuid}/sse` |

Tots dos endpoints admeten el transport SSE (GET, especificació MCP 2024-11-05) i el transport Streamable HTTP (POST, especificació MCP 2025-03-26). Claude, ChatGPT i Gemini utilitzen OAuth 2.1 / PKCE per a l'inici de sessió segur en tots dos.

## Relacionat

- [Why Heym](../getting-started/why-heym.md) – MCP com a primitiva de primera classe a Heym
- [Agent Node](../nodes/agent-node.md) – Node Agent amb suport d'eines MCP
- [Agent Architecture](../reference/agent-architecture.md) – Client MCP, enviament d'eines, orquestrador
- [Triggers](../reference/triggers.md) – MCP com a punt d'entrada de workflow
- [Chat Tab](./chat-tab.md) – El motor darrere de l'eina `heym_chat`
- [Workflows Tab](./workflows-tab.md) – Creeu i gestioneu workflows
- [Node Types](../reference/node-types.md) – Visió general dels Nodes d'IA
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia compacta de pàgina per a superfícies del tauler
