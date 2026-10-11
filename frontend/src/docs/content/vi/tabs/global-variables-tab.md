# Tab Variables

Tab **Variables** quản lý **Global Variable Store** – dữ liệu key-value lâu dài được chia sẻ giữa tất cả các workflow của bạn.

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Xem demo Variables</a></p>

## Tổng quan

- Tạo, chỉnh sửa và xóa các global variable
- Các variable thuộc phạm vi người dùng và tồn tại lâu dài qua các lần thực thi workflow
- Tham chiếu trong biểu thức thông qua `$global.variableName`

## Tạo một Variable

1. Nhấp vào **New Variable**
2. Nhập **name** (được sử dụng trong biểu thức)
3. Đặt **value** (string, number, boolean, array, hoặc object)
4. Chọn **value type** (Auto, String, Number, Boolean, Array, Object)

## Chỉnh sửa và Xóa

- **Chỉnh sửa** – Nhấp vào biểu tượng chỉnh sửa trên hàng của variable
- **Xóa** – Nhấp vào biểu tượng thùng rác; các workflow đang sử dụng nó sẽ cần một giá trị thay thế
- **Xóa hàng loạt** – Chọn nhiều variable và sử dụng **Delete selected**

## Sử dụng trong Workflow

Tham chiếu các variable trong bất kỳ biểu thức nào:

```
$global.environment
$global.settings.baseUrl
```

Bạn cũng có thể đặt global variable từ một [Variable node](../nodes/variable-node.md) bằng cách bật **Store in Global Variable Store**.

## Liên quan

- [Global Variables](../reference/global-variables.md) – Hướng dẫn tham chiếu
- [Variable Node](../nodes/variable-node.md) – Đặt variable với `isGlobal`
- [Expression DSL](../reference/expression-dsl.md) – Cú pháp `$global`
- [Chat Tab](./chat-tab.md) – Chat có thể truy cập các global variable
- [Contextual Showcase](../reference/contextual-showcase.md) – Hướng dẫn trang gọn cho các bề mặt dashboard
