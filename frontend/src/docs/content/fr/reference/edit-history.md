# Historique des modifications

L'Historique des modifications suit les versions enregistrées d'un workflow. Utilisez-le pour consulter les changements dans le temps, comparer des versions ou revenir à un état antérieur.

**Remarque :** L'Historique des modifications est différent de l'[Historique des exécutions](./execution-history.md). L'Historique des modifications suit les **enregistrements** (modifications de la structure du workflow) ; l'Historique des exécutions suit les **exécutions** (exécutions passées).

## Où le trouver

**Barre d'outils de l'éditeur** → **Historique des modifications** (icône GitBranch)

## Versions

Une nouvelle version est créée à chaque fois que vous **enregistrez** le workflow. La liste affiche :

- **Actuelle** – Le dernier état enregistré (ce que vous voyez sur le canvas)
- **Version N** – Les enregistrements passés avec leurs horodatages

Les versions sans changement par rapport à la précédente sont masquées.

## Vue des différences

Sélectionnez une version pour voir ce qui a changé par rapport au workflow actuel :

| Type de changement | Description |
|-------------|--------------|
| **Nœuds** | Nœuds ajoutés, supprimés ou modifiés |
| **Edges** | Connexions ajoutées, supprimées ou modifiées |
| **Config** | Paramètres au niveau du workflow (auth, rate limits, etc.) |

Développez chaque changement pour voir les différences au niveau des champs (par ex. quelles propriétés de nœud ont changé).

## Aperçu

Pour voir à quoi ressemblait le workflow à une version passée, cliquez sur **Aperçu** à côté de Rétablir.

Un canvas en lecture seule s'ouvre, affichant les nœuds et les edges de cette version. Vous pouvez effectuer un panoramique et un zoom pour explorer la disposition ; aucune modification ne peut être apportée depuis cette vue.

## Rétablir

Pour restaurer une version passée :

1. Sélectionnez la version souhaitée
2. Cliquez sur **Rétablir**
3. Confirmez l'action
4. Le workflow actuel est remplacé par la version sélectionnée ; la page se recharge

Le rétablissement crée un nouvel état « actuel » — vous pouvez rétablir à nouveau si nécessaire.

## Effacer l'historique

Cliquez sur l'icône de corbeille dans l'en-tête de la boîte de dialogue pour supprimer tout l'historique des versions. Cette action est irréversible. Le workflow actuel est conservé ; seules les versions passées sont supprimées.

## Quand les versions sont créées

Les versions sont créées uniquement lorsque vous **enregistrez** (Ctrl/Cmd+S ou le bouton Enregistrer). Les modifications non enregistrées ne sont pas stockées dans l'Historique des modifications tant que vous n'avez pas enregistré.

Les modifications de compétences d'agent sont incluses dans ces instantanés. Pour parcourir ou restaurer une seule compétence sans rétablir l'intégralité du workflow, utilisez le bouton **Historique** sur la carte de cette compétence dans le panneau de propriétés du Nœud Agent. Voir [Nœud Agent](../nodes/agent-node.md#skill-history).

## Voir aussi

- [Historique des exécutions](./execution-history.md) – Exécutions passées et Bring to Canvas
- [Structure du workflow](./workflow-structure.md) – Format des nœuds et des edges
- [Onglet Workflows](../tabs/workflows-tab.md) – Créer et gérer des workflows
