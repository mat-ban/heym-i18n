# Baixada i importació

Exporteu workflows o carpetes senceres com a fitxers, o importeu-los mitjançant arrossegar i deixar anar. Utilitzeu-ho per a còpies de seguretat, compartició o migració de workflows entre instàncies.

## Baixada de workflow (JSON)

**Ubicació:** Barra d'eines de l'editor → botó **Download** (visible en pantalles grans)

**Què exporta:**
- `nodes` – Tots els nodes del canvas
- `edges` – Totes les connexions entre nodes

**Nom del fitxer:** `{workflow-name}.json` (derivat del nom del workflow)

**Format:** Consulteu [Workflow Structure](./workflow-structure.md) per a l'esquema JSON.

## Baixada de carpeta (ZIP)

**Ubicació:** Tauler → pestanya Workflows → menú de 3 punts de la carpeta → **Download as ZIP**

**Què exporta:**
- Tots els workflows de la carpeta i totes les subcarpetes, de manera recursiva
- Jerarquia de carpetes preservada com a directoris dins del ZIP

**Estructura del ZIP:**
```
FolderName/
  workflow1.json
  workflow2.json
  SubFolder/
    workflow3.json
    DeepSub/
      workflow4.json
```

Cada fitxer `.json` conté `{ name, nodes, edges }`.

## Importació

### Des del tauler (pestanya Workflows)

1. Aneu a la pestanya [Workflows](../tabs/workflows-tab.md)
2. Arrossegueu un fitxer **JSON** o **ZIP** sobre l'àrea de workflows

**Fitxer JSON:** Es crea un workflow nou. El nom del workflow prové del camp `name` del JSON, o del nom del fitxer si manca `name`.

**Fitxer ZIP:** Tota l'estructura de carpetes es recrea al nivell arrel. Cada fitxer `.json` dins del ZIP esdevé un workflow col·locat a la carpeta corresponent. Les credencials i les referències entre workflows que no existeixen a la instància actual s'eliminen automàticament. Si alguns workflows no es poden importar, es mostra un resum amb quants se n'han importat correctament.

### Des del canvas (editor)

1. Obriu un workflow a l'editor
2. Arrossegueu un fitxer JSON sobre el canvas
3. Si el canvas ja té nodes o edges, un diàleg de confirmació pregunta si voleu substituir el workflow actual
4. Els nodes i edges importats substitueixen o es fusionen amb el workflow actual

## Formats de fitxer

### JSON (workflow únic)

```json
{
  "nodes": [...],
  "edges": [...],
  "name": "Optional workflow name"
}
```

- `nodes` – Obligatori; array d'objectes node
- `edges` – Opcional; array d'objectes edge (per defecte `[]`)
- `name` – Opcional; s'utilitza en crear un workflow nou des de la importació del tauler

### ZIP (carpeta)

Arxiu ZIP on l'estructura de directoris reflecteix la jerarquia de carpetes. Cada fitxer és un JSON de workflow (vegeu més amunt). Els noms de carpetes i workflows es deriven dels noms de directoris i fitxers respectivament.

Consulteu [Workflow Structure](./workflow-structure.md) per als formats de node i edge.

## Casos d'ús

- **Còpia de seguretat** – Baixeu workflows o carpetes senceres abans de canvis importants
- **Compartició** – Exporteu i compartiu fitxers JSON amb els companys d'equip
- **Migració** – Moveu workflows o estructures de carpetes entre instàncies de Heym
- **Control de versions** – Emmagatzemeu el JSON dels workflows a Git juntament amb el codi

## Relacionat

- [Workflow Structure](./workflow-structure.md) – Format JSON per a nodes i edges
- [Workflows Tab](../tabs/workflows-tab.md) – Creeu workflows i importeu mitjançant arrossegar i deixar anar
- [Workflow Organization](./workflow-organization.md) – Carpetes i subcarpetes
- [Canvas Features](./canvas-features.md) – Funcions de l'editor, inclosa la importació al canvas