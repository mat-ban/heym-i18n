# Plugin Trigger

Node **Plugin Trigger** là phiên bản dạng trigger của
[node Plugin](./plugin-node.md). Nó được cung cấp bởi một plugin đã cài đặt có
`kind` là `trigger`, và tạo ra dữ liệu khởi tạo mà workflow bắt đầu từ đó.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 0 |
| Đầu ra | 1 |
| Đầu ra | `$nodeLabel.<keys returned by the plugin>` |

Một plugin trigger có thể đại diện cho bất kỳ nguồn nào — một ứng dụng khác, một dịch vụ
bên thứ ba, hoặc một công nghệ khác — miễn là handler của plugin trả về dữ liệu
mà workflow nên bắt đầu với nó.

## Khi nào sử dụng

Sử dụng node Plugin Trigger khi một plugin đã cài đặt định nghĩa một trigger khởi động
workflow của bạn. Đối với các plugin thực hiện một hành động giữa workflow, hãy sử dụng
[node Plugin](./plugin-node.md) thay thế.

## Cấu hình

Giống như node Plugin, biểu mẫu cấu hình được tạo từ các trường
manifest của plugin. Các trường chuỗi không bí mật sử dụng đầu vào biểu thức, và các trường
bí mật được che dấu.

## Cách Plugin chạy

Mã plugin được tin cậy (do Heym cung cấp, operator cài đặt) và chạy trong tiến trình.
Việc cài đặt bị giới hạn cho `HEYM_PLUGIN_ADMIN_EMAILS` và hệ thống con được
kiểm soát bởi `HEYM_PLUGINS_ENABLED`. Xem
[Chạy & Triển khai](../getting-started/running-and-deployment.md).

## Tác giả Plugin

Để xây dựng một gói plugin trigger, xem
[Tác giả Plugin](../reference/plugin-authoring.md) để biết bố cục zip,
các trường manifest, chữ ký handler, biểu tượng, phụ thuộc, và mô hình tin cậy
runtime.
