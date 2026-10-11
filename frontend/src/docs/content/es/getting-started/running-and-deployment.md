# Ejecución y Despliegue

Heym proporciona dos scripts para distintos entornos: `run.sh` para desarrollo local y `deploy.sh` para despliegues en producción mediante Docker Compose.

> **Recorrido en vídeo:** [Configure Heym localmente en menos de 2 minutos](https://www.youtube.com/watch?v=P6YvlupUboU) — clone el repositorio, inicie PostgreSQL, complete las variables de entorno requeridas y cree su primera cuenta en una instancia local.

## Requisitos previos

Ambos scripts requieren que las siguientes herramientas estén instaladas:

| Herramienta | Propósito |
|------|---------|
| [Docker](https://docs.docker.com/get-docker/) | Contenedor de base de datos (dev) y stack completo (prod) |
| [uv](https://github.com/astral-sh/uv) | Gestor de paquetes de Python para el backend |
| [bun](https://bun.sh) | Entorno de ejecución de JavaScript para el frontend |

## Configuración del entorno

Tanto `run.sh` como `deploy.sh` leen de un archivo `.env` en la raíz del proyecto. Si no existe, el script crea uno automáticamente a partir de `.env.example` — tanto para desarrollo local como para producción.

`SECRET_KEY` y `ENCRYPTION_KEY` se distribuyen vacías en `.env.example`. Cuando alguna de ellas está vacía, `run.sh` y `deploy.sh` generan automáticamente un valor criptográficamente fuerte y lo escriben de vuelta en `.env`, de modo que una configuración nueva no requiere gestión manual de claves. Si un `.env` existente aún contiene el placeholder heredado de `ENCRYPTION_KEY` (`change_this_to_a_random_32_byte_hex_value`), los scripts se detienen con un error explícito en lugar de sobrescribirlo — rotar esa clave dejaría ilegibles las credenciales cifradas previamente. El propio backend también se niega a arrancar si alguna de las claves está vacía o permanece en un placeholder conocido.

Para crear el archivo manualmente (opcional — los scripts lo hacen por usted):

```bash
cp .env.example .env
```

Variables de entorno clave:

Para consultar todas las variables admitidas, sus valores predeterminados y las notas de producción, consulte [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Variable | Descripción |
|----------|-------------|
| `SECRET_KEY` | **Requerida.** Secreto de firma de JWT. Generada automáticamente por `run.sh`/`deploy.sh` cuando está vacía. |
| `ENCRYPTION_KEY` | **Requerida.** Clave de cifrado de credenciales. Generada automáticamente por `run.sh`/`deploy.sh` cuando está vacía. |
| `DATABASE_URL` | Cadena de conexión a la base de datos opcional que sobrescribe la configuración. Si está vacía, Heym la construye a partir de los ajustes `POSTGRES_*`. |
| `BACKEND_PORT` | Puerto de la API del backend — por defecto `10105` |
| `FRONTEND_PORT` | Puerto del frontend — por defecto `4017` |
| `FRONTEND_URL` | **Requerida en producción.** URL pública de la aplicación (esquema + host, por ejemplo `https://heym.example.com`). Se utiliza para los URI de redirección de OAuth (Google Sheets, BigQuery, Notion y similares), y para los enlaces de revisión, seguimiento de Codex y archivos que generan las ejecuciones en segundo plano; debe coincidir con la URL que los usuarios utilizan en el navegador. En un cluster, establezca el mismo valor en cada instancia. |
| `ALLOW_REGISTER` | Registro de usuarios abierto (`false` en prod, `true` en dev). Cámbielo a `false` solo después de que exista su cuenta de administrador — no hay bootstrap del primer usuario, por lo que una base de datos vacía junto con el registro deshabilitado no deja ninguna forma de crear una. |
| `DOCKER_LOGS_ENABLED` | Habilita el acceso a la pestaña Logs respaldada por Docker cuando se establece en `true`; también requiere acceso al socket de Docker |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Lista separada por comas de correos de usuarios de confianza autorizados a acceder a los logs de Docker cuando `DOCKER_LOGS_ENABLED=true` |
| `REQUEST_BODY_MAX_SIZE_MB` | Tamaño máximo del cuerpo de la solicitud HTTP aceptado antes de que se ejecuten los manejadores del endpoint; por defecto `100`, un MB por encima de `FILE_MAX_SIZE_MB` para dejar margen al overhead de multipart |
| `HEYM_PYTHON_TOOL_SANDBOX` | Cómo se ejecutan las herramientas de Python definidas por el usuario: `auto` (predeterminado — contenedor Docker aislado y endurecido; falla de forma segura si Docker no está disponible), `docker` (igual, nunca recurre a otra opción), o `subprocess` (fallback local en proceso; no es una frontera de seguridad, solo para entornos de confianza/dev). `run.sh` establece `subprocess` para el desarrollo nativo. Consulte [Security](../reference/security.md#python-tool-sandbox). |
| `HEYM_PYTHON_TOOL_IMAGE` | Imagen utilizada para el sandbox Docker de herramientas de Python. Vacío = detecta automáticamente la imagen del backend en ejecución. |

Los valores predeterminados de conexión a la base de datos (`POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) están documentados en [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) y en `.env.example`.

---

## Desarrollo: `run.sh`

`run.sh` inicia los tres servicios localmente —la base de datos (como contenedor Docker), el backend de FastAPI y el servidor de desarrollo de Vite— con un único comando.

```bash
./run.sh
```

**Qué hace, paso a paso:**

1. Verifica que `docker`, `bun` y `uv` estén disponibles
2. Crea `.env` a partir de `.env.example` si no existe, y genera un `SECRET_KEY` y un `ENCRYPTION_KEY` aleatorios cuando alguno esté vacío
3. Inicia (o crea) un contenedor Docker de base de datos en el puerto `6543`, almacenando sus datos en el volumen Docker `heym-postgres-data` en lugar de un directorio del host
4. Instala las dependencias de Python mediante `uv sync`
5. Ejecuta las migraciones de base de datos de Alembic (`alembic upgrade head`)
6. Libera los puertos del backend y del frontend si están ocupados
7. Inicia el backend de FastAPI con `--reload` (recarga en caliente ante cambios en el código)
8. Instala las dependencias del frontend mediante `bun install`
9. Inicia el servidor de desarrollo de Vite

**Opciones:**

| Flag | Descripción |
|------|-------------|
| *(ninguna)* | Inicia con el registro de depuración habilitado (`LOG_LEVEL=DEBUG`) |
| `--no-debug` | Inicia con el nivel de log predeterminado (sin salida de depuración) |
| `--help` | Muestra la información de uso |

**Direcciones de los servicios (dev):**

| Servicio | Dirección |
|---------|---------|
| Frontend | `localhost` en `FRONTEND_PORT` (predeterminado: 4017) |
| API del backend | `localhost` en `BACKEND_PORT` (predeterminado: 10105) |
| Documentación interactiva de la API | `localhost:10105/docs` |
| Base de datos | `localhost:6543` |

Pulse `Ctrl+C` para detener todos los servicios de forma ordenada.

---

## Pruebas de extremo a extremo: `run_e2e.sh`

La suite de Playwright del frontend se ejecuta contra la aplicación Vue real, el backend de FastAPI y una base de datos PostgreSQL aislada:

```bash
./run_e2e.sh
```

La suite es una suite de smoke y regresión de rutas clave, no una cobertura exhaustiva del producto. Cubre la autenticación, el ciclo de vida y la ejecución de los workflows principales, recursos seleccionados del panel, rutas públicas y una interfaz de revisión HITL simulada. Las integraciones con proveedores, todos los tipos de nodo, las matrices de uso compartido y permisos, y la ejecución completa de reanudación HITL siguen cubiertas principalmente por las pruebas del backend o requieren entornos de integración dedicados.

Cada ejecución obtiene su propio contenedor temporal de PostgreSQL 16, puertos aleatorios disponibles para base de datos, backend y frontend, estado de autenticación, resultados de pruebas e informe HTML. Esto permite que varios procesos de `run_e2e.sh` se ejecuten de forma concurrente sin compartir estado ni sobrescribir artefactos. El script elimina su contenedor de base de datos cuando finaliza la ejecución e imprime el directorio de artefactos y la ruta del informe.

Comandos útiles:

```bash
./run_e2e.sh --ui         # Ejecutor interactivo de Playwright con una base de datos aislada
cd frontend
bun run test:e2e:report   # Abre la ejecución local completada más reciente
```

Las ejecuciones directas de `bun run test:e2e` y `bun run test:e2e:ui` requieren un `DATABASE_URL` explícito, de modo que no puedan iniciarse silenciosamente contra la base de datos de desarrollo local. Utilice `./run_e2e.sh` para las ejecuciones locales habituales.

`./check.sh` ejecuta lint, typecheck, formateo y las pruebas del backend sin la suite E2E, manteniendo rápido el flujo de verificación local predeterminado. Ejecute las pruebas E2E de Playwright por separado con `./run_e2e.sh`. Las pull requests siempre ejecutan la suite E2E de Chromium en GitHub Actions y conservan las trazas, capturas de pantalla, vídeos y el informe HTML cuando se producen fallos.

---

## Producción: `deploy.sh`

`deploy.sh` compila y ejecuta el stack completo mediante Docker Compose. Los tres servicios —la base de datos, el backend y el frontend— se ejecutan como contenedores. El entrypoint del backend ejecuta las migraciones automáticamente antes de iniciar el servidor con 8 workers.

**Despliegue inicial (compilar + iniciar):**

```bash
./deploy.sh
```

Esto realiza un despliegue sin tiempo de inactividad: las imágenes se compilan primero mientras los contenedores existentes siguen en ejecución, y después se sustituye la versión anterior por la nueva.

**Comandos disponibles:**

| Comando | Descripción |
|---------|-------------|
| `./deploy.sh` | Compila las imágenes e inicia/actualiza todos los servicios |
| `./deploy.sh --status` | Muestra el estado de los contenedores |
| `./deploy.sh --logs` | Transmite los logs de todos los contenedores |
| `./deploy.sh --restart` | Reinicia todos los contenedores |
| `./deploy.sh --down` | Detiene y elimina todos los contenedores |
| `./deploy.sh --migrate-pgdata` | Migración única: copia un directorio `data/postgres` existente al volumen Docker `heym-postgres-data` y reconstruye sus índices |
| `./deploy.sh --help` | Muestra la información de uso |

**Almacenamiento de la base de datos: un volumen con nombre de Docker, no un directorio del host.**

Compose almacena PostgreSQL en el volumen Docker `heym-postgres-data`. Las versiones anteriores montaban en su lugar el directorio del host `./data/postgres` mediante bind mount. Los bind mounts del host en macOS (virtiofs) y Windows/WSL2 no ofrecen a PostgreSQL las garantías de `fsync` y cierre de archivos que requiere: los clústeres en esas plataformas sufren `PANIC: could not close file … Input/output error` en segmentos WAL y se corrompen con el tiempo. Los bind mounts de Linux nunca se vieron afectados, pero ahora todas las plataformas utilizan la misma disposición.

Actualizar un despliegue que todavía tiene datos en `./data/postgres` es un paso único. `./deploy.sh` lo detecta, se detiene antes de compilar y solicita migrar primero:

```bash
./deploy.sh --migrate-pgdata   # detiene los servicios, copia al volumen, reconstruye los índices
./deploy.sh                    # despliega como de costumbre
```

**La migración también reconstruye los índices.** La copia es byte a byte, por lo que el daño en los índices causado por el antiguo bind mount viaja con ella. Por ello, `--migrate-pgdata` inicia únicamente el servicio `postgres` sobre el nuevo volumen, ejecuta `reindexdb` contra él y lo detiene de nuevo antes de que arranque el resto del stack. Esto es importante porque este tipo de corrupción deja entradas de índice apuntando más allá del final del heap —un estado que `pg_amcheck` reporta como limpio, de modo que una comprobación satisfactoria no es evidencia de una tabla sana. REINDEX repara esas entradas; no puede restaurar páginas del heap que el antiguo sistema de archivos ya perdió. En una base de datos grande y de salud conocida, es posible omitir la reconstrucción con `./deploy.sh --migrate-pgdata --skip-reindex`.

La copia no es destructiva. `./data/postgres` permanece en su sitio como copia de seguridad, y la migración se niega a sobrescribir un volumen que ya contiene una base de datos. Si algún paso falla, el nuevo volumen se elimina, de modo que un clúster a medio migrar nunca puede desplegarse por error. Elimine el directorio antiguo una vez haya confirmado que sus workflows están intactos. El contenedor `postgres` incorpora la misma protección, de modo que un `docker compose up` manual tampoco puede inicializar silenciosamente una base de datos vacía sobre sus datos. Las instalaciones nuevas no requieren ninguna acción.

**Direcciones de los servicios (producción):**

El contenedor del frontend se expone en `FRONTEND_PORT` (por defecto: 4017). La API del backend se sirve bajo la ruta `/api`, proxificada a través del contenedor del frontend, por lo que en producción solo hay un puerto de cara al público.

**Resumen de contenedores:**

| Contenedor | Descripción |
|-----------|-------------|
| `heym-db` | Base de datos relacional |
| `heym-backend` | Servidor de API FastAPI (8 workers, compilado desde `backend/Dockerfile`) |
| `heym-frontend` | Contenedor de preview del frontend que sirve la aplicación Vue compilada (compilado desde `frontend/Dockerfile`) |

**Insignia de actualización de versión:**

El encabezado de la aplicación muestra la versión de la compilación de Docker en ejecución. Cuando esa versión está por detrás de la última release de Heym en GitHub, aparece una insignia morada de **Update** junto a la versión. Haga clic en la versión o en la insignia para abrir la página de releases de Heym en GitHub.

---

## Imagen precompilada: `docker run`

Si prefiere no compilar la aplicación localmente, puede descargar la imagen de contenedor publicada y ejecutarla directamente.

La imagen inicia el frontend y el backend juntos en un único contenedor. PostgreSQL sigue siendo externo, pero puede proporcionar `DATABASE_URL` o las variables `POSTGRES_*` de `.env.example`.

> **Almacene la base de datos en un volumen nombrado de Docker.** La imagen de la versión no incluye ninguna base de datos, por lo que el PostgreSQL detrás de `DATABASE_URL` es responsabilidad suya. Móntelo como `-v heym-postgres-data:/var/lib/postgresql/data` en lugar de una ruta del host: en macOS (virtiofs) y Windows/WSL2, un directorio de datos de PostgreSQL montado como bind no respeta las garantías de `fsync` que requiere la base de datos y corrompe el clúster con el tiempo.

> **Backend del almacén vectorial.** `run.sh` y `deploy.sh` ejecutan la imagen oficial `postgres:16` e instalan automáticamente el paquete `postgresql-16-pgvector` al arrancar, por lo que el **backend RAG de Postgres (pgvector)** funciona sin configuración adicional allí, sin cambios en sus datos. Sin embargo, la imagen precompilada de un solo contenedor se conecta a un PostgreSQL que **usted** proporciona: esa base de datos debe admitir la extensión `vector` para usar el backend de Postgres. Heym no puede instalar pgvector en una base de datos que no gestiona. Sin ella, la migración de arranque omite la tabla de pgvector de forma controlada: el despliegue sigue teniendo éxito, el RAG de Qdrant sigue funcionando y la creación o carga a un almacén vectorial de Postgres devuelve un mensaje claro de "backend no disponible" hasta que se habilite pgvector.

**Configure las claves usted mismo para ejecuciones directas de la imagen.** A diferencia de `run.sh`/`deploy.sh`, la imagen precompilada no genera claves automáticamente. Tras `cp .env.example .env`, complete las dos claves vacías (reemplazar en el mismo lugar evita entradas duplicadas):

```bash
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
ENCRYPTION_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
sed -i.bak "s|^SECRET_KEY=.*|SECRET_KEY=${SECRET_KEY}|; s|^ENCRYPTION_KEY=.*|ENCRYPTION_KEY=${ENCRYPTION_KEY}|" .env && rm -f .env.bak
```

```bash
docker pull ghcr.io/heymrun/heym:latest

docker run --rm \
  --env-file .env \
  -p 4017:4017 \
  --shm-size 2g \
  -e FILE_STORAGE_DIR=/app/data/files \
  -e HEYM_PLUGINS_DIR=/app/data/plugins \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$(pwd)/data/files:/app/data/files" \
  -v "$(pwd)/data/plugins:/app/data/plugins" \
  -v heym-codex-workspaces:/app/data/codex-workspaces \
  -v heym-opencode-workspaces:/app/data/opencode-workspaces \
  ghcr.io/heymrun/heym:latest
```

> **Haga absolutos los montajes de archivos y plugins.** `FILE_STORAGE_DIR` y `HEYM_PLUGINS_DIR` tienen como valores predeterminados las rutas relativas `./data/files` y `data/plugins`, y la imagen de la versión inicia el backend desde `/app/backend`. Si se dejan relativas, se resuelven como `/app/backend/data/files` y `/app/backend/data/plugins`, por lo que los dos bind mounts anteriores no reciben nada y las cargas se pierden cuando se reemplaza el contenedor. Los indicadores `-e` sobrescriben los valores relativos que `.env.example` proporciona mediante `--env-file`, porque `-e` en la línea de comandos prevalece sobre `--env-file`. Compose (`./deploy.sh`) no necesita esto: esa imagen ejecuta el backend desde `/app`, donde los valores predeterminados relativos ya coinciden con los montajes.

> **Acceso al socket de Docker.** Montar `/var/run/docker.sock` otorga al backend un amplio control sobre el daemon de Docker del host. El servicio predeterminado de Docker Compose y el ejemplo directo de `docker run` lo incluyen para las herramientas MCP stdio basadas en Docker que ejecutan comandos `docker`. La pestaña Logs sigue requiriendo `DOCKER_LOGS_ENABLED=true` y `DOCKER_LOGS_ALLOWED_EMAILS` con una lista separada por comas de correos de usuarios de confianza. Cree la cuenta de administrador de confianza antes de habilitar los logs de Docker, o mantenga `ALLOW_REGISTER=false`, para que un autorregistro no verificado no pueda reclamar un correo incluido en la lista de permitidos. Las herramientas Python definidas por el usuario **no** obtienen este socket: se ejecutan en un contenedor endurecido independiente sin socket de Docker. Consulte [Seguridad](../reference/security.md#python-tool-sandbox).

> **Runner de Codex.** El Nodo de Codex usa la misma imagen `ghcr.io/heymrun/heym` como contenedor runner hermano (`--entrypoint codex`) para que el sandbox de Linux de Codex pueda crear namespaces. Mantenga el montaje del volumen `heym-codex-workspaces` si desea workflows de Codex en la configuración directa de la imagen; el runner no recibe el socket de Docker ni los secretos del backend.

> **Runner de OpenCode Go.** El Nodo de OpenCode Go usa la misma imagen como runner hermano endurecido (`--entrypoint opencode`) compartiendo `heym-opencode-workspaces`. Mantenga ese montaje de volumen si desea workflows de OpenCode en la configuración directa de la imagen; el runner no recibe el socket de Docker ni el token de GitHub.

> **Sandbox de skills.** Las skills de Python en el Nodo de agente se ejecutan en un contenedor hermano endurecido que comparte el volumen `heym-codex-workspaces`, por lo que también debe mantener ese montaje de volumen para las skills, no solo para Codex. Cada ejecución obtiene una subruta aislada por ejecución, y el hermano no recibe ni el socket de Docker ni los secretos del backend. Esto requiere **Docker Engine 25.0+**; en motores más antiguos, o sin el volumen, `HEYM_PYTHON_TOOL_SANDBOX=auto` falla de forma segura: configure `HEYM_PYTHON_TOOL_SANDBOX=subprocess` solo para configuraciones de un único usuario de confianza. Consulte [Seguridad](../reference/security.md#skill-sandbox).

> **`--shm-size 2g` es obligatorio para Playwright.** Docker asigna a un contenedor 64 MB de `/dev/shm` y Chromium bloquea su renderizador por debajo de ese límite. Los nodos Playwright basados en pasos ejecutan Chromium como subproceso dentro de este contenedor, por lo que el límite es el de este contenedor; el `playwrightCode` personalizado se ejecuta en un contenedor hermano que establece el suyo propio. `docker-compose.yml` ya declara `shm_size: "2gb"`, por lo que `run.sh` y `deploy.sh` no se ven afectados: solo un `docker run` simple necesita el flag.

> **Playwright Run Code.** El código Python personalizado de Playwright requiere `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true` y el montaje del socket de Docker indicado arriba. La imagen de release establece `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` / `HEYM_PLAYWRIGHT_SANDBOX_PYTHON` para el layout de GHCR (`/app/backend/.venv`). El `./deploy.sh` de Compose usa por defecto la imagen sandbox `heym-backend:local`. Mantenga `--no-sandbox` en los argumentos de lanzamiento de Chromium dentro de los contenedores sandbox.

**Variables de entorno mínimas para ejecuciones directas de la imagen:**

| Variable | Requerida | Propósito |
|----------|----------|---------|
| `DATABASE_URL` | Opcional | Sobrescritura completa de la cadena de conexión a PostgreSQL |
| `POSTGRES_HOST` | Sí, si `DATABASE_URL` está vacía | Host de PostgreSQL |
| `POSTGRES_PORT` | Sí, si `DATABASE_URL` está vacía | Puerto de PostgreSQL |
| `POSTGRES_USER` | Sí, si `DATABASE_URL` está vacía | Nombre de usuario de PostgreSQL |
| `POSTGRES_PASSWORD` | Sí, si `DATABASE_URL` está vacía | Contraseña de PostgreSQL |
| `POSTGRES_DB` | Sí, si `DATABASE_URL` está vacía | Nombre de la base de datos PostgreSQL |
| `SECRET_KEY` | Sí | Secreto de firma de JWT |
| `ENCRYPTION_KEY` | Sí | Clave de cifrado de Credenciales |
| `FRONTEND_URL` | Recomendada | URL pública del navegador, especialmente para callbacks de OAuth |
| `CORS_ORIGINS` | Recomendada | Orígenes de navegador permitidos |
| `FILE_STORAGE_DIR` | Recomendada | Establézcala en una ruta absoluta `/app/data/files` cuando monte esa ruta; el valor relativo por defecto `./data/files` se resuelve bajo `/app/backend` en esta imagen y no encuentra el montaje |
| `ALLOW_REGISTER` | Recomendada | Establezca `false` en producción salvo que se pretenda un registro abierto, pero solo una vez que exista su cuenta de administrador: no hay bootstrap del primer usuario |
| `DOCKER_LOGS_ENABLED` | Opcional | Establezca `true` para permitir que la pestaña Logs use el acceso al socket de Docker |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Requerida cuando `DOCKER_LOGS_ENABLED=true` | Lista separada por comas de correos de usuarios de confianza autorizados a acceder a los logs de Docker |
| `HEYM_PLUGINS_ENABLED` | Opcional | Establezca `true` para habilitar el subsistema de plugins (nodos personalizados instalados como zip). Desactivado por defecto |
| `HEYM_PLUGIN_ADMIN_EMAILS` | Requerida cuando `HEYM_PLUGINS_ENABLED=true` | Correos de operadores separados por comas autorizados a instalar/desinstalar plugins |
| `HEYM_PLUGINS_DIR` | Opcional | Ubicación donde se almacenan los archivos de plugins. Establézcala en una ruta absoluta `/app/data/plugins` cuando monte esa ruta; el valor relativo por defecto `data/plugins` se resuelve bajo `/app/backend` en esta imagen y no encuentra el montaje |
| `HEYM_PYTHON_TOOL_SANDBOX` | Opcional | Modo de aislamiento de la herramienta Python; por defecto `auto` (sandbox Docker reforzado, fail closed). Consulte [Seguridad](../reference/security.md#python-tool-sandbox) |
| `HEYM_PYTHON_TOOL_IMAGE` | Opcional | Sobrescribe la imagen sandbox de la herramienta Python; vacío = autodetección de la imagen del backend |
| `HEYM_CODEX_DOCKER_WORKSPACE_VOLUME` | Opcional | Volumen de Docker usado por los contenedores hermanos del runner de Codex; por defecto `heym-codex-workspaces` en despliegues Docker |
| `HEYM_CODEX_NETWORK_ACCESS` | Opcional | Permite que los comandos en sandbox de Codex descarguen archivos/dependencias; los despliegues Docker lo habilitan por defecto |
| `HEYM_OPENCODE_DOCKER_WORKSPACE_VOLUME` | Opcional | Volumen de Docker usado por los contenedores hermanos del runner de OpenCode; por defecto `heym-opencode-workspaces` en despliegues Docker |

**Notas:**

- La imagen expone el puerto `4017`
- El backend permanece interno y se proxifica bajo `/api`
- Cuando `POSTGRES_HOST=localhost`, la imagen de release lo reescribe automáticamente a `host.docker.internal` cuando es necesario, de modo que el mismo `.env` funciona con un contenedor PostgreSQL a nivel de host en herramientas Docker/Desktop de macOS
- Mantenga el montaje `data/files` si desea que las cargas de Drive y los archivos generados por skills sobrevivan a los reinicios del contenedor
- **Plugins:** para habilitarlos, establezca `HEYM_PLUGINS_ENABLED=true` y `HEYM_PLUGIN_ADMIN_EMAILS`, y monte `data/plugins` para que los archivos de plugins instalados persistan entre recreaciones del contenedor. Los metadatos de los plugins residen en su PostgreSQL, por lo que también persisten. Las `dependencies` de pip declaradas por un plugin se instalan en el contenedor en el momento de la instalación; dado que el sistema de archivos de la imagen es efímero, se **reinstalan automáticamente al arrancar** para cada plugin instalado (el venv `uv` de la imagen de release es escribible, por lo que esto también funciona en la imagen de contenedor único)

### Migrar una base de datos existente a un volumen con nombre

`./deploy.sh --migrate-pgdata` solo conoce el stack de Compose. Si ejecuta la imagen de release contra su propio contenedor PostgreSQL y ese contenedor monta un directorio del host mediante bind-mount, migre usted mismo.

Compruebe primero qué usa su contenedor de base de datos:

```bash
docker inspect <your-postgres-container> | grep -A8 Mounts
```

Si `"Type"` indica `bind`, muévalo a un volumen con nombre:

```bash
# 1. Stop the database. Heym can stay down for this.
docker stop <your-postgres-container>
docker rm <your-postgres-container>

# 2. Copy the data directory into a named volume. Give each instance its own

#    nombre del volumen si este host Docker ejecuta más de un despliegue de Heym.
docker volume create heym-postgres-data
docker run --rm \
  -v "/path/to/your/data/postgres:/legacy:ro" \
  -v heym-postgres-data:/pgdata \
  --entrypoint sh <your-postgres-image> -c 'cp -a /legacy/. /pgdata/'

# 3. Start PostgreSQL again on the volume, reusing the flags you had before
#    but replacing the bind mount.
docker run -d --name <your-postgres-container> --restart always \
  ... your original -e / -p / --network flags ... \
  -v heym-postgres-data:/var/lib/postgresql/data \
  <your-postgres-image>

# 4. Once it accepts connections, rebuild indexes.
docker exec <your-postgres-container> reindexdb -U <user> -d <database>
```

**Utilice su propia imagen en los pasos 2 y 3, no `postgres:16`.** Si su base de datos ejecuta `pgvector/pgvector:pg16` u otra variante, iniciar el clúster copiado con la imagen estándar puede fallar porque faltan las librerías de extensión que espera.

El directorio de datos original no se modifica con este procedimiento, por lo que sigue siendo su vía de reversión. Elimínelo solo después de confirmar que la base de datos migrada da servicio a sus workflows. El paso 4 es importante por la misma razón que en la migración con Compose: la copia arrastra cualquier daño de índices existente.

---

## Ejecutar más de una instancia

Todo lo anterior despliega una única instancia de Heym. Cuando una sola máquina ya no es suficiente, apunte una segunda instancia a la misma base de datos PostgreSQL y se unirá como worker: las ejecuciones en segundo plano — cron, webhooks, llamadas a herramientas MCP, triggers de chat — se reparten entonces entre las instancias según un porcentaje que usted define en **Settings → Instances**.

Las instancias nunca se comunican entre sí. Postgres transporta el trabajo, por lo que un worker no necesita ningún puerto abierto ni una ruta de vuelta a la instancia principal, y no interviene ningún broker de mensajes. El trabajo que toca el disco local — archivos de Drive, espacios de trabajo de agentes de código, plugins instalados — siempre se ejecuta en la instancia principal, de modo que nada tiene que compartirse a través de un sistema de archivos.

Dos reglas que el clúster no puede aplicar por usted: cada instancia debe usar el mismo `SECRET_KEY` y `ENCRYPTION_KEY`, y el ingress debe apuntar únicamente a la instancia principal. Ambas se explican, junto con las reglas de ubicación y cómo elegir los porcentajes, en [Load Distribution](../reference/cluster.md).

> Esto es distribución de carga, no alta disponibilidad. La instancia principal sigue siendo un punto único de fallo para el ingress, el almacenamiento de archivos y el editor.

## Workflows habituales

**Configuración inicial:**

```bash
./run.sh          # development — creates .env from .env.example and generates SECRET_KEY/ENCRYPTION_KEY automatically
# or
./deploy.sh       # production — same automatic .env and key generation
```

Para la imagen precompilada de `docker run`, genere las claves manualmente primero (consulte la sección **Prebuilt Image** más arriba).

**Actualizar producción tras un cambio de código:**

```bash
git pull
./deploy.sh       # rebuilds images, zero-downtime swap
```

**Consultar los logs de producción:**

```bash
./deploy.sh --logs
```

**Detener los servicios de producción:**

```bash
./deploy.sh --down
```

---

## Relacionado

- [Introduction](./introduction.md) – Descripción general de la plataforma
- [Quick Start](./quick-start.md) – Cree su primer workflow
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Referencia completa de configuración
- [Security](../reference/security.md) – Ajustes de JWT, cifrado y CORS
- [Load Distribution](../reference/cluster.md) – Ejecutar varias instancias contra una sola base de datos
