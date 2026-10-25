# Přihlašovací údaje

Přihlašovací údaje ukládají API klíče a tajné hodnoty používané uzly workflow. Přidáváte je v [záložce Přihlašovací údaje](../tabs/credentials-tab.md) a odkazujete se na ně názvem v konfiguraci uzlu.

## Co jsou přihlašovací údaje

- **Uložené pro každého uživatele** – Každý přihlašovací údaj patří uživateli a lze jej [sdílet](./credentials-sharing.md) s dalšími uživateli nebo [týmy](./teams.md).
- **Šifrované v klidu** – Citlivé hodnoty jsou šifrovány; uživatelské rozhraní je po vytvoření maskuje.
- **Odkazované názvem** – Uzly vybírají přihlašovací údaj podle názvu (nebo ID). Vykonávací engine při spuštění vyhradí přihlašovací údaj pro vlastníka workflow.

## Jak je uzly používají

| Typ uzlu | Typický přihlašovací údaj | Účel |
|-----------|--------------------|---------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Evals](../tabs/evals-tab.md) | OpenAI, Google, Custom | API klíč pro model |
| [Decision](../nodes/decision-node.md), [Evals](../tabs/evals-tab.md) judge | Decision Model | Základní URL endpointu rozhodovacího modelu plus volitelný API klíč |
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | Model Router (Auto Model) | Vybírá, který z vašich modelů obslouží každý požadavek, pomocí rozhodovacího modelu |
| [Codex](../nodes/codex-node.md) | OpenAI Codex + GitHub | Přihlášení k předplatnému ChatGPT (OAuth) nebo přístupový token Codex pro runner plus GitHub PAT pro operace s repozitářem |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go + GitHub | API klíč brány OpenCode Go (volitelná základní URL) pro runner plus GitHub PAT pro operace s repozitářem |
| [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md) | GitHub | GitHub personal access token (PAT) pro volání GitHub API, operace uzlu GitHub a integrace MCP |
| [Jira](../nodes/jira-node.md) | Jira | Cloud email/API token, Data Center uživatelské jméno/heslo nebo osobní přístupový token, základní URL Jira site, režim nasazení a volitelná verze REST API |
| [Linear](../nodes/linear-node.md) | Linear | Osobní API klíč nebo OAuth2 pro týmy, projekty, úkoly a komentáře |
| [HTTP](../nodes/http-node.md) | Bearer, Header | Autentizace pro požadavky |
| [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram | Token bota a volitelné tajemství webhooku |
| [Discord](../nodes/discord-node.md) | Discord | URL příchozího webhooku |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord Trigger (Public Key) | Veřejný klíč aplikace pro ověření podpisu |
| [RAG](../nodes/rag-node.md) | RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, RAG: Custom Embeddings | Připojení k vektorovému úložišti (externí Qdrant nebo vlastní Postgres Heymu přes pgvector) s OpenAI nebo jakýmkoli endpointem pro embedding kompatibilním s OpenAI |
| [Slack](../nodes/slack-node.md) | Slack | Webhook nebo API token |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP | Připojení k příchozí poštovní schránce |
| [Send Email](../nodes/send-email-node.md) | SMTP | Poštovní server |
| [Redis](../nodes/redis-node.md) | Redis | Připojení |
| [Grist](../nodes/grist-node.md) | Grist | API klíč + URL serveru |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets (OAuth2) | Client ID + Client Secret + souhlas OAuth2 |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive (OAuth2) | Client ID + Client Secret + souhlas OAuth2 |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery (OAuth2) | Client ID + Client Secret + souhlas OAuth2 |
| [Supabase](../nodes/supabase-node.md) | Supabase | URL projektu + API klíč (+ volitelné výchozí schéma) |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse | Hostitel + port + uživatelské jméno/heslo + databáze (+ secure) |
| [Notion](../nodes/notion-node.md) | Notion | Token interní integrace nebo Client ID + Client Secret veřejné integrace + souhlas OAuth |
| [Sentry](../nodes/sentry-node.md) | Sentry | Autentizační token plus volitelná základní URL self-hosted instance |
| [Amazon S3](../nodes/amazon-s3-node.md) | Amazon S3 | Přístupový klíč, tajný klíč, region |
| [RabbitMQ](../nodes/rabbitmq-node.md) | RabbitMQ | URL AMQP |

Podrobné nastavení (hostitelé, porty, pole specifická pro poskytovatele) najdete v části [Integrace třetích stran](./integrations.md). Ta zahrnuje nastavení Telegram bota, příchozí e-mail přes IMAP a odchozí e-mail přes SMTP.

Přihlašovací údaje GitHub mohou také obsahovat volitelný `base_url`, pokud cílíte na GitHub
Enterprise Server místo GitHub.com. Když upravujete přihlašovací údaj GitHub za účelem rotace tokenu,
ponechání `base_url` prázdné zachová stávající endpoint Enterprise. Novou URL zadejte pouze tehdy,
když chcete tento endpoint změnit.

Přihlašovací údaje Jira, Linear, Supabase, Notion, Sentry a ClickHouse zobrazují v dialogu přihlašovacích údajů **Test Connection**. U Jiry kontrola volá aktuální endpoint uživatele Jira. U Linear
kontrola volá Linear API s `getViewer` a potvrzuje, že API klíč nebo OAuth token je platný.
Při úpravách můžete testovat bez opětovného zadání API klíče, pokud je uložené tajemství stále přítomno. U Notion
v dialogu zvolte **Internal token** nebo **OAuth**; OAuth používá Client ID a Client Secret
z vaší veřejné integrace Notion. Podrobnosti nastavení Notion najdete v části [Integrace třetích stran](./integrations.md#notion).
## Použití coding-package

Záložka **AI Defaults** v [Nastavení](./user-settings.md) zobrazuje zbývající využití coding-package pro vaše přihlašovací údaje Codex (vlastněné i sdílené). Pro každý přihlašovací údaj Codex vykresluje vodorovný pruh pro každé aktivní okno rate-limitu — obvykle okno **5 hours** a/nebo **Weekly** v závislosti na vašem plánu — s procentem zbývající kvóty a odpočtem do resetu. Data pocházejí z hlaviček odpovědi rate-limitu backendu Codex a načítají se na vyžádání.

Přihlašovací údaje OpenCode Go jsou zde uvedeny také, ale označené jako **„usage unavailable"**: brána OpenCode zen nezveřejňuje data o zbývající kvótě, takže nelze zobrazit žádný pruh.

## Ve výrazech

Některé uzly povolují výrazy pro autentizaci. Použijte [Expression DSL](./expression-dsl.md) s `$credentials.CredentialName` pro odkaz na rozřešené tajemství přihlašovacího údaje uvnitř výrazu. Pro řádek hlavičky, který každý typ přihlašovacího údaje vyžaduje v HTTP požadavku, viz [HTTP › Autentizace pomocí přihlašovacích údajů](../nodes/http-node.md#authenticating-with-credentials).

Přihlašovací údaje Codex jsou záměrně vyloučeny z `$credentials`. Ať už se přihlásíte přes ChatGPT (předplatné, žádné náklady na API za token), nebo vložíte Codex `access_token`, tokeny se předávají pouze lokálnímu procesu runneru Codex. Přihlašovací tokeny ChatGPT se automaticky obnovují, jak vyprší.

Přihlašovací údaje Jira jsou také vyloučeny z `$credentials`. [Uzel Jira](../nodes/jira-node.md) načítá přihlašovací údaj podle `credentialId` za běhu. Pro vlastní volání Jira REST, která uzel Jira nepokrývá, použijte [uzel HTTP](../nodes/http-node.md) s Jira Basic Auth (`email:api_token` pro Jira Cloud nebo `username:password` pro Data Center / Server), například `curl -u you@example.com:YOUR_API_TOKEN https://your-domain.atlassian.net/rest/api/3/myself`. Můžete také použít přihlašovací údaj [Header](../nodes/http-node.md) s `Authorization: Basic <base64(user:secret)>`. Pro osobní přístupové tokeny Jira Data Center / Server odešlete místo toho `Authorization: Bearer <token>`; samotný přihlašovací údaj Jira to podporuje prostřednictvím režimu ověřování **Personal Access Token**.

| Typ přihlašovacího údaje | Hodnota vystavená do `$credentials.Name` |
|-----------------|--------------------------------------|
| Bearer | Řetězec Bearer tokenu |
| Header | Kompletní řádek `header key: header value`, připravený k vložení do argumentu `-H` v cURL |
| GitHub | Osobní přístupový token |
| Notion | Interní `api_token` nebo OAuth `access_token` (Bearer token pro volání Notion API) |
| Sentry | Autentizační token Sentry |
| Discord / Slack | URL Webhooku |

Příklad:

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Pro nativní operace s databází, stránkami a bloky použijte **uzel** Notion. Použijte `$credentials`, když vlastní požadavek [HTTP](../nodes/http-node.md) potřebuje stejný bearer token Notion.

## Vytváření přihlašovacích údajů z chatu

[AI Assistant](./ai-assistant.md#credentials), [záložka Chat](../tabs/chat-tab.md) a [Chat s Heym](./chat-with-heym.md) mohou vytvořit přihlašovací údaj, když jej workflow potřebuje, nebo kdykoli o něj požádáte. Asistent navrhne typ a název a v konverzaci se otevře běžný formulář přihlašovacích údajů. Požádejte o aktualizaci přihlašovacího údaje, který vlastníte, a otevře se stejný formulář s maskovanými tajemstvími. Asistent vidí pouze název a typ. `heym_chat` přes [MCP](../tabs/mcp-tab.md) nemůže přihlašovací údaje vytvářet, aktualizovat ani vybírat.

## Související

- [Záložka Přihlašovací údaje](../tabs/credentials-tab.md) – Přidávání, úpravy, mazání přihlašovacích údajů
- [Uzel GitHub](../nodes/github-node.md) – Nativní operace GitHub REST
- [Uzel Jira](../nodes/jira-node.md) – Automatizace projektů, issue, komentářů, příloh, uživatelů, oznámení a přechodů Jira
- [Uzel Linear](../nodes/linear-node.md) – Automatizace pracovního prostoru a issue Linear GraphQL
- [Uzel Notion](../nodes/notion-node.md) – Vyhledávání a správa obsahu Notion
- [Uzel Sentry](../nodes/sentry-node.md) – Automatizace organizací, projektů, týmů, issue, událostí a vydání Sentry
- [Sdílení přihlašovacích údajů](./credentials-sharing.md) – Sdílení s uživateli a týmy
- [Integrace třetích stran](./integrations.md) – Průvodce nastavením pro každý typ přihlašovacího údaje
- [Expression DSL](./expression-dsl.md) – `$credentials` ve výrazech

## Model Router (Auto Model)

Model Router neobsahuje žádný klíč. Obsahuje **přihlašovací údaj rozhodovacího modelu**, seznam **možností modelů** — každou tvoří existující přihlašovací údaj OpenAI, Google nebo Custom plus model — a pro každou možnost volný text určující, kdy má být tato možnost použita.

Zobrazuje se v každém výběru, který nabízí model: uzly [LLM](../nodes/llm-node.md) a [Agent](../nodes/agent-node.md), Chat, AI Defaults, Dashboardy, tvůrce výrazů a Data Tables. Jeho jediným modelem je **Auto**. Vyberte jej a rozhodovací model přečte každý požadavek a nasměruje jej. [Evals](../tabs/evals-tab.md) jej vynechává, protože eval porovnává konkrétní modely a router si vybírá sám.

Agent přesměrovává, jak postupuje jeho smyčka nástrojů, takže levný model může převzít rané tahy a silnější ten tah, který jej potřebuje. Identické vstupy znovu použijí předchozí rozhodnutí, takže smyčka platí za rozhodnutí jen tehdy, když se konverzace skutečně posunula.

### Co nedokáže

Auto Model nelze kombinovat s **Responses API**, **Batch mode** ani **image output**. Tato přepínací tlačítka se při výběru routeru sama deaktivují a každé uvede důvod. Kontroly Guardrail a klasifikátor politiky lidského posouzení jsou pevná volání jednoho modelu a nikdy nesměrují.
### Když směrování selže

Označte jednu možnost **Použít tuto možnost, když směrování selže** a výpadek rozhodovacího modelu nikdy nezastaví běh; použije se záložní varianta a důvod se zaznamená do běhu. Bez ní uzel selže, místo aby hádal.

### Zobrazení, kam požadavek směřoval

Traces zobrazují `Auto Model / GPT-5` namísto samotného modelu a náklady zůstávají přiřazeny modelu, který skutečně běžel. Execution Log a Span View na plátně zobrazují stejnou dvojici a Span View uvádí, které kolo kam směřovalo.
