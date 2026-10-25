# RAG / Vector Store

Le nœud **RAG / Vector Store** permet d'insérer, d'upserter, de supprimer et de rechercher des documents dans un vector store pour la Retrieval Augmented Generation (RAG). Utilisez-le pour enrichir le contexte d'un LLM avec des documents pertinents et pour maintenir ce contexte synchronisé avec le système dont proviennent les documents.

Le nœud dispose d'une liste déroulante **Database** qui sélectionne le backend :

- **Qdrant** – stocke les vecteurs dans un serveur Qdrant externe (nécessite un identifiant *RAG: Qdrant + OpenAI*).
- **Postgres (pgvector)** – stocke les vecteurs dans la base de données Postgres de Heym, sans service externe (nécessite un identifiant *RAG: Psql + OpenAI*).

La valeur par défaut est **Qdrant** pour des raisons de compatibilité ascendante. Le changement de Database filtre la liste **Vector Store** sur les stores reposant sur cette base de données. Les deux backends prennent en charge les mêmes opérations, le filtrage des métadonnées, la recherche hybride (vecteur + BM25) et le reranking Cohere.

Chaque backend peut également être atteint via un identifiant *RAG: Custom Embeddings*, qui
remplace OpenAI par n'importe quel endpoint d'embedding compatible OpenAI et nomme son propre vector
store. Un store créé à partir d'un tel identifiant apparaît sous la Database qu'il
cible. Consultez [Custom Embeddings](../reference/integrations.md#custom-embeddings-rag).

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Sortie | `$nodeLabel.results` / `$nodeLabel.reranked` / `$nodeLabel.hybrid` / `$nodeLabel.count` (search), `$nodeLabel.point_id` (insert, upsert), `$nodeLabel.deleted` (delete) |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `dbType` | `"qdrant"` \| `"pgvector"` | Backend du vector store (par défaut : `"qdrant"`) |
| `vectorStoreId` | UUID | Vector store issu de l'onglet [Vectorstores](../tabs/vectorstores-tab.md) |
| `ragOperation` | `"insert"` \| `"upsert"` \| `"delete"` \| `"search"` | Type d'opération (également `operation`) |
| `documentContent` | expression | Texte du document à stocker (insert, upsert) |
| `documentMetadata` | chaîne JSON | Métadonnées des documents stockés (insert, upsert) ; les valeurs prennent en charge les expressions |
| `documentIdField` | string | Champ du payload contenant l'id unique (upsert, delete ; par défaut `doc_id`) |
| `documentId` | expression | Valeur de l'id unique (upsert, delete) |
| `queryText` | expression | Requête de recherche (search uniquement) |
| `searchLimit` | number | Nombre maximal de résultats (par défaut : 5) |
| `metadataFilters` | chaîne JSON | Filtres de métadonnées pour la recherche (les valeurs prennent en charge les expressions) |
| `hybridSearch` | boolean | Combiner la recherche vectorielle avec la recherche par mots-clés BM25 (search uniquement ; par défaut : désactivé) |
| `enableReranker` | boolean | Utiliser Cohere pour reranker les résultats de recherche |
| `rerankerCredentialId` | UUID | Identifiant Cohere pour le reranking |
| `rerankerTopN` | number | Nombre de meilleurs résultats à conserver après le reranking |

## Opérations

### Insert

Ajoute des documents au vector store.

| Champ | Requis | Description |
|-------|----------|-------------|
| `documentContent` | oui | Texte à embedder et à stocker |
| `documentMetadata` | non | Objet JSON, par ex. `{"source": "user", "category": "general"}` |

**Sortie :** `$nodeLabel.status`, `$nodeLabel.inserted_ids`

### Expressions dans les métadonnées

Les valeurs de métadonnées acceptent des expressions, ce qui permet de stocker un document avec le contexte de l'exécution :

```json
{ "url": "$start.url", "category": "faq" }
```

Les expressions sont résolues après l'analyse du JSON, et non par substitution de texte dans celui-ci, de sorte qu'une valeur contenant un guillemet ou un saut de ligne ne peut pas briser l'objet. Une valeur constituée d'une seule expression conserve son type résolu — `{"count": "$start.count"}` stocke un nombre, et non `"7"` — ce qui est important car les `metadataFilters` de recherche s'appuient sur le type exact. Un texte mixte tel que `"page $start.count"` se résout en chaîne, et les objets et tableaux imbriqués sont également parcourus.

Il en va de même pour `upsert` et pour les `metadataFilters` de la recherche : ces derniers sont d'abord analysés, puis leurs valeurs résolues selon les mêmes règles. Ainsi, un filtre écrit sous la forme `{"count": "$start.count"}` correspond au nombre stocké par un insert, plutôt qu'à la chaîne `"7"`.

### Quel workflow a stocké un document

Un document stocké sans `source` propre se voit attribuer le workflow qui l'a stocké, sous la forme `source: "workflow:<workflow name>"`. L'onglet [Vectorstores](../tabs/vectorstores-tab.md) regroupe ces documents sous **Added workflow: _name_**, de sorte que le contenu d'un store indique la provenance de chaque document, et que les documents d'un workflow peuvent être supprimés en tant que groupe. Définir vous-même `source` dans `documentMetadata` l'emporte toujours sur cette attribution.
### Upsert

Insérez un document ou remplacez celui déjà stocké sous le même id unique.

L'id est un champ **à l'intérieur du payload**, et non l'id de point interne de la base vectorielle. Ainsi, un document conserve l'identifiant que votre propre système utilise déjà — un id d'enregistrement CRM, un SKU, un slug de page.
`documentIdField` désigne ce champ et `documentId` en porte la valeur.

| Champ | Requis | Description |
|-------|----------|-------------|
| `documentId` | oui | Id unique du document (prend en charge les expressions) |
| `documentContent` | oui | Texte à vectoriser et à stocker |
| `documentIdField` | non | Champ du payload contenant l'id (par défaut `doc_id`) |
| `documentMetadata` | non | Objet JSON, par ex. `{"source": "crm", "url": "$start.url"}` (les valeurs prennent en charge les expressions) |

Tout point dont le champ id correspond est d'abord supprimé. Ainsi, un document précédemment stocké sous plusieurs chunks est remplacé dans son intégralité plutôt que dupliqué. Le champ id est écrit dans le payload pour vous, et l'id de point reste stable à travers les upserts d'un même document.

**Sortie :** `$nodeLabel.point_id`, `$nodeLabel.document_id`, `$nodeLabel.replaced` (booléen — indique si une version existante a été remplacée), `$nodeLabel.replaced_count`

### Delete

Supprimez un document par le même id unique.

| Champ | Requis | Description |
|-------|----------|-------------|
| `documentId` | oui | Id unique du document (prend en charge les expressions) |
| `documentIdField` | non | Champ du payload contenant l'id (par défaut `doc_id`) |

**Sortie :** `$nodeLabel.deleted` – `true` lorsqu'au moins un point correspond, `false` lorsque l'id n'était pas dans la base vectorielle. `$nodeLabel.deleted_count` indique combien de points ont été supprimés.

Supprimer un id absent n'est pas une erreur : le nœud réussit avec `deleted: false`, une branche de nettoyage n'a donc pas besoin d'une garde en amont.

### Search

Recherche sémantique de documents similaires.

| Champ | Requis | Description |
|-------|----------|-------------|
| `queryText` | oui | Requête de recherche |
| `searchLimit` | non | Nombre maximal de résultats (par défaut : 5) |
| `metadataFilters` | non | Filtrer par métadonnées (objet JSON à correspondance exacte, les valeurs prennent en charge les expressions) |
| `hybridSearch` | non | Fusionner la similarité vectorielle avec la correspondance de mots-clés BM25 (voir [Recherche hybride](#recherche-hybride)) |
| `enableReranker` | non | Activer le reranking Cohere pour une meilleure pertinence |
| `rerankerCredentialId` | en cas de reranking | Identifiant Cohere |
| `rerankerTopN` | non | Nombre final de résultats après reranking |

**Sortie :** `$nodeLabel.results` – tableau de `{ id, text, score, metadata }`

Lorsque le reranking est activé :

- `$nodeLabel.reranked` devient `true`
- Chaque résultat inclut également `relevance_score`
- `score` reste le score de similarité vectorielle d'origine
- `relevance_score` est le score du reranker Cohere


#### Recherche hybride

La recherche vectorielle trouve du texte qui a le même sens que la requête. Le texte qui ne contient que les mots exacts peut être moins bien classé : un code produit, un numéro de ticket, le nom d'une personne, une erreur telle que `ERR-4021`. Activez **Recherche hybride** et le nœud exécute une recherche par mots-clés parallèlement à la recherche vectorielle et fusionne les deux listes, de sorte qu'une requête trouve les deux types de correspondances.

1. La recherche vectorielle renvoie ses meilleures correspondances, tout comme sans recherche hybride.
2. Une recherche par mots-clés évalue le texte stocké par rapport aux mots de la requête avec **BM25**, ce qui valorise les mots rares, les mots répétés et les documents plus courts.
3. Les deux listes classées sont fusionnées avec la **reciprocal rank fusion**. Un document situé en tête des deux listes se classe en premier, et un document trouvé par une seule liste apparaît quand même.

Les filtres de métadonnées s'appliquent aux deux recherches, et le reranker Cohere, lorsqu'il est activé, s'exécute sur la liste fusionnée.

Chaque résultat porte le score des deux recherches :

| Champ | Signification |
|-------|---------------|
| `score` | Score fusionné de 0 à 1. `1` signifie que le document s'est classé premier dans les deux recherches. |
| `vector_score` | Similarité vectorielle (0 à 1). `null` lorsque seule la recherche par mots-clés a trouvé le document. |
| `keyword_score` | Score BM25. `null` lorsqu'aucun des mots de la requête n'apparaît dans le document. |

`$nodeLabel.hybrid` est `true` lorsque la recherche hybride a été exécutée.

Bon à savoir :

- Le `score` fusionné classe les résultats les uns par rapport aux autres. Il ne s'agit pas d'une similarité vectorielle, de sorte qu'un seuil ajusté sur une recherche simple ne s'applique pas directement.
- Les mots de la requête sont convertis en minuscules et séparés par des espaces et la ponctuation, de sorte que `ERR-4021` est recherché sous forme de `err` et `4021`. La recherche par mots-clés utilise jusqu'aux 16 premiers mots distincts de la requête.
- Qdrant : la première recherche hybride sur une collection crée un index plein texte sur le champ de payload `text`, ce qui nécessite une clé Qdrant avec accès en écriture. Pour les grandes collections, cela prend un instant une seule fois ; les recherches ultérieures réutilisent l'index.
- Postgres (pgvector) : la migration de base de données `142_vsi_text_search_index` ajoute l'index plein texte. Exécutez `alembic upgrade head` après la mise à jour. La recherche hybride fonctionne également sans l'index, mais plus lentement sur les grands magasins.
- Pour chaque requête, la recherche par mots-clés lit jusqu'à 200 documents correspondants, en commençant par les mots de requête les plus rares, car ce sont eux qui ont le plus de poids.
## Accès aux résultats

- `$ragNode.results.first().text` – contenu du meilleur résultat
- `$ragNode.results.first().score` – score de similarité (0–1), ou le score fusionné avec la recherche hybride
- `$ragNode.results.first().keyword_score` – score BM25 (recherche hybride)
- `$ragNode.results.first().vector_score` – similarité vectorielle (recherche hybride)
- `$ragNode.results.first().metadata.source` – métadonnées du meilleur résultat
- `$ragNode.results.map("item.text").join("\n\n")` – concaténer pour le contexte du LLM
- `$ragNode.reranked` – indique si le reranking a été appliqué
- `$ragNode.hybrid` – indique si la recherche hybride a été appliquée
- `$ragNode.count` – nombre de résultats renvoyés
- `$ragNode.replaced` – indique si un upsert a remplacé un document existant
- `$ragNode.deleted` – indique si un delete a supprimé quelque chose

## Exemple – Search

```json
{
  "type": "rag",
  "data": {
    "label": "searchDocs",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "search",
    "queryText": "$userInput.body.text",
    "searchLimit": 5,
    "metadataFilters": "{\"category\": \"faq\"}",
    "enableReranker": true,
    "rerankerCredentialId": "cohere-credential-uuid",
    "rerankerTopN": 5
  }
}
```

## Exemple – Recherche hybride

```json
{
  "type": "rag",
  "data": {
    "label": "findTicket",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "search",
    "queryText": "$userInput.body.text",
    "searchLimit": 5,
    "hybridSearch": true
  }
}
```

## Exemple – Insert

```json
{
  "type": "rag",
  "data": {
    "label": "insertDoc",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "insert",
    "documentContent": "$userInput.body.text",
    "documentMetadata": "{\"source\": \"user_input\"}"
  }
}
```

## Exemple – Upsert

```json
{
  "type": "rag",
  "data": {
    "label": "syncDoc",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "upsert",
    "documentIdField": "doc_id",
    "documentId": "$userInput.body.id",
    "documentContent": "$userInput.body.text",
    "documentMetadata": "{\"source\": \"crm\"}"
  }
}
```

## Exemple – Delete

```json
{
  "type": "rag",
  "data": {
    "label": "removeDoc",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "delete",
    "documentIdField": "doc_id",
    "documentId": "$userInput.body.id"
  }
}
```

## Voir aussi

- [Why Heym](../getting-started/why-heym.md) – Le RAG intégré au runtime des agents
- [Node Types](../reference/node-types.md) – Vue d'ensemble de tous les types de nœuds
- [Vectorstores Tab](../tabs/vectorstores-tab.md) – Créer et gérer des bases vectorielles
- [Third-Party Integrations](../reference/integrations.md#qdrant) – Configuration des identifiants Qdrant et Postgres (pgvector)
- [Agent Node](./agent-node.md) – Utiliser les résultats RAG comme contexte d'agent
- [LLM Node](./llm-node.md) – Injecter les résultats RAG dans le prompt système du LLM
