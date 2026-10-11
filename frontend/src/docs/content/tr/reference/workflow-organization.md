# Workflow Organizasyonu

Heym, workflow'ları klasörlerde düzenlemenize, alt klasörler oluşturmanıza ve workflow'ları silinmek üzere zamanlamanıza olanak tanır. Arayüz genel görünümü için [Workflows Sekmesi](../tabs/workflows-tab.md) bölümüne bakın.

## Klasörler ve Alt Klasörler

Klasörler bir ağaç yapısı oluşturur. Her klasörün şunları vardır:

- **Ad** – Görünen ad
- **Üst** – `parent_id` başka bir klasöre bağlanır; `null` kök anlamına gelir
- **Workflow'lar** – Workflow'lar `folder_id` aracılığıyla klasörlere taşınabilir

### API

| Endpoint | Amaç |
|----------|---------|
| `GET /folders` | Yalnızca kök klasörler |
| `GET /folders/tree` | Tam ağaç (alt öğeler + workflow'lar) |
| `GET /folders/{id}` | İçeriğiyle birlikte tek klasör |
| `POST /folders` | Klasör oluştur (`parent_id` isteğe bağlı) |
| `PUT /folders/{id}` | Adı veya `parent_id` değerini güncelle |
| `DELETE /folders/{id}` | Klasörü sil (basamaklı) |
| `PUT /folders/{folder_id}/workflows/{workflow_id}` | Workflow'u klasöre taşı |
| `DELETE /folders/workflows/{workflow_id}/folder` | Workflow'u klasörden kaldır |
| `GET /folders/{id}/export` | Klasörü + tüm alt klasörleri ZIP olarak indir |

### Ağaç Yapısı

Ağaç yanıtı her klasör için `children` ve `workflows` içerir. Paylaşılan workflow'lar bir klasörde `WorkflowShare.folder_id` aracılığıyla görünebilir.

## Workflow'ları Paylaşma

Kullanıcıları e-posta ile davet etmek veya bir [ekiple](./teams.md) paylaşmak için workflow düzenleyicisinde **Paylaş** seçeneğini açın. Her davet ve her ekip paylaşımı bir izin taşır:

| İzin | İşbirlikçinin yapabilecekleri |
|------------|------------------------------|
| **Okuma** | Workflow'u açma, inceleme, yürütme geçmişini görüntüleme ve çalıştırma. Düzenleyici salt okunur modda açılır: Kaydet devre dışıdır ve tuval değiştirilemez. |
| **Yazma** | Okuma izninin tanıdığı her şey, ayrıca tuvali, ayarları, analiz belgesini ve ajan belleğini düzenleme. |

İzin, Paylaş iletişim kutusundaki her girişin yanında gösterilir ve paylaşımı kaldırıp yeniden eklemeye gerek kalmadan o açılır menüden her zaman değiştirilebilir. Bir kullanıcı bir workflow'a birden fazla yoldan ulaştığında (doğrudan bir paylaşım ve bir veya daha fazla ekip), **en yüksek** izin geçerli olur. İzinler kullanıma sunulmadan önce var olan paylaşımlar **Yazma**'dır ve `permission` alanını atlayan API istemcileri de **Yazma** alır.

Yalnızca sahibe ait eylemler hiçbir zaman izne bağlı değildir: bir workflow'u silme, sürümleri geri alma veya temizleme, geçmişi temizleme, paylaşımları yönetme ve aşağıdaki [yalnızca sahibe ait ayarlar](#yalnızca-sahibe-ait-ayarlar), **Yazma** işbirlikçileri için bile sahipte kalır. API üzerinden (`PUT /api/workflows/{id}`, analiz notu, ajan belleği, önbellek temizleme) veya AI Assistant aracılığıyla bir düzenleme gönderen **Okuma** işbirlikçisi, `You have read-only access to this workflow` mesajıyla `403` alır.

Bir workflow'u paylaşmak; tuvale, yürütme geçmişine ve analiz belgesine erişim sağlar. Şunları otomatik olarak paylaşmaz:

- Workflow'daki düğümler tarafından başvurulan **Kimlik Bilgileri**
- [Execute](../nodes/execute-node.md) düğümleri veya ajanlar tarafından çağrılan **Alt workflow'lar**

Alıcıların bu kimlik bilgilerine ve alt workflow'lara ayrıca (aynı kullanıcılar veya ekiplerle) erişim sahibi olması gerekir. Kimlik bilgilerini [Kimlik Bilgileri sekmesinden](../tabs/credentials-tab.md) paylaşın; bkz. [Kimlik Bilgileri Paylaşımı](./credentials-sharing.md). Her alt workflow'u kendi düzenleyicisinin paylaşım iletişim kutusundan paylaşın.

### Yalnızca sahibe ait ayarlar

Paylaşımdan sonra **cURL ile Çalıştır** yapılandırmasının tamamı sahipte kalır. İşbirlikçiler yine iletişim kutusunu açıp oluşturulan komutu kopyalayabilir, ancak kontroller salt okunurdur.

Sahip olmayan biri olarak bunlardan herhangi birini değiştirmek `403` ile reddedilir:

- **Kimlik Doğrulama** (`auth_type`) ve **Başlık Anahtarı** (`auth_header_key`)
- **İstek Gövdesi** modu (`webhook_body_mode`) ve **İstek Yöntemi** (`http_method`)
- **Yanıt Önbelleği** (`cache_ttl_seconds`) ve **Hız Sınırı** (`rate_limit_requests`, `rate_limit_window_seconds`)
- **SSE Akışı** (`sse_enabled`, `sse_node_config`)

**Başlık Değeri** (`auth_header_value`) farklı davranır: işbirlikçilerden tamamen gizlenir ve bir işbirlikçinin yazma işlemi reddedilmek yerine yok sayılır. Düzenleyici alanı maskelenmiş olarak gösterir, dolayısıyla oradaki bir `403` bir saldırıyı işaret etmek yerine sıradan bir kaydetmeyi bozar.

Bloğun yalnızca sahibe ait olmasının nedeni kimlik doğrulamadır: `Anonymous`, kimliği doğrulanmamış çağıranların workflow'u çalıştırmasına izin verir ve oturum açmış bir çağıranı olmayan bir çalıştırma, kimlik bilgilerini ve global değişkenleri çağıran olarak değil **sahip** olarak çözer. Bloğun geri kalanı yayımlanmış istek sözleşmesi ve sahibin maliyet kontrolleridir, dolayısıyla onunla birlikte hareket eder.

Workflow düzeyindeki **Özellikler** panelindeki **Hata durumunda workflow'u çalıştır** (`error_workflow_id`) aynı nedenle yalnızca sahibe aittir: [hata workflow'u](./features.md#error-workflow), başarısız çalıştırmanın kimlik bilgileri ve global değişkenleriyle çalışır; bunlar tetiklenen ve anonim çalıştırmalar için sahibe aittir. İşbirlikçiler ayarı salt okunur olarak görür ve sahip olmayan biri olarak bunu eklemek, değiştirmek veya temizlemek `403` ile reddedilir.

Tuvali, adı ve açıklamayı düzenleme etkilenmez.

### Yürütme token'ları

Bir işbirlikçi, kendisiyle paylaşılan bir workflow için bir yürütme token'ı oluşturabilir. Çalıştırma **token'ı oluşturan kişiye** atfedilir, dolayısıyla sahibin değil o kullanıcının kimlik bilgilerini ve global değişkenlerini kullanır. Yalnızca gerçekten anonim bir çağrı — çağıranı olmayan `auth_type: anonymous` — sahibin bağlamında çalışır.

## Silinmek Üzere Zamanlanmış

Workflow'lar hemen kaldırılmak yerine silinmek üzere zamanlanabilir.

- **Alan**: `scheduled_for_deletion` (null olabilen datetime)
- **Davranış**: Ayarlandığında workflow `folder_id = null` konumuna taşınır ve "Silinmek Üzere Zamanlanmış" bölümünde görünür.
### API

| Endpoint | Amaç |
|----------|---------|
| `PUT /workflows/{id}/schedule-deletion` | `scheduled_for_deletion` değerini ayarlar, `folder_id` değerini temizler |
| `DELETE /workflows/{id}/schedule-deletion` | `scheduled_for_deletion` değerini temizler (geri yükler) |

### Arayüz

- **Çöp kutusuna sürükleyin** – Workflow'ları "Silinmek Üzere Planlandı" alanına bırakarak planlayın
- **Geri Yükle** – Planlamadan çıkarın
- **Hemen Sil** – Kalıcı olarak kaldırmak için çöp kutusu simgesi

### Temizleme Mantığı

Bir cron görevi her gün **23:59**'da (yapılandırılmış saat diliminde) çalışır. Bir workflow yalnızca şu durumda silinir:

- **Tüm başlangıç düğümleri** (gelen kenarı olmayan, sticky/errorHandler hariç düğümler) `active === false` durumunda olduğunda

Herhangi bir başlangıç düğümü hâlâ etkinse, workflow bir sonraki çalıştırmaya kadar kalır.

## Kontrol Paneli Arayüzü

- **Klasör satırları** – Yeni Klasör, genişlet/daralt özellikli özyinelemeli klasör ağacı. Her klasör,
  adının altında isteğe bağlı bir açıklama ve alt klasörler dahil olmak üzere içerdiği workflow'ları
  sayan bir rozet taşır.
- **Klasör eylemleri** – Yeni Alt Klasör, Yeniden Adlandır, Simgeyi Değiştir, ZIP olarak İndir ve Sil
  her klasör satırında satır içi olarak yer alır; sağ tıklama bağlam menüsü aynı kümeyi sunar ve
  telefonlar tek bir menü düğmesi gösterir.
- **Ana alan** – Kök workflow'lar (klasörsüz, planlanmamış) ve Silinmek Üzere Planlandı
- **Klasör bırakma önizlemesi** – Bir workflow sürüklemek, tam klasörü veya alt klasörü vurgular ve
  kart boyutunda bir önizlemede tam yolunu gösterir. Daraltılmış bir klasör kısa bir beklemeden sonra genişler.
- **Kararlı sürükleme geri bildirimi** – Kaynak kart bir sürükleme hayaleti kullanır ve etkin bırakma hedefi,
  aynı klasör içindeki kontrollerin üzerinden kaydırırken veya geçerken seçili kalır.
- **Hedef kontrolü** – Geçerli klasör **Zaten Klasörde** olarak gösterilir ve gereksiz bir taşımayı kabul etmez.
- **Diğer bırakma alanları** – Kök ve "Silinmek Üzere Planlandı", sürüklenen workflow'u kabul edebildiklerinde vurgulanır.
- **ZIP bırakma** – Kök düzeyinde bir klasör yapısını içe aktarmak için workflow alanına bir ZIP dosyası bırakın

## İlgili

- [Workflows Sekmesi](../tabs/workflows-tab.md) – Workflow'ları oluşturun ve yönetin
- [Credentials Paylaşımı](./credentials-sharing.md) – Credential'ları workflow işbirlikçileriyle paylaşın
- [Teams](./teams.md) – Workflow'ları ve credential'ları ekiplerle paylaşın
- [Temel Kavramlar](../getting-started/core-concepts.md) – Workflow'lar, düğümler ve yürütme
- [Workflow Yapısı](./workflow-structure.md) – Workflow'lar için JSON formatı
- [Tetikleyiciler](./triggers.md) – Başlangıç düğümleri ve giriş noktaları
