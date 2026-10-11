# Plugin

Node **Plugin** chạy một hành động tùy chỉnh được cung cấp bởi một plugin đã cài đặt. Plugin mở rộng Heym với các loại node mới — hành động, tích hợp bên thứ ba, hoặc bất kỳ thứ gì có thể diễn đạt bằng Python — mà không cần sửa đổi ứng dụng lõi.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1 |
| Đầu ra | `$nodeLabel.<keys returned by the plugin>` |

Một **package** plugin (một file zip) có thể chứa **nhiều node** — bất kỳ sự kết hợp nào của các hành động và trigger. Mỗi node xuất hiện trong palette dưới mục **Plugins** với tên và mô tả riêng. Kéo một node vào canvas sẽ tạo một node Plugin gắn với package đó (`pluginId`) và node (`pluginNodeKey`).

## Khi nào sử dụng

Sử dụng node Plugin khi người vận hành đã cài đặt một plugin thực hiện hành động bạn cần — ví dụ gọi một API riêng tư, giao tiếp với một hệ thống nội bộ, hoặc chạy logic tùy chỉnh được viết cho triển khai của bạn.

Đối với các plugin kiểu trigger khởi động một workflow, xem
[node Plugin Trigger](./plugin-trigger-node.md).

## Cấu hình

Biểu mẫu cấu hình của node được tạo tự động từ manifest của plugin. Mỗi trường được plugin khai báo (`string`, `number`, `boolean`, hoặc `select`) được hiển thị tự động. Các trường string không phải bí mật sử dụng đầu vào biểu thức, và các giá trị cấu hình string đã lưu bắt đầu bằng `$` được giải quyết trước khi handler của plugin chạy.

Các trường bí mật (chẳng hạn như API key) được che giấu trong UI và không bao giờ được ghi vào log.

## Cách Plugin chạy

Plugin được Heym phân phối và được người vận hành cài đặt, vì vậy mã plugin là **đáng tin cậy** và chạy trong cùng tiến trình như một node tích hợp sẵn, với quyền truy cập đầy đủ vào mạng và thư viện. Một plugin có thể khai báo các `dependencies` pip được cài đặt vào instance tại thời điểm cài đặt.

Việc cài đặt và gỡ bỏ plugin bị giới hạn cho những người vận hành có email được liệt kê trong `HEYM_PLUGIN_ADMIN_EMAILS`, và toàn bộ hệ thống con được kiểm soát bởi `HEYM_PLUGINS_ENABLED` (mặc định bị tắt). Xem
[Chạy & Triển khai](../getting-started/running-and-deployment.md) để biết các biến môi trường.

## Biểu tượng tùy chỉnh

Một plugin có thể chứa các logo SVG tùy chỉnh. Đặt một file `icon.svg` tại thư mục gốc của package để đặt mặc định cho mọi node, và/hoặc cung cấp cho một node `"icon": "<file>.svg"` riêng trong manifest. Biểu tượng hiển thị trên cả thẻ palette và node trên canvas; các node không có biểu tượng sẽ quay về glyph mảnh ghép mặc định.

## AI Builder

Các plugin đã cài đặt được hiển thị cho trợ lý AI và chat canvas, vì vậy bạn có thể yêu cầu Heym "sử dụng plugin Acme CRM để tạo một bản ghi" và nó sẽ tạo node Plugin với `pluginId` và `config` phù hợp.

## Tác giả Plugin

Để xây dựng một package plugin, xem
[Tác giả Plugin](../reference/plugin-authoring.md) để biết bố cục zip, các trường manifest, chữ ký handler, biểu tượng, dependencies, và mô hình tin cậy runtime.
