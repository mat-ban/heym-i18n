# Pestaña Evals

La pestaña **Evals** es una página independiente en `/evals`. Permite crear suites de evaluación, definir casos de prueba y ejecutar evaluaciones contra sus workflows de [Nodo de agente](../nodes/agent-node.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Ver demo de Evals</a></p>

## Acceso

- Haga clic en **Evals** en la barra de pestañas del panel
- O navegue a `/evals`
- O use **Ctrl+K** (Cmd+K) y seleccione "Evals" en la paleta de comandos

## Suites de evaluación

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
- **Temperatura** – Establezca la temperatura del modelo (`Exact Match` y `Contains`)
- **Esfuerzo de razonamiento** – Establezca el esfuerzo de razonamiento para modelos de razonamiento (`Exact Match` y `Contains`)

### LLM-as-Judge

Con un juez, cada modelo responde a la entrada de prueba únicamente con el prompt de la suite; después, el juez valora en qué medida la respuesta coincide con la salida esperada, de 0 a 100:

- **Un juez de modelo** (OpenAI, OpenAI compatible o Gemini) lee la pregunta, la salida esperada y la respuesta, y devuelve una puntuación con una razón de una línea. Se ejecuta con temperatura `0`, o con esfuerzo de razonamiento `low` para un modelo de razonamiento, de modo que la misma respuesta recibe el mismo veredicto.
- **Un juez de modelo de decisión** valora la respuesta según una rúbrica de cinco niveles, desde *Completamente desviada* hasta *Coincide totalmente*. La puntuación es la posición ponderada por probabilidad en esa rúbrica, por lo que proviene de una distribución calculada por el modelo en lugar de un número escrito por él.

La tarjeta emergente de la celda muestra la razón del juez o, para un modelo de decisión, el nivel, la puntuación y su confianza. La latencia y los tokens describen el modelo bajo prueba; las llamadas del propio juez aparecen en [Trazas](./traces-tab.md) bajo el origen **Evals**. El selector de modelos omite las credenciales de Model Router, porque una evaluación compara modelos específicos.

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
