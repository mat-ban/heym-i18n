# Présentation contextuelle

La **Présentation contextuelle** est un rail de guidage léger intégré à l'application qui explique la page sur laquelle vous vous trouvez actuellement, sans vous entraîner immédiatement dans un parcours de documentation complet.

## Fonctionnalités

- Affiche un court résumé de la page en cours
- Maintient la première couche concise pour éviter toute surcharge
- Permet de développer un complément de détail uniquement en cas de besoin
- Renvoie vers la page de documentation complète pour un approfondissement

## Emplacement d'affichage

Dans la v1, la présentation est disponible sur les surfaces principales authentifiées de Heym :

- Onglets du Dashboard
- [Évaluations](../tabs/evals-tab.md)
- [Documentation](../getting-started/introduction.md)
- Le canvas de l'éditeur de Workflow

Les pages publiques telles que la connexion, l'inscription, le portail Chat et la revue HITL n'affichent pas la présentation.

## Accès

### Desktop

- Un Trigger **Page Guide** fixe apparaît sur le bord droit de l'écran
- La présentation s'ouvre sous forme de tiroir latéral droit
- Elle reste fermée par défaut
- Un teaser unique permet de révéler l'existence du guide sans l'ouvrir de force

### Mobile

- Le même contenu est accessible via un bouton flottant **Page Guide**
- Il s'ouvre dans une bottom sheet plutôt que dans un rail latéral droit

## Modèle de contenu

Chaque entrée de la présentation utilise une définition structurée plutôt qu'un composant entièrement personnalisé.

- **Titre** – Ce qu'est cette page
- **Résumé** – Une courte explication
- **Puces** – Quelques repères lisibles en un coup d'œil
- **Points clés** – Petites cartes pour la valeur essentielle ou les schémas d'usage
- **Plus de détails** – Sections repliées pour un contexte supplémentaire
- **Actions** – Généralement un ou deux liens, le plus souvent vers la documentation complète

Cela permet de garder le système flexible tout en évitant les panneaux d'aide longs et bruyants.

## Sensibilité au contexte

La présentation s'adapte à la surface en cours.

- Chaque onglet du Dashboard dispose de son propre résumé
- L'éditeur renvoie vers [Fonctionnalités du Canvas](./canvas-features.md)
- La page de documentation utilise un aperçu générique et, lorsque cela est possible, renvoie vers l'article en cours que vous avez déjà ouvert

## Persistance

La présentation stocke une petite quantité d'état d'interface personnel dans le stockage du navigateur :

- Si le panneau ou la sheet était ouvert en dernier
- Quels contextes de page ont déjà affiché le teaser
- La dernière section de détail développée par contexte

## Raison d'être

L'objectif est de rendre Heym plus facile à apprendre sans ajouter davantage d'éléments d'interface lourds.

- Un guidage court et toujours à portée pour l'orientation
- Un chemin clair vers une documentation plus approfondie
- Une faible interruption pour les utilisateurs expérimentés

## Voir aussi

- [Onglet Workflows](../tabs/workflows-tab.md) – Surface principale du Dashboard
- [Onglet Évaluations](../tabs/evals-tab.md) – Workflows d'évaluation
- [Fonctionnalités du Canvas](./canvas-features.md) – Comportement de l'éditeur et débogage
- [Quick Drawer](./quick-drawer.md) – L'autre surface utilitaire fixe du côté droit
