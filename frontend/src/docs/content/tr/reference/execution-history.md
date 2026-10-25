# Execution History

Execution history, workflow çalışmalarını kaydeder: girdiler, çıktılar, node sonuçları, durum ve trigger kaynağı. Etkin bir production çalışmasını izlemek, geçmiş çalışmaları incelemek, hataları debug etmek veya **Bring to Canvas** ile aynı girdilerle yeniden çalıştırmak için kullanın.

## Genel Bakış

Her execution şunları saklar:

| Alan | Açıklama |
|-------|-------------|
| **Inputs** | Request body veya çalışma girdileri (örn. Input node için `text`) |
| **Outputs** | Workflow düzeyinde çıktılar |
| **Node results** | Node başına çıktılar, durum ve execution süresi |
| **Status** | `success`, `error`, `pending`, `skipped` veya `failed` (bkz. [Crash Recovery](#crash-recovery)) |
| **trigger_source** | Çalışmanın nasıl tetiklendiği (bkz. [Triggers](./triggers.md)) |

## History'e Erişim

| Konum | Kapsam |
|----------|-------|
| **Editor** araç çubuğu | Yalnızca geçerli workflow |
| **Docs** görünüm başlığı | Yalnızca geçerli workflow |
| **Dashboard** başlığı (Chat sekmesi) | Tüm workflow'lar + chat/assistant çalışmaları |
| **Evals** görünüm başlığı | Tüm workflow'lar + chat/assistant çalışmaları |

Dialog'u açmak için **History** düğmesine (saat simgesi) tıklayın.

## Workflow Başına vs Tüm History

- **Workflow başına** (Editor, Docs): Açık olan workflow'un çalışmalarını gösterir. Yalnızca o workflow'un çalışmalarını kaldırmak için **Clear history** kullanın.
- **Tüm History** (Dashboard, Evals): Tüm workflow'lar ve chat/assistant oturumlarındaki çalışmaları gösterir. Kapsam, workflow erişiminizle eşleşir: sahip olduğunuz workflow'lar, doğrudan sizinle paylaşılan workflow'lar ve üyesi olduğunuz bir ekiple paylaşılan workflow'lar. Sahip olduğunuz tüm kayıtları kaldırmak için **Clear all history** kullanın. Paylaşılan workflow'ların history'si korunur.

## Bring to Canvas

**Bring to Canvas**, seçili bir çalışmanın girdilerini ve node çıktılarını geçerli workflow'a yükler.

### Neyi yükler

- **Inputs** → Çalışma girdi paneli (örn. Input node için `text` veya özel alanlar)
- **Node results** → Execution result paneli, node başına geçmiş çıktıları gösterir
- **Execution result** → Çalışmanın durumu, çıktıları ve zamanlaması

### Bağlama göre davranış

- **Editor'de** (workflow başına history): Açık workflow'a hemen uygulanır ve dialog'u kapatır.
- **Tüm History'den** (Dashboard/Evals): Workflow editor'e gider, ardından editor yüklendiğinde verileri uygular. Yalnızca workflow çalışmaları için kullanılabilir—chat/assistant çalışmaları için değil.

### Execution deep link

Bir workflow'u `/workflows/{workflowId}/{executionId}` adresinde açmak, o execution'ı otomatik olarak canvas'a getirir — çalışmayı seçip **Bring to Canvas**'ı seçmekle aynıdır. Bu, belirli bir geçmiş çalışmayı URL olarak paylaşılabilir kılar. Execution bulunamazsa (yanlış veya silinmiş id), editor düz workflow'u yüklemeye geri döner.

### Kullanım durumları

- Bir workflow'u aynı girdilerle yeniden çalıştırma
- Girdileri ve node çıktılarını inceleyerek başarısız bir çalışmayı debug etme
- Çalışmalar arasında çıktıları karşılaştırma

## AI'ya Sor

Her iki geçmiş iletişim kutusunun başlığının yanında bir **AI'ya Sor** düğmesi (parıltı simgesi) bulunur. Bu düğme, iş akışı ve seçilen çalıştırma kaldırılabilir çipler olarak eklenmiş şekilde yeni bir konuşmada [Chat sekmesini](../tabs/chat-tab.md#asking-about-a-run) açar. Çalıştırmanın neden yavaş olduğunu, neyin başarısız olduğunu sorun veya Chat'in iş akışını düzeltmesini sağlayın. Chat, düğüm başına izleme ve hatalar dahil olmak üzere tam olarak o çalıştırmayı okur.

All History iletişim kutusunda **AI'ya Sor** yalnızca bir iş akışı çalıştırması seçildiğinde görünür; sohbet ve asistan çalıştırmalarında gösterilmez.

## Çalıştırma zaman çizelgesi

Çalıştırma ayrıntısında **Tümünü Genişlet**'in yanındaki **Zaman Çizelgesi** düğmesi (kronometre simgesi), **Adımlar** listesini bir span zaman çizelgesiyle değiştirir. Zaman çizelgesi gösterilirken aynı düğmede **Günlükler** yazar; listeye dönmek için tıklayın. All History'de düğme yalnızca iş akışı çalıştırmalarında görünür. Zaman çizelgesi, başladığı anda her düğüm için bir çubuk çizer, böylece hangi düğümün ne kadar sürdüğünü ve hangilerinin paralel çalıştığını görebilirsiniz. Süresi için bir çubuğun üzerine gelin; düzenleyicinin [yürütme zaman çizelgesi](#execution-timeline-details) ile aynı ayrıntı denetçisini açmak için tıklayın. Seçtiğiniz görünüm iletişim kutusu açık olduğu sürece kalır.

Düğüm başlangıç zamanları kaydedilmeden önce kaydedilen çalıştırmalar süreye göre birbiri ardına sıralanır.

## Execution Highlights

Canlı bir çalışmadan sonra — veya **Bring to Canvas** sonrasında — **Canvas'ın sağ üst köşesinde** kapatılabilir bir **Execution Highlights** popup'ı görünür. Bu, *her node'un ne ürettiğini* execution sırasına göre yukarıdan aşağıya listelenmiş olarak görmenin hızlı bir yoludur. **✕** ile kapatın; bir sonraki çalışmada yeniden açılır.

### Neyin gösterildiği

| Kayıt | Kaynak | Otomatik? |
|--------|--------|-------|
| **Input** | Çalışmanın girdi parametreleri (input/trigger node) | Evet |
| **Output** | Output node'un sonucu — veya yoksa, son node'un mesajı | Evet |
| **Agent / LLM** | Her agent veya LLM node'unun çıktısı | Evet |
| **Output** | **Highlight Node Output** etkinleştirilmiş diğer tüm node'lar | Opt-in |

Zaten otomatik olarak highlight edilen node'lar (input / output / last / agent / llm), toggle'ı da etkinleştirseniz bile asla iki kez görünmez.

### Her kayıt

- İlk **250 karakter** ile `Node — message…` gösterir; bir satıra tıklayarak genişletin ve **tam mesajı Markdown olarak** render edin, **Copy** düğmesiyle birlikte.
- Birden çok kez çalışan bir node (örn. bir loop içinde) `Node (N)` ile birlikte bir `‹ i / N ›` seçici gösterir — hangi çalışmanın görüntüleneceğini seçin; her node'un seçicisi bağımsızdır.

### Highlight Node Output

Agent ve LLM hariç her node'un özellikler panelinde bir **Highlight Node Output** onay kutusu vardır (varsayılan kapalı). Bu node'un çıktısını popup'a eklemek için etkinleştirin. Canvas'ta highlight edilen node'larda küçük bir ✦ rozeti görünür. [workflow DSL](./expression-dsl.md) içinde bu, node-data alanı `"highlight": true`'dur (varsayılan `false`).

### Dashboard'larda

Bir workflow çalıştıran dashboard widget kartları, kart başlığında bir ✦ **Execution highlights** düğmesi gösterir; o widget'ın çalışması için aynı popup'ı açmak üzere tıklayın, widget'ın çizilen çıktısı öne çıkan kayıt olarak görünür.

## Çalışan Execution'lar

Her iki geçmiş iletişim kutusu da listenin en üstünde, geçmiş çalıştırmalardan önce **şu anda çalışan execution'ları** gösterir.

- Başlangıç saatiyle birlikte dönen bir gösterge ve **Running** etiketi görünür
- Editörü yeniden başlatmadan tam o çalıştırmaya bağlamak için **Open live** seçeneğine tıklayın
- Canvas önce zaten tamamlanmış node'ları geri yükler, ardından SSE üzerinden
  `node_start`, `node_complete` ve nihai execution olaylarını alır
- Geçerli node canvas üzerinde nabız gibi yanıp söner, alt node'lar bekleyen animasyonlarını korur ve
  Debug paneli her sonucu geldiği anda ekler—tıpkı editörden başlatılan bir çalıştırma gibi
- Execution'ı hemen durdurmak için **Cancel** seçeneğine tıklayın
- Herhangi bir iletişim kutusundan (Editor veya Dashboard) iptal etmek, o workflow için açık olan herhangi bir canvas sekmesindeki etkin SSE akışını da kapatır, böylece editör durumu temiz bir şekilde sıfırlanır
- İptalden sonra, çalışan giriş bir sonraki yenilemede kaybolur; listeyi manuel olarak güncellemek için **Refresh** seçeneğine basın
- Zaten tamamlanmış bir çalıştırmayı iptal ederseniz, istek bir no-op'tur

Canlı URL `/workflows/{workflowId}/{executionId}` şeklindedir. Gözlemci salt okunurdur: editörden
ayrılmak yalnızca o tarayıcı sekmesinin bağlantısını keser ve workflow'u asla durdurmaz. Etkin anlık görüntüler
PostgreSQL üzerinden paylaşılır, böylece trigger ve editör isteği farklı backend worker'larına düştüğünde bile bir çalıştırmayı açmak çalışır.

## Crash Recovery

Bir workflow çalışırken sunucu yeniden başlarsa (deploy, container yeniden başlatma veya çökme), o çalıştırmanın worker'ı yürütmenin ortasında durur. Heym bu kesintiye uğramış çalıştırmaları **Running** olarak takılı bırakmak yerine otomatik olarak kurtarır.

- Bir sonraki başlatmada, seçilen leader süreç sahipsiz çalıştırmaları algılar — düzgün bir yeniden başlatma için anında veya sert bir çökme için ~60 saniye içinde (heartbeat'ler net bir şekilde durduğunda).
- Kurtarılan çalıştırmalar **aynı girdilerle sıfırdan yeniden çalıştırılır** (durdukları yerden devam ettirilmez), mevcut workflow tanımı kullanılarak. Tamamlandıklarında normal bir terminal girişi (örn. `success`) kaydederler, böylece geçmiş çalıştırmayı tamamlanmış olarak gösterir.
- Bir çalıştırma **bir kez** yeniden denenir. Kurtarma girişimi de kesintiye uğrarsa — veya workflow o zamana kadar silinmişse — giriş `failed` olarak kaydedilir.
- Bu, tek bir container ve çok worker'lı dağıtımlarda aynı şekilde çalışır; yalnızca leader kurtarma gerçekleştirir, böylece bir çalıştırma farklı worker'lar tarafından asla iki kez kurtarılmaz.

### Auto-recover toggle

Editörün **Execution Log** (run) panelinde, her workflow için **varsayılan olarak açık** bir **Auto-recover** onay kutusu bulunur.

- **Açık**: Bu workflow'un kesintiye uğramış çalıştırmaları yukarıda açıklandığı gibi yeniden çalıştırılır.
- **Kapalı**: Kesintiye uğramış çalıştırmalar yeniden çalıştırılmaz ve `skipped` durumuyla kaydedilir.

> Sub-workflow çalıştırmaları bağımsız olarak kurtarılmaz — kurtarılan üst çalıştırmaları tarafından yeniden yönlendirilirler. Kendi yeniden teslimine sahip trigger'lar (RabbitMQ, scheduled/cron, IMAP) yeniden başlatmada da yeniden teslim edebilir, bu nedenle kurtarılan bir çalıştırma bazen iki kez yürütülebilir.

## Pending Human Review

[Human-in-the-Loop](./human-in-the-loop.md) onayı için duraklayan çalıştırmalar, `pending` durumuyla hemen geçmişe yazılır.

- Bekleyen agent node'u `reviewUrl`, `draftText` ve `expiresAt` içeren bir review payload'ı saklar
- Agent'ın `review` handle'ına bağlı herhangi bir node, insan yanıt vermeden önce de çalışabilir ve node sonuçları aynı bekleyen geçmiş girişinde saklanır
- Geçmiş iletişim kutuları, sahiplerin kopyalayabilmesi veya açabilmesi için review bağlantısını gösterir
- Geçmiş iletişim kutuları ve editör Debug paneli, çalıştırma devam ettikten sonra nihai insan kararını gösterir
- Bir gözden geçiren draft'ı kabul ettiğinde, düzenlediğinde veya reddettiğinde, aynı geçmiş girişi nihai execution sonucuyla güncellenir
- Aynı çalıştırma HITL için birden fazla kez duraklarsa, geçmiş girişi aynı kalırken her checkpoint kendi tek kullanımlık review bağlantısını alır

Bu özellikle portal çalıştırmaları ve devam etmeden önce saatler veya günler bekleyebilen uzun ömürlü workflow'lar için kullanışlıdır.

## Copy

JSON'u panoya kopyalamak için Inputs veya Outputs yanındaki **Copy** seçeneğini kullanın.

## Clear History

- **Workflow başına**: Editör geçmiş iletişim kutusunda, geçerli workflow'un çalıştırmalarını kaldırmak için **Clear history** seçeneğine tıklayın.
- **Tüm Geçmiş**: Dashboard/Evals geçmiş iletişim kutusunda, sahip olduğunuz tüm execution kayıtlarını kaldırmak için **Clear all history** seçeneğine tıklayın. Paylaşılan workflow'lardan gelen çalıştırmalar korunur. Bu işlem geri alınamaz.

## Execution timeline details

Editörün **Execution Log**'u açıkken, execution timeline'ı göstermek için zamanlayıcı düğmesine tıklayın. Satırlar alanını devralan satır içi bir ayrıntı denetçisini açmak için bir span seçin. Seçilen adımın durumunu, süresini, deneme sayısını, yeniden deneme bilgilerini, hatalarını, trace ID'sini ve kompakt bir çıktı önizlemesini gösterir. Nesne ve dizi çıktıları, Debug panelinin geri kalanıyla aynı `JsonTree` görüntüleyicisini kullanır; skaler değerler bir metin önizlemesi kullanır. Bir adım görüntü çıktıladığında (Playwright ekran görüntüleri, oluşturulan görüntüler, görüntü dosyaları veya bir istek gövdesinde çıktının herhangi bir yerinde bulunan base64 görüntüler), çıktının üzerinde küçük resimler olarak görünürler ve JSON, ham base64 yerine kısa bir yer tutucu gösterir. Bir küçük resme tıklayarak onu bir lightbox'ta açın; ok düğmeleri veya ←/→ tuşları, `2 / 5` gibi bir sayaçla çalıştırmadaki her görüntüde adım adım ilerler. Bir trace ID mevcut olduğunda LLM ve Agent span'ları için **Open trace** seçeneğini kullanın.

## Mobil node detayı

Telefonda, editör serbest tuval yerine tam ekran bir workflow ağacı görüntüler. Kaydedilmiş sonucu olan bir ağaç node'una dokunarak yürütmesini tam ekran detay olarak açın. Görünüm ayrı **Input Data**, **Output Data** ve **Errors** sekmeleri sunar. Output sekmesi kaydedilen sonucu görüntüler ve **Copy Output** sunar; input sekmesi seçili node'un yapılandırmasını gösterir ve errors sekmesi node başarısız olduğunda kaydedilen hatayı gösterir. Ağaca dönmek için **Back to workflow** veya kapatma düğmesini kullanın.

Tuval ve dashboard geçmiş iletişim kutuları, çalıştırma kontrollerini tek bir satırda tutar ve mevcut tag ile instance filtrelerini duyarlı bir grid içine yerleştirir. Filtre menüleri aynı uygulama içi seçiciyi kullanır, böylece seçili onay işareti her seçenek etiketiyle tutarlı bir boşluk ve taban çizgisine sahip olur.

## İlgili

- [Triggers](./triggers.md) – Workflow'ların nasıl başlatıldığı; geçmiş `trigger_source` kaydeder ([Board](../tabs/board-tab.md) kart hareketleri ve takipleriyle başlatılan çalıştırmalar için `board` dahil)
- [Human-in-the-Loop](./human-in-the-loop.md) – Bekleyen inceleme URL'leri ve devam etme davranışı
- [Edit History](./edit-history.md) – Workflow kayıtları için sürüm kontrolü (geri alma, diff)
- [Quick Start](../getting-started/quick-start.md) – İlk workflow'unuzu oluşturun ve çalıştırın
- [Workflows Tab](../tabs/workflows-tab.md) – Workflow'ları oluşturun ve yönetin
