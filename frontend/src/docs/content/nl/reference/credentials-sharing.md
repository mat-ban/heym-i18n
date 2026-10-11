# Referenties delen

Referenties kunnen met andere gebruikers worden gedeeld, zodat hun workflows uw API-sleutels kunnen gebruiken. Zie [Referenties](./credentials.md) voor een overzicht en [Referenties-tab](../tabs/credentials-tab.md) voor het toevoegen en beheren van referenties.

## Referenties delen met een LLM

Om een LLM of een AI-agent een API-sleutel te laten gebruiken, slaat u de sleutel op als een referentie en laat u de node die het verzoek doet deze koppelen. Het model bepaalt wat er wordt aangeroepen; de node authenticeert de aanroep wanneer deze wordt uitgevoerd.

- **Sla het geheim op als een referentie.** Gevoelige waarden worden versleuteld opgeslagen en na aanmaak gemaskeerd in de UI.
- **Verwijs ernaar waar het verzoek wordt gedaan.** De [LLM](../nodes/llm-node.md)- en [Agent](../nodes/agent-node.md)-nodes selecteren hun modelreferentie op ID, en HTTP-verzoeken plaatsen `$credentials.CredentialName` in de auth-header. Houd geheimen buiten prompt-velden, omdat alles in een prompt als tekst naar de modelaanbieder wordt verzonden.
- **Geef de agent tools, geen sleutels.** Wanneer een Agent een HTTP-node, een MCP-server of een sub-workflow als tool aanroept, wordt de referentie binnen die tool toegepast en ontvangt het model het resultaat van de tool.
- **Uitvoer wordt gemaskeerd.** Wanneer een referentiewaarde van meer dan zeven tekens in de uitvoer van een node verschijnt, worden alleen de eerste zeven tekens behouden, zodat een antwoord dat een sleutel herhaalt alleen dat voorvoegsel toont in resultaten en Uitvoeringen. Zie [Uitvoer maskeren](#output-masking).
- **Laat de assistent referenties aanmaken.** Wanneer de [AI-assistent](./ai-assistant.md#credentials) of het Chat-tabblad een referentie aanmaakt, ziet deze alleen de naam en het type, en voert u het geheim in het reguliere referentieformulier in.
- **Deel op dezelfde manier met personen.** Deel de referentie met een gebruiker of een team, zoals hieronder beschreven, en hun workflows kunnen uw sleutel gebruiken via hun eigen LLM- en Agent-nodes.

## Deelmodel

- **CredentialShare** – Koppelt `credential_id` aan `user_id` (uniek per paar)
- **Delen via e-mail** – `POST /api/credentials/{credential_id}/shares` met e-mail; de gebruiker wordt opgezocht en toegevoegd
- **Intrekken** – `DELETE /api/credentials/{credential_id}/shares/{user_id}`

U kunt referenties ook delen met [Teams](./teams.md):

- **CredentialTeamShare** – Koppelt `credential_id` aan `team_id`; alle teamleden krijgen toegang
- **Delen met team** – `POST /api/credentials/{credential_id}/team-shares` met `team_id`
- **Teamshare intrekken** – `DELETE /api/credentials/{credential_id}/team-shares/{team_id}`

Gedeelde referenties tonen een indicator in de UI van het [Referenties-tab](../tabs/credentials-tab.md).

## Referenties met brede reikwijdte

Het delen van een referentie verleent de ontvanger alles wat die referentie kan doen. Voor de meeste integraties is dat beperkt tot één workspace of de machtigingen van één API-sleutel, maar sommige referenties zijn veel breder.

> **Google Drive-referenties verlenen volledige Drive-toegang.** De [Google Drive](../nodes/google-drive-node.md)-referentie wordt geautoriseerd met de scope `https://www.googleapis.com/auth/drive`, zodat de node kan werken met bestanden die u al bezit. Als u deze deelt met een gebruiker of een team, krijgt ieder van hen de mogelijkheid om **alles in uw Google Drive te lezen, te wijzigen en permanent te verwijderen** via een workflow — niet alleen de bestanden die u voor ogen had. Deel deze alleen met personen aan wie u rechtstreeks volledige Drive-toegang zou geven.

Als u de blootstelling wilt beperken, maakt u een toegewijde Google-account met toegang tot alleen de mappen die de workflow nodig heeft, en verbindt u de referentie met die account in plaats van uw primaire account.

Een **Decision Model**-referentie bevat het endpoint en, indien ingesteld, een API-sleutel. Door deze te delen kan de ontvanger op die sleutel verbruiken vanuit elke workflow die hij kan uitvoeren, precies zoals bij een LLM-referentie.

Een **Model Router**-referentie deelt alles waarnaar deze routeert. De personen met wie u deze deelt, kunnen verzoeken uitvoeren tegen elke referentie in de optielijst, en die verzoeken verbruiken uw sleutels. Zij kunnen de sleutels niet lezen, en de referenties verschijnen niet in hun eigen referentielijst.

Dit is dezelfde verlening als het rechtstreeks delen van een OpenAI-referentie, en het is wat een router nuttig maakt voor een team. Als u dat niet wilt, deelt u de afzonderlijke referenties en laat u iedere persoon een model kiezen.

## Delen met workflow-samenwerkers

Wanneer u een workflow deelt, kunnen samenwerkers deze openen en uitvoeren, maar zij kunnen uw referenties niet gebruiken tenzij u die referenties ook met hen deelt. Dit geldt voor referenties in de hoofdworkflow en in alle sub-workflows die deze aanroept. Deel elke referentie met dezelfde gebruikers of teams die u voor de workflow heeft uitgenodigd. Sub-workflows moeten ook afzonderlijk worden gedeeld vanuit de editor van de onderliggende workflow. Zie [Workflow-organisatie](./workflow-organization.md#sharing-workflows).

## Uitvoeringscontext

Wanneer een workflow wordt uitgevoerd, worden referenties opgelost voor de **workflow-eigenaar** (of de huidige gebruiker bij uitvoering). `get_credentials_context()` voegt samen:

1. **Eigen referenties** – `Credential.owner_id == user_id`
2. **Door gebruiker gedeelde referenties** – `CredentialShare` waarbij `CredentialShare.user_id == user_id`
3. **Door team gedeelde referenties** – `CredentialTeamShare` waarbij de gebruiker lid is van het team

Alle worden samengevoegd in één context-dict met de referentienaam als sleutel.

## Gebruik in workflows
### Op Naam (Expression DSL)

Referenties worden beschikbaar gesteld als `$credentials.CredentialName` in de [Expression DSL](./expression-dsl.md). Gebruik dit voor:

- HTTP-nodes (Bearer/Header-authenticatie)
- Telegram-nodes
- Slack-nodes
- Notion bearer-tokens in aangepaste HTTP-verzoeken (intern token of OAuth access token)
- Elke node die expressies accepteert voor authenticatie

```dsl
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

### Op ID (credentialId)

Sommige nodes slaan `credentialId` (UUID) op in `node.data`:

| Node Type | Veld | Beschrijving |
|-----------|-------|-------------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md), Image Gen | `credentialId` | LLM API-referentie |
| [Codex](../nodes/codex-node.md) | `credentialId`, `githubCredentialId` | Codex access token-referentie en GitHub-referentie |
| [OpenCode Go](../nodes/opencode-go-node.md) | `credentialId`, `githubCredentialId` | OpenCode Go gateway-referentie en GitHub-referentie |
| [Jira](../nodes/jira-node.md) | `credentialId` | Jira Cloud e-mail/API-token of Data Center gebruikersnaam/wachtwoord-referentie |
| [Notion](../nodes/notion-node.md) | `credentialId` | Notion intern token of OAuth workspace-referentie |
| [Sentry](../nodes/sentry-node.md) | `credentialId` | Sentry auth token en optionele base URL |
| [Supabase](../nodes/supabase-node.md) | `credentialId` | Supabase project-URL en API-sleutel |
| [ClickHouse](../nodes/clickhouse-node.md) | `credentialId` | ClickHouse-verbindingsgegevens (host, poort, authenticatie, database) |
| [Telegram Trigger](../nodes/telegram-trigger-node.md), [Telegram](../nodes/telegram-node.md) | `credentialId` | Telegram bot-referentie |
| [Discord Trigger](../nodes/discord-trigger-node.md), [Discord](../nodes/discord-node.md) | `credentialId` | Discord public key of webhook-referentie |
| Vector Store | `credential_id` | Qdrant of Postgres (pgvector) vector DB, via een Qdrant-, Psql- of Custom Embeddings RAG-referentie |
| Evals | `credential_id`, `judge_credential_id` | Modelreferentie; een model- of Decision Model-referentie voor de LLM-as-Judge judge |
| [Playwright](../nodes/playwright-node.md) AI-stap | `credentialId` | LLM/Vision-model (voor AI-stap en [Auto Heal](../nodes/playwright-node.md#ai-auto-heal)) |

De executor laadt de referentie rechtstreeks uit de database op ID en ontsleutelt de configuratie.

## Uitvoer Maskeren

Na uitvoering maskeert `mask_sensitive_output()` referentiewaarden in uitvoer, waarbij de eerste zeven tekens van elk geheim langer dan zeven tekens behouden blijven en de rest wordt vervangen door `**`, zodat geheimen niet worden blootgesteld in resultaten of uitvoeringen.

## Gerelateerd

- [Referenties Tab](../tabs/credentials-tab.md) – Referenties toevoegen en delen
- [Third-Party Integrations](./integrations.md) – Gedetailleerde installatie voor elk referentietype
- [Teams](./teams.md) – Delen met teams
- [Expression DSL](./expression-dsl.md) – `$credentials`-syntaxis
- [Node Types](./node-types.md) – Nodes die referenties gebruiken ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [Playwright](../nodes/playwright-node.md), [HTTP](../nodes/http-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md))
- [Agent Node](../nodes/agent-node.md) – Gebruikt `credentialId` voor LLM
