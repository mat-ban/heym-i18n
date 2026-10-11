# Board

**Board** sekmesi, agentic bir kanban panosudur. İşler sütunlar arasında ilerler ve her
sütun Heym workflow'larını çalıştırabilir. Bir kart yalnızca bir görev değildir — bağlam,
konuşma geçmişi, yürütme durumu, çıktılar ve workflow çalıştırmalarını taşıyan kalıcı
bir agentic iştir.

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

## Board'lar ve sütunlar

- İhtiyacınız kadar board oluşturabilirsiniz. Yeni bir board, varsayılan sütunlarla
  başlar: **Backlog → Planning → Development → Done**.
- Her board bir **Agentic Kanban Model**'e (bir credential ve bir model) ihtiyaç duyar.
  Bu zorunludur — New board diyaloğu bu olmadan bir board oluşturmaz ve buna sahip olmayan
  bir board'un eylemleri devre dışı kalır — çünkü her kartı çalıştırdığı workflow'ların
  girdilerine eşleyen ve çıktılarını tekrar okunabilir metne dönüştüren modeldir.
- Board başlığındaki dişli simgesi board ayarlarını açar: ad, açıklama
  (başlığın altında gösterilir) ve Agentic Kanban Model.
- Sütunlar tamamen düzenlenebilir: sütun ayarlarından ekleyin, yeniden adlandırın, rengini
  değiştirin, yeniden sıralayın veya silin (bir sütunun silinebilmesi için önce boş olması
  gerekir).
- Kartlar dikey olarak önceliğe göre sıralanır — yeniden sıralamak için sürükleyin.
- Ayrıca [Chat sekmesinden](./chat-tab.md) doğal dilde bir istekle kart oluşturabilirsiniz.
  Chat, gerektiğinde bir board seçmenizi ister ve kartı her zaman o board'un ilk sütununa
  ekler.

## Bir board'u paylaşma

Board ayarları ayrıca board'u **kullanıcılarla** (e-posta ile) ve **takımlarla**,
`read` veya `write` izniyle paylaşmanızı sağlar:

- **read** — board ve kartları görünürdür, ancak hiçbir şey değiştirilemez: yeni kart yok,
  taşıma yok, yorum yok, çalıştırma yok.
- **write** — board'un tam kullanımı: kartlar, taşımalar, yorumlar ve çalıştırmalar.
- Dişli ve silme düğmelerini yalnızca **owner** görür ve board'un ayarlarını, Agentic
  Kanban Model'ini veya paylaşımlarını yalnızca owner değiştirebilir.

Paylaşılan bir board'daki chain'ler her zaman **owner'ın** credential'ları ve Agentic
Kanban Model'i ile çalışır, böylece işbirlikçilerin kendi credential'larına hiç ihtiyacı
olmaz.

## Kart ekleri

Bir kartı açın ve ona dosya eklemek için **Attach file**'ı kullanın — dosyaları kutuya
bırakın veya düğmeyle seçin ve aynı listeden kaldırın. Ekler
[Drive](./drive-tab.md) içinde saklanır.

Her çalıştırma, **workflow'lar başlamadan önce ekleri türe göre çözer**:

- **Belgeler** (pdf, markdown, csv, json, text) metne çıkarılır, dosya başına 20.000
  karakterle sınırlandırılır ve ekin `text` alanına yerleştirilir.
- **Görseller**, vision yolunun doğrudan yüklediği bir `url` olarak aktarılır (bir LLM
  node'unun görsel girdisi bunu olduğu gibi kabul eder).
- **Diğer her şey** düz bir referans olarak (`name`, `url`, `mime_type`) geçirilir.

Workflow'lar bunları `$input.card.attachments` konumunda okur (ve mapper ne eşlemiş olursa
olsun her zaman `$input.board.attachments` konumunda). Agentic Kanban Model, çıkarılan
metni ve görsel URL'lerini de görür, böylece bir eki doğrudan bir workflow'un beklediği
alana eşleyebilir.

## Sütun workflow chain'leri

Her sütun, **sıralı bir workflow listesi** (chain) ile yapılandırılabilir.
Bir kart, chain'i olan bir sütuna taşındığında:

1. Chain arka planda otomatik olarak başlar — taşımanın kendisi hiç beklemez.
2. Workflow'lar **sırayla** çalışır. Her workflow'un çıktısı, bir sonraki başlamadan önce
   kart bağlamına eklenir.
3. Bir workflow başarısız olursa chain durur: kalan halkalar atlanır ve kart **kırmızıya**
   döner.
4. Her halka başarılı olduğunda kart **yeşile** döner. Chain çalışırken kart **kehribar
   renginde** nabız atar; insan incelemesi için duraklatılan bir çalıştırma sabit kehribar
   durumu gösterir.

