# Drive

Drive sekmesi, skill'ler tarafından oluşturulan tüm dosyaları görüntülemek, yönetmek ve paylaşmak için merkezi bir yer sağlar.

## Drive'a Erişim

Dashboard'da **Drive** sekmesine gidin. Workflow skill'leriniz tarafından oluşturulan tüm dosyalar burada, oluşturulma tarihine göre sıralanmış olarak görünür.

## Dosya Listesi

Dosya listesi şunları gösterir:

- **Name** - Türe özgü bir simgeyle birlikte orijinal dosya adı
- **Type** - Dosya MIME türü (örn. pdf, csv, docx)
- **Size** - İnsan tarafından okunabilir dosya boyutu
- **Source** - Dosyayı oluşturan düğüm etiketi
- **Date** - Dosyanın oluşturulma zamanı
- **Actions** - İndirme, paylaşma ve silme düğmeleri

## Toplu İşlemler

Sahip olduğunuz her dosyanın satırının başında bir onay kutusu bulunur. Bir ekip aracılığıyla sizinle paylaşılan dosyalar salt okunurdur ve seçilemez. Birden fazla dosya seçin (Shift-tıklama bitişik bir aralık seçer; başlık onay kutusu tüm sayfayı seçer), listenin üzerinde toplu işlem çubuğunu görüntüleyin, ardından seçilen her dosyaya aynı ayarı uygulayan tek bir iletişim kutusunu açmak için **Bulk actions** seçeneğine tıklayın:

- **Share all with my teams** / **Remove team sharing** — seçilen tüm dosyalar için ekip paylaşımını tek seferde açar/kapatır
- **Create share link for each file** — aynı son kullanma tarihi, parola ve maksimum indirme değerlerini kullanarak seçilen her dosyada bir paylaşım bağlantısı oluşturur

İletişim kutusu kaç dosyaya uygulandığını bildirir; sahip olmadığınız dosyalar atlanır. Listenin altındaki sayfa başına satır seçici (25 / 50 / 100 / **All**), tüm Drive'ınızda seçim yapabilmeniz için tek bir sayfada daha fazla dosya yüklemenizi sağlar.

## Dosyaları Paylaşma

Paylaşım iletişim kutusunu açmak için **Share** simgesine tıklayın. Dosya başına farklı yapılandırmalarla birden fazla paylaşım bağlantısı oluşturabilir ve isteğe bağlı olarak dosyayı mevcut ekiplerinizle paylaşabilirsiniz.

### Genel Bağlantı (Token tabanlı)

Parolasız bir paylaşım bağlantısı oluşturun. Bağlantıya sahip olan herkes dosyayı indirebilir.

### Parola Korumalı Bağlantı (Basic Auth)

Paylaşımı oluştururken bir parola belirleyin. İndirme URL'si HTTP Basic Authentication kullanır - bağlantı açıldığında tarayıcılar kullanıcı adı (`file`) ve parola ister.

### Bağlantı Seçenekleri

- **Expires (hours)** - İsteğe bağlı olarak bir son kullanma süresi belirleyin
- **Max downloads** - İsteğe bağlı olarak indirme sayısını sınırlayın
- Maksimum kontrol için her ikisi birlikte kullanılabilir

### Ekiplerimle Paylaş

Şu anda üye olduğunuz tüm ekiplere salt okunur erişim vermek için **Share with my teams** seçeneğini etkinleştirin. Ekip üyeleri dosyayı Drive'dan görebilir ve indirebilir ve okuma odaklı Drive düğümü işlemlerini kullanabilir, ancak dosyayı yalnızca dosya sahibi silebilir, genel bağlantı oluşturabilir veya iptal edebilir ya da parola/TTL/indirme limitlerini değiştirebilir.

Ayar dosyaya özgüdür. Daha sonra başka bir ekibe katılır veya bir ekip oluşturursanız, paylaşımı yeniden açın veya o ekibi eklemek için Drive düğümünün `shareWithMyTeams` işlemini çalıştırın. Bir workflow'da dosyadan ekip paylaşımlarını kaldırmak için `unshareWithMyTeams` kullanın.

