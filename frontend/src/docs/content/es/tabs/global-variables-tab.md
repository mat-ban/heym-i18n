# Pestaña Variables

La pestaña **Variables** gestiona el **Almacén global de variables**: datos persistentes de clave-valor compartidos entre todos sus workflows.

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Ver demostración de Variables</a></p>

## Descripción general

- Cree, edite y elimine variables globales
- Las variables están vinculadas al usuario y persisten entre ejecuciones de workflows
- Referencie en expresiones mediante `$global.variableName`

## Crear una variable

1. Haga clic en **Nueva variable**
2. Introduzca un **nombre** (utilizado en expresiones)
3. Defina el **valor** (string, number, boolean, array u object)
4. Elija el **tipo de valor** (Auto, String, Number, Boolean, Array, Object)

## Editar y eliminar

- **Editar** – Haga clic en el icono de edición de la fila de la variable
- **Eliminar** – Haga clic en el icono de papelera; los workflows que la utilicen necesitarán un reemplazo
- **Eliminación masiva** – Seleccione varias variables y use **Eliminar seleccionadas**

## Uso en workflows

Referencie variables en cualquier expresión:

```
$global.environment
$global.settings.baseUrl
```

También puede definir variables globales desde un [Nodo de variable](../nodes/variable-node.md) habilitando **Store in Global Variable Store**.

## Relacionado

- [Variables globales](../reference/global-variables.md) – Guía de referencia
- [Nodo de variable](../nodes/variable-node.md) – Defina variables con `isGlobal`
- [Expression DSL](../reference/expression-dsl.md) – Sintaxis `$global`
- [Pestaña Chat](./chat-tab.md) – El Chat puede acceder a las variables globales
- [Contextual Showcase](../reference/contextual-showcase.md) – Guía compacta de páginas para las superficies del panel
