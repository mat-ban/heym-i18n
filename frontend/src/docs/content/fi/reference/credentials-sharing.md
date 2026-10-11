# Tunnistetietojen jakaminen

Tunnistetietoja voidaan jakaa muiden käyttäjien kanssa, jotta heidän workflownsa voivat käyttää sinun API-avaimiasi. Katso [Tunnistetiedot](./credentials.md) yleiskatsaukseen ja [Tunnistetieto-välilehti](../tabs/credentials-tab.md) tunnistetietojen lisäämiseen ja hallintaan.

## Tunnistetietojen jakaminen LLM:lle

Salliaksesi LLM:n tai tekoälyagentin käyttää API-avainta, tallenna avain tunnistetietona ja anna pyynnön tekevän solmun liittää se. Malli päättää, mitä kutsua; solmu suorittaa kutsun todennuksen suoritusvaiheessa.

- **Tallenna salaisuus tunnistetietona.** Arkaluontoiset arvot salataan levylle ja ne peitetään käyttöliittymässä luonnin jälkeen.
- **Viittaa siihen pyynnön tekokohdassa.** [LLM](../nodes/llm-node.md)- ja [Agent](../nodes/agent-node.md)-solmut valitsevat mallin tunnistetiedon ID:n perusteella, ja HTTP-pyynnöt asettavat `$credentials.CredentialName` autentikointiotsikkoon. Pidä salaisuudet erossa prompt-kentistä, koska kaikki promptissa oleva lähetetään mallin tarjoajalle tekstimuodossa.
- **Anna agentille työkalut, ei avaimia.** Kun Agent kutsuu HTTP-solmua, MCP-palvelinta tai alityönkulkua työkaluna, tunnistetieto sovelletaan kyseisen työkalun sisällä ja malli vastaanottaa työkalun tuloksen.
- **Tulokset peitetään.** Kun tunnistetiedon arvo, joka on yli seitsemän merkkiä pitkä, ilmestyy solmun tulokseen, vain sen seitsemän ensimmäistä merkkiä säilytetään, joten avainta kaikuvassa vastauksessa näkyy vain tämä etuliite tuloksissa ja jäljityksissä. Katso [Tulosten peittäminen](#output-masking).
- **Anna avustajan luoda tunnistetietoja.** Kun [AI-avustaja](./ai-assistant.md#credentials) tai Chat-välilehti luo tunnistetiedon, se näkee vain nimen ja tyypin, ja syötät salaisuuden säännöllisessä tunnistetietolomakkeessa.
- **Jaa ihmisten kanssa samalla tavalla.** Jaa tunnistetieto käyttäjän tai tiimin kanssa alla kuvatulla tavalla, ja heidän workflownsa voivat käyttää avaintasi omien LLM- ja Agent-solmujensa kautta.

## Jakamisen malli

- **CredentialShare** – Yhdistää `credential_id`:n `user_id`:hin (yksilöllinen kullekin parille)
- **Jaa sähköpostitse** – `POST /api/credentials/{credential_id}/shares` sähköpostiosoitteella; käyttäjä haetaan ja lisätään
- **Peruuta** – `DELETE /api/credentials/{credential_id}/shares/{user_id}`

Tunnistetietoja voidaan jakaa myös [Tiimien](./teams.md) kanssa:

- **CredentialTeamShare** – Yhdistää `credential_id`:n `team_id`:hin; kaikki tiimin jäsenet saavat käyttöoikeuden
- **Jaa tiimin kanssa** – `POST /api/credentials/{credential_id}/team-shares` `team_id`:llä
- **Peruuta tiimijako** – `DELETE /api/credentials/{credential_id}/team-shares/{team_id}`

Jaetut tunnistetiedot näkyvät [Tunnistetieto-välilehdessä](../tabs/credentials-tab.md) ilmaisinmerkillä.

## Laajakirjoiset tunnistetiedot

Tunnistetiedon jakaminen myöntää vastaanottajalle kaiken, mihin kyseinen tunnistetieto oikeuttaa. Useimmissa integraatioissa tämä rajoittuu yhteen työtilaan tai yhden API-avaimen oikeuksiin, mutta jotkin tunnistetiedot ovat huomattavasti laajempia.

> **Google Drive -tunnistetiedot myöntävät täydet Drive-oikeudet.** [Google Drive](../nodes/google-drive-node.md) -tunnistetieto on valtuutettu `https://www.googleapis.com/auth/drive` -alueella, jotta solmu voi käsitellä sinulle jo kuuluvia tiedostoja. Sen jakaminen käyttäjän tai tiimin kanssa antaa jokaiselle heistä mahdollisuuden **lukea, muokata ja poistaa pysyvästi mitä tahansa Google Drivessasi** workflown kautta – ei vain niitä tiedostoja, joita tarkoitit. Jaa se vain niiden kanssa, joille antaisit suoran täyden Drive-käyttöoikeuden.

Jos haluat rajoittaa altistumista, luo erillinen Google-tili, jolla on pääsy vain niihin kansioihin, joita workflow tarvitsee, ja yhdistä tunnistetieto tähän tilisi sijaan kuin ensisijaiseen tiliisi.

**Decision Model** -tunnistetieto sisältää päätepisteen ja tarvittaessa API-avaimen. Sen jakaminen antaa vastaanottajan käyttää kyseistä avainta mistä tahansa suoritettavasta workflowsta, aivan kuten LLM-tunnistetieto.

**Model Router** -tunnistetieto jakaa kaiken, mihin se reitittää. Sen kanssa jakamasi henkilöt voivat suorittaa pyyntöjä jokaiselle sen vaihtoehtolistassa olevalle tunnistetiedolle, ja nämä pyynnöt käyttävät sinun avaimiasi. He eivät voi lukea avaimia, eivätkä tunnistetiedot näy heidän omassa tunnistetietoluettelossaan.

Tämä on sama myöntö kuin OpenAI-tunnistetiedon suora jakaminen, ja se tekee reitittimestä hyödyllisen tiimille. Jos et halua tätä, jaa yksittäiset tunnistetiedot sen sijaan ja anna jokaisen valita malli.

## Workflow-yhteistyökumppanien kanssa jakaminen

Kun jaat workflown, yhteistyökumppanit voivat avata ja suorittaa sen, mutta eivät voi käyttää tunnistetietojasi, ellet jaa myös niitä heidän kanssaan. Tämä koskee sekä pääworkflown että siinä kutsuttujen alityönkulkujen tunnistetietoja. Jaa jokainen tunnistetieto samoille käyttäjille tai tiimeille, joita kutsuit workflowhun. Alityönkulut on myös jaettava erikseen lapsityönkulun editorista. Katso [Workflown organisointi](./workflow-organization.md#sharing-workflows).

## Suorituskonteksti

Kun workflow suoritetaan, tunnistetiedot selvitetään **workflown omistajalle** (tai nykyiselle käyttäjälle suorituksen aikana). `get_credentials_context()` yhdistää:

1. **Omistetut tunnistetiedot** – `Credential.owner_id == user_id`
2. **Käyttäjien kesken jaetut tunnistetiedot** – `CredentialShare`, jossa `CredentialShare.user_id == user_id`
3. **Tiimien kesken jaetut tunnistetiedot** – `CredentialTeamShare`, jossa käyttäjä on tiimin jäsen

Kaikki yhdistetään yhteen kontekstisanakirjaan, joka on avattu tunnistetiedon nimellä.

## Käyttö workflowissa
### Nimen mukaan (Expression DSL)

Tunnistetiedot ovat käytettävissä muodossa `$credentials.CredentialName` [Expression DSL](./expression-dsl.md) -kielessä. Käytä tätä seuraavissa tapauksissa:

- HTTP-solmut (Bearer/Header -tunnistus)
- Telegram-solmut
- Slack-solmut
- Notionin bearer-tokenit mukautetuissa HTTP-pyynnöissä (sisäinen token tai OAuth-käyttöoikeustoken)
- Missä tahansa solmussa, joka hyväksyy lausekkeita tunnistusta varten

```dsl
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

### ID:n mukaan (credentialId)

Jotkut solmut tallentavat `credentialId` (UUID) `node.data` -kenttään:

| Solmun tyyppi | Kenttä | Kuvaus |
|-----------|-------|-------------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md), Kuvien generointi | `credentialId` | LLM-rajapinnan tunnistetiedot |
| [Codex](../nodes/codex-node.md) | `credentialId`, `githubCredentialId` | Codex-käyttöoikeustoken ja GitHub-tunnistetiedot |
| [OpenCode Go](../nodes/opencode-go-node.md) | `credentialId`, `githubCredentialId` | OpenCode Go -yhdyskäytävän tunnistetiedot ja GitHub-tunnistetiedot |
| [Jira](../nodes/jira-node.md) | `credentialId` | Jira Cloud -sähköposti/API-token tai Data Center -käyttäjätunnus/salasana |
| [Notion](../nodes/notion-node.md) | `credentialId` | Notionin sisäinen token tai OAuth-työtilan tunnistetiedot |
| [Sentry](../nodes/sentry-node.md) | `credentialId` | Sentryn tunnistustoken ja valinnainen perus-URL |
| [Supabase](../nodes/supabase-node.md) | `credentialId` | Supabase-projektin URL ja API-avain |
| [ClickHouse](../nodes/clickhouse-node.md) | `credentialId` | ClickHouse-yhteyden tiedot (isäntä, portti, tunnistus, tietokanta) |
| [Telegram Trigger](../nodes/telegram-trigger-node.md), [Telegram](../nodes/telegram-node.md) | `credentialId` | Telegram-botin tunnistetiedot |
| [Discord Trigger](../nodes/discord-trigger-node.md), [Discord](../nodes/discord-node.md) | `credentialId` | Discordin julkinen avain tai webhook-tunnistetiedot |
| Vektorivarasto | `credential_id` | Qdrant- tai Postgres (pgvector) -vektoritietokanta, käyttäen Qdrant-, Psql- tai Custom Embeddings RAG -tunnistetietoja |
| Arvioinnit | `credential_id`, `judge_credential_id` | Mallin tunnistetiedot; malli tai Decision Model -tunnistetiedot LLM-as-Judge -arvioijalle |
| [Playwright](../nodes/playwright-node.md) AI -vaihe | `credentialId` | LLM/Vision-malli (AI-vaihetta ja [Auto Heal](../nodes/playwright-node.md#ai-auto-heal) varten) |

Suoritin lataa tunnistetiedot suoraan tietokannasta ID:n perusteella ja purkaa salauksen asetuksista.

## Tulosten peittäminen

Suorituksen jälkeen `mask_sensitive_output()` peittää tunnistetietojen arvot tulosteissa, säilyttäen jokaisen seitsemän merkin pituisen salaisuuden ensimmäiset seitsemän merkkiä ja korvaen loput `**`-merkeillä, jotta salaisuudet eivät paljastu tuloksissa tai jäljityksissä.

## Aiheeseen liittyvät

- [Tunnistetiedot-välilehti](../tabs/credentials-tab.md) – Lisää ja jaa tunnistetietoja
- [Kolmannen osapuolen integraatiot](./integrations.md) – Yksityiskohtaiset asennusohjeet kullekin tunnistetietotyypille
- [Tiimit](./teams.md) – Jaa tiimien kesken
- [Expression DSL](./expression-dsl.md) – `$credentials`-syntaksi
- [Solmutyypit](./node-types.md) – Tunnistetietoja käyttävät solmut ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [Playwright](../nodes/playwright-node.md), [HTTP](../nodes/http-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md))
- [Agent-solmu](../nodes/agent-node.md) – Käyttää `credentialId` LLM:ää varten
