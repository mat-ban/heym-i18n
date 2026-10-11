# Board

Tab **Board** là một bảng kanban dạng agentic. Công việc di chuyển qua các cột, và mỗi
cột có thể thực thi các workflow của Heym. Một card không chỉ là một tác vụ — nó là một
agentic job lâu dài mang theo ngữ cảnh, lịch sử hội thoại, trạng thái thực thi, kết quả đầu ra,
và các lần chạy workflow.

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

## Board và cột

- Bạn có thể tạo bao nhiêu board tùy ý. Một board mới khởi tạo với các cột mặc định
  **Backlog → Planning → Development → Done**.
- Mỗi board cần một **Agentic Kanban Model** (một credential cùng một model). Đây là
  bắt buộc — hộp thoại New board sẽ không tạo board nếu thiếu, và một board không có
  sẽ giữ các thao tác ở trạng thái vô hiệu — vì chính model này ánh xạ mỗi
  card vào các input của workflow mà nó chạy và chuyển kết quả đầu ra của chúng trở lại thành
  văn bản dễ đọc.
- Biểu tượng bánh răng ở phần đầu board mở phần cài đặt board: tên, mô tả
  (hiển thị bên dưới phần đầu) và Agentic Kanban Model.
- Các cột hoàn toàn có thể chỉnh sửa: thêm, đổi tên, đổi màu, sắp xếp lại, hoặc xóa chúng từ
  phần cài đặt cột (một cột phải trống trước khi có thể xóa).
- Các card được sắp xếp theo chiều dọc theo mức độ ưu tiên — kéo để sắp xếp lại.
- Bạn cũng có thể tạo một card từ [tab Chat](./chat-tab.md) bằng một yêu cầu
  ngôn ngữ tự nhiên. Chat sẽ yêu cầu bạn chọn một board khi cần và luôn thêm card vào
  cột đầu tiên của board đó.

## Chia sẻ một board

Phần cài đặt board cũng cho phép chia sẻ board với **người dùng** (qua email) và với
**team**, với quyền `read` hoặc `write`:

- **read** — board và các card của nó được hiển thị, nhưng không thể thay đổi bất cứ điều gì: không thêm
  card mới, không di chuyển, không bình luận, không chạy.
- **write** — sử dụng đầy đủ board: card, di chuyển, bình luận và chạy.
- Chỉ **chủ sở hữu** nhìn thấy biểu tượng bánh răng và nút xóa, và chỉ chủ sở hữu mới có thể thay đổi
  cài đặt của board, Agentic Kanban Model hoặc các chia sẻ của nó.

Các chain trên một board được chia sẻ luôn chạy với credential và Agentic Kanban
Model của **chủ sở hữu**, vì vậy cộng tác viên không bao giờ cần credential riêng.

## Tệp đính kèm của card

Mở một card và dùng **Attach file** để thêm tệp vào đó — thả chúng vào ô hoặc chọn chúng
bằng nút, và xóa chúng khỏi cùng danh sách đó. Tệp đính kèm được lưu trong
[Drive](./drive-tab.md).

Mỗi lần chạy **phân giải các tệp đính kèm trước khi workflow bắt đầu**, theo loại:

- **Tài liệu** (pdf, markdown, csv, json, text) được trích xuất thành văn bản, giới hạn ở 20.000
  ký tự mỗi tệp, trong trường `text` của tệp đính kèm.
- **Hình ảnh** được chuyển giao dưới dạng một `url` mà đường dẫn vision tải trực tiếp (input hình ảnh của một node LLM
  chấp nhận nó nguyên trạng).
- **Mọi thứ khác** được truyền qua dưới dạng một tham chiếu thuần (`name`, `url`, `mime_type`).

Các workflow đọc chúng tại `$input.card.attachments` (và luôn tại `$input.board.attachments`,
bất kể mapper đã ánh xạ gì). Agentic Kanban Model cũng nhìn thấy văn bản đã trích xuất và các
URL hình ảnh, vì vậy nó có thể ánh xạ một tệp đính kèm thẳng vào trường mà một workflow mong đợi.

## Chain workflow của cột

Mỗi cột có thể được cấu hình với một **danh sách workflow có thứ tự** (chain).
Khi một card di chuyển vào một cột có chain:

1. Chain tự động bắt đầu ở chế độ nền — thao tác di chuyển không bao giờ phải chờ.
2. Các workflow chạy **tuần tự**. Kết quả đầu ra của mỗi workflow được thêm vào ngữ cảnh
   của card trước khi workflow tiếp theo bắt đầu.
3. Nếu một workflow thất bại, chain dừng lại: các mắt xích còn lại bị bỏ qua và
   card chuyển sang màu **đỏ**.
4. Khi mọi mắt xích thành công, card chuyển sang màu **xanh lá**. Trong khi chain đang chạy
   card nhấp nháy màu **hổ phách**; một lần chạy bị tạm dừng để con người xem xét hiển thị trạng thái
   hổ phách tĩnh.

Các lần chạy được ghi lại trong [Execution History](../reference/execution-history.md) với
nguồn trigger `board`, và mỗi card giữ danh sách lần chạy riêng với kết quả đầu ra và lỗi
theo từng workflow. Mở một card trong khi một workflow đang chạy và chọn **Open live** bên cạnh
lần chạy để gắn trình chỉnh sửa vào đúng lần thực thi đó. Cùng hoạt ảnh canvas, nhật ký
Debug tăng dần, và kết quả cuối cùng sẽ xuất hiện mà không khởi động một lần chạy thứ hai.

## Workflow nhận được gì

Chuỗi truyền một payload chuẩn làm đầu vào cho workflow. Đọc nó bằng các
[biểu thức](../reference/expression-dsl.md) thông thường như `$input.card.title`:

```json
{
  "triggered_by": "board",
  "rerun": false,
  "card": {
    "id": "…",
    "title": "Write launch email",
    "content": "Draft the launch email for the beta",
    "metadata": { "attachments": [{ "name": "brief", "url": "…" }] },
    "comments": [{ "author": "user", "content": "…", "created_at": "…" }],
    "history": [{ "kind": "event", "content": "…", "created_at": "…" }],
    "previous_outputs": [{ "workflow_name": "…", "output": {}, "finished_at": "…" }]
  },
  "board": { "id": "…", "name": "…" },
  "move": { "from_column": "Backlog", "to_column": "Planning" },
  "chain": { "position": 0, "length": 2, "previous_workflow_outputs": [] }
}
```

- `comments` — mọi bình luận trên card, cũ nhất trước.
- `history` — toàn bộ dòng thời gian hoạt động (bình luận, di chuyển, output), giới hạn ở
  200 mục gần nhất.
- `previous_outputs` — output từ các lần chạy đã hoàn thành trước đó (các cột trước và
  các vòng follow-up).
- `chain.previous_workflow_outputs` — output của các liên kết trước đó trong chuỗi
  *hiện tại*.
- Ở các vòng follow-up, `move` là `null` và `rerun` là `true`.

## Vòng lặp lập kế hoạch (các vòng follow-up)

Một mẫu phổ biến là đặt một workflow lập kế hoạch ở **cột thứ hai** (mặc định
tên là Planning — tên không quan trọng; vị trí mới quan trọng). Workflow đó làm phong phú
card và đặt các câu hỏi follow-up:

1. Di chuyển một card vào cột thứ hai — workflow ghi một kế hoạch được làm phong phú cùng
   các câu hỏi của nó trở lại card dưới dạng output.
2. Trả lời trong luồng bình luận của card. Câu trả lời giải phóng card: nó di chuyển sang
   cột tiếp theo, cột này tiếp nhận nó với câu trả lời trong ngữ cảnh. Chuỗi của cột thứ hai
   không chạy lại.
3. Để cải thiện kế hoạch ngay tại chỗ, hãy nhấn **Run follow-up round**. Cùng một
   chuỗi chạy lại với toàn bộ ngữ cảnh đã tích lũy, sau đó card chờ trong cột đó
   cho đến khi bạn thêm bình luận để giải phóng nó.

Cổng lập kế hoạch dựa trên vị trí, không dựa trên tên: cột ngoài cùng bên trái và cột
ngay bên phải nó không bao giờ tự di chuyển tiếp — chúng chạy chuỗi của mình và chờ
tại đó cho bạn (một bình luận giải phóng cột thứ hai). Từ cột thứ ba trở đi, một
chuỗi thành công sẽ tự động đưa card sang phải, cho đến tận cột
cuối cùng. Việc đổi tên hoặc xóa nhãn "Planning" mặc định không thay đổi vị trí nào
là cổng. Một card chỉ có thể có một lần chạy hoạt động tại một thời điểm.

## Human-in-the-loop và câu hỏi Codex

Nếu một workflow trong chuỗi tạm dừng — tại một node
[Human-in-the-Loop](../reference/human-in-the-loop.md), tại công cụ HITL của agent, hoặc
vì một node [Codex](../nodes/codex-node.md) cần
thêm thông tin — lần chạy được lưu lại dưới dạng đang chờ và card hiển thị trạng thái
đang chờ màu hổ phách. Mỗi lần tạm dừng giữ bề mặt trả lời riêng: một liên kết đánh giá HITL cho HITL, màn hình
follow-up Codex cho Codex.

Sau khi bạn trả lời, chuỗi tự động tiếp tục: workflow bị tạm dừng hoàn thành, output của nó
được ghi lên card, phần còn lại của chuỗi trong cột đó chạy, và card tiến tiếp như bình thường.
Nếu lần chạy được tiếp tục thất bại, card chuyển sang màu đỏ và các liên kết còn lại bị bỏ qua.

## Liên quan

- [Workflow](./workflows-tab.md)
- [Lịch sử thực thi](../reference/execution-history.md)
- [Expression DSL](../reference/expression-dsl.md)
- [Human-in-the-Loop](../reference/human-in-the-loop.md)
