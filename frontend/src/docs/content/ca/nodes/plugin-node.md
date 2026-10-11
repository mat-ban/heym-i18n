# Node de Plugin

El node **Plugin** executa una acció personalitzada proporcionada per un plugin instal·lat. Els plugins amplien Heym amb nous tipus de node — accions, integracions de tercers o qualsevol cosa expressable en Python — sense modificar l'aplicació principal.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Sortida | `$nodeLabel.<keys returned by the plugin>` |

Un **paquet** de plugin (un zip) pot incloure **múltiples nodes** — qualsevol combinació d'accions i triggers. Cada node apareix a la paleta sota **Plugins** amb el seu propi nom i descripció. Arrossegar-ne un al canvas crea un node de Plugin vinculat a aquest paquet (`pluginId`) i node (`pluginNodeKey`).

## Quan utilitzar-lo

Utilitzeu un node de Plugin quan un operador hagi instal·lat un plugin que realitzi l'acció que necessiteu — per exemple, cridar una API privada, comunicar-se amb un sistema intern o executar lògica a mida escrita per a la vostra implementació.

Per als plugins d'estil trigger que inicien un workflow, consulteu el [node de Trigger de Plugin](./plugin-trigger-node.md).

## Configuració

El formulari de configuració del node es genera a partir del manifest del plugin. Cada camp declarat pel plugin (`string`, `number`, `boolean` o `select`) es renderitza automàticament. Els camps de cadena no secrets utilitzen l'entrada d'expressió, i els valors de configuració de cadena desats que comencen per `$` es resolen abans que s'executi el gestor del plugin.

Els camps secrets (com ara claus d'API) s'emmasqueren a la interfície i mai s'escriuen als registres.

## Com s'executen els plugins

Els plugins els lliura Heym i els instal·la un operador, de manera que el codi del plugin és **de confiança** i s'executa en procés com un node integrat, amb accés complet a la xarxa i a les biblioteques. Un plugin pot declarar `dependencies` de pip que s'instal·len a la instància en el moment de la instal·lació.

La instal·lació i eliminació de plugins està restringida als operadors el correu electrònic dels quals aparegui a `HEYM_PLUGIN_ADMIN_EMAILS`, i tot el subsistema està controlat per `HEYM_PLUGINS_ENABLED` (desactivat per defecte). Consulteu [Execució i desplegament](../getting-started/running-and-deployment.md) per a les variables d'entorn.

## Icones personalitzades

Un plugin pot incloure logotips SVG personalitzats. Col·loqueu un `icon.svg` a l'arrel del paquet per establir un valor predeterminat per a tots els nodes, i/o assigneu a un node el seu propi `"icon": "<file>.svg"` al manifest. La icona es mostra tant a la targeta de la paleta com al node del canvas; els nodes sense icona utilitzen el glif predeterminat de peça de trencaclosques.

## Constructor d'IA

Els plugins instal·lats es posen a disposició de l'assistent d'IA i del canvas de chat, de manera que podeu demanar a Heym que "utilitzi el plugin Acme CRM per crear un registre" i generarà el node de Plugin amb el `pluginId` i la `config` correctes.

## Crear plugins

Per crear un paquet de plugin, consulteu [Creació de plugins](../reference/plugin-authoring.md) per a l'estructura del zip, els camps del manifest, les signatures dels gestors, les icones, les dependències i el model de confiança en temps d'execució.