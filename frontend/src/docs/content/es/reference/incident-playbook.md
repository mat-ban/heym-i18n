# Heym Incident Playbook (L0)

Utilice este playbook para confirmar un incidente de Heym, evaluar el impacto en los usuarios, determinar la gravedad y acceder al procedimiento de recuperación y al responsable adecuados.

Procedimientos detallados: [Heym Runbook (L1)](./operations-runbook.md)

Última revisión: 2026-11-10. Alcance: Heym autoalojado, instancia única o clúster, en Docker Compose o Kubernetes.

## Traspaso del despliegue (Handover)

Complete esta tabla para cada entorno antes de utilizar estos documentos durante las guardias (on-call). Los nombres, las URL, los objetivos de capacidad y los objetivos de recuperación son específicos de cada despliegue. Los ejemplos del repositorio no constituyen un inventario de producción.

| Elemento | Valor del despliegue |
| --- | --- |
| Entorno y URL pública de Heym | `<environment>`, `<public-url>` |
| Guardia de plataforma y suplente | `<rotation-or-contact>`, `<backup-contact>` |
| Canal del incidente y rastreador de incidentes | `<channel>`, `<tracker-url>` |
| Guardia de base de datos e identificador de base de datos | `<contact>`, `<database-id>` |
| Responsables de infraestructura, redes y almacenamiento | `<contacts>` |
| Responsable de release y sistema de despliegue | `<contact>`, `<deployment-url>` |
| Panel de errores, latencia y disponibilidad de la aplicación | `<dashboard-url>` |
| Panel de CPU, memoria, disco y reinicios del host o pod | `<dashboard-url>` |
| Panel de conexiones, bloqueos, disco y replicación de PostgreSQL | `<dashboard-url>` |
| Registros y backend de trazas OTel opcional | `<logs-url>`, `<trace-url-or-disabled>` |
| Proyecto/archivos Compose o contexto/namespace de Kubernetes | `<exact-target>` |
| Ubicaciones de main, workers, base de datos y almacenamiento | `<services-or-deployments>`, `<storage-ids>` |
| Workflow de prueba (smoke) aprobado y resultado esperado | `<workflow-id>`, `<safe-input>`, `<expected-result>` |
| Procedimiento de copia de seguridad de BD y archivos, última prueba de restauración | `<procedure-url>`, `<test-date>` |
| Objetivos de tiempo de recuperación (RTO) y punto de recuperación (RPO) | `<RTO>`, `<RPO>` |

Conserve los contactos y los enlaces a los paneles en la copia operativa restringida del despliegue. Las evidencias deben contener identificadores, marcas de tiempo, recuentos y errores depurados en lugar de credentials o payloads de workflows.

## Inventario de la plataforma

| Componente | Responsabilidad | Implicación en incidentes |
| --- | --- | --- |
| Frontend y backend principal (main) | UI, API, MCP, Portal, ejecución interactiva | Verifique la ruta pública y el proceso principal por separado |
| PostgreSQL | Estado de la aplicación, registro de ejecuciones, cola de ejecuciones, ranuras de concurrencia, coordinación y notificaciones | Una caída de la base de datos puede detener tanto la atención de solicitudes como la ejecución en segundo plano |
| Instancias worker, cuando el modo clúster está activo | Ejecuciones en segundo plano en cola elegibles | Los workers en buen estado no reemplazan los endpoints públicos de la instancia principal |
| Proceso líder electo | Cron, evaluación de alertas, coordinación en segundo plano | Un worker compatible puede convertirse en líder; esto no cambia su rol a main |
| Almacenamiento persistente de main | Archivos de Drive, plugins instalados y espacios de trabajo de agentes de código | Recupere el almacenamiento junto con main; enrutar el ingress hacia un worker no lo recupera |
| Backend de sandbox en cada instancia de ejecución | Contenedores Docker o pods de Kubernetes para ejecución aislada | Un fallo en el backend de sandbox puede afectar a nodos seleccionados mientras la UI funciona |
| Dependencias de workflows | Proveedores de modelos, servidores MCP, API externas, almacenes de datos y servicios de mensajería | Determine si está fallando una dependencia aislada o toda la plataforma |
| Colector OTel opcional | Spans exportados de workflows, nodos y herramientas de Agent | La ausencia de trazas exportadas no demuestra por sí sola el fallo de una ejecución |

La cola de ejecuciones integrada de Heym utiliza PostgreSQL. Redis, RabbitMQ y los almacenes vectoriales pueden ser dependencias de workflows; no son servicios obligatorios para la cola integrada.

`GET /api/health` informa únicamente del estado de salud del proceso y de su versión. No prueba PostgreSQL, la cola, la elección de líder, la capacidad de las sandbox ni la sincronización de credentials. Una respuesta satisfactoria es una comprobación puntual, no una garantía de disponibilidad de extremo a extremo.

