# Workflows Sekmesi

**Workflows** sekmesi varsayılan dashboard görünümüdür. Workflow listenizi, klasör yapısını gösterir ve workflow'ları oluşturmanıza, düzenlemenize ve düzenlemenize olanak tanır.

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Workflows demosunu izleyin</a></p>

## Sohbet Başlatın

Workflow listesinin üzerinde, sizi adınızla karşılayan ve neyi otomatikleştirmek istediğinizi soran bir sohbet kutusu bulunur. Bir prompt yazın, isteğe bağlı olarak bir dosya ekleyin ve istediğiniz credential ile modeli seçin. Her iki açılır menü de aranabilir ve [AI varsayılanlarınızla](../reference/user-settings.md) başlar.

Gönderme işlemi yeni bir konuşma oluşturur ve yanıtın akış halinde geldiği [Chat sekmesinde](./chat-tab.md) açar. Desteklenen ekler metin dosyaları, görseller ve PDF'lerdir; sohbet oluşturucuda olduğu gibi mesaj başına bir adet.

Henüz bir LLM credential'ınız yoksa, kutu [Credentials sekmesine](./credentials-tab.md) bir bağlantı gösterir ve gönderme devre dışı kalır.

Kutuyu gizlemek için **x** simgesine tıklayın. Ardından Workflows başlığının yanında bir **Ask AI** düğmesi belirir ve kutuyu geri getirir. Bu tercih tarayıcınızda hatırlanır.

## Workflow Listesi

Liste iki panelli bir görünümdür: solda workflow'lar ve klasörler, sağda seçili workflow'un önizlemesi.

