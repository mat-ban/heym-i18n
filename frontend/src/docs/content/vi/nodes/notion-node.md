# Notion

**Node Notion** quản lý cơ sở dữ liệu, nguồn dữ liệu, trang và block thông qua Notion API.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1 |
| Credential | Internal integration token hoặc Notion OAuth |
| Phiên bản API | `2026-03-11` |

Các bộ sưu tập kiểu cơ sở dữ liệu của Notion sử dụng **data source ID** trong các phiên bản API hiện tại. Hãy chia sẻ mọi trang
hoặc nguồn dữ liệu mà workflow cần với integration trước khi chạy node.
Các trường tài nguyên chấp nhận ID Notion thô hoặc URL Notion đầy đủ. URL được chuẩn hóa về
ID tài nguyên nhúng trước khi gửi yêu cầu API.

## Các thao tác

| Thao tác | Trường bắt buộc | Đầu ra chính |
|-----------|-----------------|-------------|
| Search | query/filter/sort tùy chọn | `.results`, `.count`, `.next_cursor` |
| Get Page | Page ID | `.page` |
| Create Page | Data Source ID hoặc Parent Page ID, Properties | `.page`, `.id`, `.url` |
| Update Page | Page ID, một trong Properties/Icon/Cover | `.page` |
| Move Page to Trash | Page ID | `.page` |
| Restore Page | Page ID | `.page` |
| Create Database | Database request với `parent` | `.database`, `.id`, `.url` |
| Retrieve Database | Database ID | `.database` |
| Update Database | Database ID, database request không rỗng | `.database`, `.id`, `.url` |
| Create Data Source | Data source request với `parent` và `properties` không rỗng | `.data_source`, `.id`, `.url` |
| Retrieve Data Source | Data Source | `.data_source` |
| Update Data Source | Data Source ID, data source request không rỗng | `.data_source`, `.id`, `.url` |
| Query Data Source | Data Source ID | `.results`, `.count`, `.next_cursor` |
| Get Block Children | Block hoặc Page ID | `.results`, `.count`, `.next_cursor` |
| Update Block | Block ID, block update object | `.block` |
| Delete Block | Block ID | `.block` |
| Append Blocks | Block hoặc Page ID, Children | `.results`, `.count` |

Tất cả các thao tác cũng trả về `.success` và `.operation`.

## Các trường JSON

Các trường Database Request, Data Source Request, Properties, Children, Filter, Sort, Sorts, Icon và Cover chấp nhận
JSON của Notion API. Các biểu thức bên trong chuỗi JSON được giải quyết trước khi gửi yêu cầu. Một trường cũng có thể
là một biểu thức độc lập giải quyết trực tiếp thành object hoặc array cần thiết, chẳng hạn như
`$input.database`, `$input.properties`, hoặc `$input.children`.

```json
{
  "Name": {
    "title": [
      {
        "text": {
          "content": "$input.title"
        }
      }
    ]
  }
}
```

Đối với nội dung trang hoặc block, Children là một array gồm các object block của Notion:

```json
[
  {
    "object": "block",
    "type": "paragraph",
    "paragraph": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "$input.description"
          }
        }
      ]
    }
  }
]
```

## Cơ sở dữ liệu và nguồn dữ liệu

Trong Notion API hiện tại, một **database** là một container và một **data source** chứa schema thuộc tính
và các hàng có thể truy vấn. Retrieve Database trả về danh sách `data_sources` của cơ sở dữ liệu; hãy sử dụng một trong
các ID đó với Retrieve Data Source hoặc Query Data Source.

Create Database chấp nhận object request đầy đủ từ endpoint Create a database của Notion. Nó
phải chứa `parent` và có thể chứa `title`, `description`, `is_inline`,
`initial_data_source`, `icon` và `cover`. Ví dụ:

```json
{
  "parent": {
    "type": "page_id",
    "page_id": "$input.parentPageId"
  },
  "title": [
    {
      "type": "text",
      "text": {
        "content": "Tasks"
      }
    }
  ],
  "initial_data_source": {
    "properties": {
      "Name": {
        "title": {}
      }
    }
  }
}
```

Update Database chấp nhận object request của endpoint update, bao gồm `parent`, `title`,
`description`, `is_inline`, `icon`, `cover`, `in_trash` và `is_locked`. Các trường Database ID chấp nhận
ID thô, URL Notion đầy đủ hoặc biểu thức.

Sử dụng **Retrieve Data Source** để lấy schema `properties` của nguồn dữ liệu trước khi xây dựng
object properties cho Create Page. **Create Data Source** yêu cầu một object database cha và một
schema `properties` không rỗng. **Update Data Source** chấp nhận một object request không rỗng được hỗ trợ
bởi endpoint Notion tương ứng.

Ví dụ, tạo một nguồn dữ liệu bên trong một cơ sở dữ liệu hiện có:

```json
{
  "parent": {
    "type": "database_id",
    "database_id": "$input.databaseId"
  },
  "properties": {
    "Name": {
      "title": {}
    },
    "Status": {
      "status": {}
    }
  }
}
```

Các bộ chọn Data Source và Parent Page hỗ trợ tìm kiếm phía server với độ trễ ngắn và phân trang
**Load more** dựa trên cursor. Sử dụng **Refresh** sau khi chia sẻ một tài nguyên mới trong Notion.
Chuyển sang **Use expression** để nhập biểu thức, ID thô hoặc URL.

Các bộ lọc Search từ những hướng dẫn cũ sử dụng
`{"property":"object","value":"database"}` được chuyển đổi thành giá trị `data_source` hiện tại.
Các workflow mới nên sử dụng trực tiếp `data_source` hoặc `page`.

Append Blocks hỗ trợ các vị trí **Start**, **End** và **After Block**. Create Page và Append
Blocks tự động chia hơn 100 children cấp cao nhất thành các yêu cầu có thứ tự để đáp ứng
giới hạn mỗi yêu cầu của Notion.

Các yêu cầu bị giới hạn tốc độ (`429` hoặc `529`) sẽ thử lại tối đa ba lần. Heym tuân thủ
header `Retry-After` của Notion, giới hạn mỗi lần chờ ở 10 giây và thêm độ trễ ngẫu nhiên. Các yêu cầu Notion
chia sẻ một HTTP connection pool toàn tiến trình trên các trang và node workflow.
## Giới hạn của Notion API

- Một giá trị `text.content` dạng rich-text đơn lẻ chỉ có thể chứa tối đa 2.000 ký tự. Hãy chia văn bản dài hơn thành nhiều đối tượng rich-text.
- Notion giới hạn block con ở cấp cao nhất là 100 block mỗi request. Heym sẽ gộp các mảng Children lớn hơn thành từng batch, nhưng mỗi block riêng lẻ vẫn phải thỏa mãn giới hạn payload của Notion.
- API chấp nhận tối đa hai cấp block con lồng nhau trong một request. Hãy tạo các cấu trúc sâu hơn bằng các thao tác Append Blocks tiếp theo.
- Payload của request bị giới hạn ở 1.000 phần tử block và tổng dung lượng 500 KB.

## Phân trang

Search, Query Data Source và Get Block Children chấp nhận kích thước trang từ 1 đến 100 và một start cursor tùy chọn. Đặt kích thước trang thành `0` để tự động đi theo cursor và gộp tất cả kết quả, tối đa đến giới hạn an toàn 10.000 kết quả của node.

## Thiết lập credential

Chọn một trong hai cách thiết lập trong hộp thoại credential (**Internal token** hoặc **OAuth**):

- **Internal token:** Tạo một internal integration, sao chép token của nó vào Heym, sau đó chia sẻ từng page hoặc data source cần thiết với integration. Dùng **Test Connection** để xác minh quyền truy cập.
- **OAuth:** Tạo một public Notion integration và đăng ký
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback` trong Notion. Trong hộp thoại credential của Heym, chọn **OAuth**, nhập Client ID và Client Secret của integration, sau đó nhấp **Connect** để ủy quyền cho một workspace. Secret được lưu trữ mã hóa cùng với credential và không được đặt trong OAuth state hay cấu hình môi trường. Sau khi ủy quyền, credential hiển thị tên workspace đã kết nối (`connected (Workspace Name)`). Các credential OAuth đang chờ xử lý hiển thị `Not connected`.

Để trống trường internal token trong khi chỉnh sửa sẽ giữ nguyên token đã lưu.

Đối với các request [HTTP](../nodes/http-node.md) tùy chỉnh, `$credentials.YourNotionCredential` sẽ phân giải thành cùng bearer token mà node Notion sử dụng (internal token hoặc OAuth access token).

## Ghi chú về phiên bản API

Heym ghim các request Notion vào phiên bản API `2026-03-11`. Phiên bản này sử dụng:

- Parent `data_source_id` và các endpoint `/data_sources` thay cho các đường dẫn truy vấn database cũ
- `in_trash` thay cho `archived` cho các thao tác đưa page vào thùng rác/khôi phục
- Các đối tượng `position` (`start`, `end`, `after_block`) cho Append Block Children

Khi di chuyển các ví dụ tự động hóa Notion cũ hơn:

- Thay thế các tham chiếu parent/truy vấn database bằng data source ID từ **Retrieve Database** hoặc trình chọn data-source trong editor
- Thay `archived: true` bằng `in_trash: true`
- Thay các tham số `after` của append bằng trường **Append Position** của node

Các bộ lọc Search vẫn dùng giá trị object `database` sẽ được tự động chuẩn hóa thành `data_source`.

## Liên quan

- [Credentials](../reference/credentials.md)
- [Third-Party Integrations](../reference/integrations.md)
- [Node Types](../reference/node-types.md)
