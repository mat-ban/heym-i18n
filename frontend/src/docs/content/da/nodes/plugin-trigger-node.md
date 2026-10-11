# Plugin Trigger Node

**Plugin Trigger**-noden er trigger-udgaven af [Plugin-noden](./plugin-node.md). Den leveres af et installeret plugin, hvis `kind` er `trigger`, og producerer de indledende data, som et workflow starter med.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 0 |
| Outputs | 1 |
| Output | `$nodeLabel.<nøgler returneret af pluginet>` |

Et trigger-plugin kan repræsentere enhver kilde - en anden applikation, en tredjepartstjeneste eller en anden teknologi - så længe pluginets handler returnerer de data, som workflowet skal starte med.

## Anvendelsestilfælde

Anvend en Plugin Trigger-node, når et installeret plugin definerer en trigger, der starter workflowet. For plugins, der udfører en handling midt i workflowet, skal der i stedet anvendes [Plugin-noden](./plugin-node.md).

## Konfiguration

Ligesom Plugin-noden genereres konfigurationsformularen fra plugin-manifestets felter. Ikke-hemmelige strengfelter bruger expressions-input, og hemmelige felter er maskerede.

## Kørsel af Plugins

Plugin-kode er betroet (Heym-leveret, operator-installeret) og kører in-process. Installation er begrænset til `HEYM_PLUGIN_ADMIN_EMAILS`, og subsystemet er beskyttet af `HEYM_PLUGINS_ENABLED`. Se [Kørsel & Deployment](../getting-started/running-and-deployment.md).

## Udvikling af Plugins

For at bygge en trigger-plugin-pakke skal der henvises til [Plugin-udvikling](../reference/plugin-authoring.md) for zip-struktur, manifestfelter, handler-signaturer, ikoner, afhængigheder og runtime-tillidsmodel.
