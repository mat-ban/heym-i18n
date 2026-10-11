# Tauler de control

La pestanya **Tauler de control** és un espai a l'estil de Grafana on es construeixen graelles de ginys de gràfics. Cada giny es renderitza a partir de la sortida del seu propi Workflow de Heym ocult, de manera que qualsevol dada que es pugui produir en un Workflow —consultes a bases de dades, crides a API, cerques RAG, sortida d'un LLM— es pot convertir en un gràfic. Es poden mantenir diversos taulers de control i compartir cadascun amb persones o equips.

## Taulers de control

Tothom comença amb un tauler de control, creat la primera vegada que obre la pestanya. Utilitzeu el selector de taulers de control a la part superior de la pestanya per canviar entre taulers, i el **+** del costat per crear-ne un de nou. El selector llista primer els vostres taulers de control i després els que s'han compartit amb vosaltres, etiquetats amb el nom de la persona que els ha compartit.

La pestanya reobre el tauler de control que es va utilitzar per darrera vegada, i la barra d'adreces porta el tauler de control obert (`?tab=dashboard&dashboard=<id>`), de manera que un enllaç obre exactament aquest tauler de control per a qualsevol que hi tingui accés.

El botó de configuració (només per als propietaris) canvia el nom del tauler de control, gestiona la compartició i l'elimina. Eliminar un tauler de control suprimeix els seus ginys i els seus Workflows. Sempre es conserva almenys un tauler de control propi, de manera que l'últim no es pot eliminar.

## Ginys

Un giny és un sol gràfic a la graella. Tipus de gràfic compatibles:

