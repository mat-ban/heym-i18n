# Heym Trigger

**Heym Trigger** düğümü, Heym'in kendisi bir platform olayı yayınladığında bir workflow başlatır. Heym'i Heym ile otomatikleştirmek için sıfır girişli bir trigger düğümüdür: değişiklik denetim kayıtları, dağıtım duyuruları ve instance sağlık özetleri.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 0 |
| Çıkışlar | 1 |
| Çıkış | `$nodeLabel.events`, `$nodeLabel.count`, `$nodeLabel.triggered_at` |
| Credential | Gerekli değil |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `eventNames` | String dizisi | Hangi olaylara abone olunacağı. Her olayı almak için boş bırakın. |

## Olaylar

| Olay | Yayınlandığı durum | Kapsam |
|-------|----------------|-------|
| `heym.started` | Heym platformu başladığında | Instance genelinde: her abone alır |
| `workflow.created` | Bir workflow oluşturulduğunda | Yalnızca workflow sahibinin aboneleri |
| `workflow.updated` | Bir workflow kaydedildiğinde | Yalnızca workflow sahibinin aboneleri |
| `workflow.deleted` | Bir workflow silindiğinde | Yalnızca workflow sahibinin aboneleri |

Dashboard widget'ları dahili olarak workflow şeklinde saklanır, ancak hiçbir zaman `workflow.*` olayı üretmezler.

## Teslimat Toplu Haldedir

Heym olayları her beş saniyede bir gönderir. **Tek bir gönderim geçişinde alınan her olay, tek bir workflow çalıştırmasında bir dizi olarak gelir.**

- Birbirinden beş saniye içinde iki workflow oluşturun → iki olay içeren **tek** çalıştırma.
- Bir workflow oluşturun → tek elemanlı bir dizi içeren **tek** çalıştırma.

Şekil hiçbir zaman değişmez, bu nedenle aşağı akış ifadeleri bir olayın mı yoksa birçok olayın mı geldiğine göre dallanmak zorunda kalmaz. Her olay için bir kez işlem yapmanız gerektiğinde, `$nodeLabel.events` üzerine bir [Loop](./loop-node.md) düğümü yerleştirin.

## Tam-Bir-Kez Teslimat

Her olay, teslim edilmeden önce benzersiz bir veritabanı kısıtlaması aracılığıyla abone olan düğüm başına talep edilir. Bu, her uvicorn worker'ında, her container'da ve her makinede geçerlidir: Heym'i iki sunucuda çalıştırmak bir olayı iki kez teslim etmez. Bir talep kaydedilemezse, olay hiç teslim edilmez — tasarım iki kez tetiklenmek yerine kapalı olarak başarısız olur.

Aynı olaya abone olan iki farklı `heymTrigger` düğümü, olayı birer kez alır; bunun için rekabet etmezler.

## Gönderim Penceresi

Gönderici yalnızca **son beş dakika** içinde yayınlanan olayları dikkate alır. Daha eski olaylar incelenmek üzere günlükte kalır ancak hiçbir zaman teslim edilmez. Bu, kesinti sonrası ne olacağını sınırlar: Heym'i bir saat çevrimdışı kaldıktan sonra yeniden başlatmak hiçbir şeyi yeniden oynatmaz, bir saatlik birikmiş işi tek seferde tetiklemek yerine.

Olaylar **7 gün** boyunca saklanır ve ardından silinir.

## Çıkış Alanları

| İfade | Açıklama |
|------------|-------------|
| `$nodeLabel.events` | Olay nesneleri dizisi, en eskiden başlayarak. Her zaman bir dizi. |
| `$nodeLabel.events[0].id` | Olay UUID'si |
| `$nodeLabel.events[0].name` | Olay adı, örneğin `workflow.created` |
| `$nodeLabel.events[0].payload` | Olay gövdesi |
| `$nodeLabel.events[0].workflow_id` | Konu workflow id'si veya `heym.started` için `null` |
| `$nodeLabel.events[0].created_at` | Olayın yayınlandığı zaman için ISO timestamp |
| `$nodeLabel.count` | Bu toplu işteki olay sayısı |
| `$nodeLabel.triggered_at` | Workflow yürütmesi için ISO timestamp |

### Payload şekilleri

`workflow.created`, `workflow.updated`, `workflow.deleted`:

```json
{
  "workflow_id": "…",
  "name": "Nightly report",
  "owner_id": "…",
  "actor_user_id": "…",
  "updated_at": "2026-08-11T09:30:00+00:00"
}
```

`heym.started`:

```json
{ "version": "1.4.2", "started_at": "2026-08-11T09:30:00+00:00" }
```

`workflow.deleted`, olayı okuduğunuzda workflow satırı artık mevcut olmadığından, silinmeden hemen önce yakalanan adı taşır.

## Örnek Workflow

**Workflow değişiklik denetim kaydı**

```
heymTrigger → heym (getWorkflow) → slack
```

- **Heym Trigger** etiketi `platformEvents`, `workflow.created`, `workflow.updated`, `workflow.deleted` olaylarına abone
- `getWorkflow` ve `heymWorkflowId` değeri `$platformEvents.events[0].workflow_id` olarak ayarlanmış **Heym** düğümü
- **Slack** mesajı: `"$platformEvents.count workflow change(s), latest: $platformEvents.events[0].name"`

## Notlar

- `heym.started`, Heym container başına sekiz worker çalıştırmasına rağmen worker başına değil, **platform başlangıcı başına bir kez** tetiklenir. Beş dakikadan fazla arayla başlayan container'ların her biri bir olay yayınlar.
- Bu şekilde tetiklenen yürütmeler, geçmişte `trigger_source = "heym_event"` ile görünür.
- Gelecek sürümlerde eklenen olay türlerini otomatik olarak almak istiyorsanız, dört olayın tümünü listelemek yerine **Events** değerini hiçbiri olarak ayarlayın.

## İlgili

- [Heym](./heym-node.md) – Workflow'ları ve yürütme geçmişini okuyun
- [Triggers](../reference/triggers.md) – Tüm workflow giriş noktalarına genel bakış
- [Loop](./loop-node.md) – Bir toplu işteki her olay için bir kez işlem yapın
