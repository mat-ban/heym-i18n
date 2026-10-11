# Sécurité

Pratiques et configuration de sécurité pour la plateforme Heym.

## Politique de mot de passe

Tous les mots de passe — lors de l'inscription et du changement de mot de passe — doivent respecter les exigences suivantes :

| Règle | Exigence |
|------|-------------|
| Longueur minimale | 8 caractères |
| Majuscule | Au moins une lettre majuscule (A–Z) |
| Minuscule | Au moins une lettre minuscule (a–z) |
| Chiffre | Au moins un chiffre (0–9) |

Ces règles sont appliquées à la fois côté frontend et côté backend (validateur Pydantic). Une requête contenant un mot de passe non conforme est rejetée avec une réponse `422 Unprocessable Entity` avant toute écriture en base de données.

**Exemple de mot de passe valide :** `MyWorkflow7!`

## Gestion des sessions

- Les access tokens sont stockés dans des cookies **HttpOnly**, et non dans `localStorage`. Cela empêche JavaScript (y compris les payloads XSS) de lire le token.
- Le refresh token est limité au chemin `/api/auth/refresh` et ne peut pas être envoyé vers d'autres endpoints.
- Chaque appel à `/api/auth/refresh` **fait tourner** le refresh token : l'ancien token est immédiatement révoqué et un nouveau est émis. Rejouer un refresh token déjà utilisé renvoie `401`.

## Limitation de débit

Les endpoints suivants sont soumis à une limitation de débit par IP :

| Endpoint | Limite | Durée du bannissement |
|----------|-------|--------------|
| `POST /api/auth/login` | 10 req / 60 s | 15 min |
| `POST /api/auth/register` | 5 req / 60 s | 10 min |
| `POST /register` (clients OAuth) | 5 req / 60 s | 10 min |
| Connexion au portail | 3 tentatives | 24 h |

Lorsque `REDIS_URL` est configuré, les limites de débit sont partagées entre tous les workers backend. Sans cette variable, les limites s'appliquent par processus worker.

## Chiffrement des identifiants

Toutes les clés API, URLs de webhook et bearer tokens stockés dans le panneau [Identifiants](../tabs/credentials-tab.md) sont chiffrés au repos avec AES-256 (Fernet) avant d'être écrits en base de données. La clé est dérivée de la variable d'environnement `ENCRYPTION_KEY`. Les scripts `run.sh` et `deploy.sh` génèrent automatiquement une valeur robuste lorsqu'elle est vide ; l'application refuse de démarrer si `ENCRYPTION_KEY` est vide ou laissée à une valeur d'exemple connue.

## Clé API MCP

La clé API MCP sert à authentifier les clients MCP externes qui se connectent à l'endpoint `/api/mcp/sse`. Lorsque la connexion SSE est établie, un token de session à durée de vie courte (1 heure) est émis et intégré dans l'URL de l'endpoint de messagerie à la place de la véritable clé API, ce qui évite que la clé n'apparaisse dans les logs d'accès du serveur. Consultez l'[onglet MCP](../tabs/mcp-tab.md) pour la configuration.

## OAuth / PKCE

Le serveur d'autorisation OAuth 2.0 (utilisé pour les clients MCP) ne prend en charge que le grant `authorization_code` avec PKCE (`S256`). Le formulaire de consentement utilise des tokens CSRF HMAC-SHA256 valables 10 minutes. Toutes les valeurs affichées sur la page de consentement sont échappées en HTML.

## Tokens d'exécution

