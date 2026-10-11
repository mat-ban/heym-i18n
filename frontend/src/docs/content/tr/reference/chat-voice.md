# Sohbet Sesi (TTS ve STT)

Sohbet sekmesi, [ElevenLabs](https://elevenlabs.io) tarafından desteklenen mesajları sesli olarak okuyabilir ve eller serbest etkileşimli ses modunu çalıştırabilir. Her iki yön de tek bir ElevenLabs kimlik bilgisi kullanır: oynatma için **metinden sese** ve mikrofon için **Scribe konuşmadan metne**.

## Kurulum

1. **Ayarlar**'ı açın (sağ üstteki avatarınız) → **Ses** sekmesi.
2. Bir **ElevenLabs kimlik bilgisi** seçin veya oluşturmak için **Kimlik bilgisi ekle**'ye tıklayın. API anahtarının ElevenLabs hesabınızda **Metinden Sese**, **Konuşmadan Metne** ve **Sesler** izinlerinin etkinleştirilmiş olması gerekir.
3. ElevenLabs hesabınızdan bir **Ses** seçin.
4. **Ses Ayarlarını Kaydet**'e tıklayın.

Bu kurulumu yapmadan önce bir ses düğmesine basarsanız, yapılandırmayı tamamlayabilmeniz için Ses sekmesi otomatik olarak açılır.

ElevenLabs API anahtarı şifrelenmiş olarak saklanır ve tarayıcıya asla ulaşmaz — tüm çağrılar Heym arka ucu üzerinden proxy'lenir. Bkz. [Kimlik Bilgileri](./credentials.md) ve [Ayarlar](./user-settings.md).

## Bir mesajı sesli okuyun

Her mesaj balonunda (sizin ve asistanın) **Kopyala**'nın yanında bir hoparlör düğmesi bulunur. Mesajı oynatmak için tıklayın; durdurmak için tekrar tıklayın — veya başka bir mesajı oynatın. Oynatma, ElevenLabs çok dilli modelini kullanır, böylece metnin dili otomatik olarak algılanır.

## Etkileşimli ses modu

Sohbet girişindeki dalga formu düğmesi, tam ekran, eller serbest bir ses modu açar (açık/koyu ve mobil uyumlu):

1. Mikrofonunuz aracılığıyla dinler ve konuşmayı bıraktığınızda algılar.
2. Konuşmanız **Scribe** ile yazıya dökülür (dil otomatik algılanır — manuel TR/EN geçişi yok).
3. Yazıya dökülen metin, **aynı konuşmada** normal bir sohbet mesajı olarak gönderilir.
4. Asistanın yanıtı sesli olarak okunur, ardından dinlemeye devam eder.

Dinlemeyi duraklatmak için **sessize al** düğmesini ve çıkmak için **✕** düğmesini kullanın (mikrofonu serbest bırakır). Kayıt, Firefox dahil tüm modern tarayıcılarda çalışır.

## Notlar

- Ses ve kimlik bilgisi seçimi kullanıcı başına tercihlerdir; LLM için etkin konuşma, model ve kimlik bilgisi değişmez.
- ElevenLabs kullanımı (hem TTS hem de STT) kendi ElevenLabs hesabınıza faturalandırılır.

## İlgili

- [Sohbet Sekmesi](../tabs/chat-tab.md) – Sesin bulunduğu Dashboard sohbeti
- [Kimlik Bilgileri](./credentials.md) – API anahtarlarının nasıl saklandığı ve referans verildiği
- [Ayarlar](./user-settings.md) – Ses sekmesinin bulunduğu yer
