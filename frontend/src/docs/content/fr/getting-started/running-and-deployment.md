# Exécution et déploiement

Heym fournit deux scripts pour différents environnements : `run.sh` pour le développement local et `deploy.sh` pour les déploiements en production via Docker Compose.

> **Tutoriel vidéo :** [Configurer Heym en local en moins de 2 minutes](https://www.youtube.com/watch?v=P6YvlupUboU) — clonez le dépôt, démarrez PostgreSQL, renseignez les variables d'environnement requises et créez votre premier compte sur une instance locale.

## Prérequis

Les deux scripts nécessitent l'installation des outils suivants :

| Outil | Rôle |
|------|---------|
| [Docker](https://docs.docker.com/get-docker/) | Conteneur de base de données (dev) et stack complète (prod) |
| [uv](https://github.com/astral-sh/uv) | Gestionnaire de paquets Python pour le backend |
| [bun](https://bun.sh) | Runtime JavaScript pour le frontend |

## Configuration de l'environnement

`run.sh` et `deploy.sh` lisent tous deux un fichier `.env` à la racine du projet. S'il n'existe pas, le script en crée automatiquement un à partir de `.env.example` — pour le développement local comme pour la production.

`SECRET_KEY` et `ENCRYPTION_KEY` sont livrées vides dans `.env.example`. Lorsque l'une ou l'autre est vide, `run.sh` et `deploy.sh` génèrent automatiquement une valeur cryptographiquement robuste et l'écrivent dans `.env`, de sorte qu'une nouvelle installation ne nécessite aucune manipulation manuelle des clés. Si un fichier `.env` existant contient encore l'ancien placeholder `ENCRYPTION_KEY` (`change_this_to_a_random_32_byte_hex_value`), les scripts s'arrêtent avec une erreur explicite au lieu de l'écraser — la rotation de cette clé rendrait illisibles les identifiants précédemment chiffrés. Le backend lui-même refuse également de démarrer si l'une des clés est vide ou laissée à un placeholder connu.

Pour créer le fichier manuellement (facultatif — les scripts s'en chargent pour vous) :

```bash
cp .env.example .env
```

Variables d'environnement principales :

Pour chaque variable prise en charge, sa valeur par défaut et les remarques relatives à la production, consultez [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Variable | Description |
|----------|-------------|
| `SECRET_KEY` | **Obligatoire.** Secret de signature JWT. Généré automatiquement par `run.sh`/`deploy.sh` lorsqu'il est vide. |
| `ENCRYPTION_KEY` | **Obligatoire.** Clé de chiffrement des identifiants. Générée automatiquement par `run.sh`/`deploy.sh` lorsqu'elle est vide. |
| `DATABASE_URL` | Chaîne de connexion à la base de données facultative, en remplacement. Si vide, Heym la construit à partir des paramètres `POSTGRES_*`. |
| `BACKEND_PORT` | Port de l'API backend — `10105` par défaut |
| `FRONTEND_PORT` | Port du frontend — `4017` par défaut |
| `FRONTEND_URL` | **Obligatoire en production.** URL publique de l'application (schéma + hôte, par ex. `https://heym.example.com`). Utilisée pour les URI de redirection OAuth (Google Sheets, BigQuery, Notion et similaires), ainsi que pour les liens de revue, de suivi Codex et de fichiers générés par les exécutions en arrière-plan ; doit correspondre à l'URL utilisée par les utilisateurs dans le navigateur. Dans un cluster, définissez la même valeur sur chaque instance. |
| `ALLOW_REGISTER` | Ouverture de l'inscription des utilisateurs (`false` en prod, `true` en dev). Ne la passez à `false` qu'une fois votre compte administrateur créé — il n'existe pas d'amorçage du premier utilisateur, donc une base de données vide avec l'inscription désactivée ne laisse aucun moyen d'en créer un. |
| `DOCKER_LOGS_ENABLED` | Active l'accès à l'onglet Logs adossé à Docker lorsqu'elle vaut `true` ; nécessite également l'accès au socket Docker |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Liste d'adresses e-mail d'utilisateurs de confiance, séparées par des virgules, autorisées à accéder aux logs Docker lorsque `DOCKER_LOGS_ENABLED=true` |
| `REQUEST_BODY_MAX_SIZE_MB` | Taille maximale du corps de requête HTTP acceptée avant l'exécution des gestionnaires d'endpoint ; `100` par défaut, soit un Mo de plus que `FILE_MAX_SIZE_MB` pour laisser de la marge au surcoût multipart |
| `HEYM_PYTHON_TOOL_SANDBOX` | Mode d'exécution des outils Python définis par l'utilisateur : `auto` (par défaut — conteneur Docker durci et isolé ; échoue en mode fermé si Docker est indisponible), `docker` (identique, sans repli possible), ou `subprocess` (repli local en processus ; ne constitue pas une frontière de sécurité, réservé aux environnements de confiance/dev). `run.sh` définit `subprocess` pour le développement natif. Consultez [Security](../reference/security.md#python-tool-sandbox). |
| `HEYM_PYTHON_TOOL_IMAGE` | Image utilisée pour le sandbox Docker des outils Python. Vide = détection automatique de l'image backend en cours d'exécution. |

Les valeurs par défaut de connexion à la base de données (`POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) sont documentées dans [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) et `.env.example`.

---

## Développement : `run.sh`

`run.sh` démarre les trois services localement — la base de données (sous forme de conteneur Docker), le backend FastAPI et le serveur de développement Vite — avec une seule commande.

```bash
./run.sh
```

**Ce qu'il fait, étape par étape :**

1. Vérifie que `docker`, `bun` et `uv` sont disponibles
2. Crée `.env` à partir de `.env.example` s'il est absent, et génère un `SECRET_KEY` et une `ENCRYPTION_KEY` aléatoires lorsque l'un ou l'autre est vide
3. Démarre (ou crée) un conteneur Docker de base de données sur le port `6543`, en stockant ses données dans le volume Docker `heym-postgres-data` plutôt que dans un répertoire de l'hôte
4. Installe les dépendances Python via `uv sync`
5. Exécute les migrations de base de données Alembic (`alembic upgrade head`)
6. Libère les ports du backend et du frontend s'ils sont occupés
7. Démarre le backend FastAPI avec `--reload` (rechargement à chaud lors des modifications de code)
8. Installe les dépendances du frontend via `bun install`
9. Démarre le serveur de développement Vite

**Options :**

| Flag | Description |
|------|-------------|
| *(aucune)* | Démarre avec la journalisation de débogage activée (`LOG_LEVEL=DEBUG`) |
| `--no-debug` | Démarre avec le niveau de journalisation par défaut (aucune sortie de débogage) |
| `--help` | Affiche les informations d'utilisation |

**Adresses des services (dev) :**

| Service | Adresse |
|---------|---------|
| Frontend | `localhost` sur `FRONTEND_PORT` (par défaut : 4017) |
| API Backend | `localhost` sur `BACKEND_PORT` (par défaut : 10105) |
| Documentation interactive de l'API | `localhost:10105/docs` |
| Base de données | `localhost:6543` |

Appuyez sur `Ctrl+C` pour arrêter proprement tous les services.

---

## Tests de bout en bout : `run_e2e.sh`

La suite Playwright du frontend s'exécute contre la véritable application Vue, le backend FastAPI et une base de données PostgreSQL isolée :

```bash
./run_e2e.sh
```

La suite est une suite de smoke tests et de tests de non-régression sur les chemins critiques, et non une couverture exhaustive du produit. Elle couvre l'authentification, le cycle de vie et l'exécution des workflows principaux, certaines ressources du tableau de bord, les routes publiques et une interface de revue HITL simulée. Les intégrations de fournisseurs, chaque type de nœud, les matrices de partage/permissions et l'exécution complète de la reprise HITL restent principalement couverts par les tests backend ou nécessitent des environnements d'intégration dédiés.

Chaque exécution dispose de son propre conteneur PostgreSQL 16 temporaire, de ports de base de données/backend/frontend aléatoires disponibles, de son propre état d'authentification, de ses propres résultats de tests et de son propre rapport HTML. Cela permet à plusieurs processus `run_e2e.sh` de s'exécuter simultanément sans partager d'état ni écraser d'artefacts. Le script supprime son conteneur de base de données à la fin de l'exécution et affiche le répertoire des artefacts ainsi que le chemin du rapport.

Commandes utiles :

```bash
./run_e2e.sh --ui         # Lanceur Playwright interactif avec une base de données isolée
cd frontend
bun run test:e2e:report   # Ouvre l'exécution locale la plus récemment terminée
```

Les exécutions directes de `bun run test:e2e` et `bun run test:e2e:ui` nécessitent un `DATABASE_URL` explicite afin qu'elles ne puissent pas démarrer silencieusement contre la base de données de développement locale. Utilisez `./run_e2e.sh` pour les exécutions locales normales.

`./check.sh` exécute le lint, la vérification des types, le formatage et les tests backend sans la suite E2E, ce qui permet de garder le chemin de vérification local par défaut rapide. Exécutez les tests Playwright E2E séparément avec `./run_e2e.sh`. Les pull requests exécutent toujours la suite E2E Chromium dans GitHub Actions et conservent les traces, captures d'écran, vidéos et le rapport HTML en cas d'échec.

---

## Production : `deploy.sh`

`deploy.sh` construit et exécute l'ensemble de la stack via Docker Compose. Les trois services — la base de données, le backend et le frontend — s'exécutent en tant que conteneurs. Le point d'entrée du backend exécute automatiquement les migrations avant de démarrer le serveur avec 8 workers.

**Déploiement initial (build + démarrage) :**

```bash
./deploy.sh
```

Cette commande effectue un déploiement sans interruption de service : les images sont d'abord construites pendant que les conteneurs existants continuent de fonctionner, puis la nouvelle version est mise en place.

**Commandes disponibles :**

| Commande | Description |
|---------|-------------|
| `./deploy.sh` | Construit les images et démarre/met à jour tous les services |
| `./deploy.sh --status` | Affiche l'état des conteneurs |
| `./deploy.sh --logs` | Diffuse les logs de tous les conteneurs |
| `./deploy.sh --restart` | Redémarre tous les conteneurs |
| `./deploy.sh --down` | Arrête et supprime tous les conteneurs |
| `./deploy.sh --migrate-pgdata` | Migration ponctuelle : copie un répertoire `data/postgres` existant dans le volume Docker `heym-postgres-data` et reconstruit ses index |
| `./deploy.sh --help` | Affiche les informations d'utilisation |

**Stockage de la base de données : un volume nommé Docker, et non un répertoire hôte.**

Compose stocke PostgreSQL dans le volume Docker `heym-postgres-data`. Les versions antérieures montaient plutôt le répertoire hôte `./data/postgres` en bind mount. Les bind mounts hôtes sur macOS (virtiofs) et Windows/WSL2 n'offrent pas à PostgreSQL les garanties de `fsync` et de fermeture de fichier qu'il requiert : les clusters y rencontrent l'erreur `PANIC: could not close file … Input/output error` sur les segments WAL et se corrompent avec le temps. Les bind mounts Linux n'ont jamais été affectés, mais toutes les plateformes utilisent désormais la même configuration.

La mise à niveau d'un déploiement dont les données résident encore dans `./data/postgres` est une étape ponctuelle. `./deploy.sh` la détecte, s'arrête avant la construction et vous invite à migrer au préalable :

```bash
./deploy.sh --migrate-pgdata   # arrête les services, copie dans le volume, reconstruit les index
./deploy.sh                    # déploie normalement
```

**La migration reconstruit également les index.** La copie est réalisée octet par octet, de sorte que les dommages aux index causés par l'ancien bind mount sont transférés avec elle. `--migrate-pgdata` démarre donc le service `postgres` seul sur le nouveau volume, exécute `reindexdb` sur celui-ci, puis l'arrête à nouveau avant que le reste de la stack ne démarre. Cela importe car ce type de corruption laisse des entrées d'index pointant au-delà de la fin du heap — un état que `pg_amcheck` signale comme sain, si bien qu'une vérification réussie ne constitue pas une preuve de la santé d'une table. REINDEX répare ces entrées ; il ne peut pas restaurer les pages du heap que l'ancien système de fichiers a déjà perdues. Sur une base de données volumineuse et reconnue saine, il est possible de contourner la reconstruction avec `./deploy.sh --migrate-pgdata --skip-reindex`.

La copie n'est pas destructive. `./data/postgres` reste en place à titre de sauvegarde, et la migration refuse d'écraser un volume contenant déjà une base de données. Si une étape échoue, le nouveau volume est supprimé, de sorte qu'un cluster à moitié migré ne puisse jamais être déployé par erreur. Supprimez l'ancien répertoire une fois que vous avez confirmé que vos workflows sont intacts. Le conteneur `postgres` intègre la même protection, afin qu'un `docker compose up` manuel ne puisse pas non plus initialiser silencieusement une base de données vide par-dessus vos données. Les installations neuves ne nécessitent aucune action.

**Adresses des services (production) :**

Le conteneur frontend est exposé sur `FRONTEND_PORT` (par défaut : 4017). L'API backend est servie sous le chemin `/api`, proxifié via le conteneur frontend — il n'y a donc qu'un seul port exposé publiquement en production.

**Vue d'ensemble des conteneurs :**

| Conteneur | Description |
|-----------|-------------|
| `heym-db` | Base de données relationnelle |
| `heym-backend` | Serveur API FastAPI (8 workers, construit à partir de `backend/Dockerfile`) |
| `heym-frontend` | Conteneur de prévisualisation frontend servant l'application Vue compilée (construit à partir de `frontend/Dockerfile`) |

**Badge de mise à jour de version :**

L'en-tête de l'application affiche la version du build Docker en cours d'exécution. Lorsque cette version est en retard par rapport à la dernière release GitHub de Heym, un badge violet **Update** apparaît à côté de la version. Cliquez sur la version ou sur le badge pour ouvrir la page des releases GitHub de Heym.

---

## Image préconstruite : `docker run`

Si vous préférez ne pas construire l'application localement, vous pouvez récupérer l'image de conteneur publiée et l'exécuter directement.

L'image démarre le frontend et le backend ensemble dans un seul conteneur. PostgreSQL reste externe, mais vous pouvez fournir soit `DATABASE_URL`, soit les variables `POSTGRES_*` de `.env.example`.

> **Stockez votre base de données dans un volume nommé Docker.** L'image de release n'embarque aucune base de données : le PostgreSQL derrière `DATABASE_URL` est donc à votre charge. Montez-le en tant que `-v heym-postgres-data:/var/lib/postgresql/data` plutôt qu'avec un chemin hôte : sur macOS (virtiofs) et Windows/WSL2, un répertoire de données PostgreSQL monté en bind ne respecte pas les garanties `fsync` requises par la base de données et corrompt le cluster au fil du temps.

> **Backend de base vectorielle.** `run.sh` et `deploy.sh` exécutent l'image officielle `postgres:16` et installent automatiquement le paquet `postgresql-16-pgvector` au démarrage : le **backend RAG Postgres (pgvector)** y fonctionne donc immédiatement, sans modification de vos données. L'image préconstruite mono-conteneur, en revanche, se connecte à un PostgreSQL que **vous** fournissez — cette base doit prendre en charge l'extension `vector` pour utiliser le backend Postgres. Heym ne peut pas installer pgvector dans une base qu'il ne gère pas. Sans cette extension, la migration au démarrage ignore proprement la table pgvector — le déploiement réussit tout de même, le RAG Qdrant continue de fonctionner, et la création ou l'import dans une base vectorielle Postgres renvoie un message explicite « backend unavailable » tant que pgvector n'est pas activé.

**Définissez les clés vous-même pour les exécutions directes de l'image.** Contrairement à `run.sh`/`deploy.sh`, l'image préconstruite ne génère pas les clés automatiquement. Après `cp .env.example .env`, renseignez les deux clés vides (un remplacement sur place évite les entrées en double) :

```bash
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
ENCRYPTION_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
sed -i.bak "s|^SECRET_KEY=.*|SECRET_KEY=${SECRET_KEY}|; s|^ENCRYPTION_KEY=.*|ENCRYPTION_KEY=${ENCRYPTION_KEY}|" .env && rm -f .env.bak
```

```bash
docker pull ghcr.io/heymrun/heym:latest

docker run --rm \
  --env-file .env \
  -p 4017:4017 \
  --shm-size 2g \
  -e FILE_STORAGE_DIR=/app/data/files \
  -e HEYM_PLUGINS_DIR=/app/data/plugins \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$(pwd)/data/files:/app/data/files" \
  -v "$(pwd)/data/plugins:/app/data/plugins" \
  -v heym-codex-workspaces:/app/data/codex-workspaces \
  -v heym-opencode-workspaces:/app/data/opencode-workspaces \
  ghcr.io/heymrun/heym:latest
```

> **Rendez absolus les montages de fichiers et de plugins.** `FILE_STORAGE_DIR` et `HEYM_PLUGINS_DIR` ont pour valeurs par défaut les chemins relatifs `./data/files` et `data/plugins`, et l'image de release démarre le backend depuis `/app/backend`. Laissés relatifs, ils se résolvent en `/app/backend/data/files` et `/app/backend/data/plugins` : les deux bind mounts ci-dessus ne reçoivent alors rien et les imports sont perdus dès que le conteneur est remplacé. Les options `-e` remplacent les valeurs relatives fournies par `.env.example` via `--env-file`, car `-e` en ligne de commande l'emporte sur `--env-file`. Compose (`./deploy.sh`) n'a pas besoin de cela : cette image exécute le backend depuis `/app`, où les valeurs relatives par défaut aboutissent déjà sur les montages.

> **Accès au socket Docker.** Monter `/var/run/docker.sock` confère au backend un large contrôle sur le démon Docker de l'hôte. Le service Docker Compose par défaut et l'exemple `docker run` direct l'incluent pour les outils MCP stdio basés sur Docker qui exécutent des commandes `docker`. L'onglet Logs nécessite toujours `DOCKER_LOGS_ENABLED=true` et `DOCKER_LOGS_ALLOWED_EMAILS` avec une liste d'adresses e-mail d'utilisateurs de confiance séparées par des virgules. Créez le compte administrateur de confiance avant d'activer les logs Docker, ou conservez `ALLOW_REGISTER=false`, afin qu'une auto-inscription non vérifiée ne puisse pas revendiquer une adresse e-mail autorisée. Les outils Python définis par l'utilisateur ne reçoivent **pas** ce socket : ils s'exécutent dans un conteneur durci distinct, sans socket Docker. Voir [Sécurité](../reference/security.md#python-tool-sandbox).

> **Runner Codex.** Le nœud Codex utilise la même image `ghcr.io/heymrun/heym` comme conteneur runner frère (`--entrypoint codex`), afin que le sandbox Linux de Codex puisse créer des namespaces. Conservez le montage du volume `heym-codex-workspaces` si vous souhaitez des workflows Codex dans la configuration d'image directe ; le runner ne reçoit ni le socket Docker ni les secrets du backend.

> **Runner OpenCode Go.** Le nœud OpenCode Go utilise la même image comme runner frère durci (`--entrypoint opencode`) partageant `heym-opencode-workspaces`. Conservez ce montage de volume si vous souhaitez des workflows OpenCode dans la configuration d'image directe ; le runner ne reçoit ni le socket Docker ni le token GitHub.

> **Sandbox de skills.** Les skills Python du nœud Agent s'exécutent dans un conteneur frère durci qui partage le volume `heym-codex-workspaces` : conservez donc ce montage de volume pour les skills également — pas seulement pour Codex. Chaque exécution dispose d'un sous-chemin isolé par exécution, et le conteneur frère ne reçoit ni le socket Docker ni les secrets du backend. Cela nécessite **Docker Engine 25.0+** ; sur des moteurs plus anciens, ou sans le volume, `HEYM_PYTHON_TOOL_SANDBOX=auto` échoue en mode fermé — ne définissez `HEYM_PYTHON_TOOL_SANDBOX=subprocess` que pour des configurations mono-utilisateur de confiance. Voir [Sécurité](../reference/security.md#skill-sandbox).

> **`--shm-size 2g` est requis pour Playwright.** Docker alloue 64 Mo de `/dev/shm` à un conteneur et Chromium fait planter son moteur de rendu en dessous de cette limite. Les nœuds Playwright basés sur des étapes exécutent Chromium en tant que sous-processus au sein de ce conteneur, la limite est donc celle de ce conteneur ; le `playwrightCode` personnalisé s'exécute dans un conteneur frère qui définit la sienne. `docker-compose.yml` déclare déjà `shm_size: "2gb"`, donc `run.sh` et `deploy.sh` ne sont pas affectés — seul un `docker run` simple nécessite ce flag.

> **Playwright Run Code.** Le code Python Playwright personnalisé nécessite `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true` et le montage du socket Docker ci-dessus. L'image de release définit `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` / `HEYM_PLAYWRIGHT_SANDBOX_PYTHON` pour la disposition GHCR (`/app/backend/.venv`). La commande Compose `./deploy.sh` utilise par défaut l'image sandbox `heym-backend:local`. Conservez `--no-sandbox` dans les arguments de lancement de Chromium au sein des conteneurs sandbox.

**Variables d'environnement minimales pour les exécutions directes de l'image :**

| Variable | Requis | Objectif |
|----------|----------|---------|
| `DATABASE_URL` | Optionnel | Surcharge complète de la chaîne de connexion PostgreSQL |
| `POSTGRES_HOST` | Oui, si `DATABASE_URL` est vide | Hôte PostgreSQL |
| `POSTGRES_PORT` | Oui, si `DATABASE_URL` est vide | Port PostgreSQL |
| `POSTGRES_USER` | Oui, si `DATABASE_URL` est vide | Nom d'utilisateur PostgreSQL |
| `POSTGRES_PASSWORD` | Oui, si `DATABASE_URL` est vide | Mot de passe PostgreSQL |
| `POSTGRES_DB` | Oui, si `DATABASE_URL` est vide | Nom de la base de données PostgreSQL |
| `SECRET_KEY` | Oui | Secret de signature JWT |
| `ENCRYPTION_KEY` | Oui | Clé de chiffrement des identifiants |
| `FRONTEND_URL` | Recommandé | URL publique du navigateur, notamment pour les callbacks OAuth |
| `CORS_ORIGINS` | Recommandé | Origines de navigateur autorisées |
| `FILE_STORAGE_DIR` | Recommandé | Définissez-la sur un chemin absolu `/app/data/files` lorsque vous montez ce chemin ; la valeur par défaut relative `./data/files` se résout sous `/app/backend` dans cette image et manque le montage |
| `ALLOW_REGISTER` | Recommandé | Définissez `false` en production, sauf si l'inscription ouverte est souhaitée, mais uniquement une fois votre compte administrateur créé — il n'existe aucun amorçage du premier utilisateur |
| `DOCKER_LOGS_ENABLED` | Optionnel | Définissez `true` pour autoriser l'onglet Logs à utiliser l'accès au socket Docker |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Requis lorsque `DOCKER_LOGS_ENABLED=true` | Liste d'adresses e-mail d'utilisateurs de confiance, séparées par des virgules, autorisées à accéder aux logs Docker |
| `HEYM_PLUGINS_ENABLED` | Optionnel | Définissez `true` pour activer le sous-système de plugins (nœuds personnalisés installés sous forme de zip). Désactivé par défaut |
| `HEYM_PLUGIN_ADMIN_EMAILS` | Requis lorsque `HEYM_PLUGINS_ENABLED=true` | Adresses e-mail d'opérateurs, séparées par des virgules, autorisées à installer/désinstaller des plugins |
| `HEYM_PLUGINS_DIR` | Optionnel | Emplacement de stockage des fichiers de plugins. Définissez-le sur un chemin absolu `/app/data/plugins` lorsque vous montez ce chemin ; la valeur par défaut relative `data/plugins` se résout sous `/app/backend` dans cette image et manque le montage |
| `HEYM_PYTHON_TOOL_SANDBOX` | Optionnel | Mode d'isolation de l'outil Python ; par défaut `auto` (sandbox Docker durci, échec sécurisé). Voir [Sécurité](../reference/security.md#python-tool-sandbox) |
| `HEYM_PYTHON_TOOL_IMAGE` | Optionnel | Surcharge l'image sandbox de l'outil Python ; vide = détection automatique de l'image backend |
| `HEYM_CODEX_DOCKER_WORKSPACE_VOLUME` | Optionnel | Volume Docker utilisé par les conteneurs frères du runner Codex ; par défaut `heym-codex-workspaces` dans les déploiements Docker |
| `HEYM_CODEX_NETWORK_ACCESS` | Optionnel | Autorise les commandes sandboxées de Codex à télécharger des fichiers/dépendances ; les déploiements Docker l'activent par défaut |
| `HEYM_OPENCODE_DOCKER_WORKSPACE_VOLUME` | Optionnel | Volume Docker utilisé par les conteneurs frères du runner OpenCode ; par défaut `heym-opencode-workspaces` dans les déploiements Docker |

**Remarques :**

- L'image expose le port `4017`
- Le backend reste interne et est proxifié sous `/api`
- Lorsque `POSTGRES_HOST=localhost`, l'image de release le réécrit automatiquement en `host.docker.internal` si nécessaire, afin que le même `.env` fonctionne avec un conteneur PostgreSQL au niveau de l'hôte sur les outils Docker/Desktop de macOS
- Conservez le montage `data/files` si vous souhaitez que les uploads Drive et les fichiers générés par les skills survivent aux redémarrages du conteneur
- **Plugins :** pour les activer, définissez `HEYM_PLUGINS_ENABLED=true` et `HEYM_PLUGIN_ADMIN_EMAILS`, et montez `data/plugins` afin que les fichiers de plugins installés persistent à travers les recréations du conteneur. Les métadonnées des plugins résident dans votre PostgreSQL, elles survivent donc également. Les `dependencies` pip déclarées par un plugin sont installées dans le conteneur au moment de l'installation ; comme le système de fichiers de l'image est éphémère, elles sont **réinstallées automatiquement au démarrage** pour chaque plugin installé (le venv `uv` de l'image de release est accessible en écriture, ce qui fonctionne donc aussi dans l'image à conteneur unique)

### Déplacer une base de données existante vers un volume nommé

`./deploy.sh --migrate-pgdata` ne connaît que la stack Compose. Si vous exécutez l'image de release contre votre propre conteneur PostgreSQL et que ce conteneur effectue un bind-mount d'un répertoire hôte, migrez-le vous-même.

Vérifiez d'abord ce que votre conteneur de base de données utilise :

```bash
docker inspect <your-postgres-container> | grep -A8 Mounts
```

Si `"Type"` indique `bind`, déplacez-le vers un volume nommé :

```bash
# 1. Stop the database. Heym can stay down for this.
docker stop <your-postgres-container>
docker rm <your-postgres-container>

# 2. Copy the data directory into a named volume. Give each instance its own

#    nom du volume si cet hôte Docker exécute plusieurs déploiements Heym.
docker volume create heym-postgres-data
docker run --rm \
  -v "/path/to/your/data/postgres:/legacy:ro" \
  -v heym-postgres-data:/pgdata \
  --entrypoint sh <your-postgres-image> -c 'cp -a /legacy/. /pgdata/'

# 3. Start PostgreSQL again on the volume, reusing the flags you had before
#    but replacing the bind mount.
docker run -d --name <your-postgres-container> --restart always \
  ... your original -e / -p / --network flags ... \
  -v heym-postgres-data:/var/lib/postgresql/data \
  <your-postgres-image>

# 4. Once it accepts connections, rebuild indexes.
docker exec <your-postgres-container> reindexdb -U <user> -d <database>
```

**Utilisez votre propre image aux étapes 2 et 3, et non `postgres:16`.** Si votre base de données utilise `pgvector/pgvector:pg16` ou une autre variante, démarrer le cluster copié avec l'image standard peut échouer, car les bibliothèques d'extension attendues sont absentes.

Votre répertoire de données d'origine n'est pas modifié par cette procédure ; il constitue donc votre voie de restauration. Ne le supprimez qu'après avoir confirmé que la base de données migrée dessert vos workflows. L'étape 4 est importante pour la même raison que dans la migration Compose : la copie transporte avec elle toute détérioration d'index existante.

---

## Exécuter plusieurs instances

Tout ce qui précède déploie une seule instance Heym. Lorsqu'une machine ne suffit plus, pointez une seconde instance vers la même base de données PostgreSQL : elle rejoint alors le cluster en tant que worker. Les exécutions en arrière-plan — cron, webhooks, appels d'outils MCP, chat triggers — sont ensuite réparties entre les instances selon un pourcentage que vous définissez sous **Settings → Instances**.

Les instances ne communiquent jamais entre elles. C'est Postgres qui porte la charge de travail : un worker n'a donc besoin ni de port ouvert, ni de route vers l'instance principale, et aucun broker de messages n'intervient. Les tâches qui touchent au disque local — fichiers Drive, espaces de travail des coding-agents, plugins installés — s'exécutent toujours sur l'instance principale, de sorte que rien ne doit être partagé via un système de fichiers.

Deux règles que le cluster ne peut pas appliquer à votre place : chaque instance doit utiliser les mêmes `SECRET_KEY` et `ENCRYPTION_KEY`, et l'ingress doit pointer uniquement vers l'instance principale. Ces deux règles sont expliquées, avec les règles de placement et la manière de choisir les pourcentages, dans [Load Distribution](../reference/cluster.md).

> Il s'agit de répartition de charge, et non de haute disponibilité. L'instance principale reste un point de défaillance unique pour l'ingress, le stockage de fichiers et l'éditeur.

## Workflows courants

**Configuration initiale :**

```bash
./run.sh          # development — creates .env from .env.example and generates SECRET_KEY/ENCRYPTION_KEY automatically
# or
./deploy.sh       # production — same automatic .env and key generation
```

Pour l'image préconstruite `docker run`, générez d'abord les clés manuellement (voir la section **Prebuilt Image** ci-dessus).

**Mettre à jour la production après une modification du code :**

```bash
git pull
./deploy.sh       # rebuilds images, zero-downtime swap
```

**Consulter les logs de production :**

```bash
./deploy.sh --logs
```

**Arrêter les services de production :**

```bash
./deploy.sh --down
```

---

## Voir aussi

- [Introduction](./introduction.md) – Présentation de la plateforme
- [Quick Start](./quick-start.md) – Créez votre premier workflow
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Référence complète de configuration
- [Security](../reference/security.md) – Paramètres JWT, chiffrement et CORS
- [Load Distribution](../reference/cluster.md) – Exécuter plusieurs instances sur une seule base de données
