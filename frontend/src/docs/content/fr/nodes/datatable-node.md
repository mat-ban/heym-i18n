# DataTable

Le nœud **DataTable** lit, écrit et gère les données dans les DataTables Heym. Utilisez-le pour les opérations CRUD sur le stockage structuré interne, sans identifiants externes.

## Vue d'ensemble

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Sortie | `$nodeLabel.rows`, `$nodeLabel.row`, `$nodeLabel.success`, `$nodeLabel.id` |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `dataTableId` | UUID | DataTable issue de l'[onglet DataTable](../tabs/datatable-tab.md) |
| `dataTableOperation` | string | Opération : `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove`, `upsert` |
| `dataTableRowId` | expression | UUID de la ligne (pour getById, update, remove) |
| `dataTableData` | chaîne JSON | Valeurs des colonnes : `{"column_name": "value"}` |
| `dataTableFilter` | chaîne JSON | Filtre (find/upsert/count). `find` et `count` prennent en charge les opérateurs `{"age": {"$gt": 18}}` ; `upsert` utilise une correspondance exacte `{"column_name": "value"}` |
| `dataTableSort` | string | Colonne de tri, préfixe `-` pour un tri décroissant |
| `dataTableLimit` | number | Nombre maximal de lignes renvoyées (par défaut : 100) |

## Opérations

| Opération | Champs requis | Description |
|-----------|----------------|-------------|
| `find` | dataTableId | Recherche les lignes correspondant à un filtre d'opérateurs facultatif, avec tri/limite facultatifs |
| `getAll` | dataTableId | Récupère toutes les lignes avec tri/limite facultatifs |
| `count` | dataTableId | Compte les lignes correspondant à un filtre d'opérateurs facultatif (comptage effectué dans la base de données ; renvoie uniquement un nombre) |
| `getById` | dataTableId, dataTableRowId | Récupère une seule ligne par UUID |
| `insert` | dataTableId, dataTableData | Insère une nouvelle ligne |
| `update` | dataTableId, dataTableRowId, dataTableData | Met à jour la ligne (fusionne les données) |
| `remove` | dataTableId, dataTableRowId | Supprime une ligne |
| `upsert` | dataTableId, dataTableFilter, dataTableData | Met à jour si une correspondance est trouvée, insère sinon |

## Exemple - Rechercher des lignes

```json
{
  "type": "dataTable",
  "data": {
    "label": "findActive",
    "dataTableId": "table-uuid",
    "dataTableOperation": "find",
    "dataTableFilter": "{\"status\": \"active\", \"age\": {\"$gte\": 18}, \"created_at\": {\"$contains\": \"2026-06\"}}",
    "dataTableSort": "-created_at",
    "dataTableLimit": 50
  }
}
```

## Exemple - Insérer une ligne

```json
{
  "type": "dataTable",
  "data": {
    "label": "addUser",
    "dataTableId": "table-uuid",
    "dataTableOperation": "insert",
    "dataTableData": "{\"name\": \"$start.text\", \"status\": \"pending\"}"
  }
}
```

## Exemple - Compter les lignes

Comptez les lignes correspondant à une condition dans un seul nœud, au lieu d'enchaîner `getAll` → If/Else → Map.

```json
{
  "type": "dataTable",
  "data": {
    "label": "activeAdults",
    "dataTableId": "table-uuid",
    "dataTableOperation": "count",
    "dataTableFilter": "{\"status\": \"active\", \"age\": {\"$gt\": 18}}"
  }
}
```

Le résultat est disponible via `$activeAdults.count`. Un filtre vide ou omis compte toutes les lignes.

### Opérateurs de filtre pour find et count

Dans un filtre `find` ou `count`, une valeur simple signifie « égal à » ; une valeur de type objet applique un opérateur :

| Opérateur | Signification |
|----------|---------|
| `$eq` (ou une valeur simple) | Égal à |
| `$ne` | Différent de |
| `$gt`, `$gte`, `$lt`, `$lte` | Comparaisons supérieur/inférieur (numériques pour les colonnes typées `number`, sinon textuelles) |
| `$contains` | Correspondance de sous-chaîne insensible à la casse |
| `$in` | La valeur figure dans le tableau fourni |

Exemple combinant plusieurs opérateurs : `{"status": "active", "age": {"$gte": 18}, "plan": {"$in": ["pro", "team"]}, "name": {"$contains": "jo"}}`. Les opérateurs inconnus sont ignorés. Les filtres `upsert` utilisent toujours des valeurs à correspondance exacte pour trouver la ligne à mettre à jour.

Vous pouvez également filtrer sur les métadonnées de ligne — `id`, `table_id`, `created_at`, `updated_at`, `created_by`, `updated_by` — qui sont stockées comme de véritables colonnes plutôt qu'à l'intérieur de vos données. Pour les dates, indiquez une valeur complète pour les comparaisons de plage (par ex. `{"created_at": {"$gt": "2026-06-04"}}`) ou utilisez `$contains` pour une correspondance textuelle partielle (par ex. `{"created_at": {"$contains": "2026-06-04"}}`). Si l'une de vos propres colonnes porte le même nom qu'un champ de métadonnées, la colonne de données est prioritaire.

## Accès aux sorties

- `$nodeLabel.success` - Statut de réussite booléen
- `$nodeLabel.rows` - Tableau de lignes (find, getAll)
- `$nodeLabel.row` - Objet ligne unique (getById, insert, update, upsert)
- `$nodeLabel.row.data.column_name` - Accès à la valeur d'une colonne spécifique
- `$nodeLabel.count` - Nombre de lignes (lignes renvoyées pour find/getAll ; total des lignes correspondantes pour count)
- `$nodeLabel.id` - UUID de la ligne (insert, update, remove)
- `$nodeLabel.found` - Booléen (getById)
- `$nodeLabel.operation` - Nom de l'opération (par ex. `count` ; `insert`/`update` pour upsert)

## Aucun identifiant requis

Contrairement aux intégrations externes, DataTable opère sur la base de données interne de Heym. Les permissions d'accès du propriétaire du workflow sont vérifiées automatiquement.
## Généré par l'Assistant IA

Lorsque l'[Assistant IA](../reference/ai-assistant.md#data-tables) ou le [Chat](../tabs/chat-tab.md) construit ce nœud, il sélectionne ou crée la table avec vous et écrit les noms exacts des colonnes de la table dans `dataTableData` et `dataTableFilter`.

## Voir aussi

- [Onglet Table de données](../tabs/datatable-tab.md) - Créer et gérer des tables
- [Nœud Grist](./grist-node.md) - Intégration de tableur externe
- [Expression DSL](../reference/expression-dsl.md) - Syntaxe d'expression pour les valeurs dynamiques
