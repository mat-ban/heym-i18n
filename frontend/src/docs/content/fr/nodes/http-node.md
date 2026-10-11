# HTTP

Le nœud **HTTP** effectue des requêtes HTTP en utilisant la syntaxe cURL. Il peut constituer un point de départ de workflow (sans edge entrant) ou recevoir une entrée depuis des nœuds en amont.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 0 ou 1 |
| Sorties | 1 |
| Sortie | `$nodeLabel.status`, `$nodeLabel.body`, `$nodeLabel.headers` |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `label` | string | Identifiant du nœud (camelCase) |
| `curl` | string | Commande cURL (ex : `curl -X GET https://api.example.com`) |

## Format de la réponse

```json
{
  "status": 200,
  "headers": { "content-type": "application/json", ... },
  "body": "response body or parsed JSON",
  "request": { "method": "POST", "url": "...", "headers": {...} }
}
```

## Accès à la réponse

- `$httpNode.status` – Code de statut HTTP
- `$httpNode.body` – Corps de la réponse (chaîne ou JSON analysé)
- `$httpNode.body.fieldName` – Accès aux champs JSON
- `$httpNode.headers` – En-têtes de la réponse

## Exemple

```json
{
  "type": "http",
  "data": {
    "label": "fetchApi",
    "curl": "curl -X GET https://api.example.com/data"
  }
}
```

Utilisez la syntaxe cURL avec `-H` pour les en-têtes, `-d` pour le corps d'une requête POST, etc. Les expressions peuvent être utilisées partout dans la chaîne curl, y compris dans l'URL, un en-tête ou une ligne d'en-tête complète. Un [Identifiant Header](../reference/credentials.md) se résout en `key: value`, de sorte que `-H "$credentials.MyApiKey"` envoie l'en-tête complet :

```
curl -X GET "https://api.example.com/search?q=$query.body.text.urlEncode()" -H "$credentials.MyApiKey"
```

Les guillemets et les espaces à l'intérieur d'une expression appartiennent à l'expression, et non à la commande cURL, de sorte que les méthodes prenant des arguments de type chaîne fonctionnent en ligne :

```
curl "https://r.jina.ai/$url.text.replaceAll("\n", "").strip()" -H "Authorization: $credentials.Jina"
```

## Authentification avec les Identifiants

`$credentials.Name` se résout en une valeur différente selon le type d'[identifiant](../reference/credentials.md), de sorte que la ligne d'en-tête dépend du type :

| Type d'identifiant | `$credentials.Name` se résout en | En-tête |
|-----------------|---------------------------------|--------|
| Bearer | `Bearer <token>` | `-H "Authorization: $credentials.Name"` |
| Header | `<Header-Name>: <value>` | `-H "$credentials.Name"` |
| OpenAI, Custom, Cohere | La clé API brute | `-H "Authorization: Bearer $credentials.Name"` |
| Google | La clé API brute | `-H "x-goog-api-key: $credentials.Name"` |
| ElevenLabs | La clé API brute | `-H "xi-api-key: $credentials.Name"` |
| Google Sheets, Google Drive | Un token d'accès OAuth frais, rafraîchi à son expiration | `-H "Authorization: Bearer $credentials.Name"` |
| GitHub, Notion, Sentry | Le token | `-H "Authorization: Bearer $credentials.Name"` |

Un identifiant Bearer porte déjà le préfixe `Bearer `, donc en ajouter un autre envoie `Bearer Bearer …`. Les identifiants Google Sheets et Google Drive vous permettent d'appeler des API Google que leur nœud ne couvre pas, comme l'ajout d'un onglet à une feuille de calcul, dans les scopes accordés à l'identifiant. Lorsqu'un nom n'est pas un identifiant simple (il contient `-`, commence par un chiffre ou est un mot réservé), utilisez la forme entre crochets : `-H "Authorization: $credentials["my-api-key"]"`.

Lorsque l'[Assistant IA](../reference/ai-assistant.md) ou le [Chat](../tabs/chat-tab.md) construit une requête HTTP nécessitant une authentification et qu'aucun nœud dédié ne couvre le service, il demande quel identifiant utiliser. Choisissez-en un, modifiez le nom d'en-tête prérempli si l'API en attend un différent, et il rédige la ligne d'en-tête pour vous. L'assistant voit les noms et types d'identifiants, jamais leurs valeurs. Si vous ne disposez d'aucun identifiant adapté, la question propose d'en créer un. Les secrets qui atteignent la sortie du nœud, tels que les `request.headers` envoyés, sont masqués dans les résultats d'exécution.
## Sécurité des sorties réseau

- Par défaut, l'URL doit utiliser `http://` ou `https://` et ne résoudre que vers des adresses publiques. Les destinations de type loopback, privées, link-local, multicast et cloud-metadata sont bloquées.
- Heym valide les adresses résolues et fixe la cible de connexion afin de prévenir le DNS rebinding. Les proxys d'environnement sont désactivés tant que la protection est active. Les redirections ne sont pas suivies par défaut ; ajoutez l'option `-L` de cURL pour les suivre. Lorsqu'elles sont activées, chaque saut de redirection est vérifié selon la même politique d'adresses publiques et fixé avant la connexion.
- Les déploiements auto-hébergés de confiance qui se connectent intentionnellement à des services internes peuvent définir `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Conservez la valeur par défaut sur les déploiements hébergés ou multi-tenant.

**Note de mise à niveau pour la v0.0.105 :** cette politique à l'échelle de l'instance protège désormais également les destinations dérivées des Identifiants utilisées par Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, l'exécution de LLM personnalisés et la découverte de modèles, l'assistant IA, les guardrails et les embeddings RAG. Les Identifiants existants qui pointent vers des adresses loopback, privées ou link-local sont refusés, sauf si `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` est activé sur une instance auto-hébergée de confiance. Tant que la protection est active, les clients HTTP protégés ignorent `HTTP_PROXY` et `HTTPS_PROXY` ; l'activation de l'option de désactivation les rétablit. Les bundles de CA d'opérateur configurés via `SSL_CERT_FILE` ou `SSL_CERT_DIR` restent pris en charge. ClickHouse est vérifié avant l'ouverture de la connexion mais n'est pas fixé au moment du dial, car clickhouse-connect embarque son propre transport urllib3.

## Voir aussi

- [Types de nœuds](../reference/node-types.md) – Vue d'ensemble de tous les types de nœuds
- [Triggers](../reference/triggers.md) – HTTP comme point d'entrée de Workflow
- [Onglet Identifiants](../tabs/credentials-tab.md) – Ajouter des clés API pour les requêtes authentifiées
