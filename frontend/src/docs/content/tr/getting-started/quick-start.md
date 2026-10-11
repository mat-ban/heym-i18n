# Hızlı Başlangıç

İlk Heym workflow'unuzu dakikalar içinde çalıştırın.

Henüz Heym'i çalıştırmadınız mı? [Çalıştırma ve Dağıtım](./running-and-deployment.md) bölümüne bakın veya video anlatımını izleyin: [Heym'i Yerel Olarak 2 Dakikadan Kısa Sürede Kurun](https://www.youtube.com/watch?v=P6YvlupUboU).

## 1. Bir Workflow Oluşturun

1. [Workflows](../tabs/workflows-tab.md) sekmesine gidin
2. **New Workflow** seçeneğine tıklayın
3. Workflow'unuza bir ad verin (örn. "Hello World")

## 2. Node'lar Ekleyin

1. Soldaki **Nodes** panelini açın
2. Bir [Input](../nodes/input-node.md) node'unu tuvale sürükleyin
3. Bir [LLM](../nodes/llm-node.md) node'unu sürükleyin ve Input'a bağlayın
4. Bir [Output](../nodes/output-node.md) node'unu sürükleyin ve LLM'e bağlayın

```
[Input] --> [LLM] --> [Output]
```

Mevcut tüm node'lar için [Node Türleri](../reference/node-types.md) bölümüne bakın.

## 3. Yapılandırın

- **Input**: Varsayılan bir değer belirleyin veya kullanıcı girişi için boş bırakın (bkz. [Input Node](../nodes/input-node.md))
- **LLM**: Bir [credential](../tabs/credentials-tab.md) ve model seçin, bir sistem talimatı ekleyin ve `userMessage` değerini `$input.text` olarak ayarlayın (bkz. [LLM Node](../nodes/llm-node.md))
- **Output**: LLM yanıtını iletmek için `message` değerini `$llm.text` olarak ayarlayın (bkz. [Output Node](../nodes/output-node.md))

`$input.text` ve `$llm.text` için [Expression DSL](../reference/expression-dsl.md) sözdizimini kullanın. Canlı backend önizlemesiyle [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) için ifade alanlarındaki genişletme düğmesine tıklayın.

## 4. Çalıştırın

**Run** seçeneğine tıklayın, `Ctrl + Enter` tuşlarına basın veya çalıştırmak için debug panelini kullanın. Workflow, Input node'undan başlayarak bağlı node'lar üzerinden Output'a doğru çalışır. Workflow'ları çalıştırmanın diğer yolları için ([webhook](../reference/webhooks.md), portal, cron, vb.) [Triggers](../reference/triggers.md) bölümüne bakın.

Geçmiş çalıştırmaları **History** (araç çubuğu) bölümünde görüntüleyin ve aynı girdilerle yeniden çalıştırmak için **Bring to Canvas** seçeneğini kullanın.

Docs, Evals ve diğer canvas dışı dahili sayfalarda, editöre geri dönmeden sabitlenmiş bir workflow seçip çalıştırmak için [Quick Drawer](../reference/quick-drawer.md) özelliğini de kullanabilirsiniz.

Dokümantasyonu okuyorsanız ve oluşturmadan önce açıklama almak istiyorsanız, sayfaya özel sorular sormak için Docs başlığından [Chat with Heym](../reference/chat-with-heym.md) özelliğini açın.

Alternatif olarak, doğal dil ile workflow oluşturmak için Debug panelinden [AI Assistant](../reference/ai-assistant.md) özelliğini kullanın—ne istediğinizi tanımlayın ve AI node'ları ve bağlantıları oluştursun.

Başka bir araçta zaten otomasyonlar mı oluşturuyorsunuz? [Migrate to Heym](./migrate-to-heym.md), bir n8n, Flowise, Dify, Langflow, sim.ai veya Activepieces workflow'unu içe aktarabileceğiniz bir Heym workflow'una dönüştürür.

## İlgili

- [Temel Kavramlar](./core-concepts.md) – Workflow'lar, node'lar ve yürütme akışı
- [Heym'e Geçiş](./migrate-to-heym.md) – n8n, Flowise, Dify, Langflow, sim.ai veya Activepieces workflow'larını AI ile Heym'e dönüştürün
- [Çalıştırma ve Dağıtım](./running-and-deployment.md) – `run.sh` ile yerel olarak başlatın veya `deploy.sh` ile dağıtın
- [Ortam Değişkenleri](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Tam yapılandırma referansı
- [Ayarlar](../reference/user-settings.md) – Ad, User Rules ve parolayı yapılandırın
- [Canvas Özellikleri](../reference/canvas-features.md) – Data pin, yürütme günlükleri, etkinleştirme/devre dışı bırakma, alt workflow'a çıkarma
- [Klavye Kısayolları](../reference/keyboard-shortcuts.md) – Canvas ve editör kısayolları
- [Expression DSL](../reference/expression-dsl.md) – Node yapılandırmasında verilere başvurma
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Canlı backend önizlemeli genişletilebilir editör
- [Triggers](../reference/triggers.md) – Tüm workflow giriş noktaları ([webhook](../reference/webhooks.md), portal, cron, vb.)
- [Yürütme Geçmişi](../reference/execution-history.md) – Geçmiş çalıştırmaları görüntüleyin ve Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Canvas dışı sayfalardan sabitlenmiş workflow'ları çalıştırın
- [Chat with Heym](../reference/chat-with-heym.md) – Docs başlığından bağlama özel sorular sorun
- [Workflows Sekmesi](../tabs/workflows-tab.md) – Workflow'ları oluşturun ve yönetin
- [Credentials Sekmesi](../tabs/credentials-tab.md) – LLM node'ları için API anahtarları ekleyin
- [AI Assistant](../reference/ai-assistant.md) – Doğal dil ile workflow oluşturun
