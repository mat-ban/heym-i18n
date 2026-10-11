# Pestaña Analytics

La pestaña **Analytics** muestra métricas de ejecución y tendencias de sus workflows. Supervise el uso, el rendimiento e identifique cuellos de botella.

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Ver la demo de Analytics</a></p>

## Estadísticas resumidas

- **Ejecuciones totales** – Recuento de ejecuciones del workflow en el periodo seleccionado
- **Tasa de éxito** – Porcentaje de ejecuciones correctas
- **Duración media** – Tiempo medio de ejecución
- **Tiempo ahorrado** – Tiempo total estimado ahorrado: los minutos ahorrados por ejecución configurados en cada workflow × sus ejecuciones correctas, sumados en la ventana seleccionada
- **Tendencias** – Indicadores de subida/bajada respecto al periodo anterior

## Rango temporal

- **24h** – Últimas 24 horas
- **7d** – Últimos 7 días
- **30d** – Últimos 30 días
- **All** – Todo el historial disponible

## Filtro de workflow

- Filtre las métricas por un workflow concreto
- **All workflows** – Agregado de todos los workflows

## Tablas

Dos tablas muestran el uso de los workflows: **Most Used** (más ancha) y **Most Failed**.

- **Time Saved** – Most Used muestra el tiempo ahorrado acumulado de cada workflow (minutos ahorrados por ejecución × ejecuciones correctas). **Not Set** indica que falta la estimación; haga clic en ella para abrir ese campo en el workflow.
- **Columnas ordenables** – Haga clic en la cabecera de una columna para ordenar por ella. Haga clic de nuevo para alternar entre orden ascendente y descendente. Los indicadores de flecha muestran la dirección de ordenación.
- **Etiquetas en móvil** – En pantallas pequeñas, las etiquetas de columna se acortan (p. ej. "Executions" → "Runs", "Success" → "OK", "Error" → "Err") para que las tablas encajen sin desplazamiento horizontal.

## Gráficos

- **Execution Volume Over Time** – Gráfico de líneas de ejecuciones por intervalo temporal
- **Success vs Error Rate** – Gráfico de área que compara ejecuciones correctas y fallidas
- **Average Latency Over Time** – Gráfico de líneas que muestra la evolución del tiempo de respuesta
- **Arrastrar para seleccionar** – Haga clic y arrastre sobre cualquier gráfico para enfocar un rango de fechas personalizado
- **Modo de selección** – Los rangos seleccionados actualizan las tarjetas de resumen, los gráficos y las tablas de workflows sin cambiar el preset base
- **Clear Selection** – Vuelva a la ventana temporal predefinida cuando termine el análisis detallado

## Actualización automática

- Active la actualización automática para mantener las métricas al día sin recargar manualmente

## Relacionado

- [Pestaña Workflows](./workflows-tab.md) – Workflows que se están midiendo
- [Pestaña Traces](./traces-tab.md) – Inspección detallada de trazas
- [Pestaña Logs](./logs-tab.md) – Logs de ejecución para depuración
- [Contextual Showcase](../reference/contextual-showcase.md) – Guía compacta de páginas para las superficies del dashboard

Cuando un gráfico muestre una tendencia sobre la que prefiera recibir aviso en lugar de vigilarla, conviértala en una [alerta](./alerts-tab.md): el recuento de errores, la duración de ejecución, el gasto en LLM y el recuento de ejecuciones pueden recibir un umbral sobre una ventana temporal.
