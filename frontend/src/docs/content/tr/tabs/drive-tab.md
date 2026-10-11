# Drive Sekmesi

Drive sekmesi, workflow'larınız genelinde skill'ler tarafından oluşturulan tüm dosyaları gösterir.

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Drive demosunu izleyin</a></p>

## Genel Bakış

Skill'ler tarafından oluşturulan dosyalar (PDF, DOCX, CSV, görseller vb.) otomatik olarak saklanır ve Drive sekmesinde listelenir. Her dosya; adını, türünü, boyutunu, kaynak node'unu, oluşturulma tarihini ve ekip paylaşım durumunu gösterir.

## Özellikler

- **Arama** - Dosyaları ada, türe veya kaynak node'a göre filtreleyin
- **Dosya ID'sini kopyala** - Dosya UUID'sini panoya kopyalayın; bir [Drive](../nodes/drive-node.md) veya [Converter](../nodes/converter-node.md) node'una yapıştırmaya hazır
- **İndir** - Kendi dosyalarınız ve ekipler aracılığıyla sizinle paylaşılan dosyalar için kimlik doğrulamalı indirme
- **Paylaş** - İsteğe bağlı parola koruması ve son kullanma süresiyle paylaşılabilir indirme bağlantıları oluşturun veya bir dosyayı mevcut ekiplerinizle salt okunur olarak paylaşın
- **Sil** - Dosyaları ve paylaşım bağlantılarını kaldırın
- **Tümünü Temizle** - Onaydan sonra tüm dosyaları ve paylaşım bağlantılarını silin
- **Toplu işlemler** - Onay kutularıyla birden fazla dosya seçin (aralık için Shift-tıklama) ve aynı işlemi hepsine tek seferde uygulayın
- **Sayfalama** - Büyük dosya koleksiyonlarında gezinin; sayfa başına satır seçici (25 / 50 / 100 / Tümü) ile

## Toplu İşlemler

Sahibi olduğunuz dosyaların satır başında bir onay kutusu görünür (bir ekip aracılığıyla sizinle paylaşılan dosyalar salt okunurdur ve seçilemez). Birkaç satır seçin — veya tüm sayfayı seçmek için başlık onay kutusunu kullanın ve aralık seçmek için **Shift-tıklama** yapın — ardından listenin üzerinde görünen toplu işlem çubuğunu kullanın:

- **ZIP İndir** seçili her dosyayı tek bir ZIP arşivinde toplar ve indirir
- **Toplu işlemler** seçili her dosyaya tek bir ayar uygulamak için tek bir iletişim kutusu açar:
  - Tek tıklamayla **Tümünü ekiplerimle paylaş** / **Ekip paylaşımını kaldır**
  - Aynı parola, son kullanma ve maksimum indirme ayarlarını kullanarak **Her dosya için paylaşım bağlantısı oluştur**
- **Sil** onaydan sonra seçili her dosyayı ve paylaşım bağlantılarını kaldırır
- **Seçimi temizle** her şeyin seçimini kaldırır

İletişim kutusu kaç dosyaya uygulandığını bildirir (sahibi olmadığınız dosyalar atlanır). Tüm Drive'ınızda seçim yapmak ve her dosyayı tek bir sayfada yüklemek için sayfa başına satır seçicisinin **Tümü** seçeneğini kullanın. Arama kutusuna yazmak, sayfa başına satır seçicisini otomatik olarak **Tümü** olarak değiştirir; böylece arama yalnızca geçerli sayfayı değil her dosyayı kapsar; aramayı temizlemek önceki seçiminizi geri yükler.

## Paylaşım

Şu özelliklerle paylaşım bağlantıları oluşturun:
- **Kimlik doğrulama yok** - Genel token tabanlı indirme URL'si
- **Basic Auth** - Parola korumalı bağlantı (kullanıcı adı: `file`)
- **Son kullanma** - İsteğe bağlı zamana dayalı son kullanma
- **İndirme sınırları** - İsteğe bağlı maksimum indirme sayısı

Bir dosyada **Ekiplerimle paylaş** seçeneğini etkinleştirerek dosyayı şu anda üyesi olduğunuz tüm ekipler için görünür hale getirin. Paylaşılan ekip üyeleri salt okunur erişim elde eder; yönetim işlemleri yalnızca sahibe aittir.

## Agent Skill Erişimi

Agent node'undaki skill'ler Drive dosyalarını okumayı seçebilir. Bir skill için **Enable Drive files** açık olduğunda, Python kodu oluşturulan `heym_drive.py` yardımcısı aracılığıyla erişilebilir Drive dosyalarını dosya id'sine veya tam dosya adına göre okuyabilir. Bu ayar varsayılan olarak kapalıdır.

Tam ayrıntılar için [Drive referansına](../reference/drive.md) bakın.

## İlgili

- [Drive Node](../nodes/drive-node.md) - Bir workflow'dan dosyaları listeleyin, meta verileri alın, ekiplerle paylaşın veya paylaşım kısıtlamalarını değiştirin
- [Dosya Oluşturma](../reference/file-generation.md) - Skill'ler dosyaları nasıl oluşturur
- [Drive referansı](../reference/drive.md) - Paylaşım bağlantıları, token'lar ve temizleme
- [Portal](../reference/portal.md) - Portal sohbet yanıtlarındaki dosya bağlantıları
