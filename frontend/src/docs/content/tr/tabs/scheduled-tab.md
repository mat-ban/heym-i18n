# Zamanlanmış Sekmesi

**Zamanlanmış** sekmesi, tüm etkin cron workflow'larını görsel bir takvimde gösterir. Otomasyonlarınızın ne zaman çalıştırılacağını görmek için gün, hafta ve ay görünümleri arasında geçiş yapın.

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Zamanlanmış demosunu izleyin</a></p>

## Görünümler

- **Gün** – Seçilen gün için saat saat zaman çizelgesi; her gerçekleşme, zamanlanan saatinde bir blok olarak görünür
- **Hafta** – Geçerli haftayı kapsayan yedi sütunlu ızgara; birden fazla workflow aynı saatte tetiklendiğinde bloklar üst üste yığılır
- **Ay** – Tam ay ızgarası; her hücre, o gün çalıştırılacak workflow'ları listeler

## Workflow Blokları

Her blok şunları görüntüler:

- **Workflow adı** – Workflow canvas'ını doğrudan açmak için tıklayın
- **Cron ifadesi** – Üzerine gelindiğinde görünür ve ham zamanlamayı gösterir (örn. `0 9 * * 1-5`)

## Gezinme

`HEYM_ADMIN_EMAILS` içinde listelenen instance yöneticileri, **Tüm workflow'ları göster** işaretlendiğinde her sahibin zamanlamalarını görür. Yalnızca kendi workflow'larını görmek için işareti kaldırın. Diğer kullanıcılar **Benimle paylaşılanları göster** seçeneğini korur. Bir çalışanın otomasyonunu devre dışı bırakmak için, trigger'ları duraklatmak veya sürdürmek üzere Workflows önizlemesindeki [instance yönetim kontrollerini](./workflows-tab.md#instance-administration) kullanın.

- Günler, haftalar veya aylar arasında geçiş yapmak için **önceki / sonraki** oklarını kullanın
- **Bugün** düğmesi anında geçerli tarihe döner

## İlgili

- [Cron Node](../nodes/cron-node.md) – Canvas üzerinde zamanlanmış trigger'ları yapılandırın
- [Workflows Sekmesi](./workflows-tab.md) – Tüm workflow'ları yönetin ve düzenleyin
- [Analytics Sekmesi](./analytics-tab.md) – Yürütme metrikleri ve eğilimler
