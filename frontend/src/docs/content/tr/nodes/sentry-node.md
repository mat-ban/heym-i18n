# Sentry

Sentry organizasyon, proje, ekip, sorun (issue), olay (event) ve sürüm (release) işlemlerini bir workflow üzerinden otomatikleştirmek için Sentry düğümünü kullanın.

## Credential

Bir auth token ile bir **Sentry** credential oluşturun. Sentry SaaS için Base URL alanını boş bırakın veya kendi sunucunuzda barındırılan (self-hosted) bir Sentry örneği için kök URL'yi ayarlayın.

## İşlemler

- `createProject`, `createRelease`, `createTeam`
- `deleteIssue`, `deleteProject`, `deleteRelease`, `deleteTeam`
- `getEvent`, `getIssue`, `getProject`, `getRelease`
- `listEvents`, `listIssues`, `listOrganizations`, `listProjects`, `listReleases`, `listTeams`
- `updateIssue`, `updateOrganization`, `updateProject`, `updateRelease`, `updateTeam`

`createIssue` ve `createOrganization` sunulmamaktadır çünkü Sentry bunlar için herkese açık REST endpoint'lerini belgelemez.

## Ortak Alanlar

| Alan | Açıklama |
| --- | --- |
| Credential | Kullanılacak Sentry credential |
| Operation | Çalıştırılacak Sentry eylemi |
| Organization Slug | Organizasyon güncelleme ve proje, ekip, sorun, olay ve sürüm işlemleri için Sentry organizasyon slug'ı |
| Project Slug | Proje get/update/delete ve olay işlemleri için proje slug'ı; sorun filtreleri için proje slug'ı veya ID'si |
| Team Slug | Proje oluşturma ve ekip update/delete işlemleri için ekip slug'ı |
| Issue ID | Sorun get/update/delete işlemleri için sorun ID'si |
| Event ID | Olay arama işlemleri için olay ID'si |
| Release Version | Sürüm get/update/delete işlemleri için sürüm versiyonu |
| Name | Oluşturma işlemleri için proje veya ekip adı |
| Slug | Oluşturma işlemleri için isteğe bağlı proje veya ekip slug'ı |
| Platform | Proje oluşturma için isteğe bağlı Sentry platformu |
| Status / Assigned To | Sorun güncelleme alanları. `updateIssue` için en az biri gereklidir |
| Query | Sentry arama sorgusu. Çözülmemiş sorunlar için atlayın veya tüm sorunları getirmek için boş bir dize olarak ayarlayın |
| Limit | Listeleme işlemleri için sonuç limiti, toplamda en fazla 1.000 sonuç |
| Release Projects JSON | Sürüm oluşturma için proje slug'larından oluşan JSON dizisi |
| Release Refs JSON | Sürüm oluşturma için repository/commit nesnelerinden oluşan JSON dizisi |
| Payload JSON | Organizasyon, proje, sürüm ve ekip güncelleme işlemleri için JSON nesnesi |

## Örnekler

Çözülmemiş sorunları listeleyin:

```json
{
  "sentryOperation": "listIssues",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryQuery": "is:unresolved level:error",
  "sentryStatsPeriod": "14d",
  "sentryLimit": "25"
}
```

Bir sorunu çözüldü olarak işaretleyin:

```json
{
  "sentryOperation": "updateIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id",
  "sentryStatus": "resolved"
}
```

Bir sorunu silin:

```json
{
  "sentryOperation": "deleteIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id"
}
```

Bir sürüm oluşturun:

```json
{
  "sentryOperation": "createRelease",
  "sentryOrganizationSlug": "acme",
  "sentryReleaseVersion": "web-app@1.2.3",
  "sentryReleaseProjects": "[\"web-app\"]"
}
```

Bir projeyi güncelleyin:

```json
{
  "sentryOperation": "updateProject",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryPayload": "{\"name\":\"Web App\"}"
}
```

## Çıktılar

Listeleme işlemleri `success`, `operation`, `count` ve `organizations`, `projects`, `teams`, `issues`, `events` veya `releases` gibi ilgili koleksiyonu döndürür. Tek kaynaklı işlemler `organization`, `issue`, `event`, `release`, `project` veya `team` döndürür. Silme işlemleri, ilgili kaynak anahtarını `deleted: true` ve tanımlayıcı alanlarla birlikte döndürür.
