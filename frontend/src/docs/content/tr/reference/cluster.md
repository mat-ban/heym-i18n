# Yük Dağıtımı

İkinci bir Heym örneğini aynı PostgreSQL veritabanına yönlendirin; bir worker olarak katılır. Arka plan workflow çalıştırmaları daha sonra belirlediğiniz bir yüzdeye göre örnekler arasında paylaştırılır, böylece UI ve API'yi sunan makine aynı zamanda her workflow'u çalıştıran tek makine olmaz.

Örnekler birbirleriyle asla konuşmaz. İşi Postgres taşır, bu nedenle bir worker'ın açık bir porta, sertifikaya veya ana örneğe geri dönüş yoluna ihtiyacı yoktur — yalnızca veritabanı erişimine ihtiyacı vardır.

## Roller

Bir örnek, bir ortam değişkeniyle sabitlenen **main**'dir. UI'yi, API'yi, MCP'yi ve sohbet portalını sunar; dosya depolamanın ve yüklü eklentilerin sahibidir. Diğer her örnek bir **worker**'dır: yalnızca veritabanına erişir ve arka plan çalıştırmalarını yürütür.

```
HEYM_CLUSTER_ENABLED=true
HEYM_INSTANCE_ROLE=main       # veya: worker
HEYM_INSTANCE_NAME=EU Main    # görünen etiket, daha sonra Settings'ten düzenlenebilir
HEYM_INSTANCE_ID=eu-main      # isteğe bağlı; boş olduğunda addan türetilir
```

Main rolü, leader election'dan ayrıdır. Heym zaten cluster genelinde cron, uyarı değerlendirmesi ve çökme kurtarma işlerinin sahibi olacak bir leader seçer; main çökerse liderlik birkaç saniye içinde bir worker'a geçer ve zamanlanmış çalıştırmalar çalışmaya devam eder. Main rolü yer değiştirmez, çünkü dosya depolama onunla birlikte taşınamaz.

## Main örneğinden neler ayrılabilir

Yerleşim, çalıştırma başlamadan önce workflow'un düğümlerinden belirlenir. Bir çalıştırma, içindeki herhangi bir düğüm — çağırdığı alt workflow'ların içindeki düğümler dahil — yalnızca tek bir makinede bulunan bir şeye dokunduğunda main üzerinde kalır:

| Düğüm | Neden main üzerinde kalır |
|---|---|
| Codex, OpenCode Go | Kodlama ajanı çalışma alanı yerel diskte kalır, böylece bir devam çalıştırması orada sürdürülebilir |
| Skill eklenmiş Agent | Skill kodu Heym Drive'ı okur ve yazar |
| Drive, Converter, Google Drive | Oluşturulan dosyaları okur ve yazar |
| File Upload trigger | Yükleme main'in diskine iner |
| Send Email | Kurumsal SMTP relay'leri genellikle tek bir kaynak adresine izin verir |
| Plugin düğümleri | Bir eklenti, bir örneğin diskine kurulur |

**Diğer her şey dağıtılır** — Code düğümü, Playwright ve Agent Python araçları dahil. Her örnek, kendi Docker socket'i ile aynı image'ı çalıştırır, bu nedenle bir sandbox bir çalıştırmayı main üzerinde tutmak için bir neden değildir ve bunlar üründeki en çok CPU tüketen düğümlerdir.

Alt workflow'u bir ifadeyle seçilen bir workflow önceden incelenemez, bu nedenle main üzerinde kalır.

## Yüzdeleri seçmek

Ağırlıklar **Settings → Instances** altında ayarlanan tam sayılardır. Bunlar 100'ün yüzdeleri değil, **şu anda iş alabilen örneklerin paylarıdır**: scheduler, o havuzun kendi toplamına böler.

Bu ayrım, bir örnek devre dışı kaldığı anda ortaya çıkar. `Main 41, Worker A 26, Worker B 33` ile Worker B'yi kapatmak 67'lik bir havuz bırakır, böylece Main gerçekte 41/67 = **%61** ve Worker A 26/67 = **%39** alır. Panel, tam da bu nedenle tablonun altında etkin dağılımı yazdırır ve sayılar 100'e ulaşmadığı için kaydetme asla engellenmez — yalnızca etkin hiçbir örneğin ağırlığı olmadığı bir dağılım reddedilir.

Yanlış anlaşılması kolay iki şey daha var.

