# Pestaña Credenciales

La pestaña **Credenciales** gestiona las claves de API y los secretos utilizados por los nodos. Añada credenciales aquí y referéncielas por su nombre en los nodos del workflow. Para obtener una visión general de qué son las credenciales y cómo las utilizan los nodos, consulte [Credenciales](../reference/credentials.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Ver la demostración de Credenciales</a></p>

## Tipos de credenciales

| Tipo | Caso de uso |
|------|----------|
| **OpenAI** | Clave de API de OpenAI para nodos LLM, Agent y RAG |
| **Google** | Clave de API de Google AI (Gemini) |
| **GitHub** | Token de acceso personal (PAT) de GitHub para la API de GitHub, workflows con el nodo GitHub, servidores MCP y workflows de agentes; `base_url` opcional para GitHub Enterprise |
| **Linear** | Clave de API personal de Linear u OAuth2 para equipos, proyectos, issues y comentarios |
| **Notion** | Token de integración interna o autorización de espacio de trabajo mediante OAuth de integración pública |
| **Custom** | Endpoints LLM personalizados |
| **Bearer** | Token Bearer para autenticación HTTP |
| **Header** | Par clave-valor de cabecera personalizada para solicitudes HTTP |
| **Telegram** | Token de bot de Telegram y secreto de webhook opcional |
| **Slack** | URL de webhook entrante de Slack |
| **Discord** | URL de webhook entrante de Discord |
| **Discord Trigger** | Clave pública de la aplicación de Discord |
| **IMAP** | Credenciales del trigger de buzón entrante |
| **SMTP** | Credenciales para el envío de correo electrónico |
| **Redis** | Conexión a Redis |
| **RAG: Qdrant + OpenAI** | Almacén vectorial para nodos RAG, respaldado por un servidor Qdrant externo |
| **RAG: Psql + OpenAI** | Almacén vectorial para nodos RAG, respaldado por la propia base de datos Postgres de Heym (pgvector) — sin servicio externo |
| **RAG: Custom Embeddings** | Almacén vectorial para nodos RAG que utiliza cualquier endpoint de embeddings compatible con OpenAI, con Qdrant o Postgres (pgvector) como almacén |
| **Cohere** | API de Cohere para embeddings |

## Añadir credenciales

1. Haga clic en **Add Credential**
2. Elija el tipo de credencial
3. Introduzca los valores requeridos (clave de API, URL, etc.)
4. Asígnele un nombre para referenciarla en los nodos

Para GitHub, el flujo de credenciales actual se basa en PAT. Se recomiendan los PAT de grano fino. Los flujos de instalación de GitHub App no son de primera clase en la interfaz actualmente. Si utiliza GitHub Enterprise Server, también puede establecer una URL base opcional de la API de GitHub, como `https://github.example.com/api/v3`.

Para Linear, elija **Personal API key** u **OAuth2** en el diálogo. Las claves de API personales se crean
en **Settings → Security & Access → Personal API keys** en Linear. OAuth2 utiliza un Client ID y un
Client Secret de una aplicación OAuth de Linear, con `{FRONTEND_URL}/api/credentials/linear/oauth/callback`
registrado como URI de redirección. La credencial actúa con los permisos del usuario de Linear que la
creó o autorizó. Utilice **Test Connection** en el diálogo de la credencial para verificar la clave de API o el
token OAuth antes de guardar.

Para **Notion**, elija **Internal token** u **OAuth** en el diálogo. OAuth utiliza el Client ID y el
Client Secret de su integración pública de Notion; Heym los almacena cifrados en la credencial.
Utilice **Test Connection** para verificar las credenciales de Supabase, Linear o Notion antes de guardar un workflow. Consulte
[Integraciones de terceros](../reference/integrations.md#notion) para obtener detalles sobre la configuración de Notion.

Las credenciales OAuth abren la página de autorización del proveedor en una ventana emergente. Si el navegador la bloquea, utilice el enlace **Open the authorization page** situado bajo el botón Connect; el diálogo notifica cuándo se completa la conexión. Una vez conectada una nueva credencial, el botón muestra **Connected**.

## Editar y eliminar

- **Edit** – Actualizar los valores de la credencial (los valores sensibles se enmascaran)
- **Delete** – Eliminar una credencial; los workflows que la utilicen necesitarán un reemplazo

Al editar una credencial de **GitHub** en GitHub Enterprise Server, dejar vacía la **GitHub
API Base URL** opcional conserva el endpoint de Enterprise existente. Introduzca una nueva URL solo cuando
desee cambiar dicho endpoint.

## Compartir

- [Comparta credenciales](../reference/credentials-sharing.md) con otros usuarios por correo electrónico o con [Equipos](../reference/teams.md)
- Las credenciales compartidas aparecen con un indicador
- Revoque el uso compartido desde el menú de la tarjeta de la credencial

## Uso en Nodos

Haga referencia a las credenciales por nombre en la configuración del nodo. Por ejemplo:
- [Nodo LLM](../nodes/llm-node.md) – Seleccione la credencial para la API del modelo
- [Nodo HTTP](../nodes/http-node.md) – Utilice credenciales Bearer o Header para la autenticación
- [Nodo de agente](../nodes/agent-node.md) – Introduzca tokens de GitHub en las variables de entorno del servidor MCP, como `GITHUB_PERSONAL_ACCESS_TOKEN`
- [Nodo de GitHub](../nodes/github-node.md) – Ejecute operaciones nativas de GitHub sobre repositorios, usuarios, issues, revisiones, releases, workflows, tráfico y archivos
- [Nodo de Linear](../nodes/linear-node.md) – Lea metadatos del espacio de trabajo y automatice issues y comentarios de Linear
- [Nodo de Notion](../nodes/notion-node.md) – Gestione bases de datos, fuentes de datos, páginas y bloques de Notion
- [Nodo RAG](../nodes/rag-node.md) – Utilice una credencial de Qdrant o Postgres (pgvector) para el almacén vectorial
- [Nodo Trigger de Telegram](../nodes/telegram-trigger-node.md) – Reciba webhooks del bot de Telegram
- [Nodo de Telegram](../nodes/telegram-node.md) – Envíe mensajes del bot de Telegram
- [Nodo Trigger de Discord](../nodes/discord-trigger-node.md) – Reciba webhooks de interacción de Discord
- [Nodo de Discord](../nodes/discord-node.md) – Envíe mensajes de webhook de Discord
- [Nodo Trigger de IMAP](../nodes/imap-trigger-node.md) – Consulte un buzón compartido en busca de correos nuevos

Consulte [Expression DSL](../reference/expression-dsl.md) para hacer referencia a valores respaldados por credenciales en expresiones.

## Relacionado

- [Integraciones de terceros](../reference/integrations.md) – Guía detallada de configuración para cada tipo de credencial (Telegram, Discord, Qdrant, Grist, IMAP, SMTP, RabbitMQ, Redis, Slack y más)
- [Uso compartido de credenciales](../reference/credentials-sharing.md) – Comparta credenciales con otros usuarios
- [Seguridad](../reference/security.md) – Cifrado en reposo, gestión de sesiones, limitación de tasa
- [Tipos de nodos](../reference/node-types.md) – Nodos que utilizan credenciales ([LLM](../nodes/llm-node.md), [Agente](../nodes/agent-node.md), [GitHub](../nodes/github-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Enviar correo electrónico](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md))
- [Pestaña Vectorstores](./vectorstores-tab.md) – Utiliza credenciales de Qdrant o Postgres (pgvector)
- [Pestaña Chat](./chat-tab.md) – Utiliza credenciales de OpenAI/Google
- [Contextual Showcase](../reference/contextual-showcase.md) – Guía compacta de páginas para las superficies del panel
