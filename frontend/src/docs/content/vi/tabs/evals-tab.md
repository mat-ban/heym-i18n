# Tab Evals

Tab **Evals** là một trang riêng biệt tại `/evals`. Trang này cho phép bạn tạo các bộ đánh giá (evaluation suite), định nghĩa các test case và chạy đánh giá đối với các workflow [Agent](../nodes/agent-node.md) của bạn.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Xem demo Evals</a></p>

## Truy cập

- Nhấp vào **Evals** trên thanh tab của dashboard
- Hoặc điều hướng đến `/evals`
- Hoặc dùng **Ctrl+K** (Cmd+K) và chọn "Evals" từ command palette

## Bộ đánh giá (Eval Suites)

- **Tạo suite** – Định nghĩa một suite với tên và mô tả
- **Chọn workflow** – Chọn workflow cần đánh giá
- **Chọn credential** – API key để chạy workflow
- **System prompt** – Chỉnh sửa system prompt ở cấp suite trực tiếp trong bảng bên trái
- **Tối ưu Prompt** – Yêu cầu LLM cải thiện system prompt hiện tại

## Test Case

- Thêm test case với input prompt và output mong đợi
- Mỗi case có thể có giá trị mong đợi tùy chỉnh để so sánh
- Chỉnh sửa hoặc xóa case khỏi suite
- **Tạo dữ liệu Test** – Dùng credential/model đã chọn để tự động tạo test case từ prompt của suite

## Chạy đánh giá

- **Chọn một hoặc nhiều model** – Chạy cùng một suite đối với nhiều model trong một lần đánh giá
- **Phương pháp chấm điểm** – Chọn `Exact Match`, `Contains` hoặc `LLM-as-Judge`
- **Judge** – Với `LLM-as-Judge`, tùy chọn chọn credential OpenAI, OpenAI compatible (Custom), Gemini (Google) hoặc [Decision Model](../nodes/decision-node.md) và nhập model của judge (ví dụ `gpt-4o-mini` hoặc `jev-latest`) để chấm điểm bằng một judge độc lập
- **Số lần chạy mỗi test** – Lặp lại mỗi test case nhiều lần trong một lần chạy
- **Temperature** – Đặt temperature của model (`Exact Match` và `Contains`)
- **Reasoning effort** – Đặt reasoning effort cho các reasoning model (`Exact Match` và `Contains`)

### LLM-as-Judge

Với một judge, mỗi model trả lời input của test chỉ bằng prompt của suite, sau đó judge đánh giá mức độ khớp của câu trả lời với output mong đợi theo thang điểm từ 0 đến 100:

- **Judge là model** (OpenAI, OpenAI compatible hoặc Gemini) đọc câu hỏi, output mong đợi và câu trả lời, rồi trả về điểm số kèm một dòng lý do. Judge chạy ở temperature `0`, hoặc ở reasoning effort `low` đối với reasoning model, nên cùng một câu trả lời sẽ nhận cùng một kết quả.
- **Judge là decision model** đánh giá câu trả lời theo thang rubric năm mức, từ *Hoàn toàn sai* đến *Khớp hoàn toàn*. Điểm số là vị trí có trọng số theo xác suất trên thang rubric đó, nên nó xuất phát từ một phân phối mà model đã tính toán thay vì một con số do model tự viết ra.

Thẻ hover của ô hiển thị lý do của judge, hoặc với decision model là mức, điểm số và độ tin cậy. Latency và token mô tả model đang được kiểm tra; các lệnh gọi của chính judge xuất hiện trong [Traces](./traces-tab.md) dưới nguồn **Evals**. Trình chọn model bỏ qua các credential Model Router, vì một eval so sánh các model cụ thể.

Không có judge, mỗi model tự trả lời và tự chấm điểm câu trả lời của mình trong một request duy nhất.

Temperature và reasoning effort bị ẩn trong chế độ này, và lần chạy dùng các thiết lập cố định: temperature `0.7` cho các model tiêu chuẩn, và reasoning effort `medium` cho các reasoning model (`low` khi chúng tự chấm điểm câu trả lời của mình).

## Kết quả

- Xem đạt/không đạt theo từng test case
- Kiểm tra output thực tế so với output mong đợi
- So sánh output của từng model cạnh nhau khi một lần chạy bao gồm nhiều model
- Xem lại lịch sử chạy của các lần đánh giá trước; một lần chạy `LLM-as-Judge` hiển thị model judge của nó trong danh sách lịch sử
- Mở các lần chạy trong quá khứ từ bảng kết quả và kiểm tra các snapshot prompt/input/output đã lưu
- Mở một lần chạy trong quá khứ sẽ tải phương pháp chấm điểm và judge của nó vào bảng bên trái, nên **Re-Run Evals** sẽ lặp lại đúng lần đánh giá đó
- **Export** tải lần chạy xuống dưới dạng JSON, bao gồm `judge_credential_id` và `judge_model`

## Gợi ý về ma trận Benchmark

Khi bạn xây dựng một ma trận benchmark cho các workflow agent, hãy đưa các tình huống HITL vào như những case hạng nhất thay vì coi chúng là các trường hợp biên.

- Bao phủ cả ba quyết định review: `accepted`, `edited` và `refused`
- Bao gồm nhiều nguồn trigger như chạy từ editor, portal, curl/webhook và các lần thực thi do cron kích hoạt
- Thêm các tình huống review lặp lại, nơi một lần chạy agent tạm dừng nhiều hơn một lần
- Kiểm tra các nhánh thông báo được kết nối với output `review` của agent
- Xác nhận hành vi ở hạ nguồn sau khi từ chối, đặc biệt nếu các node sau rẽ nhánh dựa trên `$agent.decision`

## Liên quan

- [Vì sao chọn Heym](../getting-started/why-heym.md) – Evals như giai đoạn kiểm thử trong vòng đời của agent
- [Agent Node](../nodes/agent-node.md) – Các workflow đang được đánh giá
- [Tab Credentials](./credentials-tab.md) – Credential cho các lần chạy eval
- [Tab Traces](./traces-tab.md) – Kiểm tra trace chi tiết
- [Tab Workflows](./workflows-tab.md) – Tạo workflow để đánh giá
- [Lịch sử thực thi](../reference/execution-history.md) – Xem các lần chạy trước (nút History ở header)
- [Contextual Showcase](../reference/contextual-showcase.md) – Hướng dẫn trang dạng thu gọn có sẵn trên trang evals
