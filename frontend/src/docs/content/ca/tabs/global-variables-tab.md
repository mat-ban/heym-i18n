# Pestanya Variables

La pestanya **Variables** gestiona el **Global Variable Store** – dades persistents de tipus clau-valor compartides entre tots els vostres workflows.

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Watch Variables demo</a></p>

## Visió general

- Creeu, editeu i suprimiu variables globals
- Les variables són d'abast d'usuari i persisteixen entre execucions de workflow
- Referencieu-les en expressions mitjançant `$global.variableName`

## Crear una variable

1. Feu clic a **New Variable**
2. Introduïu un **nom** (utilitzat en expressions)
3. Definiu el **valor** (string, number, boolean, array o object)
4. Trieu el **tipus de valor** (Auto, String, Number, Boolean, Array, Object)

## Editar i suprimir

- **Editar** – Feu clic a la icona d'edició d'una fila de variable
- **Suprimir** – Feu clic a la icona de paperera; els workflows que la utilitzin necessitaran un reemplaçament
- **Supressió massiva** – Seleccioneu diverses variables i utilitzeu **Delete selected**

## Ús en workflows

Referencieu variables en qualsevol expressió:

```
$global.environment
$global.settings.baseUrl
```

També podeu definir variables globals des d'un [Variable node](../nodes/variable-node.md) activant **Store in Global Variable Store**.

## Relacionat

- [Global Variables](../reference/global-variables.md) – Guia de referència
- [Variable Node](../nodes/variable-node.md) – Definiu variables amb `isGlobal`
- [Expression DSL](../reference/expression-dsl.md) – Sintaxi `$global`
- [Chat Tab](./chat-tab.md) – El xat pot accedir a les variables globals
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia compacta de pàgina per a superfícies de tauler
