# Dashboard

**Dashboard** sekmesi, grafik widget'larından oluşan ızgaralar oluşturduğunuz Grafana tarzı bir alandır. Her widget, kendi gizli Heym workflow'unun çıktısından oluşturulur; böylece bir workflow'da üretebileceğiniz her türlü veri — veritabanı sorguları, API çağrıları, RAG aramaları, LLM çıktısı — bir grafiğe dönüşebilir. Birden fazla dashboard tutabilir ve her birini kişilerle veya ekiplerle paylaşabilirsiniz.

## Dashboard'lar

Herkes, sekmeyi ilk açtığında oluşturulan bir dashboard ile başlar. Dashboard'lar arasında geçiş yapmak için sekmenin üst kısmındaki dashboard seçiciyi, yeni bir tane oluşturmak için yanındaki **+** simgesini kullanın. Seçici önce kendi dashboard'larınızı, ardından sizinle paylaşılanları, paylaşan kişinin adıyla etiketlenmiş olarak listeler.

Sekme, en son kullandığınız dashboard'u yeniden açar ve adres çubuğu açık dashboard'u taşır (`?tab=dashboard&dashboard=<id>`), böylece bir bağlantı, erişimi olan herkes için o dashboard'u tam olarak açar.

Ayarlar düğmesi (yalnızca sahipler için) dashboard'u yeniden adlandırır, bir [ayrıntı sayfası](#detail-pages) olarak hangi kayıtları kabul edeceğini belirler, paylaşımı yönetir ve siler. Bir dashboard'u silmek, widget'larını ve bunların workflow'larını kaldırır. Her zaman en az bir kendi dashboard'unuzu korursunuz, bu nedenle sonuncusu silinemez.

## Widget'lar

Bir widget, ızgara üzerindeki tek bir grafikdir. Desteklenen grafik türleri:

