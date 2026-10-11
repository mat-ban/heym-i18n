# Đội ngũ

Teams cho phép bạn chia sẻ workflow, credential, biến toàn cục, vector store và tệp Drive với một nhóm người dùng cùng lúc.

## Tổng quan

- **Team** – Một nhóm có tên với người tạo và các thành viên
- **Creator** – Luôn là thành viên; có thể chỉnh sửa team, xóa team, thêm thành viên
- **Member** – Có thể thêm và xóa các thành viên khác (trừ creator); có quyền truy cập vào các tài nguyên được chia sẻ với team

## Tạo và Quản lý Teams

Tạo team từ [tab Teams](../tabs/teams-tab.md). Thêm thành viên bằng email; họ phải có tài khoản. Không thể xóa creator. Xóa một team sẽ xóa tất cả các chia sẻ của team đó.

## Mô hình Chia sẻ

Tài nguyên có thể được chia sẻ với:

1. **Người dùng cá nhân** – Bằng email (chia sẻ giữa người dùng với người dùng)
2. **Teams** – Bằng cách chọn một team (chia sẻ theo team)

Cả hai mô hình đều mang tính cộng dồn. Người dùng có quyền truy cập nếu họ:

- Được chia sẻ trực tiếp (chia sẻ người dùng), hoặc
- Là thành viên của một team đã được chia sẻ (chia sẻ team)

## Những gì có thể Chia sẻ với Teams

| Tài nguyên | Vị trí Chia sẻ |
|----------|----------------|
| Workflows | Hộp thoại chia sẻ trong trình chỉnh sửa workflow |
| Workflow Templates | Hộp thoại chia sẻ khi tạo/chỉnh sửa workflow template |
| Node Templates | Hộp thoại chia sẻ khi tạo/chỉnh sửa node template |
| Credentials | Hộp thoại chia sẻ trong tab Credentials |
| Biến Toàn cục | Hộp thoại chia sẻ trong tab Variables |
| Vector Stores | Hộp thoại chia sẻ trong tab Vectors |
| Tệp Drive | Hộp thoại chia sẻ trong tab Drive hoặc các thao tác `shareWithMyTeams` / `unshareWithMyTeams` của node Drive |

Đối với template, khi chế độ hiển thị là **Specific users**, bạn cũng có thể chọn team. Tất cả thành viên của các team được chọn sẽ có quyền truy cập vào template.
Chia sẻ tệp Drive theo team chỉ ở chế độ chỉ đọc đối với thành viên team; chủ sở hữu tệp vẫn giữ quyền quản lý.

## API Endpoints

- `GET /api/teams` – Liệt kê các team mà người dùng thuộc về
- `GET /api/teams/{id}` – Lấy chi tiết team cùng các thành viên
- `GET /api/teams/{id}/shared-entities` – Trả về các thực thể được chia sẻ với team (workflow, credential, biến toàn cục, vector store, tệp, workflow template, node template)
- `POST /api/teams` – Tạo team
- `PATCH /api/teams/{id}` – Cập nhật team
- `DELETE /api/teams/{id}` – Xóa team (chỉ creator)
- `POST /api/teams/{id}/members` – Thêm thành viên (body: `{ "email": "..." }`)
- `DELETE /api/teams/{id}/members/{user_id}` – Xóa thành viên

Chia sẻ team theo từng tài nguyên:

- `GET/POST/DELETE /api/workflows/{id}/team-shares` – body của POST chấp nhận `permission` (`read` hoặc `write`, mặc định là `write`); gửi lại một team đã tồn tại sẽ cập nhật quyền của team đó
- `GET/POST/DELETE /api/credentials/{id}/team-shares`
- `GET/POST/DELETE /api/global-variables/{id}/team-shares`
- `GET/POST/DELETE /api/vector-stores/{id}/team-shares`
- `PATCH /api/files/{id}/team-sharing`

## Liên quan

- [Tab Teams](../tabs/teams-tab.md) – Tạo và quản lý team
- [Tab Templates](../tabs/templates-tab.md) – Chia sẻ workflow template và node template với team
- [Chia sẻ Credentials](./credentials-sharing.md) – Chia sẻ credential với người dùng và team
- [Tổ chức Workflow](./workflow-organization.md) – Thư mục và chia sẻ workflow
