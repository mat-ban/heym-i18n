# OpenCode Go Čvor

**OpenCode Go** čvor pokreće [OpenCode](https://opencode.ai) CLI (Go) u izoliranom, zaštićenom Heym kontejneru protiv GitHub repozitorija. Poput Codex čvora, dizajniran je za zadatke kodiranja kao što su ispravljanje testova, uređivanje datoteka, proizvodnja patch-a ili otvaranje pull zahtjeva — ali koristi provider-agnostički **OpenCode Go** model gateway umjesto OpenAI Codex.

## Pregled

| Svojstvo | Vrijednost |
|----------|------------|
| Ulazi | 1 |
| Izlazi | 1 |
| Vjerodajnice | OpenCode Go API ključ + GitHub |
| Izlaz | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Autentifikacija

**OpenCode Go** vjerodajnica pohranjuje OpenCode Go gateway **API ključ** (s [opencode.ai/go](https://opencode.ai/go)) i opcionalnu **Gateway Base URL** (zadano `https://opencode.ai/zen/go/v1`; zamijenite samo za samostalno hostanu ili posredničku gateway).

Čvor također zahtijeva **GitHub** vjerodajnicu za kloniranje privatnih repozitorija, slanje radne grane i stvaranje pull zahtjeva. GitHub token **nikada se ne stavlja unutar sandbox kontejnera** — Heym obavlja sve git i GitHub operacije na hostu, tako da generirani kod ne može iznijeti push vjerodajnice.

## Izolacija i sigurnost

Izolacija izvršavanja odabire se pomoću `HEYM_OPENCODE_CLI_COMMAND`, točno kao i kod Codex čvora:

- **Lokalni razvoj (`run.sh`)** ostavlja ga na zadanoj vrijednosti `opencode`, tako da OpenCode radi kao podproces domaćina protiv kloniranog radnog prostora — bez Docker-a, bez dodatnih zastavica.
- **Docker implementacije (`deploy.sh` i jedinstvena GHCR slika)** postavljaju ga na `/usr/local/bin/heym-opencode-docker`, omotač koji pokreće `opencode run` unutar **zaštićenog, jednokratnog bratskog kontejnera** koji dijeli OpenCode radni prostor nazvan volumen.

Zaštićeni kontejner izvršitelja uklanja sve Linux mogućnosti, postavlja `no-new-privileges`, koristi samo za čitanje root s tmpfs `/tmp`, i primjenjuje ograničenja za pid/memoriju/CPU. Mrežni izlaz je dopušten (OpenCode mora doći do model gateway-a). **GitHub token nikada se ne stavlja unutar kontejnera** — sve git i GitHub operacije rade se na strani hosta, tako da su samo OpenCode API ključ i datoteke repozitorija unutar.

OpenCode samo uređuje datoteke na disku; Heym posjeduje svaku git/GitHub akciju.

## Modeli

Popis modela OpenCode Go često se mijenja, tako da se **Model** polje popunjava uživo s popisa modela gateway-a (`GET https://opencode.ai/zen/go/v1/models`) i prikazuje kao pretraživi padajući izbornik. Ako uživo popis nije dostupan, koristi se ugrađeni rezervni popis. Id-evi modela koriste oblik `opencode-go/<model>` (na primjer `opencode-go/kimi-k3`, `opencode-go/deepseek-v4-pro`, `opencode-go/qwen3.7-max`) — `opencode-go` je provider id OpenCode CLI za Go gateway. Ostavite polje prazno za korištenje zadane vrijednosti izvršitelja (`opencode-go/kimi-k3`). Id-evi modela pohranjeni u starijem obliku `opencode/<model>` automatski se prepisuju tijekom izvršavanja.

## Polja

| Polje | Opis |
|-------|------|
| OpenCode Go Vjerodajnica | OpenCode Go vjerodajnica (gateway API ključ) |
| GitHub Vjerodajnica | GitHub PAT vjerodajnica korištena za pristup repozitoriju |
| URL repozitorija | HTTPS GitHub URL repozitorija; podržava izraze |
| Osnovna grana | Grana koja se klonira prije nego što OpenCode pokrene, zadano `main` |
| Model | OpenCode Go model (uživo pretraživi padajući izbornik, `opencode-go/<model>`); prazno koristi zadanu vrijednost izvršitelja |
| Varijanta razmišljanja | Opcionalno; mapira se na `opencode run --variant` za modele koji podržavaju napor razmišljanja |
| Task Prompt | Zadatak kodiranja za OpenCode; podržava izraze kao što su `$input.text` |
| Način objave | Kako se promjene isporučuju (vidi tablicu u nastavku) |
| Ime grane | Radna grana za PR/commit načine, zadano `opencode/$executionId` |
| Timeout | Maksimalno vrijeme izvršavanja OpenCode u sekundama |

## Načini objave

| Način | Što radi |
|-------|----------|
| `diff_only` | Uređuje datoteke lokalno i vraća patch i promijenjene datoteke. Ništa se ne šalje. |
| `draft_pr` | Komitira na granu, šalje je i otvara nacrt pull zahtjev. |
| `open_pr` | Komitira na granu, šalje je i otvara pull zahtjev spreman za pregled (ne-nacrt). |
| `commit_push` | Komitira na granu i šalje je, bez otvaranja pull zahtjeva. |
| `direct_commit` | Komitira i šalje izravno na osnovnu granu (bez odvojene grane ili PR-a). |
| `open_or_update_pr` | Ažurira postojeći otvoreni PR agenta kada jedan postoji — čak i ako se ime grane razlikuje, izvršitelj ga pronalazi prema autoru + osnovi — inače otvara novi. Najbolje za ponovne izvršavanja i "ažuriraj otvoreni PR" upute. |
| `update_existing_pr` | Dodaje commit postojećoj grani/PR-u; otvara jedan ako još ne postoji. |
| `patch_artifact` | Spremi diff kao preuzetu datoteku i vraća `patchUrl`. Ništa se ne šalje. |

## Izlazi

| Ključ | Opis |
|-------|------|
| `status` | Uvijek `completed` (OpenCode Go čvor ne pauzira za unos) |
| `summary` | Konačna poruka OpenCode-a |
| `validation` | Napomene o validaciji kada su prijavljene |
| `diff` | Git patch kada su datoteke promijenjene |
| `changedFiles` | Putanje promijenjenih datoteka |
| `branchName` | Ime radne grane |
| `pullRequestUrl` | PR URL u `draft_pr`, `open_pr`, `open_or_update_pr` i `update_existing_pr` načinima |
| `pushedBranch` | Grana koja je poslana u commit/PR načinima |
| `patchUrl` | Link za preuzimanje za diff u `patch_artifact` načinu |
## UI snimke zaslona na pull zahtjevima

Za UI/frontend zadatke, OpenCode treba spremiti PNG snimke zaslona pod putanjom koja je ignorirana u git-u, poput `frontend/.e2e-artifacts/` (ne u izvoru). Ako nedostaju frontend ovisnosti, prompt izvršitelja omogućuje ciljanu instalaciju paketa (na primjer `bun install`) uz kratkotrajni pregled/`bun run dev` isključivo za snimanje UI-a. Heym učitava te slike u zajednički GitHub **prerelease** (`opencode-pr-assets`) kao resurse nazvane `<branch>-…`, a zatim ih ugrađuje u opis PR-a **prije otvaranja pull zahtjeva**, tako da se novi PR stvara već s uključenim snimkama zaslona (postojeći PR-ovi se ažuriraju na mjestu).

OpenCode je također uputio da završi s linijom `PR_TITLE: …` kako bi Heym mogao otvoriti pull zahtjev s smislenim naslovom umjesto zamjenskih oznaka poput `Završeno.`

OpenCode ponekad završi okret usred zadatka ("…Sada mi dopustite da napravim snimku zaslona"), što bi finaliziralo izvršenje prije nego što je snimka zaslona uhvaćena. Da bi se to spriječilo, prompt izvršitelja zahtijeva hvatanje snimaka zaslona **prije** konačne poruke, a ako izvršenje i dalje završi bez objavljivog sažetka ili s promjenom UI-a, ali bez snimke zaslona, Heym izvršava još jedan OpenCode prolaz u istom radnom prostoru kako bi završio. Ako promjena UI-a i dalje nema snimku zaslona nakon toga, vidljiva napomena dodaje se u tijelo PR-a kako bi razlika bila uvijek primjetna.

## Što se objavljuje na GitHubu

Vaš **Task Prompt** je privatni unos, a ne sadržaj PR-a. Objavljuju se samo dvije stvari: `## Change Summary` koja opisuje što promjena koda radi, i odjeljak `## Screenshots` kada su snimke zaslona uhvaćene. Naslov PR-a proizlazi isključivo iz sažetka promjene.

Prompt izvršitelja navodi ovu politiku, a Heym je također provodi nakon izvršenja: prije nego što se bilo što potvrdi ili otvori kao pull zahtjev, uklanja dijelove koji ponavljaju prompt (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) i svaki odlomak kopiran doslovno iz zadatka iz sažetka, tijela PR-a i poruke potvrde.

Heym čita odjeljak `## Change Summary` iz poruka agenta umjesto da uzima ono što je posljednje rečeno, jer OpenCode emitira poruku po koraku, a posljednja je često komentar usred izvršenja. Naracija koraka (`Oba prolaze. Dopustite mi da napravim konačni pregled:`) također se odbacuje kao naslov PR-a ili predmet potvrde. Ako izvršenje ne proizvede upotrebljiv sažetak promjene, pull zahtjev se vraća na popis promijenjenih datoteka umjesto objavljivanja komentara.

## Kao alat za agenta

OpenCode Go čvor može se povezati s alatom **AI Agent** čvora kako bi agent mogao delegirati zadatke kodiranja. Konfigurirajte vjerodajnicu, GitHub vjerodajnicu i repozitorij na čvoru, a zatim označite **Task Prompt** (i opcionalno **Repository URL**) s prekidačem koji pruža agent kako bi agent dostavio te informacije u trenutku poziva.

## Primjer

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

## Povezano

- [Codex Node](./codex-node.md)
- [GitHub Node](./github-node.md)
- [Agent Node](./agent-node.md)
- [Vjerodajnice](../reference/credentials.md)
- [Dijeljenje vjerodajnica](../reference/credentials-sharing.md)
- [Tipovi čvorova](../reference/node-types.md)
