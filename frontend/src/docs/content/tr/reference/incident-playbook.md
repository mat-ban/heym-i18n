# Heym Incident Playbook (L0)

Bir Heym olayını doğrulamak, kullanıcı etkisini değerlendirmek, bir önem derecesi (severity) seçmek ve doğru kurtarma prosedürü ile sorumlusuna ulaşmak için bu playbook'u kullanın.

Ayrıntılı prosedürler: [Heym Runbook (L1)](./operations-runbook.md)

Son inceleme: 2026-11-10. Kapsam: Docker Compose veya Kubernetes üzerinde self-hosted Heym, tek örnek veya cluster.

## Dağıtım devir teslimi (Deployment handover)

Bu belgeleri nöbette (on-call) kullanmadan önce her ortam için bu tabloyu doldurun. Adlar, URL'ler, kapasite hedefleri ve kurtarma hedefleri dağıtıma özeldir. Depodaki örnekler bir üretim envanteri değildir.

| Öğe | Dağıtım değeri |
| --- | --- |
| Ortam ve genel Heym URL'si | `<environment>`, `<public-url>` |
| Platform nöbetçisi ve yedeği | `<rotation-or-contact>`, `<backup-contact>` |
| Olay kanalı ve olay takip sistemi | `<channel>`, `<tracker-url>` |
| Veritabanı nöbetçisi ve veritabanı tanımlayıcısı | `<contact>`, `<database-id>` |
| Altyapı, ağ ve depolama sahipleri | `<contacts>` |
| Sürüm sorumlusu ve dağıtım sistemi | `<contact>`, `<deployment-url>` |
| Uygulama hataları, gecikme ve kullanılabilirlik gösterge paneli | `<dashboard-url>` |
| Host veya pod CPU, bellek, disk ve yeniden başlatma gösterge paneli | `<dashboard-url>` |
| PostgreSQL bağlantıları, kilitler, disk ve replikasyon gösterge paneli | `<dashboard-url>` |
| Günlükler ve isteğe bağlı OTel trace arka ucu | `<logs-url>`, `<trace-url-or-disabled>` |
| Compose projesi/dosyaları veya Kubernetes bağlamı/namespace | `<exact-target>` |
| Main, worker'lar, veritabanı ve depolama konumları | `<services-or-deployments>`, `<storage-ids>` |
| Onaylanmış smoke workflow ve beklenen sonuç | `<workflow-id>`, `<safe-input>`, `<expected-result>` |
| Veritabanı ve dosya yedekleme prosedürü, en son geri yükleme testi | `<procedure-url>`, `<test-date>` |
| Kurtarma süresi ve kurtarma noktası hedefleri (RTO, RPO) | `<RTO>`, `<RPO>` |

İletişim bilgilerini ve gösterge paneli bağlantılarını dağıtımın erişim kısıtlamalı operasyonel kopyasında saklayın. Kanıtlar, kimlik bilgileri veya workflow payload'ları yerine kimlikler (ID), zaman damgaları, sayımlar ve temizlenmiş hatalar içermelidir.

## Platform envanteri

| Bileşen | Sorumluluk | Olay etkisi |
| --- | --- | --- |
| Frontend ve ana backend (main) | UI, API, MCP, Portal, etkileşimli yürütme | Genel rotayı ve main sürecini ayrı ayrı kontrol edin |
| PostgreSQL | Uygulama durumu, yürütme kaydı, run queue, eşzamanlılık yuvaları, koordinasyon ve bildirimler | Bir veritabanı kesintisi hem istek işlemeyi hem de arka plan yürütmesini durdurabilir |
| Worker örnekleri (cluster modu etkinken) | Kuyruktaki uygun arka plan çalıştırmaları | Sağlıklı worker'lar, main'in genel endpoint'lerinin yerini almaz |
| Seçilen leader süreci | Cron, uyarı değerlendirmesi, arka plan koordinasyonu | Uyumlu bir worker leader olabilir; bu, rolünü main olarak değiştirmez |
| Main'in kalıcı depolaması | Drive dosyaları, yüklü eklentiler ve kodlama aracısı çalışma alanları | Depolamayı main ile birlikte kurtarın; ingress'i bir worker'a yönlendirmek depolamayı kurtarmaz |
| Her yürütme örneğindeki sandbox backend | Yalıtılmış yürütme için Docker konteynerleri veya Kubernetes pod'ları | Arızalı bir sandbox arka ucu, UI çalışırken seçilen düğümleri etkileyebilir |
| Workflow bağımlılıkları | Model sağlayıcıları, MCP sunucuları, harici API'ler, veri depoları ve mesajlaşma servisleri | Tek bir bağımlılığın mı yoksa tüm platformun mu arızalandığını belirleyin |
| İsteğe bağlı OTel toplayıcı | Dışa aktarılan workflow, düğüm ve Agent araç span'leri | Dışa aktarılan trace'lerin eksik olması tek başına yürütmenin başarısız olduğunu kanıtlamaz |

