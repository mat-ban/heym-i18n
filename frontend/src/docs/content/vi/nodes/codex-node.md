# Codex

Node **Codex** chạy OpenAI Codex CLI trong một workspace Heym biệt lập trên một kho lưu trữ GitHub. Node này được thiết kế cho các tác vụ lập trình như sửa test, chỉnh sửa tệp, tạo bản vá (patch) hoặc mở draft pull request.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1, cộng với `question` |
| Credential | Codex access token + GitHub |
| Đầu ra | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Xác thực

Credential **OpenAI Codex** hỗ trợ hai chế độ xác thực:

| Chế độ | Mô tả |
|------|-------------|
| **Đăng nhập bằng ChatGPT** (khuyến nghị) | Đăng nhập OAuth (PKCE) sử dụng gói đăng ký ChatGPT Plus/Pro của bạn, do đó các lần chạy **không** phát sinh chi phí API theo token. Nhấp vào **Đăng nhập bằng ChatGPT** trong hộp thoại credential, xác thực trong trình duyệt, sau đó dán URL chuyển hướng `localhost:1455` trở lại Heym. Heym lưu trữ gói token kết quả và tự động làm mới khi hết hạn. |
| **Access token** | Dán `access_token` của ChatGPT/Codex chỉ được sử dụng bởi trình chạy Codex cục bộ. |

API key không được chấp nhận cho credential Codex. Node không gửi các tác vụ Codex lên cloud; nó sao chép kho lưu trữ bên trong runtime Heym, ghi gói token ChatGPT vào một `auth.json` biệt lập (hoặc truyền `CODEX_ACCESS_TOKEN`) chỉ cho tiến trình Codex, và giữ token ngoài `$credentials`.

Node cũng yêu cầu credential **GitHub** để sao chép các kho lưu trữ riêng tư, đẩy nhánh làm việc và tạo draft pull request.

Trong các triển khai Docker, Heym chạy Codex bên trong một container anh em từ cùng image Heym (không phải image GHCR riêng biệt). Container đó chỉ mount volume workspace của Codex và cho phép sandbox bubblewrap của chính Codex tạo namespace và một `/proc` mới. Trình chạy thêm `SYS_ADMIN`, seccomp và AppArmor không giới hạn, và `systempaths=unconfined` (Docker Engine 25+). Nếu không có cờ cuối cùng, mọi lệnh đều thất bại trước khi khởi chạy với lỗi `bwrap: Can't mount proc on /newroot/proc: Operation not permitted`.

Tài liệu tham khảo OpenAI:

