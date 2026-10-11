# Alerts Sekmesi

**Alerts** sekmesi, bir zaman penceresi üzerinde eşik koşulları tanımlamanıza ve bu eşikler aşıldığında haberdar edilmenize olanak tanır. Heym, yürütme sonuçlarını, çalışma süresini ve LLM harcamasını zaten kaydeder, ancak bunların hiçbirini kendiliğinden bildirmez. Bir alert, bunu talep etme yolunuzdur.

Her alert, seçtiğiniz bir **zaman penceresi** üzerinde değerlendirilir, asla tek bir olay üzerinde değil. Tek bir başarısız çalışma gürültüdür. On dakikada on iki başarısız çalışma ise bir olaydır.

## Alert Türleri

| Tür | Yanıtladığı soru | Sayının kaynağı |
|---|---|---|
| **Hata eşiği** | Bu, pencerede N defadan fazla mı başarısız oldu? | Hata durumuna sahip [Yürütme geçmişi](../reference/execution-history.md) satırları |
| **Workflow süresi** | Çalışmalar pencerede beklenenden daha mı yavaşladı? | Yürütme süresi; maksimum, ortalama veya 95. yüzdelik olarak toplanır |
| **Token / USD maliyeti** | Harcama pencerede bir bütçeyi aştı mı? | [LLM izleri](./traces-tab.md) ve LLM maliyet tablosu |
| **Yürütme sayısı** | Bu, olması gerekenden çok daha sık mı çalıştı? | Yürütme geçmişi satır sayısı |

### Hata eşiği

Pencere boyunca başarısız çalışmaları sayar ve sayı eşiğinize ulaştığında tetiklenir. Her hatayı tek tek yakalamak yerine bir pencere üzerinde saydığı için, tek bir geçici hata sizi rahatsız etmez.

### Workflow süresi

Pencere içindeki çalışma süresini ölçer. **max** (en yavaş çalışma), **average** veya **p95** seçeneklerinden birini seçin. p95 değeri, [Analytics sekmesi](./analytics-tab.md) ile aynı yüzdelik hesaplamasını kullanır; böylece alert ile gecikme grafiği aynı pencere için asla çelişmez.

**Penceredeki minimum çalışma sayısı** bunu tutarlı kılar. Neredeyse boş bir penceredeki en yavaş çalışma yalnızca o tek çalışmadır; bu nedenle örneğin 3 gibi bir minimum belirlemek, alert'in gürültü üzerinde tetiklenmesini engeller.

### Token / USD maliyeti

