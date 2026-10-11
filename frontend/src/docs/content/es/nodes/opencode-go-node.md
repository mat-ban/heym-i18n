# Nodo OpenCode Go

El nodo **OpenCode Go** ejecuta la CLI de [OpenCode](https://opencode.ai) (Go) en un contenedor Heym aislado y reforzado contra un repositorio de GitHub. Al igual que el nodo Codex, está diseñado para tareas de programación como corregir pruebas, editar archivos, producir un parche o abrir una pull request, pero utiliza la pasarela de modelos **OpenCode Go**, agnóstica respecto al proveedor, en lugar de OpenAI Codex.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Credencial | Clave API de OpenCode Go + GitHub |
| Salida | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Autenticación

La credencial **OpenCode Go** almacena una **clave API** de la pasarela OpenCode Go (obtenida en [opencode.ai/go](https://opencode.ai/go)) y una **URL base de la pasarela** opcional (por defecto `https://opencode.ai/zen/go/v1`; sobrescríbala únicamente para una pasarela autoalojada o con proxy).

El nodo también requiere una credencial de **GitHub** para clonar repositorios privados, hacer push de la rama de trabajo y crear pull requests. El token de GitHub **nunca se coloca dentro del contenedor sandbox**; Heym realiza todas las operaciones de git y GitHub en el host, de modo que el código generado no puede exfiltrar las credenciales de push.

## Aislamiento y seguridad

El aislamiento de la ejecución se selecciona mediante `HEYM_OPENCODE_CLI_COMMAND`, exactamente igual que en el nodo Codex:

- **Desarrollo local (`run.sh`)** lo deja en el valor predeterminado `opencode`, por lo que OpenCode se ejecuta como un subproceso del host contra el espacio de trabajo clonado, sin necesidad de Docker ni de flags adicionales.
- **Despliegues con Docker (`deploy.sh` y la imagen única de GHCR)** lo establecen en `/usr/local/bin/heym-opencode-docker`, un wrapper que ejecuta `opencode run` dentro de un **contenedor hermano desechable y reforzado** que comparte el volumen nombrado del espacio de trabajo de OpenCode.

El contenedor de ejecución reforzado elimina todas las capacidades de Linux, establece `no-new-privileges`, utiliza una raíz de solo lectura con un tmpfs `/tmp` y aplica límites de pid, memoria y CPU. Se permite la salida de red (OpenCode debe alcanzar la pasarela de modelos). El **token de GitHub nunca se coloca dentro del contenedor**: todas las operaciones de git y GitHub se ejecutan en el host, por lo que solo la clave API de OpenCode y los archivos del repositorio están dentro.

OpenCode solo edita archivos en disco; Heym es el propietario de cada acción de git/GitHub.

## Modelos

El catálogo de modelos de OpenCode Go cambia con frecuencia, por lo que el campo **Model** se rellena en vivo desde la lista de modelos de la pasarela (`GET https://opencode.ai/zen/go/v1/models`) y se muestra como un desplegable con búsqueda. Si la lista en vivo no está disponible, se utiliza una lista de reserva integrada. Los identificadores de modelo usan la forma `opencode-go/<model>` (por ejemplo, `opencode-go/kimi-k3`, `opencode-go/deepseek-v4-pro`, `opencode-go/qwen3.7-max`); `opencode-go` es el identificador de proveedor de la CLI de OpenCode para la pasarela Go. Deje el campo vacío para usar el valor predeterminado del ejecutor (`opencode-go/kimi-k3`). Los identificadores de modelo guardados en la forma anterior `opencode/<model>` se reescriben automáticamente en tiempo de ejecución.

## Campos

| Campo | Descripción |
|-------|-------------|
| Credencial de OpenCode Go | Credencial de OpenCode Go (clave API de la pasarela) |
| Credencial de GitHub | Credencial de PAT de GitHub utilizada para el acceso al repositorio |
| URL del repositorio | URL HTTPS del repositorio de GitHub; admite expresiones |
| Rama base | Rama que se clona antes de que se ejecute OpenCode; por defecto `main` |
| Model | Modelo de OpenCode Go (desplegable con búsqueda en vivo, `opencode-go/<model>`); vacío usa el valor predeterminado del ejecutor |
| Variante de razonamiento | Opcional; se asigna a `opencode run --variant` para modelos que admiten esfuerzo de razonamiento |
| Prompt de tarea | Tarea de programación para OpenCode; admite expresiones como `$input.text` |
| Modo de publicación | Cómo se entregan los cambios (consulte la tabla a continuación) |
| Nombre de rama | Rama de trabajo para los modos PR/commit; por defecto `opencode/$executionId` |
| Tiempo de espera | Tiempo máximo de ejecución de OpenCode en segundos |

## Modos de publicación

| Modo | Qué hace |
|------|--------------|
| `diff_only` | Edita archivos localmente y devuelve el parche y los archivos modificados. No se hace push de nada. |
| `draft_pr` | Hace commit en la rama, la sube con push y abre una pull request en borrador. |
| `open_pr` | Hace commit en la rama, la sube con push y abre una pull request lista para revisión (no en borrador). |
| `commit_push` | Hace commit en la rama y la sube con push, sin abrir una pull request. |
| `direct_commit` | Hace commit y push directamente a la rama base (sin rama separada ni PR). |
| `open_or_update_pr` | Actualiza la PR abierta existente del agente cuando existe una, incluso si el nombre de la rama difiere, el ejecutor la encuentra por autor + base; de lo contrario, abre una nueva. Ideal para reejecuciones e instrucciones de "actualizar la PR abierta". |
| `update_existing_pr` | Añade un commit a la rama/PR existente; abre una si aún no existe ninguna. |
| `patch_artifact` | Guarda el diff como un archivo descargable y devuelve `patchUrl`. No se hace push de nada. |
## Salidas

| Clave | Descripción |
|-----|-------------|
| `status` | Siempre `completed` (el nodo OpenCode Go no se pausa para recibir entrada) |
| `summary` | Mensaje final de OpenCode |
| `validation` | Notas de validación cuando se reportan |
| `diff` | Parche de Git cuando se modifican archivos |
| `changedFiles` | Rutas de los archivos modificados |
| `branchName` | Nombre de la rama de trabajo |
| `pullRequestUrl` | URL del PR en los modos `draft_pr`, `open_pr`, `open_or_update_pr` y `update_existing_pr` |
| `pushedBranch` | Rama que se envió en los modos commit/PR |
| `patchUrl` | Enlace de descarga del diff en el modo `patch_artifact` |

## Capturas de pantalla de la UI en pull requests

Para tareas de UI/frontend, OpenCode debe guardar capturas de pantalla en formato PNG bajo una ruta ignorada por git, como `frontend/.e2e-artifacts/` (no en el código fuente). Si faltan dependencias de frontend, el prompt del runner permite una instalación de paquetes específica (por ejemplo, `bun install`) junto con una vista previa de corta duración o `bun run dev` únicamente para capturar la UI. Heym carga esas imágenes a un único **prerelease** compartido de GitHub (`opencode-pr-assets`) como assets con nombres `<branch>-…`, y luego las inserta en la descripción del PR **antes de que se abra el pull request**, de modo que un PR nuevo se crea ya con sus capturas de pantalla incluidas (los PR existentes se actualizan en su lugar).

También se indica a OpenCode que finalice con una línea `PR_TITLE: …` para que Heym pueda abrir el pull request con un asunto significativo en lugar de marcadores de posición como `Done.`

En ocasiones, OpenCode termina un turno a mitad de la tarea ("…Now let me take a screenshot"), lo que finalizaría la ejecución antes de capturar la captura de pantalla. Para evitarlo, el prompt del runner exige capturar las capturas de pantalla **antes** del mensaje final, y si la ejecución aun así finaliza sin un resumen publicable o con un cambio de UI pero sin captura de pantalla, Heym ejecuta una pasada adicional de OpenCode en el mismo espacio de trabajo para finalizar. Si un cambio de UI sigue sin captura de pantalla después de eso, se añade una nota visible al cuerpo del PR para que la carencia nunca pase desapercibida.

## Qué se publica en GitHub

Su **Task Prompt** es una entrada privada, no contenido del PR. Solo se publican dos cosas: una sección `## Change Summary` que describe qué hace el cambio de código, y una sección `## Screenshots` cuando se capturaron capturas de pantalla. El título del PR se deriva únicamente del resumen del cambio.

El prompt del runner declara esta política, y Heym también la aplica después de la ejecución: antes de que se confirme o se abra cualquier cosa como pull request, elimina las secciones de eco del prompt (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) y cualquier párrafo copiado textualmente del task prompt fuera del resumen, el cuerpo del PR y el mensaje de commit.

Heym lee la sección `## Change Summary` de los mensajes del agente en lugar de tomar lo último que dijo, porque OpenCode emite un mensaje por paso y el final suele ser un comentario a mitad de la ejecución. La narración de pasos (`Both pass. Let me do a final review:`) también se rechaza como título de PR o asunto de commit. Si la ejecución no produce un resumen de cambio utilizable, el pull request recurre a listar los archivos modificados en lugar de publicar comentarios.

## Como herramienta de agente

El nodo OpenCode Go se puede conectar al handle de herramienta de un nodo **AI Agent** para que el agente pueda delegar tareas de programación. Configure la credencial, la credencial de GitHub y el repositorio en el nodo, luego marque **Task Prompt** (y opcionalmente **Repository URL**) con el toggle proporcionado por el agente para que este los suministre en el momento de la llamada.

## Ejemplo

```json
{
  "id": "opencode-1",
  "type": "opencodeGo",
  "position": { "x": 420, "y": 120 },
  "data": {
    "label": "fix_pr",
    "credentialId": "opencode-credential-uuid",
    "githubCredentialId": "github-credential-uuid",
    "repositoryUrl": "https://github.com/acme/app",
    "baseBranch": "main",
    "taskPrompt": "$input.text",
    "publishMode": "open_pr",
    "branchName": "opencode/$executionId",
    "opencodeModel": "opencode-go/kimi-k3",
    "timeoutSeconds": 3600
  }
}
```

## Relacionado

- [Nodo Codex](./codex-node.md)
- [Nodo GitHub](./github-node.md)
- [Nodo Agent](./agent-node.md)
- [Credenciales](../reference/credentials.md)
- [Uso compartido de credenciales](../reference/credentials-sharing.md)
- [Tipos de nodos](../reference/node-types.md)
