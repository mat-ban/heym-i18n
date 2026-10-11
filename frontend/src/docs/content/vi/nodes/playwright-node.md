# Playwright

Node **Playwright** tự động hóa các tương tác trình duyệt với các bước có thể cấu hình. Sử dụng node này để thu thập dữ liệu web, điền biểu mẫu và xây dựng các workflow dựa trên trình duyệt.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1 |
| Đầu ra | `$nodeLabel.results`, `$nodeLabel.screenshot`, và dữ liệu mạng/trình duyệt tùy chọn |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `playwrightMode` | string | `"steps"` (mặc định) hoặc `"code"` (Run Code). Chọn trong dropdown Mode của Properties Panel |
| `playwrightSteps` | array | Các bước: navigate, click, type, aiStep, v.v. Mỗi bước có action và selector/params. `disabled: true` giữ bước trong danh sách nhưng bỏ qua khi chạy |
| `playwrightCode` | string | Playwright Python tùy chỉnh được dùng khi Mode là Run Code. Chạy trong sandbox được gia cố và **bị tắt theo mặc định** — xem lưu ý bảo mật bên dưới |
| `playwrightHeadless` | boolean | Chạy headless (mặc định: true) |
| `playwrightStealth` | boolean | Cài đặt chế độ Steps tùy chọn giúp giảm các tín hiệu tự động hóa Playwright phổ biến (mặc định: false). Nhãn trong Properties Panel: Reduce automation flags |
| `playwrightTimeout` | number | Thời gian chờ tính bằng ms (mặc định: 30000) |
| `playwrightCaptureNetwork` | boolean | Ghi lại các phản hồi JSON, headers, cookies và bộ nhớ trình duyệt |
| `playwrightAuthEnabled` | boolean | Khôi phục xác thực trình duyệt từ cookies/storageState trước khi chạy các bước |
| `playwrightAuthStateExpression` | string | Biểu thức hoặc JSON phân giải thành Playwright `storageState` hoặc `cookies[]` thô |
| `playwrightAuthCheckSelector` | string | Selector phải hiển thị sau khi khởi tạo xác thực |
| `playwrightAuthCheckTimeout` | number | Thời gian chờ tính bằng ms cho kiểm tra selector đã xác thực (mặc định: 5000) |
| `playwrightAuthFallbackSteps` | array | Các bước dự phòng chỉ dành cho đăng nhập để chạy khi khôi phục cookie không xác thực được trang |

## Các loại bước

- **navigate** – Đi đến URL
- **refresh** – Tải lại trang hiện tại (`timeout` tùy chọn của bước tính bằng ms cho điều hướng tải lại)
- **click** – Nhấp vào phần tử theo selector
- **type** – Nhập văn bản vào ô nhập liệu (từng ký tự một)
- **fill** – Điền giá trị vào ô nhập liệu
- **wait** – Chờ một khoảng thời gian (ms)
- **screenshot** – Chụp ảnh màn hình (`outputKey` lưu base64 trong results)
- **getText** – Nội dung văn bản của một phần tử (`selector`, `outputKey` tùy chọn)
- **getAttribute** – Giá trị thuộc tính (`selector`, `attribute`, `outputKey` tùy chọn)
- **getHTML** – HTML bên ngoài của một phần tử (`selector`, `outputKey` tùy chọn)
- **getVisibleTextOnPage** – Văn bản hiển thị toàn trang dưới dạng `document.body.innerText` (không có selector; dùng `outputKey`; `timeout` tùy chọn của bước tính bằng ms sẽ chờ trước khi chụp)
- **hover** – Di chuột qua phần tử
- **selectOption** – Chọn tùy chọn trong một `<select>`
- **scrollDown** / **scrollUp** – Cuộn bằng con lăn chuột (`amount` tùy chọn tính bằng pixel)
- **aiStep** – LLM trả về các loại hành động giống như các bước thủ công (xem bên dưới); không hỗ trợ `aiStep` lồng nhau

## Tắt một bước

Mỗi bước có một nút bật/tắt nguồn trong tiêu đề của nó. Một bước bị tắt sẽ hiển thị tiêu đề bị gạch ngang và mờ đi, vẫn nằm trong danh sách với tất cả các trường của nó, và bị bỏ qua khi node chạy — hữu ích để cô lập một selector bị lỗi mà không xóa công việc. Bước được lưu mang theo `disabled: true`; các bước không có cờ này sẽ chạy bình thường.

Các bước bị tắt không hiển thị với phần còn lại của node: chúng không thỏa mãn quy tắc "bước đầu tiên phải là `navigate`" của khởi tạo xác thực, một `aiStep` bị tắt sẽ không gọi LLM, và các mục bị tắt trong `playwrightAuthFallbackSteps` cũng bị bỏ qua. Tắt tất cả các bước sẽ làm lần chạy thất bại với thông báo yêu cầu bạn bật ít nhất một bước.

## AI Step

Hành động **aiStep** sử dụng LLM để phân tích HTML của trang (và tùy chọn cả ảnh chụp màn hình) và tạo ra các hành động Playwright từ hướng dẫn bằng ngôn ngữ tự nhiên. API chấp nhận cùng tên hành động như các bước thủ công (bao gồm `navigate`, `refresh`, `getText`, `getHTML`, `getAttribute`, `getVisibleTextOnPage`, `screenshot`, các thao tác cuộn, v.v.). **Auto heal** chỉ thay thế các bước dựa trên selector bị lỗi bằng các lựa chọn thay thế cho click, type, fill, hover và selectOption.

| Tùy chọn | Mô tả |
|--------|-------------|
| `instructions` | Những gì AI nên làm (ví dụ: "Click the Login button") |
| `credentialId` | Thông tin xác thực LLM (OpenAI, Google hoặc Custom) |
| `model` | Danh sách model có thể tìm kiếm từ thông tin xác thực LLM đã chọn |
| `saveStepsForFuture` | Lưu cache các bước đã tạo cho các lần chạy sau (tránh gọi LLM) |
| `sendScreenshot` | Gửi ảnh chụp màn hình cho LLM để nhận diện các phần tử trực quan |
| `aiStepTimeout` | Thời gian chờ cho lệnh gọi LLM tính bằng ms (mặc định 30000) |

### AI Auto Heal

**AI Auto Heal** giúp các workflow chống chịu được các thay đổi DOM. Khi một selector thất bại hai lần (ví dụ: sau khi trang web được thiết kế lại), Heym gọi LLM để tìm một locator thay thế—thường là `role=button[name='Submit']` hoặc `text=Exact text` thay vì các selector CSS.

Bật **Auto heal mode** trong thuộc tính của AI step. Nếu bước đã lưu thất bại:

1. Heym chụp HTML và ảnh màn hình hiện tại
2. Gửi bước bị lỗi + ngữ cảnh trang cho LLM
3. LLM trả về một lựa chọn thay thế mạnh mẽ (locator dựa trên role, locator văn bản hoặc CSS dự phòng)
4. Thử lại với selector mới

Điều này giúp giảm tình trạng không ổn định khi các trang web cập nhật markup hoặc tên class của chúng.
## Giảm cờ tự động hóa

Bật **Reduce automation flags** (`playwrightStealth: true`) khi một trang web coi Chromium đi kèm của Playwright là bot do các tín hiệu tự động hóa tiêu chuẩn (`HeadlessChrome` trong user agent, `navigator.webdriver`, thiếu `window.chrome`).

Tùy chọn này chỉ áp dụng ở chế độ **Steps**. Nó:

- Loại bỏ cờ `--enable-automation` của Chromium và đặt `--disable-blink-features=AutomationControlled`
- Gửi user agent Chrome tiêu chuẩn (không có `HeadlessChrome`)
- Khôi phục các bề mặt trình duyệt phổ biến mà Playwright để trống (`window.chrome`, plugins)
- Giữ nguyên GPU renderer của máy chủ khi có GPU khả dụng (macOS/Windows cục bộ). Linux/Docker không có GPU; chuỗi software renderer của Chromium được báo cáo như GPU Mali (ARM) hoặc Mesa (x86) điển hình thay vì SwiftShader.

