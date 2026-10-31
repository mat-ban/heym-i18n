# Assistent d'IA

L'**Assistent d'IA** és un panell de Chat que s'obre des del panell de Debug i s'inicia a la part inferior dreta de l'editor. Arrossegueu la capçalera per moure'l, i arrossegueu una vora o una cantonada per canviar-ne l'amplada o l'alçada. No es reduirà per sota de 360×480 píxels. La posició i la mida es recorden en aquest navegador. **Restableix la posició i la mida** a la capçalera torna a situar el panell a la part inferior dreta. Utilitzeu el llenguatge natural per crear o modificar Workflows—descriviu què voleu, i la IA genera nodes i arestes que s'apliquen al Canvas.

Per a consultes de documentació fora de l'editor, utilitzeu [Chat with Heym](./chat-with-heym.md). Aquesta superfície està optimitzada per a ajuda de producte conscient de la pàgina en lloc de la generació de Workflows.

## Obrir el panell

1. Obriu un Workflow a l'editor
2. Localitzeu el **panell de Debug** a la part inferior (àrea de resultats d'execució)
3. Feu clic al botó **IA** (icona d'espurnes) a la barra d'eines del panell
4. El panell de l'Assistent d'IA s'obre a la part inferior dreta. Arrossegueu la seva capçalera per moure'l, o arrossegueu una vora o una cantonada per canviar-ne l'amplada i l'alçada.

Premeu `Ctrl + I` / `Cmd + I` en qualsevol lloc de l'editor per obrir o tancar el panell — la drecera funciona fins i tot mentre un camp de text té el focus. Vegeu [Dreceres de teclat](./keyboard-shortcuts.md).

Per treballar en un sol node, passeu el cursor per sobre seu al canvas i feu clic a **AI** a sobre. El tauler s'obre enfocat en aquest node. Vegeu [Modificar un sol node](#changing-one-node).

## Tancar el panell

Feu clic al botó **X**, premeu `Ctrl + I` / `Cmd + I`, o activeu/desactiveu el botó **IA** a la barra d'eines del panell de Debug. La capçalera arrossega el panell; no el tanca.

## Configuració

Abans d'enviar missatges, seleccioneu:

| Paràmetre | Descripció |
|---------|-------------|
| **Credencial** | Credencial d'LLM (clau d'API) de [Credencials](../tabs/credentials-tab.md) |
| **Model** | Nom del model (p. ex. `gpt-4o`, `gemini-2.5-flash`) |

Afegiu credencials a la [Pestanya de Credencials](../tabs/credentials-tab.md). La llista de models es carrega a partir de la credencial seleccionada.

## Mode Agent vs Mode Ask

El panell té dos modes, que es commuten amb el xip **Agent / Ask** a la capçalera del panell.

| Mode | Per defecte | Comportament |
|------|---------|-----------|
| **Agent** | ✓ | Construeix i modifica el Canvas. La IA genera un bloc JSON de Workflow que s'aplica automàticament al Canvas quan la resposta s'ha completat. |
| **Ask** | | Només respon preguntes. El Canvas no es toca mai. Utilitzeu aquest mode per preguntar sobre el vostre Workflow, les funcions de Heym, o obtenir consells sense desencadenar una actualització del Canvas. |

Canvieu de mode en qualsevol moment. Canviar el mode no esborra la conversa.

En mode Agent, la casella **Mode YOLO** sota el camp de missatge fa que l'assistent executi i corregeixi allò que construeix. Vegeu [Mode YOLO](#mode-yolo).

## Utilitzar el Chat

- Escriviu la vostra sol·licitud a l'entrada (p. ex. "Creeu un Workflow que prengui l'entrada de l'usuari i l'enviï a un LLM")
- Premeu **Enter** per enviar (Maj+Enter per a una nova línia)
- La IA transmet la seva resposta. En mode **Agent**, si la resposta inclou un Workflow en un bloc de codi \`\`\`json, s'analitza automàticament i s'aplica al Canvas. En mode **Ask** el Canvas no es modifica mai.
- Utilitzeu **Esborra** per restablir la conversa
- Passeu el cursor per sobre d'un missatge i feu clic a la seva icona de còpia per copiar el text que mostra, incloent-hi qualsevol JSON de Workflow
- Arrossegueu la línia per sobre de la caixa de missatge per fer-la més alta. L'àrea d'entrada pot créixer fins al 60% del panell, i torna a la seva alçada per defecte quan es recarrega la pàgina

## Aplicació automàtica del Workflow

Quan la resposta de la IA conté un bloc JSON de Workflow vàlid (amb `nodes` i opcionalment `edges`) en un bloc de codi \`\`\`json, Heym:

1. Analitza el JSON de la resposta
2. Substitueix el Canvas actual pels nous nodes i arestes
3. Ordena la disposició dels nodes
4. Marca el Workflow com a no desat

Si l'anàlisi falla, apareix un botó **Torna-ho a provar** per regenerar la resposta.
## Modificar un sol node

Passeu el cursor per sobre d'un node al canvas i feu clic a **AI** a sobre. El tauler s'obre en mode Agent, enfocat en aquest node, i mostra quin node s'està modificant:

| El node té... | El tauler mostra |
|---|---|
| Cap resultat en l'execució actual | **Modifying Node:** en una fila compacta amb la icona i el nom del node. L'assistent edita només a partir de la configuració del node; executeu primer el node si ha de veure la sortida |
| Un resultat en l'execució actual | **Modifying Node: (Has Node Output)** a sobre del mateix node: icona, nom i tipus, darrer estat i durada, i l'error si ha fallat. L'assistent veu aquesta sortida i l'error quan edita el node |

Passeu el cursor per sobre de l'etiqueta per veure en quin estat es troba el tauler.

En qualsevol estat del tauler, l'assistent també llegeix la pàgina de documentació del node, situada rere la icona de llibre a la capçalera del node. Utilitza la pàgina per comprendre les opcions del node i respondre preguntes sobre elles.

Sota els missatges, tres opcions inicien la sol·licitud:

| Opció | Què fa |
|---|---|
| **Change this node as ...** | Emplena el quadre de missatge amb *Canvia aquest node a* perquè acabeu la frase |
| **Fix error in this node ...** | Emplena *Corregeix l'error en aquest node.* L'assistent llegeix l'error d'aquest node de la darrera execució |
| **Other** | Enfoca un quadre de missatge buit |

Editeu el text i premeu **Send**. L'assistent retorna només aquest node i Heym l'actualitza al mateix lloc: el node manté el seu id, tipus i nom, de manera que expressions com `$checkLinkedIn.result` en altres nodes continuen funcionant. Altres nodes, connexions i la disposició no canvien, i **Undo** restaura la configuració anterior.

Si la sol·licitud no cap dins del node, per exemple si requereix un altre tipus de node o un node nou, l'assistent indica què hauria de canviar en lloc d'editar. Tanqueu el focus del node amb la **X** a la targeta del node per editar de nou tot el workflow. Tancar el tauler també esborra el focus.

El [mode YOLO](#yolo-mode) funciona amb un node enfocat: l'assistent canvia el node, executa el workflow i corregeix el node fins que l'execució és correcta. En mode **Ask**, el focus indica a l'assistent sobre quin node tracta la vostra pregunta i el canvas no es modifica.

## Mode YOLO

El **mode YOLO** permet a l'assistent provar allò que construeix. Marqueu la casella **Mode YOLO** sota el camp de missatge i, a continuació, envieu la vostra sol·licitud. La casella apareix només en el mode Agent. Està desactivada per defecte i es restableix a desactivada quan es recarrega la pàgina. Passeu el cursor per sobre la icona d'informació adjacent per veure'n un resum breu.

Amb el mode YOLO activat, l'assistent no s'atura després d'aplicar un workflow:

1. Aplica el workflow al canvas.
2. Abans de la primera execució, sol·licita les entrades de prova. La targeta llista els camps d'entrada del workflow, emplenats amb els valors que l'assistent suggereix. Editeu-los i premeu **Executa**. Les execucions posteriors reutilitzen aquests valors. La targeta només torna a aparèixer quan canvien els camps d'entrada o quan l'assistent necessita dades de prova diferents.
3. Executa el workflow al canvas exactament igual que el botó **Executa**: primer es desen els canvis no desats, els nodes s'il·luminen i l'execució apareix al tauler de Debug i a l'[Historial d'execucions](./execution-history.md).
4. Llegeix el resultat. Si l'execució ha fet el que heu demanat, finalitza amb **Verificat** i un resum breu. Si no, corregeix el workflow i el torna a executar.

Fa com a màxim **5 execucions** per missatge. Premeu **Atura** en qualsevol moment per finalitzar el bucle i aturar una execució en curs.

Cada resposta mostra els seus passos a mesura que es produeixen:
- `Applying changes to canvas`;
- `Running workflow · attempt 2/5`, amb una fila `Executing <node>` per a cada node;
- el veredicte final.

Després de cada execució, una línia breu com ara *Attempt 1 result sent · error in 1.2s* indica que el resultat ha tornat a l'assistent.

### Executar els vostres altres workflows

En el mode YOLO, l'assistent també pot executar els vostres altres workflows quan necessita el seu resultat. Per exemple, pot comprovar què retorna un workflow abans de cridar-lo des d'un node [Execute](../nodes/execute-node.md). Aquestes execucions es mostren com a passos `Running workflow "<name>"...` i es registren a l'Historial d'execucions amb l'origen del trigger `ai_assistant`. El workflow que s'està editant sempre es prova al canvas.

### Quan s'atura abans d'hora

| Situació | Què passa |
|---|---|
| L'assistent necessita una decisió, informació, una credencial o una taula de dades | Ho sol·licita amb la targeta de pregunta habitual. Respondre continua el bucle. |
| L'execució espera una [revisió humana](./human-in-the-loop.md) | El bucle s'atura. Aproveu la revisió i, a continuació, envieu un missatge. |
| El workflow espera la càrrega d'un fitxer | El bucle s'atura. El mode YOLO no pot provar execucions desencadenades per càrrega de fitxers. |
| S'ha desat una versió més recent del workflow en un altre lloc | El bucle s'atura. Resoleu el conflicte de desament i, a continuació, envieu un missatge. |

> **Les execucions són reals.** Els correus electrònics, els missatges i les crides a l'API del workflow s'envien realment a cada intent, i els nodes de Taula de dades escriuen files reals. Cada execució desa el workflow, de manera que les versions anteriors es conserven a l'[Historial d'edicions](./edit-history.md).

## Entrada de veu

Als navegadors compatibles, un botó **Veu** habilita la conversió de veu a text. Feu clic per iniciar l'enregistrament i torneu-hi a fer clic per aturar-lo. El text transcrit s'envia a la IA per corregir-ne la gramàtica abans que l'envieu.

## Node Agent vs Assistent d'IA

| | Node Agent | Assistent d'IA |
|---|------------|---------------|
| **Propòsit** | Node LLM dins d'un workflow; s'executa durant l'execució | Interfície de Chat per construir workflows amb llenguatge natural |
| **Ubicació** | Node del canvas | Tauler de Debug → tauler flotant |
| **Quan** | En temps d'execució | Mentre s'edita |

Consulteu [Node Agent](../nodes/agent-node.md) per al node de workflow que executa crides LLM amb eines i MCP.

## Com funciona (AI Builder DSL)

L'Assistent d'IA funciona amb un **workflow DSL** (llenguatge específic de domini) que descriu nodes, arestes i expressions. Quan envieu un missatge:

1. El vostre missatge, juntament amb les [Regles d'usuari](./user-settings.md) i el workflow actual (si n'hi ha), s'envien al backend.
2. El backend construeix un **prompt de sistema** que inclou:
   - El workflow DSL complet (tipus de nodes, sintaxi d'expressions, regles, exemples)
   - Les vostres Regles d'usuari afegides com a "User Custom Rules"
   - El JSON del workflow actual quan esteu editant un workflow existent
   - La llista de workflows disponibles si utilitzeu el node Execute
   - Els noms, tipus i ids de les credencials que teniu o que s'han compartit amb vós (mai els seus valors)
   - Els noms, ids, descripcions i columnes de les taules de dades que podeu utilitzar (mai les seves files)
3. El model retorna un únic bloc JSON de workflow (amb `nodes` i `edges`). El frontend l'analitza i l'aplica al canvas.
### Credencials

Quan un workflow necessita una credencial, l'assistent ho pregunta abans de construir-lo. Si disposeu de credencials d'un tipus adequat, les llista juntament amb **Crea una credencial nova**; si no en teniu cap, pregunta si voleu crear-ne una. Cada pregunta també us permet continuar sense cap credencial.

Si trieu crear-ne una, s'obre el formulari de credencial al panell, preconfigurat amb el tipus correcte i un nom suggerit. Els valors van directament a Heym; l'assistent només coneix el nom i el tipus. Les credencials OAuth (Google Sheets, Google Drive, BigQuery, Linear, Notion) es connecten en una finestra emergent, i apareix un enllaç a la pàgina d'autorització en cas que la finestra emergent estigui bloquejada. Un cop desada la credencial, la targeta mostra el seu nom i el botó de creació es desactiva; premeu **Envia les respostes** i l'assistent col·loca la credencial nova al node.

També podeu demanar una credencial per si sola ("crea una credencial de GitHub") o demanar de modificar-ne una que ja teniu ("actualitza la meva credencial de full de càlcul", "torna a connectar el meu Google Sheets"). L'assistent respon amb la mateixa targeta: crear obre un formulari buit, actualitzar obre el formulari en aquella credencial amb els secrets emmascarats.

L'assistent prefereix un node dedicat. Quan cap node cobreix una operació, com ara afegir una pestanya a un Google Sheet, utilitza una petició HTTP i escriu la línia de capçalera per a la credencial triada. Vegeu [HTTP › Autenticació amb credencials](../nodes/http-node.md#authenticating-with-credentials).

Les preguntes d'aclariment que el workflow pot evitar mostren **Opcional** a la seva entrada i es poden ometre.

El DSL imposa etiquetes en camelCase, regles d'expressió unificades i camps específics de cada node. Si el valor d'un camp és un sol `$expr`, el backend preserva el tipus natiu; si el valor barreja prosa amb `$refs`, el resultat és una cadena. La regla d'un sol `$` continua aplicant-se: cap `$` dins de parèntesis. Les regles d'usuari de [Configuració](./user-settings.md) s'injecten en aquest prompt del sistema perquè les vostres preferències s'apliquin a cada workflow generat per IA.

Si el workflow actual conté habilitats d'Agent, l'Assistent d'IA inclou només el `SKILL.md` de cada habilitat en aquell context de workflow. Els fitxers `.py` adjunts i els recursos binaris d'habilitats s'eliminen abans de la petició perquè el constructor es mantingui dins dels límits de context del model fins i tot quan les habilitats continguin implementacions grans.

### Taules de dades

Quan un workflow desa, emmagatzema o cerca registres i no heu anomenat cap altre magatzem, l'assistent utilitza un node [Taula de dades](../nodes/datatable-node.md). Si anomeneu una de les vostres taules i té les columnes que el workflow necessita, l'assistent la utilitza. En cas contrari, pregunta quina taula cal utilitzar. La targeta llista les taules que encaixen, cadascuna amb la seva descripció i tipus de columnes, més **Crea una taula nova** amb un nom i unes columnes proposats. Les taules compartides amb vosaltres també s'ofereixen; una taula en què només podeu llegir s'ofereix únicament per a lectura.

Trieu la taula nova i premeu **Envia les respostes**: la targeta crea la taula, i l'assistent col·loca el seu id al node i utilitza els seus noms de columna exactes. També podeu demanar una taula per si sola, per exemple "crea una taula per als meus leads".

L'assistent del canvas veu noms de taules, descripcions i columnes, mai files. Configura els nodes del workflow a partir d'aquestes metadades; afegiu columnes a la [pestanya DataTable](../tabs/datatable-tab.md) o demaneu-ho al [Chat](../tabs/chat-tab.md). El Chat i `heym_chat` poden inspeccionar files i afegir o eliminar columnes directament, així com inserir, actualitzar o suprimir files en taules de la vostra propietat o amb accés d'escriptura, incloent-hi els recursos compartits d'equip. L'eliminació de columnes i el buidatge de totes les files demanen confirmació abans de suprimir dades.

## Relacionat

- [Per què Heym](../getting-started/why-heym.md) – La construcció en llenguatge natural com a primera etapa del cicle de vida de l'agent
- [Inici ràpid](../getting-started/quick-start.md) – Construïu el vostre primer workflow
- [Configuració](./user-settings.md) – Regles d'usuari injectades al prompt del sistema de l'Assistent d'IA
- [Chat amb Heym](./chat-with-heym.md) – Assistent conscient de la pàgina dins de l'àrea de documentació
- [Conceptes bàsics](../getting-started/core-concepts.md) – Workflows, nodes i flux d'execució
- [Node Agent](../nodes/agent-node.md) – Node LLM amb eines i MCP
- [Pestanya Credencials](../tabs/credentials-tab.md) – Afegiu claus d'API per a l'Assistent d'IA
- [Estructura del workflow](./workflow-structure.md) – Format JSON per als workflows
