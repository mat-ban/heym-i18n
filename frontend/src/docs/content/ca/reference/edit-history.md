# Historial d'edicions

L'Historial d'edicions fa un seguiment de les versions desades d'un workflow. Utilitzeu-lo per veure els canvis al llarg del temps, comparar versions o revertir a un estat anterior.

**Nota:** L'Historial d'edicions és diferent de l'[Historial d'execucions](./execution-history.md). L'Historial d'edicions fa un seguiment de les **desades** (canvis en l'estructura del workflow); l'Historial d'execucions fa un seguiment de les **execucions** (execucions passades).

## On trobar-lo

**Barra d'eines de l'editor** → **Historial d'edicions** (icona GitBranch)

## Versions

Es crea una versió nova cada vegada que **desa** el workflow. La llista mostra:

- **Actual** – El darrer estat desat (el que es veu al canvas)
- **Versió N** – Desades anteriors amb marques de temps

Les versions sense canvis respecte de l'anterior s'oculten.

## Vista de diferències

Seleccioneu una versió per veure què ha canviat respecte del workflow actual:

| Tipus de canvi | Descripció |
|-------------|--------------|
| **Nodes** | Nodes afegits, eliminats o modificats |
| **Edges** | Connexions afegides, eliminades o modificades |
| **Config** | Configuració a nivell de workflow (autenticació, límits de velocitat, etc.) |

Desplegueu cada canvi per veure les diferències a nivell de camp (per exemple, quines propietats del node han canviat).

## Previsualització

Per veure com era el workflow en una versió anterior, feu clic a **Previsualització** al costat de Revertir.

S'obre un canvas de només lectura que mostra els nodes i les edges d'aquella versió. Podeu fer zoom i desplaçar-vos per explorar la disposició; no es pot fer cap canvi des d'aquesta vista.

## Revertir

Per restaurar una versió anterior:

1. Seleccioneu la versió que voleu
2. Feu clic a **Revertir**
3. Confirmeu l'acció
4. El workflow actual se substitueix per la versió seleccionada; la pàgina es recarrega

Revertir crea un estat "actual" nou—podeu tornar a revertir si cal.

## Esborrar l'historial

Feu clic a la icona de paperera a la capçalera del diàleg per eliminar tot l'historial de versions. Aquesta acció no es pot desfer. El workflow actual es manté; només se suprimeixen les versions anteriors.

## Quan es creen les versions

Les versions es creen només quan **desa** (Ctrl/Cmd+S o el botó Desa). Els canvis no desats no s'emmagatzemen a l'Historial d'edicions fins que no deseu.

Les edicions d'habilitats dels agents s'inclouen en aquestes instantànies. Per explorar o restaurar una habilitat concreta sense revertir tot el workflow, utilitzeu el botó **Historial** a la targeta d'aquella habilitat al tauler de propietats del node Agent. Vegeu [Node Agent](../nodes/agent-node.md#skill-history).

## Relacionat

- [Historial d'execucions](./execution-history.md) – Execucions passades i Bring to Canvas
- [Estructura del workflow](./workflow-structure.md) – Format de nodes i edges
- [Pestanya Workflows](../tabs/workflows-tab.md) – Creeu i gestioneu workflows