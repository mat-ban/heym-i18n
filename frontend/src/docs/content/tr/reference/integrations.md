# Üçüncü Taraf Entegrasyonları

Heym, harici hizmetlere **credentials** aracılığıyla bağlanır. Her credential türü, bir hizmetin bağlantı ayrıntılarını saklar ve birden fazla düğüm ve workflow genelinde yeniden kullanılabilir. Genel bir bakış için [Credentials](./credentials.md) bölümüne bakın.

Credential'ları [Settings → Credentials](../tabs/credentials-tab.md) bölümünden ekleyin. Tüm değerler, depolama sırasında şifrelenir. Credential'lar diğer kullanıcılarla veya [Teams](./teams.md) ile [paylaşılabilir](./credentials-sharing.md).

Bazı entegrasyon düğümleri credential **gerektirmez**. [WebSocket Trigger](../nodes/websocket-trigger-node.md) ve [WebSocket Send](../nodes/websocket-send-node.md), doğrudan düğüm üzerinde yapılandırılan URL, header'lar ve subprotocol'ler kullanarak harici socket'lere bağlanır.

## Bir Bakışta Credential Türleri

| Tür | Kullanan | Anahtar Alanlar |
|------|---------|------------|
| **OpenAI** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md) | `api_key` |
| **OpenAI Codex** | [Codex](../nodes/codex-node.md) | `access_token` |
| **OpenCode Go** | [OpenCode Go](../nodes/opencode-go-node.md) | `api_key`, isteğe bağlı `base_url` |
| **Google** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key` |
| **GitHub** | [GitHub](../nodes/github-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) | `api_key`, isteğe bağlı `base_url` |
| **Jira** | [Jira düğümü](../nodes/jira-node.md) | `api_token`, `base_url`, `deployment`, `auth_mode`, `email` (yalnızca Basic auth), isteğe bağlı `api_version` |
| **Linear** | [Linear düğümü](../nodes/linear-node.md) | `api_key` veya `client_id` + `client_secret` OAuth2 |
| **Sentry** | [Sentry düğümü](../nodes/sentry-node.md) | `api_token`, isteğe bağlı `base_url` |
| **Custom** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key`, `base_url` |
| **Decision Model** | [Decision](../nodes/decision-node.md), [Evals](../tabs/evals-tab.md) (LLM-as-Judge judge) | `base_url`, isteğe bağlı `api_key` |
| **Model Router (Auto Model)** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | bir decision model credential'ı ve diğer credential'larınıza başvuran model seçenekleri |
| **Cohere** | Embeddings | `api_key` |
| **RAG: Qdrant + OpenAI** | [RAG](../nodes/rag-node.md), Vectorstores | `qdrant_host`, `openai_api_key` |
| **RAG: Psql + OpenAI** | [RAG](../nodes/rag-node.md), Vectorstores | `openai_api_key` (vektörler pgvector aracılığıyla Heym'in kendi Postgres'inde saklanır) |
| **RAG: Custom Embeddings** | [RAG](../nodes/rag-node.md), Vectorstores | `embedding_base_url`, `embedding_model`, `embedding_dimensions`, `db_type`, isteğe bağlı `embedding_api_key` ve `db_type` `qdrant` olduğunda `qdrant_host` |
| **Grist** | [Grist düğümü](../nodes/grist-node.md) | `api_key`, `server_url` |
| **Google Sheets** | [Google Sheets düğümü](../nodes/google-sheets-node.md) | `client_id`, `client_secret` + OAuth2 onayı |
| **Google Drive** | [Google Drive düğümü](../nodes/google-drive-node.md) | `client_id`, `client_secret` + OAuth2 onayı (tam Drive kapsamı) |
| **BigQuery** | [BigQuery düğümü](../nodes/bigquery-node.md) | `client_id`, `client_secret` + OAuth2 onayı |
| **Supabase** | [Supabase düğümü](../nodes/supabase-node.md) | `supabase_url`, `supabase_key`, isteğe bağlı `supabase_schema` |
| **ClickHouse** | [ClickHouse düğümü](../nodes/clickhouse-node.md) | `host`, `port`, `username`, `password`, `database`, `secure` |
| **Notion** | [Notion düğümü](../nodes/notion-node.md) | `api_token` veya `client_id` + `client_secret` OAuth |
| **Amazon S3** | [Amazon S3 düğümü](../nodes/amazon-s3-node.md) | `aws_access_key_id`, `aws_secret_access_key`, `aws_region` |
| **SMTP** | [Send Email](../nodes/send-email-node.md) | `host`, `port`, `email`, `password` |
| **IMAP** | [IMAP Trigger düğümü](../nodes/imap-trigger-node.md) | `imap_host`, `imap_port`, `imap_username`, `imap_password` |
| **Telegram** | [Telegram Trigger düğümü](../nodes/telegram-trigger-node.md), [Telegram düğümü](../nodes/telegram-node.md) | `bot_token`, isteğe bağlı `secret_token` |
| **Discord** | [Discord düğümü](../nodes/discord-node.md) | `webhook_url` |
| **Discord Trigger** | [Discord Trigger düğümü](../nodes/discord-trigger-node.md) | `public_key` |
| **RabbitMQ** | [RabbitMQ düğümü](../nodes/rabbitmq-node.md) | `rabbitmq_host`, `rabbitmq_username`, `rabbitmq_password` |
| **Redis** | [Redis düğümü](../nodes/redis-node.md) | `host`, `port`, `password` |
| **Slack** | [Slack düğümü](../nodes/slack-node.md) | `webhook_url` |
| **Slack Trigger** | [Slack Trigger düğümü](../nodes/slack-trigger-node.md) | `signing_secret` |
| **Bearer** | [HTTP düğümü](../nodes/http-node.md) | `token` |
| **Header** | [HTTP düğümü](../nodes/http-node.md) | `header_key`, `header_value` |
| **FlareSolverr** | [Crawler düğümü](../nodes/crawler-node.md) | `flaresolverr_url` |

---

## GitHub

GitHub credential'ı, workflow'ların [GitHub düğümü](../nodes/github-node.md) aracılığıyla GitHub REST API'sini çağırabilmesi, token'ı `@modelcontextprotocol/server-github` gibi MCP sunucularına aktarabilmesi veya özel REST çağrıları için [HTTP düğümünden](../nodes/http-node.md) kullanabilmesi amacıyla bir GitHub personal access token (PAT) saklar.

### Gerekli Alanlar

| Alan | Açıklama |
|-------|-------------|
| `api_key` | GitHub personal access token (`github_pat_...` fine-grained PAT veya klasik `ghp_...` PAT) |
### İsteğe Bağlı Alanlar

| Alan | Açıklama |
|-------|-------------|
| `base_url` | GitHub Enterprise Server için GitHub API base URL'si (örneğin `https://github.example.com/api/v3`) |

### Notlar

