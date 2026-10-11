# Mã

Node **Code** chạy mã Python do bạn viết, với tệp `requirements.txt` riêng, và trả về JSON. Mỗi lần thực thi đều nhận một container hoàn toàn mới và container này sẽ bị hủy khi quá trình chạy kết thúc, vì vậy một lần thực thi không bao giờ có thể nhìn thấy hay ảnh hưởng đến lần thực thi khác.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1 |
| Đầu ra | `$nodeLabel.result` (giá trị mà `main` trả về), cùng với `$nodeLabel.logs` và `$nodeLabel.install` |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `label` | string | Định danh node (camelCase) |
| `codeSource` | string | Mã nguồn Python. Phải định nghĩa `main(params)` và trả về một giá trị có thể tuần tự hóa JSON |
| `codeParameters` | expression | Một đối tượng JSON kết nối dữ liệu workflow vào mã. Các biểu thức được giải quyết trước khi mã chạy |
| `codeRequirements` | string | Nội dung `requirements.txt`, mỗi dòng một gói. Để trống sẽ bỏ qua bước cài đặt |
| `codeAllowNetwork` | boolean | Mã có được phép truy cập mạng hay không (mặc định `false`) |

## Hàm `main`

Mã của bạn phải định nghĩa một hàm `main` ở cấp cao nhất nhận một đối số:

```python
def main(params):
    name = params.name
    return {"message": f"Hello, {name}!", "length": len(name)}
```

Các câu lệnh ở cấp module vẫn được chạy, nhưng chỉ những gì `main` trả về mới trở thành đầu ra của node.

Trình soạn thảo hiển thị số dòng, và nút mở rộng bên cạnh **Format** sẽ mở ra một cửa sổ lớn hơn, đóng bằng phím `Esc` — các chỉnh sửa được áp dụng ngay khi bạn gõ, nên không có gì cần lưu. Nút **Format** định dạng lại mã của bạn bằng Ruff, giữ nguyên các chú thích. Nó cũng sửa chữa những hư hỏng về thụt lề mà việc dán thường gây ra: một khối thụt lề đồng nhất, tab lẫn với dấu cách, và một dòng lệch khỏi khối của nó một hoặc hai dấu cách đều được sửa chữa thay vì bị từ chối. Một lỗi cú pháp thực sự sẽ được báo cáo kèm theo số dòng và cột của nó. Việc định dạng chạy trong cùng container biệt lập mà node chạy — không có mạng, không có môi trường backend — vì vậy nó cần Docker giống như việc thực thi.

## Đọc tham số

`params` hỗ trợ ký pháp dấu chấm, bao gồm cả xuyên qua các đối tượng và danh sách lồng nhau:

```python
def main(params):
    city = params.user.address.city
    first_order = params.orders[0].id
    return {"city": city, "first_order": first_order}
```

- `params["my key"]` đọc các khóa không phải là định danh Python hợp lệ
- `params.get("maybe")` trả về `None` thay vì báo lỗi khi một khóa không tồn tại
- `params.to_dict()` trả về dictionary thuần
- Đọc một khóa chưa từng được cung cấp sẽ báo lỗi nêu tên khóa và liệt kê những gì có sẵn

## Đầu ra

```json
{
  "result": { "message": "Hello, Heym!", "length": 4 },
  "logs": "",
  "install": { "ok": true, "tool": "none", "log": "" }
}
```

- `result` — giá trị trả về của `main`. Các node hạ nguồn đọc `$nodeLabel.result.message`
- `logs` — mọi thứ mà mã đã gửi tới `print`, được thu thập riêng để không bao giờ làm hỏng kết quả
- `install` — công cụ nào đã cài đặt các phụ thuộc (`uv`, `pip`, hoặc `none`) và đầu ra của nó

## Phụ thuộc

Liệt kê các gói trong `requirements.txt` đúng như bạn làm ở máy cục bộ:

```
requests==2.32.3
feedparser
```

Các gói được cài đặt bằng `uv` vào một thư mục tạm trước khi mã chạy; nếu `uv` không thể xử lý một gói, Heym sẽ thử lại với `pip`. Không có gì được lưu vào bộ nhớ đệm giữa các lần chạy, vì vậy các phụ thuộc nặng sẽ thêm vài giây vào mỗi lần thực thi. Để trống `requirements.txt` sẽ bỏ qua hoàn toàn bước cài đặt và nhanh hơn đáng kể.

Các gói không có wheel và cần trình biên dịch C sẽ cài đặt thất bại. Lý do xuất hiện trong `install.log`.

## Mạng

| Giai đoạn | Mạng |
|-------|---------|
| Cài đặt phụ thuộc | Luôn bật — pip và uv phải truy cập được PyPI |
| Chạy mã của bạn | Mặc định tắt. `codeAllowNetwork` sẽ bật nó lên |

Khi `codeAllowNetwork` tắt, một cuộc gọi ra ngoài như `requests.get(...)` sẽ thất bại với lỗi kết nối. Đó là mặc định có chủ đích: hầu hết các node Code biến đổi dữ liệu mà một node khác đã tải về. Nên ưu tiên tải dữ liệu bằng node **HTTP** và truyền phần thân vào qua `codeParameters`.

## Sandbox và giới hạn

Mã của bạn chạy dưới một người dùng không phải root trong một container với tất cả các khả năng của Linux bị loại bỏ, `no-new-privileges` được thiết lập, và hệ thống tệp gốc chỉ đọc. Nó không nhận được Docker socket cũng như không nhận được bất kỳ bí mật hay môi trường nào của backend.

| Giới hạn | Giá trị |
|-------|-------|
| Bộ nhớ | 512 MB |
| CPU | 1 |
| Tiến trình | 256 |
| Thời gian chờ cài đặt phụ thuộc | 120 giây |
| Thời gian chờ thực thi | 60 giây |

Đây là những thuộc tính cố định của sandbox, không phải cấu hình.

> **Cần có Docker.** Khác với các công cụ và kỹ năng Agent Python, node Code không có chế độ dự phòng cục bộ và không có biến môi trường nào để nới lỏng nó. Nếu không có Docker daemon có thể truy cập được, node sẽ thất bại với một lỗi rõ ràng thay vì chạy mã của bạn trong tiến trình backend. Khi phát triển bằng `./run.sh` gốc, hãy khởi động Docker trước khi sử dụng node này. Xem [Security → Code node sandbox](../reference/security.md#code-node-sandbox).

## Dùng node khác khi phù hợp

| Bạn muốn | Dùng |
|-------------|-----|
| Phân tích cú pháp hoặc tạo CSV, TSV, XML, hoặc OCR một tệp | [Converter](converter-node.md) |
| Gọi một HTTP API | [HTTP](http-node.md) |
| Ánh xạ hoặc đổi tên các trường | [Set](set-node.md) |
| Chạy một workflow khác | [Execute](execute-node.md) |

Hãy dùng **Code** khi logic thực sự không phù hợp với những node trên — tính toán tùy chỉnh, phân tích cú pháp đặc thù, hoặc một thuật toán.
## Ví dụ

Các dòng điểm số được tạo bởi một node thượng nguồn:

```python
def main(params):
    rows = params.rows
    total = sum(r.amount * r.weight for r in rows)
    return {"total": round(total, 2), "count": len(rows)}
```

Với `codeParameters` được đặt thành `{ "rows": "$fetchRows.result" }`, các node hạ nguồn đọc `$scoreRows.result.total`.
