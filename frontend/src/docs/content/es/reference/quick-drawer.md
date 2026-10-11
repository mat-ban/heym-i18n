# Panel Rápido

El **Panel Rápido** es un panel lateral derecho de ejecución rápida para workflows. Aparece en las páginas autenticadas, como la [pestaña Workflows](../tabs/workflows-tab.md) del dashboard, Docs y Evaluaciones.

## Acceso

- Haga clic en el trigger fijo **Quick / Workflows** situado en el borde central derecho de la pantalla
- Cuando el [Contextual Showcase](./contextual-showcase.md) también esté disponible, su trigger **Page Guide** se sitúa por encima de Quick Workflows
- El panel se abre desde la derecha y desplaza la página actual hacia la izquierda con un sutil reescalado
- En dispositivos móviles, el Panel Rápido permanece oculto
- El panel no se muestra en el editor de workflows, en las páginas de inicio de sesión/registro, en el portal ni en las páginas de revisión HITL

## Búsqueda de Workflows

Utilice el campo de filtro situado en la parte superior del panel para buscar workflows por:

- Nombre del workflow
- Descripción del workflow

La búsqueda no distingue entre mayúsculas y minúsculas y actualiza la lista de inmediato.

## Workflows Fijados

Fije workflows para mantenerlos en la parte superior del panel.

- Los workflows fijados aparecen en su propia sección, por encima de la lista completa
- Las nuevas fijaciones se añaden en la parte superior
- El orden de las fijaciones se conserva entre recargas en el almacenamiento del navegador

## Ejecución de Workflows

Seleccione un workflow para abrir su formulario de entrada.

- Los campos de entrada se muestran verticalmente en el orden del panel
- Haga clic en **Run Workflow** para ejecutar el workflow seleccionado
- Haga clic en **Stop Workflow** para cancelar una ejecución en curso desde el panel
- Los workflows sin campos de entrada también se pueden ejecutar directamente

El panel utiliza la misma API de ejecución de workflows que otras superficies de ejecución de Heym, por lo que las salidas y el comportamiento en tiempo de ejecución se mantienen consistentes.

Detener una ejecución desde el panel también cancela la ejecución activa en el backend, incluido cualquier trabajo en curso del navegador Playwright para esa ejecución del workflow.

## Progreso y Resultados

Tras iniciar una ejecución, el panel muestra:

- Progreso de pasos en streaming para los nodos a medida que se inician y finalizan
- Estado final: `success`, `error` o `pending`
- Salidas finales en un panel JSON compacto
- Entradas del Historial etiquetadas con `Quick Drawer`

`pending` significa que el workflow está esperando una acción posterior, como una revisión humana.

## Almacenamiento del Navegador

El Panel Rápido almacena las preferencias personales en `localStorage`:

- IDs de workflows fijados
- Último workflow seleccionado

El panel **no** conserva los valores de entrada en esta versión.

## Alcance

El Panel Rápido es, de forma intencionada, una superficie de ejecución ligera.

- Incluido: búsqueda, fijación, selección, entrada, ejecución, progreso, resultado
- Excluido: creación y edición de workflows, gestión de carpetas y acciones del canvas

## Relacionado

- [Pestaña Workflows](../tabs/workflows-tab.md) – Lista principal de workflows, carpetas y gestión
- [Inicio Rápido](../getting-started/quick-start.md) – Cree y ejecute su primer workflow
- [Historial de Ejecución](./execution-history.md) – Revise las ejecuciones anteriores
- [Webhooks](./webhooks.md) – Ejecute workflows a través de HTTP
- [Contextual Showcase](./contextual-showcase.md) – Guía a nivel de página que complementa el Panel Rápido