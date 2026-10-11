# Evals Sekmesi

**Evals** sekmesi, `/evals` adresindeki ayrı bir sayfadır. Değerlendirme paketleri oluşturmanıza, test senaryoları tanımlamanıza ve [Agent](../nodes/agent-node.md) workflow'larınıza karşı değerlendirmeler çalıştırmanıza olanak tanır.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Evals demosunu izleyin</a></p>

## Erişim

- Dashboard sekme çubuğunda **Evals** seçeneğine tıklayın
- Veya `/evals` adresine gidin
- Veya **Ctrl+K** (Cmd+K) kullanın ve komut paletinden "Evals" seçeneğini seçin

## Eval Paketleri

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
- **Temperature** – Model temperature değerini ayarlayın (`Exact Match` ve `Contains`)
- **Reasoning effort** – Reasoning modelleri için reasoning effort değerini ayarlayın (`Exact Match` ve `Contains`)

### LLM-as-Judge

Bir judge ile her model, test girdisine yalnızca paket prompt'u ile yanıt verir, ardından judge yanıtın beklenen çıktıyla ne kadar yakından eşleştiğini 0 ile 100 arasında derecelendirir:

- **Bir model judge** (OpenAI, OpenAI uyumlu veya Gemini) soruyu, beklenen çıktıyı ve yanıtı okur ve tek satırlık bir gerekçeyle birlikte bir puan döndürür. Temperature `0` değerinde veya bir reasoning modeli için `low` reasoning effort değerinde çalışır, böylece aynı yanıt aynı kararı alır.
- **Bir decision model judge**, yanıtı *Completely off* ile *Fully matches* arasında beş düzeyli bir rubrik üzerinde derecelendirir. Puan, bu rubrik üzerindeki olasılık ağırlıklı konumdur, yani modelin yazdığı bir sayıdan değil, hesapladığı bir dağılımdan gelir.

Hücrenin hover kartı, judge'ın gerekçesini veya bir decision model için düzeyi, puanı ve güvenini gösterir. Latency ve token'lar test edilen modeli tanımlar; judge'ın kendi çağrıları [Traces](./traces-tab.md) altında **Evals** kaynağı altında görünür. Model seçici, Model Router credential'larını dışarıda bırakır çünkü bir eval belirli modelleri karşılaştırır.

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