Les [tokens d'exécution](./execution-tokens.md) sont des JWT à portée limitée permettant d'appeler l'endpoint d'exécution d'un workflow depuis des systèmes externes. Contrairement aux tokens de session utilisateur, ils sont :

- **Limités à un seul workflow** — un token est rejeté pour tout autre workflow.
- **Révoquables indépendamment** — la révocation d'un token n'a aucun effet sur la session de l'utilisateur émetteur.
- **À durée de vie courte ou longue** — choisissez un TTL de 60 secondes à 10 ans.

Les tokens sont signés avec le même secret applicatif (`SECRET_KEY`) et vérifiés à chaque requête : signature, expiration, correspondance du claim `wid` et statut de révocation. Consultez [Tokens d'exécution](./execution-tokens.md) pour la configuration et la référence API.

## Sécurité du contenu

Utilisez les [Guardrails](./guardrails.md) sur les nœuds LLM et Agent pour bloquer les messages utilisateur dangereux ou contraires aux politiques avant qu'ils n'atteignent le modèle. Les Guardrails prennent en charge neuf catégories de contenu (violence, discours haineux, contenu sexuel, etc.) avec des niveaux de sensibilité configurables.

## Sandbox des outils Python

Les outils Python définis par l'utilisateur sur le [nœud Agent](../nodes/agent-node.md) exécutent du code non fiable. Par défaut, Heym exécute chaque outil dans un conteneur Docker jetable et durci avec :

- aucun accès réseau,
- un système de fichiers racine en lecture seule avec un petit répertoire de travail `tmpfs`,
- un utilisateur non root avec toutes les capacités Linux supprimées et `no-new-privileges`,
- des limites strictes de CPU, de mémoire et de PID, et
- **aucun socket Docker** monté, afin qu'un outil ne puisse pas atteindre le démon Docker de l'hôte.

Le backend d'exécution est contrôlé par la variable d'environnement `HEYM_PYTHON_TOOL_SANDBOX` :

| Valeur | Comportement |
|-------|----------|
| `auto` (par défaut) | Exécution dans le conteneur Docker durci. Si Docker est indisponible, l'exécution **échoue en mode fermé** — elle n'exécute pas silencieusement du code non fiable sans isolation du système d'exploitation. |
| `docker` | Identique à `auto`, mais sans repli possible. |
| `subprocess` | Exécution dans un sous-processus local en cours de processus, protégé par une liste d'autorisation d'imports. Ce mode **ne constitue pas une frontière de sécurité** et est destiné uniquement au code de confiance ou au développement local. `run.sh` le sélectionne pour le développement natif. |

Définissez `HEYM_PYTHON_TOOL_IMAGE` pour épingler l'image de la sandbox ; lorsqu'elle est vide, Heym détecte automatiquement l'image du backend en cours d'exécution. Les restrictions en cours de processus (une liste d'autorisation d'imports ainsi qu'un filtrage des attributs et de l'introspection) sont appliquées en défense en profondeur, mais le conteneur constitue la véritable frontière d'isolation — conservez le mode `auto` (ou `docker`) par défaut pour les déploiements multi-utilisateurs et en production.

## Sandbox des Skills

Les skills Python attachés à un [Nœud Agent](../nodes/agent-node.md) exécutent eux aussi du code non fiable — un skill peut arriver tel quel dans un workflow partagé ou dans un modèle à visibilité `everyone` — c'est pourquoi les skills passent par le **même** commutateur `HEYM_PYTHON_TOOL_SANDBOX` que les outils Python et échouent de la même manière en mode fermé. Le conteneur de skills est durci à l'identique (non-root, toutes les capacités supprimées, `no-new-privileges`, système de fichiers racine en lecture seule, limites CPU/mémoire/PID, et **aucun socket Docker**), avec deux différences délibérées car les skills en ont légitimement besoin :

- **L'accès réseau sortant est autorisé** (les skills appellent des API et installent leurs propres dépendances via `uv`), et
- **un espace de travail inscriptible est monté** afin que les skills puissent générer des fichiers de sortie et lire les fichiers Heym Drive.

L'espace de travail est partagé avec le conteneur frère jetable via le même volume Docker nommé qu'utilise le runner Codex (`heym-codex-workspaces`, monté sur `/app/data/codex-workspaces`). Seul le sous-répertoire propre à cette exécution est monté dans le conteneur frère — via un `volume-subpath` par exécution — afin qu'un skill ne voie jamais les données d'espace de travail d'une autre exécution ou de Codex. La stack Docker Compose monte toujours ce volume ; l'exécution en conteneur unique `docker run` doit inclure `-v heym-codex-workspaces:/app/data/codex-workspaces` pour les skills Python comme pour Codex. Si le volume est absent en mode `auto`/`docker`, l'exécution du skill **échoue en mode fermé** plutôt que de s'exécuter dans le backend. Comme les montages de sous-chemins par exécution nécessitent **Docker Engine 25.0 ou une version ultérieure**, les moteurs plus anciens doivent soit être mis à niveau, soit exécuter les skills de confiance avec `HEYM_PYTHON_TOOL_SANDBOX=subprocess`.

Seules des variables d'environnement non secrètes et portables (paramètres de proxy et de bundle CA, locale) sont transmises dans le conteneur ; les URL de base de données, `SECRET_KEY`/`ENCRYPTION_KEY`, les clés d'API des fournisseurs et les secrets OAuth sont retenus par une liste d'autorisation. Les chemins de fichiers des skills sont validés pour rester à l'intérieur de l'espace de travail, et les liens symboliques placés dans le répertoire de sortie (y compris la sentinelle `_hitl_request.json`) ne sont jamais suivis. Remplacez les valeurs par défaut avec `HEYM_SKILL_IMAGE`, `HEYM_SKILL_NETWORK`, `HEYM_SKILL_MEMORY`, `HEYM_SKILL_CPUS`, `HEYM_SKILL_PIDS` et `HEYM_SKILL_USER` si nécessaire.

Comme pour les outils, le mode `subprocess` exécute le skill dans le processus backend et **ne constitue pas une frontière de sécurité** — utilisez-le uniquement pour un usage mono-utilisateur de confiance ou le développement local (`run.sh` le sélectionne pour le développement natif).

## Sandbox du Nœud Code

Le [Nœud Code](../nodes/code-node.md) exécute du Python utilisateur arbitraire accompagné de dépendances tierces arbitraires ; il s'agit donc du plus strict des trois sandboxes et du seul à **ne disposer d'aucune échappatoire** : il ne lit aucune variable de mode sandbox, n'a pas de mode `subprocess` et échoue en mode fermé lorsqu'aucun démon Docker n'est joignable. Il ne se rabat jamais sur l'exécution du code utilisateur dans le processus backend.

L'exécution repose sur un ou deux conteneurs jetables, tous deux durcis comme les sandboxes d'outils et de skills (non-root, toutes les capacités supprimées, `no-new-privileges`, système de fichiers racine en lecture seule, limites CPU/mémoire/PID, et **aucun socket Docker**) :

- Avec un `requirements.txt` vide, un **conteneur unique avec `--network none`** exécute le code. Le runner arrive dans la charge utile stdin du conteneur, donc rien n'est monté du tout.
- Avec des dépendances, un premier conteneur les installe avec accès réseau dans un répertoire `.deps` par exécution, et un second conteneur monte ce sous-arbre **en lecture seule** et exécute le code. Le conteneur d'exécution n'a pas de réseau, sauf si l'option `codeAllowNetwork` du nœud est activée.

Les dépendances sont installées avec `uv`, réessayées avec `pip`, et jamais mises en cache entre les exécutions. Lorsque le backend s'exécute dans un conteneur, le répertoire par exécution réside sur le même volume `heym-codex-workspaces` qu'utilise le sandbox des skills, monté via un `volume-subpath` par exécution afin qu'une exécution ne voie jamais les fichiers d'une autre ; cette forme nécessite **Docker Engine 25.0 ou une version ultérieure**. Un backend natif (`./run.sh`) ne dispose pas d'un tel volume et n'en a pas besoin — son répertoire par exécution est un chemin temporaire local monté directement dans le conteneur frère. Dans les deux cas, le répertoire est supprimé après chaque exécution, quel que soit le résultat.

Seules des variables d'environnement non secrètes et portables sont transmises dans les conteneurs — paramètres de proxy, bundles CA et locale, dont l'installation des dépendances a besoin pour atteindre PyPI derrière un proxy d'entreprise. Les URL de base de données, `SECRET_KEY`/`ENCRYPTION_KEY`, les clés d'API des fournisseurs et les secrets OAuth sont retenus par une liste d'autorisation, de sorte qu'un nouveau secret backend est écarté par défaut plutôt que divulgué jusqu'à ce que quelqu'un mette à jour une liste de refus. Le `HOME` du backend ne remplace jamais le chemin inscriptible propre au sandbox.

Le bouton **Format** utilise le même sandbox. Ruff analyse et réécrit la source plutôt que de l'exécuter, mais l'exécuter sur l'hôte backend confierait à un fichier non fiable un processus héritant de tout l'environnement du backend ; il dispose donc de son propre conteneur jetable `--network none` avec les mêmes limites et le même environnement filtré par liste d'autorisation. Il échoue en mode fermé sans Docker plutôt que de formater sur l'hôte.

Les limites du sandbox sont des constantes plutôt que des variables d'environnement — 512 Mo de mémoire, un CPU, 256 processus, un délai d'installation de 120 secondes et un délai d'exécution de 60 secondes. L'image est résolue à partir de la chaîne existante `HEYM_PYTHON_TOOL_IMAGE` / `HEYM_CODEX_DOCKER_IMAGE` ; le nœud n'introduit aucune configuration qui lui soit propre.

## Related

- [Exécution et déploiement](../getting-started/running-and-deployment.md) – Configurez `SECRET_KEY`, `ENCRYPTION_KEY`, `ALLOW_REGISTER` et `HEYM_PYTHON_TOOL_SANDBOX` au démarrage
- [Nœud Code](../nodes/code-node.md) – Exécution Python en sandbox avec ses propres dépendances
- [Nœud Agent](../nodes/agent-node.md) – Outils Python personnalisés exécutés dans la sandbox
- [Tokens d'exécution](./execution-tokens.md) – JWT à portée limitée pour appeler des workflows depuis des systèmes externes
- [Guardrails](./guardrails.md) – Bloquez le contenu dangereux dans les nœuds LLM et Agent
- [Paramètres](./user-settings.md) – Modifiez votre mot de passe
- [Onglet Identifiants](../tabs/credentials-tab.md) – Gérez les clés API
- [Onglet MCP](../tabs/mcp-tab.md) – Clé API MCP et clients OAuth
- [Portail](./portal.md) – Contrôle d'accès au portail de chat public
