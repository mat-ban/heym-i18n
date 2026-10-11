# Playwright

Le nœud **Playwright** automatise les interactions avec le navigateur au moyen d'étapes configurables. Utilisez-le pour le web scraping, le remplissage de formulaires et les Workflows basés sur le navigateur.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Sortie | `$nodeLabel.results`, `$nodeLabel.screenshot`, et données réseau/navigateur facultatives |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `playwrightMode` | string | `"steps"` (par défaut) ou `"code"` (Run Code). À choisir dans la liste déroulante Mode du panneau de propriétés |
| `playwrightSteps` | array | Étapes : navigate, click, type, aiStep, etc. Chaque étape possède une action et un selector/params. `disabled: true` conserve une étape dans la liste mais l'ignore à l'exécution |
| `playwrightCode` | string | Code Playwright Python personnalisé utilisé lorsque le Mode est Run Code. S'exécute dans le sandbox renforcé et est **désactivé par défaut** — voir la note de sécurité ci-dessous |
| `playwrightHeadless` | boolean | Exécuter en mode headless (par défaut : true) |
| `playwrightStealth` | boolean | Paramètre optionnel du mode Steps qui réduit les signaux d'automatisation Playwright courants (par défaut : false). Libellé dans le panneau de propriétés : Reduce automation flags |
| `playwrightTimeout` | number | Timeout en ms (par défaut : 30000) |
| `playwrightCaptureNetwork` | boolean | Capturer les réponses JSON, les en-têtes, les cookies et le stockage du navigateur |
| `playwrightAuthEnabled` | boolean | Restaurer l'authentification du navigateur à partir des cookies/storageState avant d'exécuter les étapes |
| `playwrightAuthStateExpression` | string | Expression ou JSON qui se résout en `storageState` Playwright ou en `cookies[]` bruts |
| `playwrightAuthCheckSelector` | string | Selector qui doit être visible après l'initialisation de l'authentification |
| `playwrightAuthCheckTimeout` | number | Timeout en ms pour la vérification du selector authentifié (par défaut : 5000) |
| `playwrightAuthFallbackSteps` | array | Étapes de secours dédiées à la connexion, à exécuter lorsque la restauration des cookies n'authentifie pas la page |

## Types d'étapes

