# Phân phối tải

Trỏ một instance Heym thứ hai vào cùng cơ sở dữ liệu PostgreSQL và nó sẽ tham gia với vai trò worker. Các lượt chạy workflow chạy nền sau đó được chia sẻ giữa các instance theo tỷ lệ phần trăm bạn đặt, nhờ đó máy phục vụ UI và API không còn là máy duy nhất chạy mọi workflow.

Các instance không bao giờ liên lạc với nhau. Postgres đảm nhiệm việc phân phối công việc, vì vậy một worker không cần cổng mở, không cần chứng chỉ, và không cần đường dẫn trở về instance chính — chỉ cần quyền truy cập cơ sở dữ liệu.

## Vai trò

Một instance là **main**, được ghim bằng một biến môi trường. Nó phục vụ UI, API, MCP và cổng chat, đồng thời sở hữu lưu trữ tệp và các plugin đã cài đặt. Mọi instance khác là **worker**: nó chỉ kết nối tới cơ sở dữ liệu và thực thi các lượt chạy nền.

```
HEYM_CLUSTER_ENABLED=true
HEYM_INSTANCE_ROLE=main       # hoặc: worker
HEYM_INSTANCE_NAME=EU Main    # nhãn hiển thị, có thể chỉnh sửa sau từ Settings
HEYM_INSTANCE_ID=eu-main      # tùy chọn; được suy ra từ tên khi để trống
```

Vai trò main tách biệt với việc bầu chọn leader. Heym đã bầu chọn một leader trên toàn cluster để đảm nhiệm cron, đánh giá cảnh báo và khôi phục sau sự cố; nếu main gặp sự cố, quyền lãnh đạo chuyển sang một worker trong vài giây và các lượt chạy theo lịch vẫn tiếp tục kích hoạt. Vai trò main không di chuyển, vì lưu trữ tệp không thể di chuyển theo nó.

## Những gì có thể rời khỏi instance main

Vị trí thực thi được quyết định từ các node của workflow trước khi lượt chạy bắt đầu. Một lượt chạy ở lại main khi bất kỳ node nào trong đó — bao gồm cả các node bên trong sub-workflow mà nó gọi — chạm tới thứ chỉ tồn tại trên một máy:

| Node | Lý do ở lại main |
|---|---|
| Codex, OpenCode Go | Workspace của coding-agent ở lại đĩa cục bộ để một lượt tiếp theo có thể tiếp tục trong đó |
| Agent có gắn skill | Mã skill đọc và ghi vào Heym Drive |
| Drive, Converter, Google Drive | Chúng đọc và ghi các tệp được tạo ra |
| Trigger File Upload | Tệp tải lên nằm trên đĩa của main |
| Send Email | Các relay SMTP của doanh nghiệp thường chỉ cho phép một địa chỉ nguồn |
| Node Plugin | Plugin được cài đặt trên đĩa của một instance |

**Mọi thứ khác đều được phân phối** — bao gồm node Code, Playwright và các công cụ Agent Python. Mọi instance chạy cùng một image với Docker socket riêng, vì vậy sandbox không phải là lý do để giữ một lượt chạy trên main, và đây là những node ngốn CPU nhiều nhất trong sản phẩm.

Một workflow có sub-workflow được chọn bằng biểu thức không thể được kiểm tra trước, vì vậy nó ở lại main.

## Chọn tỷ lệ phần trăm

Trọng số là các số nguyên được đặt trong **Settings → Instances**. Chúng là **phần chia của những instance hiện có thể nhận việc**, không phải tỷ lệ phần trăm của 100: bộ lập lịch chia cho tổng của chính nhóm đó.

Sự khác biệt này lộ ra ngay khi một instance rời đi. Với `Main 41, Worker A 26, Worker B 33`, tắt Worker B để lại một nhóm gồm 67, vì vậy Main thực nhận 41/67 = **61%** và Worker A nhận 26/67 = **39%**. Bảng điều khiển in ra tỷ lệ chia thực tế bên dưới bảng chính vì lý do này, và việc lưu không bao giờ bị chặn chỉ vì các con số không cộng lại thành 100 — chỉ có tỷ lệ chia mà không instance nào đang bật có trọng số mới bị từ chối.

Có hai điều nữa dễ bị hiểu sai.

**Tỷ lệ phần trăm không phải là phần chia sức mạnh máy.** Nó chỉ bao gồm các lượt chạy đi qua hàng đợi. Việc phục vụ UI và API, truyền phát các lượt chạy của editor và cổng chat, và xử lý tải tệp lên đều là công việc của main và không có phần nào được tính. Main đang làm nhiều hơn con số của nó.

