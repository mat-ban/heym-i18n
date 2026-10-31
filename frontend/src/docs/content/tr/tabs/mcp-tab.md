# MCP / A2A Sekmesi

**MCP** sekmesi, Model Context Protocol (MCP) entegrasyonunu yapılandırır, ve diğer ajanların görev devredebileceği [Agent2Agent](https://github.com/google/A2A) (A2A 1.0) sunucuları olarak sunmanıza olanak tanır. MCP, AI istemcilerinin (Claude, ChatGPT, Gemini, Cursor ve MCP uyumlu herhangi bir araç) Heym workflow'larınızı araç olarak çağırmasına olanak tanır.

Heym iki modu destekler: tüm MCP etkin workflow'ları tek bir endpoint altında sunan bir **varsayılan sunucu** ve her mantıksal workflow grubuna kendi özel URL'sini ve API anahtarını veren **adlandırılmış sunucular**.

Her iki mod da iki tür araç sunabilir: tek tek **workflow'lar** ve **Heym chat aracı** — tek bir `heym_chat` aracının arkasındaki tüm [Chat sekmesi](./chat-tab.md) motoru.

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ MCP demosunu izleyin</a></p>

## Varsayılan MCP Sunucusu

Varsayılan sunucu her zaman `{origin}/api/mcp/sse` adresinde kullanılabilir. MCP açık olan tüm workflow'lar burada araç olarak görünür.

### MCP API Anahtarı

- Anahtarlar SHA-256 özetleri olarak saklanır, bu nedenle Heym mevcut bir anahtarı size gösteremez. Sekme, bir anahtarın ayarlı olup olmadığını bildirir, ne olduğunu değil.
- **Generate** / **Regenerate** – Yeni anahtar, oluşturduktan hemen sonra bir kez görüntülenir. O anda kopyalayın; sekmeyi yeniden yüklemek anahtarı kalıcı olarak gizler.
- Claude Desktop, Cursor veya diğer MCP istemcilerini Heym'e bağlarken bu anahtarı kullanın
- Anahtarı mı kaybettiniz? Yeniden oluşturun. Önceki anahtar anında çalışmayı durdurur.

### Bağlantı Yöntemleri

- **API Key** – Programatik bağlantılar için MCP API anahtarını kullanın. Sekme, kullanıma hazır bir JSON yapılandırmasını kopyalayabilir ve tek tıkla Cursor kurulumu için bir **Add to Cursor** düğmesi içerir.
- **Claude** – Sekme, MCP sunucu URL'sini ve Claude için kurulum adımlarını gösterir. OAuth Client ID ve Secret alanlarını boş bırakın; Claude otomatik olarak kaydolur ve Heym OAuth üzerinden kimlik doğrular.
- **ChatGPT** – Sekme, bir ChatGPT uygulaması için MCP sunucu URL'sini ve kurulum adımlarını gösterir. Geliştirici modunu açın, URL ile bir uygulama oluşturun ve OAuth'u seçin; ChatGPT otomatik olarak kaydolur.
- **Gemini** – Sekme, özel bir Gemini uygulaması için MCP sunucu URL'sini ve kurulum adımlarını gösterir: gemini.google.com adresinde **Settings → Connected Apps → Add a custom app** yolunu izleyin, URL'yi yapıştırın ve **Advanced features** bölümünü kapalı bırakın; Gemini otomatik olarak kaydolur ve Heym OAuth üzerinden kimlik doğrulaması yapar. Bağlandıktan sonra Heym, Gemini mobil uygulamasında da çalışır.

### Workflow MCP Açma/Kapama

Her workflow bir MCP aracı olarak sunulabilir:

- **Enable** – Workflow'un araçları, varsayılan sunucuya bağlı tüm istemciler için kullanılabilir hale gelir
- **Disable** – Workflow sunulmaz

Workflow kartları, açıklamayı ve giriş alanı adlarının bir önizlemesini gösterir; böylece etkinleştirmeden önce her aracın ne beklediğini görebilirsiniz.


### Kuyruğa Alınan Çalıştırmalar ve heym_execution_status

[Eşzamanlılık sınırı](../reference/webhooks.md#concurrency-limit-and-queued-runs) olan bir workflow, bir istemci onu çağırdığında meşgul olabilir. Bu durumda çağrı hemen hata olmayan bir sonuçla döner:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "next_step": "Call heym_execution_status with this execution_id every 5-10 seconds until status is success, error, cancelled or expired."
}
```

İstemci, bu `execution_id` ile `heym_execution_status` aracını sorgular. [Durum URL'si](../reference/webhooks.md#status-url) ile aynı gövdeyi döndürür: geçerli konumla `queued`, `running`, ardından çıktılarla `success` veya `error`. Yalnızca aynı sunucunun sunduğu workflow çalıştırmalarını bulur. Araç, yalnızca en az bir workflow'un eşzamanlılık sınırı olduğu sürece varsayılan sunucuda ve adlandırılmış her sunucuda listelenir. Sıra dolduğunda çağrı "Concurrency queue is full" hatası döndürür.
## Heym Ajanı

**Heym Capabilities** bölümü, Chat sekmesi motorunu `heym_chat` adlı tek bir MCP aracına dönüştürür. Bunu varsayılan sunucuda, herhangi bir adlandırılmış sunucuda veya her ikisinde etkinleştirin — her yüzey kendi açma/kapama anahtarını ve model seçimini korur.

Etkinleştirildiğinde, `heym_chat` workflow araçlarınızın yanında `tools/list` içinde görünür. Bir MCP istemcisi tek bir doğal dil mesajı gönderir ve Heym motoru oradan devralır; Chat sekmesinin sahip olduğu aynı yeteneklerle:

- Bir workflow oluşturma, örnek girdilerle test çalıştırması yapma, hataları düzeltme ve bir çalıştırma başarılı olduğunda tamamlama (bkz. [Oluşturma modu](#build-mode))
- Mevcut workflow'larınızı inceleme ve çalıştırma
- Analitikleri, son çalıştırmaları ve yaklaşan cron zamanlamalarını bildirin
- Workflow'ların nerede başarısız olduğunu ve neden yavaş olduğunu açıklar: en çok çalışan, en çok başarısız olan ve en yavaş workflow'lar ile son 1, 3 veya 6 saat, 24 saat, 7 veya 30 gün ya da tüm zamanlar boyunca en çok zaman, hata ve çağrı alan düğüm türleri
- Tek bir workflow'un çalıştırma geçmişini bildirin: kaç kez çalıştığı, durum sayıları, ne zaman çalıştığı ve istendiğinde tek bir çalıştırmanın girişleri, çıktıları ve düğüm başına hataları
- Şu anda nelerin çalıştığını bildirin: kaç yürütmenin etkin olduğu, workflow adları, her birinin ne kadar süredir çalıştığı, her birinin şu anda hangi düğümde olduğu ve canlı çalıştırmaya bir bağlantı
- [Board sekmesinde](./board-tab.md) board'ları listeleyin, kartlar oluşturun ve kart ayrıntılarını okuyun
- Dashboard'larınızı (Heym Work sayfaları) ve widget'larını listeler, bir workflow'un hangi dashboard'da olduğunu bulur, yeni bir widget ekleyip workflow'unu oluşturur, mevcut bir workflow'u widget olarak yerleştirir, widget'ları yeniden adlandırır veya siler ya da düzeni toparlar (bkz. [Dashboard › Chat ve MCP Üzerinden](./dashboard-tab.md#from-chat-and-mcp))
- Veri tablolarını ve satırlarını inceler, tablolar oluşturur, sütunlar ekler veya kaldırır, satırlar ekler, günceller veya siler ve tabloları workflow'lara bağlar
- Prompt ve ajan değerlendirme paketlerini ([Eval suites](./evals-tab.md#from-chat-and-mcp)) oluşturur, düzenler ve çalıştırır; buna bir ajanın temel çizgisi de dahildir: raporlanan, çalıştırmalardan oluşturulan veya sayılarla belirtilen. Sonuç, kaydedilen her paketin Evals bağlantısını listeler.
- Heym'in kendi sayfasında kimlik bilgilerinizi oluşturun veya güncelleyin (bkz. [Kimlik Bilgileri](#kimlik-bilgileri))
- Ekipleri ve global değişkenleri okuyun ve dokümantasyonda arama yapın
- Bekleyen human-in-the-loop incelemelerini onaylayın, düzenleyin veya reddedin

Chat sekmesine sonradan eklenen yetenekler otomatik olarak `heym_chat` üzerinden kullanılabilir hale gelir — senkronize tutulacak yetenek başına bir açma/kapama anahtarı yoktur.

Bu yetenekler `heym_chat` içinde çalışır: `tools/list` `heym_chat`'i ve workflow araçlarınızı gösterir, değerlendirme paketlerininkiler gibi dahili sohbet araçlarını asla göstermez.

### Oluşturma modu

`heym_chat`, Chat motorunu her zaman oluşturma modunda (build mode) çalıştırır. Tek bir çağrıda asistan yeni bir workflow kaydedebilir, gerçekçi örnek girdilerle çalıştırabilir, çalıştırma raporunu okuyabilir, başarısız olan kısımları düzeltebilir ve çağrı başına en fazla beş test çalıştırmasına kadar yeniden çalıştırabilir. Son kaydın son çalıştırması başarılı olduğunda, tek cümlelik bir özetle tamamlanır ve yanıt `Verified: the latest test run of the saved workflow passed.` ifadesiyle biter.

Bir çağrı bir workflow oluşturduğunda veya düzenlediğinde yanıt, her birini `https://heym.example.com/workflows/<id>` gibi tam düzenleyici bağlantısıyla listeler ve asistanın cevabındaki bağlantılar da tam bağlantılardır. Yapılandırılmış Heym adresinizi (`FRONTEND_URL`) kullanırlar ve Heym'de oturum açmış ve o workflow'a erişebilen kişiler için açılırlar.

- Test çalıştırmaları gerçek çalıştırmalardır. Yan etkileri gerçekleşir ve diğer tüm çalıştırmalar gibi workflow'un çalıştırma geçmişinde görünürler.
- Kayıtlar düzenleyicinin yolunu izler: grafikte yapılan bir değişiklik, önceki grafiği workflow'un **Edit History** geçmişinde tutar.
- Daha önce oluşturduğu bir workflow'u değiştirmek için aynı `conversation_id` ile ileti dizisine devam edin. Asistan yeni bir tane oluşturmak yerine o workflow'u günceller ve yalnızca düzenleyebileceğiniz workflow'ları değiştirir.
- Beş test çalıştırması tükendiğinde asistan durur ve neyin hâlâ başarısız olduğunu açıklar.

Veri tabloları farklıdır. Bir tablo hiçbir sır barındırmaz, bu nedenle `heym_chat` tablolarınızı listeleyebilir, bir workflow'un hangisini kullanması gerektiğini sorabilir ve sütunlarıyla yeni bir tablo oluşturabilir. Satırları asla okumaz veya yazmaz.

### Kimlik Bilgileri

`heym_chat`, sahip olduğunuz ve sizinle paylaşılan kimlik bilgilerini ada ve türe göre Chat sekmesiyle aynı şekilde görür. Oluşturduğu bir workflow kimlik bilgisine ihtiyaç duyduğunda, sonuçta bir soru olarak hangisinin kullanılacağını sorar. Aynı `conversation_id` ile yanıtlayın.

Bir kimlik bilgisi eklemek veya sahip olduğunuz bir kimlik bilgisini güncellemek için asistan, `/credentials/setup/<id>` adresindeki bir Heym sayfasında Heym'in kimlik bilgisi formunu açar. Orada Heym'de oturum açar, anahtarı girer veya hesabı bağlar ve kaydet'e basarsınız. Değer doğrudan Heym'e gider: MCP istemcisi ve modeli yalnızca kimlik bilgisinin adını ve türünü öğrenir. Anahtarları MCP istemcisine yapıştırmayın; bunun yerine formu isteyin.

| İstemci | Ne olur |
|---------|---------|
| MCP URL alımını destekler | İstemci sizden Heym sayfasını açmanızı ister. Çağrı formu doldururken on dakikaya kadar bekler, ardından yeni kimlik bilgisiyle devam eder. |
| Diğer her şey | Sonuç bağlantıyı taşır ve istemciden `heym_chat`'i `wait_for_credential_form` ile tekrar aramasını ister. Bu çağrı formu doldururken beş dakikaya kadar bekler, ardından sohbete devam eder. İstemci beklemezse formu kaydedin ve aynı `conversation_id` ile yanıtlayın; sonraki çağrı formun kaydedildiğini ve hangi kimlik bilgisini oluşturduğunu bilir. |

Sayfa yalnızca isteği başlatan Heym hesabı için açılır, bu nedenle yönlendirilen bir bağlantı başkası için işe yaramaz. Bir form 24 saat açık kalır ve sayfadan reddedebilirsiniz. Kaydettikten veya reddettikten sonra Chat sekmesi görüşmesindeki adım sonucu gösterir.


### Kimlik bilgisi ve model

`heym_chat` motoru Heym hesabınızda çalıştırır, bu nedenle kendine ait bir LLM kimlik bilgisine ihtiyaç duyar:

| Alan | Davranış |
|-------|----------|
| **Credential** | Erişebildiğiniz herhangi bir OpenAI, Google veya Custom kimlik bilgisini seçin. Bir tane seçmediyseniz [Settings](../reference/user-settings.md) içindeki tercih edilen kimlik bilgisinden önceden doldurulur. |
| **Model** | Seçili kimlik bilgisinden yüklenir. Kimlik bilgisi eşleştiğinde tercih ettiğiniz modelden önceden doldurulur. |

Herhangi biri eksikse, araç yine de `tools/list` içinde görünür ancak her çağrı, kurulumu bu sekmede tamamlamanızı söyleyen bir hata döndürür.


`heym_chat`'in oluşturduğu bir workflow'daki LLM ve Agent düğümleri, sizinle paylaşılan bir kimlik bilgisi de dahil olmak üzere bu kimlik bilgisi ve model üzerinde çalışır, böylece test çalıştırmaları başka bir kurulum adımı olmadan gerçekleşir. `heym_chat` bir workflow'u düzenlediğinde, zaten bir kimlik bilgisine sahip olan LLM ve Agent düğümleri, modelleriyle birlikte bunu korur.
### Argümanlar ve geçmiş

| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `message` | Evet | Doğal dilde talimat veya soru. |
| `conversation_id` | Hayır | O konuşma dizisini sürdürmek için önceki bir `heym_chat` sonucundan alınan bir `conversation_id`. |
| `wait_for_credential_form` | Hayır | `conversation_id` ile: kullanıcının ileti dizisinin açtığı kimlik bilgisi formunu kaydetmesini veya reddetmesini bekleyin, ardından `message` gönderin. |

Her çağrı, [Chat sekmesi](./chat-tab.md) geçmişinize normal bir konuşma olarak yazılır ve konuşma listesinde bir fiş simgesiyle işaretlenir. Mesajlar, araç kartları ve netleştirme duraklamaları, kendi başlattığınız bir konuşmayla tamamen aynı görünür ve konuşma dizisini açıp tarayıcıda konuşmaya devam edebilirsiniz. Her sonuç kendi `conversation_id` değerini döndürür, böylece MCP istemcisi her çağrıda yeni bir tane açmak yerine aynı konuşma dizisini sürdürebilir.

Asistanın netleştirmeye ihtiyacı olduğunda duraklar ve bunu söyler; aynı `conversation_id` ile yanıtları gönderin.

### A2A'yı Etkinleştir

Heym Ajanı açıkken kartta **A2A'yı Etkinleştir** onay kutusu gösterilir. Bunu işaretlediğinizde diğer ajanlar Agent2Agent protokolü (A2A 1.0) üzerinden Heym Ajanına görevler gönderebilir. Kart daha sonra **Agent Card** URL'sini ve **JSON-RPC endpoint**'ini (her biri bir kopyalama düğmesiyle) ve kartı alan bir `curl` komutunu listeler. A2A, MCP ile aynı anahtarı ve OAuth oturum açmasını kullanır. Ajanın kapatılması A2A'yı da kapatır. Yöntemler, görev durumları ve bir örnek için [A2A](../reference/a2a.md) sayfasına bakın.

### İlerleme

Uzun süren bir `heym_chat` çağrısı, ajanın ne yaptığını Chat sekmesinin gösterdiği ifadelerle bir MCP ilerlemesi (`notifications/progress`) olarak bildirir; örneğin `Workflow test ediliyor · 2/5 deneme`. İlerleme bildiriminde zaman aşımını sıfırlayan istemciler, ajan çalışırken beklemeye devam eder.

## Adlandırılmış MCP Sunucuları

Adlandırılmış sunucular, workflow'larınızı yalıtılmış MCP endpoint'lerine bölmenizi sağlar. Her sunucunun kendi URL'si ve API key'i vardır; böylece farklı AI istemcileri, ekipler veya kullanım senaryoları tam olarak ihtiyaç duydukları workflow'lara bağlanabilir.

### Adlandırılmış Sunucu Oluşturma

1. MCP sekmesinin altındaki giriş alanına bir ad yazın (örn. **CRM Tools**)
2. **Create** düğmesine tıklayın — hemen yeni bir sunucu kartı görünür
3. Kartı genişletmek için üzerine tıklayın

### Sunucu Bazlı Ayarlar

Her sunucu kartı şunları gösterir:

| Ayar | Açıklama |
|---------|-------------|
| **SSE Endpoint** | Benzersiz URL: `{origin}/api/mcp/servers/{uuid}/sse` |
| **API Key** | Bağımsız key; oluşturulduğunda veya yeniden oluşturulduğunda bir kez gösterilir. Hemen kopyalayın; hash'lenmiş olarak saklanır ve sonradan görüntülenemez |
| **How to connect** | **Copy JSON** kullanıma hazır MCP config'ini kopyalar; **Add to Cursor** tek tıklamayla kurar |
| **Heym Capabilities** | Bu sunucu için Heym Ajanını (`heym_chat`) açıp kapatın ve credential ile modelini seçin |
| **A2A'yı Etkinleştir** | `{origin}/api/a2a/servers/{uuid}/agent-card.json` adresindeki kendi Agent Card'ı ile bu sunucunun kendi A2A anahtarı |
| **A2A'yı Etkinleştir** | `{origin}/api/a2a/servers/{uuid}/agent-card.json` adresindeki kendi Agent Card'ı ile bu sunucunun kendi A2A anahtarı |
| **Assigned Workflows** | Bu sunucunun hangi workflow'larınızı sunduğunu açıp kapatın |

### Workflow Ataması

Workflow ataması sunucu bazlıdır ve varsayılan sunucu anahtarından bağımsızdır. Bir workflow hem varsayılan sunucuda hem de birden fazla adlandırılmış sunucuda aynı anda etkinleştirilebilir veya hiçbirinde etkinleştirilmeyebilir.

Bir workflow'u açıp kapatmak, onu atananlar listesinin en üstüne taşır; böylece yeni değiştirdiğiniz satır gözden kaybolmak yerine görünür kalır.

### Kimlik Doğrulama

Adlandırılmış sunucular, varsayılan sunucuyla aynı kimlik doğrulama yöntemlerini destekler:

- **X-MCP-Key header** – Sunucunun API key'ini doğrudan iletin (API istemcileri, Cursor). Yalnızca header: key'ler `?key=` query parametresi olarak kabul edilmez, çünkü URL'ler erişim log'larına, proxy log'larına ve tarayıcı geçmişine düşer.
- **Claude, ChatGPT ve Gemini OAuth** – Sunucu URL'sini istemcinin bağlayıcılarına veya özel uygulamalarına ekleyin; credential alanlarını boş bırakın ve istemci otomatik olarak OAuth üzerinden kaydolur. Bearer token `?token=` olarak değil, `Authorization` header'ında iletilmelidir.
- **Session token** – SSE handshake sırasında verilir; belirli sunucuya kapsamlandırılmıştır, böylece bir adlandırılmış sunucudan gelen token'lar başka bir sunucuya erişemez. Bu kısa ömürlü `?session=` parametresi etkilenmez.

### Adlandırılmış Sunucu Silme

Bir sunucu kartı başlığındaki **X** simgesine tıklayın. Silme işlemi sunucuyu ve tüm workflow atamalarını kaldırır; workflow'ların kendisi etkilenmez.

## SSE Endpoint

| Sunucu | Endpoint |
|--------|----------|
| Varsayılan | `{origin}/api/mcp/sse` |
| Adlandırılmış | `{origin}/api/mcp/servers/{server-uuid}/sse` |

Her iki endpoint de SSE transport (GET, MCP spec 2024-11-05) ve Streamable HTTP transport (POST, MCP spec 2025-03-26) destekler. Claude, ChatGPT ve Gemini, her ikisinde de güvenli oturum açma için OAuth 2.1 / PKCE kullanır.

## İlgili

- [Why Heym](../getting-started/why-heym.md) – Heym'de birinci sınıf bir yapı taşı olarak MCP
- [Agent Node](../nodes/agent-node.md) – MCP aracı desteğine sahip Agent node
- [Agent Architecture](../reference/agent-architecture.md) – MCP istemcisi, araç dağıtımı, orkestratör
- [Triggers](../reference/triggers.md) – Bir workflow giriş noktası olarak MCP
- [Chat Tab](./chat-tab.md) – `heym_chat` aracının arkasındaki motor
- [Workflows Tab](./workflows-tab.md) – Workflow'ları oluşturun ve yönetin
- [Node Types](../reference/node-types.md) – AI node'larına genel bakış
- [Contextual Showcase](../reference/contextual-showcase.md) – Dashboard yüzeyleri için kompakt sayfa kılavuzu