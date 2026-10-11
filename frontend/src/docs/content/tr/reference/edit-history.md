# Düzenleme Geçmişi

Düzenleme Geçmişi, bir workflow'un kaydedilmiş sürümlerini izler. Zaman içindeki değişiklikleri görüntülemek, sürümleri karşılaştırmak veya önceki bir duruma geri dönmek için kullanın.

**Not:** Düzenleme Geçmişi, [Yürütme Geçmişi](./execution-history.md) ile farklıdır. Düzenleme Geçmişi **kaydetmeleri** (workflow yapısı değişiklikleri) izler; Yürütme Geçmişi ise **çalıştırmaları** (geçmiş yürütmeler) izler.

## Nerede Bulunur

**Editör araç çubuğu** → **Düzenleme Geçmişi** (GitBranch simgesi)

## Sürümler

Workflow'u her **Kaydettiğinizde** yeni bir sürüm oluşturulur. Liste şunları gösterir:

- **Geçerli** – En son kaydedilen durum (tuval üzerinde gördüğünüz)
- **Sürüm N** – Zaman damgalarıyla birlikte geçmiş kaydetmeler

Bir öncekiyle karşılaştırıldığında değişiklik içermeyen sürümler gizlenir.

## Fark Görünümü

Geçerli workflow'a kıyasla nelerin değiştiğini görmek için bir sürüm seçin:

| Değişiklik Türü | Açıklama |
|-------------|--------------|
| **Düğümler** | Eklenen, kaldırılan veya değiştirilen düğümler |
| **Kenarlar** | Eklenen, kaldırılan veya değiştirilen bağlantılar |
| **Yapılandırma** | Workflow düzeyindeki ayarlar (kimlik doğrulama, hız sınırları vb.) |

Alan düzeyindeki farkları (örn. hangi düğüm özelliklerinin değiştiğini) görmek için her değişikliği genişletin.

## Önizleme

Workflow'un geçmiş bir sürümde nasıl göründüğünü görmek için Geri Dön'ün yanındaki **Önizleme**'ye tıklayın.

O sürümün düğümlerini ve kenarlarını gösteren salt okunur bir tuval açılır. Düzeni keşfetmek için kaydırabilir ve yakınlaştırabilirsiniz; bu görünümden hiçbir değişiklik yapılamaz.

## Geri Dön

Geçmiş bir sürümü geri yüklemek için:

1. İstediğiniz sürümü seçin
2. **Geri Dön**'e tıklayın
3. İşlemi onaylayın
4. Geçerli workflow, seçilen sürümle değiştirilir; sayfa yeniden yüklenir

Geri dönmek yeni bir "geçerli" durum oluşturur—gerekirse tekrar geri dönebilirsiniz.

## Geçmişi Temizle

Tüm sürüm geçmişini kaldırmak için iletişim kutusu başlığındaki çöp kutusu simgesine tıklayın. Bu işlem geri alınamaz. Geçerli workflow kalır; yalnızca geçmiş sürümler silinir.

## Sürümler Ne Zaman Oluşturulur

Sürümler yalnızca **Kaydettiğinizde** (Ctrl/Cmd+S veya Kaydet düğmesi) oluşturulur. Kaydedilmemiş değişiklikler, siz kaydedene kadar Düzenleme Geçmişi'nde saklanmaz.

Agent skill düzenlemeleri bu anlık görüntülere dahil edilir. Tüm workflow'u geri döndürmeden tek bir skill'i taramak veya geri yüklemek için Agent düğümü özellikler panelindeki o skill kartında bulunan **Geçmiş** düğmesini kullanın. Bkz. [Agent Düğümü](../nodes/agent-node.md#skill-history).

## İlgili

- [Yürütme Geçmişi](./execution-history.md) – Geçmiş çalıştırmalar ve Tuvale Getir
- [Workflow Yapısı](./workflow-structure.md) – Düğüm ve kenar biçimi
- [Workflows Sekmesi](../tabs/workflows-tab.md) – Workflow'ları oluşturma ve yönetme
