# DataTable

La pestanya **DataTable** us permet crear i gestionar taules de dades estructurades directament a Heym. Les taules es poden utilitzar en workflows mitjançant el [Node DataTable](../nodes/datatable-node.md) per a operacions CRUD programàtiques.

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Vegeu la demostració de DataTable</a></p>

## Crear una taula

1. Navegueu a la pestanya DataTable des del tauler de control
2. Feu clic a **Create DataTable**
3. Introduïu un nom i una descripció opcional
4. Afegiu columnes amb l'editor de columnes

## Columnes

Cada columna té:

| Propietat | Descripció |
|----------|-------------|
| Name | Nom de visualització de la columna |
| Type | `string`, `number`, `boolean`, `date` o `json` |
| Required | Si les files noves han d'incloure aquesta columna |
| Unique | Si els valors han de ser únics entre files |
| Default Value | S'omple automàticament quan una fila omet aquesta columna |

Afegiu, editeu o elimineu columnes des de la capçalera de la vista de detall de la taula.

## Generar columnes amb IA

En lloc d'afegir columnes manualment, podeu descriure la taula en llenguatge natural (o enganxar un JSON d'exemple) i deixar que un LLM proposi l'esquema. Tots dos punts d'entrada obren el mateix diàleg:

- **Generate with AI** (capçalera de la llista de DataTable) — crea una taula completament nova a partir de la vostra descripció.
- **AI columns** (vista de detall de la taula, al costat dels controls de columnes) — proposa columnes *noves* per afegir a la taula que teniu oberta.

### Com funciona

1. Trieu una **credencial LLM** i un **model** (per defecte, la vostra primera credencial LLM i el seu model més recent).
2. Escriviu una descripció — per exemple *"Una taula de llibres amb títol, autor, nombre de pàgines i si l'he llegit"* — o enganxeu un JSON d'exemple/esquema.
3. Feu clic a **Generate**. El model retorna un esquema suggerit.
4. Reviseu les columnes generades en un formulari editable: canvieu el **name**, **type**, **default**, **unique** i **notEmpty** (obligatori) de cadascuna, elimineu les columnes no desitjades o feu clic a **Add column** manualment. Per a una taula nova, també podeu editar el **name** i la **description** suggerits per la IA.
5. Feu clic a **Create Table** (taula nova) o **Add Columns** (taula existent) per desar. Premeu **Esc** per tancar el diàleg en qualsevol moment.

### Només afegir per a taules existents

Quan genereu columnes per a una taula existent, el model veu les vostres columnes actuals com a context i proposa **només columnes noves**. Les columnes existents i les seves dades no es modifiquen ni s'eliminen mai — les columnes generades s'afegeixen. Els noms duplicats (sense distinció de majúscules i minúscules) s'eliminen automàticament.

> Es requereix una credencial LLM (OpenAI, Google o Custom). Si no en teniu cap, afegiu-ne una a Settings primer.

## Gestionar files

- **Afegir fila**: Feu clic al botó d'afegir per crear una fila nova
- **Edició en línia**: Feu doble clic a qualsevol cel·la per editar-ne el valor. Premeu Enter o feu clic fora per desar, Escape per cancel·lar
- **Eliminar fila**: Utilitzeu el menú d'accions de la fila per eliminar una fila
- **Paginació**: Les files es mostren de 25 en 25 amb navegació de pàgines

## Importació/Exportació CSV

### Importació
1. Feu clic a **Import CSV** a la vista de detall de la taula
2. Seleccioneu un fitxer CSV per pujar
3. Previsualitzeu les primeres 5 files i el mapatge de columnes
4. Les columnes verdes coincideixen amb columnes existents de la taula; les grogues no coincideixen
5. Feu clic a Import per inserir files en bloc

### Exportació
Feu clic a **Export CSV** per descarregar totes les files com a fitxer CSV.

## Compartir

Compartiu taules amb altres usuaris o equips:

