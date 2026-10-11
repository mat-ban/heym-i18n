# Deling af legitimationsoplysninger

Legitimationsoplysninger kan deles med andre brugere, så deres workflows kan anvende API-nøglerne. Se [Legitimationsoplysninger](./credentials.md) for en oversigt og [Legitimationsfanen](../tabs/credentials-tab.md) for tilføjelse og administration af legitimationsoplysninger.

## Deling af legitimationsoplysninger med en LLM

For at lade en LLM eller en AI-agent bruge en API-nøgle, skal nøglen gemmes som en legitimationsoplysning, og noden, der foretager anmodningen, skal vedhæfte den. Modellen bestemmer, hvad der skal kaldes; noden autenticerer kaldet under kørsel.

- **Gem den følsomme værdi som legitimationsoplysning.** Følsomme værdier krypteres i hvile og maskeres i brugergrænsefladen efter oprettelse.
- **Referer til den, hvor anmodningen foretages.** [LLM](../nodes/llm-node.md)- og [Agent](../nodes/agent-node.md)-noder vælger deres modellegitimationsoplysning efter ID, og HTTP-anmodninger placerer `$credentials.CredentialName` i auth-headeren. Hold hemmeligheder ude promptfelter, da alt i en prompt sendes til modeludbyderen som tekst.
- **Giv agenten værktøjer, ikke nøgler.** Når en Agent kalder en HTTP-node, en MCP-server eller et sub-workflow som et værktøj, anvendes legitimationsoplysningen inde i det pågældende værktøj, og modellen modtager værktøjets resultat.
- **Outputs maskeres.** Når en legitimationsværdi på mere end syv tegn vises i en nodes output, beholdes kun de første syv tegn, så et svar, der ekkoer en nøgle, kun viser dette præfiks i resultater og spor. Se [Output-maskering](#output-masking).
- **Lad assistenten oprette legitimationsoplysninger.** Når [AI-assistenten](./ai-assistant.md#credentials) eller Chat-fanen opretter en legitimationsoplysning, ser den kun navnet og typen, og den følsomme værdi indtastes i det almindelige legitimationsformular.
- **Del med personer på samme måde.** Del legitimationsoplysningen med en bruger eller et team, som beskrevet nedenfor, og deres workflows kan bruge nøglen via deres egne LLM- og Agent-noder.

## Delingsmodel

- **CredentialShare** – Forbinder `credential_id` med `user_id` (unik pr. par)
- **Del via e-mail** – `POST /api/credentials/{credential_id}/shares` med e-mail; brugeren opsøges og tilføjes
- **Tilbagekald** – `DELETE /api/credentials/{credential_id}/shares/{user_id}`

Det er også muligt at dele legitimationsoplysninger med [Teams](./teams.md):

- **CredentialTeamShare** – Forbinder `credential_id` med `team_id`; alle teammedlemmer får adgang
- **Del med team** – `POST /api/credentials/{credential_id}/team-shares` med `team_id`
- **Tilbagekald teamdeling** – `DELETE /api/credentials/{credential_id}/team-shares/{team_id}`

Delte legitimationsoplysninger vises med en indikator i [Legitimationsfanens](../tabs/credentials-tab.md) brugergrænseflade.

## Legitimationsoplysninger med bredt omfang

Deling af en legitimationsoplysning giver modtageren alt, hvad legitimationsoplysningen kan gøre. For de fleste integrationer er dette begrænset til et arbejdsområde eller en API-nøgles tilladelser, men nogle legitimationsoplysninger har langt bredere omfang.

> **Google Drive-legitimationsoplysninger giver fuld Drive-adgang.** [Google Drive](../nodes/google-drive-node.md)-legitimationsoplysningen autoriseres med scopet `https://www.googleapis.com/auth/drive`, så noden kan arbejde med filer, der allerede ejes. Deling med en bruger eller et team giver hver enkelt af dem mulighed for at **læse, ændre og permanent slette alt i Google Drive** via et workflow - ikke kun de filer, der var tænkt. Del kun med personer, der ville få fuld Drive-adgang direkte.

Hvis der er behov for at begrænse eksponeringen, oprettes en dedikeret Google-konto med adgang til kun de mapper, workflowet har brug for, og legitimationsoplysningen forbindes med denne konto i stedet for den primære.

En **Decision Model**-legitimationsoplysning indeholder endpointet og, når angivet, en API-nøgle. Deling giver modtageren mulighed for at bruge denne nøgle fra ethvert workflow, de kan køre, præcis som en LLM-legitimationsoplysning.

En **Model Router**-legitimationsoplysning deler alt, den routerer til. De personer, den deles med, kan køre anmodninger mod hver legitimationsoplysning på dens optionsliste, og disse anmodninger bruger nøglerne. De kan ikke læse nøglerne, og legitimationsoplysningerne vises ikke på deres egen legitimationsliste.

Dette er den samme tilladelse som at dele en OpenAI-legitimationsoplysning direkte, og det er det, der gør en router nyttig for et team. Hvis dette ikke ønskes, deles de enkelte legitimationsoplysninger i stedet, og hver person vælger en model.

## Deling med workflow-samarbejdspartnere

Når et workflow deles, kan samarbejdspartnere åbne og køre det, men kan ikke bruge legitimationsoplysningerne, medmindre disse også deles med dem. Dette gælder for legitimationsoplysninger i hovedworkflowet og i eventuelle sub-workflows, det kalder. Del hver legitimationsoplysning med de samme brugere eller teams, der er inviteret til workflowet. Sub-workflows skal også deles separat fra child workflow's editor. Se [Workflow-organisation](./workflow-organization.md#sharing-workflows).

## Eksekveringskontekst

Når et workflow kører, løses legitimationsoplysninger for **workflow-ejeren** (eller den aktuelle bruger under kørsel). `get_credentials_context()` sammensætter:

1. **Egede legitimationsoplysninger** – `Credential.owner_id == user_id`
2. **Bruger-delte legitimationsoplysninger** – `CredentialShare` hvor `CredentialShare.user_id == user_id`
3. **Team-delte legitimationsoplysninger** – `CredentialTeamShare` hvor brugeren er medlem af teamet

Alle sammensættes til en enkelt kontekstdict nøglet efter legitimationsnavn.

## Anvendelse i workflows
### By Name (Expression DSL)

Legitimationsoplysninger eksponeres som `$credentials.CredentialName` i [Expression DSL](./expression-dsl.md). Anvend dette til:

- HTTP-noder (Bearer/Header-autentifikation)
- Telegram-noder
- Slack-noder
- Notion bearer tokens i brugerdefinerede HTTP-anmodninger (internt token eller OAuth-adgangstoken)
- Enhver node, der accepterer udtryk til autentifikation

```dsl
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

### By ID (credentialId)

Nogle noder gemmer `credentialId` (UUID) i `node.data`:

| Node Type | Felt | Beskrivelse |
|-----------|-------|-------------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md), Image Gen | `credentialId` | LLM API-legitimationsoplysninger |
| [Codex](../nodes/codex-node.md) | `credentialId`, `githubCredentialId` | Codex-adgangstoken-legitimationsoplysninger og GitHub-legitimationsoplysninger |
| [OpenCode Go](../nodes/opencode-go-node.md) | `credentialId`, `githubCredentialId` | OpenCode Go-gateway-legitimationsoplysninger og GitHub-legitimationsoplysninger |
| [Jira](../nodes/jira-node.md) | `credentialId` | Jira Cloud-e-mail/API-token eller Data Center-brugernavn/adgangskode-legitimationsoplysninger |
| [Notion](../nodes/notion-node.md) | `credentialId` | Notion internt token eller OAuth-workspace-legitimationsoplysninger |
| [Sentry](../nodes/sentry-node.md) | `credentialId` | Sentry-autentifikationstoken og valgfri basis-URL |
| [Supabase](../nodes/supabase-node.md) | `credentialId` | Supabase-projekt-URL og API-nøgle |
| [ClickHouse](../nodes/clickhouse-node.md) | `credentialId` | ClickHouse-forbindelsesdetaljer (vært, port, autentifikation, database) |
| [Telegram Trigger](../nodes/telegram-trigger-node.md), [Telegram](../nodes/telegram-node.md) | `credentialId` | Telegram-bot-legitimationsoplysninger |
| [Discord Trigger](../nodes/discord-trigger-node.md), [Discord](../nodes/discord-node.md) | `credentialId` | Discord-offentlig nøgle eller webhook-legitimationsoplysninger |
| Vektorlagre | `credential_id` | Qdrant eller Postgres (pgvector) vektor-DB, via Qdrant, Psql eller Custom Embeddings RAG-legitimationsoplysninger |
| Evalueringer | `credential_id`, `judge_credential_id` | Modellegitimationsoplysninger; en model eller Decision Model-legitimationsoplysninger for LLM-as-Judge-dommeren |
| [Playwright](../nodes/playwright-node.md) AI-trin | `credentialId` | LLM/Vision-model (til AI-trin og [Auto Heal](../nodes/playwright-node.md#ai-auto-heal)) |

Executor'en indlæser legitimationsoplysningerne direkte fra databasen ved ID og dekrypterer konfigurationen.

## Output Maskering

Efter udførelse maskerer `mask_sensitive_output()` legitimationsværdier i output, hvor de første syv tegn i hver hemmelighed, der er længere end syv tegn, beholdes, og resten erstattes med `**`, så hemmeligheder ikke eksponeres i resultater eller kørsler.

## Relateret

- [Legitimationsoplysninger-fanen](../tabs/credentials-tab.md) – Tilføj og del legitimationsoplysninger
- [Tredjepartsintegrationer](./integrations.md) – Detaljeret opsætning for hver legitimationsoplysningstype
- [Teams](./teams.md) – Del med teams
- [Expression DSL](./expression-dsl.md) – `$credentials` syntaks
- [Node-typer](./node-types.md) – Noder, der bruger legitimationsoplysninger ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [Playwright](../nodes/playwright-node.md), [HTTP](../nodes/http-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md))
- [Agent Node](../nodes/agent-node.md) – Bruger `credentialId` til LLM
