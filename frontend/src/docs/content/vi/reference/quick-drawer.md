# Quick Drawer

**Quick Drawer** là bảng chạy nhanh workflow ở phía bên phải. Bảng này xuất hiện trên các trang đã xác thực như tab [Workflows](../tabs/workflows-tab.md) của dashboard, Docs và Evals.

## Truy cập

- Nhấp vào nút **Quick / Workflows** cố định ở cạnh giữa bên phải màn hình
- Khi [Contextual Showcase](./contextual-showcase.md) cũng khả dụng, nút **Page Guide** của nó nằm phía trên Quick Workflows
- Bảng mở ra từ bên phải và dịch chuyển trang hiện tại sang trái với hiệu ứng thu nhỏ nhẹ
- Trên thiết bị di động, Quick Drawer bị ẩn
- Bảng không hiển thị trên trình chỉnh sửa workflow, trang đăng nhập/đăng ký, portal hoặc trang đánh giá HITL

## Tìm kiếm Workflow

Sử dụng trường lọc ở đầu bảng để tìm kiếm workflow theo:

- Tên workflow
- Mô tả workflow

Tìm kiếm không phân biệt chữ hoa chữ thường và cập nhật danh sách ngay lập tức.

## Workflow đã ghim

Ghim workflow để giữ chúng ở đầu bảng.

- Workflow đã ghim xuất hiện trong mục riêng phía trên danh sách đầy đủ
- Các ghim mới được thêm vào đầu
- Thứ tự ghim được giữ nguyên qua các lần tải lại trong bộ nhớ trình duyệt

## Chạy Workflow

Chọn một workflow để mở biểu mẫu nhập liệu của nó.

- Các trường nhập liệu được hiển thị theo chiều dọc theo thứ tự trong bảng
- Nhấp **Run Workflow** để thực thi workflow đã chọn
- Nhấp **Stop Workflow** để hủy một lượt thực thi đang chạy từ bảng
- Workflow không có trường Input vẫn có thể chạy trực tiếp
- Một workflow bắt đầu bằng [File Upload Trigger](../nodes/file-upload-trigger-node.md) sẽ hiển thị vùng thả tệp thay thế: kéo thả tệp vào đó hoặc nhấp để chọn tệp. Vùng này liệt kê các loại tệp và dung lượng mà trigger chấp nhận, đồng thời từ chối các tệp khác trước khi tải lên. Nút **Run Workflow** sẽ bị vô hiệu hóa cho đến khi bạn chọn một tệp.

Bảng sử dụng cùng API thực thi workflow như các bề mặt chạy khác của Heym, do đó kết quả đầu ra và hành vi runtime luôn nhất quán.

Dừng một lượt chạy từ bảng cũng hủy thực thi backend đang hoạt động, bao gồm mọi tác vụ trình duyệt Playwright đang xử lý cho lượt chạy workflow đó.

## Tiến trình và Kết quả

Sau khi bắt đầu một lượt chạy, bảng hiển thị:

- Tiến trình từng bước dạng streaming cho các node khi chúng bắt đầu và kết thúc
- Trạng thái cuối cùng: `success`, `error` hoặc `pending`
- Kết quả đầu ra cuối cùng trong bảng JSON thu gọn
- Các mục lịch sử được gắn thẻ `Quick Drawer`

`pending` nghĩa là workflow đang chờ một hành động tiếp theo như đánh giá của con người.

Các lượt chạy Quick Drawer là các lượt chạy sản xuất, vì vậy workflow có [giới hạn đồng thời](./webhooks.md#concurrency-limit-and-queued-runs) có thể khiến chúng phải chờ. Trong khi lượt chạy đang xếp hàng, trạng thái hiển thị **Waiting in queue (2/5)**; trạng thái sẽ chuyển sang "running" khi lượt chạy bắt đầu và hiển thị kết quả khi kết thúc mà không có tiến trình từng bước. Lượt chạy đã hết hạn trong hàng đợi hoặc bị hủy khi đang chờ sẽ kết thúc dưới dạng `error`.

Lần chạy bằng tệp sẽ đi qua liên kết tải lên dùng một lần của trigger: ngăn kéo yêu cầu workflow cấp một liên kết, tải tệp lên liên kết đó và hiển thị kết quả khi quá trình tải lên hoàn tất. Các lần chạy bằng tệp hiển thị trạng thái cuối cùng và đầu ra nhưng không có tiến trình từng bước, đồng thời cũng được gắn thẻ `Quick Drawer` trong lịch sử. Tệp đã chọn sẽ được xóa sau mỗi lần chạy vì mỗi liên kết chỉ nhận một tệp.

## Bộ nhớ trình duyệt

Quick Drawer lưu các tùy chọn cá nhân trong `localStorage`:

- ID workflow đã ghim
- Workflow được chọn gần nhất

Trong phiên bản này, bảng **không** lưu trữ giá trị nhập liệu.

## Phạm vi

Quick Drawer được thiết kế có chủ đích như một bề mặt thực thi gọn nhẹ.

- Bao gồm: tìm kiếm, ghim, chọn, nhập liệu (bao gồm cả tệp), chạy, tiến trình, kết quả
- Loại trừ: tạo workflow, chỉnh sửa, quản lý thư mục và các hành động trên canvas

## Liên quan

- [Workflows Tab](../tabs/workflows-tab.md) – Danh sách workflow chính, thư mục và quản lý
- [Quick Start](../getting-started/quick-start.md) – Xây dựng và chạy workflow đầu tiên của bạn
- [Execution History](./execution-history.md) – Xem lại các lượt chạy trước đó
- [Webhooks](./webhooks.md) – Trigger workflow qua HTTP
- [Contextual Showcase](./contextual-showcase.md) – Thanh hướng dẫn cấp trang bổ trợ cho Quick Drawer