Pencere boyunca LLM harcamasını, toplam token veya ABD doları olarak toplar. Dolar tutarları, [Traces sekmesi](./traces-tab.md) ve [LLM Cost Table](./datatable-tab.md#llm-cost-table-system-table) ile aynı fiyatlandırma tablosu üzerinden çözümlenir; böylece bir maliyet alert'i ile maliyet sayfası her zaman uyuşur.

Kapsam tüm workflow'larınız olduğunda, bu, bir workflow dışında yapılan LLM çağrılarını da içerir; örneğin [Chat sekmesi](./chat-tab.md) ve [AI Assistant](../reference/ai-assistant.md). Kodlama ajanı kullanımı (Codex, OpenCode) dahil edilmez.

Fiyatlandırma satırı olmayan modeller, sessizce sıfır olarak sayılmak yerine alert'in bağlamında fiyatlandırılmamış olarak bildirilir.

### Yürütme sayısı

Pencerede herhangi bir durumdaki çalışmaları sayar. Yanlış giden bir trigger'ı yakalayan tam da budur: normalde saatte 20 kez çalışan bir workflow'un aniden 2.000 kez çalışması. Tetiklenme kaydı, trigger kaynağı başına bir döküm içerir; çünkü "bu neden oldu" sorusunun yanıtı genellikle budur.

## Kapsam

Bir alert ya **tek bir workflow'u** ya da **tüm workflow'larınızı** izler.

"Tüm workflow'larınız", alert'in sahibinin erişebildiği her workflow anlamına gelir. Bu, kasıtlı olarak Heym örneğindeki her workflow anlamına gelmez: alert'ler paylaşılabilir ve bir alert'i paylaşmak, birine açamadığı workflow'lar için toplu sayılar vermemelidir.

## Sihirbaz

Bir alert oluşturmak beş adımdan geçer.

1. **Tür** — yukarıdaki dört türden birini seçin.
2. **Kapsam** — bir workflow veya hepsi.
3. **Koşul** — zaman penceresi ve o türe ait eşik alanları.
4. **Yanıt** — tetiklendiğinde ne çalışır ve size ne sıklıkla bildirmeye devam eder.
5. **İnceleme** — adlandırın ve backtest'i görün.

### Backtest

İnceleme adımı, kaydetmeden önce gerçekten önemli olan soruyu yanıtlar: *son 24 saat içinde bu kaç kez tetiklenirdi?*

Tetiklenme sayısını ve eşiğinize karşı gözlemlenen en yüksek değeri bildirir. Koşulun 400 kez tetikleneceğini söylüyorsa, rahatsız edildikten sonra değil, kaydetmeden önce eşiği düzeltirsiniz. Geriye bakış süresini 3 veya 7 güne genişletebilirsiniz.

## AI ile Taslak Oluşturma

İlk adımın üst kısmında, ne istediğinizi sade bir dille tanımladığınız bir kutu bulunur:

> Fatura senkronizasyonu 10 dakikada 5 defadan fazla başarısız olursa beni uyar

Heym bunu bir alert tanımına dönüştürür, doldurabildiği her adımı doldurur ve AI tarafından doldurulan alanlar işaretlenmiş şekilde ileri atlar; böylece yeniden yazmak yerine onaylarsınız. Eksiksiz bir istek sizi İnceleme adımına getirir.

**Kısmi bir istek bile sizi ileri taşır.** Yalnızca "5 kez başarısız olursa beni uyar" derseniz, sayı doldurulmuş bir hata eşiği alert'i, geri kalanı için varsayılanlar ve sihirbazın hâlâ size ihtiyaç duyduğu ilk adımda açılmasını elde edersiniz: bu durumda hiçbir workflow adlandırılmadığı için Kapsam. Üst kısımdaki bir not, karar verilmesi gerekenin ne olduğunu söyler. Next veya Create'i asla engellemez.

Aynı durum, modelin erişemeyeceğiniz bir workflow'u adlandırması veya alanları eksik bir koşul döndürmesi durumunda da geçerlidir. Anlamlı olan kısımlar korunur, geri kalanı o alert türü için varsayılanlara döner ve siz oradan ayarlarsınız. Buradaki hiçbir şey doğrulamayı atlamaz: hem sihirbazın kendi kuralları hem de API, kaydettiğinizde alert'i yeniden kontrol eder.

## Tekrarlama Davranışı

Bir alarm tetiklendikten sonra tetiklenmiş duruma geçer. Bundan sonra ne olacağı 4. adımdaki tercihinize bağlıdır.

- **Bir kez bildir, toparlanana kadar** (varsayılan) — bir kez tetiklenir, ardından koşul geçerli olduğu sürece sessiz kalır. Metrik eşiğin altına düştüğünde alarm OK durumuna döner ve yeniden tetiklenmeye uygun hale gelir. Toparlanma bir durum değişikliğidir, olay değildir: bir tetiklenme kaydı oluşturmaz ve notify workflow'unu çalıştırmaz.
- **Belirli aralıklarla bildirmeye devam et** — koşul geçerli olduğu sürece her N dakikada bir yeniden tetiklenir.

Varsayılanın bulunmasının nedeni, 60 saniyede bir kontrol edilen bozuk bir workflow'un aksi halde saatte 60 tetiklenme üretecek olmasıdır; alarmların susturulmasının sebebi budur.

## Tetiklendiğinde Bir Workflow Çalıştırma

4. adım, "bu tetiklendiğinde ne olmalı" sorusuna üç yanıt sunar:

- **Yeni bir workflow oluştur ve ata** (varsayılan) — alarmı kaydetmek aynı zamanda *"&lt;alarm adı&gt; notification"* adında bir workflow oluşturur ve onu bağlar. Bu workflow, alanları tam olarak aşağıdaki payload olan bir input node ile gelir; böylece `$alert.body.observed_value` ve geri kalanı anında çözümlenir ve yalnızca mesajı ileten node'u eklemeniz gerekir. Alarm kartındaki **Go to workflow** onu açar. Bu varsayılandır çünkü boşluğa tetiklenen bir alarmın gözden kaçması kolaydır.
- **Mevcut bir workflow seç** — zaten oluşturduğunuz bir şeyi çalıştırın.
- **Hiçbir şey yapma** — tetiklenme yine de sekmede kaydedilir, sadece hiçbir şey çalıştırmaz.

Alarm payload'u o workflow'un input body'si olarak gelir:

```json
{
  "alert_id": "...",
  "alert_name": "Invoice sync failures",
  "alert_type": "error_threshold",
  "condition": "5+ errors in 10m",
  "scope": "workflow",
  "workflows": [{ "id": "...", "name": "Invoice Sync", "value": 12 }],
  "observed_value": 12,
  "threshold_value": 5,
  "window_start": "2026-08-09T11:50:00+00:00",
  "window_end": "2026-08-09T12:00:00+00:00",
  "window_minutes": 10,
  "context": { "error_count": 12 }
}
```

### Sayıyı hangi workflow üretti

`workflows`, bir workflow'un göründüğü tek yerdir. Okumaya katkıda bulunan her workflow'u, her biri kendi `value` değeriyle listeler — alarm türüne bağlı olarak o workflow'un hata sayısı, çalıştırma sayısı, milisaniye cinsinden en yavaş çalıştırması veya harcaması. Liste `value` değerine göre, en yüksekten başlayarak sıralanır; yani `workflows[0]` en kötü durumdaki olandır.

**Her zaman bir dizidir**: tek workflow kapsamı altında tek elemanlı, "tüm workflow'larım" altında çok elemanlı ve hiçbir şey ilişkilendirilemediğinde null yerine boştur. Bir notify workflow'u, şekil kontrolü yapmadan bunu yineleyebilir.

Kasıtlı olarak tekil bir `workflow_id` yoktur. Bu, metriği değil alarmın kapsamını tanımlıyordu; bu yüzden sistem kapsamı altında `null` idi ve "hangi workflow?" sorusunun en çok önem taşıdığı durum tam da buydu. `observed_value`, eşiğin karşılaştırıldığı toplam değer olarak kalır; workflow başına `value` alanları bunun nereden geldiğini açıklar.

Alarmlar Slack'e, e-postaya, Telegram'a veya başka herhangi bir yere bu şekilde ulaşır: ayrı bir bildirim sistemi yerine, zaten sahip olduğunuz [node'lar](../reference/node-types.md) ile.

Bir alarm, izlediği workflow'u bildiremez. Bu bir döngü olurdu; en açık şekilde, her bildirimin ölçtüğü sayıya eklediği bir yürütme sayısı alarmı için.

Notify çalıştırmaları sıradan yürütmelerdir; bu yüzden diğer tüm çalıştırmalar gibi [yürütme geçmişinde](../reference/execution-history.md) görünürler. Başarısız olan bir notify workflow'u tetiklenme üzerinde kaydedilir ancak tetiklenmenin kendisinin kaydedilmesini asla engellemez.

Bir notify workflow'u, alarmın sahibi olarak, onların kimlik bilgileri ve global değişkenleriyle çalışır; tam olarak onlar kendileri çalıştırmış gibi. Sizinle paylaşılan bir workflow'u seçmek, o kişinin kimlik bilgilerini ödünç almaz. Sahibi notify workflow'una erişimini kaybederse, tetiklenme yine de kaydedilir ancak notify çalıştırması atlanır.

## Tetiklenme Geçmişi

Alarm listesinin altında tetiklenme geçmişi bulunur: neyin tetiklendiği, ne zaman tetiklendiği, eşiğe karşı gözlemlenen değer, değerlendirilen tam pencere ve notify sonucu.

Bir tetiklenmeyi onaylamak satırı işaretler ve alarmın rozetini **Firing** durumundan **Acknowledged** durumuna değiştirir. Bu sizinle ilgili bir ifadedir, alarmla ilgili değil: koşul hâlâ geçerlidir ve metrik eşiğin altına düştüğünde alarm kendiliğinden **OK** durumuna döner.

Her kayıt, tetiklendiği anda katkıda bulunan ayrıntıyı saklar: başarısız yürütme id'leri ve hata mesajları, model başına harcama veya trigger kaynağı dağılımı. Bu kasıtlıdır. Pencere geçmiştir ve sonradan yeniden hesaplamak farklı bir sonuç verebilir.

Tetiklenme kayıtları 90 gün boyunca saklanır.

## Chat'e Alarmlar Hakkında Soru Sorma

[Chat sekmesi](./chat-tab.md) alarmlarınız hakkındaki soruları yanıtlayabilir:

- "Hangi alarmlarım var?"
- "Invoice workflow'unda bir alarm var mı?"
- "Cost alarmı neden tetiklendi?"
- "Bu en son ne zaman tetiklendi?"

"Neden tetiklendi" sorusu için Chat, tetiklenme kaydından gerçek gözlemlenen değeri, eşiği ve zaman penceresini, katkıda bulunan ayrıntıyla birlikte aktarır.

## Paylaşım

Alarmlar tek tek kullanıcılarla veya [takımlarla](./teams-tab.md) paylaşılabilir. Paylaştığınız kişiler alarmı ve tetiklenme geçmişini görebilir. Yalnızca sahibi alarmı düzenleyebilir, duraklatabilir, silebilir veya yeniden paylaşabilir.

### Workflow erişimi kaldırıldığında

Tek bir workflow üzerindeki bir alert, o workflow'un çalıştırma metriklerini okumaya devam eder; bu nedenle birinin workflow'a erişimini kaldırmak, o workflow üzerindeki alert'lerine ne olacağını da belirler:

- **Bir kullanıcı veya team paylaşımını kaldırmak**, workflow sahibine o kullanıcının veya team'in workflow üzerindeki alert'lerinin de durdurulup durdurulmayacağını sorar. Durdurma varsayılandır. Durdurulan alert'ler duraklatılır, silinmez ve her biri [audit log](../reference/audit.md) içinde `alert.disable_on_access_revoke` olarak kaydedilir.
- **Bir team üyesini kaldırmak veya bir team'i silmek**, etkilenen alert'leri her zaman durdurur; çünkü bu değişikliği yapan kişi mutlaka workflow sahibi değildir.
- Bir alert yalnızca sahibinin workflow'a başka bir yolu yoksa, örneğin doğrudan bir paylaşım veya başka bir team yoksa durdurulur.
- Duraklatılmış bir alert'i sürdürmek veya test etmek, sahibinin erişimini yeniden kontrol eder; bu nedenle durdurulmuş bir alert, erişim olmadan yeniden açılamaz veya workflow'un metriklerini okumak için kullanılamaz. Erişim olmadan **Resume** düğmesine basmak, workflow sahibinin önce yeniden paylaşması gerektiğini açıklayan bir bildirim gösterir.

## Alert'leri Yönetme

- **Pause / Resume** — duraklatılmış bir alert hiçbir zaman değerlendirilmez. Resume, bir sonraki aralığı beklemeden hemen kontrol eder.
- **Edit** — değişiklikler bir bütün olarak doğrulanır; böylece kısmi bir düzenleme alert'i geçersiz bir durumda bırakamaz.
- **Delete** — alert'i ve tetiklenme geçmişini kaldırır.

## Ayrıca Bakınız

- [Analytics Tab](./analytics-tab.md) — bu eşiklerin çizildiği grafikler
- [Traces Tab](./traces-tab.md) — LLM maliyet rakamlarının geldiği yer
- [Execution History](../reference/execution-history.md) — error, duration ve count alert'lerinin ölçtüğü çalıştırmalar
- [Chat Tab](./chat-tab.md) — alert'leri doğal dilde sorgulama
- [Teams](./teams-tab.md) — alert'leri bir team ile paylaşma
