# Onglet Chat

L'onglet **Chat** fournit une interface de conversation directe avec un LLM. Utilisez-le pour tester des modèles, poser des questions, exécuter des workflows existants ou créer un nouveau workflow à partir d'une requête en langage naturel.

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Regarder la démo du Chat</a></p>

## Configuration

1. Sélectionnez un [identifiant](./credentials-tab.md) (clé API pour OpenAI, Google, etc.)
2. Choisissez un modèle dans la liste déroulante (les modèles sont chargés à partir de l'identifiant sélectionné)
3. Commencez à saisir du texte pour envoyer des messages

Vous pouvez également démarrer une conversation depuis la zone de chat de l'[onglet Workflows](./workflows-tab.md). Le premier message est envoyé et la nouvelle conversation s'ouvre ici avec la réponse déjà en cours de streaming.

## Fonctionnalités

- **Contexte des variables globales** – Vos [Variables globales](../reference/global-variables.md) sont accessibles au LLM, ce qui permet de l'interroger sur les valeurs stockées ou d'y faire référence
- **Contexte des modèles de l'espace de travail** – Les modèles de workflows et de nœuds partagés dans votre espace de travail sont inclus comme contexte, ce qui permet au Chat de répondre aux questions sur les modèles disponibles
- **Agent longue durée** – Le Chat continue de fonctionner en arrière-plan même si le navigateur est fermé ; vous pouvez donc revenir depuis un autre appareil et poursuivre la même conversation
- **Création de workflow** – Demandez au Chat de créer ou de configurer un workflow : il utilise le même moteur Workflow AI Builder que l'assistant de l'éditeur pour générer et enregistrer le workflow
- **Création de tâches Kanban** – Demandez naturellement d'ajouter une tâche ou de créer une carte. Le Chat l'ajoute à la première colonne du tableau demandé ; lorsque plusieurs tableaux existent et qu'aucun n'est nommé, le Chat présente un sélecteur de tableau avant de créer la carte
- **Messages de suivi en file d'attente** – Envoyez d'autres messages pendant qu'une réponse est en cours de streaming. Les messages en file d'attente sont persistés, peuvent être modifiés ou supprimés avant leur démarrage, et s'exécutent dans l'ordre après la réponse active
- **Pauses de planification** – Lorsque le Chat a besoin de détails de planification, il pose des questions de clarification et suspend les messages de suivi en file d'attente jusqu'à votre réponse. Une fois la réponse de planification terminée, les messages en file d'attente reprennent
- **Identifiants** – Lorsqu'un workflow créé ou modifié par le Chat nécessite un identifiant, le Chat demande lequel utiliser, propose d'en créer un nouveau dans la conversation, ou permet de continuer sans. Vous pouvez également demander au Chat de créer un identifiant ou de mettre à jour l'un des vôtres ; il ouvre le formulaire d'identifiant dans la conversation. Le modèle voit le nom et le type de l'identifiant, jamais ses valeurs, pour les identifiants que vous possédez comme pour ceux partagés avec vous. Les nœuds LLM et Agent ajoutés par le Chat s'exécutent avec l'identifiant et le modèle sélectionnés pour le chat, y compris les identifiants partagés ; lorsque le Chat modifie un workflow, ses nœuds LLM et Agent existants conservent leur identifiant et leur modèle. Voir [Assistant IA › Identifiants](../reference/ai-assistant.md#credentials)
- **Dashboards** – Demandez quels [dashboards](./dashboard-tab.md) vous possédez, ce que contient l'un d'eux ou sur quel dashboard se trouve un workflow. Demandez au Chat d'ajouter un nouveau widget à un dashboard (il y place un widget vide, puis construit et teste son workflow), de placer un workflow existant sur un dashboard en tant que widget, de renommer ou supprimer un widget, ou d'organiser la disposition d'un dashboard. Heym Work affiche ces dashboards sous forme de pages. Consultez [Dashboard › Depuis le Chat et MCP](./dashboard-tab.md#depuis-le-chat-et-mcp)
- **Tables de données** – Lorsqu'un workflow créé ou modifié par le Chat stocke des enregistrements, le Chat demande quelle [table de données](./datatable-tab.md) utiliser ou propose d'en créer une avec les colonnes nécessaires. Il peut également inspecter les lignes, ajouter ou supprimer des colonnes, et insérer, mettre à jour ou supprimer des lignes directement sur les tables que vous possédez ou pouvez modifier. Donnez-lui un nom de table ou un lien DataTable. La suppression de colonnes et la suppression de toutes les lignes nécessitent une confirmation ; l'ajout de colonnes conserve les données existantes. Consultez [AI Assistant › Tables de données](../reference/ai-assistant.md#data-tables)
- **Réponses en streaming** – Visualisez la sortie du modèle au fur et à mesure de son streaming
- **Arrêt de la réponse** – Interrompez à tout moment la réponse en cours de streaming ; l'arrêt efface également les messages en file d'attente pour cette conversation
- **Rendu Markdown** – Les réponses prennent en charge le formatage markdown, y compris les images en ligne
- **Affichage des images** – Les images intégrées aux réponses (par ex. issues de la génération d'images par le LLM) apparaissent en ligne ; cliquez sur une image pour l'afficher en plein écran. Appuyez sur **Échap** ou sur le bouton retour (mobile) pour fermer la vue plein écran
- **Copie des messages** – Copiez n'importe quel message dans le presse-papiers
- **Effacement du chat** – Démarrez une nouvelle conversation
- **Saisie vocale** – Utilisez le bouton microphone pour la reconnaissance vocale (prise en charge par le navigateur). À l'arrêt de l'enregistrement, Heym peut légèrement nettoyer la transcription avant son envoi
- **Workflows planifiés** – Demandez quand les workflows cron s'exécutent (aujourd'hui, cette semaine, ce mois-ci ou une plage de dates personnalisée). L'assistant utilise les mêmes données de planification que l'[onglet Planifications](./scheduled-tab.md) et peut limiter les résultats aux workflows que vous possédez ou inclure ceux partagés avec vous
- **Historique d'exécution des workflows** – Posez des questions sur un workflow (« combien de fois le rapport quotidien s'est-il exécuté ? », « a-t-il échoué ? », « quand a-t-il été exécuté pour la dernière fois ? »). Le Chat recherche le workflow par son ID et répond à partir de son nombre d'exécutions, de la répartition des statuts, des heures de première et dernière exécution et de la durée moyenne. Demandez pourquoi une exécution a échoué ou ce qu'elle a renvoyé, et le Chat ouvre alors cette exécution unique pour lire ses entrées, ses sorties et les erreurs par nœud
- **Où les exécutions échouent et pourquoi elles sont lentes** – Demandez où vos workflows échouent ou pourquoi ils sont lents, et Chat indique les workflows qui se sont le plus exécutés, qui ont le plus échoué et qui sont les plus lents, ainsi que les types de nœuds qui prennent le plus de temps (moyenne par appel et total), qui échouent le plus et qui s'exécutent le plus, les mêmes chiffres que dans l'onglet [Analytics](./analytics-tab.md). Les types de nœuds sont comptabilisés pour les exécutions depuis la version ayant introduit les analyses de nœuds. Interrogez sur la dernière heure, 3 ou 6 heures, 24 heures, 7 ou 30 jours, ou tout l'historique ; les fenêtres horaires débutent à l'heure pile, ainsi « la dernière heure » à 15h20 couvre de 14h00 à maintenant.
- **Statut des exécutions en direct** – Demandez ce qui s'exécute en ce moment et le Chat répond avec le nombre, les noms des workflows, la durée de chaque exécution, le nœud en cours et un lien direct vers l'exécution en direct

