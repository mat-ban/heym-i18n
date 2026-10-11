# Nœud OpenCode Go

Le nœud **OpenCode Go** exécute la CLI [OpenCode](https://opencode.ai) (Go) dans un conteneur Heym isolé et durci, contre un dépôt GitHub. Comme le nœud Codex, il est conçu pour des tâches de codage telles que la correction de tests, la modification de fichiers, la production d'un patch ou l'ouverture d'une pull request — mais il utilise la passerelle de modèles **OpenCode Go**, agnostique vis-à-vis du fournisseur, plutôt qu'OpenAI Codex.

## Vue d'ensemble

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Identifiant | Clé API OpenCode Go + GitHub |
| Sortie | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Authentification

L'identifiant **OpenCode Go** stocke une **clé API** de la passerelle OpenCode Go (depuis [opencode.ai/go](https://opencode.ai/go)) ainsi qu'une **Gateway Base URL** facultative (par défaut `https://opencode.ai/zen/go/v1` ; à surcharger uniquement pour une passerelle auto-hébergée ou proxyfiée).

Le nœud requiert également un identifiant **GitHub** pour cloner les dépôts privés, pousser la branche de travail et créer des pull requests. Le token GitHub n'est **jamais placé à l'intérieur du conteneur sandbox** — Heym effectue toutes les opérations git et GitHub côté hôte, de sorte que le code généré ne peut pas exfiltrer les identifiants de push.

## Isolation et sécurité

L'isolation d'exécution est choisie via `HEYM_OPENCODE_CLI_COMMAND`, exactement comme pour le nœud Codex :

- **Développement local (`run.sh`)** la laisse à la valeur par défaut `opencode`, de sorte qu'OpenCode s'exécute comme sous-processus hôte contre l'espace de travail cloné — aucun Docker requis, aucun flag supplémentaire.
- **Déploiements Docker (`deploy.sh` et l'image GHCR unique)** la définissent sur `/usr/local/bin/heym-opencode-docker`, un wrapper qui exécute `opencode run` à l'intérieur d'un **conteneur frère jetable et durci** partageant le volume nommé de l'espace de travail OpenCode.

Le conteneur d'exécution durci supprime toutes les capacités Linux, active `no-new-privileges`, utilise une racine en lecture seule avec un tmpfs `/tmp`, et applique des limites de pid/mémoire/CPU. La sortie réseau est autorisée (OpenCode doit joindre la passerelle de modèles). Le **token GitHub n'est jamais placé à l'intérieur du conteneur** — toutes les opérations git et GitHub s'exécutent côté hôte, de sorte que seuls la clé API OpenCode et les fichiers du dépôt s'y trouvent.

OpenCode ne fait que modifier les fichiers sur disque ; Heym prend en charge chaque action git/GitHub.

## Modèles

Le catalogue de modèles d'OpenCode Go évolue fréquemment, c'est pourquoi le champ **Model** est alimenté en direct depuis la liste de modèles de la passerelle (`GET https://opencode.ai/zen/go/v1/models`) et affiché sous forme de liste déroulante avec recherche. Si la liste en direct est indisponible, une liste de repli intégrée est utilisée. Les identifiants de modèle utilisent la forme `opencode-go/<model>` (par exemple `opencode-go/kimi-k3`, `opencode-go/deepseek-v4-pro`, `opencode-go/qwen3.7-max`) — `opencode-go` est l'identifiant de fournisseur de la CLI OpenCode pour la passerelle Go. Laissez le champ vide pour utiliser la valeur par défaut du runner (`opencode-go/kimi-k3`). Les identifiants de modèle enregistrés dans l'ancienne forme `opencode/<model>` sont réécrits automatiquement au moment de l'exécution.

## Champs

| Champ | Description |
|-------|-------------|
| OpenCode Go Credential | Identifiant OpenCode Go (clé API de la passerelle) |
| GitHub Credential | Identifiant PAT GitHub utilisé pour l'accès au dépôt |
| Repository URL | URL HTTPS du dépôt GitHub ; prend en charge les expressions |
| Base Branch | Branche à cloner avant l'exécution d'OpenCode, par défaut `main` |
| Model | Modèle OpenCode Go (liste déroulante avec recherche en direct, `opencode-go/<model>`) ; vide utilise la valeur par défaut du runner |
| Reasoning Variant | Facultatif ; correspond à `opencode run --variant` pour les modèles prenant en charge l'effort de raisonnement |
| Task Prompt | Tâche de codage pour OpenCode ; prend en charge les expressions telles que `$input.text` |
| Publish Mode | Mode de livraison des modifications (voir le tableau ci-dessous) |
| Branch Name | Branche de travail pour les modes PR/commit, par défaut `opencode/$executionId` |
| Timeout | Durée maximale d'exécution d'OpenCode en secondes |

## Modes de publication

| Mode | Ce qu'il fait |
|------|--------------|
| `diff_only` | Modifie les fichiers localement et renvoie le patch et les fichiers modifiés. Rien n'est poussé. |
| `draft_pr` | Commit sur la branche, la pousse et ouvre une pull request en brouillon. |
| `open_pr` | Commit sur la branche, la pousse et ouvre une pull request prête pour revue (non brouillon). |
| `commit_push` | Commit sur la branche et la pousse, sans ouvrir de pull request. |
| `direct_commit` | Commit et push directement sur la branche de base (aucune branche séparée ni PR). |
| `open_or_update_pr` | Met à jour la PR ouverte existante de l'agent lorsqu'elle existe — même si le nom de branche diffère, le runner la retrouve par auteur + base — sinon en ouvre une nouvelle. Idéal pour les réexécutions et les instructions « mettre à jour la PR ouverte ». |
| `update_existing_pr` | Ajoute un commit à la branche/PR existante ; en ouvre une si aucune n'existe encore. |
| `patch_artifact` | Enregistre le diff sous forme de fichier téléchargeable et renvoie `patchUrl`. Rien n'est poussé. |
## Outputs

| Key | Description |
|-----|-------------|
| `status` | Toujours `completed` (le nœud OpenCode Go ne se met pas en pause pour une saisie) |
| `summary` | Message final d'OpenCode |
| `validation` | Notes de validation lorsqu'elles sont signalées |
| `diff` | Patch Git lorsque des fichiers ont été modifiés |
| `changedFiles` | Chemins des fichiers modifiés |
| `branchName` | Nom de la branche de travail |
| `pullRequestUrl` | URL de la PR dans les modes `draft_pr`, `open_pr`, `open_or_update_pr` et `update_existing_pr` |
| `pushedBranch` | Branche qui a été poussée dans les modes commit/PR |
| `patchUrl` | Lien de téléchargement du diff en mode `patch_artifact` |

## Captures d'écran d'interface sur les pull requests

Pour les tâches d'interface/frontend, OpenCode doit enregistrer les captures d'écran PNG dans un chemin ignoré par Git tel que `frontend/.e2e-artifacts/` (et non dans les sources). Si les dépendances frontend sont manquantes, le prompt du runner autorise une installation ciblée de paquets (par exemple `bun install`) ainsi qu'un aperçu éphémère/`bun run dev` dans le seul but de capturer l'interface. Heym téléverse ces images vers une **prerelease** GitHub partagée unique (`opencode-pr-assets`) en tant qu'assets nommés `<branch>-…`, puis les intègre dans la description de la PR **avant l'ouverture de la pull request**, de sorte qu'une nouvelle PR est créée en contenant déjà ses captures d'écran (les PR existantes sont mises à jour sur place).

Il est également demandé à OpenCode de terminer par une ligne `PR_TITLE: …` afin que Heym puisse ouvrir la pull request avec un sujet pertinent plutôt qu'avec des espaces réservés tels que `Done.`

Il arrive qu'OpenCode termine un tour au milieu d'une tâche (« …Now let me take a screenshot »), ce qui finaliserait l'exécution avant que la capture d'écran ne soit prise. Pour éviter cela, le prompt du runner exige de capturer les captures d'écran **avant** le message final, et si l'exécution se termine malgré tout sans résumé publiable ou avec une modification d'interface mais sans capture d'écran, Heym lance une passe OpenCode supplémentaire dans le même espace de travail pour terminer. Si une modification d'interface reste sans capture d'écran par la suite, une note visible est ajoutée au corps de la PR afin que cet écart ne passe jamais inaperçu.

## Ce qui est publié sur GitHub

Votre **Task Prompt** est une entrée privée, et non un contenu de PR. Seules deux choses sont publiées : une section `## Change Summary` décrivant ce que fait la modification de code, et une section `## Screenshots` lorsque des captures d'écran ont été prises. Le titre de la PR est dérivé du résumé des modifications uniquement.

Le prompt du runner énonce cette politique, et Heym l'applique également après l'exécution : avant que quoi que ce soit ne soit commité ou ouvert en tant que pull request, il supprime les sections d'écho du prompt (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) ainsi que tout paragraphe copié mot pour mot depuis le prompt de tâche, du résumé, du corps de la PR et du message de commit.

Heym lit la section `## Change Summary` à partir des messages de l'agent plutôt que de prendre ce qu'il a dit en dernier, car OpenCode émet un message par étape et le dernier est souvent un commentaire en cours d'exécution. La narration d'étape (`Both pass. Let me do a final review:`) est également rejetée en tant que titre de PR ou sujet de commit. Si l'exécution ne produit aucun résumé de modification exploitable, la pull request se rabat sur la liste des fichiers modifiés au lieu de publier des commentaires.

## En tant qu'outil d'agent

Le nœud OpenCode Go peut être rattaché à la poignée d'outil d'un nœud **AI Agent** afin que l'agent puisse déléguer des tâches de codage. Configurez l'identifiant, l'identifiant GitHub et le dépôt sur le nœud, puis marquez **Task Prompt** (et éventuellement **Repository URL**) avec le bouton fourni par l'agent afin que celui-ci les fournisse à l'appel.

## Exemple

```json
{
  "id": "opencode-1",
  "type": "opencodeGo",
  "position": { "x": 420, "y": 120 },
  "data": {
    "label": "fix_pr",
    "credentialId": "opencode-credential-uuid",
    "githubCredentialId": "github-credential-uuid",
    "repositoryUrl": "https://github.com/acme/app",
    "baseBranch": "main",
    "taskPrompt": "$input.text",
    "publishMode": "open_pr",
    "branchName": "opencode/$executionId",
    "opencodeModel": "opencode-go/kimi-k3",
    "timeoutSeconds": 3600
  }
}
```

## Voir aussi

- [Nœud Codex](./codex-node.md)
- [Nœud GitHub](./github-node.md)
- [Nœud Agent](./agent-node.md)
- [Identifiants](../reference/credentials.md)
- [Partage d'identifiants](../reference/credentials-sharing.md)
- [Types de nœuds](../reference/node-types.md)
