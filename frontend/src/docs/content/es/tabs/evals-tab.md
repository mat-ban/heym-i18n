# Pestaña Evals

La pestaña **Evals** es una página independiente en `/evals`. Permite crear suites de evaluación, definir casos de prueba y ejecutar evaluaciones contra sus workflows de [Nodo de agente](../nodes/agent-node.md). Una [suite de agentes](#agent-suites) ejecuta un agente o lee sus ejecuciones reales, y comprueba las herramientas que llama, su latencia, su coste en USD, sus tokens y su número de llamadas a herramientas.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Ver demo de Evals</a></p>

## Acceso

- Haga clic en **Evals** en la barra de pestañas del panel
- O navegue a `/evals`
- O use **Ctrl+K** (Cmd+K) y seleccione "Evals" en la paleta de comandos

## Suites de evaluación

- **Nueva suite** – Elija **Suite de prompts** para probar un prompt de sistema entre modelos, o **Suite de agentes** para comprobar ejecuciones reales de un agente (ver [Suites de agentes](#agent-suites))
- **Selector de suite** – Muestra las suites de prompts y de agentes juntas con el tipo junto a cada nombre; escriba para buscar
- **Crear suite** – Defina una suite con un nombre y una descripción
- **Seleccionar workflow** – Elija qué workflow evaluar
- **Seleccionar credencial** – Clave de API para ejecutar el workflow
- **Prompt del sistema** – Edite el prompt del sistema a nivel de suite directamente en el panel izquierdo
- **Optimizar prompt** – Solicite a un LLM que mejore el prompt del sistema actual

## Casos de prueba

- Añada casos de prueba con prompts de entrada y salidas esperadas
- Cada caso puede tener un valor esperado personalizado para la comparación
- Edite o elimine casos de la suite
- **Generar datos de prueba** – Use la credencial/modelo seleccionado para crear automáticamente casos de prueba a partir del prompt de la suite

## Ejecución de evaluaciones

- **Seleccione uno o varios modelos** – Ejecute la misma suite contra varios modelos en una sola evaluación
- **Método de puntuación** – Elija `Exact Match`, `Contains` o `LLM-as-Judge`
- **Juez** – Para `LLM-as-Judge`, seleccione opcionalmente una credencial de OpenAI, OpenAI compatible (Custom), Gemini (Google) o [Modelo de decisión](../nodes/decision-node.md) e introduzca el modelo del juez (por ejemplo `gpt-4o-mini` o `jev-latest`) para puntuar con un juez independiente
- **Ejecuciones por prueba** – Repita cada caso de prueba varias veces en una misma ejecución
- **Ajustes recordados** – Una suite se abre con los ajustes de su ejecución más reciente: credencial, modelos, método de puntuación y juez, temperatura, esfuerzo de razonamiento y ejecuciones por prueba. Al abrir una ejecución anterior se cargan sus ajustes, por lo que **Reejecutar evaluaciones** repite la misma
- **Temperatura** – Establezca la temperatura del modelo (`Exact Match` y `Contains`)
- **Esfuerzo de razonamiento** – Establezca el esfuerzo de razonamiento para modelos de razonamiento, desde Bajo hasta Muy alto y Máx igual que en los nodos LLM y Agent (`Exact Match` y `Contains`)

### LLM-as-Judge

Con un juez, cada modelo responde a la entrada de prueba únicamente con el prompt de la suite; después, el juez valora en qué medida la respuesta coincide con la salida esperada, de 0 a 100:

- **Un juez de modelo** (OpenAI, OpenAI compatible o Gemini) lee la pregunta, la salida esperada y la respuesta, y devuelve una puntuación con una razón de una línea. Se ejecuta con temperatura `0`, o con esfuerzo de razonamiento `low` para un modelo de razonamiento, de modo que la misma respuesta recibe el mismo veredicto.
- **Un juez de modelo de decisión** valora la respuesta según una rúbrica de cinco niveles, desde *Completamente desviada* hasta *Coincide totalmente*. La puntuación es la posición ponderada por probabilidad en esa rúbrica, por lo que proviene de una distribución calculada por el modelo en lugar de un número escrito por él.

La tarjeta emergente de la celda muestra la razón del juez o, para un modelo de decisión, el nivel, la puntuación y su confianza. La latencia y los tokens describen el modelo bajo prueba; las llamadas del propio juez aparecen en [Trazas](./traces-tab.md) bajo el origen **Evals**. El selector de juez omite las credenciales de Model Router, porque un juez debe ser un único modelo fijo. La credencial para los modelos bajo prueba puede ser un [Model Router](../reference/credentials.md#model-router-auto-model): su modelo **Auto** selecciona un modelo por solicitud, de la misma manera que en un workflow.

Sin un juez, cada modelo responde y puntúa su propia respuesta en una única solicitud.

La temperatura y el esfuerzo de razonamiento se ocultan en este modo, y la ejecución usa ajustes fijos: temperatura `0.7` para modelos estándar, y esfuerzo de razonamiento `medium` para modelos de razonamiento (`low` cuando puntúan sus propias respuestas).

## Resultados

- Consulte aprobado/fallido por caso de prueba
- Inspeccione las salidas reales frente a las esperadas
- Compare las salidas por modelo en paralelo cuando una ejecución incluya varios modelos
- Revise el historial de ejecuciones de evaluaciones anteriores; una ejecución de `LLM-as-Judge` muestra su modelo juez en la lista del historial
- Abra ejecuciones históricas desde el panel de resultados e inspeccione las instantáneas guardadas de prompt/entrada/salida
- Al abrir una ejecución anterior, se cargan su método de puntuación y su juez en el panel izquierdo, de modo que **Re-Run Evals** repite la misma evaluación
- **Export** descarga la ejecución como JSON, incluyendo `judge_credential_id` y `judge_model`

## Agent Suites

Una suite de agentes comprueba un nodo [Agent](../nodes/agent-node.md) frente a sus ejecuciones. Las lee de [Trazas](./traces-tab.md), donde cada ejecución ya registra su tiempo, tokens, coste y llamadas a herramientas, y también puede ejecutar el workflow por usted.

Cree una con **Nueva suite** → **Suite de agentes** y siga tres pasos:

1. **Agente** – Elija el workflow y luego su nodo de agente. Solo se listan los workflows con nodo de agente; un workflow o agente que aún no se haya ejecutado se muestra pero no se puede elegir. Los ajustes del agente elegido (modelo, instrucciones, herramientas y límites) se muestran a la derecha, y debajo aparece un lienzo de solo lectura de su workflow con el agente resaltado.
2. **Baseline** – Las últimas 10 ejecuciones del agente: latencia p50 y p95, coste por ejecución, tokens por ejecución y llamadas a herramientas por ejecución, qué herramientas llamó y con qué frecuencia, y las métricas individuales de cada ejecución. Las ejecuciones que terminaron en error se listan pero quedan fuera de la baseline.
3. **Comprobaciones** – Marque cada herramienta como **Must call**, **Must not call** o **Either**. Cada tipo de llamada se lista con su tipo: herramientas de Python y de nodo, herramientas **MCP** con su servidor, **subagentes** por etiqueta, **subworkflows** por nombre y **skills**. Añada una por tipo y nombre si aún no se ha ejecutado, y quítela de nuevo con su **X**. Establezca límites superiores para latencia, coste, tokens totales y llamadas a herramientas; cada uno comienza un 20 % por encima del p95 de la baseline y se puede desactivar.

Una suite guardada se abre en **Resultados**, con **Baseline** y **Editar comprobaciones** al lado:

- **Ejecutar el workflow** – Elija cuántas ejecuciones (hasta 20); se ejecutan cuatro a la vez. Las entradas se rellenan a partir de la ejecución más reciente del workflow y se pueden editar, usándolas cada ejecución. Active **Generar entradas** (el icono de destello) y luego elija una credencial y modelo para que el modelo escriba una entrada distinta para cada ejecución. Lee las instrucciones del sistema del agente y se mantiene cerca de los valores que escribió: escribir el nombre de una ciudad genera otros nombres de ciudades. Cada ejecución ejecuta el workflow completo como cualquier otra ejecución y se lista en el Historial de ejecuciones con el trigger `agent_suite`. Para omitir pasos posteriores, como uno que envíe correo, abra el workflow con **Ir al workflow** en el panel y desactive primero esos nodos. **Detener** finaliza la ejecución de la suite: no se inician nuevas ejecuciones y las en curso se cancelan. Una ejecución de suite cuyo servidor se detuvo, por ejemplo durante un reinicio, se muestra como interrumpida tras un minuto en vez de quedarse bloqueada.
- **Resultados** – La ejecución más reciente de la suite se puntúa por defecto. Cada ejecución de suite se conserva con su fecha en el selector de ejecuciones, donde puede abrirla o eliminarla; o cambie a las últimas 10, 20 o 50 ejecuciones del agente para incluir sus otras ejecuciones. Verá la tasa de aprobados, la frecuencia con la que pasó cada comprobación, latencia, coste, tokens y llamadas a herramientas junto a la baseline guardada, así como cada ejecución con el motivo de fallo y un enlace a su traza.
- **Ir al workflow** abre el workflow del agente en una nueva pestaña. En el campo de nombre, **Esc** o la **X** borra el texto.

Cómo se interpretan las métricas:

- La **latencia** es el tiempo del modelo más el tiempo de las llamadas a herramientas de la ejecución.
- El **coste** utiliza los mismos precios que Traces. La ejecución de un modelo sin precio salta la comprobación de coste en lugar de fallar.
- Una ejecución **aprueba** cuando finalizó sin error y superó todas las comprobaciones.
- La suite solo lee sus propias trazas, la misma regla que la pestaña Traces.
- **Usar ejecuciones recientes como baseline** en **Editar comprobaciones** reemplaza la baseline guardada con las últimas ejecuciones del agente.

La baseline de una suite proviene de uno de tres orígenes. **Editar comprobaciones** muestra cuál junto a **Baseline guardada**:

- las últimas ejecuciones del agente (el valor por defecto, y lo que toma **Usar ejecuciones recientes como baseline**),
- una ejecución de suite finalizada,
- números introducidos a mano.

Los dos últimos se configuran desde [Chat](./chat-tab.md#working-with-evals) o la API:

- `PATCH /api/evals/agent-suites/{id}` acepta `baseline: {"source": "suite_run", "run_id": "…"}` o `{"source": "manual", "values": {"latency_p95_ms": 3000, "cost_avg_usd": 0.01}}`.
- `POST /api/evals/agent-suites/{id}/runs` acepta `inputs_list`: un objeto de entrada por ejecución, hasta 20.

### Desde Chat y MCP

El [Chat](./chat-tab.md#working-with-evals) y la herramienta MCP `heym_chat` pueden crear, modificar y ejecutar suites de prompts y de agentes:

- Redactan casos de prueba y entradas de ejecución por sí mismos.
- Preguntan qué credencial usar antes de crear una suite de prompts, a menos que solo encaje una.
- Enlazan cada suite que mencionan en esta página.

## Ideas para la matriz de benchmark

Al construir una matriz de benchmark para workflows de agentes, incluya los escenarios HITL como casos de primera clase en lugar de tratarlos como casos límite.

- Cubra las tres decisiones de revisión: `accepted`, `edited` y `refused`
- Incluya múltiples orígenes de trigger, como ejecuciones desde el editor, portal, curl/webhook y ejecuciones activadas por cron
- Añada escenarios de revisión repetida en los que una ejecución de agente se pause más de una vez
- Verifique las ramas de notificación conectadas a la salida `review` del agente
- Compruebe el comportamiento posterior al rechazo, especialmente si nodos posteriores ramifican según `$agent.decision`

## Relacionado

- [Por qué Heym](../getting-started/why-heym.md) – Evals como la etapa de prueba del ciclo de vida del agente
- [Nodo de agente](../nodes/agent-node.md) – Workflows que se evalúan
- [Pestaña Credenciales](./credentials-tab.md) – Credenciales para las ejecuciones de evaluación
- [Pestaña Trazas](./traces-tab.md) – Inspección detallada de trazas
- [Pestaña Workflows](./workflows-tab.md) – Cree workflows para evaluar
- [Historial de ejecuciones](../reference/execution-history.md) – Consulte ejecuciones anteriores (botón History en el encabezado)
- [Contextual Showcase](../reference/contextual-showcase.md) – Guía compacta de la página disponible en la página de evals
