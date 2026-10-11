# Sentry

Sentry ノードを使用すると、Workflow から Sentry の組織、プロジェクト、チーム、Issue、イベント、リリースの操作を自動化できます。

## Credential

認証 Token を使用して **Sentry** Credential を作成します。Sentry SaaS を利用する場合は Base URL を空のままにし、セルフホスト型の Sentry インスタンスを利用する場合はルート URL を設定してください。

## Operations

- `createProject`、`createRelease`、`createTeam`
- `deleteIssue`、`deleteProject`、`deleteRelease`、`deleteTeam`
- `getEvent`、`getIssue`、`getProject`、`getRelease`
- `listEvents`、`listIssues`、`listOrganizations`、`listProjects`、`listReleases`、`listTeams`
- `updateIssue`、`updateOrganization`、`updateProject`、`updateRelease`、`updateTeam`

`createIssue` および `createOrganization` は、Sentry が公開 REST Endpoint をドキュメント化していないため、公開されていません。

## Common Fields

| Field | Description |
| --- | --- |
| Credential | 使用する Sentry Credential |
| Operation | 実行する Sentry アクション |
| Organization Slug | 組織の更新、およびプロジェクト、チーム、Issue、イベント、リリース操作に使用する Sentry 組織の slug |
| Project Slug | プロジェクトの取得/更新/削除、およびイベント操作に使用するプロジェクト slug。Issue フィルターにはプロジェクト slug または ID |
| Team Slug | プロジェクトの作成、およびチームの更新/削除操作に使用するチーム slug |
| Issue ID | Issue の取得/更新/削除操作に使用する Issue ID |
| Event ID | イベント検索操作に使用する Event ID |
| Release Version | リリースの取得/更新/削除操作に使用するリリースバージョン |
| Name | 作成操作におけるプロジェクトまたはチームの名前 |
| Slug | 作成操作における任意のプロジェクトまたはチーム slug |
| Platform | プロジェクト作成における任意の Sentry platform |
| Status / Assigned To | Issue 更新フィールド。`updateIssue` では少なくとも 1 つが必須です |
| Query | Sentry 検索クエリ。未解決の Issue を対象とする場合は省略し、すべての Issue を取得する場合は空文字列を設定します |
| Limit | リスト操作の結果上限。合計 1,000 件までに制限されます |
| Release Projects JSON | リリース作成に使用するプロジェクト slug の JSON 配列 |
| Release Refs JSON | リリース作成に使用するリポジトリ/コミットオブジェクトの JSON 配列 |
| Payload JSON | 組織、プロジェクト、リリース、チームの更新操作に使用する JSON オブジェクト |

## Examples

未解決の Issue をリストする:

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

Issue を解決する:

```json
{
  "sentryOperation": "updateIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id",
  "sentryStatus": "resolved"
}
```

Issue を削除する:

```json
{
  "sentryOperation": "deleteIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id"
}
```

リリースを作成する:

```json
{
  "sentryOperation": "createRelease",
  "sentryOrganizationSlug": "acme",
  "sentryReleaseVersion": "web-app@1.2.3",
  "sentryReleaseProjects": "[\"web-app\"]"
}
```

プロジェクトを更新する:

```json
{
  "sentryOperation": "updateProject",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryPayload": "{\"name\":\"Web App\"}"
}
```

## Outputs

リスト操作は `success`、`operation`、`count`、および `organizations`、`projects`、`teams`、`issues`、`events`、`releases` などの該当するコレクションを返します。単一リソース操作は `organization`、`issue`、`event`、`release`、`project`、`team` を返します。削除操作は、該当するリソースキーとともに `deleted: true` および識別用フィールドを返します。
