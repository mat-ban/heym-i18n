# Tiroir rapide

Le **Tiroir rapide** est un panneau d'exécution rapide situé à droite pour les workflows. Il apparaît sur les pages authentifiées telles que l'onglet [Workflows](../tabs/workflows-tab.md) du tableau de bord, la documentation et les Évaluations.

## Accès

- Cliquez sur le trigger fixe **Quick / Workflows** sur le bord droit, au milieu de l'écran
- Lorsque la [Vitrine contextuelle](./contextual-showcase.md) est également disponible, son trigger **Page Guide** se trouve au-dessus de Quick Workflows
- Le tiroir s'ouvre depuis la droite et décale la page actuelle vers la gauche avec un léger redimensionnement
- Sur mobile, le Tiroir rapide est masqué
- Le tiroir n'est pas affiché sur l'éditeur de workflow, les pages de connexion/inscription, le portail ou les pages de revue HITL

## Recherche de workflows

Utilisez le champ de filtre en haut du tiroir pour rechercher des workflows par :

- Nom du workflow
- Description du workflow

La recherche est insensible à la casse et met à jour la liste immédiatement.

## Workflows épinglés

Épinglez des workflows pour les maintenir en haut du tiroir.

- Les workflows épinglés apparaissent dans leur propre section au-dessus de la liste complète
- Les nouveaux épinglages sont ajoutés en haut
- L'ordre des épinglages est préservé entre les rechargements dans le stockage du navigateur

## Exécution des workflows

Sélectionnez un workflow pour ouvrir son formulaire de saisie.

- Les champs de saisie sont affichés verticalement dans l'ordre du tiroir
- Cliquez sur **Run Workflow** pour exécuter le workflow sélectionné
- Cliquez sur **Stop Workflow** pour annuler une exécution en cours depuis le tiroir
- Les workflows sans champs de saisie peuvent toujours être exécutés directement

Le tiroir utilise la même API d'exécution de workflow que les autres surfaces d'exécution Heym, de sorte que les sorties et le comportement d'exécution restent cohérents.

L'arrêt d'une exécution depuis le tiroir annule également l'exécution backend active, y compris toute tâche de navigateur Playwright en cours pour cette exécution de workflow.

## Progression et résultats

Après le démarrage d'une exécution, le tiroir affiche :

- La progression en streaming des étapes pour les nœuds au fur et à mesure de leur démarrage et de leur fin
- Le statut final : `success`, `error` ou `pending`
- Les sorties finales dans un panneau JSON compact
- Les entrées d'historique marquées avec `Quick Drawer`

`pending` signifie que le workflow attend une action ultérieure telle qu'une revue humaine.

## Stockage du navigateur

Le Tiroir rapide stocke les préférences personnelles dans `localStorage` :

- Les ID des workflows épinglés
- Le dernier workflow sélectionné

Le tiroir ne conserve **pas** les valeurs de saisie dans cette version.

## Périmètre

Le Tiroir rapide est intentionnellement une surface d'exécution légère.

- Inclus : recherche, épinglage, sélection, saisie, exécution, progression, résultat
- Exclus : création de workflow, édition, gestion des dossiers et actions sur le canvas

## Voir aussi

- [Onglet Workflows](../tabs/workflows-tab.md) – Liste principale des workflows, dossiers et gestion
- [Démarrage rapide](../getting-started/quick-start.md) – Créez et exécutez votre premier workflow
- [Historique d'exécution](./execution-history.md) – Consultez les exécutions passées
- [Webhooks](./webhooks.md) – Déclenchez des workflows via HTTP
- [Vitrine contextuelle](./contextual-showcase.md) – Rail de guidage au niveau de la page qui complète le Tiroir rapide
