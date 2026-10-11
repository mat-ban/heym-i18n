# Historial

El Historial realiza un seguimiento de las versiones guardadas de un workflow. Utilícelo para ver los cambios a lo largo del tiempo, comparar versiones o revertir a un estado anterior.

**Nota:** El Historial es diferente del [Historial de ejecuciones](./execution-history.md). El Historial realiza un seguimiento de los **guardados** (cambios en la estructura del workflow); el Historial de ejecuciones realiza un seguimiento de las **ejecuciones** (ejecuciones pasadas).

## Dónde encontrarlo

**Barra de herramientas del editor** → **Historial** (icono GitBranch)

## Versiones

Se crea una nueva versión cada vez que **guarda** el workflow. La lista muestra:

- **Actual** – El último estado guardado (lo que ve en el canvas)
- **Versión N** – Guardados anteriores con marcas de tiempo

Las versiones sin cambios respecto a la anterior se ocultan.

## Vista de diferencias

Seleccione una versión para ver qué cambió respecto al workflow actual:

| Tipo de cambio | Descripción |
|-------------|--------------|
| **Nodos** | Nodos añadidos, eliminados o modificados |
| **Conexiones** | Conexiones añadidas, eliminadas o modificadas |
| **Config** | Ajustes a nivel de workflow (auth, límites de tasa, etc.) |

Expanda cada cambio para ver las diferencias a nivel de campo (por ejemplo, qué propiedades del nodo cambiaron).

## Vista previa

Para ver cómo era el workflow en una versión anterior, haga clic en **Vista previa** junto a Revertir.

Se abre un canvas de solo lectura que muestra los nodos y las conexiones de esa versión. Puede desplazarse y hacer zoom para explorar el diseño; no se pueden realizar cambios desde esta vista.

## Revertir

Para restaurar una versión anterior:

1. Seleccione la versión que desea
2. Haga clic en **Revertir**
3. Confirme la acción
4. El workflow actual se reemplaza por la versión seleccionada; la página se recarga

Revertir crea un nuevo estado "actual": puede revertir de nuevo si es necesario.

## Borrar historial

Haga clic en el icono de papelera en el encabezado del diálogo para eliminar todo el historial de versiones. Esta acción no se puede deshacer. El workflow actual permanece; solo se eliminan las versiones anteriores.

## Cuándo se crean las versiones

Las versiones se crean solo cuando **guarda** (Ctrl/Cmd+S o el botón Guardar). Los cambios sin guardar no se almacenan en el Historial hasta que guarde.

Las ediciones de skills del Agent se incluyen en estas instantáneas. Para explorar o restaurar un único skill sin revertir todo el workflow, utilice el botón **Historial** en la tarjeta de ese skill en el panel de propiedades del Nodo Agent. Consulte [Nodo Agent](../nodes/agent-node.md#skill-history).

## Relacionado

- [Historial de ejecuciones](./execution-history.md) – Ejecuciones pasadas y Bring to Canvas
- [Estructura del workflow](./workflow-structure.md) – Formato de nodos y conexiones
- [Pestaña Workflows](../tabs/workflows-tab.md) – Crear y gestionar workflows