# Organització de Workflows

Heym us permet organitzar els workflows en carpetes, crear subcarpetes i programar l'eliminació de workflows. Consulteu la [Pestanya Workflows](../tabs/workflows-tab.md) per a la visió general de la interfície.

## Carpetes i subcarpetes

Les carpetes formen un arbre. Cada carpeta té:

- **Name** – Nom de visualització
- **Parent** – `parent_id` enllaça amb una altra carpeta; `null` significa arrel
- **Workflows** – Els workflows es poden moure a carpetes mitjançant `folder_id`

### API

| Endpoint | Propòsit |
|----------|---------|
| `GET /folders` | Només carpetes arrel |
| `GET /folders/tree` | Arbre complet (fills + workflows) |
| `GET /folders/{id}` | Una sola carpeta amb el seu contingut |
| `POST /folders` | Crear carpeta (`parent_id` opcional) |
| `PUT /folders/{id}` | Actualitzar el nom o `parent_id` |
| `DELETE /folders/{id}` | Eliminar carpeta (en cascada) |
| `PUT /folders/{folder_id}/workflows/{workflow_id}` | Moure workflow a la carpeta |
| `DELETE /folders/workflows/{workflow_id}/folder` | Treure workflow de la carpeta |
| `GET /folders/{id}/export` | Descarregar carpeta + totes les subcarpetes com a ZIP |

### Estructura d'arbre

La resposta de l'arbre inclou `children` i `workflows` per carpeta. Els workflows compartits poden aparèixer en una carpeta mitjançant `WorkflowShare.folder_id`.

## Compartir workflows

Obriu **Share** a l'editor del workflow per convidar usuaris per correu electrònic o compartir amb un [equip](./teams.md). Cada invitació i cada compartició amb un equip comporta un permís:

| Permís | Què pot fer el col·laborador |
|------------|------------------------------|
| **Read** | Obrir el workflow, inspeccionar-lo, veure l'historial d'execucions i executar-lo. L'editor s'obre en mode de només lectura: Save està desactivat i el canvas no es pot modificar. |
| **Write** | Tot el que permet Read, més editar el canvas, la configuració, el document d'anàlisi i la memòria de l'agent. |

El permís es mostra al costat de cada entrada del diàleg Share i es pot canviar en qualsevol moment des d'aquest desplegable, sense treure i tornar a afegir la compartició. Quan un usuari arriba a un workflow per diverses vies (una compartició directa i un o més equips), guanya el permís **més alt**. Les comparticions que existien abans que s'introduïssin els permisos són **Write**, i els clients d'API que ometen `permission` també obtenen **Write**.

Les accions exclusives del propietari mai no depenen del permís: eliminar un workflow, revertir o netejar versions, netejar l'historial, gestionar comparticions i la [configuració exclusiva del propietari](#owner-only-settings) següent romanen amb el propietari fins i tot per als col·laboradors amb **Write**. Un col·laborador amb **Read** que enviï una edició mitjançant l'API (`PUT /api/workflows/{id}`, la nota d'anàlisi, la memòria de l'agent, la neteja de la memòria cau) o mitjançant l'Assistent d'IA rep `403` amb `You have read-only access to this workflow`.

Compartir un workflow concedeix accés al canvas, a l'historial d'execucions i al document d'anàlisi. **No** comparteix automàticament:

- Les **Credencials** referenciades pels nodes del workflow
- Els **sub-workflows** cridats per nodes [Execute](../nodes/execute-node.md) o agents

Els destinataris necessiten que aquestes credencials i workflows fills es comparteixin amb ells per separat (mateixos usuaris o equips). Compartiu credencials des de la [Pestanya Credencials](../tabs/credentials-tab.md); consulteu [Compartició de credencials](./credentials-sharing.md). Compartiu cada sub-workflow des del seu propi diàleg de compartició de l'editor.

### Configuració exclusiva del propietari

Tota la configuració de **Run with cURL** roman amb el propietari després de compartir. Els col·laboradors encara obren el diàleg i copien l'ordre generada, però els controls són de només lectura.

Canviar qualsevol d'aquests com a no propietari es rebutja amb `403`:

- **Authentication** (`auth_type`) i **Header Key** (`auth_header_key`)
- El mode **Request Body** (`webhook_body_mode`) i **Request Method** (`http_method`)
- **Response Cache** (`cache_ttl_seconds`) i **Rate Limit** (`rate_limit_requests`, `rate_limit_window_seconds`)
- **SSE Streaming** (`sse_enabled`, `sse_node_config`)

**Header Value** (`auth_header_value`) es comporta de manera diferent: s'amaga completament als col·laboradors, i l'escriptura d'un col·laborador s'ignora en lloc de rebutjar-se. L'editor mostra el camp emmascarat, de manera que un `403` aquí trencaria un desament ordinari en lloc de senyalar un atac.

