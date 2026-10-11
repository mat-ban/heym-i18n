# İndirme ve İçe Aktarma

Workflow'ları veya tüm klasörleri dosya olarak dışa aktarın ya da sürükle-bırak yöntemiyle içe aktarın. Bunu yedekleme, paylaşma veya workflow'ları örnekler arasında taşıma amacıyla kullanın.

## Workflow İndirme (JSON)

**Konum:** Editör araç çubuğu → **Download** düğmesi (geniş ekranlarda görünür)

**Dışa aktarılanlar:**
- `nodes` – Canvas üzerindeki tüm düğümler
- `edges` – Düğümler arasındaki tüm bağlantılar

**Dosya adı:** `{workflow-name}.json` (workflow adından türetilir)

**Biçim:** JSON şeması için [Workflow Structure](./workflow-structure.md) bölümüne bakın.

## Klasör İndirme (ZIP)

**Konum:** Dashboard → Workflows sekmesi → klasör 3 nokta menüsü → **Download as ZIP**

**Dışa aktarılanlar:**
- Klasördeki ve tüm alt klasörlerdeki tüm workflow'lar, özyinelemeli olarak
- Klasör hiyerarşisi, ZIP içinde dizinler olarak korunur

**ZIP yapısı:**
```
FolderName/
  workflow1.json
  workflow2.json
  SubFolder/
    workflow3.json
    DeepSub/
      workflow4.json
```

Her `.json` dosyası `{ name, nodes, edges }` içerir.

## İçe Aktarma

### Dashboard'dan (Workflows Sekmesi)

1. [Workflows](../tabs/workflows-tab.md) sekmesine gidin
2. Bir **JSON** veya **ZIP** dosyasını workflow alanına sürükleyin

**JSON dosyası:** Yeni bir workflow oluşturulur. Workflow adı, JSON içindeki `name` alanından veya `name` yoksa dosya adından alınır.

**ZIP dosyası:** Tüm klasör yapısı kök düzeyinde yeniden oluşturulur. ZIP içindeki her `.json` dosyası, eşleşen klasöre yerleştirilen bir workflow haline gelir. Mevcut örnekte bulunmayan credential'lar ve workflow'lar arası referanslar otomatik olarak temizlenir. Bazı workflow'lar içe aktarılamazsa, kaç tanesinin başarılı olduğunu gösteren bir özet görüntülenir.

### Canvas'tan (Editör)

1. Editörde bir workflow açın
2. Bir JSON dosyasını canvas üzerine sürükleyin
3. Canvas'ta zaten düğümler veya edge'ler varsa, mevcut workflow'un değiştirilip değiştirilmeyeceğini soran bir onay iletişim kutusu görüntülenir
4. İçe aktarılan düğümler ve edge'ler mevcut workflow'un yerini alır veya mevcut workflow ile birleştirilir

## Dosya Biçimleri

### JSON (tek workflow)

```json
{
  "nodes": [...],
  "edges": [...],
  "name": "Optional workflow name"
}
```

- `nodes` – Zorunlu; düğüm nesneleri dizisi
- `edges` – İsteğe bağlı; edge nesneleri dizisi (varsayılan olarak `[]`)
- `name` – İsteğe bağlı; Dashboard içe aktarımından yeni bir workflow oluşturulurken kullanılır

### ZIP (klasör)

Dizin yapısının klasör hiyerarşisini yansıttığı ZIP arşivi. Her dosya bir workflow JSON'udur (yukarıya bakın). Klasör ve workflow adları sırasıyla dizin ve dosya adlarından türetilir.

Düğüm ve edge biçimleri için [Workflow Structure](./workflow-structure.md) bölümüne bakın.

## Kullanım Senaryoları

- **Yedekleme** – Büyük değişikliklerden önce workflow'ları veya tüm klasörleri indirin
- **Paylaşma** – JSON dosyalarını dışa aktarın ve ekip arkadaşlarınızla paylaşın
- **Taşıma** – Workflow'ları veya klasör yapılarını Heym örnekleri arasında taşıyın
- **Sürüm kontrolü** – Workflow JSON'larını kod ile birlikte Git'te saklayın

## İlgili Konular

- [Workflow Structure](./workflow-structure.md) – Düğümler ve edge'ler için JSON biçimi
- [Workflows Tab](../tabs/workflows-tab.md) – Workflow oluşturma ve sürükle-bırak ile içe aktarma
- [Workflow Organization](./workflow-organization.md) – Klasörler ve alt klasörler
- [Canvas Features](./canvas-features.md) – Canvas içe aktarma dahil editör özellikleri
