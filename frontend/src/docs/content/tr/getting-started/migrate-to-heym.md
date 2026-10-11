# Heym'e Geçiş

Başka bir araçta zaten workflow'larınız mı var? **AI Convert** bunları sizin için Heym workflow'larına dönüştürür. n8n, Flowise, Dify, Langflow, sim.ai veya Activepieces'ten bir workflow yapıştırın — ya da yalnızca ne istediğinizi tanımlayın — Heym eşdeğer workflow'u indirip içe aktarabileceğiniz canlı bir canvas üzerinde oluşturur.

**[heym.run/convert](https://heym.run/convert)** adresinden açın veya site başlığındaki **✨ AI Convert** düğmesini kullanın.

## Nasıl çalışır

1. **Kaynak aracınızı seçin** (isteğe bağlı) — n8n, Flowise, Dify, Langflow, sim.ai, Activepieces veya *Auto* seçeneğinde bırakın.
2. **Workflow'unuzu sağlayın** — mevcut aracınızdan dışa aktarılan JSON'u yapıştırın veya istediğiniz otomasyonun sade bir dille açıklamasını yazın.
3. **Oluşturun** — Heym sonucu bir canvas üzerine akış halinde çizer; node'lar ve bağlantılar üretildikçe çizilir.
4. Oluşturulan workflow'u JSON olarak **indirin veya kopyalayın**.
5. **Heym'e içe aktarın** — JSON'u canvas'ınıza yapıştırmak için [Download & Import](../reference/download-import.md) akışını kullanın, ardından çalıştırın.

Dönüştürme ayrıca canvas üzerine, workflow'un Heym tarafından oluşturulduğunu belirten küçük bir *Sticky Note* ekler — istediğiniz zaman silebilirsiniz.

## Elde edecekleriniz

Dönüştürücü, kaynak kavramları yerel Heym node'larına eşler — trigger'lar, [LLM](../nodes/llm-node.md) adımları, [HTTP](../nodes/http-node.md) çağrıları, [Slack](../nodes/slack-node.md)/[Telegram](../nodes/telegram-node.md) aksiyonları, [Loops](../nodes/loop-node.md), [Conditions](../nodes/condition-node.md) ve [Output](../nodes/output-node.md). Sonucu canvas üzerinde inceleyin, [Credentials](../reference/credentials.md) bağlantılarınızı yapın ve kaynak aracın farklı ifade ettiği her şeyi düzenleyin.

> AI Convert bir başlangıç noktasıdır, garantili bir 1:1 aktarım değildir. Oluşturulan workflow'u üretimde çalıştırmadan önce her zaman inceleyin.

## Bilmeniz iyi olur

- **AI destekli:** dönüştürmeler büyük bir dil modeli tarafından üretilir, bu nedenle sonuçlar çalıştırmalar arasında farklılık gösterebilir. İlk sonuç tam istediğiniz gibi değilse yeniden oluşturun.
- **Girdi boyutu:** yapıştırdığınız veya yazdığınız girdi yaklaşık **25.000 token** ile sınırlıdır. Çok büyük dışa aktarımları dönüştürmeden önce kısaltın.
- **Rate limit'ler:** aracı herkes için kullanılabilir tutmak amacıyla, istekler ziyaretçi başına **dakikada 1, saatte 5 ve günde 10** ile sınırlandırılmıştır.
- **Güvenlik:** istekler denetlenir ve yalnızca workflow oluşturma istekleri işlenir.

## Sonraki adımlar

- Canvas'ta yeni misiniz? [Quick Start](./quick-start.md) ile başlayın.
- İçe aktarmanın nasıl çalıştığını [Download & Import](../reference/download-import.md) bölümünde öğrenin.
- Heym'i self-host mu ediyorsunuz? Tam yapılandırma referansı için [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) sayfasına bakın.
- Uygulama içi [AI Assistant](../reference/ai-assistant.md) ile sıfırdan oluşturun.
