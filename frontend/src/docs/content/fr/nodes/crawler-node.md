# Crawler

Le nœud **Crawler** scrape des pages web à l'aide de FlareSolverr, avec extraction HTML optionnelle via des sélecteurs CSS. Utilisez-le pour le web scraping et l'extraction de contenu.

## Vue d'ensemble

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Sortie | `$nodeLabel.body` (HTML ou contenu extrait) |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `credentialId` | UUID | Identifiant FlareSolverr depuis [Identifiants](../tabs/credentials-tab.md) |
| `crawlerUrl` | expression | URL à scraper (prend en charge les expressions) |
| `crawlerWaitSeconds` | number | Nombre de secondes d'attente avant le scraping (par défaut : 0) |
| `crawlerMaxTimeout` | number | Timeout maximal en ms (par défaut : 60000) |
| `crawlerMode` | string | `"basic"` ou autres modes |
| `crawlerSelectors` | array | Sélecteurs CSS pour l'extraction. Chacun : `{ selector, attribute? }` |

## Exemple

```json
{
  "type": "crawler",
  "data": {
    "label": "scrapePage",
    "credentialId": "flaresolverr-credential-uuid",
    "crawlerUrl": "$userInput.body.url",
    "crawlerWaitSeconds": 2,
    "crawlerSelectors": [
      { "selector": "h1" },
      { "selector": ".content", "attribute": "innerHTML" }
    ]
  }
}
```

## Sécurité des sorties

- L'URL FlareSolverr stockée dans l'identifiant doit utiliser `http://` ou `https://` et ne peut pas résoudre vers une adresse link-local ou de métadonnées cloud. L'ensemble refusé est `169.254.0.0/16`, `fe80::/10`, les adresses de métadonnées IPv6 d'Alibaba Cloud et d'AWS, ainsi que les formes de transition IPv6 susceptibles d'en transporter une. Il s'agit d'une liste d'endpoints connus, et non d'une garantie concernant chaque fournisseur.
- Les adresses loopback et privées sont autorisées volontairement, afin que la configuration documentée `http://localhost:8191` et les noms de services compose tels que `http://flaresolverr:8191` continuent de fonctionner. La conséquence est que ce champ peut également être pointé vers tout autre service accessible par le backend sur ces adresses, et la réponse est renvoyée dans la sortie du nœud. Le partage d'identifiants ne contient pas ce risque : tout utilisateur connecté peut créer son propre identifiant FlareSolverr, donc retenir un identifiant existant ne change rien. Les contrôles réellement applicables sont la confiance accordée aux personnes autorisées à concevoir des workflows, et les règles réseau qui limitent ce que le backend peut atteindre.
- Heym fixe l'adresse résolue avant de se connecter, de sorte qu'une réponse DNS ne peut pas déplacer la requête vers une adresse de métadonnées après la vérification. Les proxys d'environnement sont désactivés tant que la protection est active, et les redirections ne sont pas suivies.
- La page que FlareSolverr récupère ensuite pour vous constitue un saut distinct que FlareSolverr résout lui-même. Heym ne l'inspecte pas, donc restreindre les destinations auxquelles le conteneur FlareSolverr peut se connecter relève de votre politique réseau.
- Les déploiements auto-hébergés de confiance peuvent lever la règle sur les métadonnées avec `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Conservez la valeur par défaut sur les déploiements hébergés ou multi-tenant.

## Voir aussi

- [Types de nœuds](../reference/node-types.md) – Vue d'ensemble de tous les types de nœuds
- [Nœud Playwright](./playwright-node.md) – Alternative d'automatisation de navigateur
- [Onglet Identifiants](../tabs/credentials-tab.md) – Ajouter un identifiant FlareSolverr
