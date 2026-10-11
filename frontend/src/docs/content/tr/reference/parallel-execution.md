# Paralel Çalıştırma

Heym, birbirlerine bağımlılığı olmayan düğümleri paralel olarak çalıştırır ve birden fazla workflow çalışmasının eşzamanlı olarak yürütülmesine olanak tanır.

## Tek Bir Çalışma İçinde

### DAG Tabanlı Zamanlama

Yürütücü, düğümleri yönlü çevrimsiz bir grafik (DAG) kullanarak **yürütme seviyesine** göre gruplandırır:

1. **Seviye 0** – Gelen kenarı olmayan düğümler (başlangıç düğümleri)
2. **Seviye N** – Üst akış bağımlılıklarının tümü 0..N-1 seviyelerinde olan düğümler

Aynı seviyedeki düğümlerin birbirlerine bağımlılığı yoktur ve paralel olarak çalışırlar.

### Thread Pool

- **Paylaşılan havuz**: Düğüm yürütmesi için `ThreadPoolExecutor(max_workers=8)`
- **Zamanlama**: `wait(..., return_when=FIRST_COMPLETED)` – herhangi bir düğüm tamamlanır tamamlanmaz, alt akış düğümleri zamanlanır
- **Thread-safe**: Düğüm çıktıları bir kilit ile saklanır (`store_node_output`)

### Orkestratör Alt Ajanları

Bir orkestratör ajanı tek bir turda birden fazla `call_sub_agent` araç çağrısı döndürdüğünde, bunlar paralel olarak çalışır. Bkz. [Ajan Mimarisi](./agent-architecture.md).

### Merge Düğümü

[Merge](../nodes/merge-node.md) düğümü, birden fazla paralel daldan gelen çıktıları birleştirir. Sonuçları açıkça birleştirmeniz gerektiğinde kullanın; aksi takdirde paralel dallar ayrı çıktı düğümlerinde sonlanabilir.

### Döngüler

Döngü yinelemeleri **sıralı** olarak çalışır. Döngü gövdesi düğümleri her yineleme için yeniden zamanlanır.

### Erken Dönüş

`allowDownstream` özelliğine sahip çıktı düğümleri erken dönebilir. Kalan alt akış işleri arka planda çalışır.

## Eşzamanlı Workflow Çalışmaları

- **Workflow başına kilit yok** – Birden fazla istek aynı workflow'u aynı anda çalıştırabilir
- **Async API** – FastAPI endpoint'leri, olay döngüsünün duyarlı kalması için `asyncio.to_thread(execute_workflow)` kullanır
- **Yalıtım** – Her çalışma kendi `WorkflowExecutor` örneğini ve durumunu alır

Workflow'ları çalıştıran Trigger'lar ([Webhook](./webhooks.md), [Portal](./portal.md), [Cron](./triggers.md), RabbitMQ, MCP, Editor) her biri `execute_workflow`'u bağımsız olarak çağırır.

## Streaming

Streaming aynı paralel modeli kullanır ancak düğümler tamamlandıkça olaylar yayar. Editor ve portal sohbet arayüzü, gerçek zamanlı ilerleme için dahili olarak streaming kullanır ve webhook kullanıcıları artık [SSE Streaming](./sse-streaming.md) execute endpoint'i aracılığıyla aynı olay akışına dahil olabilir.

## İlgili Konular

- [Neden Heym](../getting-started/why-heym.md) – Heym çalışma zamanında paralel DAG yürütme
- [Workflow Yapısı](./workflow-structure.md) – Düğümler, kenarlar ve yürütme akışı
- [Temel Kavramlar](../getting-started/core-concepts.md) – Yürütme akışına genel bakış
- [Düğüm Türleri](./node-types.md) – [Merge](../nodes/merge-node.md) düğümü ve diğer türler
- [Trigger'lar](./triggers.md) – Çalışmaları tetikleyen giriş noktaları
- [SSE Streaming](./sse-streaming.md) – `/execute/stream` için olay akışı formatı
