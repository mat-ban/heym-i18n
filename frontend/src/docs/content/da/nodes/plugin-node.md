# Plugin Node

**Plugin**-noden kører en brugerdefineret handling leveret af et installeret plugin. Plugins
udvider Heym med nye nodetyper — handlinger, tredjepartsintegrationer eller alt hvad der
kan udtrykkes i Python — uden at ændre kerneapplikationen.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.<nøgler returneret af pluginet>` |

En plugin-**pakke** (én zip-fil) kan indeholde **flere noder** — enhver kombination af handlinger
og triggers. Hver node vises i paletten under **Plugins** med eget navn og beskrivelse. Ved at trække en node
på canvas oprettes en Plugin-node bundet til den pågældende pakke (`pluginId`) og node (`pluginNodeKey`).

## Anvendelsestilfælde

Plugin-noden anvendes, når en operator har installeret et plugin, der udfører den ønskede handling
— f.eks. at kalde en privat API, kommunikere med et internt system eller køre skræddersyet logik skrevet til installationen.

For trigger-styrede plugins, der starter et workflow, se
[Plugin Trigger node](./plugin-trigger-node.md).

## Konfiguration

Nodens konfigurationsformular genereres fra plugin-manifestet. Hvert felt
deklareret af pluginet (`string`, `number`, `boolean` eller `select`) vises
automatisk. Ikke-hemmelige strengfelter bruger expressions-input, og gemte
strengkonfigurationsværdier, der starter med `$`, løses før plugin-handleren
kører.

Hemmelige felter (såsom API-nøgler) maskeres i brugergrænsefladen og skrives aldrig til logs.

## Kørsel af Plugins

Plugins leveres af Heym og installeres af en operator, så plugin-kode er
**betroet** og kører in-proces som en indbygget node med fuld netværks- og
biblioteksadgang. Et plugin kan deklarere pip-`dependencies`, der installeres
på instansen under installationen.

Installation og fjernelse af plugins er begrænset til operatorer, hvis email er
listet i `HEYM_PLUGIN_ADMIN_EMAILS`, og hele subsystemet er kontrolleret af
`HEYM_PLUGINS_ENABLED` (deaktiveret som standard). Se
[Running & Deployment](../getting-started/running-and-deployment.md) for
miljøvariablerne.

## Brugerdefinerede Ikoner

Et plugin kan levere brugerdefinerede SVG-logoer. Placér en `icon.svg` i pakkens rod for at angive et
standardikon for alle noder, og/eller angiv et nodespecifikt `"icon": "<fil>.svg"` i
manifestet. Ikonet vises både på palettekortet og canvas-noden; noder
uden ikon bruger standard puslespils-glyffen som fallback.

## AI Builder

Installerede plugins vises til AI-assistenten og chat-canvas, så det er muligt at bede
Heym om at "brug Acme CRM-pluginet til at oprette en post", hvorefter det genererer
Plugin-noden med korrekt `pluginId` og `config`.

## Udvikling af Plugins

For at bygge en plugin-pakke, se
[Plugin Authoring](../reference/plugin-authoring.md) for zip-layout,
manifestfelter, handler-signaturer, ikoner, afhængigheder og runtime-tillidsmodel.