**Tỷ lệ phần trăm của main là mức trần, không phải mức sàn.** Các lượt chạy chỉ có thể thực thi trên main được tính vào hạn ngạch của nó, vì vậy khi hạn ngạch đó cạn, các lượt chạy có thể phân phối còn lại sẽ rơi xuống các worker. Đặt con số của main thấp là an toàn — công việc buộc phải chạy ở đó vẫn chạy. Đặt nó cao sẽ khiến các worker bị đói việc.

Vì vậy với một main mạnh và một worker nhỏ hơn, hãy bắt đầu gần 60/40 hơn là theo tỷ lệ thô của các máy, sau đó so sánh thời lượng chạy thực tế trong tab Traces và điều chỉnh.

Trọng số được chuẩn hóa lại trên các instance hiện đang hoạt động và được bật. Với `main=70, A=15, B=15`, nếu A offline thì tỷ lệ chia trở thành 70/85 và 15/85 giữa main và B, và trở lại 70/15/15 khi A quay lại.

**Một instance quay lại không được đền bù cho những lượt chạy nó đã bỏ lỡ.** Thời gian ở trạng thái Offline, Disabled hoặc trên phiên bản không khớp không được tính vào nó, vì vậy một worker vắng mặt suốt một đêm sẽ tham gia lại ở vị trí hiện tại của nhóm và tỷ lệ chia đọc là 70/30 trở lại ngay từ lượt chạy đầu tiên — nó không hấp thụ mọi lượt chạy cho tới khi bắt kịp. Một worker đã sẵn sàng suốt thời gian đó vẫn bắt kịp, và đó chính là điều khiến tỷ lệ phần trăm của main trở thành mức trần.

### Một instance mới tham gia ở mức không

Một instance chưa từng được gán trọng số sẽ bắt đầu ở 0, nghĩa là nó sẽ ở trạng thái Live, Enabled nhưng không nhận được gì. **Tự động gán phần chia cho instance mới** — mặc định bật, nằm dưới bảng instances — khắc phục điều đó: trong lượt xử lý tiếp theo của leader, instance mới được gán một phần chia bằng nhau trong nhóm, và các trọng số hiện có được thu nhỏ lại trong khi giữ nguyên tỷ lệ với nhau, vì vậy một tỷ lệ 70/30 có chủ đích vẫn đọc là khoảng 70/30 sau đó. Tổng vẫn đúng bằng 100.

Việc này chạy **một lần cho mỗi instance**. Cả lượt tự động lẫn chỉnh sửa của chính bạn đều đánh dấu instance là đã được cấu hình, vì vậy một instance bạn tự đặt sẽ không bao giờ bị thay đổi sau lưng bạn — kể cả instance bạn cố ý đặt về 0. Hãy tắt thiết lập này nếu bạn muốn mọi máy mới chờ bạn cấu hình.

Chỉ các instance được bật, đang hoạt động và tương thích mới tham gia. Giao một phần chia cho một máy không thể thực thi bất cứ thứ gì sẽ khiến phần chia đó bị bỏ phí.
### Khi tỷ lệ phần trăm không thể giải quyết được vấn đề

Bảng cài đặt báo cáo có bao nhiêu lượt chạy trong 24 giờ qua chỉ có thể thực thi trên main. Nếu con số đó cao — khối lượng công việc nặng về Codex hoặc Drive — thì các worker sẽ ngồi không bất kể trọng số nói gì, và giải pháp là một instance main lớn hơn thay vì thêm nhiều instance main.

## Định cỡ PostgreSQL cho một cluster

Số lượng kết nối tăng theo số instance, không chỉ theo số người dùng. Mỗi instance chạy nhiều tiến trình uvicorn, và mỗi tiến trình giữ một connection pool cộng với bốn kết nối `LISTEN` (hủy bỏ, đánh thức hàng đợi, kết quả lượt chạy, luồng chat). Các luồng chat đang mở dùng chung một kết nối chat, nên chúng không làm tăng số kết nối cơ sở dữ liệu. Một cluster ba instance với `max_connections = 100` mặc định sẽ cạn kiệt, và Heym sau đó không thể kết nối tới chính cơ sở dữ liệu của nó.

Hãy tính toán khoảng `instances x processes x (async pool + sync pool + 4)` và đặt `max_connections` cao hơn con số đó.

