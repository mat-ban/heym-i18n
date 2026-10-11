# Cài đặt

Hộp thoại Cài đặt cho phép bạn quản lý hồ sơ cá nhân, thiết lập chỉ dẫn AI thường trực, cập nhật mật khẩu tài khoản, cấu hình giọng nói cho chat, đặt credential và model AI mặc định, cùng xem trạng thái observability. Mở hộp thoại bằng cách nhấp vào **ảnh đại diện và tên của bạn** ở góc trên bên phải thanh tiêu đề.

## Mở hộp thoại

Nhấp vào **ảnh đại diện và tên của bạn** ở góc trên bên phải thanh tiêu đề. Hộp thoại mở ra với các tab: **Profile**, **Security**, **Voice**, **AI Defaults** và **Observability**. Quản trị viên instance cũng thấy thêm tab **SSO**.

## Tab Profile

### Ảnh đại diện

Heym hiển thị ảnh [Gravatar](https://gravatar.com) của email tài khoản bạn trên thanh tiêu đề, bên cạnh tin nhắn của bạn trong [Chat](../tabs/chat-tab.md) và **Chat with Heym**, trên bình luận [Board](../tabs/board-tab.md), và bên cạnh tên bạn trong các hộp thoại chia sẻ và danh sách thành viên nhóm. Để thay đổi, hãy cập nhật ảnh trên Gravatar; Heym sẽ nhận ảnh mới trong vòng vài giờ. Nếu không có ảnh Gravatar, Heym hiển thị chữ cái đầu tiên trong tên bạn.

Ảnh được máy chủ Heym tải về và lưu cache tại đó, nên trình duyệt của bạn không bao giờ liên hệ trực tiếp với Gravatar. Nếu máy chủ không thể truy cập Gravatar, mọi người vẫn tiếp tục thấy chữ cái viết tắt.

### Tên

Tên hiển thị của bạn trong toàn bộ ứng dụng. Trường này là bắt buộc và không được để trống.

### User Rules

User Rules là các chỉ dẫn tùy chỉnh được tự động chèn vào mọi yêu cầu AI—cả trong trình tạo workflow lẫn chat trên dashboard. Trong **trình tạo workflow** ([AI Assistant](./ai-assistant.md)), chúng được thêm vào cuối system prompt dùng để tạo workflow JSON. Trong **chat trên dashboard**, chúng được áp dụng như ngữ cảnh cấp hệ thống. Bạn viết một lần và chúng áp dụng trên toàn cục mà không cần lặp lại trong từng prompt.

**Các cách dùng phổ biến:**

- Ngôn ngữ hoặc giọng điệu: `Always respond in English. Keep responses concise.`
- Phong cách lập trình: `Use async/await patterns. Prefer TypeScript interfaces over types.`
- Quy ước workflow: `Include error handling in all workflows. Use descriptive node labels.`
- Định dạng phản hồi: `Use bullet points. Avoid lengthy explanations.`

**Nơi chúng được áp dụng:**

| Ngữ cảnh | Mô tả |
|---------|-------------|
| **Trình tạo workflow** | Các yêu cầu của [AI Assistant](./ai-assistant.md) để tạo hoặc chỉnh sửa workflow |
| **Chat trên dashboard** | Tất cả các cuộc hội thoại trong [tab Chat](../tabs/chat-tab.md) |

User Rules được chèn ở cấp hệ thống—chúng tự động chạy trước mọi prompt, không cần cấu hình thêm cho từng workflow hay cuộc hội thoại.

### Lưu thay đổi hồ sơ

Nhấp **Save Changes** để áp dụng. Thay đổi có hiệu lực ngay lập tức cho mọi yêu cầu AI mới.

## Tab Security

### Đổi mật khẩu

Dùng tab Security để cập nhật mật khẩu tài khoản của bạn.

**Yêu cầu:**

| Quy tắc | Yêu cầu |
|------|-------------|
| Độ dài tối thiểu | 8 ký tự |
| Chữ hoa | Ít nhất một chữ cái viết hoa (A–Z) |
| Chữ thường | Ít nhất một chữ cái viết thường (a–z) |
| Chữ số | Ít nhất một chữ số (0–9) |

Mật khẩu cũng phải khác với mật khẩu hiện tại. Các quy tắc này được thực thi ở cả frontend lẫn backend.

**Các bước:**

1. Nhập **Current Password** (Mật khẩu hiện tại)
2. Nhập **New Password** (Mật khẩu mới) (phải đáp ứng tất cả yêu cầu ở trên)
3. Nhập lại vào **Confirm New Password** (Xác nhận mật khẩu mới)
4. Nhấp **Update Password**

Nếu mật khẩu hiện tại không đúng, một thông báo lỗi nội tuyến sẽ hiển thị. Khi thành công, thông báo xác nhận xuất hiện và biểu mẫu tự động đặt lại.

## Tab Voice

Tab Voice cấu hình giọng nói cho [tab Chat](../tabs/chat-tab.md): chọn một **credential ElevenLabs** (hoặc thêm mới ngay tại chỗ), chọn một **Voice** từ tài khoản ElevenLabs của bạn, rồi **Save Voice Settings**. Điều này cho phép đọc to từng tin nhắn và chế độ giọng nói tương tác. Xem [Chat Voice (TTS & STT)](./chat-voice.md) để biết toàn bộ luồng.

## Tab AI Defaults

Tab AI Defaults có hai phần.

### Credential & model ưu tiên

Chọn một **credential LLM ưu tiên** và một **model** từ đó. Đây sẽ trở thành mặc định khởi đầu cho mọi tính năng AI trong ứng dụng — chat, [AI Assistant](./ai-assistant.md) (trình tạo, trình phân tích và tạo workflow), board mapper, widget AI dashboard, [docs chat](../tabs/chat-tab.md), trợ giúp schema AI cho data-table, trình tạo biểu thức và evals — bất cứ khi nào bề mặt đó chưa có lựa chọn nào được lưu riêng.

Quy tắc chọn lựa mà mỗi bề mặt tuân theo là:

1. **Lựa chọn đã lưu** — lựa chọn bạn đã thực hiện trên bề mặt đó (ví dụ model cuối cùng của một cuộc hội thoại chat) luôn được ưu tiên.
2. **Ưu tiên** — được dùng khi không có lựa chọn nào được lưu.
3. **Credential khả dụng đầu tiên** — phương án dự phòng khi bạn chưa đặt tùy chọn ưu tiên.

Bạn vẫn có thể thay đổi credential và model cho từng bề mặt bất cứ lúc nào; tùy chọn ưu tiên chỉ điền vào giá trị mặc định ban đầu. Để credential ở trạng thái **No preference** để giữ nguyên hành vi dùng credential đầu tiên như trước. Nếu credential ưu tiên của bạn sau đó bị xóa hoặc ngừng chia sẻ, tab sẽ hiển thị thông báo và các bề mặt sẽ âm thầm chuyển về credential khả dụng đầu tiên.

### Sử dụng gói Coding

Đối với mỗi credential **Codex** (bao gồm cả những credential được chia sẻ), tab hiển thị mức sử dụng rate-limit còn lại dưới dạng thanh ngang cho từng cửa sổ đang hoạt động — ví dụ cửa sổ **5 giờ** và/hoặc cửa sổ **Weekly**, tùy thuộc vào gói của bạn. Mỗi thanh hiển thị phần trăm quota còn lại và đồng hồ đếm ngược thời gian reset. Nút **Refresh** sẽ tải lại theo yêu cầu (kết quả được cache tạm thời trên server).

Đối với mỗi credential **OpenCode**, tab hiển thị các cửa sổ đăng ký OpenCode Go — **5 giờ**, **Weekly** và **Monthly** — dưới dạng thanh cùng kiểu, được đọc từ endpoint sử dụng đã xác thực của gateway bằng API key của credential đó. Cửa sổ đã đạt giới hạn sẽ hiển thị là **"limit reached"** màu hổ phách. Nếu key không hợp lệ hoặc workspace không có đăng ký Go, thẻ sẽ nêu rõ lý do thay vì hiển thị các thanh.

## Tab Observability

Tab Observability hiển thị trạng thái chỉ đọc của [OpenTelemetry Tracing](./opentelemetry.md) cho instance này: tracing có được bật hay không, OTLP endpoint, tên service, tỷ lệ sampler, và những span nào được phát ra. Tracing được cấu hình thông qua các biến môi trường `HEYM_OTEL_*` trên backend, vì vậy tab này không chỉnh sửa bất cứ thứ gì. Khi tracing bị tắt, tab liệt kê các biến môi trường cần thiết để bật nó lên. Các thông tin bí mật như OTLP auth headers không bao giờ được hiển thị ở đây. Xem [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) để có tài liệu tham chiếu cấu hình đầy đủ.

## Tab SSO

Chỉ hiển thị với quản trị viên instance — các tài khoản được liệt kê trong `HEYM_ADMIN_EMAILS`. Tab này kết nối Heym với một nhà cung cấp OpenID Connect bên ngoài để mọi người đăng nhập bằng tài khoản họ đã có. Nhập issuer URL và client credentials, sao chép redirect URI chỉ đọc vào nhà cung cấp của bạn, và chạy **Test connection** trước khi bật. Đăng nhập bằng mật khẩu có thể được tắt từ đây sau khi bài test thành công. Xem [Single Sign-On](./sso.md) để biết hướng dẫn thiết lập đầy đủ.

## Tab Instances

Chỉ hiển thị với quản trị viên instance — các tài khoản được liệt kê trong `HEYM_ADMIN_EMAILS`. Tab này liệt kê các instance Heym được kết nối với database này và thiết lập cách phân chia các background run giữa chúng. Mỗi hàng hiển thị tên có thể chỉnh sửa của instance, vai trò của nó, trạng thái hoạt động, độ trễ đo được tới database, công tắc bật/tắt, và trọng số của nó. Trọng số là tỷ lệ phần chia giữa các instance hiện có thể nhận việc, không phải phần trăm của 100: với `41 / 26 / 33` và instance thứ ba bị tắt, hai instance đầu thực sự nhận 61% và 39%. Bảng điều khiển in ra tỷ lệ phân chia hiệu dụng đó bên dưới bảng, và chỉ từ chối lưu khi không có instance nào được bật có trọng số cả.

**Give new instances a share automatically** được bật theo mặc định: một instance tham gia sẽ nếu không thì nằm ở trọng số 0 và không nhận được gì, vì vậy leader sẽ cấp cho nó một phần chia bằng nhau một lần và giảm các trọng số hiện có xuống trong khi giữ nguyên tỷ lệ của chúng. Nó không bao giờ đụng đến instance mà bạn tự đặt trọng số.

Bảng điều khiển cũng báo cáo có bao nhiêu trong số các run của 24 giờ qua chỉ có thể thực thi trên instance chính. Khi tỷ lệ đó cao, các trọng số bên dưới nó không thể dịch chuyển công việc đó. Xem [Load Distribution](./cluster.md) để biết những gì vẫn ở lại main và cách chọn các con số.

## Những Gì Không Có Trong Hộp Thoại Này

| Tính năng | Tìm Ở Đâu |
|---------|-----------------|
| **Quản lý API key (MCP)** | [Tab MCP](../tabs/mcp-tab.md) – xem, sao chép và tạo lại API key của MCP server |
| **Theme (tối / sáng)** | Nút chuyển Sun/Moon ở header (cạnh user badge) |
| **Đổi email** | Hiện chưa được hỗ trợ |

## Liên quan

- [AI Assistant](./ai-assistant.md) – Chat của Workflow builder sử dụng User Rules
- [Tab Chat](../tabs/chat-tab.md) – Chat trên Dashboard sử dụng User Rules
- [Chat Voice (TTS & STT)](./chat-voice.md) – Giọng nói ElevenLabs được cấu hình trong tab Voice
- [Tab MCP](../tabs/mcp-tab.md) – API key của MCP server và việc phơi bày workflow tool
- [Tab Credentials](../tabs/credentials-tab.md) – API key cho các node AI và các tích hợp
- [Security](./security.md) – Quản lý session, rate limiting, mã hóa credential
- [Single Sign-On](./sso.md) – Kết nối một nhà cung cấp OpenID Connect bên ngoài
- [OpenTelemetry Tracing](./opentelemetry.md) – Distributed tracing cho các lần thực thi workflow và node
