# BigQuery

Le nœud **BigQuery** exécute des requêtes SQL et insère des lignes dans des jeux de données Google BigQuery via l'API REST BigQuery v2. Utilisez-le pour interroger de grands jeux de données analytiques ou pour diffuser des lignes dans des tables à partir des données d'un Workflow.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Identifiant | BigQuery (OAuth2) |
| Sortie | `$nodeLabel.rows`, `$nodeLabel.total`, `$nodeLabel.schema`, `$nodeLabel.insertedCount`, `$nodeLabel.errors` |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `credentialId` | UUID | Identifiant BigQuery depuis [Identifiants](../tabs/credentials-tab.md) |
| `bqOperation` | string | Opération : `query` ou `insertRows` |
| `bqProjectId` | expression | ID du projet Google Cloud (ex. `my-gcp-project`) |
| `bqQuery` | expression | Chaîne de requête SQL. Requis pour `query`. |
| `bqMaxResults` | string | Nombre maximal de lignes renvoyées par `query` (par défaut `1000`). |
| `bqDatasetId` | expression | ID du jeu de données (ex. `my_dataset`). Requis pour `insertRows`. |
| `bqTableId` | expression | ID de la table (ex. `my_table`). Requis pour `insertRows`. |
| `bqRowsInputMode` | `raw` \| `selective` | Pour `insertRows` : **Raw** = tableau JSON complet ; **Selective** = une seule ligne sous forme de paires clé-valeur. |
| `bqRows` | expression | Tableau JSON d'objets de ligne pour le mode raw (ex. `[{"col": "$input.value"}]`). |
| `bqMappings` | array | Paires clé-valeur pour le mode selective. Chaque clé est un nom de colonne ; chaque valeur est une expression. |

## Configuration des identifiants

BigQuery utilise un modèle **OAuth2 « Bring Your Own App »**. Vous fournissez vos propres identifiants OAuth2 Google Cloud.

**Configuration du backend :** définissez **`FRONTEND_URL`** sur le backend Heym avec l'URL publique de l'application (l'adresse que les utilisateurs saisissent dans le navigateur), par exemple `https://your-heym-domain`. L'URI de redirection OAuth est toujours `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.

1. Rendez-vous sur [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → activez **BigQuery API**.
2. Allez dans **Credentials** → **Create Credentials** → **OAuth client ID** → sélectionnez **Web application**.
3. Sous **Authorized redirect URIs**, ajoutez exactement : `{your FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.
4. Copiez le **Client ID** et le **Client Secret**.
5. Dans le Dashboard Heym → **Identifiants** → **Nouveau** → sélectionnez **BigQuery (OAuth2)**.
6. Saisissez le Client ID, le Client Secret et un nom, puis cliquez sur **Connect** pour finaliser le consentement OAuth2 dans une fenêtre contextuelle du navigateur.

Les Tokens sont actualisés automatiquement en arrière-plan — aucune gestion manuelle des Tokens n'est nécessaire.

## Opérations

| Opération | Champs requis | Description |
|-----------|-----------------|-------------|
| `query` | bqProjectId, bqQuery | Exécute une requête SQL et renvoie les lignes |
| `insertRows` | bqProjectId, bqDatasetId, bqTableId, bqRows ou bqMappings | Insère une ou plusieurs lignes via l'API streaming insertAll |

## Référence des sorties

| Opération | Champ de sortie | Type | Description |
|-----------|-------------|------|-------------|
| `query` | `.rows` | array | Tableau d'objets de ligne (nom de colonne → valeur) |
| `query` | `.total` | number | Nombre de lignes renvoyées |
| `query` | `.schema` | array | Champs du schéma de la table |
| `insertRows` | `.insertedCount` | number | Nombre de lignes insérées avec succès |
| `insertRows` | `.errors` | array | Erreurs d'insertion par ligne (vide en cas de succès complet) |

## Exemple – Exécuter une requête

```json
{
  "type": "bigquery",
  "data": {
    "label": "getUsers",
    "credentialId": "bigquery-credential-uuid",
    "bqOperation": "query",
    "bqProjectId": "my-gcp-project",
    "bqQuery": "SELECT id, name, email FROM `my_dataset.users` WHERE active = TRUE LIMIT 100",
    "bqMaxResults": "100"
  }
}
```

Accès à la sortie : `$getUsers.rows` (tableau d'objets de ligne), `$getUsers.rows[0].email`, `$getUsers.total`.

## Exemple – Insérer une ligne

```json
{
  "type": "bigquery",
  "data": {
    "label": "logEvent",
    "credentialId": "bigquery-credential-uuid",
    "bqOperation": "insertRows",
    "bqProjectId": "my-gcp-project",
    "bqDatasetId": "analytics",
    "bqTableId": "events",
    "bqRowsInputMode": "selective",
    "bqMappings": [
      { "key": "event_name", "value": "$input.eventName" },
      { "key": "user_id", "value": "$input.userId" },
      { "key": "timestamp", "value": "$input.timestamp" }
    ]
  }
}
```

## Voir aussi

- [Types de nœuds](../reference/node-types.md) – Aperçu de tous les types de nœuds
- [Onglet Identifiants](../tabs/credentials-tab.md) – Ajouter un identifiant BigQuery OAuth2
- [Google Sheets](./google-sheets-node.md) – Modèle OAuth2 similaire pour les données de feuilles de calcul
- [Intégrations tierces](../reference/integrations.md) – Configuration des identifiants d'intégration
