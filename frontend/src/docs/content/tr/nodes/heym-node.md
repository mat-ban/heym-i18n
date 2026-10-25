# Heym

**Heym** düğümü, Heym'in kendi verilerini okur: erişebildiğiniz workflow'lar, tek bir workflow'un yapısı ve onun yürütme geçmişi. Meta-workflow'ları — örnek envanterleri, yürütme özetleri ve Heym'in kendisi hakkındaki sağlık raporlarını — bu şekilde oluşturursunuz.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| İşlemler | `listWorkflows`, `getWorkflow`, `getExecutionHistory` |
| Credential | Gerekli değil |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `heymOperation` | Select | Hangi okumanın gerçekleştirileceği |
| `heymWorkflowId` | UUID | `getExecutionHistory` için `all` olarak ayarlarsanız erişebildiğiniz her Workflow okunur. |
| `heymLimit` | String | Döndürülecek maksimum satır sayısı. **Her şeyi döndürmek için boş bırakın veya `0` girin** — varsayılan budur. Expression destekler. |
| `heymStatus` | String | `getExecutionHistory` için isteğe bağlı durum filtresi. Expression destekler. |
| `heymSinceDays` | String | `getExecutionHistory` için isteğe bağlı gün cinsinden geriye bakış. Expression destekler. |

Workflow seçici, erişebildiğiniz her workflow'u listeleyen aranabilir bir açılır menüdür.

## Erişim Kapsamı

Sonuçlar, çalıştırmayı başlatan kişiye değil, **düğümün içinde bulunduğu workflow'un sahibine** göre kapsamlandırılır. Görünür küme şunlardır:

- sahibin sahip olduğu workflow'lar,
- doğrudan sahiple paylaşılan workflow'lar,
- sahibin üyesi olduğu bir ekiple paylaşılan workflow'lar.

Sahip kapsamlandırması, düğümün bir çalıştırma manuel olarak, cron ile, bir portaldan veya bir platform olayıyla başlatılmış olsun aynı şekilde davranmasını sağlayan şeydir. Aktör kapsamlandırması, gözetimsiz her çalıştırmada hiçbir şey döndürmezdi. Bu, Heym'in credential'lar ve global değişkenler için zaten kullandığı kuralın aynısıdır.

Erişemediğiniz bir workflow ile var olmayan bir workflow aynı hata mesajını üretir; böylece düğüm, workflow id'lerini yoklamak için kullanılamaz.

## İşlemler

### Workflow'ları Listele

Sahibin erişebildiği her workflow'u, en son güncellenenden başlayarak döndürür.

| Expression | Açıklama |
|------------|-------------|
| `$nodeLabel.workflows` | Workflow özetleri dizisi |
| `$nodeLabel.workflows[0].id` | Workflow UUID'si |
| `$nodeLabel.workflows[0].name` | Workflow adı |
| `$nodeLabel.workflows[0].description` | Açıklama veya `null` |
| `$nodeLabel.workflows[0].active` | Workflow'un etkin olup olmadığı |
| `$nodeLabel.workflows[0].folder_id` | Klasör UUID'si veya `null` |
| `$nodeLabel.workflows[0].updated_at` | Son kaydetmenin ISO zaman damgası |
| `$nodeLabel.workflows[0].node_count` | Workflow'un içerdiği düğüm sayısı |
| `$nodeLabel.total` | Limit uygulanmadan **önceki** tam erişilebilir sayı |

`total` kasıtlı olarak sınırsız sayıdır; böylece döndürülen satırları sınırladığınızda bile `$inventory.total` gerçek boyutu bildirir. **Limit**'i temizlemek veya `0` olarak ayarlamak her workflow'u döndürür — bu varsayılandır.

### Workflow Getir

Bir workflow'un kimliğini ve yapısını döndürür.

| Expression | Açıklama |
|------------|-------------|
| `$nodeLabel.id`, `$nodeLabel.name`, `$nodeLabel.description` | Workflow kimliği |
| `$nodeLabel.active`, `$nodeLabel.folder_id`, `$nodeLabel.updated_at` | Workflow meta verileri |
| `$nodeLabel.node_count` | Düğüm sayısı |
| `$nodeLabel.nodes` | `{ id, type, label, position, data }` dizisi |
| `$nodeLabel.edges` | `{ id, source, target, sourceHandle, targetHandle }` dizisi |

`data`, **tam düğüm yapılandırmasıdır** — kaydedildiği haliyle her alan. Denetimi mümkün kılan şey budur: bir düğüm, birinin bir alana yapıştırdığı bir API anahtarı için workflow'u taramanıza izin vermeyi reddederse tarama yapamazsınız.

Bu, çağıranın zaten sahip olmadığı hiçbir erişim sağlamaz. Düğüm, sahibin zaten editörde açabildiği workflow'larla kapsamlandırılmıştır ve saklanan credential sırları hâlâ burada değildir: düğüm verisi yalnızca credential **id'lerini** tutar; sırların kendisi ise credentials tablosunda şifrelenmiş olarak yaşar.

### Sabit kodlanmış sırları tarama

