# Supabase

Le nœud **Supabase** lit et modifie les tables exposées par l'API PostgREST d'un projet Supabase. Utilisez-le lorsque vous souhaitez accéder à l'état d'une application adossée à SQL depuis un workflow, sans écrire manuellement des requêtes HTTP.

## Vue d'ensemble

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Identifiant | Supabase |
| Sortie | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.success` |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `credentialId` | UUID | Identifiant Supabase issu de l'onglet [Identifiants](../tabs/credentials-tab.md) |
| `supabaseOperation` | string | Opération : `select`, `insert`, `update`, `upsert` ou `delete` |
| `supabaseSchema` | expression | Nom du schéma. Si ce champ est vide, le nœud utilise le schéma par défaut de l'identifiant, puis `public`. |
| `supabaseTable` | expression | Nom simple de la table à interroger ou à modifier. Indiquez le schéma dans `supabaseSchema`, pas ici. |
| `supabaseSelectColumns` | expression | Liste de sélection PostgREST séparée par des virgules pour `select` (par défaut `*`) |
| `supabaseFilter` | expression | Objet de filtre JSON. Prend en charge les correspondances exactes, les objets d'opérateurs et les groupes logiques, par exemple `{"id":123}`, `{"created_at":{"gte":"2026-01-01"}}` ou `{"or":[{"status":"active"},{"score":{"gte":10}}]}` |
| `supabaseLimit` | string | Nombre maximal de lignes à renvoyer pour `select` (`0` = récupérer toutes les lignes correspondantes avec pagination côté serveur, les valeurs négatives reviennent à `100`) |
| `supabaseOrderBy` | expression | Colonne facultative de tri pour `select` |
| `supabaseAscending` | boolean | Tri croissant si `true`, décroissant si `false` |
| `supabaseRowsInputMode` | string | Pour `insert`/`upsert` : mode `raw` (tableau JSON) ou `auto` pour mapper automatiquement l'unique entrée en amont |
| `supabaseDataInputMode` | string | Pour `update` : mode `raw` (objet JSON) ou `auto` pour mapper automatiquement l'unique entrée en amont |
| `supabaseIgnoredInputFields` | string | Liste facultative de noms de champs séparés par des virgules à omettre lors du mappage automatique des données d'entrée |
| `supabaseRows` | expression | Tableau JSON d'objets de lignes pour `insert` et `upsert` |
| `supabaseOnConflict` | expression | Colonnes cibles de conflit facultatives, séparées par des virgules, pour `upsert`, par exemple `id` ou `tenant_id,email` |
| `supabaseData` | expression | Objet JSON des valeurs de colonnes mises à jour pour `update` |

## Configuration de l'identifiant

Créez un identifiant **Supabase** dans l'onglet [Identifiants](../tabs/credentials-tab.md) avec :

1. Votre **Project URL**, par exemple `https://your-project.supabase.co`
2. Une **clé API** disposant d'un accès aux tables que ce workflow doit utiliser
3. Un **schéma par défaut** facultatif (par défaut `public`)

Le nœud communique avec l'endpoint PostgREST de Supabase à l'adresse `/rest/v1/<table>`.
Utilisez `supabaseTable` uniquement pour la table, par exemple `users` ou `profiles`. N'y indiquez pas `schema.table`, `rpc/...` ni d'autres chemins d'API.

Lorsqu'un identifiant Supabase valide est sélectionné, l'éditeur peut découvrir les tables exposées et leurs
colonnes directement à partir des métadonnées OpenAPI de PostgREST. Utilisez la liste déroulante **discovered tables** pour
choisir une table et les **column chips** sous **Select Columns** pour construire rapidement une liste de sélection.

## Opérations

