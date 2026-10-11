# Chat Sekmesi

**Chat** sekmesi, doğrudan bir LLM sohbet arayüzü sunar. Modelleri test etmek, sorular sormak, mevcut workflow'ları çalıştırmak veya doğal dilde bir istekten yeni bir workflow oluşturmak için kullanın.

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Chat demosunu izleyin</a></p>

## Kurulum

1. Bir [credential](./credentials-tab.md) seçin (OpenAI, Google vb. için API key)
2. Açılır menüden bir model seçin (modeller seçilen credential'dan yüklenir)
3. Mesaj göndermek için yazmaya başlayın

[Workflows sekmesindeki](./workflows-tab.md) chat kutusundan da bir sohbet başlatabilirsiniz. İlk mesajınızı gönderir ve yanıt hâlihazırda akış hâlindeyken yeni sohbeti burada açar.

## Özellikler

- **Global variables bağlamı** – [Global Variables](../reference/global-variables.md) LLM tarafından kullanılabilir, böylece depolanan değerler hakkında soru sorabilir veya bunlara başvurabilirsiniz
- **Workspace template bağlamı** – Workspace'inizdeki paylaşılan workflow ve node template'leri bağlam olarak dahil edilir, böylece Chat mevcut template'ler hakkındaki soruları yanıtlayabilir
- **Uzun süreli agent** – Tarayıcı kapansa bile Chat arka planda çalışmaya devam eder, böylece başka bir cihazdan geri dönüp aynı sohbete devam edebilirsiniz
- **Workflow oluşturma** – Chat'ten bir workflow oluşturmasını veya kurmasını isteyin; editör asistanıyla aynı Workflow AI Builder motorunu kullanarak workflow'u üretir ve kaydeder
- **Kanban görev oluşturma** – Doğal bir dille bir görev eklemesini veya kart oluşturmasını isteyin. Chat, bunu istenen board'un ilk sütununa ekler; birden fazla board'unuz olduğunda ve birini belirtmediğinizde, kartı oluşturmadan önce bir board seçici sunar
- **Kuyruğa alınan takip mesajları** – Bir yanıt akış hâlindeyken daha fazla mesaj gönderin. Kuyruğa alınan mesajlar kalıcıdır, başlamadan önce düzenlenebilir veya silinebilir ve etkin yanıttan sonra sırayla çalışır
- **Planlama duraklamaları** – Chat'in planlama ayrıntılarına ihtiyacı olduğunda, açıklayıcı sorular sorar ve siz yanıtlayana kadar kuyruğa alınan takip mesajlarını duraklatır. Planlama yanıtı tamamlandıktan sonra kuyruğa alınan mesajlar devam eder
- **Credentials** – Chat'in oluşturduğu veya düzenlediği bir workflow bir credential gerektirdiğinde, Chat hangisinin kullanılacağını sorar, sohbet içinde yeni bir tane oluşturmayı önerir veya credentialsız devam etmenize izin verir. Ayrıca Chat'ten bir credential oluşturmasını veya sahip olduğunuz birini güncellemesini isteyebilirsiniz; credential formunu sohbet içinde açar. Model, credential'ın adını ve türünü görür, değerlerini asla görmez. Bkz. [AI Assistant › Credentials](../reference/ai-assistant.md#credentials)
- **Data tables** – Chat'in oluşturduğu veya düzenlediği bir workflow kayıtları depoladığında, Chat hangi [data table](./datatable-tab.md)'ın kullanılacağını sorar veya workflow'un ihtiyaç duyduğu sütunlarla bir tane oluşturmayı önerir. Ayrıca tablolarınızı ve sütunlarını listeleyebilir. Satırları asla okumaz veya yazmaz. Bkz. [AI Assistant › Data tables](../reference/ai-assistant.md#data-tables)
- **Streaming yanıtlar** – Modelin çıktısını akış hâlinde görün
- **Yanıtı durdur** – Geçerli streaming yanıtını istediğiniz zaman kesintiye uğratın; durdurmak o sohbete ait kuyruğa alınan mesajları da temizler
- **Markdown oluşturma** – Yanıtlar, satır içi görseller dahil olmak üzere markdown biçimlendirmesini destekler
- **Görsel gösterimi** – Yanıtlara gömülü görseller (örn. LLM görsel üretiminden) satır içinde görünür; herhangi bir görsele tıklayarak tam ekranda görüntüleyin. Tam ekran görünümünü kapatmak için **Esc** tuşuna veya (mobilde) geri düğmesine basın
- **Mesajları kopyala** – Herhangi bir mesajı panoya kopyalayın
- **Sohbeti temizle** – Yeni bir sohbet başlatın
- **Sesli giriş** – Konuşmadan metne dönüştürme için mikrofon düğmesini kullanın (tarayıcı destekli). Kayıt durduğunda, Heym göndermeden önce transkripti hafifçe temizleyebilir
- **Zamanlanmış workflow'lar** – Cron workflow'larının ne zaman çalıştığını sorun (bugün, bu hafta, bu ay veya özel bir tarih aralığı). Asistan, [Scheduled](./scheduled-tab.md) sekmesiyle aynı zamanlama verilerini kullanır ve sonuçları sahip olduğunuz workflow'larla sınırlayabilir veya sizinle paylaşılanları dahil edebilir
- **Workflow çalıştırma geçmişi** – Tek bir workflow hakkında sorun ("günlük rapor kaç kez çalıştı?", "başarısız oldu mu?", "en son ne zaman çalıştı?"). Chat, workflow'u ID'siyle bulur ve çalıştırma sayısı, durum dağılımı, ilk ve son çalıştırma zamanı ve ortalama süresinden yanıt verir. Bir çalıştırmanın neden başarısız olduğunu veya ne döndürdüğünü sorun; Chat ardından girdilerini, çıktılarını ve node başına hatalarını okumak için o tek çalıştırmayı açar
- **Canlı çalıştırma durumu** – Şu anda neyin çalıştığını sorun; Chat sayı, workflow adları, her çalıştırmanın ne kadar süredir devam ettiği, hangi node'da olduğu ve doğrudan canlı çalıştırmaya bir bağlantı ile yanıt verir

## Bir MCP İstemcisinden Chat Kullanma

Chat motoruna tarayıcı dışından da erişilebilir. [MCP sekmesinde](./mcp-tab.md) **Heym Chat Tool**'u etkinleştirin; Claude, Cursor ve MCP konuşan diğer tüm MCP istemcileri, bu aynı motoru tüm yetenekleriyle çalıştıran tek bir `heym_chat` aracına kavuşur.

Bu konuşmalar, bu sekmenin geçmişine düşer ve konuşma listesinde fiş simgesiyle işaretlenir. Birini açarak istemcinin ne sorduğunu okuyabilir, tetiklediği araç kartlarını görebilir ve konuşmayı kendiniz sürdürebilirsiniz. Bir netleştirme sorusunu yanıtlamak, tur buradan ya da bir MCP istemcisinden başlamış olsun, aynı şekilde çalışır.

MCP üzerinden Chat, kimlik bilgilerini listelemez, seçmez veya oluşturmaz. Oluşturduğu Workflow'lar kimlik bilgisi alanlarını boş bırakır ve yanıt, bir kimlik bilgisi gerektiren node'ları adlandırır; böylece bunları editörde ayarlayabilirsiniz.

Veri tabloları MCP üzerinden de çalışır: Chat tablolarınızı listeler, yenilerini oluşturur ve oluşturduğu Workflow'lara bağlar. Tablo sorusu, sonuçta metin olarak gelir; bu yüzden aynı `conversation_id` ile yanıtlayın.

## Bağlam Sınırı

Chat, bağlamda en fazla 25 son mesajı tutar. Daha eski mesajlar, model sınırları içinde kalmak için kırpılır.

## Workflow Oluşturma

Chat'ten bir Workflow oluşturmasını, kurmasını, üretmesini veya hazırlamasını istediğinizde, oluşturulmuş bir ad ve açıklamayla yeni bir kayıtlı Workflow oluşturur. Yanıt; üretilen node'ların ve edge'lerin salt okunur bir canvas önizlemesini ve Workflow editörünü yeni bir tarayıcı sekmesinde açan bir **Open workflow** bağlantısını içerir. Workflow'u çalıştırmak istediğinizde önizleme kartının **Run** düğmesini kullanın.

Aynı sohbetteki takip geri bildirimi, başka bir Workflow oluşturmak yerine o Workflow'u düzenler. Örneğin, Chat bir Workflow oluşturduktan sonra "add an approval step", "change the output format" veya "şöyle yap" diyebilirsiniz; Chat kayıtlı Workflow'u günceller ve önizlemeyi yeniler.

Bu, işin tek seferlik bir yanıt olarak değil, yeniden kullanılabilir bir otomasyon olarak yapılmasını istediğiniz istekler için en uygunudur.

## Kanban Görevleri Oluşturma

Chat'ten sıradan bir dille isteyin; örneğin, "Add a task called Fix login bug" veya
"Create a new card Update documentation on the Launch board." Aynı istekte bir
açıklama da ekleyebilirsiniz. Chat, kartı her zaman seçili board'un
ilk sütununda oluşturur.

Çalışma alanınızda birkaç board varsa ve birini belirtmezseniz, Chat tek seçenekli bir
board seçiciyle duraklar. Kartı oluşturmayı tamamlamak için bir board seçin. Herhangi bir slash komutu
veya özel mesaj biçimi gerekmez.

## Neyin Çalıştığını Sorma

Sıradan bir dille sorun — "what is running?", "how many workflows are active right now?",
"which node is the nightly report on?" — ve Chat canlı tabloyu bildirir:

- **Kaç** yürütmenin sürdüğünü, çalışan ve insan incelemesi bekleyen olarak ayrılmış şekilde
- **Hangi Workflow'lara** ait olduklarını, adlarıyla
- **Her çalışmanın** ne kadar sürdüğünü (örneğin `1m 35s`, `3h 25m`)
- **Hangi node'un** şu anda yürütüldüğünü, canvas etiketiyle, artı tamamlanan son node'u
- **Her canlı çalışmaya** bir bağlantıyı; bu bağlantı, o yürütmeyi yeniden oynatarak canvas'ı açar

Bir [Human-in-the-Loop](../reference/human-in-the-loop.md) veya Codex incelemesi için duraklatılan çalışmalar, çalışıyor olarak değil, sizi bekliyor olarak bildirilir. Bu, başlıktaki aktif çalışmalar rozetiyle aynı veridir; dolayısıyla Chat ile rozet asla çelişmez. Zaten tamamlanmış çalışmalar için bunun yerine son yürütmeleri isteyin — bu, [Execution History](../reference/execution-history.md) okur.

## Uyarıları Sorma

Chat, tanımladığınız [uyarılar](./alerts-tab.md) hakkındaki soruları yanıtlayabilir:

- **Nelerin var olduğunu** — "what alerts do I have?", "is there an alert on the invoice workflow?",
  "which alerts are firing right now?"
- **Birinin nasıl kurulduğunu** — "what is the threshold on the cost alert?", "how is that configured?"
- **Neden ve ne zaman tetiklendiğini** — "why did the cost alert fire?", "when did this last trigger?"

Bir "neden tetiklendi" sorusu için Chat, tetiklenme kaydını okur ve gerçekte gözlemlenen
değeri, eşiği ve değerlendirilen tam pencereyi, artı katkıda bulunan ayrıntıyı aktarır:
hata uyarıları için başarısız yürütme id'leri ve hata mesajları, maliyet uyarıları için model başına harcama veya
yürütme sayısı uyarıları için trigger kaynağı dağılımı. Pencereyi yeniden hesaplamak yerine uyarı
tetiklendiğinde neyin doğru olduğunu bildirir; çünkü pencere geçmiştir ve yeni bir hesaplama
farklı bir sonuç verebilir.

## Kullanıcı Kuralları

(Ayarlar'da yapılandırılan) [Kullanıcı Kuralları](../reference/user-settings.md), her Chat konuşmasına sistem düzeyinde talimatlar olarak otomatik olarak enjekte edilir. Bunları bir kez ayarlayarak tüm chat isteklerine kalıcı tercihler uygulayın.

## İlgili

- [MCP Sekmesi](./mcp-tab.md) – Bu motoru MCP istemcilerine `heym_chat` aracı olarak sunun
- [Ayarlar](../reference/user-settings.md) – Tüm sohbet isteklerine uygulanan Kullanıcı Kurallarını belirleyin
- [Kimlik Bilgileri Sekmesi](./credentials-tab.md) – API anahtarlarını ekleyin ve yönetin
- [Değişkenler Sekmesi](./global-variables-tab.md) – Sohbet için kullanılabilir global değişkenler
- [Düğüm Türleri](../reference/node-types.md) – Workflow'lar için LLM ve Agent düğümleri
- [Agent Düğümü](../nodes/agent-node.md) – Araç çağırma özellikli AI Agent
- [AI Asistanı](../reference/ai-assistant.md) – Aynı workflow builder DSL'i ile desteklenen düzenleyici asistanı
- [Yürütme Geçmişi](../reference/execution-history.md) – Geçmiş çalıştırmaları görüntüleyin (başlıktaki History düğmesi)
- [Zamanlanmış Sekmesi](./scheduled-tab.md) – Yaklaşan cron çalıştırmalarının takvimi (Sohbet'in özetleyebileceği aynı veriler)
- [Uyarılar Sekmesi](./alerts-tab.md) – Sohbet'in listeleyip açıklayabileceği eşik uyarıları
- [Bağlamsal Tanıtım](../reference/contextual-showcase.md) – Bu sayfa için kompakt uygulama içi yönlendirme
- [Sohbet Sesi (TTS ve STT)](../reference/chat-voice.md) – Mesajları sesli okuyun ve ElevenLabs ile eller serbest konuşun

## Araç çağrıları ve bağlam boyutu

Asistan bir aracı her çağırdığında (bir workflow çalıştırma, yürütmeleri listeleme, yeni bir workflow oluşturma), konuşmada daraltılabilir bir kart görünür. Araç çalışırken kart otomatik olarak genişler ve tam argümanları gösterir. Araç tamamlandığında kart, geçen süreyi içeren tek satırlık bir özete daralır. Argümanları ve yanıt özetini yeniden genişletmek için herhangi bir karta tıklayın.

Giriş alanının altındaki küçük halka rozeti, geçerli bağlam kullanımını modelin penceresinin yüzdesi olarak gösterir (örn. `12% · ~9.2k`). Ayrıntılı bir dökümü görmek için rozetin üzerine gelin: sistem prompt'u, AGENTS.md, workflows bloğu, kullanıcı kuralları, geçmiş ve taslak girişiniz. Kullanım %80'i geçtiğinde halka amber rengine döner; %95'te kırmızıya döner.

Kullanım sınıra yaklaşırsa, Heym agent düğümlerinin kullandığı aynı mekanizmayı kullanarak eski mesajları kısa bir özete otomatik olarak sıkıştırır. Ne olduğunu göstermek için satır içi bir "Bağlam sıkıştırıldı" kartı görünür.
