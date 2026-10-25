# Node Türleri

Heym, workflow'lar oluşturmak için çeşitli node türleri sunar. Node yapılandırmasında `$input.text` ve `$nodeLabel.field` gibi [ifadeleri](./expression-dsl.md) kullanın.

## Trigger Node'ları

| Node | Açıklama | Çıktılar |
|------|-------------|---------|
| [Input](../nodes/input-node.md) | Workflow için metin giriş noktası (HTTP/[webhook](./webhooks.md)) | 1 |
| [Cron](../nodes/cron-node.md) | Bir zamanlamaya göre trigger (cron ifadesi) | 1 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Bir Telegram bot webhook güncellemesi geldiğinde trigger | 1 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Slack bir Events API webhook'u gönderdiğinde trigger | 1 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord bir uygulama etkileşim webhook'u gönderdiğinde trigger | 1 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Bir IMAP posta kutusuna yeni bir e-posta geldiğinde trigger | 1 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Heym bir platform olayı yayınladığında trigger (toplu dizi) | 1 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Harici bir WebSocket sunucusuna giden bağlantıdan trigger | 1 |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Tek kullanımlık bir yükleme bağlantısı oluşturun ve büyük bir dosya yüklendiğinde başlatın | 1 |
| [RabbitMQ](../nodes/rabbitmq-node.md) | Bir kuyruktan mesaj alındığında trigger | 1 |
| [Error Handler](../nodes/error-handler-node.md) | Herhangi bir node hata verdiğinde çalışır (gelen kenar yok) | 1 |

Tüm giriş noktaları için [Triggers](./triggers.md) bölümüne bakın.

## AI Node'ları

| Node | Açıklama | Girişler | Çıktılar |
|------|-------------|--------|---------|
| [LLM](../nodes/llm-node.md) | Metni bir dil modeliyle işleyin | 1 | 1 |
| [Decision](../nodes/decision-node.md) | Bir karar modeline tipli sorular sorun ve döndürdüğü olasılıklara göre dallanın | 1 | 1 |
| [AI Agent](../nodes/agent-node.md) | Tool calling, skills, MCP, isteğe bağlı [insan incelemesi](./human-in-the-loop.md) ve isteğe bağlı [kalıcı bellek grafiği](./agent-persistent-memory.md) içeren LLM. Bkz. [Agent Architecture](./agent-architecture.md). | 1 | 1, ayrıca isteğe bağlı `review` çıktısı |
| [Codex](../nodes/codex-node.md) | Bir ChatGPT/Codex erişim token'ı kullanarak yerel Codex CLI'yi bir GitHub deposuna karşı çalıştırın | 1 | 1, ayrıca `question` çıktısı |
| [OpenCode Go](../nodes/opencode-go-node.md) | Bir OpenCode Go gateway API anahtarı kullanarak OpenCode CLI'yi sıkılaştırılmış bir container içinde bir GitHub deposuna karşı çalıştırın | 1 | 1 |
| [MCP Call](../nodes/mcp-call-node.md) | Bir LLM'in seçmesine gerek kalmadan belirli bir MCP aracını doğrudan çağırın | 1 | 1 |
| [RAG / Vector Store](../nodes/rag-node.md) | RAG için bir Qdrant veya Postgres (pgvector) [vector store](../tabs/vectorstores-tab.md) içine ekleyin, upsert edin, silin veya arayın (vektör veya hibrit vektör + BM25) | 1 | 1 |

## Logic Node'ları

| Node | Açıklama | Girişler | Çıktılar |
|------|-------------|--------|---------|
| [Condition](../nodes/condition-node.md) | if/else'e göre dallanın | 1 | 2 (true/false) |
| [Switch](../nodes/switch-node.md) | Bir değeri durumlarla eşleştirerek yönlendirin | 1 | n |
| [Merge](../nodes/merge-node.md) | Birden fazla girişi bekleyin ve birleştirin | n | 1 |
| [Loop](../nodes/loop-node.md) | Bir dizi üzerinde yineleyin | 1 | 2 (loop/done) |

## Data Node'ları

