# Akreditācijas datu koplietošana

Akreditācijas datus var koplietot ar citiem lietotājiem, lai viņu workflow varētu izmantot Jūsu API atslēgas. Skatiet [Akreditācijas dati](./credentials.md), lai iepazītos ar pārskatu, un [Akreditācijas datu cilne](../tabs/credentials-tab.md), lai pievienotu un pārvaldītu akreditācijas datus.

## Akreditācijas datu koplietošana ar LLM

Lai ļautu LLM vai AI aģentam izmantot API atslēgu, saglabājiet atslēgu kā akreditācijas datus un ļaujiet mezglam, kas veic pieprasījumu, to pievienot. Modelis izlemj, ko izsaukt; mezgls autentificē izsaukumu, kad tas tiek izpildīts.

- **Saglabājiet noslēpumu kā akreditācijas datus.** Sensitīvās vērtības tiek šifrētas miera stāvoklī un pēc izveides tiek maskētas UI.
- **Atsaucieties uz tiem vietā, kur tiek veikts pieprasījums.** [LLM](../nodes/llm-node.md) un [Agent](../nodes/agent-node.md) mezgli izvēlas sava modeļa akreditācijas datus pēc ID, un HTTP pieprasījumi ievieto `$credentials.CredentialName` autentifikācijas galvenē. Neturiet noslēpumus prompt laukos, jo viss promptā tiek nosūtīts modeļa nodrošinātājam kā teksts.
- **Piešķiriet aģentam rīkus, nevis atslēgas.** Kad Agent izsauc HTTP mezglu, MCP serveri vai apakš-workflow kā rīku, akreditācijas dati tiek piemēroti šī rīka ietvaros, un modelis saņem rīka rezultātu.
- **Izvades tiek maskētas.** Kad mezgla izvadē parādās akreditācijas datu vērtība, kas garāka par septiņām rakstzīmēm, tiek saglabātas tikai pirmās septiņas rakstzīmes, tāpēc atbildē, kas atkārto atslēgu, rezultātos un izpildēs tiek parādīts tikai šis prefikss. Skatiet [Izvades maskēšana](#output-masking).
- **Ļaujiet asistentam izveidot akreditācijas datus.** Kad [AI Assistant](./ai-assistant.md#credentials) vai Chat cilne izveido akreditācijas datus, tas redz tikai nosaukumu un tipu, un Jūs ievadāt noslēpumu parastajā akreditācijas datu formā.
- **Koplietojiet ar cilvēkiem tādā pašā veidā.** Koplietojiet akreditācijas datus ar lietotāju vai komandu, kā aprakstīts tālāk, un viņu workflow varēs izmantot Jūsu atslēgu, izmantojot savus LLM un Agent mezglus.

## Koplietošanas modelis

- **CredentialShare** – Saista `credential_id` ar `user_id` (unikāls katram pārim)
- **Koplietošana pēc e-pasta** – `POST /api/credentials/{credential_id}/shares` ar e-pastu; lietotājs tiek meklēts un pievienots
- **Atsaukšana** – `DELETE /api/credentials/{credential_id}/shares/{user_id}`

Varat arī koplietot akreditācijas datus ar [Komandām](./teams.md):

- **CredentialTeamShare** – Saista `credential_id` ar `team_id`; visi komandas dalībnieki iegūst piekļuvi
- **Koplietošana ar komandu** – `POST /api/credentials/{credential_id}/team-shares` ar `team_id`
- **Komandas koplietošanas atsaukšana** – `DELETE /api/credentials/{credential_id}/team-shares/{team_id}`

Koplietotie akreditācijas dati parāda indikatoru [Akreditācijas datu cilnes](../tabs/credentials-tab.md) UI.

## Plaša tvēruma akreditācijas dati

Akreditācijas datu koplietošana piešķir saņēmējam visas iespējas, ko šie akreditācijas dati var darīt. Lielākajai daļai integrāciju tas ir ierobežots ar vienu workspace vai vienas API atslēgas atļaujām, taču daži akreditācijas dati ir daudz plašāki.

> **Google Drive akreditācijas dati piešķir pilnu Drive piekļuvi.** [Google Drive](../nodes/google-drive-node.md) akreditācijas dati tiek autorizēti ar `https://www.googleapis.com/auth/drive` tvērumu, lai mezgls varētu darboties ar failiem, kas jau pieder Jums. Koplietojot tos ar lietotāju vai komandu, katram no viņiem tiek dota iespēja **lasīt, modificēt un neatgriezeniski dzēst jebko Jūsu Google Drive** ar workflow palīdzību — ne tikai failus, ko bijāt iecerējis. Koplietojiet tos tikai ar cilvēkiem, kuriem Jūs piešķirtu pilnu Drive piekļuvi tieši.

Ja nepieciešams ierobežot piekļuvi, izveidojiet atsevišķu Google kontu ar piekļuvi tikai tām mapēm, kas nepieciešamas workflow, un savienojiet akreditācijas datus ar šo kontu, nevis savu primāro.

**Decision Model** akreditācijas dati satur endpoint un, ja iestatīts, API atslēgu. To koplietošana ļauj saņēmējam izmantot šo atslēgu no jebkura workflow, ko viņš var palaist, tieši tāpat kā LLM akreditācijas datus.

**Model Router** akreditācijas dati koplieto visu, uz ko tie maršrutē. Cilvēki, ar kuriem Jūs tos koplietojat, var izpildīt pieprasījumus pret katriem akreditācijas datiem to opciju sarakstā, un šie pieprasījumi izmanto Jūsu atslēgas. Viņi nevar nolasīt atslēgas, un akreditācijas dati neparādās viņu pašu akreditācijas datu sarakstā.

Tas ir tāds pats piešķīrums kā OpenAI akreditācijas datu tieša koplietošana, un tas ir tas, kas padara router par noderīgu komandai. Ja to nevēlaties, koplietojiet atsevišķus akreditācijas datus un ļaujiet katram izvēlēties modeli.

## Koplietošana ar workflow līdzstrādniekiem

Kad Jūs koplietojat workflow, līdzstrādnieki var to atvērt un palaist, bet nevar izmantot Jūsu akreditācijas datus, ja vien Jūs tos arī nekoplietojat ar viņiem. Tas attiecas uz akreditācijas datiem galvenajā workflow un jebkuros apakš-workflow, ko tas izsauc. Koplietojiet katrus akreditācijas datus ar tiem pašiem lietotājiem vai komandām, ko uzaicinājāt uz workflow. Apakš-workflow arī ir jākoplieto atsevišķi no pakārtotā workflow redaktora. Skatiet [Workflow organizācija](./workflow-organization.md#sharing-workflows).

## Izpildes konteksts

Kad workflow tiek palaists, akreditācijas dati tiek atrisināti **workflow īpašniekam** (vai pašreizējam lietotājam, kad tas tiek palaists). `get_credentials_context()` apvieno:

1. **Piederošie akreditācijas dati** – `Credential.owner_id == user_id`
2. **Lietotāja koplietotie akreditācijas dati** – `CredentialShare`, kur `CredentialShare.user_id == user_id`
3. **Komandas koplietotie akreditācijas dati** – `CredentialTeamShare`, kur lietotājs ir komandas dalībnieks

Visi tiek apvienoti vienā konteksta dict ar atslēgu pēc akreditācijas datu nosaukuma.

## Izmantošana workflow
### Pēc nosaukuma (Expression DSL)

Akreditācijas dati [Expression DSL](./expression-dsl.md) ir pieejami kā `$credentials.CredentialName`. Izmantojiet to šādiem nolūkiem:

- HTTP mezgli (Bearer/Header autentifikācija)
- Telegram mezgli
- Slack mezgli
- Notion bearer tokeni pielāgotos HTTP pieprasījumos (iekšējais token vai OAuth piekļuves token)
- Jebkurš mezgls, kas pieņem izteiksmes autentifikācijai

```dsl
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

### Pēc ID (credentialId)

Daži mezgli glabā `credentialId` (UUID) laukā `node.data`:

| Mezgla tips | Lauks | Apraksts |
|-----------|-------|-------------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md), Image Gen | `credentialId` | LLM API akreditācijas dati |
| [Codex](../nodes/codex-node.md) | `credentialId`, `githubCredentialId` | Codex piekļuves tokena akreditācijas dati un GitHub akreditācijas dati |
| [OpenCode Go](../nodes/opencode-go-node.md) | `credentialId`, `githubCredentialId` | OpenCode Go gateway akreditācijas dati un GitHub akreditācijas dati |
| [Jira](../nodes/jira-node.md) | `credentialId` | Jira Cloud e-pasta/API tokena vai Data Center lietotājvārda/paroles akreditācijas dati |
| [Notion](../nodes/notion-node.md) | `credentialId` | Notion iekšējā tokena vai OAuth darbvietas akreditācijas dati |
| [Sentry](../nodes/sentry-node.md) | `credentialId` | Sentry autentifikācijas token un neobligāts bāzes URL |
| [Supabase](../nodes/supabase-node.md) | `credentialId` | Supabase projekta URL un API atslēga |
| [ClickHouse](../nodes/clickhouse-node.md) | `credentialId` | ClickHouse savienojuma informācija (host, port, autentifikācija, database) |
| [Telegram Trigger](../nodes/telegram-trigger-node.md), [Telegram](../nodes/telegram-node.md) | `credentialId` | Telegram bota akreditācijas dati |
| [Discord Trigger](../nodes/discord-trigger-node.md), [Discord](../nodes/discord-node.md) | `credentialId` | Discord publiskās atslēgas vai webhook akreditācijas dati |
| Vector Store | `credential_id` | Qdrant vai Postgres (pgvector) vektoru DB, izmantojot Qdrant, Psql vai Custom Embeddings RAG akreditācijas datus |
| Evals | `credential_id`, `judge_credential_id` | Modeļa akreditācijas dati; modeļa vai Decision Model akreditācijas dati LLM-as-Judge tiesnesim |
| [Playwright](../nodes/playwright-node.md) AI solis | `credentialId` | LLM/Vision modelis (AI solim un [Auto Heal](../nodes/playwright-node.md#ai-auto-heal)) |

Izpildītājs ielādē akreditācijas datus tieši no datubāzes pēc ID un atšifrē konfigurāciju.

## Izvades maskēšana

Pēc izpildes `mask_sensitive_output()` maskē akreditācijas datu vērtības izvadēs, saglabājot pirmās septiņas rakstzīmes katram noslēpumam, kas ir garāks par septiņām rakstzīmēm, un aizstājot pārējās ar `**`, lai noslēpumi netiktu atklāti rezultātos vai izpildēs.

## Saistītie resursi

- [Akreditācijas datu cilne](../tabs/credentials-tab.md) – Pievienojiet un koplietojiet akreditācijas datus
- [Trešo pušu integrācijas](./integrations.md) – Detalizēta iestatīšana katram akreditācijas datu tipam
- [Komandas](./teams.md) – Koplietošana ar komandām
- [Expression DSL](./expression-dsl.md) – `$credentials` sintakse
- [Mezglu tipi](./node-types.md) – Mezgli, kas izmanto akreditācijas datus ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [Playwright](../nodes/playwright-node.md), [HTTP](../nodes/http-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md))
- [Agent mezgls](../nodes/agent-node.md) – Izmanto `credentialId` LLM vajadzībām
