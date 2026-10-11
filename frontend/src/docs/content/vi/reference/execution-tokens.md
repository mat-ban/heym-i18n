# Token thực thi

Execution token là các JWT có phạm vi giới hạn, cấp quyền truy cập vào endpoint execute và stream của một workflow duy nhất. Chúng cho phép bạn gọi một workflow từ các hệ thống bên ngoài mà không cần tiết lộ token phiên người dùng dài hạn của bạn.

## Tại sao nên sử dụng Execution Token

Khi xác thực của workflow được đặt thành **JWT**, endpoint thông thường yêu cầu một phiên người dùng hợp lệ. Execution token cho phép bạn:

- Chia sẻ một token có thể gọi được với các script bên ngoài, CI pipeline hoặc các tích hợp mà không cần chia sẻ thông tin đăng nhập tài khoản của bạn.
- Giới hạn phạm vi ảnh hưởng — một token chỉ hợp lệ cho một workflow cụ thể.
- Thu hồi quyền truy cập ngay lập tức mà không cần thay đổi mật khẩu hoặc xoay vòng token phiên.
- Lựa chọn giữa token ngắn hạn (phút hoặc giờ) và token dài hạn (tối đa 10 năm).

## Tạo Token

Mở hộp thoại **Run with cURL** trong trình soạn thảo (thanh công cụ góc trên bên phải). Khi xác thực của workflow được đặt thành **JWT Token**, hộp thoại sẽ hiển thị trình quản lý token:

1. Chọn **Short-lived** hoặc **Long-lived (10yr)**.
2. Đối với token ngắn hạn, nhập thời lượng tính bằng giây (tối thiểu 60).
3. Nhấp vào **+ New Token**.

Token được tạo ngay lập tức, được thêm vào danh sách và tự động được chọn để lệnh cURL cập nhật bao gồm nó.

## Danh sách Token

Mỗi hàng token hiển thị:

| Cột | Mô tả |
|--------|-------------|
| Created | Dấu thời gian tạo |
| Status | **Expires:** ngày, **Expired**, hoặc **Revoked** |
| Eye icon | Bật/tắt hiển thị giá trị token |
| Revoke button | Đánh dấu token là đã thu hồi (không thể đảo ngược) |

Nhấp vào bất kỳ hàng đang hoạt động nào (chưa hết hạn, chưa bị thu hồi) để chọn nó. Token được chọn sẽ được nhúng vào bản xem trước lệnh cURL.

Token đã hết hạn và đã bị thu hồi vẫn hiển thị trong danh sách nhưng không thể chọn được.

## Sử dụng Token

Sao chép giá trị token từ danh sách (nhấp vào biểu tượng con mắt để hiển thị) và bao gồm nó dưới dạng token `Bearer`:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  -H "Authorization: Bearer <execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Khi bạn sử dụng **Copy cURL** trong hộp thoại với một token được chọn, token đã được nhúng sẵn trong lệnh — không cần thay thế thủ công.

## Phạm vi Token

Mỗi token mang các claim JWT sau:

| Claim | Giá trị |
|-------|-------|
| `sub` | ID người dùng của người tạo token |
| `wid` | UUID workflow — token bị từ chối đối với bất kỳ workflow nào khác |
| `scope` | `workflow:execute` — phân biệt nó với token phiên người dùng |
| `jti` | ID token duy nhất được sử dụng cho việc tra cứu thu hồi |
| `exp` | Dấu thời gian hết hạn |

Backend kiểm tra tất cả những điều này trên mỗi yêu cầu: tính hợp lệ của chữ ký, thời hạn, `wid` khớp và `jti` chưa bị thu hồi.

## Thu hồi

Nhấp vào nút thu hồi (biểu tượng vòng tròn gạch chéo) bên cạnh một token để thu hồi nó. Việc thu hồi có hiệu lực ngay lập tức — các yêu cầu tiếp theo sử dụng token đó trả về `401`. Hàng token vẫn hiển thị trong danh sách với nhãn **Revoked**.

Không có cách hoàn tác thu hồi. Tạo một token mới nếu bạn cần khôi phục quyền truy cập.

## API

Các endpoint quản lý token được xác thực bằng phiên thông thường của bạn.

| Phương thức | Đường dẫn | Mô tả |
|--------|------|-------------|
| `POST` | `/api/workflows/{id}/execution-tokens` | Tạo một token |
| `GET` | `/api/workflows/{id}/execution-tokens` | Liệt kê các token của bạn cho workflow này |
| `DELETE` | `/api/workflows/{id}/execution-tokens/{token_id}` | Thu hồi một token |

**Nội dung yêu cầu tạo:**

```json
{ "ttl_seconds": 900 }
```

**Phản hồi tạo:**

```json
{
  "id": "uuid",
  "token": "<full jwt>",
  "expires_at": "2026-04-30T15:22:00Z",
  "created_at": "2026-04-30T15:07:00Z",
  "revoked": false
}
```

Trường `token` chỉ được trả về một lần khi tạo. Hãy lưu trữ nó ngay lập tức; các yêu cầu `GET` tiếp theo trả về cùng hàng đó nhưng bạn cũng có thể hiển thị nó trong hộp thoại cURL bất cứ lúc nào.

## Phạm vi hiển thị

Mỗi người dùng chỉ nhìn thấy các token mà họ đã tạo. Các thành viên trong nhóm có quyền truy cập vào một workflow được chia sẻ không thể nhìn thấy token của nhau.

## Liên quan

- [Webhooks](./webhooks.md) — Các endpoint trigger HTTP và hộp thoại cURL
- [Security](./security.md) — Tổng quan về quản lý phiên và xác thực
- [SSE Streaming](./sse-streaming.md) — Sử dụng execution token với endpoint streaming