Hãy thu nhỏ các pool thay vì chỉ nâng trần lên. Một triển khai đơn lẻ mặc định dùng 10+20 kết nối async và 5+10 kết nối sync cho mỗi tiến trình, con số này là thoải mái cho một máy nhưng quá nhiều đối với một cluster:

| Biến | Instance đơn lẻ | Cluster |
|---|---|---|
| `HEYM_DB_POOL_SIZE` | 10 | 3 |
| `HEYM_DB_MAX_OVERFLOW` | 20 | 5 |
| `HEYM_DB_SYNC_POOL_SIZE` | 5 | 2 |
| `HEYM_DB_SYNC_MAX_OVERFLOW` | 10 | 3 |

Tệp compose ví dụ đặt các giá trị đó và `max_connections = 300`. Điều đó đưa một cluster hai instance từ trần 768 kết nối xuống còn 192, với ba instance vẫn dưới 300.

## Những yêu cầu mà cluster không thể tự đảm bảo cho bạn

**Mọi instance phải dùng cùng `SECRET_KEY` và `ENCRYPTION_KEY`.** Một worker có `ENCRYPTION_KEY` khác sẽ không thể giải mã thông tin xác thực, và mọi lượt chạy dùng thông tin xác thực sẽ thất bại với một lỗi không nêu ra thông tin hữu ích nào. Heym so sánh một digest của cả hai khóa trên mỗi nhịp tim, cùng với phiên bản ứng dụng và bản sửa đổi cơ sở dữ liệu, và đánh dấu instance không khớp là **Mismatch** để nó không nhận bất kỳ công việc nào. Tải sẽ quay về main cho đến khi bạn khắc phục.

Điều đó cũng định nghĩa thứ tự nâng cấp. Nâng cấp main trước sẽ đánh dấu mọi worker là không tương thích; công việc quay về main, và mỗi worker sẽ tham gia lại khi được nâng cấp. Chậm hơn, dễ thấy, và có thể đảo ngược.

**Chỉ trỏ ingress vào instance main.** Việc luân chuyển lưu lượng người dùng qua các instance sẽ gửi một tệp tải lên tới một máy và tệp tải xuống của nó tới một máy khác. Không có gì trong mã ngăn chặn điều này, vì một worker chạy cùng image và sẽ trả lời bất kỳ yêu cầu nào nó nhận được.

**Mọi instance đều cần `FRONTEND_URL`, được đặt thành cùng địa chỉ công khai.** Một lượt chạy tạm dừng để con người xem xét sẽ tạo liên kết xem xét trên instance đã thực thi nó, không phải trên main, và điều tương tự cũng đúng với các liên kết theo dõi Codex và với URL tải xuống của các tệp được tạo ra. Một worker không có biến này sẽ tạo các liên kết đó dựa trên địa chỉ cục bộ của chính nó, và người nhận được một liên kết như vậy sẽ không thể mở nó.

**Các instance worker có địa chỉ IP ra khác.** Bất kỳ API nào có danh sách cho phép địa chỉ nguồn sẽ thấy địa chỉ mới. Các lượt chạy Send Email chạy trên main chính vì lý do này; đối với node HTTP, hoặc cấp cho cluster một địa chỉ NAT egress duy nhất, hoặc thêm mọi instance vào danh sách cho phép.

## Thêm một worker trên máy khác

`docker-compose.worker.yml` trong thư mục gốc của kho chạy một worker trên host riêng của nó. Nó không có cơ sở dữ liệu và không có giao diện người dùng: nó kết nối tới PostgreSQL của instance main và nhận phần việc của mình trong các lượt chạy nền.

Hãy điền vào một tệp `.env` bên cạnh nó — thẻ image, host và thông tin xác thực cơ sở dữ liệu, cả hai khóa, và một id instance — rồi khởi động nó. Compose sẽ từ chối khởi động cho đến khi mọi giá trị bắt buộc được đặt, thay vì khởi động với một giá trị giữ chỗ rồi thất bại sau đó theo cách khó đọc.

Thẻ image phải là phiên bản mà main đang chạy, và cả hai khóa phải được sao chép chính xác. Sự khác biệt ở một trong hai sẽ khiến worker hiển thị là Mismatch và nó không nhận được công việc nào.

## Đọc bảng Instances

