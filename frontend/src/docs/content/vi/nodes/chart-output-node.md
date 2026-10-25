# Đầu ra biểu đồ

Node **Chart Output** là node đầu cuối của workflow [dashboard widget](../tabs/dashboard-tab.md). Node này nhận các hàng do các node thượng nguồn tạo ra và chuyển chúng thành payload biểu đồ chuẩn hóa để dashboard hiển thị.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 0 (đầu cuối) |
| Output | Payload biểu đồ chuẩn hóa |

Đặt node này **cuối cùng** trong workflow dashboard-widget. Node đứng trước nó nên tạo ra một mảng các đối tượng hàng, ví dụ:

```json
[
  { "month": "Jan", "revenue": 120 },
  { "month": "Feb", "revenue": 150 }
]
```

Khi bạn chỉ có dữ liệu ví dụ/mẫu (không có nguồn thực), hãy tạo các hàng này bằng node **Set** sử dụng `$array(dict(...), dict(...))` — ví dụ `$array(dict(month="Jan", revenue=120), dict(month="Feb", revenue=150))`. **Không** sử dụng `${...}` hoặc literal đối tượng `{...}` trần; Heym chỉ xây dựng đối tượng bằng `dict(key=value)`.

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `label` | string | Định danh node (camelCase) |
| `chartType` | string | `pie`, `bar`, `line`, `area`, `table`, `numeric`, `gauge`, `scatter`, `proportion`, `barGauge`, `text`, hoặc `hitl` |
| `orientation` | string | `vertical` hoặc `horizontal` (chỉ biểu đồ bar) |
| `dataPath` | string | Đường dẫn dot tới mảng hàng bên trong output thượng nguồn (ví dụ `data` hoặc `result.items`). Để trống để tự động phát hiện. |
| `labelField` | string | Khóa hàng được dùng làm nhãn danh mục (pie/bar/line) |
| `valueField` | string | Khóa hàng được dùng làm giá trị số (pie/bar/line/numeric/gauge) |
| `series` | array | Định nghĩa đa chuỗi tùy chọn `[{ "name": "Sent", "field": "sent" }]` cho bar/line (ghi đè `valueField`) |
| `columns` | array | Danh sách cột tùy chọn cho `table` (mặc định là các khóa của hàng đầu tiên) |
| `statusColumn` | string | Cột `table` tùy chọn được hiển thị dưới dạng [nhãn trạng thái](#status-chips) có màu. Phải là một trong các cột được hiển thị. |, và với `linkColumn` thì còn mang theo cột liên kết và văn bản nút.
| `statusTones` | object | Ánh xạ tùy chọn từ giá trị trạng thái sang sắc thái (`success`, `attention`, `failure`, `waiting`, `neutral`) cho các giá trị không nằm trong mặc định |
| `linkColumn` | string | Cột `table` tùy chọn có các ô chứa URL, được hiển thị dưới dạng [nút liên kết](#link-buttons) mở URL đó trong tab mới. Phải là một trong các cột được hiển thị. |
| `linkLabel` | string | Văn bản tùy chọn của nút liên kết. Nếu để trống, nút chỉ hiển thị biểu tượng liên kết. |
| `xField` / `yField` | string | Khóa hàng cho trục X và Y số (scatter) |
| `min` / `max` | number | Phạm vi số cho `gauge` (mặc định `0` / `100`) |
| `unit` | string | Đơn vị tùy chọn hiển thị bên cạnh giá trị `numeric` hoặc `gauge` |
| `text` | string | Thông điệp Markdown cho loại biểu đồ `text`. Để trống và đặt `valueField` để hiển thị thông điệp động lấy từ dữ liệu thượng nguồn. |
| `title` | string | Tiêu đề biểu đồ tùy chọn |
| `hitlWorkflowId` | string | Chỉ dành cho `hitl`. Chỉ hiển thị các bản review của Workflow này. Nếu để trống, widget hiển thị mọi bản review. |
| `hitlNodeId` | string | Chỉ dành cho `hitl`. Thu hẹp `hitlWorkflowId` về một bước: Agent có review của con người, hoặc bước phê duyệt, nút bấm hay biểu mẫu trên Slack. |

## Các loại biểu đồ

- **bar / line / area / pie** — biểu đồ phân loại được điều khiển bởi `labelField` + `valueField` (hoặc `series` cho bar/line/area đa chuỗi). `area` là biểu đồ xu hướng có tô nền.
- **table** — các hàng thô được hiển thị dưới dạng bảng cuộn sử dụng `columns`. Một cột có thể hiển thị dưới dạng [nhãn trạng thái](#status-chips), và các hàng có thể mở một [trang chi tiết](../tabs/dashboard-tab.md#detail-pages).
- **numeric** — một giá trị KPI đơn từ hàng đầu tiên, với `unit` tùy chọn.
- **gauge** — một giá trị đơn được hiển thị theo phạm vi `min`–`max` (ví dụ phần trăm). Sử dụng `valueField`.
- **scatter** — các điểm X/Y từ `xField` và `yField` cho biểu đồ tương quan.
- **proportion** — một thanh ngang đơn được chia thành các phần với chú thích phần trăm (ví dụ phân bố ngôn ngữ). Sử dụng `labelField` + `valueField`.
- **barGauge** — một gauge ngang cho mỗi hàng với gradient đỏ→xanh và một giá trị (ví dụ dung lượng đĩa trống). Sử dụng `labelField` + `valueField`, `unit` và `max` tùy chọn (mặc định là giá trị hàng lớn nhất).
- **text** — một thông điệp markdown (ví dụ ghi chú trạng thái như "Lần thực thi cuối lúc 19:47"). Đặt markdown trong `text` cho thông điệp tĩnh, hoặc để trống `text` và đặt `valueField` để hiển thị chuỗi được tạo từ thượng nguồn. Hỗ trợ tiêu đề, in đậm/in nghiêng, [danh sách](../nodes/chart-output-node.md#interactive-task-lists), liên kết và inline code.
- **hitl** — băng chuyền các đánh giá thủ công đang chờ của bạn. Tiêu đề hiển thị `1/n pending`; mũi tên trái bị vô hiệu hóa ở thẻ đầu tiên và mũi tên phải ở thẻ cuối cùng. Tên workflow mở lần chạy đó trên canvas. **Approve**, **Request changes**, và **Reject** giải quyết nó, và biểu tượng lịch sử bên cạnh tiêu đề widget mở lần chạy đó trong hộp thoại lịch sử trên cùng trang. Loại biểu đồ này bỏ qua các hàng thượng nguồn, vì vậy workflow widget chỉ là node Chart Output. Mỗi người đã đăng nhập sẽ thấy các đánh giá trên các workflow mà họ sở hữu. Hãy chọn một **Workflow** (và **Select agent** khi nó có nhiều bước review) trong thuộc tính của node hoặc trong phần cài đặt của widget để hiển thị các bản review của Workflow đó, cho mọi người có thể mở nó; xem [widget HITL](../tabs/dashboard-tab.md#hitl-widgets).

### Danh sách tác vụ tương tác

Sử dụng cú pháp danh sách tác vụ markdown kiểu GitHub trong trường `text` tĩnh:

```markdown
- [x] Option 1
- [ ] Option 2
- [ ] Option 3
```

Trên [Dashboard](../tabs/dashboard-tab.md), các checkbox hiển thị dưới dạng điều khiển có thể nhấp (thân thiện với chế độ tối và sáng). Việc bật/tắt checkbox cập nhật trường `text` của workflow widget và được lưu giữ qua các lần làm mới.

**Chỉnh sửa nội tuyến:** nhấp đúp vào nhãn của một mục tác vụ để chỉnh sửa tại chỗ. Nhấn Enter hoặc nhấp ra ngoài để lưu; nhấn Escape để hủy. Xóa hoàn toàn nhãn để loại bỏ mục đó khỏi danh sách.

**Liên kết trong mục tác vụ:** khi nhãn chứa liên kết markdown (`[title](url)`), nhấp vào liên kết sẽ mở URL mà không bật/tắt checkbox. Nhấp vào chỗ khác trên hàng để bật/tắt.

**Chỉ văn bản tĩnh:** tính tương tác yêu cầu cú pháp danh sách tác vụ GFM (`- [ ]` / `- [x]`). Các thông điệp trạng thái động thuần túy không có mục tác vụ vẫn chỉ đọc. Khi markdown đến từ `valueField`, lần bật/tắt đầu tiên sẽ sao chép nó vào trường `text` tĩnh để các thay đổi được lưu giữ.
### Danh sách có đánh số

Text widget hiển thị markdown với **số dòng được chỉ định rõ ràng và giữ nguyên**. Thêm tiền tố số bạn muốn hiển thị vào đầu mỗi dòng (ví dụ: `9.`, `8.`, `7.`). Heym không tự động đánh số lại các dòng cho bạn.

**Tại sao cần số chỉ định rõ ràng?** Danh sách có thứ tự trong markdown tiêu chuẩn (`1.`, `2.`, `3.`) sẽ trở thành danh sách HTML `<ol>`, chỉ đếm **tăng dần** từ số đầu tiên. Một danh sách được viết là `9.` / `8.` / `7.` sẽ hiển thị thành `9`, `10`, `11` trong trình render markdown thông thường. Thêm tiền tố số mong muốn vào mỗi dòng sẽ tránh được vấn đề đó.

**Danh sách giảm dần (ví dụ: mới nhất trước):** xây dựng markdown trong một vòng lặp workflow và tính số hiển thị cho từng mục:

```
${loop.total - loop.index}. [${item.title}](https://example.com/watch?v=${item.id})
```

Mẫu điển hình:

1. Lấy hoặc xây dựng một mảng các mục (ví dụ: HTTP → `body.videos`).
2. [Loop](./loop-node.md) qua mảng; bên trong body, sử dụng [Variable](./variable-node.md) với `.add()` để thêm một dòng có đánh số cho mỗi lần lặp.
3. Sau nhánh **done** của loop, [Set](./set-node.md) `join("\n")` trên mảng đã tích lũy (hoặc tương đương) thành một chuỗi markdown duy nhất.
4. Trỏ **Chart Output** `valueField` vào chuỗi đó (hoặc đặt `text` tĩnh).

Ví dụ biểu thức dòng bên trong loop (label `processVideos`, các mục có `title` và `id`):

```
$processVideos.total - $processVideos.index + ". [" + $processVideos.item.title + "](https://www.youtube.com/watch?v=" + $processVideos.item.id + ")"
```

Markdown kết quả:

```markdown
9. [Latest video](https://www.youtube.com/watch?v=abc)
8. [Previous video](https://www.youtube.com/watch?v=def)
1. [Oldest video](https://www.youtube.com/watch?v=xyz)
```

Đối với danh sách tăng dần đơn giản bắt đầu từ 1, hoặc thêm tiền tố vào mỗi dòng (`1.`, `2.`, `3.`) hoặc sử dụng loop với `$loop.index + 1`. Sử dụng [danh sách bullet](#interactive-task-lists) (`- item`) khi bạn không cần số.

## Nhãn trạng thái

Một `table` có thể hiển thị một cột dưới dạng các nhãn (chips) có màu. Đặt **Status column** trong thuộc tính của node (hoặc `statusColumn` trong DSL) thành tên một cột. Mỗi giá trị sẽ nhận một trong năm sắc thái, và các từ thông dụng sẽ tự động nhận sắc thái mà không cần cấu hình:

| Sắc thái | Các từ mặc định |
|------|---------------|
| `success` | success, successful, succeeded, done, complete, completed, approved, active, ok, paid, passed, healthy, resolved, won, delivered, published |
| `attention` | warning, attention, review, needs review, at risk, partial, degraded, overdue, unpaid, expiring |
| `failure` | failed, failure, error, errored, rejected, declined, blocked, lost, expired |
| `waiting` | pending, waiting, queued, running, in progress, processing, scheduled, draft, new, open |
| `neutral` | bất kỳ giá trị nào khác |

Việc so khớp không phân biệt chữ hoa/thường, dấu `_` và `-`, vì vậy `IN_PROGRESS` và `in-progress` đều là `waiting`. Thêm **Status tones** cho các giá trị khác; một mục nhập sẽ ghi đè mặc định cho giá trị đó:

```json
{
  "type": "chartOutput",
  "data": {
    "label": "invoices",
    "chartType": "table",
    "dataPath": "rows",
    "columns": ["invoice", "customer", "state"],
    "statusColumn": "state",
    "statusTones": { "Disputed": "failure" }
  }
}
```

Máy chủ phân giải mỗi giá trị thành sắc thái tương ứng, nhờ đó Heym và Heym Work hiển thị cùng màu sắc.

## Trang chi tiết: `$page.record`

Một bảng điều khiển được mở với `?record=<value>` sẽ chạy mọi Workflow của widget với giá trị đó dưới dạng `$page.record`. Liên kết trên hàng của bảng sẽ mở một trang như vậy; xem [Trang chi tiết](../tabs/dashboard-tab.md#detail-pages). Trên bảng điều khiển được mở mà không có bản ghi và trong hộp thoại biểu thức, `$page.record` có giá trị `null`. Một node có nhãn `page` sẽ được ưu tiên hơn.

Sử dụng nó để lấy đúng bản ghi mà trang đang đề cập tới, ví dụ trong một node [HTTP](./http-node.md):

```
https://crm.example.com/api/customers?id=$page.record
```

`$page.record` chính là giá trị của hàng được nhấp vào, chẳng hạn như `V-1002`, chứ không phải một đối tượng có các trường. Để tìm bản ghi đó trong [DataTable](./datatable-node.md), hãy lọc cột bản ghi theo giá trị này: thao tác `find` với bộ lọc `{"vendor_id": "$page.record"}`. Một đường dẫn như `$page.record.id` sẽ không phân giải ra kết quả nào, vì vậy widget do AI tạo hoặc tinh chỉnh sẽ loại bỏ các trường đó và đọc trực tiếp `$page.record`.

Giá trị này đến từ một URL mà bất kỳ ai cũng có thể chỉnh sửa. Bảng điều khiển chỉ chấp nhận các giá trị theo định dạng bản ghi của nó (mặc định là chữ cái, chữ số, `-`, `_` và `.`), nhưng hãy luôn coi đó là đầu vào không đáng tin cậy: truyền nó vào nơi node thực hiện escape giá trị, chẳng hạn như tham số truy vấn HTTP hoặc giá trị bộ lọc [DataTable](./datatable-node.md) hay ClickHouse, và không bao giờ tạo văn bản truy vấn bằng cách nối chuỗi với nó. Các widget vẫn chạy dưới quyền của chủ sở hữu bảng điều khiển, bất kể ai là người mở trang.

## Cách dữ liệu được xử lý

1. Nếu `dataPath` được đặt, node sẽ đi theo đường dẫn dot đó vào output thượng nguồn.
2. Ngược lại, nó tìm một mảng: danh sách cấp cao nhất, mảng `data`, hoặc trường có giá trị danh sách đầu tiên.
3. Các hàng lấy trực tiếp từ node [Data Table](./datatable-node.md) (`{id, data, created_at}`) được đọc cùng các cột ở cấp cao nhất bên cạnh `id`, do đó `labelField`, `valueField` và `columns` chỉ định trực tiếp các cột của chính bảng đó.
4. Đối với `table`, mỗi hàng trở thành một hàng bảng sử dụng `columns` (hoặc các key của hàng đầu tiên). Với `statusColumn`, Payload cũng mang theo sắc thái của từng giá trị trong cột đó.
5. Đối với `numeric` và `gauge`, giá trị đến từ `valueField` trên hàng đầu tiên (hoặc trường số đầu tiên).
6. Đối với `scatter`, mỗi hàng trở thành một điểm `[xField, yField]`.
7. Đối với `text`, thông điệp được lấy từ `valueField` trên hàng đầu tiên khi được đặt, ngược lại từ cấu hình `text` tĩnh (nếu không thì từ trường chuỗi đầu tiên của hàng đầu tiên).

## Ví dụ

```json
{
  "type": "chartOutput",
  "data": {
    "label": "revenueChart",
    "chartType": "bar",
    "orientation": "vertical",
    "dataPath": "data",
    "labelField": "month",
    "valueField": "revenue",
    "title": "Monthly revenue"
  }
}
```

Gauge (giá trị đơn so với một khoảng):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "cpuGauge",
    "chartType": "gauge",
    "dataPath": "rows",
    "valueField": "value",
    "min": 0,
    "max": 100,
    "unit": "%"
  }
}
```

Scatter (điểm X/Y):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "correlation",
    "chartType": "scatter",
    "dataPath": "rows",
    "xField": "x",
    "yField": "y"
  }
}
```

Proportion (một thanh được chia theo tỷ lệ + chú thích phần trăm):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "languages",
    "chartType": "proportion",
    "dataPath": "rows",
    "labelField": "name",
    "valueField": "value",
    "title": "Most Used Languages"
  }
}
```

Area (xu hướng đa chuỗi được tô đầy):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "memCpu",
    "chartType": "area",
    "dataPath": "rows",
    "labelField": "time",
    "series": [
      { "name": "Memory", "field": "memory" },
      { "name": "CPU", "field": "cpu" }
    ],
    "title": "Memory / CPU"
  }
}
```

Bar gauge (gauge gradient theo từng hàng với các giá trị):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "freeDisk",
    "chartType": "barGauge",
    "dataPath": "rows",
    "labelField": "name",
    "valueField": "value",
    "unit": "GB",
    "title": "Free disk space"
  }
}
```

Text (thông điệp markdown tĩnh — không yêu cầu hàng thượng nguồn):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "statusNote",
    "chartType": "text",
    "text": "**Last execution** at `19:47` — all checks passed ✅",
    "title": "Status"
  }
}
```

Text (động — chuỗi thông điệp được tạo ở thượng nguồn và lấy qua `valueField`):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "lastRun",
    "chartType": "text",
    "dataPath": "rows",
    "valueField": "message"
  }
}
```
## Ví dụ về AI prompt

Khi tạo một widget bằng **AI**, những prompt như sau sẽ ánh xạ rõ ràng tới từng loại:

- **Bar** — "Hiển thị doanh thu hàng tháng trong 6 tháng gần nhất dưới dạng biểu đồ cột dọc với dữ liệu ví dụ."
- **Line** — "Vẽ biểu đồ số người dùng hoạt động hàng ngày trong 14 ngày gần nhất dưới dạng biểu đồ đường."
- **Area** — "Hiển thị mức sử dụng bộ nhớ và CPU trong 24 giờ gần nhất dưới dạng biểu đồ vùng với hai chuỗi. Sử dụng dữ liệu ví dụ."
- **Pie** — "Phân tách trạng thái thực thi (success, error, cancelled) dưới dạng biểu đồ tròn."
- **Table** — "Hiển thị top 10 workflow theo số lần thực thi dưới dạng bảng cuộn được với các cột name và runs. Sử dụng dữ liệu ví dụ."
- **Numeric** — "Hiển thị tổng số lần thực thi workflow hôm nay dưới dạng một KPI duy nhất với đơn vị 'runs'. Sử dụng dữ liệu ví dụ."
- **Gauge** — "Hiển thị mức sử dụng CPU hiện tại dưới dạng gauge từ 0 đến 100 phần trăm."
- **Scatter** — "Vẽ biểu đồ độ trễ yêu cầu so với kích thước payload dưới dạng biểu đồ phân tán với dữ liệu ví dụ."
- **Proportion** — "Hiển thị các ngôn ngữ tôi dùng nhiều nhất dưới dạng thanh tỷ lệ: Kotlin 49.64%, JavaScript 23.73%, TypeScript 11.64%, Java 8.92%, Python 6.06%. Sử dụng dữ liệu ví dụ."
- **Bar gauge** — "Hiển thị dung lượng đĩa trống theo từng volume (sda1 đến sda7) dưới dạng bar gauge theo GB. Sử dụng dữ liệu ví dụ."
- **Text** — "Thêm một widget văn bản với danh sách kiểm tra markdown (một mục đã đánh dấu, hai mục chưa đánh dấu), hoặc liệt kê 5 video hướng dẫn mới nhất theo thứ tự giảm dần (5. xuống 1.) kèm liên kết YouTube — thêm số rõ ràng vào đầu mỗi dòng (`5. Title`, `4. Title`, …)."

## Liên quan

- [Tab Dashboard](../tabs/dashboard-tab.md) — xây dựng và sắp xếp widget
- [Node đầu ra](output-node.md) — node kết thúc cho các workflow thông thường


## Nút liên kết

Một `table` có thể biến một cột thành các nút mở liên kết. Hãy đặt **Link column** trong thuộc tính của node (hoặc `linkColumn` trong DSL) thành một cột có các ô chứa URL, và tùy chọn đặt **Link button text** (`linkLabel`). Mỗi ô trở thành một nút mở URL của nó trong tab mới. Nếu không có văn bản nút, nút chỉ hiển thị biểu tượng liên kết:

| Giá trị ô | Mở |
| --------- | --- |
| `https://jira.example.com/browse/T-1` | Một trang web khác, trong tab mới |
| `/dashboards` | Một trang bên trong Heym, trong tab mới |

Chỉ các địa chỉ `http://` và `https://` cùng các đường dẫn bắt đầu bằng một dấu `/` duy nhất mới trở thành nút. Mọi giá trị khác, chẳng hạn `javascript:` hoặc `//host`, vẫn là văn bản thuần, và ô trống không hiển thị gì.

Nút hoạt động cùng với [liên kết hàng](../tabs/dashboard-tab.md#detail-pages): nhấp vào nút sẽ mở liên kết của nó trong tab mới, còn nhấp vào bất kỳ vị trí nào khác trên hàng vẫn mở trang chi tiết.