1. Obriu el diàleg de compartir des de la vista de detall de la taula
2. Afegiu usuaris per correu electrònic amb permís de **read** o **write**
3. Afegiu equips amb permís de **read** o **write**
4. Els usuaris de només lectura poden veure les dades; els usuaris d'escriptura poden modificar files

## Crear taules des de l'Assistent d'IA

L'[Assistent d'IA](../reference/ai-assistant.md#data-tables) del canvas, el [Chat](./chat-tab.md) i l'eina `heym_chat` de la [pestanya MCP](./mcp-tab.md) poden triar una de les vostres taules per a un workflow que construeixin, o crear-ne una de nova. Proposen un nom i columnes, i creen la taula quan envieu la targeta de pregunta. Mai no canvien les columnes d'una taula existent ni toquen les seves files: afegiu o editeu columnes aquí.

## Ús en workflows

El [Node DataTable](../nodes/datatable-node.md) connecta taules amb workflows. Les operacions inclouen find, getAll, getById, insert, update, remove i upsert. No es requereixen credencials.

## Taula de costos LLM (taula del sistema)

Una secció fixada de **System tables** apareix per sobre de les vostres taules creades per l'usuari amb una única entrada: **LLM Cost Table**. Es tracta d'una vista editable per usuari d'esquema fix dels preus per model utilitzada pels gràfics de costos de [Traces](./traces-tab.md).

### D'on provenen les dades

Heym manté una taula global de preus per model alimentada des del punt final públic de preus de Helicone (`https://www.helicone.ai/api/llm-costs`). La sincronització s'executa en segon pla la primera vegada que obriu la taula o Traces i està limitada a una obtenció cada 24 hores. Premeu **Refresh** per forçar una resincronització immediata. Els elements que Helicone elimina de la llista d'origen no s'eliminen localment, de manera que les consultes de costos històrics es mantenen estables.

### Esquema (columnes de només lectura)

| Columna | Significat |
|---|---|
| Provider | `ANTHROPIC`, `OPENAI`, `GOOGLE`, … (informatiu, utilitzat per Helicone) |
| Model | Identificador del model que es compara amb `trace.model` |
| Op | Operador de coincidència: `equals`, `startsWith` o `includes` |
| Input $/1M | USD per 1 milió de tokens d'entrada |
| Output $/1M | USD per 1 milió de tokens de sortida |
| Source | `helicone`, `seed` o `user` |
### Personalització de preus

- **Editeu una fila** per substituir-ne els preus. La vostra substitució és per usuari i es marca amb una etiqueta `Customized`; les sincronitzacions futures amb Helicone la deixaran intacta.
- **Restableix al valor predeterminat** elimina la substitució i restaura el valor global d'aquella fila.
- **Afegeix un model personalitzat** obre un diàleg per crear una fila exclusiva de l'usuari (per exemple, un model privat amb ajust fi que Helicone no llista). Les files personalitzades es marquen com a `User added` i, en eliminar-les, s'esborren completament.

### Coincidència amb les traces

Quan el tauler de Traces calcula el cost, compara cada `trace.model` amb:

1. Les vostres substitucions (coincidència exacta amb el nom del model) primer
2. En cas contrari, la taula global — la coincidència exacta `equals` té prioritat sobre `startsWith`/`includes`; els empats dins del mateix operador es resolen pel prefix/subcadena de model coincident més llarg

Si cap fila coincideix, el model es llista sota l'avís de **Models sense preu** a la pàgina de Traces; la seva contribució al cost és zero fins que afegiu una fila personalitzada o en substituïu una.

## Relacionat

- [Node DataTable](../nodes/datatable-node.md) - Referència del node de Workflow
- [Pestanya Traces](./traces-tab.md) - Utilitza la taula de costos d'LLM per al gràfic de donut de costos i les targetes KPI
- [Node Grist](../nodes/grist-node.md) - Alternativa de full de càlcul extern
- [Pestanya Variables](./global-variables-tab.md) - Alternativa d'emmagatzematge clau-valor
