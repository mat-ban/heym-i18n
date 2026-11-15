# Heym Incident Playbook (L0)

Sử dụng playbook này để xác nhận sự cố Heym, đánh giá tác động người dùng, chọn mức độ nghiêm trọng (severity) và tiếp cận đúng quy trình phục hồi cũng như người phụ trách.

Quy trình chi tiết: [Heym Runbook (L1)](./operations-runbook.md)

Xem xét lần cuối: 2026-11-10. Phạm vi: Heym self-hosted, phiên bản đơn lẻ hoặc cluster, trên Docker Compose hoặc Kubernetes.

## Bàn giao triển khai (Deployment handover)

Điền vào bảng này cho từng môi trường trước khi sử dụng các tài liệu này trong ca trực (on-call). Tên, URL, mục tiêu dung lượng và mục tiêu phục hồi mang tính đặc thù cho từng triển khai. Các ví dụ trong kho lưu trữ không phải là bản kiểm kê sản xuất.

| Mục | Giá trị triển khai |
| --- | --- |
| Môi trường và URL Heym công khai | `<environment>`, `<public-url>` |
| Trực ban nền tảng và người dự phòng | `<rotation-or-contact>`, `<backup-contact>` |
| Kênh sự cố và hệ thống theo dõi sự cố | `<channel>`, `<tracker-url>` |
| Trực ban cơ sở dữ liệu và mã định danh cơ sở dữ liệu | `<contact>`, `<database-id>` |
| Chủ sở hữu hạ tầng, mạng và lưu trữ | `<contacts>` |
| Người phụ trách phát hành và hệ thống triển khai | `<contact>`, `<deployment-url>` |
| Bảng điều khiển lỗi ứng dụng, độ trễ và tính khả dụng | `<dashboard-url>` |
| Bảng điều khiển CPU, bộ nhớ, đĩa và khởi động lại của máy chủ hoặc pod | `<dashboard-url>` |
| Bảng điều khiển kết nối, khóa, đĩa và sao chép PostgreSQL | `<dashboard-url>` |
| Nhật ký và backend trace OTel tùy chọn | `<logs-url>`, `<trace-url-or-disabled>` |
| Dự án/tệp Compose hoặc ngữ cảnh/namespace Kubernetes | `<exact-target>` |
| Vị trí main, worker, cơ sở dữ liệu và lưu trữ | `<services-or-deployments>`, `<storage-ids>` |
| Smoke workflow đã phê duyệt và kết quả dự kiến | `<workflow-id>`, `<safe-input>`, `<expected-result>` |
| Quy trình sao lưu cơ sở dữ liệu và tệp, lần thử nghiệm phục hồi gần nhất | `<procedure-url>`, `<test-date>` |
| Mục tiêu thời gian phục hồi và điểm phục hồi (RTO, RPO) | `<RTO>`, `<RPO>` |

Giữ thông tin liên hệ và liên kết bảng điều khiển trong bản sao vận hành bị hạn chế quyền truy cập của triển khai. Bằng chứng phải chứa ID, dấu thời gian, số lượng và các lỗi đã lọc sạch thay vì thông tin xác thực hoặc payload của workflow.

## Danh mục nền tảng

| Thành phần | Trách nhiệm | Ý nghĩa sự cố |
| --- | --- | --- |
| Frontend và main backend | UI, API, MCP, Portal, thực thi tương tác | Kiểm tra riêng biệt tuyến đường công khai và tiến trình main |
| PostgreSQL | Trạng thái ứng dụng, sổ đăng ký thực thi, run queue, khe đồng thời, điều phối và thông báo | Sự cố cơ sở dữ liệu có thể làm dừng cả việc xử lý yêu cầu và thực thi ngầm |
| Các phiên bản worker, khi bật chế độ cluster | Các lượt chạy nền đủ điều kiện trong hàng đợi | Worker khỏe mạnh không thay thế các endpoint công khai của main |
| Tiến trình leader được bầu | Cron, đánh giá cảnh báo, điều phối ngầm | Một worker tương thích có thể trở thành leader; điều này không đổi vai trò của nó thành main |
| Bộ lưu trữ bền vững của main | Tệp Drive, plugin đã cài đặt và không gian làm việc của coding-agent | Phục hồi lưu trữ cùng với main; định tuyến ingress tới worker không phục hồi được nó |
| Backend sandbox trên mỗi phiên bản thực thi | Vỏ bọc Docker hoặc Kubernetes pod cho việc thực thi cô lập | Backend sandbox gặp sự cố có thể ảnh hưởng đến các nút được chọn trong khi UI vẫn chạy |
| Các phụ thuộc của workflow | Nhà cung cấp mô hình, máy chủ MCP, API bên ngoài, kho dữ liệu và dịch vụ nhắn tin | Xác định xem một phụ thuộc hay toàn bộ nền tảng đang gặp sự cố |
| Bộ thu thập OTel tùy chọn | Các span công cụ Agent, nút và workflow được xuất | Chỉ riêng việc thiếu trace được xuất không chứng minh rằng quá trình thực thi thất bại |

