# Tab Workflows

Tab **Workflows** là chế độ xem mặc định của dashboard. Nó hiển thị danh sách workflow, cấu trúc thư mục và cho phép bạn tạo, chỉnh sửa và sắp xếp các workflow.

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Xem demo Workflows</a></p>

## Bắt đầu một Chat

Phía trên danh sách workflow có một hộp chat chào bạn bằng tên và hỏi bạn muốn tự động hóa điều gì. Nhập một prompt, tùy chọn đính kèm một tệp và chọn credential cùng model bạn muốn. Cả hai dropdown đều có thể tìm kiếm và khởi tạo theo [AI defaults](../reference/user-settings.md) của bạn.

Gửi sẽ tạo một cuộc trò chuyện mới và mở nó trong [tab Chat](./chat-tab.md), nơi phản hồi được stream về. Các tệp đính kèm được hỗ trợ là tệp văn bản, hình ảnh và PDF, mỗi tin nhắn một tệp, giống như trình soạn chat.

Nếu bạn chưa có LLM credential, hộp sẽ hiển thị liên kết đến [tab Credentials](./credentials-tab.md) và việc gửi sẽ bị vô hiệu hóa.

Nhấp vào **x** để ẩn hộp. Nút **Ask AI** sau đó xuất hiện bên cạnh tiêu đề Workflows và đưa nó trở lại. Lựa chọn này được ghi nhớ trong trình duyệt của bạn.

## Danh sách Workflow

Danh sách là chế độ xem hai khung: workflow và thư mục ở bên trái, bản xem trước của workflow được chọn ở bên phải.

