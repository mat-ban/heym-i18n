# Distribución de carga

Apunte una segunda instancia de Heym a la misma base de datos PostgreSQL y se unirá como worker. Las ejecuciones de workflow en segundo plano se reparten entonces entre las instancias según un porcentaje que usted establezca, de modo que la máquina que sirve la UI y la API no sea también la única máquina que ejecuta todos los workflows.

Las instancias nunca se comunican entre sí. Postgres transporta el trabajo, por lo que un worker no necesita ningún puerto abierto, ningún certificado ni ninguna ruta de retorno hacia la instancia principal: solo acceso a la base de datos.

## Roles

Una instancia es **main**, fijada mediante una variable de entorno. Sirve la UI, la API, MCP y el portal de chat, y es propietaria del almacenamiento de archivos y de los plugins instalados. Cualquier otra instancia es un **worker**: solo accede a la base de datos y ejecuta ejecuciones en segundo plano.

```
HEYM_CLUSTER_ENABLED=true
HEYM_INSTANCE_ROLE=main       # or: worker
HEYM_INSTANCE_NAME=EU Main    # display label, editable later from Settings
HEYM_INSTANCE_ID=eu-main      # optional; derived from the name when empty
```

El rol main es independiente de la elección de líder. Heym ya elige un líder en todo el cluster para gestionar cron, la evaluación de alertas y la recuperación ante fallos; si main cae, el liderazgo pasa a un worker en unos pocos segundos y las ejecuciones programadas siguen disparándose. El rol main no se traslada, porque el almacenamiento de archivos no puede trasladarse con él.

## Qué puede salir de la instancia principal

La ubicación se decide a partir de los nodos del workflow antes de que comience la ejecución. Una ejecución permanece en main cuando cualquiera de sus nodos —incluidos los nodos dentro de los sub-workflows que invoca— toca algo que solo existe en una máquina:

| Nodo | Por qué permanece en main |
|---|---|
| Codex, OpenCode Go | El espacio de trabajo del agente de programación permanece en el disco local para que una ejecución posterior pueda reanudarse en él |
| Agent con una skill adjunta | El código de la skill lee y escribe en Heym Drive |
| Drive, Converter, Google Drive | Leen y escriben archivos generados |
| Trigger File Upload | La carga aterriza en el disco de main |
| Send Email | Los relés SMTP corporativos suelen permitir en su lista de autorizados una única dirección de origen |
| Nodos de plugin | Un plugin está instalado en el disco de una instancia |

**Todo lo demás se distribuye**, incluidos el nodo Code, Playwright y las herramientas Python del Agent. Todas las instancias ejecutan la misma imagen con su propio socket de Docker, por lo que un sandbox no es motivo para mantener una ejecución en main, y esos son los nodos que más CPU consumen del producto.

Un workflow cuyo sub-workflow se elige mediante una expresión no puede inspeccionarse de antemano, por lo que permanece en main.

## Elección de los porcentajes

Los pesos son números enteros que se establecen en **Settings → Instances**. Son **cuotas de las instancias que actualmente pueden aceptar trabajo**, no porcentajes de 100: el planificador divide por el total propio de ese conjunto.

Esa distinción se manifiesta en cuanto una instancia queda fuera. Con `Main 41, Worker A 26, Worker B 33`, apagar Worker B deja un conjunto de 67, por lo que Main recibe realmente 41/67 = **61%** y Worker A 26/67 = **39%**. El panel muestra el reparto efectivo bajo la tabla exactamente por este motivo, y nunca se bloquea el guardado porque los números no sumen 100: solo se rechaza un reparto en el que ninguna instancia habilitada tenga un peso.

Hay dos cosas más que es fácil hacer mal.

**Un porcentaje no es una cuota de potencia de máquina.** Solo cubre las ejecuciones que pasan por la cola. Servir la UI y la API, transmitir las ejecuciones del editor y del portal, y gestionar las cargas de archivos son trabajo de main y nada de ello se contabiliza. Main está haciendo más de lo que indica su número.

**El porcentaje de main es un techo, no un suelo.** Las ejecuciones que solo pueden ejecutarse en main se imputan a su cuota, por lo que una vez agotada esa cuota las ejecuciones distribuibles restantes recaen en los workers. Establecer un número bajo para main es seguro: el trabajo que debe ejecutarse allí sigue ejecutándose. Establecerlo alto deja a los workers sin trabajo.

Así pues, con un main potente y un worker más pequeño, comience más cerca de 60/40 que de la proporción bruta de las máquinas, y después compare las duraciones reales de las ejecuciones en la pestaña Trazas y ajuste.

Los pesos se renormalizan entre las instancias que están actualmente activas y habilitadas. Con `main=70, A=15, B=15`, si A se desconecta el reparto pasa a ser 70/85 y 15/85 entre main y B, y vuelve a 70/15/15 cuando A se reconecta.

