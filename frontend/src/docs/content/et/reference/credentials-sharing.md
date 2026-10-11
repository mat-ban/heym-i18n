# Mandaatide jagamine

Mandaate saab teiste kasutajatega jagada, et nende workflow'd saaksid kasutada Teie API võtmeid. Ülevaate saamiseks vaadake [Mandaadid](./credentials.md) ja mandaatide lisamise ning haldamise kohta vaadake [Mandaatide vahekaart](../tabs/credentials-tab.md).

## Mandaatide jagamine LLM-iga

Selleks, et LLM või AI-agent saaks API võtit kasutada, salvestage võti mandaadina ja laske päringu tegeval sõlmel see lisada. Mudel otsustab, mida kutsuda; sõlm autendib kutse käivitamise ajal.

- **Salvestage saladus mandaadina.** Tundlikud väärtused krüpteeritakse salvestamisel ja maskeeritakse UI-s pärast loomist.
- **Viidake sellele päringu tegemise kohas.** [LLM](../nodes/llm-node.md) ja [Agent](../nodes/agent-node.md) sõlmed valivad oma mudeli mandaadi ID järgi ning HTTP päringud panevad autentimise päisesse `$credentials.CredentialName`. Hoidke saladused promptide väljadest eemal, sest kõik, mis on promptis, saadetakse mudeli pakkujale tekstina.
- **Andke agendile tööriistu, mitte võtmeid.** Kui Agent kutsub tööriistana HTTP sõlme, MCP serverit või alam-workflow'd, rakendatakse mandaati selle tööriista sees ja mudel saab tööriista tulemuse.
- **Väljundid on maskeeritud.** Kui mandaadi väärtus, mis on pikem kui seitse tähemärki, ilmub sõlme väljundisse, säilitatakse ainult selle esimesed seitse tähemärki, nii et võtit kordav vastus näitab tulemustes ja käivitustes ainult seda eesliidet. Vaadake [Väljundi maskeerimine](#output-masking).
- **Laske assistendil mandaate luua.** Kui [AI assistent](./ai-assistant.md#credentials) või Chat vahekaart loob mandaadi, näeb see ainult nime ja tüüpi ning Teie sisestate saladuse tavalises mandaadi vormis.
- **Jagage inimestega samal viisil.** Jagage mandaati kasutaja või tiimiga, nagu allpool kirjeldatud, ja nende workflow'd saavad Teie võtit kasutada oma LLM ja Agent sõlmede kaudu.

## Jagamise mudel

- **CredentialShare** – seob `credential_id` ja `user_id` (unikaalne paari kohta)
- **Jagamine e-posti teel** – `POST /api/credentials/{credential_id}/shares` koos e-postiga; kasutaja otsitakse üles ja lisatakse
- **Tühistamine** – `DELETE /api/credentials/{credential_id}/shares/{user_id}`

Mandaate saab jagada ka [Tiimidega](./teams.md):

- **CredentialTeamShare** – seob `credential_id` ja `team_id`; kõik tiimi liikmed saavad juurdepääsu
- **Jagamine tiimiga** – `POST /api/credentials/{credential_id}/team-shares` koos `team_id`-ga
- **Tiimiga jagamise tühistamine** – `DELETE /api/credentials/{credential_id}/team-shares/{team_id}`

Jagatud mandaadid näitavad indikaatorit [Mandaatide vahekaardi](../tabs/credentials-tab.md) UI-s.

## Laiema ulatusega mandaadid

Mandaadi jagamine annab saajale kõik, mida see mandaat suudab teha. Enamiku integratsioonide puhul on see piiratud ühe tööruumi või ühe API võtme õigustega, kuid mõned mandaadid on palju laiemad.

> **Google Drive'i mandaadid annavad täieliku Drive'i juurdepääsu.** [Google Drive](../nodes/google-drive-node.md) mandaat on autoriseeritud ulatusega `https://www.googleapis.com/auth/drive`, et sõlm saaks töötada failidega, mis Teile juba kuuluvad. Selle jagamine kasutaja või tiimiga annab igaühele neist võimaluse **lugeda, muuta ja jäädavalt kustutada kõike Teie Google Drive'is** workflow kaudu — mitte ainult faile, mida silmas pidasite. Jagage seda ainult inimestega, kellele annaksite täieliku Drive'i juurdepääsu ka otse.

Kui peate kokkupuudet piirama, looge eraldi Google'i konto, millel on juurdepääs ainult workflow'le vajalikele kaustadele, ja ühendage mandaat selle kontoga, mitte oma peamise kontoga.

**Decision Model** mandaat sisaldab endpoint'i ja, kui määratud, API võtit. Selle jagamine lubab saajal kulutada selle võtme arvelt mis tahes workflow's, mida ta saab käivitada, täpselt nagu LLM mandaadi puhul.

**Model Router** mandaat jagab kõike, mida see suunab. Inimesed, kellega seda jagate, saavad teha päringuid iga mandaadi vastu selle valikute loendis ja need päringud kulutavad Teie võtmeid. Nad ei saa võtmeid lugeda ja mandaadid ei ilmu nende enda mandaatide loendis.

See on sama luba nagu OpenAI mandaadi otsene jagamine ja see teeb routeri tiimile kasulikuks. Kui Te seda ei soovi, jagage üksikuid mandaate ja laske igal inimesel mudel valida.

## Jagamine workflow' koostööpartneritega

Kui jagate workflow'd, saavad koostööpartnerid selle avada ja käivitada, kuid ei saa kasutada Teie mandaate, kui Te neid mandaate ka nendega ei jaga. See kehtib nii põhi-workflow' mandaatide kui ka kõigi selle kutsutavate alam-workflow'de kohta. Jagage iga mandaati samade kasutajate või tiimidega, kelle kutsusite workflow'sse. Alam-workflow'sid tuleb samuti eraldi jagada alam-workflow' redaktorist. Vaadake [Workflow' korraldus](./workflow-organization.md#sharing-workflows).

## Käivituse kontekst

Kui workflow käivitub, lahendatakse mandaadid **workflow' omaniku** jaoks (või käivitamise ajal praeguse kasutaja jaoks). `get_credentials_context()` ühendab:

1. **Omandatud mandaadid** – `Credential.owner_id == user_id`
2. **Kasutajaga jagatud mandaadid** – `CredentialShare`, kus `CredentialShare.user_id == user_id`
3. **Tiimiga jagatud mandaadid** – `CredentialTeamShare`, kus kasutaja on tiimi liige

Kõik ühendatakse ühte konteksti dict'i, võtmeteks mandaadi nimi.

## Kasutamine workflow'des
### Nime järgi (Expression DSL)

Mandaadid on [Expression DSL](./expression-dsl.md) keskkonnas kättesaadavad kujul `$credentials.CredentialName`. Kasutage seda järgmiste jaoks:

- HTTP node'id (Bearer/Header autentimine)
- Telegram node'id
- Slack node'id
- Notioni bearer tokenid kohandatud HTTP-päringutes (sisemine token või OAuth access token)
- Iga node, mis aktsepteerib autentimiseks avaldisi

```dsl
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

### ID järgi (credentialId)

Mõned node'id salvestavad `credentialId` (UUID) väljale `node.data`:

| Node'i tüüp | Väli | Kirjeldus |
|-----------|-------|-------------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md), Image Gen | `credentialId` | LLM API mandaat |
| [Codex](../nodes/codex-node.md) | `credentialId`, `githubCredentialId` | Codexi access token'i mandaat ja GitHubi mandaat |
| [OpenCode Go](../nodes/opencode-go-node.md) | `credentialId`, `githubCredentialId` | OpenCode Go gateway mandaat ja GitHubi mandaat |
| [Jira](../nodes/jira-node.md) | `credentialId` | Jira Cloudi e-posti/API tokeni või Data Centeri kasutajanime/parooli mandaat |
| [Notion](../nodes/notion-node.md) | `credentialId` | Notioni sisemine token või OAuth workspace'i mandaat |
| [Sentry](../nodes/sentry-node.md) | `credentialId` | Sentry auth token ja valikuline base URL |
| [Supabase](../nodes/supabase-node.md) | `credentialId` | Supabase'i projekti URL ja API key |
| [ClickHouse](../nodes/clickhouse-node.md) | `credentialId` | ClickHouse'i ühenduse andmed (host, port, autentimine, andmebaas) |
| [Telegram Trigger](../nodes/telegram-trigger-node.md), [Telegram](../nodes/telegram-node.md) | `credentialId` | Telegrami boti mandaat |
| [Discord Trigger](../nodes/discord-trigger-node.md), [Discord](../nodes/discord-node.md) | `credentialId` | Discordi avalik võti või webhooki mandaat |
| Vector Store | `credential_id` | Qdranti või Postgresi (pgvector) vektorandmebaas, Qdranti, Psqli või Custom Embeddings RAG mandaadi kaudu |
| Evals | `credential_id`, `judge_credential_id` | Mudeli mandaat; mudeli või Decision Modeli mandaat LLM-as-Judge kohtuniku jaoks |
| [Playwright](../nodes/playwright-node.md) AI samm | `credentialId` | LLM/Vision mudel (AI sammu ja [Auto Heal](../nodes/playwright-node.md#ai-auto-heal) jaoks) |

Täitja laeb mandaadi otse andmebaasist ID järgi ja dekrüpteerib konfiguratsiooni.

## Väljundi maskeerimine

Pärast täitmist maskeerib `mask_sensitive_output()` mandaadi väärtused väljundites, jättes iga seitsmest tähemärgist pikema saladuse esimesed seitse tähemärki alles ja asendades ülejäänu tähemärkidega `**`, et saladused ei oleks tulemustes ega käivituste jälgedes nähtavad.

## Seotud

- [Mandaatide vaheleht](../tabs/credentials-tab.md) – Mandaatide lisamine ja jagamine
- [Kolmandate osapoolte integratsioonid](./integrations.md) – Üksikasjalik seadistus iga mandaadi tüübi jaoks
- [Meeskonnad](./teams.md) – Jagamine meeskondadega
- [Expression DSL](./expression-dsl.md) – `$credentials` süntaks
- [Node'i tüübid](./node-types.md) – Node'id, mis kasutavad mandaate ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [Playwright](../nodes/playwright-node.md), [HTTP](../nodes/http-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md))
- [Agent Node](../nodes/agent-node.md) – Kasutab LLM-i jaoks `credentialId`-d
