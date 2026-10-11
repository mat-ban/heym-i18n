# Zdieľanie prihlasovacích údajov

Prihlasovacie údaje je možné zdieľať s ostatnými používateľmi, aby ich workflowy mohli používať Vaše API kľúče. Prehľad nájdete v časti [Prihlasovacie údaje](./credentials.md) a informácie o pridávaní a správe prihlasovacích údajov v časti [Karta Prihlasovacie údaje](../tabs/credentials-tab.md).

## Zdieľanie prihlasovacích údajov s LLM

Ak chcete umožniť LLM alebo AI agentovi používať API kľúč, uložte kľúč ako prihlasovacie údaje a nechajte uzol, ktorý vykonáva požiadavku, aby ich pripojil. Model rozhoduje o tom, čo sa má zavolať; uzol overí volanie v momente spustenia.

- **Uložte tajný údaj ako prihlasovacie údaje.** Citlivé hodnoty sú šifrované v pokoji a po vytvorení maskované v UI.
- **Odkazujte na ne tam, kde sa požiadavka vykonáva.** Uzly [LLM](../nodes/llm-node.md) a [Agent](../nodes/agent-node.md) vyberajú svoje prihlasovacie údaje k modelu podľa ID a HTTP požiadavky vkladajú `$credentials.CredentialName` do autentifikačnej hlavičky. Uchovávajte tajné údaje mimo polí prompt, pretože všetko v prompt je odoslané poskytovateľovi modelu ako text.
- **Poskytnite agentovi nástroje, nie kľúče.** Keď Agent volá HTTP uzol, MCP server alebo pod-workflow ako nástroj, prihlasovacie údaje sa aplikujú vnútri daného nástroja a model dostane výsledok nástroja.
- **Výstupy sú maskované.** Keď sa hodnota prihlasovacích údajov dlhšia ako sedem znakov objaví vo výstupe uzla, zachová sa iba jej prvých sedem znakov, takže odpoveď, ktorá opakuje kľúč, zobrazí vo výsledkoch a spusteniach iba tento prefix. Pozrite si časť [Maskovanie výstupu](#output-masking).
- **Nechajte asistenta vytvárať prihlasovacie údaje.** Keď [AI asistent](./ai-assistant.md#credentials) alebo karta Chat vytvorí prihlasovacie údaje, vidí iba názov a typ a tajný údaj zadáte v bežnom formulári prihlasovacích údajov.
- **Zdieľajte s ľuďmi rovnakým spôsobom.** Zdieľajte prihlasovacie údaje s používateľom alebo tímom podľa popisu nižšie a ich workflowy budú môcť používať Váš kľúč prostredníctvom svojich vlastných uzlov LLM a Agent.

## Model zdieľania

- **CredentialShare** – Prepája `credential_id` s `user_id` (jedinečné pre každú dvojicu)
- **Zdieľanie e-mailom** – `POST /api/credentials/{credential_id}/shares` s e-mailom; používateľ je vyhľadaný a pridaný
- **Odvolanie** – `DELETE /api/credentials/{credential_id}/shares/{user_id}`

Prihlasovacie údaje môžete zdieľať aj s [Tímami](./teams.md):

- **CredentialTeamShare** – Prepája `credential_id` s `team_id`; všetci členovia tímu získajú prístup
- **Zdieľanie s tímom** – `POST /api/credentials/{credential_id}/team-shares` s `team_id`
- **Odvolanie zdieľania s tímom** – `DELETE /api/credentials/{credential_id}/team-shares/{team_id}`

Zdieľané prihlasovacie údaje zobrazujú indikátor v UI [Karty Prihlasovacie údaje](../tabs/credentials-tab.md).

## Prihlasovacie údaje so širokým rozsahom

Zdieľanie prihlasovacích údajov poskytuje príjemcovi všetko, čo dané prihlasovacie údaje dokážu. Pre väčšinu integrácií je to obmedzené na jeden pracovný priestor alebo na oprávnenia jedného API kľúča, no niektoré prihlasovacie údaje sú oveľa širšie.

> **Prihlasovacie údaje Google Drive poskytujú plný prístup k Drive.** Prihlasovacie údaje [Google Drive](../nodes/google-drive-node.md) sú autorizované s rozsahom `https://www.googleapis.com/auth/drive`, aby uzol mohol pracovať so súbormi, ktoré už vlastníte. Ich zdieľaním s používateľom alebo tímom dáte každému z nich možnosť **čítať, upravovať a natrvalo odstraňovať čokoľvek vo Vašom Google Drive** prostredníctvom workflowu — nielen súbory, ktoré ste mali na mysli. Zdieľajte ich iba s ľuďmi, ktorým by ste poskytli plný prístup k Drive priamo.

Ak potrebujete obmedziť expozíciu, vytvorte vyhradený Google účet s prístupom iba k priečinkom, ktoré workflow potrebuje, a pripojte prihlasovacie údaje s týmto účtom namiesto svojho primárneho.

Prihlasovacie údaje **Decision Model** nesú endpoint a, ak je nastavený, API kľúč. Ich zdieľanie umožňuje príjemcovi čerpať prostredníctvom daného kľúča z akéhokoľvek workflowu, ktorý dokáže spustiť, presne ako prihlasovacie údaje LLM.

Prihlasovacie údaje **Model Router** zdieľajú všetko, na čo smerujú. Ľudia, s ktorými ich zdieľate, môžu spúšťať požiadavky voči všetkým prihlasovacím údajom v jeho zozname možností a tieto požiadavky čerpajú Vaše kľúče. Nemôžu čítať kľúče a prihlasovacie údaje sa neobjavia v ich vlastnom zozname prihlasovacích údajov.

Ide o rovnaké oprávnenie ako priame zdieľanie prihlasovacích údajov OpenAI a je to to, čo robí router užitočným pre tím. Ak to nechcete, zdieľajte namiesto toho jednotlivé prihlasovacie údaje a nechajte každého, aby si vybral model.

## Zdieľanie s kolaborantmi na workflowe

Keď zdieľate workflow, kolaboranti ho môžu otvoriť a spustiť, ale nemôžu používať Vaše prihlasovacie údaje, pokiaľ im ich tiež nezdieľate. To platí pre prihlasovacie údaje v hlavnom workflowe a v akýchkoľvek pod-workflowoch, ktoré volá. Zdieľajte každé prihlasovacie údaje s tými istými používateľmi alebo tímami, ktoré ste pozvali do workflowu. Pod-workflowy musia byť tiež zdieľané samostatne z editora podriadeného workflowu. Pozrite si časť [Organizácia workflowov](./workflow-organization.md#sharing-workflows).

## Kontext spustenia

Keď sa workflow spustí, prihlasovacie údaje sa vyhodnotia pre **vlastníka workflowu** (alebo aktuálneho používateľa pri spustení). `get_credentials_context()` zlučuje:

1. **Vlastnené prihlasovacie údaje** – `Credential.owner_id == user_id`
2. **Používateľom zdieľané prihlasovacie údaje** – `CredentialShare`, kde `CredentialShare.user_id == user_id`
3. **Tímom zdieľané prihlasovacie údaje** – `CredentialTeamShare`, kde je používateľ členom tímu

Všetky sú zlúčené do jedného kontextového dict kľúčovaného podľa názvu prihlasovacích údajov.

## Použitie vo workflowoch
### Podľa názvu (Expression DSL)

Prihlasovacie údaje sú sprístupnené ako `$credentials.CredentialName` v [Expression DSL](./expression-dsl.md). Použite to pre:

- HTTP uzly (Bearer/Header autentifikácia)
- Telegram uzly
- Slack uzly
- Notion bearer tokeny v vlastných HTTP požiadavkách (interný token alebo OAuth access token)
- Akýkoľvek uzol, ktorý akceptuje výrazy pre autentifikáciu

```dsl
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

### Podľa ID (credentialId)

Niektoré uzly ukladajú `credentialId` (UUID) v `node.data`:

| Typ uzla | Pole | Popis |
|-----------|-------|-------------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md), Image Gen | `credentialId` | LLM API prihlasovacie údaje |
| [Codex](../nodes/codex-node.md) | `credentialId`, `githubCredentialId` | Codex access token prihlasovacie údaje a GitHub prihlasovacie údaje |
| [OpenCode Go](../nodes/opencode-go-node.md) | `credentialId`, `githubCredentialId` | OpenCode Go gateway prihlasovacie údaje a GitHub prihlasovacie údaje |
| [Jira](../nodes/jira-node.md) | `credentialId` | Jira Cloud email/API token alebo Data Center používateľské meno/heslo prihlasovacie údaje |
| [Notion](../nodes/notion-node.md) | `credentialId` | Notion interný token alebo OAuth workspace prihlasovacie údaje |
| [Sentry](../nodes/sentry-node.md) | `credentialId` | Sentry auth token a voliteľná základná URL |
| [Supabase](../nodes/supabase-node.md) | `credentialId` | Supabase projekt URL a API kľúč |
| [ClickHouse](../nodes/clickhouse-node.md) | `credentialId` | ClickHouse podrobnosti pripojenia (host, port, auth, databáza) |
| [Telegram Trigger](../nodes/telegram-trigger-node.md), [Telegram](../nodes/telegram-node.md) | `credentialId` | Telegram bot prihlasovacie údaje |
| [Discord Trigger](../nodes/discord-trigger-node.md), [Discord](../nodes/discord-node.md) | `credentialId` | Discord verejný kľúč alebo webhook prihlasovacie údaje |
| Vector Store | `credential_id` | Qdrant alebo Postgres (pgvector) vector DB, cez Qdrant, Psql alebo Custom Embeddings RAG prihlasovacie údaje |
| Evals | `credential_id`, `judge_credential_id` | Model prihlasovacie údaje; model alebo Decision Model prihlasovacie údaje pre LLM-as-Judge judge |
| [Playwright](../nodes/playwright-node.md) AI krok | `credentialId` | LLM/Vision model (pre AI krok a [Auto Heal](../nodes/playwright-node.md#ai-auto-heal)) |

Executor načíta prihlasovacie údaje priamo z databázy podľa ID a dešifruje konfiguráciu.

## Maskovanie výstupu

Po vykonaní `mask_sensitive_output()` maskuje hodnoty prihlasovacích údajov vo výstupoch, pričom zachová prvých sedem znakov každého tajomstva dlhšieho ako sedem znakov a zvyšok nahradí `**`, takže tajomstvá nie sú odhalené vo výsledkoch alebo spusteniach.

## Súvisiace

- [Prihlasovacie údaje Tab](../tabs/credentials-tab.md) – Pridajte a zdieľajte prihlasovacie údaje
- [Third-Party Integrations](./integrations.md) – Podrobné nastavenie pre každý typ prihlasovacích údajov
- [Teams](./teams.md) – Zdieľajte s tímami
- [Expression DSL](./expression-dsl.md) – `$credentials` syntax
- [Node Types](./node-types.md) – Uzly, ktoré používajú prihlasovacie údaje ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [Playwright](../nodes/playwright-node.md), [HTTP](../nodes/http-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md))
- [Agent Node](../nodes/agent-node.md) – Používa `credentialId` pre LLM
