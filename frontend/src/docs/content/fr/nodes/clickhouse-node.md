# ClickHouse

Le nœud **ClickHouse** exécute des opérations CRUD, de comptage et de SQL brut sur une base de données [ClickHouse](https://clickhouse.com/) externe via son interface HTTP. Utilisez-le pour écrire des événements dans une table ClickHouse depuis un workflow, lire ou agréger des données analytiques, ou exécuter du SQL arbitraire — sans écrire manuellement des requêtes HTTP.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Identifiant | ClickHouse |
| Sortie | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.row`, `$nodeLabel.success` |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `credentialId` | UUID | Identifiant ClickHouse depuis [Identifiants](../tabs/credentials-tab.md) |
| `clickhouseOperation` | string | Opération : `query`, `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove` ou `upsert` |
| `clickhouseTable` | expression | Nom de table simple. Requis pour toutes les opérations sauf `query`. |
| `clickhouseQuery` | expression | SQL brut pour `query`. `SELECT`/`SHOW`/`DESCRIBE` renvoient des lignes ; les autres instructions s'exécutent comme des commandes. |
| `clickhouseFilter` | expression | Objet JSON de filtres d'égalité, par exemple `{"status":"active"}`. Utilisé par `find`, `count`, `update` et `remove`. Les valeurs sont paramétrées. |
| `clickhouseLimit` | string | Nombre maximum de lignes pour `find` / `getAll` (`0` = illimité, aucune clause LIMIT). Valeur par défaut `100`. |
| `clickhouseSort` | expression | `column` ou `column ASC\|DESC` facultatif pour `find` |
| `clickhouseRowId` | expression | Valeur comparée à la colonne `id` de la table pour `getById` |
| `clickhouseInputMode` | string | Pour `insert`/`upsert` : mode `raw` (tableau JSON) ou mode `selective` (champs clé/valeur) |
| `clickhouseData` | expression | Tableau JSON d'objets de ligne pour `insert`/`upsert`, ou objet JSON de valeurs de colonnes pour `update` |
| `clickhouseMappings` | array | Paires `{key, value}` utilisées lorsque `clickhouseInputMode` vaut `selective` |

## Configuration de l'identifiant

Créez un identifiant **ClickHouse** dans l'[onglet Identifiants](../tabs/credentials-tab.md) avec :

1. **Host** — l'hôte HTTP sans schéma, par exemple `your-instance.clickhouse.cloud`
2. **Port** — le port de l'interface HTTP (`8443` pour HTTPS, `8123` pour HTTP)
3. **Username** / **Password** — par défaut `default` avec un mot de passe vide
4. **Database** — par défaut `default`
5. **Secure** — activez pour HTTPS (ClickHouse Cloud)

Le nœud se connecte via le client HTTP officiel `clickhouse-connect`. Utilisez **Test connection** dans la boîte de dialogue de l'identifiant pour vérifier l'accessibilité avant d'enregistrer.

## Opérations

| Opération | Champs requis | Description |
|-----------|-----------------|-------------|
| `query` | `clickhouseQuery` | Exécute du SQL brut. `SELECT` renvoie `{rows, count}` ; les autres instructions renvoient `{result}`. |
| `find` | `clickhouseTable` | Lit des lignes avec filtres d'égalité, tri et limite facultatifs |
| `getAll` | `clickhouseTable` | Lit des lignes jusqu'à la limite sans filtre |
| `count` | `clickhouseTable` | Compte les lignes, avec filtre facultatif |
| `getById` | `clickhouseTable`, `clickhouseRowId` | Lit une seule ligne par sa colonne `id` |
| `insert` | `clickhouseTable`, `clickhouseData` ou mappings | Insère une ou plusieurs lignes |
| `update` | `clickhouseTable`, `clickhouseData`, `clickhouseFilter` | Met à jour les lignes correspondantes via `ALTER TABLE ... UPDATE` |
| `remove` | `clickhouseTable`, `clickhouseFilter` | Supprime les lignes correspondantes via `DELETE FROM` |
| `upsert` | `clickhouseTable`, `clickhouseData` ou mappings | Insère des lignes (suppose une table `ReplacingMergeTree`) |

## Syntaxe des filtres

`clickhouseFilter` est un objet JSON plat de vérifications d'égalité sur les colonnes. Les valeurs sont envoyées comme paramètres de requête liés, ce qui les protège contre l'injection.

```json
{ "status": "active", "tenant_id": 42 }
```

Cela se compile en `WHERE status = {…:String} AND tenant_id = {…:Int64}`. Seule l'égalité est prise en charge dans le constructeur de filtres — pour les plages, les jointures ou les agrégations, utilisez l'opération `query` avec du SQL brut.

## Modes de saisie (insert / upsert)

- **Tableau JSON** (`raw`) : fournissez un tableau JSON d'objets de ligne dans `clickhouseData`. Les clés absentes d'une ligne donnée sont insérées comme `NULL`. L'ensemble des colonnes est l'union des clés de toutes les lignes.
- **Clé-valeur** (`selective`) : après avoir sélectionné un identifiant et une table, l'éditeur découvre les colonnes de la table et crée un champ de valeur par colonne. Une ligne est insérée par exécution ; chaque valeur prend en charge les expressions.
## Mutations et sémantique ClickHouse

ClickHouse est une base de données OLAP, de sorte que les écritures au niveau des lignes se comportent différemment d'un stockage OLTP :

- **`update`** émet `ALTER TABLE … UPDATE` et **`remove`** émet `DELETE FROM`. Toutes deux sont des **mutations asynchrones** — elles sont appliquées de manière différée et sont relativement coûteuses. Privilégiez les écritures par lots plutôt que les mutations fréquentes sur une seule ligne.
- **`upsert`** effectue un `INSERT`. Pour obtenir un comportement de fusion sur clé, associez la table à un moteur `ReplacingMergeTree`.
- **`getById`** suppose que la table possède une colonne `id`.
- `update` et `remove` nécessitent un `clickhouseFilter` non vide afin d'éviter des mutations sur toute la table.

## Référence des sorties

| Champ de sortie | Type | Description |
|-------------|------|-------------|
| `.rows` | array | Objets de lignes retournés (`query` SELECT, `find`, `getAll`) |
| `.count` | number | Nombre de lignes (`find`, `getAll`, `count`, `insert`/`upsert`) |
| `.row` | object | Ligne unique ou `null` (`getById`) |
| `.result` | string | Résumé de la commande pour une `query` non-SELECT |
| `.success` | boolean | Indique si l'opération a réussi |

## Exemple – Insérer un événement

```json
{
  "type": "clickhouse",
  "data": {
    "label": "logEvent",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "insert",
    "clickhouseTable": "events",
    "clickhouseInputMode": "raw",
    "clickhouseData": "[{\"id\": \"$input.id\", \"event\": \"signup\", \"ts\": \"$input.ts\"}]"
  }
}
```

## Exemple – Compter les utilisateurs actifs

```json
{
  "type": "clickhouse",
  "data": {
    "label": "activeCount",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "count",
    "clickhouseTable": "users",
    "clickhouseFilter": "{\"status\":\"active\"}"
  }
}
```

Accès à la sortie : `$activeCount.count`.

## Exemple – Requête de rapport quotidien

```json
{
  "type": "clickhouse",
  "data": {
    "label": "dailyReport",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "query",
    "clickhouseQuery": "SELECT event, count() AS total FROM events WHERE ts >= today() GROUP BY event ORDER BY total DESC"
  }
}
```

Accès à la sortie : `$dailyReport.rows`, `$dailyReport.count`.

## Voir aussi

- [Types de nœuds](../reference/node-types.md) – Vue d'ensemble de tous les types de nœuds
- [Onglet Identifiants](../tabs/credentials-tab.md) – Ajouter des identifiants ClickHouse
- [Intégrations tierces](../reference/integrations.md) – Configuration des identifiants d'intégration
