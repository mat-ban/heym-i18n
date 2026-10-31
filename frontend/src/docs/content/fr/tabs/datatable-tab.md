# DataTable

L'onglet **DataTable** permet de créer et de gérer des tables de données structurées directement dans Heym. Les tables peuvent être utilisées dans les workflows via le [nœud DataTable](../nodes/datatable-node.md) pour des opérations CRUD programmatiques.

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Regarder la démo DataTable</a></p>

## Création d'une table

1. Accédez à l'onglet DataTable depuis le tableau de bord
2. Cliquez sur **Create DataTable**
3. Saisissez un nom et une description facultative
4. Ajoutez des colonnes à l'aide de l'éditeur de colonnes

## Colonnes

Chaque colonne possède :

| Propriété | Description |
|----------|-------------|
| Name | Nom d'affichage de la colonne |
| Type | `string`, `number`, `boolean`, `date` ou `json` |
| Required | Indique si les nouvelles lignes doivent inclure cette colonne |
| Unique | Indique si les valeurs doivent être uniques parmi les lignes |
| Default Value | Rempli automatiquement lorsqu'une ligne omet cette colonne |

Ajoutez, modifiez ou supprimez des colonnes depuis l'en-tête de la vue détaillée de la table.

## Générer des colonnes avec l'IA

Au lieu d'ajouter des colonnes manuellement, vous pouvez décrire la table en langage naturel (ou coller un exemple JSON) et laisser un LLM proposer le schéma. Les deux points d'entrée ouvrent la même boîte de dialogue :

- **Generate with AI** (en-tête de la liste DataTable) — crée une toute nouvelle table à partir de votre description.
- **AI columns** (vue détaillée de la table, à côté des contrôles de colonnes) — propose de *nouvelles* colonnes à ajouter à la table ouverte.

### Fonctionnement

1. Sélectionnez un **Identifiant LLM** et un **modèle** (par défaut, votre premier identifiant LLM et son modèle le plus récent).
2. Saisissez une description — par exemple *« Une table de livres avec titre, auteur, nombre de pages et si je l'ai lu »* — ou collez un exemple/schéma JSON.
3. Cliquez sur **Generate**. Le modèle renvoie un schéma suggéré.
4. Examinez les colonnes générées dans un formulaire modifiable : modifiez le **nom**, le **type**, la **valeur par défaut**, **unique** et **notEmpty** (obligatoire) pour chacune, supprimez les colonnes indésirables ou cliquez sur **Add column** pour en ajouter manuellement. Pour une nouvelle table, vous pouvez également modifier le **nom** et la **description** suggérés par l'IA.
5. Cliquez sur **Create Table** (nouvelle table) ou **Add Columns** (table existante) pour enregistrer. Appuyez sur **Esc** pour fermer la boîte de dialogue à tout moment.

### Ajout uniquement pour les tables existantes

Lors de la génération de colonnes pour une table existante, le modèle voit vos colonnes actuelles comme contexte et propose **uniquement de nouvelles** colonnes. Les colonnes existantes et leurs données ne sont jamais modifiées ni supprimées — les colonnes générées sont ajoutées. Les noms en doublon (insensibles à la casse) sont automatiquement écartés.

> Un identifiant LLM (OpenAI, Google ou Custom) est requis. Si vous n'en avez aucun, ajoutez-en un dans les Paramètres au préalable.

## Gestion des lignes

- **Ajouter une ligne** : cliquez sur le bouton d'ajout pour créer une nouvelle ligne
- **Édition en ligne** : double-cliquez sur une cellule pour modifier sa valeur. Appuyez sur Entrée ou cliquez ailleurs pour enregistrer, sur Échap pour annuler
- **Supprimer une ligne** : utilisez le menu d'actions de la ligne pour la supprimer
- **Pagination** : les lignes s'affichent par 25 par page avec navigation entre les pages

## Import/Export CSV

### Import
1. Cliquez sur **Import CSV** dans la vue détaillée de la table
2. Sélectionnez un fichier CSV à téléverser
3. Prévisualisez les 5 premières lignes et le mappage des colonnes
4. Les colonnes en vert correspondent aux colonnes existantes de la table ; les jaunes ne correspondent à aucune
5. Cliquez sur Import pour insérer les lignes en masse

### Export
Cliquez sur **Export CSV** pour télécharger toutes les lignes dans un fichier CSV.

## Partage

Partagez des tables avec d'autres utilisateurs ou équipes :

1. Ouvrez la boîte de dialogue de partage depuis la vue détaillée de la table
2. Ajoutez des utilisateurs par e-mail avec la permission **read** ou **write**
3. Ajoutez des équipes avec la permission **read** ou **write**
4. Les utilisateurs en lecture seule peuvent consulter les données ; les utilisateurs en écriture peuvent modifier les lignes et les colonnes. Renommer la table, modifier sa description et gérer les partages restent réservés au propriétaire.

