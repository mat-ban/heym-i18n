# Teams Sekmesi

**Teams** sekmesi, workflow'ları, credentials'ları, variables'ları, vector store'ları ve Drive dosyalarını kullanıcı gruplarıyla paylaşmak için ekipler oluşturmanıza ve yönetmenize olanak tanır.

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Teams demosunu izleyin</a></p>

## Ekip Oluşturma

1. **New Team** seçeneğine tıklayın
2. Bir ad ve isteğe bağlı açıklama girin
3. **Create** seçeneğine tıklayın

Otomatik olarak ekip oluşturucusu ve ilk üyesi olursunuz.

## Üyeleri Yönetme

- **Üye ekle** – Ekip detay penceresine bir kullanıcı e-postası girin ve **Add** seçeneğine tıklayın
- **Üye kaldır** – Bir üyenin yanındaki X'e tıklayın (oluşturucu kaldırılamaz)
- **Ekibi düzenle** – Oluşturucular adı ve açıklamayı düzenleyebilir
- **Ekibi sil** – Oluşturucular ekibi silebilir; tüm ekip paylaşımları kaldırılır
- **Paylaşılan kaynaklar** – Ekip detay penceresi, ekiple paylaşılan workflow'ları, credentials'ları, variables'ları, vector store'ları, Drive dosyalarını, workflow template'lerini ve node template'lerini gösterir. Düzenleyicide açmak için bir workflow'a tıklayın; diğer kaynaklar için ilgili sekmeye geçin.

## Teams ile Paylaşım

Kaynakları ekiplerle şuradan paylaşın:

- **Workflows** – Workflow düzenleyicisindeki paylaşım penceresi
- **Workflow Templates** – Bir workflow template'i oluştururken/düzenlerken paylaşım penceresi (görünürlük: Belirli kullanıcılar)
- **Node Templates** – Bir node template'i oluştururken/düzenlerken paylaşım penceresi (görünürlük: Belirli kullanıcılar)
- **Credentials** – Credentials sekmesindeki paylaşım penceresi
- **Variables** – Variables sekmesindeki paylaşım penceresi
- **Vector Stores** – Vectors sekmesindeki paylaşım penceresi
- **Dashboards** – Dashboard sekmesindeki Dashboard ayarları (okuma veya yazma)
- **Drive Files** – Drive sekmesindeki paylaşım penceresi veya Drive node'undaki `shareWithMyTeams` / `unshareWithMyTeams` işlemleri

Bir ekiple paylaştığınızda, tüm ekip üyeleri erişim kazanır. Ayrıntılar için [Teams](../reference/teams.md) bölümüne bakın.

Bir workflow'u bir ekiple paylaştığınızda, o workflow'un bağlı olduğu credentials'ları ve alt workflow'ları da aynı ekiple paylaşın. Yalnızca workflow erişimi, credential veya alt workflow erişimi sağlamaz.

## Chat Entegrasyonu

[Chat sekmesi](./chat-tab.md) AI asistanı ekiplerinizi listeleyebilir. Hangi ekiplere ait olduğunuzu görmek için "my teams" yazın.

## İlgili

- [Teams](../reference/teams.md) – Teams referansı ve paylaşım modeli
- [Credentials Sharing](../reference/credentials-sharing.md) – Credentials'ları kullanıcılarla ve ekiplerle paylaşın
- [Workflow Organization](../reference/workflow-organization.md) – Klasörler ve paylaşım
- [Contextual Showcase](../reference/contextual-showcase.md) – Dashboard yüzeyleri için kompakt sayfa kılavuzu