Hàng đợi chạy tích hợp sẵn của Heym sử dụng PostgreSQL. Redis, RabbitMQ và kho lưu trữ vector có thể là phụ thuộc của workflow; chúng không phải là dịch vụ bắt buộc đối với hàng đợi tích hợp sẵn.

`GET /api/health` chỉ báo cáo tình trạng tiến trình và phiên bản. Nó không kiểm tra PostgreSQL, hàng đợi, bầu cử leader, dung lượng sandbox hay đồng bộ hóa thông tin xác thực. Phản hồi màu xanh lá cây là một kiểm tra đơn lẻ, không phải là đảm bảo sẵn sàng từ đầu đến cuối.

## Năm phút đầu tiên

| Bước | Hành động | Quyết định hoặc bằng chứng |
| --- | --- | --- |
| 1 | Xác nhận cảnh báo và xác minh môi trường, dịch vụ và thời gian bắt đầu | Ghi lại dấu thời gian UTC và thay đổi cấu hình/phát hành gần đây nhất |
| 2 | Kiểm tra UI công khai và `/api/health`, sau đó kiểm tra trực tiếp main backend | Lỗi công khai khi backend trực tiếp hoạt động tốt cho thấy sự cố định tuyến hoặc frontend |
| 3 | Kiểm tra kết nối PostgreSQL và áp lực vùng kết nối | Định tuyến lỗi cơ sở dữ liệu tới L1 trước khi khởi động lại các dịch vụ ứng dụng |
| 4 | Kiểm tra trạng thái vùng chứa/pod, CPU, bộ nhớ, lưu trữ và các lỗi gần đây | Tách biệt sự cố hạ tầng, quá tải và sự cố dành riêng cho workflow |
| 5 | Trong chế độ cluster, kiểm tra **Cài đặt > Phiên bản**, trạng thái hàng đợi và bằng chứng leader | Xác định việc mất main, worker ngoại tuyến/không khớp hoặc tác vụ chỉ dành cho main |
| 6 | Chỉ định mức độ nghiêm trọng và bắt đầu một biện pháp giảm thiểu từ bảng định tuyến | Đối với P1/P2, mở một sự cố và mời người phụ trách liên quan ngay lập tức |
| 7 | Xác minh một lượt chạy smoke workflow chế độ sản xuất an toàn và theo dõi phục hồi | Xác nhận tuổi hàng đợi, lỗi và tài nguyên được cải thiện; đặt thời gian cập nhật tiếp theo |

