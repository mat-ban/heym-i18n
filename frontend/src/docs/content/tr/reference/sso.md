# Single Sign-On

Heym, kullanıcıların kimliğini herhangi bir harici **OpenID Connect** sağlayıcısına karşı doğrulayabilir. Bir yönetici **Settings → SSO** altında bir issuer URL'si girer ve Heym diğer tüm endpoint'leri o sağlayıcının discovery dokümanından okur.

Hiçbir sağlayıcı sabit kodlanmamıştır. Keycloak, Okta, Entra ID, Auth0, Google ve diğer tüm OIDC sağlayıcıları aynı alanlar üzerinden bağlanır, çünkü Heym'e söylenen tek şey issuer'dır.

Parola ile oturum açma ve SSO yan yana çalışır. SSO doğrulandıktan sonra parola ile oturum açma kapatılabilir.

## Başlamadan Önce

SSO ayarları instance genelindedir, bu nedenle yalnızca instance yöneticileri bunları değiştirebilir. Yöneticiler bir ortam değişkeniyle belirtilir, veritabanında saklanmaz:

```
HEYM_ADMIN_EMAILS=admin@example.com,ops@example.com
```

Boş bir değer kimseye yetki vermez. Değiştirdikten sonra backend'i yeniden başlatın. Bu listedeki hesaplar ayrıca Settings içindeki **SSO** sekmesini görür ve parola ile oturum açma devre dışı bırakıldığında bile parola erişimini korur — bkz. [Parola ile Oturum Açmayı Devre Dışı Bırakma](#disabling-password-sign-in).

## Heym'i Sağlayıcınıza Kaydetme

Kimlik sağlayıcınızda, aşağıdaki özelliklere sahip bir **confidential client** (uygulama kaydı olarak da adlandırılır) oluşturun:

| Ayar | Değer |
|---------|-------|
| Protokol | OpenID Connect |
| Grant type | Authorization Code with PKCE |
| Client authentication | Açık — Heym bir client secret kullanır |
| Redirect URI | Heym'in SSO sekmesinde gösterilen tam değer |
| Scope'lar | `openid email profile` |

Heym, redirect URI'yi `FRONTEND_URL` üzerinden hesaplar ve ayarlar formunda kopyalama düğmesiyle salt okunur olarak gösterir. Her zaman `/api/auth/sso/callback` ile biter. Yazmak yerine kopyalayın — uyuşmayan bir redirect URI en yaygın kurulum hatasıdır ve sağlayıcılar bunu açıklama yapmadan reddeder.

