# Nœud MCP Call

Le nœud **MCP Call** appelle directement un outil [Model Context Protocol (MCP)](https://modelcontextprotocol.io) spécifique, sans qu'un LLM ne décide quel outil invoquer. Utilisez-le lorsque vous savez exactement quel outil appeler et que vous souhaitez une exécution déterministe en une seule étape.

## Vue d'ensemble

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Sortie | `$nodeLabel.result` |

## Quand l'utiliser

Utilisez le nœud MCP Call lorsque :
- Vous savez exactement quel outil MCP appeler au moment de la conception
- Vous n'avez pas besoin d'un LLM pour choisir entre plusieurs outils
- Vous souhaitez une alternative légère et déterministe à un nœud Agent pour l'invocation d'un seul outil

Utilisez plutôt le [nœud Agent](./agent-node.md) lorsqu'un LLM doit décider quels outils appeler ou lorsque vous avez besoin d'un raisonnement multi-étapes.

> Le nœud MCP Call **ne peut pas** être connecté à un nœud Agent en tant qu'outil.

## Configuration de la connexion

Le nœud se connecte à un seul serveur MCP. Choisissez un transport et renseignez les champs correspondants.

### SSE / Streamable HTTP

| Champ | Description |
|-------|-------------|
| `transport` | `sse` ou `streamable_http` |
| `url` | URL complète du serveur MCP (ex. `https://mcp.example.com/sse`). Prend en charge les expressions DSL. |
| `headers` | Objet JSON des en-têtes HTTP (ex. `{"Authorization": "Bearer ..."}`) |
| `timeoutSeconds` | Délai d'expiration par connexion en secondes (par défaut : 30) |

### stdio

| Champ | Description |
|-------|-------------|
| `transport` | `stdio` |
| `command` | Exécutable à lancer (ex. `npx`) |
| `args` | Tableau JSON d'arguments (ex. `["-y", "@modelcontextprotocol/server-filesystem"]`) |
| `env` | Objet JSON des variables d'environnement (ex. `{"API_KEY": "..."}`) |
| `timeoutSeconds` | Délai d'expiration par connexion en secondes (par défaut : 30) |

## Sélection de l'outil

1. Renseignez les champs de connexion.
2. Cliquez sur **Fetch Tools** — le nœud se connecte au serveur MCP et liste les outils disponibles.
3. Sélectionnez un outil dans la liste déroulante.

**La sélection d'un outil est obligatoire.** Le nœud ne s'exécutera pas sans un outil sélectionné.

## Arguments

Après avoir sélectionné un outil, le nœud affiche un champ de saisie pour chaque argument défini dans le schéma d'entrée de l'outil. Chaque champ accepte :
- Une valeur statique : `10`
- Une expression DSL : `$userInput.body.text`

Les arguments obligatoires sont marqués d'un `*`.

## Sortie

| Champ | Description |
|-------|-------------|
| `$nodeLabel.result` | Résultat de l'outil. Si la réponse est un JSON valide, il s'agit d'un objet analysé. Sinon, il s'agit d'une chaîne de caractères. |

## Exemple

Appeler un outil `search` sur un serveur MCP SSE, en transmettant la requête de l'utilisateur :

```json
{
  "type": "mcpCall",
  "data": {
    "label": "searchCall",
    "connection": {
      "transport": "sse",
      "url": "https://mcp.example.com/sse",
      "timeoutSeconds": 30
    },
    "selectedTool": "search",
    "toolArguments": {
      "query": "$userInput.body.text",
      "limit": "10"
    },
    "timeoutSeconds": 30
  }
}
```

Accéder au résultat en aval :

```
$searchCall.result.items   ← si le résultat est un objet JSON
$searchCall.result         ← si le résultat est une chaîne simple
```

## Remarques

- Le nœud résout les expressions DSL dans `url`, `headers`, `env` et toutes les valeurs de `toolArguments` avant d'appeler l'outil.
- Le `timeoutSeconds` au niveau du nœud s'applique à l'exécution globale ; le `connection.timeoutSeconds` s'applique à la session MCP elle-même.
- Si le serveur MCP est indisponible ou renvoie une erreur, le nœud échoue et le message d'erreur est disponible dans la trace du workflow.