- Mümkün olduğunda ince taneli kişisel erişim token'ları önerilir; çünkü bunları belirli repository'lere ve izinlere göre kapsamlandırabilirsiniz.
- GitHub.com için `base_url` alanını boş bırakın. GitHub Enterprise Server için, sunucunun web arayüzü kökü (örneğin `https://github.example.com`) yerine `/api/v3` dahil tam REST API endpoint'ini (örneğin `https://github.example.com/api/v3`) kullanın.
- Bu credential şu anda yalnızca PAT tabanlı kimlik doğrulamayı modellemektedir. Organizasyon repository'lerine erişmek için, gerekli organizasyon/repository izinleri verilmiş bir PAT kullanın.
- GitHub App kurulum token'ları ve GitHub App kurulum akışları bugün Heym arayüzünde birinci sınıf olarak desteklenmemektedir.
- Yerel repository, kullanıcı, issue, pull request, review, release, Actions workflow, trafik ve dosya işlemleri için [GitHub düğümünü](../nodes/github-node.md) tercih edin. [HTTP düğümünü](../nodes/http-node.md) yalnızca GitHub düğümünün kapsamadığı endpoint'lere veya payload'lara ihtiyaç duyduğunuzda kullanın.
- MCP ile birlikte [Agent düğümünü](../nodes/agent-node.md) kullanırken `$credentials.YourGitHubCredential` değerini `GITHUB_PERSONAL_ACCESS_TOKEN` gibi bir MCP bağlantı ortam değişkenine geçirin.
- GitHub'ın REST API'si genellikle `Authorization: Bearer <token>` ile birlikte `Accept: application/vnd.github+json` bekler.
- Bir GitHub credential'ını düzenlerken, GitHub Enterprise `base_url` alanını boş bırakmak mevcut endpoint'i korur. Bu endpoint'i değiştirmek istediğinizde yeni bir URL girin.

### Kullanıldığı Yerler

- [GitHub düğümü](../nodes/github-node.md)
- [Codex düğümü](../nodes/codex-node.md)
- [Agent düğümü](../nodes/agent-node.md)
- [HTTP düğümü](../nodes/http-node.md)

---

## Decision Model

Bir decision model, bir durum hakkında tipli soruları yanıtlar ve metin yerine olasılıklar döndürür. TypeSafe'in Jev'i referans uygulamasıdır; aynı `{model, state, questions}` gövdesini kabul eden herhangi bir endpoint çalışır ve [Decision](../nodes/decision-node.md) düğümü, bunu desteklemeyen bir model için elle yazılmış bir gövde gönderebilir.

### Zorunlu Alanlar

- `base_url` – endpoint, örneğin `https://api.typesafe.ai`. Heym `/v1/systemone` ekler.

### İsteğe Bağlı Alanlar

- `api_key` – `Authorization: Bearer` olarak gönderilir. Anahtar gerektirmeyen endpoint'ler bu alanı boş bırakabilir.

### Notlar

- **Test Connection**, endpoint'in ve anahtarın çalıştığını doğrulamak için tek bir küçük soru gönderir.
- Bir credential düzenlenirken, anahtar alanı boş bırakılırsa depolanan anahtar korunur.
- Özel ve loopback adreslerine giden istekler varsayılan olarak engellenir; bu nedenle `localhost` veya özel bir aralıkta barındırılan self-hosted bir endpoint için `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` gerekir.
- Bu modeller, Heym'in senkronize ettiği LLM fiyatlandırma tablolarında yer almaz; bu nedenle [Traces](../tabs/traces-tab.md) içindeki Cost sütunu boş kalır. Token sayıları yine de kaydedilir.

### Kullanıldığı Yerler

- [Decision](../nodes/decision-node.md)
- [Evals](../tabs/evals-tab.md) – `LLM-as-Judge` yanıtlarını beklenen çıktıya göre puanlar

## OpenAI Codex

OpenAI Codex credential'ı, [Codex düğümünün](../nodes/codex-node.md) kimlik doğrulamasını yapar. LLM, Agent ve RAG düğümleri tarafından kullanılan OpenAI API key credential'ından ayrıdır.

### Kimlik Doğrulama Modları

| Mod | Açıklama |
|------|-------------|
| **Sign in with ChatGPT** (önerilir) | ChatGPT Plus/Pro aboneliğinizi kullanan OAuth (PKCE) oturum açma yöntemi; böylece çalıştırmalar token başına API maliyetlerinden kaçınır. Heym token paketini saklar ve otomatik olarak yeniler. |
| **Access token** | Yalnızca yerel Codex CLI sürecine geçirilen bir ChatGPT/Codex `access_token` değeri. |

### Notlar

- Bu credential türü için API anahtarları reddedilir.
- Codex token'ları `$credentials.Name` üzerinden açığa çıkarılmaz.
- Codex düğümü ayrıca repository klonlama, branch push ve draft PR oluşturma için bir GitHub credential'ına ihtiyaç duyar.

### Kullanıldığı Yerler

- [Codex düğümü](../nodes/codex-node.md)

## OpenCode Go

OpenCode Go credential'ı, [OpenCode Go düğümünün](../nodes/opencode-go-node.md) kimlik doğrulamasını yapar. Bir OpenCode Go gateway API anahtarı ([opencode.ai/go](https://opencode.ai/go) adresinden) ve isteğe bağlı bir gateway base URL'si saklar.

### Alanlar

| Alan | Açıklama |
|-------|-------------|
| **API Key** | OpenCode Go gateway API anahtarı (zorunlu). |
| **Gateway Base URL** | İsteğe bağlı; varsayılan olarak `https://opencode.ai/zen/go/v1` kullanılır. Yalnızca self-hosted veya proxy'lenmiş bir gateway için geçersiz kılın. |

### Notlar

- API anahtarı yalnızca sağlamlaştırılmış bir container içindeki OpenCode CLI sürecine geçirilir.
- OpenCode Go düğümü ayrıca repository klonlama, branch push ve pull request oluşturma için bir GitHub credential'ına ihtiyaç duyar. GitHub token'ı hiçbir zaman sandbox container'ının içine yerleştirilmez.

### Kullanıldığı Yerler

- [OpenCode Go düğümü](../nodes/opencode-go-node.md)

---

## Linear

Linear credential'ı, [Linear düğümü](../nodes/linear-node.md) için kişisel bir API anahtarını veya OAuth2'yi destekler. Heym, workspace meta verileri, projeler, issue'lar ve yorumlar için Linear'a yerel GraphQL sorguları gönderir.
### Kurulum

Bir kimlik doğrulama modu seçin:

**Kişisel API anahtarı**

1. Linear'da **Settings → Security & Access → Personal API keys** bölümünü açın.
2. Otomatikleştirmek istediğiniz workspace'e erişimi olan bir anahtar oluşturun.
3. Anahtarı Heym'deki bir Linear credential'a yapıştırın ve doğrulamak için **Test Connection** seçeneğini kullanın.

**OAuth2**

1. Bir Linear OAuth uygulaması oluşturun.
2. `{FRONTEND_URL}/api/credentials/linear/oauth/callback` adresini redirect URI olarak kaydedin.
3. Heym Dashboard → **Credentials** → **New** → **Linear** türünü seçin.
4. **OAuth2** seçeneğini seçin, Client ID ve Client Secret değerlerini girin, ardından **Connect** düğmesine tıklayın.

### Zorunlu Alanlar

| Mod | Alan | Açıklama |
|------|-------|-------------|
| Kişisel API anahtarı | `api_key` | Linear kişisel API anahtarı, genellikle `lin_api_` ön ekiyle başlar |
| OAuth2 | `client_id` | Linear OAuth uygulamasından alınan Client ID |
| OAuth2 | `client_secret` | Linear OAuth uygulamasından alınan Client Secret |

OAuth token'ları (`access_token`, `refresh_token`, `token_expiry`) otomatik olarak saklanır ve yenilenir.

### Notlar