- **navigate** – Accéder à l'URL
- **refresh** – Recharger la page courante (`timeout` d'étape facultatif en ms pour la navigation de rechargement)
- **click** – Cliquer sur un élément via un selector
- **type** – Saisir du texte dans un champ (caractère par caractère)
- **fill** – Remplir la valeur d'un champ
- **wait** – Attendre un délai (ms)
- **screenshot** – Capturer une capture d'écran (`outputKey` stocke le base64 dans results)
- **getText** – Contenu textuel d'un élément (`selector`, `outputKey` facultatif)
- **getAttribute** – Valeur d'un attribut (`selector`, `attribute`, `outputKey` facultatif)
- **getHTML** – HTML externe d'un élément (`selector`, `outputKey` facultatif)
- **getVisibleTextOnPage** – Texte visible de la page entière via `document.body.innerText` (aucun selector ; utilisez `outputKey` ; `timeout` d'étape facultatif en ms pour attendre avant la capture)
- **hover** – Survoler un élément
- **selectOption** – Sélectionner une option dans un `<select>`
- **scrollDown** / **scrollUp** – Défilement à la molette de la souris (`amount` facultatif en pixels)
- **aiStep** – Le LLM renvoie les mêmes types d'actions que les étapes manuelles (voir ci-dessous) ; l'imbrication d'`aiStep` n'est pas prise en charge

## Désactiver une étape

Chaque étape dispose d'un interrupteur d'alimentation dans son en-tête. Une étape désactivée affiche son titre barré et grisé, reste dans la liste avec tous ses champs, et est ignorée lors de l'exécution du nœud — utile pour isoler un selector défaillant sans supprimer votre travail. L'étape stockée porte `disabled: true` ; les étapes sans ce marqueur s'exécutent normalement.

Les étapes désactivées sont invisibles pour le reste du nœud : elles ne satisfont pas la règle « la première étape doit être `navigate` » de l'initialisation de l'authentification, un `aiStep` désactivé n'effectue aucun appel LLM, et les entrées désactivées dans `playwrightAuthFallbackSteps` sont également ignorées. Désactiver toutes les étapes fait échouer l'exécution avec un message vous invitant à en activer une.

## Étape AI

L'action **aiStep** utilise un LLM pour analyser le HTML de la page (et éventuellement une capture d'écran) et générer des actions Playwright à partir d'instructions en langage naturel. L'API accepte les mêmes noms d'actions que les étapes manuelles (y compris `navigate`, `refresh`, `getText`, `getHTML`, `getAttribute`, `getVisibleTextOnPage`, `screenshot`, les défilements, etc.). **Auto heal** ne remplace les étapes basées sur un selector en échec que par des alternatives pour click, type, fill, hover et selectOption.

| Option | Description |
|--------|-------------|
| `instructions` | Ce que l'IA doit faire (par ex. « Cliquer sur le bouton Login ») |
| `credentialId` | Identifiant LLM (OpenAI, Google ou Custom) |
| `model` | Liste consultable des modèles issus de l'identifiant LLM sélectionné |
| `saveStepsForFuture` | Mettre en cache les étapes générées pour les prochaines exécutions (évite l'appel LLM) |
| `sendScreenshot` | Envoyer une capture d'écran au LLM pour les éléments visuels |
| `aiStepTimeout` | Timeout de l'appel LLM en ms (par défaut : 30000) |
### AI Auto Heal

**AI Auto Heal** rend les workflows résilients aux changements du DOM. Lorsqu'un sélecteur échoue deux fois (par exemple après une refonte du site), Heym appelle le LLM pour trouver un localisateur alternatif — généralement `role=button[name='Submit']` ou `text=Exact text` au lieu des sélecteurs CSS.

Activez le **Auto heal mode** dans les propriétés du nœud AI. Si l'étape enregistrée échoue :

1. Heym capture le HTML et une capture d'écran de l'état actuel
2. Envoie l'étape échouée + le contexte de la page au LLM
3. Le LLM renvoie une alternative robuste (localisateur basé sur le rôle, localisateur textuel ou CSS de secours)
4. Réessaie avec le nouveau sélecteur

Cela réduit les instabilités lorsque les sites mettent à jour leur balisage ou leurs noms de classes.

## Reduce automation flags

Activez **Reduce automation flags** (`playwrightStealth: true`) lorsqu'un site traite le Chromium embarqué de Playwright comme un bot en raison des signaux d'automatisation standards (`HeadlessChrome` dans le user agent, `navigator.webdriver`, absence de `window.chrome`).

Cette option s'applique uniquement en mode **Steps**. Elle :

- Supprime le flag `--enable-automation` de Chromium et définit `--disable-blink-features=AutomationControlled`
- Envoie un user agent Chrome standard (sans `HeadlessChrome`)
- Restaure les surfaces de navigateur courantes que Playwright laisse vides (`window.chrome`, plugins)
- Laisse le renderer GPU de l'hôte inchangé lorsqu'un GPU est disponible (macOS/Windows en local). Linux/Docker n'a pas de GPU ; la chaîne du renderer logiciel de Chromium est alors rapportée comme un GPU typique Mali (ARM) ou Mesa (x86) au lieu de SwiftShader.

Cette option ne masque pas le fait que la session est pilotée via le Chrome DevTools Protocol, et elle ne constitue pas un moyen de contourner la sécurité d'un site, les CAPTCHAs ou les contrôles d'accès. Utilisez-la pour les workflows que vous êtes autorisé à exécuter — outils internes, vos propres sites et automatisation de navigateur autorisée.

Le mode Run Code reste inchangé — les scripts personnalisés lancent eux-mêmes Chromium.

## Network Capture

Activez `playwrightCaptureNetwork` pour collecter des données de débogage supplémentaires pendant l'exécution :

- `networkRequests` – Réponses JSON/API capturées
- `cookies` – Cookies du navigateur à la fin de l'exécution
- `localStorage` – Paires clé-valeur du `localStorage` du navigateur
- `sessionStorage` – Paires clé-valeur du `sessionStorage` du navigateur

Cette option est utile lorsque vous devez inspecter des appels API cachés, l'état d'authentification ou des données côté navigateur après un flux automatisé.

## Cookie Bootstrap And Login Fallback

Activez `playwrightAuthEnabled` lorsque vous souhaitez que Playwright ouvre une page déjà connectée.

### Auth State Source

Définissez `playwrightAuthStateExpression` sur une expression telle que `$global.authState`. La valeur peut être :

- Un objet `storageState` de Playwright : `{"cookies": [...], "origins": [...]}`
- Un tableau brut `cookies[]`
- Une chaîne JSON contenant l'une ou l'autre de ces formes

Schéma recommandé :

1. Exécutez un nœud Playwright avec la capture réseau ou le bootstrap d'authentification activé
2. Stockez `$playwrightNode.cookies` ou un objet d'état d'authentification complet dans une [Variable globale](../reference/global-variables.md)
3. Réutilisez cette variable dans les nœuds Playwright suivants via `$global.authState`

### Auth Check

La première étape principale Playwright doit être `navigate`. Une fois cette étape chargée, Heym vérifie `playwrightAuthCheckSelector`.

- Si le sélecteur est visible, les étapes principales restantes se poursuivent normalement
- Si le sélecteur est absent, Heym exécute `playwrightAuthFallbackSteps`
- Une fois les étapes de secours terminées, Heym vérifie à nouveau le même sélecteur
- Si le sélecteur est toujours absent, le nœud échoue avec une erreur de bootstrap d'authentification

Les étapes de secours prennent en charge la navigation après un échec d'authentification. Elles doivent laisser le navigateur sur la page authentifiée attendue par le reste du flux principal.

## Output Fields

- `$playwrightNode.status` – `"ok"` en cas de succès
- `$playwrightNode.results` – Sorties des étapes (getText, getHTML, getVisibleTextOnPage, getAttribute, clés de capture d'écran, etc.)
- `$playwrightNode.screenshot` – Capture d'écran en Base64 lorsqu'une étape en enregistre une
- `$playwrightNode.cookies` – Cookies finaux du navigateur lorsque le bootstrap d'authentification ou la capture réseau est activé
- `$playwrightNode.networkRequests` – Réponses réseau capturées (lorsque activé)
- `$playwrightNode.localStorage` – Stockage local du navigateur (lorsque activé)
- `$playwrightNode.sessionStorage` – Stockage de session du navigateur (lorsque activé)

## Example

```json
{
  "type": "playwright",
  "data": {
    "label": "browserAutomation",
    "playwrightSteps": [
      { "action": "navigate", "url": "$userInput.body.url" },
      { "action": "type", "selector": "#search", "text": "query" },
      { "action": "click", "selector": "button[type=submit]" }
    ],
    "playwrightHeadless": true
  }
}
```
## Mode Run Code

Dans le panneau de propriétés, définissez **Mode** sur **Run Code** pour modifier `playwrightCode` au lieu des étapes visuelles. L'amorçage d'authentification s'applique uniquement au mode Steps.

Exemple (sandbox / Docker — Chromium nécessite `--no-sandbox`) :

```python
from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=headless,
        args=["--no-sandbox", "--force-webrtc-ip-handling-policy=disable_non_proxied_udp"],
    )
    page = browser.new_page()
    page.set_default_timeout(timeout_ms)
    page.goto("https://example.com")
    title = page.title()
    browser.close()
    print(json.dumps({"status": "ok", "results": {"title": title}}))
```

Le wrapper fournit `inputs`, `headless`, `timeout_ms` et `capture_network`. Vous pouvez intégrer des expressions `$nodeLabel.field` dans le code ; imprimez du JSON avec `status` et `results`.

## Sécurité du code personnalisé

Le champ `playwrightCode` exécute du Python arbitraire. Comme cela équivaut à une exécution de code, il est **désactivé par défaut** et, lorsqu'il est activé, il est isolé dans un sandbox :

- **Désactivé par défaut.** L'exécution d'un nœud dont `playwrightCode` est défini échoue avec une erreur explicite, sauf si un opérateur définit `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true`. La vérification s'exécute au moment de l'exécution, ce qui couvre également les Workflows précédemment enregistrés ainsi que les exécutions planifiées / de sous-Workflow.
- **Isolé lorsqu'activé.** Le code personnalisé ne s'exécute pas dans le processus backend. Il s'exécute dans un conteneur frère jetable et durci, sans socket Docker, sans montages bind du backend, sans secrets du backend dans son environnement, avec capacités supprimées, `no-new-privileges` et limites CPU / mémoire / PID. Si Docker n'est pas disponible, l'exécution échoue en mode fermé. `HEYM_PLAYWRIGHT_SANDBOX=subprocess` réactive le chemin in-process pour un usage local ou de confiance uniquement (ce n'est pas une frontière de sécurité). Le `./run.sh` natif utilise `subprocess` par défaut lorsqu'aucun `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` n'est défini. `./deploy.sh` (Compose) et l'image unique GHCR résolvent le runner frère via `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` (avec repli sur `HEYM_CODEX_DOCKER_IMAGE`) et utilisent le chemin venv correspondant (`/app/.venv` vs `/app/backend/.venv`).
- **Note sur Chromium.** Le conteneur sandbox s'exécute en tant que root par défaut, et Chromium refuse de s'exécuter en tant que root sans `--no-sandbox`. Le code personnalisé qui lance Chromium doit le passer, par exemple `browser = p.chromium.launch(headless=True, args=["--no-sandbox"])`. Les lancements basés sur des étapes (et furtifs) passent également `--force-webrtc-ip-handling-policy=disable_non_proxied_udp` afin que les scripts d'empreinte ne puissent pas ouvrir de STUN UDP vers `stun.l.google.com:19302`. Les appels personnalisés à `chromium.launch` doivent également inclure ce flag.

Les nœuds Playwright basés sur des étapes (`playwrightSteps`) sont entièrement générés par Heym (aucun code arbitraire), ne sont pas affectés par tout ce qui précède et sont toujours disponibles — privilégiez-les.

## Voir aussi

- [Types de nœuds](../reference/node-types.md) – Vue d'ensemble de tous les types de nœuds
- [Nœud Crawler](./crawler-node.md) – Web scraping simplifié avec FlareSolverr
- [Partage des identifiants](../reference/credentials-sharing.md) – Identifiants LLM pour les étapes IA
