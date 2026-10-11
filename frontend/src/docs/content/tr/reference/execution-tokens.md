# Çalıştırma Tokenları

Execution token'ları, tek bir workflow'un execute ve stream endpoint'lerine erişim sağlayan kapsamlandırılmış JWT'lerdir. Uzun ömürlü kullanıcı oturum token'ınızı açığa çıkarmadan bir workflow'u harici sistemlerden çağırmanıza olanak tanır.

## Neden Execution Token Kullanmalısınız

Bir workflow'un kimlik doğrulaması **JWT** olarak ayarlandığında, endpoint normalde geçerli bir kullanıcı oturumu gerektirir. Execution token'ları şunları yapmanıza olanak tanır:

- Hesap kimlik bilgilerinizi paylaşmadan harici script'ler, CI pipeline'ları veya entegrasyonlarla çağrılabilir bir token paylaşın.
- Maruziyeti sınırlayın — bir token yalnızca belirli bir workflow için geçerlidir.
- Parolanızı değiştirmeden veya oturum token'larını yenilemeden erişimi anında iptal edin.
- Kısa ömürlü token'lar (dakikalar veya saatler) ile uzun ömürlü token'lar (10 yıla kadar) arasında seçim yapın.

## Token Oluşturma

Editörde **Run with cURL** iletişim kutusunu açın (sağ üst araç çubuğu). Workflow kimlik doğrulaması **JWT Token** olarak ayarlandığında, iletişim kutusu bir token yöneticisi gösterir:

1. **Short-lived** veya **Long-lived (10yr)** seçeneğini seçin.
2. Kısa ömürlü token'lar için süreyi saniye cinsinden girin (minimum 60).
3. **+ New Token** seçeneğine tıklayın.

Token hemen oluşturulur, listeye eklenir ve otomatik olarak seçilir; böylece cURL komutu onu içerecek şekilde güncellenir.

## Token Listesi

Her token satırı şunları gösterir:

| Sütun | Açıklama |
|--------|-------------|
| Created | Oluşturma zaman damgası |
| Status | **Expires:** tarih, **Expired** veya **Revoked** |
| Göz simgesi | Token değeri görünürlüğünü aç/kapat |
| Revoke düğmesi | Token'ı iptal edildi olarak işaretle (geri alınamaz) |

Etkin (süresi dolmamış, iptal edilmemiş) herhangi bir satıra tıklayarak seçin. Seçilen token, cURL komut önizlemesine gömülür.

Süresi dolmuş ve iptal edilmiş token'lar listede görünür kalır ancak seçilemez.

## Token Kullanma

Token değerini listeden kopyalayın (görüntülemek için göz simgesine tıklayın) ve bir `Bearer` token olarak ekleyin:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  -H "Authorization: Bearer <execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

İletişim kutusunda bir token seçiliyken **Copy cURL** kullandığınızda, token komuta zaten gömülüdür — manuel değiştirme gerekmez.

## Token Kapsamlandırma

Her token şu JWT claim'lerini taşır:

| Claim | Değer |
|-------|-------|
| `sub` | Token oluşturucunun kullanıcı ID'si |
| `wid` | Workflow UUID — token başka herhangi bir workflow için reddedilir |
| `scope` | `workflow:execute` — bunu bir kullanıcı oturum token'ından ayırt eder |
| `jti` | İptal sorgulamaları için kullanılan benzersiz token ID'si |
| `exp` | Bitiş zaman damgası |

Backend her istekte bunların tümünü kontrol eder: imza geçerliliği, bitiş süresi, eşleşen `wid` ve `jti`'nin iptal edilmemiş olması.

## İptal Etme

Bir token'ı iptal etmek için yanındaki iptal (daire-eğik çizgi) düğmesine tıklayın. İptal işlemi anında etkili olur — o token'ı kullanan sonraki istekler `401` döndürür. Token satırı listede **Revoked** etiketiyle görünür kalır.

İptali geri alma yoktur. Erişimi yeniden sağlamanız gerekirse yeni bir token oluşturun.

## API

Token yönetimi endpoint'leri normal oturumunuzla kimlik doğrulanır.

| Yöntem | Yol | Açıklama |
|--------|------|-------------|
| `POST` | `/api/workflows/{id}/execution-tokens` | Token oluştur |
| `GET` | `/api/workflows/{id}/execution-tokens` | Bu workflow için token'larınızı listele |
| `DELETE` | `/api/workflows/{id}/execution-tokens/{token_id}` | Token'ı iptal et |

**Oluşturma istek gövdesi:**

```json
{ "ttl_seconds": 900 }
```

**Oluşturma yanıtı:**

```json
{
  "id": "uuid",
  "token": "<full jwt>",
  "expires_at": "2026-04-30T15:22:00Z",
  "created_at": "2026-04-30T15:07:00Z",
  "revoked": false
}
```

`token` alanı yalnızca oluşturma sırasında bir kez döndürülür. Hemen saklayın; sonraki `GET` istekleri aynı satırı döndürür ancak ayrıca cURL iletişim kutusunda istediğiniz zaman görüntüleyebilirsiniz.

## Görünürlük Kapsamı

Her kullanıcı yalnızca kendi oluşturduğu token'ları görür. Paylaşılan bir workflow'a erişimi olan ekip üyeleri birbirlerinin token'larını göremez.

## İlgili

- [Webhooks](./webhooks.md) — HTTP trigger endpoint'leri ve cURL iletişim kutusu
- [Security](./security.md) — Oturum yönetimi ve kimlik doğrulama genel bakışı
- [SSE Streaming](./sse-streaming.md) — Execution token'larını streaming endpoint'i ile kullanma
