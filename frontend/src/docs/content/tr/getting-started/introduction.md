# Giriş

**Agentic sistemler oluşturun. Onları güvenle çalıştırın.**

Heym, AI agent'larını üretim ortamında çalıştırmak ve yönetmek için bir altyapıdır. Agent'ları orkestre edin, iş süreçlerini otomatikleştirin, her yürütmeyi inceleyin ve kontrolü insanlarda tutun. Heym'i kendi altyapınızda dağıtın.

Heym'de bir workflow, agent'ların, deterministik adımların, araçların ve verilerin birlikte nasıl çalıştığını tanımlar. Runtime bu grafiği yürütür, her çalıştırmayı kaydeder ve talep ettiğiniz yerlerde insan incelemesi için duraklar. Görsel canvas, workflow'ları oluşturduğunuz ve incelediğiniz yerdir; aynı workflow'lar ayrıca API'ler, zamanlamalar, olay trigger'ları, MCP istemcileri ve Portal sohbetleri üzerinden de çalışır. Ürün sitesi için [heym.run](https://heym.run) adresini ziyaret edin ve Heym'in agent yaşam döngüsünün her aşamasında neleri ele aldığını görmek için [Neden Heym](./why-heym.md) sayfasına bakın.

## Neler Yapabilirsiniz

- **Oluşturun** – [Workflows](../tabs/workflows-tab.md) sekmesindeki [canvas](../reference/canvas-features.md) üzerinde agent'ları ve deterministik adımları bir araya getirin, bunları [AI Assistant](../reference/ai-assistant.md) ile tanımlayın veya [Templates](../tabs/templates-tab.md) ile başlayın
- **Orkestre Edin** – [Agent](../nodes/agent-node.md), [LLM](../nodes/llm-node.md) ve [RAG](../nodes/rag-node.md) node'larını, [sub-agent'ları](../reference/agent-architecture.md), MCP araçlarını ve HTTP, Slack ve e-posta gibi [entegrasyonları](../reference/integrations.md) koordine edin; bağımlılıkların izin verdiği yerlerde [paralel yürütme](../reference/parallel-execution.md) kullanın
- **Çalıştırın** – Workflow'ları [webhook'lar](../reference/webhooks.md), [Cron](../nodes/cron-node.md) zamanlamaları ve olay [trigger'ları](../reference/triggers.md) üzerinden başlatın; node başına yeniden denemeler, [hata yönetimi](../nodes/error-handler-node.md) ve örnekler arasında [yük dağıtımı](../reference/cluster.md) ile birlikte
- **Gözlemleyin** – [Yürütme geçmişini](../reference/execution-history.md), token maliyetleriyle birlikte [LLM trace'lerini](../tabs/traces-tab.md), [analitikleri](../tabs/analytics-tab.md) ve [uyarıları](../tabs/alerts-tab.md) inceleyin ve [OpenTelemetry](../reference/opentelemetry.md) trace'lerini dışa aktarın
- **Değerlendirin** – [Evals](../tabs/evals-tab.md) sekmesinde prompt'ları ve modelleri beklenen çıktılara karşı test edin
- **Kontrol Edin** – Agent'ları [insan incelemesi](../reference/human-in-the-loop.md) için duraklatın, güvenli olmayan içeriği [guardrail'lerle](../reference/guardrails.md) engelleyin ve erişimi [credential'lar](../tabs/credentials-tab.md), [takımlar](../reference/teams.md), [tek oturum açma](../reference/sso.md) ve bir [denetim izi](../reference/audit.md) ile yönetin
- **Sunun** – Workflow'ları REST ve [SSE streaming](../reference/sse-streaming.md) üzerinden, [MCP](../tabs/mcp-tab.md) araçları olarak ve son kullanıcılar için [Portal](../reference/portal.md) sohbet arayüzleri olarak sunun; modelleri doğrudan test etmek için [Chat](../tabs/chat-tab.md) sekmesini kullanın
- **Heym ile Sohbet Edin** – Dokümantasyondaki [Chat with Heym](../reference/chat-with-heym.md) diyaloğundan sayfa farkındalıklı ürün soruları sorun

## Temel Kavramlar

- **Workflows** – Node'lardan ve edge'lerden oluşan yönlü bir grafik. Bunları [Workflows](../tabs/workflows-tab.md) sekmesinde yönetin. Bkz. [Workflow Yapısı](../reference/workflow-structure.md).
- **Nodes** – İşleme birimleri ([Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md) vb.). Bkz. [Node Türleri](../reference/node-types.md).
- **Edges** – Yürütme akışını tanımlayan bağlantılar
- **Credentials** – [Credentials](../tabs/credentials-tab.md) sekmesinde saklanan ve node'lar tarafından referans verilen API anahtarları ve gizli bilgiler.
- **Variables** – [Variables](../tabs/global-variables-tab.md) sekmesinde saklanan ve `$global.variableName` ile erişilebilen kalıcı anahtar-değer verileri. Bkz. [Global Variables](../reference/global-variables.md).
- **Expressions** – `$input` ve `$nodeName.field` ile yukarı akış verilerine referans verin. Bkz. [Expression DSL](../reference/expression-dsl.md).

## İlgili

- [Neden Heym](./why-heym.md) – Heym'in agent yaşam döngüsünün her aşamasında neleri ele aldığı
- [Hızlı Başlangıç](./quick-start.md) – İlk workflow'unuzu oluşturun
- [Çalıştırma ve Dağıtım](./running-and-deployment.md) – `run.sh` ile yerel olarak başlatın veya `deploy.sh` ile dağıtın
- [AI Assistant](../reference/ai-assistant.md) – Doğal dil ile workflow'lar oluşturun
- [Chat with Heym](../reference/chat-with-heym.md) – Dokümanları okurken takip soruları sorun
- [Temel Kavramlar](./core-concepts.md) – Workflow'lar, node'lar ve yürütme akışı
- [Workflows Sekmesi](../tabs/workflows-tab.md) – Workflow'ları ve klasörleri yönetin
- [Credentials Sekmesi](../tabs/credentials-tab.md) – Node'lar için API anahtarları ekleyin
