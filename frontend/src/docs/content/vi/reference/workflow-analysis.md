# Phân tích Workflow

**Phân tích Workflow** là một bảng điều khiển bên trái chứa một tài liệu Markdown dùng chung, có thể chỉnh sửa cho mỗi workflow. Sử dụng nó để giải thích workflow làm gì và ghi lại các ý tưởng cải tiến — đồng thời để AI tạo bản nháp đầu tiên cho bạn.

Tài liệu này được chia sẻ: mọi người có quyền truy cập workflow đều có thể đọc và chỉnh sửa nó. Nó được lưu cùng với workflow và tự động bị xóa khi workflow bị xóa.

## Mở bảng điều khiển

1. Mở một workflow trong trình chỉnh sửa.
2. Nhấp vào **Analyze** (biểu tượng Sparkles) trên thanh công cụ của trình chỉnh sửa.
3. Bảng điều khiển mở ra ở bên trái. Bảng palette node (bảng bên trái) sẽ thu gọn trong khi nó đang mở; mở lại palette node sẽ đóng bảng phân tích.

Bảng điều khiển chỉ khả dụng cho các workflow đã lưu. Với một workflow hoàn toàn mới chưa lưu, hãy lưu nó trước.

## Tài liệu

Bảng điều khiển hiển thị một tài liệu Markdown duy nhất với hai chế độ xem, được chuyển đổi bằng nút **Edit** (biểu tượng bút chì) và **Preview** (biểu tượng con mắt):

| Chế độ xem | Mục đích |
|------|---------|
| **Edit** | Trình chỉnh sửa Markdown thuần (textarea). |
| **Preview** | Markdown đã được kết xuất. |

Phần tiêu đề hiển thị **ai đã chỉnh sửa lần cuối** tài liệu và thời điểm chỉnh sửa.

### Lưu

Nhấp vào **Save** để lưu các thay đổi của bạn. Nút Save chỉ được bật khi có các chỉnh sửa chưa lưu.

Vì tài liệu được chia sẻ, việc lưu sử dụng cơ chế optimistic concurrency:

- Nếu ai đó đã lưu một phiên bản mới hơn kể từ khi bạn mở bảng điều khiển, thao tác lưu của bạn sẽ bị từ chối và một cảnh báo xuất hiện nêu tên người chỉnh sửa kia.
- Sau đó bạn có thể chọn **Reload (discard mine)** để lấy phiên bản từ máy chủ, hoặc **Overwrite** để buộc lưu phiên bản của bạn đè lên phiên bản của họ.

## Phân tích AI

Chọn một **Credential** và **Model** LLM ở đầu bảng điều khiển (danh sách model được tải từ credential đã chọn — xem [Credentials](../tabs/credentials-tab.md)). Sau đó chạy phân tích:

- **Analyze my workflow** — hiển thị khi tài liệu trống. Nó truyền trực tiếp một báo cáo Markdown do AI tạo vào trình chỉnh sửa dưới dạng bản nháp chưa lưu. Xem xét và chỉnh sửa nó, sau đó nhấp **Save**.
- **Reanalyze** — hiển thị khi tài liệu đã có nội dung. Nó truyền một báo cáo mới vào một **preview** riêng, giữ nguyên tài liệu hiện tại của bạn. Chọn **Accept** để thay thế nội dung trình chỉnh sửa bằng phân tích mới, hoặc **Discard** để giữ lại những gì bạn đã có.

Cả hai hành động trước tiên đều **chạy workflow** (khi nó hợp lệ và có thể chạy được) và đưa kết quả thực thi vào prompt phân tích, để báo cáo phản ánh cách workflow thực sự hoạt động. Nếu workflow không thể chạy, phân tích sẽ tiến hành dựa trên cấu trúc tĩnh của nó thay thế.

Báo cáo được tạo bao gồm ba phần, theo thứ tự: **Improvement areas** (các đề xuất cụ thể, bao gồm cả góc độ **security** bất cứ khi nào workflow chạm đến credential, đầu vào người dùng, yêu cầu bên ngoài, hoặc phơi bày dữ liệu), **Purpose** (Mục đích) của workflow, và **What it does** (Nó làm gì — một bước đi từng bước qua các node).

Phần **Improvement areas** luôn thực hiện bốn kiểm tra rõ ràng:

1. **Error coverage** — nếu canvas không có node [Error Handler](../nodes/error-handler-node.md) và không có error workflow nào được cấu hình, báo cáo sẽ nêu rõ điều này và đề xuất thêm xử lý lỗi.
2. **Time saved** — nếu chưa đặt thời gian tiết kiệm ước tính cho mỗi lần chạy, báo cáo đề xuất cấu hình một giá trị để chỉ số **Time Saved** của [Analytics](../tabs/analytics-tab.md) có thể được điền.
3. **Network nodes** — đối với các node thực hiện gọi mạng (như [HTTP](../nodes/http-node.md) và các node tích hợp), báo cáo đề xuất xử lý lỗi riêng cho node đó (retry và/hoặc continue-on-error) trên các node đó.
4. **Alerts** — khi không có [alerts](../tabs/alerts-tab.md) nào được cấu hình cho workflow, báo cáo đề xuất thiết lập alerts trước khi đưa lên prod.

### Chạy Analyzer từ Properties

Khi một workflow có các node trên canvas nhưng chưa có tài liệu phân tích, một nút **Run Analyzer** xuất hiện trong bảng [Properties](./canvas-features.md) ở cấp workflow (hiển thị khi không có node nào được chọn). Nó mở bảng Phân tích Workflow này để bạn có thể chọn credential và model rồi tạo báo cáo.

Mỗi lần chạy phân tích được ghi lại trong [Traces](../tabs/traces-tab.md) dưới nguồn **Workflow Analysis**.

Nếu chưa có credential LLM nào được cấu hình, nút Analyze sẽ bị vô hiệu hóa — hãy thêm một credential trong [Credentials Tab](../tabs/credentials-tab.md).

## Liên quan

- [AI Assistant](./ai-assistant.md) — tạo hoặc chỉnh sửa các node workflow từ ngôn ngữ tự nhiên.
- [Sticky Note](../nodes/sticky-note-node.md) — dành cho các ghi chú ngắn được ghim trực tiếp trên canvas.
