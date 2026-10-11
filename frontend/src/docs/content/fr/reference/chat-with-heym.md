# Chat avec Heym

Chat avec Heym est un assistant conscient de la page, disponible depuis l'en-tête de la documentation. Il s'ouvre dans une boîte de dialogue centrée, vous permet de sélectionner un identifiant LLM et un modèle, et répond aux questions en utilisant la page de documentation courante comme premier contexte.

## Ouvrir la boîte de dialogue

1. Ouvrez n'importe quelle page sous `/docs`
2. Cliquez sur **Chat with Heym** dans l'en-tête
3. Sélectionnez un [identifiant](../tabs/credentials-tab.md) et un modèle
4. Posez une question sur la page ou sur la plateforme

Sur les écrans plus petits, le trigger est réduit à une icône ; sur les écrans plus grands, il affiche le libellé complet.

## Contexte utilisé

- Le chemin de la documentation actuellement ouvert est injecté dans la requête comme indication contextuelle
- Le backend utilise toujours l'endpoint de chat existant du tableau de bord et les outils de recherche de la documentation
- Vos [User Rules](./user-settings.md) au niveau du compte continuent de s'appliquer, car le même backend de chat est réutilisé
- Les étapes de préparation en direct s'affichent dans la bulle de l'assistant avant la réponse finale, comme dans le chat du tableau de bord
- Les questions de clarification apparaissent sous forme de cartes, comme dans l'onglet [Chat](../tabs/chat-tab.md). Lorsqu'une demande de workflow nécessite un identifiant, vous pouvez en sélectionner un ou le créer depuis la carte. Lorsqu'elle nécessite une table de données, vous pouvez sélectionner l'une de vos tables ou en créer une nouvelle de la même manière.

Lorsque vous ouvrez la boîte de dialogue sur un article spécifique, un petit badge affiche le chemin de documentation actif afin que vous puissiez confirmer quelle page est priorisée.

## Comportement de la session

- La sélection de l'identifiant et du modèle reste en place tant que la boîte de dialogue reste montée
- L'historique des messages est limité à la session et est effacé à la fermeture de la boîte de dialogue
- Le clic sur l'arrière-plan, `Escape` et le bouton de fermeture réinitialisent tous la session
- **Stop** interrompt la réponse en streaming en cours
- La boîte de dialogue est volontairement large et de taille fixe ; elle ne propose pas de bascule plein écran

## Quand l'utiliser

- Poser des questions de suivi pendant la lecture d'une page de nœud ou de référence
- Clarifier les différences entre fonctionnalités sans quitter la documentation
- Trouver le bon article avant d'ouvrir l'éditeur

Si vous souhaitez créer ou modifier des workflows directement, utilisez plutôt l'[AI Assistant](./ai-assistant.md) côté éditeur.

## Voir aussi

- [AI Assistant](./ai-assistant.md) – Chat de l'éditeur pour créer des workflows
- [Onglet Credentials](../tabs/credentials-tab.md) – Ajouter les identifiants LLM utilisés par la boîte de dialogue
- [Paramètres](./user-settings.md) – User Rules globaux appliqués aux surfaces IA
- [Démarrage rapide](../getting-started/quick-start.md) – Premier parcours guidé d'un workflow
