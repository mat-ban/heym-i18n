# Anàlisi del Workflow

L'**Anàlisi del Workflow** és un panell lateral esquerre que conté un document Markdown compartit i editable per workflow. Utilitzeu-lo per explicar què fa un workflow i per recollir idees de millora — i deixeu que la IA generi un primer esborrany per vosaltres.

El document és compartit: tothom qui pot accedir al workflow pot llegir-lo i editar-lo. S'emmagatzema amb el workflow i se suprimeix automàticament quan se suprimeix el workflow.

## Obrir el panell

1. Obriu un workflow a l'editor.
2. Feu clic a **Analyze** (icona Sparkles) a la barra d'eines de l'editor.
3. El panell s'obre a l'esquerra. La paleta de nodes (panell esquerre) es plega mentre és obert; en tornar a obrir la paleta de nodes, es tanca el panell d'anàlisi.

El panell només està disponible per a workflows desats. En un workflow nou sense desar, deseu-lo primer.

## El document

El panell mostra un únic document Markdown amb dues vistes, que s'alternen amb els botons **Edit** (llapis) i **Preview** (ull):

| Vista | Propòsit |
|------|---------|
| **Edit** | Editor Markdown simple (textarea). |
| **Preview** | Markdown renderitzat. |

La capçalera mostra **qui ha editat** el document per última vegada i quan.

### Desar

Feu clic a **Save** per persistir els canvis. Save només està habilitat quan hi ha edicions sense desar.

Com que el document és compartit, els desaments utilitzen concurrència optimista:

- Si algú altre ha desat una versió més nova des que vau obrir el panell, el vostre desament es rebutja i apareix un avís que indica el nom de l'altre editor.
- Aleshores podeu triar **Reload (discard mine)** per adoptar la versió del servidor, o **Overwrite** per forçar el desament de la vostra versió per sobre de la seva.

## Anàlisi amb IA

Seleccioneu una **Credential** i un **Model** d'LLM a la part superior del panell (la llista de models es carrega des de la credencial seleccionada — vegeu [Credentials](../tabs/credentials-tab.md)). A continuació, executeu l'anàlisi:

- **Analyze my workflow** — es mostra quan el document és buit. Transmet un informe Markdown generat per IA directament a l'editor com a esborrany sense desar. Reviseu-lo i editeu-lo, i després feu clic a **Save**.
- **Reanalyze** — es mostra quan el document ja té contingut. Transmet un informe nou en una **preview** separada, deixant el vostre document actual intacte. Trieu **Accept** per substituir el contingut de l'editor amb la nova anàlisi, o **Discard** per conservar el que teníeu.

Totes dues accions primer **executen el workflow** (quan és vàlid i executable) i inclouen els resultats de l'execució al prompt d'anàlisi, de manera que l'informe reflecteix com es comporta realment el workflow. Si el workflow no es pot executar, l'anàlisi continua a partir de la seva estructura estàtica.

L'informe generat cobreix tres seccions, en ordre: **Àrees de millora** (suggeriments concrets, incloent-hi una perspectiva de **seguretat** sempre que el workflow toqui credencials, entrada d'usuari, peticions externes o exposició de dades), el **Propòsit** del workflow, i **Què fa** (un recorregut pas a pas pels nodes).

La secció **Àrees de millora** sempre executa cinc comprovacions explícites:

1. **Cobertura d'errors** — si el canvas no té cap node [Error Handler](../nodes/error-handler-node.md) i no hi ha cap workflow d'error configurat, l'informe ho assenyala i recomana afegir gestió d'errors.
2. **Temps estalviat** — si no s'ha definit cap temps estalviat estimat per execució, l'informe recomana configurar-ne un perquè la mètrica **Time Saved** d'[Analytics](../tabs/analytics-tab.md) es pugui omplir.
3. **Nodes de xarxa** — per als nodes que fan crides de xarxa (com ara [HTTP](../nodes/http-node.md) i nodes d'integració), l'informe recomana una gestió d'errors específica del node (retry i/o continue-on-error) en aquests nodes.
4. **Alertes** — quan no hi ha [alertes](../tabs/alerts-tab.md) configurades per al workflow, l'informe recomana configurar alertes abans de passar a producció.

5. **Evals**: quan el workflow té un node [Agent](../nodes/agent-node.md) sense suite d'agents, l'informe recomana una **Agent Suite** (o una **Prompt Suite**) a [Evals](../tabs/evals-tab.md#agent-suites); quan té un node [LLM](../nodes/llm-node.md), recomana una **Prompt Suite** per provar aquest prompt en diferents models.

### Executar l'Analyzer des de Properties

Quan un workflow té nodes al canvas però encara no té cap document d'anàlisi, apareix un botó **Run Analyzer** al panell [Properties](./canvas-features.md) a nivell de workflow (es mostra quan no hi ha cap node seleccionat). Obre aquest panell d'Anàlisi del Workflow perquè pugueu triar una credencial i un model i generar l'informe.

Cada execució d'anàlisi es registra a [Traces](../tabs/traces-tab.md) sota la font **Workflow Analysis**.

Si no hi ha cap credencial d'LLM configurada, el botó Analyze està desactivat — afegiu-ne una a la [Credentials Tab](../tabs/credentials-tab.md).

## Relacionat

- [AI Assistant](./ai-assistant.md) — genera o modifica nodes del workflow a partir de llenguatge natural.
- [Sticky Note](../nodes/sticky-note-node.md) — per a notes curtes fixades directament al canvas.