| Opération | Champs requis | Description |
|-----------|-----------------|-------------|
| `select` | `supabaseTable` | Lire des lignes avec filtres de correspondance exacte, limite et tri facultatifs |
| `insert` | `supabaseTable`, `supabaseRows` ou mappage automatique de l'entrée | Insérer une ou plusieurs lignes |
| `update` | `supabaseTable`, `supabaseData` ou mappage automatique de l'entrée, `supabaseFilter` | Mettre à jour les lignes correspondant au filtre |
| `upsert` | `supabaseTable`, `supabaseRows` ou mappage automatique de l'entrée | Insérer ou fusionner des lignes selon la sémantique upsert de Supabase. Utilisez `supabaseOnConflict` lorsque vous avez besoin d'une cible de conflit explicite. |
| `delete` | `supabaseTable`, `supabaseFilter` | Supprimer les lignes correspondant au filtre |

## Syntaxe des filtres

`supabaseFilter` compile un JSON structuré en paramètres de requête PostgREST.

- Correspondance exacte : `{"status":"active"}`
- Comparaison : `{"created_at":{"gte":"2026-01-01"}}`
- Appartenance : `{"status":{"in":["active","paused"]}}`
- Correspondance de motif : `{"email":{"ilike":"*@example.com"}}`
- OR logique : `{"or":[{"status":"active"},{"score":{"gte":10}}]}`
- AND logique : `{"and":[{"score":{"gte":10}},{"score":{"lt":100}}]}`

Pour plusieurs opérateurs sur un même champ, privilégiez un groupe logique :

```json
{
  "and": [
    { "score": { "gte": 10 } },
    { "score": { "lt": 100 } }
  ]
}
```

## Pagination

`select` effectue désormais une véritable pagination côté serveur auprès de PostgREST.

- `supabaseLimit: "0"` récupère toutes les lignes correspondantes page par page
- Les valeurs de `supabaseLimit` supérieures à 1000 se répartissent automatiquement en plusieurs requêtes
- Les résultats sont fusionnés dans un seul tableau `.rows` et `.count` conserve le nombre total de lignes correspondantes

Lors de la lecture de tables volumineuses, définissez un `supabaseOrderBy` stable pour garantir des limites de pages prévisibles.
## Auto-map Input

Pour `insert`, `upsert` et `update`, basculez le nœud sur **Auto-map input** lorsque le nœud
amont unique produit déjà la structure que vous souhaitez écrire.

- Un objet unique devient une ligne ou un payload de mise à jour
- Un tableau d'objets devient plusieurs lignes pour `insert` / `upsert`
- Un objet amont contenant un tableau `rows` réutilise directement ce tableau
- `supabaseIgnoredInputFields` vous permet d'exclure des champs tels que `id`, `created_at` ou `success`

## Output Reference

| Champ de sortie | Type | Description |
|-------------|------|-------------|
| `.rows` | array | Objets de ligne retournés |
| `.count` | number | Nombre de lignes retournées ou affectées |
| `.success` | boolean | Indique si l'opération a réussi |

## Exemple – Select Active Users

```json
{
  "type": "supabase",
  "data": {
    "label": "activeUsers",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "select",
    "supabaseSchema": "public",
    "supabaseTable": "users",
    "supabaseSelectColumns": "id,email,status",
    "supabaseFilter": "{\"status\":\"active\"}",
    "supabaseLimit": "100",
    "supabaseOrderBy": "created_at",
    "supabaseAscending": false
  }
}
```

Accès à la sortie : `$activeUsers.rows`, `$activeUsers.rows[0].email`, `$activeUsers.count`.

## Exemple – Upsert a Profile Row

```json
{
  "type": "supabase",
  "data": {
    "label": "saveProfile",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "upsert",
    "supabaseSchema": "public",
    "supabaseTable": "profiles",
    "supabaseRows": "[{\"id\": \"$input.userId\", \"display_name\": \"$input.name\"}]",
    "supabaseOnConflict": "id"
  }
}
```

## Related

- [Node Types](../reference/node-types.md) – Vue d'ensemble de tous les types de nœuds
- [Credentials Tab](../tabs/credentials-tab.md) – Ajouter des identifiants Supabase
- [Third-Party Integrations](../reference/integrations.md) – Configuration des identifiants d'intégration
