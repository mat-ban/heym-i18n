# Credenciales

Las Credenciales almacenan claves de API y secretos utilizados por los nodos del workflow. Se añaden en la [Pestaña Credenciales](../tabs/credentials-tab.md) y se referencian por su nombre en la configuración del nodo.

## Qué son las Credenciales

- **Almacenadas por usuario** – Cada credencial pertenece a un usuario y puede [compartirse](./credentials-sharing.md) con otros usuarios o [Equipos](./teams.md).
- **Cifradas en reposo** – Los valores sensibles se cifran; la UI los enmascara tras su creación.
- **Referenciadas por nombre** – Los nodos seleccionan una credencial por su nombre (o ID). El motor de ejecución resuelve la credencial del propietario del workflow en tiempo de ejecución.

## Cómo las utilizan los nodos

| Tipo de nodo | Credencial típica | Propósito |
|-----------|--------------------|---------|
| [LLM](../nodes/llm-node.md), [Agente](../nodes/agent-node.md), [Evals](../tabs/evals-tab.md) | OpenAI, Google, Personalizada | Clave de API para el modelo |
| [Decisión](../nodes/decision-node.md), juez de [Evals](../tabs/evals-tab.md) | Modelo de decisión | URL base de un endpoint de modelo de decisión, más una clave de API opcional |
| [LLM](../nodes/llm-node.md), [Agente](../nodes/agent-node.md), Chat, Valores predeterminados de IA | Model Router (Auto Model) | Selecciona cuál de sus modelos atiende cada solicitud, utilizando un modelo de decisión |
| [Codex](../nodes/codex-node.md) | OpenAI Codex + GitHub | Inicio de sesión con suscripción de ChatGPT (OAuth) o un token de acceso de Codex para el runner, más un PAT de GitHub para operaciones sobre repositorios |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go + GitHub | Una clave de API de la pasarela OpenCode Go (URL base opcional) para el runner, más un PAT de GitHub para operaciones sobre repositorios |
| [Agente](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md) | GitHub | Token de acceso personal (PAT) de GitHub para llamadas a la API de GitHub, operaciones del nodo GitHub e integraciones MCP |
| [Jira](../nodes/jira-node.md) | Jira | Correo electrónico/token de API de Cloud, usuario/contraseña de Data Center o token de acceso personal, URL base del sitio de Jira, modo de despliegue y versión opcional de la API REST |
| [Linear](../nodes/linear-node.md) | Linear | Clave de API personal u OAuth2 para equipos, proyectos, incidencias y comentarios |
| [HTTP](../nodes/http-node.md) | Bearer, Header | Autenticación para solicitudes |
| [Telegram](../nodes/telegram-node.md), [Trigger de Telegram](../nodes/telegram-trigger-node.md) | Telegram | Token del bot y secreto de webhook opcional |
| [Discord](../nodes/discord-node.md) | Discord | URL de webhook entrante |
| [Trigger de Discord](../nodes/discord-trigger-node.md) | Trigger de Discord (Clave pública) | Clave pública de la aplicación para la verificación de firmas |
| [RAG](../nodes/rag-node.md) | RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, RAG: Embeddings personalizados | Conexión al almacén vectorial (Qdrant externo, o el propio Postgres de Heym mediante pgvector), con OpenAI o cualquier endpoint de embeddings compatible con OpenAI |
| [Slack](../nodes/slack-node.md) | Slack | Webhook o token de API |
| [Trigger de IMAP](../nodes/imap-trigger-node.md) | IMAP | Conexión al buzón de correo entrante |
| [Enviar correo electrónico](../nodes/send-email-node.md) | SMTP | Servidor de correo |
| [Redis](../nodes/redis-node.md) | Redis | Conexión |
| [Grist](../nodes/grist-node.md) | Grist | Clave de API + URL del servidor |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets (OAuth2) | Client ID + Client Secret + consentimiento OAuth2 |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive (OAuth2) | Client ID + Client Secret + consentimiento OAuth2 |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery (OAuth2) | Client ID + Client Secret + consentimiento OAuth2 |
| [Supabase](../nodes/supabase-node.md) | Supabase | URL del proyecto + clave de API (+ esquema predeterminado opcional) |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse | Host + puerto + usuario/contraseña + base de datos (+ secure) |
| [Notion](../nodes/notion-node.md) | Notion | Token de integración interna, o Client ID + Client Secret + consentimiento OAuth de integración pública |
| [Sentry](../nodes/sentry-node.md) | Sentry | Token de autenticación más URL base opcional para instancias autoalojadas |
| [Amazon S3](../nodes/amazon-s3-node.md) | Amazon S3 | Clave de acceso, clave secreta, región |
| [RabbitMQ](../nodes/rabbitmq-node.md) | RabbitMQ | URL de AMQP |