```
cron → heym (listWorkflows) → loop → heym (getWorkflow) → agent → slack
```

Agent'a `$detail.nodes` verin ve canlı bir anahtar veya token gibi görünen herhangi bir `data` değerini işaretlemesini isteyin. İzlenmeye değer alanlar serbest metin olanlardır — HTTP düğümlerindeki `curl`, LLM ve Agent düğümlerindeki `userMessage` ve `systemInstruction` ile Python tool gövdeleri — çünkü bir credential id zararsız bir UUID'dir, ancak yapıştırılmış bir `sk-…` değildir.
### Yürütme Geçmişini Al

Bir workflow için yürütme geçmişi girdilerini en yeniden en eskiye doğru döndürür.

| İfade | Açıklama |
|------------|-------------|
| `$nodeLabel.executions` | Geçmiş girdilerinin dizisi |
| `$nodeLabel.executions[0].id` | Yürütme UUID'si |
| `$nodeLabel.executions[0].status` | `success`, `error` vb. |
| `$nodeLabel.executions[0].started_at` | ISO zaman damgası |
| `$nodeLabel.executions[0].execution_time_ms` | Gerçek geçen süre |
| `$nodeLabel.executions[0].trigger_source` | Çalıştırmayı başlatan şey, örneğin `cron` veya `heym_event` |
| `$nodeLabel.executions[0].recovered` | Çalıştırmanın bir çökmeden sonra kurtarılıp kurtarılmadığı |
| `$nodeLabel.executions[0].inputs` | Çalıştırmanın aldığı şey - trigger payload'ı veya çağıranın girdisi |
| `$nodeLabel.executions[0].outputs` | O çalıştırma için workflow'un çıktısı |
| `$nodeLabel.workflow_id`, `$nodeLabel.workflow_name` | Geçmişin ait olduğu Workflow veya **{AW}** ile `null` |
ya **{AW}** ile `null` |
| `$nodeLabel.total` | Limit **öncesindeki** eşleşen toplam yürütme sayısı |
| `$nodeLab| `$nodeLabel.executions[0].workflow_id`, `$nodeLabel.executions[0].workflow_name` | **{AW}** ile her çalıştırmanın ait olduğu Workflow |
el.by_status` | Duruma göre anahtarlanmış sayımlar, örneğin `{ "success": 41, "error": 3 }` |
| `$nodeLabel.since` | Pencerenin başlangıcı veya tam geçmiş için `null` |

Girdiler hem `inputs` hem de `outputs` taşır - çalıştırmanın ne aldığı ve ne yanıtladığı - ancak asla `node_results` taşımaz: düğüm başına iz, tablodaki en büyük sütundur ve aşağı yöndeki her şeyi gölgede bırakır. Tam iz gerektiğinde API üzerinden tek bir yürütme alın.

`total` ve `by_status` her zaman eşleşen **tüm** geçmişi tanımlar, **Limit** döndürülen girdileri sınırlasa bile — böylece en son beş çalıştırmayı çekip yine de doğru bir hata sayısı raporlayabilirsiniz.

Her şeyi kapsamak için **Since (days)** alanını boş bırakın, her durumu dahil etmek için **Status filter** alanını boş bırakın ve her girdiyi döndürmek için **Limit** alanını boş veya `0` bırakın.

## Örnek Workflow

**Günlük instance özeti**

```
cron → heym (listWorkflows) → loop → heym (getExecutionHistory) → llm → sendEmail
```

- `inventory` olarak etiketlenmiş **Heym** `listWorkflows`
- `$inventory.workflows` üzerinde **Loop**
- `heymWorkflowId` loop öğesinin `id` değerine, `heymSinceDays` değeri `1`'e ve `heymLimit` değeri `5`'e ayarlanmış **Heym** `getExecutionHistory`
- **LLM**, toplanan çalıştırmaları ve durum sayımlarını okunabilir bir özete dönüştürür

## Notlar

- Credential gerekmez; düğüm, Heym'in üzerinde çalıştığı aynı veritabanını okur.
- **Limit**, her iki listeleme işlemi için de aynı alandır ve her ikisinde de aynı anlama gelir: boş veya `0` her şeyi döndürür.
- Düğüm normal bir girdi alır ve bir Agent düğümüne araç olarak eklenebilir, böylece bir agent Heym instance'ınız hakkındaki soruları yanıtlayabilir — veya onu denetleyebilir.
- `getWorkflow` payload'ları workflow ile birlikte büyür: uzun prompt'lar ve Python araç gövdeleri `data` içinde taşınır.
- Bir zamanlamaya göre yoklama yapmak yerine workflow değişikliklerine gerçekleştikçe tepki vermek için [Heym Trigger](./heym-trigger-node.md) ile eşleştirin.

## İlgili

- [Heym Trigger](./heym-trigger-node.md) – Platform olaylarından bir workflow başlatın
- [Execute](./execute-node.md) – Bir workflow'u tanımlamak yerine çalıştırın
- [Loop](./loop-node.md) – Döndürülen workflow listesi üzerinde yineleyin
