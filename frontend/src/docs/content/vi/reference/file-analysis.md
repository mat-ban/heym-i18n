# Phân tích tệp

Phân tích tệp cho phép Chat, [node Agent](../nodes/agent-node.md) và [node Code](../nodes/code-node.md) mở và phân tích các tệp lớn từ [Drive](./drive.md) trong sandbox Python cô lập. Các tệp PDF, bảng tính, CSV, DOCX và JSON trước tiên được kiểm tra và sau đó được đọc có chọn lọc, do đó, hợp đồng dài 200 trang hoặc bảng tính có một triệu hàng không bao giờ cần phải vừa vặn hoàn toàn với ngữ cảnh của mô hình.

## Cách thức hoạt động

Mỗi lệnh gọi chạy trong một container mới không có quyền truy cập mạng. Các tệp cần thiết được sao chép ở chế độ chỉ đọc, mã được thực thi và container bị xóa. Một thư mục làm việc nhỏ tồn tại giữa các lệnh gọi của cùng một phiên, cho phép bước sau tiếp tục từ kết quả mà bước trước đã lưu.

| Đường dẫn | Nội dung |
|------|--------|
| `/input` | Các tệp Drive của phiên này, chỉ đọc |
| `/work` | Không gian làm việc tồn tại trong suốt phiên, ví dụ `/work/sales.pkl` |
| `/work/out` | Các tệp được ghi tại đây sẽ được lưu vào Drive sau lệnh gọi và được trả về dưới dạng liên kết |

Sandbox được cài đặt sẵn pandas, openpyxl, xlrd, pdfplumber, pypdf, python-docx và langdetect, cùng với Tesseract OCR mà [node Chuyển đổi](../nodes/converter-node.md) sử dụng.

## Công cụ

Mô hình hoạt động với ba công cụ, cộng thêm công cụ thứ tư trong Chat:

| Công cụ | Chức năng |
|------|----------|
| `list_files` | Liệt kê các tệp Drive bạn có thể mở: tên, loại, kích thước, ngày |
| `inspect_file` | Trả về loại tệp, siêu dữ liệu và cấu trúc kèm theo mẫu ngắn |
| `run_python` | Chạy Python trên các tệp được chỉ định và trả về kết quả in ra |
| `clear_workspace` | Chỉ Chat: xóa thư mục làm việc của cuộc trò chuyện |

`inspect_file` chỉ đọc những gì cần thiết cho một bản tóm tắt:

| Loại | Tóm tắt |
|-----|-----------------|
| PDF | Số trang, tiêu đề và tác giả, khả năng trích xuất văn bản, ngôn ngữ, kích thước trang, văn bản và bảng ở trang đầu tiên. Các tệp PDF được quét được đọc bằng OCR (tối đa 5 trang) |
| XLSX / XLS | Các trang tính có số hàng và số cột, hàng tiêu đề, kiểu dữ liệu, pandas `read_hint`, phạm vi được đặt tên, các hàng đầu tiên |
| CSV / TSV | Mã hóa, dấu phân cách, số hàng, các cột có kiểu dữ liệu, các hàng đầu tiên |
| DOCX | Cấu trúc tiêu đề, bảng biểu, số từ và ký tự, tác giả và ngày tháng |
| JSON | Loại gốc, các khóa, độ dài mảng, độ sâu lồng nhau, bản ghi mẫu |

Bên trong `run_python`, hãy mở một tệp bằng mô-đun `heym_files`:

```python
import heym_files
import pandas as pd

df = pd.read_excel(heym_files.path("q3.xlsx"), sheet_name="Summary", usecols=["Region", "Amount"])
print(df.groupby("Region").Amount.sum())
df.to_csv(f"{heym_files.out_dir()}/by-region.csv", index=False)
```

## Trong Chat

Đính kèm tệp PDF, bảng tính, DOCX, CSV hoặc JSON, hình ảnh (PNG, JPG, GIF, WebP) hoặc tệp văn bản thuần túy trong [tab Chat](../tabs/chat-tab.md), trong Chat của Heym Work hoặc thông qua công cụ MCP `heym_chat`. Một tin nhắn có thể chứa tối đa 10 tệp. Mỗi tệp được lưu trữ trong Drive của bạn; chỉ tên và ID của tệp được đưa vào tin nhắn. Chat kiểm tra tệp, đọc phần cần thiết cho câu hỏi của bạn và trả lời bằng bảng hoặc trích đoạn.

## Trong Workflow

Một lần chạy chỉ mở các tệp của riêng nó: những tệp được tải lên thông qua [Trigger tải lên tệp](../nodes/file-upload-trigger-node.md), những tệp mà các node của nó đã ghi vào Drive và những tệp mà một [node Drive](../nodes/drive-node.md) đã truy xuất bằng bước **Get** trong cùng một lần chạy.

- **Node Agent**: khi đầu vào hoặc tin nhắn của agent chứa một tệp, agent sẽ tự động nhận các công cụ trên cho các tệp đó.
- **Node Code**: đặt **Files** thành một biểu thức như `$Upload.file.id`. Các tệp được gắn và liệt kê trong `params.files`.

## Giới hạn

| Giới hạn | Giá trị |
|-----------|------|
| Bộ nhớ mỗi lệnh gọi | 2 GB |
| Thời gian mỗi lệnh gọi | 120 giây |
| Thư mục làm việc mỗi phiên | 2 GB |
| Tệp đầu ra mỗi lệnh gọi | 20, tối đa 100 MB mỗi tệp |
| Đầu ra văn bản trả về cho mô hình | 20.000 ký tự |
| Tệp mỗi lệnh gọi | 20 |

## Bảo mật

- Sandbox không có mạng, không có quyền truy cập vào cài đặt hoặc bí mật của Heym và chạy dưới dạng người dùng không có đặc quyền.
- Các tệp chỉ được xử lý độc quyền bên trong sandbox.
- Trong Chat, quyền truy cập tuân theo Drive: bạn mở các tệp bạn sở hữu và các tệp được chia sẻ với nhóm của bạn.
- Việc mở tệp trong Chat được ghi lại trong nhật ký kiểm toán.
- Nội dung tệp được xử lý nghiêm ngặt như dữ liệu; các lệnh bên trong tệp không được thực thi.

## Yêu cầu

Phân tích tệp yêu cầu chương trình phụ trợ sandbox trên phiên bản Heym (Docker hoặc [Kubernetes](../getting-started/running-and-deployment.md#kubernetes)).

## Liên quan

- [Drive](./drive.md)
- [Node Code](../nodes/code-node.md)
- [Node Agent](../nodes/agent-node.md)
- [Tab Chat](../tabs/chat-tab.md)