- Mỗi hàng hiển thị biểu tượng workflow, tên, mô tả, thời điểm cập nhật lần cuối và [status chip](#workflow-status)
- Workflow có thể nằm ở thư mục gốc hoặc bên trong thư mục, và các workflow được ghim xuất hiện trong nhóm **Pinned** riêng ở trên cùng
- **Nhấp** vào một hàng để chọn nó và tải bản xem trước ở bên phải
- **Nhấp đúp** vào một hàng, hoặc nhấn **Enter** khi hàng đó được focus, để mở nó trong [editor](../getting-started/quick-start.md)
- Dùng **Ctrl+click** (hoặc **Cmd+click**) để mở trong tab mới
- Mỗi hàng có các hành động chỉnh sửa, sao chép, ghim và xóa ở bên phải. Trên điện thoại, chúng bị ẩn để tên giữ toàn bộ chiều rộng; **nhấn giữ** một hàng ở đó để mở bảng hành động
- Ghim các workflow thường dùng trong [Quick Drawer](../reference/quick-drawer.md) để bạn có thể chạy nhanh chúng từ tab Workflows và các trang nội bộ khác

## Xem trước Workflow

Chọn một workflow sẽ điền vào bảng xem trước bên cạnh danh sách. Trên màn hình hẹp hơn 1280px, cùng bảng đó sẽ mở dưới dạng sheet từ cuối màn hình.

Bảng hiển thị:

- Tên workflow, ai đã tạo và khi nào, cùng thời điểm chỉnh sửa lần cuối
- **Open Workflow** – mở workflow trong editor
- **Run Now** – mở workflow trong [Quick Drawer](../reference/quick-drawer.md), nơi bạn điền các input của nó và bắt đầu chạy mà không cần rời khỏi danh sách
- **Description** – mô tả của workflow
- **Trigger Configuration** – lịch trình cho một cron workflow, hoặc listening trigger cho một event workflow. Các workflow được gọi qua HTTP sẽ hiển thị nút **Copy cURL** thay vì endpoint thô và phần mô tả auth: nó sao chép một request hoàn chỉnh với URL, headers, auth placeholder đúng và một body được tạo từ các trường input của workflow. Khi workflow công bố một [portal](../reference/portal.md), liên kết chat công khai của nó cũng xuất hiện ở đây
- **Last Run Details** – kết quả và thời lượng của lần chạy gần nhất, hoặc ghi chú rằng workflow chưa từng chạy
- **Workflow Steps & Sub-agents** – các node theo thứ tự thực thi, mỗi node kèm model, thao tác hoặc lịch trình và một dấu chấm cho biết nó có đang hoạt động hay không. Chọn một bước sẽ mở node đó trong editor với bảng thuộc tính của nó đã được mở sẵn

Bảng này được ghim bên cạnh danh sách trong khi bạn cuộn, nên nó vẫn dễ đọc trong một danh sách workflow dài.

## Quản trị Instance

Các tài khoản được liệt kê trong `HEYM_ADMIN_EMAILS` có thể liệt kê, mở, chỉnh sửa, xem lịch sử thực thi và xóa bất kỳ workflow nào trên instance mà không cần chia sẻ hay chuyển quyền sở hữu. Cài đặt này là danh sách các địa chỉ email phân tách bằng dấu phẩy, được so khớp không phân biệt chữ hoa chữ thường. Danh sách trống sẽ không cấp quyền truy cập này cho bất kỳ ai. Khởi động lại backend sau khi thay đổi.

Quản trị viên nhìn thấy email của chủ sở hữu trong danh sách workflow và có thể tìm kiếm theo địa chỉ đó. Chọn một workflow để mở **Quản trị Instance** trong bản xem trước của nó:

1. **Tạm dừng trigger** chỉ hiển thị với các workflow chứa node Cron. Thao tác này vô hiệu hóa Cron của workflow và các node trigger tự động khác thông qua một lần lưu có phiên bản thông thường. Các lượt chạy hiện có có thể hoàn tất. Các lệnh gọi thủ công, API, portal và sub-workflow vẫn khả dụng; hành động này không phải là khóa thực thi toàn bộ workflow.
2. Nút này chuyển thành **Tiếp tục trigger** khi đang tạm dừng, kể cả sau khi tải lại trang. Tiếp tục sẽ kích hoạt lại các trigger đã bị quản trị viên tạm dừng và giữ nguyên các trigger vốn đã bị vô hiệu hóa. Với các workflow bị tạm dừng cũ không có trạng thái tạm dừng của quản trị viên được lưu, Tiếp tục sẽ kích hoạt các trigger tự động của chúng.
3. Sử dụng hành động **Xóa workflow** trên dòng của workflow sau khi các lượt chạy đã lắng xuống. Việc xóa sẽ trả về xung đột khi vẫn còn công việc đang chạy, đang xếp hàng hoặc đang chờ duyệt. Việc xóa theo lịch cũng áp dụng kiểm tra tương tự.

Hãy tạm dừng trigger và để các lượt chạy hiện có hoàn tất trước khi xóa. Một trigger đã được gửi đi khi bị tạm dừng vẫn có thể hoàn tất. Dùng việc xóa khi workflow không còn được phép gọi nữa.

Các webhook secret và cài đặt xác thực chỉ dành cho chủ sở hữu vẫn giữ nguyên các biện pháp bảo vệ hiện có. Việc quản trị không chuyển quyền sở hữu cũng không chia sẻ các bản ghi credential của chủ sở hữu. Các hành động tạm dừng, tiếp tục, xóa và lên lịch của quản trị viên xuất hiện trong [audit trail](../reference/audit.md) kèm theo quản trị viên thực hiện và chủ sở hữu workflow.

## Trạng thái Workflow

Mỗi dòng mang một chip trạng thái được suy ra từ các node trigger của workflow, trạng thái chạy trực tiếp của nó,
và — với các workflow không có node trigger — cách lượt chạy gần nhất của nó được khởi động:

| Trạng thái | Ý nghĩa |
| --- | --- |
| **Running** | Workflow đang có một tiến trình thực thi diễn ra ngay lúc này |
| **Scheduled** | Nó có một trigger [cron](../nodes/cron-node.md) đang hoạt động |
| **Listening** | Nó có một event trigger đang hoạt động, chẳng hạn như trigger Slack, Telegram, IMAP hoặc WebSocket |
| **Paused** | Nó có các node trigger, nhưng tất cả đều đã bị vô hiệu hóa |
| **API** | Nó không có node trigger và lần chạy gần nhất là do một lệnh gọi HTTP đến endpoint execute của nó |
| **SubWorker** | Nó không có node trigger và lần chạy gần nhất là với vai trò sub-workflow bởi một workflow cha |
| **Portal** | Nó không có node trigger và lần chạy gần nhất là từ [portal](../reference/portal.md) của nó |
| **WEB** | Nó không có node trigger và đầu cuối duy nhất của nó là một [HTML output mapper](../nodes/html-output-mapper-node.md), nên khi gọi nó sẽ trả về một trang web đã kết xuất |
| **Manual** | Nó không có node trigger và chưa từng chạy, hoặc lần chạy gần nhất đến từ nơi khác |
| **Remove Scheduled** | Nó đang [được lên lịch để xóa](../reference/workflow-organization.md) |

Các chip API, SubWorker và Portal đọc mục gần nhất duy nhất trong
[lịch sử thực thi](./logs-tab.md) của workflow, nên một workflow được gọi theo hai cách sẽ hiển thị cách nào đến sau. **WEB** được quyết định từ graph thay vào đó, nên nó được ưu tiên hơn ba chip kia: một workflow phục vụ trang web sẽ hiển thị WEB ngay cả sau khi đã được gọi qua HTTP. Các node trigger luôn thắng tất cả: một workflow cron mà ai đó cũng gọi qua HTTP vẫn giữ trạng thái **Scheduled**.

Sử dụng dropdown **Status** bên cạnh trường tìm kiếm để chỉ hiển thị một trạng thái. Dropdown liệt kê số lượng workflow hiện khớp với mỗi trạng thái. Bộ lọc trạng thái cũng đi vào bên trong các thư mục: các thư mục có kết quả khớp sẽ được mở rộng tự động, và các thư mục không có sẽ bị ẩn cho đến khi bạn xóa bộ lọc.

## Workflow đang hoạt động

Trên desktop, huy hiệu hình tròn trong thanh công cụ trên cùng hiển thị số lượng workflow đang
chạy và tự động làm mới mỗi 10 giây. Nhấp vào huy hiệu khác không để mở danh sách workflow đang hoạt động, danh sách này hiển thị tối đa bốn dòng trước khi cuộn. Chọn tên một workflow để gắn trình chỉnh sửa vào chế độ xem trực tiếp của lượt chạy đó. Huy hiệu số không chỉ mang tính thông tin và không thể mở, và huy hiệu bị ẩn trên màn hình di động.

## Tìm kiếm

Sử dụng trường tìm kiếm workflow bên cạnh **Status**, hoặc nhấn **Ctrl+F** (hoặc **Cmd+F**), để lọc workflow theo tiêu đề hoặc mô tả. Các workflow khớp bên trong thư mục được hiển thị với các nhánh thư mục của chúng được mở rộng. Nhấn **Escape** để xóa tìm kiếm.

## Thư mục

- Sắp xếp các workflow vào [thư mục và thư mục con](../reference/workflow-organization.md)
- Tạo thư mục bằng nút **New Folder**, đặt tên cho mỗi thư mục và mô tả tùy chọn hiển thị bên dưới tên thư mục trong danh sách
- Mỗi hàng thư mục hiển thị số lượng workflow chứa trong đó, bao gồm cả thư mục con, cùng với các thao tác tạo thư mục con mới, đổi tên, thay đổi biểu tượng, tải xuống dưới dạng ZIP và xóa. Trên điện thoại, hàng đó chỉ hiển thị một nút menu duy nhất
- Kéo một workflow qua một thư mục hoặc thư mục con để xem bản xem trước đích có kích thước bằng thẻ. Bản xem trước
  được làm nổi bật hiển thị toàn bộ đường dẫn thư mục trước khi bạn thả, và khi di chuột qua một thư mục
  đã thu gọn, thư mục đó sẽ tạm thời mở rộng để bạn có thể truy cập các thư mục lồng nhau.
- Kéo workflow giữa các thư mục hoặc về thư mục gốc. Thẻ được kéo vẫn hiển thị dưới dạng bóng mờ,
  và đích đang hoạt động vẫn được làm nổi bật trong khi bạn cuộn.
- Việc thả một workflow trở lại thư mục hiện tại của nó bị vô hiệu hóa và được đánh dấu **Already in Folder**.
- Đổi tên thư mục hoặc thay đổi mô tả của thư mục từ thao tác đổi tên hoặc menu ngữ cảnh nhấp chuột phải

## Tạo Workflow

1. Nhấp vào **New Workflow**
2. Nhập tên và mô tả tùy chọn
3. Workflow mở ra trong trình chỉnh sửa

## Import

Kéo và thả một tệp workflow JSON vào khu vực workflow để tạo một workflow mới. Các node và edge được import sẽ được dùng để tạo workflow; tên được lấy từ trường `name` trong JSON hoặc từ tên tệp. Xem [Download & Import](../reference/download-import.md) để biết định dạng JSON và các tùy chọn import.

## Chia sẻ

Mở một workflow trong trình chỉnh sửa và nhấp vào **Share** để mời người dùng qua email hoặc chia sẻ với một [team](./teams-tab.md). Chọn **Read** (xem và chạy) hoặc **Write** (cũng có thể chỉnh sửa) cho từng người dùng hoặc team, và thay đổi sau đó từ menu thả xuống bên cạnh mục đó. Credentials và sub-workflow không được chia sẻ tự động; hãy chia sẻ riêng những thứ đó với cùng người dùng hoặc team. Xem [Workflow Organization](../reference/workflow-organization.md#sharing-workflows) và [Credentials Sharing](../reference/credentials-sharing.md).

## Chỉnh sửa và Xóa

- **Edit** – Thay đổi tên và mô tả workflow từ thao tác chỉnh sửa của hàng
- **Delete** – Workflow được [lên lịch xóa](../reference/workflow-organization.md); chúng được chuyển vào khu vực thùng rác trước khi bị xóa vĩnh viễn

## Chỉnh sửa đồng thời

Khi lưu, hệ thống sẽ gửi revision mà các chỉnh sửa của bạn dựa trên đó, và máy chủ sẽ từ chối ghi nếu workflow đã thay đổi trong khoảng thời gian đó — ví dụ vì một đồng nghiệp đã lưu nó, hoặc bạn để cùng một workflow mở trong một tab thứ hai. Heym sau đó hiển thị hộp thoại **Stale Workflow Detected** với hai lựa chọn:

- **Cancel** – Giữ các thay đổi chưa lưu của bạn trong trình chỉnh sửa để bạn có thể tải lại trong một tab khác và dung hòa chúng
- **Override** – Vẫn lưu, thay thế phiên bản của người khác

Việc **Running** một workflow sẽ lưu nó trước, nên nó cũng đi qua cùng bước kiểm tra đó. Nếu workflow đã thay đổi bên dưới bạn, lần chạy sẽ tạm dừng ở hộp thoại thay vì ghi đè một cách âm thầm: **Override and Run** lưu phiên bản của bạn và bắt đầu chạy, **Cancel Run** hủy bỏ cả hai và giữ nguyên các chỉnh sửa của bạn.

Bước kiểm tra là một phần của chính yêu cầu lưu, nên nó không tốn thêm một lượt round trip nào và không có khoảng thời gian nào mà một lần lưu có thể lọt qua nó. Các thay đổi của chính bạn từ nơi khác trong ứng dụng — đổi tên, thay đổi cài đặt, bật/tắt trong bảng thuộc tính — không bao giờ bị tính là xung đột.

## Command Palette

Nhấn **Ctrl+K** (hoặc **Cmd+K**) để mở command palette. Bạn có thể:
- Tìm kiếm workflow theo tên
- Chuyển đến bất kỳ [dashboard tab](./credentials-tab.md) nào
- Mở các workflow gần đây

## Liên quan

- [Quick Start](../getting-started/quick-start.md) – Xây dựng workflow đầu tiên của bạn
- [Workflow Organization](../reference/workflow-organization.md) – Thư mục, thư mục con và lên lịch xóa
- [Workflow Structure](../reference/workflow-structure.md) – Định dạng JSON cho workflow
- [Download & Import](../reference/download-import.md) – Xuất và import workflow dưới dạng JSON
- [Portal](../reference/portal.md) – Đưa workflow ra thành các giao diện chat công khai
- [Board](./board-tab.md) – Chạy workflow từ các thẻ kanban thông qua chuỗi cột
- [Core Concepts](../getting-started/core-concepts.md) – Workflow, node và thực thi
- [Execution History](../reference/execution-history.md) – Xem các lần chạy trước đó và Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Ghim và chạy workflow từ dashboard, tài liệu và các trang không phải trình chỉnh sửa khác
- [Contextual Showcase](../reference/contextual-showcase.md) – Hướng dẫn ngắn gọn về trang cho các bề mặt dashboard
