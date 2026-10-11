# Plugin Trigger Node

De **Plugin Trigger**-node is de trigger-tegenhanger van de
[Plugin-node](./plugin-node.md). Deze wordt geleverd door een geïnstalleerde plugin waarvan
de `kind` gelijk is aan `trigger`, en produceert de initiële gegevens waarmee een workflow start.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 0 |
| Uitvoer | 1 |
| Uitvoer | `$nodeLabel.<keys returned by the plugin>` |

Een trigger-plugin kan elke bron vertegenwoordigen — een andere applicatie, een externe
service of een andere technologie — zolang de handler van de plugin de gegevens retourneert
waarmee de workflow moet beginnen.

## Wanneer te gebruiken

Gebruik een Plugin Trigger-node wanneer een geïnstalleerde plugin een trigger definieert die
uw workflow start. Gebruik voor plugins die een actie midden in een workflow uitvoeren
in plaats daarvan de [Plugin-node](./plugin-node.md).

## Configuratie

Net als bij de Plugin-node wordt het configuratieformulier gegenereerd op basis van de
manifestvelden van de plugin. Niet-geheime tekenreeksvelden gebruiken de expressie-invoer en
geheime velden worden gemaskeerd.

## Hoe plugins worden uitgevoerd

Plugin-code is vertrouwd (geleverd door Heym, geïnstalleerd door de operator) en wordt
in-process uitgevoerd. Installatie is beperkt tot `HEYM_PLUGIN_ADMIN_EMAILS` en het
subsysteem wordt beheerd via `HEYM_PLUGINS_ENABLED`. Zie
[Running & Deployment](../getting-started/running-and-deployment.md).

## Plugins authoren

Zie voor het bouwen van een trigger-pluginpakket
[Plugin Authoring](../reference/plugin-authoring.md) voor de zip-indeling,
manifestvelden, handler-signaturen, pictogrammen, afhankelijkheden en het runtime-vertrouwensmodel.
