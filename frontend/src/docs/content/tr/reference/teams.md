# Ekipler

Teams, iş akışlarını, kimlik bilgilerini, global değişkenleri, vektör depolarını ve Drive dosyalarını tek seferde bir kullanıcı grubuyla paylaşmanıza olanak tanır.

## Genel Bakış

- **Team** – Bir oluşturucuya ve üyelere sahip adlandırılmış grup
- **Creator** – Her zaman bir üyedir; team'i düzenleyebilir, team'i silebilir, üye ekleyebilir
- **Member** – Diğer üyeleri ekleyebilir ve kaldırabilir (oluşturucu hariç); team ile paylaşılan kaynaklara erişimi vardır

## Team Oluşturma ve Yönetme

Team'leri [Teams sekmesinden](../tabs/teams-tab.md) oluşturun. Üyeleri e-posta ile ekleyin; bir hesapları olmalıdır. Oluşturucu kaldırılamaz. Bir team'in silinmesi tüm team paylaşımlarını kaldırır.

## Paylaşım Modeli

Kaynaklar şunlarla paylaşılabilir:

1. **Bireysel kullanıcılar** – E-posta ile (kullanıcıdan kullanıcıya paylaşım)
2. **Teams** – Bir team seçerek (team paylaşımı)

Her iki model de eklenerek çalışır. Bir kullanıcı aşağıdaki durumlardan birinde erişim kazanır:

- Doğrudan paylaşılmışsa (kullanıcı paylaşımı), veya
- Team paylaşımına sahip bir team'in üyesiyse

## Teams ile Neler Paylaşılabilir

| Kaynak | Paylaşım Konumu |
|----------|----------------|
| Workflows | Workflow düzenleyicisindeki paylaşım iletişim kutusu |
| Workflow Templates | Bir workflow template oluştururken/düzenlerken paylaşım iletişim kutusu |
| Node Templates | Bir node template oluştururken/düzenlerken paylaşım iletişim kutusu |
| Credentials | Credentials sekmesindeki paylaşım iletişim kutusu |
| Global Variables | Variables sekmesindeki paylaşım iletişim kutusu |
| Vector Stores | Vectors sekmesindeki paylaşım iletişim kutusu |
| Drive Files | Drive sekmesindeki paylaşım iletişim kutusu veya Drive düğümünün `shareWithMyTeams` / `unshareWithMyTeams` işlemleri |

Template'ler için görünürlük **Specific users** olduğunda team'leri de seçebilirsiniz. Seçilen team'lerin tüm üyeleri template'e erişim kazanır.
Drive dosyası team paylaşımları team üyeleri için salt okunurdur; dosya sahibi yönetim izinlerini korur.

## API Endpoints

- `GET /api/teams` – Kullanıcının ait olduğu team'leri listeler
- `GET /api/teams/{id}` – Üyelerle birlikte team ayrıntılarını getirir
- `GET /api/teams/{id}/shared-entities` – Team ile paylaşılan varlıkları döndürür (workflows, credentials, global variables, vector stores, files, workflow templates, node templates)
- `POST /api/teams` – Team oluşturur
- `PATCH /api/teams/{id}` – Team'i günceller
- `DELETE /api/teams/{id}` – Team'i siler (yalnızca oluşturucu)
- `POST /api/teams/{id}/members` – Üye ekler (body: `{ "email": "..." }`)
- `DELETE /api/teams/{id}/members/{user_id}` – Üyeyi kaldırır

Kaynak başına team paylaşımları:

- `GET/POST/DELETE /api/workflows/{id}/team-shares` – POST body'si `permission` (`read` veya `write`, varsayılan `write`) kabul eder; mevcut bir team'i tekrar göndermek iznini günceller
- `GET/POST/DELETE /api/credentials/{id}/team-shares`
- `GET/POST/DELETE /api/global-variables/{id}/team-shares`
- `GET/POST/DELETE /api/vector-stores/{id}/team-shares`
- `PATCH /api/files/{id}/team-sharing`

## İlgili

- [Teams Sekmesi](../tabs/teams-tab.md) – Team'leri oluşturun ve yönetin
- [Templates Sekmesi](../tabs/templates-tab.md) – Workflow ve node template'lerini team'lerle paylaşın
- [Credentials Sharing](./credentials-sharing.md) – Credentials'ları kullanıcılar ve team'lerle paylaşın
- [Workflow Organization](./workflow-organization.md) – Klasörler ve workflow paylaşımı
