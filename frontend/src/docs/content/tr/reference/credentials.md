# Credentials

Credentials, workflow node'ları tarafından kullanılan API anahtarlarını ve secret'ları saklar. Bunları [Credentials Sekmesi](../tabs/credentials-tab.md) içinde ekleyin ve node yapılandırmasında adlarıyla referans verin.

## Credentials Nedir

- **Kullanıcı başına saklanır** – Her credential bir kullanıcıya aittir ve diğer kullanıcılarla veya [Teams](./teams.md) ile [paylaşılabilir](./credentials-sharing.md).
- **Bekleme durumunda şifrelenir** – Hassas değerler şifrelenir; arayüz oluşturulduktan sonra bunları maskeler.
- **Adıyla referans verilir** – Node'lar bir credential'ı adıyla (veya ID'siyle) seçer. Yürütme motoru, çalışma zamanında workflow sahibi için credential'ı çözer.

## Node'lar Bunları Nasıl Kullanır

| Node türü | Tipik credential | Amaç |
|-----------|--------------------|---------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Evals](../tabs/evals-tab.md) | OpenAI, Google, Custom | Model için API anahtarı |
| [Decision](../nodes/decision-node.md), [Evals](../tabs/evals-tab.md) judge | Decision Model | Bir decision model endpoint'inin base URL'si ve isteğe bağlı bir API anahtarı |
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | Model Router (Auto Model) | Bir decision model kullanarak her isteğe hangi modelinizin hizmet vereceğini seçer |
| [Codex](../nodes/codex-node.md) | OpenAI Codex + GitHub | Runner için ChatGPT abonelik oturum açma (OAuth) veya bir Codex access token'ı ve repository işlemleri için bir GitHub PAT |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go + GitHub | Runner için bir OpenCode Go gateway API anahtarı (isteğe bağlı base URL) ve repository işlemleri için bir GitHub PAT |
| [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md) | GitHub | GitHub API çağrıları, GitHub node işlemleri ve MCP entegrasyonları için GitHub personal access token (PAT) |
| [Jira](../nodes/jira-node.md) | Jira | Cloud email/API token, Data Center kullanıcı adı/parola veya personal access token, Jira site base URL'si, deployment modu ve isteğe bağlı REST API sürümü |
| [Linear](../nodes/linear-node.md) | Linear | Teams, projects, issues ve comments için Personal API key veya OAuth2 |
| [HTTP](../nodes/http-node.md) | Bearer, Header | İstekler için auth |
| [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram | Bot token ve isteğe bağlı webhook secret |
| [Discord](../nodes/discord-node.md) | Discord | Incoming webhook URL |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord Trigger (Public Key) | İmza doğrulaması için application public key |
| [RAG](../nodes/rag-node.md) | RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, RAG: Custom Embeddings | Vector store bağlantısı (harici Qdrant veya pgvector aracılığıyla Heym'in kendi Postgres'i), OpenAI veya herhangi bir OpenAI uyumlu embedding endpoint'i ile |
| [Slack](../nodes/slack-node.md) | Slack | Webhook veya API token |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP | Gelen mailbox bağlantısı |
| [Send Email](../nodes/send-email-node.md) | SMTP | Mail sunucusu |
| [Redis](../nodes/redis-node.md) | Redis | Bağlantı |
| [Grist](../nodes/grist-node.md) | Grist | API key + server URL |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets (OAuth2) | Client ID + Client Secret + OAuth2 onayı |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive (OAuth2) | Client ID + Client Secret + OAuth2 onayı |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery (OAuth2) | Client ID + Client Secret + OAuth2 onayı |
| [Supabase](../nodes/supabase-node.md) | Supabase | Project URL + API key (+ isteğe bağlı varsayılan şema) |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse | Host + port + kullanıcı adı/parola + veritabanı (+ secure) |
| [Notion](../nodes/notion-node.md) | Notion | Internal integration token veya public integration Client ID + Client Secret + OAuth onayı |
| [Sentry](../nodes/sentry-node.md) | Sentry | Auth token ve isteğe bağlı self-hosted base URL |
| [Amazon S3](../nodes/amazon-s3-node.md) | Amazon S3 | Access key, secret key, region |
| [RabbitMQ](../nodes/rabbitmq-node.md) | RabbitMQ | AMQP URL |

Ayrıntılı kurulum için (host'lar, port'lar, sağlayıcıya özgü alanlar), bkz. [Third-Party Integrations](./integrations.md). Bu, Telegram bot kurulumunu, IMAP üzerinden gelen e-postayı ve SMTP üzerinden giden e-postayı içerir.

GitHub.com yerine GitHub Enterprise Server'ı hedefliyorsanız, GitHub credential'ları isteğe bağlı bir `base_url` de içerebilir. Token'ı döndürmek için bir GitHub credential'ını düzenlerken, `base_url` alanını boş bırakmak mevcut Enterprise endpoint'ini korur. Yeni bir URL'yi yalnızca o endpoint'i değiştirmek istediğinizde girin.

Jira, Linear, Supabase, Notion, Sentry ve ClickHouse credential'ları, credential iletişim kutusunda **Test Connection** seçeneğini sunar. Jira için kontrol, Jira'nın current user endpoint'ini çağırır. Linear için kontrol, Linear API'sini `getViewer` ile çağırır ve API key veya OAuth token'ının geçerli olduğunu doğrular. Düzenlerken, saklanan secret hâlâ mevcutsa API key'i yeniden girmeden test edebilirsiniz. Notion için, iletişim kutusunda **Internal token** veya **OAuth** seçin; OAuth, Notion public integration'ınızdan Client ID ve Client Secret'ı kullanır. Notion kurulum ayrıntıları için bkz. [Third-Party Integrations](./integrations.md#notion).

## Coding-package kullanımı

[Settings](./user-settings.md) içindeki **AI Defaults** sekmesi, Codex kimlik bilgileriniz (sahip olunan ve paylaşılan) için kalan coding-package kullanımını gösterir. Her Codex kimlik bilgisi için, etkin her rate-limit penceresi başına — planınıza bağlı olarak genellikle bir **5 saat** ve/veya **Haftalık** pencere — kalan kotanın yüzdesi ve sıfırlama geri sayımıyla birlikte yatay bir çubuk görüntüler. Veriler, Codex backend'inin rate-limit yanıt header'larından talep üzerine alınır.

OpenCode Go kimlik bilgileri de burada listelenir, ancak **"kullanım mevcut değil"** olarak işaretlenir: OpenCode zen gateway kalan kota verisini sunmaz, bu nedenle hiçbir çubuk gösterilemez.

## Expressions içinde

Bazı node'lar auth için expression'lara izin verir. Bir expression içinde bir kimlik bilgisinin çözümlenmiş secret'ına başvurmak için `$credentials.CredentialName` ile [Expression DSL](./expression-dsl.md) kullanın. Bir HTTP isteğinde her kimlik bilgisi türünün ihtiyaç duyduğu header satırı için [HTTP › Authenticating with Credentials](../nodes/http-node.md#authenticating-with-credentials) bölümüne bakın.

Codex kimlik bilgileri kasıtlı olarak `$credentials` dışında tutulmuştur. ChatGPT ile (abonelik, token başına API maliyeti yok) oturum açsanız da bir Codex `access_token` yapıştırsanız da, token'lar yalnızca yerel Codex runner sürecine iletilir. ChatGPT oturum açma token'ları süresi doldukça otomatik olarak yenilenir.

Jira kimlik bilgileri de `$credentials` dışında tutulmuştur. [Jira node](../nodes/jira-node.md), kimlik bilgisini çalışma zamanında `credentialId` ile yükler. Jira node'unun kapsamadığı özel Jira REST çağrıları için, Jira Basic Auth (`Jira Cloud` için `email:api_token` veya Data Center / Server için `username:password`) ile [HTTP node](../nodes/http-node.md) kullanın, örneğin `curl -u you@example.com:YOUR_API_TOKEN https://your-domain.atlassian.net/rest/api/3/myself`. Ayrıca `Authorization: Basic <base64(user:secret)>` ile bir [Header](../nodes/http-node.md) kimlik bilgisi kullanabilirsiniz. Jira Data Center / Server personal access token'ları için bunun yerine `Authorization: Bearer <token>` gönderin; Jira kimlik bilgisinin kendisi bunu **Personal Access Token** kimlik doğrulama modu aracılığıyla destekler.

| Kimlik bilgisi türü | `$credentials.Name` için sunulan değer |
|-----------------|--------------------------------------|
| Bearer | Bearer token string |
| Header | Bir cURL `-H` argümanına doğrudan konulmaya hazır tam `header key: header value` satırı |
| GitHub | Personal access token |
| Notion | Dahili `api_token` veya OAuth `access_token` (Notion API çağrıları için Bearer token) |
| Sentry | Sentry auth token |
| Discord / Slack | Webhook URL |

Örnek:

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Yerel database, page ve block işlemleri için Notion **node**'unu kullanın. Özel bir [HTTP](../nodes/http-node.md) isteği aynı Notion bearer token'ına ihtiyaç duyduğunda `$credentials` kullanın.

## Chat'ten Kimlik Bilgisi Oluşturma

[AI Assistant](./ai-assistant.md#credentials), [Chat sekmesi](../tabs/chat-tab.md) ve [Chat with Heym](./chat-with-heym.md), bir workflow'un ihtiyaç duyduğunda veya siz istediğinizde bir kimlik bilgisi oluşturabilir. Asistan türü ve bir ad önerir ve olağan kimlik bilgisi formu konuşma içinde açılır. Sahip olduğunuz bir kimlik bilgisini güncellemeyi isteyin; aynı form, secret'ları maskelenmiş olarak onun üzerinde açılır. Asistan yalnızca adı ve türü görür. [MCP](../tabs/mcp-tab.md) üzerinden `heym_chat`, kimlik bilgisi oluşturamaz, güncelleyemez veya seçemez.

## İlgili

- [Credentials Sekmesi](../tabs/credentials-tab.md) – Kimlik bilgisi ekleyin, düzenleyin, silin
- [GitHub Node](../nodes/github-node.md) – Yerel GitHub REST işlemleri
- [Jira Node](../nodes/jira-node.md) – Jira proje, issue, comment, attachment, user, notification ve transition otomasyonu
- [Linear Node](../nodes/linear-node.md) – Linear GraphQL workspace ve issue otomasyonu
- [Notion Node](../nodes/notion-node.md) – Notion içeriğini arayın ve yönetin
- [Sentry Node](../nodes/sentry-node.md) – Sentry organization, project, team, issue, event ve release otomasyonu
- [Credentials Sharing](./credentials-sharing.md) – Kullanıcılar ve takımlarla paylaşın
- [Third-Party Integrations](./integrations.md) – Kimlik bilgisi türü başına kurulum kılavuzu
- [Expression DSL](./expression-dsl.md) – Expression'larda `$credentials`

## Model Router (Auto Model)

Bir Model Router hiçbir key tutmaz. Bir **decision model credential**, bir **model seçenekleri** listesi — her biri mevcut bir OpenAI, Google veya Custom kimlik bilgisi artı bir model — ve her seçenek için o seçeneğin ne zaman kullanılması gerektiğini belirten serbest metin tutar.

Model sunan her picker'da görünür: [LLM](../nodes/llm-node.md) ve [Agent](../nodes/agent-node.md) node'ları, Chat, AI Defaults, Dashboards, expression builder ve Data Tables. Tek modeli **Auto**'dur. Onu seçin, decision model her isteği okur ve yönlendirir. [Evals](../tabs/evals-tab.md) onu dışarıda bırakır, çünkü bir eval belirli modelleri karşılaştırır ve bir router kendi modelini seçer.

Bir agent, tool loop'u ilerledikçe yeniden yönlendirir, böylece ucuz bir model ilk turları, daha güçlü bir model ise ihtiyaç duyulan turu alabilir. Aynı girdiler önceki kararı yeniden kullanır, böylece bir loop yalnızca konuşma gerçekten ilerlediğinde bir karar için ödeme yapar.

### Yapamadıkları

Auto Model, **Responses API**, **Batch mode** veya **image output** ile birleştirilemez. Bir router seçildiğinde bu toggle'lar kendilerini devre dışı bırakır ve her biri nedenini belirtir. Guardrail kontrolleri ve human-review policy classifier sabit tek model çağrılarıdır ve hiçbir zaman yönlendirme yapmaz.

### Yönlendirme başarısız olduğunda

Bir seçeneği **Yönlendirme başarısız olduğunda bu seçeneği kullanın** olarak işaretleyin; böylece bir karar modeli kesintisi hiçbir zaman bir çalıştırmayı durdurmaz; fallback kullanılır ve gerekçe çalıştırmaya kaydedilir. Bu işaretleme olmadan, node tahmin yürütmek yerine başarısız olur.

### Bir isteğin nereye gittiğini görme

Traces, yalnızca modeli değil `Auto Model / GPT-5` şeklinde gösterir ve maliyet, gerçekte çalışan modelle ilişkilendirilmeye devam eder. Canvas Execution Log ve Span View aynı çifti gösterir ve Span View hangi turun nereye gittiğini listeler.
