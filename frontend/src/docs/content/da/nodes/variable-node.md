# Variabel

**Variabel**-noden angiver eller opdaterer en variabel, der kan tilgås fra enhver node via `$vars.variabelnavn` (workflow-lokal) eller `$global.variabelnavn` (vedvarende). Anvendes til tællere, akkumulerede lister og delt tilstand på tværs af workflowet.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.value`, eller adgang via `$vars.variabelnavn` / `$global.variabelnavn` |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `label` | string | Node-identifikator (camelCase) |
| `variableName` | string | Variabelnavn (anvendes som `$vars.variabelnavn` eller `$global.variabelnavn`). Undgå [reserverede navne](../reference/expression-dsl.md). |
| `variableValue` | expression | Værdi der skal angives. Understøtter udtryk. |
| `variableType` | `"auto"` \| `"string"` \| `"number"` \| `"boolean"` \| `"array"` \| `"object"` | Typekonvertering (standard: auto) |
| `isGlobal` | boolean | Når `true`, gemmes i [Global Variabel-lager](../reference/global-variables.md) (vedvarende, bruger-scopet). Når `false` eller udeladt, workflow-lokal (i hukommelsen). |

## Array-variabler

Initialiser arrays med `$array()` eller `$array("a", "b")` i en Variabel-node før brug af `.add()`:

```json
{"variableName": "items", "variableValue": "$array()", "variableType": "array"}
```

Tilføj herefter elementer (uden `$` inden i parenteser):

```json
{"variableName": "items", "variableValue": "$vars.items.add(loopNode.item)", "variableType": "array"}
```

## Kritisk regel

**Brug aldrig `$` inden i metode-parenteser:**

- ✅ `$vars.minArray.add(forrigeNode.tekst)`
- ❌ `$vars.minArray.add($forrigeNode.tekst)` – ødelægger udtrykket

## Eksempel – Tæller

```json
{
  "type": "variable",
  "data": {
    "label": "inkrementerTæller",
    "variableName": "tæller",
    "variableValue": "$vars.tæller + 1",
    "variableType": "number"
  }
}
```

## Relateret

- [Node-typer](../reference/node-types.md) – Oversigt over alle node-typer
- [Loop-node](./loop-node.md) – Saml elementer med Variabel i loop-krop
- [Expression DSL](../reference/expression-dsl.md) – `$vars`, `$global`, reserverede navne
- [Globale variabler](../reference/global-variables.md) – Vedvarende variabler med `isGlobal`
