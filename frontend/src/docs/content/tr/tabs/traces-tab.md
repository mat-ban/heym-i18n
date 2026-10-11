# Traces Sekmesi

**Traces** sekmesi LLM yürütme izlerini gösterir. İstek/yanıt payload'larını, zamanlamayı, araç çağrılarını inceleyin ve [Agent](../nodes/agent-node.md) ile [LLM](../reference/node-types.md) node davranışlarını hata ayıklayın; ayrıca herhangi bir zaman aralığındaki toplu metrikleri (çağrılar, token'lar, maliyet, gecikme, hata oranı) görüntüleyin.

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Traces demosunu izleyin</a></p>

## İstatistik Başlığı

Sayfa, trace listesinin üzerinde seçili zaman aralığı ve diğer etkin filtreler üzerinden hesaplanan bir istatistik özetiyle açılır:

- **KPI kartları** – Toplam Çağrı, Toplam Token, Toplam Maliyet (USD), Ort. Gecikme, Hata %
- **Modele Göre Token** – Model başına token hacmini gösteren halka grafik
- **Modele Göre Maliyet** – Model başına USD harcamasını gösteren halka grafik. Fiyatlandırması olmayan modeller, [LLM Cost Table](./datatable-tab.md#llm-cost-table-system-table) sayfasına yönlendiren bir "Configure pricing" bağlantısı gösterir
- **Zaman İçinde Çağrılar** – Kova başına başarılı ve başarısız çağrıları gösteren yığılmış alan grafiği (5 dk / 1 sa / 6 sa / 1 gün, aralığa göre otomatik seçilir)
- **Fiyatlandırılmamış model uyarısı** – İzlenen bazı modellerin fiyatlandırma satırı olmadığında grafiklerin altında görünür ve LLM Cost Table sayfasına bağlantı verir

## Zaman Aralığı

Filtre çubuğunun üst kısmındaki tek bir **Time range** seçici hem istatistik başlığını hem de trace listesini yönetir. Seçenekler: Son 1 saat, Son 24 saat, Son 7 gün (varsayılan), Son 30 gün, Tüm zamanlar. Aralığı değiştirmek sayfalamayı sıfırlar ve grafiklerle listeyi birlikte yeniden yükler.

## Trace Listesi

- Seçili zaman aralığındaki son trace'lerin sayfalanmış listesi
- Her trace şunları gösterir: workflow, node, credential, zaman damgası, süre
- Detay görünümünü açmak için bir trace'e tıklayın
- Detay iletişim kutusunu kapatmadan trace'ler arasında geçiş yapmak için içindeki **Prev / Next** düğmelerini kullanın

## Filtreleme

- **Time range** – 1 sa / 24 sa / 7 gün / 30 gün / Tümü; grafikleri ve listeyi birlikte filtreler
- **Credential** – Kullanılan credential (API key) ile filtreleyin
- **Source** – Workflow veya yürütme kaynağına göre filtreleyin
- **Search** – Model, workflow, credential veya node etiketine göre arama yapın
- **Refresh** – Trace'lerin geçerli sayfasını yeniden yükleyin

## Trace Detayı

Bir trace'i açtığınızda:

- **Steps** – Trace'i sıralı bir zincir olarak okuyan yukarıdan aşağıya bir zaman çizelgesi: System → User → Assistant → Tool → Answer. Her adım daraltılabilir; birini genişletmek okunabilir bir detay (mesaj metni veya bir aracın argümanları ve sonucu) ve ardından o adımın JSON'unu gösterir. MCP çağrıları ve JSON-RPC payload'ları dahil her olay türündeki JSON içeriği varsayılan olarak genişletilebilir bir ağaçta açılır ve ilk seviye genişletilmiş haldedir. Biçimlendirilmiş yapı ile orijinal metin arasında geçiş yapmak için **Tree / Raw** kullanın. Bozuk JSON düz metin olarak görünmeye devam eder. Tool adımları sürelerini ve uygun olduğunda bir MCP/Skill rozetini, ayrıca tool-call durumu ayarlandığında pending / timeout / cancelled rozetlerini gösterir. Answer adımı toplu `tool_metrics` rozetlerini (duruma göre çağrı sayıları ve toplam araç süresi) gösterebilir. Bir trace her model çağrısını kaydettiğinde—bir Dashboard Chat mesajı ve yönlendirilmiş bir agent gibi—çağrılan araçlardan önce bir **LLM** adımı yer alır ve **Duration Breakdown** her model çağrısını, aracı ve yönlendirme kararını tek bir zaman çizelgesinde ortaya koyar. Bir Dashboard Chat mesajı, kaç tur araç çağrısı sürmüş olursa olsun tek bir trace'tir. Mesaj zinciri olmayan trace'ler (örneğin görsel oluşturma) minimal bir Request → Response zaman çizelgesi gösterir.
- **Request** – LLM'e gönderilen tam istek payload'ı, **Tree / Raw** JSON görünümleriyle
- **Response** – Varsa araç çağrıları dahil model yanıtı, **Tree / Raw** JSON görünümleriyle
- **Tool metrics** – Yanıtta mevcut olduğunda, araç çağrısı sayılarının (`success` / `error` / `pending` / `timeout` / `cancelled`) ve toplam araç süresinin kısa bir özeti
- **Timing breakdown** – Performans analizi için `llm_ms`, `tools_ms`, `mcp_list_ms`
- **Tool calls** – Araç adı, argümanlar, sonuç, durum ve geçen süre
- **Skills included** – İstekte modele aktarılan Skill'ler
- **Go to Workflow** – Trace detay iletişim kutusundan ilgili workflow'a doğrudan atlayın

## Kopyalama ve Dışa Aktarma

- İstek veya yanıt JSON'unu panoya kopyalayın; kopyalama, etkin görünümden bağımsız olarak her zaman tam ham payload'ı kullanır
- Hata ayıklama veya destek ekibiyle paylaşmak için kullanın

## Bakım

- **Clear All** – Onaydan sonra kaydedilen tüm trace'leri silin
- Sayfalama kontrolleri geçerli görünür aralığı gösterir (örneğin `1-25 of 240`)

## İlgili

- [Why Heym](../getting-started/why-heym.md) – Agent yaşam döngüsü boyunca LLM gözlemlenebilirliği
- [Agent Node](../nodes/agent-node.md) – Araç çağrısı yapan Agent node
- [Node Types](../reference/node-types.md) – LLM ve Agent node'ları
- [Credentials Tab](./credentials-tab.md) – Trace'lerde kullanılan credential'lar
- [OpenTelemetry Tracing](../reference/opentelemetry.md) – Workflow, node ve Agent tool span'leri için isteğe bağlı OTel dışa aktarımı
- [DataTable Tab](./datatable-tab.md) – Maliyet grafiğinin kullandığı LLM Cost Table'ı barındırır
- [Contextual Showcase](../reference/contextual-showcase.md) – Dashboard yüzeyleri için kısa sayfa kılavuzu