Nó không che giấu việc phiên được điều khiển qua Chrome DevTools Protocol, và không phải là cách để vượt qua bảo mật của trang web, CAPTCHA hay kiểm soát truy cập. Hãy sử dụng nó cho các workflow mà bạn được phép chạy — công cụ nội bộ, trang web của chính bạn và tự động hóa trình duyệt được cho phép.

Chế độ Run Code không thay đổi — các script tùy chỉnh tự khởi chạy Chromium.

## Network Capture

Bật `playwrightCaptureNetwork` để thu thập thêm dữ liệu gỡ lỗi trong quá trình chạy:

- `networkRequests` – Các phản hồi JSON/API được thu thập
- `cookies` – Cookie trình duyệt khi kết thúc quá trình chạy
- `localStorage` – Các cặp key-value trong `localStorage` của trình duyệt
- `sessionStorage` – Các cặp key-value trong `sessionStorage` của trình duyệt

Điều này hữu ích khi bạn cần kiểm tra các lệnh gọi API ẩn, trạng thái xác thực hoặc dữ liệu phía trình duyệt sau một luồng tự động hóa.

## Cookie Bootstrap Và Login Fallback

Bật `playwrightAuthEnabled` khi bạn muốn Playwright mở một trang đã đăng nhập sẵn.

### Nguồn Trạng Thái Xác Thực

Đặt `playwrightAuthStateExpression` thành một biểu thức như `$global.authState`. Giá trị có thể là:

- Một đối tượng `storageState` của Playwright: `{"cookies": [...], "origins": [...]}`
- Một mảng `cookies[]` thô
- Một chuỗi JSON chứa một trong hai dạng trên

Mẫu khuyến nghị:

1. Chạy một node Playwright với network capture hoặc auth bootstrap được bật
2. Lưu `$playwrightNode.cookies` hoặc một đối tượng auth state đầy đủ vào một [Global Variable](../reference/global-variables.md)
3. Tái sử dụng biến đó trong các node Playwright sau thông qua `$global.authState`

### Kiểm Tra Xác Thực

Bước Playwright chính đầu tiên phải là `navigate`. Sau khi bước đó tải xong, Heym kiểm tra `playwrightAuthCheckSelector`.

- Nếu selector hiển thị, các bước chính còn lại tiếp tục bình thường
- Nếu selector không có, Heym chạy `playwrightAuthFallbackSteps`
- Sau khi các bước fallback hoàn tất, Heym kiểm tra lại cùng selector đó
- Nếu selector vẫn không có, node thất bại với lỗi auth bootstrap

Các bước fallback chịu trách nhiệm điều hướng sau khi xác thực thất bại. Chúng nên để trình duyệt ở trang đã xác thực mà phần còn lại của luồng chính mong đợi.

## Các Trường Đầu Ra

- `$playwrightNode.status` – `"ok"` khi thành công
- `$playwrightNode.results` – Đầu ra của các bước (getText, getHTML, getVisibleTextOnPage, getAttribute, các khóa screenshot, v.v.)
- `$playwrightNode.screenshot` – Ảnh chụp màn hình Base64 khi một bước lưu nó
- `$playwrightNode.cookies` – Cookie trình duyệt cuối cùng khi auth bootstrap hoặc network capture được bật
- `$playwrightNode.networkRequests` – Các phản hồi mạng được thu thập (khi được bật)
- `$playwrightNode.localStorage` – Local storage của trình duyệt (khi được bật)
- `$playwrightNode.sessionStorage` – Session storage của trình duyệt (khi được bật)

## Ví Dụ

```json
{
  "type": "playwright",
  "data": {
    "label": "browserAutomation",
    "playwrightSteps": [
      { "action": "navigate", "url": "$userInput.body.url" },
      { "action": "type", "selector": "#search", "text": "query" },
      { "action": "click", "selector": "button[type=submit]" }
    ],
    "playwrightHeadless": true
  }
}
```

