# Tam Özellik Seti

Tüm Heym yeteneklerine kapsamlı bir genel bakış. Her bölüm bir özelliği veya kavramı birkaç cümleyle açıklar.

---

## Başlarken

### [Giriş](../getting-started/introduction.md)

Heym, üretim ortamında AI ajanlarını çalıştırmak ve yönetmek için bir altyapıdır. Ajan tabanlı sistemleri görsel bir tuval üzerinde oluşturur ve güvenle çalıştırırsınız: ajanları düzenleyin, iş süreçlerini otomatikleştirin, her yürütmeyi inceleyin ve kendi altyapınızda kontrolü insanlarda tutun. Görsel workflow'ları, AI destekli düğümleri ([LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Qdrant RAG](../nodes/rag-node.md)), bir [AI Assistant](./ai-assistant.md)'ı, entegrasyonları ([HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Notion](../nodes/notion-node.md), [WebSocket Send](../nodes/websocket-send-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), gelen [IMAP Trigger](../nodes/imap-trigger-node.md) e-postası, giden [Send Email](../nodes/send-email-node.md)), [Cron](../nodes/cron-node.md) ile zamanlamayı ve son kullanıcılar için [Portal](./portal.md) sohbet portallarını destekler.

Ayrıca bkz. [Temel Kavramlar](../getting-started/core-concepts.md), [Düğüm Türleri](./node-types.md) ve [Üçüncü Taraf Entegrasyonları](./integrations.md).

### [Neden Heym](../getting-started/why-heym.md)

Neden Heym, ajan yaşam döngüsünü (oluştur, düzenle, çalıştır, gözlemle, değerlendir, kontrol et, sun) ele alır ve tek bir kendi kendine barındırılan çalışma zamanının her aşamada neleri yönettiğini gösterir. Bu kapsam; araç çağırma, Python araçları, [MCP](../tabs/mcp-tab.md) bağlantıları, beceriler ve çoklu ajan düzenlemesi ile [LLM](../nodes/llm-node.md) düğümünü ve [Agent Node](../nodes/agent-node.md)'u; trigger'ları, yeniden denemeleri ve [yük dağıtımını](./cluster.md); çalıştırma başına USD maliyeti ve OpenTelemetry dışa aktarımı ile [Traces](../tabs/traces-tab.md)'i; [Evals](../tabs/evals-tab.md)'i; [insan inceleme kontrol noktalarını](./human-in-the-loop.md), guardrail'leri, SSO'yu ve bir denetim izini; ve REST, MCP ve Portal endpoint'lerini içerir. n8n, Zapier ve Make.com ile bir yetenek karşılaştırması sayfayı kapatır.

Ayrıca bkz. [Agent Node](../nodes/agent-node.md), [LLM](../nodes/llm-node.md), [Qdrant RAG](../nodes/rag-node.md) ve [Ajan Mimarisi](./agent-architecture.md).

### [Hızlı Başlangıç](../getting-started/quick-start.md)

İlk workflow'unuzu dakikalar içinde çalıştırın: [Workflows](../tabs/workflows-tab.md) sekmesinden bir workflow oluşturun, bir [Input](../nodes/input-node.md) düğümü, bir [LLM](../nodes/llm-node.md) düğümü ve bir [Output](../nodes/output-node.md) düğümü ekleyin, ardından bunları bağlayın. [LLM](../nodes/llm-node.md)'i bir credential ile yapılandırın ve `userMessage` değerini `$input.text` olarak ayarlayın; workflow'ları yürütmek veya doğal dille oluşturmak için Run'ı veya [AI Assistant](./ai-assistant.md)'ı kullanın.

Doğal olarak [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Output](../nodes/output-node.md) ve [Expression DSL](./expression-dsl.md) ile eşleşir.

### [Temel Kavramlar](../getting-started/core-concepts.md)

Workflow'lar, kenarlarla bağlanan düğümlerden oluşan yönlü graflardır; yürütme, trigger düğümlerinden ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) işleme düğümleri aracılığıyla [Output](../nodes/output-node.md) düğümlerine doğru akar. Her düğümün bir türü, verisi (yapılandırması) ve girdileri/çıktıları vardır; kenarlar veri akışını tanımlar. Düğümler, `$nodeLabel.field` gibi [Expression DSL](./expression-dsl.md) ifadeleri aracılığıyla yukarı akış verilerine başvurur; bağımsız düğümler otomatik olarak [paralel](./parallel-execution.md) çalışır.

