# Codex csomópont

A **Codex** csomópont az OpenAI Codex CLI-t futtatja egy elkülönített Heym munkaterületen egy GitHub repositoryval szemben. Kódolási feladatokra készült, mint például tesztek javítása, fájlok szerkesztése, patch készítése vagy draft pull request megnyitása.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1, valamint `question` |
| Hitelesítési adat | Codex access token + GitHub |
| Kimenet | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Hitelesítés

Az **OpenAI Codex** hitelesítési adat két hitelesítési módot támogat:

| Mód | Leírás |
|------|-------------|
| **Bejelentkezés ChatGPT-vel** (ajánlott) | OAuth (PKCE) bejelentkezés, amely az Ön ChatGPT Plus/Pro előfizetését használja, így a futtatások **nem** járnak tokenenkénti API-költséggel. Kattintson a **Sign in with ChatGPT** gombra a hitelesítési adat párbeszédablakában, engedélyezze a böngészőjében, majd illessze vissza a `localhost:1455` átirányítási URL-t a Heymbe. A Heym eltárolja a kapott token csomagot, és automatikusan frissíti annak lejártakor. |
| **Access token** | Illesszen be egy ChatGPT/Codex `access_token` tokent, amelyet kizárólag a helyi Codex futtató használ. |

A Codex hitelesítési adathoz API-kulcsok nem fogadhatók el. A csomópont nem küld felhőalapú Codex feladatokat; a repositoryt a Heym futtatókörnyezetén belül klónozza, a ChatGPT token csomagot egy elkülönített `auth.json` fájlba írja (vagy átadja a `CODEX_ACCESS_TOKEN` értéket) kizárólag a Codex folyamat számára, és a tokent távol tartja a `$credentials` elemtől.

A csomópont emellett **GitHub** hitelesítési adatot igényel a privát repositoryk klónozásához, a munkabranch pusholásához és a draft pull requestek létrehozásához.

Docker telepítéseknél a Heym a Codexet egy testvérkonténerben futtatja ugyanabból a Heym image-ből (nem külön GHCR image-ből). Ez a konténer csak a Codex munkaterület volume-ot csatolja, és hagyja, hogy a Codex saját bubblewrap sandboxja hozzon létre namespace-eket és egy friss `/proc`-ot. A futtató hozzáadja a `SYS_ADMIN` jogosultságot, a nem korlátozott seccomp és AppArmor beállításokat, valamint a `systempaths=unconfined` opciót (Docker Engine 25+). Az utóbbi flag nélkül minden parancs meghiúsul az indítás előtt a következő hibával: `bwrap: Can't mount proc on /newroot/proc: Operation not permitted`.

OpenAI hivatkozások:

- [Codex authentication](https://developers.openai.com/codex/auth)
- [Codex access tokens](https://developers.openai.com/codex/enterprise/access-tokens)
- [Codex models](https://learn.chatgpt.com/docs/models?surface=cli)
- [Codex non-interactive mode](https://developers.openai.com/codex/noninteractive)
- [Codex pricing](https://developers.openai.com/codex/pricing)

## Mezők

| Mező | Leírás |
|-------|-------------|
| Codex Credential | OpenAI Codex hitelesítési adat (ChatGPT bejelentkezés vagy `access_token`) |
| GitHub Credential | GitHub PAT hitelesítési adat a repository eléréséhez |
| Repository URL | HTTPS GitHub repository URL |
| Base Branch | A Codex futtatása előtt klónozandó branch, alapértelmezett: `main` |
| Model | Opcionális Codex modell (szerkeszthető legördülő lista, pl. `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`); üresen hagyva a Codex alapértelmezett modelljét használja |
| Reasoning Effort | Codex érvelési mélység: `low`, `medium`, `high`, `xhigh` (Extra High), `max` vagy `ultra` (alapértelmezett: `medium`) |
| Task Prompt | Kódolási feladat a Codex számára; támogatja a kifejezéseket, például `$input.text` |
| Publish Mode | A változtatások átadásának módja (lásd az alábbi táblázatot) |
| Branch Name | Munkabranch a PR/commit módokhoz, alapértelmezett: `codex/$executionId` |
| Timeout | A Codex maximális végrehajtási ideje másodpercben |

## Publish módok

| Mód | Mit tesz |
|------|--------------|
| `diff_only` | Helyben szerkeszti a fájlokat, és visszaadja a patchet és a módosított fájlokat. Semmi sem kerül pusholásra. |
| `draft_pr` | Commitol a branchre, pusholja azt, és megnyit egy draft pull requestet. |
| `open_pr` | Commitol a branchre, pusholja azt, és megnyit egy review-ra kész (nem draft) pull requestet. |
| `commit_push` | Commitol a branchre és pusholja azt, pull request megnyitása nélkül. |
| `direct_commit` | Közvetlenül a base branchre commitol és pushol (külön branch vagy PR nélkül). |
| `open_or_update_pr` | Frissíti az ügynök meglévő nyitott PR-jét, ha létezik ilyen — még akkor is, ha a branch neve eltér, a futtató szerző + base alapján megtalálja —, egyébként újat nyit. Újrafuttatásokhoz és „a nyitott PR frissítése" utasításokhoz a legjobb. |
| `update_existing_pr` | Commitot ad a meglévő branchhez/PR-hez; újat nyit, ha még nem létezik. |
| `patch_artifact` | A diffet letölthető fájlként menti, és visszaadja a `patchUrl` értéket. Semmi sem kerül pusholásra. |

## Kimenetek

| Kulcs | Leírás |
|-----|-------------|
| `status` | `completed` vagy `needs_input` |
| `summary` | A Codex összefoglalója |
| `validation` | A Codex által jelentett validációs megjegyzések, tesztek vagy ellenőrzések |
| `diff` | Git patch, ha a fájlok módosultak |
| `changedFiles` | Módosított fájlútvonalak |
| `threadId` | Codex thread/session azonosító, ha elérhető |
| `branchName` | Munkabranch neve |
| `pullRequestUrl` | PR URL `draft_pr`, `open_pr`, `open_or_update_pr` és `update_existing_pr` módokban |
| `pushedBranch` | A pusholt branch commit/PR módokban |
| `patchUrl` | Letöltési link a diffhez `patch_artifact` módban |
| `usage` | A Codex CLI által jelentett használati metaadatok, ha elérhetők |
## UI képernyőképek pull requesteknél

UI/frontend feladatok esetén a Codexnek PNG képernyőképeket kell mentenie egy gitignore-olt útvonalra, például a `frontend/.e2e-artifacts/` alá (nem a forráskódba). Ha a frontend függőségei hiányoznak, a Codex futtathatja a `bun install` parancsot (vagy npm/pnpm install-t), és elindíthat egy rövid életű preview-t/`bun run dev`-et kizárólag a UI rögzítése céljából. A Heym feltölti ezeket a képeket egyetlen megosztott GitHub **prerelease**-be (`codex-pr-assets`) `<branch>-…` néven, majd beágyazza őket a PR leírásába **a pull request megnyitása előtt**, így az új PR már a képernyőképeivel együtt jön létre (a meglévő PR-ek helyben frissülnek). A Codexnek emellett egy értelmes `pull_request_title`-t is be kell állítania (soha nem placeholdert, például `Done.`).

A Codex néha a feladat közepén fejezi be a kört ("…Most készítek egy képernyőképet"), ami a futtatást a képernyőkép rögzítése előtt lezárná. Ennek megelőzésére a runner prompt megköveteli a képernyőképek rögzítését **a végeredmény előtt**, és ha a futtatás mégis közzétehető összefoglaló nélkül, vagy UI-változással, de képernyőkép nélkül fejeződik be, a Heym egy további Codex kört futtat ugyanabban a munkaterüben a befejezéshez. Ha egy UI-változáshoz ezt követően sem tartozik képernyőkép, egy látható megjegyzés kerül a PR törzsébe, így a hiány soha nem marad csendben.

## Mi kerül közzétételre a GitHubon

A **Task Prompt** privát bemenet, nem PR-tartalom. Csak két dolog kerül közzétételre: egy `## Change Summary`, amely leírja, mit tesz a kódváltozás, és egy `## Screenshots` szakasz, amikor képernyőképek készültek. A PR címe kizárólag a változás összefoglalójából származik.

A runner prompt rögzíti ezt a szabályzatot, és a Heym a futtatás után is érvényesíti: mielőtt bármit commitolnának vagy pull requestként megnyitnának, eltávolítja a prompt-visszhang szakaszokat (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …), valamint minden olyan bekezdést, amely szó szerint a feladat promptból lett átmásolva, az összefoglalóból, a PR törzséből és a commit üzenetéből. A lépések elbeszélése, például a `Both pass. Let me do a final review:` szintén elutasításra kerül PR-címként vagy commit-tárgyként.

## Utólagos kérdések

Ha a Codexnek hiányzó követelményekre vagy termékdöntésre van szüksége, `needs_input`-ot ad vissza. A Heym szünetelteti a futtatást, és elérhetővé tesz egy `question` kimeneti fogantyút. Csatlakoztassa ezt a fogantyút egy értesítési ághoz, például Slackhez vagy Send Emailhez, hogy elküldje az ellenőrzőnek a nyilvános utólagos kérdés linkjét.

Amikor az ellenőrző válaszol, a Heym folytatja ugyanazt a futtatási pillanatképet és Codex szálat a mentett munkaterület metaadataiból.

## Ügynök eszközként

A Codex csomópont csatlakoztatható egy **AI Agent** csomópont eszköz fogantyújához, hogy az ügynök kódolási feladatokat delegálhasson. Konfigurálja a hitelesítési adatokat, a GitHub hitelesítési adatokat és a repository-t a csomóponton, majd jelölje meg a **Task Prompt** (és opcionálisan a **Repository URL**) mezőt az ügynök által biztosított kapcsolóval, hogy az ügynök a hívás idején adja meg azokat. Amikor a Codex eszközként fut, a `needs_input` eredmény inline kerül visszaadásra az ügynöknek a workflow szüneteltetése helyett, így az ügynök finomíthatja a kérést, és újra meghívhatja a Codexet.

## Példa

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

## Kapcsolódó

- [GitHub csomópont](./github-node.md)
- [Agent csomópont](./agent-node.md)
- [Hitelesítési adatok](../reference/credentials.md)
- [Hitelesítési adatok megosztása](../reference/credentials-sharing.md)
- [Csomóponttípusok](../reference/node-types.md)
