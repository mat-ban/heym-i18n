# Node OpenCode Go

El node **OpenCode Go** executa la CLI d'[OpenCode](https://opencode.ai) (Go) en un contenidor Heym aïllat i endurit contra un repositori de GitHub. Com el node Codex, està dissenyat per a tasques de programació com ara corregir proves, editar fitxers, produir un pedaç o obrir una pull request — però utilitza la passarel·la de models **OpenCode Go**, agnòstica pel que fa al proveïdor, en lloc d'OpenAI Codex.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Credencial | Clau API d'OpenCode Go + GitHub |
| Sortida | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Autenticació

La credencial **OpenCode Go** emmagatzema una **clau API** de la passarel·la OpenCode Go (de [opencode.ai/go](https://opencode.ai/go)) i una **Gateway Base URL** opcional (per defecte `https://opencode.ai/zen/go/v1`; sobreescrigueu-la només per a una passarel·la autoallotjada o amb proxy).

El node també requereix una credencial de **GitHub** per clonar repositoris privats, pujar la branca de treball i crear pull requests. El token de GitHub **mai no s'introdueix dins del contenidor sandbox** — Heym duu a terme totes les operacions de git i GitHub a l'amfitrió, de manera que el codi generat no pot exfiltrar les credencials de push.

## Aïllament i seguretat

L'aïllament d'execució es tria mitjançant `HEYM_OPENCODE_CLI_COMMAND`, exactament igual que al node Codex:

- **Desenvolupament local (`run.sh`)** el deixa amb el valor per defecte `opencode`, de manera que OpenCode s'executa com un subprocés de l'amfitrió contra l'espai de treball clonat — no cal Docker ni cap flag addicional.
- **Desplegaments Docker (`deploy.sh` i la imatge única de GHCR)** el configuren com a `/usr/local/bin/heym-opencode-docker`, un embolcall que executa `opencode run` dins d'un **contenidor germà endurit i efímer** que comparteix el volum nomenat de l'espai de treball d'OpenCode.

El contenidor d'execució endurit elimina totes les capacitats de Linux, estableix `no-new-privileges`, utilitza una arrel de només lectura amb un tmpfs `/tmp` i aplica límits de pid/memòria/CPU. Es permet la sortida de xarxa (OpenCode ha d'arribar a la passarel·la de models). El **token de GitHub mai no s'introdueix dins del contenidor** — totes les operacions de git i GitHub s'executen a l'amfitrió, de manera que només la clau API d'OpenCode i els fitxers del repositori es troben mai a l'interior.

OpenCode només edita fitxers al disc; Heym és el propietari de cada acció de git/GitHub.

## Models

La llista de models d'OpenCode Go canvia sovint, de manera que el camp **Model** s'omple en directe a partir de la llista de models de la passarel·la (`GET https://opencode.ai/zen/go/v1/models`) i es mostra com un desplegable cercable. Si la llista en directe no està disponible, s'utilitza una llista de reserva integrada. Els identificadors de model utilitzen la forma `opencode-go/<model>` (per exemple `opencode-go/kimi-k3`, `opencode-go/deepseek-v4-pro`, `opencode-go/qwen3.7-max`) — `opencode-go` és l'identificador de proveïdor de la CLI d'OpenCode per a la passarel·la Go. Deixeu el camp buit per utilitzar el valor per defecte de l'executor (`opencode-go/kimi-k3`). Els identificadors de model desats en la forma antiga `opencode/<model>` es reescriuen automàticament en temps d'execució.

## Camps

| Camp | Descripció |
|-------|-------------|
| Credencial OpenCode Go | Credencial d'OpenCode Go (clau API de la passarel·la) |
| Credencial GitHub | Credencial PAT de GitHub utilitzada per a l'accés al repositori |
| URL del repositori | URL HTTPS del repositori de GitHub; admet expressions |
| Branca base | Branca a clonar abans que s'executi OpenCode, per defecte `main` |
| Model | Model d'OpenCode Go (desplegable cercable en directe, `opencode-go/<model>`); buit utilitza el valor per defecte de l'executor |
| Variant de raonament | Opcional; s'assigna a `opencode run --variant` per als models que admeten esforç de raonament |
| Prompt de la tasca | Tasca de programació per a OpenCode; admet expressions com ara `$input.text` |
| Mode de publicació | Com es lliuren els canvis (vegeu la taula següent) |
| Nom de la branca | Branca de treball per als modes PR/commit, per defecte `opencode/$executionId` |
| Timeout | Temps màxim d'execució d'OpenCode en segons |

## Modes de publicació

| Mode | Què fa |
|------|--------------|
| `diff_only` | Edita fitxers localment i retorna el pedaç i els fitxers modificats. No es puja res. |
| `draft_pr` | Fa commit a la branca, la puja i obre una pull request en esborrany. |
| `open_pr` | Fa commit a la branca, la puja i obre una pull request a punt per a revisió (no en esborrany). |
| `commit_push` | Fa commit a la branca i la puja, sense obrir cap pull request. |
| `direct_commit` | Fa commit i puja directament a la branca base (sense branca separada ni PR). |
| `open_or_update_pr` | Actualitza la PR oberta existent de l'agent quan n'hi ha una — fins i tot si el nom de la branca difereix, l'executor la troba per autor + base — altrament n'obre una de nova. El millor per a reexecucions i instruccions del tipus "actualitza la PR oberta". |
| `update_existing_pr` | Afegeix un commit a la branca/PR existent; n'obre una si encara no n'hi ha cap. |
| `patch_artifact` | Desa el diff com a fitxer descarregable i retorna `patchUrl`. No es puja res. |
## Outputs

| Clau | Descripció |
|-----|-------------|
| `status` | Sempre `completed` (el node OpenCode Go no es pausa per esperar entrada) |
| `summary` | Missatge final d'OpenCode |
| `validation` | Notes de validació quan s'informen |
| `diff` | Pedaç de Git quan hi ha fitxers modificats |
| `changedFiles` | Rutes dels fitxers modificats |
| `branchName` | Nom de la branca de treball |
| `pullRequestUrl` | URL del PR en els modes `draft_pr`, `open_pr`, `open_or_update_pr` i `update_existing_pr` |
| `pushedBranch` | Branca que s'ha pujat en els modes commit/PR |
| `patchUrl` | Enllaç de descàrrega del diff en el mode `patch_artifact` |

## Captures de pantalla de la UI en pull requests

Per a tasques de UI/frontend, OpenCode ha de desar captures de pantalla PNG sota una ruta ignorada per git com ara `frontend/.e2e-artifacts/` (no al codi font). Si falten les dependències de frontend, el prompt del runner permet una instal·lació puntual de paquets (per exemple `bun install`) més una previsualització efímera/`bun run dev` únicament per capturar la UI. Heym puja aquestes imatges a una única **prerelease** compartida de GitHub (`opencode-pr-assets`) com a assets anomenats `<branch>-…`, i tot seguit les incrusta a la descripció del PR **abans que s'obri la pull request**, de manera que un PR nou es crea ja amb les seves captures de pantalla (els PR existents s'actualitzen in situ).

