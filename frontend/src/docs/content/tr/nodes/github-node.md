# GitHub

**GitHub** düğümü, bir workflow'a yerel GitHub REST işlemleri ekler; bu, n8n gibi araçlardan bildiğiniz çok işlemli GitHub düğümlerine benzer.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Credential | GitHub |
| Çıkış | `$nodeLabel.*` |

## Desteklenen İşlemler

Düğüm şu anda 40 eylem sunmaktadır:

| Kaynak | Eylemler |
|----------|---------|
| Repository | `Get Repository`, `Get Repository License`, `Get Repository Profile`, `Get Repository Issues`, `Get Repository Pull Requests`, `List Popular Paths for Repository`, `List Top Referrers for Repository` |
| Organization / User | `List Organization Repositories`, `List User Repositories`, `Get User Repositories`, `Get User Issues`, `Invite User` |
| Issue | `Create Issue`, `Get Issue`, `List Issues`, `Edit Issue`, `Lock Issue`, `Create Comment` |
| Pull request | `Create Pull Request`, `List Pull Requests` |
| Review | `Create Review`, `Get Review`, `List Reviews`, `Update Review` |
| Release | `Create Release`, `Get Release`, `List Releases`, `Update Release`, `Delete Release` |
| Workflow | `List Workflows`, `Get Workflow`, `Enable Workflow`, `Disable Workflow`, `Get Workflow Usage`, `Dispatch Workflow`, `Dispatch Workflow and Wait` |
| File | `Get File`, `List Files`, `Create or Update File`, `Delete File` |

## Credential

[Credentials Sekmesi](../tabs/credentials-tab.md) içinde bir **GitHub** credential'ı oluşturun:

- Kişisel erişim token'ı
- GitHub Enterprise Server için isteğe bağlı tam REST API temel URL'si

GitHub.com için temel URL'yi boş bırakın. İnce tanımlı PAT'ler önerilir.

GitHub Enterprise Server için `/api/v3` dahil olmak üzere tam REST API endpoint'ini girin, örneğin
`https://github.example.com/api/v3`. Yalnızca web arayüzü kökünü
(`https://github.example.com`) girmeyin.

GitHub Enterprise Server kullanıyorsanız ve daha sonra token'ı döndürmek için credential'ı düzenlerseniz,
`base_url` alanını boş bırakmak mevcut Enterprise endpoint'ini korur. Yeni bir URL'yi yalnızca bu
endpoint'i değiştirmek istediğinizde girin.

## Ortak Alanlar

Çoğu işlem şunları kullanır:

- **Owner** – Repository sahibi, organizasyon adı veya kullanıcı adı
- **Repository** – Repository adı

`List Organization Repositories` yalnızca **Owner** (organizasyon adı) gerektirir ve repository alanını kullanmaz.

`List User Repositories` yalnızca **Owner** (kullanıcı adı) gerektirir ve repository alanını kullanmaz.

`Get User Repositories`, n8n'in User → Get Repositories eylemini yansıtır. `Get User Issues` varsayılan olarak
kimliği doğrulanmış GitHub kullanıcısına atanan issue'ları döndürür. Bunun yerine kimliği doğrulanmış kullanıcıdan
bahseden issue'ları döndürmek için **Mentioned Filter** alanını boş olmayan herhangi bir değere ayarlayın. Ayrıca
state, labels, updated-since, sort, direction ve per-page filtrelerini destekler. `Invite User` bir
organizasyon ve e-posta adresi gerektirir ve Owner veya Repository kullanmaz.

## Repository

Repository işlemleri metadata, algılanan lisans içeriği, topluluk sağlık profili ve
trafik içgörülerini içerir. `List Popular Paths for Repository` ve
`List Top Referrers for Repository`, son 14 güne ait GitHub'ın en üst trafik girişlerini döndürür ve
repository yönetim push erişimi gerektirir.

`List Issues` isteğe bağlı assignee, creator, mentioned user, virgülle ayrılmış labels,
updated-since zaman damgası, sort ve direction filtrelerini destekler. `List Pull Requests` state, sort,
direction ve per-page kontrollerini destekler.

`Get Repository Issues` ve `Get Repository Pull Requests`, List karşılıklarıyla aynı API'leri
n8n uyumlu açık repository eylem adları altında sunar.

### Get Repository metadata

`Get Repository`, GitHub'ın tam yanıtını `$github.repository` içinde saklar ve ayrıca
`$github.full_name`, `$github.default_branch`, `$github.private` ve `$github.url` alanlarını sunar.

Repository payload'ı genellikle şunları içerir:

