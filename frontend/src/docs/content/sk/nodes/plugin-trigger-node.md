# Uzol Plugin Trigger

Uzol **Plugin Trigger** je triggerovou obdobou [uzla Plugin](./plugin-node.md). Poskytuje ho nainštalovaný plugin, ktorého `kind` je `trigger`, a vytvára počiatočné dáta, z ktorých workflow začína.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 0 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.<keys returned by the plugin>` |

Trigger plugin môže predstavovať ľubovoľný zdroj — inú aplikáciu, službu tretej strany alebo inú technológiu — pokiaľ handler pluginu vracia dáta, ktorými má workflow začať.

## Kedy použiť

Uzol Plugin Trigger použite vtedy, keď nainštalovaný plugin definuje trigger, ktorý spúšťa váš workflow. Pre pluginy, ktoré vykonávajú akciu uprostred workflow, použite namiesto toho [uzol Plugin](./plugin-node.md).

## Konfigurácia

Rovnako ako pri uzle Plugin sa konfiguračný formulár generuje z polí manifestu pluginu. Nereťazcové polia typu string používajú vstup pre výrazy a polia s citlivými údajmi sú maskované.

## Ako sa pluginy spúšťajú

Kód pluginu je dôveryhodný (dodaný spoločnosťou Heym, nainštalovaný operátorom) a spúšťa sa v rámci procesu. Inštalácia je obmedzená na `HEYM_PLUGIN_ADMIN_EMAILS` a subsystém je riadený cez `HEYM_PLUGINS_ENABLED`. Pozrite si [Spustenie a nasadenie](../getting-started/running-and-deployment.md).

## Tvorba pluginov

Ak chcete vytvoriť balík trigger pluginu, pozrite si [Tvorba pluginov](../reference/plugin-authoring.md), kde nájdete rozloženie zip archívu, polia manifestu, signatúry handlerov, ikony, závislosti a model dôveryhodnosti za behu.
