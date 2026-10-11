# Notion

Le nœud **Notion** gère les bases de données, les sources de données, les pages et les blocs via l'API Notion.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Identifiant | Token d'intégration interne ou Notion OAuth |
| Version de l'API | `2026-03-11` |

Les collections de type base de données Notion utilisent des **ID de source de données** dans les versions actuelles de l'API. Partagez chaque page ou source de données dont le workflow a besoin avec l'intégration avant d'exécuter le nœud.
Les champs de ressource acceptent soit un ID Notion brut, soit une URL Notion complète. Les URL sont normalisées vers leur ID de ressource intégré avant la requête API.

## Opérations

| Opération | Champs requis | Sortie principale |
|-----------|-----------------|-------------|
| Search | Requête/filtre/tri facultatifs | `.results`, `.count`, `.next_cursor` |
| Get Page | ID de page | `.page` |
| Create Page | ID de source de données ou ID de page parente, Propriétés | `.page`, `.id`, `.url` |
| Update Page | ID de page, l'un de Propriétés/Icône/Couverture | `.page` |
| Move Page to Trash | ID de page | `.page` |
| Restore Page | ID de page | `.page` |
| Create Database | Requête de base de données avec `parent` | `.database`, `.id`, `.url` |
| Retrieve Database | ID de base de données | `.database` |
| Update Database | ID de base de données, requête de base de données non vide | `.database`, `.id`, `.url` |
| Create Data Source | Requête de source de données avec `parent` et `properties` non vide | `.data_source`, `.id`, `.url` |
| Retrieve Data Source | Source de données | `.data_source` |
| Update Data Source | ID de source de données, requête de source de données non vide | `.data_source`, `.id`, `.url` |
| Query Data Source | ID de source de données | `.results`, `.count`, `.next_cursor` |
| Get Block Children | ID de bloc ou de page | `.results`, `.count`, `.next_cursor` |
| Update Block | ID de bloc, objet de mise à jour de bloc | `.block` |
| Delete Block | ID de bloc | `.block` |
| Append Blocks | ID de bloc ou de page, Enfants | `.results`, `.count` |

Toutes les opérations renvoient également `.success` et `.operation`.

## Champs JSON

Les champs Database Request, Data Source Request, Properties, Children, Filter, Sort, Sorts, Icon et Cover acceptent du JSON conforme à l'API Notion. Les expressions à l'intérieur des chaînes JSON sont résolues avant la requête. Un champ peut également être une expression autonome qui se résout directement en l'objet ou le tableau requis, tel que
`$input.database`, `$input.properties` ou `$input.children`.

```json
{
  "Name": {
    "title": [
      {
        "text": {
          "content": "$input.title"
        }
      }
    ]
  }
}
```

Pour le contenu d'une page ou d'un bloc, Children est un tableau d'objets bloc Notion :

```json
[
  {
    "object": "block",
    "type": "paragraph",
    "paragraph": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "$input.description"
          }
        }
      ]
    }
  }
]
```
## Bases de données et sources de données

Dans l'API Notion actuelle, une **base de données** est un conteneur et une **source de données** contient le schéma des propriétés et les lignes interrogeables. Retrieve Database renvoie la liste `data_sources` de la base de données ; utilisez l'un de ces IDs avec Retrieve Data Source ou Query Data Source.

Create Database accepte l'objet de requête complet de l'endpoint Create a database de Notion. Il doit contenir `parent` et peut contenir `title`, `description`, `is_inline`, `initial_data_source`, `icon` et `cover`. Par exemple :

```json
{
  "parent": {
    "type": "page_id",
    "page_id": "$input.parentPageId"
  },
  "title": [
    {
      "type": "text",
      "text": {
        "content": "Tasks"
      }
    }
  ],
  "initial_data_source": {
    "properties": {
      "Name": {
        "title": {}
      }
    }
  }
}
```

Update Database accepte l'objet de requête de l'endpoint de mise à jour, notamment `parent`, `title`, `description`, `is_inline`, `icon`, `cover`, `in_trash` et `is_locked`. Les champs Database ID acceptent un ID brut, une URL Notion complète ou une expression.

Utilisez **Retrieve Data Source** pour récupérer le schéma `properties` de la source de données avant de construire un objet properties pour Create Page. **Create Data Source** requiert un objet base de données parent et un schéma `properties` non vide. **Update Data Source** accepte un objet de requête non vide pris en charge par l'endpoint Notion correspondant.

Par exemple, créez une source de données dans une base de données existante :