### Paylaşımları Yönetme

Paylaşım iletişim kutusu mevcut tüm paylaşım bağlantılarını şunlarla birlikte gösterir:
- Geçerli indirme sayısı
- Son kullanma durumu
- Basic Auth'un etkin olup olmadığı
- Kopyalama ve iptal etme düğmeleri

## Chat ve Portal'da Dosya Bağlantıları

Bir skill, Portal chat veya Quick Drawer üzerinden bir workflow yürütmesi sırasında dosyalar oluşturduğunda, indirme bağlantıları yanıtta otomatik olarak görünür. Kullanıcılar doğrudan indirmek için tıklayabilir.

## Depolama

Oluşturulan dosyalar sunucunun dosya sisteminde `data/files/` altında saklanır. Docker dağıtımlarında bu, kalıcılık için bir volume olarak bağlanır.

## Dosyaları Workflow'lardan Yönetme

[Drive düğümü](../nodes/drive-node.md), Drive dosyalarını bir workflow içinden programatik olarak yönetmenizi sağlar. Şunlar için kullanın:

- Dosyalarınızı **Listeleme** ve dosya adı, MIME türü, boyut, kaynak ve indirme URL'si gibi meta verileri döndürme
- Kullanıcıya teslim edildikten sonra bir dosyayı **Silme**
- Ekip üyelerinin yalnızca ekip paylaşımı mevcut olduğu sürece okuyup indirebilmesi için **Ekiplerinizle paylaşma veya paylaşımı kaldırma**
- İndirme bağlantısında **Parola belirleme**
- Bağlantının N saat sonra sona ermesi için **TTL belirleme**
- **Maksimum indirme** limiti belirleme

Bir dosyayı başka bir biçime dönüştürmek, `conversion: "fileConvert"` ile [Converter düğümünün](../nodes/converter-node.md) işidir. Bir Drive dosyasını okur ve dönüştürülen sonucu yeni bir dosya olarak saklar.

Dosyaya skill çıktısındaki kimliğiyle başvurun: `$agentLabel._generated_files[0].id`

Yapılandırma ayrıntıları için [Drive düğümü dokümantasyonuna](../nodes/drive-node.md) bakın.

## Skill'lerden Drive Dosyalarını Okuma

Agent skill'leri, skill kartının **Enable Drive files** ayarıyla Drive okumalarını etkinleştirebilir. Etkinleştirildiğinde, skill çalışma zamanı oluşturulmuş bir `heym_drive.py` yardımcı dosyası içerir. Skill kodu `read_drive_text`, `read_drive_file`, `read_drive_base64`, `get_drive_file`, `get_drive_file_path` ve `list_drive_files` gibi yardımcıları içe aktarabilir.

Drive okumaları, workflow aktörünün erişebildiği dosyalarla sınırlıdır: sahip olunan dosyalar ve aktörle ekipler aracılığıyla paylaşılan dosyalar. Kesin arama için bir dosya kimliği veya kullanıcı bir dosyaya adıyla başvurduğunda tam bir dosya adı kullanın. Dosya adı araması, o ada sahip erişilebilir en yeni dosyayı döndürür; `list_drive_files(filename="...")` tüm eşleşmeleri döndürür.

## İlgili

- [Drive Node](../nodes/drive-node.md) - Workflow işlemleri (listeleme, alma, silme, parola, TTL, maksimum indirme, ekip paylaşımı)
- [Drive Tab](../tabs/drive-tab.md) - Dashboard'da dosyalara göz atma
- [File Generation](./file-generation.md) - `_generated_files` ve indirme URL'lerinin nasıl üretildiği

## Temizleme
Süresi dolmuş paylaşım token'ları günlük olarak otomatik temizlenir. Dosyaların kendisi, Drive sekmesi aracılığıyla manuel olarak silinene kadar kalır. Tek bir işlemde her dosyayı ve paylaşım bağlantılarını silmek için **Clear All** seçeneğini kullanın.
