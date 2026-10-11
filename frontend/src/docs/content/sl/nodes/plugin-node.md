# Plugin Vozlišče

**Plugin** vozlišče izvaja prilagojeno dejanje, ki ga zagotavlja nameščen plugin. Plugins razširjajo Heym z novimi tipi vozlišč — dejanja, integracije tretjih oseb ali karkoli, kar je mogoče izraziti v Pythonu — brez spreminjanja osnovne aplikacije.

## Pregled

| Lastnost | Vrednost |
|----------|-------|
| Vhodi | 1 |
| Izhodi | 1 |
| Izhod | `$nodeLabel.<ključi, ki jih vrne plugin>` |

Plugin **paket** (ena zip datoteka) lahko vsebuje **več vozlišč** — katerokoli mešanico dejanj in sprožilcev. Vsako vozlišče se prikaže v paleti pod **Plugins** s svojim imenom in opisom. Povlečenje enega na platno ustvari Plugin vozlišče, povezano s tem paketom (`pluginId`) in vozliščem (`pluginNodeKey`).

## Kdaj Uporabiti

Uporabite Plugin vozlišče, ko je operater namestil plugin, ki izvaja dejanje, ki ga potrebujete — na primer klicanje zasebnega API-ja, komunikacija z notranjim sistemom ali izvajanje prilagojene logike, napisane za vašo namestitev.

Za plugins, ki delujejo kot sprožilci in začenjajo workflow, si oglejte
[Plugin Trigger vozlišče](./plugin-trigger-node.md).

## Konfiguracija

Obrazec za konfiguracijo vozlišča se generira iz manifestacije plugina. Vsako polje, ki ga razglasi plugin (`string`, `number`, `boolean` ali `select`), se samodejno prikaže. Nesecretna nizovna polja uporabljajo vhod za izraze, shranjene nizovne vrednosti konfiguracije, ki se začnejo z `$`, pa se razrešijo pred izvajanjem obdelovalnika plugina.

Zasebna polja (kot so API ključi) so v uporabniškem vmesniku zakrita in nikoli niso zapisani v dnevnike.

## Kako Plugins Delujejo

Plugins so dostavljeni s strani Heym in jih namesti operater, zato je koda plugina **zaupanja vredna** in deluje v procesu, kot vgrajeno vozlišče, z polnim dostopom do omrežja in knjižnic. Plugin lahko razglasi pip `odvisnosti`, ki se namestijo v instanco ob času namestitve.

Namestitev in odstranjevanje pluginov je omejeno na operaterje, katerih e-poštni naslovi so navedeni v `HEYM_PLUGIN_ADMIN_EMAILS`, celoten podsystem pa je zaklenjen z `HEYM_PLUGINS_ENABLED` (privzeto onemogočeno). Oglejte si
[Zagon in Namestitev](../getting-started/running-and-deployment.md) za okoljske spremenljivke.

## Prilagojene Ikone

Plugin lahko vsebuje prilagojene SVG logotipe. Postavite `icon.svg` v korenino paketa, da nastavite privzeto za vsako vozlišče, in/ali dodelite vozlišču svojo `"icon": "<datoteka>.svg"` v manifestu. Ikona se prikaže tako na kartici palete kot na vozlišču na platnu; vozlišča brez ikone se vrnejo na privzeto ikono v obliki sestavljanke.

## AI Graditelj

Nameščeni plugins so dostopni AI asistentu in chat platnu, tako da lahko Heym prosite, naj "uporabi Acme CRM plugin za ustvarjanje zapisa" in bo ustvaril Plugin vozlišče s pravim `pluginId` in `config`.

## Avtor Plugins

Za izdelavo paketa plugina si oglejte
[Avtorstvo Pluginov](../reference/plugin-authoring.md) za razporeditev zip datoteke,
polja manifestacije, podpise obdelovalcev, ikone, odvisnosti in model zaupanja pri izvajanju.
