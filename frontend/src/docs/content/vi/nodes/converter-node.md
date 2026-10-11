# Bộ chuyển đổi

Node **Converter** chuyển đổi dữ liệu và tệp giữa các định dạng mà không cần viết mã. Node này trung lập về công nghệ nên có thể bổ sung thêm nhiều định dạng theo thời gian. Node chuyển đổi dữ liệu CSV, JSON và XML theo cả hai chiều, chạy Tesseract OCR để trích xuất văn bản từ hình ảnh và PDF, đồng thời ghi lại một tệp đã lưu sang định dạng khác.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1 |
| Đầu ra | `$nodeLabel.result` (dữ liệu đã phân tích cho `csvToJson` / `xmlToJson`, văn bản cho `jsonToCsv` / `jsonToXml`, văn bản được trích xuất cho `imageToText` / `pdfToText`, metadata tệp mới cho `fileConvert`) |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `label` | string | Định danh node (camelCase) |
| `conversion` | string | `csvToJson` (văn bản CSV → mảng các đối tượng hàng), `jsonToCsv` (mảng đối tượng/hàng → văn bản CSV), `xmlToJson` (văn bản XML → đối tượng), `jsonToXml` (đối tượng → văn bản XML), `imageToText` (OCR một hình ảnh), `pdfToText` (OCR mọi trang PDF được chọn), hoặc `fileConvert` (ghi lại một tệp đã lưu sang định dạng khác) |
| `source` | expression | Dữ liệu cần chuyển đổi. Để trống để dùng đầu vào đầu tiên của node |
| `delimiter` | string | Ký tự phân tách trường đơn (mặc định `,`) |
| `hasHeader` | boolean | Chỉ `csvToJson` — coi hàng đầu tiên là header (mặc định `true`) |
| `trimValues` | boolean | Chỉ `csvToJson` — loại bỏ khoảng trắng xung quanh tên header và giá trị ô (mặc định `true`) |
| `includeHeader` | boolean | Chỉ `jsonToCsv` — ghi một hàng header (mặc định `true`) |
| `converterColumns` | string | Chỉ `jsonToCsv` — thứ tự cột tùy chọn, phân tách bằng dấu phẩy |
| `converterFileId` | expression | Chuyển đổi tệp — tệp Heym Drive cần đọc, ví dụ `$Upload.file.id` |
| `converterTargetFormat` | string | Chỉ `fileConvert` — định dạng đầu ra (`pdf`, `docx`, `html`, `md`, `txt`, `csv`, `epub`, `jpg`, `png`, `bmp`, `webp`) |
| `ocrLanguage` | string | Chỉ OCR — `auto` (mặc định), mã Tesseract như `tur`, hoặc `custom` |
| `ocrLanguageCustom` | string | Chỉ OCR — mã ngôn ngữ dùng khi `ocrLanguage` là `custom`, ví dụ `eng+tur` |
| `ocrEncoding` | string | Chỉ OCR — bảng mã mà văn bản được chuẩn hóa về (mặc định `utf-8`) |
| `ocrNormalizeUnicode` | boolean | Chỉ OCR — áp dụng chuẩn hóa NFC (mặc định `true`) |
| `ocrPsm` | string | Chỉ OCR — chế độ phân đoạn trang của Tesseract (mặc định `3`) |
| `ocrDpi` | number | Chỉ `pdfToText` — DPI raster hóa trang (mặc định `300`) |
| `ocrPageRange` | expression | Chỉ `pdfToText` — `3` hoặc `2-5`. Để trống nghĩa là mọi trang |

## Hành vi

