# Grist

Le nœud **Grist** permet de lire, d'écrire et de gérer des données dans des feuilles de calcul Grist. Utilisez-le pour les opérations CRUD, les mises à jour par lots et l'automatisation de feuilles de calcul.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Sortie | `$nodeLabel.records`, `$nodeLabel.record`, `$nodeLabel.success`, `$nodeLabel.id` |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `credentialId` | UUID | Identifiant Grist issu de l'onglet [Identifiants](../tabs/credentials-tab.md) |
| `gristOperation` | string | Opération : `getRecord`, `getRecords`, `createRecord`, `createRecords`, `updateRecord`, `updateRecords`, `deleteRecord`, `listTables`, `listColumns` |
| `gristDocId` | expression | ID du document (issu de l'URL Grist) |
| `gristTableId` | expression | ID de la table |
| `gristRecordId` | expression | ID de l'enregistrement (opérations sur un seul enregistrement) |
| `gristRecordData` | JSON string | Valeurs des champs pour la création/mise à jour. Utilisez les **ID de colonnes** (ex. `User_Name`), et non les libellés. |
| `gristRecordsData` | JSON string | Tableau d'enregistrements pour les opérations par lots |
| `gristFilter` | JSON string | Filtre : `{"Column_ID": [values]}` |
| `gristSort` | string | Tri : `Column_ID` ou `-Column_ID` (décroissant) |
| `gristLimit` | number | Nombre maximal d'enregistrements (par défaut : 100) |

## ID de colonnes vs libellés

Utilisez les **ID de colonnes** (avec des underscores, ex. `User_Name`) dans `gristRecordData` et les filtres, et non les libellés affichés. Utilisez `listColumns` pour découvrir les ID de colonnes.

## Exemple – Get Records

```json
{
  "type": "grist",
  "data": {
    "label": "getUsers",
    "credentialId": "grist-credential-uuid",
    "gristOperation": "getRecords",
    "gristDocId": "doc-id",
    "gristTableId": "Users",
    "gristFilter": "{\"User_Status\": [\"Active\"]}",
    "gristLimit": 50
  }
}
```

## Exemple – Create Record

```json
{
  "type": "grist",
  "data": {
    "label": "createUser",
    "credentialId": "grist-credential-uuid",
    "gristOperation": "createRecord",
    "gristDocId": "doc-id",
    "gristTableId": "Users",
    "gristRecordData": "{\"User_Name\": \"$userInput.body.name\", \"Email_Address\": \"$userInput.body.email\"}"
  }
}
```

## Voir aussi

- [Types de nœuds](../reference/node-types.md) – Aperçu de tous les types de nœuds
- [Onglet Identifiants](../tabs/credentials-tab.md) – Ajouter une clé API Grist
- [Intégrations tierces](../reference/integrations.md#grist) – Configuration des identifiants Grist
