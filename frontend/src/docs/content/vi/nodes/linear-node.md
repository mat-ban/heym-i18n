# Linear

Node **Linear** kết nối workflow với Linear GraphQL API để tự động hóa issue và workspace.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1 |
| Credential | Linear personal API key hoặc OAuth2 |
| Đầu ra | `$nodeLabel.*` |

## Credential

Tạo credential **Linear** trong [Credentials Tab](../tabs/credentials-tab.md). Chọn một
chế độ xác thực:

**Personal API key**

1. Trong Linear, mở **Settings → Security & Access → Personal API keys**.
2. Tạo một key có quyền truy cập vào workspace bạn muốn tự động hóa.
3. Dán key vào credential Linear mới trong Heym và sử dụng **Test Connection** để xác minh.

**OAuth2**

1. Tạo một ứng dụng Linear OAuth.
2. Đăng ký `{FRONTEND_URL}/api/credentials/linear/oauth/callback` làm redirect URI.
3. Trong Heym, chọn **OAuth2**, nhập Client ID và Client Secret, sau đó nhấp **Connect**.

Personal API key và OAuth token hoạt động với tư cách người dùng đã tạo hoặc ủy quyền chúng.

## Các thao tác

| Thao tác | Trường bắt buộc | Đầu ra |
|-----------|-----------------|--------|
| Get Viewer | — | `viewer` |
| List Teams | Limit; tùy chọn After Cursor | `teams`, `count`, `pageInfo` |
| List Projects | Limit; tùy chọn After Cursor | `projects`, `count`, `pageInfo` |
| List Issues | Limit; tùy chọn Team ID, Project ID, After Cursor | `issues`, `count`, `pageInfo` |
| List Workflow States | Team ID | `states`, `count` |
| List Team Members | Team ID, Limit; tùy chọn After Cursor | `members`, `count`, `pageInfo` |
| Get Issue | Issue ID hoặc identifier như `ENG-123` | `issue`, `identifier`, `url` |
| Create Issue | Team ID, Title | `issue`, `identifier`, `url` |
| Update Issue | Issue ID hoặc identifier và ít nhất một trường được thay đổi | `issue`, `identifier`, `url` |
| Delete Issue | Issue ID hoặc identifier | `deleted` |
| Add Issue Link | Issue ID hoặc identifier, Link URL | `link` |
| Create Comment | Issue ID hoặc identifier, Comment Body | `comment` |
| List Comments | Issue ID hoặc identifier, Limit; tùy chọn After Cursor | `comments`, `count`, `pageInfo` |
| Update Comment | Comment ID, Comment Body | `comment` |
| Delete Comment | Comment ID | `deleted`, `entityId` |
| Resolve Comment | Comment ID | `comment` |
| Unresolve Comment | Comment ID | `comment` |

Tất cả trường văn bản đều hỗ trợ [expressions](../reference/expression-dsl.md).

## Các trường của Issue

- **Team ID** và **Project ID** là các UUID của Linear. Sử dụng List Teams hoặc List Projects để tìm chúng.
- **State ID** là UUID của workflow-state được dùng khi tạo hoặc cập nhật issue. Sử dụng List Workflow States để tìm nó.
- **Assignee ID** là UUID người dùng Linear. Sử dụng List Team Members để tìm nó.
- **Priority** chấp nhận `0` đến `4`: không ưu tiên, khẩn cấp, cao, bình thường và thấp.
- Để trống các trường cập nhật tùy chọn để giữ nguyên giá trị hiện tại của chúng.
- Đặt một trường cập nhật thành `null` để xóa description, project, assignee hoặc state.
- **Link URL** thêm một liên kết đính kèm bên ngoài vào issue.
- **Comment ID** là UUID của Linear cho một comment hiện có. Sử dụng List Comments để tìm nó.
- **Parent Comment ID** trả lời một comment Linear hiện có khi tạo comment.

## Phân trang

Các thao tác List có thể trả về một trang hoặc tự động tải tất cả các trang:

- Để **Return All** tắt để sử dụng `Limit` và `After Cursor` thủ công.
- Bật **Return All** để theo dõi cursor của Linear phía server, tối đa 10.000 kết quả.

Kết quả phân trang trả về `pageInfo.hasNextPage` và `pageInfo.endCursor`. Truyền cursor vào
**After Cursor** ở lần chạy node tiếp theo để tải trang kế tiếp khi **Return All** tắt.

## Ví dụ

Tạo issue từ đầu vào thượng nguồn:

- Operation: `Create Issue`
- Team ID: `team UUID`
- Title: `$input.title`
- Description: `$input.description`
- Priority: `2`

Thêm comment vào issue đã tạo:

- Operation: `Create Comment`
- Issue ID: `$createLinearIssue.issue.id`
- Comment Body: `$input.comment`
- Parent Comment ID: tùy chọn, khi trả lời một comment khác

Giải quyết một chuỗi comment:

- Operation: `Resolve Comment`
- Comment ID: `$listComments.comments[0].id`

Thêm liên kết bên ngoài vào issue:

- Operation: `Add Issue Link`
- Issue ID: `$createLinearIssue.issue.id`
- Link URL: `$input.url`

Phân trang qua các thành viên nhóm:

- Operation: `List Team Members`
- Team ID: `$listTeams.teams[0].id`
- Limit: `50`
- After Cursor: `$listTeamMembers.pageInfo.endCursor` ở lần chạy tiếp theo khi `hasNextPage` là true

Tìm các workflow state ID trước khi cập nhật issue:

- Operation: `List Workflow States`
- Team ID: `$listTeams.teams[0].id`
- Sau đó sử dụng `$listStates.states[0].id` làm **State ID** trong **Update Issue**

## Đầu ra

Mọi thao tác thành công đều đặt:

- `$linear.success`
- `$linear.operation`

Các thao tác List cũng hiển thị `count` và, khi áp dụng, `pageInfo`. Các thao tác Issue hiển thị
payload issue đầy đủ của Linear và các trường tiện lợi như `identifier` và `url`.
Các mutation Comment hiển thị payload `comment` đầy đủ, ngoại trừ Delete Comment, hiển thị
`deleted` và `entityId`.

## Liên quan

- [Credentials Tab](../tabs/credentials-tab.md)
- [Node Types](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
