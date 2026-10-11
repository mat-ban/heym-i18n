# Pestanya Workflows

La pestanya **Workflows** és la vista de tauler per defecte. Mostra la llista de workflows, l'estructura de carpetes i permet crear, editar i organitzar workflows.

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Vegeu la demostració de Workflows</a></p>

## Inicieu un xat

A sobre de la llista de workflows hi ha un quadre de xat que us saluda pel vostre nom i us pregunta què voleu automatitzar. Escriviu un prompt, opcionalment adjunteu un fitxer i trieu la credencial i el model que vulgueu. Tots dos desplegables són cercables i s'inicien amb els vostres [valors predeterminats d'IA](../reference/user-settings.md).

En enviar-lo es crea una conversa nova i s'obre a la [pestanya Chat](./chat-tab.md), on la resposta s'emet en temps real. Els adjunts admesos són fitxers de text, imatges i PDF, un per missatge, igual que al compositor del xat.

Si encara no teniu cap credencial d'LLM, el quadre mostra un enllaç a la [pestanya Credentials](./credentials-tab.md) i l'enviament queda desactivat.

Feu clic a la **x** per amagar el quadre. Aleshores apareix un botó **Ask AI** al costat de l'encapçalament de Workflows que el torna a mostrar. L'elecció es recorda al vostre navegador.

## Llista de workflows

La llista és una vista de dos panells: els workflows i les carpetes a l'esquerra, una previsualització del workflow seleccionat a la dreta.

- Cada fila mostra la icona del workflow, el nom, la descripció, quan es va actualitzar per darrera vegada i un [indicador d'estat](#estat-del-workflow)
- Els workflows poden ser a l'arrel o dins de carpetes, i els workflows fixats apareixen al seu propi grup **Pinned** a la part superior
- **Feu clic** en una fila per seleccionar-la i carregar-ne la previsualització a la dreta
- **Feu doble clic** en una fila, o premeu **Enter** mentre està enfocada, per obrir-la a l'[editor](../getting-started/quick-start.md)
- Utilitzeu **Ctrl+clic** (o **Cmd+clic**) per obrir-la en una pestanya nova
- Cada fila porta les seves accions d'edició, còpia, fixació i eliminació a la dreta. Als telèfons queden ocultes perquè el nom ocupi tota l'amplada; allà, feu una **pulsació llarga** en una fila per obrir el full d'accions
- Fixeu els workflows d'ús freqüent al [Quick Drawer](../reference/quick-drawer.md) per poder executar-los ràpidament des de la pestanya Workflows i altres pàgines internes

## Previsualització del workflow

En seleccionar un workflow s'omple el panell de previsualització que hi ha al costat de la llista. En pantalles de menys de 1280px, el mateix panell s'obre com un full des de la part inferior de la pantalla.

El panell mostra:

- El nom del workflow, qui el va crear i quan, i quan es va editar per darrera vegada
- **Open Workflow** – obre el workflow a l'editor
- **Run Now** – obre el workflow al [Quick Drawer](../reference/quick-drawer.md), on ompliu les seves entrades i inicieu l'execució sense sortir de la llista
- **Description** – la descripció del workflow
- **Trigger Configuration** – la planificació d'un workflow cron, o el trigger d'escolta d'un workflow d'esdeveniments. Els workflows que s'invoquen per HTTP mostren un botó **Copy cURL** en lloc de l'endpoint en cru i la prosa d'autenticació: copia una petició completa amb l'URL correcta, les capçaleres, el marcador de posició d'autenticació i un cos construït a partir dels camps d'entrada del workflow. Quan el workflow publica un [portal](../reference/portal.md), el seu enllaç de xat públic també apareix aquí
- **Last Run Details** – el resultat i la durada de l'execució més recent, o una nota que indica que el workflow no s'ha executat mai
- **Workflow Steps & Sub-agents** – els nodes en ordre d'execució, cadascun amb el seu model, operació o planificació i un punt que indica si està actiu. En seleccionar un pas s'obre aquell Node a l'editor amb el seu panell de propietats ja obert

El panell queda fixat al costat de la llista mentre feu scroll, de manera que es manté llegible en una llista de workflows llarga.
## Administració d'instància

Els comptes que figuren a `HEYM_ADMIN_EMAILS` poden llistar, obrir, editar, inspeccionar l'historial d'execucions i suprimir qualsevol workflow de la instància sense necessitat de compartir-lo ni de transferir-ne la propietat. Aquest paràmetre és una llista d'adreces de correu separades per comes, que es compara sense distingir majúscules i minúscules. Una llista buida no atorga aquest accés a ningú. Reinicieu el backend després de modificar-lo.

Els administradors veuen el correu del propietari a la llista de workflows i poden cercar per aquesta adreça. Seleccioneu un workflow per obrir **Administració d'instància** a la seva previsualització:

1. **Pausa els triggers** només es mostra per als workflows que contenen un Node Cron. Desactiva el Cron del workflow i altres Nodes de trigger automàtics mitjançant un desament versionat normal. Les execucions existents poden acabar-se. Les crides manuals, d'API, de portal i de subworkflow continuen disponibles; aquesta acció no és un blocatge d'execució de tot el workflow.
2. El botó canvia a **Reprèn els triggers** mentre està en pausa, incloent-hi després de recarregar la pàgina. Reprèn torna a habilitar els triggers que l'administrador havia posat en pausa i deixa sense canvis els triggers que ja estaven desactivats. Per als workflows en pausa més antics que no tenen un estat de pausa administrativa desat, Reprèn habilita els seus triggers automàtics.
3. Utilitzeu l'acció **Suprimeix el workflow** de la fila del workflow un cop les execucions s'hagin estabilitzat. La supressió retorna un conflicte mentre hi hagi feina en execució, en cua o pendent de revisió. La supressió programada aplica la mateixa comprovació.

Poseu els triggers en pausa i deixeu que les execucions existents acabin abans de suprimir. Un trigger que ja s'ha enviat quan es posa en pausa encara es pot acabar. Utilitzeu la supressió quan el workflow ja no hagi de ser cridable.

Els secrets de webhook i la configuració d'autenticació exclusius del propietari mantenen les seves proteccions existents. L'administració no transfereix la propietat ni comparteix els registres de credencials del propietari. Les accions administratives de pausa, represa, supressió i programació apareixen al [registre d'auditoria](../reference/audit.md) amb l'administrador que les ha dut a terme i el propietari del workflow.

## Estat del workflow

Cada fila porta una etiqueta d'estat derivada dels Nodes de trigger del workflow, del seu estat d'execució en directe
i — per als workflows sense cap Node de trigger — de com es va iniciar la seva execució més recent:

| Estat | Significat |
| --- | --- |
| **Running** | El workflow té una execució en curs en aquest moment |
| **Scheduled** | Té un trigger de [cron](../nodes/cron-node.md) actiu |
| **Listening** | Té un trigger d'esdeveniment actiu, com ara un trigger de Slack, Telegram, IMAP o WebSocket |
| **Paused** | Té Nodes de trigger, però tots ells estan desactivats |
| **API** | No té Nodes de trigger i la darrera vegada es va executar mitjançant una crida HTTP al seu endpoint d'execució |
| **SubWorker** | No té Nodes de trigger i la darrera vegada es va executar com a subworkflow per part d'un workflow pare |
| **Portal** | No té Nodes de trigger i la darrera vegada es va executar des del seu [portal](../reference/portal.md) |
| **WEB** | No té Nodes de trigger i el seu únic terminal és un [mapador de sortida HTML](../nodes/html-output-mapper-node.md), de manera que cridar-lo retorna una pàgina web renderitzada |
| **Manual** | No té Nodes de trigger i mai s'ha executat, o la seva darrera execució va provenir d'una altra banda |
| **Remove Scheduled** | Està [programat per a la supressió](../reference/workflow-organization.md) |

Les etiquetes API, SubWorker i Portal llegeixen la darrera entrada de l'[historial d'execucions](./logs-tab.md) del workflow, de manera que un workflow que es crida de dues maneres mostra la que va arribar més tard. En canvi, **WEB** es decideix a partir del graf, de manera que té precedència sobre aquestes tres: un workflow que serveix pàgines es mostra com a WEB fins i tot després d'haver estat cridat per HTTP. Els Nodes de trigger sempre guanyen per sobre de tots ells: un workflow de cron que algú també crida per HTTP es manté com a **Scheduled**.

Utilitzeu el desplegable **Status** que hi ha al costat del camp de cerca per mostrar només un estat. El desplegable indica quants workflows coincideixen actualment amb cadascun. Un filtre d'estat també arriba a l'interior de les carpetes: les carpetes amb una coincidència s'expandeixen automàticament i les carpetes sense cap coincidència s'amaguen fins que esborreu el filtre.

## Workflows actius

A l'escriptori, la insígnia circular de la barra d'eines superior mostra quants workflows s'estan
executant actualment i s'actualitza automàticament cada 10 segons. Feu clic en una insígnia que no sigui zero per obrir la llista de workflows actius, que mostra fins a quatre files abans de desplaçar-se. Seleccioneu el nom d'un workflow per adjuntar l'editor a la vista en directe d'aquella execució. La insígnia de zero és informativa i no es pot obrir, i la insígnia s'amaga a les pantalles mòbils.

## Cerca

Utilitzeu el camp de cerca de workflows que hi ha al costat de **Status**, o premeu **Ctrl+F** (o **Cmd+F**), per filtrar workflows per títol o descripció. Els workflows coincidents dins de carpetes es mostren amb les seves branques de carpeta expandides. Premeu **Escape** per esborrar la cerca.
## Carpetes

- Organitzeu els workflows en [carpetes i subcarpetes](../reference/workflow-organization.md)
- Creeu carpetes amb el botó **New Folder**, donant a cadascuna un nom i una descripció opcional que es mostra sota el seu nom a la llista
- Cada fila de carpeta mostra quants workflows conté, comptant les subcarpetes, juntament amb les seves accions de nova subcarpeta, canviar nom, canviar icona, descarregar com a ZIP i eliminar. Als telèfons, la fila mostra un únic botó de menú
- Arrossegueu un workflow sobre una carpeta o subcarpeta per veure una previsualització de destinació de la mida d'una targeta. La previsualització ressaltada mostra la ruta completa de la carpeta abans de deixar anar, i en passar per sobre d'una carpeta plegada s'expandeix breument perquè pugueu arribar a carpetes niuades.
- Arrossegueu workflows entre carpetes o a l'arrel. La targeta arrossegada roman visible com un fantasma, i la destinació activa es manté ressaltada mentre feu scroll.
- Deixar anar un workflow a la seva carpeta actual està desactivat i marcat com a **Already in Folder**.
- Canvieu el nom d'una carpeta, o la seva descripció, des de la seva acció de canviar nom o el menú contextual de clic dret

## Crear workflows

1. Feu clic a **New Workflow**
2. Introduïu un nom i una descripció opcional
3. El workflow s'obre a l'editor

## Importar

Arrossegueu i deixeu anar un fitxer JSON de workflow sobre l'àrea de workflows per crear un workflow nou. Els nodes i arestes importats s'utilitzen per crear el workflow; el nom prové del camp `name` del JSON o del nom del fitxer. Consulteu [Download & Import](../reference/download-import.md) per al format JSON i les opcions d'importació.

## Compartir

Obriu un workflow a l'editor i feu clic a **Share** per convidar usuaris per correu electrònic o compartir amb un [equip](./teams-tab.md). Trieu **Read** (veure i executar) o **Write** (també editar) per a cada usuari o equip, i canvieu-ho més endavant des del desplegable al costat de l'entrada. Les credencials i els sub-workflows no es comparteixen automàticament; compartiu-los per separat amb els mateixos usuaris o equips. Consulteu [Workflow Organization](../reference/workflow-organization.md#sharing-workflows) i [Credentials Sharing](../reference/credentials-sharing.md).

## Editar i eliminar

- **Edit** – Canvieu el nom i la descripció del workflow des de l'acció d'edició de la fila
- **Delete** – Els workflows es [programen per a eliminació](../reference/workflow-organization.md); es mouen a una àrea de paperera abans de l'eliminació permanent

## Edicions concurrents

En desar s'envia la revisió en què es basen les vostres edicions, i el servidor rebutja l'escriptura si el workflow ha canviat mentrestant — per exemple perquè un company l'ha desat, o perquè heu deixat el mateix workflow obert en una segona pestanya. Aleshores Heym mostra un diàleg **Stale Workflow Detected** amb dues opcions:

- **Cancel** – Manté els vostres canvis no desats a l'editor perquè pugueu recarregar en una altra pestanya i reconciliar-los
- **Override** – Desa igualment, substituint la versió de l'altra persona

**Executar** un workflow el desa primer, de manera que passa per la mateixa comprovació. Si el workflow ha canviat per sota vostre, l'execució es pausa al diàleg en lloc de sobreescriure silenciosament: **Override and Run** desa la vostra versió i inicia l'execució, **Cancel Run** abandona ambdues coses i deixa les vostres edicions intactes.

La comprovació forma part de la mateixa sol·licitud de desament, de manera que no costa cap round trip addicional i no hi ha cap finestra en què un desament pugui passar-hi per alt. Els vostres propis canvis des d'altres llocs de l'aplicació — un canvi de nom, un canvi de configuració, un commutador del panell de propietats — mai no compten com a conflicte.

## Paleta d'ordres

Premeu **Ctrl+K** (o **Cmd+K**) per obrir la paleta d'ordres. Podeu:
- Cercar workflows per nom
- Saltar a qualsevol [pestanya del dashboard](./credentials-tab.md)
- Obrir workflows recents

## Relacionat

- [Quick Start](../getting-started/quick-start.md) – Creeu el vostre primer workflow
- [Workflow Organization](../reference/workflow-organization.md) – Carpetes, subcarpetes i eliminació programada
- [Workflow Structure](../reference/workflow-structure.md) – Format JSON per als workflows
- [Download & Import](../reference/download-import.md) – Exporteu i importeu workflows com a JSON
- [Portal](../reference/portal.md) – Exposeu workflows com a interfícies de xat públiques
- [Board](./board-tab.md) – Executeu workflows des de targetes kanban mitjançant cadenes de columnes
- [Core Concepts](../getting-started/core-concepts.md) – Workflows, nodes i execució
- [Execution History](../reference/execution-history.md) – Vegeu execucions passades i Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Fixeu i executeu workflows des del dashboard, la documentació i altres pàgines que no són de l'editor
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia breu de pàgina per a les superfícies del dashboard
