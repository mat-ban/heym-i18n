# Seguridad

Prácticas de seguridad y configuración para la plataforma Heym.

## Política de contraseñas

Todas las contraseñas — tanto en el registro como al cambiar la contraseña — deben cumplir los siguientes requisitos:

| Regla | Requisito |
|------|-------------|
| Longitud mínima | 8 caracteres |
| Mayúsculas | Al menos una letra mayúscula (A–Z) |
| Minúsculas | Al menos una letra minúscula (a–z) |
| Dígito | Al menos un número (0–9) |

Estas reglas se aplican tanto en el frontend como en el backend (validador de Pydantic). Una solicitud con una contraseña que no cumpla los requisitos se rechaza con una respuesta `422 Unprocessable Entity` antes de que se realice cualquier escritura en la base de datos.

**Ejemplo de contraseña válida:** `MyWorkflow7!`

## Gestión de sesiones

- Los tokens de acceso se almacenan en cookies **HttpOnly**, no en `localStorage`. Esto impide que JavaScript (incluidos los payloads de XSS) pueda leer el token.
- El token de refresco está limitado a la ruta `/api/auth/refresh` y no puede enviarse a otros endpoints.
- Cada llamada a `/api/auth/refresh` **rota** el token de refresco: el token antiguo se revoca de inmediato y se emite uno nuevo. Reutilizar un token de refresco ya usado devuelve `401`.

## Limitación de tasa

Los siguientes endpoints tienen limitación de tasa por IP:

| Endpoint | Límite | Duración del bloqueo |
|----------|-------|--------------|
| `POST /api/auth/login` | 10 req / 60 s | 15 min |
| `POST /api/auth/register` | 5 req / 60 s | 10 min |
| `POST /register` (clientes OAuth) | 5 req / 60 s | 10 min |
| Inicio de sesión del Portal | 3 intentos | 24 h |

Cuando `REDIS_URL` está configurado, los límites de tasa se comparten entre todos los workers del backend. Sin esta variable, los límites se aplican por proceso worker.

## Cifrado de credenciales

Todas las API keys, URLs de webhook y bearer tokens almacenados en el panel de [Credenciales](../tabs/credentials-tab.md) se cifran en reposo mediante AES-256 (Fernet) antes de escribirse en la base de datos. La clave se deriva de la variable de entorno `ENCRYPTION_KEY`. Los scripts `run.sh` y `deploy.sh` generan automáticamente un valor seguro cuando está vacía; la aplicación se niega a iniciarse si `ENCRYPTION_KEY` está vacía o se deja en un valor de marcador de posición conocido.

## API Key de MCP

La API key de MCP se utiliza para autenticar clientes MCP externos que se conectan al endpoint `/api/mcp/sse`. Cuando se establece la conexión SSE, se emite un token de sesión de corta duración (1 hora) que se incrusta en la URL del endpoint de mensajes en lugar de la API key real, lo que evita que la clave aparezca en los logs de acceso del servidor. Consulte la [Pestaña MCP](../tabs/mcp-tab.md) para la configuración.

## OAuth / PKCE

El servidor de autorización OAuth 2.0 (utilizado para clientes MCP) solo admite el grant `authorization_code` con PKCE (`S256`). El formulario de consentimiento utiliza tokens CSRF HMAC-SHA256 válidos durante 10 minutos. Todos los valores mostrados en la página de consentimiento están escapados en HTML.

## Tokens de ejecución

Los [tokens de ejecución](./execution-tokens.md) son JWTs con alcance para llamar al endpoint de ejecución de un workflow desde sistemas externos. A diferencia de los tokens de sesión de usuario, estos son:

- **Con alcance a un único workflow** — un token se rechaza para cualquier otro workflow.
- **Revocables de forma independiente** — revocar un token no afecta a la sesión del usuario que lo emitió.
- **De vida corta o larga** — elija un TTL desde 60 segundos hasta 10 años.

Los tokens se firman con el mismo secreto de la aplicación (`SECRET_KEY`) y se verifican en cada solicitud: firma, expiración, coincidencia del claim `wid` y estado de revocación. Consulte [Tokens de ejecución](./execution-tokens.md) para la configuración y la referencia de la API.

## Seguridad de contenido

Utilice [Guardrails](./guardrails.md) en los nodos LLM y de agente para bloquear mensajes de usuario inseguros o que infrinjan las políticas antes de que lleguen al modelo. Guardrails admite nueve categorías de contenido (violencia, discurso de odio, contenido sexual, etc.) con niveles de sensibilidad configurables.

## Sandbox de herramientas Python

