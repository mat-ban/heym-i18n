# OpenCode Go -solmu

**OpenCode Go** -solmu suorittaa [OpenCode](https://opencode.ai) CLI (Go) -ohjelmaa eristetyssä, turvallistetussa Heym-säiliössä GitHub-repositoriota vasten. Kuten Codex-solmu, se on suunniteltu koodaustöihin kuten testien korjaus, tiedostojen muokkaus, patchin luominen tai pull requestin avaaminen — mutta se käyttää palveluntarjoajariippumatonta **OpenCode Go** -malliyhdyskäytävää OpenAI Codexin sijaan.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tunnistetiedot | OpenCode Go API-avain + GitHub |
| Tuloste | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Tunnistautuminen

**OpenCode Go** -tunnistetiedot tallentavat OpenCode Go -yhdyskäytävän **API-avaimen** (osoitteesta [opencode.ai/go](https://opencode.ai/go)) ja valinnaisen **Yhdyskäytävän perusosoitteen** (oletusarvo `https://opencode.ai/zen/go/v1`; korvaa vain itse isännöidylle tai välityspalvelimelle).

Solmu vaatii myös **GitHub** -tunnistetiedot yksityisten repositorioiden kloonaamiseen, työhaaran työntämiseen ja pull requestien luomiseen. GitHub-tokenia **ei koskaan sijoiteta säiliöön** — Heym suorittaa kaikki git- ja GitHub-toiminnot isännällä, joten generoitu koodi ei voi vuotaa push-tunnistetietoja.

## Eristys ja turvallisuus

Suorituksen eristys valitaan `HEYM_OPENCODE_CLI_COMMAND` -muuttujan avulla, kuten Codex-solussa:

- **Paikallinen kehitys (`run.sh`)** jättää sen oletusarvoon `opencode`, jolloin OpenCode suoritetaan isäntäprosessina kloonatussa työtilassa — Dockeria ei tarvita, eikä lisälippuja.
- **Docker-käyttöönotot (`deploy.sh` ja yksittäinen GHCR-kuva)** asettavat sen arvoon `/usr/local/bin/heym-opencode-docker`, joka on wrapperi OpenCode-säiliön sisällä suoritettavalle `opencode run` -komennolle **kovettetussa, kertakäyttöisessä sisarsäiliössä**, joka jakaa OpenCode-työtilan nimetyn volyymin.

Kovennettu suoritussäiliö pudottaa kaikki Linux-käyttöoikeudet, asettaa `no-new-privileges` -lipun, käyttää vain luku -juurihakemistoa tmpfs-tyyppisellä `/tmp` -hakemistolla ja asettaa pid/muisti/CPU-rajoitukset. Verkosta poistuminen on sallittua (OpenCode-säiliön on päästävä malliyhdyskäytävään). **GitHub-tokenia ei koskaan sijoiteta säiliöön** — kaikki git- ja GitHub-toiminnot suoritetaan isännällä, joten vain OpenCode API-avain ja repositorion tiedostot ovat koskaan säiliön sisällä.

OpenCode muokkaa vain tiedostoja levyllä; Heym hallitsee kaikki git/GitHub-toiminnot.

## Mallit

OpenCode Go:n malliluettelo muuttuu usein, joten **Malli** -kenttä täytetään live-tilassa yhdyskäytävän malliluettelosta (`GET https://opencode.ai/zen/go/v1/models`) ja näytetään haettavana pudotusvalikkona. Jos live-luetteloa ei ole saatavilla, käytetään sisäänrakennettua varaluetteloa. Mallitunnukset käyttävät muotoa `opencode-go/<malli>` (esimerkiksi `opencode-go/kimi-k3`, `opencode-go/deepseek-v4-pro`, `opencode-go/qwen3.7-max`) — `opencode-go` on OpenCode CLI:n palveluntarjoajatunnus Go-yhdyskäytävälle. Jätä kenttä tyhjäksi käyttääksesi suorittajan oletusarvoa (`opencode-go/kimi-k3`). Vanhemmassa `opencode/<malli>` -muodossa tallennetut mallitunnukset kirjoitetaan automaattisesti uudelleen suoritusaikana.

## Kentät

| Kenttä | Kuvaus |
|-------|-------------|
| OpenCode Go -tunnistetiedot | OpenCode Go -tunnistetiedot (yhdyskäytävän API-avain) |
| GitHub-tunnistetiedot | GitHub PAT -tunnistetiedot repositorion käyttöä varten |
| Repositorion URL | HTTPS-GitHub-repositorion URL; tukee lausekkeita |
| Perushaara | Kloonattava haara ennen OpenCode-suoritusta, oletus `main` |
| Malli | OpenCode Go -malli (live-haettava pudotusvalikko, `opencode-go/<malli>`); tyhjä käyttää suorittajan oletusarvoa |
| Päättelyvariantti | Valinnainen; kuvautuu `opencode run --variant` -lipuksi malleille, jotka tukevat päättelyponnistusta |
| Tehtävän kehote | OpenCodelle annettava koodaustehävä; tukee lausekkeita kuten `$input.text` |
| Julkaisutapa | Miten muutokset toimitetaan (katso alla oleva taulukko) |
| Haaran nimi | Työhaara PR/commit-tiloissa, oletus `opencode/$executionId` |
| Aikakatkaisu | OpenCode-suorituksen enimmäisaika sekunteina |

## Julkaisutavat

| Tapa | Toiminto |
|------|--------------|
| `diff_only` | Muokkaa tiedostoja paikallisesti ja palauttaa patchin ja muuttuneet tiedostot. Mitään ei työnnetä. |
| `draft_pr` | Tekee commitin haaraan, työntää sen ja avaa luonnos-pull requestin. |
| `open_pr` | Tekee commitin haaraan, työntää sen ja avaa arviointivalmiin (ei-luonnos) pull requestin. |
| `commit_push` | Tekee commitin haaraan ja työntää sen, avaamatta pull requestia. |
| `direct_commit` | Tekee commitin ja työntää sen suoraan perushaaraan (ei erillistä haaraa tai PR:ää). |
| `open_or_update_pr` | Päivittää agentin olemassa olevaa avointa PR:ää, kun sellainen on olemassa — vaikka haaran nimi eroaisi, suoritin löytää sen tekijän ja perustan perusteella — muuten avaa uuden. Paras uudelleensuorituksiin ja "päivitä avoin PR" -ohjeisiin. |
| `update_existing_pr` | Lisää commitin olemassa olevalle haaralle/PR:lle; avaa sellaisen, jos sitä ei vielä ole. |
| `patch_artifact` | Tallentaa diffin ladattavana tiedostona ja palauttaa `patchUrl`. Mitään ei työnnetä. |

## Tulosteet

| Avain | Kuvaus |
|-----|-------------|
| `status` | Aina `completed` (OpenCode Go -solmu ei keskeytä syötteen odottamiseen) |
| `summary` | OpenCoden viimeinen viesti |
| `validation` | Validointimerkinnät, kun niitä raportoidaan |
| `diff` | Git-patch, kun tiedostoja on muutettu |
| `changedFiles` | Muuttuneet tiedostopolut |
| `branchName` | Työhaaran nimi |
| `pullRequestUrl` | PR-osoite `draft_pr`, `open_pr`, `open_or_update_pr` ja `update_existing_pr` -tiloissa |
| `pushedBranch` | Työnnetty haara commit/PR-tiloissa |
| `patchUrl` | Latauslinkki diffille `patch_artifact` -tilassa |
## Käyttöliittymän kuvankaappaukset pull requesteissa

Käyttöliittymä- tai frontend-tehtävissä OpenCode tallentaa PNG-kuvankaappaukset gitignoroituun polkuun kuten `frontend/.e2e-artifacts/` (ei lähdekoodiin). Jos frontend-riippuvuuksia puuttuu, suorittajan kehote sallii kohdennetun paketin asennuksen (esimerkiksi `bun install`) sekä lyhytaikaisen esikatselun/`bun run dev` -ajon vain kuvankaappausten tallentamiseksi. Heym lähettää nämä kuvat jaetulle GitHubin **esiversiolle** (`opencode-pr-assets`) nimillä `<branch>-…`, ja upottaa ne PR-kuvaukseen **ennen kuin pull request avataan**, joten uusi PR luodaan jo sisältäen kuvankaappaukset (olemassa olevia PR:itä päivitetään paikallaan).

OpenCode ohjeistetaan myös päättymään `PR_TITLE: …` -rivillä, jotta Heym voi avata pull requestin merkityksellisellä otsikolla sijaanpaikkojen (kuten `Done.`) sijaan.

OpenCode voi joskus päättää vuoron kesken tehtävän ("…Nyt otan kuvankaappauksen"), mikä lopettaisi suorituksen ennen kuin kuvankaappaus tallennetaan. Estääkseen tämän, suorittajan kehote edellyttää kuvankaappausten tallentamista **ennen** viimeistä viestiä, ja jos suoritus silti päättyy ilman julkaistavaa yhteenvetoa tai käyttöliittymämuutoksella ilman kuvankaappausta, Heym suorittaa yhden lisä OpenCode-ajon samassa työtilassa viimeistelyä varten. Jos käyttöliittymämuutoksella ei silti ole kuvankaappausta, PR:n runkoon lisätään näkyvä huomautus, jotta puute ei jää huomaamatta.

## Mitä julkaistaan GitHubiin

**Tehtäväkehote** on yksityistä syötettä, ei PR-sisältöä. Vain kaksi asiaa julkaistaan: `## Muutoksen yhteenveto`, joka kuvaa koodimuutoksen vaikutuksia, ja `## Kuvankaappaukset` -osio, kun kuvankaappaukset on tallennettu. PR-otsikko johdetaan pelkästään muutoksen yhteenvedosta.

Suorittajan kehote ilmoittaa tämän käytännön, ja Heym myös valvoo sitä suorituksen jälkeen: ennen kuin mitään sitoutetaan tai avataan pull requestina, se poistaa kehotteen kaikuosuudet (`## Tehtävä`, `## Kehote`, `## Ohjeet`, `## Alkuperäinen pyyntö`, …) ja kaikki tehtäväkehotteen sanatarkasti kopioidut kappaleet yhteenvedosta, PR-rungosta ja commit-viestistä.

Heym lukee `## Muutoksen yhteenveto` -osion agentin viesteistä sen sijaan, että se ottaisi viimeisimmän viestin, koska OpenCode lähettää viestin jokaisesta vaiheesta ja viimeinen on usein kesken suorituksen annettua kommenttia. Vaiheen kertomukset (`Molemmat läpäisevät. Teen lopullisen tarkistuksen:`) hylätään myös PR-otsikkoina tai commit-aiheina. Jos suoritus ei tuota käyttökelpoista muutosten yhteenvetoa, pull request luettelee muuttuneet tiedostot julkaisematta kommentteja.

## Agenttityökaluna

OpenCode Go -solmu voidaan liittää **AI Agent** -solmun työkalukahvaan, jotta agentti voi delegoida koodaus-tehtäviä. Määritä tunnistetiedot, GitHub-tunnistetiedot ja repository solmussa, ja merkitse **Tehtäväkehote** (ja valinnaisesti **Repository URL**) agentin tarjoamalla vaihtimella, jotta agentti toimittaa ne kutsun aikana.

## Esimerkki

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

## Aiheeseen liittyvät

- [Codex-solmu](./codex-node.md)
- [GitHub-solmu](./github-node.md)
- [Agent-solmu](./agent-node.md)
- [Tunnistetiedot](../reference/credentials.md)
- [Tunnistetietojen jakaminen](../reference/credentials-sharing.md)
- [Solmutyypit](../reference/node-types.md)