Heym'in yerleşik çalıştırma kuyruğu PostgreSQL kullanır. Redis, RabbitMQ ve vektör depoları workflow bağımlılıkları olabilir; yerleşik kuyruk için zorunlu servisler değildir.

`GET /api/health` yalnızca süreç sağlığını ve sürümünü bildirir. PostgreSQL'i, kuyruğu, leader seçimini, sandbox kapasitesini veya kimlik bilgisi senkronizasyonunu test etmez. Yeşil bir yanıt tek bir kontroldür, uçtan uca hazır olma garantisi değildir.

## İlk beş dakika

| Adım | Eylem | Karar veya kanıt |
| --- | --- | --- |
| 1 | Uyarıyı onaylayın ve ortamı, servisi ve başlangıç zamanını doğrulayın | UTC zaman damgalarını ve en son sürüm/yapılandırma değişikliğini kaydedin |
| 2 | Genel UI'ı ve `/api/health` uç noktasını, ardından doğrudan main backend'i kontrol edin | Sağlıklı bir doğrudan backend ile genel hata, yönlendirme veya frontend sorununa işaret eder |
| 3 | PostgreSQL bağlantısını ve bağlantı havuzu baskısını kontrol edin | Uygulama servislerini yeniden başlatmadan önce veritabanı arızalarını L1'e yönlendirin |
| 4 | Konteyner/pod durumunu, CPU, bellek, depolama ve son hataları kontrol edin | Altyapı arızasını, yükü ve workflow'a özgü arızayı birbirinden ayırın |
| 5 | Cluster modunda **Ayarlar > Örnekler**, kuyruk durumları ve leader kanıtlarını kontrol edin | Main kaybını, çevrimdışı/uyumsuz worker'ları veya yalnızca main işlerini belirleyin |
| 6 | Önem derecesi atayın ve yönlendirme tablosundan bir hafifletme başlatın | P1/P2 için bir olay açın ve ilgili sorumluyu derhal dahil edin |
| 7 | Güvenli bir üretim modu workflow çalıştırmasını doğrulayın ve kurtarmayı izleyin | Kuyruk yaşının, hataların ve kaynakların iyileştiğini onaylayın; bir sonraki güncelleme zamanını belirleyin |

