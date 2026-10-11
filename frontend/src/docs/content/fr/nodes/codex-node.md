# Nœud Codex

Le nœud **Codex** exécute l'interface CLI OpenAI Codex dans un espace de travail Heym isolé, sur un dépôt GitHub. Il est conçu pour des tâches de codage telles que la correction de tests, la modification de fichiers, la production d'un patch ou l'ouverture d'une pull request en brouillon.

## Vue d'ensemble

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1, plus `question` |
| Identifiant | Token d'accès Codex + GitHub |
| Sortie | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Authentification

L'identifiant **OpenAI Codex** prend en charge deux modes d'authentification :

| Mode | Description |
|------|-------------|
| **Sign in with ChatGPT** (recommandé) | Connexion OAuth (PKCE) qui utilise votre abonnement ChatGPT Plus/Pro, de sorte que les exécutions n'entraînent **aucun** coût API par token. Cliquez sur **Sign in with ChatGPT** dans la boîte de dialogue d'identifiant, autorisez dans votre navigateur, puis collez l'URL de redirection `localhost:1455` dans Heym. Heym stocke le bundle de tokens résultant et le rafraîchit automatiquement à son expiration. |
| **Access token** | Collez un `access_token` ChatGPT/Codex utilisé uniquement par le runner Codex local. |

Les clés API ne sont pas acceptées pour l'identifiant Codex. Le nœud ne soumet pas de tâches Codex cloud ; il clone le dépôt à l'intérieur du runtime Heym, écrit le bundle de tokens ChatGPT dans un `auth.json` isolé (ou transmet `CODEX_ACCESS_TOKEN`) uniquement au processus Codex, et garde le token hors de `$credentials`.

Le nœud nécessite également un identifiant **GitHub** pour cloner les dépôts privés, pousser la branche de travail et créer des pull requests en brouillon.

