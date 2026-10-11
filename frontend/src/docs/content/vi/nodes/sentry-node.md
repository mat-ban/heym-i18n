# Sentry

Sử dụng node Sentry để tự động hóa các thao tác trên tổ chức, dự án, nhóm, issue, event và release của Sentry từ một workflow.

## Credential

Tạo một credential **Sentry** với auth token. Để trống Base URL đối với Sentry SaaS, hoặc đặt root URL cho phiên bản Sentry tự host.

## Operations

- `createProject`, `createRelease`, `createTeam`
- `deleteIssue`, `deleteProject`, `deleteRelease`, `deleteTeam`
- `getEvent`, `getIssue`, `getProject`, `getRelease`
- `listEvents`, `listIssues`, `listOrganizations`, `listProjects`, `listReleases`, `listTeams`
- `updateIssue`, `updateOrganization`, `updateProject`, `updateRelease`, `updateTeam`

`createIssue` và `createOrganization` không được cung cấp vì Sentry không tài liệu hóa các REST endpoint công khai cho chúng.

## Common Fields

| Field | Description |
| --- | --- |
| Credential | Credential Sentry để sử dụng |
| Operation | Hành động Sentry để chạy |
| Organization Slug | Slug tổ chức Sentry cho thao tác cập nhật tổ chức và các thao tác trên dự án, nhóm, issue, event và release |
| Project Slug | Slug dự án cho thao tác get/update/delete dự án và các thao tác event; slug hoặc ID dự án cho bộ lọc issue |
| Team Slug | Slug nhóm cho thao tác tạo dự án và update/delete nhóm |
| Issue ID | ID issue cho thao tác get/update/delete issue |
| Event ID | ID event cho thao tác tra cứu event |
| Release Version | Phiên bản release cho thao tác get/update/delete release |
| Name | Tên dự án hoặc nhóm cho thao tác tạo |
| Slug | Slug dự án hoặc nhóm tùy chọn cho thao tác tạo |
| Platform | Nền tảng Sentry tùy chọn cho việc tạo dự án |
| Status / Assigned To | Các trường cập nhật issue. Cần ít nhất một trường cho `updateIssue` |
| Query | Truy vấn tìm kiếm Sentry. Bỏ qua nó đối với các issue chưa được giải quyết, hoặc đặt thành chuỗi rỗng để lấy tất cả issue |
| Limit | Giới hạn kết quả cho thao tác list, tối đa 1.000 kết quả |
| Release Projects JSON | Mảng JSON các slug dự án cho việc tạo release |
| Release Refs JSON | Mảng JSON các đối tượng repository/commit cho việc tạo release |
| Payload JSON | Đối tượng JSON cho thao tác cập nhật tổ chức, dự án, release và nhóm |

## Examples

Liệt kê các issue chưa được giải quyết:

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

Giải quyết một issue:

```json
{
  "sentryOperation": "updateIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id",
  "sentryStatus": "resolved"
}
```

Xóa một issue:

```json
{
  "sentryOperation": "deleteIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id"
}
```

Tạo một release:

```json
{
  "sentryOperation": "createRelease",
  "sentryOrganizationSlug": "acme",
  "sentryReleaseVersion": "web-app@1.2.3",
  "sentryReleaseProjects": "[\"web-app\"]"
}
```

Cập nhật một dự án:

```json
{
  "sentryOperation": "updateProject",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryPayload": "{\"name\":\"Web App\"}"
}
```

## Outputs

Các thao tác list trả về `success`, `operation`, `count` và collection liên quan như `organizations`, `projects`, `teams`, `issues`, `events` hoặc `releases`. Các thao tác trên một tài nguyên đơn trả về `organization`, `issue`, `event`, `release`, `project` hoặc `team`. Các thao tác delete trả về key tài nguyên liên quan với `deleted: true` và các trường định danh.
