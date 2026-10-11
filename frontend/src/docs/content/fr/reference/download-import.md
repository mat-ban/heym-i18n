# Téléchargement et import

Exportez des workflows ou des dossiers entiers sous forme de fichiers, ou importez-les par glisser-déposer. Utilisez cette fonctionnalité pour la sauvegarde, le partage ou la migration de workflows entre instances.

## Télécharger un workflow (JSON)

**Emplacement :** Barre d'outils de l'éditeur → bouton **Download** (visible sur les grands écrans)

**Contenu exporté :**
- `nodes` – Tous les nœuds du canvas
- `edges` – Toutes les connexions entre les nœuds

**Nom du fichier :** `{workflow-name}.json` (dérivé du nom du workflow)

**Format :** Consultez [Workflow Structure](./workflow-structure.md) pour le schéma JSON.

## Télécharger un dossier (ZIP)

**Emplacement :** Dashboard → onglet Workflows → menu 3 points du dossier → **Download as ZIP**

**Contenu exporté :**
- Tous les workflows du dossier et de tous les sous-dossiers, de manière récursive
- Hiérarchie des dossiers préservée sous forme de répertoires dans le ZIP

**Structure du ZIP :**
```
FolderName/
  workflow1.json
  workflow2.json
  SubFolder/
    workflow3.json
    DeepSub/
      workflow4.json
```

Chaque fichier `.json` contient `{ name, nodes, edges }`.

## Import

### Depuis le Dashboard (onglet Workflows)

1. Accédez à l'onglet [Workflows](../tabs/workflows-tab.md)
2. Glissez un fichier **JSON** ou **ZIP** sur la zone des workflows

**Fichier JSON :** Un nouveau workflow est créé. Le nom du workflow provient du champ `name` du JSON, ou du nom du fichier si `name` est absent.

**Fichier ZIP :** L'intégralité de la structure des dossiers est recréée au niveau racine. Chaque fichier `.json` contenu dans le ZIP devient un workflow placé dans le dossier correspondant. Les identifiants et les références inter-workflows qui n'existent pas dans l'instance actuelle sont automatiquement supprimés. Si certains workflows ne parviennent pas à s'importer, un récapitulatif indique combien ont réussi.

### Depuis le Canvas (éditeur)

1. Ouvrez un workflow dans l'éditeur
2. Glissez un fichier JSON sur le canvas
3. Si le canvas contient déjà des nœuds ou des edges, une boîte de dialogue de confirmation demande s'il faut remplacer le workflow actuel
4. Les nœuds et edges importés remplacent ou fusionnent avec le workflow actuel

## Formats de fichiers

### JSON (workflow unique)

```json
{
  "nodes": [...],
  "edges": [...],
  "name": "Optional workflow name"
}
```

- `nodes` – Requis ; tableau d'objets nœuds
- `edges` – Optionnel ; tableau d'objets edges (valeur par défaut : `[]`)
- `name` – Optionnel ; utilisé lors de la création d'un nouveau workflow depuis l'import du Dashboard

### ZIP (dossier)

Archive ZIP dont la structure de répertoires reflète la hiérarchie des dossiers. Chaque fichier est un workflow JSON (voir ci-dessus). Les noms des dossiers et des workflows sont dérivés respectivement des noms de répertoires et de fichiers.

Consultez [Workflow Structure](./workflow-structure.md) pour les formats de nœuds et d'edges.

## Cas d'usage

- **Sauvegarde** – Téléchargez des workflows ou des dossiers entiers avant des modifications majeures
- **Partage** – Exportez et partagez des fichiers JSON avec vos collègues
- **Migration** – Déplacez des workflows ou des structures de dossiers entre instances Heym
- **Gestion de versions** – Stockez les workflows JSON dans Git aux côtés du code

## Voir aussi

- [Workflow Structure](./workflow-structure.md) – Format JSON pour les nœuds et les edges
- [Workflows Tab](../tabs/workflows-tab.md) – Créer des workflows et importer par glisser-déposer
- [Workflow Organization](./workflow-organization.md) – Dossiers et sous-dossiers
- [Canvas Features](./canvas-features.md) – Fonctionnalités de l'éditeur, y compris l'import sur le canvas