Dans les déploiements Docker, Heym exécute Codex dans un conteneur frère issu de la même image Heym (et non d'une image GHCR distincte). Ce conteneur monte uniquement le volume de l'espace de travail Codex et laisse le sandbox bubblewrap propre à Codex créer les namespaces et un `/proc` neuf. Le runner ajoute `SYS_ADMIN`, un seccomp et AppArmor non confinés, ainsi que `systempaths=unconfined` (Docker Engine 25+). Sans ce dernier flag, chaque commande échoue avant son lancement avec `bwrap: Can't mount proc on /newroot/proc: Operation not permitted`.

Références OpenAI :

- [Codex authentication](https://developers.openai.com/codex/auth)
- [Codex access tokens](https://developers.openai.com/codex/enterprise/access-tokens)
- [Codex models](https://learn.chatgpt.com/docs/models?surface=cli)
- [Codex non-interactive mode](https://developers.openai.com/codex/noninteractive)
- [Codex pricing](https://developers.openai.com/codex/pricing)

## Champs

| Champ | Description |
|-------|-------------|
| Codex Credential | Identifiant OpenAI Codex (connexion ChatGPT ou `access_token`) |
| GitHub Credential | Identifiant PAT GitHub utilisé pour l'accès au dépôt |
| Repository URL | URL HTTPS du dépôt GitHub |
| Base Branch | Branche à cloner avant l'exécution de Codex, par défaut `main` |
| Model | Modèle Codex facultatif (liste déroulante modifiable, ex. `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`) ; vide utilise la valeur par défaut de Codex |
| Reasoning Effort | Profondeur de raisonnement Codex : `low`, `medium`, `high`, `xhigh` (Extra High), `max` ou `ultra` (par défaut `medium`) |
| Task Prompt | Tâche de codage pour Codex ; prend en charge les expressions telles que `$input.text` |
| Publish Mode | Mode de livraison des modifications (voir le tableau ci-dessous) |
| Branch Name | Branche de travail pour les modes PR/commit, par défaut `codex/$executionId` |
| Timeout | Durée maximale d'exécution de Codex en secondes |

## Modes de publication

| Mode | Ce qu'il fait |
|------|--------------|
| `diff_only` | Modifie les fichiers localement et renvoie le patch et les fichiers modifiés. Rien n'est poussé. |
| `draft_pr` | Commit sur la branche, la pousse et ouvre une pull request en brouillon. |
| `open_pr` | Commit sur la branche, la pousse et ouvre une pull request prête pour revue (non brouillon). |
| `commit_push` | Commit sur la branche et la pousse, sans ouvrir de pull request. |
| `direct_commit` | Commit et push directement sur la branche de base (pas de branche séparée ni de PR). |
| `open_or_update_pr` | Met à jour la PR ouverte existante de l'agent lorsqu'il en existe une — même si le nom de branche diffère, le runner la retrouve par auteur + base — sinon en ouvre une nouvelle. Idéal pour les réexécutions et les instructions du type « mettre à jour la PR ouverte ». |
| `update_existing_pr` | Ajoute un commit à la branche/PR existante ; en ouvre une si aucune n'existe encore. |
| `patch_artifact` | Enregistre le diff sous forme de fichier téléchargeable et renvoie `patchUrl`. Rien n'est poussé. |

## Sorties

| Clé | Description |
|-----|-------------|
| `status` | `completed` ou `needs_input` |
| `summary` | Résumé de Codex |
| `validation` | Notes de validation, tests ou vérifications rapportés par Codex |
| `diff` | Patch Git lorsque des fichiers ont été modifiés |
| `changedFiles` | Chemins des fichiers modifiés |
| `threadId` | Identifiant de thread/session Codex lorsqu'il est disponible |
| `branchName` | Nom de la branche de travail |
| `pullRequestUrl` | URL de la PR dans les modes `draft_pr`, `open_pr`, `open_or_update_pr` et `update_existing_pr` |
| `pushedBranch` | Branche qui a été poussée dans les modes commit/PR |
| `patchUrl` | Lien de téléchargement du diff en mode `patch_artifact` |
| `usage` | Métadonnées d'utilisation rapportées par la CLI Codex lorsqu'elles sont disponibles |
## Captures d'écran d'interface dans les pull requests

Pour les tâches d'interface/frontend, Codex doit enregistrer les captures d'écran PNG dans un chemin ignoré par git tel que `frontend/.e2e-artifacts/` (et non dans les sources). Si les dépendances frontend sont manquantes, Codex peut exécuter `bun install` (ou npm/pnpm install) et démarrer un aperçu éphémère/`bun run dev` uniquement pour capturer l'interface. Heym téléverse ces images vers une **prerelease** GitHub partagée unique (`codex-pr-assets`) sous forme d'assets nommés `<branch>-…`, puis les intègre dans la description de la PR **avant l'ouverture de la pull request**, de sorte qu'une nouvelle PR est créée en contenant déjà ses captures d'écran (les PR existantes sont mises à jour sur place). Codex doit également définir un `pull_request_title` explicite (jamais de valeurs de remplissage telles que `Done.`).

Il arrive que Codex termine un tour au milieu d'une tâche (« …Now let me take a screenshot »), ce qui finaliserait l'exécution avant la capture de l'écran. Pour éviter cela, le prompt du runner exige la capture des écrans **avant** le résultat final, et si l'exécution se termine malgré tout sans résumé publiable ou avec une modification d'interface sans capture d'écran, Heym relance une passe Codex supplémentaire dans le même espace de travail pour terminer. Si une modification d'interface reste sans capture d'écran par la suite, une note visible est ajoutée au corps de la PR afin que cet écart ne soit jamais silencieux.

## Ce qui est publié sur GitHub

Votre **Task Prompt** est une entrée privée, et non un contenu de PR. Seuls deux éléments sont publiés : une section `## Change Summary` décrivant ce que fait la modification de code, et une section `## Screenshots` lorsque des captures d'écran ont été réalisées. Le titre de la PR est dérivé du résumé des modifications uniquement.

Le prompt du runner énonce cette politique, et Heym l'applique également après l'exécution : avant tout commit ou ouverture d'une pull request, il supprime les sections d'écho du prompt (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) ainsi que tout paragraphe copié mot pour mot depuis le prompt de tâche, dans le résumé, le corps de la PR et le message de commit. La narration d'étapes telle que `Both pass. Let me do a final review:` est également rejetée comme titre de PR ou sujet de commit.

## Questions de suivi

Si Codex a besoin d'exigences manquantes ou d'une décision produit, il renvoie `needs_input`. Heym met l'exécution en pause et expose une sortie `question`. Connectez cette sortie à une branche de notification, par exemple Slack ou Send Email, pour envoyer au relecteur le lien public de suivi.

Lorsque le relecteur répond, Heym reprend le même snapshot d'exécution et le même thread Codex à partir des métadonnées d'espace de travail enregistrées.

## En tant qu'outil d'agent

Le nœud Codex peut être rattaché à la sortie d'outil d'un nœud **AI Agent** afin que l'agent puisse déléguer des tâches de codage. Configurez l'identifiant, l'identifiant GitHub et le dépôt sur le nœud, puis marquez **Task Prompt** (et éventuellement **Repository URL**) avec le bouton fourni par l'agent afin que celui-ci les fournisse à l'appel. Lorsque Codex s'exécute en tant qu'outil, un résultat `needs_input` est renvoyé directement à l'agent au lieu de mettre le workflow en pause, ce qui permet à l'agent d'affiner la demande et d'appeler Codex à nouveau.

## Exemple

```json
{
  "id": "codex-1",
  "type": "codex",
  "position": { "x": 420, "y": 120 },
  "data": {
    "label": "fix_pr",
    "credentialId": "codex-credential-uuid",
    "githubCredentialId": "github-credential-uuid",
    "repositoryUrl": "https://github.com/acme/app",
    "baseBranch": "main",
    "taskPrompt": "$input.text",
    "publishMode": "draft_pr",
    "branchName": "codex/$executionId",
    "timeoutSeconds": 3600
  }
}
```

## Voir aussi

- [Nœud GitHub](./github-node.md)
- [Nœud Agent](./agent-node.md)
- [Identifiants](../reference/credentials.md)
- [Partage d'identifiants](../reference/credentials-sharing.md)
- [Types de nœuds](../reference/node-types.md)