**Una instancia que se reconecta no tiene derecho a las ejecuciones que se perdió.** El tiempo transcurrido como Offline, Disabled o con una versión no coincidente no se le computa, por lo que un worker que pasa una noche no disponible se reincorpora en la posición actual del conjunto y el reparto vuelve a leerse como 70/30 desde su primera ejecución: no absorbe todas las ejecuciones hasta haberse puesto al día. Un worker que estuvo disponible todo el tiempo sí se pone al día, que es lo que convierte el porcentaje de main en un techo.
### Una nueva instancia se une con cero

Una instancia a la que nunca se le ha asignado un peso comienza en 0, lo que la dejaría Live, Enabled y sin recibir nada. **Asignar una cuota a las nuevas instancias automáticamente** —activado por defecto, bajo la tabla de instancias— soluciona esto: en la siguiente pasada del líder, al recién llegado se le asigna una cuota equitativa del pool, y los pesos existentes se escalan hacia abajo manteniendo sus proporciones entre sí, de modo que un 70/30 deliberado sigue leyéndose aproximadamente como 70/30 después. El total permanece exactamente en 100.

Esto se ejecuta **una vez por instancia**. Tanto la pasada automática como su propia edición marcan la instancia como configurada, por lo que una instancia que usted configure por sí mismo nunca se modifica a sus espaldas, incluida una que usted haya establecido deliberadamente en 0. Desactive la opción si prefiere que cada nueva máquina espere por usted.

Solo participan las instancias habilitadas, live y compatibles. Asignar una cuota a una máquina que no puede ejecutar nada dejaría esa cuota varada.

### Cuando los porcentajes no pueden ayudar

El panel de configuración informa cuántas de las ejecuciones de las últimas 24 horas solo pudieron ejecutarse en main. Si ese número es alto —una carga de trabajo con mucho Codex o mucho Drive—, los workers permanecerán inactivos independientemente de lo que digan los pesos, y la respuesta es una instancia main más grande en lugar de más instancias.

## Dimensionar PostgreSQL para un cluster

Las conexiones escalan con las instancias, no solo con los usuarios. Cada instancia ejecuta varios procesos uvicorn, y cada proceso mantiene un pool de conexiones más cuatro conexiones `LISTEN` (cancelación, despertares de cola, resultados de ejecuciones, streams de chat). Los streams de chat abiertos comparten la única conexión de chat, por lo que no añaden conexiones a la base de datos. Un cluster de tres instancias con el valor predeterminado `max_connections = 100` se queda sin conexiones, y Heym entonces no puede alcanzar su propia base de datos.

Presupueste aproximadamente `instances x processes x (async pool + sync pool + 4)` y establezca `max_connections` por encima de eso.

Reduzca los pools en lugar de solo elevar el límite. Un despliegue único usa por defecto 10+20 conexiones async y 5+10 sync por proceso, lo cual es generoso para una sola máquina y demasiado para un cluster:

| Variable | Instancia única | Cluster |
|---|---|---|
| `HEYM_DB_POOL_SIZE` | 10 | 3 |
| `HEYM_DB_MAX_OVERFLOW` | 20 | 5 |
| `HEYM_DB_SYNC_POOL_SIZE` | 5 | 2 |
| `HEYM_DB_SYNC_MAX_OVERFLOW` | 10 | 3 |

El archivo compose de ejemplo establece esos valores y `max_connections = 300`. Eso lleva un cluster de dos instancias de un límite de 768 conexiones a 192, con tres instancias aún por debajo de 300.

## Requisitos que el cluster no puede aplicar por usted

**Cada instancia debe usar el mismo `SECRET_KEY` y `ENCRYPTION_KEY`.** Un worker con un `ENCRYPTION_KEY` diferente no puede descifrar credenciales, y cada ejecución que use credenciales fallaría con un error que no nombra nada útil. Heym compara un digest de ambas claves en cada heartbeat, junto con la versión de la app y la revisión de la base de datos, y marca una instancia no coincidente como **Mismatch** para que no reciba ningún trabajo. La carga vuelve a main hasta que usted lo corrija.

Eso también define el orden de actualización. Actualizar main primero marca cada worker como incompatible; el trabajo regresa a main, y cada worker se reincorpora a medida que se actualiza. Más lento, visible y reversible.

**Dirija el ingress únicamente a la instancia main.** Hacer round-robin del tráfico de usuarios entre instancias enviaría una carga de archivo a una máquina y su descarga a otra. Nada en el código impide esto, porque un worker ejecuta la misma imagen y responderá cualquier solicitud que reciba.

**Cada instancia necesita `FRONTEND_URL`, establecida en la misma dirección pública.** Una ejecución que se pausa para revisión humana genera su enlace de revisión en la instancia que la ejecutó, no en main, y lo mismo aplica para los enlaces de seguimiento de Codex y para las URL de descarga de los archivos generados. Un worker que no la tenga construye esos enlaces contra su propia dirección local, y quien reciba uno no podrá abrirlo.