Sağlayıcınız doğrulanmış bir e-posta adresi döndürmelidir. Bkz. [Hesap Eşleme](#account-mapping).

## Heym'i Yapılandırma

**Settings → SSO**'yu açın. Sekme yalnızca `HEYM_ADMIN_EMAILS` içindeki hesaplar için görünür.

| Alan | Ne yapar |
|-------|--------------|
| **Enable single sign-on** | Oturum açma ekranında oturum açma düğmesini gösterir. |
| **Issuer URL** | Sağlayıcının temel URL'si, örneğin `https://idp.example.com/realms/your-realm`. Heym `/.well-known/openid-configuration` ekler ve geri kalanını oradan okur. |
| **Client ID** | Sağlayıcınızdan alınan client tanımlayıcısı. |
| **Client secret** | Şifrelenmiş olarak saklanır. Saklanan değeri korumak için alanı boş bırakın — Heym elinde tuttuğu bir secret'ı asla döndürmez. |
| **Redirect URI** | Salt okunur. Bunu sağlayıcınızın izin listesine kopyalayın. |
| **Scope'lar** | Varsayılan olarak `openid email profile`. |
| **Sign-in button label** | Oturum açma ekranındaki düğmenin metni, örneğin "Sign in with Okta". |
| **Create an account on first sign-in** | Bilinmeyen kişilerin otomatik olarak bir Heym hesabı alıp almayacağı. |
| **Allowed email domains** | Virgülle ayrılmış. Boş bırakıldığında sağlayıcının kimliğini doğruladığı her alan adına izin verilir. |
| **Disable password sign-in** | Instance genelinde parola kimlik doğrulamasını kapatır. |

### Önce bağlantıyı test edin

**Test connection**, discovery dokümanını ve sağlayıcının imzalama anahtarlarını getirir, ardından bulduğu token endpoint'ini bildirir. Henüz kaydetmediğiniz bir issuer üzerinde çalıştırabilirsiniz, böylece yanlış bir URL kaydetmek yerine bir tıklamaya mal olur.

Bir test, yalnızca test edilen issuer zaten saklı olanla aynı olduğunda geçen bir sonucu *kaydeder*. Bir taslak testi, URL'nin çözümlenip çözümlenmediğini söyler; kaydedilmemiş bir yapılandırmaya izin vermez. Issuer, client ID, scope'lar veya secret değiştirildiğinde kaydedilen sonuç aynı nedenle temizlenir.

## Oturum Açma Nasıl Çalışır

1. Bir kişi oturum açma ekranındaki oturum açma düğmesine tıklar.
2. Heym, onları bir `state`, bir `nonce` ve bir PKCE challenge ile sağlayıcıya yönlendirir.
3. Sağlayıcı ile kimliklerini doğrularlar.
4. Sağlayıcı, bir authorization code ile Heym'in callback'ine geri yönlendirir.
5. Heym, kodu token'lar karşılığında değiştirir ve ID token'ı sağlayıcının yayımladığı anahtarlara karşı doğrular; imzayı, audience'ı, issuer'ı, son kullanma süresini ve nonce'u kontrol eder.
6. Heym hesabı çözümler ve tıpkı bir parola ile oturum açmada olduğu gibi kendi oturumunu başlatır.

6. adımdan sonraki her şey değişmez: aynı session cookie'leri, aynı token ömürleri, aynı izinler.

## Hesap Eşleme

Heym bir hesabı şu sırayla çözümler:

1. **`(issuer, subject)`** — sağlayıcının önceki bir oturum açmada bildirdiği kimlik. Bu yetkilidir ve sağlayıcıdaki bir e-posta değişikliğinden sonra da geçerliliğini korur.
2. **Doğrulanmış e-posta** — o adrese sahip mevcut bir Heym hesabı sahiplenilir ve sağlayıcının subject'i o andan itibaren bu hesaba kaydedilir.
3. **Yeni bir hesap** — **Create an account on first sign-in** açıksa ve alan adına izin veriliyorsa oluşturulur.

Bir e-posta, yalnızca ID token `email_verified: true` taşıdığında doğrulanmış sayılır. Bu claim `false` ise veya yoksa, oturum açma reddedilir. Sağlayıcının kefil olmayacağı bir adrese dayanarak mevcut bir hesabı sahiplenmek — veya yeni bir hesap oluşturmak — bir hesap ele geçirme yoludur, bu nedenle Heym bunu yapmaz. Hiç `email_verified` üretmeyen bir sağlayıcının bunu üretecek şekilde yapılandırılması gerekir.

Bu şekilde oluşturulan hesapların parolası yoktur. Yalnızca sağlayıcı üzerinden oturum açarlar.

## Parola ile Oturum Açmayı Devre Dışı Bırakma

**Parola ile oturum açmayı devre dışı bırak** anahtarı, üç koşul sağlanana kadar kullanılamaz durumda kalır:

1. SSO etkinleştirilmiştir.
2. Bir bağlantı testi geçmiştir; böylece yanlış bir issuer arkasındaki kapıyı kilitleyemez.
3. `HEYM_ADMIN_EMAILS` içindeki en az bir hesabın gerçekten bir parolası vardır.

Bu anahtar açıkken, parola kimlik doğrulaması parola üreten veya kabul eden üç yüzeyin tümünde reddedilir: oturum açma formu, **kayıt** ve MCP OAuth onay sayfası. Kayıt da bu kapsama girer çünkü bir parola üretir; açık bırakılması, `/register` adresine erişebilen herkesin bu ayarı atlamasına olanak tanır.

`HEYM_ADMIN_EMAILS` içinde listelenen hesaplar bu üç yüzeyin tümünden muaftır. Ortam dosyasını düzenleyebilen kişi zaten örneği kurtarabilir; bu nedenle bu garanti bir operatörün belleğinde değil, kodda yaşar.

### Üçüncü koşul neden var

Heym hesabı *SSO üzerinden* oluşturulmuş bir yöneticinin hiç parolası yoktur. Muafiyet bu kişinin kapıdan geçmesini sağlar, ancak oturum açabileceği bir şey yoktur — dolayısıyla sağlayıcı çökerse örneğe geri dönüş yolu kalmaz. Heym bu duruma girmeyi reddeder ve bunu bildirir.

Bu mesajla karşılaşırsanız, SSO üzerinden oturum açın ve yönetici adreslerinizden birinde bir parola hesabı kaydedin (kayıt tam da bu nedenle yönetici adreslerine açıktır) veya zaten parolası olan bir adresi `HEYM_ADMIN_EMAILS` içine ekleyin.

### Sağlayıcı çöktüğünde kurtarma

Tercih sırasına göre:

1. **Acil durum yönetici parolasıyla oturum açın.** Parola ile oturum açma kapalıyken oturum açma ekranı parola formunu gizler; bu nedenle formu göstermek için SSO düğmesinin altındaki **Bunun yerine parola ile oturum açın** seçeneğine tıklayın. Form bir atlatma yolu değildir: `HEYM_ADMIN_EMAILS` dışındaki her adres yine reddedilir ve nedeni bildirilir.
2. **Ortam dosyasında kendinizi `HEYM_ADMIN_EMAILS` içine ekleyin** ve backend'i yeniden başlatın. Zaten parolası olan bir hesap ardından oturum açabilir.
3. **Hiçbir yöneticinin parolası yoksa, parola ile oturum açmayı doğrudan veritabanında yeniden açın:**

   ```sql
   UPDATE sso_settings SET password_login_disabled = false;
   ```

   Yeniden başlatma gerekmez; ayar her istekte okunur.

Portal son kullanıcıları etkilenmez. Onlar ayrı bir dizine karşı kimlik doğrular — bkz. [Portal](./portal.md).

## Oturum Açma Hataları

Başarısız bir oturum açma, okunabilir bir mesajla oturum açma ekranına döner. Heym sağlayıcının ham hata metnini asla göstermez.

| Mesaj | Neden |
|---------|-------|
| Bu oturum açma denemesi zaman aşımına uğradı | Deneme on dakikadan uzun sürdü veya tarayıcı işlem çerezini düşürdü. Yeniden deneyin. |
| Kimlik sağlayıcısına ulaşılamadı | Discovery veya token değişimi başarısız oldu. Issuer URL'sini ve sağlayıcının backend'den erişilebilir olduğunu kontrol edin. |
| Sağlayıcının yanıtı doğrulanamadı | ID token imza, audience, issuer, son kullanma veya nonce doğrulamasından geçemedi. Genellikle bir client ID uyuşmazlığıdır. |
| Sağlayıcı bir e-posta adresi döndürmedi | `email` scope'u eksik veya sağlayıcı claim'i yayınlamıyor. |
| E-posta adresiniz doğrulanmadı | Sağlayıcı `email_verified: false` gönderdi veya claim'i atladı. |
| E-posta alan adınıza izin verilmiyor | Adres **İzin verilen e-posta alan adları** dışında. |
| Sizin için bir Heym hesabı yok | **İlk oturum açmada bir hesap oluştur** kapalı ve eşleşen bir hesap yok. Bir yöneticinin hesap oluşturması gerekir. |
| Tek oturum açma yapılandırılmamış | SSO devre dışı veya issuer, client ID ya da secret eksik. |

## Güvenlik Notları

- **Client secret, durağan haldeyken şifrelenir** ve hiçbir endpoint tarafından döndürülmez. Ayarlar formu yalnızca bir tanesinin saklanıp saklanmadığını bildirir.
- **PKCE verifier, Heym'den asla ayrılmaz.** Sağlayıcı üzerinden açıkça gidip gelen `state` parametresinde değil, kısa ömürlü bir `HttpOnly` çerezinde tutulur.
- **Yalnızca asimetrik imzalar kabul edilir.** Sağlayıcının ne duyurduğundan bağımsız olarak `none` ve simetrik algoritmalar reddedilir.
- **Oturum açma sonrası hedef, aynı kaynaklı bir yol olarak doğrulanır**; böylece callback açık yönlendirme olarak kullanılamaz.
- **Her oturum açma denetlenir.** Başarılar, başarısızlıklar ve reddetmeler `auth.sso_login` satırları olarak, yapılandırma değişiklikleri ise `sso_settings.update` olarak görünür — bkz. [Denetim Günlüğü](./audit.md).

## Desteklenmeyenler

- **SAML.** Tek protokol OIDC'dir.
- **Aynı anda birden fazla sağlayıcı.** Bir örnek tek bir sağlayıcıya bağlanır.
- Sağlayıcı claim'lerinden **grup veya rol eşleme**.
- **Tek çıkış.** Heym'den çıkış yapmak sizi sağlayıcıdan çıkış yapmaz.
