# Lịch sử thực thi

Lịch sử thực thi ghi lại các lần chạy workflow: inputs, outputs, kết quả từng node, trạng thái và nguồn trigger. Sử dụng tính năng này để theo dõi một lần chạy production đang hoạt động, kiểm tra các lần chạy trước đó, debug lỗi hoặc chạy lại với cùng inputs thông qua **Bring to Canvas**.

## Tổng quan

Mỗi lần thực thi lưu trữ:

| Trường | Mô tả |
|-------|-------------|
| **Inputs** | Request body hoặc inputs của lần chạy (ví dụ: `text` cho node Input) |
| **Outputs** | Outputs ở cấp workflow |
| **Node results** | Outputs, trạng thái và thời gian thực thi của từng node |
| **Status** | `success`, `error`, `pending`, `skipped` hoặc `failed` (xem [Crash Recovery](#crash-recovery)) |
| **trigger_source** | Cách lần chạy được kích hoạt (xem [Triggers](./triggers.md)) |

## Truy cập Lịch sử

| Vị trí | Phạm vi |
|----------|-------|
| Thanh công cụ **Editor** | Chỉ workflow hiện tại |
| Tiêu đề view **Docs** | Chỉ workflow hiện tại |
| Tiêu đề **Dashboard** (tab Chat) | Tất cả workflows + các lần chạy chat/assistant |
| Tiêu đề view **Evals** | Tất cả workflows + các lần chạy chat/assistant |

Nhấp vào nút **History** (biểu tượng đồng hồ) để mở hộp thoại.

## Lịch sử theo từng workflow và Toàn bộ Lịch sử

- **Theo từng workflow** (Editor, Docs): Hiển thị các lần chạy của workflow bạn đang mở. Sử dụng **Clear history** để xóa các lần chạy chỉ của workflow đó.
- **Toàn bộ Lịch sử** (Dashboard, Evals): Hiển thị các lần chạy trên tất cả workflows và các phiên chat/assistant. Phạm vi khớp với quyền truy cập workflow: các workflow bạn sở hữu, các workflow được chia sẻ trực tiếp với bạn và các workflow được chia sẻ với team mà bạn thuộc về. Sử dụng **Clear all history** để xóa tất cả bản ghi bạn sở hữu. Lịch sử của các workflow được chia sẻ sẽ được giữ lại.

## Bring to Canvas

**Bring to Canvas** tải inputs và node outputs của một lần chạy đã chọn vào workflow hiện tại.

### Những gì được tải

- **Inputs** → Bảng input của lần chạy (ví dụ: `text` cho node Input hoặc các trường tùy chỉnh)
- **Node results** → Bảng kết quả thực thi hiển thị outputs trước đó theo từng node
- **Execution result** → Trạng thái, outputs và thời gian của lần chạy

### Hành vi theo ngữ cảnh

- **Trong Editor** (lịch sử theo từng workflow): Áp dụng ngay lập tức cho workflow đang mở và đóng hộp thoại.
- **Từ Toàn bộ Lịch sử** (Dashboard/Evals): Điều hướng đến editor của workflow, sau đó áp dụng dữ liệu khi editor tải xong. Chỉ khả dụng cho các lần chạy workflow — không áp dụng cho các lần chạy chat/assistant.

### Deep link thực thi

Mở một workflow tại `/workflows/{workflowId}/{executionId}` sẽ tự động đưa lần thực thi đó lên canvas — giống như chọn lần chạy và chọn **Bring to Canvas**. Điều này giúp một lần chạy cụ thể trong quá khứ có thể chia sẻ được dưới dạng URL. Nếu không tìm thấy lần thực thi (id sai hoặc đã bị xóa), editor sẽ quay về tải workflow thông thường.

### Các trường hợp sử dụng

- Chạy lại một workflow với cùng inputs
- Debug một lần chạy thất bại bằng cách kiểm tra inputs và node outputs
- So sánh outputs giữa các lần chạy

## Hỏi AI

Cả hai hộp thoại lịch sử đều có nút **Hỏi AI** (biểu tượng lấp lánh) bên cạnh tiêu đề. Nút này mở [tab Chat](../tabs/chat-tab.md#asking-about-a-run) trong một cuộc trò chuyện mới có đính kèm workflow và lần chạy đã chọn dưới dạng các chip có thể tháo rời. Hãy hỏi lý do lần chạy bị chậm, điều gì đã thất bại hoặc yêu cầu Chat sửa workflow. Chat đọc chính xác lần chạy đó, bao gồm cả dấu vết và lỗi trên từng node.

Trong hộp thoại All History, **Hỏi AI** chỉ xuất hiện khi một lần chạy workflow được chọn; các lần chạy chat và trợ lý không hiển thị nút này.

## Dòng thời gian chạy

Trong chi tiết lần chạy, nút **Dòng thời gian** (biểu tượng đồng hồ bấm giờ) bên cạnh **Mở rộng tất cả** sẽ hoán đổi danh sách **Các bước** thành dòng thời gian span. Trong khi dòng thời gian hiển thị, nút này sẽ ghi là **Nhật ký**; nhấp vào đó để quay lại danh sách. Trong All History, nút này chỉ xuất hiện cho các lần chạy workflow. Dòng thời gian vẽ một thanh cho mỗi node tại thời điểm nó bắt đầu, để bạn có thể thấy node nào mất bao lâu và node nào chạy song song. Di chuột qua thanh để xem thời lượng; nhấp vào đó để mở cùng một thanh kiểm tra chi tiết như [dòng thời gian thực thi](#execution-timeline-details) của trình chỉnh sửa. Chế độ xem bạn chọn vẫn được duy trì trong suốt thời gian hộp thoại mở.

Các lần chạy được ghi lại trước khi lưu thời gian bắt đầu của node được sắp xếp nối tiếp nhau theo thời lượng.

## Execution Highlights

Sau một lần chạy trực tiếp — hoặc sau **Bring to Canvas** — một popup **Execution Highlights** có thể đóng sẽ xuất hiện ở **góc trên bên phải của Canvas**. Đây là cách nhanh để xem *mỗi node đã tạo ra gì*, được liệt kê từ trên xuống dưới theo thứ tự thực thi. Đóng nó bằng **✕**; nó sẽ mở lại ở lần chạy tiếp theo.

### Những gì được hiển thị

| Bản ghi | Nguồn | Tự động? |
|--------|--------|-------|
| **Input** | Các tham số input của lần chạy (node input/trigger) | Có |
| **Output** | Kết quả của node output — hoặc, nếu không có, message của node cuối cùng | Có |
| **Agent / LLM** | Output của mỗi node agent hoặc LLM | Có |
| **Output** | Bất kỳ node nào khác có bật **Highlight Node Output** | Tùy chọn |

Các node đã được highlight tự động (input / output / last / agent / llm) sẽ không bao giờ xuất hiện hai lần, ngay cả khi bạn cũng bật toggle.

### Mỗi bản ghi

- Hiển thị `Node — message…` với **250 ký tự** đầu tiên; nhấp vào một hàng để mở rộng và render **toàn bộ message dưới dạng Markdown**, kèm nút **Copy**.
- Một node chạy nhiều lần (ví dụ: bên trong một loop) hiển thị `Node (N)` với bộ chọn `‹ i / N ›` — chọn lần chạy muốn xem; bộ chọn của mỗi node là độc lập.

### Highlight Node Output

Mọi node **ngoại trừ Agent và LLM** đều có checkbox **Highlight Node Output** trong bảng thuộc tính của nó (mặc định tắt). Bật nó để thêm output của node đó vào popup. Một huy hiệu ✦ nhỏ xuất hiện trên các node được highlight trên canvas. Trong [workflow DSL](./expression-dsl.md), đây là trường node-data `"highlight": true` (mặc định là `false`).

### Trên dashboards

Các thẻ widget trên dashboard đã chạy một workflow sẽ hiển thị nút ✦ **Execution highlights** ở tiêu đề thẻ; nhấp vào đó để mở cùng popup cho lần chạy của widget đó, với output được vẽ của widget là bản ghi nổi bật.

## Các Execution đang chạy

Cả hai hộp thoại lịch sử đều hiển thị **các execution đang chạy** ở đầu danh sách, trước các lần chạy trước đó.

- Biểu tượng quay và nhãn **Running** xuất hiện cùng thời gian bắt đầu
- Nhấp vào **Open live** để gắn editor vào đúng lần chạy đó mà không cần khởi động lại
- Canvas trước tiên khôi phục các node đã hoàn thành, sau đó nhận các sự kiện
  `node_start`, `node_complete` và sự kiện execution cuối cùng qua SSE
- Node hiện tại nhấp nháy trên canvas, các node phía sau giữ nguyên hiệu ứng chờ, và
  bảng Debug thêm từng kết quả khi chúng đến—giống như một lần chạy được khởi động từ editor
- Nhấp vào **Cancel** để dừng execution ngay lập tức
- Hủy từ bất kỳ hộp thoại nào (Editor hoặc Dashboard) cũng đóng luồng SSE đang hoạt động trong mọi tab canvas đang mở cho workflow đó, để trạng thái editor được đặt lại sạch sẽ
- Sau khi hủy, mục đang chạy sẽ biến mất ở lần làm mới tiếp theo; nhấn **Refresh** để cập nhật danh sách thủ công
- Nếu bạn hủy một lần chạy đã kết thúc, yêu cầu sẽ không có tác dụng gì

Các lượt chạy đang chờ một [vị trí đồng thời](./webhooks.md#concurrency-limit-and-queued-runs) được liệt kê trong cùng một phần với nhãn **Queued 2/5**, vị trí trong hàng đợi và kích thước hàng đợi. Chúng không có nút **Open live** vì chưa có gì đang chạy; **Cancel** sẽ đưa lượt chạy đang chờ ra khỏi hàng đợi và ghi lại là `cancelled`. Lượt chạy chờ lâu hơn thời gian chờ tối đa của workflow được ghi lại là `expired`, và lượt chạy bị từ chối do hàng đợi đầy được ghi lại là `queue_full`; cả hai đều có huy hiệu riêng trong danh sách lượt chạy.

URL trực tiếp là `/workflows/{workflowId}/{executionId}`. Observer chỉ có quyền đọc: rời khỏi
editor chỉ ngắt kết nối tab trình duyệt đó và không bao giờ dừng workflow. Các snapshot đang hoạt động
được chia sẻ qua PostgreSQL, vì vậy việc mở một lần chạy vẫn hoạt động khi trigger và yêu cầu
từ editor rơi vào các backend worker khác nhau.

## Khôi phục sau sự cố

Nếu server khởi động lại (triển khai, khởi động lại container, hoặc gặp sự cố) trong khi một workflow đang chạy, worker của lần chạy đó sẽ dừng giữa chừng. Heym tự động khôi phục các lần chạy bị gián đoạn này thay vì để chúng mắc kẹt ở trạng thái **Running**.

- Ở lần khởi động tiếp theo, tiến trình leader được bầu chọn sẽ phát hiện các lần chạy mồ côi — ngay lập tức đối với khởi động lại êm, hoặc trong vòng ~60 giây đối với sự cố cứng (khi heartbeat ngừng rõ ràng).
- Các lần chạy được khôi phục sẽ **chạy lại từ đầu với cùng input** (không tiếp tục từ chỗ đã dừng), sử dụng định nghĩa workflow hiện tại. Khi hoàn thành, chúng ghi một mục kết thúc bình thường (ví dụ: `success`), nên lịch sử hiển thị lần chạy đó là đã hoàn thành.
- Một lần chạy được thử lại **một lần**. Nếu lần khôi phục cũng bị gián đoạn — hoặc workflow đã bị xóa — mục đó được ghi là `failed`.
- Điều này hoạt động giống nhau trên cả triển khai một container và nhiều worker; chỉ leader thực hiện khôi phục, nên một lần chạy không bao giờ được khôi phục hai lần bởi các worker khác nhau.

### Tùy chọn Auto-recover

Bảng **Execution Log** (run) trong editor có hộp kiểm **Auto-recover**, **mặc định bật** cho mỗi workflow.

- **Bật**: các lần chạy bị gián đoạn của workflow này sẽ được chạy lại như mô tả ở trên.
- **Tắt**: các lần chạy bị gián đoạn không được chạy lại và được ghi với trạng thái `skipped`.

> Các lần chạy sub-workflow không được khôi phục độc lập — chúng được điều khiển lại bởi lần chạy cha đã được khôi phục. Các trigger có cơ chế gửi lại riêng (RabbitMQ, scheduled/cron, IMAP) cũng có thể gửi lại khi khởi động lại, nên một lần chạy được khôi phục đôi khi có thể thực thi hai lần.

## Đang chờ Human Review

Các lần chạy tạm dừng để chờ phê duyệt [Human-in-the-Loop](./human-in-the-loop.md) được ghi vào lịch sử ngay lập tức với trạng thái `pending`.

- Node agent đang chờ lưu một payload review bao gồm `reviewUrl`, `draftText` và `expiresAt`
- Bất kỳ node nào kết nối với handle `review` của agent cũng có thể chạy trước khi người dùng phản hồi, và kết quả node của chúng được lưu trong cùng mục lịch sử đang chờ
- Các hộp thoại lịch sử hiển thị liên kết review để chủ sở hữu có thể sao chép hoặc mở
- Các hộp thoại lịch sử và bảng Debug của editor hiển thị quyết định cuối cùng của người dùng sau khi lần chạy tiếp tục
- Khi người review chấp nhận, chỉnh sửa hoặc từ chối bản nháp, cùng mục lịch sử đó được cập nhật với kết quả execution cuối cùng
- Nếu cùng một lần chạy tạm dừng cho HITL nhiều lần, mục lịch sử vẫn giữ nguyên trong khi mỗi checkpoint có liên kết review dùng một lần riêng

Điều này đặc biệt hữu ích cho các lần chạy portal và các workflow tồn tại lâu dài có thể chờ hàng giờ hoặc hàng ngày trước khi tiếp tục.

## Copy

Dùng **Copy** bên cạnh Inputs hoặc Outputs để sao chép JSON vào clipboard.

## Xóa lịch sử

- **Theo workflow**: Trong hộp thoại lịch sử của Editor, nhấp vào **Clear history** để xóa các lần chạy của workflow hiện tại.
- **Toàn bộ lịch sử**: Trong hộp thoại lịch sử của Dashboard/Evals, nhấp vào **Clear all history** để xóa tất cả bản ghi execution bạn sở hữu. Các lần chạy từ workflow được chia sẻ vẫn được giữ lại. Hành động này không thể hoàn tác.

## Chi tiết dòng thời gian execution

Khi **Execution Log** của editor đang mở, nhấp vào nút đồng hồ để hiển thị dòng thời gian execution. Chọn một span để mở trình kiểm tra chi tiết nội tuyến chiếm vùng các hàng. Nó hiển thị trạng thái, thời lượng, số lần thử, thông tin thử lại, lỗi, trace ID và bản xem trước output ngắn gọn của bước đã chọn. Output dạng object và array dùng cùng trình xem `JsonTree` như phần còn lại của bảng Debug; các giá trị vô hướng dùng bản xem trước văn bản. Khi một bước xuất ra hình ảnh (ảnh chụp màn hình Playwright, hình ảnh được tạo, tệp hình ảnh hoặc hình ảnh base64 trong nội dung yêu cầu, được tìm thấy ở bất kỳ đâu trong đầu ra), chúng xuất hiện dưới dạng hình thu nhỏ phía trên output, và JSON hiển thị một placeholder ngắn thay cho base64 thô. Nhấp vào hình thu nhỏ để mở trong lightbox; các nút mũi tên hoặc phím ←/→ để chuyển qua từng hình ảnh trong lần chạy, với bộ đếm như `2 / 5`. Dùng **Open trace** cho các span LLM và Agent khi có trace ID.

## Chi tiết node trên thiết bị di động

Trên điện thoại, trình chỉnh sửa hiển thị cây workflow toàn màn hình thay vì canvas tự do. Nhấn vào một node trên cây có kết quả đã ghi để mở quá trình thực thi của node đó dưới dạng chi tiết toàn màn hình. Chế độ xem này cung cấp các tab riêng biệt: **Input Data**, **Output Data** và **Errors**. Tab output hiển thị kết quả đã ghi và cung cấp nút **Copy Output**; tab input hiển thị cấu hình của node đã chọn, và tab errors hiển thị lỗi đã ghi khi node thất bại. Sử dụng **Back to workflow** hoặc nút đóng để quay lại cây.

Canvas và các hộp thoại lịch sử trên dashboard giữ các điều khiển chạy trên một hàng và đặt các bộ lọc tag và instance khả dụng vào một lưới thích ứng. Menu bộ lọc của chúng sử dụng cùng một bộ chọn trong ứng dụng, do đó dấu kiểm đã chọn có cùng lề và đường cơ sở với mọi nhãn tùy chọn.

## Liên quan

- [Triggers](./triggers.md) – Cách workflow được khởi động; lịch sử ghi lại `trigger_source` (bao gồm `board` cho các lần chạy được khởi động bởi thao tác di chuyển thẻ trên [Board](../tabs/board-tab.md) và các follow-up)
- [Human-in-the-Loop](./human-in-the-loop.md) – URL đang chờ review và hành vi tiếp tục
- [Edit History](./edit-history.md) – Kiểm soát phiên bản cho các lần lưu workflow (khôi phục, so sánh)
- [Quick Start](../getting-started/quick-start.md) – Tạo và chạy workflow đầu tiên của bạn
- [Workflows Tab](../tabs/workflows-tab.md) – Tạo và quản lý workflow