## Création de tables depuis l'AI Assistant

L'assistant du canvas [AI Assistant](../reference/ai-assistant.md#data-tables), le [Chat](./chat-tab.md) et l'outil `heym_chat` de l'[onglet MCP](./mcp-tab.md) peuvent choisir l'une de vos tables pour un workflow qu'ils construisent ou en créer une nouvelle. Ils proposent un nom et des colonnes, et créent la table lorsque vous soumettez la carte de questions. L'assistant du canvas configure les nœuds du workflow à partir des métadonnées de la table. Le Chat et `heym_chat` peuvent également inspecter les lignes, ajouter ou supprimer des colonnes et insérer, mettre à jour ou supprimer des lignes directement. Donnez-leur un nom de table ou le lien de cet onglet. L'écriture nécessite la propriété ou un accès en **écriture** direct ou d'équipe. L'ajout de colonnes conserve les données existantes ; la suppression de colonnes efface leurs valeurs de chaque ligne. La suppression de colonnes et la suppression de toutes les lignes nécessitent une confirmation, à l'identique de cet onglet.

## Utilisation dans les workflows

Le [nœud DataTable](../nodes/datatable-node.md) connecte les tables aux workflows. Les opérations incluent find, getAll, getById, insert, update, remove et upsert. Aucun identifiant n'est requis.

## Table de coûts LLM (table système)

Une section épinglée **System tables** apparaît au-dessus de vos tables créées par l'utilisateur, avec une seule entrée : **LLM Cost Table**. Il s'agit d'une vue à schéma fixe, modifiable par utilisateur, des tarifs par modèle utilisés par les graphiques de coûts des [Traces](./traces-tab.md).

### Provenance des données

Heym conserve une table globale des tarifs par modèle, initialisée à partir du point de terminaison public de tarification de Helicone (`https://www.helicone.ai/api/llm-costs`). La synchronisation s'exécute en arrière-plan la première fois que vous ouvrez la table ou les Traces, et est limitée à une récupération toutes les 24 heures. Appuyez sur **Refresh** pour forcer une resynchronisation immédiate. Les modèles supprimés de la liste amont par Helicone ne sont pas supprimés localement, afin que les recherches de coûts historiques restent stables.

### Schéma (colonnes en lecture seule)

| Colonne | Signification |
|---|---|
| Provider | `ANTHROPIC`, `OPENAI`, `GOOGLE`, … (informatif, utilisé par Helicone) |
| Model | Identifiant de modèle comparé à `trace.model` |
| Op | Opérateur de correspondance : `equals`, `startsWith` ou `includes` |
| Input $/1M | USD par million de tokens de prompt |
| Output $/1M | USD par million de tokens de complétion |
| Source | `helicone`, `seed` ou `user` |

### Personnalisation des tarifs

- **Modifier une ligne** pour remplacer ses prix. Votre remplacement est propre à l'utilisateur et est signalé par un badge `Customized` ; les futures synchronisations Helicone le laissent intact.
- **Réinitialiser aux valeurs par défaut** supprime le remplacement et restaure la valeur globale pour cette ligne.
- **Ajouter un modèle personnalisé** ouvre une boîte de dialogue permettant de créer une ligne réservée à l'utilisateur (par exemple, un modèle affiné privé que Helicone ne référence pas). Les lignes personnalisées sont signalées par `User added` et leur suppression les efface entièrement.

### Correspondance avec les exécutions

Lorsque le tableau de bord Exécutions calcule le coût, il met en correspondance chaque `trace.model` avec :

1. Vos remplacements (correspondance exacte sur le nom du modèle) en premier
2. Sinon, la table globale — la correspondance exacte `equals` est prioritaire sur `startsWith`/`includes` ; les égalités au sein d'un même opérateur sont départagées par le préfixe/sous-chaîne de modèle correspondant le plus long

Si aucune ligne ne correspond, le modèle est répertorié dans l'avis **Unpriced models** sur la page Exécutions ; sa contribution au coût est nulle tant que vous n'ajoutez pas de ligne personnalisée ou n'en remplacez pas une.

## Voir aussi

- [Nœud DataTable](../nodes/datatable-node.md) - Référence du nœud Workflow
- [Onglet Exécutions](./traces-tab.md) - Utilise la table des coûts LLM pour le graphique en anneau des coûts et les cartes d'indicateurs
- [Nœud Grist](../nodes/grist-node.md) - Alternative de tableur externe
- [Onglet Variables](./global-variables-tab.md) - Alternative de stockage clé-valeur