# Bảo mật

Các thực hành và cấu hình bảo mật cho nền tảng Heym.

## Chính sách mật khẩu

Tất cả mật khẩu — khi đăng ký và khi thay đổi mật khẩu — phải đáp ứng các yêu cầu sau:

| Quy tắc | Yêu cầu |
|------|-------------|
| Độ dài tối thiểu | 8 ký tự |
| Chữ hoa | Ít nhất một chữ cái viết hoa (A–Z) |
| Chữ thường | Ít nhất một chữ cái viết thường (a–z) |
| Chữ số | Ít nhất một chữ số (0–9) |

Các quy tắc này được thực thi trên cả frontend và backend (Pydantic validator). Một yêu cầu với mật khẩu không tuân thủ sẽ bị từ chối với phản hồi `422 Unprocessable Entity` trước khi bất kỳ thao tác ghi nào vào cơ sở dữ liệu diễn ra.

**Ví dụ về mật khẩu hợp lệ:** `MyWorkflow7!`

## Quản lý phiên

- Access token được lưu trữ trong cookie **HttpOnly**, không phải `localStorage`. Điều này ngăn JavaScript (bao gồm cả các payload XSS) đọc token.
- Refresh token được giới hạn phạm vi cho đường dẫn `/api/auth/refresh` và không thể được gửi đến các endpoint khác.
- Mỗi lần gọi `/api/auth/refresh` sẽ **luân chuyển** refresh token: token cũ bị thu hồi ngay lập tức và một token mới được cấp. Việc phát lại một refresh token đã sử dụng sẽ trả về `401`.

## Giới hạn tần suất

Các endpoint sau đây được giới hạn tần suất theo IP:

| Endpoint | Giới hạn | Thời gian cấm |
|----------|-------|--------------|
| `POST /api/auth/login` | 10 yêu cầu / 60 giây | 15 phút |
| `POST /api/auth/register` | 5 yêu cầu / 60 giây | 10 phút |
| `POST /register` (OAuth clients) | 5 yêu cầu / 60 giây | 10 phút |
| Portal login | 3 lần thử | 24 giờ |

Khi `REDIS_URL` được cấu hình, các giới hạn tần suất được chia sẻ giữa tất cả các backend worker. Nếu không có nó, giới hạn áp dụng cho từng tiến trình worker.

## Mã hóa thông tin xác thực

Tất cả API key, webhook URL và bearer token được lưu trữ trong bảng [Credentials](../tabs/credentials-tab.md) đều được mã hóa khi lưu trữ bằng AES-256 (Fernet) trước khi được ghi vào cơ sở dữ liệu. Khóa được dẫn xuất từ biến môi trường `ENCRYPTION_KEY`. Các script `run.sh` và `deploy.sh` tự động tạo một giá trị mạnh khi nó trống; ứng dụng sẽ từ chối khởi động nếu `ENCRYPTION_KEY` trống hoặc vẫn ở giá trị placeholder đã biết.

## MCP API Key

MCP API key được sử dụng để xác thực các MCP client bên ngoài kết nối đến endpoint `/api/mcp/sse`. Khi kết nối SSE được thiết lập, một session token ngắn hạn (1 giờ) được cấp và nhúng vào URL của message endpoint thay vì API key thật, ngăn khóa xuất hiện trong nhật ký truy cập của máy chủ. Xem [MCP Tab](../tabs/mcp-tab.md) để biết cách thiết lập.

## OAuth / PKCE

Máy chủ ủy quyền OAuth 2.0 (được sử dụng cho các MCP client) chỉ hỗ trợ grant `authorization_code` với PKCE (`S256`). Biểu mẫu chấp thuận sử dụng token CSRF HMAC-SHA256 có hiệu lực trong 10 phút. Tất cả các giá trị hiển thị trên trang chấp thuận đều được escape HTML.

## Execution Token

[Execution token](./execution-tokens.md) là các JWT được giới hạn phạm vi để gọi endpoint thực thi của một workflow từ các hệ thống bên ngoài. Khác với token phiên của người dùng, chúng:

- **Giới hạn phạm vi một workflow** — một token bị từ chối đối với bất kỳ workflow nào khác.
- **Có thể thu hồi độc lập** — việc thu hồi một token không ảnh hưởng đến phiên của người dùng đã cấp nó.
- **Ngắn hạn hoặc dài hạn** — chọn TTL từ 60 giây đến 10 năm.

Token được ký bằng cùng một application secret (`SECRET_KEY`) và được kiểm tra trên mỗi yêu cầu: chữ ký, thời hạn, khớp claim `wid` và trạng thái thu hồi. Xem [Execution Tokens](./execution-tokens.md) để biết cách thiết lập và tham chiếu API.

## An toàn nội dung

Sử dụng [Guardrails](./guardrails.md) trên các node LLM và Agent để chặn các tin nhắn người dùng không an toàn hoặc vi phạm chính sách trước khi chúng đến mô hình. Guardrails hỗ trợ chín danh mục nội dung (bạo lực, ngôn từ thù địch, nội dung tình dục, v.v.) với các mức độ nhạy cảm có thể cấu hình.