**Bir yüzde, makine gücünün payı değildir.** Yalnızca kuyruktan geçen çalıştırmaları kapsar. UI ve API'yi sunmak, editör ve portal çalıştırmalarını akıtmak ve dosya yüklemelerini işlemek main'in işidir ve bunların hiçbiri sayılmaz. Main, sayısının söylediğinden daha fazlasını yapıyor.

**Main'in yüzdesi bir tavan, taban değildir.** Yalnızca main üzerinde yürütülebilen çalıştırmalar onun kotasından düşülür, bu nedenle bu kota tükendiğinde kalan dağıtılabilir çalıştırmalar worker'lara düşer. Main'in sayısını düşük ayarlamak güvenlidir — orada çalışması gereken iş yine de çalışır. Yüksek ayarlamak worker'ları aç bırakır.

Yani güçlü bir main ve daha küçük bir worker ile, makinelerin ham oranından çok 60/40'a yakın başlayın, ardından Traces sekmesinde gerçek çalıştırma sürelerini karşılaştırıp ayarlayın.

Ağırlıklar, şu anda canlı ve etkin olan örnekler arasında yeniden normalleştirilir. `main=70, A=15, B=15` ile A çevrimdışı olursa dağılım main ve B arasında 70/85 ve 15/85 olur ve A geri geldiğinde 70/15/15'e döner.

**Geri gelen bir örnek, kaçırdığı çalıştırmaları hak etmez.** Offline, Disabled veya uyumsuz bir sürümde geçirilen süre ona karşı sayılmaz, bu nedenle bir gece boyunca kullanılamayan bir worker havuzun mevcut konumuna yeniden katılır ve dağılım ilk çalıştırmasından itibaren tekrar 70/30 okunur — yetişene kadar her çalıştırmayı emmez. Baştan sona kullanılabilir olan bir worker yine de yetişir, main'in yüzdesini bir tavan yapan da budur.

### Yeni bir örnek sıfırdan katılır

Hiç ağırlık verilmemiş bir örnek 0'dan başlar, bu da onu Live, Enabled ve hiçbir şey almıyor durumunda bırakır. **Yeni örneklere otomatik olarak bir pay verin** — örnekler tablosunun altında varsayılan olarak açık — bunu düzeltir: leader'ın bir sonraki geçişinde yeni gelene havuzun eşit bir payı verilir ve mevcut ağırlıklar birbirlerine göre oranları korunarak küçültülür, böylece kasıtlı bir 70/30 sonrasında hâlâ kabaca 70/30 olarak okunur. Toplam tam olarak 100 kalır.

Bu, **örnek başına bir kez** çalışır. Hem otomatik geçiş hem de kendi düzenlemeniz örneği yapılandırılmış olarak işaretler, böylece kendi ayarladığınız bir örnek — kasıtlı olarak 0'a ayarladığınız biri dahil — arkanızdan asla değiştirilmez. Her yeni makinenin sizi beklemesini tercih ediyorsanız ayarı kapatın.

Yalnızca etkin, canlı ve uyumlu örnekler katılır. Hiçbir şey yürütemeyen bir makineye pay vermek, o payı boşa çıkarırdı.
### Yüzdelerin yardımcı olamadığı durumlar

Ayarlar paneli, son 24 saatteki çalışmaların kaçının yalnızca main üzerinde yürütülebildiğini bildirir. Bu sayı yüksekse — Codex ağırlıklı veya Drive ağırlıklı bir iş yükü — ağırlıklar ne derse desin worker'lar boşta bekler ve çözüm, daha fazla worker yerine daha büyük bir main instance'ıdır.

## Bir cluster için PostgreSQL boyutlandırma

Bağlantılar yalnızca kullanıcılarla değil, instance'larla birlikte ölçeklenir. Her instance birkaç uvicorn süreci çalıştırır ve her süreç bir bağlantı havuzu ile dört `LISTEN` bağlantısı (iptal, kuyruk uyandırmaları, çalışma sonuçları, sohbet akışları) tutar. Açık sohbet akışları tek sohbet bağlantısını paylaşır, dolayısıyla veritabanı bağlantısı eklemezler. Varsayılan `max_connections = 100` üzerinde üç instance'lık bir cluster tükenir ve Heym ardından kendi veritabanına ulaşamaz.

Kabaca `instances x processes x (async pool + sync pool + 4)` bütçeleyin ve `max_connections` değerini bunun üzerine ayarlayın.