## Primeros cinco minutos

| Paso | Acción | Decisión o evidencia |
| --- | --- | --- |
| 1 | Reconocer la alerta y verificar el entorno, el servicio y la hora de inicio | Registrar marcas de tiempo UTC y el cambio de release/configuración más reciente |
| 2 | Comprobar la UI pública y `/api/health`, luego el backend principal directo | Un fallo público con un backend directo en buen estado sugiere problemas de enrutamiento o frontend |
| 3 | Verificar la conectividad de PostgreSQL y la presión de conexiones | Enrutar los fallos de base de datos a L1 antes de reiniciar los servicios de aplicación |
| 4 | Comprobar el estado de contenedores/pods, CPU, memoria, almacenamiento y errores recientes | Separar fallos de infraestructura, sobrecarga y fallos específicos de workflows |
| 5 | En modo clúster, comprobar **Configuración > Instancias**, estados de colas y evidencias de líder | Identificar caída de main, workers desconectados/incompatibles o tareas exclusivas de main |
| 6 | Asignar gravedad e iniciar una mitigación según la tabla de enrutamiento | Para P1/P2, abrir un incidente e involucrar de inmediato al responsable correspondiente |
| 7 | Verificar la ejecución de un workflow seguro en modo producción y supervisar la recuperación | Confirmar que mejoran la antigüedad de la cola, los errores y los recursos; fijar la próxima actualización |

