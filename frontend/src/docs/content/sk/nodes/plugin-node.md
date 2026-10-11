# Uzol Plugin

Uzol **Plugin** spúšťa vlastnú akciu poskytovanú nainštalovaným pluginom. Pluginy
rozširujú Heym o nové typy uzlov — akcie, integrácie tretích strán alebo čokoľvek,
čo je možné vyjadriť v Pythone — bez úpravy jadra aplikácie.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.<keys returned by the plugin>` |

**Balík** pluginu (jeden zip) môže obsahovať **viacero uzlov** — ľubovoľnú kombináciu
akcií a triggerov. Každý uzol sa zobrazuje v palete pod položkou **Plugins** s vlastným
názvom a popisom. Presunutím uzla na plátno sa vytvorí uzol Plugin naviazaný na
daný balík (`pluginId`) a uzol (`pluginNodeKey`).

## Kedy použiť

Uzol Plugin použite vtedy, keď operátor nainštaloval plugin, ktorý vykonáva akciu,
ktorú potrebujete — napríklad volanie súkromného API, komunikáciu s interným systémom
alebo spustenie špecifickej logiky napísanej pre vaše nasadenie.

Pre pluginy typu trigger, ktoré spúšťajú workflow, pozrite
[Uzol Plugin Trigger](./plugin-trigger-node.md).

## Konfigurácia

Konfiguračný formulár uzla sa generuje z manifestu pluginu. Každé pole
deklarované pluginom (`string`, `number`, `boolean` alebo `select`) sa vykreslí
automaticky. Ne-tajné textové polia používajú vstup pre výrazy a uložené
textové konfiguračné hodnoty začínajúce znakom `$` sa vyhodnotia pred spustením
handlera pluginu.

Tajné polia (napríklad API kľúče) sú v UI maskované a nikdy sa nezapisujú do logov.

## Ako sa pluginy spúšťajú

Pluginy dodáva Heym a inštaluje ich operátor, takže kód pluginu je
**dôveryhodný** a spúšťa sa v rámci procesu ako vstavaný uzol, s plným prístupom
k sieti a knižniciam. Plugin môže deklarovať pip `dependencies`, ktoré sa
nainštalujú do inštancie v čase inštalácie.

Inštalácia a odstraňovanie pluginov je obmedzené na operátorov, ktorých e-mail je
uvedený v `HEYM_PLUGIN_ADMIN_EMAILS`, a celý subsystém je riadený premennou
`HEYM_PLUGINS_ENABLED` (predvolene vypnuté). Pozrite
[Spustenie a nasadenie](../getting-started/running-and-deployment.md) pre
environmentálne premenné.

## Vlastné ikony

Plugin môže obsahovať vlastné SVG logá. Umiestnite `icon.svg` do koreňa balíka
na nastavenie predvolenej ikony pre každý uzol a/alebo priraďte uzlu vlastnú
položku `"icon": "<file>.svg"` v manifeste. Ikona sa zobrazuje na karte v palete
aj na uzle na plátne; uzly bez ikony používajú predvolený glyf skladačky.

## AI Builder

Nainštalované pluginy sú sprístupnené AI asistentovi a chatovému plátnu, takže môžete
požiadať Heym, aby „použil plugin Acme CRM na vytvorenie záznamu“, a on vygeneruje
uzol Plugin so správnym `pluginId` a `config`.

## Tvorba pluginov

Ak chcete vytvoriť balík pluginu, pozrite
[Tvorba pluginov](../reference/plugin-authoring.md) pre rozloženie zipu,
polia manifestu, signatúry handlerov, ikony, závislosti a model dôveryhodnosti
za behu.
