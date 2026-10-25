# Akreditācijas dati

Akreditācijas dati glabā API atslēgas un noslēpumus, ko izmanto workflow mezgli. Tos pievienojat cilnē [Akreditācijas datu cilne](../tabs/credentials-tab.md) un atsaucaties uz tiem pēc nosaukuma mezgla konfigurācijā.

## Kas ir akreditācijas dati

- **Glabājas katram lietotājam atsevišķi** – Katri akreditācijas dati pieder lietotājam, un tos var [koplietot](./credentials-sharing.md) ar citiem lietotājiem vai [Teams](./teams.md).
- **Šifrēti miera stāvoklī** – Sensitīvās vērtības tiek šifrētas; pēc izveides lietotāja saskarne tās maskē.
- **Atsauces pēc nosaukuma** – Mezgli izvēlas akreditācijas datus pēc nosaukuma (vai ID). Izpildes dzinējs izpildes laikā atrisina akreditācijas datus workflow īpašniekam.

## Kā mezgli tos izmanto

| Mezgla tips | Tipiskie akreditācijas dati | Mērķis |
|-----------|--------------------|---------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Novērtējumi](../tabs/evals-tab.md) | OpenAI, Google, Custom | API atslēga modelim |
| [Decision](../nodes/decision-node.md), [Novērtējumi](../tabs/evals-tab.md) tiesnesis | Decision Model | Decision model endpoint bāzes URL, kā arī neobligāta API atslēga |
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | Model Router (Auto Model) | Izvēlas, kurš no Jūsu modeļiem apkalpo katru pieprasījumu, izmantojot decision model |
| [Codex](../nodes/codex-node.md) | OpenAI Codex + GitHub | ChatGPT abonementa pierakstīšanās (OAuth) vai Codex piekļuves token runner, kā arī GitHub PAT repozitoriju darbībām |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go + GitHub | OpenCode Go gateway API atslēga (neobligāts bāzes URL) runner, kā arī GitHub PAT repozitoriju darbībām |
| [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md) | GitHub | GitHub personīgās piekļuves token (PAT) GitHub API izsaukumiem, GitHub mezgla darbībām un MCP integrācijām |
| [Jira](../nodes/jira-node.md) | Jira | Cloud e-pasts/API token, Data Center lietotājvārds/parole vai personīgās piekļuves tokens, Jira vietnes bāzes URL, izvietošanas režīms un neobligāta REST API versija |
| [Linear](../nodes/linear-node.md) | Linear | Personīgā API atslēga vai OAuth2 komandām, projektiem, uzdevumiem un komentāriem |
| [HTTP](../nodes/http-node.md) | Bearer, Header | Autentifikācija pieprasījumiem |
| [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram | Bot token un neobligāts webhook noslēpums |
| [Discord](../nodes/discord-node.md) | Discord | Ienākošā webhook URL |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord Trigger (Public Key) | Lietotnes publiskā atslēga paraksta verifikācijai |
| [RAG](../nodes/rag-node.md) | RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, RAG: Custom Embeddings | Vektoru krātuves savienojums (ārējais Qdrant vai Heym paša Postgres ar pgvector), ar OpenAI vai jebkuru OpenAI saderīgu embedding endpoint |
| [Slack](../nodes/slack-node.md) | Slack | Webhook vai API token |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP | Ienākošās pastkastes savienojums |
| [Send Email](../nodes/send-email-node.md) | SMTP | Pasta serveris |
| [Redis](../nodes/redis-node.md) | Redis | Savienojums |
| [Grist](../nodes/grist-node.md) | Grist | API atslēga + servera URL |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets (OAuth2) | Client ID + Client Secret + OAuth2 piekrišana |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive (OAuth2) | Client ID + Client Secret + OAuth2 piekrišana |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery (OAuth2) | Client ID + Client Secret + OAuth2 piekrišana |
| [Supabase](../nodes/supabase-node.md) | Supabase | Projekta URL + API atslēga (+ neobligāta noklusējuma shēma) |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse | Host + port + lietotājvārds/parole + datubāze (+ secure) |
| [Notion](../nodes/notion-node.md) | Notion | Iekšējās integrācijas token vai publiskās integrācijas Client ID + Client Secret + OAuth piekrišana |
| [Sentry](../nodes/sentry-node.md) | Sentry | Auth token un neobligāts pašmitinātā bāzes URL |
| [Amazon S3](../nodes/amazon-s3-node.md) | Amazon S3 | Piekļuves atslēga, slepenā atslēga, reģions |
| [RabbitMQ](../nodes/rabbitmq-node.md) | RabbitMQ | AMQP URL |

Detalizētai iestatīšanai (hosti, porti, pakalpojumu sniedzēja specifiskie lauki) skatiet [Trešo pušu integrācijas](./integrations.md). Tas ietver Telegram bota iestatīšanu, ienākošo e-pastu caur IMAP un izejošo e-pastu caur SMTP.

GitHub akreditācijas dati var arī ietvert neobligātu `base_url`, ja mērķējat uz GitHub
Enterprise Server, nevis GitHub.com. Rediģējot GitHub akreditācijas datus, lai nomainītu token,
atstājot `base_url` tukšu, tiek saglabāts esošais Enterprise endpoint. Ievadiet jaunu URL tikai tad,
kad vēlaties mainīt šo endpoint.

Jira, Linear, Supabase, Notion, Sentry un ClickHouse akreditācijas dati akreditācijas datu dialogā piedāvā **Test Connection**. Jira gadījumā pārbaude izsauc Jira pašreizējā lietotāja endpoint. Linear gadījumā
pārbaude izsauc Linear API ar `getViewer` un apstiprina, ka API atslēga vai OAuth token ir derīgs.
Rediģēšanas laikā varat veikt pārbaudi, atkārtoti neievadot API atslēgu, ja saglabātais noslēpums joprojām pastāv. Notion gadījumā
dialogā izvēlieties **Internal token** vai **OAuth**; OAuth izmanto Client ID un Client Secret
no Jūsu Notion publiskās integrācijas. Notion iestatīšanas detaļas skatiet [Trešo pušu integrācijas](./integrations.md#notion).
## Kodēšanas pakotnes lietojums

Cilne **AI Defaults** sadaļā [Iestatījumi](./user-settings.md) parāda atlikušo kodēšanas pakotnes lietojumu Jūsu Codex akreditācijas datiem (īpašumā esošajiem un koplietotajiem). Katram Codex akreditācijas datu ierakstam tā attēlo horizontālu joslu katram aktīvajam ātruma ierobežojuma logam — parasti **5 stundu** un/vai **Nedēļas** logs atkarībā no Jūsu plāna — ar atlikušo kvotas procentu un atiestatīšanas atskaiti. Dati nāk no Codex aizmugursistēmas ātruma ierobežojuma atbildes galvenēm, kas tiek iegūtas pēc pieprasījuma.

OpenCode Go akreditācijas dati arī tiek uzskaitīti tur, bet atzīmēti kā **"lietojums nav pieejams"**: OpenCode zen vārteja neatklāj atlikušās kvotas datus, tāpēc joslu nevar parādīt.

## Izteiksmēs

Daži mezgli atļauj izteiksmes autentifikācijai. Izmantojiet [Expression DSL](./expression-dsl.md) ar `$credentials.CredentialName`, lai izteiksmē atsauktos uz akreditācijas datu atrisināto noslēpumu. Lai uzzinātu, kāda galvenes rinda katram akreditācijas datu tipam nepieciešama HTTP pieprasījumā, skatiet [HTTP › Autentifikācija ar akreditācijas datiem](../nodes/http-node.md#authenticating-with-credentials).

Codex akreditācijas dati apzināti ir izslēgti no `$credentials`. Neatkarīgi no tā, vai pierakstāties ar ChatGPT (abonements, bez API izmaksām par tokenu) vai ielīmējat Codex `access_token`, tokeni tiek nodoti tikai vietējam Codex izpildes procesam. ChatGPT pierakstīšanās tokeni tiek automātiski atjaunoti, kad tie noveco.

Jira akreditācijas dati arī ir izslēgti no `$credentials`. [Jira mezgls](../nodes/jira-node.md) ielādē akreditācijas datus pēc `credentialId` izpildes laikā. Pielāgotiem Jira REST izsaukumiem, ko Jira mezgls neaptver, izmantojiet [HTTP mezglu](../nodes/http-node.md) ar Jira Basic Auth (`email:api_token` Jira Cloud vai `username:password` Data Center / Server), piemēram, `curl -u you@example.com:YOUR_API_TOKEN https://your-domain.atlassian.net/rest/api/3/myself`. Varat arī izmantot [Header](../nodes/http-node.md) akreditācijas datus ar `Authorization: Basic <base64(user:secret)>`. Jira Data Center / Server personīgās piekļuves tokeniem tā vietā nosūtiet `Authorization: Bearer <token>`; pati Jira akreditācijas datu vienība to atbalsta, izmantojot tās **Personal Access Token** autentifikācijas režīmu.

| Akreditācijas datu tips | Vērtība, kas pieejama `$credentials.Name` |
|-----------------|--------------------------------------|
| Bearer | Bearer tokena virkne |
| Header | Pilna `header key: header value` rinda, gatava ievietošanai cURL `-H` argumentā |
| GitHub | Personīgās piekļuves tokens |
| Notion | Iekšējais `api_token` vai OAuth `access_token` (Bearer tokens Notion API izsaukumiem) |
| Sentry | Sentry autentifikācijas tokens |
| Discord / Slack | Webhook URL |

Piemērs:

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Izmantojiet Notion **mezglu** vietējām datubāzes, lapas un bloka operācijām. Izmantojiet `$credentials`, kad pielāgotam [HTTP](../nodes/http-node.md) pieprasījumam nepieciešams tas pats Notion bearer tokens.

## Akreditācijas datu izveide no Chat

[AI Assistant](./ai-assistant.md#credentials), [Chat cilne](../tabs/chat-tab.md) un [Chat with Heym](./chat-with-heym.md) var izveidot akreditācijas datus, kad workflow tiem nepieciešami, vai ikreiz, kad Jūs tos pieprasāt. Asistents ierosina tipu un nosaukumu, un parastā akreditācijas datu forma tiek atvērta sarunā. Lūdziet atjaunināt Jūsu īpašumā esošos akreditācijas datus, un tā pati forma tiek atvērta tiem, ar to noslēpumiem maskētiem. Asistents redz tikai nosaukumu un tipu. `heym_chat` caur [MCP](../tabs/mcp-tab.md) nevar izveidot, atjaunināt vai izvēlēties akreditācijas datus.

## Saistītie

- [Akreditācijas datu cilne](../tabs/credentials-tab.md) – Pievienot, rediģēt, dzēst akreditācijas datus
- [GitHub mezgls](../nodes/github-node.md) – Vietējās GitHub REST operācijas
- [Jira mezgls](../nodes/jira-node.md) – Jira projekta, problēmas, komentāra, pielikuma, lietotāja, paziņojuma un pārejas automatizācija
- [Linear mezgls](../nodes/linear-node.md) – Linear GraphQL darbvietas un problēmu automatizācija
- [Notion mezgls](../nodes/notion-node.md) – Notion satura meklēšana un pārvaldība
- [Sentry mezgls](../nodes/sentry-node.md) – Sentry organizācijas, projekta, komandas, problēmas, notikuma un laidiena automatizācija
- [Akreditācijas datu koplietošana](./credentials-sharing.md) – Koplietot ar lietotājiem un komandām
- [Trešo pušu integrācijas](./integrations.md) – Iestatīšanas ceļvedis katram akreditācijas datu tipam
- [Expression DSL](./expression-dsl.md) – `$credentials` izteiksmēs

## Model Router (Auto Model)

Model Router nesatur atslēgu. Tas satur **lēmumu modeļa akreditācijas datus**, **modeļa opciju** sarakstu — katra ir esoši OpenAI, Google vai Custom akreditācijas dati plus modelis — un katrai opcijai brīvu tekstu, kas norāda, kad šī opcija ir jāizmanto.

Tas parādās katrā atlasītājā, kas piedāvā modeli: [LLM](../nodes/llm-node.md) un [Agent](../nodes/agent-node.md) mezglos, Chat, AI Defaults, Dashboards, izteiksmju veidotājā un Datu tabulās. Tā vienīgais modelis ir **Auto**. Izvēlieties to, un lēmumu modelis nolasa katru pieprasījumu un maršrutē to. [Evals](../tabs/evals-tab.md) to izlaiž, jo eval salīdzina konkrētus modeļus, bet router izvēlas pats.

Agent pārmaršrutē, virzoties tā rīku cilpai, tāpēc lēts modelis var uzņemties sākuma gājienus, bet spēcīgāks — gājienu, kur tas nepieciešams. Identiski ievadi atkārtoti izmanto iepriekšējo lēmumu, tāpēc cilpa maksā par lēmumu tikai tad, kad saruna faktiski ir virzījusies.

### Ko tas nevar darīt

Auto Model nevar apvienot ar **Responses API**, **Batch mode** vai **image output**. Šie pārslēgi paši sevi atspējo, kad ir izvēlēts router, un katrs norāda iemeslu. Guardrail pārbaudes un cilvēka pārskatīšanas politikas klasifikators ir fiksēti viena modeļa izsaukumi un nekad nemaršrutē.
### Kad maršrutēšana neizdodas

Atzīmējiet vienu opciju **Use this option when routing fails**, un lēmumu modeļa dīkstāve nekad
neaptur izpildi; tiek izmantota rezerves opcija, un iemesls tiek reģistrēts izpildē. Bez tās
mezgls neizdodas, nevis min.

### Pieprasījuma maršruta redzēšana

Izpildes rāda `Auto Model / GPT-5`, nevis tikai modeli, un izmaksas paliek attiecinātas
uz modeli, kas faktiski darbojās. Kanvas Execution Log un Span View rāda to pašu pāri,
un Span View uzskaita, kurš pagrieziens kurp devās.
