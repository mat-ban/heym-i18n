# Templates Sekmesi

Templates sekmesi, eksiksiz workflow'ları ve tek tek node'ları kaydetmenize, göz atmanıza ve yeniden kullanmanıza olanak tanır. Bir kez oluşturduğunuz bir şeyi paylaşın ve tek tıklamayla yeni projelere uygulayın.

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Templates demosunu izleyin</a></p>

## Genel Bakış

İki tür template vardır:

- **Workflow template'leri** — eksiksiz bir workflow'u (tüm node'lar ve bağlantılar) yeniden kullanılabilir bir başlangıç noktası olarak kaydedin.
- **Node template'leri** — yapılandırılmış tek bir node'u (örneğin ayarlanmış bir LLM node'u veya özel bir HTTP node'u) farklı workflow'lar arasında yeniden kullanmak için kaydedin.

Sekmenin üst kısmındaki **Workflows / Nodes** geçişini kullanarak ikisi arasında geçiş yapın.

Görünen template'leri ad, açıklama, etiket veya node türüne göre filtrelemek için arama çubuğunu kullanın.

---

## Template Oluşturma

### Workflow template'i

1. Paylaşmak istediğiniz workflow'u editörde açın.
2. Üst araç çubuğundaki **Share as Template** seçeneğine tıklayın.
3. Ad, açıklama ve isteğe bağlı etiketleri doldurun.
4. Görünürlüğü seçin: **Everyone** (tüm kullanıcılar) veya **Specific users** (kullanıcı adlarını girin ve/veya takımları seçin).
5. **Share** seçeneğine tıklayın. Yeşil bir bildirim başarıyı onaylar.

### Node template'i

1. Canvas üzerindeki herhangi bir node'a sağ tıklayın.
2. Bağlam menüsünden **Share as Template** seçeneğini seçin.
3. Formu doldurun ve **Share** seçeneğine tıklayın.

---

## Template Kullanma

### Workflow template'i

1. **Templates** sekmesini açın ve **Workflows** seçeneğinin seçili olduğundan emin olun.
2. Önizlemek için bir karta tıklayın veya doğrudan **Use** seçeneğine tıklayın.
3. Workflow, editörde açılan yeni bir workflow'a klonlanır.

### Node template'i

1. **Templates** sekmesini açın ve **Nodes** seçeneğini seçin.
2. Bir node template kartındaki **Use** seçeneğine tıklayın.
3. Bir iletişim kutusu görünür — node'u nereye ekleyeceğinizi seçin:
   - **New workflow** — yalnızca bu node'u içeren yeni bir workflow oluşturur.
   - **Existing workflow** — workflow listenizden seçin; editör açıldığında node otomatik olarak eklenir.

---

## Önizleme

Tam önizleme açmak için herhangi bir template kartına tıklayın:

- **Kart küçük resimleri** — template kartları, hem workflow'lar hem de tek node'lu template'ler için uyarlanmış salt okunur bir canvas anlık görüntüsü oluşturur.
- **Workflow template'leri** — kaydırma ve yakınlaştırma dahil olmak üzere düzenleme geçmişi önizleme stiliyle eşleşen salt okunur bir canvas.
- **Node template'leri** — kaydedilen node, tek node'lu önizleme olarak aynı salt okunur canvas üzerinde açılır.
- **Node ayrıntıları** — kaydedilmiş yapılandırmasını yan panelde incelemek için önizlemedeki herhangi bir node'a tıklayın.
- Etiketler, kullanım sayısı ve **owner** tüm template'ler için gösterilir.

Önizlemeyi kapatmak için **ESC** tuşuna basın veya dışarıya tıklayın.

---

## Template'leri Yönetme

- **Edit** – Template sahibiyseniz, kartın üzerine gelin ve adını, açıklamasını, etiketlerini veya görünürlüğünü güncellemek için kalem simgesine tıklayın
- **Delete** – Template sahibiyseniz, kartın üzerine gelin ve onay isteminden sonra template'i silin
- **Yalnızca sahibe özel işlemler** – Düzenleme ve silme kontrolleri yalnızca oluşturduğunuz template'ler için gösterilir

---

## Komut Paleti (CTRL+K)

Template'ler (hem workflow hem de node) **CTRL+K** komut paletinden aranabilir. Hemen kullanmak için bir template seçin — workflow template'leri editörde açılır, node template'leri bir hedef ister.

---

## Chat'te Template'ler

AI'ya template'leriniz hakkında sorular sorabilirsiniz — çalışma alanınızdaki tüm template'leri bilir.

---

## Görünürlük

| Ayar | Kimler görebilir |
|---|---|
| Everyone | Platformdaki tüm kullanıcılar |
| Specific users | Adlarına göre listelediğiniz kullanıcılar ve/veya seçtiğiniz takımlar — tüm takım üyeleri erişim kazanır |

**Specific users** ile paylaşırken hem tek tek kullanıcıları (adlarına göre) hem de takımları ekleyebilirsiniz. Takım üyeleri template'i Templates sekmesinde görür ve kullanabilir.

---

## İlgili

- [Teams](../reference/teams.md) – Template'leri takımlarla paylaşın
- [Canvas Features](../reference/canvas-features.md)
- [Workflow Structure](../reference/workflow-structure.md)
- [Node Types](../reference/node-types.md)
- [Chat Tab](./chat-tab.md)
- [Contextual Showcase](../reference/contextual-showcase.md) – Dashboard sekmeleri için kısa sayfa kılavuzu