Ayrıca bkz. [Trigger'lar](./triggers.md), [Paralel Yürütme](./parallel-execution.md) ve [Workflow Yapısı](./workflow-structure.md).

### [Çalıştırma ve Dağıtım](../getting-started/running-and-deployment.md)

Heym, yerel geliştirme için `run.sh` (Docker'da veritabanı, FastAPI backend, Vite frontend) ve Docker Compose ile üretim için `deploy.sh` sağlar. Her ikisi de bir `.env` dosyası kullanır; temel değişkenler arasında `SECRET_KEY`, `ENCRYPTION_KEY`, `DATABASE_URL` ve `ALLOW_REGISTER` bulunur. Geliştirme, yapılandırılabilir frontend ve backend portlarında çalışır; üretim, frontend container'ı aracılığıyla API'yi `/api` altında sunar.

Ayrıca bkz. [Güvenlik](./security.md), [Kurumsal](./enterprise.md) ve [Ayarlar](./user-settings.md).

### [Heym'e Taşıma](../getting-started/migrate-to-heym.md)

AI Convert aracı, başka bir platformdan (n8n, Flowise, Dify, Langflow, sim.ai, Activepieces) bir workflow'u veya düz İngilizce bir açıklamayı bir Heym workflow'una dönüştürür; canlı olarak bir tuvale aktarılır ve [indirip içe aktarmaya](./download-import.md) hazır hale gelir. Bir AI güvenlik kontrolü çalıştırır, ardından DSL'i yerinde girdi ve hız limitleriyle oluşturur. [heym.run/convert](https://heym.run/convert) adresinden açın.

Ayrıca bkz. [Hızlı Başlangıç](../getting-started/quick-start.md), [İndirme ve İçe Aktarma](./download-import.md) ve [AI Assistant](./ai-assistant.md).

---

## Düğümler

### Trigger'lar
#### [Giriş](../nodes/input-node.md)

Giriş düğümü, kullanıcıdan veya API çağırıcısından veri alan workflow'lar için giriş noktasıdır. Tek veya birden fazla giriş alanını destekler ve istek üst verilerini (headers, query params) sunar. Body alanlarına `$nodeLabel.body.fieldKey`, headers'a `$nodeLabel.headers` ve query'ye `$nodeLabel.query` üzerinden erişin.

Doğal olarak [Condition](../nodes/condition-node.md), [LLM](../nodes/llm-node.md) ve [Output](../nodes/output-node.md) ile eşleşir. Payload referansları ve alan erişimi için [Expression DSL](./expression-dsl.md) ve [Webhooks](./webhooks.md) bölümlerine bakın.

#### [Cron](../nodes/cron-node.md)

Cron düğümü, standart beş alanlı bir cron ifadesi kullanarak bir workflow'u zamanlamaya göre tetikler. Kullanıcı girişi gerekmez—workflow belirtilen zamanlarda (örn. saatlik, günlük, her 15 dakikada bir) otomatik olarak çalışır. Çıktı, payload içermeyen bir trigger olayıdır.

Zamanlanmış ve gecikmeli çalıştırmalar için ayrıca [Triggers](./triggers.md), [Wait](../nodes/wait-node.md) ve [Execution History](./execution-history.md) bölümlerine bakın.

#### [IMAP Trigger](../nodes/imap-trigger-node.md)

IMAP Trigger düğümü, yapılandırılabilir bir dakika aralığında bir gelen kutusunu yoklar ve yeni algılanan her e-posta için bir workflow başlatır. Ayrıştırılmış headers, gönderen ve alıcı listeleri, düz metin ve HTML gövdeleri, ek üst verileri ve bir trigger zaman damgası çıktılar. Destek gelen kutusu triyajı, mailbox'tan [Slack](../nodes/slack-node.md)'e yönlendirme veya [Human-in-the-Loop](./human-in-the-loop.md) ile e-posta tabanlı onay akışları için kullanın.

Gelen triyaj ve yanıt workflow'ları için [Send Email](../nodes/send-email-node.md), [LLM](../nodes/llm-node.md) ve [Slack](../nodes/slack-node.md) ile eşleşir.

#### [Heym Trigger](../nodes/heym-trigger-node.md)

Heym Trigger düğümü, Heym'in kendisi bir platform olayı yayımladığında bir workflow başlatır: `heym.started`, `workflow.created`, `workflow.updated` veya `workflow.deleted`. Teslimat toplu halde yapılır - beş saniyelik bir dağıtım penceresi içinde yayımlanan her olay, her zaman bir dizi olan `$nodeLabel.events` olarak tek bir çalıştırmada gelir. Her olay benzersiz bir veritabanı kısıtı aracılığıyla talep edilir, böylece kaç worker, container veya makine çalışıyor olursa olsun, abone olan her düğüm için tam olarak bir kez tetiklenir. Workflow değişiklik denetim izleri, dağıtım duyuruları ve instance sağlık özetleri için kullanın.

Değiştirilen workflow'u aramak için [Heym](../nodes/heym-node.md) düğümüyle ve her olay için bir kez işlem yapmak üzere [Loop](../nodes/loop-node.md) ile eşleşir.

#### [Heym](../nodes/heym-node.md)

Heym düğümü, Heym'in kendi verilerini üç işlem aracılığıyla okur: `listWorkflows`, sahibin erişebildiği her workflow'u düğüm sayıları ve zaman damgalarıyla döndürür; `getWorkflow`, bir workflow'un düğüm ve kenar yapısını döndürür; ve `getExecutionHistory`, isteğe bağlı durum, zaman aralığı ve limit filtreleriyle birlikte, duruma göre gruplandırılmış toplamlarla birlikte execution-history girdilerini en yeniden en eskiye doğru döndürür. Sonuçlar, düğümün içinde bulunduğu workflow'un sahibiyle sınırlıdır, böylece cron, bir portal veya bir olay tarafından başlatılan bir çalıştırma, manuel bir çalıştırmayla aynı verileri döndürür. `getWorkflow`, tam düğüm yapılandırmasını döndürür; bu da bir workflow'u sabit kodlanmış anahtarlar veya token'lar açısından denetlemeyi mümkün kılan şeydir; workflow sahibinin editörde zaten açamayacağı hiçbir şeyi açığa çıkarmaz. Hiçbir credential gerekmez.

#### [WebSocket Trigger](../nodes/websocket-trigger-node.md)

WebSocket Trigger düğümü, harici bir WebSocket sunucusuna giden bir istemci bağlantısı açar ve `onMessage`, `onConnected` veya `onClosed` üzerinde workflow'u başlatır. Ayrıştırılmış mesaj payload'larını, yeniden bağlanma durumunu, kapanış üst verilerini ve alt ifadeler için socket URL'sini sunar.

Gerçek zamanlı entegrasyonlar için [WebSocket Send](../nodes/websocket-send-node.md), [HTTP](../nodes/http-node.md) ve [SSE Streaming](./sse-streaming.md) ile eşleşir.

#### [Telegram Trigger](../nodes/telegram-trigger-node.md)

Telegram Trigger düğümü, bot webhook güncellemelerini alır ve workflow'u hemen başlatır. Tam update payload'ını, birincil mesaj nesnesini, callback query'leri, temizlenmiş headers'ı ve bir trigger zaman damgasını sunar. Chatbot'lar, [Telegram](../nodes/telegram-node.md) içindeki AI asistanları ve buton tabanlı akışlar için kullanın.

Bot tabanlı workflow'lar için [Telegram](../nodes/telegram-node.md), [Agent Node](../nodes/agent-node.md) ve [Webhooks](./webhooks.md) ile eşleşir.

#### [Slack Trigger](../nodes/slack-trigger-node.md)

Slack Trigger düğümü, Slack Events API webhook'larını alır ve istek imzasını doğruladıktan sonra bir workflow'u otomatik olarak başlatır. Alt yönlendirme, [LLM](../nodes/llm-node.md) tabanlı sınıflandırma ve yanıt akışları için event payload'ını ve temizlenmiş headers'ı sunar.

[Slack](../nodes/slack-node.md), [Agent Node](../nodes/agent-node.md) ve [Third-Party Integrations](./integrations.md) ile eşleşir.

#### [Discord Trigger](../nodes/discord-trigger-node.md)

Discord Trigger düğümü, Discord Interactions API webhook'larını alır, seçilen `discord_trigger` credential'ı ile Ed25519 imzalarını doğrular ve workflow'u başlatır. Alt yönlendirme veya yanıtlar için tam interaction payload'ını, komut verilerini, temizlenmiş headers'ı ve trigger üst verilerini sunar.

[Output](../nodes/output-node.md), [Discord](../nodes/discord-node.md), [Agent Node](../nodes/agent-node.md) ve [Third-Party Integrations](./integrations.md) ile eşleşir.
#### [RabbitMQ](../nodes/rabbitmq-node.md)

RabbitMQ düğümü, RabbitMQ kuyruklarından ve exchange'lerinden mesaj gönderir veya alır. Mesaj güdümlü workflow'lar ve olay işleme için kullanın. Gönderme modu, isteğe bağlı gecikmeyle bir mesaj yayınlar; alma modu ise bir [trigger](./triggers.md) olarak işlev görür, böylece bir mesaj geldiğinde workflow başlar. Çıktı; status, message_id ve body alanlarını içerir.

Olay güdümlü işleme için [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) ve [Parallel Execution](./parallel-execution.md) ile birlikte kullanılır.

#### [Error Handler](../nodes/error-handler-node.md)

Error Handler düğümü, workflow'daki herhangi bir düğüm başarısız olduğunda otomatik olarak çalışır. Gelen bağlantıya ihtiyaç duymaz; motor tarafından tetiklenir. Çıktı; hata mesajı, başarısız düğüm etiketi, düğüm türü ve zaman damgasını içerir. [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) veya [Send Email](../nodes/send-email-node.md) aracılığıyla bildirim göndermek, hataları günlüğe kaydetmek veya özel hata yanıtları döndürmek için kullanın.

Hataları canvas üzerinde işlemeye alternatif olarak, bir workflow hataları ayrı bir workflow'a da devredebilir — bkz. [Error Workflow](#error-workflow). Canvas zaten bir Error Handler düğümü içeriyorsa, error workflow **çağrılmaz** (yerel handler önceliklidir).

Yaygın bildirim hedefleri [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) ve [Send Email](../nodes/send-email-node.md)'dir; çalıştırma ayrıntılarını incelemek [Execution History](./execution-history.md) üzerinden daha kolaydır.

### AI

#### [Agent Node](../nodes/agent-node.md)

AI Agent düğümü, tool calling özellikli bir [LLM](../nodes/llm-node.md) düğümüdür. Python araçlarını çalıştırabilir, bağlı canvas düğümlerini araç olarak çağırabilir, [MCP](../tabs/mcp-tab.md) sunucularına bağlanabilir, skill'leri (talimat dosyaları ve isteğe bağlı Python betikleri) kullanabilir, diğer agent düğümlerine devreden bir orchestrator olarak işlev görebilir ve diğer workflow'ları araç olarak çağırabilir. Çıktı `$nodeLabel.text` olarak kullanılabilir. İsteğe bağlı **Extra Body** anahtarı, tool-calling döngüsündeki her isteğe sağlayıcıya özgü istek parametrelerinden oluşan bir JSON nesnesi ekler; varsayılan olarak kapalıdır. İsteğe bağlı **Use Responses API** anahtarı, agent'ın model çağrılarını Responses API üzerinden yönlendirir; bu, modelin akıl yürütmesini tool çağrıları boyunca korur, böylece bir reasoning modeli çok adımlı bir döngü boyunca düşünce zincirini sürdürür; varsayılan olarak kapalıdır ve OpenAI ile özel credential'larla çalışır.

Canvas düğümü araçları, bir agent'ın yapılandırılmış workflow düğümlerini doğrudan canvas üzerinden çağırmasını sağlar. Desteklenen bir düğümü agent'ın tools handle'ına bağlayın, ardından belirli alanları bot simgesiyle agent tarafından sağlanan olarak işaretleyin. Bu alanlar çalışma zamanında araç parametreleri haline gelirken, credential'lar ve işaretlenmemiş alanlar düğüm yapılandırmasında sabit kalır.

Skills bölümü artık yeni skill'ler oluşturmak için **AI Build**, mevcut skill'ler için satır içi AI düzenleme eylemi, skill başına ZIP indirme ve çalışma zamanında Heym Drive dosyalarını okuması gereken skill'ler için isteğe bağlı **Enable Drive files** anahtarını içerir. Skill Builder modalı solda bir sohbet konuşmasını akış halinde gösterir, her fine-tune yorumuyla birlikte sürükle-bırak dosyaları kabul eder, sağda oluşturulan `SKILL.md` ve `.py` dosyalarının canlı salt okunur önizlemesini gösterir, bu önizlemeyi ZIP olarak indirebilir ve yüklenen fine-tune dosyalarını manuel yüklemelerde kullanılan aynı ZIP ingestion akışı üzerinden paketlenmiş skill varlıkları olarak geri kaydeder.

**[Agent Persistent Memory](./agent-persistent-memory.md)** etkinleştirildiğinde, her agent düğümü kendi bilgi grafiğini tutar: olgular boş olmadığında system prompt'a yüklenir ve başarılı çalıştırmalar yeni varlıkların ve ilişkilerin arka planda birleştirilmesini tetikler. Alt agent'lar ayrı grafikler kullanır. Bir agent'ın grafiğini, grafik diyaloğundan salt okunur veya okuma/yazma erişimiyle diğer agent'larla (aynı veya başka workflow'larda) **paylaşabilirsiniz**. Canvas brain kontrolü grafik düzenleyiciyi açar.

Agent düğümleri ayrıca [Human-in-the-Loop](./human-in-the-loop.md) moduna girebilir. Bu modda agent bir `request_human_review` aracı edinir ve onay gerektiren belirli adımlarda durabilir, tek kullanımlık bir genel inceleme bağlantısı oluşturabilir, bildirim akışları için bir `review` canvas dalı sunabilir ve bir gözden geçiren kişi Markdown inceleme metnini kabul edene, düzenleyene veya reddedene kadar bekleyebilir. Düğümün HITL alanı, ne zaman sorulacağına dair onay yönergeleri olarak işlev görürken, gözden geçirene yönelik özet her inceleme isteğinden oluşturulur. [MCP](../tabs/mcp-tab.md) araçları için Heym, bu yazılı talimatları `always`, `once` veya `never` olarak yorumlamak üzere modeli kullanır; böylece serbest biçimli onay dili somut bir çalışma zamanı politikasına eşlenir. Çalıştırma `pending` olarak işaretlenir ve karar geldikten sonra saklanan execution snapshot'ından devam eder; sonraki adımlar da inceleme gerektiriyorsa aynı agent çalıştırması birden fazla kez durabilir.

Agent düğümleri, biriken mesaj geçmişleri modelin context window'unun %80'ine yaklaştığında bu geçmişi otomatik olarak sıkıştırır. System prompt, ilk kullanıcı mesajı ve en son kullanıcı mesajı her zaman korunur; aradaki her şey aynı model ve credential kullanılarak özetlenir. Sıkıştırma olayları Debug panelinde, [Execution History](./execution-history.md)'de ve [Traces](../tabs/traces-tab.md) sekmesinde görülebilir.

Ayrıca bkz. [LLM](../nodes/llm-node.md), [Agent Architecture](./agent-architecture.md), [Agent Persistent Memory](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) ve [File Generation](./file-generation.md).
#### [Codex](../nodes/codex-node.md)

Codex düğümü, OpenAI Codex CLI'yi izole bir Heym çalışma alanı içinde çalıştırır. Bir Codex credential (token başına API maliyeti olmadan aboneliğinizi kullanmak için ChatGPT ile oturum açın veya bir erişim token'ı yapıştırın), bir GitHub credential, repository URL, base branch, görev prompt'u, yayınlama modu (`diff_only` veya `draft_pr`), branch adı ve timeout kabul eder. Runner, repository'yi yerel olarak klonlar, ChatGPT token paketini veya `CODEX_ACCESS_TOKEN`'ı yalnızca Codex sürecine iletir ve yapılandırılmış bir özet, doğrulama notları, değiştirilen dosyalar, diff, kullanım meta verileri ve isteğe bağlı bir draft PR URL'si döndürür.

Codex `needs_input` döndürdüğünde, workflow duraklar ve `question` branch'ini açığa çıkarır. Bu branch'i Slack, e-posta veya başka bir bildirim düğümüne bağlayın; genel follow-up bağlantısı, yanıt gönderildikten sonra kaydedilmiş yürütme anlık görüntüsünü devam ettirir. Codex düğümü ayrıca bir AI Agent'a araç olarak eklenebilir ve agent'ın kodlama görevlerini devretmesine olanak tanır; araç olarak kullanıldığında, `needs_input` sonucu workflow'u duraklatmak yerine agent'a satır içi olarak döndürülür.

Ayrıca bkz. [GitHub](../nodes/github-node.md), [Credentials](./credentials.md), [Credentials Sharing](./credentials-sharing.md) ve [Node Types](./node-types.md).

#### [OpenCode Go](../nodes/opencode-go-node.md)

OpenCode Go düğümü, OpenCode CLI'yi (Go) bir GitHub repository'sine karşı çalıştırır. İzolasyon Codex desenini izler: yerel olarak bir host alt süreci olarak çalışırken, Docker dağıtımları onu çalışma alanı volume'ünü paylaşan sertleştirilmiş bir kardeş container içinde çalıştırır. Bir OpenCode Go credential (isteğe bağlı base URL içeren bir gateway API anahtarı), bir GitHub credential, repository URL, base branch, görev prompt'u, yayınlama modu, branch adı, timeout ve canlı, aranabilir bir model listesinden seçilen (yerleşik bir fallback ile birlikte) bir `opencode-go/<model>` modeli kabul eder. Heym tüm git/GitHub işlemlerini host üzerinde gerçekleştirir ve GitHub token'ını asla sandbox içine yerleştirmez; OpenCode yalnızca diskteki dosyaları düzenler. Düğüm, yapılandırılmış bir özet, doğrulama notları, değiştirilen dosyalar, diff ve isteğe bağlı bir pull request URL'si döndürür. Bir AI Agent'a araç olarak eklenebilir.

Ayrıca bkz. [Codex](../nodes/codex-node.md), [GitHub](../nodes/github-node.md), [Credentials](./credentials.md), [Credentials Sharing](./credentials-sharing.md) ve [Node Types](./node-types.md).

#### [LLM](../nodes/llm-node.md)

LLM düğümü, metni bir dil modeliyle işler veya görüntüler üretir. Metin üretimi, vision (görüntü girişi), görüntü üretimi, yapılandırılmış JSON çıktısı, desteklenen OpenAI ve OpenAI uyumlu endpoint'ler için sağlayıcıya özgü Batch API yürütmesi ve çağrıyı Chat Completions yerine Responses API üzerinden yönlendiren isteğe bağlı bir **Use Responses API** anahtarı destekler (varsayılan olarak kapalıdır; OpenAI ve özel credential'larla çalışır ve Batch modu ile birleştirilemez). Credential, model, system ve user mesajları, temperature ve max tokens yapılandırın; prompt'larda [Expression DSL](./expression-dsl.md) kullanın. Batch modunda `userMessage` bir diziye çözümlenmelidir, düğüm ilerleme güncellemeleriyle birlikte bir `batchStatus` branch'i yayar ve nihai çıktı öğe başına batch sonuçlarını içerir. İsteğe bağlı bir **Extra Body** anahtarı, sağlayıcıya özgü istek parametrelerinden (örneğin `{"thinking": {"type": "disabled"}}`) oluşan bir JSON nesnesini her API çağrısına ekler; varsayılan olarak kapalıdır. İsteğe bağlı [Guardrails](./guardrails.md), çağrıdan önce güvenli olmayan içeriği engeller.

Doğal olarak [Qdrant RAG](../nodes/rag-node.md), [Agent Node](../nodes/agent-node.md), [Guardrails](./guardrails.md) ve [Expression Evaluation Dialog](./expression-evaluation-dialog.md) ile eşleşir.

#### [Decision](../nodes/decision-node.md)

Decision düğümü, bir decision modeline çalıştırmanın durumu hakkında yazılı sorular sorar ve düzyazı yerine olasılıklar döndürür. Bir **State** alanı, modelin neyi okuması gerektiğini taşır — tek başına bir ifade kendi türünü korur, böylece `$input` metni yerine nesneyi gönderir — ve bir soru listesi yargıları taşır. Sorular üç biçimde gelir: **noul**, bir koşulun geçerli olup olmadığını yanıtlar, **choice**, tanımladığınız bir kümeden bir seçenek seçer ve tam dağılımı döndürür ve **score**, durumu sıralı düzeyler boyunca derecelendirir ve bunların arasına düşebilir. Choice ve score yanıtları ayrıca bir güven değeri taşır, böylece bir [Switch](../nodes/switch-node.md) yanıt üzerinde yönlendirme yaparken bir [Condition](../nodes/condition-node.md) ne kadar kesin olduğu üzerinde kapı görevi görebilir. **Generate with AI**, düz bir cümleden state şablonunu ve soru satırlarını taslak olarak oluşturur ve **Custom request body**, sözleşmesi farklı olan bir endpoint için elle yazılmış JSON gönderir. Sağlayıcı yanıtı değiştirilmeden iletilir ve her çağrı [Traces](../tabs/traces-tab.md) içinde kaydedilir.

Bir Decision Model credential'ı gerektirir; doğal olarak [Switch](../nodes/switch-node.md), [Condition](../nodes/condition-node.md) ve [Agent Node](../nodes/agent-node.md) ile eşleşir.
#### [RAG / Vector Store](../nodes/rag-node.md)

RAG / Vector Store düğümü, retrieval-augmented generation için bir vector store içinde belgeleri ekler, upsert eder, siler ve arar. Bir Database açılır menüsü arka uç seçimini yapar — **Qdrant** (harici sunucu) veya **Postgres (pgvector)** (Heym'in kendi veritabanı, harici servis gerekmez) — varsayılan olarak Qdrant seçilidir. [Vectorstores](../tabs/vectorstores-tab.md) sekmesinden bir vector store seçin ve işlemi insert, upsert, delete veya search olarak ayarlayın. Upsert ve delete, bir belgeyi payload içinde saklanan benzersiz bir id ile adresler — bir **Document ID Field** bu alanı adlandırır (varsayılan `doc_id`) ve **Document ID** değerini taşır — böylece bir belge, kendi sisteminizin zaten kullandığı id'yi korur: upsert, yeni sürümü saklamadan önce eşleşen her point'i değiştirir ve delete, herhangi bir şeyin eşleşip eşleşmediğini bildirir. Belge metadata'sı, değerlerinde ifadeleri kabul eder; böylece `{"url": "$start.url"}` çalıştırmanın ürettiğini saklar. Search, metadata filtrelerini ve isteğe bağlı Cohere reranking'i destekler ve [LLM](../nodes/llm-node.md) veya [Agent Node](../nodes/agent-node.md) akışlarında kullanılmak üzere text, score, metadata, reranked flag ve count içeren bir sonuç dizisi döndürür.

Yaygın alt akış düğümleri [LLM](../nodes/llm-node.md) ve [Agent Node](../nodes/agent-node.md)'dur; vector store kurulumu [Vectorstores](../tabs/vectorstores-tab.md) bölümünde yer alır.

#### [MCP Call Node](../nodes/mcp-call-node.md)

MCP Call düğümü, bir LLM'in hangi aracı çağıracağına karar vermesi olmadan belirli bir [MCP](../tabs/mcp-tab.md) aracını doğrudan çağırır. Tasarım zamanında tam olarak hangi aracı çalıştıracağınızı bildiğinizde kullanın — bir workflow içinde deterministik, tek adımlı MCP araç yürütmesi için. Bir bağlantı yapılandırın (SSE, Streamable HTTP veya stdio; [Agent Node](../nodes/agent-node.md) MCP bağlantısıyla aynı alanlar), bir açılır menüyü doldurmak için **Fetch Tools**'a tıklayın, bir araç seçin ve aracın input schema'sından otomatik olarak oluşturulan argüman alanlarını doldurun. Her argüman statik bir değer veya `$userInput.body.text` gibi bir [DSL expression](./expression-dsl.md) kabul eder. Sonuç `$nodeLabel.result` olarak kullanılabilir (ayrıştırılabiliyorsa JSON object, aksi halde string). MCP Call düğümü, bir canvas aracı olarak [Agent Node](../nodes/agent-node.md)'a bağlanamaz.

Ayrıca bkz. [Agent Node](../nodes/agent-node.md), [MCP](../tabs/mcp-tab.md) ve [Expression DSL](./expression-dsl.md).

### Logic

#### [Condition](../nodes/condition-node.md)

Condition düğümü, bir if/else ifadesine göre workflow'u dallandırır. İki çıkış tutamacı vardır: biri koşul doğru olduğunda, diğeri yanlış olduğunda. Koşul ifadesinde [Expression DSL](./expression-dsl.md)'den karşılaştırma ve mantıksal operatörleri kullanın; düğüm, girdiyi seçilen dala geçirir.

Ayrıca bkz. [Switch](../nodes/switch-node.md), [Throw Error](../nodes/throw-error-node.md) ve [Expression DSL](./expression-dsl.md).

#### [Switch](../nodes/switch-node.md)

Switch düğümü, bir değeri case'lerle eşleştirerek yürütmeyi farklı yollara yönlendirir. Değerlendirilecek bir ifade ve bir case değerleri listesi yapılandırın; her case bir source handle alır ve eşleşmeyen değerler için bir default handle kullanılır. Girdi, eşleşen dala geçirilir.

İkili dallanma için [Condition](../nodes/condition-node.md) ve yönlendirilen yolları yeniden birleştirmek için [Merge](../nodes/merge-node.md) kullanın; eşleştirme kuralları [Expression DSL](./expression-dsl.md) bölümünde ele alınmıştır.

#### [Merge](../nodes/merge-node.md)

Merge düğümü, birden fazla paralel girdiyi bekler ve bunları tek bir çıktıda birleştirir. Beklenecek girdi sayısını ayarlayın; tüm dallar tamamlandığında düğüm birleştirilmiş bir nesne üretir. Devam etmeden önce paralel dallardan gelen sonuçları birleştirmek için kullanın; paralel dallar ayrı Output düğümlerinde sonlandığında kullanmayın.

Dalları yeniden birleştirirken ayrıca bkz. [Parallel Execution](./parallel-execution.md), [Loop](../nodes/loop-node.md) ve [Output](../nodes/output-node.md).

#### [Loop](../nodes/loop-node.md)

Loop düğümü, bir dizi üzerinde yineler ve her öğe için alt akış düğümlerini yürütür. İlerlemek için yineleme gövdesindeki son düğümden bir geri bağlantı gerektirir. Loop gövdesi içinde `item`, `index`, `total`, `isFirst` ve `isLast` kullanın; loop, yineleme yolu ve tamamlanma yolu için ayrı çıktılara sahiptir.

Yinelemeli workflow'lar için [Variable](../nodes/variable-node.md), [Merge](../nodes/merge-node.md) ve [Expression DSL](./expression-dsl.md) ile birlikte kullanılır.

### Data

#### [Set](../nodes/set-node.md)

Set düğümü, girdi verilerini dönüştürür ve özel çıktıya eşler. Her değerin bir [Expression DSL](./expression-dsl.md) ifadesi olduğu anahtar-değer eşlemeleri tanımlayın. Büyük harfe çevirme, alt dize, birleştirme, rastgele sayılar ve benzeri dönüşümler için kullanın. Çıktıya anahtarla erişin (örn. `$setNode.keyName`). Bir agent'a canvas düğümü aracı olarak bağlandığında, eşleme değerleri agent tarafından sağlanan olarak işaretlenebilir; böylece agent bunları çalışma zamanında doldurur. Diğer workflow'ları çağırmak için bunun yerine [Execute](../nodes/execute-node.md) düğümünü kullanın.

Ayrıca bkz. [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) ve [Expression DSL](./expression-dsl.md).
#### [Converter](../nodes/converter-node.md)

Converter düğümü, kod yazmadan verileri formatlar arasında dönüştürür. Metin dönüşümleri `csvToJson` (CSV metnini satır nesnelerinden oluşan bir diziye veya başlık olmadığında dizilere dönüştürür), `jsonToCsv` (nesne/satır dizisini CSV metnine dönüştürür), `xmlToJson` (XML metnini bir nesneye dönüştürür) ve `jsonToXml` (bir nesneyi XML metnine dönüştürür) şeklindedir. Dönüşüm yönünü ve kaynak ifadesini yapılandırın; CSV dönüşümleri ek olarak bir ayırıcı ve başlık işleme kullanır ve `jsonToCsv` açık bir sütun sırası sabitleyebilir. Tırnaklama, gömülü ayırıcılar ve gömülü yeni satırlar RFC 4180'e uyar. XML nitelikleri `@` öneklerini kullanır, niteliklerle karışık metin `#text` kullanır, yinelenen öğeler dizilere dönüşür ve XML varlık genişletmesi devre dışı bırakılır. Aynı düğüm saklanan dosyalar üzerinde de çalışır. `imageToText` ve `pdfToText` Tesseract OCR çalıştırır, Heym Drive'dan bir dosya okur (bir File upload trigger'ından gelen `$Upload.file.id`, bir Drive düğümü sonucu veya bir ajanın oluşturduğu dosya), dili algılanan yazı sisteminden otomatik olarak seçer veya `tur` ya da `eng+tur` gibi adlandırdığınız kodları kullanır ve metni varsayılan olarak UTF-8'e normalleştirir; isteğe bağlı NFC normalleştirmesi ve `cp1254` gibi daha dar karakter kümeleri kullanılabilir. `fileConvert` saklanan bir dosyayı başka bir formatta yeniden yazar; belgeleri pandoc aracılığıyla, görüntüleri Pillow aracılığıyla işler ve sonucu orijinale dokunmadan yeni bir Drive dosyası olarak kaydeder. Sonuç `$converterNode.result` olarak kullanılabilir; OCR çalıştırmaları için yanında `.language`, `.encoding`, `.page_count`, `.pages` ve `.file` bulunur, `fileConvert` için ise `.id`, `.filename` ve `.download_url` bulunur.

Ayrıca bkz. [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md) ve [Expression DSL](./expression-dsl.md).

#### [Code](../nodes/code-node.md)

Code düğümü, yazdığınız Python'u kendi `requirements.txt` dosyasıyla birlikte, her çalıştırma için oluşturulan ve yok edilen bir container içinde çalıştırır. Kodunuz bir `main(params)` fonksiyonu tanımlar ve JSON olarak serileştirilebilen herhangi bir değer döndürür; bu değer `$codeNode.result` olur; yazdırdığı her şey ayrı olarak `$codeNode.logs` olarak yakalanır ve `$codeNode.install` bağımlılıkları hangi aracın kurduğunu bildirir. Parametreler, `$` ifadeleri çalıştırmadan önce çözümlenen bir JSON nesnesi olarak yapılandırılır ve kod bunları `params.user.name` veya `params.orders[0].id` gibi nokta gösterimiyle okur. Bağımlılıklar `uv` ile kurulur; `uv`'nin işleyemediği paketler için `pip`'e geri dönülür ve çalıştırmalar arasında önbellekleme yapılmaz; `requirements.txt` dosyasını boş bırakmak kurulumu tamamen atlar ve çok daha hızlıdır. `codeAllowNetwork` açılmadığı sürece yürütme aşamasının ağı yoktur, ancak bağımlılık kurulumu her zaman PyPI'ye erişir. Sandbox, root olmayan bir kullanıcı olarak tüm yetenekler düşürülmüş, salt okunur bir kök dosya sistemi, Docker soketi olmadan ve backend sırlarına erişim olmadan çalışır; 512 MB bellek, bir CPU, 256 işlem, 120 saniyelik kurulum ve 60 saniyelik yürütme ile sınırlandırılmıştır. Docker gereklidir ve geri dönüş modu yoktur: erişilebilir bir daemon olmadan düğüm, kodunuzu backend sürecinde çalıştırmak yerine başarısız olur.

#### [Variable](../nodes/variable-node.md)

Variable düğümü, workflow'a yerel bir değişkeni (`$vars.variableName`) veya kalıcı bir [global değişkeni](./global-variables.md) (`$global.variableName`) ayarlar ya da günceller. Sayaçlar, biriktirilen listeler ve paylaşılan durum için kullanın. Değişken adını, değer ifadesini, tür zorlamasını ve global depoda saklanıp saklanmayacağını yapılandırın. Dizi değişkenleri `$array()` ve `.add()` destekler.

[Set](../nodes/set-node.md), [Loop](../nodes/loop-node.md) ve [Global Variables](./global-variables.md) ile birlikte kullanılır.

#### [Execute](../nodes/execute-node.md)

Execute düğümü başka bir workflow'u (alt workflow) çağırır ve ona girdi iletir. Hedef workflow'u ID ile belirtin ve girdiyi tek bir ifade veya anahtar-değer eşlemeleri aracılığıyla sağlayın. Çıktı workflow_id, status ve outputs içerir; veri dönüşümü için değil (bunun için Set kullanın), yeniden kullanılabilir mantık için kullanın.

Ayrıca bkz. Extract to Sub-Workflow için [Canvas Features](./canvas-features.md), [Workflow Structure](./workflow-structure.md) ve [Output](../nodes/output-node.md).

### Entegrasyonlar

#### [HTTP](../nodes/http-node.md)

HTTP düğümü, cURL tarzı yapılandırma kullanarak HTTP istekleri yapar. Bir workflow başlangıç noktası olabilir (gelen kenar yok) veya yukarı akış düğümlerinden girdi alabilir. Yanıt; status, headers ve body (uygun olduğunda ayrıştırılmış JSON) olarak kullanılabilir. Bearer veya özel header kimlik doğrulaması için [Credentials](./credentials.md) kullanın.

[Webhooks](./webhooks.md), [Credentials](./credentials.md) ve [Third-Party Integrations](./integrations.md) ile birlikte kullanılır.

#### [WebSocket Send](../nodes/websocket-send-node.md)

WebSocket Send düğümü, giden bir istemci bağlantısı açar, bir metin/JSON/ikili mesaj gönderir ve bağlantıyı kapatır. Heym tarafından barındırılan bir soket endpoint'i oluşturmadan workflow çıktısını gerçek zamanlı sistemlere yayınlamak için kullanın.

Ayrıca bkz. [WebSocket Trigger](../nodes/websocket-trigger-node.md), [SSE Streaming](./sse-streaming.md) ve [Third-Party Integrations](./integrations.md).
#### [Telegram](../nodes/telegram-node.md)

Telegram düğümü bir sohbete, gruba veya kanala bot mesajı gönderir. Bir Telegram [credential](./credentials.md) yapılandırın, `chatId` değerini ayarlayın ve giden `message` içeriğini [Expression DSL](./expression-dsl.md) ifadeleriyle oluşturun. Konuşma tabanlı workflow'lar için [Telegram Trigger](../nodes/telegram-trigger-node.md) ile ve operatör uyarıları için [Error Handler](../nodes/error-handler-node.md) ile doğal olarak eşleşir.

Kurulum ve credential kalıpları için ayrıca [Third-Party Integrations](./integrations.md) ve [Credentials](./credentials.md) bölümlerine bakın.

#### [Slack](../nodes/slack-node.md)

Slack düğümü, bir Incoming Webhook aracılığıyla bir Slack kanalına mesaj gönderir. Bir Slack [credential](./credentials.md) ve bir mesaj ifadesi yapılandırın. Bildirimler, uyarılar ve hata raporlama için kullanın; çıktı, girişten geçer.

[Slack Trigger](../nodes/slack-trigger-node.md), [Error Handler](../nodes/error-handler-node.md) ve [Third-Party Integrations](./integrations.md) ile eşleşir.

#### [Discord](../nodes/discord-node.md)

Discord düğümü, bir Incoming Webhook aracılığıyla bir Discord kanalına mesaj gönderir. Bir Discord [credential](./credentials.md) yapılandırın, giden mesajı [Expression DSL](./expression-dsl.md) ile oluşturun ve isteğe bağlı olarak webhook kullanıcı adı veya avatar geçersiz kılmalarını ayarlayın.

[Discord Trigger](../nodes/discord-trigger-node.md), [Output](../nodes/output-node.md), [Error Handler](../nodes/error-handler-node.md) ve [Third-Party Integrations](./integrations.md) ile eşleşir.

#### [Send Email](../nodes/send-email-node.md)

Send Email düğümü, SMTP üzerinden e-posta gönderir. Bir SMTP [credential](./credentials.md) ve alıcı(lar), konu ve gövde için [Expression DSL](./expression-dsl.md) ifadeleri yapılandırın. Bildirimler, uyarılar ve işlemsel e-postalar için kullanın. Çıktı; status, to ve subject alanlarını içerir.

[IMAP Trigger](../nodes/imap-trigger-node.md), gelen postaları işleyerek Send Email'i tamamlar. Birlikte, bir workflow'un paylaşılan bir gelen kutusundan gelen e-postayı okumasına, AI düğümleriyle özetlemesine veya sınıflandırmasına ve bir takip veya eskalasyon mesajı göndermesine olanak tanır. [Telegram Trigger](../nodes/telegram-trigger-node.md) ve [Telegram düğümü](../nodes/telegram-node.md), bot tabanlı sohbet workflow'ları için aynı gelen/giden kalıbını sağlar.

İki yönlü bildirim akışları için [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) ve [Third-Party Integrations](./integrations.md) ile de iyi eşleşir.

#### [Redis](../nodes/redis-node.md)

Redis düğümü Redis işlemlerini gerçekleştirir: set, get, hasKey ve deleteKey. Önbellekleme, hız sınırlama ve anahtar-değer depolama için kullanın. Bir [credential](./credentials.md), işlem türü, anahtar ifadesi ve set işlemleri için değer ve isteğe bağlı TTL yapılandırın. Çıktı, işleme göre değişir (value, success, exists, deleted).

Önbellekleme, kısıtlama ve koordinasyon için [Wait](../nodes/wait-node.md), [Variable](../nodes/variable-node.md) ve [Parallel Execution](./parallel-execution.md) ile eşleşir.

#### [Grist](../nodes/grist-node.md)

Grist düğümü, Grist elektronik tablolarındaki verileri okur, yazar ve yönetir. İşlemler arasında getRecord, getRecords, createRecord, updateRecord, deleteRecord, listTables ve listColumns bulunur. Belge kimliği, tablo kimliği ve create/update için sütun kimliklerini kullanarak kayıt verilerini sağlayın. CRUD, toplu güncellemeler ve elektronik tablo otomasyonu için kullanın.

Ayrıca [Google Sheets](../nodes/google-sheets-node.md), [DataTable](../nodes/datatable-node.md) ve [Third-Party Integrations](./integrations.md) bölümlerine bakın.

#### [Google Sheets](../nodes/google-sheets-node.md)

Google Sheets düğümü, OAuth2 aracılığıyla elektronik tablo verilerini okur, yazar ve yönetir. Raporları okumak, workflow sonuçlarını eklemek, takipçileri güncellemek ve bir workflow içinden sayfa sekmelerini temizlemek veya incelemek için kullanın. [BigQuery](../nodes/bigquery-node.md) gibi, Google destekli bir entegrasyon credential'ı kullanır ve elektronik tablo verileri akışın bir parçası olduğunda [Grist](../nodes/grist-node.md) yanında iyi durur.

[Grist](../nodes/grist-node.md), [DataTable](../nodes/datatable-node.md) ve [Third-Party Integrations](./integrations.md) ile eşleşir.

#### [BigQuery](../nodes/bigquery-node.md)

BigQuery düğümü, OAuth2 aracılığıyla SQL sorguları çalıştırır ve Google BigQuery veri kümelerine satır ekler. Analitik workflow'lar, raporlama ardışık düzenleri ve workflow çalıştırmalarından yapılandırılmış olay verileri yazmak için kullanışlıdır. Genellikle satırları şekillendirmek için [Set](../nodes/set-node.md) ile ve daha hafif elektronik tablo odaklı raporlama için [Google Sheets](../nodes/google-sheets-node.md) ile eşleşir.

[Set](../nodes/set-node.md), [LLM](../nodes/llm-node.md), [Google Sheets](../nodes/google-sheets-node.md) ve [Third-Party Integrations](./integrations.md) ile eşleşir.
#### [Google Drive](../nodes/google-drive-node.md)

Google Drive düğümü, OAuth2 aracılığıyla Drive dosyalarını ve klasörlerini listeler, indirir, günceller ve siler; ayrıca `syncToHeymDrive` işlemiyle bir Drive dosyasını doğrudan [Heym Drive](../nodes/drive-node.md) içine kopyalayabilir. Google Docs, Sheets ve Slides indirilebilir baytlara sahip olmadığından, düğüm bunları otomatik olarak dışa aktarır — Docs'u PDF'ye, Sheets'i XLSX'e, Slides'ı PPTX'e — hedef format için bir geçersiz kılma seçeneğiyle birlikte. Silme işlemleri, "Delete permanently" etkinleştirilmediği sürece öğeleri Drive çöp kutusuna taşır ve düğüm, dosya işlemi aracılığıyla bir klasörü silmeyi veya tam tersini reddeder. [Google Sheets](../nodes/google-sheets-node.md) gibi, Google destekli bir OAuth2 credential kullanır; bu credential'ın tam Drive erişimi talep ettiğini unutmayın, bu nedenle paylaşmadan önce [Credential Sharing](./credentials-sharing.md) belgesini inceleyin.

[Loop](../nodes/loop-node.md), [Drive](../nodes/drive-node.md), [LLM](../nodes/llm-node.md) ve [Third-Party Integrations](./integrations.md) ile birlikte kullanılır.

#### [GitHub](../nodes/github-node.md)

GitHub düğümü; repository'ler, organizasyonlar ve kullanıcılar, issue'lar, pull request'ler, review'lar, release'ler, Actions workflow'ları, trafik içgörüleri ve repository dosyalarını kapsayan 40 yerel GitHub REST eylemi sunar. HTTP isteklerini elle oluşturmadan issue triyajı, review otomasyonu, workflow dispatch ve tamamlanma beklemeleri, release otomasyonu ve repo dosya güncellemeleri için kullanın. GitHub.com'u ve credential üzerinde isteğe bağlı GitHub Enterprise `base_url`'ini destekler.

[Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Set](../nodes/set-node.md) ve [Third-Party Integrations](./integrations.md) ile birlikte kullanılır.

#### [Jira](../nodes/jira-node.md)

Jira düğümü, proje, issue, yorum, ek, kullanıcı, bildirim ve geçiş otomasyonu için workflow'ları Jira Cloud veya Jira Data Center / Server REST API'lerine bağlar. Projeleri listeleyebilir, JQL ile issue arayabilir, issue oluşturabilir veya güncelleyebilir, changelog'ları inceleyebilir, paydaşları bilgilendirebilir, yorumları ve ekleri yönetebilir, kullanıcıları getirebilir veya yönetebilir, mevcut geçişleri listeleyebilir ve bir geçiş ID'si aracılığıyla issue'ları taşıyabilir. Atlassian e-postası, API token, site base URL ve deployment modu içeren bir Jira credential kullanın.

Destek intake, bug triyajı ve release workflow'ları için [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) ve [Third-Party Integrations](./integrations.md) ile birlikte kullanılır.

#### [Linear](../nodes/linear-node.md)

Linear düğümü, workspace ve issue otomasyonu için workflow'ları Linear'ın GraphQL API'sine bağlar. Takımları, projeleri, issue'ları, workflow durumlarını, takım üyelerini ve yorumları listeleyebilir; issue'ları oluşturabilir, güncelleyebilir, silebilir ve bağlayabilir; yorumları oluşturabilir, güncelleyebilir, çözebilir, çözümden çıkarabilir veya silebilir. Bir Linear kişisel API anahtarı veya OAuth2 credential kullanın, ardından issue oluşturmadan veya güncellemeden önce liste işlemlerinden takım, proje, durum ve atanan UUID'lerini keşfedin.

Intake, triyaj ve mühendislik backlog workflow'ları için [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) ve [Third-Party Integrations](./integrations.md) ile birlikte kullanılır.

#### [Supabase](../nodes/supabase-node.md)

Supabase düğümü, Supabase PostgREST aracılığıyla açığa çıkarılan tabloları okur ve değiştirir. Ürün backend'leri, kullanıcı/profil verileri, workflow durumu ve özel HTTP istek kablolaması olmadan veritabanı erişimi isteyen CRUD tarzı otomasyonlar için uygundur.

[Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md), [HTTP](../nodes/http-node.md) ve [Third-Party Integrations](./integrations.md) ile birlikte kullanılır.

#### [ClickHouse](../nodes/clickhouse-node.md)

ClickHouse düğümü, HTTP arayüzü üzerinden harici bir ClickHouse veritabanına karşı CRUD, count ve ham SQL işlemlerini çalıştırır. Analitik pipeline'lar, olay günlükleme ve raporlama workflow'ları için uygundur: olayları gerçekleştikleri anda ekleyin, ardından `query`/`count` ile bunları toplayın veya sayın. [DataTable](../nodes/datatable-node.md) işlem kümesini (find, getAll, count, getById, insert, update, remove, upsert) ve bir ham SQL kaçış kapısını yansıtır; `update`/`remove` ClickHouse mutation'ları olarak çalışır.

[Set](../nodes/set-node.md), zamanlanmış raporlar için [Cron](../nodes/cron-node.md) ve [Third-Party Integrations](./integrations.md) ile birlikte kullanılır.

#### [Notion](../nodes/notion-node.md)

Notion düğümü, güncel Notion API'si (`2026-03-11`) aracılığıyla Notion veritabanlarını, veri kaynaklarını, sayfaları ve blokları yönetir. Arama, sayfa CRUD, veritabanı ve veri kaynağı işlemleri, blok alt öğeleri, blok ekleme/güncelleme/silme ve çöp kutusuna taşıma/geri yükleme destekler. Bir dahili entegrasyon token'ı veya bir Notion genel entegrasyon OAuth credential'ı kullanın. Editör, erişilebilir veri kaynaklarını ve üst sayfaları arayabilir ve imleçle sayfalayabilir. Paylaşılan credential'lar, workflow yürütmesi için sahip olunan credential'larla aynı şekilde çalışır.

Özel REST çağrıları için `$credentials.YourNotionCredential` aynı bearer token'a çözümlenir. [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [LLM](../nodes/llm-node.md) ve [Third-Party Integrations](./integrations.md) ile birlikte kullanılır.
#### [Sentry](../nodes/sentry-node.md)

Sentry düğümü, Sentry REST API'si aracılığıyla Sentry organizasyonlarını, projelerini, ekiplerini, sorunlarını, olaylarını ve sürümlerini otomatikleştirir. Uyarı triyajı, sorun durumu güncellemeleri, sürüm otomasyonu, olay arama ve proje/ekip kurulumu veya temizliği için kullanın. İsteğe bağlı bir credential base URL aracılığıyla Sentry SaaS ve self-hosted Sentry'yi destekler.

Olay ve sürüm iş akışları için [Error Handler](../nodes/error-handler-node.md), [Slack](../nodes/slack-node.md), [Linear](../nodes/linear-node.md) ve [Third-Party Integrations](./integrations.md) ile birlikte kullanılır.

#### [DataTable](../nodes/datatable-node.md)

DataTable düğümü, Heym DataTables'ta (birinci taraf yapılandırılmış depolama) verileri okur, yazar ve yönetir. İşlemler arasında find, getAll, getById, insert, update, remove ve upsert bulunur. Harici credential gerekmez. Tablolar [DataTable](../tabs/datatable-tab.md) dashboard sekmesinden yönetilir ve doğrudan workflow sahibi tarafından erişilir.

Birinci taraf yapılandırılmış depolama için [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md) ve [DataTable sekmesi](../tabs/datatable-tab.md) ile birlikte kullanılır.

#### [Drive](../nodes/drive-node.md)

Drive düğümü, skill'ler tarafından oluşturulan dosyaları doğrudan bir workflow içinden yönetir. İşlemler arasında delete, setPassword, setTtl, setMaxDownloads, shareWithMyTeams ve salt okunur ekip erişim yönetimi için unshareWithMyTeams bulunur; format dönüştürme bunun yerine [Converter](../nodes/converter-node.md) düğümünde yer alır. Dosyaya `$agentLabel._generated_files[0].id` ile başvurun; çıktılar arasında status, file_id, bağlantı kısıtlamaları için güncellenmiş download_url ve ekip paylaşımı için shared_team_count bulunur. Bu özellikle [File Generation](./file-generation.md) ve [Drive](./drive.md) referans modelini kullanan [Agent Node](../nodes/agent-node.md) workflow'larıyla kullanışlıdır.

Yaygın yardımcı düğümler [Agent Node](../nodes/agent-node.md), [File Generation](./file-generation.md) ve [Drive](./drive.md)'dir.

#### [Amazon S3](../nodes/amazon-s3-node.md)

Amazon S3 düğümü, bir `s3` credential'ı (access key, secret key, region, isteğe bağlı session token) kullanarak Amazon S3 üzerinde nesne depolama işlemlerini çalıştırır. İşlemler arasında putObject, getObject, deleteObject, listObjects, copyObject, createBucket, deleteBucket, createFolder, deleteFolder, getAllFolder ve listBuckets bulunur. Metin yükleme ve metin veya base64 indirme desteklenir; bucket ve key alanları [Expression DSL](./expression-dsl.md) kabul eder. Workflow çıktılarını depolamak, dosyaları arşivlemek ve nesneleri bir akışa geri okumak için kullanın.

[Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [Credentials](./credentials.md) ve [Third-Party Integrations](./integrations.md) ile birlikte kullanılır.

### Otomasyon

#### [Crawler](../nodes/crawler-node.md)

Crawler düğümü, isteğe bağlı CSS seçicileri aracılığıyla HTML çıkarımı ile FlareSolverr kullanarak web sayfalarını kazır. Bir FlareSolverr [credential](./credentials.md), URL ifadesi, bekleme süresi ve çıkarım için isteğe bağlı seçiciler yapılandırın. Çıktı, ham HTML veya çıkarılan içeriktir. Web kazıma ve içerik çıkarımı için kullanın.

Kazı-ve-analiz akışları için [HTTP](../nodes/http-node.md), [Playwright](../nodes/playwright-node.md) ve [LLM](../nodes/llm-node.md) ile birlikte kullanılır.

#### [Playwright](../nodes/playwright-node.md)

Playwright düğümü, yapılandırılabilir adımlarla (navigate, refresh, click, type, screenshot, extract, aiStep) veya özel Playwright Python için **Run Code** moduyla (sandboxed; `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED` aracılığıyla varsayılan olarak kapalı) tarayıcı etkileşimlerini otomatikleştirir. Headless modu, yaygın Playwright otomasyon sinyallerini azaltan isteğe bağlı bir ayarı, timeout'ları, isteğe bağlı ağ yakalama (responses, cookies, localStorage, sessionStorage), `$global.authState` gibi [Global Variables](./global-variables.md) ifadelerinden cookie/storageState auth bootstrap'ini, auth geri yükleme başarısız olduğunda fallback login adımlarını ve seçiciler başarısız olduğunda Auto Heal ile bir AI adımını destekler. Web kazıma, form doldurma ve tarayıcı tabanlı workflow'lar için kullanın.

Tarayıcı otomasyonu ve hata ayıklama için ayrıca [Crawler](../nodes/crawler-node.md), [HTTP](../nodes/http-node.md) ve [Execution History](./execution-history.md) bölümlerine bakın.

### Yardımcı Araçlar

#### [Output](../nodes/output-node.md)

Output düğümü, çağırana yanıtı döndüren workflow endpoint'idir. Mesaj ifadesini, önceki düğüme label ile başvuracak şekilde ayarlayın (burada [Input](../nodes/input-node.md) düğümünden `$input` asla kullanmayın). İsteğe bağlı async downstream, yanıt gönderildikten sonra output'tan sonraki düğümlerin arka planda çalışmasına olanak tanır.

Yaygın upstream kaynakları [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md) ve [Execute](../nodes/execute-node.md)'dir; yanıt şekillendirmesinde hata ayıklamak [Expression Evaluation Dialog](./expression-evaluation-dialog.md) içinde daha kolaydır.

#### [JSON output mapper](../nodes/json-output-mapper-node.md)

JSON output mapper düğümü, [Set](../nodes/set-node.md) tarzı anahtar-değer eşlemelerinden düz bir JSON nesnesi oluşturur ve bunu workflow yanıtının kökünde döndürür. Bir API çağıranının standart [Output](../nodes/output-node.md) düğümü sarmalayıcısı yerine ham bir JSON gövdesi alması gerektiğinde kullanın.
#### [HTML çıktı eşleyici](../nodes/html-output-mapper-node.md)

HTML çıktı eşleyici düğümü, tek bir HTML şablonunu işleyerek `$nodeLabel.field` ifadelerini sayfaya yerleştirir. Workflow'un tek terminal düğümü olduğunda, execute webhook JSON gövdesi yerine `text/html` ve düğümün yapılandırılmış durum koduyla yanıt verir; böylece bir workflow doğrudan tarayıcıya sayfa sunabilir. Hata ayıklama için normal JSON zarfını geri almak üzere `X-Simple-Response: false` gönderin.

[Set](../nodes/set-node.md), [Output](../nodes/output-node.md), [Workflow Structure](./workflow-structure.md) ve [Webhooks](./webhooks.md) ile birlikte kullanılır.

#### [Chart Output](../nodes/chart-output-node.md)

Chart Output düğümü, bir [Dashboard](../tabs/dashboard-tab.md) widget workflow'unun terminal düğümüdür. Yukarı akış düğümleri tarafından üretilen satırları, dashboard'un işlediği standart bir grafik payload'ına dönüştürür. Bir `chartType` (bar, line, area, pie, table, numeric, gauge, scatter, proportion, bar gauge, text veya HITL) seçin, `labelField`/`valueField` (veya çok serili grafikler için `series`, ya da bir markdown mesajı için `text`) eşleyin ve en sona yerleştirin; çıkış kenarı yoktur. HITL, yukarı akış satırlarını yok sayar ve bekleyen insan incelemelerinizi listeler.

Ayrıca bkz. [Dashboard](../tabs/dashboard-tab.md), [Set](../nodes/set-node.md) ve [Output](../nodes/output-node.md).

#### [Wait](../nodes/wait-node.md)

Wait düğümü, workflow yürütmesini milisaniye cinsinden belirtilen bir süre boyunca, en fazla 15 dakikaya kadar duraklatır. Hız sınırlama, gecikmeli eylemler veya yoklama aralıkları için kullanın. Girişi değiştirmeden geçirir.

Hız ayarlama ve yoklama için [Cron](../nodes/cron-node.md), [Redis](../nodes/redis-node.md) ve [Parallel Execution](./parallel-execution.md) ile birlikte kullanılır.

#### [Sticky Note](../nodes/sticky-note-node.md)

Sticky Note düğümü, tuvale markdown notları ekler. Yürütülmez. Diğer [Canvas Features](./canvas-features.md) ile birlikte dokümantasyon, talimatlar veya workflow notları için kullanın. Not içeriğini düzenlemek için tuvale çift tıklayın.

Ayrıca bkz. [Canvas Features](./canvas-features.md), [Keyboard Shortcuts](./keyboard-shortcuts.md) ve [Workflow Organization](./workflow-organization.md).

#### [Console Log](../nodes/console-log-node.md)

Console Log düğümü, bir değeri arka uç (sunucu) konsoluna kaydeder. Geliştirme sırasında hata ayıklama ve inceleme için kullanın. Günlük mesajı [Expression DSL](./expression-dsl.md) ifadelerini destekler; çıktı girişi değiştirmeden geçirir.

Hata ayıklama için [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md) ve [Expression Evaluation Dialog](./expression-evaluation-dialog.md) ile birlikte kullanılır.

#### [Disable Node](../nodes/disable-node.md)

Disable Node düğümü, workflow'daki başka bir düğümü `active` bayrağını false olarak ayarlayarak kalıcı olarak devre dışı bırakır. Hedef düğümü etikete göre belirtin. Bir koşul karşılandıktan sonra bir [Cron](../nodes/cron-node.md) trigger'ını durdurmak gibi tek seferlik işlemler için kullanın.

Workflow kontrol kalıpları için ayrıca bkz. [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md) ve [Cron](../nodes/cron-node.md).

#### [Enable Node](../nodes/enable-node.md)

Enable Node düğümü, başka bir düğümü `active` bayrağını true olarak ayarlayıp değişikliği kaydederek yeniden etkinleştirir. Hedef düğümü etikete göre belirtin. Devre dışı bırakılmış bir [Cron](../nodes/cron-node.md) trigger'ını başka bir giriş noktasından yeniden kurmak veya bir koşul karşılandığında bir düğümü açmak için kullanın. Enable Node'un aşağı akışında bulunan ve henüz çalışmamış bir hedef de mevcut yürütmede çalışır.

Workflow kontrol kalıpları için ayrıca bkz. [Disable Node](../nodes/disable-node.md), [Canvas Features](./canvas-features.md) ve [Cron](../nodes/cron-node.md).

#### [Throw Error](../nodes/throw-error-node.md)

Throw Error düğümü, workflow yürütmesini derhal durdurur ve özel bir HTTP durum koduyla bir hata yanıtı döndürür. Hata mesajı ifadesini ve durum kodunu (örn. 400, 401, 403, 404, 429, 500) ayarlayın. Doğrulama hataları, yetkisiz erişim veya diğer hata koşulları için, özellikle [Condition](../nodes/condition-node.md) ve [Error Handler](../nodes/error-handler-node.md) ile birlikte kullanıldığında kullanın.

Açık hata yolları için [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) ve [Security](./security.md) ile birlikte kullanılır.

---

## Reference
### [Düğüm Türleri](./node-types.md)

Heym çeşitli düğüm türleri sunar: [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) ve [Error Handler](../nodes/error-handler-node.md) gibi trigger'lar; [LLM](../nodes/llm-node.md), [Decision](../nodes/decision-node.md), [Agent Node](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Qdrant RAG](../nodes/rag-node.md) ve [MCP Call](../nodes/mcp-call-node.md) gibi AI düğümleri; [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Merge](../nodes/merge-node.md) ve [Loop](../nodes/loop-node.md) gibi mantık düğümleri; [Set](../nodes/set-node.md), [Converter](../nodes/converter-node.md), [Code](../nodes/code-node.md), [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) ve [Heym](../nodes/heym-node.md) gibi veri düğümleri; [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), [Discord](../nodes/discord-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md), [Grist](../nodes/grist-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Drive](../nodes/google-drive-node.md), [BigQuery](../nodes/bigquery-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [DataTable](../nodes/datatable-node.md) ve [Drive](../nodes/drive-node.md) gibi entegrasyonlar; [Crawler](../nodes/crawler-node.md) ve [Playwright](../nodes/playwright-node.md) gibi otomasyon düğümleri; ve [Wait](../nodes/wait-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md), [HTML output mapper](../nodes/html-output-mapper-node.md), [Console Log](../nodes/console-log-node.md), [Throw Error](../nodes/throw-error-node.md), [Disable Node](../nodes/disable-node.md), [Enable Node](../nodes/enable-node.md) ve [Sticky Note](../nodes/sticky-note-node.md) gibi yardımcı araçlar. Düğüm yapılandırmasında `$input.text` ve `$nodeLabel.field` gibi ifadeler kullanın.

Ayrıca bkz. [Triggers](./triggers.md), [Third-Party Integrations](./integrations.md) ve [Parallel Execution](./parallel-execution.md).

### [Expression DSL](./expression-dsl.md)

Heym, üst düğümlerden veri referans almak için basit bir ifade dili kullanır. [Input](../nodes/input-node.md) düğümü için `$input`, herhangi bir üst düğüm için `$nodeLabel.field`, [credentials](./credentials.md) için `$credentials.CredentialName` ve [global variables](./global-variables.md) için `$global.variableName` kullanın. Yerleşik özel değişkenler arasında `$now`, `$UUID` ve workflow meta verileri bulunur: `$workflowName`, `$workflowDescription`, `$workflowPath`, `$workflowUrl` ve `$executionId` (çalıştırmanın [Execution History](./execution-history.md) kimliği — `/workflows/{id}/{executionId}` bu çalıştırmayı canvas üzerinde açar; yalnızca çalışma zamanında geçerlidir, ifade önizleme iletişim kutusunda boştur). Desteklenen özellikler arasında literaller, aritmetik, karşılaştırmalar, [Loop](../nodes/loop-node.md) bağlamı, iç içe alanlar ve dize/dizi yardımcıları (bir JSON dizesini ayrıştırmak için `$text.toJson()` dahil) bulunur. Tam değer tek bir `$expr` olduğunda, backend dizileri, nesneleri, boolean'ları ve sayıları yerel türler olarak korur.

Ayrıca bkz. [Expression Evaluation Dialog](./expression-evaluation-dialog.md), [Global Variables](./global-variables.md) ve [Workflow Structure](./workflow-structure.md).

### [Global Variables](./global-variables.md)

Global Variable Store, workflow çalıştırmaları arasında kalıcı olan, kullanıcıya özel anahtar-değer verilerini tutar. Değişkenleri [Variables](../tabs/global-variables-tab.md) sekmesinden veya "Store in Global Variable Store" etkinleştirilmiş bir [Variable](../nodes/variable-node.md) düğümünden oluşturun. İfadelerde bunlara `$global.variableName` ile erişin; diğer kullanıcılarla veya [teams](./teams.md) ile paylaşılabilirler.

Paylaşılan workflow durumu için [Variable](../nodes/variable-node.md), [Teams](./teams.md) ve [Credentials Sharing](./credentials-sharing.md) ile birlikte kullanılır.
### [Expression Evaluation Dialog](./expression-evaluation-dialog.md)

Expression Evaluation Dialog, expression alanlarının yanındaki genişlet düğmesine tıkladığınızda görünen genişletilebilir bir editördür. Büyük, ortalanmış bir modal olarak açılır, autocomplete etkin kalır ve yazmayı durdurduğunuzda backend önizleme çıktısını otomatik olarak yeniler. Nesne ve dizi sonuçları, çıktı yolu seçici ile incelenebilir. Dialog, tam satırlık çıplak nokta yolunu (örneğin `myNode.output.field`) `$myNode.output.field` gibi kabul eder; yerleştirme kuralları için [Expression DSL](./expression-dsl.md) bölümüne bakın.

Araç çubuğundaki **Build with AI** düğmesi, istediğiniz expression'ı düz metin olarak tanımlamanıza olanak tanır. Bir LLM [credential](./credentials.md) ve model seçin, *"API yanıtından müşteri adını al"* gibi bir açıklama yazın ve Generate'e tıklayın. Backend, [Expression DSL](./expression-dsl.md) bağlamını ve son çalıştırma düğüm çıktılarını modele gönderir ve tek bir expression dizesi döndürür. Sonuç hemen değerlendirilir, böylece Apply'e tıklamadan önce doğrulayabilirsiniz.

[Expression DSL](./expression-dsl.md), [Output](../nodes/output-node.md) ve [JSON output mapper](../nodes/json-output-mapper-node.md) ile doğal olarak eşleşir.

### [Workflow Structure](./workflow-structure.md)

Workflow'lar, düğümler ve kenarlarla birlikte JSON olarak saklanır. Workflow nesnesi id, name, description, nodes, edges ve auth ayarlarını içerir. Her düğüm id, type, position ve data (label ve türe özgü config) içerir. Kenarlar, kaynak ve hedef düğüm kimliklerini isteğe bağlı handle kimlikleriyle bağlar. Data alanlarındaki expression sözdizimi [Expression DSL](./expression-dsl.md) kurallarını izler ve aynı yapı [Download & Import](./download-import.md) tarafından da kullanılır.

Ayrıca bkz. [Node Types](./node-types.md), [Expression DSL](./expression-dsl.md) ve [Download & Import](./download-import.md).

### [Canvas Features](./canvas-features.md)

Herhangi bir sticky olmayan canvas düğümünün üzerine gelin ve o düğüme kadar çalıştırmak için **Run**'a tıklayın. Gerekli girdiler, ilk alana odaklanılmış olarak Run panelinde açılır; girdisi olmayan yollar hemen başlar. Bkz. [Run to Node](./canvas-features.md#run-to-node).

Workflow editörü; Data Pin (yeniden çalıştırmadan aşağı akışı test etmek için bir düğümün son çıktısını sabitleme), Execution Logs ([Execution History](./execution-history.md)'yi tamamlayan gerçek zamanlı düğüm sonuçları ve agent ilerlemesi), Enable/Disable (yürütme sırasında düğümleri atlama) ve Extract to Sub-Workflow (bir seçimi yeni bir workflow'a taşıma ve onu bir [Execute](../nodes/execute-node.md) düğümüyle değiştirme) sağlar. Çalışan bir production execution'ı History'den veya bir Board kartından açılabilir; editör mevcut snapshot'ını geri yükler, SSE'ye bağlanır ve canvas animasyonu ile Debug loglarını canlı tutar. [Keyboard Shortcuts](./keyboard-shortcuts.md) kopyalama, yapıştırma, çalıştırma ve satır içi düğüm aramayı destekler.

Ayrıca bkz. [Keyboard Shortcuts](./keyboard-shortcuts.md), [Edit History](./edit-history.md) ve [Execution History](./execution-history.md).

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Watch Editor demo</a></p>

### [Keyboard Shortcuts](./keyboard-shortcuts.md)

Heym, editör genelinde kısayollar sunar: Command Palette (Ctrl+K), Run (Ctrl+Enter), Save (Ctrl+S), Undo/Redo ve kapatmak için Escape. Canvas üzerinde: tümünü seç, çoklu seçim, kopyala/kes/yapıştır, sil, düğüm etkinleştirmeyi değiştir (D), sabitlenmiş veriyi değiştir (P) ve yazarak satır içi düğüm arama. Kısayollar uygulama içi referansta belgelenmiştir ve Data Pin ile düğüm etkinleştirme/devre dışı bırakma gibi [Canvas Features](./canvas-features.md) ile yakından çalışır.

Ayrıca bkz. [Canvas Features](./canvas-features.md), [Quick Drawer](./quick-drawer.md) ve [Contextual Showcase](./contextual-showcase.md).

### [AI Assistant](./ai-assistant.md)

AI Assistant, Debug panelinden açılan ve doğal dil ile workflow'lar oluşturmanıza veya değiştirmenize olanak tanıyan bir sohbet panelidir. Bir [credential](./credentials.md) ve model seçin, ardından istediğinizi tanımlayın; AI bir yanıt akışı sunar ve bir kod bloğundaki geçerli herhangi bir [workflow JSON](./workflow-structure.md) otomatik olarak ayrıştırılıp canvas'a uygulanır. Uyumlu tarayıcılarda sesli giriş desteklenir.

**YOLO mode**'u (Agent mode, varsayılan olarak kapalı) açın ve asistan oluşturduğunu test eder. Her değişiklikten sonra workflow'u canvas üzerinde çalıştırır, sonucu okur ve istediğinizi yapana kadar workflow'u düzeltir; mesaj başına en fazla 5 çalıştırma yapar. İlk çalıştırmadan önce test girdilerini ister, sonucuna ihtiyaç duyduğunda diğer workflow'larınızı çalıştırabilir ve çalışırken her adımı gösterir. Bkz. [AI Assistant › YOLO Mode](./ai-assistant.md#yolo-mode).

Bir workflow kayıtları sakladığında, asistan hangi [data table](../tabs/datatable-tab.md)'ın kullanılacağını sorar veya workflow'un ihtiyaç duyduğu sütunlarla bir tane oluşturur. Bkz. [AI Assistant › Data tables](./ai-assistant.md#data-tables).

Mevcut workflow [Agent Node](../nodes/agent-node.md) skill'leri içerdiğinde, asistan workflow bağlamına yalnızca her skill'in `SKILL.md` dosyasını gönderir. Ekli `.py` dosyaları ve ikili skill varlıkları, büyük skill paketlerinin model bağlam penceresini taşırmaması için istekten önce hariç tutulur.

[Chat with Heym](./chat-with-heym.md), [Agent Architecture](./agent-architecture.md) ve [Expression DSL](./expression-dsl.md) ile iyi eşleşir.
### [Heym ile Sohbet](./chat-with-heym.md)

Heym ile Sohbet, ürün soruları için bir dokümantasyon başlığı asistanıdır. Ortalanmış bir diyalog içinde açılır, credential ve model seçimini üst kısımda görünür tutar, etkin dokümantasyon sayfası yolunu bağlam olarak enjekte eder ve diyalog kapandığında mesaj geçmişini temizler. Daha kapsamlı [AI Assistant](./ai-assistant.md) ve daha hafif [Contextual Showcase](./contextual-showcase.md) özelliklerini tamamlar.

Ayrıca bkz. [AI Assistant](./ai-assistant.md), [Contextual Showcase](./contextual-showcase.md) ve [Node Types](./node-types.md).

### [Workflow Organizasyonu](./workflow-organization.md)

Instance yöneticileri (`HEYM_ADMIN_EMAILS`) her workflow'a erişebilir ve düzenleyebilir, bir sahibin workflow'larını e-posta ile bulabilir, zamanlamaları ve yürütme geçmişini inceleyebilir, otomatik trigger'ları duraklatıp devam ettirebilir ve çalışmalar sonuçlandıktan sonra workflow'ları silebilir. Offboarding akışı ve otomatik trigger'ları duraklatma ile tüm çağrıları engelleme arasındaki fark için bkz. [Instance Administration](../tabs/workflows-tab.md#instance-administration).

Workflow'lar bir ağaç yapısında klasörler ve alt klasörler halinde organize edilebilir. Klasörlerin adları ve isteğe bağlı üst klasörü vardır; workflow'lar klasörlere atanır. Workflow'lar silinmek üzere zamanlanabilir (kalıcı olarak kaldırılmadan önce bir çöp alanına taşınır). API; oluşturma, güncelleme, silme ve workflow'ları klasörler arasında taşıma işlemlerini destekler ve aynı organizasyon modeli [Workflows](../tabs/workflows-tab.md) sekmesinde de görünür.

Ayrıca bkz. [Quick Drawer](./quick-drawer.md), [Download & Import](./download-import.md) ve [Edit History](./edit-history.md).

### [Quick Drawer](./quick-drawer.md)

Quick Drawer, canvas dışı dahili sayfalar için sabit bir sağ tarafta hızlı çalıştırma panelidir. Editörü açmadan [workflow'ları](../tabs/workflows-tab.md) aramanıza, favorileri sabitlemenize, girdileri seçmenize, hemen çalıştırmanıza ve ilerlemeyi veya sonuçları incelemenize olanak tanır. Sabitleme sırası ve son seçilen workflow tarayıcıda saklanır.

Ayrıca bkz. [Workflow Organization](./workflow-organization.md), [Keyboard Shortcuts](./keyboard-shortcuts.md) ve [Execution History](./execution-history.md).

### [Contextual Showcase](./contextual-showcase.md)

Contextual Showcase, dashboard sekmeleri, [Evals](../tabs/evals-tab.md), Docs ve workflow editörü gibi kimliği doğrulanmış ana yüzeyler için kompakt bir uygulama içi kılavuz çubuğudur. Varsayılan olarak kapalı kalır, önce kısa bir sayfa özeti sunar, talep üzerine biraz daha fazla ayrıntı sağlar ve daha derin rehberlik istediğinizde tam dokümantasyon makalesine bağlantı verir.

Uygulama içi rehberlik akışları için [Chat with Heym](./chat-with-heym.md), [Quick Drawer](./quick-drawer.md) ve [AI Assistant](./ai-assistant.md) ile eşleşir.

### [Credentials](./credentials.md)

Credentials, workflow düğümleri tarafından kullanılan API anahtarlarını ve gizli bilgileri saklar. Bunları [Credentials](../tabs/credentials-tab.md) sekmesinde ekleyin ve [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Send Email](../nodes/send-email-node.md) ve [Redis](../nodes/redis-node.md) gibi düğümlerde ad veya ID ile referans verin. Bekleme durumunda şifrelenirler, kullanıcılarla veya [teams](./teams.md) ile paylaşılabilirler ve [Expression DSL](./expression-dsl.md) içinde `$credentials.Name` aracılığıyla da referans verilebilirler.

Ayrıca bkz. [Credentials](../tabs/credentials-tab.md), [Credentials Sharing](./credentials-sharing.md) ve [Third-Party Integrations](./integrations.md).

### [Credentials Sharing](./credentials-sharing.md)

Credentials, e-posta ile diğer kullanıcılarla veya teams ile paylaşılabilir; bir credential bir team ile paylaşıldığında tüm team üyeleri erişim kazanır. Paylaşılan credentials, [Credentials](../tabs/credentials-tab.md) sekmesinde bir gösterge ile görünür. Çalışma zamanında, workflow sahibinin bağlamı sahip olunan, kullanıcıyla paylaşılan ve team ile paylaşılan credentials'ı birleştirir. İfadelerde `$credentials.CredentialName` kullanın veya düğüm verisinde credentialId ayarlayın.

Ayrıca bkz. [Credentials](./credentials.md), [Teams](./teams.md) ve [Third-Party Integrations](./integrations.md).

### [Teams](./teams.md)

Teams, workflow'ları, credentials'ı, global değişkenleri, vector store'ları ve Drive dosyalarını bir kullanıcı grubuyla tek seferde paylaşmanıza olanak tanır. [Teams](../tabs/teams-tab.md) sekmesinden team'ler oluşturun ve üyeleri e-posta ile ekleyin. Kaynakları ilgili paylaşım diyaloglarından bir team ile paylaşın; ardından tüm üyeler erişime sahip olur. Oluşturan kişi team'i düzenleyebilir ve silebilir; bir team'i silmek tüm team paylaşımlarını kaldırır.

[Credentials Sharing](./credentials-sharing.md), [Global Variables](./global-variables.md) ve [Enterprise](./enterprise.md) ile eşleşir.

### [Parallel Execution](./parallel-execution.md)

Heym, birbirlerine bağımlılığı olmayan düğümleri paralel olarak çalıştırır. Executor bir DAG oluşturur ve aynı seviyedeki düğümleri bir thread pool ile eşzamanlı olarak çalıştırır; bir düğüm tamamlanır tamamlanmaz alt düğümleri zamanlanır. Gerektiğinde paralel dalları birleştirmek için [Merge](../nodes/merge-node.md) düğümünü kullanın. Birden fazla workflow çalışması eşzamanlı olarak yürütülür; her çalışma izole edilmiştir. [SSE Streaming](./sse-streaming.md) modu, düğümler tamamlandıkça olaylar yayar.

Ayrıca bkz. [Merge](../nodes/merge-node.md), [Loop](../nodes/loop-node.md) ve [Execution History](./execution-history.md).
### [Agent Architecture](./agent-architecture.md)

[Agent Node](../nodes/agent-node.md), alt ajanları (orchestrator, call_sub_agent aracılığıyla diğer agent düğümlerini çağırır), alt workflow'ları (agent, call_sub_workflow aracılığıyla diğer workflow'ları çağırır), skill'leri (.zip veya .md dosyalarından gelen talimat içeriği ve Python araçları) ve [MCP](../tabs/mcp-tab.md) istemci bağlantılarını destekler. Orchestrator araç yürütücüsü, alt ajan ve alt workflow çağrılarını yönlendirir; diğer araçlar Python, MCP veya skill yürütücülerine gider. Alt ajanlar ve alt workflow'lar için maksimum iç içe geçme derinliği 5'tir. Araç çağırma döngüsü otomatik bağlam sıkıştırması içerir: her yinelemeden önce token kullanımı tahmin edilir ve modelin bağlam penceresinin %80'ini aşarsa, sistem prompt'u, ilk kullanıcı mesajı ve son kullanıcı mesajı korunarak ortadaki mesajlar aynı model kullanılarak özetlenir.

Ayrıca bkz. [Agent Node](../nodes/agent-node.md), [Agent Persistent Memory](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) ve [MCP](../tabs/mcp-tab.md).

### [Agent Persistent Memory](./agent-persistent-memory.md)

Postgres'te saklanan, her [Agent Node](../nodes/agent-node.md) için isteğe bağlı bilgi grafiği: varlıklar, türler, özellikler ve yönlü ilişkiler. `persistentMemoryEnabled` true olduğunda, grafik her çalıştırmada sistem prompt'una özetlenir; başarılı tamamlamalardan sonra bir [LLM](../nodes/llm-node.md) arka planda yapılandırılmış güncellemeleri çıkarır. REST CRUD, `/api/workflows/{workflow_id}/nodes/{canvas_node_id}/agent-memory/...` altında bulunur. Editör, düğümdeki pembe beyin kontrolünden açılır.

Ayrıca bkz. [Agent Node](../nodes/agent-node.md), [Agent Architecture](./agent-architecture.md) ve [Traces](../tabs/traces-tab.md).

### [Human-in-the-Loop](./human-in-the-loop.md)

Human-in-the-loop, bir [Agent Node](../nodes/agent-node.md)'un belirli kontrol noktalarında onay istemesine, genel bir `/review/{token}` sayfası oluşturmasına ve oturum açmamış bir gözden geçirenin Markdown inceleme metnini kabul etmesini, düzenlemesini veya reddetmesini beklemesine olanak tanır. HITL etkinleştirilmiş ajanlar ayrıca bir `review` çıktı tutamacı sunar; böylece çalıştırma beklemedeyken [Slack](../nodes/slack-node.md), [Send Email](../nodes/send-email-node.md) veya diğer kanalları bilgilendirebilirsiniz. Düğüm düzeyindeki HITL metni onay yönergeleri olarak kullanılırken, genel sayfa özeti inceleme isteğinin kendisinden oluşturulur. Bekleyen çalıştırmalar hemen [Execution History](./execution-history.md)'de görünür, aynı çalıştırmada birden fazla kez gerçekleşebilir ve her karar gönderildikten sonra tam olarak saklanan workflow anlık görüntüsünden devam eder.

Ayrıca bkz. [Agent Node](../nodes/agent-node.md), [Portal](./portal.md), [Execution History](./execution-history.md) ve [Send Email](../nodes/send-email-node.md).

### [Webhooks](./webhooks.md)

Workflow'lar, `POST /api/workflows/{workflow_id}/execute` adresinde [HTTP](../nodes/http-node.md) aracılığıyla tetiklenebilir veya `POST /api/workflows/{workflow_id}/execute/stream` adresinden artımlı olarak akışa alınabilir. İstek gövdesi, [Input](../nodes/input-node.md) düğümlerine body olarak iletilir; başlıklar ve sorgu parametreleri [Expression DSL](./expression-dsl.md) ifadelerinde kullanılabilir. Workflow başına kimlik doğrulamayı yapılandırın: anonim, JWT veya özel başlık. İsteğe bağlı yanıt önbelleğe alma, hız sınırlama ve editörün Run with cURL iletişim kutusu workflow üzerinde bulunur ve her iki moda da uygulanır.

Ayrıca bkz. [Input](../nodes/input-node.md), [Execution Tokens](./execution-tokens.md), [SSE Streaming](./sse-streaming.md), [HTTP](../nodes/http-node.md) ve [Workflow Structure](./workflow-structure.md).

### [Execution Tokens](./execution-tokens.md)

Execution token'ları, tek bir workflow'un execute ve stream endpoint'lerine erişim sağlayan kapsamlı JWT'lerdir. Bir workflow JWT kimlik doğrulaması kullandığında, token'lar harici betiklerin, CI pipeline'larının ve entegrasyonların bir kullanıcı oturumunu paylaşmadan workflow'u çağırmasına olanak tanır. Her token, onu tek bir workflow'a sabitleyen bir `wid` claim'i, anında iptal için kullanılan bir `jti` ve yapılandırılabilir bir TTL (60 saniyeden 10 yıla kadar) taşır. Token'ları doğrudan **Run with cURL** iletişim kutusundan oluşturun, seçin ve iptal edin — seçilen token, oluşturulan komuta otomatik olarak gömülür.

Ayrıca bkz. [Webhooks](./webhooks.md), [Security](./security.md) ve [SSE Streaming](./sse-streaming.md).

### [SSE Streaming](./sse-streaming.md)

cURL iletişim kutusu, [webhook](./webhooks.md) yürütmesini Server-Sent Events moduna geçirebilir. Bu, gerçek zamanlı olarak `execution_started`, `node_start`, `node_complete` ve `execution_complete` olayları üretir, oluşturulan cURL komutuna `--no-buffer` ekler ve harici terminal tüketicileri için `[START] LLM` veya özel metin gibi düğüm başına başlangıç mesajlarını yapılandırmanıza olanak tanır.

Ayrıca bkz. [Webhooks](./webhooks.md), [Execution History](./execution-history.md) ve [LLM](../nodes/llm-node.md).
### [Tetikleyiciler](./triggers.md)

Workflow'lar, trigger düğümleri ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) alımı) veya giriş noktaları tarafından başlatılır: [Webhook/API](./webhooks.md), [MCP](../tabs/mcp-tab.md), [Portal](./portal.md), Cron zamanlayıcısı, Telegram webhook, Discord etkileşim webhook'u, IMAP trigger yöneticisi, RabbitMQ tüketicisi veya Editor çalıştırması. Her trigger'ın kendi endpoint'i veya arka plan süreci vardır; [Cron](../nodes/cron-node.md) her 60 saniyede bir çalışır, [Telegram Trigger](../nodes/telegram-trigger-node.md) düğümleri bot webhook'larını alır, [Discord Trigger](../nodes/discord-trigger-node.md) düğümleri imzalı etkileşim webhook'larını alır ve [IMAP Trigger](../nodes/imap-trigger-node.md) düğümleri yapılandırılmış yoklama aralıklarında çalışır. [Input](../nodes/input-node.md) düğümleri webhook isteklerinden body, headers ve query alır.

Ayrıca bkz. [Düğüm Türleri](./node-types.md), [Webhook'lar](./webhooks.md) ve [Paralel Yürütme](./parallel-execution.md).

### [Yürütme Geçmişi](./execution-history.md)

Yürütme geçmişi workflow çalıştırmalarını kaydeder: girdiler, çıktılar, düğüm sonuçları, durum ve trigger kaynağı. Buna Editor araç çubuğundan, Docs görünümünden, Dashboard başlığından veya [Evals](../tabs/evals-tab.md) görünümünden erişebilirsiniz. Workflow bazlı geçmiş, açık workflow'un çalıştırmalarını gösterir; tüm geçmiş görünümü ise workflow'lar ve chat genelindeki çalıştırmaları gösterir. Halihazırda çalışan yürütmeler, her iki iletişim kutusunun da üst kısmında **Open live** ve **Cancel** eylemleriyle görünür. Open live, editörü [SSE](./sse-streaming.md) üzerinden mevcut yürütmeye bağlar, tamamlanan düğümleri geri yükler, mevcut ve bekleyen düğümleri titreştirir ve başka bir çalıştırma başlatmadan Debug loglarını ekler. Bring to Canvas, tamamlanmış bir çalıştırmanın girdilerini ve düğüm çıktılarını yeniden çalıştırma veya hata ayıklama için yükler; `/workflows/{workflowId}/{executionId}` derin bağlantısı hem canlı hem de tamamlanmış yürütmeleri destekler. [Human-in-the-Loop](./human-in-the-loop.md) tarafından duraklatılan çalıştırmalar, genel inceleme URL'si ve agent'ın `review` dalından yürütülen tüm bildirim düğümleri dahil olmak üzere derhal `pending` olarak saklanır. Sunucu çalıştırma ortasında yeniden başlarsa, kesintiye uğrayan çalıştırmalar otomatik olarak kurtarılır: aynı girdilerle sıfırdan yeniden çalıştırılır ve tamamlanmış olarak gösterilir (**Recovered** olarak işaretlenir); bu davranış, bunları bunun yerine `skipped` olarak kaydedebilen workflow bazlı bir **Auto-recover runs** anahtarıyla kontrol edilir.

Ayrıca bkz. [SSE Akışı](./sse-streaming.md), [Human-in-the-Loop](./human-in-the-loop.md) ve [İzler](../tabs/traces-tab.md).

### Yürütme Öne Çıkanları

Canlı bir çalıştırmadan sonra — veya **Bring to Canvas** işleminden sonra — Canvas'ın sağ üst köşesinde, her düğümün yürütme sırasına göre ne ürettiğini listeleyen, kapatılabilir bir **Execution Highlights** açılır penceresi görünür. Her düğümü açmadan düğüm bazlı çıktıyı incelemenin hızlı bir yoludur; **✕** ile kapatın, bir sonraki çalıştırmada yeniden açılır. Öne çıkanlar dashboard çalıştırmalarında da gösterilir. Ayrıntılar için bkz. [Yürütme Geçmişi](./execution-history.md).

### [Düzenleme Geçmişi](./edit-history.md)

Düzenleme Geçmişi, bir workflow'un kaydedilmiş sürümlerini izler (her Kaydetme bir sürüm oluşturur). Listeyi görüntüleyin, mevcut workflow'a ([düğümler](./workflow-structure.md), kenarlar, yapılandırma) karşı bir farkı görmek için bir sürümü açın ve geçmiş bir sürümü geri yüklemek için Revert'i kullanın. [Yürütme Geçmişi](./execution-history.md)'nden farklı olarak Düzenleme Geçmişi, çalıştırmaları değil yapı değişikliklerini izler.

Ayrıca bkz. [Yürütme Geçmişi](./execution-history.md), [Workflow Yapısı](./workflow-structure.md) ve [Canvas Özellikleri](./canvas-features.md).

### Hata Workflow'u

Bir workflow, başarısız olduğunda çalıştırılacak başka bir workflow'u belirleyebilir. Bunu, workflow düzeyindeki **Properties** panelinde (hiçbir düğüm seçili değilken gösterilir) **On error, run workflow** altında yapılandırın. Bunu yalnızca workflow sahibi ayarlayabilir, değiştirebilir veya temizleyebilir; bkz. [Yalnızca sahibe özel ayarlar](./workflow-organization.md#owner-only-settings). Üst düzey bir çalıştırma işlenmemiş bir hatayla sona erdiğinde, seçilen hata workflow'u çalışır ve hata bağlamını alır (başarısız workflow id'si ve adı, çalıştırma id'si, hata mesajı, başarısız düğüm etiketi ve türü ile bir zaman damgası). Canvas zaten bir [Error Handler](../nodes/error-handler-node.md) düğümü içeriyorsa, yerel işleyici öncelik kazanır ve hata workflow'u **çağrılmaz**. Hata workflow'u doğrudan çalışır, bu nedenle kendi hata workflow'unu asla tetiklemez.

Test dışı her üst düzey çalıştırmayı kapsar: her iki execute endpoint'i, [Portal](./portal.md) ve [cron](../nodes/cron-node.md), chat platformu trigger'ları, e-posta, kuyruklar, [MCP](../tabs/mcp-tab.md) ve dashboard widget'ları dahil olmak üzere her trigger. [Yük Dağıtımı](./cluster.md) etkinleştirildiğinde bu değişmez; bir worker'ın yürüttüğü çalıştırmalar dahil: başarısız düğüm sonuçla birlikte geri döner ve hata workflow'u daha sonra diğer tüm çalıştırmalar gibi dağıtılır, böylece içindeki ana instance üzerinde çalışması gereken bir düğüm yine de çalışır. İki durum kasıtlı olarak dışarıda bırakılmıştır, çünkü workflow'un kendi sonucu henüz bilinmemektedir: hiçbir instance'ın yürütmediği bir çalıştırma ve çalıştırma hâlâ devam ederken zaman aşımına uğrayan bir bekleme. Ayrıca manuel canvas test çalıştırmaları tarafından da **tetiklenmez**.
### Workflow Zaman Aşımı

Her workflow, workflow düzeyindeki **Properties** panelinde saniye cinsinden bir **workflow zaman aşımı** ayarlayabilir. `0` (varsayılan) bu özelliği devre dışı bırakır. Ayarlandığında, sınırı aşan bir çalıştırma bir sonraki düğüm sınırında durdurulur ve "zaman aşımına uğradı" hatasıyla başarısız bir çalıştırma olarak kaydedilir. Zaman aşımı manuel, API ve tetiklenen çalıştırmalar için geçerlidir. Uzun [Wait](../nodes/wait-node.md) düğümleri, tüm süreleri boyunca bloke etmek yerine derhal kesintiye uğratılır.

### Tasarruf Edilen Süre

Her workflow, workflow düzeyindeki **Properties** panelinde ayarlanan **çalıştırma başına tahmini tasarruf edilen süreyi** (dakika cinsinden) kaydedebilir. [Analytics](../tabs/analytics-tab.md) sekmesi bunu seçilen aralık boyunca toplam **Tasarruf Edilen Süre** istatistiği olarak toplar (her workflow'un tahmininin başarılı çalıştırma sayısıyla çarpımının toplamı). Most Used ayrıca bu toplamı workflow başına listeler; **Not Set**, tahmin ayarlanmadığında tahmin alanını açar. [Workflow Analysis](./workflow-analysis.md) raporu, hiçbir tahmin yapılandırılmadığında bir tahmin ayarlanmasını önerir.

### [Settings](./user-settings.md)

Başlıktaki avatarınızdan açılan Settings iletişim kutusu dört sekmeye sahiptir: Profile (Gravatar resmi, görünen ad, User Rules), [Security](./security.md) (parola değiştirme), Voice ([ElevenLabs TTS/STT](./chat-voice.md)) ve Observability (salt okunur [OpenTelemetry](./opentelemetry.md) durumu). User Rules, workflow builder ve [Chat](../tabs/chat-tab.md) dahil olmak üzere her AI isteğine enjekte edilen özel talimatlardır; böylece dil, ton, kodlama stili veya workflow kurallarını bir kez ayarlayabilirsiniz. Parola politikası ve [MCP](../tabs/mcp-tab.md) API anahtarı yönetimi de mevcuttur.

Ayrıca bkz. [Security](./security.md), [Chat Voice](./chat-voice.md), [OpenTelemetry Tracing](./opentelemetry.md) ve [AI Assistant](./ai-assistant.md).

### [OpenTelemetry Tracing](./opentelemetry.md)

Heym, her workflow çalıştırması ve düğüm yürütmesi için OpenTelemetry izleri yayabilir: çalıştırma başına bir kök `heym.workflow.execute` span'i ve düğüm başına bir alt `heym.node.execute` span'i; model ve token kullanımı LLM ve agent düğümlerine eklenir. Span'ler OTLP/HTTP üzerinden herhangi bir uyumlu arka uca (Jaeger, Grafana Tempo, Honeycomb, Datadog) aktarılır ve W3C trace context gelen webhook'lar, giden HTTP ve alt workflow'lar arasında yayılır. İzleme varsayılan olarak devre dışıdır ve `HEYM_OTEL_*` [ortam değişkenleri](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) ile yapılandırılır; etkin durum [Settings](./user-settings.md) Observability sekmesinde gösterilir.

Ayrıca bkz. [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md) ve [Webhooks](./webhooks.md).

### [Download & Import](./download-import.md)

Geçerli workflow'u Editor araç çubuğundan (Download düğmesi) JSON olarak dışa aktarın; dosya düğümleri ve kenarları içerir. Bir JSON dosyasını [Workflows](../tabs/workflows-tab.md) sekmesine (yeni bir workflow oluşturur) veya tuvale (değiştirir ya da birleştirir) sürükleyerek içe aktarın. JSON bir nodes dizisi içermelidir; name ve edges isteğe bağlıdır. Yedekleme, paylaşma veya örnekler arasında geçiş yapma için kullanın.

Ayrıca bkz. [Workflow Structure](./workflow-structure.md), [Workflows](../tabs/workflows-tab.md) ve [Canvas Features](./canvas-features.md).

### [Portal](./portal.md)

Portal, workflow'ları `/chat/{slug}` adresinde genel sohbet arayüzleri olarak sunar. Workflow başına portal_enabled, slug, isteğe bağlı kimlik doğrulama (portal kullanıcıları), streaming ve dosya yükleme yapılandırın. Son kullanıcılar Heym'e giriş yapmadan bir sohbet arayüzü üzerinden etkileşime girer; görüntü çıktıları sohbette görüntülenebilir. Portal workflow'ları, bir [Agent Node](../nodes/agent-node.md) onay gerektirdiğinde [Human-in-the-Loop](./human-in-the-loop.md) inceleme sayfalarına da devredebilir; bu sırada agent'ın `review` dalı diğer kanallara bildirim gönderir. Bunu dahili araçlar, müşteriye yönelik chatbot'lar ve AI destekli formlar için kullanın.

Ayrıca bkz. [Human-in-the-Loop](./human-in-the-loop.md), [Agent Node](../nodes/agent-node.md) ve [Drive](./drive.md).

### [File Generation](./file-generation.md)

Skills, yürütme sırasında `_OUTPUT_DIR` çalışma alanına yazarak PDF, DOCX, CSV, JSON ve görüntü gibi dosyalar üretebilir. Heym bu dosyaları otomatik olarak yakalar, depolar ve `_generated_files` altında indirme meta verilerini sunar; bunlar daha sonra [Drive node](../nodes/drive-node.md) ile yönetilebilir veya [Drive](../tabs/drive-tab.md) sekmesinde incelenebilir.

Ayrıca bkz. [Agent Node](../nodes/agent-node.md), [Drive](./drive.md) ve [Drive node](../nodes/drive-node.md).

### [Drive](./drive.md)

Drive, skills tarafından üretilen dosyalar için paylaşılan depolama ve paylaşım katmanıdır. Dosyalara göz atmanıza, genel veya parola korumalı bağlantılar oluşturmanıza, son kullanma ve indirme sınırları uygulamanıza, dosyaları ekiplerinizle salt okunur olarak paylaşmanıza ve bu dosyaları [Drive node](../nodes/drive-node.md) ile programatik olarak veya [Drive](../tabs/drive-tab.md) sekmesinden manuel olarak yönetmenize olanak tanır.

Ayrıca bkz. [Drive](../tabs/drive-tab.md), [File Generation](./file-generation.md) ve [Portal](./portal.md).
### [Güvenlik](./security.md)

Heym bir parola politikası uygular (uzunluk, büyük harf, küçük harf, rakam), erişim token'larını HttpOnly çerezlerinde saklar ve refresh token'larını kullanım sırasında döndürür. Oran sınırlama; giriş, kayıt ve [Portal](./portal.md) girişi için geçerlidir. [Kimlik Bilgileri](./credentials.md) AES-256 (Fernet) ile beklemede şifrelenir. [MCP](../tabs/mcp-tab.md) API anahtarı istemci kimlik doğrulaması için kullanılır; içerik güvenliği [LLM](../nodes/llm-node.md) ve [Agent Node](../nodes/agent-node.md) düğümlerinde [Guardrails](./guardrails.md) aracılığıyla sunulur. [Execution Tokens](./execution-tokens.md), harici çağıranlar için iş akışı başına kapsamlı JWT'ler sağlar.

Ayrıca bkz. [Execution Tokens](./execution-tokens.md), [Guardrails](./guardrails.md), [Portal](./portal.md) ve [Kimlik Bilgileri](./credentials.md).

### [Tek Oturum Açma](./sso.md)

Heym, kullanıcıları herhangi bir harici OpenID Connect sağlayıcısına karşı doğrular - Keycloak, Okta, Entra ID, Auth0, Google - `HEYM_ADMIN_EMAILS` içinde listelenen bir örnek yöneticisi tarafından çalışma zamanında **Ayarlar → SSO** üzerinden yapılandırılır. Yalnızca bir issuer URL'si ve istemci kimlik bilgileri girilir; her endpoint sağlayıcının keşif belgesinden gelir, böylece hiçbir sağlayıcı sabit kodlanmamıştır. Oturum açma, PKCE ile Authorization Code kullanır ve ID token'ı sağlayıcının yayımladığı anahtarlara karşı doğrulanır. Hesaplar önce `(issuer, subject)` ile, ikinci olarak doğrulanmış e-posta ile eşlenir; isteğe bağlı otomatik sağlama bir e-posta alan adı izin listesiyle sınırlandırılır. Parola ile oturum açma SSO ile birlikte kullanılabilir durumda kalır ve bir bağlantı testi geçtikten sonra kapatılabilir; `HEYM_ADMIN_EMAILS` hesapları muaf tutulur, böylece yanlış yapılandırılmış bir sağlayıcı örneği kilitleyemez.

Ayrıca bkz. [Ayarlar](./user-settings.md), [Güvenlik](./security.md) ve [Denetim Günlüğü](./audit.md).

### [Yük Dağıtımı](./cluster.md)

İkinci bir Heym örneğini aynı veritabanına yönlendirin; bir worker olarak katılır. Arka plan çalıştırmaları - cron, webhook'lar, MCP araç çağrıları, sohbet tetikleyicileri - bir örnek yöneticisinin **Ayarlar → Örnekler** altında belirlediği yüzdeye göre örnekler arasında paylaşılır; her örneğin durumu, veritabanı gecikmesi ve sürümü tek bir tabloda yer alır. Örnekler birbirleriyle hiç konuşmaz: İşi Postgres taşır, böylece bir worker'ın açık bir porta ve ana örneğe geri dönüş yoluna ihtiyacı yoktur. Yerel dosyalara, bir kodlama ajanı çalışma alanına veya yüklü bir eklentiye dokunan işler her zaman ana örnekte çalışır ve panel son 24 saatin ne kadarının bu olduğunu bildirir, böylece bir operatör yüzdelerin ne zaman yardımcı olamayacağını görebilir. Geçmişteki her çalıştırma, onu yürüten örneği adlandırır ve her iki geçmiş iletişim kutusu da buna göre filtreleme yapabilir.

Ayrıca bkz. [Ayarlar](./user-settings.md), [İzler](../tabs/traces-tab.md) ve [Analitik](../tabs/analytics-tab.md).

### [Üçüncü Taraf Entegrasyonları](./integrations.md)

Heym, harici hizmetlere [Kimlik Bilgileri](../tabs/credentials-tab.md) sekmesinde saklanan kimlik bilgileri (beklemede şifrelenmiş) aracılığıyla bağlanır. Desteklenen türler arasında OpenAI, Google, [Decision düğümü](../nodes/decision-node.md) için Decision Model, otomatik model seçimi için Model Router (aşağıya bakın), [GitHub düğümü](../nodes/github-node.md) ve MCP entegrasyonları için GitHub, [Jira düğümü](../nodes/jira-node.md) için Jira, [Notion düğümü](../nodes/notion-node.md) için Notion, Custom LLM, Cohere, RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, [Grist](../nodes/grist-node.md), [Send Email](../nodes/send-email-node.md) için SMTP, [RabbitMQ](../nodes/rabbitmq-node.md), [Redis](../nodes/redis-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), Bearer, Header ve [Crawler](../nodes/crawler-node.md) için FlareSolverr bulunur. Her tür gerekli alanları belgeler; kimlik bilgileri kullanıcılarla veya [ekip](./teams.md) ile paylaşılabilir ve düğümlerde adıyla ya da ifadelerde `$credentials.Name` olarak başvurulabilir.

### Model Router (Otomatik Model)

Bir **Model Router** kimlik bilgisi, bir anahtar tutmak yerine istek başına modeli seçer. Bir
karar modeli kimlik bilgisi ile mevcut OpenAI/Google/Custom
kimlik bilgilerinizin bir listesini saklar; her biri ne zaman kullanılması gerektiğini belirten kriterlerle birlikte, ve her model
seçicide **Auto** adlı tek bir modelle görünür.

İzler, tuval Execution Log ve Span View seçimin her iki yarısını da gösterir, örneğin
`Auto Model / GPT-5`, maliyet ise çalışan modele atfedilmiş olarak kalır. Auto
Model, Responses API, Batch modu veya görüntü çıktısı ile birleştirilemez. Tam davranış için
[Kimlik Bilgileri](./credentials.md) bölümüne bakın.

Ayrıca bkz. [Kimlik Bilgileri](./credentials.md), [Kimlik Bilgileri Paylaşımı](./credentials-sharing.md) ve [Ekipler](./teams.md).

### [Guardrails](./guardrails.md)

Guardrails, güvenli olmayan veya istenmeyen kullanıcı mesajlarını bir [LLM](../nodes/llm-node.md) veya [Agent Node](../nodes/agent-node.md) düğümüne ulaşmadan önce engeller. Bunları düğüm başına etkinleştirin ve engellenecek kategorileri seçin (örn. şiddet, nefret söylemi, cinsel içerik, kendine zarar verme, taciz, yasa dışı faaliyet). Hassasiyeti ayarlayın (düşük, orta, yüksek). Tetiklendiğinde, düğüm bir [Error Handler](../nodes/error-handler-node.md) ile yakalayabileceğiniz bir hata fırlatır. Algılama, kimlik bilgisi türüne bağlı olarak sağlayıcı moderasyon API'sini veya LLM sınıflandırmasını kullanır.

Ayrıca bkz. [Güvenlik](./security.md), [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) ve [Error Handler](../nodes/error-handler-node.md).
### [Enterprise](./enterprise.md)

Enterprise, Heym'i üretim ortamında çalıştıran ekipler için ticari lisanslama, profesyonel destek ve dağıtım hizmetlerini kapsar. Workflow mimarisi desteği, onboarding, Kubernetes ve ölçeklendirme rehberliği, öncelikli destek ve [Agent Node](../nodes/agent-node.md), [Human-in-the-Loop](./human-in-the-loop.md), [Parallel Execution](./parallel-execution.md) ve [Portal](./portal.md) gibi gelişmiş özellikler etrafında özel geliştirme hizmetlerini içerir.

Ayrıca bkz. [Running & Deployment](../getting-started/running-and-deployment.md), [Security](./security.md) ve [Teams](./teams.md).

---

## Dashboard Sekmeleri

### [Workflows](../tabs/workflows-tab.md)

Workflows sekmesi varsayılan dashboard görünümüdür. İki panelli bir liste gösterir: solda yoğun satırlar halinde workflow'lar ve klasörler, sağda ise seçili workflow'un trigger'ı, son çalışması ve adımları ile birlikte Open Workflow ve Run Now düğmelerini içeren önizlemesi. Her satırda bir durum etiketi (Running, Scheduled, Listening, Paused, API, SubWorker, Portal, Manual, Remove Scheduled) bulunur ve Status açılır menüsü bu etikete göre filtreleme yapabilir. Trigger düğümü olmayan bir workflow, en son çalışmasının nasıl başladığına göre etiketlenir - bir HTTP çağrısı için API, bir üst workflow için SubWorker, genel sohbeti için Portal - ve çalışana kadar Manual olarak kalır. Klasörler ve alt klasörler [organizasyonu](./workflow-organization.md) yönetir. New Workflow ile workflow oluşturun, [içe aktarmak](./download-import.md) için JSON'u sürükleyip bırakın ve satır eylemlerinden düzenleyin veya silin. Workflow'lar klasörler arasında taşınabilir; silme işlemi kalıcı olarak kaldırılmadan önce planlanır (çöp kutusu).

Ayrıca bkz. [Workflow Organization](./workflow-organization.md), [Download & Import](./download-import.md) ve [Quick Drawer](./quick-drawer.md).

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Watch Workflows demo</a></p>

### [Board](../tabs/board-tab.md)

Kartların kalıcı işler olduğu agentic bir kanban panosu. Her sütunu sıralı bir workflow zinciriyle yapılandırın; bir kartı sütuna taşımak, zinciri kartın tam bağlamıyla (içerik, yorumlar, geçmiş, önceki çıktılar) çalıştırır. Sonuçlar karta geri yazılır — başarıda yeşil, başarısızlıkta kırmızı, çalışırken amber. Takip turları, o ana kadar biriken her şeyle mevcut sütunun zincirini yeniden çalıştırır ve bu da yinelemeli planlamayı mümkün kılar. Çalışmalar, `board` trigger kaynağıyla [Execution History](./execution-history.md) içinde kaydedilir. Bir kart çalışması etkinken, **Open live** tam o çalışmayı animasyonlu canvas üzerinde artımlı Debug loglarıyla açar.

Ayrıca bkz. [Workflows](../tabs/workflows-tab.md), [Execution History](./execution-history.md) ve [Human-in-the-Loop](./human-in-the-loop.md).

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

### [Templates](../tabs/templates-tab.md)

Templates sekmesi, workflow şablonlarını (tam workflow'lar) ve düğüm şablonlarını (tek yapılandırılmış düğümler) kaydetmenize ve yeniden kullanmanıza olanak tanır. Workflow şablonlarını editörden (Share as Template) ve düğüm şablonlarını bir düğüme sağ tıklayarak oluşturun. Görünürlüğe göre (Everyone veya Specific users/[teams](./teams.md)) göz atın, yeni bir workflow oluşturmak veya canvas'a bir düğüm eklemek için bir şablon uygulayın ve paylaşılan şablonlarınızı yönetin.

Ayrıca bkz. [Workflows](../tabs/workflows-tab.md), [Teams](./teams.md) ve [Canvas Features](./canvas-features.md).

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Watch Templates demo</a></p>

### [Variables](../tabs/global-variables-tab.md)

Variables sekmesi [Global Variable Store](./global-variables.md) yönetir. Global değişkenleri oluşturun, düzenleyin ve silin; ad, değer ve değer türünü (Auto, String, Number, Boolean, Array, Object) ayarlayın. Değişkenler kullanıcı kapsamlıdır ve çalışmalar arasında kalıcıdır. Bunlara herhangi bir workflow [ifadesinde](./expression-dsl.md) `$global.variableName` olarak başvurun. Değişkenler diğer kullanıcılarla veya [teams](./teams.md) ile paylaşılabilir.

Ayrıca bkz. [Global Variables](./global-variables.md), [Variable](../nodes/variable-node.md) ve [Expression DSL](./expression-dsl.md).

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Watch Variables demo</a></p>
### [Sohbet](../tabs/chat-tab.md)

Sohbet sekmesi, Heym'in çalışma alanını konuşma yoluyla yönetmeye yönelik uzun süreli ajan yüzeyidir. Bir [credential](./credentials.md) ve model seçin, ardından Sohbet'ten soruları yanıtlamasını, workflow tanımlarını incelemesini, mevcut workflow'ları çalıştırmasını, execution ve schedule'ları özetlemesini, tek bir workflow'un çalıştırma geçmişini raporlamasını (çalıştırma sayısı, durum dağılımı, son çalıştırma ve talep üzerine bir çalıştırmanın ayrıntıları), şu anda hangi execution'ların çalıştığını raporlamasını (geçen süre, geçerli düğüm ve her canlı çalıştırmaya bir bağlantı ile), bekleyen insan incelemelerini çözümlemesini, düzenleyicide kullanılan aynı AI Builder motoruyla workflow'lar oluşturup revize etmesini veya doğal dil ile kanban panolarına kart eklemesini isteyin. Yeni kartlar her zaman seçili panonun ilk sütununda başlar; birden fazla pano mevcut olduğunda ve hiçbiri adlandırılmadığında, Sohbet kartı oluşturmadan önce bir pano seçimi sunar.

Sohbet, tarayıcı kapandıktan sonra arka uçta çalışmaya devam eder. Bir yanıt akış halindeyken daha fazla mesaj gönderebilirsiniz; Heym bunları veritabanı destekli bir kuyrukta saklar, başlamadan önce kuyruktaki mesajları düzenlemenize veya silmenize izin verir ve mevcut yanıt tamamlandığında bunları sırayla çalıştırır. Asistan planlama ayrıntılarına ihtiyaç duyar ve açıklama soruları döndürürse, kuyruk siz bu soruları yanıtlayana kadar duraklar, ardından planlama yanıtından sonra devam eder.

Yanıtlar markdown, satır içi görseller, workflow önizleme kartları, daraltılabilir tool-call kartları, context kullanımı ve otomatik context sıkıştırma ile akış halinde gelir. Sohbet; ekleri, sesli girişi, sesli okuma oynatımını, kopyalama eylemlerini, hızlı prompt'ları, [Ayarlar](./user-settings.md) bölümündeki User Rules'u ve context olarak [global değişkenleri](./global-variables.md) destekler.

Ayrıca bkz. [AI Assistant](./ai-assistant.md), [Credentials](./credentials.md) ve [Ayarlar](./user-settings.md).

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Sohbet demosunu izleyin</a></p>

### [Credentials](../tabs/credentials-tab.md)

Credentials sekmesi, düğümler tarafından kullanılan API anahtarlarını ve gizli bilgileri yönetir. Türüne göre credential ekleyin (OpenAI, Google, Custom, Bearer, Header, [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), SMTP, [Redis](../nodes/redis-node.md), RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, Cohere vb.), adlandırın ve workflow düğümlerinde bunlara başvurun. Karttan düzenleyin veya silin; e-posta ile kullanıcılarla veya [takımlarla](./teams.md) paylaşın. Tüm değerler durağan haldeyken şifrelenir ve arayüzde maskelenir.

Ayrıca bkz. [Credentials](./credentials.md), [Credentials Sharing](./credentials-sharing.md) ve [Third-Party Integrations](./integrations.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Credentials demosunu izleyin</a></p>

### [Vectorstores](../tabs/vectorstores-tab.md)

Vectorstores sekmesi, [RAG](../nodes/rag-node.md) düğümleri tarafından kullanılan vector store'ları yönetir. Bir ad ve bir vector store [credential](./credentials.md) ile bir store oluşturun — *RAG: Qdrant + OpenAI* (harici Qdrant) veya *RAG: Psql + OpenAI* (Heym'in pgvector üzerinden kendi Postgres'i), bu store'un arka ucunu sabitler — isteğe bağlı olarak bir collection adı belirleyin, ardından belgeleri (PDF, TXT vb.) yükleyin. İçeriği yönetin (kaynakları görüntüleyin, silin), store ayrıntılarını düzenleyin ve store'ları kullanıcılarla paylaşın. Bir [RAG](../nodes/rag-node.md) düğümünde Database'i seçin, vector store'u seçin ve insert, upsert, delete veya search işlemlerini çalıştırın.

Ayrıca bkz. [Qdrant RAG](../nodes/rag-node.md), [Credentials](./credentials.md) ve [Teams](./teams.md).

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Vectorstores demosunu izleyin</a></p>
### [MCP](../tabs/mcp-tab.md)

MCP sekmesi, Model Context Protocol entegrasyonunu yapılandırır. Heym iki modu destekler:

**Varsayılan sunucu** – `/api/mcp/sse` adresindeki tek bir endpoint, MCP etkinleştirilmiş tüm workflow'ları sunar. API anahtarınızı görüntüleyin ve yeniden oluşturun, kullanıma hazır istemci JSON'unu kopyalayın, Cursor'ı tek tıklamayla bağlayın veya otomatik OAuth kaydıyla Claude kurulum akışını izleyin.

**Adlandırılmış sunucular** – Her biri kendi UUID tabanlı URL'sine (`/api/mcp/servers/{uuid}/sse`) ve bağımsız API anahtarına sahip birden fazla izole MCP endpoint'i oluşturun. Farklı yapay zeka istemcilerinin veya ekiplerin yalnızca ihtiyaç duydukları araçları görmesi için her sunucuya belirli workflow'lar atayın. Her adlandırılmış sunucu aynı kimlik doğrulama yöntemlerini (API key, Claude OAuth) destekler ve kendi Copy JSON ile Add to Cursor kısayollarına sahiptir. Her iki endpoint de SSE transport (GET) ve Streamable HTTP transport (POST) destekler. Adlandırılmış bir sunucu içindeki bir workflow'u değiştirmek, değişen satırın görünümde kalması için onu atanan listenin en üstüne taşır.

**Heym chat aracı** – Her iki mod da [Chat](../tabs/chat-tab.md) motorunu tek bir `heym_chat` aracı olarak sunabilir; bu araç, her yüzey için kendi LLM credential'ı ve modeliyle ([Settings](./user-settings.md) bölümündeki tercih ettiğiniz modelden önceden doldurulmuş olarak) açılıp kapatılabilir. Bir MCP istemcisi tek bir doğal dil `message` gönderir ve motor gerisini halleder: workflow'ları oluşturma, düzenleme ve çalıştırma, analytics, executions, canlı çalıştırma durumu, schedules, boards ve cards, teams, global variables, dokümantasyon araması ve human-in-the-loop kararları. Chat'e sonradan eklenen yeteneklere ek kayıt gerektirmeden aynı araç üzerinden erişilebilir. Her çağrı, Chat sekmesi geçmişinde plug işaretli bir konuşma olarak saklanır ve istemcinin konuşmayı sürdürmek için geri gönderebileceği bir `conversation_id` döndürür.

Ayrıca bkz. [Agent Architecture](./agent-architecture.md), [Agent Node](../nodes/agent-node.md) ve [SSE Streaming](./sse-streaming.md).

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Watch MCP demo</a></p>

### [Traces](../tabs/traces-tab.md)

Traces sekmesi, [LLM](../nodes/llm-node.md) yürütme izlerini gösterir. Listenin üzerindeki bir istatistik başlığı, seçilen zaman aralığını KPI kartları (Calls, Tokens, Cost, Avg Latency, Error %) ve üç grafikle özetler — Tokens by Model, Cost by Model ve Calls Over Time (başarı ve hatanın yığılmış hali). Tek bir **Time range** seçici (1h / 24h / 7d / 30d / All; varsayılan 7 gün) hem grafikleri hem de listeyi birlikte filtreler. Cost, kullanıcı başına [LLM Cost Table](../tabs/datatable-tab.md#llm-cost-table-system-table) üzerinden hesaplanır; fiyatlandırması olmayan modeller, ona bağlantı veren satır içi bir uyarı olarak görünür. Herhangi bir trace'i açarak request ve response payload'larını, zamanlama dökümünü (llm_ms, tools_ms, mcp_list_ms), tool çağrılarını (ad, argümanlar, sonuç) ve dahil edilen skill'leri görün. Genişletilmiş olaylar, MCP ve JSON-RPC payload'ları dahil olmak üzere JSON'u, ilk seviyesi varsayılan olarak açık olan katlanabilir bir ağaç olarak görüntüler; **Tree / Raw** orijinal metne geri döner ve bozuk JSON okunabilir kalır. [Agent Node](../nodes/agent-node.md) ve [LLM](../nodes/llm-node.md) davranışında hata ayıklamak ve payload'ları kopyalamak veya dışa aktarmak için trace'leri kullanın.

Ayrıca bkz. [Execution History](./execution-history.md), [Agent Node](../nodes/agent-node.md) ve [LLM](../nodes/llm-node.md).

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Watch Traces demo</a></p>
### [Alerts](../tabs/alerts-tab.md)

Alerts sekmesi, bir zaman penceresi üzerinde eşik koşullarını tanımlar ve bu koşulların ne zaman aşıldığını size bildirir. Dört alert türü, operatörlerin gerçekte sorduğu soruları kapsar: **hata eşiği** (bu, pencere içinde N defadan fazla mı başarısız oldu), **workflow süresi** (çalışmalar yavaşladı mı; maksimum, ortalama veya p95 olarak ölçülür), **token / USD maliyeti** (harcama bir bütçeyi aştı mı; [Traces](../tabs/traces-tab.md) ile aynı fiyatlandırma tablosu üzerinden çözümlenir) ve **yürütme sayısı** (bu, olması gerekenden çok daha sık mı çalıştı). Her tür, tek bir olay üzerinde değil, seçtiğiniz bir pencere üzerinde değerlendirilir; çünkü tek bir başarısız çalışma gürültüdür, bir patlama ise olaydır. Alerts, tek bir workflow'u veya erişebildiğiniz her workflow'u izler.

Beş adımlı bir wizard; tür, kapsam, koşul, yanıt ve inceleme adımlarında size yol gösterir. İnceleme adımı önce koşulu **geriye dönük test eder** ve son 24 saat ile 7 gün arasında ne sıklıkla tetiklenmiş olacağını bildirir; böylece çok düşük bir eşik, birini uyandırdıktan sonra değil, kaydedilmeden önce yakalanır. Ne istediğinizi sade bir dille tanımlayın; AI, doldurabildiği her adımı doldurur ve tahminlerini işaretler; kısmi bir istek bile wizard'ı ilerletir ve baştan başlamanızı gerektirmek yerine hâlâ karar gerektiren ilk adımda açılır. Varsayılan olarak bir alert bir kez tetiklenir ve metrik toparlanana kadar sessiz kalır; bunun yerine belirli bir aralıkta yinelenmesini sağlayabilirsiniz.

Yanıt adımında bir alert, tetiklendiğinde çalışacak yeni bir workflow oluşturup atayabilir, zaten sahip olduğunuz bir workflow'u kullanabilir veya hiçbir şey yapmayabilir. Tetikleme payload'ı; gözlemlenen değeri, eşiği, pencereyi ve bu sayıya katkıda bulunan workflow'ları taşır; alert'lerin hâlihazırda sahip olduğunuz düğümleri kullanarak Slack, e-posta veya Telegram'a bu şekilde ulaşması sağlanır. Tetikleme geçmişi, her alert tetiklendiği anda neyin doğru olduğunu kaydeder ve 90 gün boyunca saklanır; bir tetiklemeyi onaylamak, koşulun ortadan kalktığını varsaymadan rozeti Firing'den Acknowledged'a değiştirir. [Chat](../tabs/chat-tab.md) sekmesi, hangi alert'lerin var olduğunu ve bir alert'in neden veya ne zaman tetiklendiğini yanıtlayabilir. Alerts, kullanıcılarla ve [teams](../tabs/teams-tab.md) ile paylaşılabilir.

Ayrıca bkz. [Analytics](../tabs/analytics-tab.md), [Traces](../tabs/traces-tab.md) ve [Execution History](./execution-history.md).

### [Analytics](../tabs/analytics-tab.md)

Analytics sekmesi, yürütme metriklerini ve eğilimleri gösterir. Özet istatistikler; toplam yürütmeleri, başarı oranını, hata oranını, gecikme dağılımlarını ve toplam **Time Saved** değerini (her workflow'un çalışma başına tahmini kazanılan dakika × başarılı çalışma sayısı toplamı) içerir. Most Used, aynı toplamı workflow bazında listeler. Bir temel zaman aralığı seçin (24s, 7g, 30g veya tümü), isteğe bağlı olarak workflow'a göre filtreleyin, ardından seçili bir tarih aralığına inmek için herhangi bir grafik üzerinde sürükleyin. Grafikler ve workflow tabloları seçime göre yenilenir ve otomatik yenileme metrikleri güncel tutar. Hem geçmiş sonuçlara hem de yaklaşan çalışmalara ihtiyaç duyduğunuzda [Execution History](./execution-history.md) ve [Scheduled](../tabs/scheduled-tab.md) görünümünü tamamlar.

Ayrıca bkz. [Execution History](./execution-history.md), [Scheduled](../tabs/scheduled-tab.md) ve [Evals](../tabs/evals-tab.md).

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Watch Analytics demo</a></p>

### [Dashboard](../tabs/dashboard-tab.md)

Dashboard sekmesi, her biri kendi gizli Heym workflow'undan oluşturulan grafik widget'larından oluşan ızgaralar kurduğunuz Grafana tarzı bir alandır. İhtiyacınız kadar dashboard tutun ve her birini kullanıcılarla veya teams ile salt okunur ya da düzenlenebilir olarak paylaşın; widget'lar her zaman sahibinin kimlik bilgileriyle çalışır, böylece herkes aynı veriyi görür. Bir metriği sade bir dille tanımlayın; AI widget'ı oluşturur veya manuel olarak bir tane ekleyip örnek verilerle önizlenen bir grafik türü seçin: bar, line, area, pie, table, numeric, gauge, scatter, proportion, bar gauge, text veya HITL. HITL, bekleyen insan incelemelerinizin bir karuselidir. Başlıkta `1/n pending` görünür. Workflow adı, o çalışmayı canvas üzerinde açar. **Approve**, **Request changes** ve **Reject** bunu çözer; widget başlığının yanındaki geçmiş simgesi, o çalışmayı aynı sayfadaki geçmiş iletişim kutusunda açar. Widget'lar sonuçlarını önbelleğe alır, AI ile ince ayar yapılabilir (her değişiklik [Edit History](./edit-history.md) dosyasına kaydedilir), eksiksiz workflow'larıyla birlikte klonlanabilir, Tidy up ile yeniden düzenlenebilir ve düzenleme modunda sürüklenebilir veya yeniden boyutlandırılabilir. Her widget bir workflow olduğundan, getirebildiğiniz herhangi bir veri — bir [HTTP](../nodes/http-node.md) çağrısı, bir [BigQuery](../nodes/bigquery-node.md) sorgusu, bir [RAG](../nodes/rag-node.md) araması veya [LLM](../nodes/llm-node.md) çıktısı — bir grafiğe dönüşebilir.

Ayrıca bkz. [Chart Output node](../nodes/chart-output-node.md), [Analytics](../tabs/analytics-tab.md) ve [Execution History](./execution-history.md).

<video src="/features/showcase/dashboard.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/dashboard.webm">▶ Watch Dashboard demo</a></p>
### [Değerlendirmeler](../tabs/evals-tab.md)

Değerlendirmeler sekmesi (`/evals` adresinde), değerlendirme paketleri oluşturmanıza, test senaryoları eklemenize veya üretmenize, paket prompt'unu optimize etmenize ve [Agent Düğümü](../nodes/agent-node.md) iş akışlarına karşı değerlendirmeler çalıştırmanıza olanak tanır. Bir veya daha fazla model seçin, bir puanlama yöntemi belirleyin (Tam Eşleşme, İçerir veya LLM-as-Judge), isteğe bağlı olarak ayrı bir modelin veya bir [Karar Düğümü](../nodes/decision-node.md)'nün LLM-as-Judge yanıtlarını değerlendirmesine izin verin, test başına çalıştırma sayısını (Tam Eşleşme ve İçerir için sıcaklık ve akıl yürütme çabası ile birlikte) ayarlayın, ardından geçme/kalma durumunu ve model başına çıktıları karşılaştırın. Geçmiş değerlendirmeler için çalıştırma geçmişini inceleyin; her çalıştırmanın kullandığı yargıcı görün, aynı yargıçla birini yeniden çalıştırın, JSON olarak dışa aktarın ve temel davranışı [İzler](../tabs/traces-tab.md) üzerinden çapraz kontrol edin.

Ayrıca bkz. [Agent Düğümü](../nodes/agent-node.md), [İzler](../tabs/traces-tab.md) ve [Yürütme Geçmişi](./execution-history.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Değerlendirmeler demosunu izleyin</a></p>

### [Ekipler](../tabs/teams-tab.md)

Ekipler sekmesi, ekipler oluşturmanıza ve yönetmenize olanak tanır. Bir ekip oluşturun, e-posta ile üye ekleyin ve üyeleri kaldırın (oluşturucu kaldırılamaz). [İş akışlarını](../tabs/workflows-tab.md), [şablonları](../tabs/templates-tab.md), [kimlik bilgilerini](../tabs/credentials-tab.md), [değişkenleri](../tabs/global-variables-tab.md), [vektör depolarını](../tabs/vectorstores-tab.md) ve [Drive dosyalarını](../tabs/drive-tab.md) ilgili paylaşım iletişim kutularından ekiplerle paylaşın; tüm ekip üyeleri erişim kazanır. Ekip adını ve açıklamasını düzenleyin veya ekibi silin (tüm ekip paylaşımlarını kaldırır).

Ayrıca bkz. [Ekipler](./teams.md), [Kimlik Bilgisi Paylaşımı](./credentials-sharing.md) ve [İş Akışı Organizasyonu](./workflow-organization.md).

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Ekipler demosunu izleyin</a></p>

### [Zamanlanmış](../tabs/scheduled-tab.md)

Zamanlanmış sekmesi, tüm etkin [Cron](../nodes/cron-node.md) iş akışlarını görsel bir takvimde gösterir. Otomasyonlarınızın ne zaman çalıştırılacağını görmek için gün, hafta ve ay görünümleri arasında geçiş yapın, ardından zamanlamayı düzenlemeniz gerektiğinde ilgili [iş akışına](../tabs/workflows-tab.md) geri dönün.

Ayrıca bkz. [Cron](../nodes/cron-node.md), [Analitik](../tabs/analytics-tab.md) ve [Yürütme Geçmişi](./execution-history.md).

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Zamanlanmış demosunu izleyin</a></p>

### [Günlükler](../tabs/logs-tab.md)

Günlükler sekmesi, Heym yığını (backend, frontend, PostgreSQL) için Docker container günlüklerini gösterir. Container(lar)ı seçin, günlük düzeyine göre filtreleyin (Tümü, INFO, WARNING, ERROR, DEBUG) ve günlükler içinde arama yapın. Hata ayıklama ve sorun giderme için kullanın. İş akışı yürütme günlükleri (düğüm sonuçları, çıktılar) için bunun yerine [Yürütme Geçmişi](./execution-history.md), [İzler](../tabs/traces-tab.md) veya düzenleyicideki Hata Ayıklama panelini kullanın.

Ayrıca bkz. [Yürütme Geçmişi](./execution-history.md), [İzler](../tabs/traces-tab.md) ve [Canvas Özellikleri](./canvas-features.md).

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Günlükler demosunu izleyin</a></p>

### [DataTable](../tabs/datatable-tab.md)

DataTable sekmesi, Heym içinde yapılandırılmış veri tabloları oluşturmanıza ve yönetmenize olanak tanır. Tipli sütunlar tanımlayın (string, number, boolean, date, JSON), satırları satır içi çift tıklama düzenlemesiyle yönetin, CSV içe/dışa aktarın ve tabloları kullanıcılarla veya [ekiplerle](./teams.md) okuma/yazma izinleriyle paylaşın. İş akışlarında tablolara programatik olarak erişmek için [DataTable düğümünü](../nodes/datatable-node.md) kullanın. Üst kısımda sabitlenmiş bir **Sistem tabloları** bölümü, **LLM Maliyet Tablosunu** barındırır: Helicone'dan arka planda beslenen model başına fiyatlandırmanın sabit şemalı bir görünümü (24 saatlik TTL, manuel Yenile), burada her kullanıcı fiyatları geçersiz kılabilir veya Helicone'un listelemediği modeller için özel satırlar ekleyebilir. Bu fiyatlandırma kuralları, [İzler](../tabs/traces-tab.md) sekmesindeki maliyet KPI'sini ve model başına maliyet grafiğini yönlendirir.

Ayrıca bkz. [DataTable düğümü](../nodes/datatable-node.md), [İzler](../tabs/traces-tab.md), [İş Akışı Yapısı](./workflow-structure.md) ve [Ekipler](./teams.md).

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ DataTable demosunu izleyin</a></p>
### [Drive](../tabs/drive-tab.md)

Drive sekmesi, workflow'larınız genelinde skill'ler tarafından oluşturulan tüm dosyaları gösterir. Her dosyayı ad, tür, boyut, kaynak düğüm, oluşturma tarihi ve ekip paylaşım durumu ile listeler; ayrıca arama, kimliği doğrulanmış indirme, paylaşma, silme ve sayfalama kontrolleri sunar. Bu sekme; [File Generation](./file-generation.md), [Drive](./drive.md) referansı ve [Drive düğümü](../nodes/drive-node.md) için dashboard tamamlayıcısıdır.

Ayrıca bkz. [Drive](./drive.md), [File Generation](./file-generation.md) ve [Drive düğümü](../nodes/drive-node.md).

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Drive demosunu izleyin</a></p>
