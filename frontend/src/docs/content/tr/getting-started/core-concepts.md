# Temel Kavramlar

## Workflow'lar

Bir workflow, **edges** ile birbirine bağlanan [**node**'lardan](../reference/node-types.md) oluşan yönlü bir graftır. Workflow'ları [Workflows](../tabs/workflows-tab.md) sekmesinden yönetin. Bunları [klasörlerde](../reference/workflow-organization.md) düzenleyin. Yürütme, [trigger node'larından](../reference/triggers.md) ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) işleme node'ları üzerinden [output](../nodes/output-node.md) node'larına doğru akar. JSON formatı için [Workflow Structure](../reference/workflow-structure.md) bölümüne bakın. Workflow'ları projeler arasında yeniden kullanmak üzere [Templates](../tabs/templates-tab.md) olarak kaydedin ve paylaşın. Workflow'lar ayrıca [Board](../tabs/board-tab.md) üzerinden de çalıştırılabilir; burada kanban kartları, kartın tam bağlamıyla birlikte bir sütunun workflow zincirini tetikler.

## Node'lar

Her node şunlara sahiptir:

- **Type** – Davranışı belirler (örn. `llm`, `condition`, `http`)
- **Data** – Yapılandırma (model, prompt, URL vb.)
- **Inputs/Outputs** – Diğer node'lara bağlanma tutamaçları

Tam liste için [Node Types](../reference/node-types.md) bölümüne bakın.

## Edge'ler

Edge'ler bir kaynak node'un output tutamacını bir hedef node'un input tutamacına bağlar. Yürütme sırasında veri edge'ler boyunca akar.

## Yürütme Akışı

1. **Trigger** – Input, Cron, Telegram Trigger, Discord Trigger, IMAP Trigger veya [WebSocket Trigger](../nodes/websocket-trigger-node.md) node'u yürütmeyi başlatır ([Triggers](../reference/triggers.md) bölümüne bakın)
2. **Downstream** – Her node, bağlı upstream node'lardan output alır; [paralel yürütme](../reference/parallel-execution.md) bağımsız node'ları eşzamanlı olarak çalıştırır
3. **Expressions** – Node'lar upstream verilerine `$nodeLabel.field` aracılığıyla başvurur. [Expression DSL](../reference/expression-dsl.md) bölümüne bakın.
4. **Output** – [Output](../nodes/output-node.md) node'u nihai sonucu üretir

## Expression Referansları

Input node'unun verisi için `$input`, herhangi bir upstream node için `$nodeLabel.field` kullanın. Örnek: `$llm.text`, "llm" etiketli bir node'dan `text` alanına başvurur. Tam sözdizimi: [Expression DSL](../reference/expression-dsl.md). Expression'ları düzenlerken canlı backend önizlemesiyle daha büyük bir editör için [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) kullanın.

## İlgili

- [Quick Start](./quick-start.md) – İlk workflow'unuzu oluşturun
- [Canvas Features](../reference/canvas-features.md) – Data pin, yürütme günlükleri, etkinleştirme/devre dışı bırakma, alt workflow'a çıkarma
- [AI Assistant](../reference/ai-assistant.md) – Doğal dille workflow'lar oluşturun
- [Node Types](../reference/node-types.md) – Kullanılabilir tüm node'lar
- [Expression DSL](../reference/expression-dsl.md) – Expression'larda verilere başvurma
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Canlı backend önizlemeli genişletilebilir editör
- [Workflows Tab](../tabs/workflows-tab.md) – Workflow'ları ve klasörleri yönetin
- [Workflow Organization](../reference/workflow-organization.md) – Klasörler ve zamanlanmış silme
- [Triggers](../reference/triggers.md) – Workflow'lar için giriş noktaları
- [Webhooks](../reference/webhooks.md) – HTTP webhook trigger (TTL, cache, rate limit)
- [Parallel Execution](../reference/parallel-execution.md) – Node'ların paralel olarak nasıl çalıştığı
