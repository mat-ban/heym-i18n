# Tab Alerts

Tab **Alerts** cho phép bạn định nghĩa các điều kiện ngưỡng trong một khoảng thời gian và được thông báo khi chúng bị vượt qua. Heym đã ghi lại kết quả thực thi, thời lượng chạy và chi phí LLM, nhưng nó không bao giờ tự động thông báo những điều đó. Alert là cách bạn yêu cầu nó làm điều đó.

Mỗi alert được đánh giá trong một **khoảng thời gian** bạn chọn, không bao giờ dựa trên một sự kiện đơn lẻ. Một lần chạy thất bại là nhiễu. Mười hai lần chạy thất bại trong mười phút là một sự cố.

## Các loại Alert

| Loại | Câu hỏi nó trả lời | Con số đến từ đâu |
|---|---|---|
| **Ngưỡng lỗi** | Điều này có thất bại hơn N lần trong khoảng thời gian không? | Các dòng trong [Lịch sử thực thi](../reference/execution-history.md) có trạng thái lỗi |
| **Thời lượng Workflow** | Các lần chạy có chậm hơn mong đợi trong khoảng thời gian không? | Thời gian thực thi, được tổng hợp theo max, trung bình, hoặc phân vị thứ 95 |
| **Chi phí Token / USD** | Chi phí có vượt ngân sách trong khoảng thời gian không? | [LLM traces](./traces-tab.md) cộng với bảng chi phí LLM |
| **Số lần thực thi** | Điều này có chạy thường xuyên hơn nhiều so với mức nên có không? | Số dòng trong lịch sử thực thi |

### Ngưỡng lỗi

Đếm số lần chạy thất bại trong khoảng thời gian và kích hoạt khi số đếm đạt đến ngưỡng của bạn. Vì nó đếm trong một khoảng thời gian thay vì móc vào từng lần thất bại, một lỗi tạm thời đơn lẻ sẽ không làm bạn bị gọi.

### Thời lượng Workflow

Đo thời lượng chạy trong khoảng thời gian. Chọn **max** (lần chạy chậm nhất), **trung bình**, hoặc **p95**. Chỉ số p95 sử dụng cùng cách tính phân vị như [Tab Analytics](./analytics-tab.md), nên alert và biểu đồ độ trễ không bao giờ mâu thuẫn về cùng một khoảng thời gian.

**Số lần chạy tối thiểu trong khoảng thời gian** giữ điều này chính xác. Lần chạy chậm nhất trong một khoảng thời gian gần như trống chỉ là một lần chạy đó, nên đặt mức tối thiểu, ví dụ 3, sẽ ngăn alert kích hoạt do nhiễu.

### Chi phí Token / USD

