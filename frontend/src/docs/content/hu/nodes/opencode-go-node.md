# OpenCode Go csomópont

Az **OpenCode Go** csomópont az [OpenCode](https://opencode.ai) CLI-t (Go) futtatja egy izolált, megerősített Heym konténerben egy GitHub adattárral szemben. A Codex csomóponthoz hasonlóan kódolási feladatokra készült, mint például tesztek javítása, fájlok szerkesztése, patch készítése vagy pull request megnyitása — azonban az OpenAI Codex helyett a szolgáltatófüggetlen **OpenCode Go** modellátjárót használja.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Hitelesítési adat | OpenCode Go API key + GitHub |
| Kimenet | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Hitelesítés

Az **OpenCode Go** hitelesítési adat egy OpenCode Go átjáró **API key**-t tárol (a [opencode.ai/go](https://opencode.ai/go) oldalról) és egy opcionális **Gateway Base URL**-t (alapértelmezés: `https://opencode.ai/zen/go/v1`; csak saját üzemeltetésű vagy proxyn keresztüli átjáró esetén írja felül).

A csomópont emellett **GitHub** hitelesítési adatot is igényel a privát adattárak klónozásához, a munkabranch pusholásához és pull requestek létrehozásához. A GitHub token **soha nem kerül a sandbox konténerbe** — a Heym minden git- és GitHub-műveletet a hoston végez, így a generált kód nem tudja kiszivárogtatni a push hitelesítési adatokat.

## Izoláció és biztonság

A végrehajtás izolációját a `HEYM_OPENCODE_CLI_COMMAND` választja ki, pontosan úgy, mint a Codex csomópont esetében:

- **Helyi fejlesztés (`run.sh`)** az alapértelmezett `opencode` értéken hagyja, így az OpenCode host-alprocesszént fut a klónozott munkaterületen — Docker nem szükséges, extra kapcsolók nélkül.
- **Docker telepítések (`deploy.sh` és az egységes GHCR image)** a `/usr/local/bin/heym-opencode-docker` értékre állítják, amely egy wrapper, és az `opencode run` parancsot egy **megerősített, eldobható testvérkonténerben** futtatja, amely az OpenCode munkaterület nevű kötetét osztja meg.

A megerősített futtatókonténer eltávolítja az összes Linux capability-t, beállítja a `no-new-privileges` opciót, csak olvasható root fájlrendszert használ egy tmpfs `/tmp` könyvtárral, valamint pid-, memória- és CPU-korlátokat alkalmaz. A hálózati kimenő forgalom engedélyezett (az OpenCode-nak el kell érnie a modellátjárót). A **GitHub token soha nem kerül a konténerbe** — minden git- és GitHub-művelet host oldalon fut, így csak az OpenCode API key és az adattár fájljai vannak a konténerben.

Az OpenCode kizárólag a lemezen lévő fájlokat szerkeszti; minden git/GitHub műveletet a Heym végez.

## Modellek

Az OpenCode Go modellkínálata gyakran változik, ezért a **Model** mező élőben, az átjáró modellistájából (`GET https://opencode.ai/zen/go/v1/models`) töltődik fel, és kereshető legördülő menüként jelenik meg. Ha az élő lista nem érhető el, egy beépített tartaléklista kerül használatra. A modell-azonosítók az `opencode-go/<model>` formátumot használják (például `opencode-go/kimi-k3`, `opencode-go/deepseek-v4-pro`, `opencode-go/qwen3.7-max`) — az `opencode-go` az OpenCode CLI szolgáltató-azonosítója a Go átjáróhoz. Hagyja üresen a mezőt a futtató alapértelmezésének (`opencode-go/kimi-k3`) használatához. A régebbi `opencode/<model>` formátumban mentett modell-azonosítók futásidőben automatikusan átíródnak.

## Mezők

| Mező | Leírás |
|-------|-------------|
| OpenCode Go Credential | OpenCode Go hitelesítési adat (átjáró API key) |
| GitHub Credential | GitHub PAT hitelesítési adat az adattárhozzáféréshez |
| Repository URL | HTTPS GitHub adattár URL; támogatja a kifejezéseket |
| Base Branch | Az OpenCode futtatása előtt klónozandó branch, alapértelmezés: `main` |
| Model | OpenCode Go modell (élő kereshető legördülő menü, `opencode-go/<model>`); üresen hagyva a futtató alapértelmezését használja |
| Reasoning Variant | Opcionális; az `opencode run --variant` kapcsolóhoz rendelődik az érvelési erőfeszítést támogató modelleknél |
| Task Prompt | Kódolási feladat az OpenCode számára; támogatja a kifejezéseket, például `$input.text` |
| Publish Mode | A változtatások átadásának módja (lásd az alábbi táblázatot) |
| Branch Name | Munkabranch PR/commit módokhoz, alapértelmezés: `opencode/$executionId` |
| Timeout | Az OpenCode maximális végrehajtási ideje másodpercben |

## Publish módok

| Mód | Mit tesz |
|------|--------------|
| `diff_only` | Helyben szerkeszti a fájlokat, és visszaadja a patchet és a módosított fájlokat. Semmi nem kerül pusholásra. |
| `draft_pr` | Commitol a branchre, pusholja, és megnyit egy draft pull requestet. |
| `open_pr` | Commitol a branchre, pusholja, és megnyit egy review-ra kész (nem draft) pull requestet. |
| `commit_push` | Commitol a branchre és pusholja, pull request megnyitása nélkül. |
| `direct_commit` | Közvetlenül a base branchre commitol és pushol (külön branch vagy PR nélkül). |
| `open_or_update_pr` | Frissíti az ügynök meglévő nyitott PR-jét, ha létezik ilyen — még ha a branch neve eltér is, a futtató szerző + base alapján megtalálja —, egyébként újat nyit. Újrafuttatásokhoz és „a nyitott PR frissítése" utasításokhoz a legjobb. |
| `update_existing_pr` | Commitot ad a meglévő branchhez/PR-hez; újat nyit, ha még nem létezik. |
| `patch_artifact` | Letölthető fájlként menti a diffet, és visszaadja a `patchUrl` értéket. Semmi nem kerül pusholásra. |

## Kimenetek

| Kulcs | Leírás |
|-----|-------------|
| `status` | Mindig `completed` (az OpenCode Go csomópont nem áll meg bemenetre várva) |
| `summary` | Az OpenCode záró üzenete |
| `validation` | Validációs megjegyzések, ha jelentve vannak |
| `diff` | Git patch, ha a fájlok módosultak |
| `changedFiles` | Módosított fájlútvonalak |
| `branchName` | Munkabranch neve |
| `pullRequestUrl` | PR URL `draft_pr`, `open_pr`, `open_or_update_pr` és `update_existing_pr` módokban |
| `pushedBranch` | A pusholt branch commit/PR módokban |
| `patchUrl` | Letöltési link a diffhez `patch_artifact` módban |
## UI képernyőképek pull requesteknél

UI/frontend feladatok esetén az OpenCode-nak PNG képernyőképeket kell mentenie egy git által figyelmen kívül hagyott útvonalra, például a `frontend/.e2e-artifacts/` könyvtárba (nem a forráskódba). Ha a frontend függőségei hiányoznak, a runner prompt engedélyez egy célzott csomagtelepítést (például `bun install`), valamint egy rövid életű preview-t/`bun run dev`-et kizárólag a UI rögzítéséhez. A Heym ezeket a képeket egyetlen megosztott GitHub **prerelease**-be (`opencode-pr-assets`) tölti fel `<branch>-…` néven, majd beágyazza őket a PR leírásába **még a pull request megnyitása előtt**, így az új PR már a képernyőképeivel együtt jön létre (a meglévő PR-ok helyben frissülnek).

Az OpenCode utasítást kap arra is, hogy egy `PR_TITLE: …` sorral zárja a munkát, így a Heym értelmes tárggyal tudja megnyitni a pull requestet a helyőrzők (például `Done.`) helyett.

Az OpenCode néha a feladat közepén fejezi be a kört ("…Most készítek egy képernyőképet"), ami a futtatást még a képernyőkép rögzítése előtt lezárná. Ennek megelőzésére a runner prompt megköveteli, hogy a képernyőképek **a záró üzenet előtt** készüljenek el, és ha a futtatás mégis közzétehető összefoglaló nélkül, vagy UI-változással, de képernyőkép nélkül fejeződik be, a Heym egy további OpenCode kört futtat ugyanabban a munkaterüben a befejezéshez. Ha egy UI-változáshoz ezután sem tartozik képernyőkép, egy látható megjegyzés kerül a PR törzsébe, így a hiány soha nem marad csendben.

## Mi kerül közzétételre a GitHubon

A **Task Prompt** privát bemenet, nem PR-tartalom. Csak két dolog kerül közzétételre: egy `## Change Summary` szakasz, amely leírja, mit tesz a kódváltozás, valamint egy `## Screenshots` szakasz, ha készültek képernyőképek. A PR címe kizárólag a változás összefoglalójából származik.

A runner prompt rögzíti ezt a szabályzatot, és a Heym a futtatás után is érvényesíti: mielőtt bármi commitolásra vagy pull requestként való megnyitásra kerülne, eltávolítja a prompt-visszhang szakaszokat (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …), valamint a feladat promptból szó szerint átmásolt bekezdéseket az összefoglalóból, a PR törzséből és a commit üzenetéből.

A Heym a `## Change Summary` szakaszt az ügynök üzeneteiből olvassa ki, ahelyett hogy az utolsóként elhangzottat venné, mert az OpenCode lépésenként bocsát ki egy üzenetet, és a záró üzenet gyakran a futtatás közbeni kommentár. A lépésenkénti narráció (`Both pass. Let me do a final review:`) szintén elutasításra kerül PR-címként vagy commit-tárgyként. Ha a futtatás nem eredményez használható változás-összefoglalót, a pull request a kommentár közzététele helyett a módosított fájlok felsorolására esik vissza.

## Ügynök eszközként

Az OpenCode Go csomópont egy **AI Agent** csomópont eszközkezelőjéhez csatlakoztatható, így az ügynök kódolási feladatokat delegálhat. Konfigurálja a hitelesítési adatokat, a GitHub hitelesítési adatokat és a repository-t a csomóponton, majd jelölje meg a **Task Prompt** (és opcionálisan a **Repository URL**) mezőt az ügynök által biztosított kapcsolóval, hogy az ügynök a híváskor adja meg azokat.

## Példa

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

## Kapcsolódó

- [Codex csomópont](./codex-node.md)
- [GitHub csomópont](./github-node.md)
- [Agent csomópont](./agent-node.md)
- [Hitelesítési adatok](../reference/credentials.md)
- [Hitelesítési adatok megosztása](../reference/credentials-sharing.md)
- [Csomóponttípusok](../reference/node-types.md)
