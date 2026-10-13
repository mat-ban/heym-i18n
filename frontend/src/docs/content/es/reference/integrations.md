# Integraciones de Terceros

Heym se conecta a servicios externos a través de **credenciales**. Cada tipo de credencial almacena los detalles de conexión de un servicio y puede reutilizarse en múltiples nodos y workflows. Consulte [Credenciales](./credentials.md) para obtener una visión general.

Añada credenciales en [Configuración → Credenciales](../tabs/credentials-tab.md). Todos los valores se cifran en reposo. Las credenciales pueden [compartirse](./credentials-sharing.md) con otros usuarios o [Equipos](./teams.md).

Algunos nodos de integración **no** requieren credenciales. [WebSocket Trigger](../nodes/websocket-trigger-node.md) y [WebSocket Send](../nodes/websocket-send-node.md) se conectan a sockets externos utilizando la URL, las cabeceras y los subprotocolos configurados directamente en el nodo.

## Tipos de Credenciales de un Vistazo

| Tipo | Utilizado Por | Campos Clave |
|------|---------|------------|
| **OpenAI** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md) | `api_key` |
| **OpenAI Codex** | [Codex](../nodes/codex-node.md) | `access_token` |
| **OpenCode Go** | [OpenCode Go](../nodes/opencode-go-node.md) | `api_key`, `base_url` opcional |
| **Google** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key` |
| **GitHub** | [GitHub](../nodes/github-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) | `api_key`, `base_url` opcional |
| **Jira** | [Nodo Jira](../nodes/jira-node.md) | `email`, `api_token`, `base_url`, `deployment`, `api_version` opcional |
| **Linear** | [Nodo Linear](../nodes/linear-node.md) | `api_key`, o `client_id` + `client_secret` OAuth2 |
| **Sentry** | [Nodo Sentry](../nodes/sentry-node.md) | `api_token`, `base_url` opcional |
| **Custom** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key`, `base_url` |
| **Decision Model** | [Decision](../nodes/decision-node.md), [Evaluaciones](../tabs/evals-tab.md) (juez LLM-as-Judge) | `base_url`, `api_key` opcional |
| **Model Router (Auto Model)** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, Valores Predeterminados de IA | una credencial de modelo de decisión, más opciones de modelo que hacen referencia a sus otras credenciales |
| **Cohere** | Embeddings | `api_key` |
| **RAG: Qdrant + OpenAI** | [RAG](../nodes/rag-node.md), Vectorstores | `qdrant_host`, `openai_api_key` |
| **RAG: Psql + OpenAI** | [RAG](../nodes/rag-node.md), Vectorstores | `openai_api_key` (vectores almacenados en el propio Postgres de Heym mediante pgvector) |
| **RAG: Custom Embeddings** | [RAG](../nodes/rag-node.md), Vectorstores | `embedding_base_url`, `embedding_model`, `embedding_dimensions`, `db_type`, `embedding_api_key` opcional, más `qdrant_host` cuando `db_type` es `qdrant` |
| **Grist** | [Nodo Grist](../nodes/grist-node.md) | `api_key`, `server_url` |
| **Google Sheets** | [Nodo Google Sheets](../nodes/google-sheets-node.md) | `client_id`, `client_secret` + consentimiento OAuth2 |
| **Google Drive** | [Nodo Google Drive](../nodes/google-drive-node.md) | `client_id`, `client_secret` + consentimiento OAuth2 (alcance completo de Drive) |
| **BigQuery** | [Nodo BigQuery](../nodes/bigquery-node.md) | `client_id`, `client_secret` + consentimiento OAuth2 |
| **Supabase** | [Nodo Supabase](../nodes/supabase-node.md) | `supabase_url`, `supabase_key`, `supabase_schema` opcional |
| **ClickHouse** | [Nodo ClickHouse](../nodes/clickhouse-node.md) | `host`, `port`, `username`, `password`, `database`, `secure` |
| **Notion** | [Nodo Notion](../nodes/notion-node.md) | `api_token`, o `client_id` + `client_secret` OAuth |
| **Amazon S3** | [Nodo Amazon S3](../nodes/amazon-s3-node.md) | `aws_access_key_id`, `aws_secret_access_key`, `aws_region` |
| **SMTP** | [Send Email](../nodes/send-email-node.md) | `host`, `port`, `email`, `password` |
| **IMAP** | [Nodo IMAP Trigger](../nodes/imap-trigger-node.md) | `imap_host`, `imap_port`, `imap_username`, `imap_password` |
| **Telegram** | [Nodo Telegram Trigger](../nodes/telegram-trigger-node.md), [Nodo Telegram](../nodes/telegram-node.md) | `bot_token`, `secret_token` opcional |
| **Discord** | [Nodo Discord](../nodes/discord-node.md) | `webhook_url` |
| **Discord Trigger** | [Nodo Discord Trigger](../nodes/discord-trigger-node.md) | `public_key` |
| **RabbitMQ** | [Nodo RabbitMQ](../nodes/rabbitmq-node.md) | `rabbitmq_host`, `rabbitmq_username`, `rabbitmq_password` |
| **Redis** | [Nodo Redis](../nodes/redis-node.md) | `host`, `port`, `password` |
| **Slack** | [Nodo Slack](../nodes/slack-node.md) | `webhook_url` |
| **Slack Trigger** | [Nodo Slack Trigger](../nodes/slack-trigger-node.md) | `signing_secret` |
| **Bearer** | [Nodo HTTP](../nodes/http-node.md) | `token` |
| **Header** | [Nodo HTTP](../nodes/http-node.md) | `header_key`, `header_value` |
| **FlareSolverr** | [Nodo Crawler](../nodes/crawler-node.md) | `flaresolverr_url` |

---
## GitHub

La credencial de GitHub almacena un token de acceso personal (PAT) de GitHub para que los workflows puedan llamar a la API REST de GitHub a través del [Nodo GitHub](../nodes/github-node.md), pasar el token a servidores MCP como `@modelcontextprotocol/server-github`, o utilizarlo desde el [Nodo HTTP](../nodes/http-node.md) para llamadas REST personalizadas.

### Campos obligatorios

| Campo | Descripción |
|-------|-------------|
| `api_key` | Token de acceso personal de GitHub (PAT de grano fino `github_pat_...` o PAT clásico `ghp_...`) |

### Campos opcionales

| Campo | Descripción |
|-------|-------------|
| `base_url` | URL base de la API de GitHub para GitHub Enterprise Server (por ejemplo `https://github.example.com/api/v3`) |

### Notas