Tính tổng chi phí LLM trong khoảng thời gian, dưới dạng tổng token hoặc đô la Mỹ. Số tiền đô la được quy đổi qua cùng bảng giá mà [Tab Traces](./traces-tab.md) và [Bảng chi phí LLM](./datatable-tab.md#llm-cost-table-system-table) sử dụng, nên alert chi phí và trang chi phí luôn khớp nhau.

Khi phạm vi là tất cả các workflow của bạn, điều này bao gồm các cuộc gọi LLM được thực hiện ngoài workflow, chẳng hạn như [Tab Chat](./chat-tab.md) và [AI Assistant](../reference/ai-assistant.md). Việc sử dụng coding agent (Codex, OpenCode) không được bao gồm.

Các model không có dòng giá được báo cáo trong ngữ cảnh của alert là chưa có giá thay vì âm thầm tính là không.

### Số lần thực thi

Đếm số lần chạy ở bất kỳ trạng thái nào trong khoảng thời gian. Đây là loại bắt được một trigger bị lỗi: một workflow thường chạy 20 lần một giờ đột nhiên chạy 2.000 lần. Bản ghi kích hoạt bao gồm phân tích theo từng nguồn trigger, vì đó thường là câu trả lời cho "tại sao điều này xảy ra".

## Phạm vi

Một alert theo dõi **một workflow** hoặc **tất cả các workflow của bạn**.

"Tất cả các workflow của bạn" nghĩa là mọi workflow mà chủ sở hữu alert có thể truy cập. Nó cố ý không có nghĩa là mọi workflow trên instance Heym: alert có thể được chia sẻ, và việc chia sẻ một alert không nên trao cho ai đó các con số tổng hợp của những workflow mà họ không thể mở.

## Trình hướng dẫn

Việc tạo một alert trải qua năm bước.

1. **Loại** — chọn một trong bốn loại trên.
2. **Phạm vi** — một workflow, hoặc tất cả.
3. **Điều kiện** — khoảng thời gian, cộng với các trường ngưỡng cho loại đó.
4. **Phản hồi** — những gì chạy khi nó kích hoạt, và tần suất tiếp tục thông báo cho bạn.
5. **Xem lại** — đặt tên cho nó, và xem backtest.

### Backtest

Bước Xem lại trả lời câu hỏi thực sự quan trọng trước khi bạn lưu: *trong 24 giờ qua, nó sẽ kích hoạt bao nhiêu lần?*

Nó báo cáo số lần kích hoạt và giá trị cao nhất quan sát được so với ngưỡng của bạn. Nếu nó nói điều kiện sẽ kích hoạt 400 lần, bạn sửa ngưỡng trước khi lưu thay vì sau khi bị gọi. Bạn có thể mở rộng khoảng thời gian nhìn lại lên 3 hoặc 7 ngày.

## AI soạn thảo

Ở đầu bước đầu tiên là một ô nơi bạn mô tả điều bạn muốn bằng ngôn ngữ tự nhiên:

> Cảnh báo tôi nếu đồng bộ hóa hóa đơn thất bại hơn 5 lần trong 10 phút

Heym biến điều đó thành một định nghĩa alert, điền mọi bước mà nó có thể, và nhảy đến trước với các trường do AI điền được đánh dấu, để bạn xác nhận thay vì nhập lại. Một yêu cầu đầy đủ sẽ đưa bạn đến bước Xem lại.

**Một yêu cầu một phần vẫn đưa bạn tiến về phía trước.** Chỉ nói "cảnh báo tôi nếu nó thất bại 5 lần" và bạn nhận được một alert ngưỡng lỗi với số đếm đã được điền, các giá trị mặc định cho phần còn lại, và trình hướng dẫn mở ở bước đầu tiên vẫn cần bạn: trong trường hợp đó là Phạm vi, vì không có workflow nào được nêu tên. Một ghi chú ở đầu nói những gì còn lại cần quyết định. Nó không bao giờ chặn Next hoặc Create.

Điều tương tự cũng áp dụng khi model nêu tên một workflow mà bạn không thể truy cập, hoặc trả về một điều kiện với các trường bị thiếu. Những phần hợp lý được giữ lại, phần còn lại quay về giá trị mặc định cho loại alert đó, và bạn điều chỉnh từ đó. Không có gì ở đây bỏ qua validation: các quy tắc của chính trình hướng dẫn và API đều kiểm tra lại alert khi bạn lưu.

## Hành vi lặp lại

Sau khi một alert kích hoạt, nó chuyển sang trạng thái đã kích hoạt. Điều gì xảy ra tiếp theo là lựa chọn của bạn ở bước 4.

- **Thông báo một lần, cho đến khi phục hồi** (mặc định) — kích hoạt một lần, sau đó giữ im lặng trong khi điều kiện vẫn còn. Khi chỉ số giảm trở lại dưới ngưỡng, alert trở về trạng thái OK và có thể kích hoạt lại. Phục hồi là một thay đổi trạng thái, không phải một sự kiện: nó không tạo bản ghi kích hoạt và không chạy workflow thông báo.
- **Tiếp tục thông báo theo khoảng thời gian** — kích hoạt lại mỗi N phút chừng nào điều kiện vẫn còn.

Mặc định này tồn tại vì một workflow bị lỗi được kiểm tra mỗi 60 giây sẽ tạo ra 60 lần kích hoạt mỗi giờ, đó là cách alerting bị tắt tiếng.

## Chạy một Workflow khi kích hoạt

Bước 4 đưa ra ba câu trả lời cho "điều gì nên xảy ra khi cái này kích hoạt":

- **Tạo và gán một workflow mới** (mặc định) — lưu alert cũng tạo một workflow có tên *"&lt;tên alert&gt; notification"* và liên kết nó. Nó đến với một input node có các trường đúng bằng payload bên dưới, vì vậy `$alert.body.observed_value` và phần còn lại phân giải ngay lập tức và bạn chỉ cần gắn node gửi tin nhắn. **Go to workflow** trên thẻ alert sẽ mở nó. Đây là mặc định vì một alert kích hoạt mà không làm gì cả thì rất dễ bị bỏ sót.
- **Chọn một workflow hiện có** — chạy thứ bạn đã xây dựng sẵn.
- **Không làm gì** — lần kích hoạt vẫn được ghi lại trong tab, chỉ là nó không chạy bất cứ thứ gì.

Payload của alert đến dưới dạng input body của workflow đó:

```json
{
  "alert_id": "...",
  "alert_name": "Invoice sync failures",
  "alert_type": "error_threshold",
  "condition": "5+ errors in 10m",
  "scope": "workflow",
  "workflows": [{ "id": "...", "name": "Invoice Sync", "value": 12 }],
  "observed_value": 12,
  "threshold_value": 5,
  "window_start": "2026-08-09T11:50:00+00:00",
  "window_end": "2026-08-09T12:00:00+00:00",
  "window_minutes": 10,
  "context": { "error_count": 12 }
}
```

### Workflow nào đã tạo ra con số đó

`workflows` là nơi duy nhất một workflow xuất hiện. Nó liệt kê mọi workflow đã đóng góp vào kết quả đọc, mỗi cái với `value` riêng — số lỗi, số lần chạy, lần chạy chậm nhất tính bằng mili giây, hoặc chi phí của workflow đó, tùy theo loại alert. Danh sách được sắp xếp theo `value`, cao nhất trước, vì vậy `workflows[0]` là thủ phạm tệ nhất.

Nó **luôn là một mảng**: một phần tử trong scope một workflow, nhiều phần tử trong "tất cả workflow của tôi", và rỗng thay vì null khi không có gì quy được. Một workflow thông báo có thể lặp qua nó mà không cần kiểm tra hình dạng.

Cố ý không có `workflow_id` số ít. Nó mô tả scope của alert chứ không phải chỉ số, nên nó là `null` trong scope hệ thống, đúng trường hợp mà câu hỏi "workflow nào?" quan trọng nhất. `observed_value` vẫn là giá trị tổng hợp mà ngưỡng được so sánh với; các trường `value` theo từng workflow giải thích nó đến từ đâu.

Đây là cách alert đến được Slack, email, Telegram, hay bất cứ nơi nào khác: với các [node](../reference/node-types.md) bạn đã có, thay vì một hệ thống thông báo riêng.

Một alert không thể thông báo cho chính workflow mà nó đang theo dõi. Đó sẽ là một vòng lặp, rõ ràng nhất với một alert đếm số lần thực thi khi mỗi thông báo lại cộng vào con số mà nó đo.

Các lần chạy thông báo là những execution bình thường, nên chúng xuất hiện trong [lịch sử thực thi](../reference/execution-history.md) như mọi lần chạy khác. Một workflow thông báo bị lỗi được ghi lại trên lần kích hoạt nhưng không bao giờ ngăn chính lần kích hoạt đó được ghi lại.

Một workflow thông báo chạy với tư cách chủ sở hữu của alert, với thông tin xác thực và biến toàn cục của họ, đúng như thể họ tự chạy nó. Chọn một workflow mà ai đó đã chia sẻ với bạn không mượn thông tin xác thực của người đó. Nếu chủ sở hữu mất quyền truy cập vào workflow thông báo, lần kích hoạt vẫn được ghi lại nhưng lần chạy thông báo bị bỏ qua.

## Lịch sử kích hoạt

Bên dưới danh sách alert là lịch sử kích hoạt: cái gì đã kích hoạt, khi nào, giá trị quan sát được so với ngưỡng, cửa sổ chính xác đã được đánh giá, và kết quả thông báo.

Xác nhận một lần kích hoạt sẽ đánh dấu dòng đó và đổi huy hiệu của alert từ **Firing** sang **Acknowledged**. Đó là một tuyên bố về bạn, không phải về alert: điều kiện vẫn còn, và alert tự trở về **OK** khi chỉ số giảm trở lại dưới ngưỡng.

Mỗi bản ghi lưu trữ chi tiết đóng góp tại thời điểm nó kích hoạt: id execution bị lỗi và thông báo lỗi, chi phí theo từng model, hoặc phân tích theo nguồn trigger. Điều này là cố ý. Cửa sổ đã trôi qua, và tính toán lại sau đó có thể cho kết quả khác.

Các bản ghi kích hoạt được giữ trong 90 ngày.

## Hỏi Chat về Alert

Tab [Chat](./chat-tab.md) có thể trả lời các câu hỏi về alert của bạn:

- "Tôi có những alert nào?"
- "Có alert nào trên workflow invoice không?"
- "Tại sao alert chi phí lại kích hoạt?"
- "Lần cuối nó kích hoạt là khi nào?"

Với câu hỏi "tại sao nó kích hoạt", Chat trích dẫn giá trị quan sát được thực tế, ngưỡng, và cửa sổ thời gian từ bản ghi kích hoạt, cùng với chi tiết đóng góp.

## Chia sẻ

Alert có thể được chia sẻ với từng người dùng hoặc với [team](./teams-tab.md). Những người bạn chia sẻ có thể xem alert và lịch sử kích hoạt của nó. Chỉ chủ sở hữu mới có thể chỉnh sửa, tạm dừng, xóa, hoặc chia sẻ lại nó.

### Khi quyền truy cập workflow bị gỡ bỏ

Cảnh báo trên một workflow đơn lẻ vẫn liên tục đọc các chỉ số lượt chạy của workflow đó, vì vậy việc gỡ bỏ quyền truy cập của ai đó vào workflow cũng quyết định điều gì sẽ xảy ra với các cảnh báo của họ trên workflow đó:

- **Gỡ bỏ chia sẻ cho người dùng hoặc team** sẽ hỏi chủ sở hữu workflow xem có nên dừng luôn các cảnh báo của người dùng hoặc team đó trên workflow hay không. Mặc định là dừng. Các cảnh báo bị dừng sẽ được tạm ngưng, không bị xóa, và mỗi cảnh báo được ghi lại dưới dạng `alert.disable_on_access_revoke` trong [audit log](../reference/audit.md).
- **Gỡ bỏ một thành viên của team hoặc xóa một team** luôn dừng các cảnh báo bị ảnh hưởng, vì người thực hiện thay đổi đó không nhất thiết là chủ sở hữu workflow.
- Một cảnh báo chỉ bị dừng khi chủ sở hữu của nó không còn đường truy cập nào khác đến workflow, chẳng hạn như chia sẻ trực tiếp hoặc một team khác.
- Việc tiếp tục hoặc kiểm thử một cảnh báo đã tạm ngưng sẽ kiểm tra lại quyền truy cập của chủ sở hữu, vì vậy một cảnh báo đã bị dừng không thể được bật lại hoặc dùng để đọc các chỉ số của workflow khi không có quyền truy cập. Nhấn **Resume** mà không có quyền truy cập sẽ hiển thị thông báo giải thích rằng chủ sở hữu workflow phải chia sẻ lại trước.

## Quản lý cảnh báo

- **Pause / Resume** — một cảnh báo đã tạm ngưng sẽ không bao giờ được đánh giá. Việc Resume sẽ kiểm tra nó ngay lập tức thay vì chờ đến khoảng thời gian tiếp theo.
- **Edit** — các thay đổi được xác thực toàn bộ, vì vậy một chỉnh sửa từng phần không thể khiến cảnh báo rơi vào trạng thái không hợp lệ.
- **Delete** — xóa cảnh báo và lịch sử kích hoạt của nó.

## Xem thêm

- [Analytics Tab](./analytics-tab.md) — các biểu đồ mà những ngưỡng này được rút ra từ đó
- [Traces Tab](./traces-tab.md) — nơi các số liệu chi phí LLM đến từ
- [Execution History](../reference/execution-history.md) — các lượt chạy mà cảnh báo về lỗi, thời lượng và số lượng đo lường
- [Chat Tab](./chat-tab.md) — truy vấn cảnh báo bằng ngôn ngữ tự nhiên
- [Teams](./teams-tab.md) — chia sẻ cảnh báo với một team
