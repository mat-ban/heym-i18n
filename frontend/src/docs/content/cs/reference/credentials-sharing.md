# Sdílení přihlašovacích údajů

Přihlašovací údaje lze sdílet s ostatními uživateli, aby jejich workflow mohly využívat Vaše API klíče. Přehled naleznete v části [Přihlašovací údaje](./credentials.md) a informace o přidávání a správě přihlašovacích údajů v části [Karta Přihlašovací údaje](../tabs/credentials-tab.md).

## Sdílení přihlašovacích údajů s LLM

Chcete-li umožnit LLM nebo AI agentovi používat API klíč, uložte klíč jako přihlašovací údaj a nechte uzel, který provádí požadavek, aby jej připojil. Model rozhoduje, co zavolat; uzel ověří volání při svém spuštění.

- **Uložte tajný údaj jako přihlašovací údaj.** Citlivé hodnoty jsou šifrovány v klidovém stavu a po vytvoření maskovány v UI.
- **Odkazujte na něj tam, kde se požadavek provádí.** Uzly [LLM](../nodes/llm-node.md) a [Agent](../nodes/agent-node.md) vybírají své přihlašovací údaje modelu podle ID a HTTP požadavky vkládají `$credentials.CredentialName` do autentizační hlavičky. Uchovávejte tajné údaje mimo pole prompt, protože vše v promptu je odesláno poskytovateli modelu jako text.
- **Dejte agentovi nástroje, ne klíče.** Když Agent volá HTTP uzel, MCP server nebo sub-workflow jako nástroj, přihlašovací údaj se použije uvnitř tohoto nástroje a model obdrží výsledek nástroje.
- **Výstupy jsou maskovány.** Když se hodnota přihlašovacího údaje delší než sedm znaků objeví ve výstupu uzlu, zachová se pouze jejích prvních sedm znaků, takže odpověď, která opakuje klíč, zobrazí ve výsledcích a spuštěních pouze tento prefix. Viz [Maskování výstupu](#output-masking).
- **Nechte asistenta vytvářet přihlašovací údaje.** Když [AI asistent](./ai-assistant.md#credentials) nebo karta Chat vytvoří přihlašovací údaj, vidí pouze název a typ a tajný údaj zadáte v běžném formuláři přihlašovacích údajů.
- **Sdílejte s lidmi stejným způsobem.** Sdílejte přihlašovací údaj s uživatelem nebo týmem, jak je popsáno níže, a jejich workflow budou moci používat Váš klíč prostřednictvím svých vlastních uzlů LLM a Agent.

## Model sdílení

- **CredentialShare** – Propojuje `credential_id` s `user_id` (jedinečné pro každou dvojici)
- **Sdílení podle e-mailu** – `POST /api/credentials/{credential_id}/shares` s e-mailem; uživatel je vyhledán a přidán
- **Odvolání** – `DELETE /api/credentials/{credential_id}/shares/{user_id}`

Přihlašovací údaje můžete také sdílet s [Týmy](./teams.md):

- **CredentialTeamShare** – Propojuje `credential_id` s `team_id`; všichni členové týmu získají přístup
- **Sdílení s týmem** – `POST /api/credentials/{credential_id}/team-shares` s `team_id`
- **Odvolání sdílení s týmem** – `DELETE /api/credentials/{credential_id}/team-shares/{team_id}`

Sdílené přihlašovací údaje zobrazují indikátor v UI [Karty Přihlašovací údaje](../tabs/credentials-tab.md).

## Přihlašovací údaje se širokým rozsahem

Sdílením přihlašovacího údaje udělujete příjemci vše, co tento přihlašovací údaj umožňuje. U většiny integrací je to omezeno na jeden workspace nebo oprávnění jednoho API klíče, ale některé přihlašovací údaje mají mnohem širší rozsah.

> **Přihlašovací údaje Google Drive udělují plný přístup k Disku.** Přihlašovací údaj [Google Drive](../nodes/google-drive-node.md) je autorizován s rozsahem `https://www.googleapis.com/auth/drive`, aby uzel mohl pracovat se soubory, které již vlastníte. Sdílením s uživatelem nebo týmem dáváte každému z nich možnost **číst, upravovat a trvale mazat cokoli na Vašem Google Disku** prostřednictvím workflow – nejen soubory, které jste měli na mysli. Sdílejte jej pouze s lidmi, kterým byste přímo udělili plný přístup k Disku.

Pokud potřebujete omezit expozici, vytvořte vyhrazený účet Google s přístupem pouze ke složkám, které workflow potřebuje, a propojte přihlašovací údaj s tímto účtem namísto svého primárního.

Přihlašovací údaj **Decision Model** obsahuje endpoint a, je-li nastaven, API klíč. Jeho sdílením umožňujete příjemci čerpat proti tomuto klíči z jakéhokoli workflow, které může spustit, přesně jako u přihlašovacího údaje LLM.

Přihlašovací údaj **Model Router** sdílí vše, na co směruje. Lidé, se kterými jej sdílíte, mohou spouštět požadavky proti všem přihlašovacím údajům v jeho seznamu možností a tyto požadavky čerpají Vaše klíče. Nemohou klíče číst a přihlašovací údaje se nezobrazují v jejich vlastním seznamu přihlašovacích údajů.

Jedná se o stejné oprávnění jako přímé sdílení přihlašovacího údaje OpenAI a je to to, co činí router užitečným pro tým. Pokud to nechcete, sdílejte jednotlivé přihlašovací údaje a nechte každého zvolit si model.

## Sdílení se spolupracovníky na workflow

Když sdílíte workflow, spolupracovníci jej mohou otevřít a spustit, ale nemohou používat Vaše přihlašovací údaje, pokud jim tyto přihlašovací údaje také nesdílíte. To platí pro přihlašovací údaje v hlavním workflow i v jakýchkoli sub-workflow, která volá. Sdílejte každý přihlašovací údaj se stejnými uživateli nebo týmy, které jste pozvali k workflow. Sub-workflow musí být také sdílena samostatně z editoru podřízeného workflow. Viz [Organizace workflow](./workflow-organization.md#sharing-workflows).

## Kontext spuštění

Když se workflow spustí, přihlašovací údaje se vyhodnocují pro **vlastníka workflow** (nebo aktuálního uživatele při spuštění). Funkce `get_credentials_context()` slučuje:

1. **Vlastněné přihlašovací údaje** – `Credential.owner_id == user_id`
2. **Přihlašovací údaje sdílené s uživatelem** – `CredentialShare`, kde `CredentialShare.user_id == user_id`
3. **Přihlašovací údaje sdílené s týmem** – `CredentialTeamShare`, kde je uživatel členem týmu

Vše je sloučeno do jediného kontextového slovníku klíčovaného podle názvu přihlašovacího údaje.

## Použití ve workflow
### Podle názvu (Expression DSL)

Přihlašovací údaje jsou v [Expression DSL](./expression-dsl.md) vystaveny jako `$credentials.CredentialName`. Použijte je pro:

- HTTP uzly (Bearer/Header autentizace)
- Telegram uzly
- Slack uzly
- Notion bearer tokeny ve vlastních HTTP požadavcích (interní token nebo OAuth access token)
- Jakýkoli uzel, který pro autentizaci přijímá výrazy

```dsl
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

### Podle ID (credentialId)

Některé uzly ukládají `credentialId` (UUID) do `node.data`:

| Typ uzlu | Pole | Popis |
|-----------|-------|-------------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md), Image Gen | `credentialId` | Přihlašovací údaje k LLM API |
| [Codex](../nodes/codex-node.md) | `credentialId`, `githubCredentialId` | Přihlašovací údaje k Codex access tokenu a přihlašovací údaje ke GitHubu |
| [OpenCode Go](../nodes/opencode-go-node.md) | `credentialId`, `githubCredentialId` | Přihlašovací údaje k bráně OpenCode Go a přihlašovací údaje ke GitHubu |
| [Jira](../nodes/jira-node.md) | `credentialId` | Přihlašovací údaje Jira Cloud email/API token nebo Data Center username/password |
| [Notion](../nodes/notion-node.md) | `credentialId` | Interní token Notion nebo přihlašovací údaje k OAuth workspace |
| [Sentry](../nodes/sentry-node.md) | `credentialId` | Autentizační token Sentry a volitelná základní URL |
| [Supabase](../nodes/supabase-node.md) | `credentialId` | URL projektu Supabase a API klíč |
| [ClickHouse](../nodes/clickhouse-node.md) | `credentialId` | Podrobnosti připojení k ClickHouse (host, port, autentizace, databáze) |
| [Telegram Trigger](../nodes/telegram-trigger-node.md), [Telegram](../nodes/telegram-node.md) | `credentialId` | Přihlašovací údaje k Telegram botovi |
| [Discord Trigger](../nodes/discord-trigger-node.md), [Discord](../nodes/discord-node.md) | `credentialId` | Veřejný klíč Discord nebo přihlašovací údaje k Webhooku |
| Vector Store | `credential_id` | Vektorová databáze Qdrant nebo Postgres (pgvector) prostřednictvím přihlašovacích údajů Qdrant, Psql nebo Custom Embeddings RAG |
| Evals | `credential_id`, `judge_credential_id` | Přihlašovací údaje k modelu; přihlašovací údaje k modelu nebo Decision Model pro LLM-as-Judge judge |
| [Playwright](../nodes/playwright-node.md) AI krok | `credentialId` | LLM/Vision model (pro AI krok a [Auto Heal](../nodes/playwright-node.md#ai-auto-heal)) |

Executor načte přihlašovací údaje přímo z databáze podle ID a dešifruje konfiguraci.

## Maskování výstupu

Po spuštění funkce `mask_sensitive_output()` maskuje hodnoty přihlašovacích údajů ve výstupech tak, že u každého tajného údaje delšího než sedm znaků zachová prvních sedm znaků a zbytek nahradí znaky `**`, aby tajné údaje nebyly odhaleny ve výsledcích ani v historii spuštění.

## Související

- [Záložka Přihlašovací údaje](../tabs/credentials-tab.md) – Přidání a sdílení přihlašovacích údajů
- [Integrace třetích stran](./integrations.md) – Podrobné nastavení pro každý typ přihlašovacích údajů
- [Týmy](./teams.md) – Sdílení s týmy
- [Expression DSL](./expression-dsl.md) – Syntaxe `$credentials`
- [Typy uzlů](./node-types.md) – Uzly, které používají přihlašovací údaje ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [Playwright](../nodes/playwright-node.md), [HTTP](../nodes/http-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md))
- [Uzel Agent](../nodes/agent-node.md) – Používá `credentialId` pro LLM
