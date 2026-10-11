# Delning av autentiseringsuppgifter

Autentiseringsuppgifter kan delas med andra användare så att deras workflows kan använda delade API-nycklar. Se [Autentiseringsuppgifter](./credentials.md) för en översikt och [Fliken Autentiseringsuppgifter](../tabs/credentials-tab.md) för att lägga till och hantera autentiseringsuppgifter.

## Dela autentiseringsuppgifter med en LLM

För att låta en LLM eller en AI-agent använda en API-nyckel lagras nyckeln som en autentiseringsuppgift och den nod som utför begäran bifogar den. Modellen avgör vad som ska anropas; noden autentiserar anropet när den körs.

- **Lagra hemligheten som en autentiseringsuppgift.** Känsliga värden krypteras i vila och maskeras i gränssnittet efter att de skapats.
- **Referera till den där begäran görs.** Noderna [LLM](../nodes/llm-node.md) och [Agent](../nodes/agent-node.md) väljer sin modellautentiseringsuppgift via ID, och HTTP-begäranden placerar `$credentials.CredentialName` i autentiseringsheadern. Håll hemligheter borta från prompt-fält, eftersom allt i en prompt skickas till modellleverantören som text.
- **Ge agenten verktyg, inte nycklar.** När en Agent anropar en HTTP-nod, en MCP-server eller en under-workflow som ett verktyg, tillämpas autentiseringsuppgiften inuti det verktyget och modellen tar emot verktygets resultat.
- **Utdata maskeras.** När ett autentiseringsuppgiftsvärde längre än sju tecken förekommer i en nods utdata behålls endast de första sju tecknen, så ett svar som ekar en nyckel visar endast det prefixet i resultat och körningar. Se [Maskering av utdata](#output-masking).
- **Låt assistenten skapa autentiseringsuppgifter.** När [AI-assistenten](./ai-assistant.md#credentials) eller fliken Chat skapar en autentiseringsuppgift ser den endast namn och typ, och hemligheten anges i det vanliga formuläret för autentiseringsuppgifter.
- **Dela med personer på samma sätt.** Dela autentiseringsuppgiften med en användare eller ett team, enligt beskrivningen nedan, och deras workflows kan använda nyckeln via sina egna LLM- och Agent-noder.

## Delningsmodell

- **CredentialShare** – Kopplar `credential_id` till `user_id` (unikt per par)
- **Dela via e-post** – `POST /api/credentials/{credential_id}/shares` med e-post; användaren slås upp och läggs till
- **Återkalla** – `DELETE /api/credentials/{credential_id}/shares/{user_id}`

Autentiseringsuppgifter kan även delas med [Team](./teams.md):

- **CredentialTeamShare** – Kopplar `credential_id` till `team_id`; alla teammedlemmar får åtkomst
- **Dela med team** – `POST /api/credentials/{credential_id}/team-shares` med `team_id`
- **Återkalla teamdelning** – `DELETE /api/credentials/{credential_id}/team-shares/{team_id}`

Delade autentiseringsuppgifter visas med en indikator i gränssnittet för [Fliken Autentiseringsuppgifter](../tabs/credentials-tab.md).

## Autentiseringsuppgifter med brett omfång

Att dela en autentiseringsuppgift ger mottagaren allt som autentiseringsuppgiften kan göra. För de flesta integrationer är detta begränsat till en arbetsyta eller en API-nyckels behörigheter, men vissa autentiseringsuppgifter är betydligt bredare.

> **Google Drive-autentiseringsuppgifter ger fullständig Drive-åtkomst.** Autentiseringsuppgiften för [Google Drive](../nodes/google-drive-node.md) auktoriseras med scopet `https://www.googleapis.com/auth/drive` så att noden kan arbeta med filer som redan ägs. Att dela den med en användare eller ett team ger var och en av dem möjlighet att **läsa, ändra och permanent radera vad som helst i kopplad Google Drive** via en workflow – inte bara de filer som avsågs. Dela den endast med personer som skulle ges fullständig Drive-åtkomst direkt.

Om exponeringen behöver begränsas kan ett dedikerat Google-konto skapas med åtkomst endast till de mappar som workflowen behöver, och autentiseringsuppgiften anslutas med det kontot istället för det primära.

En autentiseringsuppgift av typen **Decision Model** innehåller endpointen och, när den är angiven, en API-nyckel. Att dela den låter mottagaren spendera mot den nyckeln från vilken workflow som helst som denne kan köra, precis som en LLM-autentiseringsuppgift.

En autentiseringsuppgift av typen **Model Router** delar allt som den dirigerar till. De personer som den delas med kan köra begäranden mot varje autentiseringsuppgift i dess alternativlista, och dessa begäranden förbrukar delade nycklar. De kan inte läsa nycklarna, och autentiseringsuppgifterna visas inte i deras egen lista över autentiseringsuppgifter.

Detta är samma beviljande som att dela en OpenAI-autentiseringsuppgift direkt, och det är vad som gör en router användbar för ett team. Om detta inte önskas kan de enskilda autentiseringsuppgifterna delas istället och låta varje person välja en modell.

## Dela med workflow-samarbetspartners

När en workflow delas kan samarbetspartners öppna och köra den, men de kan inte använda ägarens autentiseringsuppgifter om inte dessa också delas med dem. Detta gäller autentiseringsuppgifter i huvudworkflowen och i alla under-workflows som den anropar. Dela varje autentiseringsuppgift med samma användare eller team som bjöds in till workflowen. Under-workflows måste även delas separat från den underordnade workflowens redigerare. Se [Workflow-organisering](./workflow-organization.md#sharing-workflows).

## Körningskontext

När en workflow körs löses autentiseringsuppgifter för **workflowens ägare** (eller aktuell användare vid körning). `get_credentials_context()` sammanfogar:

1. **Ägda autentiseringsuppgifter** – `Credential.owner_id == user_id`
2. **Användardelade autentiseringsuppgifter** – `CredentialShare` där `CredentialShare.user_id == user_id`
3. **Teamdelade autentiseringsuppgifter** – `CredentialTeamShare` där användaren är medlem i teamet

Alla sammanfogas till en enda kontext-dict med autentiseringsuppgiftens namn som nyckel.

## Användning i workflows
### Efter namn (Expression DSL)

Autentiseringsuppgifter exponeras som `$credentials.CredentialName` i [Expression DSL](./expression-dsl.md). Använd detta för:

- HTTP-noder (Bearer/Header-autentisering)
- Telegram-noder
- Slack-noder
- Notion bearer-token i anpassade HTTP-förfrågningar (intern token eller OAuth-åtkomsttoken)
- Alla noder som accepterar uttryck för autentisering

```dsl
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

### Efter ID (credentialId)

Vissa noder lagrar `credentialId` (UUID) i `node.data`:

| Nodtyp | Fält | Beskrivning |
|-----------|-------|-------------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md), Image Gen | `credentialId` | LLM API-autentiseringsuppgift |
| [Codex](../nodes/codex-node.md) | `credentialId`, `githubCredentialId` | Codex-åtkomsttoken och GitHub-autentiseringsuppgift |
| [OpenCode Go](../nodes/opencode-go-node.md) | `credentialId`, `githubCredentialId` | OpenCode Go gateway-autentiseringsuppgift och GitHub-autentiseringsuppgift |
| [Jira](../nodes/jira-node.md) | `credentialId` | Jira Cloud e-post/API-token eller Data Center användarnamn/lösenord-autentiseringsuppgift |
| [Notion](../nodes/notion-node.md) | `credentialId` | Notion intern token eller OAuth-arbetsyta-autentiseringsuppgift |
| [Sentry](../nodes/sentry-node.md) | `credentialId` | Sentry auth-token och valfri bas-URL |
| [Supabase](../nodes/supabase-node.md) | `credentialId` | Supabase projekt-URL och API-nyckel |
| [ClickHouse](../nodes/clickhouse-node.md) | `credentialId` | ClickHouse-anslutningsdetaljer (host, port, autentisering, databas) |
| [Telegram Trigger](../nodes/telegram-trigger-node.md), [Telegram](../nodes/telegram-node.md) | `credentialId` | Telegram bot-autentiseringsuppgift |
| [Discord Trigger](../nodes/discord-trigger-node.md), [Discord](../nodes/discord-node.md) | `credentialId` | Discord publik nyckel eller webhook-autentiseringsuppgift |
| Vector Store | `credential_id` | Qdrant eller Postgres (pgvector) vektordatabas, via en Qdrant-, Psql- eller Custom Embeddings RAG-autentiseringsuppgift |
| Evals | `credential_id`, `judge_credential_id` | Modellautentiseringsuppgift; en modell- eller Decision Model-autentiseringsuppgift för LLM-as-Judge-domaren |
| [Playwright](../nodes/playwright-node.md) AI-steg | `credentialId` | LLM/Vision-modell (för AI-steg och [Auto Heal](../nodes/playwright-node.md#ai-auto-heal)) |

Executorn laddar autentiseringsuppgiften direkt från databasen via ID och dekrypterar konfigurationen.

## Maskering av utdata

Efter körning maskerar `mask_sensitive_output()` autentiseringsuppgiftsvärden i utdata genom att behålla de första sju tecknen i varje hemlighet som är längre än sju tecken och ersätta resten med `**`, så att hemligheter inte exponeras i resultat eller traces.

## Relaterat

- [Fliken Autentiseringsuppgifter](../tabs/credentials-tab.md) – Lägg till och dela autentiseringsuppgifter
- [Tredjepartsintegrationer](./integrations.md) – Detaljerad konfiguration för varje autentiseringsuppgiftstyp
- [Team](./teams.md) – Dela med team
- [Expression DSL](./expression-dsl.md) – `$credentials`-syntax
- [Nodtyper](./node-types.md) – Noder som använder autentiseringsuppgifter ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [Playwright](../nodes/playwright-node.md), [HTTP](../nodes/http-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md))
- [Agent-nod](../nodes/agent-node.md) – Använder `credentialId` för LLM