Si una release coincide con el fallo, inspeccione [Despliegue defectuoso o regresión de configuración](./operations-runbook.md#bad-deployment-or-configuration-regression). Compruebe la compatibilidad del esquema antes de revertir.

## Gravedad y respuesta

Estos son objetivos iniciales de respuesta. Aplique la política de incidentes y el impacto comercial del despliegue cuando sean más estrictos.

| Gravedad | Ejemplos | Respuesta |
| --- | --- | --- |
| P1 | Instancia main no disponible para todos los usuarios; base de datos no disponible o escrituras fallidas; fallo generalizado de ejecuciones; entradas críticas no disponibles en múltiples workflows | Mitigación inmediata, registro de incidente, guardia de plataforma y dependencias |
| P2 | Cola creciente; pérdida de capacidad de workers; agotamiento inminente de conexiones; un workflow degradando la capacidad compartida; reinicios repetidos por OOM | Iniciar mitigación de inmediato, objetivo de contención en 15 minutos, registro de incidente |
| P3 | Fallo aislado de workflow o proveedor; impacto limitado con capacidad general de plataforma en buen estado | Responsable de workflow o componente, seguimiento registrado y nota de guardia |
| P4 | Señal informativa, tendencia esperada de capacidad, falso positivo verificado | Reconocer, documentar y ajustar la monitorización si es necesario |

## Enrutamiento de señales a L1

Utilice estos anclajes relativos al configurar los enlaces de alerta. Cuando un servicio de monitorización requiera una URL absoluta, anteponga la ubicación de su copia operativa alojada.

| Señal | Comenzar aquí |
| --- | --- |
| UI/API no disponible, 5xx públicos, fallo de salud del proceso | [UI o API caídas](./operations-runbook.md#ui-or-api-down) |
| PostgreSQL inalcanzable, conexión rechazada, fallo de escritura | [Base de datos caída](./operations-runbook.md#postgresql-down-or-not-writable) |
| Demasiados clientes, agotamiento del pool, esperas de bloqueo, pico de conexiones activas | [Conexiones y bloqueos de base de datos](./operations-runbook.md#active-db-connections-pool-saturation-and-locks) |
| Se requiere un reinicio controlado de backend/workers | [Reinicio de servicio](./operations-runbook.md#controlled-service-restart) |
| Pico en recuento de ejecuciones, duración total, tokens, CPU o memoria | [Workflows con mayor consumo de recursos](./operations-runbook.md#most-resource-consuming-workflows) |
| Cola creciente, ejecuciones en espera o aparentemente atascadas | [Retraso en la cola (backlog)](./operations-runbook.md#queue-backlog-or-apparently-stuck-runs) |
| Instancia desconectada o incompatible, worker inactivo, problema de planificador o distribución | [Comprobaciones del modo clúster](./operations-runbook.md#cluster-mode-checks) |
| Caída de main mientras los workers permanecen en buen estado | [Instancia principal no disponible](./operations-runbook.md#main-instance-unavailable-while-workers-are-live) |
| Errores de Webhook, fallos de MCP/Portal, desconexiones de SSE | [Endpoints de ingress y ejecución](./operations-runbook.md#webhook-mcp-portal-or-streaming-failures) |
| OOM, CrashLoop, Pending, disco lleno, fallo de volúmenes persistentes | [Problema de contenedor, pod o almacenamiento](./operations-runbook.md#container-pod-oom-or-storage-issue) |
| Errores de proveedores de Agent/LLM/MCP, 429, fallo de credentials | [Fallo de modelo o integración](./operations-runbook.md#model-credential-or-integration-failure) |
| Fallos en sandboxes de Code/Playwright/skill/agente de código | [Fallo de sandbox](./operations-runbook.md#sandbox-failure) |
| La recuperación no cumple los objetivos; pérdida de base de datos o archivos | [Recuperación y respuesta ante desastres](./operations-runbook.md#recovery-and-disaster-response) |

## Escalamiento

| Hallazgo | Convocar | Proporcionar |
| --- | --- | --- |
| Múltiples interfaces o workflows afectados | Guardia de plataforma y líder del incidente | Entorno, alcance, hora de inicio, mitigación, próxima actualización |
| Base de datos no disponible, saturada, bloqueada o sin espacio en disco | Guardia de base de datos | ID de BD, recuentos de conexiones, PID bloqueadores, errores depurados, estado del almacenamiento |
| Fallo de pod/nodo, vinculación de almacenamiento, capacidad de sandbox | Responsable de infraestructura/almacenamiento | Contexto, namespace, carga de trabajo, eventos de pod, presión de recursos |
| La ruta pública falla mientras el backend directo funciona | Responsable de red/ingress | Rutas afectadas, códigos de estado, latencia, comparación con backend |
| Un único workflow domina la carga o falla de forma aislada | Propietario del workflow | ID de workflow/ejecución, origen del trigger, tasa, ventana de tiempo, límites temporales |
| Cambio de despliegue o configuración correlacionado | Responsable de release | Digest de la imagen en ejecución, hora de despliegue, revisión de esquema, última versión correcta |
| Cuota, autenticación o disponibilidad del proveedor | Responsable de credential o integración | Proveedor, modelo/servicio, código de estado, ID de petición si es seguro; sin valores secretos |

Si el impacto de nivel P1/P2 persiste tras la primera mitigación, escale inmediatamente con las evidencias ya recopiladas. No espere a disponer del análisis de causa raíz completo.

## Comportamiento esperado en fallos

| Fallo | Qué puede continuar | Primera acción |
| --- | --- | --- |
| PostgreSQL no disponible | El frontend estático aún puede cargar | Restaurar la ruta a la base de datos; no reiniciar cada instancia de la aplicación |
| Main no disponible, workers sanos | El trabajo en segundo plano elegible y la programación pueden continuar si lidera un worker compatible | Restaurar main con su almacenamiento persistente; UI/API/MCP/Portal públicos continúan no disponibles |
| Worker no disponible | Otras instancias elegibles asumen el trabajo en cola a medida que se reasigna | Verificar ubicación, capacidad de reserva y recuperación antes de añadir tráfico |
| Ejecución interrumpida | Las ejecuciones recuperables elegibles pueden reiniciarse desde el principio, una sola vez | Comprobar la recuperación automática y los efectos secundarios externos antes del reintento manual |
| Sobrecarga de trabajo exclusivo de main | Los workers pueden permanecer inactivos | Reducir la entrada conflictiva o aumentar la capacidad de main; los cambios de peso no trasladan trabajo fijado |
| Alertas internas no disponibles | La monitorización externa de disponibilidad/BD/infraestructura puede seguir funcionando | Utilizar monitorización externa a Heym; las alertas de Heym dependen de la misma BD y planificador |
| Sandbox o proveedor no disponible | Los workflows sin esa dependencia pueden funcionar | Aislar los workflows afectados y reparar la dependencia |

## Recuperación y cierre del incidente

1. Verifique el acceso público, el acceso a la base de datos, la elegibilidad prevista de las instancias y un workflow de prueba (smoke) seguro en modo producción. Una prueba en el editor no demuestra el despacho a workers.
2. Observe al menos 10 minutos de errores estables, latencia controlada, uso de recursos y disminución de la antigüedad de la cola. Observe también la siguiente programación crítica esperada o una comprobación equivalente acordada.
3. Concilie las ejecuciones fallidas, recuperadas, omitidas, expiradas y pendientes con los propietarios de los workflows. Compruebe los efectos secundarios externos antes de repetir cualquier acción.
4. Restaure gradualmente las pausas temporales de triggers, los límites y las ponderaciones de workers. Asigne un responsable y una fecha de expiración a cada restricción remanente.
5. Actualice el incidente con el impacto, la cronología UTC, las acciones, las evidencias y los riesgos pendientes. Asigne una revisión de causa raíz para P1/P2 y actualice ambos documentos si faltaba algún procedimiento.

## Referencias operativas relacionadas

- [Configuración de comandos y comprobaciones L1](./operations-runbook.md#command-setup)
- [Ejecución y despliegue](../getting-started/running-and-deployment.md)
- [Distribución de carga](./cluster.md)
- [Despliegue en Kubernetes](../getting-started/kubernetes.md)
- [Seguridad y rotación de claves](./security.md)
