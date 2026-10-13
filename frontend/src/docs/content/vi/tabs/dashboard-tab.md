# Dashboard

Tab **Dashboard** là một không gian kiểu Grafana, nơi bạn xây dựng các lưới widget biểu đồ. Mỗi widget được render từ output của workflow Heym ẩn riêng của nó, vì vậy bất kỳ dữ liệu nào bạn có thể tạo ra trong một workflow — truy vấn cơ sở dữ liệu, gọi API, tra cứu RAG, output LLM — đều có thể trở thành biểu đồ. Bạn có thể giữ nhiều dashboard và chia sẻ từng dashboard với người dùng hoặc nhóm.

## Dashboards

Mọi người bắt đầu với một dashboard, được tạo lần đầu khi họ mở tab. Sử dụng bộ chọn dashboard ở đầu tab để chuyển đổi giữa các dashboard, và **+** bên cạnh để tạo dashboard mới. Bộ chọn liệt kê các dashboard của riêng bạn trước, sau đó là những dashboard được chia sẻ với bạn, được gắn nhãn với tên của người đã chia sẻ chúng.

Tab sẽ mở lại dashboard bạn đã sử dụng lần cuối, và thanh địa chỉ mang theo dashboard đang mở (`?tab=dashboard&dashboard=<id>`), vì vậy một liên kết sẽ mở đúng dashboard đó cho bất kỳ ai có quyền truy cập.

