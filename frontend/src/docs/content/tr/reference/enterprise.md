# Enterprise

Heym platformu için ticari lisanslama, profesyonel destek ve dağıtım hizmetleri.

## Genel Bakış

Heym, kaynak kodu açık lisansı kapsamında ücretsiz olarak kullanılabilir ve kendi sunucunuzda barındırılabilir. Ticari lisanslama, üretim düzeyinde dağıtım desteği veya özel destek ihtiyacı olan kuruluşlar için Kurumsal plan, Heym ekibinden birebir hizmetler sunar.

| Hizmet | Açıklama |
|---------|-------------|
| **Üretim Agent Desteği** | Mimari incelemeleri, agent ve workflow tasarım rehberliği ve agent'ları üretime alma konusunda birebir yardım |
| **Araç Eğitimi** | Ekibiniz için workflow editörü, AI düğümleri, agent'lar ve entegrasyonları kapsayan oryantasyon oturumları ve eğitimler |
| **Heym Soru & Cevap** | Platform soruları, en iyi uygulamalar ve sorun giderme için Heym mühendislik ekibine doğrudan erişim |
| **Kubernetes Dağıtımı** | Çoklu worker-node kurulumları, sidecar container'lar, ölçeklendirme stratejileri ve cluster yapılandırması konusunda yardım |
| **Çözüm Danışmanlığı** | Entegrasyon planlaması ve mimari önerileri dahil olmak üzere özel kullanım durumunuz için özel çözüm tasarımı |
| **Öncelikli Destek & SLA** | Garantili yanıt süreleri ve öncelikli sorun çözümü |
| **Özel Geliştirme** | Kuruluşunuzun gereksinimlerine göre uyarlanmış özellik geliştirme ve değişiklikler |

## Heym Work

[Heym Work](./heym-work.md), Heym üzerinde çalışan iş ekipleri arayüzüdür. Kullanıcılar bir işi tanımlar, birkaç soruyu yanıtlar ve test edilmiş bir workflow elde eder; kendileri için oluşturulmuş sayfalardan çalışır ve tek oturum açma (SSO), Owner, Editor ve Viewer rolleri ve her çalıştırmada bir ad ile incelemeleri yanıtlar. Kendi lisansıyla Heym örneğinizin yanında çalışır; **Settings → Heym Work** içinden bağlayın. Daha fazla bilgi edinin ve [heym.run/enterprise](https://heym.run/enterprise) adresinden deneme talep edin.

## Üretim Agent Desteği

Heym ekibi, iş süreçleriniz için agent'ları ve workflow'ları tasarlamanıza, oluşturmanıza ve sağlamlaştırmanıza yardımcı olur. Bu, gereksinimlerinizin gözden geçirilmesini, düğüm yapılandırmalarının önerilmesini ve workflow'larınızın güvenilirlik, gözlemlenebilirlik ve yönetişim açısından en iyi uygulamaları izlemesini sağlamayı içerir.

Destek; [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) ve [Cron](../nodes/cron-node.md) trigger'ları dahil olmak üzere tüm düğüm türlerini kapsar — ayrıca [çoklu-agent orkestrasyonu](./agent-architecture.md), [Human-in-the-Loop](./human-in-the-loop.md) kontrol noktaları ve dallar arasında [paralel yürütme](./parallel-execution.md) gibi gelişmiş kalıpları da kapsar.

## Araç Eğitimi

Ekibinizin beceri düzeyine ve kullanım durumlarına göre uyarlanmış birebir eğitim oturumları:

- Workflow editörü ve [canvas özellikleri](./canvas-features.md)
- AI destekli düğümler: [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md)
- [Agent mimarisi](./agent-architecture.md) ve çoklu-agent orkestrasyonu
- [Credentials](./credentials.md) yönetimi ve [üçüncü taraf entegrasyonları](./integrations.md)
- [Trigger'lar](./triggers.md), [webhook'lar](./webhooks.md) ve [Cron](../nodes/cron-node.md) ile zamanlama
- [Expression DSL](./expression-dsl.md) ve [global değişkenler](./global-variables.md)
- [Teams](./teams.md) iş birliği ve [credentials paylaşımı](./credentials-sharing.md)
- Müşteriye yönelik sohbet arayüzleri için [Portal](./portal.md) dağıtımı
- AI workflow gözlemlenebilirliği için [Traces](../tabs/traces-tab.md) ve [Evals](../tabs/evals-tab.md)

## Kubernetes Dağıtımı

Standart [Çalıştırma & Dağıtım](../getting-started/running-and-deployment.md) kılavuzu, tek sunuculu üretim kurulumları için Docker Compose'u kapsar. Kurumsal müşteriler, yüksek kullanılabilirlik ve yatay ölçeklendirme için üretim Kubernetes dağıtımlarında yardım alır:

- **Çoklu worker node'ları** — Yedeklilik ve yük dengeleme için Heym backend worker'larını birden fazla Kubernetes node'una dağıtma
- **Sidecar container'lar** — Log toplama, izleme agent'ları, service mesh'ler (Istio, Linkerd) ve secret enjeksiyonu (Vault) için sidecar kalıplarını yapılandırma
- **Kaynak planlaması** — CPU ve bellek istekleri/limitleri, pod kesinti bütçeleri ve yatay pod otomatik ölçeklendirme politikaları
- **Ağ** — Ingress controller yapılandırması, TLS sonlandırma ve backend, frontend ile veritabanı pod'ları arasındaki dahili servis iletişimi
- **Kalıcı depolama** — Uygun StorageClass ve yedekleme stratejileriyle veritabanı ve vektör deposu birim sağlama
- **İzleme** — Container metrikleri, log'lar ve uyarılar için Prometheus, Grafana veya mevcut gözlemlenebilirlik yığınınızla entegrasyon

## Çözüm Danışmanlığı

Her kuruluş agent'ları farklı sistemler ve kısıtlamalar altında çalıştırır. Heym ekibi, size yardımcı olmak için danışmanlık sunar:

- Heym'in özel kullanım durumunuza uygun olup olmadığını değerlendirme
- Uçtan uca agent ve workflow mimarileri tasarlama
- Mevcut altyapınız ve üçüncü taraf hizmetlerinizle entegrasyonları planlama
- Karmaşık workflow'ları hata ayıklama ve üretim sorunlarını çözme
- n8n, Zapier veya Make.com gibi araçlardan mevcut workflow'ları taşıma

## İletişim

Lisanslama soruları, fiyatlandırma veya tanışma görüşmesi planlamak için kurumsal ekibe **enterprise@heym.run** adresinden ulaşabilirsiniz.

## İlgili

- [Çalıştırma & Dağıtım](../getting-started/running-and-deployment.md) — Docker Compose ile üretim dağıtımı
- [Güvenlik](./security.md) — Platform güvenlik uygulamaları ve yapılandırması
- [Paralel Yürütme](./parallel-execution.md) — Çoklu worker yürütme modeli
- [Teams](./teams.md) — Ekip iş birliği ve kaynak paylaşımı
- [Tam Özellik Seti](./features.md) — Heym yeteneklerine ilişkin kapsamlı genel bakış
- [Heym Work](./heym-work.md): iş ekipleri için arayüz ve nasıl bağlanacağı
