# Google Meet

Tìm các khoảng thời gian khả dụng trong Google Calendar và tạo, cập nhật hoặc xóa lời mời họp kèm theo liên kết Google Meet, email của người tham dự và thời gian đã chọn. Tài khoản Google được kết nối sở hữu sự kiện; người tham dự nhận được lời mời qua email.

## Kết nối tài khoản của bạn

1. Trong [Google Cloud Console](https://console.cloud.google.com), hãy bật **Google Calendar API**.
2. Định cấu hình màn hình đồng ý OAuth và tạo ứng dụng OAuth cho **Ứng dụng web**. Thêm tài khoản Google của bạn làm người dùng thử nghiệm nếu ứng dụng đang ở chế độ thử nghiệm.
3. Đăng ký `https://your-heym-domain/api/credentials/google-meet/oauth/callback` làm URI chuyển hướng được ủy quyền. Đối với môi trường phát triển cục bộ, hãy sử dụng nguồn Heym trên trình duyệt của bạn với cùng đường dẫn.
4. Mở **Dashboard → Credentials → Mới → Google Meet (OAuth2)**, nhập tên, Client ID và Client Secret, sau đó nhấp vào **Kết nối** và đăng nhập bằng Google.
5. Cấp cả hai quyền: Sự kiện lịch (`calendar.events`) và tính khả dụng của lịch (`calendar.events.freebusy`). Chọn credential này trên node.

Token được mã hóa trong bộ lưu trữ và tự động làm mới. Đây là credential riêng biệt với Google AI, Sheets hoặc Drive. Lịch phải hỗ trợ hội nghị Google Meet để việc tạo thành công.

## Hoạt động

| Hoạt động | Hành vi | Các trường bắt buộc |
| --- | --- | --- |
| `read` | Trả về các khoảng thời gian rảnh và bận cho lịch | Thông tin xác thực |
| `create` | Tạo sự kiện theo lịch trình với hội nghị Meet mới và lời mời qua email | Tiêu đề, thời gian bắt đầu, thời gian kết thúc |
| `update` | Cập nhật các trường sự kiện được cung cấp và thông báo cho khách | ID sự kiện và ít nhất một trường thay đổi |
| `delete` | Xóa sự kiện và thông báo cho khách về việc hủy | ID sự kiện |

## Cấu hình

Các trường văn bản bên dưới chấp nhận biểu thức. Tất cả các trường, bao gồm tùy chọn chi tiết boolean, có thể được cung cấp bởi một Agent khi node này được đính kèm như một công cụ.

| Trường | Mặc định | Mục đích |
| --- | --- | --- |
| `gmCalendarId` | `primary` | Lịch chính của tài khoản được kết nối, hoặc ID/email lịch có thể truy cập |
| `gmTimeZone` | `UTC` | Múi giờ IANA, chẳng hạn như `Asia/Ho_Chi_Minh`, được sử dụng cho ngày giờ địa phương |
| `gmStartDate` | Thời gian hiện tại | Bắt đầu phạm vi đọc dưới dạng ngày ISO hoặc datetime |
| `gmEndDate` | Ngày đầu tiên của tháng tiếp theo vào nửa đêm | Kết thúc độc quyền của phạm vi đọc; phạm vi tối đa là 60 ngày theo lịch |
| `gmIncludeBusyDetails` | `false` | Chỉ đọc: bao gồm tiêu đề sự kiện và người tham dự trong `busy_slots`; boolean |
| `gmEventId` | Trống | ID sự kiện lịch cho update/delete; sử dụng `event_id` được trả về, không dùng URL Meet |
| `gmTitle` | Trống | Tiêu đề lời mời; bắt buộc khi `create` |
| `gmDescription` | Trống | Mô tả lời mời |
| `gmStartTime` | Trống | Bắt đầu cuộc họp, ví dụ `2026-11-10T14:00:00+07:00` |
| `gmEndTime` | Trống | Kết thúc cuộc họp; phải sau thời gian bắt đầu |
| `gmAttendees` | Trống | Email được phân tách bằng dấu phẩy/chấm phẩy/xuống dòng hoặc mảng chuỗi email JSON |
| `gmLocation` | Trống | Vị trí cuộc họp tùy chọn bên cạnh hội nghị Meet |

### Khoảng thời gian khả dụng

Lệnh đọc mặc định bao gồm khoảng thời gian từ thời điểm hiện tại đến **ngày 1 của tháng tiếp theo lúc 00:00** theo múi giờ đã chọn. Truyền `gmEndDate` để chỉ định khung thời gian khác. Phạm vi trên 60 ngày hoặc ngày không hợp lệ sẽ bị từ chối trước khi gọi Google.

Kết quả dựa trên API **free/busy** của Google. Các khoảng thời gian bận được hợp nhất và trừ khỏi khung thời gian được yêu cầu. `available_slots` chứa các khoảng trống liên tục có dấu thời gian `start` và `end`.

```json
{
  "type": "googleMeet",
  "data": {
    "label": "Availability",
    "credentialId": "YOUR_GOOGLE_MEET_CREDENTIAL_ID",
    "gmOperation": "read",
    "gmCalendarId": "primary",
    "gmTimeZone": "Europe/Berlin",
    "gmStartDate": "2026-11-06",
    "gmEndDate": "2026-11-13"
  }
}
```

### Bao gồm chi tiết sự kiện bận

Trong mục **Đọc khoảng thời gian khả dụng**, hãy bật **Bao gồm chi tiết sự kiện bận** (`gmIncludeBusyDetails: true`) để thêm tiêu đề và người tham dự vào mỗi khung giờ bận. Tùy chọn này bị tắt theo mặc định.

```json
{
  "start": "2026-11-06T21:15:00+01:00",
  "end": "2026-11-06T21:30:00+01:00",
  "title": "Daily check-in",
  "attendees": [
    "colleague@example.com"
  ]
}
```

### Đặt lịch họp

1. Chạy một node `read` bằng thông tin xác thực của chủ sở hữu workflow.
2. Hiển thị `available_slots` trong giao diện đặt lịch của bạn.
3. Truyền `email`, `startTime` và `endTime` làm đầu vào của workflow.
4. Chạy `create` với cùng thông tin xác thực đó. Khách truy cập không cần tài khoản Google; email của họ được ghi lại với tư cách là người tham dự.

```json
{
  "type": "googleMeet",
  "data": {
    "label": "Booking",
    "credentialId": "YOUR_GOOGLE_MEET_CREDENTIAL_ID",
    "gmOperation": "create",
    "gmCalendarId": "primary",
    "gmTimeZone": "Europe/Berlin",
    "gmTitle": "Meet with me",
    "gmDescription": "A meeting booked through Heym",
    "gmAttendees": "$input.email",
    "gmStartTime": "$input.startTime",
    "gmEndTime": "$input.endTime"
  }
}
```

## Đầu ra

| Hoạt động | Các trường đầu ra |
| --- | --- |
| `read` | `available_slots`, `busy_slots`, `count`, `calendar_id`, `time_zone`, `start`, `end` |
| `create`, `update` | `event_id`, `meet_url`, `conference_status`, `event`, `calendar_id` |
| `delete` | `event_id`, `calendar_id`, `deleted: true` |

Sử dụng `$Availability.available_slots` hoặc `$Booking.meet_url` trong các node tiếp theo. Mỗi hoạt động cũng trả về `status: "success"` và `operation` tương ứng.

## Liên quan

- [Credentials](../reference/credentials.md)
- [Tích hợp bên thứ ba](../reference/integrations.md)
- [Chia sẻ thông tin xác thực](../reference/credentials-sharing.md)
- [Đầu vào](input-node.md)
- [Đầu ra](output-node.md)