L'autenticació és la raó per la qual el bloc és exclusiu del propietari: `Anonymous` permet que cridadors no autenticats executin el workflow, i una execució sense cap cridador autenticat resol les credencials i les variables globals com el **propietari**, no com el cridador. La resta del bloc és el contracte de petició publicat i els controls de cost del propietari, de manera que es mou amb ell.

**On error, run workflow** (`error_workflow_id`) al tauler **Properties** a nivell de workflow és exclusiu del propietari per la mateixa raó: el [workflow d'error](./features.md#error-workflow) s'executa amb les credencials i les variables globals de l'execució fallida, que són les del propietari per a execucions activades i anònimes. Els col·laboradors veuen la configuració en només lectura, i afegir-la, substituir-la o netejar-la com a no propietari es rebutja amb `403`.

Editar el canvas, el nom i la descripció no es veu afectat.
### Tokens d'execució

Un col·laborador pot generar un token d'execució per a un workflow compartit amb ell. L'execució s'atribueix a **qui ha generat el token**, de manera que utilitza les credencials i les variables globals d'aquest usuari, no les del propietari. Només una crida genuïnament anònima — `auth_type: anonymous` sense cap sol·licitant — s'executa en el context del propietari.

## Programats per a eliminació

Els workflows es poden programar per a eliminació en lloc de suprimir-los immediatament.

- **Camp**: `scheduled_for_deletion` (datetime nullable)
- **Comportament**: quan s'estableix, el workflow passa a `folder_id = null` i apareix a la secció "Programats per a eliminació".

### API

| Endpoint | Propòsit |
|----------|---------|
| `PUT /workflows/{id}/schedule-deletion` | Estableix `scheduled_for_deletion`, buida `folder_id` |
| `DELETE /workflows/{id}/schedule-deletion` | Buida `scheduled_for_deletion` (restaura) |

### Interfície d'usuari

- **Arrossegar a la paperera** – Deixeu anar els workflows a l'àrea "Programats per a eliminació" per programar-los
- **Restaurar** – Elimina de la programació
- **Eliminar immediatament** – Icona de paperera per a l'eliminació permanent

### Lògica de neteja

Un treball cron s'executa diàriament a les **23:59** (zona horària configurada). Un workflow només s'elimina quan:

- **Tots els nodes d'inici** (nodes sense arestes entrants, excloent sticky/errorHandler) tenen `active === false`

Si qualsevol node d'inici encara és actiu, el workflow roman fins a la propera execució.

## Interfície del tauler

- **Files de carpetes** – Carpeta nova, arbre de carpetes recursiu amb expandir/contraure. Cada carpeta porta una
  descripció opcional sota el seu nom i una insígnia que compta els workflows que conté, incloent-hi les subcarpetes.
- **Accions de carpeta** – Carpeta secundària nova, Canviar nom, Canviar icona, Baixar com a ZIP i Eliminar es mostren en línia
  a cada fila de carpeta; el menú contextual del clic dret ofereix el mateix conjunt, i els telèfons mostren un únic
  botó de menú.
- **Àrea principal** – Workflows arrel (sense carpeta, no programats) i Programats per a eliminació
- **Previsualització de destinació de carpeta** – En arrossegar un workflow es ressalta la carpeta o subcarpeta exacta i
  es mostra la seva ruta completa en una previsualització de la mida d'una targeta. Una carpeta contraiguda s'expandeix després d'una breu permanència.
- **Retroalimentació d'arrossegament estable** – La targeta d'origen utilitza un fantasma d'arrossegament, i la destinació activa roman
  seleccionada mentre es desplaça o es creuen controls dins de la mateixa carpeta.
- **Comprovació de destinació** – La carpeta actual es mostra com a **Ja a la carpeta** i no accepta
  un moviment redundant.
- **Altres zones de destinació** – L'arrel i "Programats per a eliminació" es ressalten quan poden acceptar el
  workflow arrossegat.
- **Arrossegar ZIP** – Deixeu anar un fitxer ZIP sobre l'àrea de workflows per importar una estructura de carpetes a nivell arrel

## Relacionat

- [Pestanya Workflows](../tabs/workflows-tab.md) – Creeu i gestioneu workflows
- [Compartició de credencials](./credentials-sharing.md) – Compartiu credencials amb col·laboradors de workflows
- [Equips](./teams.md) – Compartiu workflows i credencials amb equips
- [Conceptes bàsics](../getting-started/core-concepts.md) – Workflows, nodes i execució
- [Estructura del workflow](./workflow-structure.md) – Format JSON per a workflows
- [Triggers](./triggers.md) – Nodes d'inici i punts d'entrada
