# Linear-solmu

**Linear**-solmu yhdistää workflowt Linear GraphQL API:in ongelmien ja työtilojen automatisointiin.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tunnistetiedot | Linearin henkilökohtainen API-avain tai OAuth2 |
| Tuloste | `$nodeLabel.*` |

## Tunnistetiedot

Luo **Linear**-tunnistetiedot [Tunnistetieto-välilehdellä](../tabs/credentials-tab.md). Valitse jompikumpi todennustapa:

**Henkilökohtainen API-avain**

1. Linearissa avaa **Asetukset → Turvallisuus ja pääsy → Henkilökohtaiset API-avaimet**.
2. Luo avain, jolla on pääsy automoitavaan työtilaan.
3. Liitä avain uuteen Linear-tunnistetietoon Heymissä ja vahvista yhteys **Testaa yhteys** -painikkeella.

**OAuth2**

1. Luo Linear OAuth -sovellus.
2. Rekisteröi `{FRONTEND_URL}/api/credentials/linear/oauth/callback` uudelleenohjausosoitteeksi.
3. Heymissä valitse **OAuth2**, syötä Asiakastunnus ja Asiakassalaisuus, ja napsauta **Yhdistä**.

Henkilökohtaiset API-avaimet ja OAuth-tunnukset toimivat niiden luoneen tai valtuuttaneen käyttäjän oikeuksin.

## Toiminnot

| Toiminto | Pakolliset kentät | Tuloste |
|-----------|-----------------|--------|
| Hae käyttäjä | — | `viewer` |
| Listaa tiimit | Rajoitus; valinnainen After Cursor | `teams`, `count`, `pageInfo` |
| Listaa projektit | Rajoitus; valinnainen After Cursor | `projects`, `count`, `pageInfo` |
| Listaa ongelmat | Rajoitus; valinnainen Team ID, Project ID, After Cursor | `issues`, `count`, `pageInfo` |
| Listaa workflow-tilat | Team ID | `states`, `count` |
| Listaa tiimin jäsenet | Team ID, Rajoitus; valinnainen After Cursor | `members`, `count`, `pageInfo` |
| Hae ongelma | Issue ID tai tunniste kuten `ENG-123` | `issue`, `identifier`, `url` |
| Luo ongelma | Team ID, Otsikko | `issue`, `identifier`, `url` |
| Päivitä ongelma | Issue ID tai tunniste ja vähintään yksi muutettu kenttä | `issue`, `identifier`, `url` |
| Poista ongelma | Issue ID tai tunniste | `deleted` |
| Lisää ongelmalinkki | Issue ID tai tunniste, Link URL | `link` |
| Luo kommentti | Issue ID tai tunniste, Kommentin sisältö | `comment` |
| Listaa kommentit | Issue ID tai tunniste, Rajoitus; valinnainen After Cursor | `comments`, `count`, `pageInfo` |
| Päivitä kommentti | Comment ID, Kommentin sisältö | `comment` |
| Poista kommentti | Comment ID | `deleted`, `entityId` |
| Merkitse kommentti ratkaistuksi | Comment ID | `comment` |
| Peruuta kommentin ratkaisu | Comment ID | `comment` |

Kaikki tekstikentät tukevat [lausekkeita](../reference/expression-dsl.md).

## Ongelmakentät

- **Team ID** ja **Project ID** ovat Linearin UUID:ita. Käytä Listaa tiimit tai Listaa projektit niiden löytämiseen.
- **State ID** on workflow-tilan UUID, jota käytetään ongelman luonnissa tai päivityksessä. Käytä Listaa workflow-tilat sen löytämiseen.
- **Assignee ID** on Linearin käyttäjän UUID. Käytä Listaa tiimin jäsenet sen löytämiseen.
- **Priority** hyväksyy arvot `0`–`4`: ei prioriteettia, kiireellinen, korkea, normaali ja matala.
- Jätä valinnaiset päivityskentät tyhjiksi säilyttääksesi niiden nykyiset arvot.
- Aseta päivityskenttä arvoon `null` tyhjentääksesi kuvauksen, projektin, vastuuhenkilön tai tilan.
- **Link URL** lisää ulkoisen liitteen ongelmaan.
- **Comment ID** on olemassa olevan kommentin UUID. Käytä Listaa kommentit sen löytämiseen.
- **Parent Comment ID** vastaa olemassa olevaan Linear-kommenttiin uuden kommentin luonnissa.

## Sivutus

Listausoperaatiot voivat palauttaa joko yhden sivun tai hakea automaattisesti kaikki sivut:

- Jätä **Return All** pois käytettäessä `Limit` ja `After Cursor` manuaalisesti.
- Ota **Return All** käyttöön seurataksesi Linearin kursoreita palvelinpuolella, enintään 10 000 tulosta.

Sivutetut tulokset palauttavat `pageInfo.hasNextPage` ja `pageInfo.endCursor`. Kun **Return All** on pois käytöstä, välitä kursori **After Cursor** -kenttään seuraavassa solmun suorituksessa hakeaksesi seuraavan sivun.

## Esimerkkejä

Luo ongelma ylävirtasyötteestä:

- Toiminto: `Luo ongelma`
- Team ID: `team UUID`
- Otsikko: `$input.title`
- Kuvaus: `$input.description`
- Prioriteetti: `2`

Lisää kommentti luotuun ongelmaan:

- Toiminto: `Luo kommentti`
- Issue ID: `$createLinearIssue.issue.id`
- Kommentin sisältö: `$input.comment`
- Parent Comment ID: valinnainen, kun vastataan toiseen kommenttiin

Merkitse kommenttiketju ratkaistuksi:

- Toiminto: `Merkitse kommentti ratkaistuksi`
- Comment ID: `$listComments.comments[0].id`

Lisää ulkoinen linkki ongelmaan:

- Toiminto: `Lisää ongelmalinkki`
- Issue ID: `$createLinearIssue.issue.id`
- Link URL: `$input.url`

Sivuta tiimin jäseniä:

- Toiminto: `Listaa tiimin jäsenet`
- Team ID: `$listTeams.teams[0].id`
- Rajoitus: `50`
- After Cursor: `$listTeamMembers.pageInfo.endCursor` seuraavassa suorituksessa, kun `hasNextPage` on tosi

Etsi workflow-tilojen ID:t ennen ongelman päivittämistä:

- Toiminto: `Listaa workflow-tilat`
- Team ID: `$listTeams.teams[0].id`
- Käytä sitten `$listStates.states[0].id` **State ID** -kentässä **Päivitä ongelma** -toiminnossa

## Tuloste

Jokainen onnistunut toiminto asettaa:

- `$linear.success`
- `$linear.operation`

Listausoperaatiot paljastavat myös `count` ja, jos sovellettavissa, `pageInfo`. Ongelmaoperaatiot paljastavat täydellisen Linear-ongelma-payloadin ja käteväkentät kuten `identifier` ja `url`. Kommenttimuutokset paljastavat täydellisen `comment`-payloadin, paitsi Poista kommentti, joka paljastaa `deleted` ja `entityId`.

## Liittyvät

- [Tunnistetieto-välilehti](../tabs/credentials-tab.md)
- [Solmutyypit](../reference/node-types.md)
- [Lauseke-DSL](../reference/expression-dsl.md)
