# GitHub

Node **GitHub** bổ sung các thao tác GitHub REST gốc vào workflow, tương tự như các node GitHub đa thao tác mà bạn có thể đã biết từ các công cụ như n8n.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1 |
| Credential | GitHub |
| Đầu ra | `$nodeLabel.*` |

## Các thao tác được hỗ trợ

Node hiện cung cấp 40 hành động:

| Tài nguyên | Hành động |
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

Tạo một credential **GitHub** trong [Credentials Tab](../tabs/credentials-tab.md) với:

- Một personal access token
- URL cơ sở REST API đầy đủ tùy chọn cho GitHub Enterprise Server

Để trống URL cơ sở đối với GitHub.com. Nên sử dụng PAT dạng fine-grained.

Đối với GitHub Enterprise Server, hãy nhập endpoint REST API đầy đủ bao gồm `/api/v3`, ví dụ
`https://github.example.com/api/v3`. Không chỉ nhập gốc web UI
(`https://github.example.com`).

Nếu bạn sử dụng GitHub Enterprise Server và sau đó chỉnh sửa credential để xoay token, việc để trống
`base_url` sẽ giữ nguyên endpoint Enterprise hiện có. Chỉ nhập URL mới khi bạn muốn
thay đổi endpoint đó.

## Các trường chung

Hầu hết các thao tác sử dụng:

- **Owner** – Chủ sở hữu repository, tên tổ chức hoặc tên người dùng
- **Repository** – Tên repository

`List Organization Repositories` chỉ yêu cầu **Owner** (tên tổ chức) và không sử dụng trường repository.

`List User Repositories` chỉ yêu cầu **Owner** (tên người dùng) và không sử dụng trường repository.

`Get User Repositories` phản chiếu hành động User → Get Repositories của n8n. `Get User Issues` trả về
các issue được gán cho người dùng GitHub đã xác thực theo mặc định. Đặt **Mentioned Filter** thành bất kỳ
giá trị không rỗng nào để thay vào đó trả về các issue có đề cập đến người dùng đã xác thực. Nó cũng hỗ trợ
các bộ lọc state, labels, updated-since, sort, direction và per-page. `Invite User` yêu cầu một
tổ chức và địa chỉ email và không sử dụng Owner hoặc Repository.

## Repository

Các thao tác Repository bao gồm metadata, nội dung giấy phép được phát hiện, hồ sơ sức khỏe cộng đồng và
thông tin chi tiết về lưu lượng truy cập. `List Popular Paths for Repository` và
`List Top Referrers for Repository` trả về các mục lưu lượng truy cập hàng đầu của GitHub trong 14 ngày qua và
yêu cầu quyền push quản trị repository.

`List Issues` hỗ trợ các bộ lọc tùy chọn assignee, creator, mentioned user, labels phân tách bằng dấu phẩy,
updated-since timestamp, sort và direction. `List Pull Requests` hỗ trợ các điều khiển state, sort,
direction và per-page.

`Get Repository Issues` và `Get Repository Pull Requests` hiển thị cùng các API như các đối tác List
của chúng dưới các tên hành động repository tương thích n8n rõ ràng.

### Lấy metadata Repository

`Get Repository` lưu trữ phản hồi đầy đủ của GitHub trong `$github.repository` và cũng hiển thị
`$github.full_name`, `$github.default_branch`, `$github.private` và `$github.url`.

Payload repository thường bao gồm:

- Danh tính và quyền sở hữu: ID, tên, tên đầy đủ, mô tả, chủ sở hữu và khả năng hiển thị
- Trạng thái repository: private, fork, archived, disabled và default branch
- URL: trang GitHub, API, clone, SSH và Git URL
- Hoạt động và kích thước: dấu thời gian tạo, cập nhật và push, kích thước, stars, watchers, forks, subscribers và open issues
- Tính năng: issues, projects, wiki, Pages, discussions, topics, language và homepage
- Giấy phép, cài đặt merge, quyền của người gọi, cài đặt bảo mật và metadata fork parent/source khi có sẵn

Một số trường quản trị, quyền, merge và bảo mật phụ thuộc vào quyền repository
của credential.

Ví dụ:

- Owner: `heymrun`
- Repository: `heym`

## Issues

Các thao tác Issue hỗ trợ các trường title/body và các trường mảng JSON tùy chọn cho labels và assignees.

`List Issues` chỉ trả về các issue của repository. Pull request bị loại trừ; sử dụng `List Pull Requests` cho kết quả PR.

```json
["bug", "backend"]
```

```json
["octocat"]
```

### Ngữ nghĩa trường Edit Issue

Đối với `Edit Issue`, chỉ những trường bạn đặt rõ ràng mới được gửi đến GitHub:

- **State** – Chọn `Don't change`, `Open` hoặc `Closed`. Để trống để giữ nguyên trạng thái hiện tại.
- **State Reason** – Tùy chọn đặt `Completed`, `Not Planned`, `Duplicate` hoặc `Reopened`.
- **Title / Body** – Để trống để giữ nguyên giá trị hiện tại.
- **Labels / Assignees** – Để trống trường để giữ nguyên giá trị hiện tại. Sử dụng `[]` để xóa tất cả labels hoặc assignees. Sử dụng mảng JSON như `["bug"]` để thay thế chúng.

`Edit Issue` yêu cầu ít nhất một trường được thay đổi tại thời điểm chạy. Nếu bạn chỉ cung cấp số issue, quá trình thực thi sẽ thất bại với lỗi xác thực từ lớp GitHub API.
## Khóa Issue

