# Paramètres

La boîte de dialogue Paramètres vous permet de gérer votre profil, de définir des instructions IA persistantes, de mettre à jour le mot de passe de votre compte, de configurer la voix du chat, de définir vos identifiant et modèle IA par défaut, et de consulter l'état de l'observabilité. Ouvrez-la en cliquant sur **votre avatar et votre nom** dans le coin supérieur droit de l'en-tête.

## Ouverture de la boîte de dialogue

Cliquez sur **votre avatar et votre nom** dans le coin supérieur droit de l'en-tête. La boîte de dialogue s'ouvre avec les onglets suivants : **Profil**, **Sécurité**, **Voix**, **IA par défaut** et **Observabilité**. Les administrateurs d'instance voient également les onglets **SSO**, **Heym Work** et **Instances**.

## Onglet Profil

### Photo de profil

Heym affiche votre photo [Gravatar](https://gravatar.com) associée à l'adresse e-mail de votre compte dans l'en-tête, à côté de vos messages dans le [Chat](../tabs/chat-tab.md) et **Chat with Heym**, sur les commentaires du [Board](../tabs/board-tab.md), ainsi qu'à côté de votre nom dans les boîtes de dialogue de partage et les listes de membres d'équipe. Pour la modifier, mettez à jour la photo sur Gravatar ; Heym récupère la nouvelle dans un délai de quelques heures. Sans photo Gravatar, Heym affiche la première lettre de votre nom.

La photo est récupérée par le serveur Heym et mise en cache sur celui-ci, de sorte que votre navigateur ne contacte jamais Gravatar. Si le serveur ne parvient pas à joindre Gravatar, tout le monde continue de voir les initiales.

### Nom

Votre nom d'affichage, utilisé dans toute l'application. Ce champ est obligatoire et ne peut pas rester vide.

### Règles utilisateur

Les Règles utilisateur sont des instructions personnalisées automatiquement injectées dans chaque requête IA — à la fois dans le constructeur de workflows et dans le chat du tableau de bord. Dans le **constructeur de workflows** ([AI Assistant](./ai-assistant.md)), elles sont ajoutées au prompt système utilisé pour générer le JSON du workflow. Dans le **chat du tableau de bord**, elles sont appliquées comme contexte au niveau système. Vous les rédigez une seule fois et elles s'appliquent globalement, sans avoir à les répéter dans chaque prompt.

**Usages courants :**

- Langue ou ton : `Always respond in English. Keep responses concise.`
- Style de code : `Use async/await patterns. Prefer TypeScript interfaces over types.`
- Conventions de workflow : `Include error handling in all workflows. Use descriptive node labels.`
- Format de réponse : `Use bullet points. Avoid lengthy explanations.`

**Où elles s'appliquent :**

| Contexte | Description |
|---------|-------------|
| **Constructeur de workflows** | Requêtes de l'[AI Assistant](./ai-assistant.md) pour générer ou modifier des workflows |
| **Chat du tableau de bord** | Toutes les conversations de l'[onglet Chat](../tabs/chat-tab.md) |

Les Règles utilisateur sont injectées au niveau système — elles s'exécutent automatiquement avant chaque prompt, sans configuration supplémentaire par workflow ou conversation.

### Enregistrement des modifications du profil

Cliquez sur **Save Changes** pour appliquer. Les modifications prennent effet immédiatement pour toutes les nouvelles requêtes IA.

## Onglet Sécurité

### Modification du mot de passe

Utilisez l'onglet Sécurité pour mettre à jour le mot de passe de votre compte.

**Exigences :**

| Règle | Exigence |
|------|-------------|
| Longueur minimale | 8 caractères |
| Majuscule | Au moins une lettre majuscule (A–Z) |
| Minuscule | Au moins une lettre minuscule (a–z) |
| Chiffre | Au moins un chiffre (0–9) |

Le mot de passe doit également être différent de votre mot de passe actuel. Ces règles sont appliquées à la fois côté frontend et côté backend.

**Étapes :**

1. Saisissez votre **Current Password**
2. Saisissez votre **New Password** (doit satisfaire toutes les exigences ci-dessus)
3. Saisissez-le à nouveau dans **Confirm New Password**
4. Cliquez sur **Update Password**

Si le mot de passe actuel est incorrect, un message d'erreur en ligne s'affiche. En cas de succès, un message de confirmation apparaît et le formulaire se réinitialise automatiquement.

## Onglet Voix

L'onglet Voix configure la voix parlée pour l'[onglet Chat](../tabs/chat-tab.md) : sélectionnez un **identifiant ElevenLabs** (ou ajoutez-en un directement), choisissez une **Voix** depuis votre compte ElevenLabs, puis cliquez sur **Save Voice Settings**. Cela active la lecture à voix haute par message et le mode vocal interactif. Consultez [Chat Voice (TTS & STT)](./chat-voice.md) pour le flux complet.

## Onglet IA par défaut

L'onglet IA par défaut comporte deux sections.

### Identifiant et modèle préférés

Sélectionnez un **identifiant LLM préféré** et un **modèle** associé. Cela devient la valeur par défaut initiale pour chaque fonctionnalité IA de l'application — chat, [AI Assistant](./ai-assistant.md) (constructeur, analyseur et création de workflows), board mapper, widgets IA du tableau de bord, [docs chat](../tabs/chat-tab.md), l'assistant de schéma IA des tables de données, le constructeur d'expressions et les évaluations — dès lors que cette interface n'a pas de sélection enregistrée qui lui soit propre.

La règle de sélection appliquée par chaque interface est la suivante :

1. **Sélection enregistrée** — un choix que vous avez déjà effectué sur cette interface (par exemple le dernier modèle d'une conversation de chat) l'emporte toujours.
2. **Préféré** — utilisé lorsqu'aucune sélection n'est enregistrée.
3. **Premier identifiant disponible** — la solution de repli lorsque vous n'avez défini aucune préférence.

Vous pouvez toujours modifier l'identifiant et le modèle par interface à tout moment ; la préférence ne fait que définir la valeur par défaut initiale. Laissez l'identifiant sur **No preference** pour conserver le comportement précédent du premier identifiant disponible. Si votre identifiant préféré est ultérieurement supprimé ou n'est plus partagé, l'onglet affiche un avertissement et les interfaces reviennent silencieusement au premier identifiant disponible.

### Utilisation du forfait de codage

Pour chaque identifiant **Codex** (y compris ceux partagés), l'onglet affiche l'utilisation restante de la limite de débit sous forme de barre horizontale par fenêtre active — par exemple une fenêtre de **5 heures** et/ou une fenêtre **Hebdomadaire**, selon votre forfait. Chaque barre indique le pourcentage de quota restant ainsi qu'un compte à rebours de réinitialisation. Un bouton **Actualiser** relance la récupération à la demande (les résultats sont brièvement mis en cache sur le serveur).

Pour chaque identifiant **OpenCode**, l'onglet affiche les fenêtres d'abonnement OpenCode Go — **5 heures**, **Hebdomadaire** et **Mensuelle** — sous le même style de barre, lues depuis l'endpoint d'utilisation authentifié de la passerelle à l'aide de la clé API de cet identifiant. Une fenêtre ayant atteint son plafond est affichée en **« limite atteinte »** en ambre. Si la clé est invalide ou si l'espace de travail ne dispose d'aucun abonnement Go, la carte en explique la raison au lieu d'afficher des barres.

## Onglet Observabilité

L'onglet Observabilité affiche l'état en lecture seule du [traçage OpenTelemetry](./opentelemetry.md) pour cette instance : si le traçage est activé, l'endpoint OTLP, le nom du service, le ratio d'échantillonnage et les spans émis. Le traçage est configuré via les variables d'environnement `HEYM_OTEL_*` du backend ; cet onglet ne modifie donc rien. Lorsque le traçage est désactivé, l'onglet liste les variables d'environnement nécessaires pour l'activer. Les secrets tels que les en-têtes d'authentification OTLP ne sont jamais affichés ici. Consultez [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) pour la référence complète de configuration.

## Onglet SSO

Visible uniquement par les administrateurs de l'instance — les comptes listés dans `HEYM_ADMIN_EMAILS`. Cet onglet connecte Heym à un fournisseur OpenID Connect externe afin que les utilisateurs se connectent avec les comptes qu'ils possèdent déjà. Saisissez une URL d'émetteur et les identifiants client, copiez l'URI de redirection en lecture seule dans votre fournisseur, puis exécutez **Tester la connexion** avant de l'activer. La connexion par mot de passe peut être désactivée depuis cet onglet une fois le test réussi. Consultez [Single Sign-On](./sso.md) pour la configuration complète.

## Onglet Heym Work

Les administrateurs d'instance connectent ici [Heym Work](./heym-work.md), l'interface destinée aux équipes métier : son adresse, une clé d'intégration affichée une seule fois et le commutateur **Enable Heym Work**. L'onglet indique également la date du dernier signalement de Heym Work, sa version et l'état de sa licence. Voir [Connecter Heym Work](./heym-work.md#connecting-heym-work).

## Onglet Instances

Visible uniquement par les administrateurs de l'instance — les comptes listés dans `HEYM_ADMIN_EMAILS`. Cet onglet liste les instances Heym connectées à cette base de données et définit la répartition des exécutions en arrière-plan entre elles. Chaque ligne affiche le nom modifiable de l'instance, son rôle, si elle est active, sa latence mesurée vers la base de données, un interrupteur marche/arrêt et son poids. Les poids sont des parts des instances pouvant actuellement prendre en charge du travail, et non des pourcentages sur 100 : avec `41 / 26 / 33` et la troisième instance désactivée, les deux premières reçoivent réellement 61 % et 39 %. Le panneau affiche cette répartition effective sous le tableau, et refuse uniquement l'enregistrement lorsqu'aucune instance activée ne possède de poids.

**Attribuer automatiquement une part aux nouvelles instances** est activé par défaut : une instance qui rejoint le cluster resterait sinon à un poids de 0 et ne recevrait rien ; le leader lui attribue donc une part égale une seule fois et réduit les poids existants en conservant leurs ratios. Il ne touche jamais une instance dont vous avez défini le poids vous-même.

Le panneau indique également combien d'exécutions des dernières 24 heures n'ont pu s'effectuer que sur l'instance principale. Lorsque cette part est élevée, les poids situés en dessous ne peuvent pas déplacer ce travail. Consultez [Load Distribution](./cluster.md) pour savoir ce qui reste sur l'instance principale et comment choisir les valeurs.

## Ce qui ne figure pas dans cette boîte de dialogue

| Fonctionnalité | Où la trouver |
|---------|-----------------|
| **Gestion des clés API (MCP)** | [Onglet MCP](../tabs/mcp-tab.md) – consulter, copier et régénérer votre clé API du serveur MCP |
| **Thème (sombre / clair)** | Bouton Soleil/Lune dans l'en-tête (à côté du badge utilisateur) |
| **Modification de l'e-mail** | Non pris en charge actuellement |

## Voir aussi

- [AI Assistant](./ai-assistant.md) – Chat du constructeur de Workflow qui utilise les User Rules
- [Onglet Chat](../tabs/chat-tab.md) – Chat du tableau de bord qui utilise les User Rules
- [Chat Voice (TTS & STT)](./chat-voice.md) – Voix ElevenLabs configurée dans l'onglet Voice
- [Onglet MCP](../tabs/mcp-tab.md) – Clé API du serveur MCP et exposition des outils de workflow
- [Onglet Identifiants](../tabs/credentials-tab.md) – Clés API pour les nœuds IA et les intégrations
- [Security](./security.md) – Gestion des sessions, limitation de débit, chiffrement des identifiants
- [Single Sign-On](./sso.md) – Connecter un fournisseur OpenID Connect externe
- [OpenTelemetry Tracing](./opentelemetry.md) – Traçage distribué pour les exécutions de workflows et de nœuds
