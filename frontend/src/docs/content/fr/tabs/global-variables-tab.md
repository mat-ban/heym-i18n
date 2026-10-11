# Onglet Variables

L'onglet **Variables** gère le **Global Variable Store** – des données clé-valeur persistantes partagées entre tous vos workflows.

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Regarder la démo Variables</a></p>

## Aperçu

- Créer, modifier et supprimer des variables globales
- Les variables sont limitées à l'utilisateur et persistent entre les exécutions de workflow
- Référencez-les dans les expressions via `$global.variableName`

## Création d'une variable

1. Cliquez sur **New Variable**
2. Saisissez un **nom** (utilisé dans les expressions)
3. Définissez la **valeur** (chaîne, nombre, booléen, tableau ou objet)
4. Choisissez le **type de valeur** (Auto, String, Number, Boolean, Array, Object)

## Modification et suppression

- **Modifier** – Cliquez sur l'icône d'édition sur la ligne d'une variable
- **Supprimer** – Cliquez sur l'icône de corbeille ; les workflows qui l'utilisent nécessiteront un remplacement
- **Suppression groupée** – Sélectionnez plusieurs variables et utilisez **Delete selected**

## Utilisation dans les workflows

Référencez les variables dans n'importe quelle expression :

```
$global.environment
$global.settings.baseUrl
```

Vous pouvez également définir des variables globales depuis un [Nœud Variable](../nodes/variable-node.md) en activant **Store in Global Variable Store**.

## Voir aussi

- [Global Variables](../reference/global-variables.md) – Guide de référence
- [Nœud Variable](../nodes/variable-node.md) – Définir des variables avec `isGlobal`
- [Expression DSL](../reference/expression-dsl.md) – Syntaxe `$global`
- [Onglet Chat](./chat-tab.md) – Le Chat peut accéder aux variables globales
- [Contextual Showcase](../reference/contextual-showcase.md) – Guide de page compact pour les surfaces du dashboard