- Kimlik ve sahiplik: ID, name, full name, description, owner ve visibility
- Repository durumu: private, fork, archived, disabled ve default branch
- URL'ler: GitHub sayfası, API, clone, SSH ve Git URL'leri
- Etkinlik ve boyut: oluşturma, güncelleme ve push zaman damgaları, size, stars, watchers, forks, subscribers ve open issues
- Özellikler: issues, projects, wiki, Pages, discussions, topics, language ve homepage
- Mevcut olduğunda license, merge ayarları, çağıran izinleri, güvenlik ayarları ve fork parent/source metadata'sı

Bazı yönetim, izin, merge ve güvenlik alanları credential'ın repository
izinlerine bağlıdır.

Örnek:

- Owner: `heymrun`
- Repository: `heym`

## Issues

Issue işlemleri title/body alanlarını ve labels ile assignees için isteğe bağlı JSON-array alanlarını destekler.

`List Issues` yalnızca repository issue'larını döndürür. Pull request'ler hariç tutulur; PR sonuçları için `List Pull Requests` kullanın.

```json
["bug", "backend"]
```

```json
["octocat"]
```

### Edit Issue alan semantiği

`Edit Issue` için yalnızca açıkça ayarladığınız alanlar GitHub'a gönderilir:

- **State** – `Don't change`, `Open` veya `Closed` seçin. Mevcut durumu korumak için ayarlanmamış bırakın.
- **State Reason** – İsteğe bağlı olarak `Completed`, `Not Planned`, `Duplicate` veya `Reopened` ayarlayın.
- **Title / Body** – Mevcut değeri korumak için boş bırakın.
- **Labels / Assignees** – Mevcut değeri korumak için alanı boş bırakın. Tüm labels veya assignees'ı temizlemek için `[]` kullanın. Bunları değiştirmek için `["bug"]` gibi bir JSON array kullanın.

`Edit Issue`, çalışma zamanında değiştirilecek en az bir alan gerektirir. Yalnızca bir issue numarası sağlarsanız, yürütme GitHub API katmanından bir doğrulama hatasıyla başarısız olur.
## Lock Issue

`Lock Issue`, isteğe bağlı bir **Lock reason** kabul eder. Sağlandığında, GitHub'ın desteklediği değerlerden biri olmalıdır:

- `off-topic`
- `too heated`
- `resolved`
- `spam`

Belirli bir neden olmadan kilitlemek için nedeni boş bırakın.

## Pull Requests

Create PR şunları gerektirir:

- Title
- Head branch
- Base branch
- İsteğe bağlı body
- İsteğe bağlı draft modu

## Pull Request Reviews

Review işlemleri GitHub'ın pull request review API'siyle eşleşir:

| İşlem | Gerekli alanlar | İsteğe bağlı alanlar |
|-----------|-----------------|-----------------|
| `Create Review` | Pull request numarası, event | Body, commit ID |
| `Get Review` | Pull request numarası, review ID | — |
| `List Reviews` | Pull request numarası | Per page |
| `Update Review` | Pull request numarası, review ID, body | — |

`Create Review`, `Approve`, `Request Changes`, `Comment` ve `Pending` seçeneklerini destekler.
Body, `Request Changes` ve `Comment` için gereklidir. Commit ID boş olduğunda, GitHub
pull request'in en son commit'ini inceler.

## Releases

| İşlem | Çalışma zamanında gerekli alanlar | Genellikle isteğe bağlı |
|-----------|---------------------------|-------------------|
| `Create Release` | Tag name | Release name (title), body, target branch, draft, prerelease |
| `Update Release` | Release ID | Tag name, release name, body, target branch, draft, prerelease |
| `Get Release` / `Delete Release` | Release ID | — |

`Update Release`, `draft` / `prerelease` değerlerini açıkça `true` veya `false` olarak ayarlayabilir.

## Workflows

Workflow işlemleri şunları destekler:

- Repository workflow'larını listeleme
- Sayısal ID veya workflow dosya adıyla bir workflow alma
- Bir workflow'u etkinleştirme veya devre dışı bırakma
- Runner işletim sistemine göre faturalandırılabilir workflow kullanımını okuma
- Bir ref veya branch ile birlikte isteğe bağlı JSON inputs nesnesiyle bir workflow tetikleme

GitHub, `Get Workflow Usage` endpoint'ini kapatma sürecindedir. Bu işlemi kullanan
workflow'ların, GitHub endpoint'i kaldırdığında geçiş yapması gerekebilir.

`Dispatch Workflow`, her iki GitHub yanıt biçimini de kabul eder: eski `204 No Content` ve
`workflow_run_id`, `run_url` ve `html_url` içeren yeni `200` yanıtı.

