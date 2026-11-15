# Google Meet

Google Calendar'da uygun zaman aralıklarını bulun ve Google Meet bağlantıları, katılımcı e-postaları ve seçilen saatlerle toplantı davetleri oluşturun, güncelleyin veya silin. Bağlı Google hesabı etkinliğin sahibidir; katılımcılar davetleri e-posta ile alır.

## Hesabınızı bağlama

1. [Google Cloud Console](https://console.cloud.google.com) üzerinden **Google Calendar API**'yi etkinleştirin.
2. OAuth izin ekranını yapılandırın ve **Web uygulaması** türünde bir OAuth istemcisi oluşturun. Uygulama test modundaysa Google hesabınızı test kullanıcısı olarak ekleyin.
3. `https://your-heym-domain/api/credentials/google-meet/oauth/callback` adresini yetkili yönlendirme URI'si olarak kaydedin. Yerel geliştirme için tarayıcınızın Heym kökenini aynı yolla kullanın.
4. **Dashboard → Credentials → Yeni → Google Meet (OAuth2)** menüsünü açın, bir ad, Client ID ve Client Secret girin, ardından **Bağlan**'a tıklayıp Google ile oturum açın.
5. Her iki izni de verin: Takvim etkinlikleri (`calendar.events`) ve takvim müsaitliği (`calendar.events.freebusy`). Düğüm üzerinde bu credential'ı seçin.

Token'lar depolama alanında şifrelenir ve otomatik olarak yenilenir. Bu, Google AI, Sheets veya Drive'dan ayrı bir credential'dır. Oluşturmanın başarılı olması için bir takvimin Google Meet konferanslarını desteklemesi gerekir.

## İşlemler

| İşlem | Davranış | Gerekli alanlar |
| --- | --- | --- |
| `read` | Bir takvim için uygun ve meşgul aralıkları döndürür | Kimlik Bilgisi |
| `create` | Yeni bir Meet konferansı ve e-posta davetleriyle zamanlanmış bir etkinlik oluşturur | Başlık, başlangıç zamanı, bitiş zamanı |
| `update` | Belirtilen etkinlik alanlarını günceller ve konukları bilgilendirir | Etkinlik ID ve en az bir değiştirilmiş alan |
| `delete` | Etkinliği siler ve konukları iptal hakkında bilgilendirir | Etkinlik ID |

## Yapılandırma

Aşağıdaki metin alanları ifadeleri kabul eder. Boolean ayrıntı seçeneği de dahil olmak üzere tüm alanlar, bu düğüm bir araç olarak eklendiğinde bir Agent tarafından sağlanabilir.

| Alan | Varsayılan | Amaç |
| --- | --- | --- |
| `gmCalendarId` | `primary` | Bağlı hesabın birincil takvimi veya erişilebilir bir takvim ID/e-postası |
| `gmTimeZone` | `UTC` | Yerel tarihler ve yanıt süreleri için kullanılan IANA bölgesi (örn. `Europe/Istanbul`) |
| `gmStartDate` | Geçerli saat | ISO tarihi veya datetime olarak okuma aralığı başlangıcı |
| `gmEndDate` | Gece yarısı bir sonraki ayın ilk günü | Okuma aralığı bitişi; maksimum aralık 60 takvim günüdür |
| `gmIncludeBusyDetails` | `false` | Yalnızca okuma: `busy_slots` alanına etkinlik başlıklarını ve katılımcıları dahil et; boolean |
| `gmEventId` | Boş | Update/delete için takvim etkinliği ID'si; Meet URL'si değil, döndürülen `event_id`'yi kullanın |
| `gmTitle` | Boş | Davet başlığı; `create` işleminde zorunludur |
| `gmDescription` | Boş | Davet açıklaması |
| `gmStartTime` | Boş | Toplantı başlangıcı, örneğin `2026-11-10T14:00:00+03:00` |
| `gmEndTime` | Boş | Toplantı bitişi; başlangıçtan sonra olmalıdır |
| `gmAttendees` | Boş | Virgül/noktalı virgül/satır sonu ile ayrılmış e-postalar veya e-posta dizeleri JSON dizisi |
| `gmLocation` | Boş | Meet konferansının yanında isteğe bağlı toplantı konumu |

### Uygun zaman aralıkları

Varsayılan okuma, seçilen saat diliminde geçerli saatten **bir sonraki ayın 1'i saat 00:00'a kadar** olan dönemi kapsar. Farklı bir pencere belirlemek için `gmEndDate` parametresini iletin. 60 günden uzun bir aralık veya geçersiz bir tarih Google çağrılmadan önce reddedilir.

Sonuç, Google'ın **free/busy** API'sine dayanır. Meşgul aralıklar birleştirilir ve istenen pencereden çıkarılır. `available_slots`, `start` ve `end` zaman damgalarına sahip sürekli boşluklar içerir.

```json
{
  "type": "googleMeet",
  "data": {
    "label": "Availability",
    "credentialId": "YOUR_GOOGLE_MEET_CREDENTIAL_ID",
    "gmOperation": "read",
    "gmCalendarId": "primary",
    "gmTimeZone": "Europe/Berlin",
    "gmStartDate": "2026-11-06",
    "gmEndDate": "2026-11-13"
  }
}
```

### Meşgul etkinlik ayrıntılarını dahil etme

**Uygun Zaman Aralıklarını Oku** altında, her meşgul slota başlığı ve katılımcıları eklemek için **Meşgul Etkinlik Ayrıntılarını Dahil Et** (`gmIncludeBusyDetails: true`) seçeneğini etkinleştirin. Bu seçenek varsayılan olarak devre dışıdır.

```json
{
  "start": "2026-11-06T21:15:00+01:00",
  "end": "2026-11-06T21:30:00+01:00",
  "title": "Daily check-in",
  "attendees": [
    "colleague@example.com"
  ]
}
```

### Randevu alma

1. Workflow sahibinin kimlik bilgileriyle bir `read` düğümü çalıştırın.
2. Rezervasyon arayüzünüzde `available_slots` alanını görüntüleyin.
3. `email`, `startTime` ve `endTime` değerlerini workflow girdileri olarak iletin.
4. Aynı kimlik bilgileriyle `create` işlemini çalıştırın. Ziyaretçinin Google hesabına ihtiyacı yoktur; e-postası katılımcı olarak kaydedilir.

```json
{
  "type": "googleMeet",
  "data": {
    "label": "Booking",
    "credentialId": "YOUR_GOOGLE_MEET_CREDENTIAL_ID",
    "gmOperation": "create",
    "gmCalendarId": "primary",
    "gmTimeZone": "Europe/Berlin",
    "gmTitle": "Meet with me",
    "gmDescription": "A meeting booked through Heym",
    "gmAttendees": "$input.email",
    "gmStartTime": "$input.startTime",
    "gmEndTime": "$input.endTime"
  }
}
```

## Çıktı

| İşlem | Çıktı alanları |
| --- | --- |
| `read` | `available_slots`, `busy_slots`, `count`, `calendar_id`, `time_zone`, `start`, `end` |
| `create`, `update` | `event_id`, `meet_url`, `conference_status`, `event`, `calendar_id` |
| `delete` | `event_id`, `calendar_id`, `deleted: true` |

Sonraki düğümlerde `$Availability.available_slots` veya `$Booking.meet_url` değişkenlerini kullanın. Her işlem ayrıca `status: "success"` ve ilgili `operation` bilgisini döndürür.

## İlgili

- [Credentials](../reference/credentials.md)
- [Üçüncü Taraf Entegrasyonları](../reference/integrations.md)
- [Kimlik Bilgisi Paylaşımı](../reference/credentials-sharing.md)
- [Giriş](input-node.md)
- [Çıkış](output-node.md)
