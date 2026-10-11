# Uzel Plugin Trigger

Uzel **Plugin Trigger** je triggerová varianta uzlu
[Plugin](./plugin-node.md). Poskytuje jej nainstalovaný plugin, jehož
`kind` je `trigger`, a vytváří počáteční data, ze kterých workflow začíná.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 0 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.<keys returned by the plugin>` |

Trigger plugin může představovat libovolný zdroj — jinou aplikaci, službu
třetí strany nebo jinou technologii — pokud handler pluginu vrací data,
se kterými má workflow začít.

## Kdy použít

Uzel Plugin Trigger použijte v případě, že nainstalovaný plugin definuje trigger, který spouští
Vaše workflow. Pro pluginy, které provádějí akci uprostřed workflow, použijte
místo toho uzel [Plugin](./plugin-node.md).

## Konfigurace

Stejně jako u uzlu Plugin je konfigurační formulář generován z polí
manifestu pluginu. Ne-tajná textová pole používají vstup pro výrazy a tajná
pole jsou maskována.

## Jak pluginy běží

Kód pluginu je důvěryhodný (dodaný společností Heym, nainstalovaný operátorem) a běží v rámci procesu.
Instalace je omezena na `HEYM_PLUGIN_ADMIN_EMAILS` a subsystém je
řízen pomocí `HEYM_PLUGINS_ENABLED`. Viz
[Running & Deployment](../getting-started/running-and-deployment.md).

## Vytváření pluginů

Chcete-li vytvořit balíček trigger pluginu, viz
[Plugin Authoring](../reference/plugin-authoring.md) pro strukturu zipu,
pole manifestu, signatury handlerů, ikony, závislosti a model důvěry za běhu.
