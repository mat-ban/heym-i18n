# Evals Sekmesi

**Evals** sekmesi, `/evals` adresindeki ayrı bir sayfadır. Değerlendirme paketleri oluşturmanıza, test senaryoları tanımlamanıza ve [Agent](../nodes/agent-node.md) workflow'larınıza karşı değerlendirmeler çalıştırmanıza olanak tanır. Bir [ajan paketi](#agent-suites), bir ajanı çalıştırır veya gerçek çalıştırmalarını okur ve çağırdığı araçları, gecikmesini, USD maliyetini, tokenlarını ve araç çağrısı sayısını denetler.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Evals demosunu izleyin</a></p>

## Erişim

- Dashboard sekme çubuğunda **Evals** seçeneğine tıklayın
- Veya `/evals` adresine gidin
- Veya **Ctrl+K** (Cmd+K) kullanın ve komut paletinden "Evals" seçeneğini seçin

## Eval Paketleri

- **Yeni Paket** – Bir sistem promptunu modeller arasında test etmek için **Prompt paketi**'ni veya bir ajanın gerçek çalıştırmalarını denetlemek için **Ajan paketi**'ni seçin (bkz. [Ajan Paketleri](#agent-suites))
- **Paket seçici** – Prompt ve ajan paketlerini her bir adın yanındaki türle birlikte listeler; aramak için yazın
- **Paket oluştur** – Bir ad ve açıklama ile bir paket tanımlayın
- **Workflow seç** – Hangi workflow'un değerlendirileceğini seçin
- **Credential seç** – Workflow'u çalıştırmak için API key
- **System prompt** – Paket düzeyindeki system prompt'u doğrudan sol panelde düzenleyin
- **Prompt'u Optimize Et** – Mevcut system prompt'u iyileştirmesi için bir LLM'den isteyin

## Test Senaryoları

- Girdi prompt'ları ve beklenen çıktılarla test senaryoları ekleyin
- Her senaryo, karşılaştırma için özel bir beklenen değere sahip olabilir
- Senaryoları paketten düzenleyin veya silin
- **Test Verisi Oluştur** – Paket prompt'undan otomatik olarak test senaryoları oluşturmak için seçili credential/modeli kullanın

## Değerlendirmeleri Çalıştırma

- **Bir veya daha fazla model seçin** – Aynı paketi tek bir değerlendirmede birden fazla modele karşı çalıştırın
- **Puanlama yöntemi** – `Exact Match`, `Contains` veya `LLM-as-Judge` seçeneklerinden birini seçin
- **Judge** – `LLM-as-Judge` için isteğe bağlı olarak bir OpenAI, OpenAI uyumlu (Custom), Gemini (Google) veya [Decision Model](../nodes/decision-node.md) credential'ı seçin ve bağımsız bir judge ile puanlamak için judge'ın modelini yazın (örneğin `gpt-4o-mini` veya `jev-latest`)
- **Test başına çalıştırma** – Her test senaryosunu tek bir çalıştırmada birden çok kez tekrarlayın
- **Hatırlanan ayarlar** – Bir paket, en yeni çalıştırmasının ayarlarıyla açılır: kimlik bilgisi, modeller, puanlama yöntemi ve değerlendirici, sıcaklık, akıl yürütme çabası ve test başına çalıştırma sayısı. Geçmiş bir çalıştırmayı açmak onun ayarlarını yükler, böylece **Değerlendirmeleri Yeniden Çalıştır** aynı testi tekrarlar
- **Temperature** – Model temperature değerini ayarlayın (`Exact Match` ve `Contains`)
- **Akıl yürütme çabası** – LLM ve Agent düğümlerinde olduğu gibi akıl yürüten modeller için Düşük'ten Çok yüksek ve Maks'a kadar akıl yürütme çabasını ayarlayın (`Exact Match` ve `Contains`)

### LLM-as-Judge

Bir judge ile her model, test girdisine yalnızca paket prompt'u ile yanıt verir, ardından judge yanıtın beklenen çıktıyla ne kadar yakından eşleştiğini 0 ile 100 arasında derecelendirir:

- **Bir model judge** (OpenAI, OpenAI uyumlu veya Gemini) soruyu, beklenen çıktıyı ve yanıtı okur ve tek satırlık bir gerekçeyle birlikte bir puan döndürür. Temperature `0` değerinde veya bir reasoning modeli için `low` reasoning effort değerinde çalışır, böylece aynı yanıt aynı kararı alır.
- **Bir decision model judge**, yanıtı *Completely off* ile *Fully matches* arasında beş düzeyli bir rubrik üzerinde derecelendirir. Puan, bu rubrik üzerindeki olasılık ağırlıklı konumdur, yani modelin yazdığı bir sayıdan değil, hesapladığı bir dağılımdan gelir.

Hücrenin üzerine gelindiğinde açılan kart değerlendiricinin gerekçesini veya bir karar modeli için seviyeyi, puanı ve güvenini gösterir. Gecikme ve tokenlar test altındaki modeli tanımlar; değerlendiricinin kendi çağrıları [İzler](./traces-tab.md) altında **Değerlendirmeler** kaynağında görünür. Değerlendirici seçici Model Router kimlik bilgilerini hariç tutar, çünkü bir değerlendirici tek bir sabit model olmak zorundadır. Test altındaki modellerin kimlik bilgisi bir [Model Router](../reference/credentials.md#model-router-auto-model) olabilir: onun **Auto** modeli, tıpkı bir workflow içinde olduğu gibi istek başına bir model seçer.

Bir judge olmadan, her model tek bir istekte yanıt verir ve kendi yanıtını puanlar.

Temperature ve reasoning effort bu modda gizlenir ve çalıştırma sabit ayarları kullanır: standart modeller için temperature `0.7` ve reasoning modelleri için `medium` reasoning effort (kendi yanıtlarını puanladıklarında `low`).

## Sonuçlar

- Test senaryosu başına geçti/kaldı durumunu görüntüleyin
- Gerçek ve beklenen çıktıları inceleyin
- Bir çalıştırma birden fazla model içerdiğinde model başına çıktıları yan yana karşılaştırın
- Geçmiş değerlendirmeler için çalıştırma geçmişini inceleyin; bir `LLM-as-Judge` çalıştırması, geçmiş listesinde judge modelini gösterir
- Sonuçlar panelinden geçmiş çalıştırmaları açın ve kaydedilmiş prompt/girdi/çıktı anlık görüntülerini inceleyin
- Geçmiş bir çalıştırmayı açmak, puanlama yöntemini ve judge'ı sol panele yükler, böylece **Re-Run Evals** aynı değerlendirmeyi tekrarlar
- **Export**, çalıştırmayı `judge_credential_id` ve `judge_model` dahil olmak üzere JSON olarak indirir

## Agent Suites

Bir ajan paketi, bir [Agent](../nodes/agent-node.md) düğümünü çalıştırmalarına göre denetler. Bunları, her çalıştırmanın süresini, tokenlarını, maliyetini ve araç çağrılarını zaten kaydettiği [İzler](./traces-tab.md) bölümünden okur ve workflow'u sizin yerinize de çalıştırabilir.

**Yeni Paket** → **Ajan paketi** ile bir tane oluşturun ve üç adımı izleyin:

1. **Ajan** – Workflow'u ve ardından onun ajan düğümünü seçin. Yalnızca ajan düğümü içeren workflow'lar listelenir; henüz çalıştırılmamış bir workflow veya ajan gösterilir ancak seçilemez. Seçilen ajanın ayarları (model, talimatlar, araçlar ve sınırlar) sağda görüntülenir ve altında ajanın vurgulandığı salt okunur bir workflow tuvali görünür.
2. **Baseline** – Ajanın son 10 çalıştırması: gecikme p50 ve p95, çalıştırma başına maliyet, çalıştırma başına token ve çalıştırma başına araç çağrıları, hangi araçları ne sıklıkla çağırdığı ve her çalıştırmanın kendi sayıları. Hatayla sonuçlanan çalıştırmalar listelenir ancak baseline dışında bırakılır.
3. **Denetimler** – Her aracı **Must call**, **Must not call** veya **Either** olarak işaretleyin. Her çağrı türü kendi tipiyle listelenir: Python ve düğüm araçları, sunucularıyla birlikte **MCP** araçları, etikete göre **alt ajanlar**, ada göre **alt workflow'lar** ve **skills**. Henüz çalıştırılmamış bir aracı türüne ve adına göre ekleyin ve **X** simgesiyle kaldırın. Gecikme, maliyet, toplam token ve araç çağrıları için üst sınırlar belirleyin; her biri baseline p95 değerinin %20 üzerinde başlar ve kapatılabilir.

Kaydedilen bir paket, yanında **Baseline** ve **Denetimleri düzenle** ile birlikte **Sonuçlar** sekmesinde açılır:

- **Workflow'u çalıştır** – Çalıştırma sayısını seçin (20'ye kadar); aynı anda dört tanesi çalışır. Girdiler, workflow'un en son çalıştırmasından doldurulur ve düzenlenebilir, her çalıştırma bunları kullanır. **Girdileri oluştur** seçeneğini (parıltı simgesi) açın, ardından modelin her çalıştırma için farklı bir girdi yazması için bir kimlik bilgisi ve model seçin. Ajanın sistem talimatlarını okur ve yazdığınız değerlere yakın kalır: bir şehir adı yazmak başka şehir adları üretir. Her çalıştırma, diğer herhangi bir çalıştırma gibi tüm workflow'u yürütür ve Yürütme Geçmişi'nde `agent_suite` tetikleyicisiyle listelenir. E-posta gönderme gibi sonraki adımları atlamak için paneldeki **Workflow'a git** ile workflow'u açın ve önce bu düğümleri devre dışı bırakın. **Durdur** bir paket çalıştırmasını sonlandırır: yeni çalıştırma başlatılmaz ve devam edenler iptal edilir. Örneğin bir yeniden başlatma sırasında sunucusu duran bir paket çalıştırması, takılı kalmak yerine bir dakika sonra kesintiye uğramış olarak gösterilir.
- **Sonuçlar** – Varsayılan olarak en son paket çalıştırması puanlanır. Her paket çalıştırması, açabileceğiniz veya silebileceğiniz çalıştırma seçicide tarihiyle birlikte saklanır; ya da diğer çalıştırmalarını dahil etmek için ajanın son 10, 20 veya 50 çalıştırmasına geçiş yapabilirsiniz. Kaydedilen baseline yanında başarı oranını, her denetimin ne sıklıkla geçtiğini, gecikmeyi, maliyeti, tokenları ve araç çağrılarını, ayrıca her çalıştırmayı başarısız olma nedeni ve izine bağlantısıyla birlikte görürsünüz.
- **Workflow'a git**, ajanın workflow'unu yeni bir sekmede açar. Ad alanında **Esc** veya **X** metni temizler.

Sayılar nasıl yorumlanır:

- **Gecikme**, modelin süresi artı çalıştırmanın araç çağrılarının süresidir.
- **Maliyet**, Traces ile aynı fiyatlandırmayı kullanır. Fiyatı tanımlanmamış bir modelin çalıştırması, başarısız olmak yerine maliyet denetimini atlar.
- Bir çalıştırma, hatasız tamamlandığında ve her denetim geçtiğinde **başarılı** sayılır.
- Paket, İzler sekmesiyle aynı kurala göre yalnızca kendi izlerinizi okur.
- **Denetimleri düzenle** içindeki **Son çalıştırmaları baseline olarak kullan**, kaydedilen baseline'ı ajanın en son çalıştırmalarıyla değiştirir.

Bir paketin baseline değeri üç kaynaktan birinden gelir. **Denetimleri düzenle**, **Kaydedilen baseline** yanında hangisinin etkin olduğunu gösterir:

- ajanın en son çalıştırmaları (varsayılan ve **Son çalıştırmaları baseline olarak kullan** seçeneğinin aldığı değer),
- tamamlanmış bir paket çalıştırması,
- elle girilen sayılar.

Son ikisi [Chat](./chat-tab.md#working-with-evals) içinden veya API aracılığıyla ayarlanır:

- `PATCH /api/evals/agent-suites/{id}`, `baseline: {"source": "suite_run", "run_id": "…"}` veya `{"source": "manual", "values": {"latency_p95_ms": 3000, "cost_avg_usd": 0.01}}` kabul eder.
- `POST /api/evals/agent-suites/{id}/runs`, `inputs_list` kabul eder: çalıştırma başına bir girdi nesnesi, 20'ye kadar.

### Chat ve MCP'den

[Chat](./chat-tab.md#working-with-evals) ve MCP `heym_chat` aracı prompt ve ajan paketleri oluşturabilir, değiştirebilir ve çalıştırabilir:

- Test senaryolarını ve çalıştırma girdilerini kendileri yazar.
- Yalnızca biri uymadığı sürece, bir prompt paketi oluşturmadan önce hangi kimlik bilgisinin kullanılacağını sorarlar.
- Bu sayfada bahsettikleri her paketi bağlantılarlar.

## Benchmark Matrisi Fikirleri

Agent workflow'ları için bir benchmark matrisi oluşturduğunuzda, HITL senaryolarını uç durumlar olarak ele almak yerine birinci sınıf senaryolar olarak dahil edin.

- Üç inceleme kararının tümünü kapsayın: `accepted`, `edited` ve `refused`
- Editor çalıştırmaları, portal, curl/webhook ve cron ile tetiklenen yürütmeler gibi birden fazla trigger kaynağını dahil edin
- Bir agent çalıştırmasının birden fazla kez durakladığı tekrarlı inceleme senaryolarını ekleyin
- Agent'ın `review` çıktısına bağlı bildirim dallarını doğrulayın
- Özellikle sonraki node'lar `$agent.decision` üzerinde dallanıyorsa, reddetme sonrası alt akış davranışını doğrulayın

## İlgili

- [Why Heym](../getting-started/why-heym.md) – Agent yaşam döngüsünün test aşaması olarak Evals
- [Agent Node](../nodes/agent-node.md) – Değerlendirilen workflow'lar
- [Credentials Sekmesi](./credentials-tab.md) – Eval çalıştırmaları için credential'lar
- [Traces Sekmesi](./traces-tab.md) – Ayrıntılı trace incelemesi
- [Workflows Sekmesi](./workflows-tab.md) – Değerlendirilecek workflow'lar oluşturun
- [Execution History](../reference/execution-history.md) – Geçmiş çalıştırmaları görüntüleyin (başlıktaki History düğmesi)
- [Contextual Showcase](../reference/contextual-showcase.md) – Evals sayfasında bulunan kompakt sayfa kılavuzu
