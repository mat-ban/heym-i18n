# Assistant IA

L'**Assistant IA** est un panneau de chat qui s'ouvre depuis le panneau Debug et apparaît en bas à droite de l'éditeur. Faites glisser son en-tête pour le déplacer, et faites glisser un bord ou un coin pour modifier sa largeur ou sa hauteur. Il ne peut pas être réduit en dessous de 360×480 pixels. La position et la taille sont mémorisées dans ce navigateur. **Réinitialiser la position et la taille** dans l'en-tête replace le panneau en bas à droite. Utilisez le langage naturel pour créer ou modifier des workflows : décrivez ce que vous souhaitez, et l'IA génère les nœuds et les arêtes qui sont appliqués au canvas.

Pour les questions de documentation en dehors de l'éditeur, utilisez [Chat with Heym](./chat-with-heym.md). Cette interface est optimisée pour l'aide produit contextuelle à la page plutôt que pour la génération de workflows.

## Ouvrir le panneau

1. Ouvrez un workflow dans l'éditeur
2. Localisez le **panneau Debug** en bas (zone des résultats d'exécution)
3. Cliquez sur le bouton **AI** (icône Sparkles) dans la barre d'outils du panneau
4. Le panneau Assistant IA s'ouvre en bas à droite. Faites glisser son en-tête pour le déplacer, ou faites glisser un bord ou un coin pour modifier sa largeur et sa hauteur.

Appuyez sur `Ctrl + I` / `Cmd + I` n'importe où dans l'éditeur pour ouvrir ou fermer le panneau — le raccourci fonctionne même lorsqu'un champ de saisie de texte est actif. Consultez [Keyboard Shortcuts](./keyboard-shortcuts.md).

## Fermer le panneau

Cliquez sur le bouton **X**, appuyez sur `Ctrl + I` / `Cmd + I`, ou basculez le bouton **AI** dans la barre d'outils du panneau Debug. L'en-tête sert à déplacer le panneau ; il ne le ferme pas.

## Configuration

Avant d'envoyer des messages, sélectionnez :

| Paramètre | Description |
|---------|-------------|
| **Credential** | Identifiant LLM (clé API) depuis [Identifiants](../tabs/credentials-tab.md) |
| **Model** | Nom du modèle (ex. `gpt-4o`, `gemini-2.5-flash`) |

Ajoutez des identifiants dans l'[onglet Identifiants](../tabs/credentials-tab.md). La liste des modèles se charge à partir de l'identifiant sélectionné.

## Mode Agent vs Mode Ask

Le panneau dispose de deux modes, basculés via la puce **Agent / Ask** dans l'en-tête du panneau.

| Mode | Par défaut | Comportement |
|------|---------|-----------|
| **Agent** | ✓ | Construit et modifie le canvas. L'IA génère un bloc JSON de workflow qui est automatiquement appliqué au canvas lorsque la réponse est complète. |
| **Ask** | | Répond uniquement aux questions. Le canvas n'est jamais touché. Utilisez ce mode pour poser des questions sur votre workflow, les fonctionnalités de Heym, ou obtenir des conseils sans déclencher de mise à jour du canvas. |

Basculez entre les modes à tout moment. Le changement de mode n'efface pas la conversation.

En mode Agent, la case **YOLO mode** sous le champ de message permet à l'assistant d'exécuter et de corriger ce qu'il construit. Consultez [YOLO Mode](#yolo-mode).

## Utiliser le Chat

- Saisissez votre demande dans le champ de saisie (ex. « Crée un workflow qui prend une entrée utilisateur et l'envoie à un LLM »)
- Appuyez sur **Entrée** pour envoyer (Maj+Entrée pour un saut de ligne)
- L'IA diffuse sa réponse en streaming. En mode **Agent**, si la réponse contient un workflow dans un bloc de code \`\`\`json, il est automatiquement analysé et appliqué au canvas. En mode **Ask**, le canvas n'est jamais modifié.
- Utilisez **Clear** pour réinitialiser la conversation
- Survolez un message et cliquez sur son icône de copie pour copier le texte affiché, y compris tout JSON de workflow
- Faites glisser la ligne au-dessus de la zone de message pour agrandir celle-ci. La zone de saisie peut atteindre 60 % du panneau, et elle revient à sa hauteur par défaut lors du rechargement de la page

## Application automatique du workflow

Lorsque la réponse de l'IA contient un bloc JSON de workflow valide (avec `nodes` et éventuellement `edges`) dans un bloc de code \`\`\`json, Heym :

1. Analyse le JSON de la réponse
2. Remplace le canvas actuel par les nouveaux nœuds et arêtes
3. Réorganise la disposition des nœuds
4. Marque le workflow comme non enregistré

Si l'analyse échoue, un bouton **Retry** apparaît pour régénérer la réponse.
## Mode YOLO

Le **mode YOLO** permet à l'assistant de tester ce qu'il construit. Cochez la case **Mode YOLO** sous le champ de message, puis envoyez votre requête. La case n'apparaît qu'en mode Agent. Elle est désactivée par défaut et se réinitialise à l'état désactivé lors du rechargement de la page. Survolez l'icône d'information adjacente pour afficher un bref résumé.

Lorsque le mode YOLO est activé, l'assistant ne s'arrête pas après avoir appliqué un workflow :

1. Il applique le workflow au canvas.
2. Avant la première exécution, il demande les entrées de test. La carte répertorie les champs d'entrée du workflow, préremplis avec les valeurs suggérées par l'assistant. Modifiez-les et appuyez sur **Run**. Les exécutions suivantes réutilisent ces valeurs. La carte ne réapparaît que lorsque les champs d'entrée changent ou que l'assistant a besoin de données de test différentes.
3. Il exécute le workflow sur le canvas exactement comme le bouton **Run** : les modifications non enregistrées sont d'abord sauvegardées, les nœuds s'illuminent, et l'exécution apparaît dans le panneau Debug et dans l'[Historique des exécutions](./execution-history.md).
4. Il lit le résultat. Si l'exécution a produit ce que vous avez demandé, il se termine par **Verified** et un bref résumé. Sinon, il corrige le workflow et le réexécute.

Il effectue au maximum **5 exécutions** par message. Appuyez sur **Stop** à tout moment pour mettre fin à la boucle et arrêter une exécution en cours.

Chaque réponse affiche ses étapes au fur et à mesure :
- `Applying changes to canvas` ;
- `Running workflow · attempt 2/5`, avec une ligne `Executing <node>` pour chaque nœud ;
- le verdict final.

Après chaque exécution, une courte ligne telle que *Attempt 1 result sent · error in 1.2s* indique que le résultat a été renvoyé à l'assistant.

### Exécution de vos autres workflows

En mode YOLO, l'assistant peut également exécuter vos autres workflows lorsqu'il a besoin de leur résultat. Par exemple, il peut vérifier ce que renvoie un workflow avant de l'appeler depuis un nœud [Execute](../nodes/execute-node.md). Ces exécutions apparaissent sous forme d'étapes `Running workflow "<name>"...` et sont enregistrées dans l'Historique des exécutions avec la source de trigger `ai_assistant`. Le workflow en cours d'édition est toujours testé sur le canvas.

### Interruption anticipée

| Situation | Comportement |
|---|---|
| L'assistant a besoin d'une décision, d'une information, d'un identifiant ou d'une table de données | Il pose la question via la carte habituelle. Votre réponse relance la boucle. |
| L'exécution attend une [revue humaine](./human-in-the-loop.md) | La boucle s'arrête. Approuvez la revue, puis envoyez un message. |
| Le workflow attend le téléversement d'un fichier | La boucle s'arrête. Le mode YOLO ne peut pas tester les exécutions déclenchées par téléversement. |
| Une version plus récente du workflow a été enregistrée ailleurs | La boucle s'arrête. Résolvez le conflit d'enregistrement, puis envoyez un message. |

> **Les exécutions sont réelles.** Les e-mails, messages et appels API du workflow sont réellement envoyés à chaque tentative, et les nœuds DataTable écrivent de véritables lignes. Chaque exécution enregistre le workflow, de sorte que les versions antérieures restent dans l'[Historique des modifications](./edit-history.md).

## Saisie vocale

Sur les navigateurs compatibles, un bouton **Voice** active la reconnaissance vocale. Cliquez pour démarrer l'enregistrement, cliquez à nouveau pour l'arrêter. Le texte transcrit est envoyé à l'IA pour correction grammaticale avant votre envoi.

## Nœud Agent vs Assistant IA

| | Nœud Agent | Assistant IA |
|---|------------|---------------|
| **Objectif** | Nœud LLM au sein d'un workflow ; s'exécute pendant l'exécution | Interface de Chat pour construire des workflows en langage naturel |
| **Emplacement** | Nœud du canvas | Panneau Debug → panneau flottant |
| **Quand** | À l'exécution | Pendant l'édition |

Consultez [Nœud Agent](../nodes/agent-node.md) pour le nœud de workflow qui exécute des appels LLM avec des outils et MCP.

## Fonctionnement (AI Builder DSL)

L'Assistant IA s'appuie sur un **workflow DSL** (langage dédié) qui décrit les nœuds, les arêtes et les expressions. Lorsque vous envoyez un message :

1. Votre message, ainsi que les [Règles utilisateur](./user-settings.md) et le workflow en cours (le cas échéant), sont envoyés au backend.
2. Le backend construit un **prompt système** qui inclut :
   - Le workflow DSL complet (types de nœuds, syntaxe des expressions, règles, exemples)
   - Vos Règles utilisateur ajoutées sous la mention « User Custom Rules »
   - Le JSON du workflow en cours lorsque vous éditez un workflow existant
   - La liste des workflows disponibles si vous utilisez le nœud Execute
   - Les noms, types et ids de vos propres identifiants (jamais leurs valeurs)
   - Les noms, ids, descriptions et colonnes des tables de données que vous pouvez utiliser (jamais leurs lignes)
3. Le modèle renvoie un unique bloc JSON de workflow (avec `nodes` et `edges`). Le frontend l'analyse et l'applique au canvas.
### Identifiants

Lorsqu'un workflow nécessite un identifiant, l'assistant le demande avant de le construire. Si vous disposez d'identifiants d'un type approprié, il les liste accompagnés de **Create a new credential** ; si vous n'en avez aucun, il vous demande s'il faut en créer un. Chaque question vous permet également de continuer sans identifiant.

Choisir d'en créer un ouvre le formulaire d'identifiant dans le panneau, préréglé sur le bon type et un nom suggéré. Les valeurs sont transmises directement à Heym ; l'assistant ne connaît que le nom et le type. Les identifiants OAuth (Google Sheets, Google Drive, BigQuery, Linear, Notion) se connectent via une popup, et un lien vers la page d'autorisation apparaît au cas où la popup serait bloquée. Une fois l'identifiant enregistré, la carte affiche son nom et le bouton de création se désactive ; appuyez sur **Submit answers** et l'assistant place le nouvel identifiant sur le nœud.

Vous pouvez également demander un identifiant seul (« create a GitHub credential ») ou demander à modifier un identifiant que vous possédez (« update my sheet credential », « reconnect my Google Sheets »). L'assistant répond avec la même carte : la création ouvre un formulaire vide, la modification ouvre le formulaire sur cet identifiant avec ses secrets masqués.

L'assistant privilégie un nœud dédié. Lorsqu'aucun nœud ne couvre une opération, comme l'ajout d'un onglet à un Google Sheet, il utilise une requête HTTP et écrit la ligne d'en-tête pour l'identifiant choisi. Voir [HTTP › Authenticating with Credentials](../nodes/http-node.md#authenticating-with-credentials).

Les questions de clarification dont le workflow peut se passer portent la mention **Optional** dans leur saisie et peuvent être ignorées.

Le DSL impose des libellés en camelCase, des règles d'expression unifiées et des champs propres à chaque nœud. Si la valeur d'un champ est un unique `$expr`, le backend préserve le type natif ; si la valeur mêle de la prose à des `$refs`, le résultat est une chaîne de caractères. La règle du `$` unique s'applique toujours : pas de `$` à l'intérieur des parenthèses. Les User Rules de [Settings](./user-settings.md) sont injectées dans ce prompt système afin que vos préférences s'appliquent à chaque workflow généré par l'IA.

Si le workflow courant contient des Agent skills, l'AI Assistant n'inclut que le `SKILL.md` de chaque skill dans ce contexte de workflow. Les fichiers `.py` joints et les ressources binaires des skills sont retirés avant la requête afin que le builder reste dans les limites de contexte du modèle, même lorsque les skills contiennent de volumineuses implémentations.

### Tables de données

Lorsqu'un workflow enregistre, stocke ou recherche des enregistrements et que vous n'avez pas désigné d'autre store, l'assistant utilise un nœud [DataTable](../nodes/datatable-node.md). Si vous nommez l'une de vos tables et qu'elle possède les colonnes dont le workflow a besoin, l'assistant l'utilise. Sinon, il demande quelle table utiliser. La carte liste les tables qui conviennent, chacune avec sa description et ses types de colonnes, ainsi que **Create a new table** avec un nom et des colonnes proposés. Les tables partagées avec vous sont également proposées ; une table en lecture seule ne vous est proposée qu'en lecture.

Sélectionnez la nouvelle table et appuyez sur **Submit answers** : la carte crée la table, et l'assistant place son id sur le nœud et utilise ses noms de colonnes exacts. Vous pouvez également demander une table seule, par exemple « create a table for my leads ».

L'assistant voit les noms, descriptions et colonnes des tables, jamais les lignes. Il ne modifie jamais les colonnes d'une table existante : si une table ne possède pas une colonne dont le workflow a besoin, il nomme la colonne et propose une nouvelle table à la place. Ajoutez des colonnes dans l'onglet [DataTable](../tabs/datatable-tab.md).

## Related

- [Why Heym](../getting-started/why-heym.md) – Natural-language building as the first stage of the agent lifecycle
- [Quick Start](../getting-started/quick-start.md) – Build your first workflow
- [Settings](./user-settings.md) – User Rules injected into AI Assistant system prompt
- [Chat with Heym](./chat-with-heym.md) – Page-aware assistant inside the documentation area
- [Core Concepts](../getting-started/core-concepts.md) – Workflows, nodes, and execution flow
- [Agent Node](../nodes/agent-node.md) – LLM node with tools and MCP
- [Credentials Tab](../tabs/credentials-tab.md) – Add API keys for the AI Assistant
- [Workflow Structure](./workflow-structure.md) – JSON format for workflows
