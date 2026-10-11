# Node Trigger de Plugin

El node **Plugin Trigger** és la contrapartida d'estil trigger del
[node Plugin](./plugin-node.md). El proporciona un plugin instal·lat el
`kind` del qual és `trigger`, i produeix les dades inicials amb què s'inicia un workflow.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 0 |
| Sortides | 1 |
| Sortida | `$nodeLabel.<keys returned by the plugin>` |

Un plugin de trigger pot representar qualsevol font — una aplicació diferent, un servei
de tercers o una altra tecnologia — sempre que el handler del plugin retorni les dades
amb què ha de començar el workflow.

## Quan utilitzar-lo

Utilitzeu un node Plugin Trigger quan un plugin instal·lat defineixi un trigger que iniciï
el vostre workflow. Per als plugins que duen a terme una acció durant el workflow, feu servir el
[node Plugin](./plugin-node.md) en el seu lloc.

## Configuració

Com el node Plugin, el formulari de configuració es genera a partir dels camps del
manifest del plugin. Els camps de cadena no secrets utilitzen l'entrada d'expressió, i els camps
secrets s'emmasqueren.

## Com s'executen els plugins

El codi dels plugins és de confiança (lliurat per Heym, instal·lat per l'operador) i s'executa en procés.
La instal·lació està restringida a `HEYM_PLUGIN_ADMIN_EMAILS` i el subsistema està
controlat per `HEYM_PLUGINS_ENABLED`. Vegeu
[Execució i desplegament](../getting-started/running-and-deployment.md).

## Crear plugins

Per construir un paquet de plugin de trigger, vegeu
[Creació de plugins](../reference/plugin-authoring.md) per a l'estructura del zip,
els camps del manifest, les signatures dels handlers, les icones, les dependències i el model
de confiança en temps d'execució.