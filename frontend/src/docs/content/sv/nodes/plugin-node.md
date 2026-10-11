# Plugin-nod

**Plugin**-noden kör en anpassad åtgärd som tillhandahålls av ett installerat plugin. Plugin utökar Heym med nya nodtyper — åtgärder, tredjepartsintegrationer eller vad som helst som kan uttryckas i Python — utan att ändra kärnapplikationen.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1 |
| Utdata | `$nodeLabel.<keys returned by the plugin>` |

Ett plugin-**paket** (en zip-fil) kan innehålla **flera noder** — valfri kombination av åtgärder och triggers. Varje nod visas i paletten under **Plugins** med sitt eget namn och sin egen beskrivning. När en nod dras till canvas skapas en Plugin-nod som är bunden till det paketet (`pluginId`) och den noden (`pluginNodeKey`).

## När den ska användas

En Plugin-nod används när en operatör har installerat ett plugin som utför den önskade åtgärden — till exempel anrop av ett privat API, kommunikation med ett internt system eller körning av skräddarsydd logik skriven för den aktuella driftsättningen.

För trigger-baserade plugin som startar en workflow, se
[Plugin Trigger-noden](./plugin-trigger-node.md).

## Konfiguration

Nodens konfigurationsformulär genereras från pluginets manifest. Varje fält som deklareras av pluginets (`string`, `number`, `boolean` eller `select`) renderas automatiskt. Icke-hemliga strängfält använder uttrycksinmatning, och sparade strängkonfigurationsvärden som börjar med `$` löses upp innan pluginets hanterare körs.

Hemliga fält (som API-nycklar) maskeras i gränssnittet och skrivs aldrig till loggar.

## Hur plugin körs

Plugin levereras av Heym och installeras av en operatör, så plugin-kod är **betrodd** och körs i processen som en inbyggd nod, med full nätverks- och biblioteksåtkomst. Ett plugin kan deklarera pip-`dependencies` som installeras i instansen vid installationstillfället.

Installation och borttagning av plugin är begränsad till operatörer vars e-postadress finns i `HEYM_PLUGIN_ADMIN_EMAILS`, och hela delsystemet styrs av `HEYM_PLUGINS_ENABLED` (inaktiverat som standard). Se
[Körning och driftsättning](../getting-started/running-and-deployment.md) för miljövariablerna.

## Anpassade ikoner

Ett plugin kan innehålla anpassade SVG-logotyper. Placera en `icon.svg` i paketets rot för att ange en standard för varje nod, och/eller ge en nod sin egen `"icon": "<file>.svg"` i manifestet. Ikonen visas både på palettkortet och på canvas-noden; noder utan ikon faller tillbaka till standardikonen med pusselbit.

## AI Builder

Installerade plugin exponeras för AI-assistenten och chat-canvas, så det går att be Heym att "använda Acme CRM-plugin för att skapa en post" och den genererar Plugin-noden med rätt `pluginId` och `config`.

## Skapa plugin

För att bygga ett plugin-paket, se
[Plugin-författande](../reference/plugin-authoring.md) för zip-layout, manifestfält, hanterarsignaturer, ikoner, beroenden och runtime-förtroendemodell.
