# Kimlik Bilgisi Paylaşımı

Credential'lar, workflow'larının API anahtarlarınızı kullanabilmesi için diğer kullanıcılarla paylaşılabilir. Genel bir bakış için [Credentials](./credentials.md) ve credential ekleme ve yönetme için [Credentials Sekmesi](../tabs/credentials-tab.md) bölümlerine bakın.

## Bir LLM ile Credential Paylaşımı

Bir LLM'in veya bir AI agent'ın bir API anahtarını kullanmasına izin vermek için, anahtarı bir credential olarak saklayın ve isteği yapan düğümün bunu eklemesini sağlayın. Model neyin çağrılacağına karar verir; düğüm çalıştığında çağrının kimlik doğrulamasını yapar.

- **Gizli değeri bir credential olarak saklayın.** Hassas değerler beklemede şifrelenir ve oluşturulduktan sonra arayüzde maskelenir.
- **İsteğin yapıldığı yerde buna başvurun.** [LLM](../nodes/llm-node.md) ve [Agent](../nodes/agent-node.md) düğümleri model credential'larını ID ile seçer ve HTTP istekleri auth header'ına `$credentials.CredentialName` koyar. Gizli değerleri prompt alanlarından uzak tutun, çünkü bir prompt'taki her şey metin olarak model sağlayıcısına gönderilir.
- **Agent'a anahtar değil, araç verin.** Bir Agent bir HTTP düğümünü, bir MCP sunucusunu veya bir alt workflow'u araç olarak çağırdığında, credential o aracın içinde uygulanır ve model aracın sonucunu alır.
- **Çıktılar maskelenir.** Yedi karakterden uzun bir credential değeri bir düğümün çıktısında göründüğünde, yalnızca ilk yedi karakteri korunur; böylece bir anahtarı yansıtan bir yanıt, sonuçlarda ve izlerde yalnızca bu öneki gösterir. Bkz. [Çıktı Maskeleme](#output-masking).
- **Asistanın credential oluşturmasına izin verin.** [AI Assistant](./ai-assistant.md#credentials) veya Chat sekmesi bir credential oluşturduğunda, yalnızca adı ve türü görür ve gizli değeri normal credential formuna siz girersiniz.
- **İnsanlarla da aynı şekilde paylaşın.** Credential'ı aşağıda açıklandığı gibi bir kullanıcı veya bir ekiple paylaşın; onların workflow'ları kendi LLM ve Agent düğümleri aracılığıyla anahtarınızı kullanabilir.

## Paylaşım Modeli

- **CredentialShare** – `credential_id` değerini `user_id` değerine bağlar (her çift için benzersiz)
- **E-posta ile paylaşım** – E-posta ile `POST /api/credentials/{credential_id}/shares`; kullanıcı aranır ve eklenir
- **İptal etme** – `DELETE /api/credentials/{credential_id}/shares/{user_id}`

Credential'ları [Teams](./teams.md) ile de paylaşabilirsiniz:

- **CredentialTeamShare** – `credential_id` değerini `team_id` değerine bağlar; tüm ekip üyeleri erişim kazanır
- **Ekip ile paylaşım** – `team_id` ile `POST /api/credentials/{credential_id}/team-shares`
- **Ekip paylaşımını iptal etme** – `DELETE /api/credentials/{credential_id}/team-shares/{team_id}`

Paylaşılan credential'lar [Credentials Sekmesi](../tabs/credentials-tab.md) arayüzünde bir gösterge görüntüler.

## Geniş Kapsamlı Credential'lar

Bir credential'ı paylaşmak, alıcıya o credential'ın yapabileceği her şeyi verir. Çoğu entegrasyon için bu, tek bir workspace veya tek bir API anahtarının izinleriyle sınırlıdır, ancak bazı credential'lar çok daha geniştir.

> **Google Drive credential'ları tam Drive erişimi verir.** [Google Drive](../nodes/google-drive-node.md) credential'ı, düğümün zaten sahip olduğunuz dosyalar üzerinde işlem yapabilmesi için `https://www.googleapis.com/auth/drive` kapsamıyla yetkilendirilir. Bunu bir kullanıcı veya bir ekiple paylaşmak, her birine bir workflow aracılığıyla **Google Drive'ınızdaki her şeyi okuma, değiştirme ve kalıcı olarak silme** olanağı verir — yalnızca aklınızdaki dosyaları değil. Bunu yalnızca doğrudan tam Drive erişimi vereceğiniz kişilerle paylaşın.

Maruziyeti sınırlamanız gerekiyorsa, yalnızca workflow'un ihtiyaç duyduğu klasörlere erişimi olan özel bir Google hesabı oluşturun ve credential'ı birincil hesabınız yerine o hesapla bağlayın.

Bir **Decision Model** credential'ı endpoint'i ve ayarlandığında bir API anahtarını taşır. Bunu paylaşmak, alıcının çalıştırabildiği herhangi bir workflow'dan o anahtar üzerinden harcama yapmasına izin verir; tıpkı bir LLM credential'ı gibi.

Bir **Model Router** credential'ı, yönlendirdiği her şeyi paylaşır. Paylaştığınız kişiler, seçenek listesindeki her credential'a karşı istek çalıştırabilir ve bu istekler sizin anahtarlarınızdan harcama yapar. Anahtarları okuyamazlar ve credential'lar kendi credential listelerinde görünmez.

Bu, doğrudan bir OpenAI credential'ı paylaşmakla aynı yetkidir ve bir router'ı bir ekip için faydalı kılan da budur. Bunu istemiyorsanız, bunun yerine tek tek credential'ları paylaşın ve her kişinin bir model seçmesine izin verin.

## Workflow İşbirlikçileriyle Paylaşım

Bir workflow'u paylaştığınızda, işbirlikçiler onu açıp çalıştırabilir ancak o credential'ları onlarla da paylaşmadığınız sürece credential'larınızı kullanamazlar. Bu, ana workflow'daki ve çağırdığı tüm alt workflow'lardaki credential'lar için geçerlidir. Her credential'ı, workflow'a davet ettiğiniz aynı kullanıcılar veya ekiplerle paylaşın. Alt workflow'lar ayrıca alt workflow'un editöründen ayrı olarak paylaşılmalıdır. Bkz. [Workflow Organizasyonu](./workflow-organization.md#sharing-workflows).

## Yürütme Bağlamı

Bir workflow çalıştığında, credential'lar **workflow sahibi** (veya çalıştırırken geçerli kullanıcı) için çözümlenir. `get_credentials_context()` şunları birleştirir:

1. **Sahip olunan credential'lar** – `Credential.owner_id == user_id`
2. **Kullanıcıyla paylaşılan credential'lar** – `CredentialShare.user_id == user_id` olan `CredentialShare`
3. **Ekip ile paylaşılan credential'lar** – kullanıcının ekibin bir üyesi olduğu `CredentialTeamShare`

Hepsi, credential adına göre anahtarlanmış tek bir bağlam sözlüğünde birleştirilir.

## Workflow'larda Kullanım
### İsme Göre (Expression DSL)

Kimlik bilgileri, [Expression DSL](./expression-dsl.md) içinde `$credentials.CredentialName` olarak sunulur. Bunu şunlar için kullanın:

- HTTP düğümleri (Bearer/Header kimlik doğrulaması)
- Telegram düğümleri
- Slack düğümleri
- Özel HTTP isteklerinde Notion bearer token'ları (dahili token veya OAuth access token)
- Kimlik doğrulama için ifade kabul eden tüm düğümler

```dsl
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

### ID'ye Göre (credentialId)

Bazı düğümler `node.data` içinde `credentialId` (UUID) saklar:

| Düğüm Türü | Alan | Açıklama |
|-----------|-------|-------------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md), Image Gen | `credentialId` | LLM API kimlik bilgisi |
| [Codex](../nodes/codex-node.md) | `credentialId`, `githubCredentialId` | Codex access token kimlik bilgisi ve GitHub kimlik bilgisi |
| [OpenCode Go](../nodes/opencode-go-node.md) | `credentialId`, `githubCredentialId` | OpenCode Go gateway kimlik bilgisi ve GitHub kimlik bilgisi |
| [Jira](../nodes/jira-node.md) | `credentialId` | Jira Cloud e-posta/API token'ı veya Data Center kullanıcı adı/parola kimlik bilgisi |
| [Notion](../nodes/notion-node.md) | `credentialId` | Notion dahili token'ı veya OAuth workspace kimlik bilgisi |
| [Sentry](../nodes/sentry-node.md) | `credentialId` | Sentry auth token'ı ve isteğe bağlı base URL |
| [Supabase](../nodes/supabase-node.md) | `credentialId` | Supabase proje URL'si ve API anahtarı |
| [ClickHouse](../nodes/clickhouse-node.md) | `credentialId` | ClickHouse bağlantı ayrıntıları (host, port, auth, database) |
| [Telegram Trigger](../nodes/telegram-trigger-node.md), [Telegram](../nodes/telegram-node.md) | `credentialId` | Telegram bot kimlik bilgisi |
| [Discord Trigger](../nodes/discord-trigger-node.md), [Discord](../nodes/discord-node.md) | `credentialId` | Discord public key veya webhook kimlik bilgisi |
| Vector Store | `credential_id` | Qdrant veya Postgres (pgvector) vector DB, bir Qdrant, Psql veya Custom Embeddings RAG kimlik bilgisi aracılığıyla |
| Evals | `credential_id`, `judge_credential_id` | Model kimlik bilgisi; LLM-as-Judge judge için bir model veya Decision Model kimlik bilgisi |
| [Playwright](../nodes/playwright-node.md) AI adımı | `credentialId` | LLM/Vision modeli (AI adımı ve [Auto Heal](../nodes/playwright-node.md#ai-auto-heal) için) |

Executor, kimlik bilgisini doğrudan veritabanından ID ile yükler ve yapılandırmayı şifresini çözer.

## Çıktı Maskeleme

Yürütmeden sonra, `mask_sensitive_output()` çıktılardaki kimlik bilgisi değerlerini maskeler; yedi karakterden uzun her gizli değerin ilk yedi karakterini korur ve geri kalanını `**` ile değiştirir, böylece gizli değerler sonuçlarda veya izlerde açığa çıkmaz.

## İlgili

- [Credentials Tab](../tabs/credentials-tab.md) – Kimlik bilgilerini ekleyin ve paylaşın
- [Third-Party Integrations](./integrations.md) – Her kimlik bilgisi türü için ayrıntılı kurulum
- [Teams](./teams.md) – Ekiplerle paylaşın
- [Expression DSL](./expression-dsl.md) – `$credentials` sözdizimi
- [Node Types](./node-types.md) – Kimlik bilgilerini kullanan düğümler ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [Playwright](../nodes/playwright-node.md), [HTTP](../nodes/http-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md))
- [Agent Node](../nodes/agent-node.md) – LLM için `credentialId` kullanır
