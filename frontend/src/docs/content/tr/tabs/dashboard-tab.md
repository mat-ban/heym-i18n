# Dashboard

**Dashboard** sekmesi, grafik widget'larından oluşan ızgaralar oluşturduğunuz Grafana tarzı bir alandır. Her widget, kendi gizli Heym workflow'unun çıktısından oluşturulur; böylece bir workflow'da üretebileceğiniz her türlü veri — veritabanı sorguları, API çağrıları, RAG aramaları, LLM çıktısı — bir grafiğe dönüşebilir. Birden fazla dashboard tutabilir ve her birini kişilerle veya ekiplerle paylaşabilirsiniz.

## Dashboard'lar

Herkes, sekmeyi ilk açtığında oluşturulan bir dashboard ile başlar. Dashboard'lar arasında geçiş yapmak için sekmenin üst kısmındaki dashboard seçiciyi, yeni bir tane oluşturmak için yanındaki **+** simgesini kullanın. Seçici önce kendi dashboard'larınızı, ardından sizinle paylaşılanları, paylaşan kişinin adıyla etiketlenmiş olarak listeler.

Sekme, en son kullandığınız dashboard'u yeniden açar ve adres çubuğu açık dashboard'u taşır (`?tab=dashboard&dashboard=<id>`), böylece bir bağlantı, erişimi olan herkes için o dashboard'u tam olarak açar.

Ayarlar düğmesi (yalnızca sahipler için) dashboard'u yeniden adlandırır, paylaşımı yönetir ve siler. Bir dashboard'u silmek, widget'larını ve bunların workflow'larını kaldırır. Her zaman en az bir kendi dashboard'unuzu korursunuz, bu nedenle sonuncusu silinemez.

## Widget'lar

Bir widget, ızgara üzerindeki tek bir grafikdir. Desteklenen grafik türleri:

- **Bar** (dikey veya yatay)
- **Line**
- **Area** (dolgulu trend, birden fazla seriyi destekler)
- **Pie**
- **Table** (kaydırılabilir)
- **Numeric** (isteğe bağlı birimli tek bir KPI değeri)
- **Gauge** (min–max aralığına karşı tek bir değer, örn. bir yüzde)
- **Scatter** (korelasyon grafikleri için X/Y noktaları)
- **Proportion** (yüzde göstergeli paylara bölünmüş tek bir bar, örn. bir dil dağılımı)
- **Bar gauge** (kırmızıdan yeşile gradyanlı ve değerli, her satır için bir yatay gösterge, örn. boş disk alanı)
- **Text** (bir markdown mesajı, örn. "Son çalıştırma 19:47'de" gibi bir durum notu; markdown statik olduğunda [etkileşimli onay kutularını](../nodes/chart-output-node.md#interactive-task-lists) ve özel veya azalan numaralandırma için [açık numaralı listeleri](../nodes/chart-output-node.md#numbered-lists) destekler)
- **HITL** (bekleyen insan incelemeleriniz. Başlık `1/n pending` gösterir. Workflow adı, o çalıştırmayı canvas üzerinde açar. **Approve**, **Request changes** ve **Reject** bunu çözer. Widget başlığının yanındaki geçmiş simgesi, o çalıştırmayı bu sayfadaki geçmiş iletişim kutusunda açar. Widget, üst kaynak satırlarını kullanmaz ve her kişi kendi kuyruğunu görür)

Her widget, sekmeyi açtığınızda verilerini eşzamansız olarak yükler; böylece grafikler dolarken sayfa duyarlı kalır.

## Widget ekleme

1. **Add widget**'a tıklayın, bir başlık verin ve bir grafik türü seçin. Seçicinin altında, iletişim kutusu o grafik türünün örnek verilerle bir örneğini çizer ve beklediği satırları adlandırır; böylece herhangi bir şey oluşturmadan önce türleri karşılaştırabilirsiniz.
2. Widget, workflow editöründe başlangıç grafiğiyle açılır: satırları üreten bir [Set](../nodes/set-node.md) node'u, bir [Chart Output](../nodes/chart-output-node.md) node'una bağlanır. Set node'unu herhangi bir veri kaynağıyla değiştirin. Bir **HITL** widget'ı yalnızca Chart Output node'udur; bekleyen incelemelerinizi okur ve bir veri kaynağına ihtiyaç duymaz.
3. Workflow'u, **Chart Output**'u besleyen node bir satır dizisi üretecek şekilde oluşturun, ardından Chart Output node'unun alan eşlemesini (etiket alanı, değer alanı vb.) yapılandırın.
4. Kaydedin, Dashboard sekmesine dönün ve widget oluşturulur.

Bir widget'ı istediğiniz zaman yeniden açmak için çift tıklayın (veya düzenleme düğmesini kullanın). Hem widget'ı hem de eksiksiz workflow'unu çoğaltmak için widget başlığındaki **Clone widget**'ı kullanın. Kopya, orijinalin altına yerleştirilir ve bağımsız olarak düzenleyebilmeniz için **(Copy)** ile etiketlenir.

## AI ile widget oluşturma

**AI**'a tıklayın, istediğiniz metriği tanımlayın (örneğin, "son 30 gündeki workflow başarı oranı bar grafik olarak") ve bir LLM credential'ı ile model seçin. Heym, Chart Output node'uyla biten eksiksiz bir widget workflow'u oluşturur ve bunu ızgaraya ekler. Grafik türü başına örnek prompt'lar için [Chart Output](../nodes/chart-output-node.md#example-ai-prompts) bölümüne bakın.

Mevcut bir widget'ı yeni bir talimatla revize etmek için bir widget'ın **Fine-tune with AI** düğmesini kullanın. Her AI fine-tune işlemi, önceki workflow'u widget'ın **Edit History**'sine anlık görüntü olarak kaydeder; böylece workflow editöründen değişiklikleri inceleyebilir veya geri alabilirsiniz.

## Düzeni düzenleme

Widget'ları sürükleyip 12 sütunlu bir ızgarada yeniden boyutlandırabileceğiniz düzenleme moduna girmek için **Edit**'i açın. Düzen değişiklikleri otomatik olarak kaydedilir. Widget başlıkları, widget başlığından satır içi olarak düzenlenebilir.

## Önbellekleme ve yenileme

Her widget, son hesaplanan verilerini sunucuda yapılandırılabilir bir yaşam süresi (TTL) boyunca önbelleğe alır. Önbellek taze olduğu sürece, dashboard'u yeniden açmak workflow'u yeniden çalıştırmak yerine saklanan sonucu sunar. Önbellek, veriler her yeniden hesaplandığında yerinde değiştirilir (widget başına bir önbellek) ve widget'ın workflow'unu düzenlediğinizde otomatik olarak geçersiz kılınır.

Önbelleği atlayıp hemen yeniden hesaplamak için bir widget'ın **Refresh** düğmesini (veya araç çubuğundaki **Refresh**'i) kullanın.

## Paylaşım

Sahipler bir dashboard'u ayarlarından, tek tek kullanıcılarla (e-posta ile) veya ait oldukları herhangi bir [team](teams-tab.md) ile paylaşır. Her paylaşım **Read** veya **Write**'tır; bir kişide hem kişisel hem de team paylaşımı olduğunda, daha güçlü olan geçerlidir.

| Eylem | Owner | Write | Read |
|--------|:-----:|:-----:|:----:|
| Widget'ları görüntüleme, yenileme, auto-refresh kullanma | ✓ | ✓ | ✓ |
| Widget ekleme, klonlama, silme, yeniden adlandırma ve boyutlandırma; AI ile oluşturma ve ince ayar; checklist öğelerini işaretleme | ✓ | ✓ | |
| Bir widget'ın workflow'unu editörde açma | ✓ | ✓ | |
| Dashboard'u yeniden adlandırma veya silme, paylaşımı yönetme | ✓ | | |

**Widget'lar her zaman dashboard sahibi olarak çalışır.** Kim bakıyor olursa olsun, bir widget sahibin kimlik bilgilerini ve global değişkenlerini kullanır ve çalışmaları sahibin execution history ve trace'lerinde görünür. Böylece ekip arkadaşları, arkasındaki hesaplara erişmeden aynı verileri görür ve her görüntüleyici widget başına tek önbelleğe alınmış sonucu paylaşır. Bir write collaborator'ın eklediği veya klonladığı widget'lar da sahibe aittir.

Bu nedenle, **Write** bir workflow'u düzenleme için paylaşmakla aynı güveni taşır: write erişimine sahip bir collaborator, sizin kimlik bilgilerinizle çalışan şeyi değiştirebilir. Bunu yalnızca workflow'larınızı düzenlemesine izin vereceğiniz kişilere verin. Bir collaborator'ın workflow editöründen başlattığı test çalışması, herhangi bir paylaşılan workflow'da olduğu gibi kendi kimlik bilgilerini kullanır; yalnızca dashboard'un kendisi sahibi olarak çalışır. **Read**, widget workflow'larına hiçbir erişim sağlamaz ve salt okunur görüntüleyiciler grafiğin kendisini alır ancak arkasındaki node başına execution ayrıntılarını almaz.

Bir paylaşımı kaldırmak veya write'tan read'e düşürmek anında etkili olur.

## İlgili

- [Chart Output node](../nodes/chart-output-node.md)
- [Analytics tab](analytics-tab.md) — yerleşik execution metrikleri (kullanıcı tarafından oluşturulan dashboard'lardan farklıdır)