- [Xác thực Codex](https://developers.openai.com/codex/auth)
- [Access token Codex](https://developers.openai.com/codex/enterprise/access-tokens)
- [Mô hình Codex](https://learn.chatgpt.com/docs/models?surface=cli)
- [Chế độ không tương tác của Codex](https://developers.openai.com/codex/noninteractive)
- [Bảng giá Codex](https://developers.openai.com/codex/pricing)

## Các trường

| Trường | Mô tả |
|-------|-------------|
| Codex Credential | Credential OpenAI Codex (đăng nhập ChatGPT hoặc `access_token`) |
| GitHub Credential | Credential GitHub PAT dùng để truy cập kho lưu trữ |
| Repository URL | URL kho lưu trữ GitHub dạng HTTPS |
| Base Branch | Nhánh để sao chép trước khi Codex chạy, mặc định `main` |
| Model | Mô hình Codex tùy chọn (dropdown có thể chỉnh sửa, ví dụ `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`); để trống sẽ dùng mặc định của Codex |
| Reasoning Effort | Độ sâu suy luận của Codex: `low`, `medium`, `high`, `xhigh` (Extra High), `max`, hoặc `ultra` (mặc định `medium`) |
| Task Prompt | Tác vụ lập trình cho Codex; hỗ trợ biểu thức như `$input.text` |
| Publish Mode | Cách các thay đổi được gửi đi (xem bảng bên dưới) |
| Branch Name | Nhánh làm việc cho các chế độ PR/commit, mặc định `codex/$executionId` |
| Timeout | Thời gian thực thi Codex tối đa tính bằng giây |

## Các chế độ Publish

| Chế độ | Chức năng |
|------|--------------|
| `diff_only` | Chỉnh sửa tệp cục bộ và trả về bản vá cùng các tệp đã thay đổi. Không có gì được đẩy lên. |
| `draft_pr` | Commit vào nhánh, đẩy nhánh lên và mở một draft pull request. |
| `open_pr` | Commit vào nhánh, đẩy nhánh lên và mở một pull request sẵn sàng để review (không phải draft). |
| `commit_push` | Commit vào nhánh và đẩy nhánh lên, không mở pull request. |
| `direct_commit` | Commit và đẩy thẳng vào nhánh base (không có nhánh riêng hay PR). |
| `open_or_update_pr` | Cập nhật PR đang mở hiện có của agent khi có một PR như vậy — ngay cả khi tên nhánh khác, trình chạy sẽ tìm nó theo tác giả + base — nếu không thì mở một PR mới. Phù hợp nhất cho các lần chạy lại và hướng dẫn "cập nhật PR đang mở". |
| `update_existing_pr` | Thêm commit vào nhánh/PR hiện có; mở một PR mới nếu chưa có. |
| `patch_artifact` | Lưu diff dưới dạng tệp có thể tải xuống và trả về `patchUrl`. Không có gì được đẩy lên. |

## Đầu ra

| Khóa | Mô tả |
|-----|-------------|
| `status` | `completed` hoặc `needs_input` |
| `summary` | Tóm tắt của Codex |
| `validation` | Ghi chú xác thực, test hoặc kiểm tra do Codex báo cáo |
| `diff` | Bản vá Git khi có tệp thay đổi |
| `changedFiles` | Đường dẫn các tệp đã thay đổi |
| `threadId` | Id luồng/phiên của Codex khi có sẵn |
| `branchName` | Tên nhánh làm việc |
| `pullRequestUrl` | URL PR trong các chế độ `draft_pr`, `open_pr`, `open_or_update_pr` và `update_existing_pr` |
| `pushedBranch` | Nhánh đã được đẩy lên trong các chế độ commit/PR |
| `patchUrl` | Liên kết tải xuống diff trong chế độ `patch_artifact` |
| `usage` | Metadata sử dụng do Codex CLI báo cáo khi có sẵn |
## Ảnh chụp màn hình UI trên pull request

Đối với các tác vụ UI/frontend, Codex nên lưu ảnh chụp màn hình PNG vào một đường dẫn được gitignore như `frontend/.e2e-artifacts/` (không lưu trong source). Nếu thiếu các dependency frontend, Codex có thể chạy `bun install` (hoặc npm/pnpm install) và khởi động một preview/`bun run dev` ngắn hạn chỉ để chụp UI. Heym tải những hình ảnh đó lên một GitHub **prerelease** dùng chung duy nhất (`codex-pr-assets`) dưới dạng các asset có tên `<branch>-…`, sau đó nhúng chúng vào mô tả PR **trước khi pull request được mở**, để một PR mới được tạo đã chứa sẵn ảnh chụp màn hình của nó (các PR hiện có được cập nhật tại chỗ). Codex cũng phải đặt một `pull_request_title` có ý nghĩa (không bao giờ dùng placeholder như `Done.`).

Đôi khi Codex kết thúc một lượt giữa chừng tác vụ ("…Now let me take a screenshot"), điều này sẽ hoàn tất lượt chạy trước khi ảnh chụp màn hình được chụp. Để ngăn điều đó, prompt của runner yêu cầu chụp ảnh màn hình **trước** kết quả cuối cùng, và nếu lượt chạy vẫn kết thúc mà không có bản tóm tắt có thể công bố hoặc có thay đổi UI nhưng không có ảnh chụp màn hình, Heym chạy thêm một lượt Codex nữa trong cùng workspace để hoàn tất. Nếu một thay đổi UI vẫn không có ảnh chụp màn hình sau đó, một ghi chú hiển thị sẽ được thêm vào nội dung PR để khoảng trống này không bao giờ bị im lặng.

## Những gì được công bố lên GitHub

**Task Prompt** của bạn là đầu vào riêng tư, không phải nội dung PR. Chỉ có hai thứ được công bố: một `## Change Summary` mô tả thay đổi mã làm gì, và một phần `## Screenshots` khi ảnh chụp màn hình được chụp. Tiêu đề PR chỉ được suy ra từ bản tóm tắt thay đổi.

Prompt của runner nêu rõ chính sách này, và Heym cũng thực thi nó sau lượt chạy: trước khi bất cứ điều gì được commit hoặc mở dưới dạng pull request, nó loại bỏ các phần lặp lại prompt (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) và bất kỳ đoạn văn nào được sao chép nguyên văn từ task prompt ra khỏi bản tóm tắt, nội dung PR và thông điệp commit. Việc tường thuật từng bước như `Both pass. Let me do a final review:` cũng bị từ chối làm tiêu đề PR hoặc chủ đề commit.

## Câu hỏi tiếp theo

Nếu Codex cần các yêu cầu còn thiếu hoặc một quyết định về sản phẩm, nó trả về `needs_input`. Heym tạm dừng việc thực thi và để lộ một output handle `question`. Kết nối handle đó với một nhánh thông báo, ví dụ Slack hoặc Send Email, để gửi cho người đánh giá liên kết theo dõi công khai.

Khi người đánh giá trả lời, Heym tiếp tục cùng một snapshot thực thi và luồng Codex từ metadata workspace đã lưu.

## Là một agent tool

Node Codex có thể được gắn vào tool handle của một node **AI Agent** để agent có thể ủy thác các tác vụ lập trình. Cấu hình credential, GitHub credential và repository trên node, sau đó đánh dấu **Task Prompt** (và tùy chọn **Repository URL**) bằng toggle do agent cung cấp để agent cung cấp chúng tại thời điểm gọi. Khi Codex chạy như một tool, kết quả `needs_input` được trả về trực tiếp cho agent thay vì tạm dừng workflow, để agent có thể tinh chỉnh yêu cầu và gọi Codex lần nữa.

## Ví dụ

```json
{
  "id": "codex-1",
  "type": "codex",
  "position": { "x": 420, "y": 120 },
  "data": {
    "label": "fix_pr",
    "credentialId": "codex-credential-uuid",
    "githubCredentialId": "github-credential-uuid",
    "repositoryUrl": "https://github.com/acme/app",
    "baseBranch": "main",
    "taskPrompt": "$input.text",
    "publishMode": "draft_pr",
    "branchName": "codex/$executionId",
    "timeoutSeconds": 3600
  }
}
```

## Liên quan

- [Node GitHub](./github-node.md)
- [Node Agent](./agent-node.md)
- [Credentials](../reference/credentials.md)
- [Chia sẻ Credentials](../reference/credentials-sharing.md)
- [Các loại Node](../reference/node-types.md)
