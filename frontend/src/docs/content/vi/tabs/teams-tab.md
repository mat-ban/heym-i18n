# Tab Teams

Tab **Teams** cho phép bạn tạo và quản lý các team để chia sẻ workflow, credentials, variables, vector stores và Drive files với các nhóm người dùng.

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Xem demo Teams</a></p>

## Tạo một Team

1. Nhấp vào **New Team**
2. Nhập tên và mô tả tùy chọn
3. Nhấp vào **Create**

Bạn tự động trở thành người tạo team và là thành viên đầu tiên.

## Quản lý thành viên

- **Thêm thành viên** – Nhập email người dùng trong hộp thoại chi tiết team và nhấp vào **Add**
- **Xóa thành viên** – Nhấp vào dấu X bên cạnh thành viên (không thể xóa người tạo)
- **Chỉnh sửa team** – Người tạo có thể chỉnh sửa tên và mô tả
- **Xóa team** – Người tạo có thể xóa team; tất cả các chia sẻ của team sẽ bị gỡ bỏ
- **Tài nguyên được chia sẻ** – Hộp thoại chi tiết team hiển thị các workflow, credentials, variables, vector stores, Drive files, workflow templates và node templates được chia sẻ với team. Nhấp vào một workflow để mở trong trình chỉnh sửa; chuyển sang tab tương ứng cho các tài nguyên khác.

## Chia sẻ với Teams

Chia sẻ tài nguyên với các team từ:

- **Workflows** – Hộp thoại chia sẻ trong trình chỉnh sửa workflow
- **Workflow Templates** – Hộp thoại chia sẻ khi tạo/chỉnh sửa workflow template (hiển thị: Specific users)
- **Node Templates** – Hộp thoại chia sẻ khi tạo/chỉnh sửa node template (hiển thị: Specific users)
- **Credentials** – Hộp thoại chia sẻ trong tab Credentials
- **Variables** – Hộp thoại chia sẻ trong tab Variables
- **Vector Stores** – Hộp thoại chia sẻ trong tab Vectors
- **Dashboards** – Cài đặt Dashboard trong tab Dashboard (đọc hoặc ghi)
- **Drive Files** – Hộp thoại chia sẻ trong tab Drive hoặc các thao tác `shareWithMyTeams` / `unshareWithMyTeams` của Drive node

Khi bạn chia sẻ với một team, tất cả thành viên trong team đều có quyền truy cập. Xem [Teams](../reference/teams.md) để biết chi tiết.

Khi bạn chia sẻ một workflow với một team, hãy chia sẻ cả credentials và các sub-workflow mà workflow đó phụ thuộc với cùng team đó. Chỉ có quyền truy cập workflow không cấp quyền truy cập credential hay workflow con.

## Tích hợp Chat

Trợ lý AI trong [tab Chat](./chat-tab.md) có thể liệt kê các team của bạn. Hỏi "my teams" để xem bạn thuộc những team nào.

## Liên quan

- [Teams](../reference/teams.md) – Tham chiếu Teams và mô hình chia sẻ
- [Credentials Sharing](../reference/credentials-sharing.md) – Chia sẻ credentials với người dùng và teams
- [Workflow Organization](../reference/workflow-organization.md) – Thư mục và chia sẻ
- [Contextual Showcase](../reference/contextual-showcase.md) – Hướng dẫn trang gọn cho các bề mặt dashboard