Las herramientas Python definidas por el usuario en el [Nodo de agente](../nodes/agent-node.md) ejecutan código no confiable. De forma predeterminada, Heym ejecuta cada herramienta dentro de un contenedor Docker endurecido y desechable con:

- sin acceso a la red,
- un sistema de archivos raíz de solo lectura con un pequeño directorio de trabajo `tmpfs`,
- un usuario no root con todas las capacidades de Linux eliminadas y `no-new-privileges`,
- límites estrictos de CPU, memoria y PID, y
- **sin Docker socket** montado, de modo que una herramienta no puede alcanzar el daemon Docker del host.

El backend de ejecución se controla mediante la variable de entorno `HEYM_PYTHON_TOOL_SANDBOX`:

| Valor | Comportamiento |
|-------|----------|
| `auto` (predeterminado) | Se ejecuta en el contenedor Docker endurecido. Si Docker no está disponible, la ejecución **falla de forma segura** — no ejecuta silenciosamente código no confiable sin aislamiento del sistema operativo. |
| `docker` | Igual que `auto`, pero nunca recurre a otra opción. |
| `subprocess` | Se ejecuta en un subproceso local en proceso protegido por una lista de importaciones permitidas. Esto **no es una frontera de seguridad** y está destinado únicamente a código confiable o desarrollo local. `run.sh` lo selecciona para el desarrollo nativo. |

Establezca `HEYM_PYTHON_TOOL_IMAGE` para fijar la imagen del sandbox; cuando está vacía, Heym detecta automáticamente la imagen del backend en ejecución. Las restricciones en proceso (una lista de importaciones permitidas más el filtrado de atributos e introspección) se aplican como defensa en profundidad, pero el contenedor es la verdadera frontera de aislamiento — mantenga el modo `auto` (o `docker`) predeterminado para implementaciones multiusuario y de producción.

## Sandbox de Skills

Las skills de Python asociadas a un [Nodo de agente](../nodes/agent-node.md) también ejecutan código no confiable —una skill puede llegar tal cual dentro de un workflow compartido o de una plantilla con visibilidad `everyone`—, por lo que las skills se ejecutan a través del **mismo** interruptor `HEYM_PYTHON_TOOL_SANDBOX` que las herramientas de Python y fallan de forma cerrada del mismo modo. El contenedor de skills está endurecido de forma idéntica (sin privilegios de root, todas las capacidades eliminadas, `no-new-privileges`, sistema de archivos raíz de solo lectura, límites de CPU/memoria/PID y **sin Docker socket**), con dos diferencias deliberadas porque las skills las necesitan legítimamente:

- **Se permite la salida de red** (las skills llaman a APIs e instalan sus propias dependencias mediante `uv`), y
- **se monta un espacio de trabajo con permisos de escritura** para que las skills puedan generar archivos de salida y leer archivos de Heym Drive.

El espacio de trabajo se comparte con el contenedor hermano desechable a través del mismo volumen Docker con nombre que utiliza el ejecutor de Codex (`heym-codex-workspaces`, montado en `/app/data/codex-workspaces`). Solo el subdirectorio propio de esta ejecución se monta en el contenedor hermano —mediante un `volume-subpath` por ejecución—, de modo que una skill nunca ve los datos del espacio de trabajo de otra ejecución ni de Codex. El stack de Docker Compose siempre monta este volumen; el `docker run` de contenedor único debe incluir `-v heym-codex-workspaces:/app/data/codex-workspaces` tanto para las skills de Python como para Codex. Si el volumen no existe en modo `auto`/`docker`, la ejecución de la skill **falla de forma cerrada** en lugar de ejecutarse en el backend. Dado que los montajes de subpath por ejecución requieren **Docker Engine 25.0 o superior**, los motores más antiguos deben actualizarse o ejecutar skills confiables con `HEYM_PYTHON_TOOL_SANDBOX=subprocess`.

Solo se reenvían al contenedor variables de entorno portables y no secretas (configuración de proxy y de CA-bundle, locale); las URLs de base de datos, `SECRET_KEY`/`ENCRYPTION_KEY`, las claves de API de proveedores y los secretos de OAuth se retienen mediante una allowlist. Las rutas de archivo de las skills se validan para que permanezcan dentro del espacio de trabajo, y los enlaces simbólicos plantados en el directorio de salida (incluido el centinela `_hitl_request.json`) nunca se siguen. Sobrescriba los valores predeterminados con `HEYM_SKILL_IMAGE`, `HEYM_SKILL_NETWORK`, `HEYM_SKILL_MEMORY`, `HEYM_SKILL_CPUS`, `HEYM_SKILL_PIDS` y `HEYM_SKILL_USER` si es necesario.

