# SSE Streaming

Workflow'lar, Server-Sent Events (SSE) ile yürütme olaylarını gerçek zamanlı olarak akışa aktarabilir.

## Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Bu endpoint, [Webhooks](./webhooks.md) belgesinde açıklanan standart execute endpoint'i ile aynı workflow düzeyinde kimlik doğrulama, hız sınırlama ve yanıt önbellekleme kurallarını kullanır.

## cURL Diyaloğunda SSE'yi Etkinleştirme

Editörde **Run with cURL** diyaloğunu açın ve **SSE Streaming** seçeneğini etkinleştirin.

Etkinleştirildiğinde Heym:

- oluşturulan komutu `/execute` yerine `/execute/stream` olarak değiştirir
- akışa aktarılan olayların terminal çıktısında hemen görünmesi için `--no-buffer` ekler
- `Accept: text/event-stream` başlığını ekler
- diyalog içinde doğrudan düğüm başına `node_start` mesajlarını yapılandırmanıza olanak tanır

## Olay Protokolü

Her SSE çerçevesi, `data: ` öneki ile başlayan ve satır sonu ile ayrılmış JSON'dur.

| Olay türü | Ne zaman yayılır | Anahtar alanlar |
|------------|--------------------|------------|
| `queued` | Workflow [eşzamanlılık sınırındadır](./webhooks.md#concurrency-limit-and-queued-runs); çalıştırmanın yeri her değiştiğinde tekrar gönderilir | `execution_id`, `position`, `size`, `running`, `limit` |
| `execution_started` | İstek kabul edildikten hemen sonra veya kuyruktaki bir çalıştırma başladığında | `execution_id`, `server_now_ms` |
| `node_start` | Bir düğüm yürütülmeye başlamadan hemen önce | `node_id`, `node_label`, `started_at_ms`, isteğe bağlı `message` |
| `node_retry` | Bir düğüm yeniden denendiğinde | `node_id`, `attempt`, `max_attempts` |
| `node_complete` | Bir düğüm tamamlandıktan sonra | `node_id`, `node_label`, `status`, `output`, `execution_time_ms` |
| `final_output` | Bir Output düğümü erken döndüğünde | `node_label`, `output` |
| `execution_complete` | Workflow sona erdikten sonra | `status`, `outputs`, `execution_time_ms` |

### Kuyruktaki çalıştırmalar

Workflow eşzamanlılık sınırına ulaştığında, çalıştırma beklerken akış açık kalır ve `queued` olaylarını gönderir. Kuyruğa alınan bir çalıştırma arka plan worker'ında (muhtemelen başka bir süreçte) yürütülür, bu nedenle akışı çalıştırma başladığında `execution_started` ve bittiğinde `execution_complete` taşır, ancak arada hiçbir `node_start`, `node_complete` veya token olayı taşımaz. `execution_complete` olayı boş bir `node_results` içerir; node ayrıntıları için çalıştırmayı [Çalıştırma Geçmişi](./execution-history.md) bölümünde açın. Bağlantıyı kapatmak kuyruğa alınmış bir çalıştırmayı iptal etmez. Kuyruk dolu olduğunda, akış açılmadan önce istek `429` ile yanıtlanır.

## Düğüm Başına Başlangıç Mesajları

cURL diyaloğu, SSE ayarlarını workflow'un kendisinde saklar:

- **Send start**, bir `node_start` olayının `message` içerip içermeyeceğini kontrol eder
- **Start message** varsayılan olarak `[START] {nodeLabel}` değerini alır
- özel bir mesajın temizlenmesi varsayılan metne geri döner
- `node_complete` her zaman yayılır ve her zaman düğüm çıktısını içerir

Örnek saklanan yapılandırma:

```json
{
  "node-uuid-llm": {
    "send_start": true,
    "start_message": "[START] Draft reply"
  },
  "node-uuid-http": {
    "send_start": false,
    "start_message": null
  }
}
```

## cURL Örneği

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-access-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Örnek olay akışı:

```text
data: {"type":"execution_started","execution_id":"...","server_now_ms":1735660800000}

data: {"type":"node_start","node_id":"...","node_label":"LLM","started_at_ms":1735660800000,"message":"[START] LLM"}

data: {"type":"node_complete","node_id":"...","node_label":"LLM","status":"success","output":{"text":"Hello world"},"execution_time_ms":312}

data: {"type":"execution_complete","status":"success","outputs":{"LLM":{"text":"Hello world"}},"execution_time_ms":315}
```

## Güvenlik Notları

- `anonymous`, `jwt` ve `header_auth` workflow'ları normal webhook endpoint'i ile aynı şekilde davranır
- `cache_ttl_seconds` yapılandırıldığında yanıt önbellekleme hâlâ geçerlidir
- `rate_limit_requests` ve `rate_limit_window_seconds` yapılandırıldığında workflow hız sınırları hâlâ geçerlidir
- `test_run`, `/execute` için olduğu gibi hem önbelleği hem de hız sınırlamayı atlar

## İlgili Konular

- [Webhooks](./webhooks.md) – Standart execute endpoint'i ve cURL diyaloğu
- [Parallel Execution](./parallel-execution.md) – Streaming'in Heym'in DAG zamanlayıcısına nasıl uyduğu
- [Canvas Features](./canvas-features.md) – Run with cURL dahil editör kontrolleri
- [Security](./security.md) – Kimlik doğrulama ve gizli bilgi yönetimi
