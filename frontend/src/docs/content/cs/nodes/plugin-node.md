# Uzel Plugin

Uzel **Plugin** spouští vlastní akci poskytovanou nainstalovaným pluginem. Pluginy
rozšiřují Heym o nové typy uzlů — akce, integrace třetích stran nebo cokoli
vyjádřitelného v Pythonu — bez nutnosti upravovat jádro aplikace.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.<keys returned by the plugin>` |

Jeden plugin **balíček** (jeden zip) může obsahovat **více uzlů** — libovolnou
kombinaci akcí a triggerů. Každý uzel se zobrazuje v paletě pod **Plugins** s
vlastním názvem a popisem. Přetažením uzlu na canvas se vytvoří uzel Plugin
navázaný na daný balíček (`pluginId`) a uzel (`pluginNodeKey`).

## Kdy použít

Uzel Plugin použijte, když operátor nainstaloval plugin, který provádí požadovanou
akci — například volání privátního API, komunikaci s interním systémem nebo
spuštění logiky napsané na míru pro Vaše nasazení.

Pro pluginy typu trigger, které spouštějí workflow, viz
[Uzel Plugin Trigger](./plugin-trigger-node.md).

## Konfigurace

Konfigurační formulář uzlu je generován z manifestu pluginu. Každé pole
deklarované pluginem (`string`, `number`, `boolean` nebo `select`) je vykresleno
automaticky. Ne-tajná textová pole používají vstup pro výrazy a uložené textové
konfigurační hodnoty začínající znakem `$` jsou před spuštěním handleru pluginu
vyhodnoceny.

Tajná pole (například API klíče) jsou v UI maskována a nikdy se nezapisují do
logů.

## Jak pluginy běží

Pluginy dodává Heym a instaluje je operátor, proto je kód pluginu **důvěryhodný**
a běží v procesu stejně jako vestavěný uzel, s plným přístupem k síti a
knihovnám. Plugin může deklarovat pip `dependencies`, které se při instalaci
nainstalují do instance.

Instalace a odebrání pluginů je omezeno na operátory, jejichž e-mail je uveden v
`HEYM_PLUGIN_ADMIN_EMAILS`, a celý subsystém je řízen proměnnou
`HEYM_PLUGINS_ENABLED` (ve výchozím stavu zakázáno). Viz
[Provoz a nasazení](../getting-started/running-and-deployment.md) pro
environment variables.

## Vlastní ikony

Plugin může obsahovat vlastní SVG loga. Umístěte `icon.svg` do kořene balíčku pro
nastavení výchozí ikony všech uzlů a/nebo přiřaďte uzlu vlastní
`"icon": "<file>.svg"` v manifestu. Ikona se zobrazuje jak na kartě v paletě, tak
na uzlu na canvasu; uzly bez ikony používají výchozí glyf ve tvaru puzzle.

## AI Builder

Nainstalované pluginy jsou zpřístupněny AI asistentovi a chat canvasu, takže
můžete Heym požádat například „použij plugin Acme CRM k vytvoření záznamu“ a
Heym vygeneruje uzel Plugin se správným `pluginId` a `config`.

## Tvorba pluginů

Chcete-li vytvořit balíček pluginu, viz
[Tvorba pluginů](../reference/plugin-authoring.md) pro strukturu zipu,
pole manifestu, signatury handlerů, ikony, závislosti a model důvěry za běhu.
