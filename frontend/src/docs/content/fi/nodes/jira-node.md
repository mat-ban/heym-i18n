# Jira-solmu

**Jira**-solmu yhdistää workflowt Jira REST API:hin projektien, tehtävien, kommenttien, liitteiden, käyttäjien, ilmoitusten ja tilansiirtojen automatisointia varten. Oletustoiminto on **Hae tehtäviä**.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tunnistetiedot | Jira (Pilvipalvelun sähköposti/API-token, Data Center -käyttäjätunnus/salasana tai henkilökohtainen käyttöoikeustoken, perus-URL, käyttöönotto-tila, valinnainen REST API -versio) |
| Tulos | `$nodeLabel.*` |

## Tunnistetiedot

Luo **Jira**-tunnistetiedot [Tunnistetiedot-välilehdessä](../tabs/credentials-tab.md). Tallennetut määritysavaimet ovat `email`, `api_token`, `base_url`, `deployment`, `auth_mode` ja valinnainen `api_version`. Jira Pilvipalvelussa `email` tallentaa Atlassian-tilin sähköpostiosoitteen ja `api_token` tallentaa Atlassian API-tokenin. Jira Data Center / Server -versiossa nämä samat avaimet tallentavat Basic-auth -käyttäjätunnuksen ja salasanan, tai tilassa `auth_mode: pat` `api_token` tallentaa henkilökohtaisen käyttöoikeustokenin, joka lähetetään Bearer-tokenina, eikä kenttää `email` käytetä. Katso [Kolmannen osapuolen integraatiot](../reference/integrations.md#jira) asennusohjeisiin.

| Kenttä | Määritysavain | Kuvaus |
| --- | --- | --- |
| Jira-sähköposti / Käyttäjätunnus | `email` | Jira Pilvipalvelun Atlassian-tilin sähköposti tai Jira Data Center / Server -käyttäjätunnus |
| Todennus | `auth_mode` | `basic` (oletus) tai `pat` (vain Data Center / Server) |
| API-token / Salasana / Henkilökohtainen käyttöoikeustoken | `api_token` | Jira Pilvipalvelun Atlassian API-token, Jira Data Center / Server -salasana Basic-authia varten tai Data Centerin henkilökohtainen käyttöoikeustoken `pat`-tilassa |
| Perus-URL | `base_url` | Jira-sivuston URL, esimerkiksi `https://yrityksesi.atlassian.net` |
| Käyttöönotto | `deployment` | `cloud` Jira Pilvipalvelulle tai `data_center` Jira Data Center / Server -versiolle |
| REST API -versio | `api_version` | Oletusarvo `3` Jira Pilvipalvelulle. Data Center / Server käyttää REST API v2:ta |

Henkilökohtaiset käyttöoikeustokenit edellyttävät Jira Data Center / Server 8.14 -versiota tai uudempaa. Todennustavan vaihtaminen tyhjentää tallennetun salaisuuden, joten syötä uusi salasana tai token vaihdon yhteydessä.

Käytä **Testaa yhteys** -toimintoa varmistaaksesi tunnistetiedot nykyistä Jira-käyttäjää vastaan.

## Toiminnot

| Toiminto | Pakolliset kentät | Tulos |
| --- | --- | --- |
| Hae itseni | — | `user` |
| Listaa projektit | Valinnainen raja, aloituskohta | `projects`, `count`, `pagination` |
| Hae tehtäviä | Valinnainen JQL, tehtäväkentät, raja, seuraavan sivun token, aloituskohta | `issues`, `count`, `pagination` |
| Hae tehtävä | Tehtävän avain tai ID | `issue`, `key` |
| Luo tehtävä | Projektin avain, yhteenveto | `issue`, `key` |
| Päivitä tehtävä | Tehtävän avain tai ID ja vähintään yksi muutettu kenttä | `issue`, `key` |
| Poista tehtävä | Tehtävän avain tai ID | `deleted` |
| Hae tehtävän muutoshistoria | Tehtävän avain tai ID; valinnainen raja, aloituskohta | `changelog`, `count`, `pagination` |
| Ilmoita tehtävästä | Tehtävän avain tai ID, aihe, tekstisisältö | `notified` |
| Listaa kommentit | Tehtävän avain tai ID; valinnainen raja, aloituskohta | `comments`, `count`, `pagination` |
| Luo kommentti | Tehtävän avain tai ID, kommentin sisältö | `comment` |
| Hae kommentti | Tehtävän avain tai ID, kommentin ID | `comment` |
| Päivitä kommentti | Tehtävän avain tai ID, kommentin ID, kommentin sisältö | `comment` |
| Poista kommentti | Tehtävän avain tai ID, kommentin ID | `deleted` |
| Lisää liite | Tehtävän avain tai ID, tiedostonimi, Base64-sisältö | `attachments`, `count` |
| Hae liite | Liitteen ID; valinnainen sisällytä binääri | `attachment` |
| Listaa liitteet | Tehtävän avain tai ID; valinnainen raja, aloituskohta, sisällytä binääri | `attachments`, `count`, `pagination` |
| Poista liite | Liitteen ID | `deleted` |
| Listaa tilansiirrot | Tehtävän avain tai ID | `transitions`, `count` |
| Siirrä tehtävää | Tehtävän avain tai ID, tilansiirron ID | `transition`, `issue`, `key` |
| Hae käyttäjä | Tilin ID / Käyttäjätunnus | `user` |
| Luo käyttäjä | Käyttäjän sähköposti | `user` |
| Poista käyttäjä | Tilin ID / Käyttäjätunnus | `deleted` |

Lausekkeilla muokattavat tekstikentät tukevat [lausekkeita](../reference/expression-dsl.md) kuten `$input.text`. `jiraIncludeBinary` on boolean-kytkin eikä tue lausekkeita, mutta se voidaan merkitä agentin toimittamaksi, kun Jira-solmu on liitetty Agent-työkalun kahvaan.

## Tehtävän ja päivityksen kentät

- **Projektin avain** on lyhyt projektiavain kuten `ENG`. Käytä Listaa projektit -toimintoa avainten löytämiseen.
- **Tehtävän avain tai ID** hyväksyy avaimia kuten `ENG-123` tai numeerisia tehtävä-ID:itä. Käytä Hae tehtäviä tai Listaa projektit -toimintoja arvojen löytämiseen.
- **Tilansiirron ID** tulee Listaa tilansiirrot -toiminnosta. Jokainen tilansiirto-objekti sisältää `id`-kentän.
- **Kommentin ID** ja **Liitteen ID** tulevat Listaa kommentit, Listaa liitteet tai aiemmista luonti/haku-vastauksista.
- **Tilin ID / Käyttäjätunnus** on Jira Pilvipalvelun `accountId`-arvo tai Jira Data Center / Server -käyttäjätunnus. Hae itseni tai Hae käyttäjä -toiminnot voivat auttaa sen löytämisessä.
- Tehtävän **kuvaus** ja kommentin **sisältö** -tekstit lähetetään Atlassian Document Format -muodossa REST API v3:ssa; kun tunnistetietojen käyttöönotto on Data Center / Server, ne lähetetään pelkkänä tekstinä. V3:ssa rivinvaihdoista tulee erillisiä kappaleita.
- **Hae tehtävän muutoshistoria** käyttää Jira Pilvipalvelun sivutusominaista muutoshistoria-endpointtia. Data Center / Server -versiossa se lukee laajennettua tehtävän muutoshistoria-dataa ja soveltaa määritettyä offset/raja-arvoa palautettuihin historiaan.
- **Päivitä tehtävä** -toiminnossa jätä valinnaiset kentät tyhjiksi säilyttääksesi niiden nykyiset arvot.
- Aseta **Kuvaus** tai **Vastuuhenkilön tilin ID / Käyttäjätunnus** arvoon `null` päivityksessä tyhjentääksesi nämä kentät. Tunnisteita ei voi tyhjentää `null`-arvolla.
- **Vastaanottajien JSON** Ilmoita tehtävästä -toiminnossa on oletusarvoisesti `{"assignee":true}`, kun se jätetään pois. Yleisiä avaimia ovat `assignee`, `reporter`, `watchers` ja `voters` (esimerkiksi `{"assignee":true,"watchers":true}`).
- **Lisää liite** hyväksyy raakaa base64- tai data-URL-sisältöä ja on rajoitettu alustan tiedostokokorajoituksella (oletus 99 Mt).
## Sivutus

- **Search Issues** käyttää kursorisivutusta `jiraNextPageToken` -kentän avulla Jira Cloudissa. Lue `pagination.nextPageToken` edellisestä suorituksesta ja välitä se seuraavalle Search Issues -solmulle.
- **Search Issues** käyttää offset-sivutusta `jiraStartAt` -kentän avulla Jira Data Center / Server -ympäristöissä. Lue `pagination.startAt`, `pagination.maxResults` ja `pagination.total` seuraavan sivun laskemiseksi.
- **List Projects**, **Get Issue Changelog**, **List Comments** ja **List Attachments** käyttävät offset-sivutusta `jiraLimit` ja `jiraStartAt` -kenttien avulla. Sivutetut tulokset palauttavat `pagination.startAt`, `pagination.maxResults`, `pagination.total` ja `pagination.isLast`.
- **List Attachments** hakee ensin kaikki liitteet kyseisestä issuesta ja suodattaa tulokset asiakaspuolella. Sivutusparametrit kuvaavat silti palautettua sivua, mutta suuret issuet voivat aiheuttaa ylimääräisiä hakukustannuksia.
- **List Transitions** ei käytä sivutusta.

## Avainkentät

| Kenttä | Käyttäjä | Huomiot |
| --- | --- | --- |
| `credentialId` | Kaikki toiminnot | Käytössä olevan Jira-tunnistetiedon UUID |
| `jiraOperation` | Kaikki toiminnot | Oletusarvo `searchIssues` |
| `jiraProjectKey` | Create Issue | Projektin tunniste, esim. `ENG` |
| `jiraIssueKey` | Issue, comment, attachment, notification ja transition -toiminnot | Issuen tunniste, esim. `ENG-123` tai numeerinen issue-ID |
| `jiraIssueType` | Create Issue | Oletusarvo `Task` |
| `jiraIssueTypeId` | Create Issue | Valinnainen issuetyypin ID; ohittaa `jiraIssueType` -kentän kun asetettu |
| `jiraSummary` | Create/Update Issue | Pakollinen Create Issue -toiminnossa |
| `jiraDescription` | Create/Update Issue | Lähetetään ADF-muodossa REST API v3:ssa tai pelkkänä tekstinä REST API v2:ssa; käytä `null` päivityksessä tyhjentääksesi kuvauksen |
| `jiraJql` | Search Issues | Oletusarvo `updated >= -30d ORDER BY updated DESC` |
| `jiraFields` | Search Issues | Valinnainen JSON-taulukko tai pilkuin erotettu lista issuen kentistä; oletusarvo `key`, `summary`, `status`, `assignee` ja `issuetype` kun tyhjä |
| `jiraAssigneeAccountId` | Create/Update Issue | Jira Cloudin accountId tai Data Center / Server -käyttäjätunnus; käytä `null` päivityksessä tyhjentääksesi assigneen |
| `jiraLabels` | Create/Update Issue | JSON-taulukko tai pilkuin erotettu teksti |
| `jiraCommentBody` | Create/Update Comment | Lähetetään ADF-muodossa REST API v3:ssa tai pelkkänä tekstinä REST API v2:ssa |
| `jiraCommentId` | Get/Update/Delete Comment | Jira-kommentin ID |
| `jiraTransitionId` | Transition Issue | Löydettävissä List Transitions -toiminnolla |
| `jiraAttachmentId` | Get/Delete Attachment | Jira-liitteen ID |
| `jiraAttachmentFilename` | Add Attachment | Ladattavan tiedoston nimi |
| `jiraAttachmentBase64` | Add Attachment | Raaka base64 tai data URL -sisältö; tiedostokoolle on rajoituksia |
| `jiraAttachmentMimeType` | Add Attachment | Valinnainen MIME-tyyppi; päätellään tiedostonimestä kun tyhjä |
| `jiraIncludeBinary` | Get/List Attachment | Boolean-valitsin; lisää `content_base64` -kentän kun käytössä |
| `jiraNotifySubject` | Notify Issue | Pakollinen ilmoituksen otsikko |
| `jiraNotifyTextBody` | Notify Issue | Pakollinen pelkkätekstimuotoinen ilmoituksen sisältö |
| `jiraNotifyHtmlBody` | Notify Issue | Valinnainen HTML-sisältö |
| `jiraNotifyTo` | Notify Issue | Vastaanottajien JSON; oletusarvo `{"assignee":true}` |
| `jiraAccountId` | Get/Delete User | Jira Cloudin accountId tai Data Center / Server -käyttäjätunnus |
| `jiraUserEmail` | Create User | Uuden käyttäjän sähköpostiosoite |
| `jiraUsername` | Create User | Valinnainen Data Center / Server -käyttäjätunnus; käyttää `jiraUserEmail` -kenttää jos tyhjä |
| `jiraUserDisplayName` | Create User | Valinnainen näyttönimi |
| `jiraUserProducts` | Create User | JSON-taulukko tai pilkuin erotettu lista tuotetunnisteista; vain Jira Cloud |
| `jiraLimit` | Search Issues, List Projects, Get Issue Changelog, List Comments, List Attachments | Oletusarvo `50`; alue 1–100 |
| `jiraStartAt` | Search Issues Data Center / Serverissä, List Projects, Get Issue Changelog, List Comments, List Attachments | Offset-sivutuksen aloitusindeksi |
| `jiraNextPageToken` | Search Issues Jira Cloudissa | Kursori edellisen hakuvastauksen sivutuksesta |

## Esimerkkejä

Luo issue ylävirtasyötteestä:

- Operation: `createIssue`
- Project Key: `ENG`
- Issue Type: `Task`
- Summary: `$input.title`
- Description: `$input.description`
- Labels: `["automation"]`

Päivitä issue ja tyhjennä assignee:

- Operation: `updateIssue`
- Issue Key or ID: `ENG-123`
- Summary: `$input.title`
- Assignee Account ID / Username: `null`

Hae issuita mukautetuilla kentillä ja kursorisivutuksella:

- Operation: `searchIssues`
- JQL: `project = ENG AND updated >= -30d ORDER BY updated DESC`
- Issue Fields: `["key","summary","status"]`
- Limit: `25`
- Next Page Token: `$searchJira.pagination.nextPageToken`

Hae issuita Data Centerissä offset-sivutuksella:

- Operation: `searchIssues`
- JQL: `project = ENG ORDER BY updated DESC`
- Limit: `25`
- Start At: `25`

Siirrä issue listattuaan saatavilla olevat siirtymät:

- Operation: `listTransitions`
- Issue Key or ID: `ENG-123`
- Suorita sitten **Transition Issue** Transition ID:llä: `$listTransitions.transitions[0].id`

Ilmoita tarkkailijoille issuen päivityksestä:

- Operation: `notifyIssue`
- Issue Key or ID: `ENG-123`
- Subject: `Issue updated`
- Text Body: `$input.text`
- Recipients JSON: `{"assignee":true,"watchers":true}`
## Tuloste

Jokainen onnistunut operaatio asettaa:

- `$jira.success`
- `$jira.operation`

**Get Myself** paljastaa `user`.

**Sivutetut listausoperaatiot** paljastavat `count`, kokoelmakentän ja `pagination`:

| Operaatio | Kokoelman avain | Sivutusmuoto |
| --- | --- | --- |
| List Projects | `projects` | `{ startAt, maxResults, total, isLast }` |
| Search Issues | `issues` | Cloud: `{ maxResults, nextPageToken, isLast }`; Data Center: `{ startAt, maxResults, total, isLast }` |
| Get Issue Changelog | `changelog` | `{ startAt, maxResults, total, isLast }` |
| List Comments | `comments` | `{ startAt, maxResults, total, isLast }` |
| List Attachments | `attachments` | `{ startAt, maxResults, total, isLast }` |

**List Transitions** paljastaa `transitions` ja `count` ilman sivutusta.

**Issue-muutokset ja -lukuoperaatiot** paljastavat Jira-issue-payloadin sekä `key`-kentän, jos sovellettavissa.

**Comment**-haku/luonti/päivitys paljastavat `comment`; poisto paljastaa `deleted`.

**Transition Issue** paljastaa `transition` muodossa `{ transitionId }`, päivitetyn `issue`- ja `key`-kentät.

**Attachment add** paljastaa `attachments` ja `count`. **Get Attachment** paljastaa `attachment`; **List Attachments** paljastaa `attachments`, `count` ja `pagination`. Kun **Include Binary** on käytössä, jokainen liiteobjekti voi sisältää `content_base64`-kentän. Poisto paljastaa `deleted`.

**User**-haku/luonti paljastavat `user`; poisto paljastaa `deleted`.

**Notify Issue** paljastaa `notified`.

Yleiset käyttökuviot:

- `$searchJira.issues[0].key`
- `$searchJira.pagination.nextPageToken`
- `$createJiraIssue.key`
- `$listTransitions.transitions[0].id`
- `$getAttachment.attachment.content_base64`

## Aiheeseen liittyvät

- [Tunnistetiedot -välilehti](../tabs/credentials-tab.md)
- [Kolmannen osapuolen integraatiot](../reference/integrations.md#jira)
- [Solmutyypit](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
