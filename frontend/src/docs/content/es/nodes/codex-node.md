# Nodo Codex

El nodo **Codex** ejecuta la CLI de OpenAI Codex en un espacio de trabajo aislado de Heym contra un repositorio de GitHub. Está diseñado para tareas de programación como corregir pruebas, editar archivos, producir un parche o abrir un pull request en borrador.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1, más `question` |
| Credencial | Token de acceso de Codex + GitHub |
| Salida | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Autenticación

La credencial **OpenAI Codex** admite dos modos de autenticación:

| Modo | Descripción |
|------|-------------|
| **Iniciar sesión con ChatGPT** (recomendado) | Inicio de sesión OAuth (PKCE) que utiliza su suscripción ChatGPT Plus/Pro, por lo que las ejecuciones **no** generan costos de API por token. Haga clic en **Iniciar sesión con ChatGPT** en el diálogo de credenciales, autorice en su navegador y luego pegue la URL de redirección `localhost:1455` de vuelta en Heym. Heym almacena el paquete de tokens resultante y lo renueva automáticamente a medida que expira. |
| **Token de acceso** | Pegue un `access_token` de ChatGPT/Codex utilizado únicamente por el ejecutor local de Codex. |

No se aceptan claves de API para la credencial de Codex. El nodo no envía tareas de Codex a la nube; clona el repositorio dentro del entorno de ejecución de Heym, escribe el paquete de tokens de ChatGPT en un `auth.json` aislado (o pasa `CODEX_ACCESS_TOKEN`) únicamente al proceso de Codex, y mantiene el token fuera de `$credentials`.

El nodo también requiere una credencial de **GitHub** para clonar repositorios privados, hacer push de la rama de trabajo y crear pull requests en borrador.

En implementaciones con Docker, Heym ejecuta Codex dentro de un contenedor hermano de la misma imagen de Heym (no una imagen GHCR separada). Ese contenedor monta únicamente el volumen del espacio de trabajo de Codex y permite que el propio sandbox bubblewrap de Codex cree namespaces y un `/proc` nuevo. El ejecutor agrega `SYS_ADMIN`, seccomp y AppArmor sin confinar, y `systempaths=unconfined` (Docker Engine 25+). Sin el último flag, cada comando falla antes de iniciarse con `bwrap: Can't mount proc on /newroot/proc: Operation not permitted`.

Referencias de OpenAI:

- [Autenticación de Codex](https://developers.openai.com/codex/auth)
- [Tokens de acceso de Codex](https://developers.openai.com/codex/enterprise/access-tokens)
- [Modelos de Codex](https://learn.chatgpt.com/docs/models?surface=cli)
- [Modo no interactivo de Codex](https://developers.openai.com/codex/noninteractive)
- [Precios de Codex](https://developers.openai.com/codex/pricing)

## Campos

| Campo | Descripción |
|-------|-------------|
| Credencial de Codex | Credencial de OpenAI Codex (inicio de sesión con ChatGPT o `access_token`) |
| Credencial de GitHub | Credencial de PAT de GitHub utilizada para el acceso al repositorio |
| URL del repositorio | URL HTTPS del repositorio de GitHub |
| Rama base | Rama que se clona antes de que se ejecute Codex, por defecto `main` |
| Modelo | Modelo de Codex opcional (menú desplegable editable, por ejemplo `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`); vacío utiliza el valor predeterminado de Codex |
| Esfuerzo de razonamiento | Profundidad de razonamiento de Codex: `low`, `medium`, `high`, `xhigh` (Extra High), `max` o `ultra` (por defecto `medium`) |
| Prompt de tarea | Tarea de programación para Codex; admite expresiones como `$input.text` |
| Modo de publicación | Cómo se entregan los cambios (consulte la tabla a continuación) |
| Nombre de rama | Rama de trabajo para los modos de PR/commit, por defecto `codex/$executionId` |
| Tiempo de espera | Tiempo máximo de ejecución de Codex en segundos |

## Modos de publicación

| Modo | Qué hace |
|------|--------------|
| `diff_only` | Edita archivos localmente y devuelve el parche y los archivos modificados. No se hace push de nada. |
| `draft_pr` | Hace commit en la rama, hace push de la misma y abre un pull request en borrador. |
| `open_pr` | Hace commit en la rama, hace push de la misma y abre un pull request listo para revisión (no borrador). |
| `commit_push` | Hace commit en la rama y hace push de la misma, sin abrir un pull request. |
| `direct_commit` | Hace commit y push directamente a la rama base (sin rama separada ni PR). |
| `open_or_update_pr` | Actualiza el PR abierto existente del agente cuando existe uno — incluso si el nombre de la rama difiere, el ejecutor lo encuentra por autor + base — de lo contrario abre uno nuevo. Ideal para re-ejecuciones e instrucciones de "actualizar el PR abierto". |
| `update_existing_pr` | Agrega un commit a la rama/PR existente; abre uno si aún no existe ninguno. |
| `patch_artifact` | Guarda el diff como un archivo descargable y devuelve `patchUrl`. No se hace push de nada. |

## Salidas

| Clave | Descripción |
|-----|-------------|
| `status` | `completed` o `needs_input` |
| `summary` | Resumen de Codex |
| `validation` | Notas de validación, pruebas o verificaciones reportadas por Codex |
| `diff` | Parche de Git cuando se modificaron archivos |
| `changedFiles` | Rutas de los archivos modificados |
| `threadId` | Id de hilo/sesión de Codex cuando está disponible |
| `branchName` | Nombre de la rama de trabajo |
| `pullRequestUrl` | URL del PR en los modos `draft_pr`, `open_pr`, `open_or_update_pr` y `update_existing_pr` |
| `pushedBranch` | Rama a la que se hizo push en los modos de commit/PR |
| `patchUrl` | Enlace de descarga del diff en el modo `patch_artifact` |
| `usage` | Metadatos de uso reportados por la CLI de Codex cuando están disponibles |
## Capturas de pantalla de la UI en pull requests

Para tareas de UI/frontend, Codex debe guardar capturas de pantalla en formato PNG bajo una ruta ignorada por git, como `frontend/.e2e-artifacts/` (no en el código fuente). Si faltan las dependencias de frontend, Codex puede ejecutar `bun install` (o npm/pnpm install) e iniciar una vista previa de corta duración o `bun run dev` únicamente para capturar la UI. Heym carga esas imágenes a un único **prerelease** compartido de GitHub (`codex-pr-assets`) como assets nombrados `<branch>-…`, y luego las inserta en la descripción del PR **antes de que se abra el pull request**, de modo que un nuevo PR se crea ya con sus capturas de pantalla incluidas (los PR existentes se actualizan en su lugar). Codex también debe establecer un `pull_request_title` significativo (nunca marcadores de posición como `Done.`).

En ocasiones, Codex finaliza un turno a mitad de la tarea ("…Ahora déjeme tomar una captura de pantalla"), lo que finalizaría la ejecución antes de que se capture la captura de pantalla. Para evitarlo, el prompt del runner exige capturar las capturas de pantalla **antes** del resultado final, y si la ejecución aún termina sin un resumen publicable o con un cambio de UI pero sin captura de pantalla, Heym ejecuta una pasada adicional de Codex en el mismo workspace para finalizar. Si un cambio de UI sigue sin captura de pantalla después de eso, se añade una nota visible al cuerpo del PR para que la carencia nunca pase desapercibida.

## Qué se publica en GitHub

Su **Task Prompt** es una entrada privada, no contenido del PR. Solo se publican dos cosas: un `## Change Summary` que describe qué hace el cambio de código, y una sección `## Screenshots` cuando se capturaron capturas de pantalla. El título del PR se deriva únicamente del resumen del cambio.

El prompt del runner declara esta política, y Heym también la aplica después de la ejecución: antes de que se confirme o se abra cualquier cosa como pull request, elimina las secciones de eco del prompt (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) y cualquier párrafo copiado textualmente del task prompt del resumen, del cuerpo del PR y del mensaje de commit. La narración de pasos como `Both pass. Let me do a final review:` también se rechaza como título de PR o asunto de commit.

## Preguntas de seguimiento

Si Codex necesita requisitos faltantes o una decisión de producto, devuelve `needs_input`. Heym pausa la ejecución y expone un handle de salida `question`. Conecte ese handle a una rama de notificación, por ejemplo Slack o Send Email, para enviar al revisor el enlace público de seguimiento.

Cuando el revisor responde, Heym reanuda el mismo snapshot de ejecución y el hilo de Codex desde los metadatos del workspace guardados.

## Como herramienta de agente

El Nodo Codex puede conectarse al handle de herramientas de un Nodo **AI Agent** para que el agente pueda delegar tareas de codificación. Configure la credencial, la credencial de GitHub y el repositorio en el nodo, luego marque **Task Prompt** (y opcionalmente **Repository URL**) con el toggle proporcionado por el agente para que el agente los suministre en el momento de la llamada. Cuando Codex se ejecuta como herramienta, un resultado `needs_input` se devuelve en línea al agente en lugar de pausar el workflow, de modo que el agente puede refinar la solicitud y llamar a Codex de nuevo.

## Ejemplo

```json
{
  "id": "codex-1",
  "type": "codex",
  "position": { "x": 420, "y": 120 },
  "data": {
    "label": "fix_pr",
    "credentialId": "codex-credential-uuid",
    "githubCredentialId": "github-credential-uuid",
    "repositoryUrl": "https://github.com/acme/app",
    "baseBranch": "main",
    "taskPrompt": "$input.text",
    "publishMode": "draft_pr",
    "branchName": "codex/$executionId",
    "timeoutSeconds": 3600
  }
}
```

## Relacionado

- [GitHub Node](./github-node.md)
- [Agent Node](./agent-node.md)
- [Credentials](../reference/credentials.md)
- [Credentials Sharing](../reference/credentials-sharing.md)
- [Node Types](../reference/node-types.md)
