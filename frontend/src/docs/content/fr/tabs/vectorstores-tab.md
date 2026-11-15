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

- **Upload files** – Drag and drop or pick several files. A store takes:
  - **Documents** – PDF, Markdown, text, CSV and JSON
  - **Images** – PNG, JPEG, TIFF, WebP and BMP, read with the same Tesseract OCR as the
    [Converter](../nodes/converter-node.md) node, language detected automatically
  - **Audio** – mp3, wav, ogg, opus (WhatsApp voice notes) and flac, transcribed with the Converter's Whisper model on your
    own instance; each chunk keeps where it starts and ends in the recording
    (`start_seconds`, `end_seconds`)
  - **Any other plain-text file** – a file such as `notes` or `README` is read as text when
    it is valid UTF-8
- **Scanned PDFs** – pages without a text layer are read with OCR, up to 200 such pages per file
- **Background uploads** – audio and PDFs with scanned pages take minutes, so Heym reads them in
  the background. They show at the top of the store's items as *Transcribing* or *Reading scanned
  pages* and turn into a normal source when their chunks are in. A failed one shows why and can
  be dismissed. With **Override existing files**, the old version stays searchable until the new
  one is ready
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
