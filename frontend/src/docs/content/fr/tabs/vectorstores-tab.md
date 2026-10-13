# Onglet Bases vectorielles

L'onglet **Bases vectorielles** gère les bases vectorielles utilisées par les nœuds [RAG](../nodes/rag-node.md). Créez des bases, téléversez des documents et partagez-les avec votre équipe.

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Regarder la démo des bases vectorielles</a></p>

## Création d'une base vectorielle

1. Cliquez sur **Nouvelle base vectorielle**
2. Saisissez un nom et une description facultative
3. Sélectionnez un **identifiant** de base vectorielle – *RAG: Qdrant + OpenAI* (serveur Qdrant externe), *RAG: Psql + OpenAI* (base de données Postgres propre à Heym via pgvector), ou *RAG: Custom Embeddings* (tout endpoint d'embedding compatible OpenAI, ciblant l'un ou l'autre backend). L'identifiant détermine le backend de la base.
4. Définissez éventuellement un nom de collection personnalisé (auto-généré par défaut)
5. Enregistrez

> Le backend d'une base est fixé par son identifiant au moment de la création. Dans un nœud RAG, la liste déroulante **Database** filtre les bases selon le backend correspondant.

## Téléversement de documents

- **Téléverser des fichiers** – Glissez-déposez ou sélectionnez des fichiers (PDF, TXT, etc.)
- **Gestion des doublons** – Choisissez de remplacer ou d'ignorer les noms de fichiers en doublon
- **Progression** – La progression du téléversement est affichée pendant l'ingestion

## Gestion du contenu

- **Consulter les éléments** – Visualisez les groupes sources et le nombre de documents par base. Les fichiers téléversés sont regroupés
  sous leur nom de fichier ; les documents qu'un [nœud RAG](../nodes/rag-node.md) a stockés sans
  `source` propre sont regroupés sous **Added workflow: _name_**, indiquant le workflow qui
  les a écrits
- **Supprimer des sources** – Retirez des fichiers ou des groupes sources spécifiques d'une base, y compris
  tout ce qu'un workflow a ajouté
- **Modifier la base** – Changez le nom, la description ou l'identifiant
- **Rechercher** – `POST /api/vector-stores/{id}/search` avec une `query` (et une `limit` de 1 à 20,
  5 par défaut) renvoie les chunks qu'une recherche de nœud RAG renverrait, meilleure correspondance en premier, chacun avec son
  score et sa source. L'écran RAG de Heym Work l'utilise pour tester la récupération

## Partage

- Partagez les bases vectorielles avec d'autres utilisateurs par email
- Les bases partagées apparaissent avec un indicateur
- Révoquez le partage depuis le menu de la carte de la base

## Utilisation dans les workflows

Dans un [nœud RAG](../nodes/rag-node.md), sélectionnez la base vectorielle par son nom. Le nœud récupère les chunks pertinents et enrichit le contexte du LLM avec ceux-ci.

## Voir aussi

- [Onglet Identifiants](./credentials-tab.md) – Configuration des identifiants de base vectorielle (Qdrant, Postgres ou embeddings personnalisés)
- [Nœud RAG](../nodes/rag-node.md) – Référence du nœud
- [Onglet Workflows](./workflows-tab.md) – Créez des workflows utilisant le RAG
- [Contextual Showcase](../reference/contextual-showcase.md) – Guide compact des pages du tableau de bord
