# Portal

**Portal**, Heym workflow'larını herkese açık sohbet tarzı arayüzler olarak sunar. Son kullanıcılar, Heym'e giriş yapmadan bir URL üzerinden workflow'ları çalıştırabilir.

## Ne İşe Yarar

- **Herkese açık URL**: `/chat/{slug}` (örn. `/chat/my-workflow`)
- **Sohbet arayüzü**: Kullanıcılar bir sohbet arayüzü üzerinden etkileşime girer (mesajlar, girdiler, yanıtlar)
- **İsteğe bağlı kimlik doğrulama**: Portal kullanıcıları yapılandırılmışsa giriş zorunludur; aksi takdirde portal herkese açıktır
- **Streaming**: Yürütme sırasında gerçek zamanlı düğüm ilerlemesi (etkinleştirildiğinde)
- **Çalışan yürütmeleri durdurma**: Kullanıcılar, sohbet altbilgisinden devam eden bir portal çalışmasını durdurabilir; etkin workflow yürütmesi de sunucu tarafında iptal edilir
- **Dosya yükleme**: Girdi alanı başına isteğe bağlı dosya yüklemeleri (metin, görseller vb.)
- **İnsan incelemesi devri**: Portal çalışmaları, bir agent onay için durakladığında [HITL inceleme bağlantılarını](./human-in-the-loop.md) gösterebilir
- **Görsel görüntüleme**: Görsel içeren workflow çıktıları (örn. LLM görsel üretiminden veya Playwright ekran görüntülerinden) sohbette küçük resim olarak görünür. Tam ekran görüntüleyici açmak için herhangi bir görsele tıklayın; kapatmak için **Esc** tuşuna basın veya cihazın geri düğmesini kullanın

## Workflow Yapılandırması

| Ayar | Açıklama |
|---------|-------------|
| `portal_enabled` | Bu workflow için portalı etkinleştir |
| `portal_slug` | URL slug'ı (örn. `my-workflow` → `/chat/my-workflow`) |
| `portal_stream_enabled` | Streaming yürütmeyi kullan |
| `portal_file_upload_enabled` | Dosya yüklemelerine izin ver |
| `portal_file_config` | Alan başına dosya yapılandırması (türler, sınırlar) |

Editörde yapılandırın: Workflow başlığındaki **Portal** düğmesi, portal ayarları iletişim kutusunu açar.

## Akış

1. **Bilgi**: `GET /api/portal/{slug}/info` – Workflow meta verilerini ve girdi alanlarını döndürür (kimlik doğrulama yok)
2. **Giriş** (gerekliyse): `POST /api/portal/{slug}/login` – Oturum token'ı döndürür
3. **Yürütme**: `POST /api/portal/{slug}/execute` – Portal sohbet arayüzü bunu çağırır (veya etkinleştirildiğinde dahili olarak streaming varyantını); son kullanıcılar API'yi doğrudan çağırarak değil, sohbet arayüzü üzerinden etkileşime girer.
4. **Durdurma**: `POST /api/portal/{slug}/executions/{execution_id}/cancel` – Kullanıcı etkin bir portal çalışması sırasında **Durdur**'a bastığında istenir

## Portal Çalışmalarında HITL

Bir portal workflow'u, [Human-in-the-Loop](./human-in-the-loop.md) etkinleştirilmiş bir [Agent Düğümüne](../nodes/agent-node.md) ulaşırsa, portal yanıtı boş görünmek yerine bir inceleme bağlantısı gösterir.

- Workflow yürütme durumu `pending` olur
- Portal sohbeti inceleme URL'sini görüntüler
- Agent'ın `review` çıktı tutamacına bağlı herhangi bir düğüm, Slack, e-posta veya diğer kanalları hemen bilgilendirebilir
- Bir gözden geçiren kişi, giriş yapmadan `/review/{token}` üzerinde kararı tamamlar
- İncelemeden sonra workflow, saklanan snapshot'tan devam eder

Bu, herkese açık sohbet akışlarını özel insan onay adımlarıyla birleştirmeyi mümkün kılar.

## Girdi Alanları

Girdi alanları [Input](../nodes/input-node.md) düğümlerinden gelir. API, `textInput` türündeki başlangıç düğümlerini ve bunların `inputFields` öğelerini çıkarır. Yürütme, normal çalışmalarla aynı motoru kullanır; girdiler, çok turlu akışlar için `body.inputs` ve `conversation_history` olarak iletilir.

## Kimlik Doğrulama ve Oturumlar

- **WorkflowPortalUser**: Workflow başına kullanıcı adı/parola (kimlik doğrulama etkinleştirildiğinde)
- **Son kullanıcıyı kaldırma**: Portal etkinken son portal kullanıcısını silmek portalı tekrar herkese açık hale getirir; ayarlar iletişim kutusu önce onay ister
- **PortalSession**: 168 saatlik TTL'ye sahip oturum token'ları
- **Hız sınırlama**: 3 başarısız giriş denemesi → workflow+IP başına 24 saatlik yasak
- Süresi dolmuş oturumlar bir cron job tarafından temizlenir

## Yapılandırma Arayüzü

**WebPortalSettingsDialog** sekmeleri:

1. **General**: Portalı etkinleştir, slug ayarla, portal URL'sini kopyala
2. **Users**: Portal kullanıcılarını ekle/kaldır (kullanıcı adı/parola)
3. **Options**: Stream modu, dosya yükleme, girdi alanlarını görüntüle

## İlgili

- [Why Heym](../getting-started/why-heym.md) – Üretimde agent'lar için bir sohbet yüzeyi olarak Portal
- [Workflows Tab](../tabs/workflows-tab.md) – Workflow oluşturun ve portalı etkinleştirin
- [Human-in-the-Loop](./human-in-the-loop.md) – Bekleyen agent çıktıları için herkese açık inceleme sayfaları
- [Triggers](./triggers.md) – Bir giriş noktası olarak Portal
- [Node Types](./node-types.md) – Portal girdileri için [Input](../nodes/input-node.md)
- [Workflow Structure](./workflow-structure.md) – Düğümler ve kenarlar
