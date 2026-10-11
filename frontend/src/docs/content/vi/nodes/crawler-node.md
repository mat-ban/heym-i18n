# Crawler

Node **Crawler** thu thập nội dung các trang web bằng FlareSolverr, với tùy chọn trích xuất HTML thông qua CSS selector. Sử dụng node này để scrape web và trích xuất nội dung.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1 |
| Đầu ra | `$nodeLabel.body` (HTML hoặc nội dung đã trích xuất) |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `credentialId` | UUID | Thông tin xác thực FlareSolverr từ [Credentials](../tabs/credentials-tab.md) |
| `crawlerUrl` | expression | URL cần scrape (hỗ trợ expression) |
| `crawlerWaitSeconds` | number | Số giây chờ trước khi scrape (mặc định: 0) |
| `crawlerMaxTimeout` | number | Thời gian timeout tối đa tính bằng ms (mặc định: 60000) |
| `crawlerMode` | string | `"basic"` hoặc các chế độ khác |
| `crawlerSelectors` | array | CSS selector dùng để trích xuất. Mỗi phần tử: `{ selector, attribute? }` |

## Ví dụ

```json
{
  "type": "crawler",
  "data": {
    "label": "scrapePage",
    "credentialId": "flaresolverr-credential-uuid",
    "crawlerUrl": "$userInput.body.url",
    "crawlerWaitSeconds": 2,
    "crawlerSelectors": [
      { "selector": "h1" },
      { "selector": ".content", "attribute": "innerHTML" }
    ]
  }
}
```

## An toàn khi truy cập ra ngoài

- URL FlareSolverr được lưu trong credential phải sử dụng `http://` hoặc `https://` và không được phân giải tới địa chỉ link-local hoặc địa chỉ cloud-metadata. Tập địa chỉ bị từ chối gồm `169.254.0.0/16`, `fe80::/10`, các địa chỉ metadata IPv6 của Alibaba Cloud và AWS, cùng các dạng chuyển đổi IPv6 có thể mang một trong các địa chỉ đó. Đây là danh sách các endpoint đã biết, không phải bảo đảm áp dụng cho mọi nhà cung cấp.
- Địa chỉ loopback và địa chỉ private được cho phép một cách có chủ đích, để cấu hình `http://localhost:8191` như trong tài liệu và các tên service trong compose như `http://flaresolverr:8191` vẫn hoạt động. Hệ quả là trường này cũng có thể bị trỏ tới bất kỳ service nào khác mà backend có thể truy cập qua các địa chỉ đó, và phản hồi sẽ được trả về trong output của node. Việc chia sẻ credential không khắc phục được điều này: bất kỳ người dùng đã đăng nhập nào cũng có thể tạo credential FlareSolverr của riêng họ, nên việc giữ lại credential hiện có không thay đổi được gì. Các biện pháp kiểm soát thực sự có hiệu lực là tin tưởng những người có quyền tạo workflow, và các quy tắc mạng giới hạn những gì backend có thể truy cập.
- Heym ghim địa chỉ đã phân giải trước khi kết nối, nên một kết quả DNS không thể chuyển request sang địa chỉ metadata sau bước kiểm tra. Các proxy từ biến môi trường bị vô hiệu hóa trong khi cơ chế bảo vệ đang hoạt động, và các redirect không được đi theo.
- Trang mà FlareSolverr sau đó tải về thay bạn là một chặng riêng do chính FlareSolverr phân giải. Heym không kiểm tra chặng này, nên việc giới hạn nơi container FlareSolverr được phép kết nối thuộc về chính sách mạng của bạn.
- Các triển khai self-hosted đáng tin cậy có thể gỡ bỏ quy tắc metadata bằng `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Hãy giữ giá trị mặc định trên các triển khai hosted hoặc multi-tenant.

## Liên quan

- [Node Types](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Playwright Node](./playwright-node.md) – Giải pháp thay thế cho tự động hóa trình duyệt
- [Credentials Tab](../tabs/credentials-tab.md) – Thêm credential FlareSolverr