`Dispatch Workflow and Wait`, workflow'u tetikler ve durumu `completed` olana kadar run'ı
yoklar. Timeout ve polling aralığını saniye cinsinden yapılandırın. Heym, GitHub yeni `200`
yanıtını döndürdüğünde `workflow_run_id` kullanır. Geleneksel `204 No Content` yanıtı için
Heym, seçilen workflow ve ref için yeni oluşturulan `workflow_dispatch` run'ını bulur ve
ardından o run'ı bekler.

## File Contents

`Get File`, GitHub'ın contents API'si aracılığıyla bir repository dosyasını okur ve mevcut
olduğunda metin içeriğini çözer. Binary dosyalar ve UTF-8 olmayan içerik, çözümlenmiş bir
`content` alanı olmadan metadata döndürebilir.

`List Files`, belirli bir klasör yolu ve isteğe bağlı ref için repository contents API'sinden
dizin girdilerini döndürür. Repository kökünü listelemek için **Directory Path** alanını boş
bırakın.

`Create or Update File`, aşağıdakileri kullanarak bir repository yoluna metin içeriği yazar:

- File path
- Commit message
- File content
- İsteğe bağlı branch

`Delete File`, bir commit message ve isteğe bağlı branch kullanarak bir repository yolunu
kaldırır. Dosya mevcutsa, Heym silmeden önce geçerli SHA'yı otomatik olarak alır.

Dosya zaten mevcutsa, Heym güncellemeden önce geçerli SHA'yı otomatik olarak alır.

## Pagination

`List Issues`, `Get Repository Issues`, `Get User Issues`, `List Pull Requests`,
`Get Repository Pull Requests`, `List Reviews`, `List Releases`, `List Workflows`,
`List Organization Repositories`, `List User Repositories` ve `Get User Repositories`
**Per Page** (1–100) destekler. Heym tek bir sonuç sayfası ister; aynı işlemde ek sayfalar
almak için bir `page` alanı yoktur.


### Return all pages

Bir çalıştırmanın, ayarlanmışsa **Cursor** konumundan başlayarak her sayfayı izlemesi için **Return all pages** seçeneğini açın. Her istek, **Per Page** değeri ne olursa olsun 100 öğe ister. Düğüm yaklaşık 1.000 öğeden (veya 100 istekten) sonra durur: issue nesneleri yaklaşık 6 KB boyutundadır, bu nedenle daha yüksek bir sınır çok büyük düğüm çıktıları üretirdi. Erken durduğunda hata vermek yerine elindekileri `has_more: true` ve bir `next_cursor` ile döndürür; bu imleci sonraki çalıştırmaya ileterek devam edebilirsiniz. Workflow'u durdurmak veya Workflow zaman aşımına ulaşmak, getirme işlemini sayfalar arasında sonlandırır.

## Output

Tam şekil, seçilen işleme bağlıdır. Yaygın alanlar şunları içerir:

- `$github.success`
- `$github.operation`
- `$github.repository`
- `$github.license`
- `$github.profile`
- `$github.paths`
- `$github.referrers`
- `$github.issue`
- `$github.issues`
- `$github.pull_request`
- `$github.pull_requests`
- `$github.review`
- `$github.reviews`
- `$github.release`
- `$github.releases`
- `$github.workflow`
- `$github.workflows`
- `$github.workflow_run`
- `$github.workflow_run_id`
- `$github.completed`
- `$github.conclusion`
- `$github.usage`
- `$github.billable`
- `$github.invitation`
- `$github.file`
- `$github.items`
- `$github.path`
- `$github.sha`
- `$github.commit_sha`
- `$github.deleted`
- `$github.created`
- `$github.ref`
- `$github.inputs`

`github` kısmını node etiketinizle değiştirin.

## Notes

- Labels ve assignees, sağlandığında geçerli JSON dizileri olmalıdır.
- Workflow dispatch inputs, sağlandığında geçerli bir JSON nesnesi olmalıdır.
- `Edit Issue`, `state` değerini yalnızca açıkça ayarladığınızda kullanır; mevcut issue
  durumunu korumak için ayarlanmamış bırakın.
- GitHub API izinleri, verdiğiniz token kapsamlarına veya ayrıntılı repository izinlerine
  bağlıdır.

## Related

- [Credentials Tab](../tabs/credentials-tab.md) – GitHub kimlik bilgilerini ekleyin ve yönetin
- [Third-Party Integrations](../reference/integrations.md) – GitHub kimlik bilgisi kurulumu ve Enterprise `base_url`
- [Agent Node](./agent-node.md) – GitHub kimlik bilgilerini `@modelcontextprotocol/server-github` ile kullanın
- [Node Types](../reference/node-types.md) – Tam node kataloğu
