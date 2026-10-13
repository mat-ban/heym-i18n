# Vectorstores Sekmesi

**Vectorstores** sekmesi, [RAG](../nodes/rag-node.md) düğümleri tarafından kullanılan vector store'ları yönetir. Store oluşturun, doküman yükleyin ve bunları ekibinizle paylaşın.

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Vectorstores demosunu izleyin</a></p>

## Vector Store Oluşturma

1. **New Vector Store** seçeneğine tıklayın
2. Bir ad ve isteğe bağlı açıklama girin
3. Bir vector store **credential**'ı seçin – *RAG: Qdrant + OpenAI* (harici Qdrant sunucusu), *RAG: Psql + OpenAI* (pgvector aracılığıyla Heym'in kendi Postgres veritabanı) veya *RAG: Custom Embeddings* (her iki backend'i de hedefleyebilen, OpenAI uyumlu herhangi bir embedding endpoint'i). Credential, store'un backend'ini belirler.
4. İsteğe bağlı olarak özel bir collection adı belirleyin (varsayılan olarak otomatik oluşturulur)
5. Kaydedin

> Bir store'un backend'i, oluşturulma anında credential'ı tarafından sabitlenir. Bir RAG düğümünde, **Database** açılır menüsü store'ları eşleşen backend'e göre filtreler.

## Doküman Yükleme

- **Dosya yükleme** – Dosyaları sürükleyip bırakın veya seçin (PDF, TXT vb.)
- **Yinelenen dosya işleme** – Yinelenen dosya adlarını geçersiz kılmayı veya atlamayı seçin
- **İlerleme** – Yükleme ilerlemesi, ingestion sırasında gösterilir

## İçeriği Yönetme

- **Öğeleri görüntüleme** – Store başına kaynak gruplarını ve doküman sayılarını görün. Yüklenen dosyalar
  dosya adları altında gruplanır; bir [RAG düğümünün](../nodes/rag-node.md) kendi `source`'u olmadan
  kaydettiği dokümanlar **Added workflow: _name_** altında gruplanır ve bunları yazan workflow'un
  adını taşır
- **Kaynakları silme** – Belirli dosyaları veya kaynak gruplarını bir store'dan kaldırın; bir workflow'un
  eklediği her şey dahil
- **Store'u düzenleme** – Adı, açıklamayı veya credential'ı değiştirin
- **Arama** – Bir `query` (ve 1 ile 20 arasında bir `limit`, varsayılan 5) ile `POST /api/vector-stores/{id}/search`,
  bir RAG düğümünün aramasının döndüreceği parçaları (chunk) en iyi eşleşme ilk sırada olacak şekilde, her birinin
  puanı ve kaynağıyla birlikte döndürür. Heym Work'ün RAG ekranı, geri getirmeyi test etmek için bunu kullanır

## Paylaşım

- Vector store'ları diğer kullanıcılarla e-posta yoluyla paylaşın
- Paylaşılan store'lar bir gösterge ile görünür
- Store kartı menüsünden paylaşımı iptal edin

## Workflow'larda Kullanma

Bir [RAG düğümünde](../nodes/rag-node.md), vector store'u adına göre seçin. Düğüm, ilgili chunk'ları alır ve LLM context'ini bunlarla zenginleştirir.

## İlgili

- [Credentials Sekmesi](./credentials-tab.md) – Vector store credential kurulumu (Qdrant, Postgres veya özel embeddings)
- [RAG Düğümü](../nodes/rag-node.md) – Düğüm referansı
- [Workflows Sekmesi](./workflows-tab.md) – RAG kullanan workflow'lar oluşturun
- [Contextual Showcase](../reference/contextual-showcase.md) – Dashboard yüzeyleri için kompakt sayfa kılavuzu
