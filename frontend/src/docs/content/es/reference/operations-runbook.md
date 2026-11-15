# Heym Runbook (L1)

Siga estos procedimientos para diagnosticar y recuperar los servicios de Heym, las conexiones de PostgreSQL, las colas de workflows, la capacidad del cluster y la ejecución en sandbox.

Comience con [Heym Incident Playbook (L0)](./incident-playbook.md) para gravedad, contactos e inventario de despliegue.

Última revisión: 2026-11-10. Los comandos coinciden con el repositorio en el momento de la revisión. Confirme la versión y la topología desplegadas antes de su uso. Todos los comandos de cambio de servicio que figuran a continuación son instrucciones para un operador, no una corrección automática.

## Índice de procedimientos

| Incidente |
| --- |
| [UI o API no disponible](#ui-o-api-no-disponible) |
| [PostgreSQL no disponible o no escribible](#postgresql-no-disponible-o-no-escribible) |
| [Conexiones de BD activas, saturación del pool y bloqueos](#conexiones-de-bd-activas-saturación-del-pool-y-bloqueos) |
| [Reinicio controlado del servicio](#reinicio-controlado-del-servicio) |
| [Workflows que más recursos consumen](#workflows-que-más-recursos-consumen) |
| [Acumulación en la cola o ejecuciones aparentemente atascadas](#acumulación-en-la-cola-o-ejecuciones-aparentemente-atascadas) |
| [Comprobaciones del modo cluster](#comprobaciones-del-modo-cluster) |
| [Instancia main no disponible mientras los workers están activos](#instancia-main-no-disponible-mientras-los-workers-están-activos) |
| [Fallos de webhook, MCP, Portal o streaming](#fallos-de-webhook-mcp-portal-o-streaming) |
| [Problemas de contenedor, pod, OOM o almacenamiento](#problemas-de-contenedor-pod-oom-o-almacenamiento) |
| [Despliegue defectuoso o regresión de configuración](#despliegue-defectuoso-o-regresión-de-configuración) |
| [Fallo de modelo, credencial o integración](#fallo-de-modelo-credencial-o-integración) |
| [Fallo de sandbox](#fallo-de-sandbox) |
| [Recuperación ante desastres y respuesta a emergencias](#recuperación-ante-desastres-y-respuesta-a-emergencias) |

## Configuración de comandos

Trabaje desde el checkout desplegado o las herramientas de despliegue. Seleccione solo la topología que realmente se esté ejecutando en el entorno afectado. No utilice un proyecto de ejemplo para abordar un incidente de producción.

### Docker Compose

Defina este asistente shell para la instalación estándar de Compose:
```bash
heym_compose() { docker compose -f docker-compose.yml "$@"; }
HEYM_MAIN_SERVICE=backend
HEYM_FRONTEND_SERVICE=frontend
```

Para el ejemplo de cluster del repositorio, utilice esta definición en su lugar:
```bash
heym_compose() { docker compose -f docker-compose.cluster.yml "$@"; }
HEYM_MAIN_SERVICE=main
HEYM_WORKER_SERVICE=worker-a
```

Para un worker independiente en su propio host, utilice `docker compose -f docker-compose.worker.yml` y el servicio `worker`. No tiene servicio local de PostgreSQL ni de frontend. Incluya el nombre de proyecto real del despliegue, archivos de anulación y archivo de entorno en el asistente si se utilizan.
```bash
heym_compose ps
heym_compose images
heym_compose logs --since 15m --tail 200 "$HEYM_MAIN_SERVICE"
docker stats --no-stream
```

El stack estándar de Compose publica por defecto el frontend en el puerto host `4017` y PostgreSQL en el `6543`. Su puerto backend `10105` es interno. El ejemplo de cluster publica la API de main en el `10105`, la API de worker-a en el `10111` y PostgreSQL en el `6544`. Una imagen de release combina frontend y backend en un único contenedor. Verifique las asignaciones de puertos con `ps`.

Para una verificación directa del proceso backend dentro de un contenedor main de Compose:
```bash
heym_compose exec -T "$HEYM_MAIN_SERVICE" uv run python -c \
  'import urllib.request; print(urllib.request.urlopen("http://127.0.0.1:10105/api/health", timeout=5).read().decode())'
```

### Kubernetes

Establezca el contexto, namespace y nombres de cargas de trabajo reales. Estos nombres de despliegue coinciden únicamente con los ejemplos del repositorio.
```bash
HEYM_KUBE_CONTEXT='<actual-context>'
HEYM_NAMESPACE=heym
HEYM_MAIN_DEPLOYMENT=heym
HEYM_WORKER_DEPLOYMENT=heym-worker
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" get deployments,pods,svc,pvc
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" get events --sort-by=.lastTimestamp
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" logs \
  "deployment/$HEYM_MAIN_DEPLOYMENT" --all-containers=true --since=15m --tail=200
```

El despliegue base consta de una única réplica de main con estrategia `Recreate`, almacenamiento persistente y una sonda de disponibilidad en `/api/health`. Su puerto de contenedor público es `4017`; un worker exclusivo de backend utiliza `10105`. No asuma que un reinicio o despliegue no conlleve tiempo de inactividad. Consulte [Comportamiento del despliegue en Kubernetes](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#recreate-deployment).

### Acceso a la API y estado
```bash
HEYM_PUBLIC_URL='https://your-heym-host.example'
curl --fail --silent --show-error --connect-timeout 3 --max-time 10 \
  "$HEYM_PUBLIC_URL/api/health"
curl --silent --show-error --output /dev/null --write-out '%{http_code}\n' \
  --connect-timeout 3 --max-time 10 "$HEYM_PUBLIC_URL/"
```

`/api/health` devuelve `status`, `service` y `version`; no realiza comprobaciones de dependencias. Confirme la base de datos y un workflow de extremo a extremo aprobado por separado.

Los ejemplos autenticados a continuación utilizan un archivo de configuración curl aprovisionado fuera de este repositorio en `$HEYM_CURL_CONFIG`, que contiene el encabezado `Authorization` del operador. Restrinja sus permisos al operador, manténgalo fuera del control de versiones y elimine las copias temporales tras su uso. No pegue tokens en comandos, URLs, registros o notas de incidentes. Utilice una sesión de interfaz de usuario autenticada existente siempre que esté disponible. Inspeccione los códigos de estado y el esquema OpenAPI desplegado en el backend `/docs` antes de reintentar una mutación fallida.

### Acceso SQL y límites de consulta

Para la base de datos incluida en Compose, abra una sesión con la identidad configurada del contenedor de base de datos:
```bash
heym_compose exec postgres sh -c \
  'exec psql -X -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

Para una base de datos externa, utilice una definición de servicio `psql` y un archivo de contraseñas aprobados o la consola del proveedor de base de datos. Una conexión libpq utiliza `postgresql://`, no `postgresql+asyncpg://` de SQLAlchemy. Realice pruebas tanto desde la ruta de red de la aplicación afectada como desde la ruta del DBA.

Ejecute SQL de diagnóstico con un rol de solo lectura siempre que sea posible. Al inicio de cada sesión de diagnóstico:
```sql
SET default_transaction_read_only = on;
SET statement_timeout = '5s';
SET lock_timeout = '1s';
SELECT now() AS observed_at, current_database(), pg_is_in_recovery();
```

Utilice el nodo primario de escritura previsto para las comprobaciones de aplicaciones. Una réplica puede responder a `SELECT 1` mientras la ruta de escritura no esté disponible. El detalle de `pg_stat_activity` puede requerir privilegios de monitorización de base de datos; las filas ocultas o los campos NULL no son prueba de inactividad. Las consultas de diagnóstico a continuación omiten payloads, secretos y texto SQL. No actualizan tablas de Heym. Consulte [Actividad y visibilidad en PostgreSQL](https://www.postgresql.org/docs/16/monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW).

## Verificación compartida

Tras cada mitigación, compruebe el acceso público, la capacidad de respuesta de la base de datos, un workflow smoke aprobado y las métricas pertinentes de capacidad/backlog. Utilice un trigger seguro en modo de producción al verificar el despacho del cluster: las ejecuciones de prueba del editor permanecen en la instancia receptora. Supervise al menos durante 10 minutos, además de la próxima programación crítica esperada o una comprobación equivalente acordada. Registre los cambios y asigne un responsable/horario para revertir las restricciones temporales.

## UI o API no disponible

**Gravedad:** P1 para indisponibilidad generalizada de producción; P2 para degradación parcial.

**Diagnosticar**

1. Compare la interfaz de usuario pública, el `/api/health` público y la comprobación directa del backend main desde [Configuración de comandos](#configuración-de-comandos).
2. Inspeccione el estado del contenedor o pod main/frontend, errores recientes y CPU/memoria/disco. Que una interfaz de usuario estática cargue no demuestra que la API funcione.
3. Ejecute la [comprobación de base de datos](#postgresql-no-disponible-o-no-escribible). Inspeccione la última versión y cambios de ingress/proxy.
4. Si solo fallan las solicitudes autenticadas, distinga sesiones/SSO caducados de un fallo general de la API. No restablezca claves compartidas para probar el inicio de sesión.

**Mitigar**

1. Repare primero las dependencias de base de datos o almacenamiento cuando expliquen el fallo.
2. Si el backend directo funciona, restaure la ruta frontend/proxy/ingress. El ingress debe apuntar a main en modo cluster.
3. Si main está bloqueado y las dependencias están sanas, siga [Reinicio controlado del servicio](#reinicio-controlado-del-servicio). Restaure únicamente el servicio frontend afectado cuando sea el componente fallido.
4. Para una regresión de versión, siga [Despliegue defectuoso](#despliegue-defectuoso-o-regresión-de-configuración).

**Verificar:** La interfaz de usuario pública carga, el acceso a la API autenticada tiene éxito y un workflow smoke finaliza. Un endpoint de proceso en verde por sí solo es insuficiente.

**Escalar:** Guardia de plataforma para fallos de backend; responsable de redes/ingress cuando solo falla la ruta pública; responsable de base de datos o almacenamiento cuando fallan las comprobaciones de dependencias.

## PostgreSQL no disponible o no escribible

**Gravedad:** P1 cuando fallan las conexiones o escrituras de producción; P2 para degradación intermitente.

**Diagnosticar**

Para PostgreSQL integrado:
```bash
heym_compose ps postgres
heym_compose logs --since 15m --tail 150 postgres
heym_compose exec -T postgres sh -c \
  'pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

1. `pg_isready` comprueba si el servidor acepta conexiones. Confirme el acceso SQL autenticado y el estado primario mediante el [acceso SQL](#configuración-de-comandos).
2. Desde la instancia afectada, compruebe DNS, enrutamiento, endpoint/puerto de base de datos, TLS y directivas de red. Una conexión de DBA local no garantiza la accesibilidad desde la aplicación.
3. Lea el error saneado: conexión rechazada/tiempo de espera agotado, fallo de autenticación, agotamiento de conexiones, transacción de solo lectura, almacenamiento agotado o fallo de migración.
4. Compruebe disco/inodos del host de base de datos, registros de la base, estado de conmutación por error/replicación y eventos de mantenimiento. Utilice [Conexiones y bloqueos](#conexiones-de-bd-activas-saturación-del-pool-y-bloqueos) en caso de saturación.

**Mitigar**

1. Reduzca la ingesta de productores y las tormentas de reintentos. Pause los triggers automáticos infractores a través de Heym si su API funciona; de lo contrario, coordine la reducción del tráfico entrante. Evite reejecuciones masivas.
2. Para una base de datos integrada detenida con almacenamiento intacto verificado y sin operación activa de conmutación por error o recuperación, inicie únicamente el servicio existente:
```bash
   heym_compose start postgres
   ```

3. Para PostgreSQL gestionado, fallos de red, disco lleno, corrupción o conmutación por error, utilice el procedimiento de recuperación del administrador de base de datos. Conserve el volumen de base de datos y el material de claves existente.
4. Una vez accesible el nodo primario de escritura, permita que los pools/listeners se reconecten. Reinicie una instancia de aplicación únicamente si sigue fallando tras sanear la ruta a la BD.
5. Nunca inicialice una base de datos vacía de reemplazo ante un incidente, no elimine archivos WAL ni ejecute `docker compose down -v`. La restauración sigue [Recuperación ante desastres](#recuperación-ante-desastres-y-respuesta-a-emergencias).

**Verificar:** El SQL por la ruta de aplicación funciona contra el primario previsto, las escrituras normales de la aplicación tienen éxito a través del workflow smoke, los errores de conexión se detienen, los heartbeats se reanudan y la antigüedad de la cola disminuye.

**Escalar:** Guardia de base de datos de inmediato para P1, problemas de primario/conmutación por error, corrupción de datos o almacenamiento agotado. Envíe la identidad del endpoint, marcas de tiempo, clase de estado/error y pruebas de almacenamiento/conexión sin credenciales.

## Conexiones de BD activas, saturación del pool y bloqueos

**Gravedad:** P1 si ningún trabajo útil puede conectarse; P2 si la presión o el bloqueo están degradando la ejecución.

**Diagnosticar**

Ejecute esto en el servidor PostgreSQL afectado. El total es a nivel de servidor porque otras bases de datos consumen el mismo límite de conexiones. `active` está ejecutando una consulta; `idle` está conectado sin consulta actual. Ambos consumen un slot. PostgreSQL reserva algunos slots, por lo que los clientes ordinarios pueden ser rechazados antes de que el total alcance `max_connections`.
```sql
SELECT current_setting('max_connections')::int AS max_connections,
       current_setting('superuser_reserved_connections')::int AS superuser_reserved,
       current_setting('reserved_connections', true) AS reserved_connections,
       count(*) FILTER (WHERE backend_type = 'client backend') AS client_connections,
       count(*) FILTER (WHERE backend_type = 'client backend'
                         AND state = 'active') AS active_connections,
       count(*) FILTER (WHERE backend_type = 'client backend'
                         AND state LIKE 'idle in transaction%') AS idle_in_transaction
FROM pg_stat_activity;

SELECT datname, application_name, usename, client_addr, state,
       wait_event_type, wait_event, count(*) AS connections
FROM pg_stat_activity
WHERE backend_type = 'client backend'
GROUP BY datname, application_name, usename, client_addr, state,
         wait_event_type, wait_event
ORDER BY connections DESC
LIMIT 50;
```

Heym etiqueta las conexiones de pool y listener como `heym-<instance-id>`. Compare el grupo de conexiones con los heartbeats de las instancias y el recuento de procesos. Un pool inactivo es normal. Una población creciente de `idle in transaction` requiere investigación.
```sql
SELECT pid, application_name, state,
       now() - xact_start AS transaction_age,
       CASE WHEN state = 'active' THEN now() - query_start END AS active_query_age,
       wait_event_type, wait_event, pg_blocking_pids(pid) AS blocking_pids
FROM pg_stat_activity
WHERE datname = current_database()
  AND backend_type = 'client backend'
  AND pid <> pg_backend_pid()
  AND (state = 'active' OR state LIKE 'idle in transaction%')
ORDER BY xact_start ASC NULLS LAST
LIMIT 30;
```

Distinga el agotamiento del servidor (`too many clients`) de un tiempo de espera agotado del pool local de SQLAlchemy. Un pool local puede saturarse porque las solicitudes retienen conexiones o esperan bloqueos incluso cuando el servidor tiene slots libres.

Presupueste el pico configurado, incluyendo el overflow y cada proceso uvicorn:
```text
sum over instances:
  process_count * (async_pool_size + async_max_overflow
                   + sync_pool_size + sync_max_overflow + 4 listeners)
then add other clients, monitoring, and operational headroom
```

Los valores por defecto por proceso son `HEYM_DB_POOL_SIZE=10`, `HEYM_DB_MAX_OVERFLOW=20`, `HEYM_DB_SYNC_POOL_SIZE=5` y `HEYM_DB_SYNC_MAX_OVERFLOW=10`. El punto de entrada estándar del backend inicia 8 procesos: su pico teórico es `8 * (10 + 20 + 5 + 10 + 4) = 392`, antes de otros clientes. Los pools crecen bajo demanda; esto es un techo, no el recuento abierto esperado. La sesión dedicada del líder se retiene del pool asíncrono. Existen cuatro conexiones de listener por proceso incluso en una instalación de instancia única; los streams de chat comparten un listener.

Lea la configuración real desde el manifiesto desplegado. Los archivos de ejemplo anulan algunos valores por defecto y recuentos de procesos. Agregar workers también agrega pools y listeners; puede empeorar la presión sobre la base de datos.

**Mitigar**

1. Regule las cargas de trabajo/productores identificados. Conserve una ruta de acceso de DBA y margen operativo.
2. Pida al propietario de la base de datos que inspeccione bloqueadores/transacciones largas individuales. No elimine masivamente sesiones de Heym: los listeners y la sesión de bloqueo asesor del líder son rutas de coordinación esenciales. La cancelación de consultas y la terminación de sesiones tienen efectos distintos; el DBA debe dirigirse a un causante confirmado. Consulte [Señales del servidor PostgreSQL](https://www.postgresql.org/docs/16/functions-admin.html#FUNCTIONS-ADMIN-SIGNAL).
3. Si la capacidad lo requiere, reduzca el tamaño del pool/overflow o el recuento de procesos a través de la configuración de despliegue, luego vacíe/recree las instancias una a una. Verifique la carga de API y la capacidad del ejecutor tras la reducción. Un cambio de pool requiere reemplazo de proceso; `restart` no aplica valores de entorno de Compose modificados.
4. `docker-compose.yml` no reenvía explícitamente las cuatro variables de pool. Agregue anulaciones de entorno aprobadas en la configuración de despliegue real en lugar de asumir que una entrada `.env` del host llega al contenedor. Los ejemplos de cluster y worker tienen sus propias asignaciones.
5. Coordine cualquier aumento de `max_connections` con el propietario de la base de datos y el presupuesto de memoria. Evite reconexiones simultáneas en toda la flota.

**Verificar:** Las conexiones de clientes totales se estabilizan con margen, los errores de pool cesan, los bloqueos desaparecen, los errores de listener/heartbeat se detienen y el workflow smoke tiene éxito.

**Escalar:** Propietario de base de datos para intervención en bloqueadores o cambios en el techo de conexiones; propietario de plataforma para fugas de conexiones, inanición de pool o tormentas de reconexión repetidas.

## Reinicio controlado del servicio

**Gravedad:** Hereda la gravedad del incidente. Reiniciar main interrumpe el servicio público en la topología documentada.

**Antes de reiniciar**

1. Confirme la instancia/servicio objetivo y capture registros, el digest de la imagen, el motivo del reinicio y los IDs de ejecuciones activas/en cola. Confirme que PostgreSQL y el almacenamiento estén sanos.
2. Reduzca nueva ingesta. Para un worker, desactive **On** en **Configuración > Instancias** en la interfaz de usuario o establezca su peso en 0. Vacíe los trabajos en curso antes de reiniciar.
3. Revise [Recuperación y cancelación de ejecuciones](#despliegue-defectuoso-o-regresión-de-configuración). Heym reanuda ejecuciones incompletas reejecutando workflows elegibles desde el principio.
4. No elimine volúmenes, no omita archivos de entorno ni ejecute un `docker compose down` sin parámetros.

**Reiniciar un servicio con configuración sin cambios**
```bash
# Compose main. Use the existing topology helper.
heym_compose restart -t 60 "$HEYM_MAIN_SERVICE"
heym_compose ps "$HEYM_MAIN_SERVICE"
heym_compose logs --since 5m --tail 150 "$HEYM_MAIN_SERVICE"
```

Para un worker vaciado del ejemplo de cluster, sustituya `$HEYM_WORKER_SERVICE`. El tiempo de espera de detención de 60 segundos permite que las ejecuciones en curso finalicen o alcancen un estado de pausa limpio antes de SIGKILL.

**Reinicio completo del stack Compose**

Prefiera reinicios de un solo servicio. Un reinicio del stack detiene todo el stack de Compose, incluido PostgreSQL.
```bash
# Kubernetes main. Recreate strategy can cause downtime.
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout restart \
  "deployment/$HEYM_MAIN_DEPLOYMENT"
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout status \
  "deployment/$HEYM_MAIN_DEPLOYMENT" --timeout=180s
```

Sustituya `$HEYM_WORKER_DEPLOYMENT` para un worker vaciado. Un Deployment con múltiples réplicas puede realizar un reinicio continuo. La estrategia `Recreate` en main finaliza el pod antiguo antes de programar el nuevo: espere un tiempo de inactividad equivalente al apagado, programación, montaje de volumen y arranque.

**Verificar:** Los endpoints de estado del proceso responden, las conexiones a PostgreSQL se restablecen, los heartbeats de los workers se reanudan en **Configuración > Instancias** y el workflow smoke finaliza.

**Escalar:** Guardia de plataforma si el inicio se cuelga o fallan las sondas; guardia de base de datos si el inicio entra en bucle en las migraciones.

## Workflows que más recursos consumen

**Gravedad:** P2 cuando la carga de workflows degrada los tiempos de respuesta; P1 si amenaza la disponibilidad de la base de datos, workers o servicio público.

**Diagnosticar**

Workflows recientes clasificados por duración total transcurrida registrada:
```sql
SELECT h.workflow_id, w.name, w.owner_id,
       count(*) AS recorded_runs,
       count(*) FILTER (WHERE h.status IN ('error', 'failed', 'timeout')) AS failed_runs,
       round((sum(h.execution_time_ms) / 1000.0)::numeric, 1) AS total_elapsed_seconds,
       round((max(h.execution_time_ms) / 1000.0)::numeric, 1) AS max_elapsed_seconds
FROM execution_history h
JOIN workflows w ON w.id = h.workflow_id
WHERE h.started_at >= now() - interval '1 hour'
GROUP BY h.workflow_id, w.name, w.owner_id
ORDER BY total_elapsed_seconds DESC
LIMIT 20;
```

Para identificar workflows de gran volumen, vuelva a ejecutar la misma consulta con `ORDER BY recorded_runs DESC`.

Workflows recientes clasificados por duración media con al menos 5 ejecuciones:
```sql
SELECT a.execution_id, a.workflow_id, w.name,
       a.executed_by_instance_id, a.trigger_source,
       now() - a.started_at AS run_age,
       now() - a.heartbeat_at AS heartbeat_age,
       a.running_node_ids, a.attempt, a.recoverable, a.cancel_requested_at
FROM active_workflow_executions a
JOIN workflows w ON w.id = a.workflow_id
ORDER BY a.started_at
LIMIT 50;

SELECT t.workflow_id, w.name, count(*) AS trace_records,
       sum(coalesce(t.total_tokens, 0)) AS tokens
FROM llm_traces t
LEFT JOIN workflows w ON w.id = t.workflow_id
WHERE t.created_at >= now() - interval '1 hour'
GROUP BY t.workflow_id, w.name
ORDER BY tokens DESC
LIMIT 20;
```

Los IDs de workflow NULL pueden representar actividad de chat o de asistente. No se generan registros de trace para ejecuciones de prueba no persistidas en el editor de canvas.

Correlacione el tiempo de base de datos con la ejecución a nivel de nodos. Visualice los cuellos de botella de nodos en la [pestaña Traces](../tabs/traces-tab.md). Correlacione la ejecución de workflows con picos de CPU, memoria y conexiones de base de datos del host/pod.

**Mitigar**

1. Para una tormenta de productores externos, limite el consumidor webhook o API en el ingress o gateway de API antes de alterar definiciones de workflows.
2. Un administrador de instancia que pueda acceder al workflow puede pausar sus triggers automáticos a través del endpoint soportado:
```bash
   HEYM_WORKFLOW_ID='<workflow-uuid>'
   curl --config "$HEYM_CURL_CONFIG" --fail --silent --show-error \
     --output /dev/null --connect-timeout 3 --max-time 30 --request POST \
     "$HEYM_PUBLIC_URL/api/workflows/$HEYM_WORKFLOW_ID/pause-triggers"
   ```

   Pausar triggers automáticos no detiene trabajos que ya estén en ejecución o en cola. Detiene futuras invocaciones por programación, webhook y sondeo.

3. Para una instalación en cluster, configure la capacidad de workers en **Configuración > Instancias** o desvíe tráfico ajustando los pesos de los workers.
4. Si una ejecución activa identificada debe detenerse, solicite la cancelación utilizando su ID exacto de ejecución:
```bash
   HEYM_EXECUTION_ID='<execution-uuid>'
   curl --config "$HEYM_CURL_CONFIG" --fail --silent --show-error \
     --connect-timeout 3 --max-time 30 --request POST \
     "$HEYM_PUBLIC_URL/api/workflows/$HEYM_WORKFLOW_ID/executions/$HEYM_EXECUTION_ID/cancel"
   ```

   Confirme el estado final en el historial y la eliminación del registro. `cancel_requested` es asíncrono: los nodos cooperativos se detienen en los límites de paso, mientras que las llamadas HTTP o LLM prolongadas terminan su solicitud actual antes de finalizar.

**Verificar:** La frecuencia de ejecución desciende, la CPU y la memoria de workers vuelven a la línea base, el recuento de conexiones de base de datos se estabiliza y los workflows de prioridad normal se reanudan según lo programado.

**Escalar:** Propietario del workflow para inspeccionar la lógica o reducir la frecuencia de programación; guardia de plataforma si la cancelación no logra terminar la ejecución.

## Acumulación en la cola o ejecuciones aparentemente atascadas

**Gravedad:** P2 cuando la latencia de la cola supera los umbrales de negocio; P1 cuando el crecimiento de la cola amenaza los límites de almacenamiento o conexiones de base de datos.

**Diagnosticar**

Tome una instantánea de las filas pendientes de la cola. El filtro de estado incluye trabajos incompletos más antiguos, no solo llegadas recientes.
```sql
SELECT status, placement, target_instance_id, count(*) AS runs,
       min(enqueued_at) AS oldest_enqueued_at,
       max(now() - enqueued_at) AS oldest_age
FROM workflow_run_queue
WHERE status IN ('held', 'queued', 'waiting_for_main', 'claimed')
GROUP BY status, placement, target_instance_id
ORDER BY oldest_enqueued_at;

SELECT q.execution_id, q.workflow_id, w.name, q.status, q.placement,
       q.target_instance_id, q.enqueued_at, q.not_after, q.expires_at,
       q.claimed_at, a.heartbeat_at, a.cancel_requested_at
FROM workflow_run_queue q
JOIN workflows w ON w.id = q.workflow_id
LEFT JOIN active_workflow_executions a ON a.execution_id = q.execution_id
WHERE q.status IN ('held', 'queued', 'waiting_for_main', 'claimed')
ORDER BY q.enqueued_at
LIMIT 50;
```

| Estado | Interpretación | Acción |
| --- | --- | --- |
| `held` | Esperando el slot de concurrencia de producción del workflow | Inspeccione el límite de concurrencia de ese workflow en su configuración |
| `pending` | Esperando asignación de worker | Compruebe la elegibilidad y recuento de instancias activas abajo |
| `running` | Asignado a un worker, ejecución activa | Compruebe el heartbeat del worker y la salud de los hilos |
| `waiting_hitl` | Pausado para aprobación humana | Estado esperado; confirme con el propietario del workflow |
| `cancel_requested` | Cancelación reconocida, esperando límite de paso | Monitoree la terminación; escale si se bloquea |

Compruebe si hay ejecuciones obsoletas o huérfanas cuyo worker asignado dejó de emitir heartbeats:

1. En instalaciones de instancia única, confirme que el servicio main dispone de capacidad de concurrencia restante.
2. Abra **Configuración > Instancias** como administrador de instancia, o solicite:
```bash
   curl --config "$HEYM_CURL_CONFIG" --fail --silent --show-error \
     --connect-timeout 3 --max-time 10 "$HEYM_PUBLIC_URL/api/admin/cluster"
   ```

3. Compruebe `cluster_enabled`, `live`, `compatible`, `enabled`, `weight`, `credentials_synced`, antigüedad del heartbeat, latencia de BD y disponibilidad de sandbox (`docker_ok`). Una instancia necesita tanto elegibilidad como liveness para recibir trabajo distribuido. El nombre histórico `docker_ok` también cubre la accesibilidad de la sandbox en Kubernetes.
```sql
SELECT id, name, role, enabled, weight, weight_configured,
       version, schema_revision, docker_ok, db_latency_ms,
       now() - heartbeat_at AS heartbeat_age,
       now() - credentials_synced_at AS credential_sync_age
FROM cluster_instances
ORDER BY role, id;

SELECT executed_by_instance_id, status, count(*) AS recorded_runs
FROM execution_history
WHERE started_at >= now() - interval '1 hour'
GROUP BY executed_by_instance_id, status
ORDER BY executed_by_instance_id, status;
```

La vista de heartbeats SQL es una prueba, no un cálculo completo de compatibilidad. Utilice la API administrativa para la lógica de compatibilidad y rotación de claves. Los heartbeats se ejecutan cada 10 segundos; una antigüedad superior a 30 segundos indica particionamiento de red o procesos worker bloqueados.

**Mitigar**

1. Si los workers están sanos pero saturados, escale las réplicas de workers o agregue instancias siguiendo [Escalado de cluster](#comprobaciones-del-modo-cluster).
2. Para una ejecución huérfana en un worker inactivo, active la recuperación o cancele la ejecución utilizando [Recuperación de ejecución](#reinicio-controlado-del-servicio).
3. Si hay ejecuciones pendientes esperando en un worker deshabilitado o incompatible, vuelva a habilitar el worker o actualice sus credenciales en **Configuración > Instancias**.
4. Si la cola está inundada de solicitudes duplicadas debido a una tormenta de reintentos externos, pause el trigger en el ingress o use [Pausar workflow](#workflows-que-más-recursos-consumen).

**Verificar:** La longitud de la cola tiende a la baja, las ejecuciones pendientes pasan a running dentro de la latencia esperada y los heartbeats muestran capacidad activa de workers.

**Escalar:** Guardia de plataforma para bloqueos en el despacho del scheduler; guardia de base de datos si las consultas a la cola presentan contención de bloqueos.

## Comprobaciones del modo cluster

**Gravedad:** P2 por worker desconectado o capacidad degradada; P1 si la coordinación del cluster falla por completo.

**Diagnosticar**

La vista de heartbeats SQL ofrece una visión general de todas las instancias.

Campos clave:

- `compatible`: Debe ser `true`. Un worker incompatible queda excluido de la asignación.
- `heartbeat_age_seconds`: Valores superiores a 30 segundos indican posibles particiones de red o procesos worker bloqueados.
- `weight`: Capacidad relativa del worker. Un peso de 0 deshabilita la asignación a esa instancia.
- `credentials_complete`: Debe ser `true` para workflows que requieran credenciales compartidas.

**Mitigar**

1. Para un worker desconectado, compruebe el estado del pod/contenedor y los registros en el host worker. Siga [Reinicio de servicio](#reinicio-controlado-del-servicio).
2. Para un worker incompatible, verifique las versiones de imagen en todas las instancias del cluster. Todas deben ejecutar la misma versión. Siga [Despliegue defectuoso](#despliegue-defectuoso-o-regresión-de-configuración).
3. Si faltan credenciales, actualice las credenciales compartidas desde la instancia main en **Configuración > Credenciales**.
4. Para vaciar limpiamente un worker por mantenimiento, establezca su peso en 0 o desactive **On** en **Configuración > Instancias**. Deje que finalice el trabajo en curso antes de detenerlo.

**Verificar:** El heartbeat del worker se reanuda en menos de 30 segundos, `compatible` es `true` y el workflow de prueba se asigna al worker recuperado.

**Escalar:** Guardia de plataforma para particiones de red entre instancias o contención de bloqueos en la base de datos compartida.

## Instancia main no disponible mientras los workers están activos

**Gravedad:** P1. Main coordina la programación, sirve la UI/API y gestiona el estado del cluster.

**Diagnosticar**

1. Confirme el estado del proceso main y el uso de recursos mediante [Configuración de comandos](#configuración-de-comandos).
2. Compruebe la conectividad con la base de datos desde el host main. Los workers pueden continuar procesando ejecuciones almacenadas localmente en caché mientras main esté inaccesible.
3. Compruebe el enrutamiento del reverse proxy / ingress hacia la instancia main.

**Mitigar**

1. Si main se detuvo por OOM o una excepción no controlada, reinícielo siguiendo [Reinicio controlado del servicio](#reinicio-controlado-del-servicio).
2. Si main espera un bloqueo de base de datos retenido por un worker caído, siga [Conexiones y bloqueos](#conexiones-de-bd-activas-saturación-del-pool-y-bloqueos).
3. En Kubernetes, verifique que la estrategia `Recreate` haya finalizado la terminación del pod antes de programar el reemplazo.

**Verificar:** La interfaz pública carga, el endpoint de salud de la API responde con HTTP 200, los heartbeats de los workers del cluster informan a main y el canvas del editor funciona correctamente.

**Escalar:** Incident Commander de inmediato; guardia de plataforma para fallos de almacenamiento o de nodo.

## Fallos de webhook, MCP, Portal o streaming

**Gravedad:** P2 para degradación específica de un endpoint; P1 si los webhooks públicos fallan silenciosamente en todos los workflows.

**Diagnosticar**

1. Para fallos de webhooks, compruebe el enrutamiento de ingress, la terminación SSL y la configuración del prefijo de ruta. Confirme que el endpoint de webhook exista y esté activo.
2. Para fallos de streaming SSE, compruebe la configuración de almacenamiento en búfer del proxy. Los proxies de ingress (nginx, traefik, envoy) deben deshabilitar el búfer de respuesta (`X-Accel-Buffering: no` o equivalente) para `/api/chat/stream` y el streaming de ejecución de workflows.
3. Para fallos de MCP, verifique la validez de la clave de API de MCP, la configuración de transporte (SSE vs stdio) y el registro de herramientas en **Configuración > MCP**.
4. Revise los registros de errores en main en busca de fallos de autorización, payloads JSON no válidos o rechazos de validación de esquema.

**Mitigar**

1. Deshabilite el búfer del proxy en las rutas de streaming en el nivel de ingress o reverse proxy.
2. En caso de rechazo de payloads de webhook, verifique la estructura JSON contra la especificación del trigger del workflow. Actualice al emisor externo si los payloads están mal formados.
3. Para caídas de conexión MCP, reinicie la sesión del cliente MCP afectado o vuelva a autenticarse con un token nuevo.

**Verificar:** El webhook de prueba responde con HTTP 200/202, el stream SSE entrega fragmentos incrementales sin detenerse y el cliente MCP lista las herramientas con éxito.

**Escalar:** Guardia de redes para incidencias de ingress/almacenamiento en búfer; autor del workflow para discrepancias en el esquema de payloads.

## Problemas de contenedor, pod, OOM o almacenamiento

**Gravedad:** P1 si main o la base de datos están afectados; P2 para reinicios aislados de workers.

**Diagnosticar**
```bash
# Compose container state and host filesystem pressure.
heym_compose ps
docker stats --no-stream
df -h
df -i
```

Compruebe el sistema de archivos real del volumen de datos y el host de base de datos además del host shell. Estado de solo lectura del contenedor sin valores de entorno:
```bash
HEYM_CONTAINER_ID='<affected-container-id>'
docker inspect --format \
  '{{.Name}} status={{.State.Status}} oom={{.State.OOMKilled}} exit={{.State.ExitCode}} restarts={{.RestartCount}}' \
  "$HEYM_CONTAINER_ID"
```

```bash
HEYM_POD='<affected-pod>'
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" describe pod "$HEYM_POD"
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" logs "$HEYM_POD" \
  --all-containers=true --previous --tail=150
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" top pods --containers
```

Inspeccione OOMKilled frente a sondas fallidas, descarga de imagen, programación Pending, presión de nodo y errores de montaje/fijación de volumen. Los registros anteriores solo existen cuando el pod se reinició sin volver a programarse.

## Despliegue defectuoso o regresión de configuración

**Gravedad:** P1 si fallan las conexiones de producción, procesamiento de trabajos o migraciones; P2 para regresiones de funciones aisladas.

**Diagnosticar:** Compare el momento de inicio del error con el despliegue, digests reales de imagen, revisión de configuración/secretos, estado de migraciones y el último cambio confirmado. Inspeccione el historial de despliegue y diffs saneados. Nunca pegue variables de entorno completas, secretos renderizados por Compose o datos de Secret de Kubernetes en un informe de incidente.
```sql
SELECT version_num FROM alembic_version;
```

```bash
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout history \
  "deployment/$HEYM_MAIN_DEPLOYMENT"
```

**Mitigar**

1. Detenga el despliegue y aísle el tráfico externo si los errores amenazan la integridad de los datos o afectan a dependencias.
2. Verifique el último digest de imagen, commit Git y revisión de Helm/manifiesto reconocidos como funcionales. Inspeccione diffs recientes de ConfigMap, Secret y entorno.
3. Si el esquema es compatible, restaure la imagen/configuración aprobada utilizando las herramientas de despliegue. Revierta a una revisión comprobada específica, no a una supuesta anterior:
```bash
   HEYM_ROLLBACK_REVISION='<approved-revision-number>'
   kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout undo \
     "deployment/$HEYM_MAIN_DEPLOYMENT" --to-revision="$HEYM_ROLLBACK_REVISION"
   kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout status \
     "deployment/$HEYM_MAIN_DEPLOYMENT" --timeout=180s
   ```

4. La reversión de un Deployment restaura la plantilla del pod; no restaura valores externos de Secret o ConfigMap si fueron sobrescritos. Revierta los cambios de configuración en paralelo.
5. Nunca degrade una imagen de release sobre una migración de esquema de base de datos incompatible. Si una migración realizó cambios irreversibles en tablas o columnas, corrija hacia adelante con un parche probado o restaure la base de datos mediante [Recuperación ante desastres](#recuperación-ante-desastres-y-respuesta-a-emergencias).
6. Tras la reversión, reinicie los workers dependientes para asegurar que toda la flota ejecute la misma versión de release.

**Verificar:** Las comprobaciones de salud responden con 200, los workers informan la misma versión en **Configuración > Instancias**, la versión de migración de esquema coincide con la de destino y el workflow smoke tiene éxito.

**Escalar:** Incident Lead e ingeniero de release de inmediato para P1. Involucre al administrador de base de datos si se requiere limpieza de migraciones o restauración de esquema.

## Fallo de modelo, credencial o integración

**Gravedad:** P2 en caso de fallo de proveedores específicos o límites de tasa; P1 si ningún modelo configurado responde para los workflows.

**Diagnosticar**

1. Distinga entre fallo del proveedor, caducidad/revocación de credenciales, límite de tasa (HTTP 429) y tiempos de espera de red.
2. Revise las páginas de estado de los proveedores (OpenAI, Anthropic, Google AI, etc.).
3. Pruebe la validez de credenciales desde **Configuración > Credenciales** utilizando el botón de prueba integrado.
4. Revise los registros de la aplicación para clasificar el error: `RateLimitError`, `AuthenticationError`, `InvalidRequestError` o `APIConnectionError`.

**Mitigar**

1. Para límites de tasa (429), cambie los nodos de workflow a credenciales de reserva o a un modelo del proveedor con cuota disponible.
2. Para credenciales caducadas, rote la clave en **Configuración > Credenciales**. Heym actualiza las credenciales compartidas en todos los workers del cluster.
3. Para caídas de proveedores ascendentes, pause temporalmente los workflows afectados o configure enrutamiento de modelos alternativo.

**Verificar:** La prueba de credenciales tiene éxito en la interfaz, la ejecución del agente finaliza sin errores HTTP 4xx/5xx y desaparecen los retrasos por límite de tasa.

**Escalar:** Propietario de credenciales / responsable de equipo para facturación o regeneración de claves; soporte del proveedor externo ante caídas generalizadas.

## Fallo de sandbox

**Gravedad:** P2 para fallos aislados de nodos de código; P1 si la ejecución en sandbox es requerida para workflows críticos de negocio.

**Diagnosticar**

1. Identifique el modo de ejecución de sandbox: proceso local, contenedor Docker o pod sandbox de Kubernetes.
2. Compruebe la capacidad de respuesta del demonio Docker en el host de sandbox o la programación de pods de sandbox en Kubernetes.
3. Kubernetes: inspeccione los pods de sandbox en el namespace configurado, sus eventos y NetworkPolicies. Las sandboxes pueden utilizar un namespace independiente:
```bash
   HEYM_SANDBOX_NAMESPACE='<actual-sandbox-namespace>'
   kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_SANDBOX_NAMESPACE" get pods \
     -l app.kubernetes.io/managed-by=heym -L heym.run/sandbox,heym.run/instance
   ```

4. Compruebe la configuración de `HEYM_SANDBOX_BACKEND` y los parámetros específicos del tipo de sandbox en las variables de entorno.
5. Si fallan los contenedores Docker, asegúrese de que el socket de Docker esté montado y que el usuario de Heym disponga de permisos para interactuar con el demonio.
6. En sandboxes de Kubernetes, asegúrese de que la ServiceAccount tenga permisos para crear y gestionar pods en el namespace de sandbox.

**Verificar:** El nodo de código se ejecuta con éxito en la sandbox aislada, devuelve las salidas esperadas y los recursos de sandbox se limpian tras la ejecución.

**Escalar:** Guardia de plataforma para problemas del demonio Docker a nivel de host o fallos de infraestructura de sandbox en Kubernetes.

## Recuperación ante desastres y respuesta a emergencias

**Gravedad:** P1 para pérdida catastrófica de datos, caída del host o destrucción total del entorno.

**Procedimiento**

1. Declare el incidente de emergencia y nombre a un Incident Commander. Notifique a las partes interesadas mediante los canales de emergencia establecidos.
2. Aísle el entorno dañado para evitar mayor pérdida de datos o escrituras contradictorias. Evite que instalaciones antiguas y nuevas procesen simultáneamente la misma carga de trabajo.
3. Restaure PostgreSQL mediante su procedimiento probado de copia de seguridad/PITR en el entorno de recuperación previsto. Restaure los datos correspondientes de archivos/plugins/espacio de trabajo de código de la instancia main, junto con el juego de claves de cifrado y el secreto de firma desde una copia de seguridad segura. Una copia de solo la base de datos no contiene los bytes de archivos.
4. Inicie una única instancia main prevista utilizando una release compatible con el esquema restaurado. Inspeccione las migraciones antes del inicio, ya que el punto de entrada de main las ejecuta. Los workers no deben competir con las migraciones.
5. Mantenga el ingress de producción y los productores aislados durante las comprobaciones. Una instancia main iniciada puede elegir un líder y ejecutar planificaciones/recuperaciones restauradas; utilice las restricciones de red documentadas y los controles de disparo/recuperación de workflows del entorno de recuperación antes del inicio. Restaurar datos no es una vista previa pasiva.
6. Concilie registros activos/en cola/pendientes y cualquier reejecución automática con los propietarios. La recuperación reinicia las ejecuciones elegibles desde el principio y no puede deshacer efectos secundarios posteriores. No reejecute cada fila fallida u omitida.
7. Valide lecturas/escrituras de BD, inicio de sesión, descifrado de credenciales, archivos de Drive, plugins, acceso a espacios de trabajo de agentes de código y workflows smoke aprobados (exclusivos de main y distribuibles). Agregue gradualmente workers compatibles y luego reabra la ingesta y el ingress.
8. Registre el intervalo real de pérdida de datos, la duración de la recuperación, el trabajo omitido y la conciliación pendiente. Programe otra prueba de restauración si este procedimiento reveló alguna deficiencia.

**Verificar:** Se supera la barrera de verificación compartida, se reanudan las programaciones críticas, los propietarios aceptan la conciliación y se restablece la monitorización de copias de seguridad/restauración. Una instalación vacía y sana no es una recuperación.

**Escalar:** Incident Lead junto con responsables de base de datos, almacenamiento y plataforma en todo momento. No improvise reparaciones destructivas de directorios de datos ni activaciones de doble sitio.

## Plantilla de pruebas y traspaso
```text
Incident / severity / environment:
Impact and first observed time (UTC):
Main / worker / database / deployment identifiers:
Last release or configuration change:
Affected workflow IDs and execution IDs:
Public health / direct health / DB check:
Connection totals, blocker PIDs, queue depth and oldest age:
Instance eligibility, leader evidence, CPU / memory / disk:
Action taken, timestamp, operator, expected effect:
Verification result and observation window:
Temporary restrictions, reversal owner, expiry:
Skipped / failed / recovered work requiring reconciliation:
Next action, owner, next update time:
```

Capture registros e IDs acotados; elimine valores de credenciales, encabezados de autenticación, enlaces de funcionalidad, payloads de usuario y parámetros SQL antes de adjuntar pruebas. Los eventos de auditoría del enrutador están en stdout de main. El historial de ejecuciones registra la instancia ejecutora; por lo tanto, las fallas de ejecución pueden requerir registros tanto de los workers como de main.

## Referencias de implementación

Estas rutas identifican la implementación comprobada al redactar este runbook. Revalídelas cuando cambie el comportamiento de ejecución, despliegue o esquema.

| Asunto | Origen |
| --- | --- |
| Servicios de salud e inicio | [main.py](https://github.com/heymrun/heym/blob/main/backend/app/main.py) |
| Configuración de pool y etiquetas de conexión | [config.py](https://github.com/heymrun/heym/blob/main/backend/app/config.py), [session.py](https://github.com/heymrun/heym/blob/main/backend/app/db/session.py) |
| Recuento de procesos y migraciones | [Punto de entrada de backend](https://github.com/heymrun/heym/blob/main/backend/entrypoint.sh), [Punto de entrada de release](https://github.com/heymrun/heym/blob/main/docker/release-entrypoint.sh) |
| Topología de despliegue y asignaciones reales de entorno | [Compose](https://github.com/heymrun/heym/blob/main/docker-compose.yml), [Ejemplo de cluster](https://github.com/heymrun/heym/blob/main/docker-compose.cluster.yml), [Ejemplo de worker](https://github.com/heymrun/heym/blob/main/docker-compose.worker.yml), [Kubernetes](../getting-started/kubernetes.md) |
| Elegibilidad y liveness del registro | [registry.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cluster/registry.py), [API de cluster](https://github.com/heymrun/heym/blob/main/backend/app/api/admin_cluster.py) |
| Asignación, estados de cola y despacho | [node_placement.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cluster/node_placement.py), [run_queue.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cluster/run_queue.py), [dispatch.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cluster/dispatch.py) |
| Liderazgo y mantenimiento | [distributed_lock.py](https://github.com/heymrun/heym/blob/main/backend/app/services/distributed_lock.py), [cron_scheduler.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cron_scheduler.py) |
| Recuperación y cancelación | [execution_recovery.py](https://github.com/heymrun/heym/blob/main/backend/app/services/execution_recovery.py), [execution_cancellation.py](https://github.com/heymrun/heym/blob/main/backend/app/services/execution_cancellation.py) |
| Endpoints para pausar/reanudar/cancelar workflows | [workflows.py](https://github.com/heymrun/heym/blob/main/backend/app/api/workflows.py), [workflow_lifecycle.py](https://github.com/heymrun/heym/blob/main/backend/app/services/workflow_lifecycle.py) |
| Definición de tablas y columnas de diagnóstico | [models.py](https://github.com/heymrun/heym/blob/main/backend/app/db/models.py) |
| Interpretación de capacidad y coste | [Analytics](../tabs/analytics-tab.md), [Traces](../tabs/traces-tab.md), [Alerts](../tabs/alerts-tab.md) |
