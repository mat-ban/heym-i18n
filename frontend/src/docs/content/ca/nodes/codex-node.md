# Node Codex

El node **Codex** executa la CLI d'OpenAI Codex en un espai de treball aïllat de Heym contra un repositori de GitHub. Està dissenyat per a tasques de programació com ara corregir proves, editar fitxers, produir un pedaç o obrir una pull request en esborrany.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1, més `question` |
| Credencial | Token d'accés de Codex + GitHub |
| Sortida | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Autenticació

La credencial **OpenAI Codex** admet dos modes d'autenticació:

| Mode | Descripció |
|------|-------------|
| **Inicieu sessió amb ChatGPT** (recomanat) | Inici de sessió OAuth (PKCE) que utilitza la vostra subscripció ChatGPT Plus/Pro, de manera que les execucions **no** incorren en costos d'API per token. Feu clic a **Inicieu sessió amb ChatGPT** al diàleg de credencials, autoritzeu al navegador i enganxeu l'URL de redirecció `localhost:1455` de nou a Heym. Heym emmagatzema el paquet de tokens resultant i el renova automàticament quan caduca. |
| **Token d'accés** | Enganxeu un `access_token` de ChatGPT/Codex utilitzat només pel runner local de Codex. |

Les claus d'API no s'accepten per a la credencial de Codex. El node no envia tasques de Codex al núvol; clona el repositori dins de l'entorn d'execució de Heym, escriu el paquet de tokens de ChatGPT en un `auth.json` aïllat (o passa `CODEX_ACCESS_TOKEN`) només al procés de Codex, i manté el token fora de `$credentials`.

El node també requereix una credencial de **GitHub** per clonar repositoris privats, pujar la branca de treball i crear pull requests en esborrany.

En desplegaments Docker, Heym executa Codex dins d'un contenidor germà de la mateixa imatge de Heym (no una imatge GHCR separada). Aquest contenidor munta només el volum de l'espai de treball de Codex i permet que el propi sandbox bubblewrap de Codex creï espais de noms i un `/proc` nou. El runner afegeix `SYS_ADMIN`, seccomp i AppArmor no confinats, i `systempaths=unconfined` (Docker Engine 25+). Sense aquest darrer indicador, cada ordre falla abans de llançar-se amb `bwrap: Can't mount proc on /newroot/proc: Operation not permitted`.

Referències d'OpenAI:

