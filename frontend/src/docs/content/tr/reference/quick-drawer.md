# Quick Drawer

**Hızlı Çekmece**, workflow'lar için sağ tarafta yer alan hızlı çalıştırma panelidir. Dashboard'daki [Workflows sekmesi](../tabs/workflows-tab.md), Docs ve Evals gibi kimliği doğrulanmış sayfalarda görünür.

## Erişim

- Ekranın sağ-orta kenarındaki sabit **Quick / Workflows** tetikleyicisine tıklayın
- [Contextual Showcase](./contextual-showcase.md) de kullanılabilir olduğunda, onun **Page Guide** tetikleyicisi Quick Workflows'un üzerinde yer alır
- Çekmece sağdan açılır ve geçerli sayfayı hafif bir yeniden ölçeklendirme ile sola kaydırır
- Mobilde Hızlı Çekmece gizlenir
- Çekmece; workflow editörü, giriş/kayıt, portal veya HITL inceleme sayfalarında gösterilmez

## Workflow Arama

Workflow'ları aramak için çekmecenin üst kısmındaki filtre alanını kullanın:

- Workflow adı
- Workflow açıklaması

Arama büyük/küçük harfe duyarsızdır ve listeyi anında günceller.

## Sabitlenmiş Workflow'lar

Workflow'ları çekmecenin üst kısmında tutmak için sabitleyin.

- Sabitlenmiş workflow'lar, tam listenin üzerinde kendi bölümlerinde görünür
- Yeni sabitlemeler en üste eklenir
- Sabitleme sırası, tarayıcı depolamasında yeniden yüklemeler arasında korunur

## Workflow'ları Çalıştırma

Giriş formunu açmak için bir workflow seçin.

- Giriş alanları, çekmece sırasına göre dikey olarak gösterilir
- Seçili workflow'u çalıştırmak için **Run Workflow**'a tıklayın
- Çekmeceden çalışan bir yürütmeyi iptal etmek için **Stop Workflow**'a tıklayın
- Input alanı olmayan workflow'lar yine de doğrudan çalıştırılabilir

Çekmece, diğer Heym çalıştırma yüzeyleriyle aynı workflow yürütme API'sini kullanır; böylece çıktılar ve çalışma zamanı davranışı tutarlı kalır.

Çekmeceden bir çalıştırmayı durdurmak, o workflow çalıştırması için devam eden Playwright tarayıcı işi de dahil olmak üzere etkin arka uç yürütmesini de iptal eder.

## İlerleme ve Sonuçlar

Bir çalıştırma başlattıktan sonra çekmece şunları gösterir:

- Düğümler başlayıp biterken akış halinde adım ilerlemesi
- Nihai durum: `success`, `error` veya `pending`
- Kompakt bir JSON panelinde nihai çıktılar
- `Quick Drawer` etiketli geçmiş girdileri

`pending`, workflow'un insan incelemesi gibi sonraki bir eylemi beklediği anlamına gelir.

## Tarayıcı Depolaması

Hızlı Çekmece, kişisel tercihleri `localStorage` içinde saklar:

- Sabitlenmiş workflow kimlikleri
- Son seçilen workflow

Çekmece bu sürümde giriş değerlerini **kalıcı olarak saklamaz**.

## Kapsam

Hızlı Çekmece kasıtlı olarak hafif bir yürütme yüzeyidir.

- Dahil: arama, sabitleme, seçme, giriş, çalıştırma, ilerleme, sonuç
- Hariç: workflow oluşturma, düzenleme, klasör yönetimi ve canvas eylemleri

## İlgili

- [Workflows Sekmesi](../tabs/workflows-tab.md) – Ana workflow listesi, klasörler ve yönetim
- [Hızlı Başlangıç](../getting-started/quick-start.md) – İlk workflow'unuzu oluşturun ve çalıştırın
- [Yürütme Geçmişi](./execution-history.md) – Geçmiş çalıştırmaları inceleyin
- [Webhooks](./webhooks.md) – Workflow'ları HTTP üzerinden tetikleyin
- [Contextual Showcase](./contextual-showcase.md) – Hızlı Çekmece'yi tamamlayan sayfa düzeyinde kılavuz rayı
