# Uso compartido de Credenciales

Las Credenciales se pueden compartir con otros usuarios para que sus Workflows puedan utilizar sus claves de API. Consulte [Credenciales](./credentials.md) para obtener una visión general y [Pestaña Credenciales](../tabs/credentials-tab.md) para agregar y gestionar Credenciales.

## Compartir Credenciales con un LLM

Para permitir que un LLM o un agente de IA utilice una clave de API, almacene la clave como una Credencial y deje que el nodo que realiza la solicitud la adjunte. El modelo decide qué invocar; el nodo autentica la llamada cuando se ejecuta.

- **Almacene el secreto como una Credencial.** Los valores sensibles se cifran en reposo y se enmascaran en la interfaz de usuario después de su creación.
- **Referencie la Credencial donde se realiza la solicitud.** Los nodos [LLM](../nodes/llm-node.md) y [Agent](../nodes/agent-node.md) seleccionan su Credencial de modelo por ID, y las solicitudes HTTP colocan `$credentials.CredentialName` en el encabezado de autenticación. Mantenga los secretos fuera de los campos de Prompt, ya que todo lo que se incluye en un Prompt se envía al proveedor del modelo como texto.
- **Proporcione herramientas al agente, no claves.** Cuando un Agent invoca un nodo HTTP, un servidor MCP o un sub-Workflow como herramienta, la Credencial se aplica dentro de esa herramienta y el modelo recibe el resultado de la herramienta.
- **Las salidas están enmascaradas.** Cuando un valor de Credencial de más de siete caracteres aparece en la salida de un nodo, solo se conservan sus primeros siete caracteres, de modo que una respuesta que reproduzca una clave mostrará únicamente ese prefijo en los resultados y las Trazas. Consulte [Enmascaramiento de salidas](#output-masking).
- **Permita que el asistente cree Credenciales.** Cuando el [Asistente de IA](./ai-assistant.md#credentials) o la pestaña Chat crean una Credencial, solo ven el nombre y el tipo, y usted introduce el secreto en el formulario habitual de Credenciales.
- **Comparta con otras personas de la misma manera.** Comparta la Credencial con un usuario o un equipo, como se describe a continuación, y sus Workflows podrán utilizar su clave a través de sus propios nodos LLM y Agent.

## Modelo de uso compartido

- **CredentialShare** – Vincula `credential_id` con `user_id` (único por par)
- **Compartir por correo electrónico** – `POST /api/credentials/{credential_id}/shares` con el correo electrónico; se busca al usuario y se agrega
- **Revocar** – `DELETE /api/credentials/{credential_id}/shares/{user_id}`

También puede compartir Credenciales con [Equipos](./teams.md):

- **CredentialTeamShare** – Vincula `credential_id` con `team_id`; todos los miembros del equipo obtienen acceso
- **Compartir con un equipo** – `POST /api/credentials/{credential_id}/team-shares` con `team_id`
- **Revocar uso compartido con equipo** – `DELETE /api/credentials/{credential_id}/team-shares/{team_id}`

Las Credenciales compartidas muestran un indicador en la interfaz de usuario de la [Pestaña Credenciales](../tabs/credentials-tab.md).

## Credenciales de alcance amplio

Compartir una Credencial otorga al destinatario todo lo que esa Credencial puede hacer. Para la mayoría de las integraciones, esto se limita a un espacio de trabajo o a los permisos de una clave de API, pero algunas Credenciales tienen un alcance mucho más amplio.

> **Las Credenciales de Google Drive otorgan acceso completo a Drive.** La Credencial de [Google Drive](../nodes/google-drive-node.md) se autoriza con el scope `https://www.googleapis.com/auth/drive` para que el nodo pueda operar sobre archivos que ya posee. Compartirla con un usuario o un equipo otorga a cada uno de ellos la capacidad de **leer, modificar y eliminar permanentemente cualquier elemento de su Google Drive** a través de un Workflow, no solo los archivos que tenía en mente. Compártala únicamente con personas a las que otorgaría acceso completo a Drive directamente.

Si necesita limitar la exposición, cree una cuenta de Google dedicada con acceso solo a las carpetas que el Workflow necesita, y conecte la Credencial con esa cuenta en lugar de su cuenta principal.

Una Credencial de **Decision Model** incluye el endpoint y, cuando se configura, una clave de API. Compartirla permite al destinatario consumir esa clave desde cualquier Workflow que pueda ejecutar, exactamente igual que una Credencial de LLM.

Una Credencial de **Model Router** comparte todo aquello a lo que enruta. Las personas con quienes la comparta pueden ejecutar solicitudes contra cada Credencial de su lista de opciones, y esas solicitudes consumen sus claves. No pueden leer las claves, y las Credenciales no aparecen en su propia lista de Credenciales.

Esto constituye la misma concesión que compartir una Credencial de OpenAI directamente, y es lo que hace útil un router para un equipo. Si no desea eso, comparta las Credenciales individuales en su lugar y permita que cada persona elija un modelo.

## Compartir con colaboradores de Workflows

Cuando comparte un Workflow, los colaboradores pueden abrirlo y ejecutarlo, pero no pueden utilizar sus Credenciales a menos que también las comparta con ellos. Esto se aplica a las Credenciales del Workflow principal y de cualquier sub-Workflow que este invoque. Comparta cada Credencial con los mismos usuarios o equipos que invitó al Workflow. Los sub-Workflows también deben compartirse por separado desde el editor del Workflow secundario. Consulte [Organización de Workflows](./workflow-organization.md#sharing-workflows).
## Contexto de ejecución

Cuando se ejecuta un workflow, las credenciales se resuelven para el **propietario del workflow** (o el usuario actual en el momento de la ejecución). `get_credentials_context()` combina:

1. **Credenciales propias** – `Credential.owner_id == user_id`
2. **Credenciales compartidas por el usuario** – `CredentialShare` donde `CredentialShare.user_id == user_id`
3. **Credenciales compartidas por el equipo** – `CredentialTeamShare` donde el usuario es miembro del equipo

Todas se combinan en un único diccionario de contexto indexado por el nombre de la credencial.

## Uso en Workflows

### Por nombre (Expression DSL)

Las credenciales se exponen como `$credentials.CredentialName` en el [Expression DSL](./expression-dsl.md). Utilice esta opción para:

- Nodos HTTP (autenticación Bearer/Header)
- Nodos Telegram
- Nodos Slack
- Tokens de Notion en solicitudes HTTP personalizadas (token interno o token de acceso OAuth)
- Cualquier nodo que acepte expresiones para autenticación

```dsl
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

### Por ID (credentialId)

Algunos nodos almacenan `credentialId` (UUID) en `node.data`:

| Tipo de nodo | Campo | Descripción |
|-----------|-------|-------------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md), Image Gen | `credentialId` | Credencial de API de LLM |
| [Codex](../nodes/codex-node.md) | `credentialId`, `githubCredentialId` | Credencial de token de acceso de Codex y credencial de GitHub |
| [OpenCode Go](../nodes/opencode-go-node.md) | `credentialId`, `githubCredentialId` | Credencial del gateway de OpenCode Go y credencial de GitHub |
| [Jira](../nodes/jira-node.md) | `credentialId` | Credencial de correo electrónico/token de API de Jira Cloud o de nombre de usuario/contraseña de Data Center |
| [Notion](../nodes/notion-node.md) | `credentialId` | Credencial de token interno de Notion o de espacio de trabajo OAuth |
| [Sentry](../nodes/sentry-node.md) | `credentialId` | Token de autenticación de Sentry y URL base opcional |
| [Supabase](../nodes/supabase-node.md) | `credentialId` | URL del proyecto Supabase y clave de API |
| [ClickHouse](../nodes/clickhouse-node.md) | `credentialId` | Detalles de conexión de ClickHouse (host, puerto, autenticación, base de datos) |
| [Telegram Trigger](../nodes/telegram-trigger-node.md), [Telegram](../nodes/telegram-node.md) | `credentialId` | Credencial del bot de Telegram |
| [Discord Trigger](../nodes/discord-trigger-node.md), [Discord](../nodes/discord-node.md) | `credentialId` | Clave pública de Discord o credencial de Webhook |
| Vector Store | `credential_id` | Base de datos vectorial Qdrant o Postgres (pgvector), mediante una credencial de RAG de Qdrant, Psql o Custom Embeddings |
| Evals | `credential_id`, `judge_credential_id` | Credencial de modelo; una credencial de modelo o Decision Model para el juez LLM-as-Judge |
| [Playwright](../nodes/playwright-node.md) paso AI | `credentialId` | Modelo LLM/Vision (para el paso AI y [Auto Heal](../nodes/playwright-node.md#ai-auto-heal)) |

El ejecutor carga la credencial directamente desde la base de datos por ID y descifra la configuración.

## Enmascaramiento de salida

Tras la ejecución, `mask_sensitive_output()` enmascara los valores de las credenciales en las salidas, conservando los primeros siete caracteres de cada secreto de más de siete caracteres y reemplazando el resto con `**`, de modo que los secretos no queden expuestos en los resultados ni en las trazas.

## Relacionado

- [Pestaña Credenciales](../tabs/credentials-tab.md) – Añadir y compartir credenciales
- [Integraciones de terceros](./integrations.md) – Configuración detallada para cada tipo de credencial
- [Equipos](./teams.md) – Compartir con equipos
- [Expression DSL](./expression-dsl.md) – Sintaxis de `$credentials`
- [Tipos de nodo](./node-types.md) – Nodos que utilizan credenciales ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [Playwright](../nodes/playwright-node.md), [HTTP](../nodes/http-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md))
- [Nodo Agent](../nodes/agent-node.md) – Utiliza `credentialId` para LLM
