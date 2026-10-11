# Bağlamsal Showcase

**Bağlamsal Tanıtım**, şu anda bulunduğunuz sayfayı, sizi hemen tam bir dokümantasyon akışına yönlendirmeden açıklayan hafif bir uygulama içi kılavuz çubuğudur.

## Ne İşe Yarar

- Geçerli sayfa için kısa bir özet gösterir
- İlk katmanı kısa tutarak aşırı yüklenmenizi önler
- Yalnızca ihtiyaç duyduğunuzda az miktarda ek ayrıntıyı genişletmenize olanak tanır
- Daha derin okuma için tam dokümantasyon sayfasına bağlantı verir

## Nerede Görünür

v1'de tanıtım, Heym'in kimlik doğrulaması gerektiren ana yüzeylerinde kullanılabilir:

- Dashboard sekmeleri
- [Evals](../tabs/evals-tab.md)
- [Dokümantasyon](../getting-started/introduction.md)
- Workflow düzenleyici tuvali

Giriş, kayıt, sohbet portalı ve HITL incelemesi gibi genel sayfalar tanıtımı göstermez.

## Erişim

### Masaüstü

- Ekranın sağ kenarında sabit bir **Sayfa Kılavuzu** tetikleyicisi görünür
- Tanıtım, sağ tarafta bir çekmece olarak açılır
- Varsayılan olarak kapalı kalır
- Tek seferlik bir tanıtım ipucu, kılavuzu zorla açmadan var olduğunu göstermeye yardımcı olur

### Mobil

- Aynı içeriğe yüzen bir **Sayfa Kılavuzu** düğmesinden erişilebilir
- Sağ çubuk yerine alt sayfa olarak açılır

## İçerik Modeli

Her tanıtım girdisi, tamamen özel bir bileşen yerine yapılandırılmış bir tanım kullanır.

- **Başlık** – Bu sayfa nedir
- **Özet** – Tek bir kısa açıklama
- **Maddeler** – Birkaç hızlı gözden geçirilebilir ipucu
- **Öne Çıkanlar** – Temel değer veya kullanım kalıpları için küçük kartlar
- **Daha Fazla Ayrıntı** – Ek bağlam için daraltılmış bölümler
- **Eylemler** – Genellikle bir veya iki bağlantı, çoğunlukla tam dokümantasyona yönlendirir

Bu, uzun ve gürültülü yardım panellerinden kaçınırken sistemin esnek kalmasını sağlar.

## Bağlam Farkındalığı

Tanıtım, geçerli yüzeye göre değişir.

- Dashboard sekmelerinin her birinin kendi özeti vardır
- Düzenleyici, [Tuval Özellikleri](./canvas-features.md) sayfasına yönlendirir
- Dokümantasyon sayfası genel bir dokümantasyon genel bakışı kullanır ve mümkün olduğunda zaten açık olan geçerli makaleye yönlendirir

## Kalıcılık

Tanıtım, tarayıcı depolamasında az miktarda kişisel arayüz durumu saklar:

- Panelin veya alt sayfanın en son açık olup olmadığı
- Hangi sayfa bağlamlarının tanıtım ipucunu zaten gösterdiği
- Bağlam başına en son genişletilen ayrıntı bölümü

## Neden Var

Amaç, daha fazla ağır arayüz öğesi eklemeden Heym'i öğrenmeyi kolaylaştırmaktır.

- Yönlendirme için kısa, her zaman yakında olan rehberlik
- Daha derin dokümantasyona net bir yol
- Deneyimli kullanıcılar için düşük kesinti

## İlgili

- [Workflows Sekmesi](../tabs/workflows-tab.md) – Ana dashboard yüzeyi
- [Evals Sekmesi](../tabs/evals-tab.md) – Değerlendirme workflow'ları
- [Tuval Özellikleri](./canvas-features.md) – Düzenleyici davranışı ve hata ayıklama
- [Hızlı Çekmece](./quick-drawer.md) – Diğer sabit sağ taraf yardımcı yüzeyi