- Se recomiendan los tokens de acceso personal de grano fino siempre que sea posible, ya que permiten limitar su alcance a repositorios y permisos específicos.
- Deje `base_url` vacío para GitHub.com. Para GitHub Enterprise Server, utilice el endpoint completo de la API REST
  incluyendo `/api/v3` (por ejemplo `https://github.example.com/api/v3`), no la
  raíz de la interfaz web del servidor, como `https://github.example.com`.
- Actualmente, esta credencial solo modela la autenticación basada en PAT. Para acceder a repositorios de organización, utilice un PAT al que se le hayan concedido los permisos de organización/repositorio requeridos.
- Los tokens de instalación de GitHub App y los flujos de configuración de GitHub App no son compatibles de forma nativa en la interfaz de Heym actualmente.
- Prefiera el [Nodo GitHub](../nodes/github-node.md) para operaciones nativas de repositorios, usuarios, issues, pull requests, revisiones, releases, workflows de Actions, tráfico y archivos. Utilice el [Nodo HTTP](../nodes/http-node.md) solo cuando necesite endpoints o payloads que el Nodo GitHub no cubra.
- Utilice el [Nodo Agent](../nodes/agent-node.md) con MCP pasando `$credentials.YourGitHubCredential` a una variable de entorno de conexión MCP como `GITHUB_PERSONAL_ACCESS_TOKEN`.
- La API REST de GitHub normalmente espera `Authorization: Bearer <token>` junto con `Accept: application/vnd.github+json`.
- Al editar una credencial de GitHub, dejar vacío el `base_url` de GitHub Enterprise conserva el
  endpoint existente. Introduzca una nueva URL solo cuando desee cambiar dicho endpoint.

### Utilizada por

- [Nodo GitHub](../nodes/github-node.md)
- [Nodo Codex](../nodes/codex-node.md)
- [Nodo Agent](../nodes/agent-node.md)
- [Nodo HTTP](../nodes/http-node.md)

---

## Decision Model

Un decision model responde preguntas tipadas sobre un estado y devuelve probabilidades en lugar de texto. El Jev de TypeSafe es la implementación de referencia; cualquier endpoint que acepte el mismo cuerpo `{model, state, questions}` funciona, y el nodo [Decision](../nodes/decision-node.md) puede enviar un cuerpo escrito manualmente para uno que no lo haga.

### Campos obligatorios

- `base_url` – el endpoint, por ejemplo `https://api.typesafe.ai`. Heym añade `/v1/systemone`.

### Campos opcionales

- `api_key` – se envía como `Authorization: Bearer`. Los endpoints que no necesitan clave pueden dejar este campo en blanco.

### Notas

- **Test Connection** envía una pregunta mínima para confirmar que el endpoint y la clave funcionan.
- Al editar una credencial, se conserva la clave almacenada cuando el campo de clave se deja en blanco.
- Las solicitudes salientes a direcciones privadas y de loopback están bloqueadas de forma predeterminada, por lo que un endpoint autoalojado en `localhost` o en un rango privado necesita `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.
- Estos modelos no aparecen en las tablas de precios de LLM que Heym sincroniza, por lo que la columna Cost en [Trazas](../tabs/traces-tab.md) permanece vacía. Los recuentos de tokens sí se registran.

### Utilizada por

- [Decision](../nodes/decision-node.md)
- [Evaluaciones](../tabs/evals-tab.md) – puntúa las respuestas de `LLM-as-Judge` frente a la salida esperada

## OpenAI Codex

La credencial de OpenAI Codex autentica el [Nodo Codex](../nodes/codex-node.md). Es independiente de la credencial de clave de API de OpenAI utilizada por los nodos LLM, Agent y RAG.

### Modos de autenticación

| Modo | Descripción |
|------|-------------|
| **Sign in with ChatGPT** (recomendado) | Inicio de sesión OAuth (PKCE) que utiliza su suscripción ChatGPT Plus/Pro, de modo que las ejecuciones evitan los costes de API por token. Heym almacena y actualiza automáticamente el paquete de tokens. |
| **Access token** | Un `access_token` de ChatGPT/Codex que se pasa únicamente al proceso local de Codex CLI. |

### Notas

- Las claves de API se rechazan para este tipo de credencial.
- Los tokens de Codex no se exponen a través de `$credentials.Name`.
- El Nodo Codex también necesita una credencial de GitHub para la clonación de repositorios, el push de ramas y la creación de PR en borrador.

### Utilizada por

- [Nodo Codex](../nodes/codex-node.md)

## OpenCode Go

La credencial de OpenCode Go autentica el [Nodo OpenCode Go](../nodes/opencode-go-node.md). Almacena una clave de API de la pasarela de OpenCode Go (de [opencode.ai/go](https://opencode.ai/go)) y una URL base de pasarela opcional.

### Campos

| Campo | Descripción |
|-------|-------------|
| **API Key** | Clave de API de la pasarela de OpenCode Go (obligatoria). |
| **Gateway Base URL** | Opcional; su valor predeterminado es `https://opencode.ai/zen/go/v1`. Sobrescríbalo solo para una pasarela autoalojada o con proxy. |
### Notas

- La clave de API se pasa únicamente al proceso de OpenCode CLI dentro de un contenedor reforzado.
- El nodo OpenCode Go también necesita una credencial de GitHub para el clonado de repositorios, el push de ramas y la creación de pull requests. El token de GitHub nunca se coloca dentro del contenedor sandbox.

### Utilizado por

- [Nodo OpenCode Go](../nodes/opencode-go-node.md)

---

## Linear

La credencial de Linear admite tanto una clave de API personal como OAuth2 para el
[nodo Linear](../nodes/linear-node.md). Heym envía consultas GraphQL nativas a Linear para metadatos del espacio de trabajo, proyectos, incidencias y comentarios.

### Configuración

Elija un modo de autenticación:

**Clave de API personal**

1. En Linear, abra **Settings → Security & Access → Personal API keys**.
2. Cree una clave con acceso al espacio de trabajo que desea automatizar.
3. Pegue la clave en una credencial de Linear en Heym y use **Test Connection** para verificarla.

**OAuth2**

1. Cree una aplicación OAuth de Linear.
2. Registre `{FRONTEND_URL}/api/credentials/linear/oauth/callback` como URI de redirección.
3. En Heym Dashboard → **Credentials** → **New** → tipo **Linear**.
4. Elija **OAuth2**, introduzca el Client ID y el Client Secret, y haga clic en **Connect**.

### Campos obligatorios

