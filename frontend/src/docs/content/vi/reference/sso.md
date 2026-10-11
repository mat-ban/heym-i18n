# Đăng nhập một lần (Single Sign-On)

Heym có thể xác thực người dùng với bất kỳ nhà cung cấp **OpenID Connect** bên ngoài nào. Quản trị viên nhập issuer URL trong **Settings → SSO**, và Heym sẽ đọc mọi endpoint còn lại từ tài liệu discovery của nhà cung cấp đó.

Không có nhà cung cấp nào được hardcode. Keycloak, Okta, Entra ID, Auth0, Google và bất kỳ nhà cung cấp OIDC nào khác đều kết nối qua cùng các trường như nhau, vì thông tin duy nhất mà Heym được cung cấp là issuer.

Đăng nhập bằng mật khẩu và SSO hoạt động song song. Có thể tắt đăng nhập bằng mật khẩu sau khi SSO đã được xác minh.

## Trước khi bắt đầu

Cài đặt SSO áp dụng cho toàn bộ instance, vì vậy chỉ quản trị viên của instance mới có thể thay đổi chúng. Quản trị viên được chỉ định bằng một biến môi trường, không lưu trong cơ sở dữ liệu:

```
HEYM_ADMIN_EMAILS=admin@example.com,ops@example.com
```

Giá trị rỗng nghĩa là không cấp quyền cho ai. Khởi động lại backend sau khi thay đổi. Các tài khoản trong danh sách này cũng thấy tab **SSO** trong Settings, và vẫn giữ quyền truy cập bằng mật khẩu ngay cả khi đăng nhập bằng mật khẩu bị tắt — xem [Tắt đăng nhập bằng mật khẩu](#disabling-password-sign-in).

## Đăng ký Heym với nhà cung cấp của bạn

Trong nhà cung cấp danh tính của bạn, hãy tạo một **confidential client** (còn gọi là app registration) với:

| Cài đặt | Giá trị |
|---------|-------|
| Protocol | OpenID Connect |
| Grant type | Authorization Code with PKCE |
| Client authentication | Bật — Heym dùng client secret |
| Redirect URI | Giá trị chính xác hiển thị trong tab SSO của Heym |
| Scopes | `openid email profile` |

Heym tính toán redirect URI từ `FRONTEND_URL` và hiển thị nó ở chế độ chỉ đọc trong biểu mẫu cài đặt kèm nút sao chép. Nó luôn kết thúc bằng `/api/auth/sso/callback`. Hãy sao chép thay vì gõ tay — redirect URI không khớp là lỗi thiết lập phổ biến nhất, và các nhà cung cấp sẽ từ chối mà không giải thích.

Nhà cung cấp của bạn phải trả về địa chỉ email đã được xác minh. Xem [Ánh xạ tài khoản](#account-mapping).

## Cấu hình Heym

Mở **Settings → SSO**. Tab này chỉ xuất hiện với các tài khoản trong `HEYM_ADMIN_EMAILS`.

| Trường | Chức năng |
|-------|--------------|
| **Enable single sign-on** | Hiển thị nút đăng nhập trên màn hình đăng nhập. |
| **Issuer URL** | URL gốc của nhà cung cấp, ví dụ `https://idp.example.com/realms/your-realm`. Heym sẽ thêm `/.well-known/openid-configuration` và đọc phần còn lại từ đó. |
| **Client ID** | Định danh client từ nhà cung cấp của bạn. |
| **Client secret** | Được lưu ở dạng mã hóa. Để trống trường này để giữ giá trị đã lưu — Heym không bao giờ trả về secret mà nó đang giữ. |
| **Redirect URI** | Chỉ đọc. Sao chép giá trị này vào allowlist của nhà cung cấp. |
| **Scopes** | Mặc định là `openid email profile`. |
| **Sign-in button label** | Văn bản trên nút ở màn hình đăng nhập, ví dụ "Sign in with Okta". |
| **Create an account on first sign-in** | Có tự động cấp tài khoản Heym cho người dùng chưa biết hay không. |
| **Allowed email domains** | Phân tách bằng dấu phẩy. Để trống nghĩa là cho phép mọi domain mà nhà cung cấp xác thực. |
| **Disable password sign-in** | Tắt xác thực bằng mật khẩu trên toàn bộ instance. |

### Kiểm tra kết nối trước

**Test connection** sẽ tải tài liệu discovery và các signing key của nhà cung cấp, sau đó báo cáo token endpoint mà nó tìm thấy. Bạn có thể chạy nó trên một issuer vừa nhập nhưng chưa lưu, vì vậy một URL sai chỉ tốn một cú nhấp thay vì một lần lưu.

Một lần test chỉ *ghi nhận* kết quả đạt khi issuer được test chính là issuer đã được lưu. Một lần test bản nháp chỉ cho bạn biết URL có phân giải được hay không; nó không cấp phép cho một cấu hình chưa được lưu. Việc thay đổi issuer, client ID, scopes hoặc secret sẽ xóa kết quả đã ghi nhận vì lý do tương tự.

## Cách thức đăng nhập hoạt động

1. Người dùng nhấp vào nút đăng nhập trên màn hình đăng nhập.
2. Heym chuyển hướng họ đến nhà cung cấp kèm `state`, `nonce` và PKCE challenge.
3. Họ xác thực với nhà cung cấp.
4. Nhà cung cấp chuyển hướng trở lại callback của Heym kèm authorization code.
5. Heym đổi code lấy token và xác minh ID token dựa trên các key công khai của nhà cung cấp, kiểm tra chữ ký, audience, issuer, thời hạn và nonce.
6. Heym phân giải tài khoản và cấp session của chính nó, giống hệt như đăng nhập bằng mật khẩu.

Mọi thứ sau bước 6 đều không thay đổi: cùng session cookie, cùng thời hạn token, cùng quyền hạn.

## Ánh xạ tài khoản

Heym phân giải tài khoản theo thứ tự sau:

1. **`(issuer, subject)`** — danh tính mà nhà cung cấp đã xác nhận trong lần đăng nhập trước. Đây là nguồn có thẩm quyền và vẫn đúng ngay cả khi email thay đổi tại nhà cung cấp.
2. **Email đã xác minh** — một tài khoản Heym hiện có với địa chỉ đó sẽ được nhận, và subject của nhà cung cấp được ghi vào đó từ đó về sau.
3. **Tài khoản mới** — được tạo nếu **Create an account on first sign-in** đang bật và domain được cho phép.

Một email chỉ được coi là đã xác minh khi ID token mang `email_verified: true`. Nếu claim đó là `false` hoặc không có, đăng nhập sẽ bị từ chối. Nhận một tài khoản hiện có — hoặc tạo tài khoản mới — dựa trên một địa chỉ mà nhà cung cấp không đảm bảo là một con đường chiếm đoạt tài khoản, nên Heym không làm vậy. Nhà cung cấp không bao giờ phát ra `email_verified` cần được cấu hình để làm điều đó.

Các tài khoản được tạo theo cách này không có mật khẩu. Chúng chỉ đăng nhập qua nhà cung cấp.

## Tắt đăng nhập bằng mật khẩu

Công tắc **Tắt đăng nhập bằng mật khẩu** sẽ không khả dụng cho đến khi ba điều kiện sau được thỏa mãn:

1. SSO đã được bật.
2. Kiểm tra kết nối đã thành công, để một issuer sai không thể tự khóa cửa lại phía sau.
3. Có ít nhất một tài khoản trong `HEYM_ADMIN_EMAILS` thực sự có mật khẩu.

Khi công tắc này được bật, xác thực bằng mật khẩu sẽ bị từ chối trên cả ba bề mặt tạo ra hoặc chấp nhận mật khẩu: biểu mẫu đăng nhập, **đăng ký**, và trang chấp thuận MCP OAuth. Đăng ký được tính vào đây vì nó cấp phát mật khẩu; nếu để mở, bất kỳ ai truy cập được `/register` đều có thể vượt qua cài đặt này.

Các tài khoản được liệt kê trong `HEYM_ADMIN_EMAILS` được miễn trừ khỏi cả ba bề mặt. Bất kỳ ai có thể chỉnh sửa tệp môi trường đều đã có thể khôi phục instance, vì vậy sự đảm bảo này nằm trong mã nguồn thay vì trong trí nhớ của người vận hành.

### Vì sao tồn tại điều kiện thứ ba

Một quản trị viên có tài khoản Heym được tạo *thông qua* SSO sẽ không có mật khẩu nào cả. Việc miễn trừ sẽ cho phép họ vượt qua cổng, nhưng họ không có gì để đăng nhập — vì vậy instance sẽ không có cách nào quay lại nếu provider gặp sự cố. Heym từ chối rơi vào trạng thái đó và thông báo rõ điều này.

Nếu bạn gặp thông báo đó, hãy đăng nhập qua SSO và đăng ký một tài khoản có mật khẩu trên một trong các địa chỉ quản trị của bạn (đăng ký vẫn mở cho các địa chỉ quản trị chính vì lý do này), hoặc thêm một địa chỉ đã có mật khẩu vào `HEYM_ADMIN_EMAILS`.

### Khôi phục khi provider gặp sự cố

Theo thứ tự ưu tiên:

1. **Đăng nhập bằng mật khẩu quản trị dự phòng.** Màn hình đăng nhập ẩn biểu mẫu mật khẩu khi đăng nhập bằng mật khẩu bị tắt, vì vậy hãy nhấp vào **Đăng nhập bằng mật khẩu thay thế** bên dưới nút SSO để hiện nó ra. Biểu mẫu này không phải là một cách vượt qua: mọi địa chỉ nằm ngoài `HEYM_ADMIN_EMAILS` vẫn bị từ chối, và được thông báo lý do.
2. **Thêm chính bạn vào `HEYM_ADMIN_EMAILS`** trong tệp môi trường và khởi động lại backend. Một tài khoản đã có mật khẩu sau đó có thể đăng nhập.
3. **Mở lại đăng nhập bằng mật khẩu trực tiếp trong cơ sở dữ liệu**, nếu không có quản trị viên nào có mật khẩu:

   ```sql
   UPDATE sso_settings SET password_login_disabled = false;
   ```

   Không cần khởi động lại; cài đặt được đọc theo từng yêu cầu.

Người dùng cuối của Portal không bị ảnh hưởng. Họ xác thực dựa trên một thư mục riêng — xem [Portal](./portal.md).

## Lỗi đăng nhập

Một lần đăng nhập thất bại sẽ quay lại màn hình đăng nhập kèm thông báo dễ đọc. Heym không bao giờ hiển thị văn bản lỗi thô từ provider.

| Thông báo | Nguyên nhân |
|---------|-------|
| Lần đăng nhập đó đã hết hạn | Lần thử mất hơn mười phút, hoặc trình duyệt đã mất cookie giao dịch. Hãy thử lại. |
| Không thể kết nối tới nhà cung cấp danh tính | Discovery hoặc trao đổi token thất bại. Kiểm tra URL issuer và đảm bảo provider có thể truy cập được từ backend. |
| Không thể xác minh phản hồi của provider | ID token không vượt qua kiểm tra chữ ký, audience, issuer, thời hạn, hoặc nonce. Thường là do client ID không khớp. |
| Provider không trả về địa chỉ email | Thiếu scope `email`, hoặc provider không cung cấp claim này. |
| Địa chỉ email của bạn chưa được xác minh | Provider gửi `email_verified: false`, hoặc bỏ qua claim này. |
| Tên miền email của bạn không được phép | Địa chỉ nằm ngoài **Tên miền email được phép**. |
| Không tồn tại tài khoản Heym cho bạn | **Tạo tài khoản trong lần đăng nhập đầu tiên** đang tắt và không có tài khoản nào khớp. Quản trị viên phải tạo một tài khoản. |
| Đăng nhập một lần chưa được cấu hình | SSO bị tắt, hoặc thiếu issuer, client ID, hoặc secret. |

## Ghi chú bảo mật

- **Client secret được mã hóa khi lưu trữ** và không bao giờ được trả về bởi bất kỳ endpoint nào. Biểu mẫu cài đặt chỉ báo cáo liệu có một secret được lưu hay không.
- **PKCE verifier không bao giờ rời khỏi Heym.** Nó được giữ trong một cookie `HttpOnly` ngắn hạn thay vì trong tham số `state`, vốn đi vòng qua provider trong tầm nhìn công khai.
- **Chỉ chấp nhận chữ ký bất đối xứng.** `none` và các thuật toán đối xứng bị từ chối bất kể provider quảng cáo điều gì.
- **Đích đến sau đăng nhập được xác thực** là một đường dẫn cùng origin, vì vậy callback không thể bị dùng làm chuyển hướng mở.
- **Mọi lần đăng nhập đều được ghi audit.** Thành công, thất bại, và từ chối xuất hiện dưới dạng các dòng `auth.sso_login`, và các thay đổi cấu hình dưới dạng `sso_settings.update` — xem [Ghi log Audit](./audit.md).

## Những gì không được hỗ trợ

- **SAML.** OIDC là giao thức duy nhất.
- **Nhiều provider đồng thời.** Một instance kết nối tới một provider.
- **Ánh xạ nhóm hoặc vai trò** từ các claim của provider.
- **Đăng xuất một lần.** Đăng xuất khỏi Heym không đăng xuất bạn khỏi provider.