- Kişisel API anahtarları ve OAuth token'ları, bunları oluşturan veya yetkilendiren Linear kullanıcısı olarak hareket eder.
- Linear OAuth, `read,write,issues:create,comments:create` scope'larını kullanır.
- API anahtarını veya OAuth token'ını Linear API'sine karşı doğrulamak için credential iletişim kutusundaki **Test Connection** seçeneğini kullanın.
- Issue oluşturmadan veya filtrelemeden önce UUID'leri keşfetmek için Linear düğümündeki List Teams ve List Projects seçeneklerini kullanın.
- Güncellemeler için state ve assignee UUID'lerini keşfetmek üzere List Workflow States ve List Team Members seçeneklerini kullanın.
- Bir API anahtarını, credential'ı düzenleyip yerine geçen değeri girerek döndürün. OAuth uygulama secret'larını döndürürseniz, credential'ı **Connect** aracılığıyla yeniden bağlayın.

### Kullanıldığı Yerler

- [Linear düğümü](../nodes/linear-node.md)

---

## Jira

Jira credential'ı, [Jira düğümü](../nodes/jira-node.md) için Jira Basic auth kimlik bilgilerini veya bir Data Center kişisel erişim token'ını, Jira site base URL'sini, deployment modunu ve isteğe bağlı REST API sürümünü saklar. Jira Cloud için `cloud`, Jira Data Center / Server için `data_center` kullanın.

### Kurulum

**Jira Cloud**

1. Atlassian hesap ayarlarında bir API token oluşturun.
2. Heym Dashboard → **Credentials** → **New** → **Jira** türünü seçin.
3. Atlassian e-postasını, API token'ını ve `https://your-domain.atlassian.net` gibi Jira site URL'sini girin.
4. Credential'ı doğrulamak için **Test Connection** seçeneğini kullanın.

**Jira Data Center / Server**

1. Dağıtım olarak **Jira Data Center / Server** seçeneğini belirleyin.
2. Bir kimlik doğrulama yöntemi seçin. **Kullanıcı adı ve parola** Basic auth kullanır. **Personal Access Token** `Authorization: Bearer <token>` kullanır ve Jira Data Center / Server 8.14 veya üzerini gerektirir. Token'ı Jira'da **Profil → Personal Access Tokens** altında oluşturun.
3. Jira kullanıcı adını ve parolasını girin ya da kişisel erişim token'ını yapıştırın (kullanıcı adı gerekmez).
4. Jira site URL'sini girin, örneğin `https://jira.example.com`.
5. Kimlik bilgisini doğrulamak için **Test Connection** kullanın.

### Alanlar

| Alan | Açıklama |
| --- | --- |
| `auth_mode` | `basic` (eksik olduğunda varsayılan) veya `pat`. `pat` yalnızca `data_center` ile geçerlidir |
| `email` | Jira Cloud Atlassian hesap e-postası veya Jira Data Center / Server kullanıcı adı. `pat` modunda kullanılmaz |
| `api_token` | Jira Cloud Atlassian API token'ı, Basic auth için Jira Data Center / Server parolası veya `pat` modunda Data Center kişisel erişim token'ı |
| `base_url` | Jira site base URL'si |
| `deployment` | Jira Cloud için `cloud` veya Jira Data Center / Server için `data_center` |
| `api_version` | REST API sürümü; Jira Cloud için varsayılan olarak `3`'tür. Data Center / Server v2 kullanır |

### Notlar

- Jira düğümü, Jira Cloud REST API v3 için issue açıklamalarını ve yorumlarını Atlassian Document Format metin belgeleri olarak gönderir. Data Center / Server credential'ları düz metin gönderir.
- Data Center / Server, kullanıcı adı/parola ile Basic auth ve Bearer şemasını kullanan kişisel erişim token'ı (PAT) kimlik doğrulamasını destekler. PAT kimlik doğrulaması Jira Data Center / Server 8.14 veya üzerini gerektirir.
- Ek dosya yükleme, base64 veya data URL içeriğini kabul eder ve platform dosya boyutu sınırına tabidir (varsayılan 99 MB). Ek dosya indirme, etkinleştirildiğinde base64 içeriği döndürebilir.
- Kullanıcı oluşturma, silme ve issue bildirimi, kimliği doğrulanmış Jira hesabının ilgili Jira site veya organizasyon izinlerine sahip olmasını gerektirir.
- Proje anahtarlarını, issue anahtarlarını ve transition ID'lerini keşfetmek için List Projects, Search Issues ve List Transitions seçeneklerini kullanın.
- Jira düğümü tarafından kapsanmayan özel endpoint'ler için cURL komutunda Jira Basic Auth (`email:api_token` Cloud için veya `username:password` Data Center / Server için) veya PAT Bearer auth (`Authorization: Bearer <token>` Data Center / Server için) ile [HTTP düğümünü](../nodes/http-node.md) kullanın. Alternatif olarak, uygun `Authorization` başlığına sahip bir Header kimlik bilgisi kullanın.

Ayrıca bakınız:

- [Jira düğümü](../nodes/jira-node.md)
- [Credentials](./credentials.md)

---

## Sentry

Sentry credential'ı, [Sentry düğümü](../nodes/sentry-node.md) için bir auth token saklar. Heym, organizasyon, proje, ekip, issue, event ve release işlemleri için Sentry'nin REST API'sini kullanır.

### Zorunlu Alanlar

| Alan | Açıklama |
|-------|-------------|
| `api_token` | Otomatikleştirdiğiniz organizasyonlara ve projelere erişimi olan Sentry auth token'ı |

### İsteğe Bağlı Alanlar

| Alan | Açıklama |
|-------|-------------|
| `base_url` | Self-hosted Sentry için isteğe bağlı kök URL, örneğin `https://sentry.example.com` |

### Notlar

- Sentry SaaS için `base_url` alanını boş bırakın.
- Token'ın görünür organizasyonları listeleyebildiğini doğrulamak için **Test Connection** seçeneğini kullanın.
- Özel REST çağrıları için bearer token olarak `$credentials.YourSentryCredential` kullanın.

### Kullanıldığı Yerler

- [Sentry düğümü](../nodes/sentry-node.md)

---

## Qdrant

