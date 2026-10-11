# Pestaña Templates

La pestaña Templates permite guardar, explorar y reutilizar workflows completos y nodos individuales. Comparta algo que haya creado una vez y aplíquelo a nuevos proyectos con un solo clic.

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Ver la demo de Templates</a></p>

## Descripción general

Existen dos tipos de plantillas:

- **Plantillas de workflow** — guarde un workflow completo (todos los nodos y conexiones) como punto de partida reutilizable.
- **Plantillas de nodo** — guarde un único nodo configurado (por ejemplo, un Nodo LLM ajustado o un nodo HTTP personalizado) para reutilizarlo en distintos workflows.

Alterne entre ambos tipos mediante el conmutador **Workflows / Nodes** situado en la parte superior de la pestaña.

Utilice la barra de búsqueda para filtrar las plantillas visibles por nombre, descripción, etiquetas o tipo de nodo.

---

## Crear una plantilla

### Plantilla de workflow

1. Abra en el editor el workflow que desea compartir.
2. Haga clic en **Share as Template** en la barra de herramientas superior.
3. Complete el nombre, la descripción y las etiquetas opcionales.
4. Elija la visibilidad: **Everyone** (todos los usuarios) o **Specific users** (introduzca nombres de usuario y/o seleccione equipos).
5. Haga clic en **Share**. Una notificación verde confirma la operación.

### Plantilla de nodo

1. Haga clic con el botón derecho en cualquier nodo del canvas.
2. Seleccione **Share as Template** en el menú contextual.
3. Complete el formulario y haga clic en **Share**.

---

## Usar una plantilla

### Plantilla de workflow

1. Abra la pestaña **Templates** y asegúrese de que **Workflows** esté seleccionado.
2. Haga clic en una tarjeta para previsualizarla, o haga clic directamente en **Use**.
3. El workflow se clona en un nuevo workflow que se abre en el editor.

### Plantilla de nodo

1. Abra la pestaña **Templates** y seleccione **Nodes**.
2. Haga clic en **Use** en la tarjeta de una plantilla de nodo.
3. Aparecerá un cuadro de diálogo — elija dónde añadir el nodo:
   - **New workflow** — crea un workflow nuevo que contiene únicamente este nodo.
   - **Existing workflow** — seleccione uno de su lista de workflows; el nodo se inserta automáticamente al abrir el editor.

---

## Previsualización

Haga clic en cualquier tarjeta de plantilla para abrir una previsualización completa:

- **Miniaturas de las tarjetas** — las tarjetas de plantilla muestran una instantánea ajustada del canvas en modo solo lectura, tanto para workflows como para plantillas de un solo nodo.
- **Plantillas de workflow** — un canvas de solo lectura que coincide con el estilo de previsualización del historial de edición, incluido el desplazamiento y el zoom.
- **Plantillas de nodo** — el nodo guardado se abre en el mismo canvas de solo lectura como previsualización de un único nodo.
- **Detalles del nodo** — haga clic en cualquier nodo de la previsualización para inspeccionar su configuración guardada en el panel lateral.
- Las etiquetas, el recuento de usos y el **propietario** se muestran para todas las plantillas.

Pulse **ESC** o haga clic fuera para cerrar la previsualización.

---

## Gestionar plantillas

- **Editar** – Si es el propietario de la plantilla, pase el cursor sobre la tarjeta y haga clic en el icono del lápiz para actualizar su nombre, descripción, etiquetas o visibilidad
- **Eliminar** – Si es el propietario de la plantilla, pase el cursor sobre la tarjeta y elimine la plantilla tras el mensaje de confirmación
- **Acciones exclusivas del propietario** – Los controles de edición y eliminación solo se muestran para las plantillas que usted haya creado

---

## Paleta de comandos (CTRL+K)

Las plantillas (tanto de workflow como de nodo) se pueden buscar desde la paleta de comandos **CTRL+K**. Seleccione una plantilla para usarla de inmediato — las plantillas de workflow se abren en el editor y las plantillas de nodo solicitan un destino.

---

## Templates en el Chat

Puede formular preguntas a la IA sobre sus plantillas — conoce todas las plantillas de su espacio de trabajo.

---

## Visibilidad

| Ajuste | Quién puede verla |
|---|---|
| Everyone | Todos los usuarios de la plataforma |
| Specific users | Los usuarios que indique por nombre y/o los equipos que seleccione — todos los miembros del equipo obtienen acceso |

Al compartir con **Specific users**, puede añadir tanto usuarios individuales (por nombre) como equipos. Los miembros del equipo ven la plantilla en la pestaña Templates y pueden usarla.

---

## Relacionado

- [Teams](../reference/teams.md) – Compartir plantillas con equipos
- [Canvas Features](../reference/canvas-features.md)
- [Workflow Structure](../reference/workflow-structure.md)
- [Node Types](../reference/node-types.md)
- [Chat Tab](./chat-tab.md)
- [Contextual Showcase](../reference/contextual-showcase.md) – Guía breve de página para las pestañas del panel
