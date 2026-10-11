# Hộp thoại đánh giá biểu thức

Hộp thoại Đánh giá Biểu thức là trình soạn thảo mở rộng dành cho các trường hỗ trợ biểu thức. Nó mở ra từ nút mở rộng bên cạnh trường nhập biểu thức và cung cấp cho bạn không gian làm việc lớn hơn, tính năng tự động hoàn thành, xem trước trực tiếp từ backend và duyệt kết quả đầu ra trong cùng một nơi.

## Mở Hộp thoại

- Nhấp vào nút mở rộng bên cạnh trường biểu thức trong bảng Properties.
- Các trường nhiều dòng hiển thị nút bên trong ô nhập.
- Các trường một dòng hiển thị nút ở bên phải ô nhập.

## Bố cục Hộp thoại

- Hộp thoại mở ra dưới dạng modal căn giữa với kích thước khoảng **80vw × 80vh**.
- Tiêu đề hiển thị **Evaluate — {tên trường}** khi nhãn trường được biết.
- Trình soạn thảo giữ nguyên tính năng tự động hoàn thành, điều hướng giữa các trường và các hành động **Apply** / **Cancel** thông thường.
- Phần xem trước tự động làm mới khoảng **300 ms** sau khi bạn ngừng gõ.
- Nhấn `Ctrl` / `Cmd` + `Enter` để áp dụng văn bản hiện tại trở lại trường và đóng hộp thoại (giống như **Apply**).

## Phần Output

Khu vực Output tự động làm mới sau khi bạn tạm dừng gõ trong trình soạn thảo.

### Đánh giá

| Loại biểu thức | Kết quả |
|---|---|
| Một `$expr` duy nhất (toàn bộ trường) | Giá trị gốc được giữ nguyên |
| Một đường dẫn dot trần duy nhất (toàn bộ trường, không có `$`, không có ký tự xuống dòng nhúng) | Giống như `$` + đường dẫn đó (backend chuẩn hóa để đánh giá) |
| Văn bản có nhúng `$refs` | Kết quả cuối cùng luôn là chuỗi |
| Văn bản thuần (không có `$`, không phải một đường dẫn dot duy nhất) | Được trả về nguyên trạng |

**Ví dụ**

| Đầu vào | Kết quả |
|---|---|
| `$input.items` | `[1, 2, 3]` |
| `input.items` (giống như `$input.items` khi toàn bộ giá trị là đường dẫn này) | `[1, 2, 3]` |
| `Hello $input.name` | `Hello John` |
| `$input.count + 1` | `6` |
| `just text` | `just text` |

Ngữ cảnh đánh giá được xây dựng theo thứ tự sau:

- **Dữ liệu đã ghim (Pinned data)** trên các node thượng nguồn
- **Kết quả lần chạy cuối** từ canvas
- `null` khi không có dữ liệu thượng nguồn

Nếu node hiện tại có các phụ thuộc thượng nguồn nhưng không có node nào có dữ liệu đã ghim hoặc kết quả chạy gần đây, hộp thoại sẽ thực hiện một lần chạy thử để xây dựng ngữ cảnh rồi sau đó đánh giá văn bản hiện tại.

### Bộ chọn Đường dẫn Output

Khi kết quả từ backend là một object hoặc array, khu vực Output có thể hiển thị bộ chọn đường dẫn tương tác thay vì JSON thô.

- Nhấp đúp vào một hàng để thêm đường dẫn đó vào tham chiếu `$node.path` hiện tại.
- Nhấp một lần vào các hàng có thể mở rộng để mở hoặc đóng các nhánh.
- Sử dụng ô truy vấn tích hợp để tìm kiếm key, value và chuỗi đường dẫn.

## Tự động hoàn thành

- Gõ `$` để mở gợi ý cho các node thượng nguồn, các hàm built-in và các phương thức.
- Nhấn `Tab` hoặc `Enter` để chèn gợi ý đã chọn.
- Sử dụng `↑` / `↓` để di chuyển qua danh sách gợi ý.

### Câu trả lời Ví dụ

Khi bạn tiếp tục một tham chiếu `$…` bằng dấu chấm, mỗi hàng gợi ý hiển thị câu trả lời mà gợi ý đó sẽ tạo ra, in đậm ở bên phải hàng.