Para una configuración detallada (hosts, puertos, campos específicos del proveedor), consulte [Integraciones de terceros](./integrations.md). Esto incluye la configuración del bot de Telegram, el correo entrante mediante IMAP y el correo saliente mediante SMTP.

Las credenciales de GitHub también pueden incluir un `base_url` opcional cuando el destino es GitHub
Enterprise Server en lugar de GitHub.com. Al editar una credencial de GitHub para rotar el token,
dejar `base_url` vacío preserva el endpoint de Enterprise existente. Introduzca una nueva URL solo cuando
desee cambiar dicho endpoint.

Las credenciales de Jira, Linear, Supabase, Notion, Sentry y ClickHouse exponen **Probar conexión** en el diálogo de credencial. Para Jira, la comprobación llama al endpoint del usuario actual de Jira. Para Linear,
la comprobación llama a la API de Linear con `getViewer` y confirma que la clave de API o el token OAuth son válidos.
Al editar, puede probar sin volver a introducir la clave de API si el secreto almacenado sigue presente. Para Notion,
elija **Token interno** u **OAuth** en el diálogo; OAuth utiliza el Client ID y el Client Secret
de su integración pública de Notion. Consulte [Integraciones de terceros](./integrations.md#notion) para
obtener detalles sobre la configuración de Notion.

## Uso del paquete de coding

La pestaña **AI Defaults** en [Settings](./user-settings.md) muestra el uso restante del paquete de coding para sus credenciales de Codex (propias y compartidas). Para cada credencial de Codex, se representa una barra horizontal por cada ventana de límite de tasa activa — normalmente una ventana de **5 horas** y/o **Weekly**, según su plan — con el porcentaje de cuota restante y una cuenta atrás para el restablecimiento. Los datos provienen de las cabeceras de respuesta de límite de tasa del backend de Codex, obtenidas bajo demanda.

Las credenciales de OpenCode Go también aparecen listadas allí, pero marcadas como **"usage unavailable"**: la pasarela OpenCode zen no expone datos de cuota restante, por lo que no se puede mostrar ninguna barra.

## En Expresiones

Algunos nodos permiten expresiones para la autenticación. Utilice [Expression DSL](./expression-dsl.md) con `$credentials.CredentialName` para referenciar el secreto resuelto de una credencial dentro de una expresión. Para conocer la línea de cabecera que cada tipo de credencial necesita en una petición HTTP, consulte [HTTP › Authenticating with Credentials](../nodes/http-node.md#authenticating-with-credentials).

Las credenciales de Codex se excluyen intencionadamente de `$credentials`. Ya sea que inicie sesión con ChatGPT (suscripción, sin coste de API por token) o pegue un `access_token` de Codex, los tokens solo se pasan al proceso local del runner de Codex. Los tokens de inicio de sesión de ChatGPT se renuevan automáticamente a medida que expiran.

Las credenciales de Jira también se excluyen de `$credentials`. El [Nodo de Jira](../nodes/jira-node.md) carga la credencial mediante `credentialId` en tiempo de ejecución. Para llamadas REST personalizadas a Jira no cubiertas por el Nodo de Jira, utilice el [Nodo HTTP](../nodes/http-node.md) con Jira Basic Auth (`email:api_token` para Jira Cloud o `username:password` para Data Center / Server), por ejemplo `curl -u you@example.com:YOUR_API_TOKEN https://your-domain.atlassian.net/rest/api/3/myself`. También puede utilizar una credencial de tipo [Header](../nodes/http-node.md) con `Authorization: Basic <base64(user:secret)>`. Para tokens de acceso personal de Jira Data Center / Server, envíe `Authorization: Bearer <token>` en su lugar; la propia credencial de Jira lo admite a través de su modo de autenticación **Personal Access Token**.

| Tipo de credencial | Valor expuesto a `$credentials.Name` |
|-----------------|--------------------------------------|
| Bearer | Cadena de token Bearer |
| Header | Línea completa `header key: header value`, lista para insertar en un argumento `-H` de cURL |
| GitHub | Token de acceso personal |
| Notion | `api_token` interno o `access_token` de OAuth (token Bearer para llamadas a la API de Notion) |
| Sentry | Token de autenticación de Sentry |
| Discord / Slack | URL de Webhook |

Ejemplo:

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Utilice el **nodo** de Notion para operaciones nativas de bases de datos, páginas y bloques. Utilice `$credentials` cuando una petición [HTTP](../nodes/http-node.md) personalizada necesite el mismo token Bearer de Notion.

## Creación de Credenciales desde el Chat

El [AI Assistant](./ai-assistant.md#credentials), la [pestaña Chat](../tabs/chat-tab.md) y [Chat with Heym](./chat-with-heym.md) pueden crear una credencial cuando un workflow la necesite, o siempre que lo solicite. El asistente sugiere el tipo y un nombre, y el formulario habitual de credenciales se abre en la conversación. Solicite actualizar una credencial de su propiedad y el mismo formulario se abrirá sobre ella, con sus secretos enmascarados. El asistente solo ve el nombre y el tipo. `heym_chat` a través de [MCP](../tabs/mcp-tab.md) no puede crear, actualizar ni elegir credenciales.

## Relacionado

- [Pestaña Credenciales](../tabs/credentials-tab.md) – Añadir, editar, eliminar credenciales
- [Nodo de GitHub](../nodes/github-node.md) – Operaciones REST nativas de GitHub
- [Nodo de Jira](../nodes/jira-node.md) – Automatización de proyectos, incidencias, comentarios, adjuntos, usuarios, notificaciones y transiciones de Jira
- [Nodo de Linear](../nodes/linear-node.md) – Automatización de espacios de trabajo e incidencias de Linear GraphQL
- [Nodo de Notion](../nodes/notion-node.md) – Buscar y gestionar contenido de Notion
- [Nodo de Sentry](../nodes/sentry-node.md) – Automatización de organizaciones, proyectos, equipos, incidencias, eventos y releases de Sentry
- [Compartir Credenciales](./credentials-sharing.md) – Compartir con usuarios y equipos
- [Integraciones de Terceros](./integrations.md) – Guía de configuración por tipo de credencial
- [Expression DSL](./expression-dsl.md) – `$credentials` en expresiones

## Model Router (Auto Model)

Un Model Router no contiene ninguna clave. Contiene una **credencial de modelo de decisión**, una lista de **opciones de modelo** — cada una compuesta por una credencial existente de OpenAI, Google o Custom más un modelo — y, para cada opción, texto libre indicando cuándo debe utilizarse esa opción.

Aparece en todos los selectores que ofrecen un modelo: los nodos [LLM](../nodes/llm-node.md) y [Agent](../nodes/agent-node.md), Chat, AI Defaults, Dashboards, el constructor de expresiones y las Tablas de datos. Su único modelo es **Auto**. Selecciónelo y el modelo de decisión leerá cada petición y la enrutará. [Evals](../tabs/evals-tab.md) lo excluye, porque una evaluación compara modelos específicos y un router elige por sí mismo.

Un agente vuelve a enrutar a medida que avanza su bucle de herramientas, de modo que un modelo económico puede encargarse de los primeros turnos y uno más potente del turno que lo requiera. Las entradas idénticas reutilizan la decisión anterior, por lo que un bucle solo paga por una decisión cuando la conversación realmente ha avanzado.

### Lo que no puede hacer

Auto Model no puede combinarse con la **Responses API**, el **Batch mode** ni la **salida de imagen**. Esos conmutadores se desactivan automáticamente cuando se selecciona un router, y cada uno indica el motivo. Las comprobaciones de guardrail y el clasificador de políticas de revisión humana son llamadas fijas a un único modelo y nunca se enrutan.

### Cuando el enrutamiento falla

Marque una opción como **Use this option when routing fails** y una interrupción del modelo de decisión nunca detendrá una ejecución; se utiliza el fallback y el motivo queda registrado en la ejecución. Sin una opción marcada, el nodo falla en lugar de adivinar.

### Ver a dónde fue una solicitud

Traces muestra `Auto Model / GPT-5` en lugar del modelo por sí solo, y el coste permanece atribuido al modelo que realmente se ejecutó. El Execution Log y la Span View del canvas muestran el mismo par, y la Span View indica qué turno fue a dónde.
