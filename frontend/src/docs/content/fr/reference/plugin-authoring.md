# Création de plugins

Les plugins Heym sont des packages zip de confiance installés par un opérateur. Un package peut ajouter un ou plusieurs nœuds d'action ou de trigger personnalisés sans modifier l'application principale.

## Structure du package

Un zip de plugin doit contenir `plugin.json` à la racine du package ainsi que le fichier d'entrée Python nommé par `entry` (par défaut `handler.py`).

```text
acme-crm-plugin.zip
|-- plugin.json
|-- handler.py
|-- README.md
|-- icon.svg
`-- assets/
    `-- publisher.svg
```

`README.md` est facultatif et est servi comme page de documentation du plugin. Placez un fichier `icon.svg` à la racine du package pour définir l'icône par défaut des nœuds, ou indiquez un chemin `icon` spécifique à un nœud dans `plugin.json`.

## Manifest

Utilisez un `plugin.json` multi-nœuds lorsqu'un package expose plusieurs nœuds :

```json
{
  "id": "acme-crm",
  "name": "Acme CRM",
  "version": "1.0.0",
  "description": "Internal CRM actions and triggers",
  "entry": "handler.py",
  "dependencies": ["requests>=2.32.0"],
  "nodes": [
    {
      "key": "createContact",
      "name": "Create Contact",
      "kind": "action",
      "function": "create_contact",
      "description": "Create a CRM contact",
      "icon": "assets/publisher.svg",
      "dslHint": "Use this when the workflow needs to create an Acme CRM contact.",
      "fields": [
        {
          "key": "email",
          "label": "Email",
          "type": "string",
          "required": true
        },
        {
          "key": "sendWelcome",
          "label": "Send welcome email",
          "type": "boolean",
          "default": false
        }
      ]
    },
    {
      "key": "contactCreated",
      "name": "Contact Created",
      "kind": "trigger",
      "function": "contact_created",
      "description": "Start when a contact event arrives"
    }
  ]
}
```

Les manifests hérités à nœud unique sont également acceptés : omettez `nodes` et fournissez les champs `kind`, `fields`, `dslHint` et `docSlug` au niveau supérieur.

## Champs du manifest

| Champ | Remarques |
|-------|-----------|
| `id` | Identifiant de package en minuscules composé de lettres, de chiffres et de tirets. |
| `name` | Nom du package lisible par un humain. |
| `version` | Version du package utilisée pour l'affichage et la mise en cache du handler. |
| `description` | Brève description affichée dans l'interface et dans le contexte de l'assistant. |
| `entry` | Chemin du fichier handler Python à l'intérieur du zip ; par défaut `handler.py`. |
| `dependencies` | Dépendances pip facultatives installées avec `uv pip install`. |
| `nodes` | Nœuds personnalisés exposés par ce package. |

Chaque nœud doit posséder une `key` unique, un `name` et un `kind` valant soit `action`, soit `trigger`. Si `function` est omis, les actions appellent `run` et les triggers appellent `trigger`.

Les types de champs pris en charge sont `string`, `number`, `boolean` et `select`. Les champs de type select utilisent un tableau `options` d'objets `{ "label": "...", "value": "..." }`. Définissez `required` pour les champs obligatoires et `secret` pour les entrées masquées. Le manifest accepte également les métadonnées `default`, `dynamic` et `expression` pour les champs ; celles-ci sont stockées avec le manifest, mais les nœuds de plugin lisent actuellement la configuration enregistrée du nœud à l'exécution plutôt que de renseigner automatiquement la configuration manquante à partir des valeurs par défaut.

Les champs de type string non secrets sont affichés avec l'interface de saisie d'expression. À l'exécution, toute valeur de configuration de type string enregistrée commençant par `$` est résolue avant l'appel du handler.

## Fonctions handler

Les handlers d'action reçoivent les entrées du workflow, la configuration résolue et un petit contexte :

```python
def create_contact(inputs, config, ctx):
    email = config["email"]
    return {
        "email": email,
        "nodeId": ctx["node_id"],
    }
```

Les handlers de trigger reçoivent la configuration résolue et le contexte :

```python
def contact_created(config, ctx):
    return {
        "event": "contact.created",
        "nodeLabel": ctx["node_label"],
    }
```

Retournez un dictionnaire pour exposer des champs de sortie nommés. Si un handler retourne un autre type, Heym l'encapsule sous la forme `{ "value": result }`.

## Installation et exécution

Les plugins sont désactivés par défaut. Les opérateurs les activent avec `HEYM_PLUGINS_ENABLED=true` et restreignent leur gestion à `HEYM_PLUGIN_ADMIN_EMAILS`. Les fichiers des plugins installés résident sous `HEYM_PLUGINS_DIR` et doivent être montés de manière persistante dans les déploiements conteneurisés.

Le code des plugins est du Python de confiance, installé par l'opérateur, qui s'exécute dans le même processus que le backend. Il peut accéder au réseau et aux bibliothèques installées ; n'installez donc que des packages que vous êtes prêt à exécuter avec le même niveau de confiance que Heym lui-même.
