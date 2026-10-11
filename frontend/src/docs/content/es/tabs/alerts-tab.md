# Pestaña Alertas

La pestaña **Alertas** permite definir condiciones de umbral sobre una ventana temporal y recibir aviso cuando se cruzan. Heym ya registra los resultados de las ejecuciones, la duración de las mismas y el gasto en LLM, pero nunca ofrece esa información por iniciativa propia. Una alerta es la forma de solicitarla.

Cada alerta se evalúa sobre una **ventana temporal** que usted elige, nunca sobre un único evento. Una ejecución fallida es ruido. Doce ejecuciones fallidas en diez minutos son un incidente.

## Tipos de alerta

| Tipo | La pregunta que responde | De dónde procede el número |
|---|---|---|
| **Umbral de errores** | ¿Ha fallado más de N veces en la ventana? | Filas del [Historial de ejecuciones](../reference/execution-history.md) con estado de error |
| **Duración del Workflow** | ¿Se han vuelto más lentas las ejecuciones de lo esperado en la ventana? | Tiempo de ejecución, agregado como máximo, promedio o percentil 95 |
| **Coste en Tokens / USD** | ¿Ha superado el gasto un presupuesto en la ventana? | [Trazas de LLM](./traces-tab.md) más la tabla de costes de LLM |
| **Recuento de ejecuciones** | ¿Se ha ejecutado esto con mucha más frecuencia de la debida? | Recuento de filas del historial de ejecuciones |

### Umbral de errores

Cuenta las ejecuciones fallidas a lo largo de la ventana y se dispara cuando el recuento alcanza su umbral. Dado que cuenta sobre una ventana en lugar de engancharse a cada fallo, un único error transitorio no le enviará una notificación.

### Duración del Workflow

Mide la duración de las ejecuciones dentro de la ventana. Elija **max** (la ejecución más lenta), **average** o **p95**. La cifra p95 utiliza el mismo cálculo de percentil que la [pestaña Analíticas](./analytics-tab.md), por lo que la alerta y el gráfico de latencia nunca discreparán sobre la misma ventana.

El **mínimo de ejecuciones en la ventana** mantiene esta métrica honesta. La ejecución más lenta en una ventana casi vacía es solo esa única ejecución, por lo que establecer un mínimo de, por ejemplo, 3, evita que la alerta se dispare por ruido.

### Coste en Tokens / USD