## Chế độ Run Code

Trong Properties Panel, đặt **Mode** thành **Run Code** để chỉnh sửa `playwrightCode` thay vì các bước trực quan. Auth bootstrap chỉ áp dụng cho chế độ Steps.

Ví dụ (sandbox / Docker — Chromium cần `--no-sandbox`):

```python
from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=headless,
        args=["--no-sandbox", "--force-webrtc-ip-handling-policy=disable_non_proxied_udp"],
    )
    page = browser.new_page()
    page.set_default_timeout(timeout_ms)
    page.goto("https://example.com")
    title = page.title()
    browser.close()
    print(json.dumps({"status": "ok", "results": {"title": title}}))
```

Wrapper cung cấp `inputs`, `headless`, `timeout_ms` và `capture_network`. Bạn có thể nhúng các biểu thức `$nodeLabel.field` vào mã; in JSON với `status` và `results`.
## Bảo mật mã tùy chỉnh

Trường `playwrightCode` thực thi mã Python tùy ý. Vì điều đó tương đương với việc thực thi mã, nó **bị vô hiệu hóa theo mặc định** và, khi được bật, sẽ được sandbox:

- **Bị vô hiệu hóa theo mặc định.** Việc thực thi một node có đặt `playwrightCode` sẽ thất bại với thông báo lỗi rõ ràng trừ khi người vận hành đặt `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true`. Việc kiểm tra chạy tại thời điểm thực thi, do đó nó cũng bao phủ các workflow đã lưu trước đó và các lần chạy theo lịch / sub-workflow.
- **Được cô lập khi bật.** Mã tùy chỉnh không chạy trong tiến trình backend. Nó chạy trong một container anh em dùng một lần đã được gia cố, không có Docker socket, không có bind mount của backend, không có bí mật backend trong môi trường của nó, các capability bị loại bỏ, `no-new-privileges`, và giới hạn CPU / bộ nhớ / PID. Nếu Docker không khả dụng, lần chạy sẽ thất bại theo hướng an toàn (fail closed). `HEYM_PLAYWRIGHT_SANDBOX=subprocess` chuyển trở lại đường dẫn trong tiến trình chỉ dành cho mục đích tin cậy hoặc phát triển cục bộ (không phải là ranh giới bảo mật). `./run.sh` gốc mặc định dùng `subprocess` khi không đặt `HEYM_PLAYWRIGHT_SANDBOX_IMAGE`. `./deploy.sh` (Compose) và image đơn GHCR phân giải runner anh em thông qua `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` (dự phòng sang `HEYM_CODEX_DOCKER_IMAGE`) và sử dụng đường dẫn venv tương ứng (`/app/.venv` so với `/app/backend/.venv`).
- **Lưu ý về Chromium.** Container sandbox chạy với quyền root theo mặc định, và Chromium từ chối chạy với quyền root nếu không có `--no-sandbox`. Mã tùy chỉnh khởi chạy Chromium nên truyền cờ này, ví dụ `browser = p.chromium.launch(headless=True, args=["--no-sandbox"])`. Các lần khởi chạy dựa trên bước (và stealth) cũng truyền `--force-webrtc-ip-handling-policy=disable_non_proxied_udp` để các script fingerprint không thể mở STUN UDP tới `stun.l.google.com:19302`. Các lệnh gọi `chromium.launch` tùy chỉnh cũng nên bao gồm cờ đó.

Các node Playwright dựa trên bước (`playwrightSteps`) được Heym tạo hoàn toàn (không có mã tùy ý), không bị ảnh hưởng bởi tất cả những điều trên, và luôn khả dụng — hãy ưu tiên chúng.

## Liên quan

- [Các loại node](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Node Crawler](./crawler-node.md) – Thu thập dữ liệu web đơn giản hơn với FlareSolverr
- [Chia sẻ thông tin xác thực](../reference/credentials-sharing.md) – Thông tin xác thực LLM cho các bước AI
