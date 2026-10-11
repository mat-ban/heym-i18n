# Linear

**Linear** düğümü, iş akışlarını issue ve workspace otomasyonu için Linear GraphQL API'sine bağlar.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Credential | Linear kişisel API anahtarı veya OAuth2 |
| Çıkış | `$nodeLabel.*` |

## Credential

[Credentials Sekmesi](../tabs/credentials-tab.md) içinde bir **Linear** credential oluşturun. Bir
kimlik doğrulama modu seçin:

**Kişisel API anahtarı**

1. Linear'da **Settings → Security & Access → Personal API keys** bölümünü açın.
2. Otomatikleştirmek istediğiniz workspace'e erişimi olan bir anahtar oluşturun.
3. Anahtarı Heym'de yeni bir Linear credential içine yapıştırın ve doğrulamak için **Test Connection** kullanın.

**OAuth2**

1. Bir Linear OAuth uygulaması oluşturun.
2. `{FRONTEND_URL}/api/credentials/linear/oauth/callback` adresini redirect URI olarak kaydedin.
3. Heym'de **OAuth2** seçeneğini seçin, Client ID ve Client Secret değerlerini girin, ardından **Connect** düğmesine tıklayın.

Kişisel API anahtarları ve OAuth token'ları, bunları oluşturan veya yetkilendiren kullanıcı olarak hareket eder.

## İşlemler

| İşlem | Gerekli alanlar | Çıkış |
|-----------|-----------------|--------|
| Get Viewer | — | `viewer` |
| List Teams | Limit; isteğe bağlı After Cursor | `teams`, `count`, `pageInfo` |
| List Projects | Limit; isteğe bağlı After Cursor | `projects`, `count`, `pageInfo` |
| List Issues | Limit; isteğe bağlı Team ID, Project ID, After Cursor | `issues`, `count`, `pageInfo` |
| List Workflow States | Team ID | `states`, `count` |
| List Team Members | Team ID, Limit; isteğe bağlı After Cursor | `members`, `count`, `pageInfo` |
| Get Issue | Issue ID veya `ENG-123` gibi bir tanımlayıcı | `issue`, `identifier`, `url` |
| Create Issue | Team ID, Title | `issue`, `identifier`, `url` |
| Update Issue | Issue ID veya tanımlayıcı ve en az bir değiştirilmiş alan | `issue`, `identifier`, `url` |
| Delete Issue | Issue ID veya tanımlayıcı | `deleted` |
| Add Issue Link | Issue ID veya tanımlayıcı, Link URL | `link` |
| Create Comment | Issue ID veya tanımlayıcı, Comment Body | `comment` |
| List Comments | Issue ID veya tanımlayıcı, Limit; isteğe bağlı After Cursor | `comments`, `count`, `pageInfo` |
| Update Comment | Comment ID, Comment Body | `comment` |
| Delete Comment | Comment ID | `deleted`, `entityId` |
| Resolve Comment | Comment ID | `comment` |
| Unresolve Comment | Comment ID | `comment` |

Tüm metin alanları [ifadeleri](../reference/expression-dsl.md) destekler.

## Issue alanları

- **Team ID** ve **Project ID** Linear UUID'leridir. Bunları keşfetmek için List Teams veya List Projects kullanın.
- **State ID**, bir issue oluştururken veya güncellerken kullanılan workflow-state UUID'sidir. Bunu keşfetmek için List Workflow States kullanın.
- **Assignee ID** bir Linear kullanıcı UUID'sidir. Bunu keşfetmek için List Team Members kullanın.
- **Priority** `0` ile `4` arasını kabul eder: öncelik yok, acil, yüksek, normal ve düşük.
- Mevcut değerlerini korumak için isteğe bağlı güncelleme alanlarını boş bırakın.
- description, project, assignee veya state değerlerini temizlemek için bir güncelleme alanını `null` olarak ayarlayın.
- **Link URL**, bir issue'ya harici bir ek bağlantısı ekler.
- **Comment ID**, mevcut bir yorum için Linear UUID'sidir. Bunu keşfetmek için List Comments kullanın.
- **Parent Comment ID**, bir yorum oluştururken mevcut bir Linear yorumuna yanıt verir.

## Sayfalama

List işlemleri ya tek bir sayfa döndürebilir ya da her sayfayı otomatik olarak getirebilir:

- `Limit` ve `After Cursor` değerlerini manuel olarak kullanmak için **Return All** seçeneğini kapalı bırakın.
- Linear cursor'larını sunucu tarafında takip etmek için **Return All** seçeneğini açın; en fazla 10.000 sonuca kadar.

Sayfalanmış sonuçlar `pageInfo.hasNextPage` ve `pageInfo.endCursor` döndürür. **Return All** kapalıyken
sonraki sayfayı getirmek için, bir sonraki düğüm çalıştırmasında cursor'ı **After Cursor** alanına geçirin.

## Örnekler

Yukarı akış girdisinden bir issue oluşturun:

- Operation: `Create Issue`
- Team ID: `team UUID`
- Title: `$input.title`
- Description: `$input.description`
- Priority: `2`

Oluşturulan bir issue'ya yorum ekleyin:

- Operation: `Create Comment`
- Issue ID: `$createLinearIssue.issue.id`
- Comment Body: `$input.comment`
- Parent Comment ID: isteğe bağlı, başka bir yoruma yanıt verirken

Bir yorum dizisini çözümleyin:

- Operation: `Resolve Comment`
- Comment ID: `$listComments.comments[0].id`

Bir issue'ya harici bağlantı ekleyin:

- Operation: `Add Issue Link`
- Issue ID: `$createLinearIssue.issue.id`
- Link URL: `$input.url`

Ekip üyeleri arasında sayfalama yapın:

- Operation: `List Team Members`
- Team ID: `$listTeams.teams[0].id`
- Limit: `50`
- After Cursor: `hasNextPage` true olduğunda bir sonraki çalıştırmada `$listTeamMembers.pageInfo.endCursor`

Bir issue'yu güncellemeden önce workflow state ID'lerini keşfedin:

- Operation: `List Workflow States`
- Team ID: `$listTeams.teams[0].id`
- Ardından **Update Issue** içinde **State ID** olarak `$listStates.states[0].id` kullanın

## Çıkış

Her başarılı işlem şunları ayarlar:

- `$linear.success`
- `$linear.operation`

List işlemleri ayrıca `count` ve uygun olduğunda `pageInfo` sunar. Issue işlemleri, eksiksiz Linear
issue payload'ını ve `identifier` ile `url` gibi kolaylık alanlarını sunar.
Comment mutasyonları, `deleted` ve `entityId` sunan Delete Comment hariç, eksiksiz `comment`
payload'ını sunar.

## İlgili

- [Credentials Sekmesi](../tabs/credentials-tab.md)
- [Düğüm Türleri](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
