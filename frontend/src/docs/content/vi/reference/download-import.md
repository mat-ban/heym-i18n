# Tải xuống & Nhập

Xuất workflow hoặc toàn bộ thư mục dưới dạng tệp, hoặc nhập chúng qua kéo & thả. Sử dụng tính năng này để sao lưu, chia sẻ hoặc di chuyển workflow giữa các instance.

## Tải xuống Workflow (JSON)

**Vị trí:** Thanh công cụ Editor → nút **Download** (hiển thị trên màn hình lớn)

**Nội dung xuất:**
- `nodes` – Tất cả các node trên canvas
- `edges` – Tất cả các kết nối giữa các node

**Tên tệp:** `{workflow-name}.json` (được tạo từ tên workflow)

**Định dạng:** Xem [Cấu trúc Workflow](./workflow-structure.md) để biết JSON schema.

## Tải xuống Thư mục (ZIP)

**Vị trí:** Dashboard → tab Workflows → menu 3 chấm của thư mục → **Download as ZIP**

**Nội dung xuất:**
- Tất cả workflow trong thư mục và tất cả thư mục con, theo đệ quy
- Cấu trúc thư mục được giữ nguyên dưới dạng các directory bên trong tệp ZIP

**Cấu trúc ZIP:**
```
FolderName/
  workflow1.json
  workflow2.json
  SubFolder/
    workflow3.json
    DeepSub/
      workflow4.json
```

Mỗi tệp `.json` chứa `{ name, nodes, edges }`.

## Nhập

### Từ Dashboard (Tab Workflows)

1. Truy cập tab [Workflows](../tabs/workflows-tab.md)
2. Kéo một tệp **JSON** hoặc **ZIP** vào vùng workflow

**Tệp JSON:** Một workflow mới được tạo. Tên workflow lấy từ trường `name` trong JSON, hoặc từ tên tệp nếu thiếu trường `name`.

**Tệp ZIP:** Toàn bộ cấu trúc thư mục được tái tạo ở cấp gốc. Mỗi tệp `.json` bên trong ZIP trở thành một workflow được đặt trong thư mục tương ứng. Các credential và tham chiếu chéo giữa các workflow không tồn tại trong instance hiện tại sẽ được xóa tự động. Nếu một số workflow nhập thất bại, một bản tóm tắt sẽ hiển thị số lượng thành công.

### Từ Canvas (Editor)

1. Mở một workflow trong editor
2. Kéo một tệp JSON vào canvas
3. Nếu canvas đã có node hoặc edge, một hộp thoại xác nhận sẽ hỏi có thay thế workflow hiện tại hay không
4. Các node và edge được nhập sẽ thay thế hoặc hợp nhất vào workflow hiện tại

## Định dạng Tệp

### JSON (một workflow)

```json
{
  "nodes": [...],
  "edges": [...],
  "name": "Optional workflow name"
}
```

- `nodes` – Bắt buộc; mảng các đối tượng node
- `edges` – Tùy chọn; mảng các đối tượng edge (mặc định là `[]`)
- `name` – Tùy chọn; được dùng khi tạo workflow mới từ thao tác nhập trên Dashboard

### ZIP (thư mục)

Tệp lưu trữ ZIP trong đó cấu trúc thư mục phản ánh hệ thống phân cấp thư mục. Mỗi tệp là một workflow JSON (xem ở trên). Tên thư mục và tên workflow lần lượt được tạo từ tên directory và tên tệp.

Xem [Cấu trúc Workflow](./workflow-structure.md) để biết định dạng node và edge.

## Trường hợp Sử dụng

- **Sao lưu** – Tải xuống workflow hoặc toàn bộ thư mục trước khi thực hiện thay đổi lớn
- **Chia sẻ** – Xuất và chia sẻ tệp JSON với đồng nghiệp
- **Di chuyển** – Chuyển workflow hoặc cấu trúc thư mục giữa các instance Heym
- **Quản lý phiên bản** – Lưu trữ workflow JSON trong Git cùng với mã nguồn

## Liên quan

- [Cấu trúc Workflow](./workflow-structure.md) – Định dạng JSON cho node và edge
- [Tab Workflows](../tabs/workflows-tab.md) – Tạo workflow và nhập qua kéo & thả
- [Tổ chức Workflow](./workflow-organization.md) – Thư mục và thư mục con
- [Tính năng Canvas](./canvas-features.md) – Các tính năng của editor bao gồm nhập vào canvas
