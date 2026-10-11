# Plugin-node

De **Plugin**-node voert een aangepaste actie uit die wordt geleverd door een geïnstalleerde plugin. Plugins breiden Heym uit met nieuwe node-typen — acties, integraties met derden of alles wat in Python uitdrukbaar is — zonder dat de kernapplicatie hoeft te worden gewijzigd.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Uitvoer | `$nodeLabel.<keys returned by the plugin>` |

Een plugin-**pakket** (één zip) kan **meerdere nodes** bevatten — elke combinatie van acties en triggers. Elke node verschijnt in het palet onder **Plugins** met een eigen naam en beschrijving. Wanneer u er een naar het canvas sleept, wordt een Plugin-node aangemaakt die aan dat pakket (`pluginId`) en die node (`pluginNodeKey`) is gekoppeld.

## Wanneer te gebruiken

Gebruik een Plugin-node wanneer een beheerder een plugin heeft geïnstalleerd die de gewenste actie uitvoert — bijvoorbeeld het aanroepen van een private API, het communiceren met een intern systeem of het uitvoeren van specifieke logica die voor uw implementatie is geschreven.

Voor trigger-style plugins die een workflow starten, zie de
[Plugin Trigger-node](./plugin-trigger-node.md).

## Configuratie

Het configuratieformulier van de node wordt gegenereerd op basis van het manifest van de plugin. Elk veld dat door de plugin wordt gedeclareerd (`string`, `number`, `boolean` of `select`) wordt automatisch weergegeven. Niet-geheime stringvelden gebruiken de expressie-invoer, en opgeslagen stringconfiguratiewaarden die met `$` beginnen, worden omgezet voordat de plugin-handler wordt uitgevoerd.

Geheime velden (zoals API-sleutels) worden in de UI gemaskeerd en nooit naar logs geschreven.

## Hoe plugins worden uitgevoerd

Plugins worden geleverd door Heym en geïnstalleerd door een beheerder, dus plugin-code is **vertrouwd** en wordt in-process uitgevoerd, net als een ingebouwde node, met volledige netwerk- en bibliotheektoegang. Een plugin kan pip-`dependencies` declareren die tijdens de installatie in de instantie worden geïnstalleerd.

Het installeren en verwijderen van plugins is beperkt tot beheerders wier e-mailadres in `HEYM_PLUGIN_ADMIN_EMAILS` staat, en het volledige subsysteem wordt beheerd via `HEYM_PLUGINS_ENABLED` (standaard uitgeschakeld). Zie
[Running & Deployment](../getting-started/running-and-deployment.md) voor de omgevingsvariabelen.

## Aangepaste pictogrammen

Een plugin kan aangepaste SVG-logo's bevatten. Plaats een `icon.svg` in de hoofdmap van het pakket om een standaard voor elke node in te stellen, en/of geef een node een eigen `"icon": "<file>.svg"` in het manifest. Het pictogram wordt zowel op de paletkaart als op de canvas-node weergegeven; nodes zonder pictogram vallen terug op het standaard puzzelstukje.

## AI Builder

Geïnstalleerde plugins worden beschikbaar gesteld aan de AI-assistent en het chat-canvas, zodat u Heym kunt vragen om "de Acme CRM-plugin te gebruiken om een record aan te maken" en het de Plugin-node met de juiste `pluginId` en `config` genereert.

## Plugins authoring

Zie voor het bouwen van een plugin-pakket
[Plugin Authoring](../reference/plugin-authoring.md) voor de zip-indeling, manifestvelden, handler-signaturen, pictogrammen, dependencies en het runtime-vertrouwensmodel.
