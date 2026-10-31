# Historial d'execucions

L'historial d'execucions registra les execucions de Workflow: entrades, sortides, resultats dels Nodes, estat i origen del Trigger. Utilitzeu-lo per fer el seguiment d'una execució de producció activa, inspeccionar execucions anteriors, depurar errors o tornar a executar amb les mateixes entrades mitjançant **Bring to Canvas**.

## Visió general

Cada execució emmagatzema:

| Camp | Descripció |
|-------|-------------|
| **Inputs** | Cos de la sol·licitud o entrades de l'execució (p. ex. `text` per al Node d'entrada) |
| **Outputs** | Sortides a nivell de Workflow |
| **Node results** | Sortides per Node, estat i temps d'execució |
| **Status** | `success`, `error`, `pending`, `skipped` o `failed` (vegeu [Crash Recovery](#crash-recovery)) |
| **trigger_source** | Com s'ha activat l'execució (vegeu [Triggers](./triggers.md)) |

## Accés a l'historial

| Ubicació | Abast |
|----------|-------|
| Barra d'eines de l'**Editor** | Només el Workflow actual |
| Capçalera de la vista **Docs** | Només el Workflow actual |
| Capçalera del **Dashboard** (pestanya Chat) | Tots els Workflows + execucions de xat/assistent |
| Capçalera de la vista **Evals** | Tots els Workflows + execucions de xat/assistent |

Feu clic al botó **History** (icona de rellotge) per obrir el diàleg.

## Per Workflow vs. tot l'historial

- **Per Workflow** (Editor, Docs): Mostra les execucions del Workflow que teniu obert. Utilitzeu **Clear history** per eliminar només les execucions d'aquest Workflow.
- **All History** (Dashboard, Evals): Mostra les execucions de tots els Workflows i sessions de xat/assistent. La cobertura coincideix amb l'accés als Workflows: Workflows de la vostra propietat, Workflows compartits directament amb vosaltres i Workflows compartits amb un equip al qual pertanyeu. Utilitzeu **Clear all history** per eliminar tots els registres de la vostra propietat. L'historial dels Workflows compartits es conservarà.

## Bring to Canvas

**Bring to Canvas** carrega les entrades i les sortides dels Nodes d'una execució seleccionada al Workflow actual.

### Què carrega

- **Inputs** → Panell d'entrada de l'execució (p. ex. `text` per al Node d'entrada, o camps personalitzats)
- **Node results** → El panell de resultats d'execució mostra les sortides anteriors per Node
- **Execution result** → Estat, sortides i temps de l'execució

### Comportament segons el context

- **A l'Editor** (historial per Workflow): S'aplica immediatament al Workflow obert i tanca el diàleg.
- **Des d'All History** (Dashboard/Evals): Navega a l'editor del Workflow i, tot seguit, aplica les dades quan es carrega l'editor. Només està disponible per a execucions de Workflow, no per a execucions de xat/assistent.

### Enllaç directe a l'execució

Obrir un Workflow a `/workflows/{workflowId}/{executionId}` porta automàticament aquesta execució al Canvas, igual que seleccionar l'execució i triar **Bring to Canvas**. Això permet compartir una execució anterior concreta com a URL. Si no es troba l'execució (identificador incorrecte o eliminat), l'editor torna a carregar el Workflow sense més.

### Casos d'ús

Feu Ctrl/Cmd+clic en una execució de qualsevol de les llistes d'historial per obrir aquest enllaç directe en una pestanya nova del navegador. La pestanya actual i el diàleg obert es mantenen tal com estan. Les execucions de xat i assistent no tenen workflow, de manera que la drecera només les selecciona, com un clic normal.

- Tornar a executar un Workflow amb les mateixes entrades
- Depurar una execució fallida inspeccionant les entrades i les sortides dels Nodes
- Comparar sortides entre execucions

## Preguntar a la IA

Tots dos quadres de diàleg d'historial tenen un botó **Preguntar a la IA** (icona d'espurna) al costat del títol. Obre la [pestanya Chat](../tabs/chat-tab.md#asking-about-a-run) en una nova conversa amb el workflow i l'execució seleccionada adjunta com a xips amovibles. Pregunteu per què l'execució ha estat lenta, què ha fallat o demaneu a Chat que corregeixi el workflow. Chat llegeix exactament aquesta execució, incloent la traça i errors per node.

Al quadre de diàleg All History, **Preguntar a la IA** només apareix mentre hi ha seleccionada una execució de workflow; les execucions de chat i assistent no ho mostren.

## Cronologia d'execució

Al detall de l'execució, el botó **Cronologia** (icona de temporitzador) al costat d'**Expandir-ho tot** canvia la llista de **Passos** per una línia de temps de spans. Mentre es mostra la cronologia, el mateix botó indica **Registres**; feu-hi clic per tornar a la llista. A All History el botó només apareix per a execucions de workflow. La cronologia dibuixa una barra per node en el moment en què va començar, per veure quin node va trigar quant de temps i quins es van executar en paral·lel. Passeu el cursor per sobre d'una barra per veure'n la durada; feu-hi clic per obrir el mateix inspector de detalls que la [cronologia d'execució](#execution-timeline-details) de l'editor. La visualització triada es manté mentre el diàleg és obert.

Les execucions registrades abans que s'emmagatzemessin les hores d'inici dels nodes es mostren successivament per durada.

## Execution Highlights

Després d'una execució en directe —o després de **Bring to Canvas**— apareix un popup descartable d'**Execution Highlights** a la **part superior dreta del Canvas**. És una manera ràpida de veure *què ha produït cada Node*, llistat de dalt a baix en ordre d'execució. Tanqueu-lo amb la **✕**; es torna a obrir a la propera execució.

### Què es mostra

| Registre | Origen | Automàtic? |
|--------|--------|-------|
| **Input** | Els paràmetres d'entrada de l'execució (Node d'entrada/Trigger) | Sí |
| **Output** | El resultat del Node de sortida — o, si no n'hi ha, el missatge de l'últim Node | Sí |
| **Agent / LLM** | La sortida de cada Node d'agent o LLM | Sí |
| **Output** | Qualsevol altre Node amb **Highlight Node Output** activat | Opcional |

Els Nodes que ja es destaquen automàticament (input / output / last / agent / llm) no apareixen mai dues vegades, encara que activeu també la casella.

### Cada registre

- Mostra `Node — message…` amb els primers **250 caràcters**; feu clic a una fila per ampliar-la i renderitzar el **missatge complet com a Markdown**, amb un botó **Copy**.
- Un Node que s'ha executat diverses vegades (p. ex. dins d'un bucle) mostra `Node (N)` amb un selector `‹ i / N ›` — trieu quina execució voleu veure; el selector de cada Node és independent.

### Highlight Node Output

Cada Node **excepte Agent i LLM** té una casella de selecció **Highlight Node Output** al seu panell de propietats (desactivada per defecte). Activeu-la per afegir la sortida d'aquest Node al popup. Apareix una petita insígnia ✦ als Nodes destacats del Canvas. Al [workflow DSL](./expression-dsl.md) aquest és el camp de dades del Node `"highlight": true` (per defecte `false`).

### Als dashboards

Les targetes de widget del Dashboard que han executat un Workflow mostren un botó ✦ **Execution highlights** a la capçalera de la targeta; feu-hi clic per obrir el mateix popup per a l'execució d'aquest widget, amb la sortida dibuixada del widget com a registre destacat.
## Execucions en curs

Tots dos diàlegs d'historial mostren les **execucions en curs** a la part superior de la llista, abans de les execucions anteriors.

- Apareix un indicador giratori i l'etiqueta **Running** amb l'hora d'inici
- Feu clic a **Open live** per adjuntar l'editor a aquesta execució exacta sense reiniciar-la
- El canvas primer restaura els Nodes que ja s'han completat i després rep
  esdeveniments `node_start`, `node_complete` i d'execució final via SSE
- El Node actual polsa al canvas, els Nodes posteriors mantenen la seva animació pendent i
  el panell de Debug afegeix cada resultat a mesura que arriba—igual que una execució iniciada des de l'editor
- Feu clic a **Cancel** per aturar l'execució immediatament
- Cancel·lar des de qualsevol diàleg (Editor o Dashboard) també tanca el flux SSE actiu a qualsevol pestanya del canvas oberta per a aquest Workflow, de manera que l'estat de l'editor es reinicia netament
- Després de la cancel·lació, l'entrada en curs desapareix a la propera actualització; premeu **Refresh** per actualitzar la llista manualment
- Si cancel·leu una execució que ja ha finalitzat, la sol·licitud no té cap efecte

Les execucions que esperen un [slot de concurrència](./webhooks.md#concurrency-limit-and-queued-runs) apareixen a la mateixa secció amb l'etiqueta **Queued 2/5**, la seva posició a la cua i la mida de la cua. No tenen el botó **Open live** perquè encara no hi ha res en execució; **Cancel** treu una execució en espera de la cua i la registra com a `cancelled`. Una execució que ha esperat més del temps màxim del workflow es registra com a `expired`, i una rebutjada per cua plena com a `queue_full`; ambdues tenen la seva pròpia insígnia a la llista d'execucions.

L'URL en directe és `/workflows/{workflowId}/{executionId}`. L'observador és de només lectura: sortir
de l'editor només desconnecta aquesta pestanya del navegador i mai atura el Workflow. Les instantànies actives
es comparteixen a través de PostgreSQL, de manera que obrir una execució encara funciona quan el Trigger i la sol·licitud de l'editor
arriben a workers de backend diferents.

## Recuperació de fallades

Si el servidor es reinicia (desplegament, reinici de contenidor o fallada) mentre un Workflow s'està executant, el worker d'aquesta execució s'atura a mig procés. Heym recupera automàticament aquestes execucions interrompudes en lloc de deixar-les bloquejades com a **Running**.

- A l'inici següent, el procés líder electe detecta les execucions orfes — instantàniament per a un reinici ordenat, o en uns ~60 segons per a una fallada sobtada (un cop els heartbeats s'aturen clarament).
- Les execucions recuperades es **tornen a executar des de zero amb les mateixes entrades** (no es reprenen des d'on es van aturar), utilitzant la definició actual del Workflow. En completar-se, registren una entrada terminal normal (p. ex. `success`), de manera que l'historial mostra l'execució com a completada.
- Una execució es reintenta **una vegada**. Si el intent de recuperació també s'interromp — o el Workflow s'ha eliminat mentrestant — l'entrada es registra com a `failed`.
- Això funciona igual en un sol contenidor i en desplegaments multi-worker; només el líder realitza la recuperació, de manera que una execució mai es recupera dues vegades per workers diferents.

### Commutador de recuperació automàtica

El panell **Execution Log** (execució) de l'editor té una casella de selecció **Auto-recover**, **activada per defecte** per Workflow.

- **Activada**: les execucions interrompudes d'aquest Workflow es tornen a executar tal com es descriu anteriorment.
- **Desactivada**: les execucions interrompudes no es tornen a executar i es registren amb l'estat `skipped`.

> Les execucions de sub-workflow no es recuperen de manera independent — són reimpulsades per la seva execució pare recuperada. Els Triggers amb la seva pròpia reentrega (RabbitMQ, programat/cron, IMAP) també poden reentregar en reiniciar-se, de manera que una execució recuperada pot executar-se ocasionalment dues vegades.

## Revisió humana pendent

Les execucions que es pausen per a l'aprovació de [Human-in-the-Loop](./human-in-the-loop.md) s'escriuen a l'historial immediatament amb l'estat `pending`.

- El Node agent pendent emmagatzema un payload de revisió que inclou `reviewUrl`, `draftText` i `expiresAt`
- Qualsevol Node connectat al handle `review` de l'agent també pot executar-se abans que l'humà respongui, i els seus resultats de Node s'emmagatzemen a la mateixa entrada d'historial pendent
- Els diàlegs d'historial mostren l'enllaç de revisió perquè els propietaris puguin copiar-lo o obrir-lo
- Els diàlegs d'historial i el panell de Debug de l'editor mostren la decisió humana final després que l'execució es reprengui
- Quan un revisor accepta, edita o rebutja l'esborrany, la mateixa entrada d'historial s'actualitza amb el resultat final de l'execució
- Si la mateixa execució es pausa per HITL més d'una vegada, l'entrada d'historial segueix sent la mateixa mentre que cada punt de control obté el seu propi enllaç de revisió d'un sol ús

Això és especialment útil per a execucions de portal i Workflows de llarga durada que poden esperar hores o dies abans de continuar.

## Copiar

Utilitzeu **Copy** al costat d'Inputs o Outputs per copiar el JSON al porta-retalls.

## Esborrar historial

- **Per Workflow**: Al diàleg d'historial de l'Editor, feu clic a **Clear history** per eliminar les execucions del Workflow actual.
- **Tot l'historial**: Al diàleg d'historial del Dashboard/Evals, feu clic a **Clear all history** per eliminar tots els registres d'execució que posseïu. Les execucions de Workflows compartits es conserven. Aquesta acció no es pot desfer.

## Detalls de la línia temporal d'execució

Quan l'**Execution Log** de l'editor està obert, feu clic al botó del temporitzador per mostrar la línia temporal d'execució. Seleccioneu un interval per obrir un inspector de detalls en línia que ocupa l'àrea de files. Mostra l'estat del pas seleccionat, la durada, el recompte d'intents, la informació de reintent, els errors, l'ID de traça i una previsualització compacta de la sortida. Les sortides d'objectes i matrius utilitzen el mateix visor `JsonTree` que la resta del panell de Debug; els valors escalars utilitzen una previsualització de text. Quan un pas genera imatges (captures de pantalla de Playwright, imatges generades, fitxers d'imatge o imatges en base64 al cos d'una sol·licitud, trobades a qualsevol lloc de la sortida), apareixen com a miniatures a sobre de la sortida, i el JSON mostra un marcador de posició curt en lloc del base64 en cru. Feu clic a una miniatura per obrir-la en un lightbox; els botons de fletxa o les tecles ←/→ naveguen per totes les imatges de l'execució, amb un comptador com ara `2 / 5`. Utilitzeu **Open trace** per a intervals d'LLM i Agent quan hi hagi un ID de traça disponible.
## Detall del node al mòbil

En un telèfon, l'editor mostra un arbre de Workflow a pantalla completa en lloc del llenç de forma lliure. Toqueu un node de l'arbre amb un resultat enregistrat per obrir-ne l'execució com a detall a pantalla completa. La vista ofereix pestanyes separades de **Dades d'entrada**, **Dades de sortida** i **Errors**. La pestanya de sortida mostra el resultat enregistrat i ofereix **Copia la sortida**; la pestanya d'entrada mostra la configuració del node seleccionat, i la pestanya d'errors mostra l'error enregistrat quan el node ha fallat. Utilitzeu **Torna al Workflow** o el botó de tancament per tornar a l'arbre.

Els diàlegs d'historial del llenç i del tauler de control mantenen els controls d'execució en una sola fila i col·loquen els filtres disponibles d'etiquetes i d'instàncies en una graella adaptable. Els seus menús de filtre utilitzen el mateix selector integrat a l'aplicació, de manera que la marca de verificació seleccionada té un marge i una línia de base coherents amb cada etiqueta d'opció.

## Relacionat

- [Triggers](./triggers.md) – Com s'inicien els Workflows; l'historial enregistra `trigger_source` (incloent-hi `board` per a execucions iniciades per moviments de targetes i seguiments del [Tauler](../tabs/board-tab.md))
- [Human-in-the-Loop](./human-in-the-loop.md) – URL de revisió pendents i comportament de represa
- [Historial d'edicions](./edit-history.md) – Control de versions per als desaments de Workflow (revertir, diferències)
- [Inici ràpid](../getting-started/quick-start.md) – Creeu i executeu el vostre primer Workflow
- [Pestanya de Workflows](../tabs/workflows-tab.md) – Creeu i gestioneu Workflows