Çalıştırmalar, [Execution History](../reference/execution-history.md) içinde `board`
trigger kaynağıyla kaydedilir ve her kart, workflow başına çıktılar ve hatalarla birlikte
kendi çalıştırma listesini tutar. Bir workflow çalışırken bir kartı açın ve editörü tam o
yürütmeye bağlamak için çalıştırmanın yanındaki **Open live**'ı seçin. Aynı canvas
animasyonu, artımlı Debug log'ları ve nihai sonuç, ikinci bir çalıştırma başlatılmadan
görünür.

## Workflow'ların aldığı veriler

Zincir, workflow'un girdisi olarak standart bir payload iletir. Bunu `$input.card.title` gibi normal
[ifadelerle](../reference/expression-dsl.md) okuyun:

```json
{
  "triggered_by": "board",
  "rerun": false,
  "card": {
    "id": "…",
    "title": "Write launch email",
    "content": "Draft the launch email for the beta",
    "metadata": { "attachments": [{ "name": "brief", "url": "…" }] },
    "comments": [{ "author": "user", "content": "…", "created_at": "…" }],
    "history": [{ "kind": "event", "content": "…", "created_at": "…" }],
    "previous_outputs": [{ "workflow_name": "…", "output": {}, "finished_at": "…" }]
  },
  "board": { "id": "…", "name": "…" },
  "move": { "from_column": "Backlog", "to_column": "Planning" },
  "chain": { "position": 0, "length": 2, "previous_workflow_outputs": [] }
}
```

- `comments` — karttaki her yorum, en eskiden başlayarak.
- `history` — tam etkinlik zaman çizelgesi (yorumlar, taşımalar, çıktılar), en son
  200 girdiyle sınırlıdır.
- `previous_outputs` — daha önce tamamlanan çalıştırmalardan gelen çıktılar (önceki sütunlar ve
  takip turları).
- `chain.previous_workflow_outputs` — *geçerli* zincirdeki önceki bağlantıların çıktıları.
- Takip turlarında `move` değeri `null`, `rerun` değeri `true` olur.

## Planlama döngüsü (takip turları)

Yaygın bir kalıp, bir planlama workflow'unu **ikinci sütuna** koymaktır (varsayılan olarak
Planning adında — adı önemli değil; önemli olan slot). Bu workflow kartı zenginleştirir ve
takip soruları sorar:

1. Bir kartı ikinci sütuna taşıyın — workflow zenginleştirilmiş bir planı ve sorularını
   çıktı olarak karta geri yazar.
2. Kartın yorum dizisinde yanıtlayın. Yanıt kartı serbest bırakır: kart bir sonraki sütuna geçer
   ve o sütun kartı yanıtı bağlamında alır. İkinci sütunun zinciri yeniden çalıştırılmaz.
3. Planı yerinde iyileştirmek isterseniz bunun yerine **Run follow-up round** düğmesine basın. Aynı
   zincir, biriken tüm bağlamla yeniden çalışır, ardından kart siz yorum ekleyip serbest bırakana
   kadar o sütunda bekler.

Planlama kapısı konuma dayalıdır, ada dayalı değil: en soldaki sütun ve hemen sağındaki sütun
kendi kendine ilerlemez — zincirlerini çalıştırır ve sizi orada bekler (bir yorum ikinci sütunu
serbest bırakır). Üçüncü sütundan itibaren başarılı bir zincir kartı kendi kendine sağa, ta ki son
sütuna kadar ilerletir. Varsayılan "Planning" etiketini yeniden adlandırmak veya kaldırmak, hangi
slotun kapı olduğunu değiştirmez. Bir kartın aynı anda yalnızca bir etkin çalıştırması olabilir.

## Human-in-the-Loop ve Codex soruları

Bir zincir workflow'u duraklarsa — bir [Human-in-the-Loop](../reference/human-in-the-loop.md)
düğümünde, bir agent'ın HITL aracında veya bir [Codex](../nodes/codex-node.md) düğümü daha
fazla bilgiye ihtiyaç duyduğu için — çalıştırma bekleyen olarak kalıcı hale getirilir ve kart
kehribar rengindeki bekleyen durumunu gösterir. Her duraklama kendi yanıt yüzeyini korur: HITL için
bir HITL inceleme bağlantısı, Codex için Codex takip ekranı.

Yanıtladığınızda zincir kendi kendine devam eder: duraklatılan workflow tamamlanır, çıktısı
karta düşer, o sütunun zincirinin geri kalanı çalışır ve kart her zamanki gibi ilerler.
Devam eden çalıştırma başarısız olursa kart kırmızıya döner ve kalan bağlantılar atlanır.

## İlgili

- [Workflows](./workflows-tab.md)
- [Execution History](../reference/execution-history.md)
- [Expression DSL](../reference/expression-dsl.md)
- [Human-in-the-Loop](../reference/human-in-the-loop.md)