## Sandbox công cụ Python

Các công cụ Python do người dùng định nghĩa trên [Agent node](../nodes/agent-node.md) thực thi mã không đáng tin cậy. Theo mặc định, Heym chạy mỗi công cụ bên trong một Docker container dùng một lần, được tăng cường bảo mật với:

- không có quyền truy cập mạng,
- hệ thống tệp gốc chỉ đọc với một thư mục làm việc `tmpfs` nhỏ,
- người dùng không phải root với tất cả các Linux capability bị loại bỏ và `no-new-privileges`,
- giới hạn nghiêm ngặt về CPU, bộ nhớ và PID, và
- **không có Docker socket** được gắn kết, do đó một công cụ không thể truy cập Docker daemon của máy chủ.

Backend thực thi được điều khiển bởi biến môi trường `HEYM_PYTHON_TOOL_SANDBOX`:

| Giá trị | Hành vi |
|-------|----------|
| `auto` (mặc định) | Chạy trong Docker container được tăng cường bảo mật. Nếu Docker không khả dụng, việc thực thi **thất bại an toàn** — nó không âm thầm chạy mã không đáng tin cậy mà không có cách ly hệ điều hành. |
| `docker` | Giống như `auto`, nhưng không bao giờ có phương án dự phòng. |
| `subprocess` | Chạy trong một subprocess cục bộ trong cùng tiến trình được bảo vệ bởi danh sách cho phép import. Đây **không phải là một ranh giới bảo mật** và chỉ dành cho mã đáng tin cậy hoặc phát triển cục bộ. `run.sh` chọn nó cho môi trường phát triển native. |

Đặt `HEYM_PYTHON_TOOL_IMAGE` để ghim image sandbox; khi trống, Heym tự động phát hiện image backend đang chạy. Các hạn chế trong cùng tiến trình (danh sách cho phép import cùng với lọc thuộc tính và introspection) được áp dụng như biện pháp phòng thủ theo chiều sâu, nhưng container mới là ranh giới cách ly thực sự — hãy giữ chế độ mặc định `auto` (hoặc `docker`) cho các triển khai đa người dùng và production.

## Skill Sandbox

Các skill Python được gắn vào một [Agent node](../nodes/agent-node.md) cũng thực thi mã không đáng tin cậy — một skill có thể đến nguyên văn bên trong một workflow được chia sẻ hoặc một template có chế độ hiển thị `everyone` — vì vậy các skill chạy qua **cùng** công tắc `HEYM_PYTHON_TOOL_SANDBOX` như các Python tool và cũng fail closed theo cùng cách. Container của skill được gia cố giống hệt (non-root, loại bỏ toàn bộ capabilities, `no-new-privileges`, root filesystem chỉ đọc, giới hạn CPU/memory/PID, và **không có Docker socket**), với hai khác biệt có chủ đích vì các skill thực sự cần chúng:

- **Cho phép network egress** (các skill gọi API và tự cài đặt dependencies thông qua `uv`), và
- **một workspace có thể ghi được mount vào** để các skill có thể tạo file đầu ra và đọc các file trên Heym Drive.

Workspace được chia sẻ với container anh em dùng một lần thông qua cùng named Docker volume mà Codex runner sử dụng (`heym-codex-workspaces`, được mount tại `/app/data/codex-workspaces`). Chỉ thư mục con của chính lần chạy này được mount vào container anh em — thông qua `volume-subpath` theo từng lần chạy — để một skill không bao giờ nhìn thấy dữ liệu workspace của lần chạy khác hoặc của Codex. Docker Compose stack luôn mount volume này; lệnh `docker run` một container phải bao gồm `-v heym-codex-workspaces:/app/data/codex-workspaces` cho cả Python skill lẫn Codex. Nếu volume bị thiếu trong chế độ `auto`/`docker`, việc thực thi skill sẽ **fail closed** thay vì chạy trong backend. Vì các mount subpath theo từng lần chạy yêu cầu **Docker Engine 25.0 trở lên**, các engine cũ hơn nên nâng cấp hoặc chạy các skill đáng tin cậy với `HEYM_PYTHON_TOOL_SANDBOX=subprocess`.

Chỉ các biến môi trường không bí mật, có thể di động (cài đặt proxy và CA-bundle, locale) được chuyển tiếp vào container; database URL, `SECRET_KEY`/`ENCRYPTION_KEY`, provider API key, và OAuth secret bị giữ lại bởi một allowlist. Đường dẫn file của skill được xác thực để nằm trong workspace, và các symlink được cài vào thư mục đầu ra (bao gồm sentinel `_hitl_request.json`) không bao giờ bị đi theo. Ghi đè các giá trị mặc định bằng `HEYM_SKILL_IMAGE`, `HEYM_SKILL_NETWORK`, `HEYM_SKILL_MEMORY`, `HEYM_SKILL_CPUS`, `HEYM_SKILL_PIDS`, và `HEYM_SKILL_USER` nếu cần.

Như với các tool, chế độ `subprocess` chạy skill trong tiến trình backend và **không phải là một ranh giới bảo mật** — chỉ sử dụng nó cho single-user đáng tin cậy hoặc phát triển cục bộ (`run.sh` chọn nó cho native dev).

## Code Node Sandbox

[Code node](../nodes/code-node.md) chạy Python tùy ý của người dùng cùng với các dependency bên thứ ba tùy ý, vì vậy đây là sandbox nghiêm ngặt nhất trong ba sandbox và là sandbox duy nhất **không có escape hatch**: nó không đọc biến sandbox-mode nào, không có chế độ `subprocess`, và fail closed khi không thể kết nối tới Docker daemon. Nó không bao giờ fallback về việc chạy mã người dùng trong tiến trình backend.

Việc thực thi là một hoặc hai container dùng một lần, cả hai đều được gia cố như các sandbox của tool và skill (non-root, loại bỏ toàn bộ capabilities, `no-new-privileges`, root filesystem chỉ đọc, giới hạn CPU/memory/PID, và **không có Docker socket**):

- Với `requirements.txt` rỗng, **một container duy nhất với `--network none`** chạy mã. Runner đến trong stdin payload của container, vì vậy không có gì được mount cả.
- Với các dependency, một container đầu tiên cài đặt chúng với quyền truy cập mạng vào một thư mục `.deps` theo từng lần chạy, và một container thứ hai mount subtree đó **chỉ đọc** và chạy mã. Container thực thi không có mạng trừ khi tùy chọn `codeAllowNetwork` của node được bật.

Các dependency được cài đặt bằng `uv`, thử lại bằng `pip`, và không bao giờ được cache giữa các lần chạy. Khi backend chạy trong một container, thư mục theo từng lần chạy nằm trên cùng volume `heym-codex-workspaces` mà skill sandbox sử dụng, được mount thông qua `volume-subpath` theo từng lần chạy để một lần chạy không bao giờ nhìn thấy file của lần chạy khác; dạng đó yêu cầu **Docker Engine 25.0 trở lên**. Một backend native (`./run.sh`) không có volume như vậy và không cần nó — thư mục theo từng lần chạy của nó là một đường dẫn tạm cục bộ được bind-mount thẳng vào container anh em. Dù theo cách nào, thư mục đều bị xóa sau mỗi lần thực thi bất kể kết quả ra sao.

Chỉ các biến môi trường không bí mật, có thể di động được chuyển tiếp vào các container — cài đặt proxy, CA bundle, và locale, những thứ mà việc cài đặt dependency cần để truy cập PyPI sau một proxy của doanh nghiệp. Database URL, `SECRET_KEY`/`ENCRYPTION_KEY`, provider API key, và OAuth secret bị giữ lại bởi một allowlist, vì vậy một backend secret mới sẽ bị loại bỏ theo mặc định thay vì bị rò rỉ cho đến khi ai đó cập nhật một denylist. `HOME` của backend không bao giờ ghi đè đường dẫn có thể ghi của chính sandbox.

Nút **Format** sử dụng cùng sandbox đó. Ruff phân tích cú pháp và viết lại mã nguồn thay vì thực thi nó, nhưng chạy nó trên host backend sẽ trao cho một file không đáng tin cậy một tiến trình thừa hưởng toàn bộ môi trường của backend, vì vậy nó có một container `--network none` dùng một lần riêng với cùng các giới hạn và cùng môi trường được allowlist. Nó fail closed khi không có Docker thay vì format trên host.

Các giới hạn của sandbox là hằng số thay vì biến môi trường — 512 MB bộ nhớ, một CPU, 256 tiến trình, timeout cài đặt 120 giây, và timeout thực thi 60 giây. Image được resolve từ chuỗi `HEYM_PYTHON_TOOL_IMAGE` / `HEYM_CODEX_DOCKER_IMAGE` hiện có; node không đưa ra cấu hình riêng nào.

## Liên quan

- [Chạy & Triển khai](../getting-started/running-and-deployment.md) – Cấu hình `SECRET_KEY`, `ENCRYPTION_KEY`, `ALLOW_REGISTER` và `HEYM_PYTHON_TOOL_SANDBOX` khi khởi động
- [Code Node](../nodes/code-node.md) – Thực thi Python trong sandbox với các dependency riêng
- [Agent Node](../nodes/agent-node.md) – Các công cụ Python tùy chỉnh chạy trong sandbox
- [Execution Tokens](./execution-tokens.md) – JWT theo phạm vi để gọi workflow từ các hệ thống bên ngoài
- [Guardrails](./guardrails.md) – Chặn nội dung không an toàn trong các node LLM và Agent
- [Cài đặt](./user-settings.md) – Thay đổi mật khẩu của bạn
- [Tab Credentials](../tabs/credentials-tab.md) – Quản lý API key
- [Tab MCP](../tabs/mcp-tab.md) – MCP API key và các OAuth client
- [Portal](./portal.md) – Kiểm soát truy cập cổng chat công khai