Yalnızca tavanı yükseltmek yerine havuzları küçültün. Tek bir dağıtım, süreç başına varsayılan olarak 10+20 async ve 5+10 sync bağlantı kullanır; bu tek bir makine için cömert, bir cluster için ise fazlasıyla yüksektir:

| Değişken | Tek instance | Cluster |
|---|---|---|
| `HEYM_DB_POOL_SIZE` | 10 | 3 |
| `HEYM_DB_MAX_OVERFLOW` | 20 | 5 |
| `HEYM_DB_SYNC_POOL_SIZE` | 5 | 2 |
| `HEYM_DB_SYNC_MAX_OVERFLOW` | 10 | 3 |

Örnek compose dosyası bunları ve `max_connections = 300` değerini ayarlar. Bu, iki instance'lık bir cluster'ı 768 bağlantılık tavandan 192'ye indirir; üç instance ise hâlâ 300'ün altında kalır.

## Cluster'ın sizin için uygulayamadığı gereksinimler

**Her instance aynı `SECRET_KEY` ve `ENCRYPTION_KEY` değerlerini kullanmalıdır.** Farklı bir `ENCRYPTION_KEY` kullanan bir worker, kimlik bilgilerini şifresini çözemez ve kimlik bilgisi kullanan her çalışma, işe yarar hiçbir şey belirtmeyen bir hatayla başarısız olur. Heym, her heartbeat'te her iki anahtarın bir özetini, uygulama sürümü ve veritabanı revizyonuyla birlikte karşılaştırır ve uyuşmayan bir instance'ı **Mismatch** olarak işaretler, böylece hiçbir iş almaz. Siz düzeltene kadar yük main'e geri döner.

Bu aynı zamanda yükseltme sırasını da tanımlar. Önce main'i yükseltmek her worker'ı uyumsuz olarak işaretler; iş main'e döner ve her worker yükseltildikçe yeniden katılır. Daha yavaş, görünür ve geri alınabilir.

**Ingress'i yalnızca main instance'ına yönlendirin.** Kullanıcı trafiğini instance'lar arasında round-robin yapmak, bir dosya yüklemesini bir makineye, indirmesini ise başka bir makineye gönderir. Kodda bunu engelleyen hiçbir şey yoktur, çünkü bir worker aynı image'ı çalıştırır ve aldığı her isteği yanıtlar.

**Her instance `FRONTEND_URL` gerektirir ve aynı genel adrese ayarlanmalıdır.** İnsan incelemesi için duraklayan bir çalışma, inceleme bağlantısını main üzerinde değil, kendisini yürüten instance üzerinde oluşturur; aynı durum Codex takip bağlantıları ve oluşturulan dosyaların indirme URL'leri için de geçerlidir. Bu ayar olmadan bırakılan bir worker, bu bağlantıları kendi yerel adresine göre oluşturur ve bağlantıyı alan kişi onu açamaz.

**Worker instance'larının giden IP'si farklıdır.** Kaynak adresleri allowlist'e alan her API yeni adresi görür. Send Email tam da bu nedenle main üzerinde çalışır; HTTP düğümü için ya cluster'a tek bir NAT çıkış adresi verin ya da her instance'ı allowlist'e alın.

## Başka bir makinede worker ekleme

Depo kökündeki `docker-compose.worker.yml`, bir worker'ı kendi ana makinesinde çalıştırır. Veritabanı ve UI'si yoktur: main instance'ının PostgreSQL'ine ulaşır ve arka plan çalışmalarından kendi payını alır.

Yanına bir `.env` doldurun — image tag'i, veritabanı ana makinesi ve kimlik bilgileri, her iki anahtar ve bir instance id — ve başlatın. Compose, her zorunlu değer ayarlanana kadar başlamayı reddeder; sonradan okunması zor bir şekilde başarısız olacak bir yer tutucuyla açılmaz.

Image tag'i main'in çalıştırdığı sürüm olmalı ve her iki anahtar da tam olarak kopyalanmalıdır. Herhangi birindeki fark, worker'ı Mismatch olarak gösterir ve hiçbir iş almaz.

## Instances tablosunu okuma