- **Puces de contexte d'exécution** – **Demander à l'IA** dans l'[Execution History](../reference/execution-history.md#ask-ai) ouvre une nouvelle conversation avec l'exécution de Workflow sélectionnée jointe sous forme de puces. Voir [Poser des questions sur une exécution](#poser-des-questions-sur-une-execution)

## Utiliser le Chat depuis un client MCP

Le moteur de Chat est également accessible depuis l'extérieur du navigateur. Activez le **Heym Agent** dans l'[onglet MCP / A2A](./mcp-tab.md) et les clients MCP (Claude, Cursor et tout autre outil compatible MCP) bénéficient d'un outil unique `heym_chat` exécutant ce même moteur avec l'ensemble de ses fonctionnalités. Cochez également **Activer A2A** pour que d'autres agents puissent lui envoyer des tâches via [A2A](../reference/a2a.md) ; ces conversations affichent une icône de réseau dans la liste.

Ces conversations apparaissent dans l'historique de cet onglet, marquées d'une icône de prise dans la liste des conversations. Ouvrez-en une pour lire ce que le client a demandé, consulter les cartes d'outils déclenchées et poursuivre le fil vous-même. Répondre à une question de clarification fonctionne de la même manière, que le tour ait débuté ici ou depuis un client MCP.

Via MCP, le Chat ne liste, ne sélectionne ni ne crée d'identifiants. Les Workflows qu'il construit laissent les champs d'identifiants vides, et la réponse nomme les nœuds nécessitant un identifiant afin que vous puissiez les configurer dans l'éditeur.

Les tables de données fonctionnent également via MCP : le Chat peut modifier directement les colonnes et les lignes, créer des tables et les intégrer aux workflows. Les questions sur les tables et les confirmations de suppression arrivent sous forme de texte dans le résultat ; répondez avec le même `conversation_id`.

## Limite de contexte

Le Chat conserve jusqu'à 25 messages récents dans le contexte. Les messages plus anciens sont tronqués afin de respecter les limites du modèle.

## Créer des Workflows

Lorsque vous demandez au Chat de créer, construire, générer ou configurer un Workflow, il crée un nouveau Workflow enregistré avec un nom et une description générés. La réponse inclut un aperçu en lecture seule du canvas des nœuds et des arêtes générés, ainsi qu'un lien **Open workflow** qui ouvre l'éditeur de Workflow dans un nouvel onglet du navigateur. Utilisez le bouton **Run** de la carte d'aperçu pour exécuter le Workflow.

Les retours complémentaires dans le même Chat modifient ce Workflow au lieu d'en créer un autre. Par exemple, après que le Chat a créé un Workflow, vous pouvez dire « add an approval step », « change the output format » ou « şöyle yap » et le Chat met à jour le Workflow enregistré et actualise l'aperçu.

Cette approche convient aux demandes où vous souhaitez que le travail soit réalisé sous forme d'automatisation réutilisable, et non comme une simple réponse ponctuelle.

## Créer des tâches Kanban

Demandez au Chat en langage naturel, par exemple « Add a task called Fix login bug » ou
« Create a new card Update documentation on the Launch board ». Vous pouvez inclure une
description dans la même requête. Le Chat crée toujours la carte dans la première colonne
du tableau sélectionné.

Si votre espace de travail comporte plusieurs tableaux et que vous n'en identifiez aucun, le Chat
s'interrompt avec un sélecteur de tableau à choix unique. Sélectionnez un tableau pour finaliser la
création de la carte. Aucune commande slash ni format de message particulier n'est requis.

## Demander ce qui est en cours d'exécution

Posez la question en langage naturel — « what is running? », « how many workflows are active right now? »,
« which node is the nightly report on? » — et le Chat fournit un état en temps réel :

- **Combien** d'exécutions sont en cours, réparties entre celles en cours d'exécution et celles en attente de revue humaine
- **À quels Workflows** elles appartiennent, par leur nom
- **Depuis combien de temps** chaque exécution est en cours (par exemple `1m 35s`, `3h 25m`)
- **Quel nœud** s'exécute actuellement, par son libellé sur le canvas, ainsi que le dernier nœud terminé
- **Un lien** vers chaque exécution en cours, qui ouvre le canvas avec cette exécution en rejeu

Les exécutions en pause pour une revue [Human-in-the-Loop](../reference/human-in-the-loop.md) ou Codex sont signalées comme
en attente de votre intervention, et non comme en cours d'exécution. Il s'agit des mêmes données que le badge d'exécutions actives dans l'en-tête,
de sorte que le Chat et le badge ne divergent jamais. Pour les exécutions déjà terminées, demandez plutôt les exécutions récentes
— cela consulte l'[Historique des exécutions](../reference/execution-history.md).

## Poser des questions sur une exécution

Sélectionnez une exécution de Workflow dans l'[Execution History](../reference/execution-history.md#ask-ai), depuis l'éditeur ou depuis All History, puis cliquez sur **Demander à l'IA** à côté du titre de la boîte de dialogue. Chat ouvre une nouvelle conversation avec deux puces au-dessus de la zone de message :

- **Workflow:** le nom du Workflow
- **Execution:** les premiers caractères de l'identifiant de l'exécution sélectionnée

Retirez une puce avec son **×** pour l'exclure. Posez ensuite votre question, par exemple « pourquoi cette exécution a-t-elle pris autant de temps ? », « qu'est-ce qui a échoué ici ? » ou « pouvez-vous le corriger ? ». Les puces restantes sont jointes à ce message avec les identifiants complets ; Chat lit donc directement les entrées, les sorties et la trace par nœud de l'exécution au lieu de rechercher le Workflow. Pour corriger le Workflow, Chat enregistre, teste et vérifie la modification comme décrit dans [Création de Workflows](#creation-de-workflows).

Le message envoyé affiche les puces sous votre question. Elles appartiennent uniquement à ce message ; les questions suivantes de la même conversation conservent le contexte issu de l'historique.

## Poser des questions sur les alertes

Le Chat peut répondre aux questions concernant les [alertes](./alerts-tab.md) que vous avez définies :

- **Ce qui existe** — « what alerts do I have? », « is there an alert on the invoice workflow? »,
  « which alerts are firing right now? »
- **Comment l'une est configurée** — « what is the threshold on the cost alert? », « how is that configured? »
- **Pourquoi et quand elle s'est déclenchée** — « why did the cost alert fire? », « when did this last trigger? »

Pour une question du type « pourquoi s'est-elle déclenchée », le Chat lit l'enregistrement de déclenchement et cite la valeur
réellement observée, le seuil et la fenêtre exacte évaluée, ainsi que le détail contributif :
les identifiants d'exécutions en échec et les messages d'erreur pour les alertes d'erreur, la dépense par modèle pour les alertes de coût, ou
la répartition par source de Trigger pour les alertes de nombre d'exécutions. Il rapporte ce qui était vrai au moment où l'alerte
s'est déclenchée plutôt que de recalculer la fenêtre, car celle-ci est passée et un nouveau calcul
peut donner un résultat différent.

## Règles utilisateur

Les [Règles utilisateur](../reference/user-settings.md) (configurées dans les Paramètres) sont automatiquement injectées dans chaque conversation Chat en tant qu'instructions au niveau système. Définissez-les une fois pour appliquer des préférences persistantes à toutes les requêtes de Chat.

## Travailler avec les Évaluations

Chat peut créer, modifier et exécuter les suites dans [Evals](./evals-tab.md), qu'il s'agisse de suites de prompts ou de suites d'agent :

- **Suite de prompts** : « crée une suite de prompts pour mon prompt de réponse de support avec 8 cas de test et compare gpt-4o avec gpt-4.1-mini ». Chat rédige les cas de test avec leurs réponses attendues, choisit une méthode de notation et enregistre la suite.
  - Avant de créer la suite, il détermine l'identifiant LLM et les modèles à utiliser. S'il n'existe qu'un seul identifiant LLM, il l'utilise et le signale ; sinon, il pose la question.
  - Pour la notation LLM-as-Judge, il demande également si un juge distinct doit évaluer les réponses.
- **Suite d'agent** : « vérifie que mon agent de support recherche toujours la documentation et n'envoie jamais d'e-mail ». Chat localise l'agent et enregistre les contrôles d'outils ainsi que les seuils. À votre demande, il exécute le workflow en générant une entrée différente pour chaque exécution.
  - Les exécutions de suites d'agent sont de réelles exécutions de workflow, leurs effets secondaires se produisent donc. Chat indique le nombre d'exécutions qu'il lance.
- **Baseline** : Chat peut manipuler la baseline d'un agent de trois manières :
  - La rapporter à partir des dernières exécutions de l'agent.
  - La construire à partir des exécutions qu'il lance (« exécute-le 5 fois et utilise cela comme baseline »).
  - Enregistrer les chiffres que vous lui fournissez (« définis la baseline à 3 secondes p95 et 0,01 $ par exécution »).
- **Exécutions** : Chat attend jusqu'à une minute une exécution, puis rapporte le résultat :
  - Pour une suite de prompts : le nombre de réussites de chaque modèle et les cas ayant échoué.
  - Pour une suite d'agent : le taux de réussite, les contrôles échoués et la dérive par rapport à la baseline.
  - Une exécution plus longue se poursuit dans Evals ; demandez à Chat de la vérifier à nouveau.

Après que Chat a créé ou modifié une suite, la réponse affiche une carte avec le nom de la suite, son type et un bouton **Ouvrir dans Evals**, semblable à la carte d'un workflow enregistré. Via MCP, le résultat de `heym_chat` liste le lien de chaque suite enregistrée lors de cet appel.

Le même fonctionnement s'applique depuis un client MCP via `heym_chat` (voir [Utiliser le Chat depuis un client MCP](#utiliser-le-chat-depuis-un-client-mcp)). Les outils d'évaluation restent à l'intérieur de `heym_chat` ; les clients MCP ne les voient pas comme des outils distincts.

L'assistant IA de l'éditeur ne crée pas de suites.

## Associé

- [Onglet MCP / A2A](./mcp-tab.md) – Exposez ce moteur aux clients MCP en tant qu'outil `heym_chat`
- [Paramètres](../reference/user-settings.md) – Définissez les Règles utilisateur appliquées à toutes les requêtes de chat
- [Onglet Identifiants](./credentials-tab.md) – Ajoutez et gérez les clés API
- [Onglet Variables](./global-variables-tab.md) – Variables globales accessibles au Chat
- [Types de nœuds](../reference/node-types.md) – Nœuds LLM et Agent pour les workflows
- [Nœud Agent](../nodes/agent-node.md) – Agent IA avec appel d'outils
- [Assistant IA](../reference/ai-assistant.md) – Assistant d'édition propulsé par le même DSL de construction de workflows
- [Historique des exécutions](../reference/execution-history.md) – Consultez les exécutions passées (bouton Historique dans l'en-tête)
- [Onglet Planifications](./scheduled-tab.md) – Calendrier des exécutions cron à venir (mêmes données que le Chat peut résumer)
- [Onglet Alertes](./alerts-tab.md) – Alertes de seuil que le Chat peut lister et expliquer
- [Présentation contextuelle](../reference/contextual-showcase.md) – Orientation compacte intégrée à l'application pour cette page
- [Voix du Chat (TTS et STT)](../reference/chat-voice.md) – Lisez les messages à voix haute et parlez mains libres avec ElevenLabs

## Appels d'outils et taille du contexte

Chaque fois que l'assistant invoque un outil (exécution d'un workflow, listage des exécutions, création d'un nouveau workflow), une carte repliable apparaît dans la conversation. La carte se déploie automatiquement pendant l'exécution de l'outil, affichant les arguments exacts. Lorsque l'outil se termine, la carte se replie en un résumé d'une ligne avec le temps écoulé. Cliquez sur n'importe quelle carte pour redéployer les arguments et le résumé de la réponse.

Un petit badge circulaire sous le champ de saisie indique l'utilisation actuelle du contexte en pourcentage de la fenêtre du modèle (par ex. `12% · ~9.2k`). Survolez le badge pour afficher une répartition : prompt système, AGENTS.md, bloc workflows, règles utilisateur, historique et votre saisie en cours. Lorsque l'utilisation dépasse 80 %, l'anneau devient ambre ; à 95 %, il devient rouge.

Si l'utilisation approche de la limite, Heym compresse automatiquement les messages plus anciens en un court résumé, selon le même mécanisme que celui utilisé par les nœuds Agent. Une carte « Contexte compressé » apparaît alors en ligne pour indiquer ce qui s'est produit.