Bir sürüm dağıtımı arıza ile çakışıyorsa, [Hatalı dağıtım veya yapılandırma gerilemesi](./operations-runbook.md#bad-deployment-or-configuration-regression) bölümünü inceleyin. Geri almadan (rollback) önce şema uyumluluğunu kontrol edin.

## Önem derecesi ve yanıt

Bunlar başlangıç yanıt hedefleridir. Dağıtımın olay politikasını ve iş etkisini daha katı olduğunda uygulayın.

| Önem Derecesi | Örnekler | Yanıt |
| --- | --- | --- |
| P1 | Main tüm kullanıcılar için kullanılamıyor; veritabanı kullanılamıyor veya yazmalar başarısız oluyor; yaygın yürütme arızası; kritik alım tüm workflow'larda kullanılamıyor | Derhal hafifletme, olay kaydı, platform ve bağımlılık nöbetçisi |
| P2 | Büyüyen iş yığını; kaybolan worker kapasitesi; bağlantı tükenmesine yaklaşma; paylaşılan kapasiteyi düşüren tek bir workflow; tekrarlanan OOM | Hafifletmeye derhal başlayın, 15 dakika içinde sınırlandırmayı hedefleyin, olay kaydı |
| P3 | Yalıtılmış workflow/sağlayıcı arızası; sağlıklı platform kapasitesi ile sınırlı etki | Workflow veya bağımlılık sahibi, takip kaydı ve nöbetçi notu |
| P4 | Bilgilendirme sinyali, beklenen kapasite trendi, doğrulanmış yanlış pozitif | Onaylayın, belgeleyin ve gerekirse izlemeyi ayarlayın |

## Sinyalden L1'e yönlendirme

Uyarı bağlantılarını yapılandırırken bu göreceli bağlantıları kullanın. Bir izleme servisi mutlak bir URL gerektirdiğinde, barındırılan operasyonel kopyanızın konumunu önek olarak ekleyin.

| Sinyal | Buradan başlayın |
| --- | --- |
| UI/API kullanılamıyor, genel 5xx, süreç sağlık kontrolü hatası | [UI veya API kapalı](./operations-runbook.md#ui-or-api-down) |
| PostgreSQL erişilemez, bağlantı reddedildi, yazma hatası | [Veritabanı kapalı](./operations-runbook.md#postgresql-down-or-not-writable) |
| Çok fazla istemci, havuz zaman aşımı, kilit beklemeleri, aktif bağlantı artışı | [Veritabanı bağlantıları ve kilitler](./operations-runbook.md#active-db-connections-pool-saturation-and-locks) |
| Kontrollü backend/worker yeniden başlatması gerekiyor | [Servisi yeniden başlatma](./operations-runbook.md#controlled-service-restart) |
| Yürütme sayısı, toplam süre, token, CPU veya bellek artışı | [En çok kaynak tüketen workflow'lar](./operations-runbook.md#most-resource-consuming-workflows) |
| Büyüyen kuyruk, bekleyen veya takılmış görünen çalıştırmalar | [Kuyruk yığılması](./operations-runbook.md#queue-backlog-or-apparently-stuck-runs) |
| Çevrimdışı/Uyumsuz örnek, boşta worker, zamanlayıcı veya dağıtım sorunu | [Cluster kontrolleri](./operations-runbook.md#cluster-mode-checks) |
| Worker'lar sağlıklı kalırken main kaybedildi | [Main örneği kullanılamıyor](./operations-runbook.md#main-instance-unavailable-while-workers-are-live) |
| Webhook hataları, MCP/Portal arızaları, SSE bağlantı kesilmeleri | [Ingress ve yürütme endpoint'leri](./operations-runbook.md#webhook-mcp-portal-or-streaming-failures) |
| OOM, CrashLoop, Pending, disk dolu, persistent volume hatası | [Konteyner, pod veya depolama sorunu](./operations-runbook.md#container-pod-oom-or-storage-issue) |
| İmaj, ortam veya şema değişikliğinden sonra hata artışı | [Hatalı dağıtım](./operations-runbook.md#bad-deployment-or-configuration-regression) |
| Agent/LLM/MCP sağlayıcı hataları, 429, kimlik bilgisi hatası | [Model veya entegrasyon hatası](./operations-runbook.md#model-credential-or-integration-failure) |
| Code/Playwright/skill/kodlama aracısı sandbox arızaları | [Sandbox hatası](./operations-runbook.md#sandbox-failure) |
| Kurtarma hedefleri karşılayamıyor; veritabanı veya dosyalar kayboldu | [Kurtarma ve olağanüstü durum yanıtı](./operations-runbook.md#recovery-and-disaster-response) |

## Üst kademeye iletme (Escalation)

| Bulgu | Dahil edin | Sağlayın |
| --- | --- | --- |
| Birden fazla alan veya workflow etkilendi | Platform nöbetçisi ve olay lideri | Ortam, kapsam, başlangıç zamanı, hafifletme, sonraki güncelleme |
| Veritabanı kullanılamıyor, doymuş, kilitli veya disk alanı bitti | Veritabanı nöbetçisi | Veritabanı ID, bağlantı sayıları, engelleyici PID'ler, temizlenmiş hatalar, depolama durumu |
| Pod/düğüm arızası, depolama bağlama, sandbox kapasitesi | Altyapı/depolama sorumlusu | Bağlam, namespace, iş yükü, pod olayları, kaynak baskısı |
| Doğrudan backend çalışırken genel rota başarısız oluyor | Ağ/ingress sorumlusu | Etkilenen rotalar, durum kodları, gecikme, backend karşılaştırması |
| Tek bir workflow yüke hakim veya tek başına başarısız oluyor | Workflow sorumlusu | Workflow/çalıştırma ID'leri, trigger kaynağı, oran, zaman penceresi, geçici limitler |
| İlişkili dağıtım/yapılandırma değişikliği | Sürüm sorumlusu | Çalışan imaj özeti, dağıtım zamanı, şema revizyonu, bilinen son iyi sürüm |
| Sağlayıcı kotası/kimlik doğrulama/kullanılabilirlik | Kimlik bilgisi veya entegrasyon sorumlusu | Sağlayıcı, model/servis, durum kodu, güvenliyse istek ID'si; gizli değerler yok |

İlk hafifletmeden sonra P1/P2 etkisi devam ederse, önceden toplanan kanıtlarla derhal eskalasyon yapın. Kapsamlı bir kök neden analizini beklemeyin.

## Arıza beklentileri

| Arıza | Ne devam edebilir | İlk eylem |
| --- | --- | --- |
| PostgreSQL kullanılamıyor | Statik frontend hala yüklenebilir | Veritabanı yolunu geri yükleyin; her uygulama örneğini yeniden başlatmayın |
| Main kullanılamıyor, worker'lar sağlıklı | Uyumlu bir worker liderlik ediyorsa uygun arka plan işleri ve zamanlama devam edebilir | Main'i kalıcı depolamasıyla birlikte geri yükleyin; genel UI/API/MCP/Portal kullanılamaz durumda kalır |
| Worker kullanılamıyor | Diğer uygun örnekler yeniden atanan kuyruktaki işleri devralır | Trafik eklemeden önce yerleşimi, yedek kapasiteyi ve kurtarmayı kontrol edin |
| Kesintiye uğrayan çalıştırma | Uygun kurtarılabilir çalıştırmalar baştan bir kez yeniden başlatılabilir | Manuel yeniden çalıştırmadan önce otomatik kurtarmayı ve harici yan etkileri kontrol edin |
| Yalnızca main iş yükü aşırı yükü | Worker'lar boşta kalabilir | Sorunlu girişi azaltın veya main kapasitesini artırın; ağırlık değişiklikleri sabitlenmiş işi taşıyamaz |
| Dahili uyarılar kullanılamıyor | Harici çalışma süresi/veritabanı/altyapı izlemesi hala çalışabilir | Heym dışındaki izlemeyi kullanın; Heym uyarıları aynı veritabanına ve zamanlayıcıya bağlıdır |
| Sandbox veya sağlayıcı kullanılamıyor | Bu bağımlılığı olmayan workflow'lar çalışabilir | Etkilenen workflow'ları izole edin ve bağımlılığı onarın |

## Kurtarma ve olay kapatma

1. Genel erişimi, veritabanı erişimini, hedeflenen örnek uygunluğunu ve güvenli bir üretim modu smoke workflow'unu doğrulayın. Bir editör testi worker dağıtımını kanıtlamaz.
2. Kararlı hataları, gecikmeyi, kaynak kullanımını ve azalan kuyruk yaşını en az 10 dakika boyunca gözlemleyin. Ayrıca beklenen bir sonraki kritik zamanlamayı veya üzerinde mutabık kalınan eşdeğer bir smoke kontrolünü izleyin.
3. Başarısız, kurtarılmış, atlanmış, süresi dolmuş ve bekleyen çalıştırmaları workflow sahipleriyle uzlaştırın. Herhangi bir şeyi yeniden çalıştırmadan önce harici yan etkileri kontrol edin.
4. Geçici trigger duraklatmalarını, limitleri ve worker ağırlıklarını kademeli olarak geri yükleyin. Kalan her kısıtlamaya bir sahip ve son kullanma süresi atayın.
5. Olayı etki, UTC zaman çizelgesi, eylemler, kanıtlar ve kalan risklerle güncelleyin. P1/P2 için bir kök neden incelemesi atayın ve eksik bir prosedür varsa her iki belgeyi de güncelleyin.

## İlgili operasyonel referanslar

- [L1 komut kurulumu ve kontrolleri](./operations-runbook.md#command-setup)
- [Çalıştırma ve dağıtım](../getting-started/running-and-deployment.md)
- [Yük dağıtımı](./cluster.md)
- [Kubernetes dağıtımı](../getting-started/kubernetes.md)
- [Güvenlik ve anahtar rotasyonu](./security.md)
