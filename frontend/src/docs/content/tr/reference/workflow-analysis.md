# Workflow Analizi

**Workflow Analizi**, her workflow için paylaşılan ve düzenlenebilir tek bir Markdown belgesi barındıran sol taraftaki bir panelidir. Bir workflow'un ne yaptığını açıklamak ve iyileştirme fikirlerini kaydetmek için kullanın — ve yapay zekanın sizin için ilk taslağı oluşturmasına izin verin.

Belge paylaşımlıdır: workflow'a erişebilen herkes onu okuyabilir ve düzenleyebilir. Workflow ile birlikte saklanır ve workflow silindiğinde otomatik olarak silinir.

## Paneli Açma

1. Düzenleyicide bir workflow açın.
2. Düzenleyici araç çubuğundaki **Analyze** (Sparkles simgesi) düğmesine tıklayın.
3. Panel solda açılır. Panel açıkken node paleti (sol panel) daralır; node paletini yeniden açmak analiz panelini kapatır.

Panel yalnızca kaydedilmiş workflow'lar için kullanılabilir. Yeni oluşturulmuş ve henüz kaydedilmemiş bir workflow'da önce kaydetmeniz gerekir.

## Belge

Panel, **Edit** (kalem) ve **Preview** (göz) düğmeleriyle geçiş yapılabilen iki görünüme sahip tek bir Markdown belgesi gösterir:

| Görünüm | Amaç |
|------|---------|
| **Edit** | Düz Markdown düzenleyici (textarea). |
| **Preview** | İşlenmiş Markdown. |

Başlıkta belgeyi **en son kimin düzenlediği** ve ne zaman düzenlediği gösterilir.

### Kaydetme

Değişikliklerinizi kalıcı hale getirmek için **Save** düğmesine tıklayın. Save yalnızca kaydedilmemiş düzenlemeler olduğunda etkinleşir.

Belge paylaşımlı olduğundan, kaydetme işlemleri iyimser eşzamanlılık (optimistic concurrency) kullanır:

- Siz paneli açtıktan sonra başka biri daha yeni bir sürüm kaydettiyse, sizin kaydetme işleminiz reddedilir ve diğer düzenleyicinin adını belirten bir uyarı görünür.
- Ardından **Reload (discard mine)** seçeneğiyle sunucu sürümünü alabilir veya **Overwrite** ile kendi sürümünüzü onlarınkinin üzerine zorla kaydedebilirsiniz.

## Yapay Zeka Analizi

Panelin üst kısmından bir LLM **Credential** ve **Model** seçin (model listesi seçilen credential'dan yüklenir — bkz. [Credentials](../tabs/credentials-tab.md)). Ardından analizi çalıştırın:

- **Analyze my workflow** — belge boş olduğunda gösterilir. Yapay zeka tarafından oluşturulan bir Markdown raporunu doğrudan düzenleyiciye kaydedilmemiş bir taslak olarak akış halinde yazar. İnceleyip düzenleyin, ardından **Save** düğmesine tıklayın.
- **Reanalyze** — belgede zaten içerik olduğunda gösterilir. Yeni bir raporu ayrı bir **preview** alanına akış halinde yazar ve mevcut belgenize dokunmaz. Düzenleyici içeriğini yeni analizle değiştirmek için **Accept**, elinizdekini korumak için **Discard** seçeneğini seçin.

Her iki eylem de önce **workflow'u çalıştırır** (geçerli ve çalıştırılabilir olduğunda) ve yürütme sonuçlarını analiz prompt'una dahil eder; böylece rapor workflow'un gerçekte nasıl davrandığını yansıtır. Workflow çalıştırılamıyorsa, analiz bunun yerine statik yapısından ilerler.

Oluşturulan rapor sırasıyla üç bölümü kapsar: **İyileştirme alanları** (workflow credential, kullanıcı girdisi, harici istekler veya veri ifşasıyla ilgili olduğunda bir **güvenlik** açısı dahil olmak üzere somut öneriler), workflow'un **Amacı** ve **Ne yaptığı** (node'lar arasında adım adım bir geçiş).

**İyileştirme alanları** bölümü her zaman dört açık kontrolü çalıştırır:

1. **Hata kapsamı** — canvas'ta hiç [Error Handler](../nodes/error-handler-node.md) node'u yoksa ve bir hata workflow'u yapılandırılmamışsa, rapor bunu belirtir ve hata işleme eklenmesini önerir.
2. **Kazanılan zaman** — çalıştırma başına tahmini kazanılan zaman ayarlanmamışsa, rapor [Analytics](../tabs/analytics-tab.md) **Time Saved** metriğinin dolabilmesi için bunun yapılandırılmasını önerir.
3. **Ağ node'ları** — ağ çağrıları yapan node'lar için ([HTTP](../nodes/http-node.md) ve entegrasyon node'ları gibi), rapor bu node'larda node'a özgü hata işleme (retry ve/veya continue-on-error) önerir.
4. **Uyarılar** — workflow için hiç [alerts](../tabs/alerts-tab.md) yapılandırılmamışsa, rapor prod'a geçmeden önce uyarıların kurulmasını önerir.

### Properties'ten Analyzer Çalıştırma

Bir workflow'un canvas'ta node'ları olduğunda ancak henüz bir analiz belgesi olmadığında, workflow düzeyindeki [Properties](./canvas-features.md) panelinde (hiçbir node seçili olmadığında gösterilir) bir **Run Analyzer** düğmesi görünür. Bu düğme, bir credential ve model seçip raporu oluşturabilmeniz için bu Workflow Analizi panelini açar.

Her analiz çalıştırması, [Traces](../tabs/traces-tab.md) bölümünde **Workflow Analysis** kaynağı altında kaydedilir.

Hiçbir LLM credential yapılandırılmamışsa, Analyze düğmesi devre dışıdır — [Credentials Tab](../tabs/credentials-tab.md) bölümünden bir tane ekleyin.

## İlgili

- [AI Assistant](./ai-assistant.md) — doğal dilden workflow node'ları oluşturun veya değiştirin.
- [Sticky Note](../nodes/sticky-note-node.md) — doğrudan canvas'a sabitlenen kısa notlar için.