| Modo | Campo | Descripción |
|------|-------|-------------|
| Clave de API personal | `api_key` | Clave de API personal de Linear, habitualmente con el prefijo `lin_api_` |
| OAuth2 | `client_id` | Client ID de la aplicación OAuth de Linear |
| OAuth2 | `client_secret` | Client Secret de la aplicación OAuth de Linear |

Los tokens de OAuth (`access_token`, `refresh_token`, `token_expiry`) se almacenan y se renuevan automáticamente.

### Notas

- Las claves de API personales y los tokens de OAuth actúan como el usuario de Linear que los creó o autorizó.
- OAuth de Linear utiliza los scopes `read,write,issues:create,comments:create`.
- Use **Test Connection** en el diálogo de credenciales para verificar la clave de API o el token de OAuth contra la API de Linear.
- Use List Teams y List Projects en el nodo Linear para descubrir UUIDs antes de crear o filtrar incidencias.
- Use List Workflow States y List Team Members para descubrir UUIDs de estados y asignados para las actualizaciones.
- Rote una clave de API editando la credencial e introduciendo el valor de reemplazo. Si rota los secretos de la aplicación OAuth, vuelva a conectar la credencial mediante **Connect**.

### Utilizado por

- [Nodo Linear](../nodes/linear-node.md)

---

## Jira

La credencial de Jira almacena las credenciales de autenticación Basic de Jira, la URL base del sitio de Jira, el modo de despliegue y la versión opcional de la API REST para el [nodo Jira](../nodes/jira-node.md). Use `cloud` para Jira Cloud o `data_center` para Jira Data Center / Server.

### Configuración

**Jira Cloud**

1. En la configuración de la cuenta de Atlassian, cree un token de API.
2. En Heym Dashboard → **Credentials** → **New** → tipo **Jira**.
3. Introduzca el correo electrónico de Atlassian, el token de API y la URL del sitio de Jira, como `https://your-domain.atlassian.net`.
4. Use **Test Connection** para verificar la credencial.

**Jira Data Center / Server**

1. Seleccione **Jira Data Center / Server** como despliegue.
2. Introduzca el nombre de usuario y la contraseña de Jira utilizados para la autenticación Basic.
3. Introduzca la URL del sitio de Jira, por ejemplo `https://jira.example.com`.
4. Use **Test Connection** para verificar la credencial.

### Campos

| Campo | Descripción |
| --- | --- |
| `email` | Correo electrónico de la cuenta de Atlassian de Jira Cloud, o nombre de usuario de Jira Data Center / Server |
| `api_token` | Token de API de Atlassian de Jira Cloud, o contraseña de Jira Data Center / Server para la autenticación Basic |
| `base_url` | URL base del sitio de Jira |
| `deployment` | `cloud` para Jira Cloud o `data_center` para Jira Data Center / Server |
| `api_version` | Versión de la API REST; por defecto `3` para Jira Cloud. Data Center / Server usa v2 |

### Notas

- El nodo Jira envía las descripciones de incidencias y los comentarios como documentos de texto en formato Atlassian Document Format para la API REST v3 de Jira Cloud. Las credenciales de Data Center / Server envían texto sin formato.
- Data Center / Server actualmente solo admite autenticación Basic con nombre de usuario/contraseña. Los tokens de acceso personal y la autenticación Bearer aún no son compatibles.
- La carga de archivos adjuntos acepta contenido en base64 o data URL y está sujeta al límite de tamaño de archivo de la plataforma (99 MB por defecto). La descarga de archivos adjuntos puede devolver contenido en base64 cuando está habilitado.
- La creación y eliminación de usuarios, así como las notificaciones de incidencias, requieren que la cuenta de Jira autenticada tenga los permisos correspondientes del sitio u organización de Jira.
- Use List Projects, Search Issues y List Transitions para descubrir claves de proyecto, claves de incidencia e IDs de transición.
- Para endpoints personalizados no cubiertos por el nodo Jira, use el [nodo HTTP](../nodes/http-node.md) con Jira Basic Auth (`email:api_token` para Cloud o `username:password` para Data Center / Server) en el comando cURL, o una credencial de tipo Header con el valor `Authorization: Basic <base64(user:secret)>` correspondiente.

Véase también:

- [Nodo Jira](../nodes/jira-node.md)
- [Credenciales](./credentials.md)

---

## Sentry

La credencial de Sentry almacena un token de autenticación para el [nodo Sentry](../nodes/sentry-node.md). Heym utiliza la API REST de Sentry para operaciones de organización, proyecto, equipo, incidencia, evento y release.
### Campos obligatorios

| Campo | Descripción |
|-------|-------------|
| `api_token` | Token de autenticación de Sentry con acceso a las organizaciones y proyectos que automatice |

### Campos opcionales

| Campo | Descripción |
|-------|-------------|
| `base_url` | URL raíz opcional para Sentry autoalojado, por ejemplo `https://sentry.example.com` |

### Notas

- Deje `base_url` vacío para Sentry SaaS.
- Utilice **Test Connection** para confirmar que el token puede listar las organizaciones visibles.
- Para llamadas REST personalizadas, utilice `$credentials.YourSentryCredential` como token de portador.

### Utilizado por

- [Nodo Sentry](../nodes/sentry-node.md)

---

## Qdrant