Suma el gasto en LLM a lo largo de la ventana, ya sea como total de tokens o como dólares estadounidenses. Los importes en dólares se resuelven mediante la misma tabla de precios que utilizan la [pestaña Trazas](./traces-tab.md) y la [Tabla de costes de LLM](./datatable-tab.md#llm-cost-table-system-table), por lo que una alerta de coste y la página de costes siempre coinciden.

Cuando el alcance abarca todos sus workflows, esto incluye las llamadas a LLM realizadas fuera de un workflow, como las de la [pestaña Chat](./chat-tab.md) y el [Asistente IA](../reference/ai-assistant.md). El uso de agentes de programación (Codex, OpenCode) no se incluye.

Los modelos sin fila de precios se reportan en el contexto de la alerta como no tarificados, en lugar de contarse silenciosamente como cero.

### Recuento de ejecuciones

Cuenta las ejecuciones de cualquier estado en la ventana. Esta es la que detecta un Trigger que ha fallado: un workflow que normalmente se ejecuta 20 veces por hora y de repente se ejecuta 2.000 veces. El registro de disparo incluye un desglose por origen del Trigger, porque esa suele ser la respuesta a "por qué ha ocurrido esto".

## Alcance

Una alerta vigila **un workflow** o **todos sus workflows**.

"Todos sus workflows" significa todos los workflows a los que puede acceder el propietario de la alerta. Deliberadamente no significa todos los workflows de la instancia de Heym: las alertas se pueden compartir, y compartir una alerta no debería otorgar a alguien cifras agregadas de workflows que no puede abrir.

## El asistente

La creación de una alerta recorre cinco pasos.

1. **Tipo** — elija uno de los cuatro anteriores.
2. **Alcance** — un workflow, o todos ellos.
3. **Condición** — la ventana temporal, más los campos de umbral para ese tipo.
4. **Respuesta** — qué se ejecuta cuando se dispara, y con qué frecuencia seguir notificándoselo.
5. **Revisión** — asígnele un nombre y consulte el backtest.

### El backtest

El paso de Revisión responde a la pregunta que realmente importa antes de guardar: *en las últimas 24 horas, ¿con qué frecuencia se habría disparado esto?*

Informa del recuento de disparos y del valor más alto observado frente a su umbral. Si indica que la condición se habría disparado 400 veces, corrija el umbral antes de guardar en lugar de después de recibir la notificación. Puede ampliar el periodo de análisis retrospectivo a 3 o 7 días.

## Borrador con IA

En la parte superior del primer paso hay un cuadro donde puede describir lo que desea en lenguaje natural:

> Avíseme si la sincronización de facturas falla más de 5 veces en 10 minutos

Heym convierte eso en una definición de alerta, rellena todos los pasos que puede y avanza con los campos completados por IA marcados, de modo que usted confirma en lugar de volver a escribir. Una solicitud completa le lleva al paso de Revisión.

**Una solicitud parcial también le hace avanzar.** Indique solo "avíseme si falla 5 veces" y obtendrá una alerta de umbral de errores con el recuento completado, valores predeterminados para el resto, y el asistente se abrirá en el primer paso que aún le requiera: en ese caso, Alcance, porque no se nombró ningún workflow. Una nota en la parte superior indica lo que queda por decidir. Nunca bloquea Siguiente ni Crear.

Lo mismo se aplica cuando el modelo nombra un workflow al que no puede acceder, o devuelve una condición con campos faltantes. Las partes que tienen sentido se conservan, el resto recurre a los valores predeterminados de ese tipo de alerta, y usted ajusta a partir de ahí. Nada de esto omite la validación: las propias reglas del asistente y la API vuelven a verificar la alerta al guardar.

## Comportamiento de repetición

Una vez que una alerta se dispara, entra en estado de disparo. Lo que ocurre a continuación es decisión suya en el paso 4.

- **Notificar una vez, hasta que se recupere** (opción predeterminada) — se dispara una vez y luego permanece en silencio mientras la condición se mantenga. Cuando la métrica vuelve a descender por debajo del umbral, la alerta regresa a OK y vuelve a ser elegible para dispararse. La recuperación es un cambio de estado, no un evento: no crea un registro de disparo ni ejecuta el workflow de notificación.
- **Seguir notificando en un intervalo** — se dispara de nuevo cada N minutos mientras la condición se mantenga.

La opción predeterminada existe porque un workflow roto verificado cada 60 segundos produciría, de lo contrario, 60 disparos por hora, que es la forma en que las alertas terminan silenciadas.

## Ejecutar un Workflow al dispararse

El paso 4 ofrece tres respuestas a "qué debe ocurrir cuando esto se dispare":

- **Crear y asignar un nuevo workflow** (opción predeterminada) — al guardar la alerta también se crea un workflow llamado *"&lt;nombre de la alerta&gt; notification"* y se vincula. Llega con un nodo de entrada cuyos campos son exactamente el payload que se muestra a continuación, de modo que `$alert.body.observed_value` y el resto se resuelven de inmediato y solo hay que adjuntar el nodo que entrega el mensaje. **Go to workflow** en la tarjeta de la alerta lo abre. Esta es la opción predeterminada porque una alerta que se dispara hacia la nada es fácil de pasar por alto.
- **Elegir un workflow existente** — ejecutar algo que ya haya construido.
- **No hacer nada** — el disparo se sigue registrando en la pestaña, simplemente no ejecuta nada.

El payload de la alerta llega como el cuerpo de entrada de ese workflow:

```json
{
  "alert_id": "...",
  "alert_name": "Invoice sync failures",
  "alert_type": "error_threshold",
  "condition": "5+ errors in 10m",
  "scope": "workflow",
  "workflows": [{ "id": "...", "name": "Invoice Sync", "value": 12 }],
  "observed_value": 12,
  "threshold_value": 5,
  "window_start": "2026-08-09T11:50:00+00:00",
  "window_end": "2026-08-09T12:00:00+00:00",
  "window_minutes": 10,
  "context": { "error_count": 12 }
}
```

### Qué workflow produjo el número

`workflows` es el único lugar donde aparece un workflow. Enumera cada workflow que contribuyó a la lectura, cada uno con su propio `value` — el recuento de errores de ese workflow, el recuento de ejecuciones, la ejecución más lenta en milisegundos o el gasto, según el tipo de alerta. La lista está ordenada por `value`, de mayor a menor, de modo que `workflows[0]` es el principal responsable.

**Siempre es un array**: de un solo elemento bajo un alcance de un workflow, con muchos elementos bajo "all my workflows", y vacío en lugar de null cuando nada es atribuible. Un workflow de notificación puede iterarlo sin verificar su forma.

Deliberadamente no existe un `workflow_id` en singular. Describía el alcance de la alerta en lugar de la métrica, por lo que era `null` bajo el alcance de sistema, que es precisamente el caso en el que "¿qué workflow?" importa más. `observed_value` sigue siendo el agregado con el que se comparó el umbral; los campos `value` por workflow explican de dónde provino.

Así es como las alertas llegan a Slack, correo electrónico, Telegram o cualquier otro destino: con los [nodos](../reference/node-types.md) que ya tiene, en lugar de un sistema de notificación aparte.

Una alerta no puede notificar al workflow que está vigilando. Eso sería un bucle, de forma más evidente en una alerta de recuento de ejecuciones, donde cada notificación suma al recuento que mide.

Las ejecuciones de notificación son ejecuciones ordinarias, por lo que aparecen en el [historial de ejecuciones](../reference/execution-history.md) como cualquier otra ejecución. Un workflow de notificación que falla se registra en el disparo, pero nunca impide que el propio disparo se registre.

Un workflow de notificación se ejecuta como el propietario de la alerta, con sus credenciales y variables globales, exactamente como si él mismo lo hubiera ejecutado. Elegir un workflow que alguien compartió con usted no toma prestadas las credenciales de esa persona. Si el propietario pierde el acceso al workflow de notificación, el disparo se sigue registrando, pero la ejecución de notificación se omite.

## Historial de disparos

Debajo de la lista de alertas está el historial de disparos: qué se disparó, cuándo, el valor observado frente al umbral, la ventana exacta que se evaluó y el resultado de la notificación.

Reconocer un disparo marca la fila y cambia la insignia de la alerta de **Firing** a **Acknowledged**. Eso es una declaración sobre usted, no sobre la alerta: la condición sigue vigente y la alerta vuelve a **OK** por sí sola cuando la métrica desciende por debajo del umbral.

Cada registro almacena el detalle contribuyente en el momento en que se disparó: ids de ejecuciones fallidas y mensajes de error, gasto por modelo o el desglose por origen del trigger. Esto es deliberado. La ventana ya pasó y recalcularla más tarde puede dar una respuesta diferente.

Los registros de disparo se conservan durante 90 días.

## Consultar a Chat sobre las alertas

La [pestaña Chat](./chat-tab.md) puede responder preguntas sobre sus alertas:

- "¿Qué alertas tengo?"
- "¿Hay alguna alerta en el workflow de facturas?"
- "¿Por qué se disparó la alerta de coste?"
- "¿Cuándo se activó esto por última vez?"

Para una pregunta del tipo "por qué se disparó", Chat cita el valor observado real, el umbral y la ventana temporal del registro de disparo, junto con el detalle contribuyente.

## Compartir

Las alertas se pueden compartir con usuarios individuales o con [equipos](./teams-tab.md). Las personas con quienes las comparte pueden ver la alerta y su historial de disparos. Solo el propietario puede editarla, pausarla, eliminarla o volver a compartirla.

### Cuando se revoca el acceso a un workflow

Una alerta sobre un único workflow sigue leyendo las métricas de ejecución de ese workflow, por lo que revocar el acceso de alguien al workflow también determina qué ocurre con sus alertas sobre él:

- **Al eliminar un recurso compartido de usuario o equipo** se pregunta al propietario del workflow si también deben detenerse las alertas de ese usuario o equipo sobre el workflow. La opción predeterminada es detenerlas. Las alertas detenidas se pausan, no se eliminan, y cada una se registra como `alert.disable_on_access_revoke` en el [registro de auditoría](../reference/audit.md).
- **Al eliminar a un miembro de un equipo o eliminar un equipo** siempre se detienen las alertas afectadas, porque la persona que realiza ese cambio no es necesariamente el propietario del workflow.
- Una alerta solo se detiene cuando su propietario no tiene otra vía de acceso al workflow, como un recurso compartido directo u otro equipo.
- Reanudar o probar una alerta pausada verifica de nuevo el acceso del propietario, por lo que una alerta detenida no puede reactivarse ni utilizarse para leer las métricas del workflow sin acceso. Al pulsar **Reanudar** sin acceso, se muestra una notificación que explica que el propietario del workflow debe compartirlo de nuevo primero.

## Gestión de alertas

- **Pausar / Reanudar** — una alerta pausada nunca se evalúa. Al reanudarla, se comprueba de inmediato en lugar de esperar al siguiente intervalo.
- **Editar** — los cambios se validan en su conjunto, por lo que una edición parcial no puede dejar la alerta en un estado no válido.
- **Eliminar** — elimina la alerta y su historial de activaciones.

## Véase también

- [Pestaña Analytics](./analytics-tab.md) — los gráficos de los que se extraen estos umbrales
- [Pestaña Traces](./traces-tab.md) — de dónde proceden las cifras de coste de LLM
- [Historial de ejecuciones](../reference/execution-history.md) — las ejecuciones que miden las alertas de error, duración y recuento
- [Pestaña Chat](./chat-tab.md) — consultar alertas en lenguaje natural
- [Equipos](./teams-tab.md) — compartir alertas con un equipo
