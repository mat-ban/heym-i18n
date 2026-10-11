# Jira

**Jira** düğümü, iş akışlarını proje, sorun (issue), yorum, ek dosya, kullanıcı, bildirim ve geçiş otomasyonu için Jira REST API'sine bağlar. Varsayılan işlem **Search Issues**'tır.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Kimlik Bilgisi | Jira (Cloud e-posta/API token veya Data Center kullanıcı adı/parola, temel URL, dağıtım modu, isteğe bağlı REST API sürümü) |
| Çıkış | `$nodeLabel.*` |

## Kimlik Bilgisi

[Credentials Sekmesi](../tabs/credentials-tab.md) içinde bir **Jira** kimlik bilgisi oluşturun. Saklanan yapılandırma anahtarları `email`, `api_token`, `base_url`, `deployment` ve isteğe bağlı `api_version`'dır. Jira Cloud için `email` Atlassian hesap e-postasını, `api_token` ise Atlassian API token'ını saklar. Jira Data Center / Server için aynı anahtarlar Basic auth kullanıcı adını ve parolasını saklar. Kurulum adımları için [Üçüncü Taraf Entegrasyonları](../reference/integrations.md#jira) bölümüne bakın.

| Alan | Yapılandırma anahtarı | Açıklama |
| --- | --- | --- |
| Jira E-postası / Kullanıcı Adı | `email` | Jira Cloud Atlassian hesap e-postası veya Jira Data Center / Server kullanıcı adı |
| API Token / Parola | `api_token` | Jira Cloud Atlassian API token'ı veya Basic auth için Jira Data Center / Server parolası |
| Temel URL | `base_url` | Jira site URL'si, örneğin `https://your-domain.atlassian.net` |
| Dağıtım | `deployment` | Jira Cloud için `cloud` veya Jira Data Center / Server için `data_center` |
| REST API Sürümü | `api_version` | Jira Cloud için varsayılan olarak `3`'tür. Data Center / Server REST API v2 kullanır |

Data Center / Server kişisel erişim token'ları ve Bearer auth henüz Jira kimlik bilgisi tarafından desteklenmemektedir.

Kimlik bilgisini mevcut Jira kullanıcısına karşı doğrulamak için **Test Connection**'ı kullanın.

## İşlemler

| İşlem | Gerekli alanlar | Çıkış |
| --- | --- | --- |
| Get Myself | — | `user` |
| List Projects | İsteğe bağlı Limit, Start At | `projects`, `count`, `pagination` |
| Search Issues | İsteğe bağlı JQL, Issue Fields, Limit, Next Page Token, Start At | `issues`, `count`, `pagination` |
| Get Issue | Issue Key veya ID | `issue`, `key` |
| Create Issue | Project Key, Summary | `issue`, `key` |
| Update Issue | Issue Key veya ID ve en az bir değiştirilmiş alan | `issue`, `key` |
| Delete Issue | Issue Key veya ID | `deleted` |
| Get Issue Changelog | Issue Key veya ID; isteğe bağlı Limit, Start At | `changelog`, `count`, `pagination` |
| Notify Issue | Issue Key veya ID, Subject, Text Body | `notified` |
| List Comments | Issue Key veya ID; isteğe bağlı Limit, Start At | `comments`, `count`, `pagination` |
| Create Comment | Issue Key veya ID, Comment Body | `comment` |
| Get Comment | Issue Key veya ID, Comment ID | `comment` |
| Update Comment | Issue Key veya ID, Comment ID, Comment Body | `comment` |
| Delete Comment | Issue Key veya ID, Comment ID | `deleted` |
| Add Attachment | Issue Key veya ID, Filename, Base64 içeriği | `attachments`, `count` |
| Get Attachment | Attachment ID; isteğe bağlı Include Binary | `attachment` |
| List Attachments | Issue Key veya ID; isteğe bağlı Limit, Start At, Include Binary | `attachments`, `count`, `pagination` |
| Delete Attachment | Attachment ID | `deleted` |
| List Transitions | Issue Key veya ID | `transitions`, `count` |
| Transition Issue | Issue Key veya ID, Transition ID | `transition`, `issue`, `key` |
| Get User | Account ID / Kullanıcı Adı | `user` |
| Create User | Kullanıcı E-postası | `user` |
| Delete User | Account ID / Kullanıcı Adı | `deleted` |

İfade destekli metin alanları `$input.text` gibi [ifadeleri](../reference/expression-dsl.md) destekler. `jiraIncludeBinary` bir boolean anahtarıdır ve ifadeleri desteklemez, ancak Jira düğümü bir Agent tool handle'ına bağlandığında agent tarafından sağlanan olarak işaretlenebilir.

## Sorun ve güncelleme alanları

- **Project Key**, `ENG` gibi kısa proje anahtarıdır. Anahtarları keşfetmek için List Projects'i kullanın.
- **Issue Key veya ID**, `ENG-123` gibi anahtarları veya sayısal sorun ID'lerini kabul eder. Değerleri keşfetmek için Search Issues veya List Projects'i kullanın.
- **Transition ID**, List Transitions'tan gelir. Her geçiş nesnesi bir `id` alanı içerir.
- **Comment ID** ve **Attachment ID**, List Comments, List Attachments veya önceki create/get yanıtlarından gelir.
- **Account ID / Kullanıcı Adı**, Jira Cloud `accountId` değeri veya Jira Data Center / Server kullanıcı adıdır. Get Myself veya Get User bunu keşfetmenize yardımcı olabilir.
- Sorun **description** ve yorum **body** metinleri REST API v3'te Atlassian Document Format olarak gönderilir; kimlik bilgisi dağıtımı Data Center / Server olduğunda düz metin olarak gönderilir. v3'te yeni satır karakterleri ayrı paragraflara dönüşür.
- **Get Issue Changelog**, Jira Cloud'un sayfalanmış changelog endpoint'ini kullanır. Data Center / Server için genişletilmiş sorun changelog verilerini okur ve yapılandırılmış offset/limit değerini döndürülen geçmişlere uygular.
- **Update Issue** üzerinde, mevcut değerlerini korumak için isteğe bağlı alanları boş bırakın.
- Bu alanları temizlemek için güncellemede **Description** veya **Assignee Account ID / Kullanıcı Adı** değerini `null` olarak ayarlayın. Labels `null` ile temizlenemez.
- Notify Issue üzerindeki **Recipients JSON**, atlandığında varsayılan olarak `{"assignee":true}` değerini alır. Yaygın anahtarlar arasında `assignee`, `reporter`, `watchers` ve `voters` bulunur (örneğin `{"assignee":true,"watchers":true}`).
- **Add Attachment**, ham base64 veya data URL içeriğini kabul eder ve platform dosya boyutu ayarıyla sınırlıdır (varsayılan 99 MB).
## Sayfalama

- **Search Issues**, Jira Cloud için `jiraNextPageToken` aracılığıyla cursor sayfalaması kullanır. Önceki çalıştırmadan `pagination.nextPageToken` değerini okuyun ve bir sonraki Search Issues düğümüne aktarın.
- **Search Issues**, Jira Data Center / Server için `jiraStartAt` aracılığıyla offset sayfalaması kullanır. Bir sonraki sayfayı hesaplamak için `pagination.startAt`, `pagination.maxResults` ve `pagination.total` değerlerini okuyun.
- **List Projects**, **Get Issue Changelog**, **List Comments** ve **List Attachments**, `jiraLimit` ve `jiraStartAt` ile offset sayfalaması kullanır. Sayfalanmış sonuçlar `pagination.startAt`, `pagination.maxResults`, `pagination.total` ve `pagination.isLast` değerlerini döndürür.
- **List Attachments**, önce issue'daki tüm ekleri getirir, ardından sonucu istemci tarafında dilimler. Sayfalama alanları yine de döndürülen sayfayı tanımlar, ancak büyük issue'lar ek bir getirme maliyetine yol açabilir.
- **List Transitions** sayfalama yapmaz.

## Anahtar Alanlar

| Alan | Kullanan | Notlar |
| --- | --- | --- |
| `credentialId` | Tüm işlemler | Sahip olunan Jira credential UUID'si |
| `jiraOperation` | Tüm işlemler | Varsayılan olarak `searchIssues` |
| `jiraProjectKey` | Create Issue | `ENG` gibi proje anahtarı |
| `jiraIssueKey` | Issue, comment, attachment, notification ve transition işlemleri | `ENG-123` gibi issue anahtarı veya sayısal issue ID |
| `jiraIssueType` | Create Issue | Varsayılan olarak `Task` |
| `jiraIssueTypeId` | Create Issue | İsteğe bağlı issue type ID; ayarlandığında `jiraIssueType` değerini geçersiz kılar |
| `jiraSummary` | Create/Update Issue | Create Issue için zorunludur |
| `jiraDescription` | Create/Update Issue | REST API v3'te ADF olarak veya REST API v2'de düz metin olarak gönderilir; açıklamayı temizlemek için güncellemede `null` kullanın |
| `jiraJql` | Search Issues | Varsayılan olarak `updated >= -30d ORDER BY updated DESC` |
| `jiraFields` | Search Issues | İsteğe bağlı JSON dizisi veya virgülle ayrılmış issue alanları; boş olduğunda varsayılan olarak `key`, `summary`, `status`, `assignee` ve `issuetype` |
| `jiraAssigneeAccountId` | Create/Update Issue | Jira Cloud accountId veya Data Center / Server kullanıcı adı; atanan kişiyi temizlemek için güncellemede `null` kullanın |
| `jiraLabels` | Create/Update Issue | JSON dizisi veya virgülle ayrılmış metin |
| `jiraCommentBody` | Create/Update Comment | REST API v3'te ADF olarak veya REST API v2'de düz metin olarak gönderilir |
| `jiraCommentId` | Get/Update/Delete Comment | Jira comment ID |
| `jiraTransitionId` | Transition Issue | List Transitions ile keşfedin |
| `jiraAttachmentId` | Get/Delete Attachment | Jira attachment ID |
| `jiraAttachmentFilename` | Add Attachment | Yüklenen dosya adı |
| `jiraAttachmentBase64` | Add Attachment | Ham base64 veya data URL içeriği; dosya boyutu sınırına tabidir |
| `jiraAttachmentMimeType` | Add Attachment | İsteğe bağlı MIME türü; boş olduğunda dosya adından çıkarılır |
| `jiraIncludeBinary` | Get/List Attachment | Boolean anahtarı; etkinleştirildiğinde `content_base64` ekler |
| `jiraNotifySubject` | Notify Issue | Zorunlu bildirim konusu |
| `jiraNotifyTextBody` | Notify Issue | Zorunlu düz metin bildirim gövdesi |
| `jiraNotifyHtmlBody` | Notify Issue | İsteğe bağlı HTML gövdesi |
| `jiraNotifyTo` | Notify Issue | Alıcılar JSON'u; varsayılan olarak `{"assignee":true}` |
| `jiraAccountId` | Get/Delete User | Jira Cloud accountId veya Data Center / Server kullanıcı adı |
| `jiraUserEmail` | Create User | Yeni kullanıcı e-posta adresi |
| `jiraUsername` | Create User | İsteğe bağlı Data Center / Server kullanıcı adı; boş olduğunda `jiraUserEmail` değerine geri döner |
| `jiraUserDisplayName` | Create User | İsteğe bağlı görünen ad |
| `jiraUserProducts` | Create User | JSON dizisi veya virgülle ayrılmış ürün anahtarları; yalnızca Jira Cloud |
| `jiraLimit` | Search Issues, List Projects, Get Issue Changelog, List Comments, List Attachments | Varsayılan olarak `50`; aralık 1–100 |
| `jiraStartAt` | Data Center / Server üzerinde Search Issues, List Projects, Get Issue Changelog, List Comments, List Attachments | Offset sayfalaması başlangıç dizini |
| `jiraNextPageToken` | Jira Cloud üzerinde Search Issues | Önceki arama yanıtından gelen cursor token'ı |

## Örnekler

Yukarı akış girdisinden bir issue oluşturun:

- Operation: `createIssue`
- Project Key: `ENG`
- Issue Type: `Task`
- Summary: `$input.title`
- Description: `$input.description`
- Labels: `["automation"]`

Bir issue'yu güncelleyin ve atanan kişiyi temizleyin:

- Operation: `updateIssue`
- Issue Key or ID: `ENG-123`
- Summary: `$input.title`
- Assignee Account ID / Username: `null`

Özel alanlar ve cursor sayfalaması ile issue arayın:

- Operation: `searchIssues`
- JQL: `project = ENG AND updated >= -30d ORDER BY updated DESC`
- Issue Fields: `["key","summary","status"]`
- Limit: `25`
- Next Page Token: `$searchJira.pagination.nextPageToken`

Data Center üzerinde offset sayfalaması ile issue arayın:

- Operation: `searchIssues`
- JQL: `project = ENG ORDER BY updated DESC`
- Limit: `25`
- Start At: `25`

Kullanılabilir transition'ları listeledikten sonra bir issue'yu transition edin:

- Operation: `listTransitions`
- Issue Key or ID: `ENG-123`
- Ardından **Transition Issue** işlemini Transition ID: `$listTransitions.transitions[0].id` ile çalıştırın

İzleyicileri bir issue güncellemesi hakkında bilgilendirin:

- Operation: `notifyIssue`
- Issue Key or ID: `ENG-123`
- Subject: `Issue updated`
- Text Body: `$input.text`
- Recipients JSON: `{"assignee":true,"watchers":true}`
## Çıktı

Her başarılı işlem şunları ayarlar:

- `$jira.success`
- `$jira.operation`

**Get Myself** `user` alanını sunar.

**Sayfalanmış liste işlemleri** `count`, bir koleksiyon alanı ve `pagination` sunar:

| İşlem | Koleksiyon anahtarı | Sayfalama yapısı |
| --- | --- | --- |
| List Projects | `projects` | `{ startAt, maxResults, total, isLast }` |
| Search Issues | `issues` | Cloud: `{ maxResults, nextPageToken, isLast }`; Data Center: `{ startAt, maxResults, total, isLast }` |
| Get Issue Changelog | `changelog` | `{ startAt, maxResults, total, isLast }` |
| List Comments | `comments` | `{ startAt, maxResults, total, isLast }` |
| List Attachments | `attachments` | `{ startAt, maxResults, total, isLast }` |

**List Transitions** sayfalama olmadan `transitions` ve `count` sunar.

**Issue mutasyonları ve okumaları** Jira issue payload'ını ve uygun olduğunda `key` alanını sunar.

**Comment** get/create/update `comment` sunar; delete `deleted` sunar.

**Transition Issue** `transition` alanını `{ transitionId }` olarak, ayrıca yenilenmiş `issue` ve `key` alanlarını sunar.

**Attachment add** `attachments` ve `count` sunar. **Get Attachment** `attachment` sunar; **List Attachments** `attachments`, `count` ve `pagination` sunar. **Include Binary** etkinleştirildiğinde, her attachment nesnesi `content_base64` içerebilir. Delete `deleted` sunar.

**User** get/create `user` sunar; delete `deleted` sunar.

**Notify Issue** `notified` sunar.

Yaygın erişim kalıpları:

- `$searchJira.issues[0].key`
- `$searchJira.pagination.nextPageToken`
- `$createJiraIssue.key`
- `$listTransitions.transitions[0].id`
- `$getAttachment.attachment.content_base64`

## İlgili

- [Credentials Sekmesi](../tabs/credentials-tab.md)
- [Üçüncü Taraf Entegrasyonları](../reference/integrations.md#jira)
- [Düğüm Türleri](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
