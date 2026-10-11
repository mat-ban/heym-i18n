# Chạy & Triển khai

Heym cung cấp hai script cho các môi trường khác nhau: `run.sh` dùng cho phát triển cục bộ và `deploy.sh` dùng cho triển khai production với Docker Compose.

> **Video hướng dẫn:** [Thiết lập Heym cục bộ trong chưa đầy 2 phút](https://www.youtube.com/watch?v=P6YvlupUboU) — clone repository, khởi động PostgreSQL, điền các biến môi trường bắt buộc và tạo tài khoản đầu tiên trên instance cục bộ.

## Điều kiện tiên quyết

Cả hai script đều yêu cầu cài đặt các công cụ sau:

| Công cụ | Mục đích |
|------|---------|
| [Docker](https://docs.docker.com/get-docker/) | Container database (dev) và toàn bộ stack (prod) |
| [uv](https://github.com/astral-sh/uv) | Trình quản lý gói Python cho backend |
| [bun](https://bun.sh) | Runtime JavaScript cho frontend |

## Thiết lập môi trường

Cả `run.sh` và `deploy.sh` đều đọc từ tệp `.env` ở thư mục gốc dự án. Nếu tệp chưa tồn tại, script sẽ tự động tạo từ `.env.example` — cho cả phát triển cục bộ lẫn production.

`SECRET_KEY` và `ENCRYPTION_KEY` được để trống trong `.env.example`. Khi một trong hai giá trị này trống, `run.sh` và `deploy.sh` sẽ tự động sinh một giá trị mạnh về mặt mã hóa và ghi lại vào `.env`, do đó thiết lập mới không cần xử lý key thủ công. Nếu tệp `.env` hiện có vẫn chứa placeholder `ENCRYPTION_KEY` cũ (`change_this_to_a_random_32_byte_hex_value`), các script sẽ dừng lại với lỗi rõ ràng thay vì ghi đè — việc xoay key đó sẽ khiến các credential đã mã hóa trước đó không thể đọc được. Bản thân backend cũng từ chối khởi động nếu một trong hai key bị trống hoặc vẫn giữ giá trị placeholder đã biết.

Để tạo tệp thủ công (tùy chọn — các script sẽ tự làm việc này cho bạn):

```bash
cp .env.example .env
```

Các biến môi trường chính:

Để xem mọi biến được hỗ trợ, giá trị mặc định và lưu ý production, xem [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Biến | Mô tả |
|----------|-------------|
| `SECRET_KEY` | **Bắt buộc.** Secret ký JWT. Được `run.sh`/`deploy.sh` tự động sinh khi trống. |
| `ENCRYPTION_KEY` | **Bắt buộc.** Key mã hóa credential. Được `run.sh`/`deploy.sh` tự động sinh khi trống. |
| `DATABASE_URL` | Chuỗi kết nối database ghi đè tùy chọn. Nếu trống, Heym sẽ tạo từ các thiết lập `POSTGRES_*`. |
| `BACKEND_PORT` | Cổng API backend — mặc định là `10105` |
| `FRONTEND_PORT` | Cổng frontend — mặc định là `4017` |
| `FRONTEND_URL` | **Bắt buộc trong production.** URL công khai của ứng dụng (scheme + host, ví dụ `https://heym.example.com`). Được dùng cho OAuth redirect URI (Google Sheets, BigQuery, Notion và tương tự), và cho các liên kết review, Codex follow-up và tệp mà các lần chạy nền tạo ra; phải khớp với URL người dùng sử dụng trên trình duyệt. Trong cluster, đặt cùng giá trị trên mọi instance. |
| `ALLOW_REGISTER` | Mở đăng ký người dùng (`false` trong prod, `true` trong dev). Chỉ chuyển thành `false` sau khi tài khoản admin của bạn đã tồn tại — không có cơ chế bootstrap người dùng đầu tiên, nên database trống cộng với đăng ký bị vô hiệu hóa sẽ không còn cách nào tạo tài khoản. |
| `DOCKER_LOGS_ENABLED` | Bật quyền truy cập tab Logs dựa trên Docker khi đặt thành `true`; cũng yêu cầu quyền truy cập Docker socket |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Danh sách email người dùng tin cậy, phân tách bằng dấu phẩy, được phép truy cập Docker logs khi `DOCKER_LOGS_ENABLED=true` |
| `REQUEST_BODY_MAX_SIZE_MB` | Kích thước tối đa của HTTP request body được chấp nhận trước khi các endpoint handler chạy; mặc định là `100`, cao hơn `FILE_MAX_SIZE_MB` một MB để dành chỗ cho phần overhead của multipart |
| `HEYM_PYTHON_TOOL_SANDBOX` | Cách các Python tool do người dùng định nghĩa chạy: `auto` (mặc định — container Docker được tăng cường bảo mật, cách ly; fail closed nếu Docker không khả dụng), `docker` (tương tự, không bao giờ fallback), hoặc `subprocess` (fallback cục bộ trong tiến trình; không phải ranh giới bảo mật, chỉ dùng cho trusted/dev). `run.sh` đặt `subprocess` cho dev native. Xem [Security](../reference/security.md#python-tool-sandbox). |
| `HEYM_PYTHON_TOOL_IMAGE` | Image dùng cho Docker sandbox của Python tool. Trống = tự động phát hiện image backend đang chạy. |

Các giá trị mặc định kết nối database (`POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) được ghi trong [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) và `.env.example`.

---

## Phát triển: `run.sh`

`run.sh` khởi động cả ba dịch vụ cục bộ — cơ sở dữ liệu (dưới dạng Docker container), FastAPI backend và Vite dev server — chỉ với một lệnh duy nhất.

```bash
./run.sh
```

**Những gì script thực hiện, từng bước một:**

1. Kiểm tra rằng `docker`, `bun` và `uv` đều khả dụng
2. Tạo `.env` từ `.env.example` nếu chưa có, và tạo ngẫu nhiên `SECRET_KEY` cùng `ENCRYPTION_KEY` khi một trong hai bị trống
3. Khởi động (hoặc tạo) một Docker container cơ sở dữ liệu trên cổng `6543`, lưu trữ dữ liệu trong Docker volume `heym-postgres-data` thay vì thư mục trên máy host
4. Cài đặt các gói phụ thuộc Python thông qua `uv sync`
5. Chạy các migration cơ sở dữ liệu Alembic (`alembic upgrade head`)
6. Giải phóng cổng backend và frontend nếu đang bị chiếm dụng
7. Khởi động FastAPI backend với `--reload` (tự động tải lại khi mã nguồn thay đổi)
8. Cài đặt các gói phụ thuộc frontend thông qua `bun install`
9. Khởi động Vite dev server

**Tùy chọn:**

| Cờ | Mô tả |
|------|-------------|
| *(không có)* | Khởi động với ghi log debug được bật (`LOG_LEVEL=DEBUG`) |
| `--no-debug` | Khởi động với mức log mặc định (không có đầu ra debug) |
| `--help` | Hiển thị thông tin hướng dẫn sử dụng |

**Địa chỉ dịch vụ (dev):**

| Dịch vụ | Địa chỉ |
|---------|---------|
| Frontend | `localhost` trên `FRONTEND_PORT` (mặc định: 4017) |
| Backend API | `localhost` trên `BACKEND_PORT` (mặc định: 10105) |
| Tài liệu API tương tác | `localhost:10105/docs` |
| Cơ sở dữ liệu | `localhost:6543` |

Nhấn `Ctrl+C` để dừng tất cả dịch vụ một cách nhẹ nhàng.

---

## Kiểm thử End-to-End: `run_e2e.sh`

Bộ kiểm thử Playwright của frontend chạy trên ứng dụng Vue thực tế, FastAPI backend và một
cơ sở dữ liệu PostgreSQL riêng biệt:

```bash
./run_e2e.sh
```

Bộ kiểm thử này là bộ smoke và regression cho các luồng chính, không bao phủ toàn diện sản phẩm. Nó bao gồm
xác thực, vòng đời và thực thi workflow cốt lõi, một số tài nguyên dashboard được chọn, các
route công khai, và giao diện review HITL được mô phỏng. Các tích hợp nhà cung cấp, mọi loại node, ma trận
chia sẻ/quyền, và thực thi resume HITL đầy đủ vẫn chủ yếu được bao phủ bởi các bài kiểm thử backend hoặc cần
môi trường tích hợp chuyên dụng.

Mỗi lần chạy có một container PostgreSQL 16 tạm thời riêng, các cổng cơ sở dữ liệu/backend/frontend
ngẫu nhiên còn trống, trạng thái xác thực, kết quả kiểm thử và báo cáo HTML riêng. Điều này cho phép nhiều tiến trình
`run_e2e.sh` chạy đồng thời mà không chia sẻ trạng thái hay ghi đè lên các artifact. Script sẽ xóa
container cơ sở dữ liệu khi lần chạy kết thúc và in ra thư mục artifact cùng đường dẫn báo cáo.

Các lệnh hữu ích:

```bash
./run_e2e.sh --ui         # Trình chạy Playwright tương tác với cơ sở dữ liệu riêng biệt
cd frontend
bun run test:e2e:report   # Mở lần chạy cục bộ hoàn thành gần nhất
```

Các lần chạy trực tiếp `bun run test:e2e` và `bun run test:e2e:ui` yêu cầu phải chỉ định rõ `DATABASE_URL` để chúng
không thể vô tình khởi động trên cơ sở dữ liệu phát triển cục bộ. Hãy dùng `./run_e2e.sh` cho các lần chạy cục bộ thông thường.

`./check.sh` chạy lint, typecheck, định dạng và kiểm thử backend mà không có bộ E2E, giữ cho
đường dẫn kiểm tra cục bộ mặc định luôn nhanh chóng. Chạy kiểm thử Playwright E2E riêng biệt bằng `./run_e2e.sh`. Các
pull request luôn chạy bộ E2E Chromium trong GitHub Actions và giữ lại traces, ảnh chụp màn hình,
video cùng báo cáo HTML khi xảy ra lỗi.

---

## Production: `deploy.sh`

`deploy.sh` build và chạy toàn bộ stack bằng Docker Compose. Cả ba service — database, backend và frontend — đều chạy dưới dạng container. Entrypoint của backend tự động chạy migration trước khi khởi động server với 8 worker.

**Triển khai lần đầu (build + start):**

```bash
./deploy.sh
```

Thao tác này thực hiện triển khai zero-downtime: image được build trước trong khi các container hiện có vẫn đang chạy, sau đó phiên bản mới được thay thế vào.

**Các lệnh khả dụng:**

| Lệnh | Mô tả |
|---------|-------------|
| `./deploy.sh` | Build image và khởi động/cập nhật tất cả service |
| `./deploy.sh --status` | Hiển thị trạng thái container |
| `./deploy.sh --logs` | Stream log từ tất cả container |
| `./deploy.sh --restart` | Khởi động lại tất cả container |
| `./deploy.sh --down` | Dừng và xóa tất cả container |
| `./deploy.sh --migrate-pgdata` | Migration một lần: sao chép thư mục `data/postgres` hiện có vào Docker volume `heym-postgres-data` và rebuild các index của nó |
| `./deploy.sh --help` | Hiển thị thông tin hướng dẫn sử dụng |

**Lưu trữ database: Docker named volume, không phải thư mục host.**

Compose lưu trữ PostgreSQL trong Docker volume `heym-postgres-data`. Các phiên bản trước đó bind-mount thư mục host `./data/postgres` thay vào đó. Host bind mount trên macOS (virtiofs) và Windows/WSL2 không cung cấp cho PostgreSQL các đảm bảo về `fsync` và đóng file mà nó yêu cầu: cluster trên các nền tảng đó gặp lỗi `PANIC: could not close file … Input/output error` trên các WAL segment và bị hỏng theo thời gian. Linux bind mount chưa bao giờ bị ảnh hưởng, nhưng mọi nền tảng hiện đều sử dụng cùng một layout.

Nâng cấp một deployment vẫn còn dữ liệu trong `./data/postgres` là bước chỉ thực hiện một lần. `./deploy.sh` phát hiện điều này, dừng lại trước khi build và yêu cầu bạn migrate trước:

```bash
./deploy.sh --migrate-pgdata   # dừng service, sao chép vào volume, rebuild index
./deploy.sh                    # triển khai như bình thường
```

**Migration cũng rebuild các index.** Bản sao chép là byte-for-byte, nên hư hỏng index do bind mount cũ gây ra cũng đi kèm theo. Do đó `--migrate-pgdata` khởi động riêng service `postgres` trên volume mới, chạy `reindexdb` trên đó, và dừng nó lại trước khi phần còn lại của stack khởi động. Điều này quan trọng vì loại hỏng này để lại các index entry trỏ vượt quá cuối heap — trạng thái mà `pg_amcheck` báo cáo là sạch, nên một kiểm tra đạt không phải là bằng chứng cho một bảng khỏe mạnh. REINDEX sửa chữa các entry đó; nó không thể khôi phục các heap page mà filesystem cũ đã mất. Trên một database lớn, đã biết là khỏe mạnh, bạn có thể bỏ qua việc rebuild bằng `./deploy.sh --migrate-pgdata --skip-reindex`.

Bản sao chép là non-destructive. `./data/postgres` vẫn được giữ nguyên như một bản backup, và migration từ chối ghi đè lên một volume đã chứa database. Nếu bất kỳ bước nào thất bại, volume mới sẽ bị xóa, nên một cluster migrate dở dang không bao giờ có thể được triển khai do nhầm lẫn. Xóa thư mục cũ sau khi bạn đã xác nhận các workflow của mình còn nguyên vẹn. Container `postgres` cũng mang cùng biện pháp bảo vệ, nên một lệnh `docker compose up` thủ công cũng không thể âm thầm khởi tạo một database rỗng đè lên dữ liệu của bạn. Cài đặt mới không cần thao tác nào.

**Địa chỉ service (production):**

Container frontend được expose trên `FRONTEND_PORT` (mặc định: 4017). Backend API được phục vụ dưới đường dẫn `/api`, được proxy qua container frontend — nên chỉ có một port công khai duy nhất trong production.

**Tổng quan container:**

| Container | Mô tả |
|-----------|-------------|
| `heym-db` | Database quan hệ |
| `heym-backend` | FastAPI API server (8 worker, build từ `backend/Dockerfile`) |
| `heym-frontend` | Container preview frontend phục vụ ứng dụng Vue đã build (build từ `frontend/Dockerfile`) |

**Badge cập nhật phiên bản:**

Header của ứng dụng hiển thị phiên bản Docker build đang chạy. Khi phiên bản đó cũ hơn bản phát hành Heym GitHub mới nhất, một badge **Update** màu tím xuất hiện bên cạnh phiên bản. Nhấp vào phiên bản hoặc badge để mở trang phát hành Heym GitHub.

---

## Prebuilt Image: `docker run`

Nếu bạn không muốn build ứng dụng cục bộ, bạn có thể pull container image đã được publish và chạy trực tiếp.

Image này khởi động cả frontend và backend cùng nhau trong một container. PostgreSQL vẫn là external, nhưng bạn có thể cung cấp `DATABASE_URL` hoặc các biến `POSTGRES_*` từ `.env.example`.

> **Lưu trữ database của bạn trong Docker named volume.** Release image không kèm database, vì vậy PostgreSQL phía sau `DATABASE_URL` là do bạn tự chạy. Hãy mount nó dưới dạng `-v heym-postgres-data:/var/lib/postgresql/data` thay vì dùng host path: trên macOS (virtiofs) và Windows/WSL2, thư mục dữ liệu PostgreSQL được bind-mount không đảm bảo được các cam kết `fsync` mà database yêu cầu và sẽ làm hỏng cluster theo thời gian.

> **Vector store backend.** `run.sh` và `deploy.sh` chạy image `postgres:16` chính thức và tự động cài đặt package `postgresql-16-pgvector` khi khởi động, vì vậy **Postgres (pgvector) RAG backend** hoạt động ngay ở đó mà không cần thay đổi dữ liệu của bạn. Tuy nhiên, prebuilt single-container image lại kết nối tới PostgreSQL do **bạn** cung cấp — database đó phải hỗ trợ extension `vector` để dùng Postgres backend. Heym không thể cài pgvector vào một database mà nó không quản lý. Nếu không có nó, migration lúc khởi động sẽ bỏ qua bảng pgvector một cách an toàn — deploy vẫn thành công, Qdrant RAG vẫn hoạt động, và việc tạo hoặc upload lên một Postgres vector store sẽ trả về thông báo rõ ràng "backend unavailable" cho đến khi pgvector được bật.

**Tự thiết lập các key khi chạy image trực tiếp.** Khác với `run.sh`/`deploy.sh`, prebuilt image không tự động tạo key. Sau khi `cp .env.example .env`, hãy điền vào hai key trống (thay thế tại chỗ để tránh các entry trùng lặp):

```bash
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
ENCRYPTION_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
sed -i.bak "s|^SECRET_KEY=.*|SECRET_KEY=${SECRET_KEY}|; s|^ENCRYPTION_KEY=.*|ENCRYPTION_KEY=${ENCRYPTION_KEY}|" .env && rm -f .env.bak
```

```bash
docker pull ghcr.io/heymrun/heym:latest

docker run --rm \
  --env-file .env \
  -p 4017:4017 \
  --shm-size 2g \
  -e FILE_STORAGE_DIR=/app/data/files \
  -e HEYM_PLUGINS_DIR=/app/data/plugins \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$(pwd)/data/files:/app/data/files" \
  -v "$(pwd)/data/plugins:/app/data/plugins" \
  -v heym-codex-workspaces:/app/data/codex-workspaces \
  -v heym-opencode-workspaces:/app/data/opencode-workspaces \
  ghcr.io/heymrun/heym:latest
```

> **Đặt các mount cho file và plugin ở dạng absolute.** `FILE_STORAGE_DIR` và `HEYM_PLUGINS_DIR` mặc định là các đường dẫn tương đối `./data/files` và `data/plugins`, và release image khởi động backend từ `/app/backend`. Nếu để tương đối, chúng sẽ resolve thành `/app/backend/data/files` và `/app/backend/data/plugins`, khiến hai bind mount ở trên không nhận được gì và các upload sẽ bị mất khi container bị thay thế. Các flag `-e` sẽ ghi đè các giá trị tương đối mà `.env.example` cung cấp thông qua `--env-file`, vì `-e` trên command-line thắng `--env-file`. Compose (`./deploy.sh`) không cần điều này: image đó chạy backend từ `/app`, nơi các giá trị mặc định tương đối đã trỏ đúng vào các mount.

> **Truy cập Docker socket.** Việc mount `/var/run/docker.sock` cho backend quyền kiểm soát rộng rãi đối với Docker daemon trên host. Service Docker Compose mặc định và ví dụ `docker run` trực tiếp đều bao gồm nó cho các Docker-based MCP stdio tool chạy lệnh `docker`. Tab Logs vẫn yêu cầu `DOCKER_LOGS_ENABLED=true` và `DOCKER_LOGS_ALLOWED_EMAILS` với danh sách email người dùng tin cậy được phân tách bằng dấu phẩy. Hãy tạo tài khoản admin tin cậy trước khi bật Docker logs, hoặc giữ `ALLOW_REGISTER=false`, để một đăng ký tự do chưa xác minh không thể chiếm một email nằm trong allow-list. Các Python tool do người dùng định nghĩa **không** được cấp socket này: chúng chạy trong một container hardened riêng biệt không có Docker socket. Xem [Security](../reference/security.md#python-tool-sandbox).

> **Codex runner.** Node Codex sử dụng cùng image `ghcr.io/heymrun/heym` làm một runner container anh em (`--entrypoint codex`) để Linux sandbox của Codex có thể tạo namespace. Hãy giữ mount volume `heym-codex-workspaces` nếu bạn muốn có các Codex workflow trong thiết lập image trực tiếp; runner không nhận Docker socket hay các secret của backend.

> **OpenCode Go runner.** Node OpenCode Go sử dụng cùng image làm một runner anh em đã hardened (`--entrypoint opencode`) chia sẻ `heym-opencode-workspaces`. Hãy giữ mount volume đó nếu bạn muốn có các OpenCode workflow trong thiết lập image trực tiếp; runner không nhận Docker socket hay GitHub token.

> **Skill sandbox.** Các Python skill trên node Agent chạy trong một container anh em đã hardened chia sẻ volume `heym-codex-workspaces`, vì vậy hãy giữ mount volume đó cho cả skill nữa — không chỉ cho Codex. Mỗi lần chạy nhận một subpath riêng biệt cho từng run, và container anh em không nhận Docker socket lẫn các secret của backend. Điều này cần **Docker Engine 25.0+**; trên các engine cũ hơn, hoặc không có volume, `HEYM_PYTHON_TOOL_SANDBOX=auto` sẽ fail closed — chỉ đặt `HEYM_PYTHON_TOOL_SANDBOX=subprocess` cho các thiết lập single-user đáng tin cậy. Xem [Security](../reference/security.md#skill-sandbox).

> **`--shm-size 2g` là bắt buộc đối với Playwright.** Docker cấp cho container 64 MB `/dev/shm` và Chromium sẽ gặp sự cố renderer dưới mức đó. Các node Playwright dạng step chạy Chromium như một tiến trình con bên trong container này, vì vậy giới hạn áp dụng cho container này; `playwrightCode` tùy chỉnh chạy trong một container anh em tự thiết lập giới hạn riêng. `docker-compose.yml` đã khai báo `shm_size: "2gb"`, nên `run.sh` và `deploy.sh` không bị ảnh hưởng — chỉ khi dùng `docker run` thuần mới cần cờ này.

> **Playwright Run Code.** Playwright Python tùy chỉnh cần `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true` và mount Docker socket ở trên. Image phát hành thiết lập `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` / `HEYM_PLAYWRIGHT_SANDBOX_PYTHON` cho bố cục GHCR (`/app/backend/.venv`). Compose `./deploy.sh` mặc định sandbox image là `heym-backend:local`. Giữ `--no-sandbox` trong tham số khởi chạy Chromium bên trong các container sandbox.

**Các biến môi trường tối thiểu cho việc chạy image trực tiếp:**

| Biến | Bắt buộc | Mục đích |
|----------|----------|---------|
| `DATABASE_URL` | Tùy chọn | Ghi đè toàn bộ chuỗi kết nối PostgreSQL |
| `POSTGRES_HOST` | Có, nếu `DATABASE_URL` trống | Host PostgreSQL |
| `POSTGRES_PORT` | Có, nếu `DATABASE_URL` trống | Cổng PostgreSQL |
| `POSTGRES_USER` | Có, nếu `DATABASE_URL` trống | Tên đăng nhập PostgreSQL |
| `POSTGRES_PASSWORD` | Có, nếu `DATABASE_URL` trống | Mật khẩu PostgreSQL |
| `POSTGRES_DB` | Có, nếu `DATABASE_URL` trống | Tên cơ sở dữ liệu PostgreSQL |
| `SECRET_KEY` | Có | Khóa ký JWT |
| `ENCRYPTION_KEY` | Có | Khóa mã hóa thông tin xác thực |
| `FRONTEND_URL` | Khuyến nghị | URL trình duyệt công khai, đặc biệt cho các callback OAuth |
| `CORS_ORIGINS` | Khuyến nghị | Các origin trình duyệt được phép |
| `FILE_STORAGE_DIR` | Khuyến nghị | Đặt thành đường dẫn tuyệt đối `/app/data/files` khi bạn mount đường dẫn đó; giá trị mặc định tương đối `./data/files` sẽ được phân giải dưới `/app/backend` trong image này và không khớp với mount |
| `ALLOW_REGISTER` | Khuyến nghị | Đặt `false` trong môi trường production trừ khi bạn muốn cho phép đăng ký mở, nhưng chỉ sau khi tài khoản admin của bạn đã tồn tại — không có cơ chế khởi tạo người dùng đầu tiên |
| `DOCKER_LOGS_ENABLED` | Tùy chọn | Đặt `true` để cho phép tab Logs sử dụng quyền truy cập Docker socket |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Bắt buộc khi `DOCKER_LOGS_ENABLED=true` | Danh sách email người dùng tin cậy được phép truy cập Docker logs, phân tách bằng dấu phẩy |
| `HEYM_PLUGINS_ENABLED` | Tùy chọn | Đặt `true` để bật hệ thống plugin (các node tùy chỉnh được cài dưới dạng zip). Mặc định tắt |
| `HEYM_PLUGIN_ADMIN_EMAILS` | Bắt buộc khi `HEYM_PLUGINS_ENABLED=true` | Danh sách email operator được phép cài đặt/gỡ cài đặt plugin, phân tách bằng dấu phẩy |
| `HEYM_PLUGINS_DIR` | Tùy chọn | Nơi lưu trữ các tệp plugin. Đặt thành đường dẫn tuyệt đối `/app/data/plugins` khi bạn mount đường dẫn đó; giá trị mặc định tương đối `data/plugins` sẽ được phân giải dưới `/app/backend` trong image này và không khớp với mount |
| `HEYM_PYTHON_TOOL_SANDBOX` | Tùy chọn | Chế độ cô lập công cụ Python; mặc định là `auto` (sandbox Docker được tăng cường bảo mật, fail closed). Xem [Security](../reference/security.md#python-tool-sandbox) |
| `HEYM_PYTHON_TOOL_IMAGE` | Tùy chọn | Ghi đè sandbox image của công cụ Python; trống = tự động phát hiện backend image |
| `HEYM_CODEX_DOCKER_WORKSPACE_VOLUME` | Tùy chọn | Docker volume được các container Codex runner anh em sử dụng; mặc định là `heym-codex-workspaces` trong các triển khai Docker |
| `HEYM_CODEX_NETWORK_ACCESS` | Tùy chọn | Cho phép các lệnh trong sandbox của Codex tải xuống tệp/phụ thuộc; các triển khai Docker bật tính năng này theo mặc định |
| `HEYM_OPENCODE_DOCKER_WORKSPACE_VOLUME` | Tùy chọn | Docker volume được các container OpenCode runner anh em sử dụng; mặc định là `heym-opencode-workspaces` trong các triển khai Docker |

**Ghi chú:**

- Image mở cổng `4017`
- Backend vẫn ở nội bộ và được proxy dưới `/api`
- Khi `POSTGRES_HOST=localhost`, image phát hành tự động ghi lại thành `host.docker.internal` khi cần để cùng một `.env` hoạt động với container PostgreSQL ở cấp host trên các công cụ macOS Docker/Desktop
- Giữ mount `data/files` nếu bạn muốn các tệp tải lên Drive và các tệp do skill tạo ra tồn tại qua các lần khởi động lại container
- **Plugins:** để bật chúng, đặt `HEYM_PLUGINS_ENABLED=true` và `HEYM_PLUGIN_ADMIN_EMAILS`, đồng thời mount `data/plugins` để các tệp plugin đã cài đặt tồn tại qua các lần tạo lại container. Metadata của plugin nằm trong PostgreSQL của bạn, nên nó cũng tồn tại. Các `dependencies` pip được khai báo của plugin sẽ được cài vào container tại thời điểm cài đặt; vì hệ thống tệp của image là tạm thời, chúng sẽ được **cài đặt lại tự động khi khởi động** cho mỗi plugin đã cài đặt (venv `uv` của image phát hành có thể ghi được, nên điều này cũng hoạt động trong image một container)

### Di chuyển cơ sở dữ liệu hiện có sang named volume

`./deploy.sh --migrate-pgdata` chỉ biết về stack Compose. Nếu bạn chạy image phát hành với container PostgreSQL của riêng bạn và container đó bind-mount một thư mục host, hãy tự di chuyển nó.

Trước tiên hãy kiểm tra xem container cơ sở dữ liệu của bạn đang dùng gì:

```bash
docker inspect <your-postgres-container> | grep -A8 Mounts
```

Nếu `"Type"` hiển thị `bind`, hãy chuyển nó sang named volume:

```bash
# 1. Stop the database. Heym can stay down for this.
docker stop <your-postgres-container>
docker rm <your-postgres-container>

# 2. Copy the data directory into a named volume. Give each instance its own

#   tên volume nếu Docker host này chạy nhiều hơn một bản triển khai Heym.
docker volume create heym-postgres-data
docker run --rm \
  -v "/path/to/your/data/postgres:/legacy:ro" \
  -v heym-postgres-data:/pgdata \
  --entrypoint sh <your-postgres-image> -c 'cp -a /legacy/. /pgdata/'

# 3. Khởi động lại PostgreSQL trên volume, tái sử dụng các flag bạn đã dùng trước đó
#    nhưng thay thế bind mount.
docker run -d --name <your-postgres-container> --restart always \
  ... your original -e / -p / --network flags ... \
  -v heym-postgres-data:/var/lib/postgresql/data \
  <your-postgres-image>

# 4. Sau khi nó chấp nhận kết nối, hãy rebuild các index.
docker exec <your-postgres-container> reindexdb -U <user> -d <database>
```

**Hãy dùng image của riêng bạn trong bước 2 và 3, không dùng `postgres:16`.** Nếu database của bạn chạy `pgvector/pgvector:pg16` hoặc một biến thể khác, việc khởi động cluster đã sao chép bằng image gốc có thể thất bại vì thiếu các thư viện extension mà nó yêu cầu.

Thư mục dữ liệu gốc của bạn không bị ảnh hưởng bởi quy trình này, vì vậy nó vẫn là đường rollback của bạn. Chỉ xóa nó sau khi xác nhận database đã migrate phục vụ được các workflow của bạn. Bước 4 quan trọng vì lý do tương tự như trong migration bằng Compose: bản sao mang theo mọi hư hỏng index hiện có.

---

## Chạy Nhiều Hơn Một Instance

Tất cả nội dung ở trên triển khai một instance Heym duy nhất. Khi một máy không còn đủ, hãy trỏ một instance thứ hai vào cùng database PostgreSQL và nó sẽ tham gia như một worker: các lượt chạy nền — cron, webhooks, lệnh gọi công cụ MCP, chat triggers — sau đó được chia sẻ giữa các instance theo tỷ lệ phần trăm bạn đặt trong **Settings → Instances**.

Các instance không bao giờ liên lạc với nhau. Postgres đảm nhận công việc, vì vậy một worker không cần cổng mở và không cần route quay lại instance chính, và không có message broker nào tham gia. Công việc liên quan đến đĩa cục bộ — tệp Drive, workspace của coding-agent, plugin đã cài — luôn chạy trên instance chính, nên không cần chia sẻ gì qua filesystem.

Hai quy tắc mà cluster không thể tự thực thi thay bạn: mọi instance phải dùng cùng `SECRET_KEY` và `ENCRYPTION_KEY`, và ingress chỉ được trỏ vào instance chính. Cả hai điều này được giải thích, cùng với các quy tắc đặt vị trí và cách chọn tỷ lệ phần trăm, trong [Load Distribution](../reference/cluster.md).

> Đây là load distribution, không phải high availability. Instance chính vẫn là một single point of failure cho ingress, lưu trữ tệp và editor.

## Các Workflow Thường Gặp

**Thiết lập lần đầu:**

```bash
./run.sh          # development — tạo .env từ .env.example và tự động sinh SECRET_KEY/ENCRYPTION_KEY
# hoặc
./deploy.sh       # production — cũng tự động tạo .env và sinh key
```

Đối với image `docker run` dựng sẵn, hãy sinh các key thủ công trước (xem phần **Prebuilt Image** ở trên).

**Cập nhật production sau khi thay đổi code:**

```bash
git pull
./deploy.sh       # rebuild image, hoán đổi không downtime
```

**Kiểm tra log production:**

```bash
./deploy.sh --logs
```

**Dừng các dịch vụ production:**

```bash
./deploy.sh --down
```

---

## Liên Quan

- [Introduction](./introduction.md) – Tổng quan nền tảng
- [Quick Start](./quick-start.md) – Xây dựng workflow đầu tiên của bạn
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Tham chiếu cấu hình đầy đủ
- [Security](../reference/security.md) – Cài đặt JWT, mã hóa và CORS
- [Load Distribution](../reference/cluster.md) – Chạy nhiều instance trên một database