[Qdrant](https://qdrant.tech), semantik arama ve RAG (Retrieval Augmented Generation) için kullanılan açık kaynaklı bir vektör veritabanıdır.

### Zorunlu Alanlar

| Alan | Açıklama |
|-------|-------------|
| `qdrant_host` | Qdrant örneğinizin tam URL'si (örn. `http://localhost:6333` veya bir cloud endpoint) |
| `openai_api_key` | Belgeleri indekslerken ve ararken embedding oluşturmak için kullanılan OpenAI API anahtarı |
### Notlar

- Qdrant koleksiyonları [Vectorstores](../tabs/vectorstores-tab.md) sekmesinden yönetilir. Her vector store bir Qdrant koleksiyonuna karşılık gelir.
- [RAG node](../nodes/rag-node.md) bir vector store kullanır (bu da bir Qdrant credential'ına başvurur) — credential'a doğrudan başvurmaz.
- Qdrant örneğiniz bir API key gerektiriyorsa, bunu `qdrant_host` değerine ekleyin veya Qdrant'ı buna göre yapılandırın; mevcut entegrasyonda ayrı bir Qdrant API key alanı bulunmamaktadır.
- Self-hosted Qdrant: [resmi Docker image](https://hub.docker.com/r/qdrant/qdrant) kullanın ve `6333` portunu açın.

### Kullanıldığı Yerler

- [RAG node](../nodes/rag-node.md) (vector store aracılığıyla)
- [Vectorstores Sekmesi](../tabs/vectorstores-tab.md)

## Custom Embeddings (RAG)

Varsayılan olarak RAG embeddings değerleri OpenAI'dan gelir. Bir **RAG: Custom Embeddings** credential'ı bunun yerine herhangi bir OpenAI uyumlu embeddings endpoint'ini işaret eder — Ollama, vLLM, Text Embeddings Inference, LM Studio, Together veya barındırılan bir gateway — ve yazdığı vector store'u adlandırır.

### Gerekli Alanlar

| Alan | Açıklama |
|-------|-------------|
| `embedding_base_url` | `/v1` yolunu içeren endpoint URL'si, örn. `http://localhost:11434/v1` |
| `embedding_api_key` | İsteğe bağlı. Yerel sunucular genellikle key gerektirmez |
| `embedding_model` | Endpoint'in beklediği model adı, örn. `nomic-embed-text` |
| `embedding_dimensions` | Modelin döndürdüğü vektör genişliği (varsayılan `1536`) |
| `embedding_request_dimensions` | İsteğe bağlı. Endpoint'ten modelin yerel genişliği yerine `embedding_dimensions` değerini döndürmesini isteyin |
| `db_type` | `qdrant` veya `pgvector` |
| `qdrant_host`, `qdrant_port`, `qdrant_api_key` | Qdrant bağlantısı, `db_type` değeri `qdrant` olduğunda gereklidir |

### Notlar

- **Qdrant herhangi bir boyut sayısını kabul eder.** Her koleksiyon bu credential'ın bildirdiği genişlikte oluşturulur, dolayısıyla Dimensions alanı serbestçe düzenlenebilir.
- **Postgres (pgvector) tam olarak 1536 boyut gerektirir.** Sütunu sabit bir `vector(1536)`'dır, dolayısıyla Dimensions alanı 1536'ya sabitlenmiştir ve başka bir genişlik bildiren bir credential kaydetme sırasında reddedilir.
- **pgvector için kısaltma.** Store Postgres olduğunda, iletişim kutusu *Ask the endpoint to return 1536 dimensions* seçeneğini sunar. Bu, `dimensions` request parametresini gönderir; Matryoshka temsilleriyle eğitilmiş modeller (OpenAI `text-embedding-3-*`, `nomic-embed-text-v1.5`, `jina-v3` ve benzerleri) bunu kısaltılmış ancak hâlâ anlamlı bir vektör döndürerek karşılar. Parametreyi desteklemeyen endpoint'ler isteği reddeder ve parametreyi kabul edip yok sayan endpoint'ler gerçekte döndürülen genişliği belirten açık bir hata üretir. Heym vektörleri asla kendisi kesmez, çünkü Matryoshka olmayan bir modelin çıktısını dilimlemek retrieval kalitesini sessizce düşürür. Bu seçenek, bir koleksiyonu herhangi bir genişliğe boyutlandırabilen Qdrant için sunulmaz.
- Bir store oluşturmadan önce modelin gerçekte döndürdüğü genişliği görmek için credential iletişim kutusundaki **Test Connection** seçeneğini kullanarak bir probe string'i embed edin.
- `dimensions` request parametresi yalnızca OpenAI'ın kendisine gönderilir, çünkü çoğu OpenAI uyumlu sunucu bilinmeyen parametreleri reddeder. Bunun yerine modelin yerel genişliği credential'a karşı doğrulanır.
- Mevcut **RAG: Qdrant + OpenAI** ve **RAG: Psql + OpenAI** credential'ları değişmemiştir ve çalışmaya devam etmektedir.

### Kullanıldığı Yerler

- [RAG node](../nodes/rag-node.md) (vector store aracılığıyla)
- [Vectorstores Sekmesi](../tabs/vectorstores-tab.md)

## Postgres (pgvector)

Heym, [pgvector](https://github.com/pgvector/pgvector) uzantısını kullanarak vektörleri **kendi Postgres veritabanının içinde** de saklayabilir — harici bir vector servisi gerekmez. Bir **RAG: Psql + OpenAI** credential'ı oluşturun ve bir vector store oluştururken bunu kullanın, ardından RAG node'un Database açılır menüsünde **Postgres (pgvector)** seçeneğini seçin.

### Gerekli Alanlar

| Alan | Açıklama |
|-------|-------------|
| `openai_api_key` | Belgeleri indekslerken ve ararken embeddings oluşturmak için kullanılan OpenAI API key |

### Notlar

- Host/port gerekmez — vektörler Heym'in kendi veritabanına yazılır; Heym hiçbir zaman farklı bir veritabanına bağlanmaz.
- Qdrant ile kullanılabilen her RAG özelliği (ekleme, arama, metadata filtreleri, Cohere reranking, klonlama, paylaşma) Postgres backend'i ile birebir aynı şekilde çalışır.
- `vector` uzantısını gerektirir. Heym resmi `postgres:16` image'ını değiştirmeden tutar (böylece mevcut verilere asla dokunulmaz) ve **başlangıçta `postgresql-16-pgvector` paketini otomatik olarak kurar** — `run.sh`, `deploy.sh` ve `run_e2e.sh` bunların tümünü ele alır. Kurulum ölümcül değildir: çalıştırılamazsa (örn. ağ yoksa), Qdrant RAG çalışmaya devam eder ve Postgres backend'i etkin olmaz (migration tabloyu sorunsuz şekilde atlar).
- Yayımlanan tek konteynerli image'ı (`ghcr.io/heymrun/heym`) **kendi harici Postgres'inize** karşı çalıştırıyorsanız, o veritabanı `vector` uzantısını desteklemelidir (Heym yönetmediği bir veritabanına bunu kuramaz). Bu olmadan, bir Postgres vector store oluşturmak veya ona yükleme yapmak açık bir mesaj döndürür ve Qdrant RAG çalışmaya devam eder.

### Kullanıldığı Yerler

- [RAG node](../nodes/rag-node.md) (vector store aracılığıyla)
- [Vectorstores Sekmesi](../tabs/vectorstores-tab.md)

---

## Grist

[Grist](https://www.getgrist.com), yapılandırılmış verileri ve formülleri destekleyen bir elektronik tablo/veritabanı melezidir. Grist credential'ı, Heym'in Grist belgelerini okumasına ve yazmasına olanak tanır.
### Zorunlu Alanlar

| Alan | Açıklama |
|-------|-------------|
| `api_key` | Grist API anahtarı (Grist örneğinizde **Profile → API Key** bölümünde bulunur) |
| `server_url` | Grist sunucunuzun temel URL'si (örn. Grist Cloud için `https://docs.getgrist.com` veya kendi barındırdığınız URL) |

### Notlar

- [Grist düğümü](../nodes/grist-node.md), yapılandırmasında **Document ID** (Grist belge URL'sinden alınır) ve **Table ID** gerektirir — bunlar credential'ın bir parçası değildir.
- Kendi barındırdığınız Grist için `server_url` değerini örneğinizin alan adına ayarlayın.
- Grist'teki sütun ID'leri görünen etiketleri değil, alt çizgi kullanır (örn. `User_Name`). Bunları keşfetmek için `listColumns` işlemini kullanın.

### Kullananlar

- [Grist düğümü](../nodes/grist-node.md)

---

## Google Sheets (OAuth2)

Google Sheets credential'ı, OAuth2 "Bring Your Own App" modelini kullanarak Heym'i Google Sheets API'sine bağlar. Bir Google Cloud OAuth2 Client ID ve Client Secret sağlarsınız, ardından tarayıcı açılır penceresi aracılığıyla erişimi yetkilendirirsiniz. Token'lar arka planda otomatik olarak yenilenir.

### Kurulum

1. [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** bölümünü açın → **Google Sheets API**'yi arayın ve etkinleştirin.
2. **Credentials** → **Create Credentials** → **OAuth client ID** → uygulama türü **Web application** yolunu izleyin.
3. **Authorized redirect URIs** altına şunu ekleyin: `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`
4. Oluşturulan **Client ID** ve **Client Secret** değerlerini kopyalayın.
5. Heym Dashboard → **Credentials** → **New** → tür olarak **Google Sheets (OAuth2)** seçin.
6. Client ID, Client Secret ve bir ad girin, ardından Google onay açılır penceresini açmak ve erişimi yetkilendirmek için **Connect** düğmesine tıklayın.

### Zorunlu Alanlar

| Alan | Açıklama |
|-------|-------------|
| `client_id` | Google Cloud Console'dan alınan OAuth2 Client ID |
| `client_secret` | Google Cloud Console'dan alınan OAuth2 Client Secret |

Token'lar (`access_token`, `refresh_token`, `token_expiry`) otomatik olarak saklanır ve yenilenir — bunları doğrudan yönetmezsiniz.

### Notlar

- OAuth2 onay ekranı, spreadsheets kapsamını (`https://www.googleapis.com/auth/spreadsheets`) gerektirir.
- Heym, süresi dolmadan önce yeni access token'lar almak için refresh token'ı kullanır (60 saniyelik güvenlik tamponu).
- Google Cloud Console'da Client Secret'ı değiştirirseniz, credential'ı **Connect** düğmesi aracılığıyla yeniden bağlayın.
- **Production:** Backend **`FRONTEND_URL`** değerini, kullanıcıların tarayıcıda açtığı tam genel URL'ye (şema + host, örn. `https://heym.example.com`) ayarlayın. Heym, Google OAuth redirect URI'sini yalnızca bu değerden oluşturur — `Origin` veya `X-Forwarded-*` başlıklarına (istemci tarafından kontrol edilir) **güvenmez**. Google Cloud Console'da `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` adresini kaydedin.

### Kullananlar

- [Google Sheets düğümü](../nodes/google-sheets-node.md)

---

## Google Drive (OAuth2)

Google Drive credential'ı, Google Sheets ile aynı OAuth2 "Bring Your Own App" modelini kullanarak Heym'i Google Drive API'sine bağlar. Bir Google Cloud OAuth2 Client ID ve Client Secret sağlarsınız, ardından tarayıcı açılır penceresi aracılığıyla erişimi yetkilendirirsiniz. Token'lar arka planda otomatik olarak yenilenir.

### Kurulum

1. [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** bölümünü açın → **Google Drive API**'yi arayın ve etkinleştirin.
2. **Credentials** → **Create Credentials** → **OAuth client ID** → uygulama türü **Web application** yolunu izleyin.
3. **Authorized redirect URIs** altına şunu ekleyin: `https://your-heym-domain/api/credentials/google-drive/oauth/callback`
4. Oluşturulan **Client ID** ve **Client Secret** değerlerini kopyalayın.
5. Heym Dashboard → **Credentials** → **New** → tür olarak **Google Drive (OAuth2)** seçin.
6. Client ID, Client Secret ve bir ad girin, ardından Google onay açılır penceresini açmak ve erişimi yetkilendirmek için **Connect** düğmesine tıklayın.

### Zorunlu Alanlar

| Alan | Açıklama |
|-------|-------------|
| `client_id` | Google Cloud Console'dan alınan OAuth2 Client ID |
| `client_secret` | Google Cloud Console'dan alınan OAuth2 Client Secret |

Token'lar (`access_token`, `refresh_token`, `token_expiry`) otomatik olarak saklanır ve yenilenir — bunları doğrudan yönetmezsiniz.

### Kapsam

Google Drive, **tam Drive kapsamını** (`https://www.googleapis.com/auth/drive`) talep eder.

Bu gereklidir çünkü düğüm, halihazırda sahip olduğunuz dosyalar üzerinde çalışır. Daha dar olan `drive.file` kapsamı yalnızca OAuth istemcisinin kendisinin oluşturduğu dosyalara erişim verir; bu da `listFolderFiles`, `updateFile`, `removeFile` ve `removeFolder` işlemlerinin mevcut Drive'ınızdaki hiçbir şeyi görmemesine neden olur.

Kendi Google Cloud projenizden kendi Client ID ve Secret'ınızı sağladığınız için, bu kapsama ilişkin Google uygulama doğrulama gereksinimleri Heym'e değil, projenize uygulanır.

### Notlar

- Heym, süresi dolmadan önce yeni access token'lar almak için refresh token'ı kullanır (60 saniyelik güvenlik tamponu).
- Google Cloud Console'da Client Secret'ı değiştirirseniz, credential'ı **Connect** düğmesi aracılığıyla yeniden bağlayın.
- Paylaşılan drive'lar desteklenir — düğüm her API çağrısında `supportsAllDrives` değerini ayarlar.
- **Production:** Backend **`FRONTEND_URL`** değerini, kullanıcıların tarayıcıda açtığı tam genel URL'ye ayarlayın. Heym, Google OAuth redirect URI'sini yalnızca bu değerden oluşturur — `Origin` veya `X-Forwarded-*` başlıklarına **güvenmez**. Google Cloud Console'da `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` adresini kaydedin.
- Bu credential'ı bir ekiple paylaşmadan önce [Credential Sharing](./credentials-sharing.md) bölümüne bakın.

### Kullananlar

- [Google Drive düğümü](../nodes/google-drive-node.md)

---
## BigQuery (OAuth2)

BigQuery kimlik bilgisi, OAuth2 "Bring Your Own App" modelini kullanarak Heym'i Google BigQuery API'sine bağlar. Bir Google Cloud OAuth2 Client ID ve Client Secret sağlarsınız, ardından bir tarayıcı açılır penceresi aracılığıyla erişim yetkisi verirsiniz. Token'lar arka planda otomatik olarak yenilenir.

### Kurulum

1. [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** yolunu açın → **BigQuery API**'yi arayın ve etkinleştirin.
2. **Credentials** → **Create Credentials** → **OAuth client ID** → uygulama türü **Web application** yolunu izleyin.
3. **Authorized redirect URIs** altına şunu ekleyin: `https://your-heym-domain/api/credentials/bigquery/oauth/callback`
4. Oluşturulan **Client ID** ve **Client Secret** değerlerini kopyalayın.
5. Heym Dashboard → **Credentials** → **New** → tür **BigQuery (OAuth2)** yolunu izleyin.
6. Client ID, Client Secret ve bir ad girin, ardından Google izin açılır penceresini açmak ve erişim yetkisi vermek için **Connect**'e tıklayın.

### Gerekli Alanlar

| Alan | Açıklama |
|-------|-------------|
| `client_id` | Google Cloud Console'dan alınan OAuth2 Client ID |
| `client_secret` | Google Cloud Console'dan alınan OAuth2 Client Secret |

Token'lar (`access_token`, `refresh_token`, `token_expiry`) otomatik olarak saklanır ve yenilenir.

### Notlar

- OAuth2 izin ekranı BigQuery kapsamını (`https://www.googleapis.com/auth/bigquery`) gerektirir.
- **Production:** Backend **`FRONTEND_URL`** değerini genel URL'ye ayarlayın. Google Cloud Console'da `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback` adresini kaydedin.

### Kullanan Yapılar

- [BigQuery düğümü](../nodes/bigquery-node.md)

---

## Supabase

Supabase kimlik bilgisi, Heym'i bir Supabase projesinin PostgREST API'sine bağlar; böylece workflow'lar Postgres destekli tabloları sorgulayabilir ve değiştirebilir.

### Gerekli Alanlar

| Alan | Açıklama |
|-------|-------------|
| `supabase_url` | Proje temel URL'si, örneğin `https://your-project.supabase.co` |
| `supabase_key` | Hedef tablolara erişimi olan API anahtarı |
| `supabase_schema` | İsteğe bağlı varsayılan şema (varsayılan olarak `public`) |

### Notlar

- [Supabase düğümü](../nodes/supabase-node.md), `/rest/v1/<table>` ile iletişim kurar ve operatör filtrelerini (`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `is`, `in` ve ilgili PostgREST operatörleri) ayrıca iç içe `or` / `and` mantıksal gruplarını destekler.
- Yazma işlemleri için, minimum gerekli tablo izinlerine sahip, güvenilir sunucu tarafı kullanımına yönelik bir anahtar tercih edin.
- Kimlik bilgisi varsayılan bir şema tanımlasa bile düğümler her adımda şemayı geçersiz kılabilir.

### Kullanan Yapılar

- [Supabase düğümü](../nodes/supabase-node.md)

## ClickHouse

ClickHouse kimlik bilgisi, Heym'i HTTP arayüzü üzerinden harici bir ClickHouse veritabanına bağlar; böylece workflow'lar OLAP tabloları üzerinde SQL, CRUD ve sayım işlemleri çalıştırabilir.

### Gerekli Alanlar

| Alan | Açıklama |
|-------|-------------|
| `host` | Şema içermeyen HTTP host'u, örneğin `your-instance.clickhouse.cloud` |
| `port` | HTTP arayüz portu (HTTPS için `8443`, HTTP için `8123`) |
| `username` | ClickHouse kullanıcısı (varsayılan olarak `default`) |
| `password` | Kullanıcı parolası (isteğe bağlı) |
| `database` | Hedef veritabanı (varsayılan olarak `default`) |
| `secure` | `true` olduğunda HTTPS kullanır (ClickHouse Cloud için gereklidir) |

### Notlar

- [ClickHouse düğümü](../nodes/clickhouse-node.md), resmi `clickhouse-connect` HTTP istemcisini kullanır ve filtre ile değer bağlamalarını parametreleştirir.
- `update` ve `remove`, eşzamansız ClickHouse mutasyonları olan `ALTER TABLE ... UPDATE` ve `DELETE FROM` işlemlerine karşılık gelir; her ikisi de bir filtre gerektirir.
- `upsert` bir `INSERT` gerçekleştirir ve anahtar bazlı birleştirme davranışı için bir `ReplacingMergeTree` tablosu varsayar.
- Erişilebilirliği doğrulamak için kimlik bilgisi iletişim kutusunda **Test connection** seçeneğini kullanın.

### Kullanan Yapılar

- [ClickHouse düğümü](../nodes/clickhouse-node.md)

## Notion

Notion kimlik bilgisi, bir dahili entegrasyon token'ını veya bir genel entegrasyon OAuth bağlantısını destekler. OAuth, her kullanıcının bir token'ı manuel olarak kopyalamak yerine Heym üzerinden bir Notion workspace'ine yetki vermesini sağlar.

### Gerekli Alanlar

| Mod | Alan | Açıklama |
|------|-------|-------------|
| Dahili token | `api_token` | Dahili entegrasyon token'ı (`ntn_...`) |
| OAuth | `client_id` | Bir Notion genel entegrasyonundan alınan Client ID |
| OAuth | `client_secret` | Notion genel entegrasyonundan alınan Client Secret |

OAuth callback'i `access_token`, `auth_mode`, `workspace_id`, `workspace_name` ve `bot_id` değerlerini otomatik olarak saklar. OAuth tamamlandığında önceki dahili `api_token` kaldırılır. Bu yönlendirme URI'sini Notion'da kaydedin:
`{FRONTEND_URL}/api/credentials/notion/oauth/callback`.

### OAuth kurulum akışı

1. Kimlik bilgisi iletişim kutusunda **OAuth** seçeneğini seçin, bir ad, Client ID ve Client Secret girin.
2. **Connect**'e tıklayın ve Notion açılır penceresinde workspace'e yetki verin.
   - **Yeni** bir kimlik bilgisi için, **Connect**'e tıkladığınızda Heym kimlik bilgisi kaydını oluşturur.
   - Açılır pencerede yetkilendirmeyi tamamlayın, ardından kimlik bilgileri listesine dönmek için **Save**'e tıklayın.
3. Bağlı bir kimlik bilgisi listede `connected (Workspace Name)` olarak görünür. Bekleyen OAuth kimlik bilgileri, yetkilendirme tamamlanana kadar `Not connected` olarak görünür.

Bir dahili token'ı veya tamamlanmış bir OAuth yetkilendirmesini doğrulamak için kimlik bilgisi iletişim kutusunda **Test Connection** seçeneğini kullanın. Düzenleme sırasında token alanını boş bırakmak, saklanan dahili token'ı korur.

Hem dahili token'lar hem de OAuth erişim token'ları, Notion bearer token'ı gerektiren özel [HTTP](../nodes/http-node.md) çağrıları için `$credentials.CredentialName` aracılığıyla kullanılabilir.
### Notlar

- Dahili entegrasyonlar ilgili sayfaların, veritabanlarının ve veri kaynaklarının paylaşılmasını gerektirir.
- OAuth kullanıcıları, Notion yetkilendirmesi sırasında çalışma alanını/sayfaları seçer.
- OAuth uygulama kimlik bilgileri Notion credential içinde şifrelenir. Callback bunları sunucu tarafında yeniden yükler; secret, OAuth state içine gömülmez.
- Bağlı OAuth credential'ları çalışma alanı adını görüntüler; bekleyen OAuth credential'ları yetkilendirme tamamlanana kadar `Not connected` gösterir.
- **Production:** Backend **`FRONTEND_URL`** değerini genel tarayıcı URL'sine (şema + host, sonunda eğik çizgi olmadan) ayarlayın. Notion redirect URI tam olarak eşleşmelidir:
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback`.
- Düğüm, API sürümü `2026-03-11` ve güncel `data_source` terminolojisini kullanır. Eski `archived`, `after` veya database-query örneklerinden geçiş rehberliği için [Notion düğümü](../nodes/notion-node.md#api-version-notes) makalesine bakın.
- Object değeri `database` olan eski arama filtreleri `data_source` olarak normalleştirilir.

### Kullanıldığı Yerler

- [Notion düğümü](../nodes/notion-node.md)

---

## SMTP (E-posta)

SMTP credential'ı, giden posta göndermek için e-posta sunucusu bağlantı bilgilerini saklar.

### Gerekli Alanlar

| Alan | Açıklama |
|-------|-------------|
| `host` | SMTP sunucu hostname'i (örn. `smtp.gmail.com`) |
| `port` | SMTP portu (STARTTLS için genellikle `587`, SSL için `465`) |
| `email` | SMTP sunucusunun oturum açtığı kullanıcı adı; ayrıca `from` boş olduğunda görünen gönderen |
| `password` | SMTP parolası veya Uygulama Parolası |

### İsteğe Bağlı Alanlar

| Alan | Açıklama |
|-------|-------------|
| `from` (`smtp_from`) | Görünen Gönderen (From) adresi. `email` olarak göndermek için boş bırakın. Sunucu yine `email` olarak oturum açar, bu nedenle ilgili hesabın bu adres adına gönderim yapmasına izin verilmelidir (Gmail'de doğrulanmış bir **Postaları şu adresten gönder** takma adı). |

### Yaygın SMTP Sağlayıcıları

| Sağlayıcı | Host | Port | Notlar |
|----------|------|------|-------|
| Gmail | `smtp.gmail.com` | `587` | [Uygulama Parolası](https://support.google.com/accounts/answer/185833) gerektirir (2FA etkinleştirilmiş olmalıdır) |
| Outlook / Office 365 | `smtp.office365.com` | `587` | Microsoft hesap kimlik bilgilerinizi kullanın |
| Mailgun | `smtp.mailgun.org` | `587` | Alan adı ayarlarınızdaki Mailgun SMTP kimlik bilgilerini kullanın |
| SendGrid | `smtp.sendgrid.net` | `587` | Kullanıcı adı olarak `apikey` ve parola olarak bir API key kullanın |
| Özel / Kendi sunucunuzda barındırılan | alan adınız | `587` / `465` | Postfix, Exim vb. |

### Notlar

- Gmail, 2 Adımlı Doğrulama etkinleştirildiğinde normal parolanız yerine bir **Uygulama Parolası** gerektirir.
- Port `587` STARTTLS kullanır (düz metin olarak başlar, TLS'e yükseltilir). Port `465` örtük TLS kullanır (başlangıçtan itibaren SSL).

### Kullanıldığı Yerler

- [Send Email düğümü](../nodes/send-email-node.md)

---

## IMAP (Gelen E-posta)

IMAP credential'ı, [IMAP Trigger düğümü](../nodes/imap-trigger-node.md) ile bir gelen kutusunu izlemek için bağlantı bilgilerini saklar.

### Gerekli Alanlar

| Alan | Açıklama |
|-------|-------------|
| `imap_host` | IMAP sunucu hostname'i (örneğin `imap.gmail.com`) |
| `imap_port` | IMAP portu (çoğu sağlayıcıda SSL/TLS için `993`) |
| `imap_username` | Posta kutusu kullanıcı adı veya tam e-posta adresi |
| `imap_password` | Parola veya sağlayıcıya özgü uygulama parolası |

### İsteğe Bağlı Alanlar

| Alan | Açıklama |
|-------|-------------|
| `imap_mailbox` | İzlenecek posta kutusu klasörü (varsayılan: `INBOX`) |
| `imap_use_ssl` | SSL/TLS'i etkinleştir (önerilir; varsayılan: `true`) |

### Notlar

- IMAP trigger, ilk yoklamada mevcut posta kutusunun temel referansını alır ve ardından yalnızca daha yeni e-postaları işler.
- Gmail, Microsoft 365 ve diğer barındırılan sağlayıcılar genellikle bir **uygulama parolası** veya benzer IMAP'e özgü bir secret gerektirir.
- Ek içeriği workflow payload'ına indirilmez; Heym yalnızca ek meta verilerini sunar.

### Kullanıldığı Yerler

- [IMAP Trigger düğümü](../nodes/imap-trigger-node.md)
- [Trigger'lar](./triggers.md) (workflow trigger'ı olarak IMAP)

---

## RabbitMQ

[RabbitMQ](https://www.rabbitmq.com) açık kaynaklı bir mesaj aracısıdır. RabbitMQ credential'ı, kuyruklara ve exchange'lere yayın yapmak ve bunlardan tüketmek için bağlantı bilgilerini saklar.

### Gerekli Alanlar

| Alan | Açıklama |
|-------|-------------|
| `rabbitmq_host` | AMQP bağlantı URL'si (örn. `amqp://localhost:5672`) |
| `rabbitmq_username` | RabbitMQ kullanıcı adı (varsayılan: `guest`) |
| `rabbitmq_password` | RabbitMQ parolası (varsayılan: `guest`) |

### Virtual Host'lar

Belirli bir virtual host'a bağlanmak için `rabbitmq_host` URL'sine ekleyin:

```
amqp://username:password@hostname:5672/vhost
```

Varsayılan vhost kullanılıyorsa `/` yolu atlanabilir.

### Gecikmeli Mesaj Eklentisi

[RabbitMQ düğümü](../nodes/rabbitmq-node.md), **rabbitmq_delayed_message_exchange** eklentisini destekler. Bu eklenti RabbitMQ sunucunuzda etkinleştirildiğinde, düğüm üzerindeki `rabbitmqDelayMs` alanını kullanarak giden mesajlarda bir gecikme (milisaniye cinsinden) ayarlayabilirsiniz.

Düğüm, yayınlanan mesaja `x-delay` başlığını ekler. Gecikmelerin etkili olması için exchange türü `x-delayed-message` olmalıdır.

Kendi sunucunuzda barındırılan bir RabbitMQ örneğinde eklentiyi etkinleştirmek için:

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

Eklenti yüklü olmadığında `x-delay` başlığı yok sayılır ve mesajlar hemen iletilir.

### Kullanıldığı Yerler

- [RabbitMQ düğümü](../nodes/rabbitmq-node.md)
- [Trigger'lar](./triggers.md) (workflow trigger'ı olarak RabbitMQ)

---

## Amazon S3

Amazon S3 credential'ı, Heym'i [Amazon S3](https://aws.amazon.com/s3/) hizmetine bağlar. Bucket'ları ve klasörleri yönetmek, object'leri yüklemek ve indirmek, key'leri kopyalamak ve workflow'lardan object'leri listelemek veya silmek için [Amazon S3 düğümü](../nodes/amazon-s3-node.md) ile birlikte kullanın.
### Zorunlu Alanlar

| Alan | Açıklama |
|-------|-------------|
| `aws_access_key_id` | AWS IAM access key ID |
| `aws_secret_access_key` | Access key ID ile eşleştirilmiş gizli access key |
| `aws_region` | Bucket'ların bulunduğu AWS bölgesi (örn. `us-east-1`) |

### İsteğe Bağlı Alanlar

| Alan | Açıklama |
|-------|-------------|
| `aws_session_token` | AWS STS kimlik bilgileri kullanılırken geçici session token |

### Notlar

- Bu kimlik bilgisi, boto3 aracılığıyla standart AWS SigV4 kimlik doğrulamasını kullanır.
- Yükleme işlemleri şu anda UTF-8 metin içeriği gönderir; indirme işlemleri metin veya ikili nesneler için base64 döndürebilir.

### Kullanıldığı Yerler

- [Amazon S3 düğümü](../nodes/amazon-s3-node.md)

---

## Redis

[Redis](https://redis.io), önbellekleme ve hızlı veri erişimi için kullanılan bellek içi bir anahtar-değer deposudur.

### Zorunlu Alanlar

| Alan | Açıklama |
|-------|-------------|
| `host` | Redis sunucu ana bilgisayar adı veya IP'si (örn. `localhost`) |
| `port` | Redis portu (varsayılan: `6379`) |
| `password` | Redis parolası (ayarlanmamışsa boş bırakın) |

### Kullanıldığı Yerler

- [Redis düğümü](../nodes/redis-node.md)

---

## Slack

Slack kimlik bilgisi, Slack kanallarına mesaj göndermek için bir **Incoming Webhook URL**'si saklar.

### Zorunlu Alanlar

| Alan | Açıklama |
|-------|-------------|
| `webhook_url` | Slack Incoming Webhook URL'si (Slack uygulama yapılandırmanızdan) |

### Notlar

- [api.slack.com/apps](https://api.slack.com/apps) → uygulamanız → **Incoming Webhooks** adresinden bir Incoming Webhook oluşturun.
- Her webhook belirli bir kanala kapsamlandırılmıştır. Farklı kanallar için birden fazla kimlik bilgisi oluşturun.

### Kullanıldığı Yerler

- [Slack düğümü](../nodes/slack-node.md)

---

## Telegram

Telegram kimlik bilgisi, bot tabanlı workflow'lar için bir **Bot Token** ve isteğe bağlı bir **Webhook Secret Token** saklar.

### Zorunlu Alanlar

| Alan | Açıklama |
|-------|-------------|
| `bot_token` | BotFather'dan alınan Telegram Bot API token'ı |

### İsteğe Bağlı Alanlar

| Alan | Açıklama |
|-------|-------------|
| `secret_token` | Gelen webhook'larda `x-telegram-bot-api-secret-token` ile doğrulanan paylaşılan gizli anahtar |

### Notlar

- Hem [Telegram Trigger](../nodes/telegram-trigger-node.md) hem de [Telegram](../nodes/telegram-node.md) için aynı kimlik bilgisini kullanın.
- Webhook'u, Telegram Trigger düğümü panelinde gösterilen URL'yi kullanarak Telegram'ın `setWebhook` API'siyle manuel olarak kaydedin.
- Telegram düğümündeki `chatId`, sabit bir ID veya `$telegramEvent.message.chat.id` gibi bir ifade olabilir.

### Kullanıldığı Yerler

- [Telegram Trigger düğümü](../nodes/telegram-trigger-node.md)
- [Telegram düğümü](../nodes/telegram-node.md)

---

## HTTP Auth (Bearer & Header)

Bu kimlik bilgileri, giden isteklerin kimliğini doğrulamak için [HTTP düğümü](../nodes/http-node.md) tarafından kullanılır.

### Bearer

HTTP isteklerine bir `Authorization: Bearer <token>` başlığı ekler.

| Alan | Açıklama |
|-------|-------------|
| `token` | Bearer token değeri |

### Header

HTTP isteklerine özel bir başlık ekler.

| Alan | Açıklama |
|-------|-------------|
| `header_key` | Başlık adı (örn. `X-Api-Key`) |
| `header_value` | Başlık değeri |

Her iki tür de, ifade kabul eden herhangi bir düğümde dinamik kullanım için [Expression DSL](./expression-dsl.md) içinde `$credentials.CredentialName` aracılığıyla referans verilebilir.

### Kullanıldığı Yerler

- [HTTP düğümü](../nodes/http-node.md)

---

## LLM Sağlayıcıları (OpenAI, Google, Custom, Cohere)

Bu kimlik bilgileri AI düğümlerini çalıştırır.

| Tür | Açıklama |
|------|-------------|
| **OpenAI** | GPT modelleri ve OpenAI embedding'leri için API key |
| **Google** | Gemini modelleri için API key |
| **Custom** | OpenAI uyumlu endpoint'ler için API key + base URL (Ollama, vLLM, LM Studio vb.) |
| **Cohere** | Cohere embedding'leri için API key |

### OpenAI Prompt Caching

OpenAI, sistem prompt'unuzun statik (değişmeyen) önekini otomatik olarak önbelleğe alır — ek yapılandırma gerekmez. Aynı sistem prompt önekini paylaşan tekrarlanan workflow çalıştırmaları, önbelleğe alınmış token fiyatlandırmasından yararlanır; bu da hem maliyeti hem de gecikmeyi azaltır. Bu özellikle uzun, sabit talimatlarınız olduğunda ve çalıştırmalar arasında yalnızca kullanıcı mesajı değiştiğinde kullanışlıdır. Maksimum önbellek yeniden kullanımı için prompt yapınızı optimize etmek üzere [Traces sekmesinde](../tabs/traces-tab.md) veya OpenAI kullanım panosunda önbellek isabet oranlarını ve token tasarruflarını izleyin.

### Kullanıldığı Yerler

- [LLM düğümü](../nodes/llm-node.md)
- [Agent düğümü](../nodes/agent-node.md)
- [RAG düğümü](../nodes/rag-node.md) (Qdrant kimlik bilgisi aracılığıyla OpenAI embedding'leri)

---

## FlareSolverr

[FlareSolverr](https://github.com/FlareSolverr/FlareSolverr), Cloudflare ve benzeri bot koruma zorluklarını aşmak için kullanılan bir proxy sunucusudur.

### Zorunlu Alanlar

| Alan | Açıklama |
|-------|-------------|
| `flaresolverr_url` | FlareSolverr örneğinizin URL'si (örn. `http://localhost:8191`) |

Burada loopback ve özel adresler desteklenir; bu nedenle FlareSolverr'ı Heym'in yanında çalıştırmak belgelendiği gibi çalışır. URL, link-local veya cloud-metadata adresine çözümlenemez. Özel adreslere izin verildiği için bu alan başka bir dahili servise de yönlendirilebilir ve yanıt düğüm çıktısında geri döner. Oturum açmış herhangi bir kullanıcı bu kimlik bilgisini oluşturabilir; dolayısıyla sınır, kimlik bilgisi paylaşımı değil, kimlerin workflow yazabileceği ve ağ kurallarınızdır. Bkz. [Egress Safety](../nodes/crawler-node.md#egress-safety).

### Kullanıldığı Yerler

- [Crawler düğümü](../nodes/crawler-node.md)

---
## İlgili

- [Kimlik Bilgileri](./credentials.md) – Kimlik bilgilerine genel bakış ve düğümlerin bunları nasıl kullandığı
- [Kimlik Bilgileri Sekmesi](../tabs/credentials-tab.md) – Kimlik bilgilerini ekleme ve yönetme
- [Kimlik Bilgileri Paylaşımı](./credentials-sharing.md) – Kimlik bilgilerini kullanıcılar ve ekiplerle paylaşma
- [Güvenlik](./security.md) – Bekleme durumunda şifreleme, erişim kontrolü
- [Expression DSL](./expression-dsl.md) – Dinamik erişim için `$credentials` sözdizimi

---

## Model Router (Otomatik Model)

Her isteği, karar vermek için bir karar modeli kullanarak mevcut model kimlik bilgilerinizden birine yönlendirir. Yalnızca referansları saklar, kendine ait bir anahtar asla saklamaz.

### Zorunlu Alanlar

- `decision_credential_id` – erişebildiğiniz bir **Karar Modeli** kimlik bilgisi.
- `decision_model` – yönlendirme çağrısını yapan model, örneğin `jev-latest`.
- `options` – her biri bir ad, OpenAI/Google/Custom kimlik bilgilerinizden biri, üzerindeki bir model ve ne zaman kazanması gerektiğini belirten kriterler içeren en az iki girdi.

### İsteğe Bağlı Alanlar

- `routing_instructions` – seçeneklerin genel olarak nasıl değerlendirileceği.
- Bir seçenek, yönlendirme başarısız olduğunda kullanılan yedek olarak işaretlenebilir.

### Notlar

Seçenek adları, karar modelinin aralarında seçim yaptığı adlardır, bu nedenle benzersiz olmalıdır. Bir seçenek başka bir Model Router'a işaret edemez.