Al igual que con las herramientas, el modo `subprocess` ejecuta la skill en el proceso del backend y **no constituye una frontera de seguridad**; utilícelo solo para desarrollo local o de un único usuario de confianza (`run.sh` lo selecciona para desarrollo nativo).

## Sandbox del Nodo de código

El [Nodo de código](../nodes/code-node.md) ejecuta Python arbitrario del usuario junto con dependencias de terceros arbitrarias, por lo que es el más estricto de los tres sandboxes y el único que **no tiene vía de escape**: no lee ninguna variable de modo de sandbox, no tiene modo `subprocess` y falla de forma cerrada cuando no hay ningún daemon de Docker accesible. Nunca recurre a ejecutar código del usuario en el proceso del backend.

La ejecución consta de uno o dos contenedores desechables, ambos endurecidos como los sandboxes de herramientas y skills (sin privilegios de root, todas las capacidades eliminadas, `no-new-privileges`, sistema de archivos raíz de solo lectura, límites de CPU/memoria/PID y **sin Docker socket**):

- Con un `requirements.txt` vacío, un **contenedor único con `--network none`** ejecuta el código. El ejecutor llega en el payload de stdin del contenedor, por lo que no se monta nada en absoluto.
- Con dependencias, un primer contenedor las instala con acceso a la red en un directorio `.deps` por ejecución, y un segundo contenedor monta ese subárbol **en solo lectura** y ejecuta el código. El contenedor de ejecución no tiene red a menos que se active la opción `codeAllowNetwork` del nodo.

Las dependencias se instalan con `uv`, se reintentan con `pip` y nunca se almacenan en caché entre ejecuciones. Cuando el backend se ejecuta en un contenedor, el directorio por ejecución reside en el mismo volumen `heym-codex-workspaces` que utiliza el sandbox de skills, montado mediante un `volume-subpath` por ejecución para que una ejecución nunca vea los archivos de otra; esa forma requiere **Docker Engine 25.0 o superior**. Un backend nativo (`./run.sh`) no tiene dicho volumen y no lo necesita: su directorio por ejecución es una ruta temporal local montada directamente en el contenedor hermano. En cualquier caso, el directorio se elimina después de cada ejecución, independientemente del resultado.

Solo se reenvían a los contenedores variables de entorno portables y no secretas: configuración de proxy, CA bundles y locale, que la instalación de dependencias necesita para acceder a PyPI detrás de un proxy corporativo. Las URLs de base de datos, `SECRET_KEY`/`ENCRYPTION_KEY`, las claves de API de proveedores y los secretos de OAuth se retienen mediante una allowlist, de modo que un nuevo secreto del backend se descarta de forma predeterminada en lugar de filtrarse hasta que alguien actualice una denylist. El `HOME` del backend nunca sobrescribe la ruta de escritura propia del sandbox.

El botón **Format** utiliza el mismo sandbox. Ruff analiza y reescribe el código fuente en lugar de ejecutarlo, pero ejecutarlo en el host del backend entregaría a un archivo no confiable un proceso que hereda todo el entorno del backend, por lo que dispone de su propio contenedor desechable con `--network none`, los mismos límites y el mismo entorno con allowlist. Falla de forma cerrada sin Docker en lugar de formatear en el host.

Los límites del sandbox son constantes en lugar de variables de entorno: 512 MB de memoria, una CPU, 256 procesos, un tiempo de espera de instalación de 120 segundos y un tiempo de espera de ejecución de 60 segundos. La imagen se resuelve a partir de la cadena existente `HEYM_PYTHON_TOOL_IMAGE` / `HEYM_CODEX_DOCKER_IMAGE`; el nodo no introduce configuración propia.

## Relacionado

- [Ejecución y despliegue](../getting-started/running-and-deployment.md) – Configure `SECRET_KEY`, `ENCRYPTION_KEY`, `ALLOW_REGISTER` y `HEYM_PYTHON_TOOL_SANDBOX` al iniciar
- [Nodo de código](../nodes/code-node.md) – Ejecución de Python en sandbox con sus propias dependencias
- [Nodo de agente](../nodes/agent-node.md) – Herramientas de Python personalizadas que se ejecutan en el sandbox
- [Tokens de ejecución](./execution-tokens.md) – JWT con alcance para invocar workflows desde sistemas externos
- [Guardrails](./guardrails.md) – Bloquee contenido no seguro en los nodos LLM y de agente
- [Configuración](./user-settings.md) – Cambie su contraseña
- [Pestaña Credenciales](../tabs/credentials-tab.md) – Gestione claves de API
- [Pestaña MCP](../tabs/mcp-tab.md) – Clave de API de MCP y clientes OAuth
- [Portal](./portal.md) – Control de acceso al portal de chat público
