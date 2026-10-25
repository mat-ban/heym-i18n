# Portal

El **Portal** exposa els workflows de Heym com a interfícies públiques d'estil xat. Els usuaris finals poden executar workflows mitjançant una URL sense iniciar sessió a Heym.

## Què fa

- **URL pública**: `/chat/{slug}` (p. ex. `/chat/my-workflow`)
- **Interfície de Chat**: Els usuaris interactuen a través d'una interfície de Chat (missatges, entrades, respostes)
- **Autenticació opcional**: Si hi ha usuaris del portal configurats, cal iniciar sessió; en cas contrari, el portal és públic
- **Streaming**: Progrés dels nodes en temps real durant l'execució (quan està habilitat)
- **Aturar execucions en curs**: Els usuaris poden aturar una execució del portal en curs des del peu del Chat; l'execució activa del workflow també es cancel·la al servidor
- **Pujada de fitxers**: Pujades de fitxers opcionals (text, imatges, etc.) per camp d'entrada
- **Transferència a revisió humana**: Les execucions del portal poden mostrar [enllaços de revisió HITL](./human-in-the-loop.md) quan un agent es pausa per a aprovació
- **Visualització d'imatges**: Les sortides del workflow que contenen imatges (p. ex. de generació d'imatges per LLM o captures de pantalla de Playwright) apareixen com a miniatures al Chat. Feu clic a qualsevol imatge per obrir un visor a pantalla completa; premeu **Esc** o utilitzeu el botó enrere del dispositiu per tancar-lo

## Configuració del Workflow

| Paràmetre | Descripció |
|---------|-------------|
| `portal_enabled` | Habilita el portal per a aquest workflow |
| `portal_slug` | Slug de l'URL (p. ex. `my-workflow` → `/chat/my-workflow`) |
| `portal_stream_enabled` | Utilitza execució amb streaming |
| `portal_file_upload_enabled` | Permet la pujada de fitxers |
| `portal_file_config` | Configuració de fitxers per camp (tipus, límits) |

Configureu-ho a l'editor: el botó **Portal** a la capçalera del workflow obre el diàleg de configuració del portal.

## Flux

1. **Informació**: `GET /api/portal/{slug}/info` – Retorna les metadades del workflow i els camps d'entrada (sense autenticació)
2. **Inici de sessió** (si cal): `POST /api/portal/{slug}/login` – Retorna el token de sessió
3. **Execució**: `POST /api/portal/{slug}/execute` – La interfície de Chat del portal crida aquest endpoint (o la seva variant amb streaming internament quan està habilitat); els usuaris finals interactuen a través de la interfície de Chat, no cridant l'API directament.
4. **Aturada**: `POST /api/portal/{slug}/executions/{execution_id}/cancel` – Es sol·licita quan l'usuari prem **Atura** durant una execució activa del portal

## HITL a les execucions del Portal

Si un workflow del portal arriba a un [Node Agent](../nodes/agent-node.md) amb [Human-in-the-Loop](./human-in-the-loop.md) habilitat, la resposta del portal mostra un enllaç de revisió en lloc d'aparèixer buida.

- L'estat de l'execució del workflow passa a `pending`
- El Chat del portal mostra l'URL de revisió
- Qualsevol node connectat al handle de sortida `review` de l'agent pot notificar Slack, correu electrònic o altres canals immediatament
- Un revisor completa la decisió a `/review/{token}` sense iniciar sessió
- Després de la revisió, el workflow es reprèn des de la instantània emmagatzemada

Això permet combinar fluxos de Chat públics amb passos privats d'aprovació humana.

## Camps d'entrada

Els camps d'entrada provenen dels nodes [Input](../nodes/input-node.md). L'API extreu els nodes d'inici de tipus `textInput` i els seus `inputFields`. L'execució utilitza el mateix motor que les execucions normals; les entrades es passen com a `body.inputs` i `conversation_history` per a fluxos de múltiples torns.

## Autenticació i sessions

- **WorkflowPortalUser**: Nom d'usuari/contrasenya per workflow (quan l'autenticació està habilitada)
- **Eliminar el darrer usuari**: Amb el portal habilitat, eliminar el darrer usuari del portal fa que el portal torni a ser públic; el quadre de diàleg de configuració demana confirmació prèvia
- **PortalSession**: Tokens de sessió amb un TTL de 168 hores
- **Limitació de taxa**: 3 intents d'inici de sessió fallits → bloqueig de 24 h per workflow+IP
- Les sessions expirades es netegen mitjançant una tasca cron

## Interfície de configuració

Pestanyes de **WebPortalSettingsDialog**:

1. **General**: Habilita el portal, estableix el slug, copia l'URL del portal
2. **Usuaris**: Afegeix/elimina usuaris del portal (nom d'usuari/contrasenya)
3. **Opcions**: Mode streaming, pujada de fitxers, visualització dels camps d'entrada

## Relacionat

- [Per què Heym](../getting-started/why-heym.md) – El Portal com a superfície de Chat per a agents en producció
- [Pestanya Workflows](../tabs/workflows-tab.md) – Creeu workflows i habiliteu el portal
- [Human-in-the-Loop](./human-in-the-loop.md) – Pàgines de revisió públiques per a sortides d'agents pendents
- [Triggers](./triggers.md) – El Portal com a punt d'entrada
- [Tipus de Node](./node-types.md) – [Input](../nodes/input-node.md) per a entrades del portal
- [Estructura del Workflow](./workflow-structure.md) – Nodes i arestes