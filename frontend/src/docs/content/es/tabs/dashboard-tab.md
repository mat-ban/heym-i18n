# Dashboard

La pestaña **Dashboard** es un espacio al estilo Grafana donde se construyen cuadrículas de widgets de gráficos. Cada widget se renderiza a partir de la salida de su propio workflow oculto de Heym, de modo que cualquier dato que pueda producirse en un workflow —consultas a bases de datos, llamadas a API, búsquedas RAG, salida de LLM— puede convertirse en un gráfico. Es posible mantener varios dashboards y compartir cada uno con personas o equipos.

## Dashboards

Todos comienzan con un dashboard, creado la primera vez que se abre la pestaña. Utilice el selector de dashboards en la parte superior de la pestaña para cambiar entre dashboards, y **+** junto a él para crear uno nuevo. El selector lista primero los dashboards propios y, a continuación, los compartidos, etiquetados con el nombre de la persona que los compartió.

La pestaña reabre el último dashboard utilizado, y la barra de direcciones incluye el dashboard abierto (`?tab=dashboard&dashboard=<id>`), de modo que un enlace abre ese dashboard exacto para cualquiera que tenga acceso a él.

El botón de configuración (solo para propietarios) permite renombrar el dashboard, gestionar su uso compartido y eliminarlo. Eliminar un dashboard elimina sus widgets y sus workflows. Siempre se conserva al menos un dashboard propio, por lo que el último no puede eliminarse.

## Widgets

Un widget es un único gráfico sobre la cuadrícula. Tipos de gráfico admitidos:

- **Bar** (vertical u horizontal)
- **Line**
- **Area** (tendencia rellena, admite múltiples series)
- **Pie**
- **Table** (con desplazamiento)
- **Numeric** (un único valor KPI con una unidad opcional)
- **Gauge** (un único valor frente a un rango mín–máx, por ejemplo un porcentaje)
- **Scatter** (puntos X/Y para gráficos de correlación)
- **Proportion** (una barra dividida en porciones con una leyenda de porcentajes, por ejemplo un desglose por idioma)
- **Bar gauge** (un medidor horizontal por fila con un degradado de rojo a verde y un valor, por ejemplo el espacio libre en disco)
- **Text** (un mensaje markdown, por ejemplo una nota de estado como "Última ejecución a las 19:47"; admite [casillas interactivas](../nodes/chart-output-node.md#interactive-task-lists) cuando el markdown es estático, y [listas numeradas explícitas](../nodes/chart-output-node.md#numbered-lists) para numeración personalizada o descendente)
- **HITL** (sus revisiones humanas pendientes. El encabezado muestra `1/n pendientes`. El nombre del workflow abre esa ejecución en el canvas. **Approve**, **Request changes** y **Reject** la resuelven. El icono de historial junto al título del widget abre esa ejecución en el diálogo de historial de esta página. El widget no utiliza filas de entrada, y cada persona ve su propia cola)

Cada widget carga sus datos de forma asíncrona al abrir la pestaña, de modo que la página permanece ágil mientras los gráficos se completan.

## Añadir un widget

1. Haga clic en **Add widget**, asígnele un título y elija un tipo de gráfico. Debajo del selector, el diálogo dibuja un ejemplo de ese tipo de gráfico con datos de muestra y nombra las filas que espera, de modo que es posible comparar tipos antes de construir nada.
2. El widget se abre en el editor de workflows con un grafo inicial: un nodo [Set](../nodes/set-node.md) que produce las filas, conectado a un nodo [Chart Output](../nodes/chart-output-node.md). Sustituya el nodo Set por cualquier fuente de datos. Un widget **HITL** es únicamente el nodo Chart Output; lee sus revisiones pendientes y no necesita una fuente de datos.
3. Construya el workflow de modo que el nodo que alimenta a **Chart Output** produzca un array de filas y, a continuación, configure el mapeo de campos del nodo Chart Output (campo de etiqueta, campo de valor, etc.).
4. Guarde, vuelva a la pestaña Dashboard y el widget se renderizará.

Haga doble clic en un widget (o utilice su botón de edición) para reabrir su workflow en cualquier momento. Utilice **Clone widget** en el encabezado del widget para duplicar tanto el widget como su workflow completo. La copia se coloca debajo del original y se etiqueta con **(Copy)** para poder editarla de forma independiente.

## Generar un widget con IA

Haga clic en **AI**, describa la métrica deseada (por ejemplo, "tasa de éxito de workflows durante los últimos 30 días como gráfico de barras") y elija una credencial de LLM y un modelo. Heym genera un workflow de widget completo que termina en un nodo Chart Output y lo añade a la cuadrícula. Consulte [Chart Output](../nodes/chart-output-node.md#example-ai-prompts) para ver prompts de ejemplo por tipo de gráfico.

Utilice el botón **Fine-tune with AI** de un widget para revisar un widget existente con una nueva instrucción. Cada ajuste con IA guarda una instantánea del workflow anterior en el **Edit History** del widget, de modo que es posible revisar o revertir cambios desde el editor de workflows.

## Editar el diseño

Active **Edit** para entrar en el modo de edición, donde es posible arrastrar widgets y redimensionarlos sobre una cuadrícula de 12 columnas. Los cambios de diseño se guardan automáticamente. Los títulos de los widgets son editables en línea desde el encabezado del widget.

## Caché y actualización

Cada widget almacena en caché en el servidor sus últimos datos calculados durante un tiempo de vida (TTL) configurable. Mientras la caché esté vigente, reabrir el dashboard sirve el resultado almacenado en lugar de volver a ejecutar el workflow. La caché se reemplaza en el mismo lugar cada vez que se recalculan los datos (una caché por widget) y se invalida automáticamente al editar el workflow del widget.

Utilice el botón **Refresh** de un widget (o **Refresh** en la barra de herramientas) para omitir la caché y recalcular de inmediato.

## Compartir

Los propietarios comparten un dashboard desde su configuración, con usuarios individuales (por correo electrónico) o con cualquier [equipo](teams-tab.md) al que pertenezcan. Cada compartición es de tipo **Lectura** o **Escritura**; cuando alguien tiene tanto una compartición personal como una de equipo, se aplica la más permisiva.

| Acción | Propietario | Escritura | Lectura |
|--------|:-----:|:-----:|:----:|
| Ver widgets, actualizarlos, usar la actualización automática | ✓ | ✓ | ✓ |
| Añadir, clonar, eliminar, renombrar y redimensionar widgets; generar y ajustar con IA; marcar elementos de la lista de verificación | ✓ | ✓ | |
| Abrir el workflow de un widget en el editor | ✓ | ✓ | |
| Renombrar o eliminar el dashboard, gestionar la compartición | ✓ | | |

**Los widgets siempre se ejecutan como el propietario del dashboard.** Independientemente de quién esté visualizando, un widget utiliza las credenciales y las variables globales del propietario, y sus ejecuciones aparecen en el historial de ejecuciones y las trazas del propietario. Por lo tanto, los miembros del equipo ven los mismos datos sin acceso a las cuentas subyacentes, y todos los espectadores comparten el único resultado en caché por widget. Los widgets que añade o clona un colaborador con permiso de escritura también pertenecen al propietario.

Por este motivo, **Escritura** conlleva la misma confianza que compartir un workflow para su edición: un colaborador con acceso de escritura puede modificar lo que se ejecuta con sus credenciales. Concédalo únicamente a personas a las que permitiría editar sus workflows. Una ejecución de prueba que un colaborador inicie desde el editor de workflows utiliza sus propias credenciales, como ocurre con cualquier workflow compartido; solo el dashboard en sí se ejecuta como el propietario. **Lectura** no otorga acceso a los workflows de los widgets, y los espectadores de solo lectura reciben el gráfico en sí, pero no los detalles de ejecución por nodo que lo sustentan.

Eliminar una compartición, o reducirla de escritura a lectura, surte efecto de inmediato.

## Relacionado

- [Nodo Chart Output](../nodes/chart-output-node.md)
- [Pestaña Analytics](analytics-tab.md) — métricas de ejecución integradas (distintas de los dashboards creados por el usuario)
