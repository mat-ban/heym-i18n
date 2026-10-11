# OpenTelemetry Tracing

Heym, her workflow çalıştırması, node yürütmesi ve Agent tool çağrısı için [OpenTelemetry](https://opentelemetry.io/) trace'leri yayabilir. Her çalıştırma, her node ve Agent tool için child span'lerle birlikte bir root span üretir; böylece hangi adımın başarısız olduğunu, ne kadar sürdüğünü, neyi çağırdığını ve neyin döndüğünü görebilirsiniz. Span'ler, Jaeger, Grafana Tempo, Honeycomb, Datadog, New Relic veya Grafana Cloud gibi uyumlu herhangi bir backend'e OTLP/HTTP üzerinden aktarılır.

Tracing **varsayılan olarak devre dışıdır**. Kapalıyken ölçülebilir bir ek yük yoktur ve hiçbir span oluşturulmaz.

## Tracing'i Etkinleştirme

Backend üzerinde aşağıdaki ortam değişkenlerini ayarlayın, ardından yeniden başlatın:

Ortam değişkenlerinin tam listesi için [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) sayfasına bakın.

| Değişken | Varsayılan | Açıklama |
|----------|---------|-------------|
| `HEYM_OTEL_ENABLED` | `false` | Ana anahtar. Tracing'i açmak için `true` olarak ayarlayın. |
| `HEYM_OTEL_EXPORTER_OTLP_ENDPOINT` | `""` | OTLP/HTTP temel endpoint, örneğin `http://collector:4318`. Heym, span'leri `<endpoint>/v1/traces` adresine gönderir. |
| `HEYM_OTEL_EXPORTER_OTLP_HEADERS` | `""` | Exporter kimlik doğrulaması için virgülle ayrılmış `key=value` header'ları, örneğin `authorization=Bearer <token>`. |
| `HEYM_OTEL_SERVICE_NAME` | `heym` | `service.name` resource attribute'u. |
| `HEYM_OTEL_TRACES_SAMPLER_RATIO` | `1.0` | `0.0` ile `1.0` arasında head sampling oranı; parent-based sampler ile uygulanır. |
| `HEYM_OTEL_CAPTURE_NODE_IO` | `false` | `true` olduğunda, kısaltılmış node input ve output payload'larını node span'lerine ekler. Gizlilik için varsayılan olarak kapalıdır. |

Minimal örnek:

```bash
HEYM_OTEL_ENABLED=true
HEYM_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

Etkin yapılandırmayı uygulamada **Settings → Observability** altında doğrulayabilirsiniz (header'daki avatarınızdan açın). Bu panel salt okunurdur ve exporter sırlarını hiçbir zaman göstermez.

## Neler Trace Edilir

### Workflow root span

Ad: `heym.workflow.execute`

| Attribute | Açıklama |
|-----------|-------------|
| `heym.workflow.id` | Workflow UUID'si. |
| `heym.node.count` | Workflow'daki node sayısı. |
| `heym.workflow.test_mode` | Test çalıştırmaları için `true`. |
| `heym.sub_workflow.depth` | Sub-workflow olarak çağrıldığında iç içe geçme derinliği. |
| `heym.workflow.status` | Çalıştırmanın nihai durumu. Başarısız bir çalıştırma, span durumunu `ERROR` olarak ayarlar. |

### Node span

Ad: `heym.node.execute`, workflow span'inin child'ı olarak oluşturulur.

| Attribute | Açıklama |
|-----------|-------------|
| `heym.node.id` | Node id'si. |
| `heym.node.type` | Node tipi, örneğin `agent`, `llm`, `http`. |
| `heym.node.label` | Canvas'ta gösterilen node etiketi. |
| `heym.node.status` | `success` veya `error`. Hatalar, span durumunu `ERROR` olarak ayarlar. |
| `heym.node.duration_ms` | Node yürütme süresi milisaniye cinsinden. |
| `heym.llm.model` | Mevcut olduğunda LLM ve agent node'ları için model adı. |
| `heym.llm.prompt_tokens` / `heym.llm.completion_tokens` / `heym.llm.total_tokens` | Mevcut olduğunda LLM ve agent node'ları için token kullanımı. |

Node'lar paralel çalışsa bile node span'leri workflow span'inin altında doğru şekilde iç içe geçer, çünkü workflow bağlamı worker thread'lerine yayılır.

### Agent tool span

Ad: `heym.agent.tool.execute`, etkin Agent node span'inin altında oluşturulur.

| Attribute | Açıklama |
|-----------|-------------|
| `heym.agent.tool.name` | Model tarafından seçilen tool adı. |
| `heym.agent.tool.call_id` | Mevcut olduğunda sağlayıcı tool-call id'si. |
| `heym.agent.tool.source` | `node_tool`, `mcp`, `skill` veya `sub_workflow` gibi tool kaynağı. |
| `heym.agent.tool.mcp_server` | Uygun olduğunda MCP server etiketi. |
| `heym.agent.tool.iteration` | Agent tool-loop iterasyonu. |
| `heym.agent.tool.args_bytes` | Serileştirilmiş tool argümanlarının UTF-8 boyutu. |
| `heym.agent.tool.result_bytes` | Serileştirilmiş tool sonucunun UTF-8 boyutu. |
| `heym.agent.tool.status` | `success`, `error`, `pending`, `timeout` veya `cancelled`. Tool hataları, span durumunu `ERROR` olarak ayarlar. |

Ham tool argümanları ve sonuçları varsayılan olarak span'lere eklenmez.

## Agent tool payload güvenliği

Kalıcı hale getirilen Agent observability payload'ları kod içinde redakte edilir ve kısaltılır (string başına `4096` karakter, derinlik `6`, LLM trace yazımı başına toplam `32768` karakter). Toplam trace bütçesi tool kayıtları arasında bölünür, böylece erken gelen büyük bir sonuç sonraki çağrıların kimliğini ve yaşam döngüsü durumunu gizleyemez. Sınırlandırılmış `_generated_files` indirme metadata'sı, hacimli skill çıktısından ayrı olarak ayrılır:

- LLM trace `request` / `response` tool bölümleri, trace store'a yazılan `_hitl_pending` kopyaları dahil
- Execution history'de gösterilen Agent sonucu `tool_calls` kayıtları
- Aynı sınırlandırılmış sanitize edilmiş kaydı yeniden kullanan Live Debug panel tool-result event'leri

Canlı tool yürütmesi, modele bağlı tool mesajları ve bellek içi HITL resume durumu (`_hitl_pending.agent_state.messages` / `tool_arguments`) orijinal değerleri korur, böylece resume ve tam argüman eşleştirmesi hâlâ çalışır. Yalnızca saklanan observability kopyaları sanitize edilir.

## Trace Context Yayılımı

Heym, trace'lerin servis sınırları arasında bağlantılı kalması için [W3C Trace Context](https://www.w3.org/TR/trace-context/) standardını takip eder.

- **Gelen webhook'lar:** gelen bir istek `traceparent` header'ı taşıdığında, workflow çalıştırması o trace'in bir alt öğesi olarak kaydedilir. Bu, Heym çalıştırmalarını bunları tetikleyen üst sistemle ilişkilendirir.
- **Giden HTTP:** HTTP node'u, yaptığı isteklere `traceparent` enjekte eder, böylece alt servisler aynı trace'i sürdürebilir.
- **Alt workflow'lar:** bir alt workflow çalıştırması, onu çağıran node'a bağlanır ve çağrı hiyerarşisini tek bir trace içinde korur.

Gelen bir context'i olmayan Trigger'lar (Cron, IMAP, RabbitMQ ve WebSocket gibi) her çalıştırma için yeni bir trace başlatır.

## Güvenilirlik

- Yavaş veya erişilemeyen bir collector, workflow yürütmesini asla engellemez. Span'lar toplu hâlde arka planda dışa aktarılır.
- Tracing başlatılamazsa (örneğin hatalı bir endpoint), backend hatayı loglar ve başlatılamamak yerine tracing devre dışı olarak devam eder.
- OTLP auth header'ları yalnızca ortamdan okunur. Hiçbir zaman veritabanında saklanmaz ve status API tarafından hiçbir zaman döndürülmez.

## İlgili

- [Ayarlar](./user-settings.md) – Tracing durumunu gösteren Observability sekmesi
- [Ortam Değişkenleri](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Tam yapılandırma referansı
- [Trigger'lar](./triggers.md) – Webhook'lar dahil workflow'ların nasıl başladığı
- [Yürütme Geçmişi](./execution-history.md) – Heym'in yerleşik çalıştırma başına geçmiş görünümü
- [HTTP](../nodes/http-node.md) – Trace context'i alt çağrılara yayan node