| Cột | Ý nghĩa |
|---|---|
| Name | Nhãn có thể chỉnh sửa; nó được ghi vào mọi lượt chạy mà instance này thực thi |
| Role | `main` hoặc `worker`, lấy từ môi trường |
| Status | **Live** khi có nhịp tim mới, **Offline** sau 30 giây im lặng, **Mismatch** khi phiên bản, bản sửa đổi cơ sở dữ liệu hoặc các khóa khác với main |
| ms | Thời gian khứ hồi từ instance đó tới cơ sở dữ liệu, do chính instance đo |
| On | Đưa một worker ra khỏi vòng luân chuyển mà không dừng nó — các lượt thực thi đang chạy sẽ hoàn tất, không có lượt mới nào được gán. Luôn bật đối với instance main: công việc về tệp, plugin và coding-agent chạy ở đó bất kể công tắc nói gì |
| Weight | Phần chia của nó trong các lượt chạy có thể phân phối |

## Giới hạn đồng thời trong một cluster

[Giới hạn đồng thời](./webhooks.md#concurrency-limit-and-queued-runs) của một workflow được đếm trong PostgreSQL, do đó nó có hiệu lực trên mọi instance và mọi tiến trình: hai instance không bao giờ chạy nhiều lượt chạy của một workflow hơn mức giới hạn cho phép. Một lượt chạy đã chờ một vị trí sẽ được chỉ định theo cùng các quy tắc như bất kỳ lượt chạy nào khác khi bắt đầu, vì vậy một lượt chạy cần ở lại main vẫn sẽ ở đó. Queue worker thực thi các lượt chạy này hiện khởi động trên mọi bản cài đặt, bao gồm cả một instance đơn lẻ, nơi nó chỉ nhận các lượt chạy mà chính instance của nó đã xếp hàng. Điều đó có nghĩa là một instance đơn lẻ cũng giữ kết nối `LISTEN` đánh thức hàng đợi trong mỗi tiến trình; hãy dự trù kết nối của nó tương tự như một instance trong cluster.

## Lịch sử lượt chạy

Mọi lượt chạy trong lịch sử thực thi đều nêu tên instance đã thực thi nó, và cả hai hộp thoại lịch sử đều có thể lọc xuống một instance. Bộ lọc khớp theo id của instance trong khi hiển thị tên của nó, nên việc đổi tên một instance không viết lại những gì các lượt chạy cũ ghi lại.

Không có gì về điều này xuất hiện trên bản cài đặt một instance: các trường trống, không có nhãn nào được hiển thị, và không có bộ lọc nào được cung cấp.
## Hành vi khi lỗi

**Nếu một worker chết giữa lúc đang chạy**, heartbeat của nó trở nên cũ và cơ chế quét khôi phục hiện có của leader sẽ chạy lại execution trên một instance còn sống. Hàng đợi mà nó đã nhận sẽ được xử lý riêng: một khi không còn execution nào đang hoạt động cho hàng đó và đã qua hai phút ân hạn, leader sẽ đánh dấu hàng đó là thất bại và đánh thức bất kỳ ai đang chờ kết quả. Thời gian tồn tại đơn thuần không bao giờ là trigger, vì vậy một lượt chạy dài hợp lệ sẽ được để yên; và hàng đó bị đánh dấu thất bại thay vì đưa lại vào hàng đợi, bởi vì cơ chế khôi phục đã đảm nhận việc chạy lại và việc đưa lại vào hàng đợi sẽ khiến cùng một workflow chạy hai lần.

**Nếu main ngừng hoạt động**, cron vẫn tiếp tục kích hoạt từ một worker và các lượt chạy có thể phân phối vẫn tiếp tục thực thi. Các lượt chạy cần main sẽ xếp hàng và chờ, rồi được xử lý khi main trở lại — nhưng chỉ trong cửa sổ ân hạn misfire (`HEYM_CRON_MISFIRE_GRACE_SECONDS`, mặc định 600 giây). Bất kỳ thứ gì cũ hơn sẽ bị đóng với trạng thái bỏ qua, kèm lý do được ghi lại, thay vì phát lại hàng giờ tồn đọng cùng một lúc.

UI, API, MCP và editor không khả dụng khi main ngừng hoạt động, vì ingress trỏ tới đó.

## Liên quan

- [Chạy & Triển khai](../getting-started/running-and-deployment.md) – Triển khai một instance trước; các biến môi trường và thiết lập khóa nằm ở đó
- [Cài đặt](./user-settings.md) – Tab Instances, và ai có thể thấy nó
- [Traces](../tabs/traces-tab.md) – So sánh thời lượng chạy thực tế giữa các instance trước khi thay đổi cách phân chia
- [Bảo mật](./security.md) – Lý do mọi instance phải chia sẻ `SECRET_KEY` và `ENCRYPTION_KEY`
