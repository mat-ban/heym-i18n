# Plugin Trigger-nod

**Plugin Trigger**-noden är trigger-motsvarigheten till
[Plugin-noden](./plugin-node.md). Den tillhandahålls av ett installerat plugin vars
`kind` är `trigger` och producerar de initiala data som ett workflow startar från.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Ingångar | 0 |
| Utgångar | 1 |
| Utgång | `$nodeLabel.<keys returned by the plugin>` |

Ett trigger-plugin kan representera vilken källa som helst — en annan applikation, en
tredjepartstjänst eller en annan teknik — så länge som pluginets hanterare returnerar de data
som workflowet ska börja med.

## När det ska användas

Använd en Plugin Trigger-nod när ett installerat plugin definierar en trigger som startar
workflowet. För plugin som utför en åtgärd mitt i ett workflow, använd
[Plugin-noden](./plugin-node.md) i stället.

## Konfiguration

Liksom för Plugin-noden genereras konfigurationsformuläret från pluginets
manifestfält. Icke-hemliga strängfält använder uttrycksinmatningen och hemliga
fält maskeras.

## Hur plugin körs

Plugin-kod är betrodd (levererad av Heym, installerad av operatör) och körs i processen.
Installation är begränsad till `HEYM_PLUGIN_ADMIN_EMAILS` och delsystemet
styrs av `HEYM_PLUGINS_ENABLED`. Se
[Köra & Driftsätta](../getting-started/running-and-deployment.md).

## Skapa plugin

För att bygga ett trigger-plugin-paket, se
[Plugin Authoring](../reference/plugin-authoring.md) för zip-layout,
manifestfält, hanterarsignaturer, ikoner, beroenden och runtime-förtroendemodell.
