# Tauler de control

La pestanya **Tauler de control** és un espai a l'estil de Grafana on es construeixen graelles de ginys de gràfics. Cada giny es renderitza a partir de la sortida del seu propi Workflow de Heym ocult, de manera que qualsevol dada que es pugui produir en un Workflow —consultes a bases de dades, crides a API, cerques RAG, sortida d'un LLM— es pot convertir en un gràfic. Es poden mantenir diversos taulers de control i compartir cadascun amb persones o equips.

## Taulers de control

Tothom comença amb un tauler de control, creat la primera vegada que obre la pestanya. Utilitzeu el selector de taulers de control a la part superior de la pestanya per canviar entre taulers, i el **+** del costat per crear-ne un de nou. El selector llista primer els vostres taulers de control i després els que s'han compartit amb vosaltres, etiquetats amb el nom de la persona que els ha compartit.

La pestanya reobre el tauler de control que es va utilitzar per darrera vegada, i la barra d'adreces porta el tauler de control obert (`?tab=dashboard&dashboard=<id>`), de manera que un enllaç obre exactament aquest tauler de control per a qualsevol que hi tingui accés.

El botó de configuració (només per als propietaris) canvia el nom del tauler de control, estableix quins registres accepta com a [pàgina de detall](#detail-pages), gestiona la compartició i l'elimina. Eliminar un tauler de control suprimeix els seus ginys i els seus Workflows. Sempre es conserva almenys un tauler de control propi, de manera que l'últim no es pot eliminar.

## Ginys

Un giny és un sol gràfic a la graella. Tipus de gràfic compatibles:

- **Barres** (verticals o horitzontals)
- **Línies**
- **Àrea** (tendència farcida, admet diverses sèries)
- **Circular**
- **Taula** (amb desplaçament; feu clic a la capçalera d'una columna per ordenar ascendentment i torneu-hi a fer clic per ordenar descendentment. Una columna es pot mostrar com a [xips d'estat](../nodes/chart-output-node.md#status-chips), una columna pot contenir [botons d'enllaç](../nodes/chart-output-node.md#link-buttons) que obren un URL en una pestanya nova, i les files poden obrir una [pàgina de detall](#pagines-de-detall))
- **Numèric** (un sol valor KPI amb una unitat opcional)
- **Indicador** (un sol valor en un interval mínim–màxim, per exemple un percentatge)
- **Dispersió** (punts X/Y per a gràfics de correlació)
- **Proporció** (una barra dividida en porcions amb una llegenda de percentatges, per exemple un desglossament per idioma)
- **Gantt** (dates de les tasques, finalització i dependències)
- **Entity relationships (DB)** (taules, camps, claus PK/FK i connexions)
- **Indicador de barres** (un indicador horitzontal per fila amb un gradient de vermell→verd i un valor, per exemple espai de disc lliure)
- **Text** (un missatge en markdown, per exemple una nota d'estat com "Última execució a les 19:47"; admet [caselles de selecció interactives](../nodes/chart-output-node.md#interactive-task-lists) quan el markdown és estàtic, i [llistes numerades explícites](../nodes/chart-output-node.md#numbered-lists) per a numeració personalitzada o descendent)
- **HITL** (les vostres revisions humanes pendents. La capçalera mostra `1/n pending`. El nom del Workflow obre aquesta execució al canvas. **Aprova**, **Sol·licita canvis** i **Rebutja** la resolen. La icona d'historial al costat del títol del giny obre aquesta execució al diàleg d'historial d'aquesta pàgina. El giny no utilitza files d'origen, i cada persona veu la seva pròpia cua. Pot mostrar en el seu lloc les revisions d'un sol Workflow, per a tothom que pugui obrir aquest Workflow; vegeu [Widgets HITL](#widgets-hitl))

A més dels gràfics, un giny **Run a workflow** executa un dels vostres Workflows des del tauler de control: sobre un fitxer deixat anar, amb els seus camps d'entrada o amb un botó Run; vegeu [Ginys d'execució](#run-widgets).

Cada giny carrega les seves dades de manera asíncrona quan s'obre la pestanya, de manera que la pàgina es manté àgil mentre els gràfics es van omplint.

## Afegir un giny

1. Feu clic a **Afegir giny**, doneu-li un títol i trieu un tipus de gràfic. A sota del selector, el diàleg dibuixa un exemple d'aquest tipus de gràfic amb dades de mostra i anomena les files que espera, de manera que podeu comparar tipus abans de construir res.
2. El giny s'obre a l'editor de Workflows amb un graf inicial: un Node [Set](../nodes/set-node.md) que produeix les files, connectat a un Node [Chart Output](../nodes/chart-output-node.md). Substituïu el Node Set per qualsevol font de dades. Un giny **HITL** és només el Node Chart Output; llegeix les vostres revisions pendents i no necessita cap font de dades.
3. Construïu el Workflow de manera que el Node que alimenta **Chart Output** produeixi una matriu de files, i després configureu el mapatge de camps del Node Chart Output (camp d'etiqueta, camp de valor, etc.).
4. Deseu, torneu a la pestanya Tauler de control i el giny es renderitzarà.

Per a un giny **Run a workflow**, trieu en canvi el Workflow que executa; el selector indica com executarà el giny cadascun. El giny s'afegeix directament a la quadrícula; no cal construir cap Workflow nou.

Feu doble clic en un giny (o utilitzeu el seu botó d'edició) per reobrir el seu Workflow en qualsevol moment. Utilitzeu **Clonar giny** a la capçalera del giny per duplicar tant el giny com el seu Workflow complet. La còpia es col·loca a sota de l'original i s'etiqueta amb **(Còpia)** perquè la pugueu editar de manera independent.

## Widgets HITL

Un nou widget HITL mostra totes les revisions que esperen a la vostra pròpia cua. Per mostrar només les d'un Workflow, obriu la **Configuració** del widget:

1. A **Workflow**, trieu el Workflow. La llista conté els Workflows que podeu obrir, vostres o compartits amb vós o amb el vostre equip, que tenen un pas esperant una persona: un Agent amb revisió humana, o un pas de Slack d'aprovació, botons o formulari. La icona al costat obre aquest Workflow en una pestanya nova.
2. Si el Workflow té un sol pas d'aquest tipus, se selecciona automàticament. Si en té diversos, **Select agent** els llista per nom de node, amb **All agents** primer; els passos de Slack estan marcats amb **(Slack)**.
3. Deseu. El `1/n pending` de la capçalera compta només aquestes revisions. Trieu **Tots els Workflows** per tornar a mostrar la vostra pròpia cua.

La mateixa opció es troba al llenç, a les propietats del node Chart Output. **Ajustar amb IA** pot fer-ho («mostrar només les aprovacions de factures»), igual que descriure un nou widget que anomeni el Workflow. Cada canvi és una edició del Workflow, per la qual cosa apareix a l'Edit History.

- **Qui veu les revisions.** Un widget filtrat en un Workflow mostra les revisions d'aquest Workflow a tothom que pugui obrir el Workflow, i aquests poden aprovar, demanar canvis o rebutjar des d'ell, igual que podrien executar el Workflow. Un widget sense filtrar mostra a cadascú la seva pròpia cua.
- **Qui veu el widget.** Qui no pot obrir el Workflow triat no veu el widget en absolut, ni tan sols en un dashboard compartit amb ell. Quan el propietari del dashboard perd l'accés al Workflow, o aquest s'elimina, el propietari veu «You no longer have access to the workflow this widget shows» i pot triar-ne un altre a la **Configuració**.
- **Només opcions accessibles.** Un Workflow que no podeu obrir es rebutja en desar el widget, ja sigui des de la configuració, el llenç o la IA.

## Pàgines de detall

Un giny de taula pot enllaçar les seves files a un altre tauler de control, que llavors funciona com a pàgina de detall: un únic tauler de control que serveix per a cada client, factura o tiquet.

1. Obriu **Settings** del giny de taula i trieu el tauler de control a **Row link**.
2. Introduïu **Record column**, la columna el valor de la qual identifica la fila (per exemple `id`), i opcionalment una **Label column** que li dóna nom (per exemple `name`).
3. Deseu. En fer clic en una fila (o enfocar-la i prémer Retorn) s'obre el tauler de control enllaçat amb `?record=<value>&label=<name>`.

Al tauler de control de detall, cada Workflow de giny llegeix el valor com a `$page.record` (vegeu [Chart Output](../nodes/chart-output-node.md#detail-pages-pagerecord)), i la pàgina mostra `Dashboard / <label>` a sobre de la quadrícula amb un botó per esborrar el registre. Enrere torna a la taula d'on veníeu.

- **Qui la pot obrir.** Les files només es poden clicar per als espectadors que poden obrir el tauler de control enllaçat. Els altres veuen la mateixa taula sense enllaços.
- **Format del registre.** El registre prové de la URL, de manera que el tauler de control de detall decideix què accepta. A la seva configuració, **Detail page records** és un dels següents: IDs (lletres, dígits, `-`, `_` i `.`, fins a 128 caràcters; el valor per defecte), nombres, UUIDs o adreces de correu electrònic. Qualsevol altre valor es rebutja abans que s'executi cap giny, i els ginys mostren "This page does not accept that record".
- **Continua sent l'execució del propietari.** Els ginys també s'executen com a propietari del tauler de control en una pàgina de detall. Els creadors només haurien de passar `$page.record` on un node l'escapi, mai directament al text d'una consulta.
- **Memòria cau.** Cada giny emmagatzema a la memòria cau el seu gràfic per registre, durant el mateix temps de vida (TTL) que el giny, i conserva els 50 registres utilitzats més recentment.

## Ginys d'execució

Un giny **Run a workflow** executa un dels vostres Workflows i en mostra el resultat: estat, temps d'execució i sortides. El que mostra depèn del que rebi el Workflow:

- **Un fitxer.** Per a un Workflow que comença amb un [File Upload Trigger](../nodes/file-upload-trigger-node.md), deixeu-hi anar un fitxer (o feu clic per triar-ne un) i el giny el pujarà mitjançant l'enllaç de pujada d'un sol ús del trigger. El giny mostra els tipus de fitxer i la mida que el trigger accepta i rebutja els altres abans de pujar-los. Quan el Workflow també comença amb un node Text Input, el giny mostra els seus camps al costat de la zona per deixar anar: trieu un fitxer, empleneu els camps i **Run** enviarà tots dos. Els valors viatgen amb l'enllaç de pujada que genera el giny, de manera que un enllaç de pujada compartit no els pot definir.
- **Camps d'entrada.** Per a un Workflow que comença amb un node Text Input, el giny mostra els seus camps amb els valors per defecte; **Run** executa el Workflow amb els vostres valors. Els valors dels camps que el Workflow no té es descarten.
- **Res.** Un Workflow sense entrades obté un botó **Run**.

El botó **Wrap** del resultat ajusta les línies llargues de sortida dins del quadre; desactiveu-lo per llegir el disseny JSON de la sortida.

- Qualsevol persona que pugui obrir el tauler de control pot executar el giny, igual que qualsevol pot actualitzar un gràfic. L'accés al Workflow és el del propietari del tauler de control: afegir el giny requereix un Workflow que tant vós com el propietari pugueu executar, i l'execució mateixa utilitza les credencials del propietari del Workflow, com qualsevol enllaç de pujada.
- El resultat roman a la pantalla fins que sortiu de la pàgina; els altres espectadors no veuen els vostres fitxers, valors ni resultats. L'execució apareix a l'historial d'execucions amb el trigger `dashboard`.
- Compartir un tauler de control mai no concedeix accés al Workflow mateix. **Edit workflow** l'obre per a les persones que ja hi tenen accés, i **Fine-tune with AI** no s'ofereix.
- Les execucions amb fitxers s'executen a la instància principal, on s'emmagatzemen els fitxers pujats, com qualsevol execució de File Upload Trigger.

## Generar un giny amb IA

Feu clic a **IA**, descriviu la mètrica que voleu (per exemple, "taxa d'èxit dels Workflows durant els últims 30 dies com a gràfic de barres") i trieu una credencial d'LLM i un model. Heym genera un Workflow de giny complet que acaba en un Node Chart Output i l'afegeix a la graella. Consulteu [Chart Output](../nodes/chart-output-node.md#example-ai-prompts) per veure exemples de Prompts per tipus de gràfic.

El widget rep un títol curt d'una o dues paraules en l'idioma de la vostra sol·licitud, com ara «Casos oberts». Un títol mai porta l'identificador d'una taula de dades; quan el model anomena el widget amb una frase, Heym en conserva les primeres paraules.

L'API de widgets també pot crear una **targeta de recompte** sense IA: un widget `text` en una taula de dades (`data_table_id`) amb `count_column` i `count_value` mostra quantes files tenen aquest valor; el títol del widget anomena el valor. Heym Work encapçala les pàgines creades a partir d'una taula de dades amb una targeta de recompte per estat.

Utilitzeu el botó **Ajustar amb IA** d'un giny per revisar un giny existent amb una instrucció nova. Cada ajust amb IA fa una instantània del Workflow anterior a l'**Historial d'edicions** del giny, de manera que podeu revisar o revertir els canvis des de l'editor de Workflows.

## Des de Chat i MCP

[Chat](./chat-tab.md), i els clients MCP a través de l'eina [`heym_chat`](./mcp-tab.md), poden llegir els vostres taulers, afegir-hi ginys, canviar-los el nom o eliminar-los, i endreçar la disposició d'un tauler. Heym Work mostra cada tauler com una pàgina, de manera que les mateixes respostes cobreixen les seves pàgines.

- **Quins taulers hi ha i què contenen.** Pregunteu "quins taulers tinc?", "què hi ha al tauler de Vendes?" o "a quin tauler es troba el workflow d'ingressos?". Chat llista els vostres propis taulers i els compartits amb vosaltres, amb els vostres permisos d'accés i un enllaç a cadascun, així com tots els ginys que contenen: títol, tipus de gràfic i el workflow que hi ha al darrere. Un [giny HITL](#hitl-widgets) filtrat en un workflow que no podeu obrir roman ocult, igual que al mateix tauler.
- **Un giny nou.** Demaneu "afegeix un gràfic de casos oberts per estat al tauler de Vendes". Chat primer col·loca un giny buit al tauler, després escriu el workflow propi del giny, fa execucions de prova i corregeix errors fins que una execució s'aprova, de la mateixa manera que [crea workflows](./chat-tab.md#creacio-de-workflows). No es deixa cap workflow separat i cada desat apareix a l'Edit History del giny. El títol i el tipus de gràfic del giny segueixen el que Chat desa.
- **Un workflow existent.** Demaneu "posa el workflow d'ingressos al tauler de Vendes". Un workflow que acaba en un node Chart Output es converteix en un giny de gràfic amb la seva pròpia còpia del workflow, de manera que els canvis posteriors al giny mai no toquen l'original. Un workflow amb un node trigger o input no es pot convertir en un giny de gràfic. Qualsevol altre workflow es converteix en un [giny d'execució](#run-widgets), que també necessita un workflow que el propietari del tauler pugui executar.
- **Canviar el nom o eliminar un giny.** Demaneu "canvia el nom del giny Ingressos a Vendes" o "elimina el giny Casos oberts". El workflow d'un giny de gràfic també pren el nom nou; el workflow d'un giny d'execució manté el seu. Eliminar un giny de gràfic elimina el seu workflow juntament amb ell, tal com fa el botó d'eliminació del giny; el workflow d'un giny d'execució es manté. Chat només elimina el giny que heu demanat i demana aclariment primer si les vostres paraules coincideixen amb diversos.
- **Endreçar.** Demaneu "endreça el tauler de Vendes", o "afegeix aquests tres ginys i endreça". Chat disposa els ginys visibles en el seu ordre, tal com fa el botó **Endreça**: files de dos o tres a l'atzar, de manera que tornar-ho a demanar proporciona una altra distribució. Demaneu un nombre per fila ("tres per fila") per obtenir files d'aquesta mida. Això organitza el tauler a Heym; Heym Work manté la seva pròpia disposició d'una pàgina, que el botó propi **Endreça** de la pàgina canvia.

Els ginys nous van a sota dels ginys existents del tauler i, com qualsevol giny, s'executen com a propietari del tauler. Afegir, canviar el nom, eliminar i endreçar requereixen accés d'escriptura al tauler. Crear un giny nou requereix un xat capaç de construir workflows: la pestanya Chat, el Chat per a editors de Heym Work i `heym_chat`.

## Editar la disposició

Activeu **Edita** per entrar al mode d'edició, on podeu arrossegar ginys i redimensionar-los en una graella de 12 columnes. Els canvis de disposició es desen automàticament. Els títols dels ginys es poden editar en línia des de la capçalera del giny.

## Memòria cau i actualització

Cada giny emmagatzema a la memòria cau del servidor les seves últimes dades calculades durant un temps de vida (TTL) configurable. Mentre la memòria cau és fresca, reobrir el tauler de control serveix el resultat emmagatzemat en lloc de tornar a executar el Workflow. La memòria cau es reemplaça in situ cada vegada que es recalculen les dades (una memòria cau per giny, més una per registre en una [pàgina de detall](#detail-pages)), i s'invalida automàticament quan editeu el Workflow del giny.

Utilitzeu el botó **Actualitza** d'un giny (o **Actualitza** a la barra d'eines) per evitar la memòria cau i recalcular immediatament.
## Compartició

Els propietaris comparteixen un tauler des de la seva configuració, amb usuaris individuals (per correu electrònic) o amb qualsevol [equip](teams-tab.md) al qual pertanyin. Cada compartició és de **Lectura** o **Escriptura**; quan algú té tant una compartició personal com una d'equip, s'aplica la més permissiva.

| Acció | Propietari | Escriptura | Lectura |
|--------|:-----:|:-----:|:----:|
| Veure widgets, actualitzar-los, utilitzar l'actualització automàtica | ✓ | ✓ | ✓ |
| Obrir pàgines de detall, executar ginys d'execució | ✓ | ✓ | ✓ |
| Afegir, clonar, eliminar, canviar el nom i redimensionar widgets; generar i ajustar amb IA; marcar elements de la llista de verificació | ✓ | ✓ | |
| Obrir el workflow d'un widget a l'editor | ✓ | ✓ | |
| Canviar el nom o eliminar el tauler, definir-ne el format de registre, gestionar la compartició | ✓ | | |

**Els widgets sempre s'executen com el propietari del tauler.** Independentment de qui estigui mirant, un widget utilitza les credencials i les variables globals del propietari, i les seves execucions apareixen a l'historial d'execucions i als traços del propietari. Per tant, els companys d'equip veuen les mateixes dades sense accés als comptes que hi ha al darrere, i tots els espectadors comparteixen el mateix resultat en memòria cau per widget. Els widgets que afegeix o clona un col·laborador amb escriptura també pertanyen al propietari.

Per aquest motiu, **Escriptura** comporta la mateixa confiança que compartir un workflow per editar-lo: un col·laborador amb accés d'escriptura pot canviar què s'executa amb les seves credencials. Concediu-lo només a persones a qui permetríeu editar els vostres workflows. Una execució de prova que un col·laborador iniciï des de l'editor de workflows utilitza les seves pròpies credencials, com amb qualsevol workflow compartit; només el tauler en si s'executa com el propietari. **Lectura** no concedeix cap accés als workflows dels widgets, i els espectadors de només lectura reben el gràfic en si, però no els detalls d'execució per Node que hi ha al darrere.

Eliminar una compartició, o rebaixar-la d'escriptura a lectura, té efecte immediat.

## Relacionat

- [Node de sortida de gràfic](../nodes/chart-output-node.md)
- [Pestanya d'analítiques](analytics-tab.md) — mètriques d'execució integrades (diferents dels taulers creats per l'usuari)

## Cronogrames i diagrames de bases de dades

Trieu **Gantt** a Afegeix un giny per mostrar tasques al llarg del temps amb finalització i enllaços de dependència, o **Entity relationships (DB)** per mapar taules, camps i les seves relacions. Tots dos tipus utilitzen el [node Chart Output](../nodes/chart-output-node.md#gantt-schedules) i també estan disponibles a les pàgines de Heym Work. Quan Work suggereix ginys per a un calendari o esquema de base de dades, dibuixa visualitzacions prèvies a partir de les tasques o entitats proposades.