- **`csvToJson`** phân tích văn bản CSV nguồn. Với `hasHeader: true`, mỗi hàng trở thành một đối tượng có khóa là các giá trị header; với `hasHeader: false`, mỗi hàng trở thành một mảng các giá trị ô. Các trường được trích dẫn, dấu phân tách nhúng và ký tự xuống dòng nhúng được xử lý theo RFC 4180. BOM UTF-8 ở đầu (thường gặp trong tệp xuất từ Excel) được loại bỏ, và các tên header trùng lặp được làm cho duy nhất mà không ghi đè lên một cột thực (`a, a, a_2` → `a`, `a_3`, `a_2`). Đặt `delimiter` thành `\t` để phân tích giá trị phân tách bằng tab.
- **`trimValues`** (mặc định `true`) loại bỏ khoảng trắng xung quanh tên header và giá trị ô, **kể cả bên trong các trường được trích dẫn** (`" padded "` → `padded`). RFC 4180 coi khoảng trắng trong dấu trích dẫn là dữ liệu, nên hãy đặt `trimValues: false` để giữ nguyên chính xác.
- **`jsonToCsv`** tạo văn bản CSV từ một mảng đối tượng (hoặc mảng). Thứ tự cột được lấy từ `converterColumns` khi được cung cấp, nếu không thì suy ra từ các khóa của đối tượng đầu tiên. Các giá trị chứa dấu phân tách, dấu trích dẫn hoặc ký tự xuống dòng được tự động đặt trong dấu trích dẫn.
- **`xmlToJson`** phân tích XML thành một đối tượng. Thuộc tính dùng tiền tố `@` và văn bản xen lẫn với thuộc tính dùng `#text`; các phần tử anh em lặp lại trở thành mảng. Việc mở rộng thực thể XML bị vô hiệu hóa.
- **`jsonToXml`** tuần tự hóa một đối tượng thành tài liệu XML. Đối tượng phải có đúng một khóa cấp cao nhất, khóa này trở thành phần tử gốc XML. Dùng cùng quy ước `@attribute` và `#text` như `xmlToJson` để tạo thuộc tính và văn bản song song với các phần tử con.
- **`imageToText`** chạy Tesseract trên một hình ảnh (PNG, JPEG, TIFF, WebP, BMP).
- **`pdfToText`** raster hóa từng trang được chọn ở `ocrDpi` và nhận dạng trang đó. Mọi trang đều đi qua OCR, nên một PDF kỹ thuật số có lớp văn bản hoàn hảo vẫn bị đọc lại từ điểm ảnh. Điều này giữ cho tài liệu quét và tài liệu kỹ thuật số hoạt động giống nhau, đổi lại là tốc độ, nên hãy thu hẹp `ocrPageRange` với các tệp dài.
- **`fileConvert`** ghi lại tệp nguồn sang định dạng khác và lưu kết quả thành một tệp Drive **mới**. Tệp gốc không bao giờ bị sửa đổi. Tài liệu đi qua pandoc, hình ảnh qua Pillow, và JSON sang CSV qua trình ghi csv của Python. Một hình ảnh không thể trở thành tài liệu và một tài liệu không thể trở thành hình ảnh; để đọc văn bản từ hình ảnh, hãy dùng `imageToText`.

## Đưa tệp vào

Các chuyển đổi tệp đọc từ Heym Drive, không phải từ đường dẫn hay URL, nên tệp phải được lưu trữ trước. Ba chuỗi phổ biến:

- **[Trigger tải tệp lên](./file-upload-trigger-node.md) → Converter** — trỏ `converterFileId` vào `$Upload.file.id`.
- **[Drive](./drive-node.md) (`downloadUrl`) → Converter** — tải một tệp từ xa vào Drive, rồi truyền `$Download.id`.
- **[Agent](./agent-node.md) → Converter** — một skill ghi tệp sẽ hiển thị tệp đó dưới dạng `$reportAgent._generated_files[0].id`.

`converterFileId` cũng chấp nhận toàn bộ đối tượng tệp (`$Upload.file`) hoặc một URL tải xuống của Heym; id tệp được trích ra từ cả hai. Tệp phải là tệp bạn sở hữu hoặc tệp mà đồng nghiệp đã chia sẻ với bạn.
## Ngôn ngữ

`auto` (mặc định) chạy tính năng phát hiện hướng và hệ chữ của Tesseract trước, sau đó chọn model tốt nhất đã cài đặt cho hệ chữ được phát hiện. Các model hệ chữ như `Latin` hoặc `Cyrillic` đọc được mọi ngôn ngữ viết bằng hệ chữ đó, đó là lý do vì sao chế độ auto xử lý được cả một hóa đơn tiếng Thổ Nhĩ Kỳ lẫn một hóa đơn tiếng Anh mà không cần chỉ định cái nào là cái nào.

Việc chỉ định rõ ngôn ngữ vẫn chính xác hơn khi bạn biết chắc. Dùng một mã đơn (`tur`), hoặc nối nhiều mã bằng `+` (`eng+tur`) cho tài liệu hỗn hợp — càng nhiều ngôn ngữ thì nhận dạng càng chậm và hơi nhiễu hơn, nên hãy giữ danh sách ngắn gọn. Mã chỉ hoạt động khi dữ liệu ngôn ngữ tương ứng được cài đặt trên backend; node sẽ liệt kê những gì có sẵn khi bạn chọn một mã bị thiếu.

Mọi image của Heym đều đi kèm `osd`, tiếng Anh, Thổ Nhĩ Kỳ, Đức, Pháp, Tây Ban Nha, Ý, Bồ Đào Nha, Hà Lan, Nga, Ả Rập, Trung giản thể, Nhật, Hàn, cùng các model hệ chữ Latin, Cyrillic, Arabic, HanS, Japanese và Hangul.

## Encoding

Văn bản được nhận dạng ở dạng UTF-8 và giữ nguyên mọi ký tự mà Tesseract tạo ra. `ocrNormalizeUnicode` (bật theo mặc định) áp dụng chuẩn hóa NFC, nên một chữ cái được viết dưới dạng `s` cộng với dấu cedilla tổ hợp sẽ trở thành một `ş` duy nhất — nên để bật, vì hai dạng này không bằng nhau trong các phép so sánh hay truy vấn cơ sở dữ liệu.

`ocrEncoding` chỉ quan trọng khi có thứ gì đó ở hạ nguồn không lưu được toàn bộ dải Unicode. Chọn `cp1254` hoặc `iso-8859-9` sẽ giữ nguyên văn bản tiếng Thổ Nhĩ Kỳ đồng thời đảm bảo kết quả vừa với charset đó; `latin-1` và `ascii` hẹp hơn và thay thế những gì chúng không biểu diễn được bằng `?`. Hãy để ở `utf-8` trừ khi hệ thống đích buộc bạn phải đổi.

## Output

`csvToJson`, `jsonToCsv`, `xmlToJson` và `jsonToXml` trả về `$label.result` và `$label.conversion`. Các chuyển đổi OCR bổ sung thêm:

| Trường | Mô tả |
|-------|-------------|
| `$label.result` | Toàn bộ văn bản được trích xuất, các trang được nối bằng một dòng trống |
| `$label.language` | Model thực sự đã chạy (hữu ích để xem `auto` đã chọn gì) |
| `$label.encoding` | Charset mà văn bản được chuẩn hóa về |
| `$label.page_count` | Số trang được nhận dạng |
| `$label.pages` | Mảng `{ page, text }` để xử lý theo từng trang |
| `$label.file` | `{ id, filename, mime_type, size_bytes }` của tệp nguồn |

`fileConvert` trả về tệp mới thay vào đó:

| Trường | Mô tả |
|-------|-------------|
| `$label.id` | UUID của tệp mới được lưu |
| `$label.filename` | Tên tệp đã chuyển đổi, giữ nguyên tên gốc và đổi phần mở rộng |
| `$label.mime_type` | MIME type của tệp mới |
| `$label.size_bytes` | Kích thước của tệp mới |
| `$label.download_url` | URL tải xuống từ Drive cho tệp mới |
| `$label.source_file` | Metadata của tệp đã được chuyển đổi |

## Ví dụ

```json
{
  "type": "converter",
  "data": {
    "label": "toRows",
    "conversion": "csvToJson",
    "source": "$userInput.body.text",
    "delimiter": ",",
    "hasHeader": true
  }
}
```

Với đầu vào `name,age\nAda,36`, các node hạ nguồn truy cập các hàng đã phân tích qua `$toRows.result` (`[{ "name": "Ada", "age": "36" }]`).

Chuyển đổi XML sang JSON:

```json
{
  "type": "converter",
  "data": {
    "label": "xmlToObject",
    "conversion": "xmlToJson",
    "source": "$webhook.body"
  }
}
```

Với `<person id="1"><name>Ada</name></person>`, `$xmlToObject.result` là `{ "person": { "@id": "1", "name": "Ada" } }`. Để tạo XML, hãy truyền object đó vào một node Converter thứ hai với `conversion: "jsonToXml"`.

Đọc một hóa đơn được quét tải lên qua trigger tải tệp lên:

```json
{
  "type": "converter",
  "data": {
    "label": "readInvoice",
    "conversion": "pdfToText",
    "converterFileId": "$Upload.file.id",
    "ocrLanguage": "tur",
    "ocrEncoding": "utf-8",
    "ocrDpi": 300,
    "ocrPageRange": "1-3"
  }
}
```

Một node [Agent](./agent-node.md) hoặc [LLM](./llm-node.md) ở hạ nguồn sau đó có thể trích xuất các trường có cấu trúc từ `$readInvoice.result`.

Chuyển báo cáo markdown của agent thành PDF:

```json
{
  "type": "converter",
  "data": {
    "label": "convertDoc",
    "conversion": "fileConvert",
    "converterFileId": "$reportAgent._generated_files[0].id",
    "converterTargetFormat": "pdf"
  }
}
```

Các node hạ nguồn đọc `$convertDoc.download_url` để chia sẻ PDF, hoặc `$convertDoc.id` để tiếp tục làm việc với nó trong [Drive](./drive-node.md).

## Yêu cầu

OCR gọi ra ngoài tới `tesseract` và `pdftoppm` của poppler, còn việc chuyển đổi tài liệu dùng pandoc. Cả ba đều đi kèm với mọi cách chạy Heym, bao gồm `run.sh`, docker-compose và image phát hành đơn lẻ, nên không có gì cần cấu hình. Giới hạn số trang, thời gian chờ và DPI tối đa là các giá trị cố định của nền tảng chứ không phải cài đặt.

## Liên quan

- [Set](./set-node.md) – Biến đổi và ánh xạ từng trường riêng lẻ
- [JSON output mapper](./json-output-mapper-node.md) – Xây dựng một object phản hồi JSON
- [File upload trigger](./file-upload-trigger-node.md) – Nhận một tệp vào Heym Drive
- [Drive](./drive-node.md) – Lưu trữ, truy xuất và chia sẻ tệp
- [Node Types](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Expression DSL](../reference/expression-dsl.md) – Các hàm và cú pháp
