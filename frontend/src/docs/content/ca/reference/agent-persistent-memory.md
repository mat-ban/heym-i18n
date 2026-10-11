# Memòria Persistent de l'Agent

Els nodes Agent poden mantenir un **graf de coneixement per node** emmagatzemat a la base de dades: entitats (amb tipus i propietats) i relacions entre elles. Quan està habilitat, Heym **injecta un resum d'aquest graf al system prompt** a cada execució (si el graf no és buit). Després d'una execució correcta, una **tasca d'extracció mitjançant LLM** fusiona els nous fets de la conversa al graf en segon pla.

Els sub-agents i els orquestradors utilitzen per defecte el graf vinculat al **seu propi node del canvas**. També podeu **concedir a altres agents accés de lectura o de lectura/escriptura** al graf d'aquest node (incloent-hi agents d'**altres workflows** que siguin de la vostra propietat); consulteu [Compartir amb altres agents](#sharing-with-other-agents).

## Habilitació

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Quan és `true`, carrega el graf d'aquest node al system prompt i programa l'extracció posterior a l'execució per al graf d'aquest node |
| `memoryShares` | array (opcional) | Concedeix a altres nodes Agent accés al graf de memòria d'**aquest** node; consulteu [Compartir](#sharing-with-other-agents) |

Activeu-ho a les propietats del node Agent (**Persistent memory (graph)**). Una icona rosa de **cervell** al node obre l'editor del graf quan la memòria està habilitada (o quan es mostra un model).

## Editor del graf

El diàleg representa les entitats com un graf animat dirigit per forces —cercles acolorits dimensionats pel nombre de connexions i agrupats per tipus d'entitat—, a més d'edició i navegació (ajustar la vista, disposició ordenada, dreceres de teclat). Podeu **afegir, editar o eliminar** nodes i arestes manualment; els selectors de relació Source/Target són cercables per a grafs amb moltes entitats. En seleccionar un node es mostren les seves connexions sortints i entrants, cadascuna clicable per saltar a aquell node. Els canvis s'apliquen només al graf d'**aquest** agent (el graf del node del canvas el cervell del qual heu obert).

## Compartir amb altres agents

Al diàleg del graf de memòria, **Share memory with other agents** us permet adjuntar **peers** que poden consumir aquest graf en temps d'execució:

1. Trieu un **workflow** (qualsevol workflow que pugueu obrir a l'editor).
2. Trieu un node **agent** en aquell workflow.
3. Establiu **Read only** o **Read & write**.

| Permís | Efecte |
|------------|--------|
| Read only | Quan s'executa l'agent **peer**, aquest graf es fusiona al system prompt del peer (si té entitats). No hi ha extracció cap a aquest graf a partir de l'execució del peer. |
| Read & write | Mateix comportament de prompt que read, i després d'una compleció **correcta** del peer, l'extracció de memòria habitual també pot **fusionar-se en aquest graf (propietari)** utilitzant la credencial de l'execució del peer. |

Els peers s'emmagatzemen per node propietari com a entrades `memoryShares` amb `peerWorkflowId` i `peerCanvasNodeId` (i `permission`). Els workflows més antics poden ometre `peerWorkflowId` per a peers del **mateix** workflow; l'editor ho tracta com el workflow actual.

La **compartició entre workflows** es resol en temps d'execució escanejant els workflows **que posseïu**. Les execucions sense un context d'usuari autenticat només resolen les comparticions definides al JSON del workflow **actual** (mateix canvas).

## Comportament en temps d'execució

### Graf propi (`persistentMemoryEnabled`)

1. **Abans de la crida al LLM** — Si el graf té entitats, s'afegeix un bloc a la instrucció del sistema que explica que aquests són fets d'execucions anteriors (poden estar incomplets; el missatge actual de l'usuari preval en cas de conflicte).
2. **Després d'una compleció correcta** — Una tasca en segon pla demana al model (mateixa credencial que l'execució de l'agent) un JSON estructurat (entitats + relacions). Aquest payload es fusiona a la base de dades (s'apliquen la deduplicació i la neteja de relacions per a alguns tipus, p. ex. arestes d'estil laboral).

### Peer que rep grafs compartits

Quan s'executa un agent, el sistema troba nodes **propietaris** (en qualsevol dels vostres workflows, quan és possible) els `memoryShares` dels quals apunten al workflow i al node del canvas d'aquesta execució. Per a cada coincidència, el graf d'aquell propietari s'afegeix com a secció de **memòria compartida** al system prompt. Els peers amb **Read & write** a més programen objectius d'extracció per al workflow/graf **propietari** quan l'execució té èxit.

L'extracció **no** s'executa quan l'execució falla o acaba en un estat pendent de HITL.

## JSON del Workflow (camp `data`)

Es persisteix al node Agent com la resta de paràmetres:

```json
{
  "type": "agent",
  "data": {
    "label": "supportAgent",
    "persistentMemoryEnabled": true,
    "userMessage": "$input.text",
    "memoryShares": [
      {
        "peerWorkflowId": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        "peerCanvasNodeId": "agent-peer-canvas-id",
        "permission": "read"
      }
    ]
  }
}
```

`permission` és `"read"` o `"write"`. Ometeu `memoryShares` o feu servir `[]` quan no hi hagi compartició.

Consulteu [Workflow Structure](./workflow-structure.md) per a la forma completa de l'objecte node.
## Relacionat

- [Node Agent](../nodes/agent-node.md) — Configuració completa de l'agent
- [Arquitectura de l'agent](./agent-architecture.md) — Orquestrador, subagents, eines
- [Estructura del Workflow](./workflow-structure.md) — Format JSON del workflow
- [Funcions del Canvas](./canvas-features.md) — Control del cervell i diàleg del graf
- [Pestanya Execucions](../tabs/traces-tab.md) — Observabilitat de peticions/respostes del LLM
