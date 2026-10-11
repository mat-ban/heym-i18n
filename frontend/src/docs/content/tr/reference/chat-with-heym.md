# Heym ile Sohbet

Heym ile Sohbet, dokümantasyon başlığından erişilebilen sayfa farkındalıklı bir asistandır. Ortalanmış bir diyalog içinde açılır, bir LLM credential ve model seçmenize olanak tanır ve mevcut dokümantasyon sayfasını ilk bağlam olarak kullanarak soruları yanıtlar.

## Diyaloğu Açma

1. `/docs` altındaki herhangi bir sayfayı açın
2. Başlıktaki **Chat with Heym** seçeneğine tıklayın
3. Bir [credential](../tabs/credentials-tab.md) ve model seçin
4. Sayfa veya platform hakkında bir soru sorun

Daha küçük ekranlarda tetikleyici yalnızca simge olarak görünür; daha büyük ekranlarda tam etiketi gösterir.

## Hangi Bağlamı Kullanır

- Açık olan dokümantasyon yolu, bağlamsal rehberlik olarak isteğe eklenir
- Arka uç, mevcut dashboard chat endpoint'ini ve dokümantasyon arama araçlarını kullanmaya devam eder
- Aynı chat arka ucu yeniden kullanıldığı için hesap düzeyindeki [User Rules](./user-settings.md) geçerli olmaya devam eder
- Canlı hazırlık adımları, dashboard chat'e benzer şekilde nihai yanıttan önce asistan baloncuğuna akış halinde gelir
- Açıklama soruları, [Chat sekmesinde](../tabs/chat-tab.md) olduğu gibi kartlar halinde görünür. Bir workflow isteği credential gerektirdiğinde, bir tane seçebilir veya karttan oluşturabilirsiniz. Bir veri tablosu gerektirdiğinde, tablolarınızdan birini seçebilir veya aynı şekilde yeni bir tane oluşturabilirsiniz.

Belirli bir makalede diyaloğu açtığınızda, küçük bir rozet etkin dokümantasyon yolunu gösterir; böylece hangi sayfanın önceliklendirildiğini doğrulayabilirsiniz.

## Oturum Davranışı

- Diyalog açık kaldığı sürece credential ve model seçimi korunur
- Mesaj geçmişi yalnızca oturuma özeldir ve diyalog kapandığında temizlenir
- Arka plana tıklama, `Escape` ve kapatma düğmesi oturumu sıfırlar
- **Stop**, mevcut akış yanıtını iptal eder
- Diyalog kasıtlı olarak geniş ve sabit boyutludur; tam ekran geçişi sunmaz

## Ne Zaman Kullanılır

- Bir düğüm veya referans sayfasını okurken takip soruları sorun
- Dokümantasyondan ayrılmadan özellik farklılıklarını netleştirin
- Editörü açmadan önce doğru makaleyi bulun

Workflow'ları doğrudan oluşturmak veya değiştirmek istiyorsanız, bunun yerine editör tarafındaki [AI Assistant](./ai-assistant.md) aracını kullanın.

## İlgili

- [AI Assistant](./ai-assistant.md) – Workflow oluşturmak için editör chat'i
- [Credentials Sekmesi](../tabs/credentials-tab.md) – Diyalog tarafından kullanılan LLM credential'larını ekleyin
- [Settings](./user-settings.md) – AI yüzeylerine uygulanan genel User Rules
- [Quick Start](../getting-started/quick-start.md) – İlk workflow başlangıç kılavuzu
