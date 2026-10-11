# Biến toàn cục

**Kho Biến Toàn Cục** lưu trữ dữ liệu key-value liên tục, theo phạm vi người dùng, tồn tại qua các lần thực thi workflow. Sử dụng nó cho cấu hình, cờ tính năng, bộ đếm, hoặc trạng thái chia sẻ mà nhiều workflow cần.

> **Không lưu trữ secrets ở đây.** Biến toàn cục không phải là kho secrets: các giá trị được lưu trữ không mã hóa, chúng được trả về đầy đủ cho bất kỳ ai bạn chia sẻ, và cộng tác viên có thể chỉnh sửa chúng. API keys, mật khẩu và tokens thuộc về [Credentials](./credentials.md), nơi mã hóa chúng khi lưu trữ và không bao giờ trả về secret cho client.

## Cục Bộ vs Toàn Cục

| Kho | Cú pháp | Phạm vi | Tính liên tục |
|-------|--------|-------|-------------|
| **Workflow-cục bộ** | `$vars.variableName` | Chỉ thực thi hiện tại | Trong bộ nhớ, mất khi thực thi kết thúc |
| **Toàn cục** | `$global.variableName` | Tất cả workflow của người dùng | Được lưu trữ trong cơ sở dữ liệu |

## Tạo Biến Toàn Cục

1. **Từ tab Variables** – [Tab Variables](../tabs/global-variables-tab.md): Tạo, chỉnh sửa và xóa biến trực tiếp.
2. **Từ node Variable** – Bật **Store in Global Variable Store** (`isGlobal: true`) trong thuộc tính của node. Biến được ghi vào kho khi workflow chạy.

## Sử Dụng Trong Biểu Thức

Truy cập biến toàn cục với `$global.variableName`:

```
$global.environment
$global.settings.baseUrl
$global.userId
```

Sử dụng các phương thức tương tự như biến workflow-cục bộ (ví dụ: `.upper()`, `.length`, `.add()` cho mảng).

## Các Loại Giá Trị

Các loại được hỗ trợ: `string`, `number`, `boolean`, `array`, `object`. Chọn loại khi tạo hoặc chỉnh sửa biến.

## Chia Sẻ Biến Toàn Cục

Bạn có thể chia sẻ biến toàn cục với người dùng khác hoặc [Teams](./teams.md) để họ có thể sử dụng nó trong workflow của riêng họ.

- **Chia sẻ với người dùng** – Nhấp vào biểu tượng chia sẻ bên cạnh biến bạn sở hữu, nhập email người nhận, và nhấp **Share**. Người nhận sẽ thấy biến trong danh sách Biến Toàn Cục của họ với huy hiệu **Shared** và nhãn "Shared by &lt;email của bạn&gt;".
- **Chia sẻ với team** – Trong hộp thoại chia sẻ, chọn một team và nhấp **Add**. Tất cả thành viên team có quyền truy cập.
- **Quyền chỉnh sửa** – Người nhận có thể xem, chỉnh sửa và tham chiếu biến được chia sẻ qua `$global.variableName` trong workflow của họ. Chỉ chủ sở hữu mới có thể chia sẻ, hủy chia sẻ hoặc xóa biến.
- **Xung đột tên** – Nếu người nhận đã có biến cùng tên, biến của riêng họ sẽ được ưu tiên hơn biến được chia sẻ.
- **Hủy chia sẻ** – Mở hộp thoại chia sẻ cho biến và nhấp nút **×** bên cạnh người dùng bạn muốn thu hồi quyền truy cập.

## Tích Hợp Chat

Biến toàn cục có sẵn cho trợ lý [Chat](../tabs/chat-tab.md). LLM có thể tham chiếu chúng khi trả lời câu hỏi hoặc tạo nội dung.

## Liên Quan

- [Tab Variables](../tabs/global-variables-tab.md) – Quản lý biến toàn cục trong giao diện
- [Node Variable](../nodes/variable-node.md) – Đặt biến với `isGlobal`
- [Expression DSL](./expression-dsl.md) – Cú pháp `$global`