Nếu một bản phát hành trùng khớp với thời điểm xảy ra lỗi, hãy kiểm tra [Triển khai kém hoặc hồi quy cấu hình](./operations-runbook.md#bad-deployment-or-configuration-regression). Kiểm tra tính tương thích của giản đồ (schema) trước khi hoàn nguyên (rollback).

## Mức độ nghiêm trọng và phản hồi

Đây là các mục tiêu phản hồi ban đầu. Áp dụng chính sách sự cố và tác động kinh doanh của triển khai khi yêu cầu nghiêm ngặt hơn.

| Mức độ | Ví dụ | Phản hồi |
| --- | --- | --- |
| P1 | Main không khả dụng đối với tất cả người dùng; cơ sở dữ liệu không khả dụng hoặc lỗi ghi; lỗi thực thi diện rộng; tiếp nhận quan trọng bị gián đoạn trên các workflow | Giảm thiểu ngay lập tức, hồ sơ sự cố, trực ban nền tảng và phụ thuộc |
| P2 | Tồn đọng hàng đợi gia tăng; mất dung lượng worker; sắp cạn kiệt kết nối; một workflow làm suy giảm dung lượng dùng chung; OOM lặp lại | Bắt đầu giảm thiểu ngay lập tức, nhắm mục tiêu ngăn chặn trong 15 phút, hồ sơ sự cố |
| P3 | Lỗi workflow/nhà cung cấp cô lập; tác động hạn chế với dung lượng nền tảng ổn định | Chủ sở hữu workflow hoặc phụ thuộc, theo dõi tiếp theo và ghi chú trực ban |
| P4 | Tín hiệu thông tin, xu hướng dung lượng dự kiến, dương tính giả đã xác minh | Ghi nhận, lập tài liệu và điều chỉnh giám sát nếu cần |

## Định tuyến tín hiệu tới L1

Sử dụng các liên kết neo tương đối này khi định cấu hình liên kết cảnh báo. Khi dịch vụ giám sát cần một URL tuyệt đối, hãy thêm tiền tố là vị trí bản sao vận hành được lưu trữ của bạn.

| Tín hiệu | Bắt đầu tại đây |
| --- | --- |
| UI/API không khả dụng, 5xx công khai, kiểm tra tình trạng tiến trình thất bại | [UI hoặc API ngừng hoạt động](./operations-runbook.md#ui-or-api-down) |
| PostgreSQL không thể kết nối, từ chối kết nối, lỗi ghi | [Cơ sở dữ liệu ngừng hoạt động](./operations-runbook.md#postgresql-down-or-not-writable) |
| Quá nhiều máy khách, hết thời gian chờ nhóm kết nối, chờ khóa, đột biến kết nối hoạt động | [Kết nối cơ sở dữ liệu và khóa](./operations-runbook.md#active-db-connections-pool-saturation-and-locks) |
| Yêu cầu khởi động lại có kiểm soát backend/worker | [Khởi động lại dịch vụ](./operations-runbook.md#controlled-service-restart) |
| Đột biến số lần thực thi, tổng thời lượng, token, CPU hoặc bộ nhớ | [Các workflow tiêu tốn nhiều tài nguyên nhất](./operations-runbook.md#most-resource-consuming-workflows) |
| Hàng đợi tăng lên, các lượt chạy đang chờ hoặc dường như bị kẹt | [Tồn đọng hàng đợi](./operations-runbook.md#queue-backlog-or-apparently-stuck-runs) |
| Phiên bản Ngoại tuyến/Không khớp, worker không hoạt động, sự cố lập lịch hoặc phân phối | [Kiểm tra cluster](./operations-runbook.md#cluster-mode-checks) |
| Mất main trong khi các worker vẫn khỏe mạnh | [Phiên bản main không khả dụng](./operations-runbook.md#main-instance-unavailable-while-workers-are-live) |
| Lỗi webhook, lỗi MCP/Portal, ngắt kết nối SSE | [Điểm cuối ingress và thực thi](./operations-runbook.md#webhook-mcp-portal-or-streaming-failures) |
| OOM, CrashLoop, Pending, đầy đĩa, lỗi persistent volume | [Sự cố vùng chứa, pod hoặc lưu trữ](./operations-runbook.md#container-pod-oom-or-storage-issue) |
| Gia tăng lỗi sau khi thay đổi image, môi trường hoặc giản đồ | [Triển khai kém](./operations-runbook.md#bad-deployment-or-configuration-regression) |
| Lỗi nhà cung cấp Agent/LLM/MCP, 429, lỗi thông tin xác thực | [Lỗi mô hình hoặc tích hợp](./operations-runbook.md#model-credential-or-integration-failure) |
| Lỗi sandbox Code/Playwright/skill/coding-agent | [Lỗi sandbox](./operations-runbook.md#sandbox-failure) |
| Phục hồi không thể đáp ứng mục tiêu; mất cơ sở dữ liệu hoặc tệp | [Phục hồi và ứng phó thảm họa](./operations-runbook.md#recovery-and-disaster-response) |

## Báo cáo leo thang (Escalation)

| Phát hiện | Mời vào | Cung cấp |
| --- | --- | --- |
| Nhiều bề mặt hoặc workflow bị ảnh hưởng | Trực ban nền tảng và trưởng nhóm xử lý sự cố | Môi trường, phạm vi, thời gian bắt đầu, giảm thiểu, cập nhật tiếp theo |
| Cơ sở dữ liệu không khả dụng, bão hòa, bị khóa hoặc hết đĩa | Trực ban cơ sở dữ liệu | ID cơ sở dữ liệu, số lượng kết nối, PID chặn, lỗi đã lọc sạch, trạng thái lưu trữ |
| Sự cố pod/nút, gắn kết lưu trữ, dung lượng sandbox | Chủ sở hữu hạ tầng/lưu trữ | Ngữ cảnh, namespace, khối lượng công việc, sự kiện pod, áp lực tài nguyên |
| Tuyến công khai lỗi trong khi backend trực tiếp hoạt động | Chủ sở hữu mạng/ingress | Các tuyến bị ảnh hưởng, mã trạng thái, độ trễ, so sánh backend |
| Một workflow duy nhất chiếm lĩnh tải hoặc tự thất bại | Chủ sở hữu workflow | ID workflow/lượt chạy, nguồn trigger, tỷ lệ, khoảng thời gian, giới hạn tạm thời |
| Thay đổi cấu hình/triển khai có tương quan | Chủ sở hữu bản phát hành | Mã băm image đang chạy, thời gian rollout, bản sửa đổi giản đồ, bản phát hành tốt gần nhất |
| Hạn ngạch/xác thực/tính khả dụng của nhà cung cấp | Chủ sở hữu thông tin xác thực hoặc tích hợp | Nhà cung cấp, mô hình/dịch vụ, mã trạng thái, ID yêu cầu nếu an toàn; không có giá trị bí mật |

Nếu tác động P1/P2 vẫn tiếp diễn sau lần giảm thiểu đầu tiên, hãy báo cáo leo thang ngay lập tức với các bằng chứng đã thu thập. Không chờ đợi phân tích nguyên nhân gốc rễ hoàn chỉnh.

## Dự đoán sự cố

| Sự cố | Điều gì có thể tiếp tục | Hành động đầu tiên |
| --- | --- | --- |
| PostgreSQL không khả dụng | Frontend tĩnh vẫn có thể tải | Khôi phục đường dẫn cơ sở dữ liệu; không khởi động lại mọi phiên bản ứng dụng |
| Main không khả dụng, worker khỏe mạnh | Công việc nền và lập lịch hợp lệ có thể tiếp tục nếu một worker tương thích làm leader | Khôi phục main cùng với bộ lưu trữ bền vững của nó; UI/API/MCP/Portal công khai vẫn không khả dụng |
| Worker không khả dụng | Các phiên bản hợp lệ khác tiếp nhận công việc trong hàng đợi khi được chỉ định lại | Kiểm tra vị trí đặt, dung lượng dự phòng và phục hồi trước khi thêm lưu lượng |
| Lượt chạy bị gián đoạn | Các lượt chạy đủ điều kiện có thể phục hồi có thể khởi động lại từ đầu, một lần duy nhất | Kiểm tra tính năng tự động phục hồi và tác dụng phụ bên ngoài trước khi phát lại thủ công |
| Quá tải tác vụ chỉ dành cho main | Các worker có thể tiếp tục nhàn rỗi | Giảm lượng tiếp nhận vi phạm hoặc tăng dung lượng main; thay đổi trọng số không thể di chuyển công việc đã ghim |
| Cảnh báo nội bộ không khả dụng | Giám sát thời gian hoạt động/DB/hạ tầng bên ngoài vẫn có thể hoạt động | Sử dụng giám sát bên ngoài Heym; cảnh báo Heym phụ thuộc vào cùng DB và bộ lập lịch |
| Sandbox hoặc nhà cung cấp không khả dụng | Các workflow không có phụ thuộc đó có thể hoạt động | Cách ly các workflow bị ảnh hưởng và sửa chữa phụ thuộc |

## Phục hồi và kết thúc sự cố

1. Xác minh quyền truy cập công khai, quyền truy cập cơ sở dữ liệu, tính đủ điều kiện của phiên bản dự kiến và smoke workflow chế độ sản xuất an toàn. Thử nghiệm trên trình soạn thảo không chứng minh được việc điều phối đến worker.
2. Quan sát ít nhất 10 phút về các lỗi ổn định, độ trễ, mức sử dụng tài nguyên và tuổi hàng đợi giảm dần. Đồng thời quan sát lịch trình quan trọng tiếp theo dự kiến hoặc một kiểm tra smoke tương đương đã thỏa thuận.
3. Đối chiếu các lượt chạy thất bại, đã phục hồi, bị bỏ qua, hết hạn và đang chờ xử lý với chủ sở hữu workflow. Kiểm tra các tác dụng phụ bên ngoài trước khi phát lại bất kỳ điều gì.
4. Khôi phục dần dần các lần tạm dừng trigger tạm thời, giới hạn và trọng số worker. Gán chủ sở hữu và thời gian hết hạn cho mỗi hạn chế còn lại.
5. Cập nhật sự cố với tác động, dòng thời gian UTC, hành động, bằng chứng và các rủi ro tồn đọng. Chỉ định đánh giá nguyên nhân gốc rễ cho P1/P2 và cập nhật cả hai tài liệu nếu thiếu một quy trình.

## Tài liệu tham khảo vận hành liên quan

- [Thiết lập lệnh L1 và các kiểm tra](./operations-runbook.md#command-setup)
- [Vận hành và triển khai](../getting-started/running-and-deployment.md)
- [Phân phối tải](./cluster.md)
- [Triển khai Kubernetes](../getting-started/kubernetes.md)
- [Bảo mật và xoay vòng khóa](./security.md)
