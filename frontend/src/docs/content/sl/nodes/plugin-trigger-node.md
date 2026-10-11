# Vozlišče za Trigger Plugin

Vozlišče **Trigger Plugin** je nasprotni del vozlišča [Plugin](./plugin-node.md) v slogu trigger. Na voljo je preko nameščenega vtičnika, katerega `kind` je `trigger`, in proizvaja začetne podatke, s katerimi se začne workflow.

## Pregled

| Lastnost | Vrednost |
|----------|----------|
| Vhodi    | 0        |
| Izhodi   | 1        |
| Izhod    | `$nodeLabel.<ključi, ki jih vrne vtičnik>` |

Trigger vtičnik lahko predstavlja katerikoli vir — drugo aplikacijo, storitev tretje osebe ali drugo tehnologijo — dokler handler vtičnika vrne podatke, s katerimi naj se začne workflow.

## Kdaj Uporabiti

Uporabite vozlišče Trigger Plugin, ko nameščen vtičnik definira trigger, ki začenja vaš workflow. Za vtičnike, ki izvajajo dejanje med workflow, uporabite raje [Plugin vozlišče](./plugin-node.md).

## Konfiguracija

Kot pri Plugin vozlišču, je obrazec za konfiguracijo generiran iz polj manifest vtičnika. Nesecretna nizovna polja uporabljajo izrazni vnos, medtem ko so secret polja zakrita.

## Kako Vtičniki Delujejo

Koda vtičnika je zaupanja vredna (dostavljena s strani Heym, nameščena s strani operaterja) in deluje v procesu. Namestitev je omejena na `HEYM_PLUGIN_ADMIN_EMAILS`, podsystem pa je zaščiten z `HEYM_PLUGINS_ENABLED`. Oglejte si [Zagon in Namestitev](../getting-started/running-and-deployment.md).

## Avtor Vtičnikov

Za izdelavo paketa trigger vtičnika si oglejte [Avtorstvo Vtičnikov](../reference/plugin-authoring.md) za razporeditev zip datoteke, polja manifest, podpise handlerjev, ikone, odvisnosti in model zaupanja pri izvajanju.