```json
{
  "parent": {
    "type": "database_id",
    "database_id": "$input.databaseId"
  },
  "properties": {
    "Name": {
      "title": {}
    },
    "Status": {
      "status": {}
    }
  }
}
```

Les sélecteurs Data Source et Parent Page prennent en charge la recherche côté serveur avec un court debounce et une pagination **Load more** basée sur un curseur. Utilisez **Refresh** après avoir partagé une nouvelle ressource dans Notion. Basculez vers **Use expression** pour saisir une expression, un ID brut ou une URL.

Les filtres de recherche issus d'anciens tutoriels utilisant
`{"property":"object","value":"database"}` sont traduits vers la valeur `data_source` actuelle.
Les nouveaux workflows doivent utiliser directement `data_source` ou `page`.

Append Blocks prend en charge les positions **Start**, **End** et **After Block**. Create Page et Append Blocks découpent automatiquement les ensembles de plus de 100 enfants de premier niveau en requêtes ordonnées afin de respecter la limite par requête de Notion.

Les requêtes limitées en débit (`429` ou `529`) sont retentées jusqu'à trois fois. Heym respecte l'en-tête `Retry-After` de Notion, plafonne chaque attente à 10 secondes et ajoute un jitter aléatoire. Les requêtes Notion partagent un pool de connexions HTTP à l'échelle du processus, entre les pages et les nœuds de workflow.

## Limites de l'API Notion

- Une valeur `text.content` de rich-text unique peut contenir au maximum 2 000 caractères. Découpez les textes plus longs en plusieurs objets rich-text.
- Notion limite les enfants de blocs de premier niveau à 100 par requête. Heym regroupe les tableaux Children plus volumineux, mais chaque bloc individuel doit toujours respecter les limites de payload de Notion.
- L'API accepte au maximum deux niveaux imbriqués d'enfants de blocs dans une même requête. Créez les structures plus profondes avec des opérations Append Blocks successives.
- Les payloads de requête sont limités à 1 000 éléments de bloc et à 500 Ko au total.

## Pagination

Search, Query Data Source et Get Block Children acceptent une taille de page de 1 à 100 ainsi qu'un curseur de départ facultatif. Définissez la taille de page sur `0` pour suivre automatiquement les curseurs et fusionner tous les résultats, dans la limite de sécurité de 10 000 résultats du nœud.

## Configuration des identifiants

Choisissez l'une des deux configurations dans la boîte de dialogue des identifiants (**Internal token** ou **OAuth**) :

- **Internal token :** créez une intégration interne, copiez son token dans Heym, puis partagez chaque page ou source de données requise avec l'intégration. Utilisez **Test Connection** pour vérifier l'accès.
- **OAuth :** créez une intégration Notion publique et enregistrez
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback` dans Notion. Dans la boîte de dialogue des identifiants Heym, choisissez **OAuth**, saisissez le Client ID et le Client Secret de l'intégration, puis cliquez sur **Connect** pour autoriser un workspace. Le secret est stocké chiffré avec l'identifiant et n'est placé ni dans l'état OAuth ni dans la configuration d'environnement. Après autorisation, l'identifiant affiche le nom du workspace connecté (`connected (Workspace Name)`). Les identifiants OAuth en attente affichent `Not connected`.

Laisser le champ internal token vide lors de la modification préserve le token stocké.

Pour les requêtes [HTTP](../nodes/http-node.md) personnalisées, `$credentials.YourNotionCredential` se résout vers le même bearer token que celui utilisé par le nœud Notion (internal token ou access token OAuth).
## Notes sur la version de l'API

Heym fixe les requêtes Notion sur la version d'API `2026-03-11`. Cette version utilise :

- Des parents `data_source_id` et des endpoints `/data_sources` au lieu des anciens chemins de requête de base de données
- `in_trash` au lieu de `archived` pour les opérations de mise en corbeille/restauration des pages
- Des objets `position` (`start`, `end`, `after_block`) pour Append Block Children

Lors de la migration d'anciens exemples d'automatisation Notion :

- Remplacez les références de parent/requête de base de données par les ID de source de données issus de **Retrieve Database** ou du sélecteur de source de données de l'éditeur
- Remplacez `archived: true` par `in_trash: true`
- Remplacez les paramètres `after` d'ajout par le champ **Append Position** du nœud

Les filtres de recherche qui utilisent encore la valeur d'objet `database` sont automatiquement normalisés en `data_source`.

## Voir aussi

- [Identifiants](../reference/credentials.md)
- [Intégrations tierces](../reference/integrations.md)
- [Types de nœuds](../reference/node-types.md)
