# Expression DSL

Heym sử dụng một ngôn ngữ biểu thức đơn giản để tham chiếu dữ liệu từ các node phía trước. Sử dụng biểu thức trong cấu hình node như LLM `userMessage`, Condition `condition`, Output `message`, ánh xạ Set, và giá trị Variable. Sử dụng [Expression Evaluation Dialog](./expression-evaluation-dialog.md) để có trình soạn thảo lớn hơn, xem trước trực tiếp do backend cung cấp, và chọn đường dẫn đầu ra.

## Tham chiếu cơ bản

### Input Node và Named Nodes

- **`$input`** – Chỉ sử dụng khi có một [Input](../nodes/input-node.md) node phía trước duy nhất và bạn muốn tham chiếu đầu ra của nó. Ví dụ: `$input.text`. Đây là cách viết tắt cho "dữ liệu từ input được kết nối."
- **`$nodeLabel.field`** – Sử dụng để tham chiếu bất kỳ node phía trước nào bằng **label** của nó (`label` trong data của node). Ưu tiên cách này khi bạn có nhiều node hoặc khi AI Assistant / workflow DSL yêu cầu label rõ ràng. Ví dụ: `$userInput.body.text`, `$myLLM.text`.

**Khi nào dùng cách nào:**

| Ngữ cảnh | Ưu tiên | Ví dụ |
|--------|--------|---------|
| Một input node, luồng đơn giản | `$input.text` | Output message từ một Input |
| Nhiều node hoặc tham chiếu có tên | `$nodeLabel.field` | `$userInput.body.text`, `$fetchLLM.text` |
| [AI Assistant](./ai-assistant.md) / workflow JSON | Luôn dùng `$nodeLabel.field` | Workflow builder yêu cầu label, không phải `$input` |

### Input Node

Sử dụng `$input` để tham chiếu dữ liệu của Input node khi có một input phía trước duy nhất:

```
$input.text
```

### Named Nodes

