# Heym Neden?

Heym, AI agent'larını production ortamında çalıştırmak ve yönetmek için bir altyapıdır. Tek bir self-hosted runtime, agent yaşam döngüsünün her aşamasını kapsar.

Bir prototip agent'ın bir modele, bir prompt'a ve birkaç araca ihtiyacı vardır. Bir production agent'ının ayrıca trigger'lara ve yeniden denemelere, bir kişi için durakladığında kaydedilmiş duruma, her model ve araç çağrısının kaydına, her çalıştırma için bir maliyete, bir değişiklik yayınlanmadan önce testlere ve kendi başına neler yapabileceğine dair net sınırlara ihtiyacı vardır. Heym tüm bunları tek bir yerde tutar, böylece canvas üzerinde tasarladığınız sistem, çalışan sistemdir. Agentic sistemler oluşturun, ardından bunları güvenle çalıştırın.

## Agent Yaşam Döngüsü için Tek Bir Runtime

| Aşama | Heym size ne sağlar |
|---|---|
| **Build** | Canvas üzerinde agent'ları ve deterministik adımları oluşturun, bunları [AI Assistant](../reference/ai-assistant.md) ile üretin veya [Templates](../tabs/templates-tab.md) ve taşınabilir skill'lerden başlayın. |
| **Orchestrate** | Agent'ları, [sub-agent'ları](../reference/agent-architecture.md), coding agent'ları, RAG'ı, browser otomasyonunu ve araçları açık veri akışı ve [paralel yürütme](../reference/parallel-execution.md) ile koordine edin. |
| **Run** | Çalıştırmaları [webhook'lar](../reference/webhooks.md), zamanlamalar ve olay [trigger'ları](../reference/triggers.md) ile başlatın; node başına yeniden denemeler, [hata yönetimi](../nodes/error-handler-node.md) ve instance'lar arasında [yük dağıtımı](../reference/cluster.md) ile. |
| **Observe** | Her yürütmeyi [history](../reference/execution-history.md), [LLM trace'leri](../tabs/traces-tab.md), çalıştırma başına USD maliyeti, canvas üzerindeki canlı çalıştırmalar, [analytics](../tabs/analytics-tab.md), [alerts](../tabs/alerts-tab.md) ve [OpenTelemetry](../reference/opentelemetry.md) dışa aktarımı aracılığıyla inceleyin. |
| **Evaluate** | Prompt'ları ve modelleri beklenen çıktılara karşı [Evals](../tabs/evals-tab.md) içinde test edin; LLM-as-Judge puanlaması ve yan yana model karşılaştırması ile. |
| **Control** | [Review checkpoint'leri](../reference/human-in-the-loop.md) ve [guardrail'ler](../reference/guardrails.md) ile kontrolü insanlarda tutun ve erişimi şifrelenmiş [credential'lar](../reference/credentials.md), [teams](../reference/teams.md), [single sign-on](../reference/sso.md) ve bir [audit trail](../reference/audit.md) ile yönetin. |
| **Expose** | Workflow'ları REST ve [SSE](../reference/sse-streaming.md) üzerinden, [MCP](../tabs/mcp-tab.md) araçları olarak, [Portal](../reference/portal.md) chat UI'ları olarak ve [dashboard](../tabs/dashboard-tab.md) widget'ları olarak sunun. |

## Build

### AI Assistant: Doğal Dille Workflow Oluşturun

[AI Assistant](../reference/ai-assistant.md), workflow editörü içindeki bir chat panelidir. Ne istediğinizi tanımlayın, örneğin "kullanıcı girdisi alan, bilgi tabanımda arama yapan ve GPT-4o kullanarak yanıt veren bir workflow oluştur" ve assistant, canvas'a anında uygulanan node'lar ve edge'ler üretir.

- Kendi LLM credential'ınızı kullanır (desteklenen herhangi bir model)
- Eller serbest workflow tasarımı için **sesli giriş** destekler
- AI yanıtından gelen geçerli workflow JSON'unu canvas'a otomatik uygular
- Yanıtları gerçek zamanlı olarak stream eder

Assistant doğrudan editör içinde çalışır ve node'ları gerçek zamanlı olarak canvas'a stream eder; ürettiği her şey elle yerleştirdiğiniz node'lar gibi düzenlenebilir kalır.

### Skills Sistemi

Skill'ler taşınabilir yetenek paketleridir; bir `SKILL.md` talimat dosyası ve isteğe bağlı Python script'lerinden oluşur ve herhangi bir Agent node'una bırakılabilir.

- Skill'in talimatları agent'ın system prompt'unun başına eklenir
- Skill içindeki Python dosyaları çağrılabilir araçlar haline gelir
- Skill'ler workflow'lar arasında yeniden kullanılabilir ve `.zip` arşivleri olarak paylaşılabilir

Bu, agent'ınıza tek seferde bir iş tanımı ve bir araç kutusu vermeye benzer.

### Workflow Analyzer: Çalıştırma Farkındalıklı Geri Bildirim

[Workflow Analysis](../reference/workflow-analysis.md) paneli, editöre yerleştirilmiş çalıştırma farkındalıklı bir dokümantasyon ve geri bildirim aracıdır. **Analyze**'a tıklayın, bir LLM credential'ı ve model seçin ve Heym mevcut workflow için düzenlenebilir bir Markdown raporu üretir.

Statik bir nottan farklı olarak, analyzer önce mümkün olduğunda workflow'u çalıştırır ve yürütme sonucunu prompt'a dahil eder. Rapor; iyileştirme alanlarını, workflow'un amacını ve node'ların ne yaptığına dair adım adım bir açıklamayı kapsar. Bir rapor zaten mevcut olduğunda, **Reanalyze** ayrı bir önizleme stream eder; böylece yeni sürümü kabul edebilir veya mevcut paylaşılan dokümanı koruyabilirsiniz.

## Orchestrate

### Yerleşik LLM ve Agent Node'ları

Heym'in [Agent Node](../nodes/agent-node.md) yapısı, satır içi Python araçları, MCP bağlantıları ve taşınabilir bir skills sistemi ile sıkı entegre bir tool-calling döngüsü çalıştırır; tümü üretim agent'ları için tasarlanmıştır.

Heym'in sade [LLM node](../nodes/llm-node.md) yapısı da tek bir prompt-yanıt adımının ötesine geçer. Desteklenen OpenAI ve OpenAI uyumlu endpoint'ler için **Batch API moduna** geçebilir; böylece tek bir node, daha düşük maliyetli sağlayıcıya özgü bir batch isteğinde bir prompt dizisi gönderir. Canvas daha sonra, batch `pending`, `processing` ve `completed` gibi durumlar arasında ilerlerken tetiklenen özel bir `batchStatus` dalı sunar.

Bu, LLM node'unun aynı anda iki şey yapabileceği anlamına gelir:

- Ana batch isteğini çalıştırıp nihai öğe bazlı çıktıları normal dalda döndürmek
- Akışı özel bir polling döngüsüne dönüştürmeden, her anlamlı batch durum güncellemesinde bildirim veya loglama mantığını tetiklemek

Batch yürütme, node arayüzünde sağlayıcı ve model yetenek kontrolleriyle birlikte birinci sınıf bir LLM workflow primitifidir.

**Agent Node**, Heym'de agent orkestrasyonunun merkezidir:

- **Tool calling** – Agent, nihai bir yanıt üretene kadar bir döngü içinde tool çağrıları üzerinde yineler
- **Python araçları** – Tam Python ile satır içi özel araçlar tanımlayın; agent bunları çalışma zamanında çağırır
- **MCP bağlantıları** – Herhangi bir [Model Context Protocol](https://modelcontextprotocol.io/) sunucusuna (stdio veya SSE) bağlanın; agent tüm araçlarını otomatik olarak alır
- **Skills** – Sistem bağlamını genişletmek ve Python tooling eklemek için bir agent'a `.zip` veya `.md` dosyası bırakın
- **Sub-workflow çağrıları** – Agent, özel kod yazmadan karmaşık davranışları bir araya getirerek diğer Heym workflow'larını araç olarak çağırabilir

Tam referans için [Agent Node](../nodes/agent-node.md) ve [Agent Architecture](../reference/agent-architecture.md) sayfalarına bakın.

### Çoklu Agent Orkestrasyonu

Heym, birinci sınıf görsel primitiflerle bir **orchestrator pattern** destekler:

- Bir agent **orchestrator** (`isOrchestrator: true`) olarak görev yapar ve ona bir `call_sub_agent` aracı verilir
- Aynı canvas üzerindeki adlandırılmış **sub-agent'lara** görev devreder
- Sub-agent'lar kendileri de diğer agent'ları veya sub-workflow'ları çağırabilir (maksimum derinlik: 5)
- **Paralel yürütme**: Orchestrator tek bir turda birden fazla sub-agent çağırdığında, daha hızlı sonuç için paralel çalışırlar

Bu, işi bir araştırmacıya, bir kodlayıcıya ve bir özetleyiciye yönlendiren bir planlama agent'ı gibi mimarileri, özel orkestrasyon kodu olmadan tamamen görsel olarak bağlamayı mümkün kılar.

Yürütme ayrıntıları için [Agent Architecture](../reference/agent-architecture.md) sayfasına bakın.

### Workflow Node'ları Olarak Coding Agent'lar

Heym, bir chat completion değil, gerçek bir coding agent'ı workflow adımı olarak çalıştıran iki node sunar:

- **[Codex Node](../nodes/codex-node.md)** – OpenAI Codex CLI'yi izole bir Heym workspace'inde bir GitHub deposuna karşı çalıştırır. **Sign in with ChatGPT** (Plus/Pro aboneliğinizde PKCE OAuth, token başına API maliyeti yok) veya bir access token destekler, depoyu klonlar, Codex'in kodu düzenlemesine izin verir ve `summary`, `diff`, `changedFiles` ile bir taslak `pullRequestUrl` döndürür.
- **[OpenCode Go Node](../nodes/opencode-go-node.md)** – Sağlayıcıdan bağımsız OpenCode gateway (Kimi, DeepSeek, Qwen ve daha fazlası) üzerinden aynı depo workflow'u, **sertleştirilmiş tek kullanımlık bir container** içinde yürütülür: tüm yetenekler kaldırılmış, salt okunur root, pid/bellek/CPU limitleri. GitHub token sandbox'ın dışında kalır: Heym her git ve GitHub işlemini host tarafında gerçekleştirir, böylece üretilen kod push kimlik bilgilerini sızdıramaz.

Bu, bir workflow'un bir webhook'tan bir hatayı triyaj etmesi, depoyu bir coding agent'a teslim etmesi, taslak PR'ı beklemesi ve bağlantıyı Slack'e göndermesi anlamına gelir; tamamen otomatik ve dağıtım başına yapılandırılabilir kaynak limitleriyle.

### Yerleşik RAG Pipeline

Heym, bir [RAG / Vector Store Node](../nodes/rag-node.md) ve yönetilen bir [Vectorstores](../tabs/vectorstores-tab.md) sekmesi içerir. Şunları yapabilirsiniz:

- Vektör arka ucunuzu seçin: **Qdrant** (harici sunucu) veya **Postgres (pgvector)**; ikincisi vektörleri Heym'in kendi veritabanında saklar ve çalıştırılacak ekstra bir servis gerektirmez
- Belgeleri doğrudan bir workflow node'undan bir vector store'a ekleyin
- Semantik arama yapın ve sonuçları bir LLM veya Agent node'una besleyin
- Sonuçlara `$ragNode.results.map("item.payload.content").join("\n\n")` gibi ifadelerle başvurun

Heym'de RAG, embeddings ve retrieval üzerinde tam kontrole sahip iki node'dur.

### Playwright ile Tarayıcı Otomasyonu

[Playwright node](../nodes/playwright-node.md), canvas üzerinde birinci taraf tarayıcı otomasyonudur.

- **Steps modu** – Navigate, click, type, fill, screenshot, extract ve scroll eylemlerini görsel olarak bir araya getirin
- **Auto-heal özellikli AI adımları** – Bir eylemi doğal dilde tanımlayın; bir LLM Playwright eylemlerini üretir; başarısız selector'lar otomatik olarak iyileştirilebilir ve üretilen adımlar gelecekteki LLM çağrılarını atlamak için önbelleğe alınabilir
- **Run Code modu** – Karmaşık akışlar için node'u tam Playwright Python'a geçirin (varsayılan olarak devre dışıdır; etkinleştirildiğinde Heym'in sertleştirilmiş sandbox'ında çalışır)
- **Kimliği doğrulanmış oturumlar** – Çalıştırmadan önce cookie'leri/`storageState`'i geri yükleyin, bir selector kontrolüyle oturum açmayı doğrulayın ve komut dosyalı login adımlarına geri dönün
- **Ağ yakalama** – İsteğe bağlı olarak sonuçların yanı sıra JSON yanıtlarını, header'ları, cookie'leri ve tarayıcı depolamasını toplayın

Heym, tarayıcıyı diğer her şeyle aynı ifadeler, kimlik bilgileri ve hata işleme özelliklerine sahip normal bir node olarak ele alır.

### Expression DSL

Heym'in [Expression DSL](../reference/expression-dsl.md) yapısı, üst düğüm verilerine başvurmak için temiz ve güçlü bir sözdizimi sunar:

- `$input.text` – Input düğümü verisi
- `$nodeName.field` – Herhangi bir üst düğümün çıktı alanı
- `$global.variableName` – Kalıcı global değişkenler
- Dizi yardımcıları: `.first()`, `.map("field")`, `.join("\n")`

Expression'lar prompt'lar, HTTP header'ları, koşullar ve set değerleri dahil olmak üzere her string alanında çalışır; böylece veriler adımlar arasında açıkça taşınır. DSL, tam JavaScript bilgisi gerektirmeden güç ile okunabilirliği dengeler.

## Çalıştırma

### Trigger'lar, Yeniden Denemeler ve Hata Yolları

Bir workflow birçok yerden başlayabilir. [Input](../nodes/input-node.md) düğümleri HTTP [webhook'larını](../reference/webhooks.md) alır, [Cron](../nodes/cron-node.md) bir zamanlamaya göre çalışır ve event [trigger'ları](../reference/triggers.md) Telegram, Discord, Slack, IMAP gelen kutuları, WebSocket akışları, RabbitMQ kuyrukları, dosya yüklemeleri ve Heym platform event'lerinden run başlatır.

Hatalar graph içinde ele alınır. Herhangi bir düğüm, belirlenen sayıda deneme ve aralarında bekleme süresiyle başarısızlık durumunda yeniden deneyebilir, her deneme [execution history](../reference/execution-history.md) içinde kaydedilir ve bir düğüm başarısız olduğunda bir [Error Handler](../nodes/error-handler-node.md) düğümü otomatik olarak çalışır; böylece kurtarma, workflow'un kendisinin bir parçasıdır.

### Paralel DAG Yürütme

Heym'in workflow executor'ı yönlü çevrimsiz graph (DAG) zamanlayıcısı kullanır. Bağımsız düğümler otomatik olarak paralel çalışır, herhangi bir yapılandırma gerekmez.

- Aynı bağımlılık seviyesindeki düğümler bir thread pool'a (`max_workers=8`) eşzamanlı olarak gönderilir
- Herhangi bir düğüm tamamlanır tamamlanmaz, alt düğümleri zamanlanır
- [Merge Node](../nodes/merge-node.md) paralel dal sonuçlarını birleştirir
- Birden fazla workflow run'ı eşzamanlı olarak yürütülür; her run tamamen izole edilmiştir

Paralellik, graph yapısı tarafından belirlenen varsayılan davranıştır.

Bkz. [Parallel Execution](../reference/parallel-execution.md).

### Instance'lar Arasında Ölçekleme

İkinci bir Heym instance'ını aynı PostgreSQL veritabanına yönlendirin; bir worker olarak katılır. Arka plan run'ları, sizin belirlediğiniz ağırlıklara göre instance'lar arasında paylaşılır, seçilen bir leader failover boyunca schedule'ları, alert değerlendirmesini ve crash recovery'yi çalışır durumda tutar ve her run onu yürüten instance'ı kaydeder. Bkz. [Load Distribution](../reference/cluster.md).

### Agentic Kanban Board

[Board sekmesi](../tabs/board-tab.md), sütunların kendilerinin workflow çalıştırdığı yerleşik bir Kanban board'dur. Bir kart; context, konuşma geçmişi, execution state, çıktılar ve workflow run'larını taşıyan kalıcı bir agentic job'dır.

- **Sütun workflow zincirleri** – Bir kartı bir sütuna taşımak o sütunun workflow zincirini tetikler; bir **Agentic Kanban Model** (credential'ınız + model) kart içeriğini workflow input'larına eşler ve çıktıları tekrar okunabilir metne dönüştürür
- **Kart ekleri** – Bir karta dosya bırakın; her run'dan önce belgeler metne çıkarılır ve görseller vision yetenekli modellere iletilir
- **Canlı run canvas'ı** – Bir kart içindeki aktif run'ı açın ve gerçek workflow canvas'ında düğüm düğüm yürütülüşünü izleyin
- **Ekip paylaşımı** – Board'ları okuma/yazma izinleriyle kullanıcılar veya ekiplerle paylaşın; paylaşılan board'lardaki zincirler sahibin credential'larıyla çalışır, böylece iş birlikçilerin kendi credential'larına hiç ihtiyacı olmaz
- **Hata görünürlüğü** – Başarısız kartlar bir hata geçmişi göstergesi ortaya çıkarır ve takip run'ları yorumları beklemek için durabilir

Board, platformun yerel bir yüzeyidir: kartlar, workflow'lar, credential'lar ve canlı run'ların tümü tek bir yerde bulunur.

### Heym Drive: Yerleşik Dosya Depolama

[Drive sekmesi](../tabs/drive-tab.md), platforma yerleşik bir dosya deposudur. Skill'ler ve workflow'lar tarafından üretilen dosyalar (PDF, DOCX, CSV, görseller) otomatik olarak oraya iner ve board kart ekleri de orada saklanır.

- **Paylaşım link'leri** – İsteğe bağlı son kullanma tarihi ve maksimum indirme limitleriyle genel veya parola korumalı (Basic Auth) indirme link'leri
- **Ekip paylaşımı** – Dosyaları ekiplerinizle salt okunur olarak paylaşın ve tüm ekip paylaşımlarını tek bir işlemle kaldırın
- **Toplu işlemler** – Shift-tık aralıklarıyla çoklu seçim yapın, seçimleri tek bir ZIP indirmesinde paketleyin veya tek bir paylaşım/parola/silme ayarını birçok dosyaya aynı anda uygulayın
- **Agent erişimi** – Skill'ler Drive dosyalarını okumayı seçebilir, böylece bir agent sizin veya diğer workflow'ların ürettiği belgeler üzerinde çalışabilir

Üretilen artifact'lar platform içinde kalıcı, paylaşılabilir bir yuvaya kavuşur.

## Gözlemleme

### LLM Trace'leri

[Traces Sekmesi](../tabs/traces-tab.md) her LLM çağrısı için tam gözlemlenebilirlik sağlar:

- Request ve response payload'ları
- Çağrı başına zamanlama: `llm_ms`, `tools_ms`, `mcp_list_ms`
- Tool call adları, argümanları ve sonuçları
- Modele iletilen skill'ler

Trace sistemi, tam request ve response payload'ları ve çağrı başına zamanlamayla agentic davranışı hata ayıklamak için özel olarak tasarlanmıştır.

### LLM Token Maliyet Takibi

Heym'deki her LLM çağrısı otomatik olarak maliyetlendirilir. [Traces Sekmesi](../tabs/traces-tab.md), senkronize edilmiş bir fiyatlandırma tablosundan türetilen gerçek zamanlı USD maliyetiyle birlikte her trace için giriş ve çıkış token sayılarını gösterir.

- **Trace başına maliyet** – Her trace satırında gösterilen giriş token'ları, çıkış token'ları ve toplam USD
- **Maliyet analitiği** – KPI kartları ve model başına maliyet grafiği, seçilen zaman aralığıyla (1s / 24s / 7g / 30g / Tümü) güncellenir
- **LLM Maliyet Tablosu** – [DataTable sekmesindeki](../tabs/datatable-tab.md) bir sistem tablosu her 24 saatte bir Helicone'dan beslenir; fiyatları geçersiz kılabilir veya henüz listelenmemiş modeller için özel satırlar ekleyebilirsiniz
- **Eksik fiyat uyarısı** – Fiyatlandırma girdisi olmayan modellerin trace'leri, maliyet tablosuna doğrudan bağlantı içeren satır içi bir uyarı gösterir

Her yürütme, modele göre ayrıştırılmış kendi USD maliyetini taşır.

### Üretim Çalışmalarını Canlı Canvas'ta Açın

Bir üretim workflow'u, editör dışında başladıktan sonra da incelenebilir kalır. Herhangi bir History diyaloğundan **Running** girdisini açın veya bir Agentic Kanban kartındaki etkin çalışmayı açın; Heym normal workflow editörünü tam o yürütmeye bağlar.

- Zaten tamamlanmış düğümler sonuçlarıyla birlikte hemen görünür
- Geçerli düğüm ve bekleyen alt düğümler, yürütme ilerledikçe nabız atmaya devam eder
- Debug paneli, canvas'ta başlatılan bir çalışmayla aynı artımlı düğüm sonuçlarını alır
- Nihai çıktı ve yürütme vurguları, yoklama yapmadan veya yinelenen bir çalışma başlatmadan gelir
- Editörü kapatmak yalnızca gözlemciyi bağlantıdan ayırır; üretim workflow'unu asla iptal etmez

Gözlemci, çalışanlar arası bir yürütme anlık görüntüsüyle desteklenen SSE kullanır; bu nedenle çalışmayı başka bir arka uç çalışanı yönetiyor olsa bile webhook, schedule, chat, MCP, integration ve Board trigger'ları için çalışır.

### OpenTelemetry, Analytics ve Alerts

Heym, her workflow çalışması, düğüm yürütmesi ve Agent aracı çağrısı için [OpenTelemetry](../reference/opentelemetry.md) span'ları yayar ve bunları OTLP/HTTP üzerinden Jaeger, Grafana Tempo, Honeycomb, Datadog veya diğer uyumlu arka uçlara aktarır.

[Analytics](../tabs/analytics-tab.md) sekmesi, workflow başına çalışma sayılarını, başarı oranını, süreyi ve eğilimleri izler. [Alerts](../tabs/alerts-tab.md) ise bir zaman penceresi boyunca hata sayılarını, çalışma süresini, token veya USD harcamasını ve yürütme hacmini izler, ardından seçtiğiniz bir bildirim workflow'unu çalıştırır; böylece bir uyarı Slack'e, e-postaya, Telegram'a veya bir düğümün ulaşabileceği herhangi bir yere ulaşır.

## Evaluate

### Yerleşik Evals

[Evals Sekmesi](../tabs/evals-tab.md), test paketleri tanımlamanıza ve bunları agent workflow'larınıza karşı çalıştırmanıza olanak tanır:

- Girdiler ve beklenen çıktılarla test senaryoları oluşturun veya bunları paket prompt'undan üretin
- Bir paketi birden fazla modele karşı çalıştırın ve çıktılarını yan yana karşılaştırın
- Exact Match, Contains veya bağımsız bir hakem modeliyle LLM-as-Judge ile puanlayın
- Geçme/kalma durumunu, gerçek ile beklenen değerleri ve çalışma geçmişini inceleyin

Bir prompt'u veya modeli değiştirin, paketi yeniden çalıştırın ve sonuçları değişiklik üretime ulaşmadan önce karşılaştırın.

## Control

### Human-in-the-Loop (HITL)

Heym, agent'ların yürütmeyi duraklatmasına, insan incelemesi talep etmesine ve tam olarak kaldıkları yerden devam etmesine olanak tanıyan yerleşik bir [Human-in-the-Loop](../reference/human-in-the-loop.md) sistemine sahiptir.

- **Agent kontrol noktaları** – Herhangi bir Agent düğümünde `hitlEnabled` seçeneğini etkinleştirerek ona bir `request_human_review` aracı verin. Agent, bir kararın insan gözetimi gerektirdiğine karar verir ve aracı bir özet ve taslakla çağırır.
- **Genel inceleme URL'leri** – Her inceleme talebi, `/review/{token}` adresinde güvenli, tek kullanımlık bir bağlantı oluşturur (168 saatlik TTL). İnceleyenler oturum açmadan **kabul edebilir**, **düzenleyip devam edebilir** veya **reddedebilir**.
- **Yürütme anlık görüntüleri** – Workflow, tam durumunu (konuşma geçmişi, değişkenler, araç sonuçları) dondurur; böylece inceleyen yanıt verdikten sonra tam olarak duraklatıldığı yerden devam eder.
- **Bildirim dalı** – İsteğe bağlı bir `review` çıktı tutamacı, bir inceleme talep edildiğinde tetiklenen bir bildirim akışı (Slack, e-posta, webhook) bağlamanıza olanak tanır.
- **MCP araç onay politikaları** – Yazılı HITL yönergeleri, onay kapsamlarına (`always` / `once` / `never`) yorumlanır; böylece agent düşük riskli araçları otomatik onaylayabilir ve yüksek riskli olanları yükseltebilir.
- **Birden fazla kontrol noktası** – Tek bir agent çalışması, inceleme için birden çok kez duraklayabilir; her kontrol noktası bağımsızdır.

Genel inceleme URL'leri, düzenle-ve-devam-et, bildirim dallanması ve anlık görüntü tabanlı devam etme, hepsi aynı agent kontrol noktasından çalışır.

Tam referans için [Human-in-the-Loop](../reference/human-in-the-loop.md) bölümüne bakın.

### LLM Guardrails

Heym, hem [LLM](../nodes/llm-node.md) hem de [Agent](../nodes/agent-node.md) düğümlerinde yerleşik [Guardrails](../reference/guardrails.md) özelliğine sahiptir; böylece bir model yanıtı alt adımlara ulaşmadan önce güvenli olmayan içeriği engelleyebilirsiniz.

- **Düğüm düzeyinde güvenlik anahtarı** – Guardrails'i doğrudan kullanıcıya yönelik içerik üreten veya işleyen düğümde etkinleştirin
- **Geniş politika kapsamı** – Şiddet, nefret söylemi, cinsel içerik, NSFW/küfür, taciz, yasa dışı faaliyet, kişisel veri talepleri ve prompt injection girişimlerini engelleyin
- **Çok dilli algılama** – Aynı güvenlik kurallarını Türkçe, İngilizce, Arapça, İspanyolca ve diğer dillerde uygulayın
- **Workflow'a özgü geri dönüş** – Bir mesaj engellendiğinde, düğüm bir [Error Handler](../nodes/error-handler-node.md) üzerinden yönlendirebileceğiniz tipli bir workflow hatası fırlatır

Güvenlik politikası doğrudan LLM ve Agent yapılandırmasının içinde yaşar ve doğrudan workflow dallanmasına ve hata işlemeye bağlanır.

### Erişim, Kimlik Bilgileri ve Denetim

Agent'lar gerçek kimlik bilgileriyle hareket eder, bu nedenle erişim yönetişimin bir parçasıdır. [Kimlik bilgileri](../reference/credentials.md) bekleme durumunda şifrelenir, oluşturulduktan sonra maskelenir ve kullanıcılarla veya [takımlarla](../reference/teams.md) paylaşılabilir; takımlar ayrıca workflow'ları, değişkenleri, vector store'ları ve Drive dosyalarını paylaşır. [Tek oturum açma](../reference/sso.md), Okta, Entra ID, Keycloak, Auth0 ve Google dahil olmak üzere herhangi bir OpenID Connect sağlayıcısına bağlanır. [Denetim izi](../reference/audit.md), güvenlikle ilgili her eylemi aktörü, hedefi ve sonucuyla birlikte kaydeder ve container log'larınızla birlikte halihazırda kullandığınız log toplayıcısına veya SIEM'e aktarılır.

### Self-Hosted, Veriniz Size Aittir

Heym kendi altyapınızda çalışır. Workflow'lar, kimlik bilgileri, yürütme geçmişi ve trace'ler kendi veritabanınızda bulunur; model çağrıları sunucularınızdan seçtiğiniz sağlayıcıya veya Ollama ya da vLLM aracılığıyla kendi barındırdığınız bir modele gider. Hassas belgeleri, müşteri verilerini veya tescilli bilgi tabanlarını işleyen agent'lar için bu genellikle katı bir gerekliliktir.

Heym, **Commons Clause koşuluyla MIT Lisansı** altında lisanslanmıştır. Kaynak kodu source-available'dır: özgürce kullanabilir, değiştirebilir ve self-host edebilirsiniz. Commons Clause, yazılımın satışını, değeri büyük ölçüde Heym'den türeyen ücretli hosting veya danışmanlık/destek hizmetleri sunmak dahil olmak üzere kısıtlar. Ticari lisanslama, kurumsal dağıtımlar veya profesyonel destek için [enterprise@heym.run](mailto:enterprise@heym.run) adresine başvurun.

## Sunma

### API'ler ve Streaming

Workflow'lar HTTP üzerinden `/api/workflows/{workflow_id}/execute` adresinde çağrılabilir; bu adres JSON döndürür ve `/api/workflows/{workflow_id}/execute/stream` adresinde çağrılabilir; bu adres çalışma ilerledikçe node olaylarını Server-Sent Events olarak akıtır. Her ikisi de workflow düzeyinde kimlik doğrulamayı, hız sınırlamayı ve yanıt önbelleğe almayı paylaşır. [Webhook'lar](../reference/webhooks.md) ve [SSE Streaming](../reference/sse-streaming.md) bölümlerine bakın.

### MCP (Model Context Protocol) Entegrasyonu

Heym, her iki tarafta da yerel [MCP](../tabs/mcp-tab.md) desteğine sahiptir:

- **Client olarak**: Agent node'ları harici MCP sunucularına (Filesystem, Browserbase, özel araçlar) stdio veya SSE aracılığıyla bağlanır ve araçlarını otomatik olarak tüketir
- **Server olarak**: MCP etkinleştirilmiş workflow'lar, `/api/mcp/sse` adresindeki varsayılan sunucuda veya kendi URL'si ve API key'i olan adlandırılmış sunucularda araç haline gelir; böylece Claude Desktop, Cursor ve diğer MCP client'ları Heym workflow'larınızı doğrudan çağırabilir

Agent'lar aynı anda birden fazla MCP sunucusunu tüketebilir ve herhangi bir workflow harici bir MCP client'ı için araç haline gelebilir.

### Portal: Workflow'ları Chat UI Olarak Yayınlama

[Portal](../reference/portal.md) özelliği, herhangi bir workflow'u `/chat/{slug}` adresinde herkese açık bir chat arayüzüne dönüştürür:

- Kullanıcı başına kimlik bilgileriyle isteğe bağlı kimlik doğrulama
- Streaming yürütme (gerçek zamanlı node ilerlemesi)
- Dosya yükleme desteği
- Çok turlu konuşma geçmişi

Takımlar, bir workflow ve bir URL'den dahili araçlar, müşteriye yönelik chatbot'lar ve AI destekli formlar sunar; yazılacak frontend kodu yoktur.

### Workflow Destekli Dashboard'lar

[Dashboard sekmesi](../tabs/dashboard-tab.md), her chart widget'ının kendi gizli Heym workflow'u tarafından desteklendiği, kullanıcı tarafından oluşturulan bir raporlama yüzeyidir. Bir widget API'leri çağırabilir, BigQuery sorgulayabilir, RAG/vector store'larda arama yapabilir, LLM adımlarını çalıştırabilir, satırları dönüştürebilir ve bir [Chart Output node](../nodes/chart-output-node.md) ile bitirebilir. Widget'ları manuel olarak oluşturabilir, AI ile üretebilir, daha sonra ince ayar yapabilir, sonuçları önbelleğe alabilir ve grid'i görsel olarak yeniden düzenleyebilirsiniz.

## Workflow Otomasyon Araçlarıyla Karşılaştırma

Birçok ekip Heym'e workflow otomasyon araçlarından geliyor. Aşağıdaki tablo, agent'lar üretimde çalışmaya başladığında önem kazanan yetenekler açısından Heym'i n8n, Zapier ve Make.com ile karşılaştırmakta ve altındaki dipnotlar karşılaştırmanın arkasındaki resmi dokümantasyona atıfta bulunmaktadır. Her seferinde bir araca daha derinlemesine bakmak için [heym.run/compare](https://heym.run/compare) adresindeki karşılaştırma sayfalarına göz atın.

| Yetenek | Heym | n8n | Zapier | Make.com |
|---|---|---|---|---|
| Yerleşik LLM node | ✓ | ✓ | ✓ | ✓ |
| LLM Batch API + durum dalları | ✓ | sınırlı¹¹ | –¹¹ | sınırlı¹¹ |
| Yerleşik Agent node (tool calling) | ✓ | ✓ | ✓ | ✓ |
| Çoklu agent orkestrasyonu | ✓ | ✓ | sınırlı | sınırlı |
| Kodlama agent node'ları (Codex, OpenCode) | ✓ | –²⁰ | –²⁰ | –²⁰ |
| Yerleşik RAG / vector store | ✓ | ✓ | sınırlı¹ | plugin² |
| WebSocket okuma / yazma | ✓ | sınırlı¹² | –¹³ | –¹⁴ |
| Doğal dil workflow oluşturucu | ✓ | sınırlı³ | ✓ | ✓ |
| Workflow Analyzer | ✓ | –¹⁸ | –¹⁸ | –¹⁸ |
| Devam eden bir çalıştırmayı canlı canvas üzerinde açma | ✓ | sınırlı¹⁹ | sınırlı¹⁹ | –¹⁹ |
| Workflow destekli dashboard'lar | ✓ | sınırlı¹⁷ | sınırlı¹⁷ | sınırlı¹⁷ |
| Agentic Kanban board | ✓ | –²¹ | –²¹ | –²¹ |
| MCP (Model Context Protocol) | ✓ | ✓ | ✓ | ✓ |
| Agent'lar için Skills sistemi | ✓ | – | – | – |
| Yerleşik dosya sürücüsü (paylaşım linkleri, ekipler) | ✓ | sınırlı²² | sınırlı²² | –²² |
| Tarayıcı otomasyonu node'u (Playwright) | ✓ | sınırlı²³ | sınırlı²³ | –²³ |
| LLM trace incelemesi | ✓ | sınırlı⁴ | – | ✓ |
| OpenTelemetry tracing dışa aktarımı | ✓ | ✓¹⁶ | –¹⁶ | –¹⁶ |
| LLM token maliyet takibi (USD) | ✓ | –¹⁵ | –¹⁵ | sınırlı¹⁵ |
| AI workflow'ları için yerleşik evals | ✓ | ✓ | – | – |
| Human-in-the-Loop (HITL) | ✓ | ✓⁵ | sınırlı⁶ | sınırlı⁷ |
| LLM guardrail'leri | ✓ | ✓⁸ | ✓⁸ | sınırlı⁸ |
| Otomatik bağlam sıkıştırma | ✓ | – | – | – |
| Paralel DAG yürütme | ✓ | sınırlı⁹ | – | – |
| Self-host edilebilir, kaynak kodu açık | ✓ MIT + Commons Clause | ✓ fair-code¹⁰ | – | – |
| Dinamik veriler için Expression DSL | ✓ | ✓ | sınırlı | ✓ |

> **Dipnotlar:** ¹ Zapier Knowledge Sources — açığa çıkarılmış bir vector store veya embedding kontrolü yok. ² Make.com'da Pinecone/Qdrant modülleri var ancak yerleşik bir RAG düğümü yok. ³ n8n AI Workflow Builder yalnızca bulut tabanlı beta olup kredi sınırlarına sahiptir. ⁴ n8n ara adımları gösterir; tam izleme için üçüncü taraf araçlar gerekir. ⁵ n8n, sohbet, e-posta ve iş birliği kanalları üzerinden AI tool-call onaylarını destekler, ancak Heym'in yaptığı gibi tüm yürütmeyi anlık görüntüleyip sürdürmez. ⁶ Zapier Human in the Loop, Zaps içinde onayları ve veri toplamayı destekler, ancak bu bir genel inceleme, snapshot-resume checkpoint sistemi değildir. ⁷ Make.com, Human in the Loop'u inceleme talepleri ve adjusted/approved/canceled sonuçlarıyla bir Enterprise uygulaması olarak sunar, ancak planla sınırlı kalır ve daha az agent-native'tir. ⁸ n8n özel bir Guardrails düğümü sunar, Zapier AI ürünleri genelinde AI Guardrails sunar ve Make.com agent kuralları ile inceleme akışlarını belgeler ancak karşılaştırılabilir bağımsız bir guardrails özelliği belgelemez, bu nedenle Make sınırlı olarak işaretlenmiştir. ⁹ n8n varsayılan olarak sıralı yürütür; paralellik için sub-workflow geçici çözümleri gerekir. ¹⁰ Sustainable Use License — dahili kullanım için kendi kendine barındırma ücretsizdir, ticari yeniden dağıtım kısıtlıdır. ¹¹ 22 Nisan 2026 itibarıyla, n8n'in resmi dokümanları yerleşik bir LLM batch-status dalı yerine HTTP batching ve loop/wait kalıplarını açıklar, Zapier'in resmi ChatGPT uygulaması dokümanları hiçbir trigger listelemez ve yalnızca genel bir API Request beta sunar ve Make'in resmi OpenAI entegrasyon sayfası create/watch completed gibi batch eylemlerini açığa çıkarır ancak birinci sınıf bir status-branching LLM düğümü sunmaz, bu nedenle bu özel workflow kalıbı için n8n/Make sınırlı ve Zapier kullanılamaz olarak işaretlenmiştir. ¹² n8n'in resmi dokümanları HTTP Webhook ve HTTP Request düğümlerinin yanı sıra Code/custom/community genişletilebilirliğini kapsar, ancak birinci taraf bir WebSocket trigger/send düğümü bulamadım, bu nedenle n8n sınırlı olarak işaretlenmiştir. ¹³ Zapier'in resmi dokümanları yalnızca HTTP üzerinden gelen webhook'ları ve giden webhook/API isteklerini kapsar, yerleşik WebSocket trigger veya send adımlarını değil. ¹⁴ Make'in resmi dokümanları Webhooks modüllerini ve HTTP(S) request modüllerini kapsar, ancak yerleşik bir WebSocket trigger veya send modülü bulamadım. ¹⁵ n8n'de yerleşik LLM token maliyet takibi yoktur; topluluk geçici çözüm workflow'ları mevcuttur ancak manuel kurulum ve yürütme sonrası API çağrıları gerektirir (Mayıs 2026 itibarıyla açık özellik talebi). Zapier kullanıcılara yürütme başına token sayısı veya USD maliyeti sunmaz; AI adımları yalnızca görev tüketir. Make.com'un kredi panosu Make tarafından barındırılan AI için token tüketimini kısmen yansıtır (Ağustos 2025'ten beri) ancak üçüncü taraf API anahtarı bağlantıları 1 işlem = 1 kredi olarak faturalandırılır ve token sayımı yapılmaz; modele göre yürütme başına USD dökümü mevcut değildir. ¹⁶ Heym, herhangi bir uyumlu backend'e OTLP/HTTP üzerinden yerleşik OpenTelemetry span'leri yayar (workflow çalıştırması başına bir tane artı düğüm başına bir tane), W3C trace-context yayılımı ile ve enstrümantasyon kodu olmadan, `HEYM_OTEL_*` ortam değişkenleri aracılığıyla yapılandırılır ve varsayılan olarak devre dışıdır. n8n, workflow ve düğüm yürütmeleri için belgelenmiş bir OpenTelemetry izleme entegrasyonuna sahiptir. Zapier ve Make.com, Haziran 2026 itibarıyla workflow/scenario yürütmelerinin OpenTelemetry dışa aktarımını belgelemez. ¹⁷ n8n üretim yürütme metrikleri için bir Insights panosu belgeler, Zapier Zap History artı Task Usage belgeler ve Make.com Scenario History belgeler; bunlar izleme/geçmiş yüzeyleridir, Heym'in Dashboard sekmesi gibi rastgele workflow mantığıyla desteklenen özel pano widget'ları değildir. ¹⁸ Heym Workflow Analyzer mümkün olduğunda workflow'u çalıştırır, yürütme sonucunu okur ve iyileştirme alanlarını, amacı ve adım adım davranışı kapsayan paylaşılan düzenlenebilir bir Markdown raporu oluşturur. n8n workflow oluşturma/iyileştirme/hata ayıklama için AI Workflow Builder belgeler, Zapier hatalı Zap çalıştırmaları için AI sorun giderme belgeler ve Make.com senaryo geçmişi artı AI agent akıl yürütme adımlarını belgeler, ancak resmi dokümanları aynı çalıştırma farkındalıklı paylaşılan workflow analiz belgesini tanımlamaz. ¹⁹ [n8n All executions](https://docs.n8n.io/workflows/executions/all-executions/) çalışan yürütmeleri listeler ve önceki bir yürütmeden gelen verileri editöre yükleyebilir, [Zapier run statuses](https://help.zapier.com/hc/en-us/articles/20505304170637-Review-run-statuses-in-Zap-workflows) editöründe bir çalışıyor durumunu açığa çıkarır. [Make Scenario History](https://help.make.com/scenario-history) çalıştırma ayrıntısını ve günlükleri belgeler. 18 Temmuz 2026'da kontrol edilen resmi dokümanları, Heym'in tam akışını tanımlamaz: History'den veya bir Kanban kartından rastgele devam eden bir üretim çalıştırmasını açın, mevcut düğüm anlık görüntüsünü geri yükleyin ve aynı tuval üzerinde düğüm animasyonu ile Debug günlüklerini almaya devam edin. ²⁰ Heym'in [Codex](../nodes/codex-node.md) ve [OpenCode Go](../nodes/opencode-go-node.md) düğümleri, izole bir Heym çalışma alanında bir GitHub deposuna karşı gerçek bir kodlama agent CLI'si çalıştırır — klonla, düzenle, bir diff üret, bir dal gönder, bir pull request aç — birinci sınıf bir workflow adımı olarak. 20 Temmuz 2026 itibarıyla, hiçbir rakip eşdeğerini belgelemez: n8n'in [OpenAI node](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai) sohbet/asistan API çağrılarını kapsar, depo düzeyinde bir kodlama agent'ini değil ve yerleşik Codex desteği bir topluluk talebi olarak kalır; Zapier'in kendi blogu ters yönü belgeler — [Codex'in Zapier MCP aracılığıyla Zapier araçlarını yönlendirmesi](https://zapier.com/blog/automate-codex-zapier-mcp/) — Codex'in bir Zap adımı olarak kullanımını değil; Make.com'un OpenAI modülleri completions/assistants/batch eylemlerini açığa çıkarır, depoları klonlayan ve PR açan bir kodlama agent'ini değil. ²¹ Heym'in [Board tab](../tabs/board-tab.md) sekmesi, sütunları workflow'ları yürüten ve kartları bağlam, konuşma geçmişi, yürütme durumu ve çalıştırmaları taşıyan yerleşik bir agentic Kanban panosudur. n8n ([Kanban Tool integration](https://n8n.io/integrations/kanban-tool/)), Zapier ([Kanban Tool integrations](https://zapier.com/apps/kanbantool/integrations)) ve Make.com ([Kanban Tool integration](https://www.make.com/en/integrations/kanban-tool)) yalnızca Kanban Tool, Wekan veya NocoDB gibi üçüncü taraf kanban uygulamalarına bağlanır; hiçbiri 20 Temmuz 2026 itibarıyla kendi workflow'larını çalıştıran yerleşik bir pano belgelemez. ²² n8n yürütme ikili verilerini dahili olarak depolar (isteğe bağlı olarak [S3 uyumlu harici depolama](https://docs.n8n.io/hosting/scaling/external-storage/) üzerinde) ancak paylaşım bağlantıları veya ekip paylaşımı olan kullanıcıya yönelik bir dosya sürücüsü belgelemez, bu nedenle sınırlı olarak işaretlenmiştir. Zapier'in [Files by Zapier](https://zapier.com/apps/files-by-zapier/integrations) dosyaları yalnızca bir Zap çalıştırması süresince işler ve [Storage by Zapier](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps) küçük metin değerlerini tutar, bu nedenle Zapier sınırlı olarak işaretlenmiştir. Make.com'un [data stores](https://help.make.com/l6du-data-stores) yapılandırılmış kayıtları tutar ve [file handling](https://help.make.com/working-with-files) dosyaları kalıcı yerleşik depolama olmadan uygulamalar arasında aktarır, bu nedenle Make kullanılamaz olarak işaretlenmiştir. ²³ Heym'in [Playwright node](../nodes/playwright-node.md) düğümü, görsel adımlar modu, AI tarafından oluşturulan adımlar ve tam kod modu ile birinci taraf tarayıcı otomasyonudur. n8n yalnızca [n8n-playwright](https://github.com/toema/n8n-playwright) gibi topluluk paketleri sunar ve [yerleşik tarayıcı otomasyon düğümleri için hâlâ açık bir özellik talebi](https://community.n8n.io/t/front-end-web-mobile-app-test-automation-nodes/129796) bulunur, bu nedenle sınırlı olarak işaretlenmiştir. Zapier Agents [web tarama ve bir Chrome uzantısı aracılığıyla sayfaları tarayıp okuyabilir](https://help.zapier.com/hc/en-us/articles/29025734470925-Use-Zapier-Agents-Chrome-extension) ancak Zapier betikli tarayıcı otomasyon adımı belgelemez, bu nedenle sınırlı olarak işaretlenmiştir. Make.com, 20 Temmuz 2026 itibarıyla herhangi bir yerleşik tarayıcı otomasyon modülü yerine HTTP modüllerini ve üçüncü taraf scraping uygulamalarını belgeler.

## İlgili

- [Giriş](./introduction.md) – Platforma genel bakış
- [Hızlı Başlangıç](./quick-start.md) – İlk workflow'unuzu oluşturun
- [Workflow Analizi](../reference/workflow-analysis.md) – Paylaşılan, çalıştırmaya duyarlı workflow raporları ve iyileştirme geri bildirimleri oluşturun
- [Dashboard Sekmesi](../tabs/dashboard-tab.md) – AI tarafından oluşturulan grafik widget'larıyla workflow destekli dashboard'lar oluşturun
- [Agent Node](../nodes/agent-node.md) – Tool calling, MCP ve skills içeren LLM node'u
- [Agent Mimarisi](../reference/agent-architecture.md) – Sub-agent'lar, orchestrator ve tool dağıtımı
- [Board Sekmesi](../tabs/board-tab.md) – Workflow çalıştıran sütunlara sahip agentic Kanban board
- [Codex Node](../nodes/codex-node.md) – OpenAI Codex kodlama agent'ını bir GitHub repo'suna karşı çalıştırın
- [OpenCode Go Node](../nodes/opencode-go-node.md) – Sertleştirilmiş bir container içinde sağlayıcıdan bağımsız kodlama agent'ı
- [Drive Sekmesi](../tabs/drive-tab.md) – Paylaşım linkleri, ekipler ve toplu işlemler içeren yerleşik dosya depolama
- [Playwright Node](../nodes/playwright-node.md) – AI adımları ve kod modu ile birinci taraf tarayıcı otomasyonu
- [RAG / Vector Store Node](../nodes/rag-node.md) – Vektör arama ve doküman ekleme (Qdrant veya Postgres pgvector)
- [AI Assistant](../reference/ai-assistant.md) – Doğal dil ile workflow oluşturucu
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Genel inceleme URL'leri ile agent kontrol noktaları
- [Guardrails](../reference/guardrails.md) – Güvenli olmayan prompt'ları modellerinize ulaşmadan önce engelleyin
- [Traces Sekmesi](../tabs/traces-tab.md) – LLM çağrı gözlemlenebilirliği
- [Evals Sekmesi](../tabs/evals-tab.md) – AI workflow'ları için test paketleri
- [Alerts Sekmesi](../tabs/alerts-tab.md) – Hatalar, süre, maliyet ve çalıştırma hacmi üzerinde eşik uyarıları
- [OpenTelemetry Tracing](../reference/opentelemetry.md) – Çalıştırma, node ve tool span'lerini OTLP üzerinden dışa aktarın
- [Load Distribution](../reference/cluster.md) – Leader failover ile çalıştırmaları örnekler arasında paylaştırın
- [Single Sign-On](../reference/sso.md) – Herhangi bir OpenID Connect sağlayıcısı üzerinden oturum açın
- [Audit Logging](../reference/audit.md) – Aktör, hedef ve sonuç ile güvenlikle ilgili eylemler
- [Portal](../reference/portal.md) – Workflow'ları genel sohbet arayüzleri olarak yayınlayın
- [Parallel Execution](../reference/parallel-execution.md) – DAG tabanlı eşzamanlı yürütme
- [MCP Sekmesi](../tabs/mcp-tab.md) – MCP sunucu ve istemci yapılandırması
