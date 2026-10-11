# Codex-solmu

**Codex**-solmu suorittaa OpenAI Codex CLI -työkalun eristetyssä Heym-työtilassa GitHub-repositoriota vasten. Se on suunniteltu koodaustehtäviin, kuten testien korjaamiseen, tiedostojen muokkaamiseen, korjauspaikkien luomiseen tai luonnos-pull-requestin avaamiseen.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1, plus `question` |
| Tunnistetiedot | Codex-käyttöoikeustunnus + GitHub |
| Tuloste | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Tunnistautuminen

**OpenAI Codex** -tunnistetiedoilla on kaksi tunnistautumistapaa:

| Tila | Kuvaus |
|------|-------------|
| **Kirjaudu sisään ChatGPT-tilillä** (suositus) | OAuth (PKCE) -sisäänkirjautuminen, joka käyttää ChatGPT Plus/Pro -tilauksesi oikeuksia, joten suoritukset eivät aiheuta API-kustannuksia per token. Klikkaa tunnistetietojen valintaikkunassa **Kirjaudu sisään ChatGPT-tilillä**, valtuuta selaimessasi ja liitä sitten `localhost:1455` -uudelleenohjausosoite takaisin Heymiin. Heym tallentaa tuloksena olevan token-paketin ja päivittää sen automaattisesti vanhentuessaan. |
| **Käyttöoikeustunnus** | Liitä ChatGPT/Codex `access_token`, jota käytetään vain paikallisessa Codex-suorittimessa. |

API-avaimia ei hyväksytä Codex-tunnistetiedoille. Solmu ei lähetä Codex-tehtäviä pilveen; se kloonaa repositorion Heym-ajonaikaisuuden sisällä, kirjoittaa ChatGPT-token-paketin eristettyyn `auth.json`-tiedostoon (tai välittää `CODEX_ACCESS_TOKEN`) vain Codex-prosessille ja pitää tokenin poissa `$credentials`-muuttujasta.

Solmu vaatii myös **GitHub**-tunnistetiedot yksityisten repositorioiden kloonaamiseen, työhaaran työntämiseen ja luonnos-pull-requestien luomiseen.

Docker-käyttöönotoissa Heym suorittaa Codexin sisarkontissa samasta Heym-kuvasta (ei erillisestä GHCR-kuvasta). Tämä kontti liittää vain Codex-työtilan tilavuuden ja antaa Codexin oman bubblewrap-hiekkalaatikon luoda nimiavaruudet ja uuden `/proc`-hakemiston. Suoritin lisää `SYS_ADMIN`-oikeudet, rajoittamattoman seccomp- ja AppArmor-suojauksen sekä `systempaths=unconfined` (Docker Engine 25+). Ilman viimeistä lippua jokainen komento epäonnistuu käynnistyksen yhteydessä virheellä `bwrap: Can't mount proc on /newroot/proc: Operation not permitted`.

OpenAI-viitteet:

- [Codex-tunnistautuminen](https://developers.openai.com/codex/auth)
- [Codex-käyttöoikeustunnukset](https://developers.openai.com/codex/enterprise/access-tokens)
- [Codex-mallit](https://learn.chatgpt.com/docs/models?surface=cli)
- [Codex ei-interaktiivinen tila](https://developers.openai.com/codex/noninteractive)
- [Codex-hinnoittelu](https://developers.openai.com/codex/pricing)

## Kentät

| Kenttä | Kuvaus |
|-------|-------------|
| Codex-tunnistetiedot | OpenAI Codex -tunnistetiedot (ChatGPT-sisäänkirjautuminen tai `access_token`) |
| GitHub-tunnistetiedot | GitHub PAT -tunnistetiedot, joita käytetään repositorioon pääsyyn |
| Repositorion URL | HTTPS-GitHub-repositorion URL-osoite |
| Perushaara | Kloonattava haara ennen Codex-suoritusta, oletus `main` |
| Malli | Valinnainen Codex-malli (muokattava pudotusvalikko, esim. `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`); tyhjä käyttää Codexin oletusmallia |
| Päättelyvaativuus | Codexin päättelysyvyys: `low`, `medium`, `high`, `xhigh` (Extra High), `max` tai `ultra` (oletus `medium`) |
| Tehtävän kehote | Codexille annettava koodauskehote; tukee lausekkeita kuten `$input.text` |
| Julkaisutapa | Miten muutokset toimitetaan (katso alla oleva taulukko) |
| Haaran nimi | Työhaara PR/commit-tiloissa, oletus `codex/$executionId` |
| Aikakatkaisu | Codex-suorituksen enimmäisaika sekunneissa |

## Julkaisutavat

| Tila | Toiminto |
|------|--------------|
| `diff_only` | Muokkaa tiedostoja paikallisesti ja palauttaa korjauspaikan ja muuttuneet tiedostot. Mitään ei työnnetä. |
| `draft_pr` | Tekee commitin haaraan, työntää sen ja avaa luonnos-pull-requestin. |
| `open_pr` | Tekee commitin haaraan, työntää sen ja avaa arviointivalmiin (ei-luonnos) pull-requestin. |
| `commit_push` | Tekee commitin haaraan ja työntää sen ilman pull-requestin avaamista. |
| `direct_commit` | Tekee commitin ja työntää suoraan perushaaraan (ei erillistä haaraa tai PR:ää). |
| `open_or_update_pr` | Päivittää agentin olemassa olevaa avointa PR:ää, kun sellainen on olemassa — vaikka haaran nimi eroaisi, suoritin löytää sen tekijän ja perustan perusteella — muuten avaa uuden. Paras uudelleensuorituksiin ja "päivitä avoin PR" -ohjeisiin. |
| `update_existing_pr` | Lisää commitin olemassa olevaan haaraan/PR:ään; avaa uuden, jos sellaista ei vielä ole. |
| `patch_artifact` | Tallentaa korjauspaikan ladattavana tiedostona ja palauttaa `patchUrl`. Mitään ei työnnetä. |

## Tulosteet

| Avain | Kuvaus |
|-----|-------------|
| `status` | `completed` tai `needs_input` |
| `summary` | Codexin yhteenveto |
| `validation` | Codexin raportoimat vahvistusmerkinnät, testit tai tarkistukset |
| `diff` | Git-korjauspaikka muuttuneille tiedostoille |
| `changedFiles` | Muuttuneiden tiedostojen polut |
| `threadId` | Codex-ketju/istunnon tunniste, kun saatavilla |
| `branchName` | Työhaaran nimi |
| `pullRequestUrl` | PR-osoite `draft_pr`, `open_pr`, `open_or_update_pr` ja `update_existing_pr` -tiloissa |
| `pushedBranch` | Työnnetyn haaran nimi commit/PR-tiloissa |
| `patchUrl` | Korjauspaikan latauslinkki `patch_artifact` -tilassa |
| `usage` | Codex CLI:n raportoima käyttömetatieto, kun saatavilla |
## Käyttöliittymän kuvankaappaukset pull requesteissa

Käyttöliittymä- tai frontend-tehtävissä Codex tallentaa PNG-kuvankaappaukset gitignoroituun polkuun kuten `frontend/.e2e-artifacts/` (ei lähdekoodiin). Jos frontend-riippuvuuksia puuttuu, Codex voi suorittaa `bun install` (tai npm/pnpm install) ja käynnistää lyhytaikaisen esikatselun/`bun run dev` -palvelimen ainoastaan kuvankaappausta varten. Heym lähettää nämä kuvat jaetulle GitHubin **esiversiolle** (`codex-pr-assets`) nimellä `<branch>-…`, upottaen ne PR-kuvaukseen **ennen kuin pull request avataan**, joten uusi PR luodaan jo sisältäen kuvankaappaukset (olemassa olevia PR:itä päivitetään paikallaan). Codex asettaa myös merkityksellisen `pull_request_title` -kentän (ei koskaan paikkamerkintöjä kuten `Done.`).

Codex voi joskus keskeyttää vuoron kesken tehtävää ("…Nyt otan kuvankaappauksen"), mikä lopettaisi suorituksen ennen kuin kuvankaappaus tallennetaan. Estääkseen tämän, suorittajan ohje edellyttää kuvankaappausten tallentamista **ennen** lopullista tulosta. Jos suoritus silti päättyy ilman julkaistavaa yhteenvetoa tai käyttöliittymämuutoksesta ilman kuvankaappausta, Heym suorittaa yhden lisäkäynnistyksen samassa työtilassa viimeistelyä varten. Jos käyttöliittymämuutoksesta silti puuttuu kuvankaappaus, PR:n runkoon lisätään näkyvä huomautus, jotta puute ei jää huomaamatta.

## Mitä julkaistaan GitHubiin

**Tehtävänanto** (Task Prompt) on yksityistä syötettä, ei PR-sisältöä. Vain kaksi asiaa julkaistaan: `## Muutoksen yhteenveto`, joka kuvaa koodimuutoksen vaikutuksia, ja `## Kuvankaappaukset` -osio, kun kuvankaappaukset on tallennettu. PR-otsikko johdetaan yksinomaan muutoksen yhteenvedosta.

Suorittajan ohje ilmoittaa tämän käytännön, ja Heym myös valvoo sitä suorituksen jälkeen: ennen kuin mitään tehdään tai avataan pull requestina, se poistaa tehtävänantoon liittyvät osiot (`## Tehtävä`, `## Tehtävänanto`, `## Ohjeet`, `## Alkuperäinen pyyntö`, …) ja kaikki tehtävänannosta sanatarkasti kopioidut kappaleet yhteenvedosta, PR:n rungosta ja commit-viestistä. Vaiheittaiset selostukset kuten `Molemmat läpäisevät. Tehdään lopullinen tarkistus:` hylätään myös PR-otsikkona tai commit-aiheena.

## Lisäkysymykset

Jos Codex tarvitsee puuttuvia vaatimuksia tai tuotepäätöstä, se palauttaa `needs_input`. Heym keskeyttää suorituksen ja näyttää `question` -käsittelyn. Yhdistä tämä käsittely esimerkiksi Slack- tai sähköposti-ilmoitushaaraan lähettääksesi arvioijalle julkisen seurantalinkin.

Kun arvioija vastaa, Heym jatkaa samasta suoritusnäkymästä ja Codex-säikeestä tallennetun työtilan metatiedoista.

## Työkaluna tekoälyagentille

Codex-solmu voidaan liittää **AI Agent** -solmun työkalukäsittelyyn, jotta agentti voi delegoida koodaustyöt. Määritä solmuun tunnistetiedot, GitHub-tunnistetiedot ja repository, ja merkitse **Tehtävänanto** (ja mahdollisesti **Repositoryn URL**) agentin toimittamaksi valitsimella, jotta agentti toimittaa ne kutsun yhteydessä. Kun Codex suoritetaan työkaluna, `needs_input` -tulos palautetaan suoraan agentille keskeyttämättä workflowta, jolloin agentti voi tarkentaa pyyntöä ja kutsua Codexia uudelleen.

## Esimerkki

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

## Aiheeseen liittyvät

- [GitHub-solmu](./github-node.md)
- [Agenttisolmu](./agent-node.md)
- [Tunnistetiedot](../reference/credentials.md)
- [Tunnistetietojen jakaminen](../reference/credentials-sharing.md)
- [Solmutyypit](../reference/node-types.md)
