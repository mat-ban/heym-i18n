# Atajos de teclado

Heym proporciona atajos de teclado en el editor de workflows y el canvas para acelerar las acciones comunes.

## Atajos globales del editor

Estos atajos están activos en cualquier parte del editor de workflows.

| Atajo | Acción |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | Abrir la Paleta de comandos |
| `Ctrl + I` / `Cmd + I` | Alternar el panel del [Asistente de IA](./ai-assistant.md) (funciona mientras escribe) |
| `Ctrl + Enter` / `Cmd + Enter` | Ejecutar el workflow actual |
| `Ctrl + S` / `Cmd + S` | Guardar el workflow |
| `Ctrl + Z` / `Cmd + Z` | Deshacer |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | Rehacer |
| `Ctrl + Y` / `Cmd + Y` | Rehacer (alternativo) |
| `Escape` | Cerrar superposiciones, diálogos y paneles abiertos |

## Atajos del canvas

Estos atajos se aplican cuando el canvas tiene el foco (no hay ninguna entrada de texto activa).

### Selección y navegación

| Atajo | Acción |
|----------|--------|
| `Ctrl + A` / `Cmd + A` | Seleccionar todos los nodos |
| `Shift` (mantener) | Arrastrar para seleccionar varios nodos |
| `Ctrl` / `Cmd` (mantener) | Hacer clic para añadir nodos individuales a la selección |
| `Escape` | Deseleccionar todos los nodos; cerrar la búsqueda de nodos en línea |

### Edición de nodos

| Atajo | Acción |
|----------|--------|
| `Ctrl + C` / `Cmd + C` | Copiar el nodo o nodos seleccionados |
| `Ctrl + X` / `Cmd + X` | Cortar el nodo o nodos seleccionados |
| `Ctrl + V` / `Cmd + V` | Pegar el nodo o nodos |
| `Delete` o `Backspace` | Eliminar el nodo o nodos y/o las conexiones seleccionadas |
| `D` | Alternar el estado habilitado / deshabilitado del nodo o nodos seleccionados |
| `P` | Alternar los datos fijados en el nodo seleccionado |

### Búsqueda de nodos en línea

Al escribir cualquier carácter imprimible en el canvas (cuando no hay ninguna entrada de texto con el foco), se abre la ventana emergente de búsqueda de nodos en línea. El carácter escrito se convierte en el primer carácter de la consulta de búsqueda.

| Atajo | Acción |
|----------|--------|
| Cualquier carácter imprimible | Abrir la búsqueda de nodos en línea y comenzar a escribir |
| `Backspace` | Eliminar el último carácter de la consulta de búsqueda |
| `Escape` | Cerrar la búsqueda de nodos en línea |

## Paleta de comandos (`Ctrl + K`)

La Paleta de comandos está disponible desde el editor, el panel de control, la documentación y las vistas de evaluaciones. Permite navegar rápidamente a workflows, pestañas y páginas de documentación sin abandonar el teclado.

| Atajo | Acción |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | Abrir la Paleta de comandos |
| `↑` / `↓` | Navegar por la lista de resultados |
| `Tab` / `Shift + Tab` | Navegar por la lista de resultados |
| `Enter` | Abrir el elemento seleccionado |
| `Escape` | Cerrar la paleta |

## Atajos del panel de control

Estos atajos están activos en la pestaña Workflows cuando no hay ninguna otra entrada de texto activa.

| Atajo | Acción |
|----------|--------|
| `Ctrl + F` / `Cmd + F` | Enfocar la búsqueda de workflows |
| `Escape` | Borrar la búsqueda de workflows cuando contiene texto |

## Atajos del panel de propiedades

Estos atajos están activos mientras hay un nodo seleccionado y el panel de propiedades está abierto.

| Atajo | Acción |
|----------|--------|
| `Ctrl + Shift + O` / `Cmd + Shift + O` | Abrir el sub-workflow vinculado en una nueva pestaña (solo Nodo Execute) |

## Atajos del diálogo Evaluar

Estos atajos están activos mientras el diálogo Evaluar está abierto.

| Atajo | Acción |
|----------|--------|
| `Ctrl + Enter` / `Cmd + Enter` | Aplicar la expresión y cerrar el diálogo |
| `Ctrl + Z` / `Cmd + Z` | Deshacer cambios en el editor de expresiones |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | Rehacer cambios en el editor de expresiones |
| `Ctrl + Y` / `Cmd + Y` | Rehacer cambios en el editor de expresiones (alternativo) |

## Atajos de Historial y Trazas

Estos atajos están disponibles en el diálogo Historial de ejecuciones y en el panel Trazas.

| Atajo | Acción |
|----------|--------|
| `S` | Alternar la entrada de búsqueda para filtrar entradas |

## Relacionado

- [Funciones del canvas](./canvas-features.md) – Data pin, habilitar/deshabilitar, extraer a sub-workflow
- [Estructura del workflow](./workflow-structure.md) – Formato de nodos y conexiones
- [Nodo Execute](../nodes/execute-node.md) – Llama a sub-workflows (`Ctrl + Shift + O`)
- [Inicio rápido](../getting-started/quick-start.md) – Cree su primer workflow