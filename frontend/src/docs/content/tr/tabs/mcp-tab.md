# MCP Sekmesi

**MCP** sekmesi, Model Context Protocol (MCP) entegrasyonunu yapılandırır. MCP, AI istemcilerinin (Claude, Cursor ve MCP uyumlu herhangi bir araç) Heym workflow'larınızı araç olarak çağırmasına olanak tanır.

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

### Workflow MCP Açma/Kapama

Her workflow bir MCP aracı olarak sunulabilir:

- **Enable** – Workflow'un araçları, varsayılan sunucuya bağlı tüm istemciler için kullanılabilir hale gelir
- **Disable** – Workflow sunulmaz

Workflow kartları, açıklamayı ve giriş alanı adlarının bir önizlemesini gösterir; böylece etkinleştirmeden önce her aracın ne beklediğini görebilirsiniz.

## Heym Chat Aracı

**Heym Capabilities** bölümü, Chat sekmesi motorunu `heym_chat` adlı tek bir MCP aracına dönüştürür. Bunu varsayılan sunucuda, herhangi bir adlandırılmış sunucuda veya her ikisinde etkinleştirin — her yüzey kendi açma/kapama anahtarını ve model seçimini korur.

Etkinleştirildiğinde, `heym_chat` workflow araçlarınızın yanında `tools/list` içinde görünür. Bir MCP istemcisi tek bir doğal dil mesajı gönderir ve Heym motoru oradan devralır; Chat sekmesinin sahip olduğu aynı yeteneklerle:

- Workflow AI Builder aracılığıyla workflow'lar oluşturun, düzenleyin, inceleyin ve çalıştırın
- Analitikleri, son çalıştırmaları ve yaklaşan cron zamanlamalarını bildirin
- Tek bir workflow'un çalıştırma geçmişini bildirin: kaç kez çalıştığı, durum sayıları, ne zaman çalıştığı ve istendiğinde tek bir çalıştırmanın girişleri, çıktıları ve düğüm başına hataları
- Şu anda nelerin çalıştığını bildirin: kaç yürütmenin etkin olduğu, workflow adları, her birinin ne kadar süredir çalıştığı, her birinin şu anda hangi düğümde olduğu ve canlı çalıştırmaya bir bağlantı
- [Board sekmesinde](./board-tab.md) board'ları listeleyin, kartlar oluşturun ve kart ayrıntılarını okuyun
- Veri tablolarınızı sütunlarıyla birlikte listeleyin, yenilerini oluşturun ve oluşturduğu workflow'lara bağlayın
- Ekipleri ve global değişkenleri okuyun ve dokümantasyonda arama yapın
- Bekleyen human-in-the-loop incelemelerini onaylayın, düzenleyin veya reddedin

Chat sekmesine sonradan eklenen yetenekler otomatik olarak `heym_chat` üzerinden kullanılabilir hale gelir — senkronize tutulacak yetenek başına bir açma/kapama anahtarı yoktur.

Kimlik bilgileri arayüzde kalır: `heym_chat` bunları asla listelemez, seçmez veya oluşturmaz. Bir workflow oluşturduğunda veya düzenlediğinde, kimlik bilgisi gerektiren yeni düğümler boş bırakılır ve yanıt bunları adlandırır, böylece bunları düzenleyicide ayarlayabilirsiniz.

Veri tabloları farklıdır. Bir tablo hiçbir sır barındırmaz, bu nedenle `heym_chat` tablolarınızı listeleyebilir, bir workflow'un hangisini kullanması gerektiğini sorabilir ve sütunlarıyla yeni bir tablo oluşturabilir. Satırları asla okumaz veya yazmaz.

### Kimlik bilgisi ve model

`heym_chat` motoru Heym hesabınızda çalıştırır, bu nedenle kendine ait bir LLM kimlik bilgisine ihtiyaç duyar:

| Alan | Davranış |
|-------|----------|
| **Credential** | Erişebildiğiniz herhangi bir OpenAI, Google veya Custom kimlik bilgisini seçin. Bir tane seçmediyseniz [Settings](../reference/user-settings.md) içindeki tercih edilen kimlik bilgisinden önceden doldurulur. |
| **Model** | Seçili kimlik bilgisinden yüklenir. Kimlik bilgisi eşleştiğinde tercih ettiğiniz modelden önceden doldurulur. |

Herhangi biri eksikse, araç yine de `tools/list` içinde görünür ancak her çağrı, kurulumu bu sekmede tamamlamanızı söyleyen bir hata döndürür.

### Argümanlar ve geçmiş

| Argüman | Gerekli | Açıklama |
|----------|----------|-------------|
| `message` | Evet | Doğal dilde talimat veya soru. |
| `conversation_id` | Hayır | O konuşma dizisini sürdürmek için önceki bir `heym_chat` sonucundan alınan bir `conversation_id`. |

Her çağrı, [Chat sekmesi](./chat-tab.md) geçmişinize normal bir konuşma olarak yazılır ve konuşma listesinde bir fiş simgesiyle işaretlenir. Mesajlar, araç kartları ve netleştirme duraklamaları, kendi başlattığınız bir konuşmayla tamamen aynı görünür ve konuşma dizisini açıp tarayıcıda konuşmaya devam edebilirsiniz. Her sonuç kendi `conversation_id` değerini döndürür, böylece MCP istemcisi her çağrıda yeni bir tane açmak yerine aynı konuşma dizisini sürdürebilir.

Asistanın netleştirmeye ihtiyacı olduğunda duraklar ve bunu söyler; aynı `conversation_id` ile yanıtları gönderin.

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
| **Heym Capabilities** | Bu sunucu için `heym_chat` aracını açıp kapatın ve credential ile modelini seçin |
| **Assigned Workflows** | Bu sunucunun hangi workflow'larınızı sunduğunu açıp kapatın |

### Workflow Ataması

Workflow ataması sunucu bazlıdır ve varsayılan sunucu anahtarından bağımsızdır. Bir workflow hem varsayılan sunucuda hem de birden fazla adlandırılmış sunucuda aynı anda etkinleştirilebilir veya hiçbirinde etkinleştirilmeyebilir.

Bir workflow'u açıp kapatmak, onu atananlar listesinin en üstüne taşır; böylece yeni değiştirdiğiniz satır gözden kaybolmak yerine görünür kalır.

### Kimlik Doğrulama

Adlandırılmış sunucular, varsayılan sunucuyla aynı kimlik doğrulama yöntemlerini destekler:

- **X-MCP-Key header** – Sunucunun API key'ini doğrudan iletin (API istemcileri, Cursor). Yalnızca header: key'ler `?key=` query parametresi olarak kabul edilmez, çünkü URL'ler erişim log'larına, proxy log'larına ve tarayıcı geçmişine düşer.
- **Claude OAuth** – Sunucu URL'sini Claude entegrasyonlarına ekleyin; credential alanlarını boş bırakın ve Claude otomatik olarak OAuth üzerinden kaydolur. Bearer token `?token=` olarak değil, `Authorization` header'ında iletilmelidir.
- **Session token** – SSE handshake sırasında verilir; belirli sunucuya kapsamlandırılmıştır, böylece bir adlandırılmış sunucudan gelen token'lar başka bir sunucuya erişemez. Bu kısa ömürlü `?session=` parametresi etkilenmez.

### Adlandırılmış Sunucu Silme

Bir sunucu kartı başlığındaki **X** simgesine tıklayın. Silme işlemi sunucuyu ve tüm workflow atamalarını kaldırır; workflow'ların kendisi etkilenmez.

## SSE Endpoint

| Sunucu | Endpoint |
|--------|----------|
| Varsayılan | `{origin}/api/mcp/sse` |
| Adlandırılmış | `{origin}/api/mcp/servers/{server-uuid}/sse` |

Her iki endpoint de SSE transport (GET, MCP spec 2024-11-05) ve Streamable HTTP transport (POST, MCP spec 2025-03-26) destekler. Claude, her ikisinde de güvenli oturum açma için OAuth 2.1 / PKCE kullanır.

## İlgili

- [Why Heym](../getting-started/why-heym.md) – Heym'de birinci sınıf bir yapı taşı olarak MCP
- [Agent Node](../nodes/agent-node.md) – MCP aracı desteğine sahip Agent node
- [Agent Architecture](../reference/agent-architecture.md) – MCP istemcisi, araç dağıtımı, orkestratör
- [Triggers](../reference/triggers.md) – Bir workflow giriş noktası olarak MCP
- [Chat Tab](./chat-tab.md) – `heym_chat` aracının arkasındaki motor
- [Workflows Tab](./workflows-tab.md) – Workflow'ları oluşturun ve yönetin
- [Node Types](../reference/node-types.md) – AI node'larına genel bakış
- [Contextual Showcase](../reference/contextual-showcase.md) – Dashboard yüzeyleri için kompakt sayfa kılavuzu
