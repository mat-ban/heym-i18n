# Onglet Modèles

L'onglet Modèles vous permet d'enregistrer, de parcourir et de réutiliser des workflows complets ainsi que des nœuds individuels. Partagez ce que vous avez construit une fois et appliquez-le à de nouveaux projets en un clic.

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Regarder la démo des Modèles</a></p>

## Aperçu

Il existe deux types de modèles :

- **Modèles de workflow** — enregistrez un workflow complet (tous les nœuds et connexions) comme point de départ réutilisable.
- **Modèles de nœud** — enregistrez un nœud configuré unique (par ex. un Nœud LLM ajusté ou un Nœud HTTP personnalisé) pour le réutiliser dans différents workflows.

Basculez entre les deux à l'aide du sélecteur **Workflows / Nodes** en haut de l'onglet.

Utilisez la barre de recherche pour filtrer les modèles visibles par nom, description, tags ou type de nœud.

---

## Créer un modèle

### Modèle de workflow

1. Ouvrez le workflow que vous souhaitez partager dans l'éditeur.
2. Cliquez sur **Partager comme modèle** dans la barre d'outils supérieure.
3. Renseignez le nom, la description et les tags facultatifs.
4. Choisissez la visibilité : **Tout le monde** (tous les utilisateurs) ou **Utilisateurs spécifiques** (saisissez les noms d'utilisateur et/ou sélectionnez des équipes).
5. Cliquez sur **Partager**. Une notification verte confirme la réussite.

### Modèle de nœud

1. Faites un clic droit sur n'importe quel nœud du canvas.
2. Sélectionnez **Partager comme modèle** dans le menu contextuel.
3. Remplissez le formulaire et cliquez sur **Partager**.

---

## Utiliser un modèle

### Modèle de workflow

1. Ouvrez l'onglet **Modèles** et assurez-vous que **Workflows** est sélectionné.
2. Cliquez sur une carte pour la prévisualiser, ou cliquez directement sur **Utiliser**.
3. Le workflow est cloné dans un nouveau workflow qui s'ouvre dans l'éditeur.

### Modèle de nœud

1. Ouvrez l'onglet **Modèles** et sélectionnez **Nodes**.
2. Cliquez sur **Utiliser** sur la carte d'un modèle de nœud.
3. Une boîte de dialogue apparaît — choisissez où ajouter le nœud :
   - **Nouveau workflow** — crée un nouveau workflow contenant uniquement ce nœud.
   - **Workflow existant** — choisissez dans votre liste de workflows ; le nœud est inséré automatiquement à l'ouverture de l'éditeur.

---

## Prévisualisation

Cliquez sur n'importe quelle carte de modèle pour ouvrir une prévisualisation complète :

- **Vignettes des cartes** — les cartes de modèles affichent un instantané du canvas en lecture seule ajusté, aussi bien pour les workflows que pour les modèles de nœud unique.
- **Modèles de workflow** — un canvas en lecture seule qui reprend le style de prévisualisation de l'historique d'édition, incluant le déplacement et le zoom.
- **Modèles de nœud** — le nœud enregistré s'ouvre sur le même canvas en lecture seule sous forme de prévisualisation d'un nœud unique.
- **Détails du nœud** — cliquez sur n'importe quel nœud de la prévisualisation pour inspecter sa configuration enregistrée dans le panneau latéral.
- Les tags, le nombre d'utilisations et le **propriétaire** sont affichés pour tous les modèles.

Appuyez sur **ESC** ou cliquez à l'extérieur pour fermer la prévisualisation.

---

## Gérer les modèles

- **Modifier** – Si vous êtes le propriétaire du modèle, survolez la carte et cliquez sur l'icône crayon pour mettre à jour son nom, sa description, ses tags ou sa visibilité
- **Supprimer** – Si vous êtes le propriétaire du modèle, survolez la carte et supprimez le modèle après l'invite de confirmation
- **Actions réservées au propriétaire** – Les contrôles de modification et de suppression ne sont affichés que pour les modèles que vous avez créés

---

## Palette de commandes (CTRL+K)

Les modèles (workflow et nœud) sont accessibles depuis la palette de commandes **CTRL+K**. Sélectionnez un modèle pour l'utiliser immédiatement — les modèles de workflow s'ouvrent dans l'éditeur, les modèles de nœud demandent une destination.

---

## Modèles dans le Chat

Vous pouvez poser des questions à l'IA sur vos modèles — elle connaît tous les modèles de votre espace de travail.

---

## Visibilité

| Paramètre | Qui peut le voir |
|---|---|
| Tout le monde | Tous les utilisateurs de la plateforme |
| Utilisateurs spécifiques | Les utilisateurs que vous listez par nom et/ou les équipes que vous sélectionnez — tous les membres de l'équipe y ont accès |

Lors d'un partage avec **Utilisateurs spécifiques**, vous pouvez ajouter à la fois des utilisateurs individuels (par nom) et des équipes. Les membres de l'équipe voient le modèle dans l'onglet Modèles et peuvent l'utiliser.

---

## Voir aussi

- [Équipes](../reference/teams.md) – Partager des modèles avec des équipes
- [Fonctionnalités du Canvas](../reference/canvas-features.md)
- [Structure du workflow](../reference/workflow-structure.md)
- [Types de nœuds](../reference/node-types.md)
- [Onglet Chat](./chat-tab.md)
- [Présentation contextuelle](../reference/contextual-showcase.md) – Guide court des onglets du tableau de bord