| Sütun | Anlamı |
|---|---|
| Name | Düzenlenebilir etiket; bu instance'ın yürüttüğü her çalışmaya işlenir |
| Role | Ortamdan gelen `main` veya `worker` |
| Status | Taze bir heartbeat ile **Live**, 30 saniyelik sessizlikten sonra **Offline**, sürüm, veritabanı revizyonu veya anahtarlar main'inkinden farklı olduğunda **Mismatch** |
| ms | O instance'tan veritabanına gidiş-dönüş süresi, instance'ın kendisi tarafından ölçülür |
| On | Bir worker'ı durdurmadan rotasyondan çıkarın — çalışan yürütmeler tamamlanır, yenisi atanmaz. Main instance için kilitli açıktır: dosya, plugin ve coding-agent işleri, toggle ne derse desin orada çalışır |
| Weight | Dağıtılabilir çalışmalardan aldığı pay |

## Bir cluster'da eşzamanlılık sınırları

Bir workflow'un [eşzamanlılık sınırı](./webhooks.md#concurrency-limit-and-queued-runs) PostgreSQL'de sayılır, bu nedenle her örnek ve her süreç genelinde geçerlidir: iki örnek asla bir workflow'dan izin verilen sınırdan fazlasını çalıştırmaz. Bir slot bekleyen çalıştırma, başladığında diğer çalıştırmalarla aynı kurallara göre yerleştirilir, bu nedenle main üzerinde kalması gereken çalıştırma orada kalmaya devam eder. Bu çalıştırmaları yürüten kuyruk worker'ı artık tek bir örnek dahil olmak üzere her kurulumda başlar ve yalnızca kendi örneğinin kuyruğa aldığı çalıştırmaları üstlenir. Bu, tek bir örneğin her süreçte kuyruk uyandırma `LISTEN` bağlantısını da tuttuğu anlamına gelir; bu nedenle bağlantı bütçesini bir cluster örneği gibi ayarlayın.

## Çalışma geçmişi

Yürütme geçmişindeki her çalışma, kendisini yürüten instance'ı adlandırır ve her iki geçmiş iletişim kutusu da tek bir instance'a göre filtreleyebilir. Filtre, instance'ın adını gösterirken id'si üzerinden eşleşir, böylece bir instance'ı yeniden adlandırmak eski çalışmaların ne söylediğini değiştirmez.

Bunların hiçbiri tek instance'lık bir kurulumda görünmez: alanlar boştur, hiçbir etiket gösterilmez ve hiçbir filtre sunulmaz.
## Hata Davranışı

**Bir worker çalışma ortasında çökerse**, heartbeat'i bayatlar ve leader'ın mevcut kurtarma taraması execution'ı canlı bir instance üzerinde yeniden çalıştırır. Sahiplendiği kuyruk satırı ayrı olarak kapatılır: bu satır için etkin bir execution kalmadığında ve iki dakikalık bir ek süre geçtiğinde, leader satırı başarısız olarak işaretler ve sonucu bekleyen kim varsa onu uyandırır. Tek başına yaş hiçbir zaman tetikleyici değildir, bu nedenle meşru şekilde uzun süren bir çalışma olduğu gibi bırakılır; ve satır yeniden kuyruğa alınmak yerine başarısız olarak işaretlenir, çünkü kurtarma zaten yeniden çalıştırmanın sahibidir ve yeniden kuyruğa alma aynı workflow'u iki kez çalıştırırdı.

**Main çökerse**, cron bir worker'dan ateşlenmeye devam eder ve dağıtılabilir çalışmalar yürütülmeye devam eder. Main'e ihtiyaç duyan çalışmalar kuyruğa girip bekler ve main geri döndüğünde boşalır — ancak yalnızca misfire ek süresi penceresi içinde (`HEYM_CRON_MISFIRE_GRACE_SECONDS`, varsayılan olarak 600 saniye). Bundan daha eski olan her şey, saatlerce birikmiş işi tek seferde yeniden oynatmak yerine, nedeni kaydedilerek atlanmış olarak kapatılır.

Main çökmüşken UI, API, MCP ve editör kullanılamaz, çünkü giriş noktaları oraya yönlenir.

## İlgili

- [Çalıştırma ve Dağıtım](../getting-started/running-and-deployment.md) – Önce tek bir instance dağıtın; ortam değişkenleri ve anahtar kurulumu orada yer alır
- [Ayarlar](./user-settings.md) – Instances sekmesi ve bunu kimlerin görebileceği
- [Trace'ler](../tabs/traces-tab.md) – Bölünmeyi değiştirmeden önce instance'lar arasındaki gerçek çalışma sürelerini karşılaştırın
- [Güvenlik](./security.md) – Her instance'ın neden `SECRET_KEY` ve `ENCRYPTION_KEY` paylaşması gerektiği