- **Barres** (verticals o horitzontals)
- **Línies**
- **Àrea** (tendència farcida, admet diverses sèries)
- **Circular**
- **Taula** (amb desplaçament)
- **Numèric** (un sol valor KPI amb una unitat opcional)
- **Indicador** (un sol valor en un interval mínim–màxim, per exemple un percentatge)
- **Dispersió** (punts X/Y per a gràfics de correlació)
- **Proporció** (una barra dividida en porcions amb una llegenda de percentatges, per exemple un desglossament per idioma)
- **Indicador de barres** (un indicador horitzontal per fila amb un gradient de vermell→verd i un valor, per exemple espai de disc lliure)
- **Text** (un missatge en markdown, per exemple una nota d'estat com "Última execució a les 19:47"; admet [caselles de selecció interactives](../nodes/chart-output-node.md#interactive-task-lists) quan el markdown és estàtic, i [llistes numerades explícites](../nodes/chart-output-node.md#numbered-lists) per a numeració personalitzada o descendent)
- **HITL** (les vostres revisions humanes pendents. La capçalera mostra `1/n pending`. El nom del Workflow obre aquesta execució al canvas. **Aprova**, **Sol·licita canvis** i **Rebutja** la resolen. La icona d'historial al costat del títol del giny obre aquesta execució al diàleg d'historial d'aquesta pàgina. El giny no utilitza files d'origen, i cada persona veu la seva pròpia cua)

Cada giny carrega les seves dades de manera asíncrona quan s'obre la pestanya, de manera que la pàgina es manté àgil mentre els gràfics es van omplint.

## Afegir un giny

1. Feu clic a **Afegir giny**, doneu-li un títol i trieu un tipus de gràfic. A sota del selector, el diàleg dibuixa un exemple d'aquest tipus de gràfic amb dades de mostra i anomena les files que espera, de manera que podeu comparar tipus abans de construir res.
2. El giny s'obre a l'editor de Workflows amb un graf inicial: un Node [Set](../nodes/set-node.md) que produeix les files, connectat a un Node [Chart Output](../nodes/chart-output-node.md). Substituïu el Node Set per qualsevol font de dades. Un giny **HITL** és només el Node Chart Output; llegeix les vostres revisions pendents i no necessita cap font de dades.
3. Construïu el Workflow de manera que el Node que alimenta **Chart Output** produeixi una matriu de files, i després configureu el mapatge de camps del Node Chart Output (camp d'etiqueta, camp de valor, etc.).
4. Deseu, torneu a la pestanya Tauler de control i el giny es renderitzarà.

Feu doble clic en un giny (o utilitzeu el seu botó d'edició) per reobrir el seu Workflow en qualsevol moment. Utilitzeu **Clonar giny** a la capçalera del giny per duplicar tant el giny com el seu Workflow complet. La còpia es col·loca a sota de l'original i s'etiqueta amb **(Còpia)** perquè la pugueu editar de manera independent.

## Generar un giny amb IA

Feu clic a **IA**, descriviu la mètrica que voleu (per exemple, "taxa d'èxit dels Workflows durant els últims 30 dies com a gràfic de barres") i trieu una credencial d'LLM i un model. Heym genera un Workflow de giny complet que acaba en un Node Chart Output i l'afegeix a la graella. Consulteu [Chart Output](../nodes/chart-output-node.md#example-ai-prompts) per veure exemples de Prompts per tipus de gràfic.

Utilitzeu el botó **Ajustar amb IA** d'un giny per revisar un giny existent amb una instrucció nova. Cada ajust amb IA fa una instantània del Workflow anterior a l'**Historial d'edicions** del giny, de manera que podeu revisar o revertir els canvis des de l'editor de Workflows.

## Editar la disposició

Activeu **Edita** per entrar al mode d'edició, on podeu arrossegar ginys i redimensionar-los en una graella de 12 columnes. Els canvis de disposició es desen automàticament. Els títols dels ginys es poden editar en línia des de la capçalera del giny.

## Memòria cau i actualització

Cada giny emmagatzema a la memòria cau del servidor les seves últimes dades calculades durant un temps de vida (TTL) configurable. Mentre la memòria cau és fresca, reobrir el tauler de control serveix el resultat emmagatzemat en lloc de tornar a executar el Workflow. La memòria cau es reemplaça in situ cada vegada que es recalculen les dades (una memòria cau per giny), i s'invalida automàticament quan editeu el Workflow del giny.

Utilitzeu el botó **Actualitza** d'un giny (o **Actualitza** a la barra d'eines) per evitar la memòria cau i recalcular immediatament.
## Compartició

Els propietaris comparteixen un tauler des de la seva configuració, amb usuaris individuals (per correu electrònic) o amb qualsevol [equip](teams-tab.md) al qual pertanyin. Cada compartició és de **Lectura** o **Escriptura**; quan algú té tant una compartició personal com una d'equip, s'aplica la més permissiva.

| Acció | Propietari | Escriptura | Lectura |
|--------|:-----:|:-----:|:----:|
| Veure widgets, actualitzar-los, utilitzar l'actualització automàtica | ✓ | ✓ | ✓ |
| Afegir, clonar, eliminar, canviar el nom i redimensionar widgets; generar i ajustar amb IA; marcar elements de la llista de verificació | ✓ | ✓ | |
| Obrir el workflow d'un widget a l'editor | ✓ | ✓ | |
| Canviar el nom o eliminar el tauler, gestionar la compartició | ✓ | | |

**Els widgets sempre s'executen com el propietari del tauler.** Independentment de qui estigui mirant, un widget utilitza les credencials i les variables globals del propietari, i les seves execucions apareixen a l'historial d'execucions i als traços del propietari. Per tant, els companys d'equip veuen les mateixes dades sense accés als comptes que hi ha al darrere, i tots els espectadors comparteixen el mateix resultat en memòria cau per widget. Els widgets que afegeix o clona un col·laborador amb escriptura també pertanyen al propietari.

Per aquest motiu, **Escriptura** comporta la mateixa confiança que compartir un workflow per editar-lo: un col·laborador amb accés d'escriptura pot canviar què s'executa amb les seves credencials. Concediu-lo només a persones a qui permetríeu editar els vostres workflows. Una execució de prova que un col·laborador iniciï des de l'editor de workflows utilitza les seves pròpies credencials, com amb qualsevol workflow compartit; només el tauler en si s'executa com el propietari. **Lectura** no concedeix cap accés als workflows dels widgets, i els espectadors de només lectura reben el gràfic en si, però no els detalls d'execució per Node que hi ha al darrere.

Eliminar una compartició, o rebaixar-la d'escriptura a lectura, té efecte immediat.

## Relacionat

- [Node de sortida de gràfic](../nodes/chart-output-node.md)
- [Pestanya d'analítiques](analytics-tab.md) — mètriques d'execució integrades (diferents dels taulers creats per l'usuari)
