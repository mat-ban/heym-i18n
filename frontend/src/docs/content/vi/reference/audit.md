# Nhật ký kiểm toán

Heym ghi một dòng kiểm toán cho mọi hành động liên quan đến bảo mật: ai đã thực hiện, thực hiện trên đối tượng nào và có thành công hay không. Các dòng này được ghi vào đầu ra tiêu chuẩn của backend thông qua logger `winston.audit`, cùng với nhật ký truy cập yêu cầu, và có thể đọc từ tab **Logs** hoặc bằng lệnh `docker logs`.

Ghi nhật ký kiểm toán **luôn được bật**. Không cần kích hoạt gì và không có biến môi trường nào cần thiết lập.

## Định dạng dòng

Một hành động tạo ra chính xác một dòng độc lập:

```
2026-08-25 14:02:11 INFO [winston.audit] audit action=credential.delete outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="OpenAI Prod" credential_type=openai
```

Mỗi dòng mang các trường sau:

| Trường | Mô tả |
|-------|-------------|
| `action` | Điều gì đã xảy ra, dưới dạng `resource.verb` — xem bảng bên dưới. |
| `outcome` | `success`, `failure`, hoặc `denied`. |
| `actor_id` | UUID của người dùng đã thực hiện hành động. Chỉ vắng mặt khi không có ai được xác thực. |
| `actor_email` | Email của người dùng đó. Trong trường hợp đăng nhập thất bại, đây là địa chỉ đã được thử, không phải tài khoản đã được xác nhận. |
| `target` | Đối tượng bị tác động, dưới dạng `type:uuid`. |
| `target_name` | Tên dễ đọc của đối tượng đó, được đặt trong dấu ngoặc kép khi chứa dấu cách. |

Tiếp theo là các trường dành riêng cho từng hành động — ví dụ `credential_type`, `imported`, `grantee_email`, `team_name`. Các giá trị chứa dấu cách, dấu ngoặc kép hoặc dấu `=` sẽ được đặt trong dấu ngoặc kép; các giá trị dài hơn 256 ký tự sẽ bị cắt với dấu hiệu `...(truncated)`.

## Đọc nhật ký

Logger kiểm toán là logger con của logger yêu cầu, vì vậy cả hai đều đến cùng một luồng trong khi vẫn có thể tách biệt:

```bash
# Chỉ các dòng kiểm toán, không có nhiễu từ access log
docker logs heym-backend 2>&1 | grep '\[winston.audit\]'

# Mọi thứ một người dùng đã làm
docker logs heym-backend 2>&1 | grep 'actor_email=alex@example.com'

# Đăng nhập thất bại và truy cập bị từ chối
docker logs heym-backend 2>&1 | grep -E 'outcome=(failure|denied)'

# Mọi thứ đã tác động đến một credential
docker logs heym-backend 2>&1 | grep 'target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43'
```

Trong ứng dụng, tab **Logs** đọc cùng đầu ra container đó. Nó được kiểm soát bởi `DOCKER_LOGS_ENABLED` và danh sách cho phép `DOCKER_LOGS_ALLOWED_EMAILS`.

## Những gì được ghi nhật ký

Mọi thay đổi trạng thái đều được ghi nhật ký. Các thao tác đọc chỉ được ghi nhật ký khi bản thân việc đọc là hành động nhạy cảm — xem lịch sử chạy của một workflow, mở một credential, tải xuống một tệp. Các thao tác đọc danh sách và chi tiết thông thường không được kiểm toán; access log đã ghi lại rằng một yêu cầu đã xảy ra, và việc kiểm toán mọi `GET` sẽ chôn vùi những dòng quan trọng.

### Xác thực

| Hành động | Ghi chú |
|--------|-------|
| `auth.register` | `outcome=denied` khi đăng ký bị tắt hoặc khi đăng nhập bằng mật khẩu bị tắt (`reason=password_login_disabled`), `failure` khi email đã được sử dụng. |
| `auth.login` | `outcome=failure` ghi lại địa chỉ đã thử và liệu email không tồn tại hay mật khẩu sai. |
| `auth.logout` | Actor được xác định từ refresh cookie, vì vậy một lần đăng xuất không có cookie sẽ được ghi nhật ký mà không có danh tính. |
| `auth.token_refresh` | `outcome=denied` với `reason=refresh_token_replayed_or_revoked` — một dấu hiệu đánh cắp token đáng để cảnh báo. |
| `auth.password_change` | `outcome=failure` khi mật khẩu hiện tại sai. |
| `auth.sso_login` | Đăng nhập một lần. `outcome=failure` mang lý do phản hồi của nhà cung cấp bị từ chối; `denied` mang `email_not_verified`, `domain_not_allowed`, hoặc `provisioning_disabled`. |
| `sso_settings.update` | Quản trị viên đã thay đổi cấu hình [SSO](./sso.md). Ghi lại `enabled` và `password_login_disabled`, không bao giờ ghi client secret. |
| `sso_settings.test` | Quản trị viên đã chạy kiểm tra kết nối SSO. |

### Workflow

`workflow.create` · `workflow.update` · `workflow.delete` · `workflow.version_revert` · `workflow.history_view` · `workflow.history_clear` · `workflow.share_add` · `workflow.share_remove` · `workflow.team_share_add` · `workflow.team_share_remove` · `workflow.execution_token_create` · `workflow.execution_token_revoke`

`workflow.history_view` ghi lại `owned=false` khi một cộng tác viên đọc lịch sử chạy của người khác. `workflow.delete` ghi lại `outcome=denied` với `reason=not_owner` khi một cộng tác viên cố gắng xóa.

### Credential

`credential.create` · `credential.update` · `credential.delete` · `credential.detail_view` · `credential.share_add` · `credential.share_remove` · `credential.team_share_add` · `credential.team_share_remove`

`credential.detail_view` được kiểm toán vì việc mở một credential sẽ giải mã nó. Một lần trượt sẽ ghi `outcome=denied`, đây là dấu hiệu của một nỗ lực liệt kê credential-id.
### Các tài nguyên khác

| Tài nguyên | Hành động |
|----------|---------|
| Variables | `variable.create` · `update` · `delete` · `bulk_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Vector stores | `vector_store.create` · `update` · `delete` · `clone` · `upload` · `item_delete` · `items_delete_by_source` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Alerts | `alert.create` · `update` · `delete` · `event_acknowledge` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` · `disable_on_access_revoke` |
| Data tables | `data_table.create` · `update` · `delete` · `clone` · `row_create` · `row_update` · `row_delete` · `rows_clear` · `rows_bulk_create` · `import_csv` · `export_csv` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Dashboards | `dashboard.create` · `update` · `delete` · `widget_create` · `widget_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Boards | `board.create` · `update` · `delete` · `column_create` · `column_update` · `column_delete` · `column_empty` · `card_create` · `card_update` · `card_delete` · `card_move` · `card_run` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Drive | `drive.upload` · `download` · `delete` · `delete_all` · `bulk_delete` · `share_create` · `share_revoke` · `team_sharing_update` · `bulk_team_sharing_update` |
| Teams | `team.create` · `update` · `delete` · `member_add` · `member_remove` |
| Folders | `folder.create` · `update` · `delete` · `workflow_move` |

Các thao tác hàng loạt được ghi log một lần cho mỗi yêu cầu kèm theo số lượng, không phải một lần cho mỗi dòng. Một lần import CSV gồm 5.000 dòng sẽ tạo ra một dòng `data_table.import_csv` mang các thông tin `imported`, `rejected`, và `total`.

## Secrets Không Bao Giờ Được Ghi Log

Một dòng audit ghi lại các định danh, tên và số lượng. Nó không bao giờ ghi lại nội dung của credential, giá trị của variable, mật khẩu hay token.

Hai điều đảm bảo điều này. Các điểm gọi (call site) được viết để chỉ truyền các trường an toàn, và helper audit sẽ che giấu (redact) như một lớp bảo vệ dự phòng: bất kỳ trường nào có tên chứa `password`, `secret`, `token`, `api_key`, `value`, `authorization`, `cookie` hoặc tương tự đều được thay bằng `***` trước khi dòng log được tạo. Việc che giấu quá mức là có chủ đích — một dòng log không hữu ích vẫn tốt hơn một credential bị rò rỉ.

Khi một secret thực sự liên quan đến bản ghi, chỉ hình dạng của nó được ghi log. Một chia sẻ tệp ghi lại `password_protected=true`, không bao giờ ghi mật khẩu.

## Lưu Trữ

**Các dòng audit chỉ tồn tại chừng nào container còn xuất log.** Chúng không được ghi vào cơ sở dữ liệu. Việc tạo lại container backend sẽ xóa bỏ log của nó.

Nếu bạn cần lịch sử audit tồn tại qua các lần triển khai lại, hãy chuyển stdout của container đến một nơi lưu trữ bền vững — một log driver, một sidecar collector, hoặc hệ thống tổng hợp log của nền tảng bạn — giống như cách bạn làm với bất kỳ log container nào khác.

## Dành Cho Người Đóng Góp

Việc phát ra một dòng audit chỉ cần một lệnh gọi:

```python
from app.services.audit_log import audit

audit(
    action="credential.delete",
    actor=current_user,
    target_type="credential",
    target_id=credential.id,
    target_name=credential.name,
)
```

Helper này là đồng bộ (synchronous), không truy cập cơ sở dữ liệu, và tự nuốt lỗi của chính nó, vì vậy một lệnh gọi audit không thể thất bại hay làm chậm yêu cầu.

Ba quy tắc khi thêm một lệnh gọi:

1. **Đặt tên hành động theo dạng `resource.verb` viết bằng snake_case.** `backend/tests/test_audit_log.py` sẽ duyệt qua mọi lệnh gọi `audit()` dưới `app/api/` và làm build thất bại nếu tên không khớp, và nếu một tài nguyên đã được bao phủ bị mất hết các điểm gọi của nó.

2. **Chỉ đọc các thuộc tính chắc chắn tồn tại.** Khối `try/except` của helper bảo vệ thân của chính nó, không bảo vệ các biểu thức bạn truyền vào — một `AttributeError` trong `target_name=workflow.name` sẽ được ném ra tại điểm gọi, trước khi `audit()` chạy, và sẽ làm hỏng yêu cầu. Hãy đọc các cột ORM và biến cục bộ, không đọc các thuộc tính tùy chọn hoặc được tải lười (lazily-loaded).

3. **Ghi log việc xóa trước khi xóa.** Sau `db.delete(row)`, tên và id mà bạn muốn ghi lại có thể đã biến mất. Hãy đặt lệnh gọi phía trên nó.
