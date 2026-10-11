# Prihlasovacie údaje

Prihlasovacie údaje ukladajú API kľúče a tajné hodnoty používané uzlami workflowu. Pridávate ich na karte [Prihlasovacie údaje](../tabs/credentials-tab.md) a v konfigurácii uzla na ne odkazujete podľa názvu.

## Čo sú prihlasovacie údaje

- **Uložené pre každého používateľa** – Každé prihlasovacie údaje patria používateľovi a môžu byť [zdieľané](./credentials-sharing.md) s inými používateľmi alebo [Tímami](./teams.md).
- **Šifrované v pokoji** – Citlivé hodnoty sú šifrované; rozhranie ich po vytvorení maskuje.
- **Odkazované podľa názvu** – Uzly vyberajú prihlasovacie údaje podľa názvu (alebo ID). Vykonávací engine pri spustení vyhradí prihlasovacie údaje pre vlastníka workflowu.

## Ako ich uzly používajú

| Typ uzla | Typické prihlasovacie údaje | Účel |
|-----------|--------------------|---------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Evals](../tabs/evals-tab.md) | OpenAI, Google, Custom | API kľúč pre model |
| [Decision](../nodes/decision-node.md), [Evals](../tabs/evals-tab.md) judge | Decision Model | Základná URL adresa endpointu rozhodovacieho modelu plus voliteľný API kľúč |
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | Model Router (Auto Model) | Vyberá, ktorý z Vašich modelov obsluhuje každú požiadavku, pomocou rozhodovacieho modelu |
| [Codex](../nodes/codex-node.md) | OpenAI Codex + GitHub | Prihlásenie cez predplatné ChatGPT (OAuth) alebo prístupový token Codex pre runner plus GitHub PAT pre operácie s repozitárom |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go + GitHub | API kľúč brány OpenCode Go (voliteľná základná URL adresa) pre runner plus GitHub PAT pre operácie s repozitárom |
| [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md) | GitHub | GitHub personal access token (PAT) pre volania GitHub API, operácie uzla GitHub a integrácie MCP |
| [Jira](../nodes/jira-node.md) | Jira | Cloud email/API token alebo Data Center používateľské meno/heslo, základná URL adresa lokality Jira, režim nasadenia a voliteľná verzia REST API |
| [Linear](../nodes/linear-node.md) | Linear | Osobný API kľúč alebo OAuth2 pre tímy, projekty, úlohy a komentáre |
| [HTTP](../nodes/http-node.md) | Bearer, Header | Autentifikácia pre požiadavky |
| [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram | Token bota a voliteľné tajné hodnoty webhooku |
| [Discord](../nodes/discord-node.md) | Discord | URL adresa prichádzajúceho webhooku |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord Trigger (Public Key) | Verejný kľúč aplikácie na overenie podpisu |
| [RAG](../nodes/rag-node.md) | RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, RAG: Custom Embeddings | Pripojenie k vektorovému úložisku (externý Qdrant alebo vlastný Postgres Heym cez pgvector) s OpenAI alebo akýmkoľvek embeddingovým endpointom kompatibilným s OpenAI |
| [Slack](../nodes/slack-node.md) | Slack | Webhook alebo API token |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP | Pripojenie k prichádzajúcej poštovej schránke |
| [Send Email](../nodes/send-email-node.md) | SMTP | Poštový server |
| [Redis](../nodes/redis-node.md) | Redis | Pripojenie |
| [Grist](../nodes/grist-node.md) | Grist | API kľúč + URL adresa servera |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets (OAuth2) | Client ID + Client Secret + súhlas OAuth2 |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive (OAuth2) | Client ID + Client Secret + súhlas OAuth2 |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery (OAuth2) | Client ID + Client Secret + súhlas OAuth2 |
| [Supabase](../nodes/supabase-node.md) | Supabase | URL adresa projektu + API kľúč (+ voliteľná predvolená schéma) |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse | Hostiteľ + port + používateľské meno/heslo + databáza (+ secure) |
| [Notion](../nodes/notion-node.md) | Notion | Interný integračný token alebo verejná integrácia Client ID + Client Secret + súhlas OAuth |
| [Sentry](../nodes/sentry-node.md) | Sentry | Autentifikačný token plus voliteľná základná URL adresa vlastného hostingu |
| [Amazon S3](../nodes/amazon-s3-node.md) | Amazon S3 | Prístupový kľúč, tajný kľúč, región |
| [RabbitMQ](../nodes/rabbitmq-node.md) | RabbitMQ | AMQP URL adresa |

Podrobné nastavenie (hostitelia, porty, polia špecifické pre poskytovateľa) nájdete v časti [Third-Party Integrations](./integrations.md). Zahŕňa nastavenie bota Telegram, prichádzajúcu poštu cez IMAP a odchádzajúcu poštu cez SMTP.

Prihlasovacie údaje GitHub môžu tiež obsahovať voliteľný parameter `base_url`, ak cielite na GitHub
Enterprise Server namiesto GitHub.com. Ak upravujete prihlasovacie údaje GitHub za účelom rotácie tokenu,
ponechanie prázdneho poľa `base_url` zachová existujúci endpoint Enterprise. Novú URL adresu zadajte len vtedy,
keď chcete tento endpoint zmeniť.

Prihlasovacie údaje Jira, Linear, Supabase, Notion, Sentry a ClickHouse zobrazujú v dialógovom okne prihlasovacích údajov možnosť **Test Connection**. V prípade Jira kontrola volá endpoint aktuálneho používateľa Jira. V prípade Linear
kontrola volá Linear API pomocou `getViewer` a potvrdzuje platnosť API kľúča alebo OAuth tokenu.
Pri úprave môžete testovať bez opätovného zadania API kľúča, ak je uložená tajná hodnota stále prítomná. V prípade Notion
v dialógovom okne zvoľte **Internal token** alebo **OAuth**; OAuth používa Client ID a Client Secret
z Vašej verejnej integrácie Notion. Podrobnosti nastavenia Notion nájdete v časti [Third-Party Integrations](./integrations.md#notion).
## Využitie programovacieho balíka

Karta **AI Defaults** v [Nastaveniach](./user-settings.md) zobrazuje zostávajúce využitie programovacieho balíka pre Vaše Codex prihlasovacie údaje (vlastnené a zdieľané). Pre každé Codex prihlasovacie údaje vykresľuje horizontálny pruh pre každé aktívne okno limitu rýchlosti — typicky okno **5 hodín** a/alebo **Týždenné**, v závislosti od Vášho plánu — s percentom zostávajúcej kvóty a odpočtom do resetovania. Údaje pochádzajú z hlavičiek odpovede limitu rýchlosti backendu Codex, načítavaných na požiadanie.

Prihlasovacie údaje OpenCode Go sú tam tiež uvedené, ale označené ako **„využitie nedostupné"**: brána OpenCode zen nezverejňuje údaje o zostávajúcej kvóte, takže nie je možné zobraziť žiadny pruh.

## Vo výrazoch

Niektoré uzly povoľujú výrazy pre autentifikáciu. Použite [Expression DSL](./expression-dsl.md) s `$credentials.CredentialName` na odkazovanie na rozlíšené tajomstvo prihlasovacích údajov v rámci výrazu. Pre riadok hlavičky, ktorý každý typ prihlasovacích údajov potrebuje v HTTP požiadavke, pozrite [HTTP › Autentifikácia pomocou prihlasovacích údajov](../nodes/http-node.md#authenticating-with-credentials).

Codex prihlasovacie údaje sú zámerne vylúčené z `$credentials`. Či už sa prihlásite cez ChatGPT (predplatné, žiadne náklady na API za token) alebo vložíte Codex `access_token`, tokeny sa odovzdávajú iba lokálnemu procesu spúšťača Codex. Tokeny na prihlásenie cez ChatGPT sa automaticky obnovujú, keď vypršia.

Jira prihlasovacie údaje sú tiež vylúčené z `$credentials`. [Jira uzol](../nodes/jira-node.md) načíta prihlasovacie údaje podľa `credentialId` v čase spustenia. Pre vlastné Jira REST volania, ktoré Jira uzol nepokrýva, použite [HTTP uzol](../nodes/http-node.md) s Jira Basic Auth (`email:api_token` pre Jira Cloud alebo `username:password` pre Data Center / Server), napríklad `curl -u you@example.com:YOUR_API_TOKEN https://your-domain.atlassian.net/rest/api/3/myself`. Môžete tiež použiť [Header](../nodes/http-node.md) prihlasovacie údaje s `Authorization: Basic <base64(user:secret)>`. Osobné prístupové tokeny Jira Data Center / Server a Bearer autentifikácia zatiaľ nie sú Jira prihlasovacími údajmi podporované.

| Typ prihlasovacích údajov | Hodnota sprístupnená pre `$credentials.Name` |
|-----------------|--------------------------------------|
| Bearer | Reťazec Bearer tokenu |
| Header | Kompletný riadok `header key: header value`, pripravený na vloženie do argumentu `-H` v cURL |
| GitHub | Osobný prístupový token |
| Notion | Interný `api_token` alebo OAuth `access_token` (Bearer token pre Notion API volania) |
| Sentry | Sentry autentifikačný token |
| Discord / Slack | Webhook URL |

Príklad:

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Pre natívne operácie s databázou, stránkami a blokmi použite Notion **uzol**. Použite `$credentials`, keď vlastná [HTTP](../nodes/http-node.md) požiadavka potrebuje rovnaký Notion bearer token.

## Vytváranie prihlasovacích údajov z Chatu

[AI asistent](./ai-assistant.md#credentials), [karta Chat](../tabs/chat-tab.md) a [Chat s Heym](./chat-with-heym.md) dokážu vytvoriť prihlasovacie údaje, keď ich workflow potrebuje, alebo kedykoľvek o ne požiadate. Asistent navrhne typ a názov a v konverzácii sa otvorí bežný formulár prihlasovacích údajov. Požiadajte o aktualizáciu prihlasovacích údajov, ktoré vlastníte, a ten istý formulár sa otvorí na nich, s ich tajomstvami maskovanými. Asistent vidí iba názov a typ. `heym_chat` cez [MCP](../tabs/mcp-tab.md) nedokáže vytvárať, aktualizovať ani vyberať prihlasovacie údaje.

## Súvisiace

- [Karta Prihlasovacie údaje](../tabs/credentials-tab.md) – Pridávanie, úprava, mazanie prihlasovacích údajov
- [GitHub uzol](../nodes/github-node.md) – Natívne GitHub REST operácie
- [Jira uzol](../nodes/jira-node.md) – Automatizácia Jira projektov, úloh, komentárov, príloh, používateľov, oznámení a prechodov
- [Linear uzol](../nodes/linear-node.md) – Automatizácia Linear GraphQL pracovného priestoru a úloh
- [Notion uzol](../nodes/notion-node.md) – Vyhľadávanie a správa obsahu Notion
- [Sentry uzol](../nodes/sentry-node.md) – Automatizácia Sentry organizácií, projektov, tímov, úloh, udalostí a vydaní
- [Zdieľanie prihlasovacích údajov](./credentials-sharing.md) – Zdieľanie s používateľmi a tímami
- [Integrácie tretích strán](./integrations.md) – Sprievodca nastavením pre každý typ prihlasovacích údajov
- [Expression DSL](./expression-dsl.md) – `$credentials` vo výrazoch

## Model Router (Auto Model)

Model Router neobsahuje žiadny kľúč. Obsahuje **prihlasovacie údaje rozhodovacieho modelu**, zoznam **možností modelov** — každú tvoria existujúce OpenAI, Google alebo Custom prihlasovacie údaje plus model — a pre každú možnosť voľný text hovoriaci, kedy sa má táto možnosť použiť.

Zobrazuje sa v každom výbere, ktorý ponúka model: v uzloch [LLM](../nodes/llm-node.md) a [Agent](../nodes/agent-node.md), v Chate, AI Defaults, Dashboardoch, v tvorcovi výrazov a v Dátových tabuľkách. Jeho jediným modelom je **Auto**. Vyberte ho a rozhodovací model prečíta každú požiadavku a nasmeruje ju. [Evals](../tabs/evals-tab.md) ho vynechávajú, pretože eval porovnáva konkrétne modely a router si vyberá sám.

Agent presmerúva, ako napreduje jeho slučka nástrojov, takže lacný model môže prevziať skoršie ťahy a silnejší ten ťah, ktorý ho potrebuje. Identické vstupy opätovne použijú predchádzajúce rozhodnutie, takže slučka platí za rozhodnutie len vtedy, keď sa konverzácia skutočne posunula.

### Čo nedokáže

Auto Model nie je možné kombinovať s **Responses API**, **Batch mode** ani **image output**. Tieto prepínače sa pri výbere routera samy vypnú a každý uvádza prečo. Kontroly Guardrail a klasifikátor politiky ľudského posúdenia sú pevné volania jedného modelu a nikdy nesmerujú.
### Keď smerovanie zlyhá

Označte jednu možnosť **Použiť túto možnosť, keď smerovanie zlyhá** a výpadok rozhodovacieho modelu nikdy nezastaví spustenie; použije sa záložná možnosť a dôvod sa zaznamená pri spustení. Bez nej uzol zlyhá namiesto toho, aby hádal.

### Zobrazenie toho, kam požiadavka smerovala

Spustenia zobrazujú `Auto Model / GPT-5` namiesto samotného modelu a náklady zostávajú priradené modelu, ktorý skutočne bežal. Protokol spustenia na plátne a zobrazenie rozpätia zobrazujú rovnakú dvojicu a zobrazenie rozpätia uvádza, ktoré kolo kam smerovalo.
