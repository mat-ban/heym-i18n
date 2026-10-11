# Yapay Zeka Asistanı

**AI Assistant**, Debug panelinden açılan ve düzenleyicinin sağ alt köşesinde başlayan bir sohbet panelidir. Taşımak için başlığı sürükleyin, genişliğini veya yüksekliğini değiştirmek için bir kenarı ya da köşeyi sürükleyin. 360×480 pikselin altına küçülmez. Konum ve boyut bu tarayıcıda hatırlanır. Başlıktaki **Reset position and size** seçeneği paneli sağ alt köşeye geri getirir. Workflow oluşturmak veya değiştirmek için doğal dil kullanın—ne istediğinizi tanımlayın, AI canvas'a uygulanan düğümleri ve kenarları üretir.

Düzenleyici dışındaki dokümantasyon soruları için [Chat with Heym](./chat-with-heym.md) kullanın. Bu arayüz, workflow oluşturma yerine sayfa farkındalıklı ürün yardımı için optimize edilmiştir.

## Paneli Açma

1. Düzenleyicide bir workflow açın
2. Alt kısımdaki **Debug panelini** (yürütme sonuçları alanı) bulun
3. Panel araç çubuğundaki **AI** düğmesine (Sparkles simgesi) tıklayın
4. AI Assistant paneli sağ alt köşede açılır. Taşımak için başlığını sürükleyin veya genişliğini ve yüksekliğini değiştirmek için bir kenarı ya da köşeyi sürükleyin.

Paneli açmak veya kapatmak için düzenleyicinin herhangi bir yerinde `Ctrl + I` / `Cmd + I` tuşlarına basın — kısayol, bir metin girişi odaklanmışken bile çalışır. Bkz. [Keyboard Shortcuts](./keyboard-shortcuts.md).

## Paneli Kapatma

**X** düğmesine tıklayın, `Ctrl + I` / `Cmd + I` tuşlarına basın veya Debug panel araç çubuğundaki **AI** düğmesini değiştirin. Başlık paneli sürükler; kapatmaz.

## Yapılandırma

Mesaj göndermeden önce şunları seçin:

| Ayar | Açıklama |
|---------|-------------|
| **Credential** | [Credentials](../tabs/credentials-tab.md) bölümünden LLM credential (API anahtarı) |
| **Model** | Model adı (örn. `gpt-4o`, `gemini-2.5-flash`) |

Credential'ları [Credentials Tab](../tabs/credentials-tab.md) bölümünden ekleyin. Model listesi seçilen credential'dan yüklenir.

## Agent Mode ve Ask Mode

Panelin iki modu vardır ve panel başlığındaki **Agent / Ask** chip'i ile değiştirilir.

| Mod | Varsayılan | Davranış |
|------|---------|-----------|
| **Agent** | ✓ | Canvas'ı oluşturur ve değiştirir. AI, yanıt tamamlandığında otomatik olarak canvas'a uygulanan bir workflow JSON bloğu üretir. |
| **Ask** | | Yalnızca soruları yanıtlar. Canvas'a asla dokunulmaz. Workflow'unuz, Heym özellikleri hakkında soru sormak veya canvas güncellemesini tetiklemeden tavsiye almak için bunu kullanın. |

Modları istediğiniz zaman değiştirin. Modun değiştirilmesi konuşmayı temizlemez.