També s'indica a OpenCode que acabi amb una línia `PR_TITLE: …` perquè Heym pugui obrir la pull request amb un assumpte significatiu en lloc de marcadors de posició com ara `Done.`

De vegades OpenCode acaba un torn a mig fer ("…Now let me take a screenshot"), cosa que finalitzaria l'execució abans que es capturi la captura de pantalla. Per evitar-ho, el prompt del runner requereix capturar les captures de pantalla **abans** del missatge final, i si l'execució tot i així acaba sense un resum publicable o amb un canvi de UI però sense captura de pantalla, Heym executa una passada més d'OpenCode al mateix espai de treball per acabar-ho. Si un canvi de UI encara no té captura de pantalla després d'això, s'afegeix una nota visible al cos del PR perquè aquesta mancança no passi mai desapercebuda.

## Què es publica a GitHub

El vostre **Task Prompt** és una entrada privada, no contingut del PR. Només es publiquen dues coses: una secció `## Change Summary` que descriu què fa el canvi de codi, i una secció `## Screenshots` quan s'han capturat captures de pantalla. El títol del PR es deriva únicament del resum del canvi.

El prompt del runner estableix aquesta política, i Heym també la fa complir després de l'execució: abans que es faci cap commit o s'obri cap pull request, elimina les seccions d'eco del prompt (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) i qualsevol paràgraf copiat textualment del task prompt del resum, del cos del PR i del missatge de commit.

Heym llegeix la secció `## Change Summary` dels missatges de l'agent en lloc d'agafar el que aquest hagi dit en darrer lloc, perquè OpenCode emet un missatge per pas i el darrer sovint és un comentari a mig fer. La narració de passos (`Both pass. Let me do a final review:`) també es rebutja com a títol de PR o assumpte de commit. Si l'execució no produeix cap resum de canvi utilitzable, la pull request recorre a llistar els fitxers modificats en lloc de publicar comentaris.

## Com a eina d'agent

El node OpenCode Go es pot adjuntar a la maneta d'eines d'un node **AI Agent** perquè l'agent pugui delegar tasques de programació. Configureu la credencial, la credencial de GitHub i el repositori al node, i després marqueu **Task Prompt** (i opcionalment **Repository URL**) amb el commutador proporcionat per l'agent perquè aquest els proporcioni en el moment de la crida.

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

## Relacionat

- [Node Codex](./codex-node.md)
- [Node GitHub](./github-node.md)
- [Node Agent](./agent-node.md)
- [Credencials](../reference/credentials.md)
- [Compartició de credencials](../reference/credentials-sharing.md)
- [Tipus de node](../reference/node-types.md)
