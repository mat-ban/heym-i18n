# Analytics Sekmesi

**Analytics** sekmesi, workflow'larınız için yürütme metriklerini ve eğilimleri gösterir. Kullanımı, performansı izleyin ve darboğazları belirleyin.

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Analytics demosunu izleyin</a></p>

## Özet İstatistikler

- **Toplam yürütme** – Seçilen dönemdeki workflow çalıştırma sayısı
- **Başarı oranı** – Başarılı çalıştırmaların yüzdesi
- **Ortalama süre** – Ortalama yürütme süresi
- **Kazanılan zaman** – Tahmini toplam kazanılan zaman: her workflow için yapılandırılmış çalıştırma başına kazanılan dakika × başarılı çalıştırma sayısı, seçilen pencere genelinde toplanır
- **Eğilimler** – Önceki döneme kıyasla artış/azalış göstergeleri

## Zaman Aralığı

- **1h**, **3h**, **6h** – Son 1 saat, 3 saat veya 6 saat. Analitikler saatlik tutulur, bu nedenle pencerenin başladığı saati bütün olarak sayarlar: 15:20'de Son Saat, 14:00'ten şu ana kadar olan süreyi kapsar
- **24h** – Son 24 saat
- **7d** – Son 7 gün
- **30d** – Son 30 gün
- **All** – Mevcut tüm geçmiş

## Workflow Filtresi

- Metrikleri belirli bir workflow'a göre filtreleyin
- **Tüm workflow'lar** – Tüm workflow'lar genelinde toplu görünüm

## Tablolar

İki tablo workflow kullanımını gösterir: **En Çok Kullanılan** (daha geniş) ve **En Çok Başarısız Olan**.

- **Kazanılan Zaman** – En Çok Kullanılan, her workflow için toplam kazanılan zamanı gösterir (çalıştırma başına kazanılan dakika × başarılı çalıştırma sayısı). **Not Set**, tahminin eksik olduğu anlamına gelir; workflow üzerindeki ilgili alanı açmak için üzerine tıklayın.
- **Sıralanabilir sütunlar** – İlgili sütuna göre sıralamak için sütun başlığına tıklayın. Artan/azalan sıralamayı değiştirmek için tekrar tıklayın. Ok göstergeleri sıralama yönünü gösterir.
- **Mobil etiketler** – Küçük ekranlarda sütun etiketleri kısaltılır (örn. "Executions" → "Runs", "Success" → "OK", "Error" → "Err"), böylece tablolar yatay kaydırma olmadan sığar.

## Grafikler

- **Zaman İçinde Yürütme Hacmi** – Zaman aralığı başına yürütmelerin çizgi grafiği
- **Başarı ve Hata Oranı** – Sağlıklı ve başarısız çalıştırmaları karşılaştıran alan grafiği
- **Zaman İçinde Ortalama Gecikme** – Yanıt süresi değişimlerini gösteren çizgi grafiği
- **Seçmek için sürükleyin** – Özel bir tarih aralığına odaklanmak için herhangi bir grafik üzerinde tıklayıp sürükleyin. Bir seçim grafikte en az iki noktayı kapsamalıdır; düz bir tıklama hiçbir şey seçmez
- **Seçim modu** – Seçilen aralıklar, temel ön ayarı değiştirmeden özet kartlarını, grafikleri ve workflow tablolarını yeniler
- **Seçimi Temizle** – İnceleme işiniz bittiğinde ön ayarlı zaman penceresine dönün

## Düğüm Tipleri

Gecikme yüzdeliklerinin altında, görünümdeki workflow'lar genelinde düğüm tipine (Agent, HTTP Request, Code vb.) göre gruplanmış olarak düğüm süresinin ve hatalarının nereye gittiğini gösteren üç grafik yer alır:

- **En Çok Zaman Alan Düğümler** – Çağrı başına ortalama süre olarak çizilen, en çok toplam çalışma süresine sahip 10 düğüm tipi. Bir tipte çağrı yapılmayan bir saat, araç ipucunda **Çağrı yok** olarak gösterilir.
- **En Çok Hata Veren Düğüm Tipleri** – Her biri zaman dilimi başına kendi hata sayısına sahip, en çok hataya (hata veya timeout) sahip 10 düğüm tipi.
- **En Çok Çağrılan Düğüm Tipleri** – Her biri zaman dilimi başına kendi çağrı sayısına sahip, en çok çalışan 10 düğüm tipi. Atlanan düğümler sayılmaz.

İşaretçinin altındaki düğüm tipini hemen yanında görmek için fareyi bir grafiğin üzerine getirin. Bir grafikteki en büyük düğüm tipinin yanında görülemeyecek kadar küçük olan bir düğüm tipi (onun %1'inin altı), o grafikten ve göstergesinden çıkarılır. Grafikler workflow filtresini, zaman aralığını ve bir grafik üzerinde sürüklediğiniz herhangi bir aralığı takip eder. Düğüm analitiği, bunları ekleyen sürümden itibaren yapılan çalıştırmalar için kaydedilir ve tamamlanan bir çalıştırma yaklaşık bir dakika içinde görünür. Daha eski çalıştırmalar sayılmaz.

## Otomatik Yenileme

- Metrikleri manuel yeniden yükleme olmadan güncel tutmak için otomatik yenilemeyi etkinleştirin

## İlgili

- [Workflows Sekmesi](./workflows-tab.md) – Ölçülen workflow'lar
- [Traces Sekmesi](./traces-tab.md) – Ayrıntılı trace incelemesi
- [Logs Sekmesi](./logs-tab.md) – Hata ayıklama için çalışma zamanı logları
- [Bağlamsal Vitrin](../reference/contextual-showcase.md) – Dashboard yüzeyleri için kompakt sayfa kılavuzu

Bir grafik, izlemek yerine kendisi hakkında bilgilendirilmek istediğiniz bir eğilim gösterdiğinde, onu bir [alert](./alerts-tab.md) haline getirin: hata sayısı, çalıştırma süresi, LLM harcaması ve yürütme sayısının tümüne bir zaman penceresi üzerinden eşik değeri atanabilir.
