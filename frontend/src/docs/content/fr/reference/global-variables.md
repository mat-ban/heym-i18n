# Variables globales

Le **Global Variable Store** contient des données clé-valeur persistantes, propres à l'utilisateur, qui survivent aux exécutions de workflow. Utilisez-le pour la configuration, les feature flags, les compteurs ou tout état partagé dont plusieurs workflows ont besoin.

> **Ne stockez pas de secrets ici.** Les variables globales ne sont pas un coffre-fort de secrets : les valeurs sont stockées non chiffrées, elles sont renvoyées intégralement à toute personne avec qui vous les partagez, et les collaborateurs peuvent les modifier. Les clés API, mots de passe et tokens doivent être placés dans les [Identifiants](./credentials.md), qui les chiffre au repos et ne renvoie jamais le secret au client.

## Local vs Global

| Store | Syntaxe | Portée | Persistance |
|-------|--------|-------|-------------|
| **Workflow-local** | `$vars.variableName` | Exécution en cours uniquement | En mémoire, perdu à la fin de l'exécution |
| **Global** | `$global.variableName` | Tous les workflows de l'utilisateur | Persisté en base de données |

## Créer des variables globales

1. **Depuis l'onglet Variables** – [Onglet Variables](../tabs/global-variables-tab.md) : créez, modifiez et supprimez des variables directement.
2. **Depuis un Nœud Variable** – Activez **Store in Global Variable Store** (`isGlobal: true`) dans les propriétés du nœud. La variable est écrite dans le store lors de l'exécution du workflow.

## Utilisation dans les expressions

Accédez aux variables globales avec `$global.variableName` :

```
$global.environment
$global.settings.baseUrl
$global.userId
```

Utilisez les mêmes méthodes que pour les variables locales au workflow (par ex. `.upper()`, `.length`, `.add()` pour les tableaux).

## Types de valeurs

Types pris en charge : `string`, `number`, `boolean`, `array`, `object`. Choisissez le type lors de la création ou de la modification d'une variable.

## Partager des variables globales

Vous pouvez partager une variable globale avec d'autres utilisateurs ou [Teams](./teams.md) afin qu'ils puissent l'utiliser dans leurs propres workflows.

- **Partager avec un utilisateur** – Cliquez sur l'icône de partage à côté d'une variable dont vous êtes propriétaire, saisissez l'e-mail du destinataire, puis cliquez sur **Share**. Le destinataire verra la variable dans sa liste de Variables globales avec un badge **Shared** et un libellé « Shared by &lt;votre e-mail&gt; ».
- **Partager avec une team** – Dans la boîte de dialogue de partage, sélectionnez une team et cliquez sur **Add**. Tous les membres de la team y gagnent accès.
- **Accès modifiable** – Les destinataires peuvent consulter, modifier et référencer la variable partagée via `$global.variableName` dans leurs workflows. Seul le propriétaire peut partager, annuler le partage ou supprimer la variable.
- **Conflits de noms** – Si un destinataire possède déjà une variable portant le même nom, sa propre variable prévaut sur celle partagée.
- **Annuler le partage** – Ouvrez la boîte de dialogue de partage de la variable et cliquez sur le bouton **×** à côté de l'utilisateur dont vous souhaitez retirer l'accès.

## Intégration Chat

Les variables globales sont accessibles à l'assistant [Chat](../tabs/chat-tab.md). Le LLM peut les référencer lorsqu'il répond à des questions ou génère du contenu.

## Voir aussi

- [Onglet Variables](../tabs/global-variables-tab.md) – Gérer les variables globales dans l'interface
- [Nœud Variable](../nodes/variable-node.md) – Définir des variables avec `isGlobal`
- [Expression DSL](./expression-dsl.md) – Syntaxe `$global`