- **Bar** (dikey veya yatay)
- **Line**
- **Area** (dolgulu trend, birden fazla seriyi destekler)
- **Pie**
- **Table** (kaydırılabilir; artan sıralama için bir sütun başlığına tıklayın ve azalan sıralama için tekrar tıklayın. Bir sütun [durum çipleri](../nodes/chart-output-node.md#status-chips) olarak işlenebilir, bir sütun URL'yi yeni bir sekmede açan [bağlantı düğmeleri](../nodes/chart-output-node.md#link-buttons) içerebilir ve satırlar bir [ayrıntı sayfasını](#ayrinti-sayfalari) açabilir)
- **Numeric** (isteğe bağlı birimli tek bir KPI değeri)
- **Gauge** (min–max aralığına karşı tek bir değer, örn. bir yüzde)
- **Scatter** (korelasyon grafikleri için X/Y noktaları)
- **Proportion** (yüzde göstergeli paylara bölünmüş tek bir bar, örn. bir dil dağılımı)
- **Bar gauge** (kırmızıdan yeşile gradyanlı ve değerli, her satır için bir yatay gösterge, örn. boş disk alanı)
- **Text** (bir markdown mesajı, örn. "Son çalıştırma 19:47'de" gibi bir durum notu; markdown statik olduğunda [etkileşimli onay kutularını](../nodes/chart-output-node.md#interactive-task-lists) ve özel veya azalan numaralandırma için [açık numaralı listeleri](../nodes/chart-output-node.md#numbered-lists) destekler)
- **HITL** (bekleyen insan incelemeleriniz. Başlık `1/n pending` gösterir. Workflow adı, o çalıştırmayı canvas üzerinde açar. **Approve**, **Request changes** ve **Reject** bunu çözer. Widget başlığının yanındaki geçmiş simgesi, o çalıştırmayı bu sayfadaki geçmiş iletişim kutusunda açar. Widget, üst kaynak satırlarını kullanmaz ve her kişi kendi kuyruğunu görür. Bunun yerine, bu Workflow'u açabilen herkes için tek bir Workflow'un incelemelerini gösterebilir; bkz. [HITL widget'ları](#hitl-widgetlari))

Grafiklerin yanı sıra, bir **Run a workflow** widget'ı workflow'larınızdan birini doğrudan dashboard üzerinden çalıştırır: bırakılan bir dosya üzerinde, giriş alanlarıyla veya bir Run düğmesiyle; bkz. [Çalıştırma widget'ları](#run-widgets).

Her widget, sekmeyi açtığınızda verilerini eşzamansız olarak yükler; böylece grafikler dolarken sayfa duyarlı kalır.

## Widget ekleme

1. **Add widget**'a tıklayın, bir başlık verin ve bir grafik türü seçin. Seçicinin altında, iletişim kutusu o grafik türünün örnek verilerle bir örneğini çizer ve beklediği satırları adlandırır; böylece herhangi bir şey oluşturmadan önce türleri karşılaştırabilirsiniz.
2. Widget, workflow editöründe başlangıç grafiğiyle açılır: satırları üreten bir [Set](../nodes/set-node.md) node'u, bir [Chart Output](../nodes/chart-output-node.md) node'una bağlanır. Set node'unu herhangi bir veri kaynağıyla değiştirin. Bir **HITL** widget'ı yalnızca Chart Output node'udur; bekleyen incelemelerinizi okur ve bir veri kaynağına ihtiyaç duymaz.
3. Workflow'u, **Chart Output**'u besleyen node bir satır dizisi üretecek şekilde oluşturun, ardından Chart Output node'unun alan eşlemesini (etiket alanı, değer alanı vb.) yapılandırın.
4. Kaydedin, Dashboard sekmesine dönün ve widget oluşturulur.

Bir **Run a workflow** widget'ı için bunun yerine çalıştıracağı workflow'u seçin; seçici, widget'ın her birini nasıl çalıştıracağını belirtir. Widget doğrudan ızgaraya eklenir; oluşturulacak yeni bir workflow yoktur.

Bir widget'ı istediğiniz zaman yeniden açmak için çift tıklayın (veya düzenleme düğmesini kullanın). Hem widget'ı hem de eksiksiz workflow'unu çoğaltmak için widget başlığındaki **Clone widget**'ı kullanın. Kopya, orijinalin altına yerleştirilir ve bağımsız olarak düzenleyebilmeniz için **(Copy)** ile etiketlenir.

## HITL widget'ları

Yeni bir HITL widget'ı, kendi kuyruğunuzda bekleyen her incelemeyi gösterir. Yalnızca bir Workflow'unkileri göstermek için widget'ın **Ayarlar** bölümünü açın:

1. **Workflow** altında Workflow'u seçin. Liste, açabileceğiniz – size ait veya sizinle ya da ekibinizle paylaşılan – ve bir kişiyi bekleyen bir adımı olan Workflow'ları içerir: insan incelemesi olan bir Agent veya bir Slack onay, düğme ya da form adımı. Yanındaki simge bu Workflow'u yeni bir sekmede açar.
2. Workflow'un tam olarak böyle bir adımı varsa otomatik olarak seçilir. Birden fazlaysa, **Select agent** bunları düğüm adına göre listeler ve **All agents** ilk sırada yer alır; Slack adımları **(Slack)** olarak işaretlenir.
3. Kaydedin. Başlıktaki `1/n pending`, yalnızca bu incelemeleri sayar. Kendi kuyruğunuzu tekrar göstermek için **Tüm workflow'lar** seçeneğini belirleyin.

Aynı seçim tuvalde, Chart Output düğümünün özelliklerinde de mevcuttur. **AI ile ince ayar yapın** bunu yapabilir (“yalnızca fatura onaylarını göster”), aynı şekilde Workflow adını belirten yeni bir widget açıklaması da yapabilir. Her değişiklik bir Workflow düzenlemesidir, bu nedenle Edit History içinde görünür.

- **İncelemeleri kimler görür.** Bir Workflow üzerinde filtrelenmiş bir widget, o Workflow'un incelemelerini bu Workflow'u açabilen herkese gösterir ve onlar da Workflow'u çalıştırabildikleri gibi widget üzerinden onaylayabilir, değişiklik talep edebilir veya reddedebilir. Filtrelenmemiş bir widget herkese kendi kuyruğunu gösterir.
- **Widget'ı kimler görür.** Seçilen Workflow'u açamayan biri, kendisiyle paylaşılan bir gösterge panosunda bile widget'ı hiç görmez. Gösterge panosunun sahibi erişimi kaybettiğinde veya silindiğinde, sahip “You no longer have access to the workflow this widget shows” uyarısını görür ve **Ayarlar** içinden başka bir tane seçebilir.
- **Yalnızca erişilebilir seçenekler.** Açamadığınız bir Workflow, ayarlardan, tuvalden veya AI aracılığıyla kaydedildiğinde reddedilir.

## Ayrıntı sayfaları

Bir tablo widget'ı satırlarını başka bir dashboard'a bağlayabilir ve bu dashboard daha sonra bir ayrıntı sayfası olarak çalışır: her müşteriye, faturaya veya bilete (ticket) hizmet veren tek bir dashboard.

1. Tablo widget'ının **Settings** bölümünü açın ve **Row link** altında hedef dashboard'u seçin.
2. Satırı tanımlayan değere sahip sütun olan **Record column** değerini (örneğin `id`) ve isteğe bağlı olarak onu adlandıran bir **Label column** değerini (örneğin `name`) girin.
3. Kaydedin. Bir satıra tıklamak (veya üzerine odaklanıp Enter tuşuna basmak) bağlı dashboard'u `?record=<value>&label=<name>` parametreleriyle açar.

Ayrıntı dashboard'unda her widget workflow'u değeri `$page.record` olarak okur (bkz. [Chart Output](../nodes/chart-output-node.md#detail-pages-pagerecord)) ve sayfa, ızgaranın üzerinde kaydı temizleme düğmesiyle birlikte `Dashboard / <label>` gösterir. Geri düğmesi geldiğiniz tabloya döner.

- **Kimler açabilir.** Satırlar yalnızca bağlı dashboard'u açabilen görüntüleyiciler için tıklanabilir. Diğerleri aynı tabloyu bağlantısız olarak görür.
- **Kayıt biçimi.** Kayıt URL'den gelir, bu nedenle neyi kabul edeceğine ayrıntı dashboard'u karar verir. Ayarlarında **Detail page records** şunlardan biridir: kimlikler (harfler, rakamlar, `-`, `_` ve `.`, 128 karaktere kadar; varsayılan), sayılar, UUID'ler veya e-posta adresleri. Başka herhangi bir değer bir widget çalışmadan önce reddedilir ve widget'lar "This page does not accept that record" mesajını gösterir.
- **Yine sahibinin çalıştırması.** Widget'lar bir ayrıntı sayfasında da dashboard sahibi olarak çalışır. Oluşturucular `$page.record` değerini yalnızca bir düğümün onu kaçış karakteriyle koruduğu (escape ettiği) yerlere iletmeli, asla doğrudan sorgu metnine eklememelidir.
- **Önbelleğe alma.** Her widget grafiğini kayıt başına, widget ile aynı yaşam süresi (TTL) boyunca önbelleğe alır ve en son kullanılan 50 kaydı tutar.

## Çalıştırma widget'ları

Bir **Run a workflow** widget'ı workflow'larınızdan birini çalıştırır ve sonucu gösterir: durum, çalışma süresi ve çıktılar. Neyi göstereceği workflow'un ne aldığına bağlıdır:

- **Bir dosya.** [File Upload Trigger](../nodes/file-upload-trigger-node.md) ile başlayan bir workflow için üzerine bir dosya bırakın (veya seçmek için tıklayın); widget dosyayı trigger'ın tek kullanımlık yükleme bağlantısı üzerinden yükler. Widget, trigger'ın kabul ettiği dosya türlerini ve boyutunu gösterir ve yüklemeden önce diğerlerini reddeder. Workflow aynı zamanda bir Text Input düğümüyle başlıyorsa widget, bırakma alanının yanında onun alanlarını da gösterir: bir dosya seçin, alanları doldurun ve **Run** her ikisini de gönderir. Değerler widget'ın ürettiği yükleme bağlantısıyla birlikte taşınır, böylece paylaşılan bir yükleme bağlantısı bunları ayarlayamaz.
- **Giriş alanları.** Bir Text Input düğümüyle başlayan bir workflow için widget, alanlarını varsayılan değerleriyle gösterir; **Run**, workflow'u sizin değerlerinizle çalıştırır. Workflow'da bulunmayan alanlara ait değerler yok sayılır.
- **Hiçbir şey.** Girişi olmayan bir workflow bir **Run** düğmesi alır.

Sonucun **Wrap** düğmesi kutu içindeki uzun çıktı satırlarını kaydırır; çıktının JSON düzenini okumak için bunu kapatın.

- Dashboard'u açabilen herkes, tıpkı bir grafiği yenileyebildiği gibi widget'ı da çalıştırabilir. Workflow erişimi dashboard sahibine aittir: widget'ı eklemek hem sizin hem de sahibinin çalıştırabileceği bir workflow gerektirir ve çalıştırmanın kendisi, herhangi bir yükleme bağlantısı gibi workflow sahibinin kimlik bilgilerini kullanır.
- Sonuç, siz sayfadan ayrılana kadar ekranınızda kalır; diğer görüntüleyiciler dosyalarınızı, değerlerinizi veya sonuçlarınızı görmez. Çalıştırma, yürütme geçmişinde `dashboard` trigger'ı ile görünür.
- Bir dashboard paylaşımı hiçbir zaman workflow'un kendisine erişim izni vermez. **Edit workflow** zaten erişimi olan kişiler için onu açar ve **Fine-tune with AI** sunulmaz.
- Dosya çalıştırmaları, her File Upload Trigger çalıştırmasında olduğu gibi, yüklenen dosyaların depolandığı ana örnekte (main instance) yürütülür.

## AI ile widget oluşturma

**AI**'a tıklayın, istediğiniz metriği tanımlayın (örneğin, "son 30 gündeki workflow başarı oranı bar grafik olarak") ve bir LLM credential'ı ile model seçin. Heym, Chart Output node'uyla biten eksiksiz bir widget workflow'u oluşturur ve bunu ızgaraya ekler. Grafik türü başına örnek prompt'lar için [Chart Output](../nodes/chart-output-node.md#example-ai-prompts) bölümüne bakın.

Widget, isteğinizin dilinde bir veya iki kelimelik kısa bir başlık alır, örneğin “Açık vakalar”. Başlık hiçbir zaman bir veri tablosunun kimliğini taşımaz; model widget'ı bir cümleyle adlandırdığında, Heym bunun ilk kelimelerini saklar.

Widget API'si AI olmadan da bir **sayaç kartı** oluşturabilir: `count_column` ve `count_value` içeren bir veri tablosundaki (`data_table_id`) `text` widget'ı, kaç satırın bu değere sahip olduğunu gösterir; widget'ın başlığı değeri belirtir. Heym Work, bir veri tablosundan oluşturulan sayfaları durum başına bir sayaç kartı ile başlatır.

Mevcut bir widget'ı yeni bir talimatla revize etmek için bir widget'ın **Fine-tune with AI** düğmesini kullanın. Her AI fine-tune işlemi, önceki workflow'u widget'ın **Edit History**'sine anlık görüntü olarak kaydeder; böylece workflow editöründen değişiklikleri inceleyebilir veya geri alabilirsiniz.

## Düzeni düzenleme

Widget'ları sürükleyip 12 sütunlu bir ızgarada yeniden boyutlandırabileceğiniz düzenleme moduna girmek için **Edit**'i açın. Düzen değişiklikleri otomatik olarak kaydedilir. Widget başlıkları, widget başlığından satır içi olarak düzenlenebilir.

## Önbellekleme ve yenileme

Her widget, son hesaplanan verilerini sunucuda yapılandırılabilir bir yaşam süresi (TTL) boyunca önbelleğe alır. Önbellek taze olduğu sürece, dashboard'u yeniden açmak workflow'u yeniden çalıştırmak yerine saklanan sonucu sunar. Önbellek, veriler her yeniden hesaplandığında yerinde değiştirilir (widget başına bir önbellek, artı bir [ayrıntı sayfasındaki](#detail-pages) her kayıt için bir önbellek) ve widget'ın workflow'unu düzenlediğinizde otomatik olarak geçersiz kılınır.

Önbelleği atlayıp hemen yeniden hesaplamak için bir widget'ın **Refresh** düğmesini (veya araç çubuğundaki **Refresh**'i) kullanın.

## Paylaşım

Sahipler bir dashboard'u ayarlarından, tek tek kullanıcılarla (e-posta ile) veya ait oldukları herhangi bir [team](teams-tab.md) ile paylaşır. Her paylaşım **Read** veya **Write**'tır; bir kişide hem kişisel hem de team paylaşımı olduğunda, daha güçlü olan geçerlidir.

| Eylem | Owner | Write | Read |
|--------|:-----:|:-----:|:----:|
| Widget'ları görüntüleme, yenileme, auto-refresh kullanma | ✓ | ✓ | ✓ |
| Ayrıntı sayfalarını açma, çalıştırma widget'larını çalıştırma | ✓ | ✓ | ✓ |
| Widget ekleme, klonlama, silme, yeniden adlandırma ve boyutlandırma; AI ile oluşturma ve ince ayar; checklist öğelerini işaretleme | ✓ | ✓ | |
| Bir widget'ın workflow'unu editörde açma | ✓ | ✓ | |
| Dashboard'u yeniden adlandırma veya silme, kayıt biçimini ayarlama, paylaşımı yönetme | ✓ | | |

**Widget'lar her zaman dashboard sahibi olarak çalışır.** Kim bakıyor olursa olsun, bir widget sahibin kimlik bilgilerini ve global değişkenlerini kullanır ve çalışmaları sahibin execution history ve trace'lerinde görünür. Böylece ekip arkadaşları, arkasındaki hesaplara erişmeden aynı verileri görür ve her görüntüleyici widget başına tek önbelleğe alınmış sonucu paylaşır. Bir write collaborator'ın eklediği veya klonladığı widget'lar da sahibe aittir.

Bu nedenle, **Write** bir workflow'u düzenleme için paylaşmakla aynı güveni taşır: write erişimine sahip bir collaborator, sizin kimlik bilgilerinizle çalışan şeyi değiştirebilir. Bunu yalnızca workflow'larınızı düzenlemesine izin vereceğiniz kişilere verin. Bir collaborator'ın workflow editöründen başlattığı test çalışması, herhangi bir paylaşılan workflow'da olduğu gibi kendi kimlik bilgilerini kullanır; yalnızca dashboard'un kendisi sahibi olarak çalışır. **Read**, widget workflow'larına hiçbir erişim sağlamaz ve salt okunur görüntüleyiciler grafiğin kendisini alır ancak arkasındaki node başına execution ayrıntılarını almaz.

Bir paylaşımı kaldırmak veya write'tan read'e düşürmek anında etkili olur.

## İlgili

- [Chart Output node](../nodes/chart-output-node.md)
- [Analytics tab](analytics-tab.md) — yerleşik execution metrikleri (kullanıcı tarafından oluşturulan dashboard'lardan farklıdır)