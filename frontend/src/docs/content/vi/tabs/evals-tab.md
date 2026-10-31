# Tab Evals

Tab **Evals** là một trang riêng biệt tại `/evals`. Trang này cho phép bạn tạo các bộ đánh giá (evaluation suite), định nghĩa các test case và chạy đánh giá đối với các workflow [Agent](../nodes/agent-node.md) của bạn. Một [bộ đánh giá agent](#agent-suites) chạy một agent hoặc đọc các lượt chạy thực tế của nó, đồng thời kiểm tra các công cụ mà nó gọi, độ trễ, chi phí USD, token và số lượng lệnh gọi công cụ.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Xem demo Evals</a></p>

## Truy cập

- Nhấp vào **Evals** trên thanh tab của dashboard
- Hoặc điều hướng đến `/evals`
- Hoặc dùng **Ctrl+K** (Cmd+K) và chọn "Evals" từ command palette

## Bộ đánh giá (Eval Suites)

- **Bộ mới** – Chọn **Bộ prompt** để kiểm tra prompt hệ thống trên nhiều mô hình, hoặc **Bộ đánh giá agent** để kiểm tra các lượt chạy thực tế của một agent (xem [Bộ đánh giá Agent](#agent-suites))
- **Bộ chọn bộ đánh giá** – Liệt kê các bộ prompt và bộ đánh giá agent cùng với loại bên cạnh mỗi tên; nhập để tìm kiếm
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
- **Cài đặt đã ghi nhớ** – Một bộ mở ra với các cài đặt của lượt chạy mới nhất: thông tin xác thực, mô hình, phương pháp tính điểm và giám khảo, nhiệt độ, nỗ lực suy luận và số lượt chạy trên mỗi bài kiểm tra. Việc mở một lượt chạy trước đây sẽ tải các cài đặt đó, vì vậy **Chạy lại đánh giá** sẽ lặp lại cùng bài kiểm tra
- **Temperature** – Đặt temperature của model (`Exact Match` và `Contains`)
- **Nỗ lực suy luận** – Đặt nỗ lực suy luận cho các mô hình suy luận, từ Thấp đến Cực cao và Tối đa giống như các node LLM và Agent (`Exact Match` và `Contains`)

### LLM-as-Judge

Với một judge, mỗi model trả lời input của test chỉ bằng prompt của suite, sau đó judge đánh giá mức độ khớp của câu trả lời với output mong đợi theo thang điểm từ 0 đến 100:

- **Judge là model** (OpenAI, OpenAI compatible hoặc Gemini) đọc câu hỏi, output mong đợi và câu trả lời, rồi trả về điểm số kèm một dòng lý do. Judge chạy ở temperature `0`, hoặc ở reasoning effort `low` đối với reasoning model, nên cùng một câu trả lời sẽ nhận cùng một kết quả.
- **Judge là decision model** đánh giá câu trả lời theo thang rubric năm mức, từ *Hoàn toàn sai* đến *Khớp hoàn toàn*. Điểm số là vị trí có trọng số theo xác suất trên thang rubric đó, nên nó xuất phát từ một phân phối mà model đã tính toán thay vì một con số do model tự viết ra.

Thẻ di chuột của ô hiển thị lý do của giám khảo hoặc đối với mô hình quyết định là cấp độ, điểm số và độ tin cậy. Độ trễ và token mô tả mô hình đang được kiểm tra; các lệnh gọi của chính giám khảo xuất hiện trong [Dấu vết](./traces-tab.md) dưới nguồn **Đánh giá**. Bộ chọn giám khảo loại trừ thông tin xác thực Model Router, vì giám khảo phải là một mô hình cố định duy nhất. Thông tin xác thực cho các mô hình đang thử nghiệm có thể là [Model Router](../reference/credentials.md#model-router-auto-model): mô hình **Auto** của nó chọn một mô hình cho mỗi yêu cầu, tương tự như trong workflow.

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

## Agent Suites

Một bộ đánh giá agent kiểm tra một node [Agent](../nodes/agent-node.md) dựa trên các lượt chạy của nó. Nó đọc dữ liệu từ [Dấu vết](./traces-tab.md), nơi mỗi lượt chạy đã ghi lại thời gian, token, chi phí và các lệnh gọi công cụ, đồng thời nó cũng có thể chạy workflow thay bạn.

Tạo một bộ mới qua **Bộ mới** → **Bộ đánh giá agent** và làm theo ba bước:

1. **Agent** – Chọn workflow, sau đó chọn node agent của nó. Chỉ những workflow có node agent mới được liệt kê; workflow hoặc agent chưa từng chạy sẽ hiển thị nhưng không thể chọn. Cài đặt của agent đã chọn (mô hình, hướng dẫn, công cụ và giới hạn) hiển thị ở bên phải và canvas chỉ đọc của workflow đó, với agent được đánh dấu, hiển thị bên dưới.
2. **Baseline** – 10 lượt chạy gần nhất của agent: độ trễ p50 và p95, chi phí cho mỗi lượt chạy, token cho mỗi lượt chạy và số lệnh gọi công cụ cho mỗi lượt chạy, các công cụ được gọi và tần suất, cũng như các chỉ số riêng của từng lượt chạy. Các lượt chạy kết thúc bằng lỗi được liệt kê nhưng bị loại khỏi baseline.
3. **Kiểm tra** – Đánh dấu từng công cụ là **Must call**, **Must not call** hoặc **Either**. Mỗi loại lệnh gọi được liệt kê cùng với loại của nó: công cụ Python và node, công cụ **MCP** kèm server, **sub-agent** theo nhãn, **sub-workflow** theo tên và **skills**. Thêm công cụ theo loại và tên nếu nó chưa từng chạy, và xóa bằng dấu **X**. Đặt giới hạn trên cho độ trễ, chi phí, tổng token và số lệnh gọi công cụ; mỗi giới hạn bắt đầu cao hơn 20% so với p95 của baseline và có thể tắt.

Bộ đã lưu mở ra ở tab **Kết quả**, bên cạnh là **Baseline** và **Chỉnh sửa kiểm tra**:

- **Chạy workflow** – Chọn số lượt chạy (tối đa 20); bốn lượt chạy cùng lúc. Dữ liệu đầu vào được điền từ lượt chạy gần đây nhất của workflow và có thể chỉnh sửa, mỗi lượt chạy đều sử dụng chúng. Bật **Tạo đầu vào** (biểu tượng lấp lánh), sau đó chọn thông tin xác thực và mô hình để mô hình tạo đầu vào khác nhau cho mỗi lượt chạy. Nó đọc hướng dẫn hệ thống của agent và bám sát các giá trị bạn đã nhập: nhập tên thành phố sẽ tạo ra tên các thành phố khác. Mỗi lượt chạy thực thi toàn bộ workflow giống như bất kỳ lượt chạy thông thường nào và được liệt kê trong Lịch sử thực thi với trigger `agent_suite`. Để bỏ qua các bước sau, chẳng hạn như gửi email, hãy mở workflow bằng **Chuyển đến workflow** trong bảng điều khiển và tắt các node đó trước. **Dừng** kết thúc lượt chạy bộ: không có lượt chạy mới nào bắt đầu và các lượt đang chạy sẽ bị hủy. Một lượt chạy bộ có máy chủ bị dừng, ví dụ khi khởi động lại, sẽ hiển thị là bị gián đoạn sau một phút thay vì bị treo.
- **Kết quả** – Lượt chạy bộ mới nhất được chấm điểm theo mặc định. Mỗi lượt chạy bộ được lưu cùng ngày tháng trong bộ chọn lượt chạy, nơi bạn có thể mở hoặc xóa nó; hoặc chuyển sang 10, 20 hoặc 50 lượt chạy gần nhất của agent để bao gồm các lượt chạy khác. Bạn sẽ thấy tỷ lệ vượt qua, tần suất vượt qua của từng bài kiểm tra, độ trễ, chi phí, token và số lệnh gọi công cụ bên cạnh baseline đã lưu, cũng như từng lượt chạy kèm lý do thất bại và liên kết đến dấu vết của nó.
- **Chuyển đến workflow** mở workflow của agent trong một tab mới. Trong trường tên, phím **Esc** hoặc dấu **X** sẽ xóa văn bản.

Cách hiểu các con số:

- **Độ trễ** là thời gian của mô hình cộng với thời gian của các lệnh gọi công cụ trong lượt chạy.
- **Chi phí** sử dụng cùng mức giá như Traces. Một lượt chạy mô hình không có giá sẽ bỏ qua việc kiểm tra chi phí thay vì báo lỗi.
- Một lượt chạy **đạt** khi kết thúc không có lỗi và vượt qua mọi kiểm tra.
- Bộ chỉ đọc các dấu vết của chính bạn, cùng quy tắc như tab Dấu vết.
- **Dùng các lượt chạy mới nhất làm baseline** trong **Chỉnh sửa kiểm tra** sẽ thay thế baseline đã lưu bằng các lượt chạy mới nhất của agent.

Baseline của một bộ bắt nguồn từ một trong ba nguồn. **Chỉnh sửa kiểm tra** hiển thị nguồn nào đang hoạt động bên cạnh **Baseline đã lưu**:

- các lượt chạy mới nhất của agent (mặc định và là giá trị mà **Dùng các lượt chạy mới nhất làm baseline** lấy),
- một lượt chạy bộ đã hoàn thành,
- các con số được nhập thủ công.

Hai lựa chọn sau được thiết lập từ [Chat](./chat-tab.md#working-with-evals) hoặc qua API:

- `PATCH /api/evals/agent-suites/{id}` nhận `baseline: {"source": "suite_run", "run_id": "…"}` hoặc `{"source": "manual", "values": {"latency_p95_ms": 3000, "cost_avg_usd": 0.01}}`.
- `POST /api/evals/agent-suites/{id}/runs` nhận `inputs_list`: một đối tượng đầu vào cho mỗi lượt chạy, tối đa 20.

### Từ Chat và MCP

[Chat](./chat-tab.md#working-with-evals) và công cụ MCP `heym_chat` có thể tạo, sửa đổi và chạy các bộ prompt và agent:

- Chúng tự soạn thảo các trường hợp kiểm thử và đầu vào lượt chạy.
- Chúng hỏi thông tin xác thực nào cần sử dụng trước khi tạo bộ prompt, trừ khi chỉ có một thông tin phù hợp.
- Chúng liên kết đến mọi bộ mà chúng đề cập trên trang này.

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