- [Autenticació de Codex](https://developers.openai.com/codex/auth)
- [Tokens d'accés de Codex](https://developers.openai.com/codex/enterprise/access-tokens)
- [Models de Codex](https://learn.chatgpt.com/docs/models?surface=cli)
- [Mode no interactiu de Codex](https://developers.openai.com/codex/noninteractive)
- [Preus de Codex](https://developers.openai.com/codex/pricing)

## Camps

| Camp | Descripció |
|-------|-------------|
| Credencial de Codex | Credencial d'OpenAI Codex (inici de sessió amb ChatGPT o `access_token`) |
| Credencial de GitHub | Credencial PAT de GitHub utilitzada per a l'accés al repositori |
| URL del repositori | URL HTTPS del repositori de GitHub |
| Branca base | Branca a clonar abans que s'executi Codex, per defecte `main` |
| Model | Model de Codex opcional (desplegable editable, p. ex. `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`); buit utilitza el valor per defecte de Codex |
| Esforç de raonament | Profunditat de raonament de Codex: `low`, `medium`, `high`, `xhigh` (Extra High), `max` o `ultra` (per defecte `medium`) |
| Prompt de la tasca | Tasca de programació per a Codex; admet expressions com ara `$input.text` |
| Mode de publicació | Com es lliuren els canvis (vegeu la taula següent) |
| Nom de la branca | Branca de treball per als modes PR/commit, per defecte `codex/$executionId` |
| Temps d'espera | Temps màxim d'execució de Codex en segons |

## Modes de publicació

| Mode | Què fa |
|------|--------------|
| `diff_only` | Edita fitxers localment i retorna el pedaç i els fitxers modificats. No es puja res. |
| `draft_pr` | Fa commit a la branca, la puja i obre una pull request en esborrany. |
| `open_pr` | Fa commit a la branca, la puja i obre una pull request a punt per a revisió (no esborrany). |
| `commit_push` | Fa commit a la branca i la puja, sense obrir una pull request. |
| `direct_commit` | Fa commit i puja directament a la branca base (sense branca separada ni PR). |
| `open_or_update_pr` | Actualitza la PR oberta existent de l'agent quan n'hi ha una — encara que el nom de la branca sigui diferent, el runner la troba per autor + base — en cas contrari n'obre una de nova. El millor per a reexecucions i instruccions de "actualitza la PR oberta". |
| `update_existing_pr` | Afegeix un commit a la branca/PR existent; n'obre una si encara no n'hi ha cap. |
| `patch_artifact` | Desa el diff com a fitxer descarregable i retorna `patchUrl`. No es puja res. |

## Sortides

| Clau | Descripció |
|-----|-------------|
| `status` | `completed` o `needs_input` |
| `summary` | Resum de Codex |
| `validation` | Notes de validació, proves o comprovacions informades per Codex |
| `diff` | Pedaç de Git quan s'han modificat fitxers |
| `changedFiles` | Rutes dels fitxers modificats |
| `threadId` | Identificador de fil/sessió de Codex quan està disponible |
| `branchName` | Nom de la branca de treball |
| `pullRequestUrl` | URL de la PR en els modes `draft_pr`, `open_pr`, `open_or_update_pr` i `update_existing_pr` |
| `pushedBranch` | Branca que s'ha pujat en els modes commit/PR |
| `patchUrl` | Enllaç de descàrrega del diff en el mode `patch_artifact` |
| `usage` | Metadades d'ús informades per la CLI de Codex quan estan disponibles |
## Captures de pantalla de la interfície en pull requests

Per a tasques d'interfície o de frontend, Codex ha de desar les captures de pantalla PNG en una ruta ignorada per git, com ara `frontend/.e2e-artifacts/` (no al codi font). Si falten les dependències de frontend, Codex pot executar `bun install` (o npm/pnpm install) i iniciar una previsualització temporal o `bun run dev` únicament per capturar la interfície. Heym puja aquestes imatges a una única **prerelease** compartida de GitHub (`codex-pr-assets`) com a assets anomenats `<branch>-…`, i tot seguit les incrusta a la descripció de la PR **abans que s'obri la pull request**, de manera que una PR nova es crea ja amb les seves captures de pantalla (les PR existents s'actualitzen in situ). Codex també ha d'establir un `pull_request_title` significatiu (mai marcadors de posició com ara `Done.`).

De vegades, Codex acaba un torn a mig fer ("…Now let me take a screenshot"), cosa que finalitzaria l'execució abans que es capturi la captura de pantalla. Per evitar-ho, el prompt del runner requereix capturar les captures de pantalla **abans** del resultat final, i si l'execució encara acaba sense un resum publicable o amb un canvi d'interfície però sense captura de pantalla, Heym executa una passada més de Codex al mateix espai de treball per acabar-ho. Si un canvi d'interfície encara no té cap captura de pantalla després d'això, s'afegeix una nota visible al cos de la PR perquè aquesta mancança no passi mai desapercebuda.

## Què es publica a GitHub

El vostre **Task Prompt** és una entrada privada, no contingut de la PR. Només es publiquen dues coses: un `## Change Summary` que descriu què fa el canvi de codi, i una secció `## Screenshots` quan s'han capturat captures de pantalla. El títol de la PR es deriva únicament del resum del canvi.

El prompt del runner estableix aquesta política, i Heym també la fa complir després de l'execució: abans que res es confirmi o s'obri com a pull request, elimina les seccions d'eco del prompt (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) i qualsevol paràgraf copiat textualment del task prompt del resum, del cos de la PR i del missatge de commit. La narració de passos com ara `Both pass. Let me do a final review:` també es rebutja com a títol de PR o assumpte de commit.

## Preguntes de seguiment

Si Codex necessita requisits que falten o una decisió de producte, retorna `needs_input`. Heym posa en pausa l'execució i exposa un handle de sortida `question`. Connecteu aquest handle a una branca de notificació, per exemple Slack o Send Email, per enviar al revisor l'enllaç públic de seguiment.

Quan el revisor respon, Heym reprèn la mateixa instantània d'execució i el mateix fil de Codex a partir de les metadades desades de l'espai de treball.

## Com a eina d'agent

El node Codex es pot adjuntar al handle d'eines d'un node **AI Agent** perquè l'agent pugui delegar tasques de programació. Configureu la credencial, la credencial de GitHub i el repositori al node, i tot seguit marqueu **Task Prompt** (i opcionalment **Repository URL**) amb el commutador proporcionat per l'agent perquè aquest els proporcioni en el moment de la crida. Quan Codex s'executa com a eina, un resultat `needs_input` es retorna en línia a l'agent en lloc de posar en pausa el workflow, de manera que l'agent pot refinar la sol·licitud i tornar a cridar Codex.

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

## Relacionat

- [GitHub Node](./github-node.md)
- [Agent Node](./agent-node.md)
- [Credentials](../reference/credentials.md)
- [Credentials Sharing](../reference/credentials-sharing.md)
- [Node Types](../reference/node-types.md)