- Gõ `$set.listItems.first().toString().u` sẽ liệt kê `upper`, `urlEncode`, `urlDecode` và `unescape`, mỗi cái kèm theo kết quả đã đánh giá — vì vậy bạn có thể chọn theo kết quả thay vì theo tên.
- Gõ `$node.text.toJson()` sẽ phân tích một chuỗi JSON thành object hoặc array. Sau `.toJson()`, tính năng tự động hoàn thành có thể cung cấp các key đã phân tích (ví dụ `repoUrl`) khi có kết quả lần chạy cuối hoặc dữ liệu đã ghim.
- Kết quả được đánh giá trên backend dựa trên cùng dữ liệu đã ghim và kết quả lần chạy cuối mà phần xem trước của hộp thoại sử dụng, vì vậy chúng khớp với những gì trường sẽ tạo ra.
- Chỉ những gợi ý có thể đứng độc lập mới được đánh giá: các phương thức không có đối số (`upper()`, `first()`, `keys()`, `toJson()`) và các thuộc tính thuần (`length`, `year`). Những gợi ý cần đối số trước — `map`, `filter`, `sort`, `replace` — sẽ được để trống.
- Một hàng sẽ giữ trống khi ứng viên không tạo ra câu trả lời: lỗi, `null`, hoặc một phương thức không áp dụng cho giá trị đó.
- Câu trả lời được rút ngắn thành một dòng. Di chuột qua câu trả lời đã rút ngắn để xem thêm.

## Build with AI

Nút **Build with AI** xuất hiện ở góc trên bên phải của hộp thoại đánh giá khi một workflow được tải. Nó mở ra một modal lồng nhau, nơi bạn có thể mô tả biểu thức bạn muốn bằng văn bản thuần và để LLM tạo nó cho bạn.

### Cách hoạt động

1. Nhấp vào **Build with AI** trong thanh công cụ của hộp thoại đánh giá.
2. Chọn một credential LLM và model từ các dropdown.
3. Gõ mô tả bằng văn bản thuần về những gì bạn muốn — ví dụ: *"Lấy tên khách hàng từ phản hồi API"*.
4. Nhấp **Generate**. Modal gọi backend, sử dụng system prompt của [Expression DSL](./expression-dsl.md) cùng với kết quả lần chạy workflow gần nhất của bạn làm ngữ cảnh, và trả về một chuỗi biểu thức duy nhất.
5. Biểu thức được tạo sẽ ngay lập tức được đánh giá dựa trên cùng dữ liệu canvas để bạn có thể thấy kết quả trước khi áp dụng.
6. Nhấp **Apply** để thay thế nội dung trình soạn thảo bằng biểu thức đã tạo, hoặc **Regenerate** để thử lại.

### Ngữ cảnh được sử dụng

Trình tạo nhận các output của node từ lần chạy thử cuối cùng trên canvas. Nếu workflow chưa được chạy, LLM sẽ tạo một biểu thức tốt nhất có thể dựa trên nhãn node và các quy ước của DSL.

### Yêu cầu

- Một credential LLM (OpenAI, Google, hoặc Custom) phải được cấu hình trong tab [Credentials](./credentials.md).
- Workflow phải được mở trong trình soạn thảo.

## Phím tắt

| Phím tắt | Hành động |
|---|---|
| Tạm dừng gõ (~300 ms) | Làm mới xem trước từ backend |
| `Ctrl` / `Cmd` + `Enter` | Áp dụng và đóng hộp thoại |
| `Escape` | Đóng tự động hoàn thành trước, nếu không thì đóng hộp thoại |
## `$` lồng nhau trong đối số phương thức

Đối với đánh giá dialog / backend, bạn có thể truyền một tham chiếu khác với `$` lồng nhau bên trong các lệnh gọi như `.get($other.field)` khi bạn cần một key động. Bạn cũng có thể sử dụng một đường dẫn trần bên trong `.get(...)` (ví dụ `other.field`); backend phân giải nó theo cùng một cách. Các trường workflow đã lưu vẫn phải tuân theo các quy tắc của [Expression DSL](./expression-dsl.md); API đánh giá cũng chấp nhận một đường dẫn dot trần trên toàn dòng để thuận tiện (xem bảng ở trên).

## Điều hướng

Trình chỉnh sửa ánh xạ Set và Execute có thể hiển thị các nút **Prev** / **Next** để bạn có thể di chuyển giữa các trường mà không cần đóng hộp thoại.

## Liên quan

- [Expression DSL](./expression-dsl.md)
- [Node Types](./node-types.md)
- [Credentials](./credentials.md) — bắt buộc cho tính năng Build with AI
- [LLM Node](../nodes/llm-node.md)
- [Output Node](../nodes/output-node.md)
- [Condition Node](../nodes/condition-node.md)
