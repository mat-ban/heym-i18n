# OpenCode Go

Node **OpenCode Go** chạy CLI [OpenCode](https://opencode.ai) (Go) trong một container Heym biệt lập, được gia cố bảo mật, thao tác trên một kho lưu trữ GitHub. Giống như node Codex, node này được thiết kế cho các tác vụ lập trình như sửa test, chỉnh sửa tệp, tạo bản vá (patch), hoặc mở pull request — nhưng nó sử dụng cổng model **OpenCode Go** không phụ thuộc nhà cung cấp thay vì OpenAI Codex.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1 |
| Credential | OpenCode Go API key + GitHub |
| Đầu ra | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Xác thực

Credential **OpenCode Go** lưu trữ **API key** của cổng OpenCode Go (từ [opencode.ai/go](https://opencode.ai/go)) và một **Gateway Base URL** tùy chọn (mặc định là `https://opencode.ai/zen/go/v1`; chỉ ghi đè khi dùng cổng tự lưu trữ hoặc qua proxy).

Node cũng yêu cầu credential **GitHub** để clone các kho lưu trữ riêng tư, push nhánh làm việc, và tạo pull request. Token GitHub **không bao giờ được đặt bên trong container sandbox** — Heym thực hiện mọi thao tác git và GitHub trên máy chủ, do đó mã được tạo ra không thể đánh cắp thông tin xác thực push.

## Cô lập và bảo mật

Việc cô lập thực thi được chọn bởi `HEYM_OPENCODE_CLI_COMMAND`, hoàn toàn giống node Codex:

- **Phát triển cục bộ (`run.sh`)** giữ nguyên giá trị mặc định `opencode`, nên OpenCode chạy như một tiến trình con trên máy chủ đối với workspace đã clone — không cần Docker, không cần cờ bổ sung.
- **Triển khai Docker (`deploy.sh` và image GHCR đơn lẻ)** đặt nó thành `/usr/local/bin/heym-opencode-docker`, một wrapper chạy `opencode run` bên trong một **container anh em dùng một lần, được gia cố bảo mật** chia sẻ volume có tên OpenCode workspace.

Container runner được gia cố sẽ loại bỏ toàn bộ Linux capabilities, đặt `no-new-privileges`, sử dụng root chỉ đọc với tmpfs `/tmp`, và áp dụng giới hạn pid/memory/CPU. Lưu lượng mạng ra ngoài được cho phép (OpenCode phải kết nối được tới cổng model). **Token GitHub không bao giờ được đặt bên trong container** — mọi thao tác git và GitHub đều chạy phía máy chủ, nên chỉ có OpenCode API key và các tệp kho lưu trữ là nằm bên trong.

OpenCode chỉ chỉnh sửa tệp trên đĩa; Heym chịu trách nhiệm mọi hành động git/GitHub.

## Model

Danh sách model của OpenCode Go thay đổi thường xuyên, nên trường **Model** được điền trực tiếp từ danh sách model của cổng (`GET https://opencode.ai/zen/go/v1/models`) và hiển thị dưới dạng dropdown có thể tìm kiếm. Nếu danh sách trực tiếp không khả dụng, một danh sách dự phòng tích hợp sẽ được sử dụng. Id model dùng dạng `opencode-go/<model>` (ví dụ `opencode-go/kimi-k3`, `opencode-go/deepseek-v4-pro`, `opencode-go/qwen3.7-max`) — `opencode-go` là id nhà cung cấp của CLI OpenCode cho cổng Go. Để trống trường này để dùng mặc định của runner (`opencode-go/kimi-k3`). Các id model được lưu ở dạng cũ `opencode/<model>` sẽ được tự động viết lại khi chạy.

## Các trường

| Trường | Mô tả |
|-------|-------------|
| OpenCode Go Credential | Credential OpenCode Go (API key của cổng) |
| GitHub Credential | Credential GitHub PAT dùng để truy cập kho lưu trữ |
| Repository URL | URL kho lưu trữ GitHub dạng HTTPS; hỗ trợ biểu thức |
| Base Branch | Nhánh để clone trước khi OpenCode chạy, mặc định `main` |
| Model | Model OpenCode Go (dropdown có thể tìm kiếm trực tiếp, `opencode-go/<model>`); để trống sẽ dùng mặc định của runner |
| Reasoning Variant | Tùy chọn; ánh xạ tới `opencode run --variant` cho các model hỗ trợ reasoning effort |
| Task Prompt | Tác vụ lập trình cho OpenCode; hỗ trợ biểu thức như `$input.text` |
| Publish Mode | Cách các thay đổi được gửi đi (xem bảng bên dưới) |
| Branch Name | Nhánh làm việc cho chế độ PR/commit, mặc định `opencode/$executionId` |
| Timeout | Thời gian thực thi OpenCode tối đa tính bằng giây |

## Các chế độ Publish

| Chế độ | Chức năng |
|------|--------------|
| `diff_only` | Chỉnh sửa tệp cục bộ và trả về bản vá cùng các tệp đã thay đổi. Không push gì cả. |
| `draft_pr` | Commit lên nhánh, push nhánh đó, và mở một draft pull request. |
| `open_pr` | Commit lên nhánh, push nhánh đó, và mở một pull request sẵn sàng review (không phải draft). |
| `commit_push` | Commit lên nhánh và push nhánh đó, không mở pull request. |
| `direct_commit` | Commit và push thẳng lên nhánh base (không có nhánh riêng hay PR). |
| `open_or_update_pr` | Cập nhật PR đang mở hiện có của agent khi tồn tại — kể cả khi tên nhánh khác, runner vẫn tìm thấy nó theo tác giả + base — nếu không thì mở một PR mới. Phù hợp nhất cho việc chạy lại và các chỉ thị "cập nhật PR đang mở". |
| `update_existing_pr` | Thêm một commit vào nhánh/PR hiện có; mở một PR mới nếu chưa tồn tại. |
| `patch_artifact` | Lưu diff dưới dạng tệp có thể tải xuống và trả về `patchUrl`. Không push gì cả. |

## Đầu ra

| Khóa | Mô tả |
|-----|-------------|
| `status` | Luôn là `completed` (node OpenCode Go không tạm dừng để chờ đầu vào) |
| `summary` | Thông điệp cuối cùng của OpenCode |
| `validation` | Ghi chú xác thực khi được báo cáo |
| `diff` | Git patch khi có tệp thay đổi |
| `changedFiles` | Đường dẫn các tệp đã thay đổi |
| `branchName` | Tên nhánh làm việc |
| `pullRequestUrl` | URL PR trong các chế độ `draft_pr`, `open_pr`, `open_or_update_pr`, và `update_existing_pr` |
| `pushedBranch` | Nhánh đã được push trong các chế độ commit/PR |
| `patchUrl` | Liên kết tải xuống diff trong chế độ `patch_artifact` |
## Ảnh chụp màn hình UI trên pull request

Đối với các tác vụ UI/frontend, OpenCode nên lưu ảnh chụp màn hình PNG vào một đường dẫn được gitignore như `frontend/.e2e-artifacts/` (không lưu trong source). Nếu thiếu các dependency frontend, runner prompt cho phép cài đặt package có mục tiêu cụ thể (ví dụ `bun install`) cùng với một preview ngắn hạn/`bun run dev` chỉ để chụp UI. Heym tải những hình ảnh đó lên một GitHub **prerelease** dùng chung duy nhất (`opencode-pr-assets`) dưới dạng các asset có tên `<branch>-…`, sau đó nhúng chúng vào mô tả PR **trước khi pull request được mở**, để một PR mới được tạo đã chứa sẵn ảnh chụp màn hình của nó (các PR hiện có được cập nhật tại chỗ).

OpenCode cũng được hướng dẫn kết thúc bằng một dòng `PR_TITLE: …` để Heym có thể mở pull request với tiêu đề có ý nghĩa thay vì các placeholder như `Done.`

Đôi khi OpenCode kết thúc một lượt giữa chừng tác vụ ("…Now let me take a screenshot"), điều này sẽ hoàn tất lượt chạy trước khi ảnh chụp màn hình được chụp. Để ngăn điều đó, runner prompt yêu cầu chụp ảnh màn hình **trước** tin nhắn cuối cùng, và nếu lượt chạy vẫn kết thúc mà không có bản tóm tắt có thể công bố hoặc có thay đổi UI nhưng không có ảnh chụp màn hình, Heym chạy thêm một lượt OpenCode nữa trong cùng workspace để hoàn tất. Nếu một thay đổi UI vẫn không có ảnh chụp màn hình sau đó, một ghi chú hiển thị sẽ được thêm vào nội dung PR để khoảng trống đó không bao giờ bị im lặng.

## Những gì được công bố lên GitHub

**Task Prompt** của bạn là đầu vào riêng tư, không phải nội dung PR. Chỉ có hai thứ được công bố: một `## Change Summary` mô tả thay đổi mã làm gì, và một mục `## Screenshots` khi ảnh chụp màn hình đã được chụp. Tiêu đề PR chỉ được suy ra từ bản tóm tắt thay đổi.

Runner prompt nêu rõ chính sách này, và Heym cũng thực thi nó sau lượt chạy: trước khi bất cứ điều gì được commit hoặc mở dưới dạng pull request, nó loại bỏ các mục lặp lại prompt (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) và bất kỳ đoạn văn nào được sao chép nguyên văn từ task prompt ra khỏi bản tóm tắt, nội dung PR và thông điệp commit.

Heym đọc mục `## Change Summary` từ các tin nhắn của agent thay vì lấy bất cứ điều gì nó nói cuối cùng, bởi vì OpenCode phát ra một tin nhắn cho mỗi bước và tin nhắn cuối cùng thường là bình luận giữa lượt chạy. Phần tường thuật từng bước (`Both pass. Let me do a final review:`) cũng bị từ chối làm tiêu đề PR hoặc chủ đề commit. Nếu lượt chạy không tạo ra bản tóm tắt thay đổi nào hữu ích, pull request sẽ chuyển sang liệt kê các tệp đã thay đổi thay vì công bố bình luận.

## Là một công cụ agent

Node OpenCode Go có thể được gắn vào handle công cụ của một node **AI Agent** để agent có thể ủy thác các tác vụ lập trình. Cấu hình credential, GitHub credential và repository trên node, sau đó đánh dấu **Task Prompt** (và tùy chọn **Repository URL**) bằng toggle do agent cung cấp để agent truyền chúng vào thời điểm gọi.

## Ví dụ

```json
{
  "id": "opencode-1",
  "type": "opencodeGo",
  "position": { "x": 420, "y": 120 },
  "data": {
    "label": "fix_pr",
    "credentialId": "opencode-credential-uuid",
    "githubCredentialId": "github-credential-uuid",
    "repositoryUrl": "https://github.com/acme/app",
    "baseBranch": "main",
    "taskPrompt": "$input.text",
    "publishMode": "open_pr",
    "branchName": "opencode/$executionId",
    "opencodeModel": "opencode-go/kimi-k3",
    "timeoutSeconds": 3600
  }
}
```

## Liên quan

- [Node Codex](./codex-node.md)
- [Node GitHub](./github-node.md)
- [Node Agent](./agent-node.md)
- [Credentials](../reference/credentials.md)
- [Chia sẻ Credentials](../reference/credentials-sharing.md)
- [Các loại Node](../reference/node-types.md)