- Her satırda workflow simgesi, adı, açıklaması, son güncellenme zamanı ve bir [durum etiketi](#workflow-status) gösterilir
- Workflow'lar kök dizinde veya klasörlerin içinde olabilir ve sabitlenmiş workflow'lar en üstte kendi **Pinned** grubunda görünür
- Bir satırı seçmek ve sağdaki önizlemesini yüklemek için **tıklayın**
- [Editörde](../getting-started/quick-start.md) açmak için bir satıra **çift tıklayın** veya odaklanmışken **Enter** tuşuna basın
- Yeni bir sekmede açmak için **Ctrl+tıklama** (veya **Cmd+tıklama**) kullanın
- Her satırın sağında düzenleme, kopyalama, sabitleme ve silme işlemleri bulunur. Telefonlarda bunlar gizlenir, böylece ad tam genişliği korur; orada işlemler sayfasını açmak için bir satıra **uzun basın**
- Sık kullandığınız workflow'ları [Quick Drawer](../reference/quick-drawer.md) içinde sabitleyin, böylece Workflows sekmesinden ve diğer dahili sayfalardan hızlıca çalıştırabilirsiniz

## Workflow Önizlemesi

Bir workflow seçmek, listenin yanındaki önizleme panelini doldurur. 1280px'den dar ekranlarda aynı panel, ekranın altından bir sayfa olarak açılır.

Panel şunları gösterir:

- Workflow adı, kim tarafından ve ne zaman oluşturulduğu ve en son ne zaman düzenlendiği
- **Open Workflow** – workflow'u editörde açar
- **Run Now** – workflow'u [Quick Drawer](../reference/quick-drawer.md) içinde açar; burada girdilerini doldurup listeden ayrılmadan çalıştırmayı başlatabilirsiniz
- **Description** – workflow açıklaması
- **Trigger Configuration** – bir cron workflow'u için zamanlama veya bir event workflow'u için dinleme trigger'ı. HTTP üzerinden çağrılan workflow'lar, ham endpoint ve auth metni yerine bir **Copy cURL** düğmesi gösterir: doğru URL, header'lar, auth yer tutucusu ve workflow'un girdi alanlarından oluşturulan bir body ile eksiksiz bir isteği kopyalar. Workflow bir [portal](../reference/portal.md) yayımladığında, genel sohbet bağlantısı da burada görünür
- **Last Run Details** – en son çalıştırmanın sonucu ve süresi veya workflow'un hiç çalıştırılmadığına dair bir not
- **Workflow Steps & Sub-agents** – yürütme sırasına göre düğümler; her biri modeli, işlemi veya zamanlaması ve etkin olup olmadığını gösteren bir nokta ile birlikte. Bir adımı seçmek, o düğümü editörde özellikler paneli zaten açık halde açar

Panel, siz kaydırdıkça listenin yanında sabit kalır, böylece uzun bir workflow listesinde okunabilir kalır.

## Instance Yönetimi

`HEYM_ADMIN_EMAILS` içinde listelenen hesaplar, bir paylaşım veya sahiplik devri olmadan instance üzerindeki herhangi bir workflow'u listeleyebilir, açabilir, düzenleyebilir, yürütme geçmişini inceleyebilir ve silebilir. Bu ayar, virgülle ayrılmış e-posta adresleri listesidir ve büyük/küçük harf duyarsız olarak eşleştirilir. Boş bir liste kimseye bu erişimi vermez. Değiştirdikten sonra backend'i yeniden başlatın.

Yöneticiler, workflow listesinde sahibin e-posta adresini görür ve bu adrese göre arama yapabilir. Önizlemesinde **Instance administration** seçeneğini açmak için bir workflow seçin:

1. **Pause triggers** yalnızca Cron node içeren workflow'lar için gösterilir. Normal bir sürümlenmiş kaydetme yoluyla workflow'un Cron ve diğer otomatik trigger node'larını devre dışı bırakır. Mevcut çalışmalar tamamlanabilir. Manual, API, portal ve sub-workflow çağrıları kullanılabilir kalır; bu eylem workflow genelinde bir yürütme kilidi değildir.
2. Duraklatıldığında buton **Resume triggers** olarak değişir; sayfa yenilendikten sonra da böyle kalır. Resume, yönetici tarafından duraklatılan trigger'ları yeniden etkinleştirir ve zaten devre dışı bırakılmış olan trigger'ları değiştirmeden bırakır. Kayıtlı bir yönetici duraklatma durumu olmayan eski duraklatılmış workflow'lar için Resume, otomatik trigger'larını etkinleştirir.
3. Çalışmalar sonuçlandıktan sonra workflow satırındaki **Delete workflow** eylemini kullanın. Silme işlemi, çalışan, kuyruğa alınmış veya inceleme bekleyen iş kaldığı sürece bir çakışma döndürür. Zamanlanmış silme de aynı kontrolü uygular.

Silmeden önce trigger'ları duraklatın ve mevcut çalışmaların tamamlanmasını bekleyin. Duraklatıldığında zaten gönderilmiş bir trigger yine de tamamlanabilir. Workflow'un artık çağrılamaması gerektiğinde silmeyi kullanın.

Yalnızca sahibe ait webhook secret'ları ve kimlik doğrulama ayarları mevcut korumalarını sürdürür. Yönetim, sahipliği devretmez veya sahibin credential kayıtlarını paylaşmaz. Yönetici duraklatma, devam ettirme, silme ve zamanlama eylemleri, işlemi yapan yönetici ve workflow sahibi ile birlikte [audit trail](../reference/audit.md) içinde görünür.

## Workflow Durumu

Her satır, workflow'un trigger node'larından, canlı çalışma durumundan ve — trigger node'u olmayan workflow'lar için — en son çalışmasının nasıl başlatıldığından türetilen bir durum etiketi taşır:

| Durum | Anlamı |
| --- | --- |
| **Running** | Workflow'un şu anda devam eden bir yürütmesi var |
| **Scheduled** | Etkin bir [cron](../nodes/cron-node.md) trigger'ı var |
| **Listening** | Slack, Telegram, IMAP veya WebSocket trigger'ı gibi etkin bir event trigger'ı var |
| **Paused** | Trigger node'ları var, ancak hepsi devre dışı bırakılmış |
| **API** | Trigger node'u yok ve en son execute endpoint'ine yapılan bir HTTP çağrısıyla çalıştırıldı |
| **SubWorker** | Trigger node'u yok ve en son bir üst workflow tarafından sub-workflow olarak çalıştırıldı |
| **Portal** | Trigger node'u yok ve en son [portal](../reference/portal.md) üzerinden çalıştırıldı |
| **WEB** | Trigger node'u yok ve tek terminali bir [HTML output mapper](../nodes/html-output-mapper-node.md), bu nedenle çağrılması işlenmiş bir web sayfası döndürür |
| **Manual** | Trigger node'u yok ve hiç çalışmadı veya en son çalışması başka bir yerden geldi |
| **Remove Scheduled** | [Silinmek üzere zamanlandı](../reference/workflow-organization.md) |

API, SubWorker ve Portal etiketleri, workflow'un [execution history](./logs-tab.md) içindeki tek en son girdiyi okur; bu nedenle iki şekilde çağrılan bir workflow, hangisi en son geldiyse onu gösterir. **WEB** ise bunun yerine grafikten belirlenir, bu nedenle bu üçünün önüne geçer: sayfa sunan bir workflow, HTTP üzerinden çağrıldıktan sonra bile WEB olarak okunur. Trigger node'ları her zaman hepsinin önüne geçer: birinin ayrıca HTTP üzerinden çağırdığı bir cron workflow'u **Scheduled** olarak kalır.

Yalnızca tek bir durumu göstermek için arama alanının yanındaki **Status** açılır menüsünü kullanın. Açılır menü, her biriyle şu anda kaç workflow'un eşleştiğini listeler. Bir durum filtresi klasörlerin içine de ulaşır: eşleşme içeren klasörler otomatik olarak genişletilir ve eşleşme içermeyen klasörler, siz filtreyi temizleyene kadar gizlenir.

## Etkin Workflow'lar

Masaüstünde, üst araç çubuğundaki dairesel rozet şu anda kaç workflow'un çalıştığını gösterir ve her 10 saniyede otomatik olarak yenilenir. Sıfır olmayan bir rozete tıklayarak, kaydırmadan önce en fazla dört satır gösteren etkin workflow listesini açın. Editörü o çalışmanın canlı görünümüne bağlamak için bir workflow adı seçin. Sıfır rozeti bilgilendiricidir ve açılamaz; rozet mobil ekranlarda gizlenir.

## Arama

Workflow'ları başlığa veya açıklamaya göre filtrelemek için **Status** yanındaki workflow arama alanını kullanın veya **Ctrl+F** (ya da **Cmd+F**) tuşlarına basın. Klasörlerin içindeki eşleşen workflow'lar, klasör dalları genişletilmiş olarak gösterilir. Aramayı temizlemek için **Escape** tuşuna basın.

## Klasörler

- Workflow'ları [klasörlere ve alt klasörlere](../reference/workflow-organization.md) düzenleyin
- **New Folder** düğmesiyle klasörler oluşturun; her birine bir ad ve listede adının altında görüntülenen isteğe bağlı bir açıklama verin
- Her klasör satırı, alt klasörler dahil olmak üzere kaç workflow barındırdığını gösterir; bunun yanı sıra yeni alt klasör oluşturma, yeniden adlandırma, simge değiştirme, ZIP olarak indirme ve silme işlemlerini sunar. Telefonlarda satır bunun yerine tek bir menü düğmesi gösterir
- Bir workflow'u bir klasörün veya alt klasörün üzerine sürükleyerek kart boyutunda bir hedef önizlemesi görün. Vurgulanan
  önizleme, bırakmadan önce tam klasör yolunu gösterir ve daraltılmış bir klasörün üzerine gelindiğinde
  iç içe klasörlere ulaşabilmeniz için kısa süreliğine genişler.
- Workflow'ları klasörler arasında veya kök dizine sürükleyin. Sürüklenen kart bir hayalet olarak görünür kalır
  ve siz kaydırdıkça etkin hedef vurgulanmış olarak kalır.
- Bir workflow'u geçerli klasörüne geri bırakmak devre dışıdır ve **Already in Folder** olarak işaretlenir.
- Bir klasörü, yeniden adlandırma işleminden veya sağ tıklama bağlam menüsünden yeniden adlandırın ya da açıklamasını değiştirin

## Workflow Oluşturma

1. **New Workflow** seçeneğine tıklayın
2. Bir ad ve isteğe bağlı bir açıklama girin
3. Workflow düzenleyicide açılır

## İçe Aktarma

Yeni bir workflow oluşturmak için bir JSON workflow dosyasını workflow alanına sürükleyip bırakın. İçe aktarılan düğümler ve kenarlar workflow'u oluşturmak için kullanılır; ad, JSON içindeki `name` alanından veya dosya adından gelir. JSON biçimi ve içe aktarma seçenekleri için [Download & Import](../reference/download-import.md) bölümüne bakın.

## Paylaşma

Bir workflow'u düzenleyicide açın ve kullanıcıları e-posta ile davet etmek veya bir [team](./teams-tab.md) ile paylaşmak için **Share** seçeneğine tıklayın. Her kullanıcı veya team için **Read** (görüntüle ve çalıştır) ya da **Write** (ayrıca düzenle) seçeneğini seçin ve bunu daha sonra girişin yanındaki açılır menüden değiştirin. Credentials ve alt workflow'lar otomatik olarak paylaşılmaz; bunları aynı kullanıcılar veya team'lerle ayrıca paylaşın. [Workflow Organization](../reference/workflow-organization.md#sharing-workflows) ve [Credentials Sharing](../reference/credentials-sharing.md) bölümlerine bakın.

## Düzenleme ve Silme

- **Edit** – Satırın düzenleme işleminden workflow adını ve açıklamasını değiştirin
- **Delete** – Workflow'lar [silinmek üzere planlanır](../reference/workflow-organization.md); kalıcı olarak kaldırılmadan önce bir çöp alanına taşınırlar

## Eşzamanlı Düzenlemeler

Kaydetme işlemi, düzenlemelerinizin dayandığı revizyonu gönderir ve workflow bu sırada değiştiyse — örneğin bir ekip arkadaşı kaydettiği için veya aynı workflow'u ikinci bir sekmede açık bıraktığınız için — sunucu yazmayı reddeder. Heym ardından iki seçenek sunan bir **Stale Workflow Detected** iletişim kutusu gösterir:

- **Cancel** – Kaydedilmemiş değişikliklerinizi düzenleyicide tutar, böylece başka bir sekmede yeniden yükleyip bunları uzlaştırabilirsiniz
- **Override** – Yine de kaydeder ve diğer kişinin sürümünün yerine geçer

Bir workflow'u **Çalıştırmak** önce onu kaydeder, dolayısıyla aynı denetimden geçer. Workflow sizin altınızdan değiştiyse, çalıştırma sessizce üzerine yazmak yerine iletişim kutusunda duraklar: **Override and Run** sizin sürümünüzü kaydeder ve çalıştırmayı başlatır, **Cancel Run** her ikisinden de vazgeçer ve düzenlemelerinizi olduğu gibi bırakır.

Denetim, kaydetme isteğinin bir parçasıdır, dolayısıyla ekstra bir gidiş-dönüş maliyeti yoktur ve bir kaydetmenin onu atlayabileceği bir aralık yoktur. Uygulamanın başka bir yerinden yaptığınız kendi değişiklikleriniz — bir yeniden adlandırma, bir ayar değişikliği, bir özellikler paneli anahtarı — hiçbir zaman çakışma olarak sayılmaz.

## Komut Paleti

Komut paletini açmak için **Ctrl+K** (veya **Cmd+K**) tuşlarına basın. Şunları yapabilirsiniz:
- Workflow'ları ada göre arayın
- Herhangi bir [dashboard sekmesine](./credentials-tab.md) atlayın
- Son workflow'ları açın

## İlgili

- [Quick Start](../getting-started/quick-start.md) – İlk workflow'unuzu oluşturun
- [Workflow Organization](../reference/workflow-organization.md) – Klasörler, alt klasörler ve planlanmış silme
- [Workflow Structure](../reference/workflow-structure.md) – Workflow'lar için JSON biçimi
- [Download & Import](../reference/download-import.md) – Workflow'ları JSON olarak dışa ve içe aktarın
- [Portal](../reference/portal.md) – Workflow'ları herkese açık sohbet arayüzleri olarak sunun
- [Board](./board-tab.md) – Workflow'ları sütun zincirleri aracılığıyla kanban kartlarından çalıştırın
- [Core Concepts](../getting-started/core-concepts.md) – Workflow'lar, düğümler ve yürütme
- [Execution History](../reference/execution-history.md) – Geçmiş çalıştırmaları görüntüleyin ve Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Workflow'ları dashboard, docs ve diğer düzenleyici dışı sayfalardan sabitleyin ve çalıştırın
- [Contextual Showcase](../reference/contextual-showcase.md) – Dashboard yüzeyleri için kısa sayfa kılavuzu
