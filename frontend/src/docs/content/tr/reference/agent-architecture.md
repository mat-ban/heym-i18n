# Agent Mimarisi

[Agent Node](../nodes/agent-node.md); sub-agent'ları, sub-workflow'ları, canvas node araçlarını, bir orchestrator pattern'ini, skill'leri, MCP bağlantılarını, tool calling'i, isteğe bağlı [kalıcı belleği](./agent-persistent-memory.md) (canvas node başına, diğer agent'larla isteğe bağlı paylaşımla) ve isteğe bağlı [insan incelemesini](./human-in-the-loop.md) destekler. Bu sayfa mimariyi açıklar.

## Sub-Agent'lar

Sub-agent'lar, bir orchestrator'ın `call_sub_agent` aracı üzerinden çağırabileceği agent node'larıdır.

- **Orchestrator**: `isOrchestrator: true`, `subAgentLabels: ["researchAgent", "summarizerAgent"]`
- **Sub-agent'lar**: Orchestrator'ın prompt'unu alabilmeleri için User Message'larında `$input.text` kullanmalıdır
- **Araç**: `sub_agent_label` (enum) ve `prompt` ile `call_sub_agent`
- **Derinlik sınırı**: En fazla 5 iç içe sub-agent çağrısı

### Yürütme Akışı

1. Orchestrator bir sub-agent çağırmaya karar verir
2. `_execute_sub_agent_tool` hedef agent'ı label'a göre bulur
3. `synthetic_inputs = {"input": {"text": prompt}}` oluşturur
4. Sub-agent için `_execute_agent_node` çalıştırır
5. Sonuç orchestrator'a döndürülür

### Paralel Sub-Agent Yürütme

Orchestrator tek bir turda birden fazla `call_sub_agent` araç çağrısı döndürdüğünde, bunlar **paralel** olarak yürütülür. Örneğin, kullanıcı "Paris" hakkında soru sorduğunda ve orchestrator hem `distanceAgent` hem de `foodAgent` çağırırsa, ikisi sıralı yerine eşzamanlı olarak çalışır.

- **Avantaj**: Toplam süre, tümünün toplamı değil, yaklaşık olarak en yavaş sub-agent'ın süresidir.
- **İpucu**: Görev gerektirdiğinde orchestrator'ı tek bir turda birden fazla sub-agent çağırmaya teşvik edin.

## Sub-Workflow'lar

`subWorkflowIds` yapılandırıldığında, agent `call_sub_workflow` aracı üzerinden diğer workflow'ları çağırabilir.

- **Yapılandırma**: `subWorkflowIds: ["workflow-uuid-1", "workflow-uuid-2"]`
- **Araç**: `workflow_id` (enum) ve `inputs` (object) ile `call_sub_workflow`
- **Derinlik sınırı**: En fazla 5 iç içe sub-workflow çağrısı

### Yürütme Akışı

1. Agent bir sub-workflow çağırmaya karar verir
2. `_execute_sub_workflow_tool` workflow'u `workflow_cache` üzerinden getirir
3. `enriched_inputs = {"headers": {}, "query": {}, "body": inputs}` oluşturur
4. Sub-workflow için `WorkflowExecutor.execute()` çalıştırır
5. Sonuç agent'a döndürülür

Sub-workflow'lar v1'de HITL için duraklayamaz. İç içe bir sub-workflow bekleyen inceleme durumuna girmeye çalışırsa, iç içe çağrı içinde askıya alınmak yerine yürütme başarısız olur.

## Canvas Node Araçları

Canvas node araçları, bir agent'a `tool-input` handle'ı üzerinden bağlanan workflow node'larıdır. Agent kurulumu sırasında `_build_node_tool_schemas` bu edge'leri tarar ve bağlı her node için bir OpenAI uyumlu araç şeması ekler.

- **Araç kaynağı**: `_source: "node_tool"`
- **Araç adı**: bağlı node label'ından türetilir, yinelenenler için son ekler eklenir
- **Araç parametreleri**: node'un `agentProvidedFields` alanından oluşturulur
- **Sabit alanlar**: `agentProvidedFields` içinde listelenmeyen tüm node alanları node yapılandırmasında kalır

### Yürütme Akışı

1. Agent bağlı bir node aracını çağırmaya karar verir
2. `_execute_node_tool` node verisini kopyalar
3. Agent tarafından sağlanan argümanlar yapılandırılmış node alanlarına birleştirilir
4. `execute_node` bu node'u branch scheduling devre dışı bırakılmış şekilde bir kez çalıştırır
5. Orijinal node verisi geri yüklenir
6. Node çıktısı araç sonucu olarak agent'a döndürülür

