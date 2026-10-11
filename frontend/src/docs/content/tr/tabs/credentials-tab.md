# Credentials Sekmesi

**Credentials** sekmesi, node'lar tarafından kullanılan API anahtarlarını ve secret'ları yönetir. Credential'ları buradan ekleyin ve workflow node'larında adlarıyla referans verin. Credential'ların ne olduğu ve node'ların bunları nasıl kullandığına dair genel bir bakış için bkz. [Credentials](../reference/credentials.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Credentials demosunu izleyin</a></p>

## Credential Türleri

| Tür | Kullanım Amacı |
|------|----------|
| **OpenAI** | LLM, Agent ve RAG node'ları için OpenAI API anahtarı |
| **Google** | Google AI (Gemini) API anahtarı |
| **GitHub** | GitHub API, GitHub node workflow'ları, MCP sunucuları ve agent workflow'ları için GitHub personal access token (PAT); isteğe bağlı GitHub Enterprise `base_url` |
| **Linear** | Ekipler, projeler, issue'lar ve yorumlar için Linear personal API key veya OAuth2 |
| **Notion** | Internal integration token veya public-integration OAuth workspace yetkilendirmesi |
| **Custom** | Özel LLM endpoint'leri |
| **Bearer** | HTTP auth için Bearer token |
| **Header** | HTTP istekleri için özel header key-value |
| **Telegram** | Telegram bot token ve isteğe bağlı webhook secret |
| **Slack** | Slack incoming webhook URL |
| **Discord** | Discord incoming webhook URL |
| **Discord Trigger** | Discord uygulaması public key |
| **IMAP** | Gelen kutusu trigger credential'ları |
| **SMTP** | E-posta gönderme credential'ları |
| **Redis** | Redis bağlantısı |
| **RAG: Qdrant + OpenAI** | Harici bir Qdrant sunucusu tarafından desteklenen, RAG node'ları için vector store |
| **RAG: Psql + OpenAI** | Heym'in kendi Postgres veritabanı (pgvector) tarafından desteklenen, RAG node'ları için vector store — harici servis gerekmez |
| **RAG: Custom Embeddings** | Store olarak Qdrant veya Postgres (pgvector) kullanan, OpenAI uyumlu herhangi bir embedding endpoint'i ile RAG node'ları için vector store |
| **Cohere** | Embedding'ler için Cohere API |

## Credential Ekleme

1. **Add Credential** seçeneğine tıklayın
2. Credential türünü seçin
3. Gerekli değerleri girin (API key, URL vb.)
4. Node'larda referans vermek için bir ad verin

GitHub için mevcut credential akışı PAT tabanlıdır. Fine-grained PAT'ler önerilir. GitHub App kurulum akışları bugün arayüzde birinci sınıf desteklenmemektedir. GitHub Enterprise Server kullanıyorsanız, isteğe bağlı olarak `https://github.example.com/api/v3` gibi bir GitHub API base URL de ayarlayabilirsiniz.

Linear için iletişim kutusunda **Personal API key** veya **OAuth2** seçin. Personal API key'ler Linear'da
**Settings → Security & Access → Personal API keys** altında oluşturulur. OAuth2, bir Linear OAuth
uygulamasının Client ID ve Client Secret'ını kullanır ve redirect URI olarak
`{FRONTEND_URL}/api/credentials/linear/oauth/callback` kaydedilir. Credential, onu oluşturan veya
yetkilendiren Linear kullanıcısının izinleriyle hareket eder. Kaydetmeden önce API key veya
OAuth token'ı doğrulamak için credential iletişim kutusundaki **Test Connection** seçeneğini kullanın.

**Notion** için iletişim kutusunda **Internal token** veya **OAuth** seçin. OAuth, Notion public
integration'ınızın Client ID ve Client Secret'ını kullanır; Heym bunları credential içinde şifreli olarak saklar.
Bir workflow'u kaydetmeden önce Supabase, Linear veya Notion credential'larını doğrulamak için **Test Connection** kullanın. Notion kurulum ayrıntıları için
[Third-Party Integrations](../reference/integrations.md#notion) bölümüne bakın.

OAuth credential'ları, sağlayıcının yetkilendirme sayfasını bir popup içinde açar. Tarayıcı bunu engellerse, Connect düğmesinin altındaki **Open the authorization page** bağlantısını kullanın; bağlantı tamamlandığında iletişim kutusu bunu fark eder. Yeni bir credential bağlandığında, düğme **Connected** olarak görünür.

## Düzenleme ve Silme

- **Edit** – Credential değerlerini güncelleyin (hassas değerler maskelenir)
- **Delete** – Bir credential'ı kaldırın; onu kullanan workflow'ların bir yedeğe ihtiyacı olacaktır

GitHub Enterprise Server üzerinde bir **GitHub** credential'ını düzenlerken, isteğe bağlı **GitHub
API Base URL** alanını boş bırakmak mevcut Enterprise endpoint'ini korur. Bu endpoint'i
değiştirmek istediğinizde yeni bir URL girin.

## Paylaşım

- Credential'ları e-posta ile diğer kullanıcılarla veya [Teams](../reference/teams.md) ile [paylaşın](../reference/credentials-sharing.md)
- Paylaşılan credential'lar bir gösterge ile görünür
- Credential kartı menüsünden paylaşımı iptal edin

## Node'larda Kullanım

Node yapılandırmasında credential'lara adlarıyla başvurun. Örneğin:
- [LLM node](../nodes/llm-node.md) – Model API'si için credential seçin
- [HTTP node](../nodes/http-node.md) – Kimlik doğrulama için Bearer veya Header credential'larını kullanın
- [Agent node](../nodes/agent-node.md) – GitHub token'larını `GITHUB_PERSONAL_ACCESS_TOKEN` gibi MCP server ortam değişkenlerine aktarın
- [GitHub node](../nodes/github-node.md) – Yerel GitHub repository, kullanıcı, issue, review, release, workflow, traffic ve dosya işlemlerini çalıştırın
- [Linear node](../nodes/linear-node.md) – Workspace meta verilerini okuyun ve Linear issue'ları ile yorumlarını otomatikleştirin
- [Notion node](../nodes/notion-node.md) – Notion veritabanlarını, veri kaynaklarını, sayfalarını ve bloklarını yönetin
- [RAG node](../nodes/rag-node.md) – Vector store için bir Qdrant veya Postgres (pgvector) credential'ı kullanın
- [Telegram Trigger node](../nodes/telegram-trigger-node.md) – Telegram bot webhook'larını alın
- [Telegram node](../nodes/telegram-node.md) – Telegram bot mesajları gönderin
- [Discord Trigger node](../nodes/discord-trigger-node.md) – Discord interaction webhook'larını alın
- [Discord node](../nodes/discord-node.md) – Discord webhook mesajları gönderin
- [IMAP Trigger node](../nodes/imap-trigger-node.md) – Yeni e-posta için paylaşılan bir gelen kutusunu yoklayın

İfadelerde credential destekli değerlere başvurmak için [Expression DSL](../reference/expression-dsl.md) sayfasına bakın.

## İlgili

- [Third-Party Integrations](../reference/integrations.md) – Her credential türü için ayrıntılı kurulum kılavuzu (Telegram, Discord, Qdrant, Grist, IMAP, SMTP, RabbitMQ, Redis, Slack ve daha fazlası)
- [Credentials Sharing](../reference/credentials-sharing.md) – Credential'ları diğer kullanıcılarla paylaşın
- [Security](../reference/security.md) – Bekleme durumunda şifreleme, oturum yönetimi, hız sınırlama
- [Node Types](../reference/node-types.md) – Credential kullanan node'lar ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [GitHub](../nodes/github-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md))
- [Vectorstores Tab](./vectorstores-tab.md) – Qdrant veya Postgres (pgvector) credential'larını kullanır
- [Chat Tab](./chat-tab.md) – OpenAI/Google credential'larını kullanır
- [Contextual Showcase](../reference/contextual-showcase.md) – Dashboard yüzeyleri için kompakt sayfa kılavuzu