Tham chiếu bất kỳ node phía trước nào bằng label của nó. Khi một node có [pinned data](./canvas-features.md#data-pin), tính năng hoàn thành biểu thức sẽ dùng dữ liệu đó thay vì đầu ra thực thi.

```
$llm.text
$httpResponse.body
$condition
```

### Credentials

Sử dụng `$credentials.CredentialName` để tham chiếu giá trị credential (ví dụ: API keys, bearer tokens, hoặc Notion integration tokens) theo tên. Xem [Credentials Sharing](./credentials-sharing.md).

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Các tên không phải định danh đơn giản (chứa `-`, bắt đầu bằng chữ số, hoặc là từ khóa dành riêng) sử dụng dạng ngoặc vuông: `$credentials["my-api-key"]`.

### Global Variables

Sử dụng `$global.variableName` để tham chiếu [Global Variables](./global-variables.md) – dữ liệu key-value liên tục, theo phạm vi người dùng, được quản lý trong [Variables tab](../tabs/global-variables-tab.md).

```
$global.environment
$global.settings.baseUrl
```

### Trường lồng nhau

Sử dụng ký hiệu dấu chấm cho các đối tượng lồng nhau:

```
$llm.choices[0].message.content
$input.metadata.userId
```

## Literals

- **Strings**: `"hello"` hoặc `'hello'`
- **Numbers**: `42`, `3.14`
- **Booleans**: `true`, `false`
- **Null**: `null`

## Bảo toàn kiểu dữ liệu

Khi **toàn bộ** giá trị là một `$expr` duy nhất, backend sẽ bảo toàn kiểu gốc:

- `$node.items` → `[1, 2, 3]`
- `$node.meta` → `{"key": "value"}`
- `$node.active` → `true`

Khi một biểu thức là một phần của chuỗi lớn hơn, kết quả cuối cùng luôn là chuỗi:

- `Count: $node.count` → `"Count: 5"`
- `Hello $node.name` → `"Hello Ada"`

## Sticky Notes

Các node [Sticky Note](../nodes/sticky-note-node.md) là tài liệu trên canvas, không phải trường biểu thức có thể thực thi. Nội dung `note` của chúng được hiển thị dưới dạng markdown, vì vậy hãy sử dụng liên kết và hình ảnh markdown thông thường thay vì biểu thức `$...`.

Sticky notes hỗ trợ tiêu đề hiển thị tùy chỉnh và sáu màu nền được lưu:

```json
{
  "type": "sticky",
  "data": {
    "label": "stickyNote",
    "stickyTitle": "Launch Notes",
    "stickyColor": "sky",
    "note": "![Heym Logo](https://heym.run/og-image.png)\n\n[Heym.run](https://heym.run)"
  }
}
```

Các giá trị `stickyColor` được phép là `yellow`, `sky`, `emerald`, `rose`, `violet`, và `zinc`.

## Số học

Các toán tử được hỗ trợ: `+`, `-`, `*`, `/`, `%`

```
$input.count + 1
$llm.tokens * 2
```

## So sánh

Sử dụng trong các node [Condition](../nodes/condition-node.md): `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`

```
$input.text.length > 0
$llm.text != ""
```

## Ngữ cảnh Loop

Bên trong node [Loop](../nodes/loop-node.md), sử dụng `item` để tham chiếu phần tử mảng hiện tại:

```
item.name
item.value
```

## Biến đặc biệt
- `$now` - Datetime hiện tại với các phương thức định dạng
- `$Date()` - Tạo/phân tích ngày (ví dụ: `$Date("2024-01-15")`)
- `$UUID` - Tạo định danh duy nhất 32 ký tự (KHÔNG có dấu ngoặc đơn; dùng `$UUID` không phải `$UUID()`)
- `$workflowName` - Tên của workflow hiện tại
- `$workflowDescription` - Mô tả của workflow hiện tại
- `$workflowPath` - Đường dẫn tương đối của workflow, ví dụ: `/workflows/<id>`
- `$workflowUrl` - URL tuyệt đối của workflow, ví dụ: `https://<host>/workflows/<id>`
- `$executionId` - Id của execution hiện tại (bằng với id mục [Execution History](./execution-history.md), vì vậy `/workflows/<id>/<executionId>` sẽ mở lần chạy này trên canvas). **Chỉ có khi chạy**: trống trong hộp thoại xem trước biểu thức; chỉ được điền khi workflow đang thực thi.
- `$vars` - Biến cục bộ của workflow (truy cập qua `$vars.variableName`; cập nhật qua node `variable`)
- `$global` - Kho biến toàn cục liên tục (truy cập qua `$global.variableName`)
- `$page.record` - Chỉ dành cho workflow của tiện ích bảng điều khiển: bản ghi của trang chi tiết nơi đặt tiện ích, lấy từ tham số `?record=` của bảng điều khiển. Có giá trị `null` trên bảng điều khiển được mở mà không có tham số này và trong hộp thoại xem trước biểu thức. Nút có nhãn `page` sẽ được ưu tiên. Xem [Trang chi tiết](../tabs/dashboard-tab.md#detail-pages).

### Cách dùng $vars
- `$vars.counter` - Truy cập biến có tên `counter`
- `$vars.myArray.add("item")` - Thêm phần tử vào biến mảng

### Cách dùng $global
- `$global.environment` - Truy cập biến toàn cục có tên `environment`
- `$global.settings.baseUrl` - Truy cập các trường lồng nhau trong biến toàn cục kiểu đối tượng

## Ngữ cảnh Request (Thực thi API)
Khi một workflow được thực thi qua HTTP API, các input node sẽ nhận thêm metadata của request:
- `$textInputLabel.body` - Đối tượng body của HTTP request (payload JSON thô)
- `$textInputLabel.headers` - Đối tượng headers của HTTP request (tất cả các key header đều viết thường)
- `$textInputLabel.query` - Đối tượng tham số query của URL

Truy cập dữ liệu request như sau:
- `$userInput.body.fieldName`
- `$userInput.query.paramName`
- `$userInput.headers["x-api-key"]`

## Các hàm chuyển đổi kiểu dữ liệu
- `str(value)` - Chuyển đổi sang string
- `int(value)` - Chuyển đổi sang integer
- `float(value)` - Chuyển đổi sang float
- `bool(value)` - Chuyển đổi sang boolean
- `list(value)` - Chuyển đổi sang list
- `dict(key=value, ...)` - Tạo dictionary với các keyword argument (ví dụ: `$dict(name="Ali", age=30)`)

## Các hàm toán học
- `len(value)` - Lấy độ dài
- `abs(value)` - Giá trị tuyệt đối
- `min(a, b)` - Giá trị nhỏ nhất
- `max(a, b)` - Giá trị lớn nhất
- `round(value)` - Làm tròn số
- `sum(list)` - Tổng của list
- `sorted(list)` - Sắp xếp list
- `randomInt(min, max)` - Số nguyên ngẫu nhiên

## Các hàm xử lý mảng
- `$array(a, b, c)` - Tạo mảng từ các đối số (ví dụ: `$array(1, 2, 3)` -> `[1, 2, 3]`)
- `$range(a, b)` - Tạo dải số nguyên từ `a` đến `b` với `b` bị loại trừ (ví dụ: `$range(1, 5)` -> `[1, 2, 3, 4]`)
  - Sẽ lỗi khi `a > b`
- `notNull(list)` - Loại bỏ các giá trị null khỏi mảng

## Hàm xây dựng chuỗi (cho biểu thức map/filter)
- `concat(a, b, c, ...)` - Nối N đối số
  - Sử dụng bên trong `.map()` dưới dạng chuỗi biểu thức (không có `$` bên trong chuỗi)
  - Sử dụng dấu nháy đơn bên trong chuỗi concat:
    - Đúng: `concat('prefix', 'item.field', 'suffix')`

## Object Literal / Dictionary
Tạo object/dictionary bằng cú pháp dấu ngoặc nhọn với bất kỳ key dạng chuỗi nào:
- `${"name": "Ali", "age": 30}` -> `{"name": "Ali", "age": 30}`

### Key động
- `${now.format("MMMM DD"): "Today's value"}`
- `${"item_" + str(loopNode.index): loopNode.item}`

### Quy tắc Object Literal
- Key có thể là bất kỳ chuỗi nào (bao gồm cả khoảng trắng/ký tự đặc biệt)
- Key BẮT BUỘC phải được đặt trong dấu nháy kép (ví dụ: `"key"`)
- Giá trị có thể là chuỗi/số/boolean/biểu thức/object lồng nhau

## Các hàm xử lý chuỗi
- `upper(text)` - Chuyển thành chữ hoa
- `lower(text)` - Chuyển thành chữ thường
- `strip(text)` - Cắt khoảng trắng
- `capitalize(text)` - Viết hoa chữ cái đầu
- `title(text)` - Viết hoa chữ cái đầu mỗi từ
- `split(text, separator)` - Tách chuỗi
- `join(separator, list)` - Nối list
- `replace(text, old, new)` - Thay thế văn bản
- `regexReplace(text, pattern, replacement)` - Thay thế bằng pattern regex
- `base64Encode(text)` - Mã hóa văn bản UTF-8 thành Base64 chuẩn
- `base64Decode(text)` - Giải mã Base64 chuẩn thành văn bản UTF-8
- `toJson(text)` - Phân tích chuỗi JSON thành object, array hoặc giá trị

## Các phương thức chuỗi (trên giá trị chuỗi)
- `.orEmpty()` - Trả về giá trị chuỗi, hoặc `""` khi giá trị là null/không tồn tại
- `.upper()` / `.lower()` - Chuyển đổi chữ hoa/thường
- `.strip()` - Cắt khoảng trắng
- `.capitalize()` / `.title()` - Viết hoa
- `.length` - Độ dài chuỗi
- `.toString()` - Chuyển đổi sang chuỗi
- `.substring(start, end)` - Trích xuất chuỗi con
- `.contains(text)` - Kiểm tra có chứa chuỗi con không
- `.startswith(prefix)` / `.endswith(suffix)` - Kiểm tra tiền tố/hậu tố
- `.indexOf(text)` - Tìm vị trí (trả về -1 nếu không tìm thấy)
- `.replace(old, new)` - Thay thế lần xuất hiện đầu tiên
- `.replaceAll(old, new)` - Thay thế tất cả các lần xuất hiện
- `.regexReplace(pattern, replacement)` - Thay thế bằng pattern regex
- `.hash()` - Mã băm MD5 của chuỗi
- `.base64Encode()` - Mã hóa văn bản UTF-8 thành Base64 chuẩn
- `.base64Decode()` - Giải mã Base64 chuẩn thành văn bản UTF-8
- `.urlEncode()` - Mã hóa URL chuỗi
- `.urlDecode()` - Giải mã URL chuỗi
- `.escape()` - Escape chuỗi JSON (chuyển các ký tự đặc biệt sang định dạng JSON)
- `.unescape()` - Unescape chuỗi JSON (chuyển định dạng JSON về chuỗi gốc)
- `.toJson()` - Phân tích chuỗi JSON thành object, array hoặc giá trị

### Ví dụ về phương thức chuỗi
- `$profile.nickname.orEmpty()` - Chuyển văn bản nullable/không tồn tại thành chuỗi rỗng
- `$text.upper()` - Chuyển thành chữ hoa
- `$text.lower()` - Chuyển thành chữ thường
- `$text.strip()` - Loại bỏ khoảng trắng
- `$text.replace("old", "new")` - Thay thế văn bản
- `$text.replaceAll("a", "b")` - Thay thế tất cả các lần xuất hiện
- `$text.length` - Lấy độ dài chuỗi
- `$text.escape()` - Escape các ký tự JSON đặc biệt (ví dụ: dấu nháy, ký tự xuống dòng)
- `$escapedText.unescape()` - Unescape chuỗi định dạng JSON về chuỗi gốc
- `$text.toJson()` - Phân tích chuỗi JSON object/array (sau đó `$text.toJson().repoUrl`)
- `$toJson($text)` - Phân tích tương tự dưới dạng hàm
- `$base64Encode("Héym 🌍")` - Trả về `SMOpeW0g8J+MjQ==`
- `$encodedText.base64Decode()` - Giải mã Base64 thành văn bản UTF-8
- `$text.urlEncode()` - Mã hóa URL cho các tham số API
- `$encodedText.urlDecode()` - Giải mã văn bản đã mã hóa URL

## Array Methods (trên array)
- `.first()` - Lấy phần tử đầu tiên
- `.last()` - Lấy phần tử cuối cùng
- `.random()` - Lấy phần tử ngẫu nhiên
- `.reverse()` - Đảo ngược array
- `.flat()` - Làm phẳng các array lồng nhau thành một array duy nhất
- `.flat(depth)` - Làm phẳng với giới hạn độ sâu
- `.distinct()` - Loại bỏ các phần tử trùng lặp
- `.distinctBy(expr)` - Loại bỏ trùng lặp theo biểu thức (ví dụ: `$array.distinctBy("item.id")`)
- `.notNull()` - Loại bỏ các giá trị null
- `.add(item)` - Thêm phần tử (trả về array mới)
- `.contains(item)` - Kiểm tra array có chứa phần tử không (trả về boolean)
- `.join(separator)` - Nối các phần tử array thành một chuỗi
- `.filter(expr)` - Lọc array bằng biến `item` (ví dụ: `$array.filter("item > 5")`)
- `.map(expr)` - Biến đổi từng phần tử bằng biến `item` (ví dụ: `$array.map("item.name")`)
- `.sort(expr, order)` - Sắp xếp theo biểu thức, order là `"asc"` (mặc định) hoặc `"desc"`
- `.take(n)` - Lấy N phần tử đầu tiên (n dương) hoặc N phần tử cuối cùng (n âm)
- `.length` - Độ dài của array
- `.toString()` - Chuyển đổi thành chuỗi JSON

### Ví dụ Filter / Map / Sort
- `$numbers.filter("item > 5")`
- `$users.filter("item.active == true")`
- `$users.map("item.name")`
- `$numbers.map("item * 2")`
- `$users.sort("item.age")`
- `$numbers.sort("item", "desc")`
- `$numbers.take(3)`
- `$numbers.take(-2)`

## Object/Dictionary Methods (trên object)
- `.get(key)` - Lấy giá trị theo key (trả về null nếu không tìm thấy)
- `.get(key, default)` - Lấy giá trị theo key với giá trị mặc định dự phòng
- `.keys()` - Trả về danh sách tất cả các key
- `.values()` - Trả về danh sách tất cả các giá trị
- `.entries()` - Trả về danh sách các object `{key, value}` (mỗi thuộc tính một object)
- `.filter(expr)` - Duyệt các entry `{key, value}` và trả về các entry khớp dưới dạng danh sách (dùng `item.key` / `item.value` trong `expr`)
- `.map(expr)` - Duyệt các entry `{key, value}` và trả về danh sách các giá trị đã biến đổi (dùng `item.key` / `item.value` trong `expr`)
- `.toString()` - Chuyển đổi thành chuỗi JSON

### Ví dụ duyệt Object
Khi duyệt một object bằng `.map()` hoặc `.filter()`, mỗi `item` là một cặp `{key, value}`:

- `$readSheet.rows.first().keys()` → `["colA", "colB"]`
- `$readSheet.rows.first().values()` → `["foo", "bar"]`
- `$readSheet.rows.first().map("item.value")` → `["foo", "bar"]`
- `$readSheet.rows.first().map("concat('item.key', ': ', 'item.value')")` → `["colA: foo", "colB: bar"]`
- `$profile.filter("item.value != null").map("item.key")` → danh sách các tên thuộc tính không phải null

## Date/Time
- `$now` - Datetime hiện tại
- `$now.format("YYYY-MM-DD")` - Định dạng date/time
- `$now.toISO()` / `.toDate()` / `.toTime()` - Chuyển đổi định dạng
- `$now.addDays(n)` / `.addHours(n)` - Tính toán ngày tháng
- `$Date("2024-01-15")` - Phân tích chuỗi ngày

## Numeric Operations
- Phép toán cơ bản: `+`, `-`, `*`, `/`, `%`
- So sánh: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Toán tử boolean: `and`, `or`, `not`

## Boolean Conditions
Đối với boolean, hãy viết biểu thức trực tiếp (không ép buộc `== true`):
- Sai: `$nodeName.isValid == true`
- Đúng: `$nodeName.isValid`
- Phủ định: `not $nodeName.isValid`

## Rules & Whitelist (Quan trọng)
### Quy tắc đặt `$`
- Một biểu thức độc lập thường bắt đầu bằng `$` ở đầu.
- Template string có thể chứa nhiều `$refs`.
- Tham số của method cũng có thể chứa các `$refs` lồng nhau khi bạn muốn truyền kết quả của một biểu thức khác (dynamic key hoặc phân giải lồng nhau).
  - Hợp lệ: `$node.method(other.field)` — `other` được phân giải từ context giống như một label cấp cao nhất (không có `$` bên trong tham số).
  - Hợp lệ: `$node.method($other.field)` — `$` lồng nhau được hỗ trợ trong bản xem trước của hộp thoại evaluate và khi đánh giá điều kiện.
  - Hợp lệ: `$array($a.x, $b.y)`
  - Autocomplete bên trong `.get(` sẽ chèn các đường dẫn `label.field` **trần** (không có `$` ở đầu), giống như bên trong `$array(...)` / `$notNull(...)`.
- **Evaluate API (Run):** Nếu toàn bộ giá trị được gửi là một dot path duy nhất **không** có `$` ở đầu (ví dụ: đoạn text được chọn trong editor, như `execute.outputs.output.result.today`), backend sẽ xử lý giống như `$execute.outputs.output.result.today`. Các giá trị chứa ký tự xuống dòng hoặc carriage return sau khi trim sẽ không được viết lại (tránh payload nhiều dòng gây nhập nhằng). Nên viết `$` trong các trường workflow đã lưu; việc viết lại chủ yếu phục vụ cho mục đích kiểm tra và tooling.
- Kết quả `Run` trong hộp thoại Evaluate là nguồn tham chiếu chính xác cho cách một biểu thức cụ thể được phân giải.

### Trích dẫn chuỗi trong Array
Khi tạo array với các giá trị chuỗi, LUÔN dùng dấu ngoặc kép:
- Đúng: `$array("hello", "world")`
- Sai: `$array('hello', 'world')`

### CHỈ SỬ DỤNG CÁC HÀM NÀY (Whitelist)
Chỉ sử dụng:
- `str()`, `int()`, `float()`, `bool()`, `list()`, `dict(key=value, ...)`
- `len()`, `abs()`, `min()`, `max()`, `round()`, `sum()`, `sorted()`
- `randomInt()`, `range()`, `array()`, `notNull()`
- `upper()`, `lower()`, `strip()`, `capitalize()`, `title()`
- `split()`, `join()`, `replace()`, `regexReplace()`, `hash()`
- `base64Encode()`, `base64Decode()`, `toJson()`
- các method string/array/object đã được tài liệu hóa

Nếu một hàm không có trong danh sách trên, hàm đó không tồn tại.

### Giới hạn Method của Arrays / Dicts
- Arrays CHỈ được dùng: `.first()`, `.last()`, `.random()`, `.reverse()`, `.flat()`, `.distinct()`, `.distinctBy()`, `.notNull()`, `.add()`, `.contains()`, `.join()`, `.filter()`, `.map()`, `.sort()`, `.take()`, `.length`, `.toString()`
- Objects/Dicts CHỈ được dùng: `.get(key)`, `.get(key, default)`, `.keys()`, `.values()`, `.entries()`, `.filter(expr)`, `.map(expr)`, `.toString()`

### Tên nhãn Node dành riêng
Không sử dụng các tên này làm nhãn node: `length`, `orEmpty`, `toString`, `toUpperCase`, `toLowerCase`, `substring`, `indexOf`, `contains`, `startsWith`, `endsWith`, `replace`, `replaceAll`, `regexReplace`, `hash`, `toJson`, `first`, `last`, `random`, `reverse`, `distinct`, `notNull`, `filter`, `map`, `entries`, `keys`, `values`, `sort`, `join`, `headers`, `query`, `value`, `list`, `result`, `array`, `vars`, `items`, `name`, `type`, `status`, `body`, `outputs`, `result`, `item`, `index`, `total`, `isFirst`, `isLast`, `branch`, `results`, `merged`, `error`, `errorNode`, `errorNodeType`, `timestamp`, `input`, `now`, `date`.

## Ví dụ

**Condition**: `$input.text.length > 0`

**LLM user message**: `$input.text`

**Output message**: `$llm.text`

**Variable value**: `$input.count + 1`

### Ví dụ DSL

```dsl
$input.text
$llm.text
$input.count + 1
item.name
```

## Liên quan

- [Expression Evaluation Dialog](./expression-evaluation-dialog.md) – Trình chỉnh sửa có thể mở rộng với xem trước trực tiếp từ backend và tự động hoàn thành
- [Canvas Features](./canvas-features.md) – Data pin để kiểm thử biểu thức mà không cần chạy lại node
- [Node Types](./node-types.md) – Các node sử dụng biểu thức ([LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md), [Output](../nodes/output-node.md), [Set](../nodes/set-node.md), v.v.)
- [Sticky Note](../nodes/sticky-note-node.md) – Ghi chú markdown trên canvas với tiêu đề có thể chỉnh sửa, màu sắc và hiển thị hình ảnh
- [Agent Node](../nodes/agent-node.md) – Sử dụng biểu thức trong prompt của agent
- [Agent Persistent Memory](./agent-persistent-memory.md) – `persistentMemoryEnabled` và `memoryShares` trong `data` của agent (không phải trường biểu thức)
- [Workflow Structure](./workflow-structure.md) – Các trường `data` của node chấp nhận biểu thức
- [Credentials Tab](../tabs/credentials-tab.md) – Credentials được tham chiếu bởi các node
- [Credentials Sharing](./credentials-sharing.md) – Chia sẻ credentials và sử dụng `$credentials` trong biểu thức
- [Global Variables](./global-variables.md) – Biến lâu dài với `$global`
