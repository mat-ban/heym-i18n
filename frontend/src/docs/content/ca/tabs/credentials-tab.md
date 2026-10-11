# Pestanya Credentials

La pestanya **Credentials** gestiona les claus API i els secrets utilitzats pels nodes. Afegiu credencials aquí i referencieu-les pel nom als nodes del workflow. Per a una visió general de què són les credencials i com les utilitzen els nodes, consulteu [Credentials](../reference/credentials.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Watch Credentials demo</a></p>

## Tipus de credencials

| Tipus | Cas d'ús |
|------|----------|
| **OpenAI** | Claus API d'OpenAI per als nodes LLM, Agent i RAG |
| **Google** | Claus API de Google AI (Gemini) |
| **GitHub** | Token d'accés personal (PAT) de GitHub per a l'API de GitHub, workflows del node GitHub, servidors MCP i workflows d'agents; `base_url` opcional de GitHub Enterprise |
| **Linear** | Claus API personal de Linear o OAuth2 per a equips, projectes, incidències i comentaris |
| **Notion** | Token d'integració interna o autorització d'espai de treball OAuth d'integració pública |
| **Custom** | Endpoints LLM personalitzats |
| **Bearer** | Token Bearer per a autenticació HTTP |
| **Header** | Capçalera personalitzada clau-valor per a sol·licituds HTTP |
| **Telegram** | Token de bot de Telegram i secret de webhook opcional |
| **Slack** | URL de webhook entrant de Slack |
| **Discord** | URL de webhook entrant de Discord |
| **Discord Trigger** | Claus pública de l'aplicació de Discord |
| **IMAP** | Credencials del trigger de bústia d'entrada |
| **SMTP** | Credencials d'enviament de correu electrònic |
| **Redis** | Connexió Redis |
| **RAG: Qdrant + OpenAI** | Magatzem vectorial per als nodes RAG, recolzat per un servidor Qdrant extern |
| **RAG: Psql + OpenAI** | Magatzem vectorial per als nodes RAG, recolzat per la pròpia base de dades Postgres de Heym (pgvector) — sense servei extern |
| **RAG: Custom Embeddings** | Magatzem vectorial per als nodes RAG que utilitza qualsevol endpoint d'embedding compatible amb OpenAI, amb Qdrant o Postgres (pgvector) com a magatzem |
| **Cohere** | API de Cohere per a embeddings |

## Afegir credencials

1. Feu clic a **Add Credential**
2. Trieu el tipus de credencial
3. Introduïu els valors requerits (clau API, URL, etc.)
4. Doneu-li un nom per referenciar-la als nodes

Per a GitHub, el flux de credencials actual es basa en PAT. Es recomanen els PAT de gra fi. Els fluxos d'instal·lació de GitHub App no són de primera classe a la interfície actualment. Si utilitzeu GitHub Enterprise Server, també podeu establir una URL base opcional de l'API de GitHub com ara `https://github.example.com/api/v3`.

Per a Linear, trieu **Personal API key** o **OAuth2** al diàleg. Les claus API personals es creen
a **Settings → Security & Access → Personal API keys** de Linear. OAuth2 utilitza un Client ID i un
Client Secret d'aplicació OAuth de Linear, amb `{FRONTEND_URL}/api/credentials/linear/oauth/callback`
registrat com a URI de redirecció. La credencial actua amb els permisos de l'usuari de Linear que
l'ha creada o autoritzada. Utilitzeu **Test Connection** al diàleg de credencials per verificar la clau API o
el token OAuth abans de desar.

Per a **Notion**, trieu **Internal token** o **OAuth** al diàleg. OAuth utilitza el Client ID i el
Client Secret de la vostra integració pública de Notion; Heym els emmagatzema xifrats a la credencial.
Utilitzeu **Test Connection** per verificar les credencials de Supabase, Linear o Notion abans de desar un workflow. Consulteu
[Third-Party Integrations](../reference/integrations.md#notion) per als detalls de configuració de Notion.

Les credencials OAuth obren la pàgina d'autorització del proveïdor en una finestra emergent. Si el navegador la bloqueja, utilitzeu l'enllaç **Open the authorization page** sota el botó Connect; el diàleg detecta quan es completa la connexió. Un cop connectada una credencial nova, el botó mostra **Connected**.

## Editar i eliminar

- **Edit** – Actualitzeu els valors de la credencial (els valors sensibles estan emmascarats)
- **Delete** – Elimineu una credencial; els workflows que la utilitzin necessitaran un reemplaçament

En editar una credencial de **GitHub** a GitHub Enterprise Server, deixar buit el camp opcional **GitHub
API Base URL** conserva l'endpoint Enterprise existent. Introduïu una URL nova només quan
vulgueu canviar aquest endpoint.

## Compartir

- [Compartiu credencials](../reference/credentials-sharing.md) amb altres usuaris per correu electrònic o amb [Teams](../reference/teams.md)
- Les credencials compartides apareixen amb un indicador
- Revogueu la compartició des del menú de la targeta de la credencial
## Ús en Nodes

Feu referència a les credencials pel seu nom a la configuració del node. Per exemple:
- [Node LLM](../nodes/llm-node.md) – Seleccioneu la credencial per a l'API del model
- [Node HTTP](../nodes/http-node.md) – Utilitzeu credencials Bearer o Header per a l'autenticació
- [Node Agent](../nodes/agent-node.md) – Passeu tokens de GitHub a les variables d'entorn del servidor MCP com ara `GITHUB_PERSONAL_ACCESS_TOKEN`
- [Node GitHub](../nodes/github-node.md) – Executeu operacions natives de GitHub sobre repositoris, usuaris, incidències, revisions, versions, workflows, trànsit i fitxers
- [Node Linear](../nodes/linear-node.md) – Llegiu les metadades de l'espai de treball i automatitzeu incidències i comentaris de Linear
- [Node Notion](../nodes/notion-node.md) – Gestioneu bases de dades, fonts de dades, pàgines i blocs de Notion
- [Node RAG](../nodes/rag-node.md) – Utilitzeu una credencial de Qdrant o Postgres (pgvector) per a l'emmagatzematge vectorial
- [Node Telegram Trigger](../nodes/telegram-trigger-node.md) – Rebeu webhooks del bot de Telegram
- [Node Telegram](../nodes/telegram-node.md) – Envieu missatges del bot de Telegram
- [Node Discord Trigger](../nodes/discord-trigger-node.md) – Rebeu webhooks d'interacció de Discord
- [Node Discord](../nodes/discord-node.md) – Envieu missatges de webhook de Discord
- [Node IMAP Trigger](../nodes/imap-trigger-node.md) – Consulteu periòdicament una bústia compartida per detectar correus nous

Consulteu [Expression DSL](../reference/expression-dsl.md) per fer referència a valors basats en credencials dins d'expressions.

## Relacionat

- [Integracions de tercers](../reference/integrations.md) – Guia detallada de configuració per a cada tipus de credencial (Telegram, Discord, Qdrant, Grist, IMAP, SMTP, RabbitMQ, Redis, Slack i més)
- [Compartició de credencials](../reference/credentials-sharing.md) – Compartiu credencials amb altres usuaris
- [Seguretat](../reference/security.md) – Xifratge en repòs, gestió de sessions, limitació de velocitat
- [Tipus de Nodes](../reference/node-types.md) – Nodes que utilitzen credencials ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [GitHub](../nodes/github-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md))
- [Pestanya Vectorstores](./vectorstores-tab.md) – Utilitza credencials de Qdrant o Postgres (pgvector)
- [Pestanya Chat](./chat-tab.md) – Utilitza credencials d'OpenAI/Google
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia compacta de pàgines per a les interfícies del tauler