`Lock Issue` chấp nhận một **Lý do khóa** tùy chọn. Khi được cung cấp, giá trị phải là một trong các giá trị được GitHub hỗ trợ:

- `off-topic`
- `too heated`
- `resolved`
- `spam`

Để trống lý do để khóa mà không có lý do cụ thể.

## Pull Requests

Tạo PR yêu cầu:

- Tiêu đề
- Nhánh head
- Nhánh base
- Nội dung tùy chọn
- Chế độ draft tùy chọn

## Pull Request Reviews

Các thao tác review khớp với API review pull request của GitHub:

| Thao tác | Trường bắt buộc | Trường tùy chọn |
|-----------|-----------------|-----------------|
| `Create Review` | Số pull request, event | Body, commit ID |
| `Get Review` | Số pull request, review ID | — |
| `List Reviews` | Số pull request | Per page |
| `Update Review` | Số pull request, review ID, body | — |

`Create Review` hỗ trợ `Approve`, `Request Changes`, `Comment` và `Pending`.
Body là bắt buộc đối với `Request Changes` và `Comment`. Khi Commit ID để trống, GitHub
sẽ review commit mới nhất của pull request.

## Releases

| Thao tác | Trường bắt buộc khi chạy | Thường tùy chọn |
|-----------|---------------------------|-------------------|
| `Create Release` | Tên tag | Tên release (tiêu đề), body, nhánh target, draft, prerelease |
| `Update Release` | Release ID | Tên tag, tên release, body, nhánh target, draft, prerelease |
| `Get Release` / `Delete Release` | Release ID | — |

`Update Release` có thể đặt rõ ràng `draft` / `prerelease` thành `true` hoặc `false`.

## Workflows

Các thao tác workflow hỗ trợ:

- Liệt kê các workflow của repository
- Lấy một workflow theo ID số hoặc tên tệp workflow
- Bật hoặc tắt một workflow
- Đọc mức sử dụng workflow có thể tính phí theo hệ điều hành của runner
- Dispatch một workflow với ref hoặc branch cùng đối tượng inputs JSON tùy chọn

GitHub đang trong quá trình ngừng cung cấp endpoint `Get Workflow Usage`. Các workflow sử dụng
thao tác này có thể cần migrate khi GitHub loại bỏ endpoint.

`Dispatch Workflow` chấp nhận cả hai dạng phản hồi của GitHub: `204 No Content` cũ và phản hồi
`200` mới hơn chứa `workflow_run_id`, `run_url` và `html_url`.

`Dispatch Workflow and Wait` dispatch workflow và poll run cho đến khi trạng thái của nó là
`completed`. Cấu hình timeout và khoảng thời gian poll tính bằng giây. Heym sử dụng
`workflow_run_id` khi GitHub trả về phản hồi `200` mới hơn. Đối với phản hồi `204 No
Content` truyền thống, Heym phát hiện run `workflow_dispatch` mới được tạo cho workflow và ref
đã chọn, sau đó chờ run đó.

## File Contents

`Get File` đọc một tệp trong repository thông qua API contents của GitHub và giải mã nội dung văn bản khi có sẵn. Các tệp nhị phân và nội dung không phải UTF-8 có thể trả về metadata mà không có trường `content` được giải mã.

`List Files` trả về các mục trong thư mục từ API contents của repository cho một đường dẫn thư mục và ref tùy chọn. Để trống **Directory Path** để liệt kê thư mục gốc của repository.

`Create or Update File` ghi nội dung văn bản vào một đường dẫn trong repository bằng cách sử dụng:

- Đường dẫn tệp
- Commit message
- Nội dung tệp
- Branch tùy chọn

`Delete File` xóa một đường dẫn trong repository bằng commit message và branch tùy chọn. Nếu tệp tồn tại, Heym tự động lấy SHA hiện tại trước khi xóa nó.

Nếu tệp đã tồn tại, Heym tự động lấy SHA hiện tại trước khi cập nhật nó.

## Pagination

`List Issues`, `Get Repository Issues`, `Get User Issues`, `List Pull Requests`,
`Get Repository Pull Requests`, `List Reviews`, `List Releases`, `List Workflows`,
`List Organization Repositories`, `List User Repositories` và `Get User Repositories` hỗ trợ
**Per Page** (1–100). Heym yêu cầu một trang kết quả; không có trường `page` để lấy
thêm các trang trong cùng một thao tác.

## Output

Hình dạng chính xác phụ thuộc vào thao tác được chọn. Các trường phổ biến bao gồm:

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

Thay thế `github` bằng nhãn node của bạn.

## Notes

- Labels và assignees phải là mảng JSON hợp lệ khi được cung cấp.
- Inputs của workflow dispatch phải là đối tượng JSON hợp lệ khi được cung cấp.
- `Edit Issue` chỉ sử dụng `state` khi bạn đặt nó một cách rõ ràng; để nó không được đặt để giữ nguyên trạng thái issue hiện tại.
- Quyền của GitHub API phụ thuộc vào token scopes hoặc quyền repository chi tiết mà bạn cấp.

## Related

- [Credentials Tab](../tabs/credentials-tab.md) – Thêm và quản lý thông tin xác thực GitHub
- [Third-Party Integrations](../reference/integrations.md) – Thiết lập thông tin xác thực GitHub và `base_url` cho Enterprise
- [Agent Node](./agent-node.md) – Sử dụng thông tin xác thực GitHub với `@modelcontextprotocol/server-github`
- [Node Types](../reference/node-types.md) – Danh mục node đầy đủ
