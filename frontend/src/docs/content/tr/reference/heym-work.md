# Heym Work

**Heym Work**, Heym platformu üzerine inşa edilmiş, iş ekiplerine yönelik ikinci bir kullanıcı arayüzüdür. Kullanıcılar bir görevi kendi sözcükleriyle açıklar, birkaç soruya yanıt verir ve Heym'in oluşturup test ettiği bir workflow elde eder. Kendileri için özel tasarlanmış sayfalardan çalışır, onay süreçlerini yanıtlar ve her çalıştırmayı başlatanın adıyla birlikte görür. Heym her işi arka planda yürütür.

Heym Work, Heym ekibinden alınan ayrı bir lisansla, Heym kurulumunun yanında bağımsız bir konteyner olarak çalışır. Daha fazla bilgi edinmek ve deneme sürümü talep etmek için [heym.run/enterprise](https://heym.run/enterprise) adresini ziyaret edin. İki dakikalık genel bakış için [Heym Work tanıtım videosunu](https://youtu.be/5Z2gGo6bcpU) izleyin.

## İş Ekiplerine Sunulan Özellikler

| Alan | İşlev |
|------|-------|
| **Chat** | Görevi metinle veya sesle açıklayın. Heym gerekli ayrıntıları sorar, workflow yapısını oluşturur, test eder ve Doğrulandı olarak işaretler. |
| **Flows** | Düzenleyiciler bir flow'u tuval yerine seçeneklerden oluşturur: onu neyin başlattığı, isteğe bağlı bir AI taslağı ve Slack, Google Sheets ve e-postadaki eylemler. Slack'ten gelen yanıtlar çalıştırmaya devam eder ve onaylar Etkinlik'te de bekler. Bkz. [Flows](#flows). |
| **Sayfalar** | Sabitlenmiş widget sayfaları: sayısal göstergeler, grafikler, durum etiketli tablolar, dosya bırakma alanları ve onaylar. Bir tablo satırı kendi ayrıntı sayfasını açabilir. |
| **Onaylar** | [Human-in-the-Loop](./human-in-the-loop.md) adımlarından gelen incelemeler Etkinlik bölümünde ve sayfalarda Onayla, Değişiklik İste ve Reddet seçenekleriyle bekler. |
| **Etkinlik** | Başlatan kişi ve çalıştıran örnek bilgisiyle birlikte her çalıştırma kaydı. |
| **Roller** | Sahip, Düzenleyici ve Görüntüleyici. Giriş işlemi Heym'in halihazırda kullandığı [Single Sign-On](./sso.md) üzerinden gerçekleşir. |
| **Sektörel Sürümler** | Hukuk, eğitim, finans, lojistik, enerji ve e-ticaret sürümleri sektöre özel sayfalar, örnek veriler ve hazır iş akışlarıyla açılır. |

## Flows

**Flows**, Düzenleyiciler ve Sahipler için Heym Work menüsündedir. Bir flow, düğümler yerine seçeneklerden oluşturulur ve Heym Work, onu oluşturan kişi adına Heym API'si aracılığıyla sıradan bir Heym iş akışı olarak kaydeder. Heym'in erişim kuralları, Düzenleme Geçmişi ve tetikleyici eşitlemesi düzenleyicide olduğu gibi geçerlidir ve her çalıştırma Etkinlik'te diğerleri gibi görünür.

| Bölüm | Seçenekler |
|---|---|
| **Neyin başlattığı** | İsteğe bağlı olarak, bir programa göre, bir Slack mesajında, bir Google Sheets sekmesi değiştiğinde (satırlar eklendiğinde, değiştirildiğinde veya silindiğinde) ya da bir e-posta gelen kutusuna ulaştığında. E-tablo ve e-posta tetikleyicileri her 1, 5, 15 veya 60 dakikada bir kontrol eder. |
| **AI taslağı** (isteğe bağlı) | Bir model ve talimatlar, flow'u başlatan şeyi sonraki adımlar için metne dönüştürür. Bir e-tablodan veya e-postadan başlamayan bir flow, önce bir kanaldan veya ileti dizisinden son Slack mesajlarını okuyabilir. |
| **Daha sonra ne olur** | Flow'u ne başlatmış olursa olsun, üç araçtan herhangi birinde sırayla eylemler. **Slack:** kanal mesajı, doğrudan mesaj, form, düğmeli mesaj, onay, ileti dizisi yanıtı, mesaj güncellemesi ve nihai sonuç. **Google Sheets:** satır ekleme veya değişen satırı güncelleme. **E-posta:** e-posta gönderme. |

- **Yanıtlar çalıştırmaya devam eder.** Bir onay, düğmeler veya form, Slack'te biri yanıt verene kadar çalıştırmayı duraklatır. Bir onay Etkinlik'te de bekler ve her iki yerdeki bir karar düğmeleri Slack mesajından kaldırır. Sonraki Slack adımları ilk mesajın ileti dizisinde kalır.
- **Tek bir Bağlantılar kartı.** Her flow Slack çalışma alanını, Google Sheets hesabını ve okuduğu ve gönderdiği gelen kutularını gösterir. Bunlar Heym kimlik bilgileridir: **Slack Bot** (bot belirteci, `xoxb-…`), **Google Sheets**, **IMAP** ve **SMTP**; eksik bir kimlik bilgisi doğrudan flow'un içinden eklenebilir.
- **Her flow için bir Slack uygulaması.** Slack uygulamasında Etkileşim İstek URL'sini `https://<Heym adresiniz>/api/slack/interactions/<kimlik bilgisi kimliği>` ve Olay Abonelikleri İstek URL'sini `https://<Heym adresiniz>/api/slack/events/<kimlik bilgisi kimliği>` olarak ayarlayın. Heym Work, seçilen bağlantı için her ikisini de gösterir. Bu kimlik bilgisindeki tüm flow'lar bunları paylaşır.
- **Slack tetikleyicileri neyi dinleyeceklerini seçer:** kanallardaki ve doğrudan mesajlardaki mesajlar, bota doğrudan mesajlar, bottan bahsetmeler veya tek bir kanaldaki mesajlar. Botun kendi gönderileri asla bir flow başlatmaz.
- **Gereksinimler.** Flows için Heym 0.0.131 veya üzeri gereklidir.

Bir flow'un oluşturduğu adımlar, tuvalde kullanabileceğiniz aynı düğümlerdir: [Slack](../nodes/slack-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Sheets Trigger](../nodes/google-sheets-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md) ve [Cron](../nodes/cron-node.md).

## Heym Work'ü Bağlama

İlk komuttan ana sayfaya kadar tüm kurulum süreci için [kurulum videosunu](https://youtu.be/zXGfg1HPSLk) izleyin.

Bağlantı **Ayarlar → Heym Work** sekmesinden yapılandırılır. Bu sekme yalnızca `HEYM_ADMIN_EMAILS` değişkeninde listelenen örnek yöneticilerine görünür.

| Alan | İşlev |
|------|-------|
| **Heym Work adresi** | Heym Work'ün çalıştığı adres, örneğin `https://work.example.com`. Giriş işlemi buraya yönlendirilir. **Kaydet**'e basın. |
| **Entegrasyon anahtarı** | **Anahtar oluştur** butonu, Heym Work'ün Heym'e yönelik her istekte kullandığı anahtarı üretir. Bir kopyalama butonuyla birlikte yalnızca bir kez gösterilir. Heym yalnızca özetini (hash) saklar. |
| **Heym Work'ü Etkinleştir** | Bağlantıyı açar. Öncesinde adres ve anahtar girişini gerektirir. |
| **Sektör ve ekip sürümleri** | Hukuk, eğitim, finans, lojistik, enerji ve e-ticaret sürümleri ile şirket ekipleri için BT, satış, pazarlama ve İK sürümleri bu çalışmaya yönelik sayfalar, örnek veriler ve iş akışlarıyla açılır. |

Ardından Heym Work adresini açın ve kurulumu tamamlayın:

1. **Lisans**: Heym ekibinden alınan lisans anahtarını girin.
2. **Heym**: Heym adresini ve entegrasyon anahtarını girin.
3. **Sahip**: Heym Work Sahibi olarak tanımlanmış bir hesapla giriş yapın.

Ana sayfa açılır ve ekibin kullanımına hazır hale gelir.

### Anahtarı Yenileme

**Anahtarı yenile** seçeneği entegrasyon anahtarını değiştirir. Yeni anahtar oraya girilene kadar Heym Work çalışmayı durdurur ve Heym Work'e giriş yapmış tüm kullanıcıların oturumu kapatılır. Anahtarın sızdırıldığından şüphelenildiğinde veya anahtarı bilen bir çalışan ayrıldığında bu işlemi uygulayın.

### Bağlantıyı Devre Dışı Bırakma

Bağlantıyı kesmek için **Heym Work'ü Etkinleştir** anahtarını kapatın. Heym Work bu durumda Heym anahtarını yeniden isteyecektir. Heym her iki durumda da tüm iş akışlarını, zamanlamaları ve webhook'ları kesintisiz çalıştırmayı sürdürür.

## Güvenlik Modeli

- **Her değişiklik Heym üzerinden geçer.** Heym Work görüntülediği verileri Heym veritabanından okur ve her eylemi anahtarla korunan kanal üzerinden Heym'e gönderir; erişim kurallarını Heym denetler. Heym Work kendi verilerini ayrı bir `heym_work` şemasında tutar.
- **Anahtar bekleme durumunda hashlenir.** Heym iletilen anahtarın hash değerini doğrular ve anahtarın kendisini asla açık metin olarak saklamaz.
- **Kimlik doğrulama Heym'de kalır.** [SSO](./sso.md) açık olduğunda kullanıcılar kurumsal kimlik sağlayıcınız aracılığıyla Heym üzerinden oturum açar.
- **Değişiklikler denetlenir.** Bağlantıyı kaydetme ve anahtarı yenileme işlemleri [denetim günlüğüne](./audit.md) `work_integration.update` ve `work_integration.key_rotate` kayıtları yazar.

## Lisanslama

Heym Work, Heym ekibi tarafından verilen bağımsız bir lisans anahtarı gerektirir. Heym Work her gün lisans kimliğini, kurulum kimliğini, son 30 gündeki aktif kullanıcı sayısını, toplam üye sayısını, son 24 saatteki çalıştırma sayısını ve Heym ile Heym Work sürümlerini heym.run adresine iletir. İş akışı içerikleri, girdiler, çıktılar ve kimlik bilgileri daima yerel sunucularınızda kalır.

Günlük eşitleme 30 gün boyunca başarısız olursa 14 günlük ek süre başlar ve sonrasında Heym Work arayüzü bir Sahip'ten anahtar ister. Deneme sürümü son gününe kadar çalışır ve Heym ekibi uzattığında yeniden açılır (kurulum başına bir deneme hakkı tanınır). Heym'in kendisi bu süreç boyunca aralıksız çalışmaya devam eder. İnternet erişimi bulunmayan kapalı ağlar enterprise@heym.run üzerinden çevrimdışı lisans kullanır.

## Videolar

Tüm Heym Work videoları [Heym Work çalma listesinde](https://www.youtube.com/playlist?list=PLBLCDjFQgoPQ) toplanmıştır.

## İlgili Konular

- [Enterprise](./enterprise.md): Ticari lisanslama ve teknik destek
- [Single Sign-On](./sso.md): Heym Work tarafından kullanılan kimlik doğrulama altyapısı
- [Human-in-the-Loop](./human-in-the-loop.md): Heym Work'te gösterilen onay adımları
- [Denetim Günlüğü](./audit.md): Bağlantı değişikliklerinin oluşturduğu günlük kayıtları
- [Ayarlar](./user-settings.md): Heym Work sekmesinin bulunduğu menü
