# Ayarlar

Ayarlar iletişim penceresi; profilinizi yönetmenize, kalıcı AI talimatları belirlemenize, hesap parolanızı güncellemenize, sohbet sesini yapılandırmanıza, varsayılan AI credential ve modelinizi ayarlamanıza ve observability durumunu gözden geçirmenize olanak tanır. Başlığın sağ üst köşesindeki **avatarınıza ve adınıza** tıklayarak açın.

## İletişim Penceresini Açma

Başlığın sağ üst köşesindeki **avatarınıza ve adınıza** tıklayın. İletişim penceresi şu sekmelerle açılır: **Profile**, **Security**, **Voice**, **AI Defaults** ve **Observability**. Instance yöneticileri ayrıca bir **SSO** sekmesi görür.

## Profile Sekmesi

### Profil Resmi

Heym, hesap e-postanız için [Gravatar](https://gravatar.com) resminizi başlıkta, [Chat](../tabs/chat-tab.md) ve **Chat with Heym** içindeki mesajlarınızın yanında, [Board](../tabs/board-tab.md) yorumlarında ve paylaşım iletişim pencereleri ile ekip üyesi listelerinde adınızın yanında gösterir. Değiştirmek için Gravatar'daki resmi güncelleyin; Heym yeni resmi birkaç saat içinde alır. Gravatar resmi yoksa Heym, adınızın ilk harfini gösterir.

Resim Heym sunucusu tarafından alınır ve orada önbelleğe alınır, böylece tarayıcınız Gravatar ile hiç iletişim kurmaz. Sunucu Gravatar'a ulaşamazsa herkes baş harfleri görmeye devam eder.

### Ad

Uygulama genelinde gösterilen görünen adınız. Bu alan zorunludur ve boş bırakılamaz.

### User Rules

User Rules, hem workflow builder'da hem de dashboard chat'te her AI isteğine otomatik olarak eklenen özel talimatlardır. **Workflow builder**'da ([AI Assistant](./ai-assistant.md)), workflow JSON'u oluşturmak için kullanılan system prompt'a eklenirler. **Dashboard chat**'te ise system düzeyinde bağlam olarak uygulanırlar. Bir kez yazarsınız ve her prompt'ta tekrarlamadan global olarak uygulanırlar.

**Yaygın kullanımlar:**

- Dil veya ton: `Always respond in English. Keep responses concise.`
- Kodlama stili: `Use async/await patterns. Prefer TypeScript interfaces over types.`
- Workflow kuralları: `Include error handling in all workflows. Use descriptive node labels.`
- Yanıt biçimi: `Use bullet points. Avoid lengthy explanations.`

**Uygulandıkları yerler:**

| Bağlam | Açıklama |
|---------|-------------|
| **Workflow builder** | Workflow oluşturma veya değiştirme için [AI Assistant](./ai-assistant.md) istekleri |
| **Dashboard chat** | Tüm [Chat sekmesi](../tabs/chat-tab.md) konuşmaları |

User Rules system düzeyinde eklenir—her prompt'tan önce otomatik olarak çalışırlar, workflow veya konuşma başına ek yapılandırma gerekmez.

### Profil Değişikliklerini Kaydetme

Uygulamak için **Save Changes**'e tıklayın. Değişiklikler tüm yeni AI istekleri için anında geçerli olur.

## Security Sekmesi

### Parola Değiştirme

Hesap parolanızı güncellemek için Security sekmesini kullanın.

**Gereksinimler:**

| Kural | Gereksinim |
|------|-------------|
| Minimum uzunluk | 8 karakter |
| Büyük harf | En az bir büyük harf (A–Z) |
| Küçük harf | En az bir küçük harf (a–z) |
| Rakam | En az bir sayı (0–9) |

Parola ayrıca mevcut parolanızdan farklı olmalıdır. Bu kurallar hem frontend hem de backend tarafında uygulanır.

**Adımlar:**

1. **Current Password** alanına mevcut parolanızı girin
2. **New Password** alanına yeni parolanızı girin (yukarıdaki tüm gereksinimleri karşılamalıdır)
3. **Confirm New Password** alanına yeniden girin
4. **Update Password**'e tıklayın

Mevcut parola yanlışsa satır içi bir hata mesajı gösterilir. Başarılı olduğunda bir onay mesajı görünür ve form otomatik olarak sıfırlanır.

## Voice Sekmesi

Voice sekmesi, [Chat sekmesi](../tabs/chat-tab.md) için konuşma sesini yapılandırır: bir **ElevenLabs credential** seçin (veya satır içi ekleyin), ElevenLabs hesabınızdan bir **Voice** seçin ve **Save Voice Settings**'e tıklayın. Bu, mesaj başına sesli okuma ve etkileşimli ses modunu etkinleştirir. Tam akış için [Chat Voice (TTS & STT)](./chat-voice.md) bölümüne bakın.

## AI Defaults Sekmesi

AI Defaults sekmesinin iki bölümü vardır.

### Tercih edilen credential ve model

Bir **tercih edilen LLM credential** ve ondan bir **model** seçin. Bu, uygulamadaki her AI özelliği için başlangıç varsayılanı olur — chat, [AI Assistant](./ai-assistant.md) (builder, analyzer ve workflow oluşturma), board mapper, AI dashboard widget'ları, [docs chat](../tabs/chat-tab.md), data-table AI schema yardımcısı, expression builder ve evals — o yüzeyin kendine ait kayıtlı bir seçimi olmadığında.

Her yüzeyin izlediği seçim kuralı şöyledir:

1. **Kayıtlı seçim** — o yüzeyde zaten yaptığınız bir seçim (örneğin bir chat konuşmasının son modeli) her zaman kazanır.
2. **Tercih edilen** — kayıtlı bir seçim olmadığında kullanılır.
3. **İlk kullanılabilir credential** — hiçbir tercih belirlemediğinizdeki yedek.

Credential ve modeli her yüzeyde istediğiniz zaman değiştirebilirsiniz; tercih yalnızca başlangıç varsayılanını doldurur. Önceki ilk-credential davranışını korumak için credential'ı **No preference** olarak bırakın. Tercih ettiğiniz credential daha sonra silinirse veya paylaşımı kaldırılırsa, sekme bir bildirim gösterir ve yüzeyler sessizce ilk kullanılabilir credential'a geri döner.

### Kodlama paketi kullanımı

Her **Codex** kimlik bilgisi için (paylaşılanlar dahil) sekme, etkin pencerelerin her biri için kalan hız sınırı kullanımını yatay bir çubuk olarak gösterir — örneğin planınıza bağlı olarak bir **5 saat** penceresi ve/veya bir **Haftalık** pencere. Her çubuk, kalan kotanın yüzdesini ve bir sıfırlama geri sayımını gösterir. Bir **Yenile** düğmesi istek üzerine yeniden getirir (sonuçlar sunucuda kısa süreliğine önbelleğe alınır).

Her **OpenCode** kimlik bilgisi için sekme, OpenCode Go abonelik pencerelerini — **5 saat**, **Haftalık** ve **Aylık** — aynı stilde çubuk olarak gösterir; bu veriler gateway'in kimliği doğrulanmış kullanım endpoint'inden o kimlik bilgisinin API anahtarıyla okunur. Sınırına ulaşmış bir pencere amber renginde **"sınıra ulaşıldı"** olarak gösterilir. Anahtar geçersizse veya workspace'te Go aboneliği yoksa, kart çubukları göstermek yerine nedenini belirtir.

## Observability Sekmesi

Observability sekmesi, bu instance için [OpenTelemetry Tracing](./opentelemetry.md) özelliğinin salt okunur durumunu gösterir: tracing'in etkin olup olmadığı, OTLP endpoint'i, servis adı, sampler oranı ve hangi span'lerin yayımlandığı. Tracing, backend'deki `HEYM_OTEL_*` ortam değişkenleri aracılığıyla yapılandırılır, dolayısıyla bu sekme hiçbir şeyi düzenlemez. Tracing devre dışıyken sekme, etkinleştirmek için gereken ortam değişkenlerini listeler. OTLP auth header'ları gibi gizli bilgiler burada asla gösterilmez. Tam yapılandırma referansı için [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) sayfasına bakın.

## SSO Sekmesi

Yalnızca instance yöneticilerine görünür — `HEYM_ADMIN_EMAILS` içinde listelenen hesaplar. Bu sekme, Heym'i harici bir OpenID Connect sağlayıcısına bağlar; böylece kişiler hâlihazırda sahip oldukları hesaplarla oturum açabilir. Bir issuer URL'si ve client kimlik bilgilerini girin, salt okunur redirect URI'yi sağlayıcınıza kopyalayın ve etkinleştirmeden önce **Test connection** çalıştırın. Test başarılı olduktan sonra parola ile oturum açma buradan kapatılabilir. Tam kurulum için [Single Sign-On](./sso.md) sayfasına bakın.

## Instances Sekmesi

Yalnızca instance yöneticilerine görünür — `HEYM_ADMIN_EMAILS` içinde listelenen hesaplar. Bu sekme, bu veritabanına bağlı Heym instance'larını listeler ve arka plan çalışmalarının bunlar arasında nasıl bölüneceğini ayarlar. Her satır, instance'ın düzenlenebilir adını, rolünü, canlı olup olmadığını, veritabanına ölçülen gecikmesini, bir açma/kapama anahtarını ve ağırlığını gösterir. Ağırlıklar, 100'ün yüzdeleri değil, şu anda iş alabilen instance'ların paylarıdır: `41 / 26 / 33` ile ve üçüncü instance kapalıyken, ilk ikisi gerçekte %61 ve %39 alır. Panel, bu etkin bölünmeyi tablonun altında yazdırır ve yalnızca etkin hiçbir instance'ın ağırlığı yoksa kaydetmeyi reddeder.

**Give new instances a share automatically** varsayılan olarak açıktır: aksi takdirde katılan bir instance 0 ağırlıkta oturur ve hiçbir şey almaz; bu nedenle leader ona bir kez eşit bir pay verir ve mevcut ağırlıkları oranlarını koruyarak aşağı ölçekler. Ağırlığını kendiniz belirlediğiniz bir instance'a asla dokunmaz.

Panel ayrıca son 24 saatin çalışmalarından kaçının yalnızca ana instance üzerinde yürütülebildiğini bildirir. Bu pay yüksek olduğunda, altındaki ağırlıklar bu işi taşıyamaz. Neyin ana instance üzerinde kaldığını ve sayıların nasıl seçileceğini görmek için [Load Distribution](./cluster.md) sayfasına bakın.

## Bu Diyalogda Olmayanlar

| Özellik | Nerede Bulunur |
|---------|-----------------|
| **API key management (MCP)** | [MCP Tab](../tabs/mcp-tab.md) – MCP server API anahtarınızı görüntüleyin, kopyalayın ve yeniden oluşturun |
| **Theme (dark / light)** | Başlıktaki Sun/Moon geçiş düğmesi (kullanıcı rozetinin yanında) |
| **Email change** | Şu anda desteklenmiyor |

## İlgili

- [AI Assistant](./ai-assistant.md) – User Rules kullanan Workflow builder sohbeti
- [Chat Tab](../tabs/chat-tab.md) – User Rules kullanan Dashboard sohbeti
- [Chat Voice (TTS & STT)](./chat-voice.md) – Voice sekmesinde yapılandırılan ElevenLabs sesi
- [MCP Tab](../tabs/mcp-tab.md) – MCP server API anahtarı ve workflow tool exposure
- [Credentials Tab](../tabs/credentials-tab.md) – AI node'ları ve entegrasyonlar için API anahtarları
- [Security](./security.md) – Oturum yönetimi, hız sınırlama, kimlik bilgisi şifreleme
- [Single Sign-On](./sso.md) – Harici bir OpenID Connect sağlayıcısı bağlayın
- [OpenTelemetry Tracing](./opentelemetry.md) – Workflow ve node yürütmeleri için dağıtık tracing