Araç node'ları iki kez çalışmamaları için normal workflow scheduling'den hariç tutulur. Yalnızca agent araç çağrısı yolu üzerinden yürütülürler.

## Human-in-the-Loop

Bir agent üzerinde `hitlEnabled` ayarlandığında, agent belirli onay kontrol noktalarında çağırabileceği bir `request_human_review` aracı alır.

1. Sistem prompt'u ve node HITL yönergeleri agent'a hangi eylemlerin onay gerektirdiğini söyler
2. Agent bu adımlardan birine ulaştığında `request_human_review` çağırır
3. Heym bir workflow yürütme snapshot'ı saklar ve bir genel inceleme isteği oluşturur
4. Node sonucu bir inceleme URL'si ile `pending` olarak işaretlenir
5. Agent'ın `review` çıktı handle'ı hemen schedule edilir, böylece bildirim branch'leri bekleyen payload ile çalışabilir
6. İnceleyici yanıt verene kadar ana yürütme scheduling durur
7. `accept`, `edit` veya `refuse` üzerine, executor saklanan snapshot'tan yeniden oluşturulur
8. Duraklatılan agent onaylanan inceleme bağlamıyla devam eder veya `refuse` üzerine hemen çıkar
9. Devam eden agent bittikten sonra downstream node'lar, `review` branch'ini yeniden çalıştırmadan devam eder
10. Daha sonraki bir eylem de onay gerektiriyorsa, agent aynı çalıştırmada başka bir HITL kontrol noktası oluşturabilir

İnceleyiciye yönelik özet, inceleme isteğinin kendisinden oluşturulur, böylece node alanı onay politikasına ve zamanlamaya odaklanmış kalabilir.

Bu, agent workflow'larının konuşma geçmişini, tamamlanan node çıktılarını, loop durumunu ve diğer çalışma zamanı bağlamını koruyarak harici onay beklemesini sağlar.

## Orchestrator Araç Executor'ı

Özel araç executor'ı şu yönlendirmeleri yapar:

- **Sub-agent çağrıları** (`_source == "sub_agent"`) → `_execute_sub_agent_tool`
- **Sub-workflow çağrıları** (`_source == "sub_workflow"`) → `_execute_sub_workflow_tool`
- **Canvas node araçları** (`_source == "node_tool"`) → `_execute_node_tool`
- **İnsan incelemesi** (`_source == "hitl"`) → bekleyen bir HITL kontrol noktası oluşturur
- **Diğer araçlar** → `_unified_tool_executor` (Python, MCP, skill araçları)

HITL etkinleştirildiğinde, `subAgentLabels` ile `isOrchestrator` ayarlandığında veya `subWorkflowIds` yapılandırıldığında kullanılır.

## Skills

Skills, agent'ın sistem bağlamını genişletir ve Python araçları ekleyebilir.

- **Yapı**: `AgentSkill` = `{ id, name, content, files?, timeoutSeconds? }`
- **İçerik**: Sistem talimatının başına eklenir (`---` ile birleştirilir)
- **Python araçları**: `.py` dosyası içeren her skill için bir `skill_{skill_name}` aracı eklenir
- **Yürütme**: `skill_python_executor.py`, geçici bir dizinde `uv run python` ile script'leri çalıştırır; argümanlar stdin üzerinden JSON, sonuç stdout üzerinden JSON olarak alınır

Skills, [Agent Node](../nodes/agent-node.md) yapılandırmasındaki Skills alanına bir `.zip` veya `.md` dosyası bırakılarak eklenebilir.

## MCP Client

MCP (Model Context Protocol) client, harici araç sunucularına bağlanır.

- **Taşıma katmanları**: `stdio` (komut + argümanlar) veya `sse` (url + başlıklar)
- **Araçları listele**: `list_mcp_tools` → `ClientSession.list_tools()` → `_source: "mcp"` ile OpenAI fonksiyon formatına dönüştürülür
- **Yürüt**: `execute_mcp_tool` → `ClientSession.call_tool()` → sonuç `_extract_tool_result` üzerinden alınır

MCP bağlantılarını [MCP Tab](../tabs/mcp-tab.md) üzerinden veya agent node'un `mcpConnections` alanında yapılandırın.

## Tool Calling

LLM servisi bir `execute_with_tools` döngüsü çalıştırır:

1. **Bağlam sıkıştırma kontrolü** — her iterasyondan önce token kullanımını tahmin edin ve gerekirse sıkıştırın (aşağıya bakın)
2. Modeli `tools` ve `tool_choice: "auto"` ile çağırın
3. `tool_calls` mevcutsa: her çağrı için `tool_executor(tool_def, name, args, timeout)` çalıştırın
4. Araç sonucunu mesajlara ekleyin, tekrarlayın
5. Daha fazla araç çağrısı kalmadığında veya `max_tool_iterations` değerine ulaşıldığında durun

### Tool Dispatch

`_unified_tool_executor`, `_source` değerine göre yönlendirir:

| Kaynak | İşleyici |
|--------|---------|
| `mcp` | `execute_mcp_tool` |
| `skill` | `execute_skill_python` |
| (varsayılan) | `execute_tool` (Python kod araçları) |

Araçlar OpenAI fonksiyon çağırma formatını kullanır: `name`, `description`, `parameters` (JSON schema).

## Context Compression

Uzun süre çalışan agent'larda bağlam taşmasını önlemek için Heym, her araç iterasyonundan önce biriken `messages` listesini otomatik olarak sıkıştırır.

### Algoritma

1. **Token tahmini**: Tüm mesajlar genelinde `total_chars / 4` (hızlı, tokenizer gerekmez)
2. **Eşik kontrolü**: `estimated_tokens < context_limit × 0.80` ise sıkıştırmayı atlayın
3. **Bağlam limiti**: `client.models.retrieve(model).context_window` deneyin; başarısız olursa yerleşik tabloya geri dönün (`gpt-4o` → 128K, `claude-3-5-sonnet` → 200K, `gemini-2.0-flash` → 1M, vb.); varsayılan 128K
4. **Çapa koruma**: her zaman koruyun
   - İlk `system` mesajı (agent kimliği ve talimatları)
   - İlk `user` mesajı (orijinal görev)
   - Son `user` mesajı (en güncel talimat)
5. **Ortayı özetle**: İlk ve son user mesajı arasındaki her şey serileştirilir ve aynı modele bir özetleme prompt'u ile gönderilir
6. **Yeniden oluştur**: `[system, first_user, assistant(summary), last_user]`

2'den az farklı user mesajı varsa (özetlenecek orta kısım yok) veya LLM özetleme çağrısı başarısız olursa (güvenli geri dönüş: orijinal mesajları döndür) sıkıştırma atlanır.

### Observability

Her sıkıştırma olayı şu şekilde kaydedilir:
- `tool_calls_collected` içinde bir `_context_compression` girdisi → Execution History çalıştırma detayında görünür
- `phase: "compression"` içeren bir `on_tool_call` olayı → Debug panelinde `Context compressed (N messages → summary)` olarak işlenir
- Bir `context.compression` LLM trace girdisi → Traces sekmesinde önce/sonra token tahminleriyle görünür

Agent araç çağrıları ayrıca daha zengin observability üretir:

- `tool_calls` üzerinde çağrı başına yaşam döngüsü alanları: `tool_call_id`, `status` (`success` / `error` / `pending` / `timeout` / `cancelled`), `started_at`, `finished_at`, `elapsed_ms`
- Agent sonucu üzerinde toplu `tool_metrics` (duruma göre sayımlar artı toplam/maks süre); `_context_compression` girdileri bu sayımlardan hariç tutulur
- İsteğe bağlı OpenTelemetry alt span'leri: `heym.agent.tool.execute` (bkz. [OpenTelemetry Tracing](./opentelemetry.md))
- Kalıcı hale getirilen LLM trace / execution-history `tool_calls` payload'ları redakte edilir ve boyutla sınırlandırılır; canlı HITL devam durumu eşleştirme için orijinalleri saklar

## İlgili

- [Why Heym](../getting-started/why-heym.md) – Agent yaşam döngüsü boyunca çoklu-agent orkestrasyonu
- [Agent Node](../nodes/agent-node.md) – Yapılandırma ve parametreler
- [Agent Persistent Memory](./agent-persistent-memory.md) – Agent node başına bilgi grafiği ve eşler arası paylaşım
- [Human-in-the-Loop](./human-in-the-loop.md) – İnceleme bağlantıları, bekleyen payload'lar ve devam davranışı
- [OpenTelemetry Tracing](./opentelemetry.md) – Workflow, node ve Agent aracı span'leri
- [Node Types](./node-types.md) – Agent ve ilgili node'lar
- [Parallel Execution](./parallel-execution.md) – DAG tabanlı ve alt-agent paralel yürütme
- [MCP Tab](../tabs/mcp-tab.md) – MCP bağlantılarını yapılandırın
- [Expression DSL](./expression-dsl.md) – Alt-agent'lar için `$input.text`
