# Jira

Node **Jira** kết nối workflow với Jira REST API để tự động hóa project, issue, comment, attachment, user, notification và transition. Thao tác mặc định là **Search Issues**.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Credential | Jira (Cloud email/API token, Data Center username/password hoặc personal access token, base URL, deployment mode, REST API version tùy chọn) |
| Output | `$nodeLabel.*` |

## Credential

Tạo credential **Jira** trong [Credentials Tab](../tabs/credentials-tab.md). Các config key được lưu là `email`, `api_token`, `base_url`, `deployment`, `auth_mode`, và `api_version` tùy chọn. Đối với Jira Cloud, `email` lưu email tài khoản Atlassian và `api_token` lưu Atlassian API token. Đối với Jira Data Center / Server, các key tương tự lưu username và password Basic auth, hoặc với `auth_mode: pat`, `api_token` lưu trữ personal access token được gửi dưới dạng Bearer token và `email` không được sử dụng. Xem [Third-Party Integrations](../reference/integrations.md#jira) để biết các bước thiết lập.

| Trường | Config key | Mô tả |
| --- | --- | --- |
| Jira Email / Username | `email` | Email tài khoản Atlassian của Jira Cloud, hoặc username Jira Data Center / Server |
| Xác thực | `auth_mode` | `basic` (mặc định) hoặc `pat` (chỉ dành cho Data Center / Server) |
| API Token / Password / Personal Access Token | `api_token` | Atlassian API token của Jira Cloud, password Jira Data Center / Server cho Basic auth, hoặc personal access token của Data Center ở chế độ `pat` |
| Base URL | `base_url` | URL site Jira, ví dụ `https://your-domain.atlassian.net` |
| Deployment | `deployment` | `cloud` cho Jira Cloud hoặc `data_center` cho Jira Data Center / Server |
| REST API Version | `api_version` | Mặc định là `3` cho Jira Cloud. Data Center / Server sử dụng REST API v2 |

Personal access token yêu cầu Jira Data Center / Server 8.14 trở lên. Chuyển đổi phương thức xác thực sẽ xóa secret đã lưu trữ, vì vậy hãy nhập mật khẩu hoặc token mới khi bạn chuyển đổi.

Sử dụng **Test Connection** để xác minh credential với user Jira hiện tại.

## Các thao tác

| Thao tác | Trường bắt buộc | Output |
| --- | --- | --- |
| Get Myself | — | `user` |
| List Projects | Limit, Start At tùy chọn | `projects`, `count`, `pagination` |
| Search Issues | JQL, Issue Fields, Limit, Next Page Token, Start At tùy chọn | `issues`, `count`, `pagination` |
| Get Issue | Issue Key hoặc ID | `issue`, `key` |
| Create Issue | Project Key, Summary | `issue`, `key` |
| Update Issue | Issue Key hoặc ID và ít nhất một trường đã thay đổi | `issue`, `key` |
| Delete Issue | Issue Key hoặc ID | `deleted` |
| Get Issue Changelog | Issue Key hoặc ID; Limit, Start At tùy chọn | `changelog`, `count`, `pagination` |
| Notify Issue | Issue Key hoặc ID, Subject, Text Body | `notified` |
| List Comments | Issue Key hoặc ID; Limit, Start At tùy chọn | `comments`, `count`, `pagination` |
| Create Comment | Issue Key hoặc ID, Comment Body | `comment` |
| Get Comment | Issue Key hoặc ID, Comment ID | `comment` |
| Update Comment | Issue Key hoặc ID, Comment ID, Comment Body | `comment` |
| Delete Comment | Issue Key hoặc ID, Comment ID | `deleted` |
| Add Attachment | Issue Key hoặc ID, Filename, nội dung Base64 | `attachments`, `count` |
| Get Attachment | Attachment ID; Include Binary tùy chọn | `attachment` |
| List Attachments | Issue Key hoặc ID; Limit, Start At, Include Binary tùy chọn | `attachments`, `count`, `pagination` |
| Delete Attachment | Attachment ID | `deleted` |
| List Transitions | Issue Key hoặc ID | `transitions`, `count` |
| Transition Issue | Issue Key hoặc ID, Transition ID | `transition`, `issue`, `key` |
| Get User | Account ID / Username | `user` |
| Create User | User Email | `user` |
| Delete User | Account ID / Username | `deleted` |

Các trường văn bản hỗ trợ biểu thức có thể dùng [expressions](../reference/expression-dsl.md) như `$input.text`. `jiraIncludeBinary` là một boolean toggle và không hỗ trợ biểu thức, nhưng có thể được đánh dấu là do agent cung cấp khi node Jira được gắn vào Agent tool handle.

## Trường issue và update

- **Project Key** là project key viết tắt như `ENG`. Sử dụng List Projects để tìm các key.
- **Issue Key hoặc ID** chấp nhận các key như `ENG-123` hoặc ID issue dạng số. Sử dụng Search Issues hoặc List Projects để tìm các giá trị.
- **Transition ID** đến từ List Transitions. Mỗi đối tượng transition bao gồm một trường `id`.
- **Comment ID** và **Attachment ID** đến từ List Comments, List Attachments, hoặc các phản hồi create/get trước đó.
- **Account ID / Username** là giá trị `accountId` của Jira Cloud hoặc username Jira Data Center / Server. Get Myself hoặc Get User có thể giúp bạn tìm ra nó.
- Văn bản **description** của issue và **body** của comment được gửi dưới dạng Atlassian Document Format trên REST
  API v3; khi deployment của credential là Data Center / Server, chúng được gửi dưới dạng plain text.
  Trong v3, ký tự xuống dòng trở thành các đoạn văn riêng biệt.
- **Get Issue Changelog** sử dụng endpoint changelog phân trang của Jira Cloud. Đối với Data Center / Server, nó đọc dữ liệu changelog issue đã mở rộng và áp dụng offset/limit đã cấu hình cho các history được trả về.
- Trên **Update Issue**, để trống các trường tùy chọn để giữ nguyên giá trị hiện tại của chúng.
- Đặt **Description** hoặc **Assignee Account ID / Username** thành `null` khi update để xóa các trường đó. Labels không thể bị xóa bằng `null`.
- **Recipients JSON** trên Notify Issue mặc định là `{"assignee":true}` khi bị bỏ qua. Các key phổ biến bao gồm `assignee`, `reporter`, `watchers`, và `voters` (ví dụ `{"assignee":true,"watchers":true}`).
- **Add Attachment** chấp nhận nội dung base64 thô hoặc data URL và bị giới hạn bởi cài đặt kích thước file của nền tảng (mặc định 99 MB).
## Phân trang

- **Search Issues** sử dụng phân trang dạng cursor thông qua `jiraNextPageToken` cho Jira Cloud. Đọc `pagination.nextPageToken` từ lần chạy trước và truyền vào node Search Issues tiếp theo.
- **Search Issues** sử dụng phân trang dạng offset thông qua `jiraStartAt` cho Jira Data Center / Server. Đọc `pagination.startAt`, `pagination.maxResults`, và `pagination.total` để tính trang tiếp theo.
- **List Projects**, **Get Issue Changelog**, **List Comments**, và **List Attachments** sử dụng phân trang dạng offset với `jiraLimit` và `jiraStartAt`. Kết quả phân trang trả về `pagination.startAt`, `pagination.maxResults`, `pagination.total`, và `pagination.isLast`.
- **List Attachments** tải tất cả tệp đính kèm từ issue trước, sau đó cắt kết quả ở phía client. Các trường phân trang vẫn mô tả trang được trả về, nhưng các issue lớn có thể phát sinh thêm chi phí tải dữ liệu.
- **List Transitions** không hỗ trợ phân trang.

## Các trường chính

| Trường | Được sử dụng bởi | Ghi chú |
| --- | --- | --- |
| `credentialId` | Tất cả thao tác | UUID của Jira credential được sở hữu |
| `jiraOperation` | Tất cả thao tác | Mặc định là `searchIssues` |
| `jiraProjectKey` | Create Issue | Project key ví dụ như `ENG` |
| `jiraIssueKey` | Các thao tác issue, comment, attachment, notification, và transition | Issue key ví dụ như `ENG-123` hoặc ID issue dạng số |
| `jiraIssueType` | Create Issue | Mặc định là `Task` |
| `jiraIssueTypeId` | Create Issue | ID loại issue tùy chọn; ghi đè `jiraIssueType` khi được thiết lập |
| `jiraSummary` | Create/Update Issue | Bắt buộc đối với Create Issue |
| `jiraDescription` | Create/Update Issue | Được gửi dưới dạng ADF trên REST API v3 hoặc văn bản thuần trên REST API v2; dùng `null` khi cập nhật để xóa mô tả |
| `jiraJql` | Search Issues | Mặc định là `updated >= -30d ORDER BY updated DESC` |
| `jiraFields` | Search Issues | Mảng JSON hoặc danh sách trường issue phân tách bằng dấu phẩy; mặc định là `key`, `summary`, `status`, `assignee`, và `issuetype` khi để trống |
| `jiraAssigneeAccountId` | Create/Update Issue | accountId của Jira Cloud hoặc username của Data Center / Server; dùng `null` khi cập nhật để xóa người được gán |
| `jiraLabels` | Create/Update Issue | Mảng JSON hoặc văn bản phân tách bằng dấu phẩy |
| `jiraCommentBody` | Create/Update Comment | Được gửi dưới dạng ADF trên REST API v3 hoặc văn bản thuần trên REST API v2 |
| `jiraCommentId` | Get/Update/Delete Comment | ID comment của Jira |
| `jiraTransitionId` | Transition Issue | Khám phá bằng List Transitions |
| `jiraAttachmentId` | Get/Delete Attachment | ID tệp đính kèm của Jira |
| `jiraAttachmentFilename` | Add Attachment | Tên tệp được tải lên |
| `jiraAttachmentBase64` | Add Attachment | Nội dung base64 thô hoặc data URL; chịu giới hạn kích thước tệp |
| `jiraAttachmentMimeType` | Add Attachment | MIME type tùy chọn; được suy ra từ tên tệp khi để trống |
| `jiraIncludeBinary` | Get/List Attachment | Toggle boolean; thêm `content_base64` khi được bật |
| `jiraNotifySubject` | Notify Issue | Tiêu đề thông báo bắt buộc |
| `jiraNotifyTextBody` | Notify Issue | Nội dung thông báo dạng văn bản thuần bắt buộc |
| `jiraNotifyHtmlBody` | Notify Issue | Nội dung HTML tùy chọn |
| `jiraNotifyTo` | Notify Issue | JSON người nhận; mặc định là `{"assignee":true}` |
| `jiraAccountId` | Get/Delete User | accountId của Jira Cloud hoặc username của Data Center / Server |
| `jiraUserEmail` | Create User | Địa chỉ email người dùng mới |
| `jiraUsername` | Create User | Username tùy chọn của Data Center / Server; mặc định dùng `jiraUserEmail` |
| `jiraUserDisplayName` | Create User | Tên hiển thị tùy chọn |
| `jiraUserProducts` | Create User | Mảng JSON hoặc danh sách product key phân tách bằng dấu phẩy; chỉ dành cho Jira Cloud |
| `jiraLimit` | Search Issues, List Projects, Get Issue Changelog, List Comments, List Attachments | Mặc định là `50`; phạm vi 1–100 |
| `jiraStartAt` | Search Issues trên Data Center / Server, List Projects, Get Issue Changelog, List Comments, List Attachments | Chỉ số bắt đầu của phân trang dạng offset |
| `jiraNextPageToken` | Search Issues trên Jira Cloud | Token cursor từ phản hồi tìm kiếm trước đó |

## Ví dụ

Tạo một issue từ dữ liệu đầu vào thượng nguồn:

- Operation: `createIssue`
- Project Key: `ENG`
- Issue Type: `Task`
- Summary: `$input.title`
- Description: `$input.description`
- Labels: `["automation"]`

Cập nhật một issue và xóa người được gán:

- Operation: `updateIssue`
- Issue Key or ID: `ENG-123`
- Summary: `$input.title`
- Assignee Account ID / Username: `null`

Tìm kiếm issue với các trường tùy chỉnh và phân trang dạng cursor:

- Operation: `searchIssues`
- JQL: `project = ENG AND updated >= -30d ORDER BY updated DESC`
- Issue Fields: `["key","summary","status"]`
- Limit: `25`
- Next Page Token: `$searchJira.pagination.nextPageToken`

Tìm kiếm issue trên Data Center với phân trang dạng offset:

- Operation: `searchIssues`
- JQL: `project = ENG ORDER BY updated DESC`
- Limit: `25`
- Start At: `25`

Chuyển trạng thái một issue sau khi liệt kê các transition khả dụng:

- Operation: `listTransitions`
- Issue Key or ID: `ENG-123`
- Sau đó chạy **Transition Issue** với Transition ID: `$listTransitions.transitions[0].id`

Thông báo cho người theo dõi về cập nhật của issue:

- Operation: `notifyIssue`
- Issue Key or ID: `ENG-123`
- Subject: `Issue updated`
- Text Body: `$input.text`
- Recipients JSON: `{"assignee":true,"watchers":true}`
## Đầu ra

Mỗi thao tác thành công sẽ thiết lập:

- `$jira.success`
- `$jira.operation`

**Get Myself** cung cấp `user`.

**Các thao tác danh sách phân trang** cung cấp `count`, một trường collection và `pagination`:

| Thao tác | Khóa collection | Cấu trúc pagination |
| --- | --- | --- |
| List Projects | `projects` | `{ startAt, maxResults, total, isLast }` |
| Search Issues | `issues` | Cloud: `{ maxResults, nextPageToken, isLast }`; Data Center: `{ startAt, maxResults, total, isLast }` |
| Get Issue Changelog | `changelog` | `{ startAt, maxResults, total, isLast }` |
| List Comments | `comments` | `{ startAt, maxResults, total, isLast }` |
| List Attachments | `attachments` | `{ startAt, maxResults, total, isLast }` |

**List Transitions** cung cấp `transitions` và `count` mà không có pagination.

**Các thao tác thay đổi và đọc Issue** cung cấp payload của Jira issue cùng với `key` khi có thể áp dụng.

**Comment** get/create/update cung cấp `comment`; delete cung cấp `deleted`.

**Transition Issue** cung cấp `transition` dưới dạng `{ transitionId }`, cùng với `issue` và `key` đã được làm mới.

**Attachment add** cung cấp `attachments` và `count`. **Get Attachment** cung cấp `attachment`; **List Attachments** cung cấp `attachments`, `count` và `pagination`. Khi **Include Binary** được bật, mỗi đối tượng attachment có thể bao gồm `content_base64`. Delete cung cấp `deleted`.

**User** get/create cung cấp `user`; delete cung cấp `deleted`.

**Notify Issue** cung cấp `notified`.

Các mẫu truy cập phổ biến:

- `$searchJira.issues[0].key`
- `$searchJira.pagination.nextPageToken`
- `$createJiraIssue.key`
- `$listTransitions.transitions[0].id`
- `$getAttachment.attachment.content_base64`

## Liên quan

- [Credentials Tab](../tabs/credentials-tab.md)
- [Third-Party Integrations](../reference/integrations.md#jira)
- [Node Types](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
