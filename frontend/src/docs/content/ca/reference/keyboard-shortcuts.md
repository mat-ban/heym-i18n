# Dreceres de teclat

Heym ofereix dreceres de teclat a l'editor de workflows i al canvas per accelerar les accions habituals.

## Dreceres globals de l'editor

Aquestes dreceres estan actives a qualsevol lloc de l'editor de workflows.

| Drecera | Acció |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | Obrir la paleta d'ordres |
| `Ctrl + I` / `Cmd + I` | Mostrar o ocultar el tauler de l'[Assistent d'IA](./ai-assistant.md) (funciona mentre s'escriu) |
| `Ctrl + Enter` / `Cmd + Enter` | Executar el workflow actual |
| `Ctrl + S` / `Cmd + S` | Desar el workflow |
| `Ctrl + Z` / `Cmd + Z` | Desfer |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | Refer |
| `Ctrl + Y` / `Cmd + Y` | Refer (alternatiu) |
| `Escape` | Tancar les capes superposades, els diàlegs i els taulers oberts |

## Dreceres del canvas

Aquestes dreceres s'apliquen quan el canvas té el focus (no hi ha cap camp de text actiu).

### Selecció i navegació

| Drecera | Acció |
|----------|--------|
| `Ctrl + A` / `Cmd + A` | Seleccionar tots els nodes |
| `Shift` (mantenir premut) | Arrossegar per seleccionar diversos nodes |
| `Ctrl` / `Cmd` (mantenir premut) | Fer clic per afegir nodes individuals a la selecció |
| `Escape` | Desseleccionar tots els nodes; tancar la cerca de nodes en línia |

### Edició de nodes

| Drecera | Acció |
|----------|--------|
| `Ctrl + C` / `Cmd + C` | Copiar el node o els nodes seleccionats |
| `Ctrl + X` / `Cmd + X` | Retallar el node o els nodes seleccionats |
| `Ctrl + V` / `Cmd + V` | Enganxar el node o els nodes |
| `Delete` o `Backspace` | Suprimir el node o els nodes i/o les arestes seleccionats |
| `D` | Activar o desactivar el node o els nodes seleccionats |
| `P` | Activar o desactivar les dades fixades al node seleccionat |

### Cerca de nodes en línia

En escriure qualsevol caràcter imprimible al canvas (quan no hi ha cap camp de text amb el focus), s'obre la finestra emergent de cerca de nodes en línia. El caràcter escrit es converteix en el primer caràcter de la consulta de cerca.

| Drecera | Acció |
|----------|--------|
| Qualsevol caràcter imprimible | Obrir la cerca de nodes en línia i començar a escriure |
| `Backspace` | Eliminar l'últim caràcter de la consulta de cerca |
| `Escape` | Tancar la cerca de nodes en línia |

## Paleta d'ordres (`Ctrl + K`)

La paleta d'ordres està disponible des de l'editor, el tauler, la documentació i les vistes d'avaluacions. Permet navegar ràpidament pels workflows, les pestanyes i les pàgines de documentació sense deixar el teclat.

| Drecera | Acció |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | Obrir la paleta d'ordres |
| `↑` / `↓` | Navegar per la llista de resultats |
| `Tab` / `Shift + Tab` | Navegar per la llista de resultats |
| `Enter` | Obrir l'element seleccionat |
| `Escape` | Tancar la paleta |

## Dreceres del tauler

Aquestes dreceres estan actives a la pestanya Workflows quan no hi ha cap altre camp de text actiu.

| Drecera | Acció |
|----------|--------|
| `Ctrl + F` / `Cmd + F` | Enfocar la cerca de workflows |
| `Escape` | Esborrar la cerca de workflows quan conté text |

## Dreceres del tauler de propietats

Aquestes dreceres estan actives mentre hi ha un node seleccionat i el tauler de propietats està obert.

| Drecera | Acció |
|----------|--------|
| `Ctrl + Shift + O` / `Cmd + Shift + O` | Obrir el sub-workflow enllaçat en una pestanya nova (només al node Execute) |

## Dreceres del diàleg d'avaluació

Aquestes dreceres estan actives mentre el diàleg d'avaluació està obert.

| Drecera | Acció |
|----------|--------|
| `Ctrl + Enter` / `Cmd + Enter` | Aplicar l'expressió i tancar el diàleg |
| `Ctrl + Z` / `Cmd + Z` | Desfer els canvis a l'editor d'expressions |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | Refer els canvis a l'editor d'expressions |
| `Ctrl + Y` / `Cmd + Y` | Refer els canvis a l'editor d'expressions (alternatiu) |

## Dreceres de l'historial i les execucions

Aquestes dreceres estan disponibles al diàleg de l'historial d'execucions i al tauler d'execucions.

| Drecera | Acció |
|----------|--------|
| `S` | Mostrar o ocultar el camp de cerca per filtrar entrades |

## Relacionat

- [Funcions del canvas](./canvas-features.md) – Fixació de dades, activació i desactivació, extracció a un sub-workflow
- [Estructura del workflow](./workflow-structure.md) – Format de nodes i arestes
- [Node Execute](../nodes/execute-node.md) – Crida sub-workflows (`Ctrl + Shift + O`)
- [Inici ràpid](../getting-started/quick-start.md) – Creeu el vostre primer workflow
- **Esc**: Stop following another collaborator in [Canvas Collaboration](./canvas-collaboration.md).