**Las instancias worker tienen una IP de salida diferente.** Cualquier API que permita direcciones de origen por allowlist verá la nueva. Send Email se ejecuta en main exactamente por esta razón; para el nodo HTTP, o bien asigne al cluster una única dirección de egreso NAT, o bien incluya en el allowlist cada instancia.

## Añadir un worker en otra máquina

`docker-compose.worker.yml` en la raíz del repositorio ejecuta un worker en su propio host. No tiene base de datos ni UI: alcanza el PostgreSQL de la instancia main y toma su cuota de las ejecuciones en segundo plano.

Complete un `.env` junto a él —etiqueta de imagen, host y credenciales de la base de datos, ambas claves y un id de instancia— y arránquelo. Compose se niega a arrancar hasta que cada valor requerido esté establecido, en lugar de iniciarse con un placeholder que falle más tarde de una forma difícil de leer.

La etiqueta de imagen debe ser la versión que ejecuta main, y ambas claves deben copiarse exactamente. Una diferencia en cualquiera de ellas muestra el worker como Mismatch y no recibe ningún trabajo.
## Lectura de la tabla de Instancias

| Columna | Significado |
|---|---|
| Name | Etiqueta editable; se estampa en cada ejecución que realiza esta instancia |
| Role | `main` o `worker`, según el entorno |
| Status | **Live** con un heartbeat reciente, **Offline** tras 30 segundos de silencio, **Mismatch** cuando la versión, la revisión de la base de datos o las claves difieren de las de main |
| ms | Ida y vuelta desde esa instancia hasta la base de datos, medida por la propia instancia |
| On | Retira un worker de la rotación sin detenerlo: las ejecuciones en curso finalizan, no se le asignan nuevas. Bloqueado en activo para la instancia main: el trabajo de archivos, plugins y agentes de programación se ejecuta allí independientemente de lo que indique el conmutador |
| Weight | Su cuota de ejecuciones distribuibles |

## Límites de concurrencia en un cluster

El [límite de concurrencia](./webhooks.md#concurrency-limit-and-queued-runs) de un workflow se contabiliza en PostgreSQL, por lo que se aplica en todas las instancias y procesos: dos instancias nunca ejecutan más ejecuciones de un workflow de lo que permite el límite. Una ejecución que esperó un slot se asigna según las mismas reglas que cualquier otra ejecución cuando comienza, por lo que una ejecución que deba permanecer en main seguirá haciéndolo. El worker de cola que ejecuta estas ejecuciones ahora se inicia en cada instalación, incluida una instancia única, donde solo reclama las ejecuciones puestas en cola por su propia instancia. Esto significa que una instancia única también mantiene la conexión `LISTEN` para despertar la cola en cada proceso; dimensione sus conexiones de la misma manera que para una instancia de cluster.

## Historial de ejecuciones

Cada ejecución del historial de ejecuciones indica la instancia que la ejecutó, y ambos diálogos de historial pueden filtrarse hasta una sola instancia. El filtro coincide con el id de la instancia mientras muestra su nombre, por lo que renombrar una instancia no reescribe lo que indican las ejecuciones antiguas.

Nada de esto aparece en una instalación de instancia única: los campos están vacíos, no se muestra ninguna etiqueta y no se ofrece ningún filtro.

## Comportamiento ante fallos

**Si un worker muere a mitad de una ejecución**, su heartbeat queda obsoleto y el barrido de recuperación existente del líder vuelve a ejecutar la ejecución en una instancia activa. La fila de la cola que había reclamado se retira por separado: una vez que no existe ninguna ejecución activa para ella y ha transcurrido un margen de dos minutos, el líder marca la fila como fallida y despierta a quien estuviera esperando el resultado. La antigüedad por sí sola nunca es el trigger, por lo que una ejecución legítimamente larga se deja intacta; y la fila se marca como fallida en lugar de reencolarse, porque la recuperación ya se encarga de la reejecución y reencolarla ejecutaría el mismo workflow dos veces.

**Si main cae**, el cron sigue disparándose desde un worker y las ejecuciones distribuibles siguen ejecutándose. Las ejecuciones que necesitan main se ponen en cola y esperan, y se drenan cuando este regresa, pero solo dentro de la ventana de gracia de misfire (`HEYM_CRON_MISFIRE_GRACE_SECONDS`, 600 segundos por defecto). Todo lo más antiguo se cierra como omitido, con el motivo registrado, en lugar de reproducir horas de acumulación de una sola vez.

La UI, la API, MCP y el editor no están disponibles mientras main está caído, porque el ingress apunta allí.

## Relacionado

- [Ejecución y despliegue](../getting-started/running-and-deployment.md) – Despliegue primero una instancia única; las variables de entorno y la configuración de claves se encuentran allí
- [Configuración](./user-settings.md) – La pestaña Instances, y quién puede verla
- [Trazas](../tabs/traces-tab.md) – Compare las duraciones reales de las ejecuciones entre instancias antes de cambiar el reparto
- [Seguridad](./security.md) – Por qué cada instancia debe compartir `SECRET_KEY` y `ENCRYPTION_KEY`