Nút cài đặt (chỉ chủ sở hữu) đổi tên dashboard, đặt loại bản ghi được chấp nhận làm [trang chi tiết](#detail-pages), quản lý chia sẻ và xóa nó. Xóa một dashboard sẽ xóa các widget và workflow của chúng. Bạn luôn giữ ít nhất một dashboard của riêng mình, vì vậy dashboard cuối cùng không thể bị xóa.

## Widgets

Một widget là một biểu đồ đơn lẻ trên lưới. Các loại biểu đồ được hỗ trợ:

- **Bar** (dọc hoặc ngang)
- **Line**
- **Area** (xu hướng được tô đầy, hỗ trợ nhiều chuỗi)
- **Pie**
- **Table** (có thể cuộn; một cột có thể hiển thị dưới dạng [nhãn trạng thái](../nodes/chart-output-node.md#status-chips), và các hàng có thể mở một [trang chi tiết](#detail-pages))
- **Numeric** (một giá trị KPI đơn lẻ với đơn vị tùy chọn)
- **Gauge** (một giá trị đơn lẻ so với khoảng min–max, ví dụ: phần trăm)
- **Scatter** (các điểm X/Y cho biểu đồ tương quan)
- **Proportion** (một thanh được chia thành các phần với chú giải phần trăm, ví dụ: phân bổ ngôn ngữ)
- **Bar gauge** (một gauge ngang cho mỗi hàng với gradient đỏ→xanh và một giá trị, ví dụ: dung lượng đĩa trống)
- **Text** (một thông điệp markdown, ví dụ: ghi chú trạng thái như "Lần thực thi cuối lúc 19:47"; hỗ trợ [hộp kiểm tương tác](../nodes/chart-output-node.md#interactive-task-lists) khi markdown là tĩnh, và [danh sách đánh số rõ ràng](../nodes/chart-output-node.md#numbered-lists) cho đánh số tùy chỉnh hoặc giảm dần)
- **HITL** (các đánh giá thủ công đang chờ của bạn. Tiêu đề hiển thị `1/n pending`. Tên workflow mở lần chạy đó trên canvas. **Approve**, **Request changes**, và **Reject** giải quyết nó. Biểu tượng lịch sử bên cạnh tiêu đề widget mở lần chạy đó trong hộp thoại lịch sử trên trang này. Widget không sử dụng các hàng upstream, và mỗi người thấy hàng đợi của riêng họ)

Bên cạnh biểu đồ, widget **Run a workflow** chạy một trong các workflow của bạn ngay từ dashboard: trên tệp được thả vào, với các trường đầu vào của nó hoặc bằng nút Run; xem [Widget chạy workflow](#run-widgets).

Mỗi widget tải dữ liệu của nó một cách bất đồng bộ khi bạn mở tab, vì vậy trang vẫn phản hồi nhanh trong khi các biểu đồ được điền dữ liệu.

## Thêm một widget

1. Nhấp vào **Add widget**, đặt tiêu đề cho nó, và chọn một loại biểu đồ. Bên dưới bộ chọn, hộp thoại vẽ một ví dụ của loại biểu đồ đó với dữ liệu mẫu và nêu tên các hàng mà nó mong đợi, để bạn có thể so sánh các loại trước khi xây dựng bất cứ thứ gì.
2. Widget mở trong trình chỉnh sửa workflow với một đồ thị khởi đầu: một node [Set](../nodes/set-node.md) tạo ra các hàng, được kết nối với một node [Chart Output](../nodes/chart-output-node.md). Thay thế node Set bằng bất kỳ nguồn dữ liệu nào. Một widget **HITL** chỉ là node Chart Output; nó đọc các đánh giá đang chờ của bạn và không cần nguồn dữ liệu.
3. Xây dựng workflow sao cho node cấp dữ liệu cho **Chart Output** tạo ra một mảng các hàng, sau đó cấu hình ánh xạ trường của node Chart Output (trường nhãn, trường giá trị, v.v.).
4. Lưu, quay lại tab Dashboard, và widget sẽ render.

Đối với widget **Run a workflow**, hãy chọn workflow mà nó sẽ chạy; bộ chọn sẽ cho biết cách widget chạy từng workflow. Widget được thêm trực tiếp vào lưới mà không cần xây dựng workflow mới.

Nhấp đúp vào một widget (hoặc sử dụng nút chỉnh sửa của nó) để mở lại workflow của nó bất cứ lúc nào. Sử dụng **Clone widget** trong tiêu đề widget để nhân bản cả widget và workflow hoàn chỉnh của nó. Bản sao được đặt bên dưới bản gốc và được gắn nhãn **(Copy)** để bạn có thể chỉnh sửa nó một cách độc lập.

## Trang chi tiết

Một widget bảng có thể liên kết các hàng của nó với một dashboard khác, khi đó dashboard kia hoạt động như một trang chi tiết: một dashboard duy nhất phục vụ cho mọi khách hàng, hóa đơn hoặc yêu cầu hỗ trợ (ticket).

1. Mở **Settings** của widget bảng và chọn dashboard trong mục **Row link**.
2. Nhập **Record column**, cột có giá trị dùng để định danh hàng (ví dụ `id`), và tùy chọn **Label column** dùng để đặt tên cho hàng đó (ví dụ `name`).
3. Lưu lại. Nhấp vào một hàng (hoặc đưa tiêu điểm vào hàng đó rồi nhấn Enter) sẽ mở dashboard được liên kết với `?record=<value>&label=<name>`.

Trên dashboard chi tiết, mọi workflow của widget đều đọc giá trị này dưới dạng `$page.record` (xem [Chart Output](../nodes/chart-output-node.md#detail-pages-pagerecord)), và trang hiển thị `Dashboard / <label>` phía trên lưới cùng với nút để xóa bản ghi. Nút Quay lại sẽ đưa bạn trở về bảng ban đầu.

- **Ai có thể mở.** Các hàng chỉ có thể nhấp đối với những người xem có quyền mở dashboard được liên kết. Những người khác sẽ thấy cùng bảng đó nhưng không có liên kết.
- **Định dạng bản ghi.** Bản ghi đến từ URL, vì vậy dashboard chi tiết sẽ quyết định những gì nó chấp nhận. Trong phần cài đặt, **Detail page records** là một trong các loại: ID (chữ cái, chữ số, `-`, `_` và `.`, tối đa 128 ký tự; mặc định), số, UUID hoặc địa chỉ email. Bất kỳ giá trị nào khác đều bị từ chối trước khi widget chạy, và các widget sẽ hiển thị "This page does not accept that record".
- **Vẫn chạy với tư cách chủ sở hữu.** Trên trang chi tiết, các widget vẫn chạy với tư cách chủ sở hữu dashboard. Người xây dựng chỉ nên truyền `$page.record` ở những nơi nút thực hiện escape giá trị đó, không bao giờ đưa trực tiếp vào văn bản truy vấn.
- **Bộ nhớ đệm.** Mỗi widget lưu biểu đồ vào bộ nhớ đệm theo từng bản ghi, với cùng thời gian sống (TTL) như widget, và giữ lại 50 bản ghi được sử dụng gần nhất.

## Widget chạy workflow

Một widget **Run a workflow** chạy một trong các workflow của bạn và hiển thị kết quả: trạng thái, thời gian chạy và đầu ra. Nội dung hiển thị phụ thuộc vào đầu vào mà workflow nhận:

- **Một tệp.** Đối với workflow bắt đầu bằng [File Upload Trigger](../nodes/file-upload-trigger-node.md), hãy thả một tệp vào đó (hoặc nhấp để chọn) và widget sẽ tải tệp lên thông qua liên kết tải lên dùng một lần của trigger. Widget hiển thị các loại tệp và kích thước mà trigger chấp nhận, đồng thời từ chối các tệp khác trước khi tải lên. Khi workflow cũng bắt đầu bằng nút Text Input, widget sẽ hiển thị các trường của nút đó bên cạnh vùng thả tệp: chọn tệp, điền các trường và nhấn **Run** để gửi cả hai. Các giá trị được truyền kèm theo liên kết tải lên do widget tạo ra, vì vậy một liên kết tải lên được chia sẻ không thể tự thiết lập chúng.
- **Các trường đầu vào.** Đối với workflow bắt đầu bằng nút Text Input, widget hiển thị các trường cùng giá trị mặc định của chúng; **Run** sẽ chạy workflow với các giá trị bạn nhập. Giá trị của những trường không có trong workflow sẽ bị loại bỏ.
- **Không có đầu vào.** Một workflow không có đầu vào sẽ có một nút **Run**.

Nút **Wrap** ở phần kết quả giúp ngắt dòng các dòng đầu ra dài bên trong khung; hãy tắt nút này để đọc bố cục JSON của đầu ra.

- Bất kỳ ai có thể mở dashboard đều có thể chạy widget, giống như bất kỳ ai cũng có thể làm mới biểu đồ. Quyền truy cập vào workflow thuộc về chủ sở hữu dashboard: việc thêm widget yêu cầu một workflow mà cả bạn và chủ sở hữu đều có thể chạy, và bản thân lần chạy sẽ sử dụng thông tin xác thực của chủ sở hữu workflow, giống như mọi liên kết tải lên khác.
- Kết quả hiển thị trên màn hình của bạn cho đến khi bạn rời khỏi trang; những người xem khác không thấy tệp, giá trị hay kết quả của bạn. Lần chạy xuất hiện trong lịch sử thực thi với trigger `dashboard`.
- Việc chia sẻ dashboard không bao giờ cấp quyền truy cập vào chính workflow đó. **Edit workflow** chỉ mở workflow cho những người đã có quyền truy cập, và **Fine-tune with AI** không được cung cấp.
- Các lần chạy có tệp được thực thi trên instance chính, nơi lưu trữ các tệp tải lên, giống như mọi lần chạy của File Upload Trigger.

## Tạo một widget bằng AI

Nhấp vào **AI**, mô tả chỉ số bạn muốn (ví dụ: "tỷ lệ thành công của workflow trong 30 ngày qua dưới dạng biểu đồ bar"), và chọn một credential LLM và model. Heym tạo ra một workflow widget hoàn chỉnh kết thúc bằng một node Chart Output và thêm nó vào lưới. Xem [Chart Output](../nodes/chart-output-node.md#example-ai-prompts) để biết các prompt ví dụ cho từng loại biểu đồ.

Sử dụng nút **Fine-tune with AI** của một widget để chỉnh sửa một widget hiện có với một hướng dẫn mới. Mỗi lần tinh chỉnh bằng AI sẽ chụp nhanh workflow trước đó vào **Edit History** của widget, để bạn có thể xem lại hoặc khôi phục các thay đổi từ trình chỉnh sửa workflow.

## Chỉnh sửa bố cục

Bật **Edit** để vào chế độ chỉnh sửa, nơi bạn có thể kéo các widget và thay đổi kích thước chúng trên một lưới 12 cột. Các thay đổi bố cục được lưu tự động. Tiêu đề widget có thể chỉnh sửa trực tiếp từ tiêu đề widget.

## Bộ nhớ đệm và làm mới

Mỗi widget lưu vào bộ nhớ đệm dữ liệu được tính toán lần cuối trên server trong một khoảng thời gian sống (TTL) có thể cấu hình. Trong khi bộ nhớ đệm còn mới, việc mở lại dashboard sẽ phục vụ kết quả đã lưu thay vì chạy lại workflow. Bộ nhớ đệm được thay thế tại chỗ mỗi khi dữ liệu được tính toán lại (một bộ nhớ đệm cho mỗi widget, cộng thêm một bộ nhớ đệm cho mỗi bản ghi trên [trang chi tiết](#detail-pages)), và nó tự động bị vô hiệu hóa khi bạn chỉnh sửa workflow của widget.

Sử dụng nút **Refresh** của một widget (hoặc **Refresh** trong thanh công cụ) để bỏ qua bộ nhớ đệm và tính toán lại ngay lập tức.

## Chia sẻ

Chủ sở hữu chia sẻ dashboard từ phần cài đặt của nó, với từng người dùng (qua email) hoặc với bất kỳ [team](teams-tab.md) nào mà họ thuộc về. Mỗi lượt chia sẻ là **Read** (Chỉ đọc) hoặc **Write** (Chỉnh sửa); khi ai đó vừa có chia sẻ cá nhân vừa có chia sẻ qua team, quyền cao hơn sẽ được áp dụng.

| Hành động | Chủ sở hữu | Write | Read |
|--------|:-----:|:-----:|:----:|
| Xem widget, làm mới chúng, dùng tự động làm mới | ✓ | ✓ | ✓ |
| Mở trang chi tiết, chạy các widget chạy workflow | ✓ | ✓ | ✓ |
| Thêm, nhân bản, xóa, đổi tên và thay đổi kích thước widget; AI tạo và tinh chỉnh; đánh dấu các mục trong checklist | ✓ | ✓ | |
| Mở workflow của một widget trong trình chỉnh sửa | ✓ | ✓ | |
| Đổi tên hoặc xóa dashboard, đặt định dạng bản ghi, quản lý chia sẻ | ✓ | | |

**Widget luôn chạy dưới danh nghĩa chủ sở hữu dashboard.** Bất kể ai đang xem, một widget đều dùng thông tin xác thực và biến toàn cục của chủ sở hữu, và các lần chạy của nó xuất hiện trong lịch sử thực thi và trace của chủ sở hữu. Nhờ đó, các thành viên trong team thấy cùng một dữ liệu mà không cần quyền truy cập vào các tài khoản đứng sau nó, và mọi người xem đều dùng chung một kết quả được lưu trong bộ nhớ đệm cho mỗi widget. Các widget mà một cộng tác viên có quyền write thêm vào hoặc nhân bản cũng thuộc về chủ sở hữu.

Vì lý do này, **Write** mang mức độ tin cậy tương đương với việc chia sẻ một workflow để chỉnh sửa: một cộng tác viên có quyền write có thể thay đổi những gì chạy bằng thông tin xác thực của bạn. Chỉ nên cấp quyền này cho những người mà bạn sẵn sàng cho phép chỉnh sửa workflow của mình. Một lần chạy thử do cộng tác viên khởi tạo từ trình chỉnh sửa workflow sẽ dùng thông tin xác thực của chính họ, giống như với bất kỳ workflow được chia sẻ nào; chỉ có bản thân dashboard là chạy dưới danh nghĩa chủ sở hữu. **Read** không cấp quyền truy cập vào các workflow của widget, và người xem chỉ đọc nhận được chính biểu đồ đó nhưng không nhận được chi tiết thực thi theo từng node đứng sau nó.

Việc gỡ bỏ một lượt chia sẻ, hoặc hạ nó từ write xuống read, có hiệu lực ngay lập tức.

## Liên quan

- [Node Chart Output](../nodes/chart-output-node.md)
- [Tab Analytics](analytics-tab.md) — các chỉ số thực thi tích hợp sẵn (khác với dashboard do người dùng tự tạo)