[Qdrant](https://qdrant.tech) es una base de datos vectorial de código abierto utilizada para búsqueda semántica y RAG (Retrieval Augmented Generation).

### Campos obligatorios

| Campo | Descripción |
|-------|-------------|
| `qdrant_host` | URL completa a su instancia de Qdrant (p. ej. `http://localhost:6333` o un endpoint en la nube) |
| `openai_api_key` | Clave de API de OpenAI utilizada para generar embeddings al indexar y buscar documentos |

### Notas

- Las colecciones de Qdrant se gestionan desde la pestaña [Vectorstores](../tabs/vectorstores-tab.md). Cada almacén vectorial se asigna a una colección de Qdrant.
- El [Nodo RAG](../nodes/rag-node.md) utiliza un almacén vectorial (que hace referencia a una credencial de Qdrant); no hace referencia a la credencial directamente.
- Si su instancia de Qdrant requiere una clave de API, inclúyala en el valor de `qdrant_host` o configure Qdrant en consecuencia; la integración actual no dispone de un campo independiente para la clave de API de Qdrant.
- Qdrant autoalojado: utilice la [imagen Docker oficial](https://hub.docker.com/r/qdrant/qdrant) y exponga el puerto `6333`.

### Utilizado por

- [Nodo RAG](../nodes/rag-node.md) (a través del almacén vectorial)
- [Pestaña Vectorstores](../tabs/vectorstores-tab.md)

## Embeddings personalizados (RAG)

De forma predeterminada, los embeddings de RAG provienen de OpenAI. Una credencial **RAG: Custom Embeddings** apunta en su lugar a cualquier endpoint de embeddings compatible con OpenAI — Ollama, vLLM, Text Embeddings Inference, LM Studio, Together o una pasarela alojada — y especifica el almacén vectorial en el que escribe.

### Campos obligatorios

| Campo | Descripción |
|-------|-------------|
| `embedding_base_url` | URL del endpoint incluyendo la ruta `/v1`, p. ej. `http://localhost:11434/v1` |
| `embedding_api_key` | Opcional. Los servidores locales normalmente no necesitan clave |
| `embedding_model` | Nombre del modelo tal como lo espera el endpoint, p. ej. `nomic-embed-text` |
| `embedding_dimensions` | Ancho del vector que devuelve el modelo (predeterminado `1536`) |
| `embedding_request_dimensions` | Opcional. Solicita al endpoint que devuelva `embedding_dimensions` en lugar del ancho nativo del modelo |
| `db_type` | `qdrant` o `pgvector` |
| `qdrant_host`, `qdrant_port`, `qdrant_api_key` | Conexión a Qdrant, obligatoria cuando `db_type` es `qdrant` |

### Notas

- **Qdrant acepta cualquier número de dimensiones.** Cada colección se crea con el ancho que declara esta credencial, por lo que el campo Dimensions es editable libremente.
- **Postgres (pgvector) requiere exactamente 1536 dimensiones.** Su columna es un `vector(1536)` fijo, por lo que el campo Dimensions está fijado a 1536 y una credencial que declare cualquier otro ancho se rechaza al guardar.
- **Reducción para pgvector.** Cuando el almacén es Postgres, el diálogo ofrece *Ask the endpoint to return 1536 dimensions*. Esto envía el parámetro de solicitud `dimensions`, que los modelos entrenados con representaciones Matryoshka (OpenAI `text-embedding-3-*`, `nomic-embed-text-v1.5`, `jina-v3` y similares) respetan devolviendo un vector acortado pero aún significativo. Los endpoints que no admiten el parámetro rechazan la solicitud, y los endpoints que lo aceptan pero lo ignoran producen un error claro que indica el ancho realmente devuelto. Heym nunca trunca los vectores por sí mismo, porque recortar la salida de un modelo no Matryoshka degrada la calidad de recuperación de forma silenciosa. La opción no se ofrece para Qdrant, que puede dimensionar una colección a cualquier ancho.
- Utilice **Test Connection** en el diálogo de credenciales para generar el embedding de una cadena de prueba y ver el ancho que devuelve realmente el modelo antes de crear un almacén.
- El parámetro de solicitud `dimensions` solo se envía a OpenAI, ya que la mayoría de los servidores compatibles con OpenAI rechazan parámetros desconocidos. En su lugar, el ancho nativo del modelo se valida contra la credencial.
- Las credenciales existentes **RAG: Qdrant + OpenAI** y **RAG: Psql + OpenAI** no cambian y siguen funcionando.

### Utilizado por

- [Nodo RAG](../nodes/rag-node.md) (a través del almacén vectorial)
- [Pestaña Vectorstores](../tabs/vectorstores-tab.md)

## Postgres (pgvector)

Heym también puede almacenar vectores **dentro de su propia base de datos Postgres** utilizando la extensión [pgvector](https://github.com/pgvector/pgvector) — sin necesidad de un servicio vectorial externo. Cree una credencial **RAG: Psql + OpenAI** y utilícela al crear un almacén vectorial; después, seleccione **Postgres (pgvector)** en el menú desplegable Database del Nodo RAG.

### Campos obligatorios

| Campo | Descripción |
|-------|-------------|
| `openai_api_key` | Clave de API de OpenAI utilizada para generar embeddings al indexar y buscar documentos |
### Notas

- No se necesita host/puerto: los vectores se escriben en la base de datos propia de Heym; Heym nunca se conecta a una base de datos diferente.
- Todas las funciones de RAG disponibles con Qdrant (inserción, búsqueda, filtros de metadatos, reranking de Cohere, clonación, uso compartido) funcionan de forma idéntica con el backend de Postgres.
- Requiere la extensión `vector`. Heym mantiene la imagen oficial `postgres:16` sin cambios (por lo que los datos existentes nunca se modifican) e **instala automáticamente el paquete `postgresql-16-pgvector` al iniciar**; `run.sh`, `deploy.sh` y `run_e2e.sh` lo gestionan. La instalación no es crítica: si no puede ejecutarse (por ejemplo, sin red), el RAG de Qdrant sigue funcionando y el backend de Postgres permanece inactivo (la migración omite la tabla de forma controlada).
- Si ejecuta la imagen publicada de contenedor único (`ghcr.io/heymrun/heym`) contra **su propio Postgres externo**, esa base de datos debe admitir la extensión `vector` (Heym no puede instalarla en una base de datos que no gestiona). Sin ella, la creación o la carga a un almacén vectorial de Postgres devuelve un mensaje claro y el RAG de Qdrant continúa funcionando.

### Utilizado por

- [Nodo RAG](../nodes/rag-node.md) (a través del almacén vectorial)
- [Pestaña Vectorstores](../tabs/vectorstores-tab.md)

---

## Grist

[Grist](https://www.getgrist.com) es un híbrido de hoja de cálculo y base de datos que admite datos estructurados y fórmulas. La credencial de Grist permite a Heym leer y escribir documentos de Grist.

### Campos obligatorios

| Campo | Descripción |
|-------|-------------|
| `api_key` | Clave de API de Grist (se encuentra en **Profile → API Key** en su instancia de Grist) |
| `server_url` | URL base de su servidor de Grist (por ejemplo, `https://docs.getgrist.com` para Grist Cloud, o su URL autoalojada) |

### Notas

- El [Nodo Grist](../nodes/grist-node.md) requiere el **Document ID** (de la URL del documento de Grist) y el **Table ID** en su configuración; estos no forman parte de la credencial.
- Para Grist autoalojado, establezca `server_url` en el dominio de su instancia.
- Los ID de columna en Grist utilizan guiones bajos (por ejemplo, `User_Name`), no etiquetas visibles. Utilice la operación `listColumns` para descubrirlos.

### Utilizado por

- [Nodo Grist](../nodes/grist-node.md)

---

## Google Sheets (OAuth2)

La credencial de Google Sheets conecta Heym con la API de Google Sheets mediante un modelo OAuth2 de "Bring Your Own App". Usted proporciona un Client ID y un Client Secret de OAuth2 de Google Cloud, y luego autoriza el acceso mediante una ventana emergente del navegador. Los tokens se renuevan automáticamente en segundo plano.

### Configuración

1. Abra [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → busque y habilite **Google Sheets API**.
2. Vaya a **Credentials** → **Create Credentials** → **OAuth client ID** → tipo de aplicación **Web application**.
3. En **Authorized redirect URIs** añada: `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`
4. Copie el **Client ID** y el **Client Secret** generados.
5. En Heym Dashboard → **Credentials** → **New** → tipo **Google Sheets (OAuth2)**.
6. Introduzca el Client ID, el Client Secret y un nombre, y luego haga clic en **Connect** para abrir la ventana emergente de consentimiento de Google y autorizar el acceso.

### Campos obligatorios

| Campo | Descripción |
|-------|-------------|
| `client_id` | Client ID de OAuth2 de Google Cloud Console |
| `client_secret` | Client Secret de OAuth2 de Google Cloud Console |

Los tokens (`access_token`, `refresh_token`, `token_expiry`) se almacenan y se renuevan automáticamente; usted no los gestiona directamente.

### Notas

- La pantalla de consentimiento de OAuth2 requiere el scope de hojas de cálculo (`https://www.googleapis.com/auth/spreadsheets`).
- Heym utiliza el refresh token para obtener nuevos access tokens antes de que expiren (margen de seguridad de 60 segundos).
- Si rota el Client Secret en Google Cloud Console, vuelva a conectar la credencial mediante el botón **Connect**.
- **Producción:** establezca **`FRONTEND_URL`** del backend en la URL pública exacta que los usuarios abren en el navegador (esquema + host, por ejemplo, `https://heym.example.com`). Heym construye el URI de redirección de Google OAuth únicamente a partir de este valor; **no** confía en las cabeceras `Origin` ni `X-Forwarded-*` (controladas por el cliente). Registre `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` en Google Cloud Console.

### Utilizado por

- [Nodo Google Sheets](../nodes/google-sheets-node.md)

---

## Google Drive (OAuth2)

La credencial de Google Drive conecta Heym con la API de Google Drive mediante el mismo modelo OAuth2 de "Bring Your Own App" que Google Sheets. Usted proporciona un Client ID y un Client Secret de OAuth2 de Google Cloud, y luego autoriza el acceso mediante una ventana emergente del navegador. Los tokens se renuevan automáticamente en segundo plano.
### Configuración

1. Abra [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → busque y habilite **Google Drive API**.
2. Vaya a **Credentials** → **Create Credentials** → **OAuth client ID** → tipo de aplicación **Web application**.
3. En **Authorized redirect URIs** añada: `https://your-heym-domain/api/credentials/google-drive/oauth/callback`
4. Copie el **Client ID** y el **Client Secret** generados.
5. En Heym Dashboard → **Credentials** → **New** → tipo **Google Drive (OAuth2)**.
6. Introduzca el Client ID, el Client Secret y un nombre; a continuación, haga clic en **Connect** para abrir la ventana emergente de consentimiento de Google y autorizar el acceso.

### Campos obligatorios

| Campo | Descripción |
|-------|-------------|
| `client_id` | Client ID de OAuth2 de Google Cloud Console |
| `client_secret` | Client Secret de OAuth2 de Google Cloud Console |

Los tokens (`access_token`, `refresh_token`, `token_expiry`) se almacenan y se refrescan automáticamente; usted no los gestiona directamente.

### Scope

Google Drive solicita el **scope completo de Drive** (`https://www.googleapis.com/auth/drive`).

Esto es necesario porque el nodo opera sobre archivos que ya son de su propiedad. El scope más restringido `drive.file` solo concede acceso a los archivos creados por el propio cliente OAuth, lo que haría que `listFolderFiles`, `updateFile`, `removeFile` y `removeFolder` no vieran nada de su Drive existente.

Dado que usted proporciona su propio Client ID y Secret desde su propio proyecto de Google Cloud, los requisitos de verificación de la aplicación de Google para este scope se aplican a su proyecto, no a Heym.

### Notas

- Heym utiliza el refresh token para obtener nuevos access tokens antes de que expiren (con un margen de seguridad de 60 segundos).
- Si rota el Client Secret en Google Cloud Console, vuelva a conectar la credencial mediante el botón **Connect**.
- Se admiten unidades compartidas: el nodo establece `supportsAllDrives` en cada llamada a la API.
- **Producción:** Establezca el **`FRONTEND_URL`** del backend en la URL pública exacta que los usuarios abren en el navegador. Heym construye el URI de redirección de Google OAuth únicamente a partir de este valor; **no** confía en las cabeceras `Origin` ni `X-Forwarded-*`. Registre `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` en Google Cloud Console.
- Consulte [Credential Sharing](./credentials-sharing.md) antes de compartir esta credencial con un equipo.

### Utilizada por

- [Nodo Google Drive](../nodes/google-drive-node.md)

---

## BigQuery (OAuth2)

La credencial de BigQuery conecta Heym con la API de Google BigQuery mediante un modelo OAuth2 de tipo "Bring Your Own App". Usted proporciona un Client ID y un Client Secret de OAuth2 de Google Cloud y, a continuación, autoriza el acceso mediante una ventana emergente del navegador. Los tokens se refrescan automáticamente en segundo plano.

### Configuración

1. Abra [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → busque y habilite **BigQuery API**.
2. Vaya a **Credentials** → **Create Credentials** → **OAuth client ID** → tipo de aplicación **Web application**.
3. En **Authorized redirect URIs** añada: `https://your-heym-domain/api/credentials/bigquery/oauth/callback`
4. Copie el **Client ID** y el **Client Secret** generados.
5. En Heym Dashboard → **Credentials** → **New** → tipo **BigQuery (OAuth2)**.
6. Introduzca el Client ID, el Client Secret y un nombre; a continuación, haga clic en **Connect** para abrir la ventana emergente de consentimiento de Google y autorizar el acceso.

### Campos obligatorios

| Campo | Descripción |
|-------|-------------|
| `client_id` | Client ID de OAuth2 de Google Cloud Console |
| `client_secret` | Client Secret de OAuth2 de Google Cloud Console |

Los tokens (`access_token`, `refresh_token`, `token_expiry`) se almacenan y se refrescan automáticamente.

### Notas

- La pantalla de consentimiento de OAuth2 requiere el scope de BigQuery (`https://www.googleapis.com/auth/bigquery`).
- **Producción:** Establezca el **`FRONTEND_URL`** del backend en la URL pública. Registre `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback` en Google Cloud Console.

### Utilizada por

- [Nodo BigQuery](../nodes/bigquery-node.md)

---

## Supabase

La credencial de Supabase conecta Heym con la API PostgREST de un proyecto de Supabase, de modo que los workflows pueden consultar y modificar tablas respaldadas por Postgres.

### Campos obligatorios

| Campo | Descripción |
|-------|-------------|
| `supabase_url` | URL base del proyecto; por ejemplo, `https://your-project.supabase.co` |
| `supabase_key` | Clave de API con acceso a las tablas de destino |
| `supabase_schema` | Esquema predeterminado opcional (por defecto, `public`) |

### Notas

- El [Nodo Supabase](../nodes/supabase-node.md) se comunica con `/rest/v1/<table>` y admite filtros de operador (`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `is`, `in` y otros operadores relacionados de PostgREST), además de grupos lógicos anidados `or` / `and`.
- Para las operaciones de escritura, se recomienda utilizar una clave destinada a un uso de confianza del lado del servidor con los permisos mínimos necesarios sobre las tablas.
- Los nodos pueden sobrescribir el esquema por paso aunque la credencial defina un esquema predeterminado.

### Utilizada por

- [Nodo Supabase](../nodes/supabase-node.md)
## ClickHouse

La credencial de ClickHouse conecta Heym a una base de datos ClickHouse externa a través de su interfaz HTTP, de modo que los workflows pueden ejecutar operaciones SQL, CRUD y de conteo sobre tablas OLAP.

### Campos obligatorios

| Campo | Descripción |
|-------|-------------|
| `host` | Host HTTP sin esquema, por ejemplo `your-instance.clickhouse.cloud` |
| `port` | Puerto de la interfaz HTTP (`8443` para HTTPS, `8123` para HTTP) |
| `username` | Usuario de ClickHouse (por defecto `default`) |
| `password` | Contraseña del usuario (opcional) |
| `database` | Base de datos de destino (por defecto `default`) |
| `secure` | Usar HTTPS cuando sea `true` (obligatorio para ClickHouse Cloud) |

### Notas

- El [Nodo ClickHouse](../nodes/clickhouse-node.md) utiliza el cliente HTTP oficial `clickhouse-connect` y parametriza los bindings de filtros y valores.
- `update` y `remove` se asignan a `ALTER TABLE ... UPDATE` y `DELETE FROM`, que son mutaciones asíncronas de ClickHouse; ambas requieren un filtro.
- `upsert` realiza un `INSERT` y asume una tabla `ReplacingMergeTree` para el comportamiento de merge-on-key.
- Utilice **Test connection** en el diálogo de la credencial para verificar la accesibilidad.

### Utilizada por

- [Nodo ClickHouse](../nodes/clickhouse-node.md)

## Notion

La credencial de Notion admite tanto un token de integración interna como una conexión OAuth de integración pública. OAuth permite que cada usuario autorice un workspace de Notion desde Heym en lugar de copiar manualmente un token.

### Campos obligatorios

| Modo | Campo | Descripción |
|------|-------|-------------|
| Token interno | `api_token` | Token de integración interna (`ntn_...`) |
| OAuth | `client_id` | Client ID de una integración pública de Notion |
| OAuth | `client_secret` | Client Secret de la integración pública de Notion |

El callback de OAuth almacena automáticamente `access_token`, `auth_mode`, `workspace_id`, `workspace_name` y `bot_id`. Cualquier `api_token` interno previo se elimina cuando OAuth finaliza. Registre esta URI de redirección en Notion:
`{FRONTEND_URL}/api/credentials/notion/oauth/callback`.

### Flujo de configuración de OAuth

1. Elija **OAuth** en el diálogo de la credencial, introduzca un nombre, el Client ID y el Client Secret.
2. Haga clic en **Connect** y autorice el workspace en la ventana emergente de Notion.
   - Para una credencial **nueva**, Heym crea el registro de la credencial cuando hace clic en **Connect**.
   - Complete la autorización en la ventana emergente y, a continuación, haga clic en **Save** para volver a la lista de credenciales.
3. Una credencial conectada muestra `connected (Workspace Name)` en la lista. Las credenciales OAuth pendientes muestran `Not connected` hasta que finalice la autorización.

Utilice **Test Connection** en el diálogo de la credencial para verificar tanto un token interno como una autorización OAuth completada. Al editar, dejar el campo del token en blanco conserva el token interno almacenado.

Tanto los tokens internos como los access tokens de OAuth están disponibles a través de `$credentials.CredentialName` para llamadas [HTTP](../nodes/http-node.md) personalizadas que necesiten un bearer token de Notion.

### Notas

- Las integraciones internas requieren que se compartan las páginas, bases de datos y orígenes de datos correspondientes.
- Los usuarios de OAuth eligen el workspace y las páginas durante la autorización de Notion.
- Las credenciales de la aplicación OAuth se cifran dentro de la credencial de Notion. El callback las recarga en el servidor; el secret no se incluye en el estado de OAuth.
- Las credenciales OAuth conectadas muestran el nombre del workspace; las credenciales OAuth pendientes muestran `Not connected` hasta que finalice la autorización.
- **Producción:** Establezca **`FRONTEND_URL`** en el backend con la URL pública del navegador (esquema + host, sin barra final). La URI de redirección de Notion debe coincidir exactamente:
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback`.
- El nodo utiliza la versión de API `2026-03-11` y la terminología actual de `data_source`. Consulte el artículo del [Nodo Notion](../nodes/notion-node.md#api-version-notes) para obtener orientación sobre la migración desde ejemplos anteriores de `archived`, `after` o consultas a bases de datos.
- Los filtros de búsqueda antiguos con valor de objeto `database` se normalizan a `data_source`.

### Utilizada por

- [Nodo Notion](../nodes/notion-node.md)

---

## SMTP (Email)

La credencial de SMTP almacena los detalles de conexión al servidor de correo para enviar correo saliente.

### Campos obligatorios

| Campo | Descripción |
|-------|-------------|
| `host` | Nombre de host del servidor SMTP (p. ej. `smtp.gmail.com`) |
| `port` | Puerto SMTP (habitualmente `587` para STARTTLS, `465` para SSL) |
| `email` | Nombre de usuario con el que inicia sesión el servidor SMTP; también es el remitente visible cuando `from` está vacío |
| `password` | Contraseña SMTP o App Password |

### Campos opcionales

| Campo | Descripción |
|-------|-------------|
| `from` (`smtp_from`) | Dirección de remitente (From) visible. Déjelo en blanco para enviar como `email`. El servidor sigue iniciando sesión como `email`, por lo que esa cuenta debe tener permiso para enviar como esta dirección (en Gmail, un alias verificado de **Enviar mensaje como**). |

### Proveedores SMTP habituales

| Proveedor | Host | Puerto | Notas |
|----------|------|------|-------|
| Gmail | `smtp.gmail.com` | `587` | Requiere una [App Password](https://support.google.com/accounts/answer/185833) (debe estar habilitado el 2FA) |
| Outlook / Office 365 | `smtp.office365.com` | `587` | Utilice las credenciales de su cuenta de Microsoft |
| Mailgun | `smtp.mailgun.org` | `587` | Utilice las credenciales SMTP de Mailgun de la configuración de su dominio |
| SendGrid | `smtp.sendgrid.net` | `587` | Utilice `apikey` como nombre de usuario y una API key como contraseña |
| Personalizado / Autoalojado | su dominio | `587` / `465` | Postfix, Exim, etc. |
### Notas

- Gmail requiere una **Contraseña de aplicación** en lugar de su contraseña habitual cuando la Verificación en dos pasos está habilitada.
- El puerto `587` utiliza STARTTLS (comienza en texto plano y se actualiza a TLS). El puerto `465` utiliza TLS implícito (SSL desde el inicio).

### Utilizado por

- [Nodo Send Email](../nodes/send-email-node.md)

---

## IMAP (Correo entrante)

La credencial IMAP almacena los detalles de conexión para monitorear una bandeja de entrada con el [Nodo IMAP Trigger](../nodes/imap-trigger-node.md).

### Campos obligatorios

| Campo | Descripción |
|-------|-------------|
| `imap_host` | Nombre de host del servidor IMAP (por ejemplo, `imap.gmail.com`) |
| `imap_port` | Puerto IMAP (`993` para SSL/TLS en la mayoría de los proveedores) |
| `imap_username` | Nombre de usuario del buzón o dirección de correo electrónico completa |
| `imap_password` | Contraseña o contraseña de aplicación específica del proveedor |

### Campos opcionales

| Campo | Descripción |
|-------|-------------|
| `imap_mailbox` | Carpeta del buzón a monitorear (predeterminado: `INBOX`) |
| `imap_use_ssl` | Habilitar SSL/TLS (recomendado; predeterminado: `true`) |

### Notas

- El trigger IMAP establece una línea base del buzón actual en el primer sondeo y luego solo procesa el correo más reciente.
- Gmail, Microsoft 365 y otros proveedores alojados a menudo requieren una **contraseña de aplicación** o un secreto específico de IMAP similar.
- El contenido de los archivos adjuntos no se descarga en el payload del workflow; Heym expone únicamente los metadatos de los archivos adjuntos.

### Utilizado por

- [Nodo IMAP Trigger](../nodes/imap-trigger-node.md)
- [Triggers](./triggers.md) (IMAP como trigger de workflow)

---

## RabbitMQ

[RabbitMQ](https://www.rabbitmq.com) es un broker de mensajes de código abierto. La credencial RabbitMQ almacena los detalles de conexión para publicar y consumir desde colas e intercambios.

### Campos obligatorios

| Campo | Descripción |
|-------|-------------|
| `rabbitmq_host` | URL de conexión AMQP (p. ej., `amqp://localhost:5672`) |
| `rabbitmq_username` | Nombre de usuario de RabbitMQ (predeterminado: `guest`) |
| `rabbitmq_password` | Contraseña de RabbitMQ (predeterminado: `guest`) |

### Hosts virtuales

Para conectarse a un host virtual específico, inclúyalo en la URL `rabbitmq_host`:

```
amqp://username:password@hostname:5672/vhost
```

Si utiliza el host virtual predeterminado, la ruta `/` puede omitirse.

### Plugin de mensajes retardados

El [Nodo RabbitMQ](../nodes/rabbitmq-node.md) admite el plugin **rabbitmq_delayed_message_exchange**. Cuando este plugin está habilitado en su servidor RabbitMQ, puede establecer un retardo (en milisegundos) en los mensajes salientes utilizando el campo `rabbitmqDelayMs` del nodo.

El nodo establece el encabezado `x-delay` en el mensaje publicado. El tipo de intercambio debe ser `x-delayed-message` para que los retardos surtan efecto.

Para habilitar el plugin en una instancia de RabbitMQ autoalojada:

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

Cuando el plugin no está instalado, el encabezado `x-delay` se ignora y los mensajes se entregan de inmediato.

### Utilizado por

- [Nodo RabbitMQ](../nodes/rabbitmq-node.md)
- [Triggers](./triggers.md) (RabbitMQ como trigger de workflow)

---

## Amazon S3

La credencial Amazon S3 conecta Heym con [Amazon S3](https://aws.amazon.com/s3/). Úsela con el [Nodo Amazon S3](../nodes/amazon-s3-node.md) para gestionar buckets y carpetas, cargar y descargar objetos, copiar claves y listar o eliminar objetos desde los workflows.

### Campos obligatorios

| Campo | Descripción |
|-------|-------------|
| `aws_access_key_id` | ID de clave de acceso de AWS IAM |
| `aws_secret_access_key` | Clave de acceso secreta asociada al ID de clave de acceso |
| `aws_region` | Región de AWS donde residen los buckets (p. ej., `us-east-1`) |

### Campos opcionales

| Campo | Descripción |
|-------|-------------|
| `aws_session_token` | Token de sesión temporal cuando se utilizan credenciales de AWS STS |

### Notas

- La credencial utiliza autenticación estándar AWS SigV4 a través de boto3.
- Las operaciones de carga actualmente envían contenido de texto UTF-8; las descargas pueden devolver texto o base64 para objetos binarios.

### Utilizado por

- [Nodo Amazon S3](../nodes/amazon-s3-node.md)

---

## Redis

[Redis](https://redis.io) es un almacén de clave-valor en memoria utilizado para el almacenamiento en caché y el acceso rápido a datos.

### Campos obligatorios

| Campo | Descripción |
|-------|-------------|
| `host` | Nombre de host o IP del servidor Redis (p. ej., `localhost`) |
| `port` | Puerto de Redis (predeterminado: `6379`) |
| `password` | Contraseña de Redis (déjela vacía si no está establecida) |

### Utilizado por

- [Nodo Redis](../nodes/redis-node.md)

---

## Slack

La credencial Slack almacena una **URL de Webhook entrante** para publicar mensajes en canales de Slack.

### Campos obligatorios

| Campo | Descripción |
|-------|-------------|
| `webhook_url` | URL de Webhook entrante de Slack (desde la configuración de su aplicación de Slack) |

### Notas

- Cree un Webhook entrante en [api.slack.com/apps](https://api.slack.com/apps) → su aplicación → **Incoming Webhooks**.
- Cada Webhook está limitado a un canal específico. Cree múltiples credenciales para distintos canales.

### Utilizado por

- [Nodo Slack](../nodes/slack-node.md)

---

## Telegram

La credencial Telegram almacena un **Token de Bot** y un **Token secreto de Webhook** opcional para workflows basados en bots.
### Campos obligatorios

| Campo | Descripción |
|-------|-------------|
| `bot_token` | Token de la API de Telegram Bot obtenido de BotFather |

### Campos opcionales

| Campo | Descripción |
|-------|-------------|
| `secret_token` | Secreto compartido que se verifica contra `x-telegram-bot-api-secret-token` en los webhooks entrantes |

### Notas

- Utilice la misma credencial tanto para el [Telegram Trigger](../nodes/telegram-trigger-node.md) como para el [Telegram](../nodes/telegram-node.md).
- Registre el webhook manualmente con la API `setWebhook` de Telegram utilizando la URL que se muestra en el panel del nodo Telegram Trigger.
- El `chatId` en el nodo Telegram puede ser un ID literal o una expresión como `$telegramEvent.message.chat.id`.

### Utilizada por

- [Nodo Telegram Trigger](../nodes/telegram-trigger-node.md)
- [Nodo Telegram](../nodes/telegram-node.md)

---

## HTTP Auth (Bearer y Header)

Estas credenciales son utilizadas por el [nodo HTTP](../nodes/http-node.md) para autenticar solicitudes salientes.

### Bearer

Adjunta un encabezado `Authorization: Bearer <token>` a las solicitudes HTTP.

| Campo | Descripción |
|-------|-------------|
| `token` | El valor del token bearer |

### Header

Adjunta un encabezado personalizado a las solicitudes HTTP.

| Campo | Descripción |
|-------|-------------|
| `header_key` | Nombre del encabezado (p. ej. `X-Api-Key`) |
| `header_value` | Valor del encabezado |

Ambos tipos también pueden referenciarse mediante `$credentials.CredentialName` en el [Expression DSL](./expression-dsl.md) para su uso dinámico en cualquier nodo que acepte expresiones.

### Utilizada por

- [Nodo HTTP](../nodes/http-node.md)

---

## Proveedores de LLM (OpenAI, Google, Custom, Cohere)

Estas credenciales alimentan los nodos de IA.

| Tipo | Descripción |
|------|-------------|
| **OpenAI** | API key para modelos GPT y embeddings de OpenAI |
| **Google** | API key para modelos Gemini |
| **Custom** | API key + URL base para endpoints compatibles con OpenAI (Ollama, vLLM, LM Studio, etc.) |
| **Cohere** | API key para embeddings de Cohere |

### Caché de Prompt de OpenAI

OpenAI almacena en caché automáticamente el prefijo estático (invariable) de su system prompt, sin necesidad de configuración adicional. Las ejecuciones repetidas del workflow que comparten el mismo prefijo de system prompt se benefician del precio de tokens en caché, lo que reduce tanto el costo como la latencia. Esto resulta especialmente útil cuando dispone de instrucciones largas y fijas y solo el mensaje del usuario cambia entre ejecuciones. Supervise las tasas de aciertos de caché y el ahorro de tokens en la [pestaña Trazas](../tabs/traces-tab.md) o en el panel de uso de OpenAI para optimizar la estructura de su prompt y maximizar la reutilización de la caché.

### Utilizada por

- [Nodo LLM](../nodes/llm-node.md)
- [Nodo Agent](../nodes/agent-node.md)
- [Nodo RAG](../nodes/rag-node.md) (embeddings de OpenAI mediante la credencial de Qdrant)

---

## FlareSolverr

[FlareSolverr](https://github.com/FlareSolverr/FlareSolverr) es un servidor proxy para eludir Cloudflare y desafíos similares de protección contra bots.

### Campos obligatorios

| Campo | Descripción |
|-------|-------------|
| `flaresolverr_url` | URL de su instancia de FlareSolverr (p. ej. `http://localhost:8191`) |

Aquí se admiten direcciones de loopback y privadas, por lo que ejecutar FlareSolverr junto a Heym funciona según lo documentado. La URL no puede resolverse a una dirección link-local ni de metadatos de nube. Dado que se permiten direcciones privadas, este campo también puede apuntarse a otro servicio interno y la respuesta se devuelve en la salida del nodo. Cualquier usuario autenticado puede crear esta credencial, por lo que el límite lo constituyen quién puede crear workflows junto con sus reglas de red, no la compartición de credenciales. Consulte [Seguridad de egreso](../nodes/crawler-node.md#egress-safety).

### Utilizada por

- [Nodo Crawler](../nodes/crawler-node.md)

---

## Relacionado

- [Credenciales](./credentials.md) – Descripción general de las credenciales y cómo las utilizan los nodos
- [Pestaña Credenciales](../tabs/credentials-tab.md) – Agregar y gestionar credenciales
- [Compartición de credenciales](./credentials-sharing.md) – Compartir credenciales con usuarios y equipos
- [Seguridad](./security.md) – Cifrado en reposo, control de acceso
- [Expression DSL](./expression-dsl.md) – Sintaxis de `$credentials` para acceso dinámico

---

## Model Router (Auto Model)

Enruta cada solicitud a una de sus credenciales de modelo existentes, utilizando un modelo de decisión para
elegir. Almacena referencias, nunca una key propia.

### Campos obligatorios

- `decision_credential_id` – una credencial de **Decision Model** a la que tenga acceso.
- `decision_model` – el modelo que realiza la llamada de enrutamiento, por ejemplo `jev-latest`.
- `options` – al menos dos entradas, cada una con un nombre, una de sus credenciales de OpenAI/Google/Custom,
  un modelo sobre ella y criterios que indiquen cuándo debe ganar.

### Campos opcionales

- `routing_instructions` – cómo ponderar las opciones en conjunto.
- Una opción puede marcarse como la de respaldo utilizada cuando el enrutamiento falla.

### Notas

Los nombres de las opciones son entre los que el modelo de decisión elige, por lo que deben ser distintos. Una
opción no puede apuntar a otro Model Router.
