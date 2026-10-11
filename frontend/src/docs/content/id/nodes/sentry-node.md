# Sentry

Gunakan node Sentry untuk mengotomatiskan operasi organisasi, proyek, tim, issue, event, dan release Sentry dari sebuah workflow.

## Kredensial

Buat kredensial **Sentry** dengan auth token. Biarkan Base URL kosong untuk Sentry SaaS, atau tetapkan root URL untuk instance Sentry yang di-host sendiri.

## Operasi

- `createProject`, `createRelease`, `createTeam`
- `deleteIssue`, `deleteProject`, `deleteRelease`, `deleteTeam`
- `getEvent`, `getIssue`, `getProject`, `getRelease`
- `listEvents`, `listIssues`, `listOrganizations`, `listProjects`, `listReleases`, `listTeams`
- `updateIssue`, `updateOrganization`, `updateProject`, `updateRelease`, `updateTeam`

`createIssue` dan `createOrganization` tidak disediakan karena Sentry tidak mendokumentasikan endpoint REST publik untuk keduanya.

## Field Umum

| Field | Deskripsi |
| --- | --- |
| Credential | Kredensial Sentry yang akan digunakan |
| Operation | Aksi Sentry yang akan dijalankan |
| Organization Slug | Slug organisasi Sentry untuk operasi update organization dan operasi project, team, issue, event, serta release |
| Project Slug | Slug proyek untuk operasi get/update/delete project dan operasi event; slug atau ID proyek untuk filter issue |
| Team Slug | Slug tim untuk operasi create project dan update/delete team |
| Issue ID | ID issue untuk operasi get/update/delete issue |
| Event ID | ID event untuk operasi pencarian event |
| Release Version | Versi release untuk operasi get/update/delete release |
| Name | Nama proyek atau tim untuk operasi create |
| Slug | Slug proyek atau tim opsional untuk operasi create |
| Platform | Platform Sentry opsional untuk pembuatan proyek |
| Status / Assigned To | Field update issue. Minimal salah satu wajib diisi untuk `updateIssue` |
| Query | Query pencarian Sentry. Hilangkan untuk issue yang belum terselesaikan, atau tetapkan sebagai string kosong untuk mengambil semua issue |
| Limit | Batas hasil untuk operasi list, dibatasi maksimal 1.000 total hasil |
| Release Projects JSON | Array JSON berisi slug proyek untuk pembuatan release |
| Release Refs JSON | Array JSON berisi objek repository/commit untuk pembuatan release |
| Payload JSON | Objek JSON untuk operasi update organization, project, release, dan team |

## Contoh

Menampilkan daftar issue yang belum terselesaikan:

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

Menyelesaikan sebuah issue:

```json
{
  "sentryOperation": "updateIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id",
  "sentryStatus": "resolved"
}
```

Menghapus sebuah issue:

```json
{
  "sentryOperation": "deleteIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id"
}
```

Membuat sebuah release:

```json
{
  "sentryOperation": "createRelease",
  "sentryOrganizationSlug": "acme",
  "sentryReleaseVersion": "web-app@1.2.3",
  "sentryReleaseProjects": "[\"web-app\"]"
}
```

Memperbarui sebuah proyek:

```json
{
  "sentryOperation": "updateProject",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryPayload": "{\"name\":\"Web App\"}"
}
```

## Output

Operasi list mengembalikan `success`, `operation`, `count`, dan koleksi terkait seperti `organizations`, `projects`, `teams`, `issues`, `events`, atau `releases`. Operasi single-resource mengembalikan `organization`, `issue`, `event`, `release`, `project`, atau `team`. Operasi delete mengembalikan key resource terkait dengan `deleted: true` beserta field pengidentifikasinya.
