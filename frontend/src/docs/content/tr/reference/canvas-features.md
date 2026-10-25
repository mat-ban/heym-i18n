# Canvas Özellikleri

Workflow editörü, node'ları hata ayıklama, test etme ve düzenleme için çeşitli özellikler sunar: **Run to Node**, **Bir Düğümde AI**, **Data Pin**, **Execution Logs**, **Enable/Disable** ve **Extract to Sub-Workflow**.

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Editör demosunu izleyin</a></p>

## Run to Node

Bir sticky note dışındaki herhangi bir node'un üzerine gelin ve altındaki **Run** düğmesine tıklayın. Heym, o node'u ve onun yukarı akış bağımlılıklarını çalıştırır; aşağı akış node'larını ve ilgisiz dalları olduğu gibi bırakır. Bu, sabitlenmiş çıktılar ve workflow'un normal dal koşulları dahil olmak üzere canvas test modunu kullanır.

Seçilen yolun giriş alanları varsa, sağdaki **Run** paneli açılır ve ilk alana odaklanır. Değerleri girin, ardından **Run to _node label_** düğmesine tıklayın veya **Ctrl+Enter** (macOS'ta Cmd+Enter) tuşlarına basın. Generic body modu, JSON body editörüne odaklanır. Giriş alanı olmayan yollar, panel açılmadan hemen çalışır. Sabitlenmiş Input node'ları, giriş istemeden sabitlenmiş çıktılarını yeniden kullanır.

Panel, sonraki çalıştırmalar için seçili hedefi korur. Hedefi temizlemek için **Run full workflow** seçeneğini seçin. Bir execution etkinken Run düğmeleri devre dışı bırakılır. Bir loop içindeki hedef, o node'a ilk ulaşıldığında çalıştırmayı durdurur; loop'tan sonraki bir node'u seçmek, yukarı akış loop'unun tamamını çalıştırır.

## Bir Düğümde AI

Yapışkan not dışındaki herhangi bir düğümün üzerine gelin ve üzerindeki **AI** düğmesine tıklayın. [AI Assistant](./ai-assistant.md) bu düğüm üzerinde açılır ve **Change this node as ...**, **Fix error in this node ...** ve **Other** seçeneklerini sunar. Agent modunda asistan yalnızca o düğümü değiştirir; diğer düğümler, bağlantılar ve düzen olduğu gibi kalır. Bkz. [AI Assistant › Tek Bir Düğümü Değiştirme](./ai-assistant.md#changing-one-node).

Düğme, yalnızca görüntüleme izniniz olan iş akışlarında gizlidir.

## Data Pin

Data Pin, son çalıştırmadan bir node'un çıktısını sabitlemenize olanak tanır; böylece sabitlenmiş node'u yeniden çalıştırmadan aşağı akış node'larını test edebilirsiniz.

### Nerede Bulunur

- **Properties paneli** – Bir node seçin ve **Pinned Data** bölümüne kaydırın
- **Node badge** – Veri sabitlendiğinde node üzerinde bir pin simgesi görünür

### Eylemler

| Eylem | Açıklama |
|--------|-------------|
| **Pin** | Node'un son execution çıktısını sabitler (bir çalıştırmadan sonra kullanılabilir) |
| **Clear** | Sabitlenmiş veriyi kaldırır |
| **Edit** | Sabitlenmiş JSON'u doğrudan düzenleyin; uygulamak için Save'e tıklayın |

### Test Modu Davranışı

Bir workflow'u test modunda çalıştırırken, `pinnedData` içeren node'lar execution'ı atlar ve bunun yerine sabitlenmiş çıktıyı kullanır. Bunu şunlar için kullanın:

- Harici API'leri çağırmadan aşağı akış mantığını test etme
- Node'un çıktısına başvuran ifadelerde hata ayıklama
- Sabit örnek verilerle prompt'lar veya koşullar üzerinde yineleme yapma

Editördeki ifade tamamlama, mevcut olduğunda alan önermek için sabitlenmiş veriyi kullanır.

## Execution Logs

**Debug paneli** (alt çekmece), workflow çalıştırmaları sırasında gerçek zamanlı execution loglarını gösterir. Ayrıca History diyaloğundan veya bir Board kartından çalışan bir production execution'ını açabilirsiniz. Editör, o çalıştırmanın SSE stream'ine bağlanır, tamamlanan node sonuçlarını geri yükler ve yeni node'lar başlayıp bittikçe node animasyonlarını ve loglarını göstermeye devam eder.

### Neler Gösterir

- **Node sonuçları** – Node başına durum (`success`, `error`, `skipped`, `running`), execution süresi ve çıktı
- **Nihai çıktılar** – [Output](../nodes/output-node.md) node'larından toplanan çıktılar
- **Agent ilerlemesi** – [Agent](../nodes/agent-node.md) node'ları için adım adım tool çağrıları ve akıl yürütme

### Eylemler

- **Copy as JSON** – Tam execution logunu panoya kopyalar
- **Open in JSON editor** – Logu incelemek için JSON Hero veya JSON Editor Online'da açar
- **Download generated files** – Bir skill indirilebilir dosyalar (`_generated_files`) ürettiyse bir Download düğmesi görünür. Tek dosya doğrudan indirilir; birden fazla dosya bir seçim açılır penceresi açar.

### Logs Sekmesinden Farkı

Debug paneli **workflow execution** loglarını (node sonuçları, çıktılar) gösterir. [Logs Sekmesi](../tabs/logs-tab.md) ise **Docker container** loglarını (backend, frontend, database) gösterir. <!-- pragma: allowlist secret -->

## Enable / Disable

Node'ları devre dışı bırakabilirsiniz; böylece execution sırasında atlanırlar. Devre dışı bırakılan node'lar bir "off" badge'i gösterir ve soluk görünür.

### Nasıl Açılıp Kapatılır

| Yöntem | Açıklama |
|--------|-------------|
| **Properties paneli** | Node seçin → Power simgesi (sağ üst) |
| **Context menü** | Node(lar)a sağ tıklayın → Disable veya Enable |
| **Klavye** | Node(lar)ı seçin → **D** tuşuna basın (bkz. [Keyboard Shortcuts](./keyboard-shortcuts.md)) |

### Çoklu Seçim

Birden fazla node seçildiğinde, Enable/Disable hepsine uygulanır. Seçili node'lardan herhangi biri devre dışıysa context menü "Enable", hepsi etkinse "Disable" gösterir.

### Çalışma Zamanı Davranışı

`active: false` olan node'lar atlanır. Aşağı akış node'ları, atlanan node'lardan veri almaz. Bunu, node'ları silmeden geçici olarak hariç tutmak için kullanın.

Bir node'u elle açıp kapatmak yerine bir workflow içinden açıp kapatmak için [Disable Node](../nodes/disable-node.md) ve [Enable Node](../nodes/enable-node.md) kullanın.

## Agent memory graph

**[Kalıcı bellek](./agent-persistent-memory.md)** etkinleştirilmiş [Agent](../nodes/agent-node.md) node'ları, node üzerinde pembe bir **brain** kontrolü gösterir. Bellek grafiği düzenleyicisini açmak için buna tıklayın: entity'ler, entity türüne göre kümelenmiş, animasyonlu, kuvvet yönlendirmeli bir grafik olarak görüntülenir; ilişki eklemek için aranabilir Source/Target seçicileri ve bağlantılı entity'ler arasında geçiş yapmak için bir connections paneli bulunur. Aynı dialog, [agent'lar arası bellek paylaşımı](./agent-persistent-memory.md#sharing-with-other-agents) için **Share memory with other agents** (workflow → agent → read veya read/write) seçeneğini içerir. Dialog açıkken, ana canvas undo/redo ertelenir, böylece grafik düzenleme kendi geçmişini korur.

**Grafiği filtreleme.** Canvas'ın sol üst kısmında bir arama kontrolü bulunur; siz tıklayana veya **Ctrl/Cmd+F** tuşlarına basana kadar bir kısayol düğmesine daraltılmıştır. Bir entity'nin adını, türünü ve her attribute anahtarını ve değerini, ayrıca bir ilişkinin türünü (`parent_of`) ve özelliklerini eşleştirir; eşleşen bir ilişki, her iki entity'sini de beraberinde getirir. Boşlukla ayrılmış tüm terimler eşleşmelidir. Eşleşen bir entity, tüm komşuluğunu beraberinde getirir — katıldığı her ilişki ve her birinin karşı tarafındaki entity — böylece bir eşleşme asla bağlantısız bir nokta olarak kalmaz. Eşleşen bir ilişki, yalnızca birleştirdiği iki entity'yi getirir ve orada durur; çünkü bir ilişki türünü aramak, o ilişki hakkında bir sorudur, uçlarının bağlı olduğu her şey hakkında değil. Diğer her şey — soluklaştırılmak yerine — canvas'ta ve **All edges** listesinde tamamen gizlenir ve bir badge, toplam entity'lerden kaçının kaldığını gösterir. Kutunun içindeki **✕**, önce sorguyu temizler, ardından ikinci basışta kutuyu kapatır. Escape de aynı şekilde, en içten dışa doğru geri sarar: önce sorguyu temizler, sonra arama kutusunu kapatır, ardından genişletilmiş canvas görünümünden çıkar ve yalnızca bunlardan hiçbiri açık değilken dialog'u kapatır. Temizleme, tüm grafiği her entity yerine geri dönmüş halde geri yükler.

**Entity'leri elle yerleştirme.** Bir entity'yi sürüklemek, onu bıraktığınız yere sabitler, böylece auto-layout grafiğin geri kalanını onun etrafında oturtur, onu geri çekmek yerine. Seçili entity'yi sürüklemek, doğrudan bağlı entity'lerini de beraberinde hareket ettirir ve kümenin şeklini korur; başka herhangi bir entity'yi sürüklemek yalnızca onu hareket ettirir. **Tidy layout** (wand düğmesi), sabitlenmiş her entity'yi serbest bırakır ve auto-layout'u yeniden çalıştırır.

## Extract to Sub-Workflow

Seçili node'ları yeniden kullanılabilir bir sub-workflow'a dönüştürün ve bunları bir [Execute](../nodes/execute-node.md) node'u ile değiştirin.

### Nasıl Kullanılır

1. Canvas'ta bir veya daha fazla node seçin
2. Sağ tıklayın → **Extract to Sub-Workflow**
3. Yeni workflow için bir ad (ve isteğe bağlı açıklama) girin
4. **Extract**'e tıklayın

### Ne Olur

- Seçili node'larla yeni bir workflow oluşturulur
- Harici girdiler (seçim dışından gelen edge'ler) sub-workflow'un [Input](../nodes/input-node.md) alanları olur
- Harici çıktılar (seçim dışındaki node'lara giden edge'ler) sub-workflow'un [Output](../nodes/output-node.md) node'una eşlenir
- Seçili node'lar, yeni workflow'u çağıran tek bir [Execute](../nodes/execute-node.md) node'u ile değiştirilir
- Girdi/çıktı eşlemeleri otomatik olarak korunur

### Kullanım Senaryoları

- Bir node dizisini birden fazla workflow'da yeniden kullanın
- İlgili mantığı gruplayarak karmaşık bir workflow'u basitleştirin
- Modüler, test edilebilir sub-workflow'lar oluşturun

## Run with cURL

Düzenleyici araç çubuğundaki (sağ üst) **cURL** düğmesi, workflow'u API üzerinden tetiklemek için bir cURL komutu oluşturup kopyalayabileceğiniz bir dialog açar.

- Workflow'un request body modunu seçin (`Defined` veya `Generic`)
- Kimlik doğrulama türünü ayarlayın (Anonymous, JWT veya Header Auth)
- Response caching ve rate limiting'i yapılandırın
- SSE streaming'i açıp kapatın ve node başına başlangıç mesajlarını özelleştirin
- Request body'yi düzenleyin
- Generic modunda, canvas run paneli cURL dialog'uyla aynı ham JSON body'yi kullanır
- Çalıştırılmaya hazır komutu kopyalamak için **Copy cURL**'e tıklayın

Tam dialog ayrıntıları için [Webhooks](./webhooks.md#run-with-curl-dialog) ve event protokolü için [SSE Streaming](./sse-streaming.md) bölümlerine bakın.

## İlgili

- [Keyboard Shortcuts](./keyboard-shortcuts.md) – Tüm canvas ve düzenleyici kısayolları
- [Agent Persistent Memory](./agent-persistent-memory.md) – Bellek grafiği davranışı ve API
- [Execute Node](../nodes/execute-node.md) – Sub-workflow'ları çağırır
- [Expression DSL](./expression-dsl.md) – Referanslar ve sabitlenmiş veriler
- [Workflow Structure](./workflow-structure.md) – Node ve edge formatı
- [Download & Import](./download-import.md) – Workflow'ları JSON olarak dışa ve içe aktarın
- [Node Types](./node-types.md) – Tüm node türleri
- [Logs Tab](../tabs/logs-tab.md) – Docker container log'ları
- [Execution History](./execution-history.md) – Geçmiş çalıştırmalar
- [Templates](../tabs/templates-tab.md) – Workflow'ları ve node'ları kaydedin ve yeniden kullanın
- [Contextual Showcase](./contextual-showcase.md) – Düzenleyicide bulunan kompakt sayfa kılavuzu

- [Canvas İşbirliği](./canvas-collaboration.md): Live editing on a shared draft with pointers, following, and voice.