| Node | Açıklama | Girişler | Çıktılar |
|------|-------------|--------|---------|
| [Set](../nodes/set-node.md) | Verileri dönüştürün ve eşleyin | 1 | 1 |
| [Converter](../nodes/converter-node.md) | Verileri formatlar arasında dönüştürün (CSV, JSON, XML) ve görüntüleri veya PDF'leri OCR ile metne çevirin | 1 | 1 |
| [Code](../nodes/code-node.md) | Kendi requirements.txt dosyasıyla, tek kullanımlık, ağdan izole bir sandbox içinde Python çalıştırın | 1 | 1 |
| [Variable](../nodes/variable-node.md) | Bir değişken ayarlayın veya alın (workflow'a özel veya [global](./global-variables.md)) | 1 | 1 |
| [Execute](../nodes/execute-node.md) | Başka bir workflow'u çağırın | 1 | 1 |
| [Heym](../nodes/heym-node.md) | Heym workflow'larını ve yürütme geçmişini okuyun | 1 | 1 |

## Entegrasyon Node'ları

| Node | Açıklama | Girişler | Çıkışlar |
|------|-------------|--------|---------|
| [HTTP](../nodes/http-node.md) | HTTP istekleri yapın (cURL) | 0 veya 1 | 1 |
| [WebSocket Send](../nodes/websocket-send-node.md) | Harici bir WebSocket'e bağlanın ve tek bir mesaj gönderin | 1 | 1 |
| [Telegram](../nodes/telegram-node.md) | Telegram bot mesajları gönderin | 1 | 1 |
| [Slack](../nodes/slack-node.md) | Slack mesajları gönderin | 1 | 1 |
| [Discord](../nodes/discord-node.md) | Discord webhook mesajları gönderin | 1 | 1 |
| [Send Email](../nodes/send-email-node.md) | SMTP üzerinden e-posta gönderin | 1 | 1 |
| [Redis](../nodes/redis-node.md) | Redis işlemleri (set, get, hasKey, deleteKey) | 1 | 1 |
| [Grist](../nodes/grist-node.md) | Grist elektronik tablolarını okuyun/yazın | 1 | 1 |
| [GitHub](../nodes/github-node.md) | GitHub REST API aracılığıyla depoları, kullanıcıları, issue'ları, pull request'leri, incelemeleri, sürümleri, Actions workflow'larını ve dosyaları yönetin | 1 | 1 |
| [Jira](../nodes/jira-node.md) | Jira REST API aracılığıyla Jira projelerini, issue'ları, yorumları, ekleri, kullanıcıları, bildirimleri ve workflow geçişlerini yönetin | 1 | 1 |
| [Linear](../nodes/linear-node.md) | GraphQL aracılığıyla Linear takımlarını, projelerini, issue'ları, workflow durumlarını ve yorumlarını yönetin | 1 | 1 |
| [Google Sheets](../nodes/google-sheets-node.md) | OAuth2 aracılığıyla Google Sheets'i okuyun/yazın | 1 | 1 |
| [Google Drive](../nodes/google-drive-node.md) | OAuth2 aracılığıyla Google Drive dosyalarını listeleyin, indirin, güncelleyin ve silin | 1 | 1 |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery'de SQL sorguları çalıştırın ve satır ekleyin | 1 | 1 |
| [Supabase](../nodes/supabase-node.md) | PostgREST aracılığıyla Supabase tablolarını sorgulayın ve değiştirin | 1 | 1 |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse'a karşı SQL, CRUD ve sayım işlemleri çalıştırın | 1 | 1 |
| [Notion](../nodes/notion-node.md) | Notion veritabanlarını, veri kaynaklarını, sayfalarını ve bloklarını yönetin | 1 | 1 |
| [Sentry](../nodes/sentry-node.md) | Sentry organizasyonlarını, projelerini, takımlarını, issue'ları, olaylarını ve sürümlerini yönetin | 1 | 1 |
| [Amazon S3](../nodes/amazon-s3-node.md) | Bucket'ları ve klasörleri yönetin; nesneleri listeleyin, yükleyin, indirin, kopyalayın ve silin | 1 | 1 |
| [DataTable](../nodes/datatable-node.md) | Heym DataTable'larını okuyun/yazın (birinci taraf depolama) | 1 | 1 |
| [Drive](../nodes/drive-node.md) | Drive dosyalarını yönetin: silin, parola belirleyin, TTL, maksimum indirme, takımla paylaşın/paylaşımı kaldırın | 1 | 1 |

## Otomasyon Node'ları

| Node | Açıklama | Girişler | Çıkışlar |
|------|-------------|--------|---------|
| [Crawler](../nodes/crawler-node.md) | FlareSolverr ile web sayfalarını kazıyın | 1 | 1 |
| [Playwright](../nodes/playwright-node.md) | AI adımı ve Auto Heal ile tarayıcı otomasyonu | 1 | 1 |

## Yardımcı Node'lar

| Node | Açıklama | Girişler | Çıkışlar |
|------|-------------|--------|---------|
| [Wait](../nodes/wait-node.md) | Yürütmeyi geciktirin | 1 | 1 |
| [Output](../nodes/output-node.md) | Çıkış endpoint'i | 1 | 1 |
| [JSON output mapper](../nodes/json-output-mapper-node.md) | Alanları bir JSON nesnesine eşleyin; tek terminal = üst düzey webhook/çalıştırma gövdesi | 1 | 0 |
| [HTML output mapper](../nodes/html-output-mapper-node.md) | Bir HTML sayfası oluşturun; tek terminal = webhook text/html ile yanıt verir | 1 | 0 |
| [Chart Output](../nodes/chart-output-node.md) | Yukarı akış satırlarını grafik payload'larına eşleyen terminal dashboard widget çıkışı | 1 | 0 |
| [Sticky Note](../nodes/sticky-note-node.md) | Tuvale markdown notları ekleyin (yürütülmez) | 0 | 0 |
| [Console Log](../nodes/console-log-node.md) | Arka uç konsoluna kaydedin | 1 | 1 |
| [Disable Node](../nodes/disable-node.md) | Workflow'daki başka bir node'u devre dışı bırakın | 1 | 1 |
| [Enable Node](../nodes/enable-node.md) | Workflow'daki devre dışı bırakılmış bir node'u etkinleştirin | 1 | 1 |
| [Throw Error](../nodes/throw-error-node.md) | Workflow'u hata yanıtıyla durdurun | 1 | 0 |

## Plugin Node'ları

Plugin node'ları, örnek üzerinde yüklü olan plugin'ler tarafından sağlanır. Yüklü her
plugin, palet içinde **Plugins** altında kendi adıyla görünür; arka planda
bu iki node türünden birine eşlenir.

| Node | Açıklama | Girişler | Çıkışlar |
|------|-------------|--------|---------|
| [Plugin](../nodes/plugin-node.md) | Yüklü bir plugin tarafından sağlanan özel eylem | 1 | 1 |
| [Plugin Trigger](../nodes/plugin-trigger-node.md) | Yüklü bir plugin tarafından sağlanan özel trigger | 0 | 1 |

## İlgili

- [Canvas Özellikleri](./canvas-features.md) – Data pin, execution logları, etkinleştirme/devre dışı bırakma, alt workflow'a çıkarma
- [Agent Node](../nodes/agent-node.md) – AI Agent node'u için ayrıntılı referans
- [Agent Mimarisi](./agent-architecture.md) – Alt agent'lar, orkestratör, yetenekler, MCP, tool çağrısı
- [Agent Kalıcı Belleği](./agent-persistent-memory.md) – Node başına bilgi grafiği, paylaşım ve arka planda çıkarma
- [Human-in-the-Loop](./human-in-the-loop.md) – İnsan onayı için agent çıktısını duraklatma
- [Expression DSL](./expression-dsl.md) – Node yapılandırmasında verilere başvurma
- [Expression Değerlendirme Diyaloğu](./expression-evaluation-dialog.md) – Canlı backend önizlemeli genişletilebilir düzenleyici
- [File Upload Trigger](../nodes/file-upload-trigger-node.md) – Tek kullanımlık linkler üzerinden büyük multipart yüklemeleri kabul edin
- [WebSocket Trigger](../nodes/websocket-trigger-node.md) – Gerçek zamanlı giden socket trigger'ı
- [WebSocket Send](../nodes/websocket-send-node.md) – Harici socket'lere mesaj gönderin
- [Workflow Yapısı](./workflow-structure.md) – Node'lar ve edge'ler için JSON formatı
- [Trigger'lar](./triggers.md) – Tüm workflow giriş noktaları
- [Credentials Sekmesi](../tabs/credentials-tab.md) – LLM, HTTP ve diğer node'lar için API anahtarları ekleyin
- [Credentials Paylaşımı](./credentials-sharing.md) – Credential'ları diğer kullanıcılarla paylaşın
- [Portal](./portal.md) – Workflow'ları herkese açık sohbet arayüzleri olarak sunun
- [Vectorstores Sekmesi](../tabs/vectorstores-tab.md) – RAG node'ları için vector store'lar oluşturun