Agent modunda, mesaj alanının altındaki **YOLO mode** kutusu asistanın oluşturduğunu çalıştırmasını ve düzeltmesini sağlar. Bkz. [YOLO Mode](#yolo-mode).

## Sohbeti Kullanma

- İsteğinizi girişe yazın (örn. "Kullanıcı girdisini alıp bir LLM'e gönderen bir workflow oluştur")
- Göndermek için **Enter** tuşuna basın (yeni satır için Shift+Enter)
- AI yanıtını akış halinde verir. **Agent** modunda, yanıt \`\`\`json kod bloğu içinde bir workflow içeriyorsa, otomatik olarak ayrıştırılır ve canvas'a uygulanır. **Ask** modunda canvas asla değiştirilmez.
- Konuşmayı sıfırlamak için **Clear** kullanın
- Bir mesajın üzerine gelin ve gösterdiği metni (workflow JSON dahil) kopyalamak için kopyalama simgesine tıklayın
- Kutuyu daha uzun yapmak için mesaj kutusunun üstündeki çizgiyi sürükleyin. Giriş alanı panelin %60'ına kadar büyüyebilir ve sayfa yenilendiğinde varsayılan yüksekliğine döner

## Workflow Otomatik Uygulama

AI yanıtı \`\`\`json kod bloğu içinde geçerli bir workflow JSON bloğu (`nodes` ve isteğe bağlı olarak `edges` içeren) içerdiğinde, Heym:

1. Yanıttan JSON'u ayrıştırır
2. Geçerli canvas'ı yeni düğümler ve kenarlarla değiştirir
3. Düğüm düzenini toparlar
4. Workflow'u kaydedilmemiş olarak işaretler

Ayrıştırma başarısız olursa, yanıtı yeniden oluşturmak için bir **Retry** düğmesi görünür.

## YOLO Mode

**YOLO mode**, asistanın oluşturduğunu test etmesini sağlar. Mesaj alanının altındaki **YOLO mode** kutusunu işaretleyin, ardından isteğinizi gönderin. Kutu yalnızca Agent modunda görünür. Varsayılan olarak kapalıdır ve sayfa yenilendiğinde kapalı duruma döner. Kısa bir özet için yanındaki bilgi simgesinin üzerine gelin.

YOLO mode açıkken, asistan bir workflow uyguladıktan sonra durmaz:

1. Workflow'u canvas'a uygular.
2. İlk çalıştırmadan önce test girdilerini ister. Kart, workflow'un giriş alanlarını listeler ve asistanın önerdiği değerlerle doldurulur. Bunları düzenleyin ve **Run** tuşuna basın. Sonraki çalıştırmalar bu değerleri yeniden kullanır. Kart yalnızca giriş alanları değiştiğinde veya asistanın farklı test verilerine ihtiyacı olduğunda geri gelir.
3. Workflow'u canvas üzerinde tam olarak **Run** düğmesi gibi çalıştırır: kaydedilmemiş değişiklikler önce kaydedilir, düğümler yanar ve çalıştırma Debug panelinde ve [Execution History](./execution-history.md) bölümünde görünür.
4. Sonucu okur. Çalıştırma istediğinizi yaptıysa, **Verified** ve kısa bir özetle biter. Yapmadıysa, workflow'u düzeltir ve yeniden çalıştırır.

Mesaj başına en fazla **5 çalıştırma** yapar. Döngüyü sonlandırmak ve devam eden bir çalıştırmayı durdurmak için istediğiniz zaman **Stop** tuşuna basın.

Her yanıt, adımlarını gerçekleştikçe gösterir:
- `Applying changes to canvas`;
- `Running workflow · attempt 2/5`, her düğüm için bir `Executing <node>` satırıyla;
- son karar.

Her çalıştırmadan sonra *Attempt 1 result sent · error in 1.2s* gibi kısa bir satır, sonucun asistana geri gönderildiğini gösterir.
### Diğer workflow'larınızı çalıştırma

YOLO modunda asistan, sonuçlarına ihtiyaç duyduğunda diğer workflow'larınızı da çalıştırabilir. Örneğin, bir [Execute](../nodes/execute-node.md) düğümünden çağırmadan önce bir workflow'un ne döndürdüğünü kontrol edebilir. Bu çalıştırmalar `Running workflow "<name>"...` adımları olarak görünür ve Execution History'de `ai_assistant` trigger kaynağıyla kaydedilir. Düzenlenen workflow her zaman canvas üzerinde test edilir.

### Erken durduğunda

| Durum | Ne olur |
|---|---|
| Asistanın bir karara, bilgiye, bir credential'a veya bir veri tablosuna ihtiyacı vardır | Her zamanki soru kartıyla sorar. Yanıtlamak döngüyü sürdürür. |
| Çalıştırma bir [insan incelemesini](./human-in-the-loop.md) bekler | Döngü durur. İncelemeyi onaylayın, ardından bir mesaj gönderin. |
| Workflow bir dosya yüklemesini bekler | Döngü durur. YOLO modu yükleme ile tetiklenen çalıştırmaları test edemez. |
| Workflow'un daha yeni bir sürümü başka bir yerde kaydedilmiştir | Döngü durur. Kaydetme çakışmasını çözün, ardından bir mesaj gönderin. |

> **Çalıştırmalar gerçektir.** Workflow'daki e-postalar, mesajlar ve API çağrıları her denemede gerçekten gönderilir ve DataTable düğümleri gerçek satırlar yazar. Her çalıştırma workflow'u kaydeder, böylece önceki sürümler [Edit History](./edit-history.md) içinde kalır.

## Sesli Giriş

Desteklenen tarayıcılarda bir **Voice** düğmesi konuşmadan metne dönüştürmeyi etkinleştirir. Kaydı başlatmak için tıklayın, durdurmak için tekrar tıklayın. Yazıya dökülen metin, siz göndermeden önce dilbilgisi düzeltmesi için AI'ya gönderilir.

## Agent Düğümü ile AI Assistant Karşılaştırması

| | Agent Düğümü | AI Assistant |
|---|------------|---------------|
| **Amaç** | Bir workflow içindeki LLM düğümü; yürütme sırasında çalışır | Doğal dille workflow oluşturmak için sohbet arayüzü |
| **Konum** | Canvas düğümü | Debug paneli → yüzen panel |
| **Ne zaman** | Çalışma zamanında | Düzenleme sırasında |

Araçlar ve MCP ile LLM çağrılarını yürüten workflow düğümü için [Agent Node](../nodes/agent-node.md) bölümüne bakın.

## Nasıl Çalışır (AI Builder DSL)

AI Assistant, düğümleri, kenarları ve ifadeleri tanımlayan bir **workflow DSL** (alanına özgü dil) ile çalışır. Bir mesaj gönderdiğinizde:

1. Mesajınız, [User Rules](./user-settings.md) ve mevcut workflow (varsa) backend'e gönderilir.
2. Backend şunları içeren bir **system prompt** oluşturur:
   - Tam workflow DSL (düğüm türleri, ifade sözdizimi, kurallar, örnekler)
   - "User Custom Rules" olarak eklenen User Rules'larınız
   - Mevcut bir workflow'u düzenlerken mevcut workflow JSON'u
   - Execute düğümünü kullanıyorsanız mevcut workflow'ların listesi
   - Kendi credential'larınızın adları, türleri ve id'leri (asla değerleri değil)
   - Kullanabileceğiniz veri tablolarının adları, id'leri, açıklamaları ve sütunları (asla satırları değil)
3. Model tek bir workflow JSON bloğu (`nodes` ve `edges` içeren) döndürür. Frontend bunu ayrıştırır ve canvas'a uygular.

### Credential'lar

Bir workflow bir credential'a ihtiyaç duyduğunda asistan, oluşturmadan önce sorar. Uygun türde credential'larınız varsa bunları **Create a new credential** ile birlikte listeler; hiç yoksa bir tane oluşturulup oluşturulmayacağını sorar. Her soru ayrıca credential olmadan devam etmenize de olanak tanır.

Bir tane oluşturmayı seçmek, panelde doğru türe ve önerilen bir ada önceden ayarlanmış credential formunu açar. Değerler doğrudan Heym'e gider; asistan yalnızca adı ve türü öğrenir. OAuth credential'ları (Google Sheets, Google Drive, BigQuery, Linear, Notion) bir popup içinde bağlanır ve popup engellenirse yetkilendirme sayfasına bir bağlantı görünür. Credential kaydedildikten sonra kart adını gösterir ve oluşturma düğmesi kapanır; **Submit answers** düğmesine basın ve asistan yeni credential'ı düğüme yerleştirir.

Ayrıca tek başına bir credential da isteyebilirsiniz ("create a GitHub credential") veya sahip olduğunuz birini değiştirmeyi isteyebilirsiniz ("update my sheet credential", "reconnect my Google Sheets"). Asistan aynı kartla yanıt verir: oluşturma boş bir form açar, güncelleme ise o credential üzerinde gizli bilgileri maskelenmiş olarak formu açar.

Asistan özel bir düğümü tercih eder. Bir Google Sheet'e sekme eklemek gibi bir işlemi hiçbir düğüm kapsamadığında, bir HTTP isteği kullanır ve seçilen credential için başlık satırını yazar. [HTTP › Authenticating with Credentials](../nodes/http-node.md#authenticating-with-credentials) bölümüne bakın.

Workflow'un onsuz da yapabileceği açıklama soruları, girdilerinde **Optional** yazar ve atlanabilir.

DSL, camelCase etiketleri, birleştirilmiş ifade kurallarını ve düğüme özgü alanları zorunlu kılar. Bir alan değeri tek bir `$expr` ise backend yerel türü korur; değer düzyazıyı `$refs` ile karıştırıyorsa sonuç bir dizedir. Tek-`$` kuralı hâlâ geçerlidir: parantez içinde `$` olmaz. [Settings](./user-settings.md) User Rules bu system prompt'a enjekte edilir, böylece tercihleriniz AI tarafından oluşturulan her workflow'a uygulanır.

Mevcut workflow Agent skill'leri içeriyorsa, AI Assistant o workflow bağlamına yalnızca her skill'in `SKILL.md` dosyasını dahil eder. Eklenen `.py` dosyaları ve ikili skill varlıkları istekten önce çıkarılır, böylece skill'ler büyük uygulamalar içerse bile builder model bağlam sınırları içinde kalır.
### Veri tabloları

Bir workflow kayıtları kaydettiğinde, depoladığında veya aradığında ve başka bir depo belirtmediyseniz, asistan bir [DataTable](../nodes/datatable-node.md) düğümü kullanır. Tablolarınızdan birini adlandırırsanız ve bu tablo workflow'un ihtiyaç duyduğu sütunlara sahipse, asistan onu kullanır. Aksi takdirde hangi tablonun kullanılacağını sorar. Kart, uygun olan tabloları her birinin açıklaması ve sütun türleriyle birlikte listeler; ayrıca önerilen bir ad ve sütunlarla birlikte **Yeni bir tablo oluştur** seçeneğini sunar. Sizinle paylaşılan tablolar da sunulur; yalnızca okuyabildiğiniz bir tablo yalnızca okuma için sunulur.

Yeni tabloyu seçin ve **Yanıtları gönder**'e basın: kart tabloyu oluşturur ve asistan onun id'sini düğüme yerleştirir ve tam sütun adlarını kullanır. Ayrıca tek başına bir tablo da isteyebilirsiniz, örneğin "lead'lerim için bir tablo oluştur".

Asistan tablo adlarını, açıklamalarını ve sütunlarını görür, asla satırları görmez. Mevcut bir tablonun sütunlarını asla değiştirmez: eğer bir tabloda workflow'un ihtiyaç duyduğu bir sütun yoksa, sütunu adlandırır ve bunun yerine yeni bir tablo önerir. Sütunları [DataTable sekmesinden](../tabs/datatable-tab.md) ekleyin.

## İlgili

- [Neden Heym](../getting-started/why-heym.md) – Agent yaşam döngüsünün ilk aşaması olarak doğal dilde oluşturma
- [Hızlı Başlangıç](../getting-started/quick-start.md) – İlk workflow'unuzu oluşturun
- [Ayarlar](./user-settings.md) – AI Assistant sistem prompt'una enjekte edilen Kullanıcı Kuralları
- [Heym ile Sohbet](./chat-with-heym.md) – Dokümantasyon alanı içinde sayfa farkındalıklı asistan
- [Temel Kavramlar](../getting-started/core-concepts.md) – Workflow'lar, düğümler ve yürütme akışı
- [Agent Düğümü](../nodes/agent-node.md) – Araçlar ve MCP içeren LLM düğümü
- [Credentials Sekmesi](../tabs/credentials-tab.md) – AI Assistant için API anahtarları ekleyin
- [Workflow Yapısı](./workflow-structure.md) – Workflow'lar için JSON formatı